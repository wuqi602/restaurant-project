const api = require('../../utils/api')

Page({
  data: {
    orders: [],
    currentTab: 'all',
    tabs: [
      { status: 'all', name: '全部' },
      { status: 'pending', name: '待支付' },
      { status: 'paid', name: '已支付' },
      { status: 'completed', name: '已完成' },
      { status: 'cancelled', name: '已取消' }
    ]
  },

  onShow() {
    this.loadOrders()
  },

  switchTab(e) {
    const status = e.currentTarget.dataset.status
    if (status === this.data.currentTab) return
    this.setData({ currentTab: status, orders: [] })
    wx.showLoading({ title: '加载中...' })
    this.loadOrders(status)
  },

  loadOrders(status) {
    const s = status || this.data.currentTab
    api.getOrders(s).then((data) => {
      wx.hideLoading()
      this.setData({ orders: data.orders })
    }).catch(() => {
      wx.hideLoading()
    })
  },

  onOrderTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/order-detail/order-detail?id=' + id })
  }
})
