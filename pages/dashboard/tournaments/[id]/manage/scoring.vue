<template>
  <div class="space-y-6">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 text-sm text-gray-500 mb-2 font-medium">
          <NuxtLink to="/dashboard/tournaments"
            class="hover:text-primary-hover transition-colors flex items-center gap-1">
            <span class="material-symbols-outlined text-[16px]">arrow_back</span>
            Kembali ke Events
          </NuxtLink>
          <span class="text-gray-300">/</span>
          <span class="text-gray-500">Detail Event</span>
          <span class="text-gray-300">/</span>
          <span class="text-navy font-semibold">Scoring</span>
        </div>
        <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">2024 State Indoor Championship</h1>
        <div class="flex items-center gap-3 mt-2">
          <span
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
            <span class="material-symbols-outlined text-[14px]">calendar_today</span>
            24 - 26 Okt 2024
          </span>
        </div>
      </div>
      <div class="flex gap-3 mt-2 md:mt-0">
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-navy hover:bg-gray-50 font-bold text-sm transition-all shadow-sm">
          <span class="material-symbols-outlined text-[20px]">filter_list</span>
          Filter
        </button>
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-navy hover:bg-gray-50 font-bold text-sm transition-all shadow-sm group">
          <span class="material-symbols-outlined text-[20px]">download</span>
          Ekspor Hasil
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        class="bg-white rounded-xl p-5 shadow-card border border-gray-100 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
        <div class="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-2xl">flag</span>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total End Selesai</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-bold text-navy">450</h3>
            <span class="text-xs font-semibold text-green-500">+24/jam</span>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl p-5 shadow-card border border-gray-100 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
        <div class="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-2xl">analytics</span>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Rata-rata Skor</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-bold text-navy">8.7</h3>
            <span class="text-xs text-gray-400">per anak panah</span>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl p-5 shadow-card border border-gray-100 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
        <div class="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-2xl">pending_actions</span>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Menunggu Input</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-bold text-navy">5</h3>
            <span class="text-xs font-semibold text-orange-500">Mendesak</span>
          </div>
        </div>
      </div>
      <div
        class="bg-white rounded-xl p-5 shadow-card border border-gray-100 flex items-center gap-4 hover:shadow-card-hover transition-shadow">
        <div class="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-2xl">emoji_events</span>
        </div>
        <div>
          <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Skor Tertinggi</p>
          <div class="flex items-baseline gap-2">
            <h3 class="text-2xl font-bold text-navy">298</h3>
            <span class="text-xs text-gray-400">S. Jenkins</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Scoring Table -->
    <div class="bg-white rounded-xl shadow-card border border-gray-100 flex flex-col overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
        <h3 class="font-bold text-navy">Progress Scoring Real-time</h3>
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span> Live</span>
          <span class="flex items-center gap-1 ml-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span>
            Selesai</span>
          <span class="flex items-center gap-1 ml-2"><span class="w-2 h-2 rounded-full bg-gray-300"></span>
            Menunggu</span>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-bold">
              <th class="px-6 py-3 w-24">Target</th>
              <th class="px-6 py-3">Atlet</th>
              <th class="px-6 py-3">Progress End</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="target in targets" :key="target.id" :class="target.status === 'pending' ? 'bg-orange-50/30' : ''"
              class="group hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div :class="getTargetClass(target.status)"
                  class="flex items-center justify-center h-10 w-10 rounded-lg font-bold text-lg shadow-sm">
                  {{ String(target.id).padStart(2, '0') }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="target.archers.length" class="flex flex-col gap-1">
                  <div v-for="(archer, i) in target.archers" :key="i" class="flex items-center gap-2">
                    <span
                      class="w-5 h-5 rounded bg-gray-100 text-[10px] font-bold flex items-center justify-center text-gray-500">{{
                      ['A', 'B'][i] }}</span>
                    <span class="font-medium text-navy">{{ archer.name }}</span>
                    <span class="text-xs text-gray-400 ml-1">{{ archer.score }}</span>
                  </div>
                </div>
                <span v-else class="text-sm text-gray-400 italic">Tidak ada atlet aktif</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold"
                    :class="target.status === 'finished' ? 'text-blue-600' : 'text-gray-500'">{{ target.progress
                    }}</span>
                  <div class="flex items-center gap-1">
                    <div v-for="(dot, i) in target.dots" :key="i" :class="dot" class="w-2.5 h-2.5 rounded-full"></div>
                    <span v-if="target.status === 'live'" class="text-[10px] text-gray-400 ml-1">...</span>
                    <span v-if="target.status === 'finished'"
                      class="text-[10px] text-blue-500 ml-1 font-bold">Selesai</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span v-if="target.status === 'live'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                  <span class="block w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                  Live
                </span>
                <span v-else-if="target.status === 'pending'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
                  Menunggu
                </span>
                <span v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <span class="material-symbols-outlined text-[14px]">check</span>
                  Selesai
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button v-if="target.status === 'live'"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-navy font-bold text-xs hover:bg-primary-hover transition-colors shadow-sm shadow-primary/30">
                  <span class="material-symbols-outlined text-[16px]">edit_note</span>
                  Input Skor Cepat
                </button>
                <button v-else-if="target.status === 'pending'"
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed">
                  <span class="material-symbols-outlined text-[16px]">lock</span>
                  Terkunci
                </button>
                <button v-else
                  class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-navy font-bold text-xs hover:bg-gray-50 transition-colors shadow-sm">
                  <span class="material-symbols-outlined text-[16px]">visibility</span>
                  Lihat Scorecard
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-sm">
        <span class="text-gray-500">Menampilkan <span class="font-bold text-navy">1-5</span> dari <span
            class="font-bold text-navy">32</span> target</span>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-500 hover:text-navy disabled:opacity-50">Sebelumnya</button>
          <button
            class="px-3 py-1 rounded border border-gray-300 bg-white text-gray-500 hover:text-navy">Berikutnya</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const targets = [
  { id: 1, archers: [{ name: 'Sarah Jenkins', score: 298 }, { name: 'Mike Ross', score: 285 }], progress: 'End 4 dari 20', status: 'live', dots: ['bg-navy', 'bg-navy', 'bg-navy', 'bg-primary border border-primary animate-pulse', 'bg-gray-200', 'bg-gray-200'] },
  { id: 2, archers: [{ name: 'Jessica Pearson', score: 290 }, { name: 'Harvey Specter', score: 292 }], progress: 'End 4 dari 20', status: 'live', dots: ['bg-navy', 'bg-navy', 'bg-navy', 'bg-primary border border-primary animate-pulse', 'bg-gray-200', 'bg-gray-200'] },
  { id: 3, archers: [], progress: 'Menunggu Mulai', status: 'pending', dots: ['bg-gray-200', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'] },
  { id: 4, archers: [{ name: 'Louis Litt', score: 568 }, { name: 'Donna Paulsen', score: 552 }], progress: 'Selesai (20/20)', status: 'finished', dots: ['bg-blue-500', 'bg-blue-500', 'bg-blue-500', 'bg-blue-500', 'bg-blue-500'] },
  { id: 5, archers: [{ name: 'Rachel Zane', score: 275 }, { name: 'Katrina Bennett', score: 268 }], progress: 'End 4 dari 20', status: 'live', dots: ['bg-navy', 'bg-navy', 'bg-navy', 'bg-primary border border-primary animate-pulse', 'bg-gray-200', 'bg-gray-200'] },
]

const getTargetClass = (status) => {
  const classes = {
    'live': 'bg-navy text-primary',
    'pending': 'bg-white border border-orange-200 text-orange-600',
    'finished': 'bg-gray-100 border border-gray-200 text-gray-600'
  }
  return classes[status] || 'bg-white border border-gray-200 text-navy'
}
</script>
