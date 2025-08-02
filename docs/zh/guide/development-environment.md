# 开发环境

搭建一个高效的小程序开发环境是成功开发的基础。本章将详细介绍各种开发工具的安装、配置和使用。

## 🛠️ 开发工具概览

### 官方开发工具对比

| 平台 | 工具名称 | 支持系统 | 特色功能 |
|------|----------|----------|----------|
| 微信 | 微信开发者工具 | Windows/Mac/Linux | 真机调试、云开发 |
| 支付宝 | 支付宝开发者工具 | Windows/Mac | 实时预览、性能分析 |
| 百度 | 百度开发者工具 | Windows/Mac | AI能力集成 |
| 字节跳动 | 字节跳动开发者工具 | Windows/Mac | 抖音生态集成 |

## 📱 微信开发者工具

### 下载安装

1. **官方下载**
   - 访问：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   - 选择对应操作系统版本
   - 下载并安装

2. **版本选择**
   ```
   稳定版 (Stable)    - 推荐生产环境使用
   预发布版 (RC)      - 新功能预览
   开发版 (Nightly)   - 最新功能，可能不稳定
   ```

### 首次启动配置

1. **登录微信账号**
   ```
   使用微信扫码登录
   → 确认开发者身份
   → 获取开发权限
   ```

2. **创建项目**
   ```
   项目名称: my-miniprogram
   目录: /path/to/project
   AppID: 你的小程序AppID
   开发模式: 小程序
   ```

### 界面布局

```
┌─────────────────────────────────────────────────────────┐
│  菜单栏: 文件 编辑 工具 项目 调试 设置 窗口 帮助          │
├─────────────────────────────────────────────────────────┤
│  工具栏: [编译] [预览] [真机调试] [清缓存] [上传]        │
├──────────────┬──────────────────┬───────────────────────┤
│              │                  │                       │
│   文件树     │    代码编辑器     │      模拟器           │
│              │                  │                       │
│  📁 pages    │  index.wxml      │  ┌─────────────────┐  │
│  📁 utils    │  index.js        │  │                 │  │
│  📁 images   │  index.wxss      │  │   小程序预览     │  │
│  📄 app.js   │  index.json      │  │                 │  │
│  📄 app.json │                  │  └─────────────────┘  │
│              │                  │                       │
├──────────────┴──────────────────┴───────────────────────┤
│  调试面板: Console | Sources | Network | Storage        │
└─────────────────────────────────────────────────────────┘
```

### 核心功能

#### 1. 编译和预览
```javascript
// 自动编译
// 保存文件时自动编译并刷新预览

// 手动编译
// 点击工具栏"编译"按钮

// 编译模式
// 普通编译 - 从首页开始
// 自定义编译 - 指定页面和参数
```

#### 2. 真机调试
```
步骤：
1. 点击"真机调试"按钮
2. 微信扫描二维码
3. 在手机上打开调试版本
4. 在开发工具中查看调试信息
```

#### 3. 性能分析
```javascript
// 性能面板功能
- CPU使用率监控
- 内存使用情况
- 网络请求分析
- 渲染性能检测
```

## 🔧 代码编辑器配置

### VS Code 推荐配置

#### 1. 安装插件
```json
{
  "recommendations": [
    "ms-ceintl.vscode-language-pack-zh-hans",
    "johnsoncodehk.volar",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

#### 2. 工作区配置
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
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

#### 3. 代码片段
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
      "  }",
      "})"
    ]
  }
}
```

### WebStorm 配置

#### 1. 文件类型关联
```
Settings → Editor → File Types
- HTML: 添加 *.wxml
- CSS: 添加 *.wxss  
- JavaScript: 添加 *.wxs
```

#### 2. 代码模板
```javascript
// Live Templates
Page({
  data: {
    $VAR1$
  },
  
  onLoad(options) {
    $VAR2$
  },
  
  $END$
})
```

## 🌐 跨平台开发环境

### uni-app 开发环境

#### 1. HBuilderX 安装
```bash
# 下载地址
https://www.dcloud.io/hbuilderx.html

# 版本选择
标准版 - 基础功能
App开发版 - 包含App打包功能
```

#### 2. 命令行工具
```bash
# 安装 Vue CLI
npm install -g @vue/cli

# 创建 uni-app 项目
vue create -p dcloudio/uni-preset-vue my-project

# 安装依赖
cd my-project
npm install
```

#### 3. 运行到各平台
```bash
# 微信小程序
npm run dev:mp-weixin

# 支付宝小程序  
npm run dev:mp-alipay

# 百度小程序
npm run dev:mp-baidu

# H5
npm run dev:h5

# App
npm run dev:app-plus
```

### Taro 开发环境

#### 1. 安装 Taro CLI
```bash
# 全局安装
npm install -g @tarojs/cli

# 查看版本
taro --version
```

#### 2. 创建项目
```bash
# 创建项目
taro init myApp

# 选择模板
? 请选择框架 React
? 是否需要使用 TypeScript？ Yes
? 请选择 CSS 预处理器 Sass
? 请选择编译工具 Webpack5
```

#### 3. 开发和构建
```bash
# 开发模式
npm run dev:weixin
npm run dev:alipay
npm run dev:swan

# 生产构建
npm run build:weixin
npm run build:alipay
```

## 🔍 调试工具

### Chrome DevTools

#### 1. 远程调试
```javascript
// 在小程序中启用调试
wx.setEnableDebug({
  enableDebug: true
})

// 在 Chrome 中访问
chrome://inspect/#devices
```

