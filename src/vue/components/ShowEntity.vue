<template>
	<div class="flex flex-col">
		<div class="overflow-x-auto">
			<div class="inline-block min-w-full align-middle">
				<div class="overflow-hidden shadow">
					<table
						class="min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-600"
					>
					
						<thead class="bg-gray-100 dark:bg-gray-700"
						>
							<tr>
								<th scope="col" class="p-4" >
									<div class="flex items-center">
										<input
											id="checkbox-all"
											aria-describedby="checkbox-1"
											type="checkbox"
											class="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:focus:ring-primary-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
										/>
										<label for="checkbox-all" class="sr-only">checkbox</label>
									</div>
								</th>
								
								<th
									v-for="(th, index) in headers"
									scope="col"
									class="p-4 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">
									{{ th }}
									</th>
							</tr>
						</thead>
						

						<tbody
							class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700"
						>

						<ShowEntityList :dataList=dataList />
							
						</tbody>
					</table>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
import { Linter } from 'eslint';
import ShowEntityList from './ShowEntityList.vue'

export default {
	components: {
		ShowEntityList
	},
	props: {
		headers: {
			type: Array
		},
		dataList: {
			type: Object
		}
	},
	data() {
		return {

		}
	},

}
</script>

<style lang="">
</style>
