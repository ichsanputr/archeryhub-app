<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden py-16 md:py-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-club.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-sm font-bold  tracking-widest mb-6">
                        <Icon icon="ph:users-three-bold" class="text-lg" />
                        <span>Komunitas Pemanah</span>
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Temukan <span class="text-primary">Klub Panahan</span><br />
                        Terbaik di Indonesia
                    </h1>
                    <p class="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl">
                        Bergabunglah dengan komunitas pemanah dan tingkatkan kemampuan bersama pelatih dan fasilitas
                        terbaik.
                    </p>

                    <!-- Search Bar -->
                    <div class="mt-10 flex flex-col sm:flex-row gap-4 max-w-xl">
                        <div class="relative flex-1">
                            <Icon icon="ph:magnifying-glass-bold"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input v-model="searchQuery" type="text" placeholder="Cari nama klub atau kota..."
                                class="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-navy font-medium placeholder:text-gray-400 focus:ring-4 focus:ring-primary/30 outline-none transition-all text-base" />
                        </div>
                        <button
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
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">{{ totalItems }}+</p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold  tracking-wide mt-1">Klub</p>
                </div>
                <div class="text-center border-l border-gray-100">
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">{{ stats?.totalArchers || '0' }}
                    </p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold  tracking-wide mt-1">Pemanah</p>
                </div>
                <div class="text-center border-l border-gray-100">
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">{{ stats?.activeEvents || '0' }}
                    </p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold  tracking-wide mt-1">Event</p>
                </div>
                <div class="text-center border-l border-gray-100">
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">34</p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold  tracking-wide mt-1">Provinsi</p>
                </div>
            </div>
        </section>

        <!-- Filter Bar -->
        <section class="container mx-auto px-4 max-w-7xl py-8">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <!-- Location Filters -->
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    <button v-for="loc in locations" :key="loc.value" @click="activeLocation = loc.value" :class="[
                        'px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2',
                        activeLocation === loc.value
                            ? 'bg-navy text-white border-navy shadow-lg shadow-navy/20'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-navy hover:text-navy'
                    ]">
                        {{ loc.label }}
                    </button>
                </div>

                <!-- View Toggle & Count -->
                <div class="flex items-center gap-4">
                    <p class="text-gray-500 text-sm font-medium">
                        <span class="font-bold text-navy">{{ totalItems }}</span> klub ditemukan
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

        <!-- Clubs Grid -->
        <section class="container mx-auto px-4 max-w-7xl pb-16">
            <div v-if="isLoading"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 pointer-events-none">
                <div v-for="i in 6" :key="i"
                    class="h-[400px] bg-white rounded-2xl border-2 border-gray-100 animate-pulse"></div>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="club in clubs" :key="club.uuid" :to="`/clubs/${club.slug}`"
                    class="group bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 transition-all duration-500 flex flex-col relative">

                    <!-- Decorative Banner Background -->
                    <div class="h-24 w-full bg-gradient-to-br from-navy-light to-navy relative overflow-hidden">
                        <div class="absolute inset-0 opacity-20">
                            <Icon icon="ph:target-bold"
                                class="text-white text-6xl absolute -right-4 -top-4 rotate-12" />
                            <Icon icon="ph:bow-arrow-bold"
                                class="text-white text-4xl absolute -left-2 -bottom-2 -rotate-12" />
                        </div>
                    </div>

                    <!-- Club Logo Section -->
                    <div class="flex justify-center -mt-12 mb-4 px-5 relative z-10">
                        <div
                            class="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-md overflow-hidden group-hover:scale-105 transition-transform duration-500">
                            <img v-if="club.logo_url" :src="getImageUrl(club.logo_url)" :alt="club.name"
                                class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full bg-primary flex items-center justify-center">
                                <span class="text-2xl font-black text-primary-text">{{ club.name.charAt(0) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Club Info -->
                    <div class="px-6 pb-6 flex-1 flex flex-col text-center">
                        <h3
                            class="font-black text-navy text-xl leading-tight mb-1 group-hover:text-primary transition-colors">
                            {{ club.name }}
                        </h3>
                        <div
                            class="flex items-center justify-center gap-1.5 text-gray-500 text-xs font-bold  tracking-wider mb-6">
                            <Icon icon="ph:map-pin-bold" class="text-primary" />
                            <span>{{ club.city || club.province || 'Indonesia' }}</span>
                        </div>

                        <!-- Info Grid -->
                        <div class="grid grid-cols-2 gap-3 mb-6">
                            <div
                                class="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100">
                                <span class="text-[9px] font-black text-gray-400  tracking-widest mb-1">Anggota</span>
                                <span class="text-base font-black text-navy">{{ club.member_count || 0 }}</span>
                            </div>
                            <div
                                class="bg-gray-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-gray-100">
                                <span class="text-[9px] font-black text-gray-400  tracking-widest mb-1">Prestasi</span>
                                <span class="text-base font-black text-navy">{{ club.achievements || 0 }}</span>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div class="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="flex -space-x-2">
                                    <template v-if="club.member_avatars && club.member_avatars.length">
                                        <img v-for="(avatar, idx) in club.member_avatars" :key="idx"
                                            :src="getImageUrl(avatar)"
                                            class="w-7 h-7 rounded-full border-2 border-white bg-gray-100 object-cover" />
                                        <div v-if="club.member_count > 3"
                                            class="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                                            +{{ club.member_count - 3 }}
                                        </div>
                                    </template>
                                    <template v-else>
                                        <div v-for="i in 3" :key="i"
                                            class="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-gray-300">
                                            <Icon icon="ph:user-bold" class="text-xs" />
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div
                                class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-navy group-hover:bg-primary transition-all duration-300">
                                <Icon icon="ph:arrow-right-bold" class="text-lg" />
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-if="clubs.length === 0 && !isLoading" class="text-center py-20">
                <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Icon icon="ph:users-three" class="text-5xl text-gray-300" />
                </div>
                <h3 class="text-2xl font-black text-navy mb-3">Klub Tidak Ditemukan</h3>
                <p class="text-gray-500 max-w-md mx-auto">Coba ubah filter atau kata kunci pencarian untuk menemukan
                    klub yang sesuai.</p>
            </div>

            <!-- Pagination -->
            <BasePagination v-if="totalItems > itemsPerPage" :current-page="currentPage" :total-items="totalItems"
                :items-per-page="itemsPerPage" @change-page="handlePageChange" />
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'

definePageMeta({
    layout: 'landing'
})

const config = useRuntimeConfig()
const searchQuery = ref('')
const activeLocation = ref('all')
const viewMode = ref('grid')

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(9)

// Fetch dashboard stats
const { data: statsData } = await useAsyncData('dashboard-stats', () => {
    return $fetch(`${config.public.apiBaseUrl}/stats/dashboard`)
}, { server: true })

const stats = computed(() => statsData.value || {})

// Fetch data with useAsyncData for SSR support
const { data, pending: isLoading, refresh } = await useAsyncData('clubs', () => {
    const params = new URLSearchParams()
    params.append('page', currentPage.value.toString())
    params.append('limit', itemsPerPage.value.toString())
    if (searchQuery.value) params.append('q', searchQuery.value)
    if (activeLocation.value !== 'all') params.append('city', activeLocation.value)

    return $fetch(`${config.public.apiBaseUrl}/clubs?${params.toString()}`)
}, {
    watch: [currentPage, activeLocation, searchQuery],
    server: true
})

// Local refs for template (derived from data)
const clubs = computed(() => data.value?.data || [])
const totalItems = computed(() => data.value?.meta?.total_items || 0)

const locations = [
    { label: 'Semua', value: 'all' },
    { label: 'Jakarta', value: 'jakarta' },
    { label: 'Bandung', value: 'bandung' },
    { label: 'Surabaya', value: 'surabaya' },
    { label: 'Yogyakarta', value: 'yogyakarta' },
    { label: 'Bali', value: 'bali' },
]

const handlePageChange = (page) => {
    currentPage.value = page
    window.scrollTo({ top: 400, behavior: 'smooth' })
}

// Helper function to get image URL (handles double /api/v1 issue)
const getImageUrl = (url) => {
    // Backend now provides full URLs, so just return as-is
    if (!url) return ''
    return url
}

// Watch filters to reset page
watch([searchQuery, activeLocation], () => {
    currentPage.value = 1
})
useHead({
    title: 'Temukan Klub Panahan - Archeryhub.id',
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    meta: [
        { name: 'description', content: 'Cari dan bergabunglah dengan klub panahan terbaik di seluruh Indonesia.' }
    ]
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
