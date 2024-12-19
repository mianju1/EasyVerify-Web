<template>
  <Transition name="modal-fade">
    <div v-if="modelValue" class="fixed inset-0 z-50">
      <!-- 背景遮罩 -->
      <div class="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
      
      <!-- 编辑框内容 -->
      <div class="flex items-center justify-center min-h-screen p-4">
        <div class="bg-white rounded-xl shadow-2xl w-[500px] transform transition-all">
          <!-- 标题 -->
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-medium text-gray-900">
              {{ title }}
            </h3>
          </div>

          <!-- 表单内容 -->
          <div class="p-6 max-h-[60vh] overflow-y-auto">
            <form class="space-y-4">
              <div v-for="field in fields" :key="field.key">
                <!-- 添加 v-show 条件，但只应用于有 show 属性的字段 -->
                <div v-show="!field.show || field.show(formData)">
                  <!-- 文本输入框 -->
                  <template v-if="field.type === 'text'">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        {{ field.label }}
                        <span v-if="field.required" class="text-red-500">*</span>
                      </label>
                      <input type="text" 
                             v-model="formData[field.key]"
                             :disabled="field.disabled"
                             :required="field.required"
                             :placeholder="field.placeholder"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                    focus:border-blue-500 focus:ring-blue-500
                                    disabled:bg-gray-100 disabled:text-gray-500" />
                    </div>
                  </template>

                  <!-- 文本域 -->
                  <template v-if="field.type === 'textarea'">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        {{ field.label }}
                        <span v-if="field.required" class="text-red-500">*</span>
                      </label>
                      <textarea v-model="formData[field.key]"
                              :disabled="field.disabled"
                              :required="field.required"
                              :placeholder="field.placeholder"
                              :rows="field.rows || 3"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                     focus:border-blue-500 focus:ring-blue-500
                                     disabled:bg-gray-100 disabled:text-gray-500"></textarea>
                    </div>
                  </template>

                  <!-- 数字输入框 -->
                  <template v-if="field.type === 'number'">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        {{ field.label }}
                        <span v-if="field.required" class="text-red-500">*</span>
                      </label>
                      <input type="number"
                             v-model="formData[field.key]"
                             :disabled="field.disabled"
                             :required="field.required"
                             :min="field.min"
                             :max="field.max"
                             :step="field.step"
                             class="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                    focus:border-blue-500 focus:ring-blue-500
                                    disabled:bg-gray-100 disabled:text-gray-500" />
                    </div>
                  </template>

                  <!-- 选择框 -->
                  <template v-if="field.type === 'select'">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">
                        {{ field.label }}
                        <span v-if="field.required" class="text-red-500">*</span>
                      </label>
                      <select v-model="formData[field.key]"
                              :disabled="field.disabled"
                              :required="field.required"
                              @change="handleSelectChange(field, $event.target.value)"
                              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                                     focus:border-blue-500 focus:ring-blue-500
                                     disabled:bg-gray-100 disabled:text-gray-500">
                        <option value="" disabled>{{ field.placeholder || '请选择' }}</option>
                        <option v-for="option in (field.options || [])" 
                                :key="option.value" 
                                :value="option.value">
                          {{ option.label }}
                        </option>
                      </select>
                    </div>
                  </template>

                  <!-- 复选框 -->
                  <template v-if="field.type === 'checkbox'">
                    <div class="flex items-center">
                      <input type="checkbox"
                             v-model="formData[field.key]"
                             :id="field.key"
                             :disabled="field.disabled"
                             class="h-4 w-4 text-blue-600 rounded border-gray-300 
                                    focus:ring-blue-500 focus:ring-2
                                    disabled:bg-gray-100 disabled:text-gray-500" />
                      <label :for="field.key" class="ml-2 block text-sm font-medium text-gray-700">
                        {{ field.label }}
                      </label>
                    </div>
                  </template>
                </div>
              </div>
            </form>
          </div>

          <!-- 按钮组 -->
          <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            <button v-if="showCancel" 
                    @click="handleCancel"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg 
                           hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 
                           focus:ring-gray-300">
              {{ cancelText }}
            </button>
            <button @click="handleSave"
                    :class="confirmButtonClass"
                    class="px-4 py-2 text-sm font-medium text-white rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-offset-2">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  <Message ref="message" />
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Message from './Message.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '编辑信息'
  },
  fields: {
    type: Array,
    required: true,
    // fields的格式示例:
    // [{
    //   key: 'name',           // 字段键名
    //   label: '名称',         // 显示标签
    //   type: 'text',          // 输入类型: text/textarea/number/select
    //   disabled: false,       // 是否禁用
    //   placeholder: '请输入', // 占位文本
    //   required: true,        // 是否必填
    //   options: [],          // select类型的选项
    //   rows: 3,              // textarea的行数
    //   min: 0,               // number类型的最小值
    //   max: 100,             // number类型的最大值
    //   step: 1               // number类型的步进值
    // }]
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确定'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  type: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel'])

const formData = ref({})

const message = ref(null)

// 监听初始数据变化
watch(() => props.initialData, (newVal) => {
  const data = { ...newVal }
  
  // 处理默认值
  props.fields.forEach(field => {
    // 修复：先判断字段是否存在
    if (field.type === 'select') {
      if (data[field.key] === undefined || data[field.key] === '') {
        // 查找默认选项
        const defaultOption = field.options?.find(opt => opt.default === true)
        if (defaultOption) {
          data[field.key] = defaultOption.value
        } else if (field.options?.length > 0) {
          // 如果没有设置默认值，则使用第一个选项
          data[field.key] = field.options[0].value
        } else {
          // 如果没有选项，设置为空字符串
          data[field.key] = ''
        }
      }
    }
  })
  
  formData.value = data
}, { immediate: true, deep: true })

// 确认按钮样式
const confirmButtonClass = computed(() => ({
  'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': props.type === 'primary',
  'bg-green-600 hover:bg-green-700 focus:ring-green-500': props.type === 'success',
  'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500': props.type === 'warning',
  'bg-red-600 hover:bg-red-700 focus:ring-red-500': props.type === 'danger'
}))

const handleSave = () => {
  // 验证必填项
  const invalidFields = props.fields.filter(field => 
    field.required && !formData.value[field.key]
  )

  
  if (invalidFields.length > 0) {
    // 获取所有未填写的必填字段的标签名称
    const fieldLabels = invalidFields.map(field => field.label).join('、')
    message.value.show({
      type: 'error',
      content: `请填写必填字段：${fieldLabels}`
    })
    return
  }
  
  emit('save', formData.value)
}

const handleCancel = () => {
  emit('cancel')
}

// 修改 select 处理部分
const handleSelectChange = (field, value) => {
  if (field.onChange) {
    field.onChange(value, formData.value)
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
