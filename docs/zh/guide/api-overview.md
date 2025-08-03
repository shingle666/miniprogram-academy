# 小程序API概览

本文档提供了小程序开发中常用API的概览，帮助开发者快速了解和使用各平台提供的能力。

## API分类

小程序API通常可以分为以下几大类：

### 1. 基础API

基础API提供了小程序运行环境的基本功能和信息。

| API名称 | 说明 | 平台支持 |
| --- | --- | --- |
| getSystemInfo | 获取系统信息 | 全平台 |
| getLaunchOptionsSync | 获取小程序启动参数 | 全平台 |
| onError | 监听小程序错误 | 全平台 |
| onPageNotFound | 监听页面不存在错误 | 微信、支付宝、百度 |
| onUnhandledRejection | 监听未处理的Promise拒绝事件 | 微信、QQ |

### 2. 网络API

网络API提供了与服务器通信的能力。

| API名称 | 说明 | 平台支持 |
| --- | --- | --- |
| request | 发起网络请求 | 全平台 |
| uploadFile | 上传文件 | 全平台 |
| downloadFile | 下载文件 | 全平台 |
| connectSocket | 创建WebSocket连接 | 全平台 |
| onSocketOpen | 监听WebSocket连接打开 | 全平台 |

### 3. 存储API

存储API提供了数据持久化的能力。

| API名称 | 说明 | 平台支持 |
| --- | --- | --- |
| setStorage | 存储数据 | 全平台 |
| getStorage | 获取存储的数据 | 全平台 |
| removeStorage | 删除存储的数据 | 全平台 |
| clearStorage | 清空所有存储数据 | 全平台 |
| getStorageInfo | 获取存储信息 | 全平台 |

### 4. 媒体API

媒体API提供了图片、音频、视频等媒体处理能力。

| API名称 | 说明 | 平台支持 |
| --- | --- | --- |
| chooseImage | 选择图片 | 全平台 |
| previewImage | 预览图片 | 全平台 |
| getImageInfo | 获取图片信息 | 全平台 |
| saveImageToPhotosAlbum | 保存图片到相册 | 全平台 |
| createVideoContext | 创建视频上下文 | 全平台 |

### 5. 位置API

位置API提供了获取用户位置和地图交互的能力。

| API名称 | 说明 | 平台支持 |
| --- | --- | --- |
| getLocation | 获取当前位置 | 全平台 |
| chooseLocation | 选择位置 | 全平台 |
| openLocation | 打开位置 | 全平台 |
| createMapContext | 创建地图上下文 | 全平台 |

### 6. 设备API

设备API提供了访问设备硬件和系统功能的能力。

| API名称 | 说明 | 平台支持 |
| --- | --- | --- |
| scanCode | 扫码 | 全平台 |
| setClipboardData | 设置剪贴板内容 | 全平台 |
| getClipboardData | 获取剪贴板内容 | 全平台 |
| makePhoneCall | 拨打电话 | 全平台 |
| vibrateLong | 长振动 | 全平台 |

### 7. 界面API

界面API提供了控制界面显示和交互的能力。

| API名称 | 说明 | 平台支持 |
| --- | --- | --- |
| showToast | 显示消息提示框 | 全平台 |
| showLoading | 显示加载提示框 | 全平台 |
| showModal | 显示模态对话框 | 全平台 |
| showActionSheet | 显示操作菜单 | 全平台 |
| setNavigationBarTitle | 设置导航栏标题 | 全平台 |

### 8. 路由API

路由API提供了控制页面跳转和导航的能力。

| API名称 | 说明 | 平台支持 |
| --- | --- | --- |
| navigateTo | 保留当前页面，跳转到应用内的某个页面 | 全平台 |
| redirectTo | 关闭当前页面，跳转到应用内的某个页面 | 全平台 |
| navigateBack | 关闭当前页面，返回上一页面或多级页面 | 全平台 |
| switchTab | 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面 | 全平台 |
| reLaunch | 关闭所有页面，打开到应用内的某个页面 | 全平台 |

