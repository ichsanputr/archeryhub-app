<template>
  <div class="min-h-screen bg-gradient-to-b from-background-dark to-[#050810] -m-8 p-8">
    <!-- Header -->
    <div
      class="h-32 flex items-center justify-between px-8 bg-surface-dark/95 backdrop-blur-md rounded-xl mb-6 shadow-xl border border-surface-highlight relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <div class="flex items-center gap-8">
        <div
          class="h-20 w-20 rounded-xl bg-surface-highlight border border-white/10 flex items-center justify-center shadow-lg group">
          <Icon icon="ph:target"
            class="text-primary text-5xl group-hover:scale-110 transition-transform duration-500" />
        </div>
        <div class="flex flex-col justify-center h-full pt-1">
          <div class="flex items-center gap-3 mb-1">
            <span
              class="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-sm tracking-widest uppercase animate-pulse shadow-md shadow-red-900/20">
              Live
            </span>
            <h2 class="text-primary font-semibold tracking-wider uppercase text-sm border-l border-white/20 pl-3">
              {{ eventName }}
            </h2>
          </div>
          <h1 class="text-white text-4xl font-black tracking-tight leading-none">
            {{ tournamentName }}
          </h1>
        </div>
      </div>

      <!-- Timer -->
      <div class="bg-surface-highlight/50 rounded-xl p-3 border border-white/5 flex items-center gap-2 shadow-inner">
        <div class="flex flex-col items-center gap-1">
          <div class="bg-background-dark w-16 h-20 rounded border border-white/10 flex items-center justify-center">
            <span class="text-4xl font-mono font-bold text-slate-200 tracking-tighter tabular-nums">00</span>
          </div>
          <span class="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Hrs</span>
        </div>
        <span class="text-2xl text-slate-600 font-bold pb-5">:</span>
        <div class="flex flex-col items-center gap-1">
          <div class="bg-background-dark w-16 h-20 rounded border border-white/10 flex items-center justify-center">
            <span class="text-4xl font-mono font-bold text-slate-200 tracking-tighter tabular-nums">{{ minutes }}</span>
          </div>
          <span class="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Min</span>
        </div>
        <span class="text-2xl text-slate-600 font-bold pb-5">:</span>
        <div class="flex flex-col items-center gap-1">
          <div
            class="bg-background-dark w-16 h-20 rounded border border-primary/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,193,7,0.15)]">
            <span class="text-4xl font-mono font-bold text-primary tracking-tighter tabular-nums">{{ seconds }}</span>
          </div>
          <span class="text-[10px] uppercase text-primary font-bold tracking-widest">Sec</span>
        </div>
      </div>
    </div>

    <!-- Leaderboard Header -->
    <div
      class="grid grid-cols-12 gap-4 px-6 py-3 mb-2 rounded-lg bg-surface-highlight/30 border border-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest">
      <div class="col-span-1 text-center">Rank</div>
      <div class="col-span-1 text-center">Trend</div>
      <div class="col-span-4 text-left pl-4">Athlete</div>
      <div class="col-span-1 text-center">End 1</div>
      <div class="col-span-1 text-center">End 2</div>
      <div class="col-span-1 text-center">End 3</div>
      <div class="col-span-1 text-center">End 4</div>
      <div class="col-span-2 text-right pr-6">Total</div>
    </div>

    <!-- Leaderboard Entries -->
    <div class="flex flex-col gap-2.5 overflow-y-auto">
      <div v-for="(entry, index) in leaderboard" :key="entry.id" :class="getRankClass(index + 1)"
        class="grid grid-cols-12 gap-4 items-center rounded-lg p-3 shadow-[0_4px_20px_rgba(0,0,0,0.3)] relative group transition-all duration-300 hover:bg-surface-highlight">
        <div
          class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        </div>

        <!-- Rank -->
        <div class="col-span-1 flex justify-center">
          <div :class="getRankBadgeClass(index + 1)"
            class="w-10 h-10 rounded flex items-center justify-center text-xl font-black shadow-lg">
            {{ index + 1 }}
          </div>
        </div>

        <!-- Trend -->
        <div class="col-span-1 flex justify-center">
          <Icon v-if="entry.trend === 'up'" icon="ph:caret-up-fill" class="text-emerald-500 text-3xl" />
          <Icon v-else-if="entry.trend === 'down'" icon="ph:caret-down-fill" class="text-rose-500 text-3xl" />
          <Icon v-else icon="ph:minus-bold" class="text-slate-500 text-2xl" />
        </div>

        <!-- Athlete -->
        <div class="col-span-4 flex items-center gap-4 pl-2">
          <img :src="entry.flag" :alt="`${entry.country} Flag`"
            class="w-12 h-8 object-cover rounded shadow-md ring-1 ring-white/10" />
          <div class="flex flex-col">
            <span class="text-white text-xl font-bold leading-tight tracking-tight">{{ entry.name }}</span>
            <span class="text-primary text-xs font-semibold uppercase tracking-wide">{{ entry.city || '-' }}</span>
          </div>
        </div>

        <!-- Scores -->
        <div class="col-span-1 text-center text-xl font-bold text-slate-300 tabular-nums font-mono">{{ entry.end1 }}
        </div>
        <div class="col-span-1 text-center text-xl font-bold text-slate-300 tabular-nums font-mono">{{ entry.end2 }}
        </div>
        <div class="col-span-1 text-center text-xl font-bold text-slate-300 tabular-nums font-mono">{{ entry.end3 }}
        </div>
        <div class="col-span-1 text-center text-xl font-bold tabular-nums font-mono"
          :class="index === 0 ? 'text-primary animate-pulse' : 'text-slate-300'">
          {{ entry.end4 }}
        </div>

        <!-- Total -->
        <div class="col-span-2 text-right pr-6">
          <span class="text-4xl font-black tracking-tighter tabular-nums"
            :class="index === 0 ? 'text-primary' : 'text-white'">
            {{ entry.total }}
          </span>
        </div>
      </div>
    </div>

    <!-- Ticker Footer -->
    <div
      class="mt-6 flex items-stretch h-16 bg-surface-dark border-t border-primary/30 rounded-xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)] overflow-hidden">
      <div
        class="bg-primary text-background-dark font-black px-8 flex items-center justify-center shrink-0 skew-x-[-12deg] -ml-4 pl-8 border-r-4 border-white/10">
        <div class="skew-x-[12deg] flex items-center gap-2">
          <Icon icon="ph:megaphone-bold" />
          <span>UPDATES</span>
        </div>
      </div>
      <div class="flex-1 flex items-center overflow-hidden">
        <div
          class="animate-[ticker_40s_linear_infinite] text-xl font-medium text-slate-200 tracking-wide whitespace-nowrap">
          {{ tickerText }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  title: 'Live Leaderboard',
  layout: 'default'
})

