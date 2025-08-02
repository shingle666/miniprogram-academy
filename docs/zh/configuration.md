# 配置详解

全面了解小程序的各种配置文件，掌握项目配置、页面配置和组件配置的最佳实践。

## 📋 配置文件概览

小程序主要包含以下配置文件：

| 配置文件 | 作用域 | 说明 |
|---------|--------|------|
| `app.json` | 全局 | 小程序全局配置 |
| `page.json` | 页面 | 页面配置 |
| `component.json` | 组件 | 组件配置 |
| `project.config.json` | 项目 | 开发者工具配置 |
| `sitemap.json` | 全局 | 搜索索引配置 |

## 🌐 全局配置 (app.json)

### 基础配置
```json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile",
    "pages/settings/settings"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#ffffff",
    "navigationBarTitleText": "小程序研究院",
    "navigationBarTextStyle": "black",
    "backgroundColor": "#f5f5f5",
    "backgroundColorTop": "#ffffff",
    "backgroundColorBottom": "#ffffff",
    "enablePullDownRefresh": false
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "position": "bottom",
    "custom": false,
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/tab_home.png",
        "selectedIconPath": "images/tab_home_selected.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/profile/profile",
        "iconPath": "images/tab_profile.png",
        "selectedIconPath": "images/tab_profile_selected.png",
        "text": "我的"
      }
    ]
  }
}
```

### 详细配置项

#### pages 配置
```json
{
  "pages": [
    "pages/index/index",        // 首页（第一个为启动页）
    "pages/category/category",  // 分类页
    "pages/cart/cart",         // 购物车
    "pages/profile/profile"    // 个人中心
  ]
}
```

#### window 配置
```json
{
  "window": {
    // 导航栏配置
    "navigationBarBackgroundColor": "#000000",  // 导航栏背景颜色
    "navigationBarTextStyle": "white",          // 导航栏标题颜色（black/white）
    "navigationBarTitleText": "小程序标题",      // 导航栏标题文字
    "navigationStyle": "default",               // 导航栏样式（default/custom）
    
    // 窗口配置
    "backgroundColor": "#ffffff",               // 窗口背景色
    "backgroundTextStyle": "light",            // 下拉背景字体（light/dark）
    "backgroundColorTop": "#ffffff",           // 顶部窗口背景色
    "backgroundColorBottom": "#ffffff",        // 底部窗口背景色
    
    // 下拉刷新
    "enablePullDownRefresh": false,            // 是否开启下拉刷新
    "onReachBottomDistance": 50,               // 上拉触底距离
    
    // 其他配置
    "pageOrientation": "portrait",             // 屏幕旋转设置
    "disableScroll": false,                    // 是否禁止页面滚动
    "usingComponents": {}                      // 全局自定义组件配置
  }
}
```

#### tabBar 配置
```json
{
  "tabBar": {
    "color": "#7A7E83",                    // tab 文字默认颜色
    "selectedColor": "#3cc51f",            // tab 文字选中颜色
    "backgroundColor": "#ffffff",          // tab 背景色
    "borderStyle": "black",                // tabbar 边框颜色（black/white）
    "position": "bottom",                  // tabBar 位置（bottom/top）
    "custom": false,                       // 是否自定义 tabBar
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/tab_home.png",
        "selectedIconPath": "images/tab_home_selected.png"
      },
      {
        "pagePath": "pages/category/category",
        "text": "分类",
        "iconPath": "images/tab_category.png",
        "selectedIconPath": "images/tab_category_selected.png"
      }
    ]
  }
}
```

### 高级配置

#### 网络超时配置
```json
{
  "networkTimeout": {
    "request": 60000,          // wx.request 超时时间（毫秒）
    "connectSocket": 60000,    // wx.connectSocket 超时时间
    "uploadFile": 60000,       // wx.uploadFile 超时时间
    "downloadFile": 60000      // wx.downloadFile 超时时间
  }
}
```

