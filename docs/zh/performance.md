# 性能优化

全面掌握小程序性能优化技巧，提升用户体验和应用性能。

## ⚡ 启动性能优化

### 代码包大小优化

```javascript
// 1. 按需加载组件
// 避免在app.json中全局注册所有组件
// pages/index/index.json
{
  "usingComponents": {
    "custom-button": "/components/button/button",
    "user-card": "/components/user-card/user-card"
  }
}

// 2. 分包加载
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"
  ],
  "subPackages": [
    {
      "root": "packageA",
      "name": "packageA",
      "pages": [
        "pages/cat/cat",
        "pages/dog/dog"
      ]
    },
    {
      "root": "packageB", 
      "name": "packageB",
      "pages": [
        "pages/apple/apple",
        "pages/banana/banana"
      ],
      "independent": true // 独立分包
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["packageA"]
    }
  }
}

// 3. 代码压缩和混淆
// 使用微信开发者工具的代码压缩功能
// project.config.json
{
  "setting": {
    "es6": true,
    "postcss": true,
    "minified": true,
    "newFeature": true,
    "coverView": true,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    }
  }
}
```

### 资源优化

```javascript
// utils/imageOptimizer.js
class ImageOptimizer {
  constructor() {
    this.compressionQuality = 0.8
    this.maxWidth = 750
    this.maxHeight = 1334
  }

  // 压缩图片
  compressImage(src, options = {}) {
    return new Promise((resolve, reject) => {
      const {
        quality = this.compressionQuality,
        maxWidth = this.maxWidth,
        maxHeight = this.maxHeight
      } = options

      wx.compressImage({
        src: src,
        quality: quality * 100, // 微信API使用0-100
        success: (res) => {
          console.log('图片压缩成功', {
            original: src,
            compressed: res.tempFilePath
          })
          resolve(res.tempFilePath)
        },
        fail: (error) => {
          console.error('图片压缩失败', error)
          reject(error)
        }
      })
    })
  }

  // 获取图片信息
  getImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src: src,
        success: resolve,
        fail: reject
      })
    })
  }

  // 智能压缩（根据图片大小自动调整压缩参数）
  async smartCompress(src) {
    try {
      const imageInfo = await this.getImageInfo(src)
      const { width, height } = imageInfo
      
      // 根据图片尺寸调整压缩质量
      let quality = this.compressionQuality
      
      if (width > 1500 || height > 1500) {
        quality = 0.6 // 大图片使用更高压缩率
      } else if (width > 1000 || height > 1000) {
        quality = 0.7
      }
      
      return await this.compressImage(src, { quality })
    } catch (error) {
      console.error('智能压缩失败', error)
      return src // 压缩失败时返回原图
    }
  }

  // 批量压缩
  async batchCompress(srcList, options = {}) {
    const results = []
    
    for (const src of srcList) {
      try {
        const compressed = await this.compressImage(src, options)
        results.push({
          original: src,
          compressed: compressed,
          success: true
        })
      } catch (error) {
        results.push({
          original: src,
          compressed: src,
          success: false,
          error: error
        })
      }
    }
    
    return results
  }
}

module.exports = new ImageOptimizer()
```

### 预加载策略

```javascript
// utils/preloader.js
class Preloader {
  constructor() {
    this.preloadedData = new Map()
    this.preloadedImages = new Set()
    this.preloadQueue = []
    this.isPreloading = false
  }

  // 预加载数据
  async preloadData(key, dataLoader, options = {}) {
    const {
      cache = true,
      priority = 'normal',
      timeout = 5000
    } = options

    if (this.preloadedData.has(key)) {
      return this.preloadedData.get(key)
    }

    try {
      console.log('预加载数据', key)
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('预加载超时')), timeout)
      })
      
      const data = await Promise.race([
        dataLoader(),
        timeoutPromise
      ])
      
      if (cache) {
        this.preloadedData.set(key, data)
      }
      
      return data
    } catch (error) {
      console.error('预加载数据失败', key, error)
      return null
    }
  }

  // 预加载图片
  preloadImages(imageUrls) {
    return Promise.all(
      imageUrls.map(url => this.preloadImage(url))
    )
  }

  // 预加载单张图片
  preloadImage(url) {
    return new Promise((resolve) => {
      if (this.preloadedImages.has(url)) {
        resolve(true)
        return
      }

      wx.getImageInfo({
        src: url,
        success: () => {
          this.preloadedImages.add(url)
          console.log('图片预加载成功', url)
          resolve(true)
        },
        fail: (error) => {
          console.error('图片预加载失败', url, error)
          resolve(false)
        }
      })
    })
  }

  // 预加载页面数据
  async preloadPageData(pagePath, params = {}) {
    const cacheKey = `page_${pagePath}_${JSON.stringify(params)}`
    
    return this.preloadData(cacheKey, async () => {
      // 根据页面路径加载对应数据
      switch (pagePath) {
        case 'pages/home/home':
          return this.loadHomeData(params)
        case 'pages/profile/profile':
          return this.loadProfileData(params)
        case 'pages/article/article':
          return this.loadArticleData(params)
        default:
          return null
      }
    })
  }

  // 加载首页数据
  async loadHomeData(params) {
    const http = require('./http')
    
    const [banners, articles, categories] = await Promise.all([
      http.get('/banners'),
      http.get('/articles', { page: 1, limit: 10 }),
      http.get('/categories')
    ])
    
    return { banners, articles, categories }
  }

  // 加载个人资料数据
  async loadProfileData(params) {
    const http = require('./http')
    const { userId } = params
    
    const [userInfo, posts, followers] = await Promise.all([
      http.get(`/users/${userId}`),
      http.get(`/users/${userId}/posts`),
      http.get(`/users/${userId}/followers`)
    ])
    
    return { userInfo, posts, followers }
  }

  // 加载文章数据
  async loadArticleData(params) {
    const http = require('./http')
    const { articleId } = params
    
    const [article, comments, related] = await Promise.all([
      http.get(`/articles/${articleId}`),
      http.get(`/articles/${articleId}/comments`),
      http.get(`/articles/${articleId}/related`)
    ])
    
    return { article, comments, related }
  }

  // 获取预加载的数据
  getPreloadedData(key) {
    return this.preloadedData.get(key)
  }

  // 清理预加载数据
  clearPreloadedData(key = null) {
    if (key) {
      this.preloadedData.delete(key)
    } else {
      this.preloadedData.clear()
    }
  }

  // 预加载队列处理
  addToPreloadQueue(task) {
    this.preloadQueue.push(task)
    this.processPreloadQueue()
  }

  async processPreloadQueue() {
    if (this.isPreloading || this.preloadQueue.length === 0) {
      return
    }

    this.isPreloading = true

    while (this.preloadQueue.length > 0) {
      const task = this.preloadQueue.shift()
      
      try {
        await task()
      } catch (error) {
        console.error('预加载任务失败', error)
      }
    }

    this.isPreloading = false
  }
}

module.exports = new Preloader()
```

