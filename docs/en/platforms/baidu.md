# Baidu Smart Program Platform

Baidu Smart Program is a lightweight application platform developed by Baidu, allowing users to access applications directly within Baidu's ecosystem without downloading separate apps. It leverages Baidu's AI capabilities and search traffic to provide intelligent user experiences.

## Platform Overview

### What is Baidu Smart Program?

Baidu Smart Program is a sub-application that runs within Baidu's mobile app and other Baidu products. It focuses on providing AI-powered services and leverages Baidu's search ecosystem to deliver relevant content and functionality to users.

### Key Features

- **AI Integration**: Deep integration with Baidu's AI services
- **Search Traffic**: Access to Baidu's massive search traffic
- **Instant Access**: No download required, accessible through Baidu app
- **Rich APIs**: Comprehensive APIs including AI, map, and search services
- **Cross-Platform**: Runs on iOS and Android devices
- **SEO Benefits**: Better discoverability through Baidu search
- **Smart Recommendations**: AI-powered content recommendations

## Development Environment

### Developer Tools

**Baidu Smart Program Studio** is the official IDE:

- **Code Editor**: Advanced editing with syntax highlighting
- **Real-time Preview**: Instant preview and debugging
- **Simulator**: Multi-device simulation environment
- **AI Tools**: Integrated AI development tools
- **Performance Monitor**: Performance analysis and optimization

### System Requirements

- **Operating System**: Windows 7+, macOS 10.10+
- **Baidu App Version**: Latest version recommended
- **Developer Account**: Baidu Smart Program developer account required

## Getting Started

### Registration Process

