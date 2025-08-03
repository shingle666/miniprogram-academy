# Getting Started with uni-app

uni-app is a cross-platform framework developed by DCloud that allows developers to build applications for multiple platforms including iOS, Android, Web, and various mini programs (WeChat, Alipay, Baidu, etc.) using a single codebase. This guide will walk you through the process of setting up, developing, and deploying your first uni-app project.

## Introduction to uni-app

### What is uni-app?

uni-app is a framework that uses Vue.js to develop applications that can run on multiple platforms. It follows the "write once, deploy everywhere" philosophy, allowing developers to maintain a single codebase while targeting multiple platforms.

### Key Features

- **Cross-Platform**: Build for iOS, Android, Web, and various mini programs with one codebase
- **Vue-Powered**: Uses Vue.js syntax and components for development
- **Rich Ecosystem**: Access to a vast library of plugins and components
- **Performance Optimized**: Native rendering capabilities for mobile platforms
- **IDE Support**: Dedicated IDE (HBuilderX) with specialized tools and features
- **Hot Reload**: Instant preview of code changes during development
- **Conditional Compilation**: Platform-specific code when needed

### Supported Platforms

uni-app currently supports the following platforms:

- iOS
- Android
- Web (H5)
- WeChat Mini Program
- Alipay Mini Program
- Baidu Smart Program
- ByteDance Mini Program
- QQ Mini Program
- Kuaishou Mini Program
- DingTalk Mini Program
- 360 Mini Program
- Quick App
- Harmony OS (HarmonyOS)

## Installation and Setup

### Method 1: Using HBuilderX (Recommended for Beginners)

HBuilderX is the official IDE for uni-app development, offering specialized tools and features.

1. **Download HBuilderX**:
   - Visit the [official HBuilderX download page](https://www.dcloud.io/hbuilderx.html)
   - Download the appropriate version for your operating system
   - Install HBuilderX following the on-screen instructions

2. **Create a New Project**:
   - Open HBuilderX
   - Click "File" > "New" > "Project"
   - Select "uni-app" as the project type
   - Choose a template (default template is recommended for beginners)
   - Enter a project name and location
   - Click "Create" to generate the project

### Method 2: Using CLI (For Advanced Users)

If you prefer using your own editor and command-line tools:

1. **Install Vue CLI**:
   ```bash
   npm install -g @vue/cli
   ```

2. **Install uni-app CLI Plugin**:
   ```bash
   npm install -g @dcloudio/vue-cli-plugin-uni
   ```

3. **Create a New Project**:
   ```bash
   vue create -p dcloudio/uni-preset-vue my-uni-app
   ```
   
   During the creation process, you'll be prompted to select a template:
   - `hello-uni-app`: A comprehensive demo with multiple examples
   - `uni-ui`: A project with the uni-ui component library
   - `simple`: A minimal template for quick starts

4. **Start Development Server**:
   ```bash
   cd my-uni-app
   npm run dev:h5
   # or for WeChat Mini Program
   npm run dev:mp-weixin
   ```

## Project Structure

A typical uni-app project structure looks like this:

```
my-uni-app/
├── pages/                 # Application pages
│   ├── index/             # Index page
│   │   ├── index.vue      # Page component
│   │   └── index.nvue     # Native rendering page (optional)
├── static/                # Static assets (images, fonts, etc.)
├── components/            # Reusable components
├── store/                 # Vuex store (optional)
├── common/                # Common utilities and styles
│   ├── uni.css            # Common styles
│   └── util.js            # Utility functions
├── App.vue                # App entry component
├── main.js                # App entry script
├── manifest.json          # App configuration
├── pages.json             # Page configuration
└── uni.scss               # Global SCSS variables and mixins
```

### Key Configuration Files

#### pages.json

This file configures the pages, navigation bar, tabs, and other global window elements:

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "Home"
      }
    },
    {
      "path": "pages/user/user",
      "style": {
        "navigationBarTitleText": "User"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/tab-home.png",
        "selectedIconPath": "static/tab-home-active.png",
        "text": "Home"
      },
      {
        "pagePath": "pages/user/user",
        "iconPath": "static/tab-user.png",
        "selectedIconPath": "static/tab-user-active.png",
        "text": "User"
      }
    ]
  }
}
```

#### manifest.json

This file contains application configuration, including app name, appID, version, and platform-specific settings:

```json
{
  "name": "My uni-app",
  "appid": "__UNI__XXXXXXX",
  "description": "My first uni-app project",
  "versionName": "1.0.0",
  "versionCode": "100",
  "transformPx": false,
  "app-plus": {
    "usingComponents": true,
    "nvueCompiler": "uni-app",
    "splashscreen": {
      "alwaysShowBeforeRender": true,
      "waiting": true,
      "autoclose": true,
      "delay": 0
    }
  },
  "mp-weixin": {
    "appid": "wx1234567890",
    "setting": {
      "urlCheck": false
    },
    "usingComponents": true
  },
  "mp-alipay": {
    "usingComponents": true
  },
  "mp-baidu": {
    "usingComponents": true
  },
  "mp-toutiao": {
    "usingComponents": true
  },
  "h5": {
    "router": {
      "base": "/"
    }
  }
}
```

## Development Basics

### Creating Pages

In uni-app, each page is a Vue component. To create a new page:

1. Create a new directory in the `pages` folder (e.g., `pages/about/`)
2. Create a Vue file in this directory (e.g., `about.vue`)
3. Register the page in `pages.json`

Example page component:

```vue
<template>
  <view class="container">
    <text class="title">About Page</text>
    <button @click="navigateBack">Go Back</button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'About Page'
    }
  },
  onLoad() {
    console.log('Page loaded')
  },
  methods: {
    navigateBack() {
      uni.navigateBack()
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
  margin-bottom: 20px;
}
</style>
```

Register the page in pages.json:

```json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "Home"
      }
    },
    {
      "path": "pages/about/about",
      "style": {
        "navigationBarTitleText": "About"
      }
    }
  ]
}
```

### Using Components

uni-app provides a set of built-in components that map to native components on each platform:

```vue
<template>
  <view class="container">
    <text>This is a text component</text>
    <image src="/static/logo.png" mode="aspectFit"></image>
    <button type="primary" @click="showToast">Click Me</button>
  </view>
