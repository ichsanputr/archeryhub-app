<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Enhanced Header -->
        <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20" style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);"></div>
            
            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
            
            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:target" class="text-primary text-2xl" />
                        </div>
                        
                        <!-- Title Section -->
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Manajemen Target
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Atur penempatan atlet dan konfigurasi target untuk kompetisi
                            </p>
                        </div>
                    </div>
                    
                    <!-- Action Button -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton 
                            variant="primary" 
                            icon="ph:plus-bold" 
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
                            @click="navigateTo(`/dashboard/events/${route.params.id}/targets/create`)">
                            Tambah Target
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Target Name Selector -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
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
                <div class="flex-1 w-full">
                    <label class="block text-sm font-bold text-gray-700 mb-2">Pilih Nama Target</label>
                    <select v-model="selectedTargetName" @change="loadTargets" :disabled="!selectedPhase"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed">
                        <option value="">Pilih Nama Target</option>
                        <option v-for="targetName in filteredTargetNames" :key="targetName.id" :value="targetName.id">
                            {{ targetName.name }}
                        </option>
                    </select>
                </div>
                <div v-if="selectedTargetName" class="flex gap-3">
                    <BaseButton 
                        variant="primary" 
                        icon="ph:plus-bold" 
                        class="h-11 px-5 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
                        @click="showCreateTargetCard = true">
                        Tambah Kartu Target
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- Quick Metrics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Target Penuh</p>
                    <p class="text-xl font-black text-navy">{{ maintenanceCount }}</p>
                </div>
            </div>
        </div>

        <!-- Target Assignment Grid -->
        <div v-if="selectedTargetName" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <div v-for="target in targets" :key="target.id"
                class="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-all relative group">

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
                        <span class="font-black text-navy uppercase tracking-tight text-sm">{{ target.target_name || 'Target' }}</span>
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

        <!-- Empty State - No Target Name Selected -->
        <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <Icon icon="ph:list-bullets" class="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-navy mb-2">Pilih Nama Target</h3>
            <p class="text-gray-500">Silakan pilih nama target untuk melihat dan mengelola kartu target</p>
        </div>

        <!-- Assign Archer Dialog -->
        <BaseDialogForm v-model="showAssignDialog" :header="`Assign Archer ke ${assigningTarget?.target_name} Posisi ${assigningPosition}`"
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
                    <label class="block text-sm font-bold text-gray-700 mb-2">Nama Kartu Target *</label>
                    <input v-model="newTargetName" type="text" required
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Contoh: Target A, Target B, Target Utama..." />
                    <p class="text-xs text-gray-400 mt-1">Masukkan nama untuk kartu target ini</p>
                </div>
            </div>
        </BaseDialogForm>

        <!-- Edit Target Dialog -->
        <BaseDialogForm v-model="showEditDialog" header="Edit Penempatan Target"
            @close="showEditDialog = false">
            <template #action>
                <BaseButton variant="white" @click="showEditDialog = false">Batal</BaseButton>
                <BaseButton variant="primary" @click="handleUpdateTargetName" :loading="isUpdatingTargetName">
                    Simpan
                </BaseButton>
            </template>
            <div class="space-y-6">
                <!-- Edit Target Name -->
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Nama Target *</label>
                    <input v-model="editingTargetName" type="text" required
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        placeholder="Masukkan nama target" />
                </div>

                <!-- Current Archers -->
                <div v-if="editingTarget">
                    <label class="block text-sm font-bold text-gray-700 mb-3">Archer yang Terdaftar</label>
                    <div class="space-y-2">
                        <div v-for="pos in ['A', 'B', 'C', 'D']" :key="pos" class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 transition-all"
                            :class="editingPosition === pos ? 'border-primary ring-2 ring-primary/20' : ''">
                            <span class="flex items-center justify-center size-8 rounded-lg bg-white border border-gray-100 text-xs font-black text-gray-400 flex-shrink-0">{{ pos }}</span>
                            
                            <!-- Show archer info if assigned -->
                            <div v-if="getArcher(editingTarget, pos) && editingPosition !== pos" class="flex-1 min-w-0">
                                <p class="text-sm font-bold text-navy truncate">{{ getArcher(editingTarget, pos).name }}</p>
                                <p class="text-xs text-gray-500 truncate">{{ getArcher(editingTarget, pos).division }}</p>
                            </div>
                            
                            <!-- Show inline dropdown when adding -->
                            <div v-else-if="editingPosition === pos" class="flex-1">
                                <select v-model="selectedParticipantForEdit" 
                                    @change="handleInlineAssignArcher(editingTarget, pos)"
                                    class="w-full px-3 py-2 rounded-lg border border-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm bg-white">
                                    <option value="">Pilih Archer...</option>
                                    <option v-for="participant in availableParticipants" :key="participant.id" :value="participant.id">
                                        {{ participant.full_name }} - {{ participant.division_name }}
                                    </option>
                                </select>
                                <button @click="editingPosition = null" class="mt-1 text-xs text-gray-500 hover:text-gray-700">
                                    Batal
                                </button>
                            </div>
                            
                            <!-- Show empty slot -->
                            <div v-else class="flex-1 text-sm text-gray-400">Slot kosong</div>
                            
                            <!-- Action buttons -->
                            <div class="flex gap-2 flex-shrink-0">
                                <BaseButton v-if="getArcher(editingTarget, pos) && editingPosition !== pos" 
                                    variant="white" 
                                    size="sm" 
                                    icon="ph:x" 
                                    @click="handleRemoveArcher(editingTarget, pos)" 
                                    :loading="isRemovingArcher">
                                    Hapus
                                </BaseButton>
                                <BaseButton v-else-if="editingPosition !== pos" 
                                    variant="white" 
                                    size="sm" 
                                    icon="ph:plus" 
                                    @click="startInlineAdd(editingTarget, pos)">
                                    Tambah
                                </BaseButton>
                            </div>
                        </div>
                    </div>
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
const { get, post, put, delete: del } = useApi()
const { setEvent, clearEvent } = useEventContext()
const toast = useToast()

