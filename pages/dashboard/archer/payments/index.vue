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
                            {{ t('payments.title') }}</h1>
                        <p class="text-slate-300 text-xs sm:text-sm">{{ t('payments.desc') }}
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
                <p class="text-lg font-black text-navy">{{ t('payments.no_transactions') }}</p>
                <p class="text-sm text-slate-500 font-medium">{{ t('payments.no_transactions_desc') }}</p>
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
                            <p class="text-[10px] font-black text-slate-400 tracking-widest mb-1">{{
                                formatDate(payment.created_at) }} • {{ payment.reference }}</p>
                            <h3 class="text-base font-black text-navy dark:text-white leading-tight mb-1">
                                {{ payment.event_name || payment.plan_name || t('payments.payment_title_default') }}</h3>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-sm font-bold text-navy/70 dark:text-white/70">{{
                                    formatCurrency(payment.total_amount) }}</span>
                                <span v-if="payment.payment_method"
                                    class="text-[10px] font-black text-slate-400 tracking-widest bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                                    {{ payment.payment_method }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-4 sm:pt-0">
                        <span :class="getStatusClass(payment.status)"
                            class="px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border">
                            {{ getStatusLabel(payment.status) }}
                        </span>
                        <BaseButton v-if="payment.status === 'pending' && payment.checkout_url"
                            variant="primary" size="sm" @click="handlePayNow(payment)"
                            class="h-9 px-4 font-black text-[10px] tracking-wider">
                            {{ t('payments.pay_now') }}
                        </BaseButton>
                        <button
                            @click="toggleInstructions(payment.uuid)"
                            class="h-9 w-9 rounded-xl border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/30 transition-colors">
                            <Icon
                                :icon="expandedPayments.has(payment.uuid) ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" />
                        </button>
                    </div>
                </div>

                <!-- Expanded Detail panel -->
                <div v-if="expandedPayments.has(payment.uuid)"
                    class="border-t border-slate-100 dark:border-slate-700 px-5 sm:px-6 py-5 bg-slate-50/50 dark:bg-slate-900/30 space-y-4">
                    
                    <!-- Breakout summary grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 text-xs">
                        <div>
                            <span class="text-[10px] font-black text-slate-400 tracking-widest block uppercase mb-1">Transaction Ref</span>
                            <span class="font-bold text-navy dark:text-white select-all font-mono">{{ payment.reference }}</span>
                        </div>
                        <div>
                            <span class="text-[10px] font-black text-slate-400 tracking-widest block uppercase mb-1">Payment Channel</span>
                            <span class="font-bold text-navy dark:text-white">{{ payment.payment_method || payment.payment_channel || 'Manual Transfer' }}</span>
                        </div>
                        <div>
                            <span class="text-[10px] font-black text-slate-400 tracking-widest block uppercase mb-1">Expiration / Paid Date</span>
                            <span class="font-bold text-navy dark:text-white">
                                {{ payment.status === 'paid' && payment.paid_at ? formatDate(payment.paid_at) : formatDate(payment.expired_at) }}
                            </span>
                        </div>
                    </div>

                    <!-- If payment is manual transfer -->
                    <div v-if="(payment.payment_method || '').toLowerCase() === 'manual' || (payment.payment_channel || '').toLowerCase() === 'manual'" class="space-y-4">
                        <!-- Manual Proof Uploaded Image -->
                        <div class="space-y-2">
                            <span class="text-[10px] font-black text-slate-400 tracking-widest block uppercase">Transfer Proof Image</span>
                            <div v-if="payment.proof_url" class="relative max-w-xs rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                                <img :src="payment.proof_url" alt="Bukti Transfer" class="w-full h-auto max-h-52 object-contain mx-auto" />
                                <a :href="payment.proof_url" target="_blank" class="absolute bottom-2 right-2 px-2.5 py-1 bg-black/60 hover:bg-black/80 text-white rounded-lg text-[9px] font-bold flex items-center gap-1 transition-colors">
                                    <Icon icon="ph:arrow-square-out-bold" />
                                    View Fullsize
                                </a>
                            </div>
                            <div v-else class="text-xs text-slate-400 italic">No transfer proof has been uploaded.</div>
                        </div>

                        <!-- Manual Verification Status Info -->
                        <div v-if="payment.status === 'awaiting_verification'" class="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl flex gap-2">
                            <Icon icon="ph:clock-bold" class="text-amber-500 text-lg shrink-0 mt-0.5" />
                            <div class="text-xs text-amber-800 dark:text-amber-300 font-medium">
                                payment proof is uploaded. the organizer will verify your payment soon.
                            </div>
                        </div>
                        <div v-else-if="payment.status === 'rejected'" class="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl space-y-1">
                            <div class="flex gap-2">
                                <Icon icon="ph:warning-circle-bold" class="text-red-500 text-lg shrink-0 mt-0.5" />
                                <div class="text-xs text-red-800 dark:text-red-300 font-bold">
                                    payment verification rejected
                                </div>
                            </div>
                            <div v-if="payment.rejection_reason" class="text-xs text-slate-500 dark:text-slate-400 ml-7">
                                Reason: {{ payment.rejection_reason }}
                            </div>
                        </div>
                        <div v-else-if="payment.status === 'paid' && payment.verified_at" class="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl flex gap-2">
                            <Icon icon="ph:check-circle-bold" class="text-green-500 text-lg shrink-0 mt-0.5" />
                            <div class="text-xs text-green-800 dark:text-green-300 font-medium">
                                payment verified by organizer at {{ formatDate(payment.verified_at) }}.
                            </div>
                        </div>
                    </div>

                    <!-- If online gateway payment -->
                    <div v-else class="space-y-4">
                        <!-- Pending online instructions -->
                        <template v-if="payment.status === 'pending'">
                            <!-- VA / Pay code highlight -->
                            <div v-if="payment.va_number || payment.pay_code"
                                class="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-primary/20">
                                <span class="text-[10px] font-black text-slate-400 tracking-widest">
                                    {{ payment.va_number ? t('payments.va_number') : t('payments.pay_code') }}
                                </span>
                                <span class="text-sm font-black text-navy dark:text-white font-mono tracking-wider select-all font-bold">
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
                                <div class="text-[10px] font-black text-slate-400 tracking-widest pt-1">{{ t('payments.how_to_pay') }}</div>
                                <!-- Tab selector when multiple groups -->
                                <div v-if="parseInstructionGroups(payment.instructions).length > 1"
                                    class="flex gap-2 flex-wrap">
                                    <button v-for="(group, gi) in parseInstructionGroups(payment.instructions)"
                                        :key="group.title" @click="setActiveGroup(payment.uuid, gi)"
                                        :class="getActiveGroup(payment.uuid) === gi
                                            ? 'bg-navy text-white border-navy'
                                            : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-600 hover:border-primary/40'"
                                        class="px-3 py-1.5 rounded-lg border text-[10px] font-black tracking-widest transition-colors">
                                        {{ group.title }}
                                    </button>
                                </div>
                                <!-- Steps for active/only group -->
                                <div v-for="(group, gi) in parseInstructionGroups(payment.instructions)" :key="group.title"
                                    v-show="parseInstructionGroups(payment.instructions).length === 1 || getActiveGroup(payment.uuid) === gi"
                                    class="space-y-2.5">
                                    <div v-if="parseInstructionGroups(payment.instructions).length === 1"
                                        class="text-[10px] font-black text-slate-500 tracking-widest">{{ group.title }}</div>
                                    <div v-for="(step, si) in group.steps" :key="si" class="flex gap-3">
                                        <span
                                            class="size-5 mt-0.5 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 text-[9px] font-bold">
                                            {{ si + 1 }}
                                        </span>
                                        <span v-html="step"
                                            class="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed"></span>
                                    </div>
                                </div>
                            </template>
                        </template>

                        <!-- Non-pending online information breakdown -->
                        <template v-else>
                            <div class="p-3.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-xl space-y-2 text-xs">
                                <div class="flex justify-between">
                                    <span class="text-slate-400 font-bold">Base Amount</span>
                                    <span class="font-bold text-navy dark:text-white">{{ formatCurrency(payment.amount) }}</span>
                                </div>
                                <div class="flex justify-between" v-if="payment.fee_amount">
                                    <span class="text-slate-400 font-bold">Gateway / Admin Fee</span>
                                    <span class="font-bold text-navy dark:text-white">{{ formatCurrency(payment.fee_amount) }}</span>
                                </div>
                                <div class="flex justify-between border-t border-slate-200/50 dark:border-slate-700 pt-2 font-black">
                                    <span class="text-navy dark:text-white uppercase text-[10px] tracking-widest">Total Amount</span>
                                    <span class="text-sm text-navy dark:text-white">{{ formatCurrency(payment.total_amount) }}</span>
                                </div>
                            </div>
                        </template>
                    </div>
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
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { get } = useApi()
const apiBaseUrl = useApiBaseUrl()
const { t } = useI18n()

