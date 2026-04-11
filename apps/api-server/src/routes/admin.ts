import { Router } from 'express'
import { authAdmin } from '../middleware'
import { adminController } from '../controllers'

const router = Router()

// 登录接口公开
router.post('/login', adminController.login)

// 需要管理员认证
router.use(authAdmin)

// 商家申请管理
router.get('/applications', adminController.getApplications)
router.post('/applications/:applicationId/approve', adminController.approveApplication)
router.post('/applications/:applicationId/reject', adminController.rejectApplication)

// 商家管理
router.get('/merchants', adminController.getMerchants)
router.put('/merchants/:merchantId/status', adminController.updateMerchantStatus)

// 礼品管理
router.post('/products', adminController.createProduct)
router.put('/products/:productId', adminController.updateProduct)
router.delete('/products/:productId', adminController.deleteProduct)
router.get('/products', adminController.getProducts)

// 兑换订单管理
router.get('/exchange-orders', adminController.getExchangeOrders)
router.post('/exchange-orders/:orderId/ship', adminController.shipOrder)
router.post('/exchange-orders/:orderId/complete', adminController.completeOrder)

// 统计数据
router.get('/stats', adminController.getStats)

export default router
