# Network Requests

Network requests are essential for mini programs to communicate with backend services. This guide covers HTTP requests, WebSocket connections, file uploads/downloads, and best practices.

## Basic HTTP Requests

### Making GET Requests

```javascript
// Simple GET request
wx.request({
  url: 'https://api.example.com/users',
  method: 'GET',
  success: (res) => {
    console.log('Response:', res.data)
    // Handle success
  },
  fail: (err) => {
    console.error('Request failed:', err)
    // Handle error
  }
})

// GET with query parameters
wx.request({
  url: 'https://api.example.com/search',
  method: 'GET',
  data: {
    q: 'mini program',
    page: 1,
    limit: 20
  },
  success: (res) => {
    console.log('Search results:', res.data)
  }
})

// Promise-based approach
function getUsers() {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://api.example.com/users',
      method: 'GET',
      success: resolve,
      fail: reject
    })
  })
}

// Usage with async/await
Page({
  async loadUsers() {
    try {
      const response = await getUsers()
      console.log('Users:', response.data)
      this.setData({
        users: response.data
      })
    } catch (error) {
      console.error('Failed to load users:', error)
    }
  }
})
```

### POST Requests

```javascript
// POST with JSON data
wx.request({
  url: 'https://api.example.com/users',
  method: 'POST',
  header: {
    'Content-Type': 'application/json'
  },
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    age: 30
  },
  success: (res) => {
    console.log('User created:', res.data)
  },
  fail: (err) => {
    console.error('Failed to create user:', err)
  }
})

// POST with form data
wx.request({
  url: 'https://api.example.com/login',
  method: 'POST',
  header: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: 'username=john&password=secret123',
  success: (res) => {
    if (res.data.success) {
      // Store token
      wx.setStorageSync('token', res.data.token)
      console.log('Login successful')
    }
  }
})
```

### PUT and DELETE Requests

```javascript
// PUT request to update user
wx.request({
  url: 'https://api.example.com/users/123',
  method: 'PUT',
  header: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  },
  data: {
    name: 'John Smith',
    email: 'johnsmith@example.com'
  },
  success: (res) => {
    console.log('User updated:', res.data)
  }
})

// DELETE request
wx.request({
  url: 'https://api.example.com/users/123',
  method: 'DELETE',
  header: {
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  },
  success: (res) => {
    console.log('User deleted')
  }
})
```

## Request Wrapper and Error Handling

### Creating a Request Wrapper

```javascript
// api.js - Centralized API wrapper
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    }
  }
  
  // Get auth token
  getAuthToken() {
    return wx.getStorageSync('token') || ''
  }
  
  // Build headers
  buildHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders }
    
    const token = this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    return headers
  }
  
  // Generic request method
  request(options) {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data,
        header: this.buildHeaders(options.headers),
        timeout: options.timeout || 10000,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(this.handleError(res))
          }
        },
        fail: (err) => {
          reject(this.handleError(err))
        }
      }
      
      wx.request(requestOptions)
    })
  }
  
  // Handle errors
  handleError(error) {
    console.error('API Error:', error)
    
    if (error.statusCode === 401) {
      // Unauthorized - clear token and redirect to login
      wx.removeStorageSync('token')
      wx.showToast({
        title: 'Please login again',
        icon: 'error'
      })
      // Redirect to login page
      wx.redirectTo({ url: '/pages/login/login' })
    } else if (error.statusCode === 403) {
      wx.showToast({
        title: 'Access denied',
        icon: 'error'
      })
    } else if (error.statusCode >= 500) {
      wx.showToast({
        title: 'Server error',
        icon: 'error'
      })
    } else {
      wx.showToast({
        title: error.errMsg || 'Network error',
        icon: 'error'
      })
    }
    
    return error
  }
  
  // Convenience methods
  get(url, params = {}) {
    const queryString = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    
    const fullUrl = queryString ? `${url}?${queryString}` : url
    
    return this.request({
      url: fullUrl,
      method: 'GET'
    })
  }
  
  post(url, data = {}) {
    return this.request({
      url,
      method: 'POST',
      data
    })
  }
  
  put(url, data = {}) {
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

// Create API instance
const api = new ApiClient('https://api.example.com')

// Export for use in pages
module.exports = api
```

### Using the API Wrapper

