<template>
  <Transition
    enter-active-class="transition duration-100 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-500 ease-in-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="loading" class="fixed inset-0 z-[9999] bg-[#0f172a] flex flex-col items-center justify-center overflow-hidden w-screen h-screen">
      <!-- Main Content -->
      <div class="flex flex-col items-center z-10">
        <!-- Lottie Player Element -->
        <div ref="lottieContainer" class="w-32 h-32 sm:w-40 sm:h-40"></div>
        
        <!-- Text with wide tracking -->
        <div class="text-center">
          <h2 class="text-white text-sm font-black tracking-[0.3em] opacity-80">Archeris<span class="text-primary font-black">.net</span></h2>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const lottieContainer = ref(null)
let anim = null

const initLottie = async () => {
  try {
    const lottie = await loadLottieScript()
    if (!lottieContainer.value) return
    
    if (anim) {
      anim.destroy()
    }
    
    anim = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/loader-lottie.json'
    })
  } catch (error) {
    console.error('Failed to load lottie animation:', error)
  }
}

const loadLottieScript = () => {
  return new Promise((resolve, reject) => {
    if (window.lottie) {
      resolve(window.lottie)
      return
    }
    
    let script = document.querySelector('script[src*="lottie_light.min.js"]')
    if (!script) {
      script = document.createElement('script')
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie_light.min.js'
      script.async = true
      document.body.appendChild(script)
    }
    
    const checkLottie = setInterval(() => {
      if (window.lottie) {
        clearInterval(checkLottie)
        resolve(window.lottie)
      }
    }, 50)
    
    script.addEventListener('error', (err) => {
      clearInterval(checkLottie)
      reject(err)
    })
  })
}

onMounted(() => {
  if (props.loading) {
    initLottie()
  }
})

watch(() => props.loading, (newVal) => {
  if (newVal) {
    nextTick(() => {
      initLottie()
    })
  } else {
    // delay destruction slightly to allow smooth fade out
    setTimeout(() => {
      if (anim && !props.loading) {
        anim.destroy()
        anim = null
      }
    }, 500)
  }
})

onUnmounted(() => {
  if (anim) {
    anim.destroy()
  }
})
</script>

<style scoped>
/* Ensure the loader covers the relative parent container */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
