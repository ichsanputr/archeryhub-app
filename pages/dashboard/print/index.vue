<template>
  <div class="min-h-screen bg-[#23200f]">
    <!-- Header -->
    <div class="border-b border-[#4a4421] bg-[#23200f]/95 backdrop-blur px-6 py-4 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            <span class="material-symbols-outlined text-[#f9d406]">print</span>
            Print Center
          </h1>
          <p class="text-[#ccc38e] text-sm mt-1">Generate scorecards, rankings, brackets, and reports</p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-6 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Panel: Report Types -->
        <div class="lg:col-span-1 space-y-4">
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
            <h2 class="text-white font-bold mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#f9d406]">description</span>
              Report Type
            </h2>

            <div class="space-y-2">
              <button v-for="type in reportTypes" :key="type.value" @click="selectedType = type.value"
                class="w-full p-4 rounded-xl border text-left transition-all flex items-center gap-3" :class="selectedType === type.value
                  ? 'border-[#f9d406] bg-[#f9d406]/10'
                  : 'border-[#4a4421] hover:border-[#f9d406]/50'">
                <span class="material-symbols-outlined"
                  :class="selectedType === type.value ? 'text-[#f9d406]' : 'text-[#ccc38e]'">
                  {{ type.icon }}
                </span>
                <div>
                  <p class="text-white font-medium">{{ type.label }}</p>
                  <p class="text-[#ccc38e] text-xs">{{ type.description }}</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Tournament/Event Selection -->
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
            <h2 class="text-white font-bold mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[#f9d406]">tune</span>
              Options
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-[#ccc38e] text-sm mb-2">Tournament</label>
                <select v-model="selectedTournament"
                  class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50">
                  <option value="">Select Tournament</option>
                  <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
              </div>

              <div v-if="needsEvent">
                <label class="block text-[#ccc38e] text-sm mb-2">Event</label>
                <select v-model="selectedEvent"
                  class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50">
                  <option value="">All Events</option>
                  <option v-for="e in events" :key="e.id" :value="e.id">{{ e.name }}</option>
                </select>
              </div>

              <div>
                <label class="block text-[#ccc38e] text-sm mb-2">Format</label>
                <div class="flex gap-2">
                  <button v-for="f in formats" :key="f.value" @click="selectedFormat = f.value"
                    class="flex-1 py-2 rounded-lg text-sm font-medium transition-colors" :class="selectedFormat === f.value
                      ? 'bg-[#f9d406] text-[#23200f]'
                      : 'bg-[#4a4421] text-[#ccc38e] hover:text-white'">
                    {{ f.label }}
                  </button>
                </div>
              </div>
            </div>

            <button @click="generateReport" :disabled="!canGenerate || generating"
              class="w-full mt-6 py-3 rounded-lg bg-[#f9d406] text-[#23200f] font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              <span v-if="generating" class="material-symbols-outlined animate-spin">refresh</span>
              <span>{{ generating ? 'Generating...' : 'Generate Report' }}</span>
            </button>
          </div>
        </div>

        <!-- Right Panel: Preview -->
        <div class="lg:col-span-2">
          <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] overflow-hidden h-full">
            <div class="px-6 py-4 border-b border-[#4a4421] flex items-center justify-between bg-[#4a4421]/20">
              <h2 class="text-white font-bold flex items-center gap-2">
                <span class="material-symbols-outlined text-[#f9d406]">preview</span>
                Preview
              </h2>
              <div v-if="reportData" class="flex gap-2">
                <button @click="downloadReport"
                  class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#4a4421] text-white text-sm hover:bg-[#5a5329] transition-colors">
                  <span class="material-symbols-outlined text-lg">download</span>
                  Download
                </button>
                <button @click="printReport"
                  class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#f9d406] text-[#23200f] text-sm font-bold hover:bg-yellow-400 transition-colors">
                  <span class="material-symbols-outlined text-lg">print</span>
                  Print
                </button>
              </div>
            </div>

            <div class="p-6">
              <div v-if="!reportData" class="flex flex-col items-center justify-center py-20 text-center">
                <span class="material-symbols-outlined text-6xl text-[#4a4421]">article</span>
                <p class="text-[#ccc38e] mt-4">Select options and generate a report</p>
              </div>

              <div v-else-if="selectedType === 'rankings'" class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-[#4a4421]/30">
                    <tr>
                      <th class="px-4 py-3 text-left text-[#ccc38e] text-xs font-semibold uppercase">Rank</th>
                      <th class="px-4 py-3 text-left text-[#ccc38e] text-xs font-semibold uppercase">Athlete</th>
                      <th class="px-4 py-3 text-left text-[#ccc38e] text-xs font-semibold uppercase">Country</th>
                      <th class="px-4 py-3 text-right text-[#ccc38e] text-xs font-semibold uppercase">Score</th>
                      <th class="px-4 py-3 text-right text-[#ccc38e] text-xs font-semibold uppercase">X</th>
                      <th class="px-4 py-3 text-right text-[#ccc38e] text-xs font-semibold uppercase">10s</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#4a4421]">
                    <tr v-for="r in reportData" :key="r.rank" class="hover:bg-[#4a4421]/20">
                      <td class="px-4 py-3 text-[#f9d406] font-bold">{{ r.rank }}</td>
                      <td class="px-4 py-3 text-white font-medium">{{ r.athlete_name }}</td>
                      <td class="px-4 py-3 text-[#ccc38e]">{{ r.country || '-' }}</td>
                      <td class="px-4 py-3 text-right text-white font-bold tabular-nums">{{ r.total_score }}</td>
                      <td class="px-4 py-3 text-right text-[#f9d406] tabular-nums">{{ r.x_count }}</td>
                      <td class="px-4 py-3 text-right text-[#ccc38e] tabular-nums">{{ r.ten_count }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else-if="selectedType === 'startlist'" class="overflow-x-auto">
                <table class="w-full">
                  <thead class="bg-[#4a4421]/30">
                    <tr>
                      <th class="px-4 py-3 text-left text-[#ccc38e] text-xs font-semibold uppercase">Target</th>
                      <th class="px-4 py-3 text-left text-[#ccc38e] text-xs font-semibold uppercase">Back #</th>
                      <th class="px-4 py-3 text-left text-[#ccc38e] text-xs font-semibold uppercase">Athlete</th>
                      <th class="px-4 py-3 text-left text-[#ccc38e] text-xs font-semibold uppercase">Country</th>
                      <th class="px-4 py-3 text-left text-[#ccc38e] text-xs font-semibold uppercase">Division</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#4a4421]">
                    <tr v-for="(s, idx) in reportData" :key="idx" class="hover:bg-[#4a4421]/20">
                      <td class="px-4 py-3 text-[#f9d406] font-mono font-bold">{{ s.target }}</td>
                      <td class="px-4 py-3 text-white font-mono">{{ s.back_number }}</td>
                      <td class="px-4 py-3 text-white font-medium">{{ s.athlete_name }}</td>
                      <td class="px-4 py-3 text-[#ccc38e]">{{ s.country || '-' }}</td>
                      <td class="px-4 py-3 text-[#ccc38e]">{{ s.division }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else-if="selectedType === 'medals'" class="space-y-4">
                <div v-for="m in reportData" :key="m.event" class="bg-[#4a4421]/20 rounded-xl p-4">
                  <h3 class="text-white font-bold mb-3">{{ m.event }}</h3>
                  <div class="grid grid-cols-3 gap-3">
                    <div class="text-center">
                      <span class="material-symbols-outlined text-2xl text-yellow-500">workspace_premium</span>
                      <p class="text-white text-sm font-medium mt-1">{{ m.gold || '-' }}</p>
                      <p class="text-[#ccc38e] text-xs">{{ m.gold_country || '' }}</p>
                    </div>
                    <div class="text-center">
                      <span class="material-symbols-outlined text-2xl text-gray-300">workspace_premium</span>
                      <p class="text-white text-sm font-medium mt-1">{{ m.silver || '-' }}</p>
                      <p class="text-[#ccc38e] text-xs">{{ m.silver_country || '' }}</p>
                    </div>
                    <div class="text-center">
                      <span class="material-symbols-outlined text-2xl text-amber-700">workspace_premium</span>
                      <p class="text-white text-sm font-medium mt-1">{{ m.bronze || '-' }}</p>
                      <p class="text-[#ccc38e] text-xs">{{ m.bronze_country || '' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="text-center py-12 text-[#ccc38e]">
                <p>Report preview not available for this type.</p>
                <p class="text-sm mt-1">Click download to get the full report.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Reports & Print',
  layout: 'default'
})

const { $api } = useNuxtApp()

const selectedType = ref('rankings')
const selectedTournament = ref('')
const selectedEvent = ref('')
const selectedFormat = ref('html')
const tournaments = ref([])
const events = ref([])
const generating = ref(false)
const reportData = ref(null)

const reportTypes = [
  { value: 'scorecard', label: 'Scorecards', icon: 'assignment', description: 'Individual scoring sheets' },
  { value: 'rankings', label: 'Rankings', icon: 'leaderboard', description: 'Qualification rankings' },
  { value: 'bracket', label: 'Brackets', icon: 'account_tree', description: 'Elimination brackets' },
  { value: 'startlist', label: 'Start List', icon: 'format_list_numbered', description: 'Target assignments' },
  { value: 'backnumbers', label: 'Back Numbers', icon: 'badge', description: 'Back number cards' },
  { value: 'medals', label: 'Medal Report', icon: 'workspace_premium', description: 'Medal ceremony list' }
]

const formats = [
  { value: 'html', label: 'HTML' },
  { value: 'pdf', label: 'PDF' },
  { value: 'csv', label: 'CSV' }
]

const needsEvent = computed(() => {
  return ['bracket'].includes(selectedType.value)
})

const canGenerate = computed(() => {
  return selectedTournament.value && selectedType.value
})

const fetchTournaments = async () => {
  try {
    const { data } = await $api('/events?limit=50')
    tournaments.value = data?.tournaments || []
  } catch (e) {
    console.error('Failed to fetch tournaments:', e)
  }
}

const generateReport = async () => {
  if (!canGenerate.value) return

  generating.value = true
  try {
    const { data } = await $api('/print/generate', {
      method: 'POST',
      body: {
        type: selectedType.value,
        tournament_id: selectedTournament.value,
        event_id: selectedEvent.value || undefined,
        format: selectedFormat.value
      }
    })
    reportData.value = data?.content || []
  } catch (e) {
    console.error('Failed to generate report:', e)
    alert('Failed to generate report')
    reportData.value = null
  } finally {
    generating.value = false
  }
}

const downloadReport = async () => {
  try {
    const response = await $api(`/print/export/${selectedType.value}?tournament_id=${selectedTournament.value}`, {
      responseType: 'blob'
    })
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${selectedType.value}_report.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (e) {
    console.error('Failed to download:', e)
  }
}

const printReport = () => {
  window.print()
}

onMounted(() => {
  fetchTournaments()
})
</script>

<style>
@media print {
  .no-print {
    display: none !important;
  }
}
</style>
