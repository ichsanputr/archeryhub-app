<template>
    <section ref="sectionRef" class="relative py-24 sm:py-32 bg-white overflow-hidden">
        <!-- Background ambient glows -->
        <div class="absolute inset-0 pointer-events-none">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/5 blur-[120px] rounded-full"></div>
            <div class="absolute bottom-0 right-0 w-[400px] h-[400px] bg-navy/5 blur-[100px] rounded-full"></div>
        </div>

        <!-- Decorative vector watermarks -->
        <div class="absolute bottom-0 right-0 w-[180px] sm:w-[280px] md:w-[350px] opacity-15 pointer-events-none transform translate-y-8 translate-x-8 z-0">
            <img src="/vector-pricing-1.png" alt="Pricing Vector Right" class="w-full h-auto object-contain select-none pointer-events-none" />
        </div>
        <div class="absolute bottom-0 left-0 w-[180px] sm:w-[280px] md:w-[350px] opacity-15 pointer-events-none transform translate-y-8 -translate-x-8 z-0">
            <img src="/vector-pricing-2.png" alt="Pricing Vector Left" class="w-full h-auto object-contain select-none pointer-events-none" />
        </div>

        <div class="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16 sm:mb-20">
                <span class="inline-block px-4 py-1.5 bg-primary text-navy text-[10px] font-black tracking-[0.2em] rounded-md mb-6 reveal-badge">
                    Pricing
                </span>
                <h2 class="text-navy font-black font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6 reveal-title">
                    {{ $t('home.pricing.title') }}
                </h2>
                <p class="text-navy/50 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed reveal-desc">
                    {{ $t('home.pricing.description') }}
                </p>
            </div>

            <!-- Pricing Cards Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-5xl mx-auto">

                <!-- Standard Plan — dark navy like Elite -->
                <div class="reveal-card group relative bg-navy rounded-[2rem] p-8 flex flex-col justify-between border border-white/5 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                    <!-- Ambient glow -->
                    <div class="absolute -top-16 -right-16 w-48 h-48 bg-white/5 blur-[60px] rounded-full pointer-events-none"></div>
                    <!-- Dot pattern -->
                    <div class="absolute inset-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                    <div class="relative z-10">
                        <!-- Plan badge -->
                        <div class="flex items-center justify-between mb-8">
                            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/8 text-white/70 text-[10px] font-black tracking-[0.15em] rounded-lg capitalize border border-white/10">
                                <span class="w-1.5 h-1.5 rounded-full bg-white/40"></span>
                                {{ $t('home.pricing.standard.name') }}
                            </span>
                        </div>

                        <!-- Price -->
                        <div class="mb-6">
                            <div class="flex items-baseline gap-1 mb-2">
                                <span class="text-sm font-bold text-white/30">{{ $t('home.pricing.standard.currency') }}</span>
                                <span class="text-5xl font-black text-white font-display tracking-tight">{{ $t('home.pricing.standard.price') }}</span>
                            </div>
                            <span class="text-white/30 text-xs font-semibold tracking-wider">{{ $t('home.pricing.standard.period') }}</span>
                            <p class="mt-4 text-white/45 text-sm leading-relaxed font-light">
                                {{ $t('home.pricing.standard.desc') }}
                            </p>
                        </div>

                        <!-- Divider -->
                        <div class="h-px bg-white/8 mb-6"></div>

                        <!-- Features -->
                        <ul class="space-y-3.5 mb-8">
                            <li v-for="feature in standardFeatures" :key="feature" class="flex items-start gap-3">
                                <div class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-none mt-0.5 border border-white/15">
                                    <Icon icon="ph:check-bold" class="text-white/70 text-[10px]" />
                                </div>
                                <span class="text-sm text-white/55 leading-snug">{{ feature }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- CTA -->
                    <NuxtLink to="/pricing"
                        class="group/btn relative z-10 w-full py-4 bg-white/10 hover:bg-white/15 text-white border border-white/15 hover:border-white/25 rounded-xl text-center font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2">
                        <span>{{ $t('home.pricing.standard.cta') }}</span>
                        <Icon icon="ph:arrow-right-bold" class="text-sm transition-transform group-hover/btn:translate-x-1" />
                    </NuxtLink>
                </div>

                <!-- Free / Starter Plan — Center, featured with primary accent -->
                <div class="reveal-card group relative bg-white rounded-[2rem] p-8 flex flex-col justify-between border border-gray-200 hover:border-primary/40 transition-all duration-500 hover:shadow-md hover:-translate-y-1 overflow-hidden shadow-sm">
                    <!-- Top accent bar -->
                    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-t-[2rem]"></div>
                    <!-- Glow behind card -->
                    <div class="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>

                    <div>
                        <!-- Plan badge -->
                        <div class="flex items-center justify-between mb-8">
                            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-navy text-[10px] font-black tracking-[0.15em] rounded-lg capitalize">
                                <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                                {{ $t('home.pricing.free.name') }}
                            </span>
                            <span class="px-2.5 py-1 bg-primary text-navy text-[9px] font-black tracking-widest rounded-md">
                                {{ $t('home.pricing.popular') }}
                            </span>
                        </div>

                        <!-- Price -->
                        <div class="mb-6">
                            <div class="flex items-baseline gap-1 mb-2">
                                <span class="text-sm font-bold text-navy/40">{{ $t('home.pricing.free.currency') }}</span>
                                <span class="text-5xl font-black text-navy font-display tracking-tight">{{ $t('home.pricing.free.price') }}</span>
                            </div>
                            <span class="text-navy/40 text-xs font-semibold tracking-wider">{{ $t('home.pricing.free.period') }}</span>
                            <p class="mt-4 text-navy/55 text-sm leading-relaxed font-light">
                                {{ $t('home.pricing.free.desc') }}
                            </p>
                        </div>

                        <!-- Divider -->
                        <div class="h-px bg-gray-100 mb-6"></div>

                        <!-- Features -->
                        <ul class="space-y-3.5 mb-8">
                            <li v-for="feature in freeFeatures" :key="feature" class="flex items-start gap-3">
                                <div class="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-none mt-0.5">
                                    <Icon icon="ph:check-bold" class="text-navy text-[10px]" />
                                </div>
                                <span class="text-sm text-navy/65 leading-snug">{{ feature }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- CTA -->
                    <NuxtLink to="/pricing"
                        class="group/btn relative w-full py-4 bg-primary text-navy rounded-xl text-center font-black text-sm transition-all duration-300 hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40">
                        <span>{{ $t('home.pricing.free.cta') }}</span>
                        <Icon icon="ph:arrow-right-bold" class="text-sm transition-transform group-hover/btn:translate-x-1" />
                    </NuxtLink>
                </div>

                <!-- Elite Plan — dark navy with primary accents -->
                <div class="reveal-card group relative bg-navy rounded-[2rem] p-8 flex flex-col justify-between border border-white/5 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 overflow-hidden">
                    <!-- Ambient glow inside card -->
                    <div class="absolute -top-16 -right-16 w-48 h-48 bg-primary/15 blur-[60px] rounded-full pointer-events-none"></div>
                    <div class="absolute -bottom-16 -left-16 w-48 h-48 bg-primary/8 blur-[80px] rounded-full pointer-events-none"></div>
                    <!-- Dot pattern overlay -->
                    <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 24px 24px;"></div>

                    <div class="relative z-10">
                        <!-- Plan badge -->
                        <div class="flex items-center justify-between mb-8">
                            <span class="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/15 text-primary text-[10px] font-black tracking-[0.15em] rounded-lg capitalize border border-primary/20">
                                <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                                {{ $t('home.pricing.elite.name') }}
                            </span>
                            <Icon icon="ph:crown-simple-fill" class="text-primary text-xl opacity-60" />
                        </div>

                        <!-- Price -->
                        <div class="mb-6">
                            <div class="flex items-baseline gap-1 mb-2">
                                <span class="text-sm font-bold text-white/30">{{ $t('home.pricing.elite.currency') }}</span>
                                <span class="text-5xl font-black text-white font-display tracking-tight">{{ $t('home.pricing.elite.price') }}</span>
                            </div>
                            <span class="text-white/30 text-xs font-semibold tracking-wider">{{ $t('home.pricing.elite.period') }}</span>
                            <p class="mt-4 text-white/45 text-sm leading-relaxed font-light">
                                {{ $t('home.pricing.elite.desc') }}
                            </p>
                        </div>

                        <!-- Divider -->
                        <div class="h-px bg-white/8 mb-6"></div>

                        <!-- Features -->
                        <ul class="space-y-3.5 mb-8">
                            <li v-for="feature in eliteFeatures" :key="feature" class="flex items-start gap-3">
                                <div class="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-none mt-0.5 border border-primary/30">
                                    <Icon icon="ph:check-bold" class="text-primary text-[10px]" />
                                </div>
                                <span class="text-sm text-white/60 leading-snug">{{ feature }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- CTA -->
                    <NuxtLink to="/pricing"
                        class="group/btn relative z-10 w-full py-4 bg-primary text-navy rounded-xl text-center font-black text-sm transition-all duration-300 hover:bg-primary/90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                        <span>{{ $t('home.pricing.elite.cta') }}</span>
                        <Icon icon="ph:arrow-right-bold" class="text-sm transition-transform group-hover/btn:translate-x-1" />
                    </NuxtLink>
                </div>
            </div>

            <!-- Bottom trust note -->
            <div class="mt-12 text-center reveal-note">
                <p class="text-navy/35 text-sm flex items-center justify-center gap-2">
                    <Icon icon="ph:shield-check-bold" class="text-base text-primary/60" />
                    {{ $t('home.pricing.trust_note') }}
                </p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useI18n } from 'vue-i18n'

const { tm, t } = useI18n()
const sectionRef = ref(null)

onMounted(() => {
    gsap.registerPlugin(ScrollTrigger)
    const el = sectionRef.value
    if (!el) return

    // Safety: ensure cards are visible even if animation doesn't trigger
    const cards = el.querySelectorAll('.reveal-card')
    cards.forEach(c => { c.style.opacity = '1' })

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
            once: true
        }
    })

    tl.from(el.querySelector('.reveal-badge'), {
        opacity: 0, y: 20, duration: 0.6, ease: 'power3.out'
    })
    .from(el.querySelector('.reveal-title'), {
        opacity: 0, y: 30, duration: 0.9, ease: 'power3.out'
    }, '-=0.3')
    .from(el.querySelector('.reveal-desc'), {
        opacity: 0, y: 20, duration: 0.8, ease: 'power3.out'
    }, '-=0.5')
    .from(cards, {
        opacity: 0, y: 40, duration: 0.8, stagger: 0.12, ease: 'power3.out'
    }, '-=0.4')
    .from(el.querySelector('.reveal-note'), {
        opacity: 0, y: 10, duration: 0.6, ease: 'power2.out'
    }, '-=0.3')
})

const resolveMessage = (path, val) => {
    if (typeof val === 'function') {
        return val()
    }
    if (typeof val === 'string') {
        return val
    }
    return t(path)
}

const standardFeatures = computed(() => {
    const list = tm('home.pricing.features.standard') || []
    return Array.isArray(list) ? list.map((item, idx) => resolveMessage(`home.pricing.features.standard.${idx}`, item)) : []
})

const eliteFeatures = computed(() => {
    const list = tm('home.pricing.features.elite') || []
    return Array.isArray(list) ? list.map((item, idx) => resolveMessage(`home.pricing.features.elite.${idx}`, item)) : []
})

const freeFeatures = computed(() => {
    const list = tm('home.pricing.features.free') || []
    return Array.isArray(list) ? list.map((item, idx) => resolveMessage(`home.pricing.features.free.${idx}`, item)) : []
})

</script>

<style scoped>
/* Cards are always visible — GSAP animates from opacity:0 but we reset inline
   so if ScrollTrigger never fires the cards still show */
.reveal-card {
    opacity: 1;
}
</style>
