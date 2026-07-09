const api = require('../../utils/api')

Page({
  data: {
    userInfo: { avatar: '', nickname: '', uid: '' },
    stats: { orders: 0, pending: 0, coupons: 0, points: 0 }
  },

  onLoad() {
    this._firstLoad = true
    this.loadUserData()
  },

  onShow() {
    if (this._firstLoad) {
      this._firstLoad = false
      return
    }
    this.loadStats()
  },

  // 从后端获取用户信息
  loadUserData() {
    api.getUserInfo().then((data) => {
      this.setData({
        userInfo: data.userInfo,
        stats: data.stats
      })
      // 更新缓存并记录时间戳
      wx.setStorageSync('userInfo', data.userInfo)
      wx.setStorageSync('userInfoTime', Date.now())
    }).catch(() => {
      // 降级：读取本地缓存（仅 5 分钟内有效）
      const cachedTime = wx.getStorageSync('userInfoTime') || 0
      if (Date.now() - cachedTime < 300000) {
        const userInfo = wx.getStorageSync('userInfo')
        if (userInfo) {
          this.setData({ userInfo })
        }
      }
    })
  },

  // 刷新统计数据
  loadStats() {
    api.getUserInfo().then((data) => {
      this.setData({ stats: data.stats })
    }).catch(() => {})
  },

  goLogin() {
    wx.showToast({ title: '登录功能开发中', icon: 'none' })
  },

  goOrders(e) {
    const status = e.currentTarget.dataset.status
    wx.navigateTo({ url: '/pages/order/order' + (status ? '?status=' + status : '') })
  },

  goCoupons() {
    wx.showToast({ title: '优惠券功能开发中', icon: 'none' })
  },

  goPoints() {
    wx.showToast({ title: '积分商城开发中', icon: 'none' })
  },

  goAddress() {
    wx.showToast({ title: '收货地址功能开发中', icon: 'none' })
  },

  goFavorites() {
    wx.showToast({ title: '收藏功能开发中', icon: 'none' })
  },

  goSettings() {
    wx.showToast({ title: '设置功能开发中', icon: 'none' })
  },

  goAbout() {
    wx.showToast({ title: '关于我们', icon: 'none' })
  }
})
