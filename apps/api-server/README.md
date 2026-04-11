# 聚优惠 - 一键部署文档

聚优惠是面向餐饮行业的通用积分联盟平台，本项目包含：
- 服务端：Node.js + Koa2 + MySQL
- 商家端：uni-app 微信小程序

## 📋 环境要求

部署前请确保你的服务器/本地环境已安装：

- [Node.js](https://nodejs.org/) 16.x 或更高版本
- [MySQL](https://www.mysql.com/) 5.7 或更高版本
- [Git](https://git-scm.com/) (可选，用于克隆代码)

## 🚀 一键部署

### 1. 拉取代码

```bash
git clone <你的项目地址>
cd juyouhui
```

如果你已经下载了代码，直接进入项目目录即可。

### 2. 修改数据库配置

编辑 `server/config/database.js`，修改为你的数据库信息：

```javascript
// 数据库配置
module.exports = {
  host: 'localhost',    // 你的数据库地址
  port: 3306,           // 你的数据库端口
  user: 'root',         // 你的数据库用户名
  password: '',         // 你的数据库密码
  database: 'juyouhui', // 数据库名称（一般不需要改）
  timezone: '+08:00'
};
```

### 3. 一键初始化数据库

给脚本添加执行权限（只需要执行一次）：

```bash
chmod +x init-db.sh
```

运行初始化脚本：

```bash
./init-db.sh
```

脚本会自动：
- 创建数据库（如果不存在）
- 导入所有表结构
- 创建默认管理员账号

如果看到 `✅ 数据库初始化完成` 说明成功了。

**默认管理员信息：**
- 用户名：`admin`
- 密码：`123456`

> ⚠️ 注意：这个脚本会清空已有数据，重新初始化。生产环境请谨慎操作！

### 4. 一键启动服务

给脚本添加执行权限（只需要执行一次）：

```bash
chmod +x start.sh
```

运行启动脚本：

```bash
./start.sh
```

脚本会自动：
- 检查 Node.js 环境
- 自动安装依赖（如果没装过）
- 启动服务

看到类似下面的输出说明启动成功了：

```
✅ 数据库连接成功
🚀 服务已启动，监听端口 3000
🔍 健康检查: http://localhost:3000/api/health
```

### 5. 测试服务

在浏览器打开：
```
http://你的服务器地址:3000/api/health
```

如果返回如下 JSON 说明服务正常运行：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "time": "2024-01-01 12:00:00",
    "project": "聚优惠餐饮积分联盟"
  }
}
```

## 🔧 高级配置

### 使用环境变量

你可以通过环境变量覆盖数据库配置，方便在不同服务器部署：

```bash
export DB_HOST="你的数据库地址"
export DB_USER="你的数据库用户名"
export DB_PASS="你的数据库密码"
export DB_PORT="3306"
export DB_NAME="juyouhui"
./init-db.sh
```

### 后台运行（生产环境）

使用 PM2 进行进程管理，让服务后台运行：

```bash
# 安装 PM2
npm install -g pm2

# 进入 server 目录
cd server

# 启动服务
pm2 start app.js --name juyouhui

# 查看日志
pm2 logs juyouhui

# 查看状态
pm2 status
```

### Nginx 反向代理配置（生产环境）

如果你想用域名访问，可以配置 Nginx：

```nginx
server {
  listen 80;
  server_name api.your-domain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

## 📝 常见问题

### 1. 执行脚本提示权限不足

```bash
chmod +x init-db.sh
chmod +x start.sh
```

### 2. 数据库连接失败

- 检查 MySQL 服务是否启动：`systemctl status mysql` 或 `service mysql status`
- 检查数据库地址、端口、用户名、密码是否正确
- 检查是否允许当前 IP 连接 MySQL

### 3. npm install 慢或者失败

使用淘宝镜像加速：

```bash
npm config set registry https://registry.npmmirror.com/
npm install
```

### 4. 端口被占用

编辑 `server/app.js`，修改最后一行的端口号：

```javascript
const PORT = process.env.PORT || 你的新端口号;
```

或者用环境变量指定端口：

```bash
export PORT=3001
./start.sh
```

## 📦 项目目录结构

```
juyouhui/
├── init-db.sh          # 数据库初始化脚本
├── start.sh            # 服务启动脚本
├── README.md           # 部署文档（你正在看）
├── PROJECT.md          # 项目介绍
├── server/             # 服务端代码
│   ├── app.js          # 入口文件
│   ├── config/         # 配置文件
│   ├── models/         # 数据模型
│   ├── routes/         # API 路由
│   └── utils/          # 工具函数
├── merchant-mini/      # 商家小程序
└── docs/
    └── schema.sql      # 数据库表结构
```

## 🎯 后续步骤

服务端启动成功后：

1. 导入商家小程序代码到微信开发者工具
2. 修改小程序中的 API 地址为你的服务器地址
3. 上传发布小程序

## 📞 问题反馈

如有问题请检查：
- [ ] 环境版本是否符合要求
- [ ] 数据库配置是否正确
- [ ] 防火墙是否放开端口

---

**祝你部署顺利！** 🎉
