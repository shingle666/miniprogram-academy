# 页面开发

深入学习小程序页面开发的核心技术，包括页面结构、数据绑定、事件处理和生命周期管理。

## 📄 页面基础结构

### 页面文件组成
每个小程序页面由四个文件组成：

```
pages/index/
├── index.js    # 页面逻辑
├── index.json  # 页面配置
├── index.wxml  # 页面结构
└── index.wxss  # 页面样式
```

### 页面逻辑 (index.js)
```javascript
Page({
  // 页面初始数据
  data: {
    title: '欢迎使用小程序',
    userInfo: null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list: [],
    loading: false,
    page: 1,
    hasMore: true
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    console.log('页面加载', options)
    this.initPage()
  },

  // 生命周期函数--监听页面初次渲染完成
  onReady: function () {
    console.log('页面初次渲染完成')
  },

  // 生命周期函数--监听页面显示
  onShow: function () {
    console.log('页面显示')
  },

  // 生命周期函数--监听页面隐藏
  onHide: function () {
    console.log('页面隐藏')
  },

  // 生命周期函数--监听页面卸载
  onUnload: function () {
    console.log('页面卸载')
  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    console.log('下拉刷新')
    this.refreshData()
  },

  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log('上拉触底')
    this.loadMoreData()
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
    return {
      title: '分享标题',
      path: '/pages/index/index',
      imageUrl: '/images/share.jpg'
    }
  },

  // 自定义方法
  initPage() {
    this.setData({
      loading: true
    })
    this.loadData()
  },

  loadData() {
    // 模拟API请求
    setTimeout(() => {
      this.setData({
        list: [
          { id: 1, title: '项目1', desc: '描述1' },
          { id: 2, title: '项目2', desc: '描述2' },
          { id: 3, title: '项目3', desc: '描述3' }
        ],
        loading: false
      })
      wx.stopPullDownRefresh()
    }, 1000)
  },

  refreshData() {
    this.setData({
      page: 1,
      list: [],
      hasMore: true
    })
    this.loadData()
  },

  loadMoreData() {
    if (!this.data.hasMore || this.data.loading) return
    
    this.setData({
      loading: true,
      page: this.data.page + 1
    })
    
    // 模拟加载更多数据
    setTimeout(() => {
      const newList = [
        { id: Date.now(), title: '新项目', desc: '新描述' }
      ]
      
      this.setData({
        list: [...this.data.list, ...newList],
        loading: false,
        hasMore: newList.length > 0
      })
    }, 1000)
  },

  // 事件处理函数
  onItemTap(e) {
    const { item } = e.currentTarget.dataset
    console.log('点击项目', item)
    
    wx.navigateTo({
      url: `/pages/detail/detail?id=${item.id}`
    })
  },

  onButtonTap() {
    wx.showToast({
      title: '按钮被点击',
      icon: 'success'
    })
  }
})
```

### 页面结构 (index.wxml)
```xml
<!--pages/index/index.wxml-->
<view class="container">
  <!-- 头部区域 -->
  <view class="header">
    <text class="title">{{title}}</text>
    <button class="btn" bindtap="onButtonTap">点击按钮</button>
  </view>

  <!-- 列表区域 -->
  <view class="list-container">
    <view 
      class="list-item" 
      wx:for="{{list}}" 
      wx:key="id"
      data-item="{{item}}"
      bindtap="onItemTap"
    >
      <view class="item-title">{{item.title}}</view>
      <view class="item-desc">{{item.desc}}</view>
    </view>
    
    <!-- 空状态 -->
    <view class="empty" wx:if="{{!loading && list.length === 0}}">
      <text>暂无数据</text>
    </view>
    
    <!-- 加载状态 -->
    <view class="loading" wx:if="{{loading}}">
      <text>加载中...</text>
    </view>
  </view>
</view>
```

### 页面样式 (index.wxss)
```css
/* pages/index/index.wxss */
.container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header {
  background: white;
  padding: 30rpx;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.btn {
  background-color: #07c160;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 20rpx 40rpx;
  font-size: 28rpx;
}

.list-container {
  background: white;
  border-radius: 12rpx;
  overflow: hidden;
}

.list-item {
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item:active {
  background-color: #f5f5f5;
}

.item-title {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 10rpx;
  font-weight: 500;
}

.item-desc {
  font-size: 28rpx;
  color: #666;
  line-height: 1.5;
}

.empty, .loading {
  padding: 60rpx;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}
```

### 页面配置 (index.json)
```json
{
  "navigationBarTitleText": "首页",
  "navigationBarBackgroundColor": "#ffffff",
  "navigationBarTextStyle": "black",
  "backgroundColor": "#f5f5f5",
  "backgroundTextStyle": "light",
  "enablePullDownRefresh": true,
  "onReachBottomDistance": 50,
  "usingComponents": {
    "custom-loading": "/components/loading/index"
  }
}
```

