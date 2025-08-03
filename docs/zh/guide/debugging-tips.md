# 调试技巧

调试是小程序开发过程中的重要环节，掌握有效的调试技巧能够大大提高开发效率。本章将介绍小程序调试的各种方法和工具。

## 开发者工具调试

### 基础调试功能

#### 1. 控制台调试

```javascript
Page({
  onLoad: function() {
    // 基础日志输出
    console.log('页面加载')
    console.info('信息日志')
    console.warn('警告信息')
    console.error('错误信息')
    
    // 对象和数组调试
    const user = { name: '张三', age: 25 }
    console.log('用户信息:', user)
    
    // 表格形式显示数据
    const users = [
      { id: 1, name: '张三', age: 25 },
      { id: 2, name: '李四', age: 30 }
    ]
    console.table(users)
    
    // 分组日志
    console.group('用户操作')
    console.log('点击按钮')
    console.log('发送请求')
    console.groupEnd()
    
    // 计时器
    console.time('数据处理')
    this.processData()
    console.timeEnd('数据处理')
  },
  
  processData: function() {
    // 模拟数据处理
    for (let i = 0; i < 1000; i++) {
      // 处理逻辑
    }
  }
})
```

#### 2. 断点调试

```javascript
Page({
  data: {
    list: []
  },
  
  onLoad: function() {
    this.loadData()
  },
  
  loadData: function() {
    // 在这里设置断点
    debugger; // 程序会在此处暂停
    
    wx.request({
      url: '/api/list',
      success: res => {
        // 在这里也可以设置断点
        debugger;
        
        console.log('接收到数据:', res.data)
        this.setData({
          list: res.data
        })
      },
      fail: err => {
        debugger; // 调试错误情况
        console.error('请求失败:', err)
      }
    })
  },
  
  handleItemClick: function(e) {
    const id = e.currentTarget.dataset.id
    
    // 条件断点 - 只在特定条件下暂停
    if (id === 'special-item') {
      debugger;
    }
    
    console.log('点击项目:', id)
  }
})
```

### 网络请求调试

#### 1. 网络面板使用

```javascript
Page({
  onLoad: function() {
    // 发送多个请求进行调试
    this.loadUserInfo()
    this.loadUserPosts()
    this.loadUserFriends()
  },
  
  loadUserInfo: function() {
    wx.request({
      url: '/api/user/info',
      method: 'GET',
      header: {
        'Authorization': 'Bearer token123'
      },
      success: res => {
        console.log('用户信息:', res)
      },
      fail: err => {
        console.error('用户信息加载失败:', err)
      }
    })
  },
  
  loadUserPosts: function() {
    wx.request({
      url: '/api/user/posts',
      method: 'GET',
      data: {
        page: 1,
        limit: 10
      },
      success: res => {
        console.log('用户帖子:', res)
      }
    })
  },
  
  submitForm: function(formData) {
    wx.request({
      url: '/api/form/submit',
      method: 'POST',
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: res => {
        console.log('表单提交成功:', res)
      },
      fail: err => {
        console.error('表单提交失败:', err)
        // 在网络面板中可以查看具体的错误信息
      }
    })
  }
})
```

#### 2. 请求拦截和模拟

```javascript
// utils/request-interceptor.js
class RequestInterceptor {
  constructor() {
    this.originalRequest = wx.request
    this.mockData = new Map()
    this.interceptors = []
  }
  
  // 添加请求拦截器
  addInterceptor(interceptor) {
    this.interceptors.push(interceptor)
  }
  
  // 添加模拟数据
  addMockData(url, data) {
    this.mockData.set(url, data)
  }
  
  // 启用拦截
  enable() {
    const self = this
    
    wx.request = function(options) {
      // 执行拦截器
      let modifiedOptions = options
      self.interceptors.forEach(interceptor => {
        modifiedOptions = interceptor(modifiedOptions) || modifiedOptions
      })
      
      // 检查是否有模拟数据
      if (self.mockData.has(options.url)) {
        const mockResponse = self.mockData.get(options.url)
        console.log(`[MOCK] ${options.url}:`, mockResponse)
        
        setTimeout(() => {
          if (options.success) {
            options.success({
              data: mockResponse,
              statusCode: 200,
              header: {}
            })
          }
        }, Math.random() * 1000 + 500) // 模拟网络延迟
        
        return
      }
      
      // 执行原始请求
      return self.originalRequest.call(wx, modifiedOptions)
    }
  }
  
  // 禁用拦截
  disable() {
    wx.request = this.originalRequest
  }
}

// 使用示例
const requestInterceptor = new RequestInterceptor()

// 添加请求日志拦截器
requestInterceptor.addInterceptor(options => {
  console.log(`[REQUEST] ${options.method || 'GET'} ${options.url}`, options.data)
  return options
})

// 添加模拟数据
requestInterceptor.addMockData('/api/user/info', {
  id: 1,
  name: '测试用户',
  email: 'test@example.com'
})

// 在开发环境启用
if (process.env.NODE_ENV === 'development') {
  requestInterceptor.enable()
}

export default requestInterceptor
```

