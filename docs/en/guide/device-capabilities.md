# Device Capabilities

Mini programs can access various device capabilities to create rich user experiences. This guide covers the most commonly used device APIs and best practices.

## System Information

### Getting Device Info

```javascript
// Get system information
wx.getSystemInfo({
  success: (res) => {
    console.log('Device info:', {
      brand: res.brand,
      model: res.model,
      system: res.system,
      platform: res.platform,
      screenWidth: res.screenWidth,
      screenHeight: res.screenHeight,
      windowWidth: res.windowWidth,
      windowHeight: res.windowHeight,
      pixelRatio: res.pixelRatio,
      statusBarHeight: res.statusBarHeight,
      safeArea: res.safeArea
    })
  }
})

// Synchronous version
const systemInfo = wx.getSystemInfoSync()
console.log('System:', systemInfo.system)
console.log('Version:', systemInfo.version)
```

### Safe Area Handling

```javascript
// Handle safe area for different devices
Page({
  data: {
    safeAreaInsets: { top: 0, bottom: 0 }
  },
  
  onLoad() {
    const { safeArea, screenHeight, statusBarHeight } = wx.getSystemInfoSync()
    
    this.setData({
      safeAreaInsets: {
        top: safeArea.top,
        bottom: screenHeight - safeArea.bottom
      },
      statusBarHeight
    })
  }
})
```

```css
/* CSS for safe area */
.safe-area-top {
  padding-top: var(--status-bar-height);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

## Camera & Media

### Camera Access

```javascript
// Take photo
wx.chooseImage({
  count: 1,
  sizeType: ['original', 'compressed'],
  sourceType: ['album', 'camera'],
  success: (res) => {
    const tempFilePaths = res.tempFilePaths
    console.log('Selected images:', tempFilePaths)
    
    // Display image
    this.setData({
      imagePath: tempFilePaths[0]
    })
  }
})

// Take photo directly
wx.chooseMedia({
  count: 1,
  mediaType: ['image'],
  sourceType: ['album', 'camera'],
  camera: 'back',
  success: (res) => {
    console.log('Media files:', res.tempFiles)
  }
})
```

### Video Recording

```javascript
// Record video
wx.chooseVideo({
  sourceType: ['album', 'camera'],
  maxDuration: 60,
  camera: 'back',
  success: (res) => {
    console.log('Video info:', {
      tempFilePath: res.tempFilePath,
      duration: res.duration,
      size: res.size,
      height: res.height,
      width: res.width
    })
  }
})

// Using chooseMedia for video
wx.chooseMedia({
  count: 1,
  mediaType: ['video'],
  sourceType: ['album', 'camera'],
  maxDuration: 30,
  success: (res) => {
    const media = res.tempFiles[0]
    console.log('Video selected:', media)
  }
})
```

## Location Services

### Getting Current Location

```javascript
// Get current location
wx.getLocation({
  type: 'gcj02', // 'wgs84' | 'gcj02'
  success: (res) => {
    console.log('Location:', {
      latitude: res.latitude,
      longitude: res.longitude,
      speed: res.speed,
      accuracy: res.accuracy,
      altitude: res.altitude
    })
    
    // Use location data
    this.setData({
      userLocation: {
        latitude: res.latitude,
        longitude: res.longitude
      }
    })
  },
  fail: (err) => {
    console.error('Location access denied:', err)
    // Handle permission denial
    this.handleLocationError()
  }
})
```

### Location Permission

```javascript
// Check and request location permission
function requestLocationPermission() {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          // Permission already granted
          resolve(true)
        } else {
          // Request permission
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => resolve(true),
            fail: () => {
              // Show manual authorization dialog
              wx.showModal({
                title: 'Location Permission',
                content: 'Please enable location access in settings',
                confirmText: 'Settings',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting()
                  }
                }
              })
              reject(false)
            }
          })
        }
      }
    })
  })
}

// Usage
Page({
  async getCurrentLocation() {
    try {
      await requestLocationPermission()
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          console.log('Location obtained:', res)
        }
      })
    } catch (error) {
      console.log('Location permission denied')
    }
  }
})
```

### Map Integration

```html
<!-- Map component -->
<map
  id="map"
  longitude="{{longitude}}"
  latitude="{{latitude}}"
  scale="16"
  markers="{{markers}}"
  bindmarkertap="onMarkerTap"
  bindregionchange="onRegionChange"
  style="width: 100%; height: 300px;"
