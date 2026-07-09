const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())
// 静态文件服务：提供餐品图片
app.use('/images', express.static(__dirname + '/public/images'))

// ========== 模拟数据 ==========
const categories = [
  { id: 0, name: '🔥 热销榜' },
  { id: 1, name: '🍔 经典汉堡' },
  { id: 2, name: '🍟 美味小食' },
  { id: 3, name: '🥤 饮品' },
  { id: 4, name: '🍦 甜品' }
]

const IMG = '/images'  // 图片URL前缀

const menuList = [
  // 热销榜
  [
    { id: 101, name: '招牌牛肉堡', price: 32.0, description: '厚实牛肉饼搭配新鲜蔬菜', image: `${IMG}/signature_beef_burger.png` },
    { id: 102, name: '香辣鸡腿堡', price: 30.0, description: '香辣鸡腿肉配生菜沙拉酱', image: `${IMG}/spicy_chicken_burger.png` },
    { id: 103, name: '黄金薯条', price: 12.0, description: '外酥里嫩，经典必点', image: `${IMG}/fries.png` }
  ],
  // 经典汉堡
  [
    { id: 201, name: '香辣鸡腿堡', price: 30.0, description: '香辣鸡腿肉配生菜沙拉酱', image: `${IMG}/spicy_chicken_burger.png` },
    { id: 202, name: '招牌牛肉堡', price: 32.0, description: '厚实牛肉饼搭配新鲜蔬菜', image: `${IMG}/signature_beef_burger.png` },
    { id: 203, name: '培根芝士牛肉堡', price: 36.0, description: '培根芝士搭配厚实牛肉饼', image: `${IMG}/bacon_burger.png` },
    { id: 204, name: '双层芝士爆牛堡', price: 42.0, description: '双层牛肉芝士，加倍满足', image: `${IMG}/double_cheese_burger.png` }
  ],
  // 美味小食
  [
    { id: 301, name: '黄金薯条', price: 12.0, description: '外酥里嫩', image: `${IMG}/fries.png` },
    { id: 302, name: '奥尔良烤翅', price: 22.0, description: '秘制奥尔良酱料烤制，鲜嫩多汁', image: `${IMG}/chicken_wings.png` },
    { id: 303, name: '凯撒沙拉', price: 18.0, description: '新鲜蔬菜配凯撒酱汁，清爽健康', image: `${IMG}/caesar_salad.png` }
  ],
  // 饮品
  [
    { id: 401, name: '冰镇可乐', price: 8.0, description: '畅爽怡神，夏日必备', image: `${IMG}/cola.png` },
    { id: 402, name: '鲜榨柠檬汁', price: 12.0, description: '鲜榨柠檬汁，酸甜解渴', image: `${IMG}/lemon_juice.png` }
  ],
  // 甜品
  [
    { id: 501, name: '巧克力圣代', price: 15.0, description: '浓郁巧克力酱搭配香草冰淇淋', image: `${IMG}/chocolate_sundae.png` }
  ]
]

// ========== API 路由 ==========

// 获取菜单分类
app.get('/api/categories', (req, res) => {
  res.json({ code: 0, data: categories })
})

// 获取完整菜单（分类+菜品）
app.get('/api/menu', (req, res) => {
  res.json({ code: 0, data: { categories, menuList } })
})

// 获取商品详情
app.get('/api/product/:id', (req, res) => {
  const id = Number(req.params.id)
  for (const cat of menuList) {
    const found = cat.find(item => item.id === id)
    if (found) return res.json({ code: 0, data: found })
  }
  res.status(404).json({ code: 1, message: '商品不存在' })
})