## 🎨 渲染性能优化

### 长列表优化

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
    },
    overscan: {
      type: Number,
      value: 5 // 预渲染的额外项目数
    }
  },

  data: {
    scrollTop: 0,
    visibleItems: [],
    startIndex: 0,
    endIndex: 0,
    totalHeight: 0,
    offsetY: 0
  },

  observers: {
    'items, itemHeight, containerHeight': function(items, itemHeight, containerHeight) {
      this.calculateVisibleItems()
    }
  },

  methods: {
    // 计算可见项目
    calculateVisibleItems() {
      const { items, itemHeight, containerHeight, overscan } = this.properties
      const { scrollTop } = this.data
      
      if (!items || items.length === 0) {
        this.setData({
          visibleItems: [],
          totalHeight: 0,
          offsetY: 0
        })
        return
      }

      const totalHeight = items.length * itemHeight
      const visibleCount = Math.ceil(containerHeight / itemHeight)
      
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
      const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2)
      
      const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
        ...item,
        _index: startIndex + index
      }))
      
      const offsetY = startIndex * itemHeight

      this.setData({
        visibleItems,
        startIndex,
        endIndex,
        totalHeight,
        offsetY
      })
    },

    // 滚动事件处理
    onScroll(e) {
      const scrollTop = e.detail.scrollTop
      
      // 节流处理
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer)
      }
      
      this.scrollTimer = setTimeout(() => {
        this.setData({ scrollTop }, () => {
          this.calculateVisibleItems()
        })
      }, 16) // 约60fps
    },

    // 项目点击事件
    onItemTap(e) {
      const { index } = e.currentTarget.dataset
      const item = this.data.visibleItems[index]
      
      this.triggerEvent('itemtap', {
        item: item,
        index: item._index
      })
    }
  }
})
```

```xml
<!-- components/virtual-list/virtual-list.wxml -->
<scroll-view 
  class="virtual-list"
  scroll-y="{{true}}"
  style="height: {{containerHeight}}px"
  bindscroll="onScroll"
  scroll-top="{{scrollTop}}"
>
  <view class="virtual-list-container" style="height: {{totalHeight}}px">
    <view class="virtual-list-content" style="transform: translateY({{offsetY}}px)">
      <view 
        wx:for="{{visibleItems}}" 
        wx:key="_index"
        class="virtual-list-item"
        style="height: {{itemHeight}}px"
        data-index="{{index}}"
        bindtap="onItemTap"
      >
        <slot name="item" item="{{item}}" index="{{item._index}}"></slot>
      </view>
    </view>
  </view>
</scroll-view>
```

### 图片懒加载

```javascript
// components/lazy-image/lazy-image.js
Component({
  properties: {
    src: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: '/images/placeholder.png'
    },
    threshold: {
      type: Number,
      value: 100 // 提前加载的距离
    },
    fadeIn: {
      type: Boolean,
      value: true
    }
  },

  data: {
    currentSrc: '',
    loaded: false,
    error: false,
    visible: false
  },

  lifetimes: {
    attached() {
      this.setData({
        currentSrc: this.properties.placeholder
      })
      this.createIntersectionObserver()
    },

    detached() {
      if (this.observer) {
        this.observer.disconnect()
      }
    }
  },

  methods: {
    // 创建交叉观察器
    createIntersectionObserver() {
      this.observer = this.createIntersectionObserver({
        rootMargin: `${this.properties.threshold}px`
      })

      this.observer.relativeToViewport().observe('.lazy-image', (res) => {
        if (res.intersectionRatio > 0 && !this.data.visible) {
          this.setData({ visible: true })
          this.loadImage()
        }
      })
    },

    // 加载图片
    loadImage() {
      const { src } = this.properties
      
      if (!src || this.data.loaded) {
        return
      }

      wx.getImageInfo({
        src: src,
        success: () => {
          this.setData({
            currentSrc: src,
            loaded: true,
            error: false
          })
          
          this.triggerEvent('load', { src })
        },
        fail: (error) => {
          console.error('图片加载失败', src, error)
          this.setData({
            error: true
          })
          
          this.triggerEvent('error', { src, error })
        }
      })
    },

    // 图片加载完成
    onImageLoad() {
      this.triggerEvent('imageload')
    },

    // 图片加载错误
    onImageError(e) {
      this.setData({
        error: true
      })
      this.triggerEvent('imageerror', e.detail)
    }
  }
})
```

### 动画性能优化

```javascript
// utils/animationOptimizer.js
class AnimationOptimizer {
  constructor() {
    this.activeAnimations = new Map()
    this.animationFrame = null
  }

