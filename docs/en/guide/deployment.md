# Deployment

This guide covers the essential steps for deploying mini programs to production, from preparation to publishing.

## Pre-Deployment Checklist

### Code Quality & Testing

```bash
# Run quality checks
npm run lint
npm test
npm run build

# Check bundle size
npm run analyze
```

### Performance Optimization

```javascript
// Optimize assets
// - Compress images (use WebP/AVIF)
// - Minimize JavaScript bundles
// - Remove unused dependencies
// - Implement lazy loading

// Example: Image optimization
const optimizedImages = {
  avatar: 'images/avatar.webp', // Use WebP for better compression
  banner: 'images/banner@2x.jpg' // Provide high-DPI versions
}
```

### Environment Configuration

```javascript
// config/index.js
const config = {
  development: {
    apiUrl: 'https://dev-api.example.com',
    debug: true,
    logging: true
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
    logging: false
  }
}

export default config[process.env.NODE_ENV || 'development']
```

## WeChat Mini Program

### 1. Project Configuration

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"
  ],
  "window": {
    "navigationBarTitleText": "Your App",
    "navigationBarBackgroundColor": "#ffffff",
    "backgroundColor": "#ffffff"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home_active.png",
        "text": "Home"
      }
    ]
  },
  "networkTimeout": {
    "request": 10000
  },
  "debug": false
}
```

### 2. Upload Process

```bash
# Using WeChat Developer Tools
# 1. Open project in WeChat DevTools
# 2. Click "Upload" button
# 3. Enter version and description
# 4. Confirm upload

# Using CLI (miniprogram-ci)
npm install -g miniprogram-ci

# Upload command
miniprogram-ci upload \
  --pp ./dist \
  --pkp ./private.key \
  --appid your-app-id \
  --uv 1.0.0 \
  --ud "Version description"
