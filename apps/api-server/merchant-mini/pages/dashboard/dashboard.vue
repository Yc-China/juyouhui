<template>
  <view class="container">
    <!-- 欢迎信息 -->
    <view class="card welcome-card">
      <view class="welcome-text">
        <text class="greeting">欢迎回来，{{ merchantInfo?.name || '商家' }}</text>
      </view>
      <view class="logout-btn" @tap="handleLogout">退出登录</view>
    </view>

    <!-- 数据统计 -->
    <view class="card stats-card">
      <view class="flex">
        <view class="flex-1 stat-item">
          <view class="stat-value">{{ stats.balance }}</view>
          <view class="stat-label">当前积分余额</view>
        </view>
        <view class="flex-1 stat-item">
          <view class="stat-value">{{ stats.todayGranted }}</view>
          <view class="stat-label">今日发放积分</view>
        </view>
      </view>
      <view class="flex">
        <view class="flex-1 stat-item">
          <view class="stat-value">{{ stats.storeCount }}</view>
          <view class="stat-label">门店数量</view>
        </view>
        <view class="flex-1 stat-item">
          <view class="stat-value">{{ stats.rechargeCount }}</view>
          <view class="stat-label">成功充值次数</view>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="card quick-card">
      <view class="card-title">快捷操作</view>
      <view class="quick-list">
        <view class="quick-item" @tap="goToGrant">
          <view class="quick-icon grant-icon">🎁</view>
          <view class="quick-text">发放积分</view>
        </view>
        <view class="quick-item" @tap="goToRecharge">
          <view class="quick-icon recharge-icon">💰</view>
          <view class="quick-text">积分充值</view>
        </view>
        <view class="quick-item" @tap="goToStores">
          <view class="quick-icon store-icon">🏪</view>
          <view class="quick-text">门店管理</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getDashboard } from '../../api/merchant'

export default {
  data() {
    return {
      merchantInfo: null,
      stats: {
        balance: 0,
        totalRecharge: 0,
        totalConsumed: 0,
        storeCount: 0,
        rechargeCount: 0,
        todayGranted: 0
      }
    }
  },
  onShow() {
    this.merchantInfo = uni.getStorageSync('merchantInfo')
    this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      try {
        const res = await getDashboard()
        this.stats = res
      } catch (err) {
        console.error(err)
      }
    },
    goToGrant() {
      uni.switchTab({
        url: '/pages/grant/grant'
      })
    },
    goToRecharge() {
      uni.switchTab({
        url: '/pages/recharge/recharge'
      })
    },
    goToStores() {
      uni.switchTab({
        url: '/pages/stores/stores'
      })
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.removeStorageSync('merchantToken')
            uni.removeStorageSync('merchantInfo')
            uni.reLaunch({
              url: '/pages/login/login'
            })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.welcome-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text .greeting {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.logout-btn {
  font-size: 26rpx;
  color: #999;
  padding: 10rpx 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 20rpx;
}

.logout-btn:active {
  background: #f5f5f5;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

.quick-list {
  display: flex;
  justify-content: space-around;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200rpx;
}

.quick-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-bottom: 15rpx;
}

.grant-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.recharge-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.store-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.quick-text {
  font-size: 26rpx;
  color: #666;
}
</style>
