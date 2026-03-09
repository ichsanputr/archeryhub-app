<template>
    <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-xl font-black text-navy leading-tight">Pengaturan Target</h2>
                <div class="text-sm text-gray-500 mt-1">Kelola penempatan pemanah pada target kualifikasi (Geser &
                    Letakkan)
                </div>
            </div>
            <div class="flex items-center gap-3">
                <BaseButton variant="white" icon="ph:trash-bold"
                    :disabled="isReseting || isAssigning || props.archers.length === unassignedArchersCount"
                    :loading="isReseting" class="!text-red-500 !border-red-100 hover:!bg-red-50"
                    @click="resetAssignments">
                    Atur Ulang
                </BaseButton>

                <div class="relative dropdown-container">
                    <BaseButton variant="primary" icon="fa7-solid:random"
                        :disabled="isAssigning || isReseting || props.archers.length === 0" :loading="isAssigning"
                        @click="showAutoAssignMenu = !showAutoAssignMenu">
                        Penempatan Otomatis
                        <Icon icon="ph:caret-down-bold" class="ml-2 text-xs" />
                    </BaseButton>

                    <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                        <div v-if="showAutoAssignMenu" v-click-outside="() => showAutoAssignMenu = false"
                            class="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-[1001] origin-top-right">
                            <div class="px-4 py-2 border-b border-gray-50 mb-2">
                                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pilih tipe
                                    draw</span>
                            </div>

                            <button type="button" @click="handleAutoAssignSelection('standard')"
                                class="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left group">
                                <div
                                    class="size-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors">
                                    <Icon icon="ph:list-numbers-bold" class="text-lg" />
                                </div>
                                <div class="flex-1">
                                    <div
                                        class="text-xs font-black text-navy group-hover:text-primary transition-colors">
                                        Standard Draw</div>
                                    <div class="text-[10px] text-gray-400 leading-tight mt-0.5">Berurutan A-C-B-D
                                        (Standar
                                        Ianseo)</div>
                                </div>
                            </button>

                            <button type="button" @click="handleAutoAssignSelection('field')"
                                class="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left group">
                                <div
                                    class="size-8 rounded-lg bg-gray-100 text-gray-400 group-hover:bg-primary group-hover:text-white flex items-center justify-center transition-colors">
                                    <Icon icon="ph:steps-bold" class="text-lg" />
                                </div>
                                <div class="flex-1">
                                    <div
                                        class="text-xs font-black text-navy group-hover:text-primary transition-colors">
                                        Field / 3D Draw</div>
                                    <div class="text-[10px] text-gray-400 leading-tight mt-0.5">Lompat +2 target untuk
                                        jarak
                                        aman</div>
                                </div>
                            </button>
                        </div>
                    </transition>
                </div>
            </div>
        </div>

        <!-- Kanban Board Layout -->
        <div class="flex flex-col lg:flex-row gap-6">
            <!-- Unassigned Column -->
            <div class="lg:w-80 shrink-0 lg:self-start lg:sticky lg:top-4">
                <div class="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-4 min-h-[500px] flex flex-col gap-4"
                    @dragover.prevent @drop="handleDropOnUnassigned">
                    <div class="flex items-center justify-between px-2">
                        <h3 class="font-black text-navy text-xs uppercase tracking-widest">Belum Terbagi</h3>
                        <span class="bg-navy text-white text-[10px] font-black px-2 py-0.5 rounded-full">{{
                            unassignedArchersCount }}</span>
                    </div>

                    <div v-if="unassignedArchersCount === 0"
                        class="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-30">
                        <Icon icon="ph:check-circle-bold" class="text-4xl mb-2" />
                        <div class="text-[10px] font-bold">Semua sudah terbagi</div>
                    </div>

                    <div v-else class="flex flex-col gap-0 max-h-[700px] overflow-y-auto no-scrollbar pb-10">
                        <div v-for="group in unassignedArchersByClub" :key="group.clubName" class="space-y-2">
                            <!-- Group Divider -->
                            <div class="flex items-center gap-3 px-2 py-3">
                                <div class="flex-1 h-[1px] bg-gray-200"></div>
                                <span
                                    class="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap bg-gray-50 px-2 rounded-full border border-gray-100 shadow-sm">
                                    {{ group.clubName }}
                                </span>
                                <div class="flex-1 h-[1px] bg-gray-200"></div>
                            </div>

                            <div v-for="archer in group.archers" :key="archer.uuid" draggable="true"
                                @dragstart="(e) => handleDragStart(e, archer)" @dragend="handleDragEnd"
                                class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md transition-all flex items-center gap-3 group mx-1">
                                <div
                                    class="size-9 rounded-full border border-gray-100 overflow-hidden shrink-0 bg-gray-50 pointer-events-none">
                                    <img :src="useImageOrDefault(archer.avatar_url, archer.name)" draggable="false"
                                        class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1 min-w-0 pointer-events-none">
                                    <div class="text-[11px] font-black text-navy truncate">{{ archer.name }}</div>
                                    <div class="text-[9px] text-gray-400 font-bold truncate uppercase tracking-tighter">
                                        {{ archer.club || 'Independen' }}
                                    </div>
                                </div>
                                <Icon icon="ph:dots-six-vertical-bold"
                                    class="text-gray-300 group-hover:text-primary pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Target Grid Column -->
            <div class="flex-1">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div v-for="target in targetGrid" :key="target.name"
                        class="bg-white rounded-2xl shadow-sm border relative border-gray-100 flex flex-col hover:shadow-md transition-all group/card"
                        :class="{ 'z-[100]': openDropdown?.targetId === target.name }">
                        <!-- Card Header -->
                        <div
                            class="px-5 py-3 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center rounded-t-2xl">
                            <div class="flex items-center gap-3">
                                <div
                                    class="bg-navy text-btn-inverse font-black text-xs px-2 py-1 rounded-lg shadow-sm flex items-center gap-2">
                                    <span>{{ target.name.split(' ').pop() }}</span>
                                    <span v-if="target.assignedCount > 0"
                                        class="text-white text-[10px] font-mono border-l border-white/10 pl-2"
                                        title="Kode Board">
                                        {{ getBoardCode(target.name) ? getBoardCode(target.name) :
                                            String(target.name.match(/\d+/)?.[0] || '').padStart(2, '0') }}
                                    </span>
                                </div>
                            </div>
                            <span :class="[
                                'text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full',
                                target.assignedCount === target.availableLetters.length ? 'bg-green-100 text-green-700' :
                                    target.assignedCount === 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'
                            ]">
                                {{ target.assignedCount === target.availableLetters.length ? 'Penuh' :
                                    target.assignedCount === 0 ? 'Kosong' : `${target.availableLetters.length -
                                        target.assignedCount} Slot tersedia` }}
                            </span>
                        </div>

                        <div class="p-4 space-y-3">
                            <div v-for="pos in target.availableLetters" :key="pos" class="group" @dragover.prevent
                                @drop="handleDropOnTarget(target, pos)">
                                <div v-if="target.slots[pos]" draggable="true"
                                    @dragstart="(e) => handleDragStart(e, target.slots[pos], target, pos)"
                                    @dragend="handleDragEnd"
                                    class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-transparent hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing shadow-sm group/slot-filled"
                                    :class="{ 'opacity-50': draggedArcher?.archer.uuid === target.slots[pos].uuid }">
                                    <span
                                        class="flex items-center justify-center size-7 rounded-lg bg-white border border-gray-200 text-xs font-black text-navy shadow-sm shrink-0">
                                        {{ pos }}
                                    </span>
                                    <div
                                        class="size-8 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-white pointer-events-none">
                                        <img :src="useImageOrDefault(target.slots[pos].avatar_url, target.slots[pos].name)"
                                            draggable="false" class="w-full h-full object-cover"
                                            :alt="target.slots[pos].name" />
                                    </div>
                                    <div class="flex-1 min-w-0 pointer-events-none">
                                        <div class="text-[11px] font-black text-navy truncate leading-tight">{{
                                            target.slots[pos].name }}</div>
                                        <div
                                            class="text-[9px] text-gray-500 truncate font-bold uppercase tracking-tighter">
                                            {{
                                                target.slots[pos].club || 'Independen' }}</div>
                                    </div>
                                    <BaseButton variant="white" size="sm" icon="ph:x-bold"
                                        class="!size-6 !p-0 !rounded-lg text-gray-400 hover:!text-red-500 hover:!bg-red-50 opacity-0 group-hover/slot-filled:opacity-100"
                                        @click="unassignArcherFromTarget(target.slots[pos].assignmentId)" />
                                </div>

                                <!-- Custom Archer Dropdown -->
                                <div v-else class="relative archer-dropdown-container" @dragover.prevent
                                    @drop.stop="handleDropOnTarget(target, pos)">
                                    <div v-if="target.otherSlots[pos]"
                                        class="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-100/50 opacity-60">
                                        <span
                                            class="flex items-center justify-center size-7 rounded-lg bg-gray-200 border border-gray-200 text-xs font-black text-gray-400 shrink-0">
                                            {{ pos }}
                                        </span>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-[11px] font-black text-gray-500 truncate leading-tight">
                                                {{ target.otherSlots[pos].archer_name }}
                                            </div>
                                            <div class="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                                Lain Kategori
                                            </div>
                                        </div>
                                        <div class="size-6 flex items-center justify-center">
                                            <Icon icon="ph:lock-key-bold" class="text-gray-300" />
                                        </div>
                                    </div>

                                    <div v-else @click.stop="toggleDropdown(target.name, pos)"
                                        class="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-gray-200 bg-white hover:bg-gray-50/50 hover:border-primary/50 transition-all cursor-pointer group/slot"
                                        :class="{ 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-inner': isDragging }"
                                        @dragover.prevent="(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move' }">
                                        <span
                                            class="flex items-center justify-center size-7 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 shrink-0">
                                            {{ pos }}
                                        </span>
                                        <div class="flex-1 min-w-0">
                                            <div class="text-xs font-bold text-gray-300">Pindahkan
                                                Kemari...</div>
                                        </div>
                                        <Icon icon="ph:plus-circle-bold"
                                            class="text-gray-200 text-lg group-hover/slot:text-primary transition-colors" />
                                    </div>
                                    <div v-if="openDropdown?.targetId === target.name && openDropdown?.pos === pos"
                                        class="absolute !z-[10000] mt-1 w-full min-w-[280px] bg-white shadow-2xl border border-gray-100 py-2 left-0 top-full">
                                        <div class="px-3 pb-2 border-b border-gray-50">
                                            <div class="relative">
                                                <Icon icon="ph:magnifying-glass"
                                                    class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input v-model="filterText" type="text" placeholder="Cari pemanah..."
                                                    class="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                                                    @click.stop />
                                            </div>
                                        </div>
                                        <div class="max-h-60 overflow-y-auto pt-1 no-scrollbar">
                                            <div v-if="unassignedArcherListFiltered.length === 0"
                                                class="px-4 py-3 text-center text-gray-400 text-xs font-bold">
                                                Semua pemanah terbagi
                                            </div>
                                            <BaseButton v-for="archer in unassignedArcherListFiltered"
                                                :key="archer.uuid"
                                                @click="assignArcherToTarget(target, pos, archer.uuid)" variant="white"
                                                class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-none border-b border-gray-50 last:border-0 group/archer-item shadow-none justify-start">
                                                <div
                                                    class="size-8 rounded-full border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                                                    <img :src="useImageOrDefault(archer.avatar_url, archer.name)"
                                                        class="w-full h-full object-cover" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div
                                                        class="text-xs font-black text-navy truncate leading-tight mb-0.5">
                                                        {{ archer.name }}
                                                    </div>
                                                    <div
                                                        class="text-[9px] text-gray-500 font-bold truncate uppercase tracking-tighter">
                                                        {{
                                                            archer.club || 'Independen' }}</div>
                                                </div>
                                            </BaseButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppDialog v-model:show="showResetDialog" type="danger" title="Atur Ulang Penempatan"
        message="Apakah Anda yakin ingin menghapus semua penempatan target untuk kategori ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Atur Ulang" cancelText="Batal" icon="ph:trash-bold" @confirm="confirmReset" />

    <AppDialog v-model:show="showAutoAssignDialog" type="warning" title="Konfirmasi Penempatan"
        confirmText="Ya, Acak & Tempatkan" cancelText="Batal" icon="fa7-solid:random" @confirm="confirmAutoAssign">
        <template #default>
            <div class="space-y-4 text-left">
                <div class="text-sm text-gray-500">
                    Penempatan otomatis akan menghapus semua penempatan yang ada untuk kategori
                    ini, lalu menempatkan ulang semua pemanah secara otomatis menggunakan mode:
                    <span class="font-black text-navy block mt-1 uppercase">{{ drawType === 'standard' ? 'Standard Draw'
                        :
                        'Field / 3D Draw' }}</span>
                </div>
            </div>
        </template>
    </AppDialog>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import AppDialog from '~/components/common/AppDialog.vue'

