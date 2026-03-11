<template>
    <div class="min-h-screen bg-gray-50 docs-page">
        <!-- Breadcrumb bar (not sticky) -->
        <div class="bg-white border-b border-gray-100">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex items-center gap-2 h-11 text-xs text-gray-500 overflow-x-auto no-scrollbar">
                    <NuxtLink to="/" class="hover:text-navy transition-colors whitespace-nowrap">Beranda</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-gray-300 shrink-0" />
                    <NuxtLink to="/docs" class="hover:text-navy transition-colors whitespace-nowrap">Dokumentasi</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-gray-300 shrink-0" />
                    <span class="text-navy font-semibold whitespace-nowrap truncate">{{ currentDoc?.title }}</span>
                </div>
            </div>
        </div>

        <div class="container mx-auto px-4 max-w-7xl pt-8 pb-20 flex flex-col lg:flex-row gap-0">
            <!-- Left Sidebar (Navigation) -->
            <aside
                class="flex flex-col w-full lg:w-64 xl:w-72 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-4 lg:scrollbar-styled self-start mb-8 lg:mb-0">
                <!-- Mobile Toggle Button -->
                <button @click="isMobileMenuOpen = !isMobileMenuOpen"
                    class="lg:hidden flex items-center justify-between w-full bg-white border border-gray-200 rounded-xl px-4 py-3 mb-2 text-sm font-bold text-navy hover:bg-gray-50 transition-colors">
                    <span class="flex items-center gap-2">
                        <Icon icon="ph:list-dashes-bold" class="text-lg text-primary" />
                        Daftar Isi Dokumentasi
                    </span>
                    <Icon :icon="isMobileMenuOpen ? 'ph:caret-up-bold' : 'ph:caret-down-bold'"
                        class="text-gray-400 text-base" />
                </button>

                <!-- Sidebar content (collapsible on mobile, always visible on desktop) -->
                <div :class="isMobileMenuOpen ? 'block' : 'hidden lg:block'"
                    class="bg-gray-50 lg:bg-transparent -mx-4 px-4 py-4 lg:p-0 lg:mx-0 border-y border-gray-100 lg:border-0 rounded-none lg:rounded-none">

                    <!-- Nav sections -->
                    <div v-for="cat in sidebarVisibleCategories" :key="cat.id" class="mb-4">
                        <div class="flex items-center gap-2 px-2 py-1.5 mb-1">
                            <Icon :icon="cat.icon" class="text-sm text-gray-400" />
                            <span class="text-xs font-black text-gray-400 tracking-widest uppercase">{{ cat.label
                                }}</span>
                        </div>
                        <div class="space-y-0.5">
                            <NuxtLink v-for="doc in filteredSidebarDocs(cat.id)" :key="doc.slug"
                                :to="`/docs/${doc.slug}`"
                                class="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all relative group"
                                :class="currentSlug === doc.slug
                                    ? 'bg-navy text-primary font-bold'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-navy font-medium'">
                                <div v-if="currentSlug === doc.slug"
                                    class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-r-full">
                                </div>
                                <span class="leading-snug" :class="currentSlug !== doc.slug ? 'pl-2' : ''">{{ doc.title
                                    }}</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </aside>

            <!-- Main content -->
            <main class="flex-1 min-w-0 w-full lg:pl-8 lg:pr-6">
                <div v-if="currentDoc" class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <!-- Doc header -->
                    <div class="bg-navy px-8 pt-10 pb-8 relative overflow-hidden">
                        <div class="absolute inset-0 opacity-10"
                            style="background-image: linear-gradient(to right, #b7fb23 1px, transparent 1px), linear-gradient(to bottom, #b7fb23 1px, transparent 1px); background-size: 40px 40px;">
                        </div>
                        <div class="relative z-10">
                            <div
                                class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-primary text-xs font-bold mb-4">
                                <Icon :icon="currentDoc.icon" class="text-sm" />
                                {{ getCategoryLabel(currentDoc.category) }}
                            </div>
                            <h1 class="text-2xl md:text-3xl xl:text-4xl font-black text-white mb-3 leading-tight">{{
                                currentDoc.title }}</h1>
                            <p class="text-white/60 text-sm">{{ currentDoc.excerpt }}</p>
                            <div class="flex items-center gap-4 mt-4 text-white/40 text-xs">
                                <span class="flex items-center gap-1.5">
                                    <Icon icon="ph:clock-bold" class="text-sm" /> {{ currentDoc.readTime }} membaca
                                </span>
                                <span class="flex items-center gap-1.5">
                                    <Icon icon="ph:calendar-blank-bold" class="text-sm" /> Diperbarui Maret 2025
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Doc body -->
                    <div class="px-6 md:px-10 py-8 doc-content" v-html="currentDoc.content"></div>

                    <!-- Navigation buttons -->
                    <div
                        class="px-6 md:px-10 py-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <NuxtLink v-if="prevDoc" :to="`/docs/${prevDoc.slug}`"
                            class="flex items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 border border-gray-100 transition-all w-full sm:max-w-xs justify-start">
                            <Icon icon="ph:arrow-left-bold"
                                class="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                            <div class="text-left min-w-0">
                                <div class="text-xs text-gray-400 mb-0.5">Sebelumnya</div>
                                <div
                                    class="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                                    {{ prevDoc.title }}</div>
                            </div>
                        </NuxtLink>
                        <div v-else class="hidden sm:block"></div>
                        <NuxtLink v-if="nextDoc" :to="`/docs/${nextDoc.slug}`"
                            class="flex items-center gap-3 group p-4 rounded-2xl hover:bg-gray-50 border border-gray-100 transition-all w-full sm:max-w-xs justify-end text-right sm:ml-auto">
                            <div class="min-w-0">
                                <div class="text-xs text-gray-400 mb-0.5">Selanjutnya</div>
                                <div
                                    class="text-sm font-bold text-navy truncate group-hover:text-primary transition-colors">
                                    {{ nextDoc.title }}</div>
                            </div>
                            <Icon icon="ph:arrow-right-bold"
                                class="text-gray-400 group-hover:text-primary transition-colors shrink-0" />
                        </NuxtLink>
                    </div>
                </div>

                <!-- Not found -->
                <div v-else class="bg-white rounded-3xl border border-gray-100 shadow-sm p-16 text-center">
                    <Icon icon="ph:file-x-bold" class="text-5xl text-gray-300 mb-4" />
                    <h2 class="text-xl font-black text-navy mb-2">Halaman tidak ditemukan</h2>
                    <p class="text-gray-500 mb-6 text-sm">Dokumentasi yang kamu cari mungkin telah dipindahkan atau
                        belum tersedia.</p>
                    <NuxtLink to="/docs"
                        class="inline-flex items-center gap-2 bg-navy text-primary font-bold px-6 py-2.5 rounded-xl hover:bg-navy/90 transition-all text-sm">
                        <Icon icon="ph:arrow-left-bold" />
                        Kembali ke Docs
                    </NuxtLink>
                </div>
            </main>

            <!-- Right sidebar: Table of contents -->
            <aside
                class="hidden lg:flex flex-col w-56 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] overflow-y-auto pl-4 scrollbar-styled self-start">
                <div class="text-xs font-black text-gray-400 tracking-widest uppercase mb-3">Di halaman ini</div>
                <nav class="space-y-1">
                    <a v-for="heading in currentDoc?.toc || []" :key="heading.id" :href="`#${heading.id}`"
                        class="block text-sm py-1.5 transition-colors leading-snug" :class="[
                            heading.level === 2 ? 'text-gray-600 hover:text-primary font-medium pl-0' : 'text-gray-400 hover:text-primary pl-3 text-xs'
                        ]">
                        {{ heading.text }}
                    </a>
                </nav>

                <!-- Divider -->
                <div class="mt-6 pt-6 border-t border-gray-100">
                    <NuxtLink to="/docs"
                        class="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors font-medium mb-3">
                        <Icon icon="ph:arrow-left-bold" class="text-xs" /> Semua Dokumentasi
                    </NuxtLink>
                    <NuxtLink to="/contact"
                        class="flex items-center gap-2 text-xs text-gray-400 hover:text-primary transition-colors font-medium">
                        <Icon icon="ph:chat-circle-dots-bold" class="text-sm" /> Hubungi Support
                    </NuxtLink>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'docs' })

