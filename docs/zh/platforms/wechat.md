# 微信小程序

## 简介

微信小程序是一种不需要下载安装即可使用的应用，它实现了"用完即走"的理念，用户扫一扫或搜一下即可打开应用。全面开放申请后，主体类型为企业、政府、媒体、其他组织或个人的开发者，均可申请注册微信小程序。

## 特点

- **无需安装**：用户无需下载安装，扫码或搜索即可使用
- **快速访问**：体积小，加载快，用户体验好
- **强大能力**：提供丰富的原生能力和微信生态能力
- **高效开发**：提供完善的开发工具和文档
- **海量用户**：可以触达微信的海量用户

## 开发环境搭建

### 1. 注册小程序账号

在开始开发微信小程序之前，您需要先注册一个小程序账号：

1. 访问[微信公众平台](https://mp.weixin.qq.com/)
2. 点击右上角的"立即注册"
3. 选择"小程序"
4. 按照指引填写信息完成注册

### 2. 安装开发者工具

微信官方提供了专门的开发者工具，用于开发和调试小程序：

1. 访问[微信开发者工具下载页面](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 根据您的操作系统下载对应版本
3. 安装并启动开发者工具
4. 使用微信扫码登录

## 项目结构

一个基本的微信小程序项目结构如下：

```
project/
├── app.js        // 小程序逻辑
├── app.json      // 小程序公共配置
├── app.wxss      // 小程序公共样式表
├── project.config.json // 项目配置文件
├── sitemap.json  // 小程序搜索优化
├── pages/        // 页面文件夹
│   └── index/    // 首页
│       ├── index.js    // 页面逻辑
│       ├── index.wxml  // 页面结构
│       ├── index.wxss  // 页面样式表
│       └── index.json  // 页面配置
└── components/   // 自定义组件
    └── custom/   // 自定义组件示例
        ├── custom.js    // 组件逻辑
        ├── custom.wxml  // 组件结构
        ├── custom.wxss  // 组件样式表
        └── custom.json  // 组件配置
```

## 核心文件说明

### app.js

小程序的全局逻辑文件，用于处理全局的生命周期函数和全局数据。

```javascript
// app.js
App({
  onLaunch() {
    // 小程序初始化完成时触发，全局只触发一次
    console.log('小程序初始化完成')
  },
  onShow(options) {
    // 小程序启动，或从后台进入前台显示时触发
    console.log('小程序显示')
  },
  onHide() {
    // 小程序从前台进入后台时触发
    console.log('小程序隐藏')
  },
  globalData: {
    // 全局数据
    userInfo: null
  }
})
```

### app.json

小程序的全局配置文件，用于配置小程序的窗口、页面路径、导航条、标签栏等。

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "微信小程序示例",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home_selected.png"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "日志",
        "iconPath": "images/logs.png",
        "selectedIconPath": "images/logs_selected.png"
      }
    ]
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

### app.wxss

小程序的全局样式文件，用于设置全局的样式规则。

```css
/**app.wxss**/
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
```

## 页面开发

### 页面结构 (WXML)

WXML（WeiXin Markup Language）是微信小程序的标记语言，用于构建小程序的页面结构。

```html
<!-- pages/index/index.wxml -->
<view class="container">
  <view class="userinfo">
    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo">获取头像昵称</button>
    <block wx:else>
      <image class="userinfo-avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
      <text class="userinfo-nickname">{{userInfo.nickName}}</text>
    </block>
  </view>
  <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view>
</view>
```

### 页面样式 (WXSS)

WXSS（WeiXin Style Sheets）是微信小程序的样式语言，用于描述WXML的组件样式。

```css
/**pages/index/index.wxss**/
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 200px;
}
```

### 页面逻辑 (JS)

页面逻辑文件用于处理页面的生命周期函数、事件处理函数等。

```javascript
// pages/index/index.js
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
```

### 页面配置 (JSON)

页面配置文件用于设置当前页面的窗口表现。

```json
{
  "navigationBarTitleText": "首页",
  "usingComponents": {}
}
```

## 组件开发

微信小程序支持自定义组件，可以将复杂的页面拆分成多个低耦合的模块，有助于代码复用和维护。

### 组件定义

