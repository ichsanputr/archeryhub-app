<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <!-- Decorative Background Elements (Glows) -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:crown-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Subscription Saya</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Kelola paket, pemakaian, dan
                            riwayat tagihan Anda.</p>
                    </div>
                </div>
                <div class="flex items-center gap-3">
                    <div v-if="subscriptionRes?.current?.status === 'trial'"
                        class="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center gap-2">
                        <Icon icon="ph:clock-countdown-fill" class="text-primary text-lg" />
                        <span class="text-xs font-black text-white uppercase tracking-widest">Trial 4 Bulan Aktif</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Promo Banner -->
        <div v-if="!isSubscribed"
            class="bg-gradient-to-r from-navy to-navy-light rounded-3xl p-8 relative overflow-hidden shadow-sm border border-white/10 group">
            <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div class="text-center md:text-left max-w-xl">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full mb-4">
                        <Icon icon="ph:sparkle-fill" class="text-primary text-sm" />
                        <span class="text-[10px] font-black text-primary uppercase tracking-widest">
                            {{ roleContent.promoBadge }}
                        </span>
                    </div>
                    <h2 class="text-3xl font-black text-white mb-3">
                        {{ roleContent.promoTitle }}
                    </h2>
                    <p class="text-slate-300 text-sm font-medium leading-relaxed">
                        {{ roleContent.promoDesc }}
                        Tanpa biaya pendaftaran, tanpa komitment.
                    </p>
                </div>
                <div class="shrink-0 flex flex-col items-center">
                    <div
                        class="size-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-4 border border-white/20 transform group-hover:rotate-12 transition-transform duration-500">
                        <Icon icon="ph:gift-bold" class="text-primary text-4xl" />
                    </div>
                    <div class="text-center">
                        <p class="text-white font-black text-lg">Hemat Rp {{ roleContent.savings }}</p>
                        <p class="text-white/50 text-[10px] font-bold uppercase tracking-widest">Total Nilai</p>
                    </div>
                </div>
            </div>
            <!-- Abstract Shapes (Premium feel) -->
            <div class="absolute -right-20 -bottom-20 size-80 bg-primary/10 rounded-full blur-[100px]"></div>
            <div class="absolute -left-20 -top-20 size-80 bg-primary/5 rounded-full blur-[100px]"></div>
        </div>

        <section class="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                <div class="absolute top-4 right-4">
                    <span
                        class="px-3 py-1 bg-primary/20 text-navy text-[10px] font-black uppercase tracking-widest rounded-full">
                        Aktif
                    </span>
                </div>
                <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Paket Saat Ini</h3>
                <div class="mb-6">
                    <p class="text-3xl font-black text-navy mb-1">{{ currentPlan?.name }}</p>
                    <p class="text-sm text-gray-500">Ditagih {{ currentPlan?.billing === 'atlet' ? 'per penggunaan' :
                        'bulanan' }}</p>
                </div>
                <div class="space-y-4 mb-6">
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-500">Harga</span>
                        <span class="font-bold text-navy">{{ currentPlan?.priceLabel }} / {{ currentPlan?.billing
                        }}</span>
                    </div>
                    <div class="flex justify-between items-center text-sm">
                        <span class="text-gray-500">Tagihan Berikutnya</span>
                        <span class="font-bold text-navy">{{ subscriptionRes?.current?.next_billing_date || '-'
                            }}</span>
                    </div>
                </div>

            </div>

            <div class="xl:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h3 class="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-6">Pemakaian & Batas</h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Media Storage Usage -->
                    <div class="space-y-3">
                        <div class="flex justify-between items-end">
                            <div>
                                <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Penyimpanan Media
                                </p>
                                <p class="text-sm font-black text-navy mt-1">{{ usageMedia.current }} / {{
                                    usageMedia.limit }}</p>
                            </div>
                            <span class="text-[10px] font-black text-primary">{{ usageMedia.percent }}%</span>
                        </div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-navy rounded-full transition-all duration-1000"
                                :style="{ width: usageMedia.percent + '%' }"></div>
                        </div>
                    </div>

                    <!-- Club Members Usage -->
                    <div class="space-y-3">
                        <div class="flex justify-between items-end">
                            <div>
                                <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Total Anggota</p>
                                <p class="text-sm font-black text-navy mt-1">{{ usageMembers.current }} / {{
                                    usageMembers.limit }}</p>
                            </div>
                            <span class="text-[10px] font-black text-primary">{{ usageMembers.percent }}%</span>
                        </div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-primary rounded-full transition-all duration-1000"
                                :style="{ width: usageMembers.percent + '%' }"></div>
                        </div>
                    </div>

                    <!-- Remaining Days -->
                    <div class="space-y-3">
                        <div class="flex justify-between items-end">
                            <div>
                                <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Masa Aktif</p>
                                <p class="text-sm font-black text-navy mt-1">{{ remainingDays }} Hari Tersisa</p>
                            </div>
                            <Icon icon="ph:clock-countdown-bold" class="text-primary text-xl" />
                        </div>
                        <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-green-500 rounded-full transition-all duration-1000"
                                :style="{ width: Math.min((remainingDays / totalDays) * 100, 100) + '%' }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="space-y-8">
            <!-- Pilihan Paket Section -->
            <div class="space-y-5">
                <h2 class="text-lg font-extrabold text-navy">Pilihan Paket {{ roleContent.packageTitle }}</h2>
                <div
                    class="flex flex-col lg:flex-row overflow-hidden rounded-[32px] border border-gray-100 shadow-sm bg-white min-h-[500px]">
                    <!-- Banner Highlight (Paket Elite) -->
                    <div
                        class="lg:w-4/12 bg-navy relative flex flex-col justify-center items-center px-8 py-16 text-center overflow-hidden text-white">
                        <div class="relative z-10">
                            <span class="text-primary/60 font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">
                                Direkomendasikan untuk {{ roleContent.recommendationBadge }}
                            </span>
                            <h3 class="text-white text-3xl font-black leading-tight mb-4 tracking-tight">Paket Elite
                            </h3>
                            <div class="h-1.5 w-24 bg-primary mx-auto mb-8 rounded-full"></div>
                            <p class="text-slate-400 text-sm font-medium max-w-[220px] mx-auto leading-relaxed">
                                {{ roleContent.eliteDescription }}
                            </p>

                            <div class="mt-12 space-y-4">
                                <div class="flex items-center gap-3 justify-center text-primary/80">
                                    <Icon icon="ph:crown-fill" class="text-xl" />
                                    <span class="text-xs font-black uppercase tracking-widest text-white/80">Fitur
                                        Premium</span>
                                </div>
                                <div class="flex items-center gap-3 justify-center text-primary/80">
                                    <Icon icon="ph:shield-star-fill" class="text-xl" />
                                    <span class="text-xs font-black uppercase tracking-widest text-white/80">Support
                                        Prioritas</span>
                                </div>
                            </div>
                        </div>
                        <Icon icon="ph:trend-up-bold"
                            class="absolute -bottom-10 -right-10 text-[240px] text-white/5 rotate-12" />
                    </div>

                    <!-- Plan Selection Grid -->
                    <div class="lg:w-8/12 p-8 md:p-12 flex flex-col justify-center bg-slate-50/20">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div v-for="plan in availablePlans" :key="plan.id"
                                class="bg-white p-8 rounded-[24px] border-2 transition-all duration-300 flex flex-col relative group h-full shadow-sm"
                                :class="plan.isCurrent ? 'border-primary ring-8 ring-primary/5' : 'border-gray-100 hover:border-primary/20 hover:shadow-lg'">

                                <div v-if="plan.isCurrent"
                                    class="absolute -top-3 left-6 bg-navy text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                                    Aktif
                                </div>

                                <div class="mb-6">
                                    <div
                                        class="size-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                        <Icon
                                            :icon="plan.name.toLowerCase().includes('elite') ? 'ph:crown-bold' : 'ph:sparkle-bold'"
                                            class="text-xl text-navy" />
                                    </div>
                                    <h4 class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{{
                                        plan.name }}</h4>
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-3xl font-black text-navy">{{ plan.priceLabel }}</span>
                                        <span
                                            class="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">/
                                            {{ plan.billing }}</span>
                                    </div>
                                </div>

                                <ul class="space-y-3 mb-8 flex-1">
                                    <li v-for="feat in plan.features" :key="feat"
                                        class="flex items-start gap-2.5 text-[12px]"
                                        :class="plan.isCurrent ? 'text-navy font-bold' : 'text-navy/60 font-medium'">
                                        <Icon icon="ph:check-circle-fill" class="text-primary text-base shrink-0" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>

                                <button v-if="plan.isCurrent"
                                    class="w-full py-4 text-[10px] font-black bg-slate-100 text-slate-400 rounded-2xl cursor-not-allowed uppercase tracking-widest border border-slate-200"
                                    disabled>
                                    Paket Aktif
                                </button>
                                <button v-else @click="handleSelectPlan(plan)" :disabled="isProcessing"
                                    class="w-full py-4 text-[10px] font-black bg-navy text-white rounded-2xl hover:bg-primary hover:text-navy transition-all uppercase tracking-widest shadow-sm active:scale-95">
                                    {{ plan.isUpgrade ? 'Upgrade Sekarang' : 'Pilih Paket' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- EO Pricing Calculator (Only for Organizations) -->
            <div v-if="userType === 'organization'"
                class="bg-navy rounded-[2.5rem] overflow-hidden shadow-xl border border-white/10 p-8 md:p-12 relative">
                <div class="absolute top-0 right-0 p-12 opacity-5">
                    <Icon icon="ph:calculator-bold" class="text-[200px] text-white" />
                </div>
                <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div
                            class="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full mb-6">
                            <span class="text-[10px] font-black uppercase tracking-widest">Simulasi Biaya Event</span>
                        </div>
                        <h3 class="text-4xl font-black text-white mb-6 tracking-tight">Efisien & Transparan</h3>
                        <p class="text-slate-400 text-base font-medium leading-relaxed max-w-lg mb-8">
                            Bayar hanya berdasarkan jumlah atlet yang benar-benar bertanding. Gunakan slider ini untuk
                            memperkirakan biaya investasi Anda.
                        </p>
                        <div
                            class="flex items-center gap-4 py-4 px-6 bg-white/5 border border-white/10 rounded-2xl w-fit">
                            <Icon icon="ph:tag-fill" class="text-primary text-xl" />
                            <span class="text-white font-black text-xl">Rp 2.000 <span
                                    class="text-xs text-slate-500 font-bold uppercase tracking-widest ml-1">/
                                    Atlet</span></span>
                        </div>
                    </div>

                    <div class="bg-white p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                        <div
                            class="absolute top-0 right-0 size-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors">
                        </div>

                        <label class="block text-[10px] font-black text-gray-400 uppercase mb-8 tracking-[0.2em]">JUMLAH
                            ESTIMASI ATLET</label>

                        <div class="relative mb-12">
                            <input v-model="estimatedArchers"
                                class="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-navy hover:accent-primary transition-all slider-thumb"
                                max="2000" min="50" step="10" type="range" />
                            <div
                                class="mt-6 flex justify-between items-center text-[11px] font-black text-gray-400 uppercase tracking-widest">
                                <span>50</span>
                                <div class="px-5 py-2 bg-navy text-white rounded-xl shadow-lg transform -translate-y-2">
                                    {{ estimatedArchers }} ATLET
                                </div>
                                <span>2000</span>
                            </div>
                        </div>

                        <div class="pt-8 border-t border-gray-100">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <span class="text-xs font-black text-gray-400 uppercase tracking-widest">TOTAL ESTIMASI
                                    BIAYA</span>
                                <span class="text-4xl font-black text-navy tracking-tighter">{{
                                    formatCurrency(estimatedTotal) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Comparison Table Section (Separate Again) -->
            <div class="space-y-6">
                <div class="flex items-center gap-3">
                    <div
                        class="size-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-primary shadow-sm">
                        <Icon icon="ph:scales-bold" class="text-lg" />
                    </div>
                    <h2 class="text-lg font-extrabold text-navy">Perbandingan Detail</h2>
                </div>

                <div class="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden overflow-x-auto">
                    <table class="w-full text-left min-w-[600px]">
                        <thead>
                            <tr class="bg-slate-50/50 border-b border-gray-100">
                                <th class="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                    Fitur Utama</th>
                                <th
                                    class="px-8 py-5 text-center text-xs font-black text-navy uppercase tracking-widest border-l border-gray-50">
                                    Standar</th>
                                <th
                                    class="px-8 py-5 text-center text-xs font-black text-primary uppercase tracking-widest border-l border-gray-50 bg-primary/5">
                                    Elite</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="row in comparisonData" :key="row.feature"
                                class="group hover:bg-slate-50/30 transition-colors">
                                <td class="px-8 py-4">
                                    <div class="flex items-center gap-4">
                                        <Icon :icon="row.icon"
                                            class="text-lg text-gray-400 group-hover:text-primary transition-colors" />
                                        <span class="text-sm font-bold text-navy/80">{{ row.feature }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-4 text-center border-l border-gray-100">
                                    <template v-if="typeof row.basic === 'boolean'">
                                        <Icon :icon="row.basic ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                            class="text-xl mx-auto"
                                            :class="row.basic ? 'text-green-500' : 'text-gray-200'" />
                                    </template>
                                    <span v-else class="text-xs font-black text-navy/60">{{ row.basic }}</span>
                                </td>
                                <td class="px-8 py-4 text-center border-l border-gray-100 bg-primary/5">
                                    <template v-if="typeof row.elite === 'boolean'">
                                        <Icon :icon="row.elite ? 'ph:check-circle-fill' : 'ph:minus-bold'"
                                            class="text-xl mx-auto"
                                            :class="row.elite ? 'text-primary' : 'text-gray-200'" />
                                    </template>
                                    <span v-else class="text-xs font-black text-navy">{{ row.elite }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="p-4 bg-slate-50/50 text-center border-t border-gray-50">
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                            * Downgrade akan berlaku setelah periode tagihan berjalan berakhir.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Riwayat Tagihan Section -->
            <div class="space-y-5">
                <h2 class="text-lg font-extrabold text-navy">Riwayat Tagihan</h2>
                <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-gray-100 bg-slate-50/50 flex items-center justify-between">
                        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Invoice</span>
                        <button v-if="invoices?.length" class="text-navy hover:text-primary-hover">
                            <Icon icon="ph:download-simple-bold" class="text-lg" />
                        </button>
                    </div>

                    <div v-if="invoices?.length" class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead
                                class="bg-gray-50/50 text-gray-400 font-black text-[10px] uppercase tracking-widest border-b border-gray-100">
                                <tr>
                                    <th class="px-8 py-4">Tanggal</th>
                                    <th class="px-8 py-4">Deskripsi</th>
                                    <th class="px-8 py-4">Jumlah</th>
                                    <th class="px-8 py-4">Status</th>
                                    <th class="px-8 py-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-50">
                                <tr v-for="(invoice, index) in invoices" :key="index"
                                    class="hover:bg-slate-50 transition-colors group">
                                    <td class="px-8 py-4 text-xs font-bold text-gray-500">{{ invoice.date }}</td>
                                    <td class="px-8 py-4 text-sm font-black text-navy">{{ invoice.description }}</td>
                                    <td class="px-8 py-4 text-sm font-black text-navy">{{ invoice.amount }}</td>
                                    <td class="px-8 py-4">
                                        <span
                                            class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                                            :class="{
                                                'bg-green-100 text-green-700': invoice.status === 'paid',
                                                'bg-orange-100 text-orange-700': invoice.status === 'pending',
                                                'bg-red-100 text-red-700': ['expired', 'failed'].includes(invoice.status)
                                            }">
                                            {{
                                                invoice.status === 'paid' ? 'Lunas' :
                                                    invoice.status === 'pending' ? 'Pending' :
                                                        invoice.status === 'expired' ? 'Kedaluwarsa' : 'Gagal'
                                            }}
                                        </span>
                                    </td>
                                    <td class="px-8 py-4 text-right">
                                        <div class="flex items-center justify-end gap-2">
                                            <a v-if="invoice.status === 'pending' && invoice.checkout_url"
                                                :href="invoice.checkout_url"
                                                class="px-4 py-2 bg-primary text-navy text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-all shadow-sm">
                                                Bayar Sekarang
                                            </a>
                                            <button v-else-if="invoice.status === 'paid'"
                                                class="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-navy hover:border-primary hover:shadow-lg transition-all">
                                                <Icon icon="ph:file-pdf-bold" class="text-lg" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="flex flex-col items-center justify-center p-16 text-center text-gray-300">
                        <Icon icon="ph:receipt-bold" class="text-4xl mb-4 opacity-20" />
                        <p class="text-xs font-black uppercase tracking-widest">Belum Ada Transaksi</p>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useSubscription } from '~/composables/useSubscription'

definePageMeta({
    layout: 'dashboard'
})

const { user } = useAuth()
const { subscriptionData, fetchSubscription, isLoading } = useSubscription()
const config = useRuntimeConfig()
const router = useRouter()
const userType = computed(() => user.value?.user_type || user.value?.role || 'club')

// Initial fetch on mount to ensure user sees API hit in Network tab
onBeforeMount(async () => {
    await fetchSubscription()
})

onMounted(() => {
    // Force a fresh hit if they navigate back to this page
    fetchSubscription(true)
})

const subscriptionRes = computed(() => subscriptionData.value)

// Payment related state
const handleSelectPlan = (plan) => {
    if (plan.isCurrent) return
    router.push({
        path: '/dashboard/subscription/payment',
        query: {
            plan_id: plan.id,
            plan_name: plan.name,
            plan_price: plan.priceRaw // I'll ensure priceRaw is available
        }
    })
}

const clubPlansDetails = [
    {
        id: 3,
        features: ['Akses Konten Eksklusif', 'Badge Pendukung Profil', 'Update Berita Prioritas', 'E-Certificate Pendukung'],
    },
    {
        id: 4,
        features: ['Semua fitur Basic Support', 'Diskon Khusus Event Klub', 'Grup Komunitas Prioritas', 'Konsultasi Coach Bulanan', 'Akses Awal Fitur Baru'],
    }
]

const orgPlansDetails = [
    {
        id: 5,
        features: ['Landing page kustom', 'Sistem bagan eliminasi', 'Scoring langsung (Real-time)', 'E-Sertifikat otomatis', 'Integrasi payment gateway'],
    },
    {
        id: 6,
        features: ['Semua fitur Standard', 'Pendaftaran Kustom Penuh', 'Integrasi Gerbang Pembayaran', 'Dukungan Prioritas 24/7', 'Laporan Analitik Event'],
    }
]

const comparisonData = computed(() => {
    if (userType.value === 'organization') {
        return [
            { feature: 'Manajemen Event', basic: 'Batas 1 Event', elite: 'Tak Terbatas', icon: 'ph:calendar-bold' },
            { feature: 'Bagan Eliminasi', basic: 'Standard', elite: 'Lanjutan & Kustom', icon: 'ph:git-branch-bold' },
            { feature: 'Live Scoring', basic: 'Dasar', elite: 'Real-time Premium', icon: 'ph:timer-bold' },
            { feature: 'Custom Domain', basic: false, elite: true, icon: 'ph:globe-bold' },
            { feature: 'Dukungan Prioritas', basic: 'Email', elite: 'Grup WhatsApp 24/7', icon: 'ph:headset-bold' },
            { feature: 'Potongan Biaya', basic: '2.000 / Atlet', elite: 'Harga Kontrak', icon: 'ph:tag-bold' },
        ]
    }
    return [
        { feature: 'Maksimum Anggota', basic: '50 Orang', elite: 'Tak Terbatas', icon: 'ph:users-three-bold' },
        { feature: 'Penyimpanan Media', basic: '1 GB', elite: 'Tak Terbatas', icon: 'ph:hard-drives-bold' },
        { feature: 'Sertifikat Kustom', basic: false, elite: true, icon: 'ph:certificate-bold' },
        { feature: 'Analitik Lanjutan', basic: false, elite: true, icon: 'ph:chart-bar-bold' },
        { feature: 'Dukungan Prioritas', basic: 'Email', elite: 'Prioritas 24/7', icon: 'ph:headset-bold' },
        { feature: 'Iklan/Promo Event', basic: false, elite: true, icon: 'ph:megaphone-bold' },
    ]
})

const estimatedArchers = ref(150)
const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(value)
}
const estimatedTotal = computed(() => estimatedArchers.value * 2000)

const isSubscribed = computed(() => !!subscriptionRes.value?.current?.plan_id)

const availablePlans = computed(() => {
    const plansFromApi = subscriptionRes.value?.plans || []
    const currentPlanId = subscriptionRes.value?.current?.plan_id

    const details = userType.value === 'organization' ? orgPlansDetails : clubPlansDetails

    // Filter unique plans by name to avoid duplicates
    const uniquePlans = []
    const seenNames = new Set()

    for (const plan of plansFromApi) {
        if (!seenNames.has(plan.name)) {
            uniquePlans.push(plan)
            seenNames.add(plan.name)
        } else if (plan.id === currentPlanId) {
            const existingIdx = uniquePlans.findIndex(p => p.name === plan.name)
            if (existingIdx !== -1) uniquePlans[existingIdx] = plan
        }
    }

    // Fallback if API returns nothing (for development/demo)
    if (uniquePlans.length === 0) {
        return details.slice(0, 2).map((d, i) => ({
            id: d.id,
            name: i === 0 ? 'Standar' : 'Elite',
            priceLabel: i === 0 ? 'Rp 34.900' : 'Rp 79.900',
            priceRaw: i === 0 ? 34900 : 79900,
            billing: 'bln',
            features: d.features,
            isCurrent: false,
            isUpgrade: i === 1
        }))
    }

    return uniquePlans.map(plan => {
        const detail = details.find(d => d.id === plan.id)

        // Translate name to Indonesian
        let localizedName = plan.name
        if (plan.name.toLowerCase().includes('basic') || plan.name.toLowerCase().includes('standard')) {
            localizedName = 'Standar'
        } else if (plan.name.toLowerCase().includes('elite') || plan.name.toLowerCase().includes('premium')) {
            localizedName = 'Elite'
        }

        return {
            id: plan.id,
            name: localizedName,
            priceLabel: plan.price < 1000 ? 'Gratis' : `Rp ${new Intl.NumberFormat('id-ID').format(plan.price)}`,
            priceRaw: plan.price,
            billing: plan.type === 'yearly' ? 'thn' : (plan.name.includes('EO') && plan.price < 5000 ? 'atlet' : 'bln'),
            features: detail ? detail.features : JSON.parse(plan.features || '[]'),
            isCurrent: plan.id === currentPlanId || (userType.value === 'club' && !currentPlanId && localizedName === 'Standar'),
            isUpgrade: plan.id > (currentPlanId || 0) && !(userType.value === 'club' && !currentPlanId && localizedName === 'Standar')
        }
    })
})

const currentPlan = computed(() => {
    return availablePlans.value.find(p => p.isCurrent) || availablePlans.value[0] || null
})

const invoices = computed(() => subscriptionRes.value?.invoices || [])

const usageMedia = computed(() => ({
    current: '256 MB',
    limit: currentPlan.value?.id === 2 ? 'Unlimited' : '1 GB',
    percent: 25
}))

const usageMembers = computed(() => ({
    current: subscriptionRes.value?.current?.usage?.current || 0,
    limit: currentPlan.value?.id === 2 ? 'Unlimited' : (subscriptionRes.value?.current?.usage?.limit || 50),
    percent: Math.min(((subscriptionRes.value?.current?.usage?.current || 0) / (subscriptionRes.value?.current?.usage?.limit || 50)) * 100, 100)
}))

const remainingDays = computed(() => {
    const nextBilling = subscriptionRes.value?.current?.next_billing_date
    if (!nextBilling) return 0
    // Fix: MySQL DATE_FORMAT %b might be local. Let's assume standard format for now.
    const diff = new Date(nextBilling) - new Date()
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0)
})

const totalDays = computed(() => {
    const cur = subscriptionRes.value?.current
    if (cur?.status === 'trial') return 120
    if (cur?.billing_type === 'yearly') return 360
    return 30
})

const roleContent = computed(() => {
    const isOrg = userType.value === 'organization'
    return {
        packageTitle: isOrg ? 'Event Optimizer' : 'Klub',
        promoBadge: isOrg ? 'Penyelenggara Baru' : 'Klub Baru',
        promoTitle: isOrg ? 'Mulai Turnamen Anda Gratis 4 Bulan!' : 'Mulai Klub Anda Gratis 4 Bulan!',
        promoDesc: isOrg
            ? 'Daftarkan organisasi Anda sekarang dan dapatkan paket Standard secara gratis selama 4 bulan pertama.'
            : 'Daftarkan klub Anda sekarang dan dapatkan paket Standard secara gratis selama 4 bulan pertama.',
        savings: isOrg ? '799.000' : '139.600',
        recommendationBadge: isOrg ? 'EO Profesional' : 'Klub Utama',
        eliteDescription: isOrg
            ? 'Solusi lengkap untuk turnamen skala besar dengan fitur kustom pendaftaran.'
            : 'Dapatkan fitur eksklusif dan limit lebih besar untuk komunitas Anda.'
    }
})

const usageMessage = computed(() => {
    const usage = subscriptionRes.value?.current?.usage
    if (!usage) return ''
    return usage.current >= usage.limit
        ? 'Batas kuota tercapai. Silakan upgrade paket Anda.'
        : 'Pemakaian kuota Anda masih dalam batas wajar.'
})

useSeoMeta({
    title: 'Dashboard Berlangganan - Archeryhub.id',
    description: 'Kelola langganan, batas penggunaan, dan riwayat tagihan di dashboard Archeryhub.id.'
})
</script>

<style scoped>
.target-texture {
    background-image: radial-gradient(circle, transparent 20%, rgba(0, 0, 0, 0.03) 21%, rgba(0, 0, 0, 0.03) 39%, transparent 40%, transparent 59%, rgba(0, 0, 0, 0.03) 60%, rgba(0, 0, 0, 0.03) 79%, transparent 80%);
    background-size: 300px 300px;
    background-position: center;
}
</style>
