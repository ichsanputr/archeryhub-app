<template>
    <!-- Precision Ecosystem Features -->
    <section ref="sectionRef" class="relative bg-white py-12 sm:py-24 md:py-32 overflow-hidden border-b border-gray-100">
        <!-- Background Glow/Patterns -->
        <div class="absolute inset-0 pointer-events-none opacity-20">
            <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full"></div>
            <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-navy/5 blur-[120px] rounded-full"></div>
        </div>

        <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <!-- Desktop: Left Column (Image Slider) -->
                <div v-if="!isMobile" class="lg:col-span-1 relative order-1 lg:order-1">
                    <!-- Main Feature Image with Description Overlay -->
                    <div
                        class="relative w-full aspect-video md:aspect-[4/3] lg:aspect-square rounded-[2rem] bg-navy overflow-hidden shadow-2xl group border border-white/5">
                        <!-- Background Image -->
                        <img :src="featureItems[activeFeature].image" :alt="featureItems[activeFeature].title"
                            class="w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.05]" />

                        <!-- Static Overlays -->
                        <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent"></div>
                        <div class="absolute inset-0 abstract-pattern opacity-5"></div>
                        <div class="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 blur-[80px] rounded-full">
                        </div>

                        <!-- Dynamic Content Overlay -->
                        <div class="absolute inset-0 p-6 sm:p-8 md:p-12 flex flex-col justify-end">
                            <Transition mode="out-in" enter-active-class="transition duration-500 ease-out"
                                enter-from-class="opacity-0 translate-y-8" enter-to-class="opacity-100 translate-y-0"
                                leave-active-class="transition duration-300 ease-in"
                                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-8">
                                <div :key="activeFeature" class="max-w-xl">
                                    <h3
                                        class="text-xl sm:text-2xl lg:text-5xl font-black text-white mb-2 sm:mb-4 font-display leading-tight">
                                        {{ featureItems[activeFeature].title }}
                                    </h3>
                                    <div class="text-white/80 text-sm sm:text-base leading-relaxed font-light">
                                        {{ featureItems[activeFeature].longDescription }}
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>
                </div>

                <!-- Right: Features List -->
                <div class="lg:col-span-1 flex flex-col gap-6 md:gap-8 order-2">
                    <div class="space-y-4 sm:space-y-5">
                        <span
                            class="inline-block py-1 px-3 bg-primary text-navy text-[10px] font-black tracking-[0.2em] rounded-md uppercase">
                            {{ $t('home.features_ecosystem.badge') }}
                        </span>
                        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-navy leading-[1.1] font-display">
                            {{ $t('home.features_ecosystem.title') }} <span
                                class="text-transparent bg-clip-text bg-gradient-to-r from-navy to-navy/40">{{ $t('home.features_ecosystem.title_highlight') }}</span>
                        </h2>
                        <div class="text-sm sm:text-base lg:text-lg text-text-sub leading-relaxed max-w-md">
                            {{ $t('home.features_ecosystem.description') }}
                        </div>
                    </div>

                    <!-- Mobile: Main Feature Image with Description Overlay -->
                    <div v-if="isMobile"
                        class="relative w-full aspect-video rounded-3xl bg-navy overflow-hidden shadow-sm border border-white/5 animate-fade-in">
                        <!-- Background Image -->
                        <img :src="featureItems[activeFeature].image" :alt="featureItems[activeFeature].title"
                            class="w-full h-full object-cover opacity-60 scale-[1.05]" />

                        <!-- Static Overlays -->
                        <div class="absolute inset-0 bg-gradient-to-t from-navy transition-all duration-500"
                            :style="{ opacity: activeFeature >= 0 ? 0.9 : 0.6 }"></div>

                        <!-- Dynamic Content Overlay (Mobile View) -->
                        <div class="absolute inset-0 p-6 flex flex-col justify-end">
                            <Transition mode="out-in" enter-active-class="transition duration-300 ease-out"
                                enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
                                leave-active-class="transition duration-200 ease-in"
                                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
                                <div :key="activeFeature">
                                    <h3 class="text-xl font-black text-white mb-2 font-display">
                                        {{ featureItems[activeFeature].title }}
                                    </h3>
                                    <div class="text-white/80 text-xs leading-relaxed line-clamp-3">
                                        {{ featureItems[activeFeature].longDescription }}
                                    </div>
                                </div>
                            </Transition>
                        </div>
                    </div>

                    <!-- Interactive Feature Cards (4 Ecosystem Pillars) -->
                    <div class="relative">
                        <div
                            class="flex flex-col gap-3 max-h-[460px] px-1 sm:max-h-[520px] overflow-y-auto pr-2 sm:pr-3 custom-scrollbar">
                            <div v-for="(feature, idx) in featureItems" :key="idx"
                                @click="setFeature(idx)"
                                class="group relative overflow-hidden flex items-center p-4 py-4 sm:p-5 sm:py-5 rounded-xl sm:rounded-2xl border transition-all duration-300 cursor-pointer"
                                :class="activeFeature === idx ? 'bg-navy border-navy ring-1 sm:ring-2 ring-primary ring-offset-2 shadow-sm scale-[1.01]' : 'bg-white border-gray-100 hover:border-primary/50 hover:shadow-sm'">
                                <div v-if="activeFeature === idx" class="progress-bar" :style="{ width: progress + '%' }">
                                </div>
                                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 transition-colors duration-300 flex-shrink-0"
                                    :class="activeFeature === idx ? 'bg-primary text-navy' : 'bg-gray-50 text-navy group-hover:bg-primary'">
                                    <Icon :icon="feature.icon" class="text-xl sm:text-2xl" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="text-sm sm:text-base lg:text-lg font-bold transition-colors duration-300 truncate"
                                        :class="activeFeature === idx ? 'text-white' : 'text-navy'">
                                        {{ feature.title }}
                                    </h4>
                                    <div v-if="activeFeature === idx"
                                        class="text-white/70 text-[11px] sm:text-xs mt-0.5 animate-fade-in line-clamp-1 font-light">
                                        {{ feature.description }}
                                    </div>
                                </div>
                                <Icon icon="ph:caret-right-bold"
                                    class="text-lg sm:text-xl transition-all duration-300 flex-shrink-0"
                                    :class="activeFeature === idx ? 'text-primary opacity-100 translate-x-1' : 'text-gray-200 opacity-20'" />
                            </div>
                        </div>
                        <!-- Bottom Fade Overlay -->
                        <div
                            class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const activeFeature = ref(0)