  // 创建高性能动画
  createAnimation(options = {}) {
    const {
      duration = 300,
      timingFunction = 'ease',
      delay = 0,
      transformOrigin = '50% 50% 0'
    } = options

    const animation = wx.createAnimation({
      duration,
      timingFunction,
      delay,
      transformOrigin
    })

    return animation
  }

  // 批量动画处理
  batchAnimations(animations) {
    return new Promise((resolve) => {
      let completedCount = 0
      const totalCount = animations.length

      animations.forEach((animationConfig, index) => {
        const { target, animation, callback } = animationConfig
        
        // 执行动画
        this.executeAnimation(target, animation).then(() => {
          completedCount++
          
          if (callback) {
            callback()
          }
          
          if (completedCount === totalCount) {
            resolve()
          }
        })
      })
    })
  }

  // 执行单个动画
  executeAnimation(target, animation) {
    return new Promise((resolve) => {
      const animationId = this.generateAnimationId()
      
      this.activeAnimations.set(animationId, {
        target,
        animation,
        startTime: Date.now()
      })

      // 应用动画
      target.setData({
        animationData: animation.export()
      })

      // 动画完成后清理
      setTimeout(() => {
        this.activeAnimations.delete(animationId)
        resolve()
      }, animation.duration || 300)
    })
  }

  // 使用requestAnimationFrame优化动画
  animateWithRAF(callback, duration = 300) {
    const startTime = Date.now()
    
    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      callback(progress)
      
      if (progress < 1) {
        this.animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animate()
  }

  // 缓动函数
  easing: {
    linear: (t) => t,
    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => (--t) * t * t + 1,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },

  // 生成动画ID
  generateAnimationId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  },

  // 停止所有动画
  stopAllAnimations() {
    this.activeAnimations.clear()
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  },

  // 获取动画统计
  getAnimationStats() {
    return {
      activeCount: this.activeAnimations.size,
      animations: Array.from(this.activeAnimations.entries()).map(([id, config]) => ({
        id,
        duration: Date.now() - config.startTime
      }))
    }
  }
}

module.exports = new AnimationOptimizer()
```

## 💾 内存管理

### 内存监控

```javascript
// utils/memoryMonitor.js
class MemoryMonitor {
  constructor() {
    this.memoryWarningCallbacks = []
    this.monitoringInterval = null
    this.memoryStats = {
      warnings: 0,
      lastWarningTime: null,
      peakUsage: 0
    }
    
    this.initMemoryWarningListener()
  }

  // 初始化内存警告监听
  initMemoryWarningListener() {
    wx.onMemoryWarning((res) => {
      console.warn('内存警告', res.level)
      
      this.memoryStats.warnings++
      this.memoryStats.lastWarningTime = Date.now()
      
      // 触发内存清理
      this.handleMemoryWarning(res.level)
      
      // 通知回调函数
      this.memoryWarningCallbacks.forEach(callback => {
        try {
          callback(res)
        } catch (error) {
          console.error('内存警告回调执行失败', error)
        }
      })
    })
  }

  // 处理内存警告
  handleMemoryWarning(level) {
    switch (level) {
      case 5: // 严重警告
        this.performAggressiveCleanup()
        break
      case 10: // 中等警告
        this.performModerateCleanup()
        break
      case 15: // 轻微警告
        this.performLightCleanup()
        break
    }
  }

  // 激进清理
  performAggressiveCleanup() {
    console.log('执行激进内存清理')
    
    // 清理所有缓存
    const cacheManager = require('./cacheManager')
    cacheManager.clear()
    
    // 清理图片缓存
    this.clearImageCache()
    
    // 清理预加载数据
    const preloader = require('./preloader')
    preloader.clearPreloadedData()
    
    // 强制垃圾回收（如果支持）
    if (wx.triggerGC) {
      wx.triggerGC()
    }
    
    wx.showToast({
      title: '已清理内存',
      icon: 'success'
    })
  }

  // 中等清理
  performModerateCleanup() {
    console.log('执行中等内存清理')
    
    // 清理过期缓存
    const cacheManager = require('./cacheManager')
    cacheManager.cleanExpired()
    
    // 清理部分预加载数据
    const preloader = require('./preloader')
    preloader.clearPreloadedData()
  }

  // 轻微清理
  performLightCleanup() {
    console.log('执行轻微内存清理')
    
    // 只清理过期数据
    const storage = require('./storage')
    storage.cleanExpired()
  }

  // 清理图片缓存
  clearImageCache() {
    // 这里可以实现图片缓存清理逻辑
    console.log('清理图片缓存')
  }

