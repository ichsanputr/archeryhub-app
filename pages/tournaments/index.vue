<template>
    <div class="bg-background-light font-body text-navy min-h-screen">
        <!-- Hero Section (Consistent Archeris Design, Restored Chip, Clean English) -->
        <div class="bg-navy relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16 text-white">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event.jpeg" alt="Tournaments Hero" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent"></div>
            </div>

            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Breadcrumb -->
                <div class="mb-4">
                    <Breadcrumbs :items="[{ label: 'Home', path: '/' }]" current="Tournaments" class="!text-slate-300" />
                </div>

                <div class="max-w-3xl space-y-4">
                    <!-- Restored Chip Above H1 -->
                    <!-- Page Title -->
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight font-display">
                        Find Upcoming Archery Tournaments
                    </h1>
                    <p class="text-slate-300 text-sm sm:text-base font-normal leading-relaxed max-w-2xl">
                        Discover national championships, regional qualifiers, club matches, and official Ianseo tournament archives.
                    </p>
                </div>
            </div>
        </div>

        <!-- Filter & Search Toolbar (Sticky, Modern Dual-Row UX) -->
        <div class="sticky top-0 sm:top-14 md:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
                <!-- Top Row: Source Tabs, Search, Status & Sort -->
                <div class="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    
                    <!-- Segmented Source Switcher Tabs -->
                    <div class="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200/70 overflow-x-auto no-scrollbar shrink-0">
                        <button
                            @click="selectedSourceType = 'all'"
                            :class="[
                                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
                                selectedSourceType === 'all'
                                    ? 'bg-white text-navy shadow-xs font-bold'
                                    : 'text-slate-600 hover:text-navy'
                            ]"
                        >
                            <span>All Tournaments</span>
                            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-mono" :class="selectedSourceType === 'all' ? 'bg-slate-100 text-navy' : 'bg-slate-200/70 text-slate-500'">
                                {{ allTournaments.length }}
                            </span>
                        </button>

                        <button
                            @click="selectedSourceType = 'platform'"
                            :class="[
                                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
                                selectedSourceType === 'platform'
                                    ? 'bg-white text-navy shadow-xs font-bold'
                                    : 'text-slate-600 hover:text-navy'
                            ]"
                        >
                            <span>Platform Events</span>
                            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-mono" :class="selectedSourceType === 'platform' ? 'bg-slate-100 text-navy' : 'bg-slate-200/70 text-slate-500'">
                                {{ internalTournaments.length }}
                            </span>
                        </button>

                        <button
                            @click="selectedSourceType = 'ianseo'"
                            :class="[
                                'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer',
                                selectedSourceType === 'ianseo'
                                    ? 'bg-white text-navy shadow-xs font-bold'
                                    : 'text-slate-600 hover:text-navy'
                            ]"
                        >
                            <span>Ianseo Archives</span>
                            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-mono" :class="selectedSourceType === 'ianseo' ? 'bg-slate-100 text-navy' : 'bg-slate-200/70 text-slate-500'">
                                {{ externalTournaments.length }}
                            </span>
                        </button>
                    </div>

                    <!-- Search Input & Filters -->
                    <div class="flex items-center gap-2.5 w-full md:w-auto">
                        <!-- Search Box -->
                        <div class="relative flex-1 md:w-72">
                            <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            <input
                                v-model="searchQuery"
                                type="text"
                                placeholder="Search tournaments or venues..."
                                class="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy placeholder:text-slate-400 focus:bg-white focus:border-navy focus:outline-hidden transition-colors"
                            />
                            <button
                                v-if="searchQuery"
                                @click="searchQuery = ''"
                                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy text-xs cursor-pointer"
                            >
                                <Icon icon="ph:x-circle-fill" />
                            </button>
                        </div>

                        <!-- Status Filter Dropdown -->
                        <div class="relative shrink-0" v-click-outside="() => statusDropdownOpen = false">
                            <button
                                @click="statusDropdownOpen = !statusDropdownOpen"
                                class="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-navy flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                                <Icon icon="ph:funnel" class="text-slate-500 text-sm" />
                                <span class="hidden sm:inline">Status</span>
                                <span v-if="selectedStatuses.length" class="w-4 h-4 rounded-full bg-navy text-white text-[10px] font-mono flex items-center justify-center">
                                    {{ selectedStatuses.length }}
                                </span>
                                <Icon icon="ph:caret-down" class="text-xs text-slate-400" />
                            </button>

                            <!-- Dropdown Menu -->
                            <div
                                v-if="statusDropdownOpen"
                                class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 space-y-1"
                            >
                                <label
                                    v-for="st in availableStatuses"
                                    :key="st.value"
                                    class="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-xl cursor-pointer text-xs text-navy font-medium select-none"
                                >
                                    <input
                                        type="checkbox"
                                        :value="st.value"
                                        v-model="selectedStatuses"
                                        class="rounded text-navy focus:ring-navy border-slate-300 w-3.5 h-3.5 cursor-pointer"
                                    />
                                    <span>{{ st.label }}</span>
                                </label>
                                <div class="pt-1 border-t border-slate-100 flex justify-between px-1">
                                    <button @click="selectedStatuses = []" class="text-[11px] text-slate-500 hover:text-navy font-medium cursor-pointer">Clear</button>
                                    <button @click="statusDropdownOpen = false" class="text-[11px] text-navy font-bold cursor-pointer">Apply</button>
                                </div>
                            </div>
                        </div>

                        <!-- Sort By Selector (Custom Modern Dropdown) -->
                        <div class="relative shrink-0" v-click-outside="() => sortDropdownOpen = false">
                            <button
                                type="button"
                                @click="sortDropdownOpen = !sortDropdownOpen"
                                class="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-navy flex items-center gap-2 transition-colors cursor-pointer select-none"
                            >
                                <Icon icon="ph:sort-ascending-bold" class="text-slate-500 text-sm" />
                                <span>{{ currentSortLabel }}</span>
                                <Icon :icon="sortDropdownOpen ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" class="text-[10px] text-slate-400" />
                            </button>

                            <div
                                v-if="sortDropdownOpen"
                                class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                            >
                                <button
                                    v-for="opt in sortSelectOptions"
                                    :key="opt.value"
                                    type="button"
                                    @click="sortBy = opt.value; sortDropdownOpen = false"
                                    :class="[
                                        'w-full px-3 py-2 rounded-xl text-xs text-left font-medium transition-all flex items-center justify-between cursor-pointer select-none',
                                        sortBy === opt.value ? 'bg-primary/20 text-navy font-bold' : 'text-slate-700 hover:bg-slate-50'
                                    ]"
                                >
                                    <div class="flex items-center gap-2 truncate">
                                        <Icon :icon="opt.icon" class="text-slate-400 text-sm shrink-0" />
                                        <span class="truncate">{{ opt.title }}</span>
                                    </div>
                                    <Icon v-if="sortBy === opt.value" icon="ph:check-bold" class="text-navy text-xs shrink-0" />
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Bottom Row: Interactive Country Filter Chips Bar -->
                <div v-if="countryOptions.length > 1" class="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <div class="flex items-center gap-1.5 text-xs font-bold text-slate-500 tracking-wider shrink-0 mr-1">
                        <Icon icon="ph:globe-hemisphere-west" class="text-sm text-slate-500" />
                        <span>Country:</span>
                    </div>

                    <div class="flex items-center gap-1.5 shrink-0">
                        <button
                            v-for="c in countryOptions"
                            :key="c.value"
                            @click="selectedCountry = c.value"
                            :class="[
                                'px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 border cursor-pointer select-none',
                                selectedCountry === c.value
                                    ? 'bg-navy text-white border-navy shadow-xs font-bold ring-2 ring-navy/10'
                                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200/90 hover:border-slate-300'
                            ]"
                        >
                            <Icon :icon="c.flagIcon" class="text-sm shrink-0" />
                            <span>{{ toTitleCase(c.label) }}</span>
                            <span
                                class="px-1.5 py-0.5 rounded-full text-[10px] font-mono leading-none"
                                :class="selectedCountry === c.value ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'"
                            >
                                {{ c.count }}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content Area -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            
            <!-- Result Count & Active Filter Tags Bar -->
            <div class="flex items-center justify-between gap-4 mb-6">
                <div class="text-xs text-slate-600 font-medium">
                    Showing <span class="font-bold text-navy">{{ filteredTournaments.length }}</span> tournaments
                    <span v-if="selectedCountry !== 'all'" class="ml-1 text-slate-400">
                        in <span class="font-semibold text-navy">{{ selectedCountry }}</span>
                    </span>
                </div>
                
                <button
                    v-if="hasActiveFilters"
                    @click="resetFilters"
                    class="text-xs font-semibold text-slate-500 hover:text-navy flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                    <Icon icon="ph:arrow-counter-clockwise" class="text-sm" />
                    <span>Reset Filters</span>
                </button>
            </div>

            <!-- Loading Skeleton -->
            <PublicCardSkeleton v-if="isLoading" :count="6" grid="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" />

            <!-- Empty State -->
            <div v-else-if="filteredTournaments.length === 0"
                class="w-full text-center py-16 sm:py-20 bg-white rounded-3xl border border-slate-200 shadow-xs p-8 sm:p-12 space-y-4">
                <div class="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
                    <Icon icon="ph:calendar-x" class="text-3xl text-slate-400" />
                </div>
                <h4 class="text-xl font-bold text-navy">No Tournaments Found</h4>
                <div class="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
                    Try changing your search query, country selection, or resetting filters to discover more archery tournaments.
                </div>
                <div class="pt-2">
                    <BaseButton variant="outline" size="sm" @click="resetFilters">
                        Reset Filters
                    </BaseButton>
                </div>
            </div>

            <!-- Unified Single Responsive Grid of Tournaments -->
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                <NuxtLink v-for="t in displayedTournaments"
                    :key="t.slug || t.id"
                    :to="`/tournaments/${t.slug || t.id}`"
                    class="group bg-white rounded-3xl shadow-xs border border-slate-200/90 overflow-hidden hover:border-slate-400 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">

                    <!-- CARD TYPE 1: PLATFORM TOURNAMENT (WITH THUMBNAIL) -->
                    <template v-if="!t.isExternal">
                        <!-- Card Banner Image -->
                        <div class="relative h-48 overflow-hidden bg-slate-900">
                            <img :alt="t.name"
                                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                :src="t.image" />
                            <div class="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent"></div>

                            <!-- Status Badge Top Left -->
                            <div class="absolute top-3.5 left-3.5 z-10">
                                <span class="px-3 py-1 bg-white text-navy font-bold text-xs rounded-xl shadow-xs">
                                    {{ getStatusLabel(t.status) }}
                                </span>
                            </div>

                            <!-- Date on Image Bottom Left -->
                            <div class="absolute bottom-3.5 left-3.5 right-3.5 flex items-center text-white text-xs font-semibold">
                                <div class="flex items-center gap-1.5 drop-shadow-sm">
                                    <Icon icon="ph:calendar-blank" class="text-primary text-sm shrink-0" />
                                    <span>{{ t.date }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Card Body -->
                        <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div>
                                <h3 class="text-base sm:text-lg font-bold text-navy leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2 font-display">
                                    {{ toTitleCase(t.name) }}
                                </h3>

                                <div class="flex items-center justify-between gap-2 text-slate-600 text-xs font-medium">
                                    <div class="flex items-start gap-1.5 min-w-0">
                                        <Icon icon="ph:map-pin" class="text-slate-400 text-sm shrink-0 mt-0.5" />
                                        <span class="truncate">{{ toTitleCase(t.location) }}</span>
                                    </div>
                                    <span v-if="t.country" class="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
                                        <Icon :icon="getCountryFlagIcon(t.country)" class="text-sm shrink-0" />
                                        <span>{{ toTitleCase(t.country) }}</span>
                                    </span>
                                </div>
                            </div>

                            <!-- Card Footer -->
                            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2 min-w-0">
                                    <img v-if="t.organizer_logo" :src="t.organizer_logo" :alt="t.organizer" class="w-5 h-5 rounded-full object-cover shrink-0 border border-slate-200" />
                                    <div v-else class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-navy shrink-0 font-bold text-[10px]">
                                        {{ t.organizer ? t.organizer.charAt(0).toUpperCase() : 'O' }}
                                    </div>
                                    <span class="text-xs text-slate-600 font-medium truncate">{{ toTitleCase(t.organizer) }}</span>
                                </div>

                                <div class="shrink-0 flex items-center gap-1 text-xs font-bold text-navy group-hover:text-primary transition-colors">
                                    <span>Details</span>
                                    <Icon icon="ph:arrow-right" />
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- CARD TYPE 2: IANSEO SCRAPED TOURNAMENT (DATA RICH, NO THUMBNAIL) -->
                    <template v-else>
                        <div class="p-6 flex-1 flex flex-col justify-between space-y-5">
                            <div class="space-y-3.5">
                                <!-- Top Badges -->
                                <div class="flex items-center justify-between gap-2">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-100 rounded-lg text-xs font-bold">
                                        <Icon icon="ph:seal-check-fill" class="text-sky-600 text-xs" />
                                        <span>Ianseo Verified</span>
                                    </span>

                                    <div class="flex items-center gap-2">
                                        <span v-if="t.country" class="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
                                            <Icon :icon="getCountryFlagIcon(t.country)" class="text-sm shrink-0" />
                                            <span>{{ toTitleCase(t.country) }}</span>
                                        </span>
                                        <span class="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                                            {{ getStatusLabel(t.status) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Tournament Title -->
                                <h3 class="text-base sm:text-lg font-bold text-navy leading-snug group-hover:text-primary transition-colors line-clamp-2 font-display">
                                    {{ toTitleCase(t.name) }}
                                </h3>

                                <!-- Date & Location -->
                                <div class="space-y-1.5 text-xs text-slate-600">
                                    <div class="flex items-center gap-2">
                                        <Icon icon="ph:calendar-blank" class="text-slate-400 text-sm shrink-0" />
                                        <span>{{ t.date }}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <Icon icon="ph:map-pin" class="text-slate-400 text-sm shrink-0" />
                                        <span class="truncate">{{ toTitleCase(t.location) }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Card Footer -->
                            <div class="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2 min-w-0">
                                    <div class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-navy shrink-0 font-bold text-[10px]">
                                        {{ t.organizer ? t.organizer.charAt(0).toUpperCase() : 'P' }}
                                    </div>
                                    <span class="text-xs text-slate-600 font-medium truncate">{{ toTitleCase(t.organizer) }}</span>
                                </div>

                                <div class="shrink-0 flex items-center gap-1 text-xs font-bold text-navy group-hover:text-primary transition-colors">
                                    <span>Details</span>
                                    <Icon icon="ph:arrow-right" />
                                </div>
                            </div>
                        </div>
                    </template>

                </NuxtLink>
            </div>

            <!-- Numbered Pagination Bar -->
            <div v-if="filteredTournaments.length > 0" class="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <!-- Info & Items Per Page Selector -->
                <div class="flex items-center gap-3 text-xs text-slate-600">
                    <span>
                        Showing <span class="font-bold text-navy">{{ paginationStart + 1 }}</span> to <span class="font-bold text-navy">{{ paginationEnd }}</span> of <span class="font-bold text-navy">{{ filteredTournaments.length }}</span> tournaments
                    </span>
                    <div class="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
                        <span class="text-slate-400">Show:</span>
                        <select
                            v-model="itemsPerPage"
                            class="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-navy cursor-pointer focus:outline-hidden"
                        >
                            <option :value="6">6</option>
                            <option :value="9">9</option>
                            <option :value="12">12</option>
                            <option :value="24">24</option>
                        </select>
                    </div>
                </div>

                <!-- Numbered Page Navigation Buttons -->
                <div v-if="totalPages > 1" class="flex items-center gap-1.5">
                    <!-- Prev Button -->
                    <button
                        @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 1"
                        class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-navy text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer select-none shadow-2xs"
                    >
                        <Icon icon="ph:caret-left" class="text-xs" />
                        <span class="hidden sm:inline">Prev</span>
                    </button>

                    <!-- Page Numbers -->
                    <template v-for="(p, i) in visiblePages" :key="i">
                        <span v-if="p === '...'" class="px-2 py-1 text-slate-400 text-xs select-none">...</span>
                        <button
                            v-else
                            @click="goToPage(p)"
                            :class="[
                                'w-8 h-8 rounded-xl text-xs font-semibold transition-all flex items-center justify-center select-none cursor-pointer',
                                currentPage === p
                                    ? 'bg-navy text-white shadow-xs font-bold'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs'
                            ]"
                        >
                            {{ p }}
                        </button>
                    </template>

                    <!-- Next Button -->
                    <button
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-navy text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1 cursor-pointer select-none shadow-2xs"
                    >
                        <span class="hidden sm:inline">Next</span>
                        <Icon icon="ph:caret-right" class="text-xs" />
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'
import PublicCardSkeleton from '~/components/common/PublicCardSkeleton.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'

definePageMeta({
    layout: 'landing'
})

const api = useApi()

// Filters state - Default to ianseo
const searchQuery = ref('')
const selectedSourceType = ref('ianseo') // 'all' | 'platform' | 'ianseo'
const selectedCountry = ref('all')
const selectedStatuses = ref([])
const sortBy = ref('newest')
const statusDropdownOpen = ref(false)
const sortDropdownOpen = ref(false)

const toTitleCase = (str) => {
    if (!str) return ''
    return String(str).toLowerCase().replace(/(?:^|\s|\/|-)\S/g, char => char.toUpperCase())
}

const COUNTRY_FLAG_ICONS = {
    'all': 'ph:globe-hemisphere-west',
    'indonesia': 'circle-flags:id',
    'ina': 'circle-flags:id',
    'malaysia': 'circle-flags:my',
    'mas': 'circle-flags:my',
    'singapore': 'circle-flags:sg',
    'sgp': 'circle-flags:sg',
    'thailand': 'circle-flags:th',
    'tha': 'circle-flags:th',
    'philippines': 'circle-flags:ph',
    'phi': 'circle-flags:ph',
    'vietnam': 'circle-flags:vn',
    'vnm': 'circle-flags:vn',
    'france': 'circle-flags:fr',
    'fra': 'circle-flags:fr',
    'italy': 'circle-flags:it',
    'ita': 'circle-flags:it',
    'turkey': 'circle-flags:tr',
    'tur': 'circle-flags:tr',
    'united states': 'circle-flags:us',
    'usa': 'circle-flags:us',
    'spain': 'circle-flags:es',
    'esp': 'circle-flags:es',
    'poland': 'circle-flags:pl',
    'pol': 'circle-flags:pl',
    'latvia': 'circle-flags:lv',
    'lat': 'circle-flags:lv',
    'ecuador': 'circle-flags:ec',
    'ecu': 'circle-flags:ec',
    'mexico': 'circle-flags:mx',
    'mex': 'circle-flags:mx',
    'korea': 'circle-flags:kr',
    'south korea': 'circle-flags:kr',
    'kor': 'circle-flags:kr',
    'japan': 'circle-flags:jp',
    'jpn': 'circle-flags:jp',
    'germany': 'circle-flags:de',
    'ger': 'circle-flags:de',
    'great britain': 'circle-flags:gb',
    'united kingdom': 'circle-flags:gb',
    'gbr': 'circle-flags:gb',
    'uk': 'circle-flags:gb',
    'australia': 'circle-flags:au',
    'aus': 'circle-flags:au',
    'china': 'circle-flags:cn',
    'chn': 'circle-flags:cn',
    'india': 'circle-flags:in',
    'ind': 'circle-flags:in'
}

function getCountryFlagIcon(countryName) {
    if (!countryName) return 'circle-flags:id'
    const key = String(countryName).toLowerCase().trim()
    return COUNTRY_FLAG_ICONS[key] || 'circle-flags:id'
}

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(9)

const availableStatuses = [
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'In Progress', value: 'ongoing' },
    { label: 'Completed', value: 'completed' },
]

