<template>
  <div class="space-y-10">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-6">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight uppercase">My Tournaments</h1>
        <p class="text-text-secondary mt-1 font-medium text-sm">Manage your competitions and monitor registration
          progress.</p>
      </div>
      <NuxtLink to="/dashboard/tournaments/create"
        class="flex items-center gap-2 px-5 py-2.5 bg-navy text-white hover:bg-navy-light font-bold text-sm rounded-xl transition-all shadow-md">
        <span class="material-symbols-outlined text-[20px]">add</span>
        Create New Event
      </NuxtLink>
    </div>

    <!-- Filters Bar -->
    <div
      class="bg-white rounded-xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex flex-1 min-w-[300px] gap-3">
        <div class="relative flex-1 group">
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors text-[20px]">search</span>
          <input type="text" placeholder="Search by name or location..."
            class="w-full bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-2.5 text-sm text-navy placeholder:text-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium">
        </div>
        <button
          class="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-navy hover:bg-white transition-all transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">tune</span>
          <span class="text-xs font-black uppercase tracking-widest">Filters</span>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Sort by:</span>
        <select
          class="bg-transparent border-b-2 border-gray-100 text-xs font-black text-navy py-1 outline-none focus:border-primary cursor-pointer transition-colors px-1">
          <option>Newest First</option>
          <option>Oldest First</option>
          <option>A-Z</option>
        </select>
      </div>
    </div>

    <!-- Table Container -->
    <div
      class="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
      <div class="overflow-x-auto no-scrollbar">
        <table class="w-full text-left">
          <thead
            class="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
            <tr>
              <th class="px-8 py-4">Tournament Information</th>
              <th class="px-8 py-4">Date & Time</th>
              <th class="px-8 py-4">Participants</th>
              <th class="px-8 py-4">Status</th>
              <th class="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="event in tournaments" :key="event.id"
              class="group hover:bg-gray-50 transition-all cursor-pointer"
              @click="navigateTo(`/dashboard/tournaments/${event.id}/manage`)">
              <td class="px-8 py-5">
                <div class="flex items-center gap-4">
                  <div
                    class="size-11 rounded-xl bg-navy/5 flex items-center justify-center text-navy group-hover:bg-primary group-hover:text-navy transition-colors shrink-0">
                    <span class="material-symbols-outlined">{{ event.icon }}</span>
                  </div>
                  <div>
                    <div class="text-sm font-bold text-navy group-hover:text-primary-hover transition-colors">{{
                      event.name }}</div>
                    <div
                      class="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1 mt-0.5">
                      <span class="material-symbols-outlined text-[12px]">location_on</span>
                      {{ event.venue }}, {{ event.city }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-5">
                <div class="text-xs font-bold text-navy">{{ event.date }}</div>
                <div class="text-[9px] text-gray-400 font-bold uppercase mt-0.5">{{ event.time }}</div>
              </td>
              <td class="px-8 py-5">
                <div class="flex items-center gap-2">
                  <div class="flex -space-x-2">
                    <img v-for="i in 3" :key="i" :src="`https://i.pravatar.cc/100?u=${event.id}${i}`"
                      class="size-6 rounded-full border-2 border-white bg-gray-100 shrink-0">
                  </div>
                  <span class="text-[10px] font-black text-gray-400">+{{ Math.floor(Math.random() * 200) }}</span>
                </div>
              </td>
              <td class="px-8 py-5">
                <span :class="getStatusClass(event.status)"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                  <span v-if="event.status === 'Ongoing'" class="size-1.5 rounded-full bg-primary animate-pulse"></span>
                  {{ event.status }}
                </span>
              </td>
              <td class="px-8 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink :to="`/dashboard/tournaments/${event.id}/manage`"
                    class="text-[10px] font-black uppercase tracking-widest text-navy bg-primary/10 hover:bg-primary px-4 py-2 rounded-lg transition-all">
                    Manage
                  </NuxtLink>
                  <button class="p-2 text-gray-300 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="px-8 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Showing <span
            class="text-navy">1-4</span> of <span class="text-navy">12</span> events</p>
        <div class="flex gap-1.5">
          <button
            class="size-8 rounded-lg border border-gray-100 bg-white text-gray-400 hover:text-navy hover:shadow-sm flex items-center justify-center transition-all disabled:opacity-30"
            disabled>
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button
            class="size-8 rounded-lg border border-primary bg-primary text-navy flex items-center justify-center font-black text-xs shadow-md shadow-primary/20">1</button>
          <button
            class="size-8 rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-navy flex items-center justify-center transition-all font-bold text-xs">2</button>
          <button
            class="size-8 rounded-lg border border-transparent hover:border-gray-200 text-gray-400 hover:text-navy flex items-center justify-center transition-all font-bold text-xs">3</button>
          <button
            class="size-8 rounded-lg border border-gray-100 bg-white text-gray-400 hover:text-navy hover:shadow-sm flex items-center justify-center transition-all">
            <span class="material-symbols-outlined text-[18px]">chevron_right</span>
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
