<script>
export default {
  onLaunch: function() {
    console.log('聚优惠商家小程序启动')
    // 检查登录状态
    const token = uni.getStorageSync('merchantToken')
    if (token) {
      uni.setStorageSync('token', token)
    }
  },
  globalData: {
    token: null,
    merchantInfo: null
  }
}
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
  font-size: 28rpx;
  color: #333;
}

.container {
  padding: 30rpx;
  box-sizing: border-box;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.btn {
  display: block;
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 44rpx;
  font-size: 32rpx;
  border: none;
}

.btn:active {
  opacity: 0.8;
}

.btn-block {
  margin-top: 40rpx;
}

.form-item {
  margin-bottom: 30rpx;
}

.form-item label {
  display: block;
  margin-bottom: 16rpx;
  font-size: 28rpx;
  color: #666;
}

.form-item input {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  box-sizing: border-box;
  background: #fafafa;
}

.form-item input:focus {
  border-color: #667eea;
  background: #fff;
}

.text-center {
  text-align: center;
}

.text-primary {
  color: #667eea;
}

.text-success {
  color: #52c41a;
}

.text-warning {
  color: #faad14;
}

.text-error {
  color: #ff4d4f;
}

.mt-10 {
  margin-top: 20rpx;
}

.mt-20 {
  margin-top: 40rpx;
}

.mb-10 {
  margin-bottom: 20rpx;
}

.mb-20 {
  margin-bottom: 40rpx;
}

.flex {
  display: flex;
}

.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-1 {
  flex: 1;
}

.stat-item {
  text-align: center;
  padding: 20rpx;
}

.stat-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #667eea;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 10rpx;
}
</style>