const FLAG_MAP = {
    'all': '🌐',
    'indonesia': '🇮🇩',
    'ina': '🇮🇩',
    'france': '🇫🇷',
    'fra': '🇫🇷',
    'italy': '🇮🇹',
    'ita': '🇮🇹',
    'turkey': '🇹🇷',
    'tur': '🇹🇷',
    'united states': '🇺🇸',
    'usa': '🇺🇸',
    'spain': '🇪🇸',
    'esp': '🇪🇸',
    'poland': '🇵🇱',
    'pol': '🇵🇱',
    'latvia': '🇱🇻',
    'lat': '🇱🇻',
    'ecuador': '🇪🇨',
    'ecu': '🇪🇨',
    'mexico': '🇲🇽',
    'mex': '🇲🇽',
    'korea': '🇰🇷',
    'kor': '🇰🇷',
    'japan': '🇯🇵',
    'jpn': '🇯🇵',
    'germany': '🇩🇪',
    'ger': '🇩🇪',
    'great britain': '🇬🇧',
    'gbr': '🇬🇧',
    'malaysia': '🇲🇾',
    'mas': '🇲🇾',
    'singapore': '🇸🇬',
    'sgp': '🇸🇬',
    'thailand': '🇹🇭',
    'tha': '🇹🇭'
}