</template>

<script>
export default {
  methods: {
    showToast() {
      uni.showToast({
        title: 'Button clicked',
        icon: 'success'
      })
    }
  }
}
</script>
```

### Creating Custom Components

To create a reusable component:

1. Create a new file in the `components` directory (e.g., `components/CustomCard.vue`)
2. Define your component using Vue syntax
3. Import and use it in your pages

Example custom component:

```vue
<!-- components/CustomCard.vue -->
<template>
  <view class="card">
    <view class="card-header">
      <text class="card-title">{{ title }}</text>
    </view>
    <view class="card-body">
      <slot></slot>
    </view>
    <view class="card-footer" v-if="showFooter">
      <slot name="footer"></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'CustomCard',
  props: {
    title: {
      type: String,
      default: 'Card Title'
    },
    showFooter: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style>
.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
  overflow: hidden;
}
.card-header {
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
}
.card-title {
  font-size: 16px;
  font-weight: bold;
}
.card-body {
  padding: 15px;
}
.card-footer {
  padding: 10px 15px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
}
</style>
```

Using the custom component:

```vue
<template>
  <view class="container">
    <custom-card title="My Card">
      <text>This is the card content</text>
      <template #footer>
        <button size="mini" type="primary">Action</button>
      </template>
    </custom-card>
  </view>
</template>

<script>
import CustomCard from '@/components/CustomCard.vue'

export default {
  components: {
    CustomCard
  }
}
</script>
```

### Navigation

uni-app provides APIs for navigating between pages:

```js
// Navigate to a page
uni.navigateTo({
  url: '/pages/detail/detail?id=123',
  success: function(res) {
    console.log('Navigation successful')
  },
  fail: function(err) {
    console.error('Navigation failed', err)
  }
})

// Redirect (replace current page)
uni.redirectTo({
  url: '/pages/login/login'
})

// Navigate back
uni.navigateBack({
  delta: 1 // Number of pages to go back
})

