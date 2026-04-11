import dotenv from 'dotenv'
// 加载环境变量
dotenv.config()

import express from 'express'
import routes from './routes'
import { logger, errorHandler, notFound, corsMiddleware } from './middleware'

const app = express()
const PORT = process.env.PORT || 3000

// 中间件
app.use(corsMiddleware)
app.use(logger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 路由
app.use(routes)

// 404处理
app.use(notFound)

// 错误处理
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`🚀 聚优惠服务已启动，监听端口: ${PORT}`)
  console.log(`📝 健康检查: http://localhost:${PORT}/health`)
  console.log(`👤 用户接口: http://localhost:${PORT}/api/user`)
  console.log(`🏪 商家接口: http://localhost:${PORT}/api/merchant`)
  console.log(`🔧 管理接口: http://localhost:${PORT}/api/admin`)
})
