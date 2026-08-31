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
                <div class="max-w-3xl">
                    <!-- Title -->
                    <!-- Title -->
                    <h1 ref="heroTitle" class="text-white mb-8 drop-shadow-sm">
                        <span class="inline-block overflow-hidden mr-2.5 sm:mr-4 py-1" v-for="(word, i) in $t('home.hero.title_part1').split(' ')" :key="'p1-' + i">
                            <span class="hero-word inline-block transform-gpu">{{ word }}</span>
                        </span>
                        <br />
                        <span class="text-white">
                            <span class="inline-block overflow-hidden mr-2.5 sm:mr-4 py-1" v-for="(word, i) in $t('home.hero.title_part2').split(' ')" :key="'p2-' + i">
                                <span class="hero-word inline-block transform-gpu">{{ word }}</span>
                            </span>
                        </span>
                    </h1>

                    <!-- Description moved below Title -->
                    <p ref="heroText" class="text-white/80 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-12">
                        {{ $t('home.hero.description') }}
                    </p>
                    
                    <!-- Buttons -->
                    <div ref="heroButtons" class="flex flex-col sm:flex-row gap-4">
                        <NuxtLink :to="localePath('/auth/login')"
                            class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(183,251,35,0.39)] hover:shadow-[0_6px_20px_rgba(183,251,35,0.23)] hover:-translate-y-0.5 text-center">
                            {{ $t('home.hero.cta_primary') }}
                        </NuxtLink>
                        <NuxtLink :to="localePath('/about-us')"
                            class="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-8 py-3.5 rounded-xl transition-colors backdrop-blur-md text-center">
                            {{ $t('home.hero.cta_secondary') }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const localePath = useLocalePath()

const heroTitle = ref(null)
const heroText = ref(null)
const heroButtons = ref(null)

onMounted(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } })

    // Animate word-by-word reveal
    tl.from('.hero-word', {
        yPercent: 100,
        stagger: 0.08,
        duration: 1.2,
    })
    // Animate text description fade & slide
    .from(heroText.value, {
        opacity: 0,
        y: 30,
        duration: 1,
    }, '-=0.8')
    // Animate buttons
    .from(heroButtons.value, {
        opacity: 0,
        y: 20,
        duration: 0.8,
    }, '-=0.6')
})
</script>

