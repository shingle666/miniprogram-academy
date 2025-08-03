# 小程序性能优化指南

小程序性能优化是提升用户体验的关键环节。本指南将从启动性能、运行时性能、内存管理、网络优化等多个维度，为你提供全面的小程序性能优化策略和实践方案。

## 性能优化概述

### 性能指标

#### 启动性能指标
- **首屏渲染时间**：从小程序启动到首屏内容完全显示的时间
- **页面切换时间**：页面间跳转的响应时间
- **代码包下载时间**：小程序代码包的下载和解析时间

#### 运行时性能指标
- **页面滚动流畅度**：滚动时的帧率表现
- **交互响应时间**：用户操作到界面响应的延迟
- **内存使用量**：小程序运行时的内存占用

#### 网络性能指标
- **接口响应时间**：API 请求的平均响应时间
- **资源加载时间**：图片、音频等资源的加载速度
- **网络错误率**：网络请求的失败比例

### 性能监控

#### 使用小程序性能监控

```javascript
// app.js
App({
  onLaunch() {
    // 启用性能监控
    if (wx.canIUse('getPerformance')) {
      const performance = wx.getPerformance()
      
      // 监听性能数据
      performance.createObserver((entryList) => {
        console.log('性能数据:', entryList.getEntries())
      }).observe({ entryTypes: ['render', 'script', 'loadPackage'] })
    }
  },
  
  onShow() {
    // 记录应用显示时间
    console.log('应用显示时间:', Date.now())
  }
})
```

#### 自定义性能监控

```javascript
// utils/performance.js
class PerformanceMonitor {
  constructor() {
    this.marks = new Map()
    this.measures = new Map()
  }
  
  // 标记时间点
  mark(name) {
    this.marks.set(name, Date.now())
  }
  
  // 测量时间间隔
  measure(name, startMark, endMark) {
    const startTime = this.marks.get(startMark)
    const endTime = this.marks.get(endMark) || Date.now()
    
    if (startTime) {
      const duration = endTime - startTime
      this.measures.set(name, duration)
      console.log(`[PERF] ${name}: ${duration}ms`)
      return duration
    }
  }
  
  // 获取所有测量结果
  getMeasures() {
    return Object.fromEntries(this.measures)
  }
  
  // 清除所有标记
  clear() {
    this.marks.clear()
    this.measures.clear()
  }
}

// 全局性能监控实例
const performanceMonitor = new PerformanceMonitor()

export default performanceMonitor
```

## 启动性能优化

### 代码包优化

#### 代码分包

```javascript
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"
  ],
  "subPackages": [
    {
      "root": "pages/shop",
      "name": "shop",
      "pages": [
        "list/list",
        "detail/detail"
      ]
    },
    {
      "root": "pages/user",
      "name": "user",
      "pages": [
        "settings/settings",
        "orders/orders"
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["shop"]
    }
  }
}
```

#### 独立分包

```javascript
// app.json
{
  "subPackages": [
    {
      "root": "pages/activity",
      "name": "activity",
      "pages": [
        "detail/detail"
      ],
      "independent": true
    }
  ]
}
```

#### 代码压缩和混淆

```javascript
// project.config.json
{
  "setting": {
    "minified": true,
    "minifyJS": true,
    "minifyWXML": true,
    "minifyWXSS": true,
    "codeProtect": true
  }
}
```

### 资源优化

#### 图片优化

```javascript
// utils/image.js
class ImageOptimizer {
  // 图片压缩
  static compressImage(src, quality = 0.8) {
    return new Promise((resolve, reject) => {
      wx.compressImage({
        src: src,
        quality: quality,
        success: resolve,
        fail: reject
      })
    })
  }
  
  // 选择合适的图片格式
  static chooseImageFormat(src) {
    const canvas = wx.createCanvasContext('imageCanvas')
    
    return new Promise((resolve) => {
      wx.getImageInfo({
        src: src,
        success: (res) => {
          const { width, height } = res
          
          // 根据图片特征选择格式
          if (width * height > 1000000) {
            // 大图使用 JPEG
            resolve('jpeg')
          } else if (src.includes('icon') || src.includes('logo')) {
            // 图标使用 PNG
            resolve('png')
          } else {
            // 默认使用 WebP（如果支持）
            resolve('webp')
          }
        }
      })
    })
  }
  
  // 懒加载图片
  static lazyLoadImage(selector, options = {}) {
    const observer = wx.createIntersectionObserver()
    
    observer.relativeToViewport({ bottom: 100 })
    observer.observe(selector, (res) => {
      if (res.intersectionRatio > 0) {
        const img = res.target
        const dataSrc = img.dataset.src
        
        if (dataSrc) {
          img.src = dataSrc
          img.removeAttribute('data-src')
          observer.unobserve(selector)
        }
      }
    })
  }
}

export default ImageOptimizer
```

