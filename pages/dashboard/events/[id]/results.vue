<template>
    <div class="space-y-8">
        <!-- Live Dashboard Header -->
        <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div class="flex items-center gap-3">
                <span class="flex h-3 w-3 relative">
                    <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
                <h2 class="text-xl font-bold text-navy font-display">Live Dashboard</h2>
            </div>
            <div class="flex gap-3 w-full md:w-auto">
                <select v-model="selectedDivision"
                    class="bg-gray-50 border-gray-100 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 font-bold text-navy outline-none">
                    <option v-for="div in divisions" :key="div">{{ div }}</option>
                </select>
                <select v-model="selectedRound"
                    class="bg-gray-50 border-gray-100 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 font-bold text-navy outline-none">
                    <option v-for="round in rounds" :key="round">{{ round }}</option>
                </select>
            </div>
        </div>

        <!-- Elimination Match Card -->
        <div class="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
            <div class="bg-navy px-6 py-3 flex justify-between items-center text-white">
                <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-primary"></span>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-primary">1/4 Elimination • Target
                        2</span>
                </div>
                <span class="text-[10px] text-white/50 font-bold uppercase">{{ selectedDivision }}</span>
            </div>
            <div class="p-6 md:p-8">
                <div class="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                    <!-- Athlete 1 -->
                    <div class="flex flex-col items-center flex-1 w-full">
                        <div
                            class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 border-2 border-primary/20 mb-3 overflow-hidden">
                            <img alt="Arif Dwi" class="w-full h-full object-cover"
                                src="https://i.pravatar.cc/150?u=arif" />
                        </div>
                        <h3 class="text-lg font-bold text-navy text-center font-display">Arif Dwi Pangestu</h3>
                        <p class="text-xs text-text-sub font-bold uppercase tracking-widest opacity-50">DKI Jakarta</p>
                        <div class="mt-2 px-2 py-0.5 rounded text-[10px] font-black bg-navy text-white uppercase">Rank 1
                        </div>
                    </div>

                    <!-- Score -->
                    <div class="flex flex-col items-center px-4 md:px-8 relative">
                        <div class="text-[10px] font-black text-text-sub/30 uppercase tracking-[0.2em] mb-1">Set Score
                        </div>
                        <div class="flex items-center gap-6">
                            <span class="text-5xl md:text-7xl font-black text-navy tabular-nums">6</span>
                            <span class="text-2xl text-text-sub/20 font-light">-</span>
                            <span class="text-5xl md:text-7xl font-black text-text-sub/30 tabular-nums">4</span>
                        </div>
                        <span
                            class="px-3 py-1 mt-4 rounded-full bg-primary/10 text-navy text-[10px] font-black uppercase tracking-widest border border-primary/20">Match
                            Won</span>
                    </div>

                    <!-- Athlete 2 -->
                    <div class="flex flex-col items-center flex-1 w-full">
                        <div
                            class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-100 border-2 border-gray-200 mb-3 overflow-hidden grayscale opacity-50">
                            <img alt="Riau Ega" class="w-full h-full object-cover"
                                src="https://i.pravatar.cc/150?u=ega" />
                        </div>
                        <h3 class="text-lg font-bold text-text-sub/50 text-center font-display">Riau Ega Agatha</h3>
                        <p class="text-xs text-text-sub/30 font-bold uppercase tracking-widest">Jawa Timur</p>
                        <div
                            class="mt-2 px-2 py-0.5 rounded text-[10px] font-black bg-gray-100 text-text-sub/40 uppercase">
                            Rank 8</div>
                    </div>
                </div>

                <!-- Last Set Values -->
                <div class="border-t border-gray-50 pt-6">
                    <div class="text-center mb-4">
                        <span class="text-[10px] font-black text-text-sub/30 uppercase tracking-widest">Set 5 - Arrow
                            Values</span>
                    </div>
                    <div
                        class="flex justify-between items-center gap-4 max-w-md mx-auto bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div class="flex gap-2">
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary text-navy flex items-center justify-center font-black text-sm md:text-lg shadow-sm">
                                X</div>
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary text-navy flex items-center justify-center font-black text-sm md:text-lg shadow-sm">
                                10</div>
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white text-navy border border-gray-100 flex items-center justify-center font-bold text-sm md:text-lg">
                                9</div>
                            <div class="text-xs font-black text-navy self-center ml-2 tabular-nums">29</div>
                        </div>
                        <div class="h-8 w-px bg-gray-200"></div>
                        <div class="flex gap-2 flex-row-reverse">
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white text-navy border border-gray-100 flex items-center justify-center font-bold text-sm md:text-lg">
                                9</div>
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white text-navy border border-gray-100 flex items-center justify-center font-bold text-sm md:text-lg">
                                9</div>
                            <div
                                class="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white text-navy border border-gray-100 flex items-center justify-center font-bold text-sm md:text-lg">
                                8</div>
                            <div class="text-xs font-black text-text-sub/40 self-center mr-2 tabular-nums">26</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Qualification Standings Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div class="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 class="font-bold text-navy text-lg font-display">Klasemen Kualifikasi</h3>
                <span class="text-[10px] font-black text-primary flex items-center gap-1 uppercase tracking-widest">
                    <span class="relative flex h-2 w-2">
                        <span
                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Live Updates
                </span>
            </div>
            <div class="overflow-x-auto no-scrollbar">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead
                        class="bg-white text-text-sub/50 uppercase text-[10px] font-black tracking-widest border-b border-gray-50">
                        <tr>
                            <th class="px-6 py-4 w-16">Rank</th>
                            <th class="px-6 py-4 w-20">Target</th>
                            <th class="px-6 py-4">Athlete</th>
                            <th class="px-6 py-4 text-center">Score 1</th>
                            <th class="px-6 py-4 text-center">Score 2</th>
                            <th class="px-6 py-4 text-center">10s/Xs</th>
                            <th class="px-6 py-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="(stand, index) in standings" :key="stand.name"
                            class="hover:bg-gray-50/50 transition-colors group"
                            :class="index === 0 ? 'bg-primary/5' : ''">
                            <td class="px-6 py-4 font-black text-navy tabular-nums">{{ index + 1 }}</td>
                            <td class="px-6 py-4 text-text-sub/50 font-bold tabular-nums">{{ stand.target }}</td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="font-bold text-navy group-hover:text-primary transition-colors">{{
                                        stand.name }}</div>
                                    <span
                                        class="px-1.5 py-0.5 rounded text-[8px] bg-navy/5 text-navy font-black border border-navy/10">{{
                                            stand.prov }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center font-bold text-text-sub tabular-nums">{{ stand.s1 }}</td>
                            <td class="px-6 py-4 text-center font-bold text-text-sub tabular-nums">{{ stand.s2 }}</td>
                            <td class="px-6 py-4 text-center text-text-sub/50 font-medium tabular-nums">{{ stand.tens
                            }}/{{ stand.xs }}</td>
                            <td class="px-6 py-4 text-right font-black text-navy text-base tabular-nums">{{ stand.s1 +
                                stand.s2 }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="p-4 border-t border-gray-50 text-center bg-gray-50/30">
                <button class="text-navy font-bold text-xs hover:underline uppercase tracking-widest">Unduh Hasil
                    Lengkap (PDF)</button>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Hasil Pertandingan - Dashboard'
})

const selectedDivision = ref('Recurve Men')
const selectedRound = ref('Babak Eliminasi')

const divisions = ['Recurve Putra', 'Recurve Putri', 'Compound Putra', 'Compound Putri', 'Barebow']
const rounds = ['Babak Kualifikasi', 'Babak Eliminasi', 'Final Perunggu', 'Final Emas']

const standings = [
    { name: 'Arif Dwi Pangestu', target: '12A', prov: 'DKI', s1: 338, s2: 342, tens: 42, xs: 16 },
    { name: 'Riau Ega Agatha', target: '14B', prov: 'JATIM', s1: 335, s2: 340, tens: 38, xs: 12 },
    { name: 'Alviyanto Bagas', target: '11A', prov: 'JATENG', s1: 332, s2: 338, tens: 35, xs: 10 },
    { name: 'Hendra Purnama', target: '13B', prov: 'DIY', s1: 330, s2: 336, tens: 32, xs: 9 },
    { name: 'Ahmad Khoirul', target: '10A', prov: 'JABAR', s1: 328, s2: 335, tens: 30, xs: 8 }
]
</script>

<style scoped>
.text-text-sub {
    color: #4b5563;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.font-display {
    font-family: 'Manrope', sans-serif;
}
</style>
