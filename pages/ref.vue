<template>
    <div class="bg-navy-dark min-h-screen text-white font-sans selection:bg-primary selection:text-navy-dark">
        <!-- ── Navigation Header ── -->
        <header class="h-20 border-b border-white/5 bg-navy/80 backdrop-blur-md sticky top-0 z-50 px-6 md:px-12 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <NuxtLink to="/" class="flex items-center gap-2">
                    <img src="/logo.png" alt="Archeris" class="w-8 h-8 object-contain" />
                    <span class="font-black tracking-widest text-sm text-white">Archeris <span class="text-primary font-black">Ref</span></span>
                </NuxtLink>
            </div>
            <div class="flex items-center gap-4">
                <span class="text-[10px] font-black tracking-widest text-slate-400 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    Revamp Sandbox
                </span>
            </div>
        </header>

        <!-- ── Main Workspace ── -->
        <main class="max-w-[1600px] mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Panel: Audit Grid Cards -->
            <div class="lg:col-span-5 space-y-6 overflow-y-auto max-h-[950px] scrollbar-thin pr-2">
                <div class="space-y-2">
                    <h1 class="text-2xl font-black text-white tracking-tight leading-none">
                        Landing Page <span class="text-primary">Benchmarks</span>
                    </h1>
                    <p class="text-xs text-slate-400 font-medium leading-relaxed">
                        Select a reference to load its live iframe sandbox or open in a new tab for layout inspection.
                    </p>
                </div>

                <div class="grid grid-cols-1 gap-4">
                    <div v-for="site in sites" :key="site.name"
                        @click="selectedSite = site"
                        :class="[
                            'p-5 rounded-2xl border transition-all cursor-pointer text-left relative group',
                            selectedSite.name === site.name 
                                ? 'bg-white/10 border-primary shadow-lg shadow-primary/5' 
                                : 'bg-navy/40 border-white/5 hover:bg-navy hover:border-white/20'
                        ]">
                        <!-- Top Accent Banner -->
                        <div class="flex items-start justify-between gap-4 mb-3">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white"
                                    :class="site.color">
                                    <Icon :icon="site.icon" class="text-xl" />
                                </div>
                                <div>
                                    <h3 class="font-black text-sm tracking-wide text-white group-hover:text-primary transition-colors">
                                        {{ site.name }}
                                    </h3>
                                    <span class="text-[9px] font-black text-slate-400 tracking-wider block mt-0.5">
                                        {{ site.url.replace('https://', '').replace('www.', '') }}
                                    </span>
                                </div>
                            </div>
                            <span class="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black text-primary tracking-widest">
                                {{ site.theme }}
                            </span>
                        </div>

                        <p class="text-xs text-slate-300 font-semibold leading-relaxed mb-4 line-clamp-2">
                            {{ site.description }}
                        </p>

                        <div class="flex items-center justify-between">
                            <span class="text-[9px] font-black text-slate-400 group-hover:text-white transition-colors tracking-widest">
                                {{ selectedSite.name === site.name ? 'Active Preview' : 'Click to inspect' }}
                            </span>
                            <a :href="site.url" target="_blank" @click.stop
                                class="flex items-center gap-1 text-[9px] font-black text-primary hover:underline tracking-widest shrink-0">
                                Open Site <Icon icon="ph:arrow-square-out-bold" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Panel: Fully Interactive Responsive Frame Viewer -->
            <div class="lg:col-span-7 flex flex-col h-[950px] bg-navy/20 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
                <!-- Sandbox Controls Header -->
                <div class="px-6 py-4 bg-navy/80 border-b border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                    <div class="min-w-0">
                        <span class="text-[8px] font-black text-primary tracking-widest ">Target Preview</span>
                        <h2 class="font-black text-sm tracking-wider text-white truncate">
                            {{ selectedSite.name }}
                        </h2>
                    </div>

                    <!-- Viewport Toggles (Desktop, Tablet, Mobile) -->
                    <div class="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 shrink-0">
                        <button v-for="mode in ['desktop', 'tablet', 'mobile']" :key="mode"
                            @click="viewportMode = mode"
                            :class="[
                                'px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wider transition-all',
                                viewportMode === mode ? 'bg-primary text-navy-dark shadow-sm' : 'text-slate-400 hover:text-white'
                            ]">
                            {{ mode }}
                        </button>
                    </div>
                </div>

                <!-- Live Container Workspace -->
                <div class="flex-1 bg-slate-950/80 p-6 flex items-center justify-center overflow-hidden relative">
                    <!-- Security / Frame Loading Notice -->
                    <div class="absolute top-4 left-4 right-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-start gap-3 z-20">
                        <Icon icon="ph:warning-circle-bold" class="text-amber-500 text-lg shrink-0 mt-0.5" />
                        <div>
                            <h4 class="text-[10px] font-black text-amber-500 tracking-widest leading-none mb-1">
                                Frame Loading Limitations
                            </h4>
                            <p class="text-[9px] text-slate-300 font-bold leading-normal">
                                Some sites protect their landing pages via X-Frame-Options policies. If the preview displays blank, use the <a :href="selectedSite.url" target="_blank" class="text-primary hover:underline font-black">Visit Site ↗</a> button.
                            </p>
                        </div>
                    </div>

                    <!-- Viewport Container Frame -->
                    <div :class="[
                        'bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border border-white/10 relative',
                        viewportMode === 'desktop' ? 'w-full h-[820px]' : viewportMode === 'tablet' ? 'w-[768px] h-[820px]' : 'w-[375px] h-[820px]'
                    ]">
                        <!-- Top Address Bar Replica -->
                        <div class="h-8 bg-gray-100 border-b border-gray-200 px-4 flex items-center gap-2 shrink-0">
                            <span class="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0"></span>
                            <span class="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0"></span>
                            <span class="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0"></span>
                            <div class="flex-1 bg-white border border-gray-200 rounded px-3 py-0.5 text-[9px] text-gray-500 truncate leading-none flex items-center gap-1 font-mono">
                                <Icon icon="ph:lock-key-fill" class="text-green-600 shrink-0" />
                                {{ selectedSite.url }}
                            </div>
                        </div>

                        <!-- Iframe -->
                        <iframe :key="selectedSite.url" :src="selectedSite.url"
                            class="w-full h-[calc(100%-2rem)] bg-white border-0"
                            sandbox="allow-scripts allow-same-origin allow-popups"
                            loading="lazy"></iframe>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

