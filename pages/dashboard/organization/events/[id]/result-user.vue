<template>
    <div class="flex flex-col gap-8 pb-16">
        <!-- Breadcrumbs & Header Actions -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <nav class="flex text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 items-center gap-2">
                    <NuxtLink :to="`/dashboard/events/${eventId}`" class="hover:text-primary transition-colors">Event
                    </NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                    <span class="text-slate-600 dark:text-slate-300">Profil Atlet</span>
                </nav>
                <div class="flex items-center gap-4">
                    <button @click="handleBack"
                        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-primary/50 transition-all text-navy dark:text-white">
                        <Icon icon="ph:arrow-left-bold" />
                    </button>
                    <h2 class="text-3xl font-black text-navy dark:text-white tracking-tight">Performa Peserta</h2>
                </div>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:download-bold" class="h-11 px-6 shadow-sm font-bold">
                    Export PDF
                </BaseButton>
                <BaseButton variant="navy" icon="ph:share-network-bold"
                    class="h-11 px-6 shadow-lg shadow-navy/20 font-black">
                    Bagikan Laporan
                </BaseButton>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-6">
            <div
                class="h-48 bg-white dark:bg-slate-800 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-700" />
            <div class="grid grid-cols-3 gap-6">
                <div v-for="i in 3" :key="i" class="h-32 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />
            </div>
            <div class="h-96 bg-white dark:bg-slate-800 rounded-2xl animate-pulse" />
        </div>

        <template v-else>
            <!-- Profile Header Card -->
            <div
                class="bg-white dark:bg-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-8 relative overflow-hidden group">
                <div
                    class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none group-hover:bg-primary/10 transition-all duration-500" />

                <div class="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
                    <div class="relative">
                        <div
                            class="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-primary p-1 bg-white dark:bg-slate-800 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500">
                            <img :src="useImageOrDefault(userProfile?.avatar_url, userProfile?.full_name)"
                                class="w-full h-full rounded-2xl object-cover" />
                        </div>
                        <div
                            class="absolute -bottom-2 -right-2 bg-navy text-white text-[10px] font-black px-3 py-1.5 rounded-xl border-2 border-white dark:border-slate-800 shadow-lg">
                            ARCHER
                        </div>
                    </div>

                    <div class="flex-1 text-center md:text-left pt-2">
                        <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                            <h3 class="text-3xl sm:text-4xl font-black text-navy dark:text-white tracking-tight">{{
                                userProfile?.full_name || 'Archer' }}</h3>
                            <span
                                class="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-black capitalize tracking-widest border border-slate-200 dark:border-slate-600 shadow-sm">
                                BIB #{{ userProfile?.bib_number || '42' }}
                            </span>
                        </div>

                        <div
                            class="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8 text-slate-500 dark:text-slate-400 font-medium text-sm">
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:shield-check-bold" class="text-primary text-lg" />
                                {{ userProfile?.club_name || 'Independent archer' }}
                            </div>
                            <span class="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block" />
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:map-pin-bold" class="text-primary text-lg" />
                                {{ userProfile?.city || 'Unspecified City' }}
                            </div>
                        </div>

                        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl">
                            <div
                                class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors hover:border-primary/30">
                                <p class="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">
                                    Divisi</p>
                                <p class="font-black text-navy dark:text-white">{{ categoryName || 'Standard Bow' }}</p>
                            </div>
                            <div
                                class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors hover:border-primary/30">
                                <p class="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">
                                    Peringkat Kualifikasi</p>
                                <p class="font-black text-navy dark:text-white">#{{ qualRank || '-' }} <span
                                        class="text-[10px] text-slate-400">/ {{ totalParticipants }}</span></p>
                            </div>
                            <div
                                class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors hover:border-primary/30">
                                <p class="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">
                                    Peralatan</p>
                                <p class="font-black text-navy dark:text-white">{{ userProfile?.bow_type || '-' }}</p>
                            </div>
                            <div
                                class="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-colors hover:border-primary/30 text-primary">
                                <p class="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5">
                                    Rata-rata Skor</p>
                                <p class="font-black text-navy dark:text-white">{{ averageArrowScore }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Major Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div
                    class="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/30 dark:shadow-none flex items-center justify-between transform transition-all hover:scale-[1.02]">
                    <div>
                        <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Peringkat
                            Kualifikasi</p>
                        <p class="text-5xl font-black text-navy dark:text-white tracking-tighter">
                            {{ qualRank || '-' }}<span class="text-lg font-bold align-top mt-2 ml-0.5">{{
                                getOrdinal(qualRank) }}</span>
                        </p>
                    </div>
                    <div
                        class="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-600">
                        <Icon icon="ph:medal-bold" class="text-4xl" />
                    </div>
                </div>

                <div
                    class="bg-navy p-8 rounded-3xl border-2 border-primary/30 shadow-2xl shadow-primary/10 flex items-center justify-between relative overflow-hidden group transform transition-all hover:scale-[1.02]">
                    <div
                        class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    <div>
                        <p class="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">Peringkat Akhir
                        </p>
                        <p class="text-4xl font-black text-white tracking-tight">
                            {{ elimStatusLabel === 'Winner' ? 'Juara' : elimStatusLabel === 'Done' ? 'Selesai' :
                                elimStatusLabel }}
                        </p>
                    </div>
                    <div
                        class="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-black/20">
                        <Icon :icon="elimStatusLabel === 'Winner' ? 'ph:crown-bold' : 'ph:trophy-bold'"
                            class="text-4xl" />
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/30 dark:shadow-none flex items-center justify-between transform transition-all hover:scale-[1.02]">
                    <div>
                        <p class="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Skor</p>
                        <p class="text-5xl font-black text-navy dark:text-white tracking-tighter">{{ qualTotalScore || 0
                        }}<span class="text-sm font-bold text-slate-400 ml-2 tracking-widest">PTS</span></p>
                    </div>
                    <div
                        class="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-600">
                        <Icon icon="ph:chart-bar-bold" class="text-4xl" />
                    </div>
                </div>
            </div>

            <!-- Qualification Journey & Heatmap Section -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Qualification Table -->
                <div
                    class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/30 dark:shadow-none overflow-hidden">
                    <div
                        class="p-8 border-b border-slate-50 dark:border-slate-700 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/10">
                        <div>
                            <h4 class="font-black text-xl text-navy dark:text-white flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                                    <Icon icon="ph:chart-line-up-bold" class="text-lg" />
                                </div>
                                Jejak Kualifikasi
                            </h4>
                        </div>
                        <div
                            class="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 shadow-inner">
                            <button v-for="(session, idx) in qualSessions" :key="idx" @click="activeSessionIdx = idx"
                                class="px-6 py-2 rounded-lg transition-all"
                                :class="activeSessionIdx === idx ? 'bg-white dark:bg-slate-700 text-navy dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'">
                                Sesi {{ idx + 1 }}
                            </button>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-sm text-left">
                            <thead
                                class="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                                <tr>
                                    <th class="px-8 py-4">End</th>
                                    <th class="px-8 py-4 text-center">Rincian Skor</th>
                                    <th class="px-8 py-4 text-center">Skor</th>
                                    <th class="px-8 py-4 text-center">10s+X</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50 dark:divide-slate-700 font-medium">
                                <template v-if="activeSession">
                                    <tr v-for="(endTotal, endIdx) in activeSession.end_scores_list" :key="endIdx"
                                        class="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td class="px-8 py-5 font-black text-navy dark:text-white">{{ endIdx + 1 }}</td>
                                        <td class="px-8 py-5">
                                            <div class="flex justify-center gap-1.5">
                                                <template v-if="getArrowScores(endIdx).length">
                                                    <span v-for="(arrow, aIdx) in getArrowScores(endIdx)" :key="aIdx"
                                                        class="w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs shadow-sm transition-all hover:scale-110"
                                                        :class="getScoreColorClass(arrow)">
                                                        {{ arrow }}
                                                    </span>
                                                </template>
                                                <template v-else>
                                                    <div
                                                        class="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                        Total End: {{ endTotal }}
                                                    </div>
                                                </template>
                                            </div>
                                        </td>
                                        <td class="px-8 py-5 text-center font-black text-lg text-navy dark:text-white">
                                            {{ endTotal }}</td>
                                        <td class="px-8 py-5 text-center text-slate-400 font-bold">-</td>
                                    </tr>
                                    <tr class="bg-primary/5 dark:bg-primary/5 font-black">
                                        <td class="px-8 py-6 text-right uppercase tracking-widest text-[10px] text-slate-500"
                                            colspan="2">Ringkasan Sesi:
                                        </td>
                                        <td class="px-8 py-6 text-center text-primary text-2xl tracking-tighter">{{
                                            activeSession.total_score }}</td>
                                        <td class="px-8 py-6 text-center text-navy dark:text-white">{{
                                            activeSession.total_10x || '-' }}</td>
                                    </tr>
                                </template>
                                <tr v-else>
                                    <td colspan="4" class="py-20 text-center">
                                        <Icon icon="ph:target-light" class="text-6xl mx-auto mb-4 opacity-10" />
                                        <p class="text-xs font-black uppercase tracking-widest text-slate-300">Data
                                            tidak tersedia</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Heatmap Clustering -->
                <div
                    class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/30 dark:shadow-none p-8 flex flex-col">
                    <h4 class="font-black text-xl text-navy dark:text-white flex items-center gap-3 mb-8">
                        <div class="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-500">
                            <Icon icon="ph:gps-fixed-bold" class="text-lg" />
                        </div>
                        Precision Heatmap
                    </h4>

                    <div class="flex-1 flex flex-col items-center justify-center py-4">
                        <div class="relative w-64 h-64 mb-8 group">
                            <div
                                class="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <svg class="w-full h-full drop-shadow-2xl relative z-10" viewbox="0 0 100 100">
                                <circle cx="50" cy="50" r="48" fill="white" stroke="#e2e8f0" stroke-width="0.5" />
                                <circle cx="50" cy="50" r="40" fill="white" stroke="#e2e8f0" stroke-width="0.5" />
                                <circle cx="50" cy="50" r="32" fill="#1e293b" stroke="#0f172a" stroke-width="0.5" />
                                <circle cx="50" cy="50" r="24" fill="#1e293b" stroke="#000" stroke-width="0.5" />
                                <circle cx="50" cy="50" r="16" fill="#3b82f6" stroke="#2563eb" stroke-width="0.5" />
                                <circle cx="50" cy="50" r="8" fill="#ef4444" stroke="#dc2626" stroke-width="0.5" />
                                <circle cx="50" cy="50" r="4" fill="#D9FF00" stroke="#a3c000" stroke-width="0.5" />

                                <!-- Simulated Heatmap Clusters -->
                                <g v-if="qualTotalScore > 0">
                                    <circle cx="48" cy="49" fill="#D9FF00" fill-opacity="0.3" r="10" />
                                    <circle cx="51" cy="50" fill="#D9FF00" fill-opacity="0.4" r="7" />
                                    <circle cx="50" cy="50" fill="#D9FF00" fill-opacity="0.6" r="4" />
                                    <circle cx="49.5" cy="50.2" fill="#0f172a" r="0.8" />
                                    <circle cx="50.2" cy="49.8" fill="#0f172a" r="0.8" />
                                    <circle cx="48.5" cy="49.2" fill="#0f172a" r="0.8" />
                                </g>
                            </svg>
                        </div>

                        <div class="w-full space-y-4">
                            <div
                                class="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <span class="text-slate-400 font-black uppercase text-[10px] tracking-widest">Center
                                    Grouping</span>
                                <span class="font-black text-green-500">{{ qualTotalScore > 650 ? 'Elite' : 'Stable'
                                }}</span>
                            </div>
                            <div
                                class="flex justify-between items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <span class="text-slate-400 font-black uppercase text-[10px] tracking-widest">Bias
                                    Vertikal</span>
                                <span class="font-black text-navy dark:text-white">Netral</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Elimination Path Track -->
            <div
                class="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/30 dark:shadow-none p-10 overflow-hidden">
                <h4 class="font-black text-2xl text-navy dark:text-white flex items-center gap-4 mb-12">
                    <div
                        class="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-500 shadow-lg shadow-indigo-500/10">
                        <Icon icon="ph:git-merge-bold" class="text-xl" />
                    </div>
                    Bagan Eliminasi
                </h4>

                <div v-if="elimMatches.length === 0"
                    class="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[32px]">
                    <Icon icon="ph:sword-light" class="text-7xl mx-auto mb-6 opacity-10" />
                    <p class="text-sm font-black uppercase tracking-widest text-slate-300">Belum mencapai eliminasi</p>
                </div>

                <div v-else class="relative overflow-x-auto pb-8 scrollbar-hide">
                    <div class="flex min-w-[1200px] items-center px-4 gap-4">
                        <template v-for="(match, mIdx) in elimMatches" :key="match.uuid">
                            <!-- Match Box -->
                            <div class="w-[280px] shrink-0">
                                <div
                                    class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center mb-6">
                                    Babak {{ match.round_no }}</div>
                                <div class="relative p-6 rounded-[32px] overflow-hidden transition-all hover:translate-y-[-4px] group"
                                    :class="match.winner_entry_uuid === myEntryUuid ? 'bg-navy text-white shadow-2xl shadow-primary/20 border-b-4 border-primary' : 'bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700'">

                                    <div class="flex flex-col gap-4">
                                        <div class="flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-3 min-w-0">
                                                <img :src="useImageOrDefault(null, match.entry_a_name)"
                                                    class="size-10 rounded-xl object-cover shrink-0 ring-2 ring-white/10" />
                                                <span class="text-xs font-black truncate"
                                                    :class="match.winner_entry_uuid === match.entry_a_uuid ? 'text-white' : 'text-slate-400'">{{
                                                        match.entry_a_name || 'TBD' }}</span>
                                            </div>
                                            <span class="text-sm font-black tabular-nums">{{ match.total_score_a ?? 0
                                            }}</span>
                                        </div>

                                        <div class="h-px bg-slate-200 dark:bg-slate-800 opacity-20" />

                                        <div class="flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-3 min-w-0">
                                                <img :src="useImageOrDefault(null, match.entry_b_name)"
                                                    class="size-10 rounded-xl object-cover shrink-0 ring-2 ring-white/10" />
                                                <span class="text-xs font-black truncate"
                                                    :class="match.winner_entry_uuid === match.entry_b_uuid ? 'text-white' : 'text-slate-400'">{{
                                                        match.entry_b_name || 'TBD' }}</span>
                                            </div>
                                            <span class="text-sm font-black tabular-nums">{{ match.total_score_b ?? 0
                                            }}</span>
                                        </div>
                                    </div>

                                    <div v-if="match.winner_entry_uuid === myEntryUuid"
                                        class="absolute top-2 right-2 size-6 rounded-full bg-primary text-navy flex items-center justify-center shadow-lg">
                                        <Icon icon="ph:crown-fill" class="text-xs" />
                                    </div>
                                </div>
                            </div>

                            <!-- Connector Link -->
                            <div v-if="mIdx < elimMatches.length - 1"
                                class="w-16 flex items-center justify-center mt-6 opacity-20">
                                <div class="h-1 w-full bg-slate-300 dark:bg-slate-600 rounded-full relative">
                                    <div
                                        class="absolute right-0 top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-slate-400" />
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Footer Compliance -->
            <footer class="mt-8 pt-12 border-t border-slate-100 dark:border-slate-800 text-center">
                <p
                    class="text-slate-400 text-[10px] font-bold flex items-center justify-center gap-2 uppercase tracking-widest">
                    <Icon icon="ph:seal-check-fill" class="text-primary text-base" /> Verified performance data provided
                    by Archery
                    Hub Competitive Scoring System
                </p>
                <p class="text-slate-300 dark:text-slate-600 text-[10px] mt-2">© 2026 Archery Hub ID. All intellectual
                    property
                    remains with the respective organizers.</p>
            </footer>
        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
const { get } = useApi()
const route = useRoute()
const router = useRouter()
const eventId = route.params.id

definePageMeta({
    layout: 'dashboard'
})

const isLoading = ref(true)
const eventName = ref('Loading...')
const userProfile = ref(null)
const myEntryUuid = ref(null)
const categoryId = ref(null)
const categoryName = ref('')
const archerUuid = ref(null)  // internal archer UUID for score lookup
const qualSessions = ref([])
const qualTotalScore = ref(null)
const qualRank = ref(null)
const totalParticipants = ref(0)
const totalTens = ref(0)
const totalXs = ref(0)
const elimMatches = ref([])
const bracketId = ref(null)

const activeSessionIdx = ref(0)
const sessionsArrowData = ref({}) // assignment_id -> list of end scores with arrows

const activeSession = computed(() => {
    return qualSessions.value[activeSessionIdx.value] || null
})

const getOrdinal = (n) => {
    if (!n) return ''
    const s = ["th", "st", "nd", "rd"]
    const v = n % 100
    return s[(v - 20) % 10] || s[v] || s[0]
}

const getScoreColorClass = (score) => {
    if (score === 'X' || score === '10') return 'bg-primary text-slate-900'
    if (score === '9') return 'bg-primary/20 text-slate-900 border border-primary/30'
    if (score === '8' || score === '7') return 'bg-red-500 text-white shadow-red-500/20'
    if (score === '6' || score === '5') return 'bg-blue-500 text-white shadow-blue-500/20'
    if (score === '4' || score === '3') return 'bg-slate-800 text-white'
    if (score === 'M') return 'bg-slate-200 text-slate-400'
    return 'bg-slate-100 text-slate-500'
}

const getArrowScores = (endIdx) => {
    if (!activeSession.value) return []
    const assignmentId = activeSession.value.assignment_id
    const endData = sessionsArrowData.value[assignmentId]?.find(e => e.end_number === endIdx + 1)
    if (!endData?.arrows) return []
    return endData.arrows.map(a => a.is_x ? 'X' : a.score.toString())
}

const averageArrowScore = computed(() => {
    if (!qualSessions.value.length || !qualTotalScore.value) return '0.0'
    let totalArrows = 0
    qualSessions.value.forEach(s => {
        totalArrows += s.end_scores_list.length * 6
    })
    if (totalArrows === 0) return '0.0'
    return (qualTotalScore.value / totalArrows).toFixed(1)
})

const elimStatusLabel = computed(() => {
    if (!elimMatches.value.length) return 'Ready'
    const lastMatch = [...elimMatches.value].reverse()[0]
    if (lastMatch.status !== 'completed') return 'Active'
    if (lastMatch.winner_entry_uuid === myEntryUuid.value) return 'Winner'
    return 'Done'
})

const handleBack = () => {
    router.back()
}


const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const eventRes = await get(`/events/${eventId}`)
        eventName.value = eventRes?.event?.name || eventRes?.name || 'Event'

        // Support both archer_id (e.g. ARC-0014) and legacy participant_uuid
        const archerId = route.query.archer_id
        const participantUuid = route.query.participant_uuid

        if (archerId || participantUuid) {
            // Use archer_id (ARC code), or fall back to UUID — both work with the participants endpoint
            const lookupKey = archerId || participantUuid
            const pRes = await get(`/events/${eventId}/participants/${lookupKey}`)
            userProfile.value = {
                full_name: pRes?.full_name,
                avatar_url: pRes?.avatar_url,
                club_name: pRes?.club_name,
                city: pRes?.city,
                bow_type: pRes?.division_name,
                uuid: pRes?.archer_id,
                bib_number: pRes?.bib_number || Math.floor(Math.random() * 900) + 100
            }
            categoryId.value = pRes?.category_id
            categoryName.value = `${pRes?.division_name} - ${pRes?.category_name}`
            // Store the internal archer UUID for qualification result lookup
            if (!archerUuid.value) archerUuid.value = pRes?.archer_id
        } else {
            // No query param — show current logged-in archer's own results
            const profileRes = await get('/archer/me')
            userProfile.value = profileRes?.data
            const searchEmail = userProfile.value?.email

            const participantsRes = await get(`/events/${eventId}/participants`, {
                params: { limit: 1000, group_by: 'archer', search: searchEmail }
            })
            const me = participantsRes?.participants?.find(p => p.email === searchEmail)
            if (me?.categories?.length) {
                const cat = me.categories[0]
                categoryId.value = cat.category_id
                categoryName.value = `${cat.division_name} - ${cat.category_name}`
            }
            archerUuid.value = userProfile.value?.uuid
        }

        await updateResultsData()
    } catch (e) {
        console.error('Failed to fetch result-user data:', e)
    } finally {
        isLoading.value = false
    }
}

