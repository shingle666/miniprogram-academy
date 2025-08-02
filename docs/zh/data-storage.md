# 数据存储

深入了解小程序的数据存储方案，包括本地存储、云存储和数据库操作的最佳实践。

## 💾 本地存储

### Storage API 基础用法

#### 同步存储
```javascript
// 存储数据
try {
  wx.setStorageSync('userInfo', {
    id: 1,
    name: '张三',
    avatar: 'https://example.com/avatar.jpg',
    loginTime: Date.now()
  })
  
  wx.setStorageSync('settings', {
    theme: 'dark',
    language: 'zh-CN',
    notifications: true
  })
  
  console.log('数据存储成功')
} catch (error) {
  console.error('存储失败', error)
}

// 读取数据
try {
  const userInfo = wx.getStorageSync('userInfo')
  const settings = wx.getStorageSync('settings')
  
  if (userInfo) {
    console.log('用户信息', userInfo)
    this.setData({ userInfo })
  }
  
  if (settings) {
    console.log('设置信息', settings)
    this.setData({ settings })
  }
} catch (error) {
  console.error('读取失败', error)
}

// 删除数据
try {
  wx.removeStorageSync('userInfo')
  console.log('删除成功')
} catch (error) {
  console.error('删除失败', error)
}

// 清空所有数据
try {
  wx.clearStorageSync()
  console.log('清空成功')
} catch (error) {
  console.error('清空失败', error)
}
```

#### 异步存储
```javascript
// 存储数据
wx.setStorage({
  key: 'userToken',
  data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  success: () => {
    console.log('Token存储成功')
  },
  fail: (error) => {
    console.error('Token存储失败', error)
  }
})

// 读取数据
wx.getStorage({
  key: 'userToken',
  success: (res) => {
    console.log('Token读取成功', res.data)
    // 使用token进行API请求
    this.makeAuthenticatedRequest(res.data)
  },
  fail: (error) => {
    console.error('Token读取失败', error)
    // 跳转到登录页面
    wx.redirectTo({
      url: '/pages/login/login'
    })
  }
})

// 删除数据
wx.removeStorage({
  key: 'userToken',
  success: () => {
    console.log('Token删除成功')
    // 跳转到登录页面
    wx.redirectTo({
      url: '/pages/login/login'
    })
  }
})

// 获取存储信息
wx.getStorageInfo({
  success: (res) => {
    console.log('存储信息', res)
    /*
    {
      keys: ['userInfo', 'settings', 'cache'],
      currentSize: 2, // 当前占用空间大小，单位KB
      limitSize: 10240 // 限制空间大小，单位KB
    }
    */
    
    // 检查存储空间使用情况
    const usage = (res.currentSize / res.limitSize * 100).toFixed(2)
    console.log(`存储空间使用率: ${usage}%`)
    
    if (usage > 80) {
      wx.showModal({
        title: '存储空间不足',
        content: '存储空间使用率过高，建议清理缓存',
        confirmText: '清理',
        success: (modalRes) => {
          if (modalRes.confirm) {
            this.clearCache()
          }
        }
      })
    }
  }
})
```

### 存储工具类封装