const isMobile = ref(false)
const progress = ref(0)
let timer = null

const featureItems = computed(() => [
    {
        title: t('home.features_ecosystem.f1_title'),
        icon: 'ph:ticket-bold',
        description: t('home.features_ecosystem.f1_desc'),
        longDescription: t('home.features_ecosystem.f1_long'),
        image: '/features/feature_registration.png'
    },
    {
        title: t('home.features_ecosystem.f2_title'),
        icon: 'ph:tree-structure-bold',
        description: t('home.features_ecosystem.f2_desc'),
        longDescription: t('home.features_ecosystem.f2_long'),
        image: '/features/feature-target-management.png'
    },
    {
        title: t('home.features_ecosystem.f3_title'),
        icon: 'ph:device-mobile-bold',
        description: t('home.features_ecosystem.f3_desc'),
        longDescription: t('home.features_ecosystem.f3_long'),
        image: '/features/feature_profile.png'
    },
    {
        title: t('home.features_ecosystem.f4_title'),
        icon: 'ph:crosshair-simple-bold',
        description: t('home.features_ecosystem.f4_desc'),
        longDescription: t('home.features_ecosystem.f4_long'),
        image: '/features/feature_scoring.png'
    }
])

const startTimer = () => {
    if (timer) clearInterval(timer)
    progress.value = 0
    timer = setInterval(() => {
        progress.value += 2
        if (progress.value >= 100) {
            nextFeature()
        }
    }, 100)
}

const nextFeature = () => {
    activeFeature.value = (activeFeature.value + 1) % featureItems.value.length
    progress.value = 0
}

const setFeature = (idx) => {
    activeFeature.value = idx
    startTimer()
}

const sectionRef = ref(null)
const isVisible = ref(false)

const checkMobile = () => {
    isMobile.value = window.innerWidth < 1024
}

useIntersectionObserver(
    sectionRef,
    ([{ isIntersecting }]) => {
        isVisible.value = isIntersecting
    },
    { threshold: 0.2 }
)

watch(isVisible, (visible) => {
    if (visible) {
        startTimer()
    } else {
        if (timer) clearInterval(timer)
    }
})

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
    if (timer) clearInterval(timer)
})
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 2px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
}

.progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: #D91629;
    /* Primary */
    transition: width 0.1s linear;
}

.abstract-pattern {
    background-image: radial-gradient(circle at 2px 2px, rgba(0, 0, 0, 0.1) 1px, transparent 0);
    background-size: 24px 24px;
}

/* Animations */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
}
</style>

