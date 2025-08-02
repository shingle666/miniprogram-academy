# Network Requests

This guide covers how to handle network requests in mini programs, including HTTP requests, WebSocket connections, file uploads/downloads, and best practices for network communication.

## 📋 Table of Contents

- [Basic HTTP Requests](#basic-http-requests)
- [Request Configuration](#request-configuration)
- [Error Handling](#error-handling)
- [File Upload/Download](#file-uploaddownload)
- [WebSocket Communication](#websocket-communication)
- [Request Interceptors](#request-interceptors)
- [Caching Strategies](#caching-strategies)
- [Best Practices](#best-practices)

## 🌐 Basic HTTP Requests

### wx.request API

The `wx.request` API is the primary method for making HTTP requests in mini programs.

```javascript
// Basic GET request
wx.request({
  url: 'https://api.example.com/users',
  method: 'GET',
  success: (res) => {
    console.log('Success:', res.data)
  },
  fail: (error) => {
    console.error('Request failed:', error)
  }
})

// POST request with data
wx.request({
  url: 'https://api.example.com/users',
  method: 'POST',
  data: {
    name: 'John Doe',
    email: 'john@example.com'
  },
  header: {
    'Content-Type': 'application/json'
  },
  success: (res) => {
    console.log('User created:', res.data)
  },
  fail: (error) => {
    console.error('Failed to create user:', error)
  }
})
```

### Promise-based Wrapper

Create a Promise-based wrapper for better async handling:

```javascript
// utils/request.js
class HttpClient {
  static request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: options.url,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Content-Type': 'application/json',
          ...options.header
        },
        timeout: options.timeout || 10000,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.data.message || 'Request failed'}`))
          }
        },
        fail: (error) => {
          reject(new Error(`Network error: ${error.errMsg}`))
        }
      })
    })
  }
  
  static get(url, params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
    
    const fullUrl = queryString ? `${url}?${queryString}` : url
    
    return this.request({
      url: fullUrl,
      method: 'GET'
    })
  }
  
  static post(url, data = {}) {
    return this.request({
      url,
      method: 'POST',
      data
    })
  }
  
  static put(url, data = {}) {
    return this.request({
      url,
      method: 'PUT',
      data
    })
  }
  
  static delete(url) {
    return this.request({
      url,
      method: 'DELETE'
    })
  }
}

module.exports = HttpClient
```

### Usage Examples

```javascript
// In your page or component
const HttpClient = require('../../utils/request')

Page({
  data: {
    users: [],
    loading: false
  },
  
  async onLoad() {
    await this.loadUsers()
  },
  
  async loadUsers() {
    try {
      this.setData({ loading: true })
      
      const users = await HttpClient.get('https://api.example.com/users', {
        page: 1,
        limit: 10
      })
      
      this.setData({ 
        users,
        loading: false 
      })
    } catch (error) {
      console.error('Failed to load users:', error)
      this.setData({ loading: false })
      
      wx.showToast({
        title: 'Failed to load data',
        icon: 'error'
      })
    }
  },
  
  async createUser(userData) {
    try {
      const newUser = await HttpClient.post('https://api.example.com/users', userData)
      
      // Update local data
      const users = [...this.data.users, newUser]
      this.setData({ users })
      
      wx.showToast({
        title: 'User created successfully',
        icon: 'success'
      })
    } catch (error) {
      console.error('Failed to create user:', error)
      wx.showToast({
        title: 'Failed to create user',
        icon: 'error'
      })
    }
  }
})
```

## ⚙️ Request Configuration

### Global Configuration

```javascript
// utils/config.js
const config = {
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'MiniProgram/1.0.0'
  }
}

module.exports = config
```

### Enhanced HTTP Client

```javascript
// utils/http.js
const config = require('./config')