  // 添加内存警告回调
  onMemoryWarning(callback) {
    this.memoryWarningCallbacks.push(callback)
  }

  // 移除内存警告回调
  offMemoryWarning(callback) {
    const index = this.memoryWarningCallbacks.indexOf(callback)
    if (index > -1) {
      this.memoryWarningCallbacks.splice(index, 1)
    }
  }

  // 开始内存监控
  startMonitoring(interval = 30000) {
    if (this.monitoringInterval) {
      return
    }

    this.monitoringInterval = setInterval(() => {
      this.checkMemoryUsage()
    }, interval)
    
    console.log('开始内存监控')
  }

  // 停止内存监控
  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
      this.monitoringInterval = null
      console.log('停止内存监控')
    }
  }

  // 检查内存使用情况
  checkMemoryUsage() {
    // 获取内存使用信息（如果API支持）
    if (wx.getMemoryInfo) {
      wx.getMemoryInfo({
        success: (res) => {
          console.log('内存使用情况', res)
          
          if (res.used > this.memoryStats.peakUsage) {
            this.memoryStats.peakUsage = res.used
          }
          
          // 如果内存使用率过高，主动清理
          const usageRate = res.used / res.total
          if (usageRate > 0.8) {
            this.performLightCleanup()
          }
        }
      })
    }
  }

  // 获取内存统计
  getMemoryStats() {
    return {
      ...this.memoryStats,
      isMonitoring: !!this.monitoringInterval
    }
  }

  // 重置统计
  resetStats() {
    this.memoryStats = {
      warnings: 0,
      lastWarningTime: null,
      peakUsage: 0
    }
  }
}

module.exports = new MemoryMonitor()
```

### 对象池管理

```javascript
// utils/objectPool.js
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.pool = []
    this.inUse = new Set()
    
    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn())
    }
  }

  // 获取对象
  acquire() {
    let obj
    
    if (this.pool.length > 0) {
      obj = this.pool.pop()
    } else {
      obj = this.createFn()
    }
    
    this.inUse.add(obj)
    return obj
  }

  // 释放对象
  release(obj) {
    if (this.inUse.has(obj)) {
      this.inUse.delete(obj)
      
      // 重置对象状态
      if (this.resetFn) {
        this.resetFn(obj)
      }
      
      this.pool.push(obj)
    }
  }

  // 批量释放
  releaseAll() {
    this.inUse.forEach(obj => {
      if (this.resetFn) {
        this.resetFn(obj)
      }
      this.pool.push(obj)
    })
    
    this.inUse.clear()
  }

  // 清空池
  clear() {
    this.pool = []
    this.inUse.clear()
  }

  // 获取统计信息
  getStats() {
    return {
      poolSize: this.pool.length,
      inUseCount: this.inUse.size,
      totalCreated: this.pool.length + this.inUse.size
    }
  }
}

// 使用示例
const animationPool = new ObjectPool(
  // 创建函数
  () => wx.createAnimation({
    duration: 300,
    timingFunction: 'ease'
  }),
  // 重置函数
  (animation) => {
    // 重置动画状态
    animation.opacity(1).scale(1).rotate(0).translate(0, 0)
  },
  5 // 初始大小
)

