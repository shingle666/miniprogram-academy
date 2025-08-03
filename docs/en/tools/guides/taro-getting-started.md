# Getting Started with Taro

Taro is a unified cross-platform framework that allows developers to build applications for multiple platforms including WeChat Mini Program, Alipay Mini Program, Baidu Smart Program, and H5 with a single codebase. This guide will help you get started with Taro development, from installation to building your first cross-platform application.

## Introduction to Taro

### What is Taro?

Taro is an open-source framework developed by the JD.com team that enables developers to write code once and deploy it to multiple platforms. It supports React, Vue, and Nerv syntax, allowing developers to use familiar web development paradigms to build native-like experiences across different platforms.

### Key Features

- **Write Once, Deploy Everywhere**: Build for multiple platforms with a single codebase
- **Modern Framework Support**: Use React, Vue, or Nerv for development
- **Rich Component Library**: Access to platform-specific UI components
- **Developer Experience**: Hot reloading, TypeScript support, and comprehensive tooling
- **Performance Optimization**: Built-in optimizations for mini program environments
- **Ecosystem Integration**: Compatible with most NPM packages and web libraries

### Supported Platforms

Taro currently supports the following platforms:

- WeChat Mini Program
- Alipay Mini Program
- Baidu Smart Program
- ByteDance Mini Program
- QQ Mini Program
- JD Mini Program
- Web (H5)
- React Native
- Harmony OS (HarmonyOS)

## Installation and Setup

### Prerequisites

Before installing Taro, ensure you have the following:

- Node.js (version 12 or later)
- npm or yarn package manager
- WeChat Developer Tools (for WeChat Mini Program development)
- Other platform-specific developer tools as needed

### Installing Taro CLI

To install the Taro command-line interface globally, run:

```bash
# Using npm
npm install -g @tarojs/cli

# Using yarn
yarn global add @tarojs/cli
```

Verify the installation by checking the Taro version:

```bash
taro -v
```

### Creating a New Project

To create a new Taro project, use the `init` command:

```bash
taro init my-taro-app
```

During the initialization process, you'll be prompted to:

1. Choose a template (React, Vue, etc.)
2. Select the framework version
3. Choose TypeScript or JavaScript
4. Configure CSS preprocessing (Sass, Less, Stylus, etc.)
5. Set up additional features

After answering these questions, Taro will create a new project with the specified configuration.

## Project Structure

A typical Taro project structure looks like this:

```
my-taro-app/
├── config/                 # Project configuration
│   ├── dev.js              # Development environment config
│   ├── index.js            # Base configuration
│   └── prod.js             # Production environment config
├── dist/                   # Build output directory
├── src/                    # Source code
│   ├── components/         # Reusable components
│   ├── pages/              # Application pages
│   │   └── index/          # Index page
│   │       ├── index.jsx   # Page component
│   │       └── index.scss  # Page styles
│   ├── app.config.js       # Global app configuration
│   ├── app.js              # App entry point
│   └── app.scss            # Global styles
├── .editorconfig           # Editor configuration
├── .eslintrc               # ESLint configuration
├── babel.config.js         # Babel configuration
├── package.json            # Project dependencies
└── project.config.json     # Mini program project configuration
```

## Development Basics

### Creating Pages

In Taro, each page is a separate component. To create a new page:

1. Create a new directory in the `src/pages` folder
2. Add the main component file (e.g., `index.jsx` or `index.vue`)
3. Add a configuration file (e.g., `index.config.js`)
4. Register the page in `app.config.js`

Example page component (React):

```jsx
import React, { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'

export default class Index extends Component {
  state = {
    count: 0
  }

  incrementCount = () => {
    this.setState({
      count: this.state.count + 1
    })
  }

  render() {
    return (
      <View className='index'>
        <Text>Hello, Taro!</Text>
        <View>Count: {this.state.count}</View>
        <Button onClick={this.incrementCount}>Increment</Button>
      </View>
    )
  }
}
```

Example page configuration:

```js
// index.config.js
export default {
  navigationBarTitleText: 'Home Page'
}
```

Register the page in app.config.js:

```js
// app.config.js
export default {
  pages: [
    'pages/index/index',
    'pages/newpage/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Taro App',
    navigationBarTextStyle: 'black'
  }
}
```

### Using Components

Taro provides a set of built-in components that map to native components on each platform:

```jsx
import { View, Text, Image, Button } from '@tarojs/components'

function MyComponent() {
  return (
    <View className='container'>
      <Text>This is a text component</Text>
      <Image src='https://example.com/image.png' />
      <Button type='primary'>Click Me</Button>
    </View>
  )
}
```

### Styling

Taro supports various CSS preprocessing options. Here's an example using SCSS:

