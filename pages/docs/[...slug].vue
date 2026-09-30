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

        <div class="container mx-auto px-0 sm:px-4 max-w-7xl pt-4 sm:pt-8 pb-16 sm:pb-20 flex flex-col lg:flex-row gap-0">
            <!-- Left Sidebar (Navigation) -->
            <aside
                class="flex flex-col w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-4 lg:scrollbar-styled self-start mb-6 lg:mb-0 px-4 sm:px-0">
                <!-- Mobile Toggle Button -->
                <button @click="toggleMobileMenu"
                    class="lg:hidden flex items-center justify-between w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3 mb-2 text-sm font-bold text-navy dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-2xs">
                    <span class="flex items-center gap-2">
                        <Icon icon="ph:list-dashes-bold" class="text-lg text-primary" />
                        {{ $t('docs.sidebar_title') }}
                    </span>
                    <Icon :icon="isMobileMenuOpen ? 'ph:caret-up-bold' : 'ph:caret-down-bold'"
                        class="text-gray-400 dark:text-slate-500 text-base" />
                </button>

                <!-- Sidebar content (collapsible on mobile, always visible on desktop) -->
                <div :class="isMobileMenuOpen ? 'block' : 'hidden lg:block'"
                    class="bg-white dark:bg-slate-900 lg:bg-transparent p-4 lg:p-0 border border-gray-100 dark:border-slate-800 lg:border-0 rounded-2xl lg:rounded-none shadow-sm lg:shadow-none mb-4 lg:mb-0">

                    <!-- If categories exist -->
                    <template v-if="hasCategories">
                        <div v-for="cat in sidebarVisibleCategories" :key="cat.id" class="mb-4">
                            <div class="flex items-center gap-2 px-2 py-1.5 mb-1">
                                <Icon :icon="cat.icon" class="text-sm text-gray-400 dark:text-slate-500" />
                                <span class="text-[10px] font-black tracking-widest text-gray-400 dark:text-slate-500">{{ cat.label }}</span>
                            </div>
                            <div class="space-y-0.5">
                                <NuxtLink v-for="doc in filteredSidebarDocs(cat.id)" :key="doc.slug"
                                    :to="docPath(doc.slug)"
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
                            <span class="text-[10px] font-black tracking-widest text-gray-400 dark:text-slate-500 uppercase">All Guides ({{ docs.length }})</span>
                        </div>
                        <div class="space-y-1">
                            <NuxtLink v-for="doc in docs" :key="doc.slug"
                                :to="docPath(doc.slug)"
                                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm transition-all relative group"
                                :class="currentSlug === doc.slug
                                    ? 'bg-primary/20 border border-primary/40 text-navy dark:text-primary font-black shadow-2xs'
                                    : 'text-gray-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/80 hover:text-navy dark:hover:text-slate-100 font-medium border border-transparent hover:border-gray-100 dark:border-slate-800'">
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
            <main class="flex-1 min-w-0 w-full px-0 lg:pl-8 lg:pr-6">
                <div v-if="currentDoc" class="bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl border-y sm:border border-gray-100 dark:border-slate-800 shadow-none sm:shadow-sm overflow-hidden transition-colors duration-200">
                    <!-- Doc header -->
                    <div class="relative bg-gradient-to-br from-navy via-slate-900 to-navy dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-white px-4 sm:px-10 pt-8 sm:pt-10 pb-8 sm:pb-10 overflow-hidden border-b border-white/10">
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

                            <!-- Meta info row & Language Switcher -->
                            <div class="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-white/10 text-slate-400 text-xs font-medium">
                                <div class="flex items-center gap-4 flex-wrap">
                                    <div class="flex items-center gap-1.5 text-slate-300">
                                        <Icon icon="ph:shield-check-bold" class="text-emerald-400 text-sm" />
                                        <span>{{ isIdRoute ? 'Dokumentasi Resmi' : 'Official Documentation' }}</span>
                                    </div>
                                    <span class="text-white/20">•</span>
                                    <div class="flex items-center gap-1.5">
                                        <Icon icon="ph:check-circle-bold" class="text-emerald-400 text-xs" />
                                        <span>{{ isIdRoute ? 'Panduan Terverifikasi' : 'Verified Guide' }}</span>
                                    </div>
                                </div>

                                <!-- Language Switcher Pill -->
                                <div class="flex items-center bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-full p-1 border border-white/15">
                                    <NuxtLink :to="`/docs/${currentSlug}`"
                                        class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all"
                                        :class="!isIdRoute ? 'bg-primary text-navy shadow-sm' : 'text-slate-300 hover:text-white'">
                                        <span class="text-[11px]">🇬🇧</span>
                                        <span>English</span>
                                    </NuxtLink>
                                    <NuxtLink :to="`/docs/${currentSlug}/id`"
                                        class="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all"
                                        :class="isIdRoute ? 'bg-primary text-navy shadow-sm' : 'text-slate-300 hover:text-white'">
                                        <span class="text-[11px]">🇮🇩</span>
                                        <span>Indonesia</span>
                                    </NuxtLink>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Doc body -->
                    <div class="px-4 sm:px-6 md:px-10 py-6 sm:py-8 doc-content" v-html="formattedDocContent"></div>

                    <!-- Last Updated Info -->
                    <div class="px-4 sm:px-6 md:px-10 pb-6 text-xs text-gray-400 dark:text-slate-500 font-medium flex items-center gap-1.5">
                        <Icon icon="ph:clock-clockwise-bold" class="text-xs" />
                        <span>{{ lastUpdatedText }}</span>
                    </div>

                    <!-- Share Social Media -->
                    <div class="px-4 sm:px-6 md:px-10 pb-8 pt-4 border-t border-gray-100 dark:border-slate-800">
                        <h4 class="text-[10px] font-black tracking-widest text-gray-400 dark:text-slate-500 mb-3">{{ isIdRoute ? 'Bagikan dokumen ini' : ($t('docs.share_title') || 'Share this document') }}</h4>
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
                                {{ linkCopied ? (isIdRoute ? 'Tautan Disalin!' : 'Copied!') : (isIdRoute ? 'Salin Tautan' : 'Copy Link') }}
                            </button>
                        </div>
                    </div>

                    <!-- Navigation buttons -->
                    <div
                        class="px-4 sm:px-6 md:px-10 pt-6 pb-8 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <NuxtLink v-if="prevDoc" :to="docPath(prevDoc.slug)"
                            class="flex items-center gap-3.5 group p-4 sm:px-5 sm:py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200/80 dark:border-slate-700/80 hover:border-primary/40 transition-all w-full sm:max-w-sm justify-start shadow-2xs">
                            <Icon icon="ph:arrow-left-bold"
                                class="text-gray-400 dark:text-slate-500 group-hover:text-primary transition-colors shrink-0 text-base" />
                            <div class="text-left min-w-0">
                                <div class="text-xs text-gray-400 dark:text-slate-500 font-medium mb-0.5">{{ isIdRoute ? 'Sebelumnya' : $t('docs.previous') }}</div>
                                <div
                                    class="text-sm font-bold text-navy dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                    {{ prevDoc.title }}</div>
                            </div>
                        </NuxtLink>
                        <div v-else class="hidden sm:block"></div>
                        <NuxtLink v-if="nextDoc" :to="docPath(nextDoc.slug)"
                            class="flex items-center gap-3.5 group p-4 sm:px-5 sm:py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800 border border-gray-200/80 dark:border-slate-700/80 hover:border-primary/40 transition-all w-full sm:max-w-sm justify-end text-right sm:ml-auto shadow-2xs">
                            <div class="min-w-0">
                                <div class="text-xs text-gray-400 dark:text-slate-500 font-medium mb-0.5">{{ isIdRoute ? 'Selanjutnya' : $t('docs.next') }}</div>
                                <div
                                    class="text-sm font-bold text-navy dark:text-slate-200 truncate group-hover:text-primary transition-colors">
                                    {{ nextDoc.title }}</div>
                            </div>
                            <Icon icon="ph:arrow-right-bold"
                                class="text-gray-400 dark:text-slate-500 group-hover:text-primary transition-colors shrink-0 text-base" />
                        </NuxtLink>
                    </div>
                </div>

                <div v-else class="bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl border-y sm:border border-gray-100 dark:border-slate-800 shadow-none sm:shadow-sm p-8 sm:p-16 text-center">
                    <Icon icon="ph:file-x-bold" class="text-5xl text-gray-300 dark:text-slate-600 mb-4" />
                    <h2 class="text-xl font-black text-navy dark:text-slate-100 mb-2">{{ $t('docs.not_found_title') }}</h2>
                    <p class="text-gray-500 dark:text-slate-400 mb-6 text-sm">{{ $t('docs.not_found_desc') }}</p>
                    <NuxtLink to="/docs"
                        class="inline-flex items-center gap-2 bg-navy hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm">
                        <Icon icon="ph:arrow-left-bold" />
                        {{ $t('docs.back_to_docs') }}
                    </NuxtLink>
                </div>
            </main>

            <!-- Right sidebar: Table of contents -->
            <aside class="hidden lg:block w-64 xl:w-72 shrink-0 pl-4 self-start sticky top-24">
                <div class="max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-styled flex flex-col pr-1">
                    <div class="flex items-center gap-2 px-2 py-1.5 mb-1">
                        <Icon icon="ph:list-bullets-bold" class="text-sm text-gray-400 dark:text-slate-500" />
                        <span class="text-[10px] font-black tracking-widest text-gray-400 dark:text-slate-500">{{ $t('docs.on_this_page') }}</span>
                    </div>

                    <nav class="space-y-0.5">
                        <a v-for="heading in currentDoc?.toc || []" :key="heading.id" :href="`#${heading.id}`"
                            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium leading-snug transition-all text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-navy dark:hover:text-slate-100" :class="[
                                heading.level > 2 ? 'pl-6 text-xs' : ''
                            ]">
                            <span>{{ translateHeadingText(heading.text) }}</span>
                        </a>
                    </nav>

                    <!-- Divider -->
                    <div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 space-y-0.5">
                        <NuxtLink to="/docs"
                            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-navy dark:hover:text-slate-100 group">
                            <Icon icon="ph:arrow-left-bold" class="text-sm shrink-0 text-gray-400 dark:text-slate-500 group-hover:text-navy transition-colors" />
                            <span>{{ $t('docs.all_docs') || 'Semua Dokumentasi' }}</span>
                        </NuxtLink>
                        <NuxtLink to="/contact"
                            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-navy dark:hover:text-slate-100 group">
                            <Icon icon="ph:paper-plane-tilt-bold" class="text-sm shrink-0 text-slate-400 group-hover:text-navy group-hover:scale-110 transition-transform" />
                            <span>{{ locale === 'id' ? 'Formulir Kontak' : 'Contact Form' }}</span>
                        </NuxtLink>
                        <a href="mailto:admin@archeris.net"
                            class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800/80 hover:text-navy dark:hover:text-slate-100 group">
                            <Icon icon="ph:envelope-simple-bold" class="text-sm shrink-0 text-slate-400 group-hover:text-navy group-hover:scale-110 transition-transform" />
                            <span class="truncate">admin@archeris.net</span>
                        </a>
                    </div>
                </div>
            </aside>
        </div>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted, nextTick } from 'vue'
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