```javascript
// utils/storage.js
class StorageManager {
  constructor() {
    this.prefix = 'mp_' // 存储前缀，避免冲突
    this.maxSize = 10 * 1024 * 1024 // 最大存储限制 10MB
  }

  // 生成完整的key
  getFullKey(key) {
    return `${this.prefix}${key}`
  }

  // 设置存储（支持过期时间和加密）
  set(key, data, options = {}) {
    try {
      const fullKey = this.getFullKey(key)
      const {
        expire = null, // 过期时间（秒）
        encrypt = false, // 是否加密
        compress = false // 是否压缩
      } = options

      let processedData = data

      // 数据压缩
      if (compress && typeof data === 'object') {
        processedData = this.compress(JSON.stringify(data))
      }

      // 数据加密
      if (encrypt) {
        processedData = this.encrypt(processedData)
      }

      const item = {
        data: processedData,
        timestamp: Date.now(),
        expire: expire ? Date.now() + expire * 1000 : null,
        encrypted: encrypt,
        compressed: compress,
        version: '1.0'
      }

      wx.setStorageSync(fullKey, item)
      return true
    } catch (error) {
      console.error('存储失败', error)
      return false
    }
  }

  // 获取存储
  get(key, defaultValue = null) {
    try {
      const fullKey = this.getFullKey(key)
      const item = wx.getStorageSync(fullKey)

      if (!item) {
        return defaultValue
      }

      // 检查版本兼容性
      if (!item.version) {
        this.remove(key)
        return defaultValue
      }

      // 检查是否过期
      if (item.expire && Date.now() > item.expire) {
        this.remove(key)
        return defaultValue
      }

      let data = item.data

      // 数据解密
      if (item.encrypted) {
        data = this.decrypt(data)
      }

      // 数据解压缩
      if (item.compressed) {
        data = JSON.parse(this.decompress(data))
      }

      return data
    } catch (error) {
      console.error('读取存储失败', error)
      return defaultValue
    }
  }

  // 删除存储
  remove(key) {
    try {
      const fullKey = this.getFullKey(key)
      wx.removeStorageSync(fullKey)
      return true
    } catch (error) {
      console.error('删除存储失败', error)
      return false
    }
  }

  // 检查key是否存在
  has(key) {
    try {
      const fullKey = this.getFullKey(key)
      const item = wx.getStorageSync(fullKey)
      
      if (!item) return false

      // 检查是否过期
      if (item.expire && Date.now() > item.expire) {
        this.remove(key)
        return false
      }

      return true
    } catch (error) {
      return false
    }
  }

  // 获取所有keys
  keys() {
    try {
      const info = wx.getStorageInfoSync()
      return info.keys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.replace(this.prefix, ''))
    } catch (error) {
      console.error('获取keys失败', error)
      return []
    }
  }

  // 清空所有存储
  clear() {
    try {
      const keys = this.keys()
      keys.forEach(key => this.remove(key))
      return true
    } catch (error) {
      console.error('清空存储失败', error)
      return false
    }
  }

  // 获取存储大小信息
  getStorageInfo() {
    try {
      const info = wx.getStorageInfoSync()
      return {
        keys: info.keys.filter(key => key.startsWith(this.prefix)),
        currentSize: info.currentSize,
        limitSize: info.limitSize,
        usage: (info.currentSize / info.limitSize * 100).toFixed(2) + '%'
      }
    } catch (error) {
      console.error('获取存储信息失败', error)
      return null
    }
  }

  // 清理过期数据
  cleanExpired() {
    try {
      const keys = this.keys()
      let cleanedCount = 0

      keys.forEach(key => {
        const fullKey = this.getFullKey(key)
        const item = wx.getStorageSync(fullKey)
        
        if (item && item.expire && Date.now() > item.expire) {
          this.remove(key)
          cleanedCount++
        }
      })

      console.log(`清理了 ${cleanedCount} 个过期数据`)
      return cleanedCount
    } catch (error) {
      console.error('清理过期数据失败', error)
      return 0
    }
  }

  // 数据压缩（简单实现）
  compress(str) {
    // 这里可以使用更复杂的压缩算法
    return str
  }

  // 数据解压缩
  decompress(str) {
    return str
  }

  // 数据加密（简单实现）
  encrypt(data) {
    // 这里应该使用真正的加密算法
    return btoa(JSON.stringify(data))
  }

  // 数据解密
  decrypt(encryptedData) {
    try {
      return JSON.parse(atob(encryptedData))
    } catch (error) {
      console.error('解密失败', error)
      return null
    }
  }

  // 批量操作
  batch(operations) {
    const results = []
    
    operations.forEach(op => {
      try {
        switch (op.type) {
          case 'set':
            results.push(this.set(op.key, op.data, op.options))
            break
          case 'get':
            results.push(this.get(op.key, op.defaultValue))
            break
          case 'remove':
            results.push(this.remove(op.key))
            break
          default:
            results.push(false)
        }
      } catch (error) {
        console.error('批量操作失败', error)
        results.push(false)
      }
    })

    return results
  }
}

// 创建单例
const storage = new StorageManager()

module.exports = storage
```

### 使用示例