## 🔄 数据绑定

### 基础数据绑定
```xml
<!-- 文本绑定 -->
<text>{{message}}</text>

<!-- 属性绑定 -->
<view id="item-{{id}}">内容</view>

<!-- 控制属性 -->
<view wx:if="{{condition}}">条件渲染</view>
<checkbox checked="{{false}}"></checkbox>

<!-- 关键字需要在花括号内 -->
<checkbox checked="{{true}}"></checkbox>
```

### 运算表达式
```xml
<!-- 三元运算 -->
<view hidden="{{flag ? true : false}}">Hidden</view>

<!-- 算数运算 -->
<view>{{a + b}} + {{c}} + d</view>

<!-- 逻辑判断 -->
<view wx:if="{{length > 5}}">长度大于5</view>

<!-- 字符串运算 -->
<view>{{"hello" + name}}</view>

<!-- 数据路径运算 -->
<view>{{object.key}} {{array[0]}}</view>
```

### 条件渲染
```xml
<!-- wx:if -->
<view wx:if="{{condition}}">True</view>
<view wx:elif="{{condition2}}">Elif</view>
<view wx:else>Else</view>

<!-- hidden -->
<view hidden="{{condition}}">Hidden</view>

<!-- block wx:if -->
<block wx:if="{{true}}">
  <view>view1</view>
  <view>view2</view>
</block>
```

### 列表渲染
```xml
<!-- 基础列表渲染 -->
<view wx:for="{{array}}" wx:key="*this">
  {{index}}: {{item}}
</view>

<!-- 自定义索引和当前项变量名 -->
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName" wx:key="*this">
  {{idx}}: {{itemName}}
</view>

<!-- 对象列表渲染 -->
<view wx:for="{{objectArray}}" wx:key="id">
  {{item.id}}: {{item.name}}
</view>

<!-- 嵌套列表渲染 -->
<view wx:for="{{[1, 2, 3, 4, 5, 6, 7, 8, 9]}}" wx:for-item="i" wx:key="*this">
  <view wx:for="{{[1, 2, 3, 4, 5, 6, 7, 8, 9]}}" wx:for-item="j" wx:key="*this">
    <view wx:if="{{i <= j}}">{{i}} * {{j}} = {{i * j}}</view>
  </view>
</view>
```

## 🎯 事件处理

### 事件绑定
```xml
<!-- 点击事件 -->
<view bindtap="tapHandler">点击我</view>

<!-- 阻止事件冒泡 -->
<view catchtap="tapHandler">阻止冒泡</view>

<!-- 互斥事件绑定 -->
<view mut-bind:tap="tapHandler">互斥绑定</view>

<!-- 事件捕获 -->
<view capture-bind:tap="tapHandler">事件捕获</view>
<view capture-catch:tap="tapHandler">捕获且阻止冒泡</view>
```

### 事件对象
```javascript
Page({
  tapHandler(e) {
    console.log('事件对象', e)
    
    // 事件类型
    console.log('事件类型', e.type)
    
    // 时间戳
    console.log('时间戳', e.timeStamp)
    
    // 触发事件的组件
    console.log('target', e.target)
    
    // 绑定事件的组件
    console.log('currentTarget', e.currentTarget)
    
    // 额外信息
    console.log('detail', e.detail)
    
    // 触摸事件信息
    console.log('touches', e.touches)
    console.log('changedTouches', e.changedTouches)
  }
})
```

### 数据传递
```xml
<!-- 通过 data-* 传递数据 -->
<view 
  bindtap="itemTap" 
  data-id="{{item.id}}" 
  data-item="{{item}}"
>
  {{item.name}}
</view>
```

```javascript
Page({
  itemTap(e) {
    const { id, item } = e.currentTarget.dataset
    console.log('ID:', id)
    console.log('Item:', item)
  }
})
```

## 🔄 页面生命周期

### 生命周期流程
```
页面加载 → onLoad
    ↓
页面显示 → onShow
    ↓
页面渲染完成 → onReady
    ↓
页面隐藏 → onHide
    ↓
页面卸载 → onUnload
```

### 生命周期详解
```javascript
Page({
  // 页面加载时触发，只会调用一次
  onLoad(options) {
    console.log('页面加载', options)
    // 获取页面参数
    const { id, type } = options
    
    // 初始化页面数据
    this.initPageData()
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: '动态标题'
    })
  },

  // 页面显示时触发，每次显示都会调用
  onShow() {
    console.log('页面显示')
    // 刷新页面数据
    this.refreshData()
    
    // 统计页面访问
    this.trackPageView()
  },

  // 页面初次渲染完成时触发，只会调用一次
  onReady() {
    console.log('页面渲染完成')
    // 获取节点信息
    this.getElementInfo()
    
    // 创建动画
    this.createAnimation()
  },

  // 页面隐藏时触发
  onHide() {
    console.log('页面隐藏')
    // 暂停音频/视频
    this.pauseMedia()
    
    // 清除定时器
    this.clearTimers()
  },

  // 页面卸载时触发
  onUnload() {
    console.log('页面卸载')
    // 清理资源
    this.cleanup()
    
    // 取消网络请求
    this.cancelRequests()
  }
})
```

