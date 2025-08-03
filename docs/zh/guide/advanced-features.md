# 高级特性

本章将介绍小程序开发中的高级特性，包括自定义组件的高级用法、插件开发、云开发、性能优化等内容，帮助开发者构建更加复杂和高效的小程序应用。

## 自定义组件高级用法

### 组件间关系定义

```javascript
// 父组件 components/tabs/tabs.js
Component({
  relations: {
    './tab-panel': {
      type: 'child',
      linked: function(target) {
        // 子组件插入时调用
        this.updateTabs()
      },
      linkChanged: function(target) {
        // 子组件移动时调用
        this.updateTabs()
      },
      unlinked: function(target) {
        // 子组件移除时调用
        this.updateTabs()
      }
    }
  },
  
  data: {
    activeIndex: 0
  },
  
  methods: {
    updateTabs: function() {
      const tabs = this.getRelationNodes('./tab-panel')
      console.log('当前标签页数量:', tabs.length)
    },
    
    switchTab: function(index) {
      const tabs = this.getRelationNodes('./tab-panel')
      tabs.forEach((tab, i) => {
        tab.setActive(i === index)
      })
      this.setData({
        activeIndex: index
      })
    }
  }
})
```

```javascript
// 子组件 components/tabs/tab-panel.js
Component({
  relations: {
    './tabs': {
      type: 'parent',
      linked: function(target) {
        // 插入到父组件时调用
        console.log('标签页已连接到父组件')
      }
    }
  },
  
  properties: {
    title: String,
    active: {
      type: Boolean,
      value: false
    }
  },
  
  methods: {
    setActive: function(active) {
      this.setData({
        active: active
      })
    }
  }
})
```

### 抽象节点

```json
// components/selectable-group/selectable-group.json
{
  "component": true,
  "componentGenerics": {
    "selectable": true
  }
}
```

```xml
<!-- components/selectable-group/selectable-group.wxml -->
<view class="selectable-group">
  <view wx:for="{{items}}" wx:key="id" class="selectable-item">
    <selectable 
      value="{{item.value}}" 
      checked="{{item.checked}}"
      bind:change="handleItemChange">
      {{item.label}}
    </selectable>
  </view>
</view>
```

```xml
<!-- 使用抽象节点 -->
<selectable-group 
  generic:selectable="radio"
  items="{{radioItems}}"
  bind:change="handleRadioChange">
</selectable-group>

<selectable-group 
  generic:selectable="checkbox"
  items="{{checkboxItems}}"
  bind:change="handleCheckboxChange">
</selectable-group>
```

### 组件构造器

```javascript
// 使用 Behavior 创建可复用的行为
const formValidationBehavior = Behavior({
  data: {
    errors: {}
  },
  
  methods: {
    validate: function(rules) {
      const errors = {}
      const data = this.data
      
      Object.keys(rules).forEach(field => {
        const rule = rules[field]
        const value = data[field]
        
        if (rule.required && !value) {
          errors[field] = rule.message || `${field} 是必填项`
        }
        
        if (rule.pattern && value && !rule.pattern.test(value)) {
          errors[field] = rule.message || `${field} 格式不正确`
        }
      })
      
      this.setData({ errors })
      return Object.keys(errors).length === 0
    },
    
    clearErrors: function() {
      this.setData({ errors: {} })
    }
  }
})

// 在组件中使用 Behavior
Component({
  behaviors: [formValidationBehavior],
  
  data: {
    username: '',
    email: ''
  },
  
  methods: {
    handleSubmit: function() {
      const isValid = this.validate({
        username: {
          required: true,
          message: '用户名不能为空'
        },
        email: {
          required: true,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '请输入有效的邮箱地址'
        }
      })
      
      if (isValid) {
        console.log('表单验证通过')
        this.submitForm()
      }
    }
  }
})
```

## 插件开发

### 插件结构

```
plugin/
├── components/          # 插件提供的自定义组件
│   └── hello-component/
│       ├── hello-component.js
│       ├── hello-component.json
│       ├── hello-component.wxml
│       └── hello-component.wxss
├── pages/              # 插件页面
│   └── hello-page/
│       ├── hello-page.js
│       ├── hello-page.json
│       ├── hello-page.wxml
│       └── hello-page.wxss
├── index.js            # 插件入口文件
└── plugin.json         # 插件配置文件
```

