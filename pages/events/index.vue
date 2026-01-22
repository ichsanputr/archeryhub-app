<template>
    <div class="min-h-screen bg-background-light font-body text-navy">
        <!-- Hero Section: List Events -->
        <div class="bg-navy relative overflow-hidden">
            <div class="absolute inset-0 z-0">
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-transparent z-10"></div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24">
                <div class="max-w-3xl">
                    <h1
                        class="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-4">
                        Semua Event Panahan
                    </h1>
                    <p class="text-gray-300 text-lg md:text-xl mb-8 leading-relaxed">
                        Temukan dan daftar event panahan seru di seluruh Indonesia. Dari kompetisi lokal hingga turnamen nasional, semua ada di sini.
                    </p>
                </div>
            </div>
        </div>

        <!-- Main Layout -->
        <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar: Filters -->
                <aside class="w-full lg:w-80 flex-shrink-0 space-y-6">
                    <!-- Search -->
                    <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-navy font-bold text-lg mb-4 flex items-center gap-2">
                            <Icon icon="ph:magnifying-glass" />
                            Cari Event
                        </h3>
                        <div class="relative">
                            <Icon icon="ph:magnifying-glass"
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input v-model="searchQuery"
                                class="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-navy placeholder:text-gray-400"
                                placeholder="Cari nama event..." type="text" />
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="text-navy font-bold text-lg flex items-center gap-2">
                                <Icon icon="ph:funnel" />
                                Filter
                            </h3>
                            <BaseButton variant="ghost" size="sm">Reset</BaseButton>
                        </div>
                        <div class="divide-y divide-gray-100">
                            <!-- Category Filter -->
                            <details class="group" open>
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                                    <span>Kategori</span>
                                    <Icon icon="ph:caret-down" class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="text-gray-600 px-5 pb-5 text-sm space-y-3">
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input checked class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span class="group-hover/item:text-navy transition-colors">National
                                            Series</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span class="group-hover/item:text-navy transition-colors">Regional Open</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span class="group-hover/item:text-navy transition-colors">Club
                                            Invitationals</span>
                                    </label>
                                </div>
                            </details>
                            <!-- Status Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                                    <span>Status</span>
                                    <Icon icon="ph:caret-down" class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="text-gray-600 px-5 pb-5 text-sm space-y-3">
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Upcoming</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Live Now</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Past Events</span>
                                    </label>
                                </div>
                            </details>
                            <!-- Division Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-5 text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                                    <span>Divisi</span>
                                    <Icon icon="ph:caret-down" class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="text-gray-600 px-5 pb-5 text-sm space-y-3">
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Recurve</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Compound</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer">
                                        <input class="h-4 w-4 rounded border-gray-300 text-navy focus:ring-navy"
                                            type="checkbox" />
                                        <span>Barebow</span>
                                    </label>
                                </div>
                            </details>
                        </div>
                    </div>
                </aside>

                <!-- Main Content: Tournament Grid -->
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-2xl font-bold text-navy">Semua Event <span
                                class="text-gray-400 font-normal text-lg ml-2">({{ filteredTournaments.length }})</span>
                        </h2>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-gray-500 hidden sm:inline">Urutin:</span>
                            <select v-model="sortBy"
                                class="border-none bg-white text-sm font-medium text-navy rounded-lg shadow-sm py-2 pl-3 pr-8 focus:ring-navy cursor-pointer">
                                <option value="newest">Waktu: Paling Baru</option>
                                <option value="oldest">Waktu: Terlama</option>
                                <option value="name">Nama: A-Z</option>
                            </select>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoading" class="text-center py-20">
                        <div class="flex flex-col items-center gap-4">
                            <div class="h-12 w-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                            <p class="text-gray-500 font-medium">Memuat event...</p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!isLoading && filteredTournaments.length === 0" class="text-center py-20">
                        <div class="bg-white rounded-2xl border border-gray-100 p-12 max-w-md mx-auto shadow-sm">
                            <div class="h-24 w-24 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-6">
                                <Icon icon="ph:calendar-x" class="text-5xl text-gray-300" />
                            </div>
                            <h3 class="text-2xl font-black text-navy mb-3">Belum Ada Event</h3>
                            <p class="text-gray-500 mb-8 leading-relaxed">
                                Saat ini belum ada event panahan yang tersedia. Cek kembali nanti atau hubungi penyelenggara untuk informasi lebih lanjut.
                            </p>
                            <div v-if="searchQuery" class="flex justify-center">
                                <BaseButton variant="outline" @click="searchQuery = ''">
                                    Hapus Pencarian
                                </BaseButton>
                            </div>
                        </div>
                    </div>

                    <!-- Grid -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <NuxtLink v-for="tournament in filteredTournaments" :key="tournament.slug || tournament.id"
                            :to="`/events/${tournament.slug || tournament.id}`"
                            class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                            <div class="relative h-48 overflow-hidden">
                                <img :alt="tournament.name"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    :src="tournament.image" />
                            </div>
                            <div class="p-5 flex-1 flex flex-col">
                                <h3
                                    class="text-lg font-bold text-navy mb-2 leading-snug group-hover:text-primary-hover transition-colors">
                                    {{ tournament.name }}
                                </h3>
                                <div class="space-y-2 mb-6">
                                    <div class="flex items-start gap-2 text-gray-500 text-sm">
                                        <Icon icon="ph:calendar-blank" class="text-lg mt-0.5" />
                                        <span>{{ tournament.date }}</span>
                                    </div>
                                    <div class="flex items-start gap-2 text-gray-500 text-sm">
                                        <Icon icon="ph:map-pin" class="text-lg mt-0.5" />
                                        <span class="truncate">{{ tournament.location }}</span>
                                    </div>
                                </div>
                                <div class="mt-auto">
                                    <BaseButton variant="primary" block iconRight="ph:arrow-right">
                                        Lihat
                                    </BaseButton>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- Pagination -->
                    <div v-if="!isLoading && filteredTournaments.length > 0" class="mt-12 flex justify-center">
                        <BaseButton variant="outline" size="lg" iconRight="ph:caret-down">
                            Tampilin Lagi
                        </BaseButton>
                    </div>
                </div>
            </div>
        </main>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'

