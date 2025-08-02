# API调用

掌握小程序API的使用方法，包括网络请求、本地存储、设备能力调用等核心功能。

## 🌐 网络请求

### wx.request - 基础网络请求
```javascript
// 基础GET请求
wx.request({
  url: 'https://api.example.com/users',
  method: 'GET',
  data: {
    page: 1,
    limit: 10
  },
  header: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + wx.getStorageSync('token')
  },
  success: (res) => {
    console.log('请求成功', res.data)
    if (res.statusCode === 200) {
      // 处理成功响应
      this.setData({
        userList: res.data.list
      })
    }
  },
  fail: (err) => {
    console.error('请求失败', err)
    wx.showToast({
      title: '网络请求失败',
      icon: 'none'
    })
  },
  complete: () => {
    console.log('请求完成')
    wx.hideLoading()
  }
})

// POST请求
wx.request({
  url: 'https://api.example.com/users',
  method: 'POST',
  data: {
    name: '张三',
    email: 'zhangsan@example.com',
    age: 25
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
    }
  }
})
```

### 网络请求封装
```javascript
// utils/request.js
const BASE_URL = 'https://api.example.com'

class Request {
  constructor() {
    this.baseURL = BASE_URL
    this.timeout = 10000
    this.interceptors = {
      request: [],
      response: []
    }
  }

  // 请求拦截器
  interceptRequest(fn) {
    this.interceptors.request.push(fn)
  }

  // 响应拦截器
  interceptResponse(fn) {
    this.interceptors.response.push(fn)
  }

  // 核心请求方法
  request(options) {
    return new Promise((resolve, reject) => {
      // 合并配置
      const config = {
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          ...options.header
        },
        timeout: options.timeout || this.timeout
      }

      // 执行请求拦截器
      this.interceptors.request.forEach(fn => {
        config = fn(config) || config
      })

      // 显示加载提示
      if (options.loading !== false) {
        wx.showLoading({
          title: '加载中...',
          mask: true
        })
      }

      wx.request({
        ...config,
        success: (res) => {
          // 执行响应拦截器
          this.interceptors.response.forEach(fn => {
            res = fn(res) || res
          })

          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(res)
          }
        },
        fail: (err) => {
          console.error('网络请求失败', err)
          reject(err)
        },
        complete: () => {
          if (options.loading !== false) {
            wx.hideLoading()
          }
        }
      })
    })
  }

  // GET请求
  get(url, data, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data,
      ...options
    })
  }

  // POST请求
  post(url, data, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  // PUT请求
  put(url, data, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  // DELETE请求
  delete(url, data, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      data,
      ...options
    })
  }
}

// 创建实例
const request = new Request()

// 添加请求拦截器
request.interceptRequest((config) => {
  // 添加token
  const token = wx.getStorageSync('token')
  if (token) {
    config.header.Authorization = `Bearer ${token}`
  }
  
  // 添加时间戳防止缓存
  if (config.method === 'GET') {
    config.data._t = Date.now()
  }
  
  return config
})

// 添加响应拦截器
request.interceptResponse((response) => {
  // 统一错误处理
  if (response.data.code !== 0) {
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
  
  return response
})

module.exports = request
```

### API接口管理
```javascript
// api/user.js
const request = require('../utils/request')

// 用户相关API
const userAPI = {
  // 获取用户信息
  getUserInfo(userId) {
    return request.get(`/users/${userId}`)
  },

  // 更新用户信息
  updateUserInfo(userId, data) {
    return request.put(`/users/${userId}`, data)
  },

  // 获取用户列表
  getUserList(params) {
    return request.get('/users', params)
  },

  // 用户登录
  login(data) {
    return request.post('/auth/login', data)
  },

  // 用户注册
  register(data) {
    return request.post('/auth/register', data)
  },

  // 刷新token
  refreshToken() {
    return request.post('/auth/refresh')
  }
}

module.exports = userAPI
```

### 使用示例
```javascript
// pages/user/user.js
const userAPI = require('../../api/user')

Page({
  data: {
    userInfo: null,
    loading: false
  },

  async onLoad(options) {
    await this.loadUserInfo(options.userId)
  },

  async loadUserInfo(userId) {
    try {
      this.setData({ loading: true })
      
      const userInfo = await userAPI.getUserInfo(userId)
      
      this.setData({
        userInfo: userInfo.data
      })
    } catch (error) {
      console.error('加载用户信息失败', error)
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  async updateUser() {
    try {
      const result = await userAPI.updateUserInfo(this.data.userInfo.id, {
        name: '新名称',
        avatar: 'new-avatar-url'
      })
      
      wx.showToast({
        title: '更新成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('更新失败', error)
    }
  }
})
```

## 💾 本地存储

### 同步存储API
```javascript
// 设置存储
try {
  wx.setStorageSync('key', 'value')
  wx.setStorageSync('user', {
    id: 1,
    name: '张三',
    avatar: 'avatar-url'
  })
  console.log('存储成功')
} catch (error) {
  console.error('存储失败', error)
}

// 获取存储
try {
  const value = wx.getStorageSync('key')
  const user = wx.getStorageSync('user')
  
  if (value) {
    console.log('获取到值', value)
  }
  
  if (user) {
    console.log('用户信息', user)
  }
} catch (error) {
  console.error('获取存储失败', error)
}

// 删除存储
try {
  wx.removeStorageSync('key')
  console.log('删除成功')
} catch (error) {
  console.error('删除失败', error)
}

// 清空存储
try {
  wx.clearStorageSync()
  console.log('清空成功')
} catch (error) {
  console.error('清空失败', error)
}

// 获取存储信息
try {
  const info = wx.getStorageInfoSync()
  console.log('存储信息', info)
  // {keys: ['key1', 'key2'], currentSize: 1, limitSize: 10240}
} catch (error) {
  console.error('获取存储信息失败', error)
}
```

### 异步存储API
```javascript
// 设置存储
wx.setStorage({
  key: 'userToken',
  data: 'token-value',
  success: () => {
    console.log('存储成功')
  },
  fail: (error) => {
    console.error('存储失败', error)
  }
})

// 获取存储
wx.getStorage({
  key: 'userToken',
  success: (res) => {
    console.log('获取成功', res.data)
  },
  fail: (error) => {
    console.error('获取失败', error)
  }
})

// 删除存储
wx.removeStorage({
  key: 'userToken',
  success: () => {
    console.log('删除成功')
  }
})

// 清空存储
wx.clearStorage({
  success: () => {
    console.log('清空成功')
  }
})
```

### 存储工具封装
```javascript
// utils/storage.js
class Storage {
  // 设置存储（支持过期时间）
  static set(key, data, expire = null) {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        expire: expire ? Date.now() + expire * 1000 : null
      }
      wx.setStorageSync(key, item)
      return true
    } catch (error) {
      console.error('存储失败', error)
      return false
    }
  }

  // 获取存储
  static get(key, defaultValue = null) {
    try {
      const item = wx.getStorageSync(key)
      
      if (!item) {
        return defaultValue
      }

      // 检查是否过期
      if (item.expire && Date.now() > item.expire) {
        this.remove(key)
        return defaultValue
      }

      return item.data
    } catch (error) {
      console.error('获取存储失败', error)
      return defaultValue
    }
  }

  // 删除存储
  static remove(key) {
    try {
      wx.removeStorageSync(key)
      return true
    } catch (error) {
      console.error('删除存储失败', error)
      return false
    }
  }

  // 清空存储
  static clear() {
    try {
      wx.clearStorageSync()
      return true
    } catch (error) {
      console.error('清空存储失败', error)
      return false
    }
  }

  // 检查key是否存在
  static has(key) {
    try {
      const item = wx.getStorageSync(key)
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
  static keys() {
    try {
      const info = wx.getStorageInfoSync()
      return info.keys
    } catch (error) {
      console.error('获取keys失败', error)
      return []
    }
  }

  // 获取存储大小
  static size() {
    try {
      const info = wx.getStorageInfoSync()
      return {
        current: info.currentSize,
        limit: info.limitSize
      }
    } catch (error) {
      console.error('获取存储大小失败', error)
      return { current: 0, limit: 0 }
    }
  }
}

module.exports = Storage
```

## 📱 设备能力

### 系统信息
```javascript
// 获取系统信息
wx.getSystemInfo({
  success: (res) => {
    console.log('系统信息', res)
    /*
    {
      brand: "iPhone",
      model: "iPhone 12",
      pixelRatio: 3,
      screenWidth: 390,
      screenHeight: 844,
      windowWidth: 390,
      windowHeight: 844,
      statusBarHeight: 44,
      language: "zh_CN",
      version: "8.0.5",
      system: "iOS 15.0",
      platform: "ios",
      fontSizeSetting: 16,
      SDKVersion: "2.19.4",
      benchmarkLevel: 1,
      albumAuthorized: true,
      cameraAuthorized: true,
      locationAuthorized: true,
      microphoneAuthorized: true,
      notificationAuthorized: true,
      bluetoothEnabled: true,
      locationEnabled: true,
      wifiEnabled: true,
      safeArea: {
        left: 0,
        right: 390,
        top: 44,
        bottom: 810,
        width: 390,
        height: 766
      }
    }
    */
  }
})

// 同步获取系统信息
try {
  const systemInfo = wx.getSystemInfoSync()
  console.log('系统信息', systemInfo)
} catch (error) {
  console.error('获取系统信息失败', error)
}
```

### 网络状态
```javascript
// 获取网络类型
wx.getNetworkType({
  success: (res) => {
    console.log('网络类型', res.networkType)
    // wifi, 2g, 3g, 4g, 5g, unknown, none
    
    if (res.networkType === 'none') {
      wx.showToast({
        title: '网络连接失败',
        icon: 'none'
      })
    }
  }
})

// 监听网络状态变化
wx.onNetworkStatusChange((res) => {
  console.log('网络状态变化', res)
  // { isConnected: true, networkType: 'wifi' }
  
  if (!res.isConnected) {
    wx.showToast({
      title: '网络连接断开',
      icon: 'none'
    })
  }
})

// 取消监听
wx.offNetworkStatusChange()
```

### 位置信息
```javascript
// 获取当前位置
wx.getLocation({
  type: 'gcj02', // wgs84, gcj02
  altitude: true,
  success: (res) => {
    console.log('位置信息', res)
    /*
    {
      latitude: 39.908823,
      longitude: 116.39747,
      speed: 0,
      accuracy: 5,
      altitude: 0,
      verticalAccuracy: 5,
      horizontalAccuracy: 5
    }
    */
    
    // 使用位置信息
    this.setData({
      latitude: res.latitude,
      longitude: res.longitude
    })
  },
  fail: (error) => {
    console.error('获取位置失败', error)
    
    if (error.errMsg.includes('auth deny')) {
      wx.showModal({
        title: '位置权限',
        content: '需要获取您的位置信息，请在设置中开启位置权限',
        confirmText: '去设置',
        success: (res) => {
          if (res.confirm) {
            wx.openSetting()
          }
        }
      })
    }
  }
})

// 选择位置
wx.chooseLocation({
  success: (res) => {
    console.log('选择的位置', res)
    /*
    {
      name: "天安门",
      address: "北京市东城区天安门广场",
      latitude: 39.908823,
      longitude: 116.39747
    }
    */
  }
})

// 打开地图选择位置
wx.openLocation({
  latitude: 39.908823,
  longitude: 116.39747,
  name: '天安门',
  address: '北京市东城区天安门广场',
  scale: 18
})
```

### 相机和相册
```javascript
// 拍照或从相册选择图片
wx.chooseImage({
  count: 9, // 最多可以选择的图片张数
  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
  sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机
  success: (res) => {
    console.log('选择的图片', res)
    
    const tempFilePaths = res.tempFilePaths
    
    // 预览图片
    wx.previewImage({
      urls: tempFilePaths
    })
    
    // 上传图片
    this.uploadImages(tempFilePaths)
  }
})

// 拍摄视频或从相册选择视频
wx.chooseVideo({
  sourceType: ['album', 'camera'],
  maxDuration: 60,
  camera: 'back',
  success: (res) => {
    console.log('选择的视频', res)
    
    const tempFilePath = res.tempFilePath
    const duration = res.duration
    const size = res.size
    
    // 播放视频
    wx.createVideoContext('myVideo').play()
  }
})

// 保存图片到相册
wx.saveImageToPhotosAlbum({
  filePath: 'path/to/image.jpg',
  success: () => {
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
  },
  fail: (error) => {
    if (error.errMsg.includes('auth deny')) {
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
    }
  }
})
```

### 扫码功能
```javascript
// 扫描二维码
wx.scanCode({
  onlyFromCamera: false, // 是否只能从相机扫码
  scanType: ['barCode', 'qrCode'], // 扫码类型
  success: (res) => {
    console.log('扫码结果', res)
    /*
    {
      result: "扫码内容",
      scanType: "QR_CODE",
      charSet: "UTF-8",
      path: ""
    }
    */
    
    const result = res.result
    
    // 处理扫码结果
    if (result.startsWith('http')) {
      // 是网址，询问是否打开
      wx.showModal({
        title: '打开链接',
        content: result,
        success: (modalRes) => {
          if (modalRes.confirm) {
            // 在小程序内打开网页
            wx.navigateTo({
              url: `/pages/webview/webview?url=${encodeURIComponent(result)}`
            })
          }
        }
      })
    } else {
      // 其他内容，显示结果
      wx.showModal({
        title: '扫码结果',
        content: result,
        showCancel: false
      })
    }
  },
  fail: (error) => {
    console.error('扫码失败', error)
    
    if (error.errMsg.includes('cancel')) {
      console.log('用户取消扫码')
    }
  }
})
```

## 🔊 音频和视频

### 音频播放
```javascript
// 创建音频上下文
const audioContext = wx.createAudioContext('myAudio')

// 播放音频
audioContext.play()

// 暂停音频
audioContext.pause()

// 设置音频位置
audioContext.seek(30)

// 背景音频管理
const backgroundAudioManager = wx.getBackgroundAudioManager()

// 设置音频信息
backgroundAudioManager.title = '音频标题'
backgroundAudioManager.epname = '专辑名'
backgroundAudioManager.singer = '歌手名'
backgroundAudioManager.coverImgUrl = 'cover-image-url'
backgroundAudioManager.src = 'audio-url'

// 监听背景音频事件
backgroundAudioManager.onPlay(() => {
  console.log('开始播放')
})

backgroundAudioManager.onPause(() => {
  console.log('暂停播放')
})

backgroundAudioManager.onStop(() => {
  console.log('停止播放')
})

backgroundAudioManager.onEnded(() => {
  console.log('播放结束')
})

backgroundAudioManager.onError((error) => {
  console.error('播放错误', error)
})
```

### 录音功能
```javascript
// 获取录音管理器
const recorderManager = wx.getRecorderManager()

// 录音配置
const options = {
  duration: 60000, // 录音时长，单位ms
  sampleRate: 44100, // 采样率
  numberOfChannels: 1, // 录音通道数
  encodeBitRate: 192000, // 编码码率
  format: 'mp3', // 音频格式
  frameSize: 50 // 指定帧大小，单位KB
}

// 开始录音
recorderManager.start(options)

// 监听录音事件
recorderManager.onStart(() => {
  console.log('开始录音')
})

recorderManager.onStop((res) => {
  console.log('录音结束', res)
  
  const tempFilePath = res.tempFilePath
  const duration = res.duration
  const fileSize = res.fileSize
  
  // 播放录音
  wx.playVoice({
    filePath: tempFilePath
  })
})

recorderManager.onError((error) => {
  console.error('录音错误', error)
})

// 停止录音
recorderManager.stop()
```

## 📋 剪贴板

```javascript
// 设置剪贴板内容
wx.setClipboardData({
  data: '要复制的内容',
  success: () => {
    wx.showToast({
      title: '复制成功',
      icon: 'success'
    })
  }
})

// 获取剪贴板内容
wx.getClipboardData({
  success: (res) => {
    console.log('剪贴板内容', res.data)
    
    this.setData({
      clipboardContent: res.data
    })
  }
})
```

## 🔔 消息提示

```javascript
// 显示消息提示框
wx.showToast({
  title: '成功',
  icon: 'success', // success, error, loading, none
  duration: 2000,
  mask: true
})

// 显示模态对话框
wx.showModal({
  title: '提示',
  content: '这是一个模态弹窗',
  showCancel: true,
  cancelText: '取消',
  confirmText: '确定',
  success: (res) => {
    if (res.confirm) {
      console.log('用户点击确定')
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
})

// 显示操作菜单
wx.showActionSheet({
  itemList: ['选项1', '选项2', '选项3'],
  success: (res) => {
    console.log('选择了第' + (res.tapIndex + 1) + '个选项')
  },
  fail: (res) => {
    console.log('取消选择')
  }
})

// 显示加载提示
wx.showLoading({
  title: '加载中',
  mask: true
})

// 隐藏加载提示
wx.hideLoading()
```

## 📚 相关文档

- [网络请求](./network-request.md)
- [数据存储](./data-storage.md)
- [性能优化](./performance.md)
- [页面开发](./page-development.md)

---

熟练掌握API调用，构建功能丰富的小程序应用！🚀