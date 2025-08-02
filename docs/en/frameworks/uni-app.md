# uni-app Framework

uni-app is a cross-platform application development framework that uses Vue.js syntax to develop applications that can run on multiple platforms including iOS, Android, Web, and various mini-programs.

## What is uni-app?

uni-app is developed by DCloud and allows developers to write code once and publish to multiple platforms. It supports Vue.js syntax and provides a rich ecosystem of components and APIs.

## Key Features

### Cross-Platform Development
- **Multiple Platforms**: iOS, Android, H5, WeChat Mini-Program, Alipay Mini-Program, Baidu Smart Program, ByteDance Mini-Program, QQ Mini-Program, Kuaishou Mini-Program
- **One Codebase**: Write once, run everywhere
- **Native Performance**: Near-native performance on mobile platforms

### Vue.js Ecosystem
- **Vue Syntax**: Full support for Vue.js syntax and features
- **Component System**: Rich built-in components and third-party component library
- **State Management**: Support for Vuex and Pinia

### Development Experience
- **HBuilderX IDE**: Professional development environment
- **Hot Reload**: Real-time preview during development
- **Rich Plugins**: Extensive plugin ecosystem

## Quick Start

### Installation

```bash
# Install using npm
npm install -g @vue/cli
vue create -p dcloudio/uni-preset-vue my-project

# Or use HBuilderX
# Download HBuilderX and create new uni-app project
```

### Project Structure

```
my-project/
├── pages/           # Page files
├── components/      # Components
├── static/         # Static resources
├── store/          # Vuex store
├── App.vue         # Application entry
├── main.js         # Entry file
├── manifest.json   # Application configuration
└── pages.json      # Page routing configuration
```

### Basic Page Example

```vue
<template>
  <view class="container">
    <text class="title">{{ title }}</text>
    <button @click="handleClick">Click Me</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello uni-app'
    }
  },
  methods: {
    handleClick() {
      uni.showToast({
        title: 'Button clicked!'
      })
    }
  }
}
</script>

<style>
.container {
  padding: 20px;
}
.title {
  font-size: 18px;
  color: #333;
}
</style>
```

## Core Concepts

### Page Configuration

Configure pages in `pages.json`:

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "Home"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8"
  }
}
```

### API Usage

uni-app provides unified APIs for different platforms:

```javascript
// Network request
uni.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  success: (res) => {
    console.log(res.data)
  }
})

// Storage
uni.setStorage({
  key: 'user',
  data: { name: 'John', age: 25 }
})

// Navigation
uni.navigateTo({
  url: '/pages/detail/detail?id=123'
})
```

### Conditional Compilation

Use conditional compilation for platform-specific code:

```javascript
// #ifdef MP-WEIXIN
// WeChat Mini-Program specific code
// #endif

// #ifdef APP-PLUS
// App specific code
// #endif

// #ifdef H5
// H5 specific code
// #endif
```

## Component Development

### Custom Components

```vue
<!-- components/my-component.vue -->
<template>
  <view class="my-component">
    <text>{{ message }}</text>
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default: 'Hello'
    }
  }
}
</script>
```

### Using Components

```vue
<template>
  <view>
    <my-component message="Custom Message">
      <text>Slot content</text>
    </my-component>
  </view>
</template>

<script>
import MyComponent from '@/components/my-component.vue'

export default {
  components: {
    MyComponent
  }
}
</script>
```

## Platform Differences

### API Differences
- Some APIs may not be available on all platforms
- Use conditional compilation for platform-specific features
- Check uni-app documentation for API compatibility

### Style Differences
- Different platforms may have different default styles
- Use platform-specific CSS for fine-tuning
- Test on target platforms regularly

## Best Practices

### Performance Optimization
- Use `v-show` instead of `v-if` for frequently toggled elements
- Implement lazy loading for large lists
- Optimize images and static resources
- Use subpackages for large applications

### Code Organization
- Follow Vue.js best practices
- Use composition API for complex logic
- Implement proper error handling
- Write unit tests for critical functions

### Cross-Platform Considerations
- Design responsive layouts
- Handle platform-specific features gracefully
- Test on all target platforms
- Use platform-specific optimizations when needed

## Advanced Features

### Subpackages

Configure subpackages in `pages.json`:

```json
{
  "pages": [...],
  "subPackages": [
    {
      "root": "pages/sub",
      "pages": [
        {
          "path": "detail/detail",
          "style": {
            "navigationBarTitleText": "Detail"
          }
        }
      ]
    }
  ]
}
```

### Plugins

Use uni-app plugins:

```javascript
// Install plugin
npm install uni-plugin-example

// Use in main.js
import plugin from 'uni-plugin-example'
Vue.use(plugin)
```

## Deployment

### Build for Different Platforms

```bash
# Build for H5
npm run build:h5

# Build for App
npm run build:app-plus

# Build for Mini-Programs
npm run build:mp-weixin
npm run build:mp-alipay
```

### Publishing
- **App**: Generate APK/IPA files and publish to app stores
- **H5**: Deploy to web servers
- **Mini-Programs**: Submit to respective platforms

## Resources

- [Official Documentation](https://uniapp.dcloud.io/)
- [Plugin Market](https://ext.dcloud.net.cn/)
- [Community Forum](https://ask.dcloud.net.cn/)
- [GitHub Repository](https://github.com/dcloudio/uni-app)

## Conclusion

uni-app is a powerful cross-platform development framework that enables developers to create applications for multiple platforms with a single codebase. Its Vue.js-based syntax and rich ecosystem make it an excellent choice for rapid cross-platform development.