function getCountryFlag(countryName) {
    if (!countryName) return '🌐'
    const key = countryName.toLowerCase().trim()
    return FLAG_MAP[key] || '📍'
}

function getStatusLabel(status) {
    switch (status) {
        case 'upcoming': return 'Upcoming'
        case 'ongoing': return 'In Progress'
        case 'completed': return 'Completed'
        case 'canceled': return 'Canceled'
        default: return 'Active'
    }
}

function transformEventData(event, isExternal = false) {
    if (!event) {
        return {
            id: 'unknown',
            slug: 'unknown',
            isExternal,
            name: 'Untitled Tournament',
            date: 'Date TBA',
            location: 'Location TBA',
            country: 'Indonesia',
            status: 'upcoming',
            organizer: 'Organization',
            image: useImageOrDefault(null),
            participantsCount: 0,
            categoriesCount: 0
        }
    }

    const formatDateRange = (startDate, endDate) => {
        if (!startDate) return 'Date TBA'
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        const start = new Date(startDate)
        const end = endDate ? new Date(endDate) : null

        if (isNaN(start.getTime())) {
            return startDate
        }

        if (!end || isNaN(end.getTime()) || start.getTime() === end.getTime() || start.toDateString() === end.toDateString()) {
            return `${start.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`
        }

        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${start.getDate()} - ${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`
        }

        if (start.getFullYear() === end.getFullYear()) {
            return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${start.getFullYear()}`
        }

        return `${start.getDate()} ${months[start.getMonth()]} ${start.getFullYear()} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`
    }

    const slug = event.slug || event.uuid || event.id
    const country = event.country || (isExternal ? 'Indonesia' : 'Indonesia')

    return {
        id: event.uuid || event.id,
        slug,
        isExternal,
        sourcePlatform: event.source_platform || null,
        name: event.name || 'Untitled Tournament',
        startDate: event.start_date || null,
        date: formatDateRange(event.start_date, event.end_date),
        location: event.venue || event.location || event.city || 'Location TBA',
        country: country,
        city: event.city || '',
        status: event.status || (isExternal ? 'completed' : 'upcoming'),
        organizer: event.organizer_name || event.organizer || (isExternal ? 'Host Organization / Ianseo' : 'Tournament Host'),
        organizer_logo: useImageOrDefault(event.organizer_avatar_url || event.organizer_logo || null),
        image: useImageOrDefault(event.logo_url || event.banner_url),
        participantsCount: event.participants_count || 0,
        categoriesCount: event.categories_count || 0
    }
}

