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
                    <div class="flex items-center gap-2 text-primary text-[10px] sm:text-sm font-bold tracking-wider mb-3">
                        <Icon icon="ph:scales" class="text-base sm:text-lg" />
                        Comparison
                    </div>
                    <h1 class="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-4">
                        {{ $t('home.comparison_page.hero_title') }}
                    </h1>
                    <p class="text-slate-300 text-sm md:text-lg leading-relaxed">
                        {{ $t('home.comparison_page.hero_subtitle') }}
                    </p>
                    <p class="text-slate-400 text-sm mt-6">
                        {{ $t('home.comparison_page.hero_desc') }}
                    </p>
                </div>
            </div>
        </div>

        <!-- ── MAIN CONTENT (GRID COMPARISON) ── -->
        <main class="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 mb-20 relative z-20">
            <div class="text-center mb-10">
                <span class="text-xs font-black tracking-widest text-primary bg-navy px-3 py-1 rounded-full uppercase">
                    {{ $t('home.comparison_page.section_features_title') }}
                </span>
                <p class="text-slate-500 text-sm font-medium mt-4">
                    {{ $t('home.comparison_page.section_features_desc') }}
                </p>
            </div>

            <!-- Features Cards List -->
            <div class="space-y-6">
                <div v-for="i in 6" :key="i"
                    class="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 hover:shadow-sm transition-all duration-300">
                    
                    <!-- Feature Title -->
                    <h3 class="text-lg md:text-xl font-black text-navy mb-6 flex items-center gap-2">
                        <span class="w-1 h-5 bg-navy rounded-full"></span>
                        {{ $t(`home.comparison.f${i}_name`) }}
                    </h3>

                    <!-- Comparison Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                        <!-- Archeris.net Column -->
                        <div class="bg-[#E2F9C2]/15 rounded-2xl p-5 border border-primary/20 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center gap-2 mb-3">
                                    <img src="/logo.png" class="h-6 w-auto object-contain" alt="Archeris Logo" />
                                    <span class="text-sm font-black text-navy">{{ $t('home.comparison.col_archeris') }}</span>
                                </div>
                                <p class="text-sm text-slate-600 leading-relaxed font-medium">
                                    {{ $t(`home.comparison.f${i}_archeris`) }}
                                </p>
                            </div>
                            <div class="flex items-center gap-1.5 text-primary text-xs font-bold mt-4">
                                <Icon icon="ph:check-circle-fill" class="text-base" />
                                <span>Modern Solution</span>
                            </div>
                        </div>

                        <!-- Ianseo.net Column -->
                        <div class="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center gap-2 mb-3">
                                    <img src="/ianseo-logo.png" class="h-6 w-auto object-contain" alt="Ianseo Logo" />
                                    <span class="text-sm font-bold text-gray-500">{{ $t('home.comparison.col_ianseo') }}</span>
                                </div>
                                <p class="text-sm text-gray-500 leading-relaxed font-light">
                                    {{ $t(`home.comparison.f${i}_ianseo`) }}
                                </p>
                            </div>
                            <div class="flex items-center gap-1.5 text-gray-400 text-xs font-medium mt-4">
                                <Icon icon="ph:minus-circle" class="text-base" />
                                <span>Legacy Standard</span>
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
        { name: 'description', content: 'detailed comparison between archeris.net and ianseo.net tournament management platforms.' }
    ]
})
</script>

<style scoped>
</style>