const route = useRoute()
const { get } = useApi()
const config = useRuntimeConfig()

const tournamentID = route.params.id
const tournamentName = ref('Loading Tournament...')
const eventName = ref('All Events')
const minutes = ref(0)
const seconds = ref(0)
const tickerText = ref('Connecting to live updates...')

const leaderboard = ref([])
const loading = ref(false)

let ws = null
let timerInterval = null

const fetchRankings = async () => {
  try {
    const res = await get(`/events/${tournamentID}/rankings`)
    if (res && res.rankings) {
      // Map API ranking to entries with trend if possible
      leaderboard.value = res.rankings.map(r => ({
        id: r.athlete_id,
        name: r.athlete_name,
        city: r.city || '-',
        total: r.total_score,
        rank: r.rank,
        // For ends, we might need a more detailed endpoint or default to 0
        end1: '-', end2: '-', end3: '-', end4: '-',
        trend: '' // Initial trend is empty
      }))
    }
  } catch (error) {
    console.error('Failed to fetch rankings:', error)
  }
}

const fetchTournamentDetails = async () => {
  try {
    const res = await get(`/events/${tournamentID}`)
    if (res) {
      tournamentName.value = res.name
    }
  } catch (error) {
    console.error('Failed to fetch tournament details:', error)
  }
}

const connectWebSocket = () => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  // Extract host from apiBaseUrl
  const apiHost = config.public.apiBaseUrl.replace(/^https?:\/\//, '')
  const wsUrl = `${wsProtocol}//${apiHost}/ws/live/${tournamentID}`

  ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    tickerText.value = 'Live updates connected. Waiting for scores...'
  }

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data)
      if (msg.type === 'score_update' || msg.type === 'match_update') {
        fetchRankings()
        tickerText.value = `Update received: New score for participant ${msg.data.participant_id || 'athlete'}`
      }
    } catch (e) {
      console.error('WS message error:', e)
    }
  }

  ws.onclose = () => {
    tickerText.value = 'Connection lost. Reconnecting...'
    setTimeout(connectWebSocket, 5000)
  }
}

onMounted(() => {
  fetchTournamentDetails()
  fetchRankings()
  connectWebSocket()

  // Simplified timer behavior
  timerInterval = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--
    } else if (minutes.value > 0) {
      minutes.value--
      seconds.value = 59
    }
  }, 1000)
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
  if (ws) ws.close()
})

const getRankClass = (rank) => {
  if (rank === 1) return 'bg-surface-card border-l-4 border-primary border-y border-r border-y-primary/20 border-r-primary/20'
  return 'bg-surface-card/80 border border-white/5 hover:border-white/10'
}

const getRankBadgeClass = (rank) => {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return 'text-slate-600'
}
</script>

<style>
@keyframes ticker {
  0% {
    transform: translateX(100%);
  }

  100% {
    transform: translateX(-100%);
  }
}
</style>
