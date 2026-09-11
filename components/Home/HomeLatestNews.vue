<template>
    <section class="bg-white py-16 md:py-20 border-t border-gray-100">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-lg sm:text-2xl font-black text-navy font-display">{{ $t('home.news.title') }}</h2>
                <NuxtLink class="text-gray-500 hover:text-navy font-bold text-xs sm:text-sm" to="/news">
                    <span class="">{{ $t('home.news.view_more') }}</span>
                </NuxtLink>
            </div>

            <div v-if="loading" class="flex items-center justify-center py-20">
                <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin" />
            </div>

            <div v-else-if="articles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <NuxtLink v-for="news in articles" :key="news.slug" :to="`/news/${news.slug}`"
                    class="flex flex-col group cursor-pointer">
                    <div class="relative h-60 rounded-2xl overflow-hidden mb-5">
                        <img :src="useImageOrDefault(news.image)" :alt="news.title"
                            class="w-full h-full object-cover transition-transform duration-500" />
                        <div
                            class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent">
                        </div>
                        <span
                            class="absolute bottom-4 left-4 text-white text-xs font-bold bg-navy px-3 py-1 rounded-full">{{
                                news.category }}</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 text-sm text-gray-500 mb-2">
                            <span class="flex items-center gap-1">
                                <Icon icon="ph:calendar-blank-bold" class="text-sm" />
                                {{ news.date }}
                            </span>
                        </div>
                        <h3
                            class="text-lg sm:text-xl font-bold text-navy mb-3 line-clamp-2 font-display group-hover:text-primary transition-colors">
                            {{ news.title }}
                        </h3>
                        <div class="text-gray-500 mb-4 line-clamp-2 text-sm sm:text-base">
                            {{ news.excerpt }}
                        </div>
                        <span
                            class="text-navy font-bold text-xs sm:text-sm flex items-center gap-1">
                            {{ $t('home.news.read_more') }} <Icon icon="ph:arrow-right-bold" class="text-sm" />
                        </span>
                    </div>
                </NuxtLink>
            </div>

            <div v-else class="text-center py-16">
                <Icon icon="ph:newspaper-light" class="text-7xl text-gray-200 mb-4 mx-auto" />
                <p class="text-sm text-gray-400 font-medium">{{ $t('home.news.empty') }}</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const { data: newsResponse, pending: loading } = await useAsyncData(
    'latest-news',
    () => $fetch(`${apiBaseUrl}/news`, {
        query: { limit: '3' }
    })
)

const articles = computed(() => {
    const newsData = newsResponse.value?.data || []
    return newsData.slice(0, 3).map(article => ({
        slug: article.slug,
        title: article.title,
        date: article.published_at
            ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            : new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        category: article.category || 'Berita',
        image: article.image_url,
        excerpt: article.excerpt || ''
    }))
})
</script>

<style scoped>
</style>
