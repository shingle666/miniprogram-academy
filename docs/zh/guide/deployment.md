# 发布部署

小程序的发布部署是开发流程的最后一环，涉及代码审核、版本管理、灰度发布等多个环节。本章将详细介绍小程序发布部署的完整流程和最佳实践。

## 发布前准备

### 代码质量检查

#### 1. 代码审查清单

```javascript
// 代码质量检查工具
class CodeQualityChecker {
  constructor() {
    this.issues = []
  }
  
  checkCodeQuality(projectPath) {
    console.log('开始代码质量检查...')
    
    this.checkFileStructure(projectPath)
    this.checkCodeStyle(projectPath)
    this.checkPerformance(projectPath)
    this.checkSecurity(projectPath)
    this.checkCompatibility(projectPath)
    
    return this.generateReport()
  }
  
  checkFileStructure(projectPath) {
    const requiredFiles = [
      'app.js',
      'app.json',
      'app.wxss',
      'project.config.json'
    ]
    
    requiredFiles.forEach(file => {
      // 检查必需文件是否存在
      if (!this.fileExists(`${projectPath}/${file}`)) {
        this.addIssue('structure', `缺少必需文件: ${file}`, 'high')
      }
    })
    
    // 检查页面配置
    this.checkPageConfiguration(projectPath)
  }
  
  checkPageConfiguration(projectPath) {
    // 检查 app.json 中的页面配置
    const appConfig = this.readJsonFile(`${projectPath}/app.json`)
    
    if (!appConfig.pages || appConfig.pages.length === 0) {
      this.addIssue('config', 'app.json 中未配置页面', 'high')
    }
    
    // 检查每个页面文件是否存在
    appConfig.pages?.forEach(pagePath => {
      const pageFiles = [
        `${pagePath}.js`,
        `${pagePath}.wxml`,
        `${pagePath}.wxss`,
        `${pagePath}.json`
      ]
      
      pageFiles.forEach(file => {
        if (!this.fileExists(`${projectPath}/${file}`)) {
          this.addIssue('structure', `页面文件缺失: ${file}`, 'medium')
        }
      })
    })
  }
  
  checkCodeStyle(projectPath) {
    // 检查代码风格
    const jsFiles = this.findFiles(projectPath, '.js')
    
    jsFiles.forEach(file => {
      const content = this.readFile(file)
      
      // 检查是否使用了 console.log（生产环境应该移除）
      if (content.includes('console.log')) {
        this.addIssue('style', `${file} 包含 console.log 语句`, 'low')
      }
      
      // 检查是否有未使用的变量
      this.checkUnusedVariables(file, content)
      
      // 检查函数复杂度
      this.checkFunctionComplexity(file, content)
    })
  }
  
  checkPerformance(projectPath) {
    // 检查性能相关问题
    const imageFiles = this.findFiles(projectPath, ['.jpg', '.png', '.gif'])
    
    imageFiles.forEach(file => {
      const fileSize = this.getFileSize(file)
      
      // 检查图片大小
      if (fileSize > 500 * 1024) { // 500KB
        this.addIssue('performance', `图片文件过大: ${file} (${Math.round(fileSize / 1024)}KB)`, 'medium')
      }
    })
    
    // 检查代码包大小
    const packageSize = this.calculatePackageSize(projectPath)
    if (packageSize > 2 * 1024 * 1024) { // 2MB
      this.addIssue('performance', `代码包过大: ${Math.round(packageSize / 1024 / 1024)}MB`, 'high')
    }
  }
  
  checkSecurity(projectPath) {
    // 检查安全相关问题
    const jsFiles = this.findFiles(projectPath, '.js')
    
    jsFiles.forEach(file => {
      const content = this.readFile(file)
      
      // 检查硬编码的敏感信息
      const sensitivePatterns = [
        /password\s*[:=]\s*['"][^'"]+['"]/i,
        /token\s*[:=]\s*['"][^'"]+['"]/i,
        /secret\s*[:=]\s*['"][^'"]+['"]/i,
        /key\s*[:=]\s*['"][^'"]+['"]/i
      ]
      
      sensitivePatterns.forEach(pattern => {
        if (pattern.test(content)) {
          this.addIssue('security', `${file} 可能包含硬编码的敏感信息`, 'high')
        }
      })
    })
  }
  
  checkCompatibility(projectPath) {
    // 检查兼容性问题
    const projectConfig = this.readJsonFile(`${projectPath}/project.config.json`)
    
    if (projectConfig.libVersion) {
      const version = projectConfig.libVersion
      const minVersion = '2.10.0'
      
      if (this.compareVersion(version, minVersion) < 0) {
        this.addIssue('compatibility', `基础库版本过低: ${version}，建议升级到 ${minVersion} 以上`, 'medium')
      }
    }
  }
  
  addIssue(category, message, severity) {
    this.issues.push({
      category: category,
      message: message,
      severity: severity,
      timestamp: new Date().toISOString()
    })
  }
  
  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalIssues: this.issues.length,
      highSeverity: this.issues.filter(i => i.severity === 'high').length,
      mediumSeverity: this.issues.filter(i => i.severity === 'medium').length,
      lowSeverity: this.issues.filter(i => i.severity === 'low').length,
      issues: this.issues,
      passed: this.issues.filter(i => i.severity === 'high').length === 0
    }
    
    console.log('代码质量检查报告:', report)
    return report
  }
  
  // 辅助方法
  fileExists(path) {
    // 实际实现中需要检查文件是否存在
    return true
  }
  
  readFile(path) {
    // 实际实现中需要读取文件内容
    return ''
  }
  
  readJsonFile(path) {
    // 实际实现中需要读取并解析 JSON 文件
    return {}
  }
  
  findFiles(path, extensions) {
    // 实际实现中需要查找指定扩展名的文件
    return []
  }
  
  getFileSize(path) {
    // 实际实现中需要获取文件大小
    return 0
  }
  
  calculatePackageSize(path) {
    // 实际实现中需要计算代码包大小
    return 0
  }
  
  compareVersion(v1, v2) {
    // 版本号比较
    const arr1 = v1.split('.')
    const arr2 = v2.split('.')
    
    for (let i = 0; i < Math.max(arr1.length, arr2.length); i++) {
      const num1 = parseInt(arr1[i] || '0')
      const num2 = parseInt(arr2[i] || '0')
      
      if (num1 > num2) return 1
      if (num1 < num2) return -1
    }
    
    return 0
  }
}

// 使用示例
const checker = new CodeQualityChecker()
const report = checker.checkCodeQuality('./miniprogram')

if (!report.passed) {
  console.error('代码质量检查未通过，请修复以下问题:')
  report.issues.forEach(issue => {
    console.log(`[${issue.severity.toUpperCase()}] ${issue.message}`)
  })
}
```