### 插件配置

```json
// plugin.json
{
  "publicComponents": {
    "hello-component": "components/hello-component/hello-component"
  },
  "publicPages": {
    "hello-page": "pages/hello-page/hello-page"
  },
  "main": "index.js"
}
```

### 插件入口文件

```javascript
// index.js
module.exports = {
  hello: function() {
    console.log('Hello from plugin!')
  },
  
  formatDate: function(date) {
    return date.toISOString().split('T')[0]
  },
  
  request: function(options) {
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        success: resolve,
        fail: reject
      })
    })
  }
}
```

### 插件组件

```javascript
// components/hello-component/hello-component.js
Component({
  properties: {
    name: {
      type: String,
      value: 'World'
    }
  },
  
  methods: {
    sayHello: function() {
      wx.showToast({
        title: `Hello ${this.properties.name}!`,
        icon: 'none'
      })
    }
  }
})
```

### 使用插件

```json
// app.json
{
  "plugins": {
    "myPlugin": {
      "version": "1.0.0",
      "provider": "your-plugin-appid"
    }
  }
}
```

```json
// 页面配置
{
  "usingComponents": {
    "hello-component": "plugin://myPlugin/hello-component"
  }
}
```

```xml
<!-- 使用插件组件 -->
<hello-component name="小程序" />
```

```javascript
// 使用插件方法
const plugin = requirePlugin('myPlugin')

Page({
  onLoad: function() {
    plugin.hello()
    
    const formattedDate = plugin.formatDate(new Date())
    console.log('格式化日期:', formattedDate)
  }
})
```

## 云开发

### 云开发初始化

```javascript
// app.js
App({
  onLaunch: function() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'your-env-id',
        traceUser: true
      })
    }
  }
})
```

### 云数据库操作

```javascript
Page({
  data: {
    todos: []
  },
  
  onLoad: function() {
    this.loadTodos()
  },
  
  // 查询数据
  loadTodos: function() {
    const db = wx.cloud.database()
    
    db.collection('todos')
      .where({
        _openid: '{openid}' // 只查询当前用户的数据
      })
      .orderBy('createTime', 'desc')
      .get()
      .then(res => {
        console.log('查询成功:', res.data)
        this.setData({
          todos: res.data
        })
      })
      .catch(err => {
        console.error('查询失败:', err)
      })
  },
  
  // 添加数据
  addTodo: function(title) {
    const db = wx.cloud.database()
    
    db.collection('todos')
      .add({
        data: {
          title: title,
          completed: false,
          createTime: new Date()
        }
      })
      .then(res => {
        console.log('添加成功:', res._id)
        this.loadTodos() // 重新加载数据
      })
      .catch(err => {
        console.error('添加失败:', err)
      })
  },
  
  // 更新数据
  updateTodo: function(id, updates) {
    const db = wx.cloud.database()
    
    db.collection('todos')
      .doc(id)
      .update({
        data: updates
      })
      .then(res => {
        console.log('更新成功')
        this.loadTodos()
      })
      .catch(err => {
        console.error('更新失败:', err)
      })
  },
  
  // 删除数据
  deleteTodo: function(id) {
    const db = wx.cloud.database()
    
    db.collection('todos')
      .doc(id)
      .remove()
      .then(res => {
        console.log('删除成功')
        this.loadTodos()
      })
      .catch(err => {
        console.error('删除失败:', err)
      })
  }
})
```

### 云函数调用

```javascript
// 云函数 functions/login/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    timestamp: new Date().getTime()
  }
}
```

```javascript
// 小程序中调用云函数
Page({
  getUserInfo: function() {
    wx.cloud.callFunction({
      name: 'login',
      data: {
        action: 'getUserInfo'
      }
    }).then(res => {
      console.log('云函数调用成功:', res.result)
      this.setData({
        userInfo: res.result
      })
    }).catch(err => {
      console.error('云函数调用失败:', err)
    })
  }
})
```

### 云存储

