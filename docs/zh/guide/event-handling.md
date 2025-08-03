# 事件处理

事件处理是小程序交互的核心机制，它让用户能够与小程序进行交互。本章将详细介绍小程序中的事件系统、事件类型和处理方法。

## 事件基础

### 事件绑定语法

小程序中使用 `bind` 或 `catch` 关键字来绑定事件：

```xml
<!-- bind 事件绑定（冒泡） -->
<view bindtap="handleTap">点击我</view>

<!-- catch 事件绑定（阻止冒泡） -->
<view catchtap="handleTap">点击我</view>

<!-- 简写形式 -->
<view bind:tap="handleTap">点击我</view>
<view catch:tap="handleTap">点击我</view>

<!-- 互斥事件绑定 -->
<view mut-bind:tap="handleTap">点击我</view>
```

### 事件处理函数

```javascript
Page({
  handleTap: function(event) {
    console.log('点击事件触发')
    console.log('事件对象:', event)
  }
})
```

## 事件对象

### 事件对象结构

```javascript
{
  type: "tap",                    // 事件类型
  timeStamp: 1234567890,          // 事件生成时的时间戳
  target: {                       // 触发事件的源组件
    id: "myButton",
    dataset: {
      id: "123",
      name: "test"
    }
  },
  currentTarget: {                // 事件绑定的当前组件
    id: "myContainer",
    dataset: {
      type: "container"
    }
  },
  detail: {                       // 额外的信息
    x: 100,
    y: 200
  },
  touches: [],                    // 触摸事件的触摸点信息
  changedTouches: []              // 触摸事件中变化的触摸点信息
}
```

### 获取事件信息

```javascript
Page({
  handleTap: function(e) {
    // 获取事件类型
    console.log('事件类型:', e.type)
    
    // 获取触发事件的组件信息
    console.log('触发组件ID:', e.target.id)
    console.log('触发组件数据:', e.target.dataset)
    
    // 获取绑定事件的组件信息
    console.log('当前组件ID:', e.currentTarget.id)
    console.log('当前组件数据:', e.currentTarget.dataset)
    
    // 获取事件详细信息
    console.log('事件详情:', e.detail)
  }
})
```

## 常用事件类型

### 触摸事件

```xml
<view 
  bindtouchstart="handleTouchStart"
  bindtouchmove="handleTouchMove"
  bindtouchend="handleTouchEnd"
  bindtouchcancel="handleTouchCancel">
  触摸区域
</view>
```

```javascript
Page({
  handleTouchStart: function(e) {
    console.log('触摸开始')
    console.log('触摸点:', e.touches[0])
    
    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },
  
  handleTouchMove: function(e) {
    console.log('触摸移动')
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    
    const deltaX = currentX - this.data.startX
    const deltaY = currentY - this.data.startY
    
    console.log('移动距离:', deltaX, deltaY)
  },
  
  handleTouchEnd: function(e) {
    console.log('触摸结束')
    console.log('结束位置:', e.changedTouches[0])
  },
  
  handleTouchCancel: function(e) {
    console.log('触摸取消')
  }
})
```

### 点击事件

```xml
<!-- 单击事件 -->
<button bindtap="handleTap">单击按钮</button>

<!-- 长按事件 -->
<view bindlongpress="handleLongPress">长按区域</view>

<!-- 双击事件（需要自己实现） -->
<view bindtap="handleDoubleTap">双击区域</view>
```

```javascript
Page({
  data: {
    lastTapTime: 0
  },
  
  handleTap: function(e) {
    console.log('单击事件')
  },
  
  handleLongPress: function(e) {
    console.log('长按事件')
    wx.showActionSheet({
      itemList: ['选项1', '选项2', '选项3']
    })
  },
  
  // 实现双击事件
  handleDoubleTap: function(e) {
    const currentTime = Date.now()
    const lastTapTime = this.data.lastTapTime
    
    if (currentTime - lastTapTime < 300) {
      console.log('双击事件')
      this.handleDoubleClick()
    }
    
    this.setData({
      lastTapTime: currentTime
    })
  },
  
  handleDoubleClick: function() {
    wx.showToast({
      title: '双击成功',
      icon: 'success'
    })
  }
})
```

