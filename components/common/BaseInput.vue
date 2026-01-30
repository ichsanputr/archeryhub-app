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
                <input v-bind="$attrs" :value="displayValue" @input="handleCurrencyInput" @keydown="handleCurrencyKeydown" @blur="handleCurrencyBlur"
                    type="text" :placeholder="placeholder" :disabled="disabled" class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-navy text-sm font-medium transition-all
                   placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none
                   disabled:opacity-50 disabled:cursor-not-allowed pr-16" :class="[
                    icon ? 'pl-11' : 'pl-4',
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                ]" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">IDR</span>
            </template>

            <!-- Regular Input -->
            <template v-else>
                <input v-bind="$attrs" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                    :type="inputType" :placeholder="placeholder" :disabled="disabled" class="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50/50 text-navy text-sm font-medium transition-all
                   placeholder:text-gray-400 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none
                   disabled:opacity-50 disabled:cursor-not-allowed" :class="[
                    icon ? 'pl-11' : 'pl-4',
                    error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''
                ]" />
                <button v-if="type === 'password'" type="button" @click="isPasswordVisible = !isPasswordVisible"
                    class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors">
                    <Icon :icon="isPasswordVisible ? 'ph:eye-slash' : 'ph:eye'" class="text-[20px]" />
                </button>
            </template>
        </div>

        <p v-if="error" class="text-red-500 text-[11px] font-bold ml-1 animate-in fade-in slide-in-from-top-1">
            {{ error }}
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
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

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
    }
})

const emit = defineEmits(['update:modelValue'])

const isPasswordVisible = ref(false)

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
        return
    }
    
    // Format the number for display immediately
    const numValue = parseInt(rawValue, 10)
    if (!isNaN(numValue) && numValue > 0) {
        const formatted = new Intl.NumberFormat('id-ID').format(numValue)
        currencyDisplayValue.value = formatted
        emit('update:modelValue', numValue)
    } else {
        currencyDisplayValue.value = ''
        emit('update:modelValue', null)
    }
}

const handleCurrencyBlur = () => {
    // Clear the display ref on blur, will use computed value
    currencyDisplayValue.value = ''
}
</script>
