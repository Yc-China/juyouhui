const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { merchantAuth } = require('../middlewares/auth');
const { generateOrderNo } = require('../utils/order');
const {
  Merchant,
  Store,
  MerchantPoint,
  RechargeOrder,
  PointLog,
  Application
} = require('../models');

const router = new Router({ prefix: '/api/merchant' });

// 商家注册/入驻申请
router.post('/register', async ctx => {
  const {
    name,
    legalPerson,
    phone,
    password,
    idCard,
    businessLicense
  } = ctx.request.body;

  if (!name || !phone || !password) {
    ctx.body = { code: 1, message: '缺少必填字段', data: null };
    return;
  }

  // 检查手机号是否已注册
  const exist = await Merchant.findOne({ where: { phone } });
  if (exist) {
    ctx.body = { code: 1, message: '该手机号已注册', data: null };
    return;
  }

  // 加密密码
  const hashPassword = bcrypt.hashSync(password, 10);

  // 创建商家
  const merchant = await Merchant.create({
    name,
    legalPerson,
    phone,
    password: hashPassword,
    idCard,
    businessLicense,
    status: 0, // 待审核
    depositPaid: false
  });

  // 创建积分账户
  await MerchantPoint.create({
    merchantId: merchant.id,
    balance: 0,
    totalRecharge: 0,
    totalConsumed: 0
  });

  ctx.body = {
    code: 0,
    message: '入驻申请已提交，请等待审核',
    data: {
      id: merchant.id,
      name: merchant.name,
      phone: merchant.phone
    }
  };
});

// 商家登录
router.post('/login', async ctx => {
  const { phone, password } = ctx.request.body;

  if (!phone || !password) {
    ctx.body = { code: 1, message: '请输入手机号和密码', data: null };
    return;
  }

  const merchant = await Merchant.findOne({ where: { phone } });
  if (!merchant) {
    ctx.body = { code: 1, message: '账号不存在', data: null };
    return;
  }

  if (!bcrypt.compareSync(password, merchant.password)) {
    ctx.body = { code: 1, message: '密码错误', data: null };
    return;
  }

  if (merchant.status !== 1) {
    ctx.body = { code: 1, message: '账号尚未审核通过，请等待', data: null };
    return;
  }

  const token = generateToken({ merchantId: merchant.id, phone: merchant.phone });

  ctx.body = {
    code: 0,
    message: '登录成功',
    data: {
      token,
      merchant: {
        id: merchant.id,
        name: merchant.name,
        phone: merchant.phone,
        status: merchant.status,
        depositPaid: merchant.depositPaid
      }
    }
  };
});

// 获取商家信息（需要登录）
router.get('/info', merchantAuth, async ctx => {
  const merchant = await Merchant.findByPk(ctx.state.merchantId, {
    attributes: ['id', 'name', 'legalPerson', 'phone', 'idCard', 'businessLicense', 'depositAmount', 'depositPaid', 'status', 'createdAt']
  });

  const point = await MerchantPoint.findOne({ where: { merchantId: ctx.state.merchantId } });

  ctx.body = {
    code: 0,
    message: 'ok',
    data: {
      merchant,
      points: {
        balance: point?.balance || 0,
        totalRecharge: point?.totalRecharge || 0
      }
    }
  };
});

// 获取门店列表
router.get('/stores', merchantAuth, async ctx => {
  const stores = await Store.findAll({
    where: { merchantId: ctx.state.merchantId },
    order: [['id', 'desc']]
  });

  ctx.body = { code: 0, message: 'ok', data: stores };
});

// 添加门店
router.post('/stores', merchantAuth, async ctx => {
  const { name, address, phone } = ctx.request.body;

  if (!name) {
    ctx.body = { code: 1, message: '门店名称不能为空', data: null };
    return;
  }

  const store = await Store.create({
    merchantId: ctx.state.merchantId,
    name,
    address,
    phone,
    status: 1
  });

  ctx.body = { code: 0, message: '添加成功', data: store };
});

// 更新门店
router.put('/stores/:id', merchantAuth, async ctx => {
  const { id } = ctx.params;
  const { name, address, phone, status } = ctx.request.body;

  const store = await Store.findOne({ where: { id, merchantId: ctx.state.merchantId } });
  if (!store) {
    ctx.body = { code: 1, message: '门店不存在', data: null };
    return;
  }

  if (name) store.name = name;
  if (address !== undefined) store.address = address;
  if (phone !== undefined) store.phone = phone;
  if (status !== undefined) store.status = status;

  await store.save();

  ctx.body = { code: 0, message: '更新成功', data: store };
});

// 删除门店
router.delete('/stores/:id', merchantAuth, async ctx => {
  const { id } = ctx.params;

  const store = await Store.findOne({ where: { id, merchantId: ctx.state.merchantId } });
  if (!store) {
    ctx.body = { code: 1, message: '门店不存在', data: null };
    return;
  }

  await store.destroy();

  ctx.body = { code: 0, message: '删除成功', data: null };
});

// 创建充值订单
router.post('/recharge', merchantAuth, async ctx => {
  const { points } = ctx.request.body;

  if (!points || points <= 0) {
    ctx.body = { code: 1, message: '积分数量必须大于0', data: null };
    return;
  }

  const merchant = await Merchant.findByPk(ctx.state.merchantId);
  if (merchant.status !== 1) {
    ctx.body = { code: 1, message: '账号未审核通过', data: null };
    return;
  }

  // 1分钱 = 1积分
  const amount = points / 100;
  const orderNo = generateOrderNo('R');

  const order = await RechargeOrder.create({
    orderNo,
    merchantId: ctx.state.merchantId,
    points,
    amount,
    status: 0
  });

  ctx.body = {
    code: 0,
    message: '订单创建成功',
    data: {
      orderNo: order.orderNo,
      amount: order.amount,
      points: order.points
    }
  };
});