const eventId = route.params.id
const isLoading = ref(false)
const targets = ref([])
const targetNames = ref([])
const selectedPhase = ref('')
const selectedTargetName = ref('')
const availableParticipants = ref([])
const showAssignDialog = ref(false)
const showCreateTargetCard = ref(false)
const assigningTarget = ref(null)
const assigningPosition = ref('')
const selectedParticipant = ref('')
const isAssigning = ref(false)
const isCreating = ref(false)
const isRemovingArcher = ref(false)
const newTargetName = ref('')

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

const fetchTargetNames = async () => {
    try {
        // Fetch target names from API endpoint
        const response = await get(`/events/${eventId}/target-names`)
        if (response && response.target_names) {
            targetNames.value = response.target_names.map(tn => ({
                id: tn.id,
                name: tn.name,
                phase: tn.phase,
                category_id: tn.category_id,
                session_id: tn.session_id,
                session_order: tn.session_order,
                round_name: tn.round_name
            }))
            
            // Auto-select Kualifikasi phase and first target name
            if (targetNames.value.length > 0) {
                const qualificationTargets = targetNames.value.filter(tn => tn.phase === 'qualification')
                if (qualificationTargets.length > 0) {
                    selectedPhase.value = 'qualification'
                    selectedTargetName.value = qualificationTargets[0].id
                    // Load targets automatically
                    await loadTargets()
                }
            }
        }
    } catch (error) {
        console.error('Failed to fetch target names:', error)
        toast.error('Gagal memuat daftar nama target')
    }
}

