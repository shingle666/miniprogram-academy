# 项目结构

深入了解小程序项目的目录结构、文件组织和最佳实践，帮助您构建可维护的小程序应用。

## 📁 标准项目结构

### 基础结构
```
miniprogram/
├── pages/              # 页面目录
│   ├── index/         # 首页
│   │   ├── index.js   # 页面逻辑
│   │   ├── index.json # 页面配置
│   │   ├── index.wxml # 页面结构
│   │   └── index.wxss # 页面样式
│   └── profile/       # 个人中心页
├── components/        # 自定义组件
│   └── custom-button/
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       └── index.wxss
├── utils/            # 工具函数
│   ├── util.js       # 通用工具
│   ├── request.js    # 网络请求
│   └── storage.js    # 本地存储
├── images/           # 图片资源
├── styles/           # 公共样式
│   ├── common.wxss   # 通用样式
│   └── variables.wxss # 样式变量
├── libs/             # 第三方库
├── app.js            # 小程序逻辑
├── app.json          # 全局配置
├── app.wxss          # 全局样式
├── project.config.json # 项目配置
└── sitemap.json      # 站点地图
```

## 🔧 核心文件详解

### app.js - 小程序入口
```javascript
// 小程序主入口文件
App({
  // 全局数据
  globalData: {
    userInfo: null,
    systemInfo: null,
    version: '1.0.0'
  },

  // 小程序初始化
  onLaunch(options) {
    console.log('小程序启动', options)
    
    // 获取系统信息
    this.getSystemInfo()
    
    // 检查更新
    this.checkUpdate()
    
    // 初始化云开发
    this.initCloud()
  },

  // 小程序显示
  onShow(options) {
    console.log('小程序显示', options)
  },

  // 小程序隐藏
  onHide() {
    console.log('小程序隐藏')
  },

  // 错误监听
  onError(msg) {
    console.error('小程序错误', msg)
  },

  // 获取系统信息
  getSystemInfo() {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        console.log('系统信息', res)
      }
    })
  },

  // 检查更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
        }
      })
    }
  },

  // 初始化云开发
  initCloud() {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true
      })
    }
  }
})
```

### app.json - 全局配置
```json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile",
    "pages/settings/settings"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "小程序研究院",
    "navigationBarTextStyle": "black",
    "enablePullDownRefresh": false
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "position": "bottom",
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
  },
  "networkTimeout": {
    "request": 10000,
    "downloadFile": 10000
  },
  "debug": false,
  "navigateToMiniProgramAppIdList": [],
  "permission": {
    "scope.userLocation": {
      "desc": "您的位置信息将用于小程序位置接口的效果展示"
    }
  }
}
```

### app.wxss - 全局样式
```css
/* 全局样式 */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
}

/* 通用容器 */
.container {
  padding: 20rpx;
  box-sizing: border-box;
}

/* 通用按钮 */
.btn {
  display: inline-block;
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  text-align: center;
  font-size: 28rpx;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background-color: #07c160;
  color: white;
}

.btn-primary:hover {
  background-color: #06ad56;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}

/* 通用卡片 */
.card {
  background: white;
  border-radius: 12rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

/* 文本样式 */
.text-primary {
  color: #333;
}

.text-secondary {
  color: #666;
}

.text-muted {
  color: #999;
}

/* 布局工具类 */
.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}

.text-center {
  text-align: center;
}

/* 间距工具类 */
.mt-10 { margin-top: 10rpx; }
.mt-20 { margin-top: 20rpx; }
.mb-10 { margin-bottom: 10rpx; }
.mb-20 { margin-bottom: 20rpx; }
.p-10 { padding: 10rpx; }
.p-20 { padding: 20rpx; }
```

## 📄 页面文件结构

### 页面逻辑 (.js)
```javascript
Page({
  // 页面数据
  data: {
    title: '页面标题',
    list: [],
    loading: false
  },

  // 页面加载
  onLoad(options) {
    console.log('页面加载', options)
    this.initPage()
  },

  // 页面显示
  onShow() {
    console.log('页面显示')
  },

  // 页面就绪
  onReady() {
    console.log('页面就绪')
  },

  // 页面隐藏
  onHide() {
    console.log('页面隐藏')
  },

  // 页面卸载
  onUnload() {
    console.log('页面卸载')
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.refreshData()
  },

  // 上拉加载
  onReachBottom() {
    this.loadMoreData()
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/index/index'
    }
  },

  // 自定义方法
  initPage() {
    this.setData({
      loading: true
    })
    
    // 加载数据
    this.loadData()
  },

  loadData() {
    // 模拟API请求
    setTimeout(() => {
      this.setData({
        list: [1, 2, 3, 4, 5],
        loading: false
      })
    }, 1000)
  }
})
```