#### 2. 性能测试

```javascript
// 性能测试工具
class PerformanceTester {
  constructor() {
    this.testResults = []
  }
  
  async runPerformanceTests() {
    console.log('开始性能测试...')
    
    await this.testStartupTime()
    await this.testPageLoadTime()
    await this.testMemoryUsage()
    await this.testNetworkPerformance()
    
    return this.generateReport()
  }
  
  async testStartupTime() {
    console.log('测试启动时间...')
    
    const iterations = 5
    const startupTimes = []
    
    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now()
      
      // 模拟小程序启动
      await this.simulateStartup()
      
      const endTime = Date.now()
      startupTimes.push(endTime - startTime)
    }
    
    const avgStartupTime = startupTimes.reduce((a, b) => a + b, 0) / startupTimes.length
    
    this.testResults.push({
      test: 'startup_time',
      avgTime: avgStartupTime,
      times: startupTimes,
      passed: avgStartupTime < 3000 // 3秒内启动
    })
  }
  
  async testPageLoadTime() {
    console.log('测试页面加载时间...')
    
    const pages = ['pages/index/index', 'pages/profile/profile', 'pages/settings/settings']
    
    for (const page of pages) {
      const loadTimes = []
      
      for (let i = 0; i < 3; i++) {
        const startTime = Date.now()
        await this.simulatePageLoad(page)
        const endTime = Date.now()
        
        loadTimes.push(endTime - startTime)
      }
      
      const avgLoadTime = loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length
      
      this.testResults.push({
        test: 'page_load_time',
        page: page,
        avgTime: avgLoadTime,
        times: loadTimes,
        passed: avgLoadTime < 2000 // 2秒内加载
      })
    }
  }
  
  async testMemoryUsage() {
    console.log('测试内存使用...')
    
    // 模拟内存使用测试
    const memoryUsage = await this.simulateMemoryTest()
    
    this.testResults.push({
      test: 'memory_usage',
      usage: memoryUsage,
      passed: memoryUsage < 50 * 1024 * 1024 // 50MB 以内
    })
  }
  
  async testNetworkPerformance() {
    console.log('测试网络性能...')
    
    const apis = [
      '/api/user/info',
      '/api/data/list',
      '/api/config/settings'
    ]
    
    for (const api of apis) {
      const responseTimes = []
      
      for (let i = 0; i < 5; i++) {
        const startTime = Date.now()
        await this.simulateApiCall(api)
        const endTime = Date.now()
        
        responseTimes.push(endTime - startTime)
      }
      
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
      
      this.testResults.push({
        test: 'api_response_time',
        api: api,
        avgTime: avgResponseTime,
        times: responseTimes,
        passed: avgResponseTime < 1000 // 1秒内响应
      })
    }
  }
  
  generateReport() {
    const passedTests = this.testResults.filter(r => r.passed).length
    const totalTests = this.testResults.length
    
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: totalTests,
      passedTests: passedTests,
      failedTests: totalTests - passedTests,
      passRate: (passedTests / totalTests * 100).toFixed(2) + '%',
      results: this.testResults,
      passed: passedTests === totalTests
    }
    
    console.log('性能测试报告:', report)
    return report
  }
  
  // 模拟方法
  async simulateStartup() {
    return new Promise(resolve => {
      setTimeout(resolve, Math.random() * 1000 + 500)
    })
  }
  
  async simulatePageLoad(page) {
    return new Promise(resolve => {
      setTimeout(resolve, Math.random() * 500 + 200)
    })
  }
  
  async simulateMemoryTest() {
    return Math.random() * 30 * 1024 * 1024 + 20 * 1024 * 1024
  }
  
  async simulateApiCall(api) {
    return new Promise(resolve => {
      setTimeout(resolve, Math.random() * 300 + 100)
    })
  }
}
```

### 配置文件检查

#### 1. 项目配置验证

