<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero -->
        <section class="bg-navy overflow-hidden pt-16 pb-16 md:pt-20 md:pb-24 relative">
            <div class="absolute inset-0 z-0">
                <img src="/hero-homepage.jpeg" class="w-full h-full object-cover opacity-40" alt="" />
                <div class="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy/75 to-navy/60"></div>
            </div>

            <div class="container mx-auto px-4 max-w-5xl relative z-10 text-center py-12">
                <div
                    class="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 border border-primary/30 backdrop-blur-sm rounded-full text-primary text-xs font-bold tracking-widest mb-6">
                    <Icon icon="ph:book-open-bold" class="text-base" />
                    <span>{{ $t('docs.official_docs') }}</span>
                </div>
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                    {{ $t('docs.title_part2') }}<br /><span class="text-primary">{{ $t('docs.title_part1') }}</span>
                </h1>
                <p class="text-white/60 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
                    {{ $t('docs.description') }}
                </p>
                <!-- Search trigger -->
                <div class="max-w-lg mx-auto">
                    <button
                        @click="openSearch"
                        class="w-full flex items-center gap-3 pl-4 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white/50 hover:bg-white/15 hover:border-primary/50 transition-all text-sm group"
                    >
                        <Icon icon="ph:magnifying-glass-bold" class="text-lg text-gray-300 group-hover:text-primary transition-colors" />
                        <span class="flex-1 text-left text-white/40">{{ $t('docs.search_placeholder') }}</span>
                        <kbd class="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-white/10 border border-white/20 rounded-lg text-xs text-white/30 font-mono">Ctrl K</kbd>
                    </button>
                </div>
            </div>
        </section>

        <!-- Category Tabs -->
        <div class="sticky top-16 z-30 bg-white border-b border-gray-100 shadow-sm">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center gap-1 overflow-x-auto no-scrollbar py-3">
                    <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id"
                        class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all"
                        :class="activeCategory === cat.id
                            ? 'bg-navy text-primary shadow-sm'
                            : 'text-gray-500 hover:text-navy hover:bg-gray-100'">
                        <Icon :icon="cat.icon" class="text-base" />
                        {{ $t(cat.label) }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Content -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div v-for="cat in filteredCategories" :key="cat.id" class="mb-12">
                <div class="flex items-center gap-3 mb-5">
                    <div class="w-9 h-9 rounded-xl bg-navy flex items-center justify-center text-primary shrink-0">
                        <Icon :icon="cat.icon" class="text-lg" />
                    </div>
                    <div>
                        <h2 class="text-lg font-black text-navy">{{ $t(cat.label) }}</h2>
                        <p class="text-gray-400 text-xs">{{ cat.description ? $t(cat.description) : '' }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NuxtLink v-for="doc in filteredDocs(cat.id)" :key="doc.slug" :to="`/docs/${doc.slug}`"
                        class="group bg-navy border border-white/10 rounded-2.5xl p-6 hover:border-primary/45 hover:bg-navy-light/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full">
                        <!-- Subtle Glow Effect -->
                        <div class="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 group-hover:bg-primary/10 blur-xl rounded-full transition-all duration-300"></div>

                        <div class="flex items-start gap-4">
                            <div
                                class="w-11 h-11 rounded-2xl bg-white/5 group-hover:bg-primary/10 border border-white/10 group-hover:border-primary/25 flex items-center justify-center text-slate-400 group-hover:text-primary transition-all duration-300 shrink-0">
                                <Icon :icon="doc.icon" class="text-xl" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3
                                    class="font-black text-white text-base group-hover:text-primary transition-colors mb-2 leading-snug">
                                    {{ doc.title }}</h3>
                                <p class="text-slate-300 text-xs leading-relaxed line-clamp-2 font-medium">{{ doc.excerpt }}</p>
                            </div>
                        </div>
                        <div class="flex items-center mt-5 pt-4 border-t border-white/5">
                            <span class="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
                                <Icon icon="ph:clock-bold" class="text-sm" /> {{ doc.readTime }}
                            </span>
                            <span
                                class="ml-auto flex items-center gap-1 text-xs font-black text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300">
                                {{ $t('docs.read') }}
                                <Icon icon="ph:arrow-right-bold" class="text-xs" />
                            </span>
                        </div>
                    </NuxtLink>
                </div>

                <!-- Empty per category -->
                <div v-if="filteredDocs(cat.id).length === 0" class="text-center py-8 text-gray-300 text-sm">
                    {{ $t('docs.no_matching_articles') }}
                </div>
            </div>

            <!-- Global empty state -->
            <div v-if="filteredCategories.length === 0" class="text-center py-24">
                <Icon icon="ph:file-search-bold" class="text-5xl text-gray-300 mb-4" />
                <p class="text-gray-400 font-medium">{{ $t('docs.no_docs_found') }}</p>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { docs } from '~/data/docs'
import { translateDoc } from '~/utils/docsTranslator'

definePageMeta({ layout: 'docs' })

const { t, locale } = useI18n()

useHead({
    title: 'Dokumentasi - Archeris.net',
    meta: [{ name: 'description', content: 'Dokumentasi resmi Archeris.net. Panduan lengkap tentang platform, jenis busur, sistem berlangganan, dan tata cara turnamen.' }]
})

const route = useRoute()
const router = useRouter()

const openSearch = () => {
    // Trigger the Ctrl+K event so the global DocSearchDialog opens
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }))
}

