<template>
    <div class="min-h-screen bg-gray-50 dark:bg-slate-950 docs-page transition-colors duration-200">
        <!-- Breadcrumb bar (not sticky) -->
        <div class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex items-center gap-2 h-11 text-xs text-gray-500 dark:text-slate-400 overflow-x-auto no-scrollbar">
                    <NuxtLink to="/" class="hover:text-navy dark:hover:text-white transition-colors whitespace-nowrap">{{ $t('nav.home') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-gray-300 dark:text-slate-600 shrink-0" />
                    <NuxtLink to="/docs" class="hover:text-navy dark:hover:text-white transition-colors whitespace-nowrap">{{ $t('docs.all_docs') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-gray-300 dark:text-slate-600 shrink-0" />
                    <span class="text-navy dark:text-slate-200 font-semibold whitespace-nowrap truncate">{{ currentDoc?.title }}</span>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 max-w-7xl pt-8 pb-20 flex flex-col lg:flex-row gap-0">
            <!-- Left Sidebar (Navigation) -->
            <aside
                class="flex flex-col w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-4 lg:scrollbar-styled self-start mb-8 lg:mb-0">
                <!-- Mobile Toggle Button -->
                <button @click="toggleMobileMenu"
                    class="lg:hidden flex items-center justify-between w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 mb-2 text-sm font-bold text-navy dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                    <span class="flex items-center gap-2">
                        <Icon icon="ph:list-dashes-bold" class="text-lg text-primary" />
                        {{ $t('docs.sidebar_title') }}
                    </span>
                    <Icon :icon="isMobileMenuOpen ? 'ph:caret-up-bold' : 'ph:caret-down-bold'"
                        class="text-gray-400 dark:text-slate-500 text-base" />
                </button>

                <!-- Sidebar content (collapsible on mobile, always visible on desktop) -->
                <div :class="isMobileMenuOpen ? 'block' : 'hidden lg:block'"
                    class="bg-gray-50 dark:bg-slate-900 lg:bg-transparent -mx-4 px-4 py-4 lg:p-0 lg:mx-0 border-y border-gray-100 dark:border-slate-800 lg:border-0 rounded-none lg:rounded-none">

                    <!-- Search filter in sidebar -->
                    <div class="relative mb-3">
                        <Icon icon="ph:magnifying-glass-bold" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 text-sm" />
                        <input v-model="sidebarSearch" type="text" placeholder="Filter articles..."
                            class="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-xs text-navy dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-primary dark:focus:border-primary transition-all shadow-2xs" />
                    </div>

                    <!-- If categories exist -->
                    <template v-if="hasCategories">
                        <div v-for="cat in sidebarVisibleCategories" :key="cat.id" class="mb-4">
                            <div class="flex items-center gap-2 px-2 py-1.5 mb-1">
                                <Icon :icon="cat.icon" class="text-sm text-gray-400 dark:text-slate-500" />
                                <span class="text-[10px] font-black tracking-widest text-gray-400 dark:text-slate-500">{{ cat.label }}</span>
                            </div>
                            <div class="space-y-0.5">
                                <NuxtLink v-for="doc in filteredSidebarDocs(cat.id)" :key="doc.slug"
                                    :to="`/docs/${doc.slug}`"
                                    class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all relative group"
                                    :class="currentSlug === doc.slug
                                        ? 'bg-primary/20 border border-primary/40 text-navy dark:text-primary font-black shadow-2xs'
                                        : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-navy dark:hover:text-slate-100 font-medium'">
                                    <div v-if="currentSlug === doc.slug"
                                        class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full">
                                    </div>
                                    <span class="leading-snug" :class="currentSlug !== doc.slug ? 'pl-2' : ''">{{ doc.title }}</span>
                                </NuxtLink>
                            </div>
                        </div>
                    </template>

                    <!-- Flat list (when uncategorized) -->
                    <template v-else>
                        <div class="flex items-center justify-between px-2 py-1.5 mb-2">
                            <span class="text-[10px] font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase">All Guides ({{ allFilteredSidebarDocs.length }})</span>
                        </div>
                        <div class="space-y-1">
                            <NuxtLink v-for="doc in allFilteredSidebarDocs" :key="doc.slug"
                                :to="`/docs/${doc.slug}`"
                                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm transition-all relative group"
                                :class="currentSlug === doc.slug
                                    ? 'bg-primary/20 border border-primary/40 text-navy dark:text-primary font-black shadow-2xs'
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/80 hover:text-navy dark:hover:text-slate-100 font-medium border border-transparent hover:border-gray-100 dark:hover:border-slate-800'">
                                <div v-if="currentSlug === doc.slug"
                                    class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full">
                                </div>
                                <Icon :icon="doc.icon || 'ph:file-text-bold'" class="text-sm shrink-0" :class="currentSlug === doc.slug ? 'text-navy dark:text-primary' : 'text-gray-400 dark:text-slate-500'" />
                                <span class="leading-snug truncate" :class="currentSlug !== doc.slug ? 'pl-0.5' : ''">{{ doc.title }}</span>
                            </NuxtLink>
                        </div>
                    </template>
                </div>
            </aside>

            <!-- Main content -->
            <main class="flex-1 min-w-0 w-full lg:pl-8 lg:pr-6">
                <div v-if="currentDoc" class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-200">
                    <!-- Doc header -->
                    <div class="relative bg-gradient-to-br from-navy via-slate-900 to-navy dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white px-6 sm:px-10 pt-10 pb-10 overflow-hidden border-b border-white/10">
                        <!-- Decorative background glow and archery ring watermark -->
                        <div class="absolute -top-24 -right-24 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none"></div>
                        <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>
                        <div class="absolute right-6 bottom-0 translate-y-1/4 opacity-5 pointer-events-none select-none">
                            <Icon icon="ph:crosshair-bold" class="text-[240px] text-white" />
                        </div>

                        <div class="relative z-10">
                            <!-- Document Title -->
                            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight font-display leading-tight">
                                {{ currentDoc.title }}
                            </h1>

                            <!-- Excerpt/Description -->
                            <p class="text-slate-300 text-sm sm:text-base font-normal leading-relaxed max-w-3xl">
                                {{ currentDoc.excerpt }}
                            </p>

                            <!-- Meta info row -->
                            <div class="flex items-center gap-4 mt-6 pt-5 border-t border-white/10 text-slate-400 text-xs font-medium flex-wrap">
                                <div class="flex items-center gap-1.5 text-slate-300">
                                    <Icon icon="ph:shield-check-bold" class="text-primary text-sm" />
                                    <span>{{ locale === 'id' ? 'Dokumentasi Resmi' : 'Official Documentation' }}</span>
                                </div>
                                <span class="text-white/20">•</span>
                                <div class="flex items-center gap-1.5">
                                    <Icon icon="ph:translate-bold" class="text-xs text-slate-400" />
                                    <span>{{ locale === 'id' ? 'Bahasa Indonesia' : 'English' }}</span>
                                </div>
                                <span class="text-white/20">•</span>
                                <div class="flex items-center gap-1.5">
                                    <Icon icon="ph:check-circle-bold" class="text-emerald-400 text-xs" />
                                    <span>{{ locale === 'id' ? 'Panduan Terverifikasi' : 'Verified Guide' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Doc body -->
                    <div class="px-6 md:px-10 py-8 doc-content" v-html="currentDoc.content"></div>

                    <!-- Share Social Media -->
                    <div class="px-6 md:px-10 pb-8 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <h4 class="text-[10px] font-black tracking-widest text-gray-400 dark:text-slate-500 mb-3">{{ $t('docs.share_title') || 'Share this article' }}</h4>
                        <div class="flex flex-wrap gap-2">
                            <button @click="shareTo('twitter')" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/20 text-navy dark:text-slate-200 text-xs font-bold transition-all border border-gray-100 dark:border-slate-700 hover:border-primary/30">
                                <Icon icon="simple-icons:x" class="text-sm" />
                                X
                            </button>
                            <button @click="shareTo('facebook')" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/20 text-navy dark:text-slate-200 text-xs font-bold transition-all border border-gray-100 dark:border-slate-700 hover:border-primary/30">
                                <Icon icon="logos:facebook" class="text-sm" />
                                Facebook
                            </button>
                            <button @click="shareTo('whatsapp')" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/20 text-navy dark:text-slate-200 text-xs font-bold transition-all border border-gray-100 dark:border-slate-700 hover:border-primary/30">
                                <Icon icon="logos:whatsapp-icon" class="text-sm" />
                                WhatsApp
                            </button>
                            <button @click="copyLink" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-primary/10 dark:hover:bg-primary/20 text-navy dark:text-slate-200 text-xs font-bold transition-all border border-gray-100 dark:border-slate-700 hover:border-primary/30">
                                <Icon icon="ph:link-bold" class="text-sm" />
                                {{ linkCopied ? ($t('docs.copied') || 'Copied!') : ($t('docs.copy_link') || 'Copy Link') }}
                            </button>
                        </div>
                    </div>

                    <!-- Navigation buttons -->
                    <div
                        class="px-6 md:px-10 py-6 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <NuxtLink v-if="prevDoc" :to="`/docs/${prevDoc.slug}`"
                            class="flex items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-all w-full sm:max-w-xs justify-start">
                            <Icon icon="ph:arrow-left-bold"
                                class="text-gray-400 dark:text-slate-500 group-hover:text-primary transition-colors shrink-0" />
                            <div class="text-left min-w-0">
                                <div class="text-xs text-gray-400 dark:text-slate-500 mb-0.5">{{ $t('docs.previous') }}</div>
                                <div
                                    class="text-sm font-bold text-navy dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                    {{ prevDoc.title }}</div>
                            </div>
                        </NuxtLink>
                        <div v-else class="hidden sm:block"></div>
                        <NuxtLink v-if="nextDoc" :to="`/docs/${nextDoc.slug}`"
                            class="flex items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-100 dark:border-slate-800 transition-all w-full sm:max-w-xs justify-end text-right sm:ml-auto">
                            <div class="min-w-0">
                                <div class="text-xs text-gray-400 dark:text-slate-500 mb-0.5">{{ $t('docs.next') }}</div>
                                <div
                                    class="text-sm font-bold text-navy dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                    {{ nextDoc.title }}</div>
                            </div>
                            <Icon icon="ph:arrow-right-bold"
                                class="text-gray-400 dark:text-slate-500 group-hover:text-primary transition-colors shrink-0" />
                        </NuxtLink>
                    </div>
                </div>

                <div v-else class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-16 text-center">
                    <Icon icon="ph:file-x-bold" class="text-5xl text-gray-300 dark:text-slate-600 mb-4" />
                    <h2 class="text-xl font-black text-navy dark:text-slate-100 mb-2">{{ $t('docs.not_found_title') }}</h2>
                    <p class="text-gray-500 dark:text-slate-400 mb-6 text-sm">{{ $t('docs.not_found_desc') }}</p>
                    <NuxtLink to="/docs"
                        class="inline-flex items-center gap-2 bg-navy dark:bg-primary text-primary dark:text-navy font-bold px-6 py-2.5 rounded-xl hover:bg-navy/90 dark:hover:bg-primary/90 transition-all text-sm">
                        <Icon icon="ph:arrow-left-bold" />
                        {{ $t('docs.back_to_docs') }}
                    </NuxtLink>
                </div>
            </main>

            <!-- Right sidebar: Table of contents -->
            <aside class="hidden lg:block w-56 shrink-0 pl-4 self-start sticky top-24">
                <div class="max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-styled flex flex-col">
                    <div class="text-xs font-black text-gray-400 dark:text-slate-500 tracking-widest mb-3">{{ $t('docs.on_this_page') }}</div>
                    <nav class="space-y-1">
                        <a v-for="heading in currentDoc?.toc || []" :key="heading.id" :href="`#${heading.id}`"
                            class="block text-sm py-1.5 transition-colors leading-snug" :class="[
                                heading.level === 2 ? 'text-gray-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium pl-0' : 'text-gray-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary pl-3 text-xs'
                            ]">
                            {{ translateHeadingText(heading.text) }}
                        </a>
                    </nav>

                    <!-- Divider -->
                    <div class="mt-6 pt-6 border-t border-gray-100 dark:border-slate-800">
                        <NuxtLink to="/docs"
                            class="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 hover:text-navy dark:hover:text-slate-200 transition-colors font-medium mb-3">
                            <Icon icon="ph:arrow-left-bold" class="text-xs" /> {{ $t('docs.all_docs') || 'All Guides' }}
                        </NuxtLink>
                        <NuxtLink to="/contact"
                            class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors font-medium mb-2.5 group">
                            <Icon icon="ph:paper-plane-tilt-bold" class="text-sm text-primary group-hover:scale-110 transition-transform" />
                            <span>Contact Form</span>
                        </NuxtLink>
                        <a href="mailto:contact@archeris.net"
                            class="flex items-center gap-2 text-xs text-gray-500 dark:text-slate-400 hover:text-navy dark:hover:text-white transition-colors font-medium group">
                            <Icon icon="ph:envelope-simple-bold" class="text-sm text-primary group-hover:scale-110 transition-transform" />
                            <span>contact@archeris.net</span>
                        </a>
                    </div>
                </div>
            </aside>
        </div>

    </div>
</template>

<script setup>
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
const toast = useToast()

const route = useRoute()
const router = useRouter()
const currentSlug = computed(() => {
    const raw = route.params.slug
    if (Array.isArray(raw)) return raw.join('/')
    return raw ? String(raw) : ''
})

const sidebarSearch = ref('')
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

watch(currentSlug, () => {
    isMobileMenuOpen.value = false // Auto close on navigation in mobile
})

const categories = computed(() => [
    { id: 'accounts', label: locale.value === 'id' ? 'Tipe Akun' : 'User Accounts', icon: 'ph:users-three-bold' },
    { id: 'tournaments', label: locale.value === 'id' ? 'Turnamen' : 'Tournament Setup', icon: 'ph:trophy-bold' },
    { id: 'scorekeeper', label: locale.value === 'id' ? 'Petugas Skor' : 'Scorekeeper Operations', icon: 'ph:device-mobile-bold' },
    { id: 'qualification', label: locale.value === 'id' ? 'Babak Kualifikasi' : 'Qualification Rounds', icon: 'ph:chart-line-up-bold' },
    { id: 'elimination', label: locale.value === 'id' ? 'Bagan Eliminasi' : 'Elimination Brackets', icon: 'ph:tree-structure-bold' },
    { id: 'finance', label: locale.value === 'id' ? 'Keuangan & Bayar' : 'Finance & Payments', icon: 'ph:coins-bold' },
    { id: 'subscriptions', label: locale.value === 'id' ? 'Langganan' : 'Subscriptions', icon: 'ph:credit-card-bold' }
])

const sidebarCategories = categories

const getCategoryLabel = (id) => {
    const cat = categories.value.find(c => c.id === id)
    return cat ? cat.label : (id ? id.charAt(0).toUpperCase() + id.slice(1) : '')
}

// Fetch all docs list for sidebar navigation & prev/next calculations
const { data: docsList } = await useAsyncData(
    () => `docs-api-sidebar-${locale.value}`,
    () => $fetch(`${apiBaseUrl}/docs?lang=${locale.value}`),
    {
        watch: [locale]
    }
)

const docs = computed(() => docsList.value || [])

const hasCategories = computed(() => {
    return docs.value.some(d => d.category && d.category.trim() !== '')
})

const allFilteredSidebarDocs = computed(() => {
    return docs.value.filter(d => {
        if (!sidebarSearch.value) return true
        const q = sidebarSearch.value.toLowerCase()
        return (d.title && d.title.toLowerCase().includes(q)) ||
               (d.excerpt && d.excerpt.toLowerCase().includes(q)) ||
               (d.slug && d.slug.toLowerCase().includes(q))
    })
})

// Canonicalize legacy non-nested URLs or category-prefixed URLs
watch([docs, currentSlug], () => {
    const slug = currentSlug.value
    if (!slug) return

    if (slug.includes('/')) {
        const base = slug.split('/').pop()
        const match = docs.value.find(d => d.slug === base || d.slug === slug)
        if (match?.slug && match.slug !== slug) {
            router.replace(`/docs/${match.slug}`)
        }
    }
}, { immediate: true })

// Fetch details for the current doc slug
const { data: currentDocData } = await useAsyncData(
    () => `docs-api-detail-${currentSlug.value}-${locale.value}`,
    () => $fetch(`${apiBaseUrl}/docs/${currentSlug.value}?lang=${locale.value}`).catch(() => null),
    {
        watch: [currentSlug, locale]
    }
)

const currentDoc = computed(() => currentDocData.value)

if (!currentDoc.value) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Documentation Article Not Found',
        message: `The documentation guide "${currentSlug.value}" does not exist or has been removed.`,
        fatal: true
    })
}

// Calculate prev/next
const currentIndex = computed(() => docs.value.findIndex(d => d.slug === currentSlug.value))
const prevDoc = computed(() => currentIndex.value > 0 ? docs.value[currentIndex.value - 1] : null)
const nextDoc = computed(() => currentIndex.value >= 0 && currentIndex.value < docs.value.length - 1 ? docs.value[currentIndex.value + 1] : null)

const filteredSidebarDocs = (categoryId) => {
    return docs.value.filter(d => {
        const matchCat = d.category === categoryId
        const matchSearch = sidebarSearch.value === '' ||
            d.title.toLowerCase().includes(sidebarSearch.value.toLowerCase())
        return matchCat && matchSearch
    })
}

const sidebarVisibleCategories = computed(() => {
    return sidebarCategories.value.filter(cat => filteredSidebarDocs(cat.id).length > 0)
})

// translateHeadingText fallback no longer needed, we render text directly
const translateHeadingText = (text) => {
    return text
}

// Social Sharing
const linkCopied = ref(false)
const shareTo = (platform) => {
    if (!import.meta.client) return
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent(currentDoc.value?.title || 'Archeris.net Documentation')
    
    let shareUrl = ''
    if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    } else if (platform === 'whatsapp') {
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank')
    }
}

const copyLink = () => {
    if (!import.meta.client) return
    navigator.clipboard.writeText(window.location.href).then(() => {
        linkCopied.value = true
        setTimeout(() => {
            linkCopied.value = false
        }, 2000)
    })
}

const structuredData = computed(() => {
    if (!currentDoc.value?.title) return null
    const canonicalDocUrl = `https://archeris.net/docs/${currentSlug.value}`
    return [
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
                },
                {
                    '@type': 'ListItem',
                    'position': 3,
                    'name': currentDoc.value.title,
                    'item': canonicalDocUrl
                }
            ]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': currentDoc.value.title,
            'description': currentDoc.value.excerpt || 'Archeris official documentation.',
            'url': canonicalDocUrl,
            'inLanguage': 'en',
            'datePublished': currentDoc.value?.created_at || '2024-01-15T00:00:00+00:00',
            'dateModified': currentDoc.value?.updated_at || new Date().toISOString(),
            'author': {
                '@type': 'Organization',
                'name': 'Archeris Technical Team',
                'url': 'https://archeris.net'
            },
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': canonicalDocUrl
            },
            'publisher': {
                '@type': 'Organization',
                'name': 'Archeris',
                'url': 'https://archeris.net',
                'logo': 'https://archeris.net/logo.png'
            }
        }
    ]
})

