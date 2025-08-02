<template>
  <teleport to="body">
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="['notification-item', notification.type]"
        >
          <div class="notification-content">
            <div class="notification-icon">
              <el-icon v-if="notification.type === 'success'">
                <SuccessFilled />
              </el-icon>
              <el-icon v-else-if="notification.type === 'error'">
                <CircleCloseFilled />
              </el-icon>
              <el-icon v-else-if="notification.type === 'warning'">
                <WarningFilled />
              </el-icon>
              <el-icon v-else>
                <InfoFilled />
              </el-icon>
            </div>
            <div class="notification-text">
              <div class="notification-title">{{ notification.title }}</div>
              <div v-if="notification.message" class="notification-message">
                {{ notification.message }}
              </div>
            </div>
            <el-button
              class="notification-close"
              :icon="Close"
              size="small"
              text
              @click="removeNotification(notification.id)"
            />
          </div>
          <div v-if="notification.progress !== undefined" class="notification-progress">
            <el-progress
              :percentage="notification.progress"
              :show-text="false"
              :stroke-width="3"
            />
          </div>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import {
  SuccessFilled,
  CircleCloseFilled,
  WarningFilled,
  InfoFilled,
  Close
} from '@element-plus/icons-vue'

const store = useStore()

const notifications = computed(() => store.state.notifications)

const removeNotification = (id) => {
  store.commit('REMOVE_NOTIFICATION', id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  max-width: 400px;
  pointer-events: none;
}

.notification-item {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  pointer-events: auto;
}

.notification-item.success {
  border-left: 4px solid var(--el-color-success);
}

.notification-item.error {
  border-left: 4px solid var(--el-color-error);
}

.notification-item.warning {
  border-left: 4px solid var(--el-color-warning);
}

.notification-item.info {
  border-left: 4px solid var(--el-color-primary);
}

.notification-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

.notification-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-icon .el-icon {
  font-size: 18px;
}

.notification-item.success .notification-icon {
  color: var(--el-color-success);
}

.notification-item.error .notification-icon {
  color: var(--el-color-error);
}

.notification-item.warning .notification-icon {
  color: var(--el-color-warning);
}

.notification-item.info .notification-icon {
  color: var(--el-color-primary);
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-message {
  color: var(--el-text-color-regular);
  font-size: 14px;
  line-height: 1.4;
}

.notification-close {
  flex-shrink: 0;
  margin-top: -4px;
  margin-right: -4px;
}

.notification-progress {
  padding: 0 16px 12px;
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

@media (max-width: 768px) {
  .notification-container {
    left: 10px;
    right: 10px;
    max-width: none;
  }
  
  .notification-content {
    padding: 12px;
  }
}
</style>