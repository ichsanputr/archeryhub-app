<template>
  <div class="space-y-6">
    <!-- Search Header -->
    <div class="flex flex-col gap-4">
      <h1 class="text-3xl font-black text-navy">Hasil Pencarian</h1>
      <p class="text-text-secondary font-medium" v-if="q">
        Menampilkan hasil untuk "<span class="text-navy font-bold italic">{{ q }}</span>"
      </p>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-100 overflow-x-auto no-scrollbar pb-1">
      <BaseButton v-for="tab in tabs" :key="tab.id" variant="ghost" size="sm" :class="[
        'rounded-none border-b-2 font-bold !px-6 !py-4 transition-all whitespace-nowrap',
        activeTab === tab.id ? 'border-primary text-navy bg-primary/5' : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'
      ]" @click="activeTab = tab.id">
        {{ tab.label }}
        <span v-if="getItemCount(tab.id) !== null"
          class="ml-2 px-2 py-0.5 rounded-full bg-gray-100 text-[10px] text-navy font-black">
          {{ getItemCount(tab.id) }}
        </span>
      </BaseButton>
    </div>

    <!-- Results Area -->
    <div class="min-h-[400px]">
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
        <div class="loading-spinner"></div>
        <p class="text-brand-gold/60">Searching...</p>
      </div>

      <div v-else-if="!hasResults" class="flex flex-col items-center justify-center py-20 gap-6 text-center">
        <div class="p-6 bg-gray-100 rounded-full">
          <Icon icon="ph:magnifying-glass-minus" class="text-6xl text-gray-300" />
        </div>
        <div>
          <h3 class="text-xl font-bold text-navy mb-2">Tidak ada hasil ditemukan</h3>
          <p class="text-text-secondary max-w-xs mx-auto">Coba gunakan kata kunci lain atau periksa filter pencarian
            kamu.</p>
        </div>
      </div>

      <div v-else>
        <!-- Tournaments Tab -->
        <div v-if="activeTab === 'tournaments'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="tournament in results.tournaments" :key="tournament.id"
            class="bg-white border border-gray-200 rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all group cursor-pointer"
            @click="navigateTo(`/dashboard/events/${tournament.id}`)">
            <div class="flex justify-between items-start mb-4">
              <span class="px-2 py-1 rounded bg-navy text-white text-[10px] font-black tracking-widest">
                {{ tournament.code }}
              </span>
              <span :class="getStatusClass(tournament.status)">
                {{ tournament.status }}
              </span>
            </div>
            <h3 class="text-lg font-black text-navy group-hover:text-primary transition-colors mb-3 line-clamp-1">
              {{ tournament.name }}
            </h3>
            <div class="space-y-2.5 text-sm text-text-secondary font-medium">
              <div class="flex items-center gap-2">
                <Icon icon="ph:calendar" class="text-lg text-primary" />
                {{ formatDate(tournament.start_date) }}
              </div>
              <div class="flex items-center gap-2">
                <Icon icon="ph:map-pin" class="text-lg text-primary" />
                {{ tournament.location || tournament.venue || 'Venue TBD' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Athletes Tab -->
        <div v-if="activeTab === 'athletes'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="athlete in results.athletes" :key="athlete.uuid || athlete.id"
            class="glass-card p-4 flex items-center gap-4 hover:border-primary/50 transition-all cursor-pointer"
            @click="navigateTo(`/archers/${athlete.username || athlete.slug}`)">
            <div
              class="size-16 rounded-full bg-surface-highlight flex items-center justify-center overflow-hidden shrink-0 border-2 border-surface-highlight group-hover:border-primary/30 transition-colors">
              <img v-if="athlete.photo_url" :src="athlete.photo_url" class="size-full object-cover" />
              <Icon v-else icon="ph:user" class="text-3xl text-brand-gold/30" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-base font-bold text-white truncate">{{ athlete.full_name }}</h3>
              <p class="text-xs text-brand-gold/60 truncate">{{ athlete.club_name || 'Independent' }}
              </p>
              <div class="flex items-center gap-2 mt-2">
                <span class="px-1.5 py-0.5 rounded bg-surface-highlight text-[10px] text-white">
                  {{ athlete.id }}
                </span>
                <span class="text-[10px] text-brand-gold/40">
                  {{ athlete.city || '-' }}
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
import { Icon } from '@iconify/vue'
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
      get(`/events?search=${encodeURIComponent(q.value)}&limit=20`),
      get(`/archers?search=${encodeURIComponent(q.value)}&limit=20`)
    ])

    results.value.tournaments = tournamentsRes.tournaments || []
    results.value.athletes = athletesRes.archers || athletesRes.athletes || []

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
