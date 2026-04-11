const Router = require('koa-router');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { adminAuth } = require('../middlewares/auth');
const {
  Merchant,
  RechargeOrder,
  ExchangeOrder,
  Gift,
  MerchantPoint,
  Application
} = require('../models');

const router = new Router({ prefix: '/api/admin' });

// 管理员登录
router.post('/login', async ctx => {
  const { username, password } = ctx.request.body;

  if (!username || !password) {
    ctx.body = { code: 1, message: '请输入用户名和密码', data: null };
    return;
  }

  const admin = await require('../models').Admin.findOne({ where: { username } });
  if (!admin) {
    ctx.body = { code: 1, message: '用户名或密码错误', data: null };
    return;
  }

  if (!bcrypt.compareSync(password, admin.password)) {
    ctx.body = { code: 1, message: '用户名或密码错误', data: null };
    return;
  }

  const token = generateToken({ adminId: admin.id, username: admin.username });

  ctx.body = {
    code: 0,
    message: '登录成功',
    data: {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        nickname: admin.nickname
      }
    }
  };
});

// 获取待审核商家列表
router.get('/merchants/pending', adminAuth, async ctx => {
  const { page = 1, pageSize = 10 } = ctx.query;
  const offset = (page - 1) * pageSize;

  const { count, rows } = await Merchant.findAndCountAll({
    where: { status: 0 },
    order: [['createdAt', 'desc']],
    offset: Number(offset),
    limit: Number(pageSize)
  });

  ctx.body = {
    code: 0,
    message: 'ok',
    data: { list: rows, total: count, page: Number(page), pageSize: Number(pageSize) }
  };
});

// 获取所有商家列表
router.get('/merchants', adminAuth, async ctx => {
  const { page = 1, pageSize = 10, status } = ctx.query;
  const offset = (page - 1) * pageSize;
  const where = {};
  if (status !== undefined) where.status = Number(status);

  const { count, rows } = await Merchant.findAndCountAll({
    where,
    order: [['createdAt', 'desc']],
    offset: Number(offset),
    limit: Number(pageSize)
  });

  ctx.body = {
    code: 0,
    message: 'ok',
    data: { list: rows, total: count, page: Number(page), pageSize: Number(pageSize) }
  };
});

// 审核商家通过
router.post('/merchants/:id/approve', adminAuth, async ctx => {
  const { id } = ctx.params;

  const merchant = await Merchant.findByPk(Number(id));
  if (!merchant) {
    ctx.body = { code: 1, message: '商家不存在', data: null };
    return;
  }

  if (merchant.status !== 0) {
    ctx.body = { code: 1, message: '商家已审核', data: null };
    return;
  }

  merchant.status = 1;
  await merchant.save();

  ctx.body = { code: 0, message: '审核通过', data: null };
});

// 拒绝商家申请
router.post('/merchants/:id/reject', adminAuth, async ctx => {
  const { id } = ctx.params;

  const merchant = await Merchant.findByPk(Number(id));
  if (!merchant) {
    ctx.body = { code: 1, message: '商家不存在', data: null };
    return;
  }

  merchant.status = 2;
  await merchant.save();

  ctx.body = { code: 0, message: '已拒绝', data: null };
});

// 获取平台统计数据
router.get('/stats', adminAuth, async ctx => {
  const totalMerchants = await Merchant.count();
  const pendingMerchants = await Merchant.count({ where: { status: 0 } });
  const approvedMerchants = await Merchant.count({ where: { status: 1 } });
  const totalRechargeOrders = await RechargeOrder.count({ where: { status: 1 } });
  const pendingApplications = await Application.count({ where: { status: 0 } });
  const totalGifts = await Gift.count({ where: { status: 1 } });
  const pendingExchangeOrders = await ExchangeOrder.count({ where: { status: 0 } });

  // 总充值金额
  const totalRechargeAmount = await RechargeOrder.sum('amount', { where: { status: 1 } }) || 0;

  // 总积分发放
  const totalPoints = await MerchantPoint.sum('balance') || 0;

  ctx.body = {
    code: 0,
    message: 'ok',
    data: {
      totalUsers: 0,
      totalMerchants,
      approvedMerchants,
      pendingApplications,
      totalProducts: totalGifts,
      pendingExchangeOrders,
      totalPointsIssued: totalPoints,
      totalPointsExchanged: 0,
      totalRechargeOrders,
      totalRechargeAmount,
      totalPoints
    }
  };
});

// ============== 加盟申请管理 ==============

