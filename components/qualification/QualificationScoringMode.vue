<template>
    <div class="space-y-8">
        <!-- Scoring Interface -->
        <div v-if="selectedCategory && targetAssignments.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Archers List -->
            <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                <div v-for="group in groupedAssignments" :key="group.number" class="space-y-4">
                    <!-- Target Divider -->
                    <div class="flex items-center gap-4 pt-4 pb-1">
                        <div class="flex-1 h-px bg-gray-100"></div>
                        <div
                            class="bg-navy text-primary px-5 py-1.5 rounded-xl border border-white/5 flex items-center gap-2 shadow-sm">
                            <Icon icon="ph:target-bold" class="text-xs" />
                            <span class="text-[10px] font-black uppercase tracking-widest">Bantalan {{
                                group.number }}</span>
                        </div>
                        <div class="flex-1 h-px bg-gray-100"></div>
                    </div>

                    <div v-for="assignment in group.assignments" :key="assignment.uuid"
                        @click="selectArcherForScoring(assignment)" :class="[
                            'bg-white rounded-[2rem] shadow-sm border-2 overflow-hidden transition-all cursor-pointer relative',
                            currentScoringAssignment?.uuid === assignment.uuid
                                ? 'border-primary ring-4 ring-primary/5'
                                : 'border-gray-50 hover:border-gray-200'
                        ]">
                        <!-- Selection Indicator Stripe -->
                        <div
                            :class="['absolute top-0 left-0 w-1.5 h-full transition-colors duration-500', currentScoringAssignment?.uuid === assignment.uuid ? 'bg-primary' : 'bg-gray-100']">
                        </div>

                        <div class="p-5 sm:p-6 pl-8 sm:pl-10 relative">
                            <div class="flex justify-between items-center mb-4">
                                <div class="flex items-center gap-4 flex-1 min-w-0">
                                    <div class="relative group">
                                        <img :src="useImageOrDefault(assignment.archer_avatar_url || assignment.avatar_url, assignment.archer_name)"
                                            :alt="assignment.archer_name"
                                            class="size-11 sm:size-12 rounded-xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105" />
                                        <div v-if="currentScoringAssignment?.uuid === assignment.uuid"
                                            class="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-white animate-pulse">
                                        </div>
                                    </div>
                                    <div class="min-w-0">
                                        <div class="flex items-center gap-2.5 mb-0.5">
                                            <span
                                                class="bg-navy text-primary text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-sm tracking-wider">
                                                {{ assignment.target_name }}
                                            </span>
                                            <h3
                                                class="text-base sm:text-lg font-black text-navy leading-tight truncate">
                                                {{ assignment.archer_name }}</h3>
                                        </div>
                                        <div
                                            class="text-[9px] sm:text-[10px] text-gray-400 font-bold truncate uppercase tracking-widest">
                                            {{ assignment.club_name || 'Independen' }}
                                        </div>
                                    </div>
                                </div>

                                <!-- End Navigation (only for active archer) -->
                                <div v-if="currentScoringAssignment?.uuid === assignment.uuid"
                                    class="flex items-center gap-1.5 ml-4 flex-shrink-0">
                                    <button @click.stop="goPrevEnd" :disabled="(assignment.currentEnd || 1) <= 1"
                                        class="size-9 rounded-xl border-2 border-slate-100 bg-white text-navy flex items-center justify-center hover:bg-slate-50 transition-all disabled:opacity-20 active:scale-95 shadow-sm">
                                        <Icon icon="ph:caret-left-bold" class="text-lg" />
                                    </button>
                                    <div class="px-2 text-center min-w-[50px]">
                                        <div class="text-[8px] font-black text-gray-300 uppercase leading-none mb-0.5">
                                            End
                                        </div>
                                        <div class="text-sm font-black text-navy">{{ assignment.currentEnd || 1 }}
                                        </div>
                                    </div>
                                    <button v-if="(assignment.currentEnd || 1) < (sessionData?.total_ends || 0)"
                                        @click.stop="goNextEnd"
                                        class="size-9 rounded-xl bg-navy text-primary flex items-center justify-center hover:bg-navy/95 transition-all active:scale-95 shadow-sm shadow-navy/20">
                                        <Icon icon="ph:caret-right-bold" class="text-lg" />
                                    </button>
                                </div>
                            </div>

                            <!-- Current End Display area -->
                            <div class="bg-slate-50/50 rounded-[1.5rem] p-4 sm:p-5 border border-slate-100 relative overflow-hidden group/end"
                                :class="{ 'ring-2 ring-primary/10 bg-white shadow-inner': currentScoringAssignment?.uuid === assignment.uuid }">

                                <div class="flex justify-between items-center mb-4">
                                    <div class="flex items-center gap-2.5">
                                        <div
                                            class="size-7 rounded-lg bg-navy text-primary flex items-center justify-center shadow-sm group-hover/end:rotate-6 transition-transform">
                                            <Icon icon="ph:scroll-bold" class="text-[10px]" />
                                        </div>
                                        <span
                                            class="text-[10px] sm:text-[11px] font-black text-navy tracking-tight uppercase">
                                            Penilaian Rambahan {{ assignment.currentEnd || 1 }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex flex-wrap gap-2.5 sm:gap-3">
                                    <div v-for="(score, i) in sessionData?.arrows_per_end || 0" :key="i"
                                        @click.stop="selectArrowBox(assignment, i)" :class="[
                                            'size-11 sm:size-13 rounded-xl shadow-sm flex items-center justify-center text-lg font-black cursor-pointer transition-all duration-300 relative border-2',
                                            assignment.currentEndScores && assignment.currentEndScores[i] !== undefined
                                                ? 'bg-white border-slate-100 text-navy'
                                                : 'bg-white/50 border-dashed border-slate-200 text-gray-300',
                                            currentScoringAssignment?.uuid === assignment.uuid && selectedArrowIndex === i
                                                ? 'border-primary bg-white shadow-sm scale-110 z-10'
                                                : 'hover:border-slate-300'
                                        ]">
                                        <span class="text-navy">
                                            {{ (assignment.currentEndScores && assignment.currentEndScores[i] !==
                                                undefined)
                                                ? assignment.currentEndScores[i] : '' }}
                                        </span>

                                        <!-- Focus Indicator -->
                                        <Icon
                                            v-if="currentScoringAssignment?.uuid === assignment.uuid && selectedArrowIndex === i"
                                            icon="ph:caret-down-fill"
                                            class="absolute -top-5 text-primary animate-bounce text-sm" />

                                        <div v-if="assignment.currentEndScores?.[i] === undefined && !(currentScoringAssignment?.uuid === assignment.uuid && selectedArrowIndex === i)"
                                            class="size-1.5 rounded-full bg-slate-200"></div>
                                    </div>

                                    <!-- End Summary -->
                                    <div class="flex-1 flex flex-col items-end justify-center min-w-[60px]">
                                        <span
                                            class="text-[8px] font-black text-slate-300 tracking-[0.2em] mb-0.5 uppercase">TOTAL</span>
                                        <div
                                            class="size-11 sm:size-13 bg-navy text-primary rounded-xl flex flex-col items-center justify-center shadow-sm shadow-navy/10 transform hover:scale-105 transition-transform">
                                            <span class="text-lg font-black leading-none">{{
                                                calculateEndSum(assignment.currentEndScores) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Guidance / Empty List -->
                <div v-if="!targetAssignments || targetAssignments.length === 0"
                    class="bg-white rounded-[3rem] border-4 border-dashed border-slate-100 p-20 text-center flex flex-col items-center justify-center">
                    <div class="size-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                        <Icon icon="ph:users-bold" class="text-3xl text-gray-300" />
                    </div>
                    <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest leading-relaxed max-w-xs">
                        Belum ada pemanah yang ditugaskan
                    </p>
                </div>
            </div>

            <!-- Scoring Keypad -->
            <div class="lg:col-span-5 xl:col-span-4">
                <div class="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-6 sm:p-8 sticky top-6">
                    <div class="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                        <h3 class="font-black text-sm text-navy flex items-center gap-2">
                            <Icon icon="ph:keypad-fill" class="text-lg text-primary" />
                            Numerical Keypad
                        </h3>
                        <span class="text-[9px] font-black text-slate-300 tracking-[0.2em] uppercase">Tactical</span>
                    </div>

                    <!-- Score Buttons Grid -->
                    <div class="grid grid-cols-3 gap-3 mb-6">
                        <button v-for="val in ['X', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'M']" :key="val"
                            @click="addScore(val)" :disabled="!currentScoringAssignment"
                            class="aspect-square rounded-2xl border-b-[6px] text-lg font-black transition-all active:border-b-0 active:translate-y-[6px] disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5 shadow-sm"
                            :class="[getScoreKeypadClass(val)]">
                            {{ val }}
                        </button>
                    </div>

                    <!-- Action Buttons -->
                    <div class="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-100">
                        <button @click="deleteLastScore"
                            :disabled="!currentScoringAssignment || !currentScoringAssignment.currentEndScores?.some(v => v !== undefined)"
                            class="flex items-center justify-center gap-2 h-14 rounded-xl border-2 border-slate-100 bg-white text-navy font-black hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-30 group">
                            <Icon icon="ph:backspace-bold" class="text-lg group-active:scale-90 transition-transform" />
                            <span class="text-[10px] tracking-widest uppercase">HAPUS</span>
                        </button>
                        <button @click="saveEndAndNext" :disabled="saving || !currentScoringAssignment"
                            class="flex items-center justify-center gap-2 h-14 rounded-xl bg-navy text-primary font-black hover:bg-navy/95 transition-all shadow-sm shadow-navy/10 disabled:opacity-30 group">
                            <span v-if="saving" class="inline-flex items-center gap-2">
                                <span
                                    class="size-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></span>
                            </span>
                            <span v-else class="inline-flex items-center gap-2">
                                <span class="text-[10px] tracking-widest uppercase">SIMPAN</span>
                                <Icon icon="ph:paper-plane-right-fill"
                                    class="text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Empty Global State -->
        <div v-else
            class="bg-white rounded-[3rem] border-4 border-dashed border-slate-100 p-24 text-center flex flex-col items-center justify-center shadow-inner">
            <div class="size-24 rounded-[3rem] bg-slate-50 flex items-center justify-center mb-6 relative group">
                <div
                    class="absolute inset-0 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                </div>
                <Icon icon="ph:folder-user-bold" class="text-4xl text-gray-300 relative z-10" />
            </div>
            <h2 class="text-xl font-black text-navy tracking-tight mb-2">Kategori Belum Dipilih</h2>
            <p class="text-gray-400 font-medium max-w-xs mx-auto text-sm">
                Pilih kategori dan sesi untuk memulai input skor.
            </p>
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
    const emptyIdx = assignment.currentEndScores.findIndex(v => v === undefined)
    selectedArrowIndex.value = emptyIdx === -1 ? 0 : emptyIdx
}

watch(() => props.targetAssignments, (newVal) => {
    if (newVal?.length > 0) {
        const sorted = [...newVal].sort((a, b) => {
            const numA = parseInt((a.target_name || '').match(/\d+/)?.[0] || 0)
            const numB = parseInt((b.target_name || '').match(/\d+/)?.[0] || 0)
            if (numA !== numB) return numA - numB
            return (a.target_name || '').localeCompare(b.target_name || '')
        })

        const exists = newVal.find(a => a.uuid === currentScoringAssignment.value?.uuid)
        if (!exists) {
            currentScoringAssignment.value = sorted[0]
            if (sorted[0]) initEndScores(sorted[0])
        } else {
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
    scores.splice(selectedArrowIndex.value, 1, score)

    if (selectedArrowIndex.value < arrowsPerEnd - 1) {
        selectedArrowIndex.value++
    }
}

const deleteLastScore = () => {
    const scores = currentScoringAssignment.value?.currentEndScores
    if (!scores) return
    scores.splice(selectedArrowIndex.value, 1, undefined)
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
    if (!currentScoringAssignment.value.allEndScores) {
        currentScoringAssignment.value.allEndScores = {}
    }
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
        const currentEndNum = assignment.currentEnd || 1

        if (assignment.currentEndScores) {
            if (!assignment.allEndScores) assignment.allEndScores = {}
            assignment.allEndScores[currentEndNum] = [...assignment.currentEndScores]
        }

        if (assignment.allEndScores) {
            Object.keys(assignment.allEndScores).forEach(endStr => {
                const endNum = parseInt(endStr)
                const scores = assignment.allEndScores[endStr]
                if (scores && scores.some(s => s !== undefined && s !== null)) {
                    endsToSave.push({
                        end_number: endNum,
                        arrows: scores.map(s => {
                            if (s === undefined || s === null || s === 'M') return "M"
                            return String(s)
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

        toast.success('Nilai berhasil disimpan')

        if (isAssignmentEndComplete(assignment)) {
            if (currentEndNum < (props.sessionData?.total_ends || 0)) {
                goToEnd(currentEndNum + 1)
            } else {
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

const getScoreKeypadClass = (score) => {
    const s = String(score).toUpperCase()
    if (['X', '10', '9'].includes(s)) return 'bg-gradient-to-br from-[#FFE500] to-[#FFCC00] border-[#b89512] text-navy shadow-sm'
    if (['8', '7'].includes(s)) return 'bg-gradient-to-br from-[#EF4444] to-[#DC2626] border-[#991B1B] text-white shadow-sm'
    if (['6', '5'].includes(s)) return 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] border-[#1E40AF] text-white shadow-sm'
    if (['4', '3'].includes(s)) return 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#020617] text-white shadow-sm'
    if (['2', '1'].includes(s)) return 'bg-gradient-to-br from-white to-slate-50 border-slate-200 text-navy shadow-sm'
    if (s === 'M') return 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-500 shadow-sm'
    return 'bg-white text-navy border-gray-200'
}
</script>
