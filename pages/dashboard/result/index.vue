<script setup>
import { ref, computed, watch } from 'vue'
import { useHead, useAsyncData, useRuntimeConfig, navigateTo, useRoute } from '#app'
import { useAuth } from '#imports'
import { Icon } from '@iconify/vue'
import { useFormattedDatePreset } from '~/composables/useDateHelper'
import { useApi } from '~/composables/useApi'

defineOptions({
  name: 'ResultsPage'
})

const { user } = useAuth()
const completedProblems = ref([])
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:9000'
const { get } = useApi()

const { data: completedProblemsData, pending: isLoading, error: loadError, refresh: fetchResults } = await useAsyncData('user-results', async () => {
  if (!user.value) {
    // Return single demo data for preview
    return [
      {
        id: 'demo-1',
        slug: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        completedAt: new Date().toISOString(),
        timeSpent: '15 minutes',
        status: 'Accepted',
        attempts: 3,
        tags: ['Array', 'Hash Table'],
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        executionTime: '45ms',
        totalWrong: 2,
        platform: 'Demo Platform'
      }
    ]
  }

  try {
    const response = await get(`${apiBaseUrl}/user/result`)

    // Normalise API shape: backend returns { data: [...] }, but be defensive
    const raw = response && typeof response === 'object' ? (response.data ?? response) : []
    const results = Array.isArray(raw) ? raw : []

    return results.map((r) => ({
      id: r.problem_id,
      slug: r.problem_id,
      title: r.problem_title || r.problem_id || 'Unknown Problem',
      difficulty: r.difficulty || 'Unknown',
      completedAt: r.last_attempt_at,
      timeSpent: `${Math.round((r.average_time_spent || 0) / 60)} minutes`,
      status: 'Accepted',
      attempts: r.total_attempts || 1,
      tags: r.category_name ? [r.category_name] : [],
      description: r.problem_description || 'No description available.',
      executionTime: r.average_execution_time != null ? `${r.average_execution_time}ms` : '-',
      totalWrong: r.total_wrong || 0,
      platform: r.platform_name || 'Unknown Platform'
    }))
  } catch (error) {
    console.log(error)
    console.error('Failed to fetch results:', error)
    throw new Error('Failed to load results. Please try again.')
  }
})

watch(completedProblemsData, (val) => {
  completedProblems.value = val || []
}, { immediate: true })

const loading = computed(() => isLoading.value)
const error = computed(() => loadError.value?.message || null)

const formatDate = (dateString) => {
  return useFormattedDatePreset(dateString, 'dateTime')
}

