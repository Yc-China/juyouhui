"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.getExchangeOrders = exports.exchangeProduct = exports.getProducts = exports.getPointRecords = exports.getPointInfo = exports.loginByPhone = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const utils_1 = require("../utils");
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
// 用户通过手机号验证码登录（实际开发中需要对接短信服务）
const loginByPhone = async (req, res) => {
    try {
        const { phone, code } = req.body;
        if (!phone || !code) {
            return res.json((0, utils_1.error)('手机号和验证码不能为空'));
        }
        // TODO: 实际开发中需要验证验证码是否正确
        // 这里简化处理，直接允许登录，不存在则创建用户
        let user = await client_1.default.user.findUnique({
            where: { phone }
        });
        if (!user) {
            user = await client_1.default.user.create({
                data: { phone }
            });
            // 创建用户积分账户
            await client_1.default.userPoint.create({
                data: { userId: user.id }
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, type: 'user' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return res.json((0, utils_1.success)({
            token,
            user: {
                id: user.id,
                phone: user.phone,
                nickname: user.nickname,
                avatar: user.avatar
            }
        }, '登录成功'));
    }
    catch (err) {
        console.error('用户登录错误:', err);
        return res.json((0, utils_1.error)('登录失败'));
    }
};
exports.loginByPhone = loginByPhone;
// 获取用户积分信息
const getPointInfo = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const userPoint = await client_1.default.userPoint.findFirst({
            where: { userId }
        });
        if (!userPoint) {
            return res.json((0, utils_1.error)('用户积分账户不存在'));
        }
        return res.json((0, utils_1.success)(userPoint));
    }
    catch (err) {
        console.error('获取积分信息错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getPointInfo = getPointInfo;
// 获取用户积分记录
const getPointRecords = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const [records, total] = await Promise.all([
            client_1.default.pointRecord.findMany({
                where: { userId },
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' },
                include: {
                    merchant: {
                        select: { name: true }
                    }
                }
            }),
            client_1.default.pointRecord.count({ where: { userId } })
        ]);
        return res.json((0, utils_1.success)({
            records,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        }));
    }
    catch (err) {
        console.error('获取积分记录错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getPointRecords = getPointRecords;
// 获取可兑换礼品列表
const getProducts = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const [products, total] = await Promise.all([
            client_1.default.product.findMany({
                where: { status: 'ACTIVE' },
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' }
            }),
            client_1.default.product.count({ where: { status: 'ACTIVE' } })
        ]);
        return res.json((0, utils_1.success)({
            products,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        }));
    }
    catch (err) {
        console.error('获取礼品列表错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getProducts = getProducts;
// 兑换礼品
const exchangeProduct = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { productId, address, contactName, contactPhone } = req.body;
        if (!productId || !address || !contactName || !contactPhone) {
            return res.json((0, utils_1.error)('缺少必要参数'));
        }
        // 检查商品是否存在且有库存
        const product = await client_1.default.product.findUnique({
            where: { id: Number(productId) }
        });
        if (!product) {
            return res.json((0, utils_1.error)('商品不存在'));
        }
        if (product.status !== 'ACTIVE') {
            return res.json((0, utils_1.error)('商品已下架'));
        }
        if (product.stock <= 0) {
            return res.json((0, utils_1.error)('商品库存不足'));
        }
        // 检查用户积分是否足够
        const userPoint = await client_1.default.userPoint.findFirst({
            where: { userId }
        });
        if (!userPoint || userPoint.availablePoints < product.pricePoints) {
            return res.json((0, utils_1.error)('积分不足'));
        }
        // 创建兑换订单，扣减积分，扣减库存
        const orderNo = (0, utils_1.generateOrderNo)('EX');
        const result = await client_1.default.$transaction(async (tx) => {
            // 创建订单
            const order = await tx.exchangeOrder.create({
                data: {
                    orderNo,
                    userId,
                    productId: product.id,
                    pointsCost: product.pricePoints,
                    address,
                    contactName,
                    contactPhone
                }
            });
            // 扣减用户积分
            await tx.userPoint.update({
                where: { userId },
                data: {
                    availablePoints: {
                        decrement: product.pricePoints
                    },
                    usedPoints: {
                        increment: product.pricePoints
                    }
                }
            });
            // 扣减商品库存
            await tx.product.update({
                where: { id: product.id },
                data: {
                    stock: {
                        decrement: 1
                    }
                }
            });
            // 创建积分流水记录
            await tx.pointRecord.create({
                data: {
                    userId,
                    merchantId: 0, // 平台兑换，商家填 0
                    points: -product.pricePoints,
                    type: 'EXCHANGE',
                    expireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 一年后过期，这里只是占位
                }
            });
            return order;
        });
        return res.json((0, utils_1.success)(result, '兑换成功'));
    }
    catch (err) {
        console.error('兑换礼品错误:', err);
        return res.json((0, utils_1.error)('兑换失败'));
    }
};
exports.exchangeProduct = exchangeProduct;
// 获取用户兑换订单列表
const getExchangeOrders = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const [orders, total] = await Promise.all([
            client_1.default.exchangeOrder.findMany({
                where: { userId },
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' },
                include: {
                    product: true
                }
            }),
            client_1.default.exchangeOrder.count({ where: { userId } })
        ]);
        return res.json((0, utils_1.success)({
            orders,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        }));
    }
    catch (err) {
        console.error('获取兑换订单错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getExchangeOrders = getExchangeOrders;
// 获取用户信息
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                phone: true,
                nickname: true,
                avatar: true,
                createdAt: true
            }
        });
        return res.json((0, utils_1.success)(user));
    }
    catch (err) {
        console.error('获取用户信息错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getProfile = getProfile;
// 更新用户信息
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.json((0, utils_1.error)('未授权'));
        }
        const { nickname, avatar } = req.body;
        const user = await client_1.default.user.update({
            where: { id: userId },
            data: { nickname, avatar },
            select: {
                id: true,
                phone: true,
                nickname: true,
                avatar: true,
                createdAt: true
            }
        });
        return res.json((0, utils_1.success)(user, '更新成功'));
    }
    catch (err) {
        console.error('更新用户信息错误:', err);
        return res.json((0, utils_1.error)('更新失败'));
    }
};
exports.updateProfile = updateProfile;
