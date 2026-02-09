<template>
    <div class="bracket-visualization rounded-[40px] shadow-sm overflow-hidden border border-gray-100">
        <div class="bracket-scroll-container no-scrollbar">
            <div v-if="Object.keys(rounds).length > 0" class="flex items-center justify-center min-w-max gap-0">

                <!-- LEFT SIDE ROUNDS -->
                <template v-for="rNo in leftSideRoundNumbers" :key="'left-' + rNo">
                    <div class="bracket-round">
                        <button type="button" @click="$emit('navigate-to-round', rNo)"
                            class="round-label group transition-all">
                            <span>{{ getRoundName(parseInt(rNo)) }}</span>
                            <div class="size-1 w-px h-4 bg-gray-200 mx-3 group-hover:bg-primary/30"></div>
                            <span class="text-[9px] font-black tracking-widest text-primary">Manage</span>
                        </button>
                        <div class="slots-container" :style="{ height: getSideTotalHeight + 'px' }">
                            <div v-for="match in getMatchesForSide(rNo, 'left')" :key="match.id" class="match-slot"
                                :style="{ height: getSlotHeightForSide(rNo) + 'px' }">
                                <div class="match-node-card group/card"
                                    :class="{ 'completed': match.winner_entry_id, 'selected': selectedMatch?.id === match.id }"
                                    @click="$emit('select-match', match)">
                                    <div class="match-card-header">
                                        <div class="flex items-center gap-1.5 opacity-40">
                                            <Icon icon="ph:trophy-bold" class="text-[10px]" /><span
                                                class="text-[8px] font-black tracking-widest uppercase">Match</span>
                                        </div>
                                        <span class="match-meta">#{{ match.match_no }}</span>
                                    </div>
                                    <div class="archer-item"
                                        :class="{ 'is-winner': match.winner_entry_id === match.entry_a_id, 'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_a_id }">
                                        <div class="avatar-wrapper relative"><img
                                                :src="getAvatarUrl(match.entry_a_name)" class="avatar-img" />
                                        </div>
                                        <div class="archer-info"><span class="seed-badge">{{ match.entry_a_seed
                                            || '-' }}</span><span class="archer-name">{{ match.entry_a_name
                                                    || (match.is_bye ? 'BYE' : 'TBD') }}</span></div>
                                        <span class="score-display">{{ getMatchScore(match, 'A') }}</span>
                                    </div>
                                    <div class="archer-item"
                                        :class="{ 'is-winner': match.winner_entry_id === match.entry_b_id, 'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_b_id }">
                                        <div class="avatar-wrapper relative"><img
                                                :src="getAvatarUrl(match.entry_b_name)" class="avatar-img" />
                                        </div>
                                        <div class="archer-info"><span class="seed-badge">{{ match.entry_b_seed
                                            || '-' }}</span><span class="archer-name">{{ match.entry_b_name
                                                    || 'TBD' }}</span></div>
                                        <span class="score-display">{{ getMatchScore(match, 'B') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Connector (Left to Center) -->
                    <div class="connector-space" :style="{ height: getSideTotalHeight + 'px' }">
                        <svg class="bracket-svg" :viewBox="`0 0 80 ${getSideTotalHeight}`" preserveAspectRatio="none">
                            <path v-for="i in Math.floor(getMatchesForSide(rNo, 'left').length / 2)" :key="i"
                                class="connector-line" :d="calculateConnectorPath(i, rNo, 'left')" />
                            <path v-if="getMatchesForSide(rNo, 'left').length === 1" class="connector-line"
                                :d="calculateConnectorPath(1, rNo, 'left', true)" />
                        </svg>
                    </div>
                </template>

                <!-- CENTER (FINAL) -->
                <div class="bracket-round">
                    <button type="button" @click="$emit('navigate-to-round', getTotalRounds)"
                        class="round-label final-label group transition-all">
                        <Icon icon="ph:crown-simple-fill" class="text-primary text-lg" />
                        <span>{{ getRoundName(getTotalRounds) }}</span>
                    </button>
                    <div class="slots-container" :style="{ height: getSideTotalHeight + 'px' }">
                        <div v-for="match in rounds[getTotalRounds]" :key="match.id" class="match-slot h-full">
                            <div class="match-node-card is-final group/card"
                                :class="{ 'completed': match.winner_entry_id, 'selected': selectedMatch?.id === match.id }"
                                @click="$emit('select-match', match)">
                                <div class="match-card-header">
                                    <div class="flex items-center gap-1.5 opacity-40 font-black text-primary">
                                        <Icon icon="ph:crown-bold" class="text-[10px]" /><span
                                            class="text-[8px] tracking-widest uppercase">Championship</span>
                                    </div>
                                    <span class="match-meta">#{{ match.match_no }}</span>
                                </div>
                                <div class="archer-item"
                                    :class="{ 'is-winner': match.winner_entry_id === match.entry_a_id, 'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_a_id }">
                                    <img :src="getAvatarUrl(match.entry_a_name)" class="avatar-img" />
                                    <div class="archer-info"><span class="seed-badge">{{ match.entry_a_seed ||
                                        '-' }}</span><span class="archer-name">{{ match.entry_a_name ||
                                                'TBD' }}</span></div>
                                    <span class="score-display">{{ getMatchScore(match, 'A') }}</span>
                                </div>
                                <div class="archer-item"
                                    :class="{ 'is-winner': match.winner_entry_id === match.entry_b_id, 'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_b_id }">
                                    <img :src="getAvatarUrl(match.entry_b_name)" class="avatar-img" />
                                    <div class="archer-info"><span class="seed-badge">{{ match.entry_b_seed ||
                                        '-' }}</span><span class="archer-name">{{ match.entry_b_name ||
                                                'TBD' }}</span></div>
                                    <span class="score-display">{{ getMatchScore(match, 'B') }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT SIDE ROUNDS (Reversed) -->
                <template v-for="rNo in rightSideRoundNumbers" :key="'right-' + rNo">
                    <!-- Connector (Center to Right) -->
                    <div class="connector-space" :style="{ height: getSideTotalHeight + 'px' }">
                        <svg class="bracket-svg" :viewBox="`0 0 80 ${getSideTotalHeight}`" preserveAspectRatio="none">
                            <path v-for="i in Math.floor(getMatchesForSide(rNo, 'right').length / 2)" :key="i"
                                class="connector-line" :d="calculateConnectorPath(i, rNo, 'right')" />
                            <path v-if="getMatchesForSide(rNo, 'right').length === 1" class="connector-line"
                                :d="calculateConnectorPath(1, rNo, 'right', true)" />
                        </svg>
                    </div>
                    <div class="bracket-round">
                        <button type="button" @click="$emit('navigate-to-round', rNo)"
                            class="round-label group transition-all">
                            <span class="text-[9px] font-black tracking-widest text-primary">Manage</span>
                            <div class="size-1 w-px h-4 bg-gray-200 mx-3 group-hover:bg-primary/30"></div>
                            <span>{{ getRoundName(parseInt(rNo)) }}</span>
                        </button>
                        <div class="slots-container" :style="{ height: getSideTotalHeight + 'px' }">
                            <div v-for="match in getMatchesForSide(rNo, 'right')" :key="match.id" class="match-slot"
                                :style="{ height: getSlotHeightForSide(rNo) + 'px' }">
                                <div class="match-node-card group/card"
                                    :class="{ 'completed': match.winner_entry_id, 'selected': selectedMatch?.id === match.id }"
                                    @click="$emit('select-match', match)">
                                    <div class="match-card-header flex-row-reverse">
                                        <div class="flex items-center gap-1.5 opacity-40"><span
                                                class="text-[8px] font-black tracking-widest uppercase">Match</span>
                                            <Icon icon="ph:trophy-bold" class="text-[10px]" />
                                        </div>
                                        <span class="match-meta">#{{ match.match_no }}</span>
                                    </div>
                                    <div class="archer-item flex-row-reverse"
                                        :class="{ 'is-winner': match.winner_entry_id === match.entry_a_id, 'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_a_id }">
                                        <div class="avatar-wrapper relative"><img
                                                :src="getAvatarUrl(match.entry_a_name)" class="avatar-img" />
                                        </div>
                                        <div class="archer-info flex-row-reverse"><span class="seed-badge ml-3">{{
                                            match.entry_a_seed || '-'
                                                }}</span><span class="archer-name text-right">{{
                                                    match.entry_a_name || (match.is_bye ? 'BYE' : 'TBD') }}</span>
                                        </div>
                                        <span class="score-display border-l-0 border-r">{{ getMatchScore(match,
                                            'A') }}</span>
                                    </div>
                                    <div class="archer-item flex-row-reverse"
                                        :class="{ 'is-winner': match.winner_entry_id === match.entry_b_id, 'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_b_id }">
                                        <div class="avatar-wrapper relative"><img
                                                :src="getAvatarUrl(match.entry_b_name)" class="avatar-img" />
                                        </div>
                                        <div class="archer-info flex-row-reverse"><span class="seed-badge ml-3">{{
                                            match.entry_b_seed || '-'
                                                }}</span><span class="archer-name text-right">{{
                                                    match.entry_b_name || 'TBD' }}</span></div>
                                        <span class="score-display border-l-0 border-r">{{ getMatchScore(match,
                                            'B') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="Object.keys(rounds).length === 0" class="text-center py-40">
            <div
                class="size-32 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-8 border border-gray-100">
                <Icon icon="ph:brackets-curly-bold" class="text-6xl text-gray-200" />
            </div>
            <h2 class="text-3xl font-black text-navy tracking-tight">Bracket Belum Di-generate</h2>
            <p class="text-gray-400 mt-2 max-w-sm mx-auto">Tentukan partisipan dan generate struktur pertandingan
                eliminasi untuk memulai babak ini.</p>
            <button @click="$emit('generate-bracket')"
                class="mt-10 px-8 py-4 rounded-2xl bg-navy text-primary font-black tracking-widest hover:brightness-110 shadow-sm shadow-navy/30 transition-all flex items-center gap-3 mx-auto">
                <Icon icon="ph:magic-wand-bold" class="text-2xl" />
                Generate Bracket Sekarang
            </button>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps({
    bracket: { type: Object, required: true },
    rounds: { type: Object, required: true },
    selectedMatch: { type: Object, default: null }
})

defineEmits(['generate-bracket', 'navigate-to-round', 'select-match'])

// Utilities mirrored from parent
const getAvatarUrl = (name) => {
    if (!name) return `https://ui-avatars.com/api/?name=TBD&background=f1f5f9&color=94a3b8&font-size=0.45`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&font-size=0.45`
}

const getMatchScore = (match, side) => {
    if (props.bracket?.format === 'recurve_set') {
        return side === 'A' ? match.total_points_a || 0 : match.total_points_b || 0
    }
    return side === 'A' ? match.total_score_a || 0 : match.total_score_b || 0
}

const getRoundName = (roundNo) => {
    const size = props.bracket?.bracket_size || 8
    const totalRounds = Math.log2(size)
    const roundFromEnd = totalRounds - roundNo + 1
    if (roundFromEnd === 1) return 'Final'
    if (roundFromEnd === 2) return 'Semifinal'
    if (roundFromEnd === 3) return 'Quarterfinal'
    return `Round of ${Math.pow(2, roundFromEnd)}`
}

// Layout Calculation Utilities
const BASE_MATCH_HEIGHT = 160
const getTotalRounds = computed(() => Object.keys(props.rounds).length)

const leftSideRoundNumbers = computed(() => {
    const total = getTotalRounds.value
    const nums = []
    for (let i = 1; i < total; i++) nums.push(i)
    return nums
})

const rightSideRoundNumbers = computed(() => {
    const total = getTotalRounds.value
    const nums = []
    for (let i = total - 1; i >= 1; i--) nums.push(i)
    return nums
})

const getMatchesForSide = (roundNo, side) => {
    const all = props.rounds[roundNo] || []
    if (parseInt(roundNo) === getTotalRounds.value) return all
    const half = Math.ceil(all.length / 2)
    return side === 'left' ? all.slice(0, half) : all.slice(half)
}

const getSideTotalHeight = computed(() => {
    const size = props.bracket?.bracket_size || 8
    const sideSize = size / 2
    return Math.max(sideSize, 2) * BASE_MATCH_HEIGHT
})

const getSlotHeightForSide = (roundNo) => {
    const r = parseInt(roundNo)
    return Math.pow(2, r - 1) * BASE_MATCH_HEIGHT
}

const calculateConnectorPath = (i, roundNo, side = 'left', isSingle = false) => {
    const r = parseInt(roundNo)
    const slotHeight = getSlotHeightForSide(r)
    const nextSlotHeight = getSlotHeightForSide(r + 1)

    if (isSingle) {
        const y = slotHeight / 2
        const targetY = nextSlotHeight / 2
        const entryOffset = side === 'left' ? -26 : 26
        const targetEY = targetY + entryOffset

        if (side === 'left') {
            return `M 0 ${y} H 40 V ${targetEY} H 80`
        } else {
            return `M 80 ${y} H 40 V ${targetEY} H 0`
        }
    }

    const y1 = (i - 1) * nextSlotHeight + slotHeight / 2
    const y2 = (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight
    const targetY = (i - 1) * nextSlotHeight + nextSlotHeight / 2

    if (side === 'left') {
        return `M 0 ${y1} H 40 V ${targetY} H 80 M 0 ${y2} H 40 V ${targetY} H 80`
    } else {
        return `M 80 ${y1} H 40 V ${targetY} H 0 M 80 ${y2} H 40 V ${targetY} H 0`
    }
}
</script>

<style scoped>
.bracket-visualization {
    @apply bg-[#f8fafc] relative;
    background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px);
    background-size: 32px 32px;
}

.bracket-scroll-container {
    @apply overflow-x-auto p-16 pb-24 relative z-10;
}

.bracket-round {
    @apply flex flex-col items-center min-w-[340px];
}

.round-label {
    @apply text-[11px] font-black text-primary tracking-widest py-3 px-8 bg-navy rounded-2xl shadow-lg border border-white/10 shrink-0 flex items-center justify-center mb-16;
}

.final-label {
    @apply bg-navy text-primary border-none ring-8 ring-primary/5;
}

.match-slot {
    @apply flex items-center justify-center w-full;
}

.match-node-card {
    @apply relative w-[300px] bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-500 cursor-pointer overflow-hidden;
    height: 140px;
}

.match-node-card.selected {
    @apply ring-8 ring-primary/10 border-primary shadow-sm z-20;
}

.match-node-card.completed {
    @apply border-green-500/20 shadow-green-100;
}

.match-card-header {
    @apply flex justify-between items-center px-5 py-2.5 bg-slate-50 border-b border-gray-50;
}

.match-meta {
    @apply text-[10px] font-black text-gray-300;
}

.archer-item {
    @apply flex items-center gap-3 px-4 py-2.5 transition-all relative h-[52px];
}

.avatar-img {
    @apply size-9 rounded-xl border-2 border-gray-100 object-cover bg-slate-50;
}

.archer-info {
    @apply flex items-center gap-3 flex-1 min-w-0;
}

.seed-badge {
    @apply size-6 rounded-lg bg-navy/5 text-navy/40 text-[10px] font-black flex items-center justify-center border border-navy/5;
}

.archer-name {
    @apply text-xs font-bold text-navy truncate tracking-tight;
}

.score-display {
    @apply text-xl font-black text-navy tabular-nums min-w-[40px] text-right flex items-center justify-end px-4 h-full border-l border-gray-50 bg-gray-50/30;
}

.is-winner {
    @apply bg-primary/[0.03];
}

.is-winner .score-display {
    @apply text-primary text-2xl drop-shadow-sm bg-primary/[0.05] border-primary/10;
}

.is-winner .archer-name {
    @apply text-navy font-black;
}

.is-loser {
    @apply opacity-50 grayscale-[0.5];
}

.connector-space {
    @apply w-[80px] relative shrink-0;
    margin-top: 50px;
}

.connector-line {
    @apply fill-none stroke-gray-200 stroke-[3px] transition-all duration-500 opacity-60;
}

.bracket-round:hover+.connector-space .connector-line {
    @apply stroke-primary/30 stroke-[4px] opacity-100;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