module.exports = { ObjectPool, animationPool }
```

## 📊 性能监控

### 性能指标收集

```javascript
// utils/performanceMonitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: new Map(),
      apiRequest: new Map(),
      rendering: new Map(),
      memory: []
    }
    
    this.startTime = Date.now()
    this.initPerformanceObserver()
  }

  // 初始化性能观察器
  initPerformanceObserver() {
    // 监听页面性能
    const originalPage = Page
    Page = (options) => {
      const originalOnLoad = options.onLoad
      const originalOnShow = options.onShow
      const originalOnReady = options.onReady
      
      options.onLoad = function(query) {
        const startTime = Date.now()
        this._loadStartTime = startTime
        
        if (originalOnLoad) {
          originalOnLoad.call(this, query)
        }
      }
      
      options.onReady = function() {
        const endTime = Date.now()
        const loadTime = endTime - (this._loadStartTime || endTime)
        
        // 记录页面加载时间
        performanceMonitor.recordPageLoad(this.route, loadTime)
        
        if (originalOnReady) {
          originalOnReady.call(this)
        }
      }
      
      options.onShow = function() {
        this._showStartTime = Date.now()
        
        if (originalOnShow) {
          originalOnShow.call(this)
        }
      }
      
      return originalPage(options)
    }
  }

  // 记录页面加载时间
  recordPageLoad(route, loadTime) {
    if (!this.metrics.pageLoad.has(route)) {
      this.metrics.pageLoad.set(route, [])
    }
    
    this.metrics.pageLoad.get(route).push({
      loadTime,
      timestamp: Date.now()
    })
    
    console.log(`页面加载时间 ${route}: ${loadTime}ms`)
  }

  // 记录API请求时间
  recordApiRequest(url, responseTime, success = true) {
    if (!this.metrics.apiRequest.has(url)) {
      this.metrics.apiRequest.set(url, [])
    }
    
    this.metrics.apiRequest.get(url).push({
      responseTime,
      success,
      timestamp: Date.now()
    })
    
    console.log(`API请求时间 ${url}: ${responseTime}ms`)
  }

  // 记录渲染时间
  recordRenderTime(component, renderTime) {
    if (!this.metrics.rendering.has(component)) {
      this.metrics.rendering.set(component, [])
    }
    
    this.metrics.rendering.get(component).push({
      renderTime,
      timestamp: Date.now()
    })
    
    console.log(`渲染时间 ${component}: ${renderTime}ms`)
  }

  // 记录内存使用
  recordMemoryUsage(usage) {
    this.metrics.memory.push({
      usage,
      timestamp: Date.now()
    })
    
    // 只保留最近100条记录
    if (this.metrics.memory.length > 100) {
      this.metrics.memory.shift()
    }
  }

  // 获取性能报告
  getPerformanceReport() {
    const report = {
      summary: this.getSummary(),
      pageLoad: this.getPageLoadStats(),
      apiRequest: this.getApiRequestStats(),
      rendering: this.getRenderingStats(),
      memory: this.getMemoryStats(),
      generatedAt: new Date().toISOString()
    }
    
    return report
  }

  // 获取性能摘要
  getSummary() {
    const totalPages = this.metrics.pageLoad.size
    const totalApiRequests = Array.from(this.metrics.apiRequest.values())
      .reduce((sum, requests) => sum + requests.length, 0)
    
    return {
      uptime: Date.now() - this.startTime,
      totalPages,
      totalApiRequests,
      memoryRecords: this.metrics.memory.length
    }
  }

  // 获取页面加载统计
  getPageLoadStats() {
    const stats = {}
    
    this.metrics.pageLoad.forEach((records, route) => {
      const loadTimes = records.map(r => r.loadTime)
      stats[route] = {
        count: records.length,
        average: this.calculateAverage(loadTimes),
        min: Math.min(...loadTimes),
        max: Math.max(...loadTimes),
        recent: records.slice(-5) // 最近5次
      }
    })
    
    return stats
  }

  // 获取API请求统计
  getApiRequestStats() {
    const stats = {}
    
    this.metrics.apiRequest.forEach((records, url) => {
      const responseTimes = records.map(r => r.responseTime)
      const successCount = records.filter(r => r.success).length
      
      stats[url] = {
        count: records.length,
        successRate: (successCount / records.length * 100).toFixed(2) + '%',
        average: this.calculateAverage(responseTimes),
        min: Math.min(...responseTimes),
        max: Math.max(...responseTimes)
      }
    })
    
    return stats
  }

  // 获取渲染统计
  getRenderingStats() {
    const stats = {}
    
    this.metrics.rendering.forEach((records, component) => {
      const renderTimes = records.map(r => r.renderTime)
      stats[component] = {
        count: records.length,
        average: this.calculateAverage(renderTimes),
        min: Math.min(...renderTimes),
        max: Math.max(...renderTimes)
      }
    })
    
    return stats
  }

  // 获取内存统计
  getMemoryStats() {
    if (this.metrics.memory.length === 0) {
      return null
    }
    
    const usages = this.metrics.memory.map(m => m.usage)
    return {
      current: usages[usages.length - 1],
      average: this.calculateAverage(usages),
      peak: Math.max(...usages),
      trend: this.calculateTrend(usages)
    }
  }

  // 计算平均值
  calculateAverage(numbers) {
    if (numbers.length === 0) return 0
    return Math.round(numbers.reduce((sum, num) => sum + num, 0) / numbers.length)
  }

  // 计算趋势
  calculateTrend(numbers) {
    if (numbers.length < 2) return 'stable'
    
    const recent = numbers.slice(-10) // 最近10个数据点
    const first = recent[0]
    const last = recent[recent.length - 1]
    
    const change = (last - first) / first
    
    if (change > 0.1) return 'increasing'
    if (change < -0.1) return 'decreasing'
    return 'stable'
  }

  // 清理旧数据
  cleanup() {
    const cutoffTime = Date.now() - 24 * 60 * 60 * 1000 // 24小时前
    
    // 清理页面加载数据
    this.metrics.pageLoad.forEach((records, route) => {
      const filtered = records.filter(r => r.timestamp > cutoffTime)
      if (filtered.length === 0) {
        this.metrics.pageLoad.delete(route)
      } else {
        this.metrics.pageLoad.set(route, filtered)
      }
    })
    
    // 清理API请求数据
    this.metrics.apiRequest.forEach((records, url) => {
      const filtered = records.filter(r => r.timestamp > cutoffTime)
      if (filtered.length === 0) {
        this.metrics.apiRequest.delete(url)
      } else {
        this.metrics.apiRequest.set(url, filtered)
      }
    })
    
    // 清理渲染数据
    this.metrics.rendering.forEach((records, component) => {
      const filtered = records.filter(r => r.timestamp > cutoffTime)
      if (filtered.length === 0) {
        this.metrics.rendering.delete(component)
      } else {
        this.metrics.rendering.set(component, filtered)
      }
    })
    
    // 清理内存数据
    this.metrics.memory = this.metrics.memory.filter(m => m.timestamp > cutoffTime)
  }
}

const performanceMonitor = new PerformanceMonitor()
module.exports = performanceMonitor
```

### 性能测试工具

```javascript
// utils/performanceTester.js
class PerformanceTester {
  constructor() {
    this.testResults = new Map()
  }

  // 测试函数执行时间
  async testFunction(name, fn, iterations = 1) {
    const results = []
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now()
      
      try {
        await fn()
        const endTime = Date.now()
        results.push(endTime - startTime)
      } catch (error) {
        console.error(`测试函数 ${name} 执行失败`, error)
        results.push(-1) // 表示失败
      }
    }
    