1. **Create Developer Account**
   - Visit [Baidu Smart Program Platform](https://smartprogram.baidu.com/)
   - Register with Baidu account
   - Complete developer verification

2. **Create Smart Program**
   - Login to developer console
   - Create new smart program project
   - Configure application information
   - Get AppID for development

### Development Setup

```bash
# Download Baidu Smart Program Studio
# Visit: https://smartprogram.baidu.com/developer/devtools.html

# Create new project in IDE
# Enter AppID and project information
# Choose template or start from scratch
```

### Project Structure

```
baidu-smartprogram/
├── pages/              # Page files
│   ├── index/
│   │   ├── index.js    # Page logic
│   │   ├── index.json  # Page configuration
│   │   ├── index.swan  # Page structure
│   │   └── index.css   # Page styles
├── components/         # Custom components
├── utils/              # Utility functions
├── app.js             # App logic
├── app.json           # App configuration
├── app.css            # Global styles
└── project.swan.json  # Project configuration
```

## Core Technologies

### SWAN (Smart Web App Native)

SWAN is Baidu's markup language for building user interfaces:

```html
<!-- Basic structure -->
<view class="container">
  <text class="title">{{title}}</text>
  <button bindtap="handleClick">Click Me</button>
</view>

<!-- Conditional rendering -->
<view s-if="condition">
  <text>Condition is true</text>
</view>
<view s-else>
  <text>Condition is false</text>
</view>

<!-- List rendering -->
<view s-for="item in items" s-key="item.id">
  <text>{{item.name}}</text>
</view>

<!-- Template usage -->
<template name="item-template">
  <view class="item">
    <text>{{name}}</text>
    <text>{{description}}</text>
  </view>
</template>

<template is="item-template" data="{{name: 'Product', description: 'Description'}}"/>
```

### CSS Styling

Standard CSS with additional features for smart programs:

```css
/* Global styles */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20rpx;
  background-color: #f7f7f7;
}

/* Responsive units */
.title {
  font-size: 32rpx;  /* rpx: responsive pixel */
  color: #333;
  margin-bottom: 20rpx;
  font-weight: 600;
}

/* Import styles */
@import "common.css";

/* Animation */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}
```

### JavaScript Logic

```javascript
// app.js - Application logic
App({
  onLaunch(options) {
    console.log('App launched', options)
    this.initializeApp()
  },
  
  onShow(options) {
    console.log('App shown', options)
  },
  
  onHide() {
    console.log('App hidden')
  },
  
  initializeApp() {
    // Initialize app with Baidu services
    swan.getSystemInfo({
      success: (res) => {
        console.log('System info:', res)
        this.globalData.systemInfo = res
      }
    })
  },
  
  globalData: {
    userInfo: null,
    systemInfo: null
  }
})

// page.js - Page logic
Page({
  data: {
    title: 'Hello Baidu Smart Program',
    items: [],
    loading: false
  },
  
  onLoad(options) {
    console.log('Page loaded with options:', options)
    this.loadData()
  },
  
  onShow() {
    console.log('Page shown')
  },
  
  onReady() {
    console.log('Page ready')
  },
  
  loadData() {
    this.setData({ loading: true })
    
    swan.request({
      url: 'https://api.example.com/data',
      method: 'GET',
      success: (res) => {
        this.setData({
          items: res.data,
          loading: false
        })
      },
      fail: (err) => {
        console.error('Request failed:', err)
        this.setData({ loading: false })
      }
    })
  },
  
  handleClick(e) {
    console.log('Button clicked', e)
    swan.showToast({
      title: 'Success!',
      icon: 'success',
      duration: 2000
    })
  }
})
```

## API Categories

### Basic APIs

#### Interface APIs
```javascript
// Show toast
swan.showToast({
  title: 'Operation successful',
  icon: 'success',
  duration: 3000
})

// Show modal
swan.showModal({
  title: 'Confirm',
  content: 'Are you sure to proceed?',
  success: (res) => {
    if (res.confirm) {
      console.log('User confirmed')
    }
  }
})

// Show loading
swan.showLoading({
  title: 'Loading...'
})

swan.hideLoading()

// Show action sheet
swan.showActionSheet({
  itemList: ['Option 1', 'Option 2', 'Option 3'],
  success: (res) => {
    console.log('Selected index:', res.tapIndex)
  }
})
```

#### Navigation APIs
```javascript
// Navigate to page
swan.navigateTo({
  url: '/pages/detail/detail?id=123'
})

// Redirect to page
swan.redirectTo({
  url: '/pages/login/login'
})

// Switch tab
swan.switchTab({
  url: '/pages/home/home'
})

// Go back
swan.navigateBack({
  delta: 1
})

// Relaunch app
swan.reLaunch({
  url: '/pages/index/index'
})
```

### Network APIs

```javascript
// HTTP request
swan.request({
  url: 'https://api.example.com/users',
  method: 'POST',
  data: {
    name: 'John',
    email: 'john@example.com'
  },
  header: {
    'Content-Type': 'application/json'
  },
  success: (res) => {
    console.log('Request success:', res.data)
  },
  fail: (err) => {
    console.error('Request failed:', err)
  }
})

// Upload file
swan.uploadFile({
  url: 'https://api.example.com/upload',
  filePath: tempFilePath,
  name: 'file',
  formData: {
    user: 'test'
  },
  success: (res) => {
    console.log('Upload success:', res)
  }
})

// Download file
swan.downloadFile({
  url: 'https://example.com/file.pdf',
  success: (res) => {
    console.log('Download success:', res.tempFilePath)
  }
})
```

### Storage APIs

```javascript
// Synchronous storage
swan.setStorageSync('userToken', 'abc123')
const token = swan.getStorageSync('userToken')
swan.removeStorageSync('userToken')
swan.clearStorageSync()

// Asynchronous storage
swan.setStorage({
  key: 'userInfo',
  data: {
    name: 'John',
    age: 25,
    preferences: ['technology', 'sports']
  },
  success: () => {
    console.log('Storage set successfully')
  }
})

swan.getStorage({
  key: 'userInfo',
  success: (res) => {
    console.log('User info:', res.data)
  }
})
```

### Device APIs

```javascript
// Get system info
swan.getSystemInfo({
  success: (res) => {
    console.log('System info:', res)
    console.log('Platform:', res.platform)
    console.log('Version:', res.version)
    console.log('Screen:', res.screenWidth, res.screenHeight)
  }
})

// Get location
swan.getLocation({
  type: 'gcj02',
  success: (res) => {
    console.log('Location:', res.latitude, res.longitude)
    console.log('Speed:', res.speed)
    console.log('Accuracy:', res.accuracy)
  }
})

// Vibrate
swan.vibrateLong()
swan.vibrateShort()

// Set clipboard
swan.setClipboardData({
  data: 'Hello Baidu Smart Program',
  success: () => {
    console.log('Copied to clipboard')
  }
})

// Get clipboard
swan.getClipboardData({
  success: (res) => {
    console.log('Clipboard content:', res.data)
  }
})
```

## AI Integration

### Baidu AI Services

#### Speech Recognition
```javascript
// Start speech recognition
swan.ai.speech({
  mode: 'dnn',
  success: (res) => {
    console.log('Speech recognition result:', res.result)
  },
  fail: (err) => {
    console.error('Speech recognition failed:', err)
  }
})
```

#### Image Recognition
```javascript
// Recognize image content
swan.ai.imageAudit({
  image: base64Image,
  success: (res) => {
    console.log('Image audit result:', res)
  }
})

// OCR text recognition
swan.ai.ocrIdCard({
  image: base64Image,
  detect_direction: true,
  success: (res) => {
    console.log('OCR result:', res)
  }
})
```

#### Natural Language Processing
```javascript
// Text sentiment analysis
swan.ai.nlpLexerCustom({
  text: 'This is a great product!',
  success: (res) => {
    console.log('NLP analysis:', res)
  }
})
```

### Baidu Map Integration

```javascript
// Show location on map
swan.openLocation({
  latitude: 39.916527,
  longitude: 116.397128,
  scale: 18,
  name: 'Baidu Building',
  address: 'No.10 Shangdi 10th Street, Beijing'
})

// Choose location
swan.chooseLocation({
  success: (res) => {
    console.log('Selected location:', res)
    console.log('Name:', res.name)
    console.log('Address:', res.address)
    console.log('Latitude:', res.latitude)
    console.log('Longitude:', res.longitude)
  }
})
```

## Component Development

### Custom Components

```javascript
// components/my-component/my-component.js
Component({
  properties: {
    title: {
      type: String,
      value: 'Default Title'
    },
    items: {
      type: Array,
      value: []
    }
  },
  
  data: {
    count: 0,
    visible: true
  },
  
  methods: {
    handleTap() {
      this.setData({
        count: this.data.count + 1
      })
      
      // Trigger custom event
      this.triggerEvent('customEvent', {
        count: this.data.count
      })
    },
    
    toggle() {
      this.setData({
        visible: !this.data.visible
      })
    }
  },
  
  lifetimes: {
    attached() {
      console.log('Component attached')
    },
    
    detached() {
      console.log('Component detached')
    }
  }
})
```

```html
<!-- components/my-component/my-component.swan -->
<view class="my-component" s-if="visible">
  <text class="title">{{title}}</text>
  <view class="content">
    <text class="count">Count: {{count}}</text>
    <button bindtap="handleTap" class="increment-btn">
      Increment
    </button>
    <button bindtap="toggle" class="toggle-btn">
      Toggle
    </button>
  </view>
  <slot></slot>
</view>
```

```json
{
  "component": true,
  "usingComponents": {}
}
```

### Using Custom Components

```json
{
  "usingComponents": {
    "my-component": "/components/my-component/my-component"
  }
}
```

```html
<my-component 
  title="Custom Component" 
  items="{{itemList}}"
  bind:customEvent="handleCustomEvent">
  <text>This is slot content</text>
</my-component>
```

## Advanced Features

### Search Integration

```javascript
// Submit sitemap for better search indexing
swan.request({
  url: 'https://openapi.baidu.com/rest/2.0/smartapp/access/submitresource',
  method: 'POST',
  data: {
    access_token: 'your_access_token',
    type: 1,
    url_list: JSON.stringify([
      {
        path: 'pages/detail/detail',
        params: 'id=123'
      }
    ])
  }
})
```

### Smart Recommendations

```javascript
// Get personalized recommendations
swan.request({
  url: 'https://api.example.com/recommendations',
  data: {
    user_id: 'user123',
    category: 'technology'
  },
  success: (res) => {
    this.setData({
      recommendations: res.data
    })
  }
})
```

### Performance Optimization

```javascript
// Preload next page
swan.preloadPage({
  url: '/pages/detail/detail'
})

// Report analytics
swan.reportAnalytics('page_view', {
  page: 'index',
  timestamp: Date.now()
})
```

## Performance Optimization

### Best Practices

1. **Data Management**
   - Use specific data paths in setData
   - Implement data caching
   - Optimize data structure

```javascript
// Good practice
this.setData({
  'user.name': 'John',
  'list[0].status': 'active'
})

// Avoid
this.setData({
  user: this.data.user
})
```

2. **Image Optimization**
   - Use WebP format when supported
   - Implement lazy loading
   - Compress images appropriately

3. **Code Splitting**
   - Use subpackages for large applications
   - Implement on-demand loading

```json
{
  "pages": [...],
  "subPackages": [
    {
      "root": "pages/sub",
      "pages": [
        "detail/detail"
      ]
    }
  ]
}
```

### Performance Monitoring

```javascript
// Monitor performance
swan.getPerformance().observe('navigation', (list) => {
  console.log('Performance entries:', list.getEntries())
})

// Track custom metrics
const observer = swan.getPerformance().createObserver((entryList) => {
  entryList.getEntries().forEach((entry) => {
    console.log('Performance entry:', entry)
  })
})

observer.observe({
  entryTypes: ['render', 'script']
})
```

## Testing and Debugging

### Debugging Tools

1. **Console Debugging**
   - Use console methods for logging
   - Inspect network requests
   - Monitor performance

2. **Remote Debugging**
   - Enable remote debugging in IDE
   - Test on real devices
   - Debug different Baidu app versions

### Testing Strategies

```javascript
// Unit testing example
function validateUserInput(input) {
  if (!input || input.trim() === '') {
    return { valid: false, message: 'Input cannot be empty' }
  }
  if (input.length < 3) {
    return { valid: false, message: 'Input too short' }
  }
  return { valid: true, message: 'Valid input' }
}

// Test the function
console.assert(validateUserInput('').valid === false, 'Empty input should be invalid')
console.assert(validateUserInput('ab').valid === false, 'Short input should be invalid')
console.assert(validateUserInput('abc').valid === true, 'Valid input should pass')
console.log('All tests passed')
```

## Deployment and Publishing

### Preparation

1. **Code Quality**
   - Code review and optimization
   - Performance testing
   - Accessibility testing

2. **Configuration**
   - Production environment setup
   - Domain whitelist configuration
   - SEO optimization

### Publishing Process

1. **Upload and Submit**
   - Upload code using IDE
   - Configure version information
   - Submit for review

2. **Review Process**
   - Baidu team reviews submission
   - Address any feedback
   - Wait for approval

3. **Release Management**
   - Publish approved version
   - Monitor user feedback
   - Analyze performance metrics

## Platform Guidelines

### Design Principles

1. **User Experience**
   - Follow Baidu design guidelines
   - Optimize for search scenarios
   - Provide clear navigation

2. **Content Quality**
   - Provide valuable content
   - Optimize for search discovery
   - Maintain content freshness

### SEO Best Practices

1. **Content Optimization**
   - Use descriptive titles and descriptions
   - Implement proper heading structure
   - Add relevant keywords naturally

2. **Technical SEO**
   - Optimize page loading speed
   - Implement proper URL structure
   - Add structured data markup

## Resources and Support

### Official Resources

- [Baidu Smart Program Documentation](https://smartprogram.baidu.com/developer/dev.html)
- [API Reference](https://smartprogram.baidu.com/developer/dev/api.html)
- [Component Library](https://smartprogram.baidu.com/developer/dev/component.html)
- [Developer Tools](https://smartprogram.baidu.com/developer/devtools.html)

### Community Resources

- [Baidu Developer Community](https://smartprogram.baidu.com/forum/)
- [GitHub Examples](https://github.com/baidu-smart-app)
- [Third-party Libraries](https://github.com/swan-team)

### Learning Materials

- Official tutorials and documentation
- Video courses and workshops
- Developer conferences and meetups
- Community blog posts and articles

## Conclusion

Baidu Smart Program platform offers unique advantages through its integration with Baidu's AI services and search ecosystem. It provides developers with powerful tools to create intelligent applications that can leverage Baidu's massive user base and advanced AI capabilities.

The platform's focus on search integration, AI services, and intelligent recommendations makes it an excellent choice for developers looking to create content-rich, discoverable applications. By following best practices and leveraging the platform's AI capabilities, developers can build innovative smart programs that provide exceptional user experiences and achieve better visibility in Baidu's search results.