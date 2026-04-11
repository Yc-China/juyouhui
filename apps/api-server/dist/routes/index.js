"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("./user"));
const merchant_1 = __importDefault(require("./merchant"));
const admin_1 = __importDefault(require("./admin"));
const router = (0, express_1.Router)();
router.use('/api/user', user_1.default);
router.use('/api/merchant', merchant_1.default);
router.use('/api/admin', admin_1.default);
// 健康检查
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: '聚优惠服务端运行正常'
    });
});
exports.default = router;