```javascript
Page({
  // 上传文件
  uploadFile: function() {
    wx.chooseImage({
      count: 1,
      success: res => {
        const filePath = res.tempFilePaths[0]
        
        wx.cloud.uploadFile({
          cloudPath: `images/${Date.now()}.jpg`,
          filePath: filePath
        }).then(res => {
          console.log('上传成功:', res.fileID)
          this.setData({
            imageUrl: res.fileID
          })
        }).catch(err => {
          console.error('上传失败:', err)
        })
      }
    })
  },
  
  // 下载文件
  downloadFile: function(fileID) {
    wx.cloud.downloadFile({
      fileID: fileID
    }).then(res => {
      console.log('下载成功:', res.tempFilePath)
      // 可以将文件保存到本地
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath
      })
    }).catch(err => {
      console.error('下载失败:', err)
    })
  },
  
  // 删除文件
  deleteFile: function(fileID) {
    wx.cloud.deleteFile({
      fileList: [fileID]
    }).then(res => {
      console.log('删除成功:', res.fileList)
    }).catch(err => {
      console.error('删除失败:', err)
    })
  }
})
```

## 分包加载

### 分包配置

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "subpackages": [
    {
      "root": "packageA",
      "name": "pack1",
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
      ],
      "independent": true
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["pack1"]
    }
  }
}
```

### 分包预下载

```javascript
// 手动预下载分包
Page({
  onLoad: function() {
    // 预下载分包
    wx.preloadSubpackage({
      name: 'pack1',
      success: res => {
        console.log('分包预下载成功')
      },
      fail: err => {
        console.error('分包预下载失败:', err)
      }
    })
  },
  
  navigateToSubpackage: function() {
    wx.navigateTo({
      url: '/packageA/pages/cat/cat'
    })
  }
})
```

## 自定义 tabBar

### 自定义 tabBar 配置

```json
// app.json
{
  "tabBar": {
    "custom": true,
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "日志"
      }
    ]
  }
}
```

### 自定义 tabBar 组件

```javascript
// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [
      {
        pagePath: "/pages/index/index",
        iconPath: "/images/icon_component.png",
        selectedIconPath: "/images/icon_component_HL.png",
        text: "首页"
      },
      {
        pagePath: "/pages/logs/logs",
        iconPath: "/images/icon_API.png",
        selectedIconPath: "/images/icon_API_HL.png",
        text: "日志"
      }
    ]
  },
  
  attached() {
    // 获取当前页面路径，设置选中状态
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const url = currentPage.route
    
    this.setSelected(url)
  },
  
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      
      wx.switchTab({ url })
      this.setSelected(url)
    },
    
    setSelected(url) {
      const selected = this.data.list.findIndex(item => 
        item.pagePath.replace(/^\//, '') === url
      )
      
      this.setData({
        selected: selected !== -1 ? selected : 0
      })
    }
  }
})
```

```xml
<!-- custom-tab-bar/index.wxml -->
<cover-view class="tab-bar">
  <cover-view 
    wx:for="{{list}}" 
    wx:key="index"
    class="tab-bar-item {{selected === index ? 'tab-bar-item-active' : ''}}"
    data-path="{{item.pagePath}}"
    data-index="{{index}}"
    bindtap="switchTab">
    
    <cover-image 
      src="{{selected === index ? item.selectedIconPath : item.iconPath}}"
      class="tab-bar-icon">
    </cover-image>
    
    <cover-view 
      class="tab-bar-text"
      style="color: {{selected === index ? selectedColor : color}}">
      {{item.text}}
    </cover-view>
  </cover-view>
</cover-view>
```

## 性能监控

### 性能数据收集

```javascript
// utils/performance.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
  }
  
  // 记录页面加载时间
  recordPageLoad(pageName, startTime) {
    const endTime = Date.now()
    const loadTime = endTime - startTime
    
    this.metrics[`${pageName}_load_time`] = loadTime
    console.log(`页面 ${pageName} 加载时间: ${loadTime}ms`)
    
    // 上报性能数据
    this.reportMetrics({
      page: pageName,
      loadTime: loadTime,
      timestamp: endTime
    })
  }
  
  // 记录接口请求时间
  recordApiCall(apiName, startTime, success = true) {
    const endTime = Date.now()
    const responseTime = endTime - startTime
    
    this.metrics[`${apiName}_response_time`] = responseTime
    console.log(`接口 ${apiName} 响应时间: ${responseTime}ms`)
    
    this.reportMetrics({
      api: apiName,
      responseTime: responseTime,
      success: success,
      timestamp: endTime
    })
  }
  
  // 记录用户行为
  recordUserAction(action, data = {}) {
    const timestamp = Date.now()
    
    console.log(`用户行为: ${action}`, data)
    
    this.reportMetrics({
      action: action,
      data: data,
      timestamp: timestamp
    })
  }
  
  // 上报性能数据
  reportMetrics(data) {
    // 这里可以上报到你的分析服务
    wx.request({
      url: 'https://your-analytics-server.com/metrics',
      method: 'POST',
      data: data,
      success: res => {
        console.log('性能数据上报成功')
      },
      fail: err => {
        console.error('性能数据上报失败:', err)
      }
    })
  }
}

