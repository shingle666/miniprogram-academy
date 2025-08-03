# Performance Optimization Guide

This guide provides comprehensive strategies and techniques for optimizing mini program performance across different aspects of development.

## Performance Fundamentals

### Key Performance Metrics

```javascript
// utils/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.startTimes = {}
  }

  // Mark performance timing
  mark(name) {
    this.startTimes[name] = Date.now()
  }

  // Measure performance duration
  measure(name) {
    if (this.startTimes[name]) {
      const duration = Date.now() - this.startTimes[name]
      this.metrics[name] = duration
      console.log(`⏱️ ${name}: ${duration}ms`)
      return duration
    }
    return 0
  }

  // Get all metrics
  getMetrics() {
    return { ...this.metrics }
  }

  // Clear metrics
  clear() {
    this.metrics = {}
    this.startTimes = {}
  }
}

module.exports = new PerformanceMonitor()
```

### Performance Monitoring Setup

```javascript
// app.js - Global performance monitoring
const performance = require('./utils/performance')

App({
  onLaunch() {
    performance.mark('app-launch')
    
    // Monitor app launch time
    wx.onAppShow(() => {
      performance.measure('app-launch')
    })
  },

  onShow() {
    performance.mark('app-show')
  },

  onHide() {
    performance.measure('app-show')
  }
})
```

## Startup Performance

### App Launch Optimization

```javascript
// app.js - Optimized app launch
App({
  globalData: {
    userInfo: null,
    systemInfo: null
  },

  onLaunch() {
    // Preload critical system info
    this.preloadSystemInfo()
    
    // Initialize essential services only
    this.initEssentialServices()
    
    // Defer non-critical initialization
    setTimeout(() => {
      this.initNonCriticalServices()
    }, 100)
  },

  preloadSystemInfo() {
    try {
      this.globalData.systemInfo = wx.getSystemInfoSync()
    } catch (error) {
      console.error('Failed to get system info:', error)
    }
  },

  initEssentialServices() {
    // Initialize only critical services
    this.initStorage()
    this.initNetworkMonitor()
  },

  initNonCriticalServices() {
    // Initialize non-critical services
    this.initAnalytics()
    this.initPushNotifications()
  },

  initStorage() {
    // Initialize storage with error handling
    try {
      const storageInfo = wx.getStorageInfoSync()
      console.log('Storage initialized:', storageInfo)
    } catch (error) {
      console.error('Storage initialization failed:', error)
    }
  },

  initNetworkMonitor() {
    wx.onNetworkStatusChange((res) => {
      console.log('Network status changed:', res.isConnected)
    })
  },

  initAnalytics() {
    // Initialize analytics (non-critical)
    console.log('Analytics initialized')
  },

  initPushNotifications() {
    // Initialize push notifications (non-critical)
    console.log('Push notifications initialized')
  }
})
```

### Page Load Optimization

```javascript
// pages/index/index.js - Optimized page loading
const performance = require('../../utils/performance')

Page({
  data: {
    // Only essential initial data
    loading: true,
    criticalData: null
  },

  onLoad(options) {
    performance.mark('page-load')
    
    // Load critical data first
    this.loadCriticalData()
    
    // Defer non-critical data loading
    this.deferNonCriticalData()
  },

  onReady() {
    performance.measure('page-load')
    
    // Page is ready, load remaining data
    this.loadRemainingData()
  },

  async loadCriticalData() {
    try {
      const criticalData = await this.fetchCriticalData()
      this.setData({
        criticalData,
        loading: false
      })
    } catch (error) {
      console.error('Failed to load critical data:', error)
      this.setData({ loading: false })
    }
  },

  deferNonCriticalData() {
    // Use setTimeout to defer non-critical operations
    setTimeout(() => {
      this.loadNonCriticalData()
    }, 50)
  },

  async loadNonCriticalData() {
    try {
      const nonCriticalData = await this.fetchNonCriticalData()
      this.setData({ nonCriticalData })
    } catch (error) {
      console.error('Failed to load non-critical data:', error)
    }
  },

  async loadRemainingData() {
    // Load data that's not immediately visible
    try {
      const remainingData = await this.fetchRemainingData()
      this.setData({ remainingData })
    } catch (error) {
      console.error('Failed to load remaining data:', error)
    }
  },

  fetchCriticalData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ id: 1, name: 'Critical Data' }), 100)
    })
  },

  fetchNonCriticalData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ analytics: 'data' }), 200)
    })
  },

  fetchRemainingData() {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ additional: 'data' }), 300)
    })
  }
})
```

