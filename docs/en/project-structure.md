# Project Structure

This guide provides a comprehensive overview of mini program project structure, including file organization, naming conventions, and architectural patterns for scalable development.

## 📋 Table of Contents

- [Basic Project Structure](#basic-project-structure)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Configuration Files](#configuration-files)
- [Page Structure](#page-structure)
- [Component Structure](#component-structure)
- [Utils and Libraries](#utils-and-libraries)
- [Asset Management](#asset-management)
- [Best Practices](#best-practices)

## 🏗️ Basic Project Structure

### Standard Mini Program Structure

```
my-miniprogram/
├── app.js                 # App logic
├── app.json              # App configuration
├── app.wxss              # Global styles
├── sitemap.json          # SEO configuration
├── project.config.json   # Project configuration
├── project.private.config.json # Private configuration
├── pages/                # Pages directory
│   ├── index/           # Home page
│   │   ├── index.js     # Page logic
│   │   ├── index.json   # Page configuration
│   │   ├── index.wxml   # Page template
│   │   └── index.wxss   # Page styles
│   ├── profile/         # Profile page
│   └── settings/        # Settings page
├── components/          # Custom components
│   ├── common/         # Common components
│   │   ├── header/
│   │   ├── footer/
│   │   └── loading/
│   └── business/       # Business components
├── utils/              # Utility functions
│   ├── api.js         # API utilities
│   ├── storage.js     # Storage utilities
│   ├── format.js      # Format utilities
│   └── constants.js   # Constants
├── assets/            # Static assets
│   ├── images/       # Images
│   ├── icons/        # Icons
│   └── fonts/        # Fonts
├── libs/             # Third-party libraries
├── styles/           # Global styles
│   ├── variables.wxss # Style variables
│   ├── mixins.wxss   # Style mixins
│   └── reset.wxss    # Reset styles
└── docs/             # Documentation
    ├── README.md
    └── CHANGELOG.md
```

### Advanced Project Structure

```
enterprise-miniprogram/
├── src/                    # Source code
│   ├── app/               # App core
│   │   ├── app.js
│   │   ├── app.json
│   │   └── app.wxss
│   ├── pages/             # Pages
│   │   ├── home/
│   │   ├── user/
│   │   └── business/
│   ├── components/        # Components
│   │   ├── ui/           # UI components
│   │   ├── business/     # Business components
│   │   └── layout/       # Layout components
│   ├── services/         # API services
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   └── base.service.js
│   ├── store/            # State management
│   │   ├── modules/
│   │   ├── index.js
│   │   └── types.js
│   ├── utils/            # Utilities
│   │   ├── helpers/
│   │   ├── validators/
│   │   └── formatters/
│   ├── config/           # Configuration
│   │   ├── env.js
│   │   ├── constants.js
│   │   └── routes.js
│   ├── assets/           # Assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── styles/
│   └── libs/             # Libraries
├── dist/                 # Build output
├── tests/                # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── tools/                # Build tools
│   ├── build.js
│   ├── dev.js
│   └── deploy.js
├── docs/                 # Documentation
├── .gitignore
├── package.json
├── webpack.config.js
└── README.md
```

## 📁 File Organization

### Page Organization

```javascript
// pages/user/profile/profile.js
Page({
  data: {
    userInfo: null,
    loading: false,
    error: null
  },
  
  onLoad(options) {
    this.loadUserProfile(options.userId)
  },
  
  async loadUserProfile(userId) {
    this.setData({ loading: true })
    
    try {
      const userInfo = await userService.getProfile(userId)
      this.setData({ userInfo, loading: false })
    } catch (error) {
      this.setData({ error: error.message, loading: false })
    }
  },
  
  onEditProfile() {
    wx.navigateTo({
      url: '/pages/user/edit-profile/edit-profile'
    })
  }
})
```

```json
// pages/user/profile/profile.json
{
  "navigationBarTitleText": "User Profile",
  "enablePullDownRefresh": true,
  "usingComponents": {
    "user-avatar": "/components/ui/user-avatar/user-avatar",
    "info-card": "/components/ui/info-card/info-card",
    "action-button": "/components/ui/action-button/action-button"
  }
}
```

```xml
<!-- pages/user/profile/profile.wxml -->
<view class="profile-container">
  <view wx:if="{{loading}}" class="loading">
    <text>Loading...</text>
  </view>
  
  <view wx:elif="{{error}}" class="error">
    <text>{{error}}</text>
  </view>
  
  <view wx:else class="profile-content">
    <user-avatar 
      src="{{userInfo.avatar}}" 
      size="large"
      class="profile-avatar"
    />
    
    <info-card 
      title="Personal Information"
      class="info-section"
    >
      <view class="info-item">
        <text class="label">Name:</text>
        <text class="value">{{userInfo.name}}</text>
      </view>
      <view class="info-item">
        <text class="label">Email:</text>
        <text class="value">{{userInfo.email}}</text>
      </view>
    </info-card>
    
    <action-button 
      text="Edit Profile"
      type="primary"
      bindtap="onEditProfile"
      class="edit-button"
    />
  </view>
</view>
```

```css
/* pages/user/profile/profile.wxss */
@import "/styles/variables.wxss";

.profile-container {
  padding: var(--spacing-lg);
  background-color: var(--bg-color-page);
  min-height: 100vh;
}

.loading,
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.profile-avatar {
  align-self: center;
  margin-bottom: var(--spacing-xl);
}

.info-section {
  margin-bottom: var(--spacing-lg);
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-md) 0;
  border-bottom: 1rpx solid var(--border-color-light);
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  color: var(--text-color-secondary);
  font-size: var(--font-size-sm);
}

.value {
  color: var(--text-color-primary);
  font-size: var(--font-size-base);
  font-weight: 500;
}

.edit-button {
  margin-top: var(--spacing-xl);
}
```

### Component Organization

```javascript
// components/ui/user-avatar/user-avatar.js
Component({
  options: {
    styleIsolation: 'isolated'
  },
  
  properties: {
    src: {
      type: String,
      value: ''
    },
    size: {
      type: String,
      value: 'medium' // small, medium, large
    },
    shape: {
      type: String,
      value: 'circle' // circle, square
    },
    placeholder: {
      type: String,
      value: '/assets/images/default-avatar.png'
    }
  },
  
  data: {
    imageLoaded: false,
    imageError: false
  },
  
  computed: {
    avatarClass() {
      return `avatar avatar--${this.data.size} avatar--${this.data.shape}`
    },
    
    displaySrc() {
      if (this.data.imageError) {
        return this.data.placeholder
      }
      return this.data.src || this.data.placeholder
    }
  },
  
  methods: {
    onImageLoad() {
      this.setData({ imageLoaded: true, imageError: false })
      this.triggerEvent('load')
    },
    
    onImageError() {
      this.setData({ imageError: true })
      this.triggerEvent('error')
    },
    
    onTap() {
      this.triggerEvent('tap', {
        src: this.data.src
      })
    }
  }
})
```

```json
// components/ui/user-avatar/user-avatar.json
{
  "component": true,
  "styleIsolation": "isolated"
}
```

```xml
<!-- components/ui/user-avatar/user-avatar.wxml -->
<view class="{{avatarClass}}" bindtap="onTap">
  <image 
    class="avatar-image"
    src="{{displaySrc}}"
    mode="aspectFill"
    bindload="onImageLoad"
    binderror="onImageError"
  />
  <view wx:if="{{!imageLoaded}}" class="avatar-loading">
    <text class="loading-text">...</text>
  </view>
</view>
```

```css
/* components/ui/user-avatar/user-avatar.wxss */
.avatar {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background-color: #f5f5f5;
}

.avatar--small {
  width: 60rpx;
  height: 60rpx;
}

.avatar--medium {
  width: 100rpx;
  height: 100rpx;
}

.avatar--large {
  width: 160rpx;
  height: 160rpx;
}

.avatar--circle {
  border-radius: 50%;
}

.avatar--square {
  border-radius: 8rpx;
}

.avatar-image {
  width: 100%;
  height: 100%;
}

.avatar-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.1);
}

.loading-text {
  color: #999;
  font-size: 24rpx;
}
```

## 📝 Naming Conventions

### File Naming

```javascript
// Good naming conventions
pages/
├── user-profile/          // kebab-case for directories
│   ├── user-profile.js    // match directory name
│   ├── user-profile.json
│   ├── user-profile.wxml
│   └── user-profile.wxss
├── product-list/
└── order-history/

components/
├── ui/
│   ├── loading-spinner/   // descriptive names
│   ├── modal-dialog/
│   └── image-picker/
└── business/
    ├── product-card/
    ├── user-info/
    └── order-item/

utils/
├── api-client.js          // kebab-case for files
├── date-formatter.js
├── validation-rules.js
└── storage-manager.js

// Avoid
pages/
├── UP/                    // unclear abbreviation
├── userProfile/           // camelCase for directories
└── User_Profile/          // snake_case mixing
```

### Variable Naming

```javascript
// Good variable naming
Page({
  data: {
    // Use camelCase for data properties
    userInfo: null,
    productList: [],
    isLoading: false,
    hasError: false,
    
    // Use descriptive names
    currentPageIndex: 0,
    totalPageCount: 0,
    searchKeyword: '',
    
    // Boolean variables with is/has/can prefix
    isUserLoggedIn: false,
    hasMoreData: true,
    canEditProfile: false
  },
  
  // Use descriptive method names
  async loadUserProfile() {},
  async refreshProductList() {},
  handleSearchInput() {},
  validateFormData() {},
  
  // Event handlers with 'on' prefix
  onUserTap() {},
  onFormSubmit() {},
  onPageScroll() {}
})

// Component naming
Component({
  properties: {
    // Use camelCase for properties
    itemData: Object,
    showBorder: Boolean,
    maxItemCount: Number
  },
  
  methods: {
    // Private methods with underscore prefix
    _validateData() {},
    _formatDisplayText() {},
    
    // Public methods without prefix
    updateData() {},
    refreshView() {}
  }
})
```

### CSS Class Naming

```css
/* BEM methodology */
.user-card {
  /* Block */
}

.user-card__avatar {
  /* Element */
}

.user-card__name {
  /* Element */
}

.user-card--featured {
  /* Modifier */
}

.user-card--large {
  /* Modifier */
}

/* Component-specific prefixes */
.c-button {
  /* Component */
}

.c-modal {
  /* Component */
}

.u-text-center {
  /* Utility */
}

.u-margin-large {
  /* Utility */
}

/* State classes */
.is-active {
  /* State */
}

.is-loading {
  /* State */
}

.has-error {
  /* State */
}
```

## ⚙️ Configuration Files

### App Configuration (app.json)

```json
{
  "pages": [
    "pages/home/home",
    "pages/user/profile/profile",
    "pages/user/settings/settings",
    "pages/product/list/list",
    "pages/product/detail/detail"
  ],
  "subPackages": [
    {
      "root": "packages/user",
      "name": "user",
      "pages": [
        "pages/login/login",
        "pages/register/register"
      ]
    },
    {
      "root": "packages/business",
      "name": "business",
      "pages": [
        "pages/dashboard/dashboard",
        "pages/analytics/analytics"
      ]
    }
  ],
  "preloadRule": {
    "pages/home/home": {
      "network": "all",
      "packages": ["user"]
    }
  },
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTitleText": "My App",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#f8f8f8",
    "enablePullDownRefresh": false
  },
  "tabBar": {
    "color": "#666666",
    "selectedColor": "#007aff",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/home/home",
        "text": "Home",
        "iconPath": "assets/icons/home.png",
        "selectedIconPath": "assets/icons/home-active.png"
      },
      {
        "pagePath": "pages/user/profile/profile",
        "text": "Profile",
        "iconPath": "assets/icons/profile.png",
        "selectedIconPath": "assets/icons/profile-active.png"
      }
    ]
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": false,
  "navigateToMiniProgramAppIdList": [
    "wx1234567890abcdef"
  ],
  "permission": {
    "scope.userLocation": {
      "desc": "Your location will be used to show nearby stores"
    }
  }
}
```

### Project Configuration (project.config.json)

```json
{
  "description": "My Mini Program Project",
  "packOptions": {
    "ignore": [
      {
        "type": "file",
        "value": ".eslintrc.js"
      },
      {
        "type": "folder",
        "value": "tests"
      }
    ]
  },
  "setting": {
    "urlCheck": true,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": true,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "bundle": false,
    "useIsolateContext": true,
    "useCompilerModule": true,
    "userConfirmedUseCompilerModuleSwitch": false
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "appid": "wx1234567890abcdef",
  "projectname": "my-miniprogram",
  "debugOptions": {
    "hidedInDevtools": []
  },
  "scripts": {},
  "isGameTourist": false,
  "simulatorType": "wechat",
  "simulatorPluginLibVersion": {},
  "condition": {
    "search": {
      "current": -1,
      "list": []
    },
    "conversation": {
      "current": -1,
      "list": []
    },
    "plugin": {
      "current": -1,
      "list": []
    },
    "game": {
      "current": -1,
      "list": []
    },
    "miniprogram": {
      "current": 0,
      "list": [
        {
          "id": 0,
          "name": "User Profile",
          "pathName": "pages/user/profile/profile",
          "query": "userId=123",
          "scene": null
        }
      ]
    }
  }
}
```

### Environment Configuration

```javascript
// config/env.js
const environments = {
  development: {
    apiBaseUrl: 'https://dev-api.example.com',
    debug: true,
    logLevel: 'debug',
    enableMock: true
  },
  
  staging: {
    apiBaseUrl: 'https://staging-api.example.com',
    debug: true,
    logLevel: 'info',
    enableMock: false
  },
  
  production: {
    apiBaseUrl: 'https://api.example.com',
    debug: false,
    logLevel: 'error',
    enableMock: false
  }
}

// Get current environment
const getCurrentEnv = () => {
  // You can determine environment based on various factors
  const accountInfo = wx.getAccountInfoSync()
  const envVersion = accountInfo.miniProgram.envVersion
  
  switch (envVersion) {
    case 'develop':
      return 'development'
    case 'trial':
      return 'staging'
    case 'release':
      return 'production'
    default:
      return 'development'
  }
}

const currentEnv = getCurrentEnv()
const config = environments[currentEnv]

export default config
export { currentEnv, environments }
```

## 🛠️ Utils and Libraries

### API Service Layer

```javascript
// services/base.service.js
import config from '../config/env'

class BaseService {
  constructor() {
    this.baseURL = config.apiBaseUrl
    this.timeout = 10000
    this.interceptors = {
      request: [],
      response: []
    }
  }
  
  // Add request interceptor
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor)
  }
  
  // Add response interceptor
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor)
  }
  
  // Make HTTP request
  async request(options) {
    // Apply request interceptors
    let requestOptions = { ...options }
    for (const interceptor of this.interceptors.request) {
      requestOptions = await interceptor(requestOptions)
    }
    
    // Make request
    const response = await this._makeRequest(requestOptions)
    
    // Apply response interceptors
    let finalResponse = response
    for (const interceptor of this.interceptors.response) {
      finalResponse = await interceptor(finalResponse)
    }
    
    return finalResponse
  }
  
  _makeRequest(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseURL}${options.url}`,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        timeout: options.timeout || this.timeout,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data)
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${res.data?.message || 'Request failed'}`))
          }
        },
        fail: reject
      })
    })
  }
  
  // Convenience methods
  get(url, params, options = {}) {
    return this.request({
      url,
      method: 'GET',
      data: params,
      ...options
    })
  }
  
  post(url, data, options = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...options
    })
  }
  
  put(url, data, options = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }
  
  delete(url, options = {}) {
    return this.request({
      url,
      method: 'DELETE',
      ...options
    })
  }
}

export default BaseService
```

```javascript
// services/user.service.js
import BaseService from './base.service'

class UserService extends BaseService {
  constructor() {
    super()
    
    // Add authentication interceptor
    this.addRequestInterceptor(this.addAuthHeader.bind(this))
    this.addResponseInterceptor(this.handleAuthError.bind(this))
  }
  
  async addAuthHeader(options) {
    const token = wx.getStorageSync('authToken')
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    }
    return options
  }
  
  async handleAuthError(response) {
    if (response.code === 401) {
      // Handle authentication error
      wx.removeStorageSync('authToken')
      wx.navigateTo({
        url: '/pages/auth/login/login'
      })
      throw new Error('Authentication required')
    }
    return response
  }
  
  // User API methods
  async getProfile(userId) {
    return this.get(`/users/${userId}`)
  }
  
  async updateProfile(userId, profileData) {
    return this.put(`/users/${userId}`, profileData)
  }
  
  async login(credentials) {
    const response = await this.post('/auth/login', credentials)
    
    if (response.token) {
      wx.setStorageSync('authToken', response.token)
      wx.setStorageSync('userInfo', response.user)
    }
    
    return response
  }
  
  async logout() {
    await this.post('/auth/logout')
    wx.removeStorageSync('authToken')
    wx.removeStorageSync('userInfo')
  }
  
  async refreshToken() {
    const refreshToken = wx.getStorageSync('refreshToken')
    const response = await this.post('/auth/refresh', { refreshToken })
    
    wx.setStorageSync('authToken', response.token)
    return response
  }
}

export default new UserService()
```

### Utility Functions

```javascript
// utils/format.js
export const formatDate = (date, format = 'YYYY-MM-DD') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

export const formatCurrency = (amount, currency = 'CNY') => {
  const formatter = new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency
  })
  return formatter.format(amount)
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const truncateText = (text, maxLength, suffix = '...') => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}
```

```javascript
// utils/validation.js
export const validators = {
  required: (value) => {
    return value !== null && value !== undefined && value !== ''
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },
  
  phone: (value) => {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(value)
  },
  
  minLength: (min) => (value) => {
    return value && value.length >= min
  },
  
  maxLength: (max) => (value) => {
    return !value || value.length <= max
  },
  
  pattern: (regex) => (value) => {
    return regex.test(value)
  }
}

export const validateForm = (data, rules) => {
  const errors = {}
  
  for (const field in rules) {
    const fieldRules = rules[field]
    const value = data[field]
    
    for (const rule of fieldRules) {
      if (typeof rule === 'function') {
        if (!rule(value)) {
          errors[field] = errors[field] || []
          errors[field].push('Validation failed')
        }
      } else if (typeof rule === 'object') {
        if (!rule.validator(value)) {
          errors[field] = errors[field] || []
          errors[field].push(rule.message)
        }
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
```

## 🎨 Asset Management

### Image Organization

```
assets/
├── images/
│   ├── common/              # Common images
│   │   ├── logo.png
│   │   ├── placeholder.png
│   │   └── error.png
│   ├── icons/               # Icon images
│   │   ├── home.png
│   │   ├── user.png
│   │   └── settings.png
│   ├── backgrounds/         # Background images
│   │   ├── hero-bg.jpg
│   │   └── pattern-bg.png
│   └── products/           # Product images
│       ├── product-1.jpg
│       └── product-2.jpg
├── fonts/                  # Custom fonts
│   ├── custom-font.ttf
│   └── icon-font.woff
└── data/                   # Static data files
    ├── cities.json
    └── categories.json
```

### Style Organization

```css
/* styles/variables.wxss */
:root {
  /* Colors */
  --primary-color: #007aff;
  --secondary-color: #5856d6;
  --success-color: #34c759;
  --warning-color: #ff9500;
  --error-color: #ff3b30;
  
  --text-color-primary: #000000;
  --text-color-secondary: #666666;
  --text-color-tertiary: #999999;
  
  --bg-color-primary: #ffffff;
  --bg-color-secondary: #f8f8f8;
  --bg-color-tertiary: #f0f0f0;
  
  --border-color-light: #e0e0e0;
  --border-color-medium: #cccccc;
  --border-color-dark: #999999;
  
  /* Spacing */
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
  --spacing-xl: 48rpx;
  --spacing-xxl: 64rpx;
  
  /* Typography */
  --font-size-xs: 20rpx;
  --font-size-sm: 24rpx;
  --font-size-base: 28rpx;
  --font-size-lg: 32rpx;
  --font-size-xl: 36rpx;
  --font-size-xxl: 48rpx;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-loose: 1.8;
  
  /* Border radius */
  --border-radius-sm: 4rpx;
  --border-radius-md: 8rpx;
  --border-radius-lg: 16rpx;
  --border-radius-xl: 24rpx;
  
  /* Shadows */
  --shadow-sm: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  
  /* Z-index */
  --z-index-dropdown: 1000;
  --z-index-modal: 1050;
  --z-index-toast: 1100;
}
```

```css
/* styles/mixins.wxss */
/* Flexbox mixins */
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

/* Text mixins */
.text-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.text-center {
  text-align: center;
}

/* Button mixins */
.btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
}

.btn-secondary {
  background-color: var(--bg-color-tertiary);
  color: var(--text-color-primary);
}
```

## 🎯 Best Practices

### Project Organization Best Practices

1. **Consistent Structure**
   - Follow established naming conventions
   - Maintain consistent file organization
   - Use clear directory hierarchies

2. **Modular Design**
   - Create reusable components
   - Separate concerns properly
   - Use service layers for API calls

3. **Configuration Management**
   - Use environment-specific configs
   - Keep sensitive data secure
   - Document configuration options

4. **Asset Optimization**
   - Optimize images for different screen densities
   - Use appropriate file formats
   - Implement lazy loading for assets

5. **Code Organization**
   - Group related functionality
   - Use meaningful file and folder names
   - Maintain clean import/export structure

### Scalability Considerations

```javascript
// Feature-based organization for large projects
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── utils/
│   ├── user/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── store/
│   └── product/
│       ├── components/
│       ├── pages/
│       ├── services/
│       └── store/
├── shared/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── constants/
└── core/
    ├── app/
    ├── config/
    └── types/
```

### Documentation Structure

```markdown
docs/
├── README.md                 # Project overview
├── CONTRIBUTING.md          # Contribution guidelines
├── CHANGELOG.md             # Version history
├── api/                     # API documentation
│   ├── user.md
│   └── product.md
├── components/              # Component documentation
│   ├── ui-components.md
│   └── business-components.md
├── deployment/              # Deployment guides
│   ├── development.md
│   ├── staging.md
│   └── production.md
└── architecture/            # Architecture documentation
    ├── overview.md
    ├── data-flow.md
    └── security.md
```

### Testing Structure

```javascript
tests/
├── unit/                    # Unit tests
│   ├── components/
│   ├── services/
│   └── utils/
├── integration/             # Integration tests
│   ├── api/
│   └── pages/
├── e2e/                     # End-to-end tests
│   ├── user-flows/
│   └── critical-paths/
├── fixtures/                # Test data
│   ├── users.json
│   └── products.json
└── helpers/                 # Test utilities
    ├── mock-api.js
    └── test-utils.js
```

---

A well-organized project structure is the foundation of maintainable and scalable mini program development. Follow these guidelines to create a structure that supports your team's productivity and code quality.
