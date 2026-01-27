<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden py-16 md:py-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-archer.jpeg" alt="Archers Background" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10 text-center md:text-left">
                <div class="max-w-3xl">
                    <h1 class="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                        Temukan <span class="text-primary">Inspirasi</span> & <br />
                        Koneksi Pemanah Indonesia
                    </h1>
                    <p class="text-white/90 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto md:mx-0">
                        Jelajahi profil para pemanah berbakat dari seluruh penjuru nusantara. Lihat prestasi, klub, dan
                        dedikasi mereka dalam dunia panahan.
                    </p>
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
            <div v-if="isLoading"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 pointer-events-none">
                <div v-for="i in 6" :key="i"
                    class="h-[400px] bg-white rounded-2xl border-2 border-gray-100 animate-pulse"></div>
            </div>

            <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="archer in filteredArchers" :key="archer.id || archer.uuid"
                    :to="`/archer/${archer.slug || archer.uuid}`"
                    class="group bg-white rounded-3xl border border-gray-100 p-6 transition-all duration-500">
                    <div class="flex items-center gap-5">
                        <!-- Avatar -->
                        <div class="relative flex-shrink-0">
                            <div
                                class="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-amber-400 p-0.5 overflow-hidden shadow-sm transition-transform duration-500">
                                <div class="w-full h-full rounded-[14px] overflow-hidden bg-white">
                                    <img v-if="archer.photo_url || archer.avatar_url"
                                        :src="useImageOrDefault(archer.photo_url || archer.avatar_url)"
                                        class="w-full h-full object-cover transition-transform duration-500" />
                                    <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
                                        <span class="text-2xl font-black text-navy">{{ archer.full_name?.charAt(0) ||
                                            'A'
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <div
                                class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-md border border-gray-50">
                                <Icon icon="ph:sketch-logo-fill" class="text-primary text-sm" />
                            </div>
                        </div>

                        <!-- Name & Basic Info -->
                        <div class="flex-1 min-w-0">
                            <h3 class="font-black text-navy text-xl leading-tight transition-colors truncate mb-1">
                                {{ archer.full_name }}
                            </h3>
                            <div class="flex flex-col gap-0.5">
                                <span class="text-gray-400 text-sm font-bold flex items-center gap-1.5">
                                    <Icon icon="ph:shield-bold" class="text-xs" />
                                    <span class="truncate">{{ archer.club_name || archer.club || 'Independent' }}</span>
                                </span>
                                <span v-if="archer.city"
                                    class="text-gray-400 text-[11px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
                                    <Icon icon="ph:map-pin-bold" class="text-xs" />
                                    {{ archer.city }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Archer Details Grid -->
                    <div class="grid grid-cols-2 gap-3 mt-8">
                        <div class="bg-gray-50/50 rounded-2xl p-3 border border-gray-50 transition-all">
                            <span
                                class="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Divisi</span>
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 rounded-md bg-navy/5 flex items-center justify-center">
                                    <Icon icon="ph:target-bold" class="text-navy text-xs" />
                                </div>
                                <span class="text-xs font-black text-navy truncate capitalize">{{ archer.bow_type ||
                                    'Recurve'
                                    }}</span>
                            </div>
                        </div>
                        <div class="bg-gray-50/50 rounded-2xl p-3 border border-gray-50 transition-all">
                            <span
                                class="block text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1.5">Pengalaman</span>
                            <div class="flex items-center gap-2">
                                <div class="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center">
                                    <Icon icon="ph:medal-bold" class="text-amber-500 text-xs" />
                                </div>
                                <span class="text-xs font-black text-navy">{{ archer.total_events || 0 }} Event</span>
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
                        <div
                            class="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-amber-400 overflow-hidden flex-shrink-0">
                            <img v-if="archer.photo_url || archer.avatar_url"
                                :src="useImageOrDefault(archer.photo_url || archer.avatar_url)"
                                class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center">
                                <span class="text-2xl font-black text-navy">{{ archer.full_name?.charAt(0) || 'A'
                                    }}</span>
                            </div>
                        </div>
                        <div class="flex-1 min-w-0">
                            <h3 class="font-black text-navy text-xl transition-colors">
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
                        <Icon icon="ph:arrow-right" class="text-gray-300 transition-colors" />
                    </NuxtLink>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="archers.length === 0 && !isLoading" class="text-center py-20">
                <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Icon icon="ph:user-focus" class="text-5xl text-gray-300" />
                </div>
                <h3 class="text-2xl font-black text-navy mb-3">Pemanah Tidak Ditemukan</h3>
                <p class="text-gray-500 max-w-md mx-auto">Coba ubah filter atau kata kunci pencarian untuk menemukan
                    pemanah yang sesuai.</p>
            </div>

            <!-- Pagination -->
            <div v-if="totalArchers > pageSize" class="mt-12 flex justify-center">
                <BasePagination v-model="currentPage" :total-items="totalArchers" :items-per-page="pageSize" />
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

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const activeBowType = ref('all')
const viewMode = ref('grid')
const currentPage = ref(Number(route.query.page) || 1)
const pageSize = ref(12)

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
    },
]

const { data: archerResponse, pending: isLoading } = await useAsyncData('archers', () => get('/archers', {
    query: {
        search: searchQuery.value || undefined,
        bow_type: activeBowType.value !== 'all' ? activeBowType.value : undefined,
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value
    }
}), {
    watch: [searchQuery, activeBowType, currentPage],
    server: true
})

// Update URL when page changes
watch(currentPage, (val) => {
    router.push({
        query: {
            ...route.query,
            page: val > 1 ? val : undefined
        }
    })
})

// Reset to page 1 when filters change
watch([searchQuery, activeBowType], () => {
    currentPage.value = 1
})

const archers = computed(() => {
    let rawData = archerResponse.value?.archers || archerResponse.value?.data || archerResponse.value
    let archersData = []

    if (Array.isArray(rawData)) {
        archersData = rawData
    } else if (rawData && typeof rawData === 'object') {
        archersData = Array.isArray(rawData.data) ? rawData.data :
            Array.isArray(rawData.archers) ? rawData.archers : []
    }

    if (archersData.length === 0 && !searchQuery.value) {
        archersData = dummyArchers
    }

    return archersData.map(archer => ({
        ...archer,
        uuid: archer.uuid || archer.id,
        slug: archer.slug,
        full_name: archer.full_name,
        athlete_code: archer.athlete_code,
        city: archer.city,
        province: archer.province,
        bow_type: archer.bow_type || 'recurve',
        photo_url: archer.photo_url || archer.avatar_url,
        club_name: archer.club_name,
        total_events: archer.total_events || 0
    }))
})

const totalArchers = computed(() => {
    if (archerResponse.value) {
        return archerResponse.value.total || archers.value.length
    }
    return dummyArchers.length
})

const activeArchers = computed(() => {
    return archerResponse.value?.total || 0
})

// Since we moved filtering to serverside, filteredArchers is just archers
const filteredArchers = computed(() => archers.value)
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