const rawSlug = computed(() => {
    const raw = route.params.slug
    if (Array.isArray(raw)) return raw.join('/')
    return raw ? String(raw) : ''
})

const isIdRoute = computed(() => {
    return rawSlug.value.endsWith('/id') || rawSlug.value === 'id'
})

const currentSlug = computed(() => {
    if (isIdRoute.value) {
        return rawSlug.value.replace(/\/id$/, '')
    }
    return rawSlug.value
})

const activeDocLanguage = computed(() => {
    return isIdRoute.value ? 'id' : 'en'
})

const docPath = (slug) => {
    if (!slug) return '/docs'
    return isIdRoute.value ? `/docs/${slug}/id` : `/docs/${slug}`
}

const sidebarSearch = ref('')
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}

watch(rawSlug, () => {
    isMobileMenuOpen.value = false // Auto close on navigation in mobile
})

const categories = computed(() => [
    { id: 'about', label: isIdRoute.value ? 'Tentang Archeris' : 'About Archeris', icon: 'ph:info-bold' },
    { id: 'accounts', label: isIdRoute.value ? 'Tipe Akun' : 'User Accounts', icon: 'ph:users-three-bold' },
    { id: 'tournaments', label: isIdRoute.value ? 'Turnamen' : 'Tournament Setup', icon: 'ph:trophy-bold' },
    { id: 'scorekeeper', label: isIdRoute.value ? 'Petugas Skor' : 'Scorekeeper Operations', icon: 'ph:device-mobile-bold' },
    { id: 'qualification', label: isIdRoute.value ? 'Babak Kualifikasi' : 'Qualification Rounds', icon: 'ph:chart-line-up-bold' },
    { id: 'elimination', label: isIdRoute.value ? 'Bagan Eliminasi' : 'Elimination Brackets', icon: 'ph:tree-structure-bold' }
])