// 获取通知列表
const notices = [
  { id: 1, tag: '优惠', type: 'promotion', title: '新用户专享福利', desc: '新用户首单立减15元', detail: '活动期间，新注册用户下单即可享受首单立减15元优惠，可与满减活动叠加使用。活动截止日期：2026年7月31日。', date: '2026-07-07', read: false, open: false },
  { id: 2, tag: '优惠', type: 'promotion', title: '满减活动火爆进行中', desc: '满30减10，满20减5', detail: '全场满30元减10元，满20元减5元（特价商品除外）。活动时间：2026年7月1日-7月15日。', date: '2026-07-01', read: false, open: false },
  { id: 3, tag: '订单', type: 'order', title: '订单已完成', desc: '订单 #20260707001 已完成配送', detail: '您的订单（招牌牛肉堡×1、黄金薯条×1）已由外卖配送员完成配送，祝您用餐愉快！如有疑问请联系客服。', date: '2026-07-07', read: false, open: false },
  { id: 4, tag: '系统', type: 'system', title: '积分到账通知', desc: '您获得520积分奖励', detail: '感谢您的持续支持，系统已为您发放520积分奖励。当前积分余额：1520分，可前往积分商城兑换好礼。', date: '2026-07-05', read: true, open: false },
  { id: 5, tag: '公告', type: 'announce', title: '营业时间调整通知', desc: '即日起营业时间调整为10:00-22:00', detail: '为提供更好的服务，本店自2026年7月1日起调整营业时间为上午10:00至晚上22:00，请各位顾客合理安排用餐时间。', date: '2026-06-28', read: true, open: false },
  { id: 6, tag: '优惠', type: 'promotion', title: '夏日特惠套餐上线', desc: '招牌牛肉堡+可乐套餐仅需28元', detail: '夏日限定特惠套餐：招牌牛肉堡+冰镇可乐=28元（原价40元），香辣鸡腿堡+黄金薯条+可乐=35元（原价52元）。数量有限，售完即止！', date: '2026-06-25', read: true, open: false },
  { id: 7, tag: '订单', type: 'order', title: '订单配送中', desc: '订单 #20260620003 预计15分钟送达', detail: '您的订单（奥尔良烤翅×2、冰镇可乐×1）已由骑手取餐，正在配送中。预计送达时间：12:15，请保持电话畅通。', date: '2026-06-20', read: true, open: false },
  { id: 8, tag: '系统', type: 'system', title: '版本更新公告', desc: '小程序已更新至 v2.0.0', detail: '新增功能：菜单分类浏览、购物车批量操作、积分商城入口。优化体验：页面加载速度提升40%，修复已知问题。', date: '2026-06-15', read: true, open: false }
]
app.get('/api/notices', (req, res) => {
  const unread_count = notices.filter(n => !n.read).length
  const type = req.query.type
  const filtered = type && type !== 'all' ? notices.filter(n => n.type === type) : notices
  res.json({ code: 0, data: { notices: filtered, unread_count, notice_summary: `共${filtered.length}条通知` } })
})

// 标记全部已读
app.post('/api/notices/read-all', (req, res) => {
  notices.forEach(n => { n.read = true })
  res.json({ code: 0, message: 'ok' })
})

// 获取用户信息
app.get('/api/user', (req, res) => {
  res.json({
    code: 0,
    data: {
      userInfo: { avatar: '', nickname: '微信用户', uid: '10001' },
      stats: { orders: 12, pending: 2, coupons: 3, points: 520 }
    }
  })
})

// ========== 购物车相关（基于 session 的临时购物车）==========
let cartItems = [
  { id: 101, name: '招牌牛肉堡', price: 32.0, image: `${IMG}/signature_beef_burger.png`, quantity: 2 },
  { id: 301, name: '黄金薯条', price: 12.0, image: `${IMG}/fries.png`, quantity: 1 }
]

// 获取购物车
app.get('/api/cart', (req, res) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  res.json({ code: 0, data: { cartList: cartItems, totalPrice: Math.round(totalPrice * 100) / 100, totalCount } })
})

// 添加/更新购物车
app.post('/api/cart/add', (req, res) => {
  const { id, name, price, image, quantity = 1 } = req.body
  const exist = cartItems.find(item => item.id === id)
  if (exist) {
    exist.quantity += quantity
    if (image) exist.image = image
  } else {
    cartItems.push({ id, name, price, image: image || '', quantity })
  }
  res.json({ code: 0, message: '已添加到购物车' })
})

// 更新数量
app.post('/api/cart/update', (req, res) => {
  const { id, quantity } = req.body
  if (quantity <= 0) {
    cartItems = cartItems.filter(item => item.id !== id)
  } else {
    const item = cartItems.find(item => item.id === id)
    if (item) item.quantity = quantity
  }
  res.json({ code: 0, message: 'ok' })
})