useHead(() => {
    const canonicalDocUrl = `https://archeris.net/docs/${currentSlug.value}`
    return {
        title: currentDoc.value ? `${currentDoc.value.title} - Archeris Docs` : 'Documentation - Archeris',
        link: [
            { rel: 'canonical', href: canonicalDocUrl },
            { rel: 'alternate', hreflang: 'en', href: canonicalDocUrl },
            { rel: 'alternate', hreflang: 'x-default', href: canonicalDocUrl }
        ],
        script: [
            {
                type: 'application/ld+json',
                children: structuredData.value ? JSON.stringify(structuredData.value) : ''
            }
        ]
    }
})

useSeoMeta({
    title: () => currentDoc.value ? `${currentDoc.value.title} - Archeris Docs` : 'Documentation - Archeris',
    description: () => currentDoc.value?.excerpt || 'Archeris official documentation and archery scoring guides.',
    ogTitle: () => currentDoc.value ? `${currentDoc.value.title} - Archeris Docs` : 'Documentation - Archeris',
    ogDescription: () => currentDoc.value?.excerpt || 'Archeris official documentation and archery scoring guides.',
    ogType: 'article',
    ogUrl: () => `https://archeris.net/docs/${currentSlug.value}`,
    twitterCard: 'summary_large_image',
    twitterTitle: () => currentDoc.value ? `${currentDoc.value.title} - Archeris Docs` : 'Documentation - Archeris',
    twitterDescription: () => currentDoc.value?.excerpt || 'Archeris official documentation and archery scoring guides.'
})
</script>

