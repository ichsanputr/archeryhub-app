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
                <div class="max-w-2xl">
                    <div ref="heroBadge"
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 w-fit mb-6 border border-white/10 backdrop-blur-md opacity-0 translate-y-4">
                        <span class="w-2 h-2 rounded-full bg-primary"></span>
                        <span class="text-white/90 text-xs font-medium tracking-wide uppercase">Platform Panahan
                            No.1 di
                            Indonesia</span>
                    </div>
                    <h1 ref="heroTitle"
                        class="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[1.2] sm:leading-[1.1] mb-4 sm:mb-6 tracking-tight drop-shadow-sm font-display opacity-0 translate-y-8">
                        All in One<br />
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-green-300">Platform
                            Panahan</span><br /> Indonesia
                    </h1>
                    <p ref="heroText"
                        class="text-white/80 text-base sm:text-lg md:text-xl font-light leading-relaxed mb-8 sm:mb-10 max-w-xl drop-shadow-md opacity-0 translate-y-8">
                        Archeryhub.id hadir sebagai wadah bagi seluruh penggiat panahan di Indonesia. Dari pemula
                        hingga juara nasional, di sini kita terhubung lewat event, prestasi, dan semangat yang sama.
                    </p>
                    <div ref="heroButtons" class="flex flex-col sm:flex-row gap-4 opacity-0 translate-y-8">
                        <NuxtLink to="/auth/login"
                            class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-6 py-2.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(183,251,35,0.39)] hover:shadow-[0_6px_20px_rgba(183,251,35,0.23)] hover:-translate-y-0.5 text-center">
                            Mulai Sekarang
                        </NuxtLink>
                        <button
                            class="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors backdrop-blur-md">
                            Cek Fiturnya
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'

const heroBadge = ref(null)
const heroTitle = ref(null)
const heroText = ref(null)
const heroButtons = ref(null)

onMounted(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })

    tl.to(heroBadge.value, { opacity: 1, y: 0, duration: 0.8 }, 0.2)
        .to(heroTitle.value, { opacity: 1, y: 0, duration: 1 }, 0.4)
        .to(heroText.value, { opacity: 1, y: 0, duration: 1 }, 0.6)
        .to(heroButtons.value, { opacity: 1, y: 0, duration: 1 }, 0.8)
})
</script>
