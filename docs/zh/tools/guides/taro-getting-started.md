# Taro 快速入门指南

Taro 是一个开放式跨端跨框架解决方案，支持使用 React/Vue/Nerv 等框架来开发微信/京东/百度/支付宝/字节跳动/QQ 小程序/H5/React Native 等应用。

## 什么是 Taro

Taro 是由京东凹凸实验室开源的多端统一开发框架，遵循 React 语法规范，支持一套代码运行在多个平台。

### 核心特性

- **多端支持**：一套代码多端运行，支持小程序、H5、React Native等
- **语法统一**：使用 React/Vue 语法，学习成本低
- **组件化开发**：支持组件化开发模式
- **TypeScript支持**：完整的 TypeScript 支持
- **丰富的生态**：提供丰富的组件库和插件

### 支持平台

- 微信小程序
- 支付宝小程序
- 百度智能小程序
- 字节跳动小程序
- QQ 小程序
- 京东小程序
- H5
- React Native
- 快应用

## 环境准备

### 系统要求

- Node.js 版本 >= 12.0.0
- npm 或 yarn 包管理器
- 对应平台的开发工具（如微信开发者工具）

### 安装 Taro CLI

```bash
# 使用 npm 安装
npm install -g @tarojs/cli

# 使用 yarn 安装
yarn global add @tarojs/cli

# 验证安装
taro --version
```

## 创建项目

### 初始化项目

```bash
# 创建新项目
taro init myApp

# 进入项目目录
cd myApp

# 安装依赖
npm install
```

### 项目配置选择

在初始化过程中，需要选择：

1. **框架选择**：React / Vue / Vue3
2. **TypeScript**：是否使用 TypeScript
3. **CSS 预处理器**：Sass / Less / Stylus
4. **模板选择**：默认模板 / 自定义模板

### 项目结构

```
myApp/
├── dist/                   # 编译结果目录
├── config/                 # 配置目录
│   ├── dev.js             # 开发环境配置
│   ├── prod.js            # 生产环境配置
│   └── index.js           # 默认配置
├── src/                    # 源码目录
│   ├── pages/             # 页面文件目录
│   ├── components/        # 组件文件目录
│   ├── utils/             # 工具函数目录
│   ├── app.config.js      # 全局配置
│   ├── app.js             # 项目入口文件
│   └── app.scss           # 全局样式
├── package.json
└── project.config.json    # 小程序项目配置
```

## 基础开发

### 页面开发

#### 创建页面

```bash
# 使用 CLI 创建页面
taro create --name index --page
```

#### 页面组件示例

```jsx
// src/pages/index/index.jsx
import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import './index.scss'

export default class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      title: 'Hello Taro!'
    }
  }

  componentDidMount() {
    console.log('页面加载完成')
  }

  handleClick = () => {
    this.setState({
      title: '点击了按钮'
    })
  }

  render() {
    const { title } = this.state
    
    return (
      <View className='index'>
        <Text className='title'>{title}</Text>
        <Button onClick={this.handleClick}>点击我</Button>
        <AtButton type='primary'>Taro UI 按钮</AtButton>
      </View>
    )
  }
}
```

#### 页面配置

```js
// src/pages/index/index.config.js
export default {
  navigationBarTitleText: '首页',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
  backgroundColor: '#f8f8f8'
}
```

### 组件开发

#### 创建组件

```bash
# 创建组件
taro create --name MyComponent --component
```

#### 组件示例

```jsx
// src/components/MyComponent/index.jsx
import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import PropTypes from 'prop-types'
import './index.scss'

export default class MyComponent extends Component {
  static propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func
  }

  static defaultProps = {
    title: '默认标题'
  }

  render() {
    const { title, onClick } = this.props
    
    return (
      <View className='my-component' onClick={onClick}>
        <Text>{title}</Text>
      </View>
    )
  }
}
```

### 路由导航

#### 页面跳转

```jsx
import Taro from '@tarojs/taro'

// 跳转到新页面
Taro.navigateTo({
  url: '/pages/detail/index?id=123'
})

// 重定向
Taro.redirectTo({
  url: '/pages/login/index'
})

// 返回上一页
Taro.navigateBack({
  delta: 1
})

// 切换 Tab
Taro.switchTab({
  url: '/pages/index/index'
})
```

#### 获取路由参数

```jsx
// 在页面组件中获取参数
componentDidMount() {
  // 获取路由参数
  const { id } = this.$router.params
  console.log('页面参数:', id)
}
```

