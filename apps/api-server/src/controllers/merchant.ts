import { Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'
import { success, error, generateOrderNo, calculatePoints } from '../utils'
import { MerchantRequest } from '../types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const DEPOSIT_AMOUNT = 50000 // 500元 = 50000分

// 商家登录
export const login = async (req: MerchantRequest, res: Response) => {
  try {
    const { contactPhone, password } = req.body

    if (!contactPhone || !password) {
      return res.json(error('手机号和密码不能为空'))
    }

    const merchant = await prisma.merchant.findFirst({
      where: { contactPhone }
    })

    if (!merchant) {
      return res.json(error('商家不存在'))
    }

    if (merchant.status !== 'APPROVED') {
      return res.json(error('商家未审核通过或已被禁用'))
    }

    const isValidPassword = await bcrypt.compare(password, merchant.passwordHash)
    if (!isValidPassword) {
      return res.json(error('密码错误'))
    }

    const token = jwt.sign(
      { id: merchant.id, type: 'merchant' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    )

    return res.json(success({
      token,
      merchant: {
        id: merchant.id,
        name: merchant.name,
        contactName: merchant.contactName,
        contactPhone: merchant.contactPhone,
        address: merchant.address,
        balancePoints: merchant.balancePoints,
        deposit: merchant.deposit,
        pointRule: merchant.pointRule,
        status: merchant.status
      }
    }, '登录成功'))
  } catch (err) {
    console.error('商家登录错误:', err)
    return res.json(error('登录失败'))
  }
}

// 提交入驻申请
export const submitApplication = async (req: MerchantRequest, res: Response) => {
  try {
    const { name, contactName, contactPhone, email, provinceCode, cityCode, districtCode, provinceName, cityName, districtName, address, traffic } = req.body

    // 初审阶段只需要基本信息，密码和营业执照在激活时补充
    if (!name || !contactName || !contactPhone || !address) {
      return res.json(error('请填写完整信息'))
    }

    // 检查手机号是否已注册
    const existingMerchant = await prisma.merchant.findFirst({
      where: { contactPhone }
    })
    if (existingMerchant) {
      return res.json(error('该手机号已注册'))
    }

    // 检查是否已有待处理申请
    const pendingApplication = await prisma.merchantApplication.findFirst({
      where: {
        contactPhone,
        status: 'PENDING'
      }
    })
    if (pendingApplication) {
      return res.json(error('已有待审核的申请，请等待审核'))
    }

    // 创建申请
    const application = await prisma.merchantApplication.create({
      data: {
        name,
        contactName,
        contactPhone,
        email: req.body.email || '',
        provinceCode: req.body.provinceCode || '',
        cityCode: req.body.cityCode || '',
        districtCode: req.body.districtCode || '',
        provinceName: req.body.provinceName || '',
        cityName: req.body.cityName || '',
        districtName: req.body.districtName || '',
        address,
        traffic: req.body.traffic || '',
        businessLicense: req.body.businessLicense || '',
        status: 'PENDING'
      }
    })

    return res.json(success(application, '申请提交成功，请等待审核'))
  } catch (err) {
    console.error('提交入驻申请错误:', err)
    return res.json(error('提交失败'))
  }
}

// 获取商家信息
export const getProfile = async (req: MerchantRequest, res: Response) => {
  try {
    const merchantId = req.merchant?.id
    if (!merchantId) {
      return res.json(error('未授权'))
    }

    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: {
        id: true,
        name: true,
        contactName: true,
        contactPhone: true,
        address: true,
        businessLicense: true,
        deposit: true,
        balancePoints: true,
        pointRule: true,
        status: true,
        createdAt: true
      }
    })

    return res.json(success(merchant))
  } catch (err) {
    console.error('获取商家信息错误:', err)
    return res.json(error('获取失败'))
  }
}

// 创建充值订单
export const createRecharge = async (req: MerchantRequest, res: Response) => {
  try {
    const merchantId = req.merchant?.id
    if (!merchantId) {
      return res.json(error('未授权'))
    }

    const { amount } = req.body
    if (!amount || amount <= 0) {
      return res.json(error('请输入正确的充值金额'))
    }

    // amount 单位：元，转为分
    const amountInCent = Math.round(amount * 100)
    const points = amountInCent // 1分钱 = 1积分

    const orderNo = generateOrderNo('RC')

    const recharge = await prisma.merchantRecharge.create({
      data: {
        merchantId,
        amount: amountInCent,
        points,
        orderNo,
        status: 'PENDING'
      }
    })

    // TODO: 实际开发中这里需要调用支付接口生成支付链接/二维码
    // 这里简化处理，直接标记为已支付

    return res.json(success({
      recharge,
      orderNo,
      amount: amountInCent / 100,
      points
    }, '充值订单创建成功，请完成支付'))
  } catch (err) {
    console.error('创建充值订单错误:', err)
    return res.json(error('创建失败'))
  }
}

// 模拟支付成功（实际开发中由支付回调处理）
export const mockPayRecharge = async (req: MerchantRequest, res: Response) => {
  try {
    const merchantId = req.merchant?.id
    if (!merchantId) {
      return res.json(error('未授权'))
    }

    const { rechargeId } = req.params
    const recharge = await prisma.merchantRecharge.findUnique({
      where: { id: Number(rechargeId) }
    })

    if (!recharge) {
      return res.json(error('充值订单不存在'))
    }

    if (recharge.merchantId !== merchantId) {
      return res.json(error('无权操作此订单'))
    }

    if (recharge.status === 'PAID') {
      return res.json(error('订单已支付'))
    }

    // 更新充值状态并增加商家积分余额
    await prisma.$transaction(async (tx) => {
      await tx.merchantRecharge.update({
        where: { id: recharge.id },
        data: {
          status: 'PAID',
          paidAt: new Date()
        }
      })

      await tx.merchant.update({
        where: { id: merchantId },
        data: {
          balancePoints: {
            increment: recharge.points
          }
        }
      })
    })

    return res.json(success(null, '支付成功'))
  } catch (err) {
    console.error('支付处理错误:', err)
    return res.json(error('处理失败'))
  }
}