```javascript
// In a page file
const api = require('../../utils/api')

Page({
  data: {
    users: [],
    loading: false
  },
  
  async onLoad() {
    await this.loadUsers()
  },
  
  async loadUsers() {
    this.setData({ loading: true })
    
    try {
      const users = await api.get('/users', {
        page: 1,
        limit: 20
      })
      
      this.setData({
        users,
        loading: false
      })
    } catch (error) {
      console.error('Failed to load users:', error)
      this.setData({ loading: false })
    }
  },
  
  async createUser(userData) {
    try {
      const newUser = await api.post('/users', userData)
      
      // Add to local list
      const users = [...this.data.users, newUser]
      this.setData({ users })
      
      wx.showToast({
        title: 'User created successfully',
        icon: 'success'
      })
    } catch (error) {
      console.error('Failed to create user:', error)
    }
  },
  
  async updateUser(userId, userData) {
    try {
      const updatedUser = await api.put(`/users/${userId}`, userData)
      
      // Update local list
      const users = this.data.users.map(user => 
        user.id === userId ? updatedUser : user
      )
      this.setData({ users })
      
      wx.showToast({
        title: 'User updated successfully',
        icon: 'success'
      })
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  },
  
  async deleteUser(userId) {
    try {
      await api.delete(`/users/${userId}`)
      
      // Remove from local list
      const users = this.data.users.filter(user => user.id !== userId)
      this.setData({ users })
      
      wx.showToast({
        title: 'User deleted successfully',
        icon: 'success'
      })
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }
})
```

## File Upload and Download

### File Upload

```javascript
// Upload single file
function uploadFile(filePath, fileName) {
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: 'https://api.example.com/upload',
      filePath,
      name: 'file',
      formData: {
        fileName,
        userId: wx.getStorageSync('userId')
      },
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        const data = JSON.parse(res.data)
        resolve(data)
      },
      fail: reject
    })
  })
}

// Upload with progress
function uploadFileWithProgress(filePath, fileName, onProgress) {
  return new Promise((resolve, reject) => {
    const uploadTask = wx.uploadFile({
      url: 'https://api.example.com/upload',
      filePath,
      name: 'file',
      formData: { fileName },
      success: (res) => {
        const data = JSON.parse(res.data)
        resolve(data)
      },
      fail: reject
    })
    
    // Listen to upload progress
    uploadTask.onProgressUpdate((res) => {
      const progress = res.progress
      console.log('Upload progress:', progress + '%')
      
      if (onProgress) {
        onProgress(progress)
      }
    })
    
    return uploadTask
  })
}

// Usage in page
Page({
  data: {
    uploadProgress: 0
  },
  
  async chooseAndUploadImage() {
    try {
      // Choose image
      const res = await new Promise((resolve, reject) => {
        wx.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: resolve,
          fail: reject
        })
      })
      
      const filePath = res.tempFilePaths[0]
      
      // Upload with progress
      const result = await uploadFileWithProgress(
        filePath,
        'user-avatar.jpg',
        (progress) => {
          this.setData({ uploadProgress: progress })
        }
      )
      
      console.log('Upload successful:', result)
      
      wx.showToast({
        title: 'Upload successful',
        icon: 'success'
      })
      
      // Reset progress
      this.setData({ uploadProgress: 0 })
      
    } catch (error) {
      console.error('Upload failed:', error)
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
// Download file
function downloadFile(url, fileName) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url,
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.statusCode === 200) {
          // Save to local storage
          const fs = wx.getFileSystemManager()
          const localPath = `${wx.env.USER_DATA_PATH}/${fileName}`
          
          fs.saveFile({
            tempFilePath: res.tempFilePath,
            filePath: localPath,
            success: () => {
              resolve(localPath)
            },
            fail: reject
          })
        } else {
          reject(new Error('Download failed'))
        }
      },
      fail: reject
    })
  })
}

// Download with progress
function downloadFileWithProgress(url, fileName, onProgress) {
  return new Promise((resolve, reject) => {
    const downloadTask = wx.downloadFile({
      url,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject(new Error('Download failed'))
        }
      },
      fail: reject
    })
    
    // Listen to download progress
    downloadTask.onProgressUpdate((res) => {
      const progress = res.progress
      console.log('Download progress:', progress + '%')
      
      if (onProgress) {
        onProgress(progress)
      }
    })
    
    return downloadTask
  })
}

// Usage
Page({
  data: {
    downloadProgress: 0
  },
  
  async downloadDocument() {
    try {
      const filePath = await downloadFileWithProgress(
        'https://api.example.com/files/document.pdf',
        'document.pdf',
        (progress) => {
          this.setData({ downloadProgress: progress })
        }
      )
      
      console.log('Download successful:', filePath)
      
      // Open file
      wx.openDocument({
        filePath,
        success: () => {
          console.log('Document opened')
        }
      })
      
      this.setData({ downloadProgress: 0 })
      
    } catch (error) {
      console.error('Download failed:', error)
      wx.showToast({
        title: 'Download failed',
        icon: 'error'
      })
    }
  }
})
```

