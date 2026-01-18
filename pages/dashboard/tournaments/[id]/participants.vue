<template>
    <div class="space-y-6">
        <div class="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div class="relative w-full md:w-64">
                    <span
                        class="absolute left-3 top-1/2 -translate-y-1/2 text-text-sub/50 material-symbols-outlined">search</span>
                    <input v-model="search"
                        class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                        placeholder="Cari atlet..." type="text">
                </div>
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <button v-for="div in filterDivs" :key="div" @click="activeDiv = div"
                        class="px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors"
                        :class="activeDiv === div ? 'bg-navy text-white shadow-md' : 'bg-gray-50 text-text-sub hover:bg-gray-100'">
                        {{ div }}
                    </button>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-between px-2">
            <p class="text-sm font-medium text-text-sub">Menampilkan <span class="font-bold text-navy">{{
                    filteredAthletes.length }}</span> atlet terdaftar</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="athlete in filteredAthletes" :key="athlete.name"
                class="group bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/50 transition-all flex items-start gap-4">
                <div class="relative flex-shrink-0">
                    <img :src="athlete.image" :alt="athlete.name"
                        class="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm">
                    <div v-if="athlete.verified"
                        class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm">
                        <span class="material-symbols-outlined text-blue-500 text-[14px] font-bold">verified</span>
                    </div>
                </div>
                <div class="flex-grow min-w-0">
                    <div class="flex justify-between items-start mb-1">
                        <h3 class="font-bold text-navy truncate pr-2 group-hover:text-primary transition-colors">{{
                            athlete.name }}</h3>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" :class="athlete.badgeColor">{{
                            athlete.division }}</span>
                    </div>
                    <p class="text-xs text-text-sub/70 mb-2">{{ athlete.category }}</p>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-text-sub truncate font-medium">{{ athlete.club }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-center pt-4">
            <button
                class="px-8 py-3 bg-white hover:bg-gray-50 text-navy font-bold rounded-xl border border-gray-100 transition-colors shadow-sm flex items-center gap-2">
                Muat Lebih Banyak
                <span class="material-symbols-outlined text-sm">expand_more</span>
            </button>
        </div>
    </div>
</template>

<script setup>
const search = ref('')
const activeDiv = ref('Semua')
const filterDivs = ['Semua', 'Recurve', 'Compound', 'Barebow']

const athletes = [
    { name: 'Budi Santoso', division: 'Recurve', category: 'Individu Putra', club: 'Jaya Raya Archery', verified: true, badgeColor: 'bg-blue-50 text-blue-600', image: 'https://i.pravatar.cc/150?u=budi' },
    { name: 'Siti Aminah', division: 'Compound', category: 'Individu Putri', club: 'Perpani DKI', verified: false, badgeColor: 'bg-orange-50 text-orange-600', image: 'https://i.pravatar.cc/150?u=siti' },
    { name: 'Arief Hidayat', division: 'Barebow', category: 'Individu Putra', club: 'Eagle Eye Archery', verified: true, badgeColor: 'bg-purple-50 text-purple-600', image: 'https://i.pravatar.cc/150?u=arief' },
    { name: 'Dinda Pertiwi', division: 'Recurve', category: 'Individu Putri', club: 'Jaya Raya Archery', verified: true, badgeColor: 'bg-blue-50 text-blue-600', image: 'https://i.pravatar.cc/150?u=dinda' },
    { name: 'Reza Pratama', division: 'Compound', category: 'Individu Putra', club: 'Semarang Archery', verified: false, badgeColor: 'bg-orange-50 text-orange-600', image: 'https://i.pravatar.cc/150?u=reza' }
]

const filteredAthletes = computed(() => {
    return athletes.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(search.value.toLowerCase()) || a.club.toLowerCase().includes(search.value.toLowerCase())
        const matchesDiv = activeDiv.value === 'Semua' || a.division === activeDiv.value
        return matchesSearch && matchesDiv
    })
})
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