### 存储调试

#### 1. 本地存储调试

```javascript
// utils/storage-debugger.js
class StorageDebugger {
  constructor() {
    this.originalSetStorage = wx.setStorage
    this.originalGetStorage = wx.getStorage
    this.originalRemoveStorage = wx.removeStorage
    this.originalClearStorage = wx.clearStorage
  }
  
  enable() {
    const self = this
    
    // 拦截 setStorage
    wx.setStorage = function(options) {
      console.log(`[STORAGE SET] ${options.key}:`, options.data)
      return self.originalSetStorage.call(wx, options)
    }
    
    // 拦截 getStorage
    wx.getStorage = function(options) {
      const originalSuccess = options.success
      options.success = function(res) {
        console.log(`[STORAGE GET] ${options.key}:`, res.data)
        if (originalSuccess) originalSuccess(res)
      }
      
      const originalFail = options.fail
      options.fail = function(err) {
        console.log(`[STORAGE GET FAIL] ${options.key}:`, err)
        if (originalFail) originalFail(err)
      }
      
      return self.originalGetStorage.call(wx, options)
    }
    
    // 拦截 removeStorage
    wx.removeStorage = function(options) {
      console.log(`[STORAGE REMOVE] ${options.key}`)
      return self.originalRemoveStorage.call(wx, options)
    }
    
    // 拦截 clearStorage
    wx.clearStorage = function(options = {}) {
      console.log('[STORAGE CLEAR] 清空所有存储')
      return self.originalClearStorage.call(wx, options)
    }
  }
  
  disable() {
    wx.setStorage = this.originalSetStorage
    wx.getStorage = this.originalGetStorage
    wx.removeStorage = this.originalRemoveStorage
    wx.clearStorage = this.originalClearStorage
  }
  
  // 查看所有存储的数据
  viewAllStorage() {
    wx.getStorageInfo({
      success: res => {
        console.log('存储信息:', res)
        
        res.keys.forEach(key => {
          wx.getStorage({
            key: key,
            success: data => {
              console.log(`${key}:`, data.data)
            }
          })
        })
      }
    })
  }
}

const storageDebugger = new StorageDebugger()
export default storageDebugger
```

## 真机调试

### 远程调试

#### 1. 真机调试配置

```javascript
// app.js
App({
  onLaunch: function() {
    // 获取系统信息用于调试
    const systemInfo = wx.getSystemInfoSync()
    console.log('系统信息:', systemInfo)
    
    // 真机环境检测
    if (systemInfo.platform === 'devtools') {
      console.log('当前运行在开发者工具中')
      this.setupDevToolsDebugging()
    } else {
      console.log('当前运行在真机上')
      this.setupRealDeviceDebugging()
    }
  },
  
  setupDevToolsDebugging: function() {
    // 开发者工具特有的调试设置
    wx.setEnableDebug({
      enableDebug: true
    })
  },
  
  setupRealDeviceDebugging: function() {
    // 真机调试设置
    this.setupRemoteLogging()
    this.setupErrorReporting()
  },
  
  setupRemoteLogging: function() {
    // 重写 console 方法，将日志发送到远程服务器
    const originalLog = console.log
    const originalError = console.error
    
    console.log = function(...args) {
      originalLog.apply(console, args)
      this.sendLogToServer('log', args)
    }.bind(this)
    
    console.error = function(...args) {
      originalError.apply(console, args)
      this.sendLogToServer('error', args)
    }.bind(this)
  },
  
  sendLogToServer: function(level, args) {
    const logData = {
      level: level,
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '),
      timestamp: new Date().toISOString(),
      userAgent: wx.getSystemInfoSync()
    }
    
    wx.request({
      url: 'https://your-log-server.com/logs',
      method: 'POST',
      data: logData,
      fail: err => {
        // 避免无限循环，不使用 console.error
      }
    })
  },
  
  setupErrorReporting: function() {
    wx.onError(error => {
      this.reportError('runtime_error', error)
    })
    
    wx.onUnhandledRejection(res => {
      this.reportError('unhandled_rejection', res.reason)
    })
  },
  
  reportError: function(type, error) {
    const errorData = {
      type: type,
      message: error.message || String(error),
      stack: error.stack || '',
      timestamp: new Date().toISOString(),
      userAgent: wx.getSystemInfoSync(),
      page: getCurrentPages().pop()?.route || 'unknown'
    }
    
    wx.request({
      url: 'https://your-error-server.com/errors',
      method: 'POST',
      data: errorData
    })
  }
})
```

