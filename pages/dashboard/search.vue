<template>
  <div class="space-y-6">
    <!-- Search Header -->
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold text-white">Search Results</h1>
      <p class="text-brand-gold/80" v-if="q">
        Showing results for "<span class="text-white font-medium">{{ q }}</span>"
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-surface-highlight">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        class="px-6 py-3 text-sm font-medium transition-colors relative"
        :class="activeTab === tab.id ? 'text-primary' : 'text-brand-gold/60 hover:text-brand-gold'"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <span v-if="getItemCount(tab.id) !== null" class="ml-2 px-1.5 py-0.5 rounded-full bg-surface-highlight text-[10px] text-white">
          {{ getItemCount(tab.id) }}
        </span>
        <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
      </button>
    </div>

    <!-- Results Area -->
    <div class="min-h-[400px]">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="loading-spinner"></div>
        <p class="text-brand-gold/60">Searching...</p>
      </div>

      <div v-else-if="!hasResults" class="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <span class="material-symbols-outlined text-6xl text-brand-gold/20">search_off</span>
        <div>
          <h3 class="text-xl font-bold text-white mb-1">No results found</h3>
          <p class="text-brand-gold/60">Try adjusting your keywords or filters</p>
        </div>
      </div>

      <div v-else>
        <!-- Tournaments Tab -->
        <div v-if="activeTab === 'tournaments'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="tournament in results.tournaments" 
            :key="tournament.id"
            class="glass-card hover:border-primary/50 transition-all group cursor-pointer"
            @click="navigateTo(`/tournaments/${tournament.id}`)"
          >
            <div class="p-5">
              <div class="flex justify-between items-start mb-4">
                <span class="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  {{ tournament.code }}
                </span>
                <span :class="getStatusClass(tournament.status)">
                  {{ tournament.status }}
                </span>
              </div>
              <h3 class="text-lg font-bold text-white group-hover:text-primary transition-colors mb-2 line-clamp-1">
                {{ tournament.name }}
              </h3>
              <div class="space-y-2 text-sm text-brand-gold/60">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                  {{ formatDate(tournament.start_date) }}
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">location_on</span>
                  {{ tournament.location }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Athletes Tab -->
        <div v-if="activeTab === 'athletes'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="athlete in results.athletes" 
            :key="athlete.id"
            class="glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-all cursor-pointer"
            @click="navigateTo(`/athletes/${athlete.id}`)"
          >
            <div class="size-16 rounded-full bg-surface-highlight flex items-center justify-center overflow-hidden shrink-0 border-2 border-surface-highlight group-hover:border-primary/30 transition-colors">
              <img v-if="athlete.photo_url" :src="athlete.photo_url" class="size-full object-cover" />
              <span v-else class="material-symbols-outlined text-3xl text-brand-gold/30">person</span>
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-bold text-white truncate">{{ athlete.first_name }} {{ athlete.last_name }}</h3>
              <p class="text-xs text-brand-gold/60 truncate">{{ athlete.club || 'Independent' }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="px-1.5 py-0.5 rounded bg-surface-highlight text-[10px] text-white">
                  {{ athlete.athlete_code }}
                </span>
                <span class="text-[10px] text-brand-gold/40">
                  {{ athlete.country }}
                </span>
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
const { get } = useApi()

const q = computed(() => route.query.q || '')
const activeTab = ref('tournaments')
const loading = ref(false)
const results = ref({
  tournaments: [],
  athletes: []
})

const tabs = [
  { id: 'tournaments', label: 'Tournaments' },
  { id: 'athletes', label: 'Athletes' }
]

const hasResults = computed(() => {
  if (activeTab.value === 'tournaments') return results.value.tournaments.length > 0
  if (activeTab.value === 'athletes') return results.value.athletes.length > 0
  return false
})

const getItemCount = (id) => {
  if (id === 'tournaments') return results.value.tournaments.length
  if (id === 'athletes') return results.value.athletes.length
  return null
}

const fetchData = async () => {
  if (!q.value) return
  
  loading.value = true
  try {
    const [tournamentsRes, athletesRes] = await Promise.all([
      get(`/tournaments?search=${encodeURIComponent(q.value)}&limit=20`),
      get(`/athletes?search=${encodeURIComponent(q.value)}&limit=20`)
    ])
    
    results.value.tournaments = tournamentsRes.tournaments || []
    results.value.athletes = athletesRes.athletes || []
    
    // Auto-switch to tab with results if current is empty
    if (results.value.tournaments.length === 0 && results.value.athletes.length > 0) {
      activeTab.value = 'athletes'
    } else if (results.value.tournaments.length > 0) {
      activeTab.value = 'tournaments'
    }
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
  }
}

// Helper functions
const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getStatusClass = (status) => {
  const base = 'px-2 py-0.5 rounded-full text-[10px] font-bold uppercase'
  switch (status?.toLowerCase()) {
    case 'published': return `${base} bg-green-500/10 text-green-500`
    case 'ongoing': return `${base} bg-blue-500/10 text-blue-500`
    case 'completed': return `${base} bg-brand-gold/10 text-brand-gold`
    default: return `${base} bg-brand-gold/10 text-brand-gold`
  }
}

// Watch for query changes
watch(() => route.query.q, () => {
  fetchData()
}, { immediate: true })
</script>
