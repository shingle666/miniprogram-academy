# 基础概念

理解小程序的核心概念是成功开发的基础。本章将介绍小程序的架构、生命周期和基本原理。

## 🏗️ 小程序架构

### 双线程架构

小程序采用双线程架构设计：

```
┌─────────────────┐    ┌─────────────────┐
│   渲染层 (View)   │    │  逻辑层 (App)    │
│                │    │                │
│  - WXML        │    │  - JavaScript   │
│  - WXSS        │    │  - 小程序API     │
│  - 组件        │◄──►│  - 数据处理      │
│                │    │                │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────────────────┘
              Native Bridge
```

**渲染层特点：**
- 负责界面渲染
- 运行在WebView中
- 处理用户交互事件
- 不能直接调用小程序API

**逻辑层特点：**
- 负责业务逻辑处理
- 运行在JSCore中
- 可以调用小程序API
- 不能直接操作DOM

### 通信机制

```javascript
// 逻辑层向渲染层发送数据
this.setData({
  message: 'Hello World'
})

// 渲染层向逻辑层发送事件
// WXML: <button bindtap="handleTap">点击</button>
// JS: handleTap(event) { ... }
```

## 📱 小程序生命周期

### 应用生命周期

```javascript
// app.js
App({
  // 小程序初始化完成
  onLaunch(options) {
    console.log('小程序启动', options)
  },
  
  // 小程序显示
  onShow(options) {
    console.log('小程序显示', options)
  },
  
  // 小程序隐藏
  onHide() {
    console.log('小程序隐藏')
  },
  
  // 小程序发生脚本错误或API调用报错
  onError(msg) {
    console.error('小程序错误', msg)
  }
})
```

### 页面生命周期

```javascript
// pages/index/index.js
Page({
  data: {
    message: 'Hello World'
  },
  
  // 页面加载
  onLoad(options) {
    console.log('页面加载', options)
    // 获取页面参数，初始化数据
  },
  
  // 页面显示
  onShow() {
    console.log('页面显示')
    // 页面每次显示都会调用
  },
  
  // 页面初次渲染完成
  onReady() {
    console.log('页面渲染完成')
    // 可以获取页面元素
  },
  
  // 页面隐藏
  onHide() {
    console.log('页面隐藏')
  },
  
  // 页面卸载
  onUnload() {
    console.log('页面卸载')
    // 清理定时器、取消网络请求等
  }
})
```

### 组件生命周期

```javascript
Component({
  lifetimes: {
    // 组件实例刚刚被创建
    created() {
      console.log('组件创建')
    },
    
    // 组件实例进入页面节点树
    attached() {
      console.log('组件挂载')
    },
    
    // 组件布局完成
    ready() {
      console.log('组件准备完成')
    },
    
    // 组件实例被移动到节点树另一个位置
    moved() {
      console.log('组件移动')
    },
    
    // 组件实例从页面节点树移除
    detached() {
      console.log('组件卸载')
    }
  }
})
```

## 📄 页面结构

### WXML (WeiXin Markup Language)

WXML是小程序的模板语言，类似于HTML：

```xml
<!-- 数据绑定 -->
<view>{{message}}</view>

<!-- 列表渲染 -->
<view wx:for="{{array}}" wx:key="index">
  {{index}}: {{item}}
</view>

<!-- 条件渲染 -->
<view wx:if="{{condition}}">显示内容</view>
<view wx:else>隐藏内容</view>

<!-- 事件绑定 -->
<button bindtap="handleTap">点击按钮</button>

<!-- 模板引用 -->
<import src="template.wxml"/>
<template is="itemTemplate" data="{{...item}}"/>
```

### WXSS (WeiXin Style Sheets)

WXSS是小程序的样式语言，扩展了CSS：

