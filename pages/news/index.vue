<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-berita.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:newspaper-clipping" class="text-base sm:text-lg" />
                        <span>Berita & Artikel</span>
                    </div>
                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Kabar Terbaru <br />
                        <span class="text-primary">Dunia Panahan</span>
                    </h1>
                    <p class="text-white/90 text-sm md:text-lg leading-relaxed max-w-xl">
                        Ikuti perkembangan terbaru turnamen, prestasi atlet, dan berita seputar komunitas panahan
                        Indonesia.
                    </p>
                </div>
            </div>
        </section>

        <!-- Category Tabs & Search -->
        <section class="sticky top-16 z-20 bg-white border-b border-gray-200 shadow-sm">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                    <!-- Categories -->
                    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                        <button v-for="cat in categories" :key="cat.value" @click="activeCategory = cat.value" :class="[
                            'px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all',
                            activeCategory === cat.value
                                ? 'bg-navy text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                        ]">
                            {{ cat.label }}
                        </button>
                    </div>

                    <!-- Search -->
                    <div class="relative w-full md:w-72">
                        <Icon icon="ph:magnifying-glass"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="Cari berita..."
                            class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="container mx-auto px-4 max-w-7xl py-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

                <!-- Articles Grid -->
                <div class="lg:col-span-8">
                    <!-- Featured Article -->
                    <NuxtLink v-if="featuredArticle" :to="`/news/${featuredArticle.slug || featuredArticle.id}`"
                        class="block group mb-10">
                        <div class="relative rounded-2xl overflow-hidden aspect-video bg-gray-200 shadow-xl">
                            <img :src="useImageOrDefault(featuredArticle.image || featuredArticle.image_url)"
                                class="w-full h-full object-cover transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span
                                        class="px-3 py-1 bg-primary text-navy text-xs font-black rounded-full  tracking-wider capitalize">
                                        {{ featuredArticle.category }}
                                    </span>
                                    <template v-if="featuredArticle.tags">
                                        <span v-for="tag in featuredArticle.tags.split(',')" :key="tag"
                                            class="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-black tracking-widest capitalize border border-white/20">
                                            #{{ tag.trim() }}
                                        </span>
                                    </template>
                                </div>
                                <h2
                                    class="text-white text-xl sm:text-2xl md:text-3xl font-black mt-4 leading-tight group-hover:text-primary transition-colors">
                                    {{ featuredArticle.title }}
                                </h2>
                                <p class="text-gray-300 mt-3 line-clamp-2 max-w-2xl">{{ featuredArticle.excerpt }}</p>
                                <div class="flex items-center gap-4 mt-4 text-sm text-gray-400">
                                    <span class="flex items-center gap-1.5">
                                        <Icon icon="ph:calendar" />
                                        {{ featuredArticle.date }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </NuxtLink>

                    <!-- Articles List -->
                    <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 gap-6">
                        <NuxtLink v-for="article in filteredArticles" :key="article.id"
                            :to="`/news/${article.slug || article.id}`"
                            class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-primary/50 hover:shadow-sm hover:shadow-primary/5 transition-all duration-300">

                            <div class="flex flex-col sm:flex-row h-full">
                                <!-- Thumbnail -->
                                <div
                                    class="w-full sm:w-48 md:w-56 h-48 sm:h-auto overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img :src="useImageOrDefault(article.image || article.image_url)"
                                        class="w-full h-full object-cover transition-transform duration-700" />
                                </div>

                                <!-- Content -->
                                <div class="flex-1 p-5 md:p-6 flex flex-col justify-between">
                                    <div>
                                        <div class="flex items-center gap-3 mb-3">
                                            <span :class="[
                                                'px-3 py-1 rounded-lg text-[10px] font-black  tracking-wider capitalize',
                                                article.category === 'event' ? 'bg-blue-50 text-blue-600' :
                                                    article.category === 'pengumuman' ? 'bg-amber-50 text-amber-600' :
                                                        article.category === 'prestasi' ? 'bg-green-50 text-green-600' :
                                                            'bg-gray-100 text-gray-600'
                                            ]">
                                                {{ article.category }}
                                            </span>
                                            <template v-if="article.tags">
                                                <div class="flex flex-wrap gap-1">
                                                    <span v-for="tag in article.tags.split(',')" :key="tag"
                                                        class="px-2 py-0.5 rounded bg-gray-50 text-gray-400 text-[9px] font-black tracking-widest capitalize border border-gray-100 italic">
                                                        #{{ tag.trim() }}
                                                    </span>
                                                </div>
                                            </template>
                                            <div class="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                                                <Icon icon="ph:calendar-blank-bold" />
                                                {{ article.date }}
                                            </div>
                                        </div>
                                        <h3
                                            class="font-black text-navy text-xl leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-3">
                                            {{ article.title }}
                                        </h3>
                                        <p class="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{{
                                            article.excerpt }}</p>
                                    </div>

                                    <div
                                        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-50">
                                        <div class="flex items-center gap-2">
                                            <div
                                                class="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                                <Icon icon="ph:user-bold" class="text-xs text-primary" />
                                            </div>
                                            <span class="text-xs font-bold text-navy">{{ article.author }}</span>
                                        </div>
                                        <span
                                            class="text-primary font-black text-xs  tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform self-start sm:self-auto">
                                            Baca Selengkapnya
                                            <Icon icon="ph:arrow-right-bold" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- Main Empty State -->
                    <div v-else-if="!isLoading" class="text-center py-20">
                        <Icon icon="ph:newspaper-light" class="text-7xl text-gray-200 mb-6 mx-auto" />
                        <h3 class="text-2xl font-black text-navy mb-3">Belum Ada Berita</h3>
                        <p class="text-gray-500 max-w-md mx-auto">Pantau terus kabar terbaru seputar dunia panahan di
                            sini.</p>
                    </div>

                    <!-- Load More -->
                    <div v-if="filteredArticles.length > 0 && hasMoreArticles" class="text-center mt-10">
                        <BaseButton variant="outline" size="lg" icon="ph:arrow-down" :loading="isLoadingMore"
                            @click="loadMore">
                            Muat Lebih Banyak
                        </BaseButton>
                    </div>
                </div>

                <!-- Sidebar -->
                <aside class="lg:col-span-4 space-y-8">
                    <!-- Popular Articles -->
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <h3 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                            <span class="w-1 h-6 bg-primary rounded-full"></span>
                            Berita Populer
                        </h3>
                        <div v-if="popularArticles.length > 0" class="space-y-5">
                            <NuxtLink v-for="(article, index) in popularArticles" :key="article.id"
                                :to="`/news/${article.slug || article.id}`"
                                class="group flex flex-col items-center text-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                                <div class="flex items-center gap-3 w-full text-left">
                                    <div
                                        class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                                        {{ index + 1 }}
                                    </div>
                                    <div class="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                                        <img :src="useImageOrDefault(article.image || article.image_url)"
                                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h4
                                            class="font-bold text-navy text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {{ article.title }}
                                        </h4>
                                        <span class="text-[10px] text-gray-400 mt-1 block font-medium">{{ article.date
                                            }}</span>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>
                        <div v-else class="flex flex-col items-center justify-center py-8 text-center">
                            <Icon icon="ph:newspaper-light" class="text-5xl text-gray-200 mb-6 mx-auto" />
                            <p class="text-xs text-gray-400 font-medium whitespace-nowrap">Belum ada berita populer.</p>
                        </div>
                    </div>

                    <!-- Upcoming Tournaments -->
                    <div class="bg-navy rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                        <h3 class="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                            <Icon icon="ph:trophy" class="text-primary" />
                            Turnamen Mendatang
                        </h3>
                        <div v-if="upcomingEvents.length > 0" class="space-y-6 relative z-10">
                            <div v-for="event in upcomingEvents" :key="event.id"
                                class="flex flex-col items-center text-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div
                                    class="bg-white/10 rounded-lg w-14 h-14 flex flex-col items-center justify-center text-center flex-shrink-0 group-hover:bg-primary group-hover:text-navy transition-colors">
                                    <span class="text-[10px]  font-bold text-primary group-hover:text-navy/70">{{
                                        event.month }}</span>
                                    <span class="text-xl font-black leading-none">{{ event.day }}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-sm leading-tight mb-2">{{ event.name }}</h4>
                                    <div class="flex items-center justify-center gap-1 text-xs text-gray-400">
                                        <Icon icon="ph:map-pin" class="text-[10px]" />
                                        {{ event.location }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex flex-col items-center justify-center py-10 relative z-10 text-center">
                            <Icon icon="ph:calendar-blank" class="text-4xl text-white/10 mb-2" />
                            <p class="text-xs text-white/30 whitespace-nowrap">Belum ada turnamen terdekat.</p>
                        </div>
                        <NuxtLink to="/events"
                            class="inline-flex items-center gap-1 text-primary text-xs font-bold mt-6 hover:text-white transition-colors">
                            Lihat Semua Turnamen
                            <Icon icon="ph:arrow-right" />
                        </NuxtLink>
                    </div>

                    <!-- Subscribe -->
                    <div
                        class="bg-gradient-to-br from-primary to-amber-400 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                        <div class="relative z-10">
                            <h4 class="font-bold text-navy text-lg mb-2">Berlangganan Update</h4>
                            <p class="text-navy/70 text-sm mb-4">Dapatkan berita terbaru langsung ke email Anda.</p>
                            <form @submit.prevent="subscribe" class="space-y-2">
                                <input v-model="subscribeEmail" type="email" placeholder="Alamat email Anda"
                                    class="w-full px-4 py-2.5 rounded-lg text-sm border-0 focus:ring-2 focus:ring-navy/50 outline-none" />
                                <BaseButton type="submit" variant="navy" block :loading="isSubscribing">
                                    Langganan
                                </BaseButton>
                            </form>
                        </div>
                        <Icon icon="ph:envelope"
                            class="absolute -bottom-6 -right-6 text-[8rem] text-navy/10 rotate-12" />
                    </div>
                </aside>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'landing'
})

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const toast = useToast()
const searchQuery = ref('')
const activeCategory = ref('all')
const isLoadingMore = ref(false)
const isSubscribing = ref(false)
const subscribeEmail = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const hasMoreArticles = ref(true)