const searchQuery = ref(route.query.q || '')

watch(searchQuery, (newVal) => {
    if (newVal.trim() !== '') {
        router.replace({ query: { ...route.query, q: newVal } })
    } else {
        const q = { ...route.query }
        delete q.q
        router.replace({ query: q })
    }
})

watch(() => route.query.q, (newQ) => {
    if (newQ !== undefined && newQ !== searchQuery.value) {
        searchQuery.value = newQ
    }
})

const activeCategory = ref((route.query.cat as string) || 'all')

watch(() => route.query.cat, (newCat) => {
    activeCategory.value = (newCat as string) || 'all'
})

const categories = [
    { id: 'all', label: 'docs.categories.all', icon: 'ph:squares-four-bold', description: '' },
    { id: 'platform', label: 'docs.categories.platform', icon: 'ph:rocket-bold', description: 'docs.cat_desc.platform' },
    { id: 'archer', label: 'docs.categories.archer', icon: 'ph:user-bold', description: 'docs.cat_desc.archer' },
    { id: 'archery', label: 'docs.categories.archery', icon: 'ph:crosshair-bold', description: 'docs.cat_desc.archery' },
    { id: 'subscription', label: 'docs.categories.subscription', icon: 'ph:crown-bold', description: 'docs.cat_desc.subscription' },
    { id: 'event', label: 'docs.categories.event', icon: 'ph:trophy-bold', description: 'docs.cat_desc.event' },
    { id: 'scoring', label: 'docs.categories.scoring', icon: 'ph:target-bold', description: 'docs.cat_desc.scoring' },
    { id: 'marketplace', label: 'docs.categories.marketplace', icon: 'ph:storefront-bold', description: 'docs.cat_desc.marketplace' },
]

const filteredCategories = computed(() => {
    const cats = activeCategory.value === 'all' ? categories.filter(c => c.id !== 'all') : categories.filter(c => c.id === activeCategory.value)
    if (searchQuery.value === '') return cats
    return cats.filter(cat => filteredDocs(cat.id).length > 0)
})

const filteredDocs = (categoryId) => {
    return docs.filter(d => {
        const matchCat = d.category === categoryId
        const matchSearch = searchQuery.value === '' ||
            d.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            d.excerpt.toLowerCase().includes(searchQuery.value.toLowerCase())
        return matchCat && matchSearch
    }).map(d => translateDoc(d, locale.value))
}
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
</style>