## 状态管理

### 使用 Redux

#### 安装依赖

```bash
npm install redux react-redux redux-thunk
```

#### 配置 Store

```js
// src/store/index.js
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
)

export default store
```

#### 创建 Reducer

```js
// src/store/reducers/counter.js
const initialState = {
  count: 0
}

export default function counter(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state
  }
}
```

#### 在组件中使用

```jsx
import { Component } from 'react'
import { connect } from 'react-redux'
import { View, Text, Button } from '@tarojs/components'

@connect(
  state => ({
    count: state.counter.count
  }),
  dispatch => ({
    increment: () => dispatch({ type: 'INCREMENT' }),
    decrement: () => dispatch({ type: 'DECREMENT' })
  })
)
class Counter extends Component {
  render() {
    const { count, increment, decrement } = this.props
    
    return (
      <View>
        <Text>计数: {count}</Text>
        <Button onClick={increment}>+1</Button>
        <Button onClick={decrement}>-1</Button>
      </View>
    )
  }
}

export default Counter
```

## 样式开发

### CSS 预处理器

Taro 支持 Sass、Less、Stylus 等预处理器：

```scss
// src/pages/index/index.scss
.index {
  padding: 20px;
  
  .title {
    font-size: 32px;
    color: #333;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .button {
    width: 200px;
    height: 80px;
    background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
    border-radius: 10px;
    
    &:hover {
      opacity: 0.8;
    }
  }
}
```

### 样式单位转换

Taro 会自动将 px 转换为对应平台的单位：

```scss
.container {
  width: 750px;    // 小程序中转换为 750rpx
  height: 200px;   // H5 中保持 200px
  font-size: 32px; // 根据平台自动转换
}
```

### CSS Modules

```jsx
// 启用 CSS Modules
import styles from './index.module.scss'

export default class Index extends Component {
  render() {
    return (
      <View className={styles.container}>
        <Text className={styles.title}>标题</Text>
      </View>
    )
  }
}
```

## API 使用

### 网络请求

```jsx
import Taro from '@tarojs/taro'

// GET 请求
const getData = async () => {
  try {
    const res = await Taro.request({
      url: 'https://api.example.com/data',
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      }
    })
    console.log('请求成功:', res.data)
  } catch (error) {
    console.error('请求失败:', error)
  }
}

// POST 请求
const postData = async (data) => {
  try {
    const res = await Taro.request({
      url: 'https://api.example.com/submit',
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/json'
      }
    })
    return res.data
  } catch (error) {
    throw error
  }
}
```

### 本地存储

```jsx
import Taro from '@tarojs/taro'

// 存储数据
Taro.setStorageSync('userInfo', {
  name: '张三',
  age: 25
})

// 获取数据
const userInfo = Taro.getStorageSync('userInfo')

// 异步操作
const saveData = async () => {
  try {
    await Taro.setStorage({
      key: 'token',
      data: 'abc123'
    })
  } catch (error) {
    console.error('存储失败:', error)
  }
}
```

### 设备信息

```jsx
import Taro from '@tarojs/taro'

// 获取系统信息
const getSystemInfo = async () => {
  try {
    const res = await Taro.getSystemInfo()
    console.log('系统信息:', res)
    // { platform, system, version, screenWidth, screenHeight, ... }
  } catch (error) {
    console.error('获取系统信息失败:', error)
  }
}

// 获取位置信息
const getLocation = async () => {
  try {
    const res = await Taro.getLocation({
      type: 'gcj02'
    })
    console.log('位置信息:', res)
    // { latitude, longitude, speed, accuracy, ... }
  } catch (error) {
    console.error('获取位置失败:', error)
  }
}
```

## 编译与部署

### 开发环境

```bash
# 微信小程序
npm run dev:weapp

# 支付宝小程序
npm run dev:alipay

# 百度小程序
npm run dev:swan

# 字节跳动小程序
npm run dev:tt

# QQ 小程序
npm run dev:qq

# H5
npm run dev:h5

# React Native
npm run dev:rn
```

### 生产环境

```bash
# 构建微信小程序
npm run build:weapp

# 构建 H5
npm run build:h5

# 构建其他平台
npm run build:alipay
npm run build:swan
npm run build:tt
```

### 配置优化

#### 开发环境配置

```js
// config/dev.js
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
    API_BASE_URL: '"https://dev-api.example.com"'
  },
  mini: {
    debugReact: true
  },
  h5: {
    devServer: {
      port: 10086,
      host: 'localhost'
    }
  }
}
```

