<template>
    <div class="min-h-screen bg-background-light font-body text-navy">
        <!-- Hero Section: List Events -->
        <div class="bg-navy relative overflow-hidden py-16 md:py-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-sm font-bold  tracking-widest mb-6">
                        <Icon icon="ph:calendar-bold" class="text-lg" />
                        <span>Event Panahan</span>
                    </div>
                    <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                        Temukan <span class="text-primary">Target</span><br />
                        Kemenanganmu
                    </h1>
                    <p class="text-white/90 text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                        Ikuti berbagai turnamen panahan bergengsi di seluruh Indonesia. Dari tingkat klub hingga
                        nasional, semua tersedia dalam satu platform.
                    </p>
                    <div class="flex flex-wrap gap-4">
                        <NuxtLink to="/auth/register?type=organizer">
                            <BaseButton variant="primary" size="lg" icon="ph:plus-circle-bold"
                                class="shadow-sm shadow-primary/20 font-black">
                                Daftarkan Event
                            </BaseButton>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Layout -->
        <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-16 -mt-10 relative z-30">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar: Filters -->
                <aside class="w-full lg:w-80 flex-shrink-0 space-y-6">
                    <!-- Search -->
                    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 class="text-navy font-bold text-lg mb-4 flex items-center gap-2">
                            <Icon icon="ph:magnifying-glass-bold" class="text-primary" />
                            Cari Event
                        </h3>
                        <div class="relative">
                            <Icon icon="ph:magnifying-glass"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input v-model="searchQuery"
                                class="w-full pl-12 pr-4 py-3 bg-gray-50 border-gray-100 rounded-xl text-sm focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                placeholder="Cari nama event..." type="text" />
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="text-navy font-bold text-lg flex items-center gap-2">
                                <Icon icon="ph:funnel-bold" class="text-primary" />
                                Filter
                            </h3>
                            <button @click="resetFilters"
                                class="text-sm font-bold text-gray-400 hover:text-primary transition-colors">Reset</button>
                        </div>
                        <div class="divide-y divide-gray-100">
                            <!-- Status Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-sm text-navy hover:bg-gray-50 transition-colors">
                                    <span>Status</span>
                                    <Icon icon="ph:caret-down-bold"
                                        class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="px-6 pb-6 text-sm space-y-4">
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input
                                            class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                                            type="checkbox" />
                                        <span
                                            class="font-bold text-gray-600 group-hover/item:text-navy transition-colors">Upcoming</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input
                                            class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                                            type="checkbox" />
                                        <span
                                            class="font-bold text-gray-600 group-hover/item:text-navy transition-colors">Live
                                            Now</span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input
                                            class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                                            type="checkbox" />
                                        <span
                                            class="font-bold text-gray-600 group-hover/item:text-navy transition-colors">Past
                                            Events</span>
                                    </label>
                                </div>
                            </details>
                        </div>
                    </div>
                </aside>

                <!-- Main Content: Tournament Grid -->
                <div class="flex-1">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <h2 class="text-2xl font-black text-navy flex items-center gap-3">
                            Semua Event
                            <span class="px-3 py-1 bg-gray-100 text-gray-400 font-bold text-sm rounded-full">{{
                                filteredTournaments.length }}</span>
                        </h2>
                        <div class="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                            <span class="text-xs font-black text-gray-400  tracking-wider ml-2">Urutan:</span>
                            <select v-model="sortBy"
                                class="border-none bg-transparent text-sm font-bold text-navy py-1.5 pl-2 pr-8 focus:ring-0 cursor-pointer">
                                <option value="newest">Paling Baru</option>
                                <option value="oldest">Terlama</option>
                                <option value="name">Nama A-Z</option>
                            </select>
                        </div>
                    </div>

                    <!-- Loading State -->
                    <div v-if="isLoading"
                        class="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div class="flex flex-col items-center gap-6">
                            <div class="relative h-16 w-16">
                                <div class="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                                <div
                                    class="absolute inset-0 border-4 border-primary border-t-transparent animate-spin rounded-full">
                                </div>
                            </div>
                            <p class="text-gray-500 font-bold tracking-tight">Mencari event seru untuk Anda...</p>
                        </div>
                    </div>

                    <!-- Empty State -->
                    <div v-else-if="!isLoading && filteredTournaments.length === 0" class="text-center py-20">
                        <Icon icon="ph:calendar-x-light" class="text-7xl text-gray-200 mb-6 mx-auto" />
                        <h3 class="text-2xl font-black text-navy mb-3">Belum Ada Event</h3>
                        <p class="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                            Coba ubah pencarian atau filter Anda untuk menemukan event yang tersedia.
                        </p>
                        <BaseButton v-if="searchQuery" variant="primary" @click="searchQuery = ''"
                            class="shadow-sm shadow-primary/20">
                            Hapus Pencarian
                        </BaseButton>
                    </div>

                    <!-- Grid -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <NuxtLink v-for="tournament in filteredTournaments" :key="tournament.slug || tournament.id"
                            :to="`/events/${tournament.slug || tournament.id}`"
                            class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-primary/50 transition-all duration-500 flex flex-col h-full">
                            <div class="relative h-52 overflow-hidden bg-gray-100">
                                <img :alt="tournament.name"
                                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    :src="tournament.image" />
                                <div class="absolute top-4 left-4">
                                    <span
                                        class="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-navy text-[10px] font-black rounded-lg  tracking-wider shadow-sm">
                                        {{ tournament.category || 'Open' }}
                                    </span>
                                </div>
                            </div>
                            <div class="p-6 flex-1 flex flex-col">
                                <h3
                                    class="text-lg font-black text-navy mb-2 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                    {{ tournament.name }}
                                </h3>
                                <div class="space-y-3 mb-8">
                                    <div class="flex items-center gap-3 text-gray-500">
                                        <div
                                            class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center transition-colors">
                                            <Icon icon="ph:calendar-blank-bold" class="text-lg transition-colors" />
                                        </div>
                                        <span class="text-xs font-bold">{{ tournament.date }}</span>
                                    </div>
                                    <div class="flex items-center gap-3 text-gray-500">
                                        <div
                                            class="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center transition-colors">
                                            <Icon icon="ph:map-pin-bold" class="text-lg transition-colors" />
                                        </div>
                                        <span class="text-xs font-bold truncate">{{ tournament.location }}</span>
                                    </div>
                                </div>
                                <div class="mt-auto">
                                    <BaseButton variant="primary" block size="lg" iconRight="ph:arrow-right-bold"
                                        class="shadow-sm group-hover:shadow-sm group-hover:shadow-primary/20 transition-all">
                                        Detail Event
                                    </BaseButton>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>

                    <!-- Pagination -->
                    <div v-if="!isLoading && filteredTournaments.length > 0" class="mt-16 flex justify-center">
                        <BaseButton variant="outline" size="lg" icon="ph:caret-down-bold" class="rounded-xl px-10">
                            Lihat Lebih Banyak
                        </BaseButton>
                    </div>
                </div>
            </div>
        </main>

        <!-- CTA Section -->
        <section
            class="py-12 md:py-16 bg-gradient-to-br from-primary via-amber-400 to-yellow-400 relative overflow-hidden">
            <div class="absolute inset-0 opacity-10">
                <div class="absolute top-0 right-0 w-96 h-96 bg-navy rounded-full blur-3xl"></div>
                <div class="absolute bottom-0 left-0 w-96 h-96 bg-navy rounded-full blur-3xl"></div>
            </div>
            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-10">
                    <div class="text-center md:text-left">
                        <h2 class="text-2xl md:text-3xl font-black text-navy mb-3 tracking-tight">Punya Event Panahan?
                        </h2>
                        <p class="text-navy/70 text-sm sm:text-base font-bold max-w-xl leading-relaxed">Daftarkan event
                            Anda di Archeryhub.id dan kelola pendaftaran serta scoring dengan lebih profesional.</p>
                    </div>
                    <NuxtLink to="/auth/register?type=organizer">
                        <button
                            class="px-8 py-4 bg-navy hover:bg-navy-light text-white font-black rounded-xl transition-all shadow-sm shadow-navy/20 flex items-center gap-3 text-lg group">
                            <Icon icon="ph:plus-circle-bold"
                                class="text-xl group-hover:rotate-90 transition-transform duration-500" />
                            Buat Event Sekarang
                        </button>
                    </NuxtLink>
                </div>
            </div>
        </section>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const config = useRuntimeConfig()
