<template>
    <div class="w-full flex flex-col items-center select-none">
        <!-- ── STACKED CARDS CONTAINER ── -->
        <div class="relative w-full max-w-[440px] sm:max-w-[480px] aspect-[16/11] sm:aspect-[16/11]">
            <!-- Decorative Backing Ambient Glow -->
            <div 
                class="absolute inset-2 rounded-[2rem] bg-gradient-to-tr from-primary/20 to-emerald-400/10 blur-xl -z-10 transition-transform duration-700 pointer-events-none"
                :style="{ transform: `rotate(${activeRotation * 0.5}deg) scale(0.95)` }"
            ></div>

            <!-- Stacked Image Layers -->
            <div 
                v-for="(image, index) in imageList" 
                :key="index"
                class="absolute inset-0 origin-bottom transition-all duration-500 ease-out will-change-transform"
                :class="[
                    isActive(index) ? 'animate-card-bounce' : '',
                ]"
                :style="getStackStyle(index)"
            >
                <div class="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-xl relative group">
                    <img 
                        :src="image" 
                        :alt="`${alt} - Slide ${index + 1}`" 
                        class="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    <!-- Subtle overlay on non-active cards for depth -->
                    <div 
                        class="absolute inset-0 bg-navy/25 transition-opacity duration-300"
                        :class="isActive(index) ? 'opacity-0' : 'opacity-70'"
                    ></div>
                    
                    <!-- Active Card Badge Overlay -->
                    <div v-if="isActive(index)" class="absolute top-3.5 right-3.5 z-20">
                        <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-sm flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                            {{ index + 1 }} / {{ imageList.length }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- ── CONTROLS: ARROWS & PAGINATION PILLS ── -->
        <div class="flex items-center justify-between w-full max-w-[440px] sm:max-w-[480px] mt-10 sm:mt-12 px-2">
            <!-- Pagination Dots / Indicators -->
            <div class="flex items-center gap-1.5">
                <button
                    v-for="(_, index) in imageList"
                    :key="index"
                    @click="setActive(index)"
                    :class="[
                        'h-2 rounded-full transition-all duration-300 cursor-pointer',
                        isActive(index)
                            ? 'w-7 bg-navy shadow-xs'
                            : 'w-2 bg-slate-200 hover:bg-slate-300'
                    ]"
                    :aria-label="`Go to image ${index + 1}`"
                />
            </div>

            <!-- Navigation Arrow Buttons -->
            <div class="flex items-center gap-2">
                <button
                    type="button"
                    @click="handlePrev"
                    class="group/btn w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-navy text-navy hover:text-white border border-slate-200 hover:border-navy shadow-xs hover:shadow-sm flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                    aria-label="Previous Image"
                >
                    <Icon 
                        icon="ph:arrow-left-bold" 
                        class="text-sm sm:text-base transition-transform duration-200 group-hover/btn:-translate-x-0.5" 
                    />
                </button>

                <button
                    type="button"
                    @click="handleNext"
                    class="group/btn w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-navy hover:bg-slate-800 text-white border border-navy shadow-xs hover:shadow-sm flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
                    aria-label="Next Image"
                >
                    <Icon 
                        icon="ph:arrow-right-bold" 
                        class="text-sm sm:text-base text-primary transition-transform duration-200 group-hover/btn:translate-x-0.5" 
                    />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'

const props = defineProps({
    images: {
        type: Array,
        default: () => [
            'https://placehold.co/800x600/0f172a/63c03b?text=Feature+Preview+1',
            'https://placehold.co/800x600/1e293b/38bdf8?text=Feature+Preview+2',
            'https://placehold.co/800x600/0f172a/f59e0b?text=Feature+Preview+3'
        ]
    },
    alt: {
        type: String,
        default: 'Feature preview'
    }
})

const active = ref(0)
const imageList = computed(() => (props.images && props.images.length > 0 ? props.images : [
    'https://placehold.co/800x600/0f172a/63c03b?text=Feature+Preview+1',
    'https://placehold.co/800x600/1e293b/38bdf8?text=Feature+Preview+2',
    'https://placehold.co/800x600/0f172a/f59e0b?text=Feature+Preview+3'
]))

// Subtle, controlled angles for elegant stacked deck effect
const rotations = [-2.5, 2, -1.8, 2.2]

const activeRotation = computed(() => {
    return rotations[active.value % rotations.length]
})

function isActive(index) {
    return active.value === index
}

function handleNext() {
    active.value = (active.value + 1) % imageList.value.length
}

function handlePrev() {
    active.value = (active.value - 1 + imageList.value.length) % imageList.value.length
}

function setActive(index) {
    active.value = index
}

function getStackStyle(index) {
    const total = imageList.value.length
    const offset = (index - active.value + total) % total

    if (offset === 0) {
        // Active front card
        return {
            zIndex: 30,
            opacity: 1,
            transform: 'scale(1) translateY(0px) rotate(0deg)'
        }
    } else if (offset === 1) {
        // Immediate next card behind
        const rot = rotations[index % rotations.length]
        return {
            zIndex: 20,
            opacity: 0.85,
            transform: `scale(0.95) translateY(12px) rotate(${rot}deg)`
        }
    } else if (offset === 2 || offset === total - 1) {
        // Third card in stack
        const rot = (rotations[(index + 1) % rotations.length]) * -0.8
        return {
            zIndex: 10,
            opacity: 0.6,
            transform: `scale(0.90) translateY(22px) rotate(${rot}deg)`
        }
    } else {
        // Deep background hidden cards
        return {
            zIndex: 0,
            opacity: 0,
            transform: 'scale(0.85) translateY(30px) rotate(0deg)'
        }
    }
}
</script>

<style scoped>
@keyframes cardBounce {
    0% {
        transform: translateY(-12px) scale(0.98) rotate(-1deg);
    }
    60% {
        transform: translateY(3px) scale(1.01) rotate(0.5deg);
    }
    100% {
        transform: translateY(0px) scale(1) rotate(0deg);
    }
}

.animate-card-bounce {
    animation: cardBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
