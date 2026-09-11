<template>
    <div class="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-body text-navy">
        <!-- Blueprint Grid Background -->
        <div class="fixed inset-0 -z-10 pointer-events-none opacity-[0.025]"
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
        <div class="bg-navy pt-36 pb-16 md:pt-48 md:pb-24 relative overflow-hidden text-white">
            <div class="absolute inset-0 z-0">
                <img src="/hero-homepage.jpeg" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div>
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-primary/20 text-primary text-xs font-bold tracking-widest mb-6 shadow-sm">
                        <Icon icon="ph:scales-bold" class="text-base" />
                        <span>{{ $t('home.comparison_page.hero_badge') }}</span>
                    </div>
                    <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                        {{ $t('home.comparison_page.hero_title') }}
                    </h1>
                    <p class="text-slate-200 text-sm md:text-lg leading-relaxed max-w-3xl">
                        {{ $t('home.comparison_page.hero_subtitle') }} {{ $t('home.comparison_page.hero_desc') }}
                    </p>
                </div>
            </div>
        </div>

        <!-- ── MAIN CONTENT ── -->
        <main class="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 mb-20 relative z-20 space-y-10">
            
            <!-- Summary Versus Header Card -->
            <div class="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
                    
                    <!-- Archeris Side (Highlight) -->
                    <div class="md:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl bg-navy text-white border border-primary/30 shadow-md relative overflow-hidden">
                        <div class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Icon icon="ph:lightning-bold" class="text-7xl text-primary" />
                        </div>
                        <div class="flex items-center gap-3 mb-3 relative z-10">
                            <div class="w-14 h-14 flex items-center justify-center p-2.5 bg-white/10 rounded-xl border border-white/20 shrink-0 shadow-sm">
                                <img src="/logo.png" class="h-8 w-auto object-contain" alt="Archeris Logo" />
                            </div>
                            <div>
                                <h3 class="text-xl font-black tracking-tight text-white">Archeris.net</h3>
                                <span class="inline-flex px-2.5 py-0.5 rounded-md bg-primary text-navy font-black text-[10px] tracking-wider mt-0.5">
                                    Modern & Cloud-Native
                                </span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed font-medium relative z-10">
                            Platform manajemen turnamen panahan terintegrasi: pendaftaran online, auto-payment QRIS/VA, dan real-time live scoring berbasis web.
                        </p>
                    </div>

                    <!-- VS Divider -->
                    <div class="md:col-span-1 flex justify-center">
                        <div class="size-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-xs">
                            <span class="text-xs font-black text-slate-400 tracking-wider">VS</span>
                        </div>
                    </div>

                    <!-- Ianseo Side -->
                    <div class="md:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left p-6 rounded-2xl bg-slate-50 border border-slate-100 text-slate-700">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-14 h-14 flex items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200 shrink-0 shadow-xs">
                                <img src="/ianseo-logo.png" class="h-8 w-auto object-contain" alt="Ianseo Logo" />
                            </div>
                            <div>
                                <h3 class="text-xl font-black tracking-tight text-slate-700">Ianseo.net</h3>
                                <span class="inline-flex px-2.5 py-0.5 rounded-md bg-slate-200 text-slate-600 font-bold text-[10px] tracking-wider mt-0.5">
                                    Legacy Desktop / MySQL
                                </span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-500 leading-relaxed">
                            Aplikasi desktop konvensional untuk format World Archery dengan setup database lokal, jaringan kabel, dan penanganan printout manual.
                        </p>
                    </div>
                </div>
            </div>

            <!-- ── 1. EXECUTIVE SUMMARY (ABOVE FEATURE COMPARISON) ── -->
            <div class="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
                <div class="border-b border-slate-100 pb-4">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/20 text-navy font-black text-xs border border-primary/30">
                        <Icon icon="ph:article-bold" />
                        {{ $t('home.comparison_page.blog_badge') }}
                    </span>
                    <h2 class="text-xl md:text-2xl font-black text-navy mt-3">
                        {{ $t('home.comparison_page.blog_title') }}
                    </h2>
                </div>
                <div class="prose prose-slate max-w-none text-xs sm:text-sm text-slate-600 leading-relaxed space-y-4 font-medium">
                    <p>
                        {{ $t('home.comparison_page.blog_p1') }}
                    </p>
                    <p>
                        {{ $t('home.comparison_page.blog_p2') }}
                    </p>
                </div>
            </div>

            <!-- ── 2. REDESIGNED FEATURE COMPARISON CARD & TABLE ── -->
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                
                <!-- Card Header -->
                <div class="p-6 md:p-8 border-b border-slate-100 bg-white">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div class="flex items-start gap-4">
                            <div class="size-12 rounded-2xl bg-slate-100 text-navy flex items-center justify-center shrink-0 border border-slate-200/60 shadow-xs">
                                <Icon icon="ph:list-checks-bold" class="text-2xl text-navy" />
                            </div>
                            <div>
                                <h3 class="text-navy font-black text-lg md:text-xl">
                                    {{ $t('home.comparison_page.section_features_title') }}
                                </h3>
                                <p class="text-slate-500 text-xs md:text-sm mt-1">
                                    {{ $t('home.comparison_page.section_features_desc') }}
                                </p>
                            </div>
                        </div>

                        <!-- Category Filter Pills -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <button v-for="cat in featureCategories" :key="cat.id"
                                type="button"
                                @click="activeCategory = cat.id"
                                :class="activeCategory === cat.id ? 'bg-navy text-white border-navy shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:text-navy'"
                                class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all border">
                                <Icon :icon="cat.icon" class="text-sm" />
                                <span>{{ cat.label }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Sticky Header for Columns (Desktop) -->
                <div class="hidden md:grid md:grid-cols-12 gap-4 px-8 py-3.5 bg-slate-50 border-b border-slate-100 text-xs font-black tracking-wider text-slate-500">
                    <div class="md:col-span-4 flex items-center gap-2">
                        <span>{{ $t('home.comparison.col_feature') }}</span>
                    </div>
                    <div class="md:col-span-4 flex items-center gap-2 text-navy">
                        <span class="size-2 rounded-full bg-primary"></span>
                        <span>Archeris.net (Cloud)</span>
                    </div>
                    <div class="md:col-span-4 flex items-center gap-2 text-slate-500">
                        <span class="size-2 rounded-full bg-slate-300"></span>
                        <span>Ianseo.net (Desktop)</span>
                    </div>
                </div>

                <!-- Comparison Rows -->
                <div class="divide-y divide-slate-100">
                    <div v-for="item in filteredFeatures" :key="item.id"
                        class="p-5 md:p-6 hover:bg-slate-50/40 transition-colors">
                        <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                            
                            <!-- Feature Name & Tag (4 cols) -->
                            <div class="md:col-span-4 flex flex-col justify-center gap-1.5">
                                <div class="flex items-center gap-3">
                                    <div class="size-10 rounded-xl bg-slate-100 text-navy flex items-center justify-center shrink-0 border border-slate-200/60 shadow-xs">
                                        <Icon :icon="item.icon" class="text-lg text-navy" />
                                    </div>
                                    <div>
                                        <h4 class="font-black text-navy text-sm leading-snug">
                                            {{ $t(`home.comparison.${item.nameKey}`) }}
                                        </h4>
                                        <span class="text-[10px] font-bold text-slate-400 tracking-wider">
                                            {{ item.tag }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Archeris.net Card (4 cols) -->
                            <div class="md:col-span-4 rounded-xl p-4 bg-primary/5 border border-primary/25 shadow-xs flex flex-col justify-between">
                                <div class="space-y-1.5">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-1.5 text-navy font-black text-xs">
                                            <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-sm shrink-0" />
                                            <span>Archeris.net</span>
                                        </div>
                                        <span class="text-[9px] bg-primary text-navy font-black px-2 py-0.5 rounded-md tracking-wider shadow-2xs">
                                            {{ $t('home.comparison_page.badge_cloud_pro') }}
                                        </span>
                                    </div>
                                    <p class="text-xs text-slate-700 leading-relaxed font-medium">
                                        {{ $t(`home.comparison.${item.archerisKey}`) }}
                                    </p>
                                </div>
                            </div>

                            <!-- Ianseo.net Card (4 cols) -->
                            <div class="md:col-span-4 rounded-xl p-4 bg-slate-50 border border-slate-100 flex flex-col justify-between">
                                <div class="space-y-1.5">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                                            <Icon icon="ph:minus-circle-bold" class="text-slate-400 text-sm shrink-0" />
                                            <span>Ianseo.net</span>
                                        </div>
                                        <span class="text-[9px] bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-md tracking-wider">
                                            {{ $t('home.comparison_page.badge_legacy') }}
                                        </span>
                                    </div>
                                    <p class="text-xs text-slate-500 leading-relaxed font-normal">
                                        {{ $t(`home.comparison.${item.ianseoKey}`) }}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <!-- CTA Banner -->
            <section class="mt-12">
                <div class="bg-navy text-white rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-primary/20 shadow-xl">
                    <div class="absolute inset-0"
                        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.12);"></div>
                    <h2 class="text-white text-2xl md:text-4xl font-black tracking-tight mb-4 relative z-10">
                        {{ $t('home.comparison_page.cta_title') }}
                    </h2>
                    <p class="text-slate-300 text-xs sm:text-sm font-medium mb-8 relative z-10 max-w-xl mx-auto leading-relaxed">
                        {{ $t('home.comparison_page.cta_desc') }}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3.5 justify-center relative z-10">
                        <NuxtLink :to="localePath('/auth/register')">
                            <BaseButton variant="primary" size="lg" icon="ph:user-plus-bold">
                                {{ $t('home.comparison_page.cta_btn') }}
                            </BaseButton>
                        </NuxtLink>
                        <NuxtLink :to="localePath('/')">
                            <BaseButton variant="outline" size="lg" icon="ph:house-bold">
                                {{ $t('home.comparison_page.back_home') }}
                            </BaseButton>
                        </NuxtLink>
                    </div>
                </div>
            </section>

        </main>
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

definePageMeta({
    layout: 'landing'
})

const { t } = useI18n()
const localePath = useLocalePath()

useHead({
    title: computed(() => t('comparison.title', 'Archeris vs Ianseo') + ' - Archeris'),
    meta: [
        { name: 'description', content: 'Detailed comparison between Archeris.net and Ianseo.net tournament management platforms.' }
    ]
})

const activeCategory = ref('all')

const featureCategories = computed(() => [
    { id: 'all', label: t('home.comparison_page.cat_all', 'Semua Fitur'), icon: 'ph:squares-four-bold' },
    { id: 'infra', label: t('home.comparison_page.cat_infra', 'Infrastruktur & Cloud'), icon: 'ph:cloud-check-bold' },
    { id: 'payment', label: t('home.comparison_page.cat_payment', 'Pendaftaran & Pembayaran'), icon: 'ph:credit-card-bold' },
    { id: 'tournament', label: t('home.comparison_page.cat_tournament', 'Turnamen & Scoring'), icon: 'ph:target-bold' },
    { id: 'output', label: t('home.comparison_page.cat_output', 'Output & Printout'), icon: 'ph:printer-bold' }
])

const featuresList = [
    {
        id: 1,
        category: 'infra',
        nameKey: 'f1_name',
        archerisKey: 'f1_archeris',
        ianseoKey: 'f1_ianseo',
        icon: 'ph:globe-hemisphere-east-bold',
        tag: 'Cloud vs Desktop'
    },
    {
        id: 2,
        category: 'payment',
        nameKey: 'f2_name',
        archerisKey: 'f2_archeris',
        ianseoKey: 'f2_ianseo',
        icon: 'ph:wallet-bold',
        tag: 'Payment Gateway'
    },
    {
        id: 3,
        category: 'payment',
        nameKey: 'f3_name',
        archerisKey: 'f3_archeris',
        ianseoKey: 'f3_ianseo',
        icon: 'ph:coins-bold',
        tag: 'Pricing Model'
    },
    {
        id: 4,
        category: 'tournament',
        nameKey: 'f4_name',
        archerisKey: 'f4_archeris',
        ianseoKey: 'f4_ianseo',
        icon: 'ph:chart-line-up-bold',
        tag: 'Live Dashboard'
    },
    {
        id: 5,
        category: 'infra',
        nameKey: 'f5_name',
        archerisKey: 'f5_archeris',
        ianseoKey: 'f5_ianseo',
        icon: 'ph:arrows-out-cardinal-bold',
        tag: 'Simplicity'
    },
    {
        id: 6,
        category: 'output',
        nameKey: 'f6_name',
        archerisKey: 'f6_archeris',
        ianseoKey: 'f6_ianseo',
        icon: 'ph:identification-badge-bold',
        tag: 'E-Badge & Pass'
    },
    {
        id: 7,
        category: 'tournament',
        nameKey: 'f7_name',
        archerisKey: 'f7_archeris',
        ianseoKey: 'f7_ianseo',
        icon: 'ph:broadcast-bold',
        tag: 'Field Operations'
    },
    {
        id: 8,
        category: 'infra',
        nameKey: 'f8_name',
        archerisKey: 'f8_archeris',
        ianseoKey: 'f8_ianseo',
        icon: 'ph:device-mobile-camera-bold',
        tag: 'Public Event Portal'
    },
    {
        id: 9,
        category: 'tournament',
        nameKey: 'f9_name',
        archerisKey: 'f9_archeris',
        ianseoKey: 'f9_ianseo',
        icon: 'ph:git-branch-bold',
        tag: 'Divisions & Classes'
    },
    {
        id: 10,
        category: 'tournament',
        nameKey: 'f10_name',
        archerisKey: 'f10_archeris',
        ianseoKey: 'f10_ianseo',
        icon: 'ph:calculator-bold',
        tag: 'Scorekeeper App'
    },
    {
        id: 11,
        category: 'payment',
        nameKey: 'f11_name',
        archerisKey: 'f11_archeris',
        ianseoKey: 'f11_ianseo',
        icon: 'ph:user-check-bold',
        tag: 'Athlete Status'
    },
    {
        id: 12,
        category: 'payment',
        nameKey: 'f12_name',
        archerisKey: 'f12_archeris',
        ianseoKey: 'f12_ianseo',
        icon: 'ph:users-three-bold',
        tag: 'Participant Sync'
    },
    {
        id: 13,
        category: 'tournament',
        nameKey: 'f13_name',
        archerisKey: 'f13_archeris',
        ianseoKey: 'f13_ianseo',
        icon: 'ph:target-bold',
        tag: 'Target Allocation'
    },
    {
        id: 14,
        category: 'output',
        nameKey: 'f14_name',
        archerisKey: 'f14_archeris',
        ianseoKey: 'f14_ianseo',
        icon: 'ph:file-pdf-bold',
        tag: 'PDF & Scoresheets'
    }
]

const filteredFeatures = computed(() => {
    if (activeCategory.value === 'all') return featuresList
    return featuresList.filter(f => f.category === activeCategory.value)
})
</script>
