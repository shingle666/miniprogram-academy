# 组件开发

组件是小程序开发中的重要概念，它可以将复杂的页面拆分成多个独立的、可复用的部分。本章将详细介绍如何开发自定义组件。

## 组件基础

### 创建组件

创建一个自定义组件需要四个文件：

```
components/
└── custom-button/
    ├── index.js    # 组件逻辑
    ├── index.json  # 组件配置
    ├── index.wxml  # 组件结构
    └── index.wxss  # 组件样式
```

### 组件配置文件

```json
{
  "component": true,
  "usingComponents": {}
}
```

### 基本组件结构

```javascript
// components/custom-button/index.js
Component({
  // 组件的属性列表
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

  // 组件的内部数据
  data: {
    loading: false
  },

  // 组件的方法列表
  methods: {
    handleTap: function() {
      if (this.data.disabled || this.data.loading) {
        return
      }
      
      // 触发自定义事件
      this.triggerEvent('tap', {
        text: this.properties.text
      })
    },
    
    setLoading: function(loading) {
      this.setData({
        loading: loading
      })
    }
  },

  // 组件生命周期
  lifetimes: {
    created: function() {
      // 组件实例刚刚被创建好时
      console.log('组件创建')
    },
    
    attached: function() {
      // 组件实例进入页面节点树时
      console.log('组件挂载')
    },
    
    ready: function() {
      // 组件在视图层布局完成后执行
      console.log('组件准备完毕')
    },
    
    detached: function() {
      // 组件实例被从页面节点树移除时
      console.log('组件卸载')
    }
  },

  // 组件所在页面的生命周期
  pageLifetimes: {
    show: function() {
      // 页面被展示
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  }
})
```

### 组件模板

```xml
<!-- components/custom-button/index.wxml -->
<view class="custom-button {{type}} {{disabled ? 'disabled' : ''}}" 
      bindtap="handleTap">
  <view wx:if="{{loading}}" class="loading">
    <view class="spinner"></view>
  </view>
  <text class="button-text">{{text}}</text>
</view>
```

### 组件样式

```css
/* components/custom-button/index.wxss */
.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
  transition: all 0.3s ease;
  position: relative;
}

.custom-button.default {
  background-color: #007aff;
  color: white;
}

.custom-button.primary {
  background-color: #ff3b30;
  color: white;
}

.custom-button.secondary {
  background-color: #f2f2f7;
  color: #000;
}

.custom-button.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.loading {
  margin-right: 8rpx;
}

.spinner {
  width: 20rpx;
  height: 20rpx;
  border: 2rpx solid rgba(255, 255, 255, 0.3);
  border-top: 2rpx solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

## 组件属性

### 属性定义

```javascript
Component({
  properties: {
    // 简写形式
    title: String,
    
    // 完整形式
    count: {
      type: Number,
      value: 0,
      observer: function(newVal, oldVal) {
        console.log('count changed:', oldVal, '->', newVal)
      }
    },
    
    // 复杂类型
    user: {
      type: Object,
      value: function() {
        return {
          name: '',
          age: 0
        }
      }
    },
    
    // 数组类型
    list: {
      type: Array,
      value: []
    },
    
    // 任意类型
    data: {
      type: null,
      value: null
    }
  }
})
```

### 属性监听

```javascript
Component({
  properties: {
    value: {
      type: String,
      value: '',
      observer: 'valueChanged'
    }
  },
  
  methods: {
    valueChanged: function(newVal, oldVal) {
      console.log('value changed:', oldVal, '->', newVal)
      // 可以在这里进行数据处理
      this.processValue(newVal)
    },
    
    processValue: function(value) {
      // 处理属性值变化
    }
  }
})
```

## 组件事件

### 触发事件

```javascript
Component({
  methods: {
    handleClick: function() {
      // 触发自定义事件
      this.triggerEvent('customtap', {
        value: this.data.value,
        timestamp: Date.now()
      }, {
        bubbles: true,    // 事件是否冒泡
        composed: true,   // 事件是否可以穿越组件边界
        capturePhase: false // 事件是否拥有捕获阶段
      })
    }
  }
})
```

### 监听事件

```xml
<!-- 在页面中使用组件 -->
<custom-button 
  text="点击我" 
  bind:customtap="handleCustomTap"
  catch:customtap="handleCustomTapCatch">
