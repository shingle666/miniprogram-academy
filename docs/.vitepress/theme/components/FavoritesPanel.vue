<template>
  <div class="favorites-panel">
    <el-tabs v-model="activeTab" class="favorites-tabs">
      <el-tab-pane label="收藏夹" name="favorites">
        <div v-if="favorites.length === 0" class="empty-state">
          <el-empty description="暂无收藏内容">
            <el-button type="primary" @click="$emit('browse')">
              去浏览内容
            </el-button>
          </el-empty>
        </div>
        <div v-else class="favorites-list">
          <div
            v-for="item in favorites"
            :key="item.id"
            class="favorite-item"
          >
            <div class="item-content">
              <div class="item-icon">
                <el-icon v-if="item.type === 'doc'">
                  <Document />
                </el-icon>
                <el-icon v-else-if="item.type === 'showcase'">
                  <Picture />
                </el-icon>
                <el-icon v-else-if="item.type === 'tool'">
                  <Tools />
                </el-icon>
                <el-icon v-else>
                  <Link />
                </el-icon>
              </div>
              <div class="item-info">
                <a :href="item.url" class="item-title">{{ item.title }}</a>
                <div class="item-meta">
                  <span class="item-type">{{ getTypeLabel(item.type) }}</span>
                  <span class="item-time">{{ formatTime(item.timestamp) }}</span>
                </div>
              </div>
            </div>
            <el-button
              class="remove-button"
              :icon="Delete"
              size="small"
              text
              type="danger"
              @click="removeFavorite(item.id)"
            />
          </div>
        </div>
      </el-tab-pane>
      
      <el-tab-pane label="最近浏览" name="recent">
        <div v-if="recentViews.length === 0" class="empty-state">
          <el-empty description="暂无浏览记录" />
        </div>
        <div v-else class="recent-list">
          <div
            v-for="item in recentViews"
            :key="item.id"
            class="recent-item"
          >
            <div class="item-content">
              <div class="item-info">
                <a :href="item.url" class="item-title">{{ item.title }}</a>
                <div class="item-meta">
                  <span class="item-time">{{ formatTime(item.timestamp) }}</span>
                </div>
              </div>
            </div>
            <el-button
              class="favorite-toggle"
              :icon="isFavorited(item.id) ? StarFilled : Star"
              :type="isFavorited(item.id) ? 'warning' : 'default'"
              size="small"
              text
              @click="toggleFavorite(item)"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import {
  Document,
  Picture,
  Tools,
  Link,
  Delete,
  Star,
  StarFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

defineEmits(['browse'])

const store = useStore()
const activeTab = ref('favorites')

const favorites = computed(() => store.state.favorites)
const recentViews = computed(() => store.state.recentViews)

const getTypeLabel = (type) => {
  const labels = {
    doc: '文档',
    showcase: '案例',
    tool: '工具',
    community: '社区'
  }
  return labels[type] || '其他'
}

const formatTime = (timestamp) => {
  const now = Date.now()
  const diff = now - timestamp
  
  if (diff < 60000) {
    return '刚刚'
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分钟前`
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}小时前`
  } else if (diff < 604800000) {
    return `${Math.floor(diff / 86400000)}天前`
  } else {
    return new Date(timestamp).toLocaleDateString()
  }
}

const removeFavorite = (id) => {
  store.commit('REMOVE_FROM_FAVORITES', id)
  ElMessage({
    message: '已从收藏夹移除',
    type: 'success',
    duration: 2000
  })
}

const isFavorited = (id) => {
  return favorites.value.some(item => item.id === id)
}

const toggleFavorite = (item) => {
  if (isFavorited(item.id)) {
    store.commit('REMOVE_FROM_FAVORITES', item.id)
    ElMessage({
      message: '已从收藏夹移除',
      type: 'info',
      duration: 2000
    })
  } else {
    const favoriteItem = {
      ...item,
      timestamp: Date.now()
    }
    store.commit('ADD_TO_FAVORITES', favoriteItem)
    ElMessage({
      message: '已添加到收藏夹',
      type: 'success',
      duration: 2000
    })
  }
}
</script>

<style scoped>
.favorites-panel {
  background: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.favorites-tabs :deep(.el-tabs__header) {
  margin-bottom: 16px;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
}

.favorites-list,
.recent-list {
  max-height: 400px;
  overflow-y: auto;
}

.favorite-item,
.recent-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
  transition: background-color 0.2s;
}

.favorite-item:hover,
.recent-item:hover {
  background-color: var(--el-bg-color);
  margin: 0 -8px;
  padding: 12px 8px;
  border-radius: 6px;
}

.favorite-item:last-child,
.recent-item:last-child {
  border-bottom: none;
}

.item-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.item-icon {
  flex-shrink: 0;
  color: var(--el-text-color-secondary);
}

.item-icon .el-icon {
  font-size: 16px;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  display: block;
  color: var(--el-text-color-primary);
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-title:hover {
  color: var(--el-color-primary);
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.item-type {
  background: var(--el-color-primary-light-9);
  color: var(--el-color-primary);
  padding: 2px 6px;
  border-radius: 10px;
}

.remove-button,
.favorite-toggle {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
}

.favorite-item:hover .remove-button,
.recent-item:hover .favorite-toggle {
  opacity: 1;
}

.favorite-toggle.is-active {
  opacity: 1;
}

/* 自定义滚动条 */
.favorites-list::-webkit-scrollbar,
.recent-list::-webkit-scrollbar {
  width: 6px;
}

.favorites-list::-webkit-scrollbar-track,
.recent-list::-webkit-scrollbar-track {
  background: var(--el-bg-color);
  border-radius: 3px;
}

.favorites-list::-webkit-scrollbar-thumb,
.recent-list::-webkit-scrollbar-thumb {
  background: var(--el-border-color);
  border-radius: 3px;
}

.favorites-list::-webkit-scrollbar-thumb:hover,
.recent-list::-webkit-scrollbar-thumb:hover {
  background: var(--el-text-color-secondary);
}
</style>