# uni-app 快速入门指南

uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到iOS、Android、Web（响应式）、以及各种小程序（微信/支付宝/百度/头条/飞书/QQ/快手/钉钉/淘宝）、快应用等多个平台。

## 什么是 uni-app

uni-app 是 DCloud 推出的跨平台应用开发框架，基于 Vue.js 语法，支持一套代码编译到多个平台。

### 核心特性

- **跨平台支持**：一套代码，多端发布
- **Vue.js 语法**：使用熟悉的 Vue.js 开发语法
- **丰富的组件**：内置丰富的跨平台组件
- **完整的生态**：插件市场、云服务、统计分析等
- **原生性能**：接近原生应用的性能表现

### 支持平台

- **App端**：iOS、Android（基于 5+ App 或 HBuilderX）
- **小程序**：微信、支付宝、百度、字节跳动、QQ、快手等
- **H5端**：现代浏览器、微信内置浏览器
- **快应用**：华为、小米、OPPO、vivo等厂商快应用

## 开发环境搭建

### 方式一：HBuilderX 可视化开发

#### 下载安装 HBuilderX

1. 访问 [HBuilderX 官网](https://www.dcloud.io/hbuilderx.html)
2. 下载对应操作系统版本
3. 解压即可使用（绿色软件）

#### 创建项目

1. 点击工具栏的文件 -> 新建 -> 项目
2. 选择 uni-app 类型
3. 输入项目名称和存储路径
4. 选择模板（默认模板或其他模板）

### 方式二：Vue CLI 命令行

#### 安装 Vue CLI

```bash
npm install -g @vue/cli
```

#### 创建项目

```bash
# 创建 uni-app 项目
vue create -p dcloudio/uni-preset-vue my-project

# 进入项目目录
cd my-project

# 安装依赖
npm install
```

### 项目结构

```
my-project/
├── pages/              # 页面文件
│   ├── index/         # 首页
│   └── list/          # 列表页
├── components/         # 组件文件
├── static/            # 静态资源
├── common/            # 公共文件
├── store/             # 状态管理
├── utils/             # 工具函数
├── App.vue            # 应用配置
├── main.js            # 入口文件
├── manifest.json      # 应用配置
├── pages.json         # 页面路由配置
└── uni.scss           # 全局样式变量
```

## 基础开发

### 页面开发

#### 创建页面

在 `pages.json` 中配置页面路由：

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/list/list",
      "style": {
        "navigationBarTitleText": "列表"
      }
    }
  ]
}
```

#### 页面组件示例

```vue
<!-- pages/index/index.vue -->
<template>
  <view class="container">
    <view class="header">
      <text class="title">{{ title }}</text>
    </view>
    
    <view class="content">
      <button @click="handleClick" type="primary">点击按钮</button>
      <uni-list>
        <uni-list-item 
          v-for="item in list" 
          :key="item.id"
          :title="item.title"
          @click="goToDetail(item)"
        />
      </uni-list>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello uni-app',
      list: [
        { id: 1, title: '列表项1' },
        { id: 2, title: '列表项2' },
        { id: 3, title: '列表项3' }
      ]
    }
  },
  
  onLoad(options) {
    console.log('页面加载', options)
    this.loadData()
  },
  
  onShow() {
    console.log('页面显示')
  },
  
  methods: {
    handleClick() {
      uni.showToast({
        title: '按钮被点击',
        icon: 'success'
      })
    },
    
    loadData() {
      // 加载数据逻辑
      uni.request({
        url: 'https://api.example.com/data',
        success: (res) => {
          this.list = res.data
        }
      })
    },
    
    goToDetail(item) {
      uni.navigateTo({
        url: `/pages/detail/detail?id=${item.id}`
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx;
}

.header {
  text-align: center;
  margin-bottom: 40rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.content {
  padding: 20rpx;
}
</style>
```

### 组件开发

#### 创建自定义组件

```vue
<!-- components/my-component/my-component.vue -->
<template>
  <view class="my-component">
    <view class="header" @click="handleHeaderClick">
      <text class="title">{{ title }}</text>
    </view>
    <view class="content">
      <slot></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'MyComponent',
  
  props: {
    title: {
      type: String,
      default: '默认标题'
    }
  },
  
  methods: {
    handleHeaderClick() {
      this.$emit('header-click', {
        title: this.title
      })
    }
  }
}
</script>

<style scoped>
.my-component {
  border: 1px solid #eee;
  border-radius: 8rpx;
  padding: 20rpx;
}

.header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10rpx;
  margin-bottom: 10rpx;
}

.title {
  font-size: 32rpx;
  font-weight: bold;
}
</style>
```

#### 使用组件

```vue
<template>
  <view>
    <my-component 
      title="自定义标题" 
      @header-click="onHeaderClick"
    >
      <text>这是插槽内容</text>
    </my-component>
  </view>
</template>

<script>
import MyComponent from '@/components/my-component/my-component.vue'

export default {
  components: {
    MyComponent
  },
  
  methods: {
    onHeaderClick(data) {
      console.log('头部被点击', data)
    }
  }
}
</script>
```

### 路由导航

#### 页面跳转

```javascript
// 保留当前页面，跳转到应用内的某个页面
uni.navigateTo({
  url: '/pages/detail/detail?id=123&name=test'
})

// 关闭当前页面，跳转到应用内的某个页面
uni.redirectTo({
  url: '/pages/login/login'
})

// 跳转到 tabBar 页面
uni.switchTab({
  url: '/pages/index/index'
})

// 关闭所有页面，打开到应用内的某个页面
uni.reLaunch({
  url: '/pages/home/home'
})

// 关闭当前页面，返回上一页面或多级页面
uni.navigateBack({
  delta: 1
})
```

#### 获取页面参数

```javascript
export default {
  onLoad(options) {
    console.log('页面参数:', options)
    // options.id = '123'
    // options.name = 'test'
  }
}
```

## 状态管理

### 使用 Vuex

#### 安装 Vuex

```bash
npm install vuex
```

#### 配置 Store

```javascript
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    userInfo: null
  },
  
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    
    DECREMENT(state) {
      state.count--
    },
    
    SET_USER_INFO(state, userInfo) {
      state.userInfo = userInfo
    }
  },
  
  actions: {
    increment({ commit }) {
      commit('INCREMENT')
    },
    
    decrement({ commit }) {
      commit('DECREMENT')
    },
    
    async getUserInfo({ commit }) {
      try {
        const res = await uni.request({
          url: '/api/user/info'
        })
        commit('SET_USER_INFO', res.data)
      } catch (error) {
        console.error('获取用户信息失败:', error)
      }
    }
  },
  
  getters: {
    isLogin: state => !!state.userInfo,
    userName: state => state.userInfo?.name || '未登录'
  }
})

