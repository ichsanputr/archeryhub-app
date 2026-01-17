<template>
    <button :type="type" :disabled="disabled || loading"
        class="inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[sizeClass, variantClass, fullWidth ? 'w-full' : '']">
        <CommonLoadingSpinner v-if="loading" size="sm" />
        <span v-else-if="icon" class="material-symbols-outlined" :class="iconSizeClass">{{ icon }}</span>
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (v) => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(v)
    },
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md', 'lg'].includes(v)
    },
    type: {
        type: String,
        default: 'button'
    },
    disabled: {
        type: Boolean,
        default: false
    },
    loading: {
        type: Boolean,
        default: false
    },
    icon: {
        type: String,
        default: ''
    },
    fullWidth: {
        type: Boolean,
        default: false
    }
})

const variantClass = computed(() => {
    const variants = {
        primary: 'bg-brand-gold text-black hover:bg-yellow-400',
        secondary: 'bg-surface-highlight text-white hover:bg-surface-dark',
        outline: 'border border-surface-highlight text-white hover:bg-surface-highlight',
        ghost: 'text-gray-400 hover:text-white hover:bg-surface-highlight',
        danger: 'bg-red-600 text-white hover:bg-red-500'
    }
    return variants[props.variant] || variants.primary
})

const sizeClass = computed(() => {
    const sizes = {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-2.5 text-sm rounded-xl',
        lg: 'px-6 py-3 text-base rounded-xl'
    }
    return sizes[props.size] || sizes.md
})

const iconSizeClass = computed(() => {
    const sizes = { sm: 'text-base', md: 'text-lg', lg: 'text-xl' }
    return sizes[props.size] || sizes.md
})
</script>
