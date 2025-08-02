# Chameleon Framework

Chameleon (CML) is a cross-platform development framework that allows developers to write code once and run on multiple platforms including Web, WeChat Mini-Program, Alipay Mini-Program, Baidu Smart Program, and native apps.

## What is Chameleon?

Chameleon is developed by Didi and provides a unified development experience across multiple platforms. It uses its own DSL (Domain Specific Language) that compiles to different platform-specific code.

## Key Features

### Cross-Platform Development
- **Multiple Platforms**: Web, WeChat Mini-Program, Alipay Mini-Program, Baidu Smart Program, ByteDance Mini-Program, QQ Mini-Program, Native Apps
- **One Codebase**: Write once, run everywhere with platform-specific optimizations
- **Unified API**: Consistent APIs across all platforms

### Component-Based Architecture
- **CML Components**: Rich set of built-in components
- **Custom Components**: Easy to create and reuse custom components
- **Component Library**: Extensive component ecosystem

### Modern Development Experience
- **Hot Reload**: Real-time development preview
- **TypeScript Support**: Optional TypeScript support
- **Rich Toolchain**: Comprehensive development tools
- **Debugging Tools**: Platform-specific debugging capabilities

## Quick Start

### Installation

```bash
# Install Chameleon CLI
npm install -g chameleon-tool

# Create new project
cml init project my-project

# Navigate to project
cd my-project

# Install dependencies
npm install

# Start development
npm run dev
```

### Project Structure

```
my-project/
├── src/
│   ├── components/     # Components
│   ├── pages/         # Pages
│   ├── store/         # State management
│   ├── utils/         # Utilities
│   ├── app.cml        # App entry
│   └── router.config.json  # Router configuration
├── dist/              # Build output
├── chameleon.config.js # Chameleon configuration
└── package.json
```

### Basic Page Example

```html
<!-- src/pages/index/index.cml -->
<template>
  <page title="Home">
    <view class="container">
      <text class="title">{{ title }}</text>
      <button class="btn" c-bind:onclick="handleClick">
        Click Count: {{ count }}
      </button>
    </view>
  </page>
</template>

<script>
class Index {
  data = {
    title: 'Hello Chameleon',
    count: 0
  }

  methods = {
    handleClick() {
      this.count++
    }
  }
}

export default new Index()
</script>

<style scoped>
.container {
  padding: 40cpx;
  text-align: center;
}

.title {
  font-size: 36cpx;
  color: #333;
  margin-bottom: 40cpx;
}

.btn {
  background-color: #1aad19;
  color: white;
  padding: 20cpx 40cpx;
  border-radius: 10cpx;
}
</style>
```

## Core Concepts

### Component Development

```html
<!-- components/my-component/my-component.cml -->
<template>
  <view class="my-component">
    <text class="label">{{ label }}</text>
    <slot></slot>
  </view>
</template>

<script>
class MyComponent {
  props = {
    label: {
      type: String,
      default: 'Default Label'
    }
  }

  data = {
    // Component data
  }

  methods = {
    // Component methods
  }
}

export default new MyComponent()
</script>

<style scoped>
.my-component {
  padding: 20cpx;
  border: 1px solid #ddd;
}

.label {
  font-weight: bold;
  margin-bottom: 10cpx;
}
</style>
```

### Using Components

```html
<template>
  <page>
    <my-component label="Custom Label">
      <text>Slot content</text>
    </my-component>
  </page>
</template>

<script>
import MyComponent from '../../components/my-component/my-component.cml'

class Index {
  components = {
    MyComponent
  }
}

export default new Index()
</script>
```

### Data Binding

```html
<template>
  <page>
    <view>
      <!-- Text interpolation -->
      <text>{{ message }}</text>
      
      <!-- Attribute binding -->
      <image src="{{ imageUrl }}" />
      
      <!-- Conditional rendering -->
      <text c-if="{{ showText }}">Conditional text</text>
      
      <!-- List rendering -->
      <view c-for="{{ item in list }}" c-key="{{ item.id }}">
        <text>{{ item.name }}</text>
      </view>
      
      <!-- Event binding -->
      <button c-bind:onclick="handleClick">Click me</button>
    </view>
  </page>
</template>

<script>
class Index {
  data = {
    message: 'Hello World',
    imageUrl: '/images/logo.png',
    showText: true,
    list: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]
  }

  methods = {
    handleClick() {
      console.log('Button clicked')
    }
  }
}

export default new Index()
</script>
```

## State Management

### Built-in Store

```javascript
// store/index.js
import { createStore } from 'chameleon-store'

const store = createStore({
  state: {
    user: null,
    theme: 'light'
  },
  
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    
    setTheme(state, theme) {
      state.theme = theme
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        const user = await api.login(credentials)
        commit('setUser', user)
        return user
      } catch (error) {
        throw error
      }
    }
  }
})

export default store
```

