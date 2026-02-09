<template>
    <div class="space-y-6">
        <!-- Scoring Interface -->
        <div v-if="selectedCategory && targetAssignments.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Archers List -->
            <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                <div v-for="group in groupedAssignments" :key="group.number" class="space-y-4">
                    <!-- Target Divider -->
                    <div class="flex items-center gap-4 pt-4 pb-2">
                        <div class="flex-1 h-px bg-gray-200"></div>
                        <div
                            class="bg-gray-50 px-4 py-1.5 rounded-full border border-gray-200 flex items-center gap-2 shadow-sm">
                            <Icon icon="ph:target-bold" class="text-navy/40 text-sm" />
                            <span class="text-[10px] font-black text-navy uppercase tracking-widest">Target {{
                                group.number }}</span>
                        </div>
                        <div class="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <div v-for="assignment in group.assignments" :key="assignment.uuid"
                        @click="selectArcherForScoring(assignment)" :class="[
                            'bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all cursor-pointer relative',
                            currentScoringAssignment?.uuid === assignment.uuid
                                ? 'border-primary ring-2 ring-primary/20'
                                : 'border-gray-100 hover:border-gray-200'
                        ]">
                        <div
                            :class="['absolute top-0 left-0 w-1.5 h-full', currentScoringAssignment?.uuid === assignment.uuid ? 'bg-primary' : 'bg-gray-100']">
                        </div>
                        <div class="p-5 pl-7 relative">
                            <div class="flex justify-between items-center mb-4">
                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                    <img :src="useImageOrDefault(assignment.archer_avatar_url || assignment.avatar_url, assignment.archer_name)"
                                        :alt="assignment.archer_name"
                                        class="size-9 sm:size-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2 mb-0.5">
                                            <span
                                                class="bg-navy text-primary text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">
                                                {{ assignment.target_name }}
                                            </span>
                                            <h3 class="text-base font-black text-navy leading-tight truncate">{{
                                                assignment.archer_name }}</h3>
                                        </div>
                                        <div
                                            class="text-[10px] text-gray-400 font-bold truncate uppercase tracking-tighter">
                                            {{ assignment.club_name || 'Independen' }}
                                        </div>
                                    </div>
                                </div>
                                <div v-if="currentScoringAssignment?.uuid === assignment.uuid"
                                    class="flex items-center gap-2 ml-3 flex-shrink-0">
                                    <button @click.stop="goPrevEnd" :disabled="(assignment.currentEnd || 1) <= 1"
                                        class="size-8 sm:size-9 rounded-lg border border-gray-300 bg-white text-navy flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                        <Icon icon="ph:arrow-left" class="text-base" />
                                    </button>
                                    <button v-if="(assignment.currentEnd || 1) < (sessionData?.total_ends || 0)"
                                        @click.stop="goNextEnd"
                                        class="size-8 sm:size-9 rounded-lg bg-primary text-navy flex items-center justify-center hover:bg-primary/90 transition-colors">
                                        <Icon icon="ph:arrow-right" class="text-base" />
                                    </button>
                                </div>
                            </div>

                            <!-- Current End Display -->
                            <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                <div class="flex justify-between items-center mb-3">
                                    <div class="flex items-center gap-2">
                                        <span class="text-sm sm:text-base font-black text-navy">
                                            Rambahan {{ assignment.currentEnd || 1 }}
                                        </span>
                                        <span class="text-xs font-semibold text-gray-500">/ {{ sessionData?.total_ends
                                            || 0
                                            }}</span>
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                                        {{ sessionData?.arrows_per_end || 0 }} Anak Panah
                                    </span>
                                </div>
                                <div class="flex gap-2 sm:gap-3">
                                    <!-- Box Score Input -->
                                    <div v-for="(score, i) in sessionData?.arrows_per_end || 0" :key="i"
                                        @click.stop="selectArrowBox(assignment, i)" :class="[
                                            'flex-1 aspect-square rounded-lg shadow-sm flex items-center justify-center text-lg sm:text-xl font-bold cursor-pointer transition-all',
                                            assignment.currentEndScores && assignment.currentEndScores[i] !== undefined
                                                ? 'bg-white border-2 border-gray-200 text-navy'
                                                : 'bg-gray-100 border-dashed border-2 border-gray-300 text-gray-400',
                                            currentScoringAssignment?.uuid === assignment.uuid && selectedArrowIndex === i
                                                ? 'ring-2 ring-primary border-primary bg-primary/5'
                                                : ''
                                        ]">
                                        {{ (assignment.currentEndScores && assignment.currentEndScores[i] !==
                                            undefined)
                                            ? assignment.currentEndScores[i] : '' }}
                                    </div>
                                    <div class="w-px bg-gray-300 mx-1"></div>
                                    <div
                                        class="flex-1 aspect-square bg-navy text-primary rounded-lg flex flex-col items-center justify-center shadow-sm">
                                        <span class="text-lg sm:text-xl font-bold">{{
                                            calculateEndSum(assignment.currentEndScores) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-if="!targetAssignments || targetAssignments.length === 0"
                    class="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <Icon icon="ph:users" class="text-5xl text-gray-300 mx-auto mb-4" />
                    <p class="text-gray-500 font-bold uppercase text-xs tracking-widest">Belum ada pemanah yang
                        ditugaskan</p>
                </div>
            </div>

            <!-- Scoring Keypad -->
            <div class="lg:col-span-5 xl:col-span-4">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-6">
                    <div class="flex justify-between items-center mb-5">
                        <h3 class="font-bold text-navy flex items-center gap-2">
                            <Icon icon="ph:keyboard" class="text-xl" />
                            Input Cepat
                        </h3>
                    </div>

                    <!-- Score Buttons -->
                    <div class="grid grid-cols-3 gap-3 mb-4">
                        <button v-for="val in ['X', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'M']" :key="val"
                            @click="addScore(val)" :disabled="!currentScoringAssignment" :class="[
                                'key-btn h-12 sm:h-16 rounded-lg border-b-4 text-xl sm:text-2xl font-black transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed',
                                val === 'X' || val === 10 || val === 9 ? 'bg-[#FFE500] border-[#e6ce00] text-navy' :
                                    val === 8 || val === 7 ? 'bg-[#EF4444] border-red-700 text-white' :
                                        val === 6 || val === 5 ? 'bg-[#3B82F6] border-blue-700 text-white' :
                                            val === 4 || val === 3 ? 'bg-[#111827] border-gray-900 text-white' :
                                                val === 'M' ? 'bg-gray-100 border-gray-300 text-gray-500' : 'bg-white border-gray-300 text-navy'
                            ]">
                            {{ val }}
                        </button>
                    </div>

                    <!-- Action Buttons -->
                    <div class="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button @click="deleteLastScore"
                            :disabled="!currentScoringAssignment || !currentScoringAssignment.currentEndScores?.some(v => v !== undefined)"
                            class="flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 bg-white text-navy font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                            <Icon icon="ph:backspace" class="text-lg" />
                            Hapus
                        </button>
                        <button @click="saveEndAndNext" :disabled="saving || !currentScoringAssignment"
                            class="flex items-center justify-center gap-2 h-12 rounded-lg bg-navy text-white font-bold hover:bg-navy/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                            <span v-if="saving" class="inline-flex items-center gap-2">
                                <span
                                    class="size-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                                Menyimpan...
                            </span>
                            <span v-else class="inline-flex items-center gap-2">
                                Simpan
                                <Icon icon="ph:check" class="text-lg" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Icon icon="ph:users" class="text-5xl text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500" v-if="!selectedCategory">Pilih kategori untuk input nilai</p>
            <p class="text-gray-500" v-else>Belum ada pemanah yang ditugaskan ke target</p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, watch, computed } from 'vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

