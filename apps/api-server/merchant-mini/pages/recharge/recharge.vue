<template>
  <view class="container">
    <!-- 当前余额 -->
    <view class="card balance-card">
      <view class="flex-between">
        <text class="balance-label">当前积分余额</text>
        <text class="balance-value">{{ balance }}</text>
      </view>
    </view>

    <!-- 快速充值选项 -->
    <view class="card quick-recharge">
      <view class="card-title">选择充值数量</view>
      <view class="quick-options">
        <view 
          v-for="option in quickOptions" 
          :key="option"
          class="quick-option"
          :class="{ active: selectedQuick === option }"
          @tap="selectQuick(option)"
        >
          {{ option }} 积分
        </view>
      </view>
    </view>

    <!-- 自定义充值 -->
    <view class="card custom-recharge">
      <view class="form-item">
        <label>自定义积分数</label>
        <input 
          type="number" 
          v-model="customPoints" 
          placeholder="输入自定义充值数量"
        />
      </view>

      <view v-if="currentPoints > 0" class="price-preview">
        <view class="price-row">
          <text>充值数量：</text>
          <text>{{ currentPoints }} 积分</text>
        </view>
        <view class="price-row total">
          <text>应付金额：</text>
          <text>¥{{ amount.toFixed(2) }}</text>
        </view>
        <view class="price-note">注：1积分 = 0.01元</view>
      </view>

      <button 
        class="btn btn-block" 
        @tap="handleCreateOrder" 
        :loading="submitting"
      >
        {{ submitting ? '创建中...' : '立即充值' }}
      </button>
    </view>

    <!-- 订单列表 -->
    <view v-if="orders.length > 0" class="card order-list-card">
      <view class="card-title">充值订单</view>
      <view v-for="order in orders" :key="order.id" class="order-item">
        <view class="flex-between">
          <view class="order-info">
            <view class="order-no">订单号：{{ order.orderNo }}</view>
            <view class="order-info-text">{{ order.points }} 积分</view>
            <view class="order-time">{{ formatTime(order.createdAt) }}</view>
          </view>
          <view class="order-price">
            <view class="amount">¥{{ order.amount.toFixed(2) }}</view>
            <view class="status">
              <text :class="getStatusClass(order.status)">
                {{ getStatusText(order.status) }}
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 加载更多 -->
      <view v-if="hasMore" class="load-more text-center mt-20">
        <button class="load-more-btn" @tap="loadMore">加载更多</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getInfo, createRecharge, getRechargeOrders } from '../../api/merchant'

export default {
  data() {
    return {
      balance: 0,
      quickOptions: [100, 500, 1000, 5000],
      selectedQuick: null,
      customPoints: '',
      currentPoints: 0,
      amount: 0,
      submitting: false,
      orders: [],
      page: 1,
      pageSize: 10,
      total: 0,
      hasMore: false
    }
  },
  onShow() {
    this.loadBalance()
    this.loadOrders()
  },
  computed: {
    currentPoints() {
      if (this.customPoints && Number(this.customPoints) > 0) {
        return Number(this.customPoints)
      }
      return this.selectedQuick || 0
    },
    amount() {
      return this.currentPoints / 100
    }
  },
  methods: {
    async loadBalance() {
      try {
        const res = await getInfo()
        this.balance = res.points.balance
      } catch (err) {
        console.error(err)
      }
    },
    selectQuick(points) {
      this.selectedQuick = this.selectedQuick === points ? null : points
      this.customPoints = ''
    },
    async handleCreateOrder() {
      const points = this.currentPoints
      
      if (!points || points <= 0) {
        uni.showToast({
          title: '请选择或输入充值积分数',
          icon: 'none'
        })
        return
      }

      this.submitting = true

      try {
        const res = await createRecharge(points)
        uni.showModal({
          title: '订单创建成功',
          content: `订单号：${res.orderNo}\n金额：¥${res.amount.toFixed(2)}\n请完成支付`,
          showCancel: false,
          success: () => {
            // 刷新订单列表和余额
            this.page = 1
            this.loadOrders()
            this.loadBalance()
            this.selectedQuick = null
            this.customPoints = ''
          }
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.submitting = false
      }
    },
    async loadOrders() {
      try {
        const res = await getRechargeOrders(this.page, this.pageSize)
        if (this.page === 1) {
          this.orders = res.list
        } else {
          this.orders = this.orders.concat(res.list)
        }
        this.total = res.total
        this.hasMore = this.orders.length < res.total
      } catch (err) {
        console.error(err)
      }
    },
    loadMore() {
      this.page += 1
      this.loadOrders()
    },
    getStatusClass(status) {
      switch (status) {
        case 0: return 'status-pending'
        case 1: return 'status-success'
        case 2: return 'status-failed'
        default: return ''
      }
    },
    getStatusText(status) {
      switch (status) {
        case 0: return '待支付'
        case 1: return '已支付'
        case 2: return '已取消'
        default: return '未知'
      }
    },
    formatTime(timeStr) {
      if (!timeStr) return ''
      const date = new Date(timeStr)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
.balance-card {
  margin-bottom: 20rpx;
}

.balance-label {
  font-size: 28rpx;
  color: #666;
}

.balance-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #667eea;
}

.card-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
  color: #333;
}

.quick-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.quick-option {
  border: 2rpx solid #e5e5e5;
  border-radius: 8rpx;
  padding: 30rpx 0;
  text-align: center;
  font-size: 28rpx;
  color: #666;
}

.quick-option.active {
  border-color: #667eea;
  background: #f0f5ff;
  color: #667eea;
}

.price-preview {
  background: #f0f5ff;
  padding: 20rpx;
  border-radius: 8rpx;
  margin: 20rpx 0;
}

.price-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
  font-size: 28rpx;
}

.price-row.total {
  font-weight: bold;
  color: #667eea;
  font-size: 30rpx;
  border-top: 1rpx solid #d9e2f3;
  padding-top: 10rpx;
  margin-top: 10rpx;
}

.price-note {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 10rpx;
}

.order-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-item:last-child {
  border-bottom: none;
}

.order-no {
  font-size: 26rpx;
  color: #333;
  margin-bottom: 8rpx;
}

.order-info-text {
  font-size: 26rpx;
  color: #666;
  margin-bottom: 8rpx;
}

.order-time {
  font-size: 24rpx;
  color: #999;
}

.order-price {
  text-align: right;
}

.order-price .amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff4d4f;
  margin-bottom: 8rpx;
}

.status-pending {
  font-size: 24rpx;
  color: #faad14;
}

.status-success {
  font-size: 24rpx;
  color: #52c41a;
}

.status-failed {
  font-size: 24rpx;
  color: #999;
}

.load-more-btn {
  background: #f5f5f5;
  border: none;
  padding: 15rpx 40rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.picker {
  width: 100%;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e5e5e5;
  border-radius: 8rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  background: #fafafa;
  box-sizing: border-box;
}
</style>
