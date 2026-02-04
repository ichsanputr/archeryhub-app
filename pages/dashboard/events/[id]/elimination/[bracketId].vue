<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>

        <template v-else-if="bracket">
            <!-- BRACKET VIEW MODE (no round query) -->
            <template v-if="!selectedRound">
                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-4">
                        <button @click="navigateTo(`/dashboard/events/${eventId}/elimination`)"
                            class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                            <Icon icon="ph:arrow-left" class="text-xl text-gray-600" />
                        </button>
                        <div>
                            <h1 class="text-2xl font-black text-navy">Bracket Eliminasi</h1>
                            <p class="text-sm text-gray-500">{{ categoryName }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="px-3 py-1.5 rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                            {{ getFormatLabel(bracket.format) }}
                        </span>
                    </div>
                </div>

            <!-- Bracket Visualization -->
            <div class="bracket-visualization rounded-2xl shadow-sm overflow-hidden">
                <div class="bracket-scroll-container no-scrollbar">
                    <div v-if="Object.keys(rounds).length > 0" class="flex gap-0 min-w-max">
                        <!-- Each Round -->
                        <template v-for="(roundMatches, roundNo) in sortedRounds" :key="roundNo">
                            <div class="bracket-round">
                                <NuxtLink
                                    :to="`/dashboard/events/${eventId}/elimination/${bracketId}?round=${roundNo}`"
                                    class="round-label hover:bg-primary/10 cursor-pointer transition-colors"
                                    :class="{ 'final-label': isLastRound(parseInt(roundNo)) }">
                                    <Icon v-if="isLastRound(parseInt(roundNo))" icon="ph:crown-simple-fill"
                                        class="text-primary mr-2" />
                                    {{ getRoundName(parseInt(roundNo)) }}
                                    <Icon icon="ph:arrow-right" class="ml-2 text-sm opacity-50" />
                                </NuxtLink>
                                <div class="slots-container" :style="{ height: getTotalHeight + 'px' }">
                                    <div v-for="(match, idx) in roundMatches" :key="match.id" class="match-slot"
                                        :style="{ height: getSlotHeight(parseInt(roundNo)) + 'px' }">
                                        <!-- Match Card -->
                                        <div class="match-node-card" :class="{
                                            'is-final': isLastRound(parseInt(roundNo)),
                                            'completed': match.status === 'finished',
                                            'selected': selectedMatch?.id === match.id
                                        }" @click="selectMatch(match)">
                                            <div class="match-card-header">
                                                <div v-if="match.status === 'finished'" class="status-badge">Selesai
                                                </div>
                                                <div v-else-if="match.status === 'running'"
                                                    class="status-badge running">Berlangsung</div>
                                                <div v-else class="status-badge waiting">Menunggu</div>
                                                <span class="match-meta">Match {{ match.match_no }}</span>
                                            </div>
                                            <!-- Side A -->
                                            <div class="archer-item" :class="{
                                                'is-winner': match.winner_entry_id === match.entry_a_id,
                                                'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_a_id
                                            }">
                                                <span class="seed-badge">{{ match.entry_a_seed || '-' }}</span>
                                                <span class="archer-name">{{ match.entry_a_name || (match.is_bye ? 'BYE'
                                                    : 'TBD') }}</span>
                                                <span class="score-display">{{ getMatchScore(match, 'A') }}</span>
                                            </div>
                                            <!-- Side B -->
                                            <div class="archer-item" :class="{
                                                'is-winner': match.winner_entry_id === match.entry_b_id,
                                                'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_b_id
                                            }">
                                                <span class="seed-badge">{{ match.entry_b_seed || '-' }}</span>
                                                <span class="archer-name">{{ match.entry_b_name || 'TBD' }}</span>
                                                <span class="score-display">{{ getMatchScore(match, 'B') }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Connector lines between rounds -->
                            <div v-if="!isLastRound(parseInt(roundNo))" class="connector-space"
                                :style="{ height: getTotalHeight + 'px' }">
                                <svg class="bracket-svg" :viewBox="`0 0 60 ${getTotalHeight}`"
                                    preserveAspectRatio="none">
                                    <path v-for="i in getMatchesInRound(parseInt(roundNo)) / 2" :key="i"
                                        class="connector-line" :d="calculateConnectorPath(i, parseInt(roundNo))" />
                                </svg>
                            </div>
                        </template>
                    </div>

                    <div v-else class="text-center py-20 text-gray-500">
                        <Icon icon="ph:brackets-curly" class="text-6xl mb-4 opacity-50" />
                        <p class="font-medium text-lg">Bracket belum di-generate</p>
                        <p class="text-sm">Generate bracket untuk melihat struktur pertandingan</p>
                    </div>
                </div>
            </div>

            <!-- Match Scoring Panel -->
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-4"
                enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-4">
                <div v-if="selectedMatch"
                    class="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                    <div class="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 class="font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:pencil-simple" class="text-primary" />
                            Input Skor Pertandingan
                        </h3>
                        <button @click="selectedMatch = null" class="text-gray-400 hover:text-gray-600">
                            <Icon icon="ph:x" class="text-xl" />
                        </button>
                    </div>

                    <div class="p-6">
                        <!-- Participant Names -->
                        <div class="grid grid-cols-3 gap-4 mb-6">
                            <div class="text-center p-3 bg-blue-50 rounded-xl">
                                <p class="text-[10px] font-black text-blue-400 uppercase mb-1">Seed {{
                                    selectedMatch.entry_a_seed }}</p>
                                <p class="font-bold text-navy">{{ selectedMatch.entry_a_name || 'TBD' }}</p>
                            </div>
                            <div class="flex items-center justify-center">
                                <span class="text-2xl font-black text-gray-300">VS</span>
                            </div>
                            <div class="text-center p-3 bg-red-50 rounded-xl">
                                <p class="text-[10px] font-black text-red-400 uppercase mb-1">Seed {{
                                    selectedMatch.entry_b_seed }}</p>
                                <p class="font-bold text-navy">{{ selectedMatch.entry_b_name || 'TBD' }}</p>
                            </div>
                        </div>

                        <!-- Score Input -->
                        <div v-if="bracket.format === 'recurve_set'" class="space-y-4">
                            <p class="text-xs font-bold text-gray-500 uppercase mb-3">Set Scores (per end)</p>
                            <div v-for="endNo in 5" :key="endNo" class="grid grid-cols-3 gap-4 items-center">
                                <input v-model.number="scoreInputs[endNo - 1].scoreA" type="number" min="0" max="30"
                                    class="w-full px-4 py-2 text-center font-bold text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                                    placeholder="0" />
                                <div class="text-center text-sm font-bold text-gray-400">End {{ endNo }}</div>
                                <input v-model.number="scoreInputs[endNo - 1].scoreB" type="number" min="0" max="30"
                                    class="w-full px-4 py-2 text-center font-bold text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                                    placeholder="0" />
                            </div>

                            <!-- Set Points Display -->
                            <div class="grid grid-cols-3 gap-4 p-4 bg-navy rounded-xl mt-6">
                                <div class="text-center">
                                    <p class="text-3xl font-black text-white">{{ calculateSetPointsA }}</p>
                                    <p class="text-[10px] font-bold text-primary uppercase">Set Points</p>
                                </div>
                                <div class="flex items-center justify-center">
                                    <span class="text-white/50 text-lg">-</span>
                                </div>
                                <div class="text-center">
                                    <p class="text-3xl font-black text-white">{{ calculateSetPointsB }}</p>
                                    <p class="text-[10px] font-bold text-primary uppercase">Set Points</p>
                                </div>
                            </div>
                        </div>

                        <div v-else class="space-y-4">
                            <p class="text-xs font-bold text-gray-500 uppercase mb-3">Total Score (per end)</p>
                            <div v-for="endNo in 5" :key="endNo" class="grid grid-cols-3 gap-4 items-center">
                                <input v-model.number="scoreInputs[endNo - 1].scoreA" type="number" min="0" max="60"
                                    class="w-full px-4 py-2 text-center font-bold text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                                    placeholder="0" />
                                <div class="text-center text-sm font-bold text-gray-400">End {{ endNo }}</div>
                                <input v-model.number="scoreInputs[endNo - 1].scoreB" type="number" min="0" max="60"
                                    class="w-full px-4 py-2 text-center font-bold text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary"
                                    placeholder="0" />
                            </div>

                            <!-- Total Display -->
                            <div class="grid grid-cols-3 gap-4 p-4 bg-navy rounded-xl mt-6">
                                <div class="text-center">
                                    <p class="text-3xl font-black text-white">{{ totalScoreA }}</p>
                                    <p class="text-[10px] font-bold text-primary uppercase">Total</p>
                                </div>
                                <div class="flex items-center justify-center">
                                    <span class="text-white/50 text-lg">-</span>
                                </div>
                                <div class="text-center">
                                    <p class="text-3xl font-black text-white">{{ totalScoreB }}</p>
                                    <p class="text-[10px] font-bold text-primary uppercase">Total</p>
                                </div>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-3 mt-6">
                            <BaseButton variant="outline" class="flex-1" @click="saveScores" :disabled="isSaving">
                                {{ isSaving ? 'Menyimpan...' : 'Simpan Skor' }}
                            </BaseButton>
                            <BaseButton variant="primary" class="flex-1" @click="finishMatch" :disabled="!canFinish">
                                Selesaikan Match
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </Transition>
            </template>

            <!-- ROUND MANAGEMENT MODE (when round query exists) -->
            <template v-else>
                <!-- Header -->
                <div class="flex items-center gap-4 mb-6">
                    <button @click="navigateTo(`/dashboard/events/${eventId}/elimination/${bracketId}`)"
                        class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Icon icon="ph:arrow-left" class="text-xl text-gray-600" />
                    </button>
                    <div class="flex-1">
                        <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">
                            {{ getRoundName(selectedRound) }} - {{ categoryName }}
                        </h1>
                        <div class="flex items-center gap-4 text-sm text-gray-600 mt-2">
                            <span class="font-mono font-semibold">{{ bracket.format === 'recurve_set' ? 'Set System' : 'Total Score' }}</span>
                            <span class="text-gray-300">•</span>
                            <div class="flex items-center gap-1.5">
                                <Icon icon="ph:sword" class="text-base" />
                                <span><strong>{{ roundMatches.length }}</strong> Matches</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <div class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white rounded-t-2xl px-2">
                    <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
                        class="px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap"
                        :class="activeTab === t.id ? 'text-navy border-navy bg-gray-50' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
                        <Icon :icon="t.icon" class="text-xl" />
                        {{ t.label }}
                    </button>
                </div>

                <!-- TARGET MODE -->
                <div v-if="activeTab === 'target'" class="space-y-6">
                    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <div>
                                <h2 class="text-lg font-bold text-navy">Alokasi Target per Match</h2>
                                <p class="text-sm text-gray-500 mt-1">Tentukan target untuk setiap pertandingan di round ini</p>
                            </div>
                            <BaseButton variant="primary" icon="ph:shuffle" @click="autoAssignTargets">
                                Auto Assign
                            </BaseButton>
                        </div>

                        <!-- Match Target List -->
                        <div class="space-y-3">
                            <div v-for="match in roundMatches" :key="match.id"
                                class="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-primary/50 transition-colors">
                                <div class="flex-1">
                                    <p class="font-bold text-navy mb-1">Match {{ match.match_no }}</p>
                                    <div class="flex items-center gap-3 text-sm text-gray-600">
                                        <span>{{ match.entry_a_name || 'TBD' }}</span>
                                        <span class="text-gray-300">vs</span>
                                        <span>{{ match.entry_b_name || 'TBD' }}</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <label class="text-sm font-bold text-gray-600">Target:</label>
                                    <input 
                                        v-model="matchTargets[match.id]"
                                        type="text"
                                        placeholder="A1"
                                        class="w-20 px-3 py-2 text-center font-bold border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end">
                            <BaseButton variant="primary" @click="saveTargetAssignments" :disabled="savingTargets">
                                {{ savingTargets ? 'Menyimpan...' : 'Simpan Target' }}
                            </BaseButton>
                        </div>
                    </div>
                </div>

                <!-- SCORING MODE -->
                <div v-if="activeTab === 'scoring'" class="space-y-6">
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div class="p-5 border-b border-gray-100 bg-gray-50/50">
                            <h2 class="text-lg font-bold text-navy">Input Skor Pertandingan</h2>
                            <p class="text-sm text-gray-500 mt-1">Klik pertandingan untuk input skor</p>
                        </div>

                        <div class="divide-y divide-gray-100">
                            <div v-for="match in roundMatches" :key="match.id"
                                @click="selectMatch(match)"
                                class="p-5 hover:bg-gray-50 cursor-pointer transition-colors">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center gap-4">
                                        <div class="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center">
                                            <span class="font-black text-navy">{{ match.match_no }}</span>
                                        </div>
                                        <div>
                                            <p class="font-bold text-navy mb-1">Match {{ match.match_no }}</p>
                                            <div class="flex items-center gap-3 text-sm">
                                                <span class="text-gray-600">{{ match.entry_a_name || 'TBD' }}</span>
                                                <span class="text-gray-400">vs</span>
                                                <span class="text-gray-600">{{ match.entry_b_name || 'TBD' }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-4">
                                        <div v-if="match.status === 'finished'" class="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold">
                                            Selesai
                                        </div>
                                        <div v-else-if="match.status === 'running'" class="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                                            Berlangsung
                                        </div>
                                        <div v-else class="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold">
                                            Menunggu
                                        </div>
                                        <Icon icon="ph:arrow-right" class="text-xl text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </template>

        <!-- Not Found -->
        <div v-else class="text-center py-20">
            <Icon icon="ph:warning" class="text-6xl text-gray-300 mb-4" />
            <p class="text-gray-500 font-medium">Bracket tidak ditemukan</p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Detail Bracket - Dashboard'
})

