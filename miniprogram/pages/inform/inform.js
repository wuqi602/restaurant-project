const api = require('../../utils/api')

Page({
  data: {
    notices: [],
    unread_count: 0,
    notice_summary: '',
    tabs: [
      { type: 'all', name: '全部' },
      { type: 'promotion', name: '优惠' },
      { type: 'order', name: '订单' },
      { type: 'system', name: '系统' },
      { type: 'announce', name: '公告' }
    ],
    currentTab: 'all'
  },

  onLoad() {
    this.loadNotices()
  },

  onShow() {
    this.loadNotices()
  },

  onPullDownRefresh() {
    this.loadNotices()
  },

  // 切换分类标签
  switchTab(e) {
    const type = e.currentTarget.dataset.type
    if (type === this.data.currentTab) return
    this.setData({ currentTab: type, notices: [] })
    wx.showLoading({ title: '加载中...' })
    this.loadNotices(type)
  },

  // 从后端获取通知
  loadNotices(type) {
    const tab = type || this.data.currentTab
    api.getNotices(tab).then((data) => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      this.setData({
        notices: data.notices,
        unread_count: data.unread_count,
        notice_summary: data.notice_summary
      })
    }).catch(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  // 展开/收起详情
  onToggle(e) {
    const id = e.currentTarget.dataset.id
    const notices = this.data.notices.map(item => {
      if (item.id === id) {
        const opened = !item.open
        // 展开时自动标记已读
        if (opened && !item.read) {
          return { ...item, open: opened, read: true }
        }
        return { ...item, open: opened }
      }
      return item
    })
    const unread_count = notices.filter(n => !n.read).length
    this.setData({ notices, unread_count })
  },

  // 全部已读
  markAllRead() {
    const notices = this.data.notices.map(item => ({ ...item, read: true, open: false }))
    this.setData({ notices, unread_count: 0 })
    wx.showToast({ title: '已全部标记已读', icon: 'success' })
  }
})