const { data: rawEventsData, pending: isLoading } = await useAsyncData('tournaments-unified', async () => {
    try {
        const [internalRes, externalRes] = await Promise.all([
            api.get('/tournaments').catch(() => ({ events: [] })),
            api.get('/tournaments/external').catch(() => ({ tournaments: [] }))
        ])
        const internalList = internalRes?.events || internalRes?.data || (Array.isArray(internalRes) ? internalRes : [])
        const externalList = externalRes?.tournaments || []
        return JSON.parse(JSON.stringify({
            internal: internalList,
            external: externalList
        }))
    } catch {
        return { internal: [], external: [] }
    }
}, { server: true })

const internalTournaments = computed(() => {
    const list = rawEventsData.value?.internal || []
    return list.map(e => transformEventData(e, false))
})

const externalTournaments = computed(() => {
    const list = rawEventsData.value?.external || []
    return list.map(e => transformEventData(e, true))
})

const allTournaments = computed(() => {
    return [...internalTournaments.value, ...externalTournaments.value]
})

// Dynamic Country Options computed from active tournament pool
const countryOptions = computed(() => {
    let baseList = allTournaments.value
    if (selectedSourceType.value === 'platform') {
        baseList = internalTournaments.value
    } else if (selectedSourceType.value === 'ianseo') {
        baseList = externalTournaments.value
    }

    const counts = {}
    baseList.forEach(t => {
        const c = t.country || 'Indonesia'
        counts[c] = (counts[c] || 0) + 1
    })

    const options = [
        { label: 'All Countries', value: 'all', flagIcon: 'ph:globe-hemisphere-west', count: baseList.length }
    ]

    Object.keys(counts).sort().forEach(country => {
        options.push({
            label: toTitleCase(country),
            value: country,
            flagIcon: getCountryFlagIcon(country),
            count: counts[country]
        })
    })

    return options
})