```javascript
// project.config.json 验证
const validateProjectConfig = (config) => {
  const issues = []
  
  // 检查必需字段
  const requiredFields = ['appid', 'projectname', 'libVersion']
  requiredFields.forEach(field => {
    if (!config[field]) {
      issues.push(`缺少必需字段: ${field}`)
    }
  })
  
  // 检查 appid 格式
  if (config.appid && !/^wx[a-f0-9]{16}$/.test(config.appid)) {
    issues.push('appid 格式不正确')
  }
  
  // 检查基础库版本
  if (config.libVersion) {
    const version = config.libVersion
    const minVersion = '2.10.0'
    
    if (compareVersion(version, minVersion) < 0) {
      issues.push(`基础库版本过低: ${version}，建议升级到 ${minVersion} 以上`)
    }
  }
  
  // 检查编译设置
  if (config.setting) {
    const setting = config.setting
    
    // 生产环境建议设置
    const productionSettings = {
      es6: true,
      postcss: true,
      minified: true,
      urlCheck: true
    }
    
    Object.keys(productionSettings).forEach(key => {
      if (setting[key] !== productionSettings[key]) {
        issues.push(`建议设置 setting.${key} 为 ${productionSettings[key]}`)
      }
    })
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  }
}

// app.json 验证
const validateAppConfig = (config) => {
  const issues = []
  
  // 检查页面配置
  if (!config.pages || config.pages.length === 0) {
    issues.push('未配置页面')
  }
  
  // 检查窗口配置
  if (config.window) {
    const window = config.window
    
    // 检查导航栏配置
    if (!window.navigationBarTitleText) {
      issues.push('建议设置导航栏标题')
    }
    
    if (window.navigationBarBackgroundColor && 
        !/^#[0-9a-fA-F]{6}$/.test(window.navigationBarBackgroundColor)) {
      issues.push('导航栏背景色格式不正确')
    }
  }
  
  // 检查 tabBar 配置
  if (config.tabBar) {
    const tabBar = config.tabBar
    
    if (!tabBar.list || tabBar.list.length < 2 || tabBar.list.length > 5) {
      issues.push('tabBar 列表数量应该在 2-5 个之间')
    }
    
    tabBar.list?.forEach((item, index) => {
      if (!item.pagePath) {
        issues.push(`tabBar 第 ${index + 1} 项缺少 pagePath`)
      }
      if (!item.text) {
        issues.push(`tabBar 第 ${index + 1} 项缺少 text`)
      }
    })
  }
  
  // 检查权限配置
  if (config.permission) {
    Object.keys(config.permission).forEach(key => {
      if (!config.permission[key].desc) {
        issues.push(`权限 ${key} 缺少描述`)
      }
    })
  }
  
  return {
    valid: issues.length === 0,
    issues: issues
  }
}
```

## 版本管理

### 版本号规范

```javascript
// 版本管理工具
class VersionManager {
  constructor() {
    this.currentVersion = this.getCurrentVersion()
  }
  
  getCurrentVersion() {
    // 从 package.json 或其他配置文件读取当前版本
    return '1.0.0'
  }
  
  // 语义化版本控制
  bumpVersion(type = 'patch') {
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
    this.updateVersionFiles(newVersion)
    
    return newVersion
  }
  
  updateVersionFiles(version) {
    // 更新相关文件中的版本号
    console.log(`更新版本号到 ${version}`)
    
    // 更新 package.json
    this.updatePackageJson(version)
    
    // 更新 app.json 中的版本信息（如果有）
    this.updateAppJson(version)
    
    // 创建版本标签
    this.createVersionTag(version)
  }
  
  updatePackageJson(version) {
    // 实际实现中需要读取和更新 package.json
    console.log(`更新 package.json 版本号: ${version}`)
  }
  
  updateAppJson(version) {
    // 实际实现中需要更新 app.json
    console.log(`更新 app.json 版本信息: ${version}`)
  }
  
  createVersionTag(version) {
    // 创建 Git 标签
    console.log(`创建版本标签: v${version}`)
    // 实际实现: git tag v${version}
  }
  
  // 生成版本发布说明
  generateReleaseNotes(version, changes) {
    const releaseNotes = {
      version: version,
      date: new Date().toISOString().split('T')[0],
      changes: changes,
      features: changes.filter(c => c.type === 'feature'),
      bugfixes: changes.filter(c => c.type === 'bugfix'),
      improvements: changes.filter(c => c.type === 'improvement')
    }
    
    const markdown = this.formatReleaseNotes(releaseNotes)
    console.log('发布说明:', markdown)
    
    return releaseNotes
  }
  
  formatReleaseNotes(notes) {
    let markdown = `# 版本 ${notes.version} (${notes.date})\n\n`
    
    if (notes.features.length > 0) {
      markdown += '## 新功能\n'
      notes.features.forEach(feature => {
        markdown += `- ${feature.description}\n`
      })
      markdown += '\n'
    }
    
    if (notes.improvements.length > 0) {
      markdown += '## 改进\n'
      notes.improvements.forEach(improvement => {
        markdown += `- ${improvement.description}\n`
      })
      markdown += '\n'
    }
    
    if (notes.bugfixes.length > 0) {
      markdown += '## 错误修复\n'
      notes.bugfixes.forEach(bugfix => {
        markdown += `- ${bugfix.description}\n`
      })
      markdown += '\n'
    }
    
    return markdown
  }
}

// 使用示例
const versionManager = new VersionManager()

// 发布补丁版本
const newVersion = versionManager.bumpVersion('patch')

// 生成发布说明
const changes = [
  { type: 'feature', description: '新增用户头像上传功能' },
  { type: 'bugfix', description: '修复页面跳转参数丢失问题' },
  { type: 'improvement', description: '优化列表加载性能' }
]

versionManager.generateReleaseNotes(newVersion, changes)
```

### 构建脚本

```javascript
// build.js - 构建脚本
const fs = require('fs')
const path = require('path')

class BuildManager {
  constructor(config = {}) {
    this.config = {
      sourceDir: './src',
      outputDir: './dist',
      environment: 'production',
      ...config
    }
  }
  
