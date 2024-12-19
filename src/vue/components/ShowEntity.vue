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
										<slot name="batch-actions">
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
										</slot>
									</div>
									<span v-else>操作</span>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in dataList" :key="index" class="hover:bg-gray-100 dark:hover:bg-gray-700">
								<td class="w-4 p-4">
									<div class="flex items-center">
										<input type="checkbox" class="w-4 h-4 border-gray-300 rounded bg-gray-50" :checked="selectedItems.includes(item[idField])" @change="toggleSelect(item[idField])" />
									</div>
								</td>
								<td v-for="(header, headerIndex) in headers" 
									:key="headerIndex" 
									class="p-4 text-sm text-gray-900 whitespace-nowrap">
									<slot :name="getKeyByHeader(header)" 
											:item="item" 
											:value="item[getKeyByHeader(header)]">
										{{ item[getKeyByHeader(header)] }}
									</slot>
								</td>
								<td class="p-4 whitespace-nowrap text-right">
									<slot name="row-actions" :item="item">
										<div class="flex justify-end space-x-2">
											<button @click="$emit('edit', item)" 
													class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">
												<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
													<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
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
									</slot>
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
	idField: {
		type: String,
		default: 'id'
	}
})

const emit = defineEmits([
	'edit',
	'delete',
	'batch-edit',
	'batch-delete',
	'selection-change'
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
		selectedItems.value = props.dataList.map(item => item[props.idField])
	}
	emit('selection-change', selectedItems.value)
}

const toggleSelect = (id) => {
	const index = selectedItems.value.indexOf(id)
	if (index === -1) {
		selectedItems.value.push(id)
	} else {
		selectedItems.value.splice(index, 1)
	}
	emit('selection-change', selectedItems.value)
}

const getKeyByHeader = (header) => {
	return props.headerMapping[header]
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