const updateResultsData = async () => {
    if (!categoryId.value) return

    try {
        // Fetch Qualification Results
        const gRes = await get(`/events/${eventId}/results/qualification`, {
            params: { category_id: categoryId.value }
        })
        totalParticipants.value = gRes?.results?.length || 0
        // Match by internal archer UUID (most reliable)
        const myQual = gRes?.results?.find(r =>
            (archerUuid.value && r.archer_uuid === archerUuid.value) ||
            (r.archer_uuid === userProfile.value?.uuid)
        )
        if (myQual) {
            qualRank.value = myQual.rank
            qualTotalScore.value = myQual.total_score ?? 0
            totalTens.value = myQual.total_ten || 0
            totalXs.value = myQual.total_x || 0
            const sessions = myQual.sessions || []
            qualSessions.value = sessions.map(s => ({
                assignment_id: s.assignment_id,
                session_name: s.session_name,
                session_code: s.session_code,
                total_score: s.total_score,
                total_10x: s.total_10x,
                total_x: s.total_x,
                end_scores: s.end_scores,
                end_scores_list: (s.end_scores && typeof s.end_scores === 'string')
                    ? s.end_scores.split(',').map(x => x.trim()).filter(Boolean)
                    : []
            }))

            // Fetch arrow details for each session in parallel
            for (const session of qualSessions.value) {
                if (session.assignment_id) {
                    get(`/scoring/qualification/assignment/${session.assignment_id}/scores`).then(res => {
                        if (res?.scores) {
                            sessionsArrowData.value[session.assignment_id] = res.scores
                        }
                    })
                }
            }
        }

        // Fetch Elimination Results
        const elimRes = await get(`/events/${eventId}/results/elimination`, {
            params: { category_id: categoryId.value }
        })
        if (elimRes?.bracket) {
            bracketId.value = elimRes.bracket.bracket_id || elimRes.bracket.id
            if (elimRes.bracket.matches) {
                const raw = Object.values(elimRes.bracket.matches).flat()
                const allMatches = raw.map(m => ({
                    ...m,
                    entry_a_uuid: m.entry_a_uuid ?? m.entry_a_id,
                    entry_b_uuid: m.entry_b_uuid ?? m.entry_b_id
                }))
                const myName = userProfile.value?.full_name
                const myMatch = allMatches.find(m => m.entry_a_name === myName || m.entry_b_name === myName)
                if (myMatch) {
                    myEntryUuid.value = myMatch.entry_a_name === myName ? (myMatch.entry_a_uuid ?? myMatch.entry_a_id) : (myMatch.entry_b_uuid ?? myMatch.entry_b_id)
                    elimMatches.value = allMatches
                        .filter(m => m.entry_a_uuid === myEntryUuid.value || m.entry_b_uuid === myEntryUuid.value)
                        .sort((a, b) => a.round_no - b.round_no)
                }
            }
        }
    } catch (e) {
        console.error('Failed to update results data:', e)
    }
}

let pollInterval = null

onMounted(async () => {
    await fetchInitialData()
    pollInterval = setInterval(updateResultsData, 10000)
})

onUnmounted(() => {
    if (pollInterval) {
        clearInterval(pollInterval)
    }
})
</script>

<style scoped>
.tabular-nums {
    font-variant-numeric: tabular-nums;
}

::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>
