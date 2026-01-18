<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight uppercase italic">Daftar Turnamen</h1>
        <p class="text-text-sub font-medium mt-1">Kelola kompetisi Anda dan pantau kemajuan pendaftarannya.</p>
      </div>
      <NuxtLink to="/tournaments/create"
        class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-navy font-black text-sm hover:bg-primary-hover transition-all shadow-lg border border-primary/20 whitespace-nowrap">
        <span class="material-symbols-outlined text-[20px]">add</span>
        Buat Turnamen Baru
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div
      class="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
      <div class="relative w-full md:max-w-md group">
        <span
          class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">search</span>
        <input type="text" placeholder="Cari berdasarkan nama atau lokasi..."
          class="w-full rounded-xl border border-gray-100 bg-gray-50 h-11 pl-11 pr-4 text-xs font-bold text-navy focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder:text-gray-300">
      </div>
      <div class="flex items-center gap-3 w-full md:w-auto">
        <select
          class="appearance-none h-11 px-6 pr-10 rounded-xl border border-gray-100 bg-gray-50 text-xs font-black uppercase tracking-widest text-navy outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:bg-white transition-all">
          <option>Semua Status</option>
          <option>Mendatang</option>
          <option>Berlangsung</option>
          <option>Selesai</option>
        </select>
        <button
          class="h-11 w-11 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 hover:text-navy hover:bg-gray-50 transition-all">
          <span class="material-symbols-outlined text-[20px]">tune</span>
        </button>
      </div>
    </div>

    <!-- Tournament Table -->
    <div class="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm flex flex-col">
      <div class="overflow-x-auto no-scrollbar">
        <table class="w-full text-left whitespace-nowrap">
          <thead
            class="bg-gray-50/50 text-gray-400 font-black uppercase text-[10px] tracking-widest border-b border-gray-50">
            <tr>
              <th class="px-8 py-5">Informasi Turnamen</th>
              <th class="px-8 py-5">Jadwal</th>
              <th class="px-8 py-5">Lokasi</th>
              <th class="px-8 py-5">Status</th>
              <th class="px-8 py-5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="event in tournaments" :key="event.id" class="group hover:bg-gray-50/30 transition-colors">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div
                    class="size-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy shrink-0 border border-navy/5">
                    <span class="material-symbols-outlined text-2xl" :class="event.iconClass">{{ event.icon }}</span>
                  </div>
                  <div>
                    <div
                      class="text-sm font-black text-navy group-hover:text-primary transition-colors uppercase italic">
                      {{ event.name }}</div>
                    <div class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{ event.type }}</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="text-xs font-black text-navy">{{ event.date }}</div>
                <div class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ event.time }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="text-xs font-bold text-navy">{{ event.venue }}</div>
                <div class="text-[10px] font-bold text-gray-400">{{ event.city }}</div>
              </td>
              <td class="px-8 py-6">
                <span :class="getStatusClass(event.status)"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border">
                  <span v-if="event.status === 'Ongoing'" class="size-1.5 rounded-full bg-primary animate-pulse"></span>
                  {{ event.status }}
                </span>
              </td>
              <td class="px-8 py-6 text-right">
                <NuxtLink :to="`/tournaments/${event.id}/manage`"
                  class="text-[10px] font-black uppercase tracking-widest text-navy bg-primary/10 hover:bg-primary px-4 py-2 rounded-xl transition-all">
                  Kelola
                </NuxtLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="bg-gray-50/30 px-8 py-5 border-t border-gray-50 flex items-center justify-between">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menampilkan <span
            class="text-navy">1-4</span> dari <span class="text-navy">12</span> turnamen</p>
        <div class="flex gap-1">
          <button
            class="w-8 h-8 rounded-lg border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-white transition-all"><span
              class="material-symbols-outlined text-[18px]">chevron_left</span></button>
          <button
            class="w-8 h-8 rounded-lg border border-gray-100 text-navy bg-white shadow-sm flex items-center justify-center font-black text-[10px]">1</button>
          <button
            class="w-8 h-8 rounded-lg border border-gray-100 text-gray-400 flex items-center justify-center hover:bg-white transition-all"><span
              class="material-symbols-outlined text-[18px]">chevron_right</span></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'dashboard'
})

const tournaments = [
  { id: 1, name: 'National Indoor 2024', type: 'Recurve & Compound', date: '15 - 17 Nov 2024', time: '08:00 WIB', venue: 'Istora Senayan', city: 'Jakarta, ID', status: 'Ongoing', icon: 'emoji_events', iconClass: 'text-orange-500' },
  { id: 2, name: 'Winter Series - Stage 1', type: 'Open Entry', date: '01 Des 2024', time: '09:00 WIB', venue: 'Bumi Perkemahan', city: 'Cibubur, ID', status: 'Upcoming', icon: 'ads_click', iconClass: 'text-blue-500' },
  { id: 3, name: 'Summer Youth Cup', type: 'Juniors Only', date: '10 - 12 Agt 2024', time: '08:00 WIB', venue: 'Lapangan Archery', city: 'Bandung, ID', status: 'Completed', icon: 'trophy', iconClass: 'text-gray-400' },
  { id: 4, name: 'Regional Club League', type: 'Weekly Series', date: '15 Jan 2025', time: '16:00 WIB', venue: 'GOR Pajajaran', city: 'Bogor, ID', status: 'Upcoming', icon: 'groups', iconClass: 'text-green-500' },
]

const getStatusClass = (status) => {
  const classes = {
    'Ongoing': 'bg-primary/10 text-navy border-primary/20',
    'Upcoming': 'bg-blue-50 text-blue-700 border-blue-100',
    'Completed': 'bg-gray-50 text-gray-400 border-gray-100'
  }
  return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}
</script>

<style scoped>
.text-navy {
  color: #0f172a;
}

.text-text-sub {
  color: #4b5563;
}

.bg-navy {
  background-color: #0f172a;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
