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
                    <h1 ref="heroTitle"
                        class="text-4xl sm:text-7xl font-black text-white leading-[1.1] mb-8 tracking-tight drop-shadow-sm font-display opacity-0 translate-y-8">
                        Digitalize Your<br />
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-green-300">
                            Archery Experience</span>
                    </h1>

                    <!-- Description moved below Title -->
                    <p ref="heroText" class="text-white/80 text-lg sm:text-xl font-light leading-relaxed max-w-2xl mb-12 opacity-0 translate-y-8">
                        Archeris.net adalah platform manajemen panahan terpadu yang dirancang khusus untuk memudahkan pengelolaan turnamen, skoring real-time, dan pengembangan ekosistem olahraga panahan di Indonesia.
                    </p>
                    
                    <!-- Buttons -->
                    <div ref="heroButtons" class="flex flex-col sm:flex-row gap-4 opacity-0 translate-y-8">
                        <NuxtLink to="/auth/login"
                            class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-8 py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(183,251,35,0.39)] hover:shadow-[0_6px_20px_rgba(183,251,35,0.23)] hover:-translate-y-0.5 text-center">
                            Mulai Sekarang
                        </NuxtLink>
                        <button
                            class="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium px-8 py-3.5 rounded-xl transition-colors backdrop-blur-md">
                            Pelajari Lebih Lanjut
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

const heroTitle = ref(null)
const heroText = ref(null)
const heroButtons = ref(null)

onMounted(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } })

    tl.to(heroTitle.value, { opacity: 1, y: 0, duration: 1 }, 0.2)
        .to(heroText.value, { opacity: 1, y: 0, duration: 1 }, 0.4)
        .to(heroButtons.value, { opacity: 1, y: 0, duration: 1 }, 0.6)
})
</script>

