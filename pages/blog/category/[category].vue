<template>
    <div class="min-h-screen bg-slate-50 relative font-body text-navy flex flex-col justify-between">
        <div>
            <LayoutLandingHeader :transparent="true" />

            <!-- ── CATEGORY HERO BANNER ── -->
            <div class="bg-navy relative overflow-hidden pt-28 pb-14 sm:pt-36 sm:pb-20 text-white">
                <!-- Background Image & Gradient Overlays -->
                <div class="absolute inset-0 z-0">
                    <img src="/hero-berita.jpeg" alt="Category Background" class="w-full h-full object-cover opacity-30" />
                    <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/60"></div>
                    <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
                </div>

                <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <!-- Breadcrumbs -->
                    <div class="mb-4">
                        <Breadcrumbs 
                            :items="[{ label: 'Blog', path: '/blog' }]" 
                            :current="categoryInfo?.name || currentCategoryParam" 
                            class="!text-slate-300" 
                        />
                    </div>

                    <div class="max-w-3xl space-y-4">
                        <!-- Category Badge Pill -->
                        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white/10 text-primary border border-white/15 backdrop-blur-md">
                            <Icon :icon="categoryInfo?.icon || 'ph:folder-bold'" class="text-sm" />
                            <span>Category Archive</span>
                            <span class="w-1 h-1 rounded-full bg-primary/60"></span>
                            <span>{{ filteredArticles.length }} {{ filteredArticles.length === 1 ? 'Article' : 'Articles' }}</span>
                        </div>

                        <!-- Main Category Title -->
                        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display">
                            {{ categoryInfo?.name || currentCategoryParam }}
                        </h1>

                        <!-- Category Description -->
                        <p class="text-slate-300 text-sm sm:text-base font-normal leading-relaxed max-w-2xl">
                            {{ categoryInfo?.description || 'Clear guides, rules, and tutorials for this category.' }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- ── CATEGORY NAVIGATION BAR ── -->
            <div class="sticky top-14 md:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div class="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
                        <!-- Category Navigation Pills -->
                        <div class="flex items-center gap-2 shrink-0">
                            <NuxtLink 
                                to="/blog" 
                                class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all text-slate-600 hover:text-navy hover:bg-slate-100 flex items-center gap-1.5"
                            >
                                <Icon icon="ph:squares-four-bold" class="text-sm" />
                                <span>All Articles</span>
                            </NuxtLink>

                            <NuxtLink 
                                v-for="cat in allCategories" 
                                :key="cat.slug"
                                :to="`/blog/category/${cat.slug}`"
                                :class="[
                                    'px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shrink-0',
                                    isCurrentCategory(cat.slug)
                                        ? 'bg-navy text-primary shadow-xs'
                                        : 'text-slate-600 hover:text-navy hover:bg-slate-100'
                                ]"
                            >
                                <Icon :icon="cat.icon" class="text-sm" />
                                <span>{{ cat.shortName || cat.name }}</span>
                            </NuxtLink>
                        </div>

                        <!-- Category Article Count -->
                        <div class="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 shrink-0">
                            <Icon icon="ph:article" class="text-base text-slate-400" />
                            <span>Showing {{ paginatedArticles.length }} of {{ filteredArticles.length }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── ARTICLES GRID SECTION ── -->
            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                <!-- Loading State -->
                <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div v-for="i in 6" :key="i" class="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4 animate-pulse">
                        <div class="aspect-[16/9] bg-slate-200 rounded-2xl w-full"></div>
                        <div class="h-4 bg-slate-200 rounded w-1/3"></div>
                        <div class="h-6 bg-slate-200 rounded w-4/5"></div>
                        <div class="h-4 bg-slate-200 rounded w-full"></div>
                        <div class="flex items-center gap-3 pt-2">
                            <div class="w-8 h-8 rounded-full bg-slate-200"></div>
                            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>

                <!-- Articles Found Grid -->
                <div v-else-if="paginatedArticles.length > 0" class="space-y-10">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        <article 
                            v-for="article in paginatedArticles" 
                            :key="article.slug"
                            class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                <!-- Image with 16:9 ratio -->
                                <NuxtLink :to="`/blog/${article.slug}`" class="block relative aspect-[16/9] overflow-hidden bg-slate-900">
                                    <img 
                                        :src="article.image || '/hero-berita.jpeg'" 
                                        :alt="article.title" 
                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                    <!-- Category Pill -->
                                    <div class="absolute top-3.5 left-3.5">
                                        <span class="bg-navy/90 backdrop-blur-xs text-primary text-[11px] sm:text-xs font-bold px-3 py-1 rounded-xl shadow-xs border border-white/10">
                                            {{ article.category }}
                                        </span>
                                    </div>
                                </NuxtLink>

                                <!-- Content Body -->
                                <div class="p-5 sm:p-6 space-y-3">
                                    <!-- Meta Row: Date & Reading Time -->
                                    <div class="flex items-center gap-3 text-xs sm:text-sm font-medium text-slate-500">
                                        <div class="flex items-center gap-1.5">
                                            <Icon icon="ph:calendar-blank" class="text-slate-400 text-sm" />
                                            <span>{{ formatDate(article.published_at || article.date) }}</span>
                                        </div>
                                        <span>•</span>
                                        <div class="flex items-center gap-1.5">
                                            <Icon icon="ph:clock" class="text-slate-400 text-sm" />
                                            <span>{{ article.read_time || 5 }} min read</span>
                                        </div>
                                    </div>

                                    <!-- Title -->
                                    <NuxtLink :to="`/blog/${article.slug}`" class="block">
                                        <h2 class="text-base sm:text-lg font-bold text-navy leading-snug line-clamp-2">
                                            {{ article.title }}
                                        </h2>
                                    </NuxtLink>

                                    <!-- Excerpt -->
                                    <p class="text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed font-normal">
                                        {{ article.excerpt }}
                                    </p>

                                    <!-- Tags list -->
                                    <div v-if="article.tags && article.tags.length > 0" class="flex flex-wrap gap-1.5 pt-1">
                                        <span 
                                            v-for="tag in article.tags.slice(0, 3)" 
                                            :key="tag"
                                            class="text-[11px] sm:text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md"
                                        >
                                            #{{ tag }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Author Card Footer -->
                            <div class="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-slate-100 flex items-center justify-between">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <img 
                                        :src="article.author_avatar || '/profile-author.png'" 
                                        :alt="article.author_name || 'Archeris Team'" 
                                        class="w-8 h-8 rounded-full border border-slate-200 bg-slate-50 p-0.5 object-cover shrink-0" 
                                    />
                                    <div class="min-w-0">
                                        <div class="text-xs sm:text-sm font-bold text-navy truncate">
                                            {{ article.author_name || 'Archeris Editorial' }}
                                        </div>
                                        <div class="text-[11px] sm:text-xs text-slate-400 truncate">
                                            {{ article.author_role || 'Archery Coach' }}
                                        </div>
                                    </div>
                                </div>

                                <NuxtLink 
                                    :to="`/blog/${article.slug}`"
                                    class="text-navy text-xs sm:text-sm font-bold flex items-center gap-1 transition-colors shrink-0 ml-2"
                                >
                                    <span>Read</span>
                                    <Icon icon="ph:arrow-right-bold" class="text-xs sm:text-sm group-hover:translate-x-0.5 transition-transform" />
                                </NuxtLink>
                            </div>
                        </article>
                    </div>

                    <!-- ── PAGINATION CONTROLS ── -->
                    <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-6">
                        <button 
                            @click="goToPage(currentPage - 1)" 
                            :disabled="currentPage === 1"
                            class="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all"
                            aria-label="Previous Page"
                        >
                            <Icon icon="ph:caret-left-bold" class="text-sm" />
                        </button>

                        <div class="flex items-center gap-1.5">
                            <button 
                                v-for="page in totalPages" 
                                :key="page"
                                @click="goToPage(page)"
                                :class="[
                                    'w-9 h-9 rounded-xl text-xs sm:text-sm font-bold transition-all',
                                    currentPage === page 
                                        ? 'bg-navy text-primary shadow-xs font-black' 
                                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                                ]"
                            >
                                {{ page }}
                            </button>
                        </div>

                        <button 
                            @click="goToPage(currentPage + 1)" 
                            :disabled="currentPage === totalPages"
                            class="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-white hover:border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-all"
                            aria-label="Next Page"
                        >
                            <Icon icon="ph:caret-right-bold" class="text-sm" />
                        </button>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="bg-white rounded-3xl border border-slate-200/80 p-10 sm:p-14 text-center max-w-xl mx-auto space-y-4">
                    <div class="w-16 h-16 rounded-2xl bg-amber-50 text-primary border border-amber-200/80 flex items-center justify-center mx-auto">
                        <Icon icon="ph:target-bold" class="text-3xl" />
                    </div>
                    <div class="space-y-1">
                        <h3 class="text-lg sm:text-xl font-black text-navy font-display">No articles found in this category</h3>
                        <p class="text-slate-500 text-xs sm:text-sm font-normal">
                            We haven't published articles in this category yet. Explore our other scoring guides and platform updates!
                        </p>
                    </div>
                    <div class="pt-2">
                        <NuxtLink 
                            to="/blog"
                            class="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white hover:bg-navy-light text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
                        >
                            <Icon icon="ph:arrow-left-bold" class="text-xs sm:text-sm" />
                            <span>Browse All Blog Articles</span>
                        </NuxtLink>
                    </div>
                </div>
            </main>

            <!-- ── NEWSLETTER SUBSCRIPTION SECTION ── -->
            <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
                <div class="relative rounded-3xl overflow-hidden bg-navy text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
                    <div class="absolute inset-0 bg-radial from-primary/10 via-transparent to-transparent pointer-events-none"></div>
                    
                    <div class="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-white/10 text-primary border border-white/15">
                            <Icon icon="ph:envelope-simple-open-bold" class="text-sm" />
                            <span>Archeris Scoring Newsletter</span>
                        </div>

                        <div class="space-y-2">
                            <h2 class="text-2xl sm:text-3xl md:text-4xl font-black font-display tracking-tight text-white">
                                Stay Updated on Archery Insights
                            </h2>
                            <p class="text-slate-300 text-xs sm:text-sm leading-relaxed">
                                Join archers, coaches, and organizers receiving practical archery guides and tournament updates.
                            </p>
                        </div>

                        <form @submit.prevent="handleSubscribe" class="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                            <div class="relative w-full">
                                <Icon icon="ph:envelope-simple" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                                <input 
                                    v-model="subscriberEmail"
                                    type="email" 
                                    placeholder="Enter your email address..." 
                                    required
                                    class="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white/15 transition-all"
                                />
                            </div>
                            <button 
                                type="submit"
                                :disabled="subscribing"
                                class="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-navy font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-md shadow-primary/20 shrink-0 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                <Icon v-if="subscribing" icon="ph:spinner" class="animate-spin text-sm" />
                                <span>{{ subscribing ? 'Subscribing...' : 'Subscribe' }}</span>
                            </button>
                        </form>

                        <p v-if="subscribeMessage" :class="subscribeSuccess ? 'text-emerald-400' : 'text-rose-400'" class="text-xs sm:text-sm font-semibold">
                            {{ subscribeMessage }}
                        </p>
                    </div>
                </div>
            </section>
        </div>

        <LayoutAppFooter />
    </div>