#### 字体优化

```css
/* 使用系统字体 */
.text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
}

/* 字体子集化 */
@font-face {
  font-family: 'CustomFont';
  src: url('fonts/custom-subset.woff2') format('woff2');
  font-display: swap;
  unicode-range: U+4E00-9FFF; /* 只包含中文字符 */
}
```

### 首屏优化

#### 关键路径优化

```javascript
// pages/index/index.js
Page({
  data: {
    // 首屏必需数据
    banners: [],
    categories: [],
    // 非首屏数据延迟加载
    recommendations: null,
    activities: null
  },
  
  onLoad() {
    // 优先加载首屏数据
    this.loadCriticalData()
    
    // 延迟加载非关键数据
    setTimeout(() => {
      this.loadNonCriticalData()
    }, 100)
  },
  
  async loadCriticalData() {
    try {
      const [banners, categories] = await Promise.all([
        this.getBanners(),
        this.getCategories()
      ])
      
      this.setData({
        banners,
        categories
      })
    } catch (error) {
      console.error('加载首屏数据失败:', error)
    }
  },
  
  async loadNonCriticalData() {
    try {
      const [recommendations, activities] = await Promise.all([
        this.getRecommendations(),
        this.getActivities()
      ])
      
      this.setData({
        recommendations,
        activities
      })
    } catch (error) {
      console.error('加载非关键数据失败:', error)
    }
  }
})
```

#### 骨架屏

```xml
<!-- pages/index/index.wxml -->
<view class="container">
  <!-- 骨架屏 -->
  <view wx:if="{{!dataLoaded}}" class="skeleton">
    <view class="skeleton-banner"></view>
    <view class="skeleton-categories">
      <view class="skeleton-category" wx:for="{{4}}" wx:key="index"></view>
    </view>
    <view class="skeleton-list">
      <view class="skeleton-item" wx:for="{{6}}" wx:key="index"></view>
    </view>
  </view>
  
  <!-- 实际内容 -->
  <view wx:else class="content">
    <swiper class="banner-swiper">
      <swiper-item wx:for="{{banners}}" wx:key="id">
        <image src="{{item.image}}" mode="aspectFill" />
      </swiper-item>
    </swiper>
    
    <view class="categories">
      <view class="category" wx:for="{{categories}}" wx:key="id">
        <image src="{{item.icon}}" />
        <text>{{item.name}}</text>
      </view>
    </view>
  </view>
</view>
```

```css
/* pages/index/index.wxss */
.skeleton {
  padding: 20rpx;
}

.skeleton-banner {
  width: 100%;
  height: 300rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.skeleton-categories {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.skeleton-category {
  width: 120rpx;
  height: 120rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 10rpx;
}

.skeleton-item {
  width: 100%;
  height: 200rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

## 运行时性能优化

### 渲染性能优化

#### 减少 setData 调用

```javascript
// 错误示例：频繁调用 setData
Page({
  updateList() {
    this.data.list.forEach((item, index) => {
      this.setData({
        [`list[${index}].status`]: 'updated'
      })
    })
  }
})

// 正确示例：批量更新
Page({
  updateList() {
    const updates = {}
    this.data.list.forEach((item, index) => {
      updates[`list[${index}].status`] = 'updated'
    })
    this.setData(updates)
  }
})
```

#### 优化数据结构

```javascript
// 错误示例：深层嵌套
Page({
  data: {
    user: {
      profile: {
        personal: {
          name: '张三',
          age: 25
        }
      }
    }
  },
  
  updateName(newName) {
    this.setData({
      'user.profile.personal.name': newName
    })
  }
})

