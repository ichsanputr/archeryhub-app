<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
        <!-- Hero -->
        <section class="relative bg-gradient-to-b from-navy via-navy-dark to-slate-900 text-white overflow-hidden pt-12 pb-14 md:pt-16 md:pb-20">
            <!-- Background Image Slideshow changing every 5 seconds -->
            <div class="absolute inset-0 z-0">
                <transition-group name="hero-fade">
                    <div v-for="(img, idx) in heroImages" :key="img"
                        v-show="currentHeroIdx === idx"
                        class="absolute inset-0 w-full h-full">
                        <img :src="img" alt="Archery Documentation Background" class="w-full h-full object-cover object-center scale-105 transition-transform duration-[8000ms] ease-out" />
                    </div>
                </transition-group>
                <div class="absolute inset-0 bg-navy/85 backdrop-blur-[2px]"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>

            <div class="container mx-auto px-4 max-w-5xl relative z-10 text-center py-6">
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5 font-display">
                    {{ $t('docs.title_part2') }} <span class="text-primary">{{ $t('docs.title_part1') }}</span>
                </h1>
                <p class="text-slate-300 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed font-medium">
                    {{ $t('docs.description') }}
                </p>
                <!-- Search trigger -->
                <div class="max-w-lg mx-auto">
                    <button
                        @click="openSearch"
                        aria-label="Search documentation"
                        class="w-full flex items-center gap-3 pl-4 pr-4 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-primary focus:ring-4 focus:ring-primary/20 transition-all text-sm group shadow-sm backdrop-blur-md cursor-pointer"
                    >
                        <Icon icon="ph:magnifying-glass-bold" class="text-lg text-slate-300 group-hover:text-primary transition-colors" />
                        <span class="flex-1 text-left text-slate-300 font-medium">{{ $t('docs.search_placeholder') }}</span>
                        <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-xs text-slate-300 font-mono">Ctrl K</kbd>
                    </button>
                </div>
            </div>
        </section>

        <!-- Category Tabs (only when categories exist) -->
        <div v-if="hasCategories" class="sticky top-16 z-30 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-200">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-3">
                    <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer"
                        :class="activeCategory === cat.id
                            ? 'bg-primary/20 border border-primary/40 text-navy dark:text-primary font-black shadow-sm'
                            : 'text-gray-500 dark:text-slate-400 hover:text-navy dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 font-bold'">
                        <Icon :icon="cat.icon" class="text-base" />
                        {{ cat.label }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Content -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <!-- If categories exist in data -->
            <template v-if="hasCategories">
                <div v-for="cat in filteredCategories" :key="cat.id" class="mb-12">
                    <div class="flex items-center gap-3 mb-5">
                        <div class="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-navy shrink-0">
                            <Icon :icon="cat.icon" class="text-lg text-navy dark:text-primary" />
                        </div>
                        <div>
                            <h2 class="text-lg font-black text-navy dark:text-slate-100">{{ cat.label }}</h2>
                            <p class="text-gray-400 dark:text-slate-500 text-xs">{{ cat.description }}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <NuxtLink v-for="doc in filteredDocsByCat(cat.id)" :key="doc.slug" :to="`/docs/${doc.slug}`"
                            class="group bg-white dark:bg-slate-900 border border-gray-200/60 dark:border-slate-800 rounded-3xl p-6 hover:border-primary dark:hover:border-primary transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full">
                            <div class="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 group-hover:bg-primary/20 blur-xl rounded-full transition-all duration-300"></div>
                            <div class="flex items-start gap-4">
                                <div
                                    class="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-slate-800 group-hover:bg-primary border border-gray-100 dark:border-slate-700 group-hover:border-primary flex items-center justify-center text-navy dark:text-slate-200 group-hover:text-navy transition-all duration-300 shrink-0">
                                    <Icon :icon="doc.icon || 'ph:file-text-bold'" class="text-xl" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h3
                                        class="font-black text-navy dark:text-slate-100 text-base mb-2 leading-snug group-hover:text-navy dark:group-hover:text-primary transition-colors">
                                        {{ doc.title }}</h3>
                                    <div class="text-gray-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 font-medium">{{ doc.excerpt }}</div>
                                </div>
                            </div>
                            <div class="flex items-center mt-5 pt-4 border-t border-gray-100 dark:border-slate-800">
                                <span class="text-xs text-gray-400 dark:text-slate-500 font-semibold flex items-center gap-1.5">
                                    <Icon icon="ph:clock-bold" class="text-sm" /> {{ doc.readTime }}
                                </span>
                                <span
                                    class="ml-auto flex items-center gap-1 text-xs font-black text-navy dark:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    {{ $t('docs.read') || 'Read Guide' }}
                                    <Icon icon="ph:arrow-right-bold" class="text-xs" />
                                </span>
                            </div>
                        </NuxtLink>
                    </div>
                </div>
            </template>

            <!-- Flat list (when no categories are set) -->
            <template v-else>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-black text-navy dark:text-slate-100 tracking-tight font-display">
                            {{ locale === 'id' ? 'Semua Panduan Dokumentasi' : 'All Documentation Guides' }}
                        </h2>
                        <p class="text-gray-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
                            {{ locale === 'id' ? 'Jelajahi panduan penggunaan sistem, aturan perlombaan, dan pengoperasian turnamen secara lengkap.' : 'Explore complete architectural references, tournament rules, and step-by-step platform operations.' }}
                        </p>
                    </div>
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-xs font-bold text-navy dark:text-slate-200 shadow-xs self-start sm:self-auto">
                        <Icon icon="ph:files-bold" class="text-primary text-sm" />
                        <span>{{ allFilteredDocs.length }} {{ locale === 'id' ? 'Artikel Tersedia' : 'Articles Available' }}</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NuxtLink v-for="doc in allFilteredDocs" :key="doc.slug" :to="`/docs/${doc.slug}`"
                        class="group bg-white dark:bg-slate-900 border border-gray-200/70 dark:border-slate-800 hover:border-primary dark:hover:border-primary rounded-3xl p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full">
                        <div class="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 group-hover:bg-primary/25 blur-xl rounded-full transition-all duration-300"></div>

                        <div class="flex items-start gap-4">
                            <div
                                class="w-11 h-11 rounded-2xl bg-gray-50 dark:bg-slate-800 group-hover:bg-primary border border-gray-100 dark:border-slate-700 group-hover:border-primary flex items-center justify-center text-navy dark:text-slate-200 group-hover:text-navy transition-all duration-300 shrink-0">
                                <Icon :icon="doc.icon || 'ph:file-text-bold'" class="text-xl" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3
                                    class="font-black text-navy dark:text-slate-100 text-base mb-2 leading-snug group-hover:text-navy dark:group-hover:text-primary transition-colors">
                                    {{ doc.title }}</h3>
                                <div class="text-gray-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2 font-medium">{{ doc.excerpt }}</div>
                            </div>
                        </div>
                        <div class="flex items-center mt-5 pt-4 border-t border-gray-100 dark:border-slate-800">
                            <span class="text-xs text-gray-400 dark:text-slate-500 font-semibold flex items-center gap-1.5">
                                <Icon icon="ph:clock-bold" class="text-sm" /> {{ doc.readTime }}
                            </span>
                            <span
                                class="ml-auto flex items-center gap-1 text-xs font-black text-navy dark:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300">
                                {{ locale === 'id' ? 'Baca Panduan' : ($t('docs.read') || 'Read Guide') }}
                                <Icon icon="ph:arrow-right-bold" class="text-xs" />
                            </span>
                        </div>
                    </NuxtLink>
                </div>
            </template>

            <!-- Empty state -->
            <div v-if="allFilteredDocs.length === 0" class="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 p-8">
                <Icon icon="ph:file-search-bold" class="text-5xl text-gray-300 dark:text-slate-600 mb-4" />
                <p class="text-gray-500 dark:text-slate-400 font-bold text-sm">{{ locale === 'id' ? 'Dokumentasi tidak ditemukan' : ($t('docs.no_docs_found') || 'No documentation found') }}</p>
                <p class="text-gray-400 dark:text-slate-500 text-xs mt-1">{{ locale === 'id' ? 'Coba cari dengan kata kunci lain.' : 'Try adjusting your search query.' }}</p>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

definePageMeta({
    layout: 'docs',
    pageTransition: false,
    layoutTransition: false
})

const { t, locale } = useI18n()
const apiBaseUrl = useApiBaseUrl()

const { data: docsList } = await useAsyncData(
    'docs-api-list',
    () => $fetch(`${apiBaseUrl}/docs?lang=${locale.value}`),
    {
        watch: [locale]
    }
)

const docs = computed(() => (docsList.value as any[]) || [])

const route = useRoute()
const router = useRouter()

const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
}