#### 调试配置
```json
{
  "debug": true,               // 是否开启 debug 模式
  "functionalPages": false,    // 是否启用插件功能页
  "subpackages": [             // 分包配置
    {
      "root": "packageA",
      "pages": [
        "pages/cat/cat",
        "pages/dog/dog"
      ]
    }
  ],
  "workers": "workers",        // Worker 代码目录
  "requiredBackgroundModes": ["audio", "location"], // 需要在后台使用的能力
  "plugins": {                 // 插件配置
    "myPlugin": {
      "version": "1.0.0",
      "provider": "wxidxxxxxxxxxxxxxxxx"
    }
  }
}
```

#### 权限配置
```json
{
  "permission": {
    "scope.userLocation": {
      "desc": "您的位置信息将用于小程序位置接口的效果展示"
    },
    "scope.userInfo": {
      "desc": "您的用户信息将用于小程序个性化服务"
    },
    "scope.camera": {
      "desc": "您的摄像头将用于扫码功能"
    }
  }
}
```

## 📄 页面配置 (page.json)

每个页面可以有独立的配置文件，会覆盖全局配置：

```json
{
  "navigationBarTitleText": "页面标题",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "backgroundColor": "#f5f5f5",
  "backgroundTextStyle": "light",
  "enablePullDownRefresh": true,
  "onReachBottomDistance": 50,
  "pageOrientation": "portrait",
  "disableScroll": false,
  "usingComponents": {
    "custom-button": "/components/custom-button/index",
    "van-button": "@vant/weapp/button/index"
  },
  "style": "v2",
  "singlePage": {
    "navigationBarFit": "squeezed"
  }
}
```

### 页面配置详解

#### 导航栏配置
```json
{
  "navigationBarTitleText": "商品详情",
  "navigationBarBackgroundColor": "#ff6b35",
  "navigationBarTextStyle": "white",
  "navigationStyle": "default"
}
```

#### 下拉刷新配置
```json
{
  "enablePullDownRefresh": true,
  "backgroundColor": "#f5f5f5",
  "backgroundTextStyle": "dark"
}
```

#### 组件引用配置
```json
{
  "usingComponents": {
    "product-card": "/components/product-card/index",
    "loading": "/components/loading/index",
    "van-button": "@vant/weapp/button/index",
    "van-cell": "@vant/weapp/cell/index"
  }
}
```

## 🧩 组件配置 (component.json)

自定义组件的配置文件：

```json
{
  "component": true,
  "usingComponents": {
    "child-component": "/components/child-component/index"
  },
  "componentPlaceholder": {
    "view": "view",
    "scroll-view": "scroll-view"
  },
  "componentGenerics": {
    "selectable": true
  }
}
```

### 组件配置详解

#### 基础组件配置
```json
{
  "component": true,           // 声明为组件
  "usingComponents": {         // 引用其他组件
    "icon": "/components/icon/index",
    "button": "/components/button/index"
  }
}
```

#### 抽象节点配置
```json
{
  "componentGenerics": {
    "selectable": {
      "default": "/components/default-selectable/index"
    }
  }
}
```

## 🛠️ 项目配置 (project.config.json)

开发者工具的项目配置：

