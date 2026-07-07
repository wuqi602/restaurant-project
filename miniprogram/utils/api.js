const BASE_URL = 'http://192.168.224.141:3000'

function request(url, method = 'GET', data = {}) {
  // GET 请求加时间戳防止缓存
  const ts = method === 'GET' ? (url.includes('?') ? '&_t=' : '?_t=') + Date.now() : ''
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url + ts,
      method,
      data,
      success: (res) => {
        if (res.data.code === 0) {
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      },
      fail: reject
    })
  })
}

module.exports = {
  getMenu() {
    return request('/api/menu')
  },
  getCategories() {
    return request('/api/categories')
  },
  getNotices(type) {
    const q = type && type !== 'all' ? '?type=' + type : ''
    return request('/api/notices' + q)
  },
  markAllRead() {
    return request('/api/notices/read-all', 'POST')
  },
  getUserInfo() {
    return request('/api/user')
  },
  getCart() {
    return request('/api/cart')
  },
  addToCart(item) {
    return request('/api/cart/add', 'POST', item)
  },
  updateCart(id, quantity) {
    return request('/api/cart/update', 'POST', { id, quantity })
  },
  removeFromCart(id) {
    return request('/api/cart/remove', 'POST', { id })
  },
  clearCart() {
    return request('/api/cart/clear', 'POST')
  }
}
