<template>
  <div class="flex flex-col gap-1.5" :class="wrapperClass">
    <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative w-full">
      <span
        v-if="prefix"
        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold select-none pointer-events-none transition-colors"
        :class="prefixClass || 'text-xs'"
      >
        {{ prefix }}
      </span>

      <input
        ref="inputRef"
        type="text"
        inputmode="numeric"
        :value="displayString"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="w-full border outline-none transition-all"
        :class="[
          prefix ? (prefixPaddingClass || 'pl-9') : 'pl-4',
          inputClass || 'pr-4 py-2.5 rounded-xl border-gray-200 text-sm font-bold bg-white text-navy focus:border-primary focus:ring-2 focus:ring-primary/20',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : '',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
        ]"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
      />
    </div>

    <p v-if="error" class="text-red-500 text-xs font-bold ml-1 animate-in fade-in slide-in-from-top-1">
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-gray-400 text-xs ml-1">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0
  },
  prefix: {
    type: String,
    default: 'Rp'
  },
  placeholder: {
    type: String,
    default: '0'
  },
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  wrapperClass: {
    type: String,
    default: ''
  },
  inputClass: {
    type: String,
    default: ''
  },
  prefixClass: {
    type: String,
    default: ''
  },
  prefixPaddingClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'change'])

const inputRef = ref(null)
const internalText = ref('')
const isFocused = ref(false)

const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return ''
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^\d]/g, '')) : val
  if (isNaN(num)) return ''
  return new Intl.NumberFormat('id-ID').format(num)
}

const displayString = computed(() => {
  if (isFocused.value && internalText.value !== '') {
    return internalText.value
  }
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') {
    return ''
  }
  if (props.modelValue === 0 || props.modelValue === '0') {
    return '0'
  }
  return formatNumber(props.modelValue)
})

const handleInput = (event) => {
  const el = event.target
  const rawValue = el.value
  const cursorPosition = el.selectionStart || 0

  // Count how many digits exist before cursor in raw input
  const digitsBeforeCursor = rawValue.slice(0, cursorPosition).replace(/\D/g, '').length

  // Filter digits only
  let numericOnly = rawValue.replace(/\D/g, '')

  if (numericOnly === '') {
    internalText.value = ''
    emit('update:modelValue', 0)
    emit('change', 0)
    return
  }

  // Remove leading zeros if more than 1 digit
  if (numericOnly.length > 1) {
    numericOnly = numericOnly.replace(/^0+/, '') || '0'
  }

  const numValue = parseInt(numericOnly, 10)
  if (!isNaN(numValue)) {
    const formatted = new Intl.NumberFormat('id-ID').format(numValue)
    internalText.value = formatted
    el.value = formatted
    emit('update:modelValue', numValue)
    emit('change', numValue)

    // Reposition cursor accurately after formatting
    nextTick(() => {
      let newPos = 0
      let count = 0
      for (let i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) {
          count++
        }
        if (count === digitsBeforeCursor) {
          newPos = i + 1
          break
        }
      }
      if (digitsBeforeCursor === 0) newPos = 0
      if (count < digitsBeforeCursor) newPos = formatted.length
      if (el === document.activeElement) {
        el.setSelectionRange(newPos, newPos)
      }
    })
  }
}

const handleKeydown = (event) => {
  // Allow control/nav keys
  if (
    [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].includes(event.keyCode) ||
    (event.ctrlKey || event.metaKey) // Allow copy, paste, select all, etc.
  ) {
    return
  }

  // Prevent non-numeric characters
  if (
    (event.shiftKey || event.keyCode < 48 || event.keyCode > 57) &&
    (event.keyCode < 96 || event.keyCode > 105)
  ) {
    event.preventDefault()
  }
}

const handleBlur = (event) => {
  isFocused.value = false
  internalText.value = ''
  emit('blur', event)
}
</script>
