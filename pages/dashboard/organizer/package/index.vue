<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'
import useDashboardI18n from '~/composables/useDashboardI18n'

definePageMeta({ layout: 'dashboard' })

const { t } = useDashboardI18n()
useHead({ title: computed(() => t('organizer_subscription.page_title', 'Paket Event & Kuota') + ' - ArcheryHub') })

const { get, post } = useApi()
const toast = useToast()
const router = useRouter()

const quota = ref({ quota_free: 20, quota_standard: 0, quota_elite: 0 })
const history = ref([])
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const totalPages = ref(1)
const isLoadingHistory = ref(false)

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
    return new Date(dateStr).toLocaleDateString('id-ID', {
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
    try {
        const q = await get('/organizers/me/quota')
        if (q) quota.value = q
    } catch (e) {}
    loadHistory(1)
})

const basePrice = computed(() => selectedTier.value === 'standard' ? 24950 : 39950)
const basePriceUSD = computed(() => selectedTier.value === 'standard' ? 1.50 : 2.50)

const discountPct = computed(() => {
    const q = selectedQty.value
    if (q >= 10) return 20
    if (q >= 5) return 12
    if (q >= 3) return 7
    return 0
})

const totalIDR = computed(() => {
    return Math.round(basePrice.value * selectedQty.value * (1 - discountPct.value / 100))
})

const totalUSD = computed(() => {
    return (Math.ceil((totalIDR.value / 16000) * 100) / 100).toFixed(2)
})

async function buyQuota() {
    isPurchasing.value = true
    try {
        const plan_id = selectedTier.value === 'standard' ? 7 : 8
        const res = await post('/organizers/me/quota/purchase', {
            plan_id,
            quantity: selectedQty.value,
            payment_method: selectedPaymentMethod.value,
            currency: selectedPaymentMethod.value === 'paypal' ? 'USD' : 'IDR'
        })
        
        const trxRef = res?.purchase_id || res?.reference || res?.transaction_id || ''
        toast.success(t('organizer_subscription.order_success_toast', 'Pesanan paket kuota berhasil dibuat'))
        if (res?.checkout_url) {
            window.location.href = res.checkout_url
        } else {
            router.push(`/dashboard/organizer/package/detail?trx_id=${trxRef}`)
        }
    } catch (e) {
        console.error(e)
        toast.error(e?.data?.error || t('organizer_subscription.buy_error', 'Gagal memproses pembelian paket kuota.'))
    } finally {
        isPurchasing.value = false
    }
}
</script>

