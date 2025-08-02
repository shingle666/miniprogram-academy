# 发布部署

完整的小程序发布部署指南，从开发到上线的全流程管理。

## 📋 目录

- [发布准备](#发布准备)
- [构建打包](#构建打包)
- [发布流程](#发布流程)
- [自动化部署](#自动化部署)
- [监控维护](#监控维护)
- [最佳实践](#最佳实践)

## 🚀 发布准备

### 环境配置

```javascript
// config/deploy.config.js
module.exports = {
  // 应用信息
  appId: process.env.MINIPROGRAM_APPID,
  privateKeyPath: './private.key',
  
  // 环境配置
  environments: {
    development: {
      name: '开发版',
      description: '开发测试环境',
      domain: 'https://dev-api.example.com'
    },
    staging: {
      name: '体验版',
      description: '预发布环境',
      domain: 'https://staging-api.example.com'
    },
    production: {
      name: '正式版',
      description: '生产环境',
      domain: 'https://api.example.com'
    }
  },
  
  // 构建配置
  build: {
    minify: true,
    sourcemap: false,
    removeConsole: true,
    compressImages: true
  }
}
```

### 版本管理

```javascript
// utils/version.js
class VersionManager {
  constructor() {
    this.packagePath = './package.json'
    this.historyPath = './version-history.json'
  }

  // 获取当前版本
  getCurrentVersion() {
    try {
      const pkg = require(this.packagePath)
      return pkg.version || '1.0.0'
    } catch (error) {
      console.warn('无法读取版本信息，使用默认版本 1.0.0')
      return '1.0.0'
    }
  }

  // 版本递增
  bump(type = 'patch') {
    const current = this.getCurrentVersion()
    const [major, minor, patch] = current.split('.').map(Number)
    
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
    
    this.updatePackageVersion(newVersion)
    this.recordVersion(newVersion, type)
    
    return newVersion
  }

  // 更新 package.json
  updatePackageVersion(version) {
    const fs = require('fs')
    const pkg = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'))
    pkg.version = version
    fs.writeFileSync(this.packagePath, JSON.stringify(pkg, null, 2))
    console.log(`✅ 版本已更新至 ${version}`)
  }

  // 记录版本历史
  recordVersion(version, type) {
    const fs = require('fs')
    const record = {
      version,
      type,
      timestamp: new Date().toISOString(),
      author: process.env.USER || 'unknown'
    }
    
    let history = []
    try {
      if (fs.existsSync(this.historyPath)) {
        history = JSON.parse(fs.readFileSync(this.historyPath, 'utf8'))
      }
    } catch (error) {
      console.warn('无法读取版本历史')
    }
    
    history.unshift(record)
    fs.writeFileSync(this.historyPath, JSON.stringify(history, null, 2))
  }

  // 生成更新日志
  generateChangelog() {
    const fs = require('fs')
    try {
      const history = JSON.parse(fs.readFileSync(this.historyPath, 'utf8'))
      let changelog = '# 更新日志\n\n'
      
      history.forEach(record => {
        const date = record.timestamp.split('T')[0]
        changelog += `## ${record.version} (${date})\n\n`
        changelog += `- 版本类型: ${record.type}\n`
        changelog += `- 发布者: ${record.author}\n\n`
      })
      
      fs.writeFileSync('./CHANGELOG.md', changelog)
      console.log('✅ 更新日志已生成')
    } catch (error) {
      console.error('生成更新日志失败:', error)
    }
  }
}

module.exports = new VersionManager()
```

## 🔨 构建打包

### 构建管理器

```javascript
// build/builder.js
const fs = require('fs')
const path = require('path')

class Builder {
  constructor(config = {}) {
    this.config = {
      sourceDir: './src',
      outputDir: './dist',
      ...config
    }
  }

  // 执行构建
  async build(env = 'production') {
    console.log(`🔨 开始构建 ${env} 环境...`)
    
    try {
      // 1. 清理输出目录
      await this.clean()
      
      // 2. 复制源文件
      await this.copyFiles()
      
      // 3. 处理配置
      await this.processConfig(env)
      
      // 4. 优化资源
      await this.optimize()
      
      // 5. 生成报告
      const report = await this.generateReport()
      
      console.log('✅ 构建完成!')
      console.log(`📦 包大小: ${report.totalSize}`)
      
      return report
    } catch (error) {
      console.error('❌ 构建失败:', error)
      throw error
    }
  }

  // 清理输出目录
  async clean() {
    if (fs.existsSync(this.config.outputDir)) {
      fs.rmSync(this.config.outputDir, { recursive: true })
    }
    fs.mkdirSync(this.config.outputDir, { recursive: true })
    console.log('🧹 输出目录已清理')
  }

  // 复制文件
  async copyFiles() {
    const copyDir = (src, dest) => {
      if (!fs.existsSync(src)) return
      
      const items = fs.readdirSync(src)
      items.forEach(item => {
        const srcPath = path.join(src, item)
        const destPath = path.join(dest, item)
        
        if (fs.statSync(srcPath).isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true })
          copyDir(srcPath, destPath)
        } else {
          fs.copyFileSync(srcPath, destPath)
        }
      })
    }

    // 复制主要目录
    const dirs = ['pages', 'components', 'utils', 'images', 'styles']
    dirs.forEach(dir => {
      const srcPath = path.join(this.config.sourceDir, dir)
      const destPath = path.join(this.config.outputDir, dir)
      copyDir(srcPath, destPath)
    })

    // 复制根文件
    const files = ['app.js', 'app.json', 'app.wxss', 'sitemap.json']
    files.forEach(file => {
      const srcPath = path.join(this.config.sourceDir, file)
      const destPath = path.join(this.config.outputDir, file)
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath)
      }
    })

    console.log('📁 文件复制完成')
  }

  // 处理配置文件
  async processConfig(env) {
    const configPath = path.join(this.config.outputDir, 'app.json')
    if (!fs.existsSync(configPath)) return

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    
    // 根据环境调整配置
    if (env === 'production') {
      // 移除调试页面
      if (config.pages) {
        config.pages = config.pages.filter(page => !page.includes('debug'))
      }
      // 移除开发配置
      delete config.debug
    }

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    console.log('⚙️ 配置文件处理完成')
  }

  // 优化资源
  async optimize() {
    // 移除 console 和 debugger
    this.removeDebugCode()
    
    // 压缩图片（示例）
    this.compressImages()
    
    console.log('🎯 资源优化完成')
  }

  // 移除调试代码
  removeDebugCode() {
    const processFile = (filePath) => {
      if (!filePath.endsWith('.js')) return
      
      let content = fs.readFileSync(filePath, 'utf8')
      
      // 移除 console 语句
      content = content.replace(/console\.(log|warn|error|info|debug)\([^)]*\);?/g, '')
      
      // 移除 debugger 语句
      content = content.replace(/debugger;?/g, '')
      
      fs.writeFileSync(filePath, content)
    }

    const processDir = (dir) => {
      if (!fs.existsSync(dir)) return
      
      fs.readdirSync(dir).forEach(item => {
        const itemPath = path.join(dir, item)
        if (fs.statSync(itemPath).isDirectory()) {
          processDir(itemPath)
        } else {
          processFile(itemPath)
        }
      })
    }

    processDir(this.config.outputDir)
  }

  // 压缩图片
  compressImages() {
    // 这里可以集成图片压缩工具
    console.log('🖼️ 图片压缩功能待实现')
  }

  // 生成构建报告
  async generateReport() {
    const getSize = (dir) => {
      let size = 0
      if (!fs.existsSync(dir)) return size
      
      fs.readdirSync(dir).forEach(item => {
        const itemPath = path.join(dir, item)
        const stat = fs.statSync(itemPath)
        if (stat.isDirectory()) {
          size += getSize(itemPath)
        } else {
          size += stat.size
        }
      })
      return size
    }

    const formatSize = (bytes) => {
      const units = ['B', 'KB', 'MB', 'GB']
      let size = bytes
      let unitIndex = 0
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
      }
      
      return `${size.toFixed(2)} ${units[unitIndex]}`
    }

    const totalSize = getSize(this.config.outputDir)
    const report = {
      buildTime: new Date().toISOString(),
      totalSize: formatSize(totalSize),
      totalBytes: totalSize
    }

    // 保存报告
    fs.writeFileSync(
      path.join(this.config.outputDir, 'build-report.json'),
      JSON.stringify(report, null, 2)
    )

    return report
  }
}

