# 聚优惠 微信小程序用户端

这是聚优惠项目的微信小程序用户端，供C端用户查看积分、兑换礼品使用。

## 技术栈

- 原生微信小程序开发（无第三方框架）
- 服务端API对接，使用JWT认证
- 配色方案：主色 `#FF6B35` (橙色)

## 目录结构

```
apps/miniprogram/
├── pages/                 # 页面
│   ├── index/             # 首页（登录+仪表盘）
│   ├── points/            # 积分流水
│   ├── products/          # 礼品列表
│   ├── exchange/          # 兑换订单（创建+列表）
│   ├── order-detail/      # 订单详情
│   ├── address/           # 收货地址编辑
│   └── me/               # 我的
├── components/            # 公共组件
├── utils/                 # 工具函数
│   ├── api.js            # API接口封装
│   └── util.js           # 通用工具
├── images/               # 图片资源
├── app.js                # 小程序入口文件
├── app.json              # 小程序全局配置
├── app.wxss              # 全局样式
└── project.config.json   # 项目配置
```

## 开发环境准备

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 申请微信小程序账号，获取 AppID
3. 将项目中 `project.config.json` 里的 `appid` 替换为你自己的 AppID
4. 修改 `app.js` 中的 `baseUrl` 为你的API服务地址

## 开发预览流程

1. 打开微信开发者工具
2. 选择「导入项目」
3. 项目目录选择本项目的 `apps/miniprogram` 目录
4. 输入项目名称，填入 AppID，点击导入
5. 在开发者工具中即可预览和调试

## API 对接说明

所有请求都会自动在请求头添加：
```
Authorization: Bearer {token}
```
token由登录接口返回后存储在全局和本地存储中。

### 接口列表

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/login` | POST | 登录，传入code和手机号信息 |
| `/api/user/info` | GET | 获取用户信息和积分信息 |
| `/api/points/log` | GET | 获取积分流水列表 |
| `/api/products/list` | GET | 获取礼品列表 |
| `/api/products/:id` | GET | 获取礼品详情 |
| `/api/exchange/create` | POST | 创建兑换订单 |
| `/api/exchange/orders` | GET | 获取兑换订单列表 |
| `/api/exchange/orders/:id` | GET | 获取兑换订单详情 |
| `/api/address/list` | GET | 获取地址列表 |
| `/api/address/save` | POST | 保存地址 |

## 业务规则

1. **积分有效期**：积分自获得之日起有效期一年，过期自动失效
2. **兑换条件**：用户当前可用积分必须大于等于兑换礼品所需积分才能兑换
3. **订单状态**：
   - 0：待发货（管理员处理中）
   - 1：已发货（已发出，用户可查看物流）
   - 2：已完成（用户已收货）
   - 3：已取消

## 上传发布

1. 在微信开发者工具中，点击左侧「上传」
2. 填写版本号和项目备注
3. 点击「上传」
4. 登录 [微信公众平台](https://mp.weixin.qq.com/)
5. 进入「开发管理」->「开发版本」，提交审核
6. 审核通过后即可发布上线

## 注意事项

- 请确保 API 服务已经正确配置，并支持跨域访问
- 登录需要微信授权获取手机号，确保小程序已开通相关权限
- 所有图片资源需要自行添加到 `images` 目录