```

### 3. Review Submission

```javascript
// WeChat Mini Program Console (mp.weixin.qq.com)
// 1. Go to Development > Development Management
// 2. Click "Submit for Review"
// 3. Fill required information:
//    - Version description
//    - Test account (if needed)
//    - Category selection
//    - Screenshots
```

## Alipay Mini Program

### Configuration

```json
// app.json
{
  "pages": [
    "pages/index/index"
  ],
  "window": {
    "defaultTitle": "Your App",
    "titleBarColor": "#ffffff"
  },
  "tabBar": {
    "textColor": "#dddddd",
    "selectedColor": "#49a9ee",
    "items": [
      {
        "pagePath": "pages/index/index",
        "name": "Home"
      }
    ]
  }
}
```

### Upload Process

```bash
# Using Alipay Mini Program Studio
# 1. Open project in Alipay DevTools
# 2. Click "Upload" button
# 3. Enter version information
# 4. Submit for review
```

## Multi-Platform Deployment

### Using Taro

```bash
# Build for different platforms
npm run build:weapp    # WeChat
npm run build:alipay   # Alipay
npm run build:swan     # Baidu
npm run build:tt       # ByteDance
```

```javascript
// config/index.js
const config = {
  projectName: 'your-app',
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
```

### Using uni-app

```bash
# Build commands
npm run build:mp-weixin    # WeChat
npm run build:mp-alipay    # Alipay
npm run build:mp-baidu     # Baidu
```

## Automated Deployment

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Mini Program

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install and build
      run: |
        npm ci
        npm test
        npm run build
    
    - name: Deploy to WeChat
      run: |
        npm install -g miniprogram-ci
        miniprogram-ci upload \
          --pp ./dist \
          --pkp ./private.key \
          --appid ${{ secrets.WECHAT_APPID }} \
          --uv 1.0.${{ github.run_number }}
```

### Deployment Script

```javascript
// scripts/deploy.js
const ci = require('miniprogram-ci')
const path = require('path')

const project = new ci.Project({
  appid: process.env.WECHAT_APPID,
  type: 'miniProgram',
  projectPath: path.resolve(__dirname, '../dist'),
  privateKeyPath: path.resolve(__dirname, '../private.key')
})

async function deploy() {
  try {
    const result = await ci.upload({
      project,
      version: process.env.VERSION || '1.0.0',
      desc: process.env.DESC || 'Automated deployment',
      setting: {
        es6: true,
        minify: true,
        codeProtect: true
      }
    })
    console.log('Deployment successful:', result)
  } catch (error) {
    console.error('Deployment failed:', error)
    process.exit(1)
  }
}

deploy()
```

## Version Management

### Semantic Versioning

```javascript
// package.json
{
  "version": "1.0.0", // MAJOR.MINOR.PATCH
  "scripts": {
    "version:patch": "npm version patch",
    "version:minor": "npm version minor",
    "version:major": "npm version major"
  }
}

// Version info in app
export const VERSION_INFO = {
  version: '1.0.0',
  buildTime: new Date().toISOString(),
  environment: process.env.NODE_ENV
}
```

### Environment Management

```javascript
// config/env.js
const environments = {
  development: {
    apiUrl: 'https://dev-api.example.com',
    debug: true
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false
  }
}

export default environments[process.env.NODE_ENV || 'development']
```

## Monitoring & Analytics

### Error Tracking

```javascript
// utils/errorTracker.js
class ErrorTracker {
  static init() {
    wx.onError((error) => {
      this.logError('Global Error', error)
    })
  }
  
  static logError(type, error) {
    const errorInfo = {
      type,
      message: error.message || error,
      timestamp: new Date().toISOString(),
      version: VERSION_INFO.version
    }
    
    // Send to analytics service
    wx.request({
      url: 'https://api.example.com/errors',
      method: 'POST',
      data: errorInfo
    })
  }
}

ErrorTracker.init()
```

### Performance Monitoring

```javascript
// utils/performance.js
class PerformanceMonitor {
  static trackPageLoad(pageName) {
    const startTime = Date.now()
    
    return {
      end: () => {
        const loadTime = Date.now() - startTime
        this.sendMetric('page_load', {
          page: pageName,
          loadTime
        })
      }
    }
  }
  
  static sendMetric(type, data) {
    wx.request({
      url: 'https://api.example.com/metrics',
      method: 'POST',
      data: { type, ...data }
    })
  }
}

// Usage
Page({
  onLoad() {
    const tracker = PerformanceMonitor.trackPageLoad('index')
    // Page load logic
    tracker.end()
  }
})
```

## Best Practices

### Deployment Checklist

- [ ] Code quality checks passed
- [ ] All tests passing
- [ ] Performance optimized
- [ ] Environment configs verified
- [ ] Version numbers updated
- [ ] Error tracking enabled
- [ ] Rollback plan ready

### Security Considerations

```javascript
// Enable code protection
const uploadSettings = {
  es6: true,
  minify: true,
  codeProtect: true, // Protect source code
  minifyJS: true
}

// API security
function secureRequest(url, data) {
  const timestamp = Date.now()
  const signature = generateSignature(data, timestamp)
  
  return wx.request({
    url,
    method: 'POST',
    data,
    header: {
      'X-Timestamp': timestamp,
      'X-Signature': signature
    }
  })
}
```

### Rollback Strategy

```javascript
// Feature flags for safe rollbacks
class FeatureFlags {
  static isEnabled(flagName) {
    const flags = wx.getStorageSync('featureFlags') || {}
    return flags[flagName] || false
  }
}

// Conditional feature rendering
if (FeatureFlags.isEnabled('newFeature')) {
  // Show new feature
} else {
  // Show stable version
}
```

## Troubleshooting

### Common Issues

1. **Upload Failed**: Check network, AppID, and private key
2. **Review Rejected**: Ensure compliance with platform guidelines
3. **Performance Issues**: Optimize images and reduce bundle size
4. **API Errors**: Verify domain whitelist and HTTPS usage

### Debug Tools

```javascript
// Debug mode configuration
if (process.env.NODE_ENV === 'development') {
  wx.setEnableDebug({
    enableDebug: true
  })
}

// Console logging
console.log('Debug info:', {
  version: VERSION_INFO.version,
  environment: process.env.NODE_ENV,
  timestamp: new Date().toISOString()
})
```

For detailed security practices, see our [Security Guide](./security.md). For monitoring strategies, check our [Monitoring Guide](./monitoring.md). For maintenance procedures, refer to our [Maintenance Guide](./maintenance.md).