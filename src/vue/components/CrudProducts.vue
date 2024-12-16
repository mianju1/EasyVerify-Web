<template>
  <div class="entities-crud">
    <div v-if="loading" class="flex justify-center items-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else>
      <ProductHeader 
        :title="headerProps.title"
        :buttonText="headerProps.buttonText"
        :showSearch="headerProps.showSearch"
        :searchPlaceholder="headerProps.searchPlaceholder"
        :formFields="headerProps.formFields"
        @search="handleSearch"
        @add="handleAdd"
      />
      
      <ShowEntity 
        :headers="headers"
        :dataList="dataList"
      />

      <NavPagination 
        :total="total"
        :current="currentPage"
        :last="lastPage"
        @page-change="handlePageChange"
      />
    </div>

    <div v-if="error" class="text-red-500 p-4 text-center">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ShowEntity from '../components/ShowEntity.vue'
import ProductHeader from '../components/ProductHeader.vue'
import NavPagination from '../components/NavPagination.vue'
import api from '../../lib/axios'
import { log } from '../../../node_modules/astro/dist/core/logger/core'

const currentPage = ref(1)
const dataList = ref([])
const loading = ref(false)
const error = ref(null)
const total = ref(0)
const lastPage = ref(1)

// 表头定义
const headers = [
  '程序名称',
  '程序ID',
  '备注', 
  '版本号',
  '密钥',
  '登录形式'
]

// 表单字段定义
const formFields = [
  {
    key: 'sname',
    label: '程序名称', 
    type: 'text',
    required: true,
    placeholder: '请输入程序名称'
  },
  {
    key: 'sdesc',
    label: '备注',
    type: 'textarea', 
    rows: 3,
    placeholder: '请输入备注信息'
  },
  {
    key: 'sversion',
    label: '版本号',
    type: 'text',
    required: true,
    placeholder: '请输入版本号'
  },
  {
    key: 'scodetype',
    label: '登录形式',
    type: 'select',
    required: true,
    options: [
      { value: '0', label: '账号+密码' },
      { value: '1', label: '账号+密码+注册码' },
      { value: '2', label: '激活码' }
    ]
  }
]

// header 属性
const headerProps = {
  title: "应用管理",
  buttonText: "添加新应用",
  showSearch: true,
  searchPlaceholder: "搜索应用...",
  formFields
}

// 获取数据
const fetchData = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await api({
      method: 'post',
      data: {
        currentPage: currentPage.value,
        pageSize: 20
      },
      url: '/api/soft/get-softs'
    })

    if (response.data.code === 200) {
      dataList.value = response.data.data.map((item) => ({
        sname: item.sname,
        sid: item.sid,
        sdesc: item.sdesc,
        sversion: item.sversion,
        skey: item.skey,
        scodetype: item.scodetype
      }))
      total.value = response.data.total || 100
      lastPage.value = Math.ceil(total.value / 20)
    } else {
      error.value = response.data.message || '获取数据失败'
    }
  } catch (err) {
    console.error('获取数据失败:', err)
    error.value = '网络请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 搜索处理函数
const handleSearch = async (searchQuery) => {
  try {
    loading.value = true
    error.value = null
    
    const response = await api({
      method: 'post',
      data: {
        currentPage: 1,
        pageSize: 20,
        keyword: searchQuery
      },
      url: '/api/soft/search'
    })

    if (response.data.code === 200) {
      dataList.value = response.data.data
      currentPage.value = 1
    } else {
      error.value = response.data.message || '搜索失败'
    }
  } catch (err) {
    console.error('搜索失败:', err)
    error.value = '搜索请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 添加新应用处理函数
const handleAdd = async (formData) => {
  try {
    loading.value = true
    error.value = null
    
    const response = await api({
      method: 'post',
      data: formData,
      url: '/api/soft/add'
    })

    if (response.data.code === 200) {
      // 添加成功后重新获取数据
      await fetchData()
    } else {
      error.value = response.data.message || '添加失败'
    }
  } catch (err) {
    console.error('添加失败:', err)
    error.value = '添加请求失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 分页切换处理函数
const handlePageChange = (newPage) => {
  currentPage.value = newPage
  fetchData()
}


// 立即执行一次获取数据
fetchData()

// 导出必要的属性和方法
defineExpose({
  fetchData
})
</script>

<style scoped>
.entities-crud {
  min-height: 200px;
  position: relative;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
