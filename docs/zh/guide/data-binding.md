# 数据绑定

数据绑定是小程序开发中的核心概念，它连接了逻辑层的数据和视图层的展示。本章将详细介绍小程序中的数据绑定机制和使用方法。

## 基础数据绑定

### 文本绑定

```xml
<!-- pages/demo/demo.wxml -->
<view>{{message}}</view>
<view>当前时间：{{currentTime}}</view>
<view>用户名：{{user.name}}</view>
```

```javascript
// pages/demo/demo.js
Page({
  data: {
    message: 'Hello World',
    currentTime: '2024-01-01 12:00:00',
    user: {
      name: '张三',
      age: 25
    }
  }
})
```

### 属性绑定

```xml
<!-- 绑定属性 -->
<view id="{{elementId}}" class="{{className}}">内容</view>
<image src="{{imageUrl}}" alt="{{imageAlt}}" />
<input placeholder="{{inputPlaceholder}}" value="{{inputValue}}" />

<!-- 布尔属性绑定 -->
<checkbox checked="{{isChecked}}" />
<button disabled="{{isDisabled}}">按钮</button>
```

```javascript
Page({
  data: {
    elementId: 'myElement',
    className: 'container active',
    imageUrl: '/images/logo.png',
    imageAlt: '网站Logo',
    inputPlaceholder: '请输入内容',
    inputValue: '',
    isChecked: true,
    isDisabled: false
  }
})
```

## 条件渲染

### wx:if 条件渲染

```xml
<!-- 单条件判断 -->
<view wx:if="{{isVisible}}">显示的内容</view>

<!-- 多条件判断 -->
<view wx:if="{{type === 'success'}}">成功</view>
<view wx:elif="{{type === 'warning'}}">警告</view>
<view wx:elif="{{type === 'error'}}">错误</view>
<view wx:else>默认</view>

<!-- 复杂条件 -->
<view wx:if="{{user.isLogin && user.level > 1}}">
  VIP用户内容
</view>
```

### hidden 属性

```xml
<!-- 使用 hidden 属性控制显示隐藏 -->
<view hidden="{{!isVisible}}">内容</view>

<!-- wx:if vs hidden 的区别 -->
<!-- wx:if 有更高的切换消耗，hidden 有更高的初始渲染消耗 -->
<view wx:if="{{condition}}">条件渲染</view>
<view hidden="{{!condition}}">隐藏显示</view>
```

```javascript
Page({
  data: {
    isVisible: true,
    type: 'success',
    user: {
      isLogin: true,
      level: 2
    },
    condition: false
  }
})
```

## 列表渲染

### 基础列表渲染

```xml
<!-- 基本用法 -->
<view wx:for="{{array}}" wx:key="id">
  {{index}}: {{item.name}}
</view>

<!-- 指定索引和当前项的变量名 -->
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName" wx:key="id">
  {{idx}}: {{itemName.name}}
</view>
```

```javascript
Page({
  data: {
    array: [
      { id: 1, name: '项目1' },
      { id: 2, name: '项目2' },
      { id: 3, name: '项目3' }
    ]
  }
})
```

### 嵌套列表渲染

```xml
<!-- 嵌套循环 -->
<view wx:for="{{categories}}" wx:key="id" wx:for-item="category">
  <view class="category-title">{{category.name}}</view>
  <view wx:for="{{category.items}}" wx:key="id" wx:for-item="item">
    <view class="item">{{item.title}}</view>
  </view>
</view>
```

```javascript
Page({
  data: {
    categories: [
      {
        id: 1,
        name: '分类1',
        items: [
          { id: 11, title: '项目1-1' },
          { id: 12, title: '项目1-2' }
        ]
      },
      {
        id: 2,
        name: '分类2',
        items: [
          { id: 21, title: '项目2-1' },
          { id: 22, title: '项目2-2' }
        ]
      }
    ]
  }
})
```

### 动态列表操作

```javascript
Page({
  data: {
    list: [
      { id: 1, name: '项目1', completed: false },
      { id: 2, name: '项目2', completed: true }
    ]
  },
  
  // 添加项目
  addItem: function() {
    const newItem = {
      id: Date.now(),
      name: `项目${this.data.list.length + 1}`,
      completed: false
    }
    
    this.setData({
      list: [...this.data.list, newItem]
    })
  },
  
  // 删除项目
  deleteItem: function(e) {
    const id = e.currentTarget.dataset.id
    const list = this.data.list.filter(item => item.id !== id)
    
    this.setData({
      list: list
    })
  },
  
  // 更新项目
  updateItem: function(e) {
    const id = e.currentTarget.dataset.id
    const index = this.data.list.findIndex(item => item.id === id)
    
    this.setData({
      [`list[${index}].completed`]: !this.data.list[index].completed
    })
  }
})
```

