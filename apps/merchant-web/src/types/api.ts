
// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 登录请求
export interface LoginRequest {
  phone: string
  password: string
}

// 登录响应
export interface LoginResponse {
  token: string
  merchant: MerchantInfo
}

// 商家信息
export interface MerchantInfo {
  id: string
  name: string
  phone: string
  pointRatio: number // 积分比例：消费1元赠送多少积分
  balance: number // 当前积分余额
  deposit: number // 保证金
  status: number
  createdAt: string
}

// 首页统计数据
export interface DashboardStats {
  currentBalance: number
  totalPointsSent: number
  todayPointsSent: number
}

// 发积分请求
export interface SendPointsRequest {
  userPhone: string
  amount: number // 消费金额
}

// 发积分响应
export interface SendPointsResponse {
  points: number // 计算出的积分数
  newBalance: number
}

// 积分流水记录
export interface PointTransaction {
  id: string
  userPhone: string
  amount: number // 消费金额
  points: number // 发放积分数
  createdAt: string
}

// 积分流水响应
export interface PointTransactionListResponse {
  list: PointTransaction[]
  total: number
  page: number
  pageSize: number
}

// 充值订单请求
export interface CreateRechargeRequest {
  amount: number // 充值金额（购买多少积分）
}

// 充值订单响应
export interface CreateRechargeResponse {
  orderNo: string
  amount: number
  points: number
  qrcodeUrl: string
}

// 充值记录
export interface RechargeOrder {
  id: string
  orderNo: string
  amount: number
  points: number
  status: number // 0-待支付 1-已支付 2-已取消
  createdAt: string
  paidAt?: string
}

// 充值记录响应
export interface RechargeListResponse {
  list: RechargeOrder[]
  total: number
  page: number
  pageSize: number
}

// 修改密码请求
export interface ChangePasswordRequest {
  oldPassword: string
  newPassword: string
}

// 更新积分比例请求
export interface UpdatePointRatioRequest {
  pointRatio: number
}

// 余额信息
export interface BalanceInfo {
  currentBalance: number
  deposit: number
  totalRecharged: number
  totalPointsSent: number
}
