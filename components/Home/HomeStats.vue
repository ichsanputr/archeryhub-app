<template>
    <section class="py-24 sm:py-32 bg-navy text-white overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-16 sm:mb-24">
                <h2 class="text-3xl sm:text-6xl font-black leading-tight font-display tracking-tighter">
                    Operators rely on us.<br />
                    Archers love us.
                </h2>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 items-end">
                <!-- Stat Item -->
                <NuxtLink v-for="(stat, index) in stats" :key="index" :to="localePath(stat.path)" class="group relative pl-8 border-l border-dashed border-white/20 block hover:opacity-90 transition-opacity">
                    <div class="text-4xl sm:text-6xl font-black text-primary mb-2 font-display tracking-tighter group-hover:translate-x-1 transition-transform inline-block">{{ stat.value }}</div>
                    <div class="text-white/60 text-xs sm:text-sm tracking-widest font-bold flex items-center gap-1.5">
                        {{ stat.label }} 
                        <Icon icon="ph:arrow-up-right-bold" class="opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs text-primary" />
                    </div>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const localePath = useLocalePath()
const apiBaseUrl = useApiBaseUrl()

const { data: newsResponse } = await useAsyncData('home-stats-news', () =>
    $fetch(`${apiBaseUrl}/news`),
    { server: true }
)

const articles = computed(() => {
    const rawData = newsResponse.value?.data || newsResponse.value || []
    return Array.isArray(rawData) ? rawData : []
})

const stats = computed(() => {
    const list = articles.value.slice(0, 4)
    const defaultStats = [
        { value: '10K+', label: 'Archery Athletes', path: '/news' },
        { value: '500+', label: 'Tournaments Organized', path: '/news' },
        { value: '4.9', label: 'App Store Rating', path: '/news' },
        { value: '1M+', label: 'Arrows Scored', path: '/news' },
    ]

    return defaultStats.map((item, index) => {
        const article = list[index]
        return {
            value: item.value,
            label: item.label,
            path: article ? `/news/${article.slug || article.uuid}` : '/news'
        }
    })
})
</script>

<style scoped>
</style>
