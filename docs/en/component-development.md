# Component Development

This guide covers how to create and use custom components in mini-program development, including component architecture, lifecycle, communication patterns, and best practices.

## 📋 Table of Contents

- [Component Basics](#component-basics)
- [Component Structure](#component-structure)
- [Component Lifecycle](#component-lifecycle)
- [Properties and Data](#properties-and-data)
- [Component Communication](#component-communication)
- [Slot System](#slot-system)
- [Component Styling](#component-styling)
- [Advanced Patterns](#advanced-patterns)

## 🧩 Component Basics

### What are Components
Components are reusable, self-contained pieces of UI that encapsulate structure, style, and behavior. They help create modular, maintainable applications.

### Benefits of Components
- **Reusability**: Use the same component across multiple pages
- **Maintainability**: Centralized logic and styling
- **Testability**: Easier to test isolated functionality
- **Consistency**: Uniform UI patterns across the app

### Component vs Page
```javascript
// Page
Page({
  data: { message: 'Hello Page' },
  onLoad() { /* page lifecycle */ }
})

// Component
Component({
  properties: { title: String },
  data: { message: 'Hello Component' },
  attached() { /* component lifecycle */ }
})
```

## 🏗️ Component Structure

### File Structure
```
components/
├── user-card/
│   ├── user-card.js      # Component logic
│   ├── user-card.wxml    # Component template
│   ├── user-card.wxss    # Component styles
│   └── user-card.json    # Component configuration
```

### Basic Component Definition
```javascript
// components/user-card/user-card.js
Component({
  // Component properties
  properties: {
    user: {
      type: Object,
      value: {}
    },
    showAvatar: {
      type: Boolean,
      value: true
    }
  },
  
  // Component data
  data: {
    isExpanded: false
  },
  
  // Component methods
  methods: {
    toggleExpand() {
      this.setData({
        isExpanded: !this.data.isExpanded
      })
    },
    
    onAvatarTap() {
      this.triggerEvent('avatartap', {
        user: this.properties.user
      })
    }
  }
})
```

### Component Template
```xml
<!-- components/user-card/user-card.wxml -->
<view class="user-card">
  <view class="header" bindtap="toggleExpand">
    <image 
      wx:if="{{showAvatar}}" 
      class="avatar" 
      src="{{user.avatar}}" 
      bindtap="onAvatarTap"
    />
    <view class="info">
      <text class="name">{{user.name}}</text>
      <text class="title">{{user.title}}</text>
    </view>
    <view class="expand-icon {{isExpanded ? 'expanded' : ''}}">
      <text>▼</text>
    </view>
  </view>
  
  <view wx:if="{{isExpanded}}" class="details">
    <text class="email">{{user.email}}</text>
    <text class="phone">{{user.phone}}</text>
    <slot name="actions"></slot>
  </view>
</view>
```

### Component Configuration
```json
{
  "component": true,
  "usingComponents": {}
}
```

## 🔄 Component Lifecycle

### Lifecycle Methods
```javascript
Component({
  lifetimes: {
    // Component created
    created() {
      console.log('Component created')
      // Initialize non-data properties
    },
    
    // Component attached to page
    attached() {
      console.log('Component attached')
      // Initialize data, setup listeners
      this.initializeComponent()
    },
    
    // Component ready (after first render)
    ready() {
      console.log('Component ready')
      // Get node references, setup interactions
      this.setupInteractions()
    },
    
    // Component moved to new position
    moved() {
      console.log('Component moved')
    },
    
    // Component detached from page
    detached() {
      console.log('Component detached')
      // Cleanup resources
      this.cleanup()
    },
    
    // Component error
    error(error) {
      console.error('Component error:', error)
    }
  },
  
  // Page lifecycle observers
  pageLifetimes: {
    show() {
      console.log('Page shown')
      // Resume operations
    },
    
    hide() {
      console.log('Page hidden')
      // Pause operations
    },
    
    resize(size) {
      console.log('Page resized:', size)
      // Handle resize
    }
  },
  
  methods: {
    initializeComponent() {
      // Component initialization logic
    },
    
    setupInteractions() {
      // Setup user interactions
    },
    
    cleanup() {
      // Cleanup timers, listeners, etc.
    }
  }
})
```

## 📊 Properties and Data

### Property Definition
```javascript
Component({
  properties: {
    // Simple property
    title: String,
    
    // Property with default value
    count: {
      type: Number,
      value: 0
    },
    
    // Property with observer
    user: {
      type: Object,
      value: {},
      observer(newVal, oldVal) {
        console.log('User changed:', newVal, oldVal)
        this.processUserData(newVal)
      }
    },
    
    // Optional property
    config: {
      type: Object,
      optionalTypes: [String],
      value: null
    }
  },
  
  methods: {
    processUserData(user) {
      // Process user data when it changes
      this.setData({
        displayName: user.firstName + ' ' + user.lastName
      })
    }
  }
})
```

### Data Observers
```javascript
Component({
  data: {
    items: [],
    filter: '',
    sortBy: 'name'
  },
  
  observers: {
    // Single property observer
    'filter': function(newFilter) {
      this.filterItems(newFilter)
    },
    
    // Multiple properties observer
    'items, filter, sortBy': function(items, filter, sortBy) {
      this.updateDisplayItems(items, filter, sortBy)
    },
    
    // Nested property observer
    'user.profile.name': function(name) {
      this.updateDisplayName(name)
    },
    
    // Array observer
    'items[*]': function(item) {
      console.log('Item changed:', item)
    }
  },
  
  methods: {
    filterItems(filter) {
      // Filter logic
    },
    
    updateDisplayItems(items, filter, sortBy) {
      // Update display logic
    }
  }
})
```

## 🔗 Component Communication

### Parent to Child (Properties)
```javascript
// Parent page
Page({
  data: {
    currentUser: {
      name: 'John Doe',
      avatar: '/images/avatar.jpg'
    }
  }
})
```

```xml
<!-- Parent template -->
<user-card 
  user="{{currentUser}}" 
  show-avatar="{{true}}"
/>
```

### Child to Parent (Events)
```javascript
// Child component
Component({
  methods: {
    onButtonTap() {
      // Trigger custom event
      this.triggerEvent('buttonclick', {
        message: 'Button clicked',
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
<!-- Parent template -->
<custom-button 
  bind:buttonclick="onCustomButtonClick"
/>
```

```javascript
// Parent page
Page({
  onCustomButtonClick(event) {
    console.log('Custom event received:', event.detail)
  }
})
```

### Component to Component Communication
```javascript
// Event bus pattern
const EventBus = {
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
      this.events[event] = this.events[event].filter(cb => cb !== callback)
    }
  }
}

// Component A
Component({
  attached() {
    EventBus.on('dataUpdate', this.handleDataUpdate.bind(this))
  },
  
  detached() {
    EventBus.off('dataUpdate', this.handleDataUpdate)
  },
  
  methods: {
    handleDataUpdate(data) {
      this.setData({ data })
    }
  }
})

// Component B
Component({
  methods: {
    updateData() {
      EventBus.emit('dataUpdate', { message: 'Data updated' })
    }
  }
})
```

## 🎯 Slot System

### Basic Slots
```xml
<!-- Component template -->
<view class="card">
  <view class="header">
    <slot name="header"></slot>
  </view>
  <view class="content">
    <slot></slot>
  </view>
  <view class="footer">
    <slot name="footer"></slot>
  </view>
</view>
```

```xml
<!-- Usage -->
<card-component>
  <view slot="header">
    <text>Card Title</text>
  </view>
  
  <text>Main content goes here</text>
  
  <view slot="footer">
    <button>Action</button>
  </view>
</card-component>
```

### Dynamic Slots
```javascript
Component({
  properties: {
    slots: {
      type: Array,
      value: []
    }
  }
})
```

```xml
<!-- Dynamic slot rendering -->
<view class="container">
  <block wx:for="{{slots}}" wx:key="name">
    <view class="slot-{{item.name}}">
      <slot name="{{item.name}}"></slot>
    </view>
  </block>
</view>
```

## 🎨 Component Styling

### Scoped Styles
```css
/* components/user-card/user-card.wxss */
.user-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  margin: 8px 0;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 12px;
}

.info {
  flex: 1;
}

.name {
  font-size: 16px;
  font-weight: bold;
  display: block;
}

.title {
  font-size: 14px;
  color: #666;
  display: block;
}
```

### Style Isolation
```javascript
Component({
  options: {
    styleIsolation: 'isolated' // Default
    // styleIsolation: 'apply-shared' // Apply global styles
    // styleIsolation: 'shared' // No isolation
  }
})
```

### External Classes
```javascript
Component({
  externalClasses: ['custom-class', 'header-class', 'content-class']
})
```

```xml
<!-- Component usage with external classes -->
<user-card 
  custom-class="my-custom-style"
  header-class="my-header-style"
/>
```

## 🚀 Advanced Patterns

### Higher-Order Components
```javascript
// HOC factory
function withLoading(WrappedComponent) {
  return Component({
    properties: {
      loading: Boolean,
      ...WrappedComponent.properties
    },
    
    data: {
      ...WrappedComponent.data
    },
    
    methods: {
      ...WrappedComponent.methods
    },
    
    lifetimes: {
      attached() {
        if (WrappedComponent.lifetimes?.attached) {
          WrappedComponent.lifetimes.attached.call(this)
        }
      }
    }
  })
}

// Usage
const UserCardWithLoading = withLoading({
  properties: {
    user: Object
  },
  methods: {
    onUserTap() {
      // User tap logic
    }
  }
})
```

### Render Props Pattern
```javascript
Component({
  properties: {
    renderItem: {
      type: String,
      value: 'default-item'
    }
  },
  
  data: {
    items: []
  }
})
```

```xml
<!-- List component with render props -->
<view class="list">
  <block wx:for="{{items}}" wx:key="id">
    <template is="{{renderItem}}" data="{{item}}" />
  </block>
</view>

<!-- Template definitions -->
<template name="default-item">
  <view class="item">{{item.name}}</view>
</template>

<template name="custom-item">
  <view class="custom-item">
    <image src="{{item.image}}" />
    <text>{{item.title}}</text>
  </view>
</template>
```

### Compound Components
```javascript
// Tab container component
Component({
  properties: {
    activeTab: {
      type: String,
      value: ''
    }
  },
  
  data: {
    tabs: []
  },
  
  methods: {
    registerTab(tab) {
      this.data.tabs.push(tab)
    },
    
    switchTab(tabId) {
      this.setData({ activeTab: tabId })
      this.triggerEvent('tabchange', { activeTab: tabId })
    }
  }
})

// Tab item component
Component({
  properties: {
    tabId: String,
    title: String
  },
  
  attached() {
    // Register with parent tab container
    const parent = this.getRelationNodes('../tab-container')[0]
    if (parent) {
      parent.registerTab({
        id: this.properties.tabId,
        title: this.properties.title
      })
    }
  }
})
```

## 🎯 Best Practices

### Component Design Principles
- **Single Responsibility**: Each component should have one clear purpose
- **Composability**: Components should work well together
- **Reusability**: Design for reuse across different contexts
- **Predictability**: Same inputs should produce same outputs

### Performance Optimization
```javascript
Component({
  options: {
    // Enable data path optimization
    dataPathsOptimization: true,
    
    // Enable pure data fields
    pureDataPattern: /^_/
  },
  
  data: {
    // Pure data (won't trigger re-render)
    _internalState: {},
    
    // Regular data
    displayData: {}
  },
  
  methods: {
    // Use pure data for internal state
    updateInternalState(state) {
      this.data._internalState = { ...this.data._internalState, ...state }
    },
    
    // Only update display data when necessary
    updateDisplay() {
      this.setData({
        displayData: this.computeDisplayData()
      })
    }
  }
})
```

### Error Boundaries
```javascript
Component({
  lifetimes: {
    error(error) {
      console.error('Component error:', error)
      
      // Report error to monitoring service
      this.reportError(error)
      
      // Show fallback UI
      this.setData({
        hasError: true,
        errorMessage: 'Something went wrong'
      })
    }
  },
  
  methods: {
    reportError(error) {
      // Send error to monitoring service
    },
    
    retry() {
      this.setData({
        hasError: false,
        errorMessage: ''
      })
      // Retry failed operation
    }
  }
})
```

---

Component development is essential for creating maintainable and scalable mini-programs. Well-designed components improve code reusability, maintainability, and development efficiency while providing consistent user experiences.