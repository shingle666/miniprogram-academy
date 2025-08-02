# 快速开始

欢迎来到小程序研究院！本指南将帮助你快速上手小程序开发。

## 🎯 学习目标

通过本指南，你将学会：
- 搭建小程序开发环境
- 创建第一个小程序项目
- 理解小程序的基本结构
- 掌握基础开发技能

## 📋 前置要求

在开始之前，请确保你具备：
- 基础的HTML、CSS、JavaScript知识
- 了解前端开发基本概念
- 有一定的编程经验（推荐）

## 🛠️ 环境搭建

### 1. 下载开发工具

#### 微信开发者工具
- 访问 [微信开发者工具官网](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- 下载对应操作系统的版本
- 安装并启动开发工具

#### 支付宝开发者工具
- 访问 [支付宝开发者工具官网](https://opendocs.alipay.com/mini/ide/download)
- 下载并安装开发工具

### 2. 注册开发者账号

#### 微信小程序
1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 点击"立即注册" → "小程序"
3. 填写账号信息并完成注册
4. 获取AppID用于开发

#### 支付宝小程序
1. 访问 [支付宝开放平台](https://open.alipay.com/)
2. 注册开发者账号
3. 创建小程序应用
4. 获取AppID

## 🚀 创建第一个项目

### 使用微信开发者工具

1. **新建项目**
   ```
   打开微信开发者工具
   → 点击"新建项目"
   → 选择项目目录
   → 输入AppID
   → 选择"不使用云服务"
   → 点击"新建"
   ```

2. **项目结构**
   ```
   my-miniprogram/
   ├── pages/           # 页面文件
   │   └── index/       # 首页
   │       ├── index.js
   │       ├── index.json
   │       ├── index.wxml
   │       └── index.wxss
   ├── utils/           # 工具函数
   ├── app.js          # 小程序逻辑
   ├── app.json        # 小程序配置
   └── app.wxss        # 全局样式
   ```

3. **运行项目**
   - 点击工具栏的"编译"按钮
   - 在模拟器中查看效果
   - 使用真机调试测试

### 使用uni-app框架

1. **安装HBuilderX**
   ```bash
   # 下载HBuilderX
   # 访问 https://www.dcloud.io/hbuilderx.html
   ```

2. **创建uni-app项目**
   ```bash
   # 使用Vue CLI创建
   npm install -g @vue/cli
   vue create -p dcloudio/uni-preset-vue my-project
   ```

3. **运行到小程序**
   ```bash
   # 运行到微信小程序
   npm run dev:mp-weixin
   
   # 运行到支付宝小程序
   npm run dev:mp-alipay
   ```

## 📝 第一个Hello World

让我们创建一个简单的Hello World页面：

### 1. 修改首页内容

**index.wxml**
```xml
<view class="container">
  <view class="title">{{title}}</view>
  <view class="subtitle">{{subtitle}}</view>
  <button class="btn" bindtap="onButtonTap">点击我</button>
</view>
```

**index.js**
```javascript
Page({
  data: {
    title: 'Hello World!',
    subtitle: '欢迎来到小程序世界'
  },
  
  onButtonTap() {
    wx.showToast({
      title: '你好，小程序！',
      icon: 'success'
    })
  }
})
```

**index.wxss**
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.title {
  font-size: 32px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 40px;
}

.btn {
  background: white;
  color: #667eea;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
}
```

### 2. 预览效果

1. 保存文件后，开发工具会自动编译
2. 在模拟器中查看效果
3. 点击按钮测试交互功能

## 🔧 开发工具使用

### 调试功能
- **Console面板** - 查看日志输出
- **Sources面板** - 设置断点调试
- **Network面板** - 监控网络请求
- **Storage面板** - 查看本地存储

### 模拟器功能
- **设备切换** - 模拟不同设备
- **网络模拟** - 测试弱网环境
- **位置模拟** - 测试定位功能
- **扫码功能** - 测试扫码交互

### 真机调试
1. 点击工具栏"真机调试"
2. 使用微信扫描二维码
3. 在真机上测试功能

## 📚 学习资源

### 官方文档
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [支付宝小程序开发文档](https://opendocs.alipay.com/mini)
- [uni-app开发文档](https://uniapp.dcloud.io/)

### 推荐教程
- [小程序基础教程](/zh/guide/basic-concepts)
- [组件开发指南](/zh/guide/component-development)
- [API使用手册](/zh/guide/api-overview)

### 社区资源
- [小程序开发社区](/zh/community/)
- [案例展示](/zh/showcase/)
- [开发工具集](/zh/tools/)

## 🎯 下一步

恭喜你完成了第一个小程序！接下来你可以：

1. **学习基础概念** - [了解小程序架构](/zh/guide/basic-concepts)
2. **掌握页面开发** - [学习页面生命周期](/zh/guide/page-development)
3. **组件化开发** - [创建自定义组件](/zh/guide/component-development)
4. **API调用** - [掌握小程序API](/zh/guide/api-overview)

## ❓ 常见问题

### Q: 如何获取AppID？
A: 在微信公众平台或支付宝开放平台注册小程序后，在设置页面可以找到AppID。

### Q: 开发工具无法预览怎么办？
A: 检查网络连接，确保AppID正确，重启开发工具。

### Q: 真机调试连接失败？
A: 确保手机和电脑在同一网络，关闭防火墙，重新扫码连接。

### Q: 如何发布小程序？
A: 在开发工具中点击"上传"，然后在管理后台提交审核。

---

*准备好开始你的小程序开发之旅了吗？让我们继续学习更多内容！*