module.exports = Builder
```

## 📱 发布流程

### 发布管理器

```javascript
// deploy/publisher.js
const ci = require('miniprogram-ci')
const path = require('path')

class Publisher {
  constructor(config) {
    this.config = config
    this.project = null
    this.history = []
  }

  // 初始化项目
  async init() {
    try {
      this.project = new ci.Project({
        appid: this.config.appId,
        type: 'miniProgram',
        projectPath: path.resolve('./'),
        privateKeyPath: path.resolve(this.config.privateKeyPath),
        ignores: ['node_modules/**/*', '.git/**/*']
      })
      console.log('✅ 小程序项目初始化成功')
    } catch (error) {
      console.error('❌ 项目初始化失败:', error)
      throw error
    }
  }

  // 预发布检查
  async preCheck() {
    console.log('🔍 开始预发布检查...')
    
    const checks = [
      { name: '配置文件检查', fn: () => this.checkConfig() },
      { name: '包大小检查', fn: () => this.checkSize() },
      { name: '代码质量检查', fn: () => this.checkCode() }
    ]

    const results = []
    for (const check of checks) {
      try {
        const result = await check.fn()
        results.push({ name: check.name, passed: result.passed, ...result })
        console.log(`${result.passed ? '✅' : '❌'} ${check.name}`)
      } catch (error) {
        results.push({ name: check.name, passed: false, error: error.message })
        console.log(`❌ ${check.name}: ${error.message}`)
      }
    }

    const allPassed = results.every(r => r.passed)
    if (!allPassed) {
      throw new Error('预发布检查未通过')
    }

    console.log('✅ 预发布检查通过')
    return results
  }

