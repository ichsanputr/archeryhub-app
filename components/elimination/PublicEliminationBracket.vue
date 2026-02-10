<template>
    <div class="bracket-visualization rounded-[40px] shadow-sm overflow-hidden border border-[#d1dcf0]">
        <div class="bracket-scroll-container no-scrollbar">
            <div v-if="Object.keys(rounds).length > 0" class="flex items-center justify-center min-w-max gap-4 p-12">

                <!-- LEFT SIDE ROUNDS -->
                <template v-for="rNo in leftSideRoundNumbers" :key="'left-' + rNo">
                    <PublicBracketRound :round-no="rNo" :round-name="getRoundName(parseInt(rNo))"
                        :matches="getMatchesForSide(rNo, 'left')" :total-height="getSideTotalHeight"
                        :slot-height="getSlotHeightForSide(rNo)" :bracket-format="bracket?.format" />

                    <!-- Connector (Left to Next) -->
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

                <!-- CENTER HUB (CHAMPIONSHIP TOWER) -->
                <PublicChampionshipTower :total-rounds="getTotalRounds" :semifinal-matches="semifinalMatches"
                    :gold-match="goldMatch" :bronze-match="bronzeMatch" :total-height="getSideTotalHeight"
                    :bracket-format="bracket?.format" />

                <!-- RIGHT SIDE ROUNDS -->
                <template v-for="rNo in rightSideRoundNumbers" :key="'right-' + rNo">
                    <!-- Connector (Right to Previous) -->
                    <div class="connector-space" :style="{ height: getSideTotalHeight + 'px' }">
                        <svg class="bracket-svg" :viewBox="`0 0 80 ${getSideTotalHeight}`" preserveAspectRatio="none"
                            style="width: 100%; height: 100%;">
                            <path v-for="i in Math.floor(getMatchesForSide(rNo, 'right').length / 2)" :key="i"
                                class="connector-line" :d="calculateConnectorPath(i, rNo, 'right')" />
                            <path v-if="getMatchesForSide(rNo, 'right').length === 1" class="connector-line"
                                :d="calculateConnectorPath(1, rNo, 'right', true)" />
                        </svg>
                    </div>

                    <PublicBracketRound :round-no="rNo" :round-name="getRoundName(parseInt(rNo))"
                        :matches="getMatchesForSide(rNo, 'right')" :total-height="getSideTotalHeight"
                        :slot-height="getSlotHeightForSide(rNo)" :bracket-format="bracket?.format" />
                </template>
            </div>
        </div>

        <div v-if="Object.keys(rounds).length === 0" class="text-center py-40 bg-white">
            <div
                class="size-32 rounded-[2.5rem] bg-slate-50 shadow-inner flex items-center justify-center mx-auto mb-8 border border-slate-100">
                <Icon icon="ph:brackets-curly-bold" class="text-6xl text-slate-200" />
            </div>
            <h2 class="text-3xl font-black text-navy tracking-tight">Bracket Belum Di-generate</h2>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import PublicBracketRound from './PublicBracketRound.vue'
import PublicChampionshipTower from './PublicChampionshipTower.vue'

const props = defineProps({
    bracket: { type: Object, required: true },
    rounds: { type: Object, required: true }
})

// Layout Calculation Utilities
const BASE_MATCH_HEIGHT = 160
const HUB_UNIT_HEIGHT = 650

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
    const maxSideMatches = size / 4
    const matchesHeight = Math.max(maxSideMatches, 1) * BASE_MATCH_HEIGHT
    return Math.max(matchesHeight, HUB_UNIT_HEIGHT)
})

const getSlotHeightForSide = (roundNo) => {
    const r = parseInt(roundNo)
    return Math.pow(2, r - 1) * BASE_MATCH_HEIGHT
}

const calculateConnectorPath = (i, roundNo, side = 'left', isSingle = false) => {
    const r = parseInt(roundNo)
    const slotHeight = getSlotHeightForSide(r)
    const nextSlotHeight = getSlotHeightForSide(r + 1)
    const totalH = getSideTotalHeight.value

    const matchesInSide = getMatchesForSide(r, side).length
    const roundBlockHeight = matchesInSide * slotHeight
    const vOffset = (totalH - roundBlockHeight) / 2

    const y1 = vOffset + (i - 1) * nextSlotHeight + slotHeight / 2
    const y2 = vOffset + (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight
    const targetY = vOffset + (i - 1) * nextSlotHeight + nextSlotHeight / 2

    if (isSingle) {
        const hubArrivalY = totalH / 2
        if (side === 'left') {
            return `M 0 ${y1} H 40 V ${hubArrivalY} H 80`
        } else {
            return `M 80 ${y1} H 40 V ${hubArrivalY} H 0`
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
    @apply bg-slate-50/50 relative border-t border-gray-100;
    background-image:
        radial-gradient(#e2e8f0 1.5px, transparent 1.5px);
    background-size: 24px 24px;
}

.bracket-scroll-container {
    @apply overflow-x-auto relative z-10;
}

.connector-space {
    @apply w-[80px] relative shrink-0;
}

.bracket-svg {
    @apply w-full h-full;
}

.connector-line {
    @apply fill-none stroke-gray-300 stroke-[2.5px] transition-all duration-300;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
