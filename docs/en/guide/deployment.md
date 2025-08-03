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
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": false
}
```

### 2. Upload Code

1. **Open WeChat Developer Tools**
2. **Click "Upload"** in the toolbar
3. **Fill in version information**:
   - Version number (e.g., 1.0.0)
   - Version description
4. **Click "Upload"**

### 3. Submit for Review

1. **Login to WeChat Mini Program Admin Panel**
2. **Go to "Development" → "Version Management"**
3. **Click "Submit for Review"** on your uploaded version
4. **Fill in review information**:
   - Category selection
   - Feature description
   - Test account (if needed)
   - Screenshots

### 4. Release

After approval:
1. **Go to "Version Management"**
2. **Click "Release"** on the approved version
3. **Confirm release**

## Alipay Mini Program Deployment

### 1. Build for Production

```bash
# If using a framework
npm run build:alipay

# Or build manually
my build
```

### 2. Upload via IDE

1. **Open Alipay Mini Program Studio**
2. **Click "Upload"**
3. **Enter version information**
4. **Upload code**

### 3. Submit for Review

1. **Login to Alipay Open Platform**
2. **Go to your mini program**
3. **Click "Version Management"**
4. **Submit for review**

## Multi-Platform Deployment

### Using Taro Framework

```bash
# Build for different platforms
npm run build:weapp    # WeChat
npm run build:alipay   # Alipay
npm run build:swan     # Baidu
npm run build:tt       # ByteDance
npm run build:qq       # QQ
```

### Using uni-app Framework

```bash
# Build for different platforms
npm run build:mp-weixin   # WeChat
npm run build:mp-alipay   # Alipay
npm run build:mp-baidu    # Baidu
npm run build:mp-toutiao  # ByteDance
npm run build:mp-qq       # QQ
```

## Automated Deployment

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy Mini Program

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build for production
      run: npm run build:prod
    
    - name: Upload to WeChat
      run: |
        npm install -g miniprogram-ci
        miniprogram-ci upload \
          --pp ./dist \
          --pkp ./private.key \
          --appid ${{ secrets.WECHAT_APPID }} \
          --uv ${{ github.ref_name }} \
          --ud "Automated deployment from ${{ github.ref_name }}"
      env:
        WECHAT_APPID: ${{ secrets.WECHAT_APPID }}
```

### Deployment Script

```javascript
// scripts/deploy.js
const ci = require('miniprogram-ci')
const path = require('path')

async function deploy() {
  const project = new ci.Project({
    appid: process.env.WECHAT_APPID,
    type: 'miniProgram',
    projectPath: path.resolve(__dirname, '../dist'),
    privateKeyPath: path.resolve(__dirname, '../private.key'),
    ignores: ['node_modules/**/*']
  })

  try {
    const uploadResult = await ci.upload({
      project,
      version: process.env.VERSION || '1.0.0',
      desc: process.env.DESC || 'Automated upload',
      setting: {
        es6: true,
        es7: true,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        autoPrefixWXSS: true
      },
      onProgressUpdate: console.log
    })
    
    console.log('Upload successful:', uploadResult)
  } catch (error) {
    console.error('Upload failed:', error)
    process.exit(1)
  }
}

deploy()
```

## Environment Management

### Environment Configuration

```javascript
// utils/config.js
const configs = {
  development: {
    apiBaseUrl: 'https://dev-api.example.com',
    enableLogging: true,
    enableDebug: true
  },
  staging: {
    apiBaseUrl: 'https://staging-api.example.com',
    enableLogging: true,
    enableDebug: false
  },
  production: {
    apiBaseUrl: 'https://api.example.com',
    enableLogging: false,
    enableDebug: false
  }
}

const env = process.env.NODE_ENV || 'development'
export default configs[env]
```

### Build Scripts

```json
{
  "scripts": {
    "dev": "NODE_ENV=development npm run build:watch",
    "build:staging": "NODE_ENV=staging npm run build",
    "build:prod": "NODE_ENV=production npm run build",
    "deploy:staging": "npm run build:staging && npm run upload:staging",
    "deploy:prod": "npm run build:prod && npm run upload:prod"
  }
}
```

