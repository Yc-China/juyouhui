"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes"));
const middleware_1 = require("./middleware");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// 中间件
app.use(middleware_1.corsMiddleware);
app.use(middleware_1.logger);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 路由
app.use(routes_1.default);
// 404处理
app.use(middleware_1.notFound);
// 错误处理
app.use(middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 聚优惠服务已启动，监听端口: ${PORT}`);
    console.log(`📝 健康检查: http://localhost:${PORT}/health`);
    console.log(`👤 用户接口: http://localhost:${PORT}/api/user`);
    console.log(`🏪 商家接口: http://localhost:${PORT}/api/merchant`);
    console.log(`🔧 管理接口: http://localhost:${PORT}/api/admin`);
});
