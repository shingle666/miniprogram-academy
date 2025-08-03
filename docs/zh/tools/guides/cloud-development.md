# 小程序云开发指南

小程序云开发是微信团队和腾讯云团队共同打造的原生 Serverless 云服务，为小程序开发者提供完整的云端支持，弱化后端和运维概念，无需搭建服务器，使用平台提供的 API 进行核心业务开发，即可实现快速上线和迭代。

## 云开发简介

云开发为开发者提供完整的云端支持，弱化后端和运维概念，无需搭建服务器，使用平台提供的 API 进行核心业务开发，即可实现快速上线和迭代。

### 核心能力

- **云函数**：在云端运行的代码，微信私有协议天然鉴权，开发者只需编写业务逻辑代码
- **数据库**：一个既可在小程序前端操作，也能在云函数中读写的 JSON 数据库
- **存储**：在小程序前端直接上传/下载云端文件，在云开发控制台可视化管理
- **云调用**：基于云函数免鉴权使用小程序开放接口的能力

### 优势特点

- **无服务器**：无需搭建和维护服务器
- **弹性伸缩**：根据业务量自动扩缩容
- **按量付费**：根据实际使用量计费
- **快速开发**：专注业务逻辑，提升开发效率
- **安全可靠**：微信生态内的安全保障

## 开通云开发

### 创建云开发环境

1. **登录微信公众平台**
   - 进入小程序管理后台
   - 点击左侧菜单"云开发"

2. **开通云开发服务**
   - 点击"开通"按钮
   - 填写环境名称（如：prod、test）
   - 选择套餐类型

3. **获取环境ID**
   - 开通成功后获得环境ID
   - 在代码中使用此ID初始化云开发

### 在开发者工具中配置

1. **开启云开发**
   ```javascript
   // app.js
   App({
     onLaunch: function () {
       if (!wx.cloud) {
         console.error('请使用 2.2.3 或以上的基础库以使用云能力')
       } else {
         wx.cloud.init({
           env: 'your-env-id', // 环境ID
           traceUser: true,
         })
       }
     }
   })
   ```

2. **项目配置**
   ```json
   // project.config.json
   {
     "cloudfunctionRoot": "cloudfunctions/",
     "setting": {
       "urlCheck": false,
       "es6": true,
       "enhance": true,
       "postcss": true,
       "preloadBackgroundData": false,
       "minified": true,
       "newFeature": false,
       "coverView": true,
       "nodeModules": false,
       "autoAudits": false,
       "showShadowRootInWxmlPanel": true,
       "scopeDataCheck": false,
       "uglifyFileName": false,
       "checkInvalidKey": true,
       "checkSiteMap": true,
       "uploadWithSourceMap": true,
       "compileHotReLoad": false,
       "useMultiFrameRuntime": true,
       "useApiHook": true,
       "babelSetting": {
         "ignore": [],
         "disablePlugins": [],
         "outputPath": ""
       },
       "enableEngineNative": false,
       "bundle": false,
       "useIsolateContext": true,
       "useCompilerModule": true,
       "userConfirmedUseCompilerModuleSwitch": false,
       "userConfirmedBundleSwitch": false,
       "packNpmManually": false,
       "packNpmRelationList": [],
       "minifyWXSS": true
     }
   }
   ```

## 云函数开发

### 创建云函数

1. **在开发者工具中创建**
   - 右键点击 `cloudfunctions` 文件夹
   - 选择"新建 Node.js 云函数"
   - 输入函数名称

2. **云函数结构**
   ```
   cloudfunctions/
   └── login/
       ├── index.js      # 云函数入口文件
       └── package.json  # 依赖配置
   ```

### 基础云函数示例

```javascript
// cloudfunctions/hello/index.js
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV // 使用当前云环境
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    message: 'Hello from cloud function!'
  }
}
```

### 调用云函数

```javascript
// 在小程序中调用云函数
wx.cloud.callFunction({
  name: 'hello',
  data: {
    name: '张三',
    age: 25
  },
  success: res => {
    console.log('云函数调用成功', res.result)
  },
  fail: err => {
    console.error('云函数调用失败', err)
  }
})

// 使用 Promise
wx.cloud.callFunction({
  name: 'hello',
  data: { name: '张三' }
}).then(res => {
  console.log('调用成功', res.result)
}).catch(err => {
  console.error('调用失败', err)
})

// 使用 async/await
async function callCloudFunction() {
  try {
    const res = await wx.cloud.callFunction({
      name: 'hello',
      data: { name: '张三' }
    })
    console.log('调用成功', res.result)
  } catch (err) {
    console.error('调用失败', err)
  }
}
```

