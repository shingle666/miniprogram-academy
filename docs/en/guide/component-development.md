# Component Development

Components are reusable UI elements that encapsulate structure, style, and behavior. They help in building modular and maintainable mini programs. This guide covers the essentials of component development.

## Component Structure

A mini program component typically consists of four files:

1. **JavaScript File (.js)**: Contains the component logic
2. **Template File (.wxml/.axml/.swan)**: Contains the component structure
3. **Style File (.wxss/.acss/.css)**: Contains the component styling
4. **Configuration File (.json)**: Contains the component configuration

## Creating a New Component

### 1. Create the Component Directory

First, create a new directory for your component in the `components` folder:

```
components/
└── my-component/
```

### 2. Create the Component Files

Create the four required files in the component directory:

```
components/
└── my-component/
    ├── my-component.js
    ├── my-component.wxml
    ├── my-component.wxss
    └── my-component.json
```

### 3. Configure the Component

In the component's JSON file, set `"component": true`:

```json
{
  "component": true,
  "usingComponents": {}
}
```

### 4. Register the Component

To use the component in a page, register it in the page's JSON file:

```json
{
  "usingComponents": {
    "my-component": "/components/my-component/my-component"
  }
}
```

## Component JavaScript

The component JavaScript file defines the component instance, properties, data, and methods.

### Basic Structure

```javascript
// components/my-component/my-component.js
Component({
  // Component properties (passed from parent)
  properties: {
    title: {
      type: String,
      value: 'Default Title'
    },
    items: {
      type: Array,
      value: []
    }
  },

  // Component internal data
  data: {
    count: 0
  },

  // Component lifecycle
  lifetimes: {
    created() {
      // Component instance created
      console.log('Component created')
    },
    attached() {
      // Component attached to page
      console.log('Component attached')
    },
    ready() {
      // Component rendering complete
      console.log('Component ready')
    },
    moved() {
      // Component position changed
      console.log('Component moved')
    },
    detached() {
      // Component detached from page
      console.log('Component detached')
    }
  },

  // Page lifecycle
  pageLifetimes: {
    show() {
      // Page containing component shown
      console.log('Page shown')
    },
    hide() {
      // Page containing component hidden
      console.log('Page hidden')
    },
    resize(size) {
      // Page size changed
      console.log('Page resized:', size)
    }
  },

  // Component methods
  methods: {
    // Event handlers
    handleTap() {
      this.setData({
        count: this.data.count + 1
      })
      
      // Trigger an event to the parent
      this.triggerEvent('countchange', {
        count: this.data.count
      })
    },
    
    // Custom methods
    reset() {
      this.setData({
        count: 0
      })
    }
  }
})
```

### Properties

Properties are data passed from the parent to the component:

```javascript
properties: {
  // Simple property
  title: String,
  
  // Property with type and default value
  subtitle: {
    type: String,
    value: 'Default Subtitle'
  },
  
  // Property with observer
  status: {
    type: String,
    value: 'normal',
    observer(newVal, oldVal) {
      console.log(`Status changed from ${oldVal} to ${newVal}`)
      this.statusChanged(newVal)
    }
  }
}
```

Property types can be:
- `String`
- `Number`
- `Boolean`
- `Object`
- `Array`
- `null` (accepts any type)

### Data Management

Use `this.setData()` to update the component data and trigger UI updates:

```javascript
this.setData({
  count: this.data.count + 1,
  'user.name': 'John',
  'items[0]': 'Updated Item'
})
```

### Custom Events

Trigger events to communicate with the parent:

```javascript
this.triggerEvent('customEvent', {
  // Event detail data
  value: this.data.count
}, {
  // Event options
  bubbles: false,
  composed: false,
  capturePhase: false
})
```

## Component Template

The component template file defines the structure and layout of the component.

### Basic Structure

```html
<!-- components/my-component/my-component.wxml -->
<view class="component-container">
  <view class="header">
    <text class="title">{{title}}</text>
  </view>
  
  <view class="content">
    <block wx:for="{{items}}" wx:key="index">
      <view class="item">{{item}}</view>
    </block>
  </view>
  
  <view class="footer">
    <text>Count: {{count}}</text>
    <button bindtap="handleTap">Increment</button>
  </view>
</view>
```

### Slots

Use slots to allow content insertion from the parent:

