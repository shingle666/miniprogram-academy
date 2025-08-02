# 发布部署

掌握小程序发布部署的完整流程，从开发到上线的每个环节。

## 🚀 发布准备

### 版本管理

```javascript
// utils/versionManager.js
class VersionManager {
  constructor() {
    this.currentVersion = this.getCurrentVersion()
    this.versionHistory = this.loadVersionHistory()
  }

  // 获取当前版本
  getCurrentVersion() {
    try {
      const packageInfo = require('../package.json')
      return packageInfo.version || '1.0.0'
    } catch (error) {
      console.warn('无法读取版本信息，使用默认版本')
      return '1.0.0'
    }
  }

  // 版本号递增
  incrementVersion(type = 'patch') {
    const [major, minor, patch] = this.currentVersion.split('.').map(Number)
    
    let newVersion
    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`
        break
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`
        break
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`
        break
    }
    
    this.currentVersion = newVersion
    this.updatePackageVersion(newVersion)
    this.addVersionHistory(newVersion)
    
    return newVersion
  }

  // 更新 package.json 版本
  updatePackageVersion(version) {
    try {
      const fs = require('fs')
      const packagePath = './package.json'
      const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
      
      packageInfo.version = version
      
      fs.writeFileSync(packagePath, JSON.stringify(packageInfo, null, 2))
      console.log(`版本已更新至 ${version}`)
    } catch (error) {
      console.error('更新版本失败:', error)
    }
  }

  // 添加版本历史记录
  addVersionHistory(version, description = '') {
    const versionInfo = {
      version,
      description,
      timestamp: new Date().toISOString(),
      features: [],
      bugfixes: [],
      breaking: []
    }
    
    this.versionHistory.unshift(versionInfo)
    this.saveVersionHistory()
    
    return versionInfo
  }

  // 加载版本历史
  loadVersionHistory() {
    try {
      const fs = require('fs')
      const historyPath = './version-history.json'
      
      if (fs.existsSync(historyPath)) {
        return JSON.parse(fs.readFileSync(historyPath, 'utf8'))
      }
    } catch (error) {
      console.warn('无法加载版本历史')
    }
    
    return []
  }

  // 保存版本历史
  saveVersionHistory() {
    try {
      const fs = require('fs')
      const historyPath = './version-history.json'
      
      fs.writeFileSync(historyPath, JSON.stringify(this.versionHistory, null, 2))
    } catch (error) {
      console.error('保存版本历史失败:', error)
    }
  }

  // 生成更新日志
  generateChangelog() {
    let changelog = '# 更新日志\n\n'
    
    this.versionHistory.forEach(version => {
      changelog += `## ${version.version} (${version.timestamp.split('T')[0]})\n\n`
      
      if (version.description) {
        changelog += `${version.description}\n\n`
      }
      
      if (version.features.length > 0) {
        changelog += '### ✨ 新功能\n'
        version.features.forEach(feature => {
          changelog += `- ${feature}\n`
        })
        changelog += '\n'
      }
      
      if (version.bugfixes.length > 0) {
        changelog += '### 🐛 问题修复\n'
        version.bugfixes.forEach(fix => {
          changelog += `- ${fix}\n`
        })
        changelog += '\n'
      }
      
      if (version.breaking.length > 0) {
        changelog += '### ⚠️ 破坏性变更\n'
        version.breaking.forEach(change => {
          changelog += `- ${change}\n`
        })
        changelog += '\n'
      }
    })
    
    return changelog
  }

  // 创建发布标签
  createReleaseTag(version, message) {
    const tagInfo = {
      version,
      message,
      timestamp: new Date().toISOString(),
      commit: this.getCurrentCommit(),
      author: this.getCurrentUser()
    }
    
    console.log(`创建发布标签: v${version}`)
    return tagInfo
  }

  // 获取当前提交
  getCurrentCommit() {
    // 这里可以集成 Git 命令获取当前提交哈希
    return 'abc123def456'
  }

  // 获取当前用户
  getCurrentUser() {
    // 这里可以获取当前用户信息
    return 'developer'
  }

  // 比较版本
  compareVersions(version1, version2) {
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

  // 获取版本统计
  getVersionStats() {
    return {
      currentVersion: this.currentVersion,
      totalVersions: this.versionHistory.length,
      latestRelease: this.versionHistory[0],
      releaseFrequency: this.calculateReleaseFrequency()
    }
  }

  // 计算发布频率
  calculateReleaseFrequency() {
    if (this.versionHistory.length < 2) {
      return 0
    }
    
    const firstRelease = new Date(this.versionHistory[this.versionHistory.length - 1].timestamp)
    const lastRelease = new Date(this.versionHistory[0].timestamp)
    const daysDiff = (lastRelease - firstRelease) / (1000 * 60 * 60 * 24)
    
    return Math.round(daysDiff / this.versionHistory.length)
  }
}

module.exports = new VersionManager()
```

### 构建配置

```javascript
// build/build.js
const fs = require('fs')
const path = require('path')

class BuildManager {
  constructor() {
    this.buildConfig = this.loadBuildConfig()
    this.outputDir = './dist'
    this.sourceDir = './src'
  }

  // 加载构建配置
  loadBuildConfig() {
    try {
      return require('../build.config.js')
    } catch (error) {
      console.warn('使用默认构建配置')
      return {
        minify: true,
        sourcemap: false,
        target: 'production',
        optimization: {
          removeConsole: true,
          removeDebugger: true,
          compressImages: true
        }
      }
    }
  }

  // 执行构建
  async build(environment = 'production') {
    console.log(`开始构建 ${environment} 环境...`)
    
    try {
      // 清理输出目录
      await this.cleanOutputDir()
      
      // 复制源文件
      await this.copySourceFiles()
      
      // 处理配置文件
      await this.processConfigFiles(environment)
      
      // 优化资源
      await this.optimizeAssets()
      
      // 生成构建报告
      const buildReport = await this.generateBuildReport()
      
      console.log('构建完成！')
      return buildReport
      
    } catch (error) {
      console.error('构建失败:', error)
      throw error
    }
  }

  // 清理输出目录
  async cleanOutputDir() {
    if (fs.existsSync(this.outputDir)) {
      fs.rmSync(this.outputDir, { recursive: true, force: true })
    }
    fs.mkdirSync(this.outputDir, { recursive: true })
    console.log('输出目录已清理')
  }

  // 复制源文件
  async copySourceFiles() {
    const copyFile = (src, dest) => {
      const destDir = path.dirname(dest)
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      fs.copyFileSync(src, dest)
    }

    const copyDir = (srcDir, destDir) => {
      if (!fs.existsSync(srcDir)) return
      
      const files = fs.readdirSync(srcDir)
      
      files.forEach(file => {
        const srcPath = path.join(srcDir, file)
        const destPath = path.join(destDir, file)
        
        if (fs.statSync(srcPath).isDirectory()) {
          copyDir(srcPath, destPath)
        } else {
          copyFile(srcPath, destPath)
        }
      })
    }

    // 复制主要目录
    const dirsToopy = ['pages', 'components', 'utils', 'images', 'styles']
    
    dirsToopy.forEach(dir => {
      const srcPath = path.join(this.sourceDir, dir)
      const destPath = path.join(this.outputDir, dir)
      copyDir(srcPath, destPath)
    })

    // 复制根文件
    const filesToCopy = ['app.js', 'app.json', 'app.wxss', 'sitemap.json']
    
    filesToCopy.forEach(file => {
      const srcPath = path.join(this.sourceDir, file)
      const destPath = path.join(this.outputDir, file)
      
      if (fs.existsSync(srcPath)) {
        copyFile(srcPath, destPath)
      }
    })

    console.log('源文件复制完成')
  }

  // 处理配置文件
  async processConfigFiles(environment) {
    const configFiles = [
      { src: 'app.json', processor: this.processAppConfig },
      { src: 'project.config.json', processor: this.processProjectConfig }
    ]

    for (const { src, processor } of configFiles) {
      const srcPath = path.join(this.sourceDir, src)
      const destPath = path.join(this.outputDir, src)
      
      if (fs.existsSync(srcPath)) {
        const config = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
        const processedConfig = await processor.call(this, config, environment)
        
        fs.writeFileSync(destPath, JSON.stringify(processedConfig, null, 2))
      }
    }

    console.log('配置文件处理完成')
  }

