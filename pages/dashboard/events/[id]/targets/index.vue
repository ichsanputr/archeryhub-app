<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-100">
            <div>
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Manajemen Target</h1>
                <p class="text-gray-500 font-medium mt-1">Atur penempatan atlet dan konfigurasi target.</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="primary" icon="ph:plus-bold" class="h-11 shadow-lg shadow-primary/20"
                    @click="navigateTo(`/dashboard/events/${route.params.id}/targets/create`)">
                    Tambah Target
                </BaseButton>
            </div>
        </div>

        <!-- Target Group Selector -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
            <div class="space-y-4">
                <div class="flex flex-col md:flex-row gap-4 items-end">
                    <div class="flex-1 w-full">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Fase</label>
                        <select v-model="selectedPhase" @change="onPhaseChange"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                            <option value="">Pilih Fase</option>
                            <option value="qualification">Kualifikasi</option>
                            <option value="elimination">Eliminasi</option>
                        </select>
                    </div>
                    <div v-if="selectedPhase" class="flex-1 w-full">
                        <label class="block text-sm font-bold text-gray-700 mb-2">Pilih Grup Target</label>
                        <select v-model="selectedTargetGroup" @change="loadTargets"
                            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                            <option value="">Pilih Grup Target</option>
                            <option v-for="group in filteredTargetGroups" :key="group.id" :value="group.id">
                                {{ group.name }}
                            </option>
                        </select>
                    </div>
                    <div v-if="selectedTargetGroup" class="flex gap-3">
                        <BaseButton variant="white" icon="ph:plus" @click="showCreateTargetCard = true">
                            Tambah Kartu Target
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Quick Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:target" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Target</p>
                    <p class="text-xl font-black text-navy">{{ targets.length }}</p>
                </div>
            </div>
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:users-three" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Atlet Terdaftar</p>
                    <p class="text-xl font-black text-navy">{{ totalAthletes }}</p>
                </div>
            </div>
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:user-plus" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Slot Tersedia</p>
                    <p class="text-xl font-black text-navy">{{ availableSlots }}</p>
                </div>
            </div>
            <div
                class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                <div
                    class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                    <Icon icon="ph:wrench" class="text-2xl" />
                </div>
                <div>
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Sedang Perbaikan</p>
                    <p class="text-xl font-black text-navy">{{ maintenanceCount }}</p>
                </div>
            </div>
        </div>

        <!-- Target Assignment Grid -->
        <div v-if="selectedTargetGroup" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="target in targets" :key="target.id"
                class="bg-white rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col overflow-hidden hover:shadow-lg transition-all relative group">

                <!-- Overlay for maintenance status -->
                <div v-if="target.status === 'maintenance'"
                    class="absolute inset-0 bg-white/70 z-10 flex flex-col items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        class="bg-navy text-primary font-black px-5 py-2.5 rounded-xl shadow-lg text-xs uppercase tracking-widest">
                        Manage Status
                    </button>
                </div>

                <div class="px-5 py-4 border-b border-gray-50 flex justify-between items-center"
                    :class="target.status === 'maintenance' ? 'bg-amber-50/50' : 'bg-gray-50/30'">
                    <div class="flex items-center gap-3">
                        <div class="font-black text-sm px-3 py-1.5 rounded-xl shadow-sm"
                            :class="target.status === 'full' ? 'bg-navy text-primary' : 'bg-white text-navy border border-gray-200'">
                            {{ String(target.target_number).padStart(2, '0') }}
                        </div>
                        <span class="font-black text-navy uppercase tracking-tight text-sm">Target {{ target.target_number
                        }}</span>
                    </div>
                    <span :class="getStatusClass(target.status)"
                        class="text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest">
                        {{ getStatusLabel(target.status) }}
                    </span>
                </div>

                <div class="p-5 space-y-3 flex-grow" :class="target.status === 'maintenance' ? 'opacity-40' : ''">
                    <div v-for="pos in ['A', 'B', 'C', 'D']" :key="pos" class="group/item">
                        <div v-if="getArcher(target, pos)"
                            class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-primary/20 hover:bg-white transition-all">
                            <span
                                class="flex items-center justify-center size-7 rounded-lg bg-white border border-gray-100 text-[10px] font-black text-gray-400 shadow-sm">{{
                                    pos }}</span>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-xs font-bold text-navy truncate group-hover/item:text-primary-hover transition-colors">
                                    {{ getArcher(target, pos).name }}
                                </p>
                                <p class="text-[9px] font-bold text-gray-400 truncate uppercase tracking-tight mt-0.5">
                                    {{ getArcher(target, pos).division }}
                                </p>
                            </div>
                        </div>
                        <div v-else @click="target.status !== 'maintenance' ? openAssignDialog(target, pos) : null"
                            class="flex items-center gap-3 p-3 rounded-xl border border-dashed border-gray-200 bg-white hover:bg-gray-50 transition-all cursor-pointer group/add">
                            <span
                                class="flex items-center justify-center size-7 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-300">{{
                                    pos }}</span>
                            <div class="flex-1 min-w-0">
                                <p
                                    class="text-[10px] font-black text-gray-300 group-hover/add:text-primary transition-colors uppercase">
                                    slot tersedia
                                </p>
                            </div>
                            <Icon icon="ph:plus-circle"
                                class="text-gray-300 text-[18px] group-hover/add:text-primary group-hover/add:rotate-90 transition-all" />
                        </div>
                    </div>
                </div>

                <div class="px-5 py-3 border-t border-gray-50 bg-gray-50/20">
                    <button
                        class="w-full flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 hover:text-navy transition-colors py-1.5 uppercase tracking-widest disabled:opacity-30 disabled:cursor-not-allowed"
                        :disabled="target.status === 'maintenance'"
                        @click="openEditDialog(target)">
                        <Icon icon="ph:pencil-simple" class="text-[16px]" />
                        edit penempatan
                    </button>
                </div>
            </div>

            <!-- Empty State -->
            <div v-if="targets.length === 0"
                class="col-span-full bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
                <Icon icon="ph:target" class="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-navy mb-2">Belum Ada Target</h3>
                <p class="text-gray-500 mb-4">Mulai dengan membuat target baru untuk grup yang dipilih</p>
                <BaseButton variant="primary" icon="ph:plus-bold" @click="showCreateTargetCard = true">
                    Tambah Kartu Target
                </BaseButton>
            </div>
        </div>

        <!-- Empty State - No Group Selected -->
        <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Icon icon="ph:list-bullets" class="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-navy mb-2">Pilih Grup Target</h3>
            <p class="text-gray-500">Silakan pilih grup target untuk melihat dan mengelola target</p>
        </div>

        <!-- Assign Archer Dialog -->
        <BaseDialogForm v-model="showAssignDialog" :header="`Assign Archer ke Target ${assigningTarget?.target_number} Posisi ${assigningPosition}`"
            @close="showAssignDialog = false">
            <template #action>
                <BaseButton variant="white" @click="showAssignDialog = false">Batal</BaseButton>
                <BaseButton variant="primary" @click="handleAssignArcher" :loading="isAssigning">
                    Assign
                </BaseButton>
            </template>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Pilih Archer</label>
                    <select v-model="selectedParticipant"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                        <option value="">Pilih Archer</option>
                        <option v-for="participant in availableParticipants" :key="participant.id" :value="participant.id">
                            {{ participant.full_name }} - {{ participant.division_name }}
                        </option>
                    </select>
                </div>
            </div>
        </BaseDialogForm>

        <!-- Create Target Card Dialog -->
        <BaseDialogForm v-model="showCreateTargetCard" header="Tambah Kartu Target Baru"
            @close="showCreateTargetCard = false">
            <template #action>
                <BaseButton variant="white" @click="showCreateTargetCard = false">Batal</BaseButton>
                <BaseButton variant="primary" @click="handleCreateTargetCard" :loading="isCreating">
                    Buat Target
                </BaseButton>
            </template>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Nomor Target *</label>
                    <input v-model.number="newTargetNumber" type="number" min="1" required
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Contoh: 21, 22, 23..." />
                </div>
            </div>
        </BaseDialogForm>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'