```css
/* 尺寸单位 rpx (responsive pixel) */
.container {
  width: 750rpx; /* 750rpx = 屏幕宽度 */
  height: 100vh;
}

/* 样式导入 */
@import "common.wxss";

/* 选择器支持 */
.class-selector { }
#id-selector { }
element { }
::before, ::after { }

/* Flex布局 */
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### JavaScript逻辑

```javascript
Page({
  // 页面数据
  data: {
    message: 'Hello World',
    userInfo: {},
    hasUserInfo: false
  },
  
  // 事件处理函数
  handleTap() {
    this.setData({
      message: '按钮被点击了'
    })
  },
  
  // 获取用户信息
  getUserInfo(e) {
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  // 自定义方法
  customMethod() {
    // 业务逻辑处理
  }
})
```

## 🔧 配置文件

### 全局配置 (app.json)

```json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "小程序研究院",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/icon_home.png",
        "selectedIconPath": "images/icon_home_selected.png",
        "text": "首页"
      }
    ]
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  }
}
```

### 页面配置 (page.json)

```json
{
  "navigationBarTitleText": "页面标题",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "backgroundColor": "#eeeeee",
  "backgroundTextStyle": "light",
  "enablePullDownRefresh": true,
  "onReachBottomDistance": 50,
  "usingComponents": {
    "custom-component": "/components/custom/custom"
  }
}
```

## 📦 组件系统

### 内置组件

小程序提供了丰富的内置组件：

```xml
<!-- 视图容器 -->
<view class="container">
  <scroll-view scroll-y="true">
    <swiper indicator-dots="true">
      <swiper-item>页面1</swiper-item>
      <swiper-item>页面2</swiper-item>
    </swiper>
  </scroll-view>
</view>

<!-- 基础内容 -->
<text>文本内容</text>
<rich-text nodes="{{htmlContent}}"></rich-text>
<progress percent="80" show-info="true"/>

<!-- 表单组件 -->
<form bindsubmit="formSubmit">
  <input placeholder="请输入内容" bindinput="inputChange"/>
  <textarea placeholder="多行输入"></textarea>
  <button form-type="submit">提交</button>
</form>

<!-- 媒体组件 -->
<image src="{{imageUrl}}" mode="aspectFit"/>
<video src="{{videoUrl}}" controls="true"/>

<!-- 地图组件 -->
<map longitude="{{longitude}}" latitude="{{latitude}}"/>
```

### 自定义组件

```javascript
// components/custom/custom.js
Component({
  // 组件属性
  properties: {
    title: {
      type: String,
      value: '默认标题'
    }
  },
  
  // 组件数据
  data: {
    count: 0
  },
  
  // 组件方法
  methods: {
    increment() {
      this.setData({
        count: this.data.count + 1
      })
      
      // 触发自定义事件
      this.triggerEvent('countchange', {
        count: this.data.count
      })
    }
  }
})
```

## 🌐 API调用

### 网络请求

```javascript
// GET请求
wx.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    id: 123
  },
  success(res) {
    console.log('请求成功', res.data)
  },
  fail(err) {
    console.error('请求失败', err)
  }
})

// POST请求
wx.request({
  url: 'https://api.example.com/submit',
  method: 'POST',
  data: {
    name: '张三',
    age: 25
  },
  header: {
    'content-type': 'application/json'
  },
  success(res) {
    console.log('提交成功', res)
  }
})
```

### 数据存储

```javascript
// 同步存储
wx.setStorageSync('key', 'value')
const value = wx.getStorageSync('key')

// 异步存储
wx.setStorage({
  key: 'userInfo',
  data: {
    name: '张三',
    age: 25
  },
  success() {
    console.log('存储成功')
  }
})

wx.getStorage({
  key: 'userInfo',
  success(res) {
    console.log('获取成功', res.data)
  }
})
```

### 界面交互

```javascript
// 显示提示
wx.showToast({
  title: '操作成功',
  icon: 'success',
  duration: 2000
})

