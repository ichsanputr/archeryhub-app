<template>
    <div class="match-node-card group/card shadow-sm cursor-pointer transition-all active:scale-[0.98]"
        :class="{ 'selected': isSelected, 'completed': match.winner_entry_id, 'is-final': isFinal }"
        @click="handleCardClick">
        <div class="match-card-header" :class="{ '!bg-primary/5': isFinal, '!bg-orange-50/50': isBronze }">
            <div class="flex items-center gap-1.5" :class="headerTextStyle">
                <Icon :icon="headerIcon" class="text-[10px]" />
                <span class="text-[8px] font-black tracking-widest ">{{ headerLabel }}</span>
            </div>
            <span class="match-no-label">M{{ match.match_no }}</span>
        </div>
        <div class="archer-list">
            <div v-for="side in ['A', 'B']" :key="side" class="archer-item"
                :class="{ 'is-winner': isWinner(side), 'is-loser': isLoser(side) }">
                <div class="avatar-wrapper relative">
                    <img :src="getAvatarUrl(getName(side))" class="avatar-img" />
                    <div v-if="isWinner(side)" class="winner-indicator">
                        <Icon icon="ph:crown-fill" />
                    </div>
                    <div v-if="showSeed && getSeed(side)" class="avatar-seed-badge">
                        {{ getSeed(side) }}
                    </div>
                </div>
                <div class="archer-info">
                    <span class="archer-name">
                        {{ getName(side) || (match.is_bye ? 'BYE' : 'TBD') }}
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
    if (props.match?.id) {
        router.push(`/match/${props.match.id}`)
    }
}

const headerLabel = computed(() => {
    if (props.isFinal) return 'Perebutan Juara 1 & 2'
    if (props.isBronze) return 'Third Place'
    return `Match`
})

const headerIcon = computed(() => {
    if (props.isFinal) return 'ph:medal-fill'
    if (props.isBronze) return 'ph:medal-bold'
    return 'ph:trophy-bold'
})

const headerTextStyle = computed(() => {
    if (props.isFinal) return 'text-navy font-black'
    if (props.isBronze) return 'text-orange-700 font-bold'
    return 'opacity-60'
})

const getAvatarUrl = (name) => {
    if (!name || name === 'TBD' || name === 'BYE') return `https://ui-avatars.com/api/?name=??&background=f1f5f9&color=94a3b8&font-size=0.45`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffaa00&color=202434&font-size=0.45&bold=true`
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
    position: relative;
    width: 280px;
    min-height: 130px;
    background: white;
    border-radius: 1rem;
    border: 2px solid #d1dcf0;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
}

.match-node-card:hover {
    border-color: #D9FF00;
    box-shadow: 0 0 0 2px rgba(217, 255, 0, 0.35);
    z-index: 10;
}

.match-node-card.selected {
    @apply ring-4 ring-primary/20 border-primary shadow-lg shadow-primary/10 z-20;
}

.match-node-card.completed {
    @apply border-green-500/20;
}

.match-card-header {
    @apply flex justify-between items-center px-4 py-2 bg-slate-50 border-b border-[#d1dcf0];
}

.match-no-label {
    @apply text-[10px] font-black text-navy underline underline-offset-1;
}

.archer-list {
    @apply flex-1 flex flex-col;
}

.archer-item {
    @apply flex items-center gap-3 px-4 flex-1 transition-all relative;
}

.avatar-wrapper {
    @apply size-8 rounded-lg overflow-visible shrink-0 bg-slate-100 border border-slate-200 p-0.5;
}

.avatar-img {
    @apply w-full h-full rounded-md object-cover;
}

.avatar-seed-badge {
    @apply absolute -left-2 -bottom-1 min-w-[14px] h-3.5 px-1 bg-navy text-primary text-[8px] font-black rounded-full flex items-center justify-center border border-white shadow-sm transition-all z-20;
}

.winner-indicator {
    @apply absolute -top-1.5 -right-1.5 size-4 bg-primary text-btn-text rounded-full flex items-center justify-center text-[8px] shadow-sm border border-white z-20;
}

.archer-info {
    @apply flex items-center gap-2 flex-1 min-w-0;
}

.archer-name {
    @apply text-[11px] font-black text-black truncate tracking-tight;
}

.score-display {
    @apply text-base font-black text-black/40 tabular-nums min-w-[44px] h-full flex items-center justify-end border-l border-[#d1dcf0] bg-slate-50/50 px-3;
}

.is-winner .score-display {
    @apply text-black text-lg font-black;
    animation: celebrate 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes celebrate {
    0% {
        transform: scale(0.8);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.is-winner .archer-name {
    @apply text-black font-black;
}

.is-loser {
    @apply opacity-30 grayscale-[0.5];
}

.is-final {
    @apply w-[320px] h-[150px] bg-white border-2;
}
</style>
