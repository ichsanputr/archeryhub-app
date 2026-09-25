<template>
    <div class="min-h-screen bg-slate-50 font-body text-navy">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24 text-white">
            <div class="absolute inset-0 z-0">
                <img src="/hero-archer.jpeg" alt="Archers Background" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>

            <div class="container mx-auto px-4 max-w-7xl relative z-10">
                <div class="max-w-3xl">
                    <h1
                        class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4 font-display">
                        {{ t('archers.title') }}
                    </h1>
                    <p class="text-white/80 text-sm md:text-lg leading-relaxed max-w-xl">
                        {{ t('archers.description') }}
                    </p>
                </div>
            </div>
        </section>

        <!-- Filter Bar -->
        <section class="container mx-auto px-4 max-w-7xl -mt-8 relative z-20">
            <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6 space-y-4">
                <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <!-- Search Archer -->
                    <div class="flex-1 w-full relative">
                        <BaseInput v-model="searchQuery" type="text" :placeholder="t('archers.search_placeholder')"
                            icon="ph:magnifying-glass" />
                    </div>

                    <!-- View Toggle & Count -->
                    <div class="flex items-center justify-between w-full lg:w-auto gap-4 shrink-0">
                        <p class="text-slate-500 text-xs sm:text-sm font-medium whitespace-nowrap">
                            <span class="font-bold text-navy">{{ totalArchers }}</span> {{ t('archers.count_unit', 'Atlet') }}
                        </p>
                        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            <button @click="viewMode = 'grid'"
                                :class="['p-2 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white shadow-sm text-navy' : 'text-slate-400 hover:text-navy']"
                                :title="t('common.grid_view', 'Grid View')">
                                <Icon icon="ph:squares-four-bold" class="text-lg" />
                            </button>
                            <button @click="viewMode = 'list'"
                                :class="['p-2 rounded-lg transition-all', viewMode === 'list' ? 'bg-white shadow-sm text-navy' : 'text-slate-400 hover:text-navy']"
                                :title="t('common.list_view', 'List View')">
                                <Icon icon="ph:list-bold" class="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Bow Type Filters -->
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-slate-50">
                    <button v-for="type in localizedBowTypes" :key="type.value" @click="activeBowType = type.value" :class="[
                        'px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
                        activeBowType === type.value
                            ? 'bg-navy text-white border-navy shadow-sm'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-navy'
                    ]">
                        {{ type.label }}
                    </button>
                </div>
            </div>
        </section>

        <!-- Archers Grid / List Content -->
        <section class="container mx-auto px-4 max-w-7xl py-12 md:py-16">
            <!-- Loading Skeleton -->
            <PublicCardSkeleton v-if="isLoading" :count="viewMode === 'list' ? 8 : 6" :type="viewMode === 'list' ? 'list' : 'card'" />

            <!-- Empty State -->
            <div v-else-if="archers.length === 0" class="py-16 px-6 text-center max-w-sm mx-auto">
                <div class="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-sm">
                    <Icon icon="ph:user-focus" class="text-3xl" />
                </div>
                <h3 class="text-lg font-bold text-navy mb-1">{{ t('archers.not_found', 'Atlet Tidak Ditemukan') }}</h3>
                <p class="text-sm text-slate-500 font-medium leading-relaxed mb-6">{{ t('archers.not_found_desc', 'Belum ada data atlet panahan yang sesuai dengan filter pencarian.') }}</p>
                <BaseButton v-if="searchQuery || activeBowType !== 'all'" variant="outline" size="sm" @click="resetFilters">
                    {{ t('events_page.reset_button', 'Hapus Filter') }}
                </BaseButton>
            </div>

            <!-- Grid View -->
            <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NuxtLink v-for="archer in filteredArchers" :key="archer.id || archer.uuid"
                    :to="`/archers/${archer.username || archer.slug}`"
                    class="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-4">
                            <!-- Avatar -->
                            <div class="relative shrink-0">
                                <div
                                    class="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-amber-400 p-0.5 overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105">
                                    <div class="w-full h-full rounded-[10px] overflow-hidden bg-white">
                                        <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                            :alt="(archer.full_name || 'Archer') + ' Profile Picture'"
                                            class="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>

                            <!-- Name & Basic Info -->
                            <div class="flex-1 min-w-0">
                                <h3 class="font-bold text-navy text-lg group-hover:text-primary transition-colors truncate">
                                    {{ archer.full_name }}
                                </h3>
                                <div class="flex flex-col gap-0.5 mt-0.5">
                                    <span class="text-slate-400 text-xs font-medium flex items-center gap-1.5 truncate">
                                        <Icon icon="ph:shield-bold" class="text-xs shrink-0" />
                                        <span class="truncate">{{ archer.club_name || archer.club || 'Independent' }}</span>
                                    </span>
                                    <span v-if="archer.city"
                                        class="text-slate-400 text-xs font-medium flex items-center gap-1.5 truncate">
                                        <Icon icon="ph:map-pin-bold" class="text-xs shrink-0" />
                                        <span class="truncate">{{ archer.city }}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Archer Details Grid -->
                        <div class="grid grid-cols-2 gap-2.5 mt-6">
                            <div
                                class="bg-slate-50 rounded-xl p-3 border border-slate-100/60 transition-all group-hover:bg-primary/5 group-hover:border-primary/10">
                                <span
                                    class="block text-[10px] text-slate-400 font-bold tracking-widest mb-1">{{ t('archers.division', 'Divisi') }}</span>
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center p-0.5 border border-slate-100">
                                        <img :src="getBowIcon(archer.bow_type)" :alt="archer.bow_type"
                                            class="w-full h-full object-contain" />
                                    </div>
                                    <span class="text-xs font-bold text-navy truncate capitalize">{{ archer.bow_type || 'Recurve' }}</span>
                                </div>
                            </div>
                            <div
                                class="bg-slate-50 rounded-xl p-3 border border-slate-100/60 transition-all group-hover:bg-amber-50/50 group-hover:border-amber-100">
                                <span
                                    class="block text-[10px] text-slate-400 font-bold tracking-widest mb-1">{{ t('archers.competition', 'Kompetisi') }}</span>
                                <div class="flex items-center gap-2">
                                    <div
                                        class="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                        <Icon icon="ph:medal-bold" class="text-amber-500 text-xs" />
                                    </div>
                                    <span class="text-xs font-bold text-navy">{{ t('archers.events_count', { count: archer.total_events || 0 }) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </NuxtLink>
            </div>

            <!-- List View -->
            <div v-else class="space-y-3">
                <NuxtLink v-for="archer in filteredArchers" :key="archer.id || archer.uuid"
                    :to="`/archers/${archer.slug || archer.username}`"
                    class="bg-white rounded-2xl border border-slate-100 hover:border-primary/40 shadow-sm hover:shadow-md transition-all p-4 sm:p-5 flex items-center justify-between gap-4 group">
                    <div class="flex items-center gap-4 min-w-0">
                        <div
                            class="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                            <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                :alt="(archer.full_name || 'Archer') + ' Profile Picture'"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div class="min-w-0">
                            <h3 class="font-bold text-navy text-base group-hover:text-primary transition-colors truncate">
                                {{ archer.full_name }}
                            </h3>
                            <div class="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium truncate">
                                <span v-if="archer.club_name">{{ archer.club_name }}</span>
                                <span v-if="archer.city">• {{ archer.city }}</span>
                                <span v-if="archer.bow_type" class="capitalize">• {{ archer.bow_type }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center gap-4 shrink-0">
                        <div class="text-right hidden sm:block">
                            <div class="text-xs text-slate-400 font-medium">{{ t('archers.total_events', 'Total Event') }}</div>
                            <div class="text-lg font-bold text-navy">{{ archer.total_events || 0 }}</div>
                        </div>
                        <Icon icon="ph:arrow-right-bold" class="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                </NuxtLink>
            </div>

            <!-- Pagination -->
            <div v-if="totalArchers > pageSize" class="mt-12 flex justify-center">
                <BasePagination :current-page="currentPage" :total-items="totalArchers" :items-per-page="pageSize"
                    @change-page="p => currentPage = p" />
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

definePageMeta({
    layout: 'landing'
})

const structuredData = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Archer Directory - Official Scoring Profiles',
    'description': 'Verified archers and athletes with official tournament scoring track records.',
    'itemListElement': (archers.value || []).slice(0, 12).map((a, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'item': {
            '@type': 'Person',
            'name': a.full_name,
            'url': `https://archeris.net/archers/${a.slug || a.id}`
        }
    }))
}))