const categories = [
    { label: 'Semua', value: 'all' },
    { label: 'Event', value: 'event' },
    { label: 'Pengumuman', value: 'pengumuman' },
    { label: 'Prestasi', value: 'prestasi' },
    { label: 'Tips & Tutorial', value: 'tips' },
]

const { data: newsResponse, pending: isLoading } = await useAsyncData('news', () =>
    $fetch(`${apiBaseUrl}/news`),
    { server: true }
)

const articles = computed(() => {
    const rawData = newsResponse.value?.data || newsResponse.value || []
    const newsData = Array.isArray(rawData) ? rawData : []

    return newsData.map(article => ({
        id: article.id || article.uuid,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || '',
        category: article.category || 'event',
        tags: article.tags || '',
        date: article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        author: article.author_name || 'Tim Redaksi',
        views: article.views || 0,
        image: article.image_url
    }))
})

const featuredArticle = computed(() => articles.value[0] || null)

const filteredArticles = computed(() => {
    return articles.value.slice(1).filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = activeCategory.value === 'all' || article.category === activeCategory.value
        return matchesSearch && matchesCategory
    })
})

const popularArticles = computed(() => {
    return [...articles.value].sort((a, b) => b.views - a.views).slice(0, 5)
})

// SSR Data Fetching for Upcoming Events
const { data: eventsResponse } = await useAsyncData(
    'news-sidebar-events',
    () => $fetch(`${apiBaseUrl}/events`, {
        query: { limit: 3 }
    }),
    { server: true }
)

