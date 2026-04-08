import { get, post, put, del } from '../utils/request'
import type {
  LoginResponse,
  Product,
  Stats,
  PaginationParams
} from '../types'

// 管理员登录
export const login = (username: string, password: string) => {
  return post<LoginResponse>('/login', { username, password })
}

// 获取商家申请列表
export interface GetApplicationsParams extends Partial<PaginationParams> {
  status?: string
}

export const getApplications = (params: GetApplicationsParams) => {
  return get('/applications', params)
}

// 审核通过商家申请
export const approveApplication = (applicationId: number, password: string) => {
  return post(`/applications/${applicationId}/approve`, { password })
}

// 拒绝商家申请
export const rejectApplication = (applicationId: number, remark?: string) => {
  return post(`/applications/${applicationId}/reject`, { remark })
}

// 获取商家列表
export interface GetMerchantsParams extends Partial<PaginationParams> {
  status?: string
  keyword?: string
}

export const getMerchants = (params: GetMerchantsParams) => {
  return get('/merchants', params)
}

// 更新商家状态
export const updateMerchantStatus = (merchantId: number, status: 'APPROVED' | 'DISABLED') => {
  return put(`/merchants/${merchantId}/status`, { status })
}

// 获取礼品列表
export interface GetProductsParams extends Partial<PaginationParams> {
  status?: string
}

export const getProducts = (params: GetProductsParams) => {
  return get('/products', params)
}

// 创建礼品
export interface CreateProductData {
  name: string
  description?: string
  image?: string
  pricePoints: number
  stock: number
}

export const createProduct = (data: CreateProductData) => {
  return post<Product>('/products', data)
}

// 更新礼品
export interface UpdateProductData extends Partial<CreateProductData> {
  status?: 'ACTIVE' | 'INACTIVE'
}

export const updateProduct = (productId: number, data: UpdateProductData) => {
  return put<Product>(`/products/${productId}`, data)
}

// 下架礼品
export const deleteProduct = (productId: number) => {
  return del(`/products/${productId}`)
}

// 获取兑换订单列表
export interface GetExchangeOrdersParams extends Partial<PaginationParams> {
  status?: string
}

export const getExchangeOrders = (params: GetExchangeOrdersParams) => {
  return get('/exchange-orders', params)
}

// 发货
export const shipOrder = (orderId: number) => {
  return post(`/exchange-orders/${orderId}/ship`)
}

// 完成订单
export const completeOrder = (orderId: number) => {
  return post(`/exchange-orders/${orderId}/complete`)
}

// 获取统计数据
export const getStats = () => {
  return get<Stats>('/stats')
}
