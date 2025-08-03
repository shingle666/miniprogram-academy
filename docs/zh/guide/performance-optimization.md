# 性能优化

性能优化是小程序开发中的重要环节，直接影响用户体验和应用的成功。本章将详细介绍小程序性能优化的各个方面，包括启动优化、渲染优化、内存优化等。

## 启动性能优化

### 代码包大小优化

#### 1. 代码分包

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"
  ],
  "subpackages": [
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

#### 2. 资源优化

```javascript
// 图片资源优化
const optimizeImage = {
  // 使用 WebP 格式
  useWebP: function(imagePath) {
    const systemInfo = wx.getSystemInfoSync()
    const supportWebP = systemInfo.platform !== 'ios' || 
                       parseFloat(systemInfo.system.split(' ')[1]) >= 14
    
    return supportWebP ? imagePath.replace(/\.(jpg|png)$/, '.webp') : imagePath
  },
  
  // 根据屏幕密度选择合适的图片
  getOptimalImage: function(basePath, density = 1) {
    const systemInfo = wx.getSystemInfoSync()
    const pixelRatio = systemInfo.pixelRatio
    
    if (pixelRatio >= 3) {
      return `${basePath}@3x.jpg`
    } else if (pixelRatio >= 2) {
      return `${basePath}@2x.jpg`
    } else {
      return `${basePath}.jpg`
    }
  }
}
```

#### 3. 代码压缩和混淆

```json
// project.config.json
{
  "setting": {
    "es6": true,
    "postcss": true,
    "minified": true,
    "newFeature": true,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "enableEngineNative": false,
    "useIsolateContext": true,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "disableUseStrict": false,
    "minifyWXML": true,
    "showES6CompileOption": false,
    "useCompilerPlugins": false
  }
}
```

### 首屏渲染优化

#### 1. 关键路径优化

```javascript
Page({
  data: {
    // 只包含首屏必需的数据
    criticalData: {},
    // 非关键数据延迟加载
    nonCriticalData: null
  },
  
  onLoad: function() {
    // 立即加载关键数据
    this.loadCriticalData()
    
    // 延迟加载非关键数据
    setTimeout(() => {
      this.loadNonCriticalData()
    }, 100)
  },
  
  loadCriticalData: function() {
    // 加载首屏必需的数据
    this.setData({
      criticalData: {
        title: '首页',
        banners: []
      }
    })
  },
  
  loadNonCriticalData: function() {
    // 加载非首屏数据
    wx.request({
      url: '/api/non-critical-data',
      success: res => {
        this.setData({
          nonCriticalData: res.data
        })
      }
    })
  }
})
```

#### 2. 骨架屏

```xml
<!-- 骨架屏模板 -->
<view wx:if="{{loading}}" class="skeleton">
  <view class="skeleton-header">
    <view class="skeleton-avatar"></view>
    <view class="skeleton-content">
      <view class="skeleton-title"></view>
      <view class="skeleton-subtitle"></view>
    </view>
  </view>
  
  <view class="skeleton-list">
    <view wx:for="{{[1,2,3,4,5]}}" wx:key="*this" class="skeleton-item">
      <view class="skeleton-image"></view>
      <view class="skeleton-text"></view>
    </view>
  </view>
</view>

<!-- 实际内容 -->
<view wx:else class="content">
  <!-- 真实内容 -->
</view>
```

```css
/* 骨架屏样式 */
.skeleton-avatar,
.skeleton-title,
.skeleton-subtitle,
.skeleton-image,
.skeleton-text {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.skeleton-title {
  height: 32rpx;
  width: 60%;
  margin-bottom: 16rpx;
}

.skeleton-subtitle {
  height: 24rpx;
  width: 40%;
}
```

## 渲染性能优化

### setData 优化

#### 1. 减少 setData 调用频率

```javascript
Page({
  data: {
    list: [],
    user: {},
    config: {}
  },
  
  // 不好的做法 - 多次调用 setData
  updateDataBad: function() {
    this.setData({
      'user.name': 'John'
    })
    this.setData({
      'user.age': 25
    })
    this.setData({
      'config.theme': 'dark'
    })
  },
  
  // 好的做法 - 批量更新
  updateDataGood: function() {
    this.setData({
      'user.name': 'John',
      'user.age': 25,
      'config.theme': 'dark'
    })
  },
  
  // 使用队列批量处理
  setupBatchUpdate: function() {
    this.updateQueue = []
    this.updateTimer = null
  },
  
  batchSetData: function(data) {
    this.updateQueue.push(data)
    
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
    }
    
    this.updateTimer = setTimeout(() => {
      const mergedData = Object.assign({}, ...this.updateQueue)
      this.setData(mergedData)
      this.updateQueue = []
      this.updateTimer = null
    }, 16) // 约 60fps
  }
})
```

#### 2. 减少 setData 数据量

```javascript
Page({
  data: {
    list: [],
    displayList: []
  },
  
  // 不好的做法 - 传递大量数据
  updateListBad: function(newList) {
    this.setData({
      list: newList // 可能包含大量不需要渲染的数据
    })
  },
  
  // 好的做法 - 只传递渲染需要的数据
  updateListGood: function(newList) {
    const displayList = newList.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image
      // 只包含渲染需要的字段
    }))
    
    this.setData({
      displayList: displayList
    })
    
    // 完整数据存储在页面实例中
    this.fullList = newList
  },
  
  // 局部更新
  updateSingleItem: function(index, newItem) {
    this.setData({
      [`displayList[${index}]`]: {
        id: newItem.id,
        title: newItem.title,
        image: newItem.image
      }
    })
  }
})
```

### 长列表优化

#### 1. 虚拟列表

```javascript
// 虚拟列表组件
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
  
  observers: {
    'items, containerHeight, itemHeight': function() {
      this.calculateVisibleItems()
    }
  },
  
  methods: {
    calculateVisibleItems: function() {
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
    
    onScroll: function(e) {
      const scrollTop = e.detail.scrollTop
      this.setData({ scrollTop })
      
      // 节流处理
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer)
      }
      
      this.scrollTimer = setTimeout(() => {
        this.calculateVisibleItems()
      }, 16)
    }
  }
})
```

#### 2. 分页加载

```javascript
Page({
  data: {
    list: [],
    page: 1,
    pageSize: 20,
    hasMore: true,
    loading: false
  },
  
  onLoad: function() {
    this.loadData()
  },
  
  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore()
    }
  },
  
  loadData: function() {
    this.setData({ loading: true })
    
    wx.request({
      url: '/api/list',
      data: {
        page: this.data.page,
        pageSize: this.data.pageSize
      },
      success: res => {
        const newList = res.data.list
        const hasMore = newList.length === this.data.pageSize
        
        this.setData({
          list: this.data.page === 1 ? newList : [...this.data.list, ...newList],
          hasMore: hasMore,
          loading: false
        })
      },
      fail: () => {
        this.setData({ loading: false })
      }
    })
  },
  
  loadMore: function() {
    this.setData({
      page: this.data.page + 1
    })
    this.loadData()
  },
  
  onPullDownRefresh: function() {
    this.setData({
      page: 1,
      list: [],
      hasMore: true
    })
    this.loadData()
    wx.stopPullDownRefresh()
  }
})
```

### 图片优化

#### 1. 图片懒加载

```xml
<image 
  wx:for="{{imageList}}" 
  wx:key="id"
  src="{{item.src}}" 
  lazy-load="{{true}}"
  mode="aspectFill"
  class="lazy-image"
  bindload="onImageLoad"
  binderror="onImageError">
</image>
```

```javascript
Page({
  onImageLoad: function(e) {
    console.log('图片加载成功')
  },
  
  onImageError: function(e) {
    console.log('图片加载失败')
    // 可以设置默认图片
    const index = e.currentTarget.dataset.index
    this.setData({
      [`imageList[${index}].src`]: '/images/default.png'
    })
  }
})
```

#### 2. 图片预加载

```javascript
Page({
  preloadImages: function(imageUrls) {
    const preloadPromises = imageUrls.map(url => {
      return new Promise((resolve, reject) => {
        const image = wx.createImage()
        image.onload = () => resolve(url)
        image.onerror = () => reject(url)
        image.src = url
      })
    })
    
    Promise.allSettled(preloadPromises).then(results => {
      const successCount = results.filter(r => r.status === 'fulfilled').length
      console.log(`预加载完成: ${successCount}/${imageUrls.length}`)
    })
  }
})
```

## 内存优化

### 内存泄漏防护

#### 1. 定时器清理

```javascript
Page({
  data: {
    timer: null,
    intervalTimer: null
  },
  
  onLoad: function() {
    // 设置定时器
    const timer = setTimeout(() => {
      console.log('定时器执行')
    }, 5000)
    
    const intervalTimer = setInterval(() => {
      console.log('间隔定时器执行')
    }, 1000)
    
    this.setData({
      timer: timer,
      intervalTimer: intervalTimer
    })
  },
  
  onUnload: function() {
    // 清理定时器
    if (this.data.timer) {
      clearTimeout(this.data.timer)
    }
    
    if (this.data.intervalTimer) {
      clearInterval(this.data.intervalTimer)
    }
  }
})
```

#### 2. 事件监听器清理

```javascript
Page({
  onLoad: function() {
    // 绑定全局事件
    wx.onNetworkStatusChange(this.handleNetworkChange)
    wx.onMemoryWarning(this.handleMemoryWarning)
  },
  
  onUnload: function() {
    // 移除事件监听
    wx.offNetworkStatusChange(this.handleNetworkChange)
    wx.offMemoryWarning(this.handleMemoryWarning)
  },
  
  handleNetworkChange: function(res) {
    console.log('网络状态变化:', res.isConnected)
  },
  
  handleMemoryWarning: function(res) {
    console.log('内存警告:', res.level)
    // 清理不必要的数据
    this.clearCache()
  },
  
  clearCache: function() {
    // 清理缓存数据
    this.setData({
      cachedData: null,
      tempImages: []
    })
  }
})
```

#### 3. 大数据处理

```javascript
Page({
  data: {
    largeDataset: []
  },
  
  processLargeData: function(data) {
    // 分批处理大数据
    const batchSize = 100
    const batches = []
    
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize))
    }
    
    this.processBatches(batches, 0)
  },
  
  processBatches: function(batches, index) {
    if (index >= batches.length) {
      console.log('数据处理完成')
      return
    }
    
    const batch = batches[index]
    const processedBatch = batch.map(item => this.processItem(item))
    
    // 更新数据
    this.setData({
      [`largeDataset[${index}]`]: processedBatch
    })
    
    // 使用 setTimeout 避免阻塞主线程
    setTimeout(() => {
      this.processBatches(batches, index + 1)
    }, 0)
  },
  
  processItem: function(item) {
    // 处理单个数据项
    return {
      ...item,
      processed: true
    }
  }
})
```

## 网络优化

### 请求优化

#### 1. 请求合并

```javascript
// 请求管理器
class RequestManager {
  constructor() {
    this.pendingRequests = new Map()
    this.requestQueue = []
    this.isProcessing = false
  }
  
  // 合并相同的请求
  request(options) {
    const key = this.generateKey(options)
    
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)
    }
    
    const promise = new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: res => {
          this.pendingRequests.delete(key)
          resolve(res)
        },
        fail: err => {
          this.pendingRequests.delete(key)
          reject(err)
        }
      })
    })
    
    this.pendingRequests.set(key, promise)
    return promise
  }
  
  // 批量请求
  batchRequest(requestList) {
    return Promise.all(requestList.map(options => this.request(options)))
  }
  
  generateKey(options) {
    return `${options.method || 'GET'}_${options.url}_${JSON.stringify(options.data || {})}`
  }
}

const requestManager = new RequestManager()
export default requestManager
```

#### 2. 缓存策略

```javascript
// 缓存管理器
class CacheManager {
  constructor() {
    this.cache = new Map()
    this.maxSize = 50
    this.ttl = 5 * 60 * 1000 // 5分钟
  }
  
  set(key, data, ttl = this.ttl) {
    // 清理过期缓存
    this.cleanup()
    
    // 如果缓存已满，删除最旧的项
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, {
      data: data,
      timestamp: Date.now(),
      ttl: ttl
    })
  }
  
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) {
      return null
    }
    
    // 检查是否过期
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
  
  clear() {
    this.cache.clear()
  }
}

const cacheManager = new CacheManager()

// 带缓存的请求函数
function requestWithCache(options, useCache = true) {
  const cacheKey = `${options.url}_${JSON.stringify(options.data || {})}`
  
  if (useCache) {
    const cachedData = cacheManager.get(cacheKey)
    if (cachedData) {
      return Promise.resolve(cachedData)
    }
  }
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: res => {
        if (useCache && res.statusCode === 200) {
          cacheManager.set(cacheKey, res)
        }
        resolve(res)
      },
      fail: reject
    })
  })
}
```

### 预加载策略

```javascript
Page({
  onLoad: function() {
    // 预加载下一页可能需要的数据
    this.preloadNextPageData()
  },
  
  preloadNextPageData: function() {
    // 预测用户可能访问的页面
    const likelyPages = ['/pages/detail/detail', '/pages/profile/profile']
    
    likelyPages.forEach(page => {
      this.preloadPageData(page)
    })
  },
  
  preloadPageData: function(page) {
    // 根据页面预加载相应数据
    switch (page) {
      case '/pages/detail/detail':
        this.preloadDetailData()
        break
      case '/pages/profile/profile':
        this.preloadProfileData()
        break
    }
  },
  
  preloadDetailData: function() {
    requestWithCache({
      url: '/api/detail/popular',
      method: 'GET'
    }).then(res => {
      console.log('详情页数据预加载完成')
    }).catch(err => {
      console.log('详情页数据预加载失败:', err)
    })
  }
})
```

## 性能监控

### 性能指标收集

```javascript
// 性能监控工具
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = []
  }
  
  // 监控页面加载时间
  measurePageLoad(pageName) {
    const startTime = Date.now()
    
    return {
      end: () => {
        const loadTime = Date.now() - startTime
        this.recordMetric('page_load_time', loadTime, { page: pageName })
        return loadTime
      }
    }
  }
  
  // 监控接口响应时间
  measureApiResponse(apiName) {
    const startTime = Date.now()
    
    return {
      end: (success = true) => {
        const responseTime = Date.now() - startTime
        this.recordMetric('api_response_time', responseTime, { 
          api: apiName, 
          success: success 
        })
        return responseTime
      }
    }
  }
  
  // 监控内存使用
  measureMemoryUsage() {
    wx.getPerformance().getEntriesByType('memory').forEach(entry => {
      this.recordMetric('memory_usage', entry.usedJSHeapSize, {
        total: entry.totalJSHeapSize,
        limit: entry.jsHeapSizeLimit
      })
    })
  }
  
  // 记录性能指标
  recordMetric(name, value, tags = {}) {
    const metric = {
      name: name,
      value: value,
      tags: tags,
      timestamp: Date.now()
    }
    
    this.metrics[name] = this.metrics[name] || []
    this.metrics[name].push(metric)
    
    // 通知观察者
    this.observers.forEach(observer => {
      observer(metric)
    })
    
    // 上报性能数据
    this.reportMetric(metric)
  }
  
  // 上报性能数据
  reportMetric(metric) {
    // 批量上报，避免频繁请求
    if (!this.reportQueue) {
      this.reportQueue = []
    }
    
    this.reportQueue.push(metric)
    
    if (this.reportQueue.length >= 10) {
      this.flushReports()
    }
  }
  
  flushReports() {
    if (this.reportQueue.length === 0) return
    
    wx.request({
      url: 'https://your-analytics-server.com/performance',
      method: 'POST',
      data: {
        metrics: this.reportQueue
      },
      success: () => {
        console.log('性能数据上报成功')
      },
      fail: (err) => {
        console.error('性能数据上报失败:', err)
      }
    })
    
    this.reportQueue = []
  }
  
  // 添加观察者
  addObserver(observer) {
    this.observers.push(observer)
  }
  
  // 获取性能报告
  getReport() {
    const report = {}
    
    Object.keys(this.metrics).forEach(metricName => {
      const values = this.metrics[metricName].map(m => m.value)
      report[metricName] = {
        count: values.length,
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values)
      }
    })
    
    return report
  }
}

const performanceMonitor = new PerformanceMonitor()
export default performanceMonitor
```

### 在应用中使用性能监控

```javascript
import performanceMonitor from '../../utils/performance-monitor'

Page({
  onLoad: function() {
    // 开始监控页面加载
    this.pageLoadMonitor = performanceMonitor.measurePageLoad('index')
    
    // 加载数据
    this.loadData()
  },
  
  onReady: function() {
    // 结束页面加载监控
    const loadTime = this.pageLoadMonitor.end()
    console.log(`页面加载时间: ${loadTime}ms`)
  },
  
  loadData: function() {
    // 开始监控接口响应
    const apiMonitor = performanceMonitor.measureApiResponse('getUserData')
    
    wx.request({
      url: '/api/user/data',
      success: res => {
        apiMonitor.end(true)
        this.setData({
          userData: res.data
        })
      },
      fail: err => {
        apiMonitor.end(false)
        console.error('数据加载失败:', err)
      }
    })
  },
  
  onShow: function() {
    // 监控内存使用
    performanceMonitor.measureMemoryUsage()
  }
})
```

## 性能测试

### 自动化性能测试

```javascript
// 性能测试工具
class PerformanceTest {
  constructor() {
    this.testResults = []
  }
  
  // 测试页面加载性能
  async testPageLoad(pagePath, iterations = 5) {
    const results = []
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now()
      
      // 模拟页面加载
      await this.simulatePageLoad(pagePath)
      
      const loadTime = Date.now() - startTime
      results.push(loadTime)
    }
    
    const avgLoadTime = results.reduce((a, b) => a + b, 0) / results.length
    
    this.testResults.push({
      test: 'page_load',
      page: pagePath,
      avgTime: avgLoadTime,
      results: results
    })
    
    return avgLoadTime
  }
  
  // 测试接口性能
  async testApiPerformance(apiUrl, iterations = 10) {
    const results = []
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now()
      
      try {
        await this.makeRequest(apiUrl)
        const responseTime = Date.now() - startTime
        results.push(responseTime)
      } catch (error) {
        console.error('API测试失败:', error)
      }
    }
    
    const avgResponseTime = results.reduce((a, b) => a + b, 0) / results.length
    
    this.testResults.push({
      test: 'api_performance',
      api: apiUrl,
      avgTime: avgResponseTime,
      results: results
    })
    
    return avgResponseTime
  }
  
  // 生成测试报告
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      tests: this.testResults,
      summary: {
        totalTests: this.testResults.length,
        avgPageLoadTime: this.calculateAverage('page_load'),
        avgApiResponseTime: this.calculateAverage('api_performance')
      }
    }
    
    console.log('性能测试报告:', report)
    return report
  }
  
  calculateAverage(testType) {
    const tests = this.testResults.filter(t => t.test === testType)
    if (tests.length === 0) return 0
    
    const totalTime = tests.reduce((sum, test) => sum + test.avgTime, 0)
    return totalTime / tests.length
  }
  
  simulatePageLoad(pagePath) {
    return new Promise(resolve => {
      // 模拟页面加载过程
      setTimeout(resolve, Math.random() * 100 + 50)
    })
  }
  
  makeRequest(url) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        success: resolve,
        fail: reject
      })
    })
  }
}

// 使用示例
const performanceTest = new PerformanceTest()

// 在开发环境中运行性能测试
if (process.env.NODE_ENV === 'development') {
  performanceTest.testPageLoad('/pages/index/index')
    .then(avgTime => {
      console.log(`首页平均加载时间: ${avgTime}ms`)
    })
  
  performanceTest.testApiPerformance('/api/user/info')
    .then(avgTime => {
      console.log(`用户信息接口平均响应时间: ${avgTime}ms`)
    })
}
```

## 最佳实践总结

### 1. 启动优化清单

```javascript
// 启动优化检查清单
const startupOptimizationChecklist = {
  codePackage: {
    // 代码包大小控制
    mainPackageSize: '< 2MB',
    subpackageSize: '< 2MB each',
    totalSize: '< 20MB',
    
    // 资源优化
    imageOptimization: 'WebP format, appropriate resolution',
    codeMinification: 'ES6 transpilation, code compression',
    unusedCodeRemoval: 'Tree shaking, dead code elimination'
  },
  
  firstScreen: {
    // 首屏渲染
    criticalDataOnly: 'Load essential data first',
    skeletonScreen: 'Show loading placeholder',
    lazyLoading: 'Defer non-critical resources',
    preloading: 'Preload likely-needed resources'
  },
  
  caching: {
    // 缓存策略
    staticResources: 'Cache images, fonts, etc.',
    apiResponses: 'Cache frequently accessed data',
    localStorage: 'Store user preferences'
  }
}
```

### 2. 渲染优化清单

```javascript
const renderOptimizationChecklist = {
  setData: {
    // setData 优化
    batchUpdates: 'Combine multiple setData calls',
    minimalData: 'Only pass necessary data',
    partialUpdates: 'Use object path for specific updates',
    avoidFrequentCalls: 'Throttle or debounce updates'
  },
  
  listRendering: {
    // 列表渲染优化
    virtualScrolling: 'For very long lists',
    pagination: 'Load data in chunks',
    lazyLoading: 'Load images on demand',
    recycling: 'Reuse list item components'
  },
  
  imageOptimization: {
    // 图片优化
    appropriateFormat: 'WebP for modern browsers',
    correctSize: 'Match display dimensions',
    lazyLoading: 'Load images when needed',
    placeholder: 'Show loading state'
  }
}
```

### 3. 内存优化清单

```javascript
const memoryOptimizationChecklist = {
  leakPrevention: {
    // 内存泄漏防护
    timerCleanup: 'Clear timers in onUnload',
    eventListenerCleanup: 'Remove global listeners',
    circularReferences: 'Avoid circular object references',
    largeDataHandling: 'Process large datasets in chunks'
  },
  
  dataManagement: {
    // 数据管理
    cacheSize: 'Limit cache size and TTL',
    dataStructure: 'Use efficient data structures',
    garbageCollection: 'Help GC by nullifying references',
    memoryMonitoring: 'Monitor memory usage'
  }
}
```

### 4. 网络优化清单

```javascript
const networkOptimizationChecklist = {
  requestOptimization: {
    // 请求优化
    requestMerging: 'Combine similar requests',
    caching: 'Cache responses appropriately',
    compression: 'Enable gzip compression',
    cdn: 'Use CDN for static resources'
  },
  
  loadingStrategy: {
    // 加载策略
    criticalFirst: 'Load critical resources first',
    preloading: 'Preload likely-needed resources',
    lazyLoading: 'Defer non-critical resources',
    progressiveLoading: 'Show content as it loads'
  }
}
```

## 性能优化工具

### 1. 性能分析工具

```javascript
// 性能分析工具
class PerformanceAnalyzer {
  constructor() {
    this.startTime = Date.now()
    this.checkpoints = []
  }
  
  checkpoint(name) {
    const now = Date.now()
    this.checkpoints.push({
      name: name,
      time: now,
      elapsed: now - this.startTime
    })
  }
  
  analyze() {
    console.log('性能分析报告:')
    this.checkpoints.forEach((checkpoint, index) => {
      const prevTime = index > 0 ? this.checkpoints[index - 1].time : this.startTime
      const duration = checkpoint.time - prevTime
      
      console.log(`${checkpoint.name}: ${duration}ms (总计: ${checkpoint.elapsed}ms)`)
    })
  }
}

// 使用示例
const analyzer = new PerformanceAnalyzer()

Page({
  onLoad: function() {
    analyzer.checkpoint('页面开始加载')
    this.loadData()
  },
  
  loadData: function() {
    analyzer.checkpoint('开始加载数据')
    
    wx.request({
      url: '/api/data',
      success: res => {
        analyzer.checkpoint('数据加载完成')
        this.processData(res.data)
      }
    })
  },
  
  processData: function(data) {
    analyzer.checkpoint('开始处理数据')
    // 数据处理逻辑
    analyzer.checkpoint('数据处理完成')
    
    this.setData({
      data: data
    })
    
    analyzer.checkpoint('页面渲染完成')
    analyzer.analyze()
  }
})
```

### 2. 自动化优化建议

```javascript
// 自动化优化建议工具
class OptimizationAdvisor {
  constructor() {
    this.suggestions = []
  }
  
  analyzeSetDataUsage(page) {
    const setDataCalls = this.getSetDataCalls(page)
    
    if (setDataCalls.length > 10) {
      this.suggestions.push({
        type: 'performance',
        severity: 'high',
        message: `页面 ${page} 调用了 ${setDataCalls.length} 次 setData，建议合并调用`,
        solution: '使用批量更新或队列机制减少 setData 调用次数'
      })
    }
  }
  
  analyzeImageUsage(images) {
    images.forEach(image => {
      if (image.size > 500 * 1024) { // 500KB
        this.suggestions.push({
          type: 'resource',
          severity: 'medium',
          message: `图片 ${image.src} 大小为 ${Math.round(image.size / 1024)}KB，建议优化`,
          solution: '压缩图片或使用 WebP 格式'
        })
      }
    })
  }
  
  analyzeMemoryUsage(memoryInfo) {
    const usageRatio = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit
    
    if (usageRatio > 0.8) {
      this.suggestions.push({
        type: 'memory',
        severity: 'high',
        message: `内存使用率达到 ${Math.round(usageRatio * 100)}%，存在内存泄漏风险`,
        solution: '检查定时器清理、事件监听器移除和大对象引用'
      })
    }
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalSuggestions: this.suggestions.length,
      highSeverity: this.suggestions.filter(s => s.severity === 'high').length,
      mediumSeverity: this.suggestions.filter(s => s.severity === 'medium').length,
      lowSeverity: this.suggestions.filter(s => s.severity === 'low').length,
      suggestions: this.suggestions
    }
    
    console.log('优化建议报告:', report)
    return report
  }
  
  getSetDataCalls(page) {
    // 模拟获取 setData 调用次数
    return Array(Math.floor(Math.random() * 20)).fill(null)
  }
}
```

## 总结

小程序性能优化是一个系统性工程，需要从多个维度进行优化：

1. **启动性能** - 通过代码分包、资源优化、首屏优化等手段提升启动速度
2. **渲染性能** - 优化 setData 使用、实现长列表优化、图片懒加载等
3. **内存管理** - 防止内存泄漏、合理管理数据结构、监控内存使用
4. **网络优化** - 请求合并、缓存策略、预加载机制等
5. **性能监控** - 建立完善的性能监控体系，持续优化

通过系统性的性能优化，可以显著提升小程序的用户体验，提高用户留存率和满意度。性能优化是一个持续的过程，需要在开发过程中不断关注和改进。