```javascript
// components/custom/custom.js
Component({
  properties: {
    // 组件的对外属性
    title: {
      type: String,
      value: '默认标题'
    }
  },
  data: {
    // 组件的内部数据
    innerText: '内部数据'
  },
  methods: {
    // 组件的方法列表
    onTap() {
      const myEventDetail = {} // detail对象，提供给事件监听函数
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    }
  }
})
```

### 组件模板

```html
<!-- components/custom/custom.wxml -->
<view class="custom-component" bindtap="onTap">
  <text>{{title}}</text>
  <text>{{innerText}}</text>
</view>
```

### 组件样式

```css
/* components/custom/custom.wxss */
.custom-component {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}
```

### 组件配置

```json
{
  "component": true,
  "usingComponents": {}
}
```

### 使用组件

在页面的 JSON 文件中声明要使用的组件：

```json
{
  "usingComponents": {
    "custom": "/components/custom/custom"
  }
}
```

在页面的 WXML 中使用组件：

```html
<custom title="自定义标题" bindmyevent="onMyEvent"></custom>
```

## API 使用

微信小程序提供了丰富的 API，可以调用微信提供的能力，如获取用户信息、微信支付、地图、蓝牙等。

### 发起网络请求

```javascript
wx.request({
  url: 'https://example.com/api',
  data: {
    x: 1,
    y: 2
  },
  header: {
    'content-type': 'application/json'
  },
  success(res) {
    console.log(res.data)
  },
  fail(err) {
    console.error(err)
  }
})
```

### 获取位置信息

```javascript
wx.getLocation({
  type: 'wgs84',
  success(res) {
    const latitude = res.latitude
    const longitude = res.longitude
    console.log(`当前位置：${latitude}, ${longitude}`)
  }
})
```

### 微信支付

```javascript
wx.requestPayment({
  timeStamp: '',
  nonceStr: '',
  package: '',
  signType: 'MD5',
  paySign: '',
  success(res) {
    console.log('支付成功')
  },
  fail(err) {
    console.error('支付失败', err)
  }
})
```

## 发布与审核

开发完成后，需要将小程序提交审核并发布：

1. 在开发者工具中点击"上传"按钮
2. 填写版本号和项目备注
3. 上传代码
4. 登录[微信公众平台](https://mp.weixin.qq.com/)
5. 进入"管理">"版本管理"
6. 选择要发布的版本，点击"提交审核"
7. 填写相关信息并提交
8. 等待审核通过后，点击"发布"按钮将小程序发布到线上

## 最佳实践

1. **性能优化**：
   - 合理使用分包加载
   - 避免频繁的setData
   - 使用wx:if代替hidden进行条件渲染
   - 合理使用缓存

2. **代码规范**：
   - 遵循命名规范
   - 模块化开发
   - 注释清晰

3. **安全性**：
   - 前后端数据校验
   - 敏感信息加密
   - 使用HTTPS请求

4. **用户体验**：
   - 提供加载提示
   - 合理的错误处理
   - 适配不同屏幕尺寸

## 相关资源

- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信小程序设计指南](https://developers.weixin.qq.com/miniprogram/design/)
- [微信开发者社区](https://developers.weixin.qq.com/community/develop/mixflow)

## 常见问题

### 1. 如何解决小程序的登录态过期问题？

使用 wx.checkSession 检查登录态是否过期，如果过期则重新调用 wx.login 获取新的登录凭证。

```javascript
wx.checkSession({
  success() {
    // 登录态未过期
    console.log('登录态未过期')
  },
  fail() {
    // 登录态已过期，需要重新登录
    wx.login({
      success(res) {
        if (res.code) {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }
})
```

### 2. 小程序的体积限制是多少？

小程序的总体积限制为 20MB，其中主包不能超过 2MB，单个分包不能超过 2MB。

### 3. 如何实现小程序的数据缓存？

使用 wx.setStorage/wx.setStorageSync 和 wx.getStorage/wx.getStorageSync 进行数据缓存操作。

```javascript
// 存储数据
wx.setStorage({
  key: 'key',
  data: 'value',
  success() {
    console.log('存储成功')
  }
})

// 同步存储数据
wx.setStorageSync('key', 'value')

// 获取数据
wx.getStorage({
  key: 'key',
  success(res) {
    console.log(res.data)
  }
})

// 同步获取数据
const value = wx.getStorageSync('key')
console.log(value)