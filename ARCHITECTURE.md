# 聚优惠 - 餐饮积分联盟平台

> 聚优惠是一个面向餐饮行业的通用积分联盟平台，所有商家免费加盟，用户消费攒积分，到平台兑换礼品。

## 项目架构概述

本项目采用 **前后端分离** 架构，代码统一管理在一个 monorepo 仓库中。

```
┌─────────────────────────────────────────────────────────────┐
│                        用户端 / 商家端                        │
│  - 微信小程序（商家端：uniapp）                                │
│  - 微信小程序（用户端：原生开发）                              │
│  - 宣传官网（React + Vite）                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS API
┌─────────────────────────────────────────────────────────────┐
│                 Nginx 反向代理 (api.weichuanghai.com)         │
│  - SSL 终止（Let's Encrypt）                                  │
│  - 静态资源 serving（admin.weichuanghai.com / www.weichuanghai.com）
│  - CORS 跨域处理                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 Node.js Koa 服务端                           │
│  - RESTful API                                               │
│  - JWT 身份认证（管理员 / 商家分离）                           │
│  - Sequelize ORM                                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    MySQL 数据库                              │
│  - 关系型数据存储                                             │
└─────────────────────────────────────────────────────────────┘
```

## 目录结构

```
juyouhui/
├── server/                     # Node.js 服务端代码
│   ├── server/
│   │   ├── config/             # 配置文件（数据库、JWT密钥等）
│   │   ├── middleware/         # 中间件（auth认证、错误处理）
│   │   ├── models/             # Sequelize 数据模型
│   │   ├── routes/             # API 路由
│   │   └── utils/              # 工具函数（JWT、订单号生成）
│   └── public/                 # 宣传官网静态文件
│
├── admin-web/                  # 平台管理后台前端（React + TypeScript + Vite）
│   ├── src/
│   │   ├── api/                # API 请求封装
│   │   ├── context/            # React Context（Auth状态）
│   │   ├── pages/              # 页面组件
│   │   ├── types/              # TypeScript 类型定义
│   │   └── utils/              # 请求工具
│   ├── .env.production         # 生产环境配置（API地址）
│   └── dist/                   # 打包产物（部署到服务器）
│
├── landing/                    # 官网加盟表单页面（React + Vite）
│   └── dist/                   # 打包产物
│
├── merchant-web/               # 商家管理H5前端（React + Vite）
│
├── uniapp-juyouhui-shangjiaduan/  # 商家端微信小程序（uniapp 开发）
│
├── miniprogram/                # 用户端微信小程序（原生开发）
│
├── ARCHITECTURE.md             # 本文件 - 项目架构说明
└── README.md                   # 项目说明
```

## 核心业务模块

### 1. 加盟申请流程

```
用户（商家）在官网填写加盟申请表
        ↓
POST /api/merchant/application
        ↓
保存到 applications 表，状态：0（待处理）
        ↓
管理员登录管理后台，查看申请列表
        ↓
管理员审核：通过 / 拒绝
        ↓
通过 → 创建商家账号，状态设为已通过
拒绝 → 更新状态为已拒绝
```

**数据库表：** `applications`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT | 主键 |
| shopName | VARCHAR(100) | 店铺名称 |
| contactName | VARCHAR(50) | 联系人 |
| contactPhone | VARCHAR(20) | 联系电话 |
| email | VARCHAR(100) | 邮箱 |
| provinceCode | VARCHAR(20) | 省份编码 |
| cityCode | VARCHAR(20) | 城市编码 |
| districtCode | VARCHAR(20) | 区县编码 |
| address | VARCHAR(200) | 详细地址 |
| traffic | VARCHAR(50) | 月均客流量 |
| status | INT | 状态：0-待处理，1-已处理 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 2. 商家模块

**数据模型：** `merchants`

- 商家入驻需要缴纳 500 元保证金（可退）
- 商家预充值积分，1 分钱 = 1 积分
- 给用户发积分从商家余额扣除

### 3. 积分体系

- 商家充值 → 商家积分账户增加
- 商家给用户发积分 → 商家余额减少，用户余额增加
- 用户用积分兑换礼品 → 用户余额减少
- 积分有效期：**1 年**，从获得时间算起

### 4. 礼品兑换

- 平台自营礼品，用户用积分兑换
- 管理员在后台上架/下架礼品
- 兑换订单状态：待发货 → 已发货 → 已完成

## 角色体系

| 角色 | 权限 | 登录入口 |
|------|------|---------|
| **平台管理员** | 审核加盟申请、管理商家、管理礼品、管理兑换订单 | https://admin.weichuanghai.com |
| **商家** | 管理门店、充值积分、给用户发积分、查看统计 | 商家端小程序 / H5 |
| **普通用户** | 攒积分、兑换礼品 | 用户端小程序 |

## 技术栈

| 层次 | 技术 |
|------|------|
| 服务端 | Node.js + Koa + Sequelize ORM |
| 数据库 | MySQL 8.0 |
| 管理后台前端 | React 18 + TypeScript + Vite + Tailwind CSS |
| 官网加盟页 | React + Vite |
| 商家端小程序 | uniapp |
| 用户端小程序 | 原生微信小程序 |
| Web 服务器 | Nginx |
| HTTPS 证书 | Let's Encrypt |
| 部署 | 阿里云 ECS |

## 域名规划

| 域名 | 用途 |
|------|------|
| weichuanghai.com | 根域名，301 跳转到 www |
| www.weichuanghai.com | 宣传官网 |
| api.weichuanghai.com | RESTful API 服务 |
| admin.weichuanghai.com | 平台管理后台 |
| merchant.weichuanghai.com | 预留，商家端后续使用 |

## 部署架构（线上）

```
服务器：阿里云 ECS（47.95.217.19）
操作系统：Alibaba Cloud Linux 3
项目路径：/opt/juyouhui/

/opt/juyouhui/
├── server/            # Node.js 服务端代码（运行在 3000 端口）
├── admin/             # admin-web 打包后的静态文件
└── landing/           # 官网静态文件

服务端注册为 systemd 服务：juyouhui，开机自启
Nginx 反向代理：
  api.weichuanghai.com → http://localhost:3000
  admin.weichuanghai.com → /opt/juyouhui/admin
  www.weichuanghai.com → /opt/juyouhui/landing
```

## 认证方式

- **管理员认证：** JWT Token，存储在 localStorage，有效期 7 天
- **商家认证：** JWT Token
- 所有 API 接口使用 `Authorization: Bearer <token>` 请求头

## 已完成功能

✅ **服务端**
- [x] 加盟申请接口（官网表单提交）
- [x] 管理员登录
- [x] 加盟申请管理（列表/详情/通过/拒绝）
- [x] 商家管理
- [x] 礼品管理
- [x] 兑换订单管理
- [x] 数据统计接口

✅ **管理后台前端**
- [x] 登录页面
- [x] 数据统计 Dashboard
- [x] 加盟申请列表 + 审核
- [x] 商家管理
- [x] 礼品管理
- [x] 兑换订单管理
- [x] 退出登录

✅ **部署配置**
- [x] HTTPS 证书覆盖所有域名
- [x] CORS 跨域配置
- [x] systemd 服务注册
- [x] Nginx 反向代理

## 待开发

- [ ] 用户端小程序
- [ ] 商家端小程序部署
- [ ] 支付对接

## Git 仓库

https://github.com/Yc-China/juyouhui

## 最后更新

2026-04-08