## Rendering Performance

### Efficient Data Updates

```javascript
// utils/data-optimizer.js
class DataOptimizer {
  // Batch multiple setData calls
  static batchSetData(page, updates, callback) {
    if (Array.isArray(updates)) {
      const batchedData = updates.reduce((acc, update) => {
        return { ...acc, ...update }
      }, {})
      
      page.setData(batchedData, callback)
    } else {
      page.setData(updates, callback)
    }
  }

  // Optimize data structure for setData
  static optimizeDataStructure(data) {
    const optimized = {}
    
    Object.keys(data).forEach(key => {
      const value = data[key]
      
      // Only include changed values
      if (this.hasChanged(key, value)) {
        optimized[key] = value
      }
    })
    
    return optimized
  }

  // Check if data has changed
  static hasChanged(key, newValue) {
    // Implement change detection logic
    const oldValue = this.previousData?.[key]
    return JSON.stringify(oldValue) !== JSON.stringify(newValue)
  }

  // Deep update specific path
  static updatePath(page, path, value) {
    const updateData = {}
    updateData[path] = value
    page.setData(updateData)
  }

  // Update array item efficiently
  static updateArrayItem(page, arrayPath, index, item) {
    const path = `${arrayPath}[${index}]`
    this.updatePath(page, path, item)
  }

  // Update object property efficiently
  static updateObjectProperty(page, objectPath, property, value) {
    const path = `${objectPath}.${property}`
    this.updatePath(page, path, value)
  }
}

module.exports = DataOptimizer
```

**Usage Example:**

```javascript
// pages/list/list.js
const DataOptimizer = require('../../utils/data-optimizer')

Page({
  data: {
    items: [],
    loading: false,
    error: null
  },

  // Efficient list update
  updateItem(index, newItem) {
    // Instead of updating entire array
    // this.setData({ items: newItems })
    
    // Update specific item
    DataOptimizer.updateArrayItem(this, 'items', index, newItem)
  },

  // Batch multiple updates
  updateMultipleItems(updates) {
    const batchUpdates = updates.map((update, index) => ({
      [`items[${index}]`]: update
    }))
    
    DataOptimizer.batchSetData(this, batchUpdates)
  },

  // Update item property
  updateItemProperty(index, property, value) {
    DataOptimizer.updateObjectProperty(
      this,
      `items[${index}]`,
      property,
      value
    )
  }
})
```

### Virtual List Implementation

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
    totalHeight: 0
  },

  observers: {
    'items, itemHeight, containerHeight': function(items, itemHeight, containerHeight) {
      this.calculateVisibleItems()
    }
  },

  methods: {
    calculateVisibleItems() {
      const { items, itemHeight, containerHeight } = this.properties
      const { scrollTop } = this.data
      
      if (!items.length) return
      
      // Calculate visible range
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      )
      
      // Get visible items with position info
      const visibleItems = []
      for (let i = startIndex; i < endIndex; i++) {
        visibleItems.push({
          ...items[i],
          index: i,
          top: i * itemHeight
        })
      }
      
      this.setData({
        visibleItems,
        totalHeight: items.length * itemHeight
      })
    },

    onScroll(e) {
      const scrollTop = e.detail.scrollTop
      
      // Throttle scroll events
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer)
      }
      
      this.scrollTimer = setTimeout(() => {
        this.setData({ scrollTop }, () => {
          this.calculateVisibleItems()
        })
      }, 16) // ~60fps
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
  <view class="virtual-list-container" style="height: {{totalHeight}}px">
    <view 
      wx:for="{{visibleItems}}"
      wx:key="index"
      class="virtual-list-item"
      style="position: absolute; top: {{item.top}}px; height: {{itemHeight}}px"
    >
      <slot name="item" item="{{item}}"></slot>
    </view>
  </view>
