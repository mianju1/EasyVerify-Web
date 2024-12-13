<template>
  <div class="modal" :class="{ hidden: !isVisible }" @click="handleModalClick">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">{{ docTitle }}</h2>
        <button class="close-btn" @click="close" aria-label="关闭">&times;</button>
      </div>
      <div class="modal-body">
        <MdPreview
          v-if="content"
          :modelValue="content"
          :language="language"
          :preview-theme="previewTheme"
          :show-code-row-number="true"
          :markdown-theme="markdownTheme"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import 'md-editor-v3/lib/style.css'

const isVisible = ref(false)
const content = ref('')
const docTitle = ref('文档查看')
const language = 'zh-CN'
const previewTheme = 'default'
const markdownTheme = 'default'

const loadContent = async (path) => {
  if (!path) return
  try {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const text = await response.text()
    content.value = text
  } catch (error) {
    console.error('加载文档失败:', error)
    content.value = '文档加载失败'
  }
}

const close = () => {
  isVisible.value = false
  content.value = ''
  docTitle.value = '文档查看'
}

const handleModalClick = (e) => {
  if (e.target.classList.contains('modal')) {
    close()
  }
}

const showDoc = async (event) => {
  const { path, title } = event.detail
  docTitle.value = title
  isVisible.value = true
  await loadContent(path)
}

const handleShowDoc = (event) => {
  showDoc(event)
}

onMounted(() => {
  window.addEventListener('show-doc', handleShowDoc)
})

onUnmounted(() => {
  window.removeEventListener('show-doc', handleShowDoc)
})
</script>

<style scoped>
.modal {
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
  overflow: hidden;
}

.modal.hidden {
  display: none;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  height: 85vh;
  display: flex;
  flex-direction: column;
  margin: 20px;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.modal-body {
  padding: 1rem;
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

:global(.md-editor-preview-wrapper) {
  padding: 0 !important;
  height: 100% !important;
}

:global(.md-editor-preview) {
  height: 100% !important;
  overflow-y: visible !important;
}

:global(.md-editor-preview ul) {
  list-style-type: disc !important;
  padding-left: 2em !important;
  margin: 1em 0 !important;
}

:global(.md-editor-preview ol) {
  list-style-type: decimal !important;
  padding-left: 2em !important;
  margin: 1em 0 !important;
}

:global(.md-editor-preview li) {
  margin: 0.5em 0 !important;
  line-height: 1.5 !important;
}

.modal-body::-webkit-scrollbar {
  width: 8px;
}

.modal-body::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.modal-body::-webkit-scrollbar-thumb:hover {
  background: #555;
}

:global(.dark .md-editor-preview ul),
:global(.dark .md-editor-preview ol) {
  color: #e5e7eb;
}
</style>
