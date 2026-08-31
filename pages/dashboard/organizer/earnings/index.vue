<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <DashboardHeader
            :title="t('earnings.title')"
            :subtitle="t('earnings.subtitle')"
            icon="ph:wallet-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('earnings.title') }
            ]"
        />


        <!-- Earnings Table -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 class="font-black text-navy tracking-widest text-sm">{{ t('earnings.table_header_event') }}</h3>
                <div class="flex gap-2">
                    <BaseButton variant="outline" size="xs" icon="ph:download-simple-bold" @click="handleExportExcel">{{ t('earnings.export_button', 'Ekspor Excel') }}</BaseButton>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="bg-gray-50/50 text-gray-500 font-bold text-[10px] tracking-widest border-b border-gray-100">
                            <th class="px-6 py-4">{{ t('earnings.table_header_event') }}</th>
                            <th class="px-6 py-4">{{ t('earnings.table_header_date') }}</th>
                            <th class="px-6 py-4">{{ t('earnings.table_header_participants') }}</th>
                            <th class="px-6 py-4 text-right">{{ t('earnings.table_header_earnings') }}</th>
                            <th class="px-6 py-4 text-center">{{ t('earnings.table_header_actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-if="loading">
                            <td colspan="5" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center justify-center gap-3">
                                    <div class="h-10 w-10 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                                    <div class="text-xs text-gray-400 font-medium">{{ t('earnings.loading', 'Memuat data pendapatan...') }}</div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else-if="!loading && earningsHistory.length === 0">
                            <td colspan="5" class="px-6 py-20 text-center">
                                <div class="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                                    <div class="size-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                                        <Icon icon="ph:receipt-x" class="text-4xl text-gray-300" />
                                    </div>
                                    <div class="space-y-1">
                                        <div class="text-base font-bold text-navy">{{ t('earnings.empty_title', 'Belum Ada Pendapatan') }}</div>
                                        <div class="text-xs text-gray-500 font-medium leading-relaxed">
                                            {{ t('earnings.empty_desc', 'Riwayat pendapatan dan penjualan tiket dari event yang Anda selenggarakan akan ditampilkan di sini.') }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-else v-for="item in earningsHistory" :key="item.id"
                            class="hover:bg-gray-50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="font-bold text-navy group-hover:text-primary transition-colors">{{
                                    item.eventName
                                    }}</div>
                                <div class="text-[10px] text-gray-400 font-medium">{{ item.category }}</div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                                {{ formatItemDate(item.date) }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 bg-navy/5 text-navy text-[10px] font-black rounded-lg">{{
                                    item.participants
                                    }} {{ t('earnings.participants_label') }}</span>
                            </td>
                            <td class="px-6 py-4 text-right font-bold text-navy">
                                Rp {{ item.amount.toLocaleString('id-ID') }}
                            </td>
                            <td class="px-6 py-4 text-center">
                                <NuxtLink :to="`/dashboard/organizer/earnings/${item.id}`">
                                    <button
                                        class="p-2 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary transition-colors">
                                        <Icon icon="ph:eye-bold" class="text-lg" />
                                    </button>
                                </NuxtLink>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useApi } from '~/composables/useApi'
import { useRouter } from 'vue-router'
import { useDateFormat } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const api = useApi()
const router = useRouter()
const { t } = useI18n()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: computed(() => t('earnings.title') + ' - ArcheryHub Dashboard')
})

const earningsHistoryData = ref([])
const loading = ref(true)

const fetchEarnings = async () => {
    try {
        loading.value = true
        // Get earnings summary for this org
        const res = await api.get('/organizers/earnings')
        earningsHistoryData.value = res?.data || res || []
    } catch (error) {
        console.error('Failed to fetch earnings:', error)
    } finally {
        loading.value = false
    }
}

const totalEarningsAmount = computed(() => {
    return earningsHistoryData.value.reduce((acc, curr) => acc + curr.amount, 0)
})

const earningsHistory = computed(() => earningsHistoryData.value.filter(item => (item.amount || 0) > 0))

const monthlyEarnings = computed(() => {
    // Basic logic: filter by current month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    return earningsHistoryData.value
        .filter(item => {
            const d = new Date(item.date)
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear
        })
        .reduce((acc, curr) => acc + curr.amount, 0)
})

const mostActiveEvent = computed(() => {
    if (!earningsHistoryData.value.length) return null
    return [...earningsHistoryData.value].sort((a, b) => b.participants - a.participants)[0]
})

const formatItemDate = (date) => {
    if (!date) return '-'
    return useDateFormat(date, 'DD MMM YYYY', { locales: 'id-ID' }).value
}

import { exportToExcel } from '~/utils/exportExcel'

const handleExportExcel = () => {
    const data = earningsHistoryData.value.map((item, idx) => ({
        no: idx + 1,
        eventName: item.eventName || '-',
        category: item.category || '-',
        date: formatItemDate(item.date),
        participants: item.participants || 0,
        amount: item.amount || 0
    }))
    exportToExcel(
        'Rekap_Pendapatan_Turnamen_ArcheryHub',
        [
            { key: 'no', label: 'No' },
            { key: 'eventName', label: 'Nama Event' },
            { key: 'category', label: 'Tipe / Kategori' },
            { key: 'date', label: 'Tanggal Selesai' },
            { key: 'participants', label: 'Jumlah Peserta' },
            { key: 'amount', label: 'Total Pendapatan (IDR)' }
        ],
        data
    )
}

onMounted(() => {
    fetchEarnings()
})
</script>
