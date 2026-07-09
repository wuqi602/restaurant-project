const api = require('../../utils/api')

Page({
  data: {
    product: null,
    quantity: 1,
    loading: true
  },

  onLoad(options) {
    if (options.id) {
      this.loadProduct(options.id)
    }
  },

  loadProduct(id) {
    this.setData({ loading: true })
    api.getProductDetail(id).then((data) => {
      this.setData({ product: data, loading: false, quantity: 1 })
    }).catch(() => {
      this.setData({ loading: false })
      wx.showToast({ title: '加载失败', icon: 'none' })
    })
  },

  onDecrease() {
    if (this.data.quantity > 1) {
      this.setData({ quantity: this.data.quantity - 1 })
    }
  },

  onIncrease() {
    this.setData({ quantity: this.data.quantity + 1 })
  },

  onAddToCart() {
    const p = this.data.product
    if (!p) return
    api.addToCart({ id: p.id, name: p.name, price: p.price, image: p.image || '', quantity: this.data.quantity }).then(() => {
      wx.showToast({ title: '已添加 ' + this.data.quantity + ' 件', icon: 'success' })
    }).catch(() => {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  },

  onBuyNow() {
    this.onAddToCart()
    wx.switchTab({ url: '/pages/cart/cart' })
  }
})
