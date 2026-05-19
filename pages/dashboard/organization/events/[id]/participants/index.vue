<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary">
            </div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:users" class="text-white text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Daftar Peserta
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Lihat dan kelola semua peserta yang terdaftar dalam event ini.
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:download" class="h-11 px-5"
                            @click="canExportData ? exportCSV() : (showPremiumModal = true)"
                            :class="{ 'opacity-50 grayscale cursor-not-allowed': !canExportData }">
                            <span class="hidden sm:inline">Export CSV</span>
                            <span class="sm:hidden">Export</span>
                        </BaseButton>
                        <BaseButton :to="canCreateEvent ? `/dashboard/events/${eventId}/participants/add` : undefined"
                            variant="primary" icon="ph:plus-bold" @click="!canCreateEvent && (showPremiumModal = true)"
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-sm hover:shadow-primary/40 transition-all"
                            :class="{ 'opacity-50 grayscale cursor-not-allowed': !canCreateEvent }">
                            <span class="hidden sm:inline">Tambah Peserta</span>
                            <span class="sm:hidden">Tambah</span>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
        <PremiumRequiredModal v-model:show="showPremiumModal" :feature="premiumFeature" />

        <!-- Search and Filter Bar -->
        <div
            class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div class="flex flex-col sm:flex-row gap-4 w-full sm:max-w-4xl">
                <div class="relative flex-1">
                    <Icon icon="ph:magnifying-glass"
                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                    <input v-model="searchQuery" type="text" placeholder="Cari nama peserta atau email..."
                        class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        @input="handleSearch" />
                </div>
                <div class="w-full sm:w-72">
                    <BaseSelect v-model="categoryFilter" :items="categoryFilterOptions" multiple clearable
                        @update:model-value="handleFilterCategory" />
                </div>
                <div class="w-full sm:w-48">
                    <BaseSelect v-model="statusFilter" :items="statusOptions"
                        @update:model-value="handleFilterStatus" />
                </div>
            </div>

            <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-400 tracking-widest hidden sm:inline">Total:</span>
                <div class="px-3 py-1.5 bg-navy/5 text-navy rounded-lg font-black text-xs border border-navy/10">
                    {{ total }} Peserta
                </div>
            </div>
        </div>

        <!-- Participants Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50/50 border-b border-gray-100">
                        <tr class="text-[10px] font-black text-gray-400  tracking-widest capitalize">
                            <th class="px-6 py-4">No</th>
                            <th class="px-6 py-4">Nama Peserta / Email</th>
                            <th class="px-6 py-4">Klub / Kota</th>
                            <th v-if="hasActiveCategoryFilter" class="px-6 py-4 min-w-[240px]">Kategori Event</th>
                            <th class="px-6 py-4 min-w-[160px]">Status Pembayaran</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <!-- Loading State -->
                        <template v-if="isLoading">
                            <tr v-for="i in 5" :key="i">
                                <td class="px-6 py-4">
                                    <div class="h-4 w-4 bg-gray-100 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="h-10 w-10 bg-gray-100 animate-pulse rounded-full"></div>
                                        <div class="space-y-2">
                                            <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                                            <div class="h-3 w-40 bg-gray-50 animate-pulse rounded"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4 min-w-[160px]">
                                    <div class="h-6 w-28 bg-gray-100 animate-pulse rounded-lg"></div>
                                </td>
                                <td v-if="hasActiveCategoryFilter" class="px-6 py-4 min-w-[240px]">
                                    <div class="h-4 w-40 bg-gray-50 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex justify-end gap-2">
                                        <div class="size-8 bg-gray-50 animate-pulse rounded-lg"></div>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <template v-else>
                            <tr v-for="(participant, index) in filteredParticipants" :key="participant.archer_id"
                                class="group hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 align-top text-center w-16">
                                    <span class="text-sm font-bold text-gray-400">{{ (page - 1) * limit + index + 1
                                        }}</span>
                                </td>
                                <td class="px-6 py-4 align-top min-w-[250px]">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs  border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                                            <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                                class="w-full h-full object-cover">
                                        </div>
                                        <div class="min-w-0 py-1">
                                            <div class="text-sm font-black text-navy leading-tight">{{
                                                participant.full_name }}</div>
                                            <div class=" text-xs text-gray-400 font-medium mt-1 leading-none">{{
                                                participant.email || '-' }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-top min-w-[150px]">
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold text-gray-600 leading-snug">{{
                                            participant.club_name || '-' }}</span>
                                        <span v-if="participant.city"
                                            class="text-[10px] text-gray-400 font-bold tracking-wider">{{
                                                participant.city }}</span>
                                    </div>
                                </td>

                                <td v-if="hasActiveCategoryFilter" class="px-6 py-4 align-top min-w-[240px]">
                                    <div class="flex flex-wrap gap-1.5 max-w-[360px]">
                                        <span v-for="label in getFilteredCategoryLabels(participant)" :key="label"
                                            class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-navy/5 text-navy border border-navy/10">
                                            {{ label }}
                                        </span>
                                    </div>
                                </td>

                                <td class="px-6 py-4 align-top min-w-[160px]">
                                    <span :class="getStatusClass(participant.payment_status || participant.status)"
                                        class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize">
                                        {{ getDisplayStatus(participant.payment_status || participant.status) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right align-top w-20">
                                    <div class="flex items-center justify-end">
                                        <BaseButton
                                            :to="`/dashboard/events/${eventId}/participants/${participant.athlete_code || participant.archer_id}`"
                                            variant="white" size="sm" icon="ph:eye-bold"
                                            class="h-10 w-10 p-0 text-gray-400 hover:text-navy border-gray-100 hover:border-navy/20 shadow-none"
                                            title="Lihat Detail Profil" />
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredParticipants.length === 0">
                                <td :colspan="hasActiveCategoryFilter ? 6 : 5"
                                    class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                    Tidak ada peserta yang ditemukan.
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <div class="px-6 py-6 border-t border-gray-100 bg-gray-50/10">
                <BasePagination :current-page="page" :total-items="total" :items-per-page="limit"
                    @change-page="p => { page = p; fetchParticipants(); }"
                    @update:items-per-page="v => { limit = v; page = 1; fetchParticipants(); }" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'
import BasePagination from '~/components/common/BasePagination.vue'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Daftar Peserta - ArcheryHub Dashboard'
})

