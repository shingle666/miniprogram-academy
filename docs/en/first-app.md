# First Mini Program

This guide will walk you through creating your first mini program from scratch, covering the basic setup, development process, and deployment.

## 📋 Table of Contents

- [Project Setup](#project-setup)
- [Basic Structure](#basic-structure)
- [Creating Pages](#creating-pages)
- [Adding Components](#adding-components)
- [Styling Your App](#styling-your-app)
- [Adding Functionality](#adding-functionality)
- [Testing Your App](#testing-your-app)
- [Deployment](#deployment)

## 🚀 Project Setup

### Prerequisites
Before starting, ensure you have:
- WeChat Developer Tools installed
- A registered mini program account
- Basic knowledge of HTML, CSS, and JavaScript

### Creating a New Project
1. Open WeChat Developer Tools
2. Click "Create Project"
3. Fill in project information:
   - Project Name: `my-first-miniprogram`
   - Directory: Choose an empty folder
   - AppID: Use your registered AppID or test AppID
   - Development Mode: Mini Program
   - Backend Service: Don't use cloud service (for now)

4. Select template: JavaScript Basic Template
5. Click "Create"

## 🏗️ Basic Structure

After creating the project, you'll see this file structure:

```
my-first-miniprogram/
├── pages/
│   ├── index/
│   │   ├── index.js      # Page logic
│   │   ├── index.json    # Page configuration
│   │   ├── index.wxml    # Page structure
│   │   └── index.wxss    # Page styles
│   └── logs/
│       ├── logs.js
│       ├── logs.json
│       ├── logs.wxml
│       └── logs.wxss
├── utils/
│   └── util.js           # Utility functions
├── app.js               # App logic
├── app.json             # App configuration
├── app.wxss             # Global styles
├── project.config.json  # Project configuration
└── sitemap.json         # SEO configuration
```

### Understanding Key Files

#### app.json - App Configuration
```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "My First Mini Program",
    "navigationBarTextStyle": "black"
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

#### app.js - App Logic
```javascript
App({
  onLaunch() {
    // App launched
    console.log('App launched')
    
    // Get system info
    const systemInfo = wx.getSystemInfoSync()
    console.log('System info:', systemInfo)
    
    // Store global data
    this.globalData.systemInfo = systemInfo
  },
  
  onShow() {
    // App shown (foreground)
    console.log('App shown')
  },
  
  onHide() {
    // App hidden (background)
    console.log('App hidden')
  },
  
  globalData: {
    userInfo: null,
    systemInfo: null
  }
})
```

## 📄 Creating Pages

Let's create a new page for our app - a profile page.

### Step 1: Add Page to app.json
```json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile",
    "pages/logs/logs"
  ]
}
```

### Step 2: Create Page Files
Create the `pages/profile/` directory and add these files:

#### profile.js
```javascript
Page({
  data: {
    userInfo: null,
    hasUserInfo: false,
    canIUseGetUserProfile: false
  },
  
  onLoad() {
    // Check if getUserProfile is available
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  
  getUserProfile() {
    wx.getUserProfile({
      desc: 'Used to display user information',
      success: (res) => {
        console.log('User info:', res.userInfo)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        
        // Store in global data
        getApp().globalData.userInfo = res.userInfo
      },
      fail: (error) => {
        console.error('Get user profile failed:', error)
        wx.showToast({
          title: 'Authorization failed',
          icon: 'error'
        })
      }
    })
  },
  
  onShareAppMessage() {
    return {
      title: 'Check out my profile!',
      path: '/pages/profile/profile'
    }
  }
})
```

#### profile.wxml
```xml
<view class="container">
  <view class="profile-header">
    <text class="title">My Profile</text>
  </view>
  
  <view class="profile-content">
    <block wx:if="{{hasUserInfo}}">
      <view class="user-info">
        <image class="avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
        <view class="user-details">
          <text class="nickname">{{userInfo.nickName}}</text>
          <text class="location">{{userInfo.country}} {{userInfo.province}} {{userInfo.city}}</text>
        </view>
      </view>
      
      <view class="stats">
        <view class="stat-item">
          <text class="stat-number">0</text>
          <text class="stat-label">Posts</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">0</text>
          <text class="stat-label">Followers</text>
        </view>
        <view class="stat-item">
          <text class="stat-number">0</text>
          <text class="stat-label">Following</text>
        </view>
      </view>
    </block>
    
    <block wx:else>
      <view class="no-user-info">
        <text class="hint">Please authorize to view profile</text>
        <button 
          wx:if="{{canIUseGetUserProfile}}" 
          bindtap="getUserProfile"
          class="auth-button"
          type="primary"
        >
          Get User Info
        </button>
      </view>
    </block>
  </view>
</view>
```

#### profile.wxss
```css
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.profile-header {
  text-align: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.profile-content {
  background-color: white;
  border-radius: 20rpx;
  padding: 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 40rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 30rpx;
}

.user-details {
  flex: 1;
}

.nickname {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.location {
  font-size: 24rpx;
  color: #666;
}

.stats {
  display: flex;
  justify-content: space-around;
  border-top: 1rpx solid #eee;
  padding-top: 30rpx;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}

.no-user-info {
  text-align: center;
  padding: 60rpx 0;
}

.hint {
  display: block;
  font-size: 28rpx;
  color: #666;
  margin-bottom: 40rpx;
}

.auth-button {
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
}
```

#### profile.json
```json
{
  "navigationBarTitleText": "Profile",
  "enablePullDownRefresh": false
}
```

## 🧩 Adding Components

Let's create a reusable component for displaying statistics.

### Step 1: Create Component Directory
Create `components/stat-card/` directory.

#### stat-card.js
```javascript
Component({
  properties: {
    title: {
      type: String,
      value: ''
    },
    value: {
      type: Number,
      value: 0
    },
    icon: {
      type: String,
      value: ''
    }
  },
  
  methods: {
    onTap() {
      this.triggerEvent('tap', {
        title: this.properties.title,
        value: this.properties.value
      })
    }
  }
})
```

#### stat-card.wxml
```xml
<view class="stat-card" bindtap="onTap">
  <view class="icon">{{icon}}</view>
  <view class="content">
    <text class="value">{{value}}</text>
    <text class="title">{{title}}</text>
  </view>
</view>
```

#### stat-card.wxss
```css
.stat-card {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.content {
  flex: 1;
}

.value {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.title {
  font-size: 24rpx;
  color: #666;
}
```

#### stat-card.json
```json
{
  "component": true
}
```

### Step 2: Use Component in Page
Update `profile.json`:
```json
{
  "navigationBarTitleText": "Profile",
  "enablePullDownRefresh": false,
  "usingComponents": {
    "stat-card": "/components/stat-card/stat-card"
  }
}
```

Update `profile.wxml`:
```xml
<view class="stats-section">
  <stat-card 
    title="Posts" 
    value="{{userStats.posts}}" 
    icon="📝"
    bind:tap="onStatTap"
  />
  <stat-card 
    title="Followers" 
    value="{{userStats.followers}}" 
    icon="👥"
    bind:tap="onStatTap"
  />
  <stat-card 
    title="Following" 
    value="{{userStats.following}}" 
    icon="➕"
    bind:tap="onStatTap"
  />
</view>
```

## 🎨 Styling Your App

### Global Styles (app.wxss)
```css
/* Global styles */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  padding: 20rpx;
}

/* Button styles */
.btn-primary {
  background-color: #007aff;
  color: white;
  border-radius: 8rpx;
  border: none;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  border-radius: 8rpx;
  border: none;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}

/* Card styles */
.card {
  background-color: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

/* Text styles */
.text-primary {
  color: #007aff;
}

.text-secondary {
  color: #666;
}

.text-large {
  font-size: 32rpx;
}

.text-small {
  font-size: 24rpx;
}
```

### Theme Configuration
Create a theme system:

#### utils/theme.js
```javascript
const themes = {
  light: {
    backgroundColor: '#ffffff',
    textColor: '#333333',
    primaryColor: '#007aff',
    secondaryColor: '#f0f0f0'
  },
  dark: {
    backgroundColor: '#1a1a1a',
    textColor: '#ffffff',
    primaryColor: '#0a84ff',
    secondaryColor: '#2a2a2a'
  }
}

class ThemeManager {
  constructor() {
    this.currentTheme = wx.getStorageSync('theme') || 'light'
  }
  
  getTheme() {
    return themes[this.currentTheme]
  }
  
  setTheme(themeName) {
    if (themes[themeName]) {
      this.currentTheme = themeName
      wx.setStorageSync('theme', themeName)
      
      // Notify all pages to update
      const pages = getCurrentPages()
      pages.forEach(page => {
        if (page.onThemeChange) {
          page.onThemeChange(this.getTheme())
        }
      })
    }
  }
  
  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light'
    this.setTheme(newTheme)
  }
}

module.exports = new ThemeManager()
```

## ⚡ Adding Functionality

### Data Management
Create a simple data service:

#### utils/api.js
```javascript
const BASE_URL = 'https://api.example.com'

class ApiService {
  static request(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: BASE_URL + options.url,
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
  
  static put(url, data) {
    return this.request({ url, method: 'PUT', data })
  }
  
  static delete(url) {
    return this.request({ url, method: 'DELETE' })
  }
}

module.exports = ApiService
```

### Local Storage Helper
#### utils/storage.js
```javascript
class StorageHelper {
  static set(key, value) {
    try {
      wx.setStorageSync(key, value)
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  }
  
  static get(key, defaultValue = null) {
    try {
      const value = wx.getStorageSync(key)
      return value !== '' ? value : defaultValue
    } catch (error) {
      console.error('Storage get error:', error)
      return defaultValue
    }
  }
  
  static remove(key) {
    try {
      wx.removeStorageSync(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  }
  
  static clear() {
    try {
      wx.clearStorageSync()
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  }
}

module.exports = StorageHelper
```

## 🧪 Testing Your App

### Manual Testing Checklist
```markdown
- [ ] App launches successfully
- [ ] All pages load correctly
- [ ] Navigation works between pages
- [ ] User interactions respond properly
- [ ] Data displays correctly
- [ ] Error handling works
- [ ] Performance is acceptable
- [ ] Works on different screen sizes
```

### Debugging Tips
1. **Use Console Logs**: Add `console.log()` statements to track data flow
2. **Check Network Tab**: Monitor API requests in developer tools
3. **Use Debugger**: Set breakpoints in the developer tools
4. **Test on Real Device**: Use the preview feature to test on actual devices

### Common Issues and Solutions

#### Issue: Page not found
```javascript
// Solution: Check app.json pages array
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"  // Make sure path is correct
  ]
}
```

#### Issue: Component not displaying
```javascript
// Solution: Check component registration in page.json
{
  "usingComponents": {
    "my-component": "/components/my-component/my-component"
  }
}
```

#### Issue: Data not updating
```javascript
// Solution: Use setData to update page data
this.setData({
  userInfo: newUserInfo
})
```

## 🚀 Deployment

### Step 1: Build for Production
1. Click "Upload" in WeChat Developer Tools
2. Enter version number (e.g., "1.0.0")
3. Add version description
4. Click "Upload"

### Step 2: Submit for Review
1. Go to WeChat Mini Program Admin Panel
2. Navigate to "Development" → "Version Management"
3. Find your uploaded version
4. Click "Submit for Review"
5. Fill in review information
6. Submit

### Step 3: Release
After review approval:
1. Go to "Version Management"
2. Click "Release" on the approved version
3. Your mini program is now live!

## 🎯 Next Steps

Congratulations! You've created your first mini program. Here are some ideas for enhancement:

1. **Add More Pages**: Create additional pages like settings, about, etc.
2. **Implement Navigation**: Add tab bar or custom navigation
3. **Add Animations**: Use CSS animations or mini program animation APIs
4. **Integrate APIs**: Connect to real backend services
5. **Add Sharing**: Implement share functionality
6. **Optimize Performance**: Implement lazy loading and caching
7. **Add Testing**: Write unit tests for your components
8. **Implement State Management**: Use a state management solution for complex apps

### Useful Resources
- [WeChat Mini Program Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [Component Library](https://developers.weixin.qq.com/miniprogram/dev/component/)
- [API Reference](https://developers.weixin.qq.com/miniprogram/dev/api/)
- [Best Practices](https://developers.weixin.qq.com/miniprogram/dev/framework/performance/)

---

You've successfully created your first mini program! This foundation will help you build more complex and feature-rich applications. Keep experimenting and learning to master mini program development.