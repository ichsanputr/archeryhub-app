<template>
  <div class="flex flex-col gap-6 -m-8 p-8 min-h-screen bg-background-dark">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="size-12 rounded-lg bg-surface-highlight flex items-center justify-center text-primary">
          <span class="material-symbols-outlined text-[24px]">emoji_events</span>
        </div>
        <div>
          <h2 class="text-white text-xl font-bold leading-tight">{{ tournamentName }}</h2>
          <p class="text-brand-gold text-sm">{{ tournamentLocation }} • {{ tournamentDates }}</p>
        </div>
      </div>
      <div class="flex gap-3">
        <button class="btn-secondary flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">pause</span>
          Pause Round
        </button>
        <button class="btn-primary flex items-center gap-2 shadow-lg shadow-yellow-900/20">
          <span class="material-symbols-outlined text-[18px]">campaign</span>
          Broadcast Message
        </button>
      </div>
    </div>

    <!-- Page Heading & Live Badge -->
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3 mb-1">
          <h1 class="text-3xl font-black text-white tracking-tight">Overview</h1>
          <span
            class="px-2 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            LIVE
          </span>
        </div>
        <p class="text-brand-gold">Qualification Round 2 in progress • 45m 20s remaining</p>
      </div>
    </div>

    <!-- KPI Stats Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        class="bg-surface-highlight rounded-xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div class="absolute right-[-10px] top-[-10px] text-white/5 group-hover:text-white/10 transition-colors">
          <span class="material-symbols-outlined text-[100px]">group</span>
        </div>
        <p class="text-brand-gold text-sm font-medium">Total Archers</p>
        <div>
          <p class="text-white text-3xl font-bold">124</p>
          <p class="text-green-400 text-xs flex items-center gap-1 mt-1">
            <span class="material-symbols-outlined text-[14px]">trending_up</span>
            +12 check-ins
          </p>
        </div>
      </div>

      <div
        class="bg-surface-highlight rounded-xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div class="absolute right-[-10px] top-[-10px] text-white/5 group-hover:text-white/10 transition-colors">
          <span class="material-symbols-outlined text-[100px]">adjust</span>
        </div>
        <p class="text-brand-gold text-sm font-medium">Active Targets</p>
        <div>
          <p class="text-white text-3xl font-bold">32<span class="text-lg text-brand-gold font-normal">/35</span></p>
          <p class="text-brand-gold text-xs mt-1">All sensors active</p>
        </div>
      </div>

      <div
        class="bg-surface-highlight rounded-xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div class="absolute right-[-10px] top-[-10px] text-white/5 group-hover:text-white/10 transition-colors">
          <span class="material-symbols-outlined text-[100px]">assignment_turned_in</span>
        </div>
        <p class="text-brand-gold text-sm font-medium">Scores Submitted</p>
        <div>
          <p class="text-primary text-3xl font-bold">85%</p>
          <div class="w-full bg-black/20 rounded-full h-1.5 mt-2">
            <div class="bg-primary h-1.5 rounded-full" style="width: 85%"></div>
          </div>
        </div>
      </div>

      <div
        class="bg-surface-highlight rounded-xl p-5 flex flex-col justify-between h-32 relative overflow-hidden group">
        <div class="absolute right-[-10px] top-[-10px] text-white/5 group-hover:text-white/10 transition-colors">
          <span class="material-symbols-outlined text-[100px]">timer</span>
        </div>
        <p class="text-brand-gold text-sm font-medium">Time Remaining</p>
        <div>
          <p class="text-white text-3xl font-bold tabular-nums">45:20</p>
          <p class="text-brand-gold text-xs mt-1">End: 14:30 PM</p>
        </div>
      </div>
    </div>

    <!-- Main Grid: Targets and Leaderboard -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Target Status -->
      <div class="lg:col-span-2 bg-surface-dark rounded-xl border border-brand-border flex flex-col overflow-hidden">
        <div class="p-4 border-b border-brand-border flex justify-between items-center bg-[#232010]">
          <h3 class="text-white font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">grid_view</span>
            Target Status
          </h3>
          <div class="flex gap-2 text-xs font-medium">
            <div class="flex items-center gap-1.5 px-2 py-1 bg-brand-border/30 rounded text-brand-gold">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
              Shooting
            </div>
            <div class="flex items-center gap-1.5 px-2 py-1 bg-brand-border/30 rounded text-brand-gold">
              <span class="w-2 h-2 rounded-full bg-primary"></span>
              Scoring
            </div>
            <div class="flex items-center gap-1.5 px-2 py-1 bg-brand-border/30 rounded text-brand-gold">
              <span class="w-2 h-2 rounded-full bg-red-500"></span>
              Issue
            </div>
          </div>
        </div>
        <div class="p-6 flex-1 overflow-y-auto">
          <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            <div v-for="target in targets" :key="target.id" :class="getTargetClass(target.status)"
              class="aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group">
              <span :class="getTargetTextClass(target.status)"
                class="font-bold text-lg group-hover:scale-110 transition-transform">
                {{ target.id }}
              </span>
              <span v-if="target.status === 'issue'" class="material-symbols-outlined text-[16px] text-red-400">
                warning
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini Leaderboard -->
      <div class="bg-surface-dark rounded-xl border border-brand-border flex flex-col overflow-hidden">
        <div class="p-4 border-b border-brand-border flex justify-between items-center bg-[#232010]">
          <h3 class="text-white font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">leaderboard</span>
            Leaderboard
          </h3>
          <NuxtLink :to="`/live/${tournamentId}`" class="text-xs text-primary hover:text-yellow-300 font-medium">
            View Full
          </NuxtLink>
        </div>
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-brand-border/20 text-brand-gold font-medium">
              <tr>
                <th class="px-4 py-3">Rk</th>
                <th class="px-4 py-3">Archer</th>
                <th class="px-4 py-3 text-right">Score</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-border">
              <tr v-for="(entry, index) in leaderboard" :key="entry.id" class="hover:bg-white/5 transition-colors">
                <td class="px-4 py-3 font-bold" :class="index === 0 ? 'text-primary' : 'text-white'">
                  {{ index + 1 }}
                </td>
                <td class="px-4 py-3">
                  <div class="text-white font-medium">{{ entry.name }}</div>
                  <div class="text-brand-gold text-xs">{{ entry.category }}</div>
                </td>
                <td class="px-4 py-3 text-right font-mono text-white">{{ entry.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Alerts and Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Live Alerts -->
      <div class="bg-surface-dark rounded-xl border border-brand-border flex flex-col">
        <div class="p-4 border-b border-brand-border flex justify-between items-center bg-[#232010]">
          <h3 class="text-white font-bold flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">notifications_active</span>
            Live Alerts
          </h3>
          <span class="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">2 New</span>
        </div>
        <div class="p-4 flex flex-col gap-3">
          <div v-for="alert in alerts" :key="alert.id"
            :class="alert.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 'bg-brand-border/30 border-brand-border/50'"
            class="flex items-start gap-3 p-3 rounded-lg border">
            <span :class="alert.type === 'error' ? 'text-red-400' : 'text-primary'"
              class="material-symbols-outlined mt-0.5">
              {{ alert.icon }}
            </span>
            <div class="flex-1">
              <p :class="alert.type === 'error' ? 'text-red-200' : 'text-white'" class="text-sm font-bold">
                {{ alert.title }}
              </p>
              <p :class="alert.type === 'error' ? 'text-red-200/70' : 'text-brand-gold'" class="text-xs">
                {{ alert.message }}
              </p>
            </div>
            <button
              :class="alert.type === 'error' ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' : 'bg-brand-border hover:bg-surface-highlight text-white'"
              class="px-3 py-1 text-xs rounded transition-colors">
              {{ alert.action }}
            </button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-surface-dark rounded-xl border border-brand-border p-6">
        <h3 class="text-white font-bold mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary">bolt</span>
          Quick Actions
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <button v-for="action in quickActions" :key="action.label"
            class="flex flex-col items-center justify-center p-4 rounded-lg bg-brand-border/20 border border-brand-border hover:bg-brand-border/40 hover:border-primary/50 text-white transition-all group">
            <span class="material-symbols-outlined mb-2 group-hover:text-primary transition-colors">
              {{ action.icon }}
            </span>
            <span class="text-xs font-medium text-center">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  title: 'Tournament Dashboard',
  layout: 'default',
  middleware: 'auth'
})

