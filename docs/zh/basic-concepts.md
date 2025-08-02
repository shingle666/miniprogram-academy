# 基础概念

理解小程序开发的核心概念和基本原理。

## 📋 目录

- [小程序架构](#小程序架构)
- [生命周期](#生命周期)
- [数据绑定](#数据绑定)
- [事件系统](#事件系统)
- [路由导航](#路由导航)
- [组件系统](#组件系统)

## 🏗️ 小程序架构

### 双线程架构

小程序采用双线程架构设计：

```
┌─────────────────┐    ┌─────────────────┐
│   渲染层 (View)   │    │  逻辑层 (App)    │
│                 │    │                 │
│   WXML + WXSS   │◄──►│   JavaScript    │
│                 │    │                 │
│   WebView       │    │   JSCore        │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
            ┌─────────────────┐
            │   Native 系统    │
            │                 │
            │   微信客户端      │
            └─────────────────┘
```

### 架构特点

- **渲染层**：负责界面渲染，运行在 WebView 中
- **逻辑层**：负责业务逻辑，运行在 JSCore 中
- **Native 层**：提供系统能力和微信能力

## 🔄 生命周期

### 应用生命周期

```javascript
// app.js
App({
  // 应用启动
  onLaunch(options) {
    console.log('应用启动', options)
    // 获取启动参数
    // 初始化全局数据
  },

  // 应用显示
  onShow(options) {
    console.log('应用显示', options)
    // 应用从后台进入前台
  },

  // 应用隐藏
  onHide() {
    console.log('应用隐藏')
    // 应用从前台进入后台
  },

  // 应用错误
  onError(msg) {
    console.error('应用错误', msg)
    // 处理应用级错误
  },

  // 页面不存在
  onPageNotFound(res) {
    console.log('页面不存在', res)
    // 重定向到首页或错误页
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },

  // 全局数据
  globalData: {
    userInfo: null,
    version: '1.0.0'
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
    // 获取页面参数
    // 初始化页面数据
  },

  // 页面显示
  onShow() {
    console.log('页面显示')
    // 页面每次显示都会调用
    // 刷新数据
  },

  // 页面就绪
  onReady() {
    console.log('页面就绪')
    // 页面首次渲染完成
    // 可以操作DOM
  },

  // 页面隐藏
  onHide() {
    console.log('页面隐藏')
    // 页面隐藏时调用
    // 暂停定时器等
  },

  // 页面卸载
  onUnload() {
    console.log('页面卸载')
    // 页面卸载时调用
    // 清理资源
  },

  // 下拉刷新
  onPullDownRefresh() {
    console.log('下拉刷新')
    // 处理下拉刷新
    wx.stopPullDownRefresh()
  },

  // 上拉加载
  onReachBottom() {
    console.log('上拉加载')
    // 处理上拉加载更多
  },

  // 页面分享
  onShareAppMessage() {
    return {
      title: '分享标题',
      path: '/pages/index/index'
    }
  }
})
```

### 组件生命周期

```javascript
// components/custom/custom.js
Component({
  // 组件生命周期
  lifetimes: {
    // 组件创建
    created() {
      console.log('组件创建')
    },

    // 组件挂载
    attached() {
      console.log('组件挂载')
      // 组件进入页面节点树
    },

    // 组件就绪
    ready() {
      console.log('组件就绪')
      // 组件布局完成
    },

    // 组件移动
    moved() {
      console.log('组件移动')
    },

    // 组件卸载
    detached() {
      console.log('组件卸载')
      // 组件离开页面节点树
    },

    // 组件错误
    error(error) {
      console.error('组件错误', error)
    }
  },

  // 页面生命周期
  pageLifetimes: {
    // 页面显示
    show() {
      console.log('页面显示')
    },

    // 页面隐藏
    hide() {
      console.log('页面隐藏')
    },

    // 页面尺寸变化
    resize(size) {
      console.log('页面尺寸变化', size)
    }
  }
})
```

## 📊 数据绑定

### 单向数据绑定

```xml
<!-- pages/index/index.wxml -->
<view class="container">
  <!-- 文本绑定 -->
  <text>{{message}}</text>
  
  <!-- 属性绑定 -->
  <image src="{{imageUrl}}" mode="{{imageMode}}"></image>
  
  <!-- 条件渲染 -->
  <view wx:if="{{isVisible}}">显示内容</view>
  <view wx:else>隐藏内容</view>
  
  <!-- 列表渲染 -->
  <view wx:for="{{items}}" wx:key="id">
    {{index}}: {{item.name}}
  </view>
  
  <!-- 表达式 -->
  <text>{{count + 1}}</text>
  <text>{{message.toUpperCase()}}</text>
  <text>{{isActive ? 'active' : 'inactive'}}</text>
</view>
```

```javascript
// pages/index/index.js
Page({
  data: {
    message: 'Hello World',
    imageUrl: '/images/logo.png',
    imageMode: 'aspectFit',
    isVisible: true,
    count: 0,
    isActive: false,
    items: [
      { id: 1, name: '项目1' },
      { id: 2, name: '项目2' },
      { id: 3, name: '项目3' }
    ]
  },

  // 更新数据
  updateData() {
    this.setData({
      message: 'Hello 小程序',
      count: this.data.count + 1,
      isActive: !this.data.isActive
    })
  }
})
```

### 双向数据绑定

```xml
<!-- 表单双向绑定 -->
<input model:value="{{inputValue}}" placeholder="请输入内容" />
<text>输入的内容：{{inputValue}}</text>

<!-- 自定义组件双向绑定 -->
<custom-input model:value="{{customValue}}"></custom-input>
```

```javascript
Page({
  data: {
    inputValue: '',
    customValue: ''
  }
})
```

## 🎯 事件系统

### 事件类型

```xml
<!-- 点击事件 -->
<button bindtap="handleTap">点击按钮</button>

<!-- 长按事件 -->
<view bindlongpress="handleLongPress">长按区域</view>

<!-- 触摸事件 -->
<view 
  bindtouchstart="handleTouchStart"
  bindtouchmove="handleTouchMove"
  bindtouchend="handleTouchEnd">
  触摸区域
</view>

<!-- 表单事件 -->
<input bindinput="handleInput" bindblur="handleBlur" />
<form bindsubmit="handleSubmit">
  <button form-type="submit">提交</button>
</form>
```

### 事件处理

```javascript
Page({
  // 点击事件
  handleTap(event) {
    console.log('点击事件', event)
    
    // 事件对象属性
    console.log('事件类型:', event.type)
    console.log('时间戳:', event.timeStamp)
    console.log('目标元素:', event.target)
    console.log('当前元素:', event.currentTarget)
    console.log('详细信息:', event.detail)
  },

  // 输入事件
  handleInput(event) {
    const value = event.detail.value
    this.setData({
      inputValue: value
    })
  },

  // 表单提交
  handleSubmit(event) {
    const formData = event.detail.value
    console.log('表单数据:', formData)
  },

  // 自定义事件数据
  handleCustomTap(event) {
    const { id, name } = event.currentTarget.dataset
    console.log('自定义数据:', id, name)
  }
})
```

### 事件传参

```xml
<!-- 通过 data-* 传递参数 -->
<view 
  wx:for="{{items}}" 
  wx:key="id"
  bindtap="handleItemTap"
  data-id="{{item.id}}"
  data-name="{{item.name}}">
  {{item.name}}
</view>
```

```javascript
Page({
  handleItemTap(event) {
    const { id, name } = event.currentTarget.dataset
    console.log('点击项目:', id, name)
  }
})
```

## 🧭 路由导航

### 页面跳转

```javascript
// 保留当前页面，跳转到应用内的某个页面
wx.navigateTo({
  url: '/pages/detail/detail?id=123',
  success: (res) => {
    console.log('跳转成功', res)
  },
  fail: (err) => {
    console.error('跳转失败', err)
  }
})

// 关闭当前页面，跳转到应用内的某个页面
wx.redirectTo({
  url: '/pages/home/home'
})

// 跳转到 tabBar 页面
wx.switchTab({
  url: '/pages/index/index'
})

// 关闭所有页面，打开到应用内的某个页面
wx.reLaunch({
  url: '/pages/index/index'
})

// 返回上一页面
wx.navigateBack({
  delta: 1 // 返回的页面数
})
```

### 页面参数传递

```javascript
// 发送页面
Page({
  goToDetail() {
    const data = {
      id: 123,
      title: '详情页面',
      type: 'article'
    }
    
    // 方式1：URL参数
    const params = Object.keys(data)
      .map(key => `${key}=${encodeURIComponent(data[key])}`)
      .join('&')
    
    wx.navigateTo({
      url: `/pages/detail/detail?${params}`
    })
    
    // 方式2：全局数据
    getApp().globalData.pageData = data
    wx.navigateTo({
      url: '/pages/detail/detail'
    })
  }
})

// 接收页面
Page({
  onLoad(options) {
    // 方式1：接收URL参数
    console.log('页面参数:', options)
    const { id, title, type } = options
    
    // 方式2：接收全局数据
    const pageData = getApp().globalData.pageData
    console.log('全局数据:', pageData)
  }
})
```

### 页面栈管理

```javascript
// 获取当前页面栈
const pages = getCurrentPages()
console.log('页面栈长度:', pages.length)
console.log('当前页面:', pages[pages.length - 1])

// 获取上一个页面
if (pages.length > 1) {
  const prevPage = pages[pages.length - 2]
  console.log('上一个页面:', prevPage)
  
  // 调用上一个页面的方法
  prevPage.refreshData && prevPage.refreshData()
}
```

## 🧩 组件系统

### 内置组件

```xml
<!-- 视图容器 -->
<view class="container">
  <scroll-view scroll-y="true" style="height: 200px;">
    <view>滚动内容</view>
  </scroll-view>
  
  <swiper indicator-dots="true" autoplay="true">
    <swiper-item>
      <image src="/images/banner1.jpg"></image>
    </swiper-item>
    <swiper-item>
      <image src="/images/banner2.jpg"></image>
    </swiper-item>
  </swiper>
</view>

<!-- 基础内容 -->
<text selectable="true">可选择的文本</text>
<rich-text nodes="{{htmlContent}}"></rich-text>
<progress percent="60" show-info="true"></progress>

<!-- 表单组件 -->
<form bindsubmit="handleSubmit">
  <input name="username" placeholder="用户名" />
  <textarea name="content" placeholder="内容"></textarea>
  <picker name="city" range="{{cities}}" bindchange="handleCityChange">
    <view>选择城市</view>
  </picker>
  <button form-type="submit">提交</button>
</form>

<!-- 导航组件 -->
<navigator url="/pages/detail/detail" hover-class="navigator-hover">
  跳转到详情页
</navigator>

<!-- 媒体组件 -->
<image src="{{imageUrl}}" mode="aspectFit" lazy-load="true"></image>
<video src="{{videoUrl}}" controls="true"></video>

<!-- 地图组件 -->
<map 
  longitude="{{longitude}}" 
  latitude="{{latitude}}" 
  markers="{{markers}}"
  bindmarkertap="handleMarkerTap">
</map>

<!-- 画布组件 -->
<canvas canvas-id="myCanvas" style="width: 300px; height: 200px;"></canvas>
```

### 自定义组件

```javascript
// components/custom-button/custom-button.js
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
    handleTap() {
      if (this.data.disabled || this.data.loading) {
        return
      }

      // 触发自定义事件
      this.triggerEvent('tap', {
        text: this.properties.text
      })
    },

    // 外部调用方法
    setLoading(loading) {
      this.setData({ loading })
    }
  },

  // 组件生命周期
  lifetimes: {
    attached() {
      console.log('自定义按钮组件挂载')
    }
  }
})
```

```xml
<!-- components/custom-button/custom-button.wxml -->
<button 
  class="custom-button custom-button--{{type}}"
  disabled="{{disabled || loading}}"
  bindtap="handleTap">
  <text wx:if="{{loading}}">加载中...</text>
  <text wx:else>{{text}}</text>
</button>
```

```css
/* components/custom-button/custom-button.wxss */
.custom-button {
  border-radius: 8rpx;
  font-size: 32rpx;
}

.custom-button--primary {
  background-color: #007aff;
  color: white;
}

.custom-button--default {
  background-color: #f8f8f8;
  color: #333;
}
```

### 组件使用

```json
{
  "usingComponents": {
    "custom-button": "/components/custom-button/custom-button"
  }
}
```

```xml
<custom-button 
  text="自定义按钮" 
  type="primary"
  bind:tap="handleCustomButtonTap">
</custom-button>
```

```javascript
Page({
  handleCustomButtonTap(event) {
    console.log('自定义按钮点击', event.detail)
    
    // 调用组件方法
    const customButton = this.selectComponent('#customButton')
    customButton.setLoading(true)
    
    setTimeout(() => {
      customButton.setLoading(false)
    }, 2000)
  }
})
```

## 📚 相关文档

- [项目结构](./project-structure.md) - 了解项目组织方式
- [配置详解](./configuration.md) - 深入了解配置选项
- [页面开发](./page-development.md) - 学习页面开发
- [组件开发](./component-development.md) - 掌握组件开发

## 🎯 总结

通过本章学习，你应该掌握：

1. **架构理解** - 双线程架构和运行机制
2. **生命周期** - 应用、页面、组件的生命周期
3. **数据绑定** - 单向和双向数据绑定
4. **事件处理** - 各种事件的处理方式
5. **路由导航** - 页面跳转和参数传递
6. **组件系统** - 内置组件和自定义组件

这些基础概念是小程序开发的核心，掌握它们将为后续的深入学习打下坚实基础！

---

*最后更新: 2025年*