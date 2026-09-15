<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-300 ease-in-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="loading" class="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col items-center justify-center overflow-hidden w-screen h-screen">
      <!-- Main Content -->
      <div class="flex flex-col items-center z-10 space-y-3">
        <!-- SVG Target Animation Loader -->
        <div class="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
          <img 
            :key="animationTimestamp"
            :src="`/target-animation-loader.svg?t=${animationTimestamp}`" 
            alt="Loading..." 
            class="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(217,255,0,0.15)] select-none pointer-events-none" 
          />
        </div>
        
        <!-- Text with wide tracking -->
        <div class="text-center">
          <h2 class="text-white text-xs font-black tracking-[0.25em] opacity-85 font-display">Archeris<span class="text-primary font-black">.net</span></h2>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const animationTimestamp = ref(Date.now())

watch(() => props.loading, (newVal) => {
  if (newVal) {
    animationTimestamp.value = Date.now()
  }
})

onMounted(() => {
  if (props.loading) {
    animationTimestamp.value = Date.now()
  }
})
</script>

<style scoped>
/* Ensure the loader covers the viewport */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>

