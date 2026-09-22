<template>
    <div class="match-node-card group/card cursor-pointer"
        :class="{ 
            'selected': isSelected, 
            'completed': match.winner_entry_id, 
            'is-final': isFinal,
            'is-bronze': isBronze
        }"
        @click="handleCardClick">
        <!-- Card Header Bar -->
        <div class="match-card-header" :class="headerBgClass">
            <div class="flex items-center gap-1.5" :class="headerTextStyle">
                <Icon :icon="headerIcon" class="text-xs shrink-0" />
                <span class="text-[9px] font-black tracking-wider truncate">{{ headerLabel }}</span>
            </div>
            <div class="flex items-center gap-1.5 shrink-0">
                <span v-if="match.winner_entry_id" class="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 text-[8px] font-black tracking-wider flex items-center gap-1">
                    <span class="size-1 rounded-full bg-emerald-500"></span>
                    <span>{{ t('event_elimination.done') }}</span>
                </span>
                <span v-else class="text-[9px] font-black text-slate-400 tracking-wider">M{{ match.match_no }}</span>
            </div>
        </div>

        <!-- Archer Sides List -->
        <div class="archer-list">
            <div v-for="side in ['A', 'B']" :key="side" class="archer-item"
                :class="{ 'is-winner': isWinner(side), 'is-loser': isLoser(side) }">
                <div class="avatar-wrapper relative">
                    <img :src="getAvatarUrl(getName(side))" :alt="getName(side) || 'Archer'" @error="(e) => e.target.src = generateDicebearAvatar(getName(side))" class="avatar-img" />
                    <div v-if="isWinner(side)" class="winner-indicator" :title="t('event_elimination.winner')">
                        <Icon icon="ph:crown-simple-fill" />
                    </div>
                    <div v-if="showSeed && getSeed(side)" class="avatar-seed-badge">
                        {{ getSeed(side) }}
                    </div>
                </div>
                <div class="archer-info">
                    <span class="archer-name">
                        {{ getName(side) || (match.is_bye ? t('event_elimination.bye') : t('event_elimination.tbd')) }}
                    </span>
                </div>
                <div class="score-display">
                    {{ getScoreValue(side) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateDicebearAvatar, useImageOrDefault } from '~/composables/useImageHelper'

const { t } = useI18n()

const props = defineProps({
    match: { type: Object, required: true },
    bracketFormat: { type: String, default: 'recurve_set' },
    isSelected: { type: Boolean, default: false },
    isFinal: { type: Boolean, default: false },
    isBronze: { type: Boolean, default: false },
    showSeed: { type: Boolean, default: false }
})

const router = useRouter()

const handleCardClick = () => {
    const targetId = props.match?.id || props.match?.uuid
    if (targetId) {
        router.push(`/match/${targetId}`)
    }
}

const headerLabel = computed(() => {
    if (props.isFinal) return t('event_elimination.gold_medal_final')
    if (props.isBronze) return t('event_elimination.bronze_medal_match')
    return t('event_elimination.match_label', 'Match {no}', { no: props.match.match_no })
})

const headerIcon = computed(() => {
    if (props.isFinal) return 'ph:crown-fill'
    if (props.isBronze) return 'ph:medal-fill'
    return 'ph:trophy-bold'
})

const headerBgClass = computed(() => {
    if (props.isFinal) return 'bg-amber-500/10 border-b border-amber-400/30'
    if (props.isBronze) return 'bg-amber-600/10 border-b border-amber-500/20'
    return 'bg-slate-50/90 border-b border-slate-100'
})

const headerTextStyle = computed(() => {
    if (props.isFinal) return 'text-amber-950 font-black'
    if (props.isBronze) return 'text-amber-900 font-black'
    return 'text-slate-500 font-bold'
})

const getAvatarUrl = (name, avatarUrl) => {
    if (avatarUrl) return useImageOrDefault(avatarUrl, name)
    return generateDicebearAvatar(name)
}

const getName = (side) => side === 'A' ? props.match.entry_a_name : props.match.entry_b_name
const getSeed = (side) => side === 'A' ? props.match.entry_a_seed : props.match.entry_b_seed

const getScoreValue = (side) => {
    if (props.bracketFormat === 'recurve_set') {
        return side === 'A' ? props.match.set_points_a || 0 : props.match.set_points_b || 0
    }
    return side === 'A' ? props.match.total_score_a || 0 : props.match.total_score_b || 0
}

const isWinner = (side) => {
    if (!props.match.winner_entry_id) return false
    const id = side === 'A' ? props.match.entry_a_id : props.match.entry_b_id
    return props.match.winner_entry_id === id
}

const isLoser = (side) => {
    if (!props.match.winner_entry_id) return false
    const id = side === 'A' ? props.match.entry_a_id : props.match.entry_b_id
    return props.match.winner_entry_id !== id
}
</script>

<style scoped>
.match-node-card {
    @apply relative w-[280px] h-[126px] bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden flex flex-col;
}

.match-node-card:hover {
    @apply border-navy shadow-md scale-[1.01] -translate-y-0.5;
}

.match-node-card.selected {
    @apply ring-2 ring-primary border-navy shadow-lg z-20;
}

.match-node-card.completed {
    @apply border-slate-200/90;
}

.match-card-header {
    @apply flex justify-between items-center px-3.5 py-1.5 transition-colors;
}

.archer-list {
    @apply flex-1 flex flex-col;
}

.archer-item {
    @apply flex items-center gap-2.5 px-3 flex-1 transition-all relative border-b last:border-b-0 border-slate-100/70;
}

.avatar-wrapper {
    @apply size-8 rounded-lg overflow-visible shrink-0 bg-slate-100 border border-slate-200/80 p-0.5 shadow-sm;
}

.avatar-img {
    @apply w-full h-full rounded-md object-cover;
}

.avatar-seed-badge {
    @apply absolute -left-1.5 -bottom-0.5 min-w-[15px] h-3.5 px-0.5 bg-navy text-primary text-[8px] font-black rounded flex items-center justify-center border border-white shadow-sm z-10;
}

.winner-indicator {
    @apply absolute -top-1 -right-1 size-4 bg-primary text-navy rounded-full flex items-center justify-center text-[9px] shadow-sm border border-white z-10;
}

.archer-info {
    @apply flex items-center gap-1.5 flex-1 min-w-0;
}

.archer-name {
    @apply text-xs font-black text-slate-800 truncate tracking-tight;
}

.score-display {
    @apply text-xs font-black text-slate-600 tabular-nums min-w-[36px] h-7 px-2.5 rounded-xl flex items-center justify-center bg-slate-100 border border-slate-200/70 shrink-0 transition-all;
}

.is-winner {
    @apply bg-primary/5;
}

.is-winner .score-display {
    @apply bg-navy text-primary border-navy shadow-sm font-black;
}

.is-winner .archer-name {
    @apply text-navy font-black;
}

.is-loser {
    @apply opacity-35 grayscale-[0.4];
}

.is-final {
    @apply w-[310px] h-[140px] bg-white border-2 border-primary/80 shadow-md ring-1 ring-primary/30;
}

.is-bronze {
    @apply border-amber-600/40;
}
</style>
