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
                    <span>DOKUMENTASI RESMI</span>
                </div>
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-5">
                    Pusat <span class="text-primary">Dokumentasi</span><br />Archeryhub.id
                </h1>
                <p class="text-white/60 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
                    Panduan lengkap tentang platform, jenis busur panahan, sistem berlangganan, tata cara turnamen, dan
                    banyak lagi — semua tersedia di satu tempat.
                </p>
                <!-- Search -->
                <div class="max-w-lg mx-auto relative">
                    <Icon icon="ph:magnifying-glass-bold"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input v-model="searchQuery" type="text" placeholder="Cari dokumentasi..."
                        class="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-sm" />
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
                        {{ cat.label }}
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
                        <h2 class="text-lg font-black text-navy">{{ cat.label }}</h2>
                        <p class="text-gray-400 text-xs">{{ cat.description }}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <NuxtLink v-for="doc in filteredDocs(cat.id)" :key="doc.slug" :to="`/docs/${doc.slug}`"
                        class="group bg-white rounded-2xl border border-gray-100 p-5 hover:border-primary/30 hover:shadow-md transition-all">
                        <div class="flex items-start gap-4">
                            <div
                                class="w-9 h-9 rounded-xl bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all shrink-0">
                                <Icon :icon="doc.icon" class="text-lg" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <h3
                                    class="font-bold text-navy text-sm group-hover:text-primary transition-colors mb-1 leading-snug">
                                    {{ doc.title }}</h3>
                                <p class="text-gray-400 text-xs leading-relaxed line-clamp-2">{{ doc.excerpt }}</p>
                            </div>
                        </div>
                        <div class="flex items-center mt-4 pt-3 border-t border-gray-50">
                            <span class="text-xs text-gray-300 flex items-center gap-1">
                                <Icon icon="ph:clock-bold" class="text-xs" /> {{ doc.readTime }}
                            </span>
                            <span
                                class="ml-auto flex items-center gap-1 text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Baca
                                <Icon icon="ph:arrow-right-bold" class="text-xs" />
                            </span>
                        </div>
                    </NuxtLink>
                </div>

                <!-- Empty per category -->
                <div v-if="filteredDocs(cat.id).length === 0" class="text-center py-8 text-gray-300 text-sm">
                    Tidak ada artikel yang cocok.
                </div>
            </div>

            <!-- Global empty state -->
            <div v-if="filteredCategories.length === 0" class="text-center py-24">
                <Icon icon="ph:file-search-bold" class="text-5xl text-gray-300 mb-4" />
                <p class="text-gray-400 font-medium">Tidak ada dokumentasi yang cocok dengan pencarian.</p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'docs' })

useHead({
    title: 'Dokumentasi - Archeryhub.id',
    meta: [{ name: 'description', content: 'Dokumentasi resmi Archeryhub.id. Panduan lengkap tentang platform, jenis busur, sistem berlangganan, dan tata cara turnamen.' }]
})

const route = useRoute()
const router = useRouter()

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

const activeCategory = ref('all')

const categories = [
    { id: 'all', label: 'Semua', icon: 'ph:squares-four-bold', description: '' },
    { id: 'platform', label: 'Platform', icon: 'ph:rocket-bold', description: 'Mengenal Archeryhub.id secara mendalam' },
    { id: 'archer', label: 'Akun Pemanah', icon: 'ph:user-bold', description: 'Panduan khusus untuk pengguna akun Pemanah' },
    { id: 'archery', label: 'Teknis Panahan', icon: 'ph:crosshair-bold', description: 'Pengetahuan dasar dan teknis panahan' },
    { id: 'subscription', label: 'Berlangganan', icon: 'ph:crown-bold', description: 'Paket dan fitur berlangganan' },
    { id: 'event', label: 'Manajemen Event', icon: 'ph:trophy-bold', description: 'Panduan pengelolaan event' },
    { id: 'scoring', label: 'Scoring', icon: 'ph:target-bold', description: 'Sistem penilaian dan scoring' },
]

import { docs } from '~/data/docs'

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
    })
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
