const api = require('../../utils/api')

Page({
  // 点击"进入店铺"，跳转到菜单页
  goToMenu() {
    wx.switchTab({ url: '/pages/menu/menu' })
  }
})
