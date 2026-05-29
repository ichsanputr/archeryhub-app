<template>
    <div class="min-h-screen bg-slate-50 text-navy">
        <!-- Hero Section -->
        <section class="bg-navy relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24 flex items-center">
            <div class="absolute inset-0 z-0">
                <img src="/hero-event-detail.jpeg" alt="Pricing Hero"
                    class="w-full h-full object-cover object-center opacity-30" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-95">
                </div>
            </div>
            <div class="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div class="max-w-3xl">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary text-[10px] sm:text-xs font-black tracking-widest mb-6">
                        <Icon icon="ph:credit-card-bold" class="text-base" />
                        <span class="capitalize">{{ $t('subscription_page.badge', 'Paket Berlangganan') }}</span>
                    </div>
                    <h1
                        class="text-3xl sm:text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-6">
                        {{ $t('subscription_page.title', 'Skalakan Manajemen Panahan Anda') }}
                    </h1>
                    <div class="text-white/80 text-sm md:text-lg leading-relaxed max-w-2xl font-medium">
                        {{ $t('subscription_page.description', 'Opsi fleksibel untuk penyelenggara turnamen skala kecil sampai skala internasional. Pilih paket yang sesuai dengan kebutuhan Anda.') }}
                    </div>
                </div>
            </div>
        </section>

        <main class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            <!-- ─── Pricing Cards ─── -->
            <div class="space-y-16">
                <!-- 3 Cards: Standar (Left), Free (Middle), Elite (Right) -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
                    <!-- 1. Standar EO (Left Card — styled same as Elite EO) -->
                    <div
                        class="bg-navy rounded-[2.5rem] p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-2 group hover:shadow-2xl">
                        <!-- Glow behind card -->
                        <div class="absolute -top-16 -right-16 w-48 h-48 bg-white/5 blur-[60px] rounded-full pointer-events-none"></div>
                        <!-- Dot pattern with pointer-events-none -->
                        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                        <!-- Card Content wrapper to force it above absolute overlays -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full">
                            <div>
                                <div class="flex items-center justify-between mb-8">
                                    <div
                                        class="size-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary shadow-md shadow-primary/10">
                                        <Icon icon="ph:lightning-bold" class="text-2xl" />
                                    </div>
                                </div>
                                <h3 class="text-2xl font-black text-white mb-2">{{ $t('subscription_page.basic_title', 'Standar Eo') }}</h3>
                                <p class="text-slate-400 text-xs font-semibold leading-relaxed mb-6">{{ $t('subscription_page.basic_desc', 'Solusi digital lengkap untuk turnamen skala kecil & menengah.') }}</p>
                                
                                <div class="mb-8">
                                    <div class="flex items-baseline gap-1">
                                        <span v-if="isUSD" class="text-lg font-bold text-white opacity-45">$</span>
                                        <span v-else class="text-lg font-bold text-white opacity-45">Rp</span>
                                        <span class="text-5xl font-black text-white tracking-tighter">{{ planPrices.standar.display.replace('Rp ', '').replace('$', '') }}</span>
                                        <span class="text-slate-400 font-bold tracking-wider text-xs">{{ planPrices.standar.period }}</span>
                                    </div>
                                </div>

                                <div class="h-px bg-white/10 mb-8"></div>
                                
                                <ul class="space-y-4 mb-10">
                                    <li v-for="feat in eoBasicFeatures" :key="feat"
                                        class="flex items-start gap-4 text-sm font-bold text-white/95">
                                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-xl shrink-0" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <button
                                @click="handleSelectPlan(3, 'Standar', isUSD ? 2 : 30000)"
                                class="w-full py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg">
                                {{ $t('subscription_page.choose_plan', 'Pilih Paket') }}
                            </button>
                        </div>
                    </div>

                    <!-- 2. Free / Starter Plan (Middle Card — Featured) -->
                    <div
                        class="bg-white border-2 border-primary rounded-[2.5rem] p-8 flex flex-col justify-between h-full shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group relative overflow-hidden">
                        <!-- Popular badge -->
                        <div class="absolute top-0 right-0 bg-primary text-navy px-5 py-2 text-[10px] font-black tracking-[0.2em] rounded-bl-2xl capitalize">
                            {{ $t('subscription_page.starter_badge', 'Starter') }}
                        </div>

                        <!-- Card Content wrapper to force it above absolute overlays -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full">
                            <div>
                                <div class="flex items-center justify-between mb-8">
                                    <div
                                        class="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary-dark font-black">
                                        <Icon icon="ph:leaf-bold" class="text-2xl text-navy" />
                                    </div>
                                </div>
                                <h3 class="text-2xl font-black text-navy mb-2">{{ $t('subscription_page.free_title', 'Free Eo') }}</h3>
                                <p class="text-gray-500 text-xs font-semibold leading-relaxed mb-6">{{ $t('subscription_page.free_desc', 'Mulai kelola turnamen pertama Anda secara instan tanpa biaya.') }}</p>
                                
                                <div class="mb-8">
                                    <div class="flex items-baseline gap-1">
                                        <span class="text-5xl font-black text-navy tracking-tighter">{{ planPrices.free.display }}</span>
                                    </div>
                                </div>

                                <div class="h-px bg-slate-100 mb-8"></div>
                                
                                <ul class="space-y-4 mb-10">
                                    <li v-for="feat in eoFreeFeatures" :key="feat"
                                        class="flex items-start gap-3 text-sm font-bold text-navy/80">
                                        <Icon icon="ph:check-circle-fill" class="mt-0.5 text-lg shrink-0 text-emerald-500" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <button
                                @click="handleSelectPlan(0, 'Free', 0)"
                                class="w-full py-4 px-6 rounded-2xl bg-navy text-white font-black hover:bg-navy/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-md">
                                {{ $t('subscription_page.choose_plan', 'Pilih Paket') }}
                            </button>
                        </div>
                    </div>

                    <!-- 3. Elite EO (Right Card) -->
                    <div
                        class="bg-navy rounded-[2.5rem] p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-2 group hover:shadow-2xl">
                        <!-- Glow behind card -->
                        <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
                        <!-- Dot pattern with pointer-events-none -->
                        <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                        <!-- Card Content wrapper to force it above absolute overlays -->
                        <div class="relative z-10 flex flex-col justify-between h-full w-full">
                            <div>
                                <div class="flex items-center justify-between mb-8">
                                    <div
                                        class="size-12 bg-primary rounded-2xl flex items-center justify-center text-navy shadow-md shadow-primary/20">
                                        <Icon icon="ph:crown-simple-fill" class="text-2xl" />
                                    </div>
                                    <span class="px-3 py-1 bg-white/10 backdrop-blur-sm text-primary text-[9px] font-black tracking-widest rounded-md capitalize">
                                        {{ $t('subscription_page.professional', 'Profesional') }}
                                    </span>
                                </div>
                                <h3 class="text-2xl font-black text-white mb-2">{{ $t('subscription_page.elite_title', 'Elite Eo') }}</h3>
                                <p class="text-slate-400 text-xs font-semibold leading-relaxed mb-6">{{ $t('subscription_page.elite_desc', 'Fitur kustom dan prioritas untuk penyelenggara turnamen profesional.') }}</p>
                                
                                <div class="mb-8">
                                    <div class="flex items-baseline gap-1">
                                        <span v-if="isUSD" class="text-lg font-bold text-white opacity-45">$</span>
                                        <span v-else class="text-lg font-bold text-white opacity-45">Rp</span>
                                        <span class="text-5xl font-black text-white tracking-tighter">{{ planPrices.elite.display.replace('Rp ', '').replace('$', '') }}</span>
                                        <span class="text-slate-400 font-bold tracking-wider text-xs">{{ planPrices.elite.period }}</span>
                                    </div>
                                </div>

                                <div class="h-px bg-white/10 mb-8"></div>
                                
                                <ul class="space-y-4 mb-10">
                                    <li v-for="feat in eoEliteFeatures" :key="feat"
                                        class="flex items-start gap-4 text-sm font-bold text-white/95">
                                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-xl shrink-0" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <button
                                @click="handleSelectPlan(4, 'Elite', isUSD ? 5 : 80000)"
                                class="w-full py-4 px-6 rounded-2xl bg-primary text-navy font-black hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg shadow-primary/10">
                                {{ $t('subscription_page.choose_plan', 'Pilih Paket') }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- ─── Simple Detailed Comparison Matrix ─── -->
                <div class="w-full pt-10">
                    <div class="text-center mb-10">
                        <h3 class="text-xs font-black text-gray-400 tracking-[0.25em] capitalize mb-3">
                            {{ $t('subscription_page.detail_comparison', 'Perbandingan Detail') }}
                        </h3>
                        <div class="h-1 w-12 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <!-- Simple Comparison Table with custom columns order (Free, Standar, Elite) -->
                    <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-6 sm:p-10 relative overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full min-w-[700px] border-collapse">
                                <thead>
                                    <tr class="border-b border-slate-200 text-xs font-black tracking-widest text-slate-400 capitalize">
                                        <th class="pb-6 text-left w-[40%]">{{ $t('subscription_page.feature_header', 'Fitur') }}</th>
                                        <th class="pb-6 text-center w-[20%]">
                                            <span class="inline-block px-3 py-1 bg-slate-100 text-navy rounded-lg">
                                                {{ $t('subscription_page.free_title', 'Free') }}
                                            </span>
                                        </th>
                                        <th class="pb-6 text-center w-[20%] text-navy">{{ $t('subscription_page.basic_title', 'Standar') }}</th>
                                        <th class="pb-6 text-center w-[20%] text-navy">{{ $t('subscription_page.elite_title', 'Elite') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-200">
                                    <tr v-for="row in eoComparisonData" :key="row.feature"
                                        class="group hover:bg-slate-50/50 transition-all duration-300">
                                        <!-- Feature Column (Simple, no icons) -->
                                        <td class="py-5 text-sm font-bold text-navy">
                                            {{ row.feature }}
                                        </td>
                                        <!-- Free Column (check icon uses emerald green instead of lime green) -->
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
                                        <!-- Standar Column -->
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
                                        <!-- Elite Column -->
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
            </div>

            <!-- FAQ Section -->
            <div class="mt-28 md:mt-40 w-full">
                <div class="text-center mb-16">
                    <h2 class="text-xs font-black text-primary tracking-[0.3em] mb-4 capitalize">{{ $t('subscription_page.faq_title', 'Faq') }}</h2>
                    <h4 class="font-black text-navy text-2xl sm:text-3xl md:text-5xl tracking-tight">
                        {{ $t('subscription_page.faq_subtitle', 'Punya Pertanyaan?') }}
                    </h4>
                </div>
                <div class="space-y-4">
                    <div v-for="(faq, index) in faqs" :key="index"
                        class="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:border-primary/40 transition-all duration-300 shadow-sm">
                        <button @click="toggleFaq(index)"
                            class="w-full px-6 sm:px-10 py-6 md:py-8 flex items-center justify-between text-left group">
                            <!-- Custom border hover transition: no lime green text color -->
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
        </main>

        <!-- ─── Modals ─── -->

        <!-- Active Plan Information Modal (Uses Built-in Dashboard AppDialog for perfect transitions) -->
        <AppDialog
            v-model:show="showActivePlanModal"
            :title="$t('subscription_page.active_modal_title', 'Paket Aktif Ditemukan')"
            :message="activePlanMessage"
            :confirm-text="$t('subscription_page.to_dashboard', 'Ke Dashboard')"
            :cancel-text="$t('subscription_page.close', 'Tutup')"
            icon="ph:info-bold"
            @confirm="router.push('/dashboard/organizer/subscription')"
        />

        <!-- Choose Payment Gateway Modal -->
        <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <div v-if="showPaymentMethodModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div @click="closeGatewayModal" class="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm"></div>
                
                <!-- Modal Card -->
                <Transition
                    enter-active-class="transition duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4"
                    appear
                >
                    <div v-if="showPaymentMethodModal" class="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 max-w-xl w-full z-10 overflow-hidden">
                        <div class="text-center mb-8">
                            <h3 class="text-xl font-black text-navy">{{ $t('subscription_page.gateway_modal_title', 'Pilih Metode Pembayaran') }}</h3>
                            <p class="text-gray-400 text-xs font-bold tracking-wider mt-1">
                                {{ $t('subscription_page.gateway_modal_desc', 'Pilih sistem pembayaran yang ingin Anda gunakan untuk memproses langganan.') }}
                            </p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <!-- 1. Tripay (Local Indonesia) -->
                            <div @click="choosePaymentGateway('bca')"
                                class="bg-white border-2 border-slate-100 hover:border-primary/50 hover:bg-primary/5 rounded-[2rem] p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between group h-56">
                                <div class="flex items-start justify-between">
                                    <div class="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-navy font-black">
                                        <Icon icon="ph:credit-card-bold" class="text-2xl" />
                                    </div>
                                    <Icon icon="ph:arrow-right-bold" class="text-slate-300 group-hover:text-navy group-hover:translate-x-1 transition-all" />
                                </div>
                                <div class="mt-6">
                                    <h4 class="font-black text-navy text-sm">{{ $t('subscription_page.tripay_name', 'Tripay (Rupiah)') }}</h4>
                                    <p class="text-gray-400 text-[10px] font-bold leading-normal mt-2 tracking-wide">
                                        {{ $t('subscription_page.tripay_desc', 'Pembayaran lokal Indonesia via Bank Transfer (BCA, Mandiri, BNI, BRI), QRIS, GoPay, OVO, DANA, dll.') }}
                                    </p>
                                </div>
                            </div>

                            <!-- 2. Paddle (Global) -->
                            <div @click="choosePaymentGateway('paddle')"
                                class="bg-white border-2 border-slate-100 hover:border-primary/50 hover:bg-primary/5 rounded-[2rem] p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between group h-56">
                                <div class="flex items-start justify-between">
                                    <div class="size-12 bg-navy rounded-2xl flex items-center justify-center text-white font-black">
                                        <Icon icon="ph:globe-hemisphere-west-bold" class="text-2xl" />
                                    </div>
                                    <Icon icon="ph:arrow-right-bold" class="text-slate-300 group-hover:text-navy group-hover:translate-x-1 transition-all" />
                                </div>
                                <div class="mt-6">
                                    <h4 class="font-black text-navy text-sm">{{ $t('subscription_page.paddle_name', 'Paddle (Global / USD)') }}</h4>
                                    <p class="text-gray-400 text-[10px] font-bold leading-normal mt-2 tracking-wide">
                                        {{ $t('subscription_page.paddle_desc', 'Pembayaran global via Credit Card, Debit Card, PayPal, Apple Pay, Google Pay, dll.') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button @click="closeGatewayModal"
                            class="w-full py-3 px-4 rounded-xl border-2 border-slate-100 hover:bg-slate-50 text-slate-500 font-bold text-xs tracking-wider transition-colors capitalize">
                            {{ $t('subscription_page.cancel', 'Batal') }}
                        </button>
                    </div>
                </Transition>
            </div>
        </Transition>
    </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuth } from '~/composables/useAuth'
import { useSubscription } from '~/composables/useSubscription'

const activeFaq = ref(0)
const toggleFaq = (index) => {
    activeFaq.value = activeFaq.value === index ? null : index
}

const { tm, t, locale } = useI18n()
const { user, organizerProfile } = useAuth()
const { subscriptionData, fetchSubscription, isSubscriptionActive } = useSubscription()
const router = useRouter()

const showActivePlanModal = ref(false)
const showPaymentMethodModal = ref(false)
const selectedPlanDetails = ref(null)

definePageMeta({
    layout: 'landing'
})

onMounted(async () => {
    if (user.value) {
        await fetchSubscription()
    }
})

const apiBaseUrl = useApiBaseUrl()

// Fetch comparison features dynamically from backend
const { data: eoComparisonDataRaw } = await useFetch(`${apiBaseUrl}/public/subscription/comparison`, {
    key: 'public-subscription-comparison',
    lazy: true,
    server: false
})

// Currency detection helper
const isUSD = computed(() => {
    if (user.value && organizerProfile.value) {
        return organizerProfile.value.country !== 'Indonesia'
    }
    return locale.value === 'en' || locale.value === 'kr'
})

const planPrices = computed(() => {
    if (isUSD.value) {
        return {
            standar: { display: '$2', raw: 2, period: t('subscription_page.month_unit', '/bln') },
            free: { display: 'Free', raw: 0, period: '' },
            elite: { display: '$5', raw: 5, period: t('subscription_page.month_unit', '/bln') }
        }
    } else {
        return {
            standar: { display: 'Rp 30.000', raw: 30000, period: t('subscription_page.month_unit', '/bln') },
            free: { display: 'Gratis', raw: 0, period: '' },
            elite: { display: 'Rp 80.000', raw: 80000, period: t('subscription_page.month_unit', '/bln') }
        }
    }
})

const hasActivePaidPlan = computed(() => {
    return isSubscriptionActive.value && subscriptionData.value?.current?.plan_id !== null
})

const activePlan = computed(() => subscriptionData.value?.current)

// Dynamically compile active plan message for AppDialog
const activePlanMessage = computed(() => {
    const name = activePlan.value?.plan_name || 'Standar'
    const status = activePlan.value?.status || 'Active'
    const date = activePlan.value?.next_billing_date || ''
    const base = t('subscription_page.active_modal_desc', 'Anda sudah memiliki paket langganan yang sedang berjalan.')
    const detail = t('subscription_page.active_modal_detail', 'Anda saat ini terdaftar dengan paket:')
    const expires = t('subscription_page.active_modal_expires', 'Masa aktif berlaku hingga:')
    return `${base} ${detail} ${name} (${status}). ${date ? `${expires} ${date}` : ''}`
})

const handleSelectPlan = async (planId, planName, planPrice) => {
    // 1. Not logged in: Redirect to register
    if (!user.value) {
        router.push(`/auth/register?redirect=${encodeURIComponent('/pricing')}`)
        return
    }

    // Ensure subscription details are fetched
    if (!subscriptionData.value) {
        await fetchSubscription()
    }

    // 2. Already logged in: check active package
    if (hasActivePaidPlan.value) {
        selectedPlanDetails.value = {
            id: planId,
            name: planName,
            price: planPrice
        }
        showActivePlanModal.value = true
        return
    }

    // 3. Free plan chosen:
    if (planId === 0) {
        router.push('/dashboard/organizer')
        return
    }

    // 4. Logged in and no active plan: Choose payment gateway
    selectedPlanDetails.value = {
        id: planId,
        name: planName,
        price: planPrice
    }
    openGatewayModal()
}

const openGatewayModal = () => {
    showPaymentMethodModal.value = true
}

const closeGatewayModal = () => {
    showPaymentMethodModal.value = false
}

const choosePaymentGateway = (gateway) => {
    if (!selectedPlanDetails.value) return
    showPaymentMethodModal.value = false
    router.push({
        path: '/dashboard/organizer/subscription/payment',
        query: {
            plan_id: selectedPlanDetails.value.id,
            plan_name: selectedPlanDetails.value.name,
            plan_price: selectedPlanDetails.value.price,
            gateway: gateway
        }
    })
}

// ─── Localized Feature lists ───
const resolveMessage = (path, rawVal) => {
    if (rawVal == null) return ''
    if (typeof rawVal === 'boolean') return rawVal
    if (typeof rawVal === 'number') return rawVal
    return t(path)
}

const eoBasicFeatures = computed(() => {
    const raw = tm('subscription_page.basic_features_list') || []
    if (!Array.isArray(raw) || raw.length === 0) {
        return [
            t('subscription_page.features.basic.participants', 'Maksimal 50 Peserta / Event'),
            t('subscription_page.features.basic.storage', 'Penyimpanan Media 1 GB'),
            t('subscription_page.features.basic.profile', 'Hingga 5 Wasit / Scorekeeper'),
            t('subscription_page.features.basic.create', 'Pembayaran Registrasi Otomatis'),
            t('subscription_page.features.basic.scoring', 'Scoring Kualifikasi & Live'),
            t('subscription_page.features.basic.cert', 'Unduh Laporan Keuangan')
        ]
    }
    return raw.map((item, idx) => resolveMessage(`subscription_page.basic_features_list.${idx}`, item))
})

const eoFreeFeatures = computed(() => {
    const raw = tm('subscription_page.free_features_list') || []
    if (!Array.isArray(raw) || raw.length === 0) {
        return [
            t('subscription_page.features.free.participants', 'Maksimal 10 Peserta / Event'),
            t('subscription_page.features.free.storage', 'Penyimpanan Media 250 MB'),
            t('subscription_page.features.free.profile', '1 Akun Wasit / Scorekeeper'),
            t('subscription_page.features.free.create', 'Buat Turnamen & Kategori'),
            t('subscription_page.features.free.scoring', 'Digital Scoring Sederhana'),
            t('subscription_page.features.free.report', 'Laporan Hasil Dasar (PDF)')
        ]
    }
    return raw.map((item, idx) => resolveMessage(`subscription_page.free_features_list.${idx}`, item))
})

const eoEliteFeatures = computed(() => {
    const raw = tm('subscription_page.elite_features_list') || []
    if (!Array.isArray(raw) || raw.length === 0) {
        return [
            t('subscription_page.features.elite.all_basic', 'Peserta Tanpa Batas / Event'),
            t('subscription_page.features.elite.unlimited', 'Penyimpanan Media 5 GB'),
            t('subscription_page.features.elite.storage', 'Wasit & Scorekeeper Tanpa Batas'),
            t('subscription_page.features.elite.analytics', 'Pembayaran Global & Paddle'),
            t('subscription_page.features.elite.support', 'Skema Eliminasi Match Finals'),
            t('subscription_page.features.elite.early_access', 'Laporan Lanjutan & Excel')
        ]
    }
    return raw.map((item, idx) => resolveMessage(`subscription_page.elite_features_list.${idx}`, item))
})

const translateValue = (val) => {
    if (typeof val === 'boolean') return val
    const keys = [
        'unlimited', 'auto_local', 'manual', 'auto_global', 'scoring_elimination',
        'scoring_basic', 'scoring_full', 'cert_basic', 'cert_custom', 'wa_system',
        'wa_custom', 'referee_5', 'referee_1', 'export_standard', 'export_basic',
        'export_elite', 'support_standard', 'support_priority', 'standard_template',
        'custom_domain', 'standard_team', 'mixed_teams', 'standard_allocation',
        'visual_drag_drop', 'yes_obs_widget', 'summary_only', 'full_graphs_xls'
    ]
    if (keys.includes(val)) {
        return t('subscription_page.' + val)
    }
    return val
}

const eoComparisonData = computed(() => {
    return (eoComparisonDataRaw.value || []).map(row => ({
        feature: t('subscription_page.comparison_features.' + row.feature_key, row.feature_name),
        free: translateValue(row.free),
        standar: translateValue(row.standar),
        elite: translateValue(row.elite)
    }))
})

const faqs = computed(() => {
    const raw = tm('subscription_page.faqs_list') || []
    if (!Array.isArray(raw) || raw.length === 0) {
        return [
            {
                question: t('subscription_page.faq.q1', 'Apakah paket bisa upgrade atau downgrade kapan saja?'),
                answer: t('subscription_page.faq.a1', 'Tentu saja! Fleksibilitas adalah kunci. Anda bisa mengubah paket kapan pun. Upgrade akan dihitung prorata dari sisa hari bulan berjalan, sedangkan downgrade akan efektif di siklus tagihan berikutnya.')
            },
            {
                question: t('subscription_page.faq.q2', 'Apa yang terjadi setelah masa uji coba selesai?'),
                answer: t('subscription_page.faq.a2', 'Data Anda tetap aman di server kami. Anda akan diminta memilih paket berbayar untuk tetap menggunakan fitur premium. Jika tidak memilih dalam 7 hari, akun akan otomatis kembali ke paket Gratis.')
            },
            {
                question: t('subscription_page.faq.q3', 'Bagaimana cara kerja skema bayar Paket EO?'),
                answer: t('subscription_page.faq.a3', 'Paket EO menggunakan sistem langganan bulanan yang flat. Tidak ada lagi biaya per atlet, sehingga Anda bisa mengelola budget turnamen dengan lebih pasti dan efisien.')
            }
        ]
    }
    return raw.map((item, idx) => ({
        question: resolveMessage(`subscription_page.faqs_list.${idx}.question`, item.question),
        answer: resolveMessage(`subscription_page.faqs_list.${idx}.answer`, item.answer)
    }))
})

useSeoMeta({
    title: () => `${t('subscription_page.title', 'Skalakan Manajemen Panahan Anda')} - Archeris.net`,
    description: () => t('subscription_page.description', 'Pilih paket berlangganan terbaik untuk penyelenggara panahan Anda.')
})
</script>

<style scoped></style>