const sidebarCategories = categories

const getCategoryLabel = (id) => {
    const cat = categories.value.find(c => c.id === id)
    return cat ? cat.label : (id ? id.charAt(0).toUpperCase() + id.slice(1) : '')
}

// Fetch all docs list for sidebar navigation & prev/next calculations
const { data: docsList } = await useAsyncData(
    () => `docs-api-sidebar-${activeDocLanguage.value}`,
    () => $fetch(`${apiBaseUrl}/docs?lang=${activeDocLanguage.value}`),
    {
        watch: [activeDocLanguage]
    }
)

const docs = computed(() => docsList.value || [])

const hasCategories = computed(() => {
    return docs.value.some(d => d.category && d.category.trim() !== '')
})

const lastUpdatedText = computed(() => {
    const rawDate = currentDoc.value?.updated_at
    const dateObj = rawDate ? new Date(rawDate) : new Date()
    const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj
    
    if (isIdRoute.value) {
        const formatted = validDate.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
        return `Terakhir diperbarui pada ${formatted}`
    } else {
        const formatted = validDate.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        })
        return `Last updated on ${formatted}`
    }
})

// Canonicalize legacy non-nested URLs or category-prefixed URLs
watch([docs, currentSlug], () => {
    const slug = currentSlug.value
    if (!slug) return

    if (slug.includes('/')) {
        const base = slug.split('/').pop()
        const match = docs.value.find(d => d.slug === base || d.slug === slug)
        if (match?.slug && match.slug !== slug) {
            router.replace(docPath(match.slug))
        }
    }
}, { immediate: true })

