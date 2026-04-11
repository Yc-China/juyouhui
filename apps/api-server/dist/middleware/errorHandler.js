"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandler = void 0;
const utils_1 = require("../utils");
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'ValidationError') {
        return res.status(400).json((0, utils_1.error)(err.message, 400));
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json((0, utils_1.error)('无效的令牌', 401));
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json((0, utils_1.error)('令牌已过期', 401));
    }
    res.status(err.statusCode || 500).json((0, utils_1.error)(err.message || '服务器内部错误', err.statusCode || 500));
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => {
    res.status(404).json((0, utils_1.error)('接口不存在', 404));
};
exports.notFound = notFound;