const props = defineProps({
    sessionData: { type: Object, required: true },
    selectedCategory: { type: String, required: true },
    targetAssignments: { type: Array, default: () => [] }
})

const emit = defineEmits(['updated'])

const { post } = useApi()
const toast = useToast()

const saving = ref(false)
const currentScoringAssignment = ref(null)
const selectedArrowIndex = ref(0) // Track which arrow box is being edited

const initEndScores = (assignment) => {
    if (!assignment.currentEndScores) {
        const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
        assignment.currentEndScores = Array(arrowsPerEnd).fill(undefined)
    }
    // Set selected index to first empty box or 0
    const emptyIdx = assignment.currentEndScores.findIndex(v => v === undefined)
    selectedArrowIndex.value = emptyIdx === -1 ? 0 : emptyIdx
}

// Initialize currentScoringAssignment
watch(() => props.targetAssignments, (newVal) => {
    if (newVal?.length > 0) {
        // Sort assignments to find the visual "first" (Target 1A, etc)
        const sorted = [...newVal].sort((a, b) => {
            const numA = parseInt((a.target_name || '').match(/\d+/)?.[0] || 0)
            const numB = parseInt((b.target_name || '').match(/\d+/)?.[0] || 0)
            if (numA !== numB) return numA - numB
            return (a.target_name || '').localeCompare(b.target_name || '')
        })

        // Find if current assignment is still in the new list
        const exists = newVal.find(a => a.uuid === currentScoringAssignment.value?.uuid)
        if (!exists) {
            // If not available or first run, select the first one from sorted list
            currentScoringAssignment.value = sorted[0]
            if (sorted[0]) initEndScores(sorted[0])
        } else {
            // If it exists, update the reference to keep scores in sync with the prop
            currentScoringAssignment.value = exists
        }
    } else {
        currentScoringAssignment.value = null
    }
}, { immediate: true, deep: true })