#### 2. vConsole 集成

```javascript
// utils/vconsole.js
class VConsoleManager {
  constructor() {
    this.enabled = false
  }
  
  init() {
    // 在真机上启用 vConsole
    const systemInfo = wx.getSystemInfoSync()
    
    if (systemInfo.platform !== 'devtools') {
      this.enable()
    }
  }
  
  enable() {
    if (this.enabled) return
    
    // 创建 vConsole 按钮
    this.createToggleButton()
    this.enabled = true
  }
  
  createToggleButton() {
    // 创建悬浮按钮用于显示/隐藏调试面板
    const button = wx.createOffscreenCanvas({
      type: '2d',
      width: 100,
      height: 50
    })
    
    // 这里可以实现自定义的调试面板
    this.createDebugPanel()
  }
  
  createDebugPanel() {
    // 创建调试面板的逻辑
    console.log('调试面板已启用')
  }
  
  log(message, data) {
    console.log(`[DEBUG] ${message}`, data)
    
    // 可以将日志显示在自定义面板中
    this.addToDebugPanel('log', message, data)
  }
  
  error(message, error) {
    console.error(`[DEBUG] ${message}`, error)
    this.addToDebugPanel('error', message, error)
  }
  
  addToDebugPanel(type, message, data) {
    // 添加到调试面板的逻辑
  }
}

const vConsole = new VConsoleManager()
export default vConsole
```

### 性能调试

#### 1. 性能监控

```javascript
// utils/performance-debugger.js
class PerformanceDebugger {
  constructor() {
    this.metrics = []
    this.observers = []
  }
  
  startMonitoring() {
    this.monitorPagePerformance()
    this.monitorMemoryUsage()
    this.monitorNetworkRequests()
  }
  
  monitorPagePerformance() {
    // 监控页面性能
    const originalPage = Page
    const self = this
    
    Page = function(options) {
      const originalOnLoad = options.onLoad
      const originalOnShow = options.onShow
      const originalOnReady = options.onReady
      
      options.onLoad = function(...args) {
        const startTime = Date.now()
        self.recordMetric('page_load_start', { page: this.route })
        
        if (originalOnLoad) {
          originalOnLoad.apply(this, args)
        }
        
        const loadTime = Date.now() - startTime
        self.recordMetric('page_load_time', { 
          page: this.route, 
          duration: loadTime 
        })
      }
      
      options.onReady = function(...args) {
        self.recordMetric('page_ready', { page: this.route })
        
        if (originalOnReady) {
          originalOnReady.apply(this, args)
        }
      }
      
      return originalPage(options)
    }
  }
  
  monitorMemoryUsage() {
    setInterval(() => {
      wx.getPerformance().getEntriesByType('memory').forEach(entry => {
        this.recordMetric('memory_usage', {
          used: entry.usedJSHeapSize,
          total: entry.totalJSHeapSize,
          limit: entry.jsHeapSizeLimit
        })
      })
    }, 5000)
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
          duration: duration,
          status: res.statusCode,
          success: true
        })
        
        if (originalSuccess) originalSuccess(res)
      }
      
      options.fail = function(err) {
        const duration = Date.now() - startTime
        self.recordMetric('network_request', {
          url: options.url,
          method: options.method || 'GET',
          duration: duration,
          success: false,
          error: err
        })
        
        if (originalFail) originalFail(err)
      }
      
      return originalRequest.call(wx, options)
    }
  }
  
  recordMetric(name, data) {
    const metric = {
      name: name,
      data: data,
      timestamp: Date.now()
    }
    
    this.metrics.push(metric)
    
    // 通知观察者
    this.observers.forEach(observer => observer(metric))
    
    // 保持最近1000条记录
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }
  
  addObserver(observer) {
    this.observers.push(observer)
  }
  
  getMetrics(name) {
    return this.metrics.filter(metric => metric.name === name)
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalMetrics: this.metrics.length,
      metricTypes: [...new Set(this.metrics.map(m => m.name))],
      summary: this.generateSummary()
    }
    
    console.log('性能调试报告:', report)
    return report
  }
  
  generateSummary() {
    const summary = {}
    
    // 页面加载时间统计
    const pageLoadMetrics = this.getMetrics('page_load_time')
    if (pageLoadMetrics.length > 0) {
      const loadTimes = pageLoadMetrics.map(m => m.data.duration)
      summary.pageLoad = {
        count: loadTimes.length,
        avg: loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length,
        min: Math.min(...loadTimes),
        max: Math.max(...loadTimes)
      }
    }
    
    // 网络请求统计
    const networkMetrics = this.getMetrics('network_request')
    if (networkMetrics.length > 0) {
      const successCount = networkMetrics.filter(m => m.data.success).length
      const durations = networkMetrics.map(m => m.data.duration)
      
      summary.network = {
        totalRequests: networkMetrics.length,
        successRate: (successCount / networkMetrics.length * 100).toFixed(2) + '%',
        avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length
      }
    }
    
    return summary
  }
}

const performanceDebugger = new PerformanceDebugger()
export default performanceDebugger
```

