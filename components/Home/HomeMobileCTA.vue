<template>
    <section ref="sectionRef" class="py-24 bg-[#DEFEBD] overflow-hidden relative">
        <!-- Subtle Stripes SVG Overlay (Left Background - Navy) -->
        <svg class="absolute -top-12 -left-20 h-[120%] w-auto text-navy pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 765 1186" xml:space="preserve">
            <path fill="currentColor" style="opacity: 0.04;" d="M122,1186H0L406-31h122L122,1186z M765-31H643L237,1186h122L765-31z"></path>
        </svg>

        <!-- Elegant Archery Target Face Vector Grid (Right Background - Brand Green) -->
        <svg class="absolute -right-32 -bottom-32 h-[155%] w-auto text-[#63C03B]/20 pointer-events-none" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <!-- Precise Target Rings -->
            <circle cx="400" cy="400" r="360" fill="none" stroke="currentColor" stroke-width="1.5" />
            <circle cx="400" cy="400" r="300" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="400" cy="400" r="240" fill="none" stroke="currentColor" stroke-width="3" />
            <circle cx="400" cy="400" r="180" fill="none" stroke="currentColor" stroke-width="4.5" />
            <circle cx="400" cy="400" r="120" fill="none" stroke="currentColor" stroke-width="6" />
            <circle cx="400" cy="400" r="60" fill="none" stroke="currentColor" stroke-width="8" />
            <circle cx="400" cy="400" r="15" fill="currentColor" />
            
            <!-- Standard Target Crosshairs (Dotted) -->
            <line x1="400" y1="20" x2="400" y2="780" stroke="currentColor" stroke-width="1" stroke-dasharray="8 8" />
            <line x1="20" y1="400" x2="780" y2="400" stroke="currentColor" stroke-width="1" stroke-dasharray="8 8" />
            
            <!-- Target Ring Score Indicators (1, 3, 5, 7, 9) in monospace -->
            <text x="400" y="90" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">1</text>
            <text x="400" y="150" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">3</text>
            <text x="400" y="210" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">5</text>
            <text x="400" y="270" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">7</text>
            <text x="400" y="330" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">9</text>
            
            <text x="400" y="720" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">1</text>
            <text x="400" y="660" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">3</text>
            <text x="400" y="600" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">5</text>
            <text x="400" y="540" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">7</text>
            <text x="400" y="480" font-family="monospace" font-size="10" font-weight="bold" fill="currentColor" text-anchor="middle">9</text>
        </svg>

        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <!-- Text Content -->
                <div class="order-2 lg:order-1">
                    <h2
                        class="text-4xl sm:text-6xl font-black text-navy leading-tight mb-8 font-display tracking-tighter reveal-title">
                        {{ $t('home.mobile.title1') }}<br />
                        {{ $t('home.mobile.title2') }}
                    </h2>
                    <div class="text-navy/70 text-lg sm:text-xl font-light leading-relaxed mb-10 max-w-xl reveal-desc">
                        {{ $t('home.mobile.description') }}
                    </div>

                    <div class="flex flex-wrap gap-4">
                        <a href="#"
                            class="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl">
                            <Icon icon="ic:baseline-apple" class="text-2xl" />
                            <div class="text-left">
                                <div class="text-[10px] font-bold opacity-60 leading-none">Download on the</div>
                                <div class="text-lg font-bold leading-none">App Store</div>
                            </div>
                        </a>
                        <a href="#"
                            class="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-2xl hover:scale-105 transition-transform shadow-xl">
                            <Icon icon="logos:google-play-icon" class="text-2xl" />
                            <div class="text-left">
                                <div class="text-[10px] font-bold opacity-60 leading-none">Get it on</div>
                                <div class="text-lg font-bold leading-none">Google Play</div>
                            </div>
                        </a>
                    </div>
                </div>

                <!-- Image Mockup -->
                <div class="order-1 lg:order-2 flex justify-center lg:justify-end">
                    <div class="relative w-full max-w-[500px]">
                        <img src="/archery_mobile_app_download_1778934899178.png" alt="Archeris Mobile App"
                            class="w-full h-auto object-contain drop-shadow-lg" />
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
})
</script>

<style scoped></style>
