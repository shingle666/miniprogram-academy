# Performance Optimization

Performance optimization is crucial for creating smooth and responsive mini programs. This guide covers key optimization strategies, techniques, and best practices.

## Startup Performance

### App Launch Optimization

```javascript
// app.js - Optimize app startup
App({
  onLaunch(options) {
    // Minimize work in onLaunch
    this.initEssentials()
    
    // Defer non-critical initialization
    setTimeout(() => {
      this.initNonCritical()
    }, 100)
  },
  
  initEssentials() {
    // Only essential initialization
    this.globalData = {
      userInfo: null,
      systemInfo: wx.getSystemInfoSync()
    }
    
    // Check login status
    this.checkLoginStatus()
  },
  
  initNonCritical() {
    // Non-critical initialization
    this.initAnalytics()
    this.preloadResources()
    this.setupGlobalListeners()
  },
  
  checkLoginStatus() {
    const token = wx.getStorageSync('token')
    if (token) {
      // Validate token in background
      this.validateToken(token)
    }
  },
  
  async validateToken(token) {
    try {
      // Validate token without blocking UI
      const isValid = await this.api.validateToken(token)
      if (!isValid) {
        wx.removeStorageSync('token')
      }
    } catch (error) {
      console.error('Token validation failed:', error)
    }
  },
  
  preloadResources() {
    // Preload critical images
    const criticalImages = [
      '/images/logo.png',
      '/images/default-avatar.png'
    ]
    
    criticalImages.forEach(src => {
      wx.getImageInfo({ src })
    })
  }
})
```

### Page Load Optimization

```javascript
// Optimize page loading
Page({
  data: {
    loading: true,
    items: [],
    hasMore: true
  },
  
  onLoad(options) {
    // Start loading immediately
    this.loadInitialData()
    
    // Set up page optimizations
    this.setupOptimizations()
  },
  
  async loadInitialData() {
    try {
      // Load critical data first
      const criticalData = await this.loadCriticalData()
      
      this.setData({
        ...criticalData,
        loading: false
      })
      
      // Load non-critical data after render
      setTimeout(() => {
        this.loadNonCriticalData()
      }, 50)
      
    } catch (error) {
      console.error('Failed to load initial data:', error)
      this.setData({ loading: false })
    }
  },
  
  async loadCriticalData() {
    // Load only essential data for first render
    const [basicInfo, firstPageItems] = await Promise.all([
      this.api.getBasicInfo(),
      this.api.getItems({ page: 1, limit: 10 })
    ])
    
    return {
      basicInfo,
      items: firstPageItems
    }
  },
  
  async loadNonCriticalData() {
    // Load additional data that's not immediately visible
    try {
      const [userPreferences, recommendations] = await Promise.all([
        this.api.getUserPreferences(),
        this.api.getRecommendations()
      ])
      
      this.setData({
        userPreferences,
        recommendations
      })
    } catch (error) {
      console.error('Failed to load non-critical data:', error)
    }
  },
  
  setupOptimizations() {
    // Enable pull-to-refresh
    wx.enablePullDownRefresh()
    
    // Set up intersection observer for lazy loading
    this.setupLazyLoading()
  }
})
```

## Rendering Performance

### Efficient Data Updates

```javascript
// Optimize setData usage
Page({
  data: {
    users: [],
    selectedIds: [],
    filters: {
      status: 'active',
      category: 'all'
    }
  },
  
  // ❌ Bad: Multiple setData calls
  updateUsersBad(newUsers) {
    this.setData({ users: newUsers })
    this.setData({ loading: false })
    this.setData({ lastUpdated: Date.now() })
  },
  
  // ✅ Good: Single setData call
  updateUsersGood(newUsers) {
    this.setData({
      users: newUsers,
      loading: false,
      lastUpdated: Date.now()
    })
  },
  
  // ✅ Good: Partial updates for large datasets
  updateSingleUser(userId, userData) {
    const userIndex = this.data.users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      this.setData({
        [`users[${userIndex}]`]: { ...this.data.users[userIndex], ...userData }
      })
    }
  },
  
  // ✅ Good: Batch updates
  batchUpdateUsers(updates) {
    const setDataObject = {}
    
    updates.forEach(({ userId, data }) => {
      const userIndex = this.data.users.findIndex(u => u.id === userId)
      if (userIndex !== -1) {
        Object.keys(data).forEach(key => {
          setDataObject[`users[${userIndex}].${key}`] = data[key]
        })
      }
    })
    
    this.setData(setDataObject)
  },
  
  // ✅ Good: Optimize filter updates
  updateFilter(key, value) {
    this.setData({
      [`filters.${key}`]: value
    })
    
    // Debounce filter application
    this.debouncedApplyFilters()
  },
  
  onLoad() {
    // Create debounced function
    this.debouncedApplyFilters = this.debounce(this.applyFilters, 300)
  },
  
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func.apply(this, args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
})
```