### 表单事件

```xml
<!-- 输入事件 -->
<input 
  bindinput="handleInput"
  bindfocus="handleFocus"
  bindblur="handleBlur"
  bindconfirm="handleConfirm"
  placeholder="请输入内容" />

<!-- 选择器事件 -->
<picker 
  bindchange="handlePickerChange"
  range="{{pickerRange}}">
  <view class="picker">选择：{{pickerRange[pickerIndex]}}</view>
</picker>

<!-- 开关事件 -->
<switch bindchange="handleSwitchChange" />

<!-- 滑块事件 -->
<slider 
  bindchange="handleSliderChange"
  bindchanging="handleSliderChanging"
  min="0" 
  max="100" />
```

```javascript
Page({
  data: {
    inputValue: '',
    pickerRange: ['选项1', '选项2', '选项3'],
    pickerIndex: 0,
    switchValue: false,
    sliderValue: 50
  },
  
  handleInput: function(e) {
    console.log('输入内容:', e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  
  handleFocus: function(e) {
    console.log('输入框获得焦点')
  },
  
  handleBlur: function(e) {
    console.log('输入框失去焦点')
    console.log('最终值:', e.detail.value)
  },
  
  handleConfirm: function(e) {
    console.log('确认输入:', e.detail.value)
  },
  
  handlePickerChange: function(e) {
    console.log('选择器改变:', e.detail.value)
    this.setData({
      pickerIndex: e.detail.value
    })
  },
  
  handleSwitchChange: function(e) {
    console.log('开关状态:', e.detail.value)
    this.setData({
      switchValue: e.detail.value
    })
  },
  
  handleSliderChange: function(e) {
    console.log('滑块最终值:', e.detail.value)
    this.setData({
      sliderValue: e.detail.value
    })
  },
  
  handleSliderChanging: function(e) {
    console.log('滑块拖动中:', e.detail.value)
  }
})
```

### 滚动事件

```xml
<scroll-view 
  scroll-y="true"
  bindscroll="handleScroll"
  bindscrolltoupper="handleScrollToUpper"
  bindscrolltolower="handleScrollToLower"
  style="height: 400px;">
  <view wx:for="{{list}}" wx:key="id" class="item">
    {{item.name}}
  </view>
</scroll-view>

<!-- 页面滚动事件在页面 JS 中监听 -->
```

```javascript
Page({
  data: {
    list: []
  },
  
  onLoad: function() {
    // 生成测试数据
    const list = []
    for (let i = 1; i <= 50; i++) {
      list.push({ id: i, name: `项目 ${i}` })
    }
    this.setData({ list })
  },
  
  // 页面滚动事件
  onPageScroll: function(e) {
    console.log('页面滚动:', e.scrollTop)
    
    // 滚动到一定位置显示返回顶部按钮
    if (e.scrollTop > 200) {
      this.setData({
        showBackToTop: true
      })
    } else {
      this.setData({
        showBackToTop: false
      })
    }
  },
  
  // scroll-view 滚动事件
  handleScroll: function(e) {
    console.log('scroll-view 滚动:', e.detail.scrollTop)
  },
  
  handleScrollToUpper: function(e) {
    console.log('滚动到顶部')
    // 可以在这里实现下拉刷新
    this.refreshData()
  },
  
  handleScrollToLower: function(e) {
    console.log('滚动到底部')
    // 可以在这里实现上拉加载更多
    this.loadMoreData()
  },
  
  refreshData: function() {
    wx.showToast({
      title: '刷新数据',
      icon: 'success'
    })
  },
  
  loadMoreData: function() {
    wx.showToast({
      title: '加载更多',
      icon: 'success'
    })
  }
})
```

