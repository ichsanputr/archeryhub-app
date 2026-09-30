<template>
    <div class="space-y-6 md:space-y-8 pb-16 font-body text-navy antialiased">
        <!-- Header Section -->
        <DashboardHeader
            :title="t('earnings.title')"
            :subtitle="t('earnings.subtitle')"
            icon="ph:wallet-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('earnings.title') }
            ]"
        >
            <template #actions>
                <BaseButton variant="white" icon="ph:download-simple-bold" @click="handleExportExcel" :disabled="loading || earningsHistoryData.length === 0" class="h-10 sm:h-11 px-5 text-xs sm:text-sm font-bold">
                    {{ t('earnings.export_button') }}
                </BaseButton>
            </template>
        </DashboardHeader>

        <!-- Currency Selector Chips Bar -->
        <div v-if="availableCurrencyStats.length > 1" class="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-2 flex-wrap">
                <!-- All Currencies Chip -->
                <button
                    type="button"
                    @click="selectedCurrencyFilter = 'all'"
                    :class="[
                        'px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer font-bold select-none',
                        selectedCurrencyFilter === 'all'
                            ? 'bg-navy text-white shadow-sm ring-1 ring-navy/10'
                            : 'bg-slate-100/90 text-slate-600 hover:text-navy hover:bg-slate-200/80'
                    ]"
                >
                    <Icon icon="ph:globe-simple-bold" class="text-base shrink-0" />
                    <span>{{ t('earnings.filter_all_currencies', 'Semua Mata Uang') }}</span>
                </button>

                <!-- Individual Currency Chips -->
                <button
                    v-for="currStat in availableCurrencyStats"
                    :key="currStat.currency"
                    type="button"
                    @click="selectedCurrencyFilter = currStat.currency"
                    :class="[
                        'px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer font-bold select-none',
                        selectedCurrencyFilter === currStat.currency
                            ? 'bg-navy text-white shadow-sm ring-1 ring-navy/10'
                            : 'bg-slate-100/90 text-slate-600 hover:text-navy hover:bg-slate-200/80'
                    ]"
                >
                    <Icon :icon="currStat.icon || 'ph:money-bold'" class="text-base shrink-0" />
                    <span>{{ currStat.label }}</span>
                </button>
            </div>

            <!-- Currency Switcher Tip -->
            <div class="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400 pr-2">
                <Icon icon="ph:funnel-bold" class="text-sm text-slate-400" />
                <span>{{ isEn ? 'Showing data for:' : 'Menampilkan data:' }} <strong class="text-navy font-bold">{{ selectedCurrencyFilter === 'all' ? (isEn ? 'All Currencies' : 'Semua Mata Uang') : selectedCurrencyFilter }}</strong></span>
            </div>
        </div>

        <!-- Filter Dialog Modal Component -->
        <EarningsFilterModal
            v-model:show="showFilterModal"
            :current-filters="filterState"
            :currency-symbol="activeCurrencySymbol"
            @apply="handleApplyModalFilters"
            @reset="resetAllFilters"
        />

        <!-- KPI Summary Cards (Only shown when a specific currency is active or only 1 currency exists) -->
        <div
            v-if="selectedCurrencyFilter !== 'all' || availableCurrencyStats.length <= 1"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 animate-in fade-in duration-200"
        >
            <StatCard
                :title="t('earnings.stats_total')"
                :value="totalEarningsFormatted"
                icon="ph:wallet-bold"
                color="primary"
                :description="t('earnings.stats_total_desc')"
                description-icon="ph:coins-bold"
            />
            <StatCard
                :title="t('earnings.stats_monthly')"
                :value="monthlyEarningsFormatted"
                icon="ph:trend-up-bold"
                color="primary"
                :description="t('earnings.stats_monthly_desc')"
                description-icon="ph:calendar-check-bold"
            />
            <StatCard
                :title="t('earnings.stats_archers')"
                :value="totalParticipantsCount"
                icon="ph:users-three-bold"
                color="primary"
                :description="t('earnings.stats_archers_desc')"
                description-icon="ph:user-circle-check-bold"
            />
            <StatCard
                :title="t('earnings.stats_completed_events')"
                :value="filteredEarningsHistoryData.length"
                icon="ph:trophy-bold"
                color="primary"
                :description="t('earnings.stats_completed_desc')"
                description-icon="ph:check-circle-bold"
            />
        </div>

        <!-- Unified DashboardDataTable (Category A: Modal Filter & Search) -->
        <DashboardDataTable
            :items="filteredEarningsHistoryData"
            :columns="tableColumns"
            :loading="loading"
            :searchable="true"
            :search-placeholder="t('earnings.search_placeholder') || 'Cari event turnamen...'"
            :has-filter-modal="true"
            :filter-button-label="t('common.filter', 'Filter')"
            :active-filter-count="activeFilterCount"
            :active-filter-chips="activeFilterChips"
            :show-reset-button="hasActiveFilters"
            count-icon="ph:receipt-bold"
            :count-unit="t('earnings.events_unit')"
            :show-count-badge="true"
            :empty-title="t('earnings.empty_title')"
            :empty-description="t('earnings.empty_desc')"
            empty-icon="ph:receipt-x"
            @search="handleTableSearch"
            @open-filter="showFilterModal = true"
            @reset-filters="resetAllFilters"
            @remove-chip="removeFilterChip"
        >
            <!-- Event Column Slot -->
            <template #item-event="{ item }">
                <div class="space-y-0.5">
                    <div class="font-bold text-xs sm:text-sm text-navy hover:text-primary transition-colors leading-tight">
                        {{ item.eventName }}
                    </div>
                    <div class="text-xs text-slate-400 font-medium">{{ item.category }}</div>
                </div>
            </template>

            <!-- Date Column Slot -->
            <template #item-date="{ item }">
                <span class="text-xs sm:text-sm text-slate-600 font-medium whitespace-nowrap">
                    {{ formatItemDate(item.date) }}
                </span>
            </template>

            <!-- Participants Column Slot -->
            <template #item-participants="{ item }">
                <div class="flex justify-center">
                    <span class="px-2.5 py-1 bg-navy/5 text-navy text-xs font-bold rounded-lg border border-navy/10 whitespace-nowrap">
                        {{ item.participants }} {{ t('earnings.participants_label') }}
                    </span>
                </div>
            </template>

            <!-- Amount Column Slot -->
            <template #item-amount="{ item }">
                <div class="flex items-center justify-end gap-2">
                    <span class="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                        {{ item.currency || 'IDR' }}
                    </span>
                    <span class="text-right font-bold text-navy text-xs sm:text-sm tabular-nums">
                        {{ formatMoney(item.amount || 0, item.currency || 'IDR') }}
                    </span>
                </div>
            </template>

            <!-- Actions Column Slot -->
            <template #actions="{ item }">
                <div class="flex justify-center">
                    <NuxtLink :to="`/dashboard/organizer/earnings/${item.slug || item.id}`" class="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-navy transition-colors inline-flex items-center justify-center" :title="t('earnings.view_details')">
                        <Icon icon="ph:eye-bold" class="text-lg" />
                    </NuxtLink>
                </div>
            </template>
        </DashboardDataTable>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { exportToExcel } from '~/utils/exportExcel'
