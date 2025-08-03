# 快速开始

## 简介

欢迎使用小程序研究院的开发指南！本文档将帮助您快速入门小程序开发，无论您是想开发微信小程序、支付宝小程序还是其他平台的小程序，都能在这里找到有用的信息。

## 开发环境准备

在开始小程序开发之前，您需要准备以下环境：

1. **开发工具**：根据您的目标平台选择相应的开发工具
   - 微信小程序：[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
   - 支付宝小程序：[支付宝小程序开发者工具](https://opendocs.alipay.com/mini/ide/download)
   - 百度小程序：[百度智能小程序开发者工具](https://smartprogram.baidu.com/docs/develop/devtools/history/)
   - 字节跳动小程序：[字节跳动小程序开发者工具](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/developer-instrument/download/developer-instrument-update-and-download/)
   - QQ小程序：[QQ小程序开发者工具](https://q.qq.com/wiki/tools/devtool/)
   - 快手小程序：[快手小程序开发者工具](https://mp.kuaishou.com/docs/develop/developerTools/downloadPath.html)

2. **编辑器**：推荐使用 VS Code，并安装以下插件：
   - 小程序开发助手
   - ESLint
   - Prettier
   - Vetur (如果使用 Vue)
   - TypeScript (如果使用 TypeScript)

3. **Node.js 环境**：如果您计划使用跨平台框架（如 Taro、uni-app 等），需要安装 Node.js（建议版本 ≥ 14.0.0）

## 选择开发方式

小程序开发主要有两种方式：

### 1. 原生开发

直接使用各平台提供的开发语言和框架进行开发。优点是性能好，缺点是不同平台需要编写不同的代码。

### 2. 跨平台框架开发

使用第三方框架进行开发，一套代码可以编译到多个平台。主流的跨平台框架有：

- [Taro](../frameworks/taro.md)：基于 React 的跨平台框架
- [uni-app](../frameworks/uni-app.md)：基于 Vue 的跨平台框架
- [Remax](../frameworks/remax.md)：基于 React 的跨平台框架
- [Chameleon](../frameworks/chameleon.md)：面向多端的统一框架

## 创建第一个项目

### 原生微信小程序

1. 打开微信开发者工具
2. 点击"项目">"新建项目"
3. 选择项目目录，填写 AppID（可使用测试号）
4. 选择"小程序"项目
5. 点击"确定"完成创建

### 使用 Taro 创建项目

```bash
# 安装 Taro CLI
npm install -g @tarojs/cli

# 创建项目
taro init myApp

# 进入项目目录
cd myApp

# 开发微信小程序
npm run dev:weapp

# 开发支付宝小程序
npm run dev:alipay

# 开发百度小程序
npm run dev:swan

# 开发字节跳动小程序
npm run dev:tt

# 开发 QQ 小程序
npm run dev:qq
```

### 使用 uni-app 创建项目

```bash
# 安装 Vue CLI
npm install -g @vue/cli

# 创建项目
vue create -p dcloudio/uni-preset-vue my-project

# 进入项目目录
cd my-project

# 运行项目
npm run dev:mp-weixin  # 微信小程序
npm run dev:mp-alipay  # 支付宝小程序
npm run dev:mp-baidu   # 百度小程序
npm run dev:mp-toutiao # 字节跳动小程序
npm run dev:mp-qq      # QQ小程序
```

## 下一步

- 了解[基础概念](./basic-concepts.md)
- 学习[项目结构](./project-structure.md)
- 探索[页面开发](./page-development.md)
- 查看[组件开发](./component-development.md)