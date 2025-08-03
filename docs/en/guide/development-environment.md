# Development Environment

Setting up an efficient development environment is crucial for productive mini program development. This guide covers essential tools, configurations, and best practices.

## Development Tools

### WeChat Developer Tools

**Installation and Setup**

1. **Download and Install**
   - Download from [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
   - Install the appropriate version for your operating system
   - Sign in with your WeChat account

2. **Basic Configuration**

```javascript
// project.config.json - Project configuration
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
        "value": "node_modules"
      }
    ]
  },
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": false,
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
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "enableEngineNative": false,
    "useIsolateContext": false,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "disableUseStrict": false,
    "minifyWXML": true,
    "showES6CompileOption": false,
    "useCompilerPlugins": false
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "appid": "your-app-id",
  "projectname": "mini-program",
  "debugOptions": {
    "hidedInDevtools": []
  },
  "scripts": {},
  "staticServerOptions": {
    "baseURL": "",
    "servePath": ""
  },
  "isGameTourist": false,
  "condition": {
    "search": {
      "list": []
    },
    "conversation": {
      "list": []
    },
    "game": {
      "list": []
    },
    "plugin": {
      "list": []
    },
    "gamePlugin": {
      "list": []
    },
    "miniprogram": {
      "list": []
    }
  }
}
```

3. **Useful Features**
   - **Simulator**: Test on different device sizes and orientations
   - **Debugger**: Debug JavaScript, inspect elements, monitor network
   - **Performance**: Analyze performance metrics and memory usage
   - **Audits**: Automated code quality and performance checks

### Code Editor Setup

**VS Code Configuration**

1. **Essential Extensions**

```json
// .vscode/extensions.json
{
  "recommendations": [
    "ms-vscode.vscode-wxml",
    "qiu8310.minapp-vscode",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

2. **Workspace Settings**

```json
// .vscode/settings.json
{
  "files.associations": {
    "*.wxml": "html",
    "*.wxss": "css",
    "*.wxs": "javascript"
  },
  "emmet.includeLanguages": {
    "wxml": "html"
  },
  "minapp-vscode.disableAutoConfig": true,
  "minapp-vscode.wxmlFormatter": "prettier",
  "minapp-vscode.prettier": {
    "parser": "html"
  },
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.exclude": {
    "**/node_modules": true,
    "**/miniprogram_npm": true
  }
}
```

3. **Code Snippets**

```json
// .vscode/snippets.json
{
  "Page Template": {
    "prefix": "page",
    "body": [
      "Page({",
      "  data: {",
      "    $1",
      "  },",
      "",
      "  onLoad(options) {",
      "    $2",
      "  },",
      "",
      "  onReady() {",
      "    $3",
      "  },",
      "",
      "  onShow() {",
      "    $4",
      "  },",
      "",
      "  onHide() {",
      "    $5",
      "  },",
      "",
      "  onUnload() {",
      "    $6",
      "  }",
      "})"
    ],
    "description": "Create a new page"
  },
  "Component Template": {
    "prefix": "component",
    "body": [
      "Component({",
      "  properties: {",
      "    $1",
      "  },",
      "",
      "  data: {",
      "    $2",
      "  },",
      "",
      "  methods: {",
      "    $3",
      "  },",
      "",
      "  lifetimes: {",
      "    attached() {",
      "      $4",
      "    },",
      "",
      "    detached() {",
      "      $5",
      "    }",
      "  }",
      "})"
    ],
    "description": "Create a new component"
  }
}
```

## Build Tools and Workflow

### Package Management

**npm Configuration**

```json
// package.json
{
  "name": "mini-program",
  "version": "1.0.0",
  "description": "Mini Program Project",
  "main": "app.js",
  "scripts": {
    "dev": "npm run build:npm",
    "build": "npm run build:npm && npm run build:prod",
    "build:npm": "npm install --production=false",
    "build:prod": "node scripts/build.js",
    "lint": "eslint . --ext .js",
    "lint:fix": "eslint . --ext .js --fix",
    "format": "prettier --write \"**/*.{js,json,wxml,wxss}\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "@vant/weapp": "^1.10.4",
    "dayjs": "^1.11.7",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@babel/core": "^7.21.0",
    "@babel/preset-env": "^7.20.2",
    "eslint": "^8.36.0",
    "eslint-config-standard": "^17.0.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^6.1.1",
    "jest": "^29.5.0",
    "prettier": "^2.8.4"
  }
}
```

### Code Quality Tools

**ESLint Configuration**

```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    wx: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly',
    Behavior: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': ['error', 'never'],
    'comma-dangle': ['error', 'never']
  }
}
```

**Prettier Configuration**

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

**Git Hooks with Husky**

```json
// package.json (additional scripts)
{
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "husky": "^8.0.3",
    "lint-staged": "^13.2.0"
  },
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,wxml,wxss}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

### Build Scripts

**Custom Build Script**