useHead({
    title: 'Archer Directory - Official Scoring Profiles | Archeris',
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
    title: 'Archer Directory - Official Scoring Profiles | Archeris',
    description: 'Explore verified athlete profiles, official tournament scoring records, qualification statistics, arrow averages, and personal rankings on Archeris.',
    ogTitle: 'Archer Directory - Official Scoring Profiles | Archeris',
    ogDescription: 'Explore verified athlete profiles, official tournament scoring records, qualification statistics, arrow averages, and personal rankings on Archeris.',
    ogType: 'website',
    twitterCard: 'summary_large_image'
})

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const route = useRoute()
const router = useRouter()

// Initialize from URL query params
const currentPage = ref(Number(route.query.page) || 1)
const searchQuery = ref('')
const activeBowType = ref('all')
const viewMode = ref('grid')
const pageSize = ref(12)

const getBowIcon = (type) => {
    if (!type) return '/bow/recurve.svg'
    const lowType = type.toLowerCase()
    return `/bow/${lowType}.svg`
}

const localizedBowTypes = computed(() => [
    { label: t('archers.bow_types.all'), value: 'all' },
    { label: t('archers.bow_types.standard'), value: 'standard' },
    { label: t('archers.bow_types.recurve'), value: 'recurve' },
    { label: t('archers.bow_types.compound'), value: 'compound' },
    { label: t('archers.bow_types.barebow'), value: 'barebow' },
    { label: t('archers.bow_types.traditional'), value: 'traditional' },
])

