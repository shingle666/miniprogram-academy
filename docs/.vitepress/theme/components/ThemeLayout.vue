<template>
  <div class="theme-container" :class="{ 'dark-mode': isDarkMode }">
    <Layout>
      <template #layout-top>
        <notification-center />
      </template>
      
      <!-- <template #nav-bar-content-after>
        <div class="theme-toggle">
          <el-switch
            v-model="isDarkMode"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            @change="toggleTheme"
          />
        </div>
      </template> -->
      
      <template #doc-before>
        <enhanced-search v-if="showSearch" />
      </template>
      
      <template #doc-footer-before>
        <div class="page-actions">
          <el-button
            class="favorite-button"
            :icon="isFavorited ? StarFilled : Star"
            :type="isFavorited ? 'warning' : ''"
            text
            @click="toggleFavorite"
          >
            {{ isFavorited ? '已收藏' : '收藏页面' }}
          </el-button>
          
          <el-button
            class="feedback-button"
            text
            @click="showFeedbackDialog = true"
          >
            💬 反馈建议
          </el-button>
        </div>
      </template>
      
      <template #aside-outline-after>
        <div v-if="showFavorites" class="sidebar-panel">
          <h3 class="sidebar-heading">个人中心</h3>
          <favorites-panel @browse="browsePage" />
        </div>
      </template>
    </Layout>
    
    <!-- 反馈对话框 -->
    <el-dialog
      v-model="showFeedbackDialog"
      title="反馈建议"
      width="500px"
      destroy-on-close
    >
      <el-form :model="feedbackForm" label-position="top">
        <el-form-item label="反馈类型">
          <el-select v-model="feedbackForm.type" placeholder="请选择反馈类型">
            <el-option label="内容错误" value="content" />
            <el-option label="功能建议" value="feature" />
            <el-option label="问题报告" value="bug" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="反馈内容">
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            rows="4"
            placeholder="请详细描述您的反馈或建议..."
          />
        </el-form-item>
        <el-form-item label="联系方式（选填）">
          <el-input v-model="feedbackForm.contact" placeholder="邮箱或其他联系方式" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showFeedbackDialog = false">取消</el-button>
          <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useData, useRoute, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import {
  Moon,
  Sunny,
  Star,
  StarFilled
} from '@element-plus/icons-vue'

import EnhancedSearch from './EnhancedSearch.vue'
import NotificationCenter from './NotificationCenter.vue'
import FavoritesPanel from './FavoritesPanel.vue'

const { Layout } = DefaultTheme
const { frontmatter, page, theme } = useData()
const route = useRoute()
const router = useRouter()
const store = useStore()

// 主题切换
const isDarkMode = ref(store.state.theme === 'dark')

const toggleTheme = (value) => {
  const newTheme = value ? 'dark' : 'light'
  store.commit('SET_THEME', newTheme)
  document.documentElement.classList.toggle('dark', value)
}

// 语言切换
const currentLanguage = computed(() => store.state.language)
const currentLanguageLabel = computed(() => currentLanguage.value === 'zh' ? '中文' : 'English')

const switchLanguage = (lang) => {
  if (lang === currentLanguage.value) return
  
  store.commit('SET_LANGUAGE', lang)
  
  // 切换语言路由
  const currentPath = route.path
  let newPath = currentPath
  
  if (lang === 'zh') {
    newPath = currentPath.replace(/^\/en\//, '/')
  } else {
    if (!currentPath.startsWith('/en/')) {
      newPath = '/en' + currentPath
    }
  }
  
  if (newPath !== currentPath) {
    router.go(newPath)
  }
}

// 收藏功能
const isFavorited = computed(() => {
  return store.state.favorites.some(item => item.id === route.path)
})

const toggleFavorite = () => {
  if (isFavorited.value) {
    store.commit('REMOVE_FROM_FAVORITES', route.path)
    ElMessage({
      message: '已从收藏夹移除',
      type: 'info',
      duration: 2000
    })
  } else {
    const pageTitle = page.value.title || route.path.split('/').pop() || '未命名页面'
    const pageType = getPageType(route.path)
    
    store.commit('ADD_TO_FAVORITES', {
      id: route.path,
      title: pageTitle,
      url: route.path,
      type: pageType,
      timestamp: Date.now()
    })
    
    ElMessage({
      message: '已添加到收藏夹',
      type: 'success',
      duration: 2000
    })
  }
}

const getPageType = (path) => {
  if (path.includes('/docs/')) return 'doc'
  if (path.includes('/showcase/')) return 'showcase'
  if (path.includes('/tools/')) return 'tool'
  if (path.includes('/community/')) return 'community'
  return 'other'
}

// 反馈功能
const showFeedbackDialog = ref(false)
const feedbackForm = ref({
  type: '',
  content: '',
  contact: '',
  page: ''
})

const submitFeedback = () => {
  if (!feedbackForm.value.type || !feedbackForm.value.content) {
    ElMessage({
      message: '请填写反馈类型和内容',
      type: 'warning'
    })
    return
  }
  
  // 在实际应用中，这里会发送到后端API
  // 这里使用模拟数据
  feedbackForm.value.page = route.path
  
  store.dispatch('showNotification', {
    title: '反馈已提交',
    message: '感谢您的反馈，我们会尽快处理',
    type: 'success',
    duration: 3000
  })
  
  showFeedbackDialog.value = false
  feedbackForm.value = {
    type: '',
    content: '',
    contact: '',
    page: ''
  }
}

// 页面导航
const browsePage = () => {
  router.go('/')
}

// 条件显示组件
const showSearch = computed(() => {
  // 在首页和文档页显示搜索
  return !frontmatter.value.hideSearch
})

const showFavorites = computed(() => {
  // 在文档页显示收藏面板
  return route.path.includes('/docs/') || route.path.includes('/showcase/') || route.path.includes('/tools/')
})

// 初始化
onMounted(() => {
  // 初始化主题
  document.documentElement.classList.toggle('dark', isDarkMode.value)
  
  // 添加到最近浏览
  const pageTitle = page.value.title || route.path.split('/').pop() || '未命名页面'
  store.commit('ADD_TO_RECENT_VIEWS', {
    id: route.path,
    title: pageTitle,
    url: route.path,
    timestamp: Date.now()
  })
})

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    // 添加到最近浏览
    const pageTitle = page.value.title || newPath.split('/').pop() || '未命名页面'
    store.commit('ADD_TO_RECENT_VIEWS', {
      id: newPath,
      title: pageTitle,
      url: newPath,
      timestamp: Date.now()
    })
  }
)
</script>

<style scoped>
.theme-container {
  --transition-duration: 0.3s;
}

.language-switch {
  margin-right: 16px;
}

.language-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: var(--vp-c-text-1);
  transition: color var(--transition-duration);
}

.language-dropdown-link:hover {
  color: var(--el-color-primary);
}

.theme-toggle {
  margin-left: 16px;
}

.page-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.favorite-button,
.feedback-button {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sidebar-panel {
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.sidebar-heading {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
  padding: 0 16px;
}

@media (max-width: 768px) {
  .language-switch,
  .theme-toggle {
    margin: 0 8px;
  }
  
  .page-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>