</scroll-view>
```

## Image Optimization

### Lazy Loading Implementation

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
      value: 100 // pixels
    }
  },

  data: {
    loaded: false,
    currentSrc: '',
    error: false
  },

  lifetimes: {
    attached() {
      this.setData({ currentSrc: this.properties.placeholder })
      this.setupIntersectionObserver()
    },

    detached() {
      if (this.intersectionObserver) {
        this.intersectionObserver.disconnect()
      }
    }
  },

  methods: {
    setupIntersectionObserver() {
      this.intersectionObserver = this.createIntersectionObserver({
        rootMargin: `${this.properties.threshold}px`
      })

      this.intersectionObserver
        .relativeToViewport()
        .observe('.lazy-image', (res) => {
          if (res.intersectionRatio > 0) {
            this.loadImage()
            this.intersectionObserver.disconnect()
          }
        })
    },

    loadImage() {
      const { src } = this.properties
      
      if (!src || this.data.loaded) return

      // Preload image
      wx.getImageInfo({
        src,
        success: () => {
          this.setData({
            currentSrc: src,
            loaded: true,
            error: false
          })
        },
        fail: () => {
          this.setData({
            error: true
          })
          console.error('Failed to load image:', src)
        }
      })
    },

    onImageLoad() {
      this.triggerEvent('load')
    },

    onImageError() {
      this.setData({ error: true })
      this.triggerEvent('error')
    }
  }
})
```

### Image Compression and Caching

```javascript
// utils/image-optimizer.js
class ImageOptimizer {
  constructor() {
    this.cache = new Map()
    this.maxCacheSize = 50
  }

  // Optimize image URL with compression parameters
  optimizeImageUrl(url, options = {}) {
    const {
      width = 750,
      quality = 80,
      format = 'webp'
    } = options

    // Add compression parameters to URL
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}w=${width}&q=${quality}&f=${format}`
  }

  // Get responsive image URL based on device
  getResponsiveImageUrl(url, sizes = {}) {
    const systemInfo = wx.getSystemInfoSync()
    const { windowWidth, pixelRatio } = systemInfo
    
    const actualWidth = windowWidth * pixelRatio
    
    // Choose appropriate size
    let targetWidth = 750 // default
    
    if (actualWidth <= 375) {
      targetWidth = sizes.small || 375
    } else if (actualWidth <= 750) {
      targetWidth = sizes.medium || 750
    } else {
      targetWidth = sizes.large || 1125
    }
    
    return this.optimizeImageUrl(url, { width: targetWidth })
  }

  // Cache image info
  cacheImageInfo(url, info) {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(url, {
      ...info,
      timestamp: Date.now()
    })
  }

  // Get cached image info
  getCachedImageInfo(url) {
    return this.cache.get(url)
  }

  // Preload critical images
  async preloadImages(urls) {
    const promises = urls.map(url => {
      return new Promise((resolve) => {
        wx.getImageInfo({
          src: url,
          success: (res) => {
            this.cacheImageInfo(url, res)
            resolve(res)
          },
          fail: () => resolve(null)
        })
      })
    })
    
    return Promise.all(promises)
  }

  // Clear expired cache
  clearExpiredCache(maxAge = 30 * 60 * 1000) { // 30 minutes
    const now = Date.now()
    
    for (const [url, info] of this.cache.entries()) {
      if (now - info.timestamp > maxAge) {
        this.cache.delete(url)
      }
    }
  }
}

