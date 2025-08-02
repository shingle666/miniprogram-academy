# Taro Framework

Taro is a cross-platform development framework open-sourced by JD.com that allows developers to write code once and run it on multiple mini-program platforms, H5, React Native, and other platforms using React syntax.

## 📋 Table of Contents

- [Framework Overview](#framework-overview)
- [Core Features](#core-features)
- [Supported Platforms](#supported-platforms)
- [Development Experience](#development-experience)
- [Component Ecosystem](#component-ecosystem)
- [Business Applications](#business-applications)
- [Development Trends](#development-trends)
- [Quick Start](#quick-start)
- [Learning Resources](#learning-resources)
- [Best Practices](#best-practices)
- [Development Tools](#development-tools)
- [Technical Support](#technical-support)

## 🚀 Framework Overview

### Basic Information

- **Developer**: JD.com
- **Open Source Date**: June 2018
- **Language Syntax**: React
- **Core Philosophy**: Write once, run everywhere
- **GitHub Stars**: 35k+
- **NPM Downloads**: 100k+/week

### Architecture Design

Taro adopts a compile-time architecture that converts React code into platform-specific code through AST transformation:

```
React Code → AST Analysis → Platform Code Generation → Target Platform
```

### Version Evolution

- **Taro 1.x**: Template-based compilation, supporting basic cross-platform capabilities
- **Taro 2.x**: Introduced runtime architecture, improved compatibility
- **Taro 3.x**: Full runtime architecture, supporting React/Vue/Nerv
- **Taro 4.x**: Performance optimization, enhanced developer experience

## 🎯 Core Features

### 1. Multi-Platform Unity

```javascript
// Single codebase supports multiple platforms
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

export default function Index() {
  const handleClick = () => {
    Taro.showToast({
      title: 'Hello Taro!',
      icon: 'success'
    })
  }

  return (
    <View className="index">
      <Text>Welcome to Taro</Text>
      <Button onClick={handleClick}>Click Me</Button>
    </View>
  )
}
```

### 2. React Ecosystem Compatibility

```javascript
// Support React Hooks
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const res = await Taro.request({
        url: '/api/user/profile'
      })
      setUserInfo(res.data)
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <View>Loading...</View>
  }

  return (
    <View className="user-profile">
      <Text>{userInfo?.name}</Text>
      <Text>{userInfo?.email}</Text>
    </View>
  )
}
```

### 3. Complete Engineering Support

```javascript
// taro.config.js - Complete build configuration
export default {
  projectName: 'my-taro-app',
  date: '2024-1-1',
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-html',
    '@tarojs/plugin-mock'
  ],
  defineConstants: {
    API_BASE_URL: JSON.stringify('https://api.example.com')
  },
  copy: {
    patterns: [
      { from: 'src/assets/', to: 'dist/assets/' }
    ]
  },
  framework: 'react',
  compiler: 'webpack5',
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['nut-']
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    router: {
      mode: 'browser'
    }
  }
}
```

### 4. Rich Plugin System

```javascript
// Custom plugin development
export default (ctx) => {
  ctx.onBuildStart(() => {
    console.log('Build started')
  })

  ctx.onBuildComplete(() => {
    console.log('Build completed')
  })

  ctx.modifyWebpackChain(({ chain }) => {
    chain.plugin('custom-plugin')
      .use(CustomWebpackPlugin, [options])
  })
}
```

## 📱 Supported Platforms

### Mini-Program Platforms

- **WeChat Mini-Program**: ✅ Full support
- **Alipay Mini-Program**: ✅ Full support
- **Baidu Smart Mini-Program**: ✅ Full support
- **ByteDance Mini-Program**: ✅ Full support
- **QQ Mini-Program**: ✅ Full support
- **Kuaishou Mini-Program**: ✅ Full support
- **JD Mini-Program**: ✅ Full support

### Other Platforms

- **H5**: ✅ Full support
- **React Native**: ✅ Full support
- **Harmony OS**: 🔄 In development
- **Quick App**: 🔄 In development

### Platform-Specific Code

```javascript
// Platform-specific logic
import Taro from '@tarojs/taro'

export default function PlatformSpecific() {
  const handleShare = () => {
    if (process.env.TARO_ENV === 'weapp') {
      // WeChat-specific logic
      Taro.showShareMenu({
        withShareTicket: true
      })
    } else if (process.env.TARO_ENV === 'alipay') {
      // Alipay-specific logic
      Taro.showSharePanel({
        title: 'Share Title'
      })
    } else if (process.env.TARO_ENV === 'h5') {
      // H5-specific logic
      navigator.share({
        title: 'Share Title',
        url: window.location.href
      })
    }
  }

  return (
    <Button onClick={handleShare}>
      Share
    </Button>
  )
}
```

## 💻 Development Experience

### Project Structure

```
my-taro-app/
├── src/
│   ├── app.config.js      # App configuration
│   ├── app.js             # App entry
│   ├── app.scss           # Global styles
│   ├── pages/             # Pages
│   │   ├── index/
│   │   │   ├── index.config.js
│   │   │   ├── index.jsx
│   │   │   └── index.scss
│   │   └── profile/
│   ├── components/        # Components
│   │   ├── Header/
│   │   └── Footer/
│   ├── utils/            # Utilities
│   ├── services/         # API services
│   └── assets/           # Static assets
├── config/               # Build configuration
│   ├── dev.js
│   ├── prod.js
│   └── index.js
├── package.json
└── taro.config.js
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev:weapp    # WeChat Mini-Program
npm run dev:alipay   # Alipay Mini-Program
npm run dev:h5       # H5
npm run dev:rn       # React Native

# Build for production
npm run build:weapp
npm run build:alipay
npm run build:h5
npm run build:rn

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test
```

### Hot Reload Support

```javascript
// Automatic hot reload during development
if (process.env.NODE_ENV === 'development') {
  // Development-specific code
  console.log('Development mode enabled')
}
```

## 🎨 Component Ecosystem

### Official UI Library

```javascript
// @tarojs/components - Official components
import { 
  View, 
  Text, 
  Button, 
  Image, 
  ScrollView,
  Swiper,
  SwiperItem 
} from '@tarojs/components'

export default function ComponentDemo() {
  return (
    <ScrollView scrollY className="container">
      <Swiper
        className="swiper"
        indicatorDots
        autoplay
        interval={3000}
      >
        <SwiperItem>
          <Image src="image1.jpg" mode="aspectFill" />
        </SwiperItem>
        <SwiperItem>
          <Image src="image2.jpg" mode="aspectFill" />
        </SwiperItem>
      </Swiper>
      
      <View className="content">
        <Text className="title">Welcome to Taro</Text>
        <Button type="primary">Get Started</Button>
      </View>
    </ScrollView>
  )
}
```

### Third-Party UI Libraries

```javascript
// NutUI - JD's mobile UI library
import { Button, Cell, Toast } from '@nutui/nutui-react-taro'

export default function NutUIDemo() {
  const showToast = () => {
    Toast.show('Hello NutUI!')
  }

  return (
    <View>
      <Cell title="NutUI Components" />
      <Button type="primary" onClick={showToast}>
        Show Toast
      </Button>
    </View>
  )
}

// Taro UI - Popular Taro UI library
import { AtButton, AtCard, AtList, AtListItem } from 'taro-ui'

export default function TaroUIDemo() {
  return (
    <View>
      <AtCard title="Taro UI Card">
        <AtList>
          <AtListItem title="List Item 1" />
          <AtListItem title="List Item 2" />
        </AtList>
        <AtButton type="primary">Taro UI Button</AtButton>
      </AtCard>
    </View>
  )
}
```

### Custom Component Development

```javascript
// Custom component with TypeScript
import { FC } from 'react'
import { View, Text } from '@tarojs/components'
import './UserCard.scss'

interface UserCardProps {
  user: {
    id: string
    name: string
    avatar: string
    email: string
  }
  onUserClick?: (userId: string) => void
}

const UserCard: FC<UserCardProps> = ({ user, onUserClick }) => {
  const handleClick = () => {
    onUserClick?.(user.id)
  }

  return (
    <View className="user-card" onClick={handleClick}>
      <Image className="avatar" src={user.avatar} />
      <View className="info">
        <Text className="name">{user.name}</Text>
        <Text className="email">{user.email}</Text>
      </View>
    </View>
  )
}

export default UserCard
```

## 💼 Business Applications

### E-commerce Applications

```javascript
// Product list with infinite scroll
import { useState, useEffect } from 'react'
import Taro, { useReachBottom } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import ProductCard from '../components/ProductCard'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadProducts(1)
  }, [])

  useReachBottom(() => {
    if (!loading && hasMore) {
      loadProducts(page + 1)
    }
  })

  const loadProducts = async (pageNum) => {
    setLoading(true)
    try {
      const res = await Taro.request({
        url: '/api/products',
        data: { page: pageNum, limit: 20 }
      })
      
      if (pageNum === 1) {
        setProducts(res.data.products)
      } else {
        setProducts(prev => [...prev, ...res.data.products])
      }
      
      setPage(pageNum)
      setHasMore(res.data.hasMore)
    } catch (error) {
      Taro.showToast({
        title: 'Failed to load products',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView scrollY className="product-list">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
      {loading && <View className="loading">Loading...</View>}
      {!hasMore && <View className="no-more">No more products</View>}
    </ScrollView>
  )
}
```

### Social Applications

```javascript
// Social feed with real-time updates
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, PullToRefresh } from '@tarojs/components'
import FeedItem from '../components/FeedItem'

export default function SocialFeed() {
  const [feeds, setFeeds] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadFeeds()
    setupWebSocket()
  }, [])

  const loadFeeds = async () => {
    try {
      const res = await Taro.request({
        url: '/api/feeds'
      })
      setFeeds(res.data)
    } catch (error) {
      console.error('Failed to load feeds:', error)
    }
  }

  const setupWebSocket = () => {
    const socketTask = Taro.connectSocket({
      url: 'wss://api.example.com/ws'
    })

    socketTask.onMessage((res) => {
      const newFeed = JSON.parse(res.data)
      setFeeds(prev => [newFeed, ...prev])
    })
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await loadFeeds()
    setRefreshing(false)
  }

  return (
    <PullToRefresh onRefresh={onRefresh} refreshing={refreshing}>
      <View className="social-feed">
        {feeds.map(feed => (
          <FeedItem key={feed.id} feed={feed} />
        ))}
      </View>
    </PullToRefresh>
  )
}
```

## 📈 Development Trends

### Performance Optimization

```javascript
// Code splitting and lazy loading
import { lazy, Suspense } from 'react'
import { View } from '@tarojs/components'

const LazyComponent = lazy(() => import('../components/HeavyComponent'))

export default function OptimizedPage() {
  return (
    <View>
      <Suspense fallback={<View>Loading...</View>}>
        <LazyComponent />
      </Suspense>
    </View>
  )
}

// Bundle analysis
// npm run build:weapp --analyze
```

### TypeScript Integration

```typescript
// Strong typing support
interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

const fetchUser = async (userId: string): Promise<User> => {
  const response = await Taro.request<ApiResponse<User>>({
    url: `/api/users/${userId}`
  })
  
  if (response.data.code !== 0) {
    throw new Error(response.data.message)
  }
  
  return response.data.data
}
```

### Modern React Features

```javascript
// React 18 features support
import { startTransition, useDeferredValue } from 'react'

export default function ModernReactFeatures() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)

  const handleSearch = (value) => {
    startTransition(() => {
      setQuery(value)
    })
  }

  return (
    <View>
      <Input onInput={(e) => handleSearch(e.detail.value)} />
      <SearchResults query={deferredQuery} />
    </View>
  )
}
```

## 🚀 Quick Start

### Step 1: Install Taro CLI

```bash
# Install globally
npm install -g @tarojs/cli

# Or use npx
npx @tarojs/cli init myApp
```

### Step 2: Create Project

```bash
# Create new project
taro init myTaroApp

# Choose template
? Please select a template:
  ❯ React (default template)
    Vue
    Vue3
    React (TypeScript)
    Vue (TypeScript)
    Vue3 (TypeScript)
```

### Step 3: Start Development

```bash
cd myTaroApp

# Install dependencies
npm install

# Start WeChat Mini-Program development
npm run dev:weapp

# Start H5 development
npm run dev:h5
```

### Step 4: Basic Configuration

```javascript
// src/app.config.js
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/profile/profile'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'My Taro App',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#666',
    selectedColor: '#b4282d',
    backgroundColor: '#fafafa',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: 'Home'
      },
      {
        pagePath: 'pages/profile/profile',
        text: 'Profile'
      }
    ]
  }
})
```

## 📚 Learning Resources

### Official Documentation

- **Official Website**: https://taro.zone/
- **Documentation**: https://docs.taro.zone/
- **GitHub Repository**: https://github.com/NervJS/taro
- **API Reference**: https://docs.taro.zone/docs/apis/about/desc

### Community Resources

- **Taro Community**: https://taro-club.jd.com/
- **Stack Overflow**: Search for "taro-js"
- **Chinese Community**: https://github.com/NervJS/awesome-taro
- **Discord**: Official Taro Discord server

### Video Tutorials

- **Official Video Course**: Taro official training videos
- **YouTube Tutorials**: Community-created tutorials
- **Bilibili**: Chinese video tutorials
- **Udemy Courses**: Paid comprehensive courses

### Books and Articles

- **"Taro Multi-Platform Development Practice"**
- **Medium Articles**: Latest Taro development articles
- **Dev.to Posts**: Community shared experiences
- **Chinese Blogs**: Juejin, SegmentFault articles

## 🎯 Best Practices

### Project Structure

```
src/
├── app.config.js          # App configuration
├── app.js                 # App entry
├── app.scss              # Global styles
├── pages/                # Pages
├── components/           # Reusable components
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── services/            # API services
├── store/               # State management
├── constants/           # Constants
├── types/               # TypeScript types
└── assets/              # Static assets
```

### Code Organization

```javascript
// Use custom hooks for logic reuse
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await Taro.request({
          url,
          ...options
        })
        setData(response.data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}
```

### Performance Optimization

```javascript
// Use React.memo for component optimization
import { memo } from 'react'
import { View, Text } from '@tarojs/components'

const ExpensiveComponent = memo(({ data }) => {
  return (
    <View>
      {data.map(item => (
        <Text key={item.id}>{item.name}</Text>
      ))}
    </View>
  )
})

// Use useMemo for expensive calculations
import { useMemo } from 'react'

const ProcessedData = ({ rawData }) => {
  const processedData = useMemo(() => {
    return rawData.map(item => ({
      ...item,
      processed: expensiveCalculation(item)
    }))
  }, [rawData])

  return <DataList data={processedData} />
}
```

## 🔧 Development Tools

### IDE Support

- **VS Code**: Official Taro extension
- **WebStorm**: Built-in support
- **Atom**: Community plugins
- **Sublime Text**: Syntax highlighting

### Debugging Tools

```javascript
// Development debugging
if (process.env.NODE_ENV === 'development') {
  // Enable debugging
  Taro.setEnableDebug({
    enableDebug: true
  })
}

// Remote debugging
import { enableDebug } from '@tarojs/debug'
enableDebug()
```

### Build Tools

```javascript
// Custom webpack configuration
export default {
  // ... other config
  mini: {
    webpackChain(chain) {
      chain.plugin('analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [{
          analyzerMode: 'static',
          openAnalyzer: false,
          reportFilename: 'bundle-report.html'
        }])
    }
  }
}
```

### Testing Framework

```javascript
// Jest testing setup
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  test('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello World')).toBeInTheDocument()
  })
})
```

## 📞 Technical Support

### Official Support

- **GitHub Issues**: Report bugs and feature requests
- **Official Forum**: Community discussions
- **WeChat Group**: Real-time communication
- **Email Support**: Direct contact with team

### Community Support

- **Stack Overflow**: Technical Q&A
- **Reddit**: r/reactjs discussions
- **Discord**: Real-time chat
- **Telegram**: Community groups

### Enterprise Support

- **JD Cloud**: Enterprise-level support
- **Consulting Services**: Professional consulting
- **Training Programs**: Corporate training
- **Custom Development**: Tailored solutions

### Contribution

```bash
# Contribute to Taro
git clone https://github.com/NervJS/taro.git
cd taro
npm install
npm run build
npm run test
```

---

Taro continues to evolve as one of the most popular cross-platform development frameworks, providing developers with powerful tools and comprehensive ecosystem support for building modern mini-program applications.