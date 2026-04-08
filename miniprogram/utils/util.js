// 格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()

  return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute].map(formatNumber).join(':')}`;
};

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('-')}`;
};

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`;
};

// 订单状态文本
const getOrderStatusText = status => {
  const statusMap = {
    0: '待发货',
    1: '已发货',
    2: '已完成',
    3: '已取消'
  };
  return statusMap[status] || '未知状态';
};

// 积分类型文本
const getPointsTypeText = type => {
  const typeMap = {
    1: '获得积分',
    -1: '消耗积分'
  };
  return typeMap[type] || '其他';
};

module.exports = {
  formatTime,
  formatDate,
  formatNumber,
  getOrderStatusText,
  getPointsTypeText
};
