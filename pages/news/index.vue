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
                        <span>{{ $t('news_page.badge') }}</span>
                    </div>
                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        {{ $t('news_page.title_main') }} <br />
                        <span class="text-primary">{{ $t('news_page.title_highlight') }}</span>
                    </h1>
                    <p class="text-white/90 text-sm md:text-lg leading-relaxed max-w-xl">
                        {{ $t('news_page.description') }}
                    </p>
                </div>
            </div>
        </section>

        <!-- Category Tabs & Search -->
        <section class="sticky top-16 z-20 bg-white border-b border-slate-100 shadow-sm">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-4">
                    <!-- Categories and Sources -->
                    <div class="flex flex-col sm:flex-row sm:items-center gap-4 overflow-x-auto no-scrollbar">
                        <div class="flex items-center gap-2">
                            <button v-for="cat in categories" :key="cat.value" @click="activeCategory = cat.value" :class="[
                                'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
                                activeCategory === cat.value
                                    ? 'bg-navy text-white border-navy shadow-sm'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-navy'
                            ]">
                                {{ cat.label }}
                            </button>
                        </div>
                        
                        <div class="h-6 w-px bg-slate-200 hidden sm:block"></div>
                        
                        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto shrink-0 border border-slate-200/60">
                            <button v-for="src in sources" :key="src.value" @click="activeSource = src.value" :class="[
                                'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                                activeSource === src.value
                                    ? 'bg-white text-navy shadow-sm'
                                    : 'text-slate-500 hover:text-navy'
                            ]">
                                {{ src.label }}
                            </button>
                        </div>
                    </div>

                    <!-- Search -->
                    <div class="relative w-full lg:w-72">
                        <Icon icon="ph:magnifying-glass"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input v-model="searchQuery" type="text" :placeholder="$t('news_page.search_placeholder')"
                            class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="container mx-auto px-4 max-w-7xl py-12">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">

                <!-- Articles Grid -->
                <div class="lg:col-span-8">
                    <!-- Loading Skeleton -->
                    <PublicCardSkeleton v-if="isLoading" :count="6" type="media" />

                    <template v-else-if="allFilteredArticles.length > 0">
                        <!-- Featured Article -->
                        <NuxtLink v-if="featuredArticle" :to="localePath(`/news/${featuredArticle.slug || featuredArticle.id}`)"
                            class="block group mb-10">
                            <div class="relative rounded-2xl overflow-hidden aspect-video bg-slate-200 shadow-sm border border-slate-100 group-hover:border-slate-300 group-hover:shadow-md transition-all duration-200">
                                <img :src="useImageOrDefault(featuredArticle.image || featuredArticle.image_url)"
                                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                                </div>
                                <div class="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <div class="flex flex-wrap items-center gap-2">
                                        <span
                                            class="px-3 py-1 bg-primary text-navy text-[10px] font-black rounded-full tracking-wider capitalize">
                                            {{ $t(`news_page.categories.${featuredArticle.category}`) }}
                                        </span>
                                        <template v-if="featuredArticle.tags">
                                            <span v-for="tag in featuredArticle.tags.split(',')" :key="tag"
                                                class="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-black tracking-widest capitalize border border-white/20">
                                                #{{ tag.trim() }}
                                            </span>
                                        </template>
                                    </div>
                                    <h2
                                        class="text-white text-xl sm:text-2xl md:text-3xl font-black mt-4 leading-tight">
                                        {{ featuredArticle.title }}
                                    </h2>
                                    <p class="text-slate-300 mt-3 line-clamp-2 max-w-2xl">{{ featuredArticle.excerpt }}</p>
                                    <div class="flex items-center gap-4 mt-4 text-sm text-slate-400">
                                        <span class="flex items-center gap-1.5">
                                            <Icon icon="ph:calendar" />
                                            {{ featuredArticle.date }}
                                        </span>
                                        <div class="w-px h-4 bg-white/20"></div>
                                        <span class="flex items-center gap-1.5 text-white">
                                            <Icon icon="ph:user-bold" />
                                            {{ featuredArticle.author }}
                                        </span>
                                        <span v-if="!featuredArticle.organization_id && !featuredArticle.club_id"
                                            class="px-2 py-0.5 rounded bg-primary text-navy text-[9px] font-black tracking-widest ">
                                            {{ $t('news_page.official_badge') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </NuxtLink>

                        <!-- Articles List -->
                        <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 gap-6 pb-6">
                            <NuxtLink v-for="article in filteredArticles" :key="article.id"
                                :to="localePath(`/news/${article.slug || article.id}`)"
                                class="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200">

                                <div class="flex flex-col sm:flex-row h-full">
                                    <!-- Thumbnail -->
                                    <div
                                        class="w-full sm:w-48 md:w-56 h-48 sm:h-auto overflow-hidden bg-slate-100 flex-shrink-0">
                                        <img :src="useImageOrDefault(article.image || article.image_url)"
                                            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                                    </div>

                                    <!-- Content -->
                                    <div class="flex-1 p-5 md:p-6 flex flex-col justify-between">
                                        <div>
                                            <div class="flex items-center gap-3 mb-3">
                                                <span :class="[
                                                    'px-3 py-1 rounded-lg text-[10px] font-black tracking-wider capitalize',
                                                    article.category === 'event' ? 'bg-blue-50 text-blue-600' :
                                                        article.category === 'pengumuman' ? 'bg-amber-50 text-amber-600' :
                                                            article.category === 'prestasi' ? 'bg-green-50 text-green-600' :
                                                                'bg-slate-100 text-slate-600'
                                                ]">
                                                    {{ $t(`news_page.categories.${article.category}`) }}
                                                </span>
                                                <template v-if="article.tags">
                                                    <div class="flex flex-wrap gap-1">
                                                        <span v-for="tag in article.tags.split(',')" :key="tag"
                                                            class="px-2 py-0.5 rounded bg-slate-50 text-slate-400 text-[9px] font-black tracking-widest capitalize border border-slate-100 italic">
                                                            #{{ tag.trim() }}
                                                        </span>
                                                    </div>
                                                </template>
                                                <div class="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                                    <Icon icon="ph:calendar-blank-bold" />
                                                    {{ article.date }}
                                                </div>
                                            </div>
                                            <h3
                                                class="font-black text-navy text-xl leading-snug line-clamp-2 mb-3">
                                                {{ article.title }}
                                            </h3>
                                            <p class="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{{
                                                article.excerpt }}</p>
                                        </div>

                                        <div
                                            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-auto pt-4 border-t border-slate-100">
                                            <div class="flex items-center gap-2">
                                                <div
                                                    class="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                    <Icon icon="ph:user-bold" class="text-xs text-navy" />
                                                </div>
                                                <span class="text-xs font-bold text-navy">{{ article.author }}</span>
                                                <span v-if="!article.organization_id && !article.club_id"
                                                    class="px-2 py-0.5 rounded bg-primary text-navy text-[9px] font-black tracking-widest ">
                                                    {{ $t('news_page.official_badge') }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>

                        <!-- Pagination -->
                        <BasePagination
                            v-if="remainingFilteredArticles.length > pageSize"
                            :current-page="currentPage"
                            :total-items="totalItems"
                            :items-per-page="pageSize"
                            :show-page-size="false"
                            @change-page="currentPage = $event" />
                    </template>

                    <!-- Main Empty State -->
                    <div v-else class="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-sm p-8 max-w-lg mx-auto">
                        <div class="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                            <Icon icon="ph:newspaper-light" class="text-3xl" />
                        </div>
                        <h3 class="text-lg font-bold text-navy mb-1">{{ $t('news_page.no_news') }}</h3>
                        <p class="text-sm text-slate-500 font-medium leading-relaxed mb-6">{{ $t('news_page.no_news_desc') }}</p>
                        <BaseButton v-if="searchQuery || activeCategory !== 'all' || activeSource !== 'all'" variant="outline" size="sm" @click="searchQuery = ''; activeCategory = 'all'; activeSource = 'all'">
                            {{ $t('common.reset_filters', 'Reset Filter') }}
                        </BaseButton>
                    </div>
                </div>

                <!-- Sidebar -->
                <aside class="lg:col-span-4 space-y-8">
                    <!-- Popular Articles -->
                    <div class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                        <h3 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                            <span class="w-1 h-6 bg-primary rounded-full"></span>
                            {{ $t('news_page.popular_title') }}
                        </h3>
                        <div v-if="popularArticles.length > 0" class="space-y-4">
                            <NuxtLink v-for="(article, index) in popularArticles" :key="article.id"
                                :to="localePath(`/news/${article.slug || article.id}`)"
                                class="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-all">
                                <div
                                    class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-navy font-black text-sm shrink-0">
                                    {{ index + 1 }}
                                </div>
                                <div class="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                    <img :src="useImageOrDefault(article.image || article.image_url)"
                                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4
                                        class="font-bold text-navy text-sm leading-snug line-clamp-2">
                                        {{ article.title }}
                                    </h4>
                                    <span class="text-[10px] text-slate-400 mt-1 block font-medium">{{ article.date }}</span>
                                </div>
                            </NuxtLink>
                        </div>
                        <div v-else class="flex flex-col items-center justify-center py-8 text-center">
                            <div class="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-300">
                                <Icon icon="ph:newspaper-light" class="text-2xl" />
                            </div>
                            <p class="text-xs text-slate-400 font-medium whitespace-nowrap">{{ $t('news_page.no_popular') }}</p>
                        </div>
                    </div>

                    <!-- Upcoming Tournaments -->
                    <div class="bg-navy rounded-2xl p-6 shadow-md text-white relative overflow-hidden border border-white/10">
                        <div class="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                        <h3 class="text-lg font-bold mb-6 flex items-center gap-2 relative z-10">
                            <Icon icon="ph:trophy-bold" class="text-primary" />
                            {{ $t('news_page.upcoming_title') }}
                        </h3>
                        <div v-if="upcomingEvents.length > 0" class="space-y-4 relative z-10">
                            <div v-for="event in upcomingEvents" :key="event.id"
                                @click="$router.push(localePath(`/events/${event.id}`))"
                                class="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                                <div
                                    class="bg-white/10 rounded-xl w-12 h-12 flex flex-col items-center justify-center text-center shrink-0 group-hover:bg-primary group-hover:text-navy transition-colors">
                                    <span class="text-[9px] font-bold text-primary group-hover:text-navy/70 leading-none mb-0.5">{{
                                        event.month }}</span>
                                    <span class="text-lg font-black leading-none">{{ event.day }}</span>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h4 class="font-bold text-xs sm:text-sm leading-tight truncate mb-1">{{ event.name }}</h4>
                                    <div class="flex items-center gap-1 text-[11px] text-slate-400">
                                        <Icon icon="ph:map-pin-bold" class="text-xs shrink-0" />
                                        <span class="truncate">{{ event.location }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="flex flex-col items-center justify-center py-8 relative z-10 text-center">
                            <div class="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-3 text-white/30">
                                <Icon icon="ph:calendar-blank" class="text-2xl" />
                            </div>
                            <p class="text-xs text-white/40 whitespace-nowrap">{{ $t('news_page.no_upcoming') }}</p>
                        </div>
                        <NuxtLink :to="localePath('/events')"
                            class="inline-flex items-center gap-1.5 text-primary text-xs font-bold mt-6 hover:text-white transition-colors relative z-10">
                            {{ $t('news_page.all_tournaments') }}
                            <Icon icon="ph:arrow-right-bold" />
                        </NuxtLink>
                    </div>

                    <!-- Subscribe -->
                    <div
                        class="bg-gradient-to-br from-primary to-amber-400 rounded-2xl p-6 shadow-md relative overflow-hidden">
                        <div class="relative z-10">
                            <h4 class="font-black text-navy text-lg mb-1">{{ $t('news_page.subscribe_title') }}</h4>
                            <p class="text-navy/80 text-xs sm:text-sm mb-4 leading-relaxed font-medium">{{ $t('news_page.subscribe_desc') }}</p>
                            <form @submit.prevent="subscribe" class="space-y-2.5">
                                <input v-model="subscribeEmail" type="email" :placeholder="$t('news_page.subscribe_placeholder')"
                                    class="w-full px-4 py-2.5 rounded-xl text-sm border-0 focus:ring-2 focus:ring-navy/50 outline-none text-navy placeholder:text-navy/40 shadow-xs" required />
                                <BaseButton type="submit" variant="navy" block :loading="isSubscribing">
                                    {{ isSubscribing ? $t('news_page.subscribing_button') : $t('news_page.subscribe_button') }}
                                </BaseButton>
                            </form>
                        </div>
                        <Icon icon="ph:envelope"
                            class="absolute -bottom-6 -right-6 text-[8rem] text-navy/10 rotate-12 pointer-events-none" />
                    </div>
                </aside>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'landing'
})

