# 组件开发

学习小程序自定义组件开发，掌握组件封装、复用和通信的核心技术。

## 🧩 组件基础

### 组件文件结构
```
components/custom-button/
├── index.js    # 组件逻辑
├── index.json  # 组件配置
├── index.wxml  # 组件结构
└── index.wxss  # 组件样式
```

### 基础组件示例

#### 组件配置 (index.json)
```json
{
  "component": true,
  "usingComponents": {}
}
```

#### 组件逻辑 (index.js)
```javascript
Component({
  // 组件的属性列表
  properties: {
    // 按钮文本
    text: {
      type: String,
      value: '按钮'
    },
    // 按钮类型
    type: {
      type: String,
      value: 'default' // default, primary, success, warning, danger
    },
    // 按钮大小
    size: {
      type: String,
      value: 'normal' // mini, small, normal, large
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      value: false
    },
    // 是否显示加载状态
    loading: {
      type: Boolean,
      value: false
    },
    // 是否为朴素按钮
    plain: {
      type: Boolean,
      value: false
    },
    // 是否为圆形按钮
    round: {
      type: Boolean,
      value: false
    }
  },

  // 组件的内部数据
  data: {
    // 内部状态
  },

  // 组件的方法列表
  methods: {
    // 点击事件处理
    onTap(e) {
      if (this.properties.disabled || this.properties.loading) {
        return
      }

      // 触发自定义事件
      this.triggerEvent('tap', {
        text: this.properties.text,
        type: this.properties.type
      })
    },

    // 长按事件处理
    onLongPress(e) {
      if (this.properties.disabled || this.properties.loading) {
        return
      }

      this.triggerEvent('longpress', {
        text: this.properties.text
      })
    }
  },

  // 组件生命周期
  lifetimes: {
    // 在组件实例刚刚被创建时执行
    created() {
      console.log('组件被创建')
    },

    // 在组件实例进入页面节点树时执行
    attached() {
      console.log('组件被挂载')
    },

    // 在组件在视图层布局完成后执行
    ready() {
      console.log('组件布局完成')
    },

    // 在组件实例被移动到节点树另一个位置时执行
    moved() {
      console.log('组件被移动')
    },

    // 在组件实例被从页面节点树移除时执行
    detached() {
      console.log('组件被卸载')
    },

    // 每当组件方法抛出错误时执行
    error(err) {
      console.error('组件错误', err)
    }
  },

  // 组件所在页面的生命周期
  pageLifetimes: {
    // 页面被展示
    show() {
      console.log('页面显示')
    },

    // 页面被隐藏
    hide() {
      console.log('页面隐藏')
    },

    // 页面尺寸变化
    resize(size) {
      console.log('页面尺寸变化', size)
    }
  },

  // 组件数据字段监听器
  observers: {
    'type, size': function(type, size) {
      console.log('type或size发生变化', type, size)
      // 根据属性变化更新样式类
      this.updateClasses()
    }
  },

  // 自定义方法
  updateClasses() {
    const { type, size, disabled, loading, plain, round } = this.properties
    
    const classes = ['custom-button']
    
    if (type !== 'default') classes.push(`custom-button--${type}`)
    if (size !== 'normal') classes.push(`custom-button--${size}`)
    if (disabled) classes.push('custom-button--disabled')
    if (loading) classes.push('custom-button--loading')
    if (plain) classes.push('custom-button--plain')
    if (round) classes.push('custom-button--round')
    
    this.setData({
      buttonClass: classes.join(' ')
    })
  }
})
```

#### 组件结构 (index.wxml)
```xml
<button 
  class="custom-button {{buttonClass}}"
  disabled="{{disabled || loading}}"
  bindtap="onTap"
  bindlongpress="onLongPress"
>
  <!-- 加载图标 -->
  <view class="custom-button__loading" wx:if="{{loading}}">
    <view class="loading-spinner"></view>
  </view>
  
  <!-- 按钮文本 -->
  <text class="custom-button__text">{{text}}</text>
  
  <!-- 插槽内容 -->
  <slot></slot>
</button>
```

