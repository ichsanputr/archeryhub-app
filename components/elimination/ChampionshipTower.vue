<template>
    <div class="bracket-round arena-column min-w-[550px]">
        <!-- Consolidated Header for Semi and Final -->
        <div class="round-header !flex-row !gap-4 !items-end !mb-12">
            <div class="flex flex-col items-center">
                <span class="text-[10px] font-black tracking-[0.25em] text-slate-400 capitalize">{{ t('event_elimination.semifinal', 'Semifinal') }}</span>
                <button type="button" @click="$emit('navigate', totalRounds - 1)"
                    class="mt-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black tracking-wider text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
                    <Icon icon="ph:gear-six-bold" class="text-xs text-slate-400 group-hover:text-primary transition-colors" />
                    <span>{{ t('event_elimination.manage', 'Kelola') }}</span>
                </button>
            </div>
            <div class="h-8 w-px bg-slate-200 mb-1"></div>
            <div class="flex flex-col items-center">
                <span class="text-[10px] font-black tracking-[0.25em] text-slate-400 capitalize">{{ t('event_elimination.finals', 'Final') }}</span>
                <button type="button" @click="$emit('navigate', totalRounds)"
                    class="mt-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black tracking-wider text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
                    <Icon icon="ph:gear-six-bold" class="text-xs text-slate-400 group-hover:text-primary transition-colors" />
                    <span>{{ t('event_elimination.manage', 'Kelola') }}</span>
                </button>
            </div>
        </div>

        <div class="final-arena mx-10 relative !p-0" :style="{ height: totalHeight + 'px' }">
            <!-- CHAMPIONSHIP / FINAL (Top) -->
            <div class="gold-match-container absolute -top-6 inset-x-0 w-full flex flex-col items-center z-10">
                <div class="arena-title mb-3">
                    <div class="flex flex-col items-center">
                        <div
                            class="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/40 shadow-sm relative overflow-hidden group/title">
                            <Icon icon="ph:crown-simple-fill" class="text-amber-600 text-sm" />
                            <span class="text-[11px] font-black text-amber-950 tracking-wider">{{ t('event_elimination.grand_final', 'Grand Final') }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="goldMatch" class="relative group">
                    <EliminationMatchCard :match="goldMatch" :bracket-format="bracketFormat"
                        :is-selected="selectedMatchId === goldMatch.id" :is-final="true"
                        @select="$emit('select-match', $event)" />
                </div>
            </div>

            <!-- SEMIFINALS (Middle Anchor - Absolutely Centered) -->
            <div
                class="semifinals-container absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 w-full z-20">
                <div class="flex justify-center gap-8 w-full relative">
                    <div v-for="match in semifinalMatches" :key="match.id" class="relative group">
                        <EliminationMatchCard :match="match" :bracket-format="bracketFormat"
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
                        class="stroke-slate-300 stroke-[2px]" />
                    <!-- Losers to Bronze Match (Starting from bottom of Semis: CY + 65) -->
                    <path v-for="x in [144, 456]" :key="'lose-' + x"
                        :d="`M ${x} ${totalHeight / 2 + 65} V ${totalHeight / 2 + 130} H 300 V ${totalHeight / 2 + 210}`"
                        class="stroke-amber-600/30 stroke-[2px] stroke-dasharray-[4,4]" />
                </svg>
            </div>

            <!-- 3rd PLACE MATCH (Bottom) -->
            <div class="bronze-match-container absolute bottom-4 inset-x-0 w-full flex flex-col items-center z-10">
                <div class="flex items-center gap-3 w-full mb-3 relative">
                    <div class="h-px flex-1 bg-slate-200"></div>
                    <div
                        class="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-white border border-slate-200 shadow-sm">
                        <Icon icon="ph:shield-bold" class="text-amber-600 text-xs" />
                        <span class="text-[9px] font-black text-slate-600 tracking-wider">{{ t('event_elimination.bronze_medal_match', 'Bronze Match') }}</span>
                    </div>
                    <div class="h-px flex-1 bg-slate-200"></div>
                </div>
                <div v-if="bronzeMatch" class="relative group">
                    <EliminationMatchCard :match="bronzeMatch" :bracket-format="bracketFormat"
                        :is-selected="selectedMatchId === bronzeMatch.id" :is-bronze="true"
                        @select="$emit('select-match', $event)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import EliminationMatchCard from './EliminationMatchCard.vue'

const { t } = useI18n()

const props = defineProps({
    totalRounds: { type: Number, required: true },
    semifinalMatches: { type: Array, required: true },
    goldMatch: { type: Object, default: null },
    bronzeMatch: { type: Object, default: null },
    totalHeight: { type: Number, required: true },
    bracketFormat: { type: String, required: true },
    selectedMatchId: { type: String, default: null }
})

defineEmits(['navigate', 'select-match'])
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
