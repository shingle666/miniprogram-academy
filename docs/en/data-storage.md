# Data Storage

This guide covers data storage solutions in mini-program development, including local storage, cloud storage, database integration, and data synchronization strategies.

## 📋 Table of Contents

- [Local Storage](#local-storage)
- [Cloud Storage](#cloud-storage)
- [Database Integration](#database-integration)
- [Data Synchronization](#data-synchronization)
- [Caching Strategies](#caching-strategies)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)

## 💾 Local Storage

### Storage APIs
```javascript
// Synchronous storage
wx.setStorageSync('key', 'value')
const value = wx.getStorageSync('key')
wx.removeStorageSync('key')
wx.clearStorageSync()

// Asynchronous storage
wx.setStorage({
  key: 'userInfo',
  data: {
    name: 'John Doe',
    age: 30
  },
  success: () => console.log('Data saved'),
  fail: (error) => console.error('Save failed:', error)
})

wx.getStorage({
  key: 'userInfo',
  success: (res) => console.log('Data:', res.data),
  fail: (error) => console.error('Get failed:', error)
})
```

### Storage Wrapper Class
```javascript
class StorageManager {
  static set(key, value, encrypt = false) {
    try {
      const data = encrypt ? this.encrypt(value) : value
      wx.setStorageSync(key, data)
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }
  
  static get(key, defaultValue = null, decrypt = false) {
    try {
      const data = wx.getStorageSync(key)
      if (data === '') return defaultValue
      
      return decrypt ? this.decrypt(data) : data
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  }
  
  static remove(key) {
    try {
      wx.removeStorageSync(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }
  
  static clear() {
    try {
      wx.clearStorageSync()
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }
  
  static getInfo() {
    try {
      return wx.getStorageInfoSync()
    } catch (error) {
      console.error('Storage info error:', error)
      return null
    }
  }
  
  static encrypt(data) {
    // Simple encryption (use proper encryption in production)
    return btoa(JSON.stringify(data))
  }
  
  static decrypt(data) {
    try {
      return JSON.parse(atob(data))
    } catch (error) {
      return data
    }
  }
}

// Usage
StorageManager.set('user', { name: 'John', age: 30 })
const user = StorageManager.get('user', {})
```

### Data Models
```javascript
class UserModel {
  constructor(data = {}) {
    this.id = data.id || null
    this.name = data.name || ''
    this.email = data.email || ''
    this.avatar = data.avatar || ''
    this.preferences = data.preferences || {}
    this.createdAt = data.createdAt || new Date().toISOString()
    this.updatedAt = data.updatedAt || new Date().toISOString()
  }
  
  save() {
    this.updatedAt = new Date().toISOString()
    StorageManager.set(`user_${this.id}`, this.toJSON())
    return this
  }
  
  static find(id) {
    const data = StorageManager.get(`user_${id}`)
    return data ? new UserModel(data) : null
  }
  
  static findAll() {
    const info = StorageManager.getInfo()
    const users = []
    
    if (info && info.keys) {
      info.keys.forEach(key => {
        if (key.startsWith('user_')) {
          const data = StorageManager.get(key)
          if (data) users.push(new UserModel(data))
        }
      })
    }
    
    return users
  }
  
  delete() {
    return StorageManager.remove(`user_${this.id}`)
  }
  
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      preferences: this.preferences,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
}
```

## ☁️ Cloud Storage

### WeChat Cloud Storage
```javascript
// Initialize cloud
wx.cloud.init({
  env: 'your-cloud-env-id'
})

// Upload file
function uploadFile(filePath) {
  return wx.cloud.uploadFile({
    cloudPath: `images/${Date.now()}.jpg`,
    filePath: filePath
  })
}

// Download file
function downloadFile(fileID) {
  return wx.cloud.downloadFile({
    fileID: fileID
  })
}

// Delete file
function deleteFile(fileIDList) {
  return wx.cloud.deleteFile({
    fileList: fileIDList
  })
}

// Get temporary URL
function getTempFileURL(fileIDList) {
  return wx.cloud.getTempFileURL({
    fileList: fileIDList
  })
}
```

### File Upload Manager
```javascript
class FileUploadManager {
  constructor() {
    this.uploadQueue = []
    this.maxConcurrent = 3
    this.currentUploads = 0
  }
  
  async uploadFile(filePath, cloudPath, onProgress) {
    return new Promise((resolve, reject) => {
      const uploadTask = {
        filePath,
        cloudPath,
        onProgress,
        resolve,
        reject
      }
      
      this.uploadQueue.push(uploadTask)
      this.processQueue()
    })
  }
  
  async processQueue() {
    if (this.currentUploads >= this.maxConcurrent || this.uploadQueue.length === 0) {
      return
    }
    
    const task = this.uploadQueue.shift()
    this.currentUploads++
    
    try {
      const result = await wx.cloud.uploadFile({
        cloudPath: task.cloudPath,
        filePath: task.filePath,
        success: (res) => {
          if (task.onProgress) {
            task.onProgress(100)
          }
          task.resolve(res)
        },
        fail: (error) => {
          task.reject(error)
        }
      })
    } catch (error) {
      task.reject(error)
    } finally {
      this.currentUploads--
      this.processQueue() // Process next in queue
    }
  }
  
  async uploadMultiple(files) {
    const promises = files.map(file => 
      this.uploadFile(file.path, file.cloudPath, file.onProgress)
    )
    
    return Promise.allSettled(promises)
  }
}

// Usage
const uploadManager = new FileUploadManager()

uploadManager.uploadFile(
  '/temp/image.jpg',
  'user-uploads/image.jpg',
  (progress) => console.log(`Upload progress: ${progress}%`)
).then(result => {
  console.log('Upload successful:', result.fileID)
}).catch(error => {
  console.error('Upload failed:', error)
})
```

## 🗄️ Database Integration

### Cloud Database Operations
```javascript
// Get database reference
const db = wx.cloud.database()
const users = db.collection('users')

// Add document
async function addUser(userData) {
  try {
    const result = await users.add({
      data: {
        ...userData,
        createTime: db.serverDate()
      }
    })
    console.log('User added:', result._id)
    return result
  } catch (error) {
    console.error('Add user failed:', error)
    throw error
  }
}

// Query documents
async function getUsers(limit = 20) {
  try {
    const result = await users
      .orderBy('createTime', 'desc')
      .limit(limit)
      .get()
    
    return result.data
  } catch (error) {
    console.error('Get users failed:', error)
    return []
  }
}

// Update document
async function updateUser(userId, updates) {
  try {
    const result = await users.doc(userId).update({
      data: {
        ...updates,
        updateTime: db.serverDate()
      }
    })
    return result
  } catch (error) {
    console.error('Update user failed:', error)
    throw error
  }
}

// Delete document
async function deleteUser(userId) {
  try {
    const result = await users.doc(userId).remove()
    return result
  } catch (error) {
    console.error('Delete user failed:', error)
    throw error
  }
}
```

### Database Query Builder
```javascript
class QueryBuilder {
  constructor(collection) {
    this.collection = collection
    this.query = {}
    this.sortOptions = []
    this.limitCount = null
    this.skipCount = null
  }
  
  where(field, operator, value) {
    if (!this.query[field]) {
      this.query[field] = {}
    }
    
    switch (operator) {
      case '==':
        this.query[field] = value
        break
      case '!=':
        this.query[field] = db.command.neq(value)
        break
      case '>':
        this.query[field] = db.command.gt(value)
        break
      case '>=':
        this.query[field] = db.command.gte(value)
        break
      case '<':
        this.query[field] = db.command.lt(value)
        break
      case '<=':
        this.query[field] = db.command.lte(value)
        break
      case 'in':
        this.query[field] = db.command.in(value)
        break
      case 'contains':
        this.query[field] = db.RegExp({
          regexp: value,
          options: 'i'
        })
        break
    }
    
    return this
  }
  
  orderBy(field, direction = 'asc') {
    this.sortOptions.push({ field, direction })
    return this
  }
  
  limit(count) {
    this.limitCount = count
    return this
  }
  
  skip(count) {
    this.skipCount = count
    return this
  }
  
  async get() {
    let query = this.collection.where(this.query)
    
    // Apply sorting
    this.sortOptions.forEach(sort => {
      query = query.orderBy(sort.field, sort.direction)
    })
    
    // Apply pagination
    if (this.skipCount) {
      query = query.skip(this.skipCount)
    }
    
    if (this.limitCount) {
      query = query.limit(this.limitCount)
    }
    
    try {
      const result = await query.get()
      return result.data
    } catch (error) {
      console.error('Query failed:', error)
      return []
    }
  }
}

// Usage
const userQuery = new QueryBuilder(db.collection('users'))
const activeUsers = await userQuery
  .where('status', '==', 'active')
  .where('age', '>=', 18)
  .orderBy('createTime', 'desc')
  .limit(10)
  .get()
```

## 🔄 Data Synchronization

### Sync Manager
```javascript
class SyncManager {
  constructor() {
    this.syncQueue = []
    this.isSyncing = false
    this.lastSyncTime = StorageManager.get('lastSyncTime', 0)
  }
  
  async syncData() {
    if (this.isSyncing) return
    
    this.isSyncing = true
    
    try {
      // Sync local changes to server
      await this.syncLocalChanges()
      
      // Sync server changes to local
      await this.syncServerChanges()
      
      this.lastSyncTime = Date.now()
      StorageManager.set('lastSyncTime', this.lastSyncTime)
      
      console.log('Sync completed successfully')
    } catch (error) {
      console.error('Sync failed:', error)
    } finally {
      this.isSyncing = false
    }
  }
  
  async syncLocalChanges() {
    const pendingChanges = StorageManager.get('pendingChanges', [])
    
    for (const change of pendingChanges) {
      try {
        await this.applyChangeToServer(change)
        
        // Remove from pending changes
        const index = pendingChanges.indexOf(change)
        if (index > -1) {
          pendingChanges.splice(index, 1)
        }
      } catch (error) {
        console.error('Failed to sync change:', change, error)
      }
    }
    
    StorageManager.set('pendingChanges', pendingChanges)
  }
  
  async syncServerChanges() {
    try {
      const serverChanges = await this.getServerChanges(this.lastSyncTime)
      
      for (const change of serverChanges) {
        await this.applyChangeLocally(change)
      }
    } catch (error) {
      console.error('Failed to sync server changes:', error)
    }
  }
  
  addPendingChange(change) {
    const pendingChanges = StorageManager.get('pendingChanges', [])
    pendingChanges.push({
      ...change,
      timestamp: Date.now(),
      id: this.generateId()
    })
    StorageManager.set('pendingChanges', pendingChanges)
  }
  
  async applyChangeToServer(change) {
    // Implementation depends on your server API
    const response = await wx.request({
      url: 'https://api.example.com/sync',
      method: 'POST',
      data: change
    })
    
    if (response.statusCode !== 200) {
      throw new Error(`Server error: ${response.statusCode}`)
    }
    
    return response.data
  }
  
  async getServerChanges(since) {
    const response = await wx.request({
      url: `https://api.example.com/changes?since=${since}`,
      method: 'GET'
    })
    
    if (response.statusCode === 200) {
      return response.data.changes || []
    }
    
    return []
  }
  
  async applyChangeLocally(change) {
    switch (change.type) {
      case 'create':
        StorageManager.set(change.key, change.data)
        break
      case 'update':
        const existing = StorageManager.get(change.key, {})
        StorageManager.set(change.key, { ...existing, ...change.data })
        break
      case 'delete':
        StorageManager.remove(change.key)
        break
    }
  }
  
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }
}

