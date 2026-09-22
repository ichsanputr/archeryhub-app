<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'
import { usePricingPlans } from '~/composables/usePricingPlans'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

definePageMeta({ layout: 'dashboard' })

const { locale, t } = useI18n()
useHead({ title: computed(() => t('organizer_subscription.page_title') + ' - Archeris Dashboard') })

const { get, post } = useApi()
const toast = useToast()
const router = useRouter()
const { fetchPlans, freePlan, standardPlan, elitePlan, bundleDiscounts } = usePricingPlans()

const isEn = computed(() => locale.value === 'en')

const quota = ref({ quota_free: 20, quota_standard: 0, quota_elite: 0 })
const history = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(1)
const isLoadingHistory = ref(false)

const headers = computed(() => [
    { key: 'purchased_at', label: t('organizer_subscription.col_date', 'Tanggal'), sortable: true },
    { key: 'plan_name', label: t('organizer_subscription.col_package', 'Paket Kuota'), sortable: true },
    { key: 'quantity', label: t('organizer_subscription.col_qty', 'Jumlah'), align: 'center', sortable: true },
    { key: 'total_amount', label: t('organizer_subscription.col_total', 'Total Biaya'), sortable: true },
    { key: 'payment_method', label: t('organizer_subscription.col_method', 'Metode'), sortable: true },
    { key: 'payment_status', label: t('organizer_subscription.col_status', 'Status'), sortable: true },
    { key: 'actions', label: t('organizer_subscription.col_action', 'Aksi'), align: 'right', sortable: false }
])

// Table sorting state
const sortKey = ref('date')
const sortOrder = ref('desc')

function toggleSort(key) {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortOrder.value = key === 'date' ? 'desc' : 'asc'
    }
}

function getSortIcon(key) {
    if (sortKey.value !== key) return 'ph:caret-up-down-bold'
    return sortOrder.value === 'asc' ? 'ph:caret-up-bold' : 'ph:caret-down-bold'
}

const sortedHistory = computed(() => {
    if (!history.value || !history.value.length) return []
    const list = [...history.value]
    return list.sort((a, b) => {
        let valA = ''
        let valB = ''
        if (sortKey.value === 'date') {
            valA = new Date(a.purchased_at || a.created_at || 0).getTime()
            valB = new Date(b.purchased_at || b.created_at || 0).getTime()
        } else if (sortKey.value === 'package') {
            valA = (a.plan_name || '').toLowerCase()
            valB = (b.plan_name || '').toLowerCase()
        } else if (sortKey.value === 'qty') {
            valA = Number(a.quantity || 0)
            valB = Number(b.quantity || 0)
        } else if (sortKey.value === 'total') {
            valA = Number(a.total_amount || a.amount || 0)
            valB = Number(b.total_amount || b.amount || 0)
        } else if (sortKey.value === 'method') {
            valA = (a.payment_method || '').toLowerCase()
            valB = (b.payment_method || '').toLowerCase()
        } else if (sortKey.value === 'status') {
            valA = (a.payment_status || a.status || '').toLowerCase()
            valB = (b.payment_status || b.status || '').toLowerCase()
        }
        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
        return 0
    })
})

const selectedTier = ref('standard')
const selectedQty = ref(1)
const isCustomQty = ref(false)
const customQtyInput = ref(10)
const selectedPaymentMethod = ref('mayar')
const isPurchasing = ref(false)

// Set smart default payment method when locale initializes or changes
watch(isEn, (val) => {
    if (val && selectedPaymentMethod.value === 'mayar') {
        selectedPaymentMethod.value = 'paypal'
    } else if (!val && selectedPaymentMethod.value === 'paypal') {
        selectedPaymentMethod.value = 'mayar'
    }
}, { immediate: true })

const setPresetQty = (qty) => {
    isCustomQty.value = false
    selectedQty.value = qty
}

const enableCustomQty = () => {
    isCustomQty.value = true
    selectedQty.value = Math.max(1, customQtyInput.value || 1)
}

