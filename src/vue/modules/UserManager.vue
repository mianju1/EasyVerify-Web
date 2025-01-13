<template>
  <div class="entities-crud">
    <div v-if="loading" class="flex justify-center items-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else>
      <ProductHeader
        :title="headerProps.title"
        :show-search="headerProps.showSearch"
        :search-placeholder="headerProps.searchPlaceholder"
        :show-software-select="headerProps.showSoftwareSelect"
        :software-list="softwareList"
        :selected-software="selectedSoftware"
        :show-add-button="false"
				v-model:searchValue="searchKeyword"
        @update:selected-software="selectedSoftware = $event"
        @software-change="handleSoftwareChange"
        @search="handleSearch"
      />
      
      <ShowEntity 
        :headers="headers"
        :dataList="dataList"
        :headerMapping="headerMapping"
        :id-field="'username'"
        :selectable="true"
        :show-batch-edit="false"
        @edit="handleEdit"
        @delete="handleDelete"
        @batch-delete="handleBatchDelete"
        @selection-change="handleSelectionChange"
      >
        <!-- 自定义用户名列 -->
        <template #username="{ value }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
            {{ value }}
          </span>
        </template>

        <!-- 自定义到期时间列 -->
        <template #expireTime="{ value }">
          <div class="flex items-center space-x-2">
            <span :class="[
              'inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium',
              isExpired(value) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
            ]">
              {{ formatTime(value) }}
            </span>
            <span v-if="isExpired(value)"
              class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
              已到期
            </span>
          </div>
        </template>

        <!-- 自定义最近登录时间列 -->
        <template #lastLoginTime="{ value }">
          <div class="flex items-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800">
              {{ value }}
            </span>
          </div>
        </template>

      </ShowEntity>

      <NavPagination 
        :total="total"
        :current="currentPage"
        :pageSize="pageSize"
        @page-change="handlePageChange"
      />
    </div>

    <div v-if="error" class="text-red-500 p-4 text-center">
      {{ error }}
    </div>

    <!-- 确认删除弹窗 -->
    <ConfirmModal
      v-model="showDeleteModal"
      level="error"
      title="删除确认"
      message="你确定要删除该应用？此操作不可撤销。"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- 编辑模态框 -->
    <EditModal
      v-model="showEditModal"
      title="编辑应用信息"
      :fields="editFormFields"
      :initial-data="itemToEdit"
      type="primary"
      @save="saveEdit"
      @cancel="cancelEdit"
    />

    <!-- 批量删除确认框 -->
    <ConfirmModal
      v-model="showBatchDeleteModal"
      title="批量删除确认"
      :message="`确定要删除选中的 ${selectedItems.length} 项数据吗？`"
      level="error"
      @confirm="confirmBatchDelete"
      @cancel="cancelBatchDelete"
    />
  </div>
  <Message ref="message" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ShowEntity from '../components/ShowEntity.vue'
import ProductHeader from '../components/ProductHeader.vue'
import NavPagination from '../components/NavPagination.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import EditModal from '../components/EditModal.vue'
import Message from '../components/Message.vue'
import api from '../../lib/axios'
import { log } from '../../../node_modules/astro/dist/core/logger/core'
import { BASE_URL } from '../../app/constants'


// 先声明必要的响应式变量
const message = ref(null)
const currentPage = ref(1)
const dataList = ref([])
const loading = ref(false)
const error = ref(null)
const total = ref(0)
const lastPage = ref(1)
const selectedItems = ref([])
const pageSize = ref(20)

// 添加软件列表数据
const softwareList = ref([])
const selectedSoftware = ref(null)

// 然后再定义 headerProps
const headerProps = {
  title: "用户管理",
  showSearch: true,
  showAddButton: false,
  showSoftwareSelect: true,
  softwareList: softwareList,
  searchPlaceholder: '搜索用户名'
}

// 添加搜索关键词变量
const searchKeyword = ref('')

// 添加搜索处理方法
const handleSearch = async (keyword) => {
  if (keyword === undefined || keyword === null) {
    searchKeyword.value = ''
  } else {
    searchKeyword.value = keyword.trim()
  }
  currentPage.value = 1 // 重置页码
  await fetchData(1, pageSize.value)
}

// 模态框状态
const showDeleteModal = ref(false)
const showEditModal = ref(false)
const showBatchEditModal = ref(false)
const showBatchDeleteModal = ref(false)
const itemToEdit = ref(null)
const itemToDelete = ref(null)

// 表头定义
const headers = [
  '程序名称',
  '用户名',
  '到期时间',
  '最近登录时间'
]

// 表头映射
const headerMapping = {
  '程序名称': 'name',
  '用户名': 'username',
  '到期时间': 'expireTime',
  '最近登录时间': 'lastLoginTime'
}


// 修改编辑表单字段定义
const editFormFields = [
  {
    key: 'name',
    label: '程序名称', 
    type: 'text',
    placeholder: '程序名称',
    disabled: true
  },
  {
    key: 'username',
    label: '用户名',
    type: 'text',
    required: true,
		disabled: true
  },
  {
    key: 'password',
    label: '修改密码',
    type: 'text',
    required: true,
    placeholder: '请输入要修改的密码'
  }
]

// 获取软件列表
const fetchSoftwareList = async () => {
  try {
    const response = await api({
      method: 'post',
			data: {
				keyword: "",
				page: {
					currentPage: 1,
					pageSize: 50
				}
			},
      url: '/api/soft/seach-softs'
    })

    if (response.data.code === 200) {
      softwareList.value = response.data.data.map((item) => ({
        sid: item.sid,
        name: item.sname
      }))
			if (softwareList.value.length > 0) {
				selectedSoftware.value = softwareList.value[0].sid
				// 选择逻辑
				fetchData(currentPage.value, pageSize.value)
			}
    }

  } catch (err) {
    message.value.show({
      type: 'error',
      content: '获取软件列表失败'
    })
  }
}

