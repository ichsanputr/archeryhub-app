<script setup>
import { ref, computed, watch } from 'vue'
import { useHead, useAsyncData, useRuntimeConfig, useRoute } from '#app'
import { useAuth } from '#imports'
import { Icon } from '@iconify/vue'
import { useFormattedDatePreset } from '~/composables/useDateHelper'
import { useApi } from '~/composables/useApi'
import LoginRequired from '~/components/LoginRequired.vue'
import CodeHiglighter from '~/components/CodeHiglighter.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'

defineOptions({
  name: 'ProblemResultsPage'
})

const route = useRoute()
const problemSlug = route.params.slug

const { user } = useAuth()
const problemResults = ref([])
const isLoading = ref(true)
const fetchError = ref(null)
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:9000'
const { get } = useApi()

// Pagination state
const page = ref(1)
const pageSize = 6

// Filter state
const filters = ref({
  status: '' // Filter by status description
})

// Judge0 status options
const statusOptions = [
  { id: 1, description: "In Queue" },
  { id: 2, description: "Processing" },
  { id: 3, description: "Accepted" },
  { id: 4, description: "Wrong Answer" },
  { id: 5, description: "Time Limit Exceeded" },
  { id: 6, description: "Compilation Error" },
  { id: 7, description: "Runtime Error (SIGSEGV)" },
  { id: 8, description: "Runtime Error (SIGXFSZ)" },
  { id: 9, description: "Runtime Error (SIGFPE)" },
  { id: 10, description: "Runtime Error (SIGABRT)" },
  { id: 11, description: "Runtime Error (NZEC)" },
  { id: 12, description: "Runtime Error (Other)" },
  { id: 13, description: "Internal Error" },
  { id: 14, description: "Exec Format Error" }
]

const statusFilterOptions = computed(() => {
  return [
    { value: '', title: 'All Statuses' },
    ...statusOptions.map(s => ({ value: s.description, title: s.description }))
  ]
})

const fetchResults = async () => {
  if (!user.value) {
    problemResults.value = []
    isLoading.value = false
    return
  }

  isLoading.value = true
  fetchError.value = null
  try {
    const response = await get(`${apiBaseUrl}/user/result/problem/${problemSlug}`)
    const results = response?.data || response || []

    problemResults.value = results.map((r) => {
      const totalSeconds = r.time_spent || 0
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      const timeSpentFormatted = minutes > 0 ? `${minutes} Minutes ${seconds} Seconds` : `${seconds} Seconds`

      return {
        id: r.id,
        problemId: r.problem_id,
        problemTitle: r.problem_title || 'Unknown Problem',
        difficulty: r.difficulty || 'Unknown',
        completedAt: r.created_at,
        timeSpent: timeSpentFormatted,
        status: r.status_description || 'Unknown',
        executionTime: r.execution_time_ms != null ? `${r.execution_time_ms}ms` : '-',
        platform: r.platform_name || 'Unknown Platform',
        category: r.category_name || 'Unknown Category',
        code: r.code || '',
        stderr: r.stderr || null,
        attempt: r.attempt || null
      }
    })
  } catch (error) {
    console.error('Failed to fetch problem results:', error)
    fetchError.value = 'Failed to load problem results. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchResults()
})

const loading = computed(() => isLoading.value)
const error = computed(() => fetchError.value || null)

// Reset to page 1 when filters change
watch(filters, () => {
  page.value = 1
}, { deep: true })


const totalAttempts = computed(() => problemResults.value.length)
const problemTitle = computed(() => {
  return problemResults.value.length > 0 ? problemResults.value[0].problemTitle : problemSlug
})

// Filtered results based on status filter
const filteredResults = computed(() => {
  if (!filters.value.status) {
    return problemResults.value
  }
  return problemResults.value.filter(result => result.status === filters.value.status)
})

