# Data Storage

Efficient data storage is essential for mini program performance and user experience. This guide covers local storage, cloud storage, and best practices for data management.

## Local Storage

Mini programs provide persistent local storage APIs with a 10MB limit per app.

### Basic Storage Operations

```javascript
// Store data (async)
wx.setStorage({
  key: 'userInfo',
  data: { name: 'John', theme: 'dark' },
  success: () => console.log('Stored successfully'),
  fail: (err) => console.error('Storage failed:', err)
})

// Retrieve data (async)
wx.getStorage({
  key: 'userInfo',
  success: (res) => {
    this.setData({ userInfo: res.data })
  },
  fail: () => console.log('Key not found')
})

// Synchronous operations (recommended for simple data)
try {
  wx.setStorageSync('settings', { theme: 'dark', lang: 'en' })
  const settings = wx.getStorageSync('settings')
  wx.removeStorageSync('tempData')
} catch (error) {
  console.error('Storage operation failed:', error)
}
```

### Storage Management

```javascript
// Check storage usage
wx.getStorageInfo({
  success: (res) => {
    const usage = (res.currentSize / res.limitSize * 100).toFixed(1)
    console.log(`Storage: ${usage}% used (${res.currentSize}KB/${res.limitSize}KB)`)
    console.log('Keys:', res.keys)
  }
})

// Clean up storage
function cleanupStorage() {
  const info = wx.getStorageInfoSync()
  if (info.currentSize > info.limitSize * 0.8) { // 80% threshold
    // Remove old cache data
    wx.removeStorageSync('cache')
    wx.removeStorageSync('tempData')
  }
}
```

## Data Organization

### Structured Storage

```javascript
// Organize data by purpose
const StorageKeys = {
  USER: 'user_profile',
  SETTINGS: 'app_settings',
  CACHE: 'data_cache',
  TEMP: 'temp_data'
}

// User data structure
const userData = {
  profile: {
    id: '12345',
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg'
  },
  preferences: {
    theme: 'dark',
    language: 'en',
    notifications: true
  },
  metadata: {
    lastLogin: Date.now(),
    version: '1.0.0'
  }
}

wx.setStorageSync(StorageKeys.USER, userData)
```

### Data Validation

```javascript
function validateAndStore(key, data) {
  try {
    // Validate data before storing
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format')
    }
    
    // Add metadata
    const dataWithMeta = {
      data: data,
      timestamp: Date.now(),
      version: '1.0'
    }
    
    wx.setStorageSync(key, dataWithMeta)
    return true
  } catch (error) {
    console.error('Storage validation failed:', error)
    return false
  }
}

function validateAndRetrieve(key) {
  try {
    const stored = wx.getStorageSync(key)
    if (!stored || !stored.data) {
      return null
    }
    
    // Check if data is too old (e.g., 7 days)
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    if (Date.now() - stored.timestamp > maxAge) {
      wx.removeStorageSync(key)
      return null
    }
    
    return stored.data
  } catch (error) {
    console.error('Storage retrieval failed:', error)
    return null
  }
}
```

### 3. Storage Management

```javascript
class StorageManager {
  constructor() {
    this.maxSize = 10 * 1024 // 10MB limit
    this.cleanupThreshold = 0.8 // Clean up when 80% full
  }
  
  set(key, data, options = {}) {
    try {
      const { expiry, priority = 'normal' } = options
      
      const item = {
        data,
        timestamp: Date.now(),
        expiry: expiry ? Date.now() + expiry : null,
        priority,
        size: JSON.stringify(data).length
      }
      
      // Check storage space
      this.checkAndCleanup()
      
      wx.setStorageSync(key, item)
      this.updateIndex(key, item)
      
      return true
    } catch (error) {
      console.error('Failed to store data:', error)
      return false
    }
  }
  
  get(key) {
    try {
      const item = wx.getStorageSync(key)
      if (!item) return null
      
      // Check expiry
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key)
        return null
      }
      
      return item.data
    } catch (error) {
      console.error('Failed to retrieve data:', error)
      return null
    }
  }
  
  remove(key) {
    try {
      wx.removeStorageSync(key)
      this.removeFromIndex(key)
      return true
    } catch (error) {
      console.error('Failed to remove data:', error)
      return false
    }
  }
  
  checkAndCleanup() {
    const info = wx.getStorageInfoSync()
    const usageRatio = info.currentSize / info.limitSize
    
    if (usageRatio > this.cleanupThreshold) {
      this.cleanup()
    }
  }
  
  cleanup() {
    const index = this.getIndex()
    const now = Date.now()
    
    // Remove expired items first
    Object.keys(index).forEach(key => {
      const item = index[key]
      if (item.expiry && now > item.expiry) {
        this.remove(key)
      }
    })
    
    // If still over threshold, remove low priority items
    const info = wx.getStorageInfoSync()
    if (info.currentSize / info.limitSize > this.cleanupThreshold) {
      this.removeLowPriorityItems()
    }
  }
  
  updateIndex(key, item) {
    const index = this.getIndex()
    index[key] = {
      timestamp: item.timestamp,
      expiry: item.expiry,
      priority: item.priority,
      size: item.size
    }
    wx.setStorageSync('_storage_index', index)
  }
  
  getIndex() {
    return wx.getStorageSync('_storage_index') || {}
  }
}

// Usage
const storage = new StorageManager()

// Store data with expiry (1 hour)
storage.set('tempData', { value: 'temporary' }, { 
  expiry: 60 * 60 * 1000,
  priority: 'low'
})

// Store important data
storage.set('userProfile', userProfile, { priority: 'high' })
```