  // 处理 app.json
  processAppConfig(config, environment) {
    // 根据环境调整配置
    if (environment === 'production') {
      // 生产环境移除调试页面
      if (config.pages) {
        config.pages = config.pages.filter(page => !page.includes('debug'))
      }
      
      // 移除开发工具配置
      delete config.debug
    }

    return config
  }

  // 处理 project.config.json
  processProjectConfig(config, environment) {
    if (environment === 'production') {
      // 生产环境优化设置
      config.setting = {
        ...config.setting,
        es6: true,
        postcss: true,
        minified: true,
        newFeature: true
      }
    }

    return config
  }

  // 优化资源
  async optimizeAssets() {
    if (!this.buildConfig.optimization) {
      return
    }

    const { removeConsole, removeDebugger, compressImages } = this.buildConfig.optimization

    // 优化 JavaScript 文件
    if (removeConsole || removeDebugger) {
      await this.optimizeJavaScript({ removeConsole, removeDebugger })
    }

    // 压缩图片
    if (compressImages) {
      await this.compressImages()
    }

    console.log('资源优化完成')
  }

  // 优化 JavaScript
  async optimizeJavaScript(options) {
    const { removeConsole, removeDebugger } = options

    const processJsFile = (filePath) => {
      let content = fs.readFileSync(filePath, 'utf8')
      
      if (removeConsole) {
        // 移除 console 语句
        content = content.replace(/console\.(log|warn|error|info|debug)\([^)]*\);?/g, '')
      }
      
      if (removeDebugger) {
        // 移除 debugger 语句
        content = content.replace(/debugger;?/g, '')
      }
      
      fs.writeFileSync(filePath, content)
    }

    const processDir = (dir) => {
      if (!fs.existsSync(dir)) return
      
      const files = fs.readdirSync(dir)
      
      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          processDir(filePath)
        } else if (file.endsWith('.js')) {
          processJsFile(filePath)
        }
      })
    }

    processDir(this.outputDir)
  }

  // 压缩图片
  async compressImages() {
    // 这里可以集成图片压缩工具
    console.log('图片压缩功能需要集成第三方工具')
  }

  // 生成构建报告
  async generateBuildReport() {
    const getDirectorySize = (dir) => {
      let size = 0
      
      if (!fs.existsSync(dir)) return size
      
      const files = fs.readdirSync(dir)
      
      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          size += getDirectorySize(filePath)
        } else {
          size += stat.size
        }
      })
      
      return size
    }

    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B'
      
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const totalSize = getDirectorySize(this.outputDir)
    const jsSize = getDirectorySize(path.join(this.outputDir, 'pages')) + 
                   getDirectorySize(path.join(this.outputDir, 'components')) +
                   getDirectorySize(path.join(this.outputDir, 'utils'))
    const imageSize = getDirectorySize(path.join(this.outputDir, 'images'))

    const report = {
      buildTime: new Date().toISOString(),
      totalSize: formatSize(totalSize),
      breakdown: {
        javascript: formatSize(jsSize),
        images: formatSize(imageSize),
        other: formatSize(totalSize - jsSize - imageSize)
      },
      files: this.getFileList(this.outputDir),
      warnings: this.getBuildWarnings()
    }

    // 保存构建报告
    fs.writeFileSync(
      path.join(this.outputDir, 'build-report.json'),
      JSON.stringify(report, null, 2)
    )

    console.log(`构建报告已生成，总大小: ${report.totalSize}`)
    return report
  }

  // 获取文件列表
  getFileList(dir, basePath = '') {
    const files = []
    
    if (!fs.existsSync(dir)) return files
    
    const items = fs.readdirSync(dir)
    
    items.forEach(item => {
      const itemPath = path.join(dir, item)
      const relativePath = path.join(basePath, item)
      const stat = fs.statSync(itemPath)
      
      if (stat.isDirectory()) {
        files.push(...this.getFileList(itemPath, relativePath))
      } else {
        files.push({
          path: relativePath,
          size: stat.size,
          type: path.extname(item).slice(1) || 'unknown'
        })
      }
    })
    
    return files
  }

  // 获取构建警告
  getBuildWarnings() {
    const warnings = []
    
    // 检查包大小
    const totalSize = this.getDirectorySize(this.outputDir)
    if (totalSize > 2 * 1024 * 1024) { // 2MB
      warnings.push({
        type: 'size',
        message: '包大小超过 2MB，建议优化'
      })
    }
    
    // 检查图片数量
    const imageFiles = this.getFileList(this.outputDir)
      .filter(file => ['jpg', 'jpeg', 'png', 'gif'].includes(file.type))
    
    if (imageFiles.length > 50) {
      warnings.push({
        type: 'images',
        message: `图片文件过多 (${imageFiles.length} 个)，建议优化`
      })
    }
    
    return warnings
  }

  // 获取目录大小
  getDirectorySize(dir) {
    let size = 0
    
    if (!fs.existsSync(dir)) return size
    
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        size += this.getDirectorySize(filePath)
      } else {
        size += stat.size
      }
    })
    
    return size
  }
}

module.exports = new BuildManager()
```

## 📱 小程序发布

### 发布流程

```javascript
// utils/publishManager.js
class PublishManager {
  constructor() {
    this.publishConfig = this.loadPublishConfig()
    this.publishHistory = this.loadPublishHistory()
  }

  // 加载发布配置
  loadPublishConfig() {
    try {
      return require('../publish.config.js')
    } catch (error) {
      return {
        appId: '',
        environments: {
          development: {
            version: '开发版',
            description: '开发测试版本'
          },
          trial: {
            version: '体验版',
            description: '内部体验版本'
          },
          production: {
            version: '正式版',
            description: '正式发布版本'
          }
        }
      }
    }
  }

  // 预发布检查
  async prePublishCheck() {
    console.log('开始预发布检查...')
    
    const checks = [
      { name: '代码质量检查', fn: this.checkCodeQuality },
      { name: '资源文件检查', fn: this.checkAssets },
      { name: '配置文件检查', fn: this.checkConfigurations },
      { name: '权限配置检查', fn: this.checkPermissions },
      { name: '网络域名检查', fn: this.checkDomains },
      { name: '包大小检查', fn: this.checkPackageSize }
    ]

    const results = []
    
    for (const check of checks) {
      try {
        const result = await check.fn.call(this)
        results.push({
          name: check.name,
          passed: result.passed,
          issues: result.issues || [],
          warnings: result.warnings || []
        })
        
        console.log(`✓ ${check.name}: ${result.passed ? '通过' : '发现问题'}`)
      } catch (error) {
        console.error(`检查 ${check.name} 时出错:`, error)
        results.push({
          name: check.name,
          passed: false,
          error: error.message
        })
      }
    }

    const allPassed = results.every(result => result.passed)
    
    return {
      passed: allPassed,
      results,
      summary: this.generateCheckSummary(results)
    }
  }

