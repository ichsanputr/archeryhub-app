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

        <!-- KPI Summary Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <StatCard
                :title="t('earnings.stats_total')"
                :value="'Rp ' + (totalEarningsAmount || 0).toLocaleString('id-ID')"
                icon="ph:wallet-bold"
                color="primary"
                :description="t('earnings.stats_total_desc')"
                description-icon="ph:coins-bold"
            />
            <StatCard
                :title="t('earnings.stats_monthly')"
                :value="'Rp ' + (monthlyEarnings || 0).toLocaleString('id-ID')"
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
                :value="earningsHistoryData.length"
                icon="ph:trophy-bold"
                color="primary"
                :description="t('earnings.stats_completed_desc')"
                description-icon="ph:check-circle-bold"
            />
        </div>

        <!-- Unified DashboardDataTable -->
        <DashboardDataTable
            :items="earningsHistoryData"
            :columns="tableColumns"
            :loading="loading"
            :searchable="true"
            :search-placeholder="t('earnings.search_placeholder') || 'Cari event turnamen...'"
            count-icon="ph:receipt-bold"
            :count-unit="t('earnings.events_unit')"
            :empty-title="t('earnings.empty_title')"
            :empty-description="t('earnings.empty_desc')"
            empty-icon="ph:receipt-x"
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
                    <span class="px-2.5 py-1 bg-navy/5 text-navy text-xs font-black rounded-lg border border-navy/10 whitespace-nowrap">
                        {{ item.participants }} {{ t('earnings.participants_label') }}
                    </span>
                </div>
            </template>

            <!-- Amount Column Slot -->
            <template #item-amount="{ item }">
                <div class="text-right font-black text-navy text-xs sm:text-sm tabular-nums">
                    Rp {{ (item.amount || 0).toLocaleString('id-ID') }}
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
import StatCard from '~/components/common/StatCard.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const api = useApi()
const router = useRouter()
const { t, locale } = useI18n()
const toast = useToast()

definePageMeta({
    layout: 'dashboard'
})

useHead(() => ({
    title: t('earnings.title') + ' - Archeris Dashboard'
}))

const earningsHistoryData = ref([])
const loading = ref(true)

const tableColumns = computed(() => [
    { key: 'event', label: t('earnings.table_header_event'), sortable: true, sortKey: 'eventName', class: 'min-w-[240px]' },
    { key: 'date', label: t('earnings.table_header_date'), sortable: true, sortKey: 'date', class: 'min-w-[150px]' },
    { key: 'participants', label: t('earnings.table_header_participants'), sortable: true, sortKey: 'participants', align: 'center', class: 'min-w-[140px]' },
    { key: 'amount', label: t('earnings.table_header_earnings'), sortable: true, sortKey: 'amount', align: 'right', class: 'min-w-[150px]' }
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

const totalEarningsAmount = computed(() => {
    return earningsHistoryData.value.reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const totalParticipantsCount = computed(() => {
    return earningsHistoryData.value.reduce((acc, curr) => acc + (curr.participants || 0), 0)
})

const monthlyEarnings = computed(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return earningsHistoryData.value
        .filter(item => {
            const itemDate = new Date(item.date)
            return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear
        })
        .reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const formatItemDate = (dateString) => {
    if (!dateString) return '-'
    const isId = (locale.value || 'id') === 'id'
    const loc = isId ? 'id-ID' : 'en-US'
    return new Date(dateString).toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' })
}

const handleExportExcel = async () => {
    if (earningsHistoryData.value.length === 0) {
        toast.info(t('earnings.export_empty_info'))
        return
    }

    try {
        const columns = [
            { header: t('earnings.export_col_event'), key: 'eventName', width: 35 },
            { header: t('earnings.export_col_category'), key: 'category', width: 25 },
            { header: t('earnings.export_col_date'), key: 'dateFormatted', width: 20 },
            { header: t('earnings.export_col_participants'), key: 'participants', width: 15 },
            { header: t('earnings.export_col_earnings'), key: 'amountFormatted', width: 25 }
        ]

        const dataToExport = earningsHistoryData.value.map(item => ({
            eventName: item.eventName,
            category: item.category,
            dateFormatted: formatItemDate(item.date),
            participants: item.participants,
            amountFormatted: `Rp ${(item.amount || 0).toLocaleString('id-ID')}`
        }))

        await exportToExcel(
            dataToExport,
            columns,
            `Ringkasan_Pendapatan_Turnamen_${new Date().toISOString().split('T')[0]}`,
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
