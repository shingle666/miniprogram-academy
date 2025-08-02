# 网络请求

掌握小程序网络请求的核心技术，包括HTTP请求、WebSocket连接、文件上传下载等功能的实现。

## 🌐 HTTP 请求

### wx.request 基础用法

```javascript
// GET 请求
wx.request({
  url: 'https://api.example.com/users',
  method: 'GET',
  data: {
    page: 1,
    limit: 20,
    keyword: '搜索关键词'
  },
  header: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  },
  success: (res) => {
    console.log('请求成功', res)
    if (res.statusCode === 200) {
      this.setData({
        userList: res.data.list,
        total: res.data.total
      })
    } else {
      wx.showToast({
        title: '请求失败',
        icon: 'none'
      })
    }
  },
  fail: (err) => {
    console.error('请求失败', err)
    wx.showToast({
      title: '网络错误',
      icon: 'none'
    })
  },
  complete: () => {
    wx.hideLoading()
  }
})

// POST 请求
wx.request({
  url: 'https://api.example.com/users',
  method: 'POST',
  data: {
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138000'
  },
  header: {
    'Content-Type': 'application/json'
  },
  success: (res) => {
    if (res.statusCode === 201) {
      wx.showToast({
        title: '创建成功',
        icon: 'success'
      })
      // 刷新列表
      this.loadUserList()
    }
  }
})

// PUT 请求（更新）
wx.request({
  url: `https://api.example.com/users/${userId}`,
  method: 'PUT',
  data: {
    name: '李四',
    email: 'lisi@example.com'
  },
  header: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  },
  success: (res) => {
    if (res.statusCode === 200) {
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      })
    }
  }
})

// DELETE 请求
wx.request({
  url: `https://api.example.com/users/${userId}`,
  method: 'DELETE',
  header: {
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  },
  success: (res) => {
    if (res.statusCode === 204) {
      wx.showToast({
        title: '删除成功',
        icon: 'success'
      })
      // 从列表中移除
      this.removeUserFromList(userId)
    }
  }
})
```

### 请求封装类

```javascript
// utils/http.js
class HttpClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || ''
    this.timeout = options.timeout || 10000
    this.defaultHeaders = options.headers || {}
    
    // 请求和响应拦截器
    this.interceptors = {
      request: [],
      response: []
    }
    
    // 请求队列（用于取消请求）
    this.requestQueue = new Map()
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
  }

  // 核心请求方法
  request(config) {
    return new Promise((resolve, reject) => {
      // 生成请求ID
      const requestId = this.generateRequestId()
      
      // 合并配置
      let finalConfig = {
        url: this.baseURL + config.url,
        method: config.method || 'GET',
        data: config.data || {},
        header: {
          ...this.defaultHeaders,
          ...config.header
        },
        timeout: config.timeout || this.timeout,
        dataType: config.dataType || 'json',
        responseType: config.responseType || 'text'
      }

      // 执行请求拦截器
      this.interceptors.request.forEach(interceptor => {
        finalConfig = interceptor(finalConfig) || finalConfig
      })

      // 显示加载提示
      if (config.loading !== false) {
        wx.showLoading({
          title: config.loadingText || '请求中...',
          mask: true
        })
      }

      // 发起请求
      const requestTask = wx.request({
        ...finalConfig,
        success: (response) => {
          // 执行响应拦截器
          let finalResponse = response
          this.interceptors.response.forEach(interceptor => {
            finalResponse = interceptor(finalResponse) || finalResponse
          })

          // 处理响应
          if (this.isSuccess(finalResponse)) {
            resolve(finalResponse.data)
          } else {
            reject(this.createError(finalResponse))
          }
        },
        fail: (error) => {
          console.error('请求失败', error)
          reject(this.createError(null, error))
        },
        complete: () => {
          // 从请求队列中移除
          this.requestQueue.delete(requestId)
          
          // 隐藏加载提示
          if (config.loading !== false) {
            wx.hideLoading()
          }
        }
      })

      // 添加到请求队列
      this.requestQueue.set(requestId, {
        task: requestTask,
        config: finalConfig
      })
    })
  }

  // 判断请求是否成功
  isSuccess(response) {
    return response.statusCode >= 200 && response.statusCode < 300
  }

  // 创建错误对象
  createError(response, error) {
    if (error) {
      return {
        type: 'network',
        message: '网络请求失败',
        error
      }
    }
    
    return {
      type: 'http',
      message: `请求失败 (${response.statusCode})`,
      statusCode: response.statusCode,
      data: response.data
    }
  }

  // 生成请求ID
  generateRequestId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // GET 请求
  get(url, params, config = {}) {
    return this.request({
      url,
      method: 'GET',
      data: params,
      ...config
    })
  }

  // POST 请求
  post(url, data, config = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  // PUT 请求
  put(url, data, config = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }

  // DELETE 请求
  delete(url, config = {}) {
    return this.request({
      url,
      method: 'DELETE',
      ...config
    })
  }

  // 取消所有请求
  cancelAllRequests() {
    this.requestQueue.forEach(({ task }) => {
      task.abort()
    })
    this.requestQueue.clear()
    wx.hideLoading()
  }

  // 取消特定请求
  cancelRequest(requestId) {
    const request = this.requestQueue.get(requestId)
    if (request) {
      request.task.abort()
      this.requestQueue.delete(requestId)
    }
  }
}

