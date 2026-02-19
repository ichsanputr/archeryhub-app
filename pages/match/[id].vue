<template>
    <div class="min-h-screen bg-[#f8fafc] text-[#111827] font-sans selection:bg-[#D9FF00] selection:text-[#0f172a]">
        <!-- Main Content (no custom header; uses layout like other pages) -->
        <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 relative z-10">
            <div v-if="isLoading" class="flex-1 min-h-[calc(100vh-6rem)] flex flex-col items-center justify-center">
                <div class="flex items-center gap-2 mb-5">
                    <span class="size-3 rounded-full bg-[#D9FF00] animate-bounce" style="animation-delay: 0ms"></span>
                    <span class="size-3 rounded-full bg-[#D9FF00] animate-bounce" style="animation-delay: 150ms"></span>
                    <span class="size-3 rounded-full bg-[#D9FF00] animate-bounce" style="animation-delay: 300ms"></span>
                </div>
                <p class="text-slate-400 font-bold tracking-widest uppercase text-xs">Memuat data...</p>
            </div>

            <template v-else-if="matchData">
                <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 py-10">
                    <!-- Versus Head-to-Head Section -->
                    <div class="grid grid-cols-1 md:grid-cols-11 items-center gap-3 sm:gap-4 md:gap-6">
                        <!-- Archer A Card -->
                        <div
                            class="md:col-span-4 bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border-l-4 sm:border-l-8 border-[#D9FF00] relative overflow-hidden group">
                            <div class="flex items-center gap-3 sm:gap-4 md:gap-6">
                                <div
                                    class="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-lg sm:rounded-xl bg-gray-100 overflow-hidden relative border border-[#e2e8f0] shrink-0">
                                    <img :src="getAvatarUrl(participantA?.name)"
                                        class="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div
                                        class="absolute top-0.5 left-0.5 bg-[#0f172a] text-[#D9FF00] text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 rounded">
                                        {{ participantA?.seed || '1' }}
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <h2
                                        class="text-sm sm:text-base md:text-2xl font-black text-[#0f172a] uppercase tracking-tight truncate">
                                        {{ participantA?.name || 'TBD' }}</h2>
                                    <p
                                        class="text-[#64748b] font-medium text-[10px] sm:text-xs md:text-sm truncate uppercase">
                                        {{
                                            participantA?.club || 'ARCHER A' }}</p>
                                    <div class="mt-1 sm:mt-2 flex gap-1 items-center">
                                        <span
                                            class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#0f172a] flex items-center justify-center text-[#D9FF00] text-[10px] sm:text-xs font-bold leading-none">
                                            {{ getFinalScore('A') }}
                                        </span>
                                        <span
                                            class="text-[9px] sm:text-[10px] font-bold text-[#0f172a] ml-1 uppercase tracking-widest">{{
                                                matchData.format === 'recurve_set' ? 'Set Pts' : 'Score' }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="isWinner('A')"
                                class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 text-[#D9FF00] bg-[#0f172a] rounded-full p-0.5 sm:p-1 shadow-lg">
                                <Icon icon="ph:crown-fill" class="text-sm sm:text-lg" />
                            </div>
                        </div>

                        <!-- VS Divider -->
                        <div
                            class="md:col-span-3 flex flex-col items-center justify-center py-2 sm:py-4 order-first md:order-none">
                            <div
                                class="text-[8px] sm:text-[10px] font-black text-[#64748b] uppercase tracking-wider sm:tracking-[0.4em] mb-1 sm:mb-2">
                                Elimination Round</div>
                            <div class="text-2xl sm:text-3xl md:text-4xl font-black text-[#e2e8f0]">VS</div>
                            <div
                                class="mt-2 sm:mt-4 px-2 sm:px-4 py-0.5 sm:py-1 bg-[#0f172a] text-[#D9FF00] rounded-full text-[8px] sm:text-[10px] font-black tracking-widest">
                                {{ matchData.status === 'finished' ? 'COMPLETED' : 'ACTIVE MATCH' }}
                            </div>
                        </div>

                        <!-- Archer B Card -->
                        <div
                            class="md:col-span-4 bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-sm border-r-4 sm:border-r-8 border-[#e2e8f0] flex flex-row-reverse items-center justify-between gap-3 sm:gap-4 md:gap-6 group text-right">
                            <div
                                class="w-14 h-14 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-lg sm:rounded-xl bg-gray-100 overflow-hidden relative border border-[#e2e8f0] shrink-0">
                                <img :src="getAvatarUrl(participantB?.name)"
                                    class="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <div
                                    class="absolute top-0.5 right-0.5 bg-[#0f172a] text-white text-[8px] sm:text-[10px] font-bold px-1 sm:px-1.5 rounded">
                                    {{ participantB?.seed || '2' }}
                                </div>
                            </div>
                            <div class="min-w-0 flex-1">
                                <h2
                                    class="text-sm sm:text-base md:text-2xl font-black text-[#0f172a] uppercase tracking-tight truncate text-right">
                                    {{ participantB?.name || 'TBD' }}</h2>
                                <p
                                    class="text-[#64748b] font-medium text-[10px] sm:text-xs md:text-sm truncate uppercase text-right">
                                    {{ participantB?.club || 'ARCHER B' }}</p>
                                <div class="mt-1 sm:mt-2 flex flex-row-reverse gap-1 items-center">
                                    <span
                                        class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gray-200 flex items-center justify-center text-[#0f172a] text-[10px] sm:text-xs font-bold leading-none">
                                        {{ getFinalScore('B') }}
                                    </span>
                                    <span
                                        class="text-[9px] sm:text-[10px] font-bold text-[#64748b] mr-1 uppercase tracking-widest text-right">{{
                                            matchData.format === 'recurve_set' ? 'Set Pts' : 'Score' }}</span>
                                </div>
                            </div>
                            <div v-if="isWinner('B')"
                                class="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 text-[#D9FF00] bg-[#0f172a] rounded-full p-0.5 sm:p-1 shadow-lg">
                                <Icon icon="ph:crown-fill" class="text-sm sm:text-lg" />
                            </div>
                        </div>
                    </div>

                    <!-- Score Breakdown Table -->
                    <div class="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-[#e2e8f0] overflow-hidden">
                        <div class="overflow-x-auto -mx-2 sm:mx-0">
                            <table class="w-full text-center min-w-[640px] sm:min-w-[800px] text-xs sm:text-sm">
                                <thead>
                                    <tr
                                        class="bg-[#0f172a] text-white uppercase text-[9px] sm:text-[10px] tracking-widest font-black">
                                        <th class="py-2 sm:py-4 w-10 sm:w-16">End</th>
                                        <th class="w-32 sm:w-48 text-left px-2 sm:px-6">Archer</th>
                                        <th v-for="i in maxArrows" :key="i" class="w-8 sm:w-16">A{{ i }}</th>
                                        <th class="w-12 sm:w-24">{{ scoreHeaderLabel }}</th>
                                        <th class="w-12 sm:w-24 bg-white/10">{{ pointsHeaderLabel }}</th>
                                        <th class="w-20 sm:w-32 border-l border-white/10">Running</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-[#e2e8f0]">
                                    <template v-for="endNo in sortedEnds" :key="endNo">
                                        <!-- Row for Archer A -->
                                        <tr class="group">
                                            <td class="font-bold text-[#1e293b] bg-[#f8fafc] border-r border-[#e2e8f0] text-[10px] sm:text-xs py-2 sm:py-4"
                                                rowspan="2">
                                                {{ endNo === 99 ? 'SO' : endNo }}
                                            </td>
                                            <td
                                                class="px-2 sm:px-6 py-2 sm:py-4 text-left font-black text-[10px] sm:text-xs md:text-sm bg-[#D9FF00]/5 uppercase border-l-4 border-[#D9FF00]">
                                                {{ participantA?.name || 'ARCHER A' }}
                                            </td>

                                            <!-- Archer A Arrows -->
                                            <td v-for="i in maxArrows" :key="'a-' + i" class="font-bold">
                                                <div class="inline-flex size-6 sm:size-8 md:size-9 rounded-md sm:rounded-lg items-center justify-center border transition-all text-[10px] sm:text-xs"
                                                    :class="getScoreBadgeClass(getEndsBySide(endNo, 'A')[i - 1])">
                                                    {{ getEndsBySide(endNo, 'A')[i - 1] || '-' }}
                                                </div>
                                            </td>

                                            <td class="font-black text-[#0f172a] text-sm sm:text-base md:text-lg">{{
                                                getEndTotal(endNo, 'A')
                                                }}</td>
                                            <td class="font-black text-[#0f172a] bg-slate-50 text-xs sm:text-sm">{{
                                                getSidePoints('A',
                                                endNo) }}</td>
                                            <td class="border-l border-[#e2e8f0] font-black text-sm sm:text-base md:text-xl bg-[#f8fafc]/50"
                                                rowspan="2">
                                                {{ getRunningScoreDisplay(endNo) }}
                                            </td>
                                        </tr>
                                        <!-- Row for Archer B -->
                                        <tr class="text-[#64748b]">
                                            <td
                                                class="px-2 sm:px-6 py-2 sm:py-4 text-left font-bold text-[10px] sm:text-xs md:text-sm border-l-4 border-transparent uppercase">
                                                {{ participantB?.name || 'ARCHER B' }}
                                            </td>
                                            <!-- Archer B Arrows -->
                                            <td v-for="i in maxArrows" :key="'b-' + i" class="font-medium">
                                                <div class="inline-flex size-6 sm:size-8 md:size-9 rounded-md sm:rounded-lg items-center justify-center border border-transparent text-[10px] sm:text-xs"
                                                    :class="getScoreBadgeClass(getEndsBySide(endNo, 'B')[i - 1], true)">
                                                    {{ getEndsBySide(endNo, 'B')[i - 1] || '-' }}
                                                </div>
                                            </td>
                                            <td class="font-bold text-[#0f172a] text-sm sm:text-base">{{
                                                getEndTotal(endNo, 'B') }}</td>
                                            <td class="font-bold text-[#111827] text-xs sm:text-sm">{{
                                                getSidePoints('B', endNo) }}
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
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
