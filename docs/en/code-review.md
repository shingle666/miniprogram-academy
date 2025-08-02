# Code Review

This guide covers the code review process for mini-program development, including review guidelines, common issues, and best practices for maintaining code quality.

## 📋 Table of Contents

- [Review Process](#review-process)
- [Review Guidelines](#review-guidelines)
- [Common Issues](#common-issues)
- [Code Quality Standards](#code-quality-standards)
- [Security Review](#security-review)
- [Performance Review](#performance-review)
- [Platform Compliance](#platform-compliance)
- [Automated Tools](#automated-tools)

## 🔍 Review Process

### Pre-submission Checklist
Before submitting code for review, ensure:

```markdown
- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Code follows project style guidelines
- [ ] Documentation is updated
- [ ] No sensitive data in code
- [ ] Performance impact assessed
- [ ] Cross-platform compatibility verified
```

### Review Workflow
```
Developer → Create PR → Automated Checks → Peer Review → Approval → Merge
    ↓           ↓            ↓              ↓          ↓        ↓
  Local      CI/CD      Linting/Tests   Manual     Final    Deploy
  Testing    Pipeline   Security Scan   Review     Check
```

### Review Roles
- **Author**: Submits code and addresses feedback
- **Reviewer**: Examines code for quality and compliance
- **Maintainer**: Final approval and merge authority
- **QA**: Tests functionality and user experience

## 📝 Review Guidelines

### Code Structure Review
```javascript
// ❌ Poor structure
Page({
  data: { users: [], loading: false, error: null, page: 1, hasMore: true },
  onLoad() {
    this.loadUsers()
    this.setupEventListeners()
    this.initializeComponents()
  },
  loadUsers() { /* complex logic */ },
  setupEventListeners() { /* event setup */ },
  initializeComponents() { /* component init */ }
})

// ✅ Good structure
Page({
  data: {
    users: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      hasMore: true
    }
  },
  
  onLoad() {
    this.initializePage()
  },
  
  async initializePage() {
    try {
      await this.loadUsers()
      this.setupEventListeners()
      this.initializeComponents()
    } catch (error) {
      this.handleError(error)
    }
  },
  
  async loadUsers() {
    // Clear, focused logic
  }
})
```

### Function Review Criteria
```javascript
// ❌ Function doing too much
function processUserData(users) {
  // Validate data
  if (!users || !Array.isArray(users)) return []
  
  // Transform data
  const transformed = users.map(user => ({
    id: user.id,
    name: user.firstName + ' ' + user.lastName,
    email: user.email.toLowerCase(),
    avatar: user.avatar || '/default-avatar.png'
  }))
  
  // Sort data
  transformed.sort((a, b) => a.name.localeCompare(b.name))
  
  // Filter data
  return transformed.filter(user => user.email.includes('@'))
}

// ✅ Single responsibility functions
function validateUsers(users) {
  return users && Array.isArray(users) ? users : []
}

function transformUser(user) {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email.toLowerCase(),
    avatar: user.avatar || '/default-avatar.png'
  }
}

function sortUsersByName(users) {
  return [...users].sort((a, b) => a.name.localeCompare(b.name))
}

function filterValidUsers(users) {
  return users.filter(user => user.email.includes('@'))
}

function processUserData(users) {
  const validUsers = validateUsers(users)
  const transformedUsers = validUsers.map(transformUser)
  const sortedUsers = sortUsersByName(transformedUsers)
  return filterValidUsers(sortedUsers)
}
```

## ⚠️ Common Issues

### Memory Leaks
```javascript
// ❌ Memory leak - timer not cleared
Page({
  onShow() {
    this.timer = setInterval(() => {
      this.updateData()
    }, 1000)
  },
  
  onHide() {
    // Missing: clearInterval(this.timer)
  }
})

// ✅ Proper cleanup
Page({
  onShow() {
    this.startTimer()
  },
  
  onHide() {
    this.stopTimer()
  },
  
  startTimer() {
    if (this.timer) return
    this.timer = setInterval(() => {
      this.updateData()
    }, 1000)
  },
  
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
})
```

### Data Binding Issues
```javascript
// ❌ Inefficient data updates
Page({
  updateList() {
    // Updates entire data object
    this.setData({
      list: this.data.list.concat([newItem])
    })
  }
})

// ✅ Efficient targeted updates
Page({
  updateList() {
    const index = this.data.list.length
    this.setData({
      [`list[${index}]`]: newItem
    })
  }
})
```

### Error Handling
```javascript
// ❌ Poor error handling
function loadData() {
  wx.request({
    url: '/api/data',
    success: (res) => {
      this.setData({ data: res.data })
    }
  })
}

// ✅ Comprehensive error handling
async function loadData() {
  try {
    wx.showLoading({ title: 'Loading...' })
    
    const res = await this.apiRequest('/api/data')
    
    if (res.statusCode === 200) {
      this.setData({ 
        data: res.data,
        error: null 
      })
    } else {
      throw new Error(`HTTP ${res.statusCode}`)
    }
  } catch (error) {
    console.error('Load data failed:', error)
    this.setData({
      error: 'Failed to load data'
    })
    wx.showToast({
      title: 'Load failed',
      icon: 'error'
    })
  } finally {
    wx.hideLoading()
  }
}
```

## 🏆 Code Quality Standards

### Naming Conventions
```javascript
// ✅ Good naming
const userAccountManager = new UserAccountManager()
const isUserLoggedIn = checkUserLoginStatus()
const MAX_RETRY_ATTEMPTS = 3

function calculateTotalPrice(items) {
  return items.reduce((total, item) => total + item.price, 0)
}

// ❌ Poor naming
const uam = new UserAccountManager()
const flag = checkUserLoginStatus()
const MAX = 3

function calc(arr) {
  return arr.reduce((t, i) => t + i.p, 0)
}
```

### Documentation Standards
```javascript
/**
 * Fetches user data from the server
 * @param {string} userId - The unique identifier for the user
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeProfile - Whether to include profile data
 * @param {number} options.timeout - Request timeout in milliseconds
 * @returns {Promise<Object>} User data object
 * @throws {Error} When user is not found or network error occurs
 */
async function fetchUserData(userId, options = {}) {
  const {
    includeProfile = false,
    timeout = 5000
  } = options
  
  // Implementation
}
```

### Code Organization
```
src/
├── pages/
│   ├── home/
│   │   ├── home.js
│   │   ├── home.wxml
│   │   ├── home.wxss
│   │   └── home.json
├── components/
│   ├── user-card/
│   └── product-list/
├── utils/
│   ├── api.js
│   ├── storage.js
│   └── validators.js
├── services/
│   ├── user-service.js
│   └── product-service.js
└── constants/
    ├── api-endpoints.js
    └── app-config.js
```

## 🔒 Security Review

### Data Validation
```javascript
// ✅ Input validation
function validateUserInput(input) {
  const schema = {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 50,
      pattern: /^[a-zA-Z\s]+$/
    },
    email: {
      type: 'string',
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    age: {
      type: 'number',
      min: 0,
      max: 150
    }
  }
  
  return validateAgainstSchema(input, schema)
}

// ✅ SQL injection prevention
function buildQuery(params) {
  const allowedFields = ['name', 'email', 'age']
  const sanitizedParams = {}
  
  for (const [key, value] of Object.entries(params)) {
    if (allowedFields.includes(key)) {
      sanitizedParams[key] = sanitizeInput(value)
    }
  }
  
  return sanitizedParams
}
```

### Sensitive Data Handling
```javascript
// ❌ Exposing sensitive data
console.log('User data:', userData) // May contain passwords

// ✅ Safe logging
function safeLog(data, sensitiveFields = ['password', 'token', 'secret']) {
  const safeCopy = { ...data }
  sensitiveFields.forEach(field => {
    if (safeCopy[field]) {
      safeCopy[field] = '[REDACTED]'
    }
  })
  console.log('User data:', safeCopy)
}
```

## ⚡ Performance Review

### Rendering Performance
```javascript
// ❌ Inefficient rendering
Page({
  data: {
    items: []
  },
  
  addItem(item) {
    // Triggers full list re-render
    this.setData({
      items: [...this.data.items, item]
    })
  }
})

// ✅ Optimized rendering
Page({
  data: {
    items: []
  },
  
  addItem(item) {
    // Only renders new item
    const index = this.data.items.length
    this.setData({
      [`items[${index}]`]: item
    })
  }
})
```

### Network Optimization
```javascript
// ✅ Request optimization
class APIClient {
  constructor() {
    this.cache = new Map()
    this.pendingRequests = new Map()
  }
  
  async request(url, options = {}) {
    const cacheKey = this.getCacheKey(url, options)
    
    // Return cached response
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }
    
    // Avoid duplicate requests
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey)
    }
    
    const requestPromise = this.makeRequest(url, options)
    this.pendingRequests.set(cacheKey, requestPromise)
    
    try {
      const response = await requestPromise
      this.cache.set(cacheKey, response)
      return response
    } finally {
      this.pendingRequests.delete(cacheKey)
    }
  }
}
```

## 📱 Platform Compliance

### WeChat Mini Program Review
```javascript
// ✅ Compliant code structure
Page({
  data: {
    userInfo: null,
    hasUserInfo: false
  },
  
  // Proper user authorization
  getUserProfile() {
    wx.getUserProfile({
      desc: 'Used for displaying user information',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: (error) => {
        console.log('User declined authorization')
      }
    })
  }
})
```

### Content Guidelines
- No prohibited content (gambling, adult content, etc.)
- Proper user data handling and privacy protection
- Clear user authorization requests
- Appropriate use of platform APIs

## 🤖 Automated Tools

### ESLint Configuration
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error",
    "curly": "error"
  },
  "env": {
    "es6": true,
    "node": true
  }
}
```

### Pre-commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{js,ts}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md}": [
      "prettier --write",
      "git add"
    ]
  }
}
```

### CI/CD Pipeline
```yaml
name: Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install dependencies
        run: npm ci
      - name: Run linting
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Security audit
        run: npm audit
      - name: Build check
        run: npm run build
```

## 🎯 Review Best Practices

### For Reviewers
- **Be constructive**: Provide specific, actionable feedback
- **Focus on code, not person**: Keep feedback objective
- **Explain reasoning**: Help others learn from your feedback
- **Prioritize issues**: Distinguish between critical and minor issues
- **Test thoroughly**: Verify functionality works as expected

### For Authors
- **Self-review first**: Review your own code before submission
- **Write clear descriptions**: Explain what and why you changed
- **Keep changes focused**: One feature or fix per pull request
- **Respond promptly**: Address feedback in a timely manner
- **Learn from feedback**: Use reviews as learning opportunities

---

Effective code review is essential for maintaining high-quality, secure, and performant mini-programs. It helps catch issues early, shares knowledge among team members, and ensures consistent coding standards across the project.