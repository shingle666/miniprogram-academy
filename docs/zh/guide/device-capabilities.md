# 设备能力

小程序可以调用各种设备能力来提供丰富的用户体验。本文档介绍了常用的设备能力API及其使用方法。

## 📱 系统信息

### 获取设备信息

```javascript
// 获取系统信息
wx.getSystemInfo({
  success: function(res) {
    console.log('设备型号:', res.model)
    console.log('操作系统:', res.system)
    console.log('微信版本:', res.version)
    console.log('屏幕宽度:', res.screenWidth)
    console.log('屏幕高度:', res.screenHeight)
    console.log('状态栏高度:', res.statusBarHeight)
  }
})

// 同步获取系统信息
const systemInfo = wx.getSystemInfoSync()
console.log('设备信息:', systemInfo)
```

### 安全区域处理

```javascript
// 获取安全区域信息
wx.getSystemInfo({
  success: function(res) {
    const { safeArea, screenHeight, statusBarHeight } = res
    
    // 计算底部安全区域高度
    const bottomSafeHeight = screenHeight - safeArea.bottom
    
    // 设置页面样式
    this.setData({
      statusBarHeight: statusBarHeight,
      bottomSafeHeight: bottomSafeHeight
    })
  }
})
```

## 📷 相机和媒体

### 拍照和选择图片

```javascript
// 选择图片
wx.chooseImage({
  count: 9, // 最多选择9张
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: function(res) {
    const tempFilePaths = res.tempFilePaths
    console.log('选择的图片:', tempFilePaths)
  }
})

// 预览图片
wx.previewImage({
  current: 'https://example.com/image1.jpg',
  urls: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg'
  ]
})
```

### 录制和选择视频

```javascript
// 选择视频
wx.chooseVideo({
  sourceType: ['album', 'camera'],
  maxDuration: 60,
  camera: 'back',
  success: function(res) {
    console.log('视频路径:', res.tempFilePath)
    console.log('视频时长:', res.duration)
    console.log('视频大小:', res.size)
  }
})
```

## 📍 位置服务

### 获取当前位置

```javascript
// 获取当前位置
wx.getLocation({
  type: 'gcj02',
  success: function(res) {
    const latitude = res.latitude
    const longitude = res.longitude
    const speed = res.speed
    const accuracy = res.accuracy
    
    console.log('纬度:', latitude)
    console.log('经度:', longitude)
  },
  fail: function(err) {
    console.error('获取位置失败:', err)
  }
})
```

### 位置权限处理

```javascript
// 检查位置权限
wx.getSetting({
  success: function(res) {
    if (!res.authSetting['scope.userLocation']) {
      // 请求位置权限
      wx.authorize({
        scope: 'scope.userLocation',
        success: function() {
          // 用户同意授权
          getLocation()
        },
        fail: function() {
          // 用户拒绝授权，引导到设置页面
          wx.showModal({
            title: '提示',
            content: '需要位置权限才能使用此功能',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      })
    } else {
      getLocation()
    }
  }
})
```

### 地图组件集成

```xml
<!-- WXML -->
<map
  id="map"
  longitude="{{longitude}}"
  latitude="{{latitude}}"
  scale="14"
  markers="{{markers}}"
  bindmarkertap="onMarkerTap"
  style="width: 100%; height: 300px;"
></map>
```

```javascript
// JavaScript
Page({
  data: {
    latitude: 39.908823,
    longitude: 116.397470,
    markers: [{
      id: 1,
      latitude: 39.908823,
      longitude: 116.397470,
      title: '当前位置'
    }]
  },
  
  onMarkerTap: function(e) {
    console.log('点击标记:', e.detail.markerId)
  }
})
```

## 🧭 传感器

### 加速度计

```javascript
// 监听加速度数据
wx.onAccelerometerChange(function(res) {
  console.log('x轴:', res.x)
  console.log('y轴:', res.y)
  console.log('z轴:', res.z)
})

// 开始监听
wx.startAccelerometer({
  interval: 'normal' // game, ui, normal
})

// 停止监听
wx.stopAccelerometer()
```

### 指南针

```javascript
// 监听罗盘数据
wx.onCompassChange(function(res) {
  console.log('方向角度:', res.direction)
  console.log('精度:', res.accuracy)
})

// 开始监听
wx.startCompass()

// 停止监听
wx.stopCompass()
```

### 陀螺仪

```javascript
// 监听陀螺仪数据
wx.onGyroscopeChange(function(res) {
  console.log('x轴角速度:', res.x)
  console.log('y轴角速度:', res.y)
  console.log('z轴角速度:', res.z)
})

// 开始监听
wx.startGyroscope({
  interval: 'normal'
})
```

## 📳 设备动作和震动

### 震动反馈

```javascript
// 短震动
wx.vibrateShort({
  type: 'heavy' // heavy, medium, light
})

// 长震动
wx.vibrateLong()
```

