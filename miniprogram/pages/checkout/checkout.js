const api = require('../../utils/api')

Page({
  data: {
    cartList: [],
    totalPrice: 0,
    totalCount: 0,
    address: { name: '刘先生', phone: '138****8888', detail: '广东省广州市天河区科技园A座1001' },
    remark: '',
    submitting: false
  },

  onShow() {
    this.loadCartData()
  },

  loadCartData() {
    api.getCart().then((data) => {
      if (!data.cartList || data.cartList.length === 0) {
        wx.showToast({ title: '购物车为空', icon: 'none' })
        return wx.navigateBack()
      }
      this.setData({
        cartList: data.cartList,
        totalPrice: data.totalPrice,
        totalCount: data.totalCount
      })
    })
  },

  onRemarkInput(e) {
    this.setData({ remark: e.detail.value })
  },

  onSubmit() {
    if (this.data.submitting) return
    this.setData({ submitting: true })
    wx.showLoading({ title: '提交中...' })
    api.createOrder({
      items: this.data.cartList.map(i => ({ id: i.id, name: i.name, price: i.price, image: i.image, quantity: i.quantity })),
      remark: this.data.remark
    }).then((data) => {
      wx.hideLoading()
      wx.showToast({ title: '下单成功', icon: 'success' })
      wx.redirectTo({ url: '/pages/order-detail/order-detail?id=' + data.order.id })
    }).catch(() => {
      wx.hideLoading()
      this.setData({ submitting: false })
      wx.showToast({ title: '下单失败', icon: 'none' })
    })
  }
})