// 正确示例：扁平化数据
Page({
  data: {
    userName: '张三',
    userAge: 25
  },
  
  updateName(newName) {
    this.setData({
      userName: newName
    })
  }
})
```

#### 虚拟列表

```javascript
// components/virtual-list/virtual-list.js
Component({
  properties: {
    items: {
      type: Array,
      value: []
    },
    itemHeight: {
      type: Number,
      value: 100
    },
    containerHeight: {
      type: Number,
      value: 600
    }
  },
  
  data: {
    visibleItems: [],
    scrollTop: 0,
    startIndex: 0,
    endIndex: 0
  },
  
  lifetimes: {
    attached() {
      this.updateVisibleItems()
    }
  },
  
  observers: {
    'items, containerHeight, itemHeight'() {
      this.updateVisibleItems()
    }
  },
  
  methods: {
    updateVisibleItems() {
      const { items, itemHeight, containerHeight } = this.properties
      const { scrollTop } = this.data
      
      const visibleCount = Math.ceil(containerHeight / itemHeight)
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(startIndex + visibleCount + 1, items.length)
      
      const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        index: startIndex + index,
        top: (startIndex + index) * itemHeight
      }))
      
      this.setData({
        visibleItems,
        startIndex,
        endIndex
      })
    },
    
    onScroll(e) {
      const scrollTop = e.detail.scrollTop
      this.setData({ scrollTop })
      
      // 节流更新
      clearTimeout(this.scrollTimer)
      this.scrollTimer = setTimeout(() => {
        this.updateVisibleItems()
      }, 16)
    }
  }
})
```

```xml
<!-- components/virtual-list/virtual-list.wxml -->
<scroll-view 
  class="virtual-list" 
  scroll-y 
  style="height: {{containerHeight}}px"
  bindscroll="onScroll"
  scroll-top="{{scrollTop}}"
>
  <view 
    class="virtual-container" 
    style="height: {{items.length * itemHeight}}px"
  >
    <view 
      class="virtual-item" 
      wx:for="{{visibleItems}}" 
      wx:key="index"
      style="position: absolute; top: {{item.top}}px; height: {{itemHeight}}px"
    >
      <slot name="item" item="{{item}}"></slot>
    </view>
  </view>
</scroll-view>
```

### 事件优化

#### 事件委托

```javascript
// 错误示例：为每个项目绑定事件
Page({
  data: {
    list: [
      { id: 1, name: '项目1' },
      { id: 2, name: '项目2' }
    ]
  },
  
  onItemTap(e) {
    const id = e.currentTarget.dataset.id
    console.log('点击项目:', id)
  }
})
```

```xml
<!-- 错误示例 -->
<view wx:for="{{list}}" wx:key="id" bindtap="onItemTap" data-id="{{item.id}}">
  {{item.name}}
</view>
```

```javascript
// 正确示例：事件委托
Page({
  data: {
    list: [
      { id: 1, name: '项目1' },
      { id: 2, name: '项目2' }
    ]
  },
  
  onListTap(e) {
    const id = e.target.dataset.id
    if (id) {
      console.log('点击项目:', id)
    }
  }
})
```

```xml
<!-- 正确示例 -->
<view class="list" bindtap="onListTap">
  <view wx:for="{{list}}" wx:key="id" class="item" data-id="{{item.id}}">
    {{item.name}}
  </view>