## Cloud Storage

For data that needs to be synchronized across devices or shared between users, consider using cloud storage solutions.

### WeChat Cloud Development

```javascript
// Initialize cloud
wx.cloud.init({
  env: 'your-env-id'
})

// Store data in cloud database
const db = wx.cloud.database()

// Add data
db.collection('users').add({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date()
  }
}).then(res => {
  console.log('Data added to cloud:', res._id)
}).catch(error => {
  console.error('Failed to add data:', error)
})

// Query data
db.collection('users').where({
  name: 'John Doe'
}).get().then(res => {
  console.log('Query result:', res.data)
}).catch(error => {
  console.error('Query failed:', error)
})

// Update data
db.collection('users').doc('user-id').update({
  data: {
    email: 'newemail@example.com',
    updatedAt: new Date()
  }
}).then(res => {
  console.log('Data updated:', res)
}).catch(error => {
  console.error('Update failed:', error)
})
```

### File Storage

```javascript
// Upload file to cloud storage
wx.cloud.uploadFile({
  cloudPath: 'images/avatar.jpg',
  filePath: tempFilePath,
}).then(res => {
  console.log('File uploaded:', res.fileID)
  
  // Store file reference in local storage
  wx.setStorageSync('avatarFileID', res.fileID)
}).catch(error => {
  console.error('Upload failed:', error)
})

// Download file from cloud storage
wx.cloud.downloadFile({
  fileID: 'cloud://env-id.file-id',
}).then(res => {
  console.log('File downloaded:', res.tempFilePath)
}).catch(error => {
  console.error('Download failed:', error)
})
```

## Data Synchronization

### Offline-First Strategy

```javascript
class DataSync {
  constructor() {
    this.syncQueue = []
    this.isOnline = true
    
    // Monitor network status
    wx.onNetworkStatusChange((res) => {
      this.isOnline = res.isConnected
      if (this.isOnline) {
        this.processSyncQueue()
      }
    })
  }
  
  async saveData(key, data, syncToCloud = true) {
    // Always save locally first
    wx.setStorageSync(key, {
      data,
      timestamp: Date.now(),
      synced: false
    })
    
    if (syncToCloud) {
      if (this.isOnline) {
        await this.syncToCloud(key, data)
      } else {
        this.addToSyncQueue(key, data)
      }
    }
  }
  
  async syncToCloud(key, data) {
    try {
      // Sync to cloud storage
      await wx.cloud.database().collection('userData').add({
        data: {
          key,
          data,
          timestamp: Date.now()
        }
      })
      
      // Mark as synced
      const localData = wx.getStorageSync(key)
      localData.synced = true
      wx.setStorageSync(key, localData)
      
    } catch (error) {
      console.error('Sync to cloud failed:', error)
      this.addToSyncQueue(key, data)
    }
  }
  
  addToSyncQueue(key, data) {
    this.syncQueue.push({ key, data, timestamp: Date.now() })
    wx.setStorageSync('syncQueue', this.syncQueue)
  }
  
  async processSyncQueue() {
    const queue = wx.getStorageSync('syncQueue') || []
    
    for (const item of queue) {
      try {
        await this.syncToCloud(item.key, item.data)
        // Remove from queue after successful sync
        this.syncQueue = this.syncQueue.filter(q => q !== item)
      } catch (error) {
        console.error('Failed to sync queued item:', error)
        break // Stop processing if sync fails
      }
    }
    
    wx.setStorageSync('syncQueue', this.syncQueue)
  }
}
```

## Security Considerations

### Data Encryption

```javascript
// Simple encryption utility (for demonstration)
class SecureStorage {
  constructor(secretKey) {
    this.secretKey = secretKey
  }
  
  encrypt(data) {
    // In production, use a proper encryption library
    const jsonString = JSON.stringify(data)
    const encrypted = btoa(jsonString) // Base64 encoding (not secure)
    return encrypted
  }
  
  decrypt(encryptedData) {
    try {
      const decrypted = atob(encryptedData) // Base64 decoding
      return JSON.parse(decrypted)
    } catch (error) {
      console.error('Decryption failed:', error)
      return null
    }
  }
  
  setSecure(key, data) {
    const encrypted = this.encrypt(data)
    wx.setStorageSync(key, encrypted)
  }
  
  getSecure(key) {
    const encrypted = wx.getStorageSync(key)
    if (!encrypted) return null
    return this.decrypt(encrypted)
  }
}

// Usage
const secureStorage = new SecureStorage('your-secret-key')
secureStorage.setSecure('sensitiveData', { token: 'abc123' })
const data = secureStorage.getSecure('sensitiveData')
```