### Virtual List Implementation

```javascript
// Virtual list for large datasets
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
    visibleCount: {
      type: Number,
      value: 10
    }
  },
  
  data: {
    scrollTop: 0,
    visibleItems: [],
    startIndex: 0,
    endIndex: 0,
    totalHeight: 0
  },
  
  observers: {
    'items, itemHeight, visibleCount': function(items, itemHeight, visibleCount) {
      this.updateVirtualList()
    }
  },
  
  methods: {
    updateVirtualList() {
      const { items, itemHeight, visibleCount } = this.properties
      const { scrollTop } = this.data
      
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(startIndex + visibleCount + 2, items.length)
      
      const visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        _index: startIndex + index,
        _top: (startIndex + index) * itemHeight
      }))
      
      this.setData({
        visibleItems,
        startIndex,
        endIndex,
        totalHeight: items.length * itemHeight
      })
    },
    
    onScroll(e) {
      const scrollTop = e.detail.scrollTop
      
      this.setData({ scrollTop })
      
      // Throttle virtual list updates
      if (!this.scrollTimer) {
        this.scrollTimer = setTimeout(() => {
          this.updateVirtualList()
          this.scrollTimer = null
        }, 16) // ~60fps
      }
    }
  }
})
```

```html
<!-- Virtual list template -->
<scroll-view 
  class="virtual-list"
  scroll-y
  scroll-top="{{scrollTop}}"
  bindscroll="onScroll"
  style="height: 500px;"
>
  <view class="virtual-container" style="height: {{totalHeight}}px;">
    <view 
      wx:for="{{visibleItems}}" 
      wx:key="_index"
      class="virtual-item"
      style="position: absolute; top: {{item._top}}px; height: {{itemHeight}}px;"
    >
      <!-- Item content -->
      <text>{{item.name}}</text>
    </view>
  </view>
</scroll-view>
```

## Image Optimization

### Lazy Loading Images

```javascript
// Image lazy loading component
Component({
  properties: {
    src: String,
    placeholder: {
      type: String,
      value: '/images/placeholder.png'
    },
    threshold: {
      type: Number,
      value: 100
    }
  },
  
  data: {
    loaded: false,
    currentSrc: ''
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
    createIntersectionObserver() {
      this.observer = this.createIntersectionObserver({
        rootMargin: `${this.properties.threshold}px`
      })
      
      this.observer.relativeToViewport().observe('.lazy-image', (res) => {
        if (res.intersectionRatio > 0 && !this.data.loaded) {
          this.loadImage()
        }
      })
    },
    
    loadImage() {
      const { src } = this.properties
      
      if (!src) return
      
      wx.getImageInfo({
        src,
        success: () => {
          this.setData({
            currentSrc: src,
            loaded: true
          })
          
          // Disconnect observer after loading
          if (this.observer) {
            this.observer.disconnect()
          }
        },
        fail: (error) => {
          console.error('Failed to load image:', error)
        }
      })
    },
    
    onImageLoad() {
      this.triggerEvent('load')
    },
    
    onImageError() {
      this.triggerEvent('error')
    }
  }
})
```

```html
<!-- Lazy image template -->
<image 
  class="lazy-image"
  src="{{currentSrc}}"
  mode="aspectFill"
  lazy-load
  bindload="onImageLoad"
  binderror="onImageError"
/>
```

### Image Compression and Caching