### 页面配置 (.json)
```json
{
  "navigationBarTitleText": "页面标题",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "backgroundColor": "#f5f5f5",
  "backgroundTextStyle": "light",
  "enablePullDownRefresh": true,
  "onReachBottomDistance": 50,
  "usingComponents": {
    "custom-button": "/components/custom-button/index"
  }
}
```

## 🧩 组件结构

### 自定义组件
```javascript
// components/custom-button/index.js
Component({
  // 组件属性
  properties: {
    text: {
      type: String,
      value: '按钮'
    },
    type: {
      type: String,
      value: 'default'
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  // 组件数据
  data: {
    loading: false
  },

  // 组件方法
  methods: {
    onTap() {
      if (this.data.disabled) return
      
      this.triggerEvent('tap', {
        text: this.properties.text
      })
    }
  },

  // 生命周期
  lifetimes: {
    attached() {
      console.log('组件挂载')
    },
    detached() {
      console.log('组件卸载')
    }
  }
})
```

## 🛠️ 工具函数组织

### utils/request.js - 网络请求封装
```javascript
const baseURL = 'https://api.example.com'

// 请求拦截器
const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': wx.getStorageSync('token') || '',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// GET请求
const get = (url, data) => {
  return request({
    url,
    method: 'GET',
    data
  })
}

// POST请求
const post = (url, data) => {
  return request({
    url,
    method: 'POST',
    data
  })
}

module.exports = {
  request,
  get,
  post
}
```

### utils/storage.js - 本地存储封装
```javascript
// 设置存储
const setStorage = (key, data) => {
  try {
    wx.setStorageSync(key, data)
    return true
  } catch (e) {
    console.error('存储失败', e)
    return false
  }
}

// 获取存储
const getStorage = (key, defaultValue = null) => {
  try {
    const value = wx.getStorageSync(key)
    return value || defaultValue
  } catch (e) {
    console.error('获取存储失败', e)
    return defaultValue
  }
}

// 删除存储
const removeStorage = (key) => {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('删除存储失败', e)
    return false
  }
}

// 清空存储
const clearStorage = () => {
  try {
    wx.clearStorageSync()
    return true
  } catch (e) {
    console.error('清空存储失败', e)
    return false
  }
}

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage
}
```

## 📱 最佳实践

### 1. 目录命名规范
- **页面目录**：使用小写字母和连字符，如 `user-profile`
- **组件目录**：使用小写字母和连字符，如 `custom-button`
- **工具文件**：使用驼峰命名，如 `requestUtil.js`

### 2. 文件组织原则
- **按功能分组**：相关功能的文件放在同一目录
- **公共资源提取**：将公共样式、工具函数单独管理
- **组件复用**：将可复用的UI组件独立封装

### 3. 代码结构建议
```javascript
// 推荐的页面结构
Page({
  // 1. 页面数据
  data: {},
  
  // 2. 生命周期函数
  onLoad() {},
  onShow() {},
  onReady() {},
  onHide() {},
  onUnload() {},
  
  // 3. 页面事件处理函数
  onPullDownRefresh() {},
  onReachBottom() {},
  onShareAppMessage() {},
  
  // 4. 自定义方法（按功能分组）
  // 初始化相关
  initPage() {},
  initData() {},
  
  // 数据处理相关
  loadData() {},
  refreshData() {},
  
  // 事件处理相关
  onButtonTap() {},
  onInputChange() {}
})
```

### 4. 性能优化建议
- **图片优化**：使用适当尺寸的图片，考虑使用WebP格式
- **代码分包**：将非首页功能进行分包加载
- **数据缓存**：合理使用本地存储减少网络请求
- **组件懒加载**：按需加载组件和页面

## 🔍 调试和开发工具

### project.config.json 配置
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
    "urlCheck": false,
    "es6": true,
    "enhance": true,
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
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    }
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "appid": "your-app-id",
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

## 📚 相关文档

- [第一个小程序](./first-app.md)
- [基本概念](./basic-concepts.md)
- [配置详解](./configuration.md)
- [组件开发](./component-development.md)

---

通过合理的项目结构组织，您可以构建出易于维护、扩展性强的小程序应用！🚀