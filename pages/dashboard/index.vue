<template>
  <div class="max-w-7xl mx-auto space-y-8">
    <!-- Welcome Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 class="text-3xl lg:text-4xl font-black text-navy tracking-tight">Ringkasan Aktivitas</h1>
        <p class="text-text-secondary mt-1 font-medium">Selamat datang kembali, Alex! Pantau performa turnamen Anda hari
          ini.</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/dashboard/tournaments/create"
          class="flex items-center gap-2 px-6 py-3 bg-primary text-navy font-black rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all border border-primary/20">
          <span class="material-symbols-outlined font-black">add_circle</span>
          Buat Turnamen Baru
        </NuxtLink>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in dashboardStats" :key="stat.label"
        class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div :class="stat.bgClass" class="w-12 h-12 rounded-xl flex items-center justify-center">
            <span class="material-symbols-outlined text-2xl" :class="stat.iconColor">{{ stat.icon }}</span>
          </div>
          <span v-if="stat.trend" :class="stat.trendColor"
            class="text-[10px] font-black px-2 py-1 rounded bg-gray-50 border border-gray-100 uppercase tracking-widest">
            {{ stat.trend }}
          </span>
        </div>
        <div>
          <p class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{{ stat.label }}</p>
          <h3 class="text-3xl font-black text-navy mt-1 tabular-nums">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Active Tournaments -->
      <div
        class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[400px]">
        <div class="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 class="font-black text-navy text-lg uppercase tracking-tight">Turnamen Berjalan</h3>
          <div class="flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span class="text-[10px] font-black text-primary uppercase tracking-widest">Live Updates</span>
          </div>
        </div>
        <div class="divide-y divide-gray-50">
          <div v-for="event in activeEvents" :key="event.id"
            class="p-6 hover:bg-gray-50/50 transition-all cursor-pointer group"
            @click="navigateTo(`/dashboard/tournaments/${event.id}/manage`)">
            <div class="flex items-center gap-6">
              <div
                class="w-14 h-14 bg-navy rounded-xl flex flex-col items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-navy transition-colors">
                <span class="text-xs font-black uppercase tracking-tighter">{{ event.code }}</span>
              </div>
              <div class="flex-grow min-w-0">
                <h4 class="text-lg font-black text-navy group-hover:text-primary transition-colors truncate">{{
                  event.name }}</h4>
                <div class="flex items-center gap-4 mt-1">
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">groups</span>
                    {{ event.participants }} Atlet
                  </span>
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">location_on</span>
                    {{ event.location }}
                  </span>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-4">
                <div class="hidden sm:flex flex-col items-end">
                  <span class="text-[10px] font-black text-gray-300 uppercase tracking-widest">Progress</span>
                  <span class="text-sm font-black text-navy">{{ event.progress }}%</span>
                </div>
                <span
                  class="material-symbols-outlined text-gray-200 group-hover:text-primary transition-colors">chevron_right</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-auto p-4 border-t border-gray-50 text-center">
          <NuxtLink to="/dashboard/tournaments"
            class="text-xs font-black text-navy hover:underline uppercase tracking-widest">
            Lihat Semua Turnamen Saya</NuxtLink>
        </div>
      </div>

      <!-- Notifications / Activity -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
        <div class="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 class="font-black text-navy text-lg uppercase tracking-tight">Notifikasi Baru</h3>
          <span class="px-2 py-0.5 rounded bg-primary text-navy text-[10px] font-black">4</span>
        </div>
        <div class="flex-grow p-4 space-y-4 overflow-y-auto no-scrollbar">
          <div v-for="notif in notifications" :key="notif.id"
            class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
            <div :class="notif.iconBg" class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-xl" :class="notif.iconColor">{{ notif.icon }}</span>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-navy leading-tight">{{ notif.title }}</p>
              <p class="text-[10px] text-gray-400 font-bold mt-1 uppercase">{{ notif.time }}</p>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-gray-50 text-center">
          <button class="text-xs font-black text-navy hover:underline uppercase tracking-widest">Tandai Sudah
            Dibaca</button>
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
  { label: 'Turnamen Aktif', value: '12', icon: 'emoji_events', trend: '+2', trendColor: 'text-green-500', bgClass: 'bg-primary/10', iconColor: 'text-primary' },
  { label: 'Total Peserta', value: '1,240', icon: 'groups', trend: '+15%', trendColor: 'text-green-500', bgClass: 'bg-blue-50', iconColor: 'text-blue-600' },
  { label: 'Revenue (IDR)', value: '45.2M', icon: 'payments', trend: '+12%', trendColor: 'text-green-500', bgClass: 'bg-orange-50', iconColor: 'text-orange-600' },
  { label: 'Tiket Support', value: '4', icon: 'support_agent', trend: 'Unresolved', trendColor: 'text-red-500', bgClass: 'bg-red-50', iconColor: 'text-red-500' },
]

const activeEvents = [
  { id: '1', code: 'IO-24', name: 'Indonesian Open Championship 2024', participants: 450, location: 'GBK Jakarta', progress: 75 },
  { id: '2', code: 'ST-24', name: 'Seleksi Nasional Tahap 1', participants: 120, location: 'Sentul Archery', progress: 100 },
  { id: '3', code: 'RY-24', name: 'Riau Open Series #2', participants: 280, location: 'Pekanbaru', progress: 20 },
]

const notifications = [
  { id: 1, title: 'Pendaftaran baru: Budi Santoso (Recurve Men)', time: '2 MENIT LALU', icon: 'person_add', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
  { id: 2, title: 'Pembayaran terverifikasi: Rp 350.000', time: '15 MENIT LALU', icon: 'check_circle', iconBg: 'bg-green-50', iconColor: 'text-green-500' },
  { id: 3, title: 'Target #12 bermasalah di scoring app', time: '1 JAM LALU', icon: 'warning', iconBg: 'bg-red-50', iconColor: 'text-red-500' },
  { id: 4, title: 'Laporan harian Day 1 siap diunduh', time: '3 JAM LALU', icon: 'description', iconBg: 'bg-gray-50', iconColor: 'text-gray-400' },
]
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.text-navy {
  color: #0f172a;
}

.text-text-secondary {
  color: #6b7280;
}
</style>