definePageMeta({ layout: false })

const sites = [
    {
        name: 'Jersey Watch',
        url: 'https://www.jerseywatch.com/',
        theme: 'Tema Fun',
        description: 'Sleek, vibrant team website builder designed to be clean, fun, and extremely user-friendly.',
        icon: 'ph:smiley-bold',
        color: 'from-amber-400 to-orange-500'
    },
    {
        name: 'LeagueApps',
        url: 'https://leagueapps.com/',
        theme: 'Commercial',
        description: 'Professional sports management software built for large scale youth and local leagues.',
        icon: 'ph:buildings-bold',
        color: 'from-blue-500 to-indigo-600'
    },
    {
        name: 'TeamSnap',
        url: 'https://www.teamsnap.com/',
        theme: 'To The Point',
        description: 'Highly communicative interface focused on team schedules, messaging, and coordinates.',
        icon: 'ph:target-bold',
        color: 'from-emerald-400 to-teal-600'
    },
    {
        name: 'PlayMetrics',
        url: 'https://home.playmetrics.com/',
        theme: 'Game Style',
        description: 'Elite club operations and coaching platform featuring professional game-ready dashboards.',
        icon: 'ph:game-controller-bold',
        color: 'from-purple-500 to-pink-600'
    },
    {
        name: 'PlayByPoint',
        url: 'https://www.playbypoint.com/',
        theme: 'Modern & Mobile Promosi',
        description: 'Highly dynamic platform built for booking courts, running clinics, and mobile-first conversions.',
        icon: 'ph:device-mobile-bold',
        color: 'from-cyan-400 to-blue-500'
    },
    {
        name: 'LiveTourney',
        url: 'https://www.livetourney.com/',
        theme: 'Product Based',
        description: 'Product-focused tournament presentation showing live score brackets, schedules, and analytics.',
        icon: 'ph:presentation-chart-bold',
        color: 'from-rose-500 to-red-600'
    },
    {
        name: 'CourtReserve',
        url: 'https://courtreserve.com/',
        theme: 'Good Explanation',
        description: 'All-in-one club coordination platform with detailed, step-by-step feature highlights.',
        icon: 'ph:book-open-bold',
        color: 'from-violet-500 to-purple-600'
    },
    {
        name: 'WareSport',
        url: 'https://www.waresport.com/',
        theme: 'Good Explanation',
        description: 'Sleek explanation pages outlining tools for modern sports complexes and tournament venues.',
        icon: 'ph:info-bold',
        color: 'from-slate-600 to-slate-800'
    }
]

const selectedSite = ref(sites[0])
const viewportMode = ref('desktop')
</script>

<style scoped>
/* Scrolled Panel Scrollbar */
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.15);
}
</style>
