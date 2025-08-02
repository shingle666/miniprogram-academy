# 第一个小程序

本指南将带您从零开始创建您的第一个小程序，涵盖项目初始化、基本页面开发和发布流程。

## 🎯 学习目标

完成本教程后，您将能够：
- 创建一个完整的小程序项目
- 理解小程序的基本结构
- 开发简单的页面和组件
- 掌握基本的API调用
- 完成小程序的测试和发布

## 📋 准备工作

### 开发环境要求
- **操作系统**：Windows 7+、macOS 10.10+、Linux
- **开发工具**：微信开发者工具（推荐最新版本）
- **账号准备**：微信小程序开发账号

### 注册小程序账号
1. 访问 [微信公众平台](https://mp.weixin.qq.com/)
2. 点击"立即注册" → 选择"小程序"
3. 填写账号信息并完成邮箱验证
4. 完成身份认证（个人或企业）
5. 获取 AppID（应用ID）

## 🚀 创建项目

### 1. 启动开发者工具
1. 下载并安装微信开发者工具
2. 使用微信扫码登录
3. 选择"小程序项目"

### 2. 新建项目
```bash
项目名称：我的第一个小程序
目录：选择空文件夹
AppID：填入您的小程序AppID
开发模式：小程序
后端服务：不使用云服务
```

### 3. 选择模板
- **不使用模板**：从空白项目开始
- **JavaScript基础模板**：包含基本页面结构
- **TypeScript模板**：支持类型检查

## 📁 项目结构

创建完成后，您会看到以下目录结构：

```
my-first-miniprogram/
├── pages/           # 页面文件
│   ├── index/      # 首页
│   │   ├── index.js
│   │   ├── index.json
│   │   ├── index.wxml
│   │   └── index.wxss
│   └── logs/       # 日志页面
├── utils/          # 工具函数
│   └── util.js
├── app.js          # 小程序逻辑
├── app.json        # 小程序配置
├── app.wxss        # 全局样式
├── project.config.json  # 项目配置
└── sitemap.json    # 站点地图
```

## 🎨 开发首页

### 1. 修改首页布局 (index.wxml)
```xml
<view class="container">
  <view class="header">
    <text class="title">欢迎使用小程序</text>
    <text class="subtitle">这是我的第一个小程序</text>
  </view>
  
  <view class="content">
    <button class="btn-primary" bindtap="onGetUserInfo">
      获取用户信息
    </button>
    
    <view class="user-info" wx:if="{{userInfo}}">
      <image class="avatar" src="{{userInfo.avatarUrl}}" />
      <text class="nickname">{{userInfo.nickName}}</text>
    </view>
  </view>
  
  <view class="footer">
    <text class="tips">点击按钮体验功能</text>
  </view>
</view>
```

### 2. 添加样式 (index.wxss)
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 20rpx;
}

.subtitle {
  display: block;
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.8);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #07c160;
  color: white;
  border-radius: 50rpx;
  padding: 20rpx 60rpx;
  font-size: 32rpx;
  border: none;
  margin-bottom: 40rpx;
}

.btn-primary:hover {
  background: #06ad56;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 40rpx;
  border-radius: 20rpx;
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-bottom: 20rpx;
}

.nickname {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
}

.footer {
  margin-top: 60rpx;
}

.tips {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.6);
}
```

### 3. 添加逻辑 (index.js)
```javascript
Page({
  data: {
    userInfo: null,
    hasUserInfo: false
  },

  onLoad() {
    console.log('页面加载完成')
  },

  onGetUserInfo() {
    const that = this
    
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('获取用户信息成功', res)
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        
        // 显示成功提示
        wx.showToast({
          title: '获取成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (err) => {
        console.error('获取用户信息失败', err)
        wx.showToast({
          title: '获取失败',
          icon: 'error',
          duration: 2000
        })
      }
    })
  },

  onShareAppMessage() {
    return {
      title: '我的第一个小程序',
      path: '/pages/index/index'
    }
  }
})
```

## 🔧 添加新页面

### 1. 创建关于页面
在 `pages` 目录下创建 `about` 文件夹，包含以下文件：

**about.wxml**
```xml
<view class="container">
  <view class="header">
    <text class="title">关于我们</text>
  </view>
  
  <view class="content">
    <view class="info-card">
      <text class="label">应用名称</text>
      <text class="value">我的第一个小程序</text>
    </view>
    
    <view class="info-card">
      <text class="label">版本号</text>
      <text class="value">1.0.0</text>
    </view>
    
    <view class="info-card">
      <text class="label">开发者</text>
      <text class="value">小程序研究院</text>
    </view>
  </view>
  
  <view class="footer">
    <button class="btn-back" bindtap="goBack">返回首页</button>
  </view>
</view>
```

**about.js**
```javascript
Page({
  data: {},

  onLoad() {
    wx.setNavigationBarTitle({
      title: '关于我们'
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
```

### 2. 配置页面路由
在 `app.json` 中添加新页面：

```json
{
  "pages": [
    "pages/index/index",
    "pages/about/about",
    "pages/logs/logs"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "我的第一个小程序",
    "navigationBarTextStyle": "black"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "images/icon_home.png",
        "selectedIconPath": "images/icon_home_selected.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/about/about",
        "iconPath": "images/icon_about.png",
        "selectedIconPath": "images/icon_about_selected.png",
        "text": "关于"
      }
    ]
  }
}
```

## 🧪 测试功能

### 1. 预览测试
- 点击开发者工具中的"预览"按钮
- 使用手机微信扫描二维码
- 在真机上测试各项功能

### 2. 调试工具
- **Console**：查看日志输出
- **Network**：监控网络请求
- **Storage**：查看本地存储
- **AppData**：查看页面数据

### 3. 性能优化
```javascript
// 页面性能监控
Page({
  onLoad() {
    const startTime = Date.now()
    
    // 页面加载完成后计算耗时
    wx.nextTick(() => {
      const loadTime = Date.now() - startTime
      console.log(`页面加载耗时: ${loadTime}ms`)
    })
  }
})
```

## 📱 发布上线

### 1. 代码审核
- 点击"上传"按钮提交代码
- 填写版本号和项目备注
- 等待代码上传完成

### 2. 提交审核
1. 登录微信公众平台
2. 进入"版本管理"页面
3. 点击"提交审核"
4. 填写审核信息
5. 等待审核结果（通常1-7个工作日）

### 3. 发布上线
- 审核通过后点击"发布"
- 小程序正式上线
- 用户可以搜索和使用

## 🎉 恭喜完成

您已经成功创建了第一个小程序！接下来可以：

1. **学习更多API** - 探索微信小程序丰富的API
2. **优化用户体验** - 添加动画、交互效果
3. **集成后端服务** - 连接数据库和服务器
4. **发布更多版本** - 持续迭代和改进

## 📚 延伸阅读

- [小程序开发指南](./getting-started.md)
- [项目结构详解](./project-structure.md)
- [API使用教程](./api-usage.md)
- [性能优化技巧](./performance.md)

---

🚀 **开始您的小程序开发之旅吧！**