  async build() {
    console.log('开始构建...')
    
    try {
      // 清理输出目录
      await this.cleanOutputDir()
      
      // 复制源文件
      await this.copySourceFiles()
      
      // 处理配置文件
      await this.processConfigFiles()
      
      // 压缩代码
      await this.minifyCode()
      
      // 优化资源
      await this.optimizeAssets()
      
      // 生成构建报告
      const report = await this.generateBuildReport()
      
      console.log('构建完成!')
      console.log('构建报告:', report)
      
      return report
    } catch (error) {
      console.error('构建失败:', error)
      throw error
    }
  }
  
  async cleanOutputDir() {
    console.log('清理输出目录...')
    // 实际实现中需要删除输出目录
  }
  
  async copySourceFiles() {
    console.log('复制源文件...')
    // 实际实现中需要复制源文件到输出目录
  }
  
  async processConfigFiles() {
    console.log('处理配置文件...')
    
    // 根据环境更新配置
    const appConfig = this.readJsonFile('./src/app.json')
    
    if (this.config.environment === 'production') {
      // 生产环境配置
      appConfig.debug = false
      
      // 移除开发环境的页面
      if (appConfig.pages) {
        appConfig.pages = appConfig.pages.filter(page => 
          !page.includes('debug') && !page.includes('test')
        )
      }
    }
    
    this.writeJsonFile('./dist/app.json', appConfig)
  }
  
  async minifyCode() {
    console.log('压缩代码...')
    
    // 压缩 JavaScript 文件
    const jsFiles = this.findFiles('./dist', '.js')
    for (const file of jsFiles) {
      await this.minifyJsFile(file)
    }
    
    // 压缩 CSS 文件
    const cssFiles = this.findFiles('./dist', '.wxss')
    for (const file of cssFiles) {
      await this.minifyCssFile(file)
    }
    
    // 压缩 WXML 文件
    const wxmlFiles = this.findFiles('./dist', '.wxml')
    for (const file of wxmlFiles) {
      await this.minifyWxmlFile(file)
    }
  }
  
  async optimizeAssets() {
    console.log('优化资源...')
    
    // 压缩图片
    const imageFiles = this.findFiles('./dist', ['.jpg', '.png', '.gif'])
    for (const file of imageFiles) {
      await this.compressImage(file)
    }
    
    // 转换图片格式
    await this.convertImagesToWebP()
  }
  
  async generateBuildReport() {
    const report = {
      timestamp: new Date().toISOString(),
      environment: this.config.environment,
      sourceDir: this.config.sourceDir,
      outputDir: this.config.outputDir,
      files: {
        total: 0,
        js: 0,
        wxss: 0,
        wxml: 0,
        json: 0,
        images: 0
      },
      size: {
        total: 0,
        beforeOptimization: 0,
        afterOptimization: 0,
        compressionRatio: 0
      }
    }
    
    // 统计文件信息
    const allFiles = this.findFiles('./dist', '*')
    report.files.total = allFiles.length
    
    // 按类型统计
    report.files.js = this.findFiles('./dist', '.js').length
    report.files.wxss = this.findFiles('./dist', '.wxss').length
    report.files.wxml = this.findFiles('./dist', '.wxml').length
    report.files.json = this.findFiles('./dist', '.json').length
    report.files.images = this.findFiles('./dist', ['.jpg', '.png', '.gif', '.webp']).length
    
    // 计算大小
    report.size.total = this.calculateDirectorySize('./dist')
    report.size.compressionRatio = ((report.size.beforeOptimization - report.size.afterOptimization) / report.size.beforeOptimization * 100).toFixed(2) + '%'
    
    return report
  }
  
  // 辅助方法
  readJsonFile(path) {
    // 实际实现中需要读取 JSON 文件
    return {}
  }
  
  writeJsonFile(path, data) {
    // 实际实现中需要写入 JSON 文件
  }
  
  findFiles(dir, extension) {
    // 实际实现中需要查找文件
    return []
  }
  
  async minifyJsFile(file) {
    // 实际实现中需要压缩 JS 文件
  }
  
  async minifyCssFile(file) {
    // 实际实现中需要压缩 CSS 文件
  }
  
  async minifyWxmlFile(file) {
    // 实际实现中需要压缩 WXML 文件
  }
  
  async compressImage(file) {
    // 实际实现中需要压缩图片
  }
  
  async convertImagesToWebP() {
    // 实际实现中需要转换图片格式
  }
  
  calculateDirectorySize(dir) {
    // 实际实现中需要计算目录大小
    return 0
  }
}

// package.json 中的构建脚本
const buildScripts = {
  "scripts": {
    "build": "node build.js",
    "build:dev": "node build.js --env=development",
    "build:test": "node build.js --env=testing",
    "build:prod": "node build.js --env=production",
    "prebuild": "npm run lint && npm run test",
    "postbuild": "npm run analyze"
  }
}
```

## 发布流程

### 自动化发布

```javascript
// deploy.js - 自动化发布脚本
class DeployManager {
  constructor(config = {}) {
    this.config = {
      appId: '',
      privateKey: '',
      version: '1.0.0',
      description: '',
      ...config
    }
  }
  
  async deploy() {
    console.log('开始自动化发布...')
    
    try {
      // 1. 预发布检查
      await this.preDeployCheck()
      
      // 2. 构建项目
      await this.buildProject()
      
      // 3. 上传代码
      await this.uploadCode()
      
      // 4. 提交审核
      await this.submitForReview()
      
      // 5. 发布通知
      await this.sendNotification()
      
      console.log('发布流程完成!')
      
    } catch (error) {
      console.error('发布失败:', error)
      await this.handleDeployError(error)
      throw error
    }
  }
  
