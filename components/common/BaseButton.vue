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
        primary: 'bg-primary text-btn-text shadow-sm transition-all',
        secondary: 'bg-surface-highlight text-btn-inverse hover:opacity-90',
        navy: 'bg-navy-dark text-btn-inverse shadow-sm hover:opacity-95',
        outline: 'border border-primary text-navy hover:bg-primary/5',
        ghost: 'text-navy hover:bg-primary/5',
        danger: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
        gold: 'bg-primary text-btn-text shadow-sm hover:bg-primary-hover transition-all', // Legacy support
        white: 'bg-white text-navy font-bold border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300'
    }
    return variants[props.variant] || variants.primary
})

const sizeClass = computed(() => {
    const sizes = {
        sm: 'px-3.5 py-2 text-xs rounded-xl min-h-[38px]',
        md: 'px-4 py-2.5 text-sm rounded-xl min-h-[44px]',
        lg: 'px-6 py-3 text-base rounded-xl min-h-[48px]',
        xl: 'px-8 py-4 text-lg rounded-2xl min-h-[54px]'
    }
    return sizes[props.size] || sizes.md
})

const iconSizeClass = computed(() => {
    const sizes = {
        sm: 'text-lg !text-[18px] min-w-[18px] min-h-[18px]',
        md: 'text-xl !text-[22px] min-w-[22px] min-h-[22px]',
        lg: 'text-2xl !text-[26px] min-w-[26px] min-h-[26px]',
        xl: 'text-3xl !text-[30px] min-w-[30px] min-h-[30px]'
    }
    return sizes[props.size] || sizes.md
})
</script>