import { useToast } from '~/composables/useToast'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get, post } = useApi()
const { setEvent, clearEvent } = useEventContext()
const toast = useToast()

const eventId = route.params.id
const isLoading = ref(false)
const targets = ref([])
const targetGroups = ref([])
const selectedPhase = ref('')
const selectedTargetGroup = ref('')
const availableParticipants = ref([])
const showAssignDialog = ref(false)
const showCreateTargetCard = ref(false)
const assigningTarget = ref(null)
const assigningPosition = ref('')
const selectedParticipant = ref('')
const isAssigning = ref(false)
const isCreating = ref(false)
const newTargetNumber = ref(null)

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

const fetchTargetGroups = async () => {
    try {
        // Fetch all categories to build target groups
        const response = await get(`/events/${eventId}/categories`)
        if (response && response.events) {
            const groups = []
            response.events.forEach(cat => {
                // Qualification groups: Sesi 1-4
                for (let i = 1; i <= 4; i++) {
                    groups.push({
                        id: `qualification-${cat.id}-sesi-${i}`,
                        name: `Sesi ${i} - ${cat.division_name} ${cat.category_name}`,
                        phase: 'qualification',
                        category_id: cat.id,
                        session_number: i
                    })
                }
                // Elimination groups: Rounds
                const eliminationRounds = [
                    { value: '1/32', label: '1/32' },
                    { value: '1/16', label: '1/16' },
                    { value: '1/8', label: '1/8' },
                    { value: '1/4', label: '1/4 (Quarter-Final)' },
                    { value: 'Semi-Final', label: 'Semi-Final' },
                    { value: 'Final', label: 'Final' }
                ]
                eliminationRounds.forEach(round => {
                    groups.push({
                        id: `elimination-${cat.id}-${round.value}`,
                        name: `${round.label} - ${cat.division_name} ${cat.category_name}`,
                        phase: 'elimination',
                        category_id: cat.id,
                        round_name: round.value
                    })
                })
            })
            targetGroups.value = groups
        }
    } catch (error) {
        console.error('Failed to fetch target groups:', error)
    }
}