  async preDeployCheck() {
    console.log('执行预发布检查...')
    
    // 检查代码质量
    const codeQuality = await this.checkCodeQuality()
    if (!codeQuality.passed) {
      throw new Error('代码质量检查未通过')
    }
    
    // 检查测试覆盖率
    const testCoverage = await this.checkTestCoverage()
    if (testCoverage < 80) {
      console.warn(`测试覆盖率较低: ${testCoverage}%`)
    }
    
    // 检查依赖安全性
    await this.checkDependencySecurity()
    
    // 检查配置文件
    await this.validateConfigurations()
  }
  
  async buildProject() {
    console.log('构建项目...')
    
    const buildManager = new BuildManager({
      environment: 'production'
    })
    
    const buildReport = await buildManager.build()
    
    // 检查构建结果
    if (buildReport.size.total > 20 * 1024 * 1024) { // 20MB
      throw new Error('构建包过大，超过小程序限制')
    }
    
    return buildReport
  }
  
  async uploadCode() {
    console.log('上传代码...')
    
    // 使用微信开发者工具 CLI 上传
    const uploadCommand = `cli upload --project ./dist --version ${this.config.version} --desc "${this.config.description}"`
    
    try {
      await this.executeCommand(uploadCommand)
      console.log('代码上传成功')
    } catch (error) {
      throw new Error(`代码上传失败: ${error.message}`)
    }
  }
  
  async submitForReview() {
    console.log('提交审核...')
    
    // 调用微信小程序 API 提交审核
    const submitData = {
      item_list: [
        {
          address: 'pages/index/index',
          tag: '首页',
          first_class: '工具',
          second_class: '效率',
          title: '小程序研究院'
        }
      ]
    }
    
    try {
      const result = await this.callWechatAPI('/wxa/submit_audit', submitData)
      console.log('提交审核成功，审核ID:', result.auditid)
      return result.auditid
    } catch (error) {
      throw new Error(`提交审核失败: ${error.message}`)
    }
  }
  
  async sendNotification() {
    console.log('发送发布通知...')
    
    const notification = {
      title: '小程序发布通知',
      content: `版本 ${this.config.version} 已提交审核`,
      timestamp: new Date().toISOString(),
      version: this.config.version,
      description: this.config.description
    }
    
    // 发送到团队通知渠道（如钉钉、企业微信等）
    await this.sendTeamNotification(notification)
    
    // 发送邮件通知
    await this.sendEmailNotification(notification)
  }
  
  async handleDeployError(error) {
    console.log('处理发布错误...')
    
    const errorReport = {
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      version: this.config.version,
      stage: this.getCurrentStage()
    }
    
    // 发送错误通知
    await this.sendErrorNotification(errorReport)
    
    // 回滚操作（如果需要）
    await this.rollback()
  }
  
  // 辅助方法
  async checkCodeQuality() {
    const checker = new CodeQualityChecker()
    return checker.checkCodeQuality('./src')
  }
  
  async checkTestCoverage() {
    // 实际实现中需要运行测试并获取覆盖率
    return 85
  }
  
  async checkDependencySecurity() {
    // 检查依赖包安全性
    console.log('检查依赖安全性...')
  }
  
  async validateConfigurations() {
    // 验证配置文件
    console.log('验证配置文件...')
  }
  
  async executeCommand(command) {
    // 执行命令行命令
    console.log(`执行命令: ${command}`)
  }
  
  async callWechatAPI(endpoint, data) {
    // 调用微信 API
    console.log(`调用微信 API: ${endpoint}`)
    return { auditid: '12345' }
  }
  
  async sendTeamNotification(notification) {
    // 发送团队通知
    console.log('发送团队通知:', notification.title)
  }
  
  async sendEmailNotification(notification) {
    // 发送邮件通知
    console.log('发送邮件通知:', notification.title)
  }
  
  async sendErrorNotification(errorReport) {
    // 发送错误通知
    console.log('发送错误通知:', errorReport.error)
  }
  
  async rollback() {
    // 回滚操作
    console.log('执行回滚操作...')
  }
  
  getCurrentStage() {
    // 获取当前发布阶段
    return 'unknown'
  }
}
```

### 灰度发布

```javascript
// 灰度发布管理
class GrayReleaseManager {
  constructor(config = {}) {
    this.config = {
      grayRatio: 0.1, // 10% 灰度用户
      duration: 24 * 60 * 60 * 1000, // 24小时
      ...config
    }
    
    this.grayUsers = new Set()
    this.metrics = {
      totalUsers: 0,
      grayUsers: 0,
      errorRate: 0,
      crashRate: 0,
      performanceScore: 0
    }
  }
  
  // 判断用户是否为灰度用户
  isGrayUser(userId) {
    // 基于用户ID的哈希值决定是否为灰度用户
    const hash = this.hashUserId(userId)
    return hash < this.config.grayRatio
  }
  
  // 启动灰度发布
  async startGrayRelease(version) {
    console.log(`启动灰度发布 - 版本: ${version}`)
    
    // 设置灰度配置
    await this.setGrayConfiguration(version)
    
    // 开始监控
    this.startMonitoring()
    
    // 设置自动检查
    this.scheduleHealthCheck()
    
    console.log(`灰度发布已启动，灰度比例: ${this.config.grayRatio * 100}%`)
  }
  
  // 监控灰度发布状态
  startMonitoring() {
    setInterval(() => {
      this.collectMetrics()
      this.analyzeMetrics()
    }, 5 * 60 * 1000) // 每5分钟检查一次
  }
  