// Pagination state
const { data: archerResponse, pending: isLoading } = await useAsyncData('archers', () => $fetch(`${apiBaseUrl}/archers`, {
    query: {
        search: searchQuery.value || undefined,
        bow_type: activeBowType.value !== 'all' ? activeBowType.value : undefined,
        limit: pageSize.value,
        offset: (currentPage.value - 1) * pageSize.value
    }
}), {
    watch: [searchQuery, activeBowType, currentPage],
    server: true
})

// Update URL when page changes
watch(currentPage, (val) => {
    router.push({
        query: {
            ...route.query,
            page: val > 1 ? val : undefined
        }
    })
})

// Reset to page 1 when filters change
watch([searchQuery, activeBowType], () => {
    currentPage.value = 1
})

const archers = computed(() => {
    let rawData = archerResponse.value?.archers || archerResponse.value?.data || archerResponse.value
    let archersData = []

    if (Array.isArray(rawData)) {
        archersData = rawData
    } else if (rawData && typeof rawData === 'object') {
        archersData = Array.isArray(rawData.data) ? rawData.data :
            Array.isArray(rawData.archers) ? rawData.archers : []
    }

    return archersData.map(archer => ({
        ...archer,
        uuid: archer.uuid || archer.id,
        slug: archer.username || archer.slug,
        full_name: archer.full_name,
        athlete_code: archer.id,
        city: archer.city,
        province: archer.province,
        bow_type: archer.bow_type || 'recurve',
        photo_url: archer.photo_url || archer.avatar_url,
        club_name: archer.club_name,
        total_events: archer.total_events || 0
    }))
})

const totalArchers = computed(() => {
    return archerResponse.value?.total || archerResponse.value?.meta?.total_items || 0
})

const activeArchers = computed(() => {
    return archerResponse.value?.total || 0
})

// Since we moved filtering to serverside, filteredArchers is just archers
const filteredArchers = computed(() => archers.value)

useHead({
    title: computed(() => 'Archer Profiles & Athlete Rankings - Archeris'),
    meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { name: 'googlebot', content: 'noindex, nofollow' }
    ]
})

useSeoMeta({
    title: () => 'Archer Profiles & Athlete Rankings - Archeris',
    robots: 'noindex, nofollow',
    description: () => t('archers.seo_desc', 'Discover and explore profiles of talented archers. View verified tournament records, arrow averages, and rankings on Archeris.'),
    ogTitle: () => 'Archer Profiles & Athlete Rankings - Archeris',
    ogDescription: () => t('archers.seo_desc', 'Discover and explore profiles of talented archers. View verified tournament records, arrow averages, and rankings on Archeris.')
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
