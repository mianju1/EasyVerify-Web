<template>
  <div class="p-4 bg-white block border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
    <div class="w-full">
      <!-- 标题行 -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          {{ title }}
        </h1>
        <div class="flex items-center space-x-2 sm:space-x-3">
          <button
            v-if="showAddButton"
            @click="handleAddClick"
            class="inline-flex items-center justify-center w-1/2 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            type="button"
          >
            <svg
              class="w-5 h-5 mr-2 -ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
            {{ buttonText }}
          </button>
        </div>
      </div>

      <!-- 搜索框行 -->
      <div v-if="showSearch" class="mt-4">
        <form @submit.prevent="handleSearch" class="relative w-64">
          <input
            type="text"
            v-model="searchQuery"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            :placeholder="searchPlaceholder"
          />
          <button 
            type="submit"
            class="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
          >
            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: '添加'
  },
  showAddButton: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  }
})

const searchQuery = ref('')

// 搜索处理函数
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 创建并分发自定义事件
    const event = new CustomEvent('search', {
      detail: searchQuery.value.trim(),
      bubbles: true,
      composed: true
    })
    document.querySelector('entities-crud').dispatchEvent(event)
  }
}

// 添加按钮点击事件
const handleAddClick = () => {
  // 创建并分发自定义事件
  const event = new CustomEvent('add', {
    bubbles: true,
    composed: true
  })
  document.querySelector('entities-crud').dispatchEvent(event)
}
</script>
