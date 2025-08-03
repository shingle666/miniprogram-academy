# Quick Start

## Introduction

Welcome to the Mini Program Academy development guide! This document will help you quickly get started with mini program development, whether you want to develop WeChat mini programs, Alipay mini programs, or mini programs for other platforms.

## Development Environment Preparation

Before starting mini program development, you need to prepare the following environment:

1. **Development Tools**: Choose the appropriate development tool based on your target platform
   - WeChat Mini Program: [WeChat Developer Tools](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
   - Alipay Mini Program: [Alipay Mini Program Developer Tools](https://opendocs.alipay.com/mini/ide/download)
   - Baidu Smart Program: [Baidu Smart Program Developer Tools](https://smartprogram.baidu.com/docs/develop/devtools/history/)
   - ByteDance Mini Program: [ByteDance Mini Program Developer Tools](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/developer-instrument/download/developer-instrument-update-and-download/)
   - QQ Mini Program: [QQ Mini Program Developer Tools](https://q.qq.com/wiki/tools/devtool/)
   - Kuaishou Mini Program: [Kuaishou Mini Program Developer Tools](https://mp.kuaishou.com/docs/develop/developerTools/downloadPath.html)

2. **Editor**: We recommend using VS Code with the following plugins:
   - Mini Program Development Assistant
   - ESLint
   - Prettier
   - Vetur (if using Vue)
   - TypeScript (if using TypeScript)

3. **Node.js Environment**: If you plan to use cross-platform frameworks (such as Taro, uni-app, etc.), you need to install Node.js (recommended version ≥ 14.0.0)

## Choose Development Method

There are two main ways to develop mini programs:

### 1. Native Development

Develop directly using the development languages and frameworks provided by each platform. The advantage is good performance, but the disadvantage is that different code needs to be written for different platforms.

### 2. Cross-platform Framework Development

Use third-party frameworks for development, where one set of code can be compiled to multiple platforms. Mainstream cross-platform frameworks include:

- [Taro](../frameworks/taro.md): React-based cross-platform framework
- [uni-app](../frameworks/uni-app.md): Vue-based cross-platform framework
- [Remax](../frameworks/remax.md): React-based cross-platform framework
- [Chameleon](../frameworks/chameleon.md): Multi-platform unified framework

## Create Your First Project

### Native WeChat Mini Program

1. Open WeChat Developer Tools
2. Click "Project" > "New Project"
3. Select project directory, fill in AppID (you can use a test ID)
4. Select "Mini Program" project
5. Click "OK" to complete creation

### Create Project Using Taro

```bash
# Install Taro CLI
npm install -g @tarojs/cli

# Create project
taro init myApp

# Enter project directory
cd myApp

# Develop WeChat Mini Program
npm run dev:weapp

# Develop Alipay Mini Program
npm run dev:alipay

# Develop Baidu Smart Program
npm run dev:swan

# Develop ByteDance Mini Program
npm run dev:tt

# Develop QQ Mini Program
npm run dev:qq
```

### Create Project Using uni-app

```bash
# Install Vue CLI
npm install -g @vue/cli

# Create project
vue create -p dcloudio/uni-preset-vue my-project

# Enter project directory
cd my-project

# Run project
npm run dev:mp-weixin  # WeChat Mini Program
npm run dev:mp-alipay  # Alipay Mini Program
npm run dev:mp-baidu   # Baidu Smart Program
npm run dev:mp-toutiao # ByteDance Mini Program
npm run dev:mp-qq      # QQ Mini Program
```

## Next Steps

- Learn about [Basic Concepts](./basic-concepts.md)
- Study [Project Structure](./project-structure.md)
- Explore [Page Development](./page-development.md)
- Check out [Component Development](./component-development.md)