// 创建默认实例
const http = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 添加请求拦截器
http.addRequestInterceptor((config) => {
  // 添加认证token
  const token = wx.getStorageSync('token')
  if (token) {
    config.header.Authorization = `Bearer ${token}`
  }
  
  // 添加时间戳防止缓存
  if (config.method === 'GET') {
    config.data._t = Date.now()
  }
  
  console.log('发起请求', config)
  return config
})

// 添加响应拦截器
http.addResponseInterceptor((response) => {
  console.log('收到响应', response)
  
  // 统一错误处理
  if (response.data && response.data.code !== undefined) {
    if (response.data.code !== 0) {
      // 显示错误信息
      wx.showToast({
        title: response.data.message || '请求失败',
        icon: 'none'
      })
      
      // token过期处理
      if (response.data.code === 401) {
        wx.removeStorageSync('token')
        wx.redirectTo({
          url: '/pages/login/login'
        })
      }
    }
  }
  
  return response
})

module.exports = http
```

### API 接口管理

```javascript
// api/index.js
const http = require('../utils/http')

// 用户相关API
const userAPI = {
  // 用户登录
  login(data) {
    return http.post('/auth/login', data)
  },

  // 用户注册
  register(data) {
    return http.post('/auth/register', data)
  },

  // 获取用户信息
  getUserInfo(userId) {
    return http.get(`/users/${userId}`)
  },

  // 更新用户信息
  updateUserInfo(userId, data) {
    return http.put(`/users/${userId}`, data)
  },

  // 获取用户列表
  getUserList(params) {
    return http.get('/users', params)
  },

  // 删除用户
  deleteUser(userId) {
    return http.delete(`/users/${userId}`)
  },

  // 修改密码
  changePassword(data) {
    return http.post('/auth/change-password', data)
  },

  // 忘记密码
  forgotPassword(email) {
    return http.post('/auth/forgot-password', { email })
  }
}

// 文章相关API
const articleAPI = {
  // 获取文章列表
  getArticleList(params) {
    return http.get('/articles', params)
  },

  // 获取文章详情
  getArticleDetail(articleId) {
    return http.get(`/articles/${articleId}`)
  },

  // 创建文章
  createArticle(data) {
    return http.post('/articles', data)
  },

  // 更新文章
  updateArticle(articleId, data) {
    return http.put(`/articles/${articleId}`, data)
  },

  // 删除文章
  deleteArticle(articleId) {
    return http.delete(`/articles/${articleId}`)
  },

  // 点赞文章
  likeArticle(articleId) {
    return http.post(`/articles/${articleId}/like`)
  },

  // 收藏文章
  favoriteArticle(articleId) {
    return http.post(`/articles/${articleId}/favorite`)
  }
}

// 评论相关API
const commentAPI = {
  // 获取评论列表
  getCommentList(articleId, params) {
    return http.get(`/articles/${articleId}/comments`, params)
  },

  // 添加评论
  addComment(articleId, data) {
    return http.post(`/articles/${articleId}/comments`, data)
  },

  // 删除评论
  deleteComment(commentId) {
    return http.delete(`/comments/${commentId}`)
  },

  // 回复评论
  replyComment(commentId, data) {
    return http.post(`/comments/${commentId}/reply`, data)
  }
}

module.exports = {
  userAPI,
  articleAPI,
  commentAPI
}
```

## 📡 WebSocket 连接

### WebSocket 基础用法

```javascript
// utils/websocket.js
class WebSocketManager {
  constructor(url, options = {}) {
    this.url = url
    this.options = {
      reconnectInterval: 5000, // 重连间隔
      maxReconnectAttempts: 5, // 最大重连次数
      heartbeatInterval: 30000, // 心跳间隔
      ...options
    }
    
    this.socket = null
    this.reconnectAttempts = 0
    this.heartbeatTimer = null
    this.isConnected = false
    this.messageQueue = [] // 消息队列
    
    // 事件监听器
    this.listeners = {
      open: [],
      message: [],
      error: [],
      close: []
    }
  }