### Data Validation

```javascript
function validateUserData(data) {
  const schema = {
    name: { type: 'string', required: true, maxLength: 50 },
    email: { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age: { type: 'number', min: 0, max: 150 }
  }
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key]
    
    if (rules.required && (value === undefined || value === null)) {
      throw new Error(`${key} is required`)
    }
    
    if (value !== undefined) {
      if (rules.type && typeof value !== rules.type) {
        throw new Error(`${key} must be of type ${rules.type}`)
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        throw new Error(`${key} exceeds maximum length`)
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        throw new Error(`${key} format is invalid`)
      }
      
      if (rules.min !== undefined && value < rules.min) {
        throw new Error(`${key} is below minimum value`)
      }
      
      if (rules.max !== undefined && value > rules.max) {
        throw new Error(`${key} exceeds maximum value`)
      }
    }
  }
  
  return true
}
```

## Performance Optimization

### Lazy Loading

```javascript
class LazyDataLoader {
  constructor() {
    this.cache = new Map()
    this.loadingPromises = new Map()
  }
  
  async getData(key, loader) {
    // Return cached data if available
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }
    
    // Return existing loading promise if already loading
    if (this.loadingPromises.has(key)) {
      return this.loadingPromises.get(key)
    }
    
    // Start loading
    const loadingPromise = this.loadData(key, loader)
    this.loadingPromises.set(key, loadingPromise)
    
    try {
      const data = await loadingPromise
      this.cache.set(key, data)
      return data
    } finally {
      this.loadingPromises.delete(key)
    }
  }
  
  async loadData(key, loader) {
    // Try to load from local storage first
    const localData = wx.getStorageSync(key)
    if (localData && this.isDataFresh(localData)) {
      return localData.data
    }
    
    // Load from remote source
    const data = await loader()
    
    // Cache locally
    wx.setStorageSync(key, {
      data,
      timestamp: Date.now()
    })
    
    return data
  }
  
  isDataFresh(localData, maxAge = 5 * 60 * 1000) { // 5 minutes
    return Date.now() - localData.timestamp < maxAge
  }
}
```

## Testing Storage

```javascript
// Storage testing utilities
class StorageTest {
  static async testStorageCapacity() {
    const testData = 'x'.repeat(1024) // 1KB of data
    let count = 0
    
    try {
      while (true) {
        wx.setStorageSync(`test_${count}`, testData)
        count++
        
        if (count % 100 === 0) {
          console.log(`Stored ${count}KB of data`)
        }
      }
    } catch (error) {
      console.log(`Storage limit reached at approximately ${count}KB`)
      
      // Clean up test data
      for (let i = 0; i < count; i++) {
        wx.removeStorageSync(`test_${i}`)
      }
    }
  }
  
  static testStoragePerformance() {
    const testData = { name: 'Test', value: Math.random() }
    const iterations = 1000
    
    // Test write performance
    const writeStart = Date.now()
    for (let i = 0; i < iterations; i++) {
      wx.setStorageSync(`perf_test_${i}`, testData)
    }
    const writeTime = Date.now() - writeStart
    
    // Test read performance
    const readStart = Date.now()
    for (let i = 0; i < iterations; i++) {
      wx.getStorageSync(`perf_test_${i}`)
    }
    const readTime = Date.now() - readStart
    
    console.log(`Write performance: ${writeTime}ms for ${iterations} operations`)
    console.log(`Read performance: ${readTime}ms for ${iterations} operations`)
    
    // Clean up
    for (let i = 0; i < iterations; i++) {
      wx.removeStorageSync(`perf_test_${i}`)
    }
  }
}
```

## Best Practices Summary

1. **Use Appropriate Storage Type**:
   - Local storage for user preferences and cached data
   - Cloud storage for data that needs synchronization
   - Session storage for temporary data

2. **Implement Data Validation**:
   - Validate data before storing
   - Handle storage errors gracefully
   - Use schemas for complex data structures

3. **Manage Storage Space**:
   - Monitor storage usage
   - Implement cleanup strategies
   - Use data compression when appropriate

4. **Ensure Data Security**:
   - Encrypt sensitive data
   - Validate data integrity
   - Never store passwords or tokens in plain text

5. **Optimize Performance**:
   - Use lazy loading for large datasets
   - Implement caching strategies
   - Batch storage operations when possible

6. **Plan for Offline Scenarios**:
   - Implement offline-first strategies
   - Queue operations for later synchronization
   - Provide meaningful feedback to users

## Next Steps

Now that you understand data storage in mini programs, you can explore:

- [Network Requests](./network-requests.md) for fetching remote data
- [Performance Optimization](./performance-optimization.md) for improving app performance
- [Security Best Practices](./security.md) for protecting user data
- [Testing Strategies](./testing.md) for ensuring data reliability