module.exports = new ImageOptimizer()
```

## Memory Management

### Component Lifecycle Optimization

```javascript
// components/optimized-component/optimized-component.js
Component({
  data: {
    items: []
  },

  lifetimes: {
    attached() {
      this.initComponent()
    },

    ready() {
      this.setupEventListeners()
    },

    detached() {
      this.cleanup()
    }
  },

  methods: {
    initComponent() {
      // Initialize component state
      this.timers = new Set()
      this.observers = new Set()
      this.eventListeners = new Map()
    },

    setupEventListeners() {
      // Setup global event listeners
      const networkListener = (res) => {
        this.handleNetworkChange(res)
      }
      
      wx.onNetworkStatusChange(networkListener)
      this.eventListeners.set('networkStatusChange', networkListener)
    },

    // Safe timer creation
    createTimer(callback, delay) {
      const timer = setTimeout(() => {
        this.timers.delete(timer)
        callback()
      }, delay)
      
      this.timers.add(timer)
      return timer
    },

    // Safe interval creation
    createInterval(callback, interval) {
      const timer = setInterval(callback, interval)
      this.timers.add(timer)
      return timer
    },

    // Create intersection observer
    createSafeIntersectionObserver(options, callback) {
      const observer = this.createIntersectionObserver(options)
      this.observers.add(observer)
      
      return observer.relativeToViewport().observe('.target', callback)
    },

    // Cleanup method
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

      // Remove event listeners
      this.eventListeners.forEach((listener, event) => {
        if (event === 'networkStatusChange') {
          wx.offNetworkStatusChange(listener)
        }
      })
      this.eventListeners.clear()

      // Clear data references
      this.setData({
        items: []
      })
    },

    handleNetworkChange(res) {
      console.log('Network changed:', res.isConnected)
    }
  }
})
```

### Memory Leak Prevention

```javascript
// utils/memory-manager.js
class MemoryManager {
  constructor() {
    this.pageInstances = new WeakMap()
    this.componentInstances = new WeakMap()
  }

  // Track page instance
  trackPage(page) {
    this.pageInstances.set(page, {
      timers: new Set(),
      observers: new Set(),
      listeners: new Map()
    })
  }

  // Track component instance
  trackComponent(component) {
    this.componentInstances.set(component, {
      timers: new Set(),
      observers: new Set(),
      listeners: new Map()
    })
  }

  // Add timer to tracking
  addTimer(instance, timer) {
    const tracking = this.pageInstances.get(instance) || 
                    this.componentInstances.get(instance)
    
    if (tracking) {
      tracking.timers.add(timer)
    }
  }

  // Add observer to tracking
  addObserver(instance, observer) {
    const tracking = this.pageInstances.get(instance) || 
                    this.componentInstances.get(instance)
    
    if (tracking) {
      tracking.observers.add(observer)
    }
  }

  // Add event listener to tracking
  addListener(instance, event, listener) {
    const tracking = this.pageInstances.get(instance) || 
                    this.componentInstances.get(instance)
    
    if (tracking) {
      tracking.listeners.set(event, listener)
    }
  }

  // Cleanup instance
  cleanup(instance) {
    const tracking = this.pageInstances.get(instance) || 
                    this.componentInstances.get(instance)
    
    if (!tracking) return

    // Clear timers
    tracking.timers.forEach(timer => {
      clearTimeout(timer)
      clearInterval(timer)
    })

    // Disconnect observers
    tracking.observers.forEach(observer => {
      if (observer.disconnect) {
        observer.disconnect()
      }
    })

    // Remove listeners
    tracking.listeners.forEach((listener, event) => {
      this.removeEventListener(event, listener)
    })

    // Clear tracking
    this.pageInstances.delete(instance)
    this.componentInstances.delete(instance)
  }

  removeEventListener(event, listener) {
    switch (event) {
      case 'networkStatusChange':
        wx.offNetworkStatusChange(listener)
        break
      case 'accelerometerChange':
        wx.offAccelerometerChange(listener)
        break
      // Add more event types as needed
    }
  }

  // Get memory usage info
  getMemoryInfo() {
    return new Promise((resolve) => {
      wx.getPerformance().getEntries().forEach(entry => {
        if (entry.entryType === 'memory') {
          resolve(entry)
        }
      })
    })
  }
}

