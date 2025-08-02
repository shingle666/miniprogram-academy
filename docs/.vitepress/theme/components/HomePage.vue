<template>
  <div class="home-container">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">小程序研究院</h1>
        <p class="hero-description">专业的小程序开发研究与资源平台</p>
        <div class="hero-actions">
          <el-button type="primary" size="large" class="hero-button" @click="navigateTo('/docs/zh/')">
            开始学习
          </el-button>
          <el-button size="large" class="hero-button" @click="navigateTo('/showcase/')">
            查看案例
          </el-button>
        </div>
        <div class="hero-stats">
          <div class="stat-item">
            <div class="stat-number">9+</div>
            <div class="stat-label">支持平台</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50亿+</div>
            <div class="stat-label">用户覆盖</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">1000+</div>
            <div class="stat-label">精选案例</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">5000+</div>
            <div class="stat-label">开发者</div>
          </div>
        </div>
      </div>
      <div class="hero-image">
        <img src="/hero-image.svg" alt="小程序研究院" />
      </div>
    </section>

    <!-- 特色功能 -->
    <section class="features-section">
      <h2 class="section-title">平台特色</h2>
      <div class="features-grid">
        <el-card v-for="(feature, index) in features" :key="index" class="feature-card">
          <div class="feature-icon">
            <el-icon :size="32">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
        </el-card>
      </div>
    </section>

    <!-- 平台展示 -->
    <section class="platforms-section">
      <h2 class="section-title">支持的小程序平台</h2>
      <div class="platforms-grid">
        <el-card v-for="(platform, index) in platforms" :key="index" class="platform-card">
          <div class="platform-header" :style="{ background: platform.color }">
            <span class="platform-icon">{{ platform.icon }}</span>
            <h3 class="platform-name">{{ platform.name }}</h3>
          </div>
          <div class="platform-content">
            <div class="platform-stats">
              <div class="platform-users">{{ platform.users }}</div>
              <div class="platform-scene">{{ platform.scene }}</div>
            </div>
            <el-button type="primary" text @click="navigateTo(platform.link)">
              查看文档
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 开发框架 -->
    <section class="frameworks-section">
      <h2 class="section-title">主流开发框架</h2>
      <div class="frameworks-grid">
        <el-card v-for="(framework, index) in frameworks" :key="index" class="framework-card">
          <div class="framework-logo">{{ framework.logo }}</div>
          <h3 class="framework-name">{{ framework.name }}</h3>
          <p class="framework-description">{{ framework.description }}</p>
          <el-button type="primary" text @click="navigateTo(framework.link)">
            了解更多
          </el-button>
        </el-card>
      </div>
    </section>

    <!-- 技术趋势 -->
    <section class="trends-section">
      <h2 class="section-title">技术发展趋势</h2>
      <div class="trends-container">
        <div class="trends-column">
          <h3 class="trends-subtitle">当前热点</h3>
          <ul class="trends-list">
            <li v-for="(trend, index) in currentTrends" :key="index" class="trend-item">
              <div class="trend-icon">
                <el-icon :size="24">
                  <component :is="trend.icon" />
                </el-icon>
              </div>
              <div class="trend-content">
                <h4 class="trend-title">{{ trend.title }}</h4>
                <p class="trend-description">{{ trend.description }}</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="trends-column">
          <h3 class="trends-subtitle">未来方向</h3>
          <ul class="trends-list">
            <li v-for="(trend, index) in futureTrends" :key="index" class="trend-item">
              <div class="trend-icon">
                <el-icon :size="24">
                  <component :is="trend.icon" />
                </el-icon>
              </div>
              <div class="trend-content">
                <h4 class="trend-title">{{ trend.title }}</h4>
                <p class="trend-description">{{ trend.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- 快速开始 -->
    <section class="quickstart-section">
      <h2 class="section-title">快速开始</h2>
      <el-steps :active="1" finish-status="success" simple>
        <el-step title="选择平台" description="根据项目需求选择合适的小程序平台" />
        <el-step title="环境搭建" description="安装开发工具和配置开发环境" />
        <el-step title="学习基础" description="掌握小程序开发的基本概念和技术" />
        <el-step title="构建应用" description="开发并发布您的第一个小程序" />
      </el-steps>
      <div class="quickstart-actions">
        <el-button type="primary" @click="navigateTo('/docs/zh/getting-started')">
          开始学习
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vitepress'
import {
  Document,
  Collection,
  Tools,
  User,
  Connection,
  Histogram,
  ArrowRight,
  Share,
  Monitor,
  Platform,
  Cpu,
  MagicStick,
  Link,
  DataAnalysis
} from '@element-plus/icons-vue'

const router = useRouter()

const navigateTo = (path) => {
  if (typeof window !== 'undefined') {
    // 在浏览器环境中使用 VitePress 路由
    router.go(path)
  }
}

const features = [
  {
    icon: Document,
    title: '完整的开发文档',
    description: '涵盖所有主流平台和框架的详细指南，从入门到精通的全面学习路径'
  },
  {
    icon: Collection,
    title: '丰富的案例展示',
    description: '精选优质小程序案例，涵盖电商、工具、教育等多个行业的实际应用'
  },
  {
    icon: Tools,
    title: '专业的开发工具',
    description: '整合各平台开发工具、UI组件库和辅助工具，提高开发效率'
  },
  {
    icon: User,
    title: '活跃的开发社区',
    description: '多平台开发者交流学习的互动平台，分享经验和解决问题'
  },
  {
    icon: Connection,
    title: '跨平台解决方案',
    description: '一套代码适配多个小程序平台的最佳实践和技术方案'
  },
  {
    icon: Histogram,
    title: '性能优化指南',
    description: '各平台性能优化技巧和监控方案，提升小程序体验'
  }
]

const platforms = [
  {
    icon: '🟢',
    name: '微信小程序',
    color: 'linear-gradient(135deg, #07c160 0%, #10b981 100%)',
    users: '10亿+ 用户',
    scene: '社交、电商、生活服务',
    link: '/docs/zh/wechat/'
  },
  {
    icon: '🔵',
    name: '支付宝小程序',
    color: 'linear-gradient(135deg, #1677ff 0%, #0ea5e9 100%)',
    users: '7亿+ 用户',
    scene: '金融、商业、政务',
    link: '/docs/zh/alipay/'
  },
  {
    icon: '🟡',
    name: '百度智能小程序',
    color: 'linear-gradient(135deg, #315efb 0%, #4f46e5 100%)',
    users: '5亿+ 用户',
    scene: '搜索、信息、AI应用',
    link: '/docs/zh/baidu/'
  },
  {
    icon: '🔴',
    name: '抖音小程序',
    color: 'linear-gradient(135deg, #fe2c55 0%, #f43f5e 100%)',
    users: '6亿+ 用户',
    scene: '内容、娱乐、电商',
    link: '/docs/zh/bytedance/'
  },
  {
    icon: '🟠',
    name: 'QQ小程序',
    color: 'linear-gradient(135deg, #12b7f5 0%, #0ea5e9 100%)',
    users: '8亿+ 用户',
    scene: '社交、游戏、娱乐',
    link: '/docs/zh/qq/'
  },
  {
    icon: '🟣',
    name: '快手小程序',
    color: 'linear-gradient(135deg, #fe4f70 0%, #f43f5e 100%)',
    users: '3亿+ 用户',
    scene: '短视频、直播、电商',
    link: '/docs/zh/kuaishou/'
  }
]

const frameworks = [
  {
    logo: '🚀',
    name: 'Taro',
    description: '京东开源，React语法，一套代码多端运行',
    link: '/docs/zh/frameworks/taro/'
  },
  {
    logo: '⚡',
    name: 'uni-app',
    description: 'DCloud开发，Vue语法，覆盖H5/App/小程序',
    link: '/docs/zh/frameworks/uniapp/'
  },
  {
    logo: '🔥',
    name: 'Remax',
    description: '阿里开源，使用React开发小程序',
    link: '/docs/zh/frameworks/remax/'
  },
  {
    logo: '💫',
    name: 'Chameleon',
    description: '滴滴开源，一套代码运行多端',
    link: '/docs/zh/frameworks/chameleon/'
  }
]

const currentTrends = [
  {
    icon: Share,
    title: '跨平台统一',
    description: '一套代码适配多个小程序平台，降低开发和维护成本'
  },
  {
    icon: Platform,
    title: '云原生架构',
    description: 'Serverless、微服务、容器化技术在小程序开发中的应用'
  },
  {
    icon: MagicStick,
    title: 'AI集成',
    description: '智能客服、图像识别、语音处理等AI能力的集成'
  },
  {
    icon: Histogram,
    title: '性能优化',
    description: '预加载、缓存策略、包体积优化等提升用户体验的技术'
  }
]

const futureTrends = [
  {
    icon: Cpu,
    title: 'WebAssembly支持',
    description: '引入高性能计算能力，支持更复杂的应用场景'
  },
  {
    icon: Monitor,
    title: 'AR/VR集成',
    description: '增强现实和虚拟现实技术在小程序中的应用'
  },
  {
    icon: Link,
    title: 'IoT连接',
    description: '小程序与物联网设备的连接和控制能力'
  },
  {
    icon: DataAnalysis,
    title: '边缘计算',
    description: '就近处理数据，降低延迟，提升用户体验'
  }
]
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 英雄区域 */
.hero-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin: 60px 0;
}

.hero-content {
  flex: 1;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 16px;
}

.hero-description {
  font-size: 20px;
  color: var(--el-text-color-primary);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.hero-button {
  min-width: 120px;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.hero-image {
  flex: 1;
  max-width: 500px;
}

.hero-image img {
  width: 100%;
  height: auto;
}

/* 通用部分 */
.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: var(--el-text-color-primary);
}

/* 特色功能 */
.features-section {
  margin: 80px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  color: var(--el-color-primary);
  margin-bottom: 16px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.feature-description {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
}

/* 平台展示 */
.platforms-section {
  margin: 80px 0;
}

.platforms-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.platform-card {
  height: 100%;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.platform-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  color: white;
  border-radius: 8px 8px 0 0;
}

.platform-icon {
  font-size: 24px;
}

.platform-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.platform-content {
  padding: 16px;
}

.platform-stats {
  margin-bottom: 16px;
}

.platform-users {
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--el-text-color-primary);
}

.platform-scene {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

/* 开发框架 */
.frameworks-section {
  margin: 80px 0;
}

.frameworks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.framework-card {
  height: 100%;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.framework-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.framework-logo {
  font-size: 48px;
  margin-bottom: 16px;
}

.framework-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--el-text-color-primary);
}

.framework-description {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin-bottom: 16px;
}

/* 技术趋势 */
.trends-section {
  margin: 80px 0;
}

.trends-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.trends-subtitle {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--el-text-color-primary);
  text-align: center;
}

.trends-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.trend-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--el-bg-color-page);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.trend-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.trend-icon {
  color: var(--el-color-primary);
}

.trend-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
  color: var(--el-text-color-primary);
}

.trend-description {
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.6;
  margin: 0;
}

/* 快速开始 */
.quickstart-section {
  margin: 80px 0;
  padding: 40px;
  background: var(--el-bg-color-page);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.quickstart-actions {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .features-grid,
  .platforms-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .frameworks-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
  }
  
  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .features-grid,
  .platforms-grid,
  .frameworks-grid {
    grid-template-columns: 1fr;
  }
  
  .trends-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .hero-actions {
    justify-content: center;
  }
}
</style>