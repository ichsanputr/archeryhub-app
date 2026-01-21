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
        <BaseButton variant="outline" size="sm" icon="ph:pause">
          Pause Round
        </BaseButton>
        <BaseButton variant="primary" size="sm" icon="ph:broadcast">
          Broadcast
        </BaseButton>
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
            <Icon icon="ph:users" class="text-xl" />
          </div>
        </div>
        <div class="mt-auto">
          <p class="text-green-600 text-xs font-bold flex items-center gap-1">
            <Icon icon="ph:trend-up" class="text-[14px]" />
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
            <Icon icon="ph:target" class="text-xl" />
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
            <Icon icon="ph:check-square-offset" class="text-xl" />
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
            <Icon icon="ph:timer" class="text-xl" />
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
          <BaseButton variant="ghost" size="sm">
            View All
          </BaseButton>
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
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
definePageMeta({
  layout: 'dashboard'
})

const stats = [
  { label: 'Total Archers', value: '124', icon: 'ph:users', trend: '+12 check-ins today', trendIcon: 'ph:trend-up', trendColor: 'text-green-600' },
  { label: 'Active Targets', value: '32/35', icon: 'ph:target', trend: 'All systems online', trendIcon: 'ph:check-circle', trendColor: 'text-text-secondary' },
  { label: 'Completion', value: '85%', icon: 'ph:check-square-offset', trend: '', trendIcon: '', trendColor: '' },
  { label: 'Time Left', value: '45:20', icon: 'ph:timer', trend: 'Est. End: 14:30 PM', trendIcon: 'ph:clock', trendColor: 'text-text-secondary' },
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
  { label: 'Print Scorecards', icon: 'ph:printer' },
  { label: 'Sync Leaderboard', icon: 'ph:arrows-clockwise' },
  { label: 'Edit Assignments', icon: 'ph:note-pencil' },
  { label: 'Announcements', icon: 'ph:megaphone' },
  { label: 'Generate QR', icon: 'ph:qr-code' },
  { label: 'Device Manager', icon: 'ph:desktop' },
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
