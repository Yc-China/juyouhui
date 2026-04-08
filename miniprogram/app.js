App({
  globalData: {
    token: null,
    userInfo: null,
    baseUrl: 'https://api.juyouhui.com', // 这里替换为实际的API地址
  },

  onLaunch() {
    // 检查本地存储中是否有token
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
    }
  },

  // 设置token
  setToken(token) {
    this.globalData.token = token;
    wx.setStorageSync('token', token);
  },

  // 清除token
  clearToken() {
    this.globalData.token = null;
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
  },

  // 判断是否登录
  isLogin() {
    return !!this.globalData.token;
  },

  // 跳转到登录页
  goToLogin() {
    wx.redirectTo({
      url: '/pages/index/index',
    });
  }
});