// Fetch details for the current doc slug
const { data: currentDocData } = await useAsyncData(
    () => `docs-api-detail-${currentSlug.value}-${activeDocLanguage.value}`,
    () => $fetch(`${apiBaseUrl}/docs/${currentSlug.value}?lang=${activeDocLanguage.value}`).catch(() => null),
    {
        watch: [currentSlug, activeDocLanguage]
    }
)

const currentDoc = computed(() => currentDocData.value)

const formattedDocContent = computed(() => {
    const content = currentDoc.value?.content || ''
    if (!content) return ''
    
    // Auto wrap any unwrapped <table> with <div class="table-responsive">
    return content.replace(/(?<!<div class="(?:table-responsive|tableWrapper)"[^>]*>)\s*(<table[\s\S]*?<\/table>)/gi, (match) => {
        return `<div class="table-responsive">${match}</div>`
    })
})

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
    return docs.value.filter(d => d.category === categoryId)
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

const enDocUrl = computed(() => `https://archeris.net/docs/${currentSlug.value}`)
const idDocUrl = computed(() => `https://archeris.net/docs/${currentSlug.value}/id`)
const canonicalDocUrl = computed(() => isIdRoute.value ? idDocUrl.value : enDocUrl.value)

const structuredData = computed(() => {
    if (!currentDoc.value?.title) return null
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
                    'item': canonicalDocUrl.value
                }
            ]
        },
        {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': currentDoc.value.title,
            'description': currentDoc.value.excerpt || 'Archeris official documentation.',
            'url': canonicalDocUrl.value,
            'inLanguage': isIdRoute.value ? 'id-ID' : 'en-US',
            'datePublished': currentDoc.value?.created_at || '2024-01-15T00:00:00+00:00',
            'dateModified': currentDoc.value?.updated_at || new Date().toISOString(),
            'author': {
                '@type': 'Organization',
                'name': 'Archeris Technical Team',
                'url': 'https://archeris.net'
            },
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': canonicalDocUrl.value
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
    return {
        htmlAttrs: {
            lang: isIdRoute.value ? 'id' : 'en'
        },
        title: currentDoc.value ? `${currentDoc.value.title} - Archeris Docs` : 'Documentation - Archeris',
        link: [
            { rel: 'canonical', href: canonicalDocUrl.value },
            { rel: 'alternate', hreflang: 'en', href: enDocUrl.value },
            { rel: 'alternate', hreflang: 'id', href: idDocUrl.value },
            { rel: 'alternate', hreflang: 'x-default', href: enDocUrl.value }
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
    ogUrl: () => canonicalDocUrl.value,
    ogLocale: () => isIdRoute.value ? 'id_ID' : 'en_US',
    twitterCard: 'summary_large_image',
    twitterTitle: () => currentDoc.value ? `${currentDoc.value.title} - Archeris Docs` : 'Documentation - Archeris',
    twitterDescription: () => currentDoc.value?.excerpt || 'Archeris official documentation and archery scoring guides.'
})
</script>

<style>
/* ================= TYPOGRAPHY & HEADINGS ================= */
.doc-content h2 {
    font-size: 1.45rem;
    font-weight: 900;
    color: #0f172a;
    margin-top: 2.25rem;
    margin-bottom: 0.85rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #f1f5f9;
    letter-spacing: -0.02em;
    scroll-margin-top: 7rem;
}

.doc-content h3 {
    font-size: 1.25rem;
    font-weight: 800;
    color: #0f172a;
    margin-top: 1.75rem;
    margin-bottom: 0.65rem;
    letter-spacing: -0.015em;
    scroll-margin-top: 7rem;
    position: relative;
}

.doc-content h4 {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1e293b;
    margin-top: 1.35rem;
    margin-bottom: 0.5rem;
    scroll-margin-top: 7rem;
}

.doc-content h5 {
    font-size: 0.95rem;
    font-weight: 700;
    color: #334155;
    margin-top: 1.15rem;
    margin-bottom: 0.4rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.doc-content h6 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    margin-top: 1rem;
    margin-bottom: 0.35rem;
}

/* ================= PARAGRAPHS & TEXT ================= */
.doc-content p {
    color: #475569;
    line-height: 1.8;
    margin-bottom: 1.15rem;
    font-size: 0.95rem;
}

.doc-content strong {
    color: #0f172a;
    font-weight: 700;
}

.doc-content em {
    font-style: italic;
    color: #334155;
}

.doc-content a {
    color: #0284c7;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: all 0.15s ease;
}

.doc-content a:hover {
    color: #0369a1;
    opacity: 0.9;
}

/* ================= LISTS ================= */
.doc-content ul {
    list-style-type: disc;
    margin: 0.85rem 0 1.25rem 0;
    padding-left: 1.5rem;
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.75;
}

.doc-content ol {
    list-style-type: decimal;
    margin: 0.85rem 0 1.25rem 0;
    padding-left: 1.5rem;
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.75;
}

.doc-content li {
    margin-bottom: 0.5rem;
    padding-left: 0.25rem;
}

.doc-content li::marker {
    color: #0284c7;
    font-weight: 700;
}

.doc-content ul ul,
.doc-content ol ol,
.doc-content ul ol,
.doc-content ol ul {
    margin-top: 0.35rem;
    margin-bottom: 0.35rem;
    padding-left: 1.25rem;
}

.doc-content ul ul {
    list-style-type: circle;
}

.doc-content ul ul ul {
    list-style-type: square;
}

/* ================= BLOCKQUOTE ================= */
.doc-content blockquote {
    position: relative;
    margin: 1.5rem 0;
    padding: 1rem 1.25rem 1rem 1.25rem;
    border-left: 4px solid #0284c7;
    background: linear-gradient(to right, rgba(2, 132, 199, 0.06), rgba(2, 132, 199, 0.01));
    border-radius: 0 1rem 1rem 0;
    color: #334155;
    font-style: italic;
    font-size: 0.95rem;
    line-height: 1.75;
}

.doc-content blockquote p {
    margin-bottom: 0.5rem;
    color: inherit;
}

.doc-content blockquote p:last-child {
    margin-bottom: 0;
}

.doc-content blockquote strong {
    color: #0f172a;
    font-style: normal;
}

/* ================= HORIZONTAL RULE / DIVIDER ================= */
.doc-content hr {
    margin: 2.25rem 0;
    border: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0 20%, #e2e8f0 80%, transparent);
}

/* ================= INLINE CODE & CODE BLOCKS ================= */
.doc-content code {
    background-color: #f1f5f9;
    color: #0f172a;
    padding: 0.15rem 0.45rem;
    border-radius: 0.375rem;
    font-size: 0.85em;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    border: 1px solid #e2e8f0;
}

.doc-content pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 1.25rem;
    border-radius: 1rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    font-size: 0.875rem;
    line-height: 1.7;
    border: 1px solid #1e293b;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.doc-content pre code {
    background-color: transparent;
    color: inherit;
    padding: 0;
    border: none;
    font-size: inherit;
}