  // 连接WebSocket
  connect() {
    if (this.socket) {
      this.close()
    }

    console.log('连接WebSocket', this.url)
    
    this.socket = wx.connectSocket({
      url: this.url,
      protocols: this.options.protocols
    })

    // 监听连接打开
    this.socket.onOpen(() => {
      console.log('WebSocket连接已打开')
      this.isConnected = true
      this.reconnectAttempts = 0
      
      // 发送队列中的消息
      this.flushMessageQueue()
      
      // 开始心跳
      this.startHeartbeat()
      
      // 触发open事件
      this.emit('open')
    })

    // 监听消息
    this.socket.onMessage((res) => {
      console.log('收到WebSocket消息', res.data)
      
      try {
        const data = JSON.parse(res.data)
        this.handleMessage(data)
      } catch (error) {
        console.error('解析WebSocket消息失败', error)
      }
    })

    // 监听错误
    this.socket.onError((error) => {
      console.error('WebSocket错误', error)
      this.isConnected = false
      this.emit('error', error)
    })

    // 监听连接关闭
    this.socket.onClose((res) => {
      console.log('WebSocket连接已关闭', res)
      this.isConnected = false
      this.stopHeartbeat()
      
      this.emit('close', res)
      
      // 自动重连
      if (this.reconnectAttempts < this.options.maxReconnectAttempts) {
        this.reconnect()
      }
    })
  }

  // 发送消息
  send(data) {
    const message = typeof data === 'string' ? data : JSON.stringify(data)
    
    if (this.isConnected) {
      this.socket.send({
        data: message,
        success: () => {
          console.log('消息发送成功', message)
        },
        fail: (error) => {
          console.error('消息发送失败', error)
          // 将消息加入队列，等待重连后发送
          this.messageQueue.push(message)
        }
      })
    } else {
      // 连接未建立，将消息加入队列
      this.messageQueue.push(message)
      console.log('连接未建立，消息已加入队列')
    }
  }

  // 关闭连接
  close() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
    this.isConnected = false
    this.stopHeartbeat()
  }

  // 重连
  reconnect() {
    this.reconnectAttempts++
    console.log(`尝试重连 (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`)
    
    setTimeout(() => {
      this.connect()
    }, this.options.reconnectInterval)
  }

  // 开始心跳
  startHeartbeat() {
    if (this.options.heartbeatInterval > 0) {
      this.heartbeatTimer = setInterval(() => {
        this.send({
          type: 'heartbeat',
          timestamp: Date.now()
        })
      }, this.options.heartbeatInterval)
    }
  }

  // 停止心跳
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // 发送队列中的消息
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      this.send(message)
    }
  }

  // 处理收到的消息
  handleMessage(data) {
    switch (data.type) {
      case 'heartbeat':
        // 心跳响应
        console.log('收到心跳响应')
        break
      case 'notification':
        // 通知消息
        this.handleNotification(data)
        break
      case 'chat':
        // 聊天消息
        this.handleChatMessage(data)
        break
      default:
        // 其他消息
        this.emit('message', data)
    }
  }

  // 处理通知消息
  handleNotification(data) {
    wx.showToast({
      title: data.message,
      icon: 'none'
    })
    
    this.emit('notification', data)
  }

  // 处理聊天消息
  handleChatMessage(data) {
    this.emit('chat', data)
  }

  // 添加事件监听器
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback)
    }
  }

  // 移除事件监听器
  off(event, callback) {
    if (this.listeners[event]) {
      const index = this.listeners[event].indexOf(callback)
      if (index > -1) {
        this.listeners[event].splice(index, 1)
      }
    }
  }

  // 触发事件
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('事件回调执行失败', error)
        }
      })
    }
  }

  // 获取连接状态
  getReadyState() {
    return this.socket ? this.socket.readyState : -1
  }

  // 是否已连接
  isConnected() {
    return this.isConnected
  }
}

module.exports = WebSocketManager
```

### WebSocket 使用示例

```javascript
// pages/chat/chat.js
const WebSocketManager = require('../../utils/websocket')