const sortSelectOptions = computed(() => [
    { title: 'Newest Date', value: 'newest', icon: 'ph:calendar-blank' },
    { title: 'Oldest Date', value: 'oldest', icon: 'ph:clock-clockwise' },
    { title: 'Tournament Name (A - Z)', value: 'name_asc', icon: 'ph:sort-ascending' },
    { title: 'Tournament Name (Z - A)', value: 'name_desc', icon: 'ph:sort-descending' },
    { title: 'Most Participants', value: 'participants', icon: 'ph:users' }
])

const currentSortLabel = computed(() => {
    const match = sortSelectOptions.value.find(o => o.value === sortBy.value)
    return match ? match.title : 'Sort By'
})

const hasActiveFilters = computed(() =>
    selectedStatuses.value.length > 0 ||
    Boolean(searchQuery.value) ||
    selectedCountry.value !== 'all' ||
    selectedSourceType.value !== 'all'
)

const filteredTournaments = computed(() => {
    let list = allTournaments.value
    if (selectedSourceType.value === 'platform') {
        list = internalTournaments.value
    } else if (selectedSourceType.value === 'ianseo') {
        list = externalTournaments.value
    }

    if (selectedCountry.value !== 'all') {
        list = list.filter(t => (t.country || '').toLowerCase() === selectedCountry.value.toLowerCase())
    }

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        list = list.filter(t => t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q))
    }
    if (selectedStatuses.value.length > 0) {
        list = list.filter(t => selectedStatuses.value.includes(t.status))
    }
    if (sortBy.value === 'newest') {
        list = [...list].sort((a, b) => new Date(b.startDate || 0).getTime() - new Date(a.startDate || 0).getTime())
    } else if (sortBy.value === 'oldest') {
        list = [...list].sort((a, b) => new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime())
    } else if (sortBy.value === 'name_asc' || sortBy.value === 'name') {
        list = [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    } else if (sortBy.value === 'name_desc') {
        list = [...list].sort((a, b) => (b.name || '').localeCompare(a.name || ''))
    } else if (sortBy.value === 'participants') {
        list = [...list].sort((a, b) => (b.participantsCount || 0) - (a.participantsCount || 0))
    }
    return list
})

