# Remax Framework

Remax is a React-based framework for building mini-programs. It allows developers to use React syntax and ecosystem to develop mini-programs for various platforms.

## What is Remax?

Remax is developed by Alibaba and enables developers to use React to build mini-programs. It provides a familiar development experience for React developers while targeting mini-program platforms.

## Key Features

### React Ecosystem
- **React Syntax**: Full support for React hooks, components, and patterns
- **JSX Support**: Write components using JSX syntax
- **React DevTools**: Debug with familiar React development tools
- **Third-party Libraries**: Use many React ecosystem libraries

### Multi-Platform Support
- **WeChat Mini-Program**: Native WeChat mini-program support
- **Alipay Mini-Program**: Full Alipay mini-program compatibility
- **Baidu Smart Program**: Support for Baidu's mini-program platform
- **ByteDance Mini-Program**: Compatible with ByteDance mini-programs

### Modern Development
- **TypeScript**: First-class TypeScript support
- **Hot Reload**: Fast development with hot module replacement
- **Modern Build**: Webpack-based build system
- **CSS-in-JS**: Support for styled-components and emotion

## Quick Start

### Installation

```bash
# Create new project
npx create-remax-app my-app

# Navigate to project
cd my-app

# Install dependencies
npm install

# Start development
npm run dev
```

### Project Structure

```
my-app/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── app.tsx         # App entry component
│   └── app.config.ts   # App configuration
├── dist/              # Build output
├── package.json
└── remax.config.js    # Remax configuration
```

### Basic Page Example

```tsx
// src/pages/index/index.tsx
import React, { useState } from 'react'
import { View, Text, Button } from 'remax/wechat'

const IndexPage: React.FC = () => {
  const [count, setCount] = useState(0)

  const handleIncrement = () => {
    setCount(count + 1)
  }

  return (
    <View className="container">
      <Text className="title">Count: {count}</Text>
      <Button onClick={handleIncrement}>
        Increment
      </Button>
    </View>
  )
}

export default IndexPage
```

### Page Configuration

```ts
// src/pages/index/index.config.ts
export default {
  navigationBarTitleText: 'Home Page',
  navigationBarBackgroundColor: '#ffffff'
}
```

## Core Concepts

### Components

Remax provides platform-specific components:

```tsx
import React from 'react'
import { 
  View, 
  Text, 
  Button, 
  Input, 
  Image 
} from 'remax/wechat'

const MyComponent: React.FC = () => {
  return (
    <View>
      <Text>Hello Remax</Text>
      <Button>Click Me</Button>
      <Input placeholder="Enter text" />
      <Image src="/images/logo.png" />
    </View>
  )
}
```

### Hooks

Use React hooks for state management:

```tsx
import React, { useState, useEffect } from 'react'
import { View, Text } from 'remax/wechat'

const HooksExample: React.FC = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch('/api/data')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Text>Loading...</Text>
  }

  return (
    <View>
      <Text>{JSON.stringify(data)}</Text>
    </View>
  )
}
```

### Navigation

Handle navigation between pages:

```tsx
import React from 'react'
import { View, Button, navigateTo, redirectTo } from 'remax/wechat'

const NavigationExample: React.FC = () => {
  const handleNavigate = () => {
    navigateTo({
      url: '/pages/detail/index?id=123'
    })
  }

  const handleRedirect = () => {
    redirectTo({
      url: '/pages/login/index'
    })
  }

  return (
    <View>
      <Button onClick={handleNavigate}>Navigate to Detail</Button>
      <Button onClick={handleRedirect}>Redirect to Login</Button>
    </View>
  )
}
```

## State Management

### Context API

```tsx
// context/AppContext.tsx
import React, { createContext, useContext, useReducer } from 'react'

interface AppState {
  user: any
  theme: string
}

interface AppAction {
  type: string
  payload?: any
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_THEME':
      return { ...state, theme: action.payload }
    default:
      return state
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, {
    user: null,
    theme: 'light'
  })

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
```

### Using Context

```tsx
// app.tsx
import React from 'react'
import { AppProvider } from './context/AppContext'

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AppProvider>
      {children}
    </AppProvider>
  )
}

export default App
```