Page({
  data: {
    messages: [],
    inputText: '',
    connected: false
  },

  onLoad() {
    this.initWebSocket()
  },

  onUnload() {
    if (this.ws) {
      this.ws.close()
    }
  },

  // 初始化WebSocket
  initWebSocket() {
    const token = wx.getStorageSync('token')
    const wsUrl = `wss://api.example.com/ws?token=${token}`
    
    this.ws = new WebSocketManager(wsUrl, {
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      heartbeatInterval: 30000
    })

    // 监听连接打开
    this.ws.on('open', () => {
      console.log('WebSocket连接成功')
      this.setData({ connected: true })
      
      wx.showToast({
        title: '连接成功',
        icon: 'success'
      })
    })

    // 监听聊天消息
    this.ws.on('chat', (data) => {
      console.log('收到聊天消息', data)
      this.addMessage(data)
    })

    // 监听通知消息
    this.ws.on('notification', (data) => {
      console.log('收到通知', data)
      // 可以在这里处理系统通知
    })

    // 监听连接关闭
    this.ws.on('close', () => {
      console.log('WebSocket连接关闭')
      this.setData({ connected: false })
    })

    // 监听错误
    this.ws.on('error', (error) => {
      console.error('WebSocket错误', error)
      wx.showToast({
        title: '连接错误',
        icon: 'none'
      })
    })

    // 开始连接
    this.ws.connect()
  },

  // 发送消息
  sendMessage() {
    const text = this.data.inputText.trim()
    if (!text) return

    const message = {
      type: 'chat',
      content: text,
      timestamp: Date.now(),
      sender: wx.getStorageSync('userInfo').id
    }

    this.ws.send(message)
    
    // 添加到本地消息列表
    this.addMessage({
      ...message,
      isSelf: true
    })

    // 清空输入框
    this.setData({ inputText: '' })
  },

  // 添加消息到列表
  addMessage(message) {
    const messages = [...this.data.messages, message]
    this.setData({ messages })
    
    // 滚动到底部
    this.scrollToBottom()
  },

  // 滚动到底部
  scrollToBottom() {
    wx.createSelectorQuery()
      .select('#message-list')
      .boundingClientRect((rect) => {
        if (rect) {
          wx.pageScrollTo({
            scrollTop: rect.bottom
          })
        }
      })
      .exec()
  },

  // 输入框内容变化
  onInputChange(e) {
    this.setData({
      inputText: e.detail.value
    })
  },

  // 重新连接
  reconnect() {
    if (this.ws) {
      this.ws.connect()
    }
  }
})
```

## 📁 文件上传下载

### 文件上传

```javascript
// utils/upload.js
class UploadManager {
  constructor(options = {}) {
    this.baseURL = options.baseURL || ''
    this.defaultHeaders = options.headers || {}
    this.maxConcurrent = options.maxConcurrent || 3 // 最大并发数
    this.chunkSize = options.chunkSize || 1024 * 1024 // 分片大小 1MB
    
    this.uploadQueue = []
    this.activeUploads = new Map()
  }

  // 上传单个文件
  uploadFile(filePath, options = {}) {
    return new Promise((resolve, reject) => {
      const {
        url = '/upload',
        name = 'file',
        formData = {},
        header = {},
        onProgress = null
      } = options

      const uploadTask = wx.uploadFile({
        url: this.baseURL + url,
        filePath: filePath,
        name: name,
        formData: formData,
        header: {
          ...this.defaultHeaders,
          ...header
        },
        success: (res) => {
          console.log('文件上传成功', res)
          
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch (error) {
            resolve(res.data)
          }
        },
        fail: (error) => {
          console.error('文件上传失败', error)
          reject(error)
        }
      })

      // 监听上传进度
      if (onProgress) {
        uploadTask.onProgressUpdate((res) => {
          onProgress({
            progress: res.progress,
            totalBytesSent: res.totalBytesSent,
            totalBytesExpectedToSend: res.totalBytesExpectedToSend
          })
        })
      }
    })
  }

  // 批量上传文件
  async uploadFiles(filePaths, options = {}) {
    const results = []
    const errors = []

    // 显示总体进度
    wx.showLoading({
      title: `上传中 0/${filePaths.length}`,
      mask: true
    })

    for (let i = 0; i < filePaths.length; i++) {
      try {
        const result = await this.uploadFile(filePaths[i], {
          ...options,
          onProgress: (progress) => {
            // 更新进度显示
            wx.showLoading({
              title: `上传中 ${i + 1}/${filePaths.length} (${progress.progress}%)`,
              mask: true
            })
            
            if (options.onProgress) {
              options.onProgress({
                fileIndex: i,
                fileProgress: progress,
                totalProgress: ((i + progress.progress / 100) / filePaths.length * 100).toFixed(1)
              })
            }
          }
        })
        
        results.push(result)
      } catch (error) {
        errors.push({ index: i, error })
      }
    }

    wx.hideLoading()

    return {
      results,
      errors,
      success: errors.length === 0
    }
  }

  // 选择并上传图片
  async chooseAndUploadImages(options = {}) {
    const {
      count = 9,
      sizeType = ['original', 'compressed'],
      sourceType = ['album', 'camera'],
      uploadOptions = {}
    } = options

    try {
      // 选择图片
      const chooseResult = await new Promise((resolve, reject) => {
        wx.chooseImage({
          count,
          sizeType,
          sourceType,
          success: resolve,
          fail: reject
        })
      })

      // 上传图片
      const uploadResult = await this.uploadFiles(
        chooseResult.tempFilePaths,
        uploadOptions
      )

      return {
        chooseResult,
        uploadResult
      }
    } catch (error) {
      console.error('选择或上传图片失败', error)
      throw error
    }
  }

