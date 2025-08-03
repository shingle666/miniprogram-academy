# API Overview

Mini programs provide a rich set of APIs that allow developers to access device capabilities, interact with the host platform, and create powerful user experiences. This guide provides an overview of the common APIs available across different mini program platforms.

## Core API Categories

Mini program APIs can be broadly categorized into the following groups:

### 1. Network

APIs for making network requests and transferring data.

#### Request

```javascript
wx.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    param1: 'value1',
    param2: 'value2'
  },
  header: {
    'content-type': 'application/json'
  },
  success: (res) => {
    console.log('Request successful:', res.data)
  },
  fail: (err) => {
    console.error('Request failed:', err)
  },
  complete: () => {
    console.log('Request completed')
  }
})
```

#### WebSocket

```javascript
const socketTask = wx.connectSocket({
  url: 'wss://example.com/socket',
  header: {
    'content-type': 'application/json'
  },
  protocols: ['protocol1']
})

socketTask.onOpen(() => {
  console.log('WebSocket connection opened')
  socketTask.send({
    data: JSON.stringify({ message: 'Hello Server' })
  })
})

socketTask.onMessage((res) => {
  console.log('Message received:', res.data)
})

socketTask.onClose(() => {
  console.log('WebSocket connection closed')
})
```

#### Download File

```javascript
wx.downloadFile({
  url: 'https://example.com/file.pdf',
  success: (res) => {
    if (res.statusCode === 200) {
      console.log('Download successful, temp file path:', res.tempFilePath)
    }
  }
})
```

#### Upload File

```javascript
wx.uploadFile({
  url: 'https://example.com/upload',
  filePath: tempFilePath,
  name: 'file',
  formData: {
    'user': 'test'
  },
  success: (res) => {
    console.log('Upload successful:', res.data)
  }
})
```

### 2. Storage

APIs for data persistence and storage management.

#### Local Storage

```javascript
// Store data
wx.setStorage({
  key: 'userInfo',
  data: {
    name: 'John',
    age: 30
  },
  success: () => {
    console.log('Data stored successfully')
  }
})

// Retrieve data
wx.getStorage({
  key: 'userInfo',
  success: (res) => {
    console.log('Retrieved data:', res.data)
  }
})

// Remove data
wx.removeStorage({
  key: 'userInfo',
  success: () => {
    console.log('Data removed successfully')
  }
})

// Clear all data
wx.clearStorage({
  success: () => {
    console.log('Storage cleared successfully')
  }
})

// Synchronous versions
wx.setStorageSync('key', 'value')
const value = wx.getStorageSync('key')
wx.removeStorageSync('key')
wx.clearStorageSync()
```

### 3. UI Components

APIs for interacting with built-in UI components.

#### Toast

```javascript
wx.showToast({
  title: 'Operation successful',
  icon: 'success',
  duration: 2000
})
```

#### Modal

```javascript
wx.showModal({
  title: 'Confirmation',
  content: 'Are you sure you want to delete this item?',
  success: (res) => {
    if (res.confirm) {
      console.log('User confirmed')
    } else if (res.cancel) {
      console.log('User canceled')
    }
  }
})
```

#### Loading

```javascript
wx.showLoading({
  title: 'Loading...',
})

setTimeout(() => {
  wx.hideLoading()
}, 2000)
```

#### Action Sheet

```javascript
wx.showActionSheet({
  itemList: ['Option A', 'Option B', 'Option C'],
  success: (res) => {
    console.log('Selected option index:', res.tapIndex)
  },
  fail: (res) => {
    console.log('Action sheet closed')
  }
})
```

### 4. Navigation

APIs for navigating between pages.

#### Navigate To

```javascript
wx.navigateTo({
  url: '/pages/detail/detail?id=123',
  success: () => {
    console.log('Navigation successful')
  }
})
```

#### Redirect To

```javascript
wx.redirectTo({
  url: '/pages/detail/detail?id=123'
})
```

#### Navigate Back

```javascript
wx.navigateBack({
  delta: 1
})
```

#### Switch Tab

```javascript
wx.switchTab({
  url: '/pages/home/home'
})
```

#### Reload Page

```javascript
wx.reLaunch({
  url: '/pages/index/index'
})
```