</view>
```

#### 防抖和节流

```javascript
// utils/throttle.js
export function throttle(func, delay) {
  let timer = null
  return function(...args) {
    if (!timer) {
      timer = setTimeout(() => {
        func.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

export function debounce(func, delay) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 使用示例
import { throttle, debounce } from '../../utils/throttle'

Page({
  onLoad() {
    // 节流滚动事件
    this.onScrollThrottled = throttle(this.onScroll.bind(this), 100)
    // 防抖搜索
    this.onSearchDebounced = debounce(this.onSearch.bind(this), 300)
  },
  
  onScroll(e) {
    console.log('滚动位置:', e.detail.scrollTop)
  },
  
  onSearch(keyword) {
    console.log('搜索关键词:', keyword)
    // 执行搜索逻辑
  }
})
```

## 内存管理优化

### 内存泄漏预防

#### 清理定时器

```javascript
Page({
  onLoad() {
    // 设置定时器
    this.timer = setInterval(() => {
      this.updateTime()
    }, 1000)
  },
  
  onUnload() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  
  updateTime() {
    this.setData({
      currentTime: new Date().toLocaleTimeString()
    })
  }
})
```

#### 清理事件监听

```javascript
Page({
  onLoad() {
    // 监听网络状态变化
    this.onNetworkStatusChange = this.handleNetworkStatusChange.bind(this)
    wx.onNetworkStatusChange(this.onNetworkStatusChange)
  },
  
  onUnload() {
    // 移除事件监听
    if (this.onNetworkStatusChange) {
      wx.offNetworkStatusChange(this.onNetworkStatusChange)
      this.onNetworkStatusChange = null
    }
  },
  
  handleNetworkStatusChange(res) {
    console.log('网络状态变化:', res.isConnected)
  }
})
```

#### 图片资源管理

```javascript
// utils/image-cache.js
class ImageCache {
  constructor(maxSize = 50) {
    this.cache = new Map()
    this.maxSize = maxSize
  }
  
  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // 删除最旧的缓存
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    this.cache.set(key, value)
  }
  
  get(key) {
    return this.cache.get(key)
  }
  
  clear() {
    this.cache.clear()
  }
  
  // 预加载图片
  preloadImage(src) {
    return new Promise((resolve, reject) => {
      if (this.cache.has(src)) {
        resolve(this.cache.get(src))
        return
      }
      
      wx.getImageInfo({
        src: src,
        success: (res) => {
          this.set(src, res)
          resolve(res)
        },
        fail: reject
      })
    })
  }
}

const imageCache = new ImageCache()
export default imageCache
```

### 数据管理优化

#### 分页加载

```javascript
Page({
  data: {
    list: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false
  },
  
  onLoad() {
    this.loadData()
  },
  
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore()
    }
  },
  
  async loadData() {
    this.setData({ loading: true })
    
    try {
      const res = await this.fetchData(1, this.data.pageSize)
      this.setData({
        list: res.data,
        page: 1,
        hasMore: res.data.length === this.data.pageSize,
        loading: false
      })
    } catch (error) {
      console.error('加载数据失败:', error)
      this.setData({ loading: false })
    }
  },
  
  async loadMore() {
    this.setData({ loading: true })
    
    try {
      const nextPage = this.data.page + 1
      const res = await this.fetchData(nextPage, this.data.pageSize)
      
      this.setData({
        list: [...this.data.list, ...res.data],
        page: nextPage,
        hasMore: res.data.length === this.data.pageSize,
        loading: false
      })
    } catch (error) {
      console.error('加载更多失败:', error)
      this.setData({ loading: false })
    }
  },
  
  async fetchData(page, pageSize) {
    return new Promise((resolve) => {
      wx.request({
        url: '/api/data',
        data: { page, pageSize },
        success: resolve
      })
    })
  }
})
```

#### 数据缓存策略

```javascript
// utils/cache.js
class DataCache {
  constructor() {
    this.cache = new Map()
    this.expireTime = new Map()
  }
  
  set(key, data, ttl = 300000) { // 默认5分钟过期
    this.cache.set(key, data)
    this.expireTime.set(key, Date.now() + ttl)
  }
  
  get(key) {
    const expireTime = this.expireTime.get(key)
    if (expireTime && Date.now() > expireTime) {
      this.delete(key)
      return null
    }
    return this.cache.get(key)
  }
  
  delete(key) {
    this.cache.delete(key)
    this.expireTime.delete(key)
  }
  
  clear() {
    this.cache.clear()
    this.expireTime.clear()
  }
  
  // 清理过期缓存
  cleanup() {
    const now = Date.now()
    for (const [key, expireTime] of this.expireTime.entries()) {
      if (now > expireTime) {
        this.delete(key)
      }
    }
  }
}

const dataCache = new DataCache()

// 定期清理过期缓存
setInterval(() => {
  dataCache.cleanup()
}, 60000) // 每分钟清理一次

export default dataCache
```

## 网络优化

### 请求优化

#### 请求合并

```javascript
// utils/request-batch.js
class RequestBatch {
  constructor() {
    this.queue = []
    this.timer = null
  }
  
  add(request) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        ...request,
        resolve,
        reject
      })
      
      this.scheduleFlush()
    })
  }
  
  scheduleFlush() {
    if (this.timer) return
    
    this.timer = setTimeout(() => {
      this.flush()
    }, 10) // 10ms 内的请求合并
  }
  
  flush() {
    if (this.queue.length === 0) return
    
    const requests = this.queue.splice(0)
    this.timer = null
    
    // 按接口分组
    const groups = new Map()
    requests.forEach(req => {
      const key = `${req.method || 'GET'}_${req.url}`
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key).push(req)
    })
    
    // 批量请求
    groups.forEach((reqs, key) => {
      if (reqs.length === 1) {
        // 单个请求直接发送
        this.sendRequest(reqs[0])
      } else {
        // 多个请求合并
        this.sendBatchRequest(reqs)
      }
    })
  }
  
  sendRequest(req) {
    wx.request({
      ...req,
      success: req.resolve,
      fail: req.reject
    })
  }
  
  sendBatchRequest(requests) {
    const batchData = requests.map(req => ({
      url: req.url,
      method: req.method || 'GET',
      data: req.data
    }))
    
    wx.request({
      url: '/api/batch',
      method: 'POST',
      data: { requests: batchData },
      success: (res) => {
        res.data.results.forEach((result, index) => {
          requests[index].resolve(result)
        })
      },
      fail: (error) => {
        requests.forEach(req => req.reject(error))
      }
    })
  }
}

const requestBatch = new RequestBatch()
export default requestBatch
```

#### 请求缓存

```javascript
// utils/request-cache.js
import dataCache from './cache'

