<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden py-16 md:py-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-berita.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-2xl">
                    <div class="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest mb-4">
                        <Icon icon="ph:newspaper-clipping" class="text-lg" />
                        <span>Berita & Artikel</span>
                    </div>
                    <h1
                        class="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        Kabar Terbaru <br />
                        <span class="text-primary">Dunia Panahan</span>
                    </h1>
                    <p class="text-white/90 text-lg leading-relaxed max-w-lg">
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
                    <NuxtLink v-if="featuredArticle" :to="`/berita/${featuredArticle.slug || featuredArticle.id}`"
                        class="block group mb-10">
                        <div class="relative rounded-2xl overflow-hidden aspect-video bg-gray-200 shadow-xl">
                            <img :src="useImageOrDefault(featuredArticle.image || featuredArticle.image_url)"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                            </div>
                            <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <span
                                    class="px-3 py-1 bg-primary text-navy text-xs font-bold rounded-full uppercase tracking-wider">
                                    {{ featuredArticle.category }}
                                </span>
                                <h2
                                    class="text-white text-2xl md:text-3xl font-black mt-4 leading-tight group-hover:text-primary transition-colors">
                                    {{ featuredArticle.title }}
                                </h2>
                                <p class="text-gray-300 mt-3 line-clamp-2 max-w-2xl">{{ featuredArticle.excerpt }}</p>
                                <div class="flex items-center gap-4 mt-4 text-sm text-gray-400">
                                    <span class="flex items-center gap-1.5">
                                        <Icon icon="ph:calendar" />
                                        {{ featuredArticle.date }}
                                    </span>
                                    <span class="flex items-center gap-1.5">
                                        <Icon icon="ph:eye" />
                                        {{ featuredArticle.views }} views
                                    </span>
                                </div>
                            </div>
                        </div>
                    </NuxtLink>

                    <!-- Articles List -->
                    <div class="space-y-6">
                        <NuxtLink v-for="article in filteredArticles" :key="article.id"
                            :to="`/berita/${article.slug || article.id}`"
                            class="group flex gap-5 bg-white rounded-xl border border-gray-100 p-4 hover:border-primary/30 transition-all">

                            <!-- Thumbnail -->
                            <div class="w-32 h-32 md:w-40 md:h-28 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img :src="useImageOrDefault(article.image || article.image_url)"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            <!-- Content -->
                            <div class="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div class="flex items-center gap-3 mb-2">
                                        <span :class="[
                                            'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                                            article.category === 'event' ? 'bg-blue-50 text-blue-600' :
                                                article.category === 'pengumuman' ? 'bg-amber-50 text-amber-600' :
                                                    article.category === 'prestasi' ? 'bg-green-50 text-green-600' :
                                                        'bg-gray-100 text-gray-600'
                                        ]">
                                            {{ article.category }}
                                        </span>
                                        <span class="text-xs text-gray-400">{{ article.date }}</span>
                                    </div>
                                    <h3
                                        class="font-bold text-navy text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {{ article.title }}
                                    </h3>
                                    <p class="text-gray-500 text-sm mt-1 line-clamp-2 hidden md:block">{{
                                        article.excerpt }}</p>
                                </div>
                                <div class="flex items-center gap-4 text-xs text-gray-400 mt-2">
                                    <span class="flex items-center gap-1">
                                        <Icon icon="ph:user" />
                                        {{ article.author }}
                                    </span>
                                    <span class="flex items-center gap-1">
                                        <Icon icon="ph:eye" />
                                        {{ article.views }}
                                    </span>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- Load More -->
                    <div class="text-center mt-10">
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
                        <div class="space-y-5">
                            <NuxtLink v-for="(article, index) in popularArticles" :key="article.id"
                                :to="`/berita/${article.slug || article.id}`" class="group flex gap-4 items-start">
                                <div
                                    class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-sm flex-shrink-0">
                                    {{ index + 1 }}
                                </div>
                                <div>
                                    <h4
                                        class="font-bold text-navy text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {{ article.title }}
                                    </h4>
                                    <span class="text-xs text-gray-400 mt-1 block">{{ article.date }}</span>
                                </div>
                            </NuxtLink>
                        </div>
                    </div>

                    <!-- Upcoming Tournaments -->
                    <div class="bg-navy rounded-2xl p-6 shadow-lg text-white relative overflow-hidden">
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                        <h3 class="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                            <Icon icon="ph:trophy" class="text-primary" />
                            Turnamen Mendatang
                        </h3>
                        <div class="space-y-4 relative z-10">
                            <div v-for="event in upcomingEvents" :key="event.id"
                                class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
                                <div
                                    class="bg-white/10 rounded-lg w-12 h-12 flex flex-col items-center justify-center text-center flex-shrink-0">
                                    <span class="text-[10px] uppercase font-bold text-primary">{{ event.month }}</span>
                                    <span class="text-lg font-bold leading-none">{{ event.day }}</span>
                                </div>
                                <div>
                                    <h4 class="font-bold text-sm leading-tight">{{ event.name }}</h4>
                                    <div class="flex items-center gap-1 text-xs text-gray-400">
                                        <Icon icon="ph:map-pin" class="text-[10px]" />
                                        {{ event.location }}
                                    </div>
                                </div>
                            </div>
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
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'

definePageMeta({
    layout: 'landing'
})

const { get } = useApi()
const toast = useToast()
const searchQuery = ref('')
const activeCategory = ref('all')
const isLoadingMore = ref(false)
const isSubscribing = ref(false)
const subscribeEmail = ref('')
const articles = ref([])
const isLoading = ref(true)

const categories = [
    { label: 'Semua', value: 'all' },
    { label: 'Event', value: 'event' },
    { label: 'Pengumuman', value: 'pengumuman' },
    { label: 'Prestasi', value: 'prestasi' },
    { label: 'Tips & Tutorial', value: 'tips' },
]

const fetchArticles = async () => {
    isLoading.value = true
    try {
        const response = await get('/news')
        const newsData = Array.isArray(response?.data) ? response.data :
            Array.isArray(response) ? response : [];
        articles.value = newsData.map(article => ({
            id: article.id || article.uuid,
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt || '',
            category: article.category || 'event',
            date: article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            author: article.author_name || 'Tim Redaksi',
            views: article.views || 0,
            image: article.image_url
        }))
    } catch (error) {
        console.error('Failed to fetch articles:', error)
        toast.error('Gagal memuat berita')
        articles.value = []
    } finally {
        isLoading.value = false
    }
}

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

const upcomingEvents = ref([
    { id: 1, name: 'Jakarta Open 2024', month: 'Feb', day: '15', location: 'Senayan' },
    { id: 2, name: 'Surabaya Cup', month: 'Mar', day: '05', location: 'Surabaya' },
    { id: 3, name: 'National Indoor', month: 'Mar', day: '20', location: 'Bandung' },
])

const loadMore = async () => {
    isLoadingMore.value = true
    try {
        // In a real implementation, you would fetch more articles with pagination
        // For now, we'll just simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000))
    } finally {
        isLoadingMore.value = false
    }
}

onMounted(() => {
    fetchArticles()
})

const subscribe = async () => {
    if (!subscribeEmail.value) return
    isSubscribing.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Berhasil berlangganan!')
    subscribeEmail.value = ''
    isSubscribing.value = false
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
