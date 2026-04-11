import { Router } from 'express'
import { authUser, authMerchant } from '../middleware'
import { userController } from '../controllers'

const router = Router()

// 公开接口
router.post('/login', userController.loginByPhone)

// 需要认证的接口
router.get('/profile', authUser, userController.getProfile)
router.put('/profile', authUser, userController.updateProfile)
router.get('/points', authUser, userController.getPointInfo)
router.get('/points/records', authUser, userController.getPointRecords)
router.get('/products', authUser, userController.getProducts)
router.post('/exchange', authUser, userController.exchangeProduct)
router.get('/exchange/orders', authUser, userController.getExchangeOrders)

// 商家查询用户信息（商家认证）
router.get('/:id', authMerchant, userController.getUserById)

export default router
