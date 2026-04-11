import { Request } from 'express'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

export interface UserRequest extends Request {
  user?: {
    id: number
    phone: string
    type: 'user'
  }
}

export interface MerchantRequest extends Request {
  merchant?: {
    id: number
    name: string
    type: 'merchant'
  }
}

export interface AdminRequest extends Request {
  admin?: {
    id: number
    username: string
    type: 'admin'
  }
}

export interface JwtPayload {
  id: number
  type: 'user' | 'merchant' | 'admin'
}
