<template>
    <section class="bg-white py-16 md:py-20 border-t border-gray-100">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">Kabar Terbaru</h2>
                <NuxtLink class="text-gray-500 hover:text-navy font-bold text-xs sm:text-sm" to="/news">Cek Berita
                    Lainnya
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
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div
                            class="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent">
                        </div>
                        <span
                            class="absolute bottom-4 left-4 text-white text-xs font-bold bg-navy px-3 py-1 rounded-md">{{
                                news.category }}</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center gap-3 text-sm text-gray-500 mb-2">
                            <span class="flex items-center gap-1">
                                <span class="material-symbols-outlined text-sm">calendar_today</span>
                                {{ news.date }}
                            </span>
                        </div>
                        <h3
                            class="text-lg sm:text-xl font-bold text-navy mb-3 group-hover:text-primary line-clamp-2 font-display transition-colors">
                            {{ news.title }}
                        </h3>
                        <p class="text-gray-500 mb-4 line-clamp-2 text-sm sm:text-base">
                            {{ news.excerpt }}
                        </p>
                        <span
                            class="text-navy group-hover:text-primary font-bold text-xs sm:text-sm flex items-center gap-1 transition-colors">
                            Simak Selengkapnya <span class="material-symbols-outlined text-sm">arrow_right_alt</span>
                        </span>
                    </div>
                </NuxtLink>
            </div>

            <div v-else class="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p class="text-sm text-gray-400">Belum ada berita terbaru.</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

const { get } = useApi()

const articles = ref([])
const loading = ref(true)

const fetchLatestNews = async () => {
    try {
        loading.value = true
        const response = await get('/news', { query: { limit: '3' } })
        const newsData = response?.data || []
        articles.value = newsData.slice(0, 3).map(article => ({
            slug: article.slug,
            title: article.title,
            date: article.published_at
                ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                : new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            category: article.category || 'Berita',
            image: article.image_url,
            excerpt: article.excerpt || ''
        }))
    } catch (error) {
        console.error('Failed to fetch latest news:', error)
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchLatestNews()
})
</script>

<style scoped></style>
