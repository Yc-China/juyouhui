const dayjs = require('dayjs');

// 生成订单号
function generateOrderNo(prefix = '') {
  const date = dayjs().format('YYYYMMDDHHmmss');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${date}${random}`;
}

module.exports = { generateOrderNo };
