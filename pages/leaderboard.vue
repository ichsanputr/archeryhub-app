<script setup>
import { ref, watch, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useHead, useAsyncData, useRuntimeConfig } from '#app'
import { useApi } from '~/composables/useApi'

// Define component name to fix linter error
defineOptions({
  name: 'LeaderboardPage'
})

const leaderboard = ref([])

const getRankStyle = (rank) => {
  switch (rank) {
    case 1:
      return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
    case 2:
      return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
    case 3:
      return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

const formatMinutes = (m) => `${Math.round(Number(m || 0))}m`
const formatMs = (ms) => `${Math.round(Number(ms || 0))}ms`

const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl || 'http://localhost:9000'
const { get } = useApi()

const { data: leaderboardData, error: loadError, refresh: fetchLeaderboard } = await useAsyncData('leaderboard', async () => {
  const data = await get(`${apiBaseUrl}/public/leaderboard`)

  const sorted = Array.isArray(data)
    ? [...data].sort((a, b) => (Number(b?.solved_count || 0) - Number(a?.solved_count || 0)))
    : []

  return sorted.map((u, index) => ({
    id: u.id,
    rank: index + 1,
    username: u.username,
    name: u.name || u.username,
    avatar: u.avatar_url,
    problemsSolved: Number(u.solved_count || 0),
    avgTimeSpentMinutes: Number(u.avg_time_spent || 0),
    avgExecutionTimeMs: Number(u.avg_execution_time_ms || 0),
    profileUrl: u.github_profile_url || null
  }))
})

watch(leaderboardData, (val) => {
  leaderboard.value = val || []
}, { immediate: true })

const podiumUsers = computed(() => {
  const top = leaderboard.value.slice(0, 3)
  if (top.length < 3) return top
  // Order: 2nd (left), 1st (center), 3rd (right)
  return [top[1], top[0], top[2]]
})

// SEO
const route = useRoute()
useHead({
  title: 'Leaderboard - Rust Coding Challenge',
  meta: [
    { name: 'robots', content: 'noindex' },
    { name: 'description', content: 'See who are the top Rust programmers in our coding challenge platform.' }
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
        class="mb-8 relative overflow-hidden rounded-2xl border border-yellow-100 bg-gradient-to-r from-yellow-50 via-white to-orange-50">
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-yellow-200/40 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-200/40 blur-3xl"></div>
        <div class="relative p-6 sm:p-8 max-w-4xl mx-auto">
          <div class="text-center mb-6">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-yellow-200 bg-white/70 px-3 py-1 text-sm text-yellow-700 shadow-sm backdrop-blur">
              <Icon :ssr="true" icon="ph:trophy" class="h-4 w-4" />
              <span>Top Rankings</span>
            </div>
            <h1 class="mt-4 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-gray-900">
              Leaderboard
            </h1>
          </div>
          <div class="space-y-4 text-left text-sm sm:text-base text-gray-600">
            <p class="text-center">
              Welcome to the BudiBadu Leaderboard — a showcase of top programmers who excel in problem-solving,
              consistency, and mastery across languages like Rust, Python, Java, PHP, JavaScript, and TypeScript. </p>
          </div>
        </div>
      </div>

      <div class="w-full">
        <ClientOnly>
          <Adsense key="mobile-header-ad-2" client="ca-pub-1356911639243870" ad-slot="4242301831" format="auto"
            responsive="true" :style="{ display: 'block', width: '100%', minHeight: '100px' }" />
        </ClientOnly>
      </div>

      <!-- Main Content -->
      <div class="max-w-4xl mx-auto md:mt-16">
        <div v-if="loadError" class="text-center py-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <div class="flex flex-col items-center gap-3">
              <Icon :ssr="true" icon="ph:warning-circle" class="w-8 h-8 text-red-500" />
              <div class="text-sm text-gray-700">{{ loadError?.message || 'Failed to load leaderboard.' }}</div>
              <button @click="fetchLeaderboard"
                class="mt-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm">Retry</button>
            </div>
          </div>
        </div>
        <template v-else>
          <!-- Top 3 Podium -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 items-end">
            <div v-for="user in podiumUsers" :key="user.id || user.rank" class="text-center">
              <div :class="[
                'relative bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-300 hover:shadow-md',
                user.rank === 1 ? 'sm:-mt-6 ring-2 ring-yellow-400' : 'sm:mt-0'
              ]">
                <!-- Winner Crown -->
                <div v-if="user.rank === 1" class="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Icon :ssr="true" icon="ph:crown-simple"
                    class="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 drop-shadow" />
                </div>

                <!-- Rank Badge -->
                <div class="relative mb-3 sm:mb-4">
                  <img :src="user.avatar" :alt="user.name"
                    class="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto border-4 border-white shadow-sm" />
                  <div
                    :class="['absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold', getRankStyle(user.rank)]">
                    {{ user.rank }}
                  </div>
                </div>

                <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-1"
                  :class="user.rank === 1 ? 'text-gray-900' : ''">{{ user.name }}</h3>
                <p class="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">@{{ user.username }}</p>

                <div
                  :class="['font-bold text-yellow-600', user.rank === 1 ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl']">
                  {{ user.problemsSolved }}</div>
                <div class="text-xs sm:text-sm text-gray-500 mb-3">solved</div>
              </div>

              <!-- Pedestal -->
              <div class="mt-2 sm:mt-3 flex justify-center">
                <div :class="[
                  'h-2 rounded-t-md bg-gradient-to-t from-gray-200 to-gray-100 w-20 sm:w-24',
                  user.rank === 1 ? 'h-3 w-28 sm:w-32 from-yellow-200 to-yellow-100' : user.rank === 2 ? 'opacity-90' : 'opacity-80'
                ]"></div>
              </div>
            </div>
          </div>

          <!-- Full Leaderboard -->
          <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div class="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-gray-50">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Rankings</h3>
            </div>

            <div class="divide-y divide-gray-200">
              <div v-for="user in leaderboard" :key="user.id || user.rank"
                class="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                <div class="grid grid-cols-12 gap-3 sm:gap-4 items-center">
                  <!-- Rank circle -->
                  <div class="col-span-2 sm:col-span-1 flex justify-start">
                    <div
                      :class="['w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold', getRankStyle(user.rank)]">
                      {{ user.rank }}
                    </div>
                  </div>

                  <!-- User Info -->
                  <div class="col-span-10 sm:col-span-6 flex items-center space-x-3 min-w-0">
                    <img :src="user.avatar" :alt="user.name"
                      class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 flex-shrink-0" />
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 min-w-0">
                        <div class="font-semibold text-gray-900 text-sm sm:text-base truncate">{{ user.name }}</div>
                      </div>
                      <div class="text-xs sm:text-sm text-gray-500 truncate">@{{ user.username }}</div>
                    </div>
                  </div>

                  <!-- Averages chips -->
                  <div class="col-span-12 sm:col-span-5 flex justify-start sm:justify-end gap-2">
                    <div class="flex justify-end sm:justify-end gap-2">
                      <div
                        class="px-2 py-1 rounded border bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 text-[10px] sm:text-xs flex items-center gap-1">
                        <Icon :ssr="true" icon="ph:clock" class="w-3 h-3" />
                        <span>Avg {{ formatMinutes(user.avgTimeSpentMinutes) }}</span>
                      </div>
                      <div
                        class="px-2 py-1 rounded border bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200 text-yellow-700 text-[10px] sm:text-xs flex items-center gap-1">
                        <Icon :ssr="true" icon="ph:lightning" class="w-3 h-3" />
                        <span>{{ formatMs(user.avgExecutionTimeMs) }}</span>
                      </div>
                    </div>

                    <!-- Solved count -->
                    <div class="col-span-6 sm:col-span-6 flex sm:justify-end justify-start items-center">
                      <div class="flex items-center gap-2">
                        <div
                          class="px-2 py-1 rounded border bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-700 text-[10px] sm:text-xs flex items-center gap-1">
                          <Icon :ssr="true" icon="ph:medal" class="w-3 h-3" />
                          <span> {{ user.problemsSolved }} Solved</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>
    </div>
  </div>
</template>
