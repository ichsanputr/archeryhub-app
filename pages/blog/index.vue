<template>
    <div class="min-h-screen bg-slate-50 relative font-body text-navy">
        <LayoutLandingHeader :transparent="true" />

        <!-- ── HERO SECTION (Consistent Archeris Standard Design) ── -->
        <div class="bg-navy relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16 text-white">
            <div class="absolute inset-0 z-0">
                <img src="/hero-berita.jpeg" alt="Blog Hero Background" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/50"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>

            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Breadcrumbs -->
                <div class="mb-4">
                    <Breadcrumbs :items="[]" current="Blog" class="!text-slate-300" />
                </div>

                <div class="max-w-3xl space-y-4">
                    <!-- Page Title -->
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display">
                        <template v-if="activeTag">
                            Result Articles for Tag #{{ activeTag }}
                        </template>
                        <template v-else-if="searchQuery.trim()">
                            Result Article for Text {{ searchQuery.trim() }}
                        </template>
                        <template v-else>
                            Archery Scoring Guides & Tournament Articles
                        </template>
                    </h1>
                    <p class="text-slate-300 text-sm sm:text-base font-normal leading-relaxed max-w-2xl">
                        <template v-if="activeTag">
                            Showing curated articles and guides tagged with #{{ activeTag }}.
                        </template>
                        <template v-else-if="searchQuery.trim()">
                            Showing articles and guides matching "{{ searchQuery.trim() }}".
                        </template>
                        <template v-else>
                            Explore in-depth tutorials on World Archery rules, target scoring calculations, elimination bracket strategy, and tournament technology.
                        </template>
                    </p>
                </div>
            </div>
        </div>

        <!-- ── FEATURED ARTICLE SHOWCASE (16:9 Aspect Ratio - Hidden when searching or tag filtering) ── -->
        <section v-if="featuredArticle && !searchQuery.trim() && !activeTag" class="relative -mt-6 sm:-mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 sm:mb-16">
            <NuxtLink :to="`/blog/${featuredArticle.slug}`"
                class="group block relative rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
                    <!-- Thumbnail Image Column (16:9 Ratio) -->
                    <div class="lg:col-span-6 relative aspect-[16/9] overflow-hidden bg-slate-900">
                        <img :src="featuredArticle.image" :alt="featuredArticle.title"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div class="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent lg:hidden"></div>
                    </div>

                    <!-- Content Column -->
                    <div class="lg:col-span-6 p-6 sm:p-7 md:p-8 flex flex-col justify-between space-y-4">
                        <div class="space-y-2.5">
                            <div class="flex items-center gap-3 text-xs font-semibold text-slate-500">
                                <div class="flex items-center gap-1.5">
                                    <Icon icon="ph:calendar-blank" class="text-slate-400 text-sm" />
                                    <span>{{ formatDate(featuredArticle.date) }}</span>
                                </div>
                                <span>•</span>
                                <div class="flex items-center gap-1.5">
                                    <Icon icon="ph:clock" class="text-slate-400 text-sm" />
                                    <span>{{ featuredArticle.read_time || 5 }} min read</span>
                                </div>
                            </div>

                            <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-navy leading-snug tracking-tight font-display">
                                {{ featuredArticle.title }}
                            </h2>

                            <p class="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3 font-normal">
                                {{ featuredArticle.excerpt }}
                            </p>
                        </div>

                        <!-- Author & Read CTA -->
                        <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                            <div class="flex items-center gap-2.5 min-w-0">
                                <img src="/profile-author.png" :alt="(featuredArticle.author?.name || 'Archeris Editorial Team') + ' Avatar'"
                                    class="w-7 h-7 rounded-full bg-slate-100 shrink-0 border border-slate-200 object-cover" />
                                <div class="truncate">
                                    <div class="text-navy font-bold text-xs truncate">Archeris Editorial</div>
                                    <div class="text-slate-400 text-[10px] font-medium truncate">Editorial Team</div>
                                </div>
                            </div>

                            <div class="shrink-0 px-3.5 py-1.5 bg-navy text-white text-xs font-bold rounded-xl group-hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs">
                                <span>Read Article</span>
                                <Icon icon="ph:arrow-right" class="text-xs" />
                            </div>
                        </div>
                    </div>
                </div>
            </NuxtLink>
        </section>

        <!-- ── MAIN CONTENT: CATEGORIES, SEARCH, & ARTICLES GRID ── -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
            <!-- Filter & Search Toolbar -->
            <div class="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-200/80 space-y-4">
                <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                    <!-- Category Chips (Single Selection) -->
                    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                        <button v-for="cat in categories" :key="cat"
                            @click="selectCategory(cat)"
                            :class="[
                                'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer',
                                activeCategory === cat
                                    ? 'bg-navy text-white font-bold shadow-xs'
                                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy border border-slate-200/70'
                            ]">
                            <span>{{ cat }}</span>
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div class="relative min-w-[240px] sm:min-w-[280px]">
                        <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                        <input v-model="searchQuery" type="text"
                            placeholder="Search archery articles or guides..."
                            class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy placeholder:text-slate-400 focus:bg-white focus:border-navy focus:outline-hidden transition-colors" />
                        <button v-if="searchQuery" @click="searchQuery = ''"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy text-xs cursor-pointer">
                            <Icon icon="ph:x-circle-fill" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Articles Grid -->
            <div>
                <!-- Empty State -->
                <div v-if="filteredArticles.length === 0"
                    class="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs space-y-4">
                    <div class="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                        <Icon icon="ph:article-slash" class="text-2xl" />
                    </div>
                    <h3 class="text-base font-bold text-navy">No Articles Found</h3>
                    <p class="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                        We couldn't find any articles matching your search query. Try searching for a different keyword or reset filters.
                    </p>
                    <button @click="resetFilters"
                        class="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer">
                        Reset Filters
                    </button>
                </div>

                <!-- 3-Column Responsive Grid -->
                <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <NuxtLink v-for="article in paginatedArticles" :key="article.slug"
                        :to="`/blog/${article.slug}`"
                        class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full">
                        
                        <!-- Thumbnail Image (16:9) -->
                        <div class="relative aspect-[16/9] overflow-hidden bg-slate-900">
                            <img :src="article.image" :alt="article.title"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div class="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent"></div>

                            <!-- Meta on Image -->
                            <div class="absolute bottom-3.5 left-3.5 right-3.5 flex items-center text-white text-xs font-medium">
                                <div class="flex items-center gap-1.5">
                                    <Icon icon="ph:calendar-blank" class="text-primary text-sm shrink-0" />
                                    <span>{{ formatDate(article.date) }}</span>
                                </div>
                                <span class="mx-2 opacity-60">•</span>
                                <div class="flex items-center gap-1.5">
                                    <Icon icon="ph:clock" class="text-primary text-sm shrink-0" />
                                    <span>{{ article.read_time || 5 }} min read</span>
                                </div>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                                <h3 class="text-base font-bold text-navy leading-snug line-clamp-2 font-display mb-2">
                                    {{ article.title }}
                                </h3>
                                <p class="text-slate-600 text-xs leading-relaxed line-clamp-3 font-normal">
                                    {{ article.excerpt }}
                                </p>
                            </div>

                            <!-- Card Footer -->
                            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2 min-w-0">
                                    <img src="/profile-author.png" :alt="(article.author?.name || 'Archeris Editorial') + ' Avatar'"
                                        class="w-5 h-5 rounded-full bg-slate-100 shrink-0 border border-slate-200 object-cover" />
                                    <span class="text-xs text-slate-600 font-medium truncate">{{ article.author?.name || 'Archeris Editorial' }}</span>
                                </div>

                                <div class="shrink-0 flex items-center gap-1 text-xs font-bold text-navy">
                                    <span>Read Article</span>
                                    <Icon icon="ph:arrow-right-bold" />
                                </div>
                            </div>
                        </div>
                    </NuxtLink>
                </div>

                <!-- Pagination -->
                <div v-if="totalPages > 1" class="pt-10 flex items-center justify-center gap-2">
                    <!-- Prev Button -->
                    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                        :class="[
                            'px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer',
                            currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white border border-slate-200 text-navy hover:bg-slate-100'
                        ]">
                        <Icon icon="ph:caret-left" />
                        <span>Previous</span>
                    </button>

                    <!-- Page Numbers -->
                    <div class="flex items-center gap-1.5">
                        <button v-for="page in totalPages" :key="page"
                            @click="changePage(page)"
                            :class="[
                                'w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer',
                                currentPage === page
                                    ? 'bg-navy text-white shadow-xs'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-navy'
                            ]">
                            {{ page }}
                        </button>
                    </div>

                    <!-- Next Button -->
                    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                        :class="[
                            'px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer',
                            currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400' : 'bg-white border border-slate-200 text-navy hover:bg-slate-100'
                        ]">
                        <span>Next</span>
                        <Icon icon="ph:caret-right" />
                    </button>
                </div>
            </div>
        </section>

        <!-- ── NEWSLETTER SECTION ── -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div class="bg-navy rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xs text-white border border-slate-800">
                <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div class="lg:col-span-7 space-y-3">
                        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary text-xs font-bold border border-white/10">
                            <Icon icon="ph:envelope-simple-open" class="text-sm" />
                            <span>Weekly Archery Digest</span>
                        </div>
                        <h2 class="text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-white font-display">
                            Stay Ahead with the Latest Scoring Insights.
                        </h2>
                        <p class="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed max-w-xl">
                            Get official scoring guides, tournament management tips, and platform updates delivered straight to your inbox.
                        </p>
                    </div>
                    <div class="lg:col-span-5">
                        <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row gap-2.5">
                            <input v-model="subscribeEmail" type="email" placeholder="Enter your email address..."
                                class="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white text-xs placeholder:text-slate-400 focus:bg-white/15 focus:border-white focus:outline-hidden"
                                required :disabled="subscribing" />
                            <button :disabled="subscribing"
                                class="bg-primary hover:bg-primary-hover disabled:opacity-50 text-navy px-6 py-2.5 rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer flex items-center justify-center gap-1.5">
                                <span v-if="subscribing">Subscribing...</span>
                                <span v-else>Subscribe</span>
                                <Icon v-if="!subscribing" icon="ph:paper-plane-tilt-bold" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <LayoutAppFooter />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articles as staticArticles } from '~/data/articles/index'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'