    const validResults = results.filter(r => r >= 0)
    const testResult = {
      name,
      iterations,
      results: validResults,
      average: validResults.length > 0 ? 
        validResults.reduce((sum, r) => sum + r, 0) / validResults.length : 0,
      min: validResults.length > 0 ? Math.min(...validResults) : 0,
      max: validResults.length > 0 ? Math.max(...validResults) : 0,
      successRate: (validResults.length / iterations * 100).toFixed(2) + '%'
    }
    
    this.testResults.set(name, testResult)
    console.log(`性能测试结果 ${name}:`, testResult)
    
    return testResult
  }

  // 测试页面渲染性能
  async testPageRender(pagePath, data = {}) {
    return this.testFunction(`page_render_${pagePath}`, async () => {
      // 模拟页面渲染
      const startTime = Date.now()
      
      // 这里可以添加具体的页面渲染测试逻辑
      await new Promise(resolve => setTimeout(resolve, 10))
      
      return Date.now() - startTime
    }, 10)
  }

  // 测试API请求性能
  async testApiRequest(url, options = {}) {
    const http = require('./http')
    
    return this.testFunction(`api_${url}`, async () => {
      await http.get(url, options.params, options)
    }, options.iterations || 5)
  }

  // 测试数据处理性能
  async testDataProcessing(name, data, processor) {
    return this.testFunction(`data_processing_${name}`, async () => {
      return processor(data)
    }, 10)
  }

  // 批量性能测试
  async runBatchTests(tests) {
    const results = []
    
    for (const test of tests) {
      try {
        const result = await this.testFunction(
          test.name,
          test.fn,
          test.iterations || 1
        )
        results.push(result)
      } catch (error) {
        console.error(`批量测试失败 ${test.name}`, error)
        results.push({
          name: test.name,
          error: error.message
        })
      }
    }
    
    return results
  }

  // 生成性能测试报告
  generateReport() {
    const report = {
      testCount: this.testResults.size,
      tests: Array.from(this.testResults.values()),
      summary: this.generateSummary(),
      generatedAt: new Date().toISOString()
    }
    
    return report
  }

  // 生成测试摘要
  generateSummary() {
    const tests = Array.from(this.testResults.values())
    
    if (tests.length === 0) {
      return { message: '暂无测试数据' }
    }
    
    const averages = tests.map(t => t.average).filter(a => a > 0)
    
    return {
      totalTests: tests.length,
      averageTime: averages.length > 0 ? 
        (averages.reduce((sum, a) => sum + a, 0) / averages.length).toFixed(2) : 0,
      fastestTest: tests.reduce((fastest, test) => 
        test.average > 0 && (fastest.average === 0 || test.average < fastest.average) ? test : fastest
      ),
      slowestTest: tests.reduce((slowest, test) => 
        test.average > slowest.average ? test : slowest
      )
    }
  }

  // 清理测试结果
  clearResults() {
    this.testResults.clear()
  }
}

module.exports = new PerformanceTester()
```

## 🔧 性能优化工具

### 代码分析工具

```javascript
// utils/codeAnalyzer.js
class CodeAnalyzer {
  constructor() {
    this.analysisResults = {
      unusedFiles: [],
      largeFunctions: [],
      duplicateCode: [],
      performanceIssues: []
    }
  }

  // 分析代码性能问题
  analyzePerformanceIssues(code, filePath) {
    const issues = []
    
    // 检查同步存储使用
    if (code.includes('getStorageSync') || code.includes('setStorageSync')) {
      issues.push({
        type: 'sync_storage',
        message: '使用同步存储可能阻塞主线程',
        file: filePath,
        suggestion: '考虑使用异步存储API'
      })
    }
    
    // 检查大量DOM操作
    const setDataMatches = code.match(/setData\s*\(/g)
    if (setDataMatches && setDataMatches.length > 10) {
      issues.push({
        type: 'frequent_setdata',
        message: '频繁调用setData可能影响性能',
        file: filePath,
        count: setDataMatches.length,
        suggestion: '合并setData调用或使用批量更新'
      })
    }
    
    // 检查未优化的循环
    if (code.includes('for') && code.includes('setData')) {
      issues.push({
        type: 'loop_setdata',
        message: '循环中调用setData会严重影响性能',
        file: filePath,
        suggestion: '将数据收集后一次性setData'
      })
    }
    
    // 检查内存泄漏风险
    if (code.includes('setInterval') && !code.includes('clearInterval')) {
      issues.push({
        type: 'memory_leak',
        message: '可能存在定时器内存泄漏',
        file: filePath,
        suggestion: '确保在页面卸载时清理定时器'
      })
    }
    
    this.analysisResults.performanceIssues.push(...issues)
    return issues
  }

  // 分析函数复杂度
  analyzeFunctionComplexity(code, filePath) {
    const functions = []
    const functionRegex = /function\s+(\w+)\s*\([^)]*\)\s*{([^}]*)}/g
    let match
    
    while ((match = functionRegex.exec(code)) !== null) {
      const [, name, body] = match
      const complexity = this.calculateComplexity(body)
      
      if (complexity > 10) {
        functions.push({
          name,
          complexity,
          file: filePath,
          suggestion: '函数过于复杂，建议拆分'
        })
      }
    }
    
