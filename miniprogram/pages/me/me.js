// me.js
const { api } = require('../../utils/api');
const app = getApp();

Page({
  data: {
    userInfo: {}
  },

  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      });
    } else {
      this.loadUserInfo();
    }
  },

  loadUserInfo() {
    api.getUserInfo().then(res => {
      this.setData({
        userInfo: res
      });
      app.globalData.userInfo = res;
    }).catch(err => {
      console.error('获取用户信息失败', err);
    });
  },

  // 跳转到积分流水
  goToPoints() {
    wx.navigateTo({
      url: '/pages/points/points'
    });
  },

  // 跳转到我的订单
  goToExchange() {
    wx.switchTab({
      url: '/pages/exchange/exchange'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearToken();
          wx.redirectTo({
            url: '/pages/index/index'
          });
        }
      }
    });
  }
});