## 平台差异

虽然各个小程序平台提供了类似的API，但在具体实现和参数上可能存在差异。以下是一些常见的平台差异：

### 微信小程序特有API

- 开放数据：如获取用户信息、好友关系等
- 支付：微信支付相关接口
- 客服消息：接入微信客服
- 微信运动：获取微信运动步数
- 卡券：微信卡券相关接口

### 支付宝小程序特有API

- 支付宝支付：支付宝支付相关接口
- 会员卡：支付宝会员卡相关接口
- 生活号：关注生活号相关接口
- 营销工具：支付宝营销工具相关接口

### 百度小程序特有API

- 百度账号：百度账号相关接口
- 收银台：百度收银台相关接口
- 智能小程序：AI能力相关接口

### 字节跳动小程序特有API

- 视频内容：抖音、今日头条等内容相关接口
- 互动组件：点赞、评论等互动相关接口

## 跨平台开发

在进行跨平台小程序开发时，可以采用以下策略处理API差异：

1. **使用条件编译**：根据不同平台编写不同的代码
   ```js
   // #ifdef MP-WEIXIN
   wx.login({
     success: res => {
       // 微信登录逻辑
     }
   })
   // #endif
   
   // #ifdef MP-ALIPAY
   my.getAuthCode({
     success: res => {
       // 支付宝登录逻辑
     }
   })
   // #endif
   ```

2. **使用抽象层**：封装统一的接口，内部处理平台差异
   ```js
   function login() {
     if (process.env.MP_PLATFORM === 'WEIXIN') {
       return new Promise((resolve, reject) => {
         wx.login({
           success: resolve,
           fail: reject
         })
       })
     } else if (process.env.MP_PLATFORM === 'ALIPAY') {
       return new Promise((resolve, reject) => {
         my.getAuthCode({
           success: resolve,
           fail: reject
         })
       })
     }
   }
   ```

3. **使用跨平台框架**：如Taro、uni-app等，它们提供了统一的API，内部自动处理平台差异

## 最佳实践

1. **权限处理**：在使用需要用户授权的API前，先检查权限状态
   ```js
   wx.getSetting({
     success: res => {
       if (!res.authSetting['scope.userLocation']) {
         wx.authorize({
           scope: 'scope.userLocation',
           success: () => {
             wx.getLocation({
               // 获取位置
             })
           }
         })
       } else {
         wx.getLocation({
           // 获取位置
         })
       }
     }
   })
   ```

2. **错误处理**：为API调用添加完善的错误处理
   ```js
   wx.request({
     url: 'https://api.example.com/data',
     success: res => {
       // 处理成功响应
     },
     fail: err => {
       console.error('请求失败', err)
       wx.showToast({
         title: '网络异常，请重试',
         icon: 'none'
       })
     },
     complete: () => {
       // 无论成功失败都会执行
     }
   })
   ```

3. **Promise化**：将回调式API转换为Promise风格，提高代码可读性
   ```js
   function requestPromise(options) {
     return new Promise((resolve, reject) => {
       wx.request({
         ...options,
         success: resolve,
         fail: reject
       })
     })
   }
   
   // 使用
   async function getData() {
     try {
       const res = await requestPromise({
         url: 'https://api.example.com/data'
       })
       return res.data
     } catch (err) {
       console.error(err)
       throw err
     }
   }
   ```

## 相关文档

- [微信小程序API文档](https://developers.weixin.qq.com/miniprogram/dev/api/)
- [支付宝小程序API文档](https://opendocs.alipay.com/mini/api)
- [百度小程序API文档](https://smartprogram.baidu.com/docs/develop/api/apilist/)
- [字节跳动小程序API文档](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/api/foundation/tt.caniuse)
- [QQ小程序API文档](https://q.qq.com/wiki/develop/miniprogram/API/)