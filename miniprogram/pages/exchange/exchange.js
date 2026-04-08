// exchange.js
const { api } = require('../../utils/api');
const util = require('../../utils/util');

Page({
  data: {
    productId: null,
    product: null,
    requiredPoints: 0,
    availablePoints: 0,
    address: null,
    enoughPoints: false,
    canExchange: false,

    // 订单列表数据
    list: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    loadingMore: false,
    statusText: {
      0: '待发货',
      1: '已发货',
      2: '已完成',
      3: '已取消'
    }
  },

  onLoad(options) {
    if (options.productId) {
      // 创建兑换订单页面
      this.setData({
        productId: options.productId,
        requiredPoints: parseInt(options.points) || 0
      });
      this.loadProductDetail();
      this.loadUserInfo();
      this.loadAddress();
    } else {
      // 订单列表页面
      wx.setNavigationBarTitle({ title: '兑换记录' });
      this.loadOrderList();
    }
  },

  // 加载商品详情
  loadProductDetail() {
    api.getProductDetail(this.data.productId).then(res => {
      this.setData({
        product: res
      });
    }).catch(err => {
      console.error('获取商品详情失败', err);
    });
  },

  // 加载用户积分信息
  loadUserInfo() {
    api.getUserInfo().then(res => {
      this.setData({
        availablePoints: res.availablePoints,
        enoughPoints: res.availablePoints >= this.data.requiredPoints
      });
      this.checkCanExchange();
    });
  },

  // 加载地址
  loadAddress() {
    api.getAddresses().then(res => {
      // 默认使用第一个地址
      if (res.list && res.list.length > 0) {
        this.setData({
          address: res.list[0]
        });
        this.checkCanExchange();
      }
    });
  },

  // 选择地址
  selectAddress() {
    // TODO: 打开地址选择页面，这里简化处理，直接让用户填写
    wx.navigateTo({
      url: '../address/address'
    });
  },

  // 检查是否可以兑换
  checkCanExchange() {
    this.setData({
      canExchange: this.data.enoughPoints && !!this.data.address
    });
  },

  // 提交兑换
  submitExchange() {
    if (!this.data.canExchange) return;

    wx.showModal({
      title: '确认兑换',
      content: `确认使用 ${this.data.requiredPoints} 积分兑换「${this.data.product.name}」吗？`,
      success: (res) => {
        if (res.confirm) {
          api.createExchangeOrder({
            productId: this.data.productId,
            addressId: this.data.address.id,
            points: this.data.requiredPoints
          }).then(res => {
            wx.showToast({
              title: '兑换成功',
              icon: 'success'
            });
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/exchange/exchange'
              });
            }, 1500);
          }).catch(err => {
            console.error('兑换失败', err);
          });
        }
      }
    });
  },

  // ---------- 订单列表相关 ----------
  loadOrderList() {
    if (this.data.loading) return;

    this.setData({ loading: true });
    api.getExchangeOrders(this.data.page, this.data.pageSize).then(res => {
      this.setData({
        list: this.data.page === 1 ? res.list : this.data.list.concat(res.list),
        hasMore: res.list.length >= this.data.pageSize,
        loading: false
      });
    }).catch(err => {
      this.setData({ loading: false });
      console.error('获取订单列表失败', err);
    });
  },

  // 跳转到订单详情
  goToDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?orderId=${orderId}`
    });
  },

  // 加载更多
  onReachBottom() {
    if (this.data.productId) return; // 创建页面不需要加载更多

    if (!this.data.hasMore || this.data.loadingMore) return;

    this.setData({
      loadingMore: true,
      page: this.data.page + 1
    });

    api.getExchangeOrders(this.data.page, this.data.pageSize).then(res => {
      this.setData({
        list: this.data.list.concat(res.list),
        hasMore: res.list.length >= this.data.pageSize,
        loadingMore: false
      });
    }).catch(err => {
      this.setData({
        loadingMore: false,
        page: this.data.page - 1
      });
      console.error('加载更多失败', err);
    });
  }
});