// Switch tab
uni.switchTab({
  url: '/pages/home/home'
})
```

### Accessing Page Parameters

To access URL parameters:

```js
export default {
  onLoad(options) {
    // Access the 'id' parameter from the URL
    const id = options.id
    console.log('Received ID:', id)
    
    // Fetch data based on the ID
    this.fetchData(id)
  },
  methods: {
    fetchData(id) {
      // Implementation
    }
  }
}
```

## API Usage

### Network Requests

uni-app provides a unified API for making network requests:

```js
// GET request
uni.request({
  url: 'https://api.example.com/data',
  method: 'GET',
  data: {
    param1: 'value1',
    param2: 'value2'
  },
  header: {
    'content-type': 'application/json'
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

// Using Promise
uni.request({
  url: 'https://api.example.com/data',
  method: 'POST',
  data: {
    name: 'uni-app',
    version: '2.x'
  }
})
  .then(res => console.log(res[1].data))
  .catch(err => console.error(err))
```

### Data Storage

uni-app provides APIs for data persistence:

```js
// Store data
uni.setStorage({
  key: 'userInfo',
  data: {
    name: 'John',
    age: 30,
    token: 'abc123'
  },
  success: function() {
    console.log('Data stored successfully')
  }
})

// Get data
uni.getStorage({
  key: 'userInfo',
  success: function(res) {
    console.log('Retrieved data:', res.data)
  }
})

// Using sync APIs
try {
  uni.setStorageSync('key', 'value')
  const value = uni.getStorageSync('key')
  console.log(value)
} catch (e) {
  console.error(e)
}

// Remove data
uni.removeStorage({
  key: 'userInfo'
})

// Clear all storage
uni.clearStorage()
```

### System Information

Get device and system information:

```js
// Get system info
uni.getSystemInfo({
  success: (res) => {
    console.log('System info:', res)
    console.log('Platform:', res.platform)
    console.log('Screen width:', res.screenWidth)
    console.log('Screen height:', res.screenHeight)
    console.log('Window width:', res.windowWidth)
    console.log('Window height:', res.windowHeight)
    console.log('Status bar height:', res.statusBarHeight)
    console.log('Language:', res.language)
    console.log('System version:', res.system)
    console.log('Platform version:', res.version)
    console.log('Device brand:', res.brand)
    console.log('Device model:', res.model)
    console.log('Device orientation:', res.deviceOrientation)
    console.log('Device pixel ratio:', res.pixelRatio)
  }
})

// Get network type
uni.getNetworkType({
  success: (res) => {
    console.log('Network type:', res.networkType)
  }
})
```

## UI Components and Styling

### Built-in Components

uni-app provides a rich set of built-in components:

```vue
<template>
  <view class="container">
    <!-- Basic components -->
    <view class="box">View component (similar to div)</view>
    <text class="text">Text component</text>
    <button type="primary">Button</button>
    <image src="/static/logo.png" mode="aspectFit"></image>
    
    <!-- Form components -->
    <input type="text" v-model="inputValue" placeholder="Input component" />
    <textarea v-model="textareaValue" placeholder="Textarea component"></textarea>
    <switch :checked="switchValue" @change="onSwitchChange" />
    <checkbox-group @change="onCheckboxChange">
      <checkbox value="option1" :checked="checkboxValues.includes('option1')" />
      <checkbox value="option2" :checked="checkboxValues.includes('option2')" />
    </checkbox-group>
    
    <!-- Media components -->
    <video src="https://example.com/video.mp4" controls></video>
    <audio src="https://example.com/audio.mp3" controls></audio>
    
    <!-- Container components -->
    <scroll-view scroll-y style="height: 200px;">
      <view v-for="(item, index) in scrollItems" :key="index" class="scroll-item">
        {{ item }}
      </view>
    </scroll-view>
    
    <swiper indicator-dots autoplay :interval="3000" :duration="500">
      <swiper-item v-for="(item, index) in swiperItems" :key="index">
        <view class="swiper-item">{{ item }}</view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
      textareaValue: '',
      switchValue: false,
      checkboxValues: ['option1'],
      scrollItems: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
      swiperItems: ['Slide 1', 'Slide 2', 'Slide 3']
    }
  },
  methods: {
    onSwitchChange(e) {
      this.switchValue = e.detail.value
    },
    onCheckboxChange(e) {
      this.checkboxValues = e.detail.value
    }
  }
}
</script>
```

### Styling with CSS

uni-app supports various CSS features:

```vue
<style>
/* Global styles */
.container {
  padding: 20px;
}