### 高级云函数示例

#### 用户登录云函数

```javascript
// cloudfunctions/login/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { userInfo } = event

  try {
    // 查询用户是否已存在
    const userRecord = await db.collection('users').where({
      openid: wxContext.OPENID
    }).get()

    if (userRecord.data.length === 0) {
      // 新用户，创建用户记录
      await db.collection('users').add({
        data: {
          openid: wxContext.OPENID,
          userInfo: userInfo,
          createTime: new Date(),
          lastLoginTime: new Date()
        }
      })
    } else {
      // 老用户，更新最后登录时间
      await db.collection('users').where({
        openid: wxContext.OPENID
      }).update({
        data: {
          lastLoginTime: new Date()
        }
      })
    }

    return {
      success: true,
      openid: wxContext.OPENID,
      message: '登录成功'
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}
```

#### 数据处理云函数

```javascript
// cloudfunctions/processData/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { action, data } = event

  switch (action) {
    case 'create':
      return await createRecord(data)
    case 'update':
      return await updateRecord(data)
    case 'delete':
      return await deleteRecord(data)
    case 'query':
      return await queryRecords(data)
    default:
      return { error: '未知操作' }
  }
}

async function createRecord(data) {
  try {
    const result = await db.collection('records').add({
      data: {
        ...data,
        createTime: new Date()
      }
    })
    return { success: true, id: result._id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function updateRecord(data) {
  try {
    const { id, ...updateData } = data
    await db.collection('records').doc(id).update({
      data: {
        ...updateData,
        updateTime: new Date()
      }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function deleteRecord(data) {
  try {
    await db.collection('records').doc(data.id).remove()
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function queryRecords(data) {
  try {
    const { page = 1, limit = 20, filter = {} } = data
    const skip = (page - 1) * limit

    const result = await db.collection('records')
      .where(filter)
      .skip(skip)
      .limit(limit)
      .orderBy('createTime', 'desc')
      .get()

    return {
      success: true,
      data: result.data,
      total: result.data.length
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

## 云数据库

### 数据库操作

#### 初始化数据库

```javascript
// 获取数据库引用
const db = wx.cloud.database()

// 获取集合引用
const collection = db.collection('todos')
```

#### 增加数据

```javascript
// 添加单条记录
db.collection('todos').add({
  data: {
    title: '学习云开发',
    content: '掌握云函数、数据库、存储的使用',
    done: false,
    createTime: new Date()
  },
  success: res => {
    console.log('添加成功', res._id)
  },
  fail: err => {
    console.error('添加失败', err)
  }
})

// 使用 Promise
db.collection('todos').add({
  data: {
    title: '学习小程序',
    done: false,
    createTime: new Date()
  }
}).then(res => {
  console.log('添加成功', res._id)
}).catch(err => {
  console.error('添加失败', err)
})
```

#### 查询数据

```javascript
// 查询所有记录
db.collection('todos').get({
  success: res => {
    console.log('查询成功', res.data)
  }
})

// 条件查询
db.collection('todos').where({
  done: false
}).get({
  success: res => {
    console.log('未完成的任务', res.data)
  }
})

// 复杂查询
const _ = db.command
db.collection('todos').where({
  createTime: _.gte(new Date('2023-01-01')),
  done: _.eq(false)
}).orderBy('createTime', 'desc').limit(10).get({
  success: res => {
    console.log('查询结果', res.data)
  }
})

// 分页查询
async function getPageData(page = 1, limit = 20) {
  const skip = (page - 1) * limit
  
  try {
    const res = await db.collection('todos')
      .skip(skip)
      .limit(limit)
      .orderBy('createTime', 'desc')
      .get()
    
    return res.data
  } catch (err) {
    console.error('查询失败', err)
    return []
  }
}
```

#### 更新数据

```javascript
// 更新单条记录
db.collection('todos').doc('todo-id').update({
  data: {
    done: true,
    updateTime: new Date()
  },
  success: res => {
    console.log('更新成功', res.stats)
  }
})