```javascript
// pages/profile/profile.js
const storage = require('../../utils/storage')

Page({
  data: {
    userInfo: null,
    settings: null
  },

  onLoad() {
    this.loadUserData()
  },

  // 加载用户数据
  loadUserData() {
    // 获取用户信息
    const userInfo = storage.get('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }

    // 获取设置信息（带默认值）
    const settings = storage.get('settings', {
      theme: 'light',
      language: 'zh-CN',
      notifications: true
    })
    this.setData({ settings })

    // 获取缓存数据（1小时过期）
    const cacheData = storage.get('cache_data')
    if (!cacheData) {
      this.loadDataFromServer()
    }
  },

  // 保存用户信息
  saveUserInfo(userInfo) {
    // 保存用户信息（7天过期，加密存储）
    storage.set('userInfo', userInfo, {
      expire: 7 * 24 * 3600, // 7天
      encrypt: true
    })

    this.setData({ userInfo })
  },

  // 保存设置
  saveSettings(settings) {
    storage.set('settings', settings)
    this.setData({ settings })
  },

  // 从服务器加载数据
  async loadDataFromServer() {
    try {
      wx.showLoading({ title: '加载中...' })
      
      const data = await this.fetchDataFromAPI()
      
      // 缓存数据（1小时过期，压缩存储）
      storage.set('cache_data', data, {
        expire: 3600, // 1小时
        compress: true
      })
      
      this.processData(data)
    } catch (error) {
      console.error('加载数据失败', error)
    } finally {
      wx.hideLoading()
    }
  },

  // 清理缓存
  clearCache() {
    // 清理过期数据
    const cleanedCount = storage.cleanExpired()
    
    // 清理特定缓存
    storage.remove('cache_data')
    storage.remove('temp_data')
    
    wx.showToast({
      title: `清理了${cleanedCount}个过期数据`,
      icon: 'success'
    })
  },

  // 查看存储信息
  viewStorageInfo() {
    const info = storage.getStorageInfo()
    if (info) {
      wx.showModal({
        title: '存储信息',
        content: `已使用: ${info.currentSize}KB\n总容量: ${info.limitSize}KB\n使用率: ${info.usage}`,
        showCancel: false
      })
    }
  }
})
```

## ☁️ 云存储

### 云开发初始化

```javascript
// app.js
App({
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id', // 云开发环境ID
        traceUser: true // 是否在将用户访问记录到用户管理中
      })
      
      console.log('云开发初始化成功')
    } else {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    }
  }
})
```

### 云数据库操作

```javascript
// 获取数据库引用
const db = wx.cloud.database()

// 获取集合引用
const users = db.collection('users')
const posts = db.collection('posts')

// 添加数据
async function addUser(userData) {
  try {
    const result = await users.add({
      data: {
        ...userData,
        createTime: db.serverDate(), // 服务器时间
        updateTime: db.serverDate()
      }
    })
    
    console.log('添加成功', result)
    return result._id
  } catch (error) {
    console.error('添加失败', error)
    throw error
  }
}

// 查询数据
async function getUsers(page = 1, limit = 20) {
  try {
    const result = await users
      .orderBy('createTime', 'desc')
      .skip((page - 1) * limit)
      .limit(limit)
      .get()
    
    console.log('查询成功', result)
    return result.data
  } catch (error) {
    console.error('查询失败', error)
    throw error
  }
}

// 条件查询
async function getUsersByCondition(condition) {
  try {
    const _ = db.command
    
    const result = await users
      .where({
        age: _.gte(18), // 年龄大于等于18
        status: _.in(['active', 'pending']), // 状态在指定范围内
        name: _.exists(true), // 名称字段存在
        ...condition
      })
      .get()
    
    return result.data
  } catch (error) {
    console.error('条件查询失败', error)
    throw error
  }
}

// 更新数据
async function updateUser(userId, updateData) {
  try {
    const result = await users.doc(userId).update({
      data: {
        ...updateData,
        updateTime: db.serverDate()
      }
    })
    
    console.log('更新成功', result)
    return result
  } catch (error) {
    console.error('更新失败', error)
    throw error
  }
}

// 删除数据
async function deleteUser(userId) {
  try {
    const result = await users.doc(userId).remove()
    console.log('删除成功', result)
    return result
  } catch (error) {
    console.error('删除失败', error)
    throw error
  }
}

// 聚合查询
async function getUserStats() {
  try {
    const result = await users.aggregate()
      .group({
        _id: '$status',
        count: db.command.aggregate.sum(1),
        avgAge: db.command.aggregate.avg('$age')
      })
      .end()
    
    console.log('统计结果', result)
    return result.list
  } catch (error) {
    console.error('聚合查询失败', error)
    throw error
  }
}
```

### 云存储文件操作