```javascript
// scripts/build.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class BuildTool {
  constructor() {
    this.rootDir = process.cwd()
    this.distDir = path.join(this.rootDir, 'dist')
  }

  // Clean dist directory
  clean() {
    console.log('🧹 Cleaning dist directory...')
    if (fs.existsSync(this.distDir)) {
      fs.rmSync(this.distDir, { recursive: true })
    }
    fs.mkdirSync(this.distDir, { recursive: true })
  }

  // Copy source files
  copyFiles() {
    console.log('📁 Copying source files...')
    const filesToCopy = [
      'app.js',
      'app.json',
      'app.wxss',
      'sitemap.json',
      'pages',
      'components',
      'utils',
      'images',
      'miniprogram_npm'
    ]

    filesToCopy.forEach(file => {
      const srcPath = path.join(this.rootDir, file)
      const destPath = path.join(this.distDir, file)

      if (fs.existsSync(srcPath)) {
        this.copyRecursive(srcPath, destPath)
      }
    })
  }

  copyRecursive(src, dest) {
    const stat = fs.statSync(src)
    
    if (stat.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true })
      const files = fs.readdirSync(src)
      
      files.forEach(file => {
        this.copyRecursive(
          path.join(src, file),
          path.join(dest, file)
        )
      })
    } else {
      fs.copyFileSync(src, dest)
    }
  }

  // Minify files
  minify() {
    console.log('🗜️  Minifying files...')
    // Add minification logic here
    // You can use tools like UglifyJS, CleanCSS, etc.
  }

  // Generate build info
  generateBuildInfo() {
    console.log('📝 Generating build info...')
    const buildInfo = {
      version: require('../package.json').version,
      buildTime: new Date().toISOString(),
      gitCommit: this.getGitCommit(),
      environment: process.env.NODE_ENV || 'production'
    }

    fs.writeFileSync(
      path.join(this.distDir, 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    )
  }

  getGitCommit() {
    try {
      return execSync('git rev-parse HEAD').toString().trim()
    } catch (error) {
      return 'unknown'
    }
  }

  // Main build process
  build() {
    console.log('🚀 Starting build process...')
    
    this.clean()
    this.copyFiles()
    this.minify()
    this.generateBuildInfo()
    
    console.log('✅ Build completed successfully!')
  }
}

// Run build
const builder = new BuildTool()
builder.build()
```

## Environment Configuration

### Environment Variables

```javascript
// config/env.js
const environments = {
  development: {
    API_BASE_URL: 'https://dev-api.example.com',
    DEBUG: true,
    LOG_LEVEL: 'debug'
  },
  staging: {
    API_BASE_URL: 'https://staging-api.example.com',
    DEBUG: true,
    LOG_LEVEL: 'info'
  },
  production: {
    API_BASE_URL: 'https://api.example.com',
    DEBUG: false,
    LOG_LEVEL: 'error'
  }
}

const currentEnv = process.env.NODE_ENV || 'development'
const config = environments[currentEnv]

module.exports = config
```

**Usage in Code**

```javascript
// utils/config.js
const config = require('../config/env')

class Config {
  static get(key) {
    return config[key]
  }

  static getApiUrl(endpoint) {
    return `${config.API_BASE_URL}${endpoint}`
  }

  static isDebug() {
    return config.DEBUG
  }

  static shouldLog(level) {
    const levels = ['debug', 'info', 'warn', 'error']
    const currentLevel = levels.indexOf(config.LOG_LEVEL)
    const messageLevel = levels.indexOf(level)
    
    return messageLevel >= currentLevel
  }
}

module.exports = Config
```

### Multi-Platform Configuration

```javascript
// utils/platform.js
class PlatformConfig {
  constructor() {
    this.platform = this.detectPlatform()
  }

  detectPlatform() {
    const systemInfo = wx.getSystemInfoSync()
    
    if (systemInfo.platform === 'ios') {
      return 'ios'
    } else if (systemInfo.platform === 'android') {
      return 'android'
    } else {
      return 'unknown'
    }
  }

  getConfig() {
    const baseConfig = {
      appName: 'Mini Program',
      version: '1.0.0'
    }

    const platformConfigs = {
      ios: {
        ...baseConfig,
        statusBarHeight: 44,
        navigationBarHeight: 44
      },
      android: {
        ...baseConfig,
        statusBarHeight: 24,
        navigationBarHeight: 48
      },
      unknown: {
        ...baseConfig,
        statusBarHeight: 24,
        navigationBarHeight: 44
      }
    }

    return platformConfigs[this.platform]
  }

  isPlatform(platform) {
    return this.platform === platform
  }
}

module.exports = new PlatformConfig()
```

## Testing Setup