## 常见问题调试

### 数据绑定问题

#### 1. setData 调试

```javascript
Page({
  data: {
    user: {
      name: '',
      age: 0
    },
    list: []
  },
  
  onLoad: function() {
    this.setupSetDataDebugging()
  },
  
  setupSetDataDebugging: function() {
    const originalSetData = this.setData
    
    this.setData = function(data, callback) {
      console.group('setData 调用')
      console.log('更新数据:', data)
      console.log('更新前状态:', JSON.parse(JSON.stringify(this.data)))
      
      const result = originalSetData.call(this, data, () => {
        console.log('更新后状态:', JSON.parse(JSON.stringify(this.data)))
        console.groupEnd()
        
        if (callback) callback()
      })
      
      return result
    }
  },
  
  updateUser: function() {
    // 测试数据更新
    this.setData({
      'user.name': '张三',
      'user.age': 25
    })
  },
  
  // 调试复杂数据更新
  updateComplexData: function() {
    const newList = [
      { id: 1, title: '项目1' },
      { id: 2, title: '项目2' }
    ]
    
    console.log('准备更新列表数据')
    this.setData({
      list: newList,
      'user.name': '李四'
    })
  }
})
```

#### 2. 数据流追踪

```javascript
// utils/data-flow-debugger.js
class DataFlowDebugger {
  constructor() {
    this.dataHistory = []
    this.maxHistorySize = 100
  }
  
  trackDataFlow(page) {
    const originalSetData = page.setData
    const self = this
    
    page.setData = function(data, callback) {
      // 记录数据变更历史
      const snapshot = {
        timestamp: Date.now(),
        page: this.route || 'unknown',
        changes: data,
        beforeState: JSON.parse(JSON.stringify(this.data)),
        stackTrace: new Error().stack
      }
      
      self.dataHistory.push(snapshot)
      
      // 限制历史记录大小
      if (self.dataHistory.length > self.maxHistorySize) {
        self.dataHistory = self.dataHistory.slice(-self.maxHistorySize)
      }
      
      console.log('数据流变更:', snapshot)
      
      return originalSetData.call(this, data, callback)
    }
  }
  
  getDataHistory(pageRoute) {
    if (pageRoute) {
      return this.dataHistory.filter(item => item.page === pageRoute)
    }
    return this.dataHistory
  }
  
  analyzeDataFlow() {
    const analysis = {
      totalChanges: this.dataHistory.length,
      pageStats: {},
      frequentChanges: {}
    }
    
    // 按页面统计
    this.dataHistory.forEach(item => {
      if (!analysis.pageStats[item.page]) {
        analysis.pageStats[item.page] = 0
      }
      analysis.pageStats[item.page]++
      
      // 统计频繁变更的字段
      Object.keys(item.changes).forEach(key => {
        if (!analysis.frequentChanges[key]) {
          analysis.frequentChanges[key] = 0
        }
        analysis.frequentChanges[key]++
      })
    })
    
    console.log('数据流分析:', analysis)
    return analysis
  }
}

const dataFlowDebugger = new DataFlowDebugger()
export default dataFlowDebugger
```

