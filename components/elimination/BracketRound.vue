<template>
    <div class="bracket-round">
        <div class="round-header group">
            <span class="text-[10px] uppercase font-black tracking-[0.3em] text-navy/30">
                {{ roundName }}
            </span>
            <button type="button" @click="$emit('navigate', roundNo)"
                class="mt-2 px-4 py-1.5 rounded-xl bg-white border border-[#d1dcf0] text-[9px] font-black tracking-widest text-navy uppercase hover:bg-navy hover:text-primary transition-all shadow-sm">
                Manage
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
import EliminationMatchCard from './EliminationMatchCard.vue'

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