import { formatMoney, getCurrencySymbol } from '~/composables/useCurrency'
import StatCard from '~/components/common/StatCard.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import EarningsFilterModal from '~/components/dashboard/EarningsFilterModal.vue'

const api = useApi()
const router = useRouter()
const { t, locale } = useI18n()
const toast = useToast()

const isEn = computed(() => (locale.value || 'id') === 'en')

definePageMeta({
    layout: 'dashboard'
})

useHead(() => ({
    title: t('earnings.title') + ' - Archeris Dashboard'
}))

const earningsHistoryData = ref([])
const loading = ref(true)
const selectedCurrencyFilter = ref('all')
const showFilterModal = ref(false)
const tableSearchQuery = ref('')

const defaultFilterState = () => ({
    datePreset: 'all',
    startDate: '',
    endDate: '',
    minAmount: null,
    maxAmount: null,
    minParticipants: null,
    sortBy: 'date_desc'
})

const filterState = ref(defaultFilterState())

const activeCurrencySymbol = computed(() => {
    if (selectedCurrencyFilter.value !== 'all') {
        return getCurrencySymbol(selectedCurrencyFilter.value)
    }
    return 'Rp'
})

const availableCurrencyStats = computed(() => {
    const map = {}
    for (const item of earningsHistoryData.value) {
        const curr = (item.currency || 'IDR').toUpperCase()
        if (!map[curr]) {
            map[curr] = {
                currency: curr,
                label: curr === 'IDR' ? 'Rupiah (IDR)' : curr === 'USD' ? 'US Dollar (USD)' : curr,
                icon: curr === 'IDR' ? 'circle-flags:id' : curr === 'USD' ? 'circle-flags:us' : 'ph:money-bold',
                count: 0,
                total: 0
            }
        }
        map[curr].count += 1
        map[curr].total += (item.amount || 0)
    }

    return Object.values(map)
})