```javascript
// Image optimization utility
class ImageOptimizer {
  constructor() {
    this.cache = new Map()
    this.maxCacheSize = 50
  }
  
  async optimizeImage(src, options = {}) {
    const {
      quality = 80,
      width,
      height,
      format = 'jpg'
    } = options
    
    const cacheKey = `${src}_${quality}_${width}_${height}_${format}`
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    try {
      // Get image info
      const imageInfo = await this.getImageInfo(src)
      
      // Calculate optimal dimensions
      const optimizedDimensions = this.calculateOptimalDimensions(
        imageInfo.width,
        imageInfo.height,
        width,
        height
      )
      
      // Compress if needed
      let optimizedSrc = src
      if (this.shouldCompress(imageInfo, optimizedDimensions, quality)) {
        optimizedSrc = await this.compressImage(src, {
          ...optimizedDimensions,
          quality,
          format
        })
      }
      
      // Cache result
      this.addToCache(cacheKey, optimizedSrc)
      
      return optimizedSrc
      
    } catch (error) {
      console.error('Image optimization failed:', error)
      return src // Return original on error
    }
  }
  
  getImageInfo(src) {
    return new Promise((resolve, reject) => {
      wx.getImageInfo({
        src,
        success: resolve,
        fail: reject
      })
    })
  }
  
  calculateOptimalDimensions(originalWidth, originalHeight, targetWidth, targetHeight) {
    if (!targetWidth && !targetHeight) {
      return { width: originalWidth, height: originalHeight }
    }
    
    const aspectRatio = originalWidth / originalHeight
    
    if (targetWidth && !targetHeight) {
      return {
        width: targetWidth,
        height: Math.round(targetWidth / aspectRatio)
      }
    }
    
    if (!targetWidth && targetHeight) {
      return {
        width: Math.round(targetHeight * aspectRatio),
        height: targetHeight
      }
    }
    
    return { width: targetWidth, height: targetHeight }
  }
  
  shouldCompress(imageInfo, targetDimensions, quality) {
    const { width: originalWidth, height: originalHeight } = imageInfo
    const { width: targetWidth, height: targetHeight } = targetDimensions
    
    // Compress if dimensions are significantly different or quality is low
    return (
      originalWidth > targetWidth * 1.5 ||
      originalHeight > targetHeight * 1.5 ||
      quality < 90
    )
  }
  
  async compressImage(src, options) {
    return new Promise((resolve, reject) => {
      const canvas = wx.createCanvasContext('imageCanvas')
      
      // This is a simplified example
      // In practice, you might use a third-party service or native compression
      wx.compressImage({
        src,
        quality: options.quality,
        success: (res) => resolve(res.tempFilePath),
        fail: reject
      })
    })
  }
  
  addToCache(key, value) {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, value)
  }
  
  clearCache() {
    this.cache.clear()
  }
}

const imageOptimizer = new ImageOptimizer()

// Usage
Page({
  async loadOptimizedImage(src) {
    try {
      const optimizedSrc = await imageOptimizer.optimizeImage(src, {
        width: 300,
        height: 200,
        quality: 80
      })
      
      this.setData({
        imageSrc: optimizedSrc
      })
    } catch (error) {
      console.error('Failed to optimize image:', error)
    }
  }
})
```

## Memory Management

### Component Lifecycle Optimization

```javascript
// Optimized component with proper cleanup
Component({
  data: {
    timer: null,
    observers: [],
    eventListeners: []
  },
  
  lifetimes: {
    attached() {
      this.initComponent()
    },
    
    detached() {
      this.cleanup()
    }
  },
  
  pageLifetimes: {
    show() {
      this.onPageShow()
    },
    
    hide() {
      this.onPageHide()
    }
  },
  
  methods: {
    initComponent() {
      // Set up timers
      this.setupTimer()
      
      // Set up observers
      this.setupObservers()
      
      // Set up event listeners
      this.setupEventListeners()
    },
    
    setupTimer() {
      this.data.timer = setInterval(() => {
        this.updateData()
      }, 5000)
    },
    
    setupObservers() {
      // Intersection observer
      const intersectionObserver = this.createIntersectionObserver()
      intersectionObserver.relativeToViewport().observe('.target', (res) => {
        // Handle intersection
      })
      
      this.data.observers.push(intersectionObserver)
    },
    
    setupEventListeners() {
      // Global event listeners
      const networkListener = (res) => {
        this.handleNetworkChange(res)
      }
      
      wx.onNetworkStatusChange(networkListener)
      this.data.eventListeners.push({
        type: 'network',
        listener: networkListener,
        off: wx.offNetworkStatusChange
      })
    },
    
    onPageShow() {
      // Resume timers and observers when page is visible
      if (!this.data.timer) {
        this.setupTimer()
      }
    },
    
    onPageHide() {
      // Pause timers when page is hidden
      if (this.data.timer) {
        clearInterval(this.data.timer)
        this.data.timer = null
      }
    },
    
    cleanup() {
      // Clear timers
      if (this.data.timer) {
        clearInterval(this.data.timer)
        this.data.timer = null
      }
      
      // Disconnect observers
      this.data.observers.forEach(observer => {
        observer.disconnect()
      })
      this.data.observers = []
      
      // Remove event listeners
      this.data.eventListeners.forEach(({ listener, off }) => {
        off(listener)
      })
      this.data.eventListeners = []
    }
  }
})
```