### 5. Media

APIs for handling images, audio, video, and other media.

#### Image

```javascript
// Choose image from album or camera
wx.chooseImage({
  count: 1,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    const tempFilePaths = res.tempFilePaths
    console.log('Selected image paths:', tempFilePaths)
  }
})

// Preview image
wx.previewImage({
  current: 'https://example.com/image1.jpg',
  urls: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ]
})

// Save image to album
wx.saveImageToPhotosAlbum({
  filePath: 'tempFilePath',
  success: () => {
    console.log('Image saved to album')
  }
})
```

#### Audio

```javascript
const audioContext = wx.createInnerAudioContext()
audioContext.src = 'audio.mp3'
audioContext.autoplay = true
audioContext.onPlay(() => {
  console.log('Audio started playing')
})
audioContext.onError((res) => {
  console.log('Audio error:', res.errMsg)
})
audioContext.play()
```

#### Video

```javascript
// Record video
wx.chooseVideo({
  sourceType: ['album', 'camera'],
  maxDuration: 60,
  camera: 'back',
  success: (res) => {
    console.log('Video path:', res.tempFilePath)
    console.log('Video duration:', res.duration)
    console.log('Video size:', res.size)
  }
})

// Video context for controlling video component
const videoContext = wx.createVideoContext('myVideo')
videoContext.play()
videoContext.pause()
videoContext.seek(30)
videoContext.requestFullScreen()
videoContext.exitFullScreen()
```

### 6. Location

APIs for accessing location information and maps.

#### Get Location

```javascript
wx.getLocation({
  type: 'wgs84',
  success: (res) => {
    const latitude = res.latitude
    const longitude = res.longitude
    console.log(`Current location: ${latitude}, ${longitude}`)
  }
})
```

#### Choose Location

```javascript
wx.chooseLocation({
  success: (res) => {
    console.log('Selected location name:', res.name)
    console.log('Selected location address:', res.address)
    console.log('Selected location latitude:', res.latitude)
    console.log('Selected location longitude:', res.longitude)
  }
})
```

#### Open Location

```javascript
wx.openLocation({
  latitude: 23.099994,
  longitude: 113.324520,
  name: 'Location Name',
  address: 'Location Address',
  scale: 18
})
```

### 7. Device

APIs for accessing device information and capabilities.

#### System Information

```javascript
wx.getSystemInfo({
  success: (res) => {
    console.log('System info:', res)
    console.log('Brand:', res.brand)
    console.log('Model:', res.model)
    console.log('Platform:', res.platform)
    console.log('System:', res.system)
    console.log('Screen width:', res.screenWidth)
    console.log('Screen height:', res.screenHeight)
  }
})
```

#### Network Status

```javascript
wx.getNetworkType({
  success: (res) => {
    console.log('Network type:', res.networkType)
  }
})

wx.onNetworkStatusChange((res) => {
  console.log('Network changed - connected:', res.isConnected)
  console.log('Network changed - type:', res.networkType)
})
```

#### Accelerometer

```javascript
wx.startAccelerometer({
  interval: 'game'
})

wx.onAccelerometerChange((res) => {
  console.log('Accelerometer data:', res)
  console.log('X:', res.x)
  console.log('Y:', res.y)
  console.log('Z:', res.z)
})

// When done
wx.stopAccelerometer()
```

#### Compass

```javascript
wx.startCompass()

wx.onCompassChange((res) => {
  console.log('Compass direction:', res.direction)
})

// When done
wx.stopCompass()
```

#### Vibration

```javascript
// Short vibration
wx.vibrateShort({
  success: () => {
    console.log('Short vibration triggered')
  }
})

// Long vibration
wx.vibrateLong({
  success: () => {
    console.log('Long vibration triggered')
  }
})
```

### 8. File System

APIs for managing files.

#### File System Manager

