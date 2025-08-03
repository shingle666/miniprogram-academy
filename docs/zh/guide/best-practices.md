# 小程序开发最佳实践

本章汇总了小程序开发中的最佳实践，涵盖代码规范、架构设计、性能优化、用户体验等各个方面，帮助开发者构建高质量的小程序应用。

## 代码规范

良好的代码规范可以提高代码的可读性、可维护性，减少错误，并使团队协作更加顺畅。

### 命名规范

#### 文件命名

- **页面文件**：使用 kebab-case（短横线命名法）
  ```
  pages/user-profile/user-profile.js
  pages/order-list/order-list.js
  pages/product-detail/product-detail.js
  ```

- **组件文件**：使用 kebab-case
  ```
  components/custom-button/custom-button.js
  components/image-picker/image-picker.js
  components/loading-spinner/loading-spinner.js
  ```

- **工具文件**：使用 kebab-case
  ```
  utils/date-formatter.js
  utils/request-handler.js
  utils/storage-manager.js
  ```

#### 变量命名

- **普通变量**：使用 camelCase（驼峰命名法）
  ```javascript
  const userName = 'John'
  const userAge = 25
  const isLoggedIn = true
  ```

- **常量**：使用 UPPER_SNAKE_CASE（大写下划线命名法）
  ```javascript
  const API_BASE_URL = 'https://api.example.com'
  const MAX_RETRY_COUNT = 3
  const DEFAULT_PAGE_SIZE = 20
  ```

- **私有变量**：使用下划线前缀
  ```javascript
  const _privateData = {}
  const _internalMethod = () => {}
  ```

- **布尔值**：使用 is/has/can 前缀
  ```javascript
  const isVisible = true
  const hasPermission = false
  const canEdit = true
  ```

#### 函数命名

- **普通函数**：使用动词开头的 camelCase
  ```javascript
  function getUserInfo() {}
  function updateUserProfile() {}
  function validateForm() {}
  ```

- **事件处理函数**：使用 handle 前缀
  ```javascript
  function handleButtonClick() {}
  function handleInputChange() {}
  function handlePageLoad() {}
  ```

- **工具函数**：使用描述性名称
  ```javascript
  function formatDate(date) {}
  function debounce(func, delay) {}
  function throttle(func, limit) {}
  ```

### 代码结构

#### 页面结构规范

```javascript
// pages/example/example.js
Page({
  // 1. 页面数据
  data: {
    // 按功能分组
    user: {
      name: '',
      avatar: ''
    },
    list: [],
    loading: false,
    error: null
  },

  // 2. 生命周期函数（按执行顺序）
  onLoad: function(options) {
    this.initPage(options)
  },

  onShow: function() {
    this.refreshData()
  },

  onReady: function() {
    this.setupComponents()
  },

  onHide: function() {
    this.pauseOperations()
  },

  onUnload: function() {
    this.cleanup()
  },

  // 3. 事件处理函数
  handleUserClick: function(e) {
    const userId = e.currentTarget.dataset.id
    this.navigateToUserDetail(userId)
  },

  handleRefresh: function() {
    this.loadData(true)
  },

  // 4. 业务逻辑函数
  initPage: function(options) {
    // 页面初始化逻辑
  },

  loadData: function(refresh = false) {
    // 数据加载逻辑
  },

  // 5. 工具函数
  formatUserData: function(userData) {
    // 数据格式化逻辑
  },

  validateInput: function(input) {
    // 输入验证逻辑
  }
})
```

#### 组件结构规范

```javascript
// components/custom-component/custom-component.js
Component({
  // 1. 组件选项
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },

  // 2. 组件属性
  properties: {
    title: {
      type: String,
      value: '',
      observer: function(newVal, oldVal) {
        this.updateTitle(newVal)
      }
    },
    data: {
      type: Object,
      value: null
    }
  },

  // 3. 组件数据
  data: {
    internalState: {},
    computed: {}
  },

  // 4. 生命周期
  lifetimes: {
    created: function() {
      this.initComponent()
    },

    attached: function() {
      this.setupComponent()
    },

    detached: function() {
      this.cleanup()
    }
  },

  // 5. 页面生命周期
  pageLifetimes: {
    show: function() {
      this.onPageShow()
    },

    hide: function() {
      this.onPageHide()
    }
  },

  // 6. 组件方法
  methods: {
    // 公共方法
    updateData: function(newData) {
      // 更新数据逻辑
    },

    // 私有方法
    _processData: function(data) {
      // 内部数据处理
    },

    // 事件处理
    handleTap: function(e) {
      this.triggerEvent('tap', {
        data: this.data.data
      })
    }
  }
})
```