const props = defineProps({
    eventId: { type: String, required: true },
    sessionData: { type: Object, required: true },
    selectedCategory: { type: String, required: true },
    availableTargets: { type: Array, default: () => [] },
    archers: { type: Array, default: () => [] },
    boardCodes: { type: Array, default: () => [] },
    allAssignments: { type: Array, default: () => [] }
})

const emit = defineEmits(['updated'])

const { post, delete: del } = useApi()
const toast = useToast()

const isSyncing = ref(false)
const isAssigning = ref(false)
const isReseting = ref(false)
const filterText = ref('')
const openDropdown = ref(null)
const showResetDialog = ref(false)
const showAutoAssignDialog = ref(false)
const showAutoAssignMenu = ref(false)
const drawType = ref('standard')

// Click outside directive implementation
const vClickOutside = {
    mounted(el, binding) {
        el.clickOutsideEvent = (event) => {
            if (!(el === event.target || el.contains(event.target))) {
                binding.value(event)
            }
        }
        document.addEventListener('mousedown', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.removeEventListener('mousedown', el.clickOutsideEvent)
    }
}

// Drag and Drop States
const draggedArcher = ref(null) // { archer, sourceTarget, sourcePos }
const isDragging = ref(false)

const unassignedArcherList = computed(() => {
    return props.archers.filter(a => !a.assignedTarget)
})

const unassignedArchersCount = computed(() => unassignedArcherList.value.length)

const unassignedArchersByClub = computed(() => {
    const list = unassignedArcherList.value
    const grouped = {}

    list.forEach(archer => {
        const clubName = archer.club || 'Independen'
        if (!grouped[clubName]) {
            grouped[clubName] = []
        }
        grouped[clubName].push(archer)
    })

    // Sort: Clubs first (A-Z), then Independen at the end
    return Object.keys(grouped).sort((a, b) => {
        if (a === 'Independen') return 1
        if (b === 'Independen') return -1
        return a.localeCompare(b)
    }).map(clubName => ({
        clubName,
        archers: grouped[clubName].sort((a, b) => a.name.localeCompare(b.name))
    }))
})

const unassignedArcherListFiltered = computed(() => {
    if (!filterText.value) return unassignedArcherList.value
    const q = filterText.value.toLowerCase()
    return unassignedArcherList.value.filter(a =>
        a.name.toLowerCase().includes(q) || (a.club && a.club.toLowerCase().includes(q))
    )
})

const targetGrid = computed(() => {
    if (!props.selectedCategory || !props.availableTargets.length) return []

    const archers = props.archers
    const grouped = {}

    props.availableTargets.forEach(t => {
        const baseName = t.name.replace(/[A-Za-z]$/, '').trim()
        const letterMatch = t.name.match(/[A-D]$/i)
        const letter = letterMatch ? letterMatch[0].toUpperCase() : 'A'

        if (!grouped[baseName]) {
            grouped[baseName] = {
                name: baseName,
                targetIds: [],
                targetUuids: {}, // New: map letter to UUID
                availableLetters: [],
                slots: {},
                otherSlots: {},
                assignedCount: 0
            }
        }
        grouped[baseName].targetIds.push(t.id)
        grouped[baseName].targetUuids[letter] = t.id // Store the UUID for this position

        if (!grouped[baseName].availableLetters.includes(letter)) {
            grouped[baseName].availableLetters.push(letter)
            grouped[baseName].availableLetters.sort()
            grouped[baseName].slots[letter] = null
            grouped[baseName].otherSlots[letter] = null
        }

        const targetArchers = archers.filter(a => a.assignedTarget === t.id)
        targetArchers.forEach((archer) => {
            if (grouped[baseName].slots[letter] === null) {
                grouped[baseName].slots[letter] = {
                    ...archer,
                    actualTargetId: t.id
                }
                grouped[baseName].assignedCount++
            }
        })

        // Check if taken by other categories
        if (grouped[baseName].slots[letter] === null) {
            const otherAssignment = props.allAssignments.find(a => a.target_id === t.id)
            if (otherAssignment) {
                grouped[baseName].otherSlots[letter] = otherAssignment
                grouped[baseName].assignedCount++
            }
        }
    })

    return Object.values(grouped).sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || 0)
        const numB = parseInt(b.name.match(/\d+/)?.[0] || 0)
        return numA - numB
    })
})

