<template>
  <view class="container">
    <!-- 余额信息 -->
    <view class="card balance-card">
      <view class="flex-between">
        <text class="balance-label">当前积分余额</text>
        <text class="balance-value">{{ balance }}</text>
      </view>
    </view>

    <!-- 发放表单 -->
    <view class="card form-card">
      <view class="form-item">
        <label>用户手机号 *</label>
        <input 
          type="number" 
          v-model="form.phone" 
          placeholder="请输入用户手机号"
          maxlength="11"
        />
      </view>

      <view class="form-item">
        <label>发放积分数 *</label>
        <input 
          type="number" 
          v-model="form.points" 
          placeholder="请输入要发放的积分数"
        />
      </view>

      <view class="form-item" v-if="stores.length > 0">
        <label>选择门店</label>
        <picker :range="storeOptions" :value="selectedStoreIndex" @change="onStoreChange">
          <view class="picker">
            {{ selectedStoreName }}
          </view>
        </picker>
      </view>

      <view class="amount-preview" v-if="form.points > 0">
        <text>本次发放积分：{{ form.points }} 积分</text>
      </view>

      <button class="btn btn-block" @tap="handleGrant" :loading="submitting">
        {{ submitting ? '发放中...' : '确认发放' }}
      </button>
    </view>

    <!-- 发放记录可以后续添加 -->
  </view>
</template>

<script>
import { grantPoints, getInfo, getStores } from '../../api/merchant'

export default {
  data() {
    return {
      balance: 0,
      stores: [],
      storeOptions: ['不指定门店'],
      selectedStoreIndex: 0,
      selectedStoreId: null,
      submitting: false,
      form: {
        phone: '',
        points: ''
      }
    }
  },
  onShow() {
    this.loadData()
  },
  methods: {
    async loadData() {
      try {
        // 获取余额
        const infoRes = await getInfo()
        this.balance = infoRes.points.balance

        // 获取门店列表
        const storesRes = await getStores()
        this.stores = storesRes.filter(s => s.status === 1)
        
        // 构建门店选项
        this.storeOptions = ['不指定门店'].concat(this.stores.map(s => s.name))
      } catch (err) {
        console.error(err)
      }
    },
    onStoreChange(e) {
      this.selectedStoreIndex = Number(e.detail.value)
      const idx = this.selectedStoreIndex - 1
      if (idx >= 0 && this.stores[idx]) {
        this.selectedStoreId = this.stores[idx].id
      } else {
        this.selectedStoreId = null
      }
    },
    get selectedStoreName() {
      return this.storeOptions[this.selectedStoreIndex] || '请选择门店'
    },
    async handleGrant() {
      const { phone, points } = this.form

      if (!phone || phone.length !== 11) {
        uni.showToast({
          title: '请输入正确的用户手机号',
          icon: 'none'
        })
        return
      }

      if (!points || points <= 0) {
        uni.showToast({
          title: '积分数必须大于0',
          icon: 'none'
        })
        return
      }

      if (points > this.balance) {
        uni.showToast({
          title: '积分余额不足，请先充值',
          icon: 'none'
        })
        return
      }

      uni.showModal({
        title: '确认发放',
        content: `确定要给用户 ${phone} 发放 ${points} 积分吗？`,
        success: async (res) => {
          if (res.confirm) {
            this.submitting = true
            try {
              await grantPoints(phone, points, this.selectedStoreId)
              uni.showToast({
                title: '发放成功',
                icon: 'success'
              })
              // 清空表单
              this.form.phone = ''
              this.form.points = ''
              this.selectedStoreIndex = 0
              this.selectedStoreId = null
              // 刷新余额
              this.loadData()
            } catch (err) {
              console.error(err)
            } finally {
              this.submitting = false
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.balance-card {
  text-align: center;
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

.amount-preview {
  background: #f0f5ff;
  padding: 20rpx;
  border-radius: 8rpx;
  text-align: center;
  margin: 20rpx 0;
  color: #667eea;
  font-size: 28rpx;
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
