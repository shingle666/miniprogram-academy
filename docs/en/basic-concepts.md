# Basic Concepts

This guide introduces the fundamental concepts of mini-program development, helping you understand the core principles and architecture before diving into actual development.

## 📋 Table of Contents

- [What is a Mini Program](#what-is-a-mini-program)
- [Architecture Overview](#architecture-overview)
- [Development Model](#development-model)
- [Page Lifecycle](#page-lifecycle)
- [Component System](#component-system)
- [Data Binding](#data-binding)
- [Event Handling](#event-handling)
- [Routing System](#routing-system)

## 🤔 What is a Mini Program

### Definition
A mini program is a lightweight application that runs within a host app (like WeChat, Alipay) without requiring installation. Users can access mini programs instantly through scanning QR codes, searching, or sharing.

### Key Characteristics
- **No Installation Required**: Users can use immediately without downloading
- **Small Size**: Typically under 2MB for optimal loading speed
- **Native Performance**: Near-native performance through optimized runtime
- **Platform Integration**: Deep integration with host platform features
- **Cross-Platform**: One codebase can run on multiple platforms

### Advantages
- **Low User Acquisition Cost**: Easy discovery and sharing
- **Fast Loading**: Instant access without installation wait
- **Platform Ecosystem**: Leverage host platform's user base
- **Reduced Storage**: No device storage consumption
- **Easy Updates**: Automatic updates without user intervention

## 🏗️ Architecture Overview

### Runtime Architecture
```
┌─────────────────────────────────────┐
│           Host Platform             │
│  ┌─────────────────────────────────┐│
│  │        Mini Program             ││
│  │  ┌─────────────┬─────────────┐  ││
│  │  │   View      │   Logic     │  ││
│  │  │   Layer     │   Layer     │  ││
│  │  │             │             │  ││
│  │  │  WebView    │ JavaScript  │  ││
│  │  │  Rendering  │   Engine    │  ││
│  │  └─────────────┴─────────────┘  ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Dual-Thread Model
- **View Thread**: Handles UI rendering and user interactions
- **Logic Thread**: Executes JavaScript code and business logic
- **Native Bridge**: Facilitates communication between threads

### File Structure
```
mini-program/
├── pages/              # Page files
│   ├── index/
│   │   ├── index.js    # Page logic
│   │   ├── index.wxml  # Page structure
│   │   ├── index.wxss  # Page styles
│   │   └── index.json  # Page configuration
├── components/         # Custom components
├── utils/             # Utility functions
├── app.js            # App logic
├── app.json          # App configuration
├── app.wxss          # Global styles
└── project.config.json # Project configuration
```

## 💻 Development Model

### MVVM Pattern
Mini programs follow the MVVM (Model-View-ViewModel) pattern:

```javascript
// Model - Data
const userData = {
  name: 'John Doe',
  age: 30,
  hobbies: ['reading', 'coding']
}

// ViewModel - Page Logic
Page({
  data: {
    user: userData,
    isLoading: false
  },
  
  // Methods
  updateUser() {
    this.setData({
      'user.name': 'Jane Doe'
    })
  }
})
```

```xml
<!-- View - WXML Template -->
<view class="container">
  <text>Name: {{user.name}}</text>
  <text>Age: {{user.age}}</text>
  <button bindtap="updateUser">Update Name</button>
</view>
```

### Declarative Programming
Mini programs use declarative syntax for UI definition:

```xml
<!-- Conditional Rendering -->
<view wx:if="{{isLoggedIn}}">
  <text>Welcome, {{username}}!</text>
</view>
<view wx:else>
  <button bindtap="login">Login</button>
</view>

<!-- List Rendering -->
<view wx:for="{{items}}" wx:key="id">
  <text>{{item.name}}: {{item.price}}</text>
</view>
```

## 🔄 Page Lifecycle

### Lifecycle Methods
```javascript
Page({
  data: {
    message: 'Hello World'
  },
  
  // Page loaded
  onLoad(options) {
    console.log('Page loaded with options:', options)
    // Initialize data, parse parameters
  },
  
  // Page shown
  onShow() {
    console.log('Page shown')
    // Refresh data, start timers
  },
  
  // Page ready (first time only)
  onReady() {
    console.log('Page ready')
    // Get node references, set up interactions
  },
  
  // Page hidden
  onHide() {
    console.log('Page hidden')
    // Pause operations, save state
  },
  
  // Page unloaded
  onUnload() {
    console.log('Page unloaded')
    // Cleanup resources, save data
  },
  
  // Pull down refresh
  onPullDownRefresh() {
    console.log('Pull down refresh')
    // Refresh data
    wx.stopPullDownRefresh()
  },
  
  // Reach bottom
  onReachBottom() {
    console.log('Reached bottom')
    // Load more data
  }
})
```

### Lifecycle Flow
```
App Launch → onLaunch → onShow
    ↓
Page Load → onLoad → onShow → onReady
    ↓
User Interaction → onHide → onShow (when returning)
    ↓
Page Close → onUnload
    ↓
App Background → onHide
```

## 🧩 Component System

### Built-in Components
Mini programs provide various built-in components:

```xml
<!-- Basic Components -->
<view class="container">
  <text>Text content</text>
  <image src="/images/logo.png" mode="aspectFit" />
  <button type="primary" bindtap="handleClick">Click Me</button>
</view>

<!-- Form Components -->
<form bindsubmit="onSubmit">
  <input placeholder="Enter your name" bindinput="onInput" />
  <textarea placeholder="Enter description"></textarea>
  <switch checked="{{isEnabled}}" bindchange="onSwitchChange" />
  <button form-type="submit">Submit</button>
</form>

<!-- Navigation Components -->
<navigator url="/pages/detail/detail">Go to Detail</navigator>

<!-- Media Components -->
<video src="{{videoUrl}}" controls></video>
<audio src="{{audioUrl}}" controls></audio>
```

### Custom Components
Create reusable custom components:

```javascript
// components/user-card/user-card.js
Component({
  properties: {
    user: {
      type: Object,
      value: {}
    }
  },
  
  data: {
    isExpanded: false
  },
  
  methods: {
    toggleExpand() {
      this.setData({
        isExpanded: !this.data.isExpanded
      })
    }
  }
})
```

```xml
<!-- components/user-card/user-card.wxml -->
<view class="user-card">
  <view class="header" bindtap="toggleExpand">
    <text class="name">{{user.name}}</text>
    <text class="age">Age: {{user.age}}</text>
  </view>
  <view wx:if="{{isExpanded}}" class="details">
    <text>Email: {{user.email}}</text>
    <text>Phone: {{user.phone}}</text>
  </view>
</view>
```

## 🔗 Data Binding

### One-Way Data Binding
Data flows from logic layer to view layer:

```javascript
Page({
  data: {
    message: 'Hello',
    count: 0,
    user: {
      name: 'John',
      avatar: '/images/avatar.png'
    },
    items: ['apple', 'banana', 'orange']
  }
})
```

```xml
<!-- Simple binding -->
<text>{{message}}</text>

<!-- Object property binding -->
<text>{{user.name}}</text>
<image src="{{user.avatar}}" />

<!-- Array binding -->
<view wx:for="{{items}}" wx:key="*this">
  <text>{{item}}</text>
</view>

<!-- Expression binding -->
<text>{{count + 1}}</text>
<text>{{user.name.toUpperCase()}}</text>
```

### Dynamic Data Updates
Use `setData` to update data and trigger re-rendering:

```javascript
Page({
  data: {
    count: 0,
    user: { name: 'John', age: 25 }
  },
  
  increment() {
    this.setData({
      count: this.data.count + 1
    })
  },
  
  updateUser() {
    this.setData({
      'user.name': 'Jane',
      'user.age': 26
    })
  },
  
  addItem() {
    this.setData({
      [`items[${this.data.items.length}]`]: 'new item'
    })
  }
})
```

## ⚡ Event Handling

### Event Types
```xml
<!-- Touch Events -->
<button bindtap="onTap">Tap</button>
<view bindtouchstart="onTouchStart">Touch Start</view>
<view bindtouchmove="onTouchMove">Touch Move</view>

<!-- Input Events -->
<input bindinput="onInput" />
<textarea bindblur="onBlur" />
<form bindsubmit="onSubmit">

<!-- Custom Events -->
<custom-component bind:customevent="onCustomEvent" />
```

### Event Object
```javascript
Page({
  onTap(event) {
    console.log('Event type:', event.type)
    console.log('Target:', event.target)
    console.log('Current target:', event.currentTarget)
    console.log('Detail:', event.detail)
    console.log('Timestamp:', event.timeStamp)
  },
  
  onInput(event) {
    const value = event.detail.value
    this.setData({
      inputValue: value
    })
  }
})
```

### Event Bubbling
```xml
<view bindtap="onOuterTap">
  <view bindtap="onInnerTap">
    <button bindtap="onButtonTap">Click</button>
  </view>
</view>

<!-- Prevent bubbling -->
<view catchtap="onOuterTap">
  <button bindtap="onButtonTap">Click</button>
</view>
```

## 🧭 Routing System

### Navigation Methods
```javascript
// Navigate to new page
wx.navigateTo({
  url: '/pages/detail/detail?id=123&name=product'
})

// Redirect (replace current page)
wx.redirectTo({
  url: '/pages/login/login'
})

// Navigate back
wx.navigateBack({
  delta: 1 // Number of pages to go back
})

// Switch to tab page
wx.switchTab({
  url: '/pages/home/home'
})

// Relaunch app
wx.reLaunch({
  url: '/pages/index/index'
})
```

### Route Parameters
```javascript
// Sending parameters
wx.navigateTo({
  url: '/pages/detail/detail?id=123&category=electronics'
})

// Receiving parameters
Page({
  onLoad(options) {
    console.log('Page ID:', options.id)
    console.log('Category:', options.category)
  }
})
```

### Route Configuration
```json
{
  "pages": [
    "pages/index/index",
    "pages/detail/detail",
    "pages/profile/profile"
  ],
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "Home",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "Profile",
        "iconPath": "images/profile.png",
        "selectedIconPath": "images/profile-active.png"
      }
    ]
  }
}
```

## 🎯 Best Practices

### Performance Optimization
- **Minimize setData calls**: Batch updates when possible
- **Avoid deep object updates**: Use specific property paths
- **Optimize images**: Use appropriate formats and sizes
- **Lazy loading**: Load content when needed

### Code Organization
- **Modular structure**: Separate concerns into different files
- **Reusable components**: Create components for common UI patterns
- **Utility functions**: Extract common logic into utility modules
- **Consistent naming**: Use clear and consistent naming conventions

### User Experience
- **Loading states**: Show loading indicators for async operations
- **Error handling**: Provide meaningful error messages
- **Offline support**: Handle network connectivity issues
- **Accessibility**: Support screen readers and keyboard navigation

---

Understanding these basic concepts is essential for effective mini-program development. They form the foundation upon which all mini-program features and functionality are built.