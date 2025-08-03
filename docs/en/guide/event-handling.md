# Event Handling

Event handling is fundamental to creating interactive mini programs. This guide covers the essential event types, handling patterns, and best practices.

## Basic Event Handling

### Touch Events

```html
<!-- Basic touch events -->
<view
  bindtap="onTap"
  bindlongpress="onLongPress"
  bindtouchstart="onTouchStart"
  bindtouchmove="onTouchMove"
  bindtouchend="onTouchEnd"
>
  Touch me
</view>
```

```javascript
Page({
  onTap(e) {
    console.log('Tap event:', e)
    console.log('Target:', e.target.id)
    console.log('Current target:', e.currentTarget.id)
    console.log('Touch point:', e.detail.x, e.detail.y)
  },
  
  onLongPress(e) {
    console.log('Long press detected')
    // Show context menu or perform action
    wx.showActionSheet({
      itemList: ['Edit', 'Delete', 'Share'],
      success: (res) => {
        console.log('Selected:', res.tapIndex)
      }
    })
  },
  
  onTouchStart(e) {
    console.log('Touch started at:', e.touches[0])
    this.setData({
      touchStartTime: Date.now(),
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY
    })
  },
  
  onTouchMove(e) {
    const { startX, startY } = this.data
    const deltaX = e.touches[0].clientX - startX
    const deltaY = e.touches[0].clientY - startY
    
    // Handle swipe gestures
    if (Math.abs(deltaX) > 50) {
      console.log(deltaX > 0 ? 'Swipe right' : 'Swipe left')
    }
  },
  
  onTouchEnd(e) {
    const duration = Date.now() - this.data.touchStartTime
    console.log('Touch duration:', duration + 'ms')
  }
})
```

### Input Events

```html
<!-- Input field events -->
<input
  type="text"
  placeholder="Enter text"
  bindinput="onInput"
  bindfocus="onFocus"
  bindblur="onBlur"
  bindconfirm="onConfirm"
  value="{{inputValue}}"
/>

<!-- Textarea events -->
<textarea
  placeholder="Enter description"
  bindinput="onTextareaInput"
  bindlinechange="onLineChange"
  maxlength="200"
  value="{{textareaValue}}"
></textarea>
```

```javascript
Page({
  data: {
    inputValue: '',
    textareaValue: ''
  },
  
  onInput(e) {
    const value = e.detail.value
    console.log('Input value:', value)
    
    // Real-time validation
    const isValid = this.validateInput(value)
    
    this.setData({
      inputValue: value,
      inputValid: isValid
    })
  },
  
  onFocus(e) {
    console.log('Input focused')
    // Show keyboard helper or hints
  },
  
  onBlur(e) {
    console.log('Input blurred')
    // Validate and save data
    this.saveInputData(e.detail.value)
  },
  
  onConfirm(e) {
    console.log('Input confirmed:', e.detail.value)
    // Submit form or perform search
    this.handleSubmit(e.detail.value)
  },
  
  onTextareaInput(e) {
    const value = e.detail.value
    const cursor = e.detail.cursor
    
    this.setData({
      textareaValue: value,
      characterCount: value.length
    })
  },
  
  onLineChange(e) {
    console.log('Line count:', e.detail.lineCount)
    console.log('Height:', e.detail.height)
  },
  
  validateInput(value) {
    // Example validation
    return value.length >= 3 && value.length <= 20
  },
  
  saveInputData(value) {
    // Save to storage or send to server
    wx.setStorageSync('userInput', value)
  },
  
  handleSubmit(value) {
    if (this.validateInput(value)) {
      console.log('Submitting:', value)
      // Process submission
    } else {
      wx.showToast({
        title: 'Invalid input',
        icon: 'error'
      })
    }
  }
})
```

### Form Events

