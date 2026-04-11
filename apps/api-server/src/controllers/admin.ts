import { Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'
import { success, error } from '../utils'
import { AdminRequest } from '../types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const DEPOSIT_AMOUNT = 50000 // 500元保证金

// 管理员登录
export const login = async (req: AdminRequest, res: Response) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.json(error('用户名和密码不能为空'))
    }

    const admin = await prisma.admin.findUnique({
      where: { username }
    })

    if (!admin) {
      return res.json(error('用户名或密码错误'))
    }

    const isValidPassword = await bcrypt.compare(password, admin.passwordHash)
    if (!isValidPassword) {
      return res.json(error('用户名或密码错误'))
    }

    const token = jwt.sign(
      { id: admin.id, type: 'admin' },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    )

    return res.json(success({
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name
      }
    }, '登录成功'))
  } catch (err) {
    console.error('管理员登录错误:', err)
    return res.json(error('登录失败'))
  }
}

// 获取商家入驻申请列表
export const getApplications = async (req: AdminRequest, res: Response) => {
  try {
    const { status, page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const where: any = {}
    if (status) {
      where.status = status as any
    }

    const [applications, total] = await Promise.all([
      prisma.merchantApplication.findMany({
        where,
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.merchantApplication.count({ where })
    ])

    return res.json(success({
      applications,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }))
  } catch (err) {
    console.error('获取申请列表错误:', err)
    return res.json(error('获取失败'))
  }
}

// 审核通过商家申请
export const approveApplication = async (req: AdminRequest, res: Response) => {
  try {
    const { applicationId } = req.params
    const application = await prisma.merchantApplication.findUnique({
      where: { id: Number(applicationId) }
    })

    if (!application) {
      return res.json(error('申请不存在'))
    }

    if (application.status !== 'PENDING') {
      return res.json(error('申请已处理'))
    }

    const { password } = req.body
    if (!password) {
      return res.json(error('请设置商家登录密码'))
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // 创建商家账号
    await prisma.$transaction(async (tx) => {
      // 创建商家
      const merchant = await tx.merchant.create({
        data: {
          name: application.name,
          contactName: application.contactName,
          contactPhone: application.contactPhone,
          address: application.address,
          businessLicense: application.businessLicense,
          passwordHash,
          deposit: DEPOSIT_AMOUNT,
          status: 'APPROVED'
        }
      })

      // 更新申请状态
      await tx.merchantApplication.update({
        where: { id: application.id },
        data: {
          status: 'APPROVED',
          merchantId: merchant.id
        }
      })
    })

    return res.json(success(null, '审核通过，商家账号已创建'))
  } catch (err) {
    console.error('审核通过错误:', err)
    return res.json(error('审核失败'))
  }
}

// 拒绝商家申请
export const rejectApplication = async (req: AdminRequest, res: Response) => {
  try {
    const { applicationId } = req.params
    const { remark } = req.body

    const application = await prisma.merchantApplication.findUnique({
      where: { id: Number(applicationId) }
    })

    if (!application) {
      return res.json(error('申请不存在'))
    }

    if (application.status !== 'PENDING') {
      return res.json(error('申请已处理'))
    }

    await prisma.merchantApplication.update({
      where: { id: application.id },
      data: {
        status: 'REJECTED',
        remark: remark || '拒绝'
      }
    })

    return res.json(success(null, '已拒绝申请'))
  } catch (err) {
    console.error('拒绝申请错误:', err)
    return res.json(error('操作失败'))
  }
}

// 获取商家列表
export const getMerchants = async (req: AdminRequest, res: Response) => {
  try {
    const { status, keyword, page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const where: any = {}
    if (status) {
      where.status = status as any
    }
    if (keyword) {
      where.OR = [
        { name: { contains: keyword as string } },
        { contactPhone: { contains: keyword as string } }
      ]
    }

    const [merchants, total] = await Promise.all([
      prisma.merchant.findMany({
        where,
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' },
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
      }),
      prisma.merchant.count({ where })
    ])

    return res.json(success({
      merchants,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    }))
  } catch (err) {
    console.error('获取商家列表错误:', err)
    return res.json(error('获取失败'))
  }
}

// 禁用/启用商家
export const updateMerchantStatus = async (req: AdminRequest, res: Response) => {
  try {
    const { merchantId } = req.params
    const { status } = req.body

    await prisma.merchant.update({
      where: { id: Number(merchantId) },
      data: { status }
    })

    return res.json(success(null, '状态更新成功'))
  } catch (err) {
    console.error('更新商家状态错误:', err)
    return res.json(error('更新失败'))
  }
}

// 创建礼品
export const createProduct = async (req: AdminRequest, res: Response) => {
  try {
    const { name, description, image, pricePoints, stock } = req.body

    if (!name || !pricePoints || pricePoints <= 0 || stock === undefined) {
      return res.json(error('请填写完整信息'))
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        image: image || '',
        pricePoints: Number(pricePoints),
        stock: Number(stock)
      }
    })

    return res.json(success(product, '创建成功'))
  } catch (err) {
    console.error('创建礼品错误:', err)
    return res.json(error('创建失败'))
  }
}

// 更新礼品
export const updateProduct = async (req: AdminRequest, res: Response) => {
  try {
    const { productId } = req.params
    const { name, description, image, pricePoints, stock, status } = req.body

    const product = await prisma.product.update({
      where: { id: Number(productId) },
      data: {
        name,
        description,
        image,
        pricePoints,
        stock,
        status
      }
    })

    return res.json(success(product, '更新成功'))
  } catch (err) {
    console.error('更新礼品错误:', err)
    return res.json(error('更新失败'))
  }
}

// 删除礼品（软删除改为下架）
export const deleteProduct = async (req: AdminRequest, res: Response) => {
  try {
    const { productId } = req.params

    await prisma.product.update({
      where: { id: Number(productId) },
      data: { status: 'INACTIVE' }
    })

    return res.json(success(null, '下架成功'))
  } catch (err) {
    console.error('删除礼品错误:', err)
    return res.json(error('操作失败'))
  }
}

// 获取礼品列表
export const getProducts = async (req: AdminRequest, res: Response) => {
  try {
    const { status, page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const where: any = {}
    if (status) {
      where.status = status as any
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
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

// 获取兑换订单列表
export const getExchangeOrders = async (req: AdminRequest, res: Response) => {
  try {
    const { status, page = 1, pageSize = 10 } = req.query
    const skip = (Number(page) - 1) * Number(pageSize)

    const where: any = {}
    if (status) {
      where.status = status as any
    }

    const [orders, total] = await Promise.all([
      prisma.exchangeOrder.findMany({
        where,
        skip,
        take: Number(pageSize),
        orderBy: { createdAt: 'desc' },
        include: {
          product: true,
          user: {
            select: {
              id: true,
              phone: true,
              nickname: true
            }
          }
        }
      }),
      prisma.exchangeOrder.count({ where })
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

// 发货处理
export const shipOrder = async (req: AdminRequest, res: Response) => {
  try {
    const { orderId } = req.params

    const order = await prisma.exchangeOrder.findUnique({
      where: { id: Number(orderId) }
    })

    if (!order) {
      return res.json(error('订单不存在'))
    }

    if (order.status !== 'PENDING') {
      return res.json(error('订单状态不允许发货'))
    }

    await prisma.exchangeOrder.update({
      where: { id: Number(orderId) },
      data: {
        status: 'SHIPPED',
        shippedAt: new Date()
      }
    })

    return res.json(success(null, '已标记为已发货'))
  } catch (err) {
    console.error('发货处理错误:', err)
    return res.json(error('操作失败'))
  }
}

// 完成订单
export const completeOrder = async (req: AdminRequest, res: Response) => {
  try {
    const { orderId } = req.params

    const order = await prisma.exchangeOrder.findUnique({
      where: { id: Number(orderId) }
    })

    if (!order) {
      return res.json(error('订单不存在'))
    }

    if (order.status !== 'SHIPPED') {
      return res.json(error('请先标记发货'))
    }

    await prisma.exchangeOrder.update({
      where: { id: Number(orderId) },
      data: {
        status: 'COMPLETED'
      }
    })

    return res.json(success(null, '订单已完成'))
  } catch (err) {
    console.error('完成订单错误:', err)
    return res.json(error('操作失败'))
  }
}

// 统计数据
export const getStats = async (req: AdminRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalMerchants,
      pendingApplications,
      approvedMerchants,
      totalPointsIssued,
      totalPointsExchanged,
      pendingExchangeOrders,
      totalProducts
    ] = await Promise.all([
      prisma.user.count(),
      prisma.merchant.count(),
      prisma.merchantApplication.count({ where: { status: 'PENDING' } }),
      prisma.merchant.count({ where: { status: 'APPROVED' } }),
      prisma.pointRecord.aggregate({
        _sum: {
          points: true
        },
        where: { type: 'EARN' }
      }),
      prisma.pointRecord.aggregate({
        _sum: {
          points: true
        },
        where: { type: 'EXCHANGE' }
      }),
      prisma.exchangeOrder.count({ where: { status: 'PENDING' } }),
      prisma.product.count({ where: { status: 'ACTIVE' } })
    ])

    return res.json(success({
      totalUsers,
      totalMerchants,
      pendingApplications,
      approvedMerchants,
      totalPointsIssued: totalPointsIssued._sum.points || 0,
      totalPointsExchanged: Math.abs(totalPointsExchanged._sum.points || 0),
      pendingExchangeOrders,
      totalProducts
    }))
  } catch (err) {
    console.error('获取统计数据错误:', err)
    return res.json(error('获取失败'))
  }
}