<style>
.doc-content h2 {
    font-size: 1.35rem;
    font-weight: 900;
    color: #0f172a;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f1f5f9;
    scroll-margin-top: 7rem;
}

.doc-content h3 {
    font-size: 1.15rem;
    font-weight: 800;
    color: #0f172a;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    scroll-margin-top: 7rem;
}

.doc-content h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #0f172a;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
}

.doc-content p {
    color: #4b5563;
    line-height: 1.8;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.doc-content ul,
.doc-content ol {
    margin: 0.75rem 0 1.25rem 1.25rem;
    color: #4b5563;
    font-size: 0.95rem;
    line-height: 1.8;
}

.doc-content ul {
    list-style-type: disc;
    padding-left: 1rem;
}

.doc-content ol {
    list-style-type: decimal;
    padding-left: 1rem;
}

.doc-content li {
    margin-bottom: 0.4rem;
}

.doc-content strong {
    color: #0f172a;
    font-weight: 700;
}

.doc-content a {
    color: #0284c7;
    font-weight: 600;
    text-decoration: underline;
}

.doc-content a:hover {
    opacity: 0.8;
}

.doc-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    border-radius: 0.75rem;
    overflow: hidden;
}

.doc-content th,
.doc-content td {
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
}

.doc-content img {
    border-radius: 1rem;
    margin: 1.5rem 0;
    border: 1px solid #e2e8f0;
    max-width: 100%;
    height: auto;
}