class RequestCache {
  constructor() {
    this.pendingRequests = new Map()
  }
  
  async request(options) {
    const cacheKey = this.getCacheKey(options)
    
    // 检查缓存
    const cached = dataCache.get(cacheKey)
    if (cached) {
      return cached
    }
    
    // 检查是否有相同的请求正在进行
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)
    }
    
    // 发送请求
    const promise = this.sendRequest(options)
    this.pendingRequests.set(cacheKey, promise)
    
    try {
      const result = await promise
      
      // 缓存结果
      if (options.cache !== false) {
        dataCache.set(cacheKey, result, options.cacheTTL)
      }
      
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }
  
  sendRequest(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: resolve,
        fail: reject
      })
    })
  }
  
  getCacheKey(options) {
    const { url, method = 'GET', data } = options
    return `${method}_${url}_${JSON.stringify(data || {})}`
  }
}

const requestCache = new RequestCache()
export default requestCache
```

### 资源预加载

#### 关键资源预加载

```javascript
// utils/preloader.js
class ResourcePreloader {
  constructor() {
    this.preloadedImages = new Set()
    this.preloadedData = new Map()
  }
  
  // 预加载图片
  async preloadImages(urls) {
    const promises = urls.map(url => {
      if (this.preloadedImages.has(url)) {
        return Promise.resolve()
      }
      
      return new Promise((resolve, reject) => {
        wx.getImageInfo({
          src: url,
          success: () => {
            this.preloadedImages.add(url)
            resolve()
          },
          fail: reject
        })
      })
    })
    
    try {
      await Promise.all(promises)
      console.log('图片预加载完成')
    } catch (error) {
      console.error('图片预加载失败:', error)
    }
  }
  
  // 预加载数据
  async preloadData(requests) {
    const promises = requests.map(async (req) => {
      try {
        const result = await this.request(req)
        this.preloadedData.set(req.key, result)
      } catch (error) {
        console.error(`预加载数据失败 ${req.key}:`, error)
      }
    })
    
    await Promise.all(promises)
    console.log('数据预加载完成')
  }
  
  // 获取预加载的数据
  getPreloadedData(key) {
    return this.preloadedData.get(key)
  }
  
  request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: resolve,
        fail: reject
      })
    })
  }
}

const preloader = new ResourcePreloader()
export default preloader
```

#### 智能预加载

```javascript
// utils/smart-preloader.js
class SmartPreloader {
  constructor() {
    this.userBehavior = new Map()
    this.preloadRules = new Map()
  }
  
  // 记录用户行为
  recordBehavior(page, action, target) {
    const key = `${page}_${action}`
    if (!this.userBehavior.has(key)) {
      this.userBehavior.set(key, new Map())
    }
    
    const actionMap = this.userBehavior.get(key)
    const count = actionMap.get(target) || 0
    actionMap.set(target, count + 1)
    
    // 更新预加载规则
    this.updatePreloadRules(key, target, count + 1)
  }
  
  // 更新预加载规则
  updatePreloadRules(key, target, count) {
    if (count >= 3) { // 用户访问3次以上的资源进行预加载
      if (!this.preloadRules.has(key)) {
        this.preloadRules.set(key, new Set())
      }
      this.preloadRules.get(key).add(target)
    }
  }
  
  // 获取预加载建议
  getPreloadSuggestions(page, action) {
    const key = `${page}_${action}`
    return this.preloadRules.get(key) || new Set()
  }
  
  // 执行智能预加载
  async executeSmartPreload(page, action) {
    const suggestions = this.getPreloadSuggestions(page, action)
    
    for (const target of suggestions) {
      try {
        if (target.startsWith('http')) {
          // 预加载图片
          await wx.getImageInfo({ src: target })
        } else {
          // 预加载页面数据
          await this.preloadPageData(target)
        }
      } catch (error) {
        console.error(`智能预加载失败 ${target}:`, error)
      }
    }
  }
  
  async preloadPageData(page) {
    // 根据页面预加载对应数据
    const dataLoaders = {
      'product-detail': () => this.preloadProductData(),
      'user-profile': () => this.preloadUserData(),
      'order-list': () => this.preloadOrderData()
    }
    
    const loader = dataLoaders[page]
    if (loader) {
      await loader()
    }
  }
}

const smartPreloader = new SmartPreloader()
export default smartPreloader
```

## 样式和动画优化

### CSS 优化

#### 减少重排和重绘

```css
/* 错误示例：会触发重排 */
.bad-animation {
  transition: width 0.3s, height 0.3s, left 0.3s, top 0.3s;
}

/* 正确示例：只触发合成 */
.good-animation {
  transition: transform 0.3s, opacity 0.3s;
}