### Unit Testing with Jest

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/**/*.test.js',
    '<rootDir>/utils/**/*.test.js'
  ],
  collectCoverageFrom: [
    'utils/**/*.js',
    'pages/**/*.js',
    'components/**/*.js',
    '!**/node_modules/**',
    '!**/miniprogram_npm/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  globals: {
    wx: {},
    App: jest.fn(),
    Page: jest.fn(),
    Component: jest.fn(),
    getApp: jest.fn(),
    getCurrentPages: jest.fn()
  }
}
```

**Test Setup**

```javascript
// tests/setup.js
// Mock WeChat APIs
global.wx = {
  request: jest.fn(),
  showToast: jest.fn(),
  showModal: jest.fn(),
  navigateTo: jest.fn(),
  redirectTo: jest.fn(),
  setStorageSync: jest.fn(),
  getStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
  getSystemInfoSync: jest.fn(() => ({
    platform: 'ios',
    system: 'iOS 15.0',
    windowWidth: 375,
    windowHeight: 812
  }))
}

// Mock global functions
global.getApp = jest.fn(() => ({
  globalData: {}
}))

global.getCurrentPages = jest.fn(() => [])
```

**Example Test**

```javascript
// utils/format.test.js
const { formatPrice, formatDate } = require('./format')

describe('Format Utils', () => {
  describe('formatPrice', () => {
    test('should format price correctly', () => {
      expect(formatPrice(1234.56)).toBe('¥1,234.56')
      expect(formatPrice(0)).toBe('¥0.00')
      expect(formatPrice(null)).toBe('¥0.00')
    })
  })

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const date = new Date('2023-03-15T10:30:00Z')
      expect(formatDate(date, 'YYYY-MM-DD')).toBe('2023-03-15')
    })
  })
})
```

## Debugging and Development

### Debug Configuration

```javascript
// utils/debug.js
class Debug {
  constructor() {
    this.enabled = wx.getAccountInfoSync().miniProgram.envVersion !== 'release'
  }

  log(...args) {
    if (this.enabled) {
      console.log('[DEBUG]', ...args)
    }
  }

  warn(...args) {
    if (this.enabled) {
      console.warn('[WARN]', ...args)
    }
  }

  error(...args) {
    console.error('[ERROR]', ...args)
  }

  time(label) {
    if (this.enabled) {
      console.time(label)
    }
  }

  timeEnd(label) {
    if (this.enabled) {
      console.timeEnd(label)
    }
  }

  group(label) {
    if (this.enabled) {
      console.group(label)
    }
  }

  groupEnd() {
    if (this.enabled) {
      console.groupEnd()
    }
  }

  table(data) {
    if (this.enabled && console.table) {
      console.table(data)
    }
  }
}

module.exports = new Debug()
```

### Development Utilities

```javascript
// utils/dev-tools.js
class DevTools {
  static showPageInfo() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    
    console.group('📄 Page Info')
    console.log('Route:', currentPage.route)
    console.log('Options:', currentPage.options)
    console.log('Data:', currentPage.data)
    console.groupEnd()
  }

  static showSystemInfo() {
    const systemInfo = wx.getSystemInfoSync()
    
    console.group('📱 System Info')
    console.table(systemInfo)
    console.groupEnd()
  }

  static showNetworkInfo() {
    wx.getNetworkType({
      success: (res) => {
        console.group('🌐 Network Info')
        console.log('Network Type:', res.networkType)
        console.log('Is Connected:', res.networkType !== 'none')
        console.groupEnd()
      }
    })
  }

  static measurePerformance(name, fn) {
    return async (...args) => {
      const startTime = Date.now()
      
      try {
        const result = await fn(...args)
        const endTime = Date.now()
        
        console.log(`⏱️ ${name} took ${endTime - startTime}ms`)
        return result
      } catch (error) {
        const endTime = Date.now()
        console.error(`❌ ${name} failed after ${endTime - startTime}ms:`, error)
        throw error
      }
    }
  }
}

module.exports = DevTools
```

## Best Practices

### Project Structure

```
mini-program/
├── app.js                 # App entry point
├── app.json              # App configuration
├── app.wxss              # Global styles
├── sitemap.json          # Sitemap configuration
├── project.config.json   # Project configuration
├── package.json          # Dependencies
├── pages/                # Pages
│   ├── index/
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── profile/
├── components/           # Reusable components
│   ├── common/
│   └── business/
├── utils/               # Utility functions
│   ├── api.js
│   ├── config.js
│   ├── format.js
│   └── storage.js
├── images/              # Static images
├── styles/              # Shared styles
├── config/              # Configuration files
├── scripts/             # Build scripts
├── tests/               # Test files
└── docs/                # Documentation
```

### Development Workflow

1. **Setup Phase**
   - Clone repository
   - Install dependencies: `npm install`
   - Configure development tools
   - Set up environment variables

2. **Development Phase**
   - Start development: `npm run dev`
   - Use hot reload for rapid development
   - Write tests alongside features
   - Use debugging tools effectively

3. **Quality Assurance**
   - Run linting: `npm run lint`
   - Run tests: `npm test`
   - Check code coverage
   - Review code before committing

4. **Build and Deploy**
   - Build for production: `npm run build`
   - Test in WeChat Developer Tools
   - Upload to WeChat platform
   - Monitor performance and errors

A well-configured development environment significantly improves productivity and code quality. Invest time in setting up proper tooling and workflows for long-term benefits.