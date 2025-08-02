# Deployment

This guide covers the deployment process for mini-programs, including preparation, submission, review process, and post-deployment management across different platforms.

## 📋 Table of Contents

- [Pre-deployment Preparation](#pre-deployment-preparation)
- [WeChat Mini Program Deployment](#wechat-mini-program-deployment)
- [Alipay Mini Program Deployment](#alipay-mini-program-deployment)
- [Multi-platform Deployment](#multi-platform-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Version Management](#version-management)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Best Practices](#best-practices)

## 🚀 Pre-deployment Preparation

### Code Quality Checklist
```markdown
- [ ] All features tested and working
- [ ] Code reviewed and approved
- [ ] Performance optimized
- [ ] Security vulnerabilities addressed
- [ ] Accessibility requirements met
- [ ] Cross-platform compatibility verified
- [ ] Documentation updated
- [ ] Version number incremented
```

### Build Process
```javascript
// build.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class BuildManager {
  constructor(config) {
    this.config = config
    this.buildDir = path.join(__dirname, 'dist')
  }
  
  async build() {
    console.log('Starting build process...')
    
    try {
      // Clean previous build
      await this.clean()
      
      // Run linting
      await this.lint()
      
      // Run tests
      await this.test()
      
      // Build assets
      await this.buildAssets()
      
      // Optimize images
      await this.optimizeImages()
      
      // Generate build info
      await this.generateBuildInfo()
      
      console.log('Build completed successfully!')
    } catch (error) {
      console.error('Build failed:', error)
      process.exit(1)
    }
  }
  
  async clean() {
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true })
    }
    fs.mkdirSync(this.buildDir, { recursive: true })
  }
  
  async lint() {
    console.log('Running linter...')
    execSync('npm run lint', { stdio: 'inherit' })
  }
  
  async test() {
    console.log('Running tests...')
    execSync('npm test', { stdio: 'inherit' })
  }
  
  async buildAssets() {
    console.log('Building assets...')
    // Copy source files to build directory
    this.copyDirectory('pages', path.join(this.buildDir, 'pages'))
    this.copyDirectory('components', path.join(this.buildDir, 'components'))
    this.copyDirectory('utils', path.join(this.buildDir, 'utils'))
    
    // Copy configuration files
    this.copyFile('app.js', path.join(this.buildDir, 'app.js'))
    this.copyFile('app.json', path.join(this.buildDir, 'app.json'))
    this.copyFile('app.wxss', path.join(this.buildDir, 'app.wxss'))
  }
  
  async optimizeImages() {
    console.log('Optimizing images...')
    // Image optimization logic
  }
  
  async generateBuildInfo() {
    const buildInfo = {
      version: this.config.version,
      buildTime: new Date().toISOString(),
      gitCommit: execSync('git rev-parse HEAD').toString().trim(),
      environment: process.env.NODE_ENV || 'production'
    }
    
    fs.writeFileSync(
      path.join(this.buildDir, 'build-info.json'),
      JSON.stringify(buildInfo, null, 2)
    )
  }
  
  copyDirectory(src, dest) {
    if (!fs.existsSync(src)) return
    
    fs.mkdirSync(dest, { recursive: true })
    const files = fs.readdirSync(src)
    
    files.forEach(file => {
      const srcPath = path.join(src, file)
      const destPath = path.join(dest, file)
      
      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    })
  }
  
  copyFile(src, dest) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest)
    }
  }
}

// Usage
const buildManager = new BuildManager({
  version: '1.0.0'
})

buildManager.build()
```

## 📱 WeChat Mini Program Deployment

### Upload Process
```javascript
// WeChat Developer Tools CLI
const ci = require('miniprogram-ci')

async function uploadToWeChat() {
  const project = new ci.Project({
    appid: 'your-app-id',
    type: 'miniProgram',
    projectPath: './dist',
    privateKeyPath: './private.key',
    ignores: ['node_modules/**/*']
  })
  
  try {
    const uploadResult = await ci.upload({
      project,
      version: '1.0.0',
      desc: 'Initial release',
      setting: {
        es6: true,
        es7: true,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        minify: true,
        codeProtect: true,
        autoPrefixWXSS: true
      },
      onProgressUpdate: console.log
    })
    
    console.log('Upload successful:', uploadResult)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
```

### Review Submission
```javascript
// Automated review submission
async function submitForReview() {
  const submitResult = await ci.submitAudit({
    project,
    version: '1.0.0',
    desc: 'Bug fixes and performance improvements',
    feedbackInfo: 'Contact: developer@example.com',
    feedbackStuff: 'Screenshots and test data',
    ugcDeclare: {
      scene: [1, 2, 3], // UGC scenes
      otherStuff: 'Additional UGC information'
    }
  })
  
  console.log('Submitted for review:', submitResult.auditid)
  return submitResult.auditid
}

// Check review status
async function checkReviewStatus(auditid) {
  const statusResult = await ci.getAuditStatus({
    project,
    auditid
  })
  
  console.log('Review status:', statusResult.status)
  return statusResult
}
```

### Release Management
```javascript
async function releaseVersion() {
  try {
    const releaseResult = await ci.release({
      project,
      version: '1.0.0',
      desc: 'Production release'
    })
    
    console.log('Released successfully:', releaseResult)
  } catch (error) {
    console.error('Release failed:', error)
  }
}
```

## 💰 Alipay Mini Program Deployment

### Build Configuration
```json
{
  "name": "alipay-mini-program",
  "version": "1.0.0",
  "scripts": {
    "build": "node build-alipay.js",
    "upload": "alipay-mini upload"
  },
  "alipay": {
    "appId": "your-alipay-app-id",
    "toolId": "your-tool-id",
    "privateKey": "./alipay-private.key"
  }
}
```

### Upload Script
```javascript
// build-alipay.js
const AlipayMini = require('@alipay/mini-cli')

async function deployToAlipay() {
  const client = new AlipayMini({
    appId: process.env.ALIPAY_APP_ID,
    toolId: process.env.ALIPAY_TOOL_ID,
    privateKey: fs.readFileSync('./alipay-private.key', 'utf8')
  })
  
  try {
    // Upload version
    const uploadResult = await client.upload({
      version: '1.0.0',
      buildDir: './dist',
      changelog: 'Initial release'
    })
    
    console.log('Upload result:', uploadResult)
    
    // Submit for review
    const reviewResult = await client.submitReview({
      version: '1.0.0',
      memo: 'Please review our mini program'
    })
    
    console.log('Review submission:', reviewResult)
  } catch (error) {
    console.error('Deployment failed:', error)
  }
}

deployToAlipay()
```

## 🔄 Multi-platform Deployment

### Platform Adapter
```javascript
class PlatformAdapter {
  constructor(platform) {
    this.platform = platform
    this.config = this.loadPlatformConfig(platform)
  }
  
  loadPlatformConfig(platform) {
    const configs = {
      wechat: {
        buildDir: './dist/wechat',
        fileExtensions: { template: '.wxml', style: '.wxss', script: '.js' },
        configFile: 'app.json'
      },
      alipay: {
        buildDir: './dist/alipay',
        fileExtensions: { template: '.axml', style: '.acss', script: '.js' },
        configFile: 'app.json'
      },
      baidu: {
        buildDir: './dist/baidu',
        fileExtensions: { template: '.swan', style: '.css', script: '.js' },
        configFile: 'app.json'
      }
    }
    
    return configs[platform]
  }
  
  async build() {
    console.log(`Building for ${this.platform}...`)
    
    // Create platform-specific build directory
    fs.mkdirSync(this.config.buildDir, { recursive: true })
    
    // Transform files for platform
    await this.transformFiles()
    
    // Generate platform-specific config
    await this.generateConfig()
    
    console.log(`Build completed for ${this.platform}`)
  }
  
  async transformFiles() {
    const sourceDir = './src'
    const targetDir = this.config.buildDir
    
    // Transform templates
    await this.transformTemplates(sourceDir, targetDir)
    
    // Transform styles
    await this.transformStyles(sourceDir, targetDir)
    
    // Transform scripts
    await this.transformScripts(sourceDir, targetDir)
  }
  
  async transformTemplates(sourceDir, targetDir) {
    // Platform-specific template transformation logic
    const templateFiles = this.findFiles(sourceDir, '.wxml')
    
    for (const file of templateFiles) {
      const content = fs.readFileSync(file, 'utf8')
      const transformed = this.transformTemplateContent(content)
      
      const targetFile = file
        .replace(sourceDir, targetDir)
        .replace('.wxml', this.config.fileExtensions.template)
      
      this.ensureDirectoryExists(path.dirname(targetFile))
      fs.writeFileSync(targetFile, transformed)
    }
  }
  
  transformTemplateContent(content) {
    // Platform-specific transformations
    switch (this.platform) {
      case 'alipay':
        return content
          .replace(/wx:if/g, 'a:if')
          .replace(/wx:for/g, 'a:for')
          .replace(/wx:key/g, 'a:key')
          .replace(/bindtap/g, 'onTap')
        
      case 'baidu':
        return content
          .replace(/wx:if/g, 's-if')
          .replace(/wx:for/g, 's-for')
          .replace(/wx:key/g, 's-key')
        
      default:
        return content
    }
  }
  
  findFiles(dir, extension) {
    const files = []
    
    function traverse(currentDir) {
      const items = fs.readdirSync(currentDir)
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item)
        const stat = fs.statSync(fullPath)
        
        if (stat.isDirectory()) {
          traverse(fullPath)
        } else if (fullPath.endsWith(extension)) {
          files.push(fullPath)
        }
      }
    }
    
    traverse(dir)
    return files
  }
  
  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }
}

// Multi-platform build
async function buildAllPlatforms() {
  const platforms = ['wechat', 'alipay', 'baidu']
  
  for (const platform of platforms) {
    const adapter = new PlatformAdapter(platform)
    await adapter.build()
  }
}
```

## 🔧 CI/CD Pipeline

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy Mini Program

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
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
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build for production
        run: npm run build:prod
        env:
          NODE_ENV: production
      
      - name: Deploy to WeChat
        run: npm run deploy:wechat
        env:
          WECHAT_APP_ID: ${{ secrets.WECHAT_APP_ID }}
          WECHAT_PRIVATE_KEY: ${{ secrets.WECHAT_PRIVATE_KEY }}
      
      - name: Deploy to Alipay
        run: npm run deploy:alipay
        env:
          ALIPAY_APP_ID: ${{ secrets.ALIPAY_APP_ID }}
          ALIPAY_PRIVATE_KEY: ${{ secrets.ALIPAY_PRIVATE_KEY }}
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Deployment Script
```javascript
// deploy.js
const { execSync } = require('child_process')

class DeploymentManager {
  constructor() {
    this.version = this.getVersion()
    this.environment = process.env.NODE_ENV || 'production'
  }
  
  getVersion() {
    try {
      const packageJson = require('./package.json')
      return packageJson.version
    } catch (error) {
      return '1.0.0'
    }
  }
  
  async deploy() {
    console.log(`Deploying version ${this.version} to ${this.environment}`)
    
    try {
      // Pre-deployment checks
      await this.preDeploymentChecks()
      
      // Build for all platforms
      await this.buildAllPlatforms()
      
      // Deploy to platforms
      await this.deployToPlatforms()
      
      // Post-deployment tasks
      await this.postDeploymentTasks()
      
      console.log('Deployment completed successfully!')
    } catch (error) {
      console.error('Deployment failed:', error)
      await this.rollback()
      process.exit(1)
    }
  }
  
  async preDeploymentChecks() {
    console.log('Running pre-deployment checks...')
    
    // Check if all required environment variables are set
    const requiredEnvVars = ['WECHAT_APP_ID', 'ALIPAY_APP_ID']
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`)
      }
    }
    
    // Run tests
    execSync('npm test', { stdio: 'inherit' })
    
    // Check code quality
    execSync('npm run lint', { stdio: 'inherit' })
  }
  
  async buildAllPlatforms() {
    console.log('Building for all platforms...')
    execSync('npm run build:all', { stdio: 'inherit' })
  }
  
  async deployToPlatforms() {
    const platforms = ['wechat', 'alipay']
    
    for (const platform of platforms) {
      console.log(`Deploying to ${platform}...`)
      execSync(`npm run deploy:${platform}`, { stdio: 'inherit' })
    }
  }
  
  async postDeploymentTasks() {
    console.log('Running post-deployment tasks...')
    
    // Update deployment record
    await this.updateDeploymentRecord()
    
    // Send notifications
    await this.sendNotifications()
    
    // Update monitoring
    await this.updateMonitoring()
  }
  
  async updateDeploymentRecord() {
    const deploymentRecord = {
      version: this.version,
      environment: this.environment,
      timestamp: new Date().toISOString(),
      gitCommit: execSync('git rev-parse HEAD').toString().trim()
    }
    
    // Save deployment record to database or file
    console.log('Deployment record:', deploymentRecord)
  }
  
  async sendNotifications() {
    // Send deployment notifications to team
    console.log('Sending deployment notifications...')
  }
  
  async updateMonitoring() {
    // Update monitoring systems with new version
    console.log('Updating monitoring systems...')
  }
  
  async rollback() {
    console.log('Rolling back deployment...')
    // Rollback logic
  }
}

