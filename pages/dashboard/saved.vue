<script setup>
import { ref, computed, watch } from 'vue';
import { useAsyncData, useRuntimeConfig, useHead } from '#app';
import { useAuth } from '#imports';
import { useApi } from '~/composables/useApi';
import { Icon } from '@iconify/vue';

// Define component name
defineOptions({
  name: 'SavedProblemsPage',
})

// Authentication
const { user } = useAuth()

// Reactive data
const savedProblems = ref([])

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080';
const { get } = useApi();

// Fetch saved problems using useAsyncData (SSR supported)
const { data: savedProblemsData, pending, error: fetchError, refresh: refreshSaved } = await useAsyncData('saved-problems', async () => {
  if (!user.value) {
    // Return demo data for preview
    return [
      {
        id: 'demo-1',
        slug: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        created_at: new Date().toISOString(),
        categories: ['Array', 'Hash Table'],
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        problem: {
          id: 'demo-1',
          slug: 'two-sum',
          title: 'Two Sum',
          difficulty: 'Easy',
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
        }
      },
    ]
  }

  try {
    const response = await get(`${apiBaseUrl}/user/saved-problem`);

    // Normalize response to an array of problems
    const items = Array.isArray(response)
      ? response
      : (response && response.data && Array.isArray(response.data.problems) ? response.data.problems : [])

    const mapped = (items || []).map((entry) => {
      // Support both old shape (saved record with nested problem) and new shape (problem directly)
      const p = entry.problem || entry || {}
      return {
        id: p.id,
        created_at: p.created_at,
        slug: p.slug,
        title: p.title,
        description: p.description,
        difficulty: p.difficulty,
        categories: Array.isArray(p.categories)
          ? p.categories
          : (p.category_name ? [p.category_name] : []),
        problem: p,
      }
    })

    return mapped;
  } catch (err) {
    console.error('Error fetching saved problems:', err);
    throw new Error('Failed to load saved problems');
  }
})

// Derived loading & error
const loading = computed(() => pending.value)
const error = computed(() => fetchError.value?.message || null)

// Keep local list in sync with async data
watch(savedProblemsData, (val) => {
  savedProblems.value = val || []
}, { immediate: true })

// Retry fetch
const fetchSavedProblems = async () => {
  await refreshSaved()
}

// Remove saved problem (local update only; API handled in ProblemCard)
const removeSavedProblem = async (problemSlug) => {
  try {
    savedProblems.value = savedProblems.value.filter(problem => problem.slug !== problemSlug);
  } catch (err) {
    console.error('Error updating saved problems locally:', err);
  }
}

