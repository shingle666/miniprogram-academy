# Advanced Features

This guide covers advanced features and techniques for mini program development that can help you build more powerful and sophisticated applications.

## Custom Components

Custom components allow you to create reusable UI elements with encapsulated logic and styling. They are essential for building complex applications with maintainable code.

### Component Communication

Components can communicate with each other through various methods:

1. **Properties**: Pass data from parent to child
2. **Events**: Send data from child to parent
3. **Behaviors**: Share code between components
4. **Relations**: Establish relationships between components
5. **Global State**: Use app.globalData or a state management library

## Subpackages

Subpackages allow you to split your mini program into smaller chunks that are loaded on demand, improving initial load time.

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/cat/cat",
        "pages/dog/dog"
      ]
    },
    {
      "root": "packageB",
      "name": "pack2",
      "pages": [
        "pages/apple/apple",
        "pages/banana/banana"
      ]
    }
  ]
}
```

## Worker Threads

Worker threads allow you to run JavaScript in the background without blocking the UI thread.

```javascript
// Create a worker
const worker = wx.createWorker('workers/request/index.js')

// Send message to worker
worker.postMessage({
  msg: 'hello worker'
})

// Receive message from worker
worker.onMessage(function (res) {
  console.log('Message from worker:', res)
})

// Terminate worker when done
worker.terminate()
```

## Custom Navigation Bar

You can customize the navigation bar for a more branded experience:

```json
{
  "window": {
    "navigationStyle": "custom"
  }
}
```

Then create your own navigation bar component:

```html
<view class="custom-nav" style="height: {{statusBarHeight + 44}}px;">
  <view style="height: {{statusBarHeight}}px;"></view>
  <view class="nav-content">
    <view class="back" bindtap="navigateBack">Back</view>
    <view class="title">{{title}}</view>
    <view class="placeholder"></view>
  </view>
</view>
```

## Intersection Observer

The intersection observer API allows you to detect when an element enters or exits the viewport:

```javascript
this.intersectionObserver = wx.createIntersectionObserver(this)
this.intersectionObserver
  .relativeToViewport()
  .observe('.target-element', (res) => {
    if (res.intersectionRatio > 0) {
      console.log('Element is visible')
    } else {
      console.log('Element is not visible')
    }
  })
```

## Canvas

Canvas provides a powerful way to draw graphics and animations:

```javascript
const ctx = wx.createCanvasContext('myCanvas')

// Draw a rectangle
ctx.rect(10, 10, 150, 75)
ctx.setFillStyle('red')
ctx.fill()

// Draw text
ctx.setFontSize(20)
ctx.fillText('Hello Canvas', 50, 50)

// Draw image
ctx.drawImage('/path/to/image.png', 0, 0, 200, 200)

// Apply the drawing
ctx.draw()
```

## WebGL

For 3D graphics, you can use WebGL:

```javascript
const query = wx.createSelectorQuery()
query.select('#webgl-canvas')
  .node()
  .exec((res) => {
    const canvas = res[0].node
    const gl = canvas.getContext('webgl')
    
    // WebGL code here
  })
```

## Audio and Video

Mini programs provide APIs for audio and video playback:

```javascript
// Audio
const audioContext = wx.createInnerAudioContext()
audioContext.src = 'audio.mp3'
audioContext.play()

// Video
const videoContext = wx.createVideoContext('myVideo')
videoContext.play()
videoContext.requestFullScreen()
```

## Maps

Integrate maps into your mini program:

```html
<map id="map" 
  longitude="113.324520" 
  latitude="23.099994" 
  scale="14" 
  markers="{{markers}}" 
  bindmarkertap="markerTap"
  show-location>
</map>
```

```javascript
Page({
  data: {
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'Location Name'
    }]
  },
  markerTap(e) {
    console.log('Marker tapped:', e.markerId)
  }
})
```

## Bluetooth

Connect to Bluetooth devices:

```javascript
// Search for devices
wx.openBluetoothAdapter({
  success: () => {
    wx.startBluetoothDevicesDiscovery({
      success: () => {
        wx.onBluetoothDeviceFound((res) => {
          console.log('Device found:', res.devices)
        })
      }
    })
  }
})

// Connect to a device
wx.createBLEConnection({
  deviceId: 'device_id',
  success: () => {
    console.log('Connected')
  }
})
```

## AR Camera

Some platforms support AR features:

```html
<camera mode="ar" flash="off" binderror="error" bindscancode="scanCode"></camera>
```

## Cloud Functions

If the platform supports cloud functions, you can call them directly:

```javascript
wx.cloud.callFunction({
  name: 'functionName',
  data: {
    param1: 'value1',
    param2: 'value2'
  },
  success: (res) => {
    console.log('Result:', res.result)
  },
  fail: (err) => {
    console.error('Error:', err)
  }
})
```

## Custom Analytics

Track user behavior with custom analytics:

```javascript
wx.reportAnalytics('event_name', {
  param1: 'value1',
  param2: 'value2'
})
```

## Deep Linking

Support deep linking to specific pages in your mini program:

```javascript
// In app.js
App({
  onLaunch(options) {
    if (options.query.scene) {
      const scene = decodeURIComponent(options.query.scene)
      // Handle the scene parameter
    }
  }
})
```

## Offline Support

Implement offline support using storage:

```javascript
// Check if data exists in storage
try {
  const data = wx.getStorageSync('key')
  if (data) {
    // Use cached data
    this.setData({ items: data })
  } else {
    // Fetch from network
    this.fetchData()
  }
} catch (e) {
  console.error('Storage error:', e)
}

// Fetch and cache data
fetchData() {
  wx.request({
    url: 'https://api.example.com/data',
    success: (res) => {
      this.setData({ items: res.data })
      wx.setStorageSync('key', res.data)
    }
  })
}
```

## Best Practices

1. **Performance Optimization**:
   - Use subpackages for large applications
   - Implement lazy loading for images and content
   - Minimize the use of complex animations

2. **Security**:
   - Never store sensitive information in client-side code
   - Validate all user inputs on the server
   - Use HTTPS for all network requests

3. **User Experience**:
   - Provide feedback for all user actions
   - Implement proper error handling
   - Design for different screen sizes

4. **Code Organization**:
   - Follow a consistent coding style
   - Use a modular architecture
   - Document your code thoroughly

## Next Steps

Now that you're familiar with advanced features, you might want to explore:

- [Performance Optimization](./performance-optimization.md)
- [Debugging Tips](./debugging-tips.md)
- [Deployment](./deployment.md)