## Version Management

### Semantic Versioning

```bash
# Patch version (bug fixes)
npm version patch

# Minor version (new features)
npm version minor

# Major version (breaking changes)
npm version major
```

### Release Notes

```markdown
# Release Notes

## v1.2.0 (2024-01-15)

### New Features
- Added user profile management
- Implemented dark mode support
- Added offline data synchronization

### Bug Fixes
- Fixed login issue on iOS devices
- Resolved image loading problems
- Fixed navigation bar styling

### Performance Improvements
- Reduced app startup time by 30%
- Optimized image loading
- Improved memory usage

### Breaking Changes
- Updated API endpoints
- Changed data storage format
```

## Monitoring and Analytics

### Error Tracking

```javascript
// utils/errorTracker.js
class ErrorTracker {
  static init() {
    // Global error handler
    wx.onError((error) => {
      this.logError('Global Error', error)
    })
    
    // Unhandled promise rejection
    wx.onUnhandledRejection((error) => {
      this.logError('Unhandled Rejection', error)
    })
  }
  
  static logError(type, error) {
    const errorInfo = {
      type,
      message: error.message || error,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: wx.getSystemInfoSync(),
      version: getApp().globalData.version
    }
    
    // Send to error tracking service
    wx.request({
      url: 'https://api.example.com/errors',
      method: 'POST',
      data: errorInfo
    })
  }
}

// Initialize in app.js
App({
  onLaunch() {
    ErrorTracker.init()
  }
})
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
        this.sendMetric('page_load_time', loadTime, { page: pageName })
      }
    }
  }
  
  static trackApiCall(apiName) {
    const startTime = Date.now()
    
    return {
      success: () => {
        const duration = Date.now() - startTime
        this.sendMetric('api_call_success', duration, { api: apiName })
      },
      error: (error) => {
        const duration = Date.now() - startTime
        this.sendMetric('api_call_error', duration, { 
          api: apiName, 
          error: error.message 
        })
      }
    }
  }
  
  static sendMetric(name, value, tags = {}) {
    wx.request({
      url: 'https://api.example.com/metrics',
      method: 'POST',
      data: {
        name,
        value,
        tags,
        timestamp: Date.now()
      }
    })
  }
}

// Usage in pages
Page({
  onLoad() {
    const tracker = PerformanceMonitor.trackPageLoad('home')
    
    // Your page loading logic
    this.loadData().then(() => {
      tracker.end()
    })
  }
})
```

## Rollback Strategy

### Quick Rollback

```javascript
// scripts/rollback.js
const ci = require('miniprogram-ci')

async function rollback(version) {
  try {
    // Get previous version from version control
    const previousVersion = await getPreviousVersion(version)
    
    // Build previous version
    await buildVersion(previousVersion)
    
    // Upload previous version
    const project = new ci.Project({
      appid: process.env.WECHAT_APPID,
      type: 'miniProgram',
      projectPath: './dist',
      privateKeyPath: './private.key'
    })
    
    await ci.upload({
      project,
      version: `${previousVersion}-rollback`,
      desc: `Rollback to version ${previousVersion}`
    })
    
    console.log(`Rollback to version ${previousVersion} successful`)
  } catch (error) {
    console.error('Rollback failed:', error)
  }
}

// Usage: node scripts/rollback.js 1.1.0
rollback(process.argv[2])
```

### Feature Flags

```javascript
// utils/featureFlags.js
class FeatureFlags {
  constructor() {
    this.flags = {}
    this.loadFlags()
  }
  
  async loadFlags() {
    try {
      const response = await wx.request({
        url: 'https://api.example.com/feature-flags'
      })
      this.flags = response.data
    } catch (error) {
      console.error('Failed to load feature flags:', error)
      // Use default flags
      this.flags = {
        newUserInterface: false,
        advancedFeatures: false,
        betaFeatures: false
      }
    }
  }
  
  isEnabled(flagName) {
    return this.flags[flagName] || false
  }
}

const featureFlags = new FeatureFlags()

// Usage in components
if (featureFlags.isEnabled('newUserInterface')) {
  // Show new UI
} else {
  // Show old UI
}
```