module.exports = new MemoryManager()
```

## Network Optimization

### Request Optimization

```javascript
// utils/request-optimizer.js
class RequestOptimizer {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
    this.requestQueue = []
    this.maxConcurrentRequests = 5
    this.activeRequests = 0
  }

  // Optimized request with caching and deduplication
  async request(options) {
    const cacheKey = this.getCacheKey(options)
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      if (!this.isCacheExpired(cached)) {
        return cached.data
      }
    }

    // Check for pending identical request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)
    }

    // Create new request promise
    const requestPromise = this.executeRequest(options, cacheKey)
    this.pendingRequests.set(cacheKey, requestPromise)

    try {
      const result = await requestPromise
      this.cacheResponse(cacheKey, result, options.cacheTime)
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }

  async executeRequest(options, cacheKey) {
    // Queue request if too many concurrent requests
    if (this.activeRequests >= this.maxConcurrentRequests) {
      await this.queueRequest()
    }

    this.activeRequests++

    try {
      const response = await this.makeRequest(options)
      return response
    } finally {
      this.activeRequests--
      this.processQueue()
    }
  }

  makeRequest(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(new Error(`Request failed with status ${res.statusCode}`))
          }
        },
        fail: reject
      })
    })
  }

  queueRequest() {
    return new Promise((resolve) => {
      this.requestQueue.push(resolve)
    })
  }

  processQueue() {
    if (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const resolve = this.requestQueue.shift()
      resolve()
    }
  }

  getCacheKey(options) {
    const { url, method = 'GET', data } = options
    return `${method}:${url}:${JSON.stringify(data || {})}`
  }

  cacheResponse(key, data, cacheTime = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      cacheTime
    })
  }

  isCacheExpired(cached) {
    return Date.now() - cached.timestamp > cached.cacheTime
  }

  // Batch multiple requests
  async batchRequests(requests) {
    const promises = requests.map(request => this.request(request))
    return Promise.all(promises)
  }

  // Clear expired cache
  clearExpiredCache() {
    for (const [key, cached] of this.cache.entries()) {
      if (this.isCacheExpired(cached)) {
        this.cache.delete(key)
      }
    }
  }
}

module.exports = new RequestOptimizer()
```

## Performance Monitoring

### Real-time Performance Tracking

```javascript
// utils/performance-tracker.js
class PerformanceTracker {
  constructor() {
    this.metrics = {
      pageLoad: [],
      apiResponse: [],
      renderTime: [],
      memoryUsage: []
    }
    this.thresholds = {
      pageLoad: 3000, // 3 seconds
      apiResponse: 2000, // 2 seconds
      renderTime: 16, // 60fps
      memoryUsage: 50 * 1024 * 1024 // 50MB
    }
  }

  // Track page load performance
  trackPageLoad(pageName, startTime, endTime) {
    const duration = endTime - startTime
    
    this.metrics.pageLoad.push({
      page: pageName,
      duration,
      timestamp: Date.now(),
      slow: duration > this.thresholds.pageLoad
    })

    if (duration > this.thresholds.pageLoad) {
      this.reportSlowPageLoad(pageName, duration)
    }
  }

  // Track API response time
  trackApiResponse(url, startTime, endTime, success = true) {
    const duration = endTime - startTime
    
    this.metrics.apiResponse.push({
      url,
      duration,
      success,
      timestamp: Date.now(),
      slow: duration > this.thresholds.apiResponse
    })

    if (duration > this.thresholds.apiResponse) {
      this.reportSlowApiResponse(url, duration)
    }
  }

  // Track render performance
  trackRenderTime(componentName, renderTime) {
    this.metrics.renderTime.push({
      component: componentName,
      renderTime,
      timestamp: Date.now(),
      slow: renderTime > this.thresholds.renderTime
    })
  }

  // Monitor memory usage
  async monitorMemoryUsage() {
    try {
      const memoryInfo = await this.getMemoryInfo()
      
      this.metrics.memoryUsage.push({
        ...memoryInfo,
        timestamp: Date.now(),
        high: memoryInfo.usedJSHeapSize > this.thresholds.memoryUsage
      })

      if (memoryInfo.usedJSHeapSize > this.thresholds.memoryUsage) {
        this.reportHighMemoryUsage(memoryInfo)
      }
    } catch (error) {
      console.error('Failed to get memory info:', error)
    }
  }

  getMemoryInfo() {
    return new Promise((resolve) => {
      // Simulate memory info (actual implementation may vary)
      resolve({
        usedJSHeapSize: Math.random() * 100 * 1024 * 1024,
        totalJSHeapSize: 128 * 1024 * 1024,
        jsHeapSizeLimit: 256 * 1024 * 1024
      })
    })
  }

