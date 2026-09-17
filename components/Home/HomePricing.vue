<template>
    <section ref="sectionRef" class="relative py-24 sm:py-32 bg-white overflow-hidden">
        <!-- Background ambient glows -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
            <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-navy/5 blur-[100px] rounded-full"></div>
        </div>

        <!-- Decorative vector watermarks -->
        <div class="absolute bottom-0 right-0 w-[180px] sm:w-[280px] md:w-[350px] opacity-15 pointer-events-none transform translate-y-8 translate-x-8 z-0">
            <img src="/vector-pricing-1.png" alt="Pricing Vector Right" class="w-full h-auto object-contain select-none pointer-events-none" />
        </div>
        <div class="absolute bottom-0 left-0 w-[180px] sm:w-[280px] md:w-[350px] opacity-15 pointer-events-none transform translate-y-8 -translate-x-8 z-0">
            <img src="/vector-pricing-2.png" alt="Pricing Vector Left" class="w-full h-auto object-contain select-none pointer-events-none" />
        </div>

        <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-12 sm:mb-16">
                <span class="inline-block px-4 py-1.5 bg-primary text-navy text-xs font-bold rounded-md mb-4 reveal-badge">
                    {{ $t('home.pricing.badge', 'Pricing & Plans') }}
                </span>
                <h2 class="text-navy font-black font-display text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4 reveal-title">
                    {{ $t('home.pricing.title', 'Scale Your Archery Tournament Management') }}
                </h2>
                <p class="text-navy/60 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed reveal-desc">
                    {{ $t('home.pricing.description', 'Flexible and transparent pricing options for tournament organizers, from local clubs to national championships.') }}
                </p>
            </div>

            <!-- Pricing Cards Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch w-full">

                <!-- 1. Standard EO (Left Card) -->
                <div class="reveal-card bg-navy rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-1 group hover:shadow-2xl">
                    <!-- Glow behind card -->
                    <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
                    <!-- Dot pattern -->
                    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                    <div class="relative z-10 flex flex-col justify-between h-full w-full flex-1">
                        <div class="flex-1 flex flex-col">
                            <div class="h-12 flex items-center justify-between mb-5">
                                <div class="size-12 bg-primary/20 text-primary rounded-2xl flex items-center justify-center border border-primary/30">
                                    <Icon icon="ph:lightning-bold" class="text-2xl" />
                                </div>
                                <span class="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-bold rounded-md">
                                    {{ $t('subscription_page.standard_tag', 'Standard') }}
                                </span>
                            </div>
                            <div class="min-h-[72px] mb-5">
                                <h3 class="text-2xl font-black text-white mb-2">{{ $t('subscription_page.basic_title', 'Standard EO') }}</h3>
                                <div class="text-slate-300 text-sm font-medium leading-relaxed">{{ $t('subscription_page.basic_desc', 'Complete tournament solution for clubs and medium-scale archery events.') }}</div>
                            </div>
                            
                            <!-- Strikethrough Price + Promo Display -->
                            <div class="min-h-[110px] flex flex-col justify-end mb-6">
                                <div class="h-6 flex items-center gap-2 mb-1">
                                    <span class="text-sm font-bold text-slate-400 line-through tracking-tight opacity-75">
                                         ${{ (standardPlan.price_usd || 3.00).toFixed(2) }}
                                    </span>
                                    <span class="text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                                        50% promo
                                    </span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-lg font-bold text-primary">$</span>
                                    <span class="text-4xl sm:text-5xl font-black text-white tracking-tighter">{{ (standardPlan.promo_price_usd || 1.50).toFixed(2) }}</span>
                                    <span class="text-primary font-bold text-xs sm:text-sm">{{ $t('subscription_page.per_event', '/event') }}</span>
                                </div>
                                <div class="mt-2 mb-2">
                                    <CurrencyPreviewPopover
                                        :price-usd="standardPlan.price_usd || 3.00"
                                        :promo-price-usd="standardPlan.promo_price_usd || 1.50"
                                        :price-idr="standardPlan.price_idr || 49999"
                                        :promo-price-idr="standardPlan.promo_price_idr || 24999"
                                        :dark-theme="true"
                                    />
                                </div>
                                <div class="min-h-[28px] text-xs sm:text-sm text-amber-200/90 font-medium mt-1 leading-relaxed">
                                    {{ $t('subscription_page.promo_subtext', 'Special introductory rate for tournament organizers.') }}
                                </div>
                            </div>

                            <div class="h-px bg-white/10 mb-6"></div>
                            
                            <div class="flex-1 flex flex-col justify-start mb-8">
                                <ul class="space-y-3.5">
                                    <li v-for="feat in standardFeatures" :key="feat"
                                        class="flex items-start gap-3 text-sm sm:text-base font-semibold text-white/95">
                                        <Icon icon="ph:check-circle-fill" class="text-primary text-xl shrink-0 mt-0.5" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <NuxtLink to="/package"
                            class="w-full py-3.5 sm:py-4 bg-primary hover:bg-primary-hover text-navy rounded-xl text-center font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto min-h-[48px] shadow-md shadow-primary/20">
                            <span>{{ $t('subscription_page.choose_plan', 'Choose Plan') }}</span>
                            <Icon icon="ph:arrow-right-bold" class="text-sm" />
                        </NuxtLink>
                    </div>
                </div>

                <!-- 2. Free / Starter Plan (Middle Card) -->
                <div class="reveal-card bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 group relative overflow-hidden">
                    <!-- Starter badge -->
                    <div class="absolute top-0 right-0 bg-slate-100 text-slate-600 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold rounded-bl-2xl border-b border-l border-slate-200">
                        {{ $t('subscription_page.starter_badge', 'Starter') }}
                    </div>

                    <div class="relative z-10 flex flex-col justify-between h-full w-full flex-1">
                        <div class="flex-1 flex flex-col">
                            <div class="h-12 flex items-center justify-between mb-5">
                                <div class="size-12 bg-slate-100 rounded-2xl flex items-center justify-center text-navy font-black">
                                    <Icon icon="ph:leaf-bold" class="text-2xl text-navy" />
                                </div>
                            </div>
                            <div class="min-h-[72px] mb-5">
                                <h3 class="text-2xl font-black text-navy mb-2">{{ $t('subscription_page.free_title', 'Free EO') }}</h3>
                                <div class="text-slate-600 text-sm font-medium leading-relaxed">{{ $t('subscription_page.free_desc', 'Try and run your first archery tournament instantly at zero cost.') }}</div>
                            </div>
                            
                            <div class="min-h-[110px] flex flex-col justify-end mb-6">
                                <div class="h-6 flex items-center gap-2 mb-1">
                                    <span class="text-sm font-bold text-slate-400">
                                        {{ $t('subscription_page.free_plan_tag', 'Starter Tier') }}
                                    </span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-4xl sm:text-5xl font-black text-navy tracking-tighter">$0</span>
                                    <span class="text-slate-500 font-bold text-xs sm:text-sm ml-1">{{ freePlan.period }}</span>
                                </div>
                                <div class="mt-2 mb-2">
                                    <CurrencyPreviewPopover
                                        :price-usd="0"
                                        :promo-price-usd="0"
                                        :price-idr="0"
                                        :promo-price-idr="0"
                                        :dark-theme="false"
                                    />
                                </div>
                                <div class="min-h-[28px] text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                                    {{ $t('subscription_page.free_subtext', '1 free event quota to try out our tournament scoring system.') }}
                                </div>
                            </div>

                            <div class="h-px bg-slate-200 mb-6"></div>
                            
                            <div class="flex-1 flex flex-col justify-start mb-8">
                                <ul class="space-y-3.5">
                                    <li v-for="feat in freeFeatures" :key="feat"
                                        class="flex items-start gap-3 text-sm sm:text-base font-semibold text-navy/90">
                                        <Icon icon="ph:check-circle-fill" class="mt-0.5 text-xl shrink-0 text-emerald-500" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <NuxtLink to="/auth/register"
                            class="w-full py-3.5 sm:py-4 bg-navy hover:bg-navy/90 text-white rounded-xl text-center font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto min-h-[48px] shadow-md">
                            <span>{{ $t('subscription_page.try_now', 'Try Now') }}</span>
                            <Icon icon="ph:arrow-right-bold" class="text-sm" />
                        </NuxtLink>
                    </div>
                </div>

                <!-- 3. Elite EO (Right Card) -->
                <div class="reveal-card bg-navy rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden transition-all duration-500 hover:-translate-y-1 group hover:shadow-2xl">
                    <!-- Glow behind card -->
                    <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none"></div>
                    <!-- Dot pattern -->
                    <div class="absolute inset-0 opacity-[0.03] pointer-events-none" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                    <div class="relative z-10 flex flex-col justify-between h-full w-full flex-1">
                        <div class="flex-1 flex flex-col">
                            <div class="h-12 flex items-center justify-between mb-5">
                                <div class="size-12 bg-primary rounded-2xl flex items-center justify-center text-navy shadow-md shadow-primary/20">
                                    <Icon icon="ph:crown-simple-fill" class="text-2xl" />
                                </div>
                                <span class="px-3 py-1 bg-white/10 backdrop-blur-sm text-primary text-xs font-bold rounded-md">
                                    {{ $t('subscription_page.professional', 'Professional') }}
                                </span>
                            </div>
                            <div class="min-h-[72px] mb-5">
                                <h3 class="text-2xl font-black text-white mb-2">{{ $t('subscription_page.elite_title', 'Elite EO') }}</h3>
                                <div class="text-slate-400 text-sm font-medium leading-relaxed">{{ $t('subscription_page.elite_desc', 'Unlimited features for professional and large-scale championship organizers.') }}</div>
                            </div>
                            
                            <div class="min-h-[110px] flex flex-col justify-end mb-6">
                                <div class="h-6 flex items-center gap-2 mb-1">
                                    <span class="text-sm font-bold text-slate-400 line-through tracking-tight opacity-75">
                                         ${{ (elitePlan.price_usd || 7.00).toFixed(2) }}
                                    </span>
                                    <span class="text-xs font-bold text-primary bg-primary/20 px-2 py-0.5 rounded border border-primary/30">
                                        50% promo
                                    </span>
                                </div>
                                <div class="flex items-baseline gap-1">
                                    <span class="text-lg font-bold text-white opacity-45">$</span>
                                    <span class="text-4xl sm:text-5xl font-black text-white tracking-tighter">{{ (elitePlan.promo_price_usd || 3.50).toFixed(2) }}</span>
                                    <span class="text-slate-400 font-bold text-xs sm:text-sm">{{ $t('subscription_page.per_event', '/event') }}</span>
                                </div>
                                <div class="mt-2 mb-2">
                                    <CurrencyPreviewPopover
                                        :price-usd="elitePlan.price_usd || 7.00"
                                        :promo-price-usd="elitePlan.promo_price_usd || 3.50"
                                        :price-idr="elitePlan.price_idr || 79999"
                                        :promo-price-idr="elitePlan.promo_price_idr || 39999"
                                        :dark-theme="true"
                                    />
                                </div>
                                <div class="min-h-[28px] text-xs sm:text-sm text-slate-400 font-medium mt-1 leading-relaxed">
                                    {{ $t('subscription_page.elite_subtext', 'Full access to all professional features for official tournaments.') }}
                                </div>
                            </div>

                            <div class="h-px bg-white/10 mb-6"></div>
                            
                            <div class="flex-1 flex flex-col justify-start mb-8">
                                <ul class="space-y-3.5">
                                    <li v-for="feat in eliteFeatures" :key="feat"
                                        class="flex items-start gap-3 text-sm sm:text-base font-semibold text-white/95">
                                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-xl shrink-0 mt-0.5" />
                                        <span>{{ feat }}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        <NuxtLink to="/package"
                            class="w-full py-3.5 sm:py-4 bg-primary hover:bg-primary-hover text-navy rounded-xl text-center font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 mt-auto min-h-[48px] shadow-md shadow-primary/20">
                            <span>{{ $t('subscription_page.choose_plan', 'Choose Plan') }}</span>
                            <Icon icon="ph:crown-simple-bold" class="text-sm" />
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- Bottom trust note -->
            <div class="mt-12 text-center reveal-note">
                <p class="text-navy/35 text-sm flex items-center justify-center gap-2">
                    <Icon icon="ph:shield-check-bold" class="text-base text-primary/60" />
                    {{ $t('home.pricing.trust_note', 'No hidden fees. Cancel anytime.') }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from 'vue-i18n'
import { usePricingPlans } from '~/composables/usePricingPlans'
import CurrencyPreviewPopover from '~/components/Common/CurrencyPreviewPopover.vue'

const { locale } = useI18n()
const { fetchPlans, freePlan, standardPlan, elitePlan } = usePricingPlans()
const sectionRef = ref(null)

const isUSD = computed(() => true)

const freeFeatures = computed(() => {
    if (locale.value === 'id') {
        return [
            'Maksimal 50 Peserta per Turnamen',
            '200 MB Media Storage',
            'Akses Semua Fitur'
        ]
    }
    return [
        'Up to 50 Participants / Tournament',
        '200 MB Media Storage',
        'Access All Features'
    ]
})

const standardFeatures = computed(() => {
    if (locale.value === 'id') {
        return [
            'Hingga 200 Peserta per Turnamen',
            '3 GB Media Storage',
            'Akses Semua Fitur'
        ]
    }
    return [
        'Up to 200 Participants / Tournament',
        '3 GB Media Storage',
        'Access All Features'
    ]
})

const eliteFeatures = computed(() => {
    if (locale.value === 'id') {
        return [
            'Peserta Tanpa Batas',
            '10 GB Media Storage',
            'Akses Semua Fitur'
        ]
    }
    return [
        'Unlimited Participants',
        '10 GB Media Storage',
        'Access All Features'
    ]
})

onMounted(async () => {
    fetchPlans()
    gsap.registerPlugin(ScrollTrigger)
    const el = sectionRef.value
    if (!el) return

    // Safety: ensure cards are visible even if animation doesn't trigger
    const cards = el.querySelectorAll('.reveal-card')
    cards.forEach(c => { c.style.opacity = '1' })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
        }
    })

    tl.from(el.querySelector('.reveal-badge'), {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out'
    })
    .from(el.querySelector('.reveal-title'), {
        opacity: 0, y: 30, duration: 0.9, ease: 'power3.out'
    }, '-=0.3')
    .from(el.querySelector('.reveal-desc'), {
        opacity: 0, y: 20, duration: 0.8, ease: 'power3.out'
    }, '-=0.5')
    .from(cards, {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.12, ease: 'power3.out'
    }, '-=0.4')
    .from(el.querySelector('.reveal-note'), {
        opacity: 0, y: 10, duration: 0.6, ease: 'power2.out'
    }, '-=0.3')
})
</script>

<style scoped>
/* Cards are always visible — GSAP animates from opacity:0 but we reset inline
   so if ScrollTrigger never fires the cards still show */
.reveal-card {
    opacity: 1;
}
</style>
