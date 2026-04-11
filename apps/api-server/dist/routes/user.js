"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// 公开接口
router.post('/login', controllers_1.userController.loginByPhone);
// 需要认证的接口
router.get('/profile', middleware_1.authUser, controllers_1.userController.getProfile);
router.put('/profile', middleware_1.authUser, controllers_1.userController.updateProfile);
router.get('/points', middleware_1.authUser, controllers_1.userController.getPointInfo);
router.get('/points/records', middleware_1.authUser, controllers_1.userController.getPointRecords);
router.get('/products', middleware_1.authUser, controllers_1.userController.getProducts);
router.post('/exchange', middleware_1.authUser, controllers_1.userController.exchangeProduct);
router.get('/exchange/orders', middleware_1.authUser, controllers_1.userController.getExchangeOrders);
exports.default = router;
