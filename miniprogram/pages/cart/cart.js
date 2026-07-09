const api = require('../../utils/api')

Page({
  data: {
    cartList: [],
    totalPrice: 0,
    totalCount: 0
  },

  onShow() {
    this.fetchCartData()
  },

  // 从后端获取购物车数据
  fetchCartData(showLoading = false) {
    if (showLoading) wx.showLoading({ title: '加载中...' })
    api.getCart().then((data) => {
      if (showLoading) wx.hideLoading()
      this.setData({
        cartList: data.cartList,
        totalPrice: data.totalPrice,
        totalCount: data.totalCount
      })
    }).catch(() => {
      if (showLoading) wx.hideLoading()
      wx.showToast({ title: '获取购物车失败', icon: 'none' })
    })
  },

  // 增加数量
  onIncrease(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.cartList.find(item => item.id === id)
    if (item) {
      api.updateCart(id, item.quantity + 1).then(() => {
        this.fetchCartData()
      }).catch(() => {
        wx.showToast({ title: '操作失败', icon: 'none' })
      })
    }
  },

  // 减少数量
  onDecrease(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.cartList.find(item => item.id === id)
    if (item) {
      api.updateCart(id, item.quantity - 1).then(() => {
        this.fetchCartData()
      }).catch(() => {
        wx.showToast({ title: '操作失败', icon: 'none' })
      })
    }
  },

  // 删除商品
  onRemoveItem(e) {
    const id = e.currentTarget.dataset.id
    api.removeFromCart(id).then(() => {
      this.fetchCartData()
    }).catch(() => {
      wx.showToast({ title: '删除失败', icon: 'none' })
    })
  },

  // 清空购物车
  onClearCart() {
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          api.clearCart().then(() => {
            this.fetchCartData()
          }).catch(() => {
            wx.showToast({ title: '清空失败', icon: 'none' })
          })
        }
      }
    })
  },

  // 返回上一页
  onBack() {
    wx.navigateBack()
  },

  // 结算
  onCheckout() {
    if (this.data.cartList.length === 0) {
      wx.showToast({ title: '购物车为空', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/checkout/checkout' })
  }
})
