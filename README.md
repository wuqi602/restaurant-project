# 好又来西餐厅微信点餐小程序

一个完整的餐厅外卖点餐系统，包含**微信小程序（用户端）**和**Vue 3 管理后台（商家端）**，后端基于 Node.js + Express 提供 RESTful API。

---

## 项目结构

```
restaurant-project/
├── backend/                    # 后端服务 + Vue 管理后台
│   ├── server/
│   │   ├── index.cjs          # API 路由（14个接口）
│   │   └── kill-port.cjs      # 端口释放脚本（启动前自动清理3000端口）
│   ├── src/                    # Vue 3 管理后台源码
│   │   ├── view/              # 页面组件
│   │   ├── router/            # 路由配置
│   │   └── stores/            # Pinia 状态管理
│   └── package.json
│
├── miniprogram/                # 微信小程序前端
│   ├── pages/
│   │   ├── index/             # 首页（店铺入口）
│   │   ├── menu/              # 菜单（左分类+右菜品+AI推荐）
│   │   ├── detail/            # 商品详情
│   │   ├── cart/              # 购物车
│   │   ├── checkout/          # 结算下单
│   │   ├── order/             # 订单列表
│   │   ├── order-detail/      # 订单详情
│   │   ├── inform/            # 消息通知
│   │   └── mine/              # 个人中心
│   ├── utils/
│   │   └── api.js             # API 请求封装
│   └── images/                # 餐品图片资源
│
├── 项目总结.md
└── README.md
```

---

## 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 小程序 | 微信小程序原生框架 | 用户界面 |
| 管理后台 | Vue 3 + TypeScript + Element Plus | 商家管理界面 |
| 状态管理 | Pinia | Vue 状态管理 |
| 后端 | Node.js + Express 5 | RESTful API |
| 构建工具 | Vite | 前端构建 |
| 版本控制 | Git + GitHub | 代码托管 |

---

## 功能模块

### 用户端（小程序）

| 模块 | 功能 |
|------|------|
| 首页 | 品牌形象展示，进入店铺入口 |
| 菜单 | 左分类导航 + 右菜品列表，双栏联动滚动；AI 智能推荐 |
| 商品详情 | 大图、名称、价格、描述、数量选择、加购/购买 |
| 购物车 | 列表、数量增删、清空、合计计算、去结算 |
| 结算下单 | 收货地址、商品清单、备注、订单提交 |
| 订单列表 | 全部/待支付/已支付/已完成/已取消分类筛选 |
| 订单详情 | 状态展示、收货信息、商品清单、金额明细、支付/取消 |
| 消息通知 | 全部/优惠/订单/系统/公告分类，展开详情，已读/全部已读 |
| 个人中心 | 用户信息、统计数据、功能入口 |

### 商家端（Vue 管理后台）

管理后台目前为基础框架搭建，各管理模块持续开发中。

---

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/menu` | 获取完整菜单（分类 + 菜品） |
| GET | `/api/categories` | 获取分类列表 |
| GET | `/api/product/:id` | 获取商品详情 |
| GET | `/api/notices` | 获取通知列表（支持按类型筛选） |
| POST | `/api/notices/read-all` | 全部标记已读 |
| GET | `/api/user` | 获取用户信息 |
| GET | `/api/cart` | 获取购物车 |
| POST | `/api/cart/add` | 添加购物车 |
| POST | `/api/cart/update` | 更新数量 |
| POST | `/api/cart/remove` | 删除商品 |
| POST | `/api/cart/clear` | 清空购物车 |
| POST | `/api/order/create` | 创建订单（自动满减优惠 + 清空购物车） |
| GET | `/api/orders` | 获取订单列表 |
| GET | `/api/order/:id` | 获取订单详情 |
| POST | `/api/order/:id/pay` | 模拟支付 |
| POST | `/api/order/:id/cancel` | 取消订单 |
| GET | `/api/recommend` | AI 智能推荐（基于历史订单频率 + 搭配分析） |

所有接口返回统一格式：`{ code: 0, data: {...} }` 或 `{ code: 1, message: "错误信息" }`

---

## 快速启动

### 环境要求
- Node.js >= 22.18.0
- npm
- 微信开发者工具（最新版）

### 启动后端 API

```bash
cd backend
npm install
npm run api
# 输出: API 服务器已启动：http://localhost:3000
```

### 运行小程序

1. 打开微信开发者工具
2. 导入 `miniprogram/` 文件夹
3. 修改 `miniprogram/utils/api.js` 中的 `BASE_URL` 为本机局域网 IP
4. 点击编译预览

### 真机调试

微信开发者工具 → 工具栏 → 真机调试 → 生成二维码 → 扫码（需在同一 WiFi）

---

## 核心功能亮点

### 菜单双栏联动
- **点击联动**：点击左侧分类 → 右侧自动滚动到对应区域（`scroll-into-view`）
- **滚动联动**：右侧滚动时监听 `bindscroll`，自动高亮左侧对应分类
- **位置计算**：`wx.createSelectorQuery` 获取分类标题 `boundingClientRect`

### AI 智能推荐
基于历史订单的商品频率统计 + 搭配矩阵分析，为购物车中的商品推荐搭配菜品。

### 订单满减优惠
创建订单时自动计算：满 20 减 5，满 30 减 10。

---

## 项目地址

- GitHub：https://github.com/wuqi602/restaurant-project
- 后端 API：`http://localhost:3000`

---

## License

MIT
