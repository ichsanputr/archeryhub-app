<template>
    <div class="flex items-center justify-center" :class="containerClass">
        <Icon icon="ph:spinner-bold" class="animate-spin shrink-0" :class="[sizeClass, colorClass]" />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v)
    },
    color: {
        type: String,
        default: 'primary' // 'primary', 'white', 'navy', 'gray'
    },
    fullPage: {
        type: Boolean,
        default: false
    }
})

const sizeClass = computed(() => {
    const sizes = {
        sm: 'text-base',
        md: 'text-2xl',
        lg: 'text-4xl',
        xl: 'text-5xl'
    }
    return sizes[props.size] || sizes.md
})

const colorClass = computed(() => {
    if (props.color === 'white') return 'text-white'
    if (props.color === 'navy') return 'text-navy'
    if (props.color === 'gray') return 'text-gray-400'
    return 'text-primary'
})

const containerClass = computed(() => {
    return props.fullPage ? 'min-h-[60vh]' : ''
})
</script>
