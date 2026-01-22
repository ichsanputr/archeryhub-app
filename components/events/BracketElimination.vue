<template>
    <div class="bracket-visualization">
        <div class="bracket-scroll-container no-scrollbar">
            <div class="bracket-canvas">

                <!-- Round 1: 1/8 Finals (8 match slots of 150px) -->
                <div class="bracket-round">
                    <div class="round-label">1/8 Finals</div>
                    <div class="slots-container">
                        <div v-for="match in matches1_8" :key="match.id" class="match-slot r1-slot">
                            <MatchNode :match="match" @click="$emit('select-match', match.id)" />
                        </div>
                    </div>
                </div>

                <!-- Connectors: 1/8 (150px step) to 1/4 (300px step) -->
                <div class="connector-space">
                    <svg class="bracket-svg" viewBox="0 0 60 1200" preserveAspectRatio="none">
                        <path v-for="i in 4" :key="i" class="connector-line" :d="calculatePath(i, 300, 75, 150)" />
                    </svg>
                </div>

                <!-- Round 2: Quarter Finals (4 match slots of 300px) -->
                <div class="bracket-round">
                    <div class="round-label">Perempat Final</div>
                    <div class="slots-container">
                        <div v-for="match in matchesQF" :key="match.id" class="match-slot r2-slot">
                            <MatchNode :match="match" @click="$emit('select-match', match.id)" />
                        </div>
                    </div>
                </div>

                <!-- Connectors: 1/4 (300px step) to 1/2 (600px step) -->
                <div class="connector-space">
                    <svg class="bracket-svg" viewBox="0 0 60 1200" preserveAspectRatio="none">
                        <path v-for="i in 2" :key="i" class="connector-line" :d="calculatePath(i, 600, 150, 300)" />
                    </svg>
                </div>

                <!-- Round 3: Semi Finals (2 match slots of 600px) -->
                <div class="bracket-round">
                    <div class="round-label">Semi Final</div>
                    <div class="slots-container">
                        <div v-for="match in matchesSF" :key="match.id" class="match-slot r3-slot">
                            <MatchNode :match="match" @click="$emit('select-match', match.id)" />
                        </div>
                    </div>
                </div>

                <!-- Connectors: 1/2 (600px step) to Final (1200px step) -->
                <div class="connector-space">
                    <svg class="bracket-svg" viewBox="0 0 60 1200" preserveAspectRatio="none">
                        <path class="connector-line" d="M 0 300 H 30 V 600 H 60 M 0 900 H 30 V 600 H 60" />
                    </svg>
                </div>

                <!-- Round 4: Final (1 match slot of 1200px) -->
                <div class="bracket-round finals-column">
                    <div class="round-label final-label">
                        <Icon icon="ph:crown-simple-fill" class="text-primary mr-2" />
                        Final
                    </div>
                    <div class="slots-container">
                        <div class="match-slot r4-slot">
                            <MatchNode :match="matchFinal" is-final @click="$emit('select-match', matchFinal.id)" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import MatchNode from './BracketMatchNode.vue'

const props = defineProps({
    matches1_8: { type: Array, required: true },
    matchesQF: { type: Array, required: true },
    matchesSF: { type: Array, required: true },
    matchFinal: { type: Object, required: true }
})

defineEmits(['select-match'])

const calculatePath = (i, step, startCenterOffset, targetCenter) => {
    const y1 = (i - 1) * step + startCenterOffset
    const y2 = (i - 1) * step + (startCenterOffset * 3)
    const targetY = (i - 1) * step + targetCenter
    return `M 0 ${y1} H 30 V ${targetY} H 60 M 0 ${y2} H 30 V ${targetY} H 60`
}
</script>

<style scoped>
.bracket-visualization {
    @apply bg-slate-50/50 rounded-3xl border border-gray-100 overflow-hidden relative;
    /* Premium Blueprint Grid Pattern */
    background-image:
        linear-gradient(#e2e8f0 1px, transparent 1px),
        linear-gradient(90deg, #e2e8f0 1px, transparent 1px);
    background-size: 40px 40px;
    background-position: center center;
}

.bracket-visualization::before {
    content: '';
    @apply absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-slate-200/20 pointer-events-none;
}

.bracket-scroll-container {
    @apply overflow-x-auto p-12 relative z-10;
}

.bracket-canvas {
    @apply flex items-start min-w-max gap-0;
}

.bracket-round {
    @apply flex flex-col items-center min-w-[220px];
}

.slots-container {
    @apply flex flex-col w-full h-[1200px];
}

.match-slot {
    @apply flex items-center justify-center w-full;
}

.r1-slot {
    height: 150px;
}

.r2-slot {
    height: 300px;
}

.r3-slot {
    height: 600px;
}

.r4-slot {
    height: 1200px;
}

.round-label {
    @apply text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] py-2 px-6 bg-white rounded-full shadow-sm border border-gray-100 shrink-0 flex items-center justify-center;
    height: 28px;
    margin-bottom: 32px;
    /* Total header height = 60px */
}

.final-label {
    @apply bg-navy text-primary border-none shadow-lg shadow-navy/20 transition-transform;
}

.connector-space {
    @apply w-[60px] h-[1200px] relative shrink-0;
    margin-top: 60px;
    /* Aligns exactly with slots-container start */
}

.bracket-svg {
    @apply w-full h-full;
}

.connector-line {
    @apply fill-none stroke-gray-300 stroke-[2.5px] transition-all duration-300;
}

.bracket-round:hover .connector-line {
    @apply stroke-gray-400;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