```javascript
// 上传文件
async function uploadFile(filePath, cloudPath) {
  try {
    wx.showLoading({ title: '上传中...' })
    
    const result = await wx.cloud.uploadFile({
      cloudPath: cloudPath, // 云端路径
      filePath: filePath // 本地文件路径
    })
    
    console.log('上传成功', result)
    return result.fileID
  } catch (error) {
    console.error('上传失败', error)
    throw error
  } finally {
    wx.hideLoading()
  }
}

// 下载文件
async function downloadFile(fileID) {
  try {
    wx.showLoading({ title: '下载中...' })
    
    const result = await wx.cloud.downloadFile({
      fileID: fileID
    })
    
    console.log('下载成功', result)
    return result.tempFilePath
  } catch (error) {
    console.error('下载失败', error)
    throw error
  } finally {
    wx.hideLoading()
  }
}

// 删除文件
async function deleteFile(fileIDs) {
  try {
    const result = await wx.cloud.deleteFile({
      fileList: Array.isArray(fileIDs) ? fileIDs : [fileIDs]
    })
    
    console.log('删除结果', result)
    return result.fileList
  } catch (error) {
    console.error('删除失败', error)
    throw error
  }
}

// 获取文件下载链接
async function getTempFileURL(fileIDs) {
  try {
    const result = await wx.cloud.getTempFileURL({
      fileList: Array.isArray(fileIDs) ? fileIDs : [fileIDs]
    })
    
    console.log('获取链接成功', result)
    return result.fileList
  } catch (error) {
    console.error('获取链接失败', error)
    throw error
  }
}
```

### 云函数调用

```javascript
// 调用云函数
async function callCloudFunction(name, data = {}) {
  try {
    wx.showLoading({ title: '处理中...' })
    
    const result = await wx.cloud.callFunction({
      name: name,
      data: data
    })
    
    console.log('云函数调用成功', result)
    return result.result
  } catch (error) {
    console.error('云函数调用失败', error)
    throw error
  } finally {
    wx.hideLoading()
  }
}

// 使用示例
Page({
  async onLoad() {
    try {
      // 调用登录云函数
      const loginResult = await callCloudFunction('login', {
        code: 'wx-code'
      })
      
      // 调用数据处理云函数
      const processResult = await callCloudFunction('processData', {
        type: 'user',
        action: 'analyze'
      })
      
      console.log('处理结果', processResult)
    } catch (error) {
      wx.showToast({
        title: '操作失败',
        icon: 'none'
      })
    }
  }
})
```

## 🗄️ 数据管理最佳实践

### 数据分层存储

```javascript
// utils/dataManager.js
class DataManager {
  constructor() {
    this.storage = require('./storage')
    this.cache = new Map() // 内存缓存
    this.db = wx.cloud.database()
  }

  // 三级存储策略：内存 -> 本地存储 -> 云数据库
  async getData(key, options = {}) {
    const {
      useCache = true,
      useLocal = true,
      useCloud = true,
      cacheTime = 300, // 缓存时间（秒）
      forceRefresh = false
    } = options

    // 1. 检查内存缓存
    if (useCache && !forceRefresh) {
      const cached = this.cache.get(key)
      if (cached && Date.now() - cached.timestamp < cacheTime * 1000) {
        console.log('从内存缓存获取数据', key)
        return cached.data
      }
    }

    // 2. 检查本地存储
    if (useLocal && !forceRefresh) {
      const localData = this.storage.get(key)
      if (localData) {
        console.log('从本地存储获取数据', key)
        
        // 更新内存缓存
        if (useCache) {
          this.cache.set(key, {
            data: localData,
            timestamp: Date.now()
          })
        }
        
        return localData
      }
    }

    // 3. 从云数据库获取
    if (useCloud) {
      try {
        console.log('从云数据库获取数据', key)
        const cloudData = await this.fetchFromCloud(key)
        
        // 更新本地存储
        if (useLocal) {
          this.storage.set(key, cloudData, {
            expire: cacheTime
          })
        }
        
        // 更新内存缓存
        if (useCache) {
          this.cache.set(key, {
            data: cloudData,
            timestamp: Date.now()
          })
        }
        
        return cloudData
      } catch (error) {
        console.error('从云数据库获取数据失败', error)
        throw error
      }
    }

    return null
  }

  // 设置数据（同步到所有层级）
  async setData(key, data, options = {}) {
    const {
      syncToLocal = true,
      syncToCloud = true,
      cacheTime = 300
    } = options

    // 更新内存缓存
    this.cache.set(key, {
      data: data,
      timestamp: Date.now()
    })

    // 更新本地存储
    if (syncToLocal) {
      this.storage.set(key, data, {
        expire: cacheTime
      })
    }

    // 同步到云数据库
    if (syncToCloud) {
      try {
        await this.syncToCloud(key, data)
      } catch (error) {
        console.error('同步到云数据库失败', error)
        // 不抛出错误，允许本地操作继续
      }
    }
  }

  // 从云数据库获取数据
  async fetchFromCloud(key) {
    const result = await this.db.collection('app_data')
      .where({ key: key })
      .get()
    
    if (result.data.length > 0) {
      return result.data[0].data
    }
    
    return null
  }

  // 同步数据到云数据库
  async syncToCloud(key, data) {
    const collection = this.db.collection('app_data')
    
    // 先查询是否存在
    const existing = await collection.where({ key: key }).get()
    
    if (existing.data.length > 0) {
      // 更新现有数据
      await collection.doc(existing.data[0]._id).update({
        data: {
          data: data,
          updateTime: this.db.serverDate()
        }
      })
    } else {
      // 添加新数据
      await collection.add({
        data: {
          key: key,
          data: data,
          createTime: this.db.serverDate(),
          updateTime: this.db.serverDate()
        }
      })
    }
  }

  // 清理缓存
  clearCache(key = null) {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }

  // 预加载数据
  async preloadData(keys) {
    const promises = keys.map(key => 
      this.getData(key, { useCache: false })
        .catch(error => {
          console.error(`预加载 ${key} 失败`, error)
          return null
        })
    )
    
    const results = await Promise.all(promises)
    console.log('预加载完成', results)
    return results
  }
}

module.exports = new DataManager()
```

