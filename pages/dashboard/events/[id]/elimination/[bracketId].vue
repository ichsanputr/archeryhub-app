<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>

        <template v-else-if="bracket">
            <!-- Enhanced Header Section -->
            <div
                class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm mb-6">
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-20"
                    style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
                </div>

                <!-- Decorative Background Elements -->
                <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
                <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary">
                </div>

                <div class="relative p-5 sm:p-8">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div class="flex items-center sm:items-start gap-3 sm:gap-4 flex-1 min-w-0">
                            <button @click="handleBack"
                                class="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 text-white hover:bg-primary hover:text-navy transition-all group shrink-0 backdrop-blur-sm border border-white/20">
                                <Icon icon="ph:arrow-left-bold"
                                    class="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div class="min-w-0">
                                <h1
                                    class="text-lg sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                                    {{ pageTitle }}
                                </h1>
                                <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                                    <div
                                        class="flex flex-wrap items-center gap-1.5 sm:gap-y-1 text-[10px] sm:text-sm text-slate-300 font-medium overflow-hidden">
                                        <template v-if="categoryInfo">
                                            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                                <span
                                                    class="px-2 py-0.5 rounded bg-primary text-navy text-[9px] sm:text-[10px] font-black uppercase tracking-wider backdrop-blur-md">
                                                    {{ categoryInfo.division_name }}
                                                </span>
                                                <span class="opacity-40 hidden sm:inline">•</span>
                                                <span class="truncate">{{ categoryInfo.category_name }}</span>
                                                <span class="opacity-40 hidden sm:inline">•</span>
                                                <span class="truncate">{{ bracket.bracket_size }} Peserta</span>
                                            </div>
                                        </template>
                                        <div v-else class="flex items-center gap-2">
                                            <span
                                                class="px-2 py-0.5 rounded bg-white/5 text-white/40 text-[10px] sm:text-xs font-mono border border-white/5">{{
                                                    bracket.bracket_size }} Peserta</span>
                                        </div>
                                    </div>

                                    <!-- Quick Stats in Header -->
                                    <div class="flex items-center gap-2 sm:gap-3">
                                        <span class="opacity-20 hidden sm:inline text-white">|</span>
                                        <div
                                            class="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                                            <Icon icon="ph:chart-bar-fill" class="text-primary text-xs" />
                                            <span
                                                class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">
                                                {{ finishedMatchesCount }}/{{ matches.length }} Match Selesai
                                            </span>
                                        </div>
                                        <div v-if="currentRoundNo"
                                            class="flex items-center gap-1.5 bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-500/20">
                                            <Icon icon="ph:users-four-fill" class="text-blue-300 text-xs" />
                                            <span
                                                class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-blue-200">
                                                {{ roundMatches.length }} Match di Round ini
                                            </span>
                                        </div>
                                        <div
                                            class="flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-lg border border-white/10">
                                            <Icon icon="ph:gear-six-fill" class="text-white/40 text-xs" />
                                            <span
                                                class="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">
                                                {{ bracket.format === 'recurve_set' ? 'SET' : 'ACC' }} • {{
                                                    bracket.arrows_per_end }}A/{{
                                                    bracket.ends_per_match }}E
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <!-- Tab Switcher (Management Mode) -->
                            <div v-if="currentRoundNo"
                                class="bg-white/10 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex gap-1 backdrop-blur-sm border border-white/20">
                                <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
                                    class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black tracking-widest uppercase rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2"
                                    :class="activeTab === t.id ? 'bg-primary text-navy shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'">
                                    <Icon :icon="t.icon" class="text-sm sm:text-lg" />
                                    <span>{{ t.label }}</span>
                                </button>
                            </div>

                            <button v-if="!currentRoundNo && (bracket.status === 'draft' || !bracket.generated_at)"
                                @click="generateBracket"
                                class="h-10 sm:h-11 px-6 bg-primary text-navy rounded-xl font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
                                <Icon icon="ph:magic-wand-bold" class="text-sm sm:text-lg" />
                                <span>Generate Bracket</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ROUND MANAGEMENT MODE -->
            <div v-if="currentRoundNo" class="space-y-6">
                <!-- TARGET TAB -->
                <EliminationTargetMode v-if="activeTab === 'target'" :round-matches="roundMatches"
                    :target-options="targetOptions" @update-target="updateTarget" />

                <!-- SCORING TAB -->
                <EliminationScoringMode v-if="activeTab === 'scoring'" :bracket="bracket" :round-matches="roundMatches"
                    :selected-scoring-match="selectedScoringMatch" v-model:active-side="activeSide"
                    v-model:current-end="currentEnd" :match-ends="matchEnds" :is-saving="isSaving"
                    :is-ending-match="isEndingMatch" :selected-arrow-index="selectedArrowIndex"
                    :can-end-match="canEndMatch" @select-match="selectMatchForScoring" @add-score="addArrowScore"
                    @delete-last-arrow="deleteLastArrow" @save-and-next="saveAndNext" @end-match="endMatch"
                    @select-arrow-box="selectArrowBox" />
            </div>

            <!-- BRACKET VIEW MODE -->
            <EliminationBracketView v-else :bracket="bracket" :rounds="rounds" :selected-match="selectedMatch"
                @generate-bracket="generateBracket" @navigate-to-round="navigateToRound" @select-match="selectMatch" />
        </template>

        <!-- Not Found / Error State -->
        <div v-else class="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <Icon icon="ph:warning-circle-bold" class="text-8xl text-red-50 mb-4 mx-auto" />
            <h2 class="text-3xl font-black text-navy tracking-tight">Bracket Tidak Ditemukan</h2>
            <p class="text-gray-400 mt-2">UUID bracket atau ID pertandingan tidak valid.</p>
            <button @click="navigateTo(`/dashboard/events/${eventId}/elimination`)"
                class="mt-10 px-6 py-3 rounded-2xl border-2 border-navy text-navy font-black tracking-widest hover:bg-navy hover:text-white transition-all">
                Kembali ke Daftar
            </button>
        </div>
    </div>

    <!-- End Match Confirmation Dialog -->
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="showEndMatchDialog"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div
                    class="relative w-full max-w-lg bg-gradient-to-br from-navy via-navy to-navy/95 rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
                    <!-- Decorative Elements -->
                    <div class="absolute inset-0 opacity-10 pointer-events-none">
                        <Icon icon="ph:target"
                            class="text-[300px] absolute -right-16 -bottom-16 rotate-12 text-white/20" />
                        <Icon icon="ph:trophy"
                            class="text-[150px] absolute -left-10 -top-10 -rotate-12 text-primary/30" />
                    </div>
                    <div
                        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary">
                    </div>

                    <div class="relative p-8 text-center">
                        <!-- Title -->
                        <div class="mb-6">
                            <h2 class="text-2xl font-black text-white tracking-tight">Akhiri Pertandingan?</h2>
                            <p class="text-white/60 text-sm mt-1">Konfirmasi untuk mengakhiri dan menentukan pemenang
                            </p>
                        </div>

                        <!-- Battle Display -->
                        <div v-if="selectedScoringMatch" class="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                            <div class="flex items-center justify-center gap-4">
                                <!-- Side A -->
                                <div class="flex-1 text-center">
                                    <img :src="getAvatarUrl(selectedScoringMatch.entry_a_name)"
                                        class="size-16 rounded-2xl border-2 mx-auto mb-2"
                                        :class="(getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') || manualWinnerId === selectedScoringMatch.entry_a_id) ? 'border-primary shadow-lg shadow-primary/30' : 'border-white/20'" />
                                    <div class="font-bold text-white text-sm truncate max-w-[120px] mx-auto">
                                        {{ selectedScoringMatch.entry_a_name || 'TBD' }}
                                    </div>
                                    <div class="text-3xl font-black mt-2"
                                        :class="(getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') || manualWinnerId === selectedScoringMatch.entry_a_id) ? 'text-primary' : 'text-white/60'">
                                        {{ getMatchScore(selectedScoringMatch, 'A') }}
                                    </div>
                                    <div v-if="getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') || manualWinnerId === selectedScoringMatch.entry_a_id"
                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black tracking-wider mt-2">
                                        <Icon icon="ph:crown-simple-fill" class="text-xs" />
                                        PEMENANG
                                    </div>
                                </div>

                                <!-- VS -->
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                        <span class="text-xs font-black text-white/60 tracking-widest">VS</span>
                                    </div>
                                </div>

                                <!-- Side B -->
                                <div class="flex-1 text-center">
                                    <img :src="getAvatarUrl(selectedScoringMatch.entry_b_name)"
                                        class="size-16 rounded-2xl border-2 mx-auto mb-2"
                                        :class="(getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') || manualWinnerId === selectedScoringMatch.entry_b_id) ? 'border-primary shadow-lg shadow-primary/30' : 'border-white/20'" />
                                    <div class="font-bold text-white text-sm truncate max-w-[120px] mx-auto">
                                        {{ selectedScoringMatch.entry_b_name || 'TBD' }}
                                    </div>
                                    <div class="text-3xl font-black mt-2"
                                        :class="(getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') || manualWinnerId === selectedScoringMatch.entry_b_id) ? 'text-primary' : 'text-white/60'">
                                        {{ getMatchScore(selectedScoringMatch, 'B') }}
                                    </div>
                                    <div v-if="getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') || manualWinnerId === selectedScoringMatch.entry_b_id"
                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black tracking-wider mt-2">
                                        <Icon icon="ph:crown-simple-fill" class="text-xs" />
                                        PEMENANG
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Manual Winner Selection (for Shoot-off Tie) -->
                        <div v-if="isShootOffTie"
                            class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl text-left">
                            <div class="flex items-center gap-2 mb-3">
                                <Icon icon="ph:info-bold" class="text-yellow-500" />
                                <span class="text-xs font-black text-yellow-500 uppercase tracking-widest">Tie Break
                                    Manual</span>
                            </div>
                            <p class="text-[10px] text-white/40 mb-4 leading-relaxed">
                                Skor shoot-off sama. Silahkan pilih pemenang secara manual berdasarkan kriteria (misal:
                                panah terdekat ke pusat).
                            </p>

                            <div class="space-y-2">
                                <button v-if="selectedScoringMatch.entry_a_id"
                                    @click="manualWinnerId = selectedScoringMatch.entry_a_id"
                                    class="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                                    :class="manualWinnerId === selectedScoringMatch.entry_a_id ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'">
                                    <span class="text-sm font-bold text-white">{{ selectedScoringMatch.entry_a_name
                                        }}</span>
                                    <Icon v-if="manualWinnerId === selectedScoringMatch.entry_a_id"
                                        icon="ph:check-circle-fill" class="text-primary" />
                                </button>

                                <button v-if="selectedScoringMatch.entry_b_id"
                                    @click="manualWinnerId = selectedScoringMatch.entry_b_id"
                                    class="w-full flex items-center justify-between p-3 rounded-xl border transition-all"
                                    :class="manualWinnerId === selectedScoringMatch.entry_b_id ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'">
                                    <span class="text-sm font-bold text-white">{{ selectedScoringMatch.entry_b_name
                                        }}</span>
                                    <Icon v-if="manualWinnerId === selectedScoringMatch.entry_b_id"
                                        icon="ph:check-circle-fill" class="text-primary" />
                                </button>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-3">
                            <button @click="showEndMatchDialog = false"
                                class="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all">
                                Batal
                            </button>
                            <button @click="confirmEndMatch"
                                :disabled="isEndingMatch || (selectedScoringMatch && getMatchScore(selectedScoringMatch, 'A') === getMatchScore(selectedScoringMatch, 'B') && !manualWinnerId)"
                                class="flex-1 px-6 py-3 rounded-xl bg-primary text-navy font-black tracking-wide hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <Icon v-if="isEndingMatch" icon="ph:circle-notch-bold" class="animate-spin" />
                                <Icon v-else icon="ph:check-bold" />
                                <span>{{ isEndingMatch ? 'Memproses...' : 'Konfirmasi' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

import EliminationBracketView from '~/components/elimination/EliminationBracketView.vue'
import EliminationTargetMode from '~/components/elimination/EliminationTargetMode.vue'
import EliminationScoringMode from '~/components/elimination/EliminationScoringMode.vue'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const eventId = route.params.id
const bracketId = route.params.bracketId
const { get, post, put } = useApi()
const toast = useToast()

const isLoading = ref(true)
const isSaving = ref(false)
const bracket = ref(null)
const categoryInfo = ref(null)
const entries = ref([])
const matches = ref([])
const rounds = ref({})
const selectedMatch = ref(null)
const availableTargets = ref([])
const selectedArrowIndex = ref(0)
const selectedScoringMatch = ref(null)
const matchEnds = ref({}) // { matchId: { A: { 1: {total: 0, arrows: []} }, B: { ... } } }
const manualWinnerId = ref(null)

const currentRoundNo = computed(() => route.query.round)
const roundMatches = computed(() => {
    if (!currentRoundNo.value) return []
    return rounds.value[currentRoundNo.value] || []
})

const finishedMatchesCount = computed(() => {
    return matches.value.filter(m => m.status === 'finished' || m.winner_entry_id).length
})

const pageTitle = computed(() => {
    const catName = bracket.value?.category_name || 'Bagan Eliminasi'
    if (!currentRoundNo.value) return catName
    return `${catName} - ${getRoundName(parseInt(currentRoundNo.value))}`
})

useHead({
    title: computed(() => `${pageTitle.value} - ArcheryHub Dashboard`)
})

const targetOptions = computed(() => {
    return availableTargets.value.map(t => ({
        ...t,
        displayName: `Target ${t.name}`
    }))
})

// Round Management States
const activeTab = ref(route.query.mode === 'scoring' ? 'scoring' : 'target')
const tabs = [
    { id: 'target', label: 'Target', icon: 'ph:target-bold' },
    { id: 'scoring', label: 'Scoring', icon: 'ph:pencil-circle-bold' }
]

// Sync activeTab with route query
watch(() => route.query.mode, (newMode) => {
    if (newMode === 'scoring' || newMode === 'target') {
        activeTab.value = newMode
    }
})

watch(activeTab, (newTab) => {
    const query = { ...route.query, mode: newTab }
    router.replace({ query })
})

// Reset selected match when round changes - fixes caching issue
watch(() => route.query.round, (newRound, oldRound) => {
    if (newRound !== oldRound) {
        selectedScoringMatch.value = null
        currentEnd.value = 1
        activeSide.value = 'A'
    }
})

const statusBadgeClasses = computed(() => {
    const s = bracket.value?.status
    if (s === 'running') return 'bg-blue-500 text-white shadow-blue-200'
    if (s === 'finished') return 'bg-green-500 text-white shadow-green-200'
    if (s === 'generated') return 'bg-navy text-primary shadow-navy/20'
    return 'bg-gray-100 text-gray-400 border border-gray-200'
})

// Check if there is a shoot-off tie
const isShootOffTie = computed(() => {
    if (!selectedScoringMatch.value) return false
    const matchId = selectedScoringMatch.value.id
    const m = matchEnds.value[matchId]
    if (!m) return false

    const soA = m.A?.[99]?.arrows?.[0]
    const soB = m.B?.[99]?.arrows?.[0]

    if (soA === null || soB === null || soA === undefined || soB === undefined || soA === '' || soB === '') return false

    const getV = (v) => v === 'X' ? 11 : (v === 'M' ? 0 : parseInt(v) || 0)
    const vA = getV(soA)
    const vB = getV(soB)

    // Base scores tied checks
    const isRecurve = bracket.value?.format === 'recurve_set'
    let baseA, baseB
    if (isRecurve) {
        baseA = calculateSetPoints(matchId, 'A')
        baseB = calculateSetPoints(matchId, 'B')
    } else {
        baseA = Object.values(m.A).reduce((s, e) => e.end_no === 99 ? s : s + (e.total || 0), 0)
        baseB = Object.values(m.B).reduce((s, e) => e.end_no === 99 ? s : s + (e.total || 0), 0)
    }

    if (baseA !== baseB) return false
    return vA === vB
})

// Check if match can be ended - requires at least one completed end
const canEndMatch = computed(() => {
    if (!selectedScoringMatch.value) return false
    const matchId = selectedScoringMatch.value.id
    const m = matchEnds.value[matchId]
    if (!m) return false

    // Check if at least one end has been completed by both sides
    const arrowsPerEnd = bracket.value?.arrows_per_end || 3
    for (let i = 1; i <= (bracket.value?.ends_per_match || 5); i++) {
        const hasA = m.A?.[i]?.arrows?.every(a => a !== null && a !== '')
        const hasB = m.B?.[i]?.arrows?.every(a => a !== null && a !== '')
        if (hasA && hasB) return true
    }
    return false
})

// Scoring States
const activeSide = ref('A')
const currentEnd = ref(1)
// Monitor end changes to reset arrow focus
watch(currentEnd, () => {
    selectedArrowIndex.value = 0
    activeSide.value = 'A'
})
const isEndingMatch = ref(false)
const showEndMatchDialog = ref(false)

const fetchBracket = async (silent = false) => {
    if (!silent) isLoading.value = true
    try {
        const response = await get(`/events/${eventId}/elimination/brackets/${bracketId}`)
        bracket.value = response?.bracket || null
        entries.value = response?.entries || []
        matches.value = response?.matches || []
        rounds.value = response?.rounds || {}

        // Re-sync selectedScoringMatch to get updated scores/status
        if (selectedScoringMatch.value) {
            const updatedMatch = matches.value.find(m => m.id === selectedScoringMatch.value.id)
            if (updatedMatch) {
                selectedScoringMatch.value = updatedMatch
            }
        }

        if (bracket.value?.category_id) {
            fetchCategoryDetails(bracket.value.category_id)
        }

        // Fetch all scores for the bracket list
        fetchAllScores()
    } catch (error) {
        console.error('Failed to fetch bracket:', error)
        toast.error('Gagal memuat bracket')
    } finally {
        if (!silent) isLoading.value = false
    }
}

const fetchCategoryDetails = async (categoryUuid) => {
    try {
        const response = await get(`/events/${eventId}/categories`)
        const cats = response?.events || response.data?.events || []
        categoryInfo.value = cats.find(c => (c.id === categoryUuid || c.uuid === categoryUuid))
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const fetchAvailableTargets = async () => {
    try {
        const response = await get(`/events/${eventId}/targets/options`)
        const options = response?.options || response.data?.options || []
        availableTargets.value = options.map(o => ({
            id: o.uuid || o.id,
            name: o.target_name || o.value || o.name
        }))
    } catch (error) {
        console.error('Failed to fetch targets:', error)
    }
}

const generateBracket = async () => {
    try {
        await post(`/events/${eventId}/elimination/brackets/${bracketId}/generate`)
        toast.success('Bracket berhasil di-generate')
        await fetchBracket()
    } catch (error) {
        console.error('Failed to generate bracket:', error)
        toast.error('Gagal generate bracket')
    }
}

const navigateToRound = (roundNo) => {
    router.push({ query: { ...route.query, round: roundNo } })
}

const selectMatch = (match) => {
    selectedMatch.value = selectedMatch.value?.id === match.id ? null : match
}

const handleBack = () => {
    if (currentRoundNo.value) {
        router.push({ query: {} })
    } else {
        navigateTo(`/dashboard/events/${eventId}/elimination`)
    }
}

const selectMatchForScoring = (match) => {
    selectedScoringMatch.value = match
    activeSide.value = 'A'
    currentEnd.value = 1
    selectedArrowIndex.value = 0
    fetchMatchScores(match.id)
}

const fetchAllScores = async () => {
    try {
        const response = await get(`/events/${eventId}/elimination/brackets/${bracketId}/scores`)
        const ends = response?.ends || []

        ends.forEach(end => {
            const matchId = end.match_id
            const side = end.side
            const endNo = end.end_no

            if (!matchEnds.value[matchId]) {
                const initEnds = {}
                for (let i = 1; i <= (bracket.value?.ends_per_match || 5); i++) {
                    initEnds[i] = { total: 0, arrows: Array(bracket.value?.arrows_per_end || 3).fill(null), end_no: i }
                }
                // Add shoot-off slot
                initEnds[99] = { total: 0, arrows: [null], end_no: 99 }

                matchEnds.value[matchId] = {
                    A: JSON.parse(JSON.stringify(initEnds)),
                    B: JSON.parse(JSON.stringify(initEnds))
                }
            }

            if (matchEnds.value[matchId][side] && matchEnds.value[matchId][side][endNo]) {
                matchEnds.value[matchId][side][endNo].total = end.end_total

                // Pad or truncate arrows to size
                const arrows = [...(end.arrows || [])]
                const targetSize = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)
                while (arrows.length < targetSize) arrows.push(null)
                if (arrows.length > targetSize) arrows.length = targetSize
                matchEnds.value[matchId][side][endNo].arrows = arrows
            }
        })
    } catch (e) {
        console.error('Failed to fetch bracket scores:', e)
    }
}

const fetchMatchScores = async (matchId) => {
    try {
        const response = await get(`/events/${eventId}/elimination/brackets/${bracketId}/matches/${matchId}`)
        const ends = response?.ends || []

        if (!matchEnds.value[matchId]) {
            const initEnds = {}
            for (let i = 1; i <= (bracket.value?.ends_per_match || 5); i++) {
                initEnds[i] = { total: 0, arrows: Array(bracket.value?.arrows_per_end || 3).fill(null), end_no: i }
            }
            // Add shoot-off slot
            initEnds[99] = { total: 0, arrows: [null], end_no: 99 }

            matchEnds.value[matchId] = {
                A: JSON.parse(JSON.stringify(initEnds)),
                B: JSON.parse(JSON.stringify(initEnds))
            }
        }

        ends.forEach(end => {
            const side = end.side
            const endNo = end.end_no
            if (matchEnds.value[matchId][side] && matchEnds.value[matchId][side][endNo]) {
                matchEnds.value[matchId][side][endNo].total = end.end_total
                matchEnds.value[matchId][side][endNo].end_no = endNo

                // Pad or truncate arrows to size
                const arrows = [...(end.arrows || [])]
                const targetSize = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)
                while (arrows.length < targetSize) arrows.push(null)
                if (arrows.length > targetSize) arrows.length = targetSize
                matchEnds.value[matchId][side][endNo].arrows = arrows
            }
        })
    } catch (e) {
        console.error('Failed to fetch match scores:', e)
    }
}

const getAvatarUrl = (name) => {
    if (!name || name === 'TBD' || name === 'BYE') return 'https://api.dicebear.com/7.x/initials/svg?seed=??&backgroundColor=f1f5f9'
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffaa00`
}

const getMatchScore = (match, side) => {
    const isRecurve = bracket.value?.format === 'recurve_set'
    const sideKey = side === 'A' ? 'A' : 'B'

    const m = matchEnds.value[match.id]
    let score = 0
    if (m) {
        if (isRecurve) score = calculateSetPoints(match.id, sideKey)
        else score = Object.values(m[sideKey] || {}).reduce((s, e) => {
            if (e.end_no === 99) return s
            return s + (e.total || 0)
        }, 0) || 0
    } else {
        if (isRecurve) score = (side === 'A' ? match.total_points_a : match.total_points_b) || 0
        else score = (side === 'A' ? match.total_score_a : match.total_score_b) || 0
    }

    // Shoot-off logic: Winner gets +1 point to total score
    const soA = m?.A?.[99]?.arrows?.[0]
    const soB = m?.B?.[99]?.arrows?.[0]

    if (soA && soB) {
        const getV = (v) => v === 'X' ? 11 : (v === 'M' ? 0 : parseInt(v) || 0)
        const vA = getV(soA)
        const vB = getV(soB)

        if (side === 'A' && vA > vB) score += 1
        else if (side === 'B' && vB > vA) score += 1
    }

    // Manual winner increment
    if (manualWinnerId.value && manualWinnerId.value === (side === 'A' ? match.entry_a_id : match.entry_b_id)) {
        score += 1
    }

    return score
}

const calculateSetPoints = (matchId, side) => {
    const m = matchEnds.value[matchId]
    if (!m) return 0

    let setPointsA = 0
    let setPointsB = 0

    const totalEnds = bracket.value?.ends_per_match || 5
    const arrowsPerEnd = bracket.value?.arrows_per_end || 3

    for (let i = 1; i <= totalEnds; i++) {
        const endA = m.A[i]
        const endB = m.B[i]
        if (!endA || !endB) continue

        // Only count if both have finished the end
        if (endA.arrows && endB.arrows && endA.arrows.length === arrowsPerEnd && endB.arrows.length === arrowsPerEnd) {
            if (endA.total > endB.total) {
                setPointsA += 2
            } else if (endA.total < endB.total) {
                setPointsB += 2
            } else {
                setPointsA += 1
                setPointsB += 1
            }
        }

        // Stop if someone reached 6 points
        if (setPointsA >= 6 || setPointsB >= 6) break
    }

    return side === 'A' ? setPointsA : setPointsB
}

const getMatchProgress = (match) => {
    if (match.winner_entry_id) return 100
    const m = matchEnds.value[match.id]
    if (!m) return 0
    const scoredEnds = Object.values(m.A).filter(e => e.arrows.length > 0).length
    const totalEnds = bracket.value?.ends_per_match || 5
    return Math.min(scoredEnds * (100 / totalEnds), 95)
}

const getArrowScore = (matchId, endNo, side, arrowIdx) => {
    const val = matchEnds.value[matchId]?.[side]?.[endNo]?.arrows?.[arrowIdx - 1]
    return val === null || val === undefined ? '' : val
}

const calculateEndTotal = (matchId, endNo, side) => {
    const end = matchEnds.value[matchId]?.[side]?.[endNo]
    if (!end || !end.arrows) return 0
    return end.arrows.reduce((sum, a) => {
        if (!a || a === '-' || a === '') return sum
        const val = a === 'X' ? 10 : (a === 'M' ? 0 : parseInt(a) || 0)
        return sum + val
    }, 0)
}

const calculateEndStats = (matchId, endNo, side) => {
    const end = matchEnds.value[matchId]?.[side]?.[endNo]
    if (!end || !end.arrows) return { x: 0, ten: 0 }
    return end.arrows.reduce((stats, a) => {
        if (a === 'X') {
            stats.x++
            stats.ten++
        } else if (a === '10' || a === 10) {
            stats.ten++
        }
        return stats
    }, { x: 0, ten: 0 })
}

const addArrowScore = (score) => {
    if (!selectedScoringMatch.value) return
    const matchId = selectedScoringMatch.value.id
    const side = activeSide.value
    const endNo = currentEnd.value
    // Use 1 arrow for shoot-off, otherwise use bracket default
    const totalArrows = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)

    // Ensure match object exists
    if (!matchEnds.value[matchId]) {
        matchEnds.value[matchId] = { A: {}, B: {} }
    }

    // Ensure side exist
    if (!matchEnds.value[matchId][side]) matchEnds.value[matchId][side] = {}

    // Ensure specific end exists (important for shoot-off End 99)
    if (!matchEnds.value[matchId][side][endNo]) {
        matchEnds.value[matchId][side][endNo] = { total: 0, arrows: Array(totalArrows).fill(null), end_no: endNo }
    }

    const end = matchEnds.value[matchId][side][endNo]

    // Safety check for array size
    if (!end.arrows || end.arrows.length !== totalArrows) {
        const newArrows = end.arrows ? [...end.arrows] : []
        while (newArrows.length < totalArrows) newArrows.push(null)
        if (newArrows.length > totalArrows) newArrows.length = totalArrows // Truncate if too long
        end.arrows = newArrows
    }

    // Update at selected index
    end.arrows.splice(selectedArrowIndex.value, 1, score)

    // Recalculate total immediately for UI
    end.total = calculateEndTotal(matchId, endNo, side)

    // Move to next index
    if (selectedArrowIndex.value < totalArrows - 1) {
        selectedArrowIndex.value++
    } else {
        // Automatically switch side if current side is finished
        if (side === 'A') {
            activeSide.value = 'B'
            selectedArrowIndex.value = 0
        }
    }
}

const deleteLastArrow = () => {
    if (!selectedScoringMatch.value) return
    const matchId = selectedScoringMatch.value.id
    const endNo = currentEnd.value
    const side = activeSide.value

    const end = matchEnds.value[matchId]?.[side]?.[endNo]
    if (!end || !end.arrows) return

    // Clear current selected box
    end.arrows.splice(selectedArrowIndex.value, 1, null)

    // Recalculate
    end.total = calculateEndTotal(matchId, endNo, side)

    // Move back if not at 0
    if (selectedArrowIndex.value > 0) {
        selectedArrowIndex.value--
    } else if (side === 'B') {
        // If at beginning of Side B, move to end of Side A
        activeSide.value = 'A'
        const arrowsPerEnd = endNo === 99 ? 1 : (bracket.value?.arrows_per_end || 3)
        selectedArrowIndex.value = arrowsPerEnd - 1
    }
}

const selectArrowBox = (side, index) => {
    activeSide.value = side
    selectedArrowIndex.value = index
}

const saveAndNext = async () => {
    if (!selectedScoringMatch.value) return
    isSaving.value = true
    try {
        const matchId = selectedScoringMatch.value.id
        const arrowsA = matchEnds.value[matchId].A[currentEnd.value].arrows.map(a => String(a))
        const arrowsB = matchEnds.value[matchId].B[currentEnd.value].arrows.map(a => String(a))

        await post(`/events/${eventId}/elimination/brackets/${bracketId}/matches/${matchId}/score`, {
            end_no: currentEnd.value,
            score_a: matchEnds.value[matchId].A[currentEnd.value].total,
            score_b: matchEnds.value[matchId].B[currentEnd.value].total,
            arrows_a: matchEnds.value[matchId].A[currentEnd.value].arrows.filter(a => a !== null).map(a => String(a)),
            arrows_b: matchEnds.value[matchId].B[currentEnd.value].arrows.filter(a => a !== null).map(a => String(a))
        })

        toast.success(`Skor End ${currentEnd.value} Berhasil Disimpan`)

        // Update match scores in UI by re-fetching bracket (silently)
        await fetchBracket(true)

        if (activeSide.value === 'A') {
            activeSide.value = 'B'
        } else {
            activeSide.value = 'A'
            if (currentEnd.value < (bracket.value?.ends_per_match || 5)) currentEnd.value++
        }
    } catch (e) {
        toast.error('Gagal menyimpan skor')
    } finally {
        isSaving.value = false
    }
}

const endMatch = () => {
    if (!selectedScoringMatch.value || !canEndMatch.value) return
    manualWinnerId.value = null // Reset selection
    showEndMatchDialog.value = true
}

const confirmEndMatch = async () => {
    if (!selectedScoringMatch.value) return

    isEndingMatch.value = true
    try {
        const matchId = selectedScoringMatch.value.id

        // Call API endpoint that will auto-calculate winner from saved scores
        await post(`/events/${eventId}/elimination/brackets/${bracketId}/matches/${matchId}/end`, {
            winner_entry_id: manualWinnerId.value
        })

        toast.success('Pertandingan berhasil diakhiri!')

        // Close dialog
        showEndMatchDialog.value = false

        // Refresh bracket data to get updated matches
        await fetchBracket()

        // Deselect the match after ending
        selectedScoringMatch.value = null

    } catch (e) {
        console.error('Failed to end match:', e)
        toast.error('Gagal mengakhiri pertandingan')
    } finally {
        isEndingMatch.value = false
    }
}

const updateTarget = async (match) => {
    try {
        await put(`/events/${eventId}/elimination/brackets/${bracketId}/targets`, {
            assignments: [
                {
                    match_id: match.id,
                    target_id: match.target_id
                }
            ]
        })
        toast.success('Lokasi target diupdate')
    } catch (e) {
        toast.error('Gagal mengupdate target')
    }
}

const canFinishMatch = (match) => {
    if (!match || match.winner_entry_id) return false
    const m = matchEnds.value[match.id]
    if (!m) return false

    // Check if at least one arrow is scored to enable finishing
    const hasAnyArrow = Object.values(m.A).some(e => e.arrows.length > 0) ||
        Object.values(m.B).some(e => e.arrows.length > 0)

    return hasAnyArrow
}

const finishMatchAction = async (match) => {
    try {
        const isRecurve = bracket.value?.format === 'recurve_set'
        let winnerId;

        if (isRecurve) {
            const pointsA = calculateSetPoints(match.id, 'A')
            const pointsB = calculateSetPoints(match.id, 'B')
            winnerId = pointsA >= pointsB ? match.entry_a_id : match.entry_b_id
        } else {
            const totalA = Object.values(matchEnds.value[match.id].A).reduce((s, e) => s + e.total, 0)
            const totalB = Object.values(matchEnds.value[match.id].B).reduce((s, e) => s + e.total, 0)
            winnerId = totalA >= totalB ? match.entry_a_id : match.entry_b_id
        }

        await post(`/events/${eventId}/elimination/brackets/${bracketId}/matches/${match.id}/finish`, {
            winner_entry_id: winnerId
        })
        toast.success('Pertandingan Selesai!')
        await fetchBracket()
        selectedScoringMatch.value = null
    } catch (e) {
        toast.error('Gagal menutup match')
    }
}

const getFullTargetName = (match) => {
    if (!match) return 'Belum Ada Target'
    if (match.target_name) return match.target_name.startsWith('Target') ? match.target_name : `Target ${match.target_name}`
    return getTargetName(match.target_id || match.target_uuid)
}

const getTargetName = (tid) => {
    if (!tid) return 'Belum Ada Target'
    const t = availableTargets.value.find(o => o.id === tid)
    return t ? `Target ${t.name}` : 'Target Terpilih'
}

const formatDate = (d) => dayjs(d).format('DD MMM YYYY, HH:mm')
const timeAgo = (d) => dayjs(d).fromNow()

// Bracket visualization
const BASE_MATCH_HEIGHT = 160
const getTotalRounds = computed(() => Object.keys(rounds.value).length)
const isSplitLayout = computed(() => (bracket.value?.bracket_size || 8) >= 4)

const leftSideRoundNumbers = computed(() => {
    const total = getTotalRounds.value
    const nums = []
    for (let i = 1; i < total; i++) nums.push(i)
    return nums
})

const rightSideRoundNumbers = computed(() => {
    const total = getTotalRounds.value
    const nums = []
    for (let i = total - 1; i >= 1; i--) nums.push(i)
    return nums
})

const getMatchesForSide = (roundNo, side) => {
    const all = rounds.value[roundNo] || []
    if (parseInt(roundNo) === getTotalRounds.value) return all
    const half = Math.ceil(all.length / 2)
    return side === 'left' ? all.slice(0, half) : all.slice(half)
}

const getSideTotalHeight = computed(() => {
    const size = bracket.value?.bracket_size || 8
    const sideSize = size / 2
    return Math.max(sideSize, 2) * BASE_MATCH_HEIGHT
})

const getSlotHeightForSide = (roundNo) => {
    const r = parseInt(roundNo)
    return Math.pow(2, r - 1) * BASE_MATCH_HEIGHT
}

const calculateConnectorPath = (i, roundNo, side = 'left', isSingle = false) => {
    const r = parseInt(roundNo)
    const slotHeight = getSlotHeightForSide(r)
    const nextSlotHeight = getSlotHeightForSide(r + 1)

    if (isSingle) {
        // Single match connecting to Final Entry A or B
        const y = slotHeight / 2
        const targetY = nextSlotHeight / 2
        const entryOffset = side === 'left' ? -26 : 26
        const targetEY = targetY + entryOffset

        if (side === 'left') {
            return `M 0 ${y} H 40 V ${targetEY} H 80`
        } else {
            return `M 80 ${y} H 40 V ${targetEY} H 0`
        }
    }

    const y1 = (i - 1) * nextSlotHeight + slotHeight / 2
    const y2 = (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight
    const targetY = (i - 1) * nextSlotHeight + nextSlotHeight / 2

    if (side === 'left') {
        return `M 0 ${y1} H 40 V ${targetY} H 80 M 0 ${y2} H 40 V ${targetY} H 80`
    } else {
        return `M 80 ${y1} H 40 V ${targetY} H 0 M 80 ${y2} H 40 V ${targetY} H 0`
    }
}

function getRoundName(roundNo) {
    const size = bracket.value?.bracket_size || 8
    const totalRounds = Math.log2(size)
    const roundFromEnd = totalRounds - roundNo + 1
    if (roundFromEnd === 1) return 'Final'
    if (roundFromEnd === 2) return 'Semifinal'
    if (roundFromEnd === 3) return 'Quarterfinal'
    return `Round of ${Math.pow(2, roundFromEnd)}`
}

// Auto-select first match when in scoring mode and roundMatches are loaded
watch(roundMatches, (newMatches) => {
    if (activeTab.value === 'scoring' && newMatches.length > 0 && !selectedScoringMatch.value) {
        // Find first non-finished match, or just the first match
        const firstMatch = newMatches.find(m => m.status !== 'finished' && !m.winner_entry_id) || newMatches[0]
        if (firstMatch) {
            selectMatchForScoring(firstMatch)
        }
    }
}, { immediate: true })

onMounted(async () => {
    await fetchBracket()
    await fetchAvailableTargets()

    // Auto-select first match if in scoring mode with a round selected
    if (activeTab.value === 'scoring' && currentRoundNo.value && roundMatches.value.length > 0 && !selectedScoringMatch.value) {
        const firstMatch = roundMatches.value.find(m => m.status !== 'finished' && !m.winner_entry_id) || roundMatches.value[0]
        if (firstMatch) {
            selectMatchForScoring(firstMatch)
        }
    }
})
</script>

<style scoped>
.status-badge {
    @apply text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-lg;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from>div,
.modal-leave-to>div {
    transform: scale(0.9) translateY(20px);
}

.modal-enter-active>div,
.modal-leave-active>div {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>