```html
<!-- Form with various inputs -->
<form bindsubmit="onFormSubmit" bindreset="onFormReset">
  <input name="username" placeholder="Username" />
  <input name="email" type="email" placeholder="Email" />
  
  <radio-group name="gender" bindchange="onRadioChange">
    <radio value="male">Male</radio>
    <radio value="female">Female</radio>
  </radio-group>
  
  <checkbox-group name="interests" bindchange="onCheckboxChange">
    <checkbox value="sports">Sports</checkbox>
    <checkbox value="music">Music</checkbox>
    <checkbox value="travel">Travel</checkbox>
  </checkbox-group>
  
  <picker
    name="city"
    range="{{cities}}"
    bindchange="onPickerChange"
    value="{{selectedCityIndex}}"
  >
    <view class="picker-display">
      {{cities[selectedCityIndex] || 'Select City'}}
    </view>
  </picker>
  
  <switch name="notifications" bindchange="onSwitchChange" />
  
  <button form-type="submit">Submit</button>
  <button form-type="reset">Reset</button>
</form>
```

```javascript
Page({
  data: {
    cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'],
    selectedCityIndex: 0,
    formData: {
      gender: '',
      interests: [],
      notifications: false
    }
  },
  
  onFormSubmit(e) {
    const formData = e.detail.value
    console.log('Form submitted:', formData)
    
    // Validate form data
    if (this.validateForm(formData)) {
      this.submitForm(formData)
    } else {
      wx.showToast({
        title: 'Please fill all required fields',
        icon: 'error'
      })
    }
  },
  
  onFormReset(e) {
    console.log('Form reset')
    this.setData({
      selectedCityIndex: 0,
      'formData.gender': '',
      'formData.interests': [],
      'formData.notifications': false
    })
  },
  
  onRadioChange(e) {
    const value = e.detail.value
    console.log('Radio selected:', value)
    this.setData({
      'formData.gender': value
    })
  },
  
  onCheckboxChange(e) {
    const values = e.detail.value
    console.log('Checkboxes selected:', values)
    this.setData({
      'formData.interests': values
    })
  },
  
  onPickerChange(e) {
    const index = e.detail.value
    console.log('Picker selected:', this.data.cities[index])
    this.setData({
      selectedCityIndex: index
    })
  },
  
  onSwitchChange(e) {
    const value = e.detail.value
    console.log('Switch toggled:', value)
    this.setData({
      'formData.notifications': value
    })
  },
  
  validateForm(data) {
    return data.username && data.email && data.gender
  },
  
  async submitForm(data) {
    wx.showLoading({ title: 'Submitting...' })
    
    try {
      // Submit to server
      const result = await this.sendFormData(data)
      wx.hideLoading()
      
      wx.showToast({
        title: 'Submitted successfully',
        icon: 'success'
      })
    } catch (error) {
      wx.hideLoading()
      wx.showToast({
        title: 'Submission failed',
        icon: 'error'
      })
    }
  },
  
  sendFormData(data) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'https://api.example.com/submit',
        method: 'POST',
        data,
        success: resolve,
        fail: reject
      })
    })
  }
})
```

## Advanced Event Handling

### Event Bubbling and Capturing

```html
<!-- Event bubbling example -->
<view class="outer" bindtap="onOuterTap">
  <view class="middle" bindtap="onMiddleTap">
    <view class="inner" bindtap="onInnerTap">
      Click me (bubbling)
    </view>
  </view>
</view>

<!-- Prevent bubbling -->
<view class="outer" bindtap="onOuterTap">
  <view class="middle" catchtap="onMiddleTap">
    <view class="inner" bindtap="onInnerTap">
      Click me (no bubbling)
    </view>
  </view>
</view>

<!-- Capture phase -->
<view class="outer" capture-bind:tap="onOuterCapture">
  <view class="middle" capture-bind:tap="onMiddleCapture">
    <view class="inner" bindtap="onInnerTap">
      Click me (capture)
    </view>
  </view>
</view>
```

```javascript
Page({
  onOuterTap(e) {
    console.log('Outer tap (bubble phase)')
  },
  
  onMiddleTap(e) {
    console.log('Middle tap (stops bubbling)')
    // Event won't bubble to outer
  },
  
  onInnerTap(e) {
    console.log('Inner tap')
  },
  
  onOuterCapture(e) {
    console.log('Outer capture (capture phase)')
  },
  
  onMiddleCapture(e) {
    console.log('Middle capture (capture phase)')
  }
})
```

