<template>
	<form class="mt-8 space-y-6" :action=url>
		<div>
			<label
				for="email"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>电子邮箱</label
			>
			<input
				type="email"
				name="email"
				id="email"
				class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				placeholder="name@company.com"
				required
			/>
		</div>
	<div>
		<label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">新密码</label>
		<input
			type="password"
			name="password"
			id="password"
			v-model="password"
			placeholder="••••••••"
			class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
			required
		/>
	</div>
	<div>
		<label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">确认新密码</label>
		<input
			type="password"
			name="confirm-password"
			id="confirm-password"
			v-model="confirmPassword"
			placeholder="••••••••"
			class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
			required
		/>
	</div>
	<div v-if="showAlert" class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
		<span class="font-medium">{{ titleMessage }}</span> {{ message }}
	</div>

	<slot></slot>
		
	<button
		:disabled="showAlert"
		type="submit"
		class="w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
	>{{ button_text }}</button>
		
	</form>

	

	
</template>

<script>
export default {
	props: {
		url: {
			type: String
		},
		button_text: {
			type: String
		}
	},
	data() {
		return {
			password: '',
			confirmPassword: '',
			titleMessage: '密码输入不一致',
			message: '请确认后重新输入！',
		};
	},
	computed: {
		showAlert() {
			return this.password !== this.confirmPassword && this.confirmPassword !== '';
		},
	},
};
</script>
