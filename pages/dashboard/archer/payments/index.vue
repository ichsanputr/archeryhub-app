<template>
    <div class="space-y-6">
        <!-- Header -->
        <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <div class="relative p-5 sm:p-8">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md">
                        <Icon icon="ph:credit-card-bold" class="text-primary text-xl sm:text-2xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 text-white">
                            Riwayat Pembayaran</h1>
                        <p class="text-slate-300 text-xs sm:text-sm">Pantau semua transaksi dan status pembayaran Anda
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payments List -->
        <div v-if="isLoading" class="space-y-4">
            <div v-for="i in 3" :key="i"
                class="bg-white p-6 rounded-2xl border border-slate-100 animate-pulse flex justify-between">
                <div class="space-y-3 flex-1">
                    <div class="h-4 w-1/4 bg-slate-100 rounded"></div>
                    <div class="h-6 w-1/2 bg-slate-100 rounded"></div>
                </div>
                <div class="h-10 w-24 bg-slate-100 rounded-xl"></div>
            </div>
        </div>

        <div v-else-if="payments.length === 0" class="bg-white border border-slate-100 rounded-3xl p-12 text-center">
            <div class="max-w-xs mx-auto space-y-4">
                <Icon icon="ph:receipt-x-bold" class="text-5xl text-slate-200 mx-auto" />
                <p class="text-lg font-black text-navy">Belum Ada Transaksi</p>
                <p class="text-sm text-slate-500 font-medium">Anda belum melakukan pembayaran apapun.</p>
            </div>
        </div>

        <div v-else class="space-y-4">
            <div v-for="payment in payments" :key="payment.uuid"
                class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/20 transition-all overflow-hidden">
                <!-- Main row -->
                <div class="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-start gap-4">
                        <div
                            class="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-navy/5 transition-colors">
                            <Icon :icon="getPaymentIcon(payment)" class="text-xl" />
                        </div>
                        <div class="min-w-0">
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{
                                formatDate(payment.created_at) }} • {{ payment.reference }}</p>
                            <h3 class="text-base font-black text-navy dark:text-white leading-tight mb-1">
                                {{ payment.event_name || payment.plan_name || 'Pembayaran Archeris' }}</h3>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-sm font-bold text-navy/70 dark:text-white/70">{{ formatCurrency(payment.total_amount) }}</span>
                                <span v-if="payment.payment_method"
                                    class="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                                    {{ payment.payment_method }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-4 sm:pt-0">
                        <span :class="getStatusClass(payment.status)"
                            class="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border">
                            {{ getStatusLabel(payment.status) }}
                        </span>
                        <BaseButton v-if="payment.status === 'pending' && payment.checkout_url"
                            :to="payment.checkout_url" target="_blank" variant="primary" size="sm"
                            class="h-9 px-4 font-black text-[10px] uppercase tracking-wider">
                            Bayar Sekarang
                        </BaseButton>
                        <BaseButton v-else-if="payment.status === 'paid'" :to="getInvoiceUrl(payment.reference)"
                            target="_blank" variant="white" size="sm" icon="ph:file-pdf"
                            class="h-9 w-9 p-0 border-slate-200 text-slate-500 hover:text-primary hover:border-primary/20" />
                        <button v-if="payment.status === 'pending' && (payment.va_number || payment.pay_code || payment.qr_url || payment.instructions)"
                            @click="toggleInstructions(payment.uuid)"
                            class="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-colors">
                            <Icon :icon="expandedPayments.has(payment.uuid) ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
                        </button>
                    </div>
                </div>

                <!-- Instruction panel -->
                <div v-if="payment.status === 'pending' && expandedPayments.has(payment.uuid)"
                    class="border-t border-slate-100 dark:border-slate-700 px-5 sm:px-6 py-5 bg-slate-50 dark:bg-slate-900/50 space-y-4">

                    <!-- VA / Pay code highlight -->
                    <div v-if="payment.va_number || payment.pay_code"
                        class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-primary/20">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {{ payment.va_number ? 'Nomor VA' : 'Kode Bayar' }}
                        </span>
                        <span class="text-sm font-black text-navy dark:text-white font-mono tracking-wider select-all">
                            {{ payment.va_number || payment.pay_code }}
                        </span>
                    </div>

                    <!-- QR code -->
                    <div v-if="payment.qr_url" class="flex justify-center">
                        <img :src="payment.qr_url" alt="QR Code"
                            class="w-44 h-44 rounded-xl border border-slate-200 shadow-sm" />
                    </div>

                    <!-- Instruction groups -->
                    <template v-if="parseInstructionGroups(payment.instructions).length">
                        <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest pt-1">Cara Pembayaran</div>
                        <!-- Tab selector when multiple groups -->
                        <div v-if="parseInstructionGroups(payment.instructions).length > 1"
                            class="flex gap-2 flex-wrap">
                            <button
                                v-for="(group, gi) in parseInstructionGroups(payment.instructions)" :key="group.title"
                                @click="setActiveGroup(payment.uuid, gi)"
                                :class="getActiveGroup(payment.uuid) === gi
                                    ? 'bg-navy text-white border-navy'
                                    : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-600 hover:border-primary/40'"
                                class="px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-colors">
                                {{ group.title }}
                            </button>
                        </div>
                        <!-- Steps for active/only group -->
                        <div v-for="(group, gi) in parseInstructionGroups(payment.instructions)" :key="group.title"
                            v-show="parseInstructionGroups(payment.instructions).length === 1 || getActiveGroup(payment.uuid) === gi"
                            class="space-y-2.5">
                            <div v-if="parseInstructionGroups(payment.instructions).length === 1"
                                class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ group.title }}</div>
                            <div v-for="(step, si) in group.steps" :key="si" class="flex gap-3">
                                <span
                                    class="size-5 mt-0.5 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 text-[9px]">
                                    {{ si + 1 }}
                                </span>
                                <span v-html="step"
                                    class="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed"></span>
                            </div>
                        </div>
                    </template>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="total > limit" class="pt-6">
                <BasePagination v-model:items-per-page="limit" :current-page="currentPage" :total-items="total"
                    :no-margin="true" @change-page="handlePageChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const { get } = useApi()