</template>

<script setup>
import { articles as mockArticles } from '~/data/articles'
import { CATEGORY_DEFINITIONS, getCategoryInfo, categoryToSlug } from '~/utils/blogCategory'

definePageMeta({
    layout: 'blank'
})

const route = useRoute()
const { get, post } = useApi()
const toast = useToast()

const currentCategoryParam = computed(() => {
    return route.params.category ? String(route.params.category).toLowerCase().trim() : ''
})

const categoryInfo = computed(() => {
    return getCategoryInfo(currentCategoryParam.value)
})

const allCategories = ref(CATEGORY_DEFINITIONS)
const articlesList = ref([])
const loading = ref(true)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Newsletter subscription state
const subscriberEmail = ref('')
const subscribing = ref(false)
const subscribeMessage = ref('')
const subscribeSuccess = ref(false)

const isCurrentCategory = (slug) => {
    if (!currentCategoryParam.value) return false
    if (categoryInfo.value?.slug === slug) return true
    return currentCategoryParam.value === slug
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently'
    try {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    } catch {
        return dateStr
    }
}

const articleImageMap = {
    'ultimate-guide-to-archery-scoring-rules-targets-scorecards': '/hero-berita.jpeg',
    'why-real-time-digital-archery-scoring-outperforms-paper-scorecards': '/hero-event.jpeg',
    'understanding-world-archery-elimination-brackets-and-shoot-off-scoring': '/hero-event-detail.jpeg',
    'how-modern-archery-clubs-streamline-practice-with-live-scoring': '/hero-club.jpeg',
    'recurve-vs-compound-archery-scoring-key-differences': '/hero-archer.jpeg'
}

