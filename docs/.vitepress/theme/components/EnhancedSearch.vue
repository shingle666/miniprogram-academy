<template>
  <div class="enhanced-search">
    <el-input
      v-model="searchQuery"
      class="search-input"
      size="large"
      placeholder="搜索文档、案例、工具..."
      :prefix-icon="Search"
      :loading="loading"
      @input="handleSearch"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      clearable
    >
      <template #append>
        <el-button :icon="Search" @click="performSearch" />
      </template>
    </el-input>
    
    <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions">
      <div
        v-for="item in suggestions"
        :key="item.id"
        class="search-suggestion-item"
        @click="selectSuggestion(item)"
      >
        <div class="suggestion-title">{{ item.title }}</div>
        <div class="suggestion-type">{{ getTypeLabel(item.type) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vitepress'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const searchQuery = ref('')
const showSuggestions = ref(false)
const searchTimeout = ref(null)
const loading = ref(false)
const suggestions = ref([])

// 模拟搜索数据
const searchData = [
  { id: 1, title: '第一个小程序', type: 'doc', url: '/docs/zh/first-app' },
  { id: 2, title: '项目结构', type: 'doc', url: '/docs/zh/project-structure' },
  { id: 3, title: '配置详解', type: 'doc', url: '/docs/zh/configuration' },
  { id: 4, title: '页面开发', type: 'doc', url: '/docs/zh/page-development' },
  { id: 5, title: '组件开发', type: 'doc', url: '/docs/zh/component-development' },
  { id: 6, title: 'API使用', type: 'doc', url: '/docs/zh/api-usage' },
  { id: 7, title: '数据存储', type: 'doc', url: '/docs/zh/data-storage' },
  { id: 8, title: '网络请求', type: 'doc', url: '/docs/zh/network-request' },
  { id: 9, title: '性能优化', type: 'doc', url: '/docs/zh/performance' },
  { id: 10, title: '代码审核', type: 'doc', url: '/docs/zh/code-review' },
  { id: 11, title: '发布部署', type: 'doc', url: '/docs/zh/deployment' },
  { id: 12, title: '版本控制', type: 'doc', url: '/docs/zh/version-control' },
  { id: 13, title: '案例展示', type: 'showcase', url: '/docs/zh/showcase/' },
  { id: 14, title: '开发工具', type: 'tool', url: '/docs/zh/tools/' },
  { id: 15, title: '社区交流', type: 'community', url: '/docs/zh/community/' }
]

const handleSearch = (value) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  if (value.length < 2) {
    suggestions.value = []
    return
  }
  
  loading.value = true
  searchTimeout.value = setTimeout(() => {
    // 模拟搜索
    const results = searchData.filter(item => 
      item.title.toLowerCase().includes(value.toLowerCase())
    )
    suggestions.value = results.slice(0, 8) // 限制显示8个结果
    loading.value = false
  }, 300)
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    handleSearch(searchQuery.value)
    showSuggestions.value = true
  }
}

const selectSuggestion = (item) => {
  if (typeof window !== 'undefined') {
    router.go(item.url)
    showSuggestions.value = false
    searchQuery.value = ''
    
    // 显示跳转消息
    ElMessage({
      message: `已跳转到 ${item.title}`,
      type: 'success',
      duration: 2000
    })
  }
}

const handleBlur = () => {
  // 延迟隐藏建议，允许点击
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

const getTypeLabel = (type) => {
  const labels = {
    doc: '文档',
    showcase: '案例',
    tool: '工具',
    community: '社区'
  }
  return labels[type] || '其他'
}

onMounted(() => {
  // 键盘快捷键支持
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        const searchInput = document.querySelector('.search-input input')
        if (searchInput) {
          searchInput.focus()
        }
      }
    })
  }
})
</script>

<style scoped>
.enhanced-search {
  position: relative;
  margin: 2rem 0;
}

.search-input {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 4px;
}

.search-suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s;
}

.search-suggestion-item:hover {
  background-color: var(--el-bg-color-page);
}

.search-suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-title {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
}

.suggestion-type {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-color-primary-light-9);
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}
</style>