// 获取加盟申请列表
router.get('/applications', adminAuth, async ctx => {
  const { page = 1, pageSize = 10, status } = ctx.query;
  const offset = (page - 1) * pageSize;
  const where = {};
  if (status !== undefined) where.status = Number(status);

  const { count, rows } = await Application.findAndCountAll({
    where,
    order: [['created_at', 'desc']],
    offset: Number(offset),
    limit: Number(pageSize)
  });

  // 转换字段名适配前端类型
  const list = rows.map(app => {
    const obj = app.toJSON();
    return {
      id: obj.id,
      name: obj.shopName,
      contactName: obj.contactName,
      contactPhone: obj.contactPhone,
      email: obj.email,
      provinceCode: obj.provinceCode,
      cityCode: obj.cityCode,
      districtCode: obj.districtCode,
      address: obj.address,
      traffic: obj.traffic,
      status: obj.status === 0 ? 'PENDING' : 'APPROVED',
      businessLicense: '',
      remark: null,
      merchantId: null,
      createdAt: obj.created_at,
      updatedAt: obj.updated_at
    };
  });

  ctx.body = {
    code: 0,
    message: 'ok',
    data: { applications: list, total: count, page: Number(page), pageSize: Number(pageSize) }
  };
});

// 标记加盟申请已处理
router.post('/applications/:id/process', adminAuth, async ctx => {
  const { id } = ctx.params;

  const application = await Application.findByPk(Number(id));
  if (!application) {
    ctx.body = { code: 1, message: '申请不存在', data: null };
    return;
  }

  application.status = 1;
  await application.save();

  ctx.body = { code: 0, message: '标记已处理成功', data: null };
});

// 删除加盟申请
router.delete('/applications/:id', adminAuth, async ctx => {
  const { id } = ctx.params;

  const application = await Application.findByPk(Number(id));
  if (!application) {
    ctx.body = { code: 1, message: '申请不存在', data: null };
    return;
  }

  await application.destroy();

  ctx.body = { code: 0, message: '删除成功', data: null };
});

// ============== 礼品管理 ==============

// 获取礼品列表
router.get('/gifts', adminAuth, async ctx => {
  const { page = 1, pageSize = 10, status } = ctx.query;
  const offset = (page - 1) * pageSize;
  const where = {};
  if (status !== undefined) where.status = Number(status);

  const { count, rows } = await Gift.findAndCountAll({
    where,
    order: [['createdAt', 'desc']],
    offset: Number(offset),
    limit: Number(pageSize)
  });

  ctx.body = {
    code: 0,
    message: 'ok',
    data: { list: rows, total: count, page: Number(page), pageSize: Number(pageSize) }
  };
});

// 创建礼品
router.post('/gifts', adminAuth, async ctx => {
  const { name, description, points, price, stock, image } = ctx.request.body;

  if (!name || !points || !price) {
    ctx.body = { code: 1, message: '缺少必填字段', data: null };
    return;
  }

  const gift = await Gift.create({
    name,
    description,
    points,
    price,
    stock: stock || 0,
    image,
    status: 1
  });

  ctx.body = { code: 0, message: '创建成功', data: gift };
});

// 更新礼品
router.put('/gifts/:id', adminAuth, async ctx => {
  const { id } = ctx.params;
  const { name, description, points, price, stock, image, status } = ctx.request.body;

  const gift = await Gift.findByPk(Number(id));
  if (!gift) {
    ctx.body = { code: 1, message: '礼品不存在', data: null };
    return;
  }

  if (name !== undefined) gift.name = name;
  if (description !== undefined) gift.description = description;
  if (points !== undefined) gift.points = points;
  if (price !== undefined) gift.price = price;
  if (stock !== undefined) gift.stock = stock;
  if (image !== undefined) gift.image = image;
  if (status !== undefined) gift.status = status;

  await gift.save();

  ctx.body = { code: 0, message: '更新成功', data: gift };
});

// 删除礼品
router.delete('/gifts/:id', adminAuth, async ctx => {
  const { id } = ctx.params;

  const gift = await Gift.findByPk(Number(id));
  if (!gift) {
    ctx.body = { code: 1, message: '礼品不存在', data: null };
    return;
  }

  await gift.destroy();

  ctx.body = { code: 0, message: '删除成功', data: null };
});

// ============== 兑换订单管理 ==============

router.get('/exchange-orders', adminAuth, async ctx => {
  const { page = 1, pageSize = 10, status } = ctx.query;
  const offset = (page - 1) * pageSize;
  const where = {};
  if (status !== undefined) where.status = Number(status);

  const { count, rows } = await ExchangeOrder.findAndCountAll({
    where,
    order: [['createdAt', 'desc']],
    offset: Number(offset),
    limit: Number(pageSize),
    include: ['gift']
  });

  ctx.body = {
    code: 0,
    message: 'ok',
    data: { list: rows, total: count, page: Number(page), pageSize: Number(pageSize) }
  };
});

module.exports = router;
