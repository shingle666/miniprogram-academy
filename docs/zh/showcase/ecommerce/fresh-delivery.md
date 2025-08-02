# 生鲜配送平台

一个支持实时定位、在线支付的生鲜配送小程序，为用户提供新鲜食材的便捷购买体验。

## 📱 项目概览

### 项目信息
- **项目名称**: 生鲜配送平台
- **开发周期**: 4个月
- **团队规模**: 8人
- **技术栈**: uni-app + Node.js + MySQL
- **用户规模**: 5万+ 注册用户
- **覆盖城市**: 15个一二线城市

### 核心功能
- 🥬 生鲜商品展示
- 📍 实时定位配送
- ⏰ 预约配送时间
- 💳 多种支付方式
- 🚚 配送实时跟踪
- 🔔 到货提醒通知

## 🎯 项目亮点

### 1. 智能配送系统
基于地理位置和订单密度，智能规划配送路线，提高配送效率。

**技术实现**:
```javascript
// 配送路线优化算法
const optimizeDeliveryRoute = (orders, deliveryCenter) => {
  // 使用遗传算法优化配送路线
  const geneticAlgorithm = new GeneticAlgorithm({
    populationSize: 100,
    mutationRate: 0.1,
    crossoverRate: 0.8,
    maxGenerations: 500
  })
  
  // 计算最优路线
  const optimizedRoute = geneticAlgorithm.solve({
    startPoint: deliveryCenter,
    destinations: orders.map(order => order.address),
    constraints: {
      maxDistance: 50, // 最大配送距离50km
      maxTime: 180,    // 最大配送时间3小时
      vehicleCapacity: 100 // 车辆载重100kg
    }
  })
  
  return optimizedRoute
}
```

### 2. 库存实时管理
实时同步库存信息，避免超卖，确保商品新鲜度。

**数据流程**:
```
采购入库 → 库存更新 → 前端展示 → 用户下单 → 库存扣减 → 配送出库
```

### 3. 冷链追溯系统
全程冷链监控，确保生鲜商品品质。

## 🛠️ 技术架构

### 整体架构
```
前端小程序 (uni-app)
    ↓
API网关 (Nginx)
    ↓
业务服务层 (Node.js)
    ↓
数据存储层 (MySQL + Redis)
    ↓
第三方服务 (地图API、支付API)
```

### 数据库设计
```sql
-- 商品表
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  category_id INT,
  price DECIMAL(10,2),
  stock_quantity INT,
  shelf_life INT, -- 保质期(天)
  storage_temp VARCHAR(20), -- 储存温度
  origin VARCHAR(50), -- 产地
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 订单表
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  total_amount DECIMAL(10,2),
  delivery_address TEXT,
  delivery_time DATETIME,
  status ENUM('pending', 'confirmed', 'delivering', 'delivered', 'cancelled'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 配送员表
CREATE TABLE delivery_staff (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50),
  phone VARCHAR(20),
  vehicle_type VARCHAR(20),
  current_location POINT,
  status ENUM('available', 'busy', 'offline'),
  rating DECIMAL(3,2)
);
```

## 💡 核心功能实现

### 1. 商品列表页面

