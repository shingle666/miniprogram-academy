# 项目结构

了解小程序项目的基本结构是开发的第一步。本章将详细介绍小程序项目的目录结构、文件类型和配置文件。

## 基本目录结构

一个标准的小程序项目通常包含以下目录和文件：

```
miniprogram/
├── app.js          # 小程序逻辑
├── app.json        # 小程序公共配置
├── app.wxss        # 小程序公共样式表
├── sitemap.json    # 站点地图配置
├── project.config.json  # 项目配置文件
├── pages/          # 页面目录
│   ├── index/      # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── logs/       # 日志页
│       ├── logs.js
│       ├── logs.json
│       ├── logs.wxml
│       └── logs.wxss
├── utils/          # 工具函数目录
│   └── util.js
├── components/     # 自定义组件目录
│   └── custom-component/
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       └── index.wxss
└── images/         # 图片资源目录
    └── icon.png
```

## 核心文件说明

### app.js - 小程序入口文件

```javascript
// app.js
App({
  onLaunch() {
    // 小程序启动时触发
    console.log('小程序启动')
  },
  
  onShow() {
    // 小程序显示时触发
    console.log('小程序显示')
  },
  
  onHide() {
    // 小程序隐藏时触发
    console.log('小程序隐藏')
  },
  
  globalData: {
    userInfo: null
  }
})
```

### app.json - 全局配置文件

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
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
        "iconPath": "images/icon_component.png",
        "selectedIconPath": "images/icon_component_HL.png",
        "text": "首页"
      }
    ]
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

### app.wxss - 全局样式文件

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

/* 全局字体设置 */
page {
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, Roboto, 'Miui', sans-serif;
  font-size: 32rpx;
  line-height: 1.6;
}

/* 通用样式 */
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}
```

## 页面文件结构

每个页面由四个文件组成：

### .js 文件 - 页面逻辑

```javascript
// pages/index/index.js
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false
  },
  
  onLoad() {
    // 页面加载时触发
  },
  
  onShow() {
    // 页面显示时触发
  },
  
  onReady() {
    // 页面初次渲染完成时触发
  },
  
  onHide() {
    // 页面隐藏时触发
  },
  
  onUnload() {
    // 页面卸载时触发
  }
})
```

### .json 文件 - 页面配置

```json
{
  "usingComponents": {},
  "navigationBarTitleText": "首页",
  "enablePullDownRefresh": false,
  "backgroundTextStyle": "dark"
}
```

### .wxml 文件 - 页面结构

```xml
<!--pages/index/index.wxml-->
<view class="container">
  <view class="userinfo">
    <text class="userinfo-nickname">{{userInfo.nickName}}</text>
  </view>
  <view class="usermotto">
    <text class="user-motto">{{motto}}</text>
  </view>
</view>
```

### .wxss 文件 - 页面样式

```css
/**pages/index/index.wxss**/
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #aaa;
}

.userinfo-nickname {
  color: #000;
}

.usermotto {
  margin-top: 200px;
}
```

## 配置文件详解

### project.config.json - 项目配置

```json
{
  "description": "项目配置文件",
  "packOptions": {
    "ignore": [
      {
        "type": "file",
        "value": ".eslintrc.js"
      }
    ]
  },
  "setting": {
    "bundle": false,
    "userConfirmedBundleSwitch": false,
    "urlCheck": true,
    "scopeDataCheck": false,
    "coverView": true,
    "es6": true,
    "postcss": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "preloadBackgroundData": false,
    "minified": true,
    "autoAudits": false,
    "newFeature": false,
    "uglifyFileName": false,
    "uploadWithSourceMap": true,
    "useIsolateContext": true,
    "nodeModules": false,
    "enhance": true,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "showShadowRootInWxmlPanel": true,
    "packNpmManually": false,
    "enableEngineNative": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "showES6CompileOption": false,
    "minifyWXML": true
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "appid": "your-app-id",
  "projectname": "miniprogram-demo",
  "debugOptions": {
    "hidedInDevtools": []
  },
  "scripts": {},
  "staticServerOptions": {
    "baseURL": "",
    "servePath": ""
  },
  "isGameTourist": false,
  "condition": {
    "search": {
      "list": []
    },
    "conversation": {
      "list": []
    },
    "game": {
      "list": []
    },
    "plugin": {
      "list": []
    },
    "gamePlugin": {
      "list": []
    },
    "miniprogram": {
      "list": []
    }
  }
}
```

### sitemap.json - 站点地图

```json
{
  "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html",
  "rules": [{
    "action": "allow",
    "page": "*"
  }]
}
```

## 目录组织最佳实践

### 1. 按功能模块组织

```
pages/
├── home/           # 首页模块
├── user/           # 用户模块
├── product/        # 产品模块
└── order/          # 订单模块
```

### 2. 组件化开发

```
components/
├── common/         # 通用组件
│   ├── header/
│   ├── footer/
│   └── loading/
├── business/       # 业务组件
│   ├── product-card/
│   └── user-info/
└── ui/            # UI组件
    ├── button/
    └── input/
```

### 3. 资源文件管理

```
assets/
├── images/         # 图片资源
│   ├── icons/      # 图标
│   ├── backgrounds/ # 背景图
│   └── avatars/    # 头像
├── fonts/          # 字体文件
└── styles/         # 样式文件
    ├── common.wxss # 通用样式
    └── variables.wxss # 样式变量
```

### 4. 工具函数组织

```
utils/
├── request.js      # 网络请求
├── storage.js      # 本地存储
├── format.js       # 数据格式化
├── validate.js     # 数据验证
└── constants.js    # 常量定义
```

## 文件命名规范

### 1. 文件名规范
- 使用小写字母和连字符：`user-profile.js`
- 避免使用中文和特殊字符
- 保持文件名简洁明了

### 2. 目录名规范
- 使用小写字母
- 多个单词用连字符分隔
- 体现目录功能和用途

### 3. 组件命名规范
- 使用 PascalCase：`UserProfile`
- 体现组件功能
- 避免与系统组件重名

## 项目配置优化

### 1. 开发环境配置

```json
{
  "setting": {
    "es6": true,
    "postcss": true,
    "minified": false,
    "urlCheck": false
  }
}
```

### 2. 生产环境配置

```json
{
  "setting": {
    "es6": true,
    "postcss": true,
    "minified": true,
    "urlCheck": true
  }
}
```

## 总结

良好的项目结构是小程序开发的基础：

1. **清晰的目录结构** - 便于代码维护和团队协作
2. **合理的文件组织** - 提高开发效率
3. **规范的命名约定** - 增强代码可读性
4. **模块化的设计** - 提高代码复用性
5. **优化的配置文件** - 改善开发体验

下一章我们将学习如何进行页面开发，包括页面生命周期、数据绑定和事件处理等核心概念。