/* 使用 transform 替代位置属性 */
.move-element {
  transform: translateX(100px) translateY(50px);
}

/* 使用 opacity 替代 visibility */
.fade-element {
  opacity: 0;
}
```

#### 优化选择器

```css
/* 错误示例：复杂选择器 */
.container .list .item .title .text {
  color: #333;
}

/* 正确示例：简化选择器 */
.item-title-text {
  color: #333;
}

/* 使用类选择器替代标签选择器 */
.button {
  background: #007bff;
}

/* 避免通配符选择器 */
.container * {
  box-sizing: border-box; /* 避免这样使用 */
}
```

### 动画优化

#### 使用 CSS 动画替代 JS 动画

```css
/* CSS 动画 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}

/* 硬件加速 */
.hardware-accelerated {
  transform: translateZ(0);
  will-change: transform;
}
```

#### 动画性能监控

```javascript
// utils/animation-monitor.js
class AnimationMonitor {
  constructor() {
    this.animations = new Map()
    this.performanceData = []
  }
  
  // 开始监控动画
  startMonitoring(name) {
    const startTime = performance.now()
    this.animations.set(name, {
      startTime,
      frames: 0,
      droppedFrames: 0
    })
    
    this.monitorFrames(name)
  }
  
  // 监控帧率
  monitorFrames(name) {
    const animation = this.animations.get(name)
    if (!animation) return
    
    const checkFrame = () => {
      if (this.animations.has(name)) {
        animation.frames++
        
        // 检查是否掉帧
        const expectedFrames = (performance.now() - animation.startTime) / 16.67
        if (animation.frames < expectedFrames * 0.9) {
          animation.droppedFrames++
        }
        
        requestAnimationFrame(checkFrame)
      }
    }
    
    requestAnimationFrame(checkFrame)
  }
  
  // 结束监控
  endMonitoring(name) {
    const animation = this.animations.get(name)
    if (!animation) return
    
    const duration = performance.now() - animation.startTime
    const fps = (animation.frames / duration) * 1000
    const dropRate = animation.droppedFrames / animation.frames
    
    const data = {
      name,
      duration,
      fps,
      dropRate,
      frames: animation.frames,
      droppedFrames: animation.droppedFrames
    }
    
    this.performanceData.push(data)
    this.animations.delete(name)
    
    console.log(`动画性能 ${name}:`, data)
    return data
  }
  
  // 获取性能报告
  getPerformanceReport() {
    return {
      totalAnimations: this.performanceData.length,
      averageFPS: this.performanceData.reduce((sum, data) => sum + data.fps, 0) / this.performanceData.length,
      averageDropRate: this.performanceData.reduce((sum, data) => sum + data.dropRate, 0) / this.performanceData.length,
      animations: this.performanceData
    }
  }
}

const animationMonitor = new AnimationMonitor()
export default animationMonitor
```

## 工具和调试

### 性能分析工具

#### 自定义性能分析器

```javascript
// utils/profiler.js
class Profiler {
  constructor() {
    this.profiles = new Map()
    this.isEnabled = true
  }
  
  // 开始性能分析
  start(name) {
    if (!this.isEnabled) return
    
    this.profiles.set(name, {
      startTime: performance.now(),
      startMemory: this.getMemoryUsage(),
      marks: []
    })
  }
  
  // 添加标记点
  mark(profileName, markName) {
    if (!this.isEnabled) return
    
    const profile = this.profiles.get(profileName)
    if (profile) {
      profile.marks.push({
        name: markName,
        time: performance.now() - profile.startTime,
        memory: this.getMemoryUsage()
      })
    }
  }
  
  // 结束性能分析
  end(name) {
    if (!this.isEnabled) return
    
    const profile = this.profiles.get(name)
    if (!profile) return
    
    const endTime = performance.now()
    const endMemory = this.getMemoryUsage()
    
    const result = {
      name,
      duration: endTime - profile.startTime,
      memoryDelta: endMemory - profile.startMemory,
      marks: profile.marks,
      timestamp: new Date().toISOString()
    }
    
    this.profiles.delete(name)
    this.logResult(result)
    
    return result
  }
  
  // 获取内存使用情况
  getMemoryUsage() {
    if (wx.getPerformance && wx.getPerformance().memory) {
      return wx.getPerformance().memory.usedJSHeapSize
    }
    return 0
  }
  
  // 记录结果
  logResult(result) {
    console.group(`性能分析: ${result.name}`)
    console.log(`总耗时: ${result.duration.toFixed(2)}ms`)
    console.log(`内存变化: ${(result.memoryDelta / 1024 / 1024).toFixed(2)}MB`)
    
    if (result.marks.length > 0) {
      console.log('标记点:')
      result.marks.forEach(mark => {
        console.log(`  ${mark.name}: ${mark.time.toFixed(2)}ms`)
      })
    }
    
    console.groupEnd()
  }
  