```html
<!-- Default slot -->
<view class="container">
  <view class="header">{{title}}</view>
  <view class="content">
    <slot></slot>
  </view>
</view>

<!-- Named slots -->
<view class="container">
  <view class="header">
    <slot name="header"></slot>
  </view>
  <view class="content">
    <slot name="content"></slot>
  </view>
  <view class="footer">
    <slot name="footer"></slot>
  </view>
</view>
```

In the parent page:

```html
<!-- Using default slot -->
<my-component title="My Component">
  <view>This content goes into the default slot</view>
</my-component>

<!-- Using named slots -->
<my-component title="My Component">
  <view slot="header">Header Content</view>
  <view slot="content">Main Content</view>
  <view slot="footer">Footer Content</view>
</my-component>
```

## Component Styling

The component style file contains CSS rules specific to the component.

### Basic Structure

```css
/* components/my-component/my-component.wxss */
.component-container {
  padding: 20rpx;
  border: 1rpx solid #eee;
  border-radius: 10rpx;
}

.header {
  margin-bottom: 20rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}

.content {
  margin-bottom: 20rpx;
}

.item {
  padding: 10rpx;
  border-bottom: 1rpx solid #eee;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Style Isolation

By default, component styles are isolated from the parent page. You can configure style isolation in the component's JSON file:

```json
{
  "component": true,
  "styleIsolation": "isolated"
}
```

Style isolation options:
- `isolated`: Component styles don't affect parent, parent styles don't affect component (default)
- `apply-shared`: Parent styles affect component, component styles don't affect parent
- `shared`: Component styles affect parent, parent styles affect component

## Component Configuration

The component configuration file contains settings specific to the component.

### Basic Structure

```json
{
  "component": true,
  "usingComponents": {
    "sub-component": "/components/sub-component/sub-component"
  },
  "styleIsolation": "isolated"
}
```

### Common Configuration Options

- **component**: Must be set to `true` for component files
- **usingComponents**: Registers other components for use within this component
- **styleIsolation**: Controls how styles are isolated between component and parent
- **componentGenerics**: Defines generic components (similar to templates)

## Advanced Component Features

### Behaviors

Behaviors are similar to mixins, allowing code reuse across components:

```javascript
// behaviors/my-behavior.js
export default Behavior({
  properties: {
    behaviorProperty: {
      type: String,
      value: 'Default Value'
    }
  },
  data: {
    behaviorData: 'Behavior Data'
  },
  methods: {
    behaviorMethod() {
      console.log('Behavior method called')
    }
  }
})
```

Using behaviors in a component:

```javascript
import myBehavior from '../../behaviors/my-behavior'

Component({
  behaviors: [myBehavior],
  
  // Component properties, data, and methods
  // These can override behavior properties, data, and methods
})
```

### Relations

Define relationships between components:

```javascript
Component({
  relations: {
    '../list-item/list-item': {
      type: 'child', // or 'parent', 'ancestor', 'descendant'
      linked(target) {
        // Called when a related component is attached
        console.log('Item linked:', target)
        this.updateItems()
      },
      linkChanged(target) {
        // Called when a related component's data changes
        console.log('Item changed:', target)
        this.updateItems()
      },
      unlinked(target) {
        // Called when a related component is detached
        console.log('Item unlinked:', target)
        this.updateItems()
      }
    }
  },
  
  methods: {
    updateItems() {
      const items = this.getRelationNodes('../list-item/list-item')
      console.log('Related items:', items)
    }
  }
})
```

### Component Options

Configure component behavior with options:

```javascript
Component({
  options: {
    multipleSlots: true, // Enable multiple named slots
    addGlobalClass: true, // Allow global class names in the component
    pureDataPattern: /^_/, // Properties starting with _ won't trigger UI updates
    virtualHost: true // Component acts as a virtual node
  }
})
```

## Best Practices

1. **Keep Components Focused**: Each component should have a single responsibility
2. **Design Clear APIs**: Define clear properties and events for component interaction
3. **Document Components**: Add comments explaining the component's purpose and usage
4. **Reuse Components**: Create a library of reusable components
5. **Test Components**: Test components in isolation
6. **Follow Naming Conventions**: Use consistent naming for components, properties, and events
7. **Optimize Performance**: Minimize unnecessary renders and data updates

## Next Steps

Now that you understand component development, you can proceed to learn about:

- [Data Binding](./data-binding.md)
- [Event Handling](./event-handling.md)
- [Network Requests](./network-requests.md)