### 数据同步策略

```javascript
// utils/syncManager.js
class SyncManager {
  constructor() {
    this.dataManager = require('./dataManager')
    this.syncQueue = []
    this.syncing = false
  }

  // 添加同步任务
  addSyncTask(task) {
    this.syncQueue.push({
      ...task,
      timestamp: Date.now(),
      retryCount: 0
    })
    
    this.processSyncQueue()
  }

  // 处理同步队列
  async processSyncQueue() {
    if (this.syncing || this.syncQueue.length === 0) {
      return
    }

    this.syncing = true

    while (this.syncQueue.length > 0) {
      const task = this.syncQueue.shift()
      
      try {
        await this.executeSync(task)
        console.log('同步任务完成', task)
      } catch (error) {
        console.error('同步任务失败', task, error)
        
        // 重试机制
        if (task.retryCount < 3) {
          task.retryCount++
          this.syncQueue.push(task)
        } else {
          console.error('同步任务最终失败', task)
        }
      }
    }

    this.syncing = false
  }

  // 执行同步任务
  async executeSync(task) {
    switch (task.type) {
      case 'upload':
        await this.uploadData(task.key, task.data)
        break
      case 'download':
        await this.downloadData(task.key)
        break
      case 'delete':
        await this.deleteData(task.key)
        break
      default:
        throw new Error(`未知的同步任务类型: ${task.type}`)
    }
  }

  // 上传数据
  async uploadData(key, data) {
    await this.dataManager.syncToCloud(key, data)
  }

  // 下载数据
  async downloadData(key) {
    const data = await this.dataManager.fetchFromCloud(key)
    if (data) {
      await this.dataManager.setData(key, data, {
        syncToCloud: false // 避免循环同步
      })
    }
  }

  // 删除数据
  async deleteData(key) {
    const db = wx.cloud.database()
    const result = await db.collection('app_data')
      .where({ key: key })
      .remove()
    
    console.log('云端数据删除结果', result)
  }

  // 全量同步
  async fullSync() {
    try {
      wx.showLoading({ title: '同步中...' })
      
      // 获取本地所有数据
      const localKeys = this.dataManager.storage.keys()
      
      // 获取云端所有数据
      const db = wx.cloud.database()
      const cloudResult = await db.collection('app_data').get()
      const cloudData = cloudResult.data
      
      // 比较并同步差异
      for (const localKey of localKeys) {
        const localData = this.dataManager.storage.get(localKey)
        const cloudItem = cloudData.find(item => item.key === localKey)
        
        if (!cloudItem) {
          // 本地有，云端没有，上传到云端
          this.addSyncTask({
            type: 'upload',
            key: localKey,
            data: localData
          })
        } else {
          // 比较时间戳，同步最新数据
          const localTime = localData.timestamp || 0
          const cloudTime = new Date(cloudItem.updateTime).getTime()
          
          if (localTime > cloudTime) {
            // 本地更新，上传到云端
            this.addSyncTask({
              type: 'upload',
              key: localKey,
              data: localData
            })
          } else if (cloudTime > localTime) {
            // 云端更新，下载到本地
            this.addSyncTask({
              type: 'download',
              key: localKey
            })
          }
        }
      }
      
      // 处理云端独有的数据
      for (const cloudItem of cloudData) {
        if (!localKeys.includes(cloudItem.key)) {
          // 云端有，本地没有，下载到本地
          this.addSyncTask({
            type: 'download',
            key: cloudItem.key
          })
        }
      }
      
      wx.showToast({
        title: '同步完成',
        icon: 'success'
      })
    } catch (error) {
      console.error('全量同步失败', error)
      wx.showToast({
        title: '同步失败',
        icon: 'none'
      })
    } finally {
      wx.hideLoading()
    }
  }

  // 增量同步
  async incrementalSync() {
    const lastSyncTime = this.dataManager.storage.get('lastSyncTime', 0)
    const currentTime = Date.now()
    
    try {
      // 获取自上次同步后的变更数据
      const db = wx.cloud.database()
      const changes = await db.collection('app_data')
        .where({
          updateTime: db.command.gte(new Date(lastSyncTime))
        })
        .get()
      
      // 应用变更
      for (const change of changes.data) {
        await this.dataManager.setData(change.key, change.data, {
          syncToCloud: false
        })
      }
      
      // 更新同步时间
      this.dataManager.storage.set('lastSyncTime', currentTime)
      
      console.log(`增量同步完成，处理了 ${changes.data.length} 条变更`)
    } catch (error) {
      console.error('增量同步失败', error)
    }
  }
}

module.exports = new SyncManager()
```