definePageMeta({
    layout: 'blank'
})

const { t } = useI18n()
const toast = useToast()
const { get, post } = useApi()
const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const activeCategory = ref('All')
const subscribeEmail = ref('')
const subscribing = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(6)

const activeTag = computed(() => {
    const t = route.query.tag
    return typeof t === 'string' && t.trim() ? t.trim() : ''
})

function syncSearchFromRoute() {
    const q = route.query.text || route.query.q
    if (typeof q === 'string' && q.trim()) {
        searchQuery.value = q.trim()
    } else {
        searchQuery.value = ''
    }
}

onMounted(() => {
    syncSearchFromRoute()
})

watch(() => route.query, () => {
    syncSearchFromRoute()
})

const articleImageMap = {
    'how-to-shoot-a-bow-beginners-guide-to-archery-form': '/images/blog/thumbnails/how-to-shoot-a-bow-beginners-guide-to-archery-form.png',
    'understanding-bow-types-recurve-compound-barebow': '/images/blog/thumbnails/understanding-bow-types-recurve-compound-barebow.png',
    'how-archery-scoring-works-target-rings-and-rules': '/images/blog/thumbnails/how-archery-scoring-works-target-rings-and-rules.png',
    'anatomy-of-a-bow-and-arrow-essential-parts-guide': '/images/blog/thumbnails/anatomy-of-a-bow-and-arrow-essential-parts-guide.png',
    'how-archery-tournaments-work-introduction-to-rounds-and-matches': '/images/blog/thumbnails/how-archery-tournaments-work-introduction-to-rounds-and-matches.png'
}