#### 组件样式 (index.wxss)
```css
.custom-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 30rpx;
  height: 88rpx;
  line-height: 86rpx;
  font-size: 32rpx;
  border-radius: 8rpx;
  border: 2rpx solid transparent;
  background-color: #f7f8fa;
  color: #323233;
  transition: all 0.3s;
  user-select: none;
  cursor: pointer;
}

/* 按钮类型样式 */
.custom-button--primary {
  background-color: #07c160;
  color: #fff;
}

.custom-button--success {
  background-color: #19be6b;
  color: #fff;
}

.custom-button--warning {
  background-color: #ff9900;
  color: #fff;
}

.custom-button--danger {
  background-color: #ed4014;
  color: #fff;
}

/* 按钮大小样式 */
.custom-button--mini {
  height: 48rpx;
  line-height: 46rpx;
  padding: 0 16rpx;
  font-size: 24rpx;
}

.custom-button--small {
  height: 64rpx;
  line-height: 62rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.custom-button--large {
  height: 100rpx;
  line-height: 98rpx;
  padding: 0 40rpx;
  font-size: 36rpx;
}

/* 朴素按钮 */
.custom-button--plain {
  background-color: transparent;
}

.custom-button--plain.custom-button--primary {
  color: #07c160;
  border-color: #07c160;
}

.custom-button--plain.custom-button--success {
  color: #19be6b;
  border-color: #19be6b;
}

.custom-button--plain.custom-button--warning {
  color: #ff9900;
  border-color: #ff9900;
}

.custom-button--plain.custom-button--danger {
  color: #ed4014;
  border-color: #ed4014;
}

/* 圆形按钮 */
.custom-button--round {
  border-radius: 44rpx;
}

/* 禁用状态 */
.custom-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 加载状态 */
.custom-button--loading {
  opacity: 0.8;
}

.custom-button__loading {
  margin-right: 10rpx;
}

.loading-spinner {
  width: 24rpx;
  height: 24rpx;
  border: 2rpx solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.custom-button__text {
  flex: 1;
}

/* 按钮激活状态 */
.custom-button:active:not(.custom-button--disabled) {
  transform: scale(0.98);
}
```

## 🔄 组件通信

### 父子组件通信

#### 父组件向子组件传递数据
```xml
<!-- 父组件 -->
<custom-button 
  text="{{buttonText}}"
  type="primary"
  size="large"
  disabled="{{isDisabled}}"
  bind:tap="onButtonTap"
>
</custom-button>
```

```javascript
// 父组件
Page({
  data: {
    buttonText: '点击我',
    isDisabled: false
  },

  onButtonTap(e) {
    console.log('按钮被点击', e.detail)
    wx.showToast({
      title: '按钮点击成功',
      icon: 'success'
    })
  }
})
```

#### 子组件向父组件传递数据
```javascript
// 子组件
Component({
  methods: {
    onTap() {
      // 触发自定义事件，向父组件传递数据
      this.triggerEvent('tap', {
        message: '来自子组件的消息',
        timestamp: Date.now()
      })
    }
  }
})
```

### 组件间通信

#### 使用全局数据
```javascript
// app.js
App({
  globalData: {
    userInfo: null,
    theme: 'light'
  }
})

// 组件中使用
Component({
  attached() {
    const app = getApp()
    console.log('全局数据', app.globalData)
  }
})
```

#### 使用事件总线
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

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data))
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}

module.exports = new EventBus()
```

```javascript
// 组件A
const eventBus = require('../../utils/eventBus')

Component({
  methods: {
    sendMessage() {
      eventBus.emit('message', {
        from: 'componentA',
        data: 'Hello from A'
      })
    }
  }
})

// 组件B
Component({
  attached() {
    eventBus.on('message', this.onMessage)
  },

  detached() {
    eventBus.off('message', this.onMessage)
  },

  onMessage(data) {
    console.log('收到消息', data)
  }
})
```

## 🎯 高级组件特性

### 插槽 (Slot)

#### 单个插槽
```xml
<!-- 组件模板 -->
<view class="card">
  <view class="card-header">
    <text class="card-title">{{title}}</text>
  </view>
  <view class="card-content">
    <slot></slot>
  </view>
</view>
```

```xml
<!-- 使用组件 -->
<card title="卡片标题">
  <text>这是卡片内容</text>
  <button>操作按钮</button>
</card>
```

#### 多个插槽
```xml
<!-- 组件模板 -->
<view class="dialog">
  <view class="dialog-header">
    <slot name="header"></slot>
  </view>
  <view class="dialog-content">
    <slot name="content"></slot>
  </view>
  <view class="dialog-footer">
    <slot name="footer"></slot>
  </view>
</view>
```

```xml
<!-- 使用组件 -->
<dialog>
  <view slot="header">
    <text class="dialog-title">确认删除</text>
  </view>
  <view slot="content">
    <text>确定要删除这个项目吗？</text>
  </view>
  <view slot="footer">
    <button>取消</button>
    <button type="primary">确定</button>
  </view>
</dialog>
```

### 组件样式隔离

#### 样式隔离选项
```javascript
Component({
  options: {
    styleIsolation: 'isolated' // 启用样式隔离
  }
})
```

样式隔离选项：
- `isolated`：启用样式隔离，组件内外样式互不影响
- `apply-shared`：页面样式影响组件，组件样式不影响页面
- `shared`：页面和组件样式互相影响

#### 外部样式类
```javascript
Component({
  externalClasses: ['custom-class', 'header-class', 'content-class'],
  
  properties: {
    customClass: String
  }
})
```

```xml
<!-- 组件模板 -->
<view class="container custom-class">
  <view class="header header-class">标题</view>
  <view class="content content-class">内容</view>
</view>
```

```xml
<!-- 使用组件 -->
<my-component 
  custom-class="my-custom-style"
  header-class="my-header-style"
  content-class="my-content-style"