## 事件传参

### 使用 data-* 属性传参

```xml
<view wx:for="{{list}}" wx:key="id">
  <button 
    data-id="{{item.id}}"
    data-name="{{item.name}}"
    data-index="{{index}}"
    bindtap="handleItemTap">
    {{item.name}}
  </button>
</view>
```

```javascript
Page({
  data: {
    list: [
      { id: 1, name: '项目1' },
      { id: 2, name: '项目2' },
      { id: 3, name: '项目3' }
    ]
  },
  
  handleItemTap: function(e) {
    const dataset = e.currentTarget.dataset
    console.log('项目ID:', dataset.id)
    console.log('项目名称:', dataset.name)
    console.log('项目索引:', dataset.index)
    
    // 根据参数执行相应操作
    this.showItemDetail(dataset.id)
  },
  
  showItemDetail: function(id) {
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  }
})
```

### 复杂参数传递

```xml
<view wx:for="{{products}}" wx:key="id">
  <button 
    data-product="{{item}}"
    bindtap="handleProductTap">
    {{item.name}} - ¥{{item.price}}
  </button>
</view>
```

```javascript
Page({
  data: {
    products: [
      { id: 1, name: '商品1', price: 99.9, category: 'electronics' },
      { id: 2, name: '商品2', price: 199.9, category: 'clothing' }
    ]
  },
  
  handleProductTap: function(e) {
    const product = e.currentTarget.dataset.product
    console.log('选中的商品:', product)
    
    // 添加到购物车
    this.addToCart(product)
  },
  
  addToCart: function(product) {
    wx.showModal({
      title: '添加到购物车',
      content: `确定要添加 ${product.name} 到购物车吗？`,
      success: (res) => {
        if (res.confirm) {
          console.log('添加成功')
          // 执行添加逻辑
        }
      }
    })
  }
})
```

## 事件冒泡和捕获

### 事件冒泡

```xml
<view class="outer" bindtap="handleOuterTap">
  外层容器
  <view class="middle" bindtap="handleMiddleTap">
    中层容器
    <view class="inner" bindtap="handleInnerTap">
      内层容器
    </view>
  </view>
</view>
```

```javascript
Page({
  handleOuterTap: function(e) {
    console.log('外层容器被点击')
  },
  
  handleMiddleTap: function(e) {
    console.log('中层容器被点击')
  },
  
  handleInnerTap: function(e) {
    console.log('内层容器被点击')
    // 点击内层时，会依次触发：内层 -> 中层 -> 外层
  }
})
```

### 阻止事件冒泡

```xml
<view class="outer" bindtap="handleOuterTap">
  外层容器
  <view class="middle" bindtap="handleMiddleTap">
    中层容器
    <view class="inner" catchtap="handleInnerTap">
      内层容器（阻止冒泡）
    </view>
  </view>
</view>
```

```javascript
Page({
  handleInnerTap: function(e) {
    console.log('内层容器被点击')
    // 使用 catchtap 后，事件不会继续冒泡到中层和外层
  }
})
```

### 事件捕获

```xml
<view class="outer" capture-bind:tap="handleOuterCapture" bindtap="handleOuterTap">
  外层容器
  <view class="inner" capture-bind:tap="handleInnerCapture" bindtap="handleInnerTap">
    内层容器
  </view>
</view>
```

```javascript
Page({
  handleOuterCapture: function(e) {
    console.log('外层捕获阶段')
  },
  
  handleInnerCapture: function(e) {
    console.log('内层捕获阶段')
  },
  
  handleOuterTap: function(e) {
    console.log('外层冒泡阶段')
  },
  
  handleInnerTap: function(e) {
    console.log('内层冒泡阶段')
  }
  
  // 点击内层时的执行顺序：
  // 1. 外层捕获阶段
  // 2. 内层捕获阶段
  // 3. 内层冒泡阶段
  // 4. 外层冒泡阶段
})
```