function resolveArticleImage(image, slug) {
    if (slug && articleImageMap[slug]) {
        return articleImageMap[slug]
    }
    if (image && !image.includes('unsplash.com')) {
        return image
    }
    return '/hero-berita.jpeg'
}

// Fetch articles for this category
const fetchArticles = async () => {
    loading.value = true
    try {
        const catQuery = categoryInfo.value?.name || currentCategoryParam.value
        const res = await get(`/blog/articles?category=${encodeURIComponent(catQuery)}`)
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
            articlesList.value = res.data.map(a => ({
                ...a,
                image: resolveArticleImage(a.image || a.image_url, a.slug)
            }))
        } else {
            // Fallback to mock data filtered by category
            articlesList.value = mockArticles.filter(a => {
                const aSlug = categoryToSlug(a.category)
                return aSlug === categoryInfo.value?.slug || a.category.toLowerCase() === (categoryInfo.value?.name || '').toLowerCase()
            }).map(a => ({
                ...a,
                image: resolveArticleImage(a.image, a.slug)
            }))
        }
    } catch (e) {
        console.warn('Could not fetch category articles from API, using fallback data:', e)
        articlesList.value = mockArticles.filter(a => {
            const aSlug = categoryToSlug(a.category)
            return aSlug === categoryInfo.value?.slug || a.category.toLowerCase() === (categoryInfo.value?.name || '').toLowerCase()
        }).map(a => ({
            ...a,
            image: resolveArticleImage(a.image, a.slug)
        }))
    } finally {
        loading.value = false
    }
}