definePageMeta({ layout: 'dashboard' })

useHead({
    title: computed(() => t('payments.title') + ' - Archeris')
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
        'pending': t('payments.status_pending'),
        'paid': t('payments.status_paid'),
        'expired': t('payments.status_expired'),
        'failed': t('payments.status_failed')
    }
    return labels[status] || status
}

const getPaymentIcon = (payment) => {
    if (payment.event_id) return 'ph:trophy-bold'
    if (payment.subscription_plan_id) return 'ph:crown-bold'
    return 'ph:credit-card-bold'
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

const isPaddlePayment = (payment) => {
    const method = (payment?.payment_method || '').toLowerCase()
    const checkoutUrl = payment?.checkout_url || ''
    return method === 'paddle' || checkoutUrl.includes('paddle.io')
}

const getPaddleTransactionId = (payment) => {
    if (payment?.tripay_reference) return payment.tripay_reference
    const checkoutUrl = payment?.checkout_url || ''
    const match = checkoutUrl.match(/[?&]_ptxn=([^&]+)/)
    return match ? decodeURIComponent(match[1]) : ''
}

const waitForPaddle = async () => {
    if (!import.meta.client) return null
    for (let i = 0; i < 20; i++) {
        if (window.Paddle?.Checkout) return window.Paddle
        await new Promise(resolve => setTimeout(resolve, 150))
    }
    return null
}

const openPaddleCheckout = async (payment) => {
    const transactionId = getPaddleTransactionId(payment)
    if (!transactionId) return

    if (transactionId.includes('mock')) {
        await $fetch(`${apiBaseUrl}/payment/simulate-success/${payment.reference}`, {
            method: 'GET',
            credentials: 'include'
        })
        await fetchPayments()
        return
    }

    const paddle = await waitForPaddle()
    if (!paddle) return

    paddle.Checkout.open({
        transactionId,
        eventCallback: async (data) => {
            if (data.name === 'checkout.completed') {
                await fetchPayments()
            }
        }
    })
}

const handlePayNow = async (payment) => {
    if (isPaddlePayment(payment)) {
        await openPaddleCheckout(payment)
        return
    }
    if (payment.checkout_url) {
        window.location.href = payment.checkout_url
    }
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