### 注释规范

#### 文件头注释

```javascript
/**
 * 用户资料页面
 * @description 用户可以查看和编辑个人资料信息
 * @author 张三
 * @date 2024-01-15
 * @version 1.0.0
 */

/**
 * 自定义按钮组件
 * @component CustomButton
 * @description 支持多种样式和状态的按钮组件
 * @example
 * <custom-button type="primary" loading="{{loading}}" bind:tap="handleClick">
 *   点击按钮
 * </custom-button>
 */
```

#### 函数注释

```javascript
/**
 * 获取用户信息
 * @param {string} userId - 用户ID
 * @param {boolean} includeProfile - 是否包含详细资料
 * @returns {Promise<Object>} 用户信息对象
 * @throws {Error} 当用户不存在时抛出错误
 */
async function getUserInfo(userId, includeProfile = false) {
  // 实现逻辑
}

/**
 * 格式化日期
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @param {string} format - 格式化模板，如 'YYYY-MM-DD'
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  // 实现逻辑
}
```

#### 复杂逻辑注释

```javascript
Page({
  loadData: function() {
    // TODO: 优化数据加载性能
    // FIXME: 修复在网络不稳定时的重复请求问题
    // NOTE: 这里使用了缓存机制来提高性能
    
    /**
     * 数据加载流程：
     * 1. 检查本地缓存
     * 2. 如果缓存有效，直接使用缓存数据
     * 3. 如果缓存无效，发起网络请求
     * 4. 更新缓存和页面数据
     */
    
    const cachedData = this.getCachedData()
    if (this.isCacheValid(cachedData)) {
      // 使用缓存数据
      this.setData({ data: cachedData })
      return
    }
    
    // 发起网络请求
    this.requestData()
  }
})
```

## 架构设计

良好的架构设计可以提高代码的可维护性、可扩展性和可测试性，使项目更加健壮。

### 目录结构

推荐的小程序项目目录结构：

```
miniprogram/
├── app.js                 # 小程序入口文件
├── app.json              # 全局配置
├── app.wxss              # 全局样式
├── sitemap.json          # 搜索配置
├── project.config.json   # 项目配置
├── pages/                # 页面目录
│   ├── index/           # 首页
│   └── profile/         # 个人资料页
├── components/           # 自定义组件
│   ├── common/          # 通用组件
│   └── business/        # 业务组件
├── utils/               # 工具函数
├── services/            # 业务服务
├── config/              # 配置文件
├── assets/              # 静态资源
└── styles/              # 样式文件
```

### 模块化设计

#### 服务层设计

```javascript
// services/user.js
class UserService {
  constructor() {
    this.baseURL = '/api/user'
  }

  /**
   * 获取用户信息
   */
  async getUserInfo(userId) {
    return await request.get(`${this.baseURL}/${userId}`)
  }

  /**
   * 更新用户信息
   */
  async updateUserInfo(userId, userData) {
    return await request.put(`${this.baseURL}/${userId}`, userData)
  }

  /**
   * 上传用户头像
   */
  async uploadAvatar(filePath) {
    return await request.upload(`${this.baseURL}/avatar`, filePath)
  }
}

export default new UserService()
```

#### 工具函数设计

```javascript
// utils/validator.js
export const validator = {
  /**
   * 验证手机号
   */
  isPhone(phone) {
    const phoneRegex = /^1[3-9]\d{9}$/
    return phoneRegex.test(phone)
  },

  /**
   * 验证邮箱
   */
  isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * 通用验证函数
   */
  validate(data, rules) {
    const errors = {}
    
    Object.keys(rules).forEach(field => {
      const rule = rules[field]
      const value = data[field]
      
      if (rule.required && !value) {
        errors[field] = rule.message || `${field} 是必填项`
        return
      }
      
      if (rule.validator && value && !rule.validator(value)) {
        errors[field] = rule.message || `${field} 格式不正确`
      }
    })
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    }
  }
}
```

