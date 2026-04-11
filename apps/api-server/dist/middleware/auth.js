"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authAdmin = exports.authMerchant = exports.authUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("../utils");
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key';
const authUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json((0, utils_1.error)('未提供认证令牌'));
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.type !== 'user') {
            return res.status(403).json((0, utils_1.error)('令牌类型不匹配'));
        }
        req.user = {
            id: decoded.id,
            phone: '',
            type: 'user'
        };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authUser = authUser;
const authMerchant = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json((0, utils_1.error)('未提供认证令牌'));
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.type !== 'merchant') {
            return res.status(403).json((0, utils_1.error)('令牌类型不匹配'));
        }
        req.merchant = {
            id: decoded.id,
            name: '',
            type: 'merchant'
        };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authMerchant = authMerchant;
const authAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json((0, utils_1.error)('未提供认证令牌'));
    }
    const token = authHeader.slice(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        if (decoded.type !== 'admin') {
            return res.status(403).json((0, utils_1.error)('令牌类型不匹配'));
        }
        req.admin = {
            id: decoded.id,
            username: '',
            type: 'admin'
        };
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authAdmin = authAdmin;