### Using Store in Components

```html
<template>
  <page>
    <view>
      <text>User: {{ user ? user.name : 'Not logged in' }}</text>
      <button c-bind:onclick="login">Login</button>
    </view>
  </page>
</template>

<script>
import { mapState, mapActions } from 'chameleon-store'

class Index {
  computed = {
    ...mapState(['user'])
  }

  methods = {
    ...mapActions(['login']),
    
    async handleLogin() {
      try {
        await this.login({ username: 'user', password: 'pass' })
      } catch (error) {
        console.error('Login failed:', error)
      }
    }
  }
}

export default new Index()
</script>
```

## API Usage

### Network Requests

```javascript
// utils/api.js
import { cml } from 'chameleon-api'

export const request = (options) => {
  return cml.request({
    url: options.url,
    method: options.method || 'GET',
    data: options.data,
    header: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  })
}

export const api = {
  getUserInfo: (id) => request({
    url: `/api/users/${id}`,
    method: 'GET'
  }),
  
  updateUser: (id, data) => request({
    url: `/api/users/${id}`,
    method: 'PUT',
    data
  })
}
```

### Storage

```javascript
import { cml } from 'chameleon-api'

// Set storage
cml.setStorage({
  key: 'userToken',
  data: 'abc123'
})

// Get storage
cml.getStorage({
  key: 'userToken'
}).then(res => {
  console.log(res.data)
})

// Remove storage
cml.removeStorage({
  key: 'userToken'
})
```

### Navigation

```javascript
import { cml } from 'chameleon-api'

// Navigate to page
cml.navigateTo({
  path: '/pages/detail/detail?id=123'
})

// Redirect to page
cml.redirectTo({
  path: '/pages/login/login'
})

// Go back
cml.navigateBack({
  delta: 1
})
```

## Platform-Specific Code

### Conditional Compilation

```html
<template>
  <page>
    <!-- #ifdef WEB -->
    <view class="web-only">Web specific content</view>
    <!-- #endif -->
    
    <!-- #ifdef WEIXIN -->
    <view class="weixin-only">WeChat specific content</view>
    <!-- #endif -->
    
    <!-- #ifdef ALIPAY -->
    <view class="alipay-only">Alipay specific content</view>
    <!-- #endif -->
  </page>
</template>

<script>
class Index {
  methods = {
    platformSpecificMethod() {
      // #ifdef WEB
      console.log('Running on web')
      // #endif
      
      // #ifdef WEIXIN
      wx.showToast({ title: 'WeChat Toast' })
      // #endif
    }
  }
}

export default new Index()
</script>
```

### Platform Detection

```javascript
import { cml } from 'chameleon-api'

const platform = cml.getEnv()

switch (platform) {
  case 'web':
    // Web specific logic
    break
  case 'weixin':
    // WeChat specific logic
    break
  case 'alipay':
    // Alipay specific logic
    break
  default:
    // Default logic
}
```

## Configuration

### Chameleon Configuration

```javascript
// chameleon.config.js
module.exports = {
  cmlType: 'chameleon',
  buildInfo: {
    npmName: 'my-project'
  },
  platforms: ['web', 'weixin', 'alipay', 'baidu'],
  templateType: 'smarty',
  minimize: true,
  web: {
    dev: {
      analysis: false,
      console: false
    },
    build: {
      analysis: false,
      console: false
    }
  }
}
```

### Router Configuration

```json
{
  "mode": "history",
  "domain": "https://example.com",
  "routes": [
    {
      "url": "/",
      "path": "/pages/index/index",
      "name": "首页"
    },
    {
      "url": "/detail",
      "path": "/pages/detail/detail",
      "name": "详情页"
    }
  ]
}
```

## Component Library

### Built-in Components

```html
<template>
  <page>
    <!-- Basic components -->
    <view class="container">
      <text>Text component</text>
      <button>Button component</button>
      <input placeholder="Input component" />
      <image src="/images/logo.png" />
    </view>
    
    <!-- Layout components -->
    <scroller>
      <view c-for="item in list" c-key="item.id">
        <text>{{ item.name }}</text>
      </view>
    </scroller>
    
    <!-- Form components -->
    <checkbox checked="{{ isChecked }}">Checkbox</checkbox>
    <radio checked="{{ selectedRadio === 'option1' }}">Radio</radio>
    <switch checked="{{ switchValue }}"></switch>
  </page>
</template>
```

## Best Practices

### Performance Optimization
- Use `c-show` instead of `c-if` for frequently toggled elements
- Implement virtual scrolling for long lists
- Optimize images and static resources
- Use lazy loading for components

### Code Organization
- Follow component-based architecture
- Use consistent naming conventions
- Implement proper error handling
- Write unit tests for components