### 离线数据处理

```javascript
// utils/offlineManager.js
class OfflineManager {
  constructor() {
    this.storage = require('./storage')
    this.syncManager = require('./syncManager')
    this.offlineQueue = []
    this.isOnline = true
    
    this.initNetworkListener()
  }

  // 初始化网络监听
  initNetworkListener() {
    // 监听网络状态变化
    wx.onNetworkStatusChange((res) => {
      const wasOffline = !this.isOnline
      this.isOnline = res.isConnected
      
      console.log('网络状态变化', res)
      
      if (wasOffline && this.isOnline) {
        // 从离线恢复到在线，处理离线队列
        this.processOfflineQueue()
      }
    })
    
    // 获取初始网络状态
    wx.getNetworkType({
      success: (res) => {
        this.isOnline = res.networkType !== 'none'
      }
    })
  }

  // 添加离线操作
  addOfflineOperation(operation) {
    this.offlineQueue.push({
      ...operation,
      timestamp: Date.now(),
      id: this.generateId()
    })
    
    // 保存到本地存储
    this.storage.set('offlineQueue', this.offlineQueue)
    
    console.log('添加离线操作', operation)
  }

  // 处理离线队列
  async processOfflineQueue() {
    if (!this.isOnline || this.offlineQueue.length === 0) {
      return
    }

    console.log(`处理 ${this.offlineQueue.length} 个离线操作`)
    
    wx.showLoading({ title: '同步离线数据...' })
    
    const processedOperations = []
    
    for (const operation of this.offlineQueue) {
      try {
        await this.executeOfflineOperation(operation)
        processedOperations.push(operation)
        console.log('离线操作执行成功', operation)
      } catch (error) {
        console.error('离线操作执行失败', operation, error)
        
        // 如果是网络错误，停止处理
        if (error.errMsg && error.errMsg.includes('network')) {
          break
        }
      }
    }
    
    // 移除已处理的操作
    this.offlineQueue = this.offlineQueue.filter(
      op => !processedOperations.find(processed => processed.id === op.id)
    )
    
    // 更新本地存储
    this.storage.set('offlineQueue', this.offlineQueue)
    
    wx.hideLoading()
    
    if (processedOperations.length > 0) {
      wx.showToast({
        title: `同步了${processedOperations.length}条数据`,
        icon: 'success'
      })
    }
  }

  // 执行离线操作
  async executeOfflineOperation(operation) {
    switch (operation.type) {
      case 'create':
        await this.createRecord(operation.data)
        break
      case 'update':
        await this.updateRecord(operation.id, operation.data)
        break
      case 'delete':
        await this.deleteRecord(operation.id)
        break
      default:
        throw new Error(`未知的离线操作类型: ${operation.type}`)
    }
  }

  // 创建记录
  async createRecord(data) {
    const db = wx.cloud.database()
    const result = await db.collection(data.collection).add({
      data: data.record
    })
    return result
  }

  // 更新记录
  async updateRecord(id, data) {
    const db = wx.cloud.database()
    const result = await db.collection(data.collection)
      .doc(id)
      .update({
        data: data.updates
      })
    return result
  }

  // 删除记录
  async deleteRecord(id, collection) {
    const db = wx.cloud.database()
    const result = await db.collection(collection)
      .doc(id)
      .remove()
    return result
  }

  // 生成唯一ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // 从本地存储恢复离线队列
  restoreOfflineQueue() {
    const queue = this.storage.get('offlineQueue', [])
    this.offlineQueue = queue
    console.log(`恢复了 ${queue.length} 个离线操作`)
  }

  // 清空离线队列
  clearOfflineQueue() {
    this.offlineQueue = []
    this.storage.remove('offlineQueue')
  }
}

module.exports = new OfflineManager()
```