useHead({ title: computed(() => t('news.all_title', 'News & Articles') + ' - Archeris') })


const { t, locale } = useI18n()
const localePath = useLocalePath()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const toast = useToast()

const searchQuery = ref('')
const activeCategory = ref('all')
const activeSource = ref('all')
const isLoadingMore = ref(false)
const isSubscribing = ref(false)
const subscribeEmail = ref('')
const currentPage = ref(1)
const pageSize = ref(6)
const hasMoreArticles = ref(true)

const categories = computed(() => [
    { label: t('news_page.categories.all'), value: 'all' },
    { label: t('news_page.categories.event'), value: 'event' },
    { label: t('news_page.categories.pengumuman'), value: 'pengumuman' },
    { label: t('news_page.categories.prestasi'), value: 'prestasi' },
    { label: t('news_page.categories.tips'), value: 'tips' },
])

const sources = computed(() => [
    { label: t('news_page.sources.all'), value: 'all' },
    { label: t('news_page.sources.official'), value: 'official' },
    { label: t('news_page.sources.community'), value: 'community' },
])

import { watch } from 'vue'

const { data: newsResponse, pending: isLoading } = await useAsyncData('news', () =>
    $fetch(`${apiBaseUrl}/news`, {
        query: { limit: 1000 }
    }),
    { server: true }
)

