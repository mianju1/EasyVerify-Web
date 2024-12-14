<template>
  <div v-if="modelValue" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <h3 class="modal-title">{{ title }}</h3>
      <p class="modal-message">{{ message }}</p>
      <div class="modal-buttons">
        <button class="confirm-btn" @click="handleConfirm">确认</button>
        <button class="cancel-btn" @click="handleClose">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
  handleClose()
}

const handleOverlayClick = () => {
  handleClose()
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
}

.modal-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.modal-message {
  margin-bottom: 20px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-btn {
  background-color: #1a56db;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e5e7eb;
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

/* 深色模式适配 */
:global(.dark) .modal-content {
  background-color: #1f2937;
  color: #f3f4f6;
}

:global(.dark) .cancel-btn {
  background-color: #374151;
  color: #d1d5db;
}
</style>
