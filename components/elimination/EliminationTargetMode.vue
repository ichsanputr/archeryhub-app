<template>
    <div class="space-y-6">
        <!-- Top Target Allocation Stats & Action Bar -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <!-- Left: Title & Subtitle -->
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shadow-sm shrink-0 font-black">
                        <Icon icon="ph:target-bold" class="text-xl" />
                    </div>
                    <div>
                        <h3 class="text-base sm:text-lg font-black text-navy leading-tight">
                            {{ t('event_elimination.target_allocation', 'Alokasi Bantalan Target') }}
                        </h3>
                        <div class="text-xs text-slate-500 font-medium mt-0.5">
                            {{ t('event_elimination.target_allocation_desc', 'Tentukan posisi bantalan untuk setiap pertandingan di babak ini.') }}
                        </div>
                    </div>
                </div>

                <!-- Right: Auto Assign Button -->
                <div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <BaseButton variant="primary" icon="ph:magic-wand-bold" :loading="isAutoAssigning"
                        @click="$emit('auto-assign')" class="w-auto font-black text-xs sm:text-sm h-9 sm:h-10 px-4 sm:px-5 shadow-sm shadow-primary/20">
                        <span>{{ t('event_elimination.auto_assign', 'Auto Assign') }}</span>
                    </BaseButton>
                </div>
            </div>

            <!-- Filter Toolbar -->
            <div class="border-t border-slate-100 pt-3 space-y-3">
                <div class="flex flex-wrap items-center justify-between gap-3">
                    <!-- Left: Target Allocation Status Pills -->
                    <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                        <button type="button" @click="filterStatus = 'all'"
                            :class="[
                                'px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer',
                                filterStatus === 'all'
                                    ? 'bg-navy text-primary shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy'
                            ]">
                            <span>{{ t('event_elimination.all', 'Semua') }}</span>
                            <span class="px-1.5 py-0.2 rounded-md bg-white/15 text-[10px]">{{ roundMatches.length }}</span>
                        </button>

                        <button type="button" @click="filterStatus = 'assigned'"
                            :class="[
                                'px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer',
                                filterStatus === 'assigned'
                                    ? 'bg-navy text-primary shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy'
                            ]">
                            <span class="size-2 rounded-full bg-emerald-500"></span>
                            <span>{{ t('event_elimination.assigned', 'Sudah Diatur') }}</span>
                            <span class="px-1.5 py-0.2 rounded-md bg-white/15 text-[10px]">{{ assignedCount }}</span>
                        </button>

                        <button type="button" @click="filterStatus = 'unassigned'"
                            :class="[
                                'px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer',
                                filterStatus === 'unassigned'
                                    ? 'bg-navy text-primary shadow-sm'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy'
                            ]">
                            <span class="size-2 rounded-full bg-amber-500"></span>
                            <span>{{ t('event_elimination.unassigned', 'Belum Diatur') }}</span>
                            <span class="px-1.5 py-0.2 rounded-md bg-white/15 text-[10px]">{{ unassignedCount }}</span>
                        </button>
                    </div>

                    <!-- Right Controls: Stage Filter, Status Filter & Search -->
                    <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                        <!-- Stage Filter Dropdown -->
                        <div v-if="availableStages.length > 1" class="w-36 sm:w-44">
                            <BaseSelect v-model="filterStage" :options="stageFilterOptions" class="w-full text-xs font-bold" />
                        </div>

                        <!-- Match Progress Filter Dropdown -->
                        <div class="w-36 sm:w-44">
                            <BaseSelect v-model="filterProgress" :options="progressFilterOptions" class="w-full text-xs font-bold" />
                        </div>

                        <!-- Search Match / Archer -->
                        <div class="relative flex-1 sm:w-56 sm:flex-initial">
                            <input v-model="searchQuery" type="text"
                                :placeholder="t('event_elimination.search_archer_match', 'Cari pemanah / match...')"
                                class="w-full h-9 pl-8 pr-7 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-navy placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                            <Icon icon="ph:magnifying-glass-bold" class="absolute left-2.5 top-2.5 text-slate-400 text-sm" />
                            <button v-if="searchQuery" @click="searchQuery = ''"
                                class="absolute right-2 top-2 size-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] hover:bg-slate-300">
                                <Icon icon="ph:x-bold" />
                            </button>
                        </div>

                        <!-- Clear Filters Button -->
                        <button v-if="isAnyFilterActive" @click="resetFilters" type="button"
                            class="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            :title="t('event_elimination.clear_filters', 'Reset Filter')">
                            <Icon icon="ph:arrow-counter-clockwise-bold" class="text-xs" />
                            <span class="hidden sm:inline">{{ t('event_elimination.clear_filters', 'Reset Filter') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Matches Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            <div v-for="match in filteredMatches" :key="match.id"
                class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between group">
                
                <!-- Card Header: Clean (No Done chip, No Target chip) -->
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 flex-wrap">
                        <div class="px-2.5 py-1 rounded-lg bg-navy text-primary text-xs font-black tracking-wider flex items-center gap-1.5 shadow-sm">
                            <Icon icon="ph:trophy-bold" class="text-xs" />
                            <span>{{ t('event_elimination.match_label', { no: match.match_no }, `Match ${match.match_no}`) }}</span>
                        </div>
                        <!-- Match Stage Badge -->
                        <span class="px-2 py-0.5 rounded-lg border text-[10px] font-black tracking-wide"
                            :class="getStageBadge(match).colorClass">
                            {{ getStageBadge(match).shortLabel }}
                        </span>
                    </div>
                </div>

                <!-- Card Body: Face-to-Face Archer Duel Box -->
                <div class="bg-slate-50/80 rounded-xl border border-slate-100 p-3 space-y-2.5">
                    <!-- Archer Side A -->
                    <div class="flex items-center justify-between gap-2.5 p-2 rounded-lg bg-white border border-slate-200/80 transition-all">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <div class="relative shrink-0">
                                <img :src="getAvatarUrl(match.entry_a_name)"
                                    class="size-8 rounded-lg border border-slate-200 object-cover" />
                                <div v-if="match.entry_a_seed"
                                    class="absolute -left-1 -bottom-1 min-w-[14px] h-3.5 px-0.5 bg-navy text-primary text-[8px] font-black rounded flex items-center justify-center border border-white shadow-sm">
                                    {{ match.entry_a_seed }}
                                </div>
                            </div>
                            <div class="min-w-0">
                                <div class="text-[8px] font-black tracking-wider text-slate-400">{{ t('event_elimination.side_a', 'Side A') }}</div>
                                <div class="text-xs font-black text-slate-900 truncate">
                                    {{ match.entry_a_name || 'TBD' }}
                                </div>
                            </div>
                        </div>
                        <div v-if="match.winner_entry_id && match.winner_entry_id === match.entry_a_id"
                            class="px-1.5 py-0.5 rounded bg-primary text-navy text-[9px] font-black flex items-center gap-1 shrink-0">
                            <Icon icon="ph:crown-simple-fill" />
                            <span>{{ t('event_elimination.win_badge', 'Win') }}</span>
                        </div>
                    </div>

                    <!-- VS Divider -->
                    <div class="flex items-center justify-center -my-1">
                        <span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-black">VS</span>
                    </div>

                    <!-- Archer Side B -->
                    <div class="flex items-center justify-between gap-2.5 p-2 rounded-lg bg-white border border-slate-200/80 transition-all">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <div class="relative shrink-0">
                                <img :src="getAvatarUrl(match.entry_b_name)"
                                    class="size-8 rounded-lg border border-slate-200 object-cover" />
                                <div v-if="match.entry_b_seed"
                                    class="absolute -left-1 -bottom-1 min-w-[14px] h-3.5 px-0.5 bg-navy text-primary text-[8px] font-black rounded flex items-center justify-center border border-white shadow-sm">
                                    {{ match.entry_b_seed }}
                                </div>
                            </div>
                            <div class="min-w-0">
                                <div class="text-[8px] font-black tracking-wider text-slate-400">{{ t('event_elimination.side_b', 'Side B') }}</div>
                                <div class="text-xs font-black text-slate-900 truncate">
                                    {{ match.entry_b_name || (match.is_bye ? 'BYE' : 'TBD') }}
                                </div>
                            </div>
                        </div>
                        <div v-if="match.winner_entry_id && match.winner_entry_id === match.entry_b_id"
                            class="px-1.5 py-0.5 rounded bg-primary text-navy text-[9px] font-black flex items-center gap-1 shrink-0">
                            <Icon icon="ph:crown-simple-fill" />
                            <span>{{ t('event_elimination.win_badge', 'Win') }}</span>
                        </div>
                    </div>
                </div>

                <!-- Card Footer: Target Selection Dropdown or BYE Info -->
                <div class="space-y-1 pt-1">
                    <label class="text-[10px] font-black tracking-wider text-slate-500 flex items-center gap-1">
                        <Icon icon="ph:target-bold" class="text-xs text-primary" />
                        <span>{{ t('event_elimination.select_target_board', 'Pilih Bantalan Target') }}</span>
                    </label>
                    <div v-if="isByeMatch(match)" class="h-9 px-3 rounded-xl bg-slate-100 border border-slate-200/80 text-slate-500 text-xs font-bold flex items-center gap-2">
                        <Icon icon="ph:info-bold" class="text-sm text-slate-400 shrink-0" />
                        <span class="truncate">{{ t('event_elimination.bye_no_target', 'BYE Match - Otomatis lolos tanpa bantalan target') }}</span>
                    </div>
                    <BaseSelect v-else :model-value="match.target_id" :options="getTargetOptions(match.id)" class="w-full text-xs"
                        @update:model-value="val => { match.target_id = val; $emit('update-target', match) }" />
                </div>
            </div>
        </div>

        <!-- Empty State when no matches found -->
        <div v-if="filteredMatches.length === 0"
            class="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div class="size-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Icon icon="ph:target-bold" class="text-2xl" />
            </div>
            <div>
                <h4 class="text-sm font-black text-navy">{{ t('event_elimination.no_matching_matches', 'Tidak ada pertandingan yang cocok') }}</h4>
                <div class="text-xs text-slate-500 mt-0.5">{{ t('event_elimination.no_matching_matches_desc', 'Coba ubah kata kunci pencarian atau filter status target.') }}</div>
            </div>
            <BaseButton v-if="isAnyFilterActive" variant="white" size="sm" @click="resetFilters" icon="ph:arrow-counter-clockwise-bold" class="text-xs font-bold">
                {{ t('event_elimination.clear_filters', 'Reset Filter') }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import { generateDicebearAvatar } from '~/composables/useImageHelper'
import { getMatchStageBadge } from '~/utils/eliminationStage'

const props = defineProps({
    roundMatches: { type: Array, required: true },
    targetOptions: { type: Array, required: true },
    isAutoAssigning: { type: Boolean, default: false },
    bracketSize: { type: Number, default: 8 }
})

defineEmits(['update-target', 'auto-assign'])

const { t, locale } = useDashboardI18n()

const filterStatus = ref('all') // 'all' | 'assigned' | 'unassigned'
const filterStage = ref('all') // 'all' | stage key
const filterProgress = ref('all') // 'all' | 'upcoming' | 'finished' | 'bye'
const searchQuery = ref('')

const isByeMatch = (match) => {
    if (!match) return false
    return match.is_bye === true || 
           match.is_bye === 1 || 
           match.is_bye === '1' ||
           match.entry_b_name === 'BYE' || 
           match.entry_a_name === 'BYE' ||
           (!match.entry_b_id && match.entry_a_id && !match.entry_b_uuid) ||
           (!match.entry_a_id && match.entry_b_id && !match.entry_a_uuid)
}

const assignedCount = computed(() => {
    return props.roundMatches.filter(m => !!m.target_id || !!m.target_name).length
})

const unassignedCount = computed(() => {
    return props.roundMatches.filter(m => !isByeMatch(m) && !m.target_id && !m.target_name).length
})

const getStageBadge = (match) => {
    const stage = getMatchStageBadge(match, props.bracketSize)
    if (!stage) return { label: 'Match', shortLabel: 'M', colorClass: '' }
    const isId = locale.value === 'id'
    return {
        ...stage,
        label: isId && stage.idLabel ? stage.idLabel : stage.label,
        shortLabel: isId && stage.idLabel 
            ? (stage.shortLabel === 'Gold Final' ? 'Final (Emas)' : stage.shortLabel === 'Bronze Match' ? 'Juara 3' : stage.idLabel.includes('Perempat') ? 'Perempat Final' : stage.idLabel) 
            : stage.shortLabel
    }
}

// Dynamic Stages extracted from the current round matches
const availableStages = computed(() => {
    const stageMap = new Map()
    const isId = locale.value === 'id'
    props.roundMatches.forEach(m => {
        const stage = getMatchStageBadge(m, props.bracketSize)
        if (stage && stage.shortLabel && !stageMap.has(stage.shortLabel)) {
            const title = isId && stage.idLabel 
                ? (stage.shortLabel === 'Gold Final' ? 'Final (Emas)' : stage.shortLabel === 'Bronze Match' ? 'Juara 3' : stage.idLabel.includes('Perempat') ? 'Perempat Final' : stage.idLabel) 
                : (stage.label || stage.shortLabel)
            stageMap.set(stage.shortLabel, {
                title,
                value: stage.shortLabel
            })
        }
    })
    return Array.from(stageMap.values())
})

const stageFilterOptions = computed(() => [
    { title: `-- ${t('event_elimination.all_stages', 'Semua Babak')} --`, value: 'all' },
    ...availableStages.value
])

const progressFilterOptions = computed(() => [
    { title: `-- ${t('event_elimination.all_statuses', 'Semua Status')} --`, value: 'all' },
    { title: t('event_elimination.status_upcoming', 'Belum Selesai'), value: 'upcoming' },
    { title: t('event_elimination.status_finished', 'Selesai'), value: 'finished' },
    { title: t('event_elimination.status_bye', 'BYE'), value: 'bye' }
])

const isAnyFilterActive = computed(() => {
    return filterStatus.value !== 'all' || 
           filterStage.value !== 'all' || 
           filterProgress.value !== 'all' || 
           searchQuery.value.trim() !== ''
})

const resetFilters = () => {
    filterStatus.value = 'all'
    filterStage.value = 'all'
    filterProgress.value = 'all'
    searchQuery.value = ''
}

const filteredMatches = computed(() => {
    return props.roundMatches.filter(m => {
        const isAssigned = !!m.target_id || !!m.target_name
        const isBye = isByeMatch(m)
        const isFinished = m.status === 'finished' || !!m.winner_entry_id

        // 1. Target Allocation status filter
        if (filterStatus.value === 'assigned' && !isAssigned) return false
        if (filterStatus.value === 'unassigned' && (isAssigned || isBye)) return false

        // 2. Stage filter
        if (filterStage.value !== 'all') {
            const stage = getMatchStageBadge(m, props.bracketSize)
            if (!stage || stage.shortLabel !== filterStage.value) return false
        }

        // 3. Match Progress filter
        if (filterProgress.value === 'upcoming' && (isFinished || isBye)) return false
        if (filterProgress.value === 'finished' && !isFinished) return false
        if (filterProgress.value === 'bye' && !isBye) return false

        // 4. Search query
        if (searchQuery.value.trim()) {
            const q = searchQuery.value.toLowerCase()
            const matchNo = `match ${m.match_no}`.toLowerCase()
            const nameA = (m.entry_a_name || '').toLowerCase()
            const nameB = (m.entry_b_name || '').toLowerCase()
            const targetName = (m.target_name || '').toLowerCase()
            const boardCode = (m.board_code || '').toLowerCase()
            if (!matchNo.includes(q) && !nameA.includes(q) && !nameB.includes(q) && !targetName.includes(q) && !boardCode.includes(q)) {
                return false
            }
        }
        return true
    })
})

const getFilteredOptions = (currentMatchId) => {
    const assignedIds = props.roundMatches
        .filter(m => m.id !== currentMatchId && m.target_id)
        .map(m => m.target_id)

    return props.targetOptions.filter(option => !assignedIds.includes(option.id))
}

const getTargetOptions = (matchId) => {
    return [
        { title: `-- ${t('event_elimination.select_target_option', 'Pilih Target')} --`, value: '' },
        ...getFilteredOptions(matchId).map(opt => ({
            title: `${opt.displayName || opt.name} ${opt.board_code ? `(${opt.board_code})` : ''}`,
            value: opt.id
        }))
    ]
}

const getAvatarUrl = (name) => {
    return generateDicebearAvatar(name)
}
</script>
