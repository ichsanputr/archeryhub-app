<template>
    <section class="py-24 bg-white overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16 sm:mb-24">
                <h2 class="text-navy mb-6">
                    {{ $t('home.pricing.title') }}
                </h2>
                <p class="text-navy/60 text-lg max-w-2xl mx-auto font-light">
                    {{ $t('home.pricing.description') }}
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                <!-- Pro Plan (Left Card) -->
                <div class="bg-[#F8F9FA] rounded-[40px] p-10 border border-navy/5 flex flex-col hover:border-primary/50 transition-colors group text-navy justify-between">
                    <div>
                        <div class="mb-8">
                            <span class="px-4 py-1 bg-navy/5 text-navy text-[10px] font-bold rounded-full tracking-widest uppercase">{{ $t('home.pricing.pro.name') }}</span>
                            <div class="mt-6 flex items-baseline gap-1">
                                <span class="text-lg font-bold text-navy/60">Rp</span>
                                <span class="text-4xl font-black text-navy font-display">{{ $t('home.pricing.pro.price') }}</span>
                                <span class="text-navy/40 text-sm font-semibold">{{ $t('home.pricing.pro.period') }}</span>
                            </div>
                            <p class="mt-4 text-navy/60 text-sm font-light leading-relaxed">
                                {{ $t('home.pricing.pro.desc') }}
                            </p>
                        </div>

                        <div class="space-y-4 mb-10">
                            <div v-for="feature in proFeatures" :key="feature" class="flex items-center gap-3">
                                <div class="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-none">
                                    <Icon icon="ph:check-bold" class="text-green-600 text-xs" />
                                </div>
                                <span class="text-sm text-navy/70">{{ feature }}</span>
                            </div>
                        </div>
                    </div>

                    <NuxtLink :to="localePath('/subscription')" class="w-full py-4 bg-navy text-white rounded-2xl text-center font-bold text-sm hover:bg-navy/90 transition-colors">
                        {{ $t('home.pricing.pro.cta') }}
                    </NuxtLink>
                </div>

                <!-- Basic Plan (Center Card - Highlighted & Free!) -->
                <div class="bg-navy rounded-[40px] p-10 relative overflow-hidden flex flex-col transform md:scale-105 shadow-2xl text-white justify-between">
                    <div class="absolute top-0 right-0 p-6">
                        <Icon icon="ph:star-fill" class="text-primary text-4xl opacity-20" />
                    </div>
                    
                    <div>
                        <div class="mb-8 relative z-10">
                            <span class="px-4 py-1 bg-primary text-navy text-[10px] font-bold rounded-full tracking-widest uppercase">{{ $t('home.pricing.basic.name') }}</span>
                            <div class="mt-6 flex items-baseline gap-1">
                                <span class="text-5xl font-black text-white font-display">{{ $t('home.pricing.basic.price') }}</span>
                            </div>
                            <p class="mt-4 text-white/60 text-sm font-light leading-relaxed">
                                {{ $t('home.pricing.basic.desc') }}
                            </p>
                        </div>

                        <div class="space-y-4 mb-10 relative z-10">
                            <div v-for="feature in basicFeatures" :key="feature" class="flex items-center gap-3">
                                <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-none">
                                    <Icon icon="ph:check-bold" class="text-primary text-xs" />
                                </div>
                                <span class="text-sm text-white/80">{{ feature }}</span>
                            </div>
                        </div>
                    </div>

                    <NuxtLink :to="localePath('/auth/register')" class="w-full py-4 bg-primary text-navy rounded-2xl text-center font-bold text-sm hover:scale-105 transition-transform relative z-10">
                        {{ $t('home.pricing.basic.cta') }}
                    </NuxtLink>
                </div>

                <!-- Elite/Club Plan (Right Card) -->
                <div class="bg-[#DEFEBD] rounded-[40px] p-10 border border-navy/5 flex flex-col hover:border-navy/20 transition-colors text-navy justify-between">
                    <div>
                        <div class="mb-8">
                            <span class="px-4 py-1 bg-navy/10 text-navy text-[10px] font-bold rounded-full tracking-widest uppercase">{{ $t('home.pricing.elite.name') }}</span>
                            <div class="mt-6 flex items-baseline gap-1">
                                <span class="text-lg font-bold text-navy/60">Rp</span>
                                <span class="text-4xl font-black text-navy font-display">{{ $t('home.pricing.elite.price') }}</span>
                                <span class="text-navy/40 text-sm font-semibold">{{ $t('home.pricing.elite.period') }}</span>
                            </div>
                            <p class="mt-4 text-navy/60 text-sm font-light leading-relaxed">
                                {{ $t('home.pricing.elite.desc') }}
                            </p>
                        </div>

                        <div class="space-y-4 mb-10">
                            <div v-for="feature in clubFeatures" :key="feature" class="flex items-center gap-3">
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
import { Icon } from '@iconify/vue'

const localePath = useLocalePath()

const basicFeatures = [
    'Skoring Digital (Unlimited)',
    'Logbook Latihan Dasar',
    'Akses Public Leaderboard',
    '1 Portfolio Atlet'
]

const proFeatures = [
    'Semua fitur Archer Basic',
    'Statistik Pro (Heatmap & Trends)',
    'Sertifikat Digital Otomatis',
    'Custom Portfolio URL',
    'Prioritas Registrasi Event'
]

const clubFeatures = [
    'Semua fitur Archer Pro',
    'Manajemen Database Anggota',
    'Sistem Iuran Otomatis',
    'Panel Penyelenggara Event',
    'Support 24/7 Priority'
]
</script>

<style scoped>
</style>
