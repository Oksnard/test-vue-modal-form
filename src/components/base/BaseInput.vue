<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  label: { type: String, default: '' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  mask: { type: [String, Object], default: null }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const inputRef = ref(null)
const isFocused = ref(false)

// Вычисляем, активен ли инпут (есть значение или в фокусе)
const isActive = computed(() => {
  return !!props.modelValue || isFocused.value
})

// Обработчик изменения значения
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

// Обработчики фокуса
const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

// Функция для фокусировки на инпуте извне
const focus = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

// Функция для очистки инпута
const clear = () => {
  emit('update:modelValue', '')
}

// Если нужна маска, можно добавить IMask
onMounted(() => {
  if (props.mask && inputRef.value) {
    // Здесь можно добавить IMask при необходимости
    // import IMask from 'imask'
    // IMask(inputRef.value, props.mask)
  }
})

// Экспортируем методы для использования через ref
defineExpose({
  focus,
  clear
})
</script>

<template>
  <label class="base-input floating" :class="{ 
    active: isActive, 
    error: error, 
    disabled: disabled 
  }">
    <span class="label">{{ label }}</span>
    
    <input
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      class="input-element"
    />
    
    <small v-if="error" class="error-message">{{ error }}</small>
  </label>
</template>

<style scoped>
.base-input {
  display: grid;
  gap: 6px;
  width: 100%;
}

.floating {
  position: relative;
}

.floating .label {
  position: absolute;
  z-index: 2;
  left: 14px;
  top: 32px;
  transform: translateY(-50%);
  pointer-events: none;
  color: #536579;
  transition: all 0.18s ease;
  background: transparent;
  padding: 0 4px;
  font-size: 14px;
  font-weight: 500;
}

.floating.active .label,
.floating:focus-within .label {
  top: 4px;
  font-size: 12px;
  transform: none;
  background: #fff;
  color: #174b7c;
}

.input-element {
  height: 64px;
  color: #174b7c;
  border-radius: 8px;
  border: 1px solid #d7e0ea;
  padding: 0 20px;
  background: #fff;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  font-size: 18px;
  font-weight: 500;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

.input-element:focus {
  border-color: #89a7c2;
  box-shadow: 0 0 0 4px rgba(32, 74, 114, 0.08);
}

.input-element:disabled {
  background-color: #f8f9fa;
  color: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  color: #d12d2d;
  font-size: 14px;
  padding: 0 4px;
}

/* Специфичные стили для разных типов инпутов */
.input-element[type="number"]::-webkit-outer-spin-button,
.input-element[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-element[type="number"] {
  -moz-appearance: textfield;
}

.input-element[type="tel"] {
  letter-spacing: 0.5px;
}

/* Адаптивность */
@media (max-width: 480px) {
  .input-element {
    height: 56px;
    padding: 0 16px;
  }
  
  .floating .label {
    left: 14px;
  }
}
</style>