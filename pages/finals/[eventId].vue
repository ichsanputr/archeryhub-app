<template>
  <div class="min-h-screen bg-[#23200f]">
    <!-- Header -->
    <div class="border-b border-[#4a4421] bg-[#23200f]/95 backdrop-blur px-6 py-4 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <nav class="flex items-center gap-2 text-sm text-[#ccc38e] mb-1">
            <NuxtLink to="/tournaments" class="hover:text-white">Tournaments</NuxtLink>
            <span class="material-symbols-outlined text-sm">chevron_right</span>
            <span class="text-white">Finals</span>
          </nav>
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            <span class="material-symbols-outlined text-[#f9d406]">emoji_events</span>
            {{ event?.name || 'Finals Bracket' }}
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="advancePhase"
            :disabled="!canAdvance"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4a4421] text-white hover:bg-[#5a5329] transition-colors font-medium text-sm disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
            Advance Phase
          </button>
          <button 
            @click="showRankings = true"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f9d406] text-[#23200f] hover:bg-yellow-400 transition-colors font-bold text-sm"
          >
            <span class="material-symbols-outlined text-lg">leaderboard</span>
            Final Rankings
          </button>
        </div>
      </div>
    </div>

    <!-- Phase Selector -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex items-center gap-2 overflow-x-auto pb-2">
        <button 
          v-for="phase in phases" 
          :key="phase.value"
          @click="selectedPhase = phase.value"
          class="whitespace-nowrap px-4 py-2 rounded-lg font-medium text-sm transition-colors"
          :class="selectedPhase === phase.value 
            ? 'bg-[#f9d406] text-[#23200f]' 
            : 'bg-[#4a4421] text-white hover:bg-[#5a5329]'"
        >
          {{ phase.label }}
        </button>
      </div>
    </div>

    <!-- Bracket View -->
    <div class="max-w-7xl mx-auto px-6 pb-8">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-[#f9d406] border-t-transparent"></div>
      </div>

      <div v-else-if="matches.length === 0" class="text-center py-20">
        <span class="material-symbols-outlined text-6xl text-[#4a4421]">conversion_path</span>
        <p class="text-[#ccc38e] mt-4">No matches in this phase</p>
      </div>

      <div v-else class="grid gap-4" :class="getGridClass">
        <div 
          v-for="match in matches" 
          :key="match.id"
          @click="selectMatch(match)"
          class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] overflow-hidden cursor-pointer hover:border-[#f9d406]/50 transition-all group"
        >
          <!-- Match Header -->
          <div class="px-4 py-3 bg-[#4a4421]/30 border-b border-[#4a4421] flex items-center justify-between">
            <span class="text-[#ccc38e] text-sm font-medium">
              Match {{ match.match_number }}
            </span>
            <span 
              class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="getMatchStatusClass(match.status)"
            >
              {{ match.status }}
            </span>
          </div>

          <!-- Competitors -->
          <div class="divide-y divide-[#4a4421]">
            <!-- Player 1 -->
            <div 
              class="px-4 py-4 flex items-center gap-4 transition-colors"
              :class="match.winner_id === match.participant1?.id ? 'bg-green-900/20' : ''"
            >
              <div class="w-8 h-8 rounded-full bg-[#4a4421] flex items-center justify-center text-sm font-bold text-[#ccc38e]">
                {{ match.participant1?.qual_rank || '-' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium truncate">
                  {{ match.participant1?.first_name }} {{ match.participant1?.last_name }}
                </p>
                <p class="text-[#ccc38e] text-xs truncate">
                  {{ match.participant1?.country || 'TBD' }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-white text-xl font-bold tabular-nums">{{ match.score1 }}</p>
                <p v-if="match.set_score1" class="text-[#f9d406] text-xs font-medium">
                  {{ match.set_score1 }} sets
                </p>
              </div>
              <span 
                v-if="match.winner_id === match.participant1?.id"
                class="material-symbols-outlined text-green-400"
              >
                check_circle
              </span>
            </div>

            <!-- Player 2 -->
            <div 
              class="px-4 py-4 flex items-center gap-4 transition-colors"
              :class="match.winner_id === match.participant2?.id ? 'bg-green-900/20' : ''"
            >
              <div class="w-8 h-8 rounded-full bg-[#4a4421] flex items-center justify-center text-sm font-bold text-[#ccc38e]">
                {{ match.participant2?.qual_rank || '-' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-white font-medium truncate">
                  {{ match.participant2?.first_name }} {{ match.participant2?.last_name }}
                </p>
                <p class="text-[#ccc38e] text-xs truncate">
                  {{ match.participant2?.country || 'TBD' }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-white text-xl font-bold tabular-nums">{{ match.score2 }}</p>
                <p v-if="match.set_score2" class="text-[#f9d406] text-xs font-medium">
                  {{ match.set_score2 }} sets
                </p>
              </div>
              <span 
                v-if="match.winner_id === match.participant2?.id"
                class="material-symbols-outlined text-green-400"
              >
                check_circle
              </span>
            </div>
          </div>

          <!-- Match Actions -->
          <div v-if="match.status !== 'completed'" class="px-4 py-3 bg-[#4a4421]/20 flex gap-2">
            <button 
              v-if="match.status === 'pending'"
              @click.stop="startMatch(match)"
              class="flex-1 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-500 transition-colors"
            >
              Start Match
            </button>
            <button 
              v-if="match.status === 'ongoing'"
              @click.stop="openScoreModal(match)"
              class="flex-1 py-2 rounded-lg bg-[#f9d406] text-[#23200f] text-sm font-bold hover:bg-yellow-400 transition-colors"
            >
              Enter Score
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Final Rankings Modal -->
    <Teleport to="body">
      <div 
        v-if="showRankings" 
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showRankings = false"
      >
        <div class="bg-[#2E2B1B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#4a4421]">
          <div class="p-6 border-b border-[#4a4421] flex items-center justify-between">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-[#f9d406]">emoji_events</span>
              Final Rankings
            </h2>
            <button 
              @click="showRankings = false"
              class="p-2 rounded-lg hover:bg-[#4a4421] text-[#ccc38e] hover:text-white transition-colors"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div class="overflow-y-auto max-h-[70vh]">
            <table class="w-full">
              <thead class="bg-[#4a4421]/30 sticky top-0">
                <tr>
                  <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Rank</th>
                  <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Athlete</th>
                  <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Medal</th>
                  <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Phase</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#4a4421]">
                <tr 
                  v-for="r in rankings" 
                  :key="r.athlete_id"
                  class="hover:bg-[#4a4421]/20"
                >
                  <td class="px-6 py-4">
                    <span 
                      class="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                      :class="getMedalClass(r.rank)"
                    >
                      {{ r.rank }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-white font-medium">{{ r.athlete_name }}</p>
                    <p class="text-[#ccc38e] text-sm">{{ r.country || '-' }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span v-if="r.medal" class="flex items-center gap-1">
                      <span class="material-symbols-outlined" :class="getMedalIconClass(r.medal)">
                        workspace_premium
                      </span>
                      {{ r.medal }}
                    </span>
                    <span v-else class="text-[#ccc38e]">-</span>
                  </td>
                  <td class="px-6 py-4 text-[#ccc38e]">{{ r.final_phase }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Score Entry Modal -->
    <Teleport to="body">
      <div 
        v-if="scoreModal.show" 
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="scoreModal.show = false"
      >
        <div class="bg-[#2E2B1B] rounded-2xl w-full max-w-md border border-[#4a4421]">
          <div class="p-6 border-b border-[#4a4421]">
            <h2 class="text-xl font-bold text-white">Complete Match</h2>
            <p class="text-[#ccc38e] text-sm mt-1">Select the winner</p>
          </div>
          
          <div class="p-6 space-y-4">
            <button 
              @click="completeMatch(scoreModal.match.participant1?.id)"
              class="w-full p-4 rounded-xl border border-[#4a4421] text-left hover:border-green-500 hover:bg-green-900/20 transition-all"
            >
              <p class="text-white font-bold">
                {{ scoreModal.match.participant1?.first_name }} {{ scoreModal.match.participant1?.last_name }}
              </p>
              <p class="text-[#ccc38e] text-sm">Score: {{ scoreModal.match.score1 }}</p>
            </button>

            <button 
              @click="completeMatch(scoreModal.match.participant2?.id)"
              class="w-full p-4 rounded-xl border border-[#4a4421] text-left hover:border-green-500 hover:bg-green-900/20 transition-all"
            >
              <p class="text-white font-bold">
                {{ scoreModal.match.participant2?.first_name }} {{ scoreModal.match.participant2?.last_name }}
              </p>
              <p class="text-[#ccc38e] text-sm">Score: {{ scoreModal.match.score2 }}</p>
            </button>
          </div>

          <div class="px-6 pb-6">
            <button 
              @click="scoreModal.show = false"
              class="w-full py-3 rounded-lg border border-[#4a4421] text-[#ccc38e] hover:bg-[#4a4421] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const route = useRoute()
const { $api } = useNuxtApp()

const eventId = computed(() => route.params.eventId)
const loading = ref(true)
const event = ref(null)
const matches = ref([])
const rankings = ref([])
const selectedPhase = ref('QF')
const showRankings = ref(false)
const scoreModal = ref({ show: false, match: null })

const phases = [
  { value: 'R32', label: 'Round of 32' },
  { value: 'R16', label: 'Round of 16' },
  { value: 'QF', label: 'Quarter Finals' },
  { value: 'SF', label: 'Semi Finals' },
  { value: 'BM', label: 'Bronze Match' },
  { value: 'GM', label: 'Gold Match' }
]

const canAdvance = computed(() => {
  return matches.value.every(m => m.status === 'completed')
})

const getGridClass = computed(() => {
  const count = matches.value.length
  if (count <= 2) return 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto'
  if (count <= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
})

const getMatchStatusClass = (status) => {
  const classes = {
    pending: 'bg-[#4a4421] text-[#ccc38e]',
    ongoing: 'bg-green-900/40 text-green-400 border border-green-800',
    completed: 'bg-blue-900/40 text-blue-400 border border-blue-800'
  }
  return classes[status] || classes.pending
}

const getMedalClass = (rank) => {
  if (rank === 1) return 'bg-yellow-500 text-black'
  if (rank === 2) return 'bg-gray-300 text-black'
  if (rank === 3) return 'bg-amber-700 text-white'
  return 'bg-[#4a4421] text-[#ccc38e]'
}

const getMedalIconClass = (medal) => {
  const classes = {
    GOLD: 'text-yellow-500',
    SILVER: 'text-gray-300',
    BRONZE: 'text-amber-700'
  }
  return classes[medal] || 'text-[#ccc38e]'
}

const fetchMatches = async () => {
  loading.value = true
  try {
    const { data } = await $api(`/elimination/events/${eventId.value}/bracket`)
    const allMatches = data?.matches || []
    matches.value = allMatches.filter(m => m.round === selectedPhase.value)
  } catch (e) {
    console.error('Failed to fetch matches:', e)
    matches.value = []
  } finally {
    loading.value = false
  }
}

const fetchRankings = async () => {
  try {
    const { data } = await $api(`/finals/events/${eventId.value}/rankings`)
    rankings.value = data?.rankings || []
  } catch (e) {
    console.error('Failed to fetch rankings:', e)
  }
}

const selectMatch = async (match) => {
  try {
    const { data } = await $api(`/finals/matches/${match.id}`)
    // Store full match details
  } catch (e) {
    console.error('Failed to fetch match details:', e)
  }
}

const startMatch = async (match) => {
  try {
    await $api(`/finals/matches/${match.id}/start`, { method: 'POST' })
    await fetchMatches()
  } catch (e) {
    console.error('Failed to start match:', e)
  }
}

const openScoreModal = (match) => {
  scoreModal.value = { show: true, match }
}

const completeMatch = async (winnerId) => {
  try {
    await $api(`/finals/matches/${scoreModal.value.match.id}/complete`, {
      method: 'POST',
      body: { winner_id: winnerId }
    })
    scoreModal.value.show = false
    await fetchMatches()
  } catch (e) {
    console.error('Failed to complete match:', e)
  }
}

const advancePhase = async () => {
  try {
    await $api(`/finals/events/${eventId.value}/advance`, {
      method: 'POST',
      body: { current_phase: selectedPhase.value }
    })
    // Move to next phase
    const currentIdx = phases.findIndex(p => p.value === selectedPhase.value)
    if (currentIdx < phases.length - 1) {
      selectedPhase.value = phases[currentIdx + 1].value
    }
    await fetchMatches()
  } catch (e) {
    console.error('Failed to advance phase:', e)
  }
}

watch(selectedPhase, () => fetchMatches())
watch(() => showRankings.value, (val) => {
  if (val) fetchRankings()
})

onMounted(() => {
  fetchMatches()
})
</script>