  // 收集指标数据
  async collectMetrics() {
    // 收集用户数据
    this.metrics.totalUsers = await this.getTotalUsers()
    this.metrics.grayUsers = await this.getGrayUsers()
    
    // 收集错误率
    this.metrics.errorRate = await this.getErrorRate()
    
    // 收集崩溃率
    this.metrics.crashRate = await this.getCrashRate()
    
    // 收集性能数据
    this.metrics.performanceScore = await this.getPerformanceScore()
    
    console.log('灰度发布指标:', this.metrics)
  }
  
  // 分析指标数据
  analyzeMetrics() {
    const issues = []
    
    // 检查错误率
    if (this.metrics.errorRate > 0.05) { // 5%
      issues.push(`错误率过高: ${(this.metrics.errorRate * 100).toFixed(2)}%`)
    }
    
    // 检查崩溃率
    if (this.metrics.crashRate > 0.01) { // 1%
      issues.push(`崩溃率过高: ${(this.metrics.crashRate * 100).toFixed(2)}%`)
    }
    
    // 检查性能分数
    if (this.metrics.performanceScore < 80) {
      issues.push(`性能分数过低: ${this.metrics.performanceScore}`)
    }
    
    if (issues.length > 0) {
      console.warn('灰度发布发现问题:', issues)
      this.handleGrayReleaseIssues(issues)
    } else {
      console.log('灰度发布状态正常')
    }
  }
  
  // 处理灰度发布问题
  async handleGrayReleaseIssues(issues) {
    const severity = this.calculateSeverity(issues)
    
    if (severity === 'critical') {
      console.error('发现严重问题，立即回滚')
      await this.rollbackGrayRelease()
    } else if (severity === 'high') {
      console.warn('发现高风险问题，暂停灰度发布')
      await this.pauseGrayRelease()
    } else {
      console.log('发现一般问题，继续监控')
      await this.sendAlert(issues)
    }
  }
  
  // 扩大灰度范围
  async expandGrayRelease(newRatio) {
    if (newRatio > this.config.grayRatio) {
      console.log(`扩大灰度范围: ${this.config.grayRatio * 100}% -> ${newRatio * 100}%`)
      
      this.config.grayRatio = newRatio
      await this.setGrayConfiguration()
      
      // 通知相关人员
      await this.sendNotification({
        type: 'gray_expansion',
        oldRatio: this.config.grayRatio,
        newRatio: newRatio
      })
    }
  }
  
  // 完成灰度发布
  async completeGrayRelease() {
    console.log('完成灰度发布，全量发布')
    
    // 设置全量发布
    await this.setFullRelease()
    
    // 生成灰度发布报告
    const report = await this.generateGrayReleaseReport()
    
    // 清理灰度配置
    await this.cleanupGrayConfiguration()
    
    console.log('灰度发布完成')
    return report
  }
  
  // 回滚灰度发布
  async rollbackGrayRelease() {
    console.log('回滚灰度发布')
    
    // 恢复到上一个稳定版本
    await this.revertToPreviousVersion()
    
    // 发送回滚通知
    await this.sendRollbackNotification()
    
    // 生成回滚报告
    const report = await this.generateRollbackReport()
    
    return report
  }
  
  // 辅助方法
  hashUserId(userId) {
    // 简单的哈希函数
    let hash = 0
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return Math.abs(hash) / 2147483647 // 归一化到 0-1
  }
  
  async setGrayConfiguration(version) {
    // 设置灰度配置
    console.log('设置灰度配置')
  }
  
  scheduleHealthCheck() {
    // 定期健康检查
    setTimeout(() => {
      this.performHealthCheck()
    }, this.config.duration)
  }
  
  async performHealthCheck() {
    // 执行健康检查
    console.log('执行健康检查')
  }
  
  async getTotalUsers() { return 1000 }
  async getGrayUsers() { return 100 }
  async getErrorRate() { return 0.02 }
  async getCrashRate() { return 0.005 }
  async getPerformanceScore() { return 85 }
  
  calculateSeverity(issues) {
    // 根据问题计算严重程度
    if (issues.some(issue => issue.includes('崩溃率'))) {
      return 'critical'
    } else if (issues.some(issue => issue.includes('错误率'))) {
      return 'high'
    } else {
      return 'medium'
    }
  }
  
  async pauseGrayRelease() {
    console.log('暂停灰度发布')
  }
  
  async sendAlert(issues) {
    console.log('发送告警:', issues)
  }
  
  async sendNotification(data) {
    console.log('发送通知:', data)
  }
  
  async setFullRelease() {
    console.log('设置全量发布')
  }
  
  async generateGrayReleaseReport() {
    return {
      startTime: new Date(),
      endTime: new Date(),
      grayRatio: this.config.grayRatio,
      metrics: this.metrics,
      issues: [],
      success: true
    }
  }
  
  async cleanupGrayConfiguration() {
    console.log('清理灰度配置')
  }
  
  async revertToPreviousVersion() {
    console.log('恢复到上一个版本')
  }
  
  async sendRollbackNotification() {
    console.log('发送回滚通知')
  }
  
  async generateRollbackReport() {
    return {
      rollbackTime: new Date(),
      reason: '灰度发布问题',
      metrics: this.metrics
    }
  }
}
```

## 发布后监控

### 线上监控

```javascript
// 线上监控系统
class ProductionMonitor {
  constructor() {
    this.alerts = []
    this.metrics = new Map()
    this.thresholds = {
      errorRate: 0.05,
      responseTime: 2000,
      crashRate: 0.01,
      memoryUsage: 100 * 1024 * 1024 // 100MB
    }
  }
  