  // 大文件分片上传
  async uploadLargeFile(filePath, options = {}) {
    const {
      url = '/upload/chunk',
      chunkSize = this.chunkSize,
      onProgress = null
    } = options

    try {
      // 获取文件信息
      const fileInfo = await this.getFileInfo(filePath)
      const totalChunks = Math.ceil(fileInfo.size / chunkSize)
      const fileId = this.generateFileId()

      console.log(`开始分片上传，文件大小: ${fileInfo.size}, 分片数: ${totalChunks}`)

      // 上传各个分片
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize
        const end = Math.min(start + chunkSize, fileInfo.size)
        
        await this.uploadChunk(filePath, {
          fileId,
          chunkIndex: i,
          totalChunks,
          start,
          end,
          url
        })

        // 更新进度
        if (onProgress) {
          onProgress({
            progress: ((i + 1) / totalChunks * 100).toFixed(1),
            chunkIndex: i,
            totalChunks
          })
        }
      }

      // 合并分片
      const result = await this.mergeChunks(fileId, totalChunks)
      console.log('分片上传完成', result)
      
      return result
    } catch (error) {
      console.error('分片上传失败', error)
      throw error
    }
  }

  // 上传单个分片
  uploadChunk(filePath, options) {
    const {
      fileId,
      chunkIndex,
      totalChunks,
      start,
      end,
      url
    } = options

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: this.baseURL + url,
        filePath: filePath,
        name: 'chunk',
        formData: {
          fileId,
          chunkIndex,
          totalChunks,
          start,
          end
        },
        success: (res) => {
          try {
            const data = JSON.parse(res.data)
            resolve(data)
          } catch (error) {
            resolve(res.data)
          }
        },
        fail: reject
      })
    })
  }

  // 合并分片
  mergeChunks(fileId, totalChunks) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + '/upload/merge',
        method: 'POST',
        data: {
          fileId,
          totalChunks
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(res)
          }
        },
        fail: reject
      })
    })
  }

  // 获取文件信息
  getFileInfo(filePath) {
    return new Promise((resolve, reject) => {
      wx.getFileInfo({
        filePath,
        success: resolve,
        fail: reject
      })
    })
  }

  // 生成文件ID
  generateFileId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

module.exports = new UploadManager({
  baseURL: 'https://api.example.com',
  headers: {
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  }
})
```

### 文件下载

```javascript
// utils/download.js
class DownloadManager {
  constructor() {
    this.downloadQueue = []
    this.activeDownloads = new Map()
    this.maxConcurrent = 3
  }

  // 下载单个文件
  downloadFile(url, options = {}) {
    return new Promise((resolve, reject) => {
      const {
        filePath = null,
        header = {},
        onProgress = null
      } = options

      const downloadTask = wx.downloadFile({
        url: url,
        filePath: filePath,
        header: header,
        success: (res) => {
          console.log('文件下载成功', res)
          
          if (res.statusCode === 200) {
            resolve({
              tempFilePath: res.tempFilePath,
              filePath: res.filePath,
              statusCode: res.statusCode
            })
          } else {
            reject({
              statusCode: res.statusCode,
              message: '下载失败'
            })
          }
        },
        fail: (error) => {
          console.error('文件下载失败', error)
          reject(error)
        }
      })

      // 监听下载进度
      if (onProgress) {
        downloadTask.onProgressUpdate((res) => {
          onProgress({
            progress: res.progress,
            totalBytesWritten: res.totalBytesWritten,
            totalBytesExpectedToWrite: res.totalBytesExpectedToWrite
          })
        })
      }
    })
  }

  // 批量下载文件
  async downloadFiles(urls, options = {}) {
    const results = []
    const errors = []

    wx.showLoading({
      title: `下载中 0/${urls.length}`,
      mask: true
    })

    for (let i = 0; i < urls.length; i++) {
      try {
        const result = await this.downloadFile(urls[i], {
          ...options,
          onProgress: (progress) => {
            wx.showLoading({
              title: `下载中 ${i + 1}/${urls.length} (${progress.progress}%)`,
              mask: true
            })
            
            if (options.onProgress) {
              options.onProgress({
                fileIndex: i,
                fileProgress: progress,
                totalProgress: ((i + progress.progress / 100) / urls.length * 100).toFixed(1)
              })
            }
          }
        })
        
        results.push(result)
      } catch (error) {
        errors.push({ index: i, error })
      }
    }

    wx.hideLoading()

    return {
      results,
      errors,
      success: errors.length === 0
    }
  }

  // 下载并保存到相册
  async downloadAndSaveToAlbum(url) {
    try {
      // 下载文件
      const downloadResult = await this.downloadFile(url)
      
      // 保存到相册
      await new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
          filePath: downloadResult.tempFilePath,
          success: resolve,
          fail: reject
        })
      })

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      return downloadResult
    } catch (error) {
      console.error('下载并保存失败', error)
      
      if (error.errMsg && error.errMsg.includes('auth deny')) {
        wx.showModal({
          title: '保存失败',
          content: '需要获取保存到相册的权限',
          confirmText: '去设置',
          success: (res) => {
            if (res.confirm) {
              wx.openSetting()
            }
          }
        })
      } else {
        wx.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
      
      throw error
    }
  }
}