## 自定义事件

### 组件自定义事件

```javascript
// 自定义组件
Component({
  properties: {
    value: String
  },
  
  methods: {
    handleInternalEvent: function() {
      // 触发自定义事件
      this.triggerEvent('customevent', {
        value: this.properties.value,
        timestamp: Date.now()
      }, {
        bubbles: true,
        composed: true
      })
    }
  }
})
```

```xml
<!-- 使用自定义组件 -->
<custom-component 
  value="test" 
  bind:customevent="handleCustomEvent">
</custom-component>
```

```javascript
// 页面处理自定义事件
Page({
  handleCustomEvent: function(e) {
    console.log('接收到自定义事件:', e.detail)
  }
})
```

### 事件总线模式

```javascript
// utils/eventBus.js
class EventBus {
  constructor() {
    this.events = {}
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  
  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(data)
      })
    }
  }
}

const eventBus = new EventBus()
export default eventBus
```

```javascript
// 页面A - 发送事件
import eventBus from '../../utils/eventBus'

Page({
  sendMessage: function() {
    eventBus.emit('message', {
      text: 'Hello from Page A',
      timestamp: Date.now()
    })
  }
})

// 页面B - 接收事件
import eventBus from '../../utils/eventBus'

Page({
  onLoad: function() {
    eventBus.on('message', this.handleMessage)
  },
  
  onUnload: function() {
    eventBus.off('message', this.handleMessage)
  },
  
  handleMessage: function(data) {
    console.log('收到消息:', data)
  }
})
```

## 手势识别

### 实现滑动手势

```javascript
Page({
  data: {
    startX: 0,
    startY: 0,
    startTime: 0
  },
  
  handleTouchStart: function(e) {
    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startTime: Date.now()
    })
  },
  
  handleTouchEnd: function(e) {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const endTime = Date.now()
    
    const deltaX = endX - this.data.startX
    const deltaY = endY - this.data.startY
    const deltaTime = endTime - this.data.startTime
    
    // 判断是否为有效滑动
    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
      if (deltaTime < 300) { // 快速滑动
        this.handleSwipe(deltaX, deltaY)
      }
    }
  },
  
  handleSwipe: function(deltaX, deltaY) {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > 0) {
        console.log('向右滑动')
        this.handleSwipeRight()
      } else {
        console.log('向左滑动')
        this.handleSwipeLeft()
      }
    } else {
      // 垂直滑动
      if (deltaY > 0) {
        console.log('向下滑动')
        this.handleSwipeDown()
      } else {
        console.log('向上滑动')
        this.handleSwipeUp()
      }
    }
  },
  
  handleSwipeLeft: function() {
    // 向左滑动逻辑
  },
  
  handleSwipeRight: function() {
    // 向右滑动逻辑
  },
  
  handleSwipeUp: function() {
    // 向上滑动逻辑
  },
  
  handleSwipeDown: function() {
    // 向下滑动逻辑
  }
})
```

### 实现缩放手势

```javascript
Page({
  data: {
    initialDistance: 0,
    currentScale: 1
  },
  
  handleTouchStart: function(e) {
    if (e.touches.length === 2) {
      // 双指触摸，计算初始距离
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = this.getDistance(touch1, touch2)
      
      this.setData({
        initialDistance: distance
      })
    }
  },
  
  handleTouchMove: function(e) {
    if (e.touches.length === 2) {
      // 双指移动，计算缩放比例
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const currentDistance = this.getDistance(touch1, touch2)
      
      const scale = currentDistance / this.data.initialDistance
      this.setData({
        currentScale: scale
      })
      
      console.log('缩放比例:', scale)
    }
  },
  
  getDistance: function(touch1, touch2) {
    const deltaX = touch1.clientX - touch2.clientX
    const deltaY = touch1.clientY - touch2.clientY
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  }
})
```

## 事件性能优化

### 1. 事件委托