export default store
```

#### 在 main.js 中注册

```javascript
// main.js
import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
```

#### 在组件中使用

```vue
<template>
  <view>
    <text>计数: {{ count }}</text>
    <text>用户: {{ userName }}</text>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['count']),
    ...mapGetters(['userName'])
  },
  
  methods: {
    ...mapActions(['increment', 'decrement', 'getUserInfo'])
  },
  
  onLoad() {
    this.getUserInfo()
  }
}
</script>
```

## 样式开发

### 尺寸单位

uni-app 支持多种尺寸单位：

```css
.container {
  width: 750rpx;    /* rpx: 响应式像素，推荐使用 */
  height: 200px;    /* px: 像素 */
  font-size: 16px;  /* px: 字体大小建议使用px */
}
```

### 样式导入

```vue
<style>
/* 导入外部样式 */
@import url('@/common/style/common.css');

/* 全局样式变量 */
@import '@/uni.scss';

.page {
  background-color: $uni-bg-color;
  color: $uni-text-color;
}
</style>
```

### 条件编译样式

```css
/* 平台特定样式 */
.container {
  /* #ifdef APP-PLUS */
  padding-top: var(--status-bar-height);
  /* #endif */
  
  /* #ifdef H5 */
  max-width: 750px;
  margin: 0 auto;
  /* #endif */
  
  /* #ifdef MP-WEIXIN */
  background-color: #f8f8f8;
  /* #endif */
}
```

## API 使用

### 网络请求

```javascript
// GET 请求
uni.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  header: {
    'Content-Type': 'application/json'
  },
  success: (res) => {
    console.log('请求成功:', res.data)
  },
  fail: (error) => {
    console.error('请求失败:', error)
  }
})

// POST 请求
uni.request({
  url: 'https://api.example.com/submit',
  method: 'POST',
  data: {
    name: '张三',
    age: 25
  },
  success: (res) => {
    console.log('提交成功:', res.data)
  }
})

// Promise 封装
function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success: resolve,
      fail: reject
    })
  })
}