module.exports = new DownloadManager()
```

## 🔄 请求重试和错误处理

### 自动重试机制

```javascript
// utils/retry.js
class RetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3
    this.retryDelay = options.retryDelay || 1000
    this.retryDelayMultiplier = options.retryDelayMultiplier || 2
    this.retryCondition = options.retryCondition || this.defaultRetryCondition
  }

  // 默认重试条件
  defaultRetryCondition(error) {
    // 网络错误或5xx服务器错误时重试
    return error.type === 'network' || 
           (error.statusCode >= 500 && error.statusCode < 600)
  }

  // 执行带重试的请求
  async executeWithRetry(requestFn, options = {}) {
    const {
      maxRetries = this.maxRetries,
      retryDelay = this.retryDelay,
      retryDelayMultiplier = this.retryDelayMultiplier,
      retryCondition = this.retryCondition,
      onRetry = null
    } = options

    let lastError = null
    let currentDelay = retryDelay

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await requestFn()
        return result
      } catch (error) {
        lastError = error
        
        // 检查是否应该重试
        if (attempt < maxRetries && retryCondition(error)) {
          console.log(`请求失败，${currentDelay}ms后进行第${attempt + 1}次重试`, error)
          
          // 触发重试回调
          if (onRetry) {
            onRetry(error, attempt + 1, maxRetries)
          }
          
          // 等待后重试
          await this.delay(currentDelay)
          currentDelay *= retryDelayMultiplier
        } else {
          // 不再重试，抛出最后的错误
          throw lastError
        }
      }
    }
  }

  // 延迟函数
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 使用示例
const http = require('./http')
const retryManager = new RetryManager({
  maxRetries: 3,
  retryDelay: 1000,
  retryDelayMultiplier: 2
})

// 带重试的API调用
async function fetchUserDataWithRetry(userId) {
  return retryManager.executeWithRetry(
    () => http.get(`/users/${userId}`),
    {
      onRetry: (error, attempt, maxRetries) => {
        wx.showToast({
          title: `重试中 ${attempt}/${maxRetries}`,
          icon: 'loading'
        })
      }
    }
  )
}
```

### 错误处理策略

```javascript
// utils/errorHandler.js
class ErrorHandler {
  constructor() {
    this.errorHandlers = new Map()
    this.globalErrorHandler = null
    
    // 注册默认错误处理器
    this.registerDefaultHandlers()
  }

  // 注册错误处理器
  register(errorType, handler) {
    this.errorHandlers.set(errorType, handler)
  }

  // 设置全局错误处理器
  setGlobalHandler(handler) {
    this.globalErrorHandler = handler
  }

  // 处理错误
  handle(error, context = {}) {
    console.error('处理错误', error, context)
    
    // 获取错误类型
    const errorType = this.getErrorType(error)
    
    // 查找对应的错误处理器
    const handler = this.errorHandlers.get(errorType)
    
    if (handler) {
      return handler(error, context)
    } else if (this.globalErrorHandler) {
      return this.globalErrorHandler(error, context)
    } else {
      // 默认错误处理
      this.defaultErrorHandler(error, context)
    }
  }

  // 获取错误类型
  getErrorType(error) {
    if (error.type) {
      return error.type
    }
    
    if (error.statusCode) {
      if (error.statusCode >= 400 && error.statusCode < 500) {
        return 'client_error'
      } else if (error.statusCode >= 500) {
        return 'server_error'
      }
    }
    
    if (error.errMsg) {
      if (error.errMsg.includes('timeout')) {
        return 'timeout'
      } else if (error.errMsg.includes('network')) {
        return 'network'
      }
    }
    
    return 'unknown'
  }

  // 注册默认错误处理器
  registerDefaultHandlers() {
    // 网络错误
    this.register('network', (error, context) => {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    })

    // 超时错误
    this.register('timeout', (error, context) => {
      wx.showToast({
        title: '请求超时',
        icon: 'none'
      })
    })

    // 401 未授权
    this.register('unauthorized', (error, context) => {
      wx.showModal({
        title: '登录过期',
        content: '请重新登录',
        showCancel: false,
        success: () => {
          wx.removeStorageSync('token')
          wx.redirectTo({
            url: '/pages/login/login'
          })
        }
      })
    })

    // 403 禁止访问
    this.register('forbidden', (error, context) => {
      wx.showToast({
        title: '没有访问权限',
        icon: 'none'
      })
    })

    // 404 未找到
    this.register('not_found', (error, context) => {
      wx.showToast({
        title: '请求的资源不存在',
        icon: 'none'
      })
    })

    // 服务器错误
    this.register('server_error', (error, context) => {
      wx.showToast({
        title: '服务器错误，请稍后重试',
        icon: 'none'
      })
    })

    // 客户端错误
    this.register('client_error', (error, context) => {
      const message = error.data?.message || '请求参数错误'
      wx.showToast({
        title: message,
        icon: 'none'
      })
    })
  }

