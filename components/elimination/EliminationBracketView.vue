<template>
    <div class="bracket-visualization rounded-[40px] shadow-sm overflow-hidden border border-[#d1dcf0]">
        <div class="bracket-scroll-container no-scrollbar">
            <div v-if="Object.keys(rounds).length > 0"
                class="flex items-center justify-center min-w-max gap-4 py-20 px-12">

                <!-- LEFT SIDE ROUNDS (Rounds 1 to Total-2) -->
                <template v-for="rNo in leftSideRoundNumbers" :key="'left-' + rNo">
                    <div class="bracket-round">
                        <div class="round-header group">
                            <span class="text-[10px] uppercase font-black tracking-[0.3em] text-navy/30">{{
                                getRoundName(parseInt(rNo)) }}</span>
                            <button type="button" @click="$emit('navigate-to-round', rNo)"
                                class="mt-2 px-4 py-1.5 rounded-xl bg-white border border-[#d1dcf0] text-[9px] font-black tracking-widest text-navy uppercase hover:bg-navy hover:text-primary transition-all shadow-sm">
                                Manage
                            </button>
                        </div>
                        <div class="slots-container" :style="{ height: getSideTotalHeight + 'px' }">
                            <div v-for="match in getMatchesForSide(rNo, 'left')" :key="match.id" class="match-slot"
                                :style="{ height: getSlotHeightForSide(rNo) + 'px' }">
                                <!-- Match Card Left -->
                                <div @click="$emit('select-match', match)" class="match-node-card group/card"
                                    :class="{ 'selected': selectedMatch?.id === match.id, 'completed': match.winner_entry_id }">
                                    <div class="match-card-header">
                                        <div class="flex items-center gap-1.5 opacity-60">
                                            <Icon icon="ph:trophy-bold" class="text-[10px]" />
                                            <span class="text-[8px] font-black tracking-widest uppercase">Match</span>
                                        </div>
                                        <span class="text-[10px] font-black text-navy/10">#{{ match.match_no }}</span>
                                    </div>
                                    <div class="archer-list">
                                        <div v-for="side in ['A', 'B']" :key="side" class="archer-item"
                                            :class="{ 'is-winner': isWinner(match, side), 'is-loser': isLoser(match, side) }">
                                            <div class="avatar-wrapper relative">
                                                <img :src="getAvatarUrl(side === 'A' ? match.entry_a_name : match.entry_b_name)"
                                                    class="avatar-img" />
                                                <div v-if="isWinner(match, side)" class="winner-indicator">
                                                    <Icon icon="ph:crown-fill" />
                                                </div>
                                                <div v-if="parseInt(rNo) === 1 && (side === 'A' ? match.entry_a_seed : match.entry_b_seed)"
                                                    class="avatar-seed-badge">
                                                    {{ (side === 'A' ? match.entry_a_seed : match.entry_b_seed) }}
                                                </div>
                                            </div>
                                            <div class="archer-info">
                                                <span class="archer-name">
                                                    {{ (side === 'A' ? match.entry_a_name : match.entry_b_name) ||
                                                        (match.is_bye ? 'BYE' : 'TBD') }}
                                                </span>
                                            </div>
                                            <div class="score-display">
                                                {{ getScore(match, side) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Connector (Left to Right/Center) -->
                    <div class="connector-space" :style="{ height: getSideTotalHeight + 'px' }">
                        <svg class="bracket-svg" :viewBox="`0 0 80 ${getSideTotalHeight}`" preserveAspectRatio="none"
                            style="width: 100%; height: 100%;">
                            <path v-for="i in Math.floor(getMatchesForSide(rNo, 'left').length / 2)" :key="i"
                                class="connector-line" :d="calculateConnectorPath(i, rNo, 'left')" />
                            <path v-if="getMatchesForSide(rNo, 'left').length === 1" class="connector-line"
                                :d="calculateConnectorPath(1, rNo, 'left', true)" />
                        </svg>
                    </div>
                </template>

                <!-- CENTER HUB (FINAL ARENA) -->
                <div class="final-arena" :style="{ minHeight: getSideTotalHeight + 'px', marginTop: '128px' }">
                    <!-- CHAMPIONSHIP / FINAL (Round Total) -->
                    <div class="gold-match-container relative w-full flex flex-col items-center">
                        <div class="arena-title mb-6">
                            <div class="flex flex-col items-center">
                                <span class="text-[10px] font-black tracking-[0.4em] text-navy/20 uppercase mb-2">Final
                                    Round</span>
                                <div
                                    class="flex items-center gap-3 px-8 py-2.5 rounded-2xl bg-white border-2 border-primary shadow-sm relative overflow-hidden group/title">
                                    <div
                                        class="absolute inset-0 bg-primary/5 -translate-x-full group-hover/title:translate-x-full transition-transform duration-1000">
                                    </div>
                                    <Icon icon="ph:crown-simple-fill" class="text-primary text-xl relative z-10" />
                                    <span
                                        class="text-sm font-black text-navy tracking-[0.4em] uppercase relative z-10">Grand
                                        Final</span>
                                </div>
                            </div>
                        </div>
                        <div v-if="goldMatch" class="relative group">
                            <!-- Gold Match Card -->
                            <div @click="$emit('select-match', goldMatch)"
                                class="match-node-card is-final group/card !border-primary !ring-4 !ring-primary/5 shadow-sm"
                                :class="{ 'selected': selectedMatch?.id === goldMatch.id, 'completed': goldMatch.winner_entry_id }">
                                <div class="match-card-header !bg-primary/5">
                                    <div class="flex items-center gap-1.5 text-navy font-black">
                                        <Icon icon="ph:medal-fill" class="text-[10px] text-primary" />
                                        <span class="text-[8px] font-black tracking-widest uppercase">Perebutan Juara 1
                                            & 2</span>
                                    </div>
                                    <span class="text-[10px] font-black text-navy/10">#{{ goldMatch.match_no }}</span>
                                </div>
                                <div class="archer-list">
                                    <div v-for="side in ['A', 'B']" :key="side" class="archer-item"
                                        :class="{ 'is-winner': isWinner(goldMatch, side), 'is-loser': isLoser(goldMatch, side) }">
                                        <div class="avatar-wrapper relative">
                                            <img :src="getAvatarUrl(side === 'A' ? goldMatch.entry_a_name : goldMatch.entry_b_name)"
                                                class="avatar-img" />
                                            <div v-if="isWinner(goldMatch, side)" class="winner-indicator">
                                                <Icon icon="ph:crown-fill" />
                                            </div>
                                        </div>
                                        <div class="archer-info">
                                            <span class="archer-name">
                                                {{ (side === 'A' ? goldMatch.entry_a_name : goldMatch.entry_b_name) ||
                                                    (goldMatch.is_bye
                                                        ? 'BYE' : 'TBD') }}
                                            </span>
                                        </div>
                                        <div class="score-display">
                                            {{ getScore(goldMatch, side) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SEMIFINALS (Round Total-1) -->
                    <div class="semifinals-container flex flex-col items-center gap-8 w-full relative pt-8">
                        <div class="flex items-center gap-4 w-full relative z-10">
                            <div class="h-px flex-1 bg-[#d1dcf0]"></div>
                            <div
                                class="px-6 py-2 rounded-xl bg-white border border-[#d1dcf0] text-[10px] font-black tracking-[0.5em] text-navy/40 uppercase shadow-sm">
                                Semifinals
                            </div>
                            <div class="h-px flex-1 bg-[#d1dcf0]"></div>
                        </div>
                        <div class="flex justify-center gap-10 w-full relative z-10">
                            <div v-for="match in semifinalMatches" :key="match.id" class="relative group">
                                <div @click="$emit('select-match', match)" class="match-node-card group/card shadow-sm"
                                    :class="{ 'selected': selectedMatch?.id === match.id, 'completed': match.winner_entry_id }">
                                    <div class="match-card-header">
                                        <div class="flex items-center gap-1.5 opacity-60">
                                            <Icon icon="ph:trophy-bold" class="text-[10px]" />
                                            <span class="text-[8px] font-black tracking-widest uppercase">Match {{
                                                match.match_no
                                            }}</span>
                                        </div>
                                    </div>
                                    <div class="archer-list">
                                        <div v-for="side in ['A', 'B']" :key="side" class="archer-item"
                                            :class="{ 'is-winner': isWinner(match, side), 'is-loser': isLoser(match, side) }">
                                            <div class="avatar-wrapper relative">
                                                <img :src="getAvatarUrl(side === 'A' ? match.entry_a_name : match.entry_b_name)"
                                                    class="avatar-img" />
                                                <div v-if="isWinner(match, side)" class="winner-indicator">
                                                    <Icon icon="ph:crown-fill" />
                                                </div>
                                            </div>
                                            <div class="archer-info">
                                                <span class="archer-name">
                                                    {{ (side === 'A' ? match.entry_a_name : match.entry_b_name) ||
                                                        (match.is_bye ? 'BYE'
                                                            : 'TBD') }}
                                                </span>
                                            </div>
                                            <div class="score-display">
                                                {{ getScore(match, side) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3rd PLACE MATCH (Round Total, index 1) -->
                    <div class="bronze-match-container relative w-full flex flex-col items-center mt-12">
                        <div class="flex items-center gap-4 w-full mb-8 relative z-10">
                            <div class="h-px flex-1 bg-[#d1dcf0]"></div>
                            <div
                                class="flex items-center gap-3 px-8 py-3 rounded-2xl bg-white border border-[#d1dcf0] shadow-sm group/bronze">
                                <Icon icon="ph:shield-bold"
                                    class="text-orange-500 text-base group-hover/bronze:rotate-12 transition-transform" />
                                <span class="text-xs font-black text-navy/50 tracking-[0.3em] uppercase">Perebutan Juara
                                    3</span>
                            </div>
                            <div class="h-px flex-1 bg-[#d1dcf0]"></div>
                        </div>
                        <div v-if="bronzeMatch" class="relative group">
                            <div @click="$emit('select-match', bronzeMatch)"
                                class="match-node-card group/card !bg-white shadow-sm !border-dashed !border-orange-500/50 scale-95 hover:scale-100"
                                :class="{ 'selected': selectedMatch?.id === bronzeMatch.id, 'completed': bronzeMatch.winner_entry_id }">
                                <div class="match-card-header !bg-orange-50/50">
                                    <div class="flex items-center gap-1.5 text-orange-700 font-bold">
                                        <Icon icon="ph:medal-bold" class="text-[10px]" />
                                        <span class="text-[8px] font-black tracking-widest uppercase">Third Place
                                            Match</span>
                                    </div>
                                    <span class="text-[10px] font-black text-navy/10">#{{ bronzeMatch.match_no }}</span>
                                </div>
                                <div class="archer-list">
                                    <div v-for="side in ['A', 'B']" :key="side" class="archer-item"
                                        :class="{ 'is-winner': isWinner(bronzeMatch, side), 'is-loser': isLoser(bronzeMatch, side) }">
                                        <div class="avatar-wrapper relative">
                                            <img :src="getAvatarUrl(side === 'A' ? bronzeMatch.entry_a_name : bronzeMatch.entry_b_name)"
                                                class="avatar-img" />
                                            <div v-if="isWinner(bronzeMatch, side)" class="winner-indicator">
                                                <Icon icon="ph:crown-fill" />
                                            </div>
                                        </div>
                                        <div class="archer-info">
                                            <span class="archer-name">
                                                {{ (side === 'A' ? bronzeMatch.entry_a_name : bronzeMatch.entry_b_name)
                                                    ||
                                                    (bronzeMatch.is_bye ? 'BYE' : 'TBD') }}
                                            </span>
                                        </div>
                                        <div class="score-display">
                                            {{ getScore(bronzeMatch, side) }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-[10px] font-black text-navy/20 uppercase tracking-widest">
                            Belum ada data match juara 3
                        </div>
                    </div>
                </div>

                <!-- RIGHT SIDE ROUNDS (Rounds 1 to Total-2 Reversed) -->
                <template v-for="rNo in rightSideRoundNumbers" :key="'right-' + rNo">
                    <div class="connector-space" :style="{ height: getSideTotalHeight + 'px' }">
                        <svg class="bracket-svg" :viewBox="`0 0 80 ${getSideTotalHeight}`" preserveAspectRatio="none"
                            style="width: 100%; height: 100%;">
                            <path v-for="i in Math.floor(getMatchesForSide(rNo, 'right').length / 2)" :key="i"
                                class="connector-line" :d="calculateConnectorPath(i, rNo, 'right')" />
                            <path v-if="getMatchesForSide(rNo, 'right').length === 1" class="connector-line"
                                :d="calculateConnectorPath(1, rNo, 'right', true)" />
                        </svg>
                    </div>
                    <div class="bracket-round">
                        <div class="round-header group flex flex-col items-end">
                            <span class="text-[10px] uppercase font-black tracking-[0.3em] text-navy/30">{{
                                getRoundName(parseInt(rNo)) }}</span>
                            <button type="button" @click="$emit('navigate-to-round', rNo)"
                                class="mt-2 px-4 py-1.5 rounded-xl bg-white border border-[#d1dcf0] text-[9px] font-black tracking-widest text-navy uppercase hover:bg-navy hover:text-primary transition-all shadow-sm">
                                Manage
                            </button>
                        </div>
                        <div class="slots-container" :style="{ height: getSideTotalHeight + 'px' }">
                            <div v-for="match in getMatchesForSide(rNo, 'right')" :key="match.id" class="match-slot"
                                :style="{ height: getSlotHeightForSide(rNo) + 'px' }">
                                <!-- Match Card Right -->
                                <div @click="$emit('select-match', match)" class="match-node-card group/card shadow-sm"
                                    :class="{ 'selected': selectedMatch?.id === match.id, 'completed': match.winner_entry_id }">
                                    <div class="match-card-header">
                                        <div class="flex items-center gap-1.5 opacity-60">
                                            <Icon icon="ph:trophy-bold" class="text-[10px]" />
                                            <span class="text-[8px] font-black tracking-widest uppercase">Match</span>
                                        </div>
                                        <span class="text-[10px] font-black text-navy/10">#{{ match.match_no }}</span>
                                    </div>
                                    <div class="archer-list">
                                        <div v-for="side in ['A', 'B']" :key="side" class="archer-item"
                                            :class="{ 'is-winner': isWinner(match, side), 'is-loser': isLoser(match, side) }">
                                            <div class="avatar-wrapper relative">
                                                <img :src="getAvatarUrl(side === 'A' ? match.entry_a_name : match.entry_b_name)"
                                                    class="avatar-img" />
                                                <div v-if="isWinner(match, side)" class="winner-indicator">
                                                    <Icon icon="ph:crown-fill" />
                                                </div>
                                                <div v-if="parseInt(rNo) === 1 && (side === 'A' ? match.entry_a_seed : match.entry_b_seed)"
                                                    class="avatar-seed-badge">
                                                    {{ (side === 'A' ? match.entry_a_seed : match.entry_b_seed) }}
                                                </div>
                                            </div>
                                            <div class="archer-info">
                                                <span class="archer-name">
                                                    {{ (side === 'A' ? match.entry_a_name : match.entry_b_name) ||
                                                        (match.is_bye ? 'BYE' : 'TBD') }}
                                                </span>
                                            </div>
                                            <div class="score-display">
                                                {{ getScore(match, side) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="Object.keys(rounds).length === 0" class="text-center py-40 bg-white">
            <div
                class="size-32 rounded-[2.5rem] bg-slate-50 shadow-inner flex items-center justify-center mx-auto mb-8 border border-slate-100">
                <Icon icon="ph:brackets-curly-bold" class="text-6xl text-slate-200" />
            </div>
            <h2 class="text-3xl font-black text-navy tracking-tight">Bracket Belum Di-generate</h2>
            <p class="text-gray-400 mt-2 max-w-sm mx-auto">Tentukan partisipan dan generate struktur pertandingan
                eliminasi untuk memulai babak ini.</p>
            <button @click="$emit('generate-bracket')"
                class="mt-10 px-8 py-4 rounded-2xl bg-navy text-primary font-black tracking-widest hover:brightness-110 shadow-lg shadow-navy/20 transition-all flex items-center gap-3 mx-auto">
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

const getAvatarUrl = (name) => {
    if (!name || name === 'TBD' || name === 'BYE') return `https://ui-avatars.com/api/?name=??&background=f1f5f9&color=94a3b8&font-size=0.45`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffaa00&color=202434&font-size=0.45&bold=true`
}

const getScore = (match, side) => {
    if (props.bracket?.format === 'recurve_set') {
        return side === 'A' ? match.total_points_a || 0 : match.total_points_b || 0
    }
    return side === 'A' ? match.total_score_a || 0 : match.total_score_b || 0
}

const isWinner = (match, side) => {
    if (!match.winner_entry_id) return false
    return match.winner_entry_id === (side === 'A' ? match.entry_a_id : match.entry_b_id)
}

const isLoser = (match, side) => {
    if (!match.winner_entry_id) return false
    return match.winner_entry_id !== (side === 'A' ? match.entry_a_id : match.entry_b_id)
}

// Layout Calculation Utilities
const BASE_MATCH_HEIGHT = 160
const getTotalRounds = computed(() => Object.keys(props.rounds).length)

const leftSideRoundNumbers = computed(() => {
    const total = getTotalRounds.value
    const nums = []
    for (let i = 1; i <= total - 2; i++) nums.push(i)
    return nums
})

const rightSideRoundNumbers = computed(() => {
    const total = getTotalRounds.value
    const nums = []
    for (let i = total - 2; i >= 1; i--) nums.push(i)
    return nums
})

const semifinalMatches = computed(() => props.rounds[getTotalRounds.value - 1] || [])
const finalMatches = computed(() => props.rounds[getTotalRounds.value] || [])
const goldMatch = computed(() => finalMatches.value[0])
const bronzeMatch = computed(() => finalMatches.value[1])

const getMatchesForSide = (roundNo, side) => {
    const all = props.rounds[roundNo] || []
    const half = Math.ceil(all.length / 2)
    return side === 'left' ? all.slice(0, half) : all.slice(half)
}

const getRoundName = (roundNo) => {
    const size = props.bracket?.bracket_size || 8
    const totalRoundsForSize = Math.log2(size)
    const roundFromEnd = totalRoundsForSize - roundNo + 1
    if (roundFromEnd === 1) return 'Final'
    if (roundFromEnd === 2) return 'Semifinal'
    if (roundFromEnd === 3) return 'Quarterfinal'
    return `Round of ${Math.pow(2, roundFromEnd)}`
}

const getSideTotalHeight = computed(() => {
    const size = props.bracket?.bracket_size || 8
    const sideSize = size / 2
    return Math.max(sideSize, 1) * BASE_MATCH_HEIGHT
})

const getSlotHeightForSide = (roundNo) => {
    const r = parseInt(roundNo)
    return Math.pow(2, r - 1) * BASE_MATCH_HEIGHT
}

const calculateConnectorPath = (i, roundNo, side = 'left', isSingle = false) => {
    const r = parseInt(roundNo)
    const slotHeight = getSlotHeightForSide(r)
    const nextSlotHeight = getSlotHeightForSide(r + 1)

    // Center of matches in current round
    const y1 = (i - 1) * nextSlotHeight + slotHeight / 2
    const y2 = (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight

    // Target center in next round (or center hub)
    const targetY = (i - 1) * nextSlotHeight + nextSlotHeight / 2

    if (isSingle) {
        // Handle last side round connection to center
        // targetY is already centered in getSideTotalHeight/2
        if (side === 'left') {
            return `M 0 ${slotHeight / 2} H 40 V ${targetY} H 80`
        } else {
            return `M 80 ${slotHeight / 2} H 40 V ${targetY} H 0`
        }
    }

    if (side === 'left') {
        return `M 0 ${y1} H 40 V ${targetY} H 80 M 0 ${y2} H 40 V ${targetY} H 80`
    } else {
        return `M 80 ${y1} H 40 V ${targetY} H 0 M 80 ${y2} H 40 V ${targetY} H 0`
    }
}
</script>

<style scoped>
.bracket-visualization {
    @apply relative min-h-[500px];
    background-color: #EEF2FB;
    background-image: radial-gradient(#d1dcf0 2px, transparent 2px);
    background-size: 32px 32px;
}

.bracket-scroll-container {
    @apply overflow-x-auto relative z-10;
}

.bracket-round {
    @apply flex flex-col items-center min-w-[340px];
}

.round-header {
    @apply mb-12 h-20 flex flex-col items-center justify-end;
}

.slots-container {
    @apply relative;
}

.match-slot {
    @apply flex items-center justify-center w-full;
}

.match-node-card {
    @apply relative w-[280px] h-[130px] bg-white rounded-2xl border border-[#d1dcf0] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col;
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
    @apply absolute -top-1.5 -right-1.5 size-4 bg-primary text-navy rounded-full flex items-center justify-center text-[8px] shadow-sm border border-white z-20;
}

.archer-info {
    @apply flex items-center gap-2 flex-1 min-w-0;
}

.archer-name {
    @apply text-[11px] font-black text-navy/80 truncate tracking-tight;
}

.score-display {
    @apply text-base font-black text-navy/40 tabular-nums min-w-[44px] h-full flex items-center justify-end border-l border-[#d1dcf0] bg-slate-50/50 px-3;
}

.is-winner .score-display {
    @apply text-primary text-lg font-black;
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
    @apply text-navy font-black;
}

.is-loser {
    @apply opacity-30 grayscale-[0.5];
}

.final-arena {
    @apply flex flex-col items-center gap-0 px-8 min-w-[500px];
}

.is-final {
    @apply w-[320px] h-[150px] bg-white border-2;
}

.connector-space {
    @apply w-[80px] relative shrink-0;
    margin-top: 128px;
    /* Matches Round Header height (80px) + Margin Bottom (48px) */
}

.connector-line {
    @apply fill-none stroke-[#d1dcf0] stroke-[2.5px] transition-all duration-500;
}

.bracket-round:hover+.connector-space .connector-line {
    @apply stroke-primary/40 stroke-[3.5px];
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