### 事件处理调试

#### 1. 事件流追踪

```javascript
// utils/event-debugger.js
class EventDebugger {
  constructor() {
    this.eventHistory = []
    this.enabled = false
  }
  
  enable() {
    if (this.enabled) return
    
    this.interceptTouchEvents()
    this.interceptCustomEvents()
    this.enabled = true
  }
  
  interceptTouchEvents() {
    const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'tap', 'longpress']
    
    touchEvents.forEach(eventType => {
      this.interceptEvent(eventType)
    })
  }
  
  interceptEvent(eventType) {
    // 这里需要在页面级别进行拦截
    console.log(`开始拦截 ${eventType} 事件`)
  }
  
  logEvent(eventType, target, detail) {
    const eventLog = {
      type: eventType,
      target: target,
      detail: detail,
      timestamp: Date.now(),
      page: getCurrentPages().pop()?.route || 'unknown'
    }
    
    this.eventHistory.push(eventLog)
    console.log('事件触发:', eventLog)
    
    // 保持最近500个事件
    if (this.eventHistory.length > 500) {
      this.eventHistory = this.eventHistory.slice(-500)
    }
  }
  
  getEventHistory(eventType) {
    if (eventType) {
      return this.eventHistory.filter(event => event.type === eventType)
    }
    return this.eventHistory
  }
  
  analyzeEvents() {
    const analysis = {
      totalEvents: this.eventHistory.length,
      eventTypes: {},
      pageEvents: {},
      recentEvents: this.eventHistory.slice(-10)
    }
    
    this.eventHistory.forEach(event => {
      // 按事件类型统计
      if (!analysis.eventTypes[event.type]) {
        analysis.eventTypes[event.type] = 0
      }
      analysis.eventTypes[event.type]++
      
      // 按页面统计
      if (!analysis.pageEvents[event.page]) {
        analysis.pageEvents[event.page] = 0
      }
      analysis.pageEvents[event.page]++
    })
    
    console.log('事件分析:', analysis)
    return analysis
  }
}

const eventDebugger = new EventDebugger()
export default eventDebugger
```

### 网络请求调试

#### 1. 请求响应分析

