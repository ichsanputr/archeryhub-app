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
                class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
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
                        <span class="font-bold text-navy">{{ filteredClubs.length }}</span> klub ditemukan
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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="club in filteredClubs" :key="club.id" :to="`/klub/${club.slug}`"
                    class="group bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-primary transition-all duration-300">

                    <!-- Club Banner -->
                    <div class="relative h-44 bg-gradient-to-br from-navy to-blue-800 overflow-hidden">
                        <img v-if="club.bannerUrl" :src="club.bannerUrl"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                        </div>

                        <!-- Verified Badge -->
                        <div v-if="club.verified" class="absolute top-4 right-4">
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
                                {{ club.city }}
                            </span>
                        </div>
                    </div>

                    <!-- Club Info -->
                    <div class="p-5">
                        <div class="flex items-start gap-4">
                            <!-- Logo -->
                            <div
                                class="w-14 h-14 -mt-7 rounded-xl bg-white border-2 border-white shadow-xl overflow-hidden flex-shrink-0 relative z-[2]">
                                <div v-if="!club.logoUrl"
                                    class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                                    <span class="text-xl font-black text-navy">{{ club.name.charAt(0) }}</span>
                                </div>
                                <img v-else :src="club.logoUrl" class="w-full h-full object-cover" />
                            </div>

                            <div class="flex-1 min-w-0 pt-1">
                                <h3
                                    class="font-black text-navy text-lg truncate group-hover:text-primary transition-colors">
                                    {{ club.name }}</h3>
                                <p class="text-gray-400 text-sm">{{ club.description?.slice(0, 50) }}...</p>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:users-bold" class="text-primary" />
                                <span class="font-black text-navy text-sm">{{ club.memberCount }}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <Icon icon="ph:star-fill" class="text-amber-400" />
                                <span class="font-black text-navy text-sm">{{ club.rating }}</span>
                            </div>
                            <div class="flex items-center gap-1 text-right">
                                <Icon icon="ph:trophy-bold" class="text-primary" />
                                <span class="font-black text-navy text-sm">{{ club.eventCount }}</span>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-if="filteredClubs.length === 0" class="text-center py-20">
                <div class="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-6">
                    <Icon icon="ph:users-three" class="text-5xl text-gray-300" />
                </div>
                <h3 class="text-2xl font-black text-navy mb-3">Klub Tidak Ditemukan</h3>
                <p class="text-gray-500 max-w-md mx-auto">Coba ubah filter atau kata kunci pencarian untuk menemukan
                    klub yang sesuai.</p>
            </div>
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

const searchQuery = ref('')
const activeLocation = ref('all')
const viewMode = ref('grid')

const locations = [
    { label: 'Semua', value: 'all' },
    { label: 'Jakarta', value: 'jakarta' },
    { label: 'Bandung', value: 'bandung' },
    { label: 'Surabaya', value: 'surabaya' },
    { label: 'Yogyakarta', value: 'yogyakarta' },
    { label: 'Bali', value: 'bali' },
]

// Dummy clubs data
const clubs = ref([
    {
        id: 1,
        name: 'Garuda Archery Club',
        slug: 'garuda-archery',
        city: 'Jakarta Selatan',
        description: 'Klub panahan profesional dengan fasilitas lengkap dan pelatih bersertifikat internasional.',
        bannerUrl: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800',
        logoUrl: null,
        verified: true,
        memberCount: 45,
        eventCount: 12,
        rating: 4.9
    },
    {
        id: 2,
        name: 'Bandung Archery Center',
        slug: 'bandung-archery',
        city: 'Bandung',
        description: 'Pusat pelatihan panahan terbesar di Jawa Barat dengan lapangan indoor dan outdoor.',
        bannerUrl: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800',
        logoUrl: null,
        verified: true,
        memberCount: 38,
        eventCount: 8,
        rating: 4.7
    },
    {
        id: 3,
        name: 'Surabaya Bowman',
        slug: 'surabaya-bowman',
        city: 'Surabaya',
        description: 'Komunitas pemanah Surabaya yang aktif dalam berbagai kompetisi nasional.',
        bannerUrl: 'https://images.unsplash.com/photo-1510925758641-869d353cecc7?w=800',
        logoUrl: null,
        verified: false,
        memberCount: 22,
        eventCount: 5,
        rating: 4.5
    },
    {
        id: 4,
        name: 'Yogyakarta Arrow Club',
        slug: 'yogya-arrow',
        city: 'Yogyakarta',
        description: 'Klub panahan tradisional yang menggabungkan teknik modern dengan budaya lokal.',
        bannerUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=800',
        logoUrl: null,
        verified: true,
        memberCount: 31,
        eventCount: 7,
        rating: 4.8
    },
    {
        id: 5,
        name: 'Jakarta Traditional Archery',
        slug: 'jakarta-traditional',
        city: 'Jakarta Barat',
        description: 'Fokus pada panahan tradisional Indonesia dengan berbagai jenis busur.',
        bannerUrl: null,
        logoUrl: null,
        verified: false,
        memberCount: 18,
        eventCount: 3,
        rating: 4.3
    },
    {
        id: 6,
        name: 'Bali Archery Academy',
        slug: 'bali-archery',
        city: 'Denpasar',
        description: 'Akademi panahan dengan pemandangan alam Bali yang menakjubkan.',
        bannerUrl: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800',
        logoUrl: null,
        verified: true,
        memberCount: 28,
        eventCount: 6,
        rating: 4.6
    },
])

const filteredClubs = computed(() => {
    return clubs.value.filter(club => {
        const matchesSearch = club.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            club.city.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesLocation = activeLocation.value === 'all' ||
            club.city.toLowerCase().includes(activeLocation.value.toLowerCase())
        return matchesSearch && matchesLocation
    })
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
