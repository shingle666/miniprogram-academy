# Page Development

This guide covers comprehensive page development in mini programs, including page lifecycle, navigation, data binding, event handling, and advanced page features.

## 📋 Table of Contents

- [Page Lifecycle](#page-lifecycle)
- [Page Structure](#page-structure)
- [Data Binding](#data-binding)
- [Event Handling](#event-handling)
- [Page Navigation](#page-navigation)
- [Page Communication](#page-communication)
- [Performance Optimization](#performance-optimization)
- [Best Practices](#best-practices)

## 🔄 Page Lifecycle

### Lifecycle Methods

Understanding page lifecycle is crucial for proper resource management and user experience.

```javascript
// pages/example/example.js
Page({
  data: {
    message: 'Hello World',
    userInfo: null,
    loading: false
  },
  
  // Page loaded - called once when page is first loaded
  onLoad(options) {
    console.log('Page loaded with options:', options)
    
    // Initialize page data
    this.initializeData()
    
    // Set navigation bar title
    wx.setNavigationBarTitle({
      title: 'Dynamic Title'
    })
  },
  
  // Page shown - called every time page becomes visible
  onShow() {
    console.log('Page shown')
    
    // Refresh data if needed
    this.refreshData()
    
    // Resume timers or animations
    this.resumeOperations()
  },
  
  // Page ready - called once when page initial rendering completed
  onReady() {
    console.log('Page ready')
    
    // Get component instances
    this.selectComponent('#my-component')
    
    // Set up complex UI interactions
    this.setupInteractions()
  },
  
  // Page hidden - called when page is hidden
  onHide() {
    console.log('Page hidden')
    
    // Pause timers or animations
    this.pauseOperations()
    
    // Save temporary data
    this.saveTemporaryData()
  },
  
  // Page unloaded - called when page is unloaded
  onUnload() {
    console.log('Page unloaded')
    
    // Clean up resources
    this.cleanup()
    
    // Clear timers
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  
  // Pull down refresh
  onPullDownRefresh() {
    console.log('Pull down refresh triggered')
    
    this.refreshData().then(() => {
      wx.stopPullDownRefresh()
    })
  },
  
  // Reach bottom
  onReachBottom() {
    console.log('Reached bottom')
    
    // Load more data
    this.loadMoreData()
  },
  
  // Share app message
  onShareAppMessage(res) {
    console.log('Share triggered from:', res.from)
    
    return {
      title: 'Check out this amazing page!',
      path: '/pages/example/example',
      imageUrl: '/images/share-image.jpg'
    }
  },
  
  // Share timeline (WeChat Moments)
  onShareTimeline() {
    return {
      title: 'Amazing Mini Program',
      query: 'from=timeline',
      imageUrl: '/images/timeline-image.jpg'
    }
  },
  
  // Custom methods
  initializeData() {
    // Initialize page data
    this.setData({
      loading: true
    })
  },
  
  refreshData() {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        this.setData({
          message: 'Data refreshed at ' + new Date().toLocaleTimeString()
        })
        resolve()
      }, 1000)
    })
  },
  
  loadMoreData() {
    // Load more data logic
  },
  
  setupInteractions() {
    // Set up complex interactions
  },
  
  resumeOperations() {
    // Resume paused operations
  },
  
  pauseOperations() {
    // Pause operations
  },
  
  saveTemporaryData() {
    // Save temporary data
    wx.setStorageSync('tempData', this.data)
  },
  
  cleanup() {
    // Clean up resources
  }
})
```

### Lifecycle Flow Diagram

```
Page Creation:
onLoad → onShow → onReady

Page Navigation (forward):
onHide → (new page lifecycle)

Page Navigation (back):
onShow

Page Destruction:
onHide → onUnload
```

## 🏗️ Page Structure

### WXML Template Structure

```xml
<!-- pages/example/example.wxml -->
<view class="container">
  <!-- Header Section -->
  <view class="header">
    <text class="title">{{pageTitle}}</text>
    <view class="actions">
      <button class="btn-primary" bindtap="onRefresh">Refresh</button>
      <button class="btn-secondary" bindtap="onSettings">Settings</button>
    </view>
  </view>
  
  <!-- Loading State -->
  <view wx:if="{{loading}}" class="loading">
    <text>Loading...</text>
  </view>
  
  <!-- Content Section -->
  <view wx:else class="content">
    <!-- User Info Card -->
    <view wx:if="{{userInfo}}" class="user-card">
      <image class="avatar" src="{{userInfo.avatarUrl}}" mode="cover"></image>
      <view class="user-details">
        <text class="username">{{userInfo.nickName}}</text>
        <text class="user-desc">{{userInfo.description}}</text>
      </view>
    </view>
    
    <!-- Data List -->
    <view class="data-list">
      <view 
        wx:for="{{dataList}}" 
        wx:key="id" 
        class="list-item {{item.selected ? 'selected' : ''}}"
        bindtap="onItemTap"
        data-index="{{index}}"
        data-id="{{item.id}}"
      >
        <view class="item-content">
          <text class="item-title">{{item.title}}</text>
          <text class="item-desc">{{item.description}}</text>
        </view>
        <view class="item-actions">
          <button 
            class="btn-small" 
            bindtap="onEdit" 
            data-id="{{item.id}}"
            catchtap="true"
          >
            Edit
          </button>
          <button 
            class="btn-small btn-danger" 
            bindtap="onDelete" 
            data-id="{{item.id}}"
            catchtap="true"
          >
            Delete
          </button>
        </view>
      </view>
    </view>
    
    <!-- Empty State -->
    <view wx:if="{{dataList.length === 0}}" class="empty-state">
      <text class="empty-text">No data available</text>
      <button class="btn-primary" bindtap="onAddData">Add Data</button>
    </view>
  </view>
  
  <!-- Footer -->
  <view class="footer">
    <text class="footer-text">© 2025 Mini Program Academy</text>
  </view>
  
  <!-- Floating Action Button -->
  <view class="fab" bindtap="onFabTap">
    <text class="fab-icon">+</text>
  </view>
</view>

<!-- Custom Components -->
<custom-modal 
  wx:if="{{showModal}}" 
  title="{{modalTitle}}"
  content="{{modalContent}}"
  bind:confirm="onModalConfirm"
  bind:cancel="onModalCancel"
/>
```

### WXSS Styling

```css
/* pages/example/example.wxss */
.container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.actions {
  display: flex;
  gap: 20rpx;
}

.btn-primary {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
}

.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 8rpx;
  padding: 16rpx 32rpx;
  font-size: 28rpx;
}

.btn-small {
  background-color: #007aff;
  color: white;
  border: none;
  border-radius: 6rpx;
  padding: 8rpx 16rpx;
  font-size: 24rpx;
  margin-left: 10rpx;
}

.btn-danger {
  background-color: #ff3b30;
}

/* Loading Styles */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  background-color: white;
  border-radius: 16rpx;
}

/* Content Styles */
.content {
  flex: 1;
}

.user-card {
  display: flex;
  align-items: center;
  background-color: white;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  margin-right: 20rpx;
}

.user-details {
  flex: 1;
}

.username {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.user-desc {
  font-size: 28rpx;
  color: #666;
}

/* List Styles */
.data-list {
  background-color: white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
  transition: background-color 0.3s;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item.selected {
  background-color: #e3f2fd;
}

.list-item:active {
  background-color: #f5f5f5;
}

.item-content {
  flex: 1;
}

.item-title {
  display: block;
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.item-desc {
  font-size: 28rpx;
  color: #666;
}

.item-actions {
  display: flex;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400rpx;
  background-color: white;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.empty-text {
  font-size: 32rpx;
  color: #666;
  margin-bottom: 40rpx;
}

/* Footer */
.footer {
  text-align: center;
  padding: 40rpx 0;
  margin-top: 40rpx;
}

.footer-text {
  font-size: 24rpx;
  color: #999;
}

/* Floating Action Button */
.fab {
  position: fixed;
  right: 40rpx;
  bottom: 40rpx;
  width: 120rpx;
  height: 120rpx;
  background-color: #007aff;
  border-radius: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 122, 255, 0.3);
  z-index: 1000;
}

.fab-icon {
  font-size: 48rpx;
  color: white;
  font-weight: bold;
}

/* Responsive Design */
@media (max-width: 750rpx) {
  .header {
    flex-direction: column;
    gap: 20rpx;
  }
  
  .actions {
    width: 100%;
    justify-content: center;
  }
  
  .list-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 20rpx;
  }
  
  .item-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
```

## 🔗 Data Binding

### Basic Data Binding

```javascript
// pages/binding/binding.js
Page({
  data: {
    // Basic data types
    message: 'Hello World',
    count: 0,
    isVisible: true,
    
    // Objects
    user: {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com'
    },
    
    // Arrays
    items: [
      { id: 1, name: 'Item 1', selected: false },
      { id: 2, name: 'Item 2', selected: true },
      { id: 3, name: 'Item 3', selected: false }
    ],
    
    // Computed properties (simulated)
    get selectedCount() {
      return this.data.items.filter(item => item.selected).length
    }
  },
  
  onLoad() {
    // Update data
    this.setData({
      message: 'Page loaded successfully'
    })
    
    // Update nested object
    this.setData({
      'user.name': 'Jane Doe',
      'user.age': 25
    })
    
    // Update array item
    this.setData({
      'items[0].selected': true
    })
  },
  
  // Event handlers
  onIncrement() {
    this.setData({
      count: this.data.count + 1
    })
  },
  
  onToggleVisibility() {
    this.setData({
      isVisible: !this.data.isVisible
    })
  },
  
  onToggleItem(e) {
    const index = e.currentTarget.dataset.index
    const selected = !this.data.items[index].selected
    
    this.setData({
      [`items[${index}].selected`]: selected
    })
  },
  
  // Batch updates for better performance
  onBatchUpdate() {
    this.setData({
      message: 'Batch updated',
      count: this.data.count + 10,
      isVisible: !this.data.isVisible
    })
  }
})
```

### Advanced Data Binding

```xml
<!-- pages/binding/binding.wxml -->
<view class="container">
  <!-- Text Interpolation -->
  <text>Message: {{message}}</text>
  <text>Count: {{count}}</text>
  
  <!-- Conditional Rendering -->
  <view wx:if="{{isVisible}}">
    <text>This is visible</text>
  </view>
  <view wx:else>
    <text>This is hidden</text>
  </view>
  
  <!-- List Rendering -->
  <view class="item-list">
    <view 
      wx:for="{{items}}" 
      wx:key="id" 
      class="item {{item.selected ? 'selected' : ''}}"
      bindtap="onToggleItem"
      data-index="{{index}}"
    >
      <text>{{item.name}} - {{item.selected ? 'Selected' : 'Not Selected'}}</text>
    </view>
  </view>
  
  <!-- Object Property Access -->
  <view class="user-info">
    <text>Name: {{user.name}}</text>
    <text>Age: {{user.age}}</text>
    <text>Email: {{user.email}}</text>
  </view>
  
  <!-- Expression Evaluation -->
  <text>Double Count: {{count * 2}}</text>
  <text>Is Adult: {{user.age >= 18 ? 'Yes' : 'No'}}</text>
  <text>Selected Items: {{items.filter(item => item.selected).length}}</text>
  
  <!-- Dynamic Attributes -->
  <view class="dynamic-style" style="color: {{isVisible ? 'blue' : 'red'}}">
    Dynamic Color
  </view>
  
  <!-- Form Input Binding -->
  <input 
    type="text" 
    value="{{message}}" 
    bindinput="onMessageInput"
    placeholder="Enter message"
  />
  
  <!-- Action Buttons -->
  <view class="actions">
    <button bindtap="onIncrement">Increment</button>
    <button bindtap="onToggleVisibility">Toggle Visibility</button>
    <button bindtap="onBatchUpdate">Batch Update</button>
  </view>
</view>
```

## 🎯 Event Handling

### Event Types and Usage

```javascript
// pages/events/events.js
Page({
  data: {
    touchInfo: {},
    inputValue: '',
    scrollTop: 0
  },
  
  // Touch Events
  onTouchStart(e) {
    console.log('Touch start:', e.touches[0])
    this.setData({
      touchInfo: {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        startTime: Date.now()
      }
    })
  },
  
  onTouchMove(e) {
    console.log('Touch move:', e.touches[0])
  },
  
  onTouchEnd(e) {
    console.log('Touch end:', e.changedTouches[0])
    const endTime = Date.now()
    const duration = endTime - this.data.touchInfo.startTime
    
    if (duration < 300) {
      console.log('Quick tap detected')
    }
  },
  
  // Tap Events
  onTap(e) {
    console.log('Tap event:', e.currentTarget.dataset)
    
    wx.showToast({
      title: 'Tapped!',
      icon: 'success'
    })
  },
  
  onLongPress(e) {
    console.log('Long press:', e)
    
    wx.showActionSheet({
      itemList: ['Option 1', 'Option 2', 'Option 3'],
      success: (res) => {
        console.log('Selected:', res.tapIndex)
      }
    })
  },
  
  // Input Events
  onInput(e) {
    console.log('Input:', e.detail.value)
    this.setData({
      inputValue: e.detail.value
    })
  },
  
  onFocus(e) {
    console.log('Input focused')
  },
  
  onBlur(e) {
    console.log('Input blurred')
  },
  
  onConfirm(e) {
    console.log('Input confirmed:', e.detail.value)
  },
  
  // Scroll Events
  onScroll(e) {
    console.log('Scroll:', e.detail.scrollTop)
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },
  
  onScrollToUpper(e) {
    console.log('Scrolled to top')
  },
  
  onScrollToLower(e) {
    console.log('Scrolled to bottom')
  },
  
  // Custom Events (from components)
  onCustomEvent(e) {
    console.log('Custom event received:', e.detail)
  },
  
  // Event with data
  onButtonTap(e) {
    const { id, name } = e.currentTarget.dataset
    console.log('Button tapped:', { id, name })
    
    wx.showModal({
      title: 'Confirmation',
      content: `Are you sure you want to ${name}?`,
      success: (res) => {
        if (res.confirm) {
          this.performAction(id)
        }
      }
    })
  },
  
  performAction(id) {
    console.log('Performing action for:', id)
  },
  
  // Prevent event bubbling
  onStopPropagation(e) {
    console.log('Event stopped here')
    // This event won't bubble up to parent elements
  }
})
```

### Event Binding in WXML

```xml
<!-- pages/events/events.wxml -->
<view class="container">
  <!-- Touch Events -->
  <view 
    class="touch-area"
    bindtouchstart="onTouchStart"
    bindtouchmove="onTouchMove"
    bindtouchend="onTouchEnd"
  >
    Touch Area
  </view>
  
  <!-- Tap Events -->
  <view 
    class="tap-area"
    bindtap="onTap"
    bindlongpress="onLongPress"
    data-id="123"
    data-name="test"
  >
    Tap or Long Press
  </view>
  
  <!-- Input Events -->
  <input 
    class="text-input"
    type="text"
    value="{{inputValue}}"
    bindinput="onInput"
    bindfocus="onFocus"
    bindblur="onBlur"
    bindconfirm="onConfirm"
    placeholder="Enter text"
  />
  
  <!-- Scroll Events -->
  <scroll-view 
    class="scroll-area"
    scroll-y="true"
    bindscroll="onScroll"
    bindscrolltoupper="onScrollToUpper"
    bindscrolltolower="onScrollToLower"
  >
    <view class="scroll-content">
      <view wx:for="{{[1,2,3,4,5,6,7,8,9,10]}}" wx:key="*this" class="scroll-item">
        Item {{item}}
      </view>
    </view>
  </scroll-view>
  
  <!-- Event with Data -->
  <view class="button-group">
    <button 
      wx:for="{{['Save', 'Delete', 'Share']}}" 
      wx:key="*this"
      bindtap="onButtonTap"
      data-id="{{index}}"
      data-name="{{item}}"
      class="action-button"
    >
      {{item}}
    </button>
  </view>
  
  <!-- Prevent Bubbling -->
  <view class="parent" bindtap="onTap">
    Parent
    <view class="child" catchtap="onStopPropagation">
      Child (stops bubbling)
    </view>
  </view>
  
  <!-- Custom Component Events -->
  <custom-component bind:customevent="onCustomEvent" />
</view>
```

## 🧭 Page Navigation

### Navigation Methods

```javascript
// pages/navigation/navigation.js
Page({
  // Navigate to new page
  navigateToPage() {
    wx.navigateTo({
      url: '/pages/detail/detail?id=123&name=test',
      success: () => {
        console.log('Navigation successful')
      },
      fail: (error) => {
        console.error('Navigation failed:', error)
      }
    })
  },
  
  // Redirect to page (replace current page)
  redirectToPage() {
    wx.redirectTo({
      url: '/pages/login/login'
    })
  },
  
  // Switch tab (for tab bar pages)
  switchToTab() {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },
  
  // Navigate back
  navigateBack() {
    wx.navigateBack({
      delta: 1 // Number of pages to go back
    })
  },
  
  // Re-launch app (clear page stack)
  reLaunchApp() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  
  // Navigate with complex data
  navigateWithData() {
    const complexData = {
      user: { id: 1, name: 'John' },
      items: [1, 2, 3],
      timestamp: Date.now()
    }
    
    // Store complex data in global storage
    getApp().globalData.navigationData = complexData
    
    wx.navigateTo({
      url: '/pages/detail/detail?dataKey=navigationData'
    })
  },
  
  // Programmatic navigation with validation
  async navigateWithValidation(targetPage) {
    // Check user authentication
    const isLoggedIn = await this.checkUserAuth()
    
    if (!isLoggedIn) {
      wx.showModal({
        title: 'Login Required',
        content: 'Please login to continue',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          }
        }
      })
      return
    }
    
    // Check network connectivity
    const networkType = await this.getNetworkType()
    if (networkType === 'none') {
      wx.showToast({
        title: 'No network connection',
        icon: 'error'
      })
      return
    }
    
    // Navigate to target page
    wx.navigateTo({
      url: targetPage
    })
  },
  
  checkUserAuth() {
    return new Promise((resolve) => {
      const token = wx.getStorageSync('userToken')
      resolve(!!token)
    })
  },
  
  getNetworkType() {
    return new Promise((resolve) => {
      wx.getNetworkType({
        success: (res) => resolve(res.networkType)
      })
    })
  }
})
```

### Navigation with Parameters

```javascript
// Sending page (pages/list/list.js)
Page({
  onItemTap(e) {
    const item = e.currentTarget.dataset.item
    
    // Simple parameters
    wx.navigateTo({
      url: `/pages/detail/detail?id=${item.id}&title=${encodeURIComponent(item.title)}`
    })
  },
  
  onComplexNavigation() {
    // For complex data, use global storage or event bus
    const complexData = {
      user: { id: 1, name: 'John', preferences: {...} },
      items: [...],
      metadata: {...}
    }
    
    // Method 1: Global app data
    getApp().globalData.transferData = complexData
    
    // Method 2: Local storage
    wx.setStorageSync('transferData', complexData)
    
    wx.navigateTo({
      url: '/pages/detail/detail?hasComplexData=true'
    })
  }
})

// Receiving page (pages/detail/detail.js)
Page({
  data: {
    itemId: null,
    itemTitle: '',
    complexData: null
  },
  
  onLoad(options) {
    console.log('Page options:', options)
    
    // Get simple parameters
    this.setData({
      itemId: options.id,
      itemTitle: decodeURIComponent(options.title || '')
    })
    
    // Get complex data if available
    if (options.hasComplexData) {
      // Method 1: From global app data
      const globalData = getApp().globalData.transferData
      if (globalData) {
        this.setData({ complexData: globalData })
        // Clean up
        delete getApp().globalData.transferData
      }
      
      // Method 2: From local storage
      const storageData = wx.getStorageSync('transferData')
      if (storageData) {
        this.setData({ complexData: storageData })
        // Clean up
        wx.removeStorageSync('transferData')
      }
    }
  }
})
```

## 💬 Page Communication

### Parent-Child Communication

```javascript
// Parent page (pages/parent/parent.js)
Page({
  data: {
    childData: null,
    parentMessage: 'Hello from parent'
  },
  
  onLoad() {
    // Listen for custom events from child components
    this.eventBus = getApp().eventBus || this.createEventBus()
  },
  
  // Send data to child component
  sendToChild() {
    this.selectComponent('#child-component').updateData({
      message: 'Updated from parent',
      timestamp: Date.now()
    })
  },
  
  // Handle events from child component
  onChildEvent(e) {
    console.log('Received from child:', e.detail)
    this.setData({
      childData: e.detail
    })
  },
  
  // Global event bus communication
  sendGlobalMessage() {
    this.eventBus.emit('globalMessage', {
      from: 'parent',
      message: 'Hello all pages',
      timestamp: Date.now()
    })
  },
  
  createEventBus() {
    const eventBus = {
      events: {},
      on(event, callback) {
        if (!this.events[event]) {
          this.events[event] = []
        }
        this.events[event].push(callback)
      },
      emit(event, data) {
        if (this.events[event]) {
          this.events[event].forEach(callback => callback(data))
        }
      },
      off(event, callback) {
        if (this.events[event]) {
          const index = this.events[event].indexOf(callback)
          if (index > -1) {
            this.events[event].splice(index, 1)
          }
        }
      }
    }
    
    getApp().eventBus = eventBus
    return eventBus
  }
})
```

### Page-to-Page Communication

```javascript
// utils/pageMessenger.js
class PageMessenger {
  constructor() {
    this.messages = new Map()
    this.listeners = new Map()
  }
  
  // Send message to specific page
  sendToPage(pageRoute, message) {
    if (!this.messages.has(pageRoute)) {
      this.messages.set(pageRoute, [])
    }
    
    this.messages.get(pageRoute).push({
      ...message,
      timestamp: Date.now()
    })
    
    // Notify if page is listening
    if (this.listeners.has(pageRoute)) {
      const callbacks = this.listeners.get(pageRoute)
      callbacks.forEach(callback => callback(message))
    }
  }
  
  // Listen for messages on current page
  listenForMessages(pageRoute, callback) {
    if (!this.listeners.has(pageRoute)) {
      this.listeners.set(pageRoute, [])
    }
    
    this.listeners.get(pageRoute).push(callback)
    
    // Deliver any pending messages
    if (this.messages.has(pageRoute)) {
      const messages = this.messages.get(pageRoute)
      messages.forEach(callback)
      this.messages.delete(pageRoute)
    }
  }
  
  // Remove listener
  removeListener(pageRoute, callback) {
    if (this.listeners.has(pageRoute)) {
      const callbacks = this.listeners.get(pageRoute)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }
  
  // Clear all messages for a page
  clearMessages(pageRoute) {
    this.messages.delete(pageRoute)
  }
}

const pageMessenger = new PageMessenger()
module.exports = pageMessenger

// Usage in pages
// Sending page
const pageMessenger = require('../../utils/pageMessenger')

Page({
  sendMessage() {
    pageMessenger.sendToPage('/pages/target/target', {
      type: 'update',
      data: { message: 'Hello from sender' }
    })
  }
})

// Receiving page
Page({
  onLoad() {
    pageMessenger.listenForMessages('/pages/target/target', (message) => {
      console.log('Received message:', message)
      this.handleMessage(message)
    })
  },
  
  handleMessage(message) {
    if (message.type === 'update') {
      this.setData({
        receivedData: message.data
      })
    }
  },
  
  onUnload() {
    pageMessenger.clearMessages('/pages/target/target')
  }
})
```

## ⚡ Performance Optimization

### Data Update Optimization

```javascript
// Efficient data updates
Page({
  data: {
    largeList: [],
    userInfo: {}
  },
  
  // Batch updates
  batchUpdate() {
    // Bad: Multiple setData calls
    // this.setData({ 'userInfo.name': 'John' })
    // this.setData({ 'userInfo.age': 30 })
    // this.setData({ 'userInfo.email': 'john@example.com' })
    
    // Good: Single setData call
    this.setData({
      'userInfo.name': 'John',
      'userInfo.age': 30,
      'userInfo.email': 'john@example.com'
    })
  },
  
  // Efficient list updates
  updateListItem(index, newData) {
    // Bad: Update entire array
    // const newList = [...this.data.largeList]
    // newList[index] = newData
    // this.setData({ largeList: newList })
    
    // Good: Update specific item
    this.setData({
      [`largeList[${index}]`]: newData
    })
  },
  
  // Lazy loading for large datasets
  async loadData(page = 1, pageSize = 20) {
    try {
      const newData = await this.fetchData(page, pageSize)
      
      if (page === 1) {
        // First page - replace data
        this.setData({
          largeList: newData,
          hasMore: newData.length === pageSize
        })
      } else {
        // Subsequent pages - append data
        this.setData({
          largeList: [...this.data.largeList, ...newData],
          hasMore: newData.length === pageSize
        })
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    }
  },
  
  // Debounced search
  onSearchInput: debounce(function(e) {
    const query = e.detail.value
    this.performSearch(query)
  }, 300),
  
  // Virtual scrolling for very large lists
  setupVirtualScrolling() {
    this.virtualList = {
      itemHeight: 100,
      visibleCount: Math.ceil(wx.getSystemInfoSync().windowHeight / 100) + 2,
      startIndex: 0,
      endIndex: 0
    }
    
    this.updateVisibleItems()
  },
  
  onScroll(e) {
    const scrollTop = e.detail.scrollTop
    const startIndex = Math.floor(scrollTop / this.virtualList.itemHeight)
    const endIndex = Math.min(
      startIndex + this.virtualList.visibleCount,
      this.data.largeList.length
    )
    
    if (startIndex !== this.virtualList.startIndex) {
      this.virtualList.startIndex = startIndex
      this.virtualList.endIndex = endIndex
      this.updateVisibleItems()
    }
  },
  
  updateVisibleItems() {
    const visibleItems = this.data.largeList.slice(
      this.virtualList.startIndex,
      this.virtualList.endIndex
    )
    
    this.setData({
      visibleItems,
      scrollViewHeight: this.data.largeList.length * this.virtualList.itemHeight,
      offsetY: this.virtualList.startIndex * this.virtualList.itemHeight
    })
  }
})

// Debounce utility
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func.apply(this, args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
```

### Memory Management

```javascript
// Memory-efficient page management
Page({
  onLoad() {
    // Initialize only essential data
    this.initializeEssentialData()
  },
  
  onShow() {
    // Load data when page becomes visible
    this.loadPageData()
  },
  
  onHide() {
    // Clean up non-essential resources
    this.cleanupResources()
  },
  
  onUnload() {
    // Clean up all resources
    this.cleanup()
  },
  
  initializeEssentialData() {
    this.setData({
      loading: true,
      error: null
    })
  },
  
  cleanupResources() {
    // Clear timers
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
      this.refreshTimer = null
    }
    
    // Clear large data structures
    this.setData({
      largeDataSet: null,
      cachedImages: null
    })
  },
  
  cleanup() {
    // Remove event listeners
    if (this.eventBus) {
      this.eventBus.off('dataUpdate', this.onDataUpdate)
    }
    
    // Clear all timers
    this.cleanupResources()
    
    // Clear page-specific storage
    wx.removeStorageSync(`page_${this.route}_cache`)
  }
})
```

## 🎯 Best Practices

### 1. Page Structure Organization

```javascript
// Good page structure
Page({
  // 1. Data definition
  data: {
    // Group related data
    ui: {
      loading: false,
      error: null,
      showModal: false
    },
    user: {
      info: null,
      preferences: {}
    },
    content: {
      items: [],
      currentPage: 1,
      hasMore: true
    }
  },
  
  // 2. Lifecycle methods (in order)
  onLoad(options) {
    this.parseOptions(options)
    this.initializePage()
  },
  
  onShow() {
    this.refreshIfNeeded()
  },
  
  onReady() {
    this.setupComponents()
  },
  
  onHide() {
    this.pauseOperations()
  },
  
  onUnload() {
    this.cleanup()
  },
  
  // 3. Event handlers (grouped by functionality)
  // UI Events
  onRefreshTap() { /* ... */ },
  onSettingsTap() { /* ... */ },
  onModalConfirm() { /* ... */ },
  
  // Data Events
  onLoadMore() { /* ... */ },
  onItemSelect() { /* ... */ },
  onSearch() { /* ... */ },
  
  // 4. Business logic methods
  async loadData() { /* ... */ },
  async saveData() { /* ... */ },
  validateInput() { /* ... */ },
  
  // 5. Utility methods
  parseOptions(options) { /* ... */ },
  initializePage() { /* ... */ },
  cleanup() { /* ... */ }
})
```

### 2. Error Handling

```javascript
Page({
  async loadData() {
    try {
      this.setData({ 'ui.loading': true, 'ui.error': null })
      
      const data = await this.fetchData()
      
      this.setData({
        'content.items': data,
        'ui.loading': false
      })
    } catch (error) {
      console.error('Failed to load data:', error)
      
      this.setData({
        'ui.loading': false,
        'ui.error': this.getErrorMessage(error)
      })
      
      // Show user-friendly error message
      wx.showToast({
        title: 'Failed to load data',
        icon: 'error'
      })
    }
  },
  
  getErrorMessage(error) {
    if (error.message.includes('network')) {
      return 'Network connection error'
    } else if (error.message.includes('timeout')) {
      return 'Request timeout'
    } else {
      return 'An unexpected error occurred'
    }
  }
})
```

### 3. Performance Monitoring

```javascript
// utils/performance.js
class PerformanceMonitor {
  static startTiming(label) {
    console.time(label)
  }
  
  static endTiming(label) {
    console.timeEnd(label)
  }
  
  static measurePageLoad(pageName) {
    const startTime = Date.now()
    
    return {
      end: () => {
        const loadTime = Date.now() - startTime
        console.log(`Page ${pageName} loaded in ${loadTime}ms`)
        
        // Send to analytics
        this.sendMetric('page_load_time', {
          page: pageName,
          duration: loadTime
        })
      }
    }
  }
  
  static sendMetric(name, data) {
    // Send to your analytics service
    console.log('Metric:', name, data)
  }
}

// Usage in pages
Page({
  onLoad() {
    this.loadTimer = PerformanceMonitor.measurePageLoad('home')
    this.initializePage()
  },
  
  onReady() {
    this.loadTimer.end()
  },
  
  async loadData() {
    PerformanceMonitor.startTiming('data_load')
    
    try {
      const data = await this.fetchData()
      this.setData({ items: data })
    } finally {
      PerformanceMonitor.endTiming('data_load')
    }
  }
})
```

### 4. Accessibility

```xml
<!-- Accessible page structure -->
<view class="container" role="main">
  <!-- Screen reader friendly headings -->
  <view class="header" role="banner">
    <text class="title" role="heading" aria-level="1">Page Title</text>
  </view>
  
  <!-- Navigation with proper labels -->
  <view class="nav" role="navigation" aria-label="Main navigation">
    <button 
      wx:for="{{navItems}}" 
      wx:key="id"
      aria-label="{{item.label}}"
      bindtap="onNavTap"
      data-id="{{item.id}}"
    >
      {{item.text}}
    </button>
  </view>
  
  <!-- Content with proper structure -->
  <view class="content" role="main">
    <view 
      wx:for="{{items}}" 
      wx:key="id"
      class="item"
      role="listitem"
      aria-label="{{item.title}}"
      tabindex="0"
      bindtap="onItemTap"
      data-id="{{item.id}}"
    >
      <text class="item-title">{{item.title}}</text>
      <text class="item-desc">{{item.description}}</text>
    </view>
  </view>
  
  <!-- Form with proper labels -->
  <form class="form" bindsubmit="onSubmit">
    <view class="form-group">
      <label for="username">Username:</label>
      <input 
        id="username"
        name="username"
        type="text"
        aria-required="true"
        aria-describedby="username-help"
        bindinput="onUsernameInput"
      />
      <text id="username-help" class="help-text">
        Enter your username (required)
      </text>
    </view>
    
    <button form-type="submit" aria-label="Submit form">
      Submit
    </button>
  </form>
</view>
```

---

Effective page development requires understanding lifecycle management, efficient data binding, proper event handling, and performance optimization. Follow these patterns and best practices to create maintainable and performant mini program pages.