const filteredEarningsHistoryData = computed(() => {
    let list = earningsHistoryData.value

    // 1. Currency filter
    if (selectedCurrencyFilter.value !== 'all') {
        list = list.filter(item => (item.currency || 'IDR').toUpperCase() === selectedCurrencyFilter.value)
    }

    // 2. Search query from table
    if (tableSearchQuery.value) {
        const q = tableSearchQuery.value.toLowerCase().trim()
        list = list.filter(item =>
            (item.eventName || '').toLowerCase().includes(q) ||
            (item.category || '').toLowerCase().includes(q)
        )
    }

    // 3. Date range filter
    if (filterState.value.startDate) {
        list = list.filter(item => new Date(item.date) >= new Date(filterState.value.startDate))
    }
    if (filterState.value.endDate) {
        list = list.filter(item => new Date(item.date) <= new Date(filterState.value.endDate + 'T23:59:59'))
    }

    // 4. Amount range filter
    if (filterState.value.minAmount !== null && filterState.value.minAmount !== undefined && filterState.value.minAmount > 0) {
        list = list.filter(item => (item.amount || 0) >= Number(filterState.value.minAmount))
    }
    if (filterState.value.maxAmount !== null && filterState.value.maxAmount !== undefined && filterState.value.maxAmount > 0) {
        list = list.filter(item => (item.amount || 0) <= Number(filterState.value.maxAmount))
    }

    // 5. Min participants filter
    if (filterState.value.minParticipants !== null && filterState.value.minParticipants !== undefined && filterState.value.minParticipants > 0) {
        list = list.filter(item => (item.participants || 0) >= Number(filterState.value.minParticipants))
    }

    // 6. Sorting
    list = [...list].sort((a, b) => {
        if (filterState.value.sortBy === 'amount_desc') return (b.amount || 0) - (a.amount || 0)
        if (filterState.value.sortBy === 'amount_asc') return (a.amount || 0) - (b.amount || 0)
        if (filterState.value.sortBy === 'participants_desc') return (b.participants || 0) - (a.participants || 0)
        if (filterState.value.sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime()
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    return list
})

const activeFilterCount = computed(() => {
    let count = 0
    if (filterState.value.datePreset !== 'all' || filterState.value.startDate || filterState.value.endDate) count++
    if (filterState.value.minAmount || filterState.value.maxAmount) count++
    if (filterState.value.minParticipants) count++
    if (filterState.value.sortBy !== 'date_desc') count++
    return count
})

const hasActiveFilters = computed(() => {
    return activeFilterCount.value > 0 || !!tableSearchQuery.value
})

const activeFilterChips = computed(() => {
    const chips = []

    if (filterState.value.datePreset !== 'all' && filterState.value.datePreset !== 'custom') {
        const labelMap = {
            this_month: isEn.value ? 'Period: This Month' : 'Periode: Bulan Ini',
            last_30_days: isEn.value ? 'Period: Last 30 Days' : 'Periode: 30 Hari Terakhir',
            this_year: isEn.value ? 'Period: This Year' : 'Periode: Tahun Ini'
        }
        chips.push({ key: 'datePreset', label: labelMap[filterState.value.datePreset] || filterState.value.datePreset })
    } else if (filterState.value.startDate || filterState.value.endDate) {
        const s = filterState.value.startDate || '...'
        const e = filterState.value.endDate || '...'
        chips.push({ key: 'dateRange', label: `${s} - ${e}` })
    }

    if (filterState.value.minAmount && filterState.value.maxAmount) {
        chips.push({
            key: 'amountRange',
            label: `${formatMoney(filterState.value.minAmount, selectedCurrencyFilter.value !== 'all' ? selectedCurrencyFilter.value : 'IDR')} - ${formatMoney(filterState.value.maxAmount, selectedCurrencyFilter.value !== 'all' ? selectedCurrencyFilter.value : 'IDR')}`
        })
    } else if (filterState.value.minAmount) {
        chips.push({
            key: 'minAmount',
            label: `≥ ${formatMoney(filterState.value.minAmount, selectedCurrencyFilter.value !== 'all' ? selectedCurrencyFilter.value : 'IDR')}`
        })
    } else if (filterState.value.maxAmount) {
        chips.push({
            key: 'maxAmount',
            label: `≤ ${formatMoney(filterState.value.maxAmount, selectedCurrencyFilter.value !== 'all' ? selectedCurrencyFilter.value : 'IDR')}`
        })
    }

    if (filterState.value.minParticipants) {
        chips.push({
            key: 'minParticipants',
            label: `≥ ${filterState.value.minParticipants} ${isEn.value ? 'Archers' : 'Pemanah'}`
        })
    }

    if (filterState.value.sortBy !== 'date_desc') {
        const sortMap = {
            date_asc: isEn.value ? 'Oldest Date' : 'Tanggal Terlama',
            amount_desc: isEn.value ? 'Highest Revenue' : 'Pendapatan Tertinggi',
            amount_asc: isEn.value ? 'Lowest Revenue' : 'Pendapatan Terendah',
            participants_desc: isEn.value ? 'Most Participants' : 'Peserta Terbanyak'
        }
        chips.push({ key: 'sortBy', label: sortMap[filterState.value.sortBy] || filterState.value.sortBy })
    }

    return chips
})

const handleTableSearch = (query) => {
    tableSearchQuery.value = query
}

const handleApplyModalFilters = (applied) => {
    filterState.value = { ...applied }
}

const resetAllFilters = () => {
    filterState.value = defaultFilterState()
    tableSearchQuery.value = ''
}

const removeFilterChip = (key) => {
    if (key === 'datePreset' || key === 'dateRange') {
        filterState.value.datePreset = 'all'
        filterState.value.startDate = ''
        filterState.value.endDate = ''
    } else if (key === 'amountRange' || key === 'minAmount' || key === 'maxAmount') {
        filterState.value.minAmount = null
        filterState.value.maxAmount = null
    } else if (key === 'minParticipants') {
        filterState.value.minParticipants = null
    } else if (key === 'sortBy') {
        filterState.value.sortBy = 'date_desc'
    }
}

const tableColumns = computed(() => [
    { key: 'event', label: t('earnings.table_header_event'), sortable: true, sortKey: 'eventName', class: 'min-w-[240px]' },
    { key: 'date', label: t('earnings.table_header_date'), sortable: true, sortKey: 'date', class: 'min-w-[150px]' },
    { key: 'participants', label: t('earnings.table_header_participants'), sortable: true, sortKey: 'participants', align: 'center', class: 'min-w-[140px]' },
    { key: 'amount', label: t('earnings.table_header_earnings'), sortable: true, sortKey: 'amount', align: 'right', class: 'min-w-[170px]' }
])

const fetchEarnings = async () => {
    try {
        loading.value = true
        const res = await api.get('/organizers/earnings')
        const raw = res?.data || res || []
        earningsHistoryData.value = Array.isArray(raw) ? raw.filter(item => (item.amount || 0) > 0) : []
    } catch (error) {
        console.error('Failed to fetch earnings:', error)
    } finally {
        loading.value = false
    }
}

const totalParticipantsCount = computed(() => {
    return filteredEarningsHistoryData.value.reduce((acc, curr) => acc + (curr.participants || 0), 0)
})

const activeStatCurrency = computed(() => {
    if (selectedCurrencyFilter.value !== 'all') return selectedCurrencyFilter.value
    return availableCurrencyStats.value[0]?.currency || 'IDR'
})

const totalEarningsFormatted = computed(() => {
    const total = filteredEarningsHistoryData.value.reduce((acc, curr) => acc + (curr.amount || 0), 0)
    return formatMoney(total, activeStatCurrency.value)
})

const monthlyEarningsFormatted = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const total = filteredEarningsHistoryData.value.reduce((acc, item) => {
        const itemDate = new Date(item.date)
        if (itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear) {
            return acc + (item.amount || 0)
        }
        return acc
    }, 0)
    return formatMoney(total, activeStatCurrency.value)
})

const formatItemDate = (dateString) => {
    if (!dateString) return '-'
    const isId = (locale.value || 'id') === 'id'
    const loc = isId ? 'id-ID' : 'en-US'
    return new Date(dateString).toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' })
}

const handleExportExcel = async () => {
    if (filteredEarningsHistoryData.value.length === 0) {
        toast.info(t('earnings.export_empty_info'))
        return
    }

    try {
        const columns = [
            { header: t('earnings.table_header_event', 'Turnamen'), key: 'eventName', width: 35 },
            { header: t('earnings.table_header_category', 'Kategori'), key: 'category', width: 25 },
            { header: t('earnings.table_header_date', 'Tanggal'), key: 'dateFormatted', width: 20 },
            { header: t('earnings.table_header_participants', 'Peserta'), key: 'participants', width: 15 },
            { header: 'Mata Uang', key: 'currency', width: 15 },
            { header: t('earnings.table_header_earnings', 'Pendapatan'), key: 'amountFormatted', width: 25 }
        ]

        const dataToExport = filteredEarningsHistoryData.value.map(item => ({
            eventName: item.eventName,
            category: item.category,
            dateFormatted: formatItemDate(item.date),
            participants: item.participants,
            currency: (item.currency || 'IDR').toUpperCase(),
            amountFormatted: formatMoney(item.amount || 0, item.currency || 'IDR')
        }))

        const currencySuffix = selectedCurrencyFilter.value === 'all' ? 'All' : selectedCurrencyFilter.value
        await exportToExcel(
            dataToExport,
            columns,
            `Ringkasan_Pendapatan_${currencySuffix}_${new Date().toISOString().split('T')[0]}`,
            'Pendapatan'
        )
        toast.success(t('earnings.export_success'))
    } catch (error) {
        console.error('Failed to export earnings to excel:', error)
        toast.error(t('earnings.export_error'))
    }
}

onMounted(() => {
    fetchEarnings()
})
</script>
