<template>
	<div class="entities-crud">
		<div v-if="loading" class="flex justify-center items-center p-4">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>

		<div v-else>
			<ProductHeader :title="headerProps.title" :button-text="headerProps.buttonText"
				:show-search="headerProps.showSearch" :search-placeholder="headerProps.searchPlaceholder"
				:show-add-button="true" v-model:searchValue="searchQuery" @search="handleSearch" @add-click="handleAddClick" />

			<!-- 添加模态框 -->
			<EditModal v-model="showAddModal" title="添加新注册码" :fields="addFormFields" type="primary" @save="handleAdd"
				@cancel="() => showAddModal = false" />

			<ShowEntity :headers="headers" :dataList="dataList" :headerMapping="headerMapping" :id-field="'code'"
				 :show-edit="false" @delete="handleDelete" @batch-delete="handleBatchDelete"
				@selection-change="handleSelectionChange">

				<template #timeType="{ value }">
					<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
						{{ timeTypeMapping[value] || value }}
					</span>
				</template>


				<!-- 自定义使用时间列 -->
				<template #useTime="{ value }">
					<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
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
							{{ value || '未设置' }}
						</span>
						<span v-if="isExpired(value)"
							class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-red-100 text-red-800">
							已到期
						</span>
					</div>
				</template>

				<!-- 自定义激活码列 -->
				<template #code="{ value }">
					<div class="flex items-center space-x-2">
						<span
							class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
							{{ value }}
						</span>
						<button @click="copyToClipboard(value)" class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
							title="复制激活码">
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
							</svg>
						</button>
					</div>
				</template>

			</ShowEntity>

			<NavPagination :total="total" :current="currentPage" :pageSize="pageSize" @page-change="handlePageChange" />
		</div>

		<div v-if="error" class="text-red-500 p-4 text-center">
			{{ error }}
		</div>
		
		<!-- 确认删除弹窗 -->
		<ConfirmModal v-model="showDeleteModal" level="error" title="删除确认" message="你确定要删除该应用吗？此操作不可撤销。"
			@confirm="confirmDelete" @cancel="cancelDelete" />

		<!-- 批量删除确认框 -->
		<ConfirmModal v-model="showBatchDeleteModal" title="批量删除确认" :message="`确定要删除选中的 ${selectedItems.length} 项数据吗？`"
			level="error" @confirm="confirmBatchDelete" @cancel="cancelBatchDelete" />
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

const message = ref(null)
const currentPage = ref(1)
const dataList = ref([])
const loading = ref(false)
const error = ref(null)
const total = ref(0)
const lastPage = ref(1)
const selectedItems = ref([])
const pageSize = ref(20)
const searchQuery = ref('')
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
	'激活码',
	'绑定用户',
	'使用时间',
	'到期时间',
	'卡类型'
]

// 表头映射
const headerMapping = {
	'程序名称': 'sname',
	'激活码': 'code',
	'绑定用户': 'user',
	'使用时间': 'useTime',
	'到期时间': 'expireTime',
	'卡类型': 'timeType'
}

// 卡类型映射
const timeTypeMapping = {
	"0": '小时卡',
	"1": '日卡',
	"2": '周卡',
	"3": '月卡',
	"4": '季卡',
	"5": '年卡'
}

// 添加一个新的 ref 存储程序列表
const programList = ref([])

// 获取程序列表的函数
const fetchProgramList = async () => {
	try {
		// 获取程序列表
		const response = await api({
			method: 'get',
			params: {
				codetype: 1
			},
			url: '/api/soft/list-soft'
		})

		if (response.data.code === 200) {
			programList.value = response.data.data.map(item => ({
				value: item.sid,
				label: item.name
			}))
		} else {
			message.value.show({
				type: 'error',
				content: response.data.message || '获取程序列表失败'
			})
		}
	} catch (err) {
		message.value.show({
			type: 'error',
			content: '获取程序列表失败'
		})
	}
}

// 修改添加表单字段定义
const addFormFields = [
	{
		key: 'program',
		label: '选择程序',
		type: 'select',
		get options() {
			return programList.value.map(item => ({
				value: item.value,
				label: item.label
			}))
		},
		required: true,
		placeholder: '请选择程序'
	},
	{
		key: 'duration',
		label: '有效时间',
		type: 'select',
		required: true,
		options: [
			{ value: 'hour', label: '小时卡' },
			{ value: 'day', label: '日卡' },
			{ value: 'week', label: '周卡' },
			{ value: 'month', label: '月卡' },
			{ value: 'season', label: '季卡' },
			{ value: 'year', label: '年卡' }
		],
		placeholder: '请选择有效时间'
	},
	{
		key: 'activateNow',
		label: '立即激活',
		type: 'checkbox'
	},
	{
		key: 'quantity',
		label: '生成数量',
		type: 'number',
		required: true,
		min: 1,
		placeholder: '请输入生成数量(1-100)'
	},
	{
		key: 'codeType',
		label: '激活码类型',
		type: 'select',
		required: true,
		options: [
			{ value: 'normal', label: '普通注册码' }
			// ,{ value: 'special', label: '积分制激活码' }
		],
		placeholder: '请选择激活码类型',
		onChange: (value, formData) => {
			// 当选择积分制激活码时，显示积分输入框
			formData.showScoreField = value === 'special'
		}
	}
	// ,{
	// 	key: 'score',
	// 	label: '积分',
	// 	type: 'number',
	// 	min: 0,
	// 	placeholder: '请输入积分',
	// 	show: (formData) => formData.codeType === 'special' // 只在选择积分制激活码时显示
	// }
]