const onCustomQtyChange = () => {
    selectedQty.value = Math.max(1, customQtyInput.value || 1)
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString(isEn.value ? 'en-US' : 'id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

async function loadHistory(targetPage = 1) {
    isLoadingHistory.value = true
    page.value = targetPage
    try {
        const h = await get(`/organizers/me/quota/history?limit=${limit.value}&page=${page.value}`)
        if (h) {
            history.value = h.data || (Array.isArray(h) ? h : [])
            total.value = h.total !== undefined ? h.total : history.value.length
            totalPages.value = h.total_pages || Math.ceil(total.value / limit.value) || 1
        }
    } catch (e) {
        console.error(e)
    } finally {
        isLoadingHistory.value = false
    }
}

function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages.value) return
    loadHistory(newPage)
}

const visiblePages = computed(() => {
    const pages = []
    const start = Math.max(1, page.value - 2)
    const end = Math.min(totalPages.value, start + 4)
    for (let i = start; i <= end; i++) {
        pages.push(i)
    }
    return pages
})

onMounted(async () => {
    fetchPlans()
    try {
        const q = await get('/organizers/me/quota')
        if (q) quota.value = q
    } catch (e) {}
    loadHistory(1)
})

const normalPrice = computed(() => {
    if (isEn.value) {
        return selectedTier.value === 'standard' ? (standardPlan.value?.price_usd || 3.00) : (elitePlan.value?.price_usd || 7.00)
    }
    return selectedTier.value === 'standard' ? (standardPlan.value?.price_idr || 49999) : (elitePlan.value?.price_idr || 79999)
})

const basePrice = computed(() => {
    if (isEn.value) {
        return selectedTier.value === 'standard' ? (standardPlan.value?.promo_price_usd || 1.50) : (elitePlan.value?.promo_price_usd || 3.50)
    }
    return selectedTier.value === 'standard' ? (standardPlan.value?.promo_price_idr || 24999) : (elitePlan.value?.promo_price_idr || 39999)
})

const discountPct = computed(() => {
    const q = selectedQty.value
    const rules = bundleDiscounts.value || []
    let maxDiscount = 0
    for (const rule of rules) {
        if (q >= rule.min_qty && rule.discount_pct > maxDiscount) {
            maxDiscount = rule.discount_pct
        }
    }
    return maxDiscount
})

const subtotal = computed(() => {
    return basePrice.value * selectedQty.value
})

const discountAmount = computed(() => {
    return subtotal.value * (discountPct.value / 100)
})

const totalAmount = computed(() => {
    return subtotal.value - discountAmount.value
})

const formatPrice = (val) => {
    const num = Number(val || 0)
    if (isEn.value) {
        return `$${num.toFixed(2)}`
    }
    return `Rp ${Math.round(num).toLocaleString('id-ID')}`
}

const formatHistoryAmount = (item) => {
    const amount = Number(item.total_amount || item.amount || 0)
    if (item.currency === 'USD' || item.payment_method === 'paypal') {
        return `$${amount.toFixed(2)}`
    }
    return `Rp ${Math.round(amount).toLocaleString('id-ID')}`
}

async function buyQuota() {
    isPurchasing.value = true
    try {
        const plan_id = selectedTier.value === 'standard' ? 7 : 8
        const currency = selectedPaymentMethod.value === 'paypal' || isEn.value ? 'USD' : 'IDR'
        const res = await post('/organizers/me/quota/purchase', {
            plan_id,
            quantity: selectedQty.value,
            payment_method: selectedPaymentMethod.value,
            currency
        })
        
        const trxRef = res?.purchase_id || res?.reference || res?.transaction_id || ''
        toast.success(t('organizer_subscription.order_success_toast'))
        if (res?.checkout_url) {
            window.open(res.checkout_url, '_blank')
            router.push(`/dashboard/organizer/package/detail?trx_id=${trxRef}`)
        } else {
            router.push(`/dashboard/organizer/package/detail?trx_id=${trxRef}`)
        }
    } catch (e) {
        console.error(e)
        toast.error(e?.data?.error || t('organizer_subscription.buy_error'))
    } finally {
        isPurchasing.value = false
    }
}
</script>

