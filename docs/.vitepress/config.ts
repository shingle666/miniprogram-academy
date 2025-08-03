import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '小程序研究院',
  description: '专业的小程序开发研究与资源平台',
  lang: 'zh-CN',
  
  // 配置干净的URL，移除.html后缀
  cleanUrls: true,
  
  // 基础路径配置
  base: '/',
  
  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { name: 'keywords', content: '小程序,微信小程序,支付宝小程序,百度小程序,字节跳动小程序,QQ小程序,快手小程序,开发教程,框架对比' }],
    ['meta', { name: 'author', content: '小程序研究院' }],
    ['meta', { property: 'og:title', content: '小程序研究院 - 专业的小程序开发研究与资源平台' }],
    ['meta', { property: 'og:description', content: '提供全面的小程序开发教程、平台对比、框架分析和实战案例' }],
    ['meta', { property: 'og:url', content: 'https://mp.ac.cn' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],

  // 主题配置
  themeConfig: {
    // 网站标题和logo
    siteTitle: '小程序研究院',
    logo: '/logo.svg',
    
    // 导航栏配置
    nav: [
      { text: '首页', link: '/' },
      { 
        text: '文档', 
        items: [
          { text: '快速开始', link: '/zh/guide/getting-started' },
          { text: '基础教程', link: '/zh/guide/basic-concepts' },
          { text: '进阶指南', link: '/zh/guide/advanced-features' }
        ]
      },
      { 
        text: '平台对比', 
        items: [
          { text: '微信小程序', link: '/zh/platforms/wechat' },
          { text: '支付宝小程序', link: '/zh/platforms/alipay' },
          { text: '百度小程序', link: '/zh/platforms/baidu' },
          { text: '字节跳动小程序', link: '/zh/platforms/bytedance' },
          { text: 'QQ小程序', link: '/zh/platforms/qq' },
          { text: '快手小程序', link: '/zh/platforms/kuaishou' }
        ]
      },
      { 
        text: '开发框架', 
        items: [
          { text: 'Taro', link: '/zh/frameworks/taro' },
          { text: 'uni-app', link: '/zh/frameworks/uni-app' },
          { text: 'Remax', link: '/zh/frameworks/remax' },
          { text: 'Chameleon', link: '/zh/frameworks/chameleon' }
        ]
      },
      { 
        text: '案例展示', 
        items: [
          { text: '概览', link: '/zh/showcase/' },
          { text: '电商类', link: '/zh/showcase/ecommerce/ecommerce-platform' },
          { text: '工具类', link: '/zh/showcase/tools/life-services' },
          { text: '教育类', link: '/zh/showcase/education/online-learning' },
          { text: '生活类', link: '/zh/showcase/lifestyle/food-service' },
          { text: '游戏类', link: '/zh/showcase/games/casual-games' },
          { text: '商务类', link: '/zh/showcase/business/company-profile' }
        ]
      },
      { 
        text: '语言', 
        items: [
          { text: '中文', link: '/zh/' },
          { text: 'English', link: '/en/' }
        ]
      }
    ],

    // 侧边栏配置
    sidebar: {
      '/zh/guide/': [
        {
          text: '开始使用',
          items: [
            { text: '快速开始', link: '/zh/guide/getting-started' },
            { text: '基础概念', link: '/zh/guide/basic-concepts' },
            { text: '开发环境', link: '/zh/guide/development-environment' }
          ]
        },
        {
          text: '基础教程',
          items: [
            { text: '项目结构', link: '/zh/guide/project-structure' },
            { text: '页面开发', link: '/zh/guide/page-development' },
            { text: '组件开发', link: '/zh/guide/component-development' },
            { text: '数据绑定', link: '/zh/guide/data-binding' },
            { text: '事件处理', link: '/zh/guide/event-handling' }
          ]
        },
        {
          text: '进阶指南',
          items: [
            { text: '高级特性', link: '/zh/guide/advanced-features' },
            { text: '性能优化', link: '/zh/guide/performance-optimization' },
            { text: '调试技巧', link: '/zh/guide/debugging-tips' },
            { text: '发布部署', link: '/zh/guide/deployment' }
          ]
        },
        {
          text: 'API参考',
          items: [
            { text: 'API概览', link: '/zh/guide/api-overview' },
            { text: '网络请求', link: '/zh/guide/network-requests' },
            { text: '数据存储', link: '/zh/guide/data-storage' },
            { text: '设备能力', link: '/zh/guide/device-capabilities' }
          ]
        }
      ],
      '/zh/platforms/': [
        {
          text: '平台对比',
          items: [
            { text: '微信小程序', link: '/zh/platforms/wechat' },
            { text: '支付宝小程序', link: '/zh/platforms/alipay' },
            { text: '百度小程序', link: '/zh/platforms/baidu' },
            { text: '字节跳动小程序', link: '/zh/platforms/bytedance' },
            { text: 'QQ小程序', link: '/zh/platforms/qq' },
            { text: '快手小程序', link: '/zh/platforms/kuaishou' }
          ]
        }
      ],
      '/zh/frameworks/': [
        {
          text: '开发框架',
          items: [
            { text: 'Taro', link: '/zh/frameworks/taro' },
            { text: 'uni-app', link: '/zh/frameworks/uni-app' },
            { text: 'Remax', link: '/zh/frameworks/remax' },
            { text: 'Chameleon', link: '/zh/frameworks/chameleon' }
          ]
        }
      ],
      '/zh/showcase/': [
        {
          text: '案例展示',
          items: [
            { text: '概览', link: '/zh/showcase/' },
          ]
        },
        {
          text: '电商类',
          items: [
            { text: '电商平台', link: '/zh/showcase/ecommerce/ecommerce-platform' },
            { text: '社交电商', link: '/zh/showcase/ecommerce/social-commerce' },
            { text: '线下门店', link: '/zh/showcase/ecommerce/offline-store' },
          ]
        },
        {
          text: '工具类',
          items: [
            { text: '生活服务', link: '/zh/showcase/tools/life-services' },
            { text: '日程管理', link: '/zh/showcase/tools/schedule-management' },
            { text: '文件转换', link: '/zh/showcase/tools/file-converter' },
          ]
        },
        {
          text: '教育类',
          items: [
            { text: '在线学习', link: '/zh/showcase/education/online-learning' },
            { text: '语言学习', link: '/zh/showcase/education/language-learning' },
            { text: '考试培训', link: '/zh/showcase/education/exam-training' },
          ]
        },
        {
          text: '生活类',
          items: [
            { text: '餐饮服务', link: '/zh/showcase/lifestyle/food-service' },
            { text: '旅行服务', link: '/zh/showcase/lifestyle/travel-service' },
            { text: '健康管理', link: '/zh/showcase/lifestyle/health-management' },
          ]
        },
        {
          text: '游戏类',
          items: [
            { text: '休闲游戏', link: '/zh/showcase/games/casual-games' },
            { text: '社交游戏', link: '/zh/showcase/games/social-games' },
            { text: '教育游戏', link: '/zh/showcase/games/educational-games' },
          ]
        },
        {
          text: '商务类',
          items: [
            { text: '企业简介', link: '/zh/showcase/business/company-profile' },
            { text: '预约系统', link: '/zh/showcase/business/appointment-system' },
            { text: '客户管理', link: '/zh/showcase/business/crm-system' },
          ]
        }
      ],
      '/en/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Quick Start', link: '/en/guide/getting-started' },
            { text: 'Basic Concepts', link: '/en/guide/basic-concepts' },
            { text: 'Development Environment', link: '/en/guide/development-environment' }
          ]
        },
        {
          text: 'Basic Tutorial',
          items: [
            { text: 'Project Structure', link: '/en/guide/project-structure' },
            { text: 'Page Development', link: '/en/guide/page-development' },
            { text: 'Component Development', link: '/en/guide/component-development' },
            { text: 'Data Binding', link: '/en/guide/data-binding' },
            { text: 'Event Handling', link: '/en/guide/event-handling' }
          ]
        },
        {
          text: 'Advanced Guide',
          items: [
            { text: 'Advanced Features', link: '/en/guide/advanced-features' },
            { text: 'Performance Optimization', link: '/en/guide/performance-optimization' },
            { text: 'Debugging Tips', link: '/en/guide/debugging-tips' },
            { text: 'Deployment', link: '/en/guide/deployment' }
          ]
        },
        {
          text: 'API Reference',
          items: [
            { text: 'API Overview', link: '/en/guide/api-overview' },
            { text: 'Network Requests', link: '/en/guide/network-requests' },
            { text: 'Data Storage', link: '/en/guide/data-storage' },
            { text: 'Device Capabilities', link: '/en/guide/device-capabilities' }
          ]
        }
      ],
      '/en/platforms/': [
        {
          text: 'Platform Comparison',
          items: [
            { text: 'WeChat Mini Program', link: '/en/platforms/wechat' },
            { text: 'Alipay Mini Program', link: '/en/platforms/alipay' },
            { text: 'Baidu Smart Program', link: '/en/platforms/baidu' },
            { text: 'ByteDance Mini Program', link: '/en/platforms/bytedance' },
            { text: 'QQ Mini Program', link: '/en/platforms/qq' },
            { text: 'Kuaishou Mini Program', link: '/en/platforms/kuaishou' }
          ]
        }
      ],
      '/en/frameworks/': [
        {
          text: 'Development Frameworks',
          items: [
            { text: 'Taro', link: '/en/frameworks/taro' },
            { text: 'uni-app', link: '/en/frameworks/uni-app' },
            { text: 'Remax', link: '/en/frameworks/remax' },
            { text: 'Chameleon', link: '/en/frameworks/chameleon' }
          ]
        }
      ],
      '/en/showcase/': [
        {
          text: 'Showcase',
          items: [
            { text: 'Overview', link: '/en/showcase/' },
          ]
        },
        {
          text: 'E-commerce',
          items: [
            { text: 'E-commerce Platform', link: '/en/showcase/ecommerce/ecommerce-platform' },
            { text: 'Social Commerce', link: '/en/showcase/ecommerce/social-commerce' },
            { text: 'Offline Store', link: '/en/showcase/ecommerce/offline-store' },
          ]
        },
        {
          text: 'Tools',
          items: [
            { text: 'Life Services', link: '/en/showcase/tools/life-services' },
            { text: 'Schedule Management', link: '/en/showcase/tools/schedule-management' },
            { text: 'File Converter', link: '/en/showcase/tools/file-converter' },
          ]
        },
        {
          text: 'Education',
          items: [
            { text: 'Online Learning', link: '/en/showcase/education/online-learning' },
            { text: 'Language Learning', link: '/en/showcase/education/language-learning' },
            { text: 'Exam Training', link: '/en/showcase/education/exam-training' },
          ]
        },
        {
          text: 'Lifestyle',
          items: [
            { text: 'Food Service', link: '/en/showcase/lifestyle/food-service' },
            { text: 'Travel Service', link: '/en/showcase/lifestyle/travel-service' },
            { text: 'Health Management', link: '/en/showcase/lifestyle/health-management' },
          ]
        },
        {
          text: 'Games',
          items: [
            { text: 'Casual Games', link: '/en/showcase/games/casual-games' },
            { text: 'Social Games', link: '/en/showcase/games/social-games' },
            { text: 'Educational Games', link: '/en/showcase/games/educational-games' },
          ]
        },
        {
          text: 'Business',
          items: [
            { text: 'Company Profile', link: '/en/showcase/business/company-profile' },
            { text: 'Appointment System', link: '/en/showcase/business/appointment-system' },
            { text: 'CRM System', link: '/en/showcase/business/crm-system' },
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shingle666/miniprogram-academy' }
    ],

    // 页脚配置
    footer: {
      message: '连接多端，赋能创新',
      copyright: 'Copyright © 2025 小程序研究院'
    },

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    // 编辑链接
    /* editLink: {
      pattern: 'https://github.com/shingle666/miniprogram-academy/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页面'
    }, */

    // 最后更新时间
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 文档页脚导航
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      label: '页面导航'
    },

    // 返回顶部
    returnToTopLabel: '回到顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 深色模式切换标签
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  },

  // Markdown配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    // 移除 languages 配置，使用默认支持的语言
    config: (md) => {
      // 可以在这里添加markdown插件
    }
  },

  // 构建配置
  build: {
    outDir: '../dist'
  },

  // 开发服务器配置
  server: {
    port: 5173,
    host: true
  }
})