const loadTargets = async () => {
    if (!selectedTargetName.value) {
        targets.value = []
        return
    }

    isLoading.value = true
    try {
        const targetName = targetNames.value.find(t => t.id === selectedTargetName.value)
        if (!targetName) return

        // Build query parameters based on phase
        let queryParams = `phase=${targetName.phase}&category_id=${targetName.category_id}`
        if (targetName.phase === 'qualification' && targetName.session_id) {
            queryParams += `&session_id=${targetName.session_id}`
        } else if (targetName.phase === 'elimination' && targetName.round_name) {
            queryParams += `&round_name=${targetName.round_name}`
        }

        // Fetch targets from API
        const response = await get(`/targets?${queryParams}`)
        if (response && response.targets) {
            // Transform API response to match our UI structure
            targets.value = response.targets.map((target, index) => {
                // Build archers object from array
                const archers = {}
                target.archers?.forEach(archer => {
                    archers[archer.position] = {
                        id: archer.id,
                        participant_id: archer.participant_id,
                        name: archer.name,
                        division: archer.division
                    }
                })

                // Determine status based on archers count
                const archersCount = Object.keys(archers).length
                let status = 'empty'
                if (archersCount === 4) {
                    status = 'full'
                } else if (archersCount > 0) {
                    status = 'partial'
                }

                return {
                    id: `target-${target.target_number}`,
                    target_number: target.target_number,
                    target_name: target.card_name || `Target ${target.target_number}`,
                    status: status,
                    archers: archers
                }
            })
        } else {
            targets.value = []
        }
    } catch (error) {
        console.error('Failed to load targets:', error)
        toast.error('Gagal memuat data target')
        targets.value = []
    } finally {
        isLoading.value = false
    }
}

const fetchAvailableParticipants = async () => {
    if (!selectedTargetName.value) return

    try {
        const targetName = targetNames.value.find(t => t.id === selectedTargetName.value)
        if (!targetName) {
            console.warn('Target name not found:', selectedTargetName.value)
            return
        }

        // Fetch the category details to get division and age group
        const categoryRes = await get(`/events/${eventId}/categories`)
        const allCategories = categoryRes?.events || []
        const targetCategory = allCategories.find(c => c.id === targetName.category_id)
        
        if (!targetCategory) {
            console.warn('Target category not found:', targetName.category_id)
            availableParticipants.value = []
            return
        }

        const response = await get(`/events/${eventId}/participants`)
        if (response && response.participants) {
            // Filter participants by matching division and age group
            // This allows showing archers even if they're in a slightly different category (e.g., Individual vs Team)
            const filtered = response.participants.filter(p => {
                // First try exact category match
                if (p.category_id === targetName.category_id) {
                    return true
                }
                
                // Then try to find participant's category details
                const participantCategory = allCategories.find(c => c.id === p.category_id)
                if (!participantCategory) {
                    return false
                }
                
                // Match by division and age group (bow type and age group)
                const divisionMatch = participantCategory.division_id === targetCategory.division_id ||
                                     participantCategory.division_name === targetCategory.division_name
                const ageGroupMatch = participantCategory.category_id === targetCategory.category_id ||
                                    participantCategory.category_name === targetCategory.category_name
                
                return divisionMatch && ageGroupMatch
            })
            
            availableParticipants.value = filtered.map(p => ({
                id: p.id,
                full_name: p.full_name,
                division_name: p.division_name || '',
                category_id: p.category_id
            }))
            
            console.log('Available participants:', {
                targetCategoryId: targetName.category_id,
                targetCategory: targetCategory,
                totalParticipants: response.participants.length,
                filteredCount: availableParticipants.value.length
            })
        }
    } catch (error) {
        console.error('Failed to fetch participants:', error)
        toast.error('Gagal memuat daftar peserta')
    }
}

const openAssignDialog = (target, position) => {
    assigningTarget.value = target
    assigningPosition.value = position
    selectedParticipant.value = ''
    fetchAvailableParticipants()
    showAssignDialog.value = true
}

