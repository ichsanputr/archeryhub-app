<template>
  <div class="flex flex-col gap-1.5" :class="wrapperClass">
    <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative w-full">
      <span
        v-if="effectivePrefix"
        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold select-none pointer-events-none transition-colors"
        :class="prefixClass || 'text-xs font-mono'"
      >
        {{ effectivePrefix }}
      </span>

      <input
        ref="inputRef"
        type="text"
        :inputmode="isDecimalAllowed ? 'decimal' : 'numeric'"
        :value="displayString"
        :placeholder="placeholder || '0'"
        :disabled="disabled"
        :readonly="readonly"
        class="w-full border outline-none transition-all"
        :class="[
          effectivePrefix ? (prefixPaddingClass || (effectivePrefix.length > 2 ? 'pl-11' : 'pl-9')) : 'pl-4',
          inputClass || 'pr-4 py-2.5 rounded-xl border-gray-200 text-sm font-bold bg-white text-navy focus:border-primary focus:ring-2 focus:ring-primary/20',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : '',
          disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''
        ]"
        @input="handleInput"
        @keydown="handleKeydown"
        @blur="handleBlur"
      />
    </div>

    <div v-if="error" class="text-red-500 text-xs font-bold ml-1 animate-in fade-in slide-in-from-top-1">
      {{ error }}
    </div>
    <div v-else-if="hint" class="text-gray-400 text-xs ml-1">
      {{ hint }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { getCurrencyConfig } from '~/composables/useCurrency'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0
  },
  currency: {
    type: String,
    default: 'IDR'
  },
  prefix: {
    type: String,
    default: ''
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

const currencyConfig = computed(() => getCurrencyConfig(props.currency))
const isDecimalAllowed = computed(() => currencyConfig.value.decimals > 0)

const effectivePrefix = computed(() => {
  if (props.prefix) return props.prefix
  return currencyConfig.value.symbol
})

const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return ''
  const num = typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]/g, '')) : val
  if (isNaN(num)) return ''
  
  if (isDecimalAllowed.value) {
    // If it has a decimal part, preserve up to decimals
    return new Intl.NumberFormat(currencyConfig.value.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: currencyConfig.value.decimals
    }).format(num)
  }
  return new Intl.NumberFormat(currencyConfig.value.locale).format(num)
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

  // Count how many digits/dots exist before cursor
  const digitsBeforeCursor = rawValue.slice(0, cursorPosition).replace(/[^0-9.]/g, '').length

  let cleanValue = rawValue.replace(/[^0-9.]/g, '')

  if (cleanValue === '' || cleanValue === '.') {
    internalText.value = cleanValue
    emit('update:modelValue', 0)
    emit('change', 0)
    return
  }

  // Handle decimals if allowed
  if (isDecimalAllowed.value && cleanValue.includes('.')) {
    const parts = cleanValue.split('.')
    cleanValue = parts[0] + '.' + parts.slice(1).join('')
  } else {
    cleanValue = cleanValue.replace(/\./g, '')
  }

  // Remove leading zeros
  if (cleanValue.length > 1 && cleanValue.startsWith('0') && !cleanValue.startsWith('0.')) {
    cleanValue = cleanValue.replace(/^0+/, '') || '0'
  }

  const numValue = parseFloat(cleanValue)
  if (!isNaN(numValue)) {
    let formatted = ''
    if (cleanValue.endsWith('.')) {
      formatted = formatNumber(parseInt(cleanValue, 10)) + '.'
    } else if (cleanValue.includes('.')) {
      const parts = cleanValue.split('.')
      const intPart = formatNumber(parseInt(parts[0] || '0', 10))
      formatted = `${intPart}.${parts[1]}`
    } else {
      formatted = formatNumber(numValue)
    }

    internalText.value = formatted
    el.value = formatted
    emit('update:modelValue', numValue)
    emit('change', numValue)

    nextTick(() => {
      let newPos = 0
      let count = 0
      for (let i = 0; i < formatted.length; i++) {
        if (/[0-9.]/.test(formatted[i])) {
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
  // Allow navigation / edit keys
  if (
    [8, 9, 27, 13, 46, 35, 36, 37, 38, 39, 40].includes(event.keyCode) ||
    (event.ctrlKey || event.metaKey)
  ) {
    return
  }

  // Allow decimal point if decimal is permitted
  if (isDecimalAllowed.value && (event.key === '.' || event.key === ',' || event.keyCode === 190 || event.keyCode === 110)) {
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
