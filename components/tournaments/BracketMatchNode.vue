<template>
    <div class="match-node-card" :class="{
        'is-final': isFinal,
        'completed': match.winner
    }">
        <!-- Match Info Header -->
        <div class="match-card-header">
            <div v-if="match.winner" class="status-badge">Selesai</div>
            <div v-else class="status-badge waiting">Menunggu</div>
            <span class="match-meta">{{ match.target || 'TBA' }}</span>
        </div>

        <!-- Archer Rows -->
        <div class="archer-list">
            <div v-for="i in [1, 2]" :key="i" class="archer-item" :class="{
                'is-winner': match.winner === i,
                'is-loser': match.winner && match.winner !== i
            }">
                <div class="avatar-wrapper shadow-sm">
                    <img :src="useImageOrDefault(match[`archer${i}`]?.avatar, match[`archer${i}`]?.name)" :alt="match[`archer${i}`]?.name || 'Archer'" @error="(e) => e.target.src = generateDicebearAvatar(match[`archer${i}`]?.name)" class="avatar-img" />
                    <div v-if="match.winner === i" class="winner-crown">
                        <Icon icon="ph:crown-fill" />
                    </div>
                </div>

                <div class="archer-info">
                    <div class="name-row">
                        <span class="archer-name">{{ match[`archer${i}`]?.name || 'TBA' }}</span>
                        <span v-if="match[`archer${i}`]?.seed" class="seed-tag">#{{ match[`archer${i}`].seed }}</span>
                    </div>
                </div>

                <div class="score-display">
                    {{ match[`archer${i}`]?.score ?? '-' }}
                </div>
            </div>
        </div>

        <!-- Highlight for Final Winner -->
        <div v-if="isFinal && match.winner" class="champion-glow"></div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

defineProps({
    match: { type: Object, required: true },
    isFinal: { type: Boolean, default: false }
})
</script>

<style scoped>
.match-node-card {
    @apply relative w-[220px] bg-white rounded-2xl border border-gray-100 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden;
    height: 128px;
    /* Fixed height for mathematical alignment */
}

.match-node-card:hover {
    @apply shadow-xl border-primary/40 -translate-y-1;
}

.match-node-card.completed {
    @apply border-l-4 border-l-green-500;
}

.match-node-card.is-final {
    @apply w-[240px] border-2 border-primary/30 shadow-lg shadow-primary/5;
    height: 140px;
}

.match-node-card.is-final.completed {
    @apply border-primary border-l-8 shadow-2xl shadow-primary/20;
}

.match-card-header {
    @apply flex justify-between items-center px-4 py-1.5 bg-slate-50 border-b border-gray-50;
}

.status-badge {
    @apply text-[8px] font-black tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-md;
}

.status-badge.waiting {
    @apply bg-amber-100 text-amber-700;
}

.match-meta {
    @apply text-[9px] font-bold text-gray-400;
}

.archer-list {
    @apply py-0.5;
}

.archer-item {
    @apply flex items-center gap-3 px-4 py-1.5 transition-colors relative;
}

.archer-item.is-winner {
    @apply bg-primary/5;
}

.archer-item.is-loser {
    @apply opacity-50 grayscale-[0.3];
}

.avatar-wrapper {
    @apply relative w-8 h-8 rounded-lg overflow-visible bg-white p-0.5 border border-gray-100;
}

.avatar-img {
    @apply w-full h-full rounded-md object-cover;
}

.winner-crown {
    @apply absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-primary-text rounded-full flex items-center justify-center text-[8px] shadow-md border-2 border-white;
}

.archer-info {
    @apply flex-1 min-w-0;
}

.name-row {
    @apply flex items-center gap-1.5;
}

.archer-name {
    @apply  text-xs font-black text-navy truncate;
}

.seed-tag {
    @apply text-[8px] font-bold text-gray-400;
}

.score-display {
    @apply text-sm font-black text-navy tabular-nums;
}

.is-winner .score-display {
    @apply text-primary text-base;
}

.champion-glow {
    @apply absolute inset-0 pointer-events-none bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 animate-pulse;
}
</style>
