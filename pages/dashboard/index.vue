<template>
  <div class="space-y-10">
    <!-- Welcome Header -->
    <div class="flex flex-wrap items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight uppercase">Overview</h1>
        <p class="text-text-secondary mt-1 font-medium text-sm">Qualification Round 2 in progress across active events
        </p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/dashboard/tournaments/create"
          class="flex items-center gap-2 px-5 py-2.5 bg-navy text-white hover:bg-navy-light font-bold text-sm rounded-xl transition-all shadow-md">
          <span class="material-symbols-outlined text-[20px]">add</span>
          Create New Event
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div v-for="stat in dashboardStats" :key="stat.label"
        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <p class="text-navy text-3xl font-black tracking-tight tabular-nums">{{ stat.value }}</p>
          </div>
          <div
            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy transition-colors">
            <span class="material-symbols-outlined">{{ stat.icon }}</span>
          </div>
        </div>
        <div class="mt-auto">
          <p :class="stat.trendColor" class="text-[10px] font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">{{ stat.trendIcon }}</span>
            {{ stat.trend }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full min-h-[400px]">
      <!-- Active Tournaments -->
      <div
        class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 class="text-navy font-bold text-lg flex items-center gap-2">
            Active Tournaments
            <span
              class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE
            </span>
          </h3>
          <NuxtLink to="/dashboard/tournaments"
            class="text-xs text-text-secondary hover:text-navy font-bold transition-colors">View All</NuxtLink>
        </div>

        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50/50 text-gray-500 font-bold border-b border-gray-100">
              <tr>
                <th class="px-6 py-3 text-[10px] uppercase tracking-wider">Tournament</th>
                <th class="px-6 py-3 text-[10px] uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-[10px] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="event in activeEvents" :key="event.id"
                class="group hover:bg-gray-50 transition-colors cursor-pointer"
                @click="navigateTo(`/dashboard/tournaments/${event.id}/manage`)">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="size-10 rounded-lg bg-navy/5 flex items-center justify-center text-navy group-hover:bg-primary group-hover:text-navy transition-colors shrink-0">
                      <span class="text-xs font-black">{{ event.code }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-bold text-navy group-hover:text-primary-hover transition-colors">{{
                        event.name }}</div>
                      <div class="text-[10px] text-gray-400 font-bold uppercase">{{ event.location }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col gap-1 w-24">
                    <div class="flex justify-between items-center text-[9px] font-black text-gray-400 uppercase">
                      <span>Progress</span>
                      <span>{{ event.progress }}%</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-1">
                      <div class="bg-primary h-1 rounded-full transition-all duration-1000"
                        :style="`width: ${event.progress}%`"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    class="text-xs font-black text-primary-hover hover:text-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10">Manage</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Live Alerts / Notifications -->
      <div
        class="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 class="text-navy font-bold text-lg flex items-center gap-2">
            Live Alerts
          </h3>
          <span
            class="bg-red-50 text-red-600 border border-red-100 text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{{
              notifications.length }} New</span>
        </div>
        <div class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 no-scrollbar">
          <div v-for="notif in notifications" :key="notif.id"
            class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 group transition-all hover:border-primary/20 hover:bg-white hover:shadow-card">
            <div :class="notif.iconBg"
              class="p-2 bg-white rounded-lg border border-gray-100 shadow-sm shrink-0 group-hover:border-primary group-hover:text-primary transition-colors">
              <span class="material-symbols-outlined text-[18px]" :class="notif.iconColor">{{ notif.icon }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold text-navy leading-tight group-hover:text-primary-hover transition-colors">{{
                notif.title }}</p>
              <p class="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest">{{ notif.time }}</p>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-50">
          <button
            class="w-full py-2 text-[10px] font-black text-gray-400 hover:text-navy uppercase tracking-widest transition-colors">Mark
            all as read</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const dashboardStats = [
  { label: 'Active Tournaments', value: '12', icon: 'emoji_events', trend: '+2 new', trendIcon: 'trending_up', trendColor: 'text-green-600' },
  { label: 'Total Archers', value: '1,240', icon: 'groups', trend: '+15% vs last month', trendIcon: 'trending_up', trendColor: 'text-green-600' },
  { label: 'Revenue (IDR)', value: '45.2M', icon: 'payments', trend: '+12% vs last month', trendIcon: 'trending_up', trendColor: 'text-green-600' },
  { label: 'Support Tickets', value: '4', icon: 'support_agent', trend: '2 urgent tickets', trendIcon: 'warning', trendColor: 'text-red-600' },
]

const activeEvents = [
  { id: '1', code: 'IO-24', name: 'Indonesian Open Championship 2024', participants: 450, location: 'GBK Jakarta', progress: 75 },
  { id: '2', code: 'ST-24', name: 'National Selection Stage 1', participants: 120, location: 'Sentul Archery', progress: 100 },
  { id: '3', code: 'RY-24', name: 'Riau Open Series #2', participants: 280, location: 'Pekanbaru', progress: 20 },
]

const notifications = [
  { id: 1, title: 'New registration: Budi Santoso (Recurve Men)', time: '2 MIN AGO', icon: 'person_add', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { id: 2, title: 'Payment verified: Rp 350,000', time: '15 MIN AGO', icon: 'check_circle', iconBg: 'bg-green-50', iconColor: 'text-green-500' },
  { id: 3, title: 'Target #12 issue in scoring app', time: '1 HOUR AGO', icon: 'warning', iconBg: 'bg-red-50', iconColor: 'text-red-500' },
  { id: 4, title: 'Day 1 report ready to download', time: '3 HOURS AGO', icon: 'description', iconBg: 'bg-gray-50', iconColor: 'text-gray-400' },
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
