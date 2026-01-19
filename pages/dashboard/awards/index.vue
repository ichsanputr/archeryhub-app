<template>
  <div class="min-h-screen bg-[#23200f]">
    <!-- Header -->
    <div class="border-b border-[#4a4421] bg-[#23200f]/95 backdrop-blur px-6 py-4 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            <span class="material-symbols-outlined text-[#f9d406]">workspace_premium</span>
            Awards & Medals
          </h1>
          <p class="text-[#ccc38e] text-sm mt-1">Track medals and ceremony status</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="showAutoAward = true"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f9d406] text-[#23200f] hover:bg-yellow-400 transition-colors font-bold text-sm">
            <span class="material-symbols-outlined text-lg">auto_fix_high</span>
            Auto Award Medals
          </button>
        </div>
      </div>
    </div>

    <!-- Tournament/Event Filter -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex gap-4">
        <select v-model="selectedTournament"
          class="bg-[#2E2B1B] border border-[#4a4421] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-[#f9d406]/50">
          <option value="">All Tournaments</option>
          <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
      </div>
    </div>

    <!-- Medal Table -->
    <div class="max-w-7xl mx-auto px-6 pb-8">
      <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] overflow-hidden mb-8">
        <div class="px-6 py-4 border-b border-[#4a4421] bg-[#4a4421]/20 flex items-center justify-between">
          <h2 class="text-white font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-[#f9d406]">leaderboard</span>
            Medal Table by Country
          </h2>
        </div>

        <div v-if="loadingMedals" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-[#f9d406] border-t-transparent"></div>
        </div>

        <table v-else class="w-full">
          <thead class="bg-[#4a4421]/30">
            <tr>
              <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Rank</th>
              <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Country</th>
              <th class="px-6 py-4 text-center text-yellow-500 text-xs font-semibold uppercase">
                <span class="material-symbols-outlined text-lg">workspace_premium</span>
              </th>
              <th class="px-6 py-4 text-center text-gray-300 text-xs font-semibold uppercase">
                <span class="material-symbols-outlined text-lg">workspace_premium</span>
              </th>
              <th class="px-6 py-4 text-center text-amber-700 text-xs font-semibold uppercase">
                <span class="material-symbols-outlined text-lg">workspace_premium</span>
              </th>
              <th class="px-6 py-4 text-center text-[#ccc38e] text-xs font-semibold uppercase">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#4a4421]">
            <tr v-for="(m, idx) in medalTable" :key="m.country" class="hover:bg-[#4a4421]/20">
              <td class="px-6 py-4 text-white font-bold">{{ idx + 1 }}</td>
              <td class="px-6 py-4 text-white font-medium flex items-center gap-2">
                <span class="material-symbols-outlined text-[#ccc38e] text-sm">flag</span>
                {{ m.country }}
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 font-bold">
                  {{ m.gold }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-300/20 text-gray-300 font-bold">
                  {{ m.silver }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-700/20 text-amber-700 font-bold">
                  {{ m.bronze }}
                </span>
              </td>
              <td class="px-6 py-4 text-center text-white font-bold">{{ m.total }}</td>
            </tr>
            <tr v-if="medalTable.length === 0">
              <td colspan="6" class="px-6 py-12 text-center text-[#ccc38e]">
                No medals awarded yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Awards List -->
      <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] overflow-hidden">
        <div class="px-6 py-4 border-b border-[#4a4421] bg-[#4a4421]/20 flex items-center justify-between">
          <h2 class="text-white font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-[#f9d406]">military_tech</span>
            All Awards
          </h2>
          <div class="flex gap-2">
            <button v-for="type in ['all', 'gold', 'silver', 'bronze']" :key="type" @click="awardFilter = type"
              class="px-3 py-1 rounded text-xs font-medium transition-colors" :class="awardFilter === type
                ? 'bg-[#f9d406] text-[#23200f]'
                : 'bg-[#4a4421] text-[#ccc38e] hover:text-white'">
              {{ type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) }}
            </button>
          </div>
        </div>

        <div v-if="loadingAwards" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-2 border-[#f9d406] border-t-transparent"></div>
        </div>

        <div v-else class="divide-y divide-[#4a4421]">
          <div v-for="award in filteredAwards" :key="award.id"
            class="px-6 py-4 flex items-center gap-4 hover:bg-[#4a4421]/20">
            <div class="w-12 h-12 rounded-full flex items-center justify-center"
              :class="getMedalBgClass(award.award_type)">
              <span class="material-symbols-outlined text-2xl" :class="getMedalClass(award.award_type)">
                workspace_premium
              </span>
            </div>
            <div class="flex-1">
              <p class="text-white font-medium">{{ award.recipient_name }}</p>
              <p class="text-[#ccc38e] text-sm">{{ award.event_name }}</p>
            </div>
            <div class="text-right">
              <p class="text-white font-bold">{{ award.country || '-' }}</p>
              <p class="text-[#ccc38e] text-xs">Rank #{{ award.rank }}</p>
            </div>
          </div>
          <div v-if="filteredAwards.length === 0" class="px-6 py-12 text-center text-[#ccc38e]">
            No awards found
          </div>
        </div>
      </div>
    </div>

    <!-- Auto Award Modal -->
    <Teleport to="body">
      <div v-if="showAutoAward"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showAutoAward = false">
        <div class="bg-[#2E2B1B] rounded-2xl w-full max-w-md border border-[#4a4421]">
          <div class="p-6 border-b border-[#4a4421]">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-[#f9d406]">auto_fix_high</span>
              Auto Award Medals
            </h2>
            <p class="text-[#ccc38e] text-sm mt-1">Automatically award medals based on final results</p>
          </div>

          <form @submit.prevent="autoAward" class="p-6 space-y-4">
            <div>
              <label class="block text-[#ccc38e] text-sm mb-2">Select Event</label>
              <select v-model="autoAwardEvent" required
                class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50">
                <option value="">Select an event</option>
                <option v-for="e in events" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
            </div>

            <div class="bg-[#4a4421]/30 rounded-lg p-4">
              <p class="text-[#ccc38e] text-sm">
                This will automatically create Gold, Silver, and Bronze awards for the selected event based on the final
                match results.
              </p>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="showAutoAward = false"
                class="flex-1 py-3 rounded-lg border border-[#4a4421] text-[#ccc38e] hover:bg-[#4a4421] transition-colors">
                Cancel
              </button>
              <button type="submit" :disabled="awarding"
                class="flex-1 py-3 rounded-lg bg-[#f9d406] text-[#23200f] font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50">
                {{ awarding ? 'Awarding...' : 'Award Medals' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Awards & Medals',
  layout: 'default',
})

const { $api } = useNuxtApp()

const selectedTournament = ref('')
const tournaments = ref([])
const events = ref([])
const medalTable = ref([])
const awards = ref([])
const awardFilter = ref('all')
const showAutoAward = ref(false)
const autoAwardEvent = ref('')
const awarding = ref(false)
const loadingMedals = ref(true)
const loadingAwards = ref(true)

const filteredAwards = computed(() => {
  if (awardFilter.value === 'all') return awards.value
  return awards.value.filter(a => a.award_type === awardFilter.value)
})

const getMedalClass = (type) => {
  const classes = {
    gold: 'text-yellow-500',
    silver: 'text-gray-300',
    bronze: 'text-amber-700'
  }
  return classes[type] || 'text-[#ccc38e]'
}

const getMedalBgClass = (type) => {
  const classes = {
    gold: 'bg-yellow-500/20',
    silver: 'bg-gray-300/20',
    bronze: 'bg-amber-700/20'
  }
  return classes[type] || 'bg-[#4a4421]'
}

const fetchMedalTable = async () => {
  loadingMedals.value = true
  try {
    if (!selectedTournament.value) {
      medalTable.value = []
      return
    }
    const { data } = await $api(`/awards/tournament/${selectedTournament.value}/medals`)
    medalTable.value = data?.medals || []
  } catch (e) {
    console.error('Failed to fetch medal table:', e)
    medalTable.value = []
  } finally {
    loadingMedals.value = false
  }
}

const fetchAwards = async () => {
  loadingAwards.value = true
  try {
    if (!selectedTournament.value) {
      awards.value = []
      return
    }
    const { data } = await $api(`/awards/tournament/${selectedTournament.value}`)
    awards.value = data?.awards || []
  } catch (e) {
    console.error('Failed to fetch awards:', e)
    awards.value = []
  } finally {
    loadingAwards.value = false
  }
}

const fetchTournaments = async () => {
  try {
    const { data } = await $api('/events?limit=50')
    tournaments.value = data?.tournaments || []
  } catch (e) {
    console.error('Failed to fetch tournaments:', e)
  }
}

const autoAward = async () => {
  if (!autoAwardEvent.value) return
  awarding.value = true
  try {
    await $api(`/awards/events/${autoAwardEvent.value}/auto`, { method: 'POST' })
    showAutoAward.value = false
    await fetchAwards()
    await fetchMedalTable()
  } catch (e) {
    console.error('Failed to auto-award:', e)
    alert('Failed to auto-award medals')
  } finally {
    awarding.value = false
  }
}

watch(selectedTournament, () => {
  fetchMedalTable()
  fetchAwards()
})

onMounted(() => {
  fetchTournaments()
})
</script>