.doc-content code {
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 0.15rem 0.4rem;
    border-radius: 0.375rem;
    font-size: 0.85em;
    font-family: monospace;
}

.doc-content pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 1rem;
    border-radius: 0.75rem;
    overflow-x: auto;
    margin: 1rem 0;
}

.doc-content pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
}

/* ================= DARK THEME STYLES FOR DOC CONTENT ================= */
.dark .doc-content h2 {
    color: #f8fafc;
    border-bottom: 2px solid #1e293b;
}

.dark .doc-content h3,
.dark .doc-content h4 {
    color: #f1f5f9;
}

.dark .doc-content p {
    color: #cbd5e1;
}

.dark .doc-content ul,
.dark .doc-content ol {
    color: #cbd5e1;
}

.dark .doc-content strong {
    color: #f8fafc;
}

.dark .doc-content a {
    color: #38bdf8;
}

.dark .doc-content table {
    border-color: #334155;
}

.dark .doc-content th {
    background-color: #1e293b;
    color: #f8fafc;
    border-color: #334155;
}

.dark .doc-content td {
    border-color: #334155;
    color: #cbd5e1;
    background-color: #0f172a;
}

.dark .doc-content tr:nth-child(even) td {
    background-color: #1e293b/40;
}

.dark .doc-content img {
    border-color: #334155;
}

