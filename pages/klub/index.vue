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
                        <Icon icon="ph:users-three-bold" class="text-lg" />
                        <span>Komunitas Pemanah</span>
                    </div>
                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
                        Temukan <span class="text-primary">Klub Panahan</span><br />
                        Terbaik di Indonesia
                    </h1>
                    <p class="text-gray-300 text-lg md:text-xl leading-relaxed max-w-xl">
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
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">120+</p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wide mt-1">Klub</p>
                </div>
                <div class="text-center border-l border-gray-100">
                    <p class="text-2xl md:text-4xl font-black text-navy tracking-tight">2.5k+</p>
                    <p class="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-wide mt-1">Anggota</p>
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
                <NuxtLink v-for="club in clubs" :key="club.uuid" :to="`/klub/${club.slug}`"
                    class="group bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-primary transition-all duration-300">

                    <!-- Club Banner -->
                    <div class="relative h-44 bg-gradient-to-br from-navy to-blue-800 overflow-hidden">
                        <img v-if="club.banner_url" :src="club.banner_url"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        </div>

                        <!-- Verified Badge -->
                        <div v-if="club.verification_status === 'verified'" class="absolute top-4 right-4">
                            <span
                                class="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white text-xs font-black rounded-full shadow-lg">
                                <Icon icon="ph:seal-check-fill" />
                                Verified
                            </span>
                        </div>

                        <!-- Location Badge -->
                        <div class="absolute bottom-4 left-4">
                            <span
                                class="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-navy text-xs font-bold rounded-full">
                                <Icon icon="ph:map-pin-fill" class="text-primary" />
                                {{ club.city || 'Indonesia' }}
                            </span>
                        </div>
                    </div>

                    <!-- Club Info -->
                    <div class="p-5">
                        <div class="flex items-start gap-4">
                            <!-- Logo -->
                            <div
                                class="w-14 h-14 -mt-7 rounded-xl bg-white border-2 border-white shadow-xl overflow-hidden flex-shrink-0 relative z-[2]">
                                <div v-if="!club.avatar_url"
                                    class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                                    <span class="text-xl font-black text-navy">{{ club.name.charAt(0) }}</span>
                                </div>
                                <img v-else :src="club.avatar_url" class="w-full h-full object-cover" />
                            </div>

                            <div class="flex-1 min-w-0 pt-1">
                                <h3
                                    class="font-black text-navy text-lg truncate group-hover:text-primary transition-colors">
                                    {{ club.name }}</h3>
                                <p class="text-gray-400 text-sm truncate">{{ club.province || 'Klub Panahan' }}</p>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:users-bold" class="text-primary" />
                                <span class="font-black text-navy text-sm">{{ club.member_count }} Members</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:star-fill" class="text-amber-400" />
                                <span class="font-black text-navy text-sm">4.8</span>
                            </div>
                            <div class="flex items-center gap-1 text-right">
                                <Icon icon="ph:trophy-bold" class="text-primary" />
                                <span class="font-black text-navy text-sm">PRO</span>
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

        <!-- CTA Section - Using gradient instead of navy for contrast with footer -->
        <section class="py-20 bg-gradient-to-br from-primary via-amber-400 to-yellow-400 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 right-0 w-96 h-96 bg-navy rounded-full blur-3xl"></div>
                <div class="absolute bottom-0 left-0 w-96 h-96 bg-navy rounded-full blur-3xl"></div>
            </div>
            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div class="text-center md:text-left">
                        <h2 class="text-3xl md:text-4xl font-black text-navy mb-3">Punya Klub Panahan?</h2>
                        <p class="text-navy/70 text-lg max-w-md">Daftarkan klub Anda di Archeryhub.id dan jangkau lebih
                            banyak pemanah berbakat.</p>
                    </div>
                    <NuxtLink to="/auth/register?type=club">
                        <button
                            class="px-10 py-4 bg-navy hover:bg-navy-light text-white font-black rounded-xl transition-all shadow-xl shadow-navy/30 flex items-center gap-3 text-lg">
                            <Icon icon="ph:plus-bold" />
                            Daftarkan Klub
                        </button>
                    </NuxtLink>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

definePageMeta({
    layout: 'landing'
})

const { get } = useApi()

const searchQuery = ref('')
const activeLocation = ref('all')
const viewMode = ref('grid')

// Pagination & API state
const clubs = ref([])
const currentPage = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(9)
const isLoading = ref(false)

const locations = [
    { label: 'Semua', value: 'all' },
    { label: 'Jakarta', value: 'jakarta' },
    { label: 'Bandung', value: 'bandung' },
    { label: 'Surabaya', value: 'surabaya' },
    { label: 'Yogyakarta', value: 'yogyakarta' },
    { label: 'Bali', value: 'bali' },
]

const fetchClubs = async () => {
    isLoading.value = true
    try {
        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value
        }

        if (searchQuery.value) {
            params.q = searchQuery.value
        }

        if (activeLocation.value !== 'all') {
            params.city = activeLocation.value
        }

        const response = await get('/clubs', { query: params })
        if (response.data) {
            clubs.value = response.data
            totalItems.value = response.meta.total_items
        }
    } catch (error) {
        console.error('Failed to fetch clubs:', error)
    } finally {
        isLoading.value = false
    }
}

// Watchers for filters
watch([searchQuery, activeLocation], () => {
    currentPage.value = 1
    fetchClubs()
})

// Watcher for page changes
watch(currentPage, () => {
    fetchClubs()
})

onMounted(() => {
    fetchClubs()
})

const handlePageChange = (page) => {
    currentPage.value = page
    window.scrollTo({ top: 400, behavior: 'smooth' })
}
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