  // 代码质量检查
  async checkCodeQuality() {
    const issues = []
    const warnings = []
    
    // 检查是否有 console.log
    const hasConsoleLog = await this.searchInFiles(/console\.log/g, ['js'])
    if (hasConsoleLog.length > 0) {
      warnings.push({
        type: 'console_log',
        message: `发现 ${hasConsoleLog.length} 处 console.log`,
        files: hasConsoleLog
      })
    }

    // 检查是否有 debugger
    const hasDebugger = await this.searchInFiles(/debugger/g, ['js'])
    if (hasDebugger.length > 0) {
      issues.push({
        type: 'debugger',
        message: `发现 ${hasDebugger.length} 处 debugger 语句`,
        files: hasDebugger
      })
    }

    // 检查是否有 TODO 注释
    const hasTodo = await this.searchInFiles(/TODO|FIXME|HACK/gi, ['js', 'wxml', 'wxss'])
    if (hasTodo.length > 0) {
      warnings.push({
        type: 'todo',
        message: `发现 ${hasTodo.length} 处待办事项`,
        files: hasTodo
      })
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 资源文件检查
  async checkAssets() {
    const issues = []
    const warnings = []
    
    // 检查图片文件大小
    const imageFiles = await this.getFilesByExtension(['jpg', 'jpeg', 'png', 'gif'])
    const largeImages = imageFiles.filter(file => file.size > 500 * 1024) // 500KB
    
    if (largeImages.length > 0) {
      warnings.push({
        type: 'large_images',
        message: `发现 ${largeImages.length} 个大图片文件`,
        files: largeImages.map(f => ({ path: f.path, size: f.size }))
      })
    }

    // 检查未使用的图片
    const unusedImages = await this.findUnusedAssets(imageFiles)
    if (unusedImages.length > 0) {
      warnings.push({
        type: 'unused_images',
        message: `发现 ${unusedImages.length} 个未使用的图片`,
        files: unusedImages
      })
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 配置文件检查
  async checkConfigurations() {
    const issues = []
    const warnings = []
    
    // 检查 app.json
    const appConfig = await this.loadJsonFile('./app.json')
    if (!appConfig) {
      issues.push({
        type: 'missing_config',
        message: 'app.json 文件不存在或格式错误'
      })
    } else {
      // 检查必要配置
      if (!appConfig.pages || appConfig.pages.length === 0) {
        issues.push({
          type: 'no_pages',
          message: 'app.json 中未配置页面'
        })
      }

      if (!appConfig.window) {
        warnings.push({
          type: 'no_window_config',
          message: '建议配置全局窗口样式'
        })
      }
    }

    // 检查 project.config.json
    const projectConfig = await this.loadJsonFile('./project.config.json')
    if (!projectConfig) {
      warnings.push({
        type: 'no_project_config',
        message: '缺少 project.config.json 文件'
      })
    } else {
      if (!projectConfig.appid) {
        issues.push({
          type: 'no_appid',
          message: 'project.config.json 中未配置 appid'
        })
      }
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 权限配置检查
  async checkPermissions() {
    const issues = []
    const warnings = []
    
    const appConfig = await this.loadJsonFile('./app.json')
    if (!appConfig) {
      return { passed: false, issues: [{ message: '无法读取 app.json' }] }
    }

    // 检查权限配置
    const usedApis = await this.findUsedApis()
    const requiredPermissions = this.getRequiredPermissions(usedApis)
    
    requiredPermissions.forEach(permission => {
      if (!appConfig.permission || !appConfig.permission[permission.scope]) {
        warnings.push({
          type: 'missing_permission',
          message: `使用了 ${permission.api} 但未配置 ${permission.scope} 权限`,
          suggestion: `在 app.json 中添加权限配置`
        })
      }
    })

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 网络域名检查
  async checkDomains() {
    const issues = []
    const warnings = []
    
    // 查找代码中的网络请求
    const networkRequests = await this.findNetworkRequests()
    const domains = [...new Set(networkRequests.map(req => req.domain))]
    
    const appConfig = await this.loadJsonFile('./app.json')
    const configuredDomains = appConfig?.networkTimeout?.request || []
    
    domains.forEach(domain => {
      if (!configuredDomains.includes(domain)) {
        issues.push({
          type: 'unconfigured_domain',
          message: `使用了未配置的域名: ${domain}`,
          suggestion: '在小程序后台配置服务器域名'
        })
      }
    })

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 包大小检查
  async checkPackageSize() {
    const issues = []
    const warnings = []
    
    const packageSize = await this.calculatePackageSize()
    const maxSize = 2 * 1024 * 1024 // 2MB
    
    if (packageSize > maxSize) {
      issues.push({
        type: 'package_too_large',
        message: `代码包大小 ${this.formatSize(packageSize)} 超过限制 ${this.formatSize(maxSize)}`,
        suggestion: '使用分包加载或优化资源'
      })
    } else if (packageSize > maxSize * 0.8) {
      warnings.push({
        type: 'package_large',
        message: `代码包大小 ${this.formatSize(packageSize)} 接近限制`,
        suggestion: '建议优化代码包大小'
      })
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 执行发布
  async publish(environment = 'trial', options = {}) {
    const {
      version,
      description = '',
      skipCheck = false
    } = options

    console.log(`开始发布到 ${environment} 环境...`)

    try {
      // 预发布检查
      if (!skipCheck) {
        const checkResult = await this.prePublishCheck()
        if (!checkResult.passed) {
          throw new Error('预发布检查未通过，请修复问题后重试')
        }
      }

      // 构建项目
      const buildManager = require('../build/build')
      await buildManager.build(environment)

      // 上传代码
      const uploadResult = await this.uploadCode(environment, {
        version,
        description
      })

      // 记录发布历史
      const publishRecord = {
        environment,
        version,
        description,
        timestamp: new Date().toISOString(),
        uploadResult
      }
      
      this.addPublishHistory(publishRecord)

      console.log(`发布到 ${environment} 环境成功！`)
      return publishRecord

    } catch (error) {
      console.error('发布失败:', error)
      throw error
    }
  }

  // 上传代码
  async uploadCode(environment, options) {
    const { version, description } = options
    
    // 这里应该调用微信开发者工具的上传接口
    // 或者使用 miniprogram-ci 工具
    console.log('上传代码到微信服务器...')
    
    // 模拟上传过程
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          version,
          environment,
          uploadTime: new Date().toISOString()
        })
      }, 3000)
    })
  }

  // 提交审核
  async submitForReview(options = {}) {
    const {
      version,
      description = '',
      itemList = []
    } = options

    console.log('提交审核...')

    try {
      // 检查是否已上传体验版
      const latestTrial = this.getLatestPublish('trial')
      if (!latestTrial) {
        throw new Error('请先上传体验版')
      }

      // 提交审核请求
      const submitResult = await this.submitReviewRequest({
        version,
        description,
        itemList
      })

      // 记录审核历史
      const reviewRecord = {
        version,
        description,
        itemList,
        submitTime: new Date().toISOString(),
        status: 'pending',
        submitResult
      }

      this.addReviewHistory(reviewRecord)

      console.log('提交审核成功！')
      return reviewRecord

    } catch (error) {
      console.error('提交审核失败:', error)
      throw error
    }
  }

  // 提交审核请求
  async submitReviewRequest(options) {
    // 这里应该调用微信小程序审核接口
    console.log('向微信提交审核请求...')
    
    // 模拟提交过程
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          auditId: 'audit_' + Date.now(),
          submitTime: new Date().toISOString()
        })
      }, 2000)
    })
  }

  // 发布正式版
  async releaseProduction(version) {
    console.log(`发布正式版 ${version}...`)

    try {
      // 检查审核状态
      const auditStatus = await this.checkAuditStatus(version)
      if (auditStatus !== 'approved') {
        throw new Error(`版本 ${version} 审核状态为 ${auditStatus}，无法发布`)
      }

      // 发布正式版
      const releaseResult = await this.releaseVersion(version)

      // 记录发布历史
      const releaseRecord = {
        version,
        releaseTime: new Date().toISOString(),
        status: 'released',
        releaseResult
      }

      this.addReleaseHistory(releaseRecord)

      console.log(`正式版 ${version} 发布成功！`)
      return releaseRecord

    } catch (error) {
      console.error('发布正式版失败:', error)
      throw error
    }
  }

  // 检查审核状态
  async checkAuditStatus(version) {
    // 这里应该调用微信接口查询审核状态
    console.log(`查询版本 ${version} 审核状态...`)
    
    // 模拟查询过程
    return new Promise((resolve) => {
      setTimeout(() => {
        const statuses = ['pending', 'approved', 'rejected']
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
        resolve(randomStatus)
      }, 1000)
    })
  }

  // 发布版本
  async releaseVersion(version) {
    // 这里应该调用微信接口发布版本
    console.log(`发布版本 ${version}...`)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          version,
          releaseTime: new Date().toISOString()
        })
      }, 1500)
    })
  }

  // 回滚版本
  async rollbackVersion(targetVersion) {
    console.log(`回滚到版本 ${targetVersion}...`)

    try {
      // 检查目标版本是否存在
      const versionExists = this.checkVersionExists(targetVersion)
      if (!versionExists) {
        throw new Error(`版本 ${targetVersion} 不存在`)
      }

      // 执行回滚
      const rollbackResult = await this.performRollback(targetVersion)

      // 记录回滚历史
      const rollbackRecord = {
        targetVersion,
        rollbackTime: new Date().toISOString(),
        reason: '手动回滚',
        rollbackResult
      }

      this.addRollbackHistory(rollbackRecord)

      console.log(`回滚到版本 ${targetVersion} 成功！`)
      return rollbackRecord

    } catch (error) {
      console.error('版本回滚失败:', error)
      throw error
    }
  }

  // 执行回滚
  async performRollback(targetVersion) {
    // 这里应该实现实际的回滚逻辑
    console.log(`执行回滚到版本 ${targetVersion}...`)
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          targetVersion,
          rollbackTime: new Date().toISOString()
        })
      }, 2000)
    })
  }

  // 辅助方法
  async searchInFiles(pattern, extensions) {
    // 实现在文件中搜索的逻辑
    return []
  }

  async getFilesByExtension(extensions) {
    // 实现获取指定扩展名文件的逻辑
    return []
  }

  async findUnusedAssets(assets) {
    // 实现查找未使用资源的逻辑
    return []
  }

  async loadJsonFile(filePath) {
    // 实现加载JSON文件的逻辑
    try {
      const fs = require('fs')
      const content = fs.readFileSync(filePath, 'utf8')
      return JSON.parse(content)
    } catch (error) {
      return null
    }
  }

  async findUsedApis() {
    // 实现查找使用的API的逻辑
    return []
  }

  getRequiredPermissions(apis) {
    // 实现获取所需权限的逻辑
    const permissionMap = {
      'wx.getUserInfo': { scope: 'scope.userInfo', api: 'wx.getUserInfo' },
      'wx.getLocation': { scope: 'scope.userLocation', api: 'wx.getLocation' },
      'wx.chooseImage': { scope: 'scope.writePhotosAlbum', api: 'wx.chooseImage' }
    }
    
    return apis.map(api => permissionMap[api]).filter(Boolean)
  }

  async findNetworkRequests() {
    // 实现查找网络请求的逻辑
    return []
  }

  async calculatePackageSize() {
    // 实现计算包大小的逻辑
    return 0
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  generateCheckSummary(results) {
    const totalChecks = results.length
    const passedChecks = results.filter(r => r.passed).length
    const totalIssues = results.reduce((sum, r) => sum + (r.issues?.length || 0), 0)
    const totalWarnings = results.reduce((sum, r) => sum + (r.warnings?.length || 0), 0)

    return {
      totalChecks,
      passedChecks,
      failedChecks: totalChecks - passedChecks,
      totalIssues,
      totalWarnings,
      overallPassed: totalIssues === 0
    }
  }

  // 历史记录管理
  loadPublishHistory() {
    try {
      const fs = require('fs')
      const historyPath = './publish-history.json'
      
      if (fs.existsSync(historyPath)) {
        return JSON.parse(fs.readFileSync(historyPath, 'utf8'))
      }
    } catch (error) {
      console.warn('无法加载发布历史')
    }
    
    return []
  }

  addPublishHistory(record) {
    this.publishHistory.unshift(record)
    this.savePublishHistory()
  }

  addReviewHistory(record) {
    // 实现添加审核历史的逻辑
  }

  addReleaseHistory(record) {
    // 实现添加发布历史的逻辑
  }

  addRollbackHistory(record) {
    // 实现添加回滚历史的逻辑
  }

  savePublishHistory() {
    try {
      const fs = require('fs')
      const historyPath = './publish-history.json'
      
      fs.writeFileSync(historyPath, JSON.stringify(this.publishHistory, null, 2))
    } catch (error) {
      console.error('保存发布历史失败:', error)
    }
  }

  getLatestPublish(environment) {
    return this.publishHistory.find(record => record.environment === environment)
  }

  checkVersionExists(version) {
    return this.publishHistory.some(record => record.version === version)
  }

  // 获取发布统计
  getPublishStats() {
    const stats = {
      totalPublishes: this.publishHistory.length,
      environments: {},
      recentPublishes: this.publishHistory.slice(0, 5)
    }

    this.publishHistory.forEach(record => {
      if (!stats.environments[record.environment]) {
        stats.environments[record.environment] = 0
      }
      stats.environments[record.environment]++
    })

    return stats
  }
}