<template>
    <div class="space-y-8 pb-12">
        <!-- ── Header ── -->
        <DashboardHeader
            :title="t('organizer_subscription.page_title')"
            :subtitle="t('organizer_subscription.subtitle')"
            icon="ph:crown-simple-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('organizer_subscription.breadcrumb') }
            ]"
        />

        <!-- ── Section 1: Quota Balance Cards ── -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            <!-- Free Tier Quota Card -->
            <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between h-full">
                <div class="flex items-start justify-between gap-4 mb-5 min-h-[92px]">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.free_tier_badge') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.free_tier_title') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.free_tier_desc') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-primary text-btn-text flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform font-bold">
                        <Icon icon="ph:gift-bold" class="text-2xl" />
                    </div>
                </div>

                <div class="space-y-2.5 mb-6 min-h-[76px] flex flex-col justify-end">
                    <div class="flex items-baseline justify-between">
                        <div class="flex items-baseline gap-1.5">
                            <span class="text-4xl font-black text-navy">{{ quota.quota_free ?? 20 }}</span>
                            <span class="text-xs font-bold text-slate-400">{{ t('organizer_subscription.remaining_slots') }}</span>
                        </div>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {{ Math.max(0, 20 - (quota.quota_free ?? 20)) }} {{ t('organizer_subscription.used_slots') }}
                        </span>
                    </div>
                    <!-- Progress bar indicating remaining quota -->
                    <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div class="bg-emerald-500 h-full rounded-full transition-all duration-500"
                             :style="{ width: Math.min(100, Math.max(0, ((quota.quota_free ?? 20) / 20) * 100)) + '%' }">
                        </div>
                    </div>
                    <div class="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>{{ t('organizer_subscription.initial_slots') }}</span>
                        <span>{{ t('organizer_subscription.remaining_events', { quota: quota.quota_free ?? 20 }) }}</span>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium mt-auto">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_1')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_2')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_3')"></span>
                    </div>
                </div>
            </div>

            <!-- Standard Quota Card -->
            <div class="bg-white rounded-2xl border border-primary/20 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between h-full">
                <div class="flex items-start justify-between gap-4 mb-5 min-h-[92px]">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-primary/10 text-navy border border-primary/20 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.standard_tier_badge') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.standard_title') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.standard_desc') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-primary text-btn-text flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform font-bold">
                        <Icon icon="ph:lightning-bold" class="text-2xl" />
                    </div>
                </div>

                <div class="flex items-baseline gap-2 mb-6 min-h-[76px] flex flex-col justify-end">
                    <div class="flex items-baseline gap-2">
                        <span class="text-4xl font-black text-navy">{{ quota.quota_standard || 0 }}</span>
                        <span class="text-xs font-bold text-slate-500">{{ t('organizer_subscription.slot_available') }}</span>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium mt-auto">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_1')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_2')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_3')"></span>
                    </div>
                </div>
            </div>
            
            <!-- Elite Quota Card -->
            <div class="bg-white rounded-2xl border border-primary/20 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between h-full">
                <div class="flex items-start justify-between gap-4 mb-5 min-h-[92px]">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-primary/15 text-navy border border-primary/30 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.elite_tier_badge') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.elite_title') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.elite_desc') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-primary text-btn-text flex items-center justify-center shadow-2xs shrink-0 group-hover:scale-105 transition-transform font-bold">
                        <Icon icon="ph:crown-simple-bold" class="text-2xl" />
                    </div>
                </div>

                <div class="flex items-baseline gap-2 mb-6 min-h-[76px] flex flex-col justify-end">
                    <div class="flex items-baseline gap-2">
                        <span class="text-4xl font-black text-navy">{{ quota.quota_elite || 0 }}</span>
                        <span class="text-xs font-bold text-slate-500">{{ t('organizer_subscription.slot_available') }}</span>
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium mt-auto">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_1')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_2')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_3')"></span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Section 2: Interactive Topup / Buy Quota Box ── -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Left Configuration (7 cols) -->
                <div class="lg:col-span-7 space-y-7">
                    <!-- 1. Select Tier -->
                    <div class="space-y-3">
                        <label class="text-xs font-black text-slate-400 capitalize tracking-widest">
                            {{ t('organizer_subscription.step_tier') }}
                        </label>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Standard Selection Card -->
                            <div 
                                @click="selectedTier = 'standard'"
                                :class="selectedTier === 'standard' ? 'border-primary bg-primary/5 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                                class="p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative group">
                                <div class="flex items-start justify-between gap-3">
                                    <div class="space-y-1">
                                        <div class="text-xs font-bold text-slate-400 capitalize">{{ t('organizer_subscription.standard_tier_badge') }}</div>
                                        <div class="font-black text-navy text-base">{{ t('organizer_subscription.standard_title') }}</div>
                                        <div class="text-[11px] text-slate-500 leading-relaxed">{{ t('organizer_subscription.standard_desc') }}</div>
                                    </div>
                                    <div class="size-6 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedTier === 'standard' ? 'bg-primary text-navy font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="pt-3 border-t border-slate-200/60 mt-3">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-xs text-slate-400 font-bold line-through">
                                            {{ isEn ? '$3.00' : 'Rp 49.900' }}
                                        </span>
                                        <span class="text-[9px] font-black capitalize text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                                            {{ t('organizer_subscription.promo_badge_50') }}
                                        </span>
                                    </div>
                                    <div class="text-lg font-black text-navy">
                                        {{ isEn ? '$1.50' : 'Rp 24.999' }}
                                        <span class="text-[10px] font-bold text-slate-500">{{ t('organizer_subscription.per_event') }}</span>
                                    </div>
                                    <div class="text-[10px] text-amber-700 font-medium mt-1">
                                        {{ t('organizer_subscription.promo_subtext') }}
                                    </div>
                                </div>
                            </div>

                            <!-- Elite Selection Card -->
                            <div 
                                @click="selectedTier = 'elite'"
                                :class="selectedTier === 'elite' ? 'border-primary bg-primary/5 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                                class="p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative group">
                                <div class="flex items-start justify-between gap-3">
                                    <div class="space-y-1">
                                        <div class="text-xs font-bold text-slate-400 capitalize">{{ t('organizer_subscription.elite_tier_badge') }}</div>
                                        <div class="font-black text-navy text-base">{{ t('organizer_subscription.elite_title') }}</div>
                                        <div class="text-[11px] text-slate-500 leading-relaxed">{{ t('organizer_subscription.elite_desc') }}</div>
                                    </div>
                                    <div class="size-6 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedTier === 'elite' ? 'bg-primary text-navy font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="pt-3 border-t border-slate-200/60 mt-3">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-xs text-slate-400 font-bold line-through">
                                            {{ isEn ? '$7.00' : 'Rp 79.900' }}
                                        </span>
                                        <span class="text-[9px] font-black capitalize text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                                            {{ t('organizer_subscription.promo_badge_50') }}
                                        </span>
                                    </div>
                                    <div class="text-lg font-black text-navy">
                                        {{ isEn ? '$3.50' : 'Rp 39.999' }}
                                        <span class="text-[10px] font-bold text-slate-500">{{ t('organizer_subscription.per_event') }}</span>
                                    </div>
                                    <div class="text-[10px] text-amber-700 font-medium mt-1">
                                        {{ t('organizer_subscription.promo_subtext') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Quantity & Bundle -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <label class="text-xs font-black text-slate-400 capitalize tracking-widest">
                                {{ t('organizer_subscription.step_qty') }}
                            </label>
                            <span v-if="discountPct > 0" class="text-[11px] font-black text-navy bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                                {{ t('organizer_subscription.save_with_bundle', { pct: discountPct }) }}
                            </span>
                        </div>

                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <button v-for="qty in [1, 3, 5]" :key="qty"
                                type="button"
                                @click="setPresetQty(qty)"
                                :class="[
                                    'p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer',
                                    (!isCustomQty && selectedQty === qty) 
                                        ? 'border-primary bg-navy text-white shadow-xs' 
                                        : 'border-slate-200 text-navy hover:border-primary/40 bg-white'
                                ]">
                                <span class="text-lg font-black">{{ qty }} {{ t('organizer_subscription.event_unit') }}</span>
                                <span class="text-[10px] font-bold" :class="(!isCustomQty && selectedQty === qty) ? 'text-primary' : 'text-slate-500'">
                                    {{ qty === 1 ? t('organizer_subscription.single_package') : t('organizer_subscription.save_pct', { pct: {3: 7, 5: 12}[qty] }) }}
                                </span>
                            </button>
                            <button
                                type="button"
                                @click="enableCustomQty"
                                :class="[
                                    'p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer',
                                    isCustomQty 
                                        ? 'border-primary bg-navy text-white shadow-xs' 
                                        : 'border-slate-200 text-navy hover:border-primary/40 bg-white'
                                ]">
                                <span class="text-lg font-black">{{ t('organizer_subscription.custom_tier_name') }}</span>
                                <span class="text-[10px] font-bold" :class="isCustomQty ? 'text-primary' : 'text-slate-500'">
                                    {{ t('organizer_subscription.custom_slot_label') }}
                                </span>
                            </button>
                        </div>

                        <!-- Custom Slot Input Box -->
                        <div v-if="isCustomQty" class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="space-y-0.5">
                                <label class="text-xs font-black text-navy">{{ t('organizer_subscription.custom_slot_title') }}</label>
                                <div class="text-[11px] text-slate-500">{{ t('organizer_subscription.custom_slot_desc') }}</div>
                            </div>
                            <div class="flex items-center gap-2">
                                <input
                                    v-model.number="customQtyInput"
                                    type="number"
                                    min="1"
                                    max="500"
                                    class="w-28 h-10 px-3 bg-white border border-slate-300 rounded-xl font-black text-navy text-center text-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    @input="onCustomQtyChange"
                                />
                                <span class="text-xs font-bold text-navy">{{ t('organizer_subscription.slot_event_unit') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Payment Method -->
                    <div class="space-y-4">
                        <label class="text-xs font-black text-slate-400 capitalize tracking-widest">
                            {{ t('organizer_subscription.step_payment') }}
                        </label>
                        
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <!-- Mayar Domestik Card -->
                            <div @click="selectedPaymentMethod = 'mayar'"
                                :class="selectedPaymentMethod === 'mayar' ? 'border-primary bg-primary/5 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'"
                                class="p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2.5">
                                        <div class="size-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0">
                                            <img src="/mayar-logo.png" alt="Mayar" class="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <div class="font-black text-navy text-xs">{{ t('organizer_subscription.payment_channel_mayar') }}</div>
                                            <div class="text-[10px] text-slate-500 font-medium">{{ t('organizer_subscription.currency_idr') }}</div>
                                        </div>
                                    </div>
                                    <div class="size-5 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedPaymentMethod === 'mayar' ? 'bg-primary text-navy font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="text-[11px] text-slate-600 font-medium leading-relaxed">
                                    {{ t('organizer_subscription.mayar_methods_desc') }}
                                </div>
                            </div>

                            <!-- PayPal International Card -->
                            <div @click="selectedPaymentMethod = 'paypal'"
                                :class="selectedPaymentMethod === 'paypal' ? 'border-blue-500 bg-blue-50/50 shadow-xs' : 'border-slate-200 bg-white hover:border-slate-300'"
                                class="p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-2.5">
                                        <div class="size-9 rounded-xl bg-white border border-blue-200 flex items-center justify-center p-1 shrink-0">
                                            <Icon icon="logos:paypal" class="text-xl" />
                                        </div>
                                        <div>
                                            <div class="font-black text-navy text-xs">{{ t('organizer_subscription.payment_channel_paypal') }}</div>
                                            <div class="text-[10px] text-blue-600 font-bold">{{ t('organizer_subscription.currency_usd') }}</div>
                                        </div>
                                    </div>
                                    <div class="size-5 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedPaymentMethod === 'paypal' ? 'bg-blue-600 text-white font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="text-[11px] text-slate-600 font-medium leading-relaxed">
                                    {{ t('organizer_subscription.paypal_methods_desc') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Checkout Summary (5 cols) -->
                <div class="lg:col-span-5">
                    <div class="sticky top-24 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-2xl p-6 sm:p-7 border border-primary/20 shadow-lg relative overflow-hidden space-y-6">
                        <div class="absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl pointer-events-none"></div>

                        <!-- Header -->
                        <div class="flex items-center justify-between border-b border-white/10 pb-4">
                            <h4 class="font-black text-white text-base tracking-tight">{{ t('organizer_subscription.order_summary') }}</h4>
                            <span class="text-[10px] font-mono font-bold text-primary capitalize bg-primary/10 px-2 py-0.5 rounded border border-primary/20">Archeris EO</span>
                        </div>

                        <!-- Details breakdown -->
                        <div class="space-y-3.5 text-xs">
                            <div class="flex justify-between items-center text-slate-300">
                                <span>{{ t('organizer_subscription.summary_tier') }}</span>
                                <span class="font-black text-white capitalize">{{ selectedTier === 'standard' ? t('organizer_subscription.standard_title') : t('organizer_subscription.elite_title') }}</span>
                            </div>

                            <div class="flex justify-between items-center text-slate-300">
                                <span>{{ t('organizer_subscription.summary_qty') }}</span>
                                <span class="font-black text-white">{{ selectedQty }} {{ t('organizer_subscription.event_unit') }}</span>
                            </div>

                            <div class="flex justify-between items-center text-slate-300">
                                <span>{{ t('organizer_subscription.summary_unit_price') }}</span>
                                <span class="font-medium text-slate-200">{{ formatPrice(basePrice) }}</span>
                            </div>

                            <div v-if="discountPct > 0" class="flex justify-between items-center text-primary font-bold">
                                <span>{{ t('organizer_subscription.summary_discount') }} ({{ discountPct }}%)</span>
                                <span>-{{ formatPrice(discountAmount) }}</span>
                            </div>

                            <div class="flex justify-between items-center text-slate-300">
                                <span>{{ t('organizer_subscription.col_method') }}</span>
                                <span class="font-black text-white">{{ selectedPaymentMethod === 'paypal' ? 'PayPal (USD)' : 'Mayar (IDR)' }}</span>
                            </div>

                            <div class="pt-3 border-t border-white/10 space-y-1">
                                <div class="flex justify-between items-baseline">
                                    <span class="font-black text-white text-sm">{{ t('organizer_subscription.summary_total') }}</span>
                                    <div class="text-right">
                                        <div class="text-2xl font-black text-primary tabular-nums">
                                            {{ formatPrice(totalAmount) }}
                                        </div>
                                        <div v-if="!isEn && selectedPaymentMethod === 'paypal'" class="text-xs font-mono font-bold text-sky-400">
                                            ~${{ (totalAmount / 16000).toFixed(2) }} USD
                                        </div>
                                        <div v-else-if="isEn && selectedPaymentMethod === 'mayar'" class="text-xs font-mono font-bold text-sky-400">
                                            ~Rp {{ Math.round(totalAmount * 16000).toLocaleString('id-ID') }} IDR
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CTA Button -->
                        <div class="space-y-3 pt-2">
                            <button 
                                type="button"
                                @click="buyQuota"
                                :disabled="isPurchasing"
                                class="w-full py-4 px-6 bg-gradient-to-r from-amber-400 via-primary to-amber-500 hover:opacity-95 text-navy font-black text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                                <Icon :icon="isPurchasing ? 'ph:spinner-gap-bold' : (selectedPaymentMethod === 'paypal' ? 'logos:paypal' : 'ph:rocket-launch-bold')" :class="isPurchasing ? 'animate-spin' : ''" class="text-lg" />
                                <span>{{ isPurchasing ? t('organizer_subscription.btn_processing') : (selectedPaymentMethod === 'paypal' ? t('organizer_subscription.pay_with_paypal') : t('organizer_subscription.btn_pay_now')) }}</span>
                            </button>

                            <div class="text-[11px] text-center text-slate-400 font-medium">
                                {{ t('organizer_subscription.secure_note') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Section 3: Quota Purchase History Table ── -->
        <DashboardDataTable
            :items="history"
            :headers="headers"
            :loading="isLoadingHistory"
            :searchable="true"
            :search-placeholder="t('organizer_subscription.search_placeholder', 'Cari riwayat pembelian...')"
            :title="t('organizer_subscription.history_title')"
            :subtitle="t('organizer_subscription.history_subtitle')"
            :icon="'ph:receipt-bold'"
            :default-page-size="10"
        >
            <template #item-purchased_at="{ item }">
                <span class="text-slate-500 whitespace-nowrap text-xs">
                    {{ formatDate(item.purchased_at || item.created_at) }}
                </span>
            </template>

            <template #item-plan_name="{ item }">
                <span class="font-bold text-navy text-xs">
                    {{ item.plan_name || (item.quota_type === 'elite' ? t('organizer_subscription.elite_title') : t('organizer_subscription.standard_title')) }}
                </span>
            </template>

            <template #item-quantity="{ item }">
                <span class="font-bold text-navy text-xs">
                    {{ item.quantity }} {{ t('organizer_subscription.event_unit') }}
                </span>
            </template>

            <template #item-total_amount="{ item }">
                <span class="font-black text-navy tabular-nums whitespace-nowrap text-xs">
                    {{ formatHistoryAmount(item) }}
                </span>
            </template>

            <template #item-payment_method="{ item }">
                <span class="capitalize text-slate-600 font-bold text-xs">
                    {{ item.payment_method === 'paypal' ? 'PayPal' : 'Mayar' }}
                </span>
            </template>

            <template #item-payment_status="{ item }">
                <span v-if="item.payment_status === 'paid' || item.status === 'paid'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {{ t('organizer_subscription.status_paid') }}
                </span>
                <span v-else-if="item.payment_status === 'pending' || item.status === 'pending'"
                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize bg-amber-100 text-amber-800 border border-amber-200">
                    {{ t('organizer_subscription.status_pending') }}
                </span>
                <span v-else
                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize bg-rose-100 text-rose-800 border border-rose-200">
                    {{ item.payment_status || item.status }}
                </span>
            </template>

            <template #item-actions="{ item }">
                <div class="flex items-center justify-end">
                    <NuxtLink :to="`/dashboard/organizer/package/detail?trx_id=${item.payment_reference || item.uuid}`"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy font-bold text-[11px] transition-colors">
                        <Icon icon="ph:receipt" class="text-sm" />
                        <span>{{ t('organizer_subscription.btn_view_invoice') }}</span>
                    </NuxtLink>
                </div>
            </template>

            <template #empty>
                <div class="py-14 text-center">
                    <div class="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
                        <div class="size-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                            <Icon icon="ph:receipt-x-bold" class="text-3xl text-slate-400" />
                        </div>
                        <div class="space-y-1">
                            <div class="text-sm font-bold text-navy">{{ t('organizer_subscription.no_history') }}</div>
                            <div class="text-xs text-slate-400 font-medium leading-relaxed">
                                {{ t('organizer_subscription.no_history_desc') }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DashboardDataTable>
    </div>
</template>
