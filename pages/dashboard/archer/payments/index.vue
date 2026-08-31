<template>
    <div class="space-y-6 pb-12">
        <!-- Header (Identical to Cart Page Header) -->
        <DashboardHeader
            :title="t('payments.title')"
            :subtitle="t('payments.desc')"
            icon="ph:credit-card-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/archer' },
                { label: t('payments.title') }
            ]"
        />

        <!-- Search & Filter Controls -->
        <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-primary/20 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <!-- Search Field -->
            <div class="relative flex-1 min-w-[240px]">
                <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none" />
                <input v-model="searchQuery" type="text"
                    :placeholder="t('archer_payments_list.search_placeholder')"
                    class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-primary focus:bg-white transition-all" />
            </div>

            <!-- Date Range & Status Filters -->
            <div class="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <BaseDatePicker v-model="dateRange" range :placeholder="t('archer_payments_list.date_range_placeholder')" class="w-full sm:w-60" />
                <BaseSelect v-model="statusFilter" :options="statusOptions" item-title="title" item-value="value" class="w-full sm:w-48 shrink-0" />
            </div>
        </div>

        <!-- Payments List -->
        <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 3" :key="i"
                class="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 animate-pulse space-y-4">
                <div class="flex justify-between items-center">
                    <div class="h-4 w-32 bg-gray-100 rounded-lg"></div>
                    <div class="h-6 w-24 bg-gray-100 rounded-full"></div>
                </div>
                <div class="h-7 w-2/3 bg-gray-100 rounded-xl"></div>
                <div class="flex justify-between items-center pt-2">
                    <div class="h-8 w-40 bg-gray-100 rounded-xl"></div>
                    <div class="h-10 w-32 bg-gray-100 rounded-2xl"></div>
                </div>
            </div>
        </div>

        <div v-else-if="filteredPayments.length === 0" class="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
            <div class="max-w-sm mx-auto space-y-4">
                <div class="size-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-300 border border-gray-100">
                    <Icon icon="ph:receipt-x-bold" class="text-4xl" />
                </div>
                <div class="text-xl font-black text-navy">{{ searchQuery || statusFilter !== 'all' ? t('archer_payments_list.no_matched_transactions') : t('payments.no_transactions') }}</div>
                <div class="text-sm text-gray-500 font-medium">{{ searchQuery || statusFilter !== 'all' ? t('archer_payments_list.no_matched_transactions_desc') : t('payments.no_transactions_desc') }}</div>
            </div>
        </div>

        <div v-else class="space-y-5">
            <div v-for="payment in filteredPayments" :key="payment.uuid"
                class="group bg-white dark:bg-slate-800 rounded-2xl border border-primary/20 shadow-xs hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden">
                
                <!-- Main Card Body -->
                <div class="p-6 md:p-8 space-y-5">
                    
                    <!-- Top Bar: Reference, Date & Status Pill -->
                    <div class="flex items-center justify-between gap-3 flex-wrap">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="font-mono text-[11px] font-bold text-navy dark:text-white bg-navy/[0.04] dark:bg-navy/40 px-2.5 py-1 rounded-lg border border-navy/15 select-all flex items-center gap-1.5">
                                <Icon icon="ph:hash-bold" class="text-[10px] text-navy/40" />
                                {{ payment.reference }}
                            </span>
                            <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/60 dark:border-slate-700 flex items-center gap-1.5">
                                <Icon icon="ph:calendar-blank-bold" class="text-xs text-slate-400" />
                                {{ formatDate(payment.created_at) }}
                            </span>
                        </div>

                        <!-- Status Badge -->
                        <div :class="getStatusClass(payment.status)"
                            class="px-2.5 py-1 rounded-lg text-[10px] font-black tracking-wider capitalize border inline-flex items-center gap-1.5 shadow-2xs">
                            <span :class="getStatusDotClass(payment.status)" class="size-1.5 rounded-full shrink-0"></span>
                            <Icon :icon="payment.status === 'paid' ? 'ph:check-circle-bold' : (payment.status === 'pending' ? 'ph:clock-bold' : 'ph:x-circle-bold')" class="text-xs shrink-0" />
                            <span>{{ getStatusLabel(payment.status) }}</span>
                        </div>
                    </div>

                    <!-- Title & Details Row -->
                    <div class="flex items-start gap-4">
                        <div class="size-12 md:size-13 rounded-xl bg-gradient-to-br from-navy/5 via-navy/[0.08] to-navy/10 dark:from-white/10 dark:to-white/5 text-navy dark:text-white flex items-center justify-center shrink-0 border border-navy/15 group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                            <Icon :icon="getPaymentIcon(payment)" class="text-2xl md:text-3xl text-navy" />
                        </div>
                        <div class="min-w-0 flex-1 space-y-1.5">
                            <h3 class="text-lg md:text-xl font-black text-navy leading-snug">
                                {{ payment.event_name || payment.plan_name || t('payments.payment_title_default') }}
                            </h3>
                            <div class="flex items-center gap-2 flex-wrap text-xs">
                                <span v-if="payment.payment_method"
                                    class="font-bold text-navy dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5 text-xs">
                                    <Icon icon="ph:credit-card-bold" class="text-slate-400 text-xs" />
                                    {{ payment.payment_method }}
                                </span>
                                <span v-if="payment.category_name"
                                    class="font-bold text-navy dark:text-primary bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/30 flex items-center gap-1.5 text-xs">
                                    <span class="size-1.5 rounded-full bg-primary shrink-0"></span>
                                    {{ payment.category_name }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Financial Summary & Clean Report Action -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div>
                            <div class="text-[11px] font-black text-slate-400 dark:text-slate-500 capitalize tracking-wider">{{ t("archer_payments_list.total_bill") }}</div>
                            <div class="text-2xl sm:text-3xl font-black text-navy dark:text-white tracking-tight mt-0.5">
                                {{ formatCurrency(payment.total_amount || payment.amount) }}
                            </div>
                            <div v-if="payment.fee_amount > 0" class="text-xs text-slate-400 font-semibold mt-0.5">
                                {{ t("archer_payments_list.base_fee") }} {{ formatCurrency(payment.amount) }} + {{ t("archer_payments_list.service_fee") }} {{ formatCurrency(payment.fee_amount) }}
                            </div>
                        </div>

                        <!-- Inline Expanded Details Toggle Button -->
                        <div class="flex items-center gap-3 self-stretch sm:self-auto">
                            <button
                                type="button"
                                @click="toggleExpanded(payment)"
                                class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-primary/30 hover:border-primary bg-primary/10 hover:bg-primary/20 text-navy dark:text-white font-bold text-xs transition-all shadow-xs active:scale-95">
                                <Icon icon="ph:receipt-bold" class="text-primary text-sm" />
                                <span>{{ expandedPaymentId === getItemKey(payment) ? t('archer_payments_list.hide_details') : t('archer_payments_list.view_details') }}</span>
                                <Icon :icon="expandedPaymentId === getItemKey(payment) ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" class="text-xs transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Pure Report Expanded Breakdown Panel -->
                <div v-if="expandedPaymentId === getItemKey(payment)"
                    class="border-t border-slate-100 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 p-6 md:p-8 space-y-6 animate-in fade-in duration-200">
                    
                    <!-- Header of Expanded Report -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2 text-xs font-black text-navy dark:text-white capitalize tracking-wider">
                            <Icon icon="ph:file-text-bold" class="text-primary text-base" />
                            <span>{{ t('archer_payments_list.breakdown_title') }}</span>
                        </div>
                        <span class="text-[10px] font-bold text-slate-400">
                            {{ t('archer_payments_list.record_note') }}
                        </span>
                    </div>

                    <!-- Meta Grid (4 Columns) -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-primary/20 shadow-2xs text-xs">
                        <div>
                            <span class="text-slate-400 font-bold block text-[10px] tracking-wider capitalize mb-1">{{ t('archer_payments_list.ref_no') }}</span>
                            <span class="font-mono text-navy dark:text-white font-black text-xs select-all">{{ payment.reference }}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 font-bold block text-[10px] tracking-wider capitalize mb-1">{{ t('archer_payments_list.date_time') }}</span>
                            <span class="text-navy dark:text-white font-bold text-xs">{{ formatDate(payment.created_at) }}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 font-bold block text-[10px] tracking-wider capitalize mb-1">{{ t('archer_payments_list.payment_method_label') }}</span>
                            <span class="text-navy dark:text-white font-bold text-xs capitalize">{{ payment.payment_method || '-' }}</span>
                        </div>
                        <div>
                            <span class="text-slate-400 font-bold block text-[10px] tracking-wider capitalize mb-1">{{ t('archer_payments_list.status_label') }}</span>
                            <span class="inline-flex px-2.5 py-0.5 rounded-lg text-[10px] font-black tracking-wider capitalize" :class="getStatusClass(payment.status)">
                                {{ getStatusLabel(payment.status) }}
                            </span>
                        </div>
                    </div>

                    <!-- Cost Breakdown Itemization Table -->
                    <div class="bg-white dark:bg-slate-800 rounded-xl border border-primary/20 overflow-hidden shadow-2xs">
                        <div class="px-4 py-3 bg-slate-50/80 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] font-black text-slate-500 dark:text-slate-400 capitalize tracking-wider">
                            <span>{{ t('archer_payments_list.item_description') }}</span>
                            <span>{{ t('archer_payments_list.item_subtotal') }}</span>
                        </div>
                        <div class="p-4 space-y-3 text-xs">
                            <!-- Main Item Row -->
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="font-black text-navy dark:text-white">
                                        {{ payment.event_name || payment.plan_name || t('payments.payment_title_default') }}
                                    </div>
                                    <div v-if="payment.category_name" class="text-[11px] text-slate-400 mt-0.5">
                                        {{ payment.category_name }}
                                    </div>
                                </div>
                                <span class="font-mono font-bold text-navy dark:text-white">
                                    {{ formatCurrency(payment.amount) }}
                                </span>
                            </div>

                            <!-- Handling / Platform Fee Row (if any) -->
                            <div v-if="payment.fee_amount > 0" class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60 text-slate-500">
                                <span>{{ t('archer_payments_list.handling_fee') }}</span>
                                <span class="font-mono font-bold text-navy dark:text-white">
                                    {{ formatCurrency(payment.fee_amount) }}
                                </span>
                            </div>

                            <!-- Grand Total Row -->
                            <div class="flex items-center justify-between pt-3 border-t-2 border-slate-100 dark:border-slate-700">
                                <span class="font-black text-navy dark:text-white capitalize tracking-wider text-xs">{{ t('archer_payments_list.grand_total') }}</span>
                                <span class="font-mono font-black text-primary text-base sm:text-lg">
                                    {{ formatCurrency(payment.total_amount || payment.amount) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="total > limit" class="flex justify-center pt-4">
                <BasePagination :current-page="currentPage" :total-items="total" :items-per-page="limit"
                    @change-page="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'dashboard'
})

import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { get } = useApi()

useHead({
    title: computed(() => `${t('payments.seo_title', 'Riwayat Pembayaran')} - ArcheryHub Dashboard`)
})

const payments = ref<any[]>([])
const total = ref(0)
const limit = ref(10)
const currentPage = ref(1)
const isLoading = ref(true)
const expandedPaymentId = ref('')

const getItemKey = (payment: any) => {
    if (!payment) return ''
    return payment.uuid || payment.reference || payment.id || ''
}

const toggleExpanded = (payment: any) => {
    const key = getItemKey(payment)
    if (!key) return
    expandedPaymentId.value = expandedPaymentId.value === key ? '' : key
}

const searchQuery = ref('')
const statusFilter = ref('all')
const dateRange = ref({ start: '', end: '' })

const statusOptions = [
    { title: 'Semua Status', label: 'Semua Status', value: 'all' },
    { title: 'Menunggu Pembayaran', label: 'Menunggu Pembayaran', value: 'pending' },
    { title: 'Terbayar (Lunas)', label: 'Terbayar (Lunas)', value: 'paid' },
    { title: 'Menunggu Verifikasi', label: 'Menunggu Verifikasi', value: 'awaiting_verification' },
    { title: 'Dibatalkan / Kadaluarsa', label: 'Dibatalkan / Kadaluarsa', value: 'expired' },
]

const filteredPayments = computed(() => {
    return payments.value.filter(p => {
        if (statusFilter.value !== 'all') {
            const pStatus = (p.status || '').toLowerCase()
            if (statusFilter.value === 'expired') {
                if (!['expired', 'rejected', 'failed', 'canceled', 'cancelled'].includes(pStatus)) return false
            } else if (pStatus !== statusFilter.value) {
                return false
            }
        }

        if (dateRange.value?.start) {
            const pDate = new Date(p.created_at || p.created_at_dt || 0)
            const start = new Date(dateRange.value.start + 'T00:00:00')
            if (pDate < start) return false
        }

        if (dateRange.value?.end) {
            const pDate = new Date(p.created_at || p.created_at_dt || 0)
            const end = new Date(dateRange.value.end + 'T23:59:59')
            if (pDate > end) return false
        }

        if (searchQuery.value.trim()) {
            const q = searchQuery.value.toLowerCase().trim()
            const refMatch = (p.reference || '').toLowerCase().includes(q)
            const eventMatch = (p.event_name || p.plan_name || '').toLowerCase().includes(q)
            const methodMatch = (p.payment_method || '').toLowerCase().includes(q)
            const amountMatch = (p.total_amount || p.amount || '').toString().includes(q)
            if (!refMatch && !eventMatch && !methodMatch && !amountMatch) return false
        }

        return true
    })
})

const fetchPayments = async (page = 1) => {
    isLoading.value = true
    try {
        const offset = (page - 1) * limit.value
        const res = await get(`/payment/my?limit=${limit.value}&offset=${offset}`)
        if (res?.payments) {
            payments.value = res.payments
            total.value = res.total || res.payments.length
        } else if (res?.data) {
            payments.value = res.data
            total.value = res.total || res.data.length
        } else if (Array.isArray(res)) {
            payments.value = res
            total.value = res.length
        }
    } catch (e) {
        console.error('Failed to fetch payments:', e)
    } finally {
        isLoading.value = false
    }
}

const handlePageChange = (page: number) => {
    currentPage.value = page
    fetchPayments(page)
}

const getPaymentIcon = (payment) => {
    const method = (payment.payment_method || '').toLowerCase()
    if (method.includes('qris') || method.includes('qr')) return 'ph:qr-code-bold'
    if (method.includes('va') || method.includes('bank')) return 'ph:bank-bold'
    if (method.includes('manual')) return 'ph:receipt-bold'
    return 'ph:credit-card-bold'
}

const getStatusClass = (status) => {
    switch (status) {
        case 'paid':
        case 'lunas':
            return 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
        case 'pending':
            return 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border-amber-500/30'
        case 'awaiting_verification':
            return 'bg-navy/10 text-navy dark:text-slate-200 border-navy/25'
        case 'rejected':
        case 'failed':
        case 'expired':
            return 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border-rose-500/30'
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
    }
}

const getStatusDotClass = (status) => {
    switch (status) {
        case 'paid':
        case 'lunas':
            return 'bg-emerald-500'
        case 'pending':
            return 'bg-amber-500 animate-pulse'
        case 'awaiting_verification':
            return 'bg-navy dark:bg-primary animate-pulse'
        case 'rejected':
        case 'failed':
        case 'expired':
            return 'bg-rose-500'
        default:
            return 'bg-slate-400'
    }
}

const getStatusLabel = (status) => {
    switch (status) {
        case 'paid':
        case 'lunas':
            return t('payments.status_paid')
        case 'pending':
            return t('payments.status_pending')
        case 'awaiting_verification':
            return t('payments.status_awaiting_verification')
        case 'rejected':
            return t('payments.status_rejected')
        case 'expired':
            return t('payments.status_expired')
        case 'failed':
            return t('payments.status_failed')
        default:
            return status
    }
}

const formatDate = (str) => {
    if (!str) return '-'
    try {
        return new Date(str).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return str
    }
}

const formatCurrency = (val) => {
    if (val === undefined || val === null) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val)
}

onMounted(() => {
    fetchPayments()
})
</script>