// 使用 async/await
async function getData() {
  try {
    const res = await request({
      url: '/api/data'
    })
    return res.data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}
```

### 本地存储

```javascript
// 同步存储
uni.setStorageSync('userInfo', {
  name: '张三',
  age: 25
})

// 同步获取
const userInfo = uni.getStorageSync('userInfo')

// 异步存储
uni.setStorage({
  key: 'token',
  data: 'abc123',
  success: () => {
    console.log('存储成功')
  }
})

// 异步获取
uni.getStorage({
  key: 'token',
  success: (res) => {
    console.log('获取成功:', res.data)
  }
})

// 删除存储
uni.removeStorageSync('userInfo')

// 清空存储
uni.clearStorageSync()
```

### 设备信息

```javascript
// 获取系统信息
uni.getSystemInfo({
  success: (res) => {
    console.log('系统信息:', res)
    // {
    //   brand: "iPhone",
    //   model: "iPhone 12",
    //   system: "iOS 14.0",
    //   platform: "ios",
    //   screenWidth: 375,
    //   screenHeight: 812,
    //   ...
    // }
  }
})

// 获取位置信息
uni.getLocation({
  type: 'gcj02',
  success: (res) => {
    console.log('位置信息:', res)
    // {
    //   latitude: 39.908823,
    //   longitude: 116.39747,
    //   speed: 0,
    //   accuracy: 5
    // }
  }
})

// 获取网络状态
uni.getNetworkType({
  success: (res) => {
    console.log('网络类型:', res.networkType)
    // wifi, 2g, 3g, 4g, 5g, none, unknown
  }
})
```

### 界面交互

```javascript
// 显示消息提示框
uni.showToast({
  title: '操作成功',
  icon: 'success',
  duration: 2000
})

// 显示模态对话框
uni.showModal({
  title: '提示',
  content: '确定要删除吗？',
  success: (res) => {
    if (res.confirm) {
      console.log('用户点击确定')
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
})

// 显示操作菜单
uni.showActionSheet({
  itemList: ['拍照', '从相册选择'],
  success: (res) => {
    console.log('选中了第' + (res.tapIndex + 1) + '个按钮')
  }
})

// 显示/隐藏 loading
uni.showLoading({
  title: '加载中...'
})

setTimeout(() => {
  uni.hideLoading()
}, 2000)
```

## 编译与发布

### 开发环境运行

#### HBuilderX 方式

1. 在 HBuilderX 中打开项目
2. 点击工具栏的运行按钮
3. 选择运行到对应平台

#### CLI 方式

```bash
# 运行到微信小程序
npm run dev:mp-weixin

# 运行到支付宝小程序
npm run dev:mp-alipay

# 运行到H5
npm run dev:h5

# 运行到App
npm run dev:app-plus
```

### 生产环境构建

```bash
# 构建微信小程序
npm run build:mp-weixin

# 构建H5
npm run build:h5

# 构建App
npm run build:app-plus
```

### 平台配置

#### manifest.json 配置

```json
{
  "name": "my-app",
  "appid": "__UNI__XXXXXX",
  "description": "我的应用",
  "versionName": "1.0.0",
  "versionCode": "100",
  
  "app-plus": {
    "usingComponents": true,
    "nvueStyleCompiler": "uni-app",
    "compilerVersion": 3,
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    }
  },
  
  "h5": {
    "title": "我的应用",
    "template": "index.html",
    "router": {
      "mode": "hash",
      "base": "./"
    }
  },
  
  "mp-weixin": {
    "appid": "wx1234567890",
    "setting": {
      "urlCheck": false,
      "es6": true,
      "minified": true
    },
    "usingComponents": true
  }
}
```

## 性能优化

### 代码优化

#### 条件编译

```javascript
// 平台特定代码
// #ifdef APP-PLUS
console.log('这段代码只在App中运行')
// #endif

// #ifdef H5
console.log('这段代码只在H5中运行')
// #endif

// #ifdef MP-WEIXIN
console.log('这段代码只在微信小程序中运行')
// #endif

// #ifndef H5
console.log('这段代码不在H5中运行')
// #endif
```

#### 分包加载

```json
// pages.json
{
  "pages": [
    {
      "path": "pages/index/index"
    }
  ],
  
  "subPackages": [
    {
      "root": "pages/sub",
      "pages": [
        {
          "path": "detail/detail"
        }
      ]
    }
  ],
  
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["pages/sub"]
    }
  }
}
```

### 图片优化

```vue
<template>
  <view>
    <!-- 使用合适的图片格式 -->
    <image 
      src="/static/images/logo.webp" 
      mode="aspectFit"
      lazy-load
      @load="onImageLoad"
      @error="onImageError"
    />
    
    <!-- 响应式图片 -->
    <image 
      :src="getImageUrl()" 
      mode="widthFix"
    />
  </view>
</template>

