<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-6">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Ringkasan</h1>
        <span
          class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 flex items-center gap-1.5 shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          LIVE
        </span>
      </div>
      <p class="text-text-secondary font-medium text-sm">Ronde Kualifikasi 2 sedang berlangsung</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-white rounded-xl p-4 md:p-5 flex flex-col justify-between min-h-[120px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
        <div class="flex justify-between items-start gap-2">
          <div class="min-w-0">
            <p class="text-text-secondary text-[10px] md:text-xs font-bold uppercase tracking-wider mb-1 truncate">{{
              stat.label }}</p>
            <p class="text-navy text-2xl md:text-3xl font-black tracking-tight tabular-nums">{{ stat.value }}</p>
          </div>
          <div
            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy transition-colors shrink-0">
            <span class="material-symbols-outlined text-xl md:text-2xl">{{ stat.icon }}</span>
          </div>
        </div>
        <div class="mt-auto pt-2">
          <p :class="stat.trendColor" class="text-[10px] font-bold flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">{{ stat.trendIcon }}</span>
            {{ stat.trend }}
          </p>
        </div>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Target Status (main content) -->
      <div
        class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 class="text-navy font-bold text-base md:text-lg flex items-center gap-2">
            Status Target
          </h3>
          <div class="flex gap-3 text-xs font-semibold">
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-emerald-500"></span> Shooting
            </div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-primary"></span> Scoring</div>
            <div class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-red-500"></span> Masalah</div>
          </div>
        </div>
        <div class="p-6 flex-1 bg-gray-50/30">
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
        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 class="text-navy font-bold text-base md:text-lg">Papan Peringkat</h3>
          <NuxtLink to="#" class="text-xs text-text-secondary hover:text-navy font-semibold transition-colors">Lihat
            Semua</NuxtLink>
        </div>
        <div class="flex-1 overflow-y-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Rk</th>
                <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Atlet</th>
                <th class="px-6 py-3 text-right font-medium text-xs uppercase tracking-wider">Skor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="(archer, index) in leaderboard" :key="archer.id"
                class="hover:bg-gray-50 transition-colors group">
                <td class="px-6 py-3.5">
                  <div :class="index === 0 ? 'bg-primary text-navy shadow-sm' : ''"
                    class="font-extrabold w-6 h-6 rounded flex items-center justify-center text-xs">{{ index + 1 }}
                  </div>
                </td>
                <td class="px-6 py-3.5">
                  <div class="text-navy font-bold group-hover:text-primary-hover transition-colors">{{ archer.name }}
                  </div>
                  <div class="text-gray-400 text-xs">{{ archer.category }}</div>
                </td>
                <td class="px-6 py-3.5 text-right font-mono text-navy font-bold text-base">{{ archer.score }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Bottom Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Live Alerts -->
      <div class="bg-white rounded-xl border border-gray-200 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 class="text-navy font-bold text-base md:text-lg flex items-center gap-2">
            Notifikasi Live
          </h3>
          <span
            class="bg-red-50 text-red-600 border border-red-100 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">2
            Baru</span>
        </div>
        <div class="p-6 flex flex-col gap-4">
          <div class="flex items-start gap-4 p-4 rounded-xl bg-red-50/50 border border-red-100">
            <div class="p-2 bg-white rounded-lg border border-red-100 shadow-sm text-red-500">
              <span class="material-symbols-outlined mt-0.5">warning</span>
            </div>
            <div class="flex-1">
              <p class="text-navy text-sm font-bold">Kerusakan Target 04</p>
              <p class="text-text-secondary text-xs mt-1">Sistem tidak membaca tembakan. Teknisi sedang dikirim.</p>
            </div>
            <button
              class="px-3 py-1.5 bg-white border border-gray-200 hover:border-red-200 hover:text-red-600 text-text-secondary text-xs font-semibold rounded-lg shadow-sm transition-colors">Abaikan</button>
          </div>
          <div class="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div class="p-2 bg-white rounded-lg border border-gray-200 shadow-sm text-navy">
              <span class="material-symbols-outlined mt-0.5">gavel</span>
            </div>
            <div class="flex-1">
              <p class="text-navy text-sm font-bold">Permintaan Review Skor</p>
              <p class="text-text-secondary text-xs mt-1">Atlet #23 membantah Anak Panah 3 pada End 4.</p>
            </div>
            <button
              class="px-3 py-1.5 bg-navy hover:bg-navy-light text-white text-xs font-medium rounded-lg shadow-sm transition-colors">Review</button>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h3 class="text-navy font-bold mb-4 flex items-center gap-2 text-base md:text-lg">
          Aksi Cepat
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button v-for="action in quickActions" :key="action.label"
            class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-text-main transition-all group duration-300">
            <span class="material-symbols-outlined mb-2 text-gray-400 group-hover:text-primary transition-colors">{{
              action.icon }}</span>
            <span class="text-xs font-bold group-hover:text-navy">{{ action.label }}</span>
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
  { label: 'Total Atlet', value: '124', icon: 'group', trend: '+12 check-in hari ini', trendIcon: 'trending_up', trendColor: 'text-green-600' },
  { label: 'Target Aktif', value: '32/35', icon: 'adjust', trend: 'Semua target online', trendIcon: 'check_circle', trendColor: 'text-text-secondary' },
  { label: 'Penyelesaian', value: '85%', icon: 'assignment_turned_in', trend: '', trendIcon: '', trendColor: '' },
  { label: 'Sisa Waktu', value: '45:20', icon: 'timer', trend: 'Est. Selesai: 14:30', trendIcon: 'schedule', trendColor: 'text-text-secondary' },
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
  { label: 'Cetak Scorecard', icon: 'print' },
  { label: 'Sync Leaderboard', icon: 'published_with_changes' },
  { label: 'Edit Penempatan', icon: 'edit_note' },
  { label: 'Pengumuman', icon: 'mic' },
  { label: 'Generate QR', icon: 'qr_code' },
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