module.exports = new PublishManager()
```

## 🔧 CI/CD 集成

### 自动化部署

```javascript
// scripts/deploy.js
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

class CIDeployment {
  constructor() {
    this.config = this.loadDeployConfig()
    this.buildManager = require('../build/build')
    this.publishManager = require('../utils/publishManager')
  }

  // 加载部署配置
  loadDeployConfig() {
    try {
      return require('../deploy.config.js')
    } catch (error) {
      return {
        branches: {
          develop: 'development',
          staging: 'trial',
          master: 'production'
        },
        autoTest: true,
        notifications: {
          slack: '',
          email: []
        }
      }
    }
  }

  // 执行 CI/CD 流程
  async runCIPipeline(branch, commitHash) {
    console.log(`开始 CI/CD 流程 - 分支: ${branch}, 提交: ${commitHash}`)

    try {
      const environment = this.getEnvironmentByBranch(branch)
      if (!environment) {
        console.log(`分支 ${branch} 不需要自动部署`)
        return
      }

      // 1. 代码检查
      await this.runCodeChecks()

      // 2. 运行测试
      if (this.config.autoTest) {
        await this.runTests()
      }

      // 3. 构建项目
      await this.buildProject(environment)

      // 4. 部署
      await this.deployToEnvironment(environment, {
        branch,
        commitHash,
        version: this.generateVersion(branch, commitHash)
      })

      // 5. 发送通知
      await this.sendNotification('success', {
        branch,
        environment,
        commitHash
      })

      console.log('CI/CD 流程完成')

    } catch (error) {
      console.error('CI/CD 流程失败:', error)
      
      await this.sendNotification('failure', {
        branch,
        error: error.message
      })
      
      throw error
    }
  }

  // 根据分支获取环境
  getEnvironmentByBranch(branch) {
    return this.config.branches[branch]
  }

  // 运行代码检查
  async runCodeChecks() {
    console.log('运行代码检查...')
    
    try {
      // ESLint 检查
      execSync('npx eslint . --ext .js', { stdio: 'inherit' })
      
      // 代码格式检查
      execSync('npx prettier --check "**/*.{js,json,md}"', { stdio: 'inherit' })
      
      console.log('代码检查通过')
    } catch (error) {
      throw new Error('代码检查失败')
    }
  }

  // 运行测试
  async runTests() {
    console.log('运行测试...')
    
    try {
      // 单元测试
      execSync('npm run test', { stdio: 'inherit' })
      
      // 集成测试
      execSync('npm run test:integration', { stdio: 'inherit' })
      
      console.log('测试通过')
    } catch (error) {
      throw new Error('测试失败')
    }
  }

  // 构建项目
  async buildProject(environment) {
    console.log(`构建 ${environment} 环境...`)
    
    const buildResult = await this.buildManager.build(environment)
    
    if (buildResult.warnings && buildResult.warnings.length > 0) {
      console.warn('构建警告:', buildResult.warnings)
    }
    
    console.log('构建完成')
    return buildResult
  }

  // 部署到环境
  async deployToEnvironment(environment, metadata) {
    console.log(`部署到 ${environment} 环境...`)
    
    const deployResult = await this.publishManager.publish(environment, {
      version: metadata.version,
      description: `自动部署 - 分支: ${metadata.branch}, 提交: ${metadata.commitHash}`
    })
    
    console.log('部署完成')
    return deployResult
  }

  // 生成版本号
  generateVersion(branch, commitHash) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const shortHash = commitHash.substring(0, 7)
    
    return `${branch}-${timestamp}-${shortHash}`
  }

  // 发送通知
  async sendNotification(status, data) {
    const { notifications } = this.config
    
    if (notifications.slack) {
      await this.sendSlackNotification(status, data)
    }
    
    if (notifications.email && notifications.email.length > 0) {
      await this.sendEmailNotification(status, data)
    }
  }

  // 发送 Slack 通知
  async sendSlackNotification(status, data) {
    // 实现 Slack 通知逻辑
    console.log(`发送 Slack 通知: ${status}`)
  }

  // 发送邮件通知
  async sendEmailNotification(status, data) {
    // 实现邮件通知逻辑
    console.log(`发送邮件通知: ${status}`)
  }

  // 健康检查
  async healthCheck(environment) {
    console.log(`执行 ${environment} 环境健康检查...`)
    
    const checks = [
      { name: '服务可用性', fn: this.checkServiceAvailability },
      { name: 'API 响应', fn: this.checkApiResponse },
      { name: '数据库连接', fn: this.checkDatabaseConnection }
    ]

    const results = []
    
    for (const check of checks) {
      try {
        const result = await check.fn.call(this, environment)
        results.push({
          name: check.name,
          status: 'passed',
          result
        })
      } catch (error) {
        results.push({
          name: check.name,
          status: 'failed',
          error: error.message
        })
      }
    }

    const allPassed = results.every(r => r.status === 'passed')
    
    return {
      passed: allPassed,
      results
    }
  }

  // 检查服务可用性
  async checkServiceAvailability(environment) {
    // 实现服务可用性检查
    return { available: true }
  }

  // 检查 API 响应
  async checkApiResponse(environment) {
    // 实现 API 响应检查
    return { responseTime: 200 }
  }

  // 检查数据库连接
  async checkDatabaseConnection(environment) {
    // 实现数据库连接检查
    return { connected: true }
  }
}

