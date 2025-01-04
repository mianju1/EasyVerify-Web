<template>
  <div class="p-4 bg-white block border-b border-gray-200 lg:mt-1.5 dark:bg-gray-800 dark:border-gray-700">
    <div class="w-full">
      <!-- 标题行 -->
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
          {{ title }}
        </h1>
        <div v-if="showAddButton">
          <button @click="$emit('add-click')"
            class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
            {{ buttonText }}
          </button>
        </div>
      </div>

      <!-- 搜索框 -->
      <div v-if="showSearch" class="mt-4">
        <label for="search" class="sr-only">搜索</label>
        <div class="relative w-64">
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z">
              </path>
            </svg>
          </div>
          <input type="text" :value="searchValue" @input="$emit('update:searchValue', $event.target.value)"
            @keyup.enter="$emit('search', searchValue)" :placeholder="searchPlaceholder"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
        </div>
      </div>

      <!-- 软件选择下拉框 -->
      <div v-if="showSoftwareSelect" class="mt-4">
        <select
          :value="selectedSoftware"
          @change="handleSoftwareChange($event.target.value)"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-64 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        >
          <option v-for="software in softwareList" :key="software.sid" :value="software.sid">
            {{ software.name }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  buttonText: {
    type: String,
    default: '添加'
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  showAddButton: {
    type: Boolean,
    default: false
  },
  searchPlaceholder: {
    type: String,
    default: '搜索...'
  },
  searchValue: {
    type: String,
    default: ''
  },
  showSoftwareSelect: {
    type: Boolean,
    default: false
  },
  selectedSoftware: {
    type: [String, Number],
    default: ''
  },
  softwareList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['search', 'add-click', 'update:searchValue', 'update:selectedSoftware', 'software-change'])

const handleSoftwareChange = (value) => {
  emit('update:selectedSoftware', value)
  emit('software-change', value)
}
</script>

<style scoped>
.dark button:hover svg {
  @apply text-gray-300;
}
</style>