// 批量更新
db.collection('todos').where({
  done: false
}).update({
  data: {
    priority: 'high'
  },
  success: res => {
    console.log('批量更新成功', res.stats)
  }
})

// 使用数据库操作符
const _ = db.command
db.collection('todos').doc('todo-id').update({
  data: {
    viewCount: _.inc(1), // 自增1
    tags: _.push(['urgent']), // 添加标签
    updateTime: new Date()
  }
})
```

#### 删除数据

```javascript
// 删除单条记录
db.collection('todos').doc('todo-id').remove({
  success: res => {
    console.log('删除成功', res.stats)
  }
})

// 批量删除
db.collection('todos').where({
  done: true
}).remove({
  success: res => {
    console.log('批量删除成功', res.stats)
  }
})
```

### 数据库索引

#### 创建索引

在云开发控制台中创建索引以提升查询性能：

```javascript
// 单字段索引
{
  "createTime": 1  // 1表示升序，-1表示降序
}

// 复合索引
{
  "userId": 1,
  "createTime": -1
}

// 文本索引
{
  "title": "text",
  "content": "text"
}
```

#### 查询优化

```javascript
// 使用索引字段进行查询
db.collection('articles').where({
  userId: 'user123',
  status: 'published'
}).orderBy('createTime', 'desc').get()

// 文本搜索
db.collection('articles').where({
  title: db.RegExp({
    regexp: '云开发',
    options: 'i'
  })
}).get()
```

## 云存储

### 上传文件

```javascript
// 选择并上传图片
wx.chooseImage({
  count: 1,
  sizeType: ['compressed'],
  sourceType: ['album', 'camera'],
  success: res => {
    const filePath = res.tempFilePaths[0]
    
    // 上传文件
    wx.cloud.uploadFile({
      cloudPath: `images/${Date.now()}-${Math.random()}.jpg`,
      filePath: filePath,
      success: res => {
        console.log('上传成功', res.fileID)
        // 保存文件ID到数据库
        saveFileToDatabase(res.fileID)
      },
      fail: err => {
        console.error('上传失败', err)
      }
    })
  }
})

// 上传多个文件
async function uploadMultipleFiles(filePaths) {
  const uploadPromises = filePaths.map((filePath, index) => {
    return wx.cloud.uploadFile({
      cloudPath: `images/${Date.now()}-${index}.jpg`,
      filePath: filePath
    })
  })
  
  try {
    const results = await Promise.all(uploadPromises)
    console.log('批量上传成功', results.map(r => r.fileID))
    return results.map(r => r.fileID)
  } catch (err) {
    console.error('批量上传失败', err)
    return []
  }
}
```

### 下载文件

```javascript
// 下载文件
wx.cloud.downloadFile({
  fileID: 'cloud://env-id.xxx.jpg',
  success: res => {
    console.log('下载成功', res.tempFilePath)
    // 可以将临时路径用于显示图片
  },
  fail: err => {
    console.error('下载失败', err)
  }
})

// 获取文件下载链接
wx.cloud.getTempFileURL({
  fileList: ['cloud://env-id.xxx.jpg'],
  success: res => {
    console.log('获取下载链接成功', res.fileList[0].tempFileURL)
  }
})
```

### 删除文件

```javascript
// 删除单个文件
wx.cloud.deleteFile({
  fileList: ['cloud://env-id.xxx.jpg'],
  success: res => {
    console.log('删除成功', res.fileList)
  }
})

// 批量删除文件
async function deleteMultipleFiles(fileIDs) {
  try {
    const res = await wx.cloud.deleteFile({
      fileList: fileIDs
    })
    console.log('批量删除成功', res.fileList)
  } catch (err) {
    console.error('批量删除失败', err)
  }
}
```

### 文件管理最佳实践

```javascript
// 文件上传工具类
class FileManager {
  // 上传图片
  static async uploadImage(filePath, folder = 'images') {
    const cloudPath = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
    
    try {
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      return res.fileID
    } catch (err) {
      console.error('图片上传失败', err)
      throw err
    }
  }
  
