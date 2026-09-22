<template>
    <section class="relative w-full min-h-[90vh] sm:min-h-screen flex items-center overflow-hidden pt-20 pb-12 sm:pt-0 sm:pb-0">
        <div class="absolute inset-0 w-full h-full">
            <picture>
                <source srcset="/hero-homepage.webp" type="image/webp" />
                <img alt="Professional archer aiming at target with modern archery scoring system"
                    class="w-full h-full object-cover object-center"
                    src="/hero-homepage.webp"
                    fetchpriority="high"
                    loading="eager"
                    decoding="async"
                    width="1920"
                    height="1080" />
            </picture>
            <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/50"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent opacity-95"></div>
        </div>
        <div class="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="w-full max-w-4xl lg:max-w-5xl">
                <!-- Title -->
                <h1 ref="heroTitle" class="text-white mb-5 sm:mb-6 drop-shadow-sm font-black text-2xl sm:text-4xl md:text-5xl lg:text-[54px] tracking-tight leading-[1.2] font-display">
                    <span class="inline">
                        <span class="inline-block overflow-hidden mr-2 sm:mr-2.5 py-0.5">
                            <span class="hero-word inline-block transform-gpu text-white">The</span>
                        </span>
                        <span class="inline-block overflow-hidden mr-2 sm:mr-2.5 py-0.5">
                            <span class="hero-word inline-block transform-gpu text-white">Modern</span>
                        </span>
                    </span>
                    <span class="relative inline-block my-0.5">
                        <span class="inline-block overflow-hidden mr-1.5 sm:mr-2 py-0.5">
                            <span class="hero-word inline-block transform-gpu text-primary font-black drop-shadow-[0_2px_14px_rgba(183,251,35,0.4)]">Archery</span>
                        </span>
                        <span class="inline-block overflow-hidden mr-1.5 sm:mr-2 py-0.5">
                            <span class="hero-word inline-block transform-gpu text-primary font-black drop-shadow-[0_2px_14px_rgba(183,251,35,0.4)]">Scoring</span>
                        </span>
                        <span class="inline-block overflow-hidden mr-2 sm:mr-2.5 py-0.5">
                            <span class="hero-word inline-block transform-gpu text-primary font-black drop-shadow-[0_2px_14px_rgba(183,251,35,0.4)]">System</span>
                        </span>
                        <!-- Custom Curved Vector Underline -->
                        <svg class="absolute -bottom-1.5 sm:-bottom-2.5 left-0 w-full h-2.5 sm:h-3.5 text-primary pointer-events-none drop-shadow-[0_2px_8px_rgba(183,251,35,0.5)]" viewBox="0 0 320 20" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                            <path d="M4 14C85 4 210 3 316 11C230 7 105 8 25 17" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <span class="inline">
                        <span class="inline-block overflow-hidden mr-2 sm:mr-2.5 py-0.5" v-for="(word, i) in ($t('home.hero.title_part2') || 'Running Directly from Your Phone.').split(' ')" :key="'p2-' + i">
                            <span class="hero-word inline-block transform-gpu text-slate-100">{{ word }}</span>
                        </span>
                    </span>
                </h1>

                <!-- Description -->
                <p ref="heroText" class="text-slate-200 text-sm sm:text-base lg:text-lg font-normal leading-relaxed max-w-2xl mb-6 sm:mb-10">
                    {{ $t('home.hero.description') }}
                </p>
                
                <!-- Buttons -->
                <div ref="heroButtons" class="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <NuxtLink to="/auth/register"
                        class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(183,251,35,0.39)] hover:shadow-[0_6px_20px_rgba(183,251,35,0.23)] hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                        <Icon icon="ph:trophy-bold" class="text-base" />
                        <span>{{ $t('home.hero.cta_primary') }}</span>
                    </NuxtLink>
                    <NuxtLink to="/tournaments"
                        class="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-8 py-3.5 rounded-xl transition-colors backdrop-blur-md text-center flex items-center justify-center gap-2">
                        <Icon icon="ph:compass-bold" class="text-base text-primary" />
                        <span>{{ $t('home.hero.cta_secondary') || 'Browse Tournaments' }}</span>
                    </NuxtLink>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const heroTitle = ref(null)
const heroText = ref(null)
const heroButtons = ref(null)

onMounted(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } })

    // Animate word-by-word reveal
    tl.from('.hero-word', {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.1,
    })
    // Animate text description fade & slide
    .from(heroText.value, {
        opacity: 0,
        y: 24,
        duration: 0.9,
    }, '-=0.7')
    // Animate buttons
    .from(heroButtons.value, {
        opacity: 0,
        y: 18,
        duration: 0.8,
    }, '-=0.6')
})
</script>

