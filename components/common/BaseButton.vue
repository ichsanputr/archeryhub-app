<template>
    <!-- Use NuxtLink if 'to' prop is provided -->
    <NuxtLink v-if="to" :to="to" :disabled="disabled || loading"
        class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[sizeClass, variantClass, (fullWidth || block) ? 'w-full' : '']" @click="$emit('click', $event)">
        <LoadingSpinner v-if="loading" size="sm" />
        <template v-else>
            <Icon v-if="icon && isIconify(icon)" :icon="icon" :class="iconSizeClass" />
            <span v-else-if="icon" class="material-symbols-outlined shrink-0" :class="iconSizeClass">{{ icon }}</span>
            <slot />
            <Icon v-if="iconRight && isIconify(iconRight)" :icon="iconRight" :class="iconSizeClass" />
            <span v-else-if="iconRight" class="material-symbols-outlined shrink-0" :class="iconSizeClass">{{ iconRight
                }}</span>
        </template>
        <span v-if="!loading && loadingText" class="ml-2">{{ loadingText }}</span>
    </NuxtLink>

    <!-- Use regular button otherwise -->
    <button v-else :type="type" :disabled="disabled || loading"
        class="inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        :class="[sizeClass, variantClass, (fullWidth || block) ? 'w-full' : '']" @click="$emit('click', $event)">
        <LoadingSpinner v-if="loading" size="sm" />
        <template v-else>
            <Icon v-if="icon && isIconify(icon)" :icon="icon" :class="iconSizeClass" />
            <span v-else-if="icon" class="material-symbols-outlined shrink-0" :class="iconSizeClass">{{ icon }}</span>
            <slot />
            <Icon v-if="iconRight && isIconify(iconRight)" :icon="iconRight" :class="iconSizeClass" />
            <span v-else-if="iconRight" class="material-symbols-outlined shrink-0" :class="iconSizeClass">{{ iconRight
                }}</span>
        </template>
        <span v-if="!loading && loadingText" class="ml-2">{{ loadingText }}</span>
    </button>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps({
    variant: {
        type: String,
        default: 'primary',
        validator: (v) => ['primary', 'secondary', 'outline', 'ghost', 'danger', 'gold', 'white', 'navy'].includes(v)
    },
    size: {
        type: String,
        default: 'md',
        validator: (v) => ['sm', 'md', 'lg', 'xl'].includes(v)
    },
    to: {
        type: [String, Object],
        default: null
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
    iconRight: {
        type: String,
        default: ''
    },
    fullWidth: {
        type: Boolean,
        default: false
    },
    block: {
        type: Boolean,
        default: false
    },
    loadingText: {
        type: String,
        default: ''
    }
})

defineEmits(['click'])


const isIconify = (iconPath) => iconPath.includes(':')

const variantClass = computed(() => {
    const variants = {
        primary: 'bg-brand-gold text-navy-dark shadow-sm',
        secondary: 'bg-surface-highlight text-white',
        navy: 'bg-navy-dark text-white shadow-sm',
        outline: 'border border-gray-200 text-navy-dark',
        ghost: 'text-text-secondary',
        danger: 'bg-red-600 text-white shadow-sm',
        gold: 'bg-brand-gold text-navy-dark shadow-sm', // Legacy support
        white: 'bg-white text-navy-dark border border-gray-100 shadow-sm'
    }
    return variants[props.variant] || variants.primary
})

const sizeClass = computed(() => {
    const sizes = {
        sm: 'px-3 py-1.5 text-xs rounded-lg',
        md: 'px-4 py-2.5 text-sm rounded-xl',
        lg: 'px-6 py-3 text-base rounded-xl',
        xl: 'px-8 py-4 text-lg rounded-2xl'
    }
    return sizes[props.size] || sizes.md
})

const iconSizeClass = computed(() => {
    const sizes = {
        sm: 'text-base !text-[16px]',
        md: 'text-lg !text-[20px]',
        lg: 'text-xl !text-[24px]',
        xl: 'text-2xl !text-[28px]'
    }
    return sizes[props.size] || sizes.md
})
</script>