>
</my-component>
```

### 抽象节点

#### 定义抽象节点
```json
{
  "component": true,
  "componentGenerics": {
    "selectable": true
  }
}
```

```xml
<!-- 组件模板 -->
<view class="list">
  <view wx:for="{{list}}" wx:key="id" class="list-item">
    <selectable item="{{item}}"></selectable>
  </view>
</view>
```

#### 使用抽象节点
```json
{
  "usingComponents": {
    "list": "/components/list/index",
    "checkbox-item": "/components/checkbox-item/index",
    "radio-item": "/components/radio-item/index"
  }
}
```

```xml
<!-- 页面使用 -->
<list list="{{items}}" generic:selectable="checkbox-item"></list>
<list list="{{items}}" generic:selectable="radio-item"></list>
```

## 🛠️ 组件工具方法

### 获取组件实例
```javascript
Page({
  onReady() {
    // 获取组件实例
    const component = this.selectComponent('#my-component')
    
    // 调用组件方法
    component.customMethod()
    
    // 获取组件数据
    console.log(component.data)
  }
})
```

### 组件关系
```javascript
// 父组件
Component({
  relations: {
    './child': {
      type: 'child',
      linked(target) {
        console.log('子组件被插入', target)
      },
      unlinked(target) {
        console.log('子组件被移除', target)
      }
    }
  }
})

// 子组件
Component({
  relations: {
    './parent': {
      type: 'parent',
      linked(target) {
        console.log('被插入到父组件', target)
      }
    }
  }
})
```

## 📦 组件库开发

### 组件库结构
```
components/
├── button/
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── input/
├── dialog/
├── loading/
└── index.js  # 组件库入口
```

### 组件库入口文件
```javascript
// components/index.js
module.exports = {
  Button: '/components/button/index',
  Input: '/components/input/index',
  Dialog: '/components/dialog/index',
  Loading: '/components/loading/index'
}
```

### 统一配置
```json
{
  "usingComponents": {
    "ui-button": "/components/button/index",
    "ui-input": "/components/input/index",
    "ui-dialog": "/components/dialog/index",
    "ui-loading": "/components/loading/index"
  }
}
```

## 🎨 组件样式最佳实践

### CSS变量
```css
/* 组件样式 */
.custom-button {
  background-color: var(--button-bg-color, #f7f8fa);
  color: var(--button-text-color, #323233);
  border-radius: var(--button-border-radius, 8rpx);
  padding: var(--button-padding, 0 30rpx);
  height: var(--button-height, 88rpx);
}
```

```css
/* 页面样式 - 自定义主题 */
page {
  --button-bg-color: #07c160;
  --button-text-color: #fff;
  --button-border-radius: 44rpx;
}
```

### 响应式设计
```css
.component {
  /* 基础样式 */
  padding: 20rpx;
}

/* 小屏幕适配 */
@media (max-width: 600px) {
  .component {
    padding: 15rpx;
  }
}

/* 大屏幕适配 */
@media (min-width: 1200px) {
  .component {
    padding: 30rpx;
  }
}
```

## 🔍 组件测试

### 单元测试
```javascript
// test/button.test.js
const simulate = require('miniprogram-simulate')

describe('Button Component', () => {
  let component

  beforeEach(() => {
    component = simulate.render(simulate.load('/components/button/index'))
  })

  test('should render correctly', () => {
    expect(component.toJSON()).toMatchSnapshot()
  })

  test('should trigger tap event', () => {
    const onTap = jest.fn()
    component.addEventListener('tap', onTap)
    
    component.querySelector('.custom-button').dispatchEvent('tap')
    
    expect(onTap).toHaveBeenCalled()
  })

  test('should be disabled when disabled prop is true', () => {
    component.setData({ disabled: true })
    
    const button = component.querySelector('.custom-button')
    expect(button.classList.contains('custom-button--disabled')).toBe(true)
  })
})
```

## 📚 组件开发规范

### 命名规范
- **组件名称**：使用小写字母和连字符，如 `custom-button`
- **属性名称**：使用驼峰命名，如 `backgroundColor`
- **事件名称**：使用小写字母和连字符，如 `item-click`
- **样式类名**：使用BEM命名规范，如 `component__element--modifier`

### 文档规范
```javascript
/**
 * 自定义按钮组件
 * @component CustomButton
 * @description 提供多种样式和状态的按钮组件
 * 
 * @property {String} text - 按钮文本
 * @property {String} type - 按钮类型 (default|primary|success|warning|danger)
 * @property {String} size - 按钮大小 (mini|small|normal|large)
 * @property {Boolean} disabled - 是否禁用
 * @property {Boolean} loading - 是否显示加载状态
 * 
 * @event tap - 点击事件
 * @event longpress - 长按事件
 * 
 * @example
 * <custom-button 
 *   text="点击我" 
 *   type="primary" 
 *   bind:tap="onButtonTap"
 * ></custom-button>
 */
Component({
  // 组件实现
})
```

## 📚 相关文档

- [项目结构](./project-structure.md)
- [页面开发](./page-development.md)
- [API使用](./api-usage.md)
- [性能优化](./performance.md)

---

通过组件化开发，构建可复用、可维护的小程序应用！🚀