// Numbered Pagination Calculations
const totalPages = computed(() => {
    return Math.ceil(filteredTournaments.value.length / itemsPerPage.value) || 1
})

const paginationStart = computed(() => {
    return (currentPage.value - 1) * itemsPerPage.value
})

const paginationEnd = computed(() => {
    return Math.min(paginationStart.value + itemsPerPage.value, filteredTournaments.value.length)
})

const displayedTournaments = computed(() => {
    return filteredTournaments.value.slice(paginationStart.value, paginationEnd.value)
})

const visiblePages = computed(() => {
    const total = totalPages.value
    const cur = currentPage.value
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }
    const pages = []
    pages.push(1)
    if (cur > 3) {
        pages.push('...')
    }
    const start = Math.max(2, cur - 1)
    const end = Math.min(total - 1, cur + 1)
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    if (cur < total - 2) {
        pages.push('...')
    }
    pages.push(total)
    return pages
})

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    if (typeof window !== 'undefined') {
        const mainEl = document.querySelector('main')
        if (mainEl) {
            mainEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }
}

// Reset page on filter changes
watch([searchQuery, selectedSourceType, selectedCountry, selectedStatuses, sortBy, itemsPerPage], () => {
    currentPage.value = 1
})

const resetFilters = () => {
    searchQuery.value = ''
    selectedCountry.value = 'all'
    selectedStatuses.value = []
    selectedSourceType.value = 'all'
    sortBy.value = 'newest'
    currentPage.value = 1
}