### Custom Events

```html
<!-- Custom component with events -->
<custom-button
  bind:customtap="onCustomTap"
  bind:longpress="onCustomLongPress"
  data-id="{{item.id}}"
>
  Custom Button
</custom-button>
```

```javascript
// In custom component
Component({
  methods: {
    onTap(e) {
      // Trigger custom event
      this.triggerEvent('customtap', {
        id: this.data.id,
        timestamp: Date.now()
      }, {
        bubbles: true,
        composed: true
      })
    },
    
    onLongPress(e) {
      this.triggerEvent('longpress', {
        detail: 'Long press detected'
      })
    }
  }
})

// In parent page
Page({
  onCustomTap(e) {
    console.log('Custom tap event:', e.detail)
    console.log('Data from element:', e.currentTarget.dataset)
  },
  
  onCustomLongPress(e) {
    console.log('Custom long press:', e.detail)
  }
})
```

### Gesture Recognition

```javascript
// Advanced gesture handler
Page({
  data: {
    touchStartTime: 0,
    touchStartPos: { x: 0, y: 0 },
    touchEndPos: { x: 0, y: 0 },
    isLongPress: false
  },
  
  onTouchStart(e) {
    const touch = e.touches[0]
    this.setData({
      touchStartTime: Date.now(),
      touchStartPos: { x: touch.clientX, y: touch.clientY },
      isLongPress: false
    })
    
    // Set long press timer
    this.longPressTimer = setTimeout(() => {
      this.setData({ isLongPress: true })
      this.handleLongPress()
    }, 500)
  },
  
  onTouchMove(e) {
    const touch = e.touches[0]
    const { touchStartPos } = this.data
    
    // Calculate distance moved
    const deltaX = touch.clientX - touchStartPos.x
    const deltaY = touch.clientY - touchStartPos.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    // Cancel long press if moved too much
    if (distance > 10) {
      clearTimeout(this.longPressTimer)
      this.setData({ isLongPress: false })
    }
    
    // Handle drag
    this.handleDrag(deltaX, deltaY)
  },
  
  onTouchEnd(e) {
    clearTimeout(this.longPressTimer)
    
    const touch = e.changedTouches[0]
    const { touchStartTime, touchStartPos, isLongPress } = this.data
    const duration = Date.now() - touchStartTime
    
    this.setData({
      touchEndPos: { x: touch.clientX, y: touch.clientY }
    })
    
    if (isLongPress) {
      // Long press already handled
      return
    }
    
    // Detect gesture type
    const deltaX = touch.clientX - touchStartPos.x
    const deltaY = touch.clientY - touchStartPos.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    
    if (distance < 10 && duration < 300) {
      this.handleTap()
    } else if (distance > 50) {
      this.handleSwipe(deltaX, deltaY)
    }
  },
  
  handleTap() {
    console.log('Tap gesture detected')
  },
  
  handleLongPress() {
    console.log('Long press gesture detected')
    wx.vibrateShort()
  },
  
  handleSwipe(deltaX, deltaY) {
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)
    
    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0) {
        console.log('Swipe right')
        this.handleSwipeRight()
      } else {
        console.log('Swipe left')
        this.handleSwipeLeft()
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        console.log('Swipe down')
        this.handleSwipeDown()
      } else {
        console.log('Swipe up')
        this.handleSwipeUp()
      }
    }
  },
  
  handleDrag(deltaX, deltaY) {
    // Handle drag gesture
    console.log('Dragging:', deltaX, deltaY)
  },
  
  handleSwipeLeft() {
    // Navigate to next page or item
  },
  
  handleSwipeRight() {
    // Navigate to previous page or item
  },
  
  handleSwipeUp() {
    // Scroll up or show more content
  },
  
  handleSwipeDown() {
    // Scroll down or refresh
  }
})
```

## Event Performance Optimization

### Debouncing and Throttling