const upcomingEvents = computed(() => {
    const rawEvents = eventsResponse.value?.data || eventsResponse.value || []
    return (Array.isArray(rawEvents) ? rawEvents : []).map(event => {
        const d = new Date(event.start_date || event.created_at)
        return {
            id: event.id || event.uuid,
            name: event.name,
            month: d.toLocaleDateString('id-ID', { month: 'short' }),
            day: d.toLocaleDateString('id-ID', { day: '2-digit' }),
            location: event.city || event.location || 'Indonesia'
        }
    })
})

const loadMore = async () => {
    if (isLoadingMore.value || !hasMoreArticles.value) return
    isLoadingMore.value = true
    try {
        currentPage.value++
        const response = await $fetch(`${apiBaseUrl}/news`, {
            query: {
                page: currentPage.value,
                limit: pageSize.value
            }
        })
        const newRawData = response?.data || response || []
        if (newRawData.length < pageSize.value) {
            hasMoreArticles.value = false
        }
        // In a real scenario, you'd push to a ref that articles computed depends on.
    } catch (e) {
        console.error(e)
    } finally {
        isLoadingMore.value = false
    }
}

const subscribe = async () => {
    if (!subscribeEmail.value) return
    isSubscribing.value = true
    try {
        await $fetch(`${apiBaseUrl}/news/subscribe`, {
            method: 'POST',
            body: { email: subscribeEmail.value }
        })
        toast.success('Berhasil berlangganan!')
        subscribeEmail.value = ''
    } catch (err) {
        toast.error('Gagal berlangganan. Silakan coba lagi nanti.')
    } finally {
        isSubscribing.value = false
    }
}
useHead({
    title: 'Berita Panahan Terbaru - Archeryhub.id',
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    meta: [
        { name: 'description', content: 'Ikuti perkembangan terbaru turnamen, prestasi atlet, dan berita seputar komunitas panahan Indonesia.' }
    ]
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