const showEditDialog = ref(false)
const editingTarget = ref(null)
const editingTargetName = ref('')
const isUpdatingTargetName = ref(false)
const editingPosition = ref(null)
const selectedParticipantForEdit = ref('')

const openEditDialog = (target) => {
    editingTarget.value = target
    editingTargetName.value = target.target_name || `Target ${target.target_number}`
    editingPosition.value = null
    selectedParticipantForEdit.value = ''
    showEditDialog.value = true
    fetchAvailableParticipants()
}

const startInlineAdd = (target, position) => {
    editingPosition.value = position
    selectedParticipantForEdit.value = ''
    // Ensure participants are loaded
    if (availableParticipants.value.length === 0) {
        fetchAvailableParticipants()
    }
}

const handleInlineAssignArcher = async (target, position) => {
    if (!selectedParticipantForEdit.value) {
        editingPosition.value = null
        return
    }

    isAssigning.value = true
    try {
        const targetName = targetNames.value.find(t => t.id === selectedTargetName.value)
        if (!targetName) {
            toast.error('Target name tidak ditemukan')
            return
        }

        const payload = {
            session_id: targetName.session_id,
            participant_id: selectedParticipantForEdit.value,
            target_number: target.target_number,
            target_position: position
        }

        await put('/targets/assignments', payload)
        toast.success('Archer berhasil diassign')
        
        // Reset inline editing state
        editingPosition.value = null
        selectedParticipantForEdit.value = ''
        
        // Reload targets and update editing target
        await loadTargets()
        
        // Re-select the editing target after reload
        if (editingTarget.value) {
            const updatedTarget = targets.value.find(t => t.target_number === editingTarget.value.target_number)
            if (updatedTarget) {
                editingTarget.value = updatedTarget
            }
        }
    } catch (error) {
        console.error('Failed to assign archer:', error)
        toast.error(error.response?.data?.error || 'Gagal mengassign archer')
        editingPosition.value = null
        selectedParticipantForEdit.value = ''
    } finally {
        isAssigning.value = false
    }
}

const handleAssignArcher = async () => {
    if (!selectedParticipant.value || !assigningTarget.value) {
        toast.error('Harap pilih archer')
        return
    }

    isAssigning.value = true
    try {
        const targetName = targetNames.value.find(t => t.id === selectedTargetName.value)
        if (!targetName) {
            toast.error('Target name tidak ditemukan')
            return
        }

        const payload = {
            session_id: targetName.session_id,
            participant_id: selectedParticipant.value,
            target_number: assigningTarget.value.target_number,
            target_position: assigningPosition.value
        }

        await put('/targets/assignments', payload)
        toast.success('Archer berhasil diassign')
        showAssignDialog.value = false
        selectedParticipant.value = ''
        loadTargets()
    } catch (error) {
        console.error('Failed to assign archer:', error)
        toast.error(error.response?.data?.error || 'Gagal mengassign archer')
    } finally {
        isAssigning.value = false
    }
}

const handleCreateTargetCard = async () => {
    if (!newTargetName.value || newTargetName.value.trim() === '') {
        toast.error('Harap masukkan nama kartu target')
        return
    }

    isCreating.value = true
    try {
        const targetName = targetNames.value.find(t => t.id === selectedTargetName.value)
        if (!targetName) {
            toast.error('Target name tidak ditemukan')
            return
        }

        // Find the next available target number
        const existingTargetNumbers = targets.value.map(t => t.target_number).sort((a, b) => a - b)
        let nextTargetNumber = 1
        if (existingTargetNumbers.length > 0) {
            nextTargetNumber = existingTargetNumbers[existingTargetNumbers.length - 1] + 1
        }

        // Build payload based on phase
        const payload = {
            target_number: nextTargetNumber,
            card_name: newTargetName.value.trim(),
            phase: targetName.phase
        }

        if (targetName.phase === 'qualification' && targetName.session_id) {
            payload.session_id = targetName.session_id
        } else if (targetName.phase === 'elimination') {
            // For elimination, we need to get or create a match first
            // For now, we'll need to get the match_uuid from the API
            // This is a simplified version - you may need to adjust based on your match creation flow
            toast.error('Elimination phase target cards require match creation first')
            return
        }

        // Call API to create target card
        const response = await post('/targets/cards', payload)
        
        if (response) {
            toast.success('Kartu target berhasil dibuat')
            showCreateTargetCard.value = false
            newTargetName.value = ''
            // Reload targets to show the new card
            await loadTargets()
        }
    } catch (error) {
        console.error('Failed to create target card:', error)
        toast.error(error.response?.data?.error || 'Gagal membuat kartu target')
    } finally {
        isCreating.value = false
    }
}

