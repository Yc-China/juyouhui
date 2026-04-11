"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePoints = exports.generateOrderNo = exports.error = exports.success = void 0;
const success = (data, message = '操作成功') => {
    return {
        code: 0,
        message,
        data
    };
};
exports.success = success;
const error = (message = '操作失败', code = 1) => {
    return {
        code,
        message
    };
};
exports.error = error;
const generateOrderNo = (prefix) => {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}${timestamp.slice(-8)}${random}`;
};
exports.generateOrderNo = generateOrderNo;
const calculatePoints = (consumptionAmount, pointRule) => {
    // consumptionAmount 单位是分，pointRule 是每 1 元赠送多少积分
    // 例如：消费 100元 (10000分)，pointRule = 1，那么获得 100 * 1 = 100积分
    const yuan = consumptionAmount / 100;
    return Math.floor(yuan * pointRule);
};
exports.calculatePoints = calculatePoints;
