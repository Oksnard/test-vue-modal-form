<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ from: null, to: null }) },
  kind: { type: String, default: 'number' },
  min: { type: [Number, String], default: undefined },
  max: { type: [Number, String], default: undefined },
  step: { type: [Number, String], default: undefined },
  errorFrom: { type: String, default: '' },
  errorTo: { type: String, default: '' },
  placeholderFrom: { type: String, default: '' },
  placeholderTo: { type: String, default: '' },
  label: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const localValue = ref({ ...props.modelValue })

watch(
  () => props.modelValue,
  newVal => {
    localValue.value = { ...newVal }
  },
  { deep: true }
)

function emitUpdate() {
  emit('update:modelValue', { ...localValue.value })
}

const fromVal = computed({
  get: () => localValue.value.from,
  set: v => {
    localValue.value.from = v
    emitUpdate()
  }
})

const toVal = computed({
  get: () => localValue.value.to,
  set: v => {
    localValue.value.to = v
    emitUpdate()
  }
})

watch([fromVal, toVal], ([newFrom, newTo]) => {
  if (newFrom && newTo && props.kind === 'number') {
    const fromNum = parseFloat(newFrom)
    const toNum = parseFloat(newTo)
    if (!isNaN(fromNum) && !isNaN(toNum) && toNum < fromNum) {
      toVal.value = newFrom
    }
  }
})
</script>

<template>
  <div class="rangebox-simple">
    <label v-if="label" class="static-label">{{ label }}</label>

    <div class="inputs-container">
      <div class="input-group">
        <span class="inline-label">от</span>
        <input
          :type="kind === 'date' ? 'date' : 'number'"
          v-model="fromVal"
          :min="min"
          :max="max"
          :step="step"
          :placeholder="placeholderFrom"
          class="range-input"
        />
        <small v-if="errorFrom" class="error-message">{{ errorFrom }}</small>
      </div>

      <div class="input-group">
        <span class="inline-label">до</span>
        <input
          :type="kind === 'date' ? 'date' : 'number'"
          v-model="toVal"
          :min="min"
          :max="max"
          :step="step"
          :placeholder="placeholderTo"
          class="range-input"
        />
        <small v-if="errorTo" class="error-message">{{ errorTo }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rangebox-simple {
  width: 100%;
  color: #174B7C;
}

.static-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
}

.inputs-container {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.input-group {
  display: flex;
  align-items: center;
  flex: 1;
  height: 66px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
  transition: border-color 0.2s ease;
}

.input-group:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}


.error-message {
  color: #d12d2d;
  font-size: 14px;
  padding: 0 4px;
}

.inline-label {
  padding: 0 20px;
  font-size: 14px;
  color: #6b7280;
  height: 100%;
  display: flex;
  align-items: center;
  min-width: 40px;
}

.range-input {
  flex: 1;
  height: 100%;
  min-width: 0;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 0 20px;
  background: transparent;
  font-family: inherit;
  text-align: right;
  
}

.range-input[type='number']::-webkit-outer-spin-button,
.range-input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.range-input[type='number'] {
  -moz-appearance: textfield;
}

@media (max-width: 480px) {
  .inputs-container {
    flex-direction: column;
    gap: 8px;
  }

  .input-group {
    width: 100%;
  }
}

.input-group.error {
  border-color: #ef4444;
}

.input-group.disabled {
  background-color: #f3f4f6;
  opacity: 0.6;
  cursor: not-allowed;
}

.input-group.disabled .range-input {
  cursor: not-allowed;
}
</style>