const route = useRoute()
useHead({
  title: 'My Results - Archeryhub.id Tournament Manager',
  meta: [
    { name: 'description', content: 'View your archery tournament results and track your progress.' },
    { name: 'robots', content: 'noindex' }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://archeryhub.id${route.path}`
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div
        class="relative overflow-hidden rounded-2xl border border-yellow-100 bg-gradient-to-r from-yellow-50 via-white to-orange-50">
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-200/40 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>
        <div class="relative p-6 sm:p-8">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white/70 px-3 py-1 text-sm text-yellow-700 shadow-sm backdrop-blur">
            <Icon :ssr="true" icon="carbon:result" class="h-4 w-4" />
            <span>Your Progress</span>
          </div>
          <h1 class="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">
            My Results
          </h1>
          <p class="mt-2 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl">
            Track your progress and view your tournament results
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div v-if="loading" class="text-center py-16">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <div class="flex flex-col items-center gap-6">
            <div class="flex flex-col items-center gap-2">
              <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
              <h3 class="text-lg font-semibold text-gray-900">
                Loading your results...
              </h3>
              <p class="text-gray-600 text-center">
                Please wait while we fetch your tournament results.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="text-center py-16">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <div class="flex flex-col items-center gap-6">
            <div class="flex flex-col items-center gap-2">
              <Icon :ssr="true" icon="ph:warning-circle" class="w-16 h-16 text-red-400" />
              <h3 class="text-lg font-semibold text-gray-900">
                Failed to Load Results
              </h3>
              <p class="text-gray-600 text-center">
                {{ error }}
              </p>
            </div>

            <div class="flex flex-col gap-3 w-full">
              <button @click="fetchResults"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors w-full">
                <Icon :ssr="true" icon="ph:arrow-clockwise" class="w-4 h-4" />
                Try Again
              </button>

              <NuxtLink to="/" class="w-full">
                <button
                  class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors w-full">
                  <Icon :ssr="true" icon="ph:house" class="w-4 h-4" />
                  Go to Homepage
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <template v-else-if="!error">
        <!-- For non-logged users: Show one demo result card -->
        <div v-if="!user">
          <!-- Single demo result card -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              <!-- Demo overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-gray-50/90 to-transparent rounded-xl z-10 flex items-end justify-center pb-4">
                <div class="text-center">
                  <button @click="login"
                    class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors text-sm">
                    Login to View Details
                  </button>
                </div>
              </div>

              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-bold text-gray-700">
                      {{ completedProblems[0]?.title }}
                    </h3>
                  </div>
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    {{ completedProblems[0]?.description }}
                  </p>
                  <div class="flex flex-wrap gap-1 mb-4">
                    <span v-for="tag in completedProblems[0]?.tags" :key="tag"
                      class="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                      {{ tag }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <Icon :ssr="true" icon="ph:repeat" class="w-4 h-4 text-yellow-600" />
                    <span class="text-sm text-gray-600">Attempts</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ completedProblems[0]?.attempts }}</div>
                </div>

                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <Icon :ssr="true" icon="ph:clock" class="w-4 h-4 text-yellow-600" />
                    <span class="text-sm text-gray-600">Avg Time</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ completedProblems[0]?.timeSpent }}</div>
                </div>

                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <Icon :ssr="true" icon="ph:lightning" class="w-4 h-4 text-yellow-600" />
                    <span class="text-sm text-gray-600">Avg Runtime</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ completedProblems[0]?.executionTime }}</div>
                </div>

                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <Icon :ssr="true" icon="ph:x-circle" class="w-4 h-4 text-red-600" />
                    <span class="text-sm text-gray-600">Total Wrong</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">{{ completedProblems[0]?.totalWrong }}</div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-500">
                  <Icon :ssr="true" icon="ph:calendar" class="w-4 h-4 mr-1 inline" />
                  Demo Date: {{ formatDate(completedProblems[0]?.completedAt) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- For logged users: Show actual results -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="problem in completedProblems" :key="problem.id" :class="[
            'block bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300',
            user ? 'cursor-pointer hover:shadow-md hover:border-yellow-200 group' : 'relative'
          ]" @click="user && navigateTo(`/result/${problem.slug}`)">
            <!-- Demo overlay for non-logged users -->
            <div v-if="!user"
              class="absolute inset-0 bg-gradient-to-t from-gray-50/90 to-transparent rounded-xl z-10 flex items-end justify-center pb-4">
              <div class="text-center">
                <button
                  class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors text-sm">
                  Login to View Details
                </button>
              </div>
            </div>

            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 :class="[
                    'text-lg font-bold transition-colors',
                    user ? 'text-gray-900 group-hover:text-yellow-600' : 'text-gray-700'
                  ]">
                    {{ problem.title }}
                  </h3>
                  <span v-if="!user" class="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                    Demo
                  </span>
                </div>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ problem.description }}
                </p>
                <div class="flex flex-wrap gap-1 mb-4">
                  <span v-for="tag in problem.tags" :key="tag"
                    class="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center space-x-2">
                  <Icon :ssr="true" icon="ph:repeat" class="w-4 h-4 text-yellow-600" />
                  <span class="text-sm text-gray-600">Attempts</span>
                </div>
                <div class="text-lg font-bold text-gray-900">{{ problem.attempts }}</div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center space-x-2">
                  <Icon :ssr="true" icon="ph:clock" class="w-4 h-4 text-yellow-600" />
                  <span class="text-sm text-gray-600">Avg Time</span>
                </div>
                <div class="text-lg font-bold text-gray-900">{{ problem.timeSpent }}</div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center space-x-2">
                  <Icon :ssr="true" icon="ph:lightning" class="w-4 h-4 text-yellow-600" />
                  <span class="text-sm text-gray-600">Avg Runtime</span>
                </div>
                <div class="text-lg font-bold text-gray-900">{{ problem.executionTime }}</div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center space-x-2">
                  <Icon :ssr="true" icon="ph:x-circle" class="w-4 h-4 text-red-600" />
                  <span class="text-sm text-gray-600">Total Wrong</span>
                </div>
                <div class="text-lg font-bold text-gray-900">{{ problem.totalWrong }}</div>
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="text-sm text-gray-500">
                <Icon :ssr="true" icon="ph:calendar" class="w-4 h-4 mr-1 inline" />
                {{ user ? 'Last Attempt:' : 'Demo Date:' }} {{ formatDate(problem.completedAt) }}
              </div>
              <div v-if="user" class="text-xs text-gray-500">
                <Icon :ssr="true" icon="ph:arrow-right"
                  class="w-3 h-3 inline ml-1 group-hover:text-yellow-600 transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="user && completedProblems.length === 0 && !loading" class="text-center py-16">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
            <div class="flex flex-col items-center gap-6">
              <div class="flex flex-col items-center gap-2">
                <Icon :ssr="true" icon="carbon:result" class="w-16 h-16 text-gray-400" />
                <h3 class="text-lg font-semibold text-gray-900">
                  No results found
                </h3>
                <p class="text-gray-600 text-center">
                  Participate in tournaments to see your results here.
                </p>
              </div>

              <div class="flex flex-col gap-3 w-full">
                <NuxtLink to="/events" class="w-full">
                  <button
                    class="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors w-full">
                    <Icon :ssr="true" icon="ph:trophy" class="w-4 h-4" />
                    Browse Tournaments
                  </button>
                </NuxtLink>

                <NuxtLink to="/" class="w-full">
                  <button
                    class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors w-full">
                    <Icon :ssr="true" icon="ph:house" class="w-4 h-4" />
                    Go to Homepage
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>