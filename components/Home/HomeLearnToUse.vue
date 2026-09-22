<template>
    <section ref="sectionRef" class="py-20 sm:py-28 bg-[#DEFEBD] overflow-hidden relative select-none">
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
            <div class="text-center mb-10 sm:mb-14 px-4 sm:px-6 lg:px-8">
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

            <!-- Horizontal Circular 3D Carousel Stage -->
            <div 
                class="relative w-full overflow-hidden h-[580px] sm:h-[680px] md:h-[730px] lg:h-[770px] flex items-center justify-center cursor-grab active:cursor-grabbing"
                @touchstart="handleTouchStart"
                @touchmove="handleTouchMove"
                @touchend="handleTouchEnd"
                @mousedown="handleMouseDown"
                @mousemove="handleMouseMove"
                @mouseup="handleMouseUp"
                @mouseleave="handleMouseUp"
            >
                <!-- Left overlay gradient mask -->
                <div class="absolute left-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-r from-[#DEFEBD] via-[#DEFEBD]/80 to-transparent z-30 pointer-events-none"></div>
                
                <!-- Right overlay gradient mask -->
                <div class="absolute right-0 top-0 bottom-0 w-8 sm:w-20 md:w-32 bg-gradient-to-l from-[#DEFEBD] via-[#DEFEBD]/80 to-transparent z-30 pointer-events-none"></div>

                <!-- Circular Cards Stage -->
                <div class="relative w-full h-full max-w-[1400px] mx-auto flex items-center justify-center">
                    <div
                        v-for="(feature, idx) in features"
                        :key="idx"
                        :style="getCardStyle(idx)"
                        @click="handleCardClick(idx)"
                        class="absolute top-1/2 left-1/2 w-[84vw] sm:w-[480px] md:w-[540px] lg:w-[600px] bg-white border border-slate-100/90 rounded-[28px] sm:rounded-[36px] p-5 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group will-change-transform"
                    >
                        <!-- Card Header Content -->
                        <div class="mb-4 sm:mb-5">
                            <div class="flex items-center justify-between mb-2.5 sm:mb-3">
                                <span class="px-3.5 py-1 bg-[#63C03B]/10 border border-[#63C03B]/20 text-[#63C03B] text-[11px] sm:text-xs font-black tracking-wider rounded-full inline-block">
                                    {{ $t(feature.tagKey) }}
                                </span>
                                <NuxtLink 
                                    v-if="activeIdx === idx"
                                    :to="localePath(feature.link)"
                                    class="text-xs font-bold text-slate-400 hover:text-[#63C03B] transition-colors flex items-center gap-1.5"
                                >
                                    <span>0{{ idx + 1 }}</span>
                                    <Icon icon="ph:arrow-up-right-bold" class="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </NuxtLink>
                                <span v-else class="text-xs font-bold text-slate-400">
                                    0{{ idx + 1 }}
                                </span>
                            </div>

                            <h3 class="text-lg sm:text-xl md:text-2xl font-black tracking-tight text-navy leading-snug font-display group-hover:text-[#63C03B] transition-colors">
                                {{ $t(feature.titleKey) }}
                            </h3>
                            <div class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mt-1.5 line-clamp-2">
                                {{ $t(feature.descKey) }}
                            </div>
                        </div>

                        <!-- Card Video Screen Container (Strictly 1:1 Square) -->
                        <div class="rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-100 shadow-inner relative w-full aspect-square bg-[#ECEBE6] mt-auto">
                            <video 
                                :ref="el => setVideoRef(el, idx)"
                                loop 
                                muted 
                                playsinline 
                                preload="none"
                                :poster="feature.poster"
                                class="w-full h-full object-cover"
                            >
                                <source :src="feature.video" type="video/mp4" />
                            </video>

                            <!-- Inner gray border overlay -->
                            <div class="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl border border-gray-300/90 z-10"></div>

                            <!-- Side card click overlay / dimmer -->
                            <div 
                                v-if="activeIdx !== idx"
                                class="absolute inset-0 bg-slate-900/10 hover:bg-transparent transition-colors duration-300 flex items-center justify-center cursor-pointer z-20"
                            >
                                <span class="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-navy text-[11px] font-bold shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    Click to view
                                </span>
                            </div>
                        </div>
                    </div>
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
                    <button 
                        v-for="(_, idx) in features" 
                        :key="idx" 
                        @click="setActive(idx)"
                        class="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                        :class="activeIdx === idx ? 'bg-[#63C03B] w-7' : 'bg-slate-300/80 hover:bg-slate-400 w-2.5'"
                        :aria-label="`Go to feature ${idx + 1}`"
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
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { Icon } from '@iconify/vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const localePath = useLocalePath()