#### 状态管理

```javascript
// utils/store.js
class Store {
  constructor() {
    this.state = {}
    this.listeners = []
  }

  /**
   * 获取状态
   */
  getState(key) {
    return key ? this.state[key] : this.state
  }

  /**
   * 设置状态
   */
  setState(updates) {
    const prevState = { ...this.state }
    this.state = { ...this.state, ...updates }
    
    // 通知监听器
    this.listeners.forEach(listener => {
      listener(this.state, prevState)
    })
  }

  /**
   * 订阅状态变化
   */
  subscribe(listener) {
    this.listeners.push(listener)
    
    // 返回取消订阅函数
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }
}

export default new Store()
```

## 性能优化

性能优化是提升用户体验的关键，包括启动优化、渲染优化和资源优化等方面。

### 启动优化

#### 代码分包

```json
// app.json
{
  "pages": [
    "pages/index/index",
    "pages/profile/profile"
  ],
  "subpackages": [
    {
      "root": "pages/shop",
      "name": "shop",
      "pages": [
        "list/list",
        "detail/detail",
        "cart/cart"
      ]
    },
    {
      "root": "pages/user",
      "name": "user",
      "pages": [
        "settings/settings",
        "orders/orders",
        "address/address"
      ]
    }
  ],
  "preloadRule": {
    "pages/index/index": {
      "network": "all",
      "packages": ["shop"]
    }
  }
}
```

#### 资源优化

```javascript
// utils/image-optimizer.js
export const imageOptimizer = {
  /**
   * 根据设备像素比选择合适的图片
   */
  getOptimalImage(basePath, options = {}) {
    const systemInfo = wx.getSystemInfoSync()
    const pixelRatio = systemInfo.pixelRatio
    const { format = 'webp', fallback = 'jpg' } = options
    
    // 检查 WebP 支持
    const supportsWebP = this.supportsWebP()
    const imageFormat = supportsWebP ? format : fallback
    
    // 根据像素比选择图片
    let suffix = ''
    if (pixelRatio >= 3) {
      suffix = '@3x'
    } else if (pixelRatio >= 2) {
      suffix = '@2x'
    }
    
    return `${basePath}${suffix}.${imageFormat}`
  },

  /**
   * 图片懒加载
   */
  lazyLoad(selector, options = {}) {
    const { threshold = 100, placeholder = '/images/placeholder.png' } = options
    
    wx.createIntersectionObserver()
      .relativeToViewport({ bottom: threshold })
      .observe(selector, (res) => {
        if (res.intersectionRatio > 0) {
          // 图片进入可视区域，开始加载
          const realSrc = res.target.dataset.src
          if (realSrc) {
            res.target.src = realSrc
          }
        }
      })
  }
}
```

### 渲染优化

#### setData 优化

```javascript
// utils/set-data-optimizer.js
export class SetDataOptimizer {
  constructor(page) {
    this.page = page
    this.updateQueue = []
    this.updateTimer = null
  }

  /**
   * 批量更新数据
   */
  batchUpdate(data) {
    this.updateQueue.push(data)
    
    if (this.updateTimer) {
      clearTimeout(this.updateTimer)
    }
    
    this.updateTimer = setTimeout(() => {
      this.flushUpdates()
    }, 16) // 约 60fps
  }

  /**
   * 执行批量更新
   */
  flushUpdates() {
    if (this.updateQueue.length === 0) return
    
    // 合并所有更新
    const mergedData = Object.assign({}, ...this.updateQueue)
    
    // 执行更新
    this.page.setData(mergedData)
    
    // 清空队列
    this.updateQueue = []
    this.updateTimer = null
  }

  /**
   * 差异更新
   */
  diffUpdate(newData, oldData = {}) {
    const diff = this.calculateDiff(newData, oldData)
    if (Object.keys(diff).length > 0) {
      this.page.setData(diff)
    }
  }

  /**
   * 计算数据差异
   */
  calculateDiff(newData, oldData, prefix = '') {
    const diff = {}
    
    Object.keys(newData).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      const newValue = newData[key]
      const oldValue = oldData[key]
      
      if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue)) {
        // 递归处理对象
        const nestedDiff = this.calculateDiff(newValue, oldValue || {}, fullKey)
        Object.assign(diff, nestedDiff)
      } else if (newValue !== oldValue) {
        // 值不同，需要更新
        diff[fullKey] = newValue
      }
    })
    
    return diff
  }
}
```

