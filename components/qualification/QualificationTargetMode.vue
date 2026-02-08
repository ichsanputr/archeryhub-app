<template>
    <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 class="text-xl font-black text-navy leading-tight">Pengaturan Target</h2>
                <p class="text-sm text-gray-500 mt-1">Kelola penempatan pemanah pada target kualifikasi (Drag & Drop)
                </p>
            </div>
            <div class="flex items-center gap-3">
                <button @click="autoAssignTargets" :disabled="isSyncing || unassignedArchersCount === 0"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-navy hover:bg-primary/90 font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 group">
                    <Icon v-if="isSyncing" icon="ph:spinner-bold" class="text-xl animate-spin" />
                    <Icon v-else icon="fa7-solid:random" class="text-xl group-hover:rotate-12 transition-transform" />
                    Auto-Assign
                </button>
            </div>
        </div>

        <!-- Kanban Board Layout -->
        <div class="flex flex-col lg:flex-row gap-6">
            <!-- Unassigned Column -->
            <div class="lg:w-80 shrink-0 flex flex-col gap-4">
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
                        <p class="text-[10px] font-bold">Semua sudah terbagi</p>
                    </div>

                    <div v-else class="flex flex-col gap-2 max-h-[700px] overflow-y-auto no-scrollbar pb-10">
                        <div v-for="archer in unassignedArcherList" :key="archer.uuid" draggable="true"
                            @dragstart="handleDragStart(archer)" @dragend="handleDragEnd"
                            class="bg-white p-3 rounded-xl border border-gray-100 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md transition-all flex items-center gap-3 group">
                            <div class="size-9 rounded-full border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                                <img :src="useImageOrDefault(archer.avatar_url, archer.name)"
                                    class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-[11px] font-black text-navy truncate">{{ archer.name }}</p>
                                <p class="text-[9px] text-gray-400 font-bold truncate uppercase tracking-tighter">{{
                                    archer.club ||
                                    'Independen' }}</p>
                            </div>
                            <Icon icon="ph:dots-six-vertical-bold" class="text-gray-300 group-hover:text-primary" />
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
                                <div class="bg-navy text-primary font-black text-xs px-2 py-1 rounded-lg shadow-sm">
                                    {{ target.name.split(' ').pop() }}
                                </div>
                            </div>
                            <span :class="[
                                'text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full',
                                target.assignedCount === target.availableLetters.length ? 'bg-green-100 text-green-700' :
                                    target.assignedCount === 0 ? 'bg-gray-100 text-gray-400' : 'bg-blue-100 text-blue-700'
                            ]">
                                {{ target.assignedCount === target.availableLetters.length ? 'Full' :
                                    target.assignedCount === 0 ? 'Empty' : `${target.availableLetters.length -
                                        target.assignedCount} Slots Open` }}
                            </span>
                        </div>

                        <div class="p-4 space-y-3">
                            <div v-for="pos in target.availableLetters" :key="pos" class="group" @dragover.prevent
                                @drop="handleDropOnTarget(target, pos)">
                                <div v-if="target.slots[pos]" draggable="true"
                                    @dragstart="handleDragStart(target.slots[pos], target, pos)"
                                    @dragend="handleDragEnd"
                                    class="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-transparent hover:border-primary/30 transition-all cursor-grab active:cursor-grabbing shadow-sm group/slot-filled"
                                    :class="{ 'opacity-50': draggedArcher?.archer.uuid === target.slots[pos].uuid }">
                                    <span
                                        class="flex items-center justify-center size-7 rounded-lg bg-white border border-gray-200 text-xs font-black text-navy shadow-sm shrink-0">
                                        {{ pos }}
                                    </span>
                                    <div
                                        class="size-8 rounded-full border border-gray-200 overflow-hidden shrink-0 bg-white">
                                        <img :src="useImageOrDefault(target.slots[pos].avatar_url, target.slots[pos].name)"
                                            class="w-full h-full object-cover" :alt="target.slots[pos].name" />
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-[11px] font-black text-navy truncate leading-tight">{{
                                            target.slots[pos].name }}</p>
                                        <p
                                            class="text-[9px] text-gray-500 truncate font-bold uppercase tracking-tighter">
                                            {{
                                                target.slots[pos].club || 'Independen' }}</p>
                                    </div>
                                    <button @click="unassignArcherFromTarget(target.slots[pos].assignmentId)"
                                        class="size-6 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover/slot-filled:opacity-100 flex items-center justify-center">
                                        <Icon icon="ph:x-bold" class="text-xs" />
                                    </button>
                                </div>

                                <!-- Custom Archer Dropdown -->
                                <div v-else class="relative archer-dropdown-container">
                                    <div @click.stop="toggleDropdown(target.name, pos)"
                                        class="flex items-center gap-3 p-2.5 rounded-xl border border-dashed border-gray-200 bg-white hover:bg-gray-50/50 hover:border-primary/50 transition-all cursor-pointer group/slot"
                                        :class="{ 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-inner': isDragging }">
                                        <span
                                            class="flex items-center justify-center size-7 rounded-lg bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 shrink-0">
                                            {{ pos }}
                                        </span>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-xs font-bold text-gray-300">Pindahkan Kemari...</p>
                                        </div>
                                        <Icon icon="ph:plus-circle-bold"
                                            class="text-gray-200 text-lg group-hover/slot:text-primary transition-colors" />
                                    </div>
                                    <div v-if="openDropdown?.targetId === target.name && openDropdown?.pos === pos"
                                        class="absolute !z-[10000] mt-1 w-full min-w-[280px] bg-white rounded-xl shadow-2xl border border-gray-100 py-2 left-0 top-full">
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
                                            <button v-for="archer in unassignedArcherListFiltered" :key="archer.uuid"
                                                @click="assignArcherToTarget(target, pos, archer.uuid)"
                                                class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors border-b border-gray-50 last:border-0 group/archer-item">
                                                <div
                                                    class="size-8 rounded-full border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                                                    <img :src="useImageOrDefault(archer.avatar_url, archer.name)"
                                                        class="w-full h-full object-cover" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <p
                                                        class="text-xs font-black text-navy truncate leading-tight mb-0.5">
                                                        {{ archer.name }}
                                                    </p>
                                                    <p
                                                        class="text-[9px] text-gray-500 font-bold truncate uppercase tracking-tighter">
                                                        {{
                                                            archer.club || 'Independen' }}</p>
                                                </div>
                                            </button>
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
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

