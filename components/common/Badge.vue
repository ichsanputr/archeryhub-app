<template>
    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium" :class="variantClasses">
        <span v-if="dot" class="size-1.5 rounded-full" :class="dotClass"></span>
        <slot />
    </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'default',
        validator: (v) => ['default', 'success', 'warning', 'danger', 'info', 'gold'].includes(v)
    },
    dot: {
        type: Boolean,
        default: false
    }
})

const variantClasses = computed(() => {
    const variants = {
        default: 'bg-surface-highlight text-gray-300',
        success: 'bg-green-900/40 text-green-400 border border-green-800',
        warning: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800',
        danger: 'bg-red-900/40 text-red-400 border border-red-800',
        info: 'bg-blue-900/40 text-blue-400 border border-blue-800',
        gold: 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30'
    }
    return variants[props.variant] || variants.default
})

const dotClass = computed(() => {
    const dots = {
        default: 'bg-gray-400',
        success: 'bg-green-400',
        warning: 'bg-yellow-400',
        danger: 'bg-red-400',
        info: 'bg-blue-400',
        gold: 'bg-brand-gold'
    }
    return dots[props.variant] || dots.default
})
</script>
