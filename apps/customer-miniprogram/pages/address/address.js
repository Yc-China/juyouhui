// address.js
const { api } = require('../../utils/api');

Page({
  data: {
    address: {
      id: null,
      receiverName: '',
      receiverPhone: '',
      province: '',
      city: '',
      district: '',
      detail: ''
    },
    region: []
  },

  onLoad(options) {
    // 如果有地址ID就是编辑，否则新增
    if (options.id) {
      // 加载地址信息
      // TODO: 获取单个地址详情，这里简化处理
    }
  },

  onNameInput(e) {
    this.setData({
      'address.receiverName': e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      'address.receiverPhone': e.detail.value
    });
  },

  onRegionChange(e) {
    const [province, city, district] = e.detail.value;
    this.setData({
      'address.province': province,
      'address.city': city,
      'address.district': district,
      region: e.detail.value
    });
  },

  onDetailInput(e) {
    this.setData({
      'address.detail': e.detail.value
    });
  },

  saveAddress() {
    const { receiverName, receiverPhone, province, city, district, detail } = this.data.address;

    if (!receiverName.trim()) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      });
      return;
    }

    if (!receiverPhone.trim() || receiverPhone.length !== 11) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    if (!province || !city || !district) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      });
      return;
    }

    if (!detail.trim()) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      });
      return;
    }

    api.saveAddress(this.data.address).then(res => {
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      console.error('保存地址失败', err);
    });
  }
});
