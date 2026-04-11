"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApplicationStatus = exports.getPointRecords = exports.addPointsToUser = exports.getRechargeRecords = exports.mockPayRecharge = exports.createRecharge = exports.getProfile = exports.submitApplication = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const utils_1 = require("../utils");
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const DEPOSIT_AMOUNT = 50000; // 500元 = 50000分
// 商家登录
const login = async (req, res) => {
    try {
        const { contactPhone, password } = req.body;
        if (!contactPhone || !password) {
            return res.json((0, utils_1.error)('手机号和密码不能为空'));
        }
        const merchant = await client_1.default.merchant.findFirst({
            where: { contactPhone }
        });
        if (!merchant) {
            return res.json((0, utils_1.error)('商家不存在'));
        }
        if (merchant.status !== 'APPROVED') {
            return res.json((0, utils_1.error)('商家未审核通过或已被禁用'));
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, merchant.passwordHash);
        if (!isValidPassword) {
            return res.json((0, utils_1.error)('密码错误'));
        }
        const token = jsonwebtoken_1.default.sign({ id: merchant.id, type: 'merchant' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return res.json((0, utils_1.success)({
            token,
            merchant: {
                id: merchant.id,
                name: merchant.name,
                contactName: merchant.contactName,
                contactPhone: merchant.contactPhone,
                address: merchant.address,
                balancePoints: merchant.balancePoints,
                deposit: merchant.deposit,
                pointRule: merchant.pointRule,
                status: merchant.status
            }
        }, '登录成功'));
    }
    catch (err) {
        console.error('商家登录错误:', err);
        return res.json((0, utils_1.error)('登录失败'));
    }
};
exports.login = login;
// 提交入驻申请
const submitApplication = async (req, res) => {
    try {
        const { name, contactName, contactPhone, address, businessLicense, password } = req.body;
        if (!name || !contactName || !contactPhone || !address || !businessLicense || !password) {
            return res.json((0, utils_1.error)('请填写完整信息'));
        }
        // 检查手机号是否已注册
        const existingMerchant = await client_1.default.merchant.findFirst({
            where: { contactPhone }
        });
        if (existingMerchant) {
            return res.json((0, utils_1.error)('该手机号已注册'));
        }
        // 检查是否已有待处理申请
        const pendingApplication = await client_1.default.merchantApplication.findFirst({
            where: {
                contactPhone,
                status: 'PENDING'
            }
        });
        if (pendingApplication) {
            return res.json((0, utils_1.error)('已有待审核的申请，请等待审核'));
        }
        // 创建申请
        const application = await client_1.default.merchantApplication.create({
            data: {
                name,
                contactName,
                contactPhone,
                address,
                businessLicense,
                status: 'PENDING'
            }
        });
        return res.json((0, utils_1.success)(application, '申请提交成功，请等待审核'));
    }
    catch (err) {
        console.error('提交入驻申请错误:', err);
        return res.json((0, utils_1.error)('提交失败'));
    }
};
exports.submitApplication = submitApplication;
// 获取商家信息
const getProfile = async (req, res) => {
    try {
        const merchantId = req.merchant?.id;
        if (!merchantId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const merchant = await client_1.default.merchant.findUnique({
            where: { id: merchantId },
            select: {
                id: true,
                name: true,
                contactName: true,
                contactPhone: true,
                address: true,
                businessLicense: true,
                deposit: true,
                balancePoints: true,
                pointRule: true,
                status: true,
                createdAt: true
            }
        });
        return res.json((0, utils_1.success)(merchant));
    }
    catch (err) {
        console.error('获取商家信息错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getProfile = getProfile;
// 创建充值订单
const createRecharge = async (req, res) => {
    try {
        const merchantId = req.merchant?.id;
        if (!merchantId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.json((0, utils_1.error)('请输入正确的充值金额'));
        }
        // amount 单位：元，转为分
        const amountInCent = Math.round(amount * 100);
        const points = amountInCent; // 1分钱 = 1积分
        const orderNo = (0, utils_1.generateOrderNo)('RC');
        const recharge = await client_1.default.merchantRecharge.create({
            data: {
                merchantId,
                amount: amountInCent,
                points,
                orderNo,
                status: 'PENDING'
            }
        });
        // TODO: 实际开发中这里需要调用支付接口生成支付链接/二维码
        // 这里简化处理，直接标记为已支付
        return res.json((0, utils_1.success)({
            recharge,
            orderNo,
            amount: amountInCent / 100,
            points
        }, '充值订单创建成功，请完成支付'));
    }
    catch (err) {
        console.error('创建充值订单错误:', err);
        return res.json((0, utils_1.error)('创建失败'));
    }
};
exports.createRecharge = createRecharge;
// 模拟支付成功（实际开发中由支付回调处理）
const mockPayRecharge = async (req, res) => {
    try {
        const merchantId = req.merchant?.id;
        if (!merchantId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { rechargeId } = req.params;
        const recharge = await client_1.default.merchantRecharge.findUnique({
            where: { id: Number(rechargeId) }
        });
        if (!recharge) {
            return res.json((0, utils_1.error)('充值订单不存在'));
        }
        if (recharge.merchantId !== merchantId) {
            return res.json((0, utils_1.error)('无权操作此订单'));
        }
        if (recharge.status === 'PAID') {
            return res.json((0, utils_1.error)('订单已支付'));
        }
        // 更新充值状态并增加商家积分余额
        await client_1.default.$transaction(async (tx) => {
            await tx.merchantRecharge.update({
                where: { id: recharge.id },
                data: {
                    status: 'PAID',
                    paidAt: new Date()
                }
            });
            await tx.merchant.update({
                where: { id: merchantId },
                data: {
                    balancePoints: {
                        increment: recharge.points
                    }
                }
            });
        });
        return res.json((0, utils_1.success)(null, '支付成功'));
    }
    catch (err) {
        console.error('支付处理错误:', err);
        return res.json((0, utils_1.error)('处理失败'));
    }
};
exports.mockPayRecharge = mockPayRecharge;
// 获取充值记录
const getRechargeRecords = async (req, res) => {
    try {
        const merchantId = req.merchant?.id;
        if (!merchantId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const [records, total] = await Promise.all([
            client_1.default.merchantRecharge.findMany({
                where: { merchantId },
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' }
            }),
            client_1.default.merchantRecharge.count({ where: { merchantId } })
        ]);
        return res.json((0, utils_1.success)({
            records,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        }));
    }
    catch (err) {
        console.error('获取充值记录错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getRechargeRecords = getRechargeRecords;
// 给用户增加积分
const addPointsToUser = async (req, res) => {
    try {
        const merchantId = req.merchant?.id;
        if (!merchantId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { userId, consumptionAmount, orderNo } = req.body;
        if (!userId || !consumptionAmount || consumptionAmount <= 0) {
            return res.json((0, utils_1.error)('请输入正确的用户ID和消费金额'));
        }
        // 检查商家余额是否足够
        const merchant = await client_1.default.merchant.findUnique({
            where: { id: merchantId }
        });
        if (!merchant) {
            return res.json((0, utils_1.error)('商家不存在'));
        }
        // 根据规则计算应发放积分
        const consumptionInCent = Math.round(consumptionAmount * 100);
        const pointsToAdd = (0, utils_1.calculatePoints)(consumptionInCent, merchant.pointRule);
        if (pointsToAdd <= 0) {
            return res.json((0, utils_1.error)('消费金额不足，无法赠送积分'));
        }
        if (merchant.balancePoints < pointsToAdd) {
            return res.json((0, utils_1.error)('商家积分余额不足，请先充值'));
        }
        // 检查用户是否存在
        const user = await client_1.default.user.findUnique({
            where: { id: Number(userId) }
        });
        if (!user) {
            return res.json((0, utils_1.error)('用户不存在'));
        }
        // 执行积分发放：扣商家余额，加用户积分，记流水
        const expireAt = new Date();
        expireAt.setFullYear(expireAt.getFullYear() + 1); // 一年后过期
        await client_1.default.$transaction(async (tx) => {
            // 扣减商家积分
            await tx.merchant.update({
                where: { id: merchantId },
                data: {
                    balancePoints: {
                        decrement: pointsToAdd
                    }
                }
            });
            // 增加用户积分
            await tx.userPoint.update({
                where: { userId: Number(userId) },
                data: {
                    totalPoints: {
                        increment: pointsToAdd
                    },
                    availablePoints: {
                        increment: pointsToAdd
                    }
                }
            });
            // 记录流水
            await tx.pointRecord.create({
                data: {
                    userId: Number(userId),
                    merchantId,
                    points: pointsToAdd,
                    type: 'EARN',
                    consumptionAmount: consumptionInCent,
                    orderNo: orderNo || null,
                    expireAt
                }
            });
        });
        return res.json((0, utils_1.success)({
            pointsAdded: pointsToAdd,
            consumptionAmount: consumptionAmount,
            expireAt
        }, '积分发放成功'));
    }
    catch (err) {
        console.error('发放积分错误:', err);
        return res.json((0, utils_1.error)('发放失败'));
    }
};
exports.addPointsToUser = addPointsToUser;
// 获取积分流水记录
const getPointRecords = async (req, res) => {
    try {
        const merchantId = req.merchant?.id;
        if (!merchantId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const [records, total] = await Promise.all([
            client_1.default.pointRecord.findMany({
                where: { merchantId },
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' },
                include: {
                    user: {
                        select: {
                            id: true,
                            phone: true,
                            nickname: true
                        }
                    }
                }
            }),
            client_1.default.pointRecord.count({ where: { merchantId } })
        ]);
        return res.json((0, utils_1.success)({
            records,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        }));
    }
    catch (err) {
        console.error('获取积分流水错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getPointRecords = getPointRecords;
// 获取商家申请状态
const getApplicationStatus = async (req, res) => {
    try {
        const { contactPhone } = req.query;
        if (!contactPhone) {
            return res.json((0, utils_1.error)('请提供手机号'));
        }
        const application = await client_1.default.merchantApplication.findFirst({
            where: { contactPhone: contactPhone },
            orderBy: { createdAt: 'desc' }
        });
        if (!application) {
            return res.json((0, utils_1.success)(null));
        }
        return res.json((0, utils_1.success)(application));
    }
    catch (err) {
        console.error('获取申请状态错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getApplicationStatus = getApplicationStatus;
