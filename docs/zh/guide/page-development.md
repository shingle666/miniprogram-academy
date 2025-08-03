# 页面开发

页面是小程序的基本组成单元。本章将详细介绍小程序页面的开发方法，包括页面生命周期、路由导航、数据管理等核心概念。

## 页面生命周期

小程序页面有完整的生命周期，了解这些生命周期函数对于开发高质量的小程序至关重要。

### 生命周期函数

```javascript
// pages/demo/demo.js
Page({
  data: {
    text: "This is page data."
  },
  
  onLoad: function(options) {
    // 页面加载时触发，只会调用一次
    // options 为页面跳转所带来的参数
    console.log('页面加载', options)
  },
  
  onShow: function() {
    // 页面显示/切入前台时触发
    console.log('页面显示')
  },
  
  onReady: function() {
    // 页面初次渲染完成时触发，只会调用一次
    console.log('页面渲染完成')
  },
  
  onHide: function() {
    // 页面隐藏/切入后台时触发
    console.log('页面隐藏')
  },
  
  onUnload: function() {
    // 页面卸载时触发
    console.log('页面卸载')
  },
  
  onPullDownRefresh: function() {
    // 用户下拉刷新时触发
    console.log('下拉刷新')
    // 停止下拉刷新
    wx.stopPullDownRefresh()
  },
  
  onReachBottom: function() {
    // 页面上拉触底时触发
    console.log('上拉触底')
  },
  
  onShareAppMessage: function() {
    // 用户点击右上角分享时触发
    return {
      title: '自定义分享标题',
      path: '/pages/demo/demo'
    }
  },
  
  onPageScroll: function(e) {
    // 页面滚动时触发
    console.log('页面滚动', e.scrollTop)
  },
  
  onResize: function(res) {
    // 页面尺寸改变时触发
    console.log('页面尺寸改变', res.size)
  },
  
  onTabItemTap: function(item) {
    // tab 点击时触发
    console.log('tab点击', item.index, item.pagePath, item.text)
  }
})
```

### 生命周期执行顺序

```
页面首次加载：
onLoad → onShow → onReady

页面切换到后台：
onHide

页面从后台切换到前台：
onShow

页面卸载：
onUnload
```

## 页面配置

每个页面可以通过 `.json` 文件进行个性化配置：

```json
{
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "navigationBarTitleText": "页面标题",
  "backgroundColor": "#eeeeee",
  "backgroundTextStyle": "light",
  "enablePullDownRefresh": true,
  "onReachBottomDistance": 50,
  "pageOrientation": "portrait",
  "disableScroll": false,
  "usingComponents": {
    "custom-component": "/components/custom-component/index"
  }
}
```

### 配置项说明

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| navigationBarBackgroundColor | HexColor | #000000 | 导航栏背景颜色 |
| navigationBarTextStyle | String | white | 导航栏标题颜色 |
| navigationBarTitleText | String |  | 导航栏标题文字内容 |
| backgroundColor | HexColor | #ffffff | 窗口的背景色 |
| backgroundTextStyle | String | dark | 下拉 loading 的样式 |
| enablePullDownRefresh | Boolean | false | 是否开启当前页面下拉刷新 |
| onReachBottomDistance | Number | 50 | 页面上拉触底事件触发时距页面底部距离 |

## 页面路由

小程序中的页面路由由框架管理，开发者需要在 `app.json` 的 `pages` 字段中配置页面路径。

### 路由方式

#### 1. 声明式导航

```xml
<!-- 使用 navigator 组件 -->
<navigator url="/pages/detail/detail?id=123" hover-class="navigator-hover">
  跳转到详情页
</navigator>

<!-- 跳转到 tabBar 页面 -->
<navigator url="/pages/index/index" open-type="switchTab">
  跳转到首页
</navigator>

<!-- 返回上一页 -->
<navigator open-type="navigateBack" delta="1">
  返回上一页
</navigator>
```

#### 2. 编程式导航

```javascript
// 保留当前页面，跳转到应用内的某个页面
wx.navigateTo({
  url: '/pages/detail/detail?id=123',
  success: function(res) {
    console.log('跳转成功')
  },
  fail: function(res) {
    console.log('跳转失败')
  }
})

// 关闭当前页面，跳转到应用内的某个页面
wx.redirectTo({
  url: '/pages/detail/detail?id=123'
})

// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
wx.switchTab({
  url: '/pages/index/index'
})

// 关闭所有页面，打开到应用内的某个页面
wx.reLaunch({
  url: '/pages/index/index'
})

// 关闭当前页面，返回上一页面或多级页面
wx.navigateBack({
  delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
})
```

### 页面参数传递

#### 传递参数

```javascript
// 跳转时传递参数
wx.navigateTo({
  url: '/pages/detail/detail?id=123&name=test&type=1'
})
```

#### 接收参数

```javascript
// pages/detail/detail.js
Page({
  onLoad: function(options) {
    console.log(options.id)    // 123
    console.log(options.name)  // test
    console.log(options.type)  // 1
  }
})
```

#### 页面间通信

```javascript
// 页面A跳转到页面B，并传递数据
wx.navigateTo({
  url: '/pages/pageB/pageB',
  success: function(res) {
    // 通过eventChannel向被打开页面传送数据
    res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
  }
})

// 页面B接收数据
Page({
  onLoad: function(option) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function(data) {
      console.log(data)
    })
  }
})
```

