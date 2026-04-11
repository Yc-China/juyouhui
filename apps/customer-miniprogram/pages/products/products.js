// products.js
const { api } = require('../../utils/api');

Page({
  data: {
    list: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    loadingMore: false
  },

  onLoad() {
    this.loadList();
  },

  onShow() {
    // 每次显示页面刷新列表
    this.setData({
      page: 1,
      hasMore: true
    });
    this.loadList();
  },

  // 加载列表
  loadList() {
    if (this.data.loading) return;

    this.setData({ loading: true });
    api.getProducts(this.data.page, this.data.pageSize).then(res => {
      this.setData({
        list: this.data.page === 1 ? res.list : this.data.list.concat(res.list),
        hasMore: res.list.length >= this.data.pageSize,
        loading: false
      });
    }).catch(err => {
      this.setData({ loading: false });
      console.error('获取礼品列表失败', err);
    });
  },

  // 兑换礼品
  exchangeProduct(e) {
    const id = e.currentTarget.dataset.id;
    const points = e.currentTarget.dataset.points;
    wx.navigateTo({
      url: `/pages/exchange/exchange?productId=${id}&points=${points}`
    });
  },

  // 加载更多
  onReachBottom() {
    if (!this.data.hasMore || this.data.loadingMore) return;

    this.setData({
      loadingMore: true,
      page: this.data.page + 1
    });

    api.getProducts(this.data.page, this.data.pageSize).then(res => {
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
