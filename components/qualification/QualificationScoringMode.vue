<template>
    <div class="space-y-6">
        <!-- Scoring Interface -->
        <div v-if="selectedCategory && targetAssignments.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Archers List -->
            <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
                <div v-for="(assignment, index) in targetAssignments" :key="assignment.uuid"
                    @click="selectArcherForScoring(assignment)" :class="[
                        'bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all cursor-pointer',
                        currentScoringAssignment?.uuid === assignment.uuid
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-gray-100 hover:border-gray-200'
                    ]">
                    <div
                        :class="['absolute top-0 left-0 w-2 h-full', currentScoringAssignment?.uuid === assignment.uuid ? 'bg-primary' : 'bg-gray-200']">
                    </div>
                    <div class="p-5 pl-7 relative">
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <img :src="useImageOrDefault(assignment.archer_avatar_url || assignment.avatar_url, assignment.archer_name)"
                                    :alt="assignment.archer_name"
                                    class="size-9 sm:size-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                                <div class="min-w-0">
                                    <h3 class="text-base sm:text-lg font-bold text-navy leading-tight">{{
                                        assignment.archer_name }}</h3>
                                    <div class="text-xs text-gray-500 font-medium truncate">
                                        Target {{ assignment.target_name }}
                                        <span v-if="assignment.club_name" class="opacity-30 mx-1.5">•</span>
                                        <span v-if="assignment.club_name">{{ assignment.club_name }}</span>
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
                                        End {{ assignment.currentEnd || 1 }}
                                    </span>
                                    <span class="text-xs font-semibold text-gray-500">/ {{ sessionData?.total_ends || 0
                                    }}</span>
                                </div>
                                <span class="text-[10px] font-bold text-gray-400 tracking-wider">
                                    {{ sessionData?.arrows_per_end || 0 }} Arrows
                                </span>
                            </div>
                            <div class="flex gap-2 sm:gap-3">
                                <div v-for="(score, i) in sessionData?.arrows_per_end || 0" :key="i" :class="[
                                    'flex-1 aspect-square rounded-lg shadow-sm flex items-center justify-center text-lg sm:text-xl font-bold',
                                    assignment.currentEndScores && assignment.currentEndScores[i - 1] !== undefined
                                        ? 'bg-white border-2 border-gray-200 text-navy'
                                        : 'bg-gray-100 border-dashed border-2 border-gray-300 text-gray-400'
                                ]">
                                    {{ (assignment.currentEndScores && assignment.currentEndScores[i - 1] !== undefined)
                                        ?
                                        (assignment.currentEndScores[i - 1] === 10 ? 'X' : (assignment.currentEndScores[i -
                                            1] === 0 ? 'M' :
                                            assignment.currentEndScores[i - 1])) : '' }}
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

                <div v-if="!targetAssignments || targetAssignments.length === 0"
                    class="bg-white rounded-xl border border-gray-100 p-12 text-center">
                    <Icon icon="ph:users" class="text-5xl text-gray-300 mx-auto mb-4" />
                    <p class="text-gray-500">No archers assigned to targets yet</p>
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
                        <button @click="saveEndAndNext"
                            :disabled="!isAssignmentEndComplete(currentScoringAssignment) || saving"
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
import { ref, watch } from 'vue'
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

// Initialize currentScoringAssignment
watch(() => props.targetAssignments, (newVal) => {
    if (newVal?.length > 0 && !currentScoringAssignment.value) {
        currentScoringAssignment.value = newVal[0]
    }
}, { immediate: true })

const selectArcherForScoring = (assignment) => {
    currentScoringAssignment.value = assignment
}

const addScore = (score) => {
    if (!currentScoringAssignment.value) return
    const numericScore = score === 'X' ? 10 : (score === 'M' ? 0 : score)
    const arrowsPerEnd = props.sessionData?.arrows_per_end || 6

    if (!currentScoringAssignment.value.currentEndScores) {
        currentScoringAssignment.value.currentEndScores = []
    }

    const scores = currentScoringAssignment.value.currentEndScores
    const emptyIndex = scores.findIndex((v) => v === undefined)

    if (emptyIndex !== -1) {
        scores[emptyIndex] = numericScore
    } else if (scores.length < arrowsPerEnd) {
        scores.push(numericScore)
    }
}

const deleteLastScore = () => {
    if (!currentScoringAssignment.value?.currentEndScores) return
    const scores = currentScoringAssignment.value.currentEndScores
    for (let i = scores.length - 1; i >= 0; i -= 1) {
        if (scores[i] !== undefined) {
            scores[i] = undefined
            break
        }
    }
}

const calculateEndSum = (scores) => {
    if (!scores || !scores.length) return 0
    return scores.reduce((sum, score) => sum + (score || 0), 0)
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
    currentScoringAssignment.value.currentEnd = endNumber
    const saved = currentScoringAssignment.value.allEndScores?.[endNumber]
    currentScoringAssignment.value.currentEndScores = saved ? [...saved] : []
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
    if (!currentScoringAssignment.value || !currentScoringAssignment.value.currentEndScores?.length) return

    saving.value = true
    try {
        const endNumber = currentScoringAssignment.value.currentEnd
        const scores = currentScoringAssignment.value.currentEndScores
        const filledScores = (scores || []).filter((score) => score !== undefined && score !== null)

        const arrows = filledScores.map(score => {
            if (score === 10) return 'X'
            if (score === 0) return 'M'
            return String(score)
        })

        await post(`/qualification/assignments/${currentScoringAssignment.value.uuid}/scores`, {
            end_number: endNumber,
            arrows: arrows
        })

        if (!currentScoringAssignment.value.allEndScores) {
            currentScoringAssignment.value.allEndScores = {}
        }
        currentScoringAssignment.value.allEndScores[endNumber] = [...scores]

        if (endNumber < props.sessionData.total_ends) {
            currentScoringAssignment.value.currentEnd = endNumber + 1
            currentScoringAssignment.value.currentEndScores = []
        } else {
            const currentIndex = props.targetAssignments.findIndex(a => a.uuid === currentScoringAssignment.value.uuid)
            if (currentIndex < props.targetAssignments.length - 1) {
                currentScoringAssignment.value = props.targetAssignments[currentIndex + 1]
            } else {
                toast.success('Semua pemanah selesai!')
            }
        }

        toast.success('Nilai berhasil disimpan')
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
