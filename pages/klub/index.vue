<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section
            class="bg-gradient-to-br from-navy via-navy to-blue-900 text-white py-16 md:py-24 relative overflow-hidden">
            <div class="absolute inset-0 opacity-20">
                <img src="https://images.unsplash.com/photo-1565992441121-4367c2967103?w=1600"
                    class="w-full h-full object-cover mix-blend-overlay" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent"></div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-2xl">
                    <div class="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-widest mb-4">
                        <Icon icon="ph:users-three" class="text-lg" />
                        <span>Komunitas Panahan</span>
                    </div>
                    <h1 class="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
                        Temukan <span class="text-primary">Klub Panahan</span><br />
                        di Indonesia
                    </h1>
                    <p class="text-gray-300 text-lg leading-relaxed max-w-lg">
                        Bergabunglah dengan klub panahan terdekat dan jadilah bagian dari komunitas pemanah Indonesia.
                    </p>
                </div>
            </div>
        </section>

        <!-- Search & Filter Bar -->
        <section class="sticky top-16 z-20 bg-white border-b border-gray-200 shadow-sm">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
                    <!-- Search -->
                    <div class="relative w-full md:w-96">
                        <Icon icon="ph:magnifying-glass"
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input v-model="searchQuery" type="text" placeholder="Cari nama klub atau lokasi..."
                            class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm" />
                    </div>

                    <!-- Filters -->
                    <div class="flex items-center gap-3 overflow-x-auto no-scrollbar">
                        <button v-for="loc in locations" :key="loc.value" @click="activeLocation = loc.value" :class="[
                            'px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all',
                            activeLocation === loc.value
                                ? 'bg-navy text-white shadow-lg'
                                : 'text-gray-600 hover:bg-gray-100'
                        ]">
                            {{ loc.label }}
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Clubs Grid -->
        <section class="container mx-auto px-4 max-w-7xl py-12">
            <!-- Stats -->
            <div class="flex items-center justify-between mb-8">
                <p class="text-gray-500 font-medium">
                    Menampilkan <span class="font-bold text-navy">{{ filteredClubs.length }}</span> klub
                </p>
                <div class="flex items-center gap-2">
                    <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="viewMode === 'grid' ? 'bg-gray-100' : ''" @click="viewMode = 'grid'">
                        <Icon icon="ph:squares-four" class="text-xl text-gray-600" />
                    </button>
                    <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        :class="viewMode === 'list' ? 'bg-gray-100' : ''" @click="viewMode = 'list'">
                        <Icon icon="ph:list" class="text-xl text-gray-600" />
                    </button>
                </div>
            </div>

            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="club in filteredClubs" :key="club.id" :to="`/klub/${club.slug}`"
                    class="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all">

                    <!-- Club Banner -->
                    <div class="relative h-40 bg-gradient-to-br from-navy to-blue-800 overflow-hidden">
                        <img v-if="club.bannerUrl" :src="club.bannerUrl"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                        <!-- Verified Badge -->
                        <div v-if="club.verified" class="absolute top-4 right-4">
                            <span
                                class="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                <Icon icon="ph:seal-check-fill" />
                                Verified
                            </span>
                        </div>
                    </div>

                    <!-- Logo & Info -->
                    <div class="relative px-5 pb-5">
                        <div class="flex items-end gap-4 -mt-8">
                            <!-- Logo -->
                            <div
                                class="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex-shrink-0">
                                <div v-if="!club.logoUrl"
                                    class="w-full h-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center">
                                    <span class="text-xl font-black text-navy">{{ club.name.charAt(0) }}</span>
                                </div>
                                <img v-else :src="club.logoUrl" class="w-full h-full object-cover" />
                            </div>

                            <div class="flex-1 min-w-0 pt-2">
                                <h3
                                    class="font-bold text-navy text-lg truncate group-hover:text-primary transition-colors">
                                    {{ club.name }}</h3>
                                <div class="flex items-center gap-1 text-gray-400 text-sm">
                                    <Icon icon="ph:map-pin" />
                                    <span class="truncate">{{ club.city }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Stats -->
                        <div class="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
                            <div class="text-center">
                                <p class="text-xl font-bold text-navy">{{ club.memberCount }}</p>
                                <p class="text-xs text-gray-400 font-medium">Anggota</p>
                            </div>
                            <div class="text-center">
                                <p class="text-xl font-bold text-navy">{{ club.eventCount }}</p>
                                <p class="text-xs text-gray-400 font-medium">Event</p>
                            </div>
                            <div class="text-center">
                                <div class="flex items-center justify-center gap-1">
                                    <Icon icon="ph:star-fill" class="text-amber-400" />
                                    <p class="text-xl font-bold text-navy">{{ club.rating }}</p>
                                </div>
                                <p class="text-xs text-gray-400 font-medium">Rating</p>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- Empty State -->
            <div v-if="filteredClubs.length === 0" class="text-center py-20">
                <div class="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Icon icon="ph:users-three" class="text-4xl text-gray-300" />
                </div>
                <h3 class="text-xl font-bold text-navy mb-2">Klub Tidak Ditemukan</h3>
                <p class="text-gray-500">Coba ubah filter atau kata kunci pencarian.</p>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="bg-navy py-16">
            <div class="container mx-auto px-4 max-w-7xl">
                <div
                    class="bg-gradient-to-r from-primary to-amber-400 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 class="text-3xl font-black text-navy mb-2">Punya Klub Panahan?</h2>
                        <p class="text-navy/70 text-lg">Daftarkan klub Anda dan jangkau lebih banyak pemanah.</p>
                    </div>
                    <NuxtLink to="/auth/register?type=club">
                        <BaseButton variant="navy" size="lg" icon="ph:plus-bold">
                            Daftarkan Klub
                        </BaseButton>
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
]

// Dummy clubs data
const clubs = ref([
    {
        id: 1,
        name: 'Garuda Archery Club',
        slug: 'garuda-archery',
        city: 'Jakarta Selatan',
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
        bannerUrl: null,
        logoUrl: null,
        verified: false,
        memberCount: 18,
        eventCount: 3,
        rating: 4.3
    },
    {
        id: 6,
        name: 'Depok Archery Team',
        slug: 'depok-archery',
        city: 'Depok',
        bannerUrl: null,
        logoUrl: null,
        verified: false,
        memberCount: 15,
        eventCount: 2,
        rating: 4.2
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
