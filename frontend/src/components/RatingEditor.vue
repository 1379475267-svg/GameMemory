<script setup>
import { scoreFields } from '../constants'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function updateScore(key, value) {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value === '' ? null : Number(value),
  })
}
</script>

<template>
  <div class="score-grid">
    <label v-for="field in scoreFields" :key="field.key" class="score-field">
      <span>{{ field.label }}</span>
      <input
        type="number"
        min="1"
        max="10"
        :value="modelValue[field.key] ?? ''"
        @input="updateScore(field.key, $event.target.value)"
      />
    </label>
  </div>
</template>
