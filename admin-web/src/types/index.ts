// 通用API响应类型
export interface ApiResponse<T> {
  code: number
  data: T
  message: string
  success: boolean
}

// 分页响应类型
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 管理员信息
export interface Admin {
  id: number
  username: string
  name: string
}

// 登录响应
export interface LoginResponse {
  token: string
  admin: Admin
}

// 商家申请
export interface MerchantApplication {
  id: number
  name: string
  contactName: string
  contactPhone: string
  address: string
  businessLicense: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  remark: string | null
  merchantId: number | null
  createdAt: string
  updatedAt: string
}

// 商家
export interface Merchant {
  id: number
  name: string
  contactName: string
  contactPhone: string
  address: string
  businessLicense: string
  deposit: number
  balancePoints: number
  pointRule: number
  status: 'APPROVED' | 'DISABLED'
  createdAt: string
}

// 礼品
export interface Product {
  id: number
  name: string
  description: string
  image: string
  pricePoints: number
  stock: number
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

// 兑换订单
export interface ExchangeOrder {
  id: number
  orderNo: string
  userId: number
  productId: number
  product: Product
  user: {
    id: number
    phone: string
    nickname: string
  }
  address: string
  receiverName: string
  receiverPhone: string
  status: 'PENDING' | 'SHIPPED' | 'COMPLETED'
  shippedAt: string | null
  completedAt: string | null
  createdAt: string
}

// 统计数据
export interface Stats {
  totalUsers: number
  totalMerchants: number
  pendingApplications: number
  approvedMerchants: number
  totalPointsIssued: number
  totalPointsExchanged: number
  pendingExchangeOrders: number
  totalProducts: number
}

// 分页查询参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 状态枚举映射
export const StatusMap = {
  // 商家申请状态
  PENDING: { text: '待审核', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { text: '已通过', color: 'bg-green-100 text-green-800' },
  REJECTED: { text: '已拒绝', color: 'bg-red-100 text-red-800' },
  // 商家状态
  DISABLED: { text: '已禁用', color: 'bg-gray-100 text-gray-800' },
  // 礼品状态
  INACTIVE: { text: '已下架', color: 'bg-gray-100 text-gray-800' },
  ACTIVE: { text: '上架中', color: 'bg-green-100 text-green-800' },
  // 订单状态
  SHIPPED: { text: '已发货', color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { text: '已完成', color: 'bg-green-100 text-green-800' },
}
