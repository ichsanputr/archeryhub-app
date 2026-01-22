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

                    <!-- Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <NuxtLink v-for="tournament in filteredTournaments" :key="tournament.slug"
                            :to="`/events/${tournament.slug}`"
                            class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col h-full">
                            <div class="relative h-48 overflow-hidden">
                                <!-- Labels Removed -->
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
                    <div class="mt-12 flex justify-center">
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

// Fallback sample data
const sampleTournaments = [
    { slug: 'surabaya-archery-cup-2024', name: 'Surabaya Archery Cup 2024', date: 'Nov 10 - 13, 2024', location: 'KONI Jatim Field, Surabaya', status: 'live', category: 'National Series', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJXWL-Z7f7fP24_IyBjI_e-q_jYcMbzRtaKiOpKP8TxgqwSxRrCqNcE-GXJXbiCEv6rlwlNJzTmbbgAdQFWHH4Jk_Fw-aslTiT3Qezy8bbmGRG0WoRA-yD8tykZuxYObytzJ6Yf7yNL8poFU6vWlyEuFjbHcIzwfoLAMru-bfdw4GXezmv71SwRPYw_-Ct6ZP3f6AqglpvBIhCSrp9g13uTQpj69_-hzZqp1wSqJJ-9PdZqp0CYWgFWsajdRos9QmU7eeyuFhFPH0' },
    { slug: 'indonesian-open-2024', name: 'Indonesian Open Championship 2024', date: 'Nov 12 - 15, 2024', location: 'GBK Archery Field, Jakarta', status: 'upcoming', category: 'Grade A', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o' },
    { slug: 'bali-international-open', name: 'Bali International Open', date: 'Dec 01 - 05, 2024', location: 'Denpasar Archery Center, Bali', status: 'upcoming', category: 'Grade A', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmKeu4qLnuI8uJ8itXirIGY311f6c_CfhqFD3qtMv-M4oTNDiSeGeylyU0qI_7lQHeMywtfdDw175-dWrdxwZwWSnnEMmkBca4ScW0dEbBQ_wZYVWuCaOPI-A204QdKHKXQxHsutHbZP8c9uPaZpfK8lzqziHTAW_dqnlmi99AtLhIGmxfUZ-irvcNm1YUswSsH9HGhvq4Hr6jq7rsveM4HwMmhNVDABEGcgh0sYQHoHy9t1IzkTX2LexV72X240IEyZL2_InQGZ8' },
    { slug: 'jogja-youth-championship', name: 'Jogja Youth Championship', date: 'Dec 15 - 17, 2024', location: 'UNY Sports Complex, Yogyakarta', status: 'upcoming', category: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaKz9i1Sy4TPWgHSZRQZdfbE9FAsY4xikvvu2rhp8s_A9V5Sy5lv8pftyxQXwQSSv1xbdCGZkIqVOv_3u8sisf-kuW8CCXnYrzldx8xKkp12tmxF1SztarFv2PQMwoYr5sv7cn1wpmzOMepJof7lZkvTkOqS_LS94B-kyA-HRdMFPaNXbC-I6OY9Rp2dTCI-86cqoGMepWYeLPECuEvPwH35G_RyrcW4OoeB-xFCH1noe3E3mLKFdU_ftNYNRJ-e35YW_UO7tjW3E' },
    { slug: 'bandung-indoor-classic', name: 'Bandung Indoor Classic', date: 'Oct 20 - 22, 2024', location: 'GOR Pajajaran, Bandung', status: 'finished', category: null, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCq8OlQbcxO7uY4gwKVt6JygaktR4FjGZfJwbWiOyDIXqXr0bCnQIn3f-5m63myglDTGxdrpDHrFX2wVGOC7C8INtL7td4RDrpYhrJi0qjxPG7jixXi-Cw0fJQfRMda9sgJhfzCsFLmMhX9mvC6_gNAo5OF_MDtU5ukfm3hvRqWuHC0pbxNqSd0uWfIxLjxHXmyDnRtFg9VIz-XC2tCuvSusJKEFLjs57_DO7_uOGurALxGKsxcgIJmc_0gHV72A6BGvhiStIpWr3o' },
    { slug: 'borneo-archery-festival', name: 'Borneo Archery Festival', date: 'Jan 10 - 14, 2025', location: 'Balikpapan Sports Center', status: 'upcoming', category: 'Club', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQStrrmLQN-DtqrTO5KWNF3EvwOXSw-raemHMh-lxMUVAtHiqxHNMqzQoV2l1ReELlRe_dVIAkp1P8Bc8ekRqbhOn-axS6izTQXKw3d70pq-CpZHWUZoS58mGL70U_Bk96ViNRcaOaGr5wIkPrtg8w46mzrAtHgWRH6VKAUalmkrFJ8qjDltkmd-nHJs4aUfrBBphZSnivwOkhoIjzG8dpjeCtp_UOZTOnovXJP7IAWJEeWqw7Uh7-mlLVkorgyeOsSRun6CmO_8I' },
]

const tournaments = ref([])

// Transform API response to match expected format
const transformEventData = (event) => ({
    slug: event.slug || event.id,
    name: event.name || event.title,
    date: event.start_date 
        ? `${new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(event.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
        : event.date || 'TBA',
    location: event.venue || event.location || 'TBA',
    status: event.status || 'upcoming',
    category: event.category,
    image: event.banner_url || event.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuByxS8LZ93pBQXI_V_Vu3nB0633lwPZGiFCM3UtI-xk79b_O83ASmlHYA36lOzcnmVsbgs4DEe9awj543MvzCN1yzOo1wZ3ViXLdiMRV7vAMdy66lvu-l5dpFAOgZ0uCMKJxsBRXPJL1QeX4_ZdX2ynTEZR-ZMilrncma7gKG2YK0vsj0KJZnw_lD0UZaXFKW2aVFD1SU-mzi_sAT2D-62TP0j5LF6KprFriv2sV9rdypqLSvfrZekYDy45XaK8F1vVh7e5nfrgK7o'
})

const fetchEvents = async () => {
    isLoading.value = true
    try {
        const response = await get('/events')
        if (response && Array.isArray(response)) {
            tournaments.value = response.map(transformEventData)
        } else if (response?.data && Array.isArray(response.data)) {
            tournaments.value = response.data.map(transformEventData)
        } else {
            // Use sample data as fallback
            tournaments.value = sampleTournaments
        }
    } catch (error) {
        console.error('Failed to fetch events:', error)
        tournaments.value = sampleTournaments
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

