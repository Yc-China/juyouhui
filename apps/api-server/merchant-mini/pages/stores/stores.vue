<template>
  <view class="container">
    <!-- 添加门店按钮 -->
    <view class="add-btn-card">
      <button class="btn" @tap="showAddModal">+ 添加门店</button>
    </view>

    <!-- 门店列表 -->
    <view v-if="stores.length > 0" class="store-list">
      <view v-for="store in stores" :key="store.id" class="card store-item">
        <view class="flex-between">
          <view class="store-info">
            <view class="store-name">{{ store.name }}</view>
            <view v-if="store.address" class="store-address">{{ store.address }}</view>
            <view v-if="store.phone" class="store-phone">电话：{{ store.phone }}</view>
          </view>
          <view class="store-status">
            <text :class="store.status === 1 ? 'status-active' : 'status-inactive'">
              {{ store.status === 1 ? '启用' : '禁用' }}
            </text>
          </view>
        </view>
        <view class="store-actions mt-10">
          <button class="action-btn edit-btn" @tap="showEditModal(store)">编辑</button>
          <button class="action-btn delete-btn" @tap="confirmDelete(store)">删除</button>
        </view>
      </view>
    </view>

    <view v-else class="empty-state text-center">
      <text>暂无门店，点击上方按钮添加</text>
    </view>

    <!-- 添加/编辑弹窗 -->
    <view v-if="showModal" class="modal-overlay" @tap="hideModal">
      <view class="modal-content card" @tap.stop>
        <view class="modal-title">{{ isEdit ? '编辑门店' : '添加门店' }}</view>
        
        <view class="form-item">
          <label>门店名称 *</label>
          <input v-model="form.name" placeholder="请输入门店名称" />
        </view>
        
        <view class="form-item">
          <label>门店地址</label>
          <input v-model="form.address" placeholder="请输入门店地址" />
        </view>
        
        <view class="form-item">
          <label>联系电话</label>
          <input v-model="form.phone" placeholder="请输入联系电话" />
        </view>

        <view class="form-item">
          <label>状态</label>
          <picker :range="statusOptions" :value="form.status" @change="onStatusChange">
            <view class="picker">
              {{ statusOptions[form.status] }}
            </view>
          </picker>
        </view>

        <view class="flex-between mt-20">
          <button class="action-btn cancel-btn" @tap="hideModal">取消</button>
          <button class="btn confirm-btn" @tap="handleSubmit">
            {{ submitting ? '提交中...' : '确定' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getStores, addStore, updateStore, deleteStore } from '../../api/merchant'

export default {
  data() {
    return {
      stores: [],
      showModal: false,
      isEdit: false,
      currentStore: null,
      submitting: false,
      statusOptions: ['禁用', '启用'],
      form: {
        name: '',
        address: '',
        phone: '',
        status: 1
      }
    }
  },
  onShow() {
    this.loadStores()
  },
  methods: {
    async loadStores() {
      try {
        const res = await getStores()
        this.stores = res
      } catch (err) {
        console.error(err)
      }
    },
    showAddModal() {
      this.isEdit = false
      this.currentStore = null
      this.form = {
        name: '',
        address: '',
        phone: '',
        status: 1
      }
      this.showModal = true
    },
    showEditModal(store) {
      this.isEdit = true
      this.currentStore = store
      this.form = {
        name: store.name,
        address: store.address || '',
        phone: store.phone || '',
        status: store.status
      }
      this.showModal = true
    },
    hideModal() {
      this.showModal = false
    },
    onStatusChange(e) {
      this.form.status = Number(e.detail.value)
    },
    async handleSubmit() {
      if (!this.form.name.trim()) {
        uni.showToast({
          title: '请输入门店名称',
          icon: 'none'
        })
        return
      }

      this.submitting = true

      try {
        if (this.isEdit) {
          await updateStore(this.currentStore.id, this.form)
          uni.showToast({ title: '更新成功', icon: 'success' })
        } else {
          await addStore(this.form)
          uni.showToast({ title: '添加成功', icon: 'success' })
        }

        this.hideModal()
        this.loadStores()
      } catch (err) {
        console.error(err)
      } finally {
        this.submitting = false
      }
    },
    confirmDelete(store) {
      uni.showModal({
        title: '确认删除',
        content: `确定要删除门店 "${store.name}" 吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await deleteStore(store.id)
              uni.showToast({ title: '删除成功', icon: 'success' })
              this.loadStores()
            } catch (err) {
              console.error(err)
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.add-btn-card {
  margin-bottom: 20rpx;
}

.store-item {
  margin-bottom: 20rpx;
}

.store-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.store-address, .store-phone {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
}

.status-active {
  color: #52c41a;
  font-size: 26rpx;
}

.status-inactive {
  color: #999;
  font-size: 26rpx;
}

.store-actions {
  display: flex;
  justify-content: flex-end;
  border-top: 1rpx solid #f0f0f0;
  padding-top: 15rpx;
}

.action-btn {
  padding: 10rpx 30rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  margin-left: 20rpx;
  border: 1rpx solid #d9d9d9;
  background: #fff;
  color: #666;
}

.edit-btn {
  border-color: #667eea;
  color: #667eea;
}

.delete-btn {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.cancel-btn {
  border-color: #d9d9d9;
  color: #666;
}

.confirm-btn {
  width: 150rpx !important;
  height: 60rpx !important;
  line-height: 60rpx !important;
  padding: 0 !important;
  margin: 0 !important;
}

.empty-state {
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 30rpx;
  box-sizing: border-box;
}

.modal-content {
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
  color: #333;
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
