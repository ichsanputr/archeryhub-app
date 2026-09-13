<template>
    <section class="relative w-full h-screen overflow-hidden">
        <div class="absolute inset-0 w-full h-full">
            <img alt="Professional archer aiming at target" class="w-full h-full object-cover object-center"
                src="/hero-homepage.jpeg" />
            <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-transparent"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-90">
            </div>
        </div>
        <div class="relative z-10 w-full h-full flex items-center">
            <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <!-- Title -->
                <h1 ref="heroTitle" class="text-white mb-6 drop-shadow-sm font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] font-display">
                    <span class="inline-block overflow-hidden mr-2.5 sm:mr-3.5 py-0.5" v-for="(word, i) in ($t('home.hero.title_part1') || 'Archery Event Management').split(' ')" :key="'p1-' + i">
                        <span class="hero-word inline-block transform-gpu">{{ word }}</span>
                    </span>
                    <br />
                    <span class="text-white">
                        <span class="inline-block overflow-hidden mr-2.5 sm:mr-3.5 py-0.5" v-for="(word, i) in ($t('home.hero.title_part2') || '& Live Scoring Platform').split(' ')" :key="'p2-' + i">
                            <span class="hero-word inline-block transform-gpu">{{ word }}</span>
                        </span>
                    </span>
                </h1>

                <!-- Description -->
                <p ref="heroText" class="text-white/80 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mb-10">
                    {{ $t('home.hero.description') }}
                </p>
                
                <!-- Buttons -->
                <div ref="heroButtons" class="flex flex-col sm:flex-row gap-4">
                    <NuxtLink to="/auth/register"
                        class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(183,251,35,0.39)] hover:shadow-[0_6px_20px_rgba(183,251,35,0.23)] hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                        <Icon icon="ph:trophy-bold" class="text-base" />
                        <span>{{ $t('home.hero.cta_primary') }}</span>
                    </NuxtLink>
                    <NuxtLink to="/events"
                        class="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-8 py-3.5 rounded-xl transition-colors backdrop-blur-md text-center flex items-center justify-center gap-2">
                        <Icon icon="ph:compass-bold" class="text-base text-primary" />
                        <span>{{ $t('home.hero.cta_secondary') }}</span>
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

