<script setup>
import { computed, ref, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: { type: [Array, String, Number, Object], default: undefined },
  options: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  error: { type: String, default: '' },
  label: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const search = ref('')

// Нормализуем опции к единому формату
const normalized = computed(() =>
  props.options.map(o => ({
    label: o.label ?? String(o),
    value: o.value ?? o
  }))
)

// Получаем текст для отображения выбранных значений
const selectedLabels = computed(() => {
  if (props.multiple) {
    // Для множественного выбора
    const currentValues = Array.isArray(props.modelValue) ? props.modelValue.map(v => v?.value ?? v) : []

    return normalized.value
      .filter(o => currentValues.includes(o.value))
      .map(o => o.label)
      .join(', ')
  } else {
    // Для одиночного выбора
    const currentValue = props.modelValue?.value ?? props.modelValue
    const found = normalized.value.find(o => o.value === currentValue)
    return found?.label ?? ''
  }
})

// Проверяем, выбран ли option
const isOptionSelected = option => {
  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? props.modelValue.map(v => v?.value ?? v) : []
    return currentValues.includes(option.value)
  } else {
    const currentValue = props.modelValue?.value ?? props.modelValue
    return currentValue === option.value
  }
}

function toggle() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    // При открытии сбрасываем поиск
    search.value = ''
  }
}

function close() {
  isOpen.value = false
  search.value = ''
}

function selectOption(option) {
  if (props.multiple) {
    const currentValues = Array.isArray(props.modelValue) ? [...props.modelValue.map(v => v?.value ?? v)] : []

    const valueIndex = currentValues.findIndex(v => v === option.value)

    if (valueIndex >= 0) {
      // Удаляем если уже выбран
      currentValues.splice(valueIndex, 1)
    } else {
      // Добавляем если не выбран
      currentValues.push(option.value)
    }

    // Emit значения в том же формате, что и в options
    const selectedOptions = normalized.value.filter(o => currentValues.includes(o.value))
    emit(
      'update:modelValue',
      selectedOptions.map(o => props.options.find(orig => (orig.value ?? orig) === o.value) ?? o)
    )
  } else {
    // Emit значение в том же формате, что и в options
    const selectedOption = props.options.find(orig => (orig.value ?? orig) === option.value) ?? option
    emit('update:modelValue', selectedOption)
    close()
  }
}

// Фильтрация опций по поиску
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return normalized.value
  return normalized.value.filter(o => o.label.toLowerCase().includes(q))
})

// Закрытие при клике вне компонента
onMounted(() => {
  document.addEventListener('click', e => {
    if (!e.target.closest('.select')) {
      close()
    }
  })
})
</script>

<template>
  <div class="select floating" :class="{ active: isOpen || selectedLabels }">
    <label class="label">{{ label }}</label>
    <button type="button" class="select-btn" @click.stop="toggle">
      <span v-if="selectedLabels">{{ selectedLabels }}</span>
      <span class="chev">▾</span>
    </button>

    <div v-if="isOpen" class="menu" @click.stop>
      <input class="search" v-model="search" placeholder="Поиск…" @keydown.escape="close" ref="searchInput" />

      <ul class="list">
        <li
          v-for="opt in filtered"
          :key="opt.value"
          :class="{ active: isOptionSelected(opt) }"
          @click="selectOption(opt)"
        >
          {{ opt.label }}
        </li>
        <li v-if="filtered.length === 0" class="no-results">Ничего не найдено</li>
      </ul>
    </div>
  </div>

  <small v-if="error" class="error-message">{{ error }}</small>
</template>

<style scoped>
.select {
  position: relative;
  height: 64px;
  color: #174b7c;
  border-radius: 8px;
  border: 1px solid #d7e0ea;
  padding: 0 20px 0 0;
  background: #fff;
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
  font-size: 14px;
  display: grid;
  gap: 6px;
}

.floating .label {
  position: absolute;
  z-index: 2;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: all 0.18s ease;
  background: #ffffff;
  padding: 0 4px;
  font-weight: 500;
}

.floating.active .label,
.floating:focus-within .label {
  top: 4px;
  font-size: 12px;
  transform: none;
  background: #fff;
}

.select-btn {
  width: 100%;
  height: 100%;
  color: #174b7c;
  background: #fff;
  text-align: left;
  padding: 0 36px 0 3px;
  cursor: pointer;
  position: relative;
  font-family: inherit;
}

.chev {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7b8f;
}

.menu {
  position: absolute;
  z-index: 20;
  top: 66px;
  inset-inline: 0;
  margin-top: 6px;
  border: 1px solid #d7e0ea;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.12);
}

.error-message {
  color: #d12d2d;
  font-size: 14px;
  padding: 0 4px;
}

.search {
  width: 100%;
  border: none;
  border-bottom: 1px solid #eef2f6;
  padding: 10px 12px;
  outline: none;
  font-family: inherit;
}

.search:focus {
  border-bottom-color: #4a90e2;
}

.list {
  max-height: 220px;
  overflow: auto;
  list-style: none;
  margin: 0;
  padding: 6px 0;
}

.list li {
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.list li:hover {
  background: #f4f7fb;
}

.list li.active {
  background: #e8f0fe;
  color: #1a73e8;
}

.no-results {
  color: #9aa8b6;
  cursor: default;
}

.no-results:hover {
  background: transparent;
}
</style>
