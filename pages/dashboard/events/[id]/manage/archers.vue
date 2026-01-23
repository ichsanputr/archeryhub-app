<template>
  <div class="space-y-6">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Atlet Terdaftar</h1>
        <p class="text-text-secondary font-medium mt-1">Kelola pendaftaran, penempatan target, dan check-in event.</p>
      </div>
      <div class="flex gap-3 flex-wrap">
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-gray-200 text-navy hover:bg-gray-50 font-semibold text-sm transition-all shadow-sm hover:shadow">
          <span class="material-symbols-outlined text-[20px]">file_download</span>
          Ekspor
        </button>
        <button
          class="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border-2 border-primary text-navy hover:bg-primary/20 font-bold text-sm transition-all shadow-sm">
          <span class="material-symbols-outlined text-[20px]">qr_code_scanner</span>
          Check-in On-site
        </button>
        <button
          class="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-navy hover:bg-primary-hover font-bold text-sm transition-all shadow-md shadow-primary/20">
          <span class="material-symbols-outlined text-[20px]">person_add</span>
          Daftarkan Atlet Baru
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-card flex flex-col overflow-hidden">
      <!-- Filter Bar -->
      <div class="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <div class="relative w-full sm:w-80">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">filter_list</span>
            <input v-model="searchQuery"
              class="bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm text-navy placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary w-full transition-all"
              placeholder="Filter berdasarkan nama, ID, atau klub..." type="text" />
          </div>
        </div>
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <select v-model="categoryFilter"
            class="bg-white border border-gray-200 text-navy text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 px-3 cursor-pointer outline-none hover:border-gray-300 transition-colors">
            <option value="">Semua Kategori</option>
            <option value="recurve-open">Recurve Open</option>
            <option value="compound">Compound</option>
            <option value="barebow">Barebow</option>
          </select>
          <select v-model="statusFilter"
            class="bg-white border border-gray-200 text-navy text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 px-3 cursor-pointer outline-none hover:border-gray-300 transition-colors">
            <option value="">Status: Semua</option>
            <option value="checked-in">Sudah Check-in</option>
            <option value="pending">Menunggu</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-navy min-w-[700px]">
          <thead
            class="bg-gray-50/75 text-gray-500 font-bold border-b border-gray-100 uppercase text-xs tracking-wider">
            <tr>
              <th class="px-6 py-4 w-24">ID</th>
              <th class="px-6 py-4">Detail Atlet</th>
              <th class="px-6 py-4">Kategori</th>
              <th class="px-6 py-4">Target</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr v-for="archer in filteredArchers" :key="archer.id"
              :class="archer.status === 'pending' ? 'bg-yellow-50/30 hover:bg-yellow-50/50 border-l-4 border-l-transparent hover:border-l-primary/50' : 'hover:bg-gray-50/80'"
              class="transition-colors group">
              <td class="px-6 py-4 font-mono text-gray-500 font-medium">#{{ archer.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div :class="archer.avatarBg"
                    class="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs border"
                    :style="`border-color: ${archer.avatarBorder}`">{{ archer.initials }}</div>
                  <div>
                    <div class="font-bold text-navy">{{ archer.name }}</div>
                    <div class="text-xs text-gray-500">{{ archer.club }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">{{
                    archer.category }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="archer.target"
                  class="font-bold font-mono text-navy bg-white border border-gray-200 px-2.5 py-1 rounded text-xs shadow-sm">{{
                    archer.target }}</span>
                <span v-else class="text-xs text-gray-400 italic">Belum Ditentukan</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="archer.status === 'checked-in'"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-600"></span> Sudah Check-in
                </span>
                <span v-else
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                  <span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Menunggu
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button v-if="archer.status === 'pending'"
                    class="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-navy hover:bg-primary-hover font-bold text-xs transition-all shadow-sm shadow-primary/20 mr-2">
                    <span class="material-symbols-outlined text-[16px]">check_circle</span>
                    Check-in
                  </button>
                  <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      class="text-gray-400 hover:text-navy hover:bg-gray-100 p-2 rounded-lg transition-colors"><span
                        class="material-symbols-outlined text-[20px]">visibility</span></button>
                    <button
                      class="text-gray-400 hover:text-navy hover:bg-gray-100 p-2 rounded-lg transition-colors"><span
                        class="material-symbols-outlined text-[20px]">edit</span></button>
                    <button
                      class="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"><span
                        class="material-symbols-outlined text-[20px]">more_vert</span></button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="p-4 border-t border-gray-200 bg-white flex items-center justify-between">
        <span class="text-xs text-gray-500 font-medium">Menampilkan 1-{{ filteredArchers.length }} dari {{
          archers.length }} atlet</span>
        <div class="flex items-center gap-2">
          <button
            class="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 text-xs font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
            disabled>Sebelumnya</button>
          <div class="flex gap-1">
            <button
              class="w-8 h-8 rounded-lg bg-primary text-navy text-xs font-bold flex items-center justify-center shadow-sm">1</button>
            <button
              class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-medium flex items-center justify-center hover:bg-gray-50 transition-colors">2</button>
            <button
              class="w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-500 text-xs font-medium flex items-center justify-center hover:bg-gray-50 transition-colors">3</button>
            <span class="w-8 h-8 flex items-center justify-center text-gray-400 text-xs">...</span>
          </div>
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
const categoryFilter = ref('')
const statusFilter = ref('')

const archers = [
  { id: '1024', name: 'Sarah Jenkins', club: 'Eagle Eye Archery Club', category: 'Recurve Open', target: '04A', status: 'checked-in', initials: 'SJ', avatarBg: 'bg-indigo-50 text-indigo-600', avatarBorder: '#c7d2fe' },
  { id: '1025', name: 'Mike Ross', club: 'Independent', category: 'Compound', target: '04B', status: 'checked-in', initials: 'MR', avatarBg: 'bg-orange-50 text-orange-600', avatarBorder: '#fed7aa' },
  { id: '1026', name: 'Jessica Wu', club: 'Northside Archers', category: 'Compound', target: null, status: 'pending', initials: 'JW', avatarBg: 'bg-purple-50 text-purple-600', avatarBorder: '#e9d5ff' },
  { id: '1027', name: 'David Chen', club: 'University Archery', category: 'Recurve Open', target: '05A', status: 'checked-in', initials: 'DC', avatarBg: 'bg-emerald-50 text-emerald-600', avatarBorder: '#a7f3d0' },
  { id: '1028', name: 'Arif Dwi Pangestu', club: 'DKI Jakarta Archery', category: 'Recurve Open', target: '06A', status: 'checked-in', initials: 'AD', avatarBg: 'bg-blue-50 text-blue-600', avatarBorder: '#bfdbfe' },
  { id: '1029', name: 'Diananda Choirunisa', club: 'Jatim Archery', category: 'Recurve Open', target: '06B', status: 'pending', initials: 'DC', avatarBg: 'bg-pink-50 text-pink-600', avatarBorder: '#fbcfe8' },
]

const filteredArchers = computed(() => {
  return archers.filter(archer => {
    const matchesSearch = archer.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      archer.id.includes(searchQuery.value) ||
      archer.club.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || archer.category.toLowerCase().includes(categoryFilter.value.replace('-', ' '))
    const matchesStatus = !statusFilter.value || archer.status === statusFilter.value
    return matchesSearch && matchesCategory && matchesStatus
  })
})
</script>