```xml
<!-- 动态列表模板 -->
<view class="list-container">
  <view wx:for="{{list}}" wx:key="id" class="list-item">
    <checkbox 
      checked="{{item.completed}}" 
      data-id="{{item.id}}"
      bindchange="updateItem" />
    <text class="{{item.completed ? 'completed' : ''}}">{{item.name}}</text>
    <button 
      data-id="{{item.id}}" 
      bindtap="deleteItem" 
      size="mini" 
      type="warn">删除</button>
  </view>
  <button bindtap="addItem">添加项目</button>
</view>
```

## 表达式和运算

### 基础表达式

```xml
<!-- 三元运算符 -->
<view>{{isLogin ? '欢迎回来' : '请登录'}}</view>

<!-- 算术运算 -->
<view>总价：{{price * quantity}}</view>
<view>折扣价：{{price * 0.8}}</view>

<!-- 逻辑运算 -->
<view wx:if="{{isLogin && isVip}}">VIP专享内容</view>
<view>{{count > 0 && '有' + count + '个项目'}}</view>

<!-- 字符串拼接 -->
<view>{{firstName + ' ' + lastName}}</view>
<view>{{'Hello ' + userName}}</view>
```

### 复杂表达式

```xml
<!-- 对象属性访问 -->
<view>{{user.profile.avatar}}</view>
<view>{{user['profile']['name']}}</view>

<!-- 数组访问 -->
<view>{{list[0].title}}</view>
<view>{{list[index].name}}</view>

<!-- 函数调用（需要在 wxs 中定义） -->
<wxs module="utils">
  var formatDate = function(date) {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  }
  
  var formatPrice = function(price) {
    return '¥' + price.toFixed(2)
  }
  
  module.exports = {
    formatDate: formatDate,
    formatPrice: formatPrice
  }
</wxs>

<view>{{utils.formatDate(currentDate)}}</view>
<view>{{utils.formatPrice(product.price)}}</view>
```

## 双向数据绑定

### 表单元素双向绑定

```xml
<!-- input 双向绑定 -->
<input 
  value="{{inputValue}}" 
  bindinput="handleInput" 
  placeholder="请输入内容" />

<!-- textarea 双向绑定 -->
<textarea 
  value="{{textareaValue}}" 
  bindinput="handleTextareaInput" 
  placeholder="请输入多行内容">
</textarea>

<!-- picker 双向绑定 -->
<picker 
  bindchange="handlePickerChange" 
  value="{{pickerIndex}}" 
  range="{{pickerRange}}">
  <view class="picker">
    当前选择：{{pickerRange[pickerIndex]}}
  </view>
</picker>

<!-- switch 双向绑定 -->
<switch 
  checked="{{switchValue}}" 
  bindchange="handleSwitchChange" />

<!-- slider 双向绑定 -->
<slider 
  value="{{sliderValue}}" 
  bindchange="handleSliderChange" 
  min="0" 
  max="100" />
```

```javascript
Page({
  data: {
    inputValue: '',
    textareaValue: '',
    pickerIndex: 0,
    pickerRange: ['选项1', '选项2', '选项3'],
    switchValue: false,
    sliderValue: 50
  },
  
  handleInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  
  handleTextareaInput: function(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  
  handlePickerChange: function(e) {
    this.setData({
      pickerIndex: e.detail.value
    })
  },
  
  handleSwitchChange: function(e) {
    this.setData({
      switchValue: e.detail.value
    })
  },
  
  handleSliderChange: function(e) {
    this.setData({
      sliderValue: e.detail.value
    })
  }
})
```

### 自定义组件双向绑定

```javascript
// 自定义组件
Component({
  properties: {
    value: {
      type: String,
      value: ''
    }
  },
  
  methods: {
    handleInput: function(e) {
      const value = e.detail.value
      
      // 更新组件内部状态
      this.setData({
        value: value
      })
      
      // 触发父组件更新
      this.triggerEvent('input', {
        value: value
      })
    }
  }
})
```

```xml
<!-- 使用自定义组件 -->
<custom-input 
  value="{{customValue}}" 
  bind:input="handleCustomInput">
</custom-input>
```

## WXS 脚本

### WXS 基础用法

```xml
<!-- 内联 WXS -->
<wxs module="m1">
var msg = "hello world";

module.exports.message = msg;
</wxs>

<view> {{m1.message}} </view>
```

### 外部 WXS 文件

```javascript
// utils/format.wxs
var formatDate = function(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  
  return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)
}

var formatPrice = function(price) {
  return '¥' + price.toFixed(2)
}

var formatNumber = function(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

module.exports = {
  formatDate: formatDate,
  formatPrice: formatPrice,
  formatNumber: formatNumber
}
```

```xml
<!-- 引用外部 WXS -->
<wxs src="../../utils/format.wxs" module="format" />

<view>日期：{{format.formatDate(currentDate)}}</view>
<view>价格：{{format.formatPrice(product.price)}}</view>
<view>数量：{{format.formatNumber(viewCount)}}</view>
```

### WXS 响应事件