const route = useRoute()
const tournamentId = route.params.id

const tournamentName = ref('2024 State Indoor Championship')
const tournamentLocation = ref('Detroit, Michigan')
const tournamentDates = ref('Dec 14-16, 2024')

const targets = ref([
  ...Array.from({ length: 18 }, (_, i) => ({ id: String(i + 1).padStart(2, '0'), status: i === 3 ? 'issue' : i >= 6 && i <= 7 ? 'scoring' : 'shooting' })),
  ...Array.from({ length: 6 }, (_, i) => ({ id: String(i + 19).padStart(2, '0'), status: 'inactive' }))
])

const leaderboard = ref([
  { id: 1, name: 'Sarah Jenkins', category: 'Recurve Open', score: 582 },
  { id: 2, name: 'Mike Ross', category: 'Compound', score: 579 },
  { id: 3, name: 'David Chen', category: 'Recurve Open', score: 575 },
  { id: 4, name: 'Jessica Wu', category: 'Compound', score: 572 },
  { id: 5, name: 'Tom Baker', category: 'Recurve Open', score: 568 },
])

const alerts = ref([
  { id: 1, type: 'error', icon: 'warning', title: 'Target 04 Malfunction', message: 'Sensor not registering hits. Technician dispatched.', action: 'Dismiss' },
  { id: 2, type: 'info', icon: 'gavel', title: 'Scoring Review Requested', message: 'Archer #23 contested Arrow 3 on End 4.', action: 'Review' },
])

const quickActions = ref([
  { icon: 'print', label: 'Print Scorecards' },
  { icon: 'published_with_changes', label: 'Sync Leaderboard' },
  { icon: 'edit_note', label: 'Edit Assignments' },
  { icon: 'mic', label: 'Announcements' },
  { icon: 'qr_code', label: 'Generate QR' },
  { icon: 'settings_applications', label: 'Device Manager' },
])

const getTargetClass = (status) => {
  const classes = {
    'shooting': 'bg-emerald-500/20 border border-emerald-500/40 hover:bg-emerald-500/30',
    'scoring': 'bg-primary/20 border border-primary/40 hover:bg-primary/30',
    'issue': 'bg-red-500/20 border border-red-500/50 hover:bg-red-500/30 animate-pulse',
    'inactive': 'bg-brand-border/20 border border-brand-border cursor-not-allowed'
  }
  return classes[status] || ''
}

const getTargetTextClass = (status) => {
  const classes = {
    'shooting': 'text-emerald-400',
    'scoring': 'text-primary',
    'issue': 'text-red-400',
    'inactive': 'text-white/20'
  }
  return classes[status] || ''
}
</script>