module.exports = new CIDeployment()
```

### GitHub Actions 配置

```yaml
# .github/workflows/deploy.yml
name: 小程序自动部署

on:
  push:
    branches: [ develop, staging, master ]
  pull_request:
    branches: [ master ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: 安装依赖
      run: npm ci
    
    - name: 代码检查
      run: |
        npm run lint
        npm run format:check
    
    - name: 运行测试
      run: |
        npm run test
        npm run test:coverage
    
    - name: 上传测试覆盖率
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: 安装依赖
      run: npm ci
    
    - name: 构建项目
      run: npm run build
      env:
        NODE_ENV: production
    
    - name: 上传构建产物
      uses: actions/upload-artifact@v3
      with:
        name: build-files
        path: dist/

  deploy-dev:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 下载构建产物
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: 部署到开发环境
      run: |
        npm run deploy:dev
      env:
        MINIPROGRAM_APPID: ${{ secrets.MINIPROGRAM_APPID }}
        MINIPROGRAM_PRIVATE_KEY: ${{ secrets.MINIPROGRAM_PRIVATE_KEY }}

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 下载构建产物
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: 部署到体验版
      run: |
        npm run deploy:staging
      env:
        MINIPROGRAM_APPID: ${{ secrets.MINIPROGRAM_APPID }}
        MINIPROGRAM_PRIVATE_KEY: ${{ secrets.MINIPROGRAM_PRIVATE_KEY }}

  deploy-prod:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/master'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: 下载构建产物
      uses: actions/download-artifact@v3
      with:
        name: build-files
        path: dist/
    
    - name: 部署到生产环境
      run: |
        npm run deploy:prod
      env:
        MINIPROGRAM_APPID: ${{ secrets.MINIPROGRAM_APPID }}
        MINIPROGRAM_PRIVATE_KEY: ${{ secrets.MINIPROGRAM_PRIVATE_KEY }}
    
    - name: 创建 Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: v${{ github.run_number }}
        release_name: Release v${{ github.run_number }}
        body: |
          自动发布版本 v${{ github.run_number }}
          
          提交: ${{ github.sha }}
          分支: ${{ github.ref }}
        draft: false
        prerelease: false
```

## 📊 监控与维护

### 发布监控

```javascript
// utils/deploymentMonitor.js
class DeploymentMonitor {
  constructor() {
    this.metrics = {
      deployments: [],
      errors: [],
      performance: []
    }
    
    this.alerts = {
      failureRate: 0.1, // 10% 失败率阈值
      responseTime: 3000, // 3秒响应时间阈值
      errorCount: 10 // 错误数量阈值
    }
  }

  // 记录部署指标
  recordDeployment(deployment) {
    this.metrics.deployments.push({
      ...deployment,
      timestamp: new Date().toISOString()
    })
    
    // 保持最近100次部署记录
    if (this.metrics.deployments.length > 100) {
      this.metrics.deployments = this.metrics.deployments.slice(-100)
    }
    
    this.checkAlerts()
  }

  // 记录错误
  recordError(error) {
    this.metrics.errors.push({
      ...error,
      timestamp: new Date().toISOString()
    })
    
    // 保持最近100个错误记录
    if (this.metrics.errors.length > 100) {
      this.metrics.errors = this.metrics.errors.slice(-100)
    }
    
    this.checkAlerts()
  }

  // 记录性能指标
  recordPerformance(metric) {
    this.metrics.performance.push({
      ...metric,
      timestamp: new Date().toISOString()
    })
    
    // 保持最近100个性能记录
    if (this.metrics.performance.length > 100) {
      this.metrics.performance = this.metrics.performance.slice(-100)
    }
    
    this.checkAlerts()
  }

  // 检查告警
  checkAlerts() {
    const recentDeployments = this.getRecentDeployments(24) // 最近24小时
    const recentErrors = this.getRecentErrors(1) // 最近1小时
    const recentPerformance = this.getRecentPerformance(1) // 最近1小时

    // 检查失败率
    if (recentDeployments.length > 0) {
      const failureRate = recentDeployments.filter(d => !d.success).length / recentDeployments.length
      if (failureRate > this.alerts.failureRate) {
        this.triggerAlert('high_failure_rate', {
          rate: failureRate,
          threshold: this.alerts.failureRate
        })
      }
    }

    // 检查错误数量
    if (recentErrors.length > this.alerts.errorCount) {
      this.triggerAlert('high_error_count', {
        count: recentErrors.length,
        threshold: this.alerts.errorCount
      })
    }

    // 检查响应时间
    if (recentPerformance.length > 0) {
      const avgResponseTime = recentPerformance.reduce((sum, p) => sum + p.responseTime, 0) / recentPerformance.length
      if (avgResponseTime > this.alerts.responseTime) {
        this.triggerAlert('slow_response', {
          responseTime: avgResponseTime,
          threshold: this.alerts.responseTime
        })
      }
    }
  }

  // 触发告警
  triggerAlert(type, data) {
    const alert = {
      type,
      data,
      timestamp: new Date().toISOString(),
      severity: this.getAlertSeverity(type)
    }

    console.warn('触发告警:', alert)
    
    // 发送告警通知
    this.sendAlert(alert)
  }

  // 获取告警严重程度
  getAlertSeverity(type) {
    const severityMap = {
      high_failure_rate: 'critical',
      high_error_count: 'warning',
      slow_response: 'info'
    }
    
    return severityMap[type] || 'info'
  }

  // 发送告警
  async sendAlert(alert) {
    // 实现告警发送逻辑（邮件、短信、Slack等）
    console.log('发送告警通知:', alert)
  }

  // 获取最近的部署记录
  getRecentDeployments(hours) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return this.metrics.deployments.filter(d => new Date(d.timestamp) > cutoff)
  }

  // 获取最近的错误记录
  getRecentErrors(hours) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return this.metrics.errors.filter(e => new Date(e.timestamp) > cutoff)
  }

  // 获取最近的性能记录
  getRecentPerformance(hours) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return this.metrics.performance.filter(p => new Date(p.timestamp) > cutoff)
  }

  // 生成监控报告
  generateReport() {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const deployments24h = this.getRecentDeployments(24)
    const deployments7d = this.metrics.deployments.filter(d => new Date(d.timestamp) > last7d)
    
    const errors24h = this.getRecentErrors(24)
    const performance24h = this.getRecentPerformance(24)

    return {
      summary: {
        totalDeployments: this.metrics.deployments.length,
        deploymentsLast24h: deployments24h.length,
        deploymentsLast7d: deployments7d.length,
        successRate24h: deployments24h.length > 0 ? 
          (deployments24h.filter(d => d.success).length / deployments24h.length * 100).toFixed(2) + '%' : 'N/A',
        errorsLast24h: errors24h.length,
        avgResponseTime24h: performance24h.length > 0 ?
          (performance24h.reduce((sum, p) => sum + p.responseTime, 0) / performance24h.length).toFixed(0) + 'ms' : 'N/A'
      },
      deployments: {
        recent: deployments24h.slice(-10),
        byEnvironment: this.groupByEnvironment(deployments7d),
        trends: this.calculateTrends(deployments7d)
      },
      errors: {
        recent: errors24h.slice(-10),
        byType: this.groupByType(errors24h),
        topErrors: this.getTopErrors(errors24h)
      },
      performance: {
        responseTime: this.calculatePerformanceStats(performance24h, 'responseTime'),
        throughput: this.calculatePerformanceStats(performance24h, 'throughput'),
        trends: this.calculatePerformanceTrends(performance24h)
      },
      generatedAt: now.toISOString()
    }
  }

  // 按环境分组
  groupByEnvironment(deployments) {
    return deployments.reduce((groups, deployment) => {
      const env = deployment.environment || 'unknown'
      if (!groups[env]) {
        groups[env] = []
      }
      groups[env].push(deployment)
      return groups
    }, {})
  }

  // 按类型分组
  groupByType(errors) {
    return errors.reduce((groups, error) => {
      const type = error.type || 'unknown'
      if (!groups[type]) {
        groups[type] = 0
      }
      groups[type]++
      return groups
    }, {})
  }

  // 获取最常见错误
  getTopErrors(errors) {
    const errorCounts = this.groupByType(errors)
    return Object.entries(errorCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }))
  }

  // 计算趋势
  calculateTrends(deployments) {
    // 简单的趋势计算逻辑
    const daily = {}
    
    deployments.forEach(deployment => {
      const date = deployment.timestamp.split('T')[0]
      if (!daily[date]) {
        daily[date] = { total: 0, success: 0 }
      }
      daily[date].total++
      if (deployment.success) {
        daily[date].success++
      }
    })
    
    return Object.entries(daily).map(([date, stats]) => ({
      date,
      total: stats.total,
      success: stats.success,
      successRate: (stats.success / stats.total * 100).toFixed(2)
    }))
  }

  // 计算性能统计
  calculatePerformanceStats(metrics, field) {
    if (metrics.length === 0) {
      return { min: 0, max: 0, avg: 0, p95: 0 }
    }

    const values = metrics.map(m => m[field]).filter(v => v !== undefined).sort((a, b) => a - b)
    
    if (values.length === 0) {
      return { min: 0, max: 0, avg: 0, p95: 0 }
    }

    const min = values[0]
    const max = values[values.length - 1]
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length
    const p95Index = Math.floor(values.length * 0.95)
    const p95 = values[p95Index] || values[values.length - 1]

    return {
      min: min.toFixed(2),
      max: max.toFixed(2),
      avg: avg.toFixed(2),
      p95: p95.toFixed(2)
    }
  }

  // 计算性能趋势
  calculatePerformanceTrends(metrics) {
    // 按小时分组计算趋势
    const hourly = {}
    
    metrics.forEach(metric => {
      const hour = metric.timestamp.substring(0, 13) // YYYY-MM-DDTHH
      if (!hourly[hour]) {
        hourly[hour] = []
      }
      hourly[hour].push(metric.responseTime)
    })
    
    return Object.entries(hourly).map(([hour, times]) => ({
      hour,
      avgResponseTime: (times.reduce((sum, t) => sum + t, 0) / times.length).toFixed(2),
      count: times.length
    }))
  }
}

