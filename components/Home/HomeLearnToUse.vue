<template>
    <section ref="sectionRef" class="py-20 sm:py-32 bg-[#DEFEBD] overflow-hidden relative">
        <!-- Subtle Stripes SVG Overlay (Right Side - Bold & Variant) -->
        <svg class="absolute inset-y-0 right-0 h-[40%] sm:h-full w-auto text-[#63C03B] pointer-events-none opacity-80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 765 1186" xml:space="preserve">
            <!-- Intersecting double-stripe parallel variants -->
            <path fill="currentColor" style="opacity: 0.12;" d="M122,1186H0L406-31h122L122,1186z M765-31H643L237,1186h122L765-31z"></path>
            <path fill="currentColor" style="opacity: 0.05;" d="M180,1186H58L464-31h122L180,1186z M825-31H703L297,1186h122L825-31z"></path>
        </svg>

        <!-- Subtle Stripes SVG Overlay (Left Side Flipped - Bold & Variant) -->
        <svg class="absolute inset-y-0 left-0 h-[40%] sm:h-full w-auto text-[#63C03B] pointer-events-none opacity-80 transform scale-x-[-1]" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 765 1186" xml:space="preserve">
            <path fill="currentColor" style="opacity: 0.12;" d="M122,1186H0L406-31h122L122,1186z M765-31H643L237,1186h122L765-31z"></path>
            <path fill="currentColor" style="opacity: 0.05;" d="M180,1186H58L464-31h122L180,1186z M825-31H703L297,1186h122L825-31z"></path>
        </svg>

        <div class="max-w-[1600px] mx-auto relative z-10">
            <!-- Section Header -->
            <div class="text-center mb-16 sm:mb-24 px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl sm:text-5xl font-black text-navy leading-tight mb-6 font-display tracking-tight reveal-title">
                    {{ $t('home.learn.title') }} <br class="hidden sm:block" />
                    <span class="text-navy/70">
                        {{ $t('home.learn.subtitle') }}
                    </span>
                </h2>
                <p class="text-slate-700 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed reveal-desc">
                    {{ $t('home.learn.description') }}
                </p>
            </div>

            <!-- Horizontal Dashboard Showcase Mockup Container (Identical to Image) -->
            <div class="relative w-full overflow-hidden">
                <!-- Left overlay shadow (fades out from left) -->
                <div class="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[#DEFEBD] via-[#DEFEBD]/90 to-transparent z-20 pointer-events-none"></div>
                
                <!-- Right overlay shadow (fades out from right) -->
                <div class="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[#DEFEBD] via-[#DEFEBD]/90 to-transparent z-20 pointer-events-none"></div>

                <!-- Outer Scrolling Area with Faded Mask Edges -->
                <div ref="scrollContainer" class="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-6 sm:px-16 lg:px-24 pb-12">
                    
                    <!-- ── CARD 1: ROSTER & COMMUNICATIONS ── -->
                    <div class="w-[300px] sm:w-[500px] md:w-[600px] lg:w-[650px] shrink-0 snap-center bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                        <div class="mb-5">
                            <span class="px-3 py-1 bg-[#63C03B]/10 border border-[#63C03B]/20 text-[#63C03B] text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                                Step 1: Club Setup
                            </span>
                            <h3 class="text-xl sm:text-2xl font-black tracking-tight text-navy leading-none font-display">
                                Roster & Communications
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                                Manage members, divisions (recurve/compound), and broadcast instant announcement logs.
                            </p>
                        </div>
                        <div class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative aspect-[1.6/1] bg-slate-50">
                            <img src="/learn-step1.png" alt="Club Setup & Roster Dashboard" class="w-full h-full object-cover object-top" />
                        </div>
                    </div>

                    <!-- ── CARD 2: MATCH SCHEDULE & TARGET ALLOCATION ── -->
                    <div class="w-[300px] sm:w-[500px] md:w-[600px] lg:w-[650px] shrink-0 snap-center bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                        <div class="mb-5">
                            <span class="px-3 py-1 bg-[#63C03B]/10 border border-[#63C03B]/20 text-[#63C03B] text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                                Step 2: Schedule & Allocations
                            </span>
                            <h3 class="text-xl sm:text-2xl font-black tracking-tight text-navy leading-none font-display">
                                Match & Target Butt Allocation
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                                Assign lanes (1A, 1B, 2A, 2B), schedule tournaments, and configure match guidelines.
                            </p>
                        </div>
                        <div class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative aspect-[1.6/1] bg-slate-50">
                            <img src="/learn-step2.png" alt="Match Schedule & Target Butt Dashboard" class="w-full h-full object-cover object-top" />
                        </div>
                    </div>

                    <!-- ── CARD 3: LIVE SCORING & LEADERBOARD ── -->
                    <div class="w-[300px] sm:w-[500px] md:w-[600px] lg:w-[650px] shrink-0 snap-center bg-white border border-slate-100 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(15,23,42,0.04)] hover:shadow-[0_16px_48px_rgba(15,23,42,0.08)] hover:-translate-y-1 transition-all duration-300">
                        <div class="mb-5">
                            <span class="px-3 py-1 bg-[#63C03B]/10 border border-[#63C03B]/20 text-[#63C03B] text-[10px] font-black uppercase tracking-widest rounded-full mb-3 inline-block">
                                Step 3: Scoring & Leaderboards
                            </span>
                            <h3 class="text-xl sm:text-2xl font-black tracking-tight text-navy leading-none font-display">
                                Live Scoring & Performance
                            </h3>
                            <p class="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                                Monitor athlete performance end-by-end (X, 10, 9) and publish real-time public leaderboards.
                            </p>
                        </div>
                        <div class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative aspect-[1.6/1] bg-slate-50">
                            <img src="/learn-step3.png" alt="Live Scoring Leaderboard Dashboard" class="w-full h-full object-cover object-top" />
                        </div>
                    </div>

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

const sectionRef = ref(null)
const scrollContainer = ref(null)

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

    // scroll the second card (step 2) to the center of the screen
    if (scrollContainer.value) {
        setTimeout(() => {
            const container = scrollContainer.value
            const children = container.children
            if (children && children.length >= 2) {
                const secondChild = children[1]
                const containerWidth = container.clientWidth
                const childWidth = secondChild.clientWidth
                const childOffset = secondChild.offsetLeft
                
                const scrollPosition = childOffset - (containerWidth / 2) + (childWidth / 2)
                container.scrollTo({
                    left: scrollPosition,
                    behavior: 'instant'
                })
            }
        }, 150)
    }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