// Usage
const syncManager = new SyncManager()

// Add change to sync queue
syncManager.addPendingChange({
  type: 'update',
  key: 'user_123',
  data: { name: 'Updated Name' }
})

// Sync data
syncManager.syncData()
```

## 🚀 Caching Strategies

### Cache Manager
```javascript
class CacheManager {
  constructor() {
    this.cache = new Map()
    this.maxSize = 100
    this.ttl = 5 * 60 * 1000 // 5 minutes
  }
  
  set(key, value, ttl = this.ttl) {
    // Remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl
    })
  }
  
  get(key) {
    const item = this.cache.get(key)
    
    if (!item) return null
    
    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
  
  has(key) {
    return this.get(key) !== null
  }
  
  delete(key) {
    return this.cache.delete(key)
  }
  
  clear() {
    this.cache.clear()
  }
  
  cleanup() {
    const now = Date.now()
    
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Global cache instance
const cache = new CacheManager()

// Cleanup expired entries every minute
setInterval(() => {
  cache.cleanup()
}, 60 * 1000)
```

### HTTP Cache Wrapper
```javascript
class HTTPCache {
  constructor(cacheManager) {
    this.cache = cacheManager
  }
  
  async request(options) {
    const cacheKey = this.getCacheKey(options)
    
    // Try to get from cache first
    const cached = this.cache.get(cacheKey)
    if (cached) {
      console.log('Cache hit:', cacheKey)
      return cached
    }
    
    try {
      // Make actual request
      const response = await wx.request(options)
      
      // Cache successful responses
      if (response.statusCode === 200) {
        this.cache.set(cacheKey, response, this.getTTL(options))
      }
      
      return response
    } catch (error) {
      console.error('Request failed:', error)
      throw error
    }
  }
  
  getCacheKey(options) {
    return `${options.method || 'GET'}_${options.url}_${JSON.stringify(options.data || {})}`
  }
  
  getTTL(options) {
    // Different TTL for different endpoints
    if (options.url.includes('/user/profile')) {
      return 10 * 60 * 1000 // 10 minutes
    }
    
    if (options.url.includes('/config')) {
      return 60 * 60 * 1000 // 1 hour
    }
    
    return 5 * 60 * 1000 // 5 minutes default
  }
}

// Usage
const httpCache = new HTTPCache(cache)

const userData = await httpCache.request({
  url: 'https://api.example.com/user/profile',
  method: 'GET'
})
```

## 🔒 Security Considerations

### Data Encryption
```javascript
class SecureStorage {
  constructor(secretKey) {
    this.secretKey = secretKey
  }
  
  encrypt(data) {
    // Simple XOR encryption (use proper encryption in production)
    const jsonString = JSON.stringify(data)
    let encrypted = ''
    
    for (let i = 0; i < jsonString.length; i++) {
      const charCode = jsonString.charCodeAt(i)
      const keyChar = this.secretKey.charCodeAt(i % this.secretKey.length)
      encrypted += String.fromCharCode(charCode ^ keyChar)
    }
    
    return btoa(encrypted)
  }
  
  decrypt(encryptedData) {
    try {
      const encrypted = atob(encryptedData)
      let decrypted = ''
      
      for (let i = 0; i < encrypted.length; i++) {
        const charCode = encrypted.charCodeAt(i)
        const keyChar = this.secretKey.charCodeAt(i % this.secretKey.length)
        decrypted += String.fromCharCode(charCode ^ keyChar)
      }
      
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  }
  
  setSecure(key, value) {
    const encrypted = this.encrypt(value)
    StorageManager.set(key, encrypted)
  }
  
  getSecure(key, defaultValue = null) {
    const encrypted = StorageManager.get(key)
    if (!encrypted) return defaultValue
    
    const decrypted = this.decrypt(encrypted)
    return decrypted !== null ? decrypted : defaultValue
  }
}

// Usage
const secureStorage = new SecureStorage('your-secret-key')
secureStorage.setSecure('sensitive_data', { token: 'abc123' })
const data = secureStorage.getSecure('sensitive_data')
```

## 🎯 Best Practices

### Data Validation
```javascript
class DataValidator {
  static validateUser(userData) {
    const errors = []
    
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters')
    }
    
    if (!userData.email || !this.isValidEmail(userData.email)) {
      errors.push('Valid email is required')
    }
    
    if (userData.age && (userData.age < 0 || userData.age > 150)) {
      errors.push('Age must be between 0 and 150')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
  
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000) // Limit length
  }
}
```

### Error Handling
```javascript
class StorageError extends Error {
  constructor(message, code, originalError) {
    super(message)
    this.name = 'StorageError'
    this.code = code
    this.originalError = originalError
  }
}

class RobustStorage {
  static async safeOperation(operation, fallback = null) {
    try {
      return await operation()
    } catch (error) {
      console.error('Storage operation failed:', error)
      
      // Report error to monitoring service
      this.reportError(error)
      
      return fallback
    }
  }
  
  static async set(key, value) {
    return this.safeOperation(async () => {
      // Validate input
      if (!key || typeof key !== 'string') {
        throw new StorageError('Invalid key', 'INVALID_KEY')
      }
      
      // Check storage quota
      const info = wx.getStorageInfoSync()
      if (info.currentSize > 8 * 1024) { // 8MB limit
        throw new StorageError('Storage quota exceeded', 'QUOTA_EXCEEDED')
      }
      
      wx.setStorageSync(key, value)
      return true
    }, false)
  }
  
  static async get(key, defaultValue = null) {
    return this.safeOperation(async () => {
      const value = wx.getStorageSync(key)
      return value !== '' ? value : defaultValue
    }, defaultValue)
  }
  
  static reportError(error) {
    // Send error to monitoring service
    console.error('Storage error reported:', error)
  }
}
```

---

Effective data storage is crucial for mini-program performance and user experience. Choose the right storage solution based on your data requirements, implement proper caching strategies, and always consider security and error handling in your storage implementation.