## 🔄 数据缓存策略

### 多级缓存实现

```javascript
// utils/cacheManager.js
class CacheManager {
  constructor() {
    this.memoryCache = new Map()
    this.storage = require('./storage')
    this.maxMemorySize = 50 // 内存缓存最大条目数
    this.defaultTTL = 300 // 默认缓存时间（秒）
  }

  // 获取缓存
  async get(key, options = {}) {
    const {
      ttl = this.defaultTTL,
      fallback = null,
      refresh = false
    } = options

    // 1. 检查内存缓存
    if (!refresh) {
      const memoryData = this.getFromMemory(key, ttl)
      if (memoryData !== null) {
        return memoryData
      }
    }

    // 2. 检查本地存储缓存
    if (!refresh) {
      const storageData = this.getFromStorage(key, ttl)
      if (storageData !== null) {
        // 回填内存缓存
        this.setToMemory(key, storageData)
        return storageData
      }
    }

    // 3. 执行回调获取数据
    if (typeof fallback === 'function') {
      try {
        const freshData = await fallback()
        if (freshData !== null && freshData !== undefined) {
          await this.set(key, freshData, { ttl })
          return freshData
        }
      } catch (error) {
        console.error('缓存回调执行失败', error)
      }
    }

    return null
  }

  // 设置缓存
  async set(key, data, options = {}) {
    const {
      ttl = this.defaultTTL,
      memoryOnly = false,
      storageOnly = false
    } = options

    // 设置内存缓存
    if (!storageOnly) {
      this.setToMemory(key, data, ttl)
    }

    // 设置本地存储缓存
    if (!memoryOnly) {
      this.setToStorage(key, data, ttl)
    }
  }

  // 从内存获取
  getFromMemory(key, ttl) {
    const cached = this.memoryCache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > ttl * 1000) {
      this.memoryCache.delete(key)
      return null
    }

    // 更新访问时间（LRU）
    cached.lastAccess = now
    return cached.data
  }

  // 设置到内存
  setToMemory(key, data, ttl = this.defaultTTL) {
    // 检查内存缓存大小
    if (this.memoryCache.size >= this.maxMemorySize) {
      this.evictLRU()
    }

    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      lastAccess: Date.now(),
      ttl
    })
  }

  // LRU淘汰策略
  evictLRU() {
    let oldestKey = null
    let oldestTime = Date.now()

    for (const [key, value] of this.memoryCache) {
      if (value.lastAccess < oldestTime) {
        oldestTime = value.lastAccess
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.memoryCache.delete(oldestKey)
      console.log('LRU淘汰缓存', oldestKey)
    }
  }

  // 从本地存储获取
  getFromStorage(key, ttl) {
    const cacheKey = `cache_${key}`
    const cached = this.storage.get(cacheKey)
    
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > ttl * 1000) {
      this.storage.remove(cacheKey)
      return null
    }

    return cached.data
  }

  // 设置到本地存储
  setToStorage(key, data, ttl) {
    const cacheKey = `cache_${key}`
    this.storage.set(cacheKey, {
      data,
      timestamp: Date.now()
    }, {
      expire: ttl
    })
  }

  // 删除缓存
  delete(key) {
    this.memoryCache.delete(key)
    this.storage.remove(`cache_${key}`)
  }

  // 清空所有缓存
  clear() {
    this.memoryCache.clear()
    
    // 清空本地存储中的缓存
    const keys = this.storage.keys()
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        this.storage.remove(key.replace('cache_', ''))
      }
    })
  }

  // 预热缓存
  async warmup(keys, dataLoader) {
    const promises = keys.map(async (key) => {
      try {
        const data = await dataLoader(key)
        await this.set(key, data)
        return { key, success: true }
      } catch (error) {
        console.error(`预热缓存失败: ${key}`, error)
        return { key, success: false, error }
      }
    })

    const results = await Promise.all(promises)
    const successCount = results.filter(r => r.success).length
    
    console.log(`缓存预热完成: ${successCount}/${keys.length}`)
    return results
  }

  // 获取缓存统计信息
  getStats() {
    const memorySize = this.memoryCache.size
    const storageKeys = this.storage.keys().filter(key => key.startsWith('cache_'))
    
    return {
      memorySize,
      storageSize: storageKeys.length,
      memoryLimit: this.maxMemorySize,
      memoryUsage: (memorySize / this.maxMemorySize * 100).toFixed(2) + '%'
    }
  }
}

module.exports = new CacheManager()
```