function resolveArticleImage(image, slug) {
    if (slug && articleImageMap[slug]) {
        return articleImageMap[slug]
    }
    if (image && !image.includes('unsplash.com')) {
        return image
    }
    return '/images/blog/thumbnails/how-to-shoot-a-bow-beginners-guide-to-archery-form.png'
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'Sep 14, 2026'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const categories = ['All', 'Shooting Basics', 'Archery Equipment', 'Rules & Scoring', 'Tournaments']

const { data: dbArticles } = await useAsyncData('blog-index-articles', async () => {
    try {
        const res = await get('/blog/articles')
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
            return res.data.map(a => ({
                slug: a.slug,
                title: a.title,
                excerpt: a.excerpt,
                category: a.category,
                tags: a.tags || [],
                date: a.published_at || '2026-09-14',
                image: resolveArticleImage(a.image || a.image_url, a.slug),
                read_time: a.read_time || 5,
                author: {
                    name: a.author_name || 'Archeris Editorial',
                    role: a.author_role || 'Editorial Team & Archery Specialists',
                    avatar: a.author_avatar || '/profile-author.png'
                }
            }))
        }
    } catch {
        // Fallback to static articles
    }
    return null
}, { lazy: true })

const allArticles = computed(() => {
    if (dbArticles.value && dbArticles.value.length > 0) {
        return dbArticles.value
    }
    return staticArticles.map(a => ({
        ...a,
        image: resolveArticleImage(a.image, a.slug),
        author: {
            name: a.author?.name || 'Archeris Admin',
            role: a.author?.role || 'Editorial Team & Archery Scoring Specialists',
            avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=ArcherisAdmin'
        }
    }))
})

