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
            <div class="text-center mb-16 sm:mb-20 px-4 sm:px-6 lg:px-8">
                <h2 class="text-3xl sm:text-5xl font-black text-navy leading-tight mb-6 font-display tracking-tight reveal-title">
                    {{ $t('home.learn.title') }} <br class="hidden sm:block" />
                    <span class="text-navy/70">
                        {{ $t('home.learn.subtitle') }}
                    </span>
                </h2>
                <div class="text-slate-700 text-base sm:text-lg max-w-3xl mx-auto font-light leading-relaxed reveal-desc">
                    {{ $t('home.learn.description') }}
                </div>
            </div>

            <!-- Horizontal Feature Showcase Cards Container -->
            <div class="relative w-full overflow-hidden">
                <!-- Left overlay shadow (fades out from left) -->
                <div class="absolute left-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-r from-[#DEFEBD] via-[#DEFEBD]/90 to-transparent z-20 pointer-events-none"></div>
                
                <!-- Right overlay shadow (fades out from right) -->
                <div class="absolute right-0 top-0 bottom-0 w-12 sm:w-24 md:w-36 bg-gradient-to-l from-[#DEFEBD] via-[#DEFEBD]/90 to-transparent z-20 pointer-events-none"></div>

                <!-- Outer Scrolling Area with Faded Mask Edges -->
                <div ref="scrollContainer" class="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-6 sm:px-16 lg:px-24 pb-12 pt-2">
                    
                    <!-- ── 4 FEATURE CARDS ── -->
                    <NuxtLink
                        v-for="(feature, idx) in features"
                        :key="idx"
                        :to="localePath(feature.link)"
                        class="w-[310px] sm:w-[500px] md:w-[600px] lg:w-[680px] shrink-0 snap-center bg-white border border-slate-100/80 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_32px_rgba(15,23,42,0.04)] hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer block"
                    >
                        <div class="mb-5">
                            <div class="flex items-center justify-between mb-3">
                                <span class="px-3.5 py-1 bg-[#63C03B]/10 border border-[#63C03B]/20 text-[#63C03B] text-[11px] font-black tracking-wider rounded-full inline-block">
                                    {{ $t(feature.tagKey) }}
                                </span>
                                <span class="text-xs font-bold text-slate-400 group-hover:text-[#63C03B] transition-colors flex items-center gap-1">
                                    0{{ idx + 1 }}
                                    <Icon icon="ph:arrow-up-right-bold" class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </span>
                            </div>
                            <h3 class="text-xl sm:text-2xl font-black tracking-tight text-navy leading-snug font-display group-hover:text-[#63C03B] transition-colors">
                                {{ $t(feature.titleKey) }}
                            </h3>
                            <div class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mt-2">
                                {{ $t(feature.descKey) }}
                            </div>
                        </div>
                        <div class="rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative aspect-[16/9] bg-slate-50 mt-auto">
                            <img 
                                :src="feature.image" 
                                :alt="$t(feature.titleKey)" 
                                class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out" 
                                loading="lazy" 
                            />
                        </div>
                    </NuxtLink>
                </div>
            </div>

            <!-- Controls (Scroll Indicators & Prev/Next Arrows) -->
            <div class="flex items-center justify-center gap-4 mt-2">
                <button 
                    @click="scrollPrev"
                    class="w-11 h-11 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700 hover:text-navy hover:border-[#63C03B] hover:shadow transition-all cursor-pointer"
                    aria-label="Previous Feature"
                >
                    <Icon icon="ph:arrow-left-bold" class="w-4 h-4" />
                </button>
                <div class="flex items-center gap-2 px-2">
                    <span 
                        v-for="(_, idx) in features" 
                        :key="idx" 
                        class="w-2.5 h-2.5 rounded-full transition-all duration-300"
                        :class="activeIdx === idx ? 'bg-[#63C03B] w-6' : 'bg-slate-300/80'"
                    />
                </div>
                <button 
                    @click="scrollNext"
                    class="w-11 h-11 rounded-full bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-700 hover:text-navy hover:border-[#63C03B] hover:shadow transition-all cursor-pointer"
                    aria-label="Next Feature"
                >
                    <Icon icon="ph:arrow-right-bold" class="w-4 h-4" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const localePath = useLocalePath()