const handleUpdateTargetName = async () => {
    if (!editingTargetName.value || !editingTarget.value) {
        toast.error('Harap masukkan nama target')
        return
    }

    isUpdatingTargetName.value = true
    try {
        // Update target name in the local state
        editingTarget.value.target_name = editingTargetName.value.trim()
        toast.success('Nama target berhasil diupdate')
        showEditDialog.value = false
    } catch (error) {
        console.error('Failed to update target name:', error)
        toast.error('Gagal mengupdate nama target')
    } finally {
        isUpdatingTargetName.value = false
    }
}

const handleMoveArcher = async (fromTarget, fromPosition, toTarget, toPosition) => {
    try {
        const targetName = targetNames.value.find(t => t.id === selectedTargetName.value)
        if (!targetName) return

        const archer = fromTarget.archers[fromPosition]
        if (!archer) return

        // Remove from old position
        if (archer.id) {
            await del(`/targets/assignments/${archer.id}`)
        }

        // Add to new position
        const payload = {
            session_id: targetName.session_id,
            participant_id: archer.participant_id,
            target_number: toTarget.target_number,
            target_position: toPosition
        }

        await put('/targets/assignments', payload)
        toast.success('Archer berhasil dipindahkan')
        loadTargets()
    } catch (error) {
        console.error('Failed to move archer:', error)
        toast.error(error.response?.data?.error || 'Gagal memindahkan archer')
    }
}

const handleRemoveArcher = async (target, position) => {
    const archer = target.archers?.[position]
    if (!archer || !archer.id) {
        toast.error('Archer tidak ditemukan')
        return
    }

    isRemovingArcher.value = true
    try {
        await del(`/targets/assignments/${archer.id}`)
        toast.success('Archer berhasil dihapus')
        
        // Immediately remove from local state for instant UI update
        if (target.archers && target.archers[position]) {
            delete target.archers[position]
            
            // Update status based on remaining archers
            const archersCount = Object.keys(target.archers).length
            if (archersCount === 0) {
                target.status = 'empty'
            } else if (archersCount < 4) {
                target.status = 'partial'
            }
        }
        
        // Reload from API to ensure consistency
        await loadTargets()
        
        // Re-select the editing target after reload to update the dialog
        if (editingTarget.value) {
            const updatedTarget = targets.value.find(t => t.target_number === editingTarget.value.target_number)
            if (updatedTarget) {
                editingTarget.value = updatedTarget
            }
        }
    } catch (error) {
        console.error('Failed to remove archer:', error)
        toast.error(error.response?.data?.error || 'Gagal menghapus archer')
    } finally {
        isRemovingArcher.value = false
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
    return targets.value.filter(t => t.status === 'full').length
})

const filteredTargetNames = computed(() => {
    if (!selectedPhase.value) {
        return []
    }
    return targetNames.value.filter(tn => tn.phase === selectedPhase.value)
})

const onPhaseChange = () => {
    // Reset selected target name when phase changes
    selectedTargetName.value = ''
    targets.value = []
}

watch(selectedTargetName, () => {
    if (selectedTargetName.value) {
        loadTargets()
    }
})

onMounted(() => {
    fetchEventDetails()
    fetchTargetNames()
})
</script>