  // 启动监控
  startMonitoring() {
    console.log('启动线上监控...')
    
    // 监控错误率
    this.monitorErrorRate()
    
    // 监控性能指标
    this.monitorPerformance()
    
    // 监控用户行为
    this.monitorUserBehavior()
    
    // 监控业务指标
    this.monitorBusinessMetrics()
  }
  
  // 监控错误率
  monitorErrorRate() {
    setInterval(async () => {
      const errorRate = await this.getErrorRate()
      this.recordMetric('error_rate', errorRate)
      
      if (errorRate > this.thresholds.errorRate) {
        this.triggerAlert('high_error_rate', {
          current: errorRate,
          threshold: this.thresholds.errorRate
        })
      }
    }, 60 * 1000) // 每分钟检查
  }
  
  // 监控性能指标
  monitorPerformance() {
    setInterval(async () => {
      const metrics = await this.getPerformanceMetrics()
      
      // 记录各项指标
      Object.keys(metrics).forEach(key => {
        this.recordMetric(`performance_${key}`, metrics[key])
      })
      
      // 检查响应时间
      if (metrics.responseTime > this.thresholds.responseTime) {
        this.triggerAlert('slow_response', {
          current: metrics.responseTime,
          threshold: this.thresholds.responseTime
        })
      }
      
      // 检查内存使用
      if (metrics.memoryUsage > this.thresholds.memoryUsage) {
        this.triggerAlert('high_memory_usage', {
          current: metrics.memoryUsage,
          threshold: this.thresholds.memoryUsage
        })
      }
    }, 5 * 60 * 1000) // 每5分钟检查
  }
  
  // 监控用户行为
  monitorUserBehavior() {
    setInterval(async () => {
      const userMetrics = await this.getUserMetrics()
      
      // 记录用户指标
      this.recordMetric('active_users', userMetrics.activeUsers)
      this.recordMetric('session_duration', userMetrics.avgSessionDuration)
      this.recordMetric('bounce_rate', userMetrics.bounceRate)
      
      // 检查异常用户行为
      if (userMetrics.bounceRate > 0.8) {
        this.triggerAlert('high_bounce_rate', {
          current: userMetrics.bounceRate,
          threshold: 0.8
        })
      }
    }, 10 * 60 * 1000) // 每10分钟检查
  }
  
  // 监控业务指标
  monitorBusinessMetrics() {
    setInterval(async () => {
      const businessMetrics = await this.getBusinessMetrics()
      
      // 记录业务指标
      Object.keys(businessMetrics).forEach(key => {
        this.recordMetric(`business_${key}`, businessMetrics[key])
      })
      
      // 检查关键业务指标
      this.checkBusinessThresholds(businessMetrics)
    }, 15 * 60 * 1000) // 每15分钟检查
  }
  
