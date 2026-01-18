<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#23200f]">
    <!-- Header -->
    <div
      class="border-b border-gray-200 dark:border-[#4a4421] bg-white dark:bg-[#23200f]/95 backdrop-blur px-6 py-4 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            <span class="material-symbols-outlined text-[#f9d406]">groups</span>
            Team Management
          </h1>
          <p class="text-[#ccc38e] text-sm mt-1">Manage team compositions and rankings</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="showGenerateModal = true"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4a4421] text-white hover:bg-[#5a5329] transition-colors font-medium text-sm">
            <span class="material-symbols-outlined text-lg">auto_awesome</span>
            Auto Generate
          </button>
          <button @click="showCreateModal = true"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f9d406] text-[#23200f] hover:bg-yellow-400 transition-colors font-bold text-sm">
            <span class="material-symbols-outlined text-lg">group_add</span>
            Create Team
          </button>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="flex flex-wrap gap-4 items-center justify-between">
        <div class="flex gap-3">
          <!-- Tournament Filter -->
          <select v-model="selectedTournament"
            class="bg-[#2E2B1B] border border-[#4a4421] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-[#f9d406]/50 focus:border-[#f9d406]">
            <option value="">All Tournaments</option>
            <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>

          <!-- Event Filter -->
          <select v-model="selectedEvent"
            class="bg-[#2E2B1B] border border-[#4a4421] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-[#f9d406]/50 focus:border-[#f9d406]">
            <option value="">All Events</option>
            <option v-for="e in events" :key="e.id" :value="e.id">{{ e.name }}</option>
          </select>
        </div>

        <div class="flex items-center gap-2 text-[#ccc38e] text-sm">
          <span class="material-symbols-outlined text-lg">info</span>
          {{ teams.length }} teams found
        </div>
      </div>
    </div>

    <!-- Teams Grid -->
    <div class="max-w-7xl mx-auto px-6 pb-8">
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-[#f9d406] border-t-transparent"></div>
      </div>

      <div v-else-if="teams.length === 0" class="text-center py-20">
        <span class="material-symbols-outlined text-6xl text-[#4a4421]">groups_off</span>
        <p class="text-[#ccc38e] mt-4">No teams found</p>
        <button @click="showGenerateModal = true"
          class="mt-4 px-6 py-2 rounded-lg bg-[#f9d406] text-[#23200f] font-bold text-sm hover:bg-yellow-400 transition-colors">
          Generate Teams from Rankings
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="team in teams" :key="team.id" @click="selectTeam(team)"
          class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5 cursor-pointer hover:border-[#f9d406]/50 transition-all group">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h3 class="text-white font-bold text-lg group-hover:text-[#f9d406] transition-colors">
                {{ team.team_name }}
              </h3>
              <p class="text-[#ccc38e] text-sm flex items-center gap-1.5 mt-1">
                <span class="material-symbols-outlined text-sm">flag</span>
                {{ team.country_code }}
              </p>
            </div>
            <span class="px-2 py-1 rounded-full text-xs font-medium" :class="getStatusClass(team.status)">
              {{ team.status }}
            </span>
          </div>

          <div class="flex items-center gap-4 mb-4">
            <div class="flex-1">
              <p class="text-[#ccc38e] text-xs uppercase tracking-wider mb-1">Total Score</p>
              <p class="text-white text-2xl font-bold tabular-nums">{{ team.total_score }}</p>
            </div>
            <div class="flex-1">
              <p class="text-[#ccc38e] text-xs uppercase tracking-wider mb-1">X Count</p>
              <p class="text-[#f9d406] text-2xl font-bold tabular-nums">{{ team.total_x_count }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3 border-t border-[#4a4421]">
            <div class="flex -space-x-2">
              <div v-for="i in 3" :key="i"
                class="w-8 h-8 rounded-full bg-[#4a4421] border-2 border-[#2E2B1B] flex items-center justify-center text-[#ccc38e] text-xs font-bold">
                {{ i }}
              </div>
            </div>
            <span class="text-[#ccc38e] text-xs">
              <span v-if="team.team_rank" class="text-[#f9d406] font-bold">#{{ team.team_rank }}</span>
              <span v-else>Unranked</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedTeam"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="selectedTeam = null">
        <div class="bg-[#2E2B1B] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-[#4a4421]">
          <div class="p-6 border-b border-[#4a4421] flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-white">{{ selectedTeam.team_name }}</h2>
              <p class="text-[#ccc38e] text-sm">{{ selectedTeam.country_code }}</p>
            </div>
            <button @click="selectedTeam = null"
              class="p-2 rounded-lg hover:bg-[#4a4421] text-[#ccc38e] hover:text-white transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6 overflow-y-auto max-h-[60vh]">
            <!-- Team Stats -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <div class="bg-[#4a4421]/30 rounded-xl p-4 text-center">
                <p class="text-[#ccc38e] text-xs uppercase mb-1">Total Score</p>
                <p class="text-white text-2xl font-bold">{{ selectedTeam.total_score }}</p>
              </div>
              <div class="bg-[#4a4421]/30 rounded-xl p-4 text-center">
                <p class="text-[#ccc38e] text-xs uppercase mb-1">X Count</p>
                <p class="text-[#f9d406] text-2xl font-bold">{{ selectedTeam.total_x_count }}</p>
              </div>
              <div class="bg-[#4a4421]/30 rounded-xl p-4 text-center">
                <p class="text-[#ccc38e] text-xs uppercase mb-1">Rank</p>
                <p class="text-white text-2xl font-bold">#{{ selectedTeam.team_rank || '-' }}</p>
              </div>
            </div>

            <!-- Team Members -->
            <h3 class="text-white font-bold mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#f9d406]">group</span>
              Team Members
            </h3>

            <div v-if="teamMembers.length" class="space-y-3">
              <div v-for="member in teamMembers" :key="member.id"
                class="flex items-center gap-4 p-4 rounded-xl bg-[#23200f] border border-[#4a4421]">
                <div
                  class="w-10 h-10 rounded-full bg-[#4a4421] flex items-center justify-center text-[#f9d406] font-bold">
                  {{ member.member_order }}
                </div>
                <div class="flex-1">
                  <p class="text-white font-medium">{{ member.first_name }} {{ member.last_name }}</p>
                  <p class="text-[#ccc38e] text-sm">{{ member.back_number || 'No back number' }}</p>
                </div>
                <div class="text-right">
                  <p class="text-white font-bold tabular-nums">{{ member.total_score }}</p>
                  <p class="text-[#f9d406] text-sm tabular-nums">{{ member.total_x_count }}X</p>
                </div>
                <span v-if="member.is_substitute" class="px-2 py-1 rounded-full text-xs bg-[#4a4421] text-[#ccc38e]">
                  Sub
                </span>
              </div>
            </div>

            <div v-else class="text-center py-8 text-[#ccc38e]">
              No members found
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Generate Teams Modal -->
    <Teleport to="body">
      <div v-if="showGenerateModal"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showGenerateModal = false">
        <div class="bg-[#2E2B1B] rounded-2xl w-full max-w-md border border-[#4a4421]">
          <div class="p-6 border-b border-[#4a4421]">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-[#f9d406]">auto_awesome</span>
              Auto Generate Teams
            </h2>
            <p class="text-[#ccc38e] text-sm mt-1">Generate teams from qualification rankings</p>
          </div>

          <form @submit.prevent="generateTeams" class="p-6 space-y-4">
            <div>
              <label class="block text-[#ccc38e] text-sm mb-2">Tournament</label>
              <select v-model="generateForm.tournamentId" required
                class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50 focus:border-[#f9d406]">
                <option value="">Select Tournament</option>
                <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-[#ccc38e] text-sm mb-2">Event</label>
              <select v-model="generateForm.eventId" required
                class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50 focus:border-[#f9d406]">
                <option value="">Select Event</option>
                <option v-for="e in events" :key="e.id" :value="e.id">{{ e.name }}</option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[#ccc38e] text-sm mb-2">Team Size</label>
                <input v-model.number="generateForm.teamSize" type="number" min="2" max="4"
                  class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50 focus:border-[#f9d406]" />
              </div>
              <div>
                <label class="block text-[#ccc38e] text-sm mb-2">Top N per Country</label>
                <input v-model.number="generateForm.topN" type="number" min="2" max="6"
                  class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50 focus:border-[#f9d406]" />
              </div>
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="showGenerateModal = false"
                class="flex-1 py-3 rounded-lg border border-[#4a4421] text-[#ccc38e] hover:bg-[#4a4421] transition-colors font-medium">
                Cancel
              </button>
              <button type="submit" :disabled="generating"
                class="flex-1 py-3 rounded-lg bg-[#f9d406] text-[#23200f] font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50">
                {{ generating ? 'Generating...' : 'Generate Teams' }}
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
  title: 'Team Management',
  layout: 'default',
})

const { $api } = useNuxtApp()

const loading = ref(true)
const teams = ref([])
const tournaments = ref([])
const events = ref([])
const selectedTournament = ref('')
const selectedEvent = ref('')
const selectedTeam = ref(null)
const teamMembers = ref([])
const showGenerateModal = ref(false)
const showCreateModal = ref(false)
const generating = ref(false)

const generateForm = ref({
  tournamentId: '',
  eventId: '',
  teamSize: 3,
  topN: 3
})

const getStatusClass = (status) => {
  const classes = {
    active: 'bg-green-900/40 text-green-400 border border-green-800',
    eliminated: 'bg-red-900/40 text-red-400 border border-red-800',
    qualified: 'bg-blue-900/40 text-blue-400 border border-blue-800'
  }
  return classes[status] || 'bg-[#4a4421] text-[#ccc38e]'
}

const fetchTeams = async () => {
  loading.value = true
  try {
    let url = '/teams/tournament/' + (selectedTournament.value || 'all')
    if (selectedEvent.value) {
      url += `?event_id=${selectedEvent.value}`
    }
    const { data } = await $api(url)
    teams.value = data?.teams || []
  } catch (e) {
    console.error('Failed to fetch teams:', e)
    teams.value = []
  } finally {
    loading.value = false
  }
}

const fetchTournaments = async () => {
  try {
    const { data } = await $api('/tournaments?limit=50')
    tournaments.value = data?.tournaments || []
  } catch (e) {
    console.error('Failed to fetch tournaments:', e)
  }
}

const selectTeam = async (team) => {
  selectedTeam.value = team
  try {
    const { data } = await $api(`/teams/${team.id}`)
    teamMembers.value = data?.members || []
  } catch (e) {
    console.error('Failed to fetch team members:', e)
    teamMembers.value = []
  }
}

const generateTeams = async () => {
  generating.value = true
  try {
    await $api(`/teams/tournament/${generateForm.value.tournamentId}/generate`, {
      method: 'POST',
      body: {
        event_id: generateForm.value.eventId,
        team_size: generateForm.value.teamSize,
        top_n: generateForm.value.topN
      }
    })
    showGenerateModal.value = false
    selectedTournament.value = generateForm.value.tournamentId
    await fetchTeams()
  } catch (e) {
    console.error('Failed to generate teams:', e)
    alert('Failed to generate teams')
  } finally {
    generating.value = false
  }
}

watch([selectedTournament, selectedEvent], () => {
  if (selectedTournament.value) {
    fetchTeams()
  }
})

onMounted(() => {
  fetchTournaments()
})
</script>
