<template>
    <div class="bracket-round">
        <div class="round-header group">
            <span class="text-[10px] font-black tracking-[0.25em] text-slate-400 capitalize">
                {{ roundName }}
            </span>
            <button type="button" @click="$emit('navigate', roundNo)"
                class="mt-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black tracking-wider text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
                <Icon icon="ph:gear-six-bold" class="text-xs text-slate-400 group-hover:text-primary transition-colors" />
                <span>{{ t('event_elimination.manage') }}</span>
            </button>
        </div>
        <div class="slots-container flex flex-col justify-center" :style="{ height: totalHeight + 'px' }">
            <div v-for="match in matches" :key="match.id" class="match-slot" :style="{ height: slotHeight + 'px' }">
                <EliminationMatchCard :match="match" :bracket-format="bracketFormat"
                    :is-selected="selectedMatchId === match.id" :show-seed="parseInt(roundNo) === 1"
                    @select="$emit('select-match', $event)" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import EliminationMatchCard from './EliminationMatchCard.vue'

const { t } = useDashboardI18n()

const props = defineProps({
    roundNo: { type: [Number, String], required: true },
    roundName: { type: String, required: true },
    matches: { type: Array, required: true },
    totalHeight: { type: Number, required: true },
    slotHeight: { type: Number, required: true },
    bracketFormat: { type: String, required: true },
    selectedMatchId: { type: String, default: null }
})

defineEmits(['navigate', 'select-match'])
</script>

<style scoped>
.bracket-round {
    @apply flex flex-col items-center min-w-[280px];
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
</style>
