<template>
  <section class="relative overflow-hidden">
    <!-- Background -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-orange-50"></div>
      <div class="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-orange-200/40 blur-3xl">
      </div>
      <div class="absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent_70%)]">
        <div
          class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,200,50,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,200,50,0.06)_1px,transparent_1px)] bg-[size:36px_36px]">
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <!-- Left: Text -->
        <div>
          <h1
            class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight tracking-tight">
            All in One<br />
            <span
              class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-400">Platform
              Panahan</span><br />
            Indonesia
          </h1>
          <p class="mt-5 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
            Archeryhub.id hadir sebagai wadah bagi seluruh penggiat panahan di Indonesia. Dari pemula hingga juara
            nasional, di sini kita terhubung lewat event, prestasi, dan semangat yang sama.
          </p>

          <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <NuxtLink to="/dashboard/events"
              class="btn-primary flex gap-2 items-center px-6 py-2.5 sm:px-7 sm:py-3 justify-center text-sm sm:text-base">
              <Icon :ssr="true" icon="ph:trophy" class="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Explore Tournaments</span>
            </NuxtLink>
            <NuxtLink to="/dashboard/result"
              class="btn-secondary flex gap-2 items-center px-6 py-2.5 sm:px-7 sm:py-3 justify-center text-sm sm:text-base">
              <Icon :ssr="true" icon="ph:chart-bar" class="w-4 h-4 sm:w-5 sm:h-5" color="orange" />
              <span>View Results</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Right: Image Comparison Slider -->
        <div class="relative">
          <div class="absolute -top-6 -left-6 h-24 w-24 rounded-2xl blur-2xl"></div>
          <div class="rounded-xl">
            <!-- Skeleton Loader -->
            <div v-if="!imageLoaded" class="skeleton-loader rounded-xl overflow-hidden">
              <div class="aspect-video bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
                <div class="flex items-center justify-center h-full">
                  <div class="text-center">
                  </div>
                </div>
              </div>
            </div>

            <!-- Image Comparison Component -->
            <div v-else class="image-comparison-container">
              <ImageComparison before-image="/hero-before.png" after-image="/hero-after.png"
                before-alt="Before: Traditional coding setup" after-alt="After: Modern coding environment" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Icon } from '@iconify/vue'
import ImageComparison from '~/components/ImageComparison.vue'

defineOptions({
  name: 'HeroSection'
})

const props = defineProps({
  overviewData: {
    type: Object,
    default: () => ({
      total_users: 0,
      total_platforms: 0,
      total_categories: 0,
      platforms: []
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const imageLoaded = ref(false)

// Calculate total problems from platforms
const totalProblems = computed(() => {
  return props.overviewData.platforms?.reduce((sum, platform) => sum + platform.total_problems, 0) || 0
})

onMounted(() => {
  // Simulate loading time for the image comparison component
  setTimeout(() => {
    imageLoaded.value = true
  }, 1500)
})
</script>