module.exports = new DeploymentMonitor()
```

## 📚 相关文档

- [代码审核](./code-review.md)
- [版本管理](./version-control.md)
- [性能优化](./performance.md)
- [项目结构](./project-structure.md)

---

通过完整的发布部署流程，确保小程序稳定上线！🚀
# 发布部署

掌握小程序发布部署的完整流程，从开发到上线的每个环节。

## 🚀 发布准备

### 版本管理

```javascript
// utils/versionManager.js
class VersionManager {
  constructor() {
    this.currentVersion = this.getCurrentVersion()
    this.versionHistory = this.loadVersionHistory()
  }

  // 获取当前版本
  getCurrentVersion() {
    try {
      const packageInfo = require('../package.json')
      return packageInfo.version || '1.0.0'
    } catch (error) {
      console.warn('无法读取版本信息，使用默认版本')
      return '1.0.0'
    }
  }

  // 版本号递增
  incrementVersion(type = 'patch') {
    const [major, minor, patch] = this.currentVersion.split('.').map(Number)
    
    let newVersion
    switch (type) {
      case 'major':
        newVersion = `${major + 1}.0.0`
        break
      case 'minor':
        newVersion = `${major}.${minor + 1}.0`
        break
      case 'patch':
      default:
        newVersion = `${major}.${minor}.${patch + 1}`
        break
    }
    
    this.currentVersion = newVersion
    this.updatePackageVersion(newVersion)
    this.addVersionHistory(newVersion)
    
    return newVersion
  }

  // 更新 package.json 版本
  updatePackageVersion(version) {
    try {
      const fs = require('fs')
      const packagePath = './package.json'
      const packageInfo = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
      
      packageInfo.version = version
      
      fs.writeFileSync(packagePath, JSON.stringify(packageInfo, null, 2))
      console.log(`版本已更新至 ${version}`)
    } catch (error) {
      console.error('更新版本失败:', error)
    }
  }

  // 添加版本历史记录
  addVersionHistory(version, description = '') {
    const versionInfo = {
      version,
      description,
      timestamp: new Date().toISOString(),
      features: [],
      bugfixes: [],
      breaking: []
    }
    
    this.versionHistory.unshift(versionInfo)
    this.saveVersionHistory()
    
    return versionInfo
  }

  // 加载版本历史
  loadVersionHistory() {
    try {
      const fs = require('fs')
      const historyPath = './version-history.json'
      
      if (fs.existsSync(historyPath)) {
        return JSON.parse(fs.readFileSync(historyPath, 'utf8'))
      }
    } catch (error) {
      console.warn('无法加载版本历史')
    }
    
    return []
  }

  // 保存版本历史
  saveVersionHistory() {
    try {
      const fs = require('fs')
      const historyPath = './version-history.json'
      
      fs.writeFileSync(historyPath, JSON.stringify(this.versionHistory, null, 2))
    } catch (error) {
      console.error('保存版本历史失败:', error)
    }
  }

  // 生成更新日志
  generateChangelog() {
    let changelog = '# 更新日志\n\n'
    
    this.versionHistory.forEach(version => {
      changelog += `## ${version.version} (${version.timestamp.split('T')[0]})\n\n`
      
      if (version.description) {
        changelog += `${version.description}\n\n`
      }
      
      if (version.features.length > 0) {
        changelog += '### ✨ 新功能\n'
        version.features.forEach(feature => {
          changelog += `- ${feature}\n`
        })
        changelog += '\n'
      }
      
      if (version.bugfixes.length > 0) {
        changelog += '### 🐛 问题修复\n'
        version.bugfixes.forEach(fix => {
          changelog += `- ${fix}\n`
        })
        changelog += '\n'
      }
      
      if (version.breaking.length > 0) {
        changelog += '### ⚠️ 破坏性变更\n'
        version.breaking.forEach(change => {
          changelog += `- ${change}\n`
        })
        changelog += '\n'
      }
    })
    
    return changelog
  }

  // 创建发布标签
  createReleaseTag(version, message) {
    const tagInfo = {
      version,
      message,
      timestamp: new Date().toISOString(),
      commit: this.getCurrentCommit(),
      author: this.getCurrentUser()
    }
    
    console.log(`创建发布标签: v${version}`)
    return tagInfo
  }

  // 获取当前提交
  getCurrentCommit() {
    // 这里可以集成 Git 命令获取当前提交哈希
    return 'abc123def456'
  }

  // 获取当前用户
  getCurrentUser() {
    // 这里可以获取当前用户信息
    return 'developer'
  }

  // 比较版本
  compareVersions(version1, version2) {
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

  // 获取版本统计
  getVersionStats() {
    return {
      currentVersion: this.currentVersion,
      totalVersions: this.versionHistory.length,
      latestRelease: this.versionHistory[0],
      releaseFrequency: this.calculateReleaseFrequency()
    }
  }

  // 计算发布频率
  calculateReleaseFrequency() {
    if (this.versionHistory.length < 2) {
      return 0
    }
    
    const firstRelease = new Date(this.versionHistory[this.versionHistory.length - 1].timestamp)
    const lastRelease = new Date(this.versionHistory[0].timestamp)
    const daysDiff = (lastRelease - firstRelease) / (1000 * 60 * 60 * 24)
    
    return Math.round(daysDiff / this.versionHistory.length)
  }
}

module.exports = new VersionManager()
```

### 构建配置

```javascript
// build/build.js
const fs = require('fs')
const path = require('path')

class BuildManager {
  constructor() {
    this.buildConfig = this.loadBuildConfig()
    this.outputDir = './dist'
    this.sourceDir = './src'
  }

  // 加载构建配置
  loadBuildConfig() {
    try {
      return require('../build.config.js')
    } catch (error) {
      console.warn('使用默认构建配置')
      return {
        minify: true,
        sourcemap: false,
        target: 'production',
        optimization: {
          removeConsole: true,
          removeDebugger: true,
          compressImages: true
        }
      }
    }
  }