const route = useRoute()
const eventId = computed(() => route.params.id)
const { get } = useApi()
const { setEvent, clearEvent } = useEventContext()
const apiBaseUrl = useApiBaseUrl()
const { isSubscriptionActive, canExportData, canCreateEvent } = useSubscription()
const showPremiumModal = ref(false)

const premiumFeature = computed(() => {
    if (!isSubscriptionActive.value) return 'active_subscription'
    return 'export_data'
})

const breadcrumbItems = computed(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Events', path: '/dashboard/events' }
])

const participants = ref([])
const categories = ref([])
const total = ref(0)
const verifiedCount = ref(0)
const pendingCount = ref(0)
const page = ref(1)
const limit = ref(10)
const totalPages = computed(() => Math.ceil(total.value / limit.value))

const searchQuery = ref('')
const activeDiv = ref('Semua')
const filterDivs = ['Semua', 'Recurve', 'Compound', 'Barebow']
const isLoading = ref(true)

const statusFilter = ref('Semua')
const categoryFilter = ref([])
const statusOptions = [
    { title: 'Semua Status', value: 'Semua' },
    { title: 'Lunas', value: 'lunas' },
    { title: 'Unpaid', value: 'unpaid' }
]

const categoryFilterOptions = computed(() => {
    const mapped = categories.value.map(category => ({
        title: [
            category.division_name,
            category.category_name,
            category.event_type_name,
            category.gender_division_name
        ].filter(Boolean).join(' - '),
        value: category.id
    }))
    return mapped
})

const hasActiveCategoryFilter = computed(() => Array.isArray(categoryFilter.value) && categoryFilter.value.length > 0)

const searchTimeout = ref(null)

const exportCSV = () => {
    const url = `${apiBaseUrl}/events/${eventId.value}/participants/export`
    window.open(url, '_blank')
}

const handleFilterStatus = () => {
    page.value = 1
    fetchParticipants()
}

const handleFilterCategory = () => {
    page.value = 1
    fetchParticipants()
}

const handleSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
    searchTimeout.value = setTimeout(() => {
        page.value = 1
        fetchParticipants()
    }, 500)
}

