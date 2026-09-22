<template>
    <div class="flex flex-col gap-6">
        <div class="flex items-center gap-3 text-navy border-b border-gray-100 pb-3">
            <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon :icon="icon" class="text-xl" />
            </div>
            <h3 class="text-lg font-bold tracking-wide">{{ title }}</h3>
        </div>
        <slot />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
defineProps({
    icon: { type: String, required: true },
    title: { type: String, required: true }
})
</script>