```vue
<!-- pages/products/products.vue -->
<template>
  <view class="products-container">
    <!-- 分类导航 -->
    <scroll-view scroll-x class="category-nav">
      <view 
        v-for="category in categories" 
        :key="category.id"
        class="category-item"
        :class="{ active: selectedCategory === category.id }"
        @click="selectCategory(category.id)"
      >
        {{ category.name }}
      </view>
    </scroll-view>
    
    <!-- 商品网格 -->
    <view class="products-grid">
      <view 
        v-for="product in products" 
        :key="product.id"
        class="product-card"
        @click="goToDetail(product.id)"
      >
        <image :src="product.image" class="product-image" />
        <view class="product-info">
          <text class="product-name">{{ product.name }}</text>
          <text class="product-origin">{{ product.origin }}</text>
          <view class="product-price-row">
            <text class="product-price">¥{{ product.price }}</text>
            <text class="product-unit">/{{ product.unit }}</text>
          </view>
          <view class="product-stock">
            <text v-if="product.stock > 0" class="in-stock">现货</text>
            <text v-else class="out-stock">缺货</text>
          </view>
        </view>
        <button 
          class="add-cart-btn"
          :disabled="product.stock === 0"
          @click.stop="addToCart(product)"
        >
          加入购物车
        </button>
      </view>
    </view>
    
    <!-- 购物车悬浮按钮 -->
    <view class="cart-float" @click="goToCart">
      <text class="cart-icon">🛒</text>
      <text class="cart-count" v-if="cartCount > 0">{{ cartCount }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      categories: [],
      products: [],
      selectedCategory: null,
      cartCount: 0
    }
  },
  
  onLoad() {
    this.loadCategories()
    this.loadProducts()
    this.updateCartCount()
  },
  
  methods: {
    async loadCategories() {
      try {
        const res = await this.$http.get('/api/categories')
        this.categories = res.data
        if (this.categories.length > 0) {
          this.selectedCategory = this.categories[0].id
        }
      } catch (error) {
        console.error('加载分类失败:', error)
      }
    },
    
    async loadProducts() {
      try {
        const params = {
          category: this.selectedCategory,
          page: 1,
          limit: 20
        }
        const res = await this.$http.get('/api/products', { params })
        this.products = res.data.list
      } catch (error) {
        console.error('加载商品失败:', error)
      }
    },
    
    selectCategory(categoryId) {
      this.selectedCategory = categoryId
      this.loadProducts()
    },
    
    async addToCart(product) {
      try {
        await this.$http.post('/api/cart/add', {
          productId: product.id,
          quantity: 1
        })
        
        this.cartCount++
        uni.showToast({
          title: '已加入购物车',
          icon: 'success'
        })
      } catch (error) {
        uni.showToast({
          title: '添加失败',
          icon: 'error'
        })
      }
    },
    
    goToDetail(productId) {
      uni.navigateTo({
        url: `/pages/product-detail/product-detail?id=${productId}`
      })
    },
    
    goToCart() {
      uni.navigateTo({
        url: '/pages/cart/cart'
      })
    },
    
    async updateCartCount() {
      try {
        const res = await this.$http.get('/api/cart/count')
        this.cartCount = res.data.count
      } catch (error) {
        console.error('获取购物车数量失败:', error)
      }
    }
  }
}
</script>
```

### 2. 配送地址选择

