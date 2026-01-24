<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20"
                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ic:outline-scoreboard" class="text-primary text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Scoring Management
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Kelola dan input skor untuk event ini
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:funnel" class="h-11 px-5">
                            Filter
                        </BaseButton>
                        <BaseButton variant="white" icon="ph:download" class="h-11 px-5">
                            Export Results
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scoring Context Selector -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-lg font-bold text-navy mb-4">Pilih Konteks Scoring</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Fase</label>
                    <select v-model="scoringContext.phase"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                        <option value="">Pilih Fase</option>
                        <option value="qualification">Kualifikasi</option>
                        <option value="elimination">Eliminasi</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                    <select v-model="scoringContext.categoryId"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                        <option value="">Pilih Kategori</option>
                        <option v-for="category in eventCategories" :key="category.id" :value="category.id">
                            {{ category.division_name }} - {{ category.category_name }} - {{ category.event_type_name }}
                            - {{ category.gender_division_name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Nama Kartu Target</label>
                    <select v-model="scoringContext.cardId" @change="loadTargets"
                        :disabled="!scoringContext.phase || !scoringContext.categoryId || isLoadingCards"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:bg-gray-50 disabled:text-gray-400">
                        <option value="">{{ isLoadingCards ? 'Memuat...' : 'Pilih Kartu Target' }}</option>
                        <option v-for="card in scoringCards" :key="card.id" :value="card.id">
                            {{ card.label }}
                        </option>
                    </select>
                    <p v-if="scoringContext.phase && scoringContext.categoryId && !isLoadingCards && scoringCards.length === 0"
                        class="text-xs text-gray-400 mt-2">
                        Belum ada kartu target untuk konteks ini. Buat target terlebih dahulu di menu Target.
                    </p>
                </div>
            </div>
        </div>

        <!-- Scoring Workspace (single page flow) -->
        <div v-if="scoringContext.phase && scoringContext.categoryId && scoringContext.cardId"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div
                class="p-6 border-b border-gray-100 bg-gray-50/30 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                    <h3 class="text-lg font-black text-navy tracking-tight flex items-center gap-3">
                        {{ activeTarget?.target_name || 'Target' }}
                        <span
                            class="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                            Target {{ String(activeTarget?.target_number || '').padStart(2, '0') }}
                        </span>
                    </h3>
                    <p class="text-sm text-gray-500 font-medium">
                        End {{ currentEnd }} <span class="text-gray-400">of {{ activeTarget?.total_ends || 12 }}</span>
                    </p>
                </div>
                <div class="flex items-center gap-3">
                    <BaseButton variant="white" icon="ph:arrows-clockwise" class="h-11 px-5" :loading="isLoading"
                        @click="loadTargets">
                        Refresh
                    </BaseButton>
                </div>
            </div>

            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <!-- Left: Archer Cards -->
                    <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                        <div v-for="(archer, index) in scoringArchers" :key="archer.assignment_id"
                            @click="setActiveArcher(index)"
                            class="bg-white rounded-xl border transition-all cursor-pointer relative overflow-hidden"
                            :class="activeArcherIndex === index ? 'ring-2 ring-primary border-primary' : 'border-gray-200 opacity-80 hover:opacity-100'">
                            <div class="absolute top-0 left-0 w-2 h-full"
                                :class="activeArcherIndex === index ? 'bg-primary' : 'bg-gray-200 opacity-50'"></div>
                            <div class="p-5 pl-7">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex items-center gap-3">
                                        <div class="h-10 w-10 rounded-lg text-white flex items-center justify-center font-black text-lg"
                                            :class="activeArcherIndex === index ? 'bg-navy' : 'bg-gray-400'">
                                            {{ archer.position }}
                                        </div>
                                        <div class="min-w-0">
                                            <h3 class="text-lg font-black text-navy leading-tight truncate">{{
                                                archer.name || '-' }}</h3>
                                            <div class="text-xs text-gray-500 font-medium truncate">{{ archer.division
                                                || '-' }}</div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <div class="text-xs text-gray-400 font-bold uppercase">Total</div>
                                        <div class="text-2xl font-black text-navy">{{ archer.current_score || 0 }}</div>
                                    </div>
                                </div>

                                <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            End {{ currentEnd }} Arrows
                                        </span>
                                        <span v-if="activeArcherIndex === index"
                                            class="text-xs font-bold text-primary-hover uppercase tracking-wider">Evaluating</span>
                                        <span v-else-if="isEndComplete(archer.currentEndScores)"
                                            class="text-xs font-bold text-blue-500 uppercase tracking-wider">Completed</span>
                                    </div>
                                    <div class="flex gap-2 sm:gap-3">
                                        <div v-for="(score, sIdx) in archer.currentEndScores" :key="sIdx"
                                            class="flex-1 aspect-square bg-white border rounded-lg shadow-sm flex items-center justify-center text-xl font-black transition-all"
                                            :class="[
                                                score ? 'border-gray-200 text-navy' : 'bg-gray-100 border-dashed border-2 border-gray-300 text-gray-400',
                                                activeArcherIndex === index && currentArrowIndex === sIdx ? 'border-2 border-primary ring-2 ring-primary/20' : ''
                                            ]">
                                            {{ score }}
                                        </div>
                                        <div class="w-px bg-gray-300 mx-1"></div>
                                        <div
                                            class="flex-1 aspect-square bg-navy text-primary rounded-lg flex flex-col items-center justify-center shadow-sm">
                                            <span class="text-[10px] uppercase font-bold opacity-70">Sum</span>
                                            <span class="text-xl font-black">{{ calculateEndSum(archer.currentEndScores)
                                                }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4 flex items-center gap-2 overflow-x-auto pb-2">
                                    <span
                                        class="text-xs font-semibold text-gray-400 whitespace-nowrap mr-1">Prev:</span>
                                    <div v-for="(prevEnd, pIdx) in archer.prevEnds" :key="pIdx"
                                        class="px-2 py-1 bg-gray-50 rounded border border-gray-100 text-xs text-gray-600 font-mono">
                                        E{{ prevEnd.end_number }}: {{ prevEnd.end_total }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Keypad -->
                    <div class="lg:col-span-5 xl:col-span-4">
                        <div class="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
                            <div class="flex justify-between items-center mb-5">
                                <h3 class="font-black text-navy flex items-center gap-2">
                                    <Icon icon="ph:keyboard" />
                                    Rapid Entry
                                </h3>
                                <button @click="clearCurrentArcher"
                                    class="text-xs font-bold text-red-500 hover:text-red-700 uppercase tracking-wide">
                                    Clear Entry
                                </button>
                            </div>

                            <div class="grid grid-cols-3 gap-3 mb-4">
                                <button v-for="key in keys" :key="key.label" @click="inputScore(key.value)"
                                    class="h-16 rounded-lg text-2xl font-black transition-all shadow-key active:border-b-0 active:translate-y-[4px] border-b-4"
                                    :class="key.class">
                                    {{ key.label }}
                                </button>
                            </div>

                            <div class="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                                <button @click="deleteLastScore"
                                    class="flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 bg-white text-navy font-bold hover:bg-gray-50 transition-colors">
                                    <Icon icon="ph:backspace" />
                                    Delete
                                </button>
                                <BaseButton variant="navy" class="h-12" icon="ph:floppy-disk" :loading="isSaving"
                                    @click="saveActiveArcherEnd">
                                    Simpan End
                                </BaseButton>
                            </div>

                            <div class="grid grid-cols-2 gap-3 mt-3">
                                <BaseButton variant="white" class="h-12" icon="ph:arrow-right" @click="nextArcher">
                                    Next Archer
                                </BaseButton>
                                <BaseButton variant="primary" class="h-12" icon="ph:arrow-fat-line-right"
                                    @click="nextEnd" :disabled="!canNextEnd">
                                    Next End
                                </BaseButton>
                            </div>

                            <div class="mt-4 text-center">
                                <p class="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                                    Shortcuts: 1-9, X, M, Backspace, Enter
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Icon icon="ph:target" class="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-navy mb-2">Pilih Konteks Scoring</h3>
            <p class="text-gray-500">Silakan pilih fase, sesi (jika kualifikasi), dan kategori untuk melihat daftar
                target</p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'
import { definePageMeta } from '#imports'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get, put } = useApi()
const { setEvent } = useEventContext()
const toast = useToast()

const eventId = route.params.id
const isLoading = ref(false)
const eventCategories = ref([])
const scoringCards = ref([])
const isLoadingCards = ref(false)
const targets = ref([])
const activeTarget = ref(null)

// scoring input state (in-page)
const scoringArchers = ref([])
const currentEnd = ref(1)
const activeArcherIndex = ref(0)
const currentArrowIndex = ref(0)
const isSaving = ref(false)

const scoringContext = ref({
    phase: '',
    categoryId: '',
    cardId: ''
})

const keys = [
    { label: 'X', value: 'X', class: 'bg-[#FFE500] border-[#e6ce00] text-navy' },
    { label: '10', value: '10', class: 'bg-[#FFE500] border-[#e6ce00] text-navy' },
    { label: '9', value: '9', class: 'bg-[#FFE500] border-[#e6ce00] text-navy' },
    { label: '8', value: '8', class: 'bg-[#EF4444] border-red-700 text-white' },
    { label: '7', value: '7', class: 'bg-[#EF4444] border-red-700 text-white' },
    { label: '6', value: '6', class: 'bg-[#3B82F6] border-blue-700 text-white' },
    { label: '5', value: '5', class: 'bg-[#3B82F6] border-blue-700 text-white' },
    { label: '4', value: '4', class: 'bg-[#111827] border-black text-white' },
    { label: '3', value: '3', class: 'bg-[#111827] border-black text-white' },
    { label: '2', value: '2', class: 'bg-white border-gray-200 border-b-gray-300 text-navy' },
    { label: '1', value: '1', class: 'bg-white border-gray-200 border-b-gray-300 text-navy' },
    { label: 'M', value: 'M', class: 'bg-gray-100 border-gray-200 border-b-gray-300 text-gray-500' },
]

const isEndComplete = (scores) => Array.isArray(scores) && scores.every(s => s !== '')

const calculateEndSum = (scores) => {
    return (scores || []).reduce((sum, val) => {
        if (!val) return sum
        if (val === 'X') return sum + 10
        if (val === 'M') return sum
        const n = parseInt(val)
        return Number.isFinite(n) ? sum + n : sum
    }, 0)
}

const setActiveArcher = (idx) => {
    activeArcherIndex.value = idx
    const a = scoringArchers.value[activeArcherIndex.value]
    const firstEmpty = a?.currentEndScores?.findIndex(s => s === '') ?? -1
    currentArrowIndex.value = firstEmpty === -1 ? 6 : firstEmpty
}

const inputScore = (val) => {
    const a = scoringArchers.value[activeArcherIndex.value]
    if (!a) return
    if (currentArrowIndex.value < 6) {
        a.currentEndScores[currentArrowIndex.value] = val
        currentArrowIndex.value++
    }
}

const deleteLastScore = () => {
    const a = scoringArchers.value[activeArcherIndex.value]
    if (!a) return
    if (currentArrowIndex.value > 0) {
        currentArrowIndex.value--
        a.currentEndScores[currentArrowIndex.value] = ''
    }
}

const clearCurrentArcher = () => {
    const a = scoringArchers.value[activeArcherIndex.value]
    if (!a) return
    a.currentEndScores = ['', '', '', '', '', '']
    currentArrowIndex.value = 0
}

const nextArcher = () => {
    if (scoringArchers.value.length === 0) return
    const next = (activeArcherIndex.value + 1) % scoringArchers.value.length
    setActiveArcher(next)
}

const canNextEnd = ref(false)
const recomputeCanNextEnd = () => {
    // can move next end if all assigned archers have 6 values filled (or there are no archers)
    const hasAny = scoringArchers.value.length > 0
    if (!hasAny) {
        canNextEnd.value = false
        return
    }
    canNextEnd.value = scoringArchers.value.every(a => isEndComplete(a.currentEndScores))
}

const nextEnd = () => {
    if (!activeTarget.value) return
    const maxEnd = activeTarget.value.total_ends || 12
    if (currentEnd.value < maxEnd) {
        currentEnd.value++
        // reset currentEndScores from API cache
        hydrateCurrentEndFromSaved()
        recomputeCanNextEnd()
        setActiveArcher(0)
    }
}

const archerScoresCache = ref({}) // { [assignmentId]: { scores: EndScore[] } }

const hydrateCurrentEndFromSaved = () => {
    for (const a of scoringArchers.value) {
        const cached = archerScoresCache.value[a.assignment_id]?.scores || []
        const end = cached.find(s => s.end_number === currentEnd.value)
        a.currentEndScores = [
            end?.arrow_1 || '',
            end?.arrow_2 || '',
            end?.arrow_3 || '',
            end?.arrow_4 || '',
            end?.arrow_5 || '',
            end?.arrow_6 || '',
        ]
        a.prevEnds = cached
            .filter(s => s.end_number < currentEnd.value)
            .slice(-3)
            .map(s => ({ end_number: s.end_number, end_total: s.end_total }))
    }
    const firstEmpty = scoringArchers.value?.[activeArcherIndex.value]?.currentEndScores?.findIndex(s => s === '') ?? -1
    currentArrowIndex.value = firstEmpty === -1 ? 6 : firstEmpty
}

const fetchAssignmentScores = async (assignmentId) => {
    const res = await get(`/qualification/scores/${assignmentId}`)
    return res?.scores || []
}

const saveActiveArcherEnd = async () => {
    const a = scoringArchers.value[activeArcherIndex.value]
    if (!a?.assignment_id) return
    if (!isEndComplete(a.currentEndScores)) {
        toast.error('Lengkapi 6 arrow terlebih dahulu')
        return
    }

    isSaving.value = true
    try {
        await put(`/qualification/scores/${a.assignment_id}`, {
            end_number: currentEnd.value,
            arrows: a.currentEndScores
        })
        toast.success('Skor tersimpan')

        // refresh cache for this archer + refresh progress
        const scores = await fetchAssignmentScores(a.assignment_id)
        archerScoresCache.value[a.assignment_id] = { scores }
        hydrateCurrentEndFromSaved()
        recomputeCanNextEnd()

        // refresh target progress numbers
        await loadTargets()
    } catch (e) {
        console.error('Failed to save score:', e)
        toast.error(e?.response?._data?.error || e?.data?.error || 'Gagal menyimpan skor')
    } finally {
        isSaving.value = false
    }
}


const fetchEventDetails = async () => {
    try {
        const eventRes = await get(`/events/${eventId}`)
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const fetchEventCategories = async () => {
    try {
        const response = await get(`/events/${eventId}/categories`)
        if (response && response.events && Array.isArray(response.events)) {
            eventCategories.value = response.events.map(cat => ({
                id: cat.id,
                category_name: cat.category_name,
                division_name: cat.division_name,
                event_type_name: cat.event_type_name,
                gender_division_name: cat.gender_division_name
            }))

            // Auto-select phase and first category
            scoringContext.value.phase = 'qualification'
            if (eventCategories.value.length > 0) {
                scoringContext.value.categoryId = eventCategories.value[0].id
                // Scoring cards will be fetched by the watcher
            }
        }
    } catch (error) {
        console.error('Failed to fetch event categories:', error)
    }
}

const fetchScoringCards = async () => {
    if (!scoringContext.value.phase || !scoringContext.value.categoryId) {
        scoringCards.value = []
        return
    }

    isLoadingCards.value = true
    try {
        const res = await get(`/events/${eventId}/scoring/cards?phase=${scoringContext.value.phase}&category_id=${scoringContext.value.categoryId}`)
        scoringCards.value = res?.cards || []

        // Auto-select first target card
        if (scoringCards.value.length > 0) {
            scoringContext.value.cardId = scoringCards.value[0].id
            loadTargets()
        }
    } catch (e) {
        console.error('Failed to fetch scoring cards:', e)
        scoringCards.value = []
    } finally {
        isLoadingCards.value = false
    }
}

const loadTargets = async () => {
    if (!scoringContext.value.phase || !scoringContext.value.categoryId || !scoringContext.value.cardId) {
        targets.value = []
        return
    }

    isLoading.value = true
    try {
        // Find selected card context (includes session_id + target_number)
        const card = scoringCards.value.find(c => c.id === scoringContext.value.cardId)
        if (!card) {
            targets.value = []
            return
        }

        if (scoringContext.value.phase === 'qualification') {
            const res = await get(`/scoring/targets?phase=qualification&session_id=${card.session_id}&target_number=${card.target_number}`)
            targets.value = res?.targets || []
            activeTarget.value = targets.value?.[0] || null

            // Build archer list for keypad UI
            const archers = (activeTarget.value?.archers || []).map(a => ({
                assignment_id: a.assignment_id,
                participant_id: a.participant_id,
                position: a.position,
                name: a.name,
                division: a.division,
                current_score: a.current_score,
                ends_completed: a.ends_completed,
                currentEndScores: ['', '', '', '', '', ''],
                prevEnds: []
            }))
            scoringArchers.value = archers
            activeArcherIndex.value = 0

            // Determine current end = max ends_completed + 1 (but at least 1)
            const maxCompleted = Math.max(0, ...archers.map(a => a.ends_completed || 0))
            currentEnd.value = Math.min((activeTarget.value?.total_ends || 12), maxCompleted + 1)

            // Fetch per-assignment saved ends (needed for prev + current end hydration)
            archerScoresCache.value = {}
            await Promise.all(
                archers.map(async (a) => {
                    const scores = await fetchAssignmentScores(a.assignment_id)
                    archerScoresCache.value[a.assignment_id] = { scores }
                })
            )
            hydrateCurrentEndFromSaved()
            recomputeCanNextEnd()
        } else {
            // TODO: elimination scoring targets
            targets.value = []
            activeTarget.value = null
            scoringArchers.value = []
        }
    } catch (error) {
        console.error('Failed to load targets:', error)
        targets.value = []
    } finally {
        isLoading.value = false
    }
}

// (Removed legacy progress-table helpers; scoring happens in the workspace UI above)

// Scoring is handled directly on this page (no separate /input page).

watch(() => scoringContext.value.categoryId, () => {
    scoringContext.value.cardId = ''
    fetchScoringCards()
})

watch(() => scoringContext.value.phase, () => {
    scoringContext.value.cardId = ''
    fetchScoringCards()
})

onMounted(() => {
    fetchEventDetails()
    fetchEventCategories()
})
</script>

<style scoped>
.shadow-key {
    box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.1);
}
</style>