const getQueryString = (val: any): string => {
    if (!val) return ''
    if (Array.isArray(val)) return String(val[0] || '')
    return String(val)
}

const searchQuery = ref<string>(getQueryString(route.query.q))

watch(searchQuery, (newVal) => {
    const trimmed = newVal.trim()
    if (trimmed !== '') {
        router.replace({ query: { ...route.query, q: trimmed } })
    } else {
        const q = { ...route.query }
        delete q.q
        router.replace({ query: q })
    }
})

watch(() => route.query.q, (newQ) => {
    const newQStr = getQueryString(newQ)
    if (newQStr !== searchQuery.value) {
        searchQuery.value = newQStr
    }
})

const activeCategory = ref((route.query.cat as string) || 'all')

watch(() => route.query.cat, (newCat) => {
    activeCategory.value = (newCat as string) || 'all'
})

const hasCategories = computed(() => {
    return docs.value.some((d: any) => d.category && d.category.trim() !== '')
})

const allFilteredDocs = computed(() => {
    return docs.value.filter((d: any) => {
        if (!searchQuery.value) return true
        const q = searchQuery.value.toLowerCase()
        return (d.title && d.title.toLowerCase().includes(q)) ||
               (d.excerpt && d.excerpt.toLowerCase().includes(q)) ||
               (d.slug && d.slug.toLowerCase().includes(q))
    })
})

