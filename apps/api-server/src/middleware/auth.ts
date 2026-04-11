import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { error } from '../utils'
import { JwtPayload, UserRequest, MerchantRequest, AdminRequest } from '../types'

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key'

export const authUser = (req: UserRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(error('未提供认证令牌'))
  }

  const token = authHeader.slice(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    if (decoded.type !== 'user') {
      return res.status(403).json(error('令牌类型不匹配'))
    }
    req.user = {
      id: decoded.id,
      phone: '',
      type: 'user'
    }
    next()
  } catch (err) {
    next(err)
  }
}

export const authMerchant = (req: MerchantRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(error('未提供认证令牌'))
  }

  const token = authHeader.slice(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    if (decoded.type !== 'merchant') {
      return res.status(403).json(error('令牌类型不匹配'))
    }
    req.merchant = {
      id: decoded.id,
      name: '',
      type: 'merchant'
    }
    next()
  } catch (err) {
    next(err)
  }
}

export const authAdmin = (req: AdminRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(error('未提供认证令牌'))
  }

  const token = authHeader.slice(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    if (decoded.type !== 'admin') {
      return res.status(403).json(error('令牌类型不匹配'))
    }
    req.admin = {
      id: decoded.id,
      username: '',
      type: 'admin'
    }
    next()
  } catch (err) {
    next(err)
  }
}