// 获取充值订单列表
router.get('/recharge/orders', merchantAuth, async ctx => {
  const { page = 1, pageSize = 10 } = ctx.query;
  const offset = (page - 1) * pageSize;

  const { count, rows } = await RechargeOrder.findAndCountAll({
    where: { merchantId: ctx.state.merchantId },
    order: [['createdAt', 'desc']],
    offset: Number(offset),
    limit: Number(pageSize)
  });

  ctx.body = {
    code: 0,
    message: 'ok',
    data: {
      list: rows,
      total: count,
      page: Number(page),
      pageSize: Number(pageSize)
    }
  };
});

// 给用户发放积分
router.post('/grant-points', merchantAuth, async ctx => {
  const { phone, points, storeId } = ctx.request.body;

  if (!phone || !points || points <= 0) {
    ctx.body = { code: 1, message: '参数错误', data: null };
    return;
  }

  // 检查商家积分余额
  const merchantPoint = await MerchantPoint.findOne({ where: { merchantId: ctx.state.merchantId } });
  if (!merchantPoint || merchantPoint.balance < points) {
    ctx.body = { code: 1, message: '积分余额不足，请先充值', data: null };
    return;
  }

  const merchant = await Merchant.findByPk(ctx.state.merchantId);
  if (merchant.status !== 1) {
    ctx.body = { code: 1, message: '账号未审核通过', data: null };
    return;
  }

  // 查找或创建用户
  let user = await require('../models').User.findOne({ where: { phone } });
  if (!user) {
    user = await require('../models').User.create({ phone });
    await require('../models').UserPoint.create({ userId: user.id, balance: 0, totalEarned: 0, totalSpent: 0 });
  }

  const userPoint = await require('../models').UserPoint.findOne({ where: { userId: user.id } });

  // 扣减商家积分
  await merchantPoint.decrement('balance', { by: points });
  await merchantPoint.increment('totalConsumed', { by: points });
  await merchantPoint.save();

  // 增加用户积分
  await userPoint.increment('balance', { by: points });
  await userPoint.increment('totalEarned', { by: points });
  await userPoint.save();

  // 记录积分流水，积分有效期一年
  const expireAt = new Date();
  expireAt.setFullYear(expireAt.getFullYear() + 1);

  await PointLog.create({
    userId: user.id,
    merchantId: ctx.state.merchantId,
    storeId: storeId || null,
    points,
    type: 1, // 商家发放
    balance: userPoint.balance + points,
    expireAt,
    remark: `商家${merchant.name}发放积分`
  });

  ctx.body = {
    code: 0,
    message: `成功发放 ${points} 积分给用户 ${phone}`,
    data: {
      userPhone: phone,
      grantedPoints: points,
      merchantBalance: merchantPoint.balance - points,
      userBalance: userPoint.balance + points
    }
  };
});

// 获取商家首页数据统计
router.get('/dashboard', merchantAuth, async ctx => {
  const merchantId = ctx.state.merchantId;

  const point = await MerchantPoint.findOne({ where: { merchantId } });
  const storeCount = await Store.count({ where: { merchantId } });
  const rechargeCount = await RechargeOrder.count({ where: { merchantId, status: 1 } });

  // 统计今日发放积分
  const dayjs = require('dayjs');
  const todayStart = dayjs().startOf('day').toDate();
  const todayEnd = dayjs().endOf('day').toDate();

  const PointLog = require('../models').PointLog;
  const todayGranted = await PointLog.sum('points', {
    where: {
      merchantId,
      type: 1,
      createdAt: {
        [require('sequelize').Op.between]: [todayStart, todayEnd]
      }
    }
  }) || 0;

  ctx.body = {
    code: 0,
    message: 'ok',
    data: {
      balance: point?.balance || 0,
      totalRecharge: point?.totalRecharge || 0,
      totalConsumed: point?.totalConsumed || 0,
      storeCount,
      rechargeCount,
      todayGranted
    }
  };
});

// 官网加盟申请提交（无需登录）
router.post('/application', async ctx => {
  // 兼容多种前端字段名：
  // 前端 landing 使用 shopName/contactName/contactEmail
  const {
    // landing 字段
    shopName,
    contactName,
    contactPhone,
    contactEmail,
    provinceCode,
    cityCode,
    districtCode,
    address,
    traffic,
    // 兼容原有注册字段
    name,
    phone,
    email
  } = ctx.request.body;

  // 使用 landing 字段，如果不存在则用注册字段
  const finalShopName = shopName || name || '';
  const finalContactName = contactName || '';
  const finalContactPhone = contactPhone || phone || '';
  const finalEmail = contactEmail || email || '';

  if (!finalShopName || !finalContactName || !finalContactPhone) {
    ctx.body = { code: 1, message: '缺少必填字段', data: null };
    return;
  }

  // 创建加盟申请
  const application = await Application.create({
    shopName: finalShopName,
    contactName: finalContactName,
    contactPhone: finalContactPhone,
    email: finalEmail,
    provinceCode: provinceCode || '',
    cityCode: cityCode || '',
    districtCode: districtCode || '',
    address: address || '',
    traffic: traffic || '',
    status: 0 // 待处理
  });

  ctx.body = {
    code: 0,
    message: '加盟申请提交成功，我们会尽快与您联系',
    data: {
      id: application.id
    }
  };
});

module.exports = router;