// Frontend pagination - slice the filtered results for current page
const paginatedResults = computed(() => {
  const startIndex = (page.value - 1) * pageSize
  const endIndex = startIndex + pageSize
  return filteredResults.value.slice(startIndex, endIndex)
})
const averageTimeSpent = computed(() => {
  if (problemResults.value.length === 0) return '0s'

  // Get the original time_spent values from ALL results (not just current page)
  const sum = problemResults.value.reduce((acc, r) => {
    // Extract seconds from formatted time string
    const timeStr = r.timeSpent
    if (timeStr.includes('Minutes')) {
      const parts = timeStr.split(' Minutes ')
      const minutes = parseInt(parts[0]) || 0
      const seconds = parseInt(parts[1].replace(' Seconds', '')) || 0
      return acc + (minutes * 60 + seconds)
    } else {
      const seconds = parseInt(timeStr.replace(' Seconds', '')) || 0
      return acc + seconds
    }
  }, 0)

  const averageSeconds = Math.round(sum / problemResults.value.length)
  const minutes = Math.floor(averageSeconds / 60)
  const seconds = averageSeconds % 60

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
})
const bestExecutionTime = computed(() => {
  if (problemResults.value.length === 0) return 0
  // Get best execution time from ALL results (not just current page)
  const executionTimes = problemResults.value
    .map(r => parseInt(r.executionTime) || Infinity)
    .filter(time => time !== Infinity)
  return executionTimes.length > 0 ? Math.min(...executionTimes) : 0
})

const formatDate = (dateString) => {
  return useFormattedDatePreset(dateString, 'dateTime')
}

useHead({
  title: `Hasil Turnamen ${problemTitle.value} - Archeryhub.id`,
  meta: [
    { name: 'description', content: `Lihat semua upaya dan hasil Anda untuk event ${problemTitle.value}.` },
    { name: 'robots', content: 'noindex' }
  ]
})