class Http {
  constructor() {
    this.baseURL = config.baseURL
    this.timeout = config.timeout
    this.defaultHeaders = config.headers
    this.interceptors = {
      request: [],
      response: []
    }
  }
  
  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
  }
  
  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
  }
  
  async request(options) {
    // Apply request interceptors
    let requestOptions = {
      url: this.baseURL + options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        ...this.defaultHeaders,
        ...options.header
      },
      timeout: options.timeout || this.timeout
    }
    
    // Apply request interceptors
    for (const interceptor of this.interceptors.request) {
      requestOptions = await interceptor(requestOptions)
    }
    
    return new Promise((resolve, reject) => {
      wx.request({
        ...requestOptions,
        success: async (res) => {
          try {
            // Apply response interceptors
            let response = res
            for (const interceptor of this.interceptors.response) {
              response = await interceptor(response)
            }
            
            if (response.statusCode >= 200 && response.statusCode < 300) {
              resolve(response.data)
            } else {
              reject(new Error(`HTTP ${response.statusCode}`))
            }
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
  }
  
  get(url, params) {
    const queryString = params ? 
      '?' + Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&') : ''
    
    return this.request({
      url: url + queryString,
      method: 'GET'
    })
  }
  
  post(url, data) {
    return this.request({
      url,
      method: 'POST',
      data
    })
  }
  
  put(url, data) {
    return this.request({
      url,
      method: 'PUT',
      data
    })
  }
  
  delete(url) {
    return this.request({
      url,
      method: 'DELETE'
    })
  }
}

// Create global instance
const http = new Http()

// Add authentication interceptor
http.addRequestInterceptor(async (options) => {
  const token = wx.getStorageSync('token')
  if (token) {
    options.header.Authorization = `Bearer ${token}`
  }
  return options
})

// Add response error handling
http.addResponseInterceptor(async (response) => {
  if (response.statusCode === 401) {
    // Token expired, redirect to login
    wx.removeStorageSync('token')
    wx.redirectTo({
      url: '/pages/login/login'
    })
    throw new Error('Authentication required')
  }
  return response
})

module.exports = http
```

## 🚨 Error Handling

### Comprehensive Error Handler

```javascript
// utils/errorHandler.js
class ErrorHandler {
  static handle(error, context = '') {
    console.error(`Error in ${context}:`, error)
    
    let message = 'An error occurred'
    
    if (error.message) {
      if (error.message.includes('timeout')) {
        message = 'Request timeout, please try again'
      } else if (error.message.includes('Network')) {
        message = 'Network error, please check your connection'
      } else if (error.message.includes('HTTP 400')) {
        message = 'Invalid request'
      } else if (error.message.includes('HTTP 401')) {
        message = 'Authentication required'
      } else if (error.message.includes('HTTP 403')) {
        message = 'Access denied'
      } else if (error.message.includes('HTTP 404')) {
        message = 'Resource not found'
      } else if (error.message.includes('HTTP 500')) {
        message = 'Server error, please try again later'
      } else {
        message = error.message
      }
    }
    
    wx.showToast({
      title: message,
      icon: 'error',
      duration: 3000
    })
    
    // Log to analytics service
    this.logError(error, context)
  }
  
  static logError(error, context) {
    // Send error to analytics service
    wx.request({
      url: 'https://analytics.example.com/errors',
      method: 'POST',
      data: {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: wx.getSystemInfoSync()
      }
    })
  }
}

module.exports = ErrorHandler
```

### Retry Mechanism

```javascript
// utils/retry.js
class RetryHandler {
  static async withRetry(fn, maxRetries = 3, delay = 1000) {
    let lastError
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error
        
        if (i < maxRetries - 1) {
          console.log(`Attempt ${i + 1} failed, retrying in ${delay}ms...`)
          await this.sleep(delay)
          delay *= 2 // Exponential backoff
        }
      }
    }
    
    throw lastError
  }
  
  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Usage
const http = require('./http')
const RetryHandler = require('./retry')

async function fetchUserData(userId) {
  return RetryHandler.withRetry(async () => {
    return await http.get(`/users/${userId}`)
  }, 3, 1000)
}
```

## 📁 File Upload/Download

### File Upload

```javascript
// utils/upload.js
class FileUploader {
  static upload(filePath, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadTask = wx.uploadFile({
        url: options.url || 'https://api.example.com/upload',
        filePath,
        name: options.name || 'file',
        formData: options.formData || {},
        header: {
          'Authorization': `Bearer ${wx.getStorageSync('token')}`,
          ...options.header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            try {
              const data = JSON.parse(res.data)
              resolve(data)
            } catch (error) {
              resolve(res.data)
            }
          } else {
            reject(new Error(`Upload failed: ${res.statusCode}`))
          }
        },
        fail: reject
      })
      
      // Progress callback
      if (options.onProgress) {
        uploadTask.onProgressUpdate(options.onProgress)
      }
    })
  }
  
  static async uploadImage(options = {}) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: options.count || 1,
        sizeType: options.sizeType || ['original', 'compressed'],
        sourceType: options.sourceType || ['album', 'camera'],
        success: async (res) => {
          try {
            const uploadPromises = res.tempFilePaths.map(filePath => 
              this.upload(filePath, options)
            )
            
            const results = await Promise.all(uploadPromises)
            resolve(results)
          } catch (error) {
            reject(error)
          }
        },
        fail: reject
      })
    })
  }
}

