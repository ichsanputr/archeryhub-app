<template>
    <div class="min-h-screen bg-[#F8FAFC] relative overflow-hidden pb-24">
        <!-- Blueprint Grid Background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.02]"
            style="background-image: radial-gradient(circle, #0f172a 1px, transparent 1px); background-size: 30px 30px;">
        </div>

        <!-- ── HERO SECTION ── -->
        <section class="relative pt-36 pb-16 md:pt-48 md:pb-24">
            <div class="container mx-auto px-4 max-w-6xl text-center">
                <span class="text-xs font-black tracking-widest text-navy/40 uppercase block mb-4">comparison</span>
                <h1 class="text-navy text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8">
                    {{ $t('home.comparison_page.hero_title') }}
                </h1>
                <p class="text-slate-600 text-lg md:text-xl font-bold max-w-3xl mx-auto leading-relaxed mt-6">
                    {{ $t('home.comparison_page.hero_subtitle') }}
                </p>
                <p class="text-slate-500 text-sm md:text-base font-light max-w-2xl mx-auto mt-4">
                    {{ $t('home.comparison_page.hero_desc') }}
                </p>
            </div>
        </section>

        <!-- ── COMPARISON TABLE SECTION ── -->
        <section class="py-12 relative">
            <div class="container mx-auto px-4 max-w-6xl">
                <div class="border-t border-gray-100 pt-16">
                    <div class="text-center mb-12">
                        <span class="text-xs font-black tracking-widest text-primary bg-navy px-3 py-1 rounded-full uppercase">
                            {{ $t('home.comparison_page.section_features_title') }}
                        </span>
                        <p class="text-slate-500 text-sm font-medium mt-4">
                            {{ $t('home.comparison_page.section_features_desc') }}
                        </p>
                    </div>

                    <div class="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm bg-white">
                        <table class="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr class="bg-navy text-white text-xs font-black tracking-wider uppercase border-b border-navy">
                                    <th class="py-5 px-6">{{ $t('home.comparison.col_feature') }}</th>
                                    <th class="py-5 px-6 bg-navy/95 border-x border-white/10 text-primary">{{ $t('home.comparison.col_archeris') }}</th>
                                    <th class="py-5 px-6 text-white/70">{{ $t('home.comparison.col_ianseo') }}</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-100 text-sm">
                                <tr v-for="i in 6" :key="i" class="hover:bg-gray-50/50 transition-colors">
                                    <td class="py-6 px-6 font-bold text-navy">
                                        {{ $t(`home.comparison.f${i}_name`) }}
                                    </td>
                                    <td class="py-6 px-6 bg-[#E2F9C2]/10 border-x border-gray-100 font-medium text-navy">
                                        <div class="flex items-start gap-2.5">
                                            <Icon icon="ph:check-circle-fill" class="text-primary text-lg shrink-0 mt-0.5" />
                                            <span>{{ $t(`home.comparison.f${i}_archeris`) }}</span>
                                        </div>
                                    </td>
                                    <td class="py-6 px-6 text-gray-500 font-light">
                                        <div class="flex items-start gap-2.5">
                                            <Icon icon="ph:minus-circle" class="text-gray-400 text-lg shrink-0 mt-0.5" />
                                            <span>{{ $t(`home.comparison.f${i}_ianseo`) }}</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>

        <!-- ── CTA SECTION ── -->
        <section class="pt-16 px-4">
            <div class="max-w-6xl mx-auto bg-navy text-white rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden shadow-xl border border-white/5">
                <div class="absolute inset-0 opacity-[0.02]" style="background-image: var(--motif-pattern);"></div>
                <h2 class="text-white text-3xl md:text-5xl font-black tracking-tight mb-4 relative z-10">
                    {{ $t('home.comparison_page.cta_title') }}
                </h2>
                <p class="text-slate-400 text-sm md:text-base font-medium mb-8 relative z-10 max-w-xl mx-auto">
                    {{ $t('home.comparison_page.cta_desc') }}
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                    <NuxtLink :to="localePath('/auth/login')"
                        class="px-8 py-3.5 bg-primary text-navy rounded-xl font-black tracking-wider text-xs hover:bg-primary-hover hover:scale-[1.02] transition-all active:scale-[0.98] shadow-lg shadow-primary/10">
                        {{ $t('home.comparison_page.cta_btn') }}
                    </NuxtLink>
                    <NuxtLink :to="localePath('/')"
                        class="px-8 py-3.5 bg-white/5 text-white rounded-xl font-bold tracking-wider text-xs border border-white/10 hover:bg-white/10 transition-all">
                        {{ $t('home.comparison_page.back_home') }}
                    </NuxtLink>
                </div>
            </div>
        </section>
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
