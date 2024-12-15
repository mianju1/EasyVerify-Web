<template>
	<div>
		<tr v-for="(item, index) in dataList" :key="index" class="hover:bg-gray-100 dark:hover:bg-gray-700">
			<td class="w-4 p-4">
				<div class="flex items-center">
					<input
						id="checkbox-{{ .id }}"
						aria-describedby="checkbox-1"
						type="checkbox"
						class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
					/>
					<label for="checkbox-{{ .id }}" class="sr-only">
						checkbox
					</label>
				</div>
			</td>
			<td v-for="(key, index2) in key_list" 
				:key="index2" 
				class="p-4 space-x-2 whitespace-nowrap">
				<span class="text-gray-900 dark:text-white">
					{{item[key]}}
				</span>
			</td>
			<td class="p-4 text-base font-normal text-gray-900 whitespace-nowrap dark:text-white">
				<div class="flex items-center">
						<div v-if="true" class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2" />
						<!-- <div v-if="user.status === 'Active'" class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2" />-->
						<!-- <div v-else class="h-2.5 w-2.5 rounded-full bg-red-500 mr-2" />  -->
				</div>
			</td>
			
			<!-- flex justify-end -->
			<td class="p-4 space-x-2 whitespace-nowrap flex justify-center">
				<button
					type="button"
					@click="handleEdit(item)"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
				>
					<svg
						class="w-4 h-4 mr-2"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
							<path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
							<path
								fill-rule="evenodd"
								d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
								clip-rule="evenodd"
							/>
					</svg>
					编辑
				</button>
				<button
					type="button"
					data-modal-target="delete-user-modal"
					data-modal-toggle="delete-user-modal"
					class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-800 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900"
				>
					<svg
						class="w-4 h-4 mr-2"
						fill="currentColor"
						viewBox="0 0 20 20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
					Delete user
				</button>
			</td>
		</tr>
	</div>
</template>
<script>
export default {
	props: {
		dataList: {
			type: Array,
			required: true
		}
	},
	computed:{
		key_list(){
			for (let i in this.dataList) {
				return Object.keys(this.dataList[i]);
			}
		}
	},
	methods: {
		handleEdit(item) {
			console.log('子组件触发编辑:', item)
			this.$emit('edit', item)
		}
	},
	mounted() {
		console.log('组件加载，数据:', this.dataList)
	}
}
</script>
<style lang="">

</style>
