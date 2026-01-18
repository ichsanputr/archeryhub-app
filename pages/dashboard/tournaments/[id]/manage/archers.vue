<template>
  <div class="space-y-10">
    <!-- Header -->
    <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
      <div>
        <h1 class="text-3xl font-black text-navy tracking-tight uppercase">Archer Management</h1>
        <p class="text-text-secondary mt-1 font-medium text-sm">Manage entries, verify registration data, and assign
          targets.</p>
      </div>
      <div class="flex gap-3">
        <button
          class="px-5 py-2.5 bg-white border border-gray-200 text-gray-400 hover:text-navy font-bold text-sm rounded-xl transition-all flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">download</span>
          Export Data
        </button>
        <button
          class="px-5 py-2.5 bg-navy text-white hover:bg-navy-light font-bold text-sm rounded-xl transition-all shadow-lg flex items-center gap-2">
          <span class="material-symbols-outlined text-[18px]">person_add</span>
          Add Archer
        </button>
      </div>
    </div>

    <!-- Navigation & Stats -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="flex p-1 bg-gray-100/50 rounded-xl w-fit">
        <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
          class="px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          :class="activeTab === tab ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-navy'">
          {{ tab }}
        </button>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-emerald-500"></div>
          <span class="text-[10px] font-black text-navy uppercase tracking-widest">Verified <span
              class="text-gray-400 ml-1">82</span></span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-amber-500"></div>
          <span class="text-[10px] font-black text-navy uppercase tracking-widest">Pending <span
              class="text-gray-400 ml-1">14</span></span>
        </div>
        <div class="flex items-center gap-2">
          <div class="size-2 rounded-full bg-rose-500"></div>
          <span class="text-[10px] font-black text-navy uppercase tracking-widest">Rejected <span
              class="text-gray-400 ml-1">2</span></span>
        </div>
      </div>
    </div>

    <!-- Table Container -->
    <div
      class="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden flex flex-col">
      <!-- Table Header/Filters -->
      <div class="p-6 border-b border-gray-50 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex flex-1 min-w-[300px] gap-3">
          <div class="relative flex-1 group">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-navy transition-colors text-[20px]">search</span>
            <input v-model="searchQuery" type="text" placeholder="Search by name, club or city..."
              class="w-full bg-gray-50 border border-gray-100 rounded-lg pl-10 pr-4 py-2.5 text-sm text-navy placeholder:text-gray-300 focus:ring-4 focus:ring-primary/20 transition-all font-medium outline-none">
          </div>
          <button
            class="px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-navy transition-all flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px]">tune</span>
            <span class="text-xs font-black uppercase tracking-widest">Manage Views</span>
          </button>
        </div>
      </div>

      <!-- Table Body -->
      <div class="overflow-x-auto no-scrollbar">
        <table class="w-full text-left">
          <thead
            class="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-100">
            <tr>
              <th class="px-8 py-4 w-12">
                <input type="checkbox" class="size-4 rounded border-gray-300 text-navy focus:ring-navy">
              </th>
              <th class="px-8 py-4">Archer / Club</th>
              <th class="px-8 py-4">Category</th>
              <th class="px-8 py-4 text-center">Target</th>
              <th class="px-8 py-4">Status</th>
              <th class="px-8 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-for="archer in filteredArchers" :key="archer.id" class="group hover:bg-gray-50 transition-all">
              <td class="px-8 py-4">
                <input type="checkbox" class="size-4 rounded border-gray-300 text-navy focus:ring-navy">
              </td>
              <td class="px-8 py-4">
                <div class="flex items-center gap-4">
                  <div class="size-11 rounded-xl bg-gray-50 border border-gray-100 p-0.5 overflow-hidden shrink-0">
                    <img :src="archer.image"
                      class="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform">
                  </div>
                  <div>
                    <div class="text-sm font-bold text-navy group-hover:text-primary-hover transition-colors">{{
                      archer.name }}</div>
                    <div class="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">{{ archer.club }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-4">
                <div class="text-xs font-bold text-navy">{{ archer.division }}</div>
                <div class="text-[9px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">{{ archer.category }}
                </div>
              </td>
              <td class="px-8 py-4 text-center">
                <span
                  class="inline-flex size-9 items-center justify-center rounded-xl bg-navy/5 text-navy font-black text-sm border border-navy/10 group-hover:bg-navy group-hover:text-primary transition-all">
                  {{ archer.target }}
                </span>
              </td>
              <td class="px-8 py-4">
                <span :class="getStatusClass(archer.status)"
                  class="inline-flex items-center px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border">
                  {{ archer.status }}
                </span>
              </td>
              <td class="px-8 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                  <button class="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                    <span class="material-symbols-outlined text-[18px]">delete</span>
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
            class="text-navy">1-10</span> of <span class="text-navy">124</span> archers</p>
        <div class="flex gap-1.5">
          <button
            class="size-8 rounded-lg border border-gray-100 bg-white text-gray-400 hover:text-navy hover:shadow-sm flex items-center justify-center transition-all disabled:opacity-30"
            disabled>
            <span class="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <button v-for="p in 3" :key="p"
            class="size-8 rounded-lg flex items-center justify-center font-black text-xs transition-all"
            :class="p === 1 ? 'bg-primary text-navy shadow-md shadow-primary/20 border border-primary' : 'bg-white border border-gray-100 text-gray-400 hover:text-navy'">
            {{ p }}
          </button>
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

const activeTab = ref('Archer List')
const tabs = ['Archer List', 'Verifications', 'Payments', 'Target Assignments']
const searchQuery = ref('')

const archers = [
  { id: 1, name: 'Arif Dwi Pangestu', club: 'DKI Jakarta Archery', division: 'Recurve Men', category: '70m Public', target: '12A', status: 'verified', image: 'https://i.pravatar.cc/150?u=arif' },
  { id: 2, name: 'Diananda Choirunisa', club: 'Jatim Archeryhub.id', division: 'Recurve Women', category: '70m Public', target: '14B', status: 'verified', image: 'https://i.pravatar.cc/150?u=diana' },
  { id: 3, name: 'Riau Ega Agatha', club: 'Puslatnas Indonesia', division: 'Recurve Men', category: '70m Public', target: '12C', status: 'pending', image: 'https://i.pravatar.cc/150?u=ega' },
  { id: 4, name: 'Alviyanto Bagas', club: 'Solo Archery Club', division: 'Recurve Men', category: '70m Public', target: '11B', status: 'verified', image: 'https://i.pravatar.cc/150?u=bagas' },
  { id: 5, name: 'Rezza Octavia', club: 'Papua Shooting Park', division: 'Recurve Women', category: '70m Pro', target: '16A', status: 'rejected', image: 'https://i.pravatar.cc/150?u=rezza' },
]

const filteredArchers = computed(() => {
  return archers.filter(a => a.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || a.club.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const getStatusClass = (status) => {
  const classes = {
    'verified': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'pending': 'bg-amber-50 text-amber-700 border-amber-200',
    'rejected': 'bg-rose-50 text-rose-700 border-rose-200'
  }
  return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}
</script>