  // 启用/禁用分析器
  setEnabled(enabled) {
    this.isEnabled = enabled
  }
}

const profiler = new Profiler()
export default profiler
```

#### 使用示例

```javascript
// pages/product/detail.js
import profiler from '../../utils/profiler'

Page({
  onLoad(options) {
    profiler.start('page-load')
    
    this.loadProductData(options.id)
  },
  
  async loadProductData(id) {
    profiler.mark('page-load', 'start-api-request')
    
    try {
      const product = await this.fetchProduct(id)
      profiler.mark('page-load', 'api-request-complete')
      
      this.setData({ product })
      profiler.mark('page-load', 'data-set-complete')
      
      await this.loadRelatedProducts(product.categoryId)
      profiler.mark('page-load', 'related-products-loaded')
      
    } catch (error) {
      console.error('加载产品数据失败:', error)
    } finally {
      profiler.end('page-load')
    }
  }
})
```

### 调试工具

#### 性能监控面板

```javascript
// components/performance-panel/performance-panel.js
Component({
  data: {
    visible: false,
    fps: 0,
    memory: 0,
    networkRequests: 0,
    errors: []
  },
  
  lifetimes: {
    attached() {
      this.startMonitoring()
    },
    
    detached() {
      this.stopMonitoring()
    }
  },
  
  methods: {
    // 开始监控
    startMonitoring() {
      // 监控 FPS
      this.monitorFPS()
      
      // 监控内存
      this.monitorMemory()
      
      // 监控网络请求
      this.monitorNetwork()
      
      // 监控错误
      this.monitorErrors()
    },
    
    // 监控帧率
    monitorFPS() {
      let frames = 0
      let lastTime = performance.now()
      
      const countFPS = () => {
        frames++
        const currentTime = performance.now()
        
        if (currentTime - lastTime >= 1000) {
          this.setData({ fps: frames })
          frames = 0
          lastTime = currentTime
        }
        
        if (this.data.visible) {
          requestAnimationFrame(countFPS)
        }
      }
      
      requestAnimationFrame(countFPS)
    },
    
    // 监控内存
    monitorMemory() {
      const updateMemory = () => {
        if (wx.getPerformance && wx.getPerformance().memory) {
          const memory = wx.getPerformance().memory.usedJSHeapSize / 1024 / 1024
          this.setData({ memory: memory.toFixed(2) })
        }
        
        if (this.data.visible) {
          setTimeout(updateMemory, 1000)
        }
      }
      
      updateMemory()
    },
    
    // 监控网络请求
    monitorNetwork() {
      const originalRequest = wx.request
      let requestCount = 0
      
      wx.request = (options) => {
        requestCount++
        this.setData({ networkRequests: requestCount })
        
        return originalRequest.call(wx, options)
      }
    },
    
    // 监控错误
    monitorErrors() {
      const originalError = console.error
      const errors = []
      
      console.error = (...args) => {
        errors.push({
          message: args.join(' '),
          timestamp: new Date().toLocaleTimeString()
        })
        
        this.setData({ errors: errors.slice(-10) }) // 只保留最近10个错误
        
        return originalError.apply(console, args)
      }
    },
    
    // 切换面板显示
    toggle() {
      this.setData({ visible: !this.data.visible })
      
      if (this.data.visible) {
        this.startMonitoring()
      }
    },
    
    // 清除错误日志
    clearErrors() {
      this.setData({ errors: [] })
    }
  }
})
```

```xml
<!-- components/performance-panel/performance-panel.wxml -->
<view class="performance-panel" wx:if="{{visible}}">
  <view class="panel-header">
    <text class="title">性能监控</text>
    <text class="close" bindtap="toggle">×</text>
  </view>
  
  <view class="metrics">
    <view class="metric">
      <text class="label">FPS:</text>
      <text class="value {{fps < 30 ? 'warning' : ''}}">{{fps}}</text>
    </view>
    
    <view class="metric">
      <text class="label">内存:</text>
      <text class="value {{memory > 50 ? 'warning' : ''}}">{{memory}}MB</text>
    </view>
    
    <view class="metric">
      <text class="label">网络请求:</text>
      <text class="value">{{networkRequests}}</text>
    </view>
  </view>
  
  <view class="errors" wx:if="{{errors.length > 0}}">
    <view class="errors-header">
      <text>错误日志</text>
      <text class="clear" bindtap="clearErrors">清除</text>
    </view>
    
    <scroll-view class="errors-list" scroll-y>
      <view class="error-item" wx:for="{{errors}}" wx:key="timestamp">
        <text class="error-time">{{item.timestamp}}</text>
        <text class="error-message">{{item.message}}</text>
      </view>
    </scroll-view>
  </view>
