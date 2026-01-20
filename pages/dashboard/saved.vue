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
const isLoading = ref(true)
const error = ref(null)

const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:8080';
const { get } = useApi();

const fetchSavedProblems = async () => {
  if (!user.value) {
    // Return demo data for preview
    savedProblems.value = [
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
    isLoading.value = false
    return
  }

  isLoading.value = true
  error.value = null
  try {
    const response = await get(`${apiBaseUrl}/user/saved-problem`);

    // Normalize response to an array of problems
    const items = Array.isArray(response)
      ? response
      : (response && response.data && Array.isArray(response.data.problems) ? response.data.problems : [])

    savedProblems.value = (items || []).map((entry) => {
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
  } catch (err) {
    console.error('Error fetching saved problems:', err);
    error.value = 'Failed to load saved problems';
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchSavedProblems()
})

// Derived loading & error for template compatibility
const loading = computed(() => isLoading.value)

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
  title: 'Saved Events - Archeryhub.id',
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'description', content: 'Lihat event yang Anda simpan.' }
  ]
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div
        class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white">
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="relative p-6 sm:p-8">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-primary shadow-sm backdrop-blur">
            <Icon :ssr="true" icon="ph:bookmark-simple" class="h-4 w-4" />
            <span>Koleksi Saya</span>
          </div>
          <h1 class="mt-4 text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight font-display">
            Event Disimpan
          </h1>
          <p class="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl font-body">
            Simpan event yang menarik buat dipantau atau diikuti nanti.
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="bg-white rounded-2xl border border-gray-100 p-12 max-w-md mx-auto shadow-sm">
          <div class="flex flex-col items-center gap-6">
            <div class="size-16 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            <div class="space-y-2">
              <h3 class="text-lg font-bold text-navy">Memuat data...</h3>
              <p class="text-slate-500 text-sm">Tunggu sebentar ya, lagi ngambil data event kamu.</p>
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
                Gagal memuat event tersimpan
              </h3>
              <p class="text-gray-600 text-center">
                {{ error }}
              </p>
            </div>

            <div class="flex flex-col gap-3 w-full">
              <BaseButton @click="fetchSavedProblems" variant="gold" block icon="ph:arrow-clockwise">
                Coba Lagi
              </BaseButton>

              <BaseButton to="/dashboard/events" variant="outline" block icon="ph:magnifying-glass">
                Cari Event
              </BaseButton>
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
              Belum ada event yang disimpan
            </h3>
            <p class="text-gray-600 text-center">
              Mulai simpan event yang kamu minati untuk dilihat nanti!
            </p>
          </div>

          <div class="flex flex-col gap-3 w-full max-w-md">
            <BaseButton to="/dashboard/events" variant="gold" block icon="ph:magnifying-glass" size="lg">
              Cari Event
            </BaseButton>

            <BaseButton to="/" variant="outline" block icon="ph:house">
              Kembali ke Beranda
            </BaseButton>
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
                <div class="text-center px-6 w-full">
                  <BaseButton to="/auth/login" variant="gold" block size="sm">
                    Login untuk melihat detail
                  </BaseButton>
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
            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <BaseButton :to="`/dashboard/events/${problem.id}`" variant="primary" size="sm" icon="ph:info">
                Detail Event
              </BaseButton>

              <!-- Save Button (for removal) -->
              <BaseButton variant="ghost" size="sm" icon="ph:trash"
                class="text-red-500 hover:text-red-600 hover:bg-red-50 !font-bold"
                @click="removeSavedProblem(problem.slug)">
                Hapus
              </BaseButton>
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
                <BaseButton to="/dashboard/events" variant="gold" block icon="ph:magnifying-glass">
                  Cari Event
                </BaseButton>

                <BaseButton to="/" variant="outline" block icon="ph:house">
                  Kembali ke Beranda
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