const getBoardCode = (boardName) => {
    const num = parseInt(boardName.match(/\d+/)?.[0])
    if (!num) return null
    const found = props.boardCodes.find(bc => bc.board_number === num)
    return found ? found.code : null
}

const getPositionCode = (targetName, pos) => {
    const boardCode = getBoardCode(targetName)
    if (boardCode) return `${boardCode}-${pos}`.toUpperCase()
    const num = targetName.match(/\d+/)?.[0]
    return num ? `${num}${pos}`.toUpperCase() : pos
}

const handleDragStart = (event, archer, targetRecord = null, pos = null) => {
    openDropdown.value = null // Close any open dropdowns when starting a drag
    // Set dataTransfer data — required for browsers to enable drag & drop
    event.dataTransfer.setData('text/plain', archer.uuid || '')
    event.dataTransfer.effectAllowed = 'move'
    draggedArcher.value = { archer, sourceTarget: targetRecord, sourcePos: pos }
    isDragging.value = true
    console.log('Drag started:', archer.name, 'from:', targetRecord?.name || 'Unassigned')
}

const handleDragEnd = () => {
    isDragging.value = false
    draggedArcher.value = null
}

const handleDropOnTarget = async (targetRecord, pos) => {
    console.log('Drop event on:', targetRecord.name, pos)
    if (!draggedArcher.value) {
        console.warn('Drop failed: No dragged archer found in state')
        return
    }

    const { archer: movingArcher, sourceTarget, sourcePos } = draggedArcher.value

    if (sourceTarget?.name === targetRecord.name && sourcePos === pos) {
        handleDragEnd()
        return
    }

    try {
        isSyncing.value = true
        const existingArcher = targetRecord.slots[pos]

        if (existingArcher && sourceTarget) {
            // It's a swap between two assigned archers
            await swapAssignments(movingArcher.uuid, existingArcher.uuid)
        } else {
            // Simple move or assign from unassigned
            await assignArcherToTarget(targetRecord, pos, movingArcher.uuid)
        }
    } finally {
        isSyncing.value = false
        handleDragEnd()
    }
}

