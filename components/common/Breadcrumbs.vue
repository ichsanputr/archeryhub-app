<template>
    <nav class="flex items-center whitespace-nowrap overflow-x-auto no-scrollbar py-1" aria-label="Breadcrumb">
        <ol class="flex items-center gap-2 text-xs sm:text-sm font-semibold">
            <li class="flex items-center gap-2">
                <NuxtLink to="/" class="text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                    <Icon icon="ph:house-bold" class="text-lg" />
                    <span class="hidden md:inline">{{ t('nav.home') }}</span>
                </NuxtLink>
                <Icon icon="ph:caret-right-bold" class="text-[10px] sm:text-xs text-gray-300 flex-shrink-0" />
            </li>

            <li v-for="(item, index) in items" :key="item.path || item.label || index" class="flex items-center gap-2">
                <NuxtLink v-if="item.path" :to="item.path"
                    class="text-gray-400 hover:text-primary transition-colors truncate max-w-[120px] md:max-w-none"
                    :class="{ 'text-navy font-bold': index === items.length - 1 && !current }">
                    {{ item.label }}
                </NuxtLink>
                <span v-else class="text-gray-400 truncate max-w-[120px] md:max-w-none">
                    {{ item.label }}
                </span>

                <Icon v-if="index < items.length - 1 || current" icon="ph:caret-right-bold"
                    class="text-[10px] sm:text-xs text-gray-300 flex-shrink-0" />
            </li>

            <li v-if="current" class="flex items-center">
                <span class="text-gray-400 truncate max-w-[150px] md:max-w-[400px]">
                    {{ current }}
                </span>
            </li>
        </ol>
    </nav>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({
    items: {
        type: Array,
        default: () => []
    },
    current: {
        type: String,
        default: ''
    }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
