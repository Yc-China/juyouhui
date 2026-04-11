import { ApiResponse } from '../types'

export const success = <T>(data?: T, message = '操作成功'): ApiResponse<T> => {
  return {
    code: 0,
    message,
    data
  }
}

export const error = (message = '操作失败', code = 1): ApiResponse => {
  return {
    code,
    message
  }
}

export const generateOrderNo = (prefix: string): string => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${prefix}${timestamp.slice(-8)}${random}`
}

export const calculatePoints = (consumptionAmount: number, pointRule: number): number => {
  // consumptionAmount 单位是分，pointRule 是每 1 元赠送多少积分
  // 例如：消费 100元 (10000分)，pointRule = 1，那么获得 100 * 1 = 100积分
  const yuan = consumptionAmount / 100
  return Math.floor(yuan * pointRule)
}
