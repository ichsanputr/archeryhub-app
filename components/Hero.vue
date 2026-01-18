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
          <h1 class="mt-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Level up with
            <span
              class="block bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-400 bg-clip-text text-transparent">Archeryhub.id</span>
          </h1>

          <p class="mt-5 text-base sm:text-lg md:text-xl text-gray-600 max-w-xl leading-relaxed">
            Manage your archery tournaments with <span class="underline font-semibold">ease</span>.
            Archeryhub.id provides <span class="underline font-semibold">comprehensive</span> tools
            for live scoring, participant registration, and results management.
          </p>

          <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a href="/dashboard/tournaments"
              class="btn-primary flex gap-2 items-center px-6 py-2.5 sm:px-7 sm:py-3 justify-center text-sm sm:text-base">
              <Icon :ssr="true" icon="ph:trophy" class="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Explore Tournaments</span>
            </a>
            <a href="/dashboard/result"
              class="btn-secondary flex gap-2 items-center px-6 py-2.5 sm:px-7 sm:py-3 justify-center text-sm sm:text-base">
              <Icon :ssr="true" icon="ph:chart-bar" class="w-4 h-4 sm:w-5 sm:h-5" color="orange" />
              <span>View Results</span>
            </a>
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
                    <!-- <div class="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-3 animate-pulse"></div> -->
                    <!-- <div class="h-4 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div> -->
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