```javascript
const fs = wx.getFileSystemManager()

// Read file
fs.readFile({
  filePath: `${wx.env.USER_DATA_PATH}/test.txt`,
  encoding: 'utf8',
  success: (res) => {
    console.log('File content:', res.data)
  }
})

// Write file
fs.writeFile({
  filePath: `${wx.env.USER_DATA_PATH}/test.txt`,
  data: 'Hello, World!',
  encoding: 'utf8',
  success: () => {
    console.log('File written successfully')
  }
})

// Copy file
fs.copyFile({
  srcPath: `${wx.env.USER_DATA_PATH}/source.txt`,
  destPath: `${wx.env.USER_DATA_PATH}/destination.txt`,
  success: () => {
    console.log('File copied successfully')
  }
})

// Remove file
fs.unlink({
  filePath: `${wx.env.USER_DATA_PATH}/test.txt`,
  success: () => {
    console.log('File removed successfully')
  }
})
```

### 9. Authentication

APIs for user authentication and authorization.

#### User Info

```javascript
wx.getUserProfile({
  desc: 'Used for user profile display',
  success: (res) => {
    console.log('User info:', res.userInfo)
    console.log('Avatar URL:', res.userInfo.avatarUrl)
    console.log('Nickname:', res.userInfo.nickName)
  }
})
```

#### Login

```javascript
wx.login({
  success: (res) => {
    if (res.code) {
      // Send code to your server to exchange for session key
      console.log('Login code:', res.code)
    } else {
      console.log('Login failed:', res.errMsg)
    }
  }
})
```

#### Check Session

```javascript
wx.checkSession({
  success: () => {
    // Session still valid
    console.log('Session valid')
  },
  fail: () => {
    // Session expired, need to re-login
    console.log('Session expired')
    wx.login()
  }
})
```

### 10. Payment

APIs for handling payments.

```javascript
wx.requestPayment({
  timeStamp: '1599214239',
  nonceStr: 'nonceStr',
  package: 'prepay_id=wx20200904153719xxxxxxxx',
  signType: 'MD5',
  paySign: 'paySign',
  success: (res) => {
    console.log('Payment successful')
  },
  fail: (err) => {
    console.log('Payment failed:', err)
  }
})
```

## Platform-Specific APIs

Different mini program platforms may offer unique APIs. Here are some examples:

### WeChat Mini Program

```javascript
// Open mini program
wx.navigateToMiniProgram({
  appId: 'appId',
  path: 'pages/index/index',
  extraData: {
    foo: 'bar'
  },
  success: () => {
    console.log('Navigation successful')
  }
})

// Cloud functions
wx.cloud.callFunction({
  name: 'functionName',
  data: {
    param1: 'value1'
  },
  success: (res) => {
    console.log('Cloud function result:', res.result)
  }
})
```

### Alipay Mini Program

```javascript
// Scan code
my.scan({
  type: 'qr',
  success: (res) => {
    console.log('Scan result:', res.code)
  }
})

// Trade pay
my.tradePay({
  tradeNO: 'tradeNo',
  success: (res) => {
    console.log('Payment result:', res.resultCode)
  }
})
```

## API Compatibility

When developing cross-platform mini programs, it's important to consider API compatibility. Here are some strategies:

### 1. Use Abstraction Layers

Create wrapper functions that handle platform differences:

```javascript
function request(options) {
  if (typeof wx !== 'undefined') {
    return wx.request(options)
  } else if (typeof my !== 'undefined') {
    return my.request(options)
  } else if (typeof swan !== 'undefined') {
    return swan.request(options)
  }
}
```

### 2. Use Cross-Platform Frameworks

Frameworks like Taro, uni-app, and Remax provide unified APIs that work across platforms.

### 3. Feature Detection

Check if an API exists before using it:

```javascript
if (wx.canIUse('openBluetoothAdapter')) {
  wx.openBluetoothAdapter()
} else {
  console.log('Bluetooth API not available')
}
```

## Best Practices

1. **Error Handling**: Always include fail callbacks to handle errors gracefully
2. **Permissions**: Request permissions only when needed and explain why they're necessary
3. **Async Operations**: Use Promise wrappers for cleaner async code
4. **Rate Limiting**: Be mindful of API rate limits, especially for network requests
5. **Documentation**: Keep up with platform documentation as APIs evolve

## Next Steps

Now that you have an overview of mini program APIs, you might want to explore:

- [Network Requests](./network-requests.md) for more details on API communication
- [Data Storage](./data-storage.md) for persistent data management
- [Device Capabilities](./device-capabilities.md) for hardware integration