const route = useRoute()
const router = useRouter()
const eventId = route.params.id
const bracketId = route.params.bracketId
const selectedRound = computed(() => route.query.round ? parseInt(route.query.round) : null)
const { get, post } = useApi()
const toast = useToast()

const activeTab = ref('target')
const tabs = [
    { id: 'target', label: 'Target', icon: 'ph:target' },
    { id: 'scoring', label: 'Scoring', icon: 'ph:pencil-simple' }
]

const isLoading = ref(true)
const isSaving = ref(false)
const bracket = ref(null)
const entries = ref([])
const matches = ref([])
const rounds = ref({})
const selectedMatch = ref(null)
const categoryName = ref('')
const matchTargets = ref({})
const savingTargets = ref(false)

// Score inputs for 5 ends
const scoreInputs = ref([
    { scoreA: 0, scoreB: 0 },
    { scoreA: 0, scoreB: 0 },
    { scoreA: 0, scoreB: 0 },
    { scoreA: 0, scoreB: 0 },
    { scoreA: 0, scoreB: 0 }
])

const totalScoreA = computed(() => scoreInputs.value.reduce((sum, s) => sum + (s.scoreA || 0), 0))
const totalScoreB = computed(() => scoreInputs.value.reduce((sum, s) => sum + (s.scoreB || 0), 0))

