# Getting Started with Mini-Program Development

Welcome to the world of mini-program development! This guide will help you set up your development environment and create your first mini-program across different platforms.

## 🎯 Choose Your Platform

Before diving into development, you need to decide which platform(s) you want to target. Each platform has its own ecosystem, user base, and strengths:

### Major Platforms Overview

| Platform | Users | Best For | Key Features |
|----------|-------|----------|--------------|
| **WeChat** | 1B+ | Social, E-commerce, Services | Mature ecosystem, rich APIs |
| **Alipay** | 700M+ | Finance, Business, Government | Payment integration, B2B focus |
| **Baidu** | 500M+ | Search, Information, AI | AI capabilities, search traffic |
| **ByteDance** | 600M+ | Content, Entertainment | Algorithm recommendation |
| **QQ** | 800M+ | Social, Gaming | Young demographics |

## 🛠️ Development Environment Setup

### Option 1: Platform-Specific Development

#### WeChat Mini-Program
1. **Download WeChat DevTools**
   ```bash
   # Visit: https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
   ```

2. **Create New Project**
   - Open WeChat DevTools
   - Click "Create Project"
   - Enter AppID (get from WeChat MP Admin)
   - Choose project template

3. **Project Structure**
   ```
   my-wechat-miniprogram/
   ├── app.js          # App logic
   ├── app.json        # App configuration
   ├── app.wxss        # Global styles
   ├── pages/          # Page components
   │   └── index/
   │       ├── index.js
   │       ├── index.json
   │       ├── index.wxml
   │       └── index.wxss
   └── utils/          # Utility functions
   ```

#### Alipay Mini-Program
1. **Download Alipay DevTools**
   ```bash
   # Visit: https://opendocs.alipay.com/mini/ide/download
   ```

2. **Key Differences from WeChat**
   - Uses `.axml` instead of `.wxml`
   - Uses `.acss` instead of `.wxss`
   - Different API namespaces (`my.*` vs `wx.*`)

### Option 2: Cross-Platform Development

#### Using Taro (React-based)

1. **Install Taro CLI**
   ```bash
   npm install -g @tarojs/cli
   ```

2. **Create New Project**
   ```bash
   taro init myApp
   cd myApp
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Development Commands**
   ```bash
   # WeChat Mini-Program
   npm run dev:weapp
   
   # Alipay Mini-Program
   npm run dev:alipay
   
   # Baidu Smart Mini-Program
   npm run dev:swan
   
   # ByteDance Mini-Program
   npm run dev:tt
   ```

#### Using uni-app (Vue-based)

1. **Install HBuilderX** or use CLI
   ```bash
   npm install -g @vue/cli
   vue create -p dcloudio/uni-preset-vue my-project
   ```

2. **Project Structure**
   ```
   my-uni-app/
   ├── pages/          # Page components
   ├── static/         # Static resources
   ├── components/     # Custom components
   ├── App.vue         # App entry
   ├── main.js         # App initialization
   ├── manifest.json   # App configuration
   └── pages.json      # Page routing
   ```

3. **Development Commands**
   ```bash
   # WeChat Mini-Program
   npm run dev:mp-weixin
   
   # Alipay Mini-Program
   npm run dev:mp-alipay
   
   # Baidu Smart Mini-Program
   npm run dev:mp-baidu
   ```

## 📱 Your First Mini-Program

Let's create a simple "Hello World" mini-program that works across platforms.

### Using Taro

1. **Create Component**
   ```jsx
   // src/pages/index/index.jsx
   import { Component } from 'react'
   import { View, Text, Button } from '@tarojs/components'
   import { showToast } from '@tarojs/taro'
   import './index.scss'

   export default class Index extends Component {
     state = {
       count: 0
     }

     handleClick = () => {
       this.setState({
         count: this.state.count + 1
       })
       showToast({
         title: `Clicked ${this.state.count + 1} times!`,
         icon: 'success'
       })
     }

     render() {
       return (
         <View className='index'>
           <Text className='title'>Hello MiniProgram!</Text>
           <Text className='count'>Count: {this.state.count}</Text>
           <Button onClick={this.handleClick}>Click Me</Button>
         </View>
       )
     }
   }
   ```

2. **Add Styles**
   ```scss
   // src/pages/index/index.scss
   .index {
     padding: 40px;
     text-align: center;
     
     .title {
       font-size: 36px;
       color: #333;
       margin-bottom: 20px;
       display: block;
     }
     
     .count {
       font-size: 24px;
       color: #666;
       margin-bottom: 30px;
       display: block;
     }
   }
   ```

### Using uni-app

1. **Create Page**
   ```vue
   <!-- pages/index/index.vue -->
   <template>
     <view class="container">
       <text class="title">Hello MiniProgram!</text>
       <text class="count">Count: {{ count }}</text>
       <button @click="handleClick">Click Me</button>
     </view>
   </template>

   <script>
   export default {
     data() {
       return {
         count: 0
       }
     },
     methods: {
       handleClick() {
         this.count++
         uni.showToast({
           title: `Clicked ${this.count} times!`,
           icon: 'success'
         })
       }
     }
   }
   </script>

   <style>
   .container {
     padding: 40px;
     text-align: center;
   }
   
   .title {
     font-size: 36px;
     color: #333;
     margin-bottom: 20px;
     display: block;
   }
   
   .count {
     font-size: 24px;
     color: #666;
     margin-bottom: 30px;
     display: block;
   }
   </style>
   ```

## 🚀 Build and Preview

### Taro Project
```bash
# Development mode
npm run dev:weapp

