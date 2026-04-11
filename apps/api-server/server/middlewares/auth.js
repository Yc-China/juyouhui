const { verifyToken } = require('../utils/jwt');

// 商家认证中间件
function merchantAuth(ctx, next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { code: 401, message: '未登录', data: null };
    return;
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded || !decoded.merchantId) {
    ctx.status = 401;
    ctx.body = { code: 401, message: 'Token 已过期', data: null };
    return;
  }

  ctx.state.merchantId = decoded.merchantId;
  return next();
}

// 管理员认证中间件
function adminAuth(ctx, next) {
  const authHeader = ctx.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { code: 401, message: '未登录', data: null };
    return;
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);
  if (!decoded || !decoded.adminId) {
    ctx.status = 401;
    ctx.body = { code: 401, message: 'Token 已过期', data: null };
    return;
  }

  ctx.state.adminId = decoded.adminId;
  return next();
}

module.exports = { merchantAuth, adminAuth };