const calculateSetPointsA = computed(() => {
    let points = 0
    scoreInputs.value.forEach(s => {
        if (s.scoreA > s.scoreB) points += 2
        else if (s.scoreA === s.scoreB && s.scoreA > 0) points += 1
    })
    return points
})

const calculateSetPointsB = computed(() => {
    let points = 0
    scoreInputs.value.forEach(s => {
        if (s.scoreB > s.scoreA) points += 2
        else if (s.scoreA === s.scoreB && s.scoreB > 0) points += 1
    })
    return points
})

const canFinish = computed(() => {
    if (!selectedMatch.value) return false
    if (bracket.value?.format === 'recurve_set') {
        return calculateSetPointsA.value >= 6 || calculateSetPointsB.value >= 6
    } else {
        return totalScoreA.value !== totalScoreB.value && (totalScoreA.value > 0 || totalScoreB.value > 0)
    }
})

const roundMatches = computed(() => {
    if (!selectedRound.value || !matches.value) return []
    return matches.value.filter(m => m.round_no === selectedRound.value)
})

const autoAssignTargets = () => {
    const targetLetters = ['A', 'B', 'C', 'D', 'E', 'F']
    roundMatches.value.forEach((match, index) => {
        const letter = targetLetters[index % targetLetters.length]
        const number = Math.floor(index / targetLetters.length) + 1
        matchTargets.value[match.id] = `${letter}${number}`
    })
    toast.success('Target berhasil di-assign otomatis')
}

