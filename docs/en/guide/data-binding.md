# Data Binding

Data binding is a core concept in mini program development that allows developers to connect data with the view layer, enabling data-driven UI updates. This guide introduces the basic concepts and advanced techniques of data binding in mini programs.

## Basic Data Binding

### Text Binding

Use double curly braces `{{}}` to bind data to text content:

```html
<view>{{message}}</view>
```

```javascript
Page({
  data: {
    message: 'Hello World'
  }
})
```

### Attribute Binding

The same double curly braces syntax can be used to bind data to component attributes:

```html
<image src="{{imageUrl}}" class="{{isActive ? 'active' : ''}}"></image>
```

```javascript
Page({
  data: {
    imageUrl: '/assets/images/logo.png',
    isActive: true
  }
})
```

### Conditional Rendering

Use `wx:if`, `wx:elif`, and `wx:else` directives to conditionally render content:

```html
<view wx:if="{{condition === 'A'}}">Condition A is met</view>
<view wx:elif="{{condition === 'B'}}">Condition B is met</view>
<view wx:else>Other conditions</view>
```

```javascript
Page({
  data: {
    condition: 'A'
  }
})
```

Additionally, you can use the `hidden` attribute to control element visibility:

```html
<view hidden="{{!showContent}}">Visible when content is shown</view>
```

> **Note**: `wx:if` controls display by adding/removing nodes, while `hidden` only sets the CSS display property. For frequently toggled content, using `hidden` performs better; for infrequently toggled content, `wx:if` is more appropriate.

### List Rendering

Use the `wx:for` directive to render list data:

```html
<view wx:for="{{items}}" wx:key="id">
  {{index}}: {{item.name}}
</view>
```

```javascript
Page({
  data: {
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ]
  }
})
```

By default, the loop item variable is named `item` and the index is `index`. You can use `wx:for-item` and `wx:for-index` to customize variable names:

```html
<view wx:for="{{items}}" wx:for-item="product" wx:for-index="idx" wx:key="id">
  {{idx}}: {{product.name}}
</view>
```

### Templates and References

You can use templates to reuse code snippets:

```html
<!-- Define template -->
<template name="productItem">
  <view class="product">
    <image src="{{imageUrl}}"></image>
    <view class="name">{{name}}</view>
    <view class="price">${{price}}</view>
  </view>
</template>

<!-- Use template -->
<block wx:for="{{products}}" wx:key="id">
  <template is="productItem" data="{{...item}}"></template>
</block>
```

```javascript
Page({
  data: {
    products: [
      { id: 1, name: 'Product 1', price: 99, imageUrl: '/assets/product1.png' },
      { id: 2, name: 'Product 2', price: 199, imageUrl: '/assets/product2.png' },
      { id: 3, name: 'Product 3', price: 299, imageUrl: '/assets/product3.png' }
    ]
  }
})
```

## Data Updates

### setData Method

In mini programs, use the `setData` method to update data and trigger view updates:

```javascript
Page({
  data: {
    count: 0,
    userInfo: {
      name: '',
      age: 0
    }
  },
  
  incrementCount() {
    this.setData({
      count: this.data.count + 1
    })
  },
  
  updateUserName(name) {
    this.setData({
      'userInfo.name': name
    })
  }
})
```

### Data Path Expressions

`setData` supports using data path expressions to update specific values in nested objects or arrays:

```javascript
// Update properties in an object
this.setData({
  'userInfo.name': 'John',
  'userInfo.age': 30
})

// Update elements in an array
this.setData({
  'items[0].name': 'Updated Item 1',
  'items[1].price': 299
})
```

### Performance Optimization

`setData` is the most commonly used but also the most likely to cause performance issues in mini programs. Follow these principles:

1. **Reduce the frequency of setData calls**
   
   ```javascript
   // Not recommended: Frequent setData calls
   this.setData({ value1: 'a' })
   this.setData({ value2: 'b' })
   
   // Recommended: Combine multiple updates
   this.setData({
     value1: 'a',
     value2: 'b'
   })
   ```

2. **Reduce the amount of data passed**
   
   ```javascript
   // Not recommended: Update the entire object
   this.setData({
     userInfo: this.data.userInfo
   })
   
   // Recommended: Only update changed properties
   this.setData({
     'userInfo.name': 'John'
   })
   ```