### Cross-Platform Considerations
- Design responsive layouts
- Handle platform-specific features gracefully
- Test on all target platforms
- Use platform-specific optimizations when needed

## Testing

### Unit Testing

```javascript
// test/components/my-component.test.js
import { mount } from 'chameleon-test-utils'
import MyComponent from '../src/components/my-component/my-component.cml'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      propsData: {
        label: 'Test Label'
      }
    })
    
    expect(wrapper.find('.label').text()).toBe('Test Label')
  })
  
  it('handles click events', () => {
    const wrapper = mount(MyComponent)
    const button = wrapper.find('button')
    
    button.trigger('click')
    
    expect(wrapper.emitted().click).toBeTruthy()
  })
})
```

## Deployment

### Build Process

```bash
# Build for all platforms
npm run build

# Build for specific platform
npm run build:web
npm run build:weixin
npm run build:alipay
npm run build:baidu
```

### Platform-Specific Deployment

#### Web Deployment
```bash
# Build for web
npm run build:web

# Deploy to server
# Upload dist/web folder to your web server
```

#### Mini-Program Deployment
```bash
# Build for WeChat
npm run build:weixin

# Upload dist/weixin folder to WeChat Developer Tools
# Submit for review and publish
```

## Advanced Features

### Custom Plugins

```javascript
// plugins/my-plugin.js
class MyPlugin {
  constructor(options) {
    this.options = options
  }
  
  apply(compiler) {
    compiler.hooks.beforeCompile.tap('MyPlugin', () => {
      console.log('Before compile')
    })
  }
}

module.exports = MyPlugin
```

### Mixins

```javascript
// mixins/common.js
export default {
  data: {
    loading: false
  },
  
  methods: {
    showLoading() {
      this.loading = true
    },
    
    hideLoading() {
      this.loading = false
    }
  }
}
```

```html
<script>
import commonMixin from '../../mixins/common.js'

class Index {
  mixins = [commonMixin]
  
  methods = {
    async fetchData() {
      this.showLoading()
      try {
        const data = await api.getData()
        // Handle data
      } finally {
        this.hideLoading()
      }
    }
  }
}

export default new Index()
</script>
```

### Internationalization

```javascript
// i18n/index.js
import { cml } from 'chameleon-api'

const messages = {
  'zh-CN': {
    hello: '你好',
    welcome: '欢迎'
  },
  'en-US': {
    hello: 'Hello',
    welcome: 'Welcome'
  }
}

export const i18n = {
  locale: 'zh-CN',
  
  t(key) {
    return messages[this.locale][key] || key
  },
  
  setLocale(locale) {
    this.locale = locale
  }
}
```

## Troubleshooting

### Common Issues

#### Build Errors
- Check chameleon.config.js configuration
- Verify all dependencies are installed
- Clear build cache and rebuild

#### Platform Compatibility
- Use platform-specific code when needed
- Test on actual devices/platforms
- Check API compatibility across platforms

#### Performance Issues
- Optimize component rendering
- Use proper data binding techniques
- Implement lazy loading for large datasets

### Debugging

```javascript
// Enable debug mode
cml.setDebugMode(true)

// Log platform information
console.log('Platform:', cml.getEnv())
console.log('System info:', cml.getSystemInfo())

// Performance monitoring
const startTime = Date.now()
// ... your code ...
console.log('Execution time:', Date.now() - startTime)
```

## Migration Guide

### From Other Frameworks

#### From Vue.js
- Convert Vue components to CML components
- Update template syntax
- Adapt state management
- Test on target platforms

#### From React
- Convert JSX to CML template syntax
- Update component lifecycle methods
- Adapt state management patterns
- Test cross-platform compatibility

## Community and Resources

### Official Resources
- [Official Documentation](https://cml.js.org/)
- [GitHub Repository](https://github.com/didi/chameleon)
- [Component Library](https://github.com/beatles-chameleon/cml-ui)

### Community Resources
- [Examples Repository](https://github.com/beatles-chameleon/cml-demo)
- [Community Forum](https://github.com/didi/chameleon/discussions)
- [Plugin Ecosystem](https://github.com/chameleon-team)

### Learning Resources
- Official tutorials and guides
- Community blog posts and articles
- Video tutorials and courses
- Open source project examples

## Conclusion

Chameleon provides a powerful solution for cross-platform development with its unified API and component system. It enables developers to write code once and deploy to multiple platforms while maintaining platform-specific optimizations. The framework's comprehensive toolchain and active community make it an excellent choice for teams looking to develop applications across web and mini-program platforms efficiently.

Whether you're building a simple mini-program or a complex cross-platform application, Chameleon offers the flexibility and tools needed to create high-quality user experiences across all supported platforms.