## 页面数据管理

### 数据定义

```javascript
Page({
  data: {
    // 基本数据类型
    text: 'Hello World',
    number: 123,
    boolean: true,
    
    // 对象
    user: {
      name: '张三',
      age: 25,
      avatar: '/images/avatar.png'
    },
    
    // 数组
    list: [
      { id: 1, title: '项目1' },
      { id: 2, title: '项目2' },
      { id: 3, title: '项目3' }
    ],
    
    // 复杂数据结构
    pageInfo: {
      current: 1,
      size: 10,
      total: 100,
      loading: false
    }
  }
})
```

### 数据更新

```javascript
Page({
  data: {
    count: 0,
    user: {
      name: '张三',
      age: 25
    },
    list: []
  },
  
  // 更新简单数据
  updateCount: function() {
    this.setData({
      count: this.data.count + 1
    })
  },
  
  // 更新对象属性
  updateUser: function() {
    this.setData({
      'user.name': '李四',
      'user.age': 30
    })
  },
  
  // 更新数组
  updateList: function() {
    const newItem = { id: Date.now(), title: '新项目' }
    this.setData({
      list: [...this.data.list, newItem]
    })
  },
  
  // 批量更新
  batchUpdate: function() {
    this.setData({
      count: this.data.count + 1,
      'user.name': '王五',
      list: this.data.list.filter(item => item.id !== 1)
    })
  }
})
```

### 数据监听

```javascript
Page({
  data: {
    count: 0
  },
  
  observers: {
    'count': function(count) {
      console.log('count changed:', count)
    },
    
    'user.name, user.age': function(name, age) {
      console.log('user info changed:', name, age)
    }
  }
})
```

## 页面性能优化

### 1. 数据更新优化

```javascript
// 避免频繁的 setData 调用
// 不好的做法
for (let i = 0; i < 100; i++) {
  this.setData({
    [`list[${i}]`]: newData[i]
  })
}

// 好的做法
this.setData({
  list: newData
})
```

### 2. 页面预加载

```javascript
// app.json 中配置预加载
{
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["important"]
    }
  }
}
```

### 3. 图片优化

```xml
<!-- 使用 lazy-load 延迟加载 -->
<image src="{{imageUrl}}" lazy-load="{{true}}" />

<!-- 设置合适的图片模式 -->
<image src="{{imageUrl}}" mode="aspectFill" />
```

### 4. 长列表优化

```xml
<!-- 使用 recycle-view 组件 -->
<recycle-view batch="{{batchSetRecycleData}}" height="{{height}}">
  <recycle-item wx:for="{{recycleList}}" wx:key="id">
    <view class="item">{{item.title}}</view>
  </recycle-item>
</recycle-view>
```

## 页面调试技巧

### 1. 控制台调试

```javascript
Page({
  onLoad: function() {
    console.log('页面加载')
    console.table(this.data)
    console.time('数据处理')
    // 数据处理逻辑
    console.timeEnd('数据处理')
  }
})
```

### 2. 页面性能监控

```javascript
Page({
  onLoad: function() {
    // 监控页面加载时间
    const startTime = Date.now()
    
    // 页面逻辑
    
    const endTime = Date.now()
    console.log('页面加载耗时:', endTime - startTime, 'ms')
  }
})
```

### 3. 错误处理

```javascript
Page({
  onLoad: function() {
    try {
      // 可能出错的代码
      this.initData()
    } catch (error) {
      console.error('页面初始化失败:', error)
      wx.showToast({
        title: '页面加载失败',
        icon: 'none'
      })
    }
  },
  
  initData: function() {
    // 初始化数据逻辑
  }
})
```

## 最佳实践

### 1. 页面结构清晰

```javascript
Page({
  // 页面数据
  data: {},
  
  // 生命周期函数
  onLoad: function() {},
  onShow: function() {},
  onReady: function() {},
  
  // 事件处理函数
  handleTap: function() {},
  handleInput: function() {},
  
  // 自定义方法
  initData: function() {},
  loadMore: function() {},
  
  // 工具方法
  formatData: function() {},
  validateForm: function() {}
})
```

### 2. 合理使用生命周期

```javascript
Page({
  onLoad: function() {
    // 只执行一次的初始化操作
    this.initConfig()
  },
  
  onShow: function() {
    // 每次显示都需要执行的操作
    this.refreshData()
  },
  
  onHide: function() {
    // 页面隐藏时的清理操作
    this.clearTimer()
  }
})
```

### 3. 错误边界处理

```javascript
Page({
  onLoad: function() {
    wx.onError(function(error) {
      console.error('页面错误:', error)
      // 错误上报
      this.reportError(error)
    })
  },
  
  reportError: function(error) {
    // 错误上报逻辑
  }
})
```

## 总结

页面开发是小程序开发的核心内容：

1. **掌握生命周期** - 合理利用各个生命周期函数
2. **理解路由机制** - 正确使用页面跳转和参数传递
3. **管理页面数据** - 高效地更新和维护页面状态
4. **优化页面性能** - 提升用户体验
5. **调试和错误处理** - 确保页面稳定运行

下一章我们将学习组件开发，了解如何创建可复用的自定义组件。