// Usage in page
Page({
  async uploadImage() {
    try {
      wx.showLoading({ title: 'Uploading...' })
      
      const results = await FileUploader.uploadImage({
        url: 'https://api.example.com/upload/image',
        count: 3,
        onProgress: (progress) => {
          console.log('Upload progress:', progress.progress)
        }
      })
      
      wx.hideLoading()
      wx.showToast({
        title: 'Upload successful',
        icon: 'success'
      })
      
      console.log('Upload results:', results)
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: 'Upload failed',
        icon: 'error'
      })
    }
  }
})
```

### File Download

```javascript
// utils/download.js
class FileDownloader {
  static download(url, options = {}) {
    return new Promise((resolve, reject) => {
      const downloadTask = wx.downloadFile({
        url,
        header: options.header || {},
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          } else {
            reject(new Error(`Download failed: ${res.statusCode}`))
          }
        },
        fail: reject
      })
      
      // Progress callback
      if (options.onProgress) {
        downloadTask.onProgressUpdate(options.onProgress)
      }
    })
  }
  
  static async downloadAndSave(url, options = {}) {
    try {
      const tempFilePath = await this.download(url, options)
      
      // Save to album if it's an image
      if (options.saveToAlbum && this.isImage(url)) {
        await new Promise((resolve, reject) => {
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: resolve,
            fail: reject
          })
        })
      }
      
      return tempFilePath
    } catch (error) {
      throw error
    }
  }
  
  static isImage(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    return imageExtensions.some(ext => url.toLowerCase().includes(ext))
  }
}

module.exports = FileDownloader
```

## 🔌 WebSocket Communication

### WebSocket Manager

```javascript
// utils/websocket.js
class WebSocketManager {
  constructor(url) {
    this.url = url
    this.socket = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 1000
    this.listeners = {}
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = wx.connectSocket({
        url: this.url,
        success: () => {
          console.log('WebSocket connection initiated')
        },
        fail: reject
      })
      
      this.socket.onOpen(() => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        resolve()
      })
      
      this.socket.onMessage((event) => {
        try {
          const data = JSON.parse(event.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      })
      
      this.socket.onClose(() => {
        console.log('WebSocket disconnected')
        this.handleReconnect()
      })
      
      this.socket.onError((error) => {
        console.error('WebSocket error:', error)
        reject(error)
      })
    })
  }
  
  send(data) {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send({
        data: JSON.stringify(data)
      })
    } else {
      console.error('WebSocket is not connected')
    }
  }
  
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }
  
  off(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback)
      if (index > -1) {
        this.listeners[event].splice(index, 1)
      }
    }
  }
  
  handleMessage(data) {
    const { type, payload } = data
    if (this.listeners[type]) {
      this.listeners[type].forEach(callback => callback(payload))
    }
  }
  
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error)
        })
      }, this.reconnectInterval * this.reconnectAttempts)
    } else {
      console.error('Max reconnection attempts reached')
    }
  }
  
  close() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}

// Usage
const wsManager = new WebSocketManager('wss://api.example.com/ws')

// Connect
wsManager.connect().then(() => {
  console.log('Connected to WebSocket')
}).catch(error => {
  console.error('Failed to connect:', error)
})

// Listen for messages
wsManager.on('message', (data) => {
  console.log('Received message:', data)
})

wsManager.on('notification', (data) => {
  wx.showToast({
    title: data.message,
    icon: 'none'
  })
})

// Send message
wsManager.send({
  type: 'chat',
  payload: {
    message: 'Hello, World!',
    timestamp: Date.now()
  }
})

module.exports = WebSocketManager
```

## 🔄 Request Interceptors

### Authentication Interceptor

```javascript
// utils/auth-interceptor.js
class AuthInterceptor {
  static async requestInterceptor(options) {
    const token = wx.getStorageSync('token')
    
    if (token) {
      options.header = {
        ...options.header,
        'Authorization': `Bearer ${token}`
      }
    }
    
    // Add request timestamp
    options.header['X-Request-Time'] = Date.now().toString()
    
    return options
  }
  
  static async responseInterceptor(response) {
    // Handle token refresh
    if (response.statusCode === 401) {
      const refreshToken = wx.getStorageSync('refreshToken')
      
      if (refreshToken) {
        try {
          const newTokens = await this.refreshTokens(refreshToken)
          wx.setStorageSync('token', newTokens.accessToken)
          wx.setStorageSync('refreshToken', newTokens.refreshToken)
          
          // Retry original request
          // This would need to be implemented based on your needs
        } catch (error) {
          // Refresh failed, redirect to login
          wx.removeStorageSync('token')
          wx.removeStorageSync('refreshToken')
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      }
    }
    
    return response
  }
  
  static async refreshTokens(refreshToken) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.example.com/auth/refresh',
        method: 'POST',
        data: { refreshToken },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error('Token refresh failed'))
          }
        },
        fail: reject
      })
    })
  }
}

module.exports = AuthInterceptor
```

## 💾 Caching Strategies

### Request Cache Manager

```javascript
// utils/cache.js
class RequestCache {
  constructor() {
    this.cache = new Map()
    this.maxAge = 5 * 60 * 1000 // 5 minutes
  }
  
