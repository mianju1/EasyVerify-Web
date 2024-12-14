<template>
  <Transition name="message">
    <div v-if="visible" :class="['message-alert', type]">
      <i :class="['icon', iconClass]"></i>
      <span class="content">{{ content }}</span>
      <i class="close-icon" @click="close">×</i>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const visible = ref(false)
const content = ref('')
const type = ref('info')
const timer = ref(null)

const iconClass = computed(() => {
  const icons = {
    success: 'success-icon',
    info: 'info-icon',
    warning: 'warning-icon',
    error: 'error-icon'
  }
  return icons[type.value]
})

const show = ({ content: msg, type: msgType = 'info', duration = 3000 }) => {
  content.value = msg
  type.value = msgType
  visible.value = true

  if (timer.value) {
    clearTimeout(timer.value)
  }

  timer.value = setTimeout(() => {
    visible.value = false
  }, duration)
}

const close = () => {
  visible.value = false
}

defineExpose({
  show
})
</script>

<style scoped>
.message-alert {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 9999;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 320px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.icon {
  font-size: 16px;
  width: 16px;
  height: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.content {
  flex: 1;
  text-align: center;
}

.close-icon {
  cursor: pointer;
  font-size: 16px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-icon:hover {
  opacity: 1;
}

/* 成功类型 */
.success {
  background-color: #f0f9eb;
  color: #67c23a;
  border: 1px solid #e1f3d8;
}

.success .success-icon::before {
  content: "✓";
}

/* 信息类型 */
.info {
  background-color: #f4f4f5;
  color: #909399;
  border: 1px solid #e9e9eb;
}

.info .info-icon::before {
  content: "ℹ";
}

/* 警告类型 */
.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
  border: 1px solid #faecd8;
}

.warning .warning-icon::before {
  content: "!";
}

/* 错误类型 */
.error {
  background-color: #fef0f0;
  color: #f56c6c;
  border: 1px solid #fde2e2;
}

.error .error-icon::before {
  content: "×";
}

/* 过渡动画 */
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease-out;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

/* 深色模式适配 */
:global(.dark) .message-alert {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}

:global(.dark) .success {
  background-color: rgba(103, 194, 58, 0.1);
  border-color: rgba(103, 194, 58, 0.2);
}

:global(.dark) .info {
  background-color: rgba(144, 147, 153, 0.1);
  border-color: rgba(144, 147, 153, 0.2);
}

:global(.dark) .warning {
  background-color: rgba(230, 162, 60, 0.1);
  border-color: rgba(230, 162, 60, 0.2);
}

:global(.dark) .error {
  background-color: rgba(245, 108, 108, 0.1);
  border-color: rgba(245, 108, 108, 0.2);
}
</style>
