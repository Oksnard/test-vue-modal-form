<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: 'Адрес' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  delay: { type: Number, default: 300 } // Задержка дебаунса в ms
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'select'])

const inputRef = ref(null)
const isFocused = ref(false)
const isLoading = ref(false)
const suggestions = ref([])
const isSuggestionsOpen = ref(false)
const selectedIndex = ref(-1)
const searchQuery = ref('')

// Ключ API DaData
const apiKey = '88a07cbbc7467f5d1617064ff3ff5b5125f92b15'

// Таймер для дебаунса
let debounceTimer = null

// AbortController для отмены запросов
let abortController = null

// Вычисляем, активен ли инпут
const isActive = computed(() => {
  return !!props.modelValue || isFocused.value
})

// Отслеживаем изменения значения
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

// Обработчик ввода
const handleInput = (event) => {
  const value = event.target.value
  searchQuery.value = value
  emit('update:modelValue', value)

  // Дебаунс поиска
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    if (value.length >= 2) {
      fetchSuggestions(value)
    } else {
      suggestions.value = []
      isSuggestionsOpen.value = false
    }
  }, props.delay)
}

// Обработчики фокуса
const handleFocus = (event) => {
  isFocused.value = true
  isSuggestionsOpen.value = suggestions.value.length > 0
  emit('focus', event)
}

const handleBlur = (event) => {
  // Уменьшим задержку перед закрытием
  setTimeout(() => {
    isFocused.value = false
    isSuggestionsOpen.value = false
    selectedIndex.value = -1
  }, 150)
  emit('blur', event)
}

// Запрос к DaData
const fetchSuggestions = async (query) => {
  // Отменяем предыдущий запрос
  if (abortController) {
    abortController.abort()
  }

  abortController = new AbortController()
  isLoading.value = true

  try {
    const response = await fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Token ${apiKey}`
      },
      body: JSON.stringify({
        query: query,
        count: 7 // Количество подсказок
      }),
      signal: abortController.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    suggestions.value = data.suggestions || []
    isSuggestionsOpen.value = suggestions.value.length > 0
    selectedIndex.value = -1
    console.log('Suggestions received:', suggestions.value)
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error fetching address suggestions:', error)
      suggestions.value = []
      isSuggestionsOpen.value = false
    }
  } finally {
    isLoading.value = false
  }
}

// Выбор подсказки
const selectSuggestion = (suggestion) => {
  const address = suggestion.value
  searchQuery.value = address
  emit('update:modelValue', address)
  emit('select', suggestion)

  suggestions.value = []
  isSuggestionsOpen.value = false
  selectedIndex.value = -1

  // Фокусируемся обратно на инпут
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

// Обработка клавиатуры
const handleKeydown = (event) => {
  if (!isSuggestionsOpen.value) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedIndex.value = Math.min(selectedIndex.value + 1, suggestions.value.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
      break
    case 'Enter':
      event.preventDefault()
      if (selectedIndex.value >= 0 && selectedIndex.value < suggestions.value.length) {
        selectSuggestion(suggestions.value[selectedIndex.value])
      }
      break
    case 'Escape':
      isSuggestionsOpen.value = false
      selectedIndex.value = -1
      break
  }
}

// Закрытие подсказок при клике вне компонента
const handleClickOutside = (event) => {
  if (inputRef.value && !inputRef.value.contains(event.target)) {
    isSuggestionsOpen.value = false
    selectedIndex.value = -1
  }
}

// Методы для внешнего использования
const focus = () => {
  if (inputRef.value) {
    inputRef.value.focus()
  }
}

const clear = () => {
  searchQuery.value = ''
  emit('update:modelValue', '')
  suggestions.value = []
  isSuggestionsOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  clearTimeout(debounceTimer)
  if (abortController) {
    abortController.abort()
  }
})

defineExpose({
  focus,
  clear
})
</script>

<template>
  <div class="base-input-address" ref="inputRef">
    <label class="base-input floating" :class="{
      active: isActive,
      error: error,
      disabled: disabled
    }">
      <span class="label">{{ label }}</span>

      <div class="input-wrapper">
        <input
          :value="searchQuery"
          :required="required"
          :disabled="disabled"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
          class="input-element"
          autocomplete="off"
        />

        <div v-if="isLoading" class="loader"></div>
      </div>

      <small v-if="error" class="error-message">{{ error }}</small>
    </label>

    <!-- Выпадающий список подсказок -->
    <div v-if="isSuggestionsOpen && suggestions.length > 0" class="suggestions-dropdown">
      <ul class="suggestions-list">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="suggestion.value"
          :class="{
            'suggestion-item': true,
            'selected': index === selectedIndex
          }"
          @mousedown="selectSuggestion(suggestion)"
          @mouseenter="selectedIndex = index"
        >
          <div class="suggestion-main">{{ suggestion.value }}</div>
          <div v-if="suggestion.data.city || suggestion.data.region" class="suggestion-details">
            {{ [suggestion.data.city, suggestion.data.region].filter(Boolean).join(', ') }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.base-input-address {
  position: relative;
  width: 100%;
}

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
  left: 12px;
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

.input-wrapper {
  position: relative;
}

.input-element {
  height: 64px;
  color: #174b7c;
  border-radius: 8px;
  border: 1px solid #d7e0ea;
  padding: 0 20px;
  background: #fff;
  outline: none;
  transition: border-color 0.2s ease,
  box-shadow 0.2s ease;
  font-size: 14px;
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

/* Лоадер */
.loader {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  border: 2px solid #e0e0e0;
  border-top: 2px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}

/* Стили для состояния ошибки */
.base-input.error .input-element {
  border-color: #b42318;
}

.base-input.error .input-element:focus {
  border-color: #b42318;
  box-shadow: 0 0 0 4px rgba(180, 35, 24, 0.08);
}

.base-input.error .label {
  color: #b42318;
}

.error-message {
  color: #b42318;
  font-size: 12px;
  margin-top: 4px;
  padding: 0 4px;
}

/* Выпадающий список подсказок */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d7e0ea;
  border-radius: 8px;
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.12);
  z-index: 10000;
  margin-top: 4px;
  max-height: 300px;
  overflow-y: auto;
}

.suggestions-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.selected {
  background-color: #f4f7fb;
}

.suggestion-main {
  font-weight: 500;
  color: #1f2d3d;
  margin-bottom: 4px;
}

.suggestion-details {
  font-size: 12px;
  color: #6b7b8f;
}

@media (max-width: 480px) {
  .input-element {
    height: 56px;
    padding: 0 16px;
  }

  .floating .label {
    left: 16px;
  }

  .suggestions-dropdown {
    position: fixed;
    left: 16px;
    right: 16px;
    top: auto;
    bottom: 0;
    max-height: 40vh;
    z-index: 10000;
  }
}
</style>