const structuredData = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Archery Tournaments & Live Scoring Leaderboards',
    'description': 'Browse upcoming archery tournaments and live scoring results on Archeris.',
    'itemListElement': filteredTournaments.value.slice(0, 10).map((t, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'item': {
            '@type': 'SportsEvent',
            'name': t.name,
            'startDate': t.startDate,
            'endDate': t.endDate,
            'location': {
                '@type': 'Place',
                'name': t.location || 'Indonesia'
            },
            'url': `https://archeris.net/tournaments/${t.slug || t.id}`
        }
    }))
}))

useHead({
    title: 'Archery Tournaments - Official Live Scoring | Archeris',
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify(structuredData.value))
        }
    ]
})

useSeoMeta({
    title: 'Archery Tournaments - Official Live Scoring | Archeris',
    description: 'Discover upcoming archery tournaments, national championships, and live scoring archives. Real-time qualification leaderboards and elimination match brackets.',
    ogTitle: 'Archery Tournaments - Official Live Scoring | Archeris',
    ogDescription: 'Discover upcoming archery tournaments, national championships, and live scoring archives. Real-time qualification leaderboards and elimination match brackets.',
    ogType: 'website',
    twitterCard: 'summary_large_image'
})

const tournamentsBreadcrumbSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    {
      '@type': 'ListItem',
      'position': 1,
      'name': 'Home',
      'item': 'https://archeris.net/'
    },
    {
      '@type': 'ListItem',
      'position': 2,
      'name': 'Tournaments',
      'item': 'https://archeris.net/tournaments'
    }
  ]
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(tournamentsBreadcrumbSchema.value))
    }
  ]
})

</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>