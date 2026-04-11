"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const middleware_1 = require("../middleware");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
// 公开接口
router.post('/login', controllers_1.merchantController.login);
router.post('/application', controllers_1.merchantController.submitApplication);
router.get('/application/status', controllers_1.merchantController.getApplicationStatus);
// 需要认证的接口
router.get('/profile', middleware_1.authMerchant, controllers_1.merchantController.getProfile);
router.post('/recharge', middleware_1.authMerchant, controllers_1.merchantController.createRecharge);
router.post('/recharge/:rechargeId/pay', middleware_1.authMerchant, controllers_1.merchantController.mockPayRecharge);
router.get('/recharge/records', middleware_1.authMerchant, controllers_1.merchantController.getRechargeRecords);
router.post('/points/add', middleware_1.authMerchant, controllers_1.merchantController.addPointsToUser);
router.get('/points/records', middleware_1.authMerchant, controllers_1.merchantController.getPointRecords);
exports.default = router;