definePageMeta({
  layout: 'dashboard'
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Enhanced Header Section -->
    <section class="bg-navy text-white relative overflow-hidden rounded-2xl mb-8 border border-primary/20">
      <div class="absolute inset-0 bg-primary/5"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <!-- Breadcrumb & Back -->
        <div class="mb-4">
          <BaseButton to="/dashboard/result" variant="ghost" size="sm" icon="ph:arrow-left"
            class="!text-yellow-100 hover:!text-white">
            Kembali ke Daftar Hasil
          </BaseButton>
        </div>

        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex-1">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-primary backdrop-blur mb-4">
              <Icon :ssr="true" icon="ph:trophy" class="h-4 w-4" />
              <span>Hasil Event</span>
            </div>
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight">
              {{ problemTitle }}
            </h1>
            <p class="text-slate-300 text-lg font-medium">
              Pantau progres kamu dan analisa hasil skor setiap sesi.
            </p>
          </div>

          <!-- Stats Cards -->
          <div v-if="user && !loading && problemResults.length > 0" class="grid grid-cols-3 gap-4 lg:gap-6">
            <div class="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10 shadow-xl">
              <div class="text-2xl lg:text-3xl font-black text-primary">{{ totalAttempts }}</div>
              <div class="text-xs font-bold text-slate-400  tracking-widest mt-1">Sesi</div>
            </div>
            <div class="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10 shadow-xl">
              <div class="text-2xl lg:text-3xl font-black text-primary">{{ averageTimeSpent }}</div>
              <div class="text-xs font-bold text-slate-400  tracking-widest mt-1">Rata-rata</div>
            </div>
            <div class="bg-white/5 backdrop-blur rounded-2xl p-4 text-center border border-white/10 shadow-xl">
              <div class="text-2xl lg:text-3xl font-black text-primary">{{ bestExecutionTime }}ms</div>
              <div class="text-xs font-bold text-slate-400  tracking-widest mt-1">Terbaik</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LoginRequired v-if="!user" title="Login Required"
        message="Please log in to view your event results and track your progress." icon="ph:chart-line"
        primary-action="Login / Register" secondary-action="Go to Homepage" secondary-route="/" primary-icon="ph:user"
        secondary-icon="ph:house" />

      <!-- Enhanced Loading State -->
      <div v-else-if="loading" class="text-center py-16">
        <div class="bg-white rounded-2xl border border-gray-100 p-12 max-w-md mx-auto shadow-sm">
          <div class="flex flex-col items-center gap-6">
            <div class="size-16 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
            <div class="space-y-2">
              <h3 class="text-lg font-bold text-navy">Memuat hasil...</h3>
              <p class="text-slate-500 text-sm">Sabar ya, lagi diproses datanya.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Error State -->
      <div v-if="error" class="text-center py-16">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-lg mx-auto">
          <div class="flex flex-col items-center gap-6">
            <div class="p-4 bg-red-50 rounded-full">
              <Icon :ssr="true" icon="ph:warning-circle" class="w-12 h-12 text-red-500" />
            </div>
            <div class="text-center">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">
                Failed to Load Results
              </h3>
              <p class="text-gray-600 mb-6">
                {{ error }}
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 w-full">
              <BaseButton @click="fetchResults" variant="gold" block icon="ph:arrow-clockwise">
                Coba Lagi
              </BaseButton>

              <BaseButton to="/dashboard/result" variant="outline" block icon="ph:arrow-left">
                Kembali ke Daftar Hasil
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <template v-else-if="!error">
        <!-- Enhanced Filter Controls -->
        <div v-if="user && problemResults.length > 0"
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <div class="p-2 bg-blue-50 rounded-lg">
                  <Icon :ssr="true" icon="ph:funnel" class="w-5 h-5 text-blue-600" />
                </div>
                <h3 class="text-lg font-semibold text-gray-900">Filter Results</h3>
              </div>
              <p class="text-gray-600">Filter submissions by status to analyze your performance</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="min-w-[220px]">
                <BaseSelect v-model="filters.status" :items="statusFilterOptions" placeholder="All Statuses" />
              </div>
              <BaseButton v-if="filters.status" variant="outline" size="sm" icon="ph:x" @click="filters.status = ''">
                Bersihkan
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Enhanced Results Grid -->
        <div class="space-y-6">
          <div v-for="(result, index) in paginatedResults" :key="result.id"
            class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">

            <!-- Result Header -->
            <div class="p-6 border-b border-gray-100">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="flex items-center gap-2">
                      <div class="p-2 bg-gray-50 rounded-lg">
                        <Icon :ssr="true" icon="ph:code" class="w-5 h-5 text-gray-600" />
                      </div>
                      <h3 class="text-lg font-semibold text-gray-900">
                        Attempt #{{ (page - 1) * pageSize + index + 1 }}
                      </h3>
                    </div>
                    <span class="px-3 py-1 text-sm font-medium rounded-full border" :class="result.status === 'Accepted'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : result.status === 'Compilation Error'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-red-50 text-red-700 border-red-200'">
                      <Icon :ssr="true" :icon="result.status === 'Accepted' ? 'ph:check-circle' :
                        result.status === 'Compilation Error' ? 'ph:warning-circle' : 'ph:x-circle'"
                        class="w-3 h-3 mr-1 inline" />
                      {{ result.status }}
                    </span>
                  </div>

                  <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <span class="flex items-center gap-1">
                      <Icon :ssr="true" icon="ph:calendar" class="w-4 h-4" />
                      {{ formatDate(result.completedAt) }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Icon :ssr="true" icon="ph:clock" class="w-4 h-4" />
                      {{ result.timeSpent }}
                    </span>
                    <span class="flex items-center gap-1" v-if="result.platform">
                      <Icon :ssr="true" icon="ph:code" class="w-4 h-4" />
                      {{ result.platform }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Result Metrics -->
            <div class="px-6 py-4 bg-gray-50">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <Icon :ssr="true" icon="ph:lightning" class="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div class="text-sm text-gray-600">Runtime</div>
                    <div class="font-semibold text-gray-900">{{ result.executionTime }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <Icon :ssr="true" icon="tdesign:time" class="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div class="text-sm text-gray-600">Time Spent</div>
                    <div class="font-semibold text-gray-900">{{ result.timeSpent }}</div>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="p-2 bg-purple-100 rounded-lg">
                    <Icon :ssr="true" icon="ph:chart-bar" class="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div class="text-sm text-gray-600">Status</div>
                    <div class="font-semibold text-gray-900">{{ result.status }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error Output (if any) -->
            <div v-if="result.stderr" class="px-6 py-4 border-t border-gray-100">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-center gap-2 mb-3">
                  <Icon :ssr="true" icon="ph:warning" class="w-5 h-5 text-red-600" />
                  <span class="font-medium text-red-800">Error Output</span>
                </div>
                <pre
                  class="text-sm text-red-700 font-mono whitespace-pre-wrap break-words bg-red-25 p-3 rounded border">{{ result.stderr }}</pre>
              </div>
            </div>

            <!-- Code Preview -->
            <div v-if="result.code" class="border-t border-gray-100">
              <div class="flex items-center justify-between px-6 py-3 bg-gray-800">
                <div class="flex items-center gap-2">
                  <Icon :ssr="true" icon="ph:code" class="w-4 h-4 text-gray-400" />
                  <span class="text-sm font-medium text-gray-300">Your Solution</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-gray-400" v-if="result.platform">{{ result.platform }}</span>
                </div>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <CodeHiglighter :code="result.code" />
              </div>
            </div>
          </div>
        </div>

        <!-- Enhanced Pagination Controls -->
        <div v-if="user && !loading && filteredResults.length > pageSize" class="mt-8 flex justify-center">
          <nav class="inline-flex items-center rounded-lg border border-gray-300 bg-white shadow-sm overflow-hidden"
            aria-label="Pagination">
            <BaseButton variant="ghost" size="md" icon="ph:caret-left" :disabled="page === 1"
              class="rounded-none border-r border-gray-300" @click="page > 1 && (page = page - 1)">
              Sebelumnya
            </BaseButton>

            <div class="flex items-center px-6 py-2 bg-gray-50 text-sm font-bold text-navy">
              Halaman {{ page }} dari {{ Math.ceil(filteredResults.length / pageSize) }}
            </div>

            <BaseButton variant="ghost" size="md" icon-right="ph:caret-right"
              :disabled="page >= Math.ceil(filteredResults.length / pageSize)"
              class="rounded-none border-l border-gray-300"
              @click="page < Math.ceil(filteredResults.length / pageSize) && (page = page + 1)">
              Selanjutnya
            </BaseButton>
          </nav>
        </div>

        <!-- Results Summary -->
        <div v-if="user && !loading && paginatedResults.length > 0" class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Showing <span class="font-medium">{{ (page - 1) * pageSize + 1 }}</span> to
            <span class="font-medium">{{ Math.min(page * pageSize, filteredResults.length) }}</span> of
            <span class="font-medium">{{ filteredResults.length }}</span> attempts
            <span v-if="filters.status" class="text-blue-600">(filtered by {{ filters.status }})</span>
          </p>
        </div>

        <!-- Enhanced Empty State for No Results -->
        <div v-if="user && problemResults.length === 0 && !loading" class="text-center py-20">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 max-w-lg mx-auto">
            <div class="p-4 bg-gray-50 rounded-full w-fit mx-auto mb-6">
              <Icon :ssr="true" icon="ph:code" class="w-12 h-12 text-gray-400" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              No attempts yet
            </h3>
            <p class="text-gray-600 mb-8">
              You haven't submitted any solutions for this problem. Start coding to see your results here!
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <BaseButton :to="`/dashboard/${userPersona}/events`" variant="gold" icon="ph:trophy">
                Lihat Turnamen
              </BaseButton>
              <BaseButton to="/dashboard/result" variant="outline" icon="ph:arrow-left">
                Kembali ke Hasil
              </BaseButton>
            </div>
          </div>
        </div>

        <!-- Enhanced Empty State for Filtered Results -->
        <div v-else-if="user && problemResults.length > 0 && filteredResults.length === 0 && !loading"
          class="text-center py-16">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
            <div class="p-3 bg-gray-50 rounded-full w-fit mx-auto mb-4">
              <Icon :ssr="true" icon="ph:funnel" class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              No results match your filter
            </h3>
            <p class="text-gray-600 mb-6">
              Try adjusting your status filter to see more results.
            </p>
            <BaseButton variant="gold" icon="ph:x" @click="filters.status = ''">
              Bersihkan Filter
            </BaseButton>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
