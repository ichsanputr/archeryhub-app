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
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-sm font-bold uppercase tracking-widest mb-6">
                        <Icon icon="ph:users-three-bold" class="text-lg" />
                        <span>Komunitas Pemanah</span>
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Temukan <span class="text-primary">Klub Panahan</span><br />
                        Terbaik di Indonesia
                    </h1>
                    <p class="text-white/90 text-lg md:text-xl leading-relaxed max-w-xl">
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
                <NuxtLink v-for="club in clubs" :key="club.uuid" :to="`/clubs/${club.slug}`"
                    class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col pt-8">

                    <!-- Club Logo Section -->
                    <div class="flex justify-center mb-6 px-5">
                        <div
                            class="w-28 h-28 rounded-2xl bg-gray-50 border border-gray-100 p-0.5 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-500">
                            <img v-if="club.logo_url"
                                :src="club.logo_url.startsWith('http') ? club.logo_url : `${config.public.apiBaseUrl}${club.logo_url}`"
                                :alt="club.name" class="w-full h-full object-cover" />
                            <div v-else
                                class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                                <span class="text-3xl font-black text-navy">{{ club.name.charAt(0) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Club Info -->
                    <div class="px-6 pb-6 flex-1 flex flex-col">
                        <div class="text-center mb-6">
                            <h3
                                class="font-black text-navy text-xl leading-tight mb-1 group-hover:text-primary transition-colors">
                                {{ club.name }}
                            </h3>
                            <div
                                class="flex items-center justify-center gap-1.5 text-gray-400 text-sm font-bold uppercase tracking-wide">
                                <Icon icon="ph:map-pin-bold" class="text-primary" />
                                <span>{{ club.city || club.province || 'Indonesia' }}</span>
                            </div>
                        </div>

                        <!-- Extra Info -->
                        <div class="space-y-3 mb-6 flex-1">
                            <div v-if="club.phone" class="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <Icon icon="ph:phone-bold" class="text-primary" />
                                </div>
                                <span class="truncate">{{ club.phone }}</span>
                            </div>
                            <div v-if="club.social_instagram"
                                class="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <Icon icon="ph:instagram-logo-bold" class="text-primary" />
                                </div>
                                <span class="truncate">@{{ club.social_instagram }}</span>
                            </div>
                            <div v-else-if="club.member_count"
                                class="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                                    <Icon icon="ph:users-bold" class="text-primary" />
                                </div>
                                <span>{{ club.member_count }} Members</span>
                            </div>
                        </div>

                        <!-- Footer Actions -->
                        <div class="pt-5 border-t border-gray-50 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <div class="flex -space-x-2">
                                    <div v-for="i in 3" :key="i"
                                        class="w-6 h-6 rounded-full border-2 border-white bg-gray-200"></div>
                                </div>
                                <span class="text-[10px] font-black text-gray-400 uppercase tracking-wider">+{{
                                    club.member_count || 0 }} Join</span>
                            </div>
                            <div class="text-primary group-hover:translate-x-1 transition-transform">
                                <Icon icon="ph:arrow-right-bold" class="text-xl" />
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
                            class="px-6 py-3 bg-navy hover:bg-navy-light text-white font-black rounded-xl transition-all shadow-sm shadow-navy/30 flex items-center gap-3">
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