    this.analysisResults.largeFunctions.push(...functions)
    return functions
  }

  // 计算圈复杂度
  calculateComplexity(code) {
    let complexity = 1 // 基础复杂度
    
    // 条件语句
    complexity += (code.match(/if\s*\(/g) || []).length
    complexity += (code.match(/else\s+if/g) || []).length
    complexity += (code.match(/switch\s*\(/g) || []).length
    complexity += (code.match(/case\s+/g) || []).length
    
    // 循环语句
    complexity += (code.match(/for\s*\(/g) || []).length
    complexity += (code.match(/while\s*\(/g) || []).length
    complexity += (code.match(/do\s*{/g) || []).length
    
    // 逻辑操作符
    complexity += (code.match(/&&/g) || []).length
    complexity += (code.match(/\|\|/g) || []).length
    
    return complexity
  }

  // 检测重复代码
  detectDuplicateCode(files) {
    const codeBlocks = new Map()
    const duplicates = []
    
    files.forEach(({ content, path }) => {
      // 简单的重复代码检测（基于行）
      const lines = content.split('\n')
      
      for (let i = 0; i < lines.length - 5; i++) {
        const block = lines.slice(i, i + 5).join('\n').trim()
        
        if (block.length > 50) { // 忽略太短的代码块
          if (codeBlocks.has(block)) {
            duplicates.push({
              block,
              files: [codeBlocks.get(block), path],
              lines: [codeBlocks.get(block).startLine, i + 1]
            })
          } else {
            codeBlocks.set(block, { path, startLine: i + 1 })
          }
        }
      }
    })
    
    this.analysisResults.duplicateCode = duplicates
    return duplicates
  }

  // 生成分析报告
  generateAnalysisReport() {
    return {
      summary: {
        performanceIssues: this.analysisResults.performanceIssues.length,
        largeFunctions: this.analysisResults.largeFunctions.length,
        duplicateCode: this.analysisResults.duplicateCode.length
      },
      details: this.analysisResults,
      recommendations: this.generateRecommendations(),
      generatedAt: new Date().toISOString()
    }
  }

  // 生成优化建议
  generateRecommendations() {
    const recommendations = []
    
    if (this.analysisResults.performanceIssues.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        title: '修复性能问题',
        description: `发现 ${this.analysisResults.performanceIssues.length} 个性能问题，建议优先处理`
      })
    }
    
    if (this.analysisResults.largeFunctions.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'maintainability',
        title: '重构复杂函数',
        description: `发现 ${this.analysisResults.largeFunctions.length} 个复杂函数，建议拆分`
      })
    }
    
    if (this.analysisResults.duplicateCode.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'maintainability',
        title: '消除重复代码',
        description: `发现 ${this.analysisResults.duplicateCode.length} 处重复代码，建议提取公共函数`
      })
    }
    
    return recommendations
  }

  // 清理分析结果
  clearResults() {
    this.analysisResults = {
      unusedFiles: [],
      largeFunctions: [],
      duplicateCode: [],
      performanceIssues: []
    }
  }
}

module.exports = new CodeAnalyzer()
```

## 📈 性能优化最佳实践

### 通用优化策略

```javascript
// utils/optimizationStrategies.js
class OptimizationStrategies {
  constructor() {
    this.strategies = new Map()
    this.initStrategies()
  }

  // 初始化优化策略
  initStrategies() {
    // 数据更新优化
    this.strategies.set('data_update', {
      name: '数据更新优化',
      description: '优化setData调用，减少不必要的渲染',
      implement: this.optimizeDataUpdate.bind(this)
    })

    // 图片加载优化
    this.strategies.set('image_loading', {
      name: '图片加载优化',
      description: '实现图片懒加载和压缩',
      implement: this.optimizeImageLoading.bind(this)
    })

    // 网络请求优化
    this.strategies.set('network_request', {
      name: '网络请求优化',
      description: '实现请求缓存和批量处理',
      implement: this.optimizeNetworkRequest.bind(this)
    })

    // 内存管理优化
    this.strategies.set('memory_management', {
      name: '内存管理优化',
      description: '实现内存监控和自动清理',
      implement: this.optimizeMemoryManagement.bind(this)
    })
  }

  // 数据更新优化实现
  optimizeDataUpdate(page) {
    const originalSetData = page.setData
    let pendingData = {}
    let updateTimer = null

    page.setData = function(data, callback) {
      // 合并待更新的数据
      Object.assign(pendingData, data)

      // 清除之前的定时器
      if (updateTimer) {
        clearTimeout(updateTimer)
      }

      // 延迟更新，合并多次setData调用
      updateTimer = setTimeout(() => {
        originalSetData.call(this, pendingData, callback)
        pendingData = {}
        updateTimer = null
      }, 16) // 约60fps
    }

    console.log('已应用数据更新优化')
  }

