<template>
    <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>

        <template v-else>
            <!-- Category Selector -->
            <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 class="text-base font-bold text-navy mb-4">Pilih Kategori Lomba</h2>

                <div v-if="categories.length === 0" class="text-center py-8 text-gray-400">
                    <div class="flex flex-col items-center">
                        <Icon icon="ph:folder-notch-open" class="text-4xl mb-2" />
                        <p>Kategori tidak ditemukan</p>
                    </div>
                </div>

                <div v-if="categories.length > 0" class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                    <button v-for="category in categories" :key="category.uuid" @click="selectCategory(category.uuid)"
                        :class="[
                            'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
                            selectedCategory === category.uuid
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                        ]">
                        <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors"
                            :class="selectedCategory === category.uuid ? 'bg-primary' : 'bg-transparent'"></div>
                        <div class="flex items-start gap-3 pl-2">
                            <div
                                class="size-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2 group-hover:bg-primary transition-colors">
                                <img :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                                    :alt="category.division_name"
                                    class="w-full h-full object-contain invert group-hover:invert-0 transition-all" />
                            </div>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="font-bold text-navy group-hover:text-primary transition-colors leading-tight mb-1.5 line-clamp-2">
                                    {{ category.category_name }}</p>
                                <div class="flex items-center gap-2 text-xs text-gray-500">
                                    <Icon icon="ph:users-three" class="text-base" />
                                    <span class="font-semibold">{{ category.participant_count || 0 }} pemanah</span>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>

            <!-- Elimination Results (Bracket Style) -->
            <div v-if="selectedCategory" class="space-y-6">
                <div v-if="eliminationLoading"
                    class="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <div
                        class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto">
                    </div>
                </div>

                <div v-else-if="currentElimBracket"
                    class="bracket-visualization rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm">
                    <!-- Bracket Header -->
                    <div class="bg-gradient-to-r from-navy to-navy-light p-6 border-b border-gray-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-xl font-black text-white flex items-center gap-2">
                                    <Icon icon="ph:trophy" class="text-primary" />
                                    Elimination Bracket - {{ currentCategoryName }}
                                </h3>
                            </div>
                            <span class="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-bold">
                                {{ currentElimBracket.format === 'recurve_set' ? 'Set System' : 'Total Score' }}
                            </span>
                        </div>
                    </div>

                    <!-- Bracket Scroll Container -->
                    <div class="bracket-scroll-container no-scrollbar p-8">
                        <div v-if="sortedElimRounds.length > 0" class="flex gap-0 min-w-max">
                            <!-- Each Round -->
                            <template v-for="(roundMatches, roundNo) in sortedElimRounds" :key="roundNo">
                                <div class="bracket-round">
                                    <div class="round-label" :class="{ 'final-label': isLastRound(parseInt(roundNo)) }">
                                        <Icon v-if="isLastRound(parseInt(roundNo))" icon="ph:crown-simple-fill"
                                            class="text-primary mr-2" />
                                        {{ getRoundName(parseInt(roundNo), currentElimBracket.bracket_size) }}
                                    </div>
                                    <div class="slots-container"
                                        :style="{ height: getTotalHeight(currentElimBracket.bracket_size) + 'px' }">
                                        <div v-for="match in roundMatches" :key="match.uuid" class="match-slot"
                                            :style="{ height: getSlotHeight(parseInt(roundNo), currentElimBracket.bracket_size) + 'px' }">
                                            <!-- Match Card -->
                                            <div class="match-node-card" :class="{
                                                'is-final': isLastRound(parseInt(roundNo)),
                                                'completed': match.status === 'finished'
                                            }">
                                                <div class="match-card-header">
                                                    <div v-if="match.status === 'finished'"
                                                        class="status-badge finished">Selesai</div>
                                                    <div v-else-if="match.is_bye" class="status-badge bye">BYE</div>
                                                    <div v-else class="status-badge waiting">Menunggu</div>
                                                    <span class="match-meta">M{{ match.match_no }}</span>
                                                </div>
                                                <!-- Side A -->
                                                <div class="archer-item" :class="{
                                                    'is-winner': match.winner_entry_uuid === match.entry_a_uuid,
                                                    'is-loser': match.winner_entry_uuid && match.winner_entry_uuid !== match.entry_a_uuid
                                                }">
                                                    <div class="avatar-wrapper">
                                                        <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.entry_a_name}`"
                                                            alt="avatar" class="avatar-img" />
                                                    </div>
                                                    <div class="archer-info">
                                                        <span class="seed-badge">{{ match.entry_a_seed || '-' }}</span>
                                                        <span class="archer-name">{{ match.entry_a_name || 'TBD'
                                                            }}</span>
                                                    </div>
                                                    <span class="score-display">{{ getMatchScore(match, 'A',
                                                        currentElimBracket.format) }}</span>
                                                </div>
                                                <!-- Side B -->
                                                <div class="archer-item" :class="{
                                                    'is-winner': match.winner_entry_uuid === match.entry_b_uuid,
                                                    'is-loser': match.winner_entry_uuid && match.winner_entry_uuid !== match.entry_b_uuid
                                                }">
                                                    <div class="avatar-wrapper">
                                                        <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${match.entry_b_name}`"
                                                            alt="avatar" class="avatar-img" />
                                                    </div>
                                                    <div class="archer-info">
                                                        <span class="seed-badge">{{ match.entry_b_seed || '-' }}</span>
                                                        <span class="archer-name">{{ match.entry_b_name || 'TBD'
                                                            }}</span>
                                                    </div>
                                                    <span class="score-display">{{ getMatchScore(match, 'B',
                                                        currentElimBracket.format) }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Connector lines between rounds -->
                                <div v-if="!isLastRound(parseInt(roundNo))" class="connector-space"
                                    :style="{ height: getTotalHeight(currentElimBracket.bracket_size) + 'px' }">
                                    <svg class="bracket-svg"
                                        :viewBox="`0 0 60 ${getTotalHeight(currentElimBracket.bracket_size)}`"
                                        preserveAspectRatio="none">
                                        <path
                                            v-for="i in getMatchesInRound(parseInt(roundNo), currentElimBracket.bracket_size) / 2"
                                            :key="i" class="connector-line"
                                            :d="calculateConnectorPath(i, parseInt(roundNo), currentElimBracket.bracket_size)" />
                                    </svg>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>

                <!-- Qualification Results Below -->
                <div v-if="selectedCategory"
                    class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div v-if="qualificationLoading" class="p-12 text-center">
                        <div
                            class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto">
                        </div>
                    </div>

                    <div v-else-if="!currentQualResults || currentQualResults.length === 0" class="p-12 text-center">
                        <div class="flex flex-col items-center">
                            <Icon icon="ph:clipboard-text" class="text-6xl text-gray-300 mb-4" />
                            <p class="text-gray-500 font-medium">Hasil kualifikasi belum tersedia</p>
                        </div>
                    </div>

                    <template v-else>
                        <!-- Category Header -->
                        <div class="bg-gradient-to-r from-navy to-navy-light p-6">
                            <h3 class="text-xl font-black text-white flex items-center gap-2">
                                <Icon icon="ph:target" class="text-primary" />
                                Kualifikasi Rangking - {{ currentCategoryName }}
                            </h3>
                        </div>

                        <!-- Detailed Scores Table -->
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead class="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th rowspan="2"
                                            class="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                                            Rank
                                        </th>
                                        <th rowspan="2"
                                            class="px-4 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider min-w-[200px]">
                                            Atlet
                                        </th>
                                        <th rowspan="2"
                                            class="px-4 py-3 text-center text-xs font-black text-gray-500 uppercase tracking-wider">
                                            Klub
                                        </th>
                                        <th :colspan="totalEnds"
                                            class="px-4 py-2 text-center text-xs font-black text-gray-500 uppercase tracking-wider border-b border-gray-300">
                                            Skor Per End
                                        </th>
                                        <th rowspan="2"
                                            class="px-4 py-3 text-center text-xs font-black text-navy uppercase tracking-wider bg-navy/5 border-l-2 border-navy/20">
                                            Total
                                        </th>
                                        <th rowspan="2"
                                            class="px-4 py-3 text-center text-xs font-black text-gray-500 uppercase tracking-wider">
                                            10+X
                                        </th>
                                        <th rowspan="2"
                                            class="px-4 py-3 text-center text-xs font-black text-gray-500 uppercase tracking-wider">
                                            X
                                        </th>
                                    </tr>
                                    <tr>
                                        <th v-for="i in totalEnds" :key="i"
                                            class="px-2 py-2 text-center text-xs font-bold text-gray-400 border-x border-gray-200">
                                            {{ i }}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <template v-for="result in currentQualResultsWithSessions"
                                        :key="result.participant_id">
                                        <tr v-for="(session, sIdx) in result.processedSessions"
                                            :key="session.session_code" class="hover:bg-gray-50 transition-colors">
                                            <td v-if="sIdx === 0" :rowspan="result.processedSessions.length"
                                                class="px-4 py-4 whitespace-nowrap sticky text-center left-0 bg-white z-10 border-r border-gray-100">
                                                <div class="flex items-center justify-center gap-2">
                                                    <div v-if="result.rank <= 3" class="text-2xl">
                                                        {{ result.rank === 1 ? '🥇' : result.rank === 2 ? '🥈' : '🥉' }}
                                                    </div>
                                                    <div v-else class="text-sm font-black text-navy text-center">{{
                                                        result.rank }}</div>
                                                </div>
                                            </td>
                                            <td v-if="sIdx === 0" :rowspan="result.processedSessions.length"
                                                class="px-4 py-4">
                                                <div class="flex items-center gap-3">
                                                    <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${result.archer_name}`"
                                                        class="size-8 rounded-full border-2 border-gray-200" />
                                                    <span class="text-sm font-bold text-navy">{{ result.archer_name
                                                        }}</span>
                                                </div>
                                            </td>
                                            <td v-if="sIdx === 0" :rowspan="result.processedSessions.length"
                                                class="px-4 py-4 text-center text-sm text-gray-600">
                                                {{ result.club_name || '-' }}
                                            </td>
                                            <td v-for="i in totalEnds" :key="i"
                                                class="px-2 py-4 text-center text-sm font-bold border-x border-gray-100"
                                                :class="getEndScoreClass(session.scores[i - 1])">
                                                {{ session.scores && session.scores[i - 1] !== undefined ?
                                                    session.scores[i - 1] : '-' }}
                                            </td>
                                            <td v-if="sIdx === 0" :rowspan="result.processedSessions.length"
                                                class="px-4 py-4 text-center bg-navy/5 border-l-2 border-navy/20">
                                                <span class="text-xl font-black text-navy">{{ result.total_score
                                                    }}</span>
                                            </td>
                                            <td v-if="sIdx === 0" :rowspan="result.processedSessions.length"
                                                class="px-4 py-4 text-center text-sm font-bold text-gray-600">
                                                {{ result.total_10x }}
                                            </td>
                                            <td v-if="sIdx === 0" :rowspan="result.processedSessions.length"
                                                class="px-4 py-4 text-center text-sm font-bold text-gray-600">
                                                {{ result.total_x }}
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </div>
                    </template>
                </div>
            </div>

        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'

const props = defineProps({
    eventId: {
        type: String,
        required: true
    }
})

const { get } = useApi()
const isLoading = ref(true)
const qualificationLoading = ref(false)
const eliminationLoading = ref(false)
const categories = ref([])
const selectedCategory = ref(null)
const qualificationData = ref({})
const eliminationData = ref({})
const totalEnds = ref(12)

const currentCategoryName = computed(() => {
    const cat = categories.value.find(c => c.uuid === selectedCategory.value)
    return cat?.category_name || ''
})

const currentQualResults = computed(() => {
    if (!selectedCategory.value) return []
    return qualificationData.value[selectedCategory.value] || []
})

const currentQualResultsWithSessions = computed(() => {
    return currentQualResults.value.map(entry => {
        let sessions = (entry.sessions || []).map(s => {
            const allScores = s.end_scores ? s.end_scores.split(',') : []
            // Parse to int
            const numericScores = allScores.map(score => parseInt(score) || 0)
            return {
                ...s,
                scores: numericScores
            }
        })

        if (sessions.length === 0) {
            sessions = [{ session_code: 'S1', scores: [] }]
        }

        return {
            ...entry,
            processedSessions: sessions
        }
    })
})

const currentElimBracket = computed(() => {
    return eliminationData.value[selectedCategory.value] || null
})

const bracketTypeLabel = computed(() => {
    if (!currentElimBracket.value) return ''
    const type = currentElimBracket.value.bracket_type
    if (type === 'individual') return 'Individual'
    if (type === 'team3') return 'Team (3 Orang)'
    return 'Mixed Team (2 Orang)'
})

const sortedElimRounds = computed(() => {
    if (!currentElimBracket.value?.matches) return []
    const rounds = currentElimBracket.value.matches
    const sortedKeys = Object.keys(rounds).sort((a, b) => parseInt(a) - parseInt(b))
    const sorted = {}
    sortedKeys.forEach(key => {
        sorted[key] = rounds[key]
    })
    return sorted
})

const fetchCategories = async () => {
    try {
        const response = await get(`/events/${props.eventId}/categories`, { params: { limit: 1000 } })
        const cats = response?.events || []

        const mappedCats = cats.map(cat => ({
            uuid: cat.id,
            category_name: [
                cat.division_name,
                cat.category_name,
                cat.gender_division_name,
                cat.event_type_name !== 'Individual' ? `(${cat.event_type_name})` : ''
            ].filter(Boolean).join(' '),
            division_name: cat.division_name,
            event_type_name: cat.event_type_name,
            gender_division_name: cat.gender_division_name,
            participant_count: cat.participant_count || 0
        }))

        // Sort by participant_count descending
        mappedCats.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))

        categories.value = mappedCats
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const selectCategory = async (categoryUuid) => {
    selectedCategory.value = categoryUuid

    // Load both qualification and elimination for this category
    await Promise.all([
        loadQualificationResults(categoryUuid),
        loadEliminationBracket(categoryUuid)
    ])
}

const loadQualificationResults = async (categoryUuid) => {
    if (qualificationData.value[categoryUuid]) return

    qualificationLoading.value = true
    try {
        const response = await get(`/events/${props.eventId}/results/qualification?category_id=${categoryUuid}`)
        qualificationData.value[categoryUuid] = response?.results || []
        totalEnds.value = response?.total_ends || 12
    } catch (error) {
        console.error('Failed to fetch qualification results:', error)
        qualificationData.value[categoryUuid] = []
    } finally {
        qualificationLoading.value = false
    }
}

const loadEliminationBracket = async (categoryUuid) => {
    if (eliminationData.value[categoryUuid]) return

    eliminationLoading.value = true
    try {
        const response = await get(`/events/${props.eventId}/results/elimination?category_id=${categoryUuid}`)
        eliminationData.value[categoryUuid] = response?.bracket || null
    } catch (error) {
        console.error('Failed to fetch elimination bracket:', error)
        eliminationData.value[categoryUuid] = null
    } finally {
        eliminationLoading.value = false
    }
}

const getEndScoreClass = (score) => {
    if (!score) return ''
    if (score >= 58) return 'text-green-600 font-black'
    if (score >= 55) return 'text-blue-600 font-bold'
    return 'text-gray-600'
}

const getMatchScore = (match, side, format) => {
    if (match.status !== 'finished') return '-'

    if (format === 'recurve_set') {
        return side === 'A' ? match.set_points_a || 0 : match.set_points_b || 0
    } else {
        return side === 'A' ? match.total_score_a || 0 : match.total_score_b || 0
    }
}

// Bracket visualization helpers
const BASE_MATCH_HEIGHT = 120

const getTotalHeight = (bracketSize) => {
    return bracketSize / 2 * BASE_MATCH_HEIGHT
}

const getSlotHeight = (roundNo, bracketSize) => {
    const firstRoundMatches = bracketSize / 2
    const matchesInRound = firstRoundMatches / Math.pow(2, roundNo - 1)
    return getTotalHeight(bracketSize) / matchesInRound
}

const getMatchesInRound = (roundNo, bracketSize) => {
    const firstRoundMatches = bracketSize / 2
    return firstRoundMatches / Math.pow(2, roundNo - 1)
}

const isLastRound = (roundNo) => {
    if (!currentElimBracket.value) return false
    const totalRounds = Math.log2(currentElimBracket.value.bracket_size)
    return roundNo === totalRounds
}

const calculateConnectorPath = (i, roundNo, bracketSize) => {
    const slotHeight = getSlotHeight(roundNo, bracketSize)
    const nextSlotHeight = getSlotHeight(roundNo + 1, bracketSize)
    const y1 = (i - 1) * nextSlotHeight + slotHeight / 2
    const y2 = (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight
    const targetY = (i - 1) * nextSlotHeight + nextSlotHeight / 2
    return `M 0 ${y1} H 30 V ${targetY} H 60 M 0 ${y2} H 30 V ${targetY} H 60`
}

const getRoundName = (roundNo, bracketSize) => {
    const totalRounds = Math.log2(bracketSize)
    const roundFromEnd = totalRounds - roundNo + 1

    if (roundFromEnd === 1) return 'Final'
    if (roundFromEnd === 2) return 'Semifinal'
    if (roundFromEnd === 3) return 'Quarterfinal'
    return `Round of ${Math.pow(2, roundFromEnd)}`
}

onMounted(async () => {
    isLoading.value = true
    await fetchCategories()
    if (categories.value.length > 0) {
        await selectCategory(categories.value[0].uuid)
    }
    isLoading.value = false
})
</script>

<style scoped>
.bracket-visualization {
    @apply bg-slate-50/50 relative border border-gray-100;
    background-image:
        linear-gradient(#e2e8f0 1px, transparent 1px),
        linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
}

.bracket-scroll-container {
    @apply overflow-x-auto relative z-10;
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

.match-node-card {
    @apply relative w-[280px] bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 overflow-hidden;
    height: 110px;
}

.match-node-card.completed {
    @apply border-l-4 border-l-green-500;
}

.match-node-card.is-final {
    @apply w-[300px] border-2 border-primary/30 shadow-lg shadow-primary/5;
    height: 120px;
}

.match-card-header {
    @apply flex justify-between items-center px-4 py-1.5 bg-slate-50 border-b border-gray-50;
}

.status-badge {
    @apply text-[8px] font-black uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md;
}

.status-badge.finished {
    @apply bg-green-100 text-green-700;
}

.status-badge.bye {
    @apply bg-gray-100 text-gray-400;
}

.status-badge.waiting {
    @apply bg-amber-100 text-amber-700;
}

.match-meta {
    @apply text-[9px] font-bold text-gray-400;
}

.archer-item {
    @apply flex items-center gap-2.5 px-3 py-2 transition-colors relative;
}

.avatar-wrapper {
    @apply flex-shrink-0;
}

.avatar-img {
    @apply w-8 h-8 rounded-full border-2 border-gray-200 object-cover;
}

.archer-info {
    @apply flex items-center gap-2 flex-1 min-w-0;
}

.archer-item.is-winner {
    @apply bg-primary/5;
}

.archer-item.is-winner .avatar-img {
    @apply border-primary border-2;
}

.archer-item.is-loser {
    @apply opacity-60 grayscale-[0.4];
}

.seed-badge {
    @apply w-6 h-6 rounded-md bg-navy text-white text-[9px] font-black flex items-center justify-center shadow-sm flex-shrink-0;
}

.archer-name {
    @apply text-[12px] font-bold text-navy truncate leading-tight;
}

.score-display {
    @apply text-lg font-black text-navy tabular-nums min-w-[28px] text-right;
}

.is-winner .score-display {
    @apply text-primary text-2xl;
}

.connector-space {
    @apply w-[60px] relative shrink-0;
    margin-top: 40px;
}

.bracket-svg {
    @apply w-full h-full;
}

.connector-line {
    @apply fill-none stroke-gray-300 stroke-[2.5px] transition-all duration-300;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
