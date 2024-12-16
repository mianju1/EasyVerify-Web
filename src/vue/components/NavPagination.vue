<template>
  <nav class="block sticky bottom-0 right-0 items-center w-full p-4 bg-white border-t border-gray-200 sm:flex sm:justify-between dark:bg-gray-800 dark:border-gray-700">
    <div class="flex items-center mb-4 sm:mb-0">
      <a
        href="#"
        class="inline-flex justify-center p-1 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="handlePrevPage"
      >
        <svg
          class="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
      <a
        href="#"
        class="inline-flex justify-center p-1 mr-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
        @click="handleNextPage"
      >
        <svg
          class="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
      <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
        当前 
        <span class="font-semibold text-gray-900 dark:text-white">
          {{ current }} 页 - {{ last }} 页
        </span>
        总数 
        <span class="font-semibold text-gray-900 dark:text-white">
          {{ total }}
        </span>
      </span>
    </div>

    <div class="flex items-center space-x-3">
      <a
        href="#"
        class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        @click="handlePrevPage"
      >
        <svg
          class="w-5 h-5 mr-1 -ml-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        上一页
      </a>
      <a
        href="#"
        class="inline-flex items-center justify-center flex-1 px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        @click="handleNextPage"
      >
        下一页
        <svg
          class="w-5 h-5 ml-1 -mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 100
  },
  current: {
    type: Number,
    default: 1
  },
  last: {
    type: Number,
    default: 10
  }
})

const emit = defineEmits(['update:current', 'pageChange'])

const handlePrevPage = () => {
  if (props.current > 1) {
    const newPage = props.current - 1
    emit('update:current', newPage)
    
    // 触发自定义事件
    const event = new CustomEvent('pageChange', {
      detail: newPage,
      bubbles: true,
      composed: true
    })
    document.querySelector('entities-crud').dispatchEvent(event)
  }
}

const handleNextPage = () => {
  if (props.current < Math.ceil(props.total / 10)) {
    const newPage = props.current + 1
    emit('update:current', newPage)
    
    // 触发自定义事件
    const event = new CustomEvent('pageChange', {
      detail: newPage,
      bubbles: true,
      composed: true
    })
    document.querySelector('entities-crud').dispatchEvent(event)
  }
}
</script>
