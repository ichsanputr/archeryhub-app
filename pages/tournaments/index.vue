<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-black text-white">Tournaments</h1>
        <p class="text-brand-gold mt-1">Manage all your archery competitions</p>
      </div>
      <NuxtLink to="/tournaments/create" class="btn-primary flex items-center gap-2">
        <span class="material-symbols-outlined">add_circle</span>
        Create Tournament
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-3">
      <button v-for="filter in filters" :key="filter.value" @click="activeFilter = filter.value"
        :class="activeFilter === filter.value ? 'bg-primary text-background-dark' : 'bg-surface-highlight text-white border border-brand-border'"
        class="px-4 py-2 rounded-lg font-semibold text-sm transition-colors hover:border-primary/50">
        {{ filter.label }} ({{ filter.count }})
      </button>
    </div>

    <!-- Tournament List -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="spinner"></div>
    </div>

    <div v-else-if="tournaments.length === 0" class="card text-center py-12">
      <span class="material-symbols-outlined text-6xl text-brand-gold mb-4">target</span>
      <p class="text-white text-lg font-bold">No tournaments found</p>
      <p class="text-brand-gold mt-2">Create your first tournament to get started</p>
    </div>

    <div v-else class="grid grid-cols-1 gap-4">
      <div v-for="tournament in tournaments" :key="tournament.id" @click="$router.push(`/tournaments/${tournament.id}`)"
        class="card hover:border-primary/50 transition-all cursor-pointer group">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4 flex-1">
            <div
              class="size-16 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
              {{ tournament.code }}
            </div>
            <div class="flex-1">
              <h3 class="text-white font-bold text-lg group-hover:text-primary transition-colors">
                {{ tournament.name }}
              </h3>
              <p class="text-brand-gold text-sm mt-1">
                {{ formatDate(tournament.start_date) }} - {{ formatDate(tournament.end_date) }}
              </p>
              <p class="text-gray-400 text-sm mt-1">
                {{ tournament.location || 'Location TBD' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right hidden md:block">
              <p class="text-white font-bold">{{ tournament.participant_count || 0 }}</p>
              <p class="text-brand-gold text-xs">Athletes</p>
            </div>
            <span :class="getStatusClass(tournament.status)" class="badge">
              {{ tournament.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  title: 'Tournaments',
  layout: 'default',
  middleware: 'auth'
})

const loading = ref(false)
const activeFilter = ref('all')

const { get } = useApi()

const filters = ref([
  { label: 'All Tournaments', value: 'all', count: 0 },
  { label: 'Published', value: 'published', count: 0 },
  { label: 'Ongoing', value: 'ongoing', count: 0 },
  { label: 'Completed', value: 'completed', count: 0 },
])

const tournaments = ref([])

const fetchData = async () => {
  loading.value = true
  try {
    const status = activeFilter.value === 'all' ? '' : activeFilter.value
    const response = await get(`/tournaments?status=${status}`)
    if (response && response.tournaments) {
      tournaments.value = response.tournaments

      // Update counts (optional but helpful)
      if (activeFilter.value === 'all') {
        const counts = { all: response.total || response.tournaments.length, published: 0, ongoing: 0, completed: 0 }
        response.tournaments.forEach(t => {
          if (counts[t.status] !== undefined) counts[t.status]++
        })
        filters.value.forEach(f => {
          f.count = counts[f.value]
        })
      }
    }
  } catch (error) {
    console.error('Failed to fetch tournaments:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusClass = (status) => {
  const classes = {
    'ongoing': 'badge-info',
    'completed': 'badge-success',
    'published': 'badge-warning',
    'draft': 'badge-neutral',
  }
  return classes[status] || 'badge-neutral'
}

watch(activeFilter, fetchData)

onMounted(() => {
  fetchData()
})
</script>