// Run deployment
const deploymentManager = new DeploymentManager()
deploymentManager.deploy()
```

## 📊 Monitoring and Analytics

### Performance Monitoring
```javascript
// monitoring.js
class PerformanceMonitor {
  constructor() {
    this.metrics = []
    this.startTime = Date.now()
  }
  
  trackPageLoad(pageName) {
    const loadTime = Date.now() - this.startTime
    
    this.metrics.push({
      type: 'page_load',
      page: pageName,
      duration: loadTime,
      timestamp: new Date().toISOString()
    })
    
    // Send to analytics service
    this.sendMetrics()
  }
  
  trackUserAction(action, data = {}) {
    this.metrics.push({
      type: 'user_action',
      action,
      data,
      timestamp: new Date().toISOString()
    })
    
    this.sendMetrics()
  }
  
  trackError(error, context = {}) {
    this.metrics.push({
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    })
    
    this.sendMetrics()
  }
  
  async sendMetrics() {
    if (this.metrics.length === 0) return
    
    try {
      await wx.request({
        url: 'https://analytics.example.com/metrics',
        method: 'POST',
        data: {
          appId: getApp().globalData.appId,
          version: getApp().globalData.version,
          metrics: this.metrics
        }
      })
      
      // Clear sent metrics
      this.metrics = []
    } catch (error) {
      console.error('Failed to send metrics:', error)
    }
  }
}

