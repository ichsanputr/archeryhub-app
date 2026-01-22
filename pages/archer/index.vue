<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section
            class="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-20 md:py-28 relative overflow-hidden">
            <div class="absolute inset-0 opacity-15">
                <img src="https://images.unsplash.com/photo-1565992441121-4367c2967103?w=1600"
                    class="w-full h-full object-cover" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-sm font-bold uppercase tracking-widest mb-6">
                        <Icon icon="ph:user-focus-bold" class="text-lg" />
                        <span>Komunitas Pemanah</span>
                    </div>
                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
                        Temukan <span class="text-primary">Pemanah</span><br />
                        Berbakat di Indonesia
                    </h1>
                    <p class="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
                        Jelajahi profil pemanah terbaik, lihat prestasi mereka, dan ikuti perjalanan mereka dalam dunia
                        panahan.
                    </p>

                    <!-- Search Bar -->
                    <div class="mt-10 flex flex-col sm:flex-row gap-4 max-w-xl">
                        <div class="relative flex-1">
                            <Icon icon="ph:magnifying-glass-bold"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input v-model="searchQuery" type="text" placeholder="Cari nama pemanah, kode atlet, atau klub..."
                                class="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-navy font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-primary/30 outline-none transition-all text-base" />
                        </div>
                        <button @click="fetchArchers"
                            class="px-8 py-4 bg-primary hover:bg-primary-hover text-navy font-black rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                            <Icon icon="ph:magnifying-glass-bold" />
                            Cari
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Quick Stats -->
        <section class="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div class="text-center">
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">{{ totalArchers }}</p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wide mt-1">Pemanah</p>
                </div>
                <div class="text-center border-l border-gray-100">
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">{{ activeArchers }}</p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wide mt-1">Aktif</p>
                </div>
                <div class="text-center border-l border-gray-100">
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">34</p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wide mt-1">Provinsi</p>
                </div>
                <div class="text-center border-l border-gray-100">
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">500+</p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wide mt-1">Event</p>
                </div>
            </div>
        </section>

        <!-- Filter Bar -->
        <section class="container mx-auto px-4 max-w-7xl py-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <!-- Bow Type Filters -->
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <button v-for="type in bowTypes" :key="type.value" @click="activeBowType = type.value" :class="[
                        'px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2',
                        activeBowType === type.value
                            ? 'bg-navy text-white border-navy shadow-lg shadow-navy/20'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy'
                    ]">
                        {{ type.label }}
                    </button>
                </div>

                <!-- View Toggle & Count -->
                <div class="flex items-center gap-4">
                    <p class="text-gray-500 text-sm font-medium">
                        <span class="font-bold text-navy">{{ archers.length }}</span> pemanah ditemukan
                    </p>
                    <div class="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                        <button @click="viewMode = 'grid'"
                            :class="['p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white shadow-sm text-navy' : 'text-gray-400 hover:text-navy']">
                            <Icon icon="ph:squares-four-bold" class="text-lg" />
                        </button>
                        <button @click="viewMode = 'list'"
                            :class="['p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-white shadow-sm text-navy' : 'text-gray-400 hover:text-navy']">
                            <Icon icon="ph:list-bold" class="text-lg" />
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Archers Grid -->
        <section class="container mx-auto px-4 max-w-7xl pb-16">
            <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 pointer-events-none">
                <div v-for="i in 6" :key="i" class="h-[400px] bg-white rounded-2xl border-2 border-gray-100 animate-pulse"></div>
            </div>

            <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="archer in filteredArchers" :key="archer.id || archer.uuid" 
                    :to="`/archer/${archer.slug || archer.uuid}`"
                    class="group bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-primary transition-all duration-300">
                    <!-- Archer Avatar & Banner -->
                    <div class="relative h-44 bg-gradient-to-br from-primary to-amber-400 overflow-hidden">
                        <div v-if="archer.photo_url || archer.avatar_url" class="w-full h-full">
                            <img :src="archer.photo_url || archer.avatar_url"
                                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        </div>

                        <!-- Location Badge -->
                        <div v-if="archer.city" class="absolute bottom-4 left-4">
                            <span
                                class="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-navy text-xs font-bold rounded-full">
                                <Icon icon="ph:map-pin-fill" class="text-primary" />
                                {{ archer.city }}
                            </span>
                        </div>
                    </div>

                    <!-- Archer Info -->
                    <div class="p-5">
                        <div class="flex items-start gap-4">
                            <!-- Avatar -->
                            <div
                                class="w-14 h-14 -mt-7 rounded-xl bg-white border-2 border-white shadow-xl overflow-hidden flex-shrink-0 relative z-[2]">
                                <div v-if="!archer.photo_url && !archer.avatar_url"
                                    class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                                    <span class="text-xl font-black text-navy">{{ archer.full_name?.charAt(0) || 'A' }}</span>
                                </div>
                                <img v-else :src="archer.photo_url || archer.avatar_url" class="w-full h-full object-cover" />
                            </div>

                            <div class="flex-1 min-w-0 pt-1">
                                <h3
                                    class="font-black text-navy text-lg truncate group-hover:text-primary transition-colors">
                                    {{ archer.full_name }}</h3>
                                <p v-if="archer.athlete_code" class="text-gray-400 text-sm truncate">{{ archer.athlete_code }}</p>
                                <p v-else-if="archer.club_name || archer.club" class="text-gray-400 text-sm truncate">{{ archer.club_name || archer.club }}</p>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:target-bold" class="text-primary" />
                                <span class="font-black text-navy text-sm">{{ archer.bow_type || 'Recurve' }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:trophy-bold" class="text-amber-400" />
                                <span class="font-black text-navy text-sm">{{ archer.total_events || 0 }} Events</span>
                            </div>
                            <div v-if="archer.best_score" class="flex items-center gap-1 text-right">
                                <Icon icon="ph:star-fill" class="text-primary" />
                                <span class="font-black text-navy text-sm">{{ archer.best_score }}</span>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- List View -->
            <div v-else class="space-y-4">
                <div v-for="archer in filteredArchers" :key="archer.id || archer.uuid"
                    class="bg-white rounded-xl border-2 border-gray-100 hover:border-primary transition-all p-6">
                    <NuxtLink :to="`/archer/${archer.slug || archer.uuid}`" class="flex items-center gap-6 group">
                        <div class="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-amber-400 overflow-hidden flex-shrink-0">
                            <img v-if="archer.photo_url || archer.avatar_url" 
                                :src="archer.photo_url || archer.avatar_url" 
                                class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <span class="text-2xl font-black text-navy">{{ archer.full_name?.charAt(0) || 'A' }}</span>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-black text-navy text-xl group-hover:text-primary transition-colors">
                                {{ archer.full_name }}
                            </h3>
                            <div class="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span v-if="archer.athlete_code">{{ archer.athlete_code }}</span>
                                <span v-if="archer.city">{{ archer.city }}</span>
                                <span v-if="archer.bow_type">{{ archer.bow_type }}</span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-sm text-gray-500 mb-1">Total Event</div>
                            <div class="text-2xl font-black text-navy">{{ archer.total_events || 0 }}</div>
                        </div>
                        <Icon icon="ph:arrow-right" class="text-gray-300 group-hover:text-primary transition-colors" />
                    </NuxtLink>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="filteredArchers.length === 0 && !isLoading" class="text-center py-20">
                <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Icon icon="ph:user-focus" class="text-5xl text-gray-300" />
                </div>
                <h3 class="text-2xl font-black text-navy mb-3">Pemanah Tidak Ditemukan</h3>
                <p class="text-gray-500 max-w-md mx-auto">Coba ubah filter atau kata kunci pencarian untuk menemukan
                    pemanah yang sesuai.</p>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'

definePageMeta({
    layout: 'landing'
})

const { get } = useApi()

const searchQuery = ref('')
const activeBowType = ref('all')
const viewMode = ref('grid')

// API state
const archers = ref([])
const isLoading = ref(false)
const totalArchers = ref(0)
const activeArchers = ref(0)

const bowTypes = [
    { label: 'Semua', value: 'all' },
    { label: 'Recurve', value: 'recurve' },
    { label: 'Compound', value: 'compound' },
    { label: 'Barebow', value: 'barebow' },
    { label: 'Traditional', value: 'traditional' },
]

// Dummy data fallback
const dummyArchers = [
    {
        uuid: '1',
        slug: 'budi-santoso',
        full_name: 'Budi Santoso',
        athlete_code: 'ARC-2024-001',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        bow_type: 'recurve',
        photo_url: null,
        club: 'Jakarta Elite Archery',
        club_name: 'Jakarta Elite Archery',
        total_events: 12,
        best_score: 680
    },
    {
        uuid: '2',
        slug: 'siti-aminah',
        full_name: 'Siti Aminah',
        athlete_code: 'ARC-2024-002',
        city: 'Bandung',
        province: 'Jawa Barat',
        bow_type: 'compound',
        photo_url: null,
        club: 'Bandung Archery Club',
        club_name: 'Bandung Archery Club',
        total_events: 8,
        best_score: 695
    },
    {
        uuid: '3',
        slug: 'rahmat-hidayat',
        full_name: 'Rahmat Hidayat',
        athlete_code: 'ARC-2024-003',
        city: 'Surabaya',
        province: 'Jawa Timur',
        bow_type: 'barebow',
        photo_url: null,
        club: 'Surabaya Archery',
        club_name: 'Surabaya Archery',
        total_events: 15,
        best_score: 650
    },
]

const fetchArchers = async () => {
    isLoading.value = true
    try {
        const params = {}
        
        if (searchQuery.value) {
            params.search = searchQuery.value
        }
        
        if (activeBowType.value !== 'all') {
            // Note: API might not have bow_type filter, but we can filter client-side
        }

        const response = await get('/archers', { query: params })
        
        if (response.archers && response.archers.length > 0) {
            archers.value = response.archers
            totalArchers.value = response.total || response.archers.length
            activeArchers.value = response.archers.filter(a => a.status === 'active').length
        } else {
            // Use dummy data if API returns empty
            archers.value = dummyArchers
            totalArchers.value = dummyArchers.length
            activeArchers.value = dummyArchers.length
        }
    } catch (error) {
        console.error('Failed to fetch archers:', error)
        // Use dummy data on error
        archers.value = dummyArchers
        totalArchers.value = dummyArchers.length
        activeArchers.value = dummyArchers.length
    } finally {
        isLoading.value = false
    }
}

// Filter by bow type client-side
const filteredArchers = computed(() => {
    if (activeBowType.value === 'all') {
        return archers.value
    }
    return archers.value.filter(a => a.bow_type === activeBowType.value)
})

// Watchers for filters
watch([searchQuery, activeBowType], () => {
    fetchArchers()
})

onMounted(() => {
    fetchArchers()
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