```scss
// index.scss
.container {
  padding: 20px;
  
  .title {
    font-size: 18px;
    color: #333;
  }
  
  .button {
    margin-top: 10px;
    background-color: #0078d7;
    color: white;
  }
}
```

Use the styles in your component:

```jsx
import './index.scss'

function MyComponent() {
  return (
    <View className='container'>
      <Text className='title'>Styled Title</Text>
      <Button className='button'>Styled Button</Button>
    </View>
  )
}
```

### Navigation

Taro provides APIs for navigating between pages:

```jsx
import Taro from '@tarojs/taro'

// Navigate to a page
Taro.navigateTo({
  url: '/pages/detail/index?id=123'
})

// Redirect (replace current page)
Taro.redirectTo({
  url: '/pages/login/index'
})

// Navigate back
Taro.navigateBack({
  delta: 1 // Number of pages to go back
})

// Switch tab
Taro.switchTab({
  url: '/pages/home/index'
})
```

### Accessing Page Parameters

To access URL parameters:

```jsx
import { useRouter } from '@tarojs/taro'

function DetailPage() {
  const router = useRouter()
  const { id } = router.params
  
  return (
    <View>
      <Text>Detail for item: {id}</Text>
    </View>
  )
}
```

## API Usage

### Network Requests

Taro provides a unified API for making network requests:

```jsx
import Taro from '@tarojs/taro'

// GET request
Taro.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    param1: 'value1',
    param2: 'value2'
  },
  success: (res) => {
    console.log('Request successful:', res.data)
  },
  fail: (err) => {
    console.error('Request failed:', err)
  },
  complete: () => {
    console.log('Request completed')
  }
})

// Using Promises
Taro.request({
  url: 'https://api.example.com/data',
  method: 'POST',
  data: {
    name: 'Taro',
    version: '3.x'
  }
})
  .then(res => console.log(res.data))
  .catch(err => console.error(err))
```

### Storage

Taro provides APIs for data persistence:

```jsx
// Store data
Taro.setStorage({
  key: 'userInfo',
  data: {
    name: 'John',
    age: 30,
    token: 'abc123'
  }
})

// Get data
Taro.getStorage({
  key: 'userInfo',
  success: (res) => {
    console.log(res.data)
  }
})

// Using sync APIs
try {
  Taro.setStorageSync('key', 'value')
  const value = Taro.getStorageSync('key')
  console.log(value)
} catch (e) {
  console.error(e)
}

// Remove data
Taro.removeStorage({
  key: 'userInfo'
})

// Clear all storage
Taro.clearStorage()
```

### System Information

Get device and system information:

```jsx
// Get system info
Taro.getSystemInfo({
  success: (res) => {
    console.log('System info:', res)
    console.log('Platform:', res.platform)
    console.log('Screen width:', res.screenWidth)
    console.log('Screen height:', res.screenHeight)
  }
})

// Get network type
Taro.getNetworkType({
  success: (res) => {
    console.log('Network type:', res.networkType)
  }
})
```

## Building and Deployment

### Development Mode

To start the development server for a specific platform:

```bash
# WeChat Mini Program
taro build --type weapp --watch

# Alipay Mini Program
taro build --type alipay --watch

# H5
taro build --type h5 --watch
```

### Production Build

To create a production build:

```bash
# WeChat Mini Program
taro build --type weapp

# Alipay Mini Program
taro build --type alipay

# H5
taro build --type h5
```

### Custom Build Configuration

You can customize the build process by modifying the configuration files in the `config` directory:

```js
// config/index.js
const config = {
  projectName: 'my-taro-app',
  date: '2023-5-15',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [],
  defineConstants: {
    API_URL: JSON.stringify('https://api.example.com')
  },
  copy: {
    patterns: [
      { from: 'src/assets/', to: 'dist/assets/' }
    ],
    options: {}
  },
  framework: 'react',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 1024 // Size limit for base64 conversion
        }
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false,
        config: {
          namingPattern: 'module',
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
```

## Advanced Topics

### State Management

#### Using Redux with Taro

Install Redux dependencies:

```bash
npm install redux @tarojs/redux @tarojs/redux-h5 redux-thunk redux-logger
```

Set up the Redux store:

```jsx
// src/store/index.js
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose

const middlewares = [
  thunkMiddleware
]

if (process.env.NODE_ENV === 'development') {
  middlewares.push(require('redux-logger').createLogger())
}

const enhancer = composeEnhancers(
  applyMiddleware(...middlewares)
)

export default function configStore () {
  const store = createStore(rootReducer, enhancer)
  return store
}
```

Connect Redux to your Taro app:

```jsx
// src/app.js
import React, { Component } from 'react'
import { Provider } from '@tarojs/redux'
import configStore from './store'

const store = configStore()

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default App
```