const fetchEventDetails = async () => {
    const id = eventId.value
    if (!id) return
    try {
        const eventRes = await get(`/events/${id}`)
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const fetchCategories = async () => {
    const id = eventId.value
    if (!id) return
    try {
        const response = await get(`/events/${id}/categories`)
        categories.value = response?.events || response?.categories || []
    } catch (error) {
        console.error('Failed to fetch categories:', error)
        categories.value = []
    }
}

const fetchParticipants = async () => {
    const id = eventId.value
    if (!id) return
    isLoading.value = true
    try {
        const offset = (page.value - 1) * limit.value
        let url = `/events/${id}/participants?limit=${limit.value}&offset=${offset}&group_by=archer&search=${searchQuery.value}`
        if (statusFilter.value !== 'Semua') {
            url += `&payment_status=${statusFilter.value}`
        }
        if (hasActiveCategoryFilter.value) {
            url += `&category_ids=${categoryFilter.value.join(',')}`
        }
        const response = await get(url)
        participants.value = response?.participants || []
        total.value = response?.total || 0
        verifiedCount.value = response?.verified_count || 0
        pendingCount.value = response?.pending_count || 0
    } catch (error) {
        console.error('Failed to fetch participants:', error)
    } finally {
        isLoading.value = false
    }
}

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage
        fetchParticipants()
        // Scroll to top of table
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const filteredParticipants = computed(() => {
    return participants.value
})

const getFilteredCategoryEntries = (participant) => {
    const categoryList = participant?.categories || []
    if (!Array.isArray(categoryList) || categoryList.length === 0) return []
    if (!hasActiveCategoryFilter.value) return []
    const selected = new Set(categoryFilter.value)
    const matched = categoryList.filter(c => selected.has(c?.category_id))
    return matched.length > 0 ? matched : []
}

const getFilteredCategoryLabels = (participant) => {
    const entries = getFilteredCategoryEntries(participant)
    if (entries.length === 0) return ['-']

    const labels = entries.map((categoryEntry) => {
        const parts = [
            categoryEntry.division_name,
            categoryEntry.category_name,
            categoryEntry.event_type_name,
            categoryEntry.gender_division_name
        ].filter(Boolean)
        return parts.length > 0 ? parts.join(' - ') : '-'
    })

    return Array.from(new Set(labels))
}

const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'menunggu' || s === 'menunggu acc' || !s) return 'unpaid'
    return s
}

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'lunas':
            return 'bg-green-50 text-green-600 border-green-200'
        case 'menunggu':
        case 'menunggu acc':
        default:
            return 'bg-amber-50 text-amber-600 border-amber-200'
    }
}

const uniqueClubs = computed(() => {
    const clubs = new Set(participants.value.map(p => p.club_name).filter(Boolean))
    return clubs.size
})

const getCategoryName = (participant) => {
    if (!participant) return '-'

    const parts = []
    if (participant.division_name) parts.push(participant.division_name)
    if (participant.category_name) parts.push(participant.category_name)
    if (participant.event_type_name) parts.push(participant.event_type_name)
    if (participant.gender_division_name) parts.push(participant.gender_division_name)

    return parts.length > 0 ? parts.join(' - ') : '-'
}


const loadPageData = () => {
    if (!eventId.value) return
    fetchEventDetails()
    fetchCategories()
    fetchParticipants()
}

// Re-fetch whenever we're on this page (including when returning via browser back / touchpad back)
watch(
    () => [route.params.id, route.params.participantId],
    ([id, participantId]) => {
        if (import.meta.client && id && participantId === undefined) loadPageData()
    },
    { immediate: true }
)

// Re-fetch when page is restored from bfcache (browser back can restore cached page without re-mounting)
const onPageShow = (event) => {
    if (event.persisted) loadPageData()
}

// Fallback: re-fetch when tab/window becomes visible (handles some SSR/back edge cases)
const onVisibilityChange = () => {
    if (document.visibilityState === 'visible' && eventId.value && route.params.participantId === undefined) {
        loadPageData()
    }
}

onMounted(() => {
    if (import.meta.client) {
        window.addEventListener('pageshow', onPageShow)
        document.addEventListener('visibilitychange', onVisibilityChange)
    }
})

onBeforeUnmount(() => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
    if (import.meta.client) {
        window.removeEventListener('pageshow', onPageShow)
        document.removeEventListener('visibilitychange', onVisibilityChange)
    }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
