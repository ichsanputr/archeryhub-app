<template>
    <div class="min-h-screen bg-[#f8fafc] text-[#111827] font-sans selection:bg-[#D9FF00] selection:text-[#0f172a]">
        <!-- Public Navigation Bar -->
        <header class="bg-white border-b border-[#e2e8f0]">
            <nav class="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
                <NuxtLink to="/" class="flex items-center gap-2">
                    <div class="w-10 h-10 bg-[#0f172a] rounded-xl flex items-center justify-center text-[#D9FF00]">
                        <Icon icon="ph:target-bold" class="text-2xl" />
                    </div>
                    <span class="font-black text-xl tracking-tighter uppercase hidden sm:block">Archery<span
                            class="text-[#D9FF00]">Hub</span></span>
                </NuxtLink>

                <div class="flex items-center gap-4">
                    <div class="flex flex-col items-end">
                        <span
                            class="text-[10px] font-black uppercase tracking-[0.2em] text-[#0f172a]/40 leading-none">Match
                            Arena</span>
                        <span class="text-xs font-bold text-[#0f172a] truncate max-w-[150px] md:max-w-xs">
                            {{ matchData?.category_name || 'Match Detail' }}
                        </span>
                    </div>
                    <div class="w-px h-8 bg-slate-200 hidden sm:block"></div>
                    <button @click="handleBack"
                        class="p-2 bg-[#0f172a]/5 hover:bg-[#0f172a]/10 rounded-full transition-all">
                        <Icon icon="ph:caret-left-bold" class="text-xl text-[#0f172a]" />
                    </button>
                </div>
            </nav>

            <!-- Inline Status Bar (No longer sticky) -->
            <div class="bg-gray-50/50 border-t border-[#e2e8f0] px-4 md:px-8 py-4">
                <div class="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div class="flex flex-wrap items-center gap-3 md:gap-6">
                        <div class="flex items-center gap-2">
                            <span class="text-[#64748b] font-black text-[10px] uppercase tracking-[0.2em]">Babak</span>
                            <span class="bg-[#0f172a] text-white text-[10px] font-black px-2 py-0.5 rounded">
                                {{ matchData?.round_no || '-' }}
                            </span>
                        </div>
                        <div class="w-px h-4 bg-slate-200 hidden sm:block"></div>
                        <div class="flex items-center gap-2">
                            <span class="text-[#64748b] font-black text-[10px] uppercase tracking-[0.2em]">Format</span>
                            <span class="text-[#0f172a] text-[10px] font-black uppercase tracking-wider">
                                {{ formatLabel }}
                            </span>
                        </div>
                        <div class="w-px h-4 bg-slate-200 hidden sm:block"></div>
                        <div class="flex items-center gap-2">
                            <span v-if="matchData?.status !== 'finished'"
                                class="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded-lg border border-red-100 uppercase tracking-widest flex items-center gap-2">
                                <span class="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span> Pertandingan
                                Berlangsung
                            </span>
                            <span v-else
                                class="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-black rounded-lg border border-teal-100 uppercase tracking-widest flex items-center gap-2">
                                <Icon icon="ph:check-circle-fill" /> Pertandingan Selesai
                            </span>
                        </div>
                    </div>
                    <div
                        class="flex items-center gap-3 text-[#64748b] bg-white px-4 py-1.5 rounded-xl border border-[#e2e8f0] self-start md:self-auto shadow-sm">
                        <Icon icon="ph:calendar-clock-bold" class="text-navy" />
                        <span class="text-[10px] font-black uppercase tracking-widest text-navy">{{ formatMatchTime()
                        }}</span>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content Area -->
        <div>

            <main class="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
                <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 space-y-6">
                    <div class="relative">
                        <div class="size-16 rounded-full border-4 border-slate-200"></div>
                        <div
                            class="size-16 rounded-full border-4 border-[#D9FF00] border-t-transparent animate-spin absolute inset-0">
                        </div>
                    </div>
                    <p class="text-slate-400 font-bold animate-pulse tracking-widest uppercase text-xs">Menyiapkan
                        Arena...</p>
                </div>

                <template v-else-if="matchData">
                    <div class="max-w-6xl mx-auto space-y-8">
                        <!-- Versus Head-to-Head Section -->
                        <div class="grid grid-cols-1 md:grid-cols-11 items-center gap-4 md:gap-6">
                            <!-- Archer A Card -->
                            <div
                                class="md:col-span-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border-l-8 border-[#D9FF00] relative overflow-hidden group">
                                <div class="flex items-center gap-4 md:gap-6">
                                    <div
                                        class="w-20 md:w-24 h-20 md:h-24 rounded-xl bg-gray-100 overflow-hidden relative border border-[#e2e8f0] shrink-0">
                                        <img :src="getAvatarUrl(participantA?.name)"
                                            class="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div
                                            class="absolute top-1 left-1 bg-[#0f172a] text-[#D9FF00] text-[10px] font-bold px-1.5 rounded">
                                            {{ participantA?.seed || '1' }}
                                        </div>
                                    </div>
                                    <div class="min-w-0">
                                        <h2
                                            class="text-lg md:text-2xl font-black text-[#0f172a] uppercase tracking-tight truncate">
                                            {{ participantA?.name || 'TBD' }}</h2>
                                        <p class="text-[#64748b] font-medium text-xs md:text-sm truncate uppercase">{{
                                            participantA?.club || 'ARCHER A' }}</p>
                                        <div class="mt-2 flex gap-1 items-center">
                                            <span
                                                class="w-6 h-6 rounded-full bg-[#0f172a] flex items-center justify-center text-[#D9FF00] text-xs font-bold leading-none">
                                                {{ getFinalScore('A') }}
                                            </span>
                                            <span
                                                class="text-[10px] font-bold text-[#0f172a] ml-1 uppercase tracking-widest">{{
                                                    matchData.format === 'recurve_set' ? 'Set Pts' : 'Score' }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="isWinner('A')"
                                    class="absolute top-2 right-2 text-[#D9FF00] bg-[#0f172a] rounded-full p-1 shadow-lg">
                                    <Icon icon="ph:crown-fill" class="text-lg" />
                                </div>
                            </div>

                            <!-- VS Divider -->
                            <div class="md:col-span-3 flex flex-col items-center justify-center py-4">
                                <div class="text-[10px] font-black text-[#64748b] uppercase tracking-[0.4em] mb-2">
                                    Elimination Round</div>
                                <div class="text-3xl md:text-4xl font-black text-[#e2e8f0]">VS</div>
                                <div
                                    class="mt-4 px-4 py-1 bg-[#0f172a] text-[#D9FF00] rounded-full text-[10px] font-black tracking-widest">
                                    {{ matchData.status === 'finished' ? 'COMPLETED' : 'ACTIVE MATCH' }}
                                </div>
                            </div>

                            <!-- Archer B Card -->
                            <div
                                class="md:col-span-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border-r-8 border-[#e2e8f0] flex flex-row-reverse items-center justify-between gap-4 md:gap-6 group text-right">
                                <div
                                    class="w-20 md:w-24 h-20 md:h-24 rounded-xl bg-gray-100 overflow-hidden relative border border-[#e2e8f0] shrink-0">
                                    <img :src="getAvatarUrl(participantB?.name)"
                                        class="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div
                                        class="absolute top-1 right-1 bg-[#0f172a] text-white text-[10px] font-bold px-1.5 rounded">
                                        {{ participantB?.seed || '2' }}
                                    </div>
                                </div>
                                <div class="min-w-0">
                                    <h2
                                        class="text-lg md:text-2xl font-black text-[#0f172a] uppercase tracking-tight truncate text-right">
                                        {{ participantB?.name || 'TBD' }}</h2>
                                    <p
                                        class="text-[#64748b] font-medium text-xs md:text-sm truncate uppercase text-right">
                                        {{ participantB?.club || 'ARCHER B' }}</p>
                                    <div class="mt-2 flex flex-row-reverse gap-1 items-center">
                                        <span
                                            class="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[#0f172a] text-xs font-bold leading-none">
                                            {{ getFinalScore('B') }}
                                        </span>
                                        <span
                                            class="text-[10px] font-bold text-[#64748b] mr-1 uppercase tracking-widest text-right">{{
                                                matchData.format === 'recurve_set' ? 'Set Pts' : 'Score' }}</span>
                                    </div>
                                </div>
                                <div v-if="isWinner('B')"
                                    class="absolute top-2 left-2 text-[#D9FF00] bg-[#0f172a] rounded-full p-1 shadow-lg">
                                    <Icon icon="ph:crown-fill" class="text-lg" />
                                </div>
                            </div>
                        </div>

                        <!-- Score Breakdown Table -->
                        <div class="bg-white rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
                            <div class="overflow-x-auto">
                                <table class="w-full text-center min-w-[800px]">
                                    <thead>
                                        <tr
                                            class="bg-[#0f172a] text-white uppercase text-[10px] tracking-widest font-black">
                                            <th class="py-4 w-16">End</th>
                                            <th class="w-48 text-left px-6">Archer</th>
                                            <th v-for="i in maxArrows" :key="i" class="w-16">A{{ i }}</th>
                                            <th class="w-24">{{ scoreHeaderLabel }}</th>
                                            <th class="w-24 bg-white/10">{{ pointsHeaderLabel }}</th>
                                            <th class="w-32 border-l border-white/10">Running Score</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-[#e2e8f0]">
                                        <template v-for="endNo in sortedEnds" :key="endNo">
                                            <!-- Row for Archer A -->
                                            <tr class="group">
                                                <td class="font-bold text-[#1e293b] bg-[#f8fafc] border-r border-[#e2e8f0]"
                                                    rowspan="2">
                                                    {{ endNo === 99 ? 'SO' : endNo }}
                                                </td>
                                                <td
                                                    class="px-6 py-4 text-left font-black text-xs md:text-sm bg-[#D9FF00]/5 uppercase border-l-4 border-[#D9FF00]">
                                                    {{ participantA?.name || 'ARCHER A' }}
                                                </td>

                                                <!-- Archer A Arrows -->
                                                <td v-for="i in maxArrows" :key="'a-' + i" class="font-bold">
                                                    <div class="inline-flex size-9 rounded-lg items-center justify-center border transition-all"
                                                        :class="getScoreBadgeClass(getEndsBySide(endNo, 'A')[i - 1])">
                                                        {{ getEndsBySide(endNo, 'A')[i - 1] || '-' }}
                                                    </div>
                                                </td>

                                                <td class="font-black text-[#0f172a] text-lg">{{ getEndTotal(endNo, 'A')
                                                }}</td>
                                                <td class="font-black text-[#0f172a] bg-slate-50">{{ getSidePoints('A',
                                                    endNo) }}</td>
                                                <td class="border-l border-[#e2e8f0] font-black text-xl bg-[#f8fafc]/50"
                                                    rowspan="2">
                                                    {{ getRunningScoreDisplay(endNo) }}
                                                </td>
                                            </tr>
                                            <!-- Row for Archer B -->
                                            <tr class="text-[#64748b]">
                                                <td
                                                    class="px-6 py-4 text-left font-bold text-xs md:text-sm border-l-4 border-transparent uppercase">
                                                    {{ participantB?.name || 'ARCHER B' }}
                                                </td>
                                                <!-- Archer B Arrows -->
                                                <td v-for="i in maxArrows" :key="'b-' + i" class="font-medium">
                                                    <div class="inline-flex size-9 rounded-lg items-center justify-center border border-transparent"
                                                        :class="getScoreBadgeClass(getEndsBySide(endNo, 'B')[i - 1], true)">
                                                        {{ getEndsBySide(endNo, 'B')[i - 1] || '-' }}
                                                    </div>
                                                </td>
                                                <td class="font-bold text-[#0f172a]">{{ getEndTotal(endNo, 'B') }}</td>
                                                <td class="font-bold text-[#111827]">{{ getSidePoints('B', endNo) }}
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <!-- Visualization Section / Target Backgrounds -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e2e8f0]">
                                <div class="flex items-center justify-between mb-6">
                                    <h3 class="font-black text-[#0f172a] uppercase tracking-wider text-xs md:text-sm">{{
                                        participantA?.name ||
                                        'Archer A' }} - Visual Sheet</h3>
                                    <span class="text-[10px] font-bold text-[#64748b] uppercase">Avg: {{
                                        getAverageScore('A') }}</span>
                                </div>
                                <div
                                    class="aspect-square relative flex items-center justify-center max-w-[320px] mx-auto">
                                    <!-- Target Rings Simulated via Divs -->
                                    <div class="target-ring w-full h-full border border-gray-100 bg-white">
                                        <div class="target-ring w-[90%] h-[90%] border border-gray-200 bg-white">
                                            <div
                                                class="target-ring w-[80%] h-[80%] border border-gray-300 bg-[#111827]">
                                                <div
                                                    class="target-ring w-[75%] h-[75%] border border-gray-600 bg-[#111827]">
                                                    <div
                                                        class="target-ring w-[60%] h-[60%] border-blue-400 bg-blue-500">
                                                        <div
                                                            class="target-ring w-[50%] h-[50%] border-blue-400 bg-blue-500">
                                                            <div
                                                                class="target-ring w-[40%] h-[40%] border-red-400 bg-red-600">
                                                                <div
                                                                    class="target-ring w-[30%] h-[30%] border-red-400 bg-red-600">
                                                                    <div
                                                                        class="target-ring w-[20%] h-[20%] border-yellow-300 bg-[#D9FF00]">
                                                                        <div
                                                                            class="target-ring w-[10%] h-[10%] border-yellow-600 bg-[#D9FF00]">
                                                                            <div class="w-1 h-1 bg-black rounded-full">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Simulated Hit Dots for Archer A -->
                                    <div v-for="(hit, idx) in simulatedHits.A" :key="idx"
                                        class="hit-dot bg-white border-2 border-[#0f172a] shadow-sm z-10"
                                        :style="{ top: hit.y + '%', left: hit.x + '%' }"></div>
                                </div>
                            </div>

                            <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-[#e2e8f0]">
                                <div class="flex items-center justify-between mb-6">
                                    <h3 class="font-black text-[#0f172a] uppercase tracking-wider text-xs md:text-sm">{{
                                        participantB?.name ||
                                        'Archer B' }} - Visual Sheet</h3>
                                    <span class="text-[10px] font-bold text-[#64748b] uppercase">Avg: {{
                                        getAverageScore('B') }}</span>
                                </div>
                                <div
                                    class="aspect-square relative flex items-center justify-center max-w-[320px] mx-auto">
                                    <!-- Target Rings Simulated via Divs -->
                                    <div class="target-ring w-full h-full border border-gray-100 bg-white shadow-inner">
                                        <div class="target-ring w-[90%] h-[90%] border border-gray-200 bg-white">
                                            <div
                                                class="target-ring w-[80%] h-[80%] border border-gray-300 bg-[#111827]">
                                                <div
                                                    class="target-ring w-[75%] h-[75%] border border-gray-600 bg-[#111827]">
                                                    <div
                                                        class="target-ring w-[60%] h-[60%] border-blue-400 bg-blue-500">
                                                        <div
                                                            class="target-ring w-[50%] h-[50%] border-blue-400 bg-blue-500">
                                                            <div
                                                                class="target-ring w-[40%] h-[40%] border-red-400 bg-red-600">
                                                                <div
                                                                    class="target-ring w-[30%] h-[30%] border-red-400 bg-red-600">
                                                                    <div
                                                                        class="target-ring w-[20%] h-[20%] border-yellow-300 bg-[#D9FF00]">
                                                                        <div
                                                                            class="target-ring w-[10%] h-[10%] border-yellow-600 bg-[#D9FF00]">
                                                                            <div class="w-1 h-1 bg-black rounded-full">
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Simulated Hit Dots for Archer B -->
                                    <div v-for="(hit, idx) in simulatedHits.B" :key="idx"
                                        class="hit-dot bg-white border-2 border-[#0f172a] shadow-sm z-10"
                                        :style="{ top: hit.y + '%', left: hit.x + '%' }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Error State -->
                <div v-else
                    class="bg-white rounded-3xl p-12 text-center border border-[#e2e8f0] shadow-sm max-w-md mx-auto mt-20">
                    <div class="size-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Icon icon="ph:warning-bold" class="text-4xl text-red-500" />
                    </div>
                    <h3 class="text-xl font-black text-[#0f172a] mb-2">Match Not Found</h3>
                    <p class="text-[#64748b] text-sm mb-8 leading-relaxed">The match might haven't started or the ID is
                        incorrect.</p>
                    <button @click="handleBack"
                        class="px-6 py-3 bg-[#0f172a] text-white font-black rounded-xl hover:bg-[#1e293b] transition-all">
                        Back to Event
                    </button>
                </div>
            </main>
        </div>

        <!-- Dot Background Texture -->
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

definePageMeta({
    layout: 'landing'
})

const isLoading = ref(true)
const matchData = ref(null)
const participantA = ref(null)
const participantB = ref(null)
const ends = ref([])

// For visualization, we'll simulate some hits based on their recent arrows
const simulatedHits = ref({ A: [], B: [] })

const fetchMatchData = async () => {
    isLoading.value = true
    try {
        const response = await get(`/match/${matchId}`)
        if (response) {
            matchData.value = response.match
            participantA.value = response.participant_a
            participantB.value = response.participant_b
            ends.value = response.ends || []

            // Generate some dots based on arrow data
            generateSimulatedHits()
        }
    } catch (e) {
        console.error('Failed to fetch match details:', e)
    } finally {
        isLoading.value = false
    }
}

const generateSimulatedHits = () => {
    const generateForSide = (side) => {
        const hits = []
        const sideEnds = ends.value.filter(e => e.side === side)
        sideEnds.forEach(e => {
            (e.arrows || []).forEach(val => {
                if (!val || val === '-') return
                const score = val === 'X' ? 10.5 : parseInt(val)
                if (isNaN(score)) return

                // Randomize position based on score
                // Score 10 is inner yellow, Score 1 is outer white
                const radius = (11 - score) * 4 // Max radius ~40%
                const angle = Math.random() * Math.PI * 2
                const dist = Math.random() * radius
                hits.push({
                    x: 50 + Math.cos(angle) * dist,
                    y: 50 + Math.sin(angle) * dist
                })
            })
        })
        return hits
    }
    simulatedHits.value.A = generateForSide('A')
    simulatedHits.value.B = generateForSide('B')
}

const scoreHeaderLabel = computed(() => matchData.value?.format === 'recurve_set' ? 'Set Total' : 'Total')
const pointsHeaderLabel = computed(() => matchData.value?.format === 'recurve_set' ? 'Set Pts' : 'Running')

const formatLabel = computed(() => {
    if (!matchData.value) return '-'
    return matchData.value.format === 'recurve_set' ? 'Sistem Set (Recurve)' : 'Akumulasi Skor (Compound)'
})

const sortedEnds = computed(() => {
    if (!ends.value.length) return []
    const endSet = new Set(ends.value.map(e => e.end_no))
    return Array.from(endSet).sort((a, b) => a - b)
})

const maxArrows = computed(() => {
    if (!ends.value.length) return 3
    return Math.max(...ends.value.map(e => (e.arrows || []).length)) || 3
})

const getEndsBySide = (endNo, side) => {
    const end = ends.value.find(e => e.end_no === endNo && e.side === side)
    return end?.arrows || []
}

const getEndTotal = (endNo, side) => {
    const end = ends.value.find(e => e.end_no === endNo && e.side === side)
    return end?.end_total || 0
}

const getSidePoints = (side, endNo) => {
    if (matchData.value?.format !== 'recurve_set') return getEndTotal(endNo, side)
    const otherSide = side === 'A' ? 'B' : 'A'
    const s1 = getEndTotal(endNo, side)
    const s2 = getEndTotal(endNo, otherSide)
    if (s1 > s2) return 2
    if (s1 === s2 && s1 > 0) return 1
    return 0
}

const getRunningScoreDisplay = (endNo) => {
    let ptsA = 0
    let ptsB = 0
    const sorted = sortedEnds.value.filter(e => e <= endNo)

    sorted.forEach(e => {
        ptsA += getSidePoints('A', e)
        ptsB += getSidePoints('B', e)
    })

    return `${ptsA} - ${ptsB}`
}

const getFinalScore = (side) => {
    if (!matchData.value) return 0
    if (matchData.value.format === 'recurve_set') {
        return side === 'A' ? matchData.value.total_points_a : matchData.value.total_points_b
    }
    return side === 'A' ? matchData.value.total_score_a : matchData.value.total_score_b
}

const getAverageScore = (side) => {
    const sideEnds = ends.value.filter(e => e.side === side && e.end_no !== 99)
    if (!sideEnds.length) return '0.0'
    let total = 0
    let count = 0
    sideEnds.forEach(e => {
        (e.arrows || []).forEach(a => {
            if (a === 'X') total += 10
            else if (!isNaN(parseInt(a))) total += parseInt(a)
            count++
        })
    })
    return count > 0 ? (total / count).toFixed(1) : '0.0'
}

const isWinner = (side) => {
    if (!matchData.value?.winner_entry_id) return false
    const id = side === 'A' ? matchData.value.entry_a_id : matchData.value.entry_b_id
    return matchData.value.winner_entry_id === id
}

const getAvatarUrl = (name) => {
    if (!name || name === 'TBD' || name === 'BYE') return `https://ui-avatars.com/api/?name=??&background=f1f5f9&color=94a3b8`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=D9FF00&color=0f172a&bold=true`
}

const formatMatchTime = () => {
    if (!matchData.value?.created_at) return '14:45 WIB'
    const d = new Date(matchData.value.created_at)
    return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
}

const getScoreBadgeClass = (score, isArcherB = false) => {
    if (!score || score === '-') return 'bg-transparent border-transparent text-gray-300'
    const base = 'shadow-sm font-black'
    if (score === 'X' || score === '10' || score === '9') return `${base} bg-[#D9FF00] text-[#0f172a] border-[#D9FF00]/20`
    if (score === '8' || score === '7') return `${base} bg-red-500 text-white border-red-600`
    if (score === '6' || score === '5') return `${base} bg-blue-500 text-white border-blue-600`
    if (score === '4' || score === '3') return `${base} bg-[#111827] text-white border-gray-800`
    return `${base} bg-white text-gray-400 border-gray-200`
}

const handleBack = () => {
    router.back()
}

onMounted(() => {
    fetchMatchData()
})
</script>

<style scoped>
.target-ring {
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.hit-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

@media (max-width: 768px) {
    .hit-dot {
        width: 4px;
        height: 4px;
    }
}
</style>