```vue
<!-- pages/address/address.vue -->
<template>
  <view class="address-container">
    <!-- 地图显示 -->
    <map 
      id="deliveryMap"
      :longitude="mapCenter.longitude"
      :latitude="mapCenter.latitude"
      :markers="markers"
      :show-location="true"
      @markertap="onMarkerTap"
      @regionchange="onRegionChange"
      class="delivery-map"
    />
    
    <!-- 地址搜索 -->
    <view class="search-container">
      <input 
        v-model="searchKeyword"
        placeholder="搜索地址"
        @input="onSearchInput"
        class="search-input"
      />
      <button @click="getCurrentLocation" class="location-btn">📍</button>
    </view>
    
    <!-- 地址列表 -->
    <scroll-view scroll-y class="address-list">
      <view 
        v-for="address in addressList" 
        :key="address.id"
        class="address-item"
        :class="{ selected: selectedAddress?.id === address.id }"
        @click="selectAddress(address)"
      >
        <view class="address-info">
          <text class="address-name">{{ address.name }}</text>
          <text class="address-detail">{{ address.detail }}</text>
          <text class="address-distance">距离: {{ address.distance }}km</text>
        </view>
        <view class="delivery-info">
          <text class="delivery-time">{{ address.deliveryTime }}</text>
          <text class="delivery-fee">配送费: ¥{{ address.deliveryFee }}</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 确认按钮 -->
    <button 
      class="confirm-btn"
      :disabled="!selectedAddress"
      @click="confirmAddress"
    >
      确认地址
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      mapCenter: {
        longitude: 116.397428,
        latitude: 39.90923
      },
      markers: [],
      searchKeyword: '',
      addressList: [],
      selectedAddress: null
    }
  },
  
  onLoad() {
    this.getCurrentLocation()
  },
  
  methods: {
    getCurrentLocation() {
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.mapCenter = {
            longitude: res.longitude,
            latitude: res.latitude
          }
          this.searchNearbyAddresses()
        },
        fail: (error) => {
          console.error('获取位置失败:', error)
          uni.showToast({
            title: '获取位置失败',
            icon: 'error'
          })
        }
      })
    },
    
    async searchNearbyAddresses() {
      try {
        const res = await this.$http.get('/api/addresses/nearby', {
          params: {
            longitude: this.mapCenter.longitude,
            latitude: this.mapCenter.latitude,
            radius: 5000 // 5km范围内
          }
        })
        
        this.addressList = res.data.map(address => ({
          ...address,
          distance: this.calculateDistance(
            this.mapCenter.latitude,
            this.mapCenter.longitude,
            address.latitude,
            address.longitude
          ).toFixed(1)
        }))
        
        this.updateMapMarkers()
      } catch (error) {
        console.error('搜索地址失败:', error)
      }
    },
    
    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371 // 地球半径(km)
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    },
    
    updateMapMarkers() {
      this.markers = this.addressList.map((address, index) => ({
        id: address.id,
        longitude: address.longitude,
        latitude: address.latitude,
        iconPath: '/static/images/marker.png',
        width: 30,
        height: 30,
        callout: {
          content: address.name,
          display: 'ALWAYS'
        }
      }))
    },
    
    selectAddress(address) {
      this.selectedAddress = address
      
      // 更新地图中心
      this.mapCenter = {
        longitude: address.longitude,
        latitude: address.latitude
      }
    },
    
    confirmAddress() {
      if (!this.selectedAddress) {
        uni.showToast({
          title: '请选择地址',
          icon: 'none'
        })
        return
      }
      
      // 返回上一页并传递地址信息
      const pages = getCurrentPages()
      const prevPage = pages[pages.length - 2]
      
      if (prevPage) {
        prevPage.$vm.setDeliveryAddress(this.selectedAddress)
      }
      
      uni.navigateBack()
    }
  }
}
</script>
```

### 3. 订单跟踪系统

```javascript
// utils/orderTracking.js
class OrderTracker {
  constructor() {
    this.socket = null
    this.trackingCallbacks = new Map()
  }
  
  // 初始化WebSocket连接
  initSocket() {
    this.socket = uni.connectSocket({
      url: 'wss://api.example.com/ws/tracking'
    })
    
    this.socket.onOpen(() => {
      console.log('订单跟踪连接已建立')
    })
    
    this.socket.onMessage((res) => {
      const data = JSON.parse(res.data)
      this.handleTrackingUpdate(data)
    })
    
    this.socket.onError((error) => {
      console.error('WebSocket连接错误:', error)
    })
    
    this.socket.onClose(() => {
      console.log('订单跟踪连接已关闭')
      // 重连机制
      setTimeout(() => {
        this.initSocket()
      }, 5000)
    })
  }
  
  // 开始跟踪订单
  startTracking(orderId, callback) {
    this.trackingCallbacks.set(orderId, callback)
    
    if (this.socket) {
      this.socket.send({
        data: JSON.stringify({
          action: 'subscribe',
          orderId: orderId
        })
      })
    }
  }
  
  // 停止跟踪订单
  stopTracking(orderId) {
    this.trackingCallbacks.delete(orderId)
    
    if (this.socket) {
      this.socket.send({
        data: JSON.stringify({
          action: 'unsubscribe',
          orderId: orderId
        })
      })
    }
  }
  
  // 处理跟踪更新
  handleTrackingUpdate(data) {
    const { orderId, status, location, estimatedTime } = data
    const callback = this.trackingCallbacks.get(orderId)
    
    if (callback) {
      callback({
        orderId,
        status,
        location,
        estimatedTime,
        timestamp: Date.now()
      })
    }
  }
  
  // 获取订单状态
  async getOrderStatus(orderId) {
    try {
      const res = await uni.request({
        url: `/api/orders/${orderId}/status`,
        method: 'GET'
      })
      
      return res.data
    } catch (error) {
      console.error('获取订单状态失败:', error)
      throw error
    }
  }
}

export default new OrderTracker()
```

## 📊 性能优化