const articles = computed(() => {
    const rawData = newsResponse.value?.data || newsResponse.value || []
    const newsData = Array.isArray(rawData) ? rawData : []
    const lang = locale.value === 'id' ? 'id-ID' : 'en-US'

    return newsData.map(article => ({
        id: article.id || article.uuid,
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt || '',
        category: article.category || 'event',
        tags: article.tags || '',
        date: article.published_at ? new Date(article.published_at).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(article.created_at).toLocaleDateString(lang, { day: 'numeric', month: 'short', year: 'numeric' }),
        author: article.author_name || 'Tim Redaksi',
        views: article.views || 0,
        image: article.image_url,
        organization_id: article.organization_id,
        club_id: article.club_id
    }))
})

const allFilteredArticles = computed(() => {
    return articles.value.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesCategory = activeCategory.value === 'all' || article.category === activeCategory.value
        
        let matchesSource = true
        const isOfficial = !article.organization_id && !article.club_id
        if (activeSource.value === 'official') {
            matchesSource = isOfficial
        } else if (activeSource.value === 'community') {
            matchesSource = !isOfficial
        }
        
        return matchesSearch && matchesCategory && matchesSource
    })
})

const featuredArticle = computed(() => allFilteredArticles.value[0] || null)

const remainingFilteredArticles = computed(() => {
    return allFilteredArticles.value.slice(1)
})