```javascript
// utils/network-debugger.js
class NetworkDebugger {
  constructor() {
    this.requests = []
    this.enabled = false
  }
  
  enable() {
    if (this.enabled) return
    
    this.interceptRequests()
    this.enabled = true
  }
  
  interceptRequests() {
    const originalRequest = wx.request
    const self = this
    
    wx.request = function(options) {
      const requestId = Date.now() + Math.random()
      const startTime = Date.now()
      
      const requestLog = {
        id: requestId,
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        header: options.header,
        startTime: startTime,
        endTime: null,
        duration: null,
        response: null,
        error: null,
        success: false
      }
      
      console.group(`[REQUEST] ${requestLog.method} ${requestLog.url}`)
      console.log('请求参数:', options.data)
      console.log('请求头:', options.header)
      
      const originalSuccess = options.success
      const originalFail = options.fail
      
      options.success = function(res) {
        requestLog.endTime = Date.now()
        requestLog.duration = requestLog.endTime - requestLog.startTime
        requestLog.response = res
        requestLog.success = true
        
        console.log('响应状态:', res.statusCode)
        console.log('响应数据:', res.data)
        console.log('响应时间:', requestLog.duration + 'ms')
        console.groupEnd()
        
        self.requests.push(requestLog)
        
        if (originalSuccess) originalSuccess(res)
      }
      
      options.fail = function(err) {
        requestLog.endTime = Date.now()
        requestLog.duration = requestLog.endTime - requestLog.startTime
        requestLog.error = err
        requestLog.success = false
        
        console.error('请求失败:', err)
        console.log('失败时间:', requestLog.duration + 'ms')
        console.groupEnd()
        
        self.requests.push(requestLog)
        
        if (originalFail) originalFail(err)
      }
      
      return originalRequest.call(wx, options)
    }
  }
  
  getRequests(filter) {
    if (!filter) return this.requests
    
    return this.requests.filter(request => {
      if (filter.url && !request.url.includes(filter.url)) return false
      if (filter.method && request.method !== filter.method) return false
      if (filter.success !== undefined && request.success !== filter.success) return false
      return true
    })
  }
  
  analyzeRequests() {
    const analysis = {
      totalRequests: this.requests.length,
      successCount: this.requests.filter(r => r.success).length,
      failCount: this.requests.filter(r => !r.success).length,
      avgDuration: 0,
      slowRequests: [],
      failedRequests: []
    }
    
    if (this.requests.length > 0) {
      const durations = this.requests.map(r => r.duration).filter(d => d !== null)
      analysis.avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length
      
      // 找出慢请求（超过2秒）
      analysis.slowRequests = this.requests.filter(r => r.duration > 2000)
      
      // 找出失败请求
      analysis.failedRequests = this.requests.filter(r => !r.success)
    }
    
    console.log('网络请求分析:', analysis)
    return analysis
  }
  
  exportRequests() {
    const exportData = {
      timestamp: new Date().toISOString(),
      requests: this.requests,
      analysis: this.analyzeRequests()
    }
    
    console.log('导出网络请求数据:', exportData)
    return exportData
  }
}

const networkDebugger = new NetworkDebugger()
export default networkDebugger
```

## 调试工具集成

### 统一调试管理器

```javascript
// utils/debug-manager.js
import vConsole from './vconsole'
import performanceDebugger from './performance-debugger'
import dataFlowDebugger from './data-flow-debugger'
import eventDebugger from './event-debugger'
import networkDebugger from './network-debugger'
import storageDebugger from './storage-debugger'

class DebugManager {
  constructor() {
    this.debuggers = {
      vConsole: vConsole,
      performance: performanceDebugger,
      dataFlow: dataFlowDebugger,
      event: eventDebugger,
      network: networkDebugger,
      storage: storageDebugger
    }
    
    this.enabled = false
    this.config = {
      enableVConsole: true,
      enablePerformanceMonitoring: true,
      enableDataFlowTracking: true,
      enableEventTracking: true,
      enableNetworkDebugging: true,
      enableStorageDebugging: true
    }
  }
  
  init(config = {}) {
    this.config = { ...this.config, ...config }
    
    // 根据环境决定是否启用调试
    const systemInfo = wx.getSystemInfoSync()
    const isDevelopment = systemInfo.platform === 'devtools' || 
                         process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      this.enable()
    }
  }
  
  enable() {
    if (this.enabled) return
    
    console.log('启用调试模式')
    
    // 启用各个调试器
    if (this.config.enableVConsole) {
      this.debuggers.vConsole.init()
    }
    
    if (this.config.enablePerformanceMonitoring) {
      this.debuggers.performance.startMonitoring()
    }
    
    if (this.config.enableNetworkDebugging) {
      this.debuggers.network.enable()
    }
    
    if (this.config.enableStorageDebugging) {
      this.debuggers.storage.enable()
    }
    
    if (this.config.enableEventTracking) {
      this.debuggers.event.enable()
    }
    
    this.enabled = true
    
    // 添加全局调试方法
    this.addGlobalDebugMethods()
  }
  
  disable() {
    if (!this.enabled) return
    
    console.log('禁用调试模式')
    
    // 禁用各个调试器
    Object.values(this.debuggers).forEach(debugger => {
      if (debugger.disable) {
        debugger.disable()
      }
    })
    
    this.enabled = false
  }
  
  addGlobalDebugMethods() {
    // 添加全局调试方法到 wx 对象
    wx.debug = {
      // 查看性能报告
      performance: () => {
        return this.debuggers.performance.generateReport()
      },
      
      // 查看网络请求
      network: (filter) => {
        return this.debuggers.network.getRequests(filter)
      },
      
      // 查看数据流
      dataFlow: (pageRoute) => {
        return this.debuggers.dataFlow.getDataHistory(pageRoute)
      },
      
      // 查看事件历史
      events: (eventType) => {
        return this.debuggers.event.getEventHistory(eventType)
      },
      
      // 查看存储数据
      storage: () => {
        this.debuggers.storage.viewAllStorage()
      },
      
      // 生成完整调试报告
      report: () => {
        return this.generateFullReport()
      }
    }
    
    console.log('全局调试方法已添加到 wx.debug')
  }
  
  generateFullReport() {
    const report = {
      timestamp: new Date().toISOString(),
      systemInfo: wx.getSystemInfoSync(),
      performance: this.debuggers.performance.generateReport(),
      network: this.debuggers.network.analyzeRequests(),
      dataFlow: this.debuggers.dataFlow.analyzeDataFlow(),
      events: this.debuggers.event.analyzeEvents()
    }
    
    console.log('完整调试报告:', report)
    return report
  }
  
  // 页面级调试设置
  setupPageDebugging(page) {
    if (!this.enabled) return
    
    // 设置数据流追踪
    if (this.config.enableDataFlowTracking) {
      this.debuggers.dataFlow.trackDataFlow(page)
    }
    
    // 添加页面级调试方法
    page.debug = {
      data: () => page.data,
      setData: (data) => {
        console.log('手动 setData:', data)
        page.setData(data)
      },
      route: () => page.route || 'unknown'
    }
  }
}

const debugManager = new DebugManager()
export default debugManager
```