## WebSocket Connections

### Basic WebSocket Usage

```javascript
// WebSocket manager
class WebSocketManager {
  constructor(url) {
    this.url = url
    this.socket = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000
    this.messageQueue = []
    this.listeners = {}
  }
  
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = wx.connectSocket({
        url: this.url,
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        }
      })
      
      this.socket.onOpen(() => {
        console.log('WebSocket connected')
        this.reconnectAttempts = 0
        
        // Send queued messages
        this.messageQueue.forEach(message => {
          this.send(message)
        })
        this.messageQueue = []
        
        resolve()
      })
      
      this.socket.onMessage((res) => {
        try {
          const data = JSON.parse(res.data)
          this.handleMessage(data)
        } catch (error) {
          console.error('Failed to parse message:', error)
        }
      })
      
      this.socket.onClose(() => {
        console.log('WebSocket disconnected')
        this.handleDisconnect()
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
      // Queue message if not connected
      this.messageQueue.push(data)
    }
  }
  
  handleMessage(data) {
    const { type, payload } = data
    
    if (this.listeners[type]) {
      this.listeners[type].forEach(callback => {
        callback(payload)
      })
    }
  }
  
  on(type, callback) {
    if (!this.listeners[type]) {
      this.listeners[type] = []
    }
    this.listeners[type].push(callback)
  }
  
  off(type, callback) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter(cb => cb !== callback)
    }
  }
  
  handleDisconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`)
      
      setTimeout(() => {
        this.connect().catch(error => {
          console.error('Reconnection failed:', error)
        })
      }, this.reconnectInterval)
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

// Usage in app or page
const wsManager = new WebSocketManager('wss://api.example.com/ws')

Page({
  onLoad() {
    this.initWebSocket()
  },
  
  onUnload() {
    wsManager.close()
  },
  
  async initWebSocket() {
    try {
      await wsManager.connect()
      
      // Listen for different message types
      wsManager.on('chat_message', (message) => {
        console.log('New chat message:', message)
        this.addChatMessage(message)
      })
      
      wsManager.on('user_online', (user) => {
        console.log('User came online:', user)
        this.updateUserStatus(user.id, 'online')
      })
      
      wsManager.on('notification', (notification) => {
        console.log('New notification:', notification)
        this.showNotification(notification)
      })
      
    } catch (error) {
      console.error('Failed to connect WebSocket:', error)
    }
  },
  
  sendChatMessage(message) {
    wsManager.send({
      type: 'chat_message',
      payload: {
        text: message,
        timestamp: Date.now()
      }
    })
  },
  
  addChatMessage(message) {
    const messages = [...this.data.messages, message]
    this.setData({ messages })
  },
  
  updateUserStatus(userId, status) {
    // Update user status in UI
  },
  
  showNotification(notification) {
    wx.showToast({
      title: notification.message,
      icon: 'none'
    })
  }
})
```

## Request Caching and Optimization

### Simple Cache Implementation

```javascript
// cache.js - Simple request cache
class RequestCache {
  constructor(maxAge = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map()
    this.maxAge = maxAge
  }
  
  generateKey(url, params = {}) {
    const paramString = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    
    return `${url}?${paramString}`
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
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  clear() {
    this.cache.clear()
  }
  
  delete(key) {
    this.cache.delete(key)
  }
}

// Enhanced API client with caching
class CachedApiClient extends ApiClient {
  constructor(baseURL) {
    super(baseURL)
    this.cache = new RequestCache()
  }
  
  async get(url, params = {}, useCache = true) {
    const cacheKey = this.cache.generateKey(url, params)
    
    // Try cache first
    if (useCache) {
      const cached = this.cache.get(cacheKey)
      if (cached) {
        console.log('Cache hit for:', cacheKey)
        return cached
      }
    }
    
    // Make request
    try {
      const data = await super.get(url, params)
      
      // Cache successful response
      if (useCache) {
        this.cache.set(cacheKey, data)
      }
      
      return data
    } catch (error) {
      throw error
    }
  }
  