#### 长列表优化

```javascript
// components/virtual-list/virtual-list.js
Component({
  properties: {
    items: {
      type: Array,
      value: []
    },
    itemHeight: {
      type: Number,
      value: 100
    },
    containerHeight: {
      type: Number,
      value: 600
    },
    overscan: {
      type: Number,
      value: 5
    }
  },

  data: {
    visibleItems: [],
    scrollTop: 0,
    totalHeight: 0
  },

  observers: {
    'items, itemHeight': function() {
      this.calculateLayout()
    }
  },

  methods: {
    calculateLayout: function() {
      const { items, itemHeight } = this.properties
      const totalHeight = items.length * itemHeight
      
      this.setData({
        totalHeight: totalHeight
      })
      
      this.updateVisibleItems()
    },

    updateVisibleItems: function() {
      const { items, itemHeight, containerHeight, overscan } = this.properties
      const { scrollTop } = this.data
      
      // 计算可见范围
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
        items.length
      )
      
      // 计算实际开始索引（考虑 overscan）
      const actualStartIndex = Math.max(0, startIndex - overscan)
      
      // 生成可见项目
      const visibleItems = []
      for (let i = actualStartIndex; i < endIndex; i++) {
        if (items[i]) {
          visibleItems.push({
            ...items[i],
            index: i,
            top: i * itemHeight
          })
        }
      }
      
      this.setData({
        visibleItems: visibleItems
      })
    },

    onScroll: function(e) {
      const scrollTop = e.detail.scrollTop
      this.setData({ scrollTop })
      
      // 节流更新
      if (this.scrollTimer) {
        clearTimeout(this.scrollTimer)
      }
      
      this.scrollTimer = setTimeout(() => {
        this.updateVisibleItems()
      }, 16)
    }
  }
})
```

## 安全规范

安全是小程序开发中不可忽视的重要方面，包括数据安全、网络安全等。

### 数据安全

#### 敏感信息保护

```javascript
// utils/security.js
export const security = {
  /**
   * 脱敏处理
   */
  mask(data, type) {
    switch (type) {
      case 'phone':
        return data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
      case 'idCard':
        return data.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
      case 'email':
        return data.replace(/(.{2}).*(@.*)/, '$1***$2')
      case 'bankCard':
        return data.replace(/(\d{4})\d+(\d{4})/, '$1 **** **** $2')
      default:
        return data
    }
  },

  /**
   * 输入验证
   */
  validateInput(input, rules) {
    const errors = []
    
    // XSS 防护
    if (this.containsXSS(input)) {
      errors.push('输入包含非法字符')
    }
    
    // SQL 注入防护
    if (this.containsSQLInjection(input)) {
      errors.push('输入包含非法SQL语句')
    }
    
    // 长度验证
    if (rules.maxLength && input.length > rules.maxLength) {
      errors.push(`输入长度不能超过${rules.maxLength}个字符`)
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    }
  },

  /**
   * 检查 XSS 攻击
   */
  containsXSS(input) {
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe/gi
    ]
    
    return xssPatterns.some(pattern => pattern.test(input))
  },

  /**
   * 检查 SQL 注入
   */
  containsSQLInjection(input) {
    const sqlPatterns = [
      /(\b(select|insert|update|delete|drop|create|alter)\b)/gi,
      /(union\s+select)/gi,
      /(\bor\b\s+\d+\s*=\s*\d+)/gi
    ]
    
    return sqlPatterns.some(pattern => pattern.test(input))
  }
}
```

#### 权限控制