const groupedAssignments = computed(() => {
    const groups = {}
    props.targetAssignments.forEach(a => {
        const match = (a.target_name || '').match(/\d+/)
        const num = match ? parseInt(match[0]) : 0
        if (!groups[num]) {
            groups[num] = []
        }
        groups[num].push(a)
    })

    return Object.keys(groups)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map(num => ({
            number: num,
            assignments: groups[num].sort((a, b) => (a.target_name || '').localeCompare(b.target_name || ''))
        }))
})

const selectArcherForScoring = (assignment) => {
    currentScoringAssignment.value = assignment
    initEndScores(assignment)
}

const selectArrowBox = (assignment, index) => {
    if (currentScoringAssignment.value?.uuid !== assignment.uuid) {
        currentScoringAssignment.value = assignment
        // If we don't have scores yet, initialize them
        if (!assignment.currentEndScores) {
            const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
            assignment.currentEndScores = Array(arrowsPerEnd).fill(undefined)
        }
    }
    selectedArrowIndex.value = index
}

const addScore = (score) => {
    if (!currentScoringAssignment.value) return
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6

    if (!currentScoringAssignment.value.currentEndScores) {
        currentScoringAssignment.value.currentEndScores = Array(arrowsPerEnd).fill(undefined)
    }

    const scores = currentScoringAssignment.value.currentEndScores

    // Insert at selected index using splice for reactivity
    // We store the literal score ('X', 10, etc.) to distinguish for display
    scores.splice(selectedArrowIndex.value, 1, score)

    // Move to next index
    if (selectedArrowIndex.value < arrowsPerEnd - 1) {
        selectedArrowIndex.value++
    }
}

const deleteLastScore = () => {
    const scores = currentScoringAssignment.value?.currentEndScores
    if (!scores) return

    // Clear current selected box using splice for reactivity
    scores.splice(selectedArrowIndex.value, 1, undefined)

    // Move back if not at 0
    if (selectedArrowIndex.value > 0) {
        selectedArrowIndex.value--
    }
}

const calculateEndSum = (scores) => {
    if (!scores || !scores.length) return 0
    return scores.reduce((sum, score) => {
        if (score === undefined || score === null) return sum
        if (score === 'X') return sum + 10
        if (score === 'M') return sum + 0
        return sum + (parseInt(score) || 0)
    }, 0)
}

const isAssignmentEndComplete = (assignment) => {
    if (!assignment) return false
    const scores = assignment.currentEndScores || []
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6
    if (scores.length < arrowsPerEnd) return false
    return scores.slice(0, arrowsPerEnd).every((v) => v !== undefined && v !== null)
}