  // Generate performance report
  generateReport() {
    const report = {
      summary: this.generateSummary(),
      slowPages: this.getSlowPages(),
      slowApis: this.getSlowApis(),
      memoryIssues: this.getMemoryIssues(),
      recommendations: this.generateRecommendations()
    }

    return report
  }

  generateSummary() {
    return {
      totalPageLoads: this.metrics.pageLoad.length,
      averagePageLoadTime: this.calculateAverage(this.metrics.pageLoad, 'duration'),
      totalApiCalls: this.metrics.apiResponse.length,
      averageApiResponseTime: this.calculateAverage(this.metrics.apiResponse, 'duration'),
      slowPageLoads: this.metrics.pageLoad.filter(m => m.slow).length,
      slowApiCalls: this.metrics.apiResponse.filter(m => m.slow).length
    }
  }

  calculateAverage(metrics, field) {
    if (metrics.length === 0) return 0
    const sum = metrics.reduce((acc, metric) => acc + metric[field], 0)
    return Math.round(sum / metrics.length)
  }

  getSlowPages() {
    return this.metrics.pageLoad
      .filter(m => m.slow)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
  }

  getSlowApis() {
    return this.metrics.apiResponse
      .filter(m => m.slow)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10)
  }

  getMemoryIssues() {
    return this.metrics.memoryUsage
      .filter(m => m.high)
      .sort((a, b) => b.usedJSHeapSize - a.usedJSHeapSize)
      .slice(0, 10)
  }

  generateRecommendations() {
    const recommendations = []
    const summary = this.generateSummary()

    if (summary.averagePageLoadTime > this.thresholds.pageLoad) {
      recommendations.push('Consider optimizing page load performance')
    }

    if (summary.averageApiResponseTime > this.thresholds.apiResponse) {
      recommendations.push('Consider optimizing API response times')
    }

    if (this.getMemoryIssues().length > 0) {
      recommendations.push('Consider optimizing memory usage')
    }

    return recommendations
  }

  reportSlowPageLoad(pageName, duration) {
    console.warn(`Slow page load detected: ${pageName} took ${duration}ms`)
  }

  reportSlowApiResponse(url, duration) {
    console.warn(`Slow API response detected: ${url} took ${duration}ms`)
  }

  reportHighMemoryUsage(memoryInfo) {
    console.warn('High memory usage detected:', memoryInfo)
  }

  // Clear old metrics
  clearOldMetrics(maxAge = 24 * 60 * 60 * 1000) { // 24 hours
    const cutoff = Date.now() - maxAge
    
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = this.metrics[key].filter(m => m.timestamp > cutoff)
    })
  }
}

module.exports = new PerformanceTracker()
```

## Best Practices Summary

### Performance Checklist

- ✅ **Startup Optimization**
  - Minimize app launch time
  - Defer non-critical initialization
  - Preload essential data only

- ✅ **Rendering Performance**
  - Use efficient data updates
  - Implement virtual lists for large datasets
  - Batch setData operations

- ✅ **Image Optimization**
  - Implement lazy loading
  - Use appropriate image formats and sizes
  - Cache image information

- ✅ **Memory Management**
  - Clean up timers and observers
  - Remove event listeners on component destruction
  - Monitor memory usage

- ✅ **Network Optimization**
  - Cache API responses
  - Deduplicate identical requests
  - Limit concurrent requests

- ✅ **Performance Monitoring**
  - Track key performance metrics
  - Set performance thresholds
  - Generate regular performance reports

### Common Performance Anti-patterns

❌ **Avoid These Patterns:**

1. **Frequent setData calls** - Batch updates instead
2. **Large data transfers** - Use pagination and virtual lists
3. **Unoptimized images** - Compress and resize images
4. **Memory leaks** - Always clean up resources
5. **Blocking operations** - Use asynchronous operations
6. **Unnecessary re-renders** - Optimize data structure updates

By following these optimization strategies and monitoring performance regularly, you can ensure your mini program delivers a smooth and responsive user experience.