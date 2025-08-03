# WeChat Mini Program

## Introduction

WeChat Mini Programs are applications that can be used without downloading and installing. They implement the concept of "use and go", where users can open the application by scanning a code or searching. After the application is fully open for registration, developers with entity types such as enterprises, governments, media, other organizations, or individuals can apply to register WeChat Mini Programs.

## Features

- **No Installation Required**: Users don't need to download and install, they can use it by scanning a code or searching
- **Quick Access**: Small size, fast loading, good user experience
- **Powerful Capabilities**: Provides rich native capabilities and WeChat ecosystem capabilities
- **Efficient Development**: Provides comprehensive development tools and documentation
- **Massive User Base**: Can reach WeChat's massive user base

## Setting Up the Development Environment

### 1. Register a Mini Program Account

Before starting to develop a WeChat Mini Program, you need to register a Mini Program account:

1. Visit the [WeChat Official Accounts Platform](https://mp.weixin.qq.com/)
2. Click "Register Now" in the upper right corner
3. Select "Mini Program"
4. Follow the instructions to fill in the information and complete the registration

### 2. Install Developer Tools

WeChat officially provides dedicated developer tools for developing and debugging Mini Programs:

1. Visit the [WeChat Developer Tools download page](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. Download the version corresponding to your operating system
3. Install and launch the developer tools
4. Log in by scanning the QR code with WeChat

## Project Structure

A basic WeChat Mini Program project structure is as follows:

```
project/
├── app.js        // Mini Program logic
├── app.json      // Mini Program common configuration
├── app.wxss      // Mini Program common style sheet
├── project.config.json // Project configuration file
├── sitemap.json  // Mini Program search optimization
├── pages/        // Pages folder
│   └── index/    // Home page
│       ├── index.js    // Page logic
│       ├── index.wxml  // Page structure
│       ├── index.wxss  // Page style sheet
│       └── index.json  // Page configuration
└── components/   // Custom components
    └── custom/   // Custom component example
        ├── custom.js    // Component logic
        ├── custom.wxml  // Component structure
        ├── custom.wxss  // Component style sheet
        └── custom.json  // Component configuration
```

## Core File Explanation

### app.js

The global logic file of the Mini Program, used to handle global lifecycle functions and global data.

```javascript
// app.js
App({
  onLaunch() {
    // Triggered when the Mini Program initialization is complete, triggered only once globally
    console.log('Mini Program initialization complete')
  },
  onShow(options) {
    // Triggered when the Mini Program starts, or when it enters the foreground from the background
    console.log('Mini Program displayed')
  },
  onHide() {
    // Triggered when the Mini Program enters the background from the foreground
    console.log('Mini Program hidden')
  },
  globalData: {
    // Global data
    userInfo: null
  }
})
```

### app.json

The global configuration file of the Mini Program, used to configure the Mini Program's window, page paths, navigation bar, tab bar, etc.

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "WeChat Mini Program Example",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "Home",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home_selected.png"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "Logs",
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

The global style file of the Mini Program, used to set global style rules.

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

## Page Development

### Page Structure (WXML)

WXML (WeiXin Markup Language) is the markup language of WeChat Mini Programs, used to build the page structure of Mini Programs.

```html
<!-- pages/index/index.wxml -->
<view class="container">
  <view class="userinfo">
    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo">Get Avatar and Nickname</button>
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

### Page Style (WXSS)

WXSS (WeiXin Style Sheets) is the style language of WeChat Mini Programs, used to describe the component styles of WXML.

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

### Page Logic (JS)

The page logic file is used to handle page lifecycle functions, event handling functions, etc.

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
      // Since getUserInfo is a network request, it may return after Page.onLoad
      // So add a callback here to prevent this situation
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

### Page Configuration (JSON)

The page configuration file is used to set the window appearance of the current page.

```json
{
  "navigationBarTitleText": "Home",
  "usingComponents": {}
}
```

## Component Development

WeChat Mini Programs support custom components, which can split complex pages into multiple low-coupling modules, helping with code reuse and maintenance.

### Component Definition

```javascript
// components/custom/custom.js
Component({
  properties: {
    // External properties of the component
    title: {
      type: String,
      value: 'Default Title'
    }
  },
  data: {
    // Internal data of the component
    innerText: 'Internal Data'
  },
  methods: {
    // List of component methods
    onTap() {
      const myEventDetail = {} // detail object, provided to the event listener function
      const myEventOption = {} // options for triggering the event
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    }
  }
})
```

### Component Template

```html
<!-- components/custom/custom.wxml -->
<view class="custom-component" bindtap="onTap">
  <text>{{title}}</text>
  <text>{{innerText}}</text>
</view>
```

### Component Style

```css
/* components/custom/custom.wxss */
.custom-component {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}
```

### Component Configuration

```json
{
  "component": true,
  "usingComponents": {}
}
```

### Using Components

Declare the components to be used in the page's JSON file:

```json
{
  "usingComponents": {
    "custom": "/components/custom/custom"
  }
}
```

Use the component in the page's WXML:

```html
<custom title="Custom Title" bindmyevent="onMyEvent"></custom>
```

## API Usage

WeChat Mini Programs provide rich APIs that can call capabilities provided by WeChat, such as getting user information, WeChat Pay, maps, Bluetooth, etc.

### Making Network Requests

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

### Getting Location Information

```javascript
wx.getLocation({
  type: 'wgs84',
  success(res) {
    const latitude = res.latitude
    const longitude = res.longitude
    console.log(`Current location: ${latitude}, ${longitude}`)
  }
})
```

### WeChat Pay

```javascript
wx.requestPayment({
  timeStamp: '',
  nonceStr: '',
  package: '',
  signType: 'MD5',
  paySign: '',
  success(res) {
    console.log('Payment successful')
  },
  fail(err) {
    console.error('Payment failed', err)
  }
})
```

## Publishing and Review

After development is complete, the Mini Program needs to be submitted for review and published:

1. Click the "Upload" button in the developer tools
2. Fill in the version number and project notes
3. Upload the code
4. Log in to the [WeChat Official Accounts Platform](https://mp.weixin.qq.com/)
5. Go to "Management" > "Version Management"
6. Select the version to be published, click "Submit for Review"
7. Fill in the relevant information and submit
8. After the review is passed, click the "Publish" button to publish the Mini Program online

## Best Practices

1. **Performance Optimization**:
   - Reasonable use of subpackage loading
   - Avoid frequent setData
   - Use wx:if instead of hidden for conditional rendering
   - Reasonable use of caching

2. **Code Standards**:
   - Follow naming conventions
   - Modular development
   - Clear comments

3. **Security**:
   - Front-end and back-end data validation
   - Encryption of sensitive information
   - Use HTTPS requests

4. **User Experience**:
   - Provide loading prompts
   - Reasonable error handling
   - Adapt to different screen sizes

## Related Resources

- [WeChat Mini Program Official Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [WeChat Mini Program Design Guide](https://developers.weixin.qq.com/miniprogram/design/)
- [WeChat Developer Community](https://developers.weixin.qq.com/community/develop/mixflow)

## Common Questions

### 1. How to solve the problem of Mini Program login state expiration?

Use wx.checkSession to check if the login state has expired, if it has expired, call wx.login again to get a new login credential.

```javascript
wx.checkSession({
  success() {
    // Login state has not expired
    console.log('Login state has not expired')
  },
  fail() {
    // Login state has expired, need to log in again
    wx.login({
      success(res) {
        if (res.code) {
          // Send res.code to the backend to exchange for openId, sessionKey, unionId
        } else {
          console.log('Login failed!' + res.errMsg)
        }
      }
    })
  }
})
```

### 2. What is the size limit for Mini Programs?

The total size limit for Mini Programs is 20MB, with the main package not exceeding 2MB, and each subpackage not exceeding 2MB.

### 3. How to implement data caching in Mini Programs?

Use wx.setStorage/wx.setStorageSync and wx.getStorage/wx.getStorageSync for data caching operations.

```javascript
// Store data
wx.setStorage({
  key: 'key',
  data: 'value',
  success() {
    console.log('Storage successful')
  }
})

// Synchronously store data
wx.setStorageSync('key', 'value')

// Get data
wx.getStorage({
  key: 'key',
  success(res) {
    console.log(res.data)
  }
})

// Synchronously get data
const value = wx.getStorageSync('key')
console.log(value)