// Global monitor instance
const monitor = new PerformanceMonitor()

// Usage in pages
Page({
  onLoad() {
    monitor.trackPageLoad('home')
  },
  
  onButtonTap() {
    monitor.trackUserAction('button_tap', { button: 'submit' })
  }
})
```

## 🎯 Best Practices

### Version Management
```javascript
// version-manager.js
class VersionManager {
  static getCurrentVersion() {
    try {
      const buildInfo = require('./build-info.json')
      return buildInfo.version
    } catch (error) {
      return '1.0.0'
    }
  }
  
  static compareVersions(version1, version2) {
    const v1Parts = version1.split('.').map(Number)
    const v2Parts = version2.split('.').map(Number)
    
    for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
      const v1Part = v1Parts[i] || 0
      const v2Part = v2Parts[i] || 0
      
      if (v1Part > v2Part) return 1
      if (v1Part < v2Part) return -1
    }
    
    return 0
  }
  
  static isUpdateRequired(currentVersion, minimumVersion) {
    return this.compareVersions(currentVersion, minimumVersion) < 0
  }
  
  static async checkForUpdates() {
    try {
      const response = await wx.request({
        url: 'https://api.example.com/version-check',
        method: 'GET'
      })
      
      if (response.statusCode === 200) {
        const { latestVersion, minimumVersion, updateMessage } = response.data
        const currentVersion = this.getCurrentVersion()
        
        if (this.isUpdateRequired(currentVersion, minimumVersion)) {
          // Force update required
          wx.showModal({
            title: 'Update Required',
            content: updateMessage || 'Please update to continue using the app',
            showCancel: false,
            success: () => {
              // Redirect to update page or restart app
            }
          })
        } else if (this.compareVersions(currentVersion, latestVersion) < 0) {
          // Optional update available
          wx.showModal({
            title: 'Update Available',
            content: 'A new version is available. Would you like to update?',
            success: (res) => {
              if (res.confirm) {
                // Handle update
              }
            }
          })
        }
      }
    } catch (error) {
      console.error('Version check failed:', error)
    }
  }
}
```

### Deployment Checklist
```markdown
## Pre-deployment Checklist
- [ ] All features tested on target devices
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Accessibility requirements verified
- [ ] Content review completed
- [ ] Legal compliance checked
- [ ] Privacy policy updated
- [ ] Terms of service reviewed

## Platform-specific Checklist
### WeChat
- [ ] App ID configured correctly
- [ ] Domain whitelist updated
- [ ] Payment configuration (if applicable)
- [ ] Share configuration set up
- [ ] Customer service integration

### Alipay
- [ ] App ID and keys configured
- [ ] API permissions requested
- [ ] Payment integration tested
- [ ] Security settings configured

## Post-deployment Checklist
- [ ] Deployment verified on all platforms
- [ ] Monitoring systems updated
- [ ] Analytics tracking confirmed
- [ ] Error reporting functional
- [ ] Team notified of deployment
- [ ] Documentation updated
- [ ] Rollback plan prepared
```

---

Successful deployment requires careful planning, thorough testing, and proper monitoring. Follow platform-specific guidelines, implement robust CI/CD pipelines, and maintain comprehensive monitoring to ensure smooth deployments and quick issue resolution.