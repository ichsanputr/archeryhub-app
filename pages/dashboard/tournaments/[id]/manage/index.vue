<template>
    <div class="space-y-8">
        <!-- Event Context Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
                <div
                    class="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    <NuxtLink to="/dashboard" class="hover:text-primary transition-colors flex items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">arrow_back</span>
                        Kembali ke Dashboard
                    </NuxtLink>
                    <span class="text-gray-200">/</span>
                    <span class="text-navy">Detail Kelola</span>
                </div>
                <h1 class="text-3xl font-black text-navy tracking-tight uppercase">2024 State Indoor Championship
                </h1>
                <div class="flex items-center gap-3 mt-2">
                    <span
                        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-green-50 text-green-700 border border-green-200 uppercase tracking-widest">
                        <span class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Status: Live
                    </span>
                    <span class="text-gray-400 text-xs font-bold border-l border-gray-100 pl-3">ID: #EV-2024-082</span>
                </div>
            </div>
            <div class="flex gap-3">
                <button
                    class="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-navy font-black text-sm hover:bg-gray-50 transition-all shadow-sm">
                    <span class="material-symbols-outlined text-[20px]">share</span>
                    Bagikan
                </button>
                <button
                    class="flex items-center gap-2 px-6 py-3 rounded-xl bg-navy text-primary font-black text-sm hover:opacity-90 transition-all shadow-lg group">
                    <span
                        class="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">edit</span>
                    Edit Event
                </button>
            </div>
        </div>

        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="stat in quickStats" :key="stat.label"
                class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-all">
                <div :class="stat.bgClass" class="h-14 w-14 rounded-xl flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-3xl" :class="stat.iconColor">{{ stat.icon }}</span>
                </div>
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-black text-navy tabular-nums">{{ stat.value }}</h3>
                        <span v-if="stat.subtext"
                            class="text-[10px] font-black px-1.5 py-0.5 rounded bg-gray-50 text-gray-500 uppercase tracking-tighter">{{
                                stat.subtext }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detail Sections Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Information Panel -->
            <div
                class="lg:col-span-1 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 class="font-bold text-navy text-lg flex items-center gap-2">
                        <span class="material-symbols-outlined text-[20px] text-primary-hover">info</span>
                        Informasi Event
                    </h3>
                    <button class="text-gray-300 hover:text-primary transition-colors">
                        <span class="material-symbols-outlined text-[20px]">edit_square</span>
                    </button>
                </div>
                <div class="p-6 flex flex-col gap-6">
                    <div>
                        <label
                            class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Deskripsi</label>
                        <p class="text-sm text-text-sub font-medium leading-relaxed">
                            Kejuaraan indoor tingkat provinsi tahunan yang melombakan divisi Recurve, Compound, dan
                            Barebow. Acara ini merupakan kualifikasi utama untuk Kejuaraan Nasional.
                        </p>
                    </div>
                    <div class="space-y-4">
                        <div class="flex gap-4">
                            <div
                                class="shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                <span class="material-symbols-outlined text-[18px]">calendar_month</span>
                            </div>
                            <div>
                                <p class="text-xs font-black text-navy">24 Okt - 26 Okt, 2024</p>
                                <p class="text-[9px] font-bold text-gray-400 uppercase mt-0.5">08:00 WIB - 18:00 WIB
                                </p>
                            </div>
                        </div>
                        <div class="flex gap-4">
                            <div
                                class="shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                                <span class="material-symbols-outlined text-[18px]">location_on</span>
                            </div>
                            <div>
                                <p class="text-xs font-black text-navy">Cobo Center Jakarta</p>
                                <p class="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Jl. Senayan No. 1,
                                    Jakarta Pusat</p>
                            </div>
                        </div>
                    </div>
                    <div class="pt-4 border-t border-gray-50">
                        <h4
                            class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                            Quick Actions
                        </h4>
                        <div class="grid grid-cols-2 gap-3">
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-navy transition-all group duration-300">
                                <span
                                    class="material-symbols-outlined mb-2 text-gray-400 group-hover:text-primary transition-colors">print</span>
                                <span
                                    class="text-[9px] font-black uppercase tracking-tight group-hover:text-navy">Scorecards</span>
                            </button>
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-navy transition-all group duration-300">
                                <span
                                    class="material-symbols-outlined mb-2 text-gray-400 group-hover:text-primary transition-colors">qr_code</span>
                                <span class="text-[9px] font-black uppercase tracking-tight group-hover:text-navy">QR
                                    Checkin</span>
                            </button>
                            <button
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-navy transition-all group duration-300">
                                <span
                                    class="material-symbols-outlined mb-2 text-gray-400 group-hover:text-primary transition-colors">published_with_changes</span>
                                <span class="text-[9px] font-black uppercase tracking-tight group-hover:text-navy">Sync
                                    Data</span>
                            </button>
                            <NuxtLink to="/dashboard/tournaments/1/manage/settings"
                                class="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary hover:shadow-lg hover:shadow-primary/10 text-navy transition-all group duration-300 text-center">
                                <span
                                    class="material-symbols-outlined mb-2 text-gray-400 group-hover:text-primary transition-colors">settings</span>
                                <span
                                    class="text-[9px] font-black uppercase tracking-tight group-hover:text-navy">Settings</span>
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Live Session Monitor -->
            <div
                class="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
                <div class="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-navy text-white">
                    <div class="flex items-center gap-3">
                        <div class="relative flex h-3 w-3">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </div>
                        <h3 class="font-black text-lg uppercase tracking-tight">Live Status</h3>
                    </div>
                    <div class="flex gap-2">
                        <button
                            class="text-[10px] font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-white transition-all uppercase tracking-widest border border-white/10">
                            Pause Round
                        </button>
                        <button
                            class="text-[10px] font-black bg-navy-light hover:bg-black px-4 py-2 rounded-lg text-white transition-all uppercase tracking-widest border border-white/10">
                            Broadcast
                        </button>
                    </div>
                </div>
                <div class="p-6 md:p-8 space-y-8 flex-grow">
                    <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                        <div>
                            <div class="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Current
                                Session</div>
                            <h4 class="font-black text-4xl text-navy tracking-tight uppercase">Qualification Round 2
                            </h4>
                            <p class="text-sm font-bold text-gray-400 mt-2">Group A • Recurve Men • 70 Meters</p>
                        </div>
                        <div class="bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100 text-right">
                            <div class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Session
                                Progress</div>
                            <div class="flex items-baseline gap-1 justify-end">
                                <span class="text-4xl font-black text-navy tabular-nums">End 4</span>
                                <span class="text-gray-300 text-xl font-black">/ 12</span>
                            </div>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div class="text-[10px] font-black text-navy uppercase tracking-widest tabular-nums">45:20
                                Remaining</div>
                            <div class="text-[10px] font-black text-primary uppercase tracking-widest tabular-nums">33%
                                Completed</div>
                        </div>
                        <div
                            class="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 shadow-inner border border-gray-100">
                            <div style="width:33%"
                                class="shadow-inner flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-1000 ease-out">
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div v-for="metric in sessionMetrics" :key="metric.label"
                            class="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center hover:bg-white hover:shadow-card group transition-all">
                            <div
                                class="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 group-hover:text-primary-hover">
                                {{ metric.label }}</div>
                            <div class="text-xl font-black text-navy tabular-nums">{{ metric.value }}</div>
                        </div>
                    </div>

                    <!-- Lane Status Heatmap -->
                    <div class="pt-6 border-t border-gray-50">
                        <div class="flex justify-between items-center mb-4">
                            <h5 class="text-xs font-black text-navy uppercase tracking-widest">Target Status</h5>
                            <div class="flex gap-4 text-[8px] font-black uppercase tracking-widest opacity-60">
                                <span class="flex items-center gap-1.5"><span
                                        class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Scoring</span>
                                <span class="flex items-center gap-1.5"><span
                                        class="w-1.5 h-1.5 rounded-full bg-primary"></span> Shooting</span>
                                <span class="flex items-center gap-1.5"><span
                                        class="w-1.5 h-1.5 rounded-full bg-red-500"></span> Alert</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-12 gap-2">
                            <div v-for="i in 24" :key="i"
                                class="aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-black transition-all hover:scale-110 cursor-pointer border"
                                :class="getLaneClass(i)">
                                {{ i < 10 ? '0' + i : i }} <span v-if="i === 4"
                                    class="material-symbols-outlined text-[10px] -mt-0.5">warning</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Leaderboard Preview -->
            <div
                class="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden flex flex-col">
                <div class="px-6 py-5 border-b border-gray-50 flex justify-between items-center bg-white">
                    <h3 class="font-bold text-navy text-lg flex items-center gap-2 uppercase tracking-tight">Leaderboard
                        Preview</h3>
                    <NuxtLink to="/dashboard/tournaments/1/manage/scoring"
                        class="text-xs text-text-secondary hover:text-navy font-bold uppercase tracking-widest transition-colors">
                        Full Results →</NuxtLink>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead
                            class="bg-gray-50/50 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b border-gray-50">
                            <tr>
                                <th class="px-6 py-4">Rk</th>
                                <th class="px-6 py-4">Archer</th>
                                <th class="px-6 py-4">Category</th>
                                <th class="px-6 py-4 text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50">
                            <tr v-for="(leader, idx) in leaderboardData" :key="leader.name"
                                class="hover:bg-gray-50 transition-colors group">
                                <td class="px-6 py-3.5">
                                    <div v-if="idx < 3" :class="idx === 0 ? 'bg-primary' : 'bg-navy text-white'"
                                        class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-black shadow-sm">
                                        {{ idx + 1 }}
                                    </div>
                                    <span v-else class="text-gray-300 font-black text-xs px-2">{{ idx + 1 }}</span>
                                </td>
                                <td
                                    class="px-6 py-3.5 font-bold text-navy group-hover:text-primary-hover transition-colors text-sm">
                                    {{ leader.name }}
                                </td>
                                <td class="px-6 py-3.5 text-xs text-gray-400 font-bold uppercase tracking-wider">
                                    {{ leader.category }}
                                </td>
                                <td class="px-6 py-3.5 text-right font-black text-navy text-base tabular-nums">
                                    {{ leader.score }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Recent Activity / Event Log -->
            <div
                class="lg:col-span-1 bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden">
                <div class="px-6 py-5 border-b border-gray-50 bg-gray-50/50">
                    <h3 class="font-bold text-navy text-lg uppercase tracking-tight">Event Activity Log</h3>
                </div>
                <div class="p-4 flex flex-col gap-4 overflow-y-auto no-scrollbar max-h-[400px]">
                    <div v-for="log in activityLog" :key="log.id"
                        class="flex gap-4 items-start p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-50 group">
                        <div
                            class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <span class="material-symbols-outlined text-[18px] text-gray-400 group-hover:text-navy">{{
                                log.icon }}</span>
                        </div>
                        <div>
                            <p class="text-[11px] font-bold text-navy leading-snug">{{ log.message }}</p>
                            <p class="text-[9px] text-gray-400 font-black uppercase mt-1 tracking-widest">{{ log.time }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="mt-auto p-4 border-t border-gray-50">
                    <button
                        class="w-full py-2 text-[9px] font-black text-gray-400 hover:text-navy uppercase tracking-widest">Download
                        Full Audit Log</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'dashboard'
})

const quickStats = [
    { label: 'Total Atlet', value: '124', icon: 'groups', iconColor: 'text-blue-600', bgClass: 'bg-blue-50', subtext: '+12%' },
    { label: 'Status Jalur', value: '32', icon: 'ads_click', iconColor: 'text-orange-600', bgClass: 'bg-orange-50', subtext: 'Lajur Aktif' },
    { label: 'Pendapatan', value: '45.2M', icon: 'payments', iconColor: 'text-green-600', bgClass: 'bg-green-50', subtext: 'IDR' },
]

const leaderboardData = [
    { name: 'Stephen Thompson', category: 'Recurve Men', score: '342' },
    { name: 'Diana Prince', category: 'Recurve Men', score: '338' },
    { name: 'Marcus Aurelius', category: 'Recurve Men', score: '335' },
    { name: 'John Doe', category: 'Recurve Men', score: '331' },
    { name: 'Jane Smith', category: 'Recurve Men', score: '328' },
]

const activityLog = [
    { id: 1, message: 'Qualification Round 2 started by Alex Range', time: '10 MIN AGO', icon: 'play_arrow' },
    { id: 2, message: 'Target 04 reported a scoring error', time: '15 MIN AGO', icon: 'warning' },
    { id: 3, message: 'Diana Prince finished End 4', time: '18 MIN AGO', icon: 'check_circle' },
    { id: 4, message: 'System auto-synced with cloud server', time: '25 MIN AGO', icon: 'sync' },
    { id: 5, message: 'New registration from Club Jakarta', time: '1 HOUR AGO', icon: 'person_add' },
]

const sessionMetrics = [
    { label: 'Time Left', value: '45:20' },
    { label: 'Total Arrows', value: '452/1200' },
    { label: 'Avg Score', value: '8.4' },
    { label: 'Active Archers', value: '48/50' },
]

const getLaneClass = (i) => {
    if (i === 4) return 'bg-red-50 border-red-200 text-red-600 shadow-sm'
    if (i % 3 === 0) return 'bg-emerald-50 border-emerald-200 text-emerald-700'
    if (i < 10) return 'bg-primary/10 border-primary/20 text-navy'
    return 'bg-gray-50 border-gray-100 text-gray-400 opacity-50'
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
</style>
