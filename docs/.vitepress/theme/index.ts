import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import { createStore } from 'vuex'
import axios from 'axios'
import './custom.css'

// 导入自定义组件
import ThemeLayout from './components/ThemeLayout.vue'
import HomePage from './components/HomePage.vue'
import EnhancedSearch from './components/EnhancedSearch.vue'
import NotificationCenter from './components/NotificationCenter.vue'
import FavoritesPanel from './components/FavoritesPanel.vue'

// 创建 Vuex store
const store = createStore({
  state: {
    user: null,
    theme: 'light',
    language: 'zh',
    loading: false,
    notifications: [],
    searchResults: [],
    favorites: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('favorites') || '[]') : [],
    recentViews: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('recentViews') || '[]') : []
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_THEME(state, theme) {
      state.theme = theme
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme)
      }
    },
    SET_LANGUAGE(state, language) {
      state.language = language
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', language)
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.push({
        id: Date.now(),
        ...notification
      })
    },
    REMOVE_NOTIFICATION(state, id) {
      state.notifications = state.notifications.filter(n => n.id !== id)
    },
    SET_SEARCH_RESULTS(state, results) {
      state.searchResults = results
    },
    ADD_TO_FAVORITES(state, item) {
      if (!state.favorites.find(f => f.id === item.id)) {
        state.favorites.push(item)
        if (typeof window !== 'undefined') {
          localStorage.setItem('favorites', JSON.stringify(state.favorites))
        }
      }
    },
    REMOVE_FROM_FAVORITES(state, id) {
      state.favorites = state.favorites.filter(f => f.id !== id)
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.favorites))
      }
    },
    ADD_TO_RECENT_VIEWS(state, item) {
      const existing = state.recentViews.findIndex(r => r.id === item.id)
      if (existing !== -1) {
        state.recentViews.splice(existing, 1)
      }
      state.recentViews.unshift(item)
      if (state.recentViews.length > 10) {
        state.recentViews = state.recentViews.slice(0, 10)
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('recentViews', JSON.stringify(state.recentViews))
      }
    }
  },
  actions: {
    async fetchUserData({ commit }) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get('/api/user')
        commit('SET_USER', response.data)
      } catch (error) {
        console.error('获取用户数据失败:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },
    async searchContent({ commit }, query) {
      commit('SET_LOADING', true)
      try {
        const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`)
        commit('SET_SEARCH_RESULTS', response.data)
      } catch (error) {
        console.error('搜索失败:', error)
        // 使用模拟数据
        commit('SET_SEARCH_RESULTS', [
          { id: 1, title: '微信小程序开发指南', type: 'doc', url: '/docs/zh/wechat-guide' },
          { id: 2, title: 'Taro 跨平台开发', type: 'doc', url: '/docs/zh/taro-development' },
          { id: 3, title: '电商小程序案例', type: 'showcase', url: '/showcase/ecommerce' }
        ])
      } finally {
        commit('SET_LOADING', false)
      }
    },
    showNotification({ commit }, notification) {
      commit('ADD_NOTIFICATION', notification)
      setTimeout(() => {
        commit('REMOVE_NOTIFICATION', notification.id)
      }, notification.duration || 3000)
    }
  }
})

// 配置 axios
axios.defaults.baseURL = 'https://api.mp.ac.cn'
axios.defaults.timeout = 10000

// 请求拦截器
axios.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
      store.commit('SET_USER', null)
    }
    return Promise.reject(error)
  }
)

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(ThemeLayout)
  },
  enhanceApp({ app, router, siteData }) {
    // 注册 Element Plus
    app.use(ElementPlus)
    
    // 注册 Vuex store
    app.use(store)
    
    // 全局注册 axios
    app.config.globalProperties.$http = axios
    app.provide('$http', axios)
    
    // 注册自定义组件
    app.component('HomePage', HomePage)
    app.component('EnhancedSearch', EnhancedSearch)
    app.component('NotificationCenter', NotificationCenter)
    app.component('FavoritesPanel', FavoritesPanel)
    
    // 初始化主题
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') || 'light'
      store.commit('SET_THEME', savedTheme)
      
      // 初始化语言
      const savedLanguage = localStorage.getItem('language') || 'zh'
      store.commit('SET_LANGUAGE', savedLanguage)
    }
    
    // 路由守卫 - 仅在客户端环境中设置
    if (typeof window !== 'undefined' && router && typeof router.beforeEach === 'function') {
      router.beforeEach((to, from, next) => {
        // 添加到最近浏览
        if (to.path !== from.path) {
          store.commit('ADD_TO_RECENT_VIEWS', {
            id: to.path,
            title: to.meta?.title || to.path,
            url: to.path,
            timestamp: Date.now()
          })
        }
        next()
      })
    }
  }
}