// 获取充值记录
export const getRechargeRecords = async (req: MerchantRequest, res: Response) => {
  try {
    const merchantId = req.merchant?.id
    if (!merchantId) {
      return res.json(error('未授权'))
    }

    const { page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const [records, total] = await Promise.all([
      prisma.merchantRecharge.findMany({
        where: { merchantId },
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.merchantRecharge.count({ where: { merchantId } })
    ])

    return res.json(success({
      records,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }))
  } catch (err) {
    console.error('获取充值记录错误:', err)
    return res.json(error('获取失败'))
  }
}

// 给用户增加积分
export const addPointsToUser = async (req: MerchantRequest, res: Response) => {
  try {
    const merchantId = req.merchant?.id
    if (!merchantId) {
      return res.json(error('未授权'))
    }

    const { userId, consumptionAmount, orderNo } = req.body

    if (!userId || !consumptionAmount || consumptionAmount <= 0) {
      return res.json(error('请输入正确的用户ID和消费金额'))
    }

    // 检查商家余额是否足够
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId }
    })
    if (!merchant) {
      return res.json(error('商家不存在'))
    }

    // 根据规则计算应发放积分
    const consumptionInCent = Math.round(consumptionAmount * 100)
    const pointsToAdd = calculatePoints(consumptionInCent, merchant.pointRule)

    if (pointsToAdd <= 0) {
      return res.json(error('消费金额不足，无法赠送积分'))
    }

    if (merchant.balancePoints < pointsToAdd) {
      return res.json(error('商家积分余额不足，请先充值'))
    }

    // 检查用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) }
    })
    if (!user) {
      return res.json(error('用户不存在'))
    }

    // 执行积分发放：扣商家余额，加用户积分，记流水
    const expireAt = new Date()
    expireAt.setFullYear(expireAt.getFullYear() + 1) // 一年后过期

    await prisma.$transaction(async (tx) => {
      // 扣减商家积分
      await tx.merchant.update({
        where: { id: merchantId },
        data: {
          balancePoints: {
            decrement: pointsToAdd
          }
        }
      })

      // 增加用户积分
      await tx.userPoint.update({
        where: { userId: Number(userId) },
        data: {
          totalPoints: {
            increment: pointsToAdd
          },
          availablePoints: {
            increment: pointsToAdd
          }
        }
      })

      // 记录流水
      await tx.pointRecord.create({
        data: {
          userId: Number(userId),
          merchantId,
          points: pointsToAdd,
          type: 'EARN',
          consumptionAmount: consumptionInCent,
          orderNo: orderNo || null,
          expireAt
        }
      })
    })

    return res.json(success({
      pointsAdded: pointsToAdd,
      consumptionAmount: consumptionAmount,
      expireAt
    }, '积分发放成功'))
  } catch (err) {
    console.error('发放积分错误:', err)
    return res.json(error('发放失败'))
  }
}

// 获取积分流水记录
export const getPointRecords = async (req: MerchantRequest, res: Response) => {
  try {
    const merchantId = req.merchant?.id
    if (!merchantId) {
      return res.json(error('未授权'))
    }

    const { page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const [records, total] = await Promise.all([
      prisma.pointRecord.findMany({
        where: { merchantId },
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              phone: true,
              nickname: true
            }
          }
        }
      }),
      prisma.pointRecord.count({ where: { merchantId } })
    ])

    return res.json(success({
      records,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }))
  } catch (err) {
    console.error('获取积分流水错误:', err)
    return res.json(error('获取失败'))
  }
}

// 获取商家申请状态
export const getApplicationStatus = async (req: MerchantRequest, res: Response) => {
  try {
    const { contactPhone } = req.query

    if (!contactPhone) {
      return res.json(error('请提供手机号'))
    }

    const application = await prisma.merchantApplication.findFirst({
      where: { contactPhone: contactPhone as string },
      orderBy: { createdAt: 'desc' }
    })

    if (!application) {
      return res.json(success(null))
    }

    return res.json(success(application))
  } catch (err) {
    console.error('获取申请状态错误:', err)
    return res.json(error('获取失败'))
  }
}

// 获取首页统计数据
export const getHomeStats = async (req: MerchantRequest, res: Response) => {
  try {
    const merchantId = req.merchant?.id
    if (!merchantId) {
      return res.json(error('未授权'))
    }

    // 今日开始时间
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    // 今日发放积分统计
    const todayResult = await prisma.pointRecord.aggregate({
      where: {
        merchantId,
        createdAt: {
          gte: todayStart
        },
        type: 'EARN'
      },
      sum: {
        points: true
      }
    })

    // 累计发放积分统计
    const totalResult = await prisma.pointRecord.aggregate({
      where: {
        merchantId,
        type: 'EARN'
      },
      sum: {
        points: true
      }
    })

    // 获取商家余额
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: { balancePoints: true }
    })

    const todayPoints = todayResult.sum.points || 0
    const totalPoints = totalResult.sum.points || 0
    const balance = merchant?.balancePoints ? merchant.balancePoints / 100 : 0

    return res.json(success({
      balance,
      todayPoints,
      totalPoints
    }))
  } catch (err) {
    console.error('获取首页统计错误:', err)
    return res.json(error('获取失败'))
  }
}