#### 生产环境配置

```js
// config/prod.js
module.exports = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    API_BASE_URL: '"https://api.example.com"'
  },
  mini: {
    optimizeMainPackage: {
      enable: true
    }
  },
  h5: {
    publicPath: '/static/',
    staticDirectory: 'static'
  }
}
```

## 性能优化

### 代码分割

```jsx
// 使用动态导入实现代码分割
import { lazy } from 'react'

const LazyComponent = lazy(() => import('./LazyComponent'))

export default class App extends Component {
  render() {
    return (
      <View>
        <LazyComponent />
      </View>
    )
  }
}
```

### 图片优化

```jsx
// 使用 Taro 的图片组件
import { Image } from '@tarojs/components'

<Image
  src='https://example.com/image.jpg'
  mode='aspectFit'
  lazyLoad
  onLoad={this.handleImageLoad}
  onError={this.handleImageError}
/>
```

### 列表优化

```jsx
// 使用虚拟列表优化长列表性能
import { VirtualList } from '@tarojs/components'

const Row = ({ index, data }) => {
  return (
    <View className='row'>
      {data[index].title}
    </View>
  )
}

<VirtualList
  height={500}
  itemCount={1000}
  itemSize={50}
  itemData={listData}
>
  {Row}
</VirtualList>
```

## 调试技巧

### 开发者工具调试

1. **Console 调试**：使用 console.log 输出调试信息
2. **断点调试**：在开发者工具中设置断点
3. **网络监控**：查看网络请求和响应
4. **性能分析**：使用性能面板分析性能问题

### 真机调试

```bash
# 启动真机调试
npm run dev:weapp

# 在微信开发者工具中开启真机调试
# 使用手机微信扫码进行真机测试
```

### 日志调试

```jsx
// 使用 Taro 的日志系统
import Taro from '@tarojs/taro'

// 不同级别的日志
console.log('普通日志')
console.info('信息日志')
console.warn('警告日志')
console.error('错误日志')

// 在小程序中查看日志
Taro.getLogManager().info('自定义日志', { data: 'test' })
```

## 常见问题

### 编译问题

#### 依赖安装失败
```bash
# 清除缓存重新安装
rm -rf node_modules
rm package-lock.json
npm install
```

#### 编译报错
1. 检查语法错误
2. 确认依赖版本兼容性
3. 查看 Taro 版本更新日志
4. 重启开发服务器

### 平台兼容性

#### API 兼容性处理
```jsx
import Taro from '@tarojs/taro'

// 检查 API 是否支持
if (Taro.canIUse('getLocation')) {
  Taro.getLocation({
    success: (res) => {
      console.log(res)
    }
  })
} else {
  console.log('当前平台不支持获取位置')
}
```

#### 样式兼容性
```scss
// 使用平台特定样式
.container {
  /* #ifdef H5 */
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
  /* #endif */
  
  /* #ifdef MP-WEIXIN */
  background: #ff6b6b;
  /* #endif */
}
```

## 最佳实践

### 项目结构规范

```
src/
├── components/        # 公共组件
│   ├── common/       # 通用组件
│   └── business/     # 业务组件
├── pages/            # 页面
├── utils/            # 工具函数
├── services/         # API 服务
├── store/            # 状态管理
├── styles/           # 全局样式
└── constants/        # 常量定义
```

### 代码规范

1. **命名规范**：使用驼峰命名法
2. **组件规范**：每个组件一个文件夹
3. **样式规范**：使用 BEM 命名方式
4. **注释规范**：添加必要的注释说明

### 性能优化建议

1. **按需加载**：使用动态导入减少初始包大小
2. **图片优化**：使用合适的图片格式和尺寸
3. **缓存策略**：合理使用本地存储和缓存
4. **代码分割**：将大型组件拆分为小组件

## 扩展资源

### 官方资源
- [Taro 官方文档](https://taro-docs.jd.com/)
- [Taro GitHub](https://github.com/NervJS/taro)
- [Taro UI 组件库](https://taro-ui.jd.com/)

### 社区资源
- Taro 官方论坛
- 掘金 Taro 专栏
- GitHub 优秀项目
- 技术博客和教程

通过本指南，你应该能够快速上手 Taro 开发，并掌握多端开发的核心技能。Taro 的强大之处在于一套代码多端运行，大大提高了开发效率。