// 显示模态对话框
wx.showModal({
  title: '提示',
  content: '确定要删除吗？',
  success(res) {
    if (res.confirm) {
      console.log('用户点击确定')
    }
  }
})

// 显示加载提示
wx.showLoading({
  title: '加载中...'
})

setTimeout(() => {
  wx.hideLoading()
}, 2000)
```

## 🎯 数据绑定

### 单向数据绑定

```xml
<!-- 文本绑定 -->
<text>{{message}}</text>

<!-- 属性绑定 -->
<image src="{{imageUrl}}" />

<!-- 运算表达式 -->
<text>{{a + b}}</text>
<text>{{flag ? 'true' : 'false'}}</text>

<!-- 对象属性 -->
<text>{{user.name}}</text>
<text>{{user['age']}}</text>
```

### 列表渲染

```xml
<!-- 基础列表 -->
<view wx:for="{{array}}" wx:key="index">
  {{index}}: {{item}}
</view>

<!-- 对象数组 -->
<view wx:for="{{users}}" wx:key="id">
  <text>{{item.name}} - {{item.age}}</text>
</view>

<!-- 自定义变量名 -->
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName" wx:key="idx">
  {{idx}}: {{itemName}}
</view>
```

### 条件渲染

```xml
<!-- wx:if -->
<view wx:if="{{condition}}">条件为真时显示</view>
<view wx:elif="{{condition2}}">条件2为真时显示</view>
<view wx:else>其他情况显示</view>

<!-- hidden -->
<view hidden="{{!show}}">控制显示隐藏</view>
```

## 🔄 事件系统

### 事件类型

```xml
<!-- 点击事件 -->
<button bindtap="handleTap">点击</button>

<!-- 输入事件 -->
<input bindinput="handleInput" />

<!-- 表单提交 -->
<form bindsubmit="handleSubmit">
  <button form-type="submit">提交</button>
</form>

<!-- 触摸事件 -->
<view 
  bindtouchstart="handleTouchStart"
  bindtouchmove="handleTouchMove"
  bindtouchend="handleTouchEnd">
  触摸区域
</view>
```

### 事件对象

```javascript
Page({
  handleTap(event) {
    console.log('事件类型:', event.type)
    console.log('时间戳:', event.timeStamp)
    console.log('目标元素:', event.target)
    console.log('当前元素:', event.currentTarget)
    console.log('触摸点:', event.touches)
    console.log('自定义数据:', event.target.dataset)
  }
})
```

### 事件传参

```xml
<!-- 通过data-*传递参数 -->
<button 
  bindtap="handleTap" 
  data-id="{{item.id}}"
  data-name="{{item.name}}">
  点击
</button>
```

```javascript
Page({
  handleTap(event) {
    const { id, name } = event.target.dataset
    console.log('ID:', id, 'Name:', name)
  }
})
```

## 📱 适配方案

### 尺寸单位

```css
/* rpx: responsive pixel */
.container {
  width: 750rpx;  /* 等于屏幕宽度 */
  height: 100rpx; /* 在iPhone6上等于50px */
}

/* 设计稿750px宽度的换算 */
/* 设计稿尺寸 / 750 * 750rpx */
```

### 屏幕适配

```javascript
// 获取系统信息
wx.getSystemInfo({
  success(res) {
    console.log('屏幕宽度:', res.screenWidth)
    console.log('屏幕高度:', res.screenHeight)
    console.log('设备像素比:', res.pixelRatio)
    console.log('状态栏高度:', res.statusBarHeight)
  }
})
```

## 🎨 最佳实践

### 1. 性能优化
- 合理使用setData，避免频繁更新
- 图片懒加载和压缩
- 减少页面层级和组件数量

### 2. 用户体验
- 提供加载状态提示
- 处理网络异常情况
- 合理的页面跳转动画

### 3. 代码规范
- 统一的命名规范
- 模块化开发
- 注释和文档完善

---

*掌握了这些基础概念，你就可以开始构建更复杂的小程序应用了！*