  // 执行构建
  async build(environment = 'production') {
    console.log(`开始构建 ${environment} 环境...`)
    
    try {
      // 清理输出目录
      await this.cleanOutputDir()
      
      // 复制源文件
      await this.copySourceFiles()
      
      // 处理配置文件
      await this.processConfigFiles(environment)
      
      // 优化资源
      await this.optimizeAssets()
      
      // 生成构建报告
      const buildReport = await this.generateBuildReport()
      
      console.log('构建完成！')
      return buildReport
      
    } catch (error) {
      console.error('构建失败:', error)
      throw error
    }
  }

  // 清理输出目录
  async cleanOutputDir() {
    if (fs.existsSync(this.outputDir)) {
      fs.rmSync(this.outputDir, { recursive: true, force: true })
    }
    fs.mkdirSync(this.outputDir, { recursive: true })
    console.log('输出目录已清理')
  }

  // 复制源文件
  async copySourceFiles() {
    const copyFile = (src, dest) => {
      const destDir = path.dirname(dest)
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true })
      }
      fs.copyFileSync(src, dest)
    }

    const copyDir = (srcDir, destDir) => {
      if (!fs.existsSync(srcDir)) return
      
      const files = fs.readdirSync(srcDir)
      
      files.forEach(file => {
        const srcPath = path.join(srcDir, file)
        const destPath = path.join(destDir, file)
        
        if (fs.statSync(srcPath).isDirectory()) {
          copyDir(srcPath, destPath)
        } else {
          copyFile(srcPath, destPath)
        }
      })
    }

    // 复制主要目录
    const dirsToopy = ['pages', 'components', 'utils', 'images', 'styles']
    
    dirsToopy.forEach(dir => {
      const srcPath = path.join(this.sourceDir, dir)
      const destPath = path.join(this.outputDir, dir)
      copyDir(srcPath, destPath)
    })

    // 复制根文件
    const filesToCopy = ['app.js', 'app.json', 'app.wxss', 'sitemap.json']
    
    filesToCopy.forEach(file => {
      const srcPath = path.join(this.sourceDir, file)
      const destPath = path.join(this.outputDir, file)
      
      if (fs.existsSync(srcPath)) {
        copyFile(srcPath, destPath)
      }
    })

    console.log('源文件复制完成')
  }

  // 处理配置文件
  async processConfigFiles(environment) {
    const configFiles = [
      { src: 'app.json', processor: this.processAppConfig },
      { src: 'project.config.json', processor: this.processProjectConfig }
    ]

    for (const { src, processor } of configFiles) {
      const srcPath = path.join(this.sourceDir, src)
      const destPath = path.join(this.outputDir, src)
      
      if (fs.existsSync(srcPath)) {
        const config = JSON.parse(fs.readFileSync(srcPath, 'utf8'))
        const processedConfig = await processor.call(this, config, environment)
        
        fs.writeFileSync(destPath, JSON.stringify(processedConfig, null, 2))
      }
    }

    console.log('配置文件处理完成')
  }

  // 处理 app.json
  processAppConfig(config, environment) {
    // 根据环境调整配置
    if (environment === 'production') {
      // 生产环境移除调试页面
      if (config.pages) {
        config.pages = config.pages.filter(page => !page.includes('debug'))
      }
      
      // 移除开发工具配置
      delete config.debug
    }

    return config
  }

  // 处理 project.config.json
  processProjectConfig(config, environment) {
    if (environment === 'production') {
      // 生产环境优化设置
      config.setting = {
        ...config.setting,
        es6: true,
        postcss: true,
        minified: true,
        newFeature: true
      }
    }

    return config
  }

  // 优化资源
  async optimizeAssets() {
    if (!this.buildConfig.optimization) {
      return
    }

    const { removeConsole, removeDebugger, compressImages } = this.buildConfig.optimization

    // 优化 JavaScript 文件
    if (removeConsole || removeDebugger) {
      await this.optimizeJavaScript({ removeConsole, removeDebugger })
    }

    // 压缩图片
    if (compressImages) {
      await this.compressImages()
    }

    console.log('资源优化完成')
  }

  // 优化 JavaScript
  async optimizeJavaScript(options) {
    const { removeConsole, removeDebugger } = options

    const processJsFile = (filePath) => {
      let content = fs.readFileSync(filePath, 'utf8')
      
      if (removeConsole) {
        // 移除 console 语句
        content = content.replace(/console\.(log|warn|error|info|debug)\([^)]*\);?/g, '')
      }
      
      if (removeDebugger) {
        // 移除 debugger 语句
        content = content.replace(/debugger;?/g, '')
      }
      
      fs.writeFileSync(filePath, content)
    }

    const processDir = (dir) => {
      if (!fs.existsSync(dir)) return
      
      const files = fs.readdirSync(dir)
      
      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          processDir(filePath)
        } else if (file.endsWith('.js')) {
          processJsFile(filePath)
        }
      })
    }

    processDir(this.outputDir)
  }

  // 压缩图片
  async compressImages() {
    // 这里可以集成图片压缩工具
    console.log('图片压缩功能需要集成第三方工具')
  }

  // 生成构建报告
  async generateBuildReport() {
    const getDirectorySize = (dir) => {
      let size = 0
      
      if (!fs.existsSync(dir)) return size
      
      const files = fs.readdirSync(dir)
      
      files.forEach(file => {
        const filePath = path.join(dir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isDirectory()) {
          size += getDirectorySize(filePath)
        } else {
          size += stat.size
        }
      })
      
      return size
    }

    const formatSize = (bytes) => {
      if (bytes === 0) return '0 B'
      
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const totalSize = getDirectorySize(this.outputDir)
    const jsSize = getDirectorySize(path.join(this.outputDir, 'pages')) + 
                   getDirectorySize(path.join(this.outputDir, 'components')) +
                   getDirectorySize(path.join(this.outputDir, 'utils'))
    const imageSize = getDirectorySize(path.join(this.outputDir, 'images'))

    const report = {
      buildTime: new Date().toISOString(),
      totalSize: formatSize(totalSize),
      breakdown: {
        javascript: formatSize(jsSize),
        images: formatSize(imageSize),
        other: formatSize(totalSize - jsSize - imageSize)
      },
      files: this.getFileList(this.outputDir),
      warnings: this.getBuildWarnings()
    }

    // 保存构建报告
    fs.writeFileSync(
      path.join(this.outputDir, 'build-report.json'),
      JSON.stringify(report, null, 2)
    )

    console.log(`构建报告已生成，总大小: ${report.totalSize}`)
    return report
  }

  // 获取文件列表
  getFileList(dir, basePath = '') {
    const files = []
    
    if (!fs.existsSync(dir)) return files
    
    const items = fs.readdirSync(dir)
    
    items.forEach(item => {
      const itemPath = path.join(dir, item)
      const relativePath = path.join(basePath, item)
      const stat = fs.statSync(itemPath)
      
      if (stat.isDirectory()) {
        files.push(...this.getFileList(itemPath, relativePath))
      } else {
        files.push({
          path: relativePath,
          size: stat.size,
          type: path.extname(item).slice(1) || 'unknown'
        })
      }
    })
    
    return files
  }

  // 获取构建警告
  getBuildWarnings() {
    const warnings = []
    
    // 检查包大小
    const totalSize = this.getDirectorySize(this.outputDir)
    if (totalSize > 2 * 1024 * 1024) { // 2MB
      warnings.push({
        type: 'size',
        message: '包大小超过 2MB，建议优化'
      })
    }
    
    // 检查图片数量
    const imageFiles = this.getFileList(this.outputDir)
      .filter(file => ['jpg', 'jpeg', 'png', 'gif'].includes(file.type))
    
    if (imageFiles.length > 50) {
      warnings.push({
        type: 'images',
        message: `图片文件过多 (${imageFiles.length} 个)，建议优化`
      })
    }
    
    return warnings
  }

  // 获取目录大小
  getDirectorySize(dir) {
    let size = 0
    
    if (!fs.existsSync(dir)) return size
    
    const files = fs.readdirSync(dir)
    
    files.forEach(file => {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)
      
      if (stat.isDirectory()) {
        size += this.getDirectorySize(filePath)
      } else {
        size += stat.size
      }
    })
    
    return size
  }
}

module.exports = new BuildManager()
```

## 📱 小程序发布

### 发布流程

```javascript
// utils/publishManager.js
class PublishManager {
  constructor() {
    this.publishConfig = this.loadPublishConfig()
    this.publishHistory = this.loadPublishHistory()
  }