</custom-button>
```

```javascript
// 页面中处理组件事件
Page({
  handleCustomTap: function(e) {
    console.log('接收到组件事件:', e.detail)
  },
  
  handleCustomTapCatch: function(e) {
    console.log('捕获组件事件:', e.detail)
    // catch 会阻止事件继续传播
  }
})
```

## 组件通信

### 父子组件通信

#### 父组件向子组件传递数据

```xml
<!-- 父组件 -->
<child-component 
  title="{{parentTitle}}" 
  data="{{parentData}}">
</child-component>
```

```javascript
// 子组件接收数据
Component({
  properties: {
    title: String,
    data: Object
  }
})
```

#### 子组件向父组件传递数据

```javascript
// 子组件
Component({
  methods: {
    sendDataToParent: function() {
      this.triggerEvent('datachange', {
        value: this.data.value
      })
    }
  }
})
```

```xml
<!-- 父组件 -->
<child-component bind:datachange="handleDataChange"></child-component>
```

### 兄弟组件通信

```javascript
// 使用页面作为中介
// 组件A
Component({
  methods: {
    sendMessage: function() {
      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      currentPage.handleMessage('Hello from Component A')
    }
  }
})

// 页面
Page({
  handleMessage: function(message) {
    // 转发给组件B
    this.selectComponent('#componentB').receiveMessage(message)
  }
})

// 组件B
Component({
  methods: {
    receiveMessage: function(message) {
      console.log('Received:', message)
    }
  }
})
```

## 组件生命周期

### 组件生命周期函数

```javascript
Component({
  lifetimes: {
    created: function() {
      // 组件实例刚刚被创建好时
      // 此时不能调用 setData
      console.log('组件创建')
    },
    
    attached: function() {
      // 组件实例进入页面节点树时
      // 此时可以调用 setData
      console.log('组件挂载')
      this.initComponent()
    },
    
    ready: function() {
      // 组件在视图层布局完成后执行
      console.log('组件准备完毕')
      this.setupEventListeners()
    },
    
    moved: function() {
      // 组件实例被移动到节点树另一个位置时
      console.log('组件移动')
    },
    
    detached: function() {
      // 组件实例被从页面节点树移除时
      console.log('组件卸载')
      this.cleanup()
    },
    
    error: function(error) {
      // 组件方法抛出错误时
      console.error('组件错误:', error)
    }
  },
  
  methods: {
    initComponent: function() {
      // 初始化组件
    },
    
    setupEventListeners: function() {
      // 设置事件监听
    },
    
    cleanup: function() {
      // 清理工作
    }
  }
})
```

### 页面生命周期

```javascript
Component({
  pageLifetimes: {
    show: function() {
      // 页面被展示
      console.log('页面显示')
    },
    
    hide: function() {
      // 页面被隐藏
      console.log('页面隐藏')
    },
    
    resize: function(size) {
      // 页面尺寸变化
      console.log('页面尺寸变化:', size)
    }
  }
})
```

## 高级特性

### 组件间关系

```javascript
// 父组件
Component({
  relations: {
    './child-component': {
      type: 'child',
      linked: function(target) {
        // 每次有child-component被插入时执行
        console.log('子组件插入:', target)
      },
      linkChanged: function(target) {
        // 每次有child-component被移动后执行
        console.log('子组件移动:', target)
      },
      unlinked: function(target) {
        // 每次有child-component被移除时执行
        console.log('子组件移除:', target)
      }
    }
  }
})

// 子组件
Component({
  relations: {
    './parent-component': {
      type: 'parent',
      linked: function(target) {
        // 每次被插入到parent-component时执行
        console.log('插入到父组件:', target)
      }
    }
  }
})
```

### 抽象节点

```json
{
  "componentGenerics": {
    "selectable": true
  }
}
```

```xml
<!-- 组件模板 -->
<view class="container">
  <selectable generic:selectable="custom-radio"></selectable>
