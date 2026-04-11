# 聚优惠 - 餐饮积分联盟平台

> 餐饮行业通用积分联盟，所有商家免费加盟，用户攒积分兑换礼品。

## 🎯 项目简介

- **模式**：商家免费加盟，缴纳可退保证金，预充值发积分，用户攒积分兑换平台自营礼品
- **优势**：彻底解决套礼品风险，平台现金流健康
- **目标**：先做出来验证模式，最终盈利

## 📁 项目结构

采用 **pnpm monorepo** 结构管理，符合业界规范：

```
juyouhui/
├── apps/
│   ├── admin-web           # 平台管理后台（React）
│   ├── api-server          # Node.js API 服务端
│   ├── customer-miniprogram # C端用户小程序（uni-app）
│   ├── official-website    # 项目官方门户网站
│   ├── merchant-web        # 商家后台网页版（Vue）
│   └── merchant-uniapp     # 商家端小程序（uni-app）
├── packages/               # 预留：共享工具包/组件库
├── pnpm-workspace.yaml
└── package.json
```

> 商家端和 C 端用户小程序**全部使用 uni-app 开发**，方便后期多端兼容。

## 🚀 本地启动

### 1. 安装依赖
```bash
pnpm install
```

### 2. 启动 API 服务端
```bash
pnpm dev:server
# 或
cd apps/api-server
bash start.sh
```

服务默认启动在 `http://localhost:3000`

### 3. 数据库初始化
```bash
cd apps/api-server
bash init-db.sh
```

默认管理员账号：`admin / 123456`

### 4. 启动前端
根据不同模块进入对应 `apps/` 下目录，按各自文档启动。

## 🛠 技术栈

- **API 服务端**：Node.js + Koa + Sequelize + MySQL
- **平台管理后台**：React
- **商家后台网页版**：Vue
- **商家端小程序**：uni-app
- **C 端用户小程序**：uni-app（方便多端兼容）

## 📄 许可证

MIT © [Yc-China](https://github.com/Yc-China)