### 在应用中使用调试管理器

```javascript
// app.js
import debugManager from './utils/debug-manager'

App({
  onLaunch: function() {
    // 初始化调试管理器
    debugManager.init({
      enableVConsole: true,
      enablePerformanceMonitoring: true,
      enableDataFlowTracking: true,
      enableEventTracking: true,
      enableNetworkDebugging: true,
      enableStorageDebugging: true
    })
  }
})
```

```javascript
// 页面中使用
import debugManager from '../../utils/debug-manager'

Page({
  onLoad: function() {
    // 设置页面调试
    debugManager.setupPageDebugging(this)
    
    // 现在可以使用 this.debug 进行调试
    console.log('当前页面数据:', this.debug.data())
  },
  
  onShow: function() {
    // 使用全局调试方法
    if (wx.debug) {
      console.log('性能报告:', wx.debug.performance())
    }
  }
})
```

## 调试最佳实践

### 1. 分层调试策略

```javascript
// 分层调试配置
const debugConfig = {
  // 开发环境 - 全量调试
  development: {
    console: true,
    network: true,
    performance: true,
    storage: true,
    events: true,
    dataFlow: true
  },
  
  // 测试环境 - 关键调试
  testing: {
    console: true,
    network: true,
    performance: true,
    storage: false,
    events: false,
    dataFlow: false
  },
  
  // 生产环境 - 错误调试
  production: {
    console: false,
    network: false,
    performance: false,
    storage: false,
    events: false,
    dataFlow: false,
    errorReporting: true
  }
}

// 根据环境配置调试
const currentEnv = process.env.NODE_ENV || 'development'
const config = debugConfig[currentEnv]

debugManager.init(config)
```

### 2. 条件调试

```javascript
Page({
  data: {
    debugMode: false
  },
  
  onLoad: function(options) {
    // 通过页面参数启用调试
    if (options.debug === '1') {
      this.setData({ debugMode: true })
      this.enablePageDebugging()
    }
  },
  
  enablePageDebugging: function() {
    // 启用页面级调试
    this.debugLog = (message, data) => {
      if (this.data.debugMode) {
        console.log(`[PAGE DEBUG] ${message}`, data)
      }
    }
    
    // 重写关键方法进行调试
    const originalSetData = this.setData
    this.setData = (data, callback) => {
      if (this.data.debugMode) {
        console.log('setData 调用:', data)
      }
      return originalSetData.call(this, data, callback)
    }
  },
  
  handleUserAction: function(e) {
    this.debugLog('用户操作', {
      type: e.type,
      target: e.target,
      currentTarget: e.currentTarget
    })
    
    // 业务逻辑
  }
})
```

### 3. 调试信息收集

