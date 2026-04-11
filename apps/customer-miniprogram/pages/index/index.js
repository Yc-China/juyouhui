// index.js
const { api } = require('../../utils/api');
const app = getApp();

Page({
  data: {
    isLogin: false,
    userInfo: {
      availablePoints: 0,
      totalPoints: 0
    }
  },

  onLoad() {
    this.checkLogin();
  },

  onShow() {
    if (this.data.isLogin) {
      this.loadUserInfo();
    }
  },

  // 检查登录状态
  checkLogin() {
    const isLogin = app.isLogin();
    this.setData({
      isLogin
    });
    if (isLogin) {
      this.loadUserInfo();
    }
  },

  // 获取手机号
  getPhoneNumber(e) {
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      wx.showToast({
        title: '需要授权手机号才能登录',
        icon: 'none'
      });
      return;
    }

    // 先获取code
    wx.login({
      success: (loginRes) => {
        const code = loginRes.code;
        // 调用登录接口
        api.login(code, e.detail.encryptedData, e.detail.iv).then(res => {
          app.setToken(res.token);
          app.globalData.userInfo = res.userInfo;
          this.setData({
            isLogin: true,
            userInfo: {
              availablePoints: res.userInfo.availablePoints,
              totalPoints: res.userInfo.totalPoints
            }
          });
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        }).catch(err => {
          console.error('登录失败', err);
        });
      }
    });
  },

  // 加载用户信息
  loadUserInfo() {
    api.getUserInfo().then(res => {
      this.setData({
        userInfo: {
          availablePoints: res.availablePoints,
          totalPoints: res.totalPoints
        }
      });
      app.globalData.userInfo = res;
    }).catch(err => {
      console.error('获取用户信息失败', err);
    });
  },

  // 跳转兑换礼品
  goToProducts() {
    wx.switchTab({
      url: '/pages/products/products'
    });
  },

  // 跳转积分流水
  goToPoints() {
    wx.navigateTo({
      url: '/pages/points/points'
    });
  },

  // 跳转兑换记录
  goToExchange() {
    wx.switchTab({
      url: '/pages/exchange/exchange'
    });
  },

  // 跳转个人中心
  goToMe() {
    wx.switchTab({
      url: '/pages/me/me'
    });
  }
});