const filteredTargetGroups = computed(() => {
    if (!selectedPhase.value) return []
    return targetGroups.value.filter(g => g.phase === selectedPhase.value)
})

const onPhaseChange = () => {
    selectedTargetGroup.value = ''
    targets.value = []
}

const loadTargets = async () => {
    if (!selectedTargetGroup.value) {
        targets.value = []
        return
    }

    isLoading.value = true
    try {
        const group = targetGroups.value.find(g => g.id === selectedTargetGroup.value)
        if (!group) return

        // Fetch targets for this group
        // For now, using mock data - replace with actual API call
        // The API should return targets with their assignments
        const mockTargets = [
            { id: 1, target_number: 1, status: 'full', archers: { A: { name: 'Muhammad Ichsanul Fadhil', division: 'Recurve Senior' }, B: { name: 'Archer 2', division: 'Recurve Senior' }, C: { name: 'Archer 3', division: 'Recurve Senior' }, D: { name: 'Archer 4', division: 'Recurve Senior' } } },
            { id: 2, target_number: 2, status: 'partial', archers: { A: { name: 'Archer 5', division: 'Recurve Senior' }, B: { name: 'Archer 6', division: 'Recurve Senior' } } },
            { id: 3, target_number: 3, status: 'empty', archers: {} },
        ]

        targets.value = mockTargets
    } catch (error) {
        console.error('Failed to load targets:', error)
        targets.value = []
    } finally {
        isLoading.value = false
    }
}

const fetchAvailableParticipants = async () => {
    if (!selectedTargetGroup.value) return

    try {
        const group = targetGroups.value.find(g => g.id === selectedTargetGroup.value)
        if (!group) return

        const response = await get(`/events/${eventId}/participants`)
        if (response && response.participants) {
            // Filter participants by category
            availableParticipants.value = response.participants.filter(p => p.category_id === group.category_id)
        }
    } catch (error) {
        console.error('Failed to fetch participants:', error)
    }
}

const openAssignDialog = (target, position) => {
    assigningTarget.value = target
    assigningPosition.value = position
    selectedParticipant.value = ''
    fetchAvailableParticipants()
    showAssignDialog.value = true
}

const openEditDialog = (target) => {
    // TODO: Open edit dialog for target
    console.log('Edit target:', target)
}

const handleAssignArcher = async () => {
    if (!selectedParticipant.value || !assigningTarget.value) {
        toast.error('Harap pilih archer')
        return
    }

    isAssigning.value = true
    try {
        // TODO: Call API to assign participant to target
        // await post(`/qualification/assignments`, {
        //     session_uuid: ...,
        //     participant_uuid: selectedParticipant.value,
        //     target_number: assigningTarget.value.target_number,
        //     target_position: assigningPosition.value
        // })

        toast.success('Archer berhasil diassign')
        showAssignDialog.value = false
        loadTargets()
    } catch (error) {
        console.error('Failed to assign archer:', error)
        toast.error('Gagal mengassign archer')
    } finally {
        isAssigning.value = false
    }
}

const handleCreateTargetCard = async () => {
    if (!newTargetNumber.value || newTargetNumber.value < 1) {
        toast.error('Harap masukkan nomor target yang valid')
        return
    }

    isCreating.value = true
    try {
        // TODO: Create target card via API
        toast.success('Kartu target berhasil dibuat')
        showCreateTargetCard.value = false
        newTargetNumber.value = null
        loadTargets()
    } catch (error) {
        console.error('Failed to create target card:', error)
        toast.error('Gagal membuat kartu target')
    } finally {
        isCreating.value = false
    }
}

const getArcher = (target, pos) => target.archers?.[pos]

const getStatusClass = (status) => {
    const classes = {
        'full': 'bg-emerald-50 text-emerald-700 border-emerald-200',
        'partial': 'bg-blue-50 text-blue-700 border-blue-200',
        'empty': 'bg-gray-50 text-gray-500 border-gray-100',
        'maintenance': 'bg-amber-50 text-amber-700 border-amber-200'
    }
    return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const getStatusLabel = (status) => {
    const labels = {
        'full': 'penuh',
        'partial': 'sisa',
        'empty': 'kosong',
        'maintenance': 'perbaikan'
    }
    return labels[status] || 'unknown'
}

const totalAthletes = computed(() => {
    return targets.value.reduce((sum, target) => sum + Object.keys(target.archers || {}).length, 0)
})

const availableSlots = computed(() => {
    return (targets.value.length * 4) - totalAthletes.value
})

const maintenanceCount = computed(() => {
    return targets.value.filter(t => t.status === 'maintenance').length
})

watch(selectedTargetGroup, () => {
    if (selectedTargetGroup.value) {
        loadTargets()
    }
})

onMounted(() => {
    fetchEventDetails()
    fetchTargetGroups()
})
</script>