const saveTargetAssignments = async () => {
    savingTargets.value = true
    try {
        // Here you would save to API
        // For now just show success
        toast.success('Target berhasil disimpan')
    } catch (error) {
        console.error('Failed to save targets:', error)
        toast.error('Gagal menyimpan target')
    } finally {
        savingTargets.value = false
    }
}

const fetchBracket = async () => {
    isLoading.value = true
    try {
        const response = await get(`/events/${eventId}/elimination/brackets/${bracketId}`)
        bracket.value = response?.bracket || null
        entries.value = response?.entries || []
        matches.value = response?.matches || []
        rounds.value = response?.rounds || {}

        // Get category name from first match or entries
        if (entries.value.length > 0) {
            categoryName.value = `${entries.value.length} Peserta`
        }
    } catch (error) {
        console.error('Failed to fetch bracket:', error)
        toast.error('Gagal memuat bracket')
    } finally {
        isLoading.value = false
    }
}

const selectMatch = (match) => {
    if (match.status === 'finished') {
        toast.info('Match sudah selesai')
        return
    }
    if (!match.entry_a_id || !match.entry_b_id) {
        toast.info('Peserta belum lengkap')
        return
    }
    selectedMatch.value = match
    // Reset score inputs
    scoreInputs.value = [
        { scoreA: 0, scoreB: 0 },
        { scoreA: 0, scoreB: 0 },
        { scoreA: 0, scoreB: 0 },
        { scoreA: 0, scoreB: 0 },
        { scoreA: 0, scoreB: 0 }
    ]
}

