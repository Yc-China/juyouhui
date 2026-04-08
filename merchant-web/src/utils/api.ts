import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  MerchantInfo,
  DashboardStats,
  SendPointsRequest,
  SendPointsResponse,
  PointTransactionListResponse,
  CreateRechargeRequest,
  CreateRechargeResponse,
  RechargeListResponse,
  ChangePasswordRequest,
  UpdatePointRatioRequest,
  BalanceInfo,
} from '../types/api'

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

// 获取存储的token
function getToken(): string | null {
  return localStorage.getItem('merchant_token')
}

// 设置token
export function setToken(token: string): void {
  localStorage.setItem('merchant_token', token)
}

// 移除token
export function removeToken(): void {
  localStorage.removeItem('merchant_token')
}

// 判断是否已登录
export function isAuthenticated(): boolean {
  return !!getToken()
}

// 通用请求封装
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const data = await response.json()
  return data
}

// 登录
export async function login(params: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  // 后端期望字段是 contactPhone，前端叫 phone，转换一下
  const { phone, password } = params
  return request('/merchant/login', {
    method: 'POST',
    body: JSON.stringify({ contactPhone: phone, password }),
  })
}

// 退出登录
export async function logout(): Promise<ApiResponse<void>> {
  return request('/merchant/logout', {
    method: 'POST',
  })
}

// 获取商家信息
export async function getMerchantInfo(): Promise<ApiResponse<MerchantInfo>> {
  return request('/merchant/profile')
}

// 获取首页统计
export async function getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
  return request('/merchant/dashboard/stats')
}

// 发积分
export async function sendPoints(params: SendPointsRequest): Promise<ApiResponse<SendPointsResponse>> {
  return request('/merchant/points/add', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

// 获取积分流水
export async function getPointTransactions(page: number = 1, pageSize: number = 20): Promise<ApiResponse<PointTransactionListResponse>> {
  return request(`/merchant/points/records?page=${page}&pageSize=${pageSize}`)
}

// 创建充值订单
export async function createRechargeOrder(params: CreateRechargeRequest): Promise<ApiResponse<CreateRechargeResponse>> {
  return request('/merchant/recharge', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

// 获取充值记录
export async function getRechargeOrders(page: number = 1, pageSize: number = 20): Promise<ApiResponse<RechargeListResponse>> {
  return request(`/merchant/recharge/records?page=${page}&pageSize=${pageSize}`)
}

// 修改密码
export async function changePassword(params: ChangePasswordRequest): Promise<ApiResponse<void>> {
  return request('/merchant/settings/password', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

// 更新积分比例
export async function updatePointRatio(params: UpdatePointRatioRequest): Promise<ApiResponse<void>> {
  return request('/merchant/settings/point-ratio', {
    method: 'POST',
    body: JSON.stringify(params),
  })
}

// 获取余额信息
export async function getBalanceInfo(): Promise<ApiResponse<BalanceInfo>> {
  return request('/merchant/balance')
}

export default {
  login,
  logout,
  getMerchantInfo,
  getDashboardStats,
  sendPoints,
  getPointTransactions,
  createRechargeOrder,
  getRechargeOrders,
  changePassword,
  updatePointRatio,
  getBalanceInfo,
  setToken,
  removeToken,
  isAuthenticated,
}