// 添加时间格式化函数
const formatTime = (timestamp) => {
  if (!timestamp || timestamp === '0' || timestamp === 0) {
    return '未设置'
  }
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-')
}

// 添加判断是否过期的函数
const isExpired = (dateString) => {
  if (!dateString || dateString === '未设置') {
    return false
  }
  
  const expireDate = new Date(dateString)
  if (isNaN(expireDate.getTime())) return false
  
  const now = new Date()
  return expireDate < now
}

// 获取数据
const fetchData = async (page = 1, pageSize = 20) => {
  if (!selectedSoftware.value) return
  loading.value = true
  try {
    const response = await api({
      method: 'post',
      data: {
        sid: selectedSoftware.value,
        keyword: searchKeyword.value,
        page: {
          currentPage: page,
          pageSize: pageSize
        }
      },
      url: '/api/user/manager-user-get'
    })

    if (response.data.code === 200) {
      dataList.value = response.data.data.map((item) => ({
        name: item.sname,
        username: item.username,
        expireTime: formatTime(item.expiredTime),
        lastLoginTime: formatTime(item.lastLoginTime),
      }))
      total.value = response.data.total || 0
      lastPage.value = Math.ceil(total.value / pageSize)
      currentPage.value = page
    } else {
      message.value.show({
        type: 'error',
        content: response.data.message || '获取数据失败'
      })
    }
  } catch (err) {
    message.value.show({
      type: 'error',
      content: err.response.data.message || '网络请求失败，请稍后重试'
    })
  } finally {
    loading.value = false
  }
}

// 编辑处理
const handleEdit = (item) => {
  itemToEdit.value = {
    name: item.name,
    status: item.status,
    expireTime: item.expireTime,
    username: item.username,
    machineCode: item.machineCode
  }
  showEditModal.value = true
}

// 删除处理
const handleDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

// 批量删除处理
const handleBatchDelete = () => {
  showBatchDeleteModal.value = true
}

// 选择变化处理
const handleSelectionChange = (items) => {
  selectedItems.value = items
}

// 确认删除
const confirmDelete = async () => {
  try {
    loading.value = true
		
    
    const response = await api({
      method: 'post',
      data: {
				sid: selectedSoftware.value,
        username: [itemToDelete.value.username]
      },
      url: '/api/user/manager-user-delete'
    })

    if (response.data.code === 200) {
      message.value.show({
        type: 'success',
        content: '删除成功'
      })
      await fetchData(currentPage.value, pageSize.value)
    } else {
      message.value.show({
        type: 'error',
        content: response.data.message || '删除失败'
      })
    }
  } catch (err) {
    message.value.show({
      type: 'error', 
      content: err.response.data.message || '删除失败'
    })
  } finally {
    showDeleteModal.value = false
  }
}

// 取消删除
const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

// 添加时间转换工具函数
const convertDateStringToTimestamp = (dateString) => {
  if (!dateString || dateString === '未设置') {
    return null
  }
  
  try {
    const [datePart, timePart] = dateString.split(' ')
    const [year, month, day] = datePart.split('-')
    const [hour, minute, second] = timePart.split(':')
    
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // 月份需要减1
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second)
    )
    
    return date.getTime()
  } catch (error) {
    console.error('日期转换错误:', error)
    return null
  }
}

// 保存编辑
const saveEdit = async (formData) => {
  try {
    loading.value = true
    
    const requestData = {
      sid: selectedSoftware.value,
      username: formData.username
    }

    // 只有当密码字段有值时才添加到请求数据中
    if (formData.password) {
      requestData.password = formData.password
    }
    
    const response = await api({
      method: 'post',
      data: requestData,
      url: '/api/user/manager-user-update'
    })

    if (response.data.code === 200) {
      message.value.show({
        type: 'success',
        content: '编辑成功'
      })
      await fetchData(currentPage.value, pageSize.value)
    } else {
      message.value.show({
        type: 'error',
        content: response.data.message || '编辑失败'
      })
    }
  } catch (err) {
    message.value.show({
      type: 'error',
      content: err.response.data.message || '编辑失败'
    })
  } finally {
    loading.value = false
    showEditModal.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  showEditModal.value = false
}

// 确认批量删除
const confirmBatchDelete = async () => {
  try {
    loading.value = true		
    
    const response = await api({
      method: 'post',
      data: {
        sid: selectedSoftware.value,
        code: selectedItems.value
      },
      url: '/api/user/del-user'
    })

    if (response.data.code === 200) {
      message.value.show({
        type: 'success',
        content: '批量删除成功'
      })
      await fetchData(currentPage.value, pageSize.value)
    } else {
      message.value.show({
        type: 'error',
        content: response.data.message || '批量删除失败'
      })
    }
  } catch (err) {
    message.value.show({
      type: 'error', 
      content: err.response.data.message || '批量删除失败'
    })
  } finally {
    loading.value = false
  }

  selectedItems.value = []
  showBatchDeleteModal.value = false
}

// 取消批量删除
const cancelBatchDelete = () => {
  showBatchDeleteModal.value = false
}

// 分页切换
const handlePageChange = async (newPage) => {
  currentPage.value = newPage
  await fetchData(newPage, pageSize.value)
}

// 软件选择变化处理
const handleSoftwareChange = async (softId) => {
  fetchData(currentPage.value, pageSize.value)
}

// 初始加载数据
onMounted(() => {
  fetchSoftwareList()
})

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
