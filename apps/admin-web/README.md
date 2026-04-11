# 聚优惠 管理后台

聚优惠平台管理员管理后台，基于 React + TypeScript + Vite + Tailwind CSS 开发。

## 功能特性

- 👤 **管理员登录** - 用户名密码登录，JWT 认证
- 📝 **商家入驻审核** - 查看商家申请、审核通过/拒绝
- 🏪 **商家管理** - 商家列表、启用/禁用商家
- 🎁 **礼品管理** - 创建/编辑礼品、上架/下架、管理库存
- 📦 **兑换订单管理** - 订单列表、发货、完成订单
- 📊 **数据统计** - 商家数、用户数、积分流通、订单数统计

## 技术栈

- **React 18** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **Tailwind CSS** - CSS 框架
- **React Router** - 路由管理
- **Lucide React** - 图标库

## 开发环境

### 安装依赖

```bash
cd apps/admin-web
npm install
```

### 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

根据实际情况修改 `VITE_API_BASE_URL`：

```env
# 如果使用 Vite 代理（开发环境推荐）：
VITE_API_BASE_URL=/api/admin

# 如果直接连接后端：
# VITE_API_BASE_URL=http://localhost:3000/api/admin
```

### 启动开发服务

```bash
npm run dev
```

开发服务默认启动在 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
```

产物输出在 `dist` 目录，可以部署到静态文件服务器。

## API 对接

本项目对接 `apps/server` 中已实现的后端 API，主要接口包括：

- `POST /login` - 管理员登录
- `GET /applications` - 获取商家申请列表
- `POST /applications/:id/approve` - 通过申请
- `POST /applications/:id/reject` - 拒绝申请
- `GET /merchants` - 获取商家列表
- `PUT /merchants/:id/status` - 更新商家状态
- `GET /products` - 获取礼品列表
- `POST /products` - 创建礼品
- `PUT /products/:id` - 更新礼品
- `DELETE /products/:id` - 下架礼品
- `GET /exchange-orders` - 获取兑换订单
- `POST /exchange-orders/:id/ship` - 发货
- `POST /exchange-orders/:id/complete` - 完成订单
- `GET /stats` - 获取统计数据

所有请求自动带上 localStorage 中存储的 JWT token (`Authorization: Bearer {token}`)。

## 项目结构

```
src/
├── api/           # API 接口定义
├── components/    # 公共组件
├── context/       # React 上下文（认证）
├── pages/         # 页面组件
├── types/         # TypeScript 类型定义
├── utils/         # 工具函数
└── App.tsx        # 入口组件
```

## 配色方案

- 主色：`#FF6B35` (橙色)
- 辅助色：`#004E89` (蓝色)

## 说明

- 业务逻辑已在后端实现，前端仅做展示和对接
- 适配移动端和桌面端
- 代码结构清晰，方便后续维护扩展