</view>

<!-- 悬浮按钮 -->
<view class="performance-toggle" wx:if="{{!visible}}" bindtap="toggle">
  <text>性能</text>
</view>
```

## 最佳实践总结

### 性能优化检查清单

#### 启动性能
- [ ] 代码包大小控制在 2MB 以内
- [ ] 使用分包加载非关键功能
- [ ] 首屏数据优先加载
- [ ] 实现骨架屏提升感知性能
- [ ] 关键资源预加载

#### 运行时性能
- [ ] 减少 setData 调用频率
- [ ] 优化数据结构，避免深层嵌套
- [ ] 使用虚拟列表处理长列表
- [ ] 实现事件委托减少事件绑定
- [ ] 添加防抖节流优化高频事件

#### 内存管理
- [ ] 及时清理定时器和事件监听
- [ ] 实现图片缓存和懒加载
- [ ] 使用分页加载控制数据量
- [ ] 定期清理过期缓存

#### 网络优化
- [ ] 实现请求缓存和去重
- [ ] 合并相似请求减少网络开销
- [ ] 关键资源预加载
- [ ] 智能预加载基于用户行为

#### 样式和动画
- [ ] 使用 transform 和 opacity 实现动画
- [ ] 避免复杂 CSS 选择器
- [ ] 启用硬件加速
- [ ] 监控动画性能

### 性能监控指标

#### 关键指标
- **首屏时间** < 1.5s
- **页面切换时间** < 300ms
- **滚动帧率** > 50fps
- **内存使用** < 100MB
- **网络请求成功率** > 99%

#### 监控实现

```javascript
// utils/performance-metrics.js
class PerformanceMetrics {
  constructor() {
    this.metrics = {
      firstScreenTime: 0,
      pageTransitionTime: 0,
      scrollFPS: 0,
      memoryUsage: 0,
      networkSuccessRate: 0
    }
  }
  
  // 记录首屏时间
  recordFirstScreenTime(time) {
    this.metrics.firstScreenTime = time
    this.reportMetric('first_screen_time', time)
  }
  
  // 记录页面切换时间
  recordPageTransitionTime(time) {
    this.metrics.pageTransitionTime = time
    this.reportMetric('page_transition_time', time)
  }
  
  // 上报性能指标
  reportMetric(name, value) {
    // 上报到性能监控平台
    wx.request({
      url: '/api/performance/report',
      method: 'POST',
      data: {
        metric: name,
        value: value,
        timestamp: Date.now(),
        userAgent: wx.getSystemInfoSync()
      }
    })
  }
  
  // 获取性能报告
  getReport() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString(),
      recommendations: this.getRecommendations()
    }
  }
  
  // 获取优化建议
  getRecommendations() {
    const recommendations = []
    
    if (this.metrics.firstScreenTime > 1500) {
      recommendations.push('首屏时间过长，建议优化关键路径')
    }
    
    if (this.metrics.pageTransitionTime > 300) {
      recommendations.push('页面切换时间过长，建议减少数据传输')
    }
    
    if (this.metrics.scrollFPS < 50) {
      recommendations.push('滚动性能不佳，建议优化渲染逻辑')
    }
    
    if (this.metrics.memoryUsage > 100) {
      recommendations.push('内存使用过高，建议检查内存泄漏')
    }
    
    return recommendations
  }
}

const performanceMetrics = new PerformanceMetrics()
export default performanceMetrics
```

## 扩展资源

### 官方文档
- [小程序性能优化指南](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/)
- [小程序分包加载](https://developers.weixin.qq.com/miniprogram/dev/framework/subpackages.html)
- [小程序性能监控](https://developers.weixin.qq.com/miniprogram/dev/api/base/performance/wx.getPerformance.html)

### 工具推荐
- **微信开发者工具**：内置性能分析面板
- **小程序助手**：性能监控和分析
- **Fundebug**：错误监控和性能分析
- **Sentry**：应用性能监控

### 学习资源
- 微信小程序性能优化最佳实践
- 前端性能优化技术分享
- 小程序开发者社区讨论

通过本指南的学习和实践，你应该能够全面掌握小程序性能优化的各个方面，从启动性能到运行时性能，从内存管理到网络优化，系统性地提升小程序的用户体验。记住，性能优化是一个持续的过程，需要结合实际业务场景和用户反馈不断调整和改进。
