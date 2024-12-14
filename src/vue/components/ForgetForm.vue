<template>
	<form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
	<div>
			<div id="error-message" class="hidden items-center p-4 mb-4 text-red-800 bg-red-100 rounded-lg" role="alert">
		<svg class="flex-shrink-0 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
			<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
		</svg>
		<div class="ml-3 text-sm font-medium" id="error-text">{{ errorMessage }}</div>
	</div>
	</div>
		
	<div>
      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">邮箱地址</label>
      <input
        type="email" 
        v-model="email"
        name="email"
        id="email"
        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="邮箱地址"
        required
      />
    </div>

		<div>
			<label
				for="verifyCode"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
			>邮箱验证码</label
			>
			<div class="flex space-x-2">
				<input
					type="text"
					name="verifyCode"
					id="verifyCode"
					v-model="verifyCode"
					class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					placeholder="验证码"
				/>
				<button
					type="button"
					:disabled="!isEmailValid || cooldown > 0"
					@click="sendVerifyCode"
					class="px-4 py-2 text-sm font-medium text-white bg-primary-700 rounded-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
				>
					{{ cooldown > 0 ? `${cooldown}秒后重试` : '获取验证码' }}
				</button>
			</div>
		</div>

		<div>
      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">新密码</label>
      <input
        type="password"
        v-model="password"
        name="password"
        id="password"
        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="请输入新密码"
        required
      />
    </div>


		<div>
			<label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">确认密码</label>
			<input
				type="password"
				name="confirm-password"
				id="confirm-password"
				v-model="confirmPassword"
				placeholder="确认密码	"
				class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
			/>
		</div>


	<button
		:disabled="hasError"
		type="submit"
		class="w-full px-5 py-3 text-base font-medium text-center text-white rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 sm:w-auto dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-700 dark:disabled:hover:bg-primary-600"
	>我再也不忘记密码了 T_T</button>
	
	</form>

	<Message ref="message" />

	
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Message from './Message.vue';

const props = defineProps({
	url: String,
	button_text: String
});

const message = ref(null);
const email = ref('');
const verifyCode = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const hasError = ref(false);
const cooldown = ref(0);
const cooldownTimer = ref(null);

const isEmailValid = computed(() => {
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailPattern.test(email.value);
});

// 监听变化
watch(password, () => validatePasswords());
watch(confirmPassword, () => validatePasswords());
watch(email, () => validateEmail());
	

const validateEmail = () => {
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	
	if (!email.value) {
		hideError();
		return;
	}

	if (!emailPattern.test(email.value)) {
		showError('请输入有效的电子邮件地址');
		hasError.value = true;
		return;
	}

	hideError();
	hasError.value = false;
};

const validatePasswords = () => {
	if (!confirmPassword.value) {
		hideError();
		return;
	}

	if (password.value !== confirmPassword.value) {
		showError('两次输入的密码不一致，请重新输入！');
		hasError.value = true;
		return;
	}

	if (password.value.length < 6 || password.value.length > 20) {
		showError('密码长度必须在6-20个字符之间');
		hasError.value = true;
		return;
	}

	hideError();
	hasError.value = false;
};

const showError = (msg) => {
	errorMessage.value = msg;
	const errorDiv = document.getElementById('error-message');
	errorDiv.classList.remove('hidden');
	errorDiv.classList.add('flex');
};

const hideError = () => {
	errorMessage.value = '';
	const errorDiv = document.getElementById('error-message');
	errorDiv.classList.add('hidden');
	errorDiv.classList.remove('flex');
};

const handleSubmit = () => {
	validateEmail();
	validatePasswords();

	if (hasError.value) {
		return;
	}

	if (verifyCode.value.length !== 6) {
		showError('请输入6位验证码');
		return;
	}

	const registerData = {
		email: email.value,
		verifyCode: verifyCode.value,
		password: password.value,
		confirmPassword: confirmPassword.value
	};

	alert('重置数据：\n' + JSON.stringify(registerData, null, 2));
};

const sendVerifyCode = async () => {
	if (!isEmailValid.value) {
		showError('请输入有效的邮箱地址');
		return;
	}

	try {
		// 这里添加发送验证码的API调用
		// await sendVerifyCodeAPI(email.value);
		
		// 设置倒计时
		cooldown.value = 60;
		cooldownTimer.value = setInterval(() => {
			if (cooldown.value > 0) {
				cooldown.value--;
			} else {
				clearInterval(cooldownTimer.value);
			}
		}, 1000);

		// 显示成功消息
		message.value.show({
			type: 'success',
			content: '验证码已发送至邮箱：' + email.value,
			duration: 3000
		});

	} catch (error) {
		// 如果发送失败，显示错误消息
		message.value.show({
			type: 'error',
			content: '验证码发送失败，请稍后重试',
			duration: 3000
		});
	}
};
</script>
