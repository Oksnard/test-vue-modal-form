<script setup>
import { ref, computed, onMounted } from 'vue'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import axios from 'axios'
import BaseInput from './base/BaseInput.vue'
import BaseSelect from './base/BaseSelect.vue'
import BaseRange from './base/BaseRange.vue'
import IMask from 'imask'
import BaseInputAddress from './base/BaseInputAddress.vue'

const emit = defineEmits(['close'])

const schema = yup.object({
  company: yup.string().required('Укажите наименование'),
  phone: yup
    .string()
    .required('Укажите телефон')
    .matches(/\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/, 'Неверный формат'),
  roomType: yup.array().min(1, 'Выберите тип помещения'),
  address: yup.string().required('Укажите адрес'),
  area: yup.object({
    from: yup.number().typeError('Число').min(0, 'Не может быть меньше 0').required(),
    to: yup.number().typeError('Число').moreThan(yup.ref('from'), 'Должно быть больше «от»').required()
  }),
  rent: yup.object({
    from: yup.date().typeError('Дата').required(),
    to: yup.date().typeError('Дата').min(yup.ref('from'), 'Позже даты «с»').required()
  })
})

const { handleSubmit, errors, isSubmitting, setFieldValue } = useForm({
  validationSchema: schema,
  initialValues: {
    roomType: []
  }
})

const { value: company } = useField('company')
const { value: phone } = useField('phone')
const { value: roomType } = useField('roomType')
const { value: address } = useField('address')
const { value: area } = useField('area')
const { value: rent } = useField('rent')

const phoneEl = ref()

onMounted(() => {
  if (phoneEl.value) {
    IMask(phoneEl.value, { mask: '+{7} (000) 000-00-00' })
  }
})

const options = [
  { label: 'Производственная площадь', value: 'industrial' },
  { label: 'Офис', value: 'office' },
  { label: 'Склад', value: 'storage' }
]

// Обработчик выбора адреса
const handleAddressSelect = (suggestion) => {
  console.log('Выбран адрес:', suggestion)
  // Можно сохранить дополнительные данные адреса
  // suggestion.data содержит полную информацию (город, регион, индекс и т.д.)
}

const submit = handleSubmit(async values => {
  try {
    await new Promise(r => setTimeout(r, 600))
    await axios.post('https://httpbin.org/post', values, { timeout: 8000 })
    state.message = 'Заявка успешно отправлена'
    state.kind = 'success'
  } catch (e) {
    state.message = 'Не удалось отправить. Попробуйте позже.'
    state.kind = 'error'
  }
})

const state = ref({ message: '', kind: 'idle' })
</script>

<template>
  <section class="sheet">
    <header class="sheet-header">
      <h2 class="sheet-title">Заполните заявку, чтобы стать резидентом</h2>
      <button class="icon" aria-label="Закрыть" @click="$emit('close')">✕</button>
    </header>

    <form class="form" @submit.prevent="submit">
      <div class="fields">
        <BaseInput v-model="company" label="Наименование организации / ИП" ч :error="errors.company" required />

        <BaseInput
          ref="phoneInputRef"
          v-model="phone"
          type="tel"
          label="Контактный телефон"
          :error="errors.phone"
          required
        />

        <label class="field">
          <BaseSelect v-model="roomType" :options="options" :error="errors.roomType" multiple label="Тип помещения" />
        </label>

        <BaseInputAddress
          v-model="address"
          label="Адрес"
          :error="errors.address"
          :delay="400"
          @select="handleAddressSelect"
          required
        />

        <div class="field range">
          <BaseRange
            kind="number"
            v-model="area"
            :min="0"
            :max="10000"
            :step="10"
            label="Площадь помещения (м²)"
            :errorFrom="errors.area?.from"
            :errorTo="errors.area?.to"
          />
        </div>

        <div class="field range">
          <BaseRange
            kind="date"
            v-model="rent"
            label="Дата начала аренды"
            :errorFrom="errors.rent?.from"
            :errorTo="errors.rent?.to"
          />
        </div>
      </div>

      <footer class="actions">
        <button class="primary" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Отправка…' : 'Отправить' }}
        </button>
      </footer>

      <p v-if="state.kind !== 'idle'" :class="['notice', state.kind]">{{ state.message }}</p>
    </form>
  </section>
</template>

<style scoped>
.sheet {
  padding: 20px 20px 24px;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 4px 16px;
}

.sheet-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: #000000;
}

.icon {
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
  color: #6b7b8f;
}

.form {
  padding-top: 16px;
}

.fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: grid;
  gap: 6px;
}

small {
  color: #d12d2d;
}

.range {
  display: grid;
  gap: 8px;
}

.actions {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}

.primary {
  appearance: none;
  border: none;
  border-radius: 20px !important;
  background: #174b7c;
  color: #fff;
  padding: 12px 40px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.notice {
  margin-top: 10px;
  font-size: 14px;
}

.notice.success {
  color: #1f7a37;
}

.notice.error {
  color: #b42318;
}
</style>
