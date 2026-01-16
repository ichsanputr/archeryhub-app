<script setup>
import { Icon } from '@iconify/vue'

// Define component name to fix linter error
defineOptions({
  name: 'EcosystemPage'
})

// Platform data
const platforms = [
  {
    id: 'quiz',
    name: 'Budibadu Quiz',
    description: 'Test your programming knowledge with interactive quizzes covering algorithms, data structures, and coding concepts.',
    icon: 'ph:question',
    color: 'from-blue-500 to-purple-600',
    bgColor: 'from-blue-50 to-purple-50',
    status: 'available',
    features: ['Multiple Choice Questions', 'Timed Challenges', 'Progress Tracking', 'Certificate Generation']
  },
  {
    id: 'interview',
    name: 'Interview Prep',
    description: 'Prepare for technical interviews with company-specific question sets and mock interview simulations.',
    icon: 'ph:briefcase',
    color: 'from-green-500 to-teal-600',
    bgColor: 'from-green-50 to-teal-50',
    status: 'coming-soon',
    features: ['Company-specific Questions', 'Mock Interviews', 'Performance Analytics', 'Interview Tips']
  },
  {
    id: 'contest',
    name: 'Coding Contests',
    description: 'Participate in regular coding competitions and compete with developers worldwide.',
    icon: 'ph:trophy',
    color: 'from-orange-500 to-red-600',
    bgColor: 'from-orange-50 to-red-50',
    status: 'coming-soon',
    features: ['Weekly Contests', 'Global Leaderboards', 'Prize Pool', 'Team Competitions']
  },
  {
    id: 'learn',
    name: 'Learning Paths',
    description: 'Structured learning paths to master programming languages and technologies from beginner to expert.',
    icon: 'ph:book-open',
    color: 'from-indigo-500 to-blue-600',
    bgColor: 'from-indigo-50 to-blue-50',
    status: 'coming-soon',
    features: ['Structured Curriculum', 'Interactive Tutorials', 'Project-based Learning', 'Mentorship']
  }
]

// Handle platform click
const handlePlatformClick = (platform) => {
  if (platform.status === 'available') {
    // Navigate to the platform
    if (platform.id === 'quiz') {
      navigateTo('/ecosystem/quiz')
    }
  }
}

// SEO
const route = useRoute()
useHead({
  title: 'Ecosystem - BudiBadu Coding Challenge',
  meta: [
    { name: 'description', content: 'Explore Budibadu ecosystem platforms including Quiz, Interview Prep, Coding Contests, and Learning Paths.' }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://budibadu.com${route.path}`
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="relative overflow-hidden rounded-2xl border border-yellow-100 bg-gradient-to-r from-yellow-50 via-white to-orange-50">
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-200/40 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>
        <div class="relative p-6 sm:p-8 text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white/70 px-3 py-1 text-sm text-yellow-700 shadow-sm backdrop-blur">
            <Icon :ssr="true" icon="ph:grid-four" class="h-4 w-4" />
            <span>Ecosystem</span>
          </div>
          <h1 class="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">Budibadu Ecosystem</h1>
          <p class="mt-2 text-sm sm:text-base md:text-lg text-gray-600">Explore our comprehensive suite of programming platforms designed to enhance your coding journey</p>
        </div>
      </div>
    </div>

    <!-- Platforms Grid -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div
          v-for="platform in platforms"
          :key="platform.id"
          @click="handlePlatformClick(platform)"
          :class="[
            'relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer group',
            platform.status === 'available'
              ? 'border-gray-200 hover:border-yellow-300 hover:shadow-lg'
              : 'border-gray-200 opacity-75'
          ]"
        >
          <!-- Background Gradient -->
          <div :class="`absolute inset-0 bg-gradient-to-br ${platform.bgColor} opacity-50`"></div>

          <!-- Content -->
          <div class="relative p-6 sm:p-8">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
              <div :class="`w-12 h-12 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`">
                <Icon :ssr="true" :icon="platform.icon" class="w-6 h-6 text-white" />
              </div>
              <div v-if="platform.status === 'coming-soon'" class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                Coming Soon
              </div>
            </div>

            <!-- Title and Description -->
            <h3 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
              {{ platform.name }}
            </h3>
            <p class="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
              {{ platform.description }}
            </p>

            <!-- Features -->
            <div class="mb-6">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Features:</h4>
              <ul class="space-y-2">
                <li v-for="feature in platform.features" :key="feature" class="flex items-center text-sm text-gray-600">
                  <Icon :ssr="true" icon="ph:check" class="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                  {{ feature }}
                </li>
              </ul>
            </div>

            <!-- Action Button -->
            <button
              :class="[
                'w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center',
                platform.status === 'available'
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              ]"
            >
              <Icon :ssr="true" :icon="platform.status === 'available' ? 'ph:arrow-right' : 'ph:clock'" class="w-4 h-4 mr-2" />
              {{ platform.status === 'available' ? 'Explore Now' : 'Coming Soon' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="mt-12 text-center">
        <div class="max-w-2xl mx-auto">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready to Level Up Your Coding Skills?</h2>
          <p class="text-gray-600 mb-6">Join thousands of developers who are already using Budibadu ecosystem to accelerate their programming journey.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/problem" class="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <Icon :ssr="true" icon="ph:code" class="w-5 h-5" />
              Start Coding
            </a>
            <a href="/blog" class="btn-secondary inline-flex items-center gap-2 px-6 py-3">
              <Icon :ssr="true" icon="ph:book-open" class="w-5 h-5" />
              Read Blogs
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>