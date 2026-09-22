<template>
    <div class="flex flex-col gap-8 relative">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="space-y-4">
                    <div class="flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest text-primary/80">
                        <span class="text-white">{{ t('root.index.root_terminal') }}</span>
                        <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
                        <span class="text-primary">{{ t('root.tournaments.breadcrumb') }}</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                            <Icon icon="ph:trophy-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('root.tournaments.title') }}</h1>
                            <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                                {{ t('root.tournaments.subtitle') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="fetchTournaments"
                        class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/10 active:scale-95 cursor-pointer">
                        <Icon icon="ph:arrow-clockwise-bold" :class="loading ? 'animate-spin' : ''" />
                        <span>{{ t('common.refresh') }}</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Overview Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
                :title="t('root.tournaments.stat_total')"
                :value="(stats.total || 0).toLocaleString('id-ID')"
                icon="ph:trophy-bold"
                color="primary"
                :description="`${stats.published || 0} ${t('root.tournaments.stat_published_note')} • ${stats.draft || 0} ${t('root.tournaments.stat_draft_note')}`"
                description-icon="ph:chart-pie-slice-bold"
            />
            <StatCard
                :title="t('root.tournaments.stat_athletes')"
                :value="(stats.total_athletes || 0).toLocaleString('id-ID')"
                icon="ph:users-three-bold"
                color="primary"
                :description="t('root.tournaments.stat_athletes_desc')"
                description-icon="ph:target-bold"
            />
            <StatCard
                :title="t('root.tournaments.stat_free')"
                :value="(stats.packages?.free || 0).toLocaleString('id-ID') + ' Event'"
                icon="ph:sparkle-bold"
                color="primary"
                :description="t('root.tournaments.stat_free_desc')"
                description-icon="ph:check-circle-bold"
            />
            <StatCard
                :title="t('root.tournaments.stat_premium')"
                :value="((stats.packages?.standard || 0) + (stats.packages?.elite || 0)).toLocaleString('id-ID') + ' Event'"
                icon="ph:crown-bold"
                color="primary"
                :description="`${stats.packages?.standard || 0} Standard • ${stats.packages?.elite || 0} Elite`"
                description-icon="ph:lightning-bold"
            />
        </div>

        <!-- Unified DashboardDataTable (Category B: Inline Filters) -->
        <DashboardDataTable
            :items="tournaments"
            :columns="tableColumns"
            :loading="loading"
            :searchable="true"
            :search-placeholder="t('root.tournaments.search_placeholder')"
            count-icon="ph:trophy-bold"
            :count-unit="t('common.tournaments')"
            :show-reset-button="true"
            :empty-title="t('root.tournaments.empty_title')"
            :empty-description="t('root.tournaments.empty_desc')"
            empty-icon="ph:trophy"
            :items-per-page="meta.per_page || 15"
            :initial-sort-by="sortBy"
            :initial-sort-order="sortOrder"
            @search="searchQuery = $event; handleSearch()"
            @sort="toggleSort($event.sortBy)"
            @reset-filters="resetFilters"
        >
            <!-- Inline Filters: Status & Quota Type -->
            <template #inline-filters>
                <div class="flex items-center gap-2 flex-wrap">
                    <div class="w-36 sm:w-44">
                        <BaseSelect v-model="statusFilter" :options="statusOptions" class="w-full text-xs" />
                    </div>
                    <div class="w-36 sm:w-44">
                        <BaseSelect v-model="quotaFilter" :options="quotaOptions" class="w-full text-xs" />
                    </div>
                </div>
            </template>

            <!-- Name Column Slot -->
            <template #item-name="{ item }">
                <div class="flex items-center gap-3.5 max-w-sm py-1">
                    <div class="size-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
                        <img v-if="item.logo_url || item.banner_url" :src="item.logo_url || item.banner_url" class="size-full object-cover" />
                        <Icon v-else icon="ph:trophy-bold" class="text-slate-400 text-xl" />
                    </div>
                    <div class="min-w-0 space-y-0.5">
                        <div class="text-xs sm:text-sm font-black text-navy truncate hover:text-primary transition-colors">
                            {{ item.name }}
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                            <span v-if="item.code" class="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-semibold">{{ item.code }}</span>
                            <span class="truncate flex items-center gap-1">
                                <Icon icon="ph:map-pin" class="shrink-0 text-slate-400" />
                                {{ item.city || item.venue || 'Indonesia' }}
                            </span>
                        </div>
                    </div>
                </div>
            </template>

            <!-- Organizer Column Slot -->
            <template #item-organizer="{ item }">
                <div class="flex items-center gap-2.5">
                    <div class="size-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-black overflow-hidden shrink-0">
                        <img v-if="item.organizer_avatar" :src="item.organizer_avatar" class="size-full object-cover" />
                        <span v-else>{{ (item.organizer_name || 'E').charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="min-w-0">
                        <div class="text-xs font-bold text-navy truncate">{{ item.organizer_name || 'Event Organizer' }}</div>
                        <div class="text-[10px] text-slate-400 truncate">{{ item.organizer_email || '—' }}</div>
                    </div>
                </div>
            </template>

            <!-- Quota Column Slot -->
            <template #item-quota="{ item }">
                <div class="flex justify-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border"
                        :class="getQuotaBadgeClass(item.quota_type)">
                        <Icon :icon="getQuotaIcon(item.quota_type)" class="text-xs" />
                        {{ formatQuotaLabel(item.quota_type) }}
                    </span>
                </div>
            </template>

            <!-- Participants Column Slot -->
            <template #item-participants="{ item }">
                <div class="space-y-0.5 text-center">
                    <div class="text-xs font-black text-navy">{{ t('my_events.athletes_count', { count: item.participant_count }) }}</div>
                    <div class="text-[10px] text-slate-400 font-medium">{{ t('my_events.categories_count', { count: item.category_count }) }}</div>
                </div>
            </template>

            <!-- Status Column Slot -->
            <template #item-status="{ item }">
                <div class="flex justify-center">
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider border"
                        :class="getStatusBadgeClass(item.status)">
                        <span class="size-1.5 rounded-full" :class="item.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                        {{ item.status === 'published' ? 'Published' : 'Draft' }}
                    </span>
                </div>
            </template>

            <!-- Date Column Slot -->
            <template #item-date="{ item }">
                <div class="space-y-0.5 text-xs">
                    <div class="font-bold text-navy">{{ formatDate(item.start_date) }}</div>
                    <div class="text-[10px] text-slate-400">{{ t('event_categories.created', { date: formatDate(item.created_at) }) }}</div>
                </div>
            </template>

            <!-- Actions Column Slot -->
            <template #actions="{ item }">
                <div class="flex items-center justify-end gap-1.5">
                    <a :href="`/tournaments/${item.slug}`" target="_blank"
                        class="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                        :title="t('root.tournaments.view_public')">
                        <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                    </a>
                    <button @click="openDeleteDialog(item)"
                        class="size-8 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                        :title="t('root.tournaments.delete_refund_title')">
                        <Icon icon="ph:trash-bold" class="text-sm" />
                    </button>
                </div>
            </template>
        </DashboardDataTable>

        <!-- Delete & Refund Confirmation Modal -->
        <AppDialog
            v-model:show="deleteModal.show"
            :title="t('root.tournaments.delete_dialog_title')"
            type="danger"
            icon="ph:warning-octagon-bold"
            :confirm-text="t('root.tournaments.confirm_delete_btn')"
            :cancel-text="t('common.cancel')"
            :loading="deleteModal.loading"
            @confirm="executeDelete"
        >
            <div class="space-y-4 text-left">
                <div class="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs leading-relaxed space-y-1">
                    <div class="font-black flex items-center gap-1.5 text-red-800">
                        <Icon icon="ph:shield-warning-bold" class="text-base shrink-0" />
                        <span>{{ t('root.tournaments.danger_warning') }}</span>
                    </div>
                    <div>
                        {{ t('root.tournaments.delete_desc') }}
                    </div>
                </div>

                <!-- Detail Box -->
                <div v-if="deleteModal.item" class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5 text-xs">
                    <div class="flex items-center justify-between border-b border-slate-200/70 pb-2">
                        <span class="text-slate-500">{{ t('root.tournaments.modal_event_name') }}:</span>
                        <span class="font-black text-navy text-right max-w-[220px] truncate">{{ deleteModal.item.name }}</span>
                    </div>
                    <div class="flex items-center justify-between border-b border-slate-200/70 pb-2">
                        <span class="text-slate-500">{{ t('root.tournaments.modal_organizer') }}:</span>
                        <span class="font-bold text-navy text-right truncate max-w-[220px]">{{ deleteModal.item.organizer_name }}</span>
                    </div>
                    <div class="flex items-center justify-between border-b border-slate-200/70 pb-2">
                        <span class="text-slate-500">{{ t('root.tournaments.modal_quota_type') }}:</span>
                        <span class="font-black tracking-wider text-primary">{{ formatQuotaLabel(deleteModal.item.quota_type) }}</span>
                    </div>
                    <div class="flex items-center justify-between pt-0.5">
                        <span class="text-slate-500 font-bold">{{ t('root.tournaments.modal_refund_effect') }}:</span>
                        <span class="inline-flex items-center gap-1 text-emerald-600 font-black bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <Icon icon="ph:plus-circle-bold" />
                            +1 Kredit Kuota {{ formatQuotaLabel(deleteModal.item.quota_type) }}
                        </span>
                    </div>
                </div>
            </div>
        </AppDialog>
    </div>
</template>

<script setup>
import { useDateFormat } from '@vueuse/core'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

const { t, locale } = useI18n()
const api = useApi()
const toast = useToast()

useHead({
    title: computed(() => `${t('root.tournaments.title')} - Archeris Root`)
})

const tableColumns = computed(() => [
    { key: 'name', label: t('root.tournaments.table_name'), sortable: true, sortKey: 'name', class: 'min-w-[260px]' },
    { key: 'organizer', label: t('root.tournaments.table_organizer'), sortable: false, class: 'min-w-[170px]' },
    { key: 'quota', label: t('root.tournaments.table_quota'), sortable: false, align: 'center', class: 'min-w-[120px]' },
    { key: 'participants', label: t('root.tournaments.table_participants'), sortable: true, sortKey: 'participants', align: 'center', class: 'min-w-[130px]' },
    { key: 'status', label: t('root.tournaments.table_status'), sortable: true, sortKey: 'status', align: 'center', class: 'min-w-[130px]' },
    { key: 'date', label: t('root.tournaments.table_date'), sortable: true, sortKey: 'start_date', class: 'min-w-[150px]' }
])

const tournaments = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const quotaFilter = ref('all')
const sortBy = ref('created_at')
const sortOrder = ref('desc')
const currentPage = ref(1)

const stats = ref({
    total: 0,
    published: 0,
    draft: 0,
    total_athletes: 0,
    packages: {
        free: 0,
        standard: 0,
        elite: 0
    }
})

const meta = ref({
    total: 0,
    page: 1,
    per_page: 15,
    total_pages: 1
})

const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Published (Terbit)', value: 'published' },
    { label: 'Draft (Konsep)', value: 'draft' }
]

const quotaOptions = [
    { label: 'Semua Tipe Paket', value: 'all' },
    { label: 'Free (Gratis)', value: 'free' },
    { label: 'Standard', value: 'standard' },
    { label: 'Elite', value: 'elite' }
]

const deleteModal = ref({
    show: false,
    item: null,
    loading: false
})

const fetchTournaments = async () => {
    loading.value = true
    try {
        const queryParams = new URLSearchParams({
            page: currentPage.value.toString(),
            limit: '15',
            search: searchQuery.value,
            status: statusFilter.value,
            quota_type: quotaFilter.value,
            sort_by: sortBy.value,
            order: sortOrder.value
        })

        const res = await api.get(`/root/dashboard/tournaments?${queryParams.toString()}`)
        tournaments.value = res.tournaments || []
        if (res.meta) meta.value = res.meta
        if (res.stats) stats.value = res.stats
    } catch (err) {
        console.error('Failed to fetch tournaments:', err)
        toast.error(err.data?.error || 'Gagal memuat daftar turnamen')
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    currentPage.value = 1
    fetchTournaments()
}

const resetFilters = () => {
    searchQuery.value = ''
    statusFilter.value = 'all'
    quotaFilter.value = 'all'
    sortBy.value = 'created_at'
    sortOrder.value = 'desc'
    currentPage.value = 1
    fetchTournaments()
}

const toggleSort = (col) => {
    if (sortBy.value === col) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = col
        sortOrder.value = 'desc'
    }
    fetchTournaments()
}

const changePage = (p) => {
    if (p < 1 || p > meta.value.total_pages) return
    currentPage.value = p
    fetchTournaments()
}

const openDeleteDialog = (item) => {
    deleteModal.value = {
        show: true,
        item,
        loading: false
    }
}

const executeDelete = async () => {
    if (!deleteModal.value.item) return
    deleteModal.value.loading = true
    try {
        const res = await api.delete(`/root/dashboard/tournaments/${deleteModal.value.item.uuid}`)
        toast.success(res.message || 'Turnamen berhasil dihapus & kuota berhasil dikembalikan')
        deleteModal.value.show = false
        fetchTournaments()
    } catch (err) {
        console.error('Failed to delete tournament:', err)
        toast.error(err.data?.error || 'Gagal menghapus turnamen')
    } finally {
        deleteModal.value.loading = false
    }
}

const getQuotaBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
        case 'elite':
            return 'bg-purple-50 text-purple-700 border-purple-200'
        case 'standard':
            return 'bg-blue-50 text-blue-700 border-blue-200'
        default:
            return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
}

const getQuotaIcon = (type) => {
    switch (type?.toLowerCase()) {
        case 'elite':
            return 'ph:crown-fill'
        case 'standard':
            return 'ph:lightning-fill'
        default:
            return 'ph:sparkle-fill'
    }
}

const formatQuotaLabel = (type) => {
    const t = String(type || 'free').toLowerCase()
    if (t === 'elite') return 'Elite'
    if (t === 'standard') return 'Standard'
    return 'Free'
}

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'published':
            return 'bg-green-50 text-green-700 border-green-200'
        case 'draft':
            return 'bg-amber-50 text-amber-700 border-amber-200'
        default:
            return 'bg-slate-100 text-slate-600 border-slate-200'
    }
}

const formatDate = (date) => {
    if (!date) return '—'
    return useDateFormat(date, 'DD MMM YYYY', { locales: 'id-ID' }).value
}

watch([statusFilter, quotaFilter], () => {
    currentPage.value = 1
    fetchTournaments()
})

onMounted(() => {
    fetchTournaments()
})
</script>
