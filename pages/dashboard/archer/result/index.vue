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
const isLoading = ref(true)
const fetchError = ref(null)
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:9000'
const { get } = useApi()

const fetchResults = async () => {
  if (!user.value) {
    // Return single demo data for preview
    completedProblems.value = [
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
    isLoading.value = false
    return
  }

  isLoading.value = true
  fetchError.value = null
  try {
    const response = await get(`${apiBaseUrl}/user/result`)

    // Normalise API shape: backend returns { data: [...] }, but be defensive
    const raw = response && typeof response === 'object' ? (response.data ?? response) : []
    const results = Array.isArray(raw) ? raw : []

    completedProblems.value = results.map((r) => ({
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
    console.error('Failed to fetch results:', error)
    fetchError.value = 'Failed to load results. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchResults()
})

const loading = computed(() => isLoading.value)
const error = computed(() => fetchError.value || null)

const formatDate = (dateString) => {
  return useFormattedDatePreset(dateString, 'dateTime')
}

// SEO
const route = useRoute()
useHead({
  title: 'Hasil Saya - Archeryhub.id',
  meta: [
    { name: 'description', content: 'Lihat hasil turnamen panahan Anda dan pantau kemajuan Anda.' },
    { name: 'robots', content: 'noindex' }
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
            <Icon :ssr="true" icon="carbon:result" class="h-4 w-4" />
            <span>Kemajuan Saya</span>
          </div>
          <h1 class="mt-4 text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight font-display">
            Hasil Saya
          </h1>
          <p class="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl font-body">
            Pantau kemajuan kamu dan lihat hasil turnamen yang udah kamu ikuti.
          </p>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div v-if="loading" class="text-center py-16">
        <div class="bg-white rounded-2xl border border-gray-100 p-12 max-w-md mx-auto shadow-sm">
          <div class="flex flex-col items-center gap-6">
            <div class="size-16 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            <div class="space-y-2">
              <h3 class="text-lg font-bold text-navy">Memuat hasil...</h3>
              <p class="text-slate-500 text-sm">Tunggu sebentar ya, lagi ngambil data hasil turnamen kamu.</p>
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
              <BaseButton @click="fetchResults" variant="gold" block icon="ph:arrow-clockwise">
                Coba Lagi
              </BaseButton>

              <BaseButton to="/" variant="outline" block icon="ph:house">
                Kembali ke Beranda
              </BaseButton>
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
              <div
                class="absolute inset-0 bg-gradient-to-t from-gray-50/90 to-transparent rounded-xl z-10 flex items-end justify-center pb-4">
                <div class="text-center px-6 w-full">
                  <BaseButton @click="login" variant="gold" block size="sm">
                    Login untuk melihat detail
                  </BaseButton>
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
              <div class="text-center px-6 w-full">
                <BaseButton variant="gold" block size="sm" @click.stop="login">
                  Login untuk melihat detail
                </BaseButton>
              </div>
            </div>

            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h3 :class="[
                  'text-lg font-black transition-colors',
                  user ? 'text-navy group-hover:text-primary' : 'text-gray-700'
                ]">
                  {{ problem.title }}
                </h3>
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
                <BaseButton :to="user?.role === 'archer' ? '/dashboard/archer/events' : '/dashboard/archer/events'"
                  variant="gold" block icon="ph:trophy">
                  Cari Turnamen
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