<script>
export default {
  methods: {
    getImageUrl() {
      const systemInfo = uni.getSystemInfoSync()
      const pixelRatio = systemInfo.pixelRatio
      
      if (pixelRatio >= 3) {
        return '/static/images/banner@3x.jpg'
      } else if (pixelRatio >= 2) {
        return '/static/images/banner@2x.jpg'
      } else {
        return '/static/images/banner.jpg'
      }
    },
    
    onImageLoad() {
      console.log('图片加载成功')
    },
    
    onImageError() {
      console.log('图片加载失败')
    }
  }
}
</script>
```

### 列表优化

```vue
<template>
  <view>
    <!-- 使用虚拟列表优化长列表 -->
    <recycle-list 
      :list-data="listData"
      :template-key="'type'"
      @scroll="onScroll"
    >
      <template v-slot:type1="{ item }">
        <view class="item">{{ item.title }}</view>
      </template>
    </recycle-list>
  </view>
</template>

<script>
export default {
  data() {
    return {
      listData: [],
      page: 1,
      loading: false
    }
  },
  
  methods: {
    async loadMore() {
      if (this.loading) return
      
      this.loading = true
      try {
        const res = await this.fetchData(this.page)
        this.listData.push(...res.data)
        this.page++
      } catch (error) {
        console.error('加载失败:', error)
      } finally {
        this.loading = false
      }
    },
    
    onScroll(e) {
      // 滚动到底部时加载更多
      const { scrollTop, scrollHeight, clientHeight } = e.detail
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        this.loadMore()
      }
    }
  }
}
</script>
```

## 调试技巧

### 开发者工具调试

1. **Console 调试**：使用 console.log 输出调试信息
2. **断点调试**：在开发者工具中设置断点
3. **网络面板**：查看网络请求和响应
4. **存储面板**：查看本地存储数据

### 真机调试

```javascript
// 在真机上查看日志
console.log('调试信息', data)

// 使用 vconsole 在真机上显示控制台
// #ifdef H5
import VConsole from 'vconsole'
const vConsole = new VConsole()
// #endif
```

### 性能调试

```javascript
// 性能监控
const startTime = Date.now()

// 执行耗时操作
performHeavyTask()

const endTime = Date.now()
console.log('操作耗时:', endTime - startTime, 'ms')

// 内存使用监控
// #ifdef APP-PLUS
const memoryInfo = plus.os.getMemoryInfo()
console.log('内存使用:', memoryInfo)
// #endif
```

## 常见问题

### 编译问题

#### 依赖安装失败
```bash
# 清除缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules
npm install
```

#### 编译报错
1. 检查语法错误
2. 确认 uni-app 版本兼容性
3. 查看官方更新日志
4. 重启 HBuilderX 或开发服务器

### 平台兼容性

#### API 兼容性检查
```javascript
// 检查 API 是否支持
if (uni.canIUse('getLocation')) {
  uni.getLocation({
    success: (res) => {
      console.log(res)
    }
  })
} else {
  console.log('当前平台不支持获取位置')
}
```

#### 样式兼容性
```css
/* 使用条件编译处理样式差异 */
.container {
  /* #ifdef APP-PLUS */
  padding-top: var(--status-bar-height);
  /* #endif */
  
  /* #ifdef H5 */
  max-width: 750px;
  margin: 0 auto;
  /* #endif */
}
```

## 最佳实践

### 项目结构规范

```
src/
├── components/        # 公共组件
├── pages/            # 页面
├── static/           # 静态资源
├── common/           # 公共文件
│   ├── api/         # API 接口
│   ├── utils/       # 工具函数
│   └── style/       # 公共样式
├── store/            # 状态管理
└── mixins/           # 混入
```

### 代码规范

1. **命名规范**：使用驼峰命名法
2. **组件规范**：组件名使用 PascalCase
3. **文件规范**：文件名使用 kebab-case
4. **注释规范**：添加必要的注释说明

### 性能优化建议

1. **合理使用条件编译**：避免无用代码打包
2. **图片优化**：使用合适的图片格式和尺寸
3. **分包加载**：合理拆分代码包
4. **缓存策略**：合理使用本地存储

## 扩展资源

### 官方资源
- [uni-app 官方文档](https://uniapp.dcloud.io/)
- [DCloud 开发者中心](https://dev.dcloud.net.cn/)
- [uni-ui 组件库](https://uniapp.dcloud.io/component/uniui/uni-ui)
- [插件市场](https://ext.dcloud.net.cn/)

### 社区资源
- uni-app 官方论坛
- DCloud 社区
- GitHub 优秀项目
- 技术博客和教程

通过本指南，你应该能够快速上手 uni-app 开发，并掌握跨平台开发的核心技能。uni-app 的优势在于使用 Vue.js 语法和丰富的生态系统，让开发者能够高效地构建跨平台应用。