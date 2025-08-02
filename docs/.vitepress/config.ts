import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '小程序研究院',
  description: '专业的小程序开发研究与资源平台',
  ignoreDeadLinks: true,
  
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: '小程序研究院',
      description: '专业的小程序开发研究与资源平台',
      themeConfig: {
        nav: [
          { text: '首页', link: '/' },
          { text: '开发文档', link: '/zh/' },
          { text: '案例展示', link: '/zh/showcase/' },
          { text: '开发工具', link: '/zh/tools/' },
          { text: '社区论坛', link: '/zh/community/' },
        ],
        sidebar: {
          '/zh/': [
            {
              text: '快速开始',
              items: [
                { text: '介绍', link: '/zh/' },
                { text: '环境搭建', link: '/zh/getting-started' },
                { text: '第一个小程序', link: '/zh/first-app' },
              ]
            },
            {
              text: '基础开发',
              items: [
                { text: '项目结构', link: '/zh/project-structure' },
                { text: '配置文件', link: '/zh/configuration' },
                { text: '页面开发', link: '/zh/page-development' },
                { text: '组件开发', link: '/zh/component-development' },
              ]
            },
            {
              text: '进阶功能',
              items: [
                { text: 'API调用', link: '/zh/api-usage' },
                { text: '数据存储', link: '/zh/data-storage' },
                { text: '网络请求', link: '/zh/network-request' },
                { text: '性能优化', link: '/zh/performance' },
              ]
            },
            {
              text: '发布部署',
              items: [
                { text: '代码审核', link: '/zh/code-review' },
                { text: '版本管理', link: '/zh/version-control' },
                { text: '发布流程', link: '/zh/deployment' },
              ]
            }
          ],
          '/zh/showcase/': [
            {
              text: '案例分类',
              items: [
                { text: '电商类', link: '/zh/showcase/ecommerce' },
                { text: '工具类', link: '/zh/showcase/tools' },
                { text: '游戏类', link: '/zh/showcase/games' },
                { text: '社交类', link: '/zh/showcase/social' },
                { text: '教育类', link: '/zh/showcase/education' },
              ]
            }
          ],
          '/zh/tools/': [
            {
              text: '开发工具',
              items: [
                { text: '微信开发者工具', link: '/zh/tools/wechat-devtools' },
                { text: '代码生成器', link: '/zh/tools/code-generator' },
                { text: '调试工具', link: '/zh/tools/debug-tools' },
              ]
            },
            {
              text: 'UI组件库',
              items: [
                { text: 'WeUI', link: '/zh/tools/weui' },
                { text: 'Vant Weapp', link: '/zh/tools/vant-weapp' },
                { text: 'ColorUI', link: '/zh/tools/colorui' },
              ]
            }
          ]
        },
        editLink: {
          pattern: 'https://github.com/shingle666/miniprogram-academy/edit/main/docs/:path',
          text: '在 GitHub 上编辑此页'
        },
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'medium'
          }
        },
        footer: {
          message: '让小程序开发更简单',
          copyright: 'Copyright © 2025 小程序研究院 (mp.ac.cn)'
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'MiniProgram Academy',
      description: 'Professional Mini-Program Development Research & Resource Platform',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Documentation', link: '/en/' },
          { text: 'Showcase', link: '/en/showcase/' },
          { text: 'Tools', link: '/en/tools/' },
          { text: 'Community', link: '/en/community/' },
        ],
        sidebar: {
          '/en/': [
            {
              text: 'Getting Started',
              items: [
                { text: 'Introduction', link: '/en/' },
                { text: 'Environment Setup', link: '/en/getting-started' },
                { text: 'First Mini-Program', link: '/en/first-app' },
              ]
            },
            {
              text: 'Basic Development',
              items: [
                { text: 'Project Structure', link: '/en/project-structure' },
                { text: 'Configuration', link: '/en/configuration' },
                { text: 'Page Development', link: '/en/page-development' },
                { text: 'Component Development', link: '/en/component-development' },
              ]
            },
            {
              text: 'Advanced Features',
              items: [
                { text: 'API Usage', link: '/en/api-usage' },
                { text: 'Data Storage', link: '/en/data-storage' },
                { text: 'Network Requests', link: '/en/network-request' },
                { text: 'Performance Optimization', link: '/en/performance' },
              ]
            },
            {
              text: 'Deployment',
              items: [
                { text: 'Code Review', link: '/en/code-review' },
                { text: 'Version Control', link: '/en/version-control' },
                { text: 'Publishing Process', link: '/en/deployment' },
              ]
            }
          ],
          '/en/showcase/': [
            {
              text: 'Categories',
              items: [
                { text: 'E-commerce', link: '/en/showcase/ecommerce' },
                { text: 'Tools', link: '/en/showcase/tools' },
                { text: 'Games', link: '/en/showcase/games' },
                { text: 'Social', link: '/en/showcase/social' },
                { text: 'Education', link: '/en/showcase/education' },
              ]
            }
          ],
          '/en/tools/': [
            {
              text: 'Development Tools',
              items: [
                { text: 'WeChat DevTools', link: '/en/tools/wechat-devtools' },
                { text: 'Code Generator', link: '/en/tools/code-generator' },
                { text: 'Debug Tools', link: '/en/tools/debug-tools' },
              ]
            },
            {
              text: 'UI Libraries',
              items: [
                { text: 'WeUI', link: '/en/tools/weui' },
                { text: 'Vant Weapp', link: '/en/tools/vant-weapp' },
                { text: 'ColorUI', link: '/en/tools/colorui' },
              ]
            }
          ]
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
        footer: {
          message: 'Making Mini-Program Development Easier',
          copyright: 'Copyright © 2025 MiniProgram Academy (mp.ac.cn)'
        }
      }
    }
  },
  
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['link', { rel: 'alternate icon', href: '/favicon.ico' }],
    ['meta', { name: 'keywords', content: '小程序,微信小程序,开发文档,案例展示,开发工具,社区论坛,mini-program,wechat,development' }],
    ['meta', { property: 'og:title', content: '小程序研究院 - MiniProgram Academy' }],
    ['meta', { property: 'og:description', content: '专业的小程序开发研究与资源平台 - Professional Mini-Program Development Platform' }],
    ['meta', { property: 'og:image', content: '/hero-image.svg' }],
    ['meta', { property: 'og:url', content: 'https://mp.ac.cn/' }],
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '小程序研究院',
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/shingle666/miniprogram-academy' },
    ],

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
    }
  },

  markdown: {
    theme: 'github-dark',
    lineNumbers: true
  }
})