  // 检查配置文件
  checkConfig() {
    const fs = require('fs')
    const issues = []

    // 检查 app.json
    if (!fs.existsSync('./app.json')) {
      issues.push('缺少 app.json 文件')
    }

    // 检查 project.config.json
    if (!fs.existsSync('./project.config.json')) {
      issues.push('缺少 project.config.json 文件')
    }

    return { passed: issues.length === 0, issues }
  }

  // 检查包大小
  checkSize() {
    const fs = require('fs')
    const path = require('path')
    
    const getSize = (dir) => {
      let size = 0
      if (!fs.existsSync(dir)) return size
      
      fs.readdirSync(dir).forEach(item => {
        const itemPath = path.join(dir, item)
        const stat = fs.statSync(itemPath)
        if (stat.isDirectory()) {
          size += getSize(itemPath)
        } else {
          size += stat.size
        }
      })
      return size
    }

    const totalSize = getSize('./dist')
    const maxSize = 2 * 1024 * 1024 // 2MB
    
    return {
      passed: totalSize <= maxSize,
      size: totalSize,
      maxSize,
      message: totalSize > maxSize ? `包大小 ${(totalSize / 1024 / 1024).toFixed(2)}MB 超过限制` : null
    }
  }

  // 检查代码质量
  checkCode() {
    // 简单的代码检查示例
    return { passed: true }
  }

  // 上传代码
  async upload(options = {}) {
    const {
      version = '1.0.0',
      desc = '版本更新',
      env = 'trial'
    } = options

    console.log(`📤 开始上传 ${env} 版本: ${version}`)

    try {
      const result = await ci.upload({
        project: this.project,
        version,
        desc,
        setting: {
          es6: true,
          es7: true,
          minify: env === 'production',
          codeProtect: env === 'production',
          minifyJS: env === 'production',
          minifyWXML: env === 'production',
          minifyWXSS: env === 'production'
        },
        onProgressUpdate: (progress) => {
          process.stdout.write(`\r上传进度: ${progress}%`)
        }
      })

      console.log('\n✅ 上传成功!')
      
      // 记录历史
      this.recordHistory({
        type: 'upload',
        version,
        env,
        desc,
        timestamp: new Date().toISOString(),
        result
      })

      return result
    } catch (error) {
      console.error('\n❌ 上传失败:', error)
      throw error
    }
  }

  // 生成预览
  async preview(options = {}) {
    const {
      desc = '预览版本',
      pagePath,
      searchQuery
    } = options

    console.log('📱 生成预览二维码...')

    try {
      const result = await ci.preview({
        project: this.project,
        desc,
        setting: {
          es6: true,
          minify: false
        },
        qrcodeFormat: 'image',
        qrcodeOutputDest: './preview.jpg',
        pagePath,
        searchQuery,
        onProgressUpdate: (progress) => {
          process.stdout.write(`\r生成进度: ${progress}%`)
        }
      })

      console.log('\n✅ 预览二维码已生成: ./preview.jpg')
      return result
    } catch (error) {
      console.error('\n❌ 生成预览失败:', error)
      throw error
    }
  }

