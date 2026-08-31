<template>
    <div class="min-h-screen bg-slate-50 font-body selection:bg-primary/20 selection:text-navy overflow-x-hidden">
        <!--  HERO SECTION  -->
        <section class="relative bg-gradient-to-b from-navy via-navy-dark to-slate-900 text-white pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
            <!-- Background Image Slideshow changing every 5 seconds -->
            <div class="absolute inset-0 z-0">
                <transition-group name="hero-fade">
                    <div v-for="(img, idx) in heroImages" :key="img"
                        v-show="currentHeroIdx === idx"
                        class="absolute inset-0 w-full h-full">
                        <img :src="img" alt="Archery Background" class="w-full h-full object-cover object-center scale-105 transition-transform duration-[8000ms] ease-out" />
                    </div>
                </transition-group>
                <div class="absolute inset-0 bg-navy/80 backdrop-blur-[2px]"></div>
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90"></div>
            </div>

            <!-- Radial background target pattern -->
            <div class="absolute inset-0 opacity-10 pointer-events-none target-texture z-1"></div>
            
            <!-- Glow Accents -->
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-1"></div>

            <div class="container mx-auto px-4 max-w-6xl relative z-10 text-center">
                <!-- Badge -->
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-primary text-xs font-black tracking-widest mb-8 shadow-inner">
                    <Icon icon="ph:target-bold" class="text-base text-primary" />
                    <span>Redefining Archery Competitions Through Technology</span>
                </div>

                <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6 max-w-4xl mx-auto font-display">
                    Digitizing the 
                    <span class="text-navy bg-primary px-5 py-1 rounded-2xl inline-block transform -rotate-1 shadow-lg shadow-primary/20">Future</span> 
                    of Archery.
                </h1>

                <p class="text-slate-300 text-base sm:text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed mb-12">
                    We build modern, cloud-native digital infrastructure for archery tournament organizers, athletes, and national federations worldwide. Recording every arrow, sorting brackets instantly, and mapping targets with absolute precision.
                </p>

                <!-- Quick Stat Pills -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <div v-for="stat in heroStats" :key="stat.label"
                        class="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 text-center hover:bg-white/10 transition-all duration-300">
                        <div class="text-2xl sm:text-3xl md:text-4xl font-black text-primary tracking-tight">{{ stat.value }}</div>
                        <div class="text-xs font-bold text-slate-300 tracking-wider mt-1">{{ stat.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!--  CORE PILLARS (FEATURES GRID)  -->
        <section class="py-20 relative">
            <div class="container mx-auto px-4 max-w-6xl">
                <div class="text-center mb-16">
                    <span class="text-xs font-black tracking-widest text-primary bg-navy px-3.5 py-1.5 rounded-full ">Why Archeris</span>
                    <h2 class="text-3xl md:text-5xl font-black text-navy tracking-tight mt-4">
                        Engineered for Unmatched Precision
                    </h2>
                    <p class="text-slate-500 font-medium text-base md:text-lg max-w-2xl mx-auto mt-3">
                        Built from the ground up to eliminate manual overhead, eliminate scorecard calculation errors, and provide instant public transparency.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div v-for="pillar in pillars" :key="pillar.title"
                        class="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                        <div>
                            <div class="size-14 rounded-2xl bg-navy/5 text-navy group-hover:bg-navy group-hover:text-primary transition-all duration-300 flex items-center justify-center mb-6">
                                <Icon :icon="pillar.icon" class="text-2xl" />
                            </div>
                            <h3 class="text-xl font-black text-navy mb-3 tracking-tight">{{ pillar.title }}</h3>
                            <p class="text-slate-500 text-sm font-medium leading-relaxed">{{ pillar.description }}</p>
                        </div>
                        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-navy group-hover:text-primary transition-colors">
                            <span>Learn feature</span>
                            <Icon icon="ph:arrow-right-bold" class="ml-1 text-sm transition-transform group-hover:translate-x-1" />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!--  COMPARISON SECTION: ARCHERIS VS TRADITIONAL PAPER  -->
        <section class="py-16 bg-white border-y border-slate-100">
            <div class="container mx-auto px-4 max-w-6xl">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <div class="lg:col-span-5 space-y-6">
                        <span class="text-xs font-black tracking-widest text-primary bg-navy px-3.5 py-1.5 rounded-full ">The Modern Choice</span>
                        <h2 class="text-3xl md:text-4xl font-black text-navy tracking-tight leading-snug">
                            Say Goodbye to Paper Scorecards & Calculation Delays.
                        </h2>
                        <p class="text-slate-600 font-medium text-base leading-relaxed">
                            Traditional archery scoring relies on manual paper collection, slow tallying, and delayed announcement boards. Archeris digitizes every step of the workflow.
                        </p>
                        <div class="space-y-3 pt-2">
                            <div v-for="item in advantageList" :key="item" class="flex items-center gap-3">
                                <div class="size-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                    <Icon icon="ph:check-bold" class="text-xs" />
                                </div>
                                <span class="text-slate-700 font-bold text-sm sm:text-base">{{ item }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-7">
                        <div class="bg-navy rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-white/10 relative overflow-hidden">
                            <div class="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                                <div>
                                    <h4 class="text-lg font-black text-white">Archeris Cloud Engine</h4>
                                    <p class="text-xs text-slate-400 font-medium">100% Ianseo Feature Compliant + Cloud Native</p>
                                </div>
                                <span class="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">Live Sync</span>
                            </div>

                            <div class="space-y-4 text-xs font-semibold">
                                <div class="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                                    <span class="text-slate-300">Qualification Scoring & 10X/X Tally</span>
                                    <span class="text-primary font-black">Instant Real-time</span>
                                </div>
                                <div class="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                                    <span class="text-slate-300">Head-to-Head Bracket Generation</span>
                                    <span class="text-primary font-black">Automated (1/8 to Final)</span>
                                </div>
                                <div class="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                                    <span class="text-slate-300">Public Leaderboard Accessibility</span>
                                    <span class="text-primary font-black">Mobile Web & Embed Widgets</span>
                                </div>
                                <div class="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
                                    <span class="text-slate-300">Target Line Map Layout</span>
                                    <span class="text-primary font-black">Drag & Drop Configurator</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!--  OUR STORY & MISSION  -->
        <section class="py-20 relative">
            <div class="container mx-auto px-4 max-w-6xl">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    <!-- Left: Story Image & Badge -->
                    <div class="lg:col-span-6 relative">
                        <div class="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl border border-slate-200">
                            <img src="https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&q=80&w=1200"
                                class="w-full h-full object-cover" alt="Archery competition" />
                            <div class="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent"></div>
                            
                            <div class="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg">
                                <div class="text-xs font-black text-navy tracking-widest mb-1">Our Commitment</div>
                                <div class="text-sm font-bold text-slate-700 leading-snug">
                                    Empowering local archery clubs and national federations to host professional tournaments with zero friction.
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Story Content -->
                    <div class="lg:col-span-6 space-y-6">
                        <span class="text-xs font-black tracking-widest text-primary bg-navy px-3.5 py-1.5 rounded-full ">Our Story</span>
                        <h2 class="text-3xl md:text-4xl font-black text-navy tracking-tight">
                            Built by Archers, Designed for Champions.
                        </h2>
                        <div class="space-y-4 text-slate-600 font-medium text-base leading-relaxed">
                            <p>
                                What started as a vision to eliminate paper scorecard errors has evolved into Indonesia's leading archery event platform. Today, we support organizers, judges, scorekeepers, and archers across all age divisions and bow classes.
                            </p>
                            <p>
                                Archeris replicates 100% of the tournament rules and classification logic of World Archery and Ianseo—including qualification round totals, target face assignments, and set points calculation in head-to-head elimination.
                            </p>
                            <p>
                                We take it further by providing a centralized cloud ecosystem with instant mobile leaderboards, verified athlete rank passports, and integrated payment gateways for seamless event registration.
                            </p>
                        </div>

                        <div class="pt-4 flex flex-wrap gap-4">
                            <NuxtLink :to="localePath('/pricing')"
                                class="px-6 py-3 bg-navy text-white font-bold rounded-xl text-sm hover:bg-navy-dark transition-colors shadow-md">
                                Explore Pricing Plans
                            </NuxtLink>
                            <NuxtLink :to="localePath('/contact')"
                                class="px-6 py-3 bg-slate-100 text-navy font-bold rounded-xl text-sm hover:bg-slate-200 transition-colors">
                                Contact Sales & Support
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!--  CTA SECTION  -->
        <section class="pb-24 px-4">
            <div class="max-w-6xl mx-auto bg-gradient-to-r from-navy via-navy-dark to-navy text-white rounded-[32px] p-8 md:p-16 text-center relative overflow-hidden shadow-2xl border border-white/10">
                <div class="absolute inset-0 opacity-10 pointer-events-none target-texture"></div>
                <div class="relative z-10">
                    <span class="text-xs font-black tracking-widest text-primary bg-white/10 px-4 py-1.5 rounded-full mb-4 inline-block">Get Started Today</span>
                    <h2 class="text-white text-3xl md:text-5xl font-black tracking-tight mb-4">
                        Ready to Host Your Next Archery Tournament?
                    </h2>
                    <p class="text-slate-300 text-sm md:text-base font-medium mb-8 max-w-xl mx-auto">
                        Register your organization account to access real-time digital scoring, target map configurator, and dynamic bracket generation instantly.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <NuxtLink :to="localePath('/auth/register')"
                            class="px-8 py-4 bg-primary text-navy rounded-2xl font-black tracking-wider text-sm hover:bg-primary-hover hover:scale-105 transition-all shadow-lg shadow-primary/20">
                            Register as Organizer
                        </NuxtLink>
                        <NuxtLink :to="localePath('/pricing')"
                            class="px-8 py-4 bg-white/10 text-white rounded-2xl font-bold tracking-wider text-sm border border-white/15 hover:bg-white/20 transition-all">
                            View Pricing & Features
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({
    layout: 'landing'
})

const localePath = useLocalePath()

const heroImages = [
    '/hero-event-detail.jpeg',
    '/hero-homepage.jpeg',
    '/hero-event.jpeg',
    '/hero-club.jpeg',
    '/hero-berita.jpeg',
    '/hero-archer.jpeg'
]

const currentHeroIdx = ref(0)
let heroTimer = null

onMounted(() => {
    heroTimer = setInterval(() => {
        currentHeroIdx.value = (currentHeroIdx.value + 1) % heroImages.length
    }, 5000)
})

onUnmounted(() => {
    if (heroTimer) {
        clearInterval(heroTimer)
    }
})

useHead({
    title: computed(() => t('about.title', 'About Us') + ' - ArcheryHub | Archery Event Platform'),
    meta: [
        { name: 'description', content: 'Learn about Archeris.net - the modern digital platform for archery tournament organizers, scorekeepers, and athletes.' }
    ]
})

const heroStats = [
    { value: '500+', label: 'Tournaments' },
    { value: '25,000+', label: 'Athletes' },
    { value: '1,000,000+', label: 'Arrows Scored' },
    { value: '99.9%', label: 'Uptime' }
]

const pillars = [
    {
        icon: 'ph:device-mobile-camera-bold',
        title: 'Real-Time Digital Scoring',
        description: 'Scorekeeper web & mobile portal with instant validation, eliminating paper overhead and score errors.'
    },
    {
        icon: 'ph:git-fork-bold',
        title: 'Automated Elimination Brackets',
        description: 'Instant head-to-head bracket generation from 1/8 Final to Gold Medal Finals with set points calculations.'
    },
    {
        icon: 'ph:target-bold',
        title: 'Target Map Configurator',
        description: 'Visual target line layout tools with custom target face assignments and archer positioning.'
    },
    {
        icon: 'ph:trophy-bold',
        title: 'Verified Athlete Passports',
        description: 'Centralized athlete profile records tracking historical scores, tournament rankings, and badges.'
    }
]

const advantageList = [
    'Zero paper scorecard calculation delays',
    'Real-time public leaderboards for spectators & parents',
    'Full Ianseo & World Archery rule compliance',
    'Integrated digital payment gateways & automated receipts',
    'Cloud-native architecture with 99.9% uptime guarantee'
]
</script>

<style scoped>
.target-texture {
    background-image: radial-gradient(circle, transparent 20%, rgba(255, 255, 255, 0.05) 21%, rgba(255, 255, 255, 0.05) 39%, transparent 40%, transparent 59%, rgba(255, 255, 255, 0.05) 60%, rgba(255, 255, 255, 0.05) 79%, transparent 80%);
    background-size: 300px 300px;
    background-position: center;
}

.hero-fade-enter-active,
.hero-fade-leave-active {
    transition: opacity 1.5s ease-in-out;
}
.hero-fade-enter-from,
.hero-fade-leave-to {
    opacity: 0;
}
</style>