  // 默认错误处理器
  defaultErrorHandler(error, context) {
    wx.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    })
  }
}

module.exports = new ErrorHandler()
```

## 📊 请求监控和统计

### 请求统计

```javascript
// utils/requestMonitor.js
class RequestMonitor {
  constructor() {
    this.stats = {
      totalRequests: 0,
      successRequests: 0,
      failedRequests: 0,
      totalResponseTime: 0,
      averageResponseTime: 0
    }
    
    this.requestHistory = []
    this.maxHistorySize = 100
    
    this.loadStats()
  }

  // 记录请求开始
  recordRequestStart(config) {
    const requestId = this.generateRequestId()
    const startTime = Date.now()
    
    this.requestHistory.push({
      id: requestId,
      url: config.url,
      method: config.method,
      startTime,
      status: 'pending'
    })
    
    return requestId
  }

  // 记录请求成功
  recordRequestSuccess(requestId, response) {
    const request = this.findRequest(requestId)
    if (request) {
      const endTime = Date.now()
      const responseTime = endTime - request.startTime
      
      request.status = 'success'
      request.endTime = endTime
      request.responseTime = responseTime
      request.statusCode = response.statusCode
      
      // 更新统计信息
      this.stats.totalRequests++
      this.stats.successRequests++
      this.stats.totalResponseTime += responseTime
      this.stats.averageResponseTime = this.stats.totalResponseTime / this.stats.totalRequests
      
      this.saveStats()
    }
  }

  // 记录请求失败
  recordRequestFailure(requestId, error) {
    const request = this.findRequest(requestId)
    if (request) {
      const endTime = Date.now()
      const responseTime = endTime - request.startTime
      
      request.status = 'failed'
      request.endTime = endTime
      request.responseTime = responseTime
      request.error = error
      
      // 更新统计信息
      this.stats.totalRequests++
      this.stats.failedRequests++
      this.stats.totalResponseTime += responseTime
      this.stats.averageResponseTime = this.stats.totalResponseTime / this.stats.totalRequests
      
      this.saveStats()
    }
  }

  // 查找请求记录
  findRequest(requestId) {
    return this.requestHistory.find(req => req.id === requestId)
  }

  // 生成请求ID
  generateRequestId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 获取统计信息
  getStats() {
    const successRate = this.stats.totalRequests > 0 ? 
      (this.stats.successRequests / this.stats.totalRequests * 100).toFixed(2) + '%' : '0%'
    
    return {
      ...this.stats,
      successRate
    }
  }

  // 获取请求历史
  getRequestHistory(limit = 50) {
    return this.requestHistory
      .slice(-limit)
      .reverse()
      .map(req => ({
        ...req,
        responseTimeFormatted: req.responseTime ? `${req.responseTime}ms` : '-'
      }))
  }

  // 分析慢请求
  getSlowRequests(threshold = 3000) {
    return this.requestHistory
      .filter(req => req.responseTime && req.responseTime > threshold)
      .sort((a, b) => b.responseTime - a.responseTime)
      .slice(0, 10)
  }

  // 分析错误请求
  getErrorRequests() {
    return this.requestHistory
      .filter(req => req.status === 'failed')
      .slice(-20)
      .reverse()
  }

  // 保存统计信息
  saveStats() {
    try {
      wx.setStorageSync('request_stats', this.stats)
      
      // 限制历史记录大小
      if (this.requestHistory.length > this.maxHistorySize) {
        this.requestHistory = this.requestHistory.slice(-this.maxHistorySize)
      }
      
      wx.setStorageSync('request_history', this.requestHistory)
    } catch (error) {
      console.error('保存请求统计失败', error)
    }
  }

  // 加载统计信息
  loadStats() {
    try {
      const savedStats = wx.getStorageSync('request_stats')
      if (savedStats) {
        this.stats = { ...this.stats, ...savedStats }
      }
      
      const savedHistory = wx.getStorageSync('request_history')
      if (savedHistory && Array.isArray(savedHistory)) {
        this.requestHistory = savedHistory
      }
    } catch (error) {
      console.error('加载请求统计失败', error)
    }
  }

  // 重置统计信息
  resetStats() {
    this.stats = {
      totalRequests: 0,
      successRequests: 0,
      failedRequests: 0,
      totalResponseTime: 0,
      averageResponseTime: 0
    }
    
    this.requestHistory = []
    
    wx.removeStorageSync('request_stats')
    wx.removeStorageSync('request_history')
  }

