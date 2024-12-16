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
										<input type="checkbox" class="w-4 h-4 border-gray-300 rounded bg-gray-50" :checked="isAllSelected" @change="toggleSelectAll" />
									</div>
								</th>
								<th v-for="(header, index) in headers" 
									:key="index" 
									scope="col" 
									class="p-4 text-xs font-medium text-left text-gray-500 uppercase">
									{{ header }}
								</th>
								<th scope="col" class="p-4 text-xs font-medium text-right text-gray-500 uppercase w-[200px]">
									<div v-if="showBatchButtons" class="flex justify-end space-x-2">
										<button @click="$emit('batch-edit')" 
												class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
											<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
											</svg>
											编辑
										</button>
										<button @click="$emit('batch-delete')"
												class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300">
											<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
											</svg>
											删除
										</button>
									</div>
									<span v-else>操作</span>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in dataList" :key="index" class="hover:bg-gray-100 dark:hover:bg-gray-700">
								<td class="w-4 p-4">
									<div class="flex items-center">
										<input type="checkbox" class="w-4 h-4 border-gray-300 rounded bg-gray-50" :checked="selectedItems.includes(item.sid)" @change="toggleSelect(item.sid)" />
									</div>
								</td>
								<td v-for="(header, headerIndex) in headers" 
									:key="headerIndex" 
									class="p-4 text-sm text-gray-900 whitespace-nowrap">
									<template v-if="getKeyByHeader(header) === 'scodetype'">
										<span :class="getCodeTypeTagClass(item[getKeyByHeader(header)])" 
												class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium">
											{{ formatCodeType(item[getKeyByHeader(header)]) }}
										</span>
									</template>
									<template v-else-if="getKeyByHeader(header) === 'sversion'">
										<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
											{{ item[getKeyByHeader(header)] }}
										</span>
									</template>
									<template v-else-if="getKeyByHeader(header) === 'skey'">
										<div class="flex items-center space-x-2">
											<span class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-100 text-purple-800">
												{{ item[getKeyByHeader(header)] }}
											</span>
											<button 
												@click="copyToClipboard(item[getKeyByHeader(header)])"
												class="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
												title="复制密钥">
												<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
															d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
												</svg>
											</button>
										</div>
									</template>
									<template v-else>
										{{ item[getKeyByHeader(header)] }}
									</template>
								</td>
								<td class="p-4 whitespace-nowrap text-right">
									<div class="flex justify-end space-x-2">
										<button @click="$emit('edit', item)" 
												class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
											<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
												<path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
											</svg>
											编辑
										</button>
										<button @click="$emit('delete', item)"
												class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-300">
											<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
												<path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
											</svg>
											删除
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
	headers: {
		type: Array,
		required: true
	},
	dataList: {
		type: Array,
		required: true
	},
	headerMapping: {
		type: Object,
		required: true
	},
	codeTypeMapping: {
		type: Object,
		required: true
	}
})

const emit = defineEmits([
	'edit',
	'delete',
	'batch-edit',
	'batch-delete',
	'selection-change',
	'copy-success',
	'copy-error'
])

const selectedItems = ref([])

const isAllSelected = computed(() => {
	return props.dataList.length > 0 && selectedItems.value.length === props.dataList.length
})

const showBatchButtons = computed(() => selectedItems.value.length > 0)

const toggleSelectAll = () => {
	if (isAllSelected.value) {
		selectedItems.value = []
	} else {
		selectedItems.value = props.dataList.map(item => item.sid)
	}
	emit('selection-change', selectedItems.value)
}

const toggleSelect = (sid) => {
	const index = selectedItems.value.indexOf(sid)
	if (index === -1) {
		selectedItems.value.push(sid)
	} else {
		selectedItems.value.splice(index, 1)
	}
	emit('selection-change', selectedItems.value)
}

const getKeyByHeader = (header) => {
	return props.headerMapping[header]
}

const formatCodeType = (type) => {
	return props.codeTypeMapping[type] || type
}

const getCodeTypeTagClass = (type) => {
	const typeClasses = {
		'0': 'bg-green-100 text-green-800',
		'1': 'bg-yellow-100 text-yellow-800',
		'2': 'bg-red-100 text-red-800'
	}
	return typeClasses[type] || 'bg-gray-100 text-gray-800'
}

const copyToClipboard = async (text) => {
	try {
		await navigator.clipboard.writeText(text)
		emit('copy-success')
	} catch (err) {
		emit('copy-error')
	}
}
</script>

<style scoped>
.inline-flex {
	transition: all 0.3s;
}

button:hover svg {
	transform: scale(1.1);
	transition: transform 0.2s;
}
</style>

