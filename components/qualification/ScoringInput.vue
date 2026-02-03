<template>
    <div class="space-y-6">
        <!-- Participant Selection -->
        <div class="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <label class="block text-sm font-bold text-gray-700 mb-3">Pilih Peserta</label>
            <select v-model="selectedParticipant" @change="fetchScores"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none">
                <option value="">-- Pilih Peserta --</option>
                <option v-for="participant in participants" :key="participant.uuid" :value="participant.uuid">
                    {{ participant.target_name || 'Target ' + participant.target_number }}{{ participant.target_position }} - {{ participant.archer_name }}
                </option>
            </select>
        </div>

        <!-- Scoring Grid -->
        <div v-if="selectedParticipant">
            <div v-if="loadingScores" class="text-center py-12">
                <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p class="text-sm text-gray-500 mt-3">Memuat skor...</p>
            </div>

            <div v-else class="space-y-4">
                <!-- End Scores -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="end in ends" :key="end.end_number"
                        class="bg-white border-2 rounded-xl p-4"
                        :class="end.is_complete ? 'border-green-200 bg-green-50/30' : 'border-gray-200'">
                        <div class="flex items-center justify-between mb-3">
                            <h4 class="font-bold text-navy">End {{ end.end_number }}</h4>
                            <div class="text-right">
                                <div class="text-xl font-black text-navy">{{ end.end_total || 0 }}</div>
                                <div class="text-xs text-gray-500">X:{{ end.end_x_count || 0 }} 10:{{ end.end_10_count || 0 }}</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-3 gap-2">
                            <input v-for="arrow in 6" :key="arrow"
                                v-model="end[`arrow_${arrow}`]"
                                @input="calculateEndTotal(end)"
                                @blur="saveEndScore(end)"
                                type="text"
                                maxlength="2"
                                placeholder="0"
                                class="w-full px-3 py-2 text-center font-bold rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none uppercase">
                        </div>
                    </div>
                </div>

                <!-- Total Score Summary -->
                <div class="bg-navy text-white rounded-xl p-6">
                    <div class="grid grid-cols-3 gap-6 text-center">
                        <div>
                            <div class="text-sm opacity-75 mb-1">Total Skor</div>
                            <div class="text-3xl font-black">{{ totalScore }}</div>
                        </div>
                        <div>
                            <div class="text-sm opacity-75 mb-1">Total X</div>
                            <div class="text-3xl font-black">{{ totalX }}</div>
                        </div>
                        <div>
                            <div class="text-sm opacity-75 mb-1">Total 10</div>
                            <div class="text-3xl font-black">{{ total10 }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-12">
            <p class="text-gray-500">Pilih peserta untuk input skor</p>
        </div>
    </div>
</template>

<script setup>
import { useToast } from '~/composables/useToast'
import { computed } from 'vue'

const props = defineProps({
    sessionId: {
        type: String,
        required: true
    }
})

const { get, post } = useApi()
const toast = useToast()

const participants = ref([])
const selectedParticipant = ref('')
const ends = ref([])
const loadingScores = ref(false)

const totalScore = computed(() => {
    return ends.value.reduce((sum, end) => sum + (end.end_total || 0), 0)
})

const totalX = computed(() => {
    return ends.value.reduce((sum, end) => sum + (end.end_x_count || 0), 0)
})

const total10 = computed(() => {
    return ends.value.reduce((sum, end) => sum + (end.end_10_count || 0), 0)
})

const fetchParticipants = async () => {
    try {
        const response = await get(`/qualification/sessions/${props.sessionId}/assignments`)
        participants.value = response?.assignments || []
    } catch (error) {
        console.error('Failed to fetch participants:', error)
        participants.value = []
    }
}

const fetchScores = async () => {
    if (!selectedParticipant.value) return

    loadingScores.value = true
    try {
        const response = await get(`/qualification/assignments/${selectedParticipant.value}/scores`)
        const scores = response?.scores || []
        
        // Initialize 12 ends (can be configurable)
        ends.value = []
        for (let i = 1; i <= 12; i++) {
            const existingEnd = scores.find(s => s.end_number === i)
            if (existingEnd && existingEnd.arrows) {
                // Convert new arrow array format to old format for UI compatibility
                const endData = {
                    end_number: i,
                    end_total: existingEnd.total_score_end || 0,
                    end_x_count: existingEnd.x_count_end || 0,
                    end_10_count: existingEnd.ten_count_end || 0,
                    is_complete: existingEnd.is_confirmed || false
                }
                // Map arrows array to individual fields
                existingEnd.arrows.forEach((arrow, idx) => {
                    endData[`arrow_${idx + 1}`] = arrow.is_x ? 'X' : arrow.score.toString()
                })
                ends.value.push(endData)
            } else {
                ends.value.push({
                    end_number: i,
                    arrow_1: '',
                    arrow_2: '',
                    arrow_3: '',
                    arrow_4: '',
                    arrow_5: '',
                    arrow_6: '',
                    end_total: 0,
                    end_x_count: 0,
                    end_10_count: 0,
                    is_complete: false
                })
            }
        }
    } catch (error) {
        console.error('Failed to fetch scores:', error)
        ends.value = []
    } finally {
        loadingScores.value = false
    }
}

const calculateEndTotal = (end) => {
    let total = 0
    let xCount = 0
    let tenCount = 0

    for (let i = 1; i <= 6; i++) {
        const arrow = (end[`arrow_${i}`] || '').toUpperCase()
        if (arrow === 'X') {
            total += 10
            xCount++
        } else if (arrow === 'M' || arrow === '') {
            total += 0
        } else {
            const value = parseInt(arrow)
            if (!isNaN(value) && value >= 0 && value <= 10) {
                total += value
                if (value === 10) tenCount++
            }
        }
    }

    end.end_total = total
    end.end_x_count = xCount
    end.end_10_count = tenCount
    end.is_complete = [1, 2, 3, 4, 5, 6].every(i => end[`arrow_${i}`] && end[`arrow_${i}`].trim() !== '')
}

const saveEndScore = async (end) => {
    try {
        // Convert individual arrow fields to arrows array
        const arrows = []
        for (let i = 1; i <= 6; i++) {
            const arrowValue = end[`arrow_${i}`] || ''
            if (arrowValue) {
                arrows.push(arrowValue.toString().toUpperCase())
            }
        }
        
        await post(`/qualification/assignments/${selectedParticipant.value}/scores`, {
            end_number: end.end_number,
            arrows: arrows
        })
    } catch (error) {
        console.error('Failed to save score:', error)
        toast.error('Gagal menyimpan skor')
    }
}

onMounted(() => {
    fetchParticipants()
})
</script>
