<template>
  <div class="space-y-10">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight uppercase">Scoring Monitor</h1>
        <p class="text-text-secondary mt-1 font-medium text-sm">Real-time lane progress tracking and score management.
        </p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-5 py-2.5 bg-white border border-gray-200 text-gray-400 hover:text-navy font-bold text-sm rounded-xl transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">filter_list</span>
          Filter Lanes
        </button>
        <button
          class="px-5 py-2.5 bg-navy text-white hover:bg-navy-light font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">download</span>
          Export Results
        </button>
      </div>
    </div>

    <!-- Quick Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="metric in scoringMetrics" :key="metric.label"
        class="bg-white rounded-2xl p-6 shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 group hover:border-primary transition-all">
        <div class="flex items-center justify-between mb-4">
          <div :class="metric.bgClass"
            class="size-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110">
            <span class="material-symbols-outlined text-[20px]" :class="metric.iconColor">{{ metric.icon }}</span>
          </div>
          <span v-if="metric.trend" :class="metric.trendClass"
            class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-gray-50">{{ metric.trend }}</span>
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ metric.label }}</span>
          <h3 class="text-2xl font-black text-navy">{{ metric.value }}</h3>
        </div>
      </div>
    </div>

    <!-- Live Monitor Table -->
    <div
      class="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col">
      <div class="px-8 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <div class="flex items-center gap-3">
          <h3 class="font-black text-navy text-lg uppercase tracking-tight">Real-time Lane Progress</h3>
          <span
            class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase animate-pulse">Live</span>
        </div>
        <div class="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-gray-400">
          <div class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-navy"></span> Completed</div>
          <div class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-primary"></span> In Progress</div>
          <div class="flex items-center gap-1.5"><span class="size-2 rounded-full bg-gray-100 border"></span> Waiting
          </div>
        </div>
      </div>

      <div class="overflow-x-auto no-scrollbar">
        <table class="w-full text-left">
          <thead
            class="bg-gray-50/30 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
            <tr>
              <th class="px-8 py-4 w-24">Lane</th>
              <th class="px-8 py-4">Archers & Scores</th>
              <th class="px-8 py-4">End Progress</th>
              <th class="px-8 py-4">Status</th>
              <th class="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="target in scoringData" :key="target.id" class="group hover:bg-gray-50/50 transition-all">
              <td class="px-8 py-6">
                <div
                  class="size-12 bg-navy text-primary rounded-xl font-black text-xl flex items-center justify-center shadow-lg shadow-navy/20 group-hover:scale-110 transition-transform">
                  {{ target.target }}
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col gap-3">
                  <div v-for="ath in target.archers" :key="ath.name" class="flex items-center gap-3">
                    <span
                      class="size-6 rounded-lg bg-gray-50 text-[10px] font-black flex items-center justify-center text-gray-400 border border-gray-100">{{
                      ath.pos }}</span>
                    <div class="flex flex-col">
                      <span class="text-xs font-black text-navy leading-none">{{ ath.name }}</span>
                      <span class="text-[10px] font-bold text-gray-400 mt-1 tabular-nums">Current Score: <span
                          class="text-navy">{{ ath.score }}</span></span>
                    </div>
                  </div>
                  <div v-if="!target.archers.length" class="text-[10px] font-bold text-gray-300 italic uppercase">No
                    archers assigned</div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col gap-3">
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">End {{ target.currentEnd
                    }} / {{ target.totalEnds }}</span>
                  <div class="flex items-center gap-1.5">
                    <div v-for="i in 6" :key="i"
                      class="size-3 rounded-full border border-gray-100 transition-all shadow-inner"
                      :class="i < target.currentEnd ? 'bg-navy' : i === target.currentEnd ? 'bg-primary animate-pulse' : 'bg-gray-50'">
                    </div>
                    <span class="text-[10px] font-black text-gray-200 ml-1">...</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span :class="getStatusClass(target.status)"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                  <span v-if="target.status === 'live'"
                    class="size-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {{ target.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <button
                  class="px-4 py-2 bg-primary/10 hover:bg-primary text-navy font-black text-[10px] uppercase tracking-widest rounded-lg transition-all flex items-center gap-2 justify-center ml-auto border border-primary/20">
                  <span class="material-symbols-outlined text-[16px]">edit_note</span>
                  Rapid Entry
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing <span
            class="text-navy">1-5</span> of <span class="text-navy">32</span> active lanes</p>
        <div class="flex gap-2">
          <button class="p-1.5 text-gray-300 hover:text-navy transition-colors"><span
              class="material-symbols-outlined">chevron_left</span></button>
          <button class="p-1.5 text-gray-300 hover:text-navy transition-colors"><span
              class="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const scoringMetrics = [
  { label: 'Ends Completed', value: '450', icon: 'flag', iconColor: 'text-blue-600', bgClass: 'bg-blue-50', trend: 'Live', trendClass: 'text-emerald-500' },
  { label: 'Avg Arrow Score', value: '8.7', icon: 'analytics', iconColor: 'text-purple-600', bgClass: 'bg-purple-50', trend: '+0.2', trendClass: 'text-emerald-500' },
  { label: 'Delayed Inputs', value: '5', icon: 'pending_actions', iconColor: 'text-rose-600', bgClass: 'bg-rose-50', trend: 'Alert', trendClass: 'text-rose-500' },
  { label: 'Live Leader', value: '298', icon: 'emoji_events', iconColor: 'text-amber-600', bgClass: 'bg-amber-50', trend: 'Jenkins', trendClass: 'text-navy' },
]

const scoringData = [
  { id: 1, target: '01', status: 'live', currentEnd: 4, totalEnds: 20, archers: [{ pos: 'A', name: 'Sarah Jenkins', score: 298 }, { pos: 'B', name: 'Mike Ross', score: 285 }] },
  { id: 2, target: '02', status: 'live', currentEnd: 4, totalEnds: 20, archers: [{ pos: 'A', name: 'Jessica Pearson', score: 290 }, { pos: 'B', name: 'Harvey Specter', score: 292 }] },
  { id: 3, target: '03', status: 'pending', currentEnd: 0, totalEnds: 20, archers: [] },
  { id: 4, target: '04', status: 'finished', currentEnd: 20, totalEnds: 20, archers: [{ pos: 'A', name: 'Louis Litt', score: 568 }, { pos: 'B', name: 'Donna Paulsen', score: 552 }] },
  { id: 5, target: '05', status: 'live', currentEnd: 4, totalEnds: 20, archers: [{ pos: 'A', name: 'Rachel Zane', score: 275 }, { pos: 'B', name: 'Katrina Bennett', score: 268 }] },
]

const getStatusClass = (status) => {
  const classes = {
    'live': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'finished': 'bg-blue-50 text-blue-700 border-blue-200'
  }
  return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}
</script>