></map>
```

```javascript
Page({
  data: {
    latitude: 39.908823,
    longitude: 116.397470,
    markers: [
      {
        id: 1,
        latitude: 39.908823,
        longitude: 116.397470,
        title: 'Current Location',
        iconPath: '/images/marker.png',
        width: 30,
        height: 30
      }
    ]
  },
  
  onMarkerTap(e) {
    console.log('Marker tapped:', e.detail.markerId)
  },
  
  onRegionChange(e) {
    if (e.type === 'end') {
      console.log('Region changed:', e.detail)
    }
  }
})
```

## Sensors

### Accelerometer

```javascript
// Start accelerometer
wx.startAccelerometer({
  interval: 'normal', // 'game' | 'ui' | 'normal'
  success: () => {
    console.log('Accelerometer started')
  }
})

// Listen to accelerometer data
wx.onAccelerometerChange((res) => {
  console.log('Acceleration:', {
    x: res.x,
    y: res.y,
    z: res.z
  })
  
  // Detect shake gesture
  const acceleration = Math.sqrt(res.x * res.x + res.y * res.y + res.z * res.z)
  if (acceleration > 2) {
    console.log('Device shaken!')
    this.handleShakeGesture()
  }
})

// Stop accelerometer
wx.stopAccelerometer()
```

### Compass

```javascript
// Start compass
wx.startCompass({
  success: () => {
    console.log('Compass started')
  }
})

// Listen to compass data
wx.onCompassChange((res) => {
  console.log('Direction:', res.direction)
  
  // Update UI with direction
  this.setData({
    compassDirection: res.direction
  })
})

// Stop compass
wx.stopCompass()
```

### Gyroscope

```javascript
// Start gyroscope
wx.startGyroscope({
  interval: 'normal',
  success: () => {
    console.log('Gyroscope started')
  }
})

// Listen to gyroscope data
wx.onGyroscopeChange((res) => {
  console.log('Gyroscope:', {
    x: res.x, // rotation around x-axis
    y: res.y, // rotation around y-axis
    z: res.z  // rotation around z-axis
  })
})

// Stop gyroscope
wx.stopGyroscope()
```

## Device Motion & Vibration

### Vibration

```javascript
// Short vibration
wx.vibrateShort({
  type: 'heavy', // 'heavy' | 'medium' | 'light'
  success: () => {
    console.log('Vibration triggered')
  }
})

// Long vibration
wx.vibrateLong({
  success: () => {
    console.log('Long vibration triggered')
  }
})

// Custom vibration pattern (Android only)
if (wx.canIUse('vibrateShort')) {
  // Vibrate in pattern: 200ms on, 100ms off, 200ms on
  setTimeout(() => wx.vibrateShort(), 0)
  setTimeout(() => wx.vibrateShort(), 300)
}
```

### Screen Brightness

```javascript
// Get screen brightness
wx.getScreenBrightness({
  success: (res) => {
    console.log('Current brightness:', res.value)
  }
})

// Set screen brightness
wx.setScreenBrightness({
  value: 0.8, // 0-1
  success: () => {
    console.log('Brightness set')
  }
})

// Keep screen on
wx.setKeepScreenOn({
  keepScreenOn: true,
  success: () => {
    console.log('Screen will stay on')
  }
})
```

## Audio & Voice

### Audio Recording

```javascript
// Start recording
const recorderManager = wx.getRecorderManager()

recorderManager.onStart(() => {
  console.log('Recording started')
})

recorderManager.onStop((res) => {
  console.log('Recording stopped:', {
    tempFilePath: res.tempFilePath,
    duration: res.duration,
    fileSize: res.fileSize
  })
})

recorderManager.onError((res) => {
  console.error('Recording error:', res)
})

// Start recording
recorderManager.start({
  duration: 60000, // max 60 seconds
  sampleRate: 16000,
  numberOfChannels: 1,
  encodeBitRate: 96000,
  format: 'mp3'
})

// Stop recording
recorderManager.stop()
```

### Audio Playback

```javascript
// Create audio context
const audioContext = wx.createAudioContext('myAudio')

// Play audio
audioContext.play()

// Pause audio
audioContext.pause()

// Set current time
audioContext.seek(30) // seek to 30 seconds

// Using inner audio context for background audio
const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.src = 'https://example.com/audio.mp3'
innerAudioContext.autoplay = true

innerAudioContext.onPlay(() => {
  console.log('Audio started playing')
})

innerAudioContext.onError((res) => {
  console.error('Audio error:', res)
})
```

## Bluetooth

### Bluetooth Low Energy (BLE)

```javascript
// Initialize Bluetooth adapter
wx.openBluetoothAdapter({
  success: () => {
    console.log('Bluetooth adapter opened')
    this.startBluetoothDevicesDiscovery()
  },
  fail: (err) => {
    console.error('Failed to open Bluetooth adapter:', err)
  }
})

