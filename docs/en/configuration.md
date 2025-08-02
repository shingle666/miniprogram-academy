# Configuration

This guide covers the configuration system in mini-program development, including app configuration, page configuration, component configuration, and platform-specific settings.

## 📋 Table of Contents

- [App Configuration](#app-configuration)
- [Page Configuration](#page-configuration)
- [Component Configuration](#component-configuration)
- [Project Configuration](#project-configuration)
- [Platform-Specific Config](#platform-specific-config)
- [Environment Configuration](#environment-configuration)
- [Build Configuration](#build-configuration)
- [Best Practices](#best-practices)

## 📱 App Configuration

### app.json Structure
```json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile",
    "pages/settings/settings"
  ],
  "subPackages": [
    {
      "root": "modules/shop",
      "pages": [
        "pages/list/list",
        "pages/detail/detail"
      ]
    }
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTitleText": "Mini Program",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#f8f8f8",
    "enablePullDownRefresh": false
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/icon_home.png",
        "selectedIconPath": "images/icon_home_HL.png",
        "text": "Home"
      },
      {
        "pagePath": "pages/profile/profile",
        "iconPath": "images/icon_profile.png",
        "selectedIconPath": "images/icon_profile_HL.png",
        "text": "Profile"
      }
    ]
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": false,
  "permission": {
    "scope.userLocation": {
      "desc": "Your location will be used for nearby services"
    }
  }
}
```

### Global Window Configuration
```json
{
  "window": {
    "navigationBarBackgroundColor": "#000000",
    "navigationBarTextStyle": "white",
    "navigationBarTitleText": "My App",
    "backgroundColor": "#ffffff",
    "backgroundTextStyle": "dark",
    "enablePullDownRefresh": true,
    "onReachBottomDistance": 50,
    "backgroundColorTop": "#ffffff",
    "backgroundColorBottom": "#ffffff",
    "navigationStyle": "default"
  }
}
```

### Tab Bar Configuration
```json
{
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#007aff",
    "backgroundColor": "#ffffff",
    "borderStyle": "white",
    "position": "bottom",
    "custom": false,
    "list": [
      {
        "pagePath": "pages/home/home",
        "text": "Home",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home-active.png"
      },
      {
        "pagePath": "pages/discover/discover",
        "text": "Discover",
        "iconPath": "images/discover.png",
        "selectedIconPath": "images/discover-active.png"
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

## 📄 Page Configuration

### Basic Page Configuration
```json
{
  "navigationBarTitleText": "Page Title",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "backgroundColor": "#ffffff",
  "backgroundTextStyle": "dark",
  "enablePullDownRefresh": true,
  "onReachBottomDistance": 50,
  "backgroundColorTop": "#ffffff",
  "backgroundColorBottom": "#ffffff"
}
```

### Advanced Page Configuration
```json
{
  "navigationBarTitleText": "Product Detail",
  "navigationStyle": "custom",
  "disableScroll": false,
  "usingComponents": {
    "product-card": "/components/product-card/product-card",
    "review-list": "/components/review-list/review-list"
  },
  "renderer": "webview",
  "componentFramework": "glass-easel"
}
```

### Dynamic Page Configuration
```javascript
// In page JS file
Page({
  onLoad() {
    // Dynamic title
    wx.setNavigationBarTitle({
      title: 'Dynamic Title'
    })
    
    // Dynamic navigation bar color
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#007aff'
    })
  }
})
```

## 🧩 Component Configuration

### Component Registration
```json
{
  "component": true,
  "usingComponents": {
    "child-component": "./child-component/child-component",
    "external-component": "plugin://myPlugin/component"
  },
  "componentGenerics": {
    "selectable": true
  }
}
```

### Component Options
```javascript
Component({
  options: {
    // Multiple slot support
    multipleSlots: true,
    
    // Style isolation
    styleIsolation: 'isolated',
    
    // Pure data pattern
    pureDataPattern: /^_/,
    
    // Data path optimization
    dataPathsOptimization: true,
    
    // Virtual host
    virtualHost: true
  }
})
```

## ⚙️ Project Configuration

### project.config.json
```json
{
  "description": "Mini Program Project",
  "packOptions": {
    "ignore": [
      {
        "type": "file",
        "value": ".eslintrc.js"
      },
      {
        "type": "folder",
        "value": "docs"
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
    }
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "appid": "your-app-id",
  "projectname": "mini-program-project",
  "debugOptions": {
    "hidedInDevtools": []
  },
  "scripts": {},
  "isGameTourist": false,
  "condition": {
    "search": {
      "current": -1,
      "list": []
    },
    "conversation": {
      "current": -1,
      "list": []
    },
    "game": {
      "current": -1,
      "list": []
    },
    "plugin": {
      "current": -1,
      "list": []
    },
    "gamePlugin": {
      "current": -1,
      "list": []
    },
    "miniprogram": {
      "current": -1,
      "list": []
    }
  }
}
```

### sitemap.json
```json
{
  "desc": "Site map configuration",
  "rules": [
    {
      "action": "allow",
      "page": "*"
    },
    {
      "action": "disallow",
      "page": "pages/admin/*"
    },
    {
      "action": "allow",
      "page": "pages/public/*",
      "matching": "prefix"
    }
  ]
}
```

## 🔧 Platform-Specific Config

### WeChat Mini Program
```json
{
  "cloud": true,
  "plugins": {
    "myPlugin": {
      "version": "1.0.0",
      "provider": "plugin-provider-id"
    }
  },
  "resizable": true,
  "navigateToMiniProgramAppIdList": [
    "another-mini-program-app-id"
  ],
  "permission": {
    "scope.userLocation": {
      "desc": "Location access for nearby services"
    },
    "scope.camera": {
      "desc": "Camera access for photo capture"
    }
  },
  "requiredBackgroundModes": ["audio", "location"],
  "workers": "workers",
  "functionalPages": true
}
```

### Alipay Mini Program
```json
{
  "window": {
    "defaultTitle": "Alipay Mini Program",
    "titleBarColor": "#ffffff",
    "backgroundColor": "#f5f5f5",
    "pullRefresh": true,
    "allowsBounceVertical": "YES"
  },
  "tabBar": {
    "textColor": "#dddddd",
    "selectedColor": "#49a9ee",
    "backgroundColor": "#ffffff",
    "items": [
      {
        "pagePath": "pages/index/index",
        "name": "Home",
        "icon": "images/home.png",
        "activeIcon": "images/home_active.png"
      }
    ]
  }
}
```

### Baidu Smart Program
```json
{
  "pages": ["pages/index/index"],
  "window": {
    "navigationBarTitleText": "Baidu Smart Program",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#ffffff",
    "backgroundTextStyle": "light",
    "enablePullDownRefresh": false
  },
  "networkTimeout": {
    "request": 30000,
    "downloadFile": 30000
  },
  "permission": {
    "scope.userLocation": {
      "desc": "Get location for nearby services"
    }
  }
}
```

## 🌍 Environment Configuration

### Multi-Environment Setup
```javascript
// config/index.js
const configs = {
  development: {
    apiBaseUrl: 'https://dev-api.example.com',
    debug: true,
    logLevel: 'debug'
  },
  staging: {
    apiBaseUrl: 'https://staging-api.example.com',
    debug: false,
    logLevel: 'info'
  },
  production: {
    apiBaseUrl: 'https://api.example.com',
    debug: false,
    logLevel: 'error'
  }
}

const env = process.env.NODE_ENV || 'development'
export default configs[env]
```

### Environment-Specific app.json
```javascript
// scripts/build-config.js
const fs = require('fs')
const path = require('path')

const env = process.env.NODE_ENV || 'development'
const configPath = path.join(__dirname, `../config/app.${env}.json`)
const targetPath = path.join(__dirname, '../app.json')

if (fs.existsSync(configPath)) {
  const config = fs.readFileSync(configPath, 'utf8')
  fs.writeFileSync(targetPath, config)
  console.log(`Applied ${env} configuration`)
}
```

## 🏗️ Build Configuration

### Webpack Configuration
```javascript
// webpack.config.js
const path = require('path')

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.wxss$/,
        use: ['css-loader', 'postcss-loader']
      }
    ]
  },
  plugins: [
    // Custom plugins for mini-program build
  ]
}
```

### PostCSS Configuration
```javascript
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'),
    require('postcss-pxtorem')({
      rootValue: 16,
      propList: ['*'],
      selectorBlackList: ['.ignore']
    })
  ]
}
```

### ESLint Configuration
```json
{
  "env": {
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "globals": {
    "wx": "readonly",
    "my": "readonly",
    "swan": "readonly",
    "tt": "readonly",
    "App": "readonly",
    "Page": "readonly",
    "Component": "readonly",
    "getApp": "readonly",
    "getCurrentPages": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error"
  }
}
```

## 🎯 Best Practices

### Configuration Management
```javascript
// utils/config.js
class ConfigManager {
  constructor() {
    this.config = {}
    this.loadConfig()
  }
  
  loadConfig() {
    try {
      // Load from local storage or default
      const savedConfig = wx.getStorageSync('app_config')
      this.config = {
        ...this.getDefaultConfig(),
        ...savedConfig
      }
    } catch (error) {
      console.error('Failed to load config:', error)
      this.config = this.getDefaultConfig()
    }
  }
  
  getDefaultConfig() {
    return {
      theme: 'light',
      language: 'en',
      notifications: true,
      autoUpdate: true
    }
  }
  
  get(key, defaultValue = null) {
    return this.config[key] ?? defaultValue
  }
  
  set(key, value) {
    this.config[key] = value
    this.saveConfig()
  }
  
  saveConfig() {
    try {
      wx.setStorageSync('app_config', this.config)
    } catch (error) {
      console.error('Failed to save config:', error)
    }
  }
}

export default new ConfigManager()
```

### Dynamic Configuration Loading
```javascript
// utils/remote-config.js
class RemoteConfig {
  constructor() {
    this.config = {}
    this.lastUpdate = 0
    this.updateInterval = 5 * 60 * 1000 // 5 minutes
  }
  
  async loadRemoteConfig() {
    try {
      const now = Date.now()
      if (now - this.lastUpdate < this.updateInterval) {
        return this.config
      }
      
      const response = await wx.request({
        url: 'https://api.example.com/config',
        method: 'GET'
      })
      
      if (response.statusCode === 200) {
        this.config = response.data
        this.lastUpdate = now
        
        // Cache locally
        wx.setStorageSync('remote_config', {
          config: this.config,
          timestamp: now
        })
      }
      
      return this.config
    } catch (error) {
      console.error('Failed to load remote config:', error)
      
      // Fallback to cached config
      const cached = wx.getStorageSync('remote_config')
      if (cached && cached.config) {
        this.config = cached.config
      }
      
      return this.config
    }
  }
  
  get(key, defaultValue = null) {
    return this.config[key] ?? defaultValue
  }
}

export default new RemoteConfig()
```

### Configuration Validation
```javascript
// utils/config-validator.js
const configSchema = {
  apiBaseUrl: {
    type: 'string',
    required: true,
    pattern: /^https?:\/\/.+/
  },
  timeout: {
    type: 'number',
    min: 1000,
    max: 30000,
    default: 10000
  },
  debug: {
    type: 'boolean',
    default: false
  }
}

function validateConfig(config) {
  const errors = []
  const validated = {}
  
  for (const [key, schema] of Object.entries(configSchema)) {
    const value = config[key]
    
    // Check required fields
    if (schema.required && (value === undefined || value === null)) {
      errors.push(`${key} is required`)
      continue
    }
    
    // Use default if not provided
    if (value === undefined && schema.default !== undefined) {
      validated[key] = schema.default
      continue
    }
    
    // Type validation
    if (value !== undefined && typeof value !== schema.type) {
      errors.push(`${key} must be of type ${schema.type}`)
      continue
    }
    
    // Pattern validation
    if (schema.pattern && !schema.pattern.test(value)) {
      errors.push(`${key} does not match required pattern`)
      continue
    }
    
    // Range validation
    if (schema.type === 'number') {
      if (schema.min !== undefined && value < schema.min) {
        errors.push(`${key} must be at least ${schema.min}`)
        continue
      }
      if (schema.max !== undefined && value > schema.max) {
        errors.push(`${key} must be at most ${schema.max}`)
        continue
      }
    }
    
    validated[key] = value
  }
  
  return { validated, errors }
}

export { validateConfig }
```

---

Proper configuration management is crucial for maintainable and scalable mini-programs. It enables environment-specific settings, feature flags, and dynamic behavior while keeping the codebase clean and organized.