const filteredDocsByCat = (categoryId: string) => {
    return allFilteredDocs.value.filter((d: any) => d.category === categoryId)
}

const categories = computed(() => [
    { id: 'all', label: locale.value === 'id' ? 'Semua Panduan' : 'All Guides', icon: 'ph:squares-four-bold', description: locale.value === 'id' ? 'Jelajahi seluruh artikel panduan resmi Archeris' : 'Browse all official documentation articles' },
    { id: 'accounts', label: locale.value === 'id' ? 'Tipe Akun' : 'User Accounts', icon: 'ph:users-three-bold', description: locale.value === 'id' ? 'Jenis akun, hak akses, dan pengaturan profil' : 'Account types, permissions, and profile setups' },
    { id: 'tournaments', label: locale.value === 'id' ? 'Turnamen' : 'Tournament Setup', icon: 'ph:trophy-bold', description: locale.value === 'id' ? 'Pengaturan event, jadwal, arena, dan widget embed' : 'Event wizards, schedules, venue setup, and embed widgets' },
    { id: 'scorekeeper', label: locale.value === 'id' ? 'Petugas Skor' : 'Scorekeeper Operations', icon: 'ph:device-mobile-bold', description: locale.value === 'id' ? 'Login kode singkat, input skor, dan koreksi poin' : 'Mobile short-code login, score inputs, and corrections' },
    { id: 'qualification', label: locale.value === 'id' ? 'Babak Kualifikasi' : 'Qualification Rounds', icon: 'ph:chart-line-up-bold', description: locale.value === 'id' ? 'Sesi tembakan, skor kumulatif, dan papan skor live' : 'Sessions, cumulative scoring, and live leaderboards' },
    { id: 'elimination', label: locale.value === 'id' ? 'Bagan Eliminasi' : 'Elimination Brackets', icon: 'ph:tree-structure-bold', description: locale.value === 'id' ? 'Bagan eliminasi, pemeringkatan, sistem set, dan shoot-off' : 'Brackets, seedings, byes, set system, and shoot-offs' }
])

const filteredCategories = computed(() => {
    if (activeCategory.value !== 'all') {
        return categories.value.filter(c => c.id === activeCategory.value)
    }
    return categories.value.filter(c => c.id !== 'all' && filteredDocsByCat(c.id).length > 0)
})

const heroImages = [
    '/hero-event-detail.jpeg',
    '/hero-homepage.jpeg',
    '/hero-event.jpeg',
    '/hero-club.jpeg',
    '/hero-berita.jpeg',
    '/hero-archer.jpeg'
]

const currentHeroIdx = ref(0)
const structuredData = computed(() => [
    {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://archeris.net/'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Documentation',
                'item': 'https://archeris.net/docs'
            }
        ]
    },
    {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Archery Scoring Documentation & Guides',
        'description': 'Official documentation for archery scoring, target butt allocations, and tournament operations.',
        'itemListElement': docs.value.slice(0, 10).map((d: any, idx: number) => ({
            '@type': 'ListItem',
            'position': idx + 1,
            'item': {
                '@type': 'TechArticle',
                'headline': d.title,
                'description': d.excerpt,
                'url': `https://archeris.net/docs/${d.slug}`
            }
        }))
    }
])

useHead(() => ({
    title: 'Documentation & Organizer Guides - Archeris',
    link: [
        { rel: 'canonical', href: 'https://archeris.net/docs' },
        { rel: 'alternate', hreflang: 'en', href: 'https://archeris.net/docs' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://archeris.net/docs' }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: structuredData.value ? JSON.stringify(structuredData.value) : ''
        }
    ]
}))

useSeoMeta({
    title: 'Documentation & Organizer Guides - Archeris',
    description: 'Explore step-by-step guides for digital archery scoring, target scorekeeping, World Archery elimination brackets, and tournament setup on Archeris.',
    ogTitle: 'Archery Scoring Documentation & Guides - Archeris',
    ogDescription: 'Explore step-by-step guides for digital archery scoring, target scorekeeping, World Archery elimination brackets, and tournament setup on Archeris.',
    ogType: 'website',
    ogUrl: 'https://archeris.net/docs',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Archery Scoring Documentation & Guides - Archeris',
    twitterDescription: 'Explore step-by-step guides for digital archery scoring, target scorekeeping, World Archery elimination brackets, and tournament setup on Archeris.'
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.hero-fade-enter-active,
.hero-fade-leave-active {
    transition: opacity 1.5s ease-in-out;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
    opacity: 0;
}
</style>
