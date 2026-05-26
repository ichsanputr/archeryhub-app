<template>
    <div class="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
        <!-- Blueprint Grid Background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.02]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 30px 30px;">
        </div>

        <!-- Decorative Border Features on Left & Right Sides -->
        <div class="absolute top-0 bottom-0 left-0 w-[40px] sm:w-[100px] opacity-[0.2] sm:opacity-[0.15] pointer-events-none z-0 mix-blend-multiply"
            style="
                background-image: url('/ok1-removebg-preview.png');
                background-repeat: repeat-y;
                background-size: 100% auto;
                transform-origin: center;
            ">
        </div>

        <div class="absolute top-0 bottom-0 right-0 w-[40px] sm:w-[100px] opacity-[0.2] sm:opacity-[0.15] pointer-events-none z-0 mix-blend-multiply"
            style="
                background-image: url('/ok1-removebg-preview.png');
                background-repeat: repeat-y;
                background-size: 100% auto;
                transform: scaleX(-1);
            ">
        </div>

        <!-- ── HERO SECTION ── -->
        <div class="bg-navy pt-32 pb-20 relative overflow-hidden">
            <div class="absolute inset-0 z-0">
                <img src="/hero-homepage.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div>
                    <div class="flex items-center gap-2 text-primary text-xs sm:text-sm font-bold tracking-wider mb-3">
                        <Icon icon="ph:scales" class="text-base sm:text-lg" />
                        Comparison
                    </div>
                    <h1 class="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        {{ $t('home.comparison_page.hero_title') }}
                    </h1>
                    <p class="text-slate-300 text-sm md:text-base leading-relaxed">
                        {{ $t('home.comparison_page.hero_subtitle') }} {{ $t('home.comparison_page.hero_desc') }}
                    </p>
                </div>
            </div>
        </div>

        <!-- ── MAIN CONTENT (GRID COMPARISON) ── -->
        <main class="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mb-20 relative z-20">
            <!-- Summary Header Card using Logos -->
            <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm mb-12">
                <div class="flex flex-col sm:flex-row items-center justify-between gap-8">
                    <!-- Archeris Side -->
                    <div class="flex-1 flex flex-col items-center text-center">
                        <div class="w-20 h-20 flex items-center justify-center p-3 bg-navy rounded-2xl mb-4">
                            <img src="/logo.png" class="h-10 w-auto object-contain" alt="Archeris Logo" />
                        </div>
                        <h4 class="text-lg font-black text-navy">{{ $t('home.comparison.col_archeris') }}</h4>
                        <span class="text-xs text-navy font-black tracking-widest bg-navy/10 px-2.5 py-0.5 rounded-full mt-2">Modern & Cloud-Native</span>
                    </div>

                    <!-- VS Divider -->
                    <div class="flex flex-col items-center">
                        <div class="size-12 rounded-full bg-navy flex items-center justify-center border-2 border-primary/20 shadow-md">
                            <span class="text-xs font-black text-primary tracking-widest">VS</span>
                        </div>
                    </div>

                    <!-- Ianseo Side -->
                    <div class="flex-1 flex flex-col items-center text-center">
                        <div class="w-20 h-20 flex items-center justify-center p-3 bg-gray-50 rounded-2xl border border-gray-100 mb-4">
                            <img src="/ianseo-logo.png" class="h-10 w-auto object-contain" alt="Ianseo Logo" />
                        </div>
                        <h4 class="text-lg font-black text-slate-500">{{ $t('home.comparison.col_ianseo') }}</h4>
                        <span class="text-xs text-gray-400 font-bold tracking-widest bg-gray-100 px-2.5 py-0.5 rounded-full mt-2">Legacy Desktop</span>
                    </div>
                </div>
            </div>

            <!-- Detailed Table Comparison -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-12">
                <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
                    <h3 class="text-lg font-black text-navy flex items-center gap-2">
                        <Icon icon="ph:list-checks-bold" class="text-primary text-xl" />
                        {{ $t('home.comparison_page.section_features_title') }}
                    </h3>
                    <p class="text-slate-500 text-xs mt-1">{{ $t('home.comparison_page.section_features_desc') }}</p>
                </div>

                <div class="divide-y divide-gray-100">
                    <!-- Table Rows -->
                    <div v-for="i in 6" :key="i" class="p-6 md:p-8 hover:bg-gray-50/30 transition-colors">
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                            <!-- Feature Name -->
                            <div class="md:col-span-3">
                                <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-2xl">
                                    <Icon icon="ph:star-four-bold" class="text-primary text-xs shrink-0" />
                                    <h4 class="font-black text-navy text-xs sm:text-sm">
                                        {{ $t(`home.comparison.f${i}_name`) }}
                                    </h4>
                                </div>
                            </div>

                            <!-- Archeris.net Info -->
                            <div class="md:col-span-5 bg-[#E2F9C2]/10 rounded-xl p-4 border border-primary/10 h-full flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center gap-1.5 text-navy font-bold text-xs mb-1.5">
                                        <Icon icon="ph:check-circle-fill" class="text-primary text-sm" />
                                        <span>Archeris.net</span>
                                    </div>
                                    <p class="text-xs text-slate-600 leading-relaxed font-medium">
                                        {{ $t(`home.comparison.f${i}_archeris`) }}
                                    </p>
                                </div>
                            </div>

                            <!-- Ianseo.net Info -->
                            <div class="md:col-span-4 bg-gray-50 rounded-xl p-4 border border-gray-100 h-full flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center gap-1.5 text-gray-400 font-bold text-xs mb-1.5">
                                        <Icon icon="ph:minus-circle" class="text-sm" />
                                        <span>Ianseo.net</span>
                                    </div>
                                    <p class="text-xs text-gray-500 leading-relaxed font-light">
                                        {{ $t(`home.comparison.f${i}_ianseo`) }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CTA Banner -->
            <section class="mt-16">
                <div class="bg-navy text-white rounded-[32px] p-8 md:p-12 text-center relative overflow-hidden border border-white/5 shadow-xl">
                    <h2 class="text-white text-2xl md:text-4xl font-black tracking-tight mb-4 relative z-10">
                        {{ $t('home.comparison_page.cta_title') }}
                    </h2>
                    <p class="text-slate-400 text-sm font-medium mb-8 relative z-10 max-w-xl mx-auto">
                        {{ $t('home.comparison_page.cta_desc') }}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <NuxtLink :to="localePath('/auth/login')"
                            class="px-8 py-3 bg-primary text-navy rounded-xl font-black tracking-wider text-xs hover:bg-primary-hover hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg shadow-primary/10">
                            {{ $t('home.comparison_page.cta_btn') }}
                        </NuxtLink>
                        <NuxtLink :to="localePath('/')"
                            class="px-8 py-3 bg-white/5 text-white rounded-xl font-bold tracking-wider text-xs border border-white/10 hover:bg-white/10 transition-all">
                            {{ $t('home.comparison_page.back_home') }}
                        </NuxtLink>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

definePageMeta({
    layout: 'landing'
})

const localePath = useLocalePath()

useHead({
    title: 'Archeris vs Ianseo - Archeris',
    meta: [
        { name: 'description', content: 'Detailed comparison between Archeris.net and Ianseo.net tournament management platforms.' }
    ]
})
</script>

<style scoped>
</style>
