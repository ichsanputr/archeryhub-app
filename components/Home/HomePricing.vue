<template>
    <section class="py-24 bg-white overflow-hidden">
        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16 sm:mb-24">
                <h2 class="text-4xl sm:text-7xl font-black text-navy leading-tight font-display tracking-tighter mb-6">
                    Choose your level.
                </h2>
                <p class="text-navy/60 text-lg max-w-2xl mx-auto font-light">
                    Mulai dari individu hingga klub besar, kami memiliki paket yang tepat untuk mendukung prestasi panahan Anda.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Basic Plan -->
                <div class="bg-[#F8F9FA] rounded-[40px] p-10 border border-navy/5 flex flex-col hover:border-primary/50 transition-colors group">
                    <div class="mb-8">
                        <span class="px-4 py-1 bg-navy/5 text-navy text-[10px] font-bold rounded-full tracking-widest">Archer Basic</span>
                        <div class="mt-6 flex items-baseline gap-1">
                            <span class="text-4xl font-black text-navy font-display">Free</span>
                        </div>
                        <p class="mt-4 text-navy/40 text-sm font-light leading-relaxed">
                            Sempurna untuk atlet pemula yang ingin mulai mencatat skor digital.
                        </p>
                    </div>

                    <div class="space-y-4 mb-10 flex-1">
                        <div v-for="feature in basicFeatures" :key="feature" class="flex items-center gap-3">
                            <div class="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center">
                                <Icon icon="ph:check-bold" class="text-green-600 text-xs" />
                            </div>
                            <span class="text-sm text-navy/70">{{ feature }}</span>
                        </div>
                    </div>

                    <NuxtLink to="/auth/register" class="w-full py-4 bg-navy text-white rounded-2xl text-center font-bold text-sm hover:bg-navy/90 transition-colors">
                        Mulai Gratis
                    </NuxtLink>
                </div>

                <!-- Pro Plan -->
                <div class="bg-navy rounded-[40px] p-10 relative overflow-hidden flex flex-col transform md:scale-105 shadow-2xl">
                    <div class="absolute top-0 right-0 p-6">
                        <Icon icon="ph:crown-fill" class="text-primary text-4xl opacity-20" />
                    </div>
                    <div class="mb-8 relative z-10">
                        <span class="px-4 py-1 bg-primary text-navy text-[10px] font-bold rounded-full tracking-widest">Archer Pro</span>
                        <div class="mt-6 flex items-baseline gap-1">
                            <span class="text-lg font-bold text-white/60">Rp</span>
                            <span class="text-5xl font-black text-white font-display">29K</span>
                            <span class="text-white/40 text-sm">/bulan</span>
                        </div>
                        <p class="mt-4 text-white/60 text-sm font-light leading-relaxed">
                            Maksimalkan potensi Anda dengan statistik mendalam dan portfolio pro.
                        </p>
                    </div>

                    <div class="space-y-4 mb-10 flex-1 relative z-10">
                        <div v-for="feature in proFeatures" :key="feature" class="flex items-center gap-3">
                            <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                                <Icon icon="ph:check-bold" class="text-primary text-xs" />
                            </div>
                            <span class="text-sm text-white/80">{{ feature }}</span>
                        </div>
                    </div>

                    <NuxtLink to="/subscription" class="w-full py-4 bg-primary text-navy rounded-2xl text-center font-bold text-sm hover:scale-105 transition-transform relative z-10">
                        Upgrade ke Pro
                    </NuxtLink>
                </div>

                <!-- Elite/Club Plan -->
                <div class="bg-[#DEFEBD] rounded-[40px] p-10 border border-navy/5 flex flex-col hover:border-navy/20 transition-colors">
                    <div class="mb-8">
                        <span class="px-4 py-1 bg-navy/10 text-navy text-[10px] font-bold rounded-full tracking-widest">Club Elite</span>
                        <div class="mt-6 flex items-baseline gap-1">
                            <span class="text-lg font-bold text-navy/60">Rp</span>
                            <span class="text-4xl font-black text-navy font-display">149K</span>
                            <span class="text-navy/40 text-sm">/bulan</span>
                        </div>
                        <p class="mt-4 text-navy/40 text-sm font-light leading-relaxed">
                            Solusi lengkap untuk manajemen klub dan penyelenggaraan event profesional.
                        </p>
                    </div>

                    <div class="space-y-4 mb-10 flex-1">
                        <div v-for="feature in clubFeatures" :key="feature" class="flex items-center gap-3">
                            <div class="w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center">
                                <Icon icon="ph:check-bold" class="text-navy text-xs" />
                            </div>
                            <span class="text-sm text-navy/70">{{ feature }}</span>
                        </div>
                    </div>

                    <NuxtLink to="/subscription" class="w-full py-4 bg-navy text-white rounded-2xl text-center font-bold text-sm hover:bg-navy/90 transition-colors">
                        Hubungi Kami
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'

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