  // 图片加载优化实现
  optimizeImageLoading(options = {}) {
    const {
      lazyLoad = true,
      compression = true,
      placeholder = '/images/placeholder.png'
    } = options

    // 创建图片加载管理器
    const imageManager = {
      loadedImages: new Set(),
      loadingImages: new Map(),

      loadImage(src, callback) {
        if (this.loadedImages.has(src)) {
          callback(null, src)
          return
        }

        if (this.loadingImages.has(src)) {
          this.loadingImages.get(src).push(callback)
          return
        }

        this.loadingImages.set(src, [callback])

        wx.getImageInfo({
          src: src,
          success: (res) => {
            this.loadedImages.add(src)
            const callbacks = this.loadingImages.get(src) || []
            callbacks.forEach(cb => cb(null, res.path))
            this.loadingImages.delete(src)
          },
          fail: (error) => {
            const callbacks = this.loadingImages.get(src) || []
            callbacks.forEach(cb => cb(error))
            this.loadingImages.delete(src)
          }
        })
      }
    }

    console.log('已应用图片加载优化')
    return imageManager
  }

  // 网络请求优化实现
  optimizeNetworkRequest(options = {}) {
    const {
      cacheEnabled = true,
      batchEnabled = true,
      retryEnabled = true
    } = options

    const requestManager = {
      cache: new Map(),
      batchQueue: [],
      batchTimer: null,

      request(config) {
        // 缓存检查
        if (cacheEnabled && config.method === 'GET') {
          const cacheKey = this.getCacheKey(config)
          const cached = this.cache.get(cacheKey)
          
          if (cached && Date.now() - cached.timestamp < 300000) { // 5分钟缓存
            return Promise.resolve(cached.data)
          }
        }

        // 批量处理
        if (batchEnabled && config.batch) {
          return this.addToBatch(config)
        }

        // 执行请求
        return this.executeRequest(config)
      },

      getCacheKey(config) {
        return `${config.method}:${config.url}:${JSON.stringify(config.data || {})}`
      },

      executeRequest(config) {
        return new Promise((resolve, reject) => {
          wx.request({
            ...config,
            success: (res) => {
              // 缓存响应
              if (cacheEnabled && config.method === 'GET') {
                const cacheKey = this.getCacheKey(config)
                this.cache.set(cacheKey, {
                  data: res.data,
                  timestamp: Date.now()
                })
              }
              
              resolve(res.data)
            },
            fail: reject
          })
        })
      },

      addToBatch(config) {
        return new Promise((resolve, reject) => {
          this.batchQueue.push({ config, resolve, reject })

          if (this.batchTimer) {
            clearTimeout(this.batchTimer)
          }

          this.batchTimer = setTimeout(() => {
            this.processBatch()
          }, 100) // 100ms内的请求合并处理
        })
      },

      processBatch() {
        const batch = this.batchQueue.splice(0)
        
        // 这里可以实现具体的批量请求逻辑
        batch.forEach(({ config, resolve, reject }) => {
          this.executeRequest(config).then(resolve).catch(reject)
        })
      }
    }

    console.log('已应用网络请求优化')
    return requestManager
  }

  // 内存管理优化实现
  optimizeMemoryManagement(options = {}) {
    const {
      autoCleanup = true,
      warningThreshold = 0.8,
      cleanupInterval = 60000 // 1分钟
    } = options

    const memoryManager = {
      cleanupTimer: null,
      caches: [],

      init() {
        if (autoCleanup) {
          this.startAutoCleanup()
        }

        // 监听内存警告
        wx.onMemoryWarning((res) => {
          console.warn('内存警告，开始清理', res.level)
          this.performCleanup(res.level)
        })
      },

      startAutoCleanup() {
        this.cleanupTimer = setInterval(() => {
          this.performRoutineCleanup()
        }, cleanupInterval)
      },

      stopAutoCleanup() {
        if (this.cleanupTimer) {
          clearInterval(this.cleanupTimer)
          this.cleanupTimer = null
        }
      },

      registerCache(cache) {
        this.caches.push(cache)
      },

      performCleanup(level = 10) {
        // 根据警告级别执行不同程度的清理
        this.caches.forEach(cache => {
          if (cache.clear) {
            cache.clear()
          }
        })

        // 触发垃圾回收
        if (wx.triggerGC) {
          wx.triggerGC()
        }
      },

      performRoutineCleanup() {
        // 定期清理过期数据
        this.caches.forEach(cache => {
          if (cache.cleanExpired) {
            cache.cleanExpired()
          }
        })
      }
    }

    memoryManager.init()
    console.log('已应用内存管理优化')
    return memoryManager
  }

  // 应用优化策略
  applyStrategy(strategyName, target, options = {}) {
    const strategy = this.strategies.get(strategyName)
    
    if (!strategy) {
      console.error(`未找到优化策略: ${strategyName}`)
      return false
    }

    try {
      const result = strategy.implement(target, options)
      console.log(`已应用优化策略: ${strategy.name}`)
      return result
    } catch (error) {
      console.error(`应用优化策略失败: ${strategy.name}`, error)
      return false
    }
  }

  // 批量应用优化策略
  applyMultipleStrategies(strategies, target, options = {}) {
    const results = {}
    
    strategies.forEach(strategyName => {
      results[strategyName] = this.applyStrategy(strategyName, target, options)
    })
    
    return results
  }

  // 获取所有可用策略
  getAvailableStrategies() {
    return Array.from(this.strategies.entries()).map(([key, strategy]) => ({
      key,
      name: strategy.name,
      description: strategy.description
    }))
  }
}

module.exports = new OptimizationStrategies()
```

## 📚 相关文档

- [数据存储](./data-storage.md)
- [网络请求](./network-request.md)
- [API调用](./api-usage.md)
- [项目结构](./project-structure.md)

---

通过系统的性能优化，打造流畅高效的小程序用户体验！🚀