// header 属性
const headerProps = {
	title: "注册码管理",
	buttonText: "添加注册码",
	showSearch: true,
	searchPlaceholder: "搜索注册码..."
}

// 时间戳转为当前时间
const formatTime = (timestamp) => {
	if (timestamp == 0 || timestamp == null) {
		return '未激活'
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

// 获取数据
const fetchData = async (keyword = '', page = 1, pageSize = 20) => {
	loading.value = true

	try {
		const response = await api({
			method: 'post',
			data: {
				keyword: keyword,
				type: 1,
				page: {
					currentPage: page,
					pageSize: pageSize
				}
			},
			url: '/api/code/seach-code'
		})

		if (response.data.code === 200) {
			dataList.value = response.data.data.map((item) => ({
				sname: item.name,
				code: item.code,
				user: item.username,
				useTime: formatTime(item.useTime),
				expireTime: formatTime(item.expired),
				timeType: item.timeType
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
			content: '网络请求失败，请稍后重试'
		})
	} finally {
		loading.value = false
	}
}

// 搜索处理
const handleSearch = async (query) => {
	searchQuery.value = query  // 保存搜索关键字
	await fetchData(query, 1, pageSize.value)
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

// 复制到剪贴板功能
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
				code: [itemToDelete.value.code]
			},
			url: '/api/code/delete-code'
		})

		if (response.data.code === 200) {
			message.value.show({
				type: 'success',
				content: '删除成功'
			})
			await fetchData(searchQuery.value, currentPage.value, pageSize.value)
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


// 确认批量删除
const confirmBatchDelete = async () => {
	try {
		loading.value = true

		const response = await api({
			method: 'post',
			data: {
				code: selectedItems.value
			},
			url: '/api/code/delete-code'
		})

		if (response.data.code === 200) {
			message.value.show({
				type: 'success',
				content: '批量删除成功'
			})
			await fetchData(searchQuery.value, currentPage.value, pageSize.value)
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
const handleAddClick = async () => {
	await fetchProgramList()
	showAddModal.value = true
}

// 处理添加操作
const handleAdd = async (formData) => {
	try {
		loading.value = true
		
		// 检查必填字段
		if (!formData.program || !formData.duration || !formData.quantity || !formData.codeType) {
			message.value.show({
				type: 'error',
				content: '请填写所有必填字段'
			})
			return
		}

		// 构造请求数据
		const requestData = {
			sid: formData.program,
			timeType: {
				'hour': '0',
				'day': '1', 
				'week': '2',
				'month': '3',
				'season': '4',
				'year': '5'
			}[formData.duration],
			num: formData.quantity,
			codeType: 1,  // 注册码固定为1 激活码为2
			scores: formData.score || -1,
			isActive: formData.activateNow || false
		}

		const response = await api({
			method: 'post',
			data: requestData,
			url: '/api/code/add-code'
		})

		if (response.data.code === 200) {
			message.value.show({
				type: 'success',
				content: '添加成功'
			})
			await fetchData(searchQuery.value, currentPage.value, pageSize.value)
		} else {
			message.value.show({
				type: 'error',
				content: response.data.message || '添加失败'
			})
		}
	} catch (err) {
		message.value.show({
			type: 'error',
			content: err.response.data.message || '添加失败'
		})
	} finally {
		loading.value = false
		showAddModal.value = false
	}
}

// 分页切换
const handlePageChange = async (newPage) => {
	currentPage.value = newPage
	await fetchData(searchQuery.value, newPage, pageSize.value)
}

// 初始加载数据
onMounted(() => {
	fetchData()
	fetchProgramList()
})

// 导出必要的属性和方法
defineExpose({
	fetchData
})

// 判断是否已过期
const isExpired = (dateString) => {
	// 如果是"未激活"或者空值，返回false
	if (!dateString || dateString === '未激活') {
		return false
	}
	
	try {
		// 将格式化的日期字符串转换回 Date 对象
		// 格式示例: 2024-12-20 14:47:14
		const [datePart, timePart] = dateString.split(' ')
		const [year, month, day] = datePart.split('-')
		const [hour, minute, second] = timePart.split(':')
		
		const expireDate = new Date(
			parseInt(year),
			parseInt(month) - 1, // 月份需要减1
			parseInt(day),
			parseInt(hour),
			parseInt(minute),
			parseInt(second)
		)
		
		// 检查是否是有效的日期
		if (isNaN(expireDate.getTime())) return false
		
		const now = new Date()
		return expireDate < now
	} catch (error) {
		return false
	}
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