```javascript
// utils/permission.js
class PermissionManager {
  constructor() {
    this.permissions = new Map()
    this.userRoles = []
  }

  /**
   * 设置用户角色
   */
  setUserRoles(roles) {
    this.userRoles = roles
    this.loadPermissions()
  }

  /**
   * 加载权限配置
   */
  loadPermissions() {
    // 权限配置
    const permissionConfig = {
      admin: ['read', 'write', 'delete', 'manage'],
      editor: ['read', 'write'],
      viewer: ['read']
    }
    
    this.permissions.clear()
    
    this.userRoles.forEach(role => {
      const rolePermissions = permissionConfig[role] || []
      rolePermissions.forEach(permission => {
        this.permissions.set(permission, true)
      })
    })
  }

  /**
   * 检查权限
   */
  hasPermission(permission) {
    return this.permissions.has(permission)
  }

  /**
   * 检查多个权限
   */
  hasAnyPermission(permissions) {
    return permissions.some(permission => this.hasPermission(permission))
  }

  /**
   * 检查所有权限
   */
  hasAllPermissions(permissions) {
    return permissions.every(permission => this.hasPermission(permission))
  }
}

export default new PermissionManager()
```

### 网络安全

#### HTTPS 强制使用

```javascript
// utils/network-security.js
export const networkSecurity = {
  /**
   * 验证 URL 安全性
   */
  validateURL(url) {
    // 检查协议
    if (!url.startsWith('https://')) {
      console.warn('不安全的URL协议:', url)
      return false
    }
    
    // 检查域名白名单
    const allowedDomains = [
      'api.example.com',
      'cdn.example.com',
      'upload.example.com'
    ]
    
    try {
      const urlObj = new URL(url)
      const domain = urlObj.hostname
      
      if (!allowedDomains.includes(domain)) {
        console.warn('不在白名单的域名:', domain)
        return false
      }
      
      return true
    } catch (error) {
      console.error('URL格式错误:', error)
      return false
    }
  },

  /**
   * 安全的网络请求
   */
  secureRequest(options) {
    // 验证 URL
    if (!this.validateURL(options.url)) {
      return Promise.reject(new Error('不安全的请求URL'))
    }
    
    // 添加安全头
    const secureHeaders = {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      ...options.header
    }
    
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        header: secureHeaders,
        success: (res) => {
          // 验证响应
          if (this.validateResponse(res)) {
            resolve(res)
          } else {
            reject(new Error('响应验证失败'))
          }
        },
        fail: reject
      })
    })
  },

  /**
   * 验证响应
   */
  validateResponse(response) {
    // 检查状态码
    if (response.statusCode < 200 || response.statusCode >= 300) {
      return false
    }
    
    return true
  }
}
```

## 用户体验

良好的用户体验是小程序成功的关键，包括交互设计、加载状态、错误处理等方面。

### 交互设计

#### 加载状态

```javascript
// utils/loading-manager.js
class LoadingManager {
  constructor() {
    this.loadingStates = new Map()
  }

  /**
   * 显示加载状态
   */
  show(key = 'default', options = {}) {
    const {
      title = '加载中...',
      mask = true,
      duration = 0
    } = options
    
    // 记录加载状态
    this.loadingStates.set(key, {
      title,
      startTime: Date.now()
    })
    
    wx.showLoading({
      title,
      mask
    })
    
    // 自动隐藏
    if (duration > 0) {
      setTimeout(() => {
        this.hide(key)
      }, duration)
    }
  }

  /**
   * 隐藏加载状态
   */
  hide(key = 'default') {
    if (this.loadingStates.has(key)) {
      const loadingState = this.loadingStates.get(key)
      const duration = Date.now() - loadingState.startTime
      
      // 确保最小显示时间（避免闪烁）
      const minDuration = 300
      if (duration < minDuration) {
        setTimeout(() => {
          wx.hideLoading()
        }, minDuration - duration)
      } else {
        wx.hideLoading()
      }
      
      this.loadingStates.delete(key)
    }
  }

  /**
   * 显示骨架屏
   */
  showSkeleton(page, skeletonData) {
    page.setData({
      showSkeleton: true,
      skeletonData: skeletonData
    })
  }

  /**
   * 隐藏骨架屏
   */
  hideSkeleton(page) {
    page.setData({
      showSkeleton: false
    })
  }
}

export default new LoadingManager()
```

#### 错误处理