const searchQuery = ref('')
const sortBy = ref('newest')
const isLoading = ref(true)

const { get } = useApi()

const tournaments = ref([])

// Transform API response to match expected format
const transformEventData = (event) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'TBA'
        const date = new Date(dateStr)
        return date.toLocaleDateString('id-ID', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatDateRange = (startDate, endDate) => {
        if (!startDate) return 'TBA'
        if (!endDate) return formatDate(startDate)
        
        const start = new Date(startDate)
        const end = new Date(endDate)
        
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}`
        }
        
        return `${formatDate(startDate)} - ${formatDate(endDate)}`
    }

    return {
        id: event.uuid || event.id,
        slug: event.slug || event.uuid || event.id,
        name: event.name || 'Event Tanpa Nama',
        date: formatDateRange(event.start_date, event.end_date),
        location: event.venue || event.location || 'Lokasi TBA',
        status: event.status || 'upcoming',
        category: event.discipline_name || event.category || null,
        image: event.logo_url || event.banner_url || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'
    }
}

const fetchEvents = async () => {
    isLoading.value = true
    try {
        const response = await get('/events')
        
        // Handle different response structures
        let eventsData = []
        if (Array.isArray(response)) {
            eventsData = response
        } else if (response?.events && Array.isArray(response.events)) {
            eventsData = response.events
        } else if (response?.data && Array.isArray(response.data)) {
            eventsData = response.data
        }
        
        tournaments.value = eventsData.map(transformEventData)
    } catch (error) {
        console.error('Failed to fetch events:', error)
        tournaments.value = []
    } finally {
        isLoading.value = false
    }
}

const filteredTournaments = computed(() => {
    let result = tournaments.value
    if (searchQuery.value) {
        result = result.filter(t => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    }
    if (sortBy.value === 'newest') {
        result = [...result].sort((a, b) => new Date(b.date.split(' - ')[0]) - new Date(a.date.split(' - ')[0]))
    } else if (sortBy.value === 'oldest') {
        result = [...result].sort((a, b) => new Date(a.date.split(' - ')[0]) - new Date(b.date.split(' - ')[0]))
    } else if (sortBy.value === 'name') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
})

onMounted(() => {
    fetchEvents()
})

useSeoMeta({
    title: 'Semua Event - Archeryhub.id',
    description: 'Cari dan daftar event panahan seru di seluruh Indonesia.'
})

definePageMeta({
    layout: 'landing'
})
</script>

