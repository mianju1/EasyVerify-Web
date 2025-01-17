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
        :show-add-button="headerProps.showAddButton"
        :button-text="headerProps.buttonText"
        @update:selected-software="selectedSoftware = $event"
        @software-change="handleSoftwareChange"
        @add-click="handleAddClick"
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
              {{ value }}
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
            {{ functionTypeMapping[value] || value }}
          </span>
        </template>

        <!-- 自定义加密方式列显示 -->
        <template #encryption="{ value }">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium" 
                :class="value === '0' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'">
            {{ encryptionTypeMapping[value] || value }}
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

    <!-- 新增模态框 -->
    <EditModal
      v-if="showAddModal"
      v-model="showAddModal"
      title="新增API接口"
      :fields="addFormFields"
      type="primary"
      @save="handleAddSave"
      @cancel="showAddModal = false"
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
  title: "API接口",
  showSearch: false,
  showAddButton: true,
  buttonText: '新增API接口',
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
const showAddModal = ref(false)

// 表头定义
const headers = [
  '程序名称',
  '请求功能', 
  '接口地址',
  '接口描述',
  '加密方式'
]

// 表头映射
const headerMapping = {
  '程序名称': 'name',
  '请求功能': 'function',
  '接口地址': 'url',
  '接口描述': 'description',
  '加密方式': 'encryption'
}

// 登录形式映射
const codeTypeMapping = {
  '0': '账号+密码',
  '1': '账号+密码+注册码',
  '2': '激活码'
}

// 添加接口功能映射
const functionTypeMapping = {
  '0': '注册',
  '1': '账号登录',
  '2': '激活码登录',
  '3': '获取版本',
  '4': '获取公告',
  '5': '获取指定用户到期时间',
  '6': '是否为当前最新版本',
  '7': '修改用户密码'
}

// 添加加密方式映射
const encryptionTypeMapping = {
  '0': '无加密',
  '1': 'RSA2048'
}

// 编辑表单字段定义
const editFormFields = [
  {
    key: 'name',
    label: '程序名称', 
    type: 'text',
    placeholder: '请输入程序名称',
		disabled: true
  },
  {
    key: 'encryption',
    label: '加密方式',
    type: 'select',
		required: true,
    options: [
      { value: '0', label: '无加密' },
      { value: '1', label: 'RSA2048' }
    ]
  }
]

// 批量编辑字段
const batchEditFields = [
  {
    key: 'encryption',
    label: '加密方式',
    type: 'select',
    required: true,
    options: Object.entries(encryptionTypeMapping).map(([value, label]) => ({
      value,
      label
    }))
  }
]

// 新增表单字段定义
const addFormFields = [
  {
    key: 'function',
    label: '接口功能',
    type: 'select',
    required: true,
    options: Object.entries(functionTypeMapping).map(([value, label]) => ({
      value,
      label
    }))
  },
  {
    key: 'encryption',
    label: '加密方式',
    type: 'select',
    required: true,
    options: Object.entries(encryptionTypeMapping).map(([value, label]) => ({
      value,
      label
    }))
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
				function: item.function,
				url: item.url,
				description: item.desc,
				encryption: item.encryption
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
   function: String(item.function),
   encryption: String(item.encryption), // 确保转换为字符串
   description: item.description,
   url: item.url
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

// 复制成功处理
const handleCopySuccess = () => {
  message.value.show({
    type: 'success',
    content: '密钥已复制到剪贴板'
  })
}

// 复制失败处理
const handleCopyError = () => {
  message.value.show({
    type: 'error',
    content: '复制失败，请手动复制'
  })
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
					url: [itemToEdit.value.url],
					encryption: formData.encryption
			},
			url: '/api/web/update-interface'
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

// 处理添加按钮点击
const handleAddClick = () => {
  showAddModal.value = true
}

// 添加新增表单字段定义
const handleAddSave = async (formData) => {
  try {
    loading.value = true
    // 这里添加实际的API调用
    const response = await api({
      method: 'post',
      data: {
        sid: selectedSoftware.value,
				function: formData.function,
				encryption: formData.encryption
      },
      url: '/api/web/add-interface'
    })

    if (response.data.code === 200) {
      message.value.show({
        type: 'success',
        content: '添加成功'
      })
      await fetchData(currentPage.value, pageSize.value)
    } else {
      message.value.show({
        type: 'error',
        content: response.data.message || '添加失败'
      })
    }
  } catch (err) {
    message.value.show({
      type: 'error',
      content: err.response?.data?.message || '添加失败'
    })
  } finally {
    loading.value = false
    showAddModal.value = false
  }
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

// 复制到贴板功能
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    message.value.show({
      type: 'success',
      content: '密钥已复制到剪贴板'
    })
  } catch (err) {
    message.value.show({
      type: 'error',
      content: '复制失败，请手动复制'
    })
  }
}

// 获取登录形式标签样式
const getCodeTypeTagClass = (type) => {
  const typeClasses = {
    '0': 'bg-green-100 text-green-800',
    '1': 'bg-yellow-100 text-yellow-800',
    '2': 'bg-red-100 text-red-800'
  }
  return typeClasses[type] || 'bg-gray-100 text-gray-800'
}
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
