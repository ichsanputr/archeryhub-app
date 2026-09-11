<template>
  <BaseInput
    :model-value="modelValue"
    kind="currency"
    :label="label"
    :placeholder="placeholder"
    :icon="icon || 'ph:money-bold'"
    :required="required"
    :error="error"
    :hint="hint"
    :disabled="disabled"
    :rules="rules"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup>
import BaseInput from './BaseInput.vue'

defineProps({
  modelValue: [String, Number],
  label: String,
  placeholder: {
    type: String,
    default: '0'
  },
  icon: String,
  required: Boolean,
  error: String,
  hint: String,
  disabled: Boolean,
  rules: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])
</script>
