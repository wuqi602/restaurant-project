const api = require('../../utils/api')

Page({
  data: {
    currentCategoryIndex: 0,
    categories: [],
    menuList: [],
    rightToView: '',
    leftToView: '',
    categoryTops: []
  },

  onLoad() {
    this.fetchMenuData()
  },

  onShow() {
    this.fetchMenuData()
  },

  onPullDownRefresh() {
    this.fetchMenuData()
  },

  fetchMenuData() {
    wx.showLoading({ title: '菜单加载中...' })
    api.getMenu().then((data) => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      this.setData({
        categories: data.categories || [],
        menuList: data.menuList || []
      }, () => this._calcCategoryTops())
    }).catch(() => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
      wx.showToast({ title: '加载失败，请重试', icon: 'none' })
      this.setData({ categories: [], menuList: [] })
    })
  },

  // 点击左侧分类 → 右侧滚到对应区域
  onCategoryTap(e) {
    const index = Number(e.currentTarget.dataset.index)
    if (index === this.data.currentCategoryIndex) return
    this.setData({
      currentCategoryIndex: index,
      rightToView: 'cat-' + index,
      leftToView: 'cat-item-' + index
    })
  },

  // 右侧滚动时 → 左侧高亮联动
  onRightScroll(e) {
    const top = e.detail.scrollTop
    const tops = this.data.categoryTops
    if (tops.length === 0) return
    let active = 0
    for (let i = tops.length - 1; i >= 0; i--) {
      if (top >= tops[i] - 30) { active = i; break }
    }
    if (active !== this.data.currentCategoryIndex) {
      this.setData({
        currentCategoryIndex: active,
        leftToView: 'cat-item-' + active
      })
    }
  },

  // 计算每个分类距顶部距离（数据渲染完成后）
  _calcCategoryTops() {
    const query = wx.createSelectorQuery()
    query.selectAll('.section-title').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec((res) => {
      const rects = res[0] || []
      const tops = rects.map(r => r.top - (res[1]?.scrollTop || 0))
      this.setData({ categoryTops: tops })
    })
  },

  onFoodTap(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({ url: '/pages/detail/detail?id=' + item.id })
  },

  onAddToCart(e) {
    const item = e.currentTarget.dataset.item
    api.addToCart({ id: item.id, name: item.name, price: item.price, image: item.image || '' }).then(() => {
      wx.showToast({ title: '已添加：' + item.name, icon: 'success', duration: 1000 })
    }).catch(() => {
      wx.showToast({ title: '添加失败', icon: 'none' })
    })
  }
})