# Production build
npm run build:weapp
```

### uni-app Project
```bash
# Development mode
npm run dev:mp-weixin

# Production build
npm run build:mp-weixin
```

## 📋 Next Steps

Now that you have your first mini-program running, here's what to explore next:

### 1. **Learn Platform APIs**
- **Navigation**: Page routing and parameter passing
- **Storage**: Local data persistence
- **Network**: HTTP requests and WebSocket
- **Media**: Camera, audio, video capabilities
- **Location**: GPS and map integration

### 2. **UI Components**
- **Basic Components**: View, Text, Image, Button
- **Form Components**: Input, Picker, Switch, Slider
- **Navigation**: Navigator, TabBar
- **Media**: Audio, Video, Camera
- **Custom Components**: Reusable UI elements

### 3. **Advanced Features**
- **Cloud Functions**: Serverless backend
- **Real-time Database**: Live data synchronization
- **Payment Integration**: In-app purchases
- **Social Features**: Sharing, user authentication
- **Performance Optimization**: Code splitting, lazy loading

### 4. **Testing and Debugging**
- **DevTools**: Debugging, performance analysis
- **Real Device Testing**: iOS and Android testing
- **Automated Testing**: Unit and integration tests
- **Performance Monitoring**: Runtime performance tracking

## 🔧 Development Tools

### Essential Tools
- **IDE**: Platform-specific development tools
- **Version Control**: Git for source code management
- **Package Manager**: npm/yarn for dependencies
- **Linting**: ESLint for code quality
- **Formatting**: Prettier for code formatting

### Recommended Extensions
- **Syntax Highlighting**: Platform-specific language support
- **Auto-completion**: IntelliSense for APIs
- **Debugging**: Breakpoints and variable inspection
- **Preview**: Real-time preview in simulator

## 🤝 Community Resources

- **Official Documentation**: Platform-specific guides
- **GitHub Repositories**: Open-source examples
- **Developer Forums**: Community Q&A
- **Video Tutorials**: Step-by-step learning
- **Conferences**: Industry events and talks

## 📞 Getting Help

If you run into issues:

1. **Check Documentation**: Platform-specific docs
2. **Search Community**: Existing solutions
3. **Ask Questions**: Developer forums
4. **Report Bugs**: GitHub issues
5. **Contact Support**: Direct platform support

---

Ready to build something amazing? Choose your platform and framework, then start coding! 🚀

## 📚 What's Next?

- [Framework Comparison](/docs/en/frameworks) - Choose the right tool
- [Platform Guides](/docs/en/platforms) - Platform-specific development
- [Best Practices](/docs/en/best-practices) - Industry standards
- [Examples](/showcase) - Real-world implementations