const performanceMonitor = new PerformanceMonitor()
export default performanceMonitor
```

### 在页面中使用性能监控

```javascript
import performanceMonitor from '../../utils/performance'

Page({
  data: {
    loadStartTime: 0
  },
  
  onLoad: function() {
    this.setData({
      loadStartTime: Date.now()
    })
    
    // 记录用户进入页面
    performanceMonitor.recordUserAction('page_enter', {
      page: 'index'
    })
  },
  
  onReady: function() {
    // 记录页面加载完成时间
    performanceMonitor.recordPageLoad('index', this.data.loadStartTime)
  },
  
  loadData: function() {
    const startTime = Date.now()
    
    wx.request({
      url: 'https://api.example.com/data',
      success: res => {
        performanceMonitor.recordApiCall('getData', startTime, true)
        this.setData({
          data: res.data
        })
      },
      fail: err => {
        performanceMonitor.recordApiCall('getData', startTime, false)
        console.error('数据加载失败:', err)
      }
    })
  },
  
  handleUserClick: function(e) {
    performanceMonitor.recordUserAction('button_click', {
      buttonId: e.currentTarget.id,
      page: 'index'
    })
  }
})
```

## 错误监控和上报

### 全局错误处理

```javascript
// app.js
App({
  onLaunch: function() {
    // 监听小程序错误
    wx.onError(error => {
      console.error('小程序错误:', error)
      this.reportError('app_error', error)
    })
    
    // 监听未处理的 Promise 拒绝
    wx.onUnhandledRejection(res => {
      console.error('未处理的 Promise 拒绝:', res)
      this.reportError('unhandled_rejection', res.reason)
    })
  },
  
  reportError: function(type, error) {
    const errorInfo = {
      type: type,
      message: error.message || error,
      stack: error.stack || '',
      timestamp: Date.now(),
      userAgent: wx.getSystemInfoSync(),
      page: getCurrentPages().pop()?.route || 'unknown'
    }
    
    wx.request({
      url: 'https://your-error-reporting-service.com/errors',
      method: 'POST',
      data: errorInfo,
      success: res => {
        console.log('错误上报成功')
      },
      fail: err => {
        console.error('错误上报失败:', err)
      }
    })
  }
})
```

### 页面级错误处理

```javascript
Page({
  onLoad: function() {
    // 设置页面错误边界
    this.setupErrorBoundary()
  },
  
  setupErrorBoundary: function() {
    const originalSetData = this.setData
    
    this.setData = function(data, callback) {
      try {
        return originalSetData.call(this, data, callback)
      } catch (error) {
        console.error('setData 错误:', error)
        this.handleError('setdata_error', error)
      }
    }
  },
  
  handleError: function(type, error) {
    console.error(`页面错误 [${type}]:`, error)
    
    // 显示用户友好的错误信息
    wx.showToast({
      title: '操作失败，请重试',
      icon: 'none'
    })
    
    // 上报错误
    getApp().reportError(type, error)
  },
  
  safeExecute: function(fn, context = this) {
    try {
      return fn.call(context)
    } catch (error) {
      this.handleError('function_execution_error', error)
    }
  }
})
```

## 总结

小程序高级特性为开发者提供了强大的能力：

1. **组件高级用法** - 组件关系、抽象节点、Behavior 等
2. **插件开发** - 创建可复用的功能模块
3. **云开发** - 后端即服务，简化开发流程
4. **分包加载** - 优化小程序启动性能
5. **自定义 tabBar** - 创建个性化的导航体验
6. **性能监控** - 实时监控应用性能
7. **错误处理** - 构建稳定可靠的应用

掌握这些高级特性，能够帮助开发者构建更加复杂、高效和稳定的小程序应用。