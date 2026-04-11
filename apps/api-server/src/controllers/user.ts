import { Response } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'
import { success, error, generateOrderNo } from '../utils'
import { UserRequest } from '../types'
import { calculatePoints } from '../utils'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// 用户通过手机号验证码登录（实际开发中需要对接短信服务）
export const loginByPhone = async (req: UserRequest, res: Response) => {
  try {
    const { phone, code } = req.body

    if (!phone || !code) {
      return res.json(error('手机号和验证码不能为空'))
    }

    // TODO: 实际开发中需要验证验证码是否正确
    // 这里简化处理，直接允许登录，不存在则创建用户

    let user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { phone }
      })
      // 创建用户积分账户
      await prisma.userPoint.create({
        data: { userId: user.id }
      })
    }

    const token = jwt.sign(
      { id: user.id, type: 'user' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    )

    return res.json(success({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        nickname: user.nickname,
        avatar: user.avatar
      }
    }, '登录成功'))
  } catch (err) {
    console.error('用户登录错误:', err)
    return res.json(error('登录失败'))
  }
}

// 获取用户积分信息
export const getPointInfo = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.json(error('未授权'))
    }

    const userPoint = await prisma.userPoint.findFirst({
      where: { userId }
    })

    if (!userPoint) {
      return res.json(error('用户积分账户不存在'))
    }

    return res.json(success(userPoint))
  } catch (err) {
    console.error('获取积分信息错误:', err)
    return res.json(error('获取失败'))
  }
}

// 获取用户积分记录
export const getPointRecords = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.json(error('未授权'))
    }

    const { page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const [records, total] = await Promise.all([
      prisma.pointRecord.findMany({
        where: { userId },
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' },
        include: {
          merchant: {
            select: { name: true }
          }
        }
      }),
      prisma.pointRecord.count({ where: { userId } })
    ])

    return res.json(success({
      records,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }))
  } catch (err) {
    console.error('获取积分记录错误:', err)
    return res.json(error('获取失败'))
  }
}

// 获取可兑换礼品列表
export const getProducts = async (req: UserRequest, res: Response) => {
  try {
    const { page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { status: 'ACTIVE' },
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where: { status: 'ACTIVE' } })
    ])

    return res.json(success({
      products,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }))
  } catch (err) {
    console.error('获取礼品列表错误:', err)
    return res.json(error('获取失败'))
  }
}

// 兑换礼品
export const exchangeProduct = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.json(error('未授权'))
    }

    const { productId, address, contactName, contactPhone } = req.body

    if (!productId || !address || !contactName || !contactPhone) {
      return res.json(error('缺少必要参数'))
    }

    // 检查商品是否存在且有库存
    const product = await prisma.product.findUnique({
      where: { id: Number(productId) }
    })

    if (!product) {
      return res.json(error('商品不存在'))
    }

    if (product.status !== 'ACTIVE') {
      return res.json(error('商品已下架'))
    }

    if (product.stock <= 0) {
      return res.json(error('商品库存不足'))
    }

    // 检查用户积分是否足够
    const userPoint = await prisma.userPoint.findFirst({
      where: { userId }
    })

    if (!userPoint || userPoint.availablePoints < product.pricePoints) {
      return res.json(error('积分不足'))
    }

    // 创建兑换订单，扣减积分，扣减库存
    const orderNo = generateOrderNo('EX')

    const result = await prisma.$transaction(async (tx) => {
      // 创建订单
      const order = await tx.exchangeOrder.create({
        data: {
          orderNo,
          userId,
          productId: product.id,
          pointsCost: product.pricePoints,
          address,
          contactName,
          contactPhone
        }
      })

      // 扣减用户积分
      await tx.userPoint.update({
        where: { userId },
        data: {
          availablePoints: {
            decrement: product.pricePoints
          },
          usedPoints: {
            increment: product.pricePoints
          }
        }
      })

      // 扣减商品库存
      await tx.product.update({
        where: { id: product.id },
        data: {
          stock: {
            decrement: 1
          }
        }
      })

      // 创建积分流水记录
      await tx.pointRecord.create({
        data: {
          userId,
          merchantId: 0, // 平台兑换，商家填 0
          points: -product.pricePoints,
          type: 'EXCHANGE',
          expireAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 一年后过期，这里只是占位
        }
      })

      return order
    })

    return res.json(success(result, '兑换成功'))
  } catch (err) {
    console.error('兑换礼品错误:', err)
    return res.json(error('兑换失败'))
  }
}

// 获取用户兑换订单列表
export const getExchangeOrders = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.json(error('未授权'))
    }

    const { page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const [orders, total] = await Promise.all([
      prisma.exchangeOrder.findMany({
        where: { userId },
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' },
        include: {
          product: true
        }
      }),
      prisma.exchangeOrder.count({ where: { userId } })
    ])

    return res.json(success({
      orders,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }))
  } catch (err) {
    console.error('获取兑换订单错误:', err)
    return res.json(error('获取失败'))
  }
}

// 获取用户信息
export const getProfile = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.json(error('未授权'))
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        createdAt: true
      }
    })

    return res.json(success(user))
  } catch (err) {
    console.error('获取用户信息错误:', err)
    return res.json(error('获取失败'))
  }
}

// 更新用户信息
export const updateProfile = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) {
      return res.json(error('未授权'))
    }

    const { nickname, avatar } = req.body

    const user = await prisma.user.update({
      where: { id: userId },
      data: { nickname, avatar },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        createdAt: true
      }
    })

    return res.json(success(user, '更新成功'))
  } catch (err) {
    console.error('更新用户信息错误:', err)
    return res.json(error('更新失败'))
  }
}

// 商家查询用户信息（需要商家认证）
export const getUserById = async (req: UserRequest, res: Response) => {
  try {
    const userId = Number(req.params.id)

    if (!userId) {
      return res.json(error('用户ID不能为空'))
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true
      }
    })

    if (!user) {
      return res.json(error('用户不存在'))
    }

    // 同时查询用户积分信息
    const userPoint = await prisma.userPoint.findFirst({
      where: { userId }
    })

    return res.json(success({
      ...user,
      totalPoints: userPoint?.totalPoints || 0,
      availablePoints: userPoint?.availablePoints || 0
    }))
  } catch (err) {
    console.error('查询用户信息错误:', err)
    return res.json(error('查询失败'))
  }
}
