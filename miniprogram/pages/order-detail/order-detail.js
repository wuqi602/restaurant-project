const api = require('../../utils/api')

Page({
  data: {
    order: null,
    loading: true
  },

  onLoad(options) {
    if (options.id) this.loadOrder(options.id)
  },

  loadOrder(id) {
    this.setData({ loading: true })
    api.getOrderDetail(id).then((data) => {
      this.setData({ order: data, loading: false })
    }).catch(() => {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  onPay() {
    const order = this.data.order
    wx.showModal({
      title: '确认支付',
      content: '支付 ¥' + order.finalPrice,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '支付中...' })
          api.payOrder(order.id).then(() => {
            wx.hideLoading()
            wx.showToast({ title: '支付成功', icon: 'success' })
            this.loadOrder(order.id)
          })
        }
      }
    })
  },

  onCancel() {
    wx.showModal({
      title: '提示', content: '确定取消订单？',
      success: (res) => {
        if (res.confirm) {
          api.cancelOrder(this.data.order.id).then(() => {
            wx.showToast({ title: '已取消', icon: 'success' })
            this.loadOrder(this.data.order.id)
          })
        }
      }
    })
  }
})