3. **Avoid frequently updating invisible data**
   
   For content rendered conditionally with `wx:if`, you can avoid updating its data when it's not visible.

## Two-Way Data Binding

Mini programs don't natively support true two-way data binding, but you can simulate it through event handling:

```html
<input value="{{inputValue}}" bindinput="handleInput" />
<view>Current input: {{inputValue}}</view>
```

```javascript
Page({
  data: {
    inputValue: ''
  },
  
  handleInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  }
})
```

## Computed Properties and Watchers

Mini programs don't natively support computed properties and watchers, but you can implement similar functionality through custom methods:

### Simulating Computed Properties

```javascript
Page({
  data: {
    price: 100,
    quantity: 2
  },
  
  onLoad() {
    this.updateTotal()
  },
  
  updatePrice(newPrice) {
    this.setData({
      price: newPrice
    })
    this.updateTotal()
  },
  
  updateQuantity(newQuantity) {
    this.setData({
      quantity: newQuantity
    })
    this.updateTotal()
  },
  
  updateTotal() {
    this.setData({
      total: this.data.price * this.data.quantity
    })
  }
})
```

### Simulating Watchers

```javascript
Page({
  data: {
    userInput: ''
  },
  
  handleInput(e) {
    const newValue = e.detail.value
    this.setData({
      userInput: newValue
    })
    
    // Watch for value changes and perform operations
    this.watchUserInput(newValue)
  },
  
  watchUserInput(newValue) {
    if (newValue.length > 5) {
      wx.showToast({
        title: 'Input too long',
        icon: 'none'
      })
    }
  }
})
```

## Enhanced Data Binding with Component Libraries

Some third-party component libraries provide enhanced data binding capabilities:

### WePY Framework

WePY framework provides Vue-like data binding syntax:

```html
<template>
  <view>{{message}}</view>
  <input v-model="userInput" />
</template>

<script>
import wepy from 'wepy'

export default class MyPage extends wepy.page {
  data = {
    message: 'Hello WePY',
    userInput: ''
  }
  
  computed = {
    reversedMessage() {
      return this.message.split('').reverse().join('')
    }
  }
  
  watch = {
    userInput(newValue, oldValue) {
      console.log(`Input changed from ${oldValue} to ${newValue}`)
    }
  }
}
</script>
```

### Taro Framework

Taro framework provides React-like data binding:

```jsx
import React, { useState, useMemo } from 'react'
import { View, Input } from '@tarojs/components'

function MyComponent() {
  const [message, setMessage] = useState('Hello Taro')
  const [userInput, setUserInput] = useState('')
  
  // Computed property
  const reversedMessage = useMemo(() => {
    return message.split('').reverse().join('')
  }, [message])
  
  // Watcher effect
  useEffect(() => {
    console.log(`Input changed: ${userInput}`)
  }, [userInput])
  
  return (
    <View>
      <View>{message}</View>
      <View>{reversedMessage}</View>
      <Input 
        value={userInput} 
        onInput={e => setUserInput(e.detail.value)} 
      />
    </View>
  )
}
```

## Best Practices

1. **Keep Data Models Simple**
   - Avoid deeply nested structures
   - Use flattened data structures

2. **Break Down Components Appropriately**
   - Split complex pages into multiple components
   - Each component maintains its own data state

3. **Use Keys to Improve List Rendering Performance**
   - Always provide `wx:key` for `wx:for`
   - Use unique and stable identifiers as keys

4. **Avoid Complex Calculations in Templates**
   - Pre-process data in JavaScript
   - Store results in data

5. **Use Block to Wrap Multiple Elements**
   - The `<block>` element doesn't create actual DOM nodes
   - Use it for conditional rendering or looping over multiple elements

```html
<block wx:if="{{showItems}}">
  <view>First item</view>
  <view>Second item</view>
  <view>Third item</view>
</block>
```

## Next Steps

Now that you understand data binding in mini programs, you can continue learning about:

- [Event Handling](./event-handling.md)
- [Component Development](./component-development.md)
- [Performance Optimization](./performance-optimization.md)