  // 上传文档
  static async uploadDocument(filePath, fileName, folder = 'documents') {
    const ext = fileName.split('.').pop()
    const cloudPath = `${folder}/${Date.now()}-${fileName}`
    
    try {
      const res = await wx.cloud.uploadFile({
        cloudPath,
        filePath
      })
      return res.fileID
    } catch (err) {
      console.error('文档上传失败', err)
      throw err
    }
  }
  
  // 获取临时链接
  static async getTempURL(fileID) {
    try {
      const res = await wx.cloud.getTempFileURL({
        fileList: [fileID]
      })
      return res.fileList[0].tempFileURL
    } catch (err) {
      console.error('获取临时链接失败', err)
      throw err
    }
  }
}
```

## 云调用

### 发送模板消息

```javascript
// cloudfunctions/sendMessage/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { touser, templateId, data, page } = event
  
  try {
    const result = await cloud.openapi.subscribeMessage.send({
      touser: touser,
      templateId: templateId,
      page: page,
      data: data
    })
    
    return {
      success: true,
      result: result
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
}
```

### 生成小程序码

```javascript
// cloudfunctions/generateQRCode/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { scene, page, width = 430 } = event
  
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: scene,
      page: page,
      width: width
    })
    
    // 上传生成的小程序码到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath: `qrcodes/${Date.now()}.jpg`,
      fileContent: result.buffer
    })
    
    return {
      success: true,
      fileID: uploadResult.fileID
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
}
```

### 内容安全检测

```javascript
// cloudfunctions/contentSecurity/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  const { content, type = 'text' } = event
  
  try {
    let result
    
    if (type === 'text') {
      // 文本内容安全检测
      result = await cloud.openapi.security.msgSecCheck({
        content: content
      })
    } else if (type === 'image') {
      // 图片内容安全检测
      result = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: 'image/png',
          value: Buffer.from(content, 'base64')
        }
      })
    }
    
    return {
      success: true,
      result: result
    }
  } catch (err) {
    return {
      success: false,
      error: err
    }
  }
}
```

## 实战案例

### 待办事项应用

#### 数据结构设计

```javascript
// todos 集合
{
  _id: "todo-id",
  title: "学习云开发",
  content: "掌握云函数、数据库、存储的使用",
  done: false,
  priority: "high", // high, medium, low
  category: "学习",
  dueDate: "2023-12-31",
  createTime: "2023-01-01T00:00:00.000Z",
  updateTime: "2023-01-01T00:00:00.000Z",
  userId: "user-openid"
}
```

#### 云函数实现

```javascript
// cloudfunctions/todoManager/index.js
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const { action, data } = event
  
  // 确保用户只能操作自己的数据
  const userId = wxContext.OPENID
  
  switch (action) {
    case 'create':
      return await createTodo(userId, data)
    case 'list':
      return await getTodos(userId, data)
    case 'update':
      return await updateTodo(userId, data)
    case 'delete':
      return await deleteTodo(userId, data)
    case 'toggle':
      return await toggleTodo(userId, data)
    default:
      return { error: '未知操作' }
  }
}