  generateKey(url, method, data) {
    return `${method}:${url}:${JSON.stringify(data || {})}`
  }
  
  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
  
  get(key) {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }
    
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  clear() {
    this.cache.clear()
  }
  
  async request(url, options = {}) {
    const key = this.generateKey(url, options.method || 'GET', options.data)
    
    // Check cache first
    if (!options.skipCache) {
      const cached = this.get(key)
      if (cached) {
        console.log('Returning cached data for:', key)
        return cached
      }
    }
    
    // Make actual request
    const http = require('./http')
    const data = await http.request({ url, ...options })
    
    // Cache the result
    if (options.method === 'GET' || !options.method) {
      this.set(key, data)
    }
    
    return data
  }
}

const cache = new RequestCache()
module.exports = cache
```

## 🎯 Best Practices

### 1. Request Timeout Configuration

```javascript
// Set appropriate timeouts
const TIMEOUT_CONFIG = {
  short: 5000,    // For quick operations
  medium: 10000,  // For normal requests
  long: 30000     // For file uploads/downloads
}

// Usage
wx.request({
  url: 'https://api.example.com/quick-data',
  timeout: TIMEOUT_CONFIG.short,
  // ... other options
})
```

### 2. Request Debouncing

```javascript
// utils/debounce.js
class RequestDebouncer {
  constructor() {
    this.pendingRequests = new Map()
  }
  
  async request(key, requestFn, delay = 300) {
    // Cancel previous request
    if (this.pendingRequests.has(key)) {
      clearTimeout(this.pendingRequests.get(key).timer)
    }
    
    return new Promise((resolve, reject) => {
      const timer = setTimeout(async () => {
        try {
          const result = await requestFn()
          this.pendingRequests.delete(key)
          resolve(result)
        } catch (error) {
          this.pendingRequests.delete(key)
          reject(error)
        }
      }, delay)
      
      this.pendingRequests.set(key, { timer, resolve, reject })
    })
  }
}

const debouncer = new RequestDebouncer()

// Usage in search
Page({
  async onSearchInput(e) {
    const query = e.detail.value
    
    try {
      const results = await debouncer.request(
        'search',
        () => http.get('/search', { q: query }),
        500
      )
      
      this.setData({ searchResults: results })
    } catch (error) {
      console.error('Search failed:', error)
    }
  }
})
```

### 3. Request Queue Management

```javascript
// utils/queue.js
class RequestQueue {
  constructor(maxConcurrent = 3) {
    this.maxConcurrent = maxConcurrent
    this.running = 0
    this.queue = []
  }
  
  async add(requestFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        requestFn,
        resolve,
        reject
      })
      
      this.process()
    })
  }
  
  async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }
    
    this.running++
    const { requestFn, resolve, reject } = this.queue.shift()
    
    try {
      const result = await requestFn()
      resolve(result)
    } catch (error) {
      reject(error)
    } finally {
      this.running--
      this.process()
    }
  }
}

const requestQueue = new RequestQueue(3)

// Usage
async function makeQueuedRequest(url, options) {
  return requestQueue.add(() => http.request({ url, ...options }))
}
```

### 4. Network Status Monitoring

```javascript
// utils/network-monitor.js
class NetworkMonitor {
  constructor() {
    this.isOnline = true
    this.listeners = []
    this.init()
  }
  
  init() {
    wx.getNetworkType({
      success: (res) => {
        this.isOnline = res.networkType !== 'none'
      }
    })
    
    wx.onNetworkStatusChange((res) => {
      this.isOnline = res.isConnected
      this.notifyListeners(res)
    })
  }
  
  onStatusChange(callback) {
    this.listeners.push(callback)
  }
  
  notifyListeners(status) {
    this.listeners.forEach(callback => callback(status))
  }
  
  async waitForConnection() {
    if (this.isOnline) {
      return Promise.resolve()
    }
    
    return new Promise((resolve) => {
      const handler = (status) => {
        if (status.isConnected) {
          const index = this.listeners.indexOf(handler)
          if (index > -1) {
            this.listeners.splice(index, 1)
          }
          resolve()
        }
      }
      
      this.onStatusChange(handler)
    })
  }
}

const networkMonitor = new NetworkMonitor()

// Usage
networkMonitor.onStatusChange((status) => {
  if (!status.isConnected) {
    wx.showToast({
      title: 'Network disconnected',
      icon: 'error'
    })
  } else {
    wx.showToast({
      title: 'Network connected',
      icon: 'success'
    })
  }
})
```

---

Effective network request handling is crucial for mini program performance and user experience. Implement proper error handling, caching strategies, and monitoring to create robust and responsive applications.