const filteredArticles = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return remainingFilteredArticles.value.slice(start, end)
})

const totalItems = computed(() => remainingFilteredArticles.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value) || 1)

watch([activeCategory, searchQuery, activeSource], () => {
    currentPage.value = 1
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
    const lang = locale.value === 'id' ? 'id-ID' : 'en-US'

    return (Array.isArray(rawEvents) ? rawEvents : []).map(event => {
        const d = new Date(event.start_date || event.created_at)
        return {
            id: event.id || event.uuid,
            name: event.name,
            month: d.toLocaleDateString(lang, { month: 'short' }),
            day: d.toLocaleDateString(lang, { day: '2-digit' }),
            location: event.city || event.location || 'Indonesia'
        }
    })
})

const subscribe = async () => {
    if (!subscribeEmail.value) return
    isSubscribing.value = true
    try {
        await $fetch(`${apiBaseUrl}/news/subscribe`, {
            method: 'POST',
            body: { email: subscribeEmail.value }
        })
        toast.success(t('news_page.subscribe_success'))
        subscribeEmail.value = ''
    } catch (err) {
        toast.error(t('news_page.subscribe_error'))
    } finally {
        isSubscribing.value = false
    }
}

useHead({
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: () => `${t('news_page.badge')} - Archeris.net`,
    description: () => t('news_page.description')
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