## 📱 页面交互

### 页面跳转
```javascript
Page({
  // 保留当前页面，跳转到应用内的某个页面
  navigateTo() {
    wx.navigateTo({
      url: '/pages/detail/detail?id=123',
      success: (res) => {
        console.log('跳转成功', res)
      },
      fail: (err) => {
        console.error('跳转失败', err)
      }
    })
  },

  // 关闭当前页面，跳转到应用内的某个页面
  redirectTo() {
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },

  // 跳转到 tabBar 页面
  switchTab() {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },

  // 关闭当前页面，返回上一页面或多级页面
  navigateBack() {
    wx.navigateBack({
      delta: 1 // 返回的页面数，如果 delta 大于现有页面数，则返回到首页
    })
  },

  // 关闭所有页面，打开到应用内的某个页面
  reLaunch() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  }
})
```

### 页面通信
```javascript
// 页面A - 传递数据
Page({
  goToPageB() {
    wx.navigateTo({
      url: '/pages/pageB/pageB',
      events: {
        // 监听由子页面传递的数据
        acceptDataFromPageB: (data) => {
          console.log('收到页面B的数据', data)
          this.setData({
            dataFromB: data
          })
        }
      },
      success: (res) => {
        // 向子页面传递数据
        res.eventChannel.emit('acceptDataFromPageA', {
          message: 'Hello from Page A'
        })
      }
    })
  }
})

// 页面B - 接收和发送数据
Page({
  onLoad() {
    // 监听页面A传递的数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromPageA', (data) => {
      console.log('收到页面A的数据', data)
      this.setData({
        dataFromA: data
      })
    })
  },

  sendDataToPageA() {
    // 向页面A发送数据
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('acceptDataFromPageB', {
      result: 'Data from Page B'
    })
  }
})
```

## 🎨 页面样式

### 尺寸单位
```css
/* rpx - 响应式像素 */
.container {
  width: 750rpx;  /* 屏幕宽度 */
  height: 200rpx;
}

/* px - 物理像素 */
.border {
  border: 1px solid #ccc;
}

/* % - 百分比 */
.full-width {
  width: 100%;
}

/* vh/vw - 视口单位 */
.full-height {
  height: 100vh;
}
```

### 样式导入
```css
/* 导入外部样式 */
@import "common.wxss";

/* 全局样式变量 */
:root {
  --primary-color: #07c160;
  --text-color: #333;
  --bg-color: #f5f5f5;
}

/* 使用变量 */
.button {
  background-color: var(--primary-color);
  color: white;
}
```

### 选择器
```css
/* 类选择器 */
.class-name {
  color: red;
}

/* ID选择器 */
#id-name {
  color: blue;
}

/* 标签选择器 */
view {
  display: block;
}

/* 属性选择器 */
[data-active="true"] {
  background-color: yellow;
}

/* 伪类选择器 */
.button:active {
  opacity: 0.8;
}

/* 后代选择器 */
.container .item {
  margin: 10rpx;
}

/* 子选择器 */
.list > .item {
  padding: 20rpx;
}
```

## 🔧 页面优化

### 性能优化
```javascript
Page({
  data: {
    list: [],
    // 使用对象而不是数组存储大量数据
    itemMap: {}
  },

  // 使用节流防抖
  onScrollThrottled: throttle(function(e) {
    console.log('滚动事件', e)
  }, 100),

  // 懒加载数据
  loadDataLazily() {
    if (this.data.loading) return
    
    this.setData({ loading: true })
    
    // 分页加载
    this.loadPage(this.data.currentPage + 1)
  },

  // 使用 setData 优化
  updateList() {
    // 避免频繁调用 setData
    const updates = {}
    updates[`list[${index}].status`] = 'updated'
    updates[`list[${index}].time`] = Date.now()
    
    this.setData(updates)
  }
})
```

### 内存管理
```javascript
Page({
  onLoad() {
    // 创建定时器
    this.timer = setInterval(() => {
      this.updateTime()
    }, 1000)
    
    // 创建动画
    this.animation = wx.createAnimation()
  },

  onUnload() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    
    // 清理动画
    if (this.animation) {
      this.animation = null
    }
    
    // 清理事件监听
    wx.offNetworkStatusChange()
  }
})
```

## 📚 相关文档

- [项目结构](./project-structure.md)
- [配置详解](./configuration.md)
- [组件开发](./component-development.md)
- [API使用](./api-usage.md)

---

掌握页面开发的核心技术，构建出交互丰富、性能优异的小程序页面！🚀