## 📊 数据分析和监控

### 数据使用统计

```javascript
// utils/dataAnalytics.js
class DataAnalytics {
  constructor() {
    this.storage = require('./storage')
    this.stats = {
      reads: 0,
      writes: 0,
      deletes: 0,
      cacheHits: 0,
      cacheMisses: 0
    }
    
    this.loadStats()
  }

  // 记录读取操作
  recordRead(key, source = 'unknown') {
    this.stats.reads++
    this.recordOperation('read', key, source)
    this.saveStats()
  }

  // 记录写入操作
  recordWrite(key, size = 0) {
    this.stats.writes++
    this.recordOperation('write', key, 'local', size)
    this.saveStats()
  }

  // 记录删除操作
  recordDelete(key) {
    this.stats.deletes++
    this.recordOperation('delete', key)
    this.saveStats()
  }

  // 记录缓存命中
  recordCacheHit(key) {
    this.stats.cacheHits++
    this.recordOperation('cache_hit', key)
    this.saveStats()
  }

  // 记录缓存未命中
  recordCacheMiss(key) {
    this.stats.cacheMisses++
    this.recordOperation('cache_miss', key)
    this.saveStats()
  }

  // 记录操作详情
  recordOperation(type, key, source = 'unknown', size = 0) {
    const operations = this.storage.get('data_operations', [])
    
    operations.push({
      type,
      key,
      source,
      size,
      timestamp: Date.now()
    })
    
    // 只保留最近1000条记录
    if (operations.length > 1000) {
      operations.splice(0, operations.length - 1000)
    }
    
    this.storage.set('data_operations', operations)
  }

  // 获取统计信息
  getStats() {
    const cacheTotal = this.stats.cacheHits + this.stats.cacheMisses
    const cacheHitRate = cacheTotal > 0 ? 
      (this.stats.cacheHits / cacheTotal * 100).toFixed(2) + '%' : '0%'
    
    return {
      ...this.stats,
      cacheHitRate,
      totalOperations: this.stats.reads + this.stats.writes + this.stats.deletes
    }
  }

  // 获取操作历史
  getOperationHistory(limit = 100) {
    const operations = this.storage.get('data_operations', [])
    return operations.slice(-limit).reverse()
  }

  // 分析热点数据
  analyzeHotData() {
    const operations = this.storage.get('data_operations', [])
    const keyStats = {}
    
    operations.forEach(op => {
      if (!keyStats[op.key]) {
        keyStats[op.key] = {
          reads: 0,
          writes: 0,
          deletes: 0,
          totalSize: 0
        }
      }
      
      keyStats[op.key][op.type === 'read' ? 'reads' : 
                      op.type === 'write' ? 'writes' : 'deletes']++
      
      if (op.size) {
        keyStats[op.key].totalSize += op.size
      }
    })
    
    // 按访问频率排序
    const hotKeys = Object.entries(keyStats)
      .map(([key, stats]) => ({
        key,
        ...stats,
        totalAccess: stats.reads + stats.writes
      }))
      .sort((a, b) => b.totalAccess - a.totalAccess)
      .slice(0, 10)
    
    return hotKeys
  }

  // 保存统计信息
  saveStats() {
    this.storage.set('data_stats', this.stats)
  }

  // 加载统计信息
  loadStats() {
    const savedStats = this.storage.get('data_stats', {})
    this.stats = { ...this.stats, ...savedStats }
  }

  // 重置统计信息
  resetStats() {
    this.stats = {
      reads: 0,
      writes: 0,
      deletes: 0,
      cacheHits: 0,
      cacheMisses: 0
    }
    this.storage.remove('data_stats')
    this.storage.remove('data_operations')
  }

  // 生成报告
  generateReport() {
    const stats = this.getStats()
    const hotData = this.analyzeHotData()
    const recentOperations = this.getOperationHistory(50)
    
    return {
      summary: stats,
      hotData,
      recentOperations,
      generatedAt: new Date().toISOString()
    }
  }
}

module.exports = new DataAnalytics()
```

## 📚 相关文档

- [API调用](./api-usage.md)
- [网络请求](./network-request.md)
- [性能优化](./performance.md)
- [项目结构](./project-structure.md)

---

通过合理的数据存储策略，构建高效、可靠的小程序数据管理系统！🚀
