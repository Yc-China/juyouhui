// points.js
const { api } = require('../../utils/api');

Page({
  data: {
    list: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false,
    loadingMore: false
  },

  onLoad() {
    this.loadList();
  },

  // 加载列表
  loadList() {
    if (this.data.loading) return;

    this.setData({ loading: true });
    api.getPointsLog(this.data.page, this.data.pageSize).then(res => {
      this.setData({
        list: this.data.page === 1 ? res.list : this.data.list.concat(res.list),
        hasMore: res.list.length >= this.data.pageSize,
        loading: false
      });
    }).catch(err => {
      this.setData({ loading: false });
      console.error('获取积分流水失败', err);
    });
  },

  // 加载更多
  onReachBottom() {
    if (!this.data.hasMore || this.data.loadingMore) return;

    this.setData({
      loadingMore: true,
      page: this.data.page + 1
    });

    api.getPointsLog(this.data.page, this.data.pageSize).then(res => {
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