// 删除购物车项
app.post('/api/cart/remove', (req, res) => {
  const { id } = req.body
  cartItems = cartItems.filter(item => item.id !== id)
  res.json({ code: 0, message: '已删除' })
})

// 清空购物车
app.post('/api/cart/clear', (req, res) => {
  cartItems = []
  res.json({ code: 0, message: '已清空' })
})

// ========== 订单相关 ==========
const defaultAddress = { name: '刘先生', phone: '138****8888', detail: '广东省广州市天河区科技园A座1001' }
let orders = [
  {
    id: '20260707001', status: 'completed', statusText: '已完成',
    items: [
      { id: 101, name: '招牌牛肉堡', price: 32, image: `${IMG}/signature_beef_burger.png`, quantity: 2 },
      { id: 301, name: '黄金薯条', price: 12, image: `${IMG}/fries.png`, quantity: 1 }
    ],
    totalPrice: 76, discount: 10, finalPrice: 66,
    address: defaultAddress,
    createTime: '2026-07-07 12:00', payTime: '2026-07-07 12:05',
    remark: ''
  }
]

// 下单
app.post('/api/order/create', (req, res) => {
  const { items, remark } = req.body
  if (!items || items.length === 0) return res.json({ code: 1, message: '下单商品不能为空' })
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = totalPrice >= 50 ? 10 : (totalPrice >= 30 ? 5 : 0)
  const order = {
    id: String(Date.now()), status: 'pending', statusText: '待支付',
    items, totalPrice: Math.round(totalPrice * 100) / 100,
    discount, finalPrice: Math.round((totalPrice - discount) * 100) / 100,
    address: defaultAddress, createTime: new Date().toLocaleString('zh-CN'),
    payTime: '', remark: remark || ''
  }
  orders.unshift(order)
  cartItems = []
  res.json({ code: 0, data: { order } })
})

// 获取订单列表
app.get('/api/orders', (req, res) => {
  const status = req.query.status
  const filtered = status && status !== 'all' ? orders.filter(o => o.status === status) : orders
  res.json({ code: 0, data: { orders: filtered } })
})

// 获取订单详情
app.get('/api/order/:id', (req, res) => {
  const order = orders.find(o => o.id === req.params.id)
  if (!order) return res.status(404).json({ code: 1, message: '订单不存在' })
  res.json({ code: 0, data: order })
})

// 模拟支付
app.post('/api/order/:id/pay', (req, res) => {
  const order = orders.find(o => o.id === req.params.id)
  if (!order) return res.json({ code: 1, message: '订单不存在' })
  order.status = 'paid'
  order.statusText = '已支付'
  order.payTime = new Date().toLocaleString('zh-CN')
  res.json({ code: 0, message: '支付成功' })
})

// 取消订单
app.post('/api/order/:id/cancel', (req, res) => {
  const order = orders.find(o => o.id === req.params.id)
  if (!order) return res.json({ code: 1, message: '订单不存在' })
  order.status = 'cancelled'
  order.statusText = '已取消'
  res.json({ code: 0, message: '已取消' })
})

// 启动服务器
const PORT = 3000
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API 服务器已启动：http://localhost:${PORT}`)
  console.log(`可用接口：`)
  console.log(`  GET   /api/menu             获取菜单`)
  console.log(`  GET   /api/categories       获取分类`)
  console.log(`  GET   /api/product/:id      获取商品详情`)
  console.log(`  GET   /api/notices          获取通知`)
  console.log(`  POST  /api/notices/read-all 全部已读`)
  console.log(`  GET   /api/user             获取用户信息`)
  console.log(`  GET   /api/cart             获取购物车`)
  console.log(`  POST  /api/cart/add         添加购物车`)
  console.log(`  POST  /api/cart/update      更新数量`)
  console.log(`  POST  /api/cart/remove      删除商品`)
  console.log(`  POST  /api/cart/clear       清空购物车`)
  console.log(`  POST  /api/order/create     创建订单`)
  console.log(`  GET   /api/orders           获取订单列表`)
  console.log(`  GET   /api/order/:id        获取订单详情`)
  console.log(`  POST  /api/order/:id/pay    模拟支付`)
  console.log(`  POST  /api/order/:id/cancel 取消订单`)
})