/* ================= KBD & HIGHLIGHT ================= */
.doc-content kbd {
    display: inline-block;
    padding: 0.15rem 0.4rem;
    font-size: 0.75rem;
    font-family: monospace;
    font-weight: 700;
    line-height: 1;
    color: #334155;
    background-color: #f8fafc;
    border: 1px solid #cbd5e1;
    border-radius: 0.375rem;
    box-shadow: 0 1px 0 1px #cbd5e1;
    margin: 0 0.2rem;
}

.doc-content mark {
    background-color: rgba(217, 255, 0, 0.35);
    color: #0f172a;
    padding: 0.1rem 0.3rem;
    border-radius: 0.25rem;
}

/* ================= TABLES ================= */
.doc-content .table-responsive,
.doc-content .tableWrapper {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    margin: 1.75rem 0;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.doc-content .table-responsive::-webkit-scrollbar,
.doc-content .tableWrapper::-webkit-scrollbar {
    height: 6px;
}

.doc-content .table-responsive::-webkit-scrollbar-track,
.doc-content .tableWrapper::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
}

.doc-content .table-responsive::-webkit-scrollbar-thumb,
.doc-content .tableWrapper::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.doc-content table {
    width: 100%;
    min-width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    margin: 0;
    border: none;
    font-size: 0.875rem;
}

