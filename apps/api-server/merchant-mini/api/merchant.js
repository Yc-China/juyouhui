import request from '../utils/request'

// 商家登录
export const login = (phone, password) => {
  return request({
    url: '/api/merchant/login',
    method: 'POST',
    data: { phone, password }
  })
}

// 获取商家信息和积分数据
export const getInfo = () => {
  return request({
    url: '/api/merchant/info',
    method: 'GET'
  })
}

// 获取首页统计数据
export const getDashboard = () => {
  return request({
    url: '/api/merchant/dashboard',
    method: 'GET'
  })
}

// 获取门店列表
export const getStores = () => {
  return request({
    url: '/api/merchant/stores',
    method: 'GET'
  })
}

// 添加门店
export const addStore = (data) => {
  return request({
    url: '/api/merchant/stores',
    method: 'POST',
    data
  })
}

// 更新门店
export const updateStore = (id, data) => {
  return request({
    url: `/api/merchant/stores/${id}`,
    method: 'PUT',
    data
  })
}

// 删除门店
export const deleteStore = (id) => {
  return request({
    url: `/api/merchant/stores/${id}`,
    method: 'DELETE'
  })
}

// 创建充值订单
export const createRecharge = (points) => {
  return request({
    url: '/api/merchant/recharge',
    method: 'POST',
    data: { points }
  })
}

// 获取充值订单列表
export const getRechargeOrders = (page = 1, pageSize = 10) => {
  return request({
    url: '/api/merchant/recharge/orders',
    method: 'GET',
    data: { page, pageSize }
  })
}

// 发放积分给用户
export const grantPoints = (phone, points, storeId = null) => {
  return request({
    url: '/api/merchant/grant-points',
    method: 'POST',
    data: { phone, points, storeId }
  })
}