<template>
    <div class="space-y-8 pb-12">
        <!-- ── Header ── -->
        <DashboardHeader
            :title="t('organizer_subscription.page_title', 'Paket Event & Kuota')"
            :subtitle="t('organizer_subscription.subtitle', 'Kelola kuota event, beli paket tambahan, dan pantau riwayat transaksi.')"
            icon="ph:crown-simple-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('organizer_subscription.breadcrumb', 'Paket & Kuota') }
            ]"
        />

        <!-- ── Section 1: Quota Balance Cards ── -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Free Tier Quota Card -->
            <div class="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div class="flex items-start justify-between gap-4 mb-5">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.free_tier_badge', 'Bonus Awal Registrasi') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.free_tier_title', 'Free Tier') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.free_tier_desc', 'Kuota gratis untuk event klub & latihan internal') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-navy shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Icon icon="ph:gift-bold" class="text-2xl text-emerald-600" />
                    </div>
                </div>

                <div class="flex items-baseline gap-2 mb-6">
                    <span class="text-4xl font-black text-navy">{{ quota.quota_free ?? 20 }}</span>
                    <span class="text-xs font-bold text-slate-500">{{ t('organizer_subscription.free_tier_slot', '/ 20 slot tersedia') }}</span>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_1', 'Maksimal <strong>50 Peserta</strong> per event')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_2', 'Maksimal <strong>2 Kategori Lomba</strong>')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-base shrink-0" />
                        <span v-html="t('organizer_subscription.free_tier_feat_3', '<strong>1 Scorekeeper</strong> Digital')"></span>
                    </div>
                </div>
            </div>

            <!-- Standard Quota Card -->
            <div class="bg-white rounded-2xl border border-primary/20 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div class="flex items-start justify-between gap-4 mb-5">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-primary/10 text-navy border border-primary/20 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.standard_tier_badge', 'Paling Populer') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.standard_title', 'Paket Standard') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.standard_desc', 'Ideal untuk kejuaraan daerah & sirkuit panahan') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-slate-50 border border-primary/20 flex items-center justify-center text-navy shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Icon icon="ph:lightning-bold" class="text-2xl text-navy" />
                    </div>
                </div>

                <div class="flex items-baseline gap-2 mb-6">
                    <span class="text-4xl font-black text-navy">{{ quota.quota_standard || 0 }}</span>
                    <span class="text-xs font-bold text-slate-500">{{ t('organizer_subscription.slot_available', 'slot event aktif') }}</span>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_1', 'Hingga <strong>300 Peserta</strong> per event')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_2', 'Kategori lomba & bantalan <strong>Tak Terbatas</strong>')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.std_feat_3', 'Fitur <strong>Kualifikasi & Eliminasi</strong> Lengkap')"></span>
                    </div>
                </div>
            </div>
            
            <!-- Elite Quota Card -->
            <div class="bg-white rounded-2xl border border-primary/20 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div class="flex items-start justify-between gap-4 mb-5">
                    <div class="space-y-1">
                        <span class="inline-block px-2.5 py-0.5 bg-primary/15 text-navy border border-primary/30 rounded-lg text-[10px] font-black tracking-wider capitalize">
                            {{ t('organizer_subscription.elite_tier_badge', 'Skala Nasional') }}
                        </span>
                        <h3 class="text-lg font-black text-navy pt-1">{{ t('organizer_subscription.elite_title', 'Paket Elite') }}</h3>
                        <div class="text-xs text-slate-500">{{ t('organizer_subscription.elite_desc', 'Untuk turnamen besar, open championship, & kejurnas') }}</div>
                    </div>
                    <div class="size-12 rounded-xl bg-slate-50 border border-primary/20 flex items-center justify-center text-navy shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                        <Icon icon="ph:crown-simple-bold" class="text-2xl text-navy" />
                    </div>
                </div>

                <div class="flex items-baseline gap-2 mb-6">
                    <span class="text-4xl font-black text-navy">{{ quota.quota_elite || 0 }}</span>
                    <span class="text-xs font-bold text-slate-500">{{ t('organizer_subscription.slot_available', 'slot event aktif') }}</span>
                </div>

                <div class="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_1', 'Peserta <strong>Tak Terbatas</strong>')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_2', 'Live scoring & bagan eliminasi multi-lapangan')"></span>
                    </div>
                    <div class="flex items-center gap-2">
                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                        <span v-html="t('organizer_subscription.elite_feat_3', 'Sertifikat digital otomatis dengan QR verifikasi')"></span>
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
                            {{ t('organizer_subscription.step_tier', '1. Pilih Jenis Paket Event') }}
                        </label>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <!-- Standard Selection Card -->
                            <div 
                                @click="selectedTier = 'standard'"
                                :class="selectedTier === 'standard' ? 'border-primary bg-primary/5 shadow-xs' : 'border-slate-200 hover:border-slate-300 bg-white'"
                                class="p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative group">
                                <div class="flex items-start justify-between gap-3">
                                    <div class="space-y-1">
                                        <div class="text-xs font-bold text-slate-400 capitalize">{{ t('organizer_subscription.standard_tier_badge', 'Paling Populer') }}</div>
                                        <div class="font-black text-navy text-base">{{ t('organizer_subscription.standard_title', 'Paket Standard') }}</div>
                                        <div class="text-[11px] text-slate-500 leading-relaxed">{{ t('organizer_subscription.standard_desc', 'Ideal untuk kejuaraan daerah & sirkuit') }}</div>
                                    </div>
                                    <div class="size-6 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedTier === 'standard' ? 'bg-primary text-navy font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="pt-3 border-t border-slate-200/60 mt-3">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-xs text-slate-400 font-bold line-through">
                                            Rp 49.900
                                        </span>
                                        <span class="text-[9px] font-black capitalize text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                                            {{ t('organizer_subscription.promo_badge_50', 'Diskon Launching 50%') }}
                                        </span>
                                    </div>
                                    <div class="text-lg font-black text-navy">
                                        Rp 24.950
                                        <span class="text-[10px] font-bold text-slate-500">{{ t('organizer_subscription.per_event', '/ event') }}</span>
                                    </div>
                                    <div class="text-[10px] text-amber-700 font-medium mt-1">
                                        {{ t('organizer_subscription.promo_subtext', 'Diskon launching 50% untuk semua paket') }}
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
                                        <div class="text-xs font-bold text-slate-400 capitalize">{{ t('organizer_subscription.elite_tier_badge', 'Skala Nasional') }}</div>
                                        <div class="font-black text-navy text-base">{{ t('organizer_subscription.elite_title', 'Paket Elite') }}</div>
                                        <div class="text-[11px] text-slate-500 leading-relaxed">{{ t('organizer_subscription.elite_desc', 'Untuk turnamen besar & kejurnas') }}</div>
                                    </div>
                                    <div class="size-6 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedTier === 'elite' ? 'bg-primary text-navy font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="pt-3 border-t border-slate-200/60 mt-3">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <span class="text-xs text-slate-400 font-bold line-through">
                                            Rp 79.900
                                        </span>
                                        <span class="text-[9px] font-black capitalize text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                                            {{ t('organizer_subscription.promo_badge_50', 'Diskon Launching 50%') }}
                                        </span>
                                    </div>
                                    <div class="text-lg font-black text-navy">
                                        Rp 39.950
                                        <span class="text-[10px] font-bold text-slate-500">{{ t('organizer_subscription.per_event', '/ event') }}</span>
                                    </div>
                                    <div class="text-[10px] text-amber-700 font-medium mt-1">
                                        {{ t('organizer_subscription.promo_subtext', 'Diskon launching 50% untuk semua paket') }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Quantity & Bundle -->
                    <div class="space-y-3">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <label class="text-xs font-black text-slate-400 capitalize tracking-widest">
                                {{ t('organizer_subscription.step_qty', '2. Jumlah Kuota Event') }}
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
                                <span class="text-lg font-black">{{ qty }} {{ t('organizer_subscription.event_unit', 'Event') }}</span>
                                <span class="text-[10px] font-bold" :class="(!isCustomQty && selectedQty === qty) ? 'text-primary' : 'text-slate-500'">
                                    {{ qty === 1 ? t('organizer_subscription.single_package', 'Paket Satuan') : t('organizer_subscription.save_pct', { pct: {3: 7, 5: 12}[qty] }) }}
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
                                <span class="text-lg font-black">{{ t('organizer_subscription.custom_tier_name', 'Kustom') }}</span>
                                <span class="text-[10px] font-bold" :class="isCustomQty ? 'text-primary' : 'text-slate-500'">
                                    {{ t('organizer_subscription.custom_slot_label', 'Tentukan Sendiri') }}
                                </span>
                            </button>
                        </div>

                        <!-- Custom Slot Input Box -->
                        <div v-if="isCustomQty" class="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="space-y-0.5">
                                <label class="text-xs font-black text-navy">{{ t('organizer_subscription.custom_slot_title', 'Jumlah Slot Event Kustom:') }}</label>
                                <div class="text-[11px] text-slate-500">{{ t('organizer_subscription.custom_slot_desc', 'Tentukan jumlah kuota turnamen yang ingin Anda miliki') }}</div>
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
                                <span class="text-xs font-bold text-navy">{{ t('organizer_subscription.slot_event_unit', 'Slot Event') }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Payment Method -->
                    <div class="space-y-4">
                        <label class="text-xs font-black text-slate-400 capitalize tracking-widest">
                            {{ t('organizer_subscription.step_payment', '3. Metode Pembayaran') }}
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
                                            <div class="font-black text-navy text-xs">{{ t('organizer_subscription.payment_channel_mayar', 'Domestik (Mayar - IDR)') }}</div>
                                            <div class="text-[10px] text-slate-500 font-medium">{{ t('organizer_subscription.currency_idr', 'Mata Uang: IDR (Rp)') }}</div>
                                        </div>
                                    </div>
                                    <div class="size-5 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedPaymentMethod === 'mayar' ? 'bg-primary text-navy font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="text-[11px] text-slate-600 font-medium leading-relaxed">
                                    {{ t('organizer_subscription.mayar_methods_desc', 'QRIS, Virtual Account (BCA, Mandiri, BRI, BNI, Permata), E-Wallet') }}
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
                                            <div class="font-black text-navy text-xs">{{ t('organizer_subscription.payment_channel_paypal', 'Internasional (PayPal - USD)') }}</div>
                                            <div class="text-[10px] text-blue-600 font-bold">{{ t('organizer_subscription.currency_usd', 'Mata Uang: USD ($)') }}</div>
                                        </div>
                                    </div>
                                    <div class="size-5 rounded-full flex items-center justify-center text-xs"
                                        :class="selectedPaymentMethod === 'paypal' ? 'bg-blue-600 text-white font-black' : 'border border-slate-300 text-transparent'">
                                        <Icon icon="ph:check-bold" />
                                    </div>
                                </div>
                                <div class="text-[11px] text-slate-600 font-medium leading-relaxed">
                                    {{ t('organizer_subscription.paypal_methods_desc', 'Saldo PayPal, Kartu Kredit/Debit Internasional (Visa, Mastercard, AMEX)') }}
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
                            <h4 class="font-black text-white text-base tracking-tight">{{ t('organizer_subscription.order_summary', 'Ringkasan Pesanan') }}</h4>
                            <span class="text-[10px] font-mono font-bold text-primary capitalize bg-primary/10 px-2 py-0.5 rounded border border-primary/20">ArcheryHub EO</span>
                        </div>

                        <!-- Details breakdown -->
                        <div class="space-y-3.5 text-xs">
                            <div class="flex justify-between items-center text-slate-300">
                                <span>{{ t('organizer_subscription.summary_tier', 'Jenis Paket') }}</span>
                                <span class="font-black text-white capitalize">{{ selectedTier === 'standard' ? t('organizer_subscription.standard_title', 'Paket Standard') : t('organizer_subscription.elite_title', 'Paket Elite') }}</span>
                            </div>

                            <div class="flex justify-between items-center text-slate-300">
                                <span>{{ t('organizer_subscription.summary_qty', 'Jumlah Slot') }}</span>
                                <span class="font-black text-white">{{ selectedQty }} {{ t('organizer_subscription.event_unit', 'Event') }}</span>
                            </div>

                            <div class="flex justify-between items-center text-slate-300">
                                <span>{{ t('organizer_subscription.summary_unit_price', 'Harga per Slot') }}</span>
                                <span class="font-medium text-slate-200">Rp {{ basePrice.toLocaleString('id-ID') }}</span>
                            </div>

                            <div v-if="discountPct > 0" class="flex justify-between items-center text-primary font-bold">
                                <span>{{ t('organizer_subscription.summary_discount', 'Diskon Bundle') }} ({{ discountPct }}%)</span>
                                <span>-Rp {{ Math.round(basePrice * selectedQty * discountPct / 100).toLocaleString('id-ID') }}</span>
                            </div>

                            <div class="flex justify-between items-center text-slate-300">
                                <span>{{ t('organizer_subscription.col_method', 'Metode') }}</span>
                                <span class="font-black text-white">{{ selectedPaymentMethod === 'paypal' ? 'PayPal (USD)' : 'Mayar (IDR)' }}</span>
                            </div>

                            <div class="pt-3 border-t border-white/10 space-y-1">
                                <div class="flex justify-between items-baseline">
                                    <span class="font-black text-white text-sm">{{ t('organizer_subscription.summary_total', 'Total Tagihan') }}</span>
                                    <div class="text-right">
                                        <div class="text-2xl font-black text-primary tabular-nums">
                                            Rp {{ totalIDR.toLocaleString('id-ID') }}
                                        </div>
                                        <div v-if="selectedPaymentMethod === 'paypal'" class="text-xs font-mono font-bold text-sky-400">
                                            ~${{ totalUSD }} USD
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
                                <span>{{ isPurchasing ? t('organizer_subscription.btn_processing', 'Memproses Pembayaran...') : (selectedPaymentMethod === 'paypal' ? t('organizer_subscription.pay_with_paypal', 'Checkout via PayPal') : t('organizer_subscription.btn_pay_now', 'Bayar Sekarang')) }}</span>
                            </button>

                            <div class="text-[11px] text-center text-slate-400 font-medium">
                                {{ t('organizer_subscription.secure_note', 'Transaksi aman, terverifikasi otomatis secara instan') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── Section 3: Quota Purchase History Table ── -->
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div class="p-6 sm:p-7 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-navy shrink-0">
                        <Icon icon="ph:receipt-bold" class="text-xl text-navy" />
                    </div>
                    <div>
                        <h3 class="text-base font-black text-navy">{{ t('organizer_subscription.history_title', 'Riwayat Pembelian Kuota') }}</h3>
                        <div class="text-xs text-slate-400">{{ t('organizer_subscription.history_subtitle', 'Daftar invoice dan transaksi kuota event Anda') }}</div>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-left text-xs min-w-[700px]">
                    <thead class="bg-slate-50 text-slate-500 font-bold border-b border-gray-100 text-[11px]">
                        <tr>
                            <th class="py-3 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('date')">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('organizer_subscription.col_date', 'Tanggal') }}</span>
                                    <Icon :icon="getSortIcon('date')" class="text-xs text-slate-400" />
                                </div>
                            </th>
                            <th class="py-3 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('package')">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('organizer_subscription.col_package', 'Paket') }}</span>
                                    <Icon :icon="getSortIcon('package')" class="text-xs text-slate-400" />
                                </div>
                            </th>
                            <th class="py-3 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors text-center" @click="toggleSort('qty')">
                                <div class="flex items-center justify-center gap-1.5">
                                    <span>{{ t('organizer_subscription.col_qty', 'Jumlah') }}</span>
                                    <Icon :icon="getSortIcon('qty')" class="text-xs text-slate-400" />
                                </div>
                            </th>
                            <th class="py-3 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('total')">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('organizer_subscription.col_total', 'Total Tagihan') }}</span>
                                    <Icon :icon="getSortIcon('total')" class="text-xs text-slate-400" />
                                </div>
                            </th>
                            <th class="py-3 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('method')">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('organizer_subscription.col_method', 'Metode') }}</span>
                                    <Icon :icon="getSortIcon('method')" class="text-xs text-slate-400" />
                                </div>
                            </th>
                            <th class="py-3 px-4 sm:px-6 cursor-pointer hover:bg-slate-100 transition-colors" @click="toggleSort('status')">
                                <div class="flex items-center gap-1.5">
                                    <span>{{ t('organizer_subscription.col_status', 'Status') }}</span>
                                    <Icon :icon="getSortIcon('status')" class="text-xs text-slate-400" />
                                </div>
                            </th>
                            <th class="py-3 px-4 sm:px-6 text-right">{{ t('organizer_subscription.col_action', 'Aksi') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 font-medium">
                        <tr v-for="item in sortedHistory" :key="item.uuid" class="hover:bg-slate-50/80 transition-colors">
                            <td class="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap">
                                {{ formatDate(item.purchased_at || item.created_at) }}
                            </td>
                            <td class="py-3.5 px-4 sm:px-6 font-bold text-navy">
                                {{ item.plan_name || (item.quota_type === 'elite' ? t('organizer_subscription.elite_title', 'Paket Elite') : t('organizer_subscription.standard_title', 'Paket Standard')) }}
                            </td>
                            <td class="py-3.5 px-4 sm:px-6 text-center font-bold text-navy">
                                {{ item.quantity }} {{ t('organizer_subscription.event_unit', 'Event') }}
                            </td>
                            <td class="py-3.5 px-4 sm:px-6 font-black text-navy tabular-nums whitespace-nowrap">
                                Rp {{ (item.total_amount || item.amount || 0).toLocaleString('id-ID') }}
                            </td>
                            <td class="py-3.5 px-4 sm:px-6 capitalize text-slate-600 font-bold">
                                {{ item.payment_method === 'paypal' ? 'PayPal' : 'Mayar' }}
                            </td>
                            <td class="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                                <span v-if="item.payment_status === 'paid' || item.status === 'paid'"
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    {{ t('organizer_subscription.status_paid', 'Lunas') }}
                                </span>
                                <span v-else-if="item.payment_status === 'pending' || item.status === 'pending'"
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize bg-amber-100 text-amber-800 border border-amber-200">
                                    {{ t('organizer_subscription.status_pending', 'Menunggu Pembayaran') }}
                                </span>
                                <span v-else
                                    class="px-2.5 py-1 rounded-full text-[10px] font-black capitalize bg-rose-100 text-rose-800 border border-rose-200">
                                    {{ item.payment_status || item.status }}
                                </span>
                            </td>
                            <td class="py-3.5 px-4 sm:px-6 text-right">
                                <NuxtLink :to="`/dashboard/organizer/package/detail?trx_id=${item.payment_reference || item.uuid}`"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy font-bold text-[11px] transition-colors">
                                    <Icon icon="ph:receipt" class="text-sm" />
                                    <span>{{ t('organizer_subscription.btn_view_invoice', 'Detail Invoice') }}</span>
                                </NuxtLink>
                            </td>
                        </tr>
                        <tr v-if="!history.length && !isLoadingHistory">
                            <td colspan="7" class="py-14 text-center">
                                <div class="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
                                    <div class="size-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                        <Icon icon="ph:receipt-x-bold" class="text-3xl text-slate-400" />
                                    </div>
                                    <div class="space-y-1">
                                        <div class="text-sm font-bold text-navy">{{ t('organizer_subscription.no_history', 'Belum Ada Riwayat Pembelian') }}</div>
                                        <div class="text-xs text-slate-400 font-medium leading-relaxed">
                                            {{ t('organizer_subscription.no_history_desc', 'Riwayat pembelian kuota Standard & Elite akan tercatat di sini. Kuota Free (Bonus Awal) digunakan langsung tanpa transaksi pembelian.') }}
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="isLoadingHistory">
                            <td colspan="7" class="py-12 text-center text-slate-400">
                                <Icon icon="ph:spinner-gap-bold" class="text-3xl mx-auto mb-2 animate-spin text-primary" />
                                <div>{{ t('organizer_subscription.loading_history', 'Memuat riwayat transaksi...') }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Bar -->
            <div v-if="total > 0" class="p-4 sm:p-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
                <div class="text-xs text-slate-500 font-medium">
                    {{ t('organizer_subscription.history_page_info', { from: (page - 1) * limit + 1, to: Math.min(page * limit, total), total: total }) }}
                </div>

                <div class="flex items-center gap-1.5">
                    <button 
                        type="button"
                        @click="changePage(page - 1)"
                        :disabled="page <= 1 || isLoadingHistory"
                        class="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-2xs">
                        <Icon icon="ph:caret-left-bold" />
                        <span>{{ t('organizer_subscription.btn_prev', 'Sebelumnya') }}</span>
                    </button>

                    <div class="flex items-center gap-1 px-1">
                        <button 
                            v-for="p in visiblePages" :key="p"
                            type="button"
                            @click="changePage(p)"
                            :class="page === p ? 'bg-navy text-white font-black shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-100 border border-gray-200 font-bold'"
                            class="size-8 rounded-xl text-xs flex items-center justify-center transition-all">
                            {{ p }}
                        </button>
                    </div>

                    <button 
                        type="button"
                        @click="changePage(page + 1)"
                        :disabled="page >= totalPages || isLoadingHistory"
                        class="px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1 shadow-2xs">
                        <span>{{ t('organizer_subscription.btn_next', 'Selanjutnya') }}</span>
                        <Icon icon="ph:caret-right-bold" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
