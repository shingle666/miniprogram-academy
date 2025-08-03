# 小程序 CI/CD 自动化部署指南

持续集成和持续部署（CI/CD）是现代软件开发的重要实践，可以帮助小程序开发团队提高开发效率、保证代码质量、实现自动化部署。本指南将详细介绍如何为小程序项目搭建完整的 CI/CD 流程。

## CI/CD 概述

### 什么是 CI/CD

- **持续集成（CI）**：开发人员频繁地将代码集成到主分支，每次集成都通过自动化构建来验证
- **持续部署（CD）**：在持续集成的基础上，自动将通过测试的代码部署到生产环境

### 小程序 CI/CD 的价值

- **提高开发效率**：自动化构建、测试、部署流程
- **保证代码质量**：自动化代码检查、单元测试
- **减少人为错误**：标准化的部署流程
- **快速反馈**：及时发现和修复问题
- **版本管理**：自动化版本发布和回滚

## 技术栈选择

### 代码托管平台
- **GitHub**：最流行的代码托管平台
- **GitLab**：提供完整的 DevOps 解决方案
- **码云（Gitee）**：国内主流的代码托管平台
- **腾讯工蜂**：腾讯内部代码托管平台

### CI/CD 平台
- **GitHub Actions**：GitHub 原生 CI/CD 服务
- **GitLab CI/CD**：GitLab 集成的 CI/CD 服务
- **Jenkins**：开源的自动化服务器
- **腾讯云 CODING**：腾讯云提供的 DevOps 平台

### 构建工具
- **微信开发者工具 CLI**：官方命令行工具
- **miniprogram-ci**：微信小程序 CI 工具
- **Webpack**：模块打包工具
- **Gulp**：任务运行器

## 环境准备

### 安装微信开发者工具 CLI

```bash
# 全局安装微信开发者工具命令行
npm install -g miniprogram-ci

# 或者在项目中安装
npm install --save-dev miniprogram-ci
```

### 获取小程序密钥

1. **登录微信公众平台**
   - 进入小程序管理后台
   - 点击"开发" -> "开发管理" -> "开发设置"

2. **生成上传密钥**
   - 在"小程序代码上传"部分点击"生成"
   - 下载密钥文件（private.key）
   - 记录密钥 ID

3. **配置 IP 白名单**
   - 在"小程序代码上传"部分配置 IP 白名单
   - 添加 CI/CD 服务器的 IP 地址

### 项目配置

```javascript
// project.config.json
{
  "appid": "your-app-id",
  "projectname": "your-project-name",
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
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "enableEngineNative": false,
    "bundle": false,
    "useIsolateContext": true,
    "useCompilerModule": true,
    "userConfirmedUseCompilerModuleSwitch": false,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "srcMiniprogramRoot": "dist/",
  "packOptions": {
    "ignore": [
      {
        "type": "file",
        "value": ".eslintrc.js"
      },
      {
        "type": "file",
        "value": ".gitignore"
      },
      {
        "type": "file",
        "value": "README.md"
      }
    ]
  },
  "condition": {}
}
```

## GitHub Actions 实现

### 基础工作流配置

```yaml
# .github/workflows/ci.yml
name: 小程序 CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '16'

jobs:
  lint-and-test:
    name: 代码检查和测试
    runs-on: ubuntu-latest
    
    steps:
    - name: 检出代码
      uses: actions/checkout@v3
      
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: 安装依赖
      run: npm ci
      
    - name: 代码格式检查
      run: npm run lint
      
    - name: 类型检查
      run: npm run type-check
      
    - name: 单元测试
      run: npm run test
      
    - name: 构建项目
      run: npm run build
      
    - name: 上传构建产物
      uses: actions/upload-artifact@v3
      with:
        name: dist
        path: dist/
        retention-days: 1

  deploy-preview:
    name: 部署预览版本
    runs-on: ubuntu-latest
    needs: lint-and-test
    if: github.event_name == 'pull_request'
    
    steps:
    - name: 检出代码
      uses: actions/checkout@v3
      
    - name: 下载构建产物
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
        
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        
    - name: 安装 miniprogram-ci
      run: npm install -g miniprogram-ci
      
    - name: 创建密钥文件
      run: echo "${{ secrets.MINIPROGRAM_PRIVATE_KEY }}" > private.key
      
    - name: 上传预览版本
      run: |
        node scripts/upload-preview.js
      env:
        APPID: ${{ secrets.MINIPROGRAM_APPID }}
        PRIVATE_KEY_PATH: ./private.key
        
    - name: 清理密钥文件
      run: rm -f private.key

  deploy-production:
    name: 部署生产版本
    runs-on: ubuntu-latest
    needs: lint-and-test
    if: github.ref == 'refs/heads/main'
    
    steps:
    - name: 检出代码
      uses: actions/checkout@v3
      
    - name: 下载构建产物
      uses: actions/download-artifact@v3
      with:
        name: dist
        path: dist/
        
    - name: 设置 Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        
    - name: 安装 miniprogram-ci
      run: npm install -g miniprogram-ci
      
    - name: 创建密钥文件
      run: echo "${{ secrets.MINIPROGRAM_PRIVATE_KEY }}" > private.key
      
    - name: 上传生产版本
      run: |
        node scripts/upload-production.js
      env:
        APPID: ${{ secrets.MINIPROGRAM_APPID }}
        PRIVATE_KEY_PATH: ./private.key
        
    - name: 清理密钥文件
      run: rm -f private.key
      
    - name: 创建 GitHub Release
      uses: actions/create-release@v1
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
      with:
        tag_name: v${{ github.run_number }}
        release_name: Release v${{ github.run_number }}
        body: |
          自动发布版本 v${{ github.run_number }}
          
          提交信息: ${{ github.event.head_commit.message }}
          提交者: ${{ github.event.head_commit.author.name }}
        draft: false
        prerelease: false
```