```javascript
// utils/error-handler.js
class ErrorHandler {
  constructor() {
    this.errorTypes = {
      NETWORK_ERROR: 'network_error',
      API_ERROR: 'api_error',
      VALIDATION_ERROR: 'validation_error',
      PERMISSION_ERROR: 'permission_error',
      UNKNOWN_ERROR: 'unknown_error'
    }
  }

  /**
   * 处理错误
   */
  handle(error, context = {}) {
    const errorInfo = this.parseError(error)
    
    // 记录错误日志
    this.logError(errorInfo, context)
    
    // 显示用户友好的错误信息
    this.showUserError(errorInfo)
  }

  /**
   * 解析错误
   */
  parseError(error) {
    if (typeof error === 'string') {
      return {
        type: this.errorTypes.UNKNOWN_ERROR,
        message: error,
        code: null
      }
    }
    
    if (error.code) {
      // API 错误
      return {
        type: this.errorTypes.API_ERROR,
        message: error.message || '服务器错误',
        code: error.code
      }
    }
    
    if (error.errMsg) {
      // 微信 API 错误
      if (error.errMsg.includes('network')) {
        return {
          type: this.errorTypes.NETWORK_ERROR,
          message: '网络连接失败，请检查网络设置',
          code: null
        }
      }
    }
    
    return {
      type: this.errorTypes.UNKNOWN_ERROR,
      message: error.message || '未知错误',
      code: null
    }
  }

  /**
   * 显示用户错误信息
   */
  showUserError(errorInfo) {
    const userMessages = {
      [this.errorTypes.NETWORK_ERROR]: '网络连接失败，请检查网络后重试',
      [this.errorTypes.API_ERROR]: '服务暂时不可用，请稍后重试',
      [this.errorTypes.VALIDATION_ERROR]: '输入信息有误，请检查后重试',
      [this.errorTypes.PERMISSION_ERROR]: '权限不足，请检查权限设置',
      [this.errorTypes.UNKNOWN_ERROR]: '操作失败，请重试'
    }
    
    const message = userMessages[errorInfo.type] || errorInfo.message
    
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    })
  }
}

export default new ErrorHandler()
```

### 无障碍设计

#### 语义化标签

```xml
<!-- 使用语义化的 WXML 标签 -->
<view class="page" role="main">
  <view class="header" role="banner">
    <text class="title" role="heading" aria-level="1">页面标题</text>
  </view>
  
  <view class="content" role="main">
    <view class="section" role="region" aria-label="用户信息">
      <text class="section-title" role="heading" aria-level="2">个人信息</text>
      
      <view class="form-item">
        <text class="label">姓名</text>
        <input 
          class="input" 
          placeholder="请输入姓名"
          aria-label="姓名输入框"
          aria-required="true"
        />
      </view>
      
      <button 
        class="submit-btn"
        aria-label="提交表单"
        bindtap="handleSubmit">
        提交
      </button>
    </view>
  </view>
</view>
```

## 测试规范

测试是保证小程序质量的重要环节，包括单元测试、集成测试和端到端测试。

### 单元测试

```javascript
// tests/utils/validator.test.js
import { validator } from '../../utils/validator'

describe('validator', () => {
  describe('isPhone', () => {
    test('应该验证有效的手机号', () => {
      expect(validator.isPhone('13812345678')).toBe(true)
      expect(validator.isPhone('15987654321')).toBe(true)
    })
    
    test('应该拒绝无效的手机号', () => {
      expect(validator.isPhone('12345678901')).toBe(false)
      expect(validator.isPhone('1381234567')).toBe(false)
      expect(validator.isPhone('abc12345678')).toBe(false)
    })
  })
  
  describe('isEmail', () => {
    test('应该验证有效的邮箱', () => {
      expect(validator.isEmail('test@example.com')).toBe(true)
      expect(validator.isEmail('user.name@domain.co.uk')).toBe(true)
    })
    
    test('应该拒绝无效的邮箱', () => {
      expect(validator.isEmail('invalid-email')).toBe(false)
      expect(validator.isEmail('@example.com')).toBe(false)
      expect(validator.isEmail('test@')).toBe(false)
    })
  })
})
```

### 集成测试

