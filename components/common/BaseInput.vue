<template>
    <div class="flex flex-col gap-1.5 w-full">
        <label v-if="label" class="text-navy text-sm font-bold ml-1 flex items-center gap-1">
            {{ label }}
            <span v-if="required" class="text-red-500">*</span>
        </label>

        <div class="relative group">
            <div v-if="icon"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors z-10">
                <Icon :icon="icon.includes(':') ? icon : `material-symbols:${icon}`" class="text-[20px]" />
            </div>

            <!-- Currency Input -->
            <template v-if="kind === 'currency'">
                <input v-bind="$attrs" :value="displayValue" @input="handleCurrencyInput"
                    @keydown="handleCurrencyKeydown" @blur="handleCurrencyBlur" type="text" :placeholder="placeholder"
                    :disabled="disabled" class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-navy text-sm font-medium transition-all
                   placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none
                   disabled:opacity-50 disabled:cursor-not-allowed pr-16" :class="[
                    icon ? 'pl-11' : 'pl-4',
                    displayError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                ]" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">IDR</span>
            </template>

            <!-- Regular Input -->
            <template v-else>
                <input v-bind="$attrs" :value="modelValue" @input="handleInput" :type="inputType"
                    :placeholder="placeholder" :disabled="disabled" :inputmode="numberOnly ? 'numeric' : undefined"
                    class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-navy text-sm font-medium transition-all
                   placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none
                   disabled:opacity-50 disabled:cursor-not-allowed" :class="[
                    icon ? 'pl-11' : 'pl-4',
                    displayError ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                ]" />
                <button v-if="type === 'password'" type="button" @click="isPasswordVisible = !isPasswordVisible"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors">
                    <Icon :icon="isPasswordVisible ? 'ph:eye-slash' : 'ph:eye'" class="text-[20px]" />
                </button>
            </template>
        </div>

        <p v-if="displayError" class="text-red-500 text-[11px] font-bold ml-1 animate-in fade-in slide-in-from-top-1">
            {{ displayError }}
        </p>
        <p v-else-if="hint" class="text-gray-400 text-[11px] ml-1">
            {{ hint }}
        </p>
    </div>
</template>

<script>
export default {
    inheritAttrs: false
}
</script>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    type: {
        type: String,
        default: 'text'
    },
    icon: String,
    required: Boolean,
    error: String,
    hint: String,
    disabled: Boolean,
    kind: {
        type: String,
        default: '',
        validator: (value) => ['', 'currency'].includes(value)
    },
    numberOnly: Boolean,
    rules: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['update:modelValue'])

const isPasswordVisible = ref(false)
const internalError = ref('')

// Show parent error if provided, otherwise show internal validation error
const displayError = computed(() => props.error || internalError.value)

const validateInternal = (value) => {
    internalError.value = ''
    if (!props.rules || props.rules.length === 0) return true

    for (const r of props.rules) {
        // Support { rule: fn, message: string }
        if (typeof r === 'object' && r.rule) {
            if (!r.rule(value)) {
                internalError.value = r.message
                return false
            }
        }
        // Support simple validation functions (like in useFormValidation)
        else if (typeof r === 'function') {
            const result = r(value)
            if (result !== true) {
                internalError.value = result
                return false
            }
        }
    }
    return true
}

const inputType = computed(() => {
    if (props.type === 'password') {
        return isPasswordVisible.value ? 'text' : 'password'
    }
    if (props.kind === 'currency') {
        return 'text'
    }
    return props.type
})

const currencyDisplayValue = ref('')

const displayValue = computed(() => {
    if (props.kind === 'currency') {
        // Use ref for real-time display during typing
        if (currencyDisplayValue.value !== '') {
            return currencyDisplayValue.value
        }
        // Fallback to formatted modelValue when not typing
        if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '' || props.modelValue === 0) {
            return ''
        }
        const numValue = typeof props.modelValue === 'string' ? parseFloat(props.modelValue.replace(/[^\d]/g, '')) : props.modelValue
        if (isNaN(numValue) || numValue === 0) return ''
        return new Intl.NumberFormat('id-ID').format(numValue)
    }
    return props.modelValue
})

const handleCurrencyKeydown = (event) => {
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([8, 9, 27, 13, 46, 110, 190].indexOf(event.keyCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (event.keyCode === 65 && event.ctrlKey === true) ||
        (event.keyCode === 67 && event.ctrlKey === true) ||
        (event.keyCode === 86 && event.ctrlKey === true) ||
        (event.keyCode === 88 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        return
    }
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && (event.keyCode < 96 || event.keyCode > 105)) {
        event.preventDefault()
    }
}

const handleCurrencyInput = (event) => {
    let rawValue = event.target.value.replace(/[^\d]/g, '')

    // Remove ALL leading zeros
    rawValue = rawValue.replace(/^0+/, '')

    // If empty after removing zeros, set to empty
    if (rawValue === '') {
        currencyDisplayValue.value = ''
        emit('update:modelValue', null)
        validateInternal(null) // Validate on currency input
        return
    }

    // Format the number for display immediately
    const numValue = parseInt(rawValue, 10)
    if (!isNaN(numValue) && numValue > 0) {
        const formatted = new Intl.NumberFormat('id-ID').format(numValue)
        currencyDisplayValue.value = formatted
        emit('update:modelValue', numValue)
        validateInternal(numValue) // Validate on currency input
    } else {
        currencyDisplayValue.value = ''
        emit('update:modelValue', null)
        validateInternal(null) // Validate on currency input
    }
}

const handleCurrencyBlur = () => {
    // Clear the display ref on blur, will use computed value
    currencyDisplayValue.value = ''
    // Re-validate on blur to ensure final state is checked
    validateInternal(props.modelValue)
}

const handleInput = (event) => {
    let value = event.target.value
    let changed = true

    if (props.numberOnly) {
        const filtered = value.replace(/\D/g, '')
        if (filtered !== value) {
            event.target.value = filtered
        } else {
            // If the filtered value is the same as the input value,
            // but the input was triggered by a non-numeric key,
            // we don't want to emit or validate.
        }

        // If the user typed a letter in an empty field, the filtered value is ""
        // but the modelValue was already "" (or null).
        // We should only emit/validate if the string of numbers actually changed.
        if (filtered === String(props.modelValue || '')) {
            changed = false
        }
        value = filtered
    }

    if (changed) {
        emit('update:modelValue', value)
        validateInternal(value)
    }
}

// Re-validate if modelValue changes externally
watch(() => props.modelValue, (newVal) => {
    validateInternal(newVal)
})

// Optional: Validate on mount if value exists
onMounted(() => {
    if (props.modelValue) {
        validateInternal(props.modelValue)
    }
})
</script>
