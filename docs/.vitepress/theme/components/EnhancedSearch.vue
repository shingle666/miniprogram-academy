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
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

const searchQuery = ref('')
const showSuggestions = ref(false)
const searchTimeout = ref(null)

const loading = computed(() => store.state.loading)
const suggestions = computed(() => store.state.searchResults)

const handleSearch = (value) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  if (value.length < 2) {
    store.commit('SET_SEARCH_RESULTS', [])
    return
  }
  
  searchTimeout.value = setTimeout(() => {
    store.dispatch('searchContent', value)
  }, 300)
}

const performSearch = () => {
  if (searchQuery.value.trim()) {
    store.dispatch('searchContent', searchQuery.value)
    showSuggestions.value = true
  }
}

const selectSuggestion = (item) => {
  router.push(item.url)
  showSuggestions.value = false
  searchQuery.value = ''
  
  // 添加到收藏建议
  ElMessage({
    message: `已跳转到 ${item.title}`,
    type: 'success',
    duration: 2000
  })
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
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      document.querySelector('.search-input input')?.focus()
    }
  })
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