# 开发环境

搭建合适的开发环境是小程序开发的第一步。本指南将帮助你设置和配置小程序开发所需的工具和环境。

## 开发者工具

### 微信开发者工具

微信小程序开发需要使用官方提供的微信开发者工具。

#### 安装步骤

1. 访问[微信开发者工具下载页面](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 根据你的操作系统（Windows、macOS 或 Linux）下载相应版本
3. 按照安装向导完成安装

#### 基本配置

安装完成后，需要进行以下配置：

1. **登录微信账号**：使用开发者微信账号扫码登录
2. **创建/导入项目**：
   - 项目名称：为你的项目取一个名称
   - 目录：选择项目存储位置
   - AppID：填入你的小程序 AppID（可以使用测试号）
   - 开发模式：选择小程序开发
   - 语言：JavaScript 或 TypeScript

#### 开发者工具功能

微信开发者工具提供了多种功能来辅助开发：

- **编辑器**：内置代码编辑器，支持语法高亮和自动补全
- **调试器**：包含 console、network、storage 等调试面板
- **模拟器**：模拟小程序在手机上的运行效果
- **项目管理**：管理多个小程序项目
- **版本管理**：上传和管理小程序版本
- **性能监控**：分析小程序性能指标

### 支付宝开发者工具

如果你开发支付宝小程序，需要使用支付宝开发者工具。

#### 安装步骤

1. 访问[支付宝开发者工具下载页面](https://opendocs.alipay.com/mini/ide/download)
2. 下载适合你操作系统的版本
3. 按照安装向导完成安装

#### 基本配置

安装完成后的配置步骤：

1. **登录支付宝账号**：使用开发者支付宝账号登录
2. **创建/导入项目**：
   - 项目名称：为你的项目取一个名称
   - 目录：选择项目存储位置
   - AppID：填入你的小程序 AppID

### 其他平台开发者工具

其他小程序平台也有各自的开发者工具：

- **百度智能小程序开发者工具**：[下载链接](https://smartprogram.baidu.com/docs/develop/devtools/history/)
- **字节跳动小程序开发者工具**：[下载链接](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/developer-instrument/download/developer-instrument-update-and-download/)
- **QQ 小程序开发者工具**：[下载链接](https://q.qq.com/wiki/tools/devtool/)
- **快手小程序开发者工具**：[下载链接](https://mp.kuaishou.com/docs/develop/developerTools/downloadPath.html)

## 编辑器和 IDE

虽然各平台的开发者工具都内置了编辑器，但许多开发者更喜欢使用专业的编辑器或 IDE 进行开发。

### Visual Studio Code

VS Code 是一个流行的轻量级代码编辑器，非常适合小程序开发。

#### 安装步骤

1. 访问 [VS Code 官网](https://code.visualstudio.com/)
2. 下载并安装适合你操作系统的版本

#### 推荐扩展

为小程序开发配置 VS Code：

- **Miniprogram API**：提供微信小程序 API 的代码补全
- **WXML - Language Service**：WXML 语法高亮和自动补全
- **WXSS - Language Service**：WXSS 语法高亮
- **wechat-snippet**：微信小程序代码片段
- **ESLint**：代码质量检查
- **Prettier**：代码格式化
- **Path Intellisense**：路径自动补全

#### 配置示例

```json
// settings.json
{
  "editor.tabSize": 2,
  "editor.formatOnSave": true,
  "prettier.singleQuote": true,
  "prettier.semi": false,
  "eslint.validate": ["javascript", "wxml"],
  "files.associations": {
    "*.wxml": "html",
    "*.wxss": "css"
  }
}
```

### WebStorm

WebStorm 是一个功能强大的 JavaScript IDE，也可以用于小程序开发。

#### 安装步骤

1. 访问 [WebStorm 官网](https://www.jetbrains.com/webstorm/)
2. 下载并安装适合你操作系统的版本

#### 配置小程序开发

1. 安装 "WeChat Mini Program Support" 插件
2. 配置文件关联：
   - WXML 文件关联为 HTML
   - WXSS 文件关联为 CSS
   - JSON 文件使用默认关联

## Node.js 环境

Node.js 是小程序开发的基础环境，特别是当你使用构建工具或框架时。

### 安装 Node.js

#### 使用官方安装包

1. 访问 [Node.js 官网](https://nodejs.org/)
2. 下载并安装 LTS（长期支持）版本

#### 使用 NVM（推荐）

NVM（Node Version Manager）可以管理多个 Node.js 版本：

**Linux/macOS**：
```bash
# 安装 NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# 安装 Node.js
nvm install 16
nvm use 16
```

**Windows**：
使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)

### 包管理工具

#### npm

npm 是 Node.js 默认的包管理工具：

```bash
# 初始化项目
npm init

# 安装依赖
npm install packageName

# 安装开发依赖
npm install packageName --save-dev

# 全局安装
npm install packageName -g
```

#### Yarn

Yarn 是另一个流行的包管理工具：

```bash
# 安装 Yarn
npm install -g yarn

# 初始化项目
yarn init

# 安装依赖
yarn add packageName

# 安装开发依赖
yarn add packageName --dev

# 全局安装
yarn global add packageName
```

#### pnpm

pnpm 是一个快速、节省磁盘空间的包管理工具：

```bash
# 安装 pnpm
npm install -g pnpm

# 初始化项目
pnpm init

# 安装依赖
pnpm add packageName

# 安装开发依赖
pnpm add packageName -D

# 全局安装
pnpm add -g packageName
```

## 跨平台开发框架

使用跨平台开发框架可以提高开发效率，实现一次开发，多端部署。

### Taro

Taro 是一个开放式跨端跨框架解决方案。

#### 安装和使用

```bash
# 安装 Taro CLI
npm install -g @tarojs/cli

# 创建项目
taro init myApp

# 开发微信小程序
npm run dev:weapp

# 开发支付宝小程序
npm run dev:alipay

# 构建微信小程序
npm run build:weapp
```

### uni-app

uni-app 是一个使用 Vue.js 开发所有前端应用的框架。

#### 安装和使用

```bash
# 安装 Vue CLI
npm install -g @vue/cli

# 安装 uni-app CLI
npm install -g @dcloudio/vue-cli-plugin-uni

# 创建项目
vue create -p dcloudio/uni-preset-vue myApp

# 运行项目
npm run dev:mp-weixin
```

### Remax

Remax 是使用 React 开发小程序的框架。

#### 安装和使用

```bash
# 创建项目
npx create-remax-app myApp

# 开发微信小程序
npm run dev wechat

# 构建微信小程序
npm run build wechat
```

## 版本控制

使用版本控制系统对小程序项目进行管理是良好的开发实践。

### Git

Git 是最流行的版本控制系统。

#### 安装 Git

- **Windows**：下载并安装 [Git for Windows](https://git-scm.com/download/win)
- **macOS**：使用 Homebrew 安装 `brew install git`
- **Linux**：使用包管理器安装，如 `apt install git`

#### 基本配置

```bash
# 设置用户名和邮箱
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 初始化仓库
git init

# 添加文件
git add .

# 提交更改
git commit -m "Initial commit"
```

#### .gitignore 文件

为小程序项目创建适当的 .gitignore 文件：

```
# 依赖
node_modules/
miniprogram_npm/

# 构建输出
dist/

# 开发者工具配置
project.config.json

# 编辑器配置
.idea/
.vscode/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 日志
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

### 代码托管平台

选择一个代码托管平台来存储和协作开发你的小程序项目：

- **GitHub**：最流行的代码托管平台
- **GitLab**：提供完整的 DevOps 工具链
- **Bitbucket**：适合小团队，与 Atlassian 工具集成
- **Gitee**：中国本地化的代码托管平台

## 持续集成/持续部署 (CI/CD)

为小程序项目设置 CI/CD 可以自动化构建、测试和部署过程。

### GitHub Actions

使用 GitHub Actions 为小程序设置 CI/CD 流程：

```yaml
# .github/workflows/build.yml
name: Build Mini Program

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v2
    
    - name: Use Node.js
      uses: actions/setup-node@v1
      with:
        node-version: '16.x'
    
    - name: Install dependencies
      run: npm install
    
    - name: Lint
      run: npm run lint
    
    - name: Build
      run: npm run build:weapp
```

### Jenkins

Jenkins 是一个流行的开源自动化服务器，可用于小程序的 CI/CD：

1. 安装 Jenkins 服务器
2. 配置 Node.js 环境
3. 创建新的 Pipeline 任务
4. 配置 Git 仓库连接
5. 添加构建步骤：安装依赖、运行测试、构建小程序

## 调试和测试工具

### 真机调试

各平台开发者工具都支持真机调试：

1. 在开发者工具中点击"预览"或"真机调试"
2. 使用手机扫描生成的二维码
3. 在真机上进行测试和调试

### 自动化测试

为小程序设置自动化测试：

#### Jest

Jest 是一个流行的 JavaScript 测试框架：

```bash
# 安装 Jest
npm install --save-dev jest

# 配置 Jest
```

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.(js|ts)', '**/?(*.)+(spec|test).(js|ts)'],
};
```

#### miniprogram-simulate

微信小程序组件测试工具：

```bash
# 安装
npm install --save-dev miniprogram-simulate
```

```javascript
// 测试示例
const simulate = require('miniprogram-simulate');

test('component should work', () => {
  const id = simulate.load('/path/to/component');
  const comp = simulate.render(id, { prop: 'value' });
  
  // 测试逻辑
  expect(comp.data.innerValue).toBe('expected value');
});
```

## 开发环境最佳实践

1. **使用统一的开发环境**：确保团队成员使用相同版本的工具和依赖
2. **自动化重复任务**：使用脚本和工具自动化构建、测试和部署
3. **遵循代码规范**：使用 ESLint 和 Prettier 确保代码质量和一致性
4. **定期更新依赖**：保持依赖包的更新，修复安全漏洞
5. **使用环境变量**：区分开发、测试和生产环境
6. **文档化开发流程**：记录环境设置和开发流程，方便新成员加入

## 下一步

现在你已经设置好了小程序开发环境，可以继续学习：

- [项目结构](./project-structure.md)
- [页面开发](./page-development.md)
- [组件开发](./component-development.md)