```xml
<wxs module="touchHandler">
var touchStart = function(event, ownerInstance) {
  console.log('touchstart', event)
  ownerInstance.callMethod('handleTouchStart', event)
}

var touchMove = function(event, ownerInstance) {
  console.log('touchmove', event)
  ownerInstance.callMethod('handleTouchMove', event)
}

module.exports = {
  touchStart: touchStart,
  touchMove: touchMove
}
</wxs>

<view 
  bindtouchstart="{{touchHandler.touchStart}}" 
  bindtouchmove="{{touchHandler.touchMove}}"
  class="touch-area">
  触摸区域
</view>
```

## 数据更新优化

### 批量更新

```javascript
Page({
  data: {
    user: {
      name: '',
      age: 0,
      avatar: ''
    },
    list: []
  },
  
  // 不好的做法 - 多次 setData
  updateUserBad: function() {
    this.setData({
      'user.name': '新名字'
    })
    this.setData({
      'user.age': 25
    })
    this.setData({
      'user.avatar': '/images/avatar.png'
    })
  },
  
  // 好的做法 - 批量更新
  updateUserGood: function() {
    this.setData({
      'user.name': '新名字',
      'user.age': 25,
      'user.avatar': '/images/avatar.png'
    })
  }
})
```

### 局部更新

```javascript
Page({
  data: {
    list: [
      { id: 1, name: '项目1', status: 'pending' },
      { id: 2, name: '项目2', status: 'completed' }
    ]
  },
  
  // 更新特定项目的状态
  updateItemStatus: function(id, status) {
    const index = this.data.list.findIndex(item => item.id === id)
    if (index !== -1) {
      this.setData({
        [`list[${index}].status`]: status
      })
    }
  },
  
  // 添加新项目
  addItem: function(item) {
    this.setData({
      [`list[${this.data.list.length}]`]: item
    })
  }
})
```

### 数据监听

```javascript
Page({
  data: {
    count: 0,
    user: {
      name: 'John'
    }
  },
  
  observers: {
    'count': function(count) {
      console.log('count changed to:', count)
      if (count > 10) {
        wx.showToast({
          title: '数量超过限制',
          icon: 'none'
        })
      }
    },
    
    'user.name': function(name) {
      console.log('user name changed to:', name)
      this.validateUserName(name)
    }
  },
  
  validateUserName: function(name) {
    if (name.length < 2) {
      console.warn('用户名太短')
    }
  }
})
```

## 性能优化技巧

### 1. 避免不必要的数据绑定

```xml
<!-- 不好的做法 -->
<view wx:for="{{list}}" wx:key="id">
  <view>{{item.name}}</view>
  <view>{{item.description}}</view>
  <view>{{item.price}}</view>
  <view>{{item.category}}</view>
  <view>{{item.tags}}</view>
</view>

<!-- 好的做法 - 只绑定需要的数据 -->
<view wx:for="{{list}}" wx:key="id">
  <view>{{item.name}}</view>
  <view wx:if="{{item.showDescription}}">{{item.description}}</view>
</view>
```

### 2. 使用 wx:key 优化列表渲染

```xml
<!-- 使用唯一标识作为 key -->
<view wx:for="{{list}}" wx:key="id">
  {{item.name}}
</view>

<!-- 当没有唯一标识时，使用 *this -->
<view wx:for="{{stringArray}}" wx:key="*this">
  {{item}}
</view>
```

### 3. 合理使用条件渲染

```xml
<!-- 频繁切换使用 hidden -->
<view hidden="{{!isVisible}}">频繁切换的内容</view>

<!-- 不常切换使用 wx:if -->
<view wx:if="{{isLogin}}">登录后才显示的内容</view>
```

## 常见问题和解决方案

### 1. 数据更新不生效

```javascript
// 问题：直接修改 data 中的数组或对象
this.data.list.push(newItem) // 错误做法

// 解决：使用 setData
this.setData({
  list: [...this.data.list, newItem]
})
```

### 2. 循环中的事件处理

```xml
<!-- 使用 data-* 传递参数 -->
<view wx:for="{{list}}" wx:key="id">
  <button data-id="{{item.id}}" bindtap="handleItemTap">
    {{item.name}}
  </button>
</view>
```

```javascript
Page({
  handleItemTap: function(e) {
    const id = e.currentTarget.dataset.id
    console.log('点击的项目ID:', id)
  }
})
```

### 3. 复杂数据结构的更新

```javascript
Page({
  data: {
    user: {
      profile: {
        personal: {
          name: 'John',
          age: 25
        }
      }
    }
  },
  
  updateUserName: function(newName) {
    this.setData({
      'user.profile.personal.name': newName
    })
  }
})
```

## 总结

数据绑定是小程序开发的基础：

1. **掌握基础绑定** - 文本、属性、条件和列表渲染
2. **理解表达式** - 在模板中使用各种表达式和运算
3. **实现双向绑定** - 处理表单数据的双向同步
4. **使用 WXS** - 在模板中进行复杂的数据处理
5. **优化数据更新** - 提升应用性能和用户体验

下一章我们将学习事件处理，了解如何响应用户的交互操作。