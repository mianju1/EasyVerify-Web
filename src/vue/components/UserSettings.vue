<template>
  <div class="user-settings-container">
    <h2 class="settings-title">个人设置</h2>

    <!-- 账号信息部分 -->
    <div class="settings-section">
      <h3 class="settings-title">账号信息</h3>
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
    <div class="settings-section">
      <h3 class="settings-title">密码修改</h3>
      <div class="password-form">
        <div class="form-item">
          <label>当前密码:</label>
          <input type="password" v-model="currentPassword" placeholder="●●●●●●●●"/>
        </div>
        <div class="form-item">
          <label>新密码:</label>
          <input type="password" v-model="newPassword" />
        </div>
        <div class="form-item">
          <label>确认新密码:</label>
          <input type="password" v-model="confirmPassword" />
        </div>
        <div class="button-container">
          <button @click="handleChangePassword" class="upload-btn">修改密码</button>
        </div>
      </div>
    </div>

    <!-- 其他设置部分 -->
    <div class="settings-section">
      <h3 class="settings-title">其他设置</h3>
      <div class="form-item">
        <label>电子邮箱:</label>
        <input type="email" v-model="email" />
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
        <input type="text" v-model="emailCode" />
      </div>
      
      <div class="button-container">
        <button @click="handleSaveChanges" class="upload-btn">保存更改</button>
        <button @click="handleCancelChanges" class="delete-btn">取消</button>
      </div>
    </div>

    <ConfirmModal 
      v-model="showPasswordModal"
      title="确认修改密码"
      message="确定是否更改密码，此次操作不可撤销"
      @close="showPasswordModal = false"
      @confirm="handlePasswordConfirm"
    />

    <ConfirmModal 
      v-model="showSaveModal"
      title="保存更改"
      message="确定要保存更改吗？"
      @close="showSaveModal = false"
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
  message.value.show({
    type: 'success',
    content: '密码修改成功'
  })
}

const handleSaveConfirm = () => {
  // 这里添加实际的保存逻辑
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

.settings-title {
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.settings-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.settings-section h3 {
  margin-bottom: 15px;
  color: #444;
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

.delete-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  background-color: white;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

/* 深色模式适 */
:global(.dark) .settings-section h3 {
  color: #b9bbbe;
}

:global(.dark) .settings-section {
  background-color: #1f2937;
  color: #f3f4f6;
}

:global(.dark) input {
  background-color: #374151;
  border-color: #4b5563;
  color: #f3f4f6;
}

:global(.dark) .upload-btn {
  background-color: #2563eb;
}

:global(.dark) .upload-btn:hover {
  background-color: #1d4ed8;
}

:global(.dark) .delete-btn {
  background-color: #374151;
  border-color: #4b5563;
  color: #d1d5db;
}

:global(.dark) .delete-btn:hover {
  background-color: #4b5563;
  border-color: #6b7280;
}

:global(.dark) label {
  color: #b9bbbe;
}

.upload-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

:global(.dark) .upload-btn:disabled {
  background-color: #4b5563;
}
</style>