## Security Considerations

### Code Obfuscation

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true,
          compress: {
            drop_console: true,
            drop_debugger: true
          }
        }
      })
    ]
  }
}
```

### API Security

```javascript
// utils/apiSecurity.js
class ApiSecurity {
  static generateSignature(params, secret) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&')
    
    return this.hash(sortedParams + secret)
  }
  
  static hash(str) {
    // Use a proper hashing library in production
    return btoa(str)
  }
  
  static secureRequest(url, data) {
    const timestamp = Date.now()
    const nonce = Math.random().toString(36)
    
    const params = {
      ...data,
      timestamp,
      nonce
    }
    
    const signature = this.generateSignature(params, 'your-secret-key')
    
    return wx.request({
      url,
      method: 'POST',
      data: params,
      header: {
        'X-Signature': signature,
        'Content-Type': 'application/json'
      }
    })
  }
}
```

## Best Practices

### 1. Deployment Checklist

- [ ] Code review completed
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Documentation updated
- [ ] Release notes prepared
- [ ] Rollback plan ready
- [ ] Monitoring configured

### 2. Release Strategy

```javascript
// Gradual rollout strategy
const rolloutStrategy = {
  canary: {
    percentage: 5,
    duration: '2 hours',
    criteria: 'error_rate < 0.1%'
  },
  beta: {
    percentage: 25,
    duration: '24 hours',
    criteria: 'error_rate < 0.05%'
  },
  production: {
    percentage: 100,
    criteria: 'manual_approval'
  }
}
```

### 3. Monitoring Alerts

```javascript
// Alert configuration
const alerts = {
  errorRate: {
    threshold: '> 1%',
    action: 'auto_rollback'
  },
  responseTime: {
    threshold: '> 3s',
    action: 'notify_team'
  },
  crashRate: {
    threshold: '> 0.1%',
    action: 'emergency_rollback'
  }
}
```

## Troubleshooting

### Common Deployment Issues

1. **Upload Failed**
   - Check network connection
   - Verify app ID and credentials
   - Ensure code size is within limits

2. **Review Rejected**
   - Review platform guidelines
   - Check for prohibited content
   - Ensure proper permissions

3. **Performance Issues**
   - Optimize bundle size
   - Implement code splitting
   - Use lazy loading

### Debug Production Issues

```javascript
// Remote debugging
class RemoteDebugger {
  static log(level, message, data = {}) {
    if (this.shouldLog(level)) {
      wx.request({
        url: 'https://api.example.com/logs',
        method: 'POST',
        data: {
          level,
          message,
          data,
          timestamp: Date.now(),
          version: getApp().globalData.version,
          userId: getApp().globalData.userId
        }
      })
    }
  }
  
  static shouldLog(level) {
    const logLevels = ['error', 'warn', 'info', 'debug']
    const currentLevel = getApp().globalData.logLevel || 'error'
    return logLevels.indexOf(level) <= logLevels.indexOf(currentLevel)
  }
}

// Usage
RemoteDebugger.log('error', 'API call failed', { url: '/api/users', error })
```

## Next Steps

After successful deployment:

1. **Monitor Performance**: Track key metrics and user behavior
2. **Collect Feedback**: Gather user feedback and reviews
3. **Plan Updates**: Schedule regular updates and improvements
4. **Scale Infrastructure**: Prepare for increased traffic
5. **Optimize Continuously**: Use data to drive improvements

For more information, explore:

- [Performance Optimization](./performance-optimization.md) for improving app performance
- [Security Best Practices](./security.md) for protecting your app
- [Monitoring and Analytics](./monitoring.md) for tracking app health
- [Maintenance and Updates](./maintenance.md) for ongoing app management