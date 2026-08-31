<template>
    <div class="min-h-screen bg-background-light font-body text-navy">
        <!-- Hero Section: List Events -->
        <div class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
                </div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-sm font-bold tracking-widest mb-6">
                        <Icon icon="ph:calendar-bold" class="text-base sm:text-lg" />
                        <span>{{ $t('events_page.badge') }}</span>
                    </div>
                    <h1
                        class="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6"
                        v-html="$t('events_page.title')">
                    </h1>
                    <p class="text-white/90 text-sm md:text-lg leading-relaxed max-w-xl">
                        {{ $t('events_page.description') }}
                    </p>
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
                            {{ $t('events_page.search_title') }}
                        </h3>
                        <div class="relative">
                            <Icon icon="ph:magnifying-glass"
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                            <input v-model="searchQuery"
                                class="w-full pl-12 pr-4 py-3 bg-gray-50 border-gray-100 rounded-xl text-sm focus:ring-4 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                                :placeholder="$t('events_page.search_placeholder')" type="text" />
                        </div>

                        <!-- Active Filter Chips -->
                        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-50">
                            <span v-for="status in selectedStatuses" :key="status"
                                class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-navy rounded-full text-xs font-bold border border-primary/20">
                                <span>{{ $t(`events_page.status_${status}`) }}</span>
                                <button @click="removeStatusFilter(status)" class="hover:text-red-500 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </span>
                            <span v-if="selectedCountry"
                                class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-navy rounded-full text-xs font-bold border border-primary/20">
                                <span>{{ selectedCountry }}</span>
                                <button @click="selectedCountry = ''" class="hover:text-red-500 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </span>
                            <span v-if="selectedCity"
                                class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-navy rounded-full text-xs font-bold border border-primary/20">
                                <span>{{ selectedCity }}</span>
                                <button @click="selectedCity = ''" class="hover:text-red-500 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </span>
                            <span v-if="selectedCategory"
                                class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-navy rounded-full text-xs font-bold border border-primary/20">
                                <span>{{ selectedCategory }}</span>
                                <button @click="selectedCategory = ''" class="hover:text-red-500 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </span>
                            <span v-if="selectedOrganizer"
                                class="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-navy rounded-full text-xs font-bold border border-primary/20">
                                <span>{{ selectedOrganizer }}</span>
                                <button @click="selectedOrganizer = ''" class="hover:text-red-500 transition-colors">
                                    <Icon icon="ph:x-bold" />
                                </button>
                            </span>
                        </div>
                    </div>

                    <!-- Filters -->
                    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 class="text-navy font-bold text-lg flex items-center gap-2">
                                <Icon icon="ph:funnel-bold" class="text-primary" />
                                {{ $t('events_page.filter_title') }}
                            </h3>
                            <button @click="resetFilters"
                                class="text-sm font-bold text-gray-400 hover:text-primary transition-colors">
                                {{ $t('events_page.reset_button') }}
                            </button>
                        </div>
                        <div class="divide-y divide-gray-100">
                            <!-- Status Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-sm text-navy hover:bg-gray-50 transition-colors">
                                    <span>{{ $t('events_page.status') }}</span>
                                    <Icon icon="ph:caret-down-bold"
                                        class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="px-6 pb-6 text-sm space-y-4">
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input v-model="selectedStatuses" value="upcoming"
                                            class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                                            type="checkbox" />
                                        <span
                                            class="font-bold text-gray-600 group-hover/item:text-navy transition-colors">
                                            {{ $t('events_page.status_upcoming') }}
                                        </span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input v-model="selectedStatuses" value="ongoing"
                                            class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                                            type="checkbox" />
                                        <span
                                            class="font-bold text-gray-600 group-hover/item:text-navy transition-colors">
                                            {{ $t('events_page.status_ongoing') }}
                                        </span>
                                    </label>
                                    <label class="flex items-center gap-3 cursor-pointer group/item">
                                        <input v-model="selectedStatuses" value="completed"
                                            class="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary shadow-sm"
                                            type="checkbox" />
                                        <span
                                            class="font-bold text-gray-600 group-hover/item:text-navy transition-colors">
                                            {{ $t('events_page.status_completed') }}
                                        </span>
                                    </label>
                                </div>
                            </details>

                            <!-- Country Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-sm text-navy hover:bg-gray-50 transition-colors">
                                    <span>{{ $t('events_page.country') }}</span>
                                    <Icon icon="ph:caret-down-bold"
                                        class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="px-6 pb-6">
                                    <BaseSelect v-model="selectedCountry" :options="countrySelectOptions" class="w-full text-xs" />
                                </div>
                            </details>

                            <!-- City Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-sm text-navy hover:bg-gray-50 transition-colors">
                                    <span>{{ $t('events_page.city') }}</span>
                                    <Icon icon="ph:caret-down-bold"
                                        class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="px-6 pb-6">
                                    <BaseSelect v-model="selectedCity" :options="citySelectOptions" class="w-full text-xs" />
                                </div>
                            </details>

                            <!-- Category Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-sm text-navy hover:bg-gray-50 transition-colors">
                                    <span>{{ $t('events_page.category') }}</span>
                                    <Icon icon="ph:caret-down-bold"
                                        class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="px-6 pb-6">
                                    <BaseSelect v-model="selectedCategory" :options="categorySelectOptions" class="w-full text-xs" />
                                </div>
                            </details>

                            <!-- Organizer Filter -->
                            <details class="group">
                                <summary
                                    class="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-sm text-navy hover:bg-gray-50 transition-colors">
                                    <span>{{ $t('events_page.organizer') }}</span>
                                    <Icon icon="ph:caret-down-bold"
                                        class="transition group-open:rotate-180 text-gray-400" />
                                </summary>
                                <div class="px-6 pb-6">
                                    <BaseSelect v-model="selectedOrganizer" :options="organizerSelectOptions" class="w-full text-xs" />
                                </div>
                            </details>
                        </div>
                    </div>
                </aside>

                <!-- Main Content: Tournament Grid -->
                <div class="flex-1">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <h2 class="text-lg sm:text-2xl font-black text-navy flex items-center gap-3">
                            {{ $t('events_page.all_events') }}
                            <span class="px-3 py-1 bg-gray-100 text-gray-400 font-bold text-sm rounded-full">
                                {{ filteredTournaments.length }}
                            </span>
                        </h2>
                        <div class="flex items-center gap-2 sm:gap-3 bg-white p-2 rounded-xl border border-gray-100 shadow-sm shrink-0">
                            <span class="text-xs font-black text-gray-400 tracking-wider ml-2 whitespace-nowrap shrink-0">{{ $t('events_page.sort_by') }}:</span>
                            <BaseSelect v-model="sortBy" :options="sortSelectOptions" class="w-44 text-xs shrink-0" />
                        </div>
                    </div>

                    <Transition name="fade" mode="out-in">
                        <EventsListSkeleton v-if="isLoading" key="skeleton" />

                        <!-- Empty State -->
                        <div v-else-if="!isLoading && filteredTournaments.length === 0" key="empty"
                            class="text-center py-20">
                            <Icon icon="ph:calendar-x-light" class="text-7xl text-gray-200 mb-6 mx-auto" />
                            <h3 class="text-2xl font-black text-navy mb-3">{{ $t('events_page.no_events') }}</h3>
                            <p class="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                                {{ $t('events_page.no_events_desc') }}
                            </p>
                            <BaseButton v-if="searchQuery" variant="primary" @click="searchQuery = ''"
                                class="shadow-sm shadow-primary/20">
                                {{ $t('events_page.clear_search') }}
                            </BaseButton>
                        </div>

                        <!-- Grid -->
                        <div v-else key="content" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <NuxtLink v-for="tournament in filteredTournaments.slice(0, displayedLimit)"
                                :key="tournament.slug || tournament.id"
                                :to="localePath(`/events/${tournament.slug || tournament.id}`)"
                                class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:border-primary/50 transition-all duration-500 flex flex-col h-full">
                                <div class="relative h-52 overflow-hidden bg-gray-100">
                                    <img :alt="tournament.name"
                                        class="w-full h-full object-cover transition-transform duration-700"
                                        :src="tournament.image" />
                                    <div class="absolute top-4 left-4">
                                        <span
                                            class="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-navy text-[10px] font-black rounded-lg tracking-wider shadow-sm">
                                            {{ tournament.category || $t('events_page.general_category') }}
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
                                                class="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center transition-colors shadow-sm">
                                                <Icon icon="ph:calendar-blank-bold" class="text-lg" />
                                            </div>
                                            <span class="text-xs font-bold text-gray-600">{{ tournament.date }}</span>
                                        </div>
                                        <div class="flex items-center gap-3 text-gray-500">
                                            <div
                                                class="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center transition-colors shadow-sm">
                                                <Icon icon="ph:map-pin-bold" class="text-lg" />
                                            </div>
                                            <span class="text-xs font-bold text-gray-600 truncate">{{ tournament.location }}</span>
                                        </div>
                                    </div>
                                    <div class="mt-auto">
                                        <BaseButton variant="primary" block size="lg" iconRight="ph:arrow-right-bold"
                                            class="shadow-sm group-hover:shadow-sm group-hover:shadow-primary/20 transition-all">
                                            {{ $t('events_page.event_detail') }}
                                        </BaseButton>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>
                    </Transition>

                    <!-- Pagination -->
                    <div v-if="!isLoading && displayedLimit < filteredTournaments.length"
                        class="mt-16 flex justify-center">
                        <BaseButton variant="outline" size="lg" icon="ph:caret-down-bold" class="rounded-xl px-10"
                            @click="displayedLimit += 6">
                            {{ $t('events_page.view_more') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </main>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const api = useApi()
const searchQuery = ref('')
const sortBy = ref('newest')
const selectedCity = ref('')
const selectedCountry = ref('')
const selectedCategory = ref('')
const selectedOrganizer = ref('')
const selectedStatuses = ref([])
const displayedLimit = ref(6)

const { t } = useI18n()
const localePath = useLocalePath()

// Transform API response to match expected format
const transformEventData = (event) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Tanggal belum ditentukan'
        const date = new Date(dateStr)
        return date.toLocaleDateString('id-ID', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const formatDateRange = (startDate, endDate) => {
        if (!startDate) return 'Tanggal belum ditentukan'
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
        startDate: event.start_date || null,
        date: formatDateRange(event.start_date, event.end_date),
        location: event.venue || event.location || event.city || 'Lokasi belum ditentukan',
        city: event.city || '',
        country: event.organizer_country || 'Indonesia',
        status: event.status || 'upcoming',
        category: event.location_type || event.category || null,
        organizer: event.organizer_name || event.organizer || 'Penyelenggara',
        organizer_logo: useImageOrDefault(event.organizer_avatar_url || event.organizer_logo || null),
        image: useImageOrDefault(event.logo_url || event.banner_url)
    }
}

const { data: eventResponse, pending: isLoading } = await useAsyncData('events', () =>
    api.get('/events'),
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

const cityOptions = computed(() =>
    Array.from(new Set(tournaments.value.map(t => t.city).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id-ID'))
)

const countryOptions = computed(() =>
    Array.from(new Set(tournaments.value.map(t => t.country).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id-ID'))
)

const categoryOptions = computed(() =>
    Array.from(new Set(tournaments.value.map(t => t.category).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id-ID'))
)

const organizerOptions = computed(() =>
    Array.from(new Set(tournaments.value.map(t => t.organizer).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'id-ID'))
)

const countrySelectOptions = computed(() => [
    { title: t('events_page.all_countries') || 'Semua Negara', value: '' },
    ...countryOptions.value.map(c => ({ title: c, value: c }))
])

const citySelectOptions = computed(() => [
    { title: t('events_page.all_cities') || 'Semua Kota', value: '' },
    ...cityOptions.value.map(c => ({ title: c, value: c }))
])

const categorySelectOptions = computed(() => [
    { title: t('events_page.all_categories_filter') || 'Semua Kategori', value: '' },
    ...categoryOptions.value.map(c => ({ title: c, value: c }))
])

const organizerSelectOptions = computed(() => [
    { title: t('events_page.all_organizers_filter') || 'Semua Penyelenggara', value: '' },
    ...organizerOptions.value.map(o => ({ title: o, value: o }))
])

const sortSelectOptions = computed(() => [
    { title: t('events_page.sort_newest') || 'Terbaru', value: 'newest' },
    { title: t('events_page.sort_oldest') || 'Terlama', value: 'oldest' },
    { title: t('events_page.sort_name') || 'Nama Event', value: 'name' },
])

const hasActiveFilters = computed(() =>
    selectedStatuses.value.length > 0 ||
    selectedCountry.value ||
    selectedCity.value ||
    selectedCategory.value ||
    selectedOrganizer.value
)

const removeStatusFilter = (status) => {
    selectedStatuses.value = selectedStatuses.value.filter(s => s !== status)
}

const filteredTournaments = computed(() => {
    let result = tournaments.value
    if (searchQuery.value) {
        result = result.filter(t => t.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
    }
    if (selectedCity.value) {
        result = result.filter(t => t.city === selectedCity.value)
    }
    if (selectedCountry.value) {
        result = result.filter(t => t.country === selectedCountry.value)
    }
    if (selectedCategory.value) {
        result = result.filter(t => t.category === selectedCategory.value)
    }
    if (selectedOrganizer.value) {
        result = result.filter(t => t.organizer === selectedOrganizer.value)
    }
    if (selectedStatuses.value.length > 0) {
        result = result.filter(t => selectedStatuses.value.includes(t.status))
    }
    if (sortBy.value === 'newest') {
        result = [...result].sort((a, b) => new Date(b.startDate || 0) - new Date(a.startDate || 0))
    } else if (sortBy.value === 'oldest') {
        result = [...result].sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
    } else if (sortBy.value === 'name') {
        result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
})

const resetFilters = () => {
    searchQuery.value = ''
    selectedCity.value = ''
    selectedCountry.value = ''
    selectedCategory.value = ''
    selectedOrganizer.value = ''
    selectedStatuses.value = []
    sortBy.value = 'newest'
}

const scrollToContent = () => {
    window.scrollTo({
        top: window.innerHeight * 0.7,
        behavior: 'smooth'
    })
}

useHead({
    title: computed(() => `${t('events_page.all_events', 'All Events')} - ArcheryHub`),
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ]
})

useSeoMeta({
    title: () => `${t('events_page.all_events')} - Archeris.net`,
    description: () => t('events_page.description')
})

definePageMeta({
    layout: 'landing'
})
</script>
