<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- 背景遮罩 -->
      <Transition name="fade">
        <div class="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
      </Transition>
      
      <!-- 弹窗内容 -->
      <div class="flex items-center justify-center min-h-screen p-4">
        <Transition name="scale">
          <div class="bg-white rounded-xl shadow-2xl w-96 transform transition-all">
            <!-- 弹窗头部 -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-center">
                <div :class="iconWrapperClass">
                  <svg class="w-6 h-6" :class="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="level === 'info'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path v-if="level === 'warn'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    <path v-if="level === 'error'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <h3 class="mt-4 text-lg font-medium text-center text-gray-900">
                {{ title }}
              </h3>
              <p class="mt-2 text-sm text-center text-gray-500">
                {{ message }}
              </p>
            </div>
            
            <!-- 弹窗按钮 -->
            <div class="flex items-center justify-center space-x-3 p-6">
              <button @click="$emit('cancel')" 
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors">
                取消
              </button>
              <button @click="$emit('confirm')" 
                      :class="confirmButtonClass"
                      class="px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors">
                确定
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    level: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'warn', 'error'].includes(value)
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  computed: {
    iconWrapperClass() {
      return {
        'bg-blue-100 rounded-full p-3': this.level === 'info',
        'bg-yellow-100 rounded-full p-3': this.level === 'warn',
        'bg-red-100 rounded-full p-3': this.level === 'error'
      }
    },
    iconClass() {
      return {
        'text-blue-600': this.level === 'info',
        'text-yellow-600': this.level === 'warn',
        'text-red-600': this.level === 'error'
      }
    },
    confirmButtonClass() {
      return {
        'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': this.level === 'info',
        'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500': this.level === 'warn',
        'bg-red-600 hover:bg-red-700 focus:ring-red-500': this.level === 'error'
      }
    }
  }
}
</script>

<style scoped>
/* 动画样式保持不变 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