  // 加载发布配置
  loadPublishConfig() {
    try {
      return require('../publish.config.js')
    } catch (error) {
      return {
        appId: '',
        environments: {
          development: {
            version: '开发版',
            description: '开发测试版本'
          },
          trial: {
            version: '体验版',
            description: '内部体验版本'
          },
          production: {
            version: '正式版',
            description: '正式发布版本'
          }
        }
      }
    }
  }

  // 预发布检查
  async prePublishCheck() {
    console.log('开始预发布检查...')
    
    const checks = [
      { name: '代码质量检查', fn: this.checkCodeQuality },
      { name: '资源文件检查', fn: this.checkAssets },
      { name: '配置文件检查', fn: this.checkConfigurations },
      { name: '权限配置检查', fn: this.checkPermissions },
      { name: '网络域名检查', fn: this.checkDomains },
      { name: '包大小检查', fn: this.checkPackageSize }
    ]

    const results = []
    
    for (const check of checks) {
      try {
        const result = await check.fn.call(this)
        results.push({
          name: check.name,
          passed: result.passed,
          issues: result.issues || [],
          warnings: result.warnings || []
        })
        
        console.log(`✓ ${check.name}: ${result.passed ? '通过' : '发现问题'}`)
      } catch (error) {
        console.error(`检查 ${check.name} 时出错:`, error)
        results.push({
          name: check.name,
          passed: false,
          error: error.message
        })
      }
    }

    const allPassed = results.every(result => result.passed)
    
    return {
      passed: allPassed,
      results,
      summary: this.generateCheckSummary(results)
    }
  }

  // 代码质量检查
  async checkCodeQuality() {
    const issues = []
    const warnings = []
    
    // 检查是否有 console.log
    const hasConsoleLog = await this.searchInFiles(/console\.log/g, ['js'])
    if (hasConsoleLog.length > 0) {
      warnings.push({
        type: 'console_log',
        message: `发现 ${hasConsoleLog.length} 处 console.log`,
        files: hasConsoleLog
      })
    }

    // 检查是否有 debugger
    const hasDebugger = await this.searchInFiles(/debugger/g, ['js'])
    if (hasDebugger.length > 0) {
      issues.push({
        type: 'debugger',
        message: `发现 ${hasDebugger.length} 处 debugger 语句`,
        files: hasDebugger
      })
    }

    // 检查是否有 TODO 注释
    const hasTodo = await this.searchInFiles(/TODO|FIXME|HACK/gi, ['js', 'wxml', 'wxss'])
    if (hasTodo.length > 0) {
      warnings.push({
        type: 'todo',
        message: `发现 ${hasTodo.length} 处待办事项`,
        files: hasTodo
      })
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 资源文件检查
  async checkAssets() {
    const issues = []
    const warnings = []
    
    // 检查图片文件大小
    const imageFiles = await this.getFilesByExtension(['jpg', 'jpeg', 'png', 'gif'])
    const largeImages = imageFiles.filter(file => file.size > 500 * 1024) // 500KB
    
    if (largeImages.length > 0) {
      warnings.push({
        type: 'large_images',
        message: `发现 ${largeImages.length} 个大图片文件`,
        files: largeImages.map(f => ({ path: f.path, size: f.size }))
      })
    }

    // 检查未使用的图片
    const unusedImages = await this.findUnusedAssets(imageFiles)
    if (unusedImages.length > 0) {
      warnings.push({
        type: 'unused_images',
        message: `发现 ${unusedImages.length} 个未使用的图片`,
        files: unusedImages
      })
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 配置文件检查
  async checkConfigurations() {
    const issues = []
    const warnings = []
    
    // 检查 app.json
    const appConfig = await this.loadJsonFile('./app.json')
    if (!appConfig) {
      issues.push({
        type: 'missing_config',
        message: 'app.json 文件不存在或格式错误'
      })
    } else {
      // 检查必要配置
      if (!appConfig.pages || appConfig.pages.length === 0) {
        issues.push({
          type: 'no_pages',
          message: 'app.json 中未配置页面'
        })
      }

      if (!appConfig.window) {
        warnings.push({
          type: 'no_window_config',
          message: '建议配置全局窗口样式'
        })
      }
    }

    // 检查 project.config.json
    const projectConfig = await this.loadJsonFile('./project.config.json')
    if (!projectConfig) {
      warnings.push({
        type: 'no_project_config',
        message: '缺少 project.config.json 文件'
      })
    } else {
      if (!projectConfig.appid) {
        issues.push({
          type: 'no_appid',
          message: 'project.config.json 中未配置 appid'
        })
      }
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 权限配置检查
  async checkPermissions() {
    const issues = []
    const warnings = []
    
    const appConfig = await this.loadJsonFile('./app.json')
    if (!appConfig) {
      return { passed: false, issues: [{ message: '无法读取 app.json' }] }
    }

    // 检查权限配置
    const usedApis = await this.findUsedApis()
    const requiredPermissions = this.getRequiredPermissions(usedApis)
    
    requiredPermissions.forEach(permission => {
      if (!appConfig.permission || !appConfig.permission[permission.scope]) {
        warnings.push({
          type: 'missing_permission',
          message: `使用了 ${permission.api} 但未配置 ${permission.scope} 权限`,
          suggestion: `在 app.json 中添加权限配置`
        })
      }
    })

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 网络域名检查
  async checkDomains() {
    const issues = []
    const warnings = []
    
    // 查找代码中的网络请求
    const networkRequests = await this.findNetworkRequests()
    const domains = [...new Set(networkRequests.map(req => req.domain))]
    
    const appConfig = await this.loadJsonFile('./app.json')
    const configuredDomains = appConfig?.networkTimeout?.request || []
    
    domains.forEach(domain => {
      if (!configuredDomains.includes(domain)) {
        issues.push({
          type: 'unconfigured_domain',
          message: `使用了未配置的域名: ${domain}`,
          suggestion: '在小程序后台配置服务器域名'
        })
      }
    })

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 包大小检查
  async checkPackageSize() {
    const issues = []
    const warnings = []
    
    const packageSize = await this.calculatePackageSize()
    const maxSize = 2 * 1024 * 1024 // 2MB
    
    if (packageSize > maxSize) {
      issues.push({
        type: 'package_too_large',
        message: `代码包大小 ${this.formatSize(packageSize)} 超过限制 ${this.formatSize(maxSize)}`,
        suggestion: '使用分包加载或优化资源'
      })
    } else if (packageSize > maxSize * 0.8) {
      warnings.push({
        type: 'package_large',
        message: `代码包大小 ${this.formatSize(packageSize)} 接近限制`,
        suggestion: '建议优化代码包大小'
      })
    }

    return {
      passed: issues.length === 0,
      issues,
      warnings
    }
  }

  // 执行发布
  async publish(environment = 'trial', options = {}) {
    const {
      version,
      description = '',
      skipCheck = false
    } = options

    console.log(`开始发布到 ${environment} 环境...`)

    try {
      // 预发布检查
      if (!skipCheck) {
        const checkResult = await this.prePublishCheck()
        if (!checkResult.passed) {
          throw new Error('预发布检查未通过，请修复问题后重试')
        }
      }

      // 构建项目
      const buildManager = require('../build/build')
      await buildManager.build(environment)

      // 上传代码
      const uploadResult = await this.uploadCode(environment, {
        version,
        description
      })

      // 记录发布历史
      const publishRecord = {
        environment,
        version,
        description,
        timestamp: new Date().toISOString(),
        uploadResult
      }
      
      this.addPublishHistory(publishRecord)

      console.log(`发布到 ${environment} 环境成功！`)
      return publishRecord

    } catch (error) {
      console.error('发布失败:', error)
      throw error
    }
  }

  // 上传代码
  async uploadCode(environment, options) {
    const { version, description } = options
    
    // 这里应该调用微信开发者工具的上传接口
    // 或者使用 miniprogram-ci 工具
    console.log('上传代码到微信服务器...')
    
    // 模拟上传过程
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          version,
          environment,
          uploadTime: new Date().toISOString()
        })
      }, 3000)
    })
  }

  // 提交审核
  async submitForReview(options = {}) {
    const {
      version,
      description = '',
      itemList = []
    } = options

    console.log('提交审核...')

    try {
      // 检查是否已上传体验版
      const latestTrial = this.getLatestPublish('trial')
      if (!latestTrial) {
        throw new Error('请先上传体验版')
      }

      // 提交审核请求
      const submitResult = await this.submitReviewRequest({