</view>
```

```xml
<!-- 使用组件时指定具体组件 -->
<custom-form generic:selectable="custom-checkbox">
</custom-form>
```

### 数据监听器

```javascript
Component({
  data: {
    count: 0,
    user: {
      name: 'John',
      age: 25
    }
  },
  
  observers: {
    'count': function(count) {
      console.log('count changed to:', count)
    },
    
    'user.name, user.age': function(name, age) {
      console.log('user info changed:', name, age)
    },
    
    'user.**': function(user) {
      console.log('user object changed:', user)
    }
  }
})
```

### 纯数据字段

```javascript
Component({
  options: {
    pureDataPattern: /^_/ // 指定所有 _ 开头的数据字段为纯数据字段
  },
  
  data: {
    a: true,    // 普通数据字段
    _b: true,   // 纯数据字段
  },
  
  methods: {
    myMethod: function() {
      this.data._b // 纯数据字段可以直接访问
      this.setData({
        _b: false // 纯数据字段也可以通过 setData 来改变
      })
    }
  }
})
```

## 组件样式

### 样式隔离

```javascript
Component({
  options: {
    styleIsolation: 'isolated' // 启用样式隔离
  }
})
```

样式隔离选项：
- `isolated` 表示启用样式隔离，在自定义组件内外，使用 class 指定的样式将不会相互影响
- `apply-shared` 表示页面 wxss 样式将影响到自定义组件
- `shared` 表示页面 wxss 样式将影响到自定义组件，自定义组件 wxss 样式也会影响页面和其他设置了该选项的自定义组件

### 外部样式类

```javascript
Component({
  externalClasses: ['my-class']
})
```

```xml
<!-- 组件模板 -->
<view class="container my-class">
  <!-- 组件内容 -->
</view>
```

```xml
<!-- 使用组件 -->
<custom-component my-class="red-text"></custom-component>
```

## 组件测试

### 单元测试

```javascript
// test/components/custom-button.test.js
const simulate = require('miniprogram-simulate')

describe('CustomButton', () => {
  let component
  
  beforeEach(() => {
    component = simulate.render({
      usingComponents: {
        'custom-button': '/components/custom-button/index'
      },
      template: '<custom-button text="测试按钮" bind:tap="handleTap"></custom-button>',
      methods: {
        handleTap: jest.fn()
      }
    })
  })
  
  test('should render correctly', () => {
    const button = component.querySelector('custom-button')
    expect(button.data.text).toBe('测试按钮')
  })
  
  test('should trigger tap event', () => {
    const button = component.querySelector('custom-button')
    button.dispatchEvent('tap')
    expect(component.instance.handleTap).toHaveBeenCalled()
  })
})
```

## 最佳实践

### 1. 组件设计原则

```javascript
// 单一职责原则
Component({
  // 组件只负责一个功能
  properties: {
    value: String
  },
  
  methods: {
    // 方法名清晰明确
    validateInput: function() {},
    formatValue: function() {}
  }
})
```

### 2. 属性验证

```javascript
Component({
  properties: {
    type: {
      type: String,
      value: 'default',
      observer: function(newVal) {
        const validTypes = ['default', 'primary', 'secondary']
        if (!validTypes.includes(newVal)) {
          console.warn(`Invalid type: ${newVal}`)
        }
      }
    }
  }
})
```

### 3. 错误处理

```javascript
Component({
  methods: {
    handleAction: function() {
      try {
        this.performAction()
      } catch (error) {
        console.error('组件操作失败:', error)
        this.triggerEvent('error', { error })
      }
    }
  }
})
```

### 4. 性能优化

```javascript
Component({
  options: {
    pureDataPattern: /^_/,
    multipleSlots: true
  },
  
  data: {
    _cache: {}, // 缓存数据
    visible: true
  },
  
  methods: {
    updateData: function(data) {
      // 避免不必要的 setData
      if (JSON.stringify(data) !== JSON.stringify(this.data._cache)) {
        this.setData({
          _cache: data,
          processedData: this.processData(data)
        })
      }
    }
  }
})
```

## 总结

组件开发是小程序模块化开发的核心：

1. **掌握组件基础** - 了解组件的创建和配置
2. **理解组件通信** - 正确处理组件间的数据传递
3. **利用生命周期** - 在合适的时机执行相应操作
4. **使用高级特性** - 提升组件的灵活性和复用性
5. **遵循最佳实践** - 编写高质量的组件代码

下一章我们将学习数据绑定，了解如何在模板中使用数据和表达式。