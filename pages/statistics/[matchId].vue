<template>
  <div class="min-h-screen bg-[#23200f]">
    <!-- Header -->
    <div class="border-b border-[#4a4421] bg-[#23200f]/95 backdrop-blur px-6 py-4 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <nav class="flex items-center gap-2 text-sm text-[#ccc38e] mb-1">
            <NuxtLink to="/tournaments" class="hover:text-white">Tournaments</NuxtLink>
            <span class="material-symbols-outlined text-sm">chevron_right</span>
            <span class="text-white">Match Statistics</span>
          </nav>
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            <span class="material-symbols-outlined text-[#f9d406]">analytics</span>
            Match Statistics
          </h1>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-[#f9d406] border-t-transparent"></div>
      </div>

      <div v-else-if="!stats" class="text-center py-20">
        <span class="material-symbols-outlined text-6xl text-[#4a4421]">query_stats</span>
        <p class="text-[#ccc38e] mt-4">Match not found</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Match Overview -->
        <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-6">
          <h2 class="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <span class="material-symbols-outlined text-[#f9d406]">sports_martial_arts</span>
            Match Overview
          </h2>
          
          <div class="flex items-center justify-center gap-8">
            <!-- Participant 1 -->
            <div class="text-center flex-1">
              <div class="w-20 h-20 rounded-full bg-[#4a4421] mx-auto mb-3 flex items-center justify-center" :class="stats.winner_id === stats.participant1?.id ? 'ring-4 ring-green-500' : ''">
                <span class="text-[#ccc38e] font-bold text-2xl">
                  {{ stats.participant1?.first_name?.[0] }}{{ stats.participant1?.last_name?.[0] }}
                </span>
              </div>
              <p class="text-white font-bold">{{ stats.participant1?.first_name }} {{ stats.participant1?.last_name }}</p>
              <p class="text-[#ccc38e] text-sm">{{ stats.participant1?.country || '-' }}</p>
              <p class="text-3xl font-bold mt-2" :class="stats.winner_id === stats.participant1?.id ? 'text-green-500' : 'text-white'">
                {{ stats.score1 }}
              </p>
            </div>

            <div class="text-center">
              <span class="text-[#4a4421] text-4xl font-bold">VS</span>
              <p class="text-[#ccc38e] text-sm mt-2">{{ stats.round }}</p>
            </div>

            <!-- Participant 2 -->
            <div class="text-center flex-1">
              <div class="w-20 h-20 rounded-full bg-[#4a4421] mx-auto mb-3 flex items-center justify-center" :class="stats.winner_id === stats.participant2?.id ? 'ring-4 ring-green-500' : ''">
                <span class="text-[#ccc38e] font-bold text-2xl">
                  {{ stats.participant2?.first_name?.[0] }}{{ stats.participant2?.last_name?.[0] }}
                </span>
              </div>
              <p class="text-white font-bold">{{ stats.participant2?.first_name }} {{ stats.participant2?.last_name }}</p>
              <p class="text-[#ccc38e] text-sm">{{ stats.participant2?.country || '-' }}</p>
              <p class="text-3xl font-bold mt-2" :class="stats.winner_id === stats.participant2?.id ? 'text-green-500' : 'text-white'">
                {{ stats.score2 }}
              </p>
            </div>
          </div>
        </div>

        <!-- Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
            <p class="text-[#ccc38e] text-sm">Total Arrows</p>
            <p class="text-white text-3xl font-bold">{{ stats.total_arrows }}</p>
          </div>
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
            <p class="text-[#ccc38e] text-sm">Average Score</p>
            <p class="text-[#f9d406] text-3xl font-bold">{{ stats.average_score?.toFixed(1) }}</p>
          </div>
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
            <p class="text-[#ccc38e] text-sm">Highest Arrow</p>
            <p class="text-green-500 text-3xl font-bold">{{ stats.highest_arrow === 11 ? 'X' : stats.highest_arrow }}</p>
          </div>
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
            <p class="text-[#ccc38e] text-sm">Duration</p>
            <p class="text-white text-3xl font-bold">{{ formatDuration(stats.duration_seconds) }}</p>
          </div>
        </div>

        <!-- Participant Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- P1 Stats -->
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] overflow-hidden">
            <div class="px-6 py-4 border-b border-[#4a4421] bg-[#4a4421]/20">
              <h3 class="text-white font-bold">{{ stats.participant1?.first_name }} {{ stats.participant1?.last_name }}</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center">
                  <p class="text-[#ccc38e] text-xs uppercase mb-1">Score</p>
                  <p class="text-white text-xl font-bold">{{ stats.participant1_stats?.total_score || stats.score1 }}</p>
                </div>
                <div class="text-center">
                  <p class="text-[#ccc38e] text-xs uppercase mb-1">X Count</p>
                  <p class="text-[#f9d406] text-xl font-bold">{{ stats.participant1_stats?.x_count || 0 }}</p>
                </div>
                <div class="text-center">
                  <p class="text-[#ccc38e] text-xs uppercase mb-1">10s</p>
                  <p class="text-white text-xl font-bold">{{ stats.participant1_stats?.ten_count || 0 }}</p>
                </div>
              </div>
              
              <!-- Score Distribution -->
              <div class="space-y-2">
                <p class="text-[#ccc38e] text-xs uppercase mb-2">Score Distribution</p>
                <div v-for="score in [10, 9, 8, 7, 6]" :key="score" class="flex items-center gap-3">
                  <span class="w-6 text-[#ccc38e] text-sm">{{ score }}</span>
                  <div class="flex-1 bg-[#4a4421]/30 rounded-full h-2 overflow-hidden">
                    <div 
                      class="bg-[#f9d406] h-full rounded-full transition-all"
                      :style="{ width: getDistributionWidth(stats.participant1_stats, score) }"
                    ></div>
                  </div>
                  <span class="w-8 text-right text-[#ccc38e] text-sm">
                    {{ stats.participant1_stats?.distribution?.[score] || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- P2 Stats -->
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] overflow-hidden">
            <div class="px-6 py-4 border-b border-[#4a4421] bg-[#4a4421]/20">
              <h3 class="text-white font-bold">{{ stats.participant2?.first_name }} {{ stats.participant2?.last_name }}</h3>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-3 gap-4 mb-6">
                <div class="text-center">
                  <p class="text-[#ccc38e] text-xs uppercase mb-1">Score</p>
                  <p class="text-white text-xl font-bold">{{ stats.participant2_stats?.total_score || stats.score2 }}</p>
                </div>
                <div class="text-center">
                  <p class="text-[#ccc38e] text-xs uppercase mb-1">X Count</p>
                  <p class="text-[#f9d406] text-xl font-bold">{{ stats.participant2_stats?.x_count || 0 }}</p>
                </div>
                <div class="text-center">
                  <p class="text-[#ccc38e] text-xs uppercase mb-1">10s</p>
                  <p class="text-white text-xl font-bold">{{ stats.participant2_stats?.ten_count || 0 }}</p>
                </div>
              </div>
              
              <!-- Score Distribution -->
              <div class="space-y-2">
                <p class="text-[#ccc38e] text-xs uppercase mb-2">Score Distribution</p>
                <div v-for="score in [10, 9, 8, 7, 6]" :key="score" class="flex items-center gap-3">
                  <span class="w-6 text-[#ccc38e] text-sm">{{ score }}</span>
                  <div class="flex-1 bg-[#4a4421]/30 rounded-full h-2 overflow-hidden">
                    <div 
                      class="bg-[#f9d406] h-full rounded-full transition-all"
                      :style="{ width: getDistributionWidth(stats.participant2_stats, score) }"
                    ></div>
                  </div>
                  <span class="w-8 text-right text-[#ccc38e] text-sm">
                    {{ stats.participant2_stats?.distribution?.[score] || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { $api } = useNuxtApp()

const matchId = computed(() => route.params.matchId)
const loading = ref(true)
const stats = ref(null)

const formatDuration = (seconds) => {
  if (!seconds) return '-'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const getDistributionWidth = (pStats, score) => {
  if (!pStats?.distribution) return '0%'
  const total = Object.values(pStats.distribution).reduce((a, b) => a + b, 0)
  if (total === 0) return '0%'
  const count = pStats.distribution[score] || 0
  return `${(count / total) * 100}%`
}

const fetchStats = async () => {
  loading.value = true
  try {
    const { data } = await $api(`/statistics/matches/${matchId.value}`)
    stats.value = data
  } catch (e) {
    console.error('Failed to fetch match statistics:', e)
    stats.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>
