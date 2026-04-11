<template>
  <view class="container">
    <view class="login-box card">
      <view class="title text-center">
        <text class="text-primary">聚优惠商家</text>
      </view>
      
      <view class="form-item">
        <label>手机号</label>
        <input 
          type="number" 
          v-model="form.phone" 
          placeholder="请输入注册手机号"
          maxlength="11"
        />
      </view>
      
      <view class="form-item">
        <label>密码</label>
        <input 
          type="password" 
          v-model="form.password" 
          placeholder="请输入密码"
        />
      </view>
      
      <button class="btn btn-block" @tap="handleLogin" :loading="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </view>
  </view>
</template>

<script>
import { login } from '../../api/merchant'

export default {
  data() {
    return {
      form: {
        phone: '',
        password: ''
      },
      loading: false
    }
  },
  onLoad() {
    // 检查是否已经登录
    const token = uni.getStorageSync('merchantToken')
    if (token) {
      uni.switchTab({
        url: '/pages/dashboard/dashboard'
      })
    }
  },
  methods: {
    async handleLogin() {
      const { phone, password } = this.form
      
      if (!phone || !password) {
        uni.showToast({
          title: '请填写手机号和密码',
          icon: 'none'
        })
        return
      }
      
      if (phone.length !== 11) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }
      
      this.loading = true
      
      try {
        const res = await login(phone, password)
        // 保存token和商家信息
        uni.setStorageSync('merchantToken', res.token)
        uni.setStorageSync('merchantInfo', res.merchant)
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })
        
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/dashboard/dashboard'
          })
        }, 1500)
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 60rpx;
}

.login-box {
  margin-top: 100rpx;
}
</style>