const goToEnd = (endNumber) => {
    if (!currentScoringAssignment.value) return
    const prevEnd = currentScoringAssignment.value.currentEnd || 1

    // Ensure allEndScores exists
    if (!currentScoringAssignment.value.allEndScores) {
        currentScoringAssignment.value.allEndScores = {}
    }

    // Preserve unsaved scores in local memory before switching ends
    if (currentScoringAssignment.value.currentEndScores) {
        currentScoringAssignment.value.allEndScores[prevEnd] = [...currentScoringAssignment.value.currentEndScores]
    }

    currentScoringAssignment.value.currentEnd = endNumber

    const saved = currentScoringAssignment.value.allEndScores[endNumber]
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6

    if (saved && saved.length > 0) {
        currentScoringAssignment.value.currentEndScores = [...saved]
    } else {
        currentScoringAssignment.value.currentEndScores = Array(arrowsPerEnd).fill(undefined)
    }

    // Reset selection to start of end
    selectedArrowIndex.value = 0
}

const goPrevEnd = () => {
    if (!currentScoringAssignment.value) return
    const currentEnd = currentScoringAssignment.value.currentEnd || 1
    if (currentEnd <= 1) return
    goToEnd(currentEnd - 1)
}

const goNextEnd = () => {
    if (!currentScoringAssignment.value) return
    const totalEnds = props.sessionData?.total_ends || 0
    const currentEnd = currentScoringAssignment.value.currentEnd || 1
    if (currentEnd >= totalEnds) return
    goToEnd(currentEnd + 1)
}

const saveEndAndNext = async () => {
    if (!currentScoringAssignment.value) return

    saving.value = true
    try {
        const assignment = currentScoringAssignment.value
        const endsToSave = []
        const currentEnd = assignment.currentEnd || 1

        // 1. Ensure current view is captured in our local memory cache
        if (assignment.currentEndScores) {
            if (!assignment.allEndScores) assignment.allEndScores = {}
            assignment.allEndScores[currentEnd] = [...assignment.currentEndScores]
        }

        // 2. Collect all ends that have at least one valid score
        if (assignment.allEndScores) {
            Object.keys(assignment.allEndScores).forEach(endStr => {
                const endNum = parseInt(endStr)
                const scores = assignment.allEndScores[endStr]

                // Only save ends that have any value
                if (scores && scores.some(s => s !== undefined && s !== null)) {
                    endsToSave.push({
                        end_number: endNum,
                        arrows: scores.map(s => {
                            if (s === undefined || s === null) return "M"
                            return String(s === 10 ? 'X' : s)
                        })
                    })
                }
            })
        }

        if (endsToSave.length === 0) {
            toast.info('Belum ada nilai yang diinput')
            saving.value = false
            return
        }

        await post(`/qualification/assignments/${assignment.uuid}/scores`, {
            ends: endsToSave
        })

        // Success - UI Feedback & Navigation
        toast.success('Nilai berhasil disimpan')

        // Auto-advance logic
        if (isAssignmentEndComplete(assignment)) {
            if (currentEnd < (props.sessionData?.total_ends || 0)) {
                // Move to next end for the same archer
                goToEnd(currentEnd + 1)
            } else {
                // Archer finished all ends, move to next archer in list
                const currentIndex = props.targetAssignments.findIndex(a => a.uuid === assignment.uuid)
                if (currentIndex < props.targetAssignments.length - 1) {
                    const nextArcher = props.targetAssignments[currentIndex + 1]
                    currentScoringAssignment.value = nextArcher
                    initEndScores(nextArcher)
                    toast.info(`Berpindah ke: ${nextArcher.archer_name}`)
                } else {
                    toast.success('Semua pemanah dalam kategori ini selesai!')
                }
            }
        }

        emit('updated')
    } catch (error) {
        console.error('Failed to save score:', error)
        toast.error('Gagal menyimpan nilai')
    } finally {
        saving.value = false
    }
}
</script>

<style scoped>
.key-btn:active {
    transform: translateY(2px);
    border-bottom-width: 0;
}
</style>
