# Performance Optimization

This comprehensive guide covers performance optimization techniques for mini programs, including startup optimization, runtime performance, memory management, and monitoring strategies.

## 📋 Table of Contents

- [Startup Performance](#startup-performance)
- [Runtime Optimization](#runtime-optimization)
- [Memory Management](#memory-management)
- [Network Optimization](#network-optimization)
- [Image Optimization](#image-optimization)
- [Code Splitting](#code-splitting)
- [Performance Monitoring](#performance-monitoring)
- [Best Practices](#best-practices)

## 🚀 Startup Performance

### App Launch Optimization

```javascript
// app.js - Optimized app initialization
App({
  onLaunch(options) {
    console.time('App Launch')
    
    // 1. Essential initialization only
    this.initializeEssentials()
    
    // 2. Defer non-critical operations
    this.deferNonCriticalInit()
    
    console.timeEnd('App Launch')
  },
  
  initializeEssentials() {
    // Only critical data needed for first page
    this.globalData = {
      systemInfo: wx.getSystemInfoSync(),
      userInfo: null,
      theme: wx.getStorageSync('theme') || 'light'
    }
    
    // Essential configurations
    this.setupErrorHandling()
    this.setupNetworkMonitoring()
  },
  
  deferNonCriticalInit() {
    // Use setTimeout to defer heavy operations
    setTimeout(() => {
      this.loadUserPreferences()
      this.initializeAnalytics()
      this.preloadCommonData()
    }, 100)
  },
  
  setupErrorHandling() {
    // Lightweight error handler
    wx.onError((error) => {
      console.error('App Error:', error)
      // Send to error reporting service
    })
  },
  
  setupNetworkMonitoring() {
    wx.onNetworkStatusChange((res) => {
      this.globalData.isOnline = res.isConnected
    })
  },
  
  async loadUserPreferences() {
    try {
      const preferences = wx.getStorageSync('userPreferences')
      if (preferences) {
        this.globalData.userPreferences = preferences
      }
    } catch (error) {
      console.error('Failed to load user preferences:', error)
    }
  },
  
  initializeAnalytics() {
    // Initialize analytics SDK
    // This is not critical for app startup
  },
  
  preloadCommonData() {
    // Preload frequently used data
    this.preloadConfigData()
    this.preloadUserData()
  }
})
```

### Page Load Optimization

```javascript
// Optimized page loading
Page({
  data: {
    // Minimal initial data
    loading: true,
    essentialData: null
  },
  
  onLoad(options) {
    console.time('Page Load')
    
    // 1. Parse options immediately
    this.parseOptions(options)
    
    // 2. Load critical data first
    this.loadCriticalData()
    
    // 3. Defer non-critical operations
    this.deferNonCriticalOperations()
  },
  
  onReady() {
    console.timeEnd('Page Load')
  },
  
  parseOptions(options) {
    // Quick parameter parsing
    this.pageParams = {
      id: options.id,
      type: options.type || 'default'
    }
  },
  
  async loadCriticalData() {
    try {
      // Load only data needed for initial render
      const essentialData = await this.fetchEssentialData()
      
      this.setData({
        essentialData,
        loading: false
      })
      
    } catch (error) {
      this.handleLoadError(error)
    }
  },
  
  deferNonCriticalOperations() {
    // Use requestIdleCallback equivalent
    setTimeout(() => {
      this.loadSecondaryData()
      this.setupEventListeners()
      this.initializeComponents()
    }, 50)
  },
  
  async fetchEssentialData() {
    // Fetch only critical data
    const response = await wx.request({
      url: `/api/essential/${this.pageParams.id}`,
      method: 'GET'
    })
    return response.data
  },
  
  async loadSecondaryData() {
    try {
      const secondaryData = await this.fetchSecondaryData()
      this.setData({ secondaryData })
    } catch (error) {
      console.error('Failed to load secondary data:', error)
    }
  }
})
```

## ⚡ Runtime Optimization

### Efficient Data Updates

```javascript
// Optimized data update strategies
Page({
  data: {
    items: [],
    userInfo: {},
    ui: {
      loading: false,
      error: null
    }
  },
  
  // 1. Batch updates
  batchUpdateData() {
    // Bad: Multiple setData calls
    // this.setData({ 'ui.loading': true })
    // this.setData({ 'ui.error': null })
    // this.setData({ items: newItems })
    
    // Good: Single setData call
    this.setData({
      'ui.loading': false,
      'ui.error': null,
      items: newItems
    })
  },
  
  // 2. Partial updates for large objects
  updateUserInfo(field, value) {
    // Bad: Update entire object
    // const newUserInfo = { ...this.data.userInfo, [field]: value }
    // this.setData({ userInfo: newUserInfo })
    
    // Good: Update specific field
    this.setData({
      [`userInfo.${field}`]: value
    })
  },
  
  // 3. Efficient list updates
  updateListItem(index, updates) {
    // Update specific item without recreating array
    Object.keys(updates).forEach(key => {
      this.setData({
        [`items[${index}].${key}`]: updates[key]
      })
    })
  },
  
  // 4. Conditional updates
  conditionalUpdate(newData) {
    const updates = {}
    
    // Only update changed fields
    if (newData.title !== this.data.title) {
      updates.title = newData.title
    }
    
    if (newData.status !== this.data.status) {
      updates.status = newData.status
    }
    
    // Only call setData if there are changes
    if (Object.keys(updates).length > 0) {
      this.setData(updates)
    }
  },
  
  // 5. Debounced updates for frequent changes
  onSearchInput: debounce(function(e) {
    const query = e.detail.value
    this.performSearch(query)
  }, 300),
  
  // 6. Virtual scrolling for large lists
  setupVirtualScrolling() {
    this.virtualConfig = {
      itemHeight: 100,
      containerHeight: 600,
      visibleCount: 6,
      bufferCount: 2
    }
    
    this.updateVisibleItems(0)
  },
  
  onScroll(e) {
    const scrollTop = e.detail.scrollTop
    const startIndex = Math.floor(scrollTop / this.virtualConfig.itemHeight)
    this.updateVisibleItems(startIndex)
  },
  
  updateVisibleItems(startIndex) {
    const { visibleCount, bufferCount } = this.virtualConfig
    const endIndex = Math.min(
      startIndex + visibleCount + bufferCount,
      this.data.items.length
    )
    
    const visibleItems = this.data.items.slice(startIndex, endIndex)
    
    this.setData({
      visibleItems,
      startIndex,
      offsetY: startIndex * this.virtualConfig.itemHeight
    })
  }
})

// Debounce utility
function debounce(func, wait) {
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
```

### Component Optimization

```javascript
// Optimized component implementation
Component({
  options: {
    // Enable data observation optimization
    pureDataPattern: /^_/,
    // Enable virtual host
    virtualHost: true
  },
  
  properties: {
    items: {
      type: Array,
      value: []
    },
    config: {
      type: Object,
      value: {}
    }
  },
  
  data: {
    // Pure data (not used in template) - prefix with _
    _cache: {},
    _computedValues: {},
    
    // Template data
    displayItems: [],
    loading: false
  },
  
  observers: {
    // Efficient observers
    'items, config': function(items, config) {
      // Only recompute when necessary
      if (this._shouldRecompute(items, config)) {
        this._computeDisplayItems(items, config)
      }
    }
  },
  
  lifetimes: {
    attached() {
      // Minimal initialization
      this._initializeCache()
    },
    
    detached() {
      // Clean up resources
      this._cleanup()
    }
  },
  
  methods: {
    _shouldRecompute(items, config) {
      const cache = this.data._cache
      return (
        !cache.items ||
        !cache.config ||
        JSON.stringify(items) !== JSON.stringify(cache.items) ||
        JSON.stringify(config) !== JSON.stringify(cache.config)
      )
    },
    
    _computeDisplayItems(items, config) {
      // Expensive computation
      const displayItems = items.map(item => ({
        ...item,
        computed: this._computeItemValue(item, config)
      }))
      
      this.setData({
        displayItems,
        '_cache.items': items,
        '_cache.config': config
      })
    },
    
    _computeItemValue(item, config) {
      // Complex computation logic
      return item.value * config.multiplier
    },
    
    _initializeCache() {
      this.setData({
        '_cache': {}
      })
    },
    
    _cleanup() {
      // Clear timers, remove listeners, etc.
    }
  }
})
```

## 💾 Memory Management

### Memory Leak Prevention

```javascript
// Memory-efficient page management
Page({
  onLoad() {
    this.timers = []
    this.listeners = []
    this.requests = []
    
    this.initializePage()
  },
  
  onUnload() {
    this.cleanup()
  },
  
  onHide() {
    // Pause operations to save memory
    this.pauseOperations()
  },
  
  onShow() {
    // Resume operations
    this.resumeOperations()
  },
  
  // Timer management
  createTimer(callback, interval) {
    const timer = setInterval(callback, interval)
    this.timers.push(timer)
    return timer
  },
  
  clearTimer(timer) {
    clearInterval(timer)
    const index = this.timers.indexOf(timer)
    if (index > -1) {
      this.timers.splice(index, 1)
    }
  },
  
  // Event listener management
  addEventListener(element, event, handler) {
    element.addEventListener(event, handler)
    this.listeners.push({ element, event, handler })
  },
  
  removeEventListener(element, event, handler) {
    element.removeEventListener(event, handler)
    this.listeners = this.listeners.filter(
      listener => !(listener.element === element && 
                   listener.event === event && 
                   listener.handler === handler)
    )
  },
  
  // Request management
  makeRequest(options) {
    const requestTask = wx.request({
      ...options,
      success: (res) => {
        this.removeRequest(requestTask)
        if (options.success) options.success(res)
      },
      fail: (error) => {
        this.removeRequest(requestTask)
        if (options.fail) options.fail(error)
      }
    })
    
    this.requests.push(requestTask)
    return requestTask
  },
  
  removeRequest(requestTask) {
    const index = this.requests.indexOf(requestTask)
    if (index > -1) {
      this.requests.splice(index, 1)
    }
  },
  
  pauseOperations() {
    // Pause timers
    this.timers.forEach(timer => clearInterval(timer))
    
    // Cancel pending requests
    this.requests.forEach(request => {
      if (request.abort) {
        request.abort()
      }
    })
    
    // Clear large data structures
    this.setData({
      largeDataSet: null,
      cachedImages: null
    })
  },
  
  resumeOperations() {
    // Resume necessary operations
    this.initializeTimers()
    this.loadEssentialData()
  },
  
  cleanup() {
    // Clear all timers
    this.timers.forEach(timer => clearInterval(timer))
    this.timers = []
    
    // Remove all event listeners
    this.listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler)
    })
    this.listeners = []
    
    // Cancel all requests
    this.requests.forEach(request => {
      if (request.abort) {
        request.abort()
      }
    })
    this.requests = []
    
    // Clear page data
    this.setData({
      items: null,
      cache: null,
      largeDataSet: null
    })
  }
})
```

### Data Structure Optimization

```javascript
// Efficient data structures
class OptimizedDataManager {
  constructor() {
    this.cache = new Map()
    this.lruCache = new LRUCache(100) // Limit cache size
    this.weakMap = new WeakMap() // For object associations
  }
  
  // LRU Cache implementation
  get(key) {
    if (this.lruCache.has(key)) {
      // Move to front
      const value = this.lruCache.get(key)
      this.lruCache.delete(key)
      this.lruCache.set(key, value)
      return value
    }
    return null
  }
  
  set(key, value) {
    if (this.lruCache.size >= this.lruCache.maxSize) {
      // Remove oldest item
      const firstKey = this.lruCache.keys().next().value
      this.lruCache.delete(firstKey)
    }
    this.lruCache.set(key, value)
  }
  
  // Object pooling for frequently created objects
  createObjectPool(createFn, resetFn, initialSize = 10) {
    const pool = []
    
    // Pre-populate pool
    for (let i = 0; i < initialSize; i++) {
      pool.push(createFn())
    }
    
    return {
      acquire() {
        return pool.length > 0 ? pool.pop() : createFn()
      },
      
      release(obj) {
        resetFn(obj)
        pool.push(obj)
      }
    }
  }
  
  // Efficient array operations
  binarySearch(arr, target, compareFn) {
    let left = 0
    let right = arr.length - 1
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const comparison = compareFn(arr[mid], target)
      
      if (comparison === 0) return mid
      if (comparison < 0) left = mid + 1
      else right = mid - 1
    }
    
    return -1
  }
  
  // Batch operations
  batchProcess(items, batchSize, processFn) {
    return new Promise((resolve) => {
      let index = 0
      const results = []
      
      const processBatch = () => {
        const batch = items.slice(index, index + batchSize)
        const batchResults = batch.map(processFn)
        results.push(...batchResults)
        
        index += batchSize
        
        if (index < items.length) {
          // Use setTimeout to prevent blocking
          setTimeout(processBatch, 0)
        } else {
          resolve(results)
        }
      }
      
      processBatch()
    })
  }
}

// Usage in pages
Page({
  onLoad() {
    this.dataManager = new OptimizedDataManager()
    
    // Create object pool for list items
    this.itemPool = this.dataManager.createObjectPool(
      () => ({ id: null, title: '', data: null }),
      (obj) => { obj.id = null; obj.title = ''; obj.data = null }
    )
  },
  
  async processLargeDataSet(items) {
    // Process in batches to prevent blocking
    const results = await this.dataManager.batchProcess(
      items,
      100, // Process 100 items at a time
      (item) => this.processItem(item)
    )
    
    this.setData({ processedItems: results })
  }
})
```

## 🌐 Network Optimization

### Request Optimization

```javascript
// Network performance optimization
class NetworkOptimizer {
  constructor() {
    this.requestQueue = []
    this.activeRequests = new Set()
    this.maxConcurrentRequests = 3
    this.cache = new Map()
    this.retryConfig = {
      maxRetries: 3,
      baseDelay: 1000,
      maxDelay: 10000
    }
  }
  
  // Request deduplication
  async request(options) {
    const key = this.generateRequestKey(options)
    
    // Check if same request is already in progress
    if (this.activeRequests.has(key)) {
      return this.waitForActiveRequest(key)
    }
    
    // Check cache
    if (this.shouldUseCache(options)) {
      const cached = this.cache.get(key)
      if (cached && !this.isCacheExpired(cached)) {
        return cached.data
      }
    }
    
    return this.executeRequest(key, options)
  }
  
  generateRequestKey(options) {
    return `${options.method || 'GET'}:${options.url}:${JSON.stringify(options.data || {})}`
  }
  
  async executeRequest(key, options) {
    this.activeRequests.add(key)
    
    try {
      const response = await this.requestWithRetry(options)
      
      // Cache successful responses
      if (this.shouldCache(options, response)) {
        this.cache.set(key, {
          data: response,
          timestamp: Date.now(),
          ttl: options.cacheTTL || 300000 // 5 minutes default
        })
      }
      
      return response
    } finally {
      this.activeRequests.delete(key)
    }
  }
  
  async requestWithRetry(options) {
    let lastError
    
    for (let attempt = 0; attempt <= this.retryConfig.maxRetries; attempt++) {
      try {
        return await this.makeRequest(options)
      } catch (error) {
        lastError = error
        
        if (attempt < this.retryConfig.maxRetries && this.shouldRetry(error)) {
          const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(2, attempt),
            this.retryConfig.maxDelay
          )
          await this.sleep(delay)
        }
      }
    }
    
    throw lastError
  }
  
  makeRequest(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(new Error(`HTTP ${res.statusCode}`))
          }
        },
        fail: reject
      })
    })
  }
  
  shouldRetry(error) {
    // Retry on network errors and 5xx status codes
    return error.message.includes('network') || 
           error.message.includes('timeout') ||
           error.message.includes('HTTP 5')
  }
  
  shouldUseCache(options) {
    return options.method === 'GET' && options.useCache !== false
  }
  
  shouldCache(options, response) {
    return options.method === 'GET' && response && options.noCache !== true
  }
  
  isCacheExpired(cached) {
    return Date.now() - cached.timestamp > cached.ttl
  }
  
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  // Request batching
  batchRequests(requests) {
    return Promise.all(
      requests.map(request => this.request(request))
    )
  }
  
  // Preload critical resources
  preloadResources(urls) {
    urls.forEach(url => {
      this.request({
        url,
        method: 'GET',
        useCache: true,
        cacheTTL: 600000 // 10 minutes
      }).catch(error => {
        console.warn('Preload failed:', url, error)
      })
    })
  }
}

// Usage
const networkOptimizer = new NetworkOptimizer()

Page({
  async loadData() {
    try {
      // Batch multiple requests
      const [userData, configData, contentData] = await networkOptimizer.batchRequests([
        { url: '/api/user', useCache: true },
        { url: '/api/config', useCache: true, cacheTTL: 3600000 },
        { url: '/api/content', useCache: false }
      ])
      
      this.setData({
        userData,
        configData,
        contentData
      })
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  },
  
  onLoad() {
    // Preload critical resources
    networkOptimizer.preloadResources([
      '/api/config',
      '/api/user/preferences',
      '/api/common/data'
    ])
  }
})
```

## 🖼️ Image Optimization

### Image Loading Optimization

```javascript
// Image optimization strategies
class ImageOptimizer {
  constructor() {
    this.imageCache = new Map()
    this.loadingImages = new Set()
    this.lazyLoadObserver = null
    this.setupLazyLoading()
  }
  
  setupLazyLoading() {
    // Simulate intersection observer for lazy loading
    this.lazyLoadObserver = {
      observe: (element) => {
        // Implementation would depend on scroll position
        this.checkVisibility(element)
      },
      unobserve: (element) => {
        // Remove from observation
      }
    }
  }
  
  // Lazy loading implementation
  lazyLoadImage(src, placeholder = '/images/placeholder.png') {
    return new Promise((resolve, reject) => {
      // Return placeholder immediately
      resolve(placeholder)
      
      // Load actual image in background
      this.preloadImage(src).then(() => {
        resolve(src)
      }).catch(reject)
    })
  }
  
  preloadImage(src) {
    if (this.imageCache.has(src)) {
      return Promise.resolve(src)
    }
    
    if (this.loadingImages.has(src)) {
      return this.waitForImageLoad(src)
    }
    
    this.loadingImages.add(src)
    
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: src,
        success: (res) => {
          if (res.statusCode === 200) {
            this.imageCache.set(src, res.tempFilePath)
            this.loadingImages.delete(src)
            resolve(res.tempFilePath)
          } else {
            this.loadingImages.delete(src)
            reject(new Error(`Failed to load image: ${res.statusCode}`))
          }
        },
        fail: (error) => {
          this.loadingImages.delete(src)
          reject(error)
        }
      })
    })
  }
  
  // Image compression
  compressImage(filePath, quality = 0.8) {
    return new Promise((resolve, reject) => {
      wx.compressImage({
        src: filePath,
        quality: Math.floor(quality * 100),
        success: resolve,
        fail: reject
      })
    })
  }
  
  // Generate responsive image URLs
  getResponsiveImageUrl(baseUrl, width, height, quality = 80) {
    const params = new URLSearchParams({
      w: width,
      h: height,
      q: quality,
      f: 'webp' // Use WebP format if supported
    })
    
    return `${baseUrl}?${params.toString()}`
  }
  
  // Image format optimization
  getOptimalImageFormat(originalUrl) {
    const systemInfo = wx.getSystemInfoSync()
    
    // Check WebP support
    if (this.supportsWebP(systemInfo)) {
      return originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    }
    
    return originalUrl
  }
  
  supportsWebP(systemInfo) {
    // Check if system supports WebP
    const { platform, version } = systemInfo
    
    if (platform === 'ios') {
      return this.compareVersion(version, '14.0.0') >= 0
    } else if (platform === 'android') {
      return this.compareVersion(version, '4.0.0') >= 0
    }
    
    return false
  }
  
  compareVersion(version1, version2) {
    const v1 = version1.split('.').map(Number)
    const v2 = version2.split('.').map(Number)
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0
      const num2 = v2[i] || 0
      
      if (num1 > num2) return 1
      if (num1 < num2) return -1
    }
    
    return 0
  }
  
  // Batch image preloading
  preloadImages(urls, concurrency = 3) {
    return new Promise((resolve) => {
      const results = []
      let completed = 0
      let index = 0
      
      const loadNext = () => {
        if (index >= urls.length) {
          if (completed === urls.length) {
            resolve(results)
          }
          return
        }
        
        const url = urls[index++]
        
        this.preloadImage(url)
          .then((result) => {
            results.push({ url, success: true, result })
          })
          .catch((error) => {
            results.push({ url, success: false, error })
          })
          .finally(() => {
            completed++
            if (completed === urls.length) {
              resolve(results)
            } else {
              loadNext()
            }
          })
      }
      
      // Start concurrent loading
      for (let i = 0; i < Math.min(concurrency, urls.length); i++) {
        loadNext()
      }
    })
  }
}

// Usage in components
Component({
  data: {
    imageSrc: '/images/placeholder.png',
    imageLoaded: false
  },
  
  lifetimes: {
    attached() {
      this.imageOptimizer = new ImageOptimizer()
      this.loadImage()
    }
  },
  
  methods: {
    async loadImage() {
      const { src, width, height } = this.properties
      
      try {
        // Get responsive image URL
        const responsiveUrl = this.imageOptimizer.getResponsiveImageUrl(
          src, width, height
        )
        
        // Get optimal format
        const optimizedUrl = this.imageOptimizer.getOptimalImageFormat(responsiveUrl)
        
        // Lazy load image
        const imageSrc = await this.imageOptimizer.lazyLoadImage(optimizedUrl)
        
        this.setData({
          imageSrc,
          imageLoaded: true
        })
      } catch (error) {
        console.error('Failed to load image:', error)
        this.setData({
          imageSrc: '/images/error-placeholder.png',
          imageLoaded: true
        })
      }
    },
    
    onImageLoad() {
      this.triggerEvent('imageload')
    },
    
    onImageError() {
      this.setData({
        imageSrc: '/images/error-placeholder.png'
      })
      this.triggerEvent('imageerror')
    }
  }
})
```

## 📦 Code Splitting

### Dynamic Import Implementation

```javascript
// Dynamic component loading
class ComponentLoader {
  constructor() {
    this.loadedComponents = new Map()
    this.loadingComponents = new Set()
  }
  
  async loadComponent(componentPath) {
    if (this.loadedComponents.has(componentPath)) {
      return this.loadedComponents.get(componentPath)
    }
    
    if (this.loadingComponents.has(componentPath)) {
      return this.waitForComponent(componentPath)
    }
    
    this.loadingComponents.add(componentPath)
    
    try {
      // Simulate dynamic import
      const component = await this.importComponent(componentPath)
      this.loadedComponents.set(componentPath, component)
      this.loadingComponents.delete(componentPath)
      return component
    } catch (error) {
      this.loadingComponents.delete(componentPath)
      throw error
    }
  }
  
  async importComponent(componentPath) {
    // This would be implemented based on your bundling strategy
    return new Promise((resolve, reject) => {
      // Load component definition
      wx.request({
        url: `/components/${componentPath}.js`,
        success: (res) => {
          try {
            // Evaluate component code
            const component = eval(res.data)
            resolve(component)
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
  }
  
  waitForComponent(componentPath) {
    return new Promise((resolve, reject) => {
      const checkLoaded = () => {
        if (this.loadedComponents.has(componentPath)) {
          resolve(this.loadedComponents.get(componentPath))
        } else if (!this.loadingComponents.has(componentPath)) {
          reject(new Error('Component loading failed'))
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
    })
  }
  
  // Preload components
  preloadComponents(componentPaths) {
    componentPaths.forEach(path => {
      this.loadComponent(path).catch(error => {
        console.warn('Failed to preload component:', path, error)
      })
    })
  }
}

// Route-based code splitting
class RouteManager {
  constructor() {
    this.routes = new Map()
    this.componentLoader = new ComponentLoader()
  }
  
  registerRoute(path, componentPath, preload = false) {
    this.routes.set(path, {
      componentPath,
      preload,
      loaded: false
    })
    
    if (preload) {
      this.componentLoader.preloadComponents([componentPath])
    }
  }
  
  async navigateToRoute(path, options = {}) {
    const route = this.routes.get(path)
    
    if (!route) {
      throw new Error(`Route not found: ${path}`)
    }
    
    // Load component if not already loaded
    if (!route.loaded) {
      await this.componentLoader.loadComponent(route.componentPath)
      route.loaded = true
    }
    
    // Navigate to page
    wx.navigateTo({
      url: path,
      ...options
    })
  }
}

// Usage
const routeManager = new RouteManager()

// Register routes with lazy loading
routeManager.registerRoute('/pages/profile/profile', 'profile-page')
routeManager.registerRoute('/pages/settings/settings', 'settings-page', true) // Preload

// Navigate with lazy loading
routeManager.navigateToRoute('/pages/profile/profile')
```

## 📊 Performance Monitoring

### Performance Metrics Collection

```javascript
// Performance monitoring system
class PerformanceMonitor {
  constructor() {
    this.metrics = []
    this.observers = []
    this.startTime = Date.now()
    this.setupMonitoring()
  }
  
  setupMonitoring() {
    // Monitor page load times
    this.monitorPageLoads()
    
    // Monitor memory usage
    this.monitorMemoryUsage()
    
    // Monitor network requests
    this.monitorNetworkRequests()
    
    // Monitor user interactions
    this.monitorUserInteractions()
  }
  
  monitorPageLoads() {
    const originalPage = Page
    const self = this
    
    Page = function(options) {
      const originalOnLoad = options.onLoad
      const originalOnReady = options.onReady
      const originalOnShow = options.onShow
      
      options.onLoad = function(query) {
        const startTime = Date.now()
        this._performanceStartTime = startTime
        
        if (originalOnLoad) {
          originalOnLoad.call(this, query)
        }
      }
      
      options.onReady = function() {
        const loadTime = Date.now() - this._performanceStartTime
        
        self.recordMetric('page_load_time', {
          page: this.route,
          duration: loadTime,
          timestamp: Date.now()
        })
        
        if (originalOnReady) {
          originalOnReady.call(this)
        }
      }
      
      options.onShow = function() {
        self.recordMetric('page_show', {
          page: this.route,
          timestamp: Date.now()
        })
        
        if (originalOnShow) {
          originalOnShow.call(this)
        }
      }
      
      return originalPage(options)
    }
  }
  
  monitorMemoryUsage() {
    setInterval(() => {
      try {
        const memoryInfo = wx.getSystemInfoSync()
        
        this.recordMetric('memory_usage', {
          available: memoryInfo.memorySize,
          timestamp: Date.now()
        })
      } catch (error) {
        console.error('Failed to get memory info:', error)
      }
    }, 30000) // Every 30 seconds
  }
  
  monitorNetworkRequests() {
    const originalRequest = wx.request
    const self = this
    
    wx.request = function(options) {
      const startTime = Date.now()
      const originalSuccess = options.success
      const originalFail = options.fail
      
      options.success = function(res) {
        const duration = Date.now() - startTime
        
        self.recordMetric('network_request', {
          url: options.url,
          method: options.method || 'GET',
          status: res.statusCode,
          duration,
          success: true,
          timestamp: Date.now()
        })
        
        if (originalSuccess) {
          originalSuccess(res)
        }
      }
      
      options.fail = function(error) {
        const duration = Date.now() - startTime
        
        self.recordMetric('network_request', {
          url: options.url,
          method: options.method || 'GET',
          duration,
          success: false,
          error: error.errMsg,
          timestamp: Date.now()
        })
        
        if (originalFail) {
          originalFail(error)
        }
      }
      
      return originalRequest(options)
    }
  }
  
  monitorUserInteractions() {
    // Monitor tap events
    this.monitorTapEvents()
    
    // Monitor scroll performance
    this.monitorScrollPerformance()
  }
  
  monitorTapEvents() {
    // This would require hooking into the event system
    // Implementation depends on your framework
  }
  
  monitorScrollPerformance() {
    let scrollStartTime = 0
    let frameCount = 0
    
    const onScroll = () => {
      if (scrollStartTime === 0) {
        scrollStartTime = Date.now()
        frameCount = 0
      }
      
      frameCount++
      
      // Calculate FPS after scroll ends
      setTimeout(() => {
        if (Date.now() - scrollStartTime > 100) {
          const duration = Date.now() - scrollStartTime
          const fps = (frameCount / duration) * 1000
          
          this.recordMetric('scroll_performance', {
            fps,
            duration,
            frameCount,
            timestamp: Date.now()
          })
          
          scrollStartTime = 0
        }
      }, 100)
    }
    
    // This would be attached to scroll views
    // Implementation depends on your specific setup
  }
  
  recordMetric(type, data) {
    this.metrics.push({
      type,
      data,
      timestamp: Date.now()
    })
    
    // Send metrics periodically
    if (this.metrics.length >= 50) {
      this.sendMetrics()
    }
  }
  
  async sendMetrics() {
    if (this.metrics.length === 0) return
    
    const metricsToSend = [...this.metrics]
    this.metrics = []
    
    try {
      await wx.request({
        url: 'https://analytics.example.com/metrics',
        method: 'POST',
        data: {
          appId: getApp().globalData.appId,
          version: getApp().globalData.version,
          metrics: metricsToSend
        }
      })
    } catch (error) {
      console.error('Failed to send metrics:', error)
      // Re-add metrics to queue
      this.metrics.unshift(...metricsToSend)
    }
  }
  
  // Performance analysis
  analyzePerformance() {
    const analysis = {
      pageLoadTimes: this.analyzePageLoadTimes(),
      networkPerformance: this.analyzeNetworkPerformance(),
      memoryUsage: this.analyzeMemoryUsage(),
      userExperience: this.analyzeUserExperience()
    }
    
    return analysis
  }
  
  analyzePageLoadTimes() {
    const pageLoadMetrics = this.metrics.filter(m => m.type === 'page_load_time')
    
    if (pageLoadMetrics.length === 0) return null
    
    const loadTimes = pageLoadMetrics.map(m => m.data.duration)
    const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length
    const maxLoadTime = Math.max(...loadTimes)
    const minLoadTime = Math.min(...loadTimes)
    
    return {
      average: avgLoadTime,
      max: maxLoadTime,
      min: minLoadTime,
      count: loadTimes.length,
      slowPages: pageLoadMetrics
        .filter(m => m.data.duration > 3000)
        .map(m => m.data.page)
    }
  }
  
  analyzeNetworkPerformance() {
    const networkMetrics = this.metrics.filter(m => m.type === 'network_request')
    
    if (networkMetrics.length === 0) return null
    
    const successRate = networkMetrics.filter(m => m.data.success).length / networkMetrics.length
    const avgResponseTime = networkMetrics
      .map(m => m.data.duration)
      .reduce((a, b) => a + b, 0) / networkMetrics.length
    
    return {
      successRate,
      averageResponseTime: avgResponseTime,
      totalRequests: networkMetrics.length,
      slowRequests: networkMetrics
        .filter(m => m.data.duration > 5000)
        .map(m => ({ url: m.data.url, duration: m.data.duration }))
    }
  }
  
  analyzeMemoryUsage() {
    const memoryMetrics = this.metrics.filter(m => m.type === 'memory_usage')
    
    if (memoryMetrics.length === 0) return null
    
    const memoryValues = memoryMetrics.map(m => m.data.available)
    const avgMemory = memoryValues.reduce((a, b) => a + b, 0) / memoryValues.length
    
    return {
      average: avgMemory,
      trend: this.calculateTrend(memoryValues)
    }
  }
  
  analyzeUserExperience() {
    const scrollMetrics = this.metrics.filter(m => m.type === 'scroll_performance')
    
    if (scrollMetrics.length === 0) return null
    
    const avgFPS = scrollMetrics
      .map(m => m.data.fps)
      .reduce((a, b) => a + b, 0) / scrollMetrics.length
    
    return {
      averageFPS: avgFPS,
      smoothScrollPercentage: scrollMetrics.filter(m => m.data.fps >= 30).length / scrollMetrics.length
    }
  }
  
  calculateTrend(values) {
    if (values.length < 2) return 'stable'
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2))
    const secondHalf = values.slice(Math.floor(values.length / 2))
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    
    const change = (secondAvg - firstAvg) / firstAvg
    
    if (change > 0.1) return 'increasing'
    if (change < -0.1) return 'decreasing'
    return 'stable'
  }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor()

// Usage in app.js
App({
  onLaunch() {
    // Start performance monitoring
    performanceMonitor.setupMonitoring()
  },
  
  onHide() {
    // Send metrics when app goes to background
    performanceMonitor.sendMetrics()
  }
})
```

## 🎯 Best Practices

### Performance Optimization Checklist

```markdown
## Startup Performance
- [ ] Minimize app.js initialization code
- [ ] Defer non-critical operations
- [ ] Use lazy loading for pages and components
- [ ] Optimize first page load time
- [ ] Preload critical resources

## Runtime Performance
- [ ] Batch setData operations
- [ ] Use partial updates for large objects
- [ ] Implement virtual scrolling for long lists
- [ ] Debounce frequent operations
- [ ] Optimize component rendering

## Memory Management
- [ ] Clean up timers and listeners
- [ ] Implement object pooling
- [ ] Use weak references where appropriate
- [ ] Clear large data structures when not needed
- [ ] Monitor memory usage

## Network Optimization
- [ ] Implement request caching
- [ ] Use request deduplication
- [ ] Batch multiple requests
- [ ] Implement retry mechanisms
- [ ] Preload critical data

## Image Optimization
- [ ] Use appropriate image formats
- [ ] Implement lazy loading
- [ ] Compress images
- [ ] Use responsive images
- [ ] Cache images locally

## Code Optimization
- [ ] Split code by routes
- [ ] Remove unused code
- [ ] Minimize bundle size
- [ ] Use tree shaking
- [ ] Optimize dependencies
```

### Performance Testing

```javascript
// Performance testing utilities
class PerformanceTester {
  static async testPageLoadTime(pagePath, iterations = 5) {
    const results = []
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now()
      
      await new Promise((resolve) => {
        wx.navigateTo({
          url: pagePath,
          success: () => {
            // Wait for page to be ready
            setTimeout(() => {
              const loadTime = Date.now() - startTime
              results.push(loadTime)
              
              wx.navigateBack({
                success: resolve
              })
            }, 100)
          }
        })
      })
    }
    
    return {
      average: results.reduce((a, b) => a + b, 0) / results.length,
      min: Math.min(...results),
      max: Math.max(...results),
      results
    }
  }
  
  static async testScrollPerformance(scrollViewSelector, duration = 5000) {
    return new Promise((resolve) => {
      let frameCount = 0
      const startTime = Date.now()
      
      const countFrames = () => {
        frameCount++
        if (Date.now() - startTime < duration) {
          requestAnimationFrame(countFrames)
        } else {
          const fps = (frameCount / duration) * 1000
          resolve({ fps, frameCount, duration })
        }
      }
      
      // Start scrolling simulation
      this.simulateScroll(scrollViewSelector)
      countFrames()
    })
  }
  
  static simulateScroll(selector) {
    // Simulate scroll events
    // Implementation would depend on your testing framework
  }
  
  static async testMemoryUsage(testFunction, duration = 10000) {
    const startMemory = this.getCurrentMemoryUsage()
    const memorySnapshots = [startMemory]
    
    const memoryInterval = setInterval(() => {
      memorySnapshots.push(this.getCurrentMemoryUsage())
    }, 1000)
    
    // Run test function
    await testFunction()
    
    // Wait for specified duration
    await new Promise(resolve => setTimeout(resolve, duration))
    
    clearInterval(memoryInterval)
    
    const endMemory = this.getCurrentMemoryUsage()
    
    return {
      startMemory,
      endMemory,
      memoryLeak: endMemory - startMemory,
      snapshots: memorySnapshots,
      peakMemory: Math.max(...memorySnapshots)
    }
  }
  
  static getCurrentMemoryUsage() {
    try {
      const systemInfo = wx.getSystemInfoSync()
      return systemInfo.memorySize || 0
    } catch (error) {
      return 0
    }
  }
  
  static async runPerformanceTest(testName, testFunction) {
    console.log(`Starting performance test: ${testName}`)
    const startTime = Date.now()
    
    try {
      const result = await testFunction()
      const duration = Date.now() - startTime
      
      console.log(`Performance test completed: ${testName}`)
      console.log(`Duration: ${duration}ms`)
      console.log('Result:', result)
      
      return { success: true, duration, result }
    } catch (error) {
      const duration = Date.now() - startTime
      
      console.error(`Performance test failed: ${testName}`)
      console.error(`Duration: ${duration}ms`)
      console.error('Error:', error)
      
      return { success: false, duration, error }
    }
  }
}

// Usage
async function runPerformanceTests() {
  // Test page load performance
  const pageLoadResult = await PerformanceTester.runPerformanceTest(
    'Page Load Time',
    () => PerformanceTester.testPageLoadTime('/pages/home/home')
  )
  
  // Test memory usage
  const memoryResult = await PerformanceTester.runPerformanceTest(
    'Memory Usage',
    () => PerformanceTester.testMemoryUsage(async () => {
      // Simulate heavy operations
      for (let i = 0; i < 1000; i++) {
        await new Promise(resolve => setTimeout(resolve, 10))
      }
    })
  )
  
  // Test scroll performance
  const scrollResult = await PerformanceTester.runPerformanceTest(
    'Scroll Performance',
    () => PerformanceTester.testScrollPerformance('#scroll-view')
  )
  
  return {
    pageLoad: pageLoadResult,
    memory: memoryResult,
    scroll: scrollResult
  }
}
```

---

Performance optimization is crucial for providing excellent user experience in mini programs. Implement these strategies systematically, monitor performance metrics continuously, and test regularly to ensure optimal performance across different devices and network conditions.