const handleDropOnUnassigned = async () => {
    if (!draggedArcher.value) return
    const { archer: movingArcher } = draggedArcher.value

    try {
        isSyncing.value = true
        if (movingArcher.assignmentId) {
            await unassignArcherFromTarget(movingArcher.assignmentId)
        }
    } finally {
        isSyncing.value = false
        handleDragEnd()
    }
}

const toggleDropdown = (targetId, pos) => {
    if (openDropdown.value?.targetId === targetId && openDropdown.value?.pos === pos) {
        openDropdown.value = null
    } else {
        openDropdown.value = { targetId, pos }
        filterText.value = ''
    }
}

const assignArcherToTarget = async (baseTarget, position, archerUuid) => {
    try {
        isSyncing.value = true
        let targetId = baseTarget.targetIds[0]
        if (baseTarget.targetIds.length > 1) {
            const matched = props.availableTargets.find(t =>
                baseTarget.targetIds.includes(t.id) &&
                t.name.toUpperCase().endsWith(position)
            )
            if (matched) targetId = matched.id
        }

        const payload = {
            category_id: props.selectedCategory,
            assignments: [
                {
                    participant_id: archerUuid,
                    target_id: targetId
                }
            ]
        }

        await post(`/events/${props.eventId}/qualification/sessions/${props.sessionData.uuid}/assignments`, payload)

        toast.success('Pemanah berhasil ditempatkan')
        emit('updated')
        openDropdown.value = null
    } catch (error) {
        console.error('Failed to assign archer:', error)
        const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Gagal menempatkan pemanah'
        toast.error(errorMsg)
    } finally {
        isSyncing.value = false
    }
}

