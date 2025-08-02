# Chameleon

Chameleon（简称CML）是滴滴开源的一套代码运行多端的统一开发框架，提供标准的MVVM架构，统一各类终端API。用户只需要学会一套语法，就可以高效开发出能够同时在各个终端运行的应用。

## 📊 框架概览

- **开发者**: 滴滴出行
- **开源时间**: 2019年1月
- **开发语言**: JavaScript/TypeScript
- **语法风格**: 类Vue语法
- **官方网站**: [https://cml.js.org](https://cml.js.org)
- **GitHub**: [https://github.com/didi/chameleon](https://github.com/didi/chameleon)

## 🎯 框架特色

### 一套代码多端运行
- **6+个平台**: 支持Web、微信小程序、支付宝小程序、百度小程序、Android、iOS
- **统一语法**: 使用统一的CML语法开发
- **差异抹平**: 自动处理各平台间的差异
- **性能优化**: 针对各平台的性能优化

### 标准化开发
- **MVVM架构**: 标准的MVVM开发模式
- **组件化**: 完善的组件化开发体系
- **标准API**: 统一的跨端API标准
- **工程化**: 完整的工程化解决方案

### 渐进式接入
- **灵活接入**: 支持渐进式接入现有项目
- **平滑迁移**: 现有项目可平滑迁移到CML
- **兼容性**: 良好的向后兼容性
- **扩展性**: 强大的扩展能力

## 🛠️ 支持平台

### 移动端
- **iOS**: 编译为原生iOS应用
- **Android**: 编译为原生Android应用
- **React Native**: 支持RN开发模式
- **Weex**: 支持Weex开发模式

### 小程序
- **微信小程序**: 完整支持微信小程序
- **支付宝小程序**: 支持支付宝小程序
- **百度小程序**: 支持百度智能小程序
- **字节跳动小程序**: 支持抖音小程序

### Web端
- **H5**: 编译为标准Web应用
- **PWA**: 支持渐进式Web应用
- **响应式**: 支持响应式设计
- **SEO友好**: 支持服务端渲染

## 📱 开发体验

### CML组件开发
```html
<template>
  <view class="container">
    <text class="title">Hello Chameleon</text>
    <text class="count">点击次数: {{count}}</text>
    <button c-bind:onclick="handleClick">点击我</button>
  </view>
</template>

<script>
class Index {
  data = {
    count: 0
  }

  methods = {
    handleClick() {
      this.count++
    }
  }
}

export default new Index()
</script>

<style scoped>
.container {
  padding: 20cpx;
}
.title {
  font-size: 36cpx;
  font-weight: bold;
}
</style>
```

### 多态协议
```javascript
// 定义多态接口
<script cml-type="interface">
interface UtilsInterface {
  getSystemInfo(): Promise<Object>;
  showToast(options: Object): void;
}
</script>

// Web端实现
<script cml-type="web">
class Method implements UtilsInterface {
  getSystemInfo() {
    return Promise.resolve({
      platform: 'web',
      userAgent: navigator.userAgent
    })
  }
  
  showToast(options) {
    alert(options.title)
  }
}

export default new Method()
</script>

// 微信小程序端实现
<script cml-type="wx">
class Method implements UtilsInterface {
  getSystemInfo() {
    return new Promise((resolve) => {
      wx.getSystemInfo({
        success: resolve
      })
    })
  }
  
  showToast(options) {
    wx.showToast(options)
  }
}

export default new Method()
</script>
```

## 🎨 组件生态

### 内置组件
- **基础组件**: view、text、image等基础组件
- **表单组件**: input、button、switch等表单组件
- **布局组件**: scroller、list等布局组件
- **媒体组件**: video、audio等媒体组件

### CML UI
- **官方组件库**: 滴滴官方维护的UI组件库
- **多端适配**: 所有组件支持多端运行
- **主题定制**: 支持主题定制和样式覆盖
- **丰富组件**: 提供常用的UI组件

### 第三方组件
- **社区组件**: 活跃的社区贡献组件
- **业务组件**: 针对特定业务场景的组件
- **工具组件**: 各种实用工具组件
- **扩展组件**: 功能扩展组件

## 💰 商业应用

### 滴滴系应用
- **滴滴出行**: 主App的部分功能模块
- **滴滴企业版**: 企业出行服务
- **滴滴金融**: 金融服务应用
- **滴滴外卖**: 外卖配送服务

### 应用场景
- **出行服务**: 打车、导航、地图等出行应用
- **电商应用**: 商城、支付、物流等电商应用
- **企业应用**: OA、CRM、数据看板等企业应用
- **工具应用**: 实用工具、计算器、转换器等

## 📈 发展趋势

### 技术演进
- **性能优化**: 持续的运行时性能优化
- **编译优化**: 更好的编译时优化
- **开发体验**: 改进开发工具和调试体验
- **生态完善**: 完善组件和插件生态

### 平台扩展
- **新平台支持**: 支持更多新兴平台
- **深度优化**: 针对各平台的深度优化
- **标准制定**: 参与跨端开发标准制定
- **生态合作**: 与更多生态伙伴合作

## 🚀 快速开始

### 1. 环境准备
```bash
# 安装Node.js (>= 8.0.0)
node --version

# 安装CML CLI
npm install -g chameleon-tool

# 查看版本
cml --version
```

### 2. 创建项目
```bash
# 创建新项目
cml init project my-project

# 选择模板
# - 基础模板
# - TypeScript模板
# - 多端模板
```

### 3. 开发调试
```bash
# 进入项目目录
cd my-project

# 安装依赖
npm install

# 开发Web端
cml dev -t web

# 开发微信小程序
cml dev -t wx

# 开发原生应用
cml dev -t weex
```

### 4. 构建发布
```bash
# 构建Web端
cml build -t web

# 构建微信小程序
cml build -t wx

# 构建原生应用
cml build -t weex
```

## 📚 学习资源

### 官方文档
- [Chameleon官方文档](https://cml.js.org)
- [API参考](https://cml.js.org/doc/api/api.html)
- [组件文档](https://cml.js.org/doc/component/component.html)
- [多态协议](https://cml.js.org/doc/framework/polymorphism/polymorphism.html)

### 社区资源
- [Chameleon GitHub](https://github.com/didi/chameleon)
- [官方示例](https://github.com/didi/chameleon/tree/master/packages/cml-demo)
- [社区讨论](https://github.com/didi/chameleon/issues)
- [最佳实践](https://cml.js.org/doc/example/example.html)

### 视频教程
- [Chameleon入门教程](https://www.bilibili.com/video/BV1x7411m7bP)
- [跨端开发实战](https://juejin.cn/post/6844903792746708999)
- [滴滴技术分享](https://mp.weixin.qq.com/s/qbNNgUhbg8QQPHyNbVCzjw)
- [CML实战项目](https://segmentfault.com/a/1190000018097684)

## 🎯 最佳实践

### 项目结构
```
src/
├── pages/          # 页面文件
├── components/     # 公共组件
├── assets/         # 静态资源
├── utils/          # 工具函数
├── store/          # 状态管理
├── router/         # 路由配置
├── app/            # 应用配置
└── chameleon.config.js  # 构建配置
```

### 多态开发
- **接口定义**: 先定义统一的接口规范
- **平台实现**: 为每个平台提供具体实现
- **差异处理**: 使用多态协议处理平台差异
- **测试验证**: 在各平台上充分测试

### 性能优化
- **组件优化**: 合理使用组件和避免过度渲染
- **资源优化**: 优化图片和静态资源
- **代码分割**: 使用懒加载和代码分割
- **缓存策略**: 合理使用缓存提高性能

## 🔧 开发工具

### IDE支持
- **VS Code**: 官方推荐的开发工具
- **WebStorm**: JetBrains系列IDE支持
- **Atom**: 轻量级编辑器支持
- **Sublime Text**: 简洁的代码编辑器

### 调试工具
- **CML DevTools**: 官方开发者工具
- **Chrome DevTools**: Web端调试工具
- **小程序开发者工具**: 各平台小程序调试
- **原生调试工具**: iOS/Android调试工具

### 构建工具
- **Webpack**: 默认的构建工具
- **Babel**: JavaScript编译器
- **PostCSS**: CSS后处理器
- **ESLint**: 代码检查工具

## 📞 技术支持

### 官方支持
- **官方文档**: 详细的技术文档和开发指南
- **GitHub Issues**: 问题反馈和bug报告
- **官方论坛**: 技术讨论和经验分享
- **微信群**: 官方技术交流群

### 社区支持
- **掘金专栏**: Chameleon技术文章
- **知乎话题**: CML相关问题讨论
- **CSDN博客**: 中文技术博客和教程
- **开发者社区**: 活跃的开发者社区

### 滴滴支持
- **技术咨询**: 滴滴技术专家支持
- **最佳实践**: 滴滴内部最佳实践分享
- **培训服务**: 企业级技术培训
- **解决方案**: 完整的技术解决方案

### 企业服务
- **定制开发**: 企业级定制开发服务
- **技术咨询**: 专业技术咨询和架构设计
- **培训认证**: 团队技术培训和认证
- **运维支持**: 应用运维和监控服务

---

Chameleon作为滴滴开源的跨端开发框架，通过统一的语法和多态协议，为开发者提供了高效的多端开发解决方案。特别是在出行、电商和企业应用领域，展现了强大的跨端开发能力和商业价值。