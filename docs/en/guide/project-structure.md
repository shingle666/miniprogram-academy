# Project Structure

Understanding the structure of a mini program project is essential for efficient development. This guide explains the standard project structure and the purpose of each file and directory.

## Basic Structure

A typical mini program project has the following structure:

```
project/
├── app.js              // App instance
├── app.json            // Global configuration
├── app.wxss/acss       // Global styles
├── project.config.json // Project configuration
├── pages/              // Pages directory
│   ├── index/          // Index page
│   │   ├── index.js    // Page logic
│   │   ├── index.wxml  // Page template
│   │   ├── index.wxss  // Page styles
│   │   └── index.json  // Page configuration
│   └── logs/           // Another page
│       ├── logs.js
│       ├── logs.wxml
│       ├── logs.wxss
│       └── logs.json
├── components/         // Components directory
│   └── custom/         // Custom component
│       ├── custom.js
│       ├── custom.wxml
│       ├── custom.wxss
│       └── custom.json
├── utils/              // Utility functions
│   └── util.js
├── assets/             // Static assets
│   ├── images/
│   └── icons/
└── miniprogram_npm/    // NPM packages
```

## Core Files

### App Files

These files define the global behavior and appearance of your mini program:

#### app.js

The entry point of your mini program. It defines the App instance and global behaviors.

```javascript
// app.js
App({
  onLaunch() {
    // Mini program initialization logic
    console.log('App launched')
  },
  globalData: {
    userInfo: null
  }
})
```

#### app.json

The global configuration file that defines pages, window styles, tabBar, and other global settings.

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "Mini Program",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "Home"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "Logs"
      }
    ]
  },
  "style": "v2",
  "sitemapLocation": "sitemap.json"
}
```

#### app.wxss/acss

The global stylesheet that applies to all pages.

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

### Page Files

Each page in your mini program consists of four files:

#### page.js

Contains the page logic, data, and event handlers.

```javascript
// pages/index/index.js
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  onLoad() {
    // Page initialization logic
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }
})
```

#### page.wxml/axml

The template file that defines the structure of the page.

```html
<!-- pages/index/index.wxml -->
<view class="container">
  <view class="userinfo">
    <button bindtap="bindViewTap">{{motto}}</button>
  </view>
</view>
```

#### page.wxss/acss

The stylesheet specific to the page.

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
```

#### page.json

The configuration file specific to the page.

```json
{
  "navigationBarTitleText": "Home Page",
  "usingComponents": {
    "custom-component": "/components/custom/custom"
  }
}
```

### Component Files

Similar to pages, components also consist of four files:

#### component.js

Contains the component logic, properties, data, and methods.

```javascript
// components/custom/custom.js
Component({
  properties: {
    title: {
      type: String,
      value: 'Default Title'
    }
  },
  data: {
    innerText: 'Component Inner Text'
  },
  methods: {
    onTap() {
      this.triggerEvent('customEvent', {
        value: this.data.innerText
      })
    }
  }
})
```

#### component.wxml/axml

The template file that defines the structure of the component.

```html
<!-- components/custom/custom.wxml -->
<view class="custom-component" bindtap="onTap">
  <view class="title">{{title}}</view>
  <view class="content">{{innerText}}</view>
</view>
```

#### component.wxss/acss

The stylesheet specific to the component.

```css
/* components/custom/custom.wxss */
.custom-component {
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}

.title {
  font-weight: bold;
  margin-bottom: 5px;
}

.content {
  color: #666;
}
```

#### component.json

The configuration file specific to the component.

```json
{
  "component": true,
  "usingComponents": {}
}
```

## Configuration Files

### project.config.json

Contains project-level configuration settings, including project name, app ID, and development tool settings.

```json
{
  "description": "Project configuration file",
  "packOptions": {
    "ignore": []
  },
  "setting": {
    "urlCheck": true,
    "es6": true,
    "enhance": false,
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
    "useMultiFrameRuntime": false,
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
  "libVersion": "2.14.0",
  "appid": "wx12345678",
  "projectname": "My Mini Program",
  "debugOptions": {
    "hidedInDevtools": []
  },
  "scripts": {},
  "isGameTourist": false,
  "simulatorType": "wechat",
  "simulatorPluginLibVersion": {},
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

### sitemap.json

Configures how your mini program pages are indexed by search engines.

```json
{
  "desc": "Sitemap configuration",
  "rules": [
    {
      "action": "allow",
      "page": "*"
    }
  ]
}
```

## Directory Structure Best Practices

### Organizing Large Projects

For larger projects, consider organizing your code as follows:

```
project/
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── pages/
│   ├── home/
│   ├── user/
│   │   ├── profile/
│   │   ├── settings/
│   │   └── orders/
│   ├── product/
│   │   ├── list/
│   │   └── detail/
│   └── cart/
├── components/
│   ├── ui/
│   │   ├── button/
│   │   ├── card/
│   │   └── modal/
│   └── business/
│       ├── product-card/
│       └── order-item/
├── utils/
│   ├── request.js
│   ├── format.js
│   └── storage.js
├── services/
│   ├── user.js
│   ├── product.js
│   └── order.js
├── constants/
│   ├── api.js
│   └── config.js
└── assets/
    ├── images/
    └── icons/
```

### Subpackages

For very large mini programs, you can use subpackages to split your code:

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "pages": [
        "pages/cat/cat",
        "pages/dog/dog"
      ]
    },
    {
      "root": "packageB",
      "name": "pack2",
      "pages": [
        "pages/apple/apple",
        "pages/banana/banana"
      ]
    }
  ]
}
```

## Next Steps

Now that you understand the project structure, you can proceed to learn about:

- [Page Development](./page-development.md)
- [Component Development](./component-development.md)
- [Data Binding](./data-binding.md)