```javascript
// utils/debug-collector.js
class DebugCollector {
  constructor() {
    this.logs = []
    this.maxLogs = 1000
  }
  
  collect(type, data) {
    const logEntry = {
      type: type,
      data: data,
      timestamp: Date.now(),
      page: getCurrentPages().pop()?.route || 'unknown',
      userAgent: wx.getSystemInfoSync()
    }
    
    this.logs.push(logEntry)
    
    // 保持日志数量限制
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
  }
  
  export() {
    const exportData = {
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs,
      summary: this.generateSummary()
    }
    
    return exportData
  }
  
  generateSummary() {
    const summary = {
      logTypes: {},
      pageStats: {},
      timeRange: {
        start: this.logs.length > 0 ? this.logs[0].timestamp : null,
        end: this.logs.length > 0 ? this.logs[this.logs.length - 1].timestamp : null
      }
    }
    
    this.logs.forEach(log => {
      // 按类型统计
      if (!summary.logTypes[log.type]) {
        summary.logTypes[log.type] = 0
      }
      summary.logTypes[log.type]++
      
      // 按页面统计
      if (!summary.pageStats[log.page]) {
        summary.pageStats[log.page] = 0
      }
      summary.pageStats[log.page]++
    })
    
    return summary
  }
  
  // 上传调试数据
  upload() {
    const data = this.export()
    
    wx.request({
      url: 'https://your-debug-server.com/upload',
      method: 'POST',
      data: data,
      success: res => {
        console.log('调试数据上传成功')
      },
      fail: err => {
        console.error('调试数据上传失败:', err)
      }
    })
  }
}

const debugCollector = new DebugCollector()
export default debugCollector
```

## 调试技巧总结

### 1. 快速定位问题

```javascript
// 快速调试工具函数
const quickDebug = {
  // 快速查看对象结构
  inspect: (obj, depth = 2) => {
    console.log(JSON.stringify(obj, null, 2))
  },
  
  // 快速性能测试
  time: (name, fn) => {
    console.time(name)
    const result = fn()
    console.timeEnd(name)
    return result
  },
  
  // 快速断点
  breakpoint: (condition = true) => {
    if (condition) {
      debugger
    }
  },
  
  // 快速日志
  log: (message, data, level = 'log') => {
    const timestamp = new Date().toLocaleTimeString()
    console[level](`[${timestamp}] ${message}`, data)
  },
  
  // 快速错误捕获
  try: (fn, errorHandler) => {
    try {
      return fn()
    } catch (error) {
      console.error('捕获到错误:', error)
      if (errorHandler) {
        errorHandler(error)
      }
    }
  }
}

// 添加到全局
wx.quickDebug = quickDebug
```

### 2. 调试检查清单

```javascript
const debugChecklist = {
  // 数据相关
  data: [
    '检查 data 初始值是否正确',
    '确认 setData 调用是否生效',
    '验证数据绑定语法是否正确',
    '检查数据类型是否匹配'
  ],
  
  // 事件相关
  events: [
    '确认事件绑定语法是否正确',
    '检查事件处理函数是否存在',
    '验证事件参数传递是否正确',
    '确认事件冒泡是否符合预期'
  ],
  
  // 网络相关
  network: [
    '检查请求 URL 是否正确',
    '确认请求参数格式是否正确',
    '验证服务器响应是否正常',
    '检查网络权限配置'
  ],
  
  // 页面相关
  page: [
    '确认页面路径配置是否正确',
    '检查页面生命周期调用顺序',
    '验证页面参数传递是否正确',
    '确认页面跳转逻辑是否正确'
  ],
  
  // 组件相关
  component: [
    '检查组件属性定义是否正确',
    '确认组件事件触发是否正常',
    '验证组件样式是否生效',
    '检查组件生命周期是否正确'
  ]
}

console.log('调试检查清单:', debugChecklist)
```

## 总结

掌握有效的调试技巧对小程序开发至关重要：

1. **开发者工具调试** - 充分利用控制台、断点、网络面板等功能
2. **真机调试** - 通过远程调试、vConsole 等工具在真机上调试
3. **性能调试** - 监控页面性能、内存使用、网络请求等指标
4. **问题定位** - 系统化地调试数据绑定、事件处理、网络请求等问题
5. **工具集成** - 构建统一的调试管理系统，提高调试效率

良好的调试习惯和工具使用能够大大提高开发效率，快速定位和解决问题。建议开发者在项目中建立完善的调试体系，为高质量的小程序开发提供保障。
