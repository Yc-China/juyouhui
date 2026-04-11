// 基础配置 - 需要根据实际服务端地址修改
const BASE_URL = 'http://localhost:3000'

// 请求封装
const request = (options) => {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('merchantToken')
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
      success: (res) => {
        const data = res.data
        if (data.code === 0) {
          resolve(data.data)
        } else {
          uni.showToast({
            title: data.message || '请求失败',
            icon: 'none'
          })
          // 如果是未授权，跳转到登录页
          if (data.code === 401) {
            uni.removeStorageSync('merchantToken')
            uni.removeStorageSync('merchantInfo')
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }
          reject(data)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export default request
