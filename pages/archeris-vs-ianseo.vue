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
                <img src="/hero-homepage.jpeg" alt="Archeris vs Ianseo Comparison" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>
            <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div>
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
                                    {{ $t('home.comparison_page.summary_archeris_tag', 'Modern & Cloud-Native') }}
                                </span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-300 leading-relaxed font-medium relative z-10">
                            {{ $t('home.comparison_page.summary_archeris_desc', 'Integrated archery tournament management: online registration, automated payments, and digital archery scoring via mobile browser.') }}
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
                                    {{ $t('home.comparison_page.summary_ianseo_tag', 'Desktop / On-Premise') }}
                                </span>
                            </div>
                        </div>
                        <p class="text-xs text-slate-500 leading-relaxed">
                            {{ $t('home.comparison_page.summary_ianseo_desc', 'Official World Archery desktop application requiring local database server installation (MySQL) and on-field local network setup.') }}
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
                                        <h4 class="font-black text-navy text-sm sm:text-base leading-snug">
                                            {{ $t(`home.comparison.${item.nameKey}`) }}
                                        </h4>
                                        <span class="text-xs font-bold text-slate-400 tracking-wide">
                                            {{ item.tag }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Archeris.net Card (4 cols) -->
                            <div class="md:col-span-4 rounded-2xl p-4 sm:p-5 bg-primary/5 border border-primary/25 shadow-xs flex flex-col justify-between">
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-1.5 text-navy font-black text-xs sm:text-sm">
                                            <Icon icon="ph:check-circle-fill" class="text-emerald-600 text-base shrink-0" />
                                            <span>Archeris.net</span>
                                        </div>
                                        <span class="text-[10px] sm:text-xs bg-primary text-navy font-bold px-2 py-0.5 rounded-md tracking-wide shadow-2xs">
                                            {{ $t('home.comparison_page.badge_cloud_pro') }}
                                        </span>
                                    </div>
                                    <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                                        {{ $t(`home.comparison.${item.archerisKey}`) }}
                                    </p>
                                </div>
                            </div>

                            <!-- Ianseo.net Card (4 cols) -->
                            <div class="md:col-span-4 rounded-2xl p-4 sm:p-5 bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                                <div class="space-y-2">
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-1.5 text-slate-600 font-bold text-xs sm:text-sm">
                                            <Icon icon="ph:minus-circle-bold" class="text-slate-400 text-base shrink-0" />
                                            <span>Ianseo.net</span>
                                        </div>
                                        <span class="text-[10px] sm:text-xs bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded-md tracking-wide">
                                            {{ $t('home.comparison_page.badge_legacy') }}
                                        </span>
                                    </div>
                                    <p class="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                                        {{ $t(`home.comparison.${item.ianseoKey}`) }}
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>


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

const structuredData = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Archeris vs Ianseo - Modern Archery Scoring System Comparison',
    'description': 'Feature comparison between Archeris cloud archery scoring system and legacy desktop Ianseo.',
    'url': 'https://archeris.net/archeris-vs-ianseo'
}))

useHead({
    title: 'Archeris vs Ianseo - Modern Archery Scoring System Comparison',
    link: [
        { rel: 'canonical', href: useRequestURL().href }
    ],
    script: [
        {
            type: 'application/ld+json',
            children: computed(() => JSON.stringify(structuredData.value))
        }
    ]
})

useSeoMeta({
    title: 'Archeris vs Ianseo - Modern Archery Scoring System Comparison',
    description: 'Compare Archeris cloud-native archery scoring system with legacy desktop Ianseo software. Faster target scoring, zero local servers, instant mobile sync.',
    ogTitle: 'Archeris vs Ianseo - Modern Archery Scoring System Comparison',
    ogDescription: 'Compare Archeris cloud-native archery scoring system with legacy desktop Ianseo software. Faster target scoring, zero local servers, instant mobile sync.',
    ogType: 'website',
    twitterCard: 'summary_large_image'
})

const activeCategory = ref('all')

const featureCategories = computed(() => [
    { id: 'all', label: t('home.comparison_page.cat_all', 'All Features'), icon: 'ph:squares-four-bold' },
    { id: 'infra', label: t('home.comparison_page.cat_infra', 'Infrastructure & Cloud'), icon: 'ph:cloud-check-bold' },
    { id: 'payment', label: t('home.comparison_page.cat_payment', 'Registration & Payments'), icon: 'ph:credit-card-bold' },
    { id: 'tournament', label: t('home.comparison_page.cat_tournament', 'Tournament & Scoring'), icon: 'ph:target-bold' },
    { id: 'output', label: t('home.comparison_page.cat_output', 'Outputs & Printouts'), icon: 'ph:printer-bold' }
])

const featuresList = [
    {
        id: 1,
        category: 'infra',
        nameKey: 'f1_name',
        archerisKey: 'f1_archeris',
        ianseoKey: 'f1_ianseo',
        icon: 'ph:globe-hemisphere-east-bold',
        tag: 'Web Browser'
    },
    {
        id: 2,
        category: 'infra',
        nameKey: 'f2_name',
        archerisKey: 'f2_archeris',
        ianseoKey: 'f2_ianseo',
        icon: 'ph:broadcast-bold',
        tag: 'Mobile Scoring'
    },
    {
        id: 3,
        category: 'payment',
        nameKey: 'f3_name',
        archerisKey: 'f3_archeris',
        ianseoKey: 'f3_ianseo',
        icon: 'ph:user-plus-bold',
        tag: 'Online Signups'
    },
    {
        id: 4,
        category: 'payment',
        nameKey: 'f4_name',
        archerisKey: 'f4_archeris',
        ianseoKey: 'f4_ianseo',
        icon: 'ph:credit-card-bold',
        tag: 'Payments'
    },
    {
        id: 5,
        category: 'tournament',
        nameKey: 'f5_name',
        archerisKey: 'f5_archeris',
        ianseoKey: 'f5_ianseo',
        icon: 'ph:target-bold',
        tag: 'Target Lanes'
    },
    {
        id: 6,
        category: 'tournament',
        nameKey: 'f6_name',
        archerisKey: 'f6_archeris',
        ianseoKey: 'f6_ianseo',
        icon: 'ph:tree-structure-bold',
        tag: 'Match Brackets'
    },
    {
        id: 7,
        category: 'tournament',
        nameKey: 'f7_name',
        archerisKey: 'f7_archeris',
        ianseoKey: 'f7_ianseo',
        icon: 'ph:chart-line-up-bold',
        tag: 'Live Scores'
    },
    {
        id: 8,
        category: 'output',
        nameKey: 'f8_name',
        archerisKey: 'f8_archeris',
        ianseoKey: 'f8_ianseo',
        icon: 'ph:file-pdf-bold',
        tag: 'PDFs & Certificates'
    }
]

const filteredFeatures = computed(() => {
    if (activeCategory.value === 'all') return featuresList
    return featuresList.filter(f => f.category === activeCategory.value)
})
</script>