// Start discovering devices
wx.startBluetoothDevicesDiscovery({
  allowDuplicatesKey: false,
  success: () => {
    console.log('Started discovering devices')
  }
})

// Listen for new devices
wx.onBluetoothDeviceFound((res) => {
  console.log('Found devices:', res.devices)
  
  res.devices.forEach(device => {
    if (device.name && device.name.includes('MyDevice')) {
      // Connect to specific device
      this.connectToDevice(device.deviceId)
    }
  })
})

// Connect to device
function connectToDevice(deviceId) {
  wx.createBLEConnection({
    deviceId,
    success: () => {
      console.log('Connected to device')
      // Get services
      wx.getBLEDeviceServices({
        deviceId,
        success: (res) => {
          console.log('Services:', res.services)
        }
      })
    }
  })
}

// Close Bluetooth adapter
wx.closeBluetoothAdapter()
```

## File System

### File Operations

```javascript
// Get file system manager
const fs = wx.getFileSystemManager()

// Write file
fs.writeFile({
  filePath: `${wx.env.USER_DATA_PATH}/data.txt`,
  data: 'Hello World',
  encoding: 'utf8',
  success: () => {
    console.log('File written successfully')
  },
  fail: (err) => {
    console.error('Write file failed:', err)
  }
})

// Read file
fs.readFile({
  filePath: `${wx.env.USER_DATA_PATH}/data.txt`,
  encoding: 'utf8',
  success: (res) => {
    console.log('File content:', res.data)
  },
  fail: (err) => {
    console.error('Read file failed:', err)
  }
})

// Check if file exists
fs.access({
  path: `${wx.env.USER_DATA_PATH}/data.txt`,
  success: () => {
    console.log('File exists')
  },
  fail: () => {
    console.log('File does not exist')
  }
})

// Delete file
fs.unlink({
  filePath: `${wx.env.USER_DATA_PATH}/data.txt`,
  success: () => {
    console.log('File deleted')
  }
})
```

## Best Practices

### Permission Management

```javascript
// Centralized permission manager
class PermissionManager {
  static async checkPermission(scope) {
    return new Promise((resolve) => {
      wx.getSetting({
        success: (res) => {
          resolve(res.authSetting[scope] === true)
        },
        fail: () => resolve(false)
      })
    })
  }
  
  static async requestPermission(scope, title, content) {
    const hasPermission = await this.checkPermission(scope)
    if (hasPermission) return true
    
    return new Promise((resolve) => {
      wx.authorize({
        scope,
        success: () => resolve(true),
        fail: () => {
          wx.showModal({
            title,
            content,
            confirmText: 'Settings',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting()
              }
              resolve(false)
            }
          })
        }
      })
    })
  }
}

// Usage
Page({
  async useCamera() {
    const hasPermission = await PermissionManager.requestPermission(
      'scope.camera',
      'Camera Permission',
      'Please allow camera access to take photos'
    )
    
    if (hasPermission) {
      wx.chooseImage({
        sourceType: ['camera'],
        success: (res) => {
          console.log('Photo taken:', res.tempFilePaths)
        }
      })
    }
  }
})
```

### Error Handling

```javascript
// Robust device capability usage
function safeDeviceCall(apiCall, fallback) {
  return new Promise((resolve, reject) => {
    if (!wx.canIUse(apiCall.name)) {
      console.warn(`API ${apiCall.name} not supported`)
      if (fallback) {
        resolve(fallback())
      } else {
        reject(new Error('API not supported'))
      }
      return
    }
    
    apiCall.call({
      success: resolve,
      fail: (err) => {
        console.error(`${apiCall.name} failed:`, err)
        if (fallback) {
          resolve(fallback())
        } else {
          reject(err)
        }
      }
    })
  })
}

// Usage
Page({
  async getDeviceInfo() {
    try {
      const systemInfo = await safeDeviceCall(
        { name: 'getSystemInfo', call: wx.getSystemInfo },
        () => ({ platform: 'unknown' })
      )
      console.log('System info:', systemInfo)
    } catch (error) {
      console.error('Failed to get system info:', error)
    }
  }
})
```

### Performance Optimization

```javascript
// Debounce sensor data
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

// Throttle accelerometer updates
const throttledAccelerometerHandler = debounce((data) => {
  console.log('Accelerometer data:', data)
  // Process data
}, 100) // Update every 100ms

wx.onAccelerometerChange(throttledAccelerometerHandler)
```

Device capabilities provide powerful ways to create engaging mini program experiences. Always handle permissions gracefully and provide fallbacks for unsupported features.