const swapAssignments = async (participantAUuid, participantBUuid) => {
    try {
        isSyncing.value = true
        await post(`/qualification/sessions/${props.sessionData.uuid}/swap-assignments`, {
            participant_a: participantAUuid,
            participant_b: participantBUuid
        })
        toast.success('Pemanah berhasil ditukar')
        emit('updated')
    } catch (error) {
        console.error('Failed to swap archers:', error)
        toast.error('Gagal menukar pemanah')
    } finally {
        isSyncing.value = false
    }
}

const unassignArcherFromTarget = async (assignmentId) => {
    if (!assignmentId) return
    try {
        isSyncing.value = true
        await del(`/qualification/assignments/${assignmentId}`)
        toast.success('Pemanah berhasil dilepas dari target')
        emit('updated')
    } catch (error) {
        console.error('Failed to unassign archer:', error)
        toast.error('Gagal melepas pemanah')
    } finally {
        isSyncing.value = false
    }
}

const autoAssignTargets = async () => {
    try {
        isAssigning.value = true
        await post(`/qualification/sessions/${props.sessionData.uuid}/auto-assign`, {
            category_id: props.selectedCategory,
            archers_per_target: props.sessionData.archers_per_target || 4,
            draw_type: drawType.value
        })

        toast.success('Auto-assignment berhasil')
        emit('updated')
    } catch (error) {
        console.error('Auto-assign failed:', error)
        toast.error('Gagal melakukan penempatan otomatis')
    } finally {
        isAssigning.value = false
    }
}

const confirmAutoAssign = async () => {
    await autoAssignTargets()
}

const resetAssignments = () => {
    showResetDialog.value = true
}

const confirmReset = async () => {
    try {
        isReseting.value = true
        await post(`/qualification/sessions/${props.sessionData.uuid}/reset-assignments`, {
            category_id: props.selectedCategory
        })

        toast.success('Berhasil mengatur ulang penempatan')
        emit('updated')
    } catch (error) {
        console.error('Reset assignments failed:', error)
        toast.error('Gagal mengatur ulang penempatan')
    } finally {
        isReseting.value = false
        showResetDialog.value = false
    }
}

const handleAutoAssignSelection = (type) => {
    drawType.value = type
    showAutoAssignMenu.value = false
    showAutoAssignDialog.value = true
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