```javascript
// tests/integration/api.test.js
import userService from '../../services/user'

describe('用户服务集成测试', () => {
  test('应该能够获取用户信息', async () => {
    const userId = 'test-user-id'
    
    const userInfo = await userService.getUserInfo(userId)
    
    expect(userInfo).toBeDefined()
    expect(userInfo.id).toBe(userId)
    expect(userInfo.name).toBeDefined()
  })
  
  test('应该能够更新用户信息', async () => {
    const userId = 'test-user-id'
    const updateData = {
      name: '新用户名',
      email: 'new@example.com'
    }
    
    const result = await userService.updateUserInfo(userId, updateData)
    
    expect(result.success).toBe(true)
  })
})
```

## 部署规范

### 环境配置

```javascript
// config/env.js
const environments = {
  development: {
    apiBaseURL: 'https://dev-api.example.com',
    cdnBaseURL: 'https://dev-cdn.example.com',
    debug: true,
    logLevel: 'debug'
  },
  testing: {
    apiBaseURL: 'https://test-api.example.com',
    cdnBaseURL: 'https://test-cdn.example.com',
    debug: true,
    logLevel: 'info'
  },
  production: {
    apiBaseURL: 'https://api.example.com',
    cdnBaseURL: 'https://cdn.example.com',
    debug: false,
    logLevel: 'error'
  }
}

const currentEnv = process.env.NODE_ENV || 'development'
export default environments[currentEnv]
```

### CI/CD 流程

```yaml
# .github/workflows/deploy.yml
name: Deploy Mini Program

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build project
      run: npm run build:prod
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v2
      with:
        name: build-files
        path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Download build artifacts
      uses: actions/download-artifact@v2
      with:
        name: build-files
        path: dist/
    
    - name: Deploy to WeChat
      run: |
        # 使用微信开发者工具 CLI 上传代码
        npx miniprogram-ci upload \
          --pp ./dist \
          --pkp ./private.key \
          --appid ${{ secrets.WECHAT_APPID }} \
          --uv ${{ github.run_number }} \
          --ud "Auto deploy from GitHub Actions"
```

## 团队协作

### 代码审查

#### Pull Request 模板

```markdown
<!-- .github/pull_request_template.md -->
## 变更描述
请简要描述此次变更的内容和目的。

## 变更类型
- [ ] 新功能 (feature)
- [ ] 错误修复 (bugfix)
- [ ] 性能优化 (performance)
- [ ] 代码重构 (refactor)
- [ ] 文档更新 (docs)
- [ ] 测试相关 (test)

## 测试
- [ ] 单元测试已通过
- [ ] 集成测试已通过
- [ ] 手动测试已完成

## 检查清单
- [ ] 代码遵循项目编码规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 已添加或更新测试用例
- [ ] 无安全漏洞
- [ ] 向后兼容
```

### 版本管理

#### Git 工作流

```bash
# 功能开发流程
git checkout -b feature/user-profile
git add .
git commit -m "feat: 添加用户资料页面"
git push origin feature/user-profile

# 创建 Pull Request
# 代码审查通过后合并到 develop 分支

# 发布流程
git checkout main
git merge develop
git tag v1.2.0
git push origin main --tags
```

#### 提交信息规范

```bash
# 提交信息格式
<type>(<scope>): <subject>

<body>

<footer>

# 示例
feat(user): 添加用户头像上传功能

- 支持图片选择和裁剪
- 添加上传进度显示
- 优化图片压缩算法

Closes #123
```

## 总结

小程序开发最佳实践涵盖了开发的各个方面：

1. **代码规范** - 统一的命名、结构和注释规范
2. **架构设计** - 合理的目录结构和模块化设计
3. **性能优化** - 启动优化、渲染优化和用户体验优化
4. **安全规范** - 数据安全、权限控制和网络安全
5. **测试规范** - 单元测试、集成测试和端到端测试
6. **部署规范** - 环境配置和CI/CD流程
7. **团队协作** - 代码审查和版本管理

遵循这些最佳实践，可以帮助团队构建高质量、可维护、安全可靠的小程序应用。最佳实践不是一成不变的，需要根据项目实际情况和团队特点进行调整和优化。