#### 2. 调试技巧
```javascript
// 断点调试
debugger;

// 条件断点
if (condition) {
  debugger;
}

// 性能分析
console.time('operation');
// ... 代码执行
console.timeEnd('operation');
```

### 微信开发者工具调试

#### 1. Console 面板
```javascript
// 日志输出
console.log('普通日志')
console.warn('警告信息')
console.error('错误信息')

// 对象查看
console.table(arrayData)
console.dir(objectData)
```

#### 2. Sources 面板
```javascript
// 设置断点
// 1. 点击行号设置断点
// 2. 右键设置条件断点
// 3. 使用 debugger 语句

// 调试控制
// F8: 继续执行
// F10: 单步跳过
// F11: 单步进入
// Shift+F11: 单步跳出
```

#### 3. Network 面板
```javascript
// 监控网络请求
wx.request({
  url: 'https://api.example.com/data',
  success(res) {
    // 在 Network 面板查看请求详情
    console.log(res)
  }
})
```

#### 4. Storage 面板
```javascript
// 查看本地存储
wx.setStorageSync('key', 'value')

// 在 Storage 面板中可以看到:
// - Storage: 本地存储数据
// - Session: 会话数据  
// - AppData: 页面数据
```

## 📦 包管理和依赖

### npm 配置

#### 1. 初始化项目
```bash
# 创建 package.json
npm init -y

# 安装开发依赖
npm install --save-dev eslint prettier

# 安装生产依赖
npm install lodash moment
```

#### 2. 脚本配置
```json
{
  "scripts": {
    "dev": "taro build --type weixin --watch",
    "build": "taro build --type weixin",
    "lint": "eslint src/**/*.{js,ts,tsx}",
    "format": "prettier --write src/**/*.{js,ts,tsx}"
  }
}
```

### 小程序 npm 支持

#### 1. 构建 npm
```bash
# 在小程序项目根目录
npm install

# 在开发者工具中
工具 → 构建 npm
```

#### 2. 使用 npm 包
```javascript
// 安装第三方包
npm install miniprogram-api-promise

// 在小程序中使用
import { promisifyAll } from 'miniprogram-api-promise'

const wxp = {}
promisifyAll(wx, wxp)

// 使用 Promise 版本的 API
wxp.request({
  url: 'https://api.example.com'
}).then(res => {
  console.log(res)
})
```

## 🔧 开发工具配置

### 编辑器配置

#### 1. EditorConfig
```ini
# .editorconfig
root = true

[*]
charset = utf-8
indent_style = space
indent_size = 2
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

#### 2. ESLint 配置
```javascript
// .eslintrc.js
module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended'
  ],
  globals: {
    wx: 'readonly',
    App: 'readonly',
    Page: 'readonly',
    Component: 'readonly',
    getApp: 'readonly',
    getCurrentPages: 'readonly'
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error'
  }
}
```

#### 3. Prettier 配置
```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### Git 配置

#### 1. .gitignore
```gitignore
# 依赖
node_modules/

# 构建产物
dist/
build/

# 开发工具
.vscode/
.idea/

# 系统文件
.DS_Store
Thumbs.db

# 小程序
miniprogram_npm/
```

#### 2. Git Hooks
```bash
# 安装 husky
npm install --save-dev husky

# 配置 pre-commit
npx husky add .husky/pre-commit "npm run lint"
```

## 🚀 性能优化工具

### 1. 代码分析
```bash
# 安装分析工具
npm install --save-dev webpack-bundle-analyzer

# 分析构建产物
npm run build:analyze
```

### 2. 图片优化
```bash
# 安装图片压缩工具
npm install --save-dev imagemin imagemin-pngquant

# 压缩图片
imagemin images/*.png --out-dir=images/compressed
```

### 3. 代码压缩
```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  }
}
```

## 📱 真机测试

### 1. 微信真机调试
```
步骤：
1. 开发者工具点击"真机调试"
2. 微信扫描二维码
3. 手机上打开调试版本
4. 开发工具显示真机日志
```

### 2. 多设备测试
```javascript
// 获取设备信息
wx.getSystemInfo({
  success(res) {
    console.log('设备型号:', res.model)
    console.log('系统版本:', res.system)
    console.log('微信版本:', res.version)
    console.log('基础库版本:', res.SDKVersion)
  }
})
```

### 3. 兼容性测试
```javascript
// 检查API兼容性
if (wx.canIUse('getUpdateManager')) {
  const updateManager = wx.getUpdateManager()
  // 使用更新管理器
} else {
  // 降级处理
  console.log('当前版本不支持自动更新')
}
```

## 🔧 常见问题解决

### 1. 开发工具问题
```
问题: 开发工具启动失败
解决: 
- 检查系统兼容性
- 重新安装开发工具
- 清除缓存数据

问题: 编译错误
解决:
- 检查代码语法
- 清除编译缓存
- 重启开发工具
```

### 2. 真机调试问题
```
问题: 真机调试连接失败
解决:
- 确保手机和电脑在同一网络
- 关闭防火墙
- 重新扫码连接

问题: 真机上功能异常
解决:
- 检查API兼容性
- 查看真机调试日志
- 使用条件编译
```

### 3. 性能问题
```
问题: 页面加载慢
解决:
- 优化图片大小
- 减少网络请求
- 使用分包加载

问题: 内存占用高
解决:
- 及时清理定时器
- 避免内存泄漏
- 优化数据结构
```

---

*一个好的开发环境是高效开发的基础，花时间配置好工具链会让后续开发事半功倍！*