<template>
    <div class="space-y-6">
        <!-- Breadcrumb & Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight uppercase">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                    <span class="text-navy">Manajemen Kualifikasi</span>
                </div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Babak Kualifikasi</h1>
                <p class="text-gray-500 font-medium mt-1">Pantau perolehan skor dan progres atlet secara real-time.</p>
            </div>
            <div class="flex gap-3 mt-2 md:mt-0">
                <BaseButton variant="white" icon="ph:printer" class="h-11">
                    Cetak Skor
                </BaseButton>
                <BaseButton variant="primary" icon="ph:play-bold" class="h-11 shadow-lg shadow-primary/20">
                    Mulai Sesi
                </BaseButton>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-navy/5 text-navy flex items-center justify-center">
                    <Icon icon="ph:users-three" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Atlet</p>
                    <p class="text-xl font-black text-navy">{{ stats.totalArchers }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                    <Icon icon="ph:check-circle" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Selesai</p>
                    <p class="text-xl font-black text-navy">{{ stats.completedArchers }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Icon icon="ph:timer" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Berlangsung</p>
                    <p class="text-xl font-black text-navy">{{ stats.ongoingArchers }}</p>
                </div>
            </div>
            <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="h-12 w-12 rounded-xl bg-primary/10 text-primary-dark flex items-center justify-center">
                    <Icon icon="ph:chart-line-up" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Skor Tertinggi</p>
                    <p class="text-xl font-black text-navy">{{ stats.topScore }}</p>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" placeholder="Cari nama atlet atau klub..."
                    label="Pencarian" />
            </div>
            <div class="w-full md:w-64">
                <BaseSelect v-model="filterCategory" :items="['Recurve Men', 'Compound Women']" label="Kategori" />
            </div>
            <BaseButton variant="white" icon="ph:export" class="h-11">
                Export
            </BaseButton>
        </div>

        <!-- Scoring Table -->
        <div class="bg-white rounded-xl shadow-card border border-gray-100 flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 class="font-bold text-navy">Progress Kualifikasi Real-Time</h3>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span>
                        Live</span>
                    <span class="flex items-center gap-1 ml-2"><span class="w-2 h-2 rounded-full bg-blue-500"></span>
                        Selesai</span>
                    <span class="flex items-center gap-1 ml-2"><span class="w-2 h-2 rounded-full bg-gray-300"></span>
                        Menunggu</span>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Rank</th>
                            <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">
                                Atlet</th>
                            <th
                                class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                                Progresi
                            </th>
                            <th
                                class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                                10
                            </th>
                            <th
                                class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                                X
                            </th>
                            <th
                                class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                                Total
                            </th>
                            <th
                                class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 text-sm">
                        <tr v-for="target in targets" :key="target.id"
                            :class="target.status === 'pending' ? 'bg-orange-50/30' : ''"
                            class="group hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div :class="getTargetClass(target.status)"
                                    class="flex items-center justify-center h-10 w-10 rounded-lg font-bold text-lg shadow-sm">
                                    {{ String(target.id).padStart(2, '0') }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div v-if="target.archers.length" class="flex flex-col gap-1">
                                    <div v-for="(archer, i) in target.archers" :key="i" class="flex items-center gap-2">
                                        <span
                                            class="w-5 h-5 rounded bg-gray-100 text-[10px] font-bold flex items-center justify-center text-gray-500">{{
                                                ['A', 'B'][i] }}</span>
                                        <span class="font-medium text-navy">{{ archer.name }}</span>
                                        <span class="text-xs text-gray-400 ml-1">{{ archer.score }}</span>
                                    </div>
                                </div>
                                <span v-else class="text-sm text-gray-400 italic">Tidak ada atlet aktif</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-1.5">
                                    <span class="text-xs font-semibold"
                                        :class="target.status === 'finished' ? 'text-blue-600' : 'text-gray-500'">{{
                                            target.progress
                                        }}</span>
                                    <div class="flex items-center gap-1">
                                        <div v-for="(dot, i) in target.dots" :key="i" :class="dot"
                                            class="w-2.5 h-2.5 rounded-full"></div>
                                        <div class="flex flex-col gap-1 items-end">
                                            <span :class="getStatusClass(target.status)"
                                                class="text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                                                {{ target.status }}
                                            </span>
                                            <span
                                                class="text-[10px] text-gray-400 font-bold uppercase tracking-tight">End
                                                11/12</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center font-bold text-navy">24</td>
                            <td class="px-6 py-4 text-center font-bold text-navy">12</td>
                            <td class="px-6 py-4 text-center font-black text-navy text-lg">{{ 580 + target.id }}</td>
                            <td class="px-6 py-4 text-right">
                                <button v-if="target.status === 'live'"
                                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-navy font-bold text-xs hover:bg-primary-hover transition-colors shadow-sm shadow-primary/30">
                                    <span class="material-symbols-outlined text-[16px]">edit_note</span>
                                    Input Skor Cepat
                                </button>
                                <button v-else-if="target.status === 'pending'"
                                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-400 font-bold text-xs cursor-not-allowed">
                                    <span class="material-symbols-outlined text-[16px]">lock</span>
                                    Terkunci
                                </button>
                                <button v-else
                                    class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-navy font-bold text-xs hover:bg-gray-50 transition-colors shadow-sm">
                                    <span class="material-symbols-outlined text-[16px]">visibility</span>
                                    Lihat Scorecard
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
definePageMeta({
    layout: 'dashboard'
})

const stats = reactive({
    totalArchers: 112,
    completedArchers: 85,
    ongoingArchers: 27,
    topScore: 298
})

const searchQuery = ref('')
const filterCategory = ref('Recurve Men')

const targets = [
    { id: 1, archers: [{ name: 'Sarah Jenkins', score: 298 }, { name: 'Mike Ross', score: 285 }], progress: 'End 4 dari 20', status: 'live', dots: ['bg-navy', 'bg-navy', 'bg-navy', 'bg-primary border border-primary animate-pulse', 'bg-gray-200', 'bg-gray-200'] },
    { id: 2, archers: [{ name: 'Jessica Pearson', score: 290 }, { name: 'Harvey Specter', score: 292 }], progress: 'End 4 dari 20', status: 'live', dots: ['bg-navy', 'bg-navy', 'bg-navy', 'bg-primary border border-primary animate-pulse', 'bg-gray-200', 'bg-gray-200'] },
    { id: 3, archers: [], progress: 'Menunggu Mulai', status: 'pending', dots: ['bg-gray-200', 'bg-gray-200', 'bg-gray-200', 'bg-gray-200'] },
    { id: 4, archers: [{ name: 'Louis Litt', score: 568 }, { name: 'Donna Paulsen', score: 552 }], progress: 'Selesai (20/20)', status: 'finished', dots: ['bg-blue-500', 'bg-blue-500', 'bg-blue-500', 'bg-blue-500', 'bg-blue-500'] },
    { id: 5, archers: [{ name: 'Rachel Zane', score: 275 }, { name: 'Katrina Bennett', score: 268 }], progress: 'End 4 dari 20', status: 'live', dots: ['bg-navy', 'bg-navy', 'bg-navy', 'bg-primary border border-primary animate-pulse', 'bg-gray-200', 'bg-gray-200'] },
]

const getTargetClass = (status) => {
    const classes = {
        'live': 'bg-navy text-primary',
        'pending': 'bg-white border border-orange-200 text-orange-600',
        'finished': 'bg-gray-100 border border-gray-200 text-gray-600'
    }
    return classes[status] || 'bg-white border border-gray-200 text-navy'
}

const getStatusClass = (status) => {
    const classes = {
        'live': 'bg-green-100 text-green-700',
        'pending': 'bg-orange-100 text-orange-700',
        'finished': 'bg-blue-50 text-blue-700'
    }
    return classes[status] || 'bg-gray-100 text-gray-700'
}
</script>