### 1. 图片优化
```javascript
// utils/imageOptimizer.js
export const optimizeImage = (url, options = {}) => {
  const {
    width = 300,
    height = 300,
    quality = 80,
    format = 'webp'
  } = options
  
  // 使用CDN图片处理服务
  return `${url}?imageView2/2/w/${width}/h/${height}/q/${quality}/format/${format}`
}

// 在组件中使用
computed: {
  optimizedImage() {
    return optimizeImage(this.product.image, {
      width: 200,
      height: 200,
      quality: 75
    })
  }
}
```

### 2. 数据预加载
```javascript
// utils/preloader.js
class DataPreloader {
  constructor() {
    this.cache = new Map()
    this.preloadQueue = []
  }
  
  // 预加载商品数据
  async preloadProducts(categoryId) {
    const cacheKey = `products_${categoryId}`
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    try {
      const res = await uni.request({
        url: '/api/products',
        data: { category: categoryId }
      })
      
      this.cache.set(cacheKey, res.data)
      return res.data
    } catch (error) {
      console.error('预加载商品失败:', error)
      return null
    }
  }
  
  // 预加载用户常用地址
  async preloadAddresses() {
    try {
      const res = await uni.request({
        url: '/api/user/addresses'
      })
      
      this.cache.set('user_addresses', res.data)
      return res.data
    } catch (error) {
      console.error('预加载地址失败:', error)
      return null
    }
  }
}

export default new DataPreloader()
```

## 🎨 UI/UX设计

### 设计理念
1. **新鲜感** - 使用绿色系配色，体现生鲜特色
2. **便捷性** - 简化操作流程，提高购买效率
3. **信任感** - 展示商品来源、配送信息，建立用户信任

### 色彩搭配
```css
/* 主色调 */
:root {
  --primary-color: #52C41A;    /* 生鲜绿 */
  --secondary-color: #1890FF;  /* 信任蓝 */
  --warning-color: #FAAD14;    /* 提醒黄 */
  --danger-color: #FF4D4F;     /* 警告红 */
  --text-color: #262626;       /* 主文字 */
  --text-secondary: #8C8C8C;   /* 次要文字 */
  --background: #F5F5F5;       /* 背景色 */
}

/* 商品卡片样式 */
.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

/* 新鲜度标签 */
.freshness-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: var(--primary-color);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}
```

## 📈 数据分析

### 业务指标
- **订单转化率**: 18.5%
- **平均客单价**: ¥89
- **配送准时率**: 95.2%
- **用户复购率**: 68%
- **商品好评率**: 4.6/5.0

### 用户行为分析
```javascript
// 埋点数据收集
const trackUserBehavior = (event, data) => {
  const trackingData = {
    event,
    data,
    userId: getCurrentUserId(),
    timestamp: Date.now(),
    page: getCurrentPagePath(),
    platform: uni.getSystemInfoSync().platform
  }
  
  // 发送到数据分析平台
  uni.request({
    url: '/api/analytics/track',
    method: 'POST',
    data: trackingData
  })
}

// 使用示例
trackUserBehavior('product_view', {
  productId: 'P001',
  category: 'vegetables',
  price: 12.8
})
```

## 🚀 项目总结

### 技术亮点
1. **跨平台开发** - 使用uni-app实现一套代码多端运行
2. **实时配送** - WebSocket实现订单实时跟踪
3. **智能路线** - 算法优化配送路线，提高效率
4. **地图集成** - 深度集成地图API，提供精准定位

### 业务成果
1. **用户增长** - 4个月内获得5万+用户
2. **订单量** - 日均订单量达到2000+
3. **覆盖范围** - 成功拓展15个城市
4. **用户满意度** - 整体满意度达到92%

### 经验总结
1. **冷链管理** - 生鲜配送的核心是温度控制
2. **时效性** - 快速配送是用户选择的关键因素
3. **品质保证** - 商品质量直接影响用户复购
4. **服务体验** - 优质的客服能显著提升用户满意度

---

*这个项目成功地将传统生鲜零售与移动互联网技术结合，通过智能配送系统和优质的用户体验，在竞争激烈的生鲜电商市场中占据了一席之地。*