// Filtered and Paginated computed lists
const filteredArticles = computed(() => {
    return articlesList.value || []
})

const totalPages = computed(() => {
    return Math.ceil(filteredArticles.value.length / itemsPerPage.value) || 1
})

const paginatedArticles = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredArticles.value.slice(start, start + itemsPerPage.value)
})

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 350, behavior: 'smooth' })
    }
}

// Handle newsletter subscription
const handleSubscribe = async () => {
    if (!subscriberEmail.value || !subscriberEmail.value.includes('@')) {
        toast.error('Please provide a valid email address')
        return
    }

    subscribing.value = true
    subscribeMessage.value = ''
    try {
        const res = await post('/blog/subscribe', {
            email: subscriberEmail.value.trim()
        })
        subscribeSuccess.value = true
        subscribeMessage.value = res?.message || 'Thank you for subscribing to Archeris Blog updates!'
        toast.success(subscribeMessage.value)
        subscriberEmail.value = ''
    } catch (err) {
        subscribeSuccess.value = false
        subscribeMessage.value = err?.data?.error || err?.message || 'Subscription failed. Please try again later.'
        toast.error(subscribeMessage.value)
    } finally {
        subscribing.value = false
    }
}

onMounted(() => {
    fetchArticles()
})

// Watch for category route change
watch(() => route.params.category, () => {
    currentPage.value = 1
    fetchArticles()
})

// SEO & Structured Data (JSON-LD)
const pageTitle = computed(() => {
    const catName = categoryInfo.value?.name || 'Archery'
    return `${catName} Articles | Archeris Blog`
})

const pageDescription = computed(() => {
    return categoryInfo.value?.description || 'Read simple archery guides, equipment advice, scoring rules, and tournament tips.'
})

const canonicalUrl = computed(() => {
    return `https://archeryhub.id/blog/category/${categoryInfo.value?.slug || currentCategoryParam.value}`
})

useHead({
    title: pageTitle.value,
    meta: [
        { name: 'description', content: pageDescription.value },
        { property: 'og:title', content: pageTitle.value },
        { property: 'og:description', content: pageDescription.value },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: canonicalUrl.value },
        { property: 'og:image', content: 'https://archeryhub.id/hero-berita.jpeg' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: pageTitle.value },
        { name: 'twitter:description', content: pageDescription.value },
    ],
    link: [
        { rel: 'canonical', href: canonicalUrl.value }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                'name': pageTitle.value,
                'description': pageDescription.value,
                'url': canonicalUrl.value,
                'mainEntity': {
                    '@type': 'ItemList',
                    'itemListElement': filteredArticles.value.map((article, index) => ({
                        '@type': 'ListItem',
                        'position': index + 1,
                        'url': `https://archeryhub.id/blog/${article.slug}`,
                        'name': article.title
                    }))
                }
            }))
        }
    ]
})

const categoryBreadcrumbSchema = computed(() => ({
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
    },
    {
      '@type': 'ListItem',
      'position': 3,
      'name': categoryName.value || 'Category',
      'item': `https://archeris.net/blog/category/${categorySlug.value}`
    }
  ]
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(categoryBreadcrumbSchema.value))
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
