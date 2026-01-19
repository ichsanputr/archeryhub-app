<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-3xl font-bold text-navy-dark tracking-tight">Overview</h1>
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1.5 shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            LIVE
          </span>
        </div>
        <p class="text-text-secondary mt-1 font-medium text-sm">Qualification Round 2 in progress</p>
      </div>
      <div class="flex gap-3">
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-navy-dark hover:bg-gray-50 hover:border-gray-300 font-semibold text-sm transition-all shadow-sm">
          <span class="material-symbols-outlined text-[18px]">pause</span>
          Pause Round
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2 rounded-lg bg-navy-dark text-white hover:bg-navy-light font-bold text-sm transition-all shadow-md">
          <span class="material-symbols-outlined text-[18px]">campaign</span>
          Broadcast
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Total Archers -->
      <div
        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Total Archers</p>
            <p class="text-navy-dark text-3xl font-extrabold tracking-tight">124</p>
          </div>
          <div
            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
            <span class="material-symbols-outlined">group</span>
          </div>
        </div>
        <div class="mt-auto">
          <p class="text-green-600 text-xs font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">trending_up</span>
            +12 check-ins today
          </p>
        </div>
      </div>

      <!-- Active Targets -->
      <div
        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Active Targets</p>
            <p class="text-navy-dark text-3xl font-extrabold tracking-tight">32<span
                class="text-lg text-gray-400 font-medium ml-1">/ 35</span></p>
          </div>
          <div
            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
            <span class="material-symbols-outlined">adjust</span>
          </div>
        </div>
        <div class="mt-auto">
          <p class="text-text-secondary text-xs font-medium flex items-center gap-1">
            <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            All systems online
          </p>
        </div>
      </div>

      <!-- Completion -->
      <div
        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Completion</p>
            <p class="text-navy-dark text-3xl font-extrabold tracking-tight">85%</p>
          </div>
          <div
            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
            <span class="material-symbols-outlined">assignment_turned_in</span>
          </div>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
          <div class="bg-primary h-1.5 rounded-full" style="width: 85%"></div>
        </div>
      </div>

      <!-- Time Left -->
      <div
        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Time Left</p>
            <p class="text-navy-dark text-3xl font-extrabold tracking-tight tabular-nums">45:20</p>
          </div>
          <div
            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
            <span class="material-symbols-outlined">timer</span>
          </div>
        </div>
        <div class="mt-auto">
          <p class="text-text-secondary text-xs font-medium">Est. End: 14:30 PM</p>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Target Status -->
      <div
        class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Target Status</h3>
          <div class="flex gap-3 text-xs font-semibold">
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Shooting
            </div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary"></span> Scoring</div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-500"></span> Issue</div>
          </div>
        </div>
        <div class="p-6 flex-1 overflow-y-auto bg-gray-50/30">
          <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            <div v-for="target in targetGrid" :key="target.id" :class="getTargetGridClass(target.status)"
              class="aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group shadow-sm">
              <span class="font-bold text-lg group-hover:scale-110 transition-transform">{{
                String(target.id).padStart(2, '0') }}</span>
              <span v-if="target.status === 'issue'"
                class="material-symbols-outlined text-[16px] text-red-500">warning</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Leaderboard -->
      <div
        class="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Leaderboard</h3>
          <button class="text-xs text-text-secondary hover:text-navy-dark font-semibold transition-colors">View
            All</button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Rk</th>
                <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Archer</th>
                <th class="px-6 py-3 text-right font-medium text-xs uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(archer, index) in leaderboard" :key="archer.id"
                class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-3.5">
                  <div
                    :class="index === 0 ? 'bg-primary text-navy-dark font-extrabold shadow-sm' : 'text-gray-400 font-bold'"
                    class="w-6 h-6 rounded flex items-center justify-center text-xs">
                    {{ index + 1 }}
                  </div>
                </td>
                <td class="px-6 py-3.5">
                  <div class="text-navy-dark font-bold group-hover:text-primary-hover transition-colors">{{ archer.name
                    }}</div>
                  <div class="text-gray-400 text-xs">{{ archer.category }}</div>
                </td>
                <td :class="index === 0 ? 'text-navy-dark font-bold text-base' : 'text-navy-dark font-semibold text-sm'"
                  class="px-6 py-3.5 text-right font-mono">{{ archer.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Live Alerts & Quick Actions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      <!-- Live Alerts -->
      <div class="bg-white rounded-xl border border-gray-200 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Live Alerts</h3>
          <span
            class="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">2
            New</span>
        </div>
        <div class="p-6 flex flex-col gap-4">
          <div class="flex items-start gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
            <div class="p-2 bg-white rounded-lg border border-red-100 shadow-sm text-red-500">
              <span class="material-symbols-outlined mt-0.5">warning</span>
            </div>
            <div class="flex-1">
              <p class="text-navy-dark text-sm font-bold">Target 04 Malfunction</p>
              <p class="text-text-secondary text-xs mt-1">Sensor not registering hits. Technician dispatched.</p>
            </div>
            <button
              class="px-3 py-1.5 bg-white border border-gray-200 hover:border-red-200 hover:text-red-600 text-text-secondary text-xs font-semibold rounded-lg shadow-sm transition-colors">Dismiss</button>
          </div>
          <div class="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-navy-dark">
              <span class="material-symbols-outlined mt-0.5">gavel</span>
            </div>
            <div class="flex-1">
              <p class="text-navy-dark text-sm font-bold">Scoring Review Requested</p>
              <p class="text-text-secondary text-xs mt-1">Archer #23 contested Arrow 3 on End 4.</p>
            </div>
            <button
              class="px-3 py-1.5 bg-navy-dark hover:bg-navy-light text-white text-xs font-medium rounded-lg shadow-sm transition-colors">Review</button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 class="text-navy-dark font-bold mb-4 flex items-center gap-2 text-lg">Quick Actions</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button v-for="action in quickActions" :key="action.label"
            class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-text-main transition-all group duration-300">
            <span class="material-symbols-outlined mb-2 text-gray-400 group-hover:text-primary transition-colors">{{
              action.icon }}</span>
            <span class="text-xs font-bold group-hover:text-navy-dark text-center">{{ action.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const stats = [
  { label: 'Total Archers', value: '124', icon: 'group', trend: '+12 check-ins today', trendIcon: 'trending_up', trendColor: 'text-green-600' },
  { label: 'Active Targets', value: '32/35', icon: 'adjust', trend: 'All systems online', trendIcon: 'check_circle', trendColor: 'text-text-secondary' },
  { label: 'Completion', value: '85%', icon: 'assignment_turned_in', trend: '', trendIcon: '', trendColor: '' },
  { label: 'Time Left', value: '45:20', icon: 'timer', trend: 'Est. End: 14:30 PM', trendIcon: 'schedule', trendColor: 'text-text-secondary' },
]

const targetGrid = [
  { id: 1, status: 'shooting' },
  { id: 2, status: 'shooting' },
  { id: 3, status: 'shooting' },
  { id: 4, status: 'issue' },
  { id: 5, status: 'shooting' },
  { id: 6, status: 'shooting' },
  { id: 7, status: 'scoring' },
  { id: 8, status: 'scoring' },
  { id: 9, status: 'shooting' },
  { id: 10, status: 'shooting' },
  { id: 11, status: 'shooting' },
  { id: 12, status: 'shooting' },
  { id: 13, status: 'shooting' },
  { id: 14, status: 'shooting' },
  { id: 15, status: 'shooting' },
  { id: 16, status: 'shooting' },
  { id: 17, status: 'shooting' },
  { id: 18, status: 'shooting' },
  { id: 19, status: 'empty' },
  { id: 20, status: 'empty' },
  { id: 21, status: 'empty' },
  { id: 22, status: 'empty' },
  { id: 23, status: 'empty' },
  { id: 24, status: 'empty' },
]

const leaderboard = [
  { id: 1, name: 'Sarah Jenkins', category: 'Recurve Open', score: 582 },
  { id: 2, name: 'Mike Ross', category: 'Compound', score: 579 },
  { id: 3, name: 'David Chen', category: 'Recurve Open', score: 575 },
  { id: 4, name: 'Jessica Wu', category: 'Compound', score: 572 },
  { id: 5, name: 'Tom Baker', category: 'Recurve Open', score: 568 },
]

const quickActions = [
  { label: 'Print Scorecards', icon: 'print' },
  { label: 'Sync Leaderboard', icon: 'published_with_changes' },
  { label: 'Edit Assignments', icon: 'edit_note' },
  { label: 'Announcements', icon: 'mic' },
  { label: 'Generate QR', icon: 'qr_code' },
  { label: 'Device Manager', icon: 'settings_applications' },
]

const getTargetGridClass = (status) => {
  const classes = {
    'shooting': 'bg-white border border-emerald-200 text-emerald-700 hover:border-emerald-400',
    'scoring': 'bg-white border border-yellow-200 text-yellow-700 hover:border-primary',
    'issue': 'bg-red-50 border border-red-200 text-red-600 animate-pulse',
    'empty': 'bg-gray-50 border border-gray-200 text-gray-300 cursor-not-allowed'
  }
  return classes[status] || 'bg-gray-50 border border-gray-200 text-gray-300'
}
</script>
