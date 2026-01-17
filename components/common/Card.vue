<template>
    <div class="rounded-xl border transition-all" :class="[
        variant === 'default' ? 'bg-surface-dark border-surface-highlight' : '',
        variant === 'highlight' ? 'bg-surface-dark border-brand-gold/30' : '',
        variant === 'ghost' ? 'bg-transparent border-transparent' : '',
        hoverable ? 'hover:border-brand-gold/50 cursor-pointer' : '',
        padding
    ]">
        <div v-if="$slots.header" class="px-6 py-4 border-b border-surface-highlight">
            <slot name="header" />
        </div>
        <div :class="bodyClass">
            <slot />
        </div>
        <div v-if="$slots.footer" class="px-6 py-4 border-t border-surface-highlight">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    variant: {
        type: String,
        default: 'default',
        validator: (v) => ['default', 'highlight', 'ghost'].includes(v)
    },
    hoverable: {
        type: Boolean,
        default: false
    },
    padding: {
        type: String,
        default: 'p-6'
    },
    bodyClass: {
        type: String,
        default: ''
    }
})
</script>