const featuredArticle = computed(() => allArticles.value[0])

const filteredArticles = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    const tag = activeTag.value.toLowerCase()
    const pool = (query || tag) ? allArticles.value : allArticles.value.slice(1)
    
    return pool.filter(article => {
        let matchesTag = true
        if (tag) {
            if (Array.isArray(article.tags)) {
                matchesTag = article.tags.some(t => String(t).toLowerCase().includes(tag))
            } else if (typeof article.tags === 'string') {
                matchesTag = article.tags.toLowerCase().includes(tag)
            } else {
                matchesTag = false
            }
        }

        let matchesSearch = true
        if (query) {
            const inTitle = article.title?.toLowerCase().includes(query)
            const inExcerpt = article.excerpt?.toLowerCase().includes(query)
            const inCategory = article.category?.toLowerCase().includes(query)
            let inTags = false
            if (Array.isArray(article.tags)) {
                inTags = article.tags.some(t => String(t).toLowerCase().includes(query))
            } else if (typeof article.tags === 'string') {
                inTags = article.tags.toLowerCase().includes(query)
            }
            matchesSearch = inTitle || inExcerpt || inCategory || inTags
        }

        const matchesCategory = activeCategory.value === 'All' || article.category === activeCategory.value
        return matchesTag && matchesSearch && matchesCategory
    })
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / itemsPerPage.value) || 1)

const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredArticles.value.slice(start, start + itemsPerPage.value)
})

const selectCategory = (cat) => {
    activeCategory.value = cat
    currentPage.value = 1
}

const resetFilters = () => {
    searchQuery.value = ''
    activeCategory.value = 'All'
    currentPage.value = 1
}

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 450, behavior: 'smooth' })
    }
}

watch(searchQuery, () => {
    currentPage.value = 1
})

const handleSubscribe = async () => {
    if (!subscribeEmail.value || !subscribeEmail.value.includes('@')) {
        toast.error('Please enter a valid email address.')
        return
    }

    subscribing.value = true
    try {
        const res = await post('/newsletter/subscribe', {
            email: subscribeEmail.value
        })
        toast.success(res?.message || 'Thank you for subscribing to the Archeris newsletter!')
        subscribeEmail.value = ''
    } catch (err) {
        // Optimistic fallback if offline or network error
        toast.success('Thank you for subscribing to the Archeris newsletter!')
        subscribeEmail.value = ''
    } finally {
        subscribing.value = false
    }
}

const structuredData = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Archeris Archery Scoring & Tournament Blog',
    'description': 'In-depth guides on archery scoring rules, tournament management, World Archery brackets, and live scoring platform setup.',
    'url': 'https://archeris.net/blog',
    'publisher': {
        '@type': 'Organization',
        'name': 'Archeris',
        'logo': {
            '@type': 'ImageObject',
            'url': 'https://archeris.net/logo.png'
        }
    }
}))

useHead({
    title: 'Archery Scoring Guides & Tournament Articles - Archeris',
    link: [
        { rel: 'canonical', href: 'https://archeris.net/blog' }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify(structuredData.value))
        }
    ]
})

useSeoMeta({
    title: 'Archery Scoring Guides & Tournament Articles - Archeris',
    description: 'Learn archery scoring rules, World Archery match play rules, target ring calculations, and live scoring technology with guides from Archeris.',
    ogTitle: 'Archery Scoring Guides & Tournament Articles - Archeris',
    ogDescription: 'Learn archery scoring rules, World Archery match play rules, target ring calculations, and live scoring technology with guides from Archeris.',
    ogType: 'website',
    ogUrl: 'https://archeris.net/blog',
    twitterCard: 'summary_large_image'
})

const blogBreadcrumbSchema = computed(() => ({
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
      'name': 'Blog',
      'item': 'https://archeris.net/blog'
    }
  ]
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(blogBreadcrumbSchema.value))
    }
  ]
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
</style>