async function createTodo(userId, data) {
  try {
    const result = await db.collection('todos').add({
      data: {
        ...data,
        userId: userId,
        done: false,
        createTime: new Date(),
        updateTime: new Date()
      }
    })
    return { success: true, id: result._id }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function getTodos(userId, { filter = {}, page = 1, limit = 20 }) {
  try {
    const skip = (page - 1) * limit
    const query = { userId, ...filter }
    
    const result = await db.collection('todos')
      .where(query)
      .skip(skip)
      .limit(limit)
      .orderBy('createTime', 'desc')
      .get()
    
    return {
      success: true,
      data: result.data,
      total: result.data.length
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function updateTodo(userId, { id, ...updateData }) {
  try {
    await db.collection('todos').where({
      _id: id,
      userId: userId
    }).update({
      data: {
        ...updateData,
        updateTime: new Date()
      }
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function deleteTodo(userId, { id }) {
  try {
    await db.collection('todos').where({
      _id: id,
      userId: userId
    }).remove()
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function toggleTodo(userId, { id }) {
  try {
    // 先查询当前状态
    const todo = await db.collection('todos').where({
      _id: id,
      userId: userId
    }).get()
    
    if (todo.data.length === 0) {
      return { success: false, error: '待办事项不存在' }
    }
    
    const currentDone = todo.data[0].done
    
    // 切换状态
    await db.collection('todos').where({
      _id: id,
      userId: userId
    }).update({
      data: {
        done: !currentDone,
        updateTime: new Date()
      }
    })
    
    return { success: true, done: !currentDone }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

#### 小程序端调用

```javascript
// pages/todos/todos.js
Page({
  data: {
    todos: [],
    loading: false
  },
  
  onLoad() {
    this.loadTodos()
  },
  
  async loadTodos() {
    this.setData({ loading: true })
    
    try {
      const res = await wx.cloud.callFunction({
        name: 'todoManager',
        data: {
          action: 'list',
          data: {
            filter: {},
            page: 1,
            limit: 50
          }
        }
      })
      
      if (res.result.success) {
        this.setData({
          todos: res.result.data
        })
      } else {
        wx.showToast({
          title: '加载失败',
          icon: 'error'
        })
      }
    } catch (err) {
      console.error('加载待办事项失败', err)
      wx.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      this.setData({ loading: false })
    }
  },
  
  async addTodo() {
    const { value } = await this.showInputDialog('添加待办事项', '请输入待办事项内容')
    
    if (!value) return
    
    try {
      const res = await wx.cloud.callFunction({
        name: 'todoManager',
        data: {
          action: 'create',
          data: {
            title: value,
            priority: 'medium',
            category: '默认'
          }
        }
      })
      
      if (res.result.success) {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        })
        this.loadTodos() // 重新加载列表
      } else {
        wx.showToast({
          title: '添加失败',
          icon: 'error'
        })
      }
    } catch (err) {
      console.error('添加待办事项失败', err)
    }
  },
  
  async toggleTodo(e) {
    const { id } = e.currentTarget.dataset
    
    try {
      const res = await wx.cloud.callFunction({
        name: 'todoManager',
        data: {
          action: 'toggle',
          data: { id }
        }
      })
      
      if (res.result.success) {
        // 更新本地数据
        const todos = this.data.todos.map(todo => {
          if (todo._id === id) {
            return { ...todo, done: res.result.done }
          }
          return todo
        })
        this.setData({ todos })
      }
    } catch (err) {
      console.error('切换状态失败', err)
    }
  },
  
  showInputDialog(title, placeholder) {
    return new Promise((resolve) => {
      wx.showModal({
        title: title,
        placeholderText: placeholder,
        editable: true,
        success: (res) => {
          resolve({
            confirm: res.confirm,
            value: res.content
          })
        }
      })
    })
  }
})
```

## 性能优化

### 云函数优化

#### 减少冷启动

```javascript
// 保持云函数热启动
const cloud = require('wx-server-sdk')

// 全局初始化，避免重复初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 复用数据库连接
const db = cloud.database()

// 缓存常用数据
let configCache = null
let cacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟

exports.main = async (event, context) => {
  // 使用缓存减少数据库查询
  if (!configCache || Date.now() - cacheTime > CACHE_DURATION) {
    configCache = await db.collection('config').get()
    cacheTime = Date.now()
  }
  
  // 业务逻辑
  return {
    success: true,
    config: configCache.data
  }
}
```

#### 批量操作

```javascript
// 批量数据库操作
async function batchUpdateTodos(updates) {
  const batch = db.batch()
  
  updates.forEach(update => {
    batch.collection('todos').doc(update.id).update({
      data: update.data
    })
  })
  
  try {
    const result = await batch.commit()
    return { success: true, result }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

### 数据库优化

#### 合理使用索引

```javascript
// 在云开发控制台创建复合索引
{
  "userId": 1,
  "createTime": -1,
  "done": 1
}

// 查询时充分利用索引
db.collection('todos').where({
  userId: 'user123',
  done: false
}).orderBy('createTime', 'desc').get()
```

#### 分页查询优化

```javascript
// 使用游标分页替代 skip/limit
async function getCursorPageData(lastId = null, limit = 20) {
  let query = db.collection('todos')
  
  if (lastId) {
    query = query.where({
      _id: db.command.gt(lastId)
    })
  }
  
  const result = await query
    .orderBy('_id', 'asc')
    .limit(limit)
    .get()
  
  return {
    data: result.data,
    hasMore: result.data.length === limit,
    lastId: result.data.length > 0 ? result.data[result.data.length - 1]._id : null
  }
}
```

### 存储优化

#### 图片压缩上传

```javascript
// 压缩图片后上传
function compressImage(filePath) {
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src: filePath,
      quality: 80,
      success: resolve,
      fail: reject
    })
  })
}

async function uploadCompressedImage(filePath) {
  try {
    // 压缩图片
    const compressResult = await compressImage(filePath)
    
    // 上传压缩后的图片
    const uploadResult = await wx.cloud.uploadFile({
      cloudPath: `images/${Date.now()}.jpg`,
      filePath: compressResult.tempFilePath
    })
    
    return uploadResult.fileID
  } catch (error) {
    console.error('上传失败', error)
    throw error
  }
}
```

## 安全最佳实践

### 数据安全

#### 权限控制

```javascript
// 云函数中的权限验证
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID
  
  // 验证用户身份
  if (!userId) {
    return { error: '用户未登录' }
  }
  
  // 验证操作权限
  const { action, data } = event
  if (action === 'delete' && !await hasDeletePermission(userId, data.id)) {
    return { error: '无删除权限' }
  }
  
  // 执行业务逻辑
  return await processRequest(userId, action, data)
}

async function hasDeletePermission(userId, recordId) {
  const record = await db.collection('records').doc(recordId).get()
  return record.data && record.data.userId === userId
}
```

#### 数据验证

```javascript
// 输入数据验证
function validateTodoData(data) {
  const errors = []
  
  if (!data.title || data.title.trim().length === 0) {
    errors.push('标题不能为空')
  }
  
  if (data.title && data.title.length > 100) {
    errors.push('标题长度不能超过100个字符')
  }
  
  if (data.priority && !['high', 'medium', 'low'].includes(data.priority)) {
    errors.push('优先级值无效')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// 在云函数中使用验证
async function createTodo(userId, data) {
  const validation = validateTodoData(data)
  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join(', ')
    }
  }
  
  // 继续处理...
}
```

### 内容安全

```javascript
// 内容安全检测云函数
const cloud = require('wx-server-sdk')
cloud.init()

exports.main = async (event, context) => {
  const { content, type = 'text' } = event
  
  try {
    if (type === 'text') {
      const result = await cloud.openapi.security.msgSecCheck({
        content: content
      })
      
      return {
        safe: result.errCode === 0,
        result: result
      }
    }
  } catch (error) {
    console.error('内容检测失败', error)
    return {
      safe: false,
      error: error.message
    }
  }
}

// 在业务逻辑中使用内容检测
async function createPost(userId, postData) {
  // 检测内容安全
  const securityCheck = await wx.cloud.callFunction({
    name: 'contentSecurity',
    data: {
      content: postData.content,
      type: 'text'
    }
  })
  
  if (!securityCheck.result.safe) {
    return {
      success: false,
      error: '内容包含敏感信息，请修改后重试'
    }
  }
  
  // 继续创建帖子...
}
```

## 监控与调试

### 日志记录

```javascript
// 结构化日志记录
function logInfo(action, data, userId = null) {
  console.log(JSON.stringify({
    level: 'INFO',
    timestamp: new Date().toISOString(),
    action: action,
    userId: userId,
    data: data
  }))
}

function logError(action, error, userId = null) {
  console.error(JSON.stringify({
    level: 'ERROR',
    timestamp: new Date().toISOString(),
    action: action,
    userId: userId,
    error: {
      message: error.message,
      stack: error.stack
    }
  }))
}

// 在云函数中使用
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID
  
  logInfo('function_start', { event }, userId)
  
  try {
    const result = await processRequest(event)
    logInfo('function_success', { result }, userId)
    return result
  } catch (error) {
    logError('function_error', error, userId)
    return { success: false, error: error.message }
  }
}
```

### 性能监控

```javascript
// 性能监控工具
class PerformanceMonitor {
  constructor() {
    this.startTime = Date.now()
  }
  
  mark(label) {
    const now = Date.now()
    console.log(`[PERF] ${label}: ${now - this.startTime}ms`)
    this.startTime = now
  }
  
  async timeAsync(label, asyncFn) {
    const start = Date.now()
    try {
      const result = await asyncFn()
      const duration = Date.now() - start
      console.log(`[PERF] ${label}: ${duration}ms`)
      return result
    } catch (error) {
      const duration = Date.now() - start
      console.log(`[PERF] ${label} (ERROR): ${duration}ms`)
      throw error
    }
  }
}

// 使用示例
exports.main = async (event, context) => {
  const monitor = new PerformanceMonitor()
  
  const userData = await monitor.timeAsync('get_user_data', async () => {
    return await db.collection('users').doc(userId).get()
  })
  
  const result = await monitor.timeAsync('process_business_logic', async () => {
    return await processBusinessLogic(userData)
  })
  
  return result
}
```

## 常见问题解决

### 云函数问题

#### 超时问题

```javascript
// 设置合理的超时时间
exports.main = async (event, context) => {
  // 对于耗时操作，考虑分批处理
  const { items } = event
  const batchSize = 10
  const results = []
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(item => processItem(item))
    )
    results.push(...batchResults)
    
    // 避免超时，适当延迟
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  
  return { results }
}
```

#### 内存问题

```javascript
// 避免内存泄漏
exports.main = async (event, context) => {
  let largeData = null
  
  try {
    largeData = await loadLargeData()
    const result = await processData(largeData)
    return result
  } finally {
    // 及时释放大对象
    largeData = null
  }
}
```

### 数据库问题

#### 查询优化

```javascript
// 避免全表扫描
// 错误示例
db.collection('users').where({
  name: db.RegExp({
    regexp: '.*张.*',
    options: 'i'
  })
}).get()

// 正确示例：使用索引字段
db.collection('users').where({
  nameIndex: '张',  // 预处理的索引字段
  status: 'active'
}).get()
```

#### 并发控制

```javascript
// 使用事务处理并发更新
async function transferPoints(fromUserId, toUserId, points) {
  const transaction = await db.startTransaction()
  
  try {
    // 检查发送方余额
    const fromUser = await transaction.collection('users').doc(fromUserId).get()
    if (fromUser.data.points < points) {
      await transaction.rollback()
      return { success: false, error: '余额不足' }
    }
    
    // 扣除发送方积分
    await transaction.collection('users').doc(fromUserId).update({
      data: {
        points: db.command.inc(-points)
      }
    })
    
    // 增加接收方积分
    await transaction.collection('users').doc(toUserId).update({
      data: {
        points: db.command.inc(points)
      }
    })
    
    await transaction.commit()
    return { success: true }
  } catch (error) {
    await transaction.rollback()
    return { success: false, error: error.message }
  }
}
```

## 部署与运维

### 环境管理

```javascript
// 多环境配置
const config = {
  development: {
    env: 'dev-env-id',
    apiUrl: 'https://dev-api.example.com'
  },
  production: {
    env: 'prod-env-id',
    apiUrl: 'https://api.example.com'
  }
}

// 根据环境初始化
const currentEnv = process.env.NODE_ENV || 'development'
const envConfig = config[currentEnv]

wx.cloud.init({
  env: envConfig.env
})
```

### 版本管理

```javascript
// 云函数版本管理
exports.main = async (event, context) => {
  const version = '1.2.0'
  
  // 版本兼容性处理
  if (event.version && event.version < '1.0.0') {
    return await handleLegacyRequest(event)
  }
  
  return await handleCurrentRequest(event)
}
```

### 监控告警

```javascript
// 错误监控
exports.main = async (event, context) => {
  try {
    return await processRequest(event)
  } catch (error) {
    // 发送告警通知
    await sendAlertNotification({
      level: 'ERROR',
      function: context.function_name,
      error: error.message,
      event: event
    })
    
    throw error
  }
}

async function sendAlertNotification(alert) {
  // 发送到监控系统或通知服务
  console.error('[ALERT]', JSON.stringify(alert))
}
```

## 扩展资源

### 官方文档
- [微信小程序云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [云开发控制台](https://console.cloud.tencent.com/tcb)
- [云开发 SDK 文档](https://docs.cloudbase.net/)

### 学习资源
- 微信开发者社区
- 云开发官方教程
- GitHub 开源项目
- 技术博客和视频教程

### 工具推荐
- CloudBase CLI：命令行工具
- CloudBase Framework：应用开发框架
- 云开发扩展：VS Code 插件

通过本指南，你应该能够掌握小程序云开发的核心技能，包括云函数、云数据库、云存储和云调用的使用。云开发大大简化了小程序后端开发的复杂度，让开发者能够专注于业务逻辑的实现。
