import { defineConfig } from 'vitepress'

export default defineConfig({
  // 配置干净的URL，移除.html后缀
  cleanUrls: true,
  
  // 基础路径配置
  base: '/',
  
  // 头部配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }],
    ['meta', { property: 'og:url', content: 'https://mp.ac.cn' }],
    ['meta', { property: 'og:type', content: 'website' }]
  ],
  
  // 多语言配置
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      title: '小程序研究院',
      description: '专业的小程序开发研究与资源平台',
      head: [
        ['meta', { name: 'keywords', content: '小程序,微信小程序,支付宝小程序,百度小程序,字节跳动小程序,QQ小程序,快手小程序,开发教程,框架对比' }],
        ['meta', { name: 'author', content: '小程序研究院' }],
        ['meta', { property: 'og:title', content: '小程序研究院 - 专业的小程序开发研究与资源平台' }],
        ['meta', { property: 'og:description', content: '提供全面的小程序开发教程、平台对比、框架分析和实战案例' }]
      ],
      themeConfig: {
        siteTitle: '小程序研究院',
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
              { text: '中文', link: '/' },
              { text: 'English', link: '/en/' }
            ]
          }
        ],
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
                { text: '网络请求', link: '/zh/network-request' },
                { text: '数据存储', link: '/zh/data-storage' },
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
          ]
        },
        footer: {
          message: '连接多端，赋能创新',
          copyright: 'Copyright © 2025 小程序研究院'
        },
        editLink: {
          pattern: 'https://github.com/shingle666/miniprogram-academy/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页面'
        },
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },
        docFooter: {
          prev: '上一页',
          next: '下一页'
        },
        outline: {
          label: '页面导航'
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式'
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'Mini Program Academy',
      description: 'Professional mini program development research and resource platform',
      head: [
        ['meta', { name: 'keywords', content: 'mini program,wechat mini program,alipay mini program,baidu smart program,bytedance mini program,qq mini program,kuaishou mini program,development tutorial,framework comparison' }],
        ['meta', { name: 'author', content: 'Mini Program Academy' }],
        ['meta', { property: 'og:title', content: 'Mini Program Academy - Professional Mini Program Development Platform' }],
        ['meta', { property: 'og:description', content: 'Comprehensive mini program development tutorials, platform comparisons, framework analysis and practical cases' }]
      ],
      themeConfig: {
        siteTitle: 'Mini Program Academy',
        nav: [
          { text: 'Home', link: '/en/' },
          { 
            text: 'Docs', 
            items: [
              { text: 'Quick Start', link: '/en/guide/getting-started' },
              { text: 'Basic Concepts', link: '/en/guide/basic-concepts' },
              { text: 'Advanced Guide', link: '/en/guide/advanced-features' }
            ]
          },
          { 
            text: 'Platforms', 
            items: [
              { text: 'WeChat Mini Program', link: '/en/platforms/wechat' },
              { text: 'Alipay Mini Program', link: '/en/platforms/alipay' },
              { text: 'Baidu Smart Program', link: '/en/platforms/baidu' },
              { text: 'ByteDance Mini Program', link: '/en/platforms/bytedance' },
              { text: 'QQ Mini Program', link: '/en/platforms/qq' },
              { text: 'Kuaishou Mini Program', link: '/en/platforms/kuaishou' }
            ]
          },
          { 
            text: 'Frameworks', 
            items: [
              { text: 'Taro', link: '/en/frameworks/taro' },
              { text: 'uni-app', link: '/en/frameworks/uni-app' },
              { text: 'Remax', link: '/en/frameworks/remax' },
              { text: 'Chameleon', link: '/en/frameworks/chameleon' }
            ]
          },
          { 
            text: 'Showcase', 
            items: [
              { text: 'Overview', link: '/en/showcase/' },
              { text: 'E-commerce', link: '/en/showcase/ecommerce/ecommerce-platform' },
              { text: 'Tools', link: '/en/showcase/tools/life-services' },
              { text: 'Education', link: '/en/showcase/education/online-learning' },
              { text: 'Lifestyle', link: '/en/showcase/lifestyle/food-service' },
              { text: 'Games', link: '/en/showcase/games/casual-games' },
              { text: 'Business', link: '/en/showcase/business/company-profile' }
            ]
          },
          { 
            text: 'Language', 
            items: [
              { text: '中文', link: '/' },
              { text: 'English', link: '/en/' }
            ]
          }
        ],
        sidebar: {
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
        footer: {
          message: 'Connecting Multiple Platforms, Empowering Innovation',
          copyright: 'Copyright © 2025 Mini Program Academy'
        },
        editLink: {
          pattern: 'https://github.com/shingle666/miniprogram-academy/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },
        lastUpdated: {
          text: 'Last updated',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        outline: {
          label: 'On this page'
        },
        returnToTopLabel: 'Return to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme'
      }
    }
  },

  // 主题配置
  themeConfig: {
    logo: '/logo.svg',
    i18nRouting: true,
    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shingle666/miniprogram-academy' }
    ],

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
          },
          en: {
            translations: {
              button: {
                buttonText: 'Search docs',
                buttonAriaLabel: 'Search docs'
              },
              modal: {
                noResultsText: 'No results found',
                resetButtonTitle: 'Clear search query',
                footer: {
                  selectText: 'Select',
                  navigateText: 'Navigate'
                }
              }
            }
          }
        }
      }
    }
  },

  // Markdown配置
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
    config: (md) => {
      // 可以在这里添加markdown插件
    }
  },

  // 开发服务器配置已移除 - VitePress 配置中不支持
  
  // Sitemap 配置
  sitemap: {
    hostname: 'https://mp.ac.cn',
    transformItems: (items) => {
      return items.map(item => {
        if (item.url.includes('/zh/') || (!item.url.includes('/en/') && item.url !== '/')) {
          return {
            ...item,
            changefreq: 'weekly',
            priority: 0.8
          }
        }
        if (item.url.includes('/en/')) {
          return {
            ...item,
            changefreq: 'monthly',
            priority: 0.5
          }
        }
        if (item.url === '/' || item.url === '/zh/' || item.url === '/en/') {
          return {
            ...item,
            changefreq: 'daily',
            priority: 1.0
          }
        }
        return item
      })
    }
  }
})