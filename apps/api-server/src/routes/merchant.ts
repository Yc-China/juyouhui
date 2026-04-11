import { Router } from 'express'
import { authMerchant } from '../middleware'
import { merchantController } from '../controllers'

const router = Router()

// 公开接口
router.post('/login', merchantController.login)
router.post('/application', merchantController.submitApplication)
router.get('/application/status', merchantController.getApplicationStatus)

// 需要认证的接口
router.get('/profile', authMerchant, merchantController.getProfile)
router.get('/home/stats', authMerchant, merchantController.getHomeStats)
router.post('/recharge', authMerchant, merchantController.createRecharge)
router.post('/recharge/:rechargeId/pay', authMerchant, merchantController.mockPayRecharge)
router.get('/recharge/records', authMerchant, merchantController.getRechargeRecords)
router.post('/points/add', authMerchant, merchantController.addPointsToUser)
router.get('/points/records', authMerchant, merchantController.getPointRecords)

export default router
