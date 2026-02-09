<template>
    <div class="space-y-6">
        <!-- Auto Assign Section -->
        <div class="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h4 class="font-bold text-navy mb-4">Atur Target Otomatis</h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BaseInput v-model.number="autoAssignParams.start_target" type="number" label="Target Awal"
                    placeholder="1" />
                <BaseInput v-model.number="autoAssignParams.archers_per_target" type="number" label="Atlet per Target"
                    placeholder="4" />
                <div class="flex items-end">
                    <BaseButton variant="primary" icon="ph:magic-wand" @click="autoAssign" :loading="assigning" block>
                        Atur Otomatis
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- Assignments List -->
        <div v-if="loading" class="text-center py-12">
            <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin">
            </div>
            <p class="text-sm text-gray-500 mt-3">Memuat data...</p>
        </div>

        <div v-else-if="assignments.length === 0" class="text-center py-12">
            <p class="text-gray-500">Belum ada peserta yang diatur ke target</p>
            <p class="text-sm text-gray-400 mt-1">Gunakan fitur atur otomatis di atas</p>
        </div>

        <div v-else class="space-y-6">
            <div v-for="(group, targetName) in groupedAssignments" :key="targetName">
                <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div class="bg-navy text-white px-4 py-3 font-bold">
                        Target {{ targetName }}
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="assignment in group" :key="assignment.uuid"
                            class="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
                                    {{ assignment.target_name ? assignment.target_name.slice(-1) : '?' }}
                                </div>
                                <div>
                                    <p class="font-semibold text-navy">{{ assignment.archer_name }}</p>
                                    <p class="text-xs text-gray-500">{{ assignment.club_name || 'Individual' }}</p>
                                </div>
                            </div>
                            <button @click="removeAssignment(assignment.uuid)"
                                class="text-gray-400 hover:text-red-500 transition-colors">
                                <Icon icon="ph:trash" class="text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useToast } from '~/composables/useToast'
import { computed } from 'vue'

const props = defineProps({
    sessionId: {
        type: String,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['updated'])

const { get, post, del } = useApi()
const toast = useToast()

const assignments = ref([])
const loading = ref(false)
const assigning = ref(false)

const autoAssignParams = ref({
    start_target: 1,
    archers_per_target: 4
})

const groupedAssignments = computed(() => {
    const grouped = {}
    assignments.value.forEach(assignment => {
        const targetKey = assignment.target_name || 'Unknown'
        if (!grouped[targetKey]) {
            grouped[targetKey] = []
        }
        grouped[targetKey].push(assignment)
    })
    return grouped
})

const fetchAssignments = async () => {
    loading.value = true
    try {
        const response = await get(`/qualification/sessions/${props.sessionId}/assignments`)
        assignments.value = response?.assignments || []
    } catch (error) {
        console.error('Failed to fetch assignments:', error)
        assignments.value = []
    } finally {
        loading.value = false
    }
}

const autoAssign = async () => {
    assigning.value = true
    try {
        await post(`/qualification/sessions/${props.sessionId}/auto-assign`, {
            ...autoAssignParams.value,
            category_id: props.categoryId
        })
        toast.success('Target berhasil diatur')
        await fetchAssignments()
        emit('updated')
    } catch (error) {
        console.error('Failed to auto assign:', error)
        toast.error(error?.data?.error || 'Gagal mengatur target')
    } finally {
        assigning.value = false
    }
}

const removeAssignment = async (assignmentId) => {
    if (!confirm('Hapus pengaturan target ini?')) return

    try {
        await del(`/qualification/assignments/${assignmentId}`)
        toast.success('Pengaturan target dihapus')
        await fetchAssignments()
        emit('updated')
    } catch (error) {
        console.error('Failed to remove assignment:', error)
        toast.error('Gagal menghapus pengaturan')
    }
}

onMounted(() => {
    fetchAssignments()
})
</script>
