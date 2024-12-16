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