/* Box model */
.box {
  width: 100%;
  height: 80px;
  margin: 10px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* Typography */
.text {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  line-height: 1.5;
}

/* Flexbox layout */
.flex-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.flex-item {
  flex: 1;
  text-align: center;
}

/* Grid layout */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

/* Media queries */
@media screen and (min-width: 480px) {
  .container {
    padding: 30px;
  }
}
</style>
```

### Using SCSS/SASS

uni-app supports SCSS/SASS preprocessing:

```vue
<style lang="scss">
$primary-color: #007aff;
$secondary-color: #6c757d;
$border-radius: 5px;

.container {
  padding: 20px;
  
  .header {
    margin-bottom: 20px;
    
    .title {
      font-size: 20px;
      color: $primary-color;
    }
    
    .subtitle {
      font-size: 16px;
      color: $secondary-color;
    }
  }
  
  .button {
    background-color: $primary-color;
    color: white;
    border-radius: $border-radius;
    padding: 10px 15px;
    
    &:active {
      opacity: 0.8;
    }
    
    &.secondary {
      background-color: $secondary-color;
    }
  }
}
</style>
```

### Using uni-ui Component Library

uni-ui is a UI component library specifically designed for uni-app:

1. Install uni-ui:
   ```bash
   npm install @dcloudio/uni-ui
   ```

2. Configure easycom in `pages.json`:
   ```json
   {
     "easycom": {
       "autoscan": true,
       "custom": {
         "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue"
       }
     }
   }
   ```

3. Use uni-ui components:
   ```vue
   <template>
     <view class="container">
       <uni-card title="Card Title" sub-title="Card Subtitle" extra="Extra Info">
         <text>Card Content</text>
       </uni-card>
       
       <uni-section title="Form Components" type="line">
         <uni-forms>
           <uni-forms-item label="Name">
             <uni-easyinput v-model="formData.name" placeholder="Enter your name" />
           </uni-forms-item>
           <uni-forms-item label="Email">
             <uni-easyinput v-model="formData.email" placeholder="Enter your email" />
           </uni-forms-item>
         </uni-forms>
       </uni-section>
       
       <uni-section title="Data Display" type="line">
         <uni-list>
           <uni-list-item title="Item 1" note="Description for item 1" />
           <uni-list-item title="Item 2" note="Description for item 2" />
           <uni-list-item title="Item 3" note="Description for item 3" />
         </uni-list>
       </uni-section>
       
       <uni-pagination :total="50" :current="currentPage" @change="onPageChange" />
     </view>
   </template>

   <script>
   export default {
     data() {
       return {
         formData: {
           name: '',
           email: ''
         },
         currentPage: 1
       }
     },
     methods: {
       onPageChange(e) {
         this.currentPage = e.current
       }
     }
   }
   </script>
   ```

## State Management

### Using Vuex

1. Create a Vuex store:

```js
// store/index.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
    user: null,
    products: []
  },
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    DECREMENT(state) {
      state.count--
    },
    SET_USER(state, user) {
      state.user = user
    },
    SET_PRODUCTS(state, products) {
      state.products = products
    }
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT')
    },
    decrement({ commit }) {
      commit('DECREMENT')
    },
    login({ commit }, userData) {
      // Perform login API call
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'https://api.example.com/login',
          method: 'POST',
          data: userData,
          success: (res) => {
            commit('SET_USER', res.data.user)
            resolve(res.data)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },
    fetchProducts({ commit }) {
      return new Promise((resolve, reject) => {
        uni.request({
          url: 'https://api.example.com/products',
          method: 'GET',
          success: (res) => {
            commit('SET_PRODUCTS', res.data)
            resolve(res.data)
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    }
  },
  getters: {
    doubleCount: state => state.count * 2,
    isLoggedIn: state => !!state.user,
    username: state => state.user ? state.user.name : 'Guest'
  }
})

export default store
```

2. Register the store in `main.js`:

```js
// main.js
import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
```

3. Use the store in components:

```vue
<template>
  <view class="container">
    <view class="counter">
      <button @click="decrement">-</button>
      <text>{{ count }}</text>
      <button @click="increment">+</button>
    </view>
    <view class="double">Double: {{ doubleCount }}</view>
    
    <view class="user-info">
      <text>Welcome, {{ username }}</text>
      <button v-if="!isLoggedIn" @click="login">Login</button>
      <button v-else @click="logout">Logout</button>
    </view>
    
    <view class="products">
      <text class="section-title">Products</text>
      <button @click="loadProducts">Load Products</button>
      <view v-for="(product, index) in products" :key="index" class="product-item">
        <text>{{ product.name }} - ${{ product.price }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState(['count', 'user', 'products']),
    ...mapGetters(['doubleCount', 'isLoggedIn', 'username'])
  },
  methods: {
    ...mapActions(['increment', 'decrement', 'login', 'fetchProducts']),
    logout() {
      this.$store.commit('SET_USER', null)
    },
    loadProducts() {
      this.fetchProducts()
        .then(() => {
          uni.showToast({
            title: 'Products loaded',
            icon: 'success'
          })
        })
        .catch(err => {
          uni.showToast({
            title: 'Failed to load products',
            icon: 'none'
          })
        })
    }
  }
}
</script>
```

## Building and Deployment

### Building for Different Platforms

#### Using HBuilderX

1. Open your project in HBuilderX
2. Click "Run" > "Run to [Platform]" where [Platform] is your target platform
3. Follow the platform-specific instructions

#### Using CLI

```bash
# Build for H5
npm run build:h5

# Build for WeChat Mini Program
npm run build:mp-weixin

# Build for App (Android/iOS)
npm run build:app-plus

# Build for Alipay Mini Program
npm run build:mp-alipay

# Build for Baidu Smart Program
npm run build:mp-baidu

# Build for ByteDance Mini Program
npm run build:mp-toutiao
```

### Platform-Specific Deployment

#### WeChat Mini Program

1. Build the project for WeChat Mini Program
2. Open WeChat Developer Tools
3. Import the project from the `dist/dev/mp-weixin` or `dist/build/mp-weixin` directory
4. Test the mini program in the simulator
5. Upload to WeChat for review and publication

#### H5 (Web)

1. Build the project for H5
2. Deploy the contents of the `dist/dev/h5` or `dist/build/h5` directory to your web server
3. Configure your web server properly (e.g., set up proper MIME types, enable compression)

#### Native App (Android/iOS)

1. Build the project for App
2. Open the project in HBuilderX
3. Click "Tools" > "App Package" > "Cloud Package" or "Local Package"
4. Follow the packaging instructions
5. Submit the generated APK/IPA to app stores

## Advanced Topics

### Conditional Compilation

uni-app supports conditional compilation to handle platform-specific code:

```js
// Platform-specific code using preprocessor directives
const platform = 'unknown';

// #ifdef APP-PLUS
platform = 'App';
// #endif

// #ifdef H5
platform = 'H5';
// #endif

// #ifdef MP-WEIXIN
platform = 'WeChat Mini Program';
// #endif

// #ifdef MP-ALIPAY
platform = 'Alipay Mini Program';
// #endif

console.log(`Current platform: ${platform}`);
```

You can also use conditional compilation in templates and styles:

```vue
<template>
  <view class="container">
    <!-- Common content for all platforms -->
    <text>This appears on all platforms</text>
    
    <!-- Platform-specific content -->
    <!-- #ifdef APP-PLUS -->
    <text>This appears only in the App</text>
    <!-- #endif -->
    
    <!-- #ifdef H5 -->
    <text>This appears only in H5</text>
    <!-- #endif -->
    
    <!-- #ifdef MP-WEIXIN -->
    <text>This appears only in WeChat Mini Program</text>
    <!-- #endif -->
  </view>
</template>

<style>
/* Common styles */
.container {
  padding: 20px;
}

/* Platform-specific styles */
/* #ifdef APP-PLUS */
.container {
  background-color: #f8f8f8;
}
/* #endif */

/* #ifdef H5 */
.container {
  background-color: #ffffff;
}
/* #endif */
</style>
```

### Native Development

For performance-critical features, uni-app supports native development using nvue:

1. Create an nvue file (e.g., `pages/native/native.nvue`)
2. Use weex components and APIs for native rendering

```vue
<template>
  <div class="container">
    <text class="title">Native Page</text>
    <div class="list">
      <div v-for="(item, index) in items" :key="index" class="list-item">
        <text class="item-text">{{ item }}</text>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']
    }
  },
  created() {
    // Native page lifecycle
    console.log('Native page created')
  },
  methods: {
    // Methods
  }
}
</script>