const features = [
    {
        tagKey: 'home.learn.f1_tag',
        titleKey: 'home.learn.f1_title',
        descKey: 'home.learn.f1_desc',
        video: '/registration.mp4',
        poster: '/features/feature_registration.webp',
        link: '/dashboard/organizer'
    },
    {
        tagKey: 'home.learn.f2_tag',
        titleKey: 'home.learn.f2_title',
        descKey: 'home.learn.f2_desc',
        video: '/competition.mp4',
        poster: '/features/feature_competition.webp',
        link: '/dashboard/organizer'
    },
    {
        tagKey: 'home.learn.f3_tag',
        titleKey: 'home.learn.f3_title',
        descKey: 'home.learn.f3_desc',
        video: '/archer.mp4',
        poster: '/features/feature_archer.webp',
        link: '/archers'
    },
    {
        tagKey: 'home.learn.f4_tag',
        titleKey: 'home.learn.f4_title',
        descKey: 'home.learn.f4_desc',
        video: '/scorekeeper.mp4',
        poster: '/features/feature_scorekeeper.webp',
        link: '/dashboard/organizer/scorekeepers'
    }
]

const sectionRef = ref(null)
// Default center card is #2 (index 1) as requested
const activeIdx = ref(1)
const videoRefs = ref([])

const setVideoRef = (el, idx) => {
    if (el) videoRefs.value[idx] = el
}

// Circular offset calculation for 4 items: returns -2, -1, 0, 1, 2
const getOffset = (idx) => {
    const N = features.length
    let diff = (idx - activeIdx.value) % N
    if (diff > N / 2) diff -= N
    if (diff < -N / 2) diff += N
    return diff
}

const getCardStyle = (idx) => {
    const offset = getOffset(idx)
    const isCenter = offset === 0
    const isLeft = offset === -1
    const isRight = offset === 1
    const isHidden = Math.abs(offset) >= 2

    let tx = 0
    let scale = 1
    let opacity = 1
    let zIndex = 20
    let shadow = '0 10px 30px -10px rgba(15,23,42,0.06)'

    if (isCenter) {
        tx = 0
        scale = 1
        opacity = 1
        zIndex = 25
        shadow = '0 25px 60px -15px rgba(15,23,42,0.18)'
    } else if (isLeft) {
        // Positioned so ~50% is peeked on the left side
        tx = -68
        scale = 0.88
        opacity = 0.65
        zIndex = 15
        shadow = '0 12px 35px -10px rgba(15,23,42,0.08)'
    } else if (isRight) {
        // Positioned so ~50% is peeked on the right side
        tx = 68
        scale = 0.88
        opacity = 0.65
        zIndex = 15
        shadow = '0 12px 35px -10px rgba(15,23,42,0.08)'
    } else {
        tx = offset < 0 ? -130 : 130
        scale = 0.72
        opacity = 0
        zIndex = 0
    }

    return {
        transform: `translate(calc(-50% + ${tx}%), -50%) scale(${scale})`,
        opacity,
        zIndex,
        boxShadow: shadow,
        pointerEvents: isCenter || isLeft || isRight ? 'auto' : 'none',
        cursor: isCenter ? 'default' : 'pointer'
    }
}

// Single active video player controller: only the center card plays
const updateVideoPlayback = () => {
    videoRefs.value.forEach((videoEl, i) => {
        if (!videoEl) return
        if (i === activeIdx.value) {
            videoEl.currentTime = 0
            const playPromise = videoEl.play()
            if (playPromise !== undefined) {
                playPromise.catch(() => {})
            }
        } else {
            videoEl.pause()
        }
    })
}

const setActive = (idx) => {
    activeIdx.value = idx
}

const scrollPrev = () => {
    activeIdx.value = (activeIdx.value - 1 + features.length) % features.length
}

const scrollNext = () => {
    activeIdx.value = (activeIdx.value + 1) % features.length
}

const handleCardClick = (idx) => {
    if (activeIdx.value !== idx) {
        setActive(idx)
    }
}

// Touch & Mouse Drag / Swipe Handlers
let touchStartX = 0
let touchEndX = 0
let isDragging = false

const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX
    touchEndX = touchStartX
}

const handleTouchMove = (e) => {
    touchEndX = e.touches[0].clientX
}

const handleTouchEnd = () => {
    const deltaX = touchEndX - touchStartX
    if (deltaX > 45) {
        scrollPrev()
    } else if (deltaX < -45) {
        scrollNext()
    }
}

const handleMouseDown = (e) => {
    isDragging = true
    touchStartX = e.clientX
    touchEndX = touchStartX
}

const handleMouseMove = (e) => {
    if (!isDragging) return
    touchEndX = e.clientX
}

const handleMouseUp = () => {
    if (!isDragging) return
    isDragging = false
    const deltaX = touchEndX - touchStartX
    if (deltaX > 45) {
        scrollPrev()
    } else if (deltaX < -45) {
        scrollNext()
    }
}

watch(activeIdx, () => {
    nextTick(() => {
        updateVideoPlayback()
    })
})

let ctx = null

onMounted(async () => {
    await nextTick()
    updateVideoPlayback()

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
})

onBeforeUnmount(() => {
    videoRefs.value.forEach(v => {
        if (v) v.pause()
    })
    ctx?.revert()
    ctx = null
})
</script>

<style scoped></style>
