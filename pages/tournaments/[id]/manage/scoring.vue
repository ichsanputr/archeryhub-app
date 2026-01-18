<template>
    <div class="space-y-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
                <h1 class="text-3xl font-black text-navy tracking-tight uppercase italic">Manajemen Skor</h1>
                <p class="text-text-sub font-medium mt-1">Monitor kemajuan scoring tiap lajur secara real-time dan
                    kelola rapid entry.</p>
            </div>
            <div class="flex gap-3">
                <button
                    class="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-navy font-black text-sm hover:bg-gray-50 transition-all shadow-sm">
                    <span class="material-symbols-outlined text-[20px]">filter_list</span>
                    Filter
                </button>
                <button
                    class="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-navy font-black text-sm hover:bg-gray-50 transition-all shadow-sm">
                    <span class="material-symbols-outlined text-[20px]">download</span>
                    Export Hasil
                </button>
            </div>
        </div>

        <!-- Metrics Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="metric in scoringMetrics" :key="metric.label"
                class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
                <div :class="metric.bgClass" class="h-12 w-12 rounded-xl flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-2xl" :class="metric.iconColor">{{ metric.icon }}</span>
                </div>
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ metric.label }}
                    </p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-black text-navy tabular-nums">{{ metric.value }}</h3>
                        <span v-if="metric.trend" :class="metric.trendColor" class="text-[10px] font-black">{{
                            metric.trend }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scoring Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div class="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                <h3 class="font-black text-navy text-lg uppercase tracking-tight">Progres Scoring Real-time</h3>
                <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest opacity-60">
                    <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Live</span>
                    <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Selesai</span>
                    <span class="flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                        Menunggu</span>
                </div>
            </div>

            <div class="overflow-x-auto no-scrollbar">
                <table class="w-full text-left text-sm whitespace-nowrap">
                    <thead
                        class="bg-white text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-50">
                        <tr>
                            <th class="px-6 py-4 w-24">Target</th>
                            <th class="px-6 py-4">Atlet di Lajur</th>
                            <th class="px-6 py-4">Kemajuan End</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="target in scoringData" :key="target.id"
                            class="group hover:bg-gray-50/50 transition-colors">
                            <td class="px-6 py-4">
                                <div
                                    class="flex items-center justify-center h-12 w-12 bg-navy text-primary rounded-xl font-black text-xl shadow-lg shadow-navy/10 transform group-hover:scale-110 transition-transform">
                                    {{ target.target }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-2">
                                    <div v-for="ath in target.archers" :key="ath.name" class="flex items-center gap-3">
                                        <span
                                            class="w-6 h-6 rounded-lg bg-gray-50 text-[10px] font-black flex items-center justify-center text-gray-400 border border-gray-100 uppercase">{{
                                            ath.pos }}</span>
                                        <div class="flex flex-col">
                                            <span class="font-black text-navy leading-tight">{{ ath.name }}</span>
                                            <span class="text-[10px] font-bold text-gray-400 tabular-nums">Poin: {{
                                                ath.score }}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-2">
                                    <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">End {{
                                        target.currentEnd }} dari {{ target.totalEnds }}</span>
                                    <div class="flex items-center gap-1.5">
                                        <div v-for="i in 6" :key="i"
                                            class="w-3 h-3 rounded-full shadow-inner border border-gray-100"
                                            :class="i < target.currentEnd ? 'bg-navy' : i === target.currentEnd ? 'bg-primary animate-pulse' : 'bg-gray-100'">
                                        </div>
                                        <span class="text-[10px] font-black text-gray-200 ml-1">...</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="getStatusClass(target.status)"
                                    class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border">
                                    <span v-if="target.status === 'live'"
                                        class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1"></span>
                                    {{ target.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button
                                    class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-navy font-black text-[10px] uppercase tracking-widest hover:bg-primary-hover transition-all shadow-md shadow-primary/20">
                                    <span class="material-symbols-outlined text-[16px]">edit_note</span>
                                    Rapid Entry
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Menampilkan 1-5 dari 32
                    target aktif</span>
                <div class="flex gap-1">
                    <button class="p-2 text-gray-300 hover:text-navy transition-colors"><span
                            class="material-symbols-outlined">chevron_left</span></button>
                    <button class="p-2 text-navy transition-colors"><span
                            class="material-symbols-outlined">chevron_right</span></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard'
})

const scoringMetrics = [
    { label: 'End Selesai', value: '450', icon: 'flag', iconColor: 'text-blue-600', bgClass: 'bg-blue-50', trend: '+24/jam', trendColor: 'text-green-500' },
    { label: 'Skor Rata-rata', value: '8.7', icon: 'analytics', iconColor: 'text-purple-600', bgClass: 'bg-purple-50', trend: 'per panah', trendColor: 'text-gray-400' },
    { label: 'Input Tertunda', value: '5', icon: 'pending_actions', iconColor: 'text-orange-600', bgClass: 'bg-orange-50', trend: 'Urgent', trendColor: 'text-orange-500' },
    { label: 'Skor Tertinggi', value: '298', icon: 'emoji_events', iconColor: 'text-green-600', bgClass: 'bg-green-50', trend: 'S. Jenkins', trendColor: 'text-gray-400' },
]

const scoringData = [
    { id: 1, target: '01', status: 'live', currentEnd: 4, totalEnds: 20, archers: [{ pos: 'A', name: 'Sarah Jenkins', score: 298 }, { pos: 'B', name: 'Mike Ross', score: 285 }] },
    { id: 2, target: '02', status: 'live', currentEnd: 4, totalEnds: 20, archers: [{ pos: 'A', name: 'Jessica Pearson', score: 290 }, { pos: 'B', name: 'Harvey Specter', score: 292 }] },
    { id: 3, target: '03', status: 'pending', currentEnd: 0, totalEnds: 20, archers: [] },
    { id: 4, target: '04', status: 'finished', currentEnd: 20, totalEnds: 20, archers: [{ pos: 'A', name: 'Louis Litt', score: 568 }, { pos: 'B', name: 'Donna Paulsen', score: 552 }] },
    { id: 5, target: '05', status: 'live', currentEnd: 4, totalEnds: 20, archers: [{ pos: 'A', name: 'Rachel Zane', score: 275 }, { pos: 'B', name: 'Katrina Bennett', score: 268 }] },
]

const getStatusClass = (status) => {
    const classes = {
        'live': 'bg-green-50 text-green-700 border-green-200',
        'pending': 'bg-orange-50 text-orange-700 border-orange-200',
        'finished': 'bg-blue-50 text-blue-700 border-blue-200'
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