.doc-content th {
    background-color: #f8fafc;
    color: #0f172a;
    font-weight: 800;
    font-size: 0.85rem;
    text-align: left;
    white-space: nowrap !important;
    padding: 0.875rem 1.25rem;
    border-bottom: 2px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    letter-spacing: 0.02em;
}

.doc-content th:last-child {
    border-right: none;
}

.doc-content td {
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid #e2e8f0;
    border-right: 1px solid #e2e8f0;
    color: #334155;
    background-color: #ffffff;
    vertical-align: top;
    line-height: 1.6;
}

.doc-content td:last-child {
    border-right: none;
}

.doc-content tr:last-child td {
    border-bottom: none;
}

.doc-content tr:nth-child(even) td {
    background-color: #f8fafc;
}

.doc-content tr:hover td {
    background-color: #f1f5f9;
}

.doc-content img {
    border-radius: 1rem;
    margin: 1.5rem 0;
    border: 1px solid #e2e8f0;
    max-width: 100%;
    height: auto;
}

/* ================= DARK THEME STYLES FOR DOC CONTENT ================= */
.dark .doc-content h2 {
    color: #f8fafc;
    border-bottom: 2px solid #1e293b;
}

.dark .doc-content h3 {
    color: #f1f5f9;
}

.dark .doc-content h4 {
    color: #e2e8f0;
}

