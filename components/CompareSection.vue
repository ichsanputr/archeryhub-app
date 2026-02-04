<template>
  <section class="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <div class="absolute -top-20 -left-16 h-56 w-56 rounded-full bg-yellow-200/40 blur-3xl" />
      <div class="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-orange-100/20 blur-3xl" />
    </div>

    <Container>
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div
          class="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-yellow-200 px-4 py-2 mb-6">
          <div class="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
          <span class="text-xs font-bold tracking-wider text-yellow-600 ">
            Platform Comparison
          </span>
        </div>

        <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Why choose
          <span class="bg-gradient-to-r from-yellow-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
            Archeryhub.id
          </span>
          for management?
        </h2>

        <p class="text-base sm:text-lg text-gray-600 leading-relaxed">
          We're different. Archeryhub.id focuses on
          <span class="font-semibold text-gray-900">efficiency and real-time results</span>
          with automated brackets, participant tracking, and a user-friendly organizer dashboard.
        </p>
      </div>

      <!-- Comparison Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <!-- BudiBadu Card (Featured) -->
        <div class="relative group">
          <!-- "Best for You" Badge -->
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <div
              class="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 shadow-lg">
              <Icon :ssr="true" icon="ph:star-fill" class="w-3 h-3 text-white" />
              <span class="text-xs font-bold text-white">Recommended</span>
            </div>
          </div>

          <div
            class="relative bg-gradient-to-br from-white to-yellow-50/50 rounded-2xl border-2 border-yellow-400 shadow-xl p-6 h-full transition-all duration-300 hover:shadow-2xl">
            <!-- Platform Header -->
            <div class="text-center mb-6">
              <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-4 shadow-lg">
                <Icon :ssr="true" icon="ph:target-fill" class="w-8 h-8 text-white" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-1">Archeryhub.id</h3>
              <p class="text-sm text-gray-600">Modern tournament oversight</p>
            </div>

            <!-- Features List -->
            <div class="space-y-3 mb-6">
              <div v-for="(feature, idx) in budibaduFeatures" :key="idx" class="flex items-start gap-3">
                <div class="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center mt-0.5">
                  <Icon :ssr="true" icon="ph:check-bold" class="w-3 h-3 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{{ feature.title }}</p>
                  <p class="text-xs text-gray-600 mt-0.5">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <NuxtLink to="/dashboard/events"
              class="block w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
              Go Pro for Free
              <Icon :ssr="true" icon="ph:arrow-right-bold" class="inline-block w-4 h-4 ml-1" />
            </NuxtLink>
          </div>
        </div>

        <!-- LeetCode Card -->
        <div class="relative group">
          <div
            class="bg-white rounded-2xl border border-gray-200 shadow-md p-6 h-full transition-all duration-300 hover:shadow-xl hover:border-gray-300">
            <!-- Platform Header -->
            <div class="text-center mb-6">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                <Icon :ssr="true" icon="ph:file-text-bold" class="w-8 h-8 text-gray-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-1">Paper & Pen</h3>
              <p class="text-sm text-gray-600">The traditional way</p>
            </div>

            <!-- Features List -->
            <div class="space-y-3 mb-6">
              <div v-for="(feature, idx) in leetcodeFeatures" :key="idx" class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5">
                  <Icon :ssr="true" :icon="feature.icon" class="w-5 h-5" :class="feature.color" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{{ feature.title }}</p>
                  <p class="text-xs text-gray-600 mt-0.5">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <!-- Info Badge -->
            <div class="text-center py-2 px-3 rounded-lg bg-gray-50 border border-gray-200">
              <p class="text-xs text-gray-600">Prone to errors and slow results</p>
            </div>
          </div>
        </div>

        <!-- Codewars Card -->
        <div class="relative group">
          <div
            class="bg-white rounded-2xl border border-gray-200 shadow-md p-6 h-full transition-all duration-300 hover:shadow-xl hover:border-gray-300">
            <!-- Platform Header -->
            <div class="text-center mb-6">
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-4">
                <Icon :ssr="true" icon="ph:table-bold" class="w-8 h-8 text-gray-600" />
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-1">Spreadsheets</h3>
              <p class="text-sm text-gray-600">Manual calculation focus</p>
            </div>

            <!-- Features List -->
            <div class="space-y-3 mb-6">
              <div v-for="(feature, idx) in codewarsFeatures" :key="idx" class="flex items-start gap-3">
                <div class="flex-shrink-0 mt-0.5">
                  <Icon :ssr="true" :icon="feature.icon" class="w-5 h-5" :class="feature.color" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-900">{{ feature.title }}</p>
                  <p class="text-xs text-gray-600 mt-0.5">{{ feature.description }}</p>
                </div>
              </div>
            </div>

            <!-- Info Badge -->
            <div class="text-center py-2 px-3 rounded-lg bg-gray-50 border border-gray-200">
              <p class="text-xs text-gray-600">Perfect for quick practice</p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'

defineOptions({
  name: 'CompareSection'
})

const budibaduFeatures = [
  {
    title: 'Live Scoreboard',
    description: 'Real-time updates for spectators and athletes'
  },
  {
    title: 'Auto Bracket Gen',
    description: 'Instant elimination brackets based on qualifying'
  },
  {
    title: 'Mobile Scoring',
    description: 'Enter scores directly from the field via mobile'
  },
  {
    title: 'Stats & Ranking',
    description: 'Comprehensive athlete career tracking'
  },
  {
    title: 'Event Builder',
    description: 'Quickly set up distances, ends, and categories'
  }
]

const leetcodeFeatures = [
  {
    icon: 'ph:clock-bold',
    color: 'text-red-600',
    title: 'Manual Checking',
    description: 'Scores must be double-checked by hand'
  },
  {
    icon: 'ph:warning-bold',
    color: 'text-orange-600',
    title: 'Slow Progress',
    description: 'Results take hours or days to publish'
  },
  {
    icon: 'ph:info-bold',
    color: 'text-blue-600',
    title: 'Limited Access',
    description: 'Only officials see the rankings'
  },
  {
    icon: 'ph:x-circle-bold',
    color: 'text-red-500',
    title: 'No Real-time',
    description: 'Offline-only until event ends'
  }
]

const codewarsFeatures = [
  {
    icon: 'ph:wrench-bold',
    color: 'text-yellow-600',
    title: 'Complex Setup',
    description: 'Hours spent crafting formulas'
  },
  {
    icon: 'ph:lock-bold',
    color: 'text-gray-600',
    title: 'Siloed Data',
    description: 'Hard to share results with public'
  },
  {
    icon: 'ph:user-minus-bold',
    color: 'text-orange-600',
    title: 'Manual Sync',
    description: 'No auto-sync between field and HQ'
  },
  {
    icon: 'ph:warning-circle-bold',
    color: 'text-red-600',
    title: 'Formula Errors',
    description: 'One typo breaks the entire sheet'
  }
]

const differentiators = [
  {
    icon: 'ph:flow-arrow',
    title: 'Visual Algorithm Flow',
    description: 'Every problem has a flowchart showing the thinking process step-by-step'
  },
  {
    icon: 'ph:chalkboard-teacher',
    title: 'Teaching First',
    description: 'Explanations focus on building intuition, not just showing code'
  },
  {
    icon: 'ph:path',
    title: 'Structured Progression',
    description: 'Carefully ordered problems that build on each other'
  },
  {
    icon: 'ph:clock-countdown',
    title: 'Bite-Sized Sessions',
    description: 'Problems designed for 20-40 minute focused practice'
  }
]
</script>

<style scoped>
/* Custom animations */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-10px);
  }
}

.group:hover .group-hover\:animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
