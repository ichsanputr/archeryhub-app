<template>
  <div class="min-h-screen bg-[#23200f]">
    <!-- Header -->
    <div class="border-b border-[#4a4421] bg-[#23200f]/95 backdrop-blur px-6 py-4 sticky top-0 z-10">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white flex items-center gap-3">
            <span class="material-symbols-outlined text-[#f9d406]">badge</span>
            Accreditation
          </h1>
          <p class="text-[#ccc38e] text-sm mt-1">ID cards, gate control, and check-in management</p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="showGateSituation = true"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#4a4421] text-white hover:bg-[#5a5329] transition-colors font-medium text-sm">
            <span class="material-symbols-outlined text-lg">door_sensor</span>
            Gate Status
          </button>
          <button @click="showBulkCreate = true"
            class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#f9d406] text-[#23200f] hover:bg-yellow-400 transition-colors font-bold text-sm">
            <span class="material-symbols-outlined text-lg">add_card</span>
            Bulk Create
          </button>
        </div>
      </div>
    </div>

    <!-- Filters and Stats -->
    <div class="max-w-7xl mx-auto px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
          <p class="text-[#ccc38e] text-sm">Pending</p>
          <p class="text-white text-2xl font-bold">{{ stats.pending }}</p>
        </div>
        <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
          <p class="text-[#ccc38e] text-sm">Printed</p>
          <p class="text-yellow-500 text-2xl font-bold">{{ stats.printed }}</p>
        </div>
        <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
          <p class="text-[#ccc38e] text-sm">Issued</p>
          <p class="text-green-500 text-2xl font-bold">{{ stats.issued }}</p>
        </div>
        <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] p-5">
          <p class="text-[#ccc38e] text-sm">Revoked</p>
          <p class="text-red-500 text-2xl font-bold">{{ stats.revoked }}</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-4 items-center justify-between mb-6">
        <div class="flex gap-3">
          <select v-model="selectedTournament"
            class="bg-[#2E2B1B] border border-[#4a4421] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-[#f9d406]/50">
            <option value="">All Tournaments</option>
            <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
          </select>

          <select v-model="statusFilter"
            class="bg-[#2E2B1B] border border-[#4a4421] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-[#f9d406]/50">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="printed">Printed</option>
            <option value="issued">Issued</option>
            <option value="revoked">Revoked</option>
          </select>

          <select v-model="cardTypeFilter"
            class="bg-[#2E2B1B] border border-[#4a4421] rounded-lg px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-[#f9d406]/50">
            <option value="">All Types</option>
            <option value="athlete">Athlete</option>
            <option value="coach">Coach</option>
            <option value="official">Official</option>
            <option value="media">Media</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <div class="relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#ccc38e]">search</span>
          <input v-model="searchQuery" type="text" placeholder="Search by name or card number..."
            class="pl-10 pr-4 py-2.5 bg-[#2E2B1B] border border-[#4a4421] rounded-lg text-white text-sm w-72 focus:ring-2 focus:ring-[#f9d406]/50" />
        </div>
      </div>
    </div>

    <!-- Accreditation List -->
    <div class="max-w-7xl mx-auto px-6 pb-8">
      <div class="bg-[#2E2B1B] rounded-xl border border-[#4a4421] overflow-hidden">
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="animate-spin rounded-full h-10 w-10 border-2 border-[#f9d406] border-t-transparent"></div>
        </div>

        <table v-else class="w-full">
          <thead class="bg-[#4a4421]/30">
            <tr>
              <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Card Number</th>
              <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Participant</th>
              <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Type</th>
              <th class="px-6 py-4 text-left text-[#ccc38e] text-xs font-semibold uppercase">Status</th>
              <th class="px-6 py-4 text-right text-[#ccc38e] text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#4a4421]">
            <tr v-for="acc in accreditations" :key="acc.id" class="hover:bg-[#4a4421]/20 group">
              <td class="px-6 py-4">
                <span class="font-mono text-[#f9d406] font-bold">{{ acc.card_number }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-full bg-[#4a4421] flex items-center justify-center text-[#ccc38e] font-bold text-sm">
                    {{ getInitials(acc.first_name, acc.last_name) }}
                  </div>
                  <div>
                    <p class="text-white font-medium">{{ acc.first_name }} {{ acc.last_name }}</p>
                    <p class="text-[#ccc38e] text-sm">{{ acc.country || '-' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="getCardTypeClass(acc.card_type)">
                  {{ acc.card_type }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-full text-xs font-medium" :class="getStatusClass(acc.status)">
                  {{ acc.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button v-if="acc.status === 'pending'" @click="updateStatus(acc.id, 'printed')"
                    class="p-2 rounded-lg bg-[#4a4421] text-white hover:bg-yellow-600 transition-colors"
                    title="Mark as Printed">
                    <span class="material-symbols-outlined text-lg">print</span>
                  </button>
                  <button v-if="acc.status === 'printed'" @click="updateStatus(acc.id, 'issued')"
                    class="p-2 rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors"
                    title="Mark as Issued">
                    <span class="material-symbols-outlined text-lg">check</span>
                  </button>
                  <button v-if="acc.status !== 'revoked'" @click="updateStatus(acc.id, 'revoked')"
                    class="p-2 rounded-lg bg-red-600/50 text-red-300 hover:bg-red-600 transition-colors" title="Revoke">
                    <span class="material-symbols-outlined text-lg">block</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="accreditations.length === 0">
              <td colspan="5" class="px-6 py-12 text-center text-[#ccc38e]">
                No accreditations found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Gate Situation Modal -->
    <Teleport to="body">
      <div v-if="showGateSituation"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showGateSituation = false">
        <div class="bg-[#2E2B1B] rounded-2xl w-full max-w-2xl border border-[#4a4421]">
          <div class="p-6 border-b border-[#4a4421] flex items-center justify-between">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-[#f9d406]">door_sensor</span>
              Gate Situation
            </h2>
            <button @click="showGateSituation = false"
              class="p-2 rounded-lg hover:bg-[#4a4421] text-[#ccc38e] hover:text-white transition-colors">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <div class="p-6">
            <div v-if="gateSituation.length === 0" class="text-center py-8 text-[#ccc38e]">
              No gate activity recorded
            </div>
            <div v-else class="space-y-4">
              <div v-for="gate in gateSituation" :key="gate.gate_name" class="bg-[#4a4421]/30 rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-white font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-[#f9d406]">door_front</span>
                    {{ gate.gate_name }}
                  </h3>
                  <span class="text-[#f9d406] font-bold text-lg">
                    {{ gate.current_in }} inside
                  </span>
                </div>
                <div class="flex gap-4">
                  <div class="flex-1 bg-green-900/30 rounded-lg p-3 text-center">
                    <p class="text-green-400 text-2xl font-bold">{{ gate.in_count }}</p>
                    <p class="text-green-400/70 text-xs">Check-ins</p>
                  </div>
                  <div class="flex-1 bg-red-900/30 rounded-lg p-3 text-center">
                    <p class="text-red-400 text-2xl font-bold">{{ gate.out_count }}</p>
                    <p class="text-red-400/70 text-xs">Check-outs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Bulk Create Modal -->
    <Teleport to="body">
      <div v-if="showBulkCreate"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showBulkCreate = false">
        <div class="bg-[#2E2B1B] rounded-2xl w-full max-w-md border border-[#4a4421]">
          <div class="p-6 border-b border-[#4a4421]">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-[#f9d406]">add_card</span>
              Bulk Create Accreditations
            </h2>
          </div>

          <form @submit.prevent="bulkCreate" class="p-6 space-y-4">
            <div>
              <label class="block text-[#ccc38e] text-sm mb-2">Tournament</label>
              <select v-model="bulkForm.tournamentId" required
                class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50">
                <option value="">Select Tournament</option>
                <option v-for="t in tournaments" :key="t.id" :value="t.id">{{ t.name }}</option>
              </select>
            </div>

            <div>
              <label class="block text-[#ccc38e] text-sm mb-2">Card Type</label>
              <select v-model="bulkForm.cardType" required
                class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50">
                <option value="athlete">Athlete</option>
                <option value="coach">Coach</option>
                <option value="official">Official</option>
                <option value="media">Media</option>
                <option value="vip">VIP</option>
              </select>
            </div>

            <div>
              <label class="block text-[#ccc38e] text-sm mb-2">Access Areas</label>
              <input v-model="bulkForm.accessAreas" type="text" placeholder="e.g., FOH, Warm-up, Media"
                class="w-full bg-[#23200f] border border-[#4a4421] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-[#f9d406]/50" />
            </div>

            <div class="flex gap-3 pt-4">
              <button type="button" @click="showBulkCreate = false"
                class="flex-1 py-3 rounded-lg border border-[#4a4421] text-[#ccc38e] hover:bg-[#4a4421] transition-colors">
                Cancel
              </button>
              <button type="submit" :disabled="creating"
                class="flex-1 py-3 rounded-lg bg-[#f9d406] text-[#23200f] font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50">
                {{ creating ? 'Creating...' : 'Create All' }}
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
  title: 'Accreditation',
  layout: 'default',
})

const { $api } = useNuxtApp()

const loading = ref(true)
const tournaments = ref([])
const accreditations = ref([])
const selectedTournament = ref('')
const statusFilter = ref('')
const cardTypeFilter = ref('')
const searchQuery = ref('')
const showGateSituation = ref(false)
const showBulkCreate = ref(false)
const gateSituation = ref([])
const creating = ref(false)

const bulkForm = ref({
  tournamentId: '',
  cardType: 'athlete',
  accessAreas: ''
})

const stats = computed(() => {
  return {
    pending: accreditations.value.filter(a => a.status === 'pending').length,
    printed: accreditations.value.filter(a => a.status === 'printed').length,
    issued: accreditations.value.filter(a => a.status === 'issued').length,
    revoked: accreditations.value.filter(a => a.status === 'revoked').length
  }
})

const getInitials = (first, last) => {
  return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase()
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-[#4a4421] text-[#ccc38e]',
    printed: 'bg-yellow-900/40 text-yellow-400 border border-yellow-800',
    issued: 'bg-green-900/40 text-green-400 border border-green-800',
    revoked: 'bg-red-900/40 text-red-400 border border-red-800'
  }
  return classes[status] || classes.pending
}

const getCardTypeClass = (type) => {
  const classes = {
    athlete: 'bg-blue-900/40 text-blue-400',
    coach: 'bg-purple-900/40 text-purple-400',
    official: 'bg-cyan-900/40 text-cyan-400',
    media: 'bg-pink-900/40 text-pink-400',
    vip: 'bg-amber-900/40 text-amber-400'
  }
  return classes[type] || 'bg-[#4a4421] text-[#ccc38e]'
}

const fetchAccreditations = async () => {
  if (!selectedTournament.value) {
    accreditations.value = []
    loading.value = false
    return
  }

  loading.value = true
  try {
    let url = `/accreditation/tournament/${selectedTournament.value}`
    const params = new URLSearchParams()
    if (statusFilter.value) params.append('status', statusFilter.value)
    if (cardTypeFilter.value) params.append('card_type', cardTypeFilter.value)
    if (params.toString()) url += `?${params}`

    const { data } = await $api(url)
    accreditations.value = data?.accreditations || []
  } catch (e) {
    console.error('Failed to fetch accreditations:', e)
    accreditations.value = []
  } finally {
    loading.value = false
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

const fetchGateSituation = async () => {
  if (!selectedTournament.value) return
  try {
    const { data } = await $api(`/accreditation/tournament/${selectedTournament.value}/gate-situation`)
    gateSituation.value = data?.gates || []
  } catch (e) {
    console.error('Failed to fetch gate situation:', e)
    gateSituation.value = []
  }
}

const updateStatus = async (accredId, newStatus) => {
  try {
    await $api(`/accreditation/${accredId}/status`, {
      method: 'PUT',
      body: { status: newStatus }
    })
    await fetchAccreditations()
  } catch (e) {
    console.error('Failed to update status:', e)
  }
}

const bulkCreate = async () => {
  creating.value = true
  try {
    await $api(`/accreditation/tournament/${bulkForm.value.tournamentId}/bulk`, {
      method: 'POST',
      body: {
        card_type: bulkForm.value.cardType,
        access_areas: bulkForm.value.accessAreas
      }
    })
    showBulkCreate.value = false
    selectedTournament.value = bulkForm.value.tournamentId
    await fetchAccreditations()
  } catch (e) {
    console.error('Failed to bulk create:', e)
    alert('Failed to create accreditations')
  } finally {
    creating.value = false
  }
}

watch([selectedTournament, statusFilter, cardTypeFilter], () => {
  fetchAccreditations()
})

watch(showGateSituation, (val) => {
  if (val) fetchGateSituation()
})

onMounted(() => {
  fetchTournaments()
})
</script>