  // 提交审核
  async submitAudit(options = {}) {
    const {
      version = '1.0.0',
      desc = '提交审核'
    } = options

    console.log(`📋 提交审核: ${version}`)

    try {
      // 这里应该调用微信审核接口
      // 由于 miniprogram-ci 不直接支持，需要使用其他方式
      console.log('⏳ 审核提交功能需要通过微信开发者工具或后台操作')
      
      return { success: true, message: '请通过微信开发者工具提交审核' }
    } catch (error) {
      console.error('❌ 提交审核失败:', error)
      throw error
    }
  }

  // 记录历史
  recordHistory(record) {
    this.history.unshift(record)
    
    // 保存到文件
    const fs = require('fs')
    try {
      fs.writeFileSync('./deploy-history.json', JSON.stringify(this.history, null, 2))
    } catch (error) {
      console.warn('保存部署历史失败:', error)
    }
  }

  // 获取历史记录
  getHistory() {
    return this.history
  }
}

module.exports = Publisher
```

## 🤖 自动化部署

### 部署脚本

```javascript
// scripts/deploy.js
const Builder = require('../build/builder')
const Publisher = require('../deploy/publisher')
const VersionManager = require('../utils/version')
const config = require('../config/deploy.config')

class AutoDeploy {
  constructor() {
    this.builder = new Builder()
    this.publisher = new Publisher(config)
    this.version = new VersionManager()
  }

  // 执行部署
  async deploy(env = 'development', options = {}) {
    const {
      bumpVersion = false,
      versionType = 'patch',
      description = '自动部署'
    } = options

    console.log(`🚀 开始部署到 ${env} 环境`)

    try {
      // 1. 版本管理
      let version = this.version.getCurrentVersion()
      if (bumpVersion) {
        version = this.version.bump(versionType)
      }

      // 2. 构建项目
      await this.builder.build(env)

      // 3. 初始化发布器
      await this.publisher.init()

      // 4. 预发布检查
      await this.publisher.preCheck()

      // 5. 根据环境执行不同操作
      await this.handleEnvironment(env, version, description)

      console.log('🎉 部署完成!')
      return { success: true, version, env }

    } catch (error) {
      console.error('💥 部署失败:', error)
      throw error
    }
  }

  // 处理不同环境
  async handleEnvironment(env, version, description) {
    switch (env) {
      case 'development':
        // 开发环境：只上传
        await this.publisher.upload({
          version,
          desc: `开发版本 - ${description}`,
          env: 'development'
        })
        break

      case 'staging':
        // 预发布环境：上传 + 生成预览
        await this.publisher.upload({
          version,
          desc: `体验版本 - ${description}`,
          env: 'staging'
        })
        await this.publisher.preview({
          desc: `预览 - ${version}`
        })
        break

      case 'production':
        // 生产环境：上传 + 提交审核
        await this.publisher.upload({
          version,
          desc: `正式版本 - ${description}`,
          env: 'production'
        })
        await this.publisher.submitAudit({
          version,
          desc: description
        })
        break

      default:
        throw new Error(`不支持的环境: ${env}`)
    }
  }

  // 快速部署方法
  async quickDeploy() {
    const env = process.env.NODE_ENV || 'development'
    const branch = process.env.GITHUB_REF_NAME || 'develop'
    
    const envMap = {
      'develop': 'development',
      'staging': 'staging',
      'master': 'production'
    }

    const targetEnv = envMap[branch] || 'development'
    
    return this.deploy(targetEnv, {
      bumpVersion: targetEnv === 'production',
      description: `自动部署 - 分支: ${branch}`
    })
  }
}

// 命令行调用
if (require.main === module) {
  const deploy = new AutoDeploy()
  const env = process.argv[2] || 'development'
  
  deploy.deploy(env)
    .then(result => {
      console.log('部署结果:', result)
      process.exit(0)
    })
    .catch(error => {
      console.error('部署失败:', error)
      process.exit(1)
    })
}

module.exports = AutoDeploy
```

### GitHub Actions 配置

```yaml
# .github/workflows/deploy.yml
name: 小程序部署