  // 生成报告
  generateReport() {
    const stats = this.getStats()
    const slowRequests = this.getSlowRequests()
    const errorRequests = this.getErrorRequests()
    
    return {
      summary: stats,
      slowRequests,
      errorRequests,
      generatedAt: new Date().toISOString()
    }
  }
}

module.exports = new RequestMonitor()
```

## 🔧 请求缓存

### HTTP 缓存实现

```javascript
// utils/httpCache.js
class HttpCache {
  constructor(options = {}) {
    this.storage = require('./storage')
    this.defaultTTL = options.defaultTTL || 300 // 默认缓存5分钟
    this.maxCacheSize = options.maxCacheSize || 50 // 最大缓存条目数
    this.cachePrefix = 'http_cache_'
  }

  // 生成缓存key
  generateCacheKey(config) {
    const { url, method = 'GET', data = {} } = config
    const key = `${method}:${url}:${JSON.stringify(data)}`
    return this.cachePrefix + this.hashCode(key)
  }

  // 简单hash函数
  hashCode(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return Math.abs(hash).toString(36)
  }

  // 获取缓存
  get(config) {
    const cacheKey = this.generateCacheKey(config)
    const cached = this.storage.get(cacheKey)
    
    if (!cached) {
      return null
    }

    // 检查是否过期
    const now = Date.now()
    if (cached.expireTime && now > cached.expireTime) {
      this.storage.remove(cacheKey)
      return null
    }

    console.log('使用缓存数据', cacheKey)
    return cached.data
  }

  // 设置缓存
  set(config, data, ttl = this.defaultTTL) {
    const cacheKey = this.generateCacheKey(config)
    const expireTime = ttl > 0 ? Date.now() + ttl * 1000 : null
    
    const cacheData = {
      data,
      timestamp: Date.now(),
      expireTime,
      url: config.url,
      method: config.method
    }

    this.storage.set(cacheKey, cacheData)
    
    // 检查缓存大小
    this.checkCacheSize()
  }

  // 删除缓存
  delete(config) {
    const cacheKey = this.generateCacheKey(config)
    this.storage.remove(cacheKey)
  }

  // 清空所有缓存
  clear() {
    const keys = this.storage.keys()
    keys.forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        this.storage.remove(key.replace(this.cachePrefix, ''))
      }
    })
  }

  // 检查缓存大小
  checkCacheSize() {
    const keys = this.getCacheKeys()
    
    if (keys.length > this.maxCacheSize) {
      // 按时间戳排序，删除最旧的缓存
      const cacheItems = keys.map(key => {
        const data = this.storage.get(key.replace(this.cachePrefix, ''))
        return { key, timestamp: data?.timestamp || 0 }
      }).sort((a, b) => a.timestamp - b.timestamp)
      
      // 删除多余的缓存
      const toDelete = cacheItems.slice(0, keys.length - this.maxCacheSize)
      toDelete.forEach(item => {
        this.storage.remove(item.key.replace(this.cachePrefix, ''))
      })
      
      console.log(`清理了 ${toDelete.length} 个过期缓存`)
    }
  }

  // 获取所有缓存keys
  getCacheKeys() {
    const keys = this.storage.keys()
    return keys.filter(key => key.startsWith(this.cachePrefix))
  }

  // 清理过期缓存
  cleanExpired() {
    const keys = this.getCacheKeys()
    const now = Date.now()
    let cleanedCount = 0
    
    keys.forEach(key => {
      const data = this.storage.get(key.replace(this.cachePrefix, ''))
      if (data && data.expireTime && now > data.expireTime) {
        this.storage.remove(key.replace(this.cachePrefix, ''))
        cleanedCount++
      }
    })
    
    console.log(`清理了 ${cleanedCount} 个过期缓存`)
    return cleanedCount
  }

  // 获取缓存统计
  getStats() {
    const keys = this.getCacheKeys()
    const now = Date.now()
    let validCount = 0
    let expiredCount = 0
    let totalSize = 0
    
    keys.forEach(key => {
      const data = this.storage.get(key.replace(this.cachePrefix, ''))
      if (data) {
        if (data.expireTime && now > data.expireTime) {
          expiredCount++
        } else {
          validCount++
        }
        totalSize += JSON.stringify(data).length
      }
    })
    
    return {
      total: keys.length,
      valid: validCount,
      expired: expiredCount,
      size: totalSize,
      maxSize: this.maxCacheSize
    }
  }
}

module.exports = new HttpCache()
```

## 📚 相关文档

- [API调用](./api-usage.md)
- [数据存储](./data-storage.md)
- [性能优化](./performance.md)
- [页面开发](./page-development.md)

---

掌握网络请求的核心技术，构建高效稳定的小程序网络层！🚀