### 上传脚本

#### 预览版本上传脚本

```javascript
// scripts/upload-preview.js
const ci = require('miniprogram-ci')
const path = require('path')
const fs = require('fs')

async function uploadPreview() {
  try {
    // 读取项目配置
    const projectConfig = JSON.parse(
      fs.readFileSync('./project.config.json', 'utf8')
    )
    
    // 创建项目实例
    const project = new ci.Project({
      appid: process.env.APPID,
      type: 'miniProgram',
      projectPath: path.resolve('./'),
      privateKeyPath: path.resolve(process.env.PRIVATE_KEY_PATH),
      ignores: ['node_modules/**/*']
    })
    
    // 获取版本信息
    const version = `preview-${Date.now()}`
    const desc = `预览版本 - ${new Date().toLocaleString()}`
    
    console.log('开始上传预览版本...')
    console.log(`版本: ${version}`)
    console.log(`描述: ${desc}`)
    
    // 上传预览版本
    const previewResult = await ci.preview({
      project,
      desc: desc,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        codeProtect: false,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        autoPrefixWXSS: true
      },
      qrcodeFormat: 'image',
      qrcodeOutputDest: path.resolve('./preview-qrcode.jpg'),
      onProgressUpdate: (info) => {
        console.log('上传进度:', info)
      }
    })
    
    console.log('预览版本上传成功!')
    console.log('预览二维码已保存到: preview-qrcode.jpg')
    
    return previewResult
  } catch (error) {
    console.error('上传预览版本失败:', error)
    process.exit(1)
  }
}

uploadPreview()
```

#### 生产版本上传脚本

```javascript
// scripts/upload-production.js
const ci = require('miniprogram-ci')
const path = require('path')
const fs = require('fs')

async function uploadProduction() {
  try {
    // 读取 package.json 获取版本号
    const packageJson = JSON.parse(
      fs.readFileSync('./package.json', 'utf8')
    )
    
    // 创建项目实例
    const project = new ci.Project({
      appid: process.env.APPID,
      type: 'miniProgram',
      projectPath: path.resolve('./'),
      privateKeyPath: path.resolve(process.env.PRIVATE_KEY_PATH),
      ignores: ['node_modules/**/*']
    })
    
    // 版本信息
    const version = packageJson.version
    const desc = `生产版本 v${version} - ${new Date().toLocaleString()}`
    
    console.log('开始上传生产版本...')
    console.log(`版本: ${version}`)
    console.log(`描述: ${desc}`)
    
    // 上传代码
    const uploadResult = await ci.upload({
      project,
      version: version,
      desc: desc,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        codeProtect: true,
        minifyJS: true,
        minifyWXML: true,
        minifyWXSS: true,
        autoPrefixWXSS: true
      },
      onProgressUpdate: (info) => {
        console.log('上传进度:', info)
      }
    })
    
    console.log('生产版本上传成功!')
    console.log('上传结果:', uploadResult)
    
    // 可选：自动提交审核
    if (process.env.AUTO_SUBMIT === 'true') {
      console.log('开始提交审核...')
      
      const submitResult = await ci.submitAudit({
        project,
        version: version,
        desc: desc,
        auditInfo: {
          first_class: '工具',
          second_class: '效率',
          first_item: '00',
          second_item: '00',
          title: packageJson.name
        }
      })
      
      console.log('提交审核成功!', submitResult)
    }
    
    return uploadResult
  } catch (error) {
    console.error('上传生产版本失败:', error)
    process.exit(1)
  }
}

uploadProduction()
```

