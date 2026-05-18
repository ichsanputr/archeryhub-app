<template>
  <div v-if="isActive && spotlightRect" class="absolute inset-0 z-[999] pointer-events-none select-none">
    <!-- Spotlight SVG overlay -->
    <svg class="fixed inset-0 w-full h-full pointer-events-none z-[998]">
      <defs>
        <mask id="tour-spotlight-mask">
          <!-- The white region keeps the dark overlay -->
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <!-- The black region cuts out the spotlight -->
          <rect
            :x="spotlightRect.left - padding"
            :y="spotlightRect.top - padding"
            :width="spotlightRect.width + padding * 2"
            :height="spotlightRect.height + padding * 2"
            :rx="radius"
            fill="black"
            class="transition-all duration-300 ease-out"
          />
        </mask>
      </defs>
      <!-- Semi-transparent overlay blocking background interaction -->
      <rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="rgba(15, 23, 42, 0.75)"
        mask="url(#tour-spotlight-mask)"
        class="pointer-events-auto"
      />
    </svg>

    <!-- Interactive spotlight helper overlay to capture focus of element -->
    <div
      class="fixed border-2 border-primary pointer-events-none transition-all duration-300 ease-out z-[999]"
      :style="{
        left: `${spotlightRect.left - padding}px`,
        top: `${spotlightRect.top - padding}px`,
        width: `${spotlightRect.width + padding * 2}px`,
        height: `${spotlightRect.height + padding * 2}px`,
        borderRadius: `${radius}px`
      }"
    >
      <!-- Pulsing border ring -->
      <div class="absolute inset-0 border border-primary animate-ping opacity-75" :style="{ borderRadius: `${radius}px` }"></div>
    </div>

    <!-- Floating Tour Card -->
    <div
      ref="cardRef"
      class="absolute pointer-events-auto z-[1000] w-80 max-w-[calc(100vw-32px)] bg-navy text-white p-5 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4 transition-all duration-300 ease-out"
      :style="cardStyle"
    >
      <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between mb-1">
          <span class="text-[9px] font-black text-primary uppercase tracking-[0.2em]">
            Step {{ currentStepIndex + 1 }} of {{ steps.length }}
          </span>
          <button @click="skipTour" class="text-xs font-bold text-slate-400 hover:text-white transition-colors">
            Skip
          </button>
        </div>
        <h4 class="text-sm font-black text-white leading-snug uppercase tracking-tight">{{ currentStep?.title }}</h4>
        <p class="text-xs text-slate-300 leading-relaxed font-medium mt-1">{{ currentStep?.description }}</p>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-white/10">
        <button
          v-if="!isFirstStep"
          @click="prevStep"
          class="flex items-center gap-1.5 text-[10px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-wider"
        >
          <Icon icon="ph:arrow-left-bold" />
          Back
        </button>
        <div v-else></div>

        <button
          @click="nextStep"
          class="px-4 py-2 bg-primary hover:bg-white text-navy font-black text-[10px] rounded-xl transition-all uppercase tracking-widest flex items-center gap-1.5 shadow-md shadow-primary/20 active:scale-95"
        >
          <span>{{ isLastStep ? 'Finish' : 'Next' }}</span>
          <Icon :icon="isLastStep ? 'ph:check-bold' : 'ph:arrow-right-bold'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useTour } from '~/composables/useTour'

const padding = 8
const radius = 12
const cardRef = ref(null)
const spotlightRect = ref(null)
const cardStyle = ref({})

const { isActive, currentStep, currentStepIndex, isFirstStep, isLastStep, steps, nextStep, prevStep, skipTour } = useTour()

const updatePosition = () => {
  if (!isActive.value || !currentStep.value) return

  const targetEl = document.querySelector(currentStep.value.target)
  if (!targetEl) {
    // If target element is not found, fallback to centering on screen
    spotlightRect.value = {
      left: window.innerWidth / 2,
      top: window.innerHeight / 2 - 100,
      width: 0,
      height: 0
    }
    cardStyle.value = {
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      position: 'fixed'
    }
    return
  }

  // Element found
  const rect = targetEl.getBoundingClientRect()
  spotlightRect.value = rect

  // Scroll into view if needed
  targetEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' })

  // Recalculate rect in case scrolling shifted it
  nextTick(() => {
    const updatedRect = targetEl.getBoundingClientRect()
    spotlightRect.value = updatedRect

    const placement = currentStep.value.placement || 'bottom'
    const cardW = 320
    const cardH = 180 // approximate/auto

    let top = 0
    let left = 0
    let transform = ''

    if (placement === 'bottom') {
      top = updatedRect.bottom + padding + 12
      left = updatedRect.left + updatedRect.width / 2
      transform = 'translateX(-50%)'
    } else if (placement === 'top') {
      top = updatedRect.top - cardH - padding - 12
      left = updatedRect.left + updatedRect.width / 2
      transform = 'translateX(-50%)'
    } else if (placement === 'left') {
      top = updatedRect.top + updatedRect.height / 2
      left = updatedRect.left - cardW - padding - 12
      transform = 'translateY(-50%)'
    } else if (placement === 'right') {
      top = updatedRect.top + updatedRect.height / 2
      left = updatedRect.right + padding + 12
      transform = 'translateY(-50%)'
    }

    // Boundary checks
    const viewportW = window.innerWidth
    const viewportH = window.innerHeight

    if (left - cardW / 2 < 16) {
      left = 16
      transform = 'none'
    } else if (left + cardW / 2 > viewportW - 16) {
      left = viewportW - cardW - 16
      transform = 'none'
    }

    if (top < 16) {
      top = updatedRect.bottom + padding + 12
    } else if (top + cardH > viewportH - 16) {
      top = updatedRect.top - cardH - padding - 12
    }

    cardStyle.value = {
      top: `${top + window.scrollY}px`,
      left: `${left + window.scrollX}px`,
      transform,
      position: 'absolute'
    }
  })
}

// Watch active step and refresh coordinates
watch([isActive, currentStepIndex], () => {
  if (isActive.value) {
    // Wait for DOM
    nextTick(() => {
      setTimeout(updatePosition, 100)
    })
  } else {
    spotlightRect.value = null
    cardStyle.value = {}
  }
}, { immediate: true })

// Add events for window resizing and scrolling to keep highlight synced
onMounted(() => {
  window.addEventListener('resize', updatePosition)
  window.addEventListener('scroll', updatePosition, { capture: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', updatePosition)
  window.removeEventListener('scroll', updatePosition, { capture: true })
})
</script>

<style scoped>
.ease-out {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