### Memory Leak Prevention

```javascript
// Memory leak prevention utilities
class MemoryManager {
  constructor() {
    this.refs = new WeakMap()
    this.timers = new Set()
    this.observers = new Set()
  }
  
  // Safe timer management
  setTimeout(callback, delay) {
    const timer = setTimeout(() => {
      callback()
      this.timers.delete(timer)
    }, delay)
    
    this.timers.add(timer)
    return timer
  }
  
  setInterval(callback, interval) {
    const timer = setInterval(callback, interval)
    this.timers.add(timer)
    return timer
  }
  
  clearTimer(timer) {
    clearTimeout(timer)
    clearInterval(timer)
    this.timers.delete(timer)
  }
  
  // Safe observer management
  createIntersectionObserver(component, options) {
    const observer = component.createIntersectionObserver(options)
    this.observers.add(observer)
    return observer
  }
  
  disconnectObserver(observer) {
    observer.disconnect()
    this.observers.delete(observer)
  }
  
  // Cleanup all resources
  cleanup() {
    // Clear all timers
    this.timers.forEach(timer => {
      clearTimeout(timer)
      clearInterval(timer)
    })
    this.timers.clear()
    
    // Disconnect all observers
    this.observers.forEach(observer => {
      observer.disconnect()
    })
    this.observers.clear()
  }
}

// Usage in components
Component({
  lifetimes: {
    attached() {
      this.memoryManager = new MemoryManager()
      this.initComponent()
    },
    
    detached() {
      if (this.memoryManager) {
        this.memoryManager.cleanup()
      }
    }
  },
  
  methods: {
    initComponent() {
      // Use memory manager for timers
      this.updateTimer = this.memoryManager.setInterval(() => {
        this.updateData()
      }, 1000)
      
      // Use memory manager for observers
      this.intersectionObserver = this.memoryManager.createIntersectionObserver(this)
    }
  }
})
```

## Network Optimization

### Request Optimization

```javascript
// Optimized request manager
class RequestOptimizer {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
    this.requestQueue = []
    this.maxConcurrent = 6
    this.activeRequests = 0
  }
  
  async request(url, options = {}) {
    const cacheKey = this.generateCacheKey(url, options)
    
    // Check cache first
    if (options.useCache !== false) {
      const cached = this.getFromCache(cacheKey)
      if (cached) {
        return cached
      }
    }
    
    // Check for duplicate requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)
    }
    
    // Create request promise
    const requestPromise = this.executeRequest(url, options)
    this.pendingRequests.set(cacheKey, requestPromise)
    
    try {
      const result = await requestPromise
      
      // Cache successful results
      if (options.useCache !== false) {
        this.addToCache(cacheKey, result)
      }
      
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }
  
  async executeRequest(url, options) {
    // Queue request if too many concurrent requests
    if (this.activeRequests >= this.maxConcurrent) {
      await this.waitForSlot()
    }
    
    this.activeRequests++
    
    try {
      return await this.makeRequest(url, options)
    } finally {
      this.activeRequests--
      this.processQueue()
    }
  }
  
  makeRequest(url, options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        ...options,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(new Error(`Request failed: ${res.statusCode}`))
          }
        },
        fail: reject
      })
    })
  }
  
  waitForSlot() {
    return new Promise(resolve => {
      this.requestQueue.push(resolve)
    })
  }
  
  processQueue() {
    if (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrent) {
      const resolve = this.requestQueue.shift()
      resolve()
    }
  }
  
  generateCacheKey(url, options) {
    const { data, method = 'GET' } = options
    return `${method}:${url}:${JSON.stringify(data || {})}`
  }
  
  getFromCache(key) {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
      return cached.data
    }
    return null
  }
  
  addToCache(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
    
    // Limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
  }
}

const requestOptimizer = new RequestOptimizer()

// Usage
Page({
  async loadData() {
    try {
      const [users, posts] = await Promise.all([
        requestOptimizer.request('/api/users'),
        requestOptimizer.request('/api/posts')
      ])
      
      this.setData({ users, posts })
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  }
})
```