### 环境变量配置

在 GitHub 仓库的 Settings -> Secrets and variables -> Actions 中添加以下环境变量：

```
MINIPROGRAM_APPID: 小程序 AppID
MINIPROGRAM_PRIVATE_KEY: 上传密钥内容（private.key 文件的完整内容）
```

## GitLab CI/CD 实现

### GitLab CI 配置

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - test
  - build
  - deploy

variables:
  NODE_VERSION: "16"
  DOCKER_DRIVER: overlay2

# 缓存配置
cache:
  paths:
    - node_modules/
    - .npm/

before_script:
  - apt-get update -qq && apt-get install -y -qq git curl
  - curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
  - apt-get install -y nodejs
  - npm ci --cache .npm --prefer-offline

# 代码检查
lint:
  stage: lint
  script:
    - npm run lint
    - npm run type-check
  only:
    - merge_requests
    - main
    - develop

# 单元测试
test:
  stage: test
  script:
    - npm run test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
  only:
    - merge_requests
    - main
    - develop

# 构建
build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
  only:
    - merge_requests
    - main
    - develop

# 部署预览版本
deploy:preview:
  stage: deploy
  dependencies:
    - build
  script:
    - npm install -g miniprogram-ci
    - echo "$MINIPROGRAM_PRIVATE_KEY" > private.key
    - node scripts/upload-preview.js
    - rm -f private.key
  environment:
    name: preview
  only:
    - merge_requests

# 部署生产版本
deploy:production:
  stage: deploy
  dependencies:
    - build
  script:
    - npm install -g miniprogram-ci
    - echo "$MINIPROGRAM_PRIVATE_KEY" > private.key
    - node scripts/upload-production.js
    - rm -f private.key
  environment:
    name: production
  only:
    - main
  when: manual