```javascript
// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

Page({
  onLoad() {
    // Debounced search
    this.debouncedSearch = debounce(this.performSearch.bind(this), 300)
    
    // Throttled scroll handler
    this.throttledScroll = throttle(this.handleScroll.bind(this), 100)
  },
  
  onSearchInput(e) {
    const query = e.detail.value
    // Debounce search to avoid too many requests
    this.debouncedSearch(query)
  },
  
  onPageScroll(e) {
    // Throttle scroll events for performance
    this.throttledScroll(e.scrollTop)
  },
  
  performSearch(query) {
    console.log('Searching for:', query)
    // Actual search implementation
  },
  
  handleScroll(scrollTop) {
    console.log('Scroll position:', scrollTop)
    // Handle scroll position changes
  }
})
```

### Event Delegation

```html
<!-- Event delegation for list items -->
<view class="list-container" bindtap="onListTap">
  <view 
    class="list-item" 
    wx:for="{{items}}" 
    wx:key="id"
    data-id="{{item.id}}"
    data-action="select"
  >
    <text>{{item.name}}</text>
    <button 
      class="delete-btn" 
      data-id="{{item.id}}"
      data-action="delete"
      size="mini"
    >
      Delete
    </button>
  </view>
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
  },
  
  onListTap(e) {
    const { id, action } = e.target.dataset
    
    if (!id || !action) return
    
    switch (action) {
      case 'select':
        this.selectItem(id)
        break
      case 'delete':
        this.deleteItem(id)
        break
      default:
        console.log('Unknown action:', action)
    }
  },
  
  selectItem(id) {
    console.log('Selected item:', id)
    // Handle item selection
  },
  
  deleteItem(id) {
    console.log('Deleting item:', id)
    
    wx.showModal({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this item?',
      success: (res) => {
        if (res.confirm) {
          const items = this.data.items.filter(item => item.id !== parseInt(id))
          this.setData({ items })
        }
      }
    })
  }
})
```

## Best Practices

### Error Handling

```javascript
Page({
  onButtonTap(e) {
    try {
      // Event handling logic
      this.processUserAction(e)
    } catch (error) {
      console.error('Event handling error:', error)
      this.handleEventError(error)
    }
  },
  
  processUserAction(e) {
    const { action, data } = e.currentTarget.dataset
    
    if (!action) {
      throw new Error('No action specified')
    }
    
    // Process action
    this.executeAction(action, data)
  },
  
  executeAction(action, data) {
    const actions = {
      save: () => this.saveData(data),
      delete: () => this.deleteData(data),
      share: () => this.shareContent(data)
    }
    
    const handler = actions[action]
    if (!handler) {
      throw new Error(`Unknown action: ${action}`)
    }
    
    handler()
  },
  
  handleEventError(error) {
    wx.showToast({
      title: 'Operation failed',
      icon: 'error'
    })
    
    // Log error for debugging
    console.error('Event error details:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    })
  }
})
```

### Memory Management

```javascript
Page({
  onLoad() {
    // Set up event listeners
    this.setupEventListeners()
  },
  
  onUnload() {
    // Clean up event listeners and timers
    this.cleanup()
  },
  
  setupEventListeners() {
    // Store references for cleanup
    this.resizeHandler = this.onWindowResize.bind(this)
    this.networkHandler = this.onNetworkChange.bind(this)
    
    // Add global event listeners
    wx.onWindowResize(this.resizeHandler)
    wx.onNetworkStatusChange(this.networkHandler)
  },
  
  cleanup() {
    // Remove event listeners
    if (this.resizeHandler) {
      wx.offWindowResize(this.resizeHandler)
    }
    
    if (this.networkHandler) {
      wx.offNetworkStatusChange(this.networkHandler)
    }
    
    // Clear timers
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
    }
    
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
  },
  
  onWindowResize(res) {
    console.log('Window resized:', res)
  },
  
  onNetworkChange(res) {
    console.log('Network changed:', res)
  }
})
```

Effective event handling is crucial for creating responsive and user-friendly mini programs. Always consider performance, accessibility, and user experience when implementing event handlers.