.dark .doc-content h5 {
    color: #cbd5e1;
}

.dark .doc-content h6 {
    color: #94a3b8;
}

.dark .doc-content p {
    color: #cbd5e1;
}

.dark .doc-content em {
    color: #94a3b8;
}

.dark .doc-content ul,
.dark .doc-content ol {
    color: #cbd5e1;
}

.dark .doc-content li::marker {
    color: #38bdf8;
}

.dark .doc-content blockquote {
    border-left-color: #38bdf8;
    background: linear-gradient(to right, rgba(56, 189, 248, 0.1), rgba(56, 189, 248, 0.02));
    color: #cbd5e1;
}

.dark .doc-content blockquote strong {
    color: #f8fafc;
}

.dark .doc-content hr {
    background: linear-gradient(to right, transparent, #334155 20%, #334155 80%, transparent);
}

.dark .doc-content strong {
    color: #f8fafc;
}

.dark .doc-content a {
    color: #38bdf8;
}

.dark .doc-content a:hover {
    color: #7dd3fc;
}

.dark .doc-content code {
    background-color: #1e293b;
    color: #f1f5f9;
    border: 1px solid #334155;
}

.dark .doc-content pre {
    background-color: #020617;
    border-color: #1e293b;
}

.dark .doc-content kbd {
    background-color: #1e293b;
    color: #e2e8f0;
    border-color: #475569;
    box-shadow: 0 1px 0 1px #334155;
}

.dark .doc-content mark {
    background-color: rgba(217, 255, 0, 0.25);
    color: #f8fafc;
}

.dark .doc-content .table-responsive,
.dark .doc-content .tableWrapper {
    border-color: #334155;
    scrollbar-color: #475569 transparent;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2);
}

.dark .doc-content .table-responsive::-webkit-scrollbar-track,
.dark .doc-content .tableWrapper::-webkit-scrollbar-track {
    background: #0f172a;
}

.dark .doc-content .table-responsive::-webkit-scrollbar-thumb,
.dark .doc-content .tableWrapper::-webkit-scrollbar-thumb {
    background: #475569;
}

.dark .doc-content th {
    background-color: #1e293b;
    color: #f8fafc;
    border-bottom: 2px solid #334155;
    border-right: 1px solid #334155;
    white-space: nowrap !important;
}

.dark .doc-content th:last-child {
    border-right: none;
}

.dark .doc-content td {
    border-bottom: 1px solid #334155;
    border-right: 1px solid #334155;
    color: #cbd5e1;
    background-color: #0f172a;
}

.dark .doc-content td:last-child {
    border-right: none;
}

.dark .doc-content tr:last-child td {
    border-bottom: none;
}

.dark .doc-content tr:nth-child(even) td {
    background-color: rgba(30, 41, 59, 0.4);
}

.dark .doc-content tr:hover td {
    background-color: rgba(51, 65, 85, 0.4);
}

.dark .doc-content img {
    border-color: #334155;
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

/* ================= DEV MODE SMART IMAGE STYLING ================= */
.dev-mode-enabled img {
    cursor: pointer !important;
    position: relative;
    transition: all 0.2s ease-in-out;
}

.dev-mode-enabled img:hover {
    outline: 3px dashed #0284c7;
    outline-offset: 4px;
    box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.35);
    filter: brightness(0.97);
}

</style>
