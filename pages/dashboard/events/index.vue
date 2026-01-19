<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Daftar Event</h1>
        <p class="text-text-secondary text-sm font-medium mt-1">Kelola kompetisi dan pantau progres turnamen Anda.</p>
      </div>
      <NuxtLink to="/dashboard/tournaments/create"
        class="h-11 px-5 rounded-lg bg-primary text-navy font-bold hover:bg-primary-hover shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 whitespace-nowrap">
        <span class="material-symbols-outlined text-[20px]">add</span>
        <span>Buat Event Baru</span>
      </NuxtLink>
    </div>

    <!-- Search & Filter Bar -->
    <div
      class="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:max-w-md group">
        <span
          class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">search</span>
        <input v-model="searchQuery"
          class="w-full rounded-lg border border-gray-200 bg-gray-50 h-10 pl-10 pr-4 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-400"
          placeholder="Cari berdasarkan nama event, lokasi..." type="text" />
      </div>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <div class="relative">
          <select v-model="statusFilter"
            class="appearance-none h-10 pl-4 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:border-gray-300 transition-colors">
            <option value="">Semua Status</option>
            <option value="upcoming">Akan Datang</option>
            <option value="ongoing">Berlangsung</option>
            <option value="completed">Selesai</option>
          </select>
          <span
            class="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-[20px]">expand_more</span>
        </div>
        <button
          class="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-navy transition-colors">
          <span class="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
    </div>

    <!-- Events Table -->
    <div class="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Event</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Lokasi</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="event in filteredEvents" :key="event.id" class="group hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div :class="event.iconBg" class="size-10 rounded-lg flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined" :class="event.iconColor">{{ event.icon }}</span>
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-bold text-navy truncate">{{ event.name }}</div>
                    <div class="text-xs text-gray-500">{{ event.category }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-navy font-medium">{{ event.date }}</div>
                <div class="text-xs text-gray-500">{{ event.time }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-navy">{{ event.venue }}</div>
                <div class="text-xs text-gray-500">{{ event.city }}</div>
              </td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(event.status)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border">
                  <span v-if="event.status === 'ongoing'"
                    class="size-1.5 rounded-full bg-primary-hover animate-pulse"></span>
                  <span v-else-if="event.status === 'upcoming'" class="size-1.5 rounded-full bg-blue-500"></span>
                  <span v-else class="size-1.5 rounded-full bg-gray-400"></span>
                  {{ getStatusLabel(event.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <NuxtLink v-if="event.status === 'ongoing'" :to="`/dashboard/tournaments/${event.id}/manage`"
                  class="text-sm font-semibold text-primary-hover hover:text-navy transition-colors px-3 py-1.5 rounded-md hover:bg-primary/10">
                  Kelola
                </NuxtLink>
                <NuxtLink v-else :to="`/dashboard/tournaments/${event.id}`"
                  class="text-sm font-semibold text-gray-500 hover:text-navy transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100">
                  Lihat
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <span class="text-xs text-gray-500 font-medium">Menampilkan <span class="font-bold text-navy">1-5</span> dari
          <span class="font-bold text-navy">{{ events.length }}</span> event</span>
        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            disabled>Sebelumnya</button>
          <button
            class="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 text-xs font-medium hover:bg-gray-50 hover:text-navy transition-colors">Berikutnya</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const searchQuery = ref('')
const statusFilter = ref('')

const events = [
  { id: '1', name: 'National Indoor Championship 2024', category: 'Recurve & Compound', date: '15 - 17 Nov 2024', time: '09:00 WIB', venue: 'GBK Archery Field', city: 'Jakarta, Indonesia', status: 'ongoing', icon: 'emoji_events', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { id: '2', name: 'Winter Series - Tahap 1', category: 'Open Entry', date: '01 Des 2024', time: '08:30 WIB', venue: 'Senayan Archery Center', city: 'Jakarta, Indonesia', status: 'upcoming', icon: 'target', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: '3', name: 'Piala Gubernur Jatim 2024', category: 'Regional Championship', date: '10 Nov 2024', time: '08:00 WIB', venue: 'Lapangan Panahan Surabaya', city: 'Surabaya, Indonesia', status: 'completed', icon: 'trophy', iconBg: 'bg-gray-100', iconColor: 'text-gray-500' },
  { id: '4', name: 'Open Tournament Bandung', category: 'Recurve Only', date: '20 Nov 2024', time: '07:30 WIB', venue: 'Lapangan Panahan Bandung', city: 'Bandung, Indonesia', status: 'upcoming', icon: 'sports_score', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { id: '5', name: 'Riau Open Series #2', category: 'All Categories', date: '25 Nov 2024', time: '09:00 WIB', venue: 'Riau Archery Center', city: 'Pekanbaru, Indonesia', status: 'upcoming', icon: 'adjust', iconBg: 'bg-orange-50', iconColor: 'text-orange-600' },
]

const filteredEvents = computed(() => {
  return events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      event.city.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status) => {
  const classes = {
    'ongoing': 'bg-primary/20 text-navy border-primary/20',
    'upcoming': 'bg-blue-50 text-blue-700 border-blue-100',
    'completed': 'bg-gray-100 text-gray-600 border-gray-200'
  }
  return classes[status] || 'bg-gray-100 text-gray-600 border-gray-200'
}

const getStatusLabel = (status) => {
  const labels = {
    'ongoing': 'Berlangsung',
    'upcoming': 'Akan Datang',
    'completed': 'Selesai'
  }
  return labels[status] || status
}
</script>