const saveScores = async () => {
    if (!selectedMatch.value) return

    isSaving.value = true
    try {
        for (let i = 0; i < scoreInputs.value.length; i++) {
            const input = scoreInputs.value[i]
            if (input.scoreA > 0 || input.scoreB > 0) {
                await post(`/elimination/matches/${selectedMatch.value.id}/score`, {
                    end_no: i + 1,
                    score_a: input.scoreA,
                    score_b: input.scoreB
                })
            }
        }
        toast.success('Skor berhasil disimpan')
        await fetchBracket()
    } catch (error) {
        console.error('Failed to save scores:', error)
        toast.error('Gagal menyimpan skor')
    } finally {
        isSaving.value = false
    }
}

const finishMatch = async () => {
    if (!selectedMatch.value || !canFinish.value) return

    // Determine winner
    let winnerId
    if (bracket.value?.format === 'recurve_set') {
        winnerId = calculateSetPointsA.value >= 6 ? selectedMatch.value.entry_a_id : selectedMatch.value.entry_b_id
    } else {
        winnerId = totalScoreA.value > totalScoreB.value ? selectedMatch.value.entry_a_id : selectedMatch.value.entry_b_id
    }

    try {
        await post(`/elimination/matches/${selectedMatch.value.id}/finish`, {
            winner_entry_id: winnerId
        })
        toast.success('Match selesai!')
        selectedMatch.value = null
        await fetchBracket()
    } catch (error) {
        console.error('Failed to finish match:', error)
        toast.error('Gagal menyelesaikan match')
    }
}

const getMatchScore = (match, side) => {
    // This would need to be fetched from match ends data
    // For now just show status indicator
    if (match.status === 'finished') {
        return match.winner_entry_id === (side === 'A' ? match.entry_a_id : match.entry_b_id) ? 'W' : 'L'
    }
    return '-'
}

// Bracket visualization helpers
const BASE_MATCH_HEIGHT = 120

const sortedRounds = computed(() => {
    const roundKeys = Object.keys(rounds.value).sort((a, b) => parseInt(a) - parseInt(b))
    const sorted = {}
    roundKeys.forEach(key => {
        sorted[key] = rounds.value[key]
    })
    return sorted
})

const getTotalRounds = computed(() => {
    return Object.keys(rounds.value).length
})

const getTotalHeight = computed(() => {
    const size = bracket.value?.bracket_size || 16
    return size / 2 * BASE_MATCH_HEIGHT
})

const getSlotHeight = (roundNo) => {
    const size = bracket.value?.bracket_size || 16
    const firstRoundMatches = size / 2
    const matchesInRound = firstRoundMatches / Math.pow(2, roundNo - 1)
    return getTotalHeight.value / matchesInRound
}

const getMatchesInRound = (roundNo) => {
    const size = bracket.value?.bracket_size || 16
    const firstRoundMatches = size / 2
    return firstRoundMatches / Math.pow(2, roundNo - 1)
}

const isLastRound = (roundNo) => {
    return roundNo === getTotalRounds.value
}