## Styling

### CSS Modules

```tsx
// styles/index.module.css
.container {
  padding: 20px;
  background-color: #f5f5f5;
}

.title {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}
```

```tsx
// components/MyComponent.tsx
import React from 'react'
import { View, Text } from 'remax/wechat'
import styles from './index.module.css'

const MyComponent: React.FC = () => {
  return (
    <View className={styles.container}>
      <Text className={styles.title}>Styled Component</Text>
    </View>
  )
}
```

### Styled Components

```tsx
import React from 'react'
import styled from 'styled-components'
import { View, Text } from 'remax/wechat'

const Container = styled(View)`
  padding: 20px;
  background-color: #f5f5f5;
`

const Title = styled(Text)`
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
`

const StyledComponent: React.FC = () => {
  return (
    <Container>
      <Title>Styled with styled-components</Title>
    </Container>
  )
}
```

## API Usage

### Platform APIs

```tsx
import React from 'react'
import { 
  View, 
  Button, 
  showToast, 
  request,
  getStorage,
  setStorage 
} from 'remax/wechat'

const APIExample: React.FC = () => {
  const handleShowToast = () => {
    showToast({
      title: 'Success!',
      icon: 'success'
    })
  }

  const handleRequest = async () => {
    try {
      const response = await request({
        url: 'https://api.example.com/data',
        method: 'GET'
      })
      console.log(response.data)
    } catch (error) {
      console.error('Request failed:', error)
    }
  }

  const handleStorage = async () => {
    // Set storage
    await setStorage({
      key: 'user',
      data: { name: 'John', age: 25 }
    })

    // Get storage
    const result = await getStorage({ key: 'user' })
    console.log(result.data)
  }

  return (
    <View>
      <Button onClick={handleShowToast}>Show Toast</Button>
      <Button onClick={handleRequest}>Make Request</Button>
      <Button onClick={handleStorage}>Test Storage</Button>
    </View>
  )
}
```

## Configuration

### Remax Configuration

```javascript
// remax.config.js
module.exports = {
  one: true,
  output: 'dist',
  plugins: [
    // Add plugins here
  ],
  configWebpack({ config }) {
    // Customize webpack config
    return config
  }
}
```

### App Configuration

```ts
// src/app.config.ts
export default {
  pages: [
    'pages/index/index',
    'pages/detail/index'
  ],
  window: {
    navigationBarTitleText: 'Remax App',
    navigationBarBackgroundColor: '#ffffff'
  },
  tabBar: {
    list: [
      {
        pagePath: 'pages/index/index',
        text: 'Home'
      }
    ]
  }
}
```

## Testing

### Unit Testing

```tsx
// __tests__/components/MyComponent.test.tsx
import React from 'react'
import { render } from '@testing-library/react'
import MyComponent from '../src/components/MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />)
    expect(getByText('Hello Remax')).toBeInTheDocument()
  })
})
```

## Best Practices

### Performance Optimization
- Use React.memo for component optimization
- Implement proper key props for lists
- Avoid unnecessary re-renders
- Use lazy loading for large components

### Code Organization
- Follow React best practices
- Use TypeScript for type safety
- Implement proper error boundaries
- Write comprehensive tests

### Platform Considerations
- Handle platform-specific features
- Test on target platforms
- Use platform-specific components when needed
- Follow mini-program guidelines

## Deployment

### Build Process

```bash
# Build for production
npm run build

# Build for specific platform
npm run build:wechat
npm run build:alipay
```

### Publishing
1. Build the project for target platform
2. Upload to respective mini-program platform
3. Submit for review and approval
4. Publish to users

## Resources

- [Official Documentation](https://remaxjs.org/)
- [GitHub Repository](https://github.com/remaxjs/remax)
- [Examples](https://github.com/remaxjs/examples)
- [Community](https://github.com/remaxjs/remax/discussions)

## Conclusion

Remax provides a powerful way to build mini-programs using React. It combines the familiar React development experience with the capabilities of mini-program platforms, making it an excellent choice for React developers entering the mini-program ecosystem.