const openSearch = () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
}

const route = useRoute()
const currentSlug = computed(() => route.params.slug)
const sidebarSearch = ref('')
const isMobileMenuOpen = ref(false)

watch(currentSlug, () => {
    isMobileMenuOpen.value = false // Auto close on navigation in mobile
})

const categories = [
    { id: 'platform', label: 'Platform', icon: 'ph:rocket-bold' },
    { id: 'archer', label: 'Akun Pemanah', icon: 'ph:user-bold' },
    { id: 'archery', label: 'Teknis Panahan', icon: 'ph:crosshair-bold' },
    { id: 'subscription', label: 'Berlangganan', icon: 'ph:crown-bold' },
    { id: 'event', label: 'Manajemen Event', icon: 'ph:trophy-bold' },
    { id: 'scoring', label: 'Scoring', icon: 'ph:target-bold' },
    { id: 'marketplace', label: 'Marketplace', icon: 'ph:storefront-bold' },
]

const sidebarCategories = categories

const getCategoryLabel = (id) => categories.find(c => c.id === id)?.label || id

import { docs } from '~/data/docs'

const currentDoc = computed(() => docs.find(d => d.slug === currentSlug.value))

const currentIndex = computed(() => docs.findIndex(d => d.slug === currentSlug.value))
const prevDoc = computed(() => currentIndex.value > 0 ? docs[currentIndex.value - 1] : null)
const nextDoc = computed(() => currentIndex.value < docs.length - 1 ? docs[currentIndex.value + 1] : null)

const filteredSidebarDocs = (categoryId) => {
    return docs.filter(d => {
        const matchCat = d.category === categoryId
        const matchSearch = sidebarSearch.value === '' ||
            d.title.toLowerCase().includes(sidebarSearch.value.toLowerCase())
        return matchCat && matchSearch
    })
}

const sidebarVisibleCategories = computed(() => {
    return sidebarCategories.filter(cat => filteredSidebarDocs(cat.id).length > 0)
})

useHead(computed(() => ({
    title: currentDoc.value ? `${currentDoc.value.title} - Dokumentasi Archeryhub.id` : 'Dokumentasi - Archeryhub.id',
    meta: [{ name: 'description', content: currentDoc.value?.excerpt || '' }]
})))
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
    color: #b7fb23;
    text-decoration: underline;
}

.doc-content a:hover {
    opacity: 0.8;
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
</style>
