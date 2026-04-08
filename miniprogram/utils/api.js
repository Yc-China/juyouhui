const app = getApp();

// 请求封装
const request = (url, method, data = {}) => {
  return new Promise((resolve, reject) => {
    const token = app.globalData.token;
    const header = {
      'Content-Type': 'application/json',
    };
    if (token) {
      header['Authorization'] = `Bearer ${token}`;
    }

    wx.request({
      url: app.globalData.baseUrl + url,
      method,
      data,
      header,
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 0) {
            resolve(res.data.data);
          } else {
            wx.showToast({
              title: res.data.message || '请求失败',
              icon: 'none'
            });
            // 如果是未授权，清除token跳登录
            if (res.data.code === 401) {
              app.clearToken();
              app.goToLogin();
            }
            reject(res.data);
          }
        } else if (res.statusCode === 401) {
          app.clearToken();
          app.goToLogin();
          reject(res);
        } else {
          wx.showToast({
            title: '网络请求失败',
            icon: 'none'
          });
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'none'
        });
        reject(err);
      }
    });
  });
};

// API接口
const api = {
  // 登录，获取code后换取token
  login: (code, phoneNumber) => {
    return request('/api/auth/login', 'POST', { code, phoneNumber });
  },

  // 获取用户信息和积分信息
  getUserInfo: () => {
    return request('/api/user/info', 'GET');
  },

  // 获取积分流水
  getPointsLog: (page = 1, pageSize = 20) => {
    return request('/api/points/log', 'GET', { page, pageSize });
  },

  // 获取礼品列表
  getProducts: (page = 1, pageSize = 20) => {
    return request('/api/products/list', 'GET', { page, pageSize });
  },

  // 获取礼品详情
  getProductDetail: (id) => {
    return request(`/api/products/${id}`, 'GET');
  },

  // 创建兑换订单
  createExchangeOrder: (data) => {
    return request('/api/exchange/create', 'POST', data);
  },

  // 获取兑换订单列表
  getExchangeOrders: (page = 1, pageSize = 20) => {
    return request('/api/exchange/orders', 'GET', { page, pageSize });
  },

  // 获取兑换订单详情
  getExchangeOrderDetail: (orderId) => {
    return request(`/api/exchange/orders/${orderId}`, 'GET');
  },

  // 获取地址列表
  getAddresses: () => {
    return request('/api/address/list', 'GET');
  },

  // 添加/更新地址
  saveAddress: (data) => {
    return request('/api/address/save', 'POST', data);
  }
};

module.exports = {
  request,
  api
};
