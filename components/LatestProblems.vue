<template>
  <section id="platform" class="py-20">
    <Container>
      <div class="text-center mb-16">
        <h2 class="text-2xl sm:text-4xl font-bold mb-6">
          <span class="text-gradient">Latest Problems</span><br>
          <span class="text-gray-800">solve coding challenges in multiple languages</span>
        </h2>
        <p class="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Discover our newest coding challenges that you can solve in your preferred programming language. Challenge
          yourself and improve your coding skills.
        </p>

      </div>

      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        <div v-for="i in 8" :key="i"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full animate-pulse">
          <div class="h-6 bg-gray-200 rounded mb-3"></div>
          <div class="h-4 bg-gray-200 rounded mb-2"></div>
          <div class="h-4 bg-gray-200 rounded mb-4"></div>
          <div class="flex gap-2 mb-4">
            <div class="h-6 w-16 bg-gray-200 rounded-full"></div>
            <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
          </div>
          <div class="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
        <div v-for="item in features" :key="item.title" class="group">
          <NuxtLink :to="`/problem/${item.slug}`"
            class="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full transition-all duration-300 hover:border-yellow-200 hover:shadow-md transform hover:-translate-y-1 no-underline">
            <div class="mb-4">
              <h3 class="font-bold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">{{ item.title }}</h3>
              <div class="flex items-center gap-2 mb-3">
                <span
                  :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : item.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`">
                  {{ item.difficulty }}
                </span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ item.category }}
                </span>
              </div>
              <p class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3 min-h-[4.5rem]">{{ item.description }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
      <!-- Bottom See All Button -->
      <div v-if="!isLoading && features.length > 0" class="text-center flex justify-center mt-8">
        <NuxtLink to="/problem"
          class="inline-block px-6 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors duration-200">
          See All {{ problemCount }} Problems
        </NuxtLink>
      </div>
    </Container>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import Container from '~/components/Container.vue'

defineOptions({
  name: 'FeaturesSection'
})

const props = defineProps({
  overviewData: {
    type: Object,
    default: () => ({
      platforms: []
    })
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Fetch latest problems
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const { data: latestProblems, pending: problemsLoading } = await useAsyncData('latest-problems', async () => {
  try {
    const response = await $fetch('/public/problem/latest?limit=8', {
      baseURL: apiBaseUrl,
      method: 'GET'
    })
    return response?.problems?.slice(0, 8) || [] // Show 8 problems for 4x2 grid
  } catch (error) {
    console.error('Error fetching latest problems:', error)
    return []
  }
})

// Fetch total problem count
const { data: problemCountData } = await useAsyncData('problem-count', async () => {
  try {
    const response = await $fetch('/public/problem/count', {
      baseURL: apiBaseUrl,
      method: 'GET'
    })
    return response?.count || 0
  } catch (error) {
    console.error('Error fetching problem count:', error)
    return 0
  }
})

// Use problemsLoading or props loading
const isLoading = computed(() => props.loading || problemsLoading.value)

// Get problem count for display
const problemCount = computed(() => problemCountData.value || 0)

// Map problems to features format
const features = computed(() => {
  return latestProblems.value?.map(problem => ({
    title: problem.title,
    description: problem.description,
    slug: problem.slug,
    difficulty: problem.difficulty,
    category: problem.category_name
  })) || []
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