```json
{
  "description": "项目配置文件",
  "packOptions": {
    "ignore": [
      {
        "type": "file",
        "value": ".eslintrc.js"
      },
      {
        "type": "folder",
        "value": "docs"
      }
    ]
  },
  "setting": {
    "urlCheck": false,              // 是否检查安全域名
    "es6": true,                    // 是否启用 ES6 转 ES5
    "enhance": true,                // 是否打开增强编译
    "postcss": true,                // 是否打开 PostCSS
    "preloadBackgroundData": false, // 是否预载背景数据
    "minified": true,               // 是否压缩代码
    "newFeature": false,            // 是否启用新特性
    "coverView": true,              // 是否使用工具渲染 CoverView
    "nodeModules": false,           // 是否启用 npm 模块
    "autoAudits": false,            // 是否自动运行体验评分
    "showShadowRootInWxmlPanel": true, // 是否在 wxml 面板显示 shadow-root
    "scopeDataCheck": false,        // 是否检查数据绑定安全
    "uglifyFileName": false,        // 是否进行代码保护
    "checkInvalidKey": true,        // 是否检查无效 key
    "checkSiteMap": true,           // 是否检查 sitemap.json
    "uploadWithSourceMap": true,    // 上传时是否带上 sourcemap
    "compileHotReLoad": false,      // 是否启用热重载
    "useMultiFrameRuntime": true,   // 是否启用多线程
    "useApiHook": true,             // 是否启用 API Hook
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    }
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "appid": "wxxxxxxxxxxxxxxxxx",
  "projectname": "miniprogram-project",
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

## 🔍 站点地图配置 (sitemap.json)

配置小程序页面是否允许微信索引：

```json
{
  "desc": "关于本文件的更多信息，请参考文档 https://developers.weixin.qq.com/miniprogram/dev/framework/sitemap.html",
  "rules": [
    {
      "action": "allow",
      "page": "*"
    },
    {
      "action": "disallow",
      "page": "pages/admin/*"
    },
    {
      "action": "allow",
      "page": "pages/index/index",
      "params": ["id"]
    }
  ]
}
```

### sitemap 规则详解

#### 基础规则
```json
{
  "rules": [
    {
      "action": "allow",        // 允许索引
      "page": "pages/index/index"
    },
    {
      "action": "disallow",     // 禁止索引
      "page": "pages/private/*"
    }
  ]
}
```

#### 参数匹配
```json
{
  "rules": [
    {
      "action": "allow",
      "page": "pages/detail/detail",
      "params": ["id", "type"],     // 允许特定参数的页面
      "matching": "exact"           // 精确匹配
    }
  ]
}
```

## 🎯 配置最佳实践

### 1. 性能优化配置
```json
{
  "window": {
    "onReachBottomDistance": 100,    // 适当的触底距离
    "enablePullDownRefresh": false   // 按需开启下拉刷新
  },
  "networkTimeout": {
    "request": 10000                 // 合理的超时时间
  }
}
```

### 2. 用户体验配置
```json
{
  "window": {
    "navigationBarTitleText": "简洁明了的标题",
    "backgroundColor": "#f5f5f5",
    "backgroundTextStyle": "light"
  },
  "tabBar": {
    "selectedColor": "#07c160",      // 使用品牌色
    "backgroundColor": "#ffffff"
  }
}
```

### 3. 开发调试配置
```json
{
  "setting": {
    "urlCheck": false,               // 开发时关闭域名检查
    "es6": true,                     // 启用 ES6 转换
    "postcss": true,                 // 启用样式预处理
    "minified": false,               // 开发时不压缩代码
    "autoAudits": true               // 启用自动体验评分
  }
}
```

### 4. 分包配置示例
```json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"
  ],
  "subpackages": [
    {
      "root": "pages/shop",
      "name": "shop",
      "pages": [
        "list/list",
        "detail/detail"
      ]
    },
    {
      "root": "pages/user",
      "name": "user",
      "pages": [
        "settings/settings",
        "orders/orders"
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["shop"]
    }
  }
}
```

## 🔧 环境配置

### 开发环境配置
```json
{
  "setting": {
    "urlCheck": false,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "minified": false,
    "newFeature": true,
    "autoAudits": true
  }
}
```

### 生产环境配置
```json
{
  "setting": {
    "urlCheck": true,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "minified": true,
    "newFeature": false,
    "autoAudits": false
  }
}
```

## 📱 多平台配置

### 微信小程序特有配置
```json
{
  "cloud": true,                     // 启用云开发
  "plugins": {                       // 插件配置
    "live-player-plugin": {
      "version": "1.0.0",
      "provider": "wx2b03c6e691cd7370"
    }
  },
  "requiredBackgroundModes": ["audio", "location"]
}
```

### 支付宝小程序配置
```json
{
  "window": {
    "defaultTitle": "支付宝小程序",
    "titleBarColor": "#ffffff"
  },
  "tabBar": {
    "textColor": "#dddddd",
    "selectedColor": "#49a9ee",
    "backgroundColor": "#ffffff"
  }
}
```

## 📚 相关文档

- [项目结构](./project-structure.md)
- [页面开发](./page-development.md)
- [组件开发](./component-development.md)
- [API使用](./api-usage.md)

---

通过合理的配置，您可以打造出性能优异、用户体验良好的小程序应用！🚀