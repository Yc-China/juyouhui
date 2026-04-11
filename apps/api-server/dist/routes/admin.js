"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// 登录接口公开
router.post('/login', controllers_1.adminController.login);
// 需要管理员认证
router.use(middleware_1.authAdmin);
// 商家申请管理
router.get('/applications', controllers_1.adminController.getApplications);
router.post('/applications/:applicationId/approve', controllers_1.adminController.approveApplication);
router.post('/applications/:applicationId/reject', controllers_1.adminController.rejectApplication);
// 商家管理
router.get('/merchants', controllers_1.adminController.getMerchants);
router.put('/merchants/:merchantId/status', controllers_1.adminController.updateMerchantStatus);
// 礼品管理
router.post('/products', controllers_1.adminController.createProduct);
router.put('/products/:productId', controllers_1.adminController.updateProduct);
router.delete('/products/:productId', controllers_1.adminController.deleteProduct);
router.get('/products', controllers_1.adminController.getProducts);
// 兑换订单管理
router.get('/exchange-orders', controllers_1.adminController.getExchangeOrders);
router.post('/exchange-orders/:orderId/ship', controllers_1.adminController.shipOrder);
router.post('/exchange-orders/:orderId/complete', controllers_1.adminController.completeOrder);
// 统计数据
router.get('/stats', controllers_1.adminController.getStats);
exports.default = router;
