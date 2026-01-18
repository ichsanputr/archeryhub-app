<template>
    <div class="space-y-8">
        <!-- Header with Tabs -->
        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-black text-navy tracking-tight uppercase italic">Manajemen Atlet</h1>
                    <p class="text-text-sub font-medium mt-1">Kelola pendaftaran, verifikasi data, dan penempatan lajur
                        atlet.</p>
                </div>
                <div class="flex gap-3">
                    <button
                        class="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-navy font-black text-sm hover:bg-gray-50 transition-all shadow-sm">
                        <span class="material-symbols-outlined text-[20px]">download</span>
                        Export CSV
                    </button>
                    <button
                        class="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-navy font-black text-sm hover:bg-primary-hover transition-all shadow-lg border border-primary/20">
                        <span class="material-symbols-outlined text-[20px]">person_add</span>
                        Tambah Atlet
                    </button>
                </div>
            </div>

            <!-- Dashboard Sub-Tabs -->
            <div class="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
                <button v-for="tab in tabs" :key="tab" @click="activeTab = tab"
                    class="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    :class="activeTab === tab ? 'bg-white text-navy shadow-sm' : 'text-gray-400 hover:text-navy'">
                    {{ tab }}
                </button>
            </div>
        </div>

        <!-- Filters & Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div
                class="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/30">
                <div class="flex flex-wrap gap-3 w-full md:w-auto">
                    <div class="relative group grow sm:grow-0">
                        <span
                            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[18px] group-focus-within:text-primary transition-colors">search</span>
                        <input v-model="searchQuery" type="text" placeholder="Cari nama atau klub..."
                            class="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-navy font-bold placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-64 transition-all outline-none">
                    </div>
                    <select
                        class="bg-white border border-gray-200 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-navy outline-none focus:ring-2 focus:ring-primary">
                        <option>Semua Divisi</option>
                        <option>Recurve Men</option>
                        <option>Compound Women</option>
                    </select>
                </div>
                <div class="flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar py-1">
                    <div class="flex items-center gap-1.5 shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span class="text-[8px] font-black uppercase text-gray-400 tracking-widest">Terverifikasi
                            (82)</span>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                        <span class="text-[8px] font-black uppercase text-gray-400 tracking-widest">Pending (14)</span>
                    </div>
                    <div class="flex items-center gap-1.5 shrink-0">
                        <span class="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                        <span class="text-[8px] font-black uppercase text-gray-400 tracking-widest">Ditolak (2)</span>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto no-scrollbar">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead
                        class="bg-white text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-50">
                        <tr>
                            <th class="px-6 py-4 w-12">
                                <input type="checkbox" class="rounded border-gray-200 text-primary focus:ring-primary">
                            </th>
                            <th class="px-6 py-4">Atlet / Klub</th>
                            <th class="px-6 py-4">Divisi & Kategori</th>
                            <th class="px-6 py-4 text-center">No. Target</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="archer in filteredArchers" :key="archer.id"
                            class="hover:bg-gray-50/50 transition-colors group">
                            <td class="px-6 py-4">
                                <input type="checkbox" class="rounded border-gray-200 text-primary focus:ring-primary">
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 p-0.5 overflow-hidden shrink-0">
                                        <img :src="archer.image" class="w-full h-full object-cover rounded-lg">
                                    </div>
                                    <div>
                                        <div
                                            class="text-sm font-black text-navy group-hover:text-primary transition-colors">
                                            {{ archer.name }}</div>
                                        <div class="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{{
                                            archer.club }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="inline-flex flex-col">
                                    <span class="text-xs font-black text-navy">{{ archer.division }}</span>
                                    <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{{
                                        archer.category }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span
                                    class="px-2.5 py-1 rounded-lg bg-navy/5 text-navy font-black text-xs border border-navy/10">{{
                                        archer.target }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="getStatusClass(archer.status)"
                                    class="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border">
                                    {{ archer.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex justify-end gap-2">
                                    <button
                                        class="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-navy transition-all">
                                        <span class="material-symbols-outlined text-[18px]">visibility</span>
                                    </button>
                                    <button
                                        class="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-navy transition-all">
                                        <span class="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                class="p-4 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Menampilkan 1-10
                    dari 124 atlet</span>
                <div class="flex gap-1">
                    <button v-for="p in 3" :key="p"
                        class="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all"
                        :class="p === 1 ? 'bg-navy text-primary' : 'text-gray-400 hover:bg-gray-100'">
                        {{ p }}
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

const activeTab = ref('Daftar Atlet')
const tabs = ['Daftar Atlet', 'Verifikasi', 'Pembayaran', 'Distribusi Target']
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
        'verified': 'bg-green-50 text-green-700 border-green-200',
        'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
        'rejected': 'bg-red-50 text-red-700 border-red-200'
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