```xml
<!-- 不好的做法 - 每个项目都绑定事件 -->
<view wx:for="{{list}}" wx:key="id">
  <button bindtap="handleItemTap" data-id="{{item.id}}">
    {{item.name}}
  </button>
</view>

<!-- 好的做法 - 事件委托 -->
<view bindtap="handleListTap">
  <view wx:for="{{list}}" wx:key="id" data-id="{{item.id}}" class="item">
    {{item.name}}
  </view>
</view>
```

```javascript
Page({
  handleListTap: function(e) {
    const id = e.target.dataset.id
    if (id) {
      console.log('点击项目:', id)
      this.handleItemAction(id)
    }
  }
})
```

### 2. 防抖和节流

```javascript
Page({
  data: {
    searchTimer: null
  },
  
  // 防抖 - 搜索输入
  handleSearchInput: function(e) {
    const value = e.detail.value
    
    // 清除之前的定时器
    if (this.data.searchTimer) {
      clearTimeout(this.data.searchTimer)
    }
    
    // 设置新的定时器
    const timer = setTimeout(() => {
      this.performSearch(value)
    }, 500)
    
    this.setData({
      searchTimer: timer
    })
  },
  
  // 节流 - 滚动事件
  handleScroll: function(e) {
    if (this.scrollThrottle) return
    
    this.scrollThrottle = true
    setTimeout(() => {
      this.processScroll(e.detail.scrollTop)
      this.scrollThrottle = false
    }, 100)
  },
  
  performSearch: function(keyword) {
    console.log('执行搜索:', keyword)
  },
  
  processScroll: function(scrollTop) {
    console.log('处理滚动:', scrollTop)
  }
})
```

### 3. 减少事件绑定

```xml
<!-- 使用条件渲染减少不必要的事件绑定 -->
<view wx:if="{{isInteractive}}" bindtap="handleTap">
  可交互内容
</view>

<view wx:else>
  静态内容
</view>
```

## 最佳实践

### 1. 事件处理函数命名规范

```javascript
Page({
  // 使用描述性的函数名
  handleUserLogin: function() {},
  handleProductAdd: function() {},
  handleOrderSubmit: function() {},
  
  // 避免使用通用名称
  // handleClick: function() {},  // 不推荐
  // onClick: function() {},      // 不推荐
})
```

### 2. 错误处理

```javascript
Page({
  handleFormSubmit: function(e) {
    try {
      const formData = e.detail.value
      this.validateForm(formData)
      this.submitForm(formData)
    } catch (error) {
      console.error('表单提交失败:', error)
      wx.showToast({
        title: '提交失败，请重试',
        icon: 'none'
      })
    }
  },
  
  validateForm: function(data) {
    if (!data.name) {
      throw new Error('姓名不能为空')
    }
    if (!data.email) {
      throw new Error('邮箱不能为空')
    }
  }
})
```

### 3. 事件清理

```javascript
Page({
  onLoad: function() {
    // 绑定全局事件
    wx.onNetworkStatusChange(this.handleNetworkChange)
  },
  
  onUnload: function() {
    // 清理事件监听
    wx.offNetworkStatusChange(this.handleNetworkChange)
    
    // 清理定时器
    if (this.data.timer) {
      clearInterval(this.data.timer)
    }
  },
  
  handleNetworkChange: function(res) {
    console.log('网络状态变化:', res.isConnected)
  }
})
```

## 总结

事件处理是小程序交互的基础：

1. **掌握事件基础** - 了解事件绑定语法和事件对象结构
2. **熟悉常用事件** - 触摸、点击、表单、滚动等事件的使用
3. **理解事件机制** - 事件冒泡、捕获和阻止机制
4. **实现复杂交互** - 手势识别、自定义事件等高级功能
5. **优化事件性能** - 使用防抖节流、事件委托等优化技巧

下一章我们将学习高级特性，包括自定义组件、插件开发等更深入的内容。