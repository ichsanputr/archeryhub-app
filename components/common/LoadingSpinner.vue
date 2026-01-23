<template>
    <div class="flex items-center justify-center" :class="containerClass">
        <div class="rounded-full border-2 border-white border-t-transparent animate-spin" :class="sizeClass"></div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v)
    },
    fullPage: {
        type: Boolean,
        default: false
    }
})

const sizeClass = computed(() => {
    const sizes = {
        sm: 'size-4',
        md: 'size-8',
        lg: 'size-12',
        xl: 'size-16'
    }
    return sizes[props.size] || sizes.md
})

const containerClass = computed(() => {
    return props.fullPage ? 'min-h-[60vh]' : ''
})
</script>
