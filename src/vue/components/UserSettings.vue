<template>
	<div
		class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
		<h2 class="mb-4 text-xl font-semibold dark:text-white">个人设置</h2>

		<!-- 账号信息部分 -->
		<div
			class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
			<h3 class="mb-4 text-xl font-semibold dark:text-white">账号信息</h3>
			<div class="info-item">
				<label>用户 ID:</label>
				<span id="userId">{{ userId }}</span>
			</div>
			<div class="info-item">
				<label>用户名:</label>
				<span id="username">{{ initialUsername }}</span>
			</div>
		</div>

		<!-- 密码修改部分 -->
		<div
			class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
			<h3 class="mb-4 text-xl font-semibold dark:text-white">密码修改</h3>
			<div class="password-form">
				<div class="form-item">
					<label>新密码:<span class="required">*</span></label>
					<input
						class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						type="password" v-model="newPassword" />
				</div>
				<div class="form-item">
					<label>确认新密码:<span class="required">*</span></label>
					<input
						class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						type="password" v-model="confirmPassword" />
				</div>
				<div class="form-item">
					<label>验证码:<span class="required">*</span></label>
					<input
						class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
						type="text" v-model="passwordVerifyCode" />
					<button @click="handleGetVerifyCode('reset')" class="upload-btn" :disabled="isPasswordCodeCountingDown">
						{{ isPasswordCodeCountingDown ? `${passwordCodeCountdown}秒后重试` : '获取验证码' }}
					</button>
				</div>
				<div class="button-container">
					<button @click="handleChangePassword" class="upload-btn">修改密码</button>
				</div>
			</div>
		</div>

		<!-- 其他设置部分 -->
		<div
			class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
			<h3 class="mb-4 text-xl font-semibold dark:text-white">邮箱设置</h3>
			<div class="form-item">
				<label>当前邮箱: <span class="required">*</span></label>
				<span id="email">{{ email }}</span>

			</div>
			<div class="form-item">
				<label>验证码:<span class="required">*</span></label>
				<input
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					type="text" v-model="emailCode" />
				<button @click="handleGetVerifyCode('change')" class="upload-btn" :disabled="isPasswordCodeCountingDown">
					{{ isPasswordCodeCountingDown ? `${passwordCodeCountdown}秒后重试` : '获取验证码' }}
				</button>
			</div>
			<div class="form-item">
				<label>新邮箱:<span class="required">*</span></label>
				<input
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					type="text" v-model="newEmail" />
			</div>

			<div class="button-container">
				<button @click="handleSaveChanges" class="upload-btn">保存更改</button>
			</div>
		</div>

		<ConfirmModal v-model="showPasswordModal" title="确认修改密码" message="确定是否更改密码，此次操作不可撤销"
			@cancel="showPasswordModal = false" @confirm="handlePasswordConfirm" />

		<ConfirmModal v-model="showSaveModal" title="保存更改" message="确定要保存更改吗？" @cancel="showSaveModal = false"
			@confirm="handleSaveConfirm" />

		<Message ref="message" />
	</div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ConfirmModal from './ConfirmModal.vue'
import Message from './Message.vue'
import api from '../../lib/axios'
import { log } from '../../../node_modules/astro/dist/core/logger/core'
import { e } from '../../../dist/_astro/runtime-core.esm-bundler.C2oPSN2g'

// 数据
const userId = ref('')
const username = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const newEmail = ref('')
const email = ref('')
const emailCode = ref('')
const passwordVerifyCode = ref('')

// 修改密码确认框的状态
const showPasswordModal = ref(false)
const showSaveModal = ref(false)

const message = ref(null)

// 添加倒计时相关的响应式变量
const countdown = ref(60)
const isCountingDown = ref(false)
const passwordCodeCountdown = ref(60)
const isPasswordCodeCountingDown = ref(false)

// 方法
const getInfo = async () => {
	try{
		const response = await api({
		method: 'get',
		url: '/api/dev/info',
		params: {
			d_name: document.cookie.split('username=')[1]
		}
	})
	if (response.data.code === 200) {
		userId.value = response.data.data.d_id
		email.value = response.data.data.d_mail
	} else {
		message.value.show({
			type: 'error',
				content: response.data.message
			})
		}
	} catch (error) {
		message.value.show({
			type: 'error',
			content: error.response?.data?.message || '获取用户信息失败,请检查网络'
		})
	}
}