  // 记录指标
  recordMetric(name, value) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }
    
    const metricData = this.metrics.get(name)
    metricData.push({
      value: value,
      timestamp: Date.now()
    })
    
    // 保持最近1000个数据点
    if (metricData.length > 1000) {
      metricData.splice(0, metricData.length - 1000)
    }
  }
  
  // 触发告警
  triggerAlert(type, data) {
    const alert = {
      id: Date.now(),
      type: type,
      data: data,
      timestamp: new Date().toISOString(),
      severity: this.getAlertSeverity(type),
      resolved: false
    }
    
    this.alerts.push(alert)
    console.warn('触发告警:', alert)
    
    // 发送告警通知
    this.sendAlertNotification(alert)
    
    // 自动处理告警
    this.handleAlert(alert)
  }
  
  // 处理告警
  async handleAlert(alert) {
    switch (alert.type) {
      case 'high_error_rate':
        await this.handleHighErrorRate(alert)
        break
      case 'slow_response':
        await this.handleSlowResponse(alert)
        break
      case 'high_memory_usage':
        await this.handleHighMemoryUsage(alert)
        break
      case 'high_bounce_rate':
        await this.handleHighBounceRate(alert)
        break
      default:
        console.log('未知告警类型:', alert.type)
    }
  }
  
  // 生成监控报告
  generateMonitoringReport(timeRange = 24 * 60 * 60 * 1000) { // 24小时
    const endTime = Date.now()
    const startTime = endTime - timeRange
    
    const report = {
      timeRange: {
        start: new Date(startTime).toISOString(),
        end: new Date(endTime).toISOString()
      },
      metrics: {},
      alerts: this.alerts.filter(alert => 
        new Date(alert.timestamp).getTime() >= startTime
      ),
      summary: {}
    }
    
    // 汇总指标数据
    this.metrics.forEach((data, name) => {
      const filteredData = data.filter(point => 
        point.timestamp >= startTime
      )
      
      if (filteredData.length > 0) {
        const values = filteredData.map(point => point.value)
        report.metrics[name] = {
          count: values.length,
          avg: values.reduce((a, b) => a + b, 0) / values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          latest: values[values.length - 1]
        }
      }
    })
    
    // 生成摘要
    report.summary = {
      totalAlerts: report.alerts.length,
      criticalAlerts: report.alerts.filter(a => a.severity === 'critical').length,
      unresolvedAlerts: report.alerts.filter(a => !a.resolved).length,
      avgErrorRate: report.metrics.error_rate?.avg || 0,
      avgResponseTime: report.metrics.performance_responseTime?.avg || 0
    }
    
    console.log('监控报告:', report)
    return report
  }
  
  // 辅助方法
  async getErrorRate() {
    // 实际实现中需要从监控系统获取错误率
    return Math.random() * 0.1
  }
  
  async getPerformanceMetrics() {
    // 实际实现中需要获取性能指标
    return {
      responseTime: Math.random() * 3000 + 500,
      memoryUsage: Math.random() * 50 * 1024 * 1024 + 30 * 1024 * 1024,
      cpuUsage: Math.random() * 80 + 10
    }
  }
  
  async getUserMetrics() {
    // 实际实现中需要获取用户指标
    return {
      activeUsers: Math.floor(Math.random() * 1000 + 500),
      avgSessionDuration: Math.random() * 300 + 60,
      bounceRate: Math.random() * 0.5 + 0.2
    }
  }
  
  async getBusinessMetrics() {
    // 实际实现中需要获取业务指标
    return {
      orders: Math.floor(Math.random() * 100 + 50),
      revenue: Math.random() * 10000 + 5000,
      conversion: Math.random() * 0.1 + 0.05
    }
  }
  
  checkBusinessThresholds(metrics) {
    // 检查业务指标阈值
    if (metrics.conversion < 0.03) {
      this.triggerAlert('low_conversion', {
        current: metrics.conversion,
        threshold: 0.03
      })
    }
  }
  
  getAlertSeverity(type) {
    const severityMap = {
      'high_error_rate': 'critical',
      'slow_response': 'high',
      'high_memory_usage': 'medium',
      'high_bounce_rate': 'low',
      'low_conversion': 'medium'
    }
    
    return severityMap[type] || 'low'
  }
  
  async sendAlertNotification(alert) {
    // 发送告警通知
    console.log('发送告警通知:', alert.type)
  }
  
  async handleHighErrorRate(alert) {
    console.log('处理高错误率告警')
    // 可能的处理措施：
    // 1. 自动回滚到上一个版本
    // 2. 限流保护
    // 3. 通知开发团队
  }
  
  async handleSlowResponse(alert) {
    console.log('处理响应慢告警')
    // 可能的处理措施：
    // 1. 扩容服务器
    // 2. 优化数据库查询
    // 3. 启用缓存
  }
  
  async handleHighMemoryUsage(alert) {
    console.log('处理高内存使用告警')
    // 可能的处理措施：
    // 1. 重启服务
    // 2. 清理缓存
    // 3. 内存泄漏排查
  }
  
  async handleHighBounceRate(alert) {
    console.log('处理高跳出率告警')
    // 可能的处理措施：
    // 1. 检查页面加载速度
    // 2. 分析用户行为
    // 3. 优化用户体验
  }
}
```

## 发布最佳实践

### 发布检查清单

```javascript
const deploymentChecklist = {
  // 发布前检查
  preDeployment: [
    '代码审查已完成',
    '单元测试通过率 > 90%',
    '集成测试全部通过',
    '性能测试达标',
    '安全扫描无高危漏洞',
    '配置文件已更新',
    '数据库迁移脚本已准备',
    '回滚方案已制定',
    '发布说明已编写',
    '相关人员已通知'
  ],
  
  // 发布中检查
  deployment: [
    '构建过程无错误',
    '代码上传成功',
    '配置文件正确应用',
    '数据库迁移成功',
    '服务启动正常',
    '健康检查通过',
    '监控系统正常',
    '日志输出正常'
  ],
  
  // 发布后检查
  postDeployment: [
    '核心功能验证通过',
    '用户访问正常',
    '接口响应正常',
    '数据一致性检查通过',
    '性能指标正常',
    '错误率在预期范围内',
    '监控告警正常',
    '用户反馈收集'
  ]
}

console.log('发布检查清单:', deploymentChecklist)
```

### 发布策略

```javascript
// 发布策略配置
const deploymentStrategies = {
  // 蓝绿发布
  blueGreen: {
    description: '维护两个相同的生产环境，一次性切换流量',
    advantages: ['快速回滚', '零停机时间', '完整测试'],
    disadvantages: ['资源消耗大', '数据同步复杂'],
    suitableFor: ['关键业务系统', '用户量大的应用']
  },
  
  // 滚动发布
  rolling: {
    description: '逐步替换旧版本实例',
    advantages: ['资源利用率高', '风险分散'],
    disadvantages: ['发布时间长', '版本混合运行'],
    suitableFor: ['微服务架构', '可水平扩展的应用']
  },
  
  // 金丝雀发布
  canary: {
    description: '先发布给少量用户，逐步扩大范围',
    advantages: ['风险可控', '问题早发现', '用户影响小'],
    disadvantages: ['发布流程复杂', '监控要求高'],
    suitableFor: ['新功能发布', '重大版本更新']
  },
  
  // A/B 测试发布
  abTesting: {
    description: '同时运行多个版本，比较效果',
    advantages: ['数据驱动决策', '用户体验优化'],
    disadvantages: ['复杂度高', '数据分析要求高'],
    suitableFor: ['功能优化', '用户体验改进']
  }
}
```

## 总结

小程序发布部署是一个复杂的系统工程，需要考虑多个方面：

1. **发布前准备** - 代码质量检查、性能测试、配置验证
2. **版本管理** - 语义化版本控制、构建脚本、发布说明
3. **发布流程** - 自动化发布、灰度发布、监控告警
4. **发布后监控** - 线上监控、性能指标、用户反馈
5. **最佳实践** - 发布检查清单、发布策略选择

通过建立完善的发布部署体系，可以确保小程序的稳定发布和持续改进，提供优质的用户体验。发布部署不仅是技术问题，更是流程和管理问题，需要团队协作和持续优化。