// SEO
const route = useRoute()
useHead({
  title: 'Saved Problems - BudiBadu',
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'description', content: 'View and manage your saved coding problems.' }
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
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div
        class="relative overflow-hidden rounded-2xl border border-yellow-100 bg-gradient-to-r from-yellow-50 via-white to-orange-50">
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-200/40 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>
        <div class="relative p-6 sm:p-8">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white/70 px-3 py-1 text-sm text-yellow-700 shadow-sm backdrop-blur">
            <Icon :ssr="true" icon="ph:bookmark-simple" class="h-4 w-4" />
            <span>Your Collection</span>
          </div>
          <h1 class="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">
            Saved Problems
          </h1>
          <p class="mt-2 text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl">
            Your bookmarked coding challenges for later practice
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <div class="flex flex-col items-center gap-6">
            <div class="flex flex-col items-center gap-2">
              <v-progress-circular indeterminate color="primary" size="64" class="mb-4" />
              <h3 class="text-lg font-semibold text-gray-900">
                Loading your saved problems...
              </h3>
              <p class="text-gray-600 text-center">
                Please wait while we fetch your bookmarked challenges.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
          <div class="flex flex-col items-center gap-6">
            <div class="flex flex-col items-center gap-2">
              <Icon :ssr="true" icon="ph:warning-circle" class="w-16 h-16 text-red-400" />
              <h3 class="text-lg font-semibold text-gray-900">
                Failed to Load Saved Problems
              </h3>
              <p class="text-gray-600 text-center">
                {{ error }}
              </p>
            </div>

            <div class="flex flex-col gap-3 w-full">
              <button @click="fetchSavedProblems"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors w-full">
                <Icon :ssr="true" icon="ph:arrow-clockwise" class="w-4 h-4" />
                Try Again
              </button>

              <NuxtLink to="/problem" class="w-full">
                <button
                  class="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors w-full">
                  <Icon :ssr="true" icon="ph:code" class="w-4 h-4" />
                  Browse Problems
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="savedProblems.length === 0" class="text-center py-16">
        <div class="flex flex-col items-center gap-6">
          <div class="flex flex-col items-center gap-2">
            <Icon :ssr="true" icon="ph:bookmark-simple" class="w-16 h-16 text-gray-400" />
            <h3 class="text-lg font-semibold text-gray-900">
              No saved problems yet
            </h3>
            <p class="text-gray-600 text-center">
              Start bookmarking problems you want to solve later!
            </p>
          </div>

          <div class="flex flex-col gap-3 w-full max-w-md">
            <NuxtLink to="/problem" class="w-full">
              <button
                class="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors w-full">
                <Icon :ssr="true" icon="ph:code" class="w-4 h-4" />
                Browse Problems
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

      <!-- Saved Problems Grid -->
      <template v-else-if="!error">
        <!-- For non-logged users: Show demo saved cards -->
        <div v-if="!user">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="problem in savedProblems" :key="problem.id"
              class="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative">
              <!-- Demo overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-t from-gray-50/90 to-transparent rounded-xl z-10 flex items-end justify-center pb-4">
                <div class="text-center">
                  <button @click="navigateTo('/auth/login')"
                    class="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors text-sm">
                    Login to View Details
                  </button>
                </div>
              </div>

              <!-- Problem Header -->
              <div class="flex items-start justify-between mb-4">
                <div class="flex-1">
                  <div class="flex items-center space-x-3 mb-2">
                    <h3 class="text-lg font-bold text-gray-700">
                      {{ problem.title }}
                    </h3>
                  </div>
                  <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                    {{ problem.description }}
                  </p>

                  <!-- Categories/Tags -->
                  <div class="flex flex-wrap gap-1 mb-4">
                    <span v-for="category in problem.categories" :key="category"
                      class="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                      {{ category }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Problem Stats -->
              <div class="grid grid-cols-2 gap-4 mb-4">
                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <Icon :ssr="true" icon="ph:chart-bar" class="w-4 h-4 text-yellow-600" />
                    <span class="text-sm text-gray-600">Difficulty</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900 capitalize">{{ problem.difficulty || 'Unknown' }}</div>
                </div>

                <div class="bg-gray-50 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <Icon :ssr="true" icon="ph:calendar" class="w-4 h-4 text-yellow-600" />
                    <span class="text-sm text-gray-600">Saved</span>
                  </div>
                  <div class="text-lg font-bold text-gray-900">
                    Date
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-500">
                  <Icon :ssr="true" icon="ph:calendar" class="w-4 h-4 mr-1 inline" />
                  Date: {{ useFormattedDatePreset(problem.created_at, 'short') }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- For logged users: Show actual saved problems -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="problem in savedProblems" :key="problem.id"
            class="block bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-md hover:border-yellow-200 group">
            <!-- Problem Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center space-x-3 mb-2">
                  <h3 class="text-lg font-bold text-gray-900 group-hover:text-yellow-600 transition-colors">
                    {{ problem.title }}
                  </h3>
                </div>
                <p class="text-gray-600 text-sm mb-3 line-clamp-2">
                  {{ problem.description }}
                </p>

                <!-- Categories/Tags -->
                <div class="flex flex-wrap gap-1 mb-4">
                  <span v-for="category in problem.categories.slice(0, 3)" :key="category"
                    class="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs">
                    {{ category }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Problem Stats -->
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center space-x-2">
                  <Icon :ssr="true" icon="ph:chart-bar" class="w-4 h-4 text-yellow-600" />
                  <span class="text-sm text-gray-600">Difficulty</span>
                </div>
                <div class="text-lg font-bold text-gray-900 capitalize">{{ problem.difficulty || 'Unknown' }}</div>
              </div>

              <div class="bg-gray-50 rounded-lg p-3">
                <div class="flex items-center space-x-2">
                  <Icon :ssr="true" icon="ph:calendar" class="w-4 h-4 text-yellow-600" />
                  <span class="text-sm text-gray-600">Saved</span>
                </div>
                <div class="text-lg font-bold text-gray-900">
                  {{ useFormattedDatePreset(problem.created_at, 'short') }}
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <NuxtLink :to="`/problem/${problem.slug}`"
                class="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors text-sm">
                <Icon :ssr="true" icon="ph:play" class="w-4 h-4" />
                Solve Now
              </NuxtLink>

              <!-- Save Button (for removal) -->
              <button @click="removeSavedProblem(problem.slug)"
                class="flex items-center gap-1 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm"
                title="Remove from saved">
                <Icon :ssr="true" icon="ph:bookmark-simple" class="w-4 h-4 fill-current" />
                <span class="hidden sm:inline">Remove</span>
              </button>
            </div>
          </div>
        </div>

        <div v-if="user && savedProblems.length === 0 && !loading" class="text-center py-16">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
            <div class="flex flex-col items-center gap-6">
              <div class="flex flex-col items-center gap-2">
                <Icon :ssr="true" icon="ph:bookmark-simple" class="w-16 h-16 text-gray-400" />
                <h3 class="text-lg font-semibold text-gray-900">
                  No saved problems yet
                </h3>
                <p class="text-gray-600 text-center">
                  Start bookmarking problems you want to solve later!
                </p>
              </div>

              <div class="flex flex-col gap-3 w-full">
                <NuxtLink to="/problem" class="w-full">
                  <button
                    class="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors w-full">
                    <Icon :ssr="true" icon="ph:code" class="w-4 h-4" />
                    Browse Problems
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