### 屏幕亮度

```javascript
// 设置屏幕亮度
wx.setScreenBrightness({
  value: 0.8 // 0-1之间
})

// 获取屏幕亮度
wx.getScreenBrightness({
  success: function(res) {
    console.log('当前亮度:', res.value)
  }
})

// 设置保持屏幕常亮
wx.setKeepScreenOn({
  keepScreenOn: true
})
```

## 🎵 音频和语音

### 录音功能

```javascript
// 开始录音
const recorderManager = wx.getRecorderManager()

recorderManager.onStart(() => {
  console.log('录音开始')
})

recorderManager.onStop((res) => {
  console.log('录音结束')
  console.log('录音文件:', res.tempFilePath)
  console.log('录音时长:', res.duration)
})

// 开始录音
recorderManager.start({
  duration: 10000, // 录音时长
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 96000,
  format: 'mp3'
})

// 停止录音
recorderManager.stop()
```

### 音频播放

```javascript
// 创建音频上下文
const audioContext = wx.createAudioContext('myAudio')

// 播放
audioContext.play()

// 暂停
audioContext.pause()

// 设置播放位置
audioContext.seek(30)
```

## 📶 蓝牙

### 蓝牙低功耗(BLE)

```javascript
// 初始化蓝牙模块
wx.openBluetoothAdapter({
  success: function(res) {
    console.log('蓝牙初始化成功')
    startBluetoothDevicesDiscovery()
  },
  fail: function(err) {
    console.error('蓝牙初始化失败:', err)
  }
})

// 开始搜索设备
function startBluetoothDevicesDiscovery() {
  wx.startBluetoothDevicesDiscovery({
    allowDuplicatesKey: false,
    success: function(res) {
      console.log('开始搜索设备')
    }
  })
}

// 监听设备发现
wx.onBluetoothDeviceFound(function(res) {
  console.log('发现设备:', res.devices)
})

// 连接设备
function connectDevice(deviceId) {
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function(res) {
      console.log('连接成功')
      getBLEDeviceServices(deviceId)
    }
  })
}
```

## 📁 文件系统

### 文件操作

```javascript
// 获取文件管理器
const fs = wx.getFileSystemManager()

// 写入文件
fs.writeFile({
  filePath: `${wx.env.USER_DATA_PATH}/test.txt`,
  data: 'Hello World',
  encoding: 'utf8',
  success: function(res) {
    console.log('文件写入成功')
  }
})

// 读取文件
fs.readFile({
  filePath: `${wx.env.USER_DATA_PATH}/test.txt`,
  encoding: 'utf8',
  success: function(res) {
    console.log('文件内容:', res.data)
  }
})

// 删除文件
fs.unlink({
  filePath: `${wx.env.USER_DATA_PATH}/test.txt`,
  success: function(res) {
    console.log('文件删除成功')
  }
})
```

## 🔧 最佳实践

### 权限管理

```javascript
// 统一权限检查函数
function checkPermission(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: function(res) {
        if (res.authSetting[scope]) {
          resolve(true)
        } else {
          wx.authorize({
            scope: scope,
            success: () => resolve(true),
            fail: () => reject(false)
          })
        }
      }
    })
  })
}

// 使用示例
async function useCamera() {
  try {
    await checkPermission('scope.camera')
    // 使用相机功能
    wx.chooseImage({
      sourceType: ['camera']
    })
  } catch (error) {
    wx.showToast({
      title: '需要相机权限',
      icon: 'none'
    })
  }
}
```

### 错误处理

```javascript
// 统一错误处理
function handleDeviceError(api, error) {
  const errorMessages = {
    'getLocation': '获取位置失败，请检查定位权限',
    'chooseImage': '选择图片失败，请检查相册权限',
    'startRecord': '录音失败，请检查麦克风权限'
  }
  
  const message = errorMessages[api] || '操作失败'
  
  wx.showToast({
    title: message,
    icon: 'none'
  })
  
  console.error(`${api} error:`, error)
}
```

### 性能优化

```javascript
// 防抖处理传感器数据
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 使用防抖处理加速度计数据
const debouncedAccelerometer = debounce((res) => {
  // 处理加速度计数据
  console.log('加速度数据:', res)
}, 100)

wx.onAccelerometerChange(debouncedAccelerometer)
```

## 📚 相关资源

- [微信小程序设备能力API文档](https://developers.weixin.qq.com/miniprogram/dev/api/device/bluetooth/wx.openBluetoothAdapter.html)
- [支付宝小程序设备能力API](https://opendocs.alipay.com/mini/api/device)
- [百度小程序设备能力API](https://smartprogram.baidu.com/docs/develop/api/device/)

通过合理使用设备能力API，可以为用户提供更加丰富和便捷的小程序体验。记住要始终考虑用户隐私和权限管理，确保功能的稳定性和安全性。