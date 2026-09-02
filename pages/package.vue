<template>
    <div class="min-h-screen bg-slate-50 text-navy">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24 flex items-center">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event-detail.jpeg" alt="Package Hero"
                    class="w-full h-full object-cover object-center opacity-30" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-95"></div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-xs font-black tracking-widest mb-6 border border-primary/20 shadow-sm">
                        <Icon icon="ph:crown-simple-bold" class="text-base text-primary" />
                        <span class="capitalize">{{ $t('subscription_page.badge', 'Paket Kuota Event') }}</span>
                    </div>
                    <h1
                        class="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        {{ $t('subscription_page.title', 'Skalakan Manajemen Turnamen Panahan Anda') }}
                    </h1>
                    <div class="text-white/80 text-sm md:text-lg leading-relaxed max-w-2xl font-medium">
                        {{ $t('subscription_page.description', 'Opsi fleksibel dan transparan untuk penyelenggara turnamen skala klub hingga kejuaraan nasional & internasional. Nikmati promo gratis paket Standard untuk 3 bulan pertama!') }}
                    </div>
                </div>
            </div>
        </section>

        <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <!-- ─── Pricing / Package Cards ─── -->
            <div class="space-y-16">
                <!-- 3 Cards: Standar (Left - PROMO), Free (Middle), Elite (Right) -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
                    
                    <!-- 1. Standar EO (Left Card — PROMO 3 BULAN GRATIS) -->
                    <div
                        class="bg-navy rounded-[2.5rem] p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-2 group hover:shadow-2xl border-2 border-primary/40 ring-2 ring-primary/20">
                        <!-- Promo Ribbon / Badge -->
                        <div class="absolute top-0 right-0 bg-gradient-to-l from-primary to-amber-300 text-navy px-5 py-2 text-[10px] font-black tracking-widest rounded-bl-2xl uppercase shadow-md flex items-center gap-1.5">
                            <Icon icon="ph:sparkle-fill" class="text-xs" />
                            <span>{{ $t('subscription_page.promo_badge', 'PROMO 3 BULAN PERTAMA') }}</span>
                        </div>

                        <!-- Glow behind card -->
                        <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 blur-[60px] rounded-full pointer-events-none"></div>
                        <!-- Dot pattern -->
                        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                        <!-- Card Content wrapper -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full">
                            <div>
                                <div class="flex items-center justify-between mb-6">
                                    <div
                                        class="size-12 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center text-primary shadow-md shadow-primary/10">
                                        <Icon icon="ph:lightning-bold" class="text-2xl" />
                                    </div>
                                </div>
                                <h3 class="text-2xl font-black text-white mb-2">{{ $t('subscription_page.basic_title', 'Standar EO') }}</h3>
                                <div class="text-slate-300 text-xs font-semibold leading-relaxed mb-6">{{ $t('subscription_page.basic_desc', 'Solusi turnamen lengkap untuk klub & kejuaraan panahan skala menengah.') }}</div>
                                
                                <!-- Strikethrough Price + Promo Free Display -->
                                <div class="mb-4">
                                    <!-- Original Price Struck Through -->
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-sm font-bold text-slate-400 line-through tracking-tight opacity-75">
                                            {{ isUSD ? '$3.00' : 'Rp 49.900' }}
                                        </span>
                                        <span class="text-[10px] font-black uppercase text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                                            100% OFF
                                        </span>
                                    </div>
                                    <!-- Promo Price (Rp 0) -->
                                    <div class="flex items-baseline gap-1">
                                        <span v-if="isUSD" class="text-lg font-bold text-primary">$</span>
                                        <span v-else class="text-lg font-bold text-primary">Rp</span>
                                        <span class="text-5xl font-black text-white tracking-tighter">0</span>
                                        <span class="text-primary font-bold tracking-wider text-xs">/event</span>
                                    </div>
                                    <div class="text-[11px] text-amber-200/90 font-medium mt-2 leading-relaxed">
                                        {{ $t('subscription_page.promo_subtext', 'Gratis masa promo 3 bulan ke depan, setelahnya berlaku tarif normal Rp 49.900/event.') }}
                                    </div>
                                </div>

                                <div class="h-px bg-white/10 mb-6"></div>
                                
                                <ul class="space-y-3.5 mb-8">
                                    <li v-for="feat in eoBasicFeatures" :key="feat"
                                        class="flex items-start gap-3 text-xs sm:text-sm font-bold text-white/95">
                                        <Icon icon="ph:check-circle-fill" class="text-primary text-lg shrink-0 mt-0.5" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <button
                                @click="handleSelectPlan(3, 'Standar', 0)"
                                class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-primary to-amber-300 hover:from-primary-hover hover:to-amber-400 text-navy font-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                                <Icon icon="ph:sparkle-bold" class="text-lg" />
                                <span>{{ $t('subscription_page.claim_standard_promo', 'Klaim Promo Standar') }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- 2. Free / Starter Plan (Middle Card) -->
                    <div
                        class="bg-white border-2 border-slate-200 rounded-[2.5rem] p-8 flex flex-col justify-between h-full shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                        <!-- Starter badge -->
                        <div class="absolute top-0 right-0 bg-slate-100 text-slate-600 px-5 py-2 text-[10px] font-black tracking-widest rounded-bl-2xl uppercase border-b border-l border-slate-200">
                            {{ $t('subscription_page.starter_badge', 'Starter') }}
                        </div>

                        <!-- Card Content wrapper -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full">
                            <div>
                                <div class="flex items-center justify-between mb-6">
                                    <div
                                        class="size-12 bg-slate-100 rounded-2xl flex items-center justify-center text-navy font-black">
                                        <Icon icon="ph:leaf-bold" class="text-2xl text-navy" />
                                    </div>
                                </div>
                                <h3 class="text-2xl font-black text-navy mb-2">{{ $t('subscription_page.free_title', 'Free EO') }}</h3>
                                <div class="text-gray-500 text-xs font-semibold leading-relaxed mb-6">{{ $t('subscription_page.free_desc', 'Coba dan kelola turnamen pertama Anda secara instan tanpa biaya.') }}</div>
                                
                                <div class="mb-8">
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-5xl font-black text-navy tracking-tighter">{{ isUSD ? '$0' : $t('subscription_page.free_price', 'Gratis') }}</span>
                                    </div>
                                </div>

                                <div class="h-px bg-slate-100 mb-8"></div>
                                
                                <ul class="space-y-3.5 mb-10">
                                    <li v-for="feat in eoFreeFeatures" :key="feat"
                                        class="flex items-start gap-3 text-xs sm:text-sm font-bold text-navy/80">
                                        <Icon icon="ph:check-circle-fill" class="mt-0.5 text-lg shrink-0 text-emerald-500" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <button
                                @click="handleSelectPlan(0, 'Free', 0)"
                                class="w-full py-4 px-6 rounded-2xl bg-slate-100 text-navy font-black hover:bg-slate-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xs">
                                {{ $t('subscription_page.choose_plan', 'Pilih Paket') }}
                            </button>
                        </div>
                    </div>

                    <!-- 3. Elite EO (Right Card) -->
                    <div
                        class="bg-navy rounded-[2.5rem] p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-2 group hover:shadow-2xl">
                        <!-- Glow behind card -->
                        <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
                        <!-- Dot pattern -->
                        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                        <!-- Card Content wrapper -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full">
                            <div>
                                <div class="flex items-center justify-between mb-6">
                                    <div
                                        class="size-12 bg-primary rounded-2xl flex items-center justify-center text-navy shadow-md shadow-primary/20">
                                        <Icon icon="ph:crown-simple-fill" class="text-2xl" />
                                    </div>
                                    <span class="px-3 py-1 bg-white/10 backdrop-blur-sm text-primary text-[9px] font-black tracking-widest rounded-md uppercase">
                                        {{ $t('subscription_page.professional', 'Profesional') }}
                                    </span>
                                </div>
                                <h3 class="text-2xl font-black text-white mb-2">{{ $t('subscription_page.elite_title', 'Elite EO') }}</h3>
                                <div class="text-slate-400 text-xs font-semibold leading-relaxed mb-6">{{ $t('subscription_page.elite_desc', 'Fitur terlengkap tanpa batas untuk kejuaraan profesional dan skala besar.') }}</div>
                                
                                <div class="mb-8">
                                    <div class="flex items-baseline gap-1">
                                        <span v-if="isUSD" class="text-lg font-bold text-white opacity-45">$</span>
                                        <span v-else class="text-lg font-bold text-white opacity-45">Rp</span>
                                        <span class="text-5xl font-black text-white tracking-tighter">{{ isUSD ? '5.00' : '79.900' }}</span>
                                        <span class="text-slate-400 font-bold tracking-wider text-xs">/event</span>
                                    </div>
                                </div>

                                <div class="h-px bg-white/10 mb-8"></div>
                                
                                <ul class="space-y-3.5 mb-10">
                                    <li v-for="feat in eoEliteFeatures" :key="feat"
                                        class="flex items-start gap-3 text-xs sm:text-sm font-bold text-white/95">
                                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-lg shrink-0 mt-0.5" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <button
                                @click="handleSelectPlan(4, 'Elite', isUSD ? 5 : 79900)"
                                class="w-full py-4 px-6 rounded-2xl bg-primary text-navy font-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/10">
                                {{ $t('subscription_page.choose_plan', 'Pilih Paket') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- ─── Simple Detailed Comparison Matrix ─── -->
                <div class="w-full pt-10">
                    <div class="text-center mb-10">
                        <h3 class="text-xs font-black text-gray-400 tracking-[0.25em] uppercase mb-3">
                            {{ $t('subscription_page.detail_comparison', 'Perbandingan Fitur Paket') }}
                        </h3>
                        <div class="h-1 w-12 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <!-- Comparison Table -->
                    <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-6 sm:p-10 relative overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full min-w-[700px] border-collapse">
                                <thead>
                                    <tr class="border-b border-slate-200 text-xs font-black tracking-widest text-slate-400 uppercase">
                                        <th class="pb-6 text-left w-[40%]">{{ $t('subscription_page.feature_header', 'Fitur & Kapasitas') }}</th>
                                        <th class="pb-6 text-center w-[20%]">
                                            <span class="inline-block px-3 py-1 bg-slate-100 text-navy rounded-lg">
                                                {{ $t('subscription_page.free_title', 'Free EO') }}
                                            </span>
                                        </th>
                                        <th class="pb-6 text-center w-[20%] text-navy">
                                            <span class="inline-block px-3 py-1 bg-primary/20 text-navy rounded-lg border border-primary/30">
                                                {{ $t('subscription_page.basic_title', 'Standar EO (Promo)') }}
                                            </span>
                                        </th>
                                        <th class="pb-6 text-center w-[20%] text-navy">{{ $t('subscription_page.elite_title', 'Elite EO') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    <tr v-for="row in eoComparisonData" :key="row.feature"
                                        class="group hover:bg-slate-50/50 transition-all duration-300">
                                        <td class="py-5 text-sm font-bold text-navy">
                                            {{ row.feature }}
                                        </td>
                                        <td class="py-5 text-center">
                                            <template v-if="typeof row.free === 'boolean'">
                                                <div class="flex items-center justify-center">
                                                    <Icon :icon="row.free ? 'ph:check-circle-fill' : 'ph:minus-circle-fill'"
                                                        :class="row.free ? 'text-emerald-500' : 'text-slate-300'"
                                                        class="text-xl" />
                                                </div>
                                            </template>
                                            <span v-else class="text-sm font-black text-navy">{{ row.free }}</span>
                                        </td>
                                        <td class="py-5 text-center">
                                            <template v-if="typeof row.standar === 'boolean'">
                                                <div class="flex items-center justify-center">
                                                    <Icon :icon="row.standar ? 'ph:check-circle-fill' : 'ph:minus-circle-fill'"
                                                        :class="row.standar ? 'text-emerald-500' : 'text-slate-300'"
                                                        class="text-xl" />
                                                </div>
                                            </template>
                                            <span v-else class="text-sm font-black text-navy">{{ row.standar }}</span>
                                        </td>
                                        <td class="py-5 text-center">
                                            <template v-if="typeof row.elite === 'boolean'">
                                                <div class="flex items-center justify-center">
                                                    <Icon :icon="row.elite ? 'ph:check-circle-fill' : 'ph:minus-circle-fill'"
                                                        :class="row.elite ? 'text-emerald-500' : 'text-slate-300'"
                                                        class="text-xl" />
                                                </div>
                                            </template>
                                            <span v-else class="text-sm font-black text-navy">{{ row.elite }}</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <!-- FAQ Section -->
                <div class="mt-20 md:mt-28 w-full">
                    <div class="text-center mb-16">
                        <h2 class="text-xs font-black text-primary tracking-[0.3em] mb-4 uppercase">{{ $t('subscription_page.faq_title', 'FAQ') }}</h2>
                        <h4 class="font-black text-navy text-2xl sm:text-3xl md:text-5xl tracking-tight">
                            {{ $t('subscription_page.faq_subtitle', 'Pertanyaan yang Sering Diajukan') }}
                        </h4>
                    </div>
                    <div class="space-y-4">
                        <div v-for="(faq, index) in faqs" :key="index"
                            class="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-sm">
                            <button @click="toggleFaq(index)"
                                class="w-full px-6 sm:px-10 py-6 md:py-8 flex items-center justify-between text-left group">
                                <span class="text-lg font-black text-navy pr-6 relative pb-1 transition-all duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
                                    {{ faq.question }}
                                </span>
                                <div
                                    :class="['size-8 rounded-xl flex items-center justify-center transition-all duration-500', activeFaq === index ? 'bg-navy text-white rotate-180' : 'bg-slate-50 text-slate-300 group-hover:bg-slate-100']">
                                    <Icon icon="ph:caret-down-bold" class="text-base" />
                                </div>
                            </button>
                            <transition enter-active-class="transition-all duration-500 ease-out"
                                enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-[300px] opacity-100"
                                leave-active-class="transition-all duration-300 ease-in"
                                leave-from-class="max-h-[300px] opacity-100" leave-to-class="max-h-0 opacity-0">
                                <div v-show="activeFaq === index"
                                    class="px-6 sm:px-10 pb-10 text-gray-500 text-sm sm:text-base leading-relaxed font-semibold">
                                    {{ faq.answer }}
                                </div>
                            </transition>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const activeFaq = ref(0)
const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

const { tm, t, locale } = useI18n()
const { user, organizerProfile } = useAuth()
const router = useRouter()

definePageMeta({
    layout: 'landing'
})

useHead({ title: computed(() => t('nav.pricing', 'Event Packages') + ' - Archeris') })

const isUSD = computed(() => {
    if (user.value && organizerProfile.value) {
        return organizerProfile.value.country !== 'Indonesia'
    }
    return locale.value === 'en' || locale.value === 'kr'
})

const handleSelectPlan = (planId, planName, planPrice) => {
    if (!user.value) {
        router.push(`/auth/register?redirect=${encodeURIComponent('/package')}`)
        return
    }
    // Logged in: redirect to organizer package dashboard
    router.push('/dashboard/organizer/package')
}

const resolveMessage = (path, rawVal) => {
    if (rawVal == null) return ''
    if (typeof rawVal === 'boolean' || typeof rawVal === 'number') return rawVal
    return t(path)
}

const eoBasicFeatures = computed(() => {
    const raw = tm('subscription_page.basic_features_list') || []
    if (!Array.isArray(raw) || raw.length === 0) {
        return [
            'Kuota Event Standar',
            'Hingga 200 Peserta / Event',
            'Hingga 10 Kategori Lomba',
            '3 Akun Wasit / Scorekeeper',
            'Scoring Kualifikasi & Bagan Eliminasi Live',
            'Sertifikat Digital Standar (Otomatis)',
            'Unduh 6 Jenis Printout Turnamen Lengkap',
            'Gateway Pembayaran Otomatis (Mayar QRIS & VA)'
        ]
    }
    return raw.map((item, idx) => resolveMessage(`subscription_page.basic_features_list.${idx}`, item))
})

const eoFreeFeatures = computed(() => {
    const raw = tm('subscription_page.free_features_list') || []
    if (!Array.isArray(raw) || raw.length === 0) {
        return [
            '1 Slot Kuota Event Gratis',
            'Maksimal 10 Peserta / Event',
            '1 Akun Wasit / Scorekeeper',
            'Digital Scoring Kualifikasi Dasar',
            'Laporan Hasil & Printout Dasar (PDF)'
        ]
    }
    return raw.map((item, idx) => resolveMessage(`subscription_page.free_features_list.${idx}`, item))
})

const eoEliteFeatures = computed(() => {
    const raw = tm('subscription_page.elite_features_list') || []
    if (!Array.isArray(raw) || raw.length === 0) {
        return [
            'Peserta & Kategori Tanpa Batas (Unlimited)',
            'Wasit & Scorekeeper Tanpa Batas',
            'Custom Desain Template Sertifikat (16:9 & A4)',
            'Live Embed Widget Bracket & Leaderboard (OBS / Web)',
            'Multi-Payment Gateway Lengkap (Mayar QRIS, VA, E-Wallet)',
            'Ekspor Rekap Excel Lengkap & Laporan Keuangan',
            'Prioritas Dukungan Teknis Penyelenggaraan'
        ]
    }
    return raw.map((item, idx) => resolveMessage(`subscription_page.elite_features_list.${idx}`, item))
})

const eoComparisonData = computed(() => {
    return [
        {
            feature: t('subscription_page.comparison.participants_limit', 'Batas Peserta per Event'),
            free: '10 ' + t('common.participants', 'Peserta'),
            standar: '200 ' + t('common.participants', 'Peserta'),
            elite: t('subscription_page.unlimited', 'Tanpa Batas')
        },
        {
            feature: t('subscription_page.comparison.categories_limit', 'Batas Kategori Lomba'),
            free: '2 ' + t('dashboard.sidebar.competition_categories', 'Kategori'),
            standar: '10 ' + t('dashboard.sidebar.competition_categories', 'Kategori'),
            elite: t('subscription_page.unlimited', 'Tanpa Batas')
        },
        {
            feature: t('subscription_page.comparison.scorekeepers_limit', 'Akun Wasit / Scorekeeper'),
            free: '1 ' + t('dashboard.sidebar.roles.scorekeeper', 'Wasit'),
            standar: '3 ' + t('dashboard.sidebar.roles.scorekeeper', 'Wasit'),
            elite: t('subscription_page.unlimited', 'Tanpa Batas')
        },
        {
            feature: t('subscription_page.comparison.digital_scoring', 'Digital Scoring Kualifikasi'),
            free: true,
            standar: true,
            elite: true
        },
        {
            feature: t('subscription_page.comparison.elimination_brackets', 'Bagan Eliminasi & Match Play'),
            free: false,
            standar: true,
            elite: true
        },
        {
            feature: t('subscription_page.comparison.digital_certificates', 'Sertifikat Digital Pemanah'),
            free: false,
            standar: t('subscription_page.cert_basic', 'Template Standar'),
            elite: t('subscription_page.cert_custom', 'Custom Template (16:9 & A4)')
        },
        {
            feature: t('subscription_page.comparison.tournament_printouts', 'Printout Scoresheet & Bagan'),
            free: t('subscription_page.export_basic', 'Laporan Dasar'),
            standar: t('subscription_page.export_standard', 'Lengkap (6 Dokumen)'),
            elite: t('subscription_page.export_elite', 'Lengkap (6 Dokumen)')
        },
        {
            feature: t('subscription_page.comparison.payment_gateway', 'Gateway Pembayaran Otomatis'),
            free: false,
            standar: 'Mayar (QRIS, VA)',
            elite: 'Mayar (QRIS, VA, E-Wallet)'
        },
        {
            feature: t('subscription_page.comparison.live_widgets', 'Live Widget Embed (OBS / Web)'),
            free: false,
            standar: false,
            elite: true
        },
        {
            feature: t('subscription_page.comparison.export_analytics', 'Ekspor Data & Rekap Excel'),
            free: 'PDF',
            standar: 'PDF & CSV',
            elite: 'PDF, CSV, & Excel'
        },
        {
            feature: t('subscription_page.comparison.media_storage', 'Penyimpanan Media'),
            free: '250 MB',
            standar: '1 GB',
            elite: '5 GB'
        },
        {
            feature: t('subscription_page.comparison.technical_support', 'Dukungan Bantuan'),
            free: t('subscription_page.support_standard', 'Standar'),
            standar: t('subscription_page.support_fast', 'Dukungan Cepat'),
            elite: t('subscription_page.support_priority', 'Prioritas VIP')
        }
    ]
})

const faqs = computed(() => {
    const raw = tm('subscription_page.faqs_list') || []
    if (!Array.isArray(raw) || raw.length === 0) {
        return [
            {
                question: t('subscription_page.faqs_list.0.question', 'Bagaimana cara kerja promo gratis paket Standar EO selama 3 bulan?'),
                answer: t('subscription_page.faqs_list.0.answer', 'Selama masa promo 3 bulan pertama, Anda dapat mendaftarkan dan menggunakan paket Standar EO secara gratis (Rp 0) tanpa dipungut biaya kuota untuk mempublikasikan turnamen panahan Anda.')
            },
            {
                question: t('subscription_page.faqs_list.1.question', 'Apa yang terjadi setelah masa promo 3 bulan berakhir?'),
                answer: t('subscription_page.faqs_list.1.answer', 'Setelah masa promo 3 bulan berakhir, turnamen yang telah Anda buat tetap aktif dan tidak akan dihapus. Untuk turnamen baru selanjutnya, Anda dapat membeli kuota Standar EO dengan tarif normal Rp 49.900 per event.')
            },
            {
                question: t('subscription_page.faqs_list.2.question', 'Apakah kuota event yang dibeli memiliki batas kedaluwarsa?'),
                answer: t('subscription_page.faqs_list.2.answer', 'Tidak sama sekali. Seluruh kuota event (baik Standar maupun Elite) yang ada di akun Anda tersimpan permanen tanpa batas kedaluwarsa dan siap digunakan kapan saja.')
            },
            {
                question: t('subscription_page.faqs_list.3.question', 'Kapan kuota event terpotong dari saldo akun saya?'),
                answer: t('subscription_page.faqs_list.3.answer', 'Kuota event baru terpotong saat Anda mempublikasikan event (mengubah status event dari Draft ke Publik). Selama event masih dalam tahap perencanaan/draft, kuota belum digunakan.')
            },
            {
                question: t('subscription_page.faqs_list.4.question', 'Apakah saya bisa membeli jumlah slot event kustom (custom slots)?'),
                answer: t('subscription_page.faqs_list.4.answer', 'Ya! Di dashboard penyelenggara, Anda dapat menentukan sendiri jumlah slot kuota event yang ingin dibeli sesuai jadwal turnamen Anda sepanjang tahun.')
            }
        ]
    }
    return raw.map((item, idx) => ({
        question: resolveMessage(`subscription_page.faqs_list.${idx}.question`, item.question),
        answer: resolveMessage(`subscription_page.faqs_list.${idx}.answer`, item.answer)
    }))
})

useSeoMeta({
    title: () => `${t('subscription_page.title', 'Skalakan Manajemen Panahan Anda')} - Archeris`,
    description: () => t('subscription_page.description', 'Pilihan paket turnamen panahan terbaik untuk penyelenggara.')
})
</script>
