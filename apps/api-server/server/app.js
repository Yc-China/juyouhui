const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const dayjs = require('dayjs');
const { sequelize } = require('./models');

const merchantRouter = require('./routes/merchant');
const adminRouter = require('./routes/admin');

const app = new Koa();
const router = new Router();

// 测试连接
async function testDb() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');
    // 同步模型（开发环境使用）
    // await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('❌ 数据库连接失败:', error);
  }
}
testDb();

// 健康检查接口
router.get('/api/health', async ctx => {
  ctx.body = {
    code: 0,
    message: 'ok',
    data: {
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      project: '聚优惠餐饮积分联盟'
    }
  };
});

app
  .use(bodyParser())
  .use(router.routes())
  .use(merchantRouter.routes())
  .use(adminRouter.routes())
  .use(router.allowedMethods());

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 服务已启动，监听端口 ${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/api/health`);
});

module.exports = { app, sequelize };