const features = [
    {
        tagKey: 'home.learn.f1_tag',
        titleKey: 'home.learn.f1_title',
        descKey: 'home.learn.f1_desc',
        image: 'https://placehold.co/1000x562/0f172a/63c03b?text=Tournament+Registration+%26+Payments',
        link: '/dashboard/organizer'
    },
    {
        tagKey: 'home.learn.f2_tag',
        titleKey: 'home.learn.f2_title',
        descKey: 'home.learn.f2_desc',
        image: 'https://placehold.co/1000x562/0f172a/63c03b?text=Tournament+Management+%26+Operations',
        link: '/dashboard/organizer'
    },
    {
        tagKey: 'home.learn.f3_tag',
        titleKey: 'home.learn.f3_title',
        descKey: 'home.learn.f3_desc',
        image: 'https://placehold.co/1000x562/0f172a/63c03b?text=Archer+Profile+%26+Live+Standings',
        link: '/archers'
    },
    {
        tagKey: 'home.learn.f4_tag',
        titleKey: 'home.learn.f4_title',
        descKey: 'home.learn.f4_desc',
        image: 'https://placehold.co/1000x562/0f172a/63c03b?text=Certified+Scorekeeper+Terminal',
        link: '/dashboard/organizer/scorekeepers'
    }
]

const sectionRef = ref(null)
const scrollContainer = ref(null)
const activeIdx = ref(0)
let scrollTimer = null
let ctx = null

const updateActiveIndex = () => {
    const container = scrollContainer.value
    if (!container) return
    const scrollLeft = container.scrollLeft
    const cardWidth = container.children[0]?.offsetWidth || 300
    const gap = 32
    const index = Math.round(scrollLeft / (cardWidth + gap))
    activeIdx.value = Math.max(0, Math.min(features.length - 1, index))
}

const scrollPrev = () => {
    const container = scrollContainer.value
    if (!container) return
    const cardWidth = container.children[0]?.offsetWidth || 400
    container.scrollBy({ left: -(cardWidth + 32), behavior: 'smooth' })
}

const scrollNext = () => {
    const container = scrollContainer.value
    if (!container) return
    const cardWidth = container.children[0]?.offsetWidth || 400
    container.scrollBy({ left: cardWidth + 32, behavior: 'smooth' })
}

onMounted(async () => {
    await nextTick()

    const container = scrollContainer.value
    if (container) {
        container.addEventListener('scroll', updateActiveIndex, { passive: true })
    }

    gsap.registerPlugin(ScrollTrigger)
    const el = sectionRef.value
    if (!el) return

    ctx = gsap.context(() => {
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
    }, el)

    // Center first or second card smoothly
    scrollTimer = window.setTimeout(() => {
        const c = scrollContainer.value
        if (!c) return

        const children = c.children
        if (!children || children.length < 2) return

        const secondChild = children[1]
        const containerWidth = c.clientWidth
        const childWidth = secondChild.clientWidth
        const childOffset = secondChild.offsetLeft
        const scrollPosition = childOffset - (containerWidth / 2) + (childWidth / 2)

        c.scrollTo({
            left: scrollPosition,
            behavior: 'auto'
        })
    }, 150)
})

onBeforeUnmount(() => {
    const container = scrollContainer.value
    if (container) {
        container.removeEventListener('scroll', updateActiveIndex)
    }

    if (scrollTimer) {
        clearTimeout(scrollTimer)
        scrollTimer = null
    }

    ctx?.revert()
    ctx = null
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
