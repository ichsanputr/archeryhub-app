<template>
    <div class="bracket-round arena-column min-w-[550px]">
        <!-- Consolidated Header for Semi and Final -->
        <div class="round-header !flex-row !gap-4 !items-end !mb-12">
            <div class="flex flex-col items-center">
                <span class="text-[10px] font-black tracking-[0.3em] text-navy/30">Semifinal</span>
            </div>
            <div class="h-8 w-px bg-[#d1dcf0] mb-1"></div>
            <div class="flex flex-col items-center">
                <span class="text-[10px] font-black tracking-[0.3em] text-navy/30">Finals</span>
            </div>
        </div>

        <div class="final-arena mx-10 relative !p-0" :style="{ height: totalHeight + 'px' }">
            <!-- CHAMPIONSHIP / FINAL (Top) -->
            <div class="gold-match-container absolute -top-6 inset-x-0 w-full flex flex-col items-center z-10">
                <div class="arena-title mb-4">
                    <div class="flex flex-col items-center">
                        <div
                            class="flex items-center gap-3 px-6 py-2 rounded-2xl bg-white border-2 border-primary shadow-sm relative overflow-hidden group/title">
                            <Icon icon="ph:crown-simple-fill" class="text-primary text-lg" />
                            <span class="text-xs font-black text-navy tracking-[0.3em] ">Grand Final</span>
                        </div>
                    </div>
                </div>
                <div v-if="goldMatch" class="relative group">
                    <PublicEliminationMatchCard :match="goldMatch" :bracket-format="bracketFormat"
                        :is-selected="selectedMatchId === goldMatch.id" :is-final="true"
                        @select="$emit('select-match', $event)" />
                </div>
            </div>

            <!-- SEMIFINALS (Middle Anchor - Absolutely Centered) -->
            <div
                class="semifinals-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full z-20">
                <div class="flex justify-center gap-8 w-full relative">
                    <div v-for="match in semifinalMatches" :key="match.id" class="relative group">
                        <PublicEliminationMatchCard :match="match" :bracket-format="bracketFormat"
                            :is-selected="selectedMatchId === match.id" @select="$emit('select-match', $event)" />
                    </div>
                </div>
            </div>

            <!-- Hub Vertical Connectors (SVG Overlay) -->
            <div class="absolute inset-0 pointer-events-none z-0">
                <svg class="w-full h-full" :viewBox="`0 0 600 ${totalHeight}`" fill="none">
                    <!-- Winners to Grand Final (Starting from top of Semis: CY - 65) -->
                    <path v-for="x in [144, 456]" :key="'win-' + x"
                        :d="`M ${x} ${totalHeight / 2 - 65} V ${totalHeight / 2 - 130} H 300 V ${totalHeight / 2 - 210}`"
                        class="stroke-navy/30 stroke-[2.5px]" />
                    <!-- Losers to Bronze Match (Starting from bottom of Semis: CY + 65) -->
                    <path v-for="x in [144, 456]" :key="'lose-' + x"
                        :d="`M ${x} ${totalHeight / 2 + 65} V ${totalHeight / 2 + 130} H 300 V ${totalHeight / 2 + 210}`"
                        class="stroke-orange-500/20 stroke-[2.5px] stroke-dasharray-[5,5]" />
                </svg>
            </div>

            <!-- 3rd PLACE MATCH (Bottom) -->
            <div class="bronze-match-container absolute bottom-4 inset-x-0 w-full flex flex-col items-center z-10">
                <div class="flex items-center gap-4 w-full mb-4 relative">
                    <div class="h-px flex-1 bg-[#d1dcf0]"></div>
                    <div
                        class="flex items-center gap-2 px-6 py-2 rounded-xl bg-white border border-[#d1dcf0] shadow-sm">
                        <Icon icon="ph:shield-bold" class="text-orange-500 text-sm" />
                        <span class="text-[9px] font-black text-navy/40 tracking-[0.2em] ">Bronze Match</span>
                    </div>
                    <div class="h-px flex-1 bg-[#d1dcf0]"></div>
                </div>
                <div v-if="bronzeMatch" class="relative group">
                    <PublicEliminationMatchCard :match="bronzeMatch" :bracket-format="bracketFormat"
                        :is-selected="selectedMatchId === bronzeMatch.id" :is-bronze="true"
                        @select="$emit('select-match', $event)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import PublicEliminationMatchCard from './PublicEliminationMatchCard.vue'

const props = defineProps({
    totalRounds: { type: Number, required: true },
    semifinalMatches: { type: Array, required: true },
    goldMatch: { type: Object, default: null },
    bronzeMatch: { type: Object, default: null },
    totalHeight: { type: Number, required: true },
    bracketFormat: { type: String, required: true },
    selectedMatchId: { type: String, default: null }
})

defineEmits(['select-match'])
</script>

<style scoped>
.bracket-round {
    @apply flex flex-col items-center min-w-[340px];
}

.round-header {
    @apply mb-12 h-20 flex flex-col items-center justify-end;
}

.final-arena {
    @apply flex flex-col items-center px-8 min-w-[500px];
}
</style>