const config = useRuntimeConfig()

definePageMeta({ layout: 'dashboard' })

useHead({
    title: 'Riwayat Pembayaran - Archeris'
})

const payments = ref([])
const total = ref(0)
const limit = ref(10)
const currentPage = ref(1)
const isLoading = ref(true)
const expandedPayments = ref(new Set())
const activeGroups = ref(new Map())

const fetchPayments = async () => {
    isLoading.value = true
    try {
        const offset = (currentPage.value - 1) * limit.value
        const res = await get(`/payment/my?limit=${limit.value}&offset=${offset}`)
        payments.value = res.payments || []
        total.value = res.total || 0
    } catch (e) {
        console.error('Failed to fetch payments:', e)
    } finally {
        isLoading.value = false
    }
}

const handlePageChange = (page) => {
    currentPage.value = page
    fetchPayments()
}

onMounted(fetchPayments)

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    })
}

const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(val || 0)
}

const getStatusClass = (status) => {
    const classes = {
        'pending': 'bg-amber-50 text-amber-700 border-amber-100',
        'paid': 'bg-green-50 text-green-700 border-green-100',
        'expired': 'bg-slate-50 text-slate-400 border-slate-100',
        'failed': 'bg-red-50 text-red-700 border-red-100'
    }
    return classes[status] || 'bg-slate-50 text-slate-400 border-slate-100'
}

const getStatusLabel = (status) => {
    const labels = {
        'pending': 'Menunggu',
        'paid': 'Terbayar',
        'expired': 'Kedaluwarsa',
        'failed': 'Gagal'
    }
    return labels[status] || status
}

const getPaymentIcon = (payment) => {
    if (payment.event_id) return 'ph:trophy-bold'
    if (payment.subscription_plan_id) return 'ph:crown-bold'
    return 'ph:credit-card-bold'
}

const getInvoiceUrl = (ref) => {
    const baseUrl = config.public.apiBase || ''
    return `${baseUrl}/payment/invoice/${ref}`
}

const toggleInstructions = (uuid) => {
    if (expandedPayments.value.has(uuid)) {
        expandedPayments.value.delete(uuid)
    } else {
        expandedPayments.value.add(uuid)
    }
    // Trigger reactivity
    expandedPayments.value = new Set(expandedPayments.value)
}

const setActiveGroup = (uuid, index) => {
    activeGroups.value.set(uuid, index)
    activeGroups.value = new Map(activeGroups.value)
}

const getActiveGroup = (uuid) => {
    return activeGroups.value.get(uuid) ?? 0
}

// Parses Tripay instructions JSON into [{title, steps[]}] groups.
// Tripay format: [{ "title": "Internet Banking", "steps": ["Login...", ...] }]
const parseInstructionGroups = (raw) => {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
            return parsed
                .map(group => ({
                    title: group.title || '',
                    steps: Array.isArray(group.steps) ? group.steps : []
                }))
                .filter(g => g.steps.length > 0)
        }
    } catch {
        // Not JSON
    }
    return []
}
</script>