<style>
/* Note: nvue only supports a subset of CSS */
.container {
  flex: 1;
  padding: 20px;
  background-color: #f8f8f8;
}

.title {
  font-size: 20px;
  margin-bottom: 20px;
}

.list {
  flex: 1;
}

.list-item {
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: #eeeeee;
}

.item-text {
  font-size: 16px;
}
</style>
```

## Best Practices

### Performance Optimization

1. **Use `v-if` and `v-show` appropriately**:
   - Use `v-if` when the condition rarely changes
   - Use `v-show` when the element toggles frequently

2. **Optimize list rendering**:
   - Always use `:key` with `v-for`
   - Avoid complex operations in `v-for` loops
   - Consider using virtual lists for long lists

3. **Lazy loading**:
   - Load images only when they enter the viewport
   - Use `uni.preloadPage()` to preload pages that will likely be visited

4. **Reduce unnecessary re-renders**:
   - Use computed properties for derived data
   - Avoid deep watchers when possible
   - Use functional components for simple UI elements

5. **Optimize startup time**:
   - Minimize the size of the main bundle
   - Defer non-critical component loading
   - Use code splitting for large features

### Security Best Practices

1. **Data validation**:
   - Always validate user input on both client and server
   - Use parameterized queries to prevent SQL injection
   - Sanitize HTML content to prevent XSS attacks

2. **Secure storage**:
   - Don't store sensitive information in local storage
   - Encrypt sensitive data before storing
   - Use secure HTTP-only cookies for authentication tokens

3. **API security**:
   - Use HTTPS for all API requests
   - Implement proper authentication and authorization
   - Set appropriate CORS headers

4. **Code protection**:
   - Obfuscate your code for production builds
   - Use source maps only in development
   - Implement app integrity checks

### Project Organization

1. **Directory structure**:
   ```
   my-uni-app/
   ├── api/                  # API services
   │   ├── user.js           # User-related API calls
   │   └── product.js        # Product-related API calls
   ├── components/           # Reusable components
   │   ├── common/           # Common UI components
   │   └── business/         # Business-specific components
   ├── pages/                # Application pages
   ├── static/               # Static assets
   ├── store/                # Vuex store modules
   ├── utils/                # Utility functions
   │   ├── request.js        # HTTP request wrapper
   │   └── validation.js     # Form validation helpers
   └── config/               # Configuration files
       ├── env.js            # Environment variables
       └── constants.js      # Application constants
   ```

2. **Naming conventions**:
   - Use PascalCase for component names
   - Use kebab-case for file names
   - Use camelCase for variables and functions
   - Use UPPER_SNAKE_CASE for constants

3. **Code splitting**:
   - Split large components into smaller ones
   - Use dynamic imports for code splitting
   - Create separate modules for different features

## Troubleshooting

### Common Issues and Solutions

1. **White screen on startup**:
   - Check for JavaScript errors in the console
   - Verify that all required permissions are granted
   - Check for infinite loops or blocking operations

2. **Styling inconsistencies across platforms**:
   - Use platform-specific styles with conditional compilation
   - Test on all target platforms regularly
   - Use relative units (rpx) instead of absolute units

3. **Network request failures**:
   - Check network connectivity
   - Verify API endpoints and parameters
   - Check for CORS issues in H5 mode
   - Add proper error handling

4. **Performance issues**:
   - Use the Vue DevTools to identify bottlenecks
   - Optimize rendering with `v-once` for static content
   - Reduce unnecessary component nesting
   - Use native components (nvue) for performance-critical screens

### Debugging Techniques

1. **Console logging**:
   ```js
   console.log('Debug info:', variable)
   console.error('Error occurred:', error)
   ```

2. **Using the debugger statement**:
   ```js
   function problematicFunction() {
     debugger; // Execution will pause here when dev tools are open
     // Rest of the function
   }
   ```

3. **Platform-specific debugging**:
   - WeChat DevTools for WeChat Mini Program
   - Chrome DevTools for H5
   - HBuilderX debugging for App

4. **Remote debugging**:
   - Enable remote debugging in HBuilderX
   - Connect to the device using the provided URL
   - Use the network inspector to monitor requests

## Resources and Community

### Official Resources

- [uni-app Official Website](https://uniapp.dcloud.io/)
- [uni-app GitHub Repository](https://github.com/dcloudio/uni-app)
- [uni-app API Documentation](https://uniapp.dcloud.io/api/)
- [uni-app Component Documentation](https://uniapp.dcloud.io/component/)

### Community Resources

- [DCloud Developer Community](https://ask.dcloud.net.cn/)
- [uni-app Examples](https://github.com/dcloudio/uni-app/tree/master/examples)
- [awesome-uni-app](https://github.com/aben1188/awesome-uni-app)

### Learning Resources

- [uni-app Video Tutorials](https://learning.dcloud.io/#/)
- [uni-app Course on Udemy](https://www.udemy.com/course/uni-app-development/)
- [uni-app Development Guide](https://uniapp.dcloud.io/resource)

## Next Steps

Now that you're familiar with uni-app, you might want to explore:

- [WeChat Developer Tools](./wechat-devtools.md) for testing your mini programs
- [Mini Program CI/CD](./miniprogram-cicd.md) for automated deployment
- [Cloud Development](./cloud-development.md) for serverless backend solutions
- [Performance Optimization](./performance-optimization.md) for advanced optimization techniques