```

## Jenkins 实现

### Jenkinsfile 配置

```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '16'
        MINIPROGRAM_APPID = credentials('miniprogram-appid')
        MINIPROGRAM_PRIVATE_KEY = credentials('miniprogram-private-key')
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                script {
                    // 安装 Node.js
                    sh '''
                        curl -sL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
                        sudo apt-get install -y nodejs
                    '''
                    
                    // 安装依赖
                    sh 'npm ci'
                }
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
                sh 'npm run type-check'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm run test'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results.xml'
                    publishCoverage adapters: [
                        coberturaAdapter('coverage/cobertura-coverage.xml')
                    ]
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
            post {
                success {
                    archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                }
            }
        }
        
        stage('Deploy Preview') {
            when {
                changeRequest()
            }
            steps {
                script {
                    sh '''
                        npm install -g miniprogram-ci
                        echo "$MINIPROGRAM_PRIVATE_KEY" > private.key
                        node scripts/upload-preview.js
                        rm -f private.key
                    '''
                }
            }
        }
        
        stage('Deploy Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    sh '''
                        npm install -g miniprogram-ci
                        echo "$MINIPROGRAM_PRIVATE_KEY" > private.key
                        node scripts/upload-production.js
                        rm -f private.key
                    '''
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            emailext (
                subject: "构建成功: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "构建成功，详情请查看: ${env.BUILD_URL}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
        failure {
            emailext (
                subject: "构建失败: ${env.JOB_NAME} - ${env.BUILD_NUMBER}",
                body: "构建失败，详情请查看: ${env.BUILD_URL}",
                to: "${env.CHANGE_AUTHOR_EMAIL}"
            )
        }
    }
}
```

## 高级功能

### 多环境部署

```javascript
// scripts/deploy.js
const ci = require('miniprogram-ci')
const path = require('path')
const fs = require('fs')

// 环境配置
const environments = {
  dev: {
    appid: process.env.DEV_APPID,
    privateKeyPath: './keys/dev-private.key',
    desc: '开发环境'
  },
  test: {
    appid: process.env.TEST_APPID,
    privateKeyPath: './keys/test-private.key',
    desc: '测试环境'
  },
  prod: {
    appid: process.env.PROD_APPID,
    privateKeyPath: './keys/prod-private.key',
    desc: '生产环境'
  }
}

async function deploy(env) {
  const config = environments[env]
  if (!config) {
    throw new Error(`未知环境: ${env}`)
  }
  
  console.log(`开始部署到 ${config.desc}...`)
  
  const project = new ci.Project({
    appid: config.appid,
    type: 'miniProgram',
    projectPath: path.resolve('./'),
    privateKeyPath: path.resolve(config.privateKeyPath),
    ignores: ['node_modules/**/*']
  })
  
  const packageJson = JSON.parse(
    fs.readFileSync('./package.json', 'utf8')
  )
  
  const version = `${packageJson.version}-${env}`
  const desc = `${config.desc} v${version} - ${new Date().toLocaleString()}`
  
  const result = await ci.upload({
    project,
    version: version,
    desc: desc,
    setting: {
      es6: true,
      es7: true,
      minify: env === 'prod',
      codeProtect: env === 'prod',
      minifyJS: true,
      minifyWXML: true,
      minifyWXSS: true,
      autoPrefixWXSS: true
    },
    onProgressUpdate: (info) => {
      console.log(`${config.desc} 上传进度:`, info)
    }
  })
  
  console.log(`${config.desc} 部署成功!`)
  return result
}

// 从命令行参数获取环境
const env = process.argv[2] || 'dev'
deploy(env).catch(console.error)
```

### 自动化测试集成

```javascript
// scripts/e2e-test.js
const puppeteer = require('puppeteer')
const ci = require('miniprogram-ci')

async function runE2ETests() {
  console.log('开始端到端测试...')
  
  // 1. 上传测试版本
  const project = new ci.Project({
    appid: process.env.TEST_APPID,
    type: 'miniProgram',
    projectPath: path.resolve('./'),
    privateKeyPath: path.resolve('./test-private.key'),
    ignores: ['node_modules/**/*']
  })
  
  const previewResult = await ci.preview({
    project,
    desc: 'E2E 测试版本',
    setting: {
      es6: true,
      minify: false
    },
    qrcodeFormat: 'base64'
  })
  
  // 2. 启动浏览器进行自动化测试
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true
  })
  
  const page = await browser.newPage()
  
  try {
    // 模拟小程序测试场景
    await page.goto('https://developers.weixin.qq.com/s/simulator')
    
    // 扫描预览二维码
    await page.evaluate((qrcode) => {
      // 注入二维码到模拟器
      document.querySelector('#qrcode-input').value = qrcode
    }, previewResult.qrCodeBuffer.toString('base64'))
    
    // 等待小程序加载
    await page.waitForTimeout(5000)
    
    // 执行测试用例
    await runTestCases(page)
    
    console.log('E2E 测试通过!')
  } catch (error) {
    console.error('E2E 测试失败:', error)
    throw error
  } finally {
    await browser.close()
  }
}

async function runTestCases(page) {
  // 测试用例 1: 首页加载
  await page.waitForSelector('.home-page')
  console.log('✓ 首页加载成功')
  
  // 测试用例 2: 导航功能
  await page.click('.nav-item[data-page="profile"]')
  await page.waitForSelector('.profile-page')
  console.log('✓ 页面导航成功')
  
  // 测试用例 3: 表单提交
  await page.type('.form-input[name="username"]', 'testuser')
  await page.click('.submit-button')
  await page.waitForSelector('.success-message')
  console.log('✓ 表单提交成功')
}

if (require.main === module) {
  runE2ETests().catch(console.error)
}
```

### 版本管理和回滚

```javascript
// scripts/version-manager.js
const ci = require('miniprogram-ci')
const fs = require('fs')
const path = require('path')

class VersionManager {
  constructor(appid, privateKeyPath) {
    this.project = new ci.Project({
      appid,
      type: 'miniProgram',
      projectPath: path.resolve('./'),
      privateKeyPath: path.resolve(privateKeyPath),
      ignores: ['node_modules/**/*']
    })
    
    this.versionsFile = './versions.json'
  }
  
  // 获取版本历史
  getVersionHistory() {
    if (fs.existsSync(this.versionsFile)) {
      return JSON.parse(fs.readFileSync(this.versionsFile, 'utf8'))
    }
    return []
  }
  
  // 保存版本信息
  saveVersion(version, desc, commitHash) {
    const versions = this.getVersionHistory()
    versions.unshift({
      version,
      desc,
      commitHash,
      timestamp: new Date().toISOString(),
      status: 'uploaded'
    })
    
    // 只保留最近 50 个版本
    if (versions.length > 50) {
      versions.splice(50)
    }
    
    fs.writeFileSync(this.versionsFile, JSON.stringify(versions, null, 2))
  }
  
  // 部署新版本
  async deploy(version, desc, commitHash) {
    console.log(`部署版本 ${version}...`)
    
    const result = await ci.upload({
      project: this.project,
      version,
      desc,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        codeProtect: true
      },
      onProgressUpdate: (info) => {
        console.log('上传进度:', info)
      }
    })
    
    this.saveVersion(version, desc, commitHash)
    console.log(`版本 ${version} 部署成功!`)
    
    return result
  }
  
  // 回滚到指定版本
  async rollback(targetVersion) {
    const versions = this.getVersionHistory()
    const targetVersionInfo = versions.find(v => v.version === targetVersion)
    
    if (!targetVersionInfo) {
      throw new Error(`版本 ${targetVersion} 不存在`)
    }
    
    console.log(`回滚到版本 ${targetVersion}...`)
    
    // 检出指定版本的代码
    const { execSync } = require('child_process')
    execSync(`git checkout ${targetVersionInfo.commitHash}`)
    
    try {
      // 重新构建
      execSync('npm run build')
      
      // 部署
      const rollbackVersion = `${targetVersion}-rollback-${Date.now()}`
      const result = await ci.upload({
        project: this.project,
        version: rollbackVersion,
        desc: `回滚到版本 ${targetVersion}`,
        setting: {
          es6: true,
          es7: true,
          minify: true,
          codeProtect: true
        }
      })
      
      console.log(`回滚到版本 ${targetVersion} 成功!`)
      return result
    } finally {
      // 回到最新代码
      execSync('git checkout main')
    }
  }
  
  // 列出版本历史
  listVersions() {
    const versions = this.getVersionHistory()
    console.log('版本历史:')
    versions.forEach((version, index) => {
      console.log(`${index + 1}. ${version.version} - ${version.desc}`)
      console.log(`   时间: ${version.timestamp}`)
      console.log(`   提交: ${version.commitHash}`)
      console.log(`   状态: ${version.status}`)
      console.log('')
    })
  }
}

// 命令行接口
if (require.main === module) {
  const [,, command, ...args] = process.argv
  
  const manager = new VersionManager(
    process.env.MINIPROGRAM_APPID,
    process.env.PRIVATE_KEY_PATH
  )
  
  switch (command) {
    case 'deploy':
      const [version, desc, commitHash] = args
      manager.deploy(version, desc, commitHash).catch(console.error)
      break
      
    case 'rollback':
      const [targetVersion] = args
      manager.rollback(targetVersion).catch(console.error)
      break
      
    case 'list':
      manager.listVersions()
      break
      
    default:
      console.log('用法:')
      console.log('  node version-manager.js deploy <version> <desc> <commit>')
      console.log('  node version-manager.js rollback <version>')
      console.log('  node version-manager.js list')
  }
}
```

## 监控和通知

### 部署状态通知

```javascript
// scripts/notification.js
const axios = require('axios')

class NotificationService {
  constructor() {
    this.webhooks = {
      slack: process.env.SLACK_WEBHOOK_URL,
      dingtalk: process.env.DINGTALK_WEBHOOK_URL,
      wechat: process.env.WECHAT_WEBHOOK_URL
    }
  }
  
  // 发送 Slack 通知
  async sendSlackNotification(message, color = 'good') {
    if (!this.webhooks.slack) return
    
    try {
      await axios.post(this.webhooks.slack, {
        attachments: [{
          color: color,
          text: message,
          ts: Math.floor(Date.now() / 1000)
        }]
      })
      console.log('Slack 通知发送成功')
    } catch (error) {
      console.error('Slack 通知发送失败:', error.message)
    }
  }
  
  // 发送钉钉通知
  async sendDingTalkNotification(message) {
    if (!this.webhooks.dingtalk) return
    
    try {
      await axios.post(this.webhooks.dingtalk, {
        msgtype: 'text',
        text: {
          content: message
        }
      })
      console.log('钉钉通知发送成功')
    } catch (error) {
      console.error('钉钉通知发送失败:', error.message)
    }
  }
  
  // 发送企业微信通知
  async sendWeChatNotification(message) {
    if (!this.webhooks.wechat) return
    
    try {
      await axios.post(this.webhooks.wechat, {
        msgtype: 'text',
        text: {
          content: message
        }
      })
      console.log('企业微信通知发送成功')
    } catch (error) {
      console.error('企业微信通知发送失败:', error.message)
    }
  }
  
  // 发送部署成功通知
  async notifyDeploySuccess(version, environment, commitHash) {
    const message = `🎉 小程序部署成功！
版本: ${version}
环境: ${environment}
提交: ${commitHash}
时间: ${new Date().toLocaleString()}`
    
    await Promise.all([
      this.sendSlackNotification(message, 'good'),
      this.sendDingTalkNotification(message),
      this.sendWeChatNotification(message)
    ])
  }
  
  // 发送部署失败通知
  async notifyDeployFailure(version, environment, error) {
    const message = `❌ 小程序部署失败！
版本: ${version}
环境: ${environment}
错误: ${error}
时间: ${new Date().toLocaleString()}`
    
    await Promise.all([
      this.sendSlackNotification(message, 'danger'),
      this.sendDingTalkNotification(message),
      this.sendWeChatNotification(message)
    ])
  }
}

module.exports = NotificationService
```

### 集成通知到部署脚本

```javascript
// scripts/deploy-with-notification.js
const ci = require('miniprogram-ci')
const NotificationService = require('./notification')

async function deployWithNotification() {
  const notification = new NotificationService()
  const version = process.env.VERSION || '1.0.0'
  const environment = process.env.ENVIRONMENT || 'production'
  const commitHash = process.env.COMMIT_HASH || 'unknown'
  
  try {
    console.log(`开始部署版本 ${version} 到 ${environment}...`)
    
    // 创建项目实例
    const project = new ci.Project({
      appid: process.env.MINIPROGRAM_APPID,
      type: 'miniProgram',
      projectPath: path.resolve('./'),
      privateKeyPath: path.resolve(process.env.PRIVATE_KEY_PATH),
      ignores: ['node_modules/**/*']
    })
    
    // 上传代码
    const result = await ci.upload({
      project,
      version: version,
      desc: `${environment} 环境部署 v${version}`,
      setting: {
        es6: true,
        es7: true,
        minify: environment === 'production',
        codeProtect: environment === 'production'
      },
      onProgressUpdate: (info) => {
        console.log('上传进度:', info)
      }
    })
    
    console.log('部署成功!')
    await notification.notifyDeploySuccess(version, environment, commitHash)
    
    return result
  } catch (error) {
    console.error('部署失败:', error)
    await notification.notifyDeployFailure(version, environment, error.message)
    throw error
  }
}

deployWithNotification().catch(process.exit)
```

## 性能监控

### 构建时间监控

```javascript
// scripts/build-monitor.js
const fs = require('fs')
const path = require('path')

class BuildMonitor {
  constructor() {
    this.startTime = Date.now()
    this.stages = []
    this.metricsFile = './build-metrics.json'
  }
  
  // 记录阶段开始
  startStage(name) {
    const stage = {
      name,
      startTime: Date.now(),
      endTime: null,
      duration: null
    }
    this.stages.push(stage)
    console.log(`[BUILD] 开始阶段: ${name}`)
    return stage
  }
  
  // 记录阶段结束
  endStage(stage) {
    stage.endTime = Date.now()
    stage.duration = stage.endTime - stage.startTime
    console.log(`[BUILD] 完成阶段: ${stage.name} (${stage.duration}ms)`)
  }
  
  // 生成构建报告
  generateReport() {
    const totalDuration = Date.now() - this.startTime
    const report = {
      timestamp: new Date().toISOString(),
      totalDuration,
      stages: this.stages,
      summary: {
        totalStages: this.stages.length,
        averageStageTime: this.stages.reduce((sum, stage) => sum + stage.duration, 0) / this.stages.length,
        slowestStage: this.stages.reduce((slowest, stage) => 
          stage.duration > slowest.duration ? stage : slowest
        )
      }
    }
    
    // 保存到文件
    this.saveMetrics(report)
    
    // 输出报告
    console.log('\n=== 构建性能报告 ===')
    console.log(`总耗时: ${totalDuration}ms`)
    console.log(`总阶段数: ${report.summary.totalStages}`)
    console.log(`平均阶段耗时: ${Math.round(report.summary.averageStageTime)}ms`)
    console.log(`最慢阶段: ${report.summary.slowestStage.name} (${report.summary.slowestStage.duration}ms)`)
    
    return report
  }
  
  // 保存性能指标
  saveMetrics(report) {
    let metrics = []
    if (fs.existsSync(this.metricsFile)) {
      metrics = JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'))
    }
    
    metrics.push(report)
    
    // 只保留最近 100 次构建记录
    if (metrics.length > 100) {
      metrics = metrics.slice(-100)
    }
    
    fs.writeFileSync(this.metricsFile, JSON.stringify(metrics, null, 2))
  }
  
  // 分析性能趋势
  analyzeTrends() {
    if (!fs.existsSync(this.metricsFile)) {
      console.log('没有历史构建数据')
      return
    }
    
    const metrics = JSON.parse(fs.readFileSync(this.metricsFile, 'utf8'))
    if (metrics.length < 2) {
      console.log('构建数据不足，无法分析趋势')
      return
    }
    
    const recent = metrics.slice(-10) // 最近 10 次构建
    const avgDuration = recent.reduce((sum, m) => sum + m.totalDuration, 0) / recent.length
    const lastDuration = metrics[metrics.length - 1].totalDuration
    
    console.log('\n=== 性能趋势分析 ===')
    console.log(`最近 10 次构建平均耗时: ${Math.round(avgDuration)}ms`)
    console.log(`本次构建耗时: ${lastDuration}ms`)
    
    if (lastDuration > avgDuration * 1.2) {
      console.log('⚠️  本次构建耗时异常，建议检查构建环境')
    } else if (lastDuration < avgDuration * 0.8) {
      console.log('✅ 本次构建性能良好')
    } else {
      console.log('ℹ️  本次构建耗时正常')
    }
  }
}

module.exports = BuildMonitor
```

### 在构建脚本中使用监控

```javascript
// scripts/monitored-build.js
const BuildMonitor = require('./build-monitor')
const { execSync } = require('child_process')

async function monitoredBuild() {
  const monitor = new BuildMonitor()
  
  try {
    // 安装依赖
    let stage = monitor.startStage('安装依赖')
    execSync('npm ci', { stdio: 'inherit' })
    monitor.endStage(stage)
    
    // 代码检查
    stage = monitor.startStage('代码检查')
    execSync('npm run lint', { stdio: 'inherit' })
    monitor.endStage(stage)
    
    // 类型检查
    stage = monitor.startStage('类型检查')
    execSync('npm run type-check', { stdio: 'inherit' })
    monitor.endStage(stage)
    
    // 单元测试
    stage = monitor.startStage('单元测试')
    execSync('npm run test', { stdio: 'inherit' })
    monitor.endStage(stage)
    
    // 构建项目
    stage = monitor.startStage('构建项目')
    execSync('npm run build', { stdio: 'inherit' })
    monitor.endStage(stage)
    
    // 生成报告
    const report = monitor.generateReport()
    monitor.analyzeTrends()
    
    return report
  } catch (error) {
    console.error('构建失败:', error.message)
    monitor.generateReport()
    throw error
  }
}

if (require.main === module) {
  monitoredBuild().catch(process.exit)
}
```

## 安全最佳实践

### 密钥管理

```javascript
// scripts/key-manager.js
const crypto = require('crypto')
const fs = require('fs')

class KeyManager {
  constructor() {
    this.algorithm = 'aes-256-gcm'
  }
  
  // 加密密钥文件
  encryptKey(keyPath, password) {
    const keyContent = fs.readFileSync(keyPath)
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(this.algorithm, password)
    
    let encrypted = cipher.update(keyContent)
    encrypted = Buffer.concat([encrypted, cipher.final()])
    
    const authTag = cipher.getAuthTag()
    
    const result = {
      iv: iv.toString('hex'),
      authTag: authTag.toString('hex'),
      encrypted: encrypted.toString('hex')
    }
    
    fs.writeFileSync(`${keyPath}.encrypted`, JSON.stringify(result))
    console.log('密钥文件加密完成')
  }
  
  // 解密密钥文件
  decryptKey(encryptedKeyPath, password, outputPath) {
    const encryptedData = JSON.parse(fs.readFileSync(encryptedKeyPath, 'utf8'))
    
    const decipher = crypto.createDecipher(this.algorithm, password)
    decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
    
    let decrypted = decipher.update(Buffer.from(encryptedData.encrypted, 'hex'))
    decrypted = Buffer.concat([decrypted, decipher.final()])
    
    fs.writeFileSync(outputPath, decrypted)
    console.log('密钥文件解密完成')
  }
  
  // 临时解密密钥（用于 CI/CD）
  async withTempKey(encryptedKeyPath, password, callback) {
    const tempKeyPath = `/tmp/temp-key-${Date.now()}.key`
    
    try {
      this.decryptKey(encryptedKeyPath, password, tempKeyPath)
      await callback(tempKeyPath)
    } finally {
      // 确保清理临时文件
      if (fs.existsSync(tempKeyPath)) {
        fs.unlinkSync(tempKeyPath)
      }
    }
  }
}

module.exports = KeyManager
```

### 安全的部署脚本

```javascript
// scripts/secure-deploy.js
const ci = require('miniprogram-ci')
const KeyManager = require('./key-manager')

async function secureDeploy() {
  const keyManager = new KeyManager()
  const encryptedKeyPath = './keys/private.key.encrypted'
  const keyPassword = process.env.KEY_PASSWORD
  
  if (!keyPassword) {
    throw new Error('KEY_PASSWORD 环境变量未设置')
  }
  
  await keyManager.withTempKey(encryptedKeyPath, keyPassword, async (tempKeyPath) => {
    const project = new ci.Project({
      appid: process.env.MINIPROGRAM_APPID,
      type: 'miniProgram',
      projectPath: path.resolve('./'),
      privateKeyPath: tempKeyPath,
      ignores: ['node_modules/**/*']
    })
    
    const result = await ci.upload({
      project,
      version: process.env.VERSION,
      desc: process.env.DESC,
      setting: {
        es6: true,
        es7: true,
        minify: true,
        codeProtect: true
      }
    })
    
    console.log('安全部署完成')
    return result
  })
}

secureDeploy().catch(console.error)
```

## 故障排查

### 常见问题及解决方案

#### 1. 上传失败问题

```javascript
// scripts/troubleshoot.js
const ci = require('miniprogram-ci')

async function diagnoseUploadIssues() {
  console.log('开始诊断上传问题...')
  
  // 检查网络连接
  try {
    const https = require('https')
    await new Promise((resolve, reject) => {
      const req = https.request('https://api.weixin.qq.com', { method: 'HEAD' }, resolve)
      req.on('error', reject)
      req.end()
    })
    console.log('✅ 网络连接正常')
  } catch (error) {
    console.log('❌ 网络连接异常:', error.message)
  }
  
  // 检查密钥文件
  const keyPath = process.env.PRIVATE_KEY_PATH
  if (!keyPath || !require('fs').existsSync(keyPath)) {
    console.log('❌ 密钥文件不存在')
  } else {
    console.log('✅ 密钥文件存在')
  }
  
  // 检查项目配置
  try {
    const config = JSON.parse(require('fs').readFileSync('./project.config.json', 'utf8'))
    if (!config.appid) {
      console.log('❌ project.config.json 中缺少 appid')
    } else {
      console.log('✅ 项目配置正常')
    }
  } catch (error) {
    console.log('❌ 项目配置文件异常:', error.message)
  }
  
  // 检查构建产物
  if (!require('fs').existsSync('./dist')) {
    console.log('❌ 构建产物目录不存在，请先运行构建')
  } else {
    console.log('✅ 构建产物存在')
  }
}

if (require.main === module) {
  diagnoseUploadIssues()
}
```

#### 2. 自动重试机制

```javascript
// scripts/retry-upload.js
const ci = require('miniprogram-ci')

async function uploadWithRetry(options, maxRetries = 3) {
  let lastError
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`尝试上传 (${i + 1}/${maxRetries})...`)
      
      const result = await ci.upload(options)
      console.log('上传成功!')
      return result
    } catch (error) {
      lastError = error
      console.log(`上传失败 (${i + 1}/${maxRetries}):`, error.message)
      
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 // 指数退避
        console.log(`等待 ${delay}ms 后重试...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw new Error(`上传失败，已重试 ${maxRetries} 次。最后错误: ${lastError.message}`)
}

module.exports = { uploadWithRetry }
```

## 最佳实践总结

### 1. 分支策略

```
main (生产环境)
├── develop (开发环境)
├── feature/* (功能分支)
├── hotfix/* (热修复分支)
└── release/* (发布分支)
```

### 2. 版本命名规范

```
主版本号.次版本号.修订号[-预发布版本号]

示例:
- 1.0.0 (正式版本)
- 1.1.0-beta.1 (测试版本)
- 1.0.1-hotfix.1 (热修复版本)
```

### 3. 提交信息规范

```
<type>(<scope>): <subject>

type: feat, fix, docs, style, refactor, test, chore
scope: 影响范围
subject: 简短描述

示例:
feat(auth): 添加微信登录功能
fix(api): 修复用户信息获取异常
docs(readme): 更新部署文档
```

### 4. 环境变量管理

```bash
# 开发环境
NODE_ENV=development
MINIPROGRAM_APPID=dev-appid
API_BASE_URL=https://dev-api.example.com

# 生产环境
NODE_ENV=production
MINIPROGRAM_APPID=prod-appid
API_BASE_URL=https://api.example.com
```

### 5. 代码质量检查

```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.ts,.vue",
    "lint:fix": "eslint src --ext .js,.ts,.vue --fix",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

## 扩展资源

### 官方文档
- [miniprogram-ci 官方文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [小程序发布流程](https://developers.weixin.qq.com/miniprogram/dev/framework/quickstart/release.html)

### 工具推荐
- **GitHub Actions**: 免费的 CI/CD 服务
- **GitLab CI/CD**: 功能强大的 DevOps 平台
- **Jenkins**: 灵活的自动化服务器
- **Docker**: 容器化部署

### 监控工具
- **Sentry**: 错误监控和性能监控
- **LogRocket**: 用户行为录制和分析
- **Fundebug**: 小程序错误监控

通过本指南，你应该能够为小程序项目搭建完整的 CI/CD 流程，实现自动化构建、测试和部署，提高开发效率和代码质量。