const calculateConnectorPath = (i, roundNo) => {
    const slotHeight = getSlotHeight(roundNo)
    const nextSlotHeight = getSlotHeight(roundNo + 1)
    const y1 = (i - 1) * nextSlotHeight + slotHeight / 2
    const y2 = (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight
    const targetY = (i - 1) * nextSlotHeight + nextSlotHeight / 2
    return `M 0 ${y1} H 30 V ${targetY} H 60 M 0 ${y2} H 30 V ${targetY} H 60`
}

const getRoundName = (roundNo) => {
    const size = bracket.value?.bracket_size || 16
    const totalRounds = Math.log2(size)
    const roundFromEnd = totalRounds - roundNo + 1

    if (roundFromEnd === 1) return 'Final'
    if (roundFromEnd === 2) return 'Semifinal'
    if (roundFromEnd === 3) return 'Quarterfinal'
    return `Round of ${Math.pow(2, roundFromEnd)}`
}

const getStatusBadgeClass = (status) => {
    const classes = {
        draft: 'bg-gray-100 text-gray-600',
        generated: 'bg-blue-100 text-blue-700',
        running: 'bg-green-100 text-green-700',
        closed: 'bg-gray-200 text-gray-700'
    }
    return classes[status] || classes.draft
}

const getStatusLabel = (status) => {
    const labels = {
        draft: 'Draft',
        generated: 'Siap',
        running: 'Berlangsung',
        closed: 'Selesai'
    }
    return labels[status] || status
}

const getFormatLabel = (format) => {
    const labels = {
        recurve_set: 'Set System',
        compound_total: 'Total Score'
    }
    return labels[format] || format
}

onMounted(fetchBracket)
</script>

<style scoped>
.bracket-visualization {
    @apply bg-slate-50/50 relative border border-gray-100;
    /* Premium Blueprint Grid Pattern */
    background-image:
        linear-gradient(#e2e8f0 1px, transparent 1px),
        linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
}

.bracket-visualization::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-slate-200/20 pointer-events-none;
}

.bracket-scroll-container {
    @apply overflow-x-auto p-12 relative z-10;
}

.bracket-round {
    @apply flex flex-col items-center min-w-[280px];
}

.round-label {
    @apply text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-2 px-6 bg-white rounded-full shadow-sm border border-gray-100 shrink-0 flex items-center justify-center mb-8;
    height: 32px;
}

.final-label {
    @apply bg-navy text-primary border-none shadow-lg shadow-navy/20;
}

.slots-container {
    @apply flex flex-col w-full;
}

.match-slot {
    @apply flex items-center justify-center w-full;
}

/* Match Node Card */
.match-node-card {
    @apply relative w-[240px] bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden;
    height: 104px;
}

.match-node-card:hover {
    @apply shadow-xl border-primary/40 -translate-y-1;
}

.match-node-card.selected {
    @apply ring-4 ring-primary/20 border-primary shadow-2xl;
}

.match-node-card.completed {
    @apply border-l-4 border-l-green-500;
}

.match-node-card.is-final {
    @apply w-[260px] border-2 border-primary/30 shadow-lg shadow-primary/5;
    height: 112px;
}

.match-card-header {
    @apply flex justify-between items-center px-4 py-1.5 bg-slate-50 border-b border-gray-50;
}

.status-badge {
    @apply text-[8px] font-black uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md;
}

.status-badge.running {
    @apply bg-green-100 text-green-700;
}

.status-badge.waiting {
    @apply bg-amber-100 text-amber-700;
}

.match-meta {
    @apply text-[9px] font-bold text-gray-400;
}

.archer-item {
    @apply flex items-center gap-2 px-4 py-1.5 transition-colors relative;
}

.archer-item.is-winner {
    @apply bg-primary/5;
}

.archer-item.is-loser {
    @apply opacity-50 grayscale-[0.3];
}

.seed-badge {
    @apply w-5 h-5 rounded-md bg-navy/5 text-[9px] font-black text-navy/40 flex items-center justify-center;
}

.archer-name {
    @apply flex-1 text-[11px] font-black text-navy truncate;
}

.score-display {
    @apply text-sm font-black text-navy tabular-nums min-w-[20px] text-right;
}

.is-winner .score-display {
    @apply text-primary text-base;
}

/* Connectors */
.connector-space {
    @apply w-[60px] relative shrink-0;
    margin-top: 40px;
    /* Offset to align with slots-container */
}

.bracket-svg {
    @apply w-full h-full;
}

.connector-line {
    @apply fill-none stroke-gray-300 stroke-[2.5px] transition-all duration-300;
}

.bracket-round:hover+.connector-space .connector-line {
    @apply stroke-gray-400;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
