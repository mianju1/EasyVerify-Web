<template>
	<div class="flex flex-col">
		<div class="overflow-x-auto">
			<div class="inline-block min-w-full align-middle">
				<div class="overflow-hidden shadow">
					<table class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600">
						<thead class="bg-gray-100 dark:bg-gray-700">
							<tr>
								<th scope="col" class="p-4 w-4">
									<div class="flex items-center">
										<input type="checkbox" class="w-4 h-4 border-gray-300 rounded bg-gray-50" />
									</div>
								</th>
								<th v-for="(header, index) in headers" 
									:key="index" 
									scope="col" 
									class="p-4 text-xs font-medium text-left text-gray-500 uppercase">
									{{ header }}
								</th>
								<th scope="col" class="p-4 text-xs font-medium text-left text-gray-500 uppercase">
									操作
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in dataList" :key="index" class="hover:bg-gray-100 dark:hover:bg-gray-700">
								<td class="w-4 p-4">
									<div class="flex items-center">
										<input type="checkbox" class="w-4 h-4 border-gray-300 rounded bg-gray-50" />
									</div>
								</td>
								<td v-for="(header, headerIndex) in headers" 
									:key="headerIndex" 
									class="p-4 text-sm text-gray-900 whitespace-nowrap">
									{{ item[getKeyByHeader(header)] }}
								</td>
								<td class="p-4 space-x-2 whitespace-nowrap">
									<button @click="handleEdit(item)" 
											class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
										<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
											<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
											<path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
										</svg>
										编辑
									</button>
									<button @click="handleDelete(item)"
											class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300">
										<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
											<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
										</svg>
										删除
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- 使用确认弹窗组件 -->
		<ConfirmModal
			v-model="showDeleteModal"
			level="error"
			title="删除确认"
			message="你确定要删除该应用吗？此操作不可撤销。"
			@confirm="confirmDelete"
			@cancel="cancelDelete"
		/>

		<!-- 添加编辑模态框 -->
		<EditModal
			v-model="showEditModal"
			title="编辑应用信息"
			:fields="formFields"
			:initial-data="itemToEdit"
			type="primary"
			@save="saveEdit"
			@cancel="cancelEdit"
		/>
	</div>
	<Message ref="message" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../lib/axios'
import ConfirmModal from './ConfirmModal.vue'
import EditModal from './EditModal.vue'  // 导入编辑模态框组件
import Message from './Message.vue'

// 定义Message组件
const message = ref(null)

// Props 定义
const props = defineProps({
	headers: {
		type: Array,
		required: true
	}
})

// 响应式状态
const dataList = ref([])
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const showEditModal = ref(false)
const itemToEdit = ref(null)

// 定义表单字段
const formFields = [
	{
		key: 'sname',
		label: '程序名称',
		type: 'text',
		required: true,
		placeholder: '请输入程序名称'
	},
	{
		key: 'sid',
		label: '程序ID',
		type: 'text',
		disabled: true
	},
	{
		key: 'sversion',
		label: '版本号',
		type: 'text',
		placeholder: '请输入版本号'
	},
	{
		key: 'skey',
		label: '密钥',
		type: 'text',
		disabled: true
	},
	{
		key: 'sdesc',
		label: '备注',
		type: 'textarea',
		rows: 3,
		placeholder: '请输入备注信息'
	},{
		key: 'snotice',
		label: '公告',	
		type: 'textarea',
		rows: 3,
		placeholder: '请输入公告信息'
	}
]

// 获取数据
const fetchData = async () => {
	try {
		const result = await api.get('/api/soft/get-softs')
		if (result.data.code === 200 && result.data.data) {
			dataList.value = result.data.data.map(item => ({
				sname: item.sname,
				sid: item.sid,
				sdesc: item.sdesc,
				sversion: item.sversion,
				skey: item.skey
			}))
		}
	} catch (error) {
		console.error('获取数据失败:', error)
	}
}

// 生命周期钩子
onMounted(() => {
	fetchData()
})

// 方法
const getKeyByHeader = (header) => {
	const headerToKey = {
		'程序名称': 'sname',
		'程序ID': 'sid',
		'备注': 'sdesc',
		'版本号': 'sversion',
		'密钥': 'skey'
	}
	return headerToKey[header]
}

const handleEdit = (item) => {
	itemToEdit.value = { ...item }
	showEditModal.value = true
}

const handleDelete = (item) => {
	showDeleteModal.value = true
	itemToDelete.value = item
}

const confirmDelete = () => {
	message.value.show({
		type: 'success',
		content: '删除项目:' + JSON.stringify(itemToDelete.value)
	})
	showDeleteModal.value = false
	itemToDelete.value = null
}

const cancelDelete = () => {
	showDeleteModal.value = false
	itemToDelete.value = null
}

const saveEdit = (formData) => {
	message.value.show({
		type: 'success',
		content: '保存的数据:' + JSON.stringify(formData)
	})
	// 重新加载数据

	showEditModal.value = false
}

const cancelEdit = () => {
	showEditModal.value = false
}
</script>

