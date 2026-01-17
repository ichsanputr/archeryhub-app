<template>
    <div class="rounded-xl border border-surface-highlight p-5 transition-all" :class="[
        trend === 'up' ? 'hover:border-green-500/50' : '',
        trend === 'down' ? 'hover:border-red-500/50' : '',
        !trend ? 'hover:border-brand-gold/50' : '',
        'bg-surface-dark'
    ]">
        <div class="flex items-start justify-between mb-3">
            <div class="size-10 rounded-lg flex items-center justify-center" :class="iconBgClass">
                <span class="material-symbols-outlined text-xl" :class="iconColorClass">{{ icon }}</span>
            </div>
            <div v-if="trend" class="flex items-center gap-1 text-xs font-medium" :class="trendClass">
                <span class="material-symbols-outlined text-sm">{{ trend === 'up' ? 'trending_up' : 'trending_down'
                    }}</span>
                <span>{{ trendValue }}</span>
            </div>
        </div>
        <div class="text-2xl font-bold text-white mb-1">{{ value }}</div>
        <div class="text-sm text-gray-400">{{ label }}</div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    label: {
        type: String,
        required: true
    },
    trend: {
        type: String,
        default: '',
        validator: (v) => ['', 'up', 'down'].includes(v)
    },
    trendValue: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: 'gold',
        validator: (v) => ['gold', 'green', 'blue', 'purple', 'red'].includes(v)
    }
})

const iconBgClass = computed(() => {
    const colors = {
        gold: 'bg-brand-gold/10',
        green: 'bg-green-500/10',
        blue: 'bg-blue-500/10',
        purple: 'bg-purple-500/10',
        red: 'bg-red-500/10'
    }
    return colors[props.color] || colors.gold
})

const iconColorClass = computed(() => {
    const colors = {
        gold: 'text-brand-gold',
        green: 'text-green-400',
        blue: 'text-blue-400',
        purple: 'text-purple-400',
        red: 'text-red-400'
    }
    return colors[props.color] || colors.gold
})

const trendClass = computed(() => {
    return props.trend === 'up' ? 'text-green-400' : 'text-red-400'
})
</script>
