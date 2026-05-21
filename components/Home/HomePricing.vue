<template>
    <section ref="sectionRef" class="py-24 bg-white overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16 sm:mb-24">
                <h2 class="text-navy mb-6 reveal-title">
                    {{ $t('home.pricing.title') }}
                </h2>
                <div class="text-navy/60 text-lg max-w-2xl mx-auto font-light reveal-desc">
                    {{ $t('home.pricing.description') }}
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
                <!-- Standard Plan (Left Card) -->
                <div class="bg-[#F8F9FA] rounded-[40px] p-10 border border-navy/5 flex flex-col hover:border-primary/50 transition-colors group text-navy justify-between">
                    <div>
                        <div class="mb-8">
                            <span class="px-4 py-1 bg-navy/5 text-navy text-[10px] font-bold rounded-full tracking-widest uppercase">
                                {{ $t('home.pricing.standard.name') }}
                            </span>
                            <div class="mt-6 flex items-baseline gap-1">
                                <span class="text-lg font-bold text-navy/60">{{ $t('home.pricing.standard.currency') }}</span>
                                <span class="text-4xl font-black text-navy font-display">{{ $t('home.pricing.standard.price') }}</span>
                                <span class="text-navy/40 text-sm font-semibold">{{ $t('home.pricing.standard.period') }}</span>
                            </div>
                            <div class="mt-4 text-navy/60 text-sm font-light leading-relaxed">
                                {{ $t('home.pricing.standard.desc') }}
                            </div>
                        </div>

                        <div class="space-y-4 mb-10">
                            <div v-for="feature in standardFeatures" :key="feature" class="flex items-center gap-3">
                                <div class="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-none">
                                    <Icon icon="ph:check-bold" class="text-green-600 text-xs" />
                                </div>
                                <span class="text-sm text-navy/70">{{ feature }}</span>
                            </div>
                        </div>
                    </div>

                    <NuxtLink :to="localePath('/subscription')" class="w-full py-4 bg-navy text-white rounded-2xl text-center font-bold text-sm hover:bg-navy/90 transition-colors">
                        {{ $t('home.pricing.standard.cta') }}
                    </NuxtLink>
                </div>

                <!-- Free Plan (Middle Card) -->
                <div class="bg-white rounded-[40px] p-10 border border-navy/5 flex flex-col hover:border-primary/30 transition-colors text-navy justify-between shadow-sm">
                    <div>
                        <div class="mb-8">
                            <span class="px-4 py-1 bg-primary/5 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase">
                                {{ $t('home.pricing.free.name') }}
                            </span>
                            <div class="mt-6 flex items-baseline gap-1">
                                <span class="text-lg font-bold text-navy/60">{{ $t('home.pricing.free.currency') }}</span>
                                <span class="text-4xl font-black text-navy font-display">{{ $t('home.pricing.free.price') }}</span>
                                <span class="text-navy/40 text-sm font-semibold">{{ $t('home.pricing.free.period') }}</span>
                            </div>
                            <div class="mt-4 text-navy/60 text-sm font-light leading-relaxed">
                                {{ $t('home.pricing.free.desc') }}
                            </div>
                        </div>

                        <div class="space-y-4 mb-10">
                            <div v-for="feature in freeFeatures" :key="feature" class="flex items-center gap-3">
                                <div class="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-none">
                                    <Icon icon="ph:check-bold" class="text-green-600 text-xs" />
                                </div>
                                <span class="text-sm text-navy/70">{{ feature }}</span>
                            </div>
                        </div>
                    </div>

                    <NuxtLink :to="localePath('/subscription')" class="w-full py-4 bg-primary text-white rounded-2xl text-center font-bold text-sm hover:opacity-95 transition-colors">
                        {{ $t('home.pricing.free.cta') }}
                    </NuxtLink>
                </div>

                <!-- Elite Plan (Right Card - Highlighted) -->
                <div class="bg-[#DEFEBD] rounded-[40px] p-10 border border-navy/5 flex flex-col hover:border-navy/20 transition-colors text-navy justify-between relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-6">
                        <Icon icon="ph:star-fill" class="text-navy text-4xl opacity-10 animate-pulse" />
                    </div>

                    <div>
                        <div class="mb-8">
                            <span class="px-4 py-1 bg-navy text-primary text-[10px] font-bold rounded-full tracking-widest uppercase">
                                {{ $t('home.pricing.elite.name') }}
                            </span>
                            <div class="mt-6 flex items-baseline gap-1">
                                <span class="text-lg font-bold text-navy/60">{{ $t('home.pricing.elite.currency') }}</span>
                                <span class="text-4xl font-black text-navy font-display">{{ $t('home.pricing.elite.price') }}</span>
                                <span class="text-navy/40 text-sm font-semibold">{{ $t('home.pricing.elite.period') }}</span>
                            </div>
                            <div class="mt-4 text-navy/60 text-sm font-light leading-relaxed">
                                {{ $t('home.pricing.elite.desc') }}
                            </div>
                        </div>

                        <div class="space-y-4 mb-10">
                            <div v-for="feature in eliteFeatures" :key="feature" class="flex items-center gap-3">
                                <div class="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center flex-none">
                                    <Icon icon="ph:check-bold" class="text-navy text-xs" />
                                </div>
                                <span class="text-sm text-navy/70">{{ feature }}</span>
                            </div>
                        </div>
                    </div>

                    <NuxtLink :to="localePath('/subscription')" class="w-full py-4 bg-navy text-white rounded-2xl text-center font-bold text-sm hover:bg-navy/90 transition-colors">
                        {{ $t('home.pricing.elite.cta') }}
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const localePath = useLocalePath()
const sectionRef = ref(null)

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = sectionRef.value
    if (!el) return

    gsap.from(el.querySelector('.reveal-title'), {
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 35,
        duration: 1.1,
        ease: 'power3.out'
    })

    gsap.from(el.querySelector('.reveal-desc'), {
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 20,
        duration: 1.1,
        delay: 0.18,
        ease: 'power3.out'
    })
})

const standardFeatures = [
    'Maksimum 50 Peserta / Event',
    'Manajemen Pendaftaran Online',
    'Sistem Digital Scoring',
    'Live Results (Public)',
    'Penyimpanan Media 1 GB'
]

const eliteFeatures = [
    'Semua fitur Standar EO',
    'Maksimum Peserta Tak Terbatas',
    'Manajemen Match Finals',
    'Integrasi Pembayaran Otomatis',
    'Analitik & Laporan Lanjutan',
    'Penyimpanan Media 5 GB'
]

const freeFeatures = [
    'Access to core features',
    'Create 1 Event with up to 50 participants',
    '1 GB Media Storage (shared)',
    'Basic Registration & Live Results',
]
</script>

<style scoped>
</style>
