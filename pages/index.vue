<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col gap-4">
      <h1 class="text-white text-3xl md:text-4xl font-black leading-tight">Dashboard</h1>
      <p class="text-brand-gold text-base">Welcome back! Here's what's happening with your tournaments today.</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-brand-gold text-sm font-medium">Active Tournaments</p>
            <h3 class="text-white text-3xl font-bold mt-2">{{ stats.activeTournaments }}</h3>
            <p class="text-green-400 text-xs mt-1">
              <span class="material-symbols-outlined text-xs inline">trending_up</span>
              +12% from last month
            </p>
          </div>
          <div class="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-2xl">target</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-brand-gold text-sm font-medium">Total Athletes</p>
            <h3 class="text-white text-3xl font-bold mt-2">{{ stats.totalAthletes }}</h3>
            <p class="text-green-400 text-xs mt-1">
              <span class="material-symbols-outlined text-xs inline">trending_up</span>
              +24% from last month
            </p>
          </div>
          <div class="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-2xl">groups</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-brand-gold text-sm font-medium">Live Events</p>
            <h3 class="text-white text-3xl font-bold mt-2">{{ stats.liveEvents }}</h3>
            <p class="text-primary text-xs mt-1 flex items-center gap-1">
              <span class="size-2 bg-red-500 rounded-full animate-pulse"></span>
              Currently in progress
            </p>
          </div>
          <div class="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-2xl">live_tv</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-brand-gold text-sm font-medium">Completed Today</p>
            <h3 class="text-white text-3xl font-bold mt-2">{{ stats.completedToday }}</h3>
            <p class="text-gray-400 text-xs mt-1">Events finished</p>
          </div>
          <div class="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <span class="material-symbols-outlined text-2xl">check_circle</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions & Recent Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Quick Actions -->
      <div class="card lg:col-span-1">
        <h2 class="text-white text-xl font-bold mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">bolt</span>
          Quick Actions
        </h2>
        <div class="space-y-3">
          <button 
            v-for="action in quickActions" 
            :key="action.label"
            @click="handleQuickAction(action.path)"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-highlight hover:bg-surface-highlight/70 transition-colors text-left"
          >
            <span class="material-symbols-outlined text-primary">{{ action.icon }}</span>
            <span class="text-white font-medium text-sm">{{ action.label }}</span>
          </button>
        </div>
      </div>

      <!-- Recent Tournaments -->
      <div class="card lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-white text-xl font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">schedule</span>
            Recent Tournaments
          </h2>
          <NuxtLink to="/tournaments" class="text-primary text-sm font-medium hover:text-yellow-400">
            View All →
          </NuxtLink>
        </div>
        
        <div v-if="loading" class="flex justify-center py-8">
          <div class="spinner"></div>
        </div>

        <div v-else-if="recentTournaments.length === 0" class="text-center py-8 text-brand-gold">
          <span class="material-symbols-outlined text-4xl mb-2">inbox</span>
          <p>No tournaments yet. Create your first one!</p>
        </div>

        <div v-else class="space-y-3">
          <div 
            v-for="tournament in recentTournaments" 
            :key="tournament.id"
            class="flex items-center justify-between p-4 rounded-lg bg-surface-highlight hover:bg-surface-highlight/70 transition-colors cursor-pointer"
            @click="$router.push(`/tournaments/${tournament.id}`)"
          >
            <div class="flex items-center gap-4">
              <div class="size-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold">
                {{ tournament.code }}
              </div>
              <div>
                <h3 class="text-white font-bold text-sm">{{ tournament.name }}</h3>
                <p class="text-brand-gold text-xs mt-1">
                  {{ formatDate(tournament.start_date) }} - {{ formatDate(tournament.end_date) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <span :class="getStatusClass(tournament.status)" class="badge">
                {{ tournament.status }}
              </span>
              <span class="text-brand-gold text-sm">
                {{ tournament.participant_count }} athletes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

definePageMeta({
  title: 'Dashboard',
  layout: 'default'
})

// Sample data (will be replaced with API calls)
const stats = ref({
  activeTournaments: 8,
  totalAthletes: 1247,
  liveEvents: 3,
  completedToday: 5
})

const loading = ref(false)

const recentTournaments = ref([
  {
    id: '1',
    code: 'NAC24',
    name: 'National Archery Championship 2024',
    start_date: '2024-06-15',
    end_date: '2024-06-18',
    status: 'ongoing',
    participant_count: 245
  },
  {
    id: '2',
    code: 'RQ24',
    name: 'Regional Qualifier 2024',
    start_date: '2024-06-10',
    end_date: '2024-06-11',
    status: 'completed',
    participant_count: 128
  },
  {
    id: '3',
    code: 'IND24',
    name: 'Indoor Championship 2024',
    start_date: '2024-07-01',
    end_date: '2024-07-03',
    status: 'published',
    participant_count: 98
  },
])

const quickActions = [
  { label: 'Create New Tournament', icon: 'add_circle', path: '/tournaments/create' },
  { label: 'Register Athlete', icon: 'person_add', path: '/athletes/create' },
  { label: 'View Live Results', icon: 'live_tv', path: '/live' },
  { label: 'Generate Reports', icon: 'assessment', path: '/reports' },
]

const handleQuickAction = (path) => {
  router.push(path)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusClass = (status) => {
  const statusClasses = {
    'ongoing': 'badge-info',
    'completed': 'badge-success',
    'published': 'badge-warning',
    'draft': 'badge-neutral',
    'archived': 'badge-neutral'
  }
  return statusClasses[status] || 'badge-neutral'
}

onMounted(async () => {
  const { get } = useApi()
  loading.value = true
  
  try {
    // Fetch stats and recent tournaments in parallel
    const [statsRes, tournamentsRes] = await Promise.all([
      get('/stats/dashboard'),
      get('/tournaments?limit=5')
    ])
    
    if (statsRes) {
      stats.value = statsRes
    }
    
    if (tournamentsRes && tournamentsRes.tournaments) {
      recentTournaments.value = tournamentsRes.tournaments
    }
  } catch (error) {
    console.error('Dashboard data fetch error:', error)
  } finally {
    loading.value = false
  }
})
</script>
