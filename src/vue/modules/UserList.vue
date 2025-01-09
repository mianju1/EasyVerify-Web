<template>
  <div class="entities-crud">
    <div v-if="loading" class="flex justify-center items-center p-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <div v-else>
      <ProductHeader
        :title="headerProps.title"
        :show-software-select="headerProps.showSoftwareSelect"
        :software-list="softwareList"
        :selected-software="selectedSoftware"
        :show-add-button="false"
        @update:selected-software="selectedSoftware = $event"
        @software-change="handleSoftwareChange"
      />
      
      <ShowEntity 
        :headers="headers"
        :dataList="dataList"
        :headerMapping="headerMapping"
        :id-field="'url'"
        :selectable="true"
        @edit="handleEdit"
        @delete="handleDelete"
        @batch-edit="handleBatchEdit"
        @batch-delete="handleBatchDelete"
        @selection-change="handleSelectionChange"
      >
        <!-- 自定义程序名称列 -->
        <template #name="{ value }">
          <span class="font-medium text-gray-900">{{ value }}</span>
        </template>

        <!-- 自定义接口描述列 -->
        <template #description="{ value }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            {{ value }}
          </span>
        </template>

        <!-- 自定义链接列 -->
        <template #url="{ value }">
          <div class="flex items-center space-x-2">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
              {{ BASE_URL + value }}
            </span>
            <button 
              @click="copyToClipboard(value)"
              class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              title="复制链接">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </template>
        <!-- 自定义功能列显示 -->
        <template #function="{ value }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
            {{ value }}
          </span>
        </template>

        <!-- 自定义加密方式列显示 -->
        <template #encryption="{ value }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium" 
                :class="value === '0' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'">
            {{ value }}
          </span>
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

    <!-- 批量编辑模态框 -->
    <EditModal
      v-if="showBatchEditModal"
      v-model="showBatchEditModal"
      title="批量编辑"
      :fields="batchEditFields"
      type="primary"
      @save="saveBatchEdit"
      @cancel="cancelBatchEdit"
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
  title: "用户列表",
  showSearch: false,
  showAddButton: false,
  showSoftwareSelect: true,
  softwareList: softwareList
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
  '机器码',
  '到期时间',
  '用户状态'
]

// 表头映射
const headerMapping = {
  '程序名称': 'name',
  '用户名': 'username',
  '机器码': 'machineCode',
  '到期时间': 'expireTime',
  '用户状态': 'status'
}

// 添加用户状态映射
const userStatusMapping = {
  '0': '允许',
  '1': '禁止'
}

// 编辑表单字段定义
const editFormFields = [
  {
    key: 'name',
    label: '程序名称', 
    type: 'text',
    placeholder: '程序名称',
    disabled: true
  },
  {
    key: 'status',
    label: '用户状态',
    type: 'select',
    required: true,
    options: [
      { value: '0', label: '允许' },
      { value: '1', label: '禁止' }
    ]
  },
  {
    key: 'expireTime',
    label: '到期时间',
    type: 'datetime',
    required: false
  },
  {
    key: 'username',
    label: '绑定用户名',
    type: 'text',
    required: false,
    placeholder: '请输入用户名'
  },
  {
    key: 'machineCode',
    label: '机器码',
    type: 'text',
    required: false,
    placeholder: '请输入机器码'
  }
]

// 批量编辑字段
const batchEditFields = [
  {
    key: 'status',
    label: '用户状态',
    type: 'select',
    required: true,
    options: Object.entries(userStatusMapping).map(([value, label]) => ({
      value,
      label
    }))
  },
  {
    key: 'expireTime',
    label: '到期时间',
    type: 'datetime',
    required: true
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

// 获取数据
const fetchData = async (page = 1, pageSize = 20) => {
  if (!selectedSoftware.value) return
  loading.value = true
  try {
    const response = await api({
      method: 'post',
      data: {
        sid: selectedSoftware.value,
        page: {
          currentPage: page,
          pageSize: pageSize
        }
      },
      url: '/api/web/get-interface'
    })

    if (response.data.code === 200) {
      dataList.value = response.data.data.map((item) => ({
        name: item.name,
        username: item.username,
        machineCode: item.machineCode,
        expireTime: item.expireTime,
        status: item.status
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

// 批量编辑处理
const handleBatchEdit = () => {
  showBatchEditModal.value = true
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
        url: [itemToDelete.value.url]
      },
      url: '/api/web/delete-interface'
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

// 保存编辑
const saveEdit = async (formData) => {
  try{
    loading.value = true
    const response = await api({
      method: 'post',
      data: {
        sid: selectedSoftware.value,
        status: formData.status,
        expireTime: formData.expireTime,
        username: formData.username,
        machineCode: formData.machineCode
      },
      url: '/api/web/update-user'
    })
	
    if(response.data.code === 200){
      message.value.show({
        type: 'success',
        content: '编辑成功'
      })
      await fetchData(currentPage.value, pageSize.value)
    }else{
      message.value.show({
        type: 'error',
        content: response.data.message || '编辑失败'
      })
    }
  }catch(err){
    message.value.show({
      type: 'error',
      content: err.response.data.message || '编辑失败'
    })
  }finally{
    loading.value = false
    showEditModal.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  showEditModal.value = false
}

// 保存批量编辑
const saveBatchEdit = async (formData) => {
  const editData = {}
  selectedItems.value.forEach(sid => {
    editData[sid] = formData
  })

	try{
		loading.value = true
		const response = await api({
			method: 'post',
			data: {
				sid: selectedSoftware.value,
				url: selectedItems.value,
				encryption: formData.encryption
			},
			url: '/api/web/update-interface'
		})

		if(response.data.code === 200){
			message.value.show({
				type: 'success',
				content: '批量编辑成功'
			})
			await fetchData(currentPage.value, pageSize.value)
		}else{
			message.value.show({
				type: 'error',
				content: response.data.message || '批量编辑失败'
			})
		}
	}catch(err){
		message.value.show({
			type: 'error',
			content: err.response.data.message || '批量编辑失败'
		})
	}finally{
		loading.value = false
	}

  
  showBatchEditModal.value = false
  selectedItems.value = []
}

// 取消批量编辑
const cancelBatchEdit = () => {
  showBatchEditModal.value = false
}

// 确认批量删除
const confirmBatchDelete = async () => {
  try {
    loading.value = true		
    
    const response = await api({
      method: 'post',
      data: {
				sid: selectedSoftware.value,
        url: selectedItems.value
      },
      url: '/api/web/delete-interface'
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