.dark .doc-content code {
    background-color: #1e293b;
    color: #f1f5f9;
    border: 1px solid #334155;
}

/* Dark mode overrides for custom HTML callout boxes in doc articles */
.dark .doc-content .not-prose {
    border-color: #334155 !important;
}

.dark .doc-content .not-prose.bg-primary\/10,
.dark .doc-content .not-prose.bg-primary\/20 {
    background-color: rgba(217, 255, 0, 0.08) !important;
    border-color: rgba(217, 255, 0, 0.25) !important;
}

.dark .doc-content .not-prose.bg-yellow-50,
.dark .doc-content .not-prose.bg-amber-50 {
    background-color: rgba(245, 158, 11, 0.12) !important;
    border-color: rgba(245, 158, 11, 0.3) !important;
}

.dark .doc-content .not-prose.bg-red-50 {
    background-color: rgba(239, 68, 68, 0.12) !important;
    border-color: rgba(239, 68, 68, 0.3) !important;
}

.dark .doc-content .not-prose.bg-gray-50 {
    background-color: #1e293b !important;
    border-color: #334155 !important;
}

.dark .doc-content .not-prose .text-navy {
    color: #f8fafc !important;
}

.dark .doc-content .not-prose .text-gray-600,
.dark .doc-content .not-prose .text-gray-700,
.dark .doc-content .not-prose .text-gray-500 {
    color: #cbd5e1 !important;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-styled::-webkit-scrollbar {
    width: 4px;
}

.scrollbar-styled::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-styled::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.dark .scrollbar-styled::-webkit-scrollbar-thumb {
    background: #334155;
}
</style>