### Custom Components

Creating reusable components:

```jsx
// src/components/Card/index.jsx
import React from 'react'
import { View, Text, Image } from '@tarojs/components'
import './index.scss'

function Card({ title, image, description, onTap }) {
  return (
    <View className='card' onClick={onTap}>
      <Image className='card-image' src={image} mode='aspectFill' />
      <View className='card-content'>
        <Text className='card-title'>{title}</Text>
        <Text className='card-description'>{description}</Text>
      </View>
    </View>
  )
}

export default Card
```

Using the custom component:

```jsx
import Card from '../../components/Card'

function ProductList() {
  const handleCardTap = (id) => {
    Taro.navigateTo({
      url: `/pages/product/detail?id=${id}`
    })
  }

  return (
    <View className='product-list'>
      <Card
        title='Product 1'
        image='https://example.com/product1.jpg'
        description='This is product 1 description'
        onTap={() => handleCardTap(1)}
      />
      <Card
        title='Product 2'
        image='https://example.com/product2.jpg'
        description='This is product 2 description'
        onTap={() => handleCardTap(2)}
      />
    </View>
  )
}
```

### Platform-Specific Code

Sometimes you need to write platform-specific code. Taro provides several ways to do this:

#### Using process.env.TARO_ENV

```jsx
if (process.env.TARO_ENV === 'weapp') {
  // WeChat Mini Program specific code
} else if (process.env.TARO_ENV === 'alipay') {
  // Alipay Mini Program specific code
} else if (process.env.TARO_ENV === 'h5') {
  // H5 specific code
}
```

#### Platform-Specific Files

You can create platform-specific files by adding a platform suffix:

```
src/
├── components/
│   └── Header/
│       ├── index.jsx          # Default implementation
│       ├── index.weapp.jsx    # WeChat implementation
│       └── index.h5.jsx       # H5 implementation
```

Taro will automatically use the appropriate file based on the target platform.

## Best Practices

### Performance Optimization

1. **Minimize re-renders**:
   - Use `shouldComponentUpdate` or `React.memo` to prevent unnecessary renders
   - Keep component state as local as possible

2. **Optimize list rendering**:
   - Use `key` prop correctly in lists
   - Consider virtualized lists for long scrolling content

3. **Reduce package size**:
   - Use code splitting and lazy loading
   - Optimize images and assets
   - Remove unused dependencies

### Code Organization

1. **Feature-based structure**:
   ```
   src/
   ├── features/
   │   ├── auth/
   │   │   ├── components/
   │   │   ├── services/
   │   │   └── store/
   │   ├── products/
   │   └── cart/
   ├── common/
   │   ├── components/
   │   ├── utils/
   │   └── hooks/
   └── app.js
   ```

2. **Consistent naming conventions**:
   - Use PascalCase for component files and folders
   - Use camelCase for utility functions and hooks
   - Use kebab-case for CSS class names

3. **Separation of concerns**:
   - Separate business logic from UI components
   - Use custom hooks for reusable logic
   - Create service modules for API calls

## Troubleshooting Common Issues

### Build Errors

If you encounter build errors:

1. Check your Node.js version compatibility
2. Ensure all dependencies are installed correctly
3. Clear the build cache: `taro clean`
4. Check for syntax errors in your code
5. Verify platform-specific configurations

### Platform Compatibility Issues

When facing platform compatibility issues:

1. Check the Taro documentation for known limitations
2. Use platform-specific code as needed
3. Test thoroughly on each target platform
4. Consider using more generic approaches when possible

### Performance Problems

If your app is slow:

1. Use the React DevTools to identify performance bottlenecks
2. Optimize render cycles and state updates
3. Reduce unnecessary API calls and data processing
4. Implement proper caching strategies

## Resources and Support

### Official Documentation

- [Taro Official Website](https://taro.zone/)
- [Taro GitHub Repository](https://github.com/NervJS/taro)
- [Taro Component Documentation](https://taro-docs.jd.com/taro/docs/components-desc)
- [Taro API Reference](https://taro-docs.jd.com/taro/docs/apis/about/desc)

### Community Resources

- [Taro Community](https://taro-club.jd.com/)
- [Taro UI Component Library](https://taro-ui.jd.com/)
- [Awesome Taro](https://github.com/NervJS/awesome-taro)

## Next Steps

Now that you're familiar with Taro, you might want to explore:

- [WeChat Developer Tools](./wechat-devtools.md) for testing your mini programs
- [Mini Program CI/CD](./miniprogram-cicd.md) for automated deployment
- [Cloud Development](./cloud-development.md) for serverless backend solutions
- [Performance Optimization](./performance-optimization.md) for advanced optimization techniques