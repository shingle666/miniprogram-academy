# API Usage

This guide covers how to use APIs in mini-program development, including platform-specific APIs, network requests, device capabilities, and best practices for API integration.

## 📋 Table of Contents

- [Platform APIs](#platform-apis)
- [Network APIs](#network-apis)
- [Device APIs](#device-apis)
- [Storage APIs](#storage-apis)
- [UI APIs](#ui-apis)
- [Media APIs](#media-apis)
- [Location APIs](#location-apis)
- [Payment APIs](#payment-apis)
- [Best Practices](#best-practices)

## 🔌 Platform APIs

### WeChat Mini Program APIs

WeChat provides a comprehensive set of APIs for various functionalities:

```javascript
// System Information
wx.getSystemInfo({
  success: function(res) {
    console.log('Device Model:', res.model)
    console.log('System Version:', res.system)
    console.log('WeChat Version:', res.version)
  }
})

// User Information
wx.getUserProfile({
  desc: 'Get user info for personalization',
  success: function(res) {
    console.log('User Info:', res.userInfo)
  }
})

// Show Toast
wx.showToast({
  title: 'Success',
  icon: 'success',
  duration: 2000
})
```

### Alipay Mini Program APIs

Alipay APIs focus on financial and business scenarios:

```javascript
// System Information
my.getSystemInfo({
  success: function(res) {
    console.log('Platform:', res.platform)
    console.log('Version:', res.version)
  }
})

// Payment
my.tradePay({
  orderStr: 'your_order_string',
  success: function(res) {
    console.log('Payment Success:', res)
  }
})

// Alert Dialog
my.alert({
  title: 'Notice',
  content: 'This is an alert',
  success: function() {
    console.log('Alert closed')
  }
})
```

## 🌐 Network APIs

### HTTP Requests

Making network requests in mini-programs:

```javascript
// WeChat Mini Program
wx.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    page: 1,
    limit: 10
  },
  header: {
    'Content-Type': 'application/json'
  },
  success: function(res) {
    console.log('Data:', res.data)
  },
  fail: function(error) {
    console.error('Request failed:', error)
  }
})

// Alipay Mini Program
my.request({
  url: 'https://api.example.com/data',
  method: 'POST',
  data: {
    name: 'John',
    age: 30
  },
  success: function(res) {
    console.log('Response:', res.data)
  }
})
```

### WebSocket Connection

Real-time communication using WebSocket:

```javascript
// Create WebSocket connection
const socketTask = wx.connectSocket({
  url: 'wss://api.example.com/websocket'
})

// Listen for connection open
socketTask.onOpen(function() {
  console.log('WebSocket connected')
  
  // Send message
  socketTask.send({
    data: JSON.stringify({
      type: 'greeting',
      message: 'Hello Server'
    })
  })
})

// Listen for messages
socketTask.onMessage(function(res) {
  const data = JSON.parse(res.data)
  console.log('Received:', data)
})

// Handle connection close
socketTask.onClose(function() {
  console.log('WebSocket disconnected')
})
```

## 📱 Device APIs

### Camera and Photo

Accessing device camera and photo library:

```javascript
// Take Photo
wx.chooseImage({
  count: 1,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: function(res) {
    const tempFilePaths = res.tempFilePaths
    console.log('Selected images:', tempFilePaths)
    
    // Upload image
    wx.uploadFile({
      url: 'https://api.example.com/upload',
      filePath: tempFilePaths[0],
      name: 'file',
      success: function(uploadRes) {
        console.log('Upload success:', uploadRes)
      }
    })
  }
})

// Preview Image
wx.previewImage({
  current: 'https://example.com/image1.jpg',
  urls: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ]
})
```

### Audio Recording

Recording and playing audio:

```javascript
// Start Recording
const recorderManager = wx.getRecorderManager()

recorderManager.start({
  duration: 60000,
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 96000,
  format: 'mp3'
})

// Stop Recording
recorderManager.onStop(function(res) {
  console.log('Recording stopped:', res.tempFilePath)
  
  // Play recorded audio
  const innerAudioContext = wx.createInnerAudioContext()
  innerAudioContext.src = res.tempFilePath
  innerAudioContext.play()
})
```

## 💾 Storage APIs

### Local Storage

Storing data locally on the device:

```javascript
// Store data
wx.setStorageSync('userInfo', {
  name: 'John Doe',
  age: 30,
  preferences: ['music', 'sports']
})

// Retrieve data
const userInfo = wx.getStorageSync('userInfo')
console.log('User Info:', userInfo)

// Async storage operations
wx.setStorage({
  key: 'settings',
  data: {
    theme: 'dark',
    language: 'en'
  },
  success: function() {
    console.log('Settings saved')
  }
})

wx.getStorage({
  key: 'settings',
  success: function(res) {
    console.log('Settings:', res.data)
  }
})

// Remove data
wx.removeStorageSync('tempData')

// Clear all storage
wx.clearStorageSync()
```

## 🎨 UI APIs

### Navigation

Navigating between pages:

```javascript
// Navigate to new page
wx.navigateTo({
  url: '/pages/detail/detail?id=123'
})

// Redirect to page (replace current page)
wx.redirectTo({
  url: '/pages/login/login'
})

// Navigate back
wx.navigateBack({
  delta: 1 // Number of pages to go back
})

// Switch tab
wx.switchTab({
  url: '/pages/home/home'
})
```

### Modal Dialogs

Showing various types of dialogs:

```javascript
// Show Modal
wx.showModal({
  title: 'Confirm',
  content: 'Are you sure you want to delete this item?',
  success: function(res) {
    if (res.confirm) {
      console.log('User confirmed')
    } else if (res.cancel) {
      console.log('User cancelled')
    }
  }
})

// Show Action Sheet
wx.showActionSheet({
  itemList: ['Option 1', 'Option 2', 'Option 3'],
  success: function(res) {
    console.log('Selected:', res.tapIndex)
  }
})

// Show Loading
wx.showLoading({
  title: 'Loading...'
})

setTimeout(() => {
  wx.hideLoading()
}, 2000)
```

## 📍 Location APIs

### Getting User Location

Accessing device location services:

```javascript
// Get current location
wx.getLocation({
  type: 'gcj02',
  success: function(res) {
    const latitude = res.latitude
    const longitude = res.longitude
    const speed = res.speed
    const accuracy = res.accuracy
    
    console.log('Location:', { latitude, longitude })
    
    // Open location in map
    wx.openLocation({
      latitude,
      longitude,
      name: 'Current Location',
      address: 'Your current position'
    })
  }
})

// Choose location from map
wx.chooseLocation({
  success: function(res) {
    console.log('Selected location:', {
      name: res.name,
      address: res.address,
      latitude: res.latitude,
      longitude: res.longitude
    })
  }
})
```

## 💳 Payment APIs

### WeChat Payment

Integrating WeChat Pay:

```javascript
// Request payment
wx.requestPayment({
  timeStamp: '1234567890',
  nonceStr: 'random_string',
  package: 'prepay_id=wx_prepay_id',
  signType: 'MD5',
  paySign: 'payment_signature',
  success: function(res) {
    console.log('Payment successful:', res)
    wx.showToast({
      title: 'Payment Successful',
      icon: 'success'
    })
  },
  fail: function(res) {
    console.log('Payment failed:', res)
    wx.showToast({
      title: 'Payment Failed',
      icon: 'error'
    })
  }
})
```

### Alipay Payment

Integrating Alipay:

```javascript
// Alipay payment
my.tradePay({
  orderStr: 'your_order_string_from_server',
  success: function(res) {
    console.log('Payment result:', res)
    if (res.resultCode === '9000') {
      my.showToast({
        content: 'Payment Successful',
        type: 'success'
      })
    }
  },
  fail: function(res) {
    console.log('Payment error:', res)
    my.showToast({
      content: 'Payment Failed',
      type: 'fail'
    })
  }
})
```

## 🎯 Best Practices

### Error Handling

Always implement proper error handling:

```javascript
// Comprehensive error handling
function makeAPICall() {
  wx.request({
    url: 'https://api.example.com/data',
    method: 'GET',
    success: function(res) {
      if (res.statusCode === 200) {
        handleSuccess(res.data)
      } else {
        handleError('Server error: ' + res.statusCode)
      }
    },
    fail: function(error) {
      handleError('Network error: ' + error.errMsg)
    },
    complete: function() {
      // Always executed
      hideLoading()
    }
  })
}

function handleSuccess(data) {
  console.log('API call successful:', data)
  // Update UI with data
}

function handleError(message) {
  console.error('API call failed:', message)
  wx.showToast({
    title: 'Request Failed',
    icon: 'error'
  })
}
```

### API Abstraction

Create abstraction layers for better maintainability:

```javascript
// API service abstraction
class APIService {
  static baseURL = 'https://api.example.com'
  
  static request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: this.baseURL + options.url,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Content-Type': 'application/json',
          ...options.header
        },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error(`HTTP ${res.statusCode}`))
          }
        },
        fail: reject
      })
    })
  }
  
  static get(url, data) {
    return this.request({ url, method: 'GET', data })
  }
  
  static post(url, data) {
    return this.request({ url, method: 'POST', data })
  }
}

// Usage
APIService.get('/users', { page: 1 })
  .then(data => console.log('Users:', data))
  .catch(error => console.error('Error:', error))
```

### Performance Optimization

Optimize API calls for better performance:

```javascript
// Request debouncing
class RequestManager {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
  }
  
  async request(url, options = {}) {
    const cacheKey = url + JSON.stringify(options)
    
    // Return cached result if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    // Return pending request if already in progress
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)
    }
    
    // Make new request
    const requestPromise = APIService.request({ url, ...options })
    this.pendingRequests.set(cacheKey, requestPromise)
    
    try {
      const result = await requestPromise
      this.cache.set(cacheKey, result)
      return result
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }
}

const requestManager = new RequestManager()
```

### Cross-Platform Compatibility

Handle platform differences gracefully:

```javascript
// Platform detection and API abstraction
class PlatformAPI {
  static showToast(options) {
    if (typeof wx !== 'undefined') {
      // WeChat Mini Program
      wx.showToast({
        title: options.title,
        icon: options.type === 'success' ? 'success' : 'error',
        duration: options.duration || 2000
      })
    } else if (typeof my !== 'undefined') {
      // Alipay Mini Program
      my.showToast({
        content: options.title,
        type: options.type || 'success',
        duration: options.duration || 2000
      })
    }
  }
  
  static request(options) {
    const requestFn = typeof wx !== 'undefined' ? wx.request : my.request
    return new Promise((resolve, reject) => {
      requestFn({
        ...options,
        success: resolve,
        fail: reject
      })
    })
  }
}

// Usage
PlatformAPI.showToast({
  title: 'Operation Successful',
  type: 'success'
})
```

---

Proper API usage is crucial for mini-program development. Always follow platform guidelines, implement error handling, and consider performance optimization to create robust and user-friendly applications.