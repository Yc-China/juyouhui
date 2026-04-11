"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.completeOrder = exports.shipOrder = exports.getExchangeOrders = exports.getProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.updateMerchantStatus = exports.getMerchants = exports.rejectApplication = exports.approveApplication = exports.getApplications = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const utils_1 = require("../utils");
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const DEPOSIT_AMOUNT = 50000; // 500元保证金
// 管理员登录
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.json((0, utils_1.error)('用户名和密码不能为空'));
        }
        const admin = await client_1.default.admin.findUnique({
            where: { username }
        });
        if (!admin) {
            return res.json((0, utils_1.error)('用户名或密码错误'));
        }
        const isValidPassword = await bcryptjs_1.default.compare(password, admin.passwordHash);
        if (!isValidPassword) {
            return res.json((0, utils_1.error)('用户名或密码错误'));
        }
        const token = jsonwebtoken_1.default.sign({ id: admin.id, type: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return res.json((0, utils_1.success)({
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                name: admin.name
            }
        }, '登录成功'));
    }
    catch (err) {
        console.error('管理员登录错误:', err);
        return res.json((0, utils_1.error)('登录失败'));
    }
};
exports.login = login;
// 获取商家入驻申请列表
const getApplications = async (req, res) => {
    try {
        const { status, page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const where = {};
        if (status) {
            where.status = status;
        }
        const [applications, total] = await Promise.all([
            client_1.default.merchantApplication.findMany({
                where,
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' }
            }),
            client_1.default.merchantApplication.count({ where })
        ]);
        return res.json((0, utils_1.success)({
            applications,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        }));
    }
    catch (err) {
        console.error('获取申请列表错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getApplications = getApplications;
// 审核通过商家申请
const approveApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await client_1.default.merchantApplication.findUnique({
            where: { id: Number(applicationId) }
        });
        if (!application) {
            return res.json((0, utils_1.error)('申请不存在'));
        }
        if (application.status !== 'PENDING') {
            return res.json((0, utils_1.error)('申请已处理'));
        }
        const { password } = req.body;
        if (!password) {
            return res.json((0, utils_1.error)('请设置商家登录密码'));
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        // 创建商家账号
        await client_1.default.$transaction(async (tx) => {
            // 创建商家
            const merchant = await tx.merchant.create({
                data: {
                    name: application.name,
                    contactName: application.contactName,
                    contactPhone: application.contactPhone,
                    address: application.address,
                    businessLicense: application.businessLicense,
                    passwordHash,
                    deposit: DEPOSIT_AMOUNT,
                    status: 'APPROVED'
                }
            });
            // 更新申请状态
            await tx.merchantApplication.update({
                where: { id: application.id },
                data: {
                    status: 'APPROVED',
                    merchantId: merchant.id
                }
            });
        });
        return res.json((0, utils_1.success)(null, '审核通过，商家账号已创建'));
    }
    catch (err) {
        console.error('审核通过错误:', err);
        return res.json((0, utils_1.error)('审核失败'));
    }
};
exports.approveApplication = approveApplication;
// 拒绝商家申请
const rejectApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { remark } = req.body;
        const application = await client_1.default.merchantApplication.findUnique({
            where: { id: Number(applicationId) }
        });
        if (!application) {
            return res.json((0, utils_1.error)('申请不存在'));
        }
        if (application.status !== 'PENDING') {
            return res.json((0, utils_1.error)('申请已处理'));
        }
        await client_1.default.merchantApplication.update({
            where: { id: application.id },
            data: {
                status: 'REJECTED',
                remark: remark || '拒绝'
            }
        });
        return res.json((0, utils_1.success)(null, '已拒绝申请'));
    }
    catch (err) {
        console.error('拒绝申请错误:', err);
        return res.json((0, utils_1.error)('操作失败'));
    }
};
exports.rejectApplication = rejectApplication;
// 获取商家列表
const getMerchants = async (req, res) => {
    try {
        const { status, keyword, page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const where = {};
        if (status) {
            where.status = status;
        }
        if (keyword) {
            where.OR = [
                { name: { contains: keyword } },
                { contactPhone: { contains: keyword } }
            ];
        }
        const [merchants, total] = await Promise.all([
            client_1.default.merchant.findMany({
                where,
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' },
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
            }),
            client_1.default.merchant.count({ where })
        ]);
        return res.json((0, utils_1.success)({
            merchants,
            total,
            page: Number(page),
            pageSize: Number(pageSize)
        }));
    }
    catch (err) {
        console.error('获取商家列表错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getMerchants = getMerchants;
// 禁用/启用商家
const updateMerchantStatus = async (req, res) => {
    try {
        const { merchantId } = req.params;
        const { status } = req.body;
        await client_1.default.merchant.update({
            where: { id: Number(merchantId) },
            data: { status }
        });
        return res.json((0, utils_1.success)(null, '状态更新成功'));
    }
    catch (err) {
        console.error('更新商家状态错误:', err);
        return res.json((0, utils_1.error)('更新失败'));
    }
};
exports.updateMerchantStatus = updateMerchantStatus;
// 创建礼品
const createProduct = async (req, res) => {
    try {
        const { name, description, image, pricePoints, stock } = req.body;
        if (!name || !pricePoints || pricePoints <= 0 || stock === undefined) {
            return res.json((0, utils_1.error)('请填写完整信息'));
        }
        const product = await client_1.default.product.create({
            data: {
                name,
                description: description || '',
                image: image || '',
                pricePoints: Number(pricePoints),
                stock: Number(stock)
            }
        });
        return res.json((0, utils_1.success)(product, '创建成功'));
    }
    catch (err) {
        console.error('创建礼品错误:', err);
        return res.json((0, utils_1.error)('创建失败'));
    }
};
exports.createProduct = createProduct;
// 更新礼品
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, description, image, pricePoints, stock, status } = req.body;
        const product = await client_1.default.product.update({
            where: { id: Number(productId) },
            data: {
                name,
                description,
                image,
                pricePoints,
                stock,
                status
            }
        });
        return res.json((0, utils_1.success)(product, '更新成功'));
    }
    catch (err) {
        console.error('更新礼品错误:', err);
        return res.json((0, utils_1.error)('更新失败'));
    }
};
exports.updateProduct = updateProduct;
// 删除礼品（软删除改为下架）
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        await client_1.default.product.update({
            where: { id: Number(productId) },
            data: { status: 'INACTIVE' }
        });
        return res.json((0, utils_1.success)(null, '下架成功'));
    }
    catch (err) {
        console.error('删除礼品错误:', err);
        return res.json((0, utils_1.error)('操作失败'));
    }
};
exports.deleteProduct = deleteProduct;
// 获取礼品列表
const getProducts = async (req, res) => {
    try {
        const { status, page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const where = {};
        if (status) {
            where.status = status;
        }
        const [products, total] = await Promise.all([
            client_1.default.product.findMany({
                where,
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' }
            }),
            client_1.default.product.count({ where })
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
// 获取兑换订单列表
const getExchangeOrders = async (req, res) => {
    try {
        const { status, page = 1, pageSize = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(pageSize);
        const where = {};
        if (status) {
            where.status = status;
        }
        const [orders, total] = await Promise.all([
            client_1.default.exchangeOrder.findMany({
                where,
                skip,
                take: Number(pageSize),
                orderBy: { createdAt: 'desc' },
                include: {
                    product: true,
                    user: {
                        select: {
                            id: true,
                            phone: true,
                            nickname: true
                        }
                    }
                }
            }),
            client_1.default.exchangeOrder.count({ where })
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
// 发货处理
const shipOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await client_1.default.exchangeOrder.findUnique({
            where: { id: Number(orderId) }
        });
        if (!order) {
            return res.json((0, utils_1.error)('订单不存在'));
        }
        if (order.status !== 'PENDING') {
            return res.json((0, utils_1.error)('订单状态不允许发货'));
        }
        await client_1.default.exchangeOrder.update({
            where: { id: Number(orderId) },
            data: {
                status: 'SHIPPED',
                shippedAt: new Date()
            }
        });
        return res.json((0, utils_1.success)(null, '已标记为已发货'));
    }
    catch (err) {
        console.error('发货处理错误:', err);
        return res.json((0, utils_1.error)('操作失败'));
    }
};
exports.shipOrder = shipOrder;
// 完成订单
const completeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await client_1.default.exchangeOrder.findUnique({
            where: { id: Number(orderId) }
        });
        if (!order) {
            return res.json((0, utils_1.error)('订单不存在'));
        }
        if (order.status !== 'SHIPPED') {
            return res.json((0, utils_1.error)('请先标记发货'));
        }
        await client_1.default.exchangeOrder.update({
            where: { id: Number(orderId) },
            data: {
                status: 'COMPLETED'
            }
        });
        return res.json((0, utils_1.success)(null, '订单已完成'));
    }
    catch (err) {
        console.error('完成订单错误:', err);
        return res.json((0, utils_1.error)('操作失败'));
    }
};
exports.completeOrder = completeOrder;
// 统计数据
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalMerchants, pendingApplications, approvedMerchants, totalPointsIssued, totalPointsExchanged, pendingExchangeOrders, totalProducts] = await Promise.all([
            client_1.default.user.count(),
            client_1.default.merchant.count(),
            client_1.default.merchantApplication.count({ where: { status: 'PENDING' } }),
            client_1.default.merchant.count({ where: { status: 'APPROVED' } }),
            client_1.default.pointRecord.aggregate({
                _sum: {
                    points: true
                },
                where: { type: 'EARN' }
            }),
            client_1.default.pointRecord.aggregate({
                _sum: {
                    points: true
                },
                where: { type: 'EXCHANGE' }
            }),
            client_1.default.exchangeOrder.count({ where: { status: 'PENDING' } }),
            client_1.default.product.count({ where: { status: 'ACTIVE' } })
        ]);
        return res.json((0, utils_1.success)({
            totalUsers,
            totalMerchants,
            pendingApplications,
            approvedMerchants,
            totalPointsIssued: totalPointsIssued._sum.points || 0,
            totalPointsExchanged: Math.abs(totalPointsExchanged._sum.points || 0),
            pendingExchangeOrders,
            totalProducts
        }));
    }
    catch (err) {
        console.error('获取统计数据错误:', err);
        return res.json((0, utils_1.error)('获取失败'));
    }
};
exports.getStats = getStats;