const handleChangePassword = () => {
	// 验证密码修改表单
	if (!newPassword.value) {
		message.value.show({
			type: 'error',
			content: '请输入新密码'
		})
		return
	}
	if (!confirmPassword.value) {
		message.value.show({
			type: 'error',
			content: '请确认新密码'
		})
		return
	}
	if (!passwordVerifyCode.value) {
		message.value.show({
			type: 'error',
			content: '请输入验证码'
		})
		return
	}
	if (newPassword.value !== confirmPassword.value) {
		message.value.show({
			type: 'error',
			content: '两次输入的密码不一致'
		})
		return
	}

	// 所有验证通过后，才显示确认对话框
	showPasswordModal.value = true
}


const handleSaveChanges = () => {
	// 验证邮箱设置表单
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
	if (!email.value || !email.value.match(emailRegex)) {
		message.value.show({
			type: 'error',
			content: '请输入电子邮箱'
		})
		return
	}
	if (!emailCode.value || emailCode.value.length !== 6) {
		message.value.show({
			type: 'error',
			content: '请输入6位验证码'
		})
		return
	}
	if (!newEmail.value || newEmail.value === email.value || !newEmail.value.match(emailRegex)) {
		message.value.show({
			type: 'error',
			content: '请输入新邮箱'
		})
		return
	}

	// 所有验证通过后，才显示确认对话框
	showSaveModal.value = true
}

const handleCancelChanges = () => {
	message.value.show({
		type: 'warning',
		content: '已取消更改'
	})
}

// 修改确认处理方法，移除验证逻辑
const handlePasswordConfirm = async () => {
	// 直接执行密码修改逻辑
	try {
		const response = await api.post('/api/auth/reset-password', {
			email: email.value,
			password: newPassword.value,
			code: passwordVerifyCode.value
		})
		if (response.data.code === 200) {
			message.value.show({
				type: 'success',
				content: '密码修改成功'
			})
			// 清除本地存储
			localStorage.removeItem("token")
			localStorage.removeItem("username")
			localStorage.removeItem("rememberedUser")

			document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		} else {
			message.value.show({
				type: 'error',
				content: response.data.message
			})
		}
		getInfo()

	} catch (error) {
		message.value.show({
			type: 'error',
			content: error.response?.data?.message || '密码修改失败'
		})
	}
	showPasswordModal.value = false
}

const handleSaveConfirm = async () => {
	// 直接执行保存逻辑
	try {
		const response = await api.post('/api/auth/change-email', {
			email: email.value,
			newEmail: newEmail.value,
			code: emailCode.value
		})
		if (response.data.code === 200) {
			message.value.show({
				type: 'success',
				content: '邮箱设置成功'
			})
			getInfo()
		} else {
			message.value.show({
				type: 'error',
				content: response.data.message
			})
		}
	} catch (error) {
		message.value.show({
			type: 'error',
			content: error.response?.data?.message || '邮箱设置失败'
		})
	}
	showSaveModal.value = false
}

const handleGetVerifyCode = async (type) => {
	// 发送验证码的逻辑
	try {
		const response = await api.get('/api/auth/email-code', {
			params: {
				email: email.value,
				type: type
			}
		})
		if (response.data.code === 200) {
			message.value.show({
				type: 'info',
				content: '验证码已发送到您的邮箱'
			})
		} else {
			message.value.show({
				type: 'error',
				content: response.data.message
			})
		}
	} catch (error) {
		message.value.show({
			type: 'error',
			content: error.response?.data?.message || '验证码发送失败'
		})
	}

	// 开始倒计时
	isPasswordCodeCountingDown.value = true
	passwordCodeCountdown.value = 60

	const timer = setInterval(() => {
		passwordCodeCountdown.value--
		if (passwordCodeCountdown.value <= 0) {
			clearInterval(timer)
			isPasswordCodeCountingDown.value = false
			passwordCodeCountdown.value = 60
		}
	}, 1000)
}

// 接收props
defineProps({
	initialUsername: {
		type: String,
		default: ''
	}
})

onMounted(() => {
	getInfo()
})
</script>

<style scoped>
.user-settings-container {
	max-width: 800px;
	margin: 0 auto;
	padding: 20px;
}

.info-item,
.form-item {
	margin-bottom: 15px;
	display: flex;
	gap: 10px;
	align-items: center;
}

label {
	width: 120px;
	font-weight: bold;
	color: #666;
}

input {
	padding: 8px 12px;
	border: 1px solid #ddd;
	border-radius: 4px;
	width: 300px;
}

.upload-btn {
	background-color: #1a56db;
	color: white;
	padding: 8px 16px;
	border-radius: 6px;
	border: none;
	cursor: pointer;
	transition: background-color 0.2s;
}

.upload-btn:disabled {
	background-color: #9ca3af;
	cursor: not-allowed;
	opacity: 0.7;
}

.button-container {
	display: flex;
	justify-content: left;
	gap: 20px;
	margin-top: 20px;
}

.required {
	color: #dc2626;
	margin-left: 4px;
}
</style>