on:
  push:
    branches: [develop, staging, master]
  pull_request:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: 检出代码
      uses: actions/checkout@v3
    
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: 安装依赖
      run: npm ci
    
    - name: 代码检查
      run: npm run lint
    
    - name: 运行测试
      run: npm test
    
    - name: 部署
      run: npm run deploy
      env:
        NODE_ENV: ${{ github.ref == 'refs/heads/master' && 'production' || 'development' }}
        MINIPROGRAM_APPID: ${{ secrets.MINIPROGRAM_APPID }}
        GITHUB_REF_NAME: ${{ github.ref_name }}
    
    - name: 通知结果
      if: always()
      run: |
        if [ $? -eq 0 ]; then
          echo "✅ 部署成功"
        else
          echo "❌ 部署失败"
        fi
```

## 📊 监控维护

### 部署监控

```javascript
// monitor/deployMonitor.js
class DeployMonitor {
  constructor() {
    this.metrics = {
      deployments: [],
      errors: []
    }
  }

  // 记录部署
  recordDeployment(deployment) {
    const record = {
      ...deployment,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    }
    
    this.metrics.deployments.unshift(record)
    
    // 保持最近 100 条记录
    if (this.metrics.deployments.length > 100) {
      this.metrics.deployments = this.metrics.deployments.slice(0, 100)
    }
    
    this.saveMetrics()
    this.checkAlerts()
  }

  // 记录错误
  recordError(error) {
    const record = {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }
    
    this.metrics.errors.unshift(record)
    
    if (this.metrics.errors.length > 50) {
      this.metrics.errors = this.metrics.errors.slice(0, 50)
    }
    
    this.saveMetrics()
  }

  // 检查告警
  checkAlerts() {
    const recent = this.getRecentDeployments(24) // 最近24小时
    const failureRate = this.calculateFailureRate(recent)
    
    if (failureRate > 0.3) { // 失败率超过30%
      this.sendAlert({
        type: 'high_failure_rate',
        rate: failureRate,
        count: recent.length
      })
    }
  }

  // 计算失败率
  calculateFailureRate(deployments) {
    if (deployments.length === 0) return 0
    
    const failures = deployments.filter(d => !d.success).length
    return failures / deployments.length
  }

  // 获取最近部署
  getRecentDeployments(hours) {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000)
    return this.metrics.deployments.filter(d => 
      new Date(d.timestamp) > cutoff
    )
  }

  // 发送告警
  sendAlert(alert) {
    console.warn('🚨 部署告警:', alert)
    // 这里可以集成邮件、短信、Slack 等通知方式
  }

  // 生成报告
  generateReport() {
    const now = new Date()
    const last24h = this.getRecentDeployments(24)
    const last7d = this.getRecentDeployments(24 * 7)
    
    return {
      summary: {
        total: this.metrics.deployments.length,
        last24h: last24h.length,
        last7d: last7d.length,
        successRate24h: (1 - this.calculateFailureRate(last24h)) * 100,
        errors: this.metrics.errors.length
      },
      recent: last24h.slice(0, 10),
      generatedAt: now.toISOString()
    }
  }

  // 保存指标
  saveMetrics() {
    const fs = require('fs')
    try {
      fs.writeFileSync('./deploy-metrics.json', JSON.stringify(this.metrics, null, 2))
    } catch (error) {
      console.warn('保存监控指标失败:', error)
    }
  }

  // 加载指标
  loadMetrics() {
    const fs = require('fs')
    try {
      if (fs.existsSync('./deploy-metrics.json')) {
        this.metrics = JSON.parse(fs.readFileSync('./deploy-metrics.json', 'utf8'))
      }
    } catch (error) {
      console.warn('加载监控指标失败:', error)
    }
  }
}

module.exports = new DeployMonitor()
```

## 📚 最佳实践

### 1. 版本管理策略

```bash
# 语义化版本控制
# 主版本号.次版本号.修订号

# 修订号：bug 修复
npm run version:patch

# 次版本号：新功能
npm run version:minor

# 主版本号：破坏性变更
npm run version:major
```

### 2. 分支策略

```
master    ──→ 生产环境 (正式版)
  ↑
staging   ──→ 预发布环境 (体验版)
  ↑
develop   ──→ 开发环境 (开发版)
  ↑
