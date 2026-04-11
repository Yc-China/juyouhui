// order-detail.js
const { api } = require('../../utils/api');

Page({
  data: {
    orderId: null,
    order: null,
    loading: false
  },

  onLoad(options) {
    this.setData({
      orderId: options.orderId
    });
    this.loadOrderDetail();
  },

  loadOrderDetail() {
    this.setData({ loading: true });
    api.getExchangeOrderDetail(this.data.orderId).then(res => {
      this.setData({
        order: res,
        loading: false
      });
      wx.setNavigationBarTitle({
        title: `订单详情${res.orderNo}`
      });
    }).catch(err => {
      this.setData({ loading: false });
      console.error('获取订单详情失败', err);
    });
  },

  getStatusText(status) {
    const statusMap = {
      0: '待发货',
      1: '已发货',
      2: '已完成',
      3: '已取消'
    };
    return statusMap[status] || '未知';
  },

  getStatusClass(status) {
    const classMap = {
      0: 'status-wait',
      1: 'status-send',
      2: 'status-done',
      3: 'status-cancel'
    };
    return classMap[status] || '';
  }
});