  // Invalidate cache for specific patterns
  invalidateCache(pattern) {
    for (const key of this.cache.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}

const api = new CachedApiClient('https://api.example.com')
module.exports = api
```

### Request Batching

```javascript
// Batch multiple requests
class BatchRequestManager {
  constructor(batchSize = 5, delay = 100) {
    this.batchSize = batchSize
    this.delay = delay
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
      
      this.scheduleExecution()
    })
  }
  
  scheduleExecution() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    
    this.timer = setTimeout(() => {
      this.executeBatch()
    }, this.delay)
    
    // Execute immediately if batch is full
    if (this.queue.length >= this.batchSize) {
      clearTimeout(this.timer)
      this.executeBatch()
    }
  }
  
  async executeBatch() {
    if (this.queue.length === 0) return
    
    const batch = this.queue.splice(0, this.batchSize)
    
    try {
      // Execute all requests in parallel
      const promises = batch.map(request => {
        return wx.request({
          url: request.url,
          method: request.method,
          data: request.data,
          header: request.header
        })
      })
      
      const results = await Promise.allSettled(promises)
      
      // Resolve/reject individual promises
      results.forEach((result, index) => {
        const request = batch[index]
        
        if (result.status === 'fulfilled') {
          request.resolve(result.value)
        } else {
          request.reject(result.reason)
        }
      })
      
    } catch (error) {
      // Reject all requests in batch
      batch.forEach(request => {
        request.reject(error)
      })
    }
    
    // Continue with next batch if queue is not empty
    if (this.queue.length > 0) {
      this.scheduleExecution()
    }
  }
}

const batchManager = new BatchRequestManager()

// Usage
Page({
  async loadMultipleResources() {
    try {
      const [users, posts, comments] = await Promise.all([
        batchManager.add({
          url: 'https://api.example.com/users',
          method: 'GET'
        }),
        batchManager.add({
          url: 'https://api.example.com/posts',
          method: 'GET'
        }),
        batchManager.add({
          url: 'https://api.example.com/comments',
          method: 'GET'
        })
      ])
      
      console.log('All resources loaded:', { users, posts, comments })
      
    } catch (error) {
      console.error('Failed to load resources:', error)
    }
  }
})
```

## Best Practices

### Network Status Monitoring

```javascript
// Network monitor
class NetworkMonitor {
  constructor() {
    this.isOnline = true
    this.networkType = 'unknown'
    this.listeners = []
    
    this.init()
  }
  
  init() {
    // Get initial network status
    wx.getNetworkType({
      success: (res) => {
        this.networkType = res.networkType
        this.isOnline = res.networkType !== 'none'
      }
    })
    
    // Listen for network changes
    wx.onNetworkStatusChange((res) => {
      this.isOnline = res.isConnected
      this.networkType = res.networkType
      
      this.notifyListeners({
        isOnline: this.isOnline,
        networkType: this.networkType
      })
    })
  }
  
  onStatusChange(callback) {
    this.listeners.push(callback)
  }
  
  notifyListeners(status) {
    this.listeners.forEach(callback => {
      callback(status)
    })
  }
  
  isSlowNetwork() {
    return ['2g', '3g'].includes(this.networkType)
  }
}

const networkMonitor = new NetworkMonitor()

// Usage in app.js
App({
  onLaunch() {
    networkMonitor.onStatusChange((status) => {
      console.log('Network status changed:', status)
      
      if (!status.isOnline) {
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
  }
})
```

### Request Retry Logic

```javascript
// Retry wrapper
function withRetry(requestFn, maxRetries = 3, delay = 1000) {
  return async function(...args) {
    let lastError
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await requestFn(...args)
      } catch (error) {
        lastError = error
        
        console.log(`Request failed (attempt ${attempt}/${maxRetries}):`, error)
        
        // Don't retry on client errors (4xx)
        if (error.statusCode >= 400 && error.statusCode < 500) {
          throw error
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < maxRetries) {
          const waitTime = delay * Math.pow(2, attempt - 1)
          await new Promise(resolve => setTimeout(resolve, waitTime))
        }
      }
    }
    
    throw lastError
  }
}

// Usage
const apiWithRetry = {
  getUsers: withRetry(api.get.bind(api)),
  createUser: withRetry(api.post.bind(api)),
  updateUser: withRetry(api.put.bind(api))
}

Page({
  async loadUsers() {
    try {
      const users = await apiWithRetry.getUsers('/users')
      this.setData({ users })
    } catch (error) {
      console.error('Failed to load users after retries:', error)
    }
  }
})
```

Network requests are fundamental to modern mini programs. Always handle errors gracefully, implement proper caching strategies, and consider network conditions to provide the best user experience.