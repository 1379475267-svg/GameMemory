<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])
const draft = ref('')

watch(
  () => props.modelValue,
  () => {
    draft.value = ''
  },
)

function addTag() {
  const tag = draft.value.trim()
  if (!tag || props.modelValue.includes(tag)) return
  emit('update:modelValue', [...props.modelValue, tag])
  draft.value = ''
}

function removeTag(tag) {
  emit('update:modelValue', props.modelValue.filter((item) => item !== tag))
}
</script>

<template>
  <div class="tag-editor">
    <div class="tag-row editable">
      <button v-for="tag in modelValue" :key="tag" type="button" @click="removeTag(tag)">
        {{ tag }} x
      </button>
    </div>
    <div class="inline-form">
      <input v-model="draft" type="text" placeholder="添加体验标签" @keydown.enter.prevent="addTag" />
      <button type="button" @click="addTag">添加</button>
    </div>
  </div>
</template>