const props = defineProps({
    eventId: { type: String, required: true },
    sessionData: { type: Object, required: true },
    selectedCategory: { type: String, required: true },
    availableTargets: { type: Array, default: () => [] },
    archers: { type: Array, default: () => [] }
})

const emit = defineEmits(['updated'])

const { post, delete: del } = useApi()
const toast = useToast()

const isSyncing = ref(false)
const filterText = ref('')
const openDropdown = ref(null)

// Drag and Drop States
const draggedArcher = ref(null) // { archer, sourceTarget, sourcePos }
const isDragging = ref(false)

const unassignedArcherList = computed(() => {
    return props.archers.filter(a => !a.assignedTarget)
})

const unassignedArchersCount = computed(() => unassignedArcherList.value.length)

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
                availableLetters: [],
                slots: {},
                assignedCount: 0
            }
        }
        grouped[baseName].targetIds.push(t.id)
        if (!grouped[baseName].availableLetters.includes(letter)) {
            grouped[baseName].availableLetters.push(letter)
            grouped[baseName].availableLetters.sort()
            grouped[baseName].slots[letter] = null
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
    })

    return Object.values(grouped).sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)?.[0] || 0)
        const numB = parseInt(b.name.match(/\d+/)?.[0] || 0)
        return numA - numB
    })
})

const handleDragStart = (archer, targetRecord = null, pos = null) => {
    draggedArcher.value = { archer, sourceTarget: targetRecord, sourcePos: pos }
    isDragging.value = true
}

const handleDragEnd = () => {
    isDragging.value = false
    draggedArcher.value = null
}

const handleDropOnTarget = async (targetRecord, pos) => {
    if (!draggedArcher.value) return

    const { archer: movingArcher, sourceTarget, sourcePos } = draggedArcher.value

    if (sourceTarget?.name === targetRecord.name && sourcePos === pos) {
        handleDragEnd()
        return
    }

    try {
        isSyncing.value = true
        // If there's an archer already in the target slot, we should ideally handle a swap
        // but for now, the upsert in backend will replace it if it's the same archer,
        // or fail if it's someone else (due to uq_qta_session_target).
        // To be safe, let's just use assignArcherToTarget which calls the API.

        await assignArcherToTarget(targetRecord, pos, movingArcher.uuid)
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
        isSyncing.value = true
        await post(`/qualification/sessions/${props.sessionData.uuid}/auto-assign`, {
            category_id: props.selectedCategory,
            archers_per_target: props.sessionData.archers_per_target || 4
        })

        toast.success('Auto-assignment berhasil')
        emit('updated')
    } catch (error) {
        console.error('Auto-assign failed:', error)
        toast.error('Gagal melakukan penempatan otomatis')
    } finally {
        isSyncing.value = false
    }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
