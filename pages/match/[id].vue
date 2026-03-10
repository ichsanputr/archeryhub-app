<template>
    <div class="min-h-screen bg-[#f8fafc] text-[#111827] font-sans selection:bg-[#D9FF00] selection:text-[#0f172a]">

        <!-- ── Top Bar ───────────────────────────────────────────── -->
        <header
            class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm h-16 flex items-center">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4">
                <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                    <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0">
                        <div class="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center">
                            <img src="/logo.png" alt="Archeryhub.id" class="w-5 h-5 object-contain" />
                        </div>
                        <span class="text-lg font-black tracking-tight text-[#0f172a] hidden md:block">Archeryhub<span
                                class="text-[#D9FF00]">.id</span></span>
                    </NuxtLink>
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-gray-200 text-lg font-light select-none hidden md:block">/</span>
                        <span class="text-xs sm:text-sm font-bold text-gray-500 truncate">Detail Pertandingan</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div v-if="matchData"
                        class="hidden sm:flex px-2 sm:px-3 py-1 bg-[#D9FF00] text-[#0f172a] rounded-full text-[9px] sm:text-[10px] font-black tracking-wider uppercase border border-[#0f172a]/10 max-w-[120px] md:max-w-none truncate">
                        {{ formatLabel }}
                    </div>
                    <button @click="handleBack"
                        class="p-1.5 sm:p-2 hover:bg-slate-50 rounded-lg transition-colors border border-gray-100 group shrink-0"
                        title="Kembali">
                        <Icon icon="ph:arrow-left-bold"
                            class="text-base sm:text-lg text-gray-400 group-hover:text-[#0f172a] transition-colors" />
                    </button>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 relative z-10">

            <!-- ── Loading ─────────────────────────────────────────── -->
            <div v-if="isLoading" class="flex-1 min-h-[calc(100vh-12rem)] flex flex-col items-center justify-center">
                <div class="flex items-center gap-2 mb-5">
                    <span class="size-3 rounded-full bg-[#D9FF00] animate-bounce" style="animation-delay: 0ms"></span>
                    <span class="size-3 rounded-full bg-[#D9FF00] animate-bounce" style="animation-delay: 150ms"></span>
                    <span class="size-3 rounded-full bg-[#D9FF00] animate-bounce" style="animation-delay: 300ms"></span>
                </div>
                <span class="text-slate-400 font-bold tracking-widest uppercase text-xs">Memuat data
                    pertandingan...</span>
            </div>

            <!-- ── Match Content ───────────────────────────────────── -->
            <template v-else-if="matchData">
                <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 py-6 md:py-10">

                    <!-- ═══════════════════════════════════════
                         VERSUS HEAD-TO-HEAD SECTION
                    ════════════════════════════════════════ -->
                    <div class="grid grid-cols-1 md:grid-cols-11 items-center gap-3 sm:gap-4 md:gap-6">

                        <!-- Archer A Card -->
                        <div
                            class="md:col-span-4 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 border-l-4 sm:border-l-8 border-l-[#D9FF00] relative overflow-hidden group">
                            <div class="flex items-center gap-3 sm:gap-4 md:gap-5">
                                <div
                                    class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl bg-gray-100 overflow-hidden relative border border-[#e2e8f0] shrink-0">
                                    <img :src="useImageOrDefault(null, participantA?.name)"
                                        class="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div
                                        class="absolute top-0.5 left-0.5 bg-[#0f172a] text-[#D9FF00] text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 rounded">
                                        #{{ participantA?.seed || '?' }}
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div v-if="isWinner('A')"
                                        class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#D9FF00] text-[#0f172a] rounded text-[8px] font-black tracking-widest uppercase mb-1">
                                        <Icon icon="ph:crown-fill" class="text-[9px]" />
                                        Pemenang
                                    </div>
                                    <h2
                                        class="text-sm sm:text-base md:text-xl font-black text-[#0f172a] uppercase tracking-tight truncate leading-tight">
                                        {{ participantA?.name || 'TBD' }}
                                    </h2>
                                    <span
                                        class="text-[#64748b] font-medium text-[10px] sm:text-xs block truncate uppercase mt-0.5">
                                        {{ participantA?.club || 'PEMANAH A' }}
                                    </span>
                                    <!-- Score -->
                                    <div class="mt-2 flex items-end gap-1.5">
                                        <span
                                            class="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f172a] tabular-nums leading-none">
                                            {{ getFinalScore('A') }}
                                        </span>
                                        <span
                                            class="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest mb-0.5">
                                            {{ matchData.format === 'recurve_set' ? 'Set Pts' : 'Skor' }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- VS Divider -->
                        <div
                            class="md:col-span-3 flex flex-col items-center justify-center py-2 sm:py-4 order-first md:order-none">
                            <span
                                class="text-[8px] sm:text-[10px] font-black text-[#64748b] uppercase tracking-[0.4em] mb-1 sm:mb-2">
                                Babak Eliminasi
                            </span>
                            <span class="text-2xl sm:text-3xl md:text-4xl font-black text-[#e2e8f0]">VS</span>
                            <div class="mt-2 sm:mt-4 px-3 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black tracking-widest uppercase"
                                :class="matchData.status === 'finished'
                                    ? 'bg-[#0f172a] text-[#D9FF00]'
                                    : 'bg-blue-500 text-white'">
                                {{ matchData.status === 'finished' ? 'SELESAI' : 'AKTIF' }}
                            </div>
                        </div>

                        <!-- Archer B Card -->
                        <div
                            class="md:col-span-4 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 border-r-4 sm:border-r-8 border-r-[#e2e8f0] flex flex-row-reverse items-center gap-3 sm:gap-4 md:gap-5 group text-right relative overflow-hidden">
                            <div
                                class="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl bg-gray-100 overflow-hidden relative border border-[#e2e8f0] shrink-0">
                                <img :src="useImageOrDefault(null, participantB?.name)"
                                    class="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div
                                    class="absolute top-0.5 right-0.5 bg-[#0f172a] text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 rounded">
                                    #{{ participantB?.seed || '?' }}
                                </div>
                            </div>
                            <div class="min-w-0 flex-1">
                                <div v-if="isWinner('B')"
                                    class="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#D9FF00] text-[#0f172a] rounded text-[8px] font-black tracking-widest uppercase mb-1">
                                    <Icon icon="ph:crown-fill" class="text-[9px]" />
                                    Pemenang
                                </div>
                                <h2
                                    class="text-sm sm:text-base md:text-xl font-black text-[#0f172a] uppercase tracking-tight truncate leading-tight text-right">
                                    {{ participantB?.name || 'TBD' }}
                                </h2>
                                <span
                                    class="text-[#64748b] font-medium text-[10px] sm:text-xs block truncate uppercase mt-0.5 text-right">
                                    {{ participantB?.club || 'PEMANAH B' }}
                                </span>
                                <!-- Score -->
                                <div class="mt-2 flex items-end gap-1.5 flex-row-reverse">
                                    <span
                                        class="text-3xl sm:text-4xl md:text-5xl font-black text-[#0f172a] tabular-nums leading-none">
                                        {{ getFinalScore('B') }}
                                    </span>
                                    <span class="text-[9px] font-black text-[#94a3b8] uppercase tracking-widest mb-0.5">
                                        {{ matchData.format === 'recurve_set' ? 'Set Pts' : 'Skor' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ═══════════════════════════════════════
                         SCORE BREAKDOWN TABLE
                    ════════════════════════════════════════ -->
                    <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
                        <div
                            class="px-3 sm:px-6 py-3 sm:py-4 bg-slate-50 border-b border-[#e2e8f0] flex items-center justify-between gap-2">
                            <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                <Icon icon="ph:table-bold" class="text-[#0f172a] text-sm shrink-0" />
                                <h3
                                    class="text-[10px] sm:text-xs font-black text-[#0f172a] uppercase tracking-widest sm:tracking-[0.15em] truncate">
                                    <span class="sm:hidden">Skor Seri</span>
                                    <span class="hidden sm:inline">Rincian Skor Per Seri</span>
                                </h3>
                            </div>
                            <div
                                class="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] font-bold text-[#64748b] uppercase tracking-wider sm:tracking-widest shrink-0">
                                <Icon icon="ph:info-bold" class="shrink-0" />
                                <span class="sm:hidden">{{ formatLabelMobile }}</span>
                                <span class="hidden sm:inline">{{ formatLabel }}</span>
                            </div>
                        </div>

                        <div class="overflow-x-auto">
                            <table class="w-full text-center min-w-[580px] text-xs sm:text-sm">
                                <thead>
                                    <tr
                                        class="bg-[#0f172a] text-white text-[9px] sm:text-[10px] tracking-widest font-black uppercase">
                                        <th class="py-3 sm:py-4 w-12 sm:w-14">Seri</th>
                                        <th class="w-36 sm:w-48 text-left px-4 sm:px-6">Pemanah</th>
                                        <th v-for="i in maxArrows" :key="i" class="w-10 sm:w-14 text-center">
                                            A{{ i }}
                                        </th>
                                        <th class="w-14 sm:w-20">Total</th>
                                        <th class="w-14 sm:w-20 bg-white/10">
                                            {{ matchData.format === 'recurve_set' ? 'Poin Set' : 'Berjalan' }}
                                        </th>
                                        <th class="w-20 sm:w-28 border-l border-white/10">Akumulasi</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-[#f1f5f9]">
                                    <template v-for="endNo in sortedEnds" :key="endNo">
                                        <!-- Row Archer A -->
                                        <tr class="border-t border-[#e2e8f0]">
                                            <td class="font-black text-[#1e293b] bg-[#f8fafc] border-r border-[#e2e8f0] text-[10px] sm:text-xs py-3 sm:py-4"
                                                rowspan="2">
                                                <span
                                                    class="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-md text-[10px] font-black"
                                                    :class="endNo === 99 ? 'bg-orange-100 text-orange-600' : 'bg-[#0f172a] text-[#D9FF00]'">
                                                    {{ endNo === 99 ? 'SO' : endNo }}
                                                </span>
                                            </td>
                                            <td class="px-4 sm:px-6 py-2 sm:py-3 text-left">
                                                <div class="flex items-center gap-1.5">
                                                    <span
                                                        class="w-2 h-2 rounded-full bg-[#D9FF00] border border-[#0f172a]/20 shrink-0"></span>
                                                    <span
                                                        class="font-black text-[10px] sm:text-xs text-[#0f172a] uppercase truncate">
                                                        {{ participantA?.name || 'ARCHER A' }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Arrows A -->
                                            <td v-for="i in maxArrows" :key="'a-' + i" class="py-2 sm:py-3">
                                                <span
                                                    class="inline-flex size-8 sm:size-9 rounded-lg items-center justify-center border text-[10px] sm:text-xs font-black"
                                                    :class="getArrowClass(getEndsBySide(endNo, 'A')[i - 1])">
                                                    {{ getEndsBySide(endNo, 'A')[i - 1] || '–' }}
                                                </span>
                                            </td>

                                            <!-- Total A -->
                                            <td
                                                class="font-black text-[#0f172a] text-sm sm:text-base md:text-lg tabular-nums py-2 sm:py-3">
                                                {{ getEndTotal(endNo, 'A') }}
                                            </td>
                                            <!-- Points/running A -->
                                            <td
                                                class="font-black text-[#0f172a] text-xs sm:text-sm bg-slate-50/80 py-2 sm:py-3">
                                                {{ getSidePoints('A', endNo) }}
                                            </td>
                                            <!-- Cumulative (rowspan 2) -->
                                            <td class="border-l border-[#e2e8f0] font-black text-sm sm:text-base md:text-xl py-2 sm:py-3 bg-[#f8fafc]/60"
                                                rowspan="2">
                                                {{ getRunningScoreDisplay(endNo) }}
                                            </td>
                                        </tr>

                                        <!-- Row Archer B -->
                                        <tr class="border-b border-[#e2e8f0]">
                                            <td class="px-4 sm:px-6 py-2 sm:py-3 text-left">
                                                <div class="flex items-center gap-1.5">
                                                    <span class="w-2 h-2 rounded-full bg-slate-300 shrink-0"></span>
                                                    <span
                                                        class="font-semibold text-[10px] sm:text-xs text-[#64748b] uppercase truncate">
                                                        {{ participantB?.name || 'ARCHER B' }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Arrows B -->
                                            <td v-for="i in maxArrows" :key="'b-' + i" class="py-2 sm:py-3">
                                                <span
                                                    class="inline-flex size-8 sm:size-9 rounded-lg items-center justify-center border text-[10px] sm:text-xs font-bold"
                                                    :class="getArrowClass(getEndsBySide(endNo, 'B')[i - 1])">
                                                    {{ getEndsBySide(endNo, 'B')[i - 1] || '–' }}
                                                </span>
                                            </td>

                                            <!-- Total B -->
                                            <td
                                                class="font-black text-[#0f172a] text-sm sm:text-base md:text-lg tabular-nums py-2 sm:py-3">
                                                {{ getEndTotal(endNo, 'B') }}
                                            </td>
                                            <!-- Points/running B -->
                                            <td
                                                class="font-bold text-[#0f172a] text-xs sm:text-sm bg-slate-50/80 py-2 sm:py-3">
                                                {{ getSidePoints('B', endNo) }}
                                            </td>
                                        </tr>
                                    </template>

                                    <!-- Empty state -->
                                    <tr v-if="sortedEnds.length === 0">
                                        <td :colspan="3 + maxArrows" class="py-16 text-center">
                                            <div class="flex flex-col items-center gap-3 text-gray-300">
                                                <Icon icon="ph:clipboard-text-bold" class="text-4xl" />
                                                <span class="text-xs font-bold uppercase tracking-widest">Belum Ada
                                                    Data Skor</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>

                                <!-- Summary footer -->
                                <tfoot v-if="sortedEnds.length > 0">
                                    <tr class="bg-[#0f172a] text-white">
                                        <td colspan="2" class="py-3 px-4 sm:px-6 text-left">
                                            <span
                                                class="text-[9px] font-black tracking-widest uppercase text-white/40">Total
                                                Akhir</span>
                                        </td>
                                        <td :colspan="maxArrows"></td>
                                        <td class="py-3 text-center">
                                            <div class="flex flex-col gap-1 items-center">
                                                <span class="font-black text-[#D9FF00] text-sm tabular-nums">{{
                                                    totalScoreA }}</span>
                                                <span class="font-bold text-white/40 text-sm tabular-nums">{{
                                                    totalScoreB }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3 text-center bg-white/5">
                                            <div class="flex flex-col gap-1 items-center">
                                                <span class="font-black text-[#D9FF00] text-sm tabular-nums">{{
                                                    getFinalScore('A') }}</span>
                                                <span class="font-bold text-white/40 text-sm tabular-nums">{{
                                                    getFinalScore('B') }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3 border-l border-white/10 text-center">
                                            <span
                                                class="text-lg sm:text-2xl font-black text-[#D9FF00] tabular-nums tracking-tighter">
                                                {{ getFinalScore('A') }} – {{ getFinalScore('B') }}
                                            </span>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                </div>
            </template>

            <!-- ── Error State ──────────────────────────────────────── -->
            <div v-else
                class="bg-white rounded-3xl p-12 text-center border border-[#e2e8f0] shadow-sm max-w-md mx-auto mt-20">
                <div class="size-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon icon="ph:warning-bold" class="text-4xl text-red-500" />
                </div>
                <h3 class="text-xl font-black text-[#0f172a] mb-2">Pertandingan Tak Ditemukan</h3>
                <span class="text-[#64748b] text-sm leading-relaxed block mb-8">
                    Data pertandingan belum tersedia atau ID pertandingan salah.
                </span>
                <button @click="handleBack"
                    class="px-6 py-3 bg-[#0f172a] text-white font-black rounded-xl hover:bg-[#1e293b] transition-all">
                    Kembali ke Event
                </button>
            </div>
        </main>

        <LayoutAppFooter />

        <div class="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
            style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { get } = useApi()
const route = useRoute()
const router = useRouter()
const matchId = route.params.id

definePageMeta({ layout: 'blank' })

const isLoading = ref(true)
const matchData = ref(null)
const participantA = ref(null)
const participantB = ref(null)
const ends = ref([])

// ── Fetch ──────────────────────────────────────────────────────────
const fetchMatchData = async () => {
    isLoading.value = true
    try {
        const res = await get(`/match/${matchId}`)
        if (res) {
            matchData.value = res.match
            participantA.value = res.participant_a
            participantB.value = res.participant_b
            ends.value = res.ends || []
        }
    } catch (e) {
        console.error('Failed to fetch match:', e)
    } finally {
        isLoading.value = false
    }
}

// ── Computed ───────────────────────────────────────────────────────
const formatLabel = computed(() => {
    if (!matchData.value) return '-'
    return matchData.value.format === 'recurve_set'
        ? 'Sistem Set (Recurve)'
        : 'Akumulasi Skor (Compound)'
})

const formatLabelMobile = computed(() => {
    if (!matchData.value) return '-'
    return matchData.value.format === 'recurve_set'
        ? 'Set (Recurve)'
        : 'Akumulasi'
})

const sortedEnds = computed(() => {
    if (!ends.value.length) return []
    const nums = [...new Set(ends.value.map(e => e.end_no))]
    return nums.sort((a, b) => a - b)
})

/** How many arrow columns to render — use bracket config if available, else infer from data */
const maxArrows = computed(() => {
    if (matchData.value?.arrows_per_end) return matchData.value.arrows_per_end
    if (!ends.value.length) return 3
    const maxFromData = Math.max(...ends.value.map(e => (e.arrows || []).length))
    return maxFromData > 0 ? maxFromData : 3
})

/** Running totals for the footer */
const totalScoreA = computed(() =>
    ends.value
        .filter(e => e.side === 'A' && e.end_no !== 99)
        .reduce((s, e) => s + (e.end_total || 0), 0)
)
const totalScoreB = computed(() =>
    ends.value
        .filter(e => e.side === 'B' && e.end_no !== 99)
        .reduce((s, e) => s + (e.end_total || 0), 0)
)

// ── Helpers ────────────────────────────────────────────────────────
const getEndsBySide = (endNo, side) => {
    const end = ends.value.find(e => e.end_no === endNo && e.side === side)
    return end?.arrows || []
}

const getEndTotal = (endNo, side) => {
    const end = ends.value.find(e => e.end_no === endNo && e.side === side)
    return end?.end_total ?? 0
}

const getSidePoints = (side, endNo) => {
    const isSet = matchData.value?.format === 'recurve_set'
    if (!isSet) {
        // Accumulated format: just show this end's total
        return getEndTotal(endNo, side)
    }
    // Set format: 2 pts winner, 1 pt draw, 0 pts loser
    const myTotal = getEndTotal(endNo, side)
    const otherTotal = getEndTotal(endNo, side === 'A' ? 'B' : 'A')
    if (myTotal > otherTotal) return 2
    if (myTotal === otherTotal && myTotal > 0) return 1
    return 0
}

const getRunningScoreDisplay = (endNo) => {
    let ptsA = 0
    let ptsB = 0
    sortedEnds.value.filter(n => n <= endNo).forEach(n => {
        ptsA += getSidePoints('A', n)
        ptsB += getSidePoints('B', n)
    })
    return `${ptsA} – ${ptsB}`
}

const getFinalScore = (side) => {
    if (!matchData.value) return 0
    return matchData.value.format === 'recurve_set'
        ? (side === 'A' ? matchData.value.total_points_a : matchData.value.total_points_b)
        : (side === 'A' ? matchData.value.total_score_a : matchData.value.total_score_b)
}

const isWinner = (side) => {
    if (!matchData.value?.winner_entry_id) return false
    const id = side === 'A' ? matchData.value.entry_a_id : matchData.value.entry_b_id
    return matchData.value.winner_entry_id === id
}



/** Arrow color by archery scoring zone */
const getArrowClass = (score) => {
    if (!score || score === '' || score === '–')
        return 'bg-slate-50 border-slate-100 text-slate-300'
    if (score === 'X' || score === '10' || score === '9')
        return 'bg-[#D9FF00] text-[#0f172a] border-[#D9FF00]/30 shadow-sm font-black'
    if (score === '8' || score === '7')
        return 'bg-red-500 text-white border-red-600 shadow-sm font-black'
    if (score === '6' || score === '5')
        return 'bg-blue-500 text-white border-blue-600 shadow-sm font-black'
    if (score === '4' || score === '3')
        return 'bg-[#111827] text-white border-gray-800 shadow-sm font-black'
    if (score === 'M')
        return 'bg-slate-100 text-slate-400 border-slate-200 font-bold'
    return 'bg-white text-gray-500 border-gray-200 font-bold'
}

const handleBack = () => router.back()

onMounted(fetchMatchData)
</script>