feature/* ──→ 功能分支
```

### 3. 环境配置

```javascript
// 环境变量配置
const config = {
  development: {
    apiUrl: 'https://dev-api.example.com',
    debug: true,
    minify: false
  },
  staging: {
    apiUrl: 'https://staging-api.example.com',
    debug: false,
    minify: true
  },
  production: {
    apiUrl: 'https://api.example.com',
    debug: false,
    minify: true,
    codeProtect: true
  }
}
```

### 4. 发布检查清单

- [ ] 代码审查通过
- [ ] 单元测试通过
- [ ] 功能测试完成
- [ ] 性能测试通过
- [ ] 安全检查完成
- [ ] 文档更新完成
- [ ] 版本号更新
- [ ] 更新日志编写

### 5. 回滚策略

```javascript
// 快速回滚脚本
const rollback = async (targetVersion) => {
  console.log(`🔄 回滚到版本 ${targetVersion}`)
  
  try {
    // 1. 检查版本是否存在
    const versionExists = await checkVersionExists(targetVersion)
    if (!versionExists) {
      throw new Error(`版本 ${targetVersion} 不存在`)
    }
    
    // 2. 执行回滚
    await executeRollback(targetVersion)
    
    // 3. 记录回滚操作
    recordRollback(targetVersion)
    
    console.log('✅ 回滚完成')
  } catch (error) {
    console.error('❌ 回滚失败:', error)
    throw error
  }
}
```

### 6. 性能优化

```javascript
// 构建优化配置
const optimization = {
  // 代码分割
  splitChunks: true,
  
  // 资源压缩
  compress: {
    images: true,
    css: true,
    js: true
  },
  
  // 缓存策略
  cache: {
    enabled: true,
    maxAge: 86400 // 24小时
  },
  
  // 包大小限制
  sizeLimit: {
    total: 2 * 1024 * 1024, // 2MB
    single: 500 * 1024      // 500KB
  }
}
```

## 🛠️ 工具脚本

### package.json 配置

```json
{
  "scripts": {
    "dev": "node scripts/dev.js",
    "build": "node scripts/build.js",
    "deploy": "node scripts/deploy.js",
    "deploy:dev": "node scripts/deploy.js development",
    "deploy:staging": "node scripts/deploy.js staging",
    "deploy:prod": "node scripts/deploy.js production",
    "version:patch": "node scripts/version.js patch",
    "version:minor": "node scripts/version.js minor",
    "version:major": "node scripts/version.js major",
    "preview": "node scripts/preview.js",
    "rollback": "node scripts/rollback.js",
    "monitor": "node scripts/monitor.js"
  },
  "devDependencies": {
    "miniprogram-ci": "^1.8.0"
  }
}
```

### 快速命令

```bash
# 开发部署
npm run deploy:dev

# 预发布部署
npm run deploy:staging

# 生产部署
npm run deploy:prod

# 生成预览
npm run preview

# 版本管理
npm run version:patch

# 监控报告
npm run monitor
```

## 🔧 故障排除

### 常见问题

#### 1. 上传失败

```bash
# 检查网络连接
ping api.weixin.qq.com

# 检查密钥文件
ls -la private.key

# 检查 appid 配置
echo $MINIPROGRAM_APPID
```

#### 2. 构建失败

```bash
# 清理缓存
rm -rf node_modules
npm install

# 检查文件权限
chmod -R 755 src/

# 查看详细错误
npm run build --verbose
```

#### 3. 包大小超限

```bash
# 分析包大小
npm run analyze

# 压缩图片
npm run compress:images

# 移除未使用代码
npm run tree-shake
```

### 调试技巧

```javascript
// 启用调试模式
process.env.DEBUG = 'miniprogram-ci'

// 详细日志
const logger = {
  info: (msg) => console.log(`ℹ️ ${msg}`),
  warn: (msg) => console.warn(`⚠️ ${msg}`),
  error: (msg) => console.error(`❌ ${msg}`)
}
```

## 📖 相关文档

- [项目结构](./project-structure.md) - 了解项目组织方式
- [配置详解](./configuration.md) - 深入了解配置选项
- [性能优化](./performance.md) - 提升应用性能
- [代码审核](./code-review.md) - 代码质量保证

## 🎯 总结

通过本指南，你已经掌握了：

1. **完整的发布流程** - 从开发到生产的全链路部署
2. **自动化工具** - 提高部署效率和可靠性
3. **监控体系** - 及时发现和解决问题
4. **最佳实践** - 行业标准的部署策略

记住，良好的部署流程是项目成功的关键！🚀

---

*最后更新: 2025年*