const searchQuery = ref('')
const sortBy = ref('newest')

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

        if (start.getTime() === end.getTime() || start.toDateString() === end.toDateString()) {
            return formatDate(startDate)
        }

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
        category: event.location_type || event.category || null,
        organizer: event.organizer_name || event.organizer || 'Penyelenggara',
        organizer_logo: useImageOrDefault(event.organizer_avatar_url || event.organizer_logo || null),
        image: useImageOrDefault(event.logo_url || event.banner_url)
    }
}

const { data: eventResponse, pending: isLoading } = await useAsyncData('events', () =>
    $fetch(`${config.public.apiBaseUrl}/events`),
    { server: true }
)

const tournaments = computed(() => {
    let eventsData = []
    const response = eventResponse.value
    if (Array.isArray(response)) {
        eventsData = response
    } else if (response?.events && Array.isArray(response.events)) {
        eventsData = response.events
    } else if (response?.data && Array.isArray(response.data)) {
        eventsData = response.data
    }

    return eventsData.map(transformEventData)
})

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

const resetFilters = () => {
    searchQuery.value = ''
    sortBy.value = 'newest'
}

const scrollToContent = () => {
    window.scrollTo({
        top: window.innerHeight * 0.7,
        behavior: 'smooth'
    })
}

useHead({
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: 'Semua Event - Archeryhub.id',
    description: 'Cari dan daftar event panahan seru di seluruh Indonesia.'
})

definePageMeta({
    layout: 'landing'
})
</script>
