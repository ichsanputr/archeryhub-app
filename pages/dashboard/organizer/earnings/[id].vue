<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <button @click="router.back()"
                        class="size-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <Icon icon="ph:arrow-left-bold" class="text-white text-xl" />
                    </button>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ eventName || t('earnings.detail_title') }}</h1>
                        <div class="text-slate-300 text-xs sm:text-sm font-medium mt-1">{{ t('earnings.detail_subtitle') }}</div>
                    </div>
                </div>
                <div class="flex gap-3">
                    <div class="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/20 text-right">
                        <div class="text-[10px] font-black tracking-wider text-primary">{{ t('earnings.total_event') }}</div>
                        <div class="text-xl font-black tabular-nums">Rp {{ totalAmount.toLocaleString('id-ID') }}</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Filter & Search -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end justify-between">
            <div class="flex-grow w-full">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass"
                    :placeholder="t('earnings.search_placeholder')" :label="t('earnings.search_label')" />
            </div>
            <div class="shrink-0 w-full md:w-auto">
                <BaseButton variant="outline" icon="ph:download-simple-bold" @click="handleExportPayments" :disabled="loading" class="h-11 px-5 w-full md:w-auto">
                    {{ t('earnings.export_button', 'Export CSV') }}
                </BaseButton>
            </div>
        </div>

        <!-- Payments Table -->
        <div class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="bg-gray-50/50 text-gray-500 font-bold text-[10px] tracking-widest border-b border-gray-100">
                            <th @click="toggleSort('participant')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('earnings.table_participant') }}</span>
                                    <Icon v-if="sortBy === 'participant'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('date')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('earnings.table_date') }}</span>
                                    <Icon v-if="sortBy === 'date'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('method')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('earnings.table_method') }}</span>
                                    <Icon v-if="sortBy === 'method'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('reference')" class="px-6 py-4 cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('earnings.table_reference') }}</span>
                                    <Icon v-if="sortBy === 'reference'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                            <th @click="toggleSort('amount')" class="px-6 py-4 text-right cursor-pointer hover:text-navy transition-colors select-none">
                                <div class="flex items-center justify-end gap-1.5">
                                    <span>{{ t('earnings.table_amount') }}</span>
                                    <Icon v-if="sortBy === 'amount'" :icon="sortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary text-xs" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30 text-xs" />
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="payment in filteredPayments" :key="payment.id"
                            class="hover:bg-gray-50 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="font-bold text-navy leading-tight">{{ payment.archerName }}</div>
                                <div class="text-[10px] text-gray-400 font-medium mt-0.5">{{ payment.archerEmail }}
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                                {{ formatPaymentDate(payment.createdAt) }}
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-lg ">
                                    {{ payment.method }}
                                </span>
                            </td>
                            <td class="px-6 py-4 font-mono text-xs text-gray-400">
                                {{ payment.reference }}
                            </td>
                            <td class="px-6 py-4 text-right font-black text-navy tabular-nums">
                                Rp {{ payment.amount.toLocaleString('id-ID') }}
                            </td>
                        </tr>
                        <tr v-if="!loading && filteredPayments.length === 0">
                            <td colspan="5" class="px-6 py-12 text-center">
                                <Icon icon="ph:mask-sad" class="text-4xl text-gray-200 mx-auto mb-2" />
                                <div class="text-gray-400">{{ t('earnings.no_data') }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div v-if="loading" class="p-12 text-center">
                <Icon icon="ph:circle-notch-bold" class="text-3xl text-primary animate-spin mx-auto" />
                <div class="text-gray-400 mt-2 text-sm font-medium">{{ t('earnings.loading') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useDateFormat } from '@vueuse/core'
import { useToast } from '~/composables/useToast'
import { exportToExcel } from '~/utils/exportExcel'

const route = useRoute()
const router = useRouter()
const api = useApi()
const { t } = useI18n()
const toast = useToast()

definePageMeta({
    layout: 'dashboard',
    middleware: ['auth']
})

useHead({
    title: computed(() => t('earnings.event_detail', 'Event Earnings Detail') + ' - Archeris Dashboard')
})

const eventId = route.params.id
const eventName = ref('')
const payments = ref([])
const loading = ref(true)
const searchQuery = ref('')

const sortBy = ref('date')
const sortOrder = ref('desc')

const toggleSort = (column) => {
    if (sortBy.value === column) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = column
        sortOrder.value = 'asc'
    }
}

const fetchDetails = async () => {
    try {
        loading.value = true
        const res = await api.get(`/organizers/earnings/${eventId}`)
        eventName.value = res.eventName
        payments.value = res.payments || []
    } catch (error) {
        console.error('Failed to fetch details:', error)
    } finally {
        loading.value = false
    }
}

const totalAmount = computed(() => {
    return payments.value.reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const filteredPayments = computed(() => {
    let list = payments.value || []
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        list = list.filter(p =>
            (p.archerName && p.archerName.toLowerCase().includes(q)) ||
            (p.reference && p.reference.toLowerCase().includes(q)) ||
            (p.archerEmail && p.archerEmail.toLowerCase().includes(q)) ||
            (p.method && p.method.toLowerCase().includes(q))
        )
    }

    const dir = sortOrder.value === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
        if (sortBy.value === 'participant') {
            return dir * (a.archerName || '').localeCompare(b.archerName || '', undefined, { numeric: true, sensitivity: 'base' })
        }
        if (sortBy.value === 'date') {
            const tA = new Date(a.createdAt || 0).getTime()
            const tB = new Date(b.createdAt || 0).getTime()
            return dir * (tA - tB)
        }
        if (sortBy.value === 'method') {
            return dir * (a.method || '').localeCompare(b.method || '')
        }
        if (sortBy.value === 'reference') {
            return dir * (a.reference || '').localeCompare(b.reference || '')
        }
        if (sortBy.value === 'amount') {
            return dir * ((a.amount || 0) - (b.amount || 0))
        }
        return 0
    })
})

const formatPaymentDate = (date) => {
    if (!date) return '-'
    return useDateFormat(date, 'DD MMM YYYY, HH:mm', { locales: 'id-ID' }).value
}

const handleExportPayments = () => {
    const list = filteredPayments.value
    if (!list || list.length === 0) {
        toast.info(t('earnings.no_data_export', 'No payment data available to export'))
        return
    }

    const data = list.map((item, idx) => ({
        no: idx + 1,
        archerName: item.archerName || '-',
        archerEmail: item.archerEmail || '-',
        date: formatPaymentDate(item.createdAt),
        method: item.method || '-',
        reference: item.reference || '-',
        amount: item.amount || 0
    }))

    const safeEventName = (eventName.value || 'Event').replace(/[^a-zA-Z0-9_-]/g, '_')
    exportToExcel(
        `Archeris_Earnings_${safeEventName}`,
        [
            { key: 'no', label: 'No' },
            { key: 'archerName', label: t('earnings.table_participant', 'Participant') },
            { key: 'archerEmail', label: 'Email' },
            { key: 'date', label: t('earnings.table_date', 'Payment Date') },
            { key: 'method', label: t('earnings.table_method', 'Method') },
            { key: 'reference', label: t('earnings.table_reference', 'Reference No') },
            { key: 'amount', label: t('earnings.table_amount', 'Amount (IDR)') }
        ],
        data
    )
    toast.success(t('earnings.export_success', 'Payment logs exported successfully'))
}

onMounted(() => {
    fetchDetails()
})
</script>
