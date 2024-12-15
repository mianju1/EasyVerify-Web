<template>
  <div class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
    <h2 class="mb-4 text-xl font-semibold dark:text-white">个人设置</h2>

    <!-- 账号信息部分 -->
    <div class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
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
    <div class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h3 class="mb-4 text-xl font-semibold dark:text-white">密码修改</h3>
      <div class="password-form">
        <div class="form-item">
          <label>当前密码:</label>
          <input 
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					type="password" v-model="currentPassword" placeholder="●●●●●●●●"/>
        </div>
        <div class="form-item">
          <label>新密码:</label>
          <input
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					type="password" v-model="newPassword" />
        </div>
        <div class="form-item">
          <label>确认新密码:</label>
          <input
					class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
					type="password" v-model="confirmPassword" />
        </div>
        <div class="button-container">
          <button @click="handleChangePassword" class="upload-btn">修改密码</button>
        </div>
      </div>
    </div>

    <!-- 其他设置部分 -->
    <div class="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h3 class="mb-4 text-xl font-semibold dark:text-white">其他设置</h3>
      <div class="form-item">
        <label>电子邮箱:</label>
        <input
				class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				type="email" v-model="email" />
        <button 
          @click="handleGetVerificationCode" 
          class="upload-btn" 
          :disabled="isCountingDown"
        >
          {{ isCountingDown ? `${countdown}秒后重试` : '获取验证码' }}
        </button>
      </div>
      <div class="form-item">
        <label>验证码:</label>
        <input
				class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
				type="text" v-model="emailCode" />
      </div>
      
      <div class="button-container">
        <button @click="handleSaveChanges" class="upload-btn">保存更改</button>
      </div>
    </div>

    <ConfirmModal 
      v-model="showPasswordModal"
      title="确认修改密码"
      message="确定是否更改密码，此次操作不可撤销"
      @cancel="showPasswordModal = false"
      @confirm="handlePasswordConfirm"
    />

    <ConfirmModal 
      v-model="showSaveModal"
      title="保存更改"
      message="确定要保存更改吗？"
      @cancel="showSaveModal = false"
      @confirm="handleSaveConfirm"
    />

    <Message ref="message" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ConfirmModal from './ConfirmModal.vue'
import Message from './Message.vue'

// 数据
const userId = ref('12345678')
const username = ref('')
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const email = ref('user@example.com')
const emailCode = ref('')

// 修改密码确认框的状态
const showPasswordModal = ref(false)
const showSaveModal = ref(false)

const message = ref(null)

// 添加倒计时相关的响应式变量
const countdown = ref(60)
const isCountingDown = ref(false)

// 方法
const handleChangePassword = () => {
  showPasswordModal.value = true
}

const handleGetVerificationCode = () => {
  // 发送验证码的逻辑
  message.value.show({
    type: 'info',
    content: '验证码已发送到您的邮箱'
  })
  
  // 开始倒计时
  isCountingDown.value = true
  countdown.value = 60
  
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      isCountingDown.value = false
      countdown.value = 60
    }
  }, 1000)
}

const handleSaveChanges = () => {
  showSaveModal.value = true
}

const handleCancelChanges = () => {
  message.value.show({
    type: 'warning',
    content: '已取消更改'
  })
}

// 添加确认处理方法
const handlePasswordConfirm = () => {
  // 这里添加实际的密码修改逻辑
	showPasswordModal.value = false
  message.value.show({
    type: 'success',
    content: '密码修改成功'
  })
}

const handleSaveConfirm = () => {
  // 这里添加实际的保存逻辑
	showSaveModal.value = false
  message.value.show({
    type: 'success',
    content: '设置已保存'
  })
}

// 接收props
defineProps({
  initialUsername: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.user-settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.info-item, .form-item {
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

.button-container {
  display: flex;
  justify-content: left;
  gap: 20px;
  margin-top: 20px;
}

</style>