## Performance Monitoring

### Performance Metrics Collection

```javascript
// Performance monitor
class PerformanceMonitor {
  constructor() {
    this.metrics = []
    this.observers = []
    this.startTime = Date.now()
  }
  
  // Measure page load time
  measurePageLoad(pageName) {
    const loadTime = Date.now() - this.startTime
    
    this.recordMetric({
      type: 'page_load',
      page: pageName,
      duration: loadTime,
      timestamp: Date.now()
    })
    
    console.log(`Page ${pageName} loaded in ${loadTime}ms`)
  }
  
  // Measure function execution time
  measureFunction(name, fn) {
    return async (...args) => {
      const startTime = Date.now()
      
      try {
        const result = await fn(...args)
        const duration = Date.now() - startTime
        
        this.recordMetric({
          type: 'function_execution',
          name,
          duration,
          success: true,
          timestamp: Date.now()
        })
        
        return result
      } catch (error) {
        const duration = Date.now() - startTime
        
        this.recordMetric({
          type: 'function_execution',
          name,
          duration,
          success: false,
          error: error.message,
          timestamp: Date.now()
        })
        
        throw error
      }
    }
  }
  
  // Monitor memory usage
  monitorMemory() {
    if (wx.getPerformance) {
      const performance = wx.getPerformance()
      
      this.recordMetric({
        type: 'memory_usage',
        usedJSHeapSize: performance.usedJSHeapSize,
        totalJSHeapSize: performance.totalJSHeapSize,
        timestamp: Date.now()
      })
    }
  }
  
  // Monitor network requests
  monitorRequest(url, startTime, endTime, success, size) {
    this.recordMetric({
      type: 'network_request',
      url,
      duration: endTime - startTime,
      success,
      size,
      timestamp: endTime
    })
  }
  
  recordMetric(metric) {
    this.metrics.push(metric)
    
    // Keep only recent metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-500)
    }
    
    // Report critical performance issues
    this.checkPerformanceThresholds(metric)
  }
  
  checkPerformanceThresholds(metric) {
    const thresholds = {
      page_load: 3000,
      function_execution: 1000,
      network_request: 5000
    }
    
    const threshold = thresholds[metric.type]
    if (threshold && metric.duration > threshold) {
      console.warn(`Performance warning: ${metric.type} took ${metric.duration}ms`, metric)
      
      // Report to analytics service
      this.reportPerformanceIssue(metric)
    }
  }
  
  reportPerformanceIssue(metric) {
    // Send to analytics service
    wx.request({
      url: 'https://analytics.example.com/performance',
      method: 'POST',
      data: {
        ...metric,
        userAgent: wx.getSystemInfoSync(),
        appVersion: getApp().globalData.version
      }
    })
  }
  
  getMetrics() {
    return this.metrics
  }
  
  getAverageMetric(type) {
    const typeMetrics = this.metrics.filter(m => m.type === type)
    if (typeMetrics.length === 0) return 0
    
    const total = typeMetrics.reduce((sum, m) => sum + m.duration, 0)
    return total / typeMetrics.length
  }
}

const performanceMonitor = new PerformanceMonitor()

// Usage
Page({
  onLoad() {
    const startTime = Date.now()
    
    // Measure page load
    this.loadData().then(() => {
      performanceMonitor.measurePageLoad('home')
    })
  },
  
  // Wrap functions for performance monitoring
  loadData: performanceMonitor.measureFunction('loadData', async function() {
    // Your data loading logic
    const data = await api.getData()
    this.setData({ data })
  }),
  
  onShow() {
    // Monitor memory usage periodically
    this.memoryTimer = setInterval(() => {
      performanceMonitor.monitorMemory()
    }, 10000)
  },
  
  onHide() {
    if (this.memoryTimer) {
      clearInterval(this.memoryTimer)
    }
  }
})
```

Performance optimization is an ongoing process. Regular monitoring, profiling, and optimization based on real user data will help maintain smooth and responsive mini programs.