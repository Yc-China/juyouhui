import { Router } from 'express'
import userRouter from './user'
import merchantRouter from './merchant'
import adminRouter from './admin'

const router = Router()

router.use('/api/user', userRouter)
router.use('/api/merchant', merchantRouter)
router.use('/api/admin', adminRouter)

// 健康检查
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '聚优惠服务端运行正常'
  })
})

export default router
