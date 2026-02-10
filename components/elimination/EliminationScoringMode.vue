<template>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Matches Navigation / Selector -->
        <div class="lg:col-span-4 xl:col-span-3">
            <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 sm:p-6 sticky top-6">
                <div class="flex items-center justify-between mb-6 pb-2 border-b border-gray-50">
                    <h3 class="text-[10px] font-black tracking-[0.2em] text-navy/40 flex items-center gap-2 uppercase">
                        <Icon icon="ph:list-bullets-bold" class="text-sm" />
                        Daftar Match
                    </h3>
                    <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-black text-slate-400">{{
                        roundMatches.length }}</span>
                </div>
                <!-- REMOVED overflow-hidden and adjusted padding for better visibility -->
                <div class="flex flex-col gap-4 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar p-1">
                    <button v-for="match in roundMatches" :key="match.id" @click="$emit('select-match', match)"
                        class="group p-4 rounded-3xl border-2 text-left transition-all relative overflow-hidden" :class="[
                            selectedScoringMatch?.id === match.id
                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/5 ring-4 ring-primary/10'
                                : 'border-gray-100 bg-white hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
                            (match.status === 'finished' || match.winner_entry_id) ? 'bg-slate-50/50' : ''
                        ]">

                        <!-- Match Meta Header -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <div
                                    class="px-2.5 py-1 rounded-xl bg-navy text-primary text-[10px] font-black shadow-sm">
                                    MATCH {{ match.match_no }}
                                </div>
                                <div v-if="match.target_name"
                                    class="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[9px] font-black text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                                    <Icon icon="ph:target-bold" class="text-xs text-primary" />
                                    {{ getFullTargetName(match) }}
                                </div>
                            </div>

                            <!-- Status Status Indicator -->
                            <div class="flex items-center gap-1.5">
                                <div v-if="match.status === 'finished' || match.winner_entry_id"
                                    class="px-2 py-0.5 rounded-lg bg-green-500/10 text-green-600 text-[8px] font-black uppercase tracking-[0.2em] border border-green-500/20">
                                    DONE
                                </div>
                                <div v-else-if="match.target_name"
                                    class="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-600 text-[8px] font-black uppercase tracking-[0.2em] border border-blue-500/20 animate-pulse">
                                    LIVE
                                </div>
                                <div v-else
                                    class="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-400 text-[8px] font-black uppercase tracking-[0.2em] border border-gray-200">
                                    PENDING
                                </div>
                            </div>
                        </div>

                        <!-- Info Grid (Participants) -->
                        <div class="flex flex-col gap-1.5">
                            <div v-for="side in ['A', 'B']" :key="side"
                                class="flex items-center justify-between px-3 py-2 rounded-xl transition-all" :class="[
                                    isWinner(match, side === 'A' ? match.entry_a_id : match.entry_b_id)
                                        ? 'bg-green-500/5'
                                        : 'bg-slate-50/50',
                                    selectedScoringMatch?.id === match.id ? 'group-hover:bg-white/40' : ''
                                ]">
                                <div class="flex items-center gap-2.5 min-w-0 flex-1">
                                    <div class="relative shrink-0">
                                        <img :src="useImageOrDefault(undefined, side === 'A' ? match.entry_a_name : match.entry_b_name)"
                                            class="size-5 rounded-md object-cover ring-1 ring-white shadow-sm" />
                                        <Icon v-if="isWinner(match, side === 'A' ? match.entry_a_id : match.entry_b_id)"
                                            icon="ph:crown-fill"
                                            class="absolute -top-1 -left-1 text-yellow-500 text-[8px]" />
                                    </div>
                                    <div class="flex items-center gap-1.5 min-w-0">
                                        <span class="text-[9px] font-black text-navy/20 shrink-0">#{{ side === 'A' ?
                                            match.entry_a_seed || '-' : match.entry_b_seed || '-' }}</span>
                                        <span class="text-[10px] font-bold text-navy truncate tracking-tight">
                                            {{ (side === 'A' ? match.entry_a_name : match.entry_b_name) || 'TBD' }}
                                        </span>
                                    </div>
                                </div>
                                <div class="text-[11px] font-black tabular-nums transition-colors ml-2"
                                    :class="isWinner(match, side === 'A' ? match.entry_a_id : match.entry_b_id) ? 'text-green-600' : 'text-navy/30'">
                                    {{ getMatchScore(match, side) }}
                                </div>
                            </div>
                        </div>

                        <!-- Progress Bar (Optional) -->
                        <div v-if="match.status !== 'finished' && !match.winner_entry_id && match.target_name"
                            class="mt-4 h-1 w-full bg- slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-primary transition-all duration-1000" style="width: 40%"></div>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <!-- Active Match Scoring Panel -->
        <div class="lg:col-span-8 xl:col-span-9">
            <div v-if="selectedScoringMatch" class="space-y-6">
                <!-- Match Summary Header -->
                <div
                    class="bg-navy rounded-[3rem] p-8 sm:p-12 flex flex-col items-center justify-center gap-8 text-white shadow-sm overflow-hidden relative border border-white/5">
                    <!-- Premium Background Layers -->
                    <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <Icon icon="ph:target" class="text-[500px] absolute -right-32 -bottom-32 rotate-12" />
                    </div>
                    <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent">
                    </div>
                    <div class="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/5 to-transparent">
                    </div>

                    <div
                        class="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 w-full">
                        <div class="flex flex-col items-center gap-5 text-center group">
                            <div class="relative">
                                <div
                                    class="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                </div>
                                <img :src="useImageOrDefault(selectedScoringMatch.entry_a_avatar || selectedScoringMatch.entry_a_photo, selectedScoringMatch.entry_a_name)"
                                    class="size-20 sm:size-24 rounded-[2.5rem] border-4 border-white/10 shadow-sm relative z-10" />
                                <div
                                    class="absolute -bottom-1 -left-1 z-20 size-8 bg-navy border-2 border-primary rounded-xl flex items-center justify-center text-[10px] font-black text-primary shadow-sm">
                                    {{ selectedScoringMatch.entry_a_seed || '-' }}
                                </div>
                            </div>
                            <div class="space-y-1">
                                <h4
                                    class="font-black text-lg sm:text-2xl leading-tight max-w-[240px] truncate tracking-tight text-white">
                                    {{ selectedScoringMatch.entry_a_name || 'TBD' }}
                                </h4>
                                <p class="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">
                                    Archer A
                                </p>
                            </div>
                        </div>

                        <!-- Central Scoreboard -->
                        <div class="flex flex-col items-center gap-5">
                            <div
                                class="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-inner">
                                <span class="text-[9px] font-black tracking-[0.5em] text-white/40 uppercase">{{
                                    getFullTargetName(selectedScoringMatch) }}</span>
                            </div>

                            <div class="flex items-center gap-6 sm:gap-10">
                                <div class="flex flex-col items-center transform transition-transform duration-500"
                                    :class="{ 'scale-110': activeSide === 'A' }">
                                    <span
                                        class="text-5xl sm:text-6xl font-black text-primary drop-shadow-[0_0_20px_rgba(255,193,7,0.3)] tracking-tighter">
                                        {{ getMatchScore(selectedScoringMatch, 'A') }}
                                    </span>
                                </div>

                                <div class="flex flex-col items-center py-2">
                                    <div
                                        class="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent relative">
                                        <div
                                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-navy px-2 py-1 border border-white/10 rounded-lg text-[8px] font-black tracking-[0.3em] text-white/30 backdrop-blur-md">
                                            VS</div>
                                    </div>
                                </div>

                                <div class="flex flex-col items-center transform transition-transform duration-500"
                                    :class="{ 'scale-110': activeSide === 'B' }">
                                    <span
                                        class="text-5xl sm:text-6xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] tracking-tighter">
                                        {{ getMatchScore(selectedScoringMatch, 'B') }}
                                    </span>
                                </div>
                            </div>

                            <!-- Match Status Actions -->
                            <div class="">
                                <div v-if="selectedScoringMatch.winner_entry_id || selectedScoringMatch.status === 'finished'"
                                    class="px-5 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 backdrop-blur-sm flex items-center gap-2">
                                    <Icon icon="ph:seal-check-fill" class="text-green-500 text-[10px]" />
                                    <span
                                        class="text-[9px] font-black tracking-[0.3em] text-green-400 uppercase">DONE</span>
                                </div>
                                <button v-else-if="canEndMatch" @click="$emit('end-match')" :disabled="isEndingMatch"
                                    class="group px-6 py-2 rounded-xl bg-primary text-navy font-black text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-primary/20 hover:-translate-y-0.5">
                                    <Icon v-if="isEndingMatch" icon="ph:circle-notch-bold"
                                        class="animate-spin text-xs" />
                                    <Icon v-else icon="ph:flag-checkered-fill"
                                        class="group-hover:rotate-12 transition-transform text-xs" />
                                    <span>{{ isEndingMatch ? 'Ending...' : 'Finish Match' }}</span>
                                </button>
                                <div v-else
                                    class="px-5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                                    <div class="size-1 rounded-full bg-white/20 animate-pulse"></div>
                                    <span
                                        class="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase">LIVE</span>
                                </div>
                            </div>
                        </div>

                        <!-- Side B Card -->
                        <div class="flex flex-col items-center gap-5 text-center group">
                            <div class="relative">
                                <div
                                    class="absolute -inset-4 bg-white/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                </div>
                                <img :src="useImageOrDefault(selectedScoringMatch.entry_b_avatar || selectedScoringMatch.entry_b_photo, selectedScoringMatch.entry_b_name)"
                                    class="size-20 sm:size-24 rounded-[2.5rem] border-4 border-white/10 shadow-sm relative z-10" />
                                <div
                                    class="absolute -bottom-1 -right-1 z-20 size-8 bg-navy border-2 border-white/20 rounded-xl flex items-center justify-center text-[10px] font-black text-white/40 shadow-sm">
                                    {{ selectedScoringMatch.entry_b_seed || '-' }}
                                </div>
                            </div>
                            <div class="space-y-1">
                                <h4
                                    class="font-black text-lg sm:text-2xl leading-tight max-w-[240px] truncate tracking-tight text-white">
                                    {{ selectedScoringMatch.entry_b_name || 'TBD' }}
                                </h4>
                                <p class="text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-40">
                                    Archer B
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Main Input Dashboard -->
                <div class="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8 sm:p-10">
                    <!-- End Navigator -->
                    <div class="flex items-center justify-between mb-10 pb-6 border-b border-gray-100">
                        <div class="flex flex-wrap items-center gap-3 sm:gap-4">
                            <div v-for="i in (bracket?.ends_per_match || 5)" :key="i"
                                @click="$emit('update:currentEnd', i)"
                                class="flex flex-col items-center gap-2 cursor-pointer group">
                                <span class="text-[10px] font-black tracking-[0.2em] transition-colors uppercase"
                                    :class="currentEnd === i ? 'text-navy' : 'text-gray-300 group-hover:text-gray-500'">End
                                    {{ i }}</span>
                                <div class="size-10 sm:size-12 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black transition-all relative"
                                    :class="currentEnd === i ? 'bg-navy text-primary shadow-sm' : 'bg-slate-50 text-gray-400 group-hover:bg-gray-100 group-hover:text-navy'">
                                    {{ i }}
                                    <div v-if="currentEnd === i"
                                        class="absolute -bottom-1 w-4 h-0.5 bg-primary rounded-full">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="hidden sm:block text-right">
                            <h5 class="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-1">Mode</h5>
                            <span class="px-2 py-0.5 rounded-lg bg-navy/5 text-navy text-[10px] font-black uppercase">
                                {{ bracket.format === 'recurve_set' ? 'SET' : 'ACCUMULATED' }}
                            </span>
                        </div>
                    </div>

                    <!-- Scoring Interaction Area -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
                        <template v-for="side in ['A', 'B']" :key="side">
                            <div class="space-y-8">
                                <!-- Scoring Card -->
                                <div class="p-0.5 rounded-[2.5rem] bg-gradient-to-br transition-all duration-500"
                                    :class="activeSide === side ? 'from-primary/20 to-primary/5 shadow-sm' : 'from-transparent to-transparent opacity-80'">
                                    <div class="p-6 sm:p-8 rounded-[2.4rem] border-2 transition-all duration-500 relative overflow-hidden group hover:border-primary/20"
                                        :class="activeSide === side ? 'bg-white border-primary shadow-sm' : 'bg-slate-50/50 border-gray-100'"
                                        @click="$emit('update:activeSide', side)">

                                        <!-- Decorative Background -->
                                        <div v-if="activeSide === side"
                                            class="absolute -right-10 -bottom-10 size-32 border-[166px] border-primary/5 rounded-full pointer-events-none">
                                        </div>

                                        <!-- Result Summary Line -->
                                        <div class="flex justify-between items-start mb-6">
                                            <div class="flex items-center gap-4">
                                                <div class="size-10 rounded-xl flex items-center justify-center text-sm font-black shadow-inner"
                                                    :class="activeSide === side ? 'bg-navy text-primary' : 'bg-gray-200 text-gray-400'">
                                                    {{ side }}
                                                </div>
                                                <div class="min-w-0">
                                                    <h4 class="text-sm sm:text-base font-black text-navy truncate">
                                                        {{ side === 'A' ? selectedScoringMatch.entry_a_name :
                                                            (selectedScoringMatch.entry_b_name || 'TBD') }}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div class="text-right">
                                                <div class="flex items-center gap-1 mb-1 justify-end">
                                                    <div
                                                        class="px-1.5 py-0.5 rounded bg-gray-100 text-navy font-black text-[8px] uppercase">
                                                        X:{{ calculateEndStats(selectedScoringMatch.id, currentEnd,
                                                            side).x }}
                                                    </div>
                                                    <div
                                                        class="px-1.5 py-0.5 rounded bg-gray-100 text-navy font-black text-[8px] uppercase">
                                                        10:{{ calculateEndStats(selectedScoringMatch.id, currentEnd,
                                                            side).ten }}
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <span
                                                        class="text-[8px] font-black text-gray-400 uppercase">SUM</span>
                                                    <span class="text-xl font-black text-navy tabular-nums">{{
                                                        calculateEndTotal(selectedScoringMatch.id, currentEnd, side)
                                                        }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- ARROW SLOTS -->
                                        <div class="flex items-center justify-center gap-3 sm:gap-4">
                                            <div v-for="i in (bracket?.arrows_per_end || 3)" :key="i"
                                                class="size-14 sm:size-16 rounded-xl border-4 text-lg sm:text-xl font-black transition-all duration-300 cursor-pointer shrink-0 flex items-center justify-center relative group/box"
                                                :class="[
                                                    activeSide === side && (selectedArrowIndex === i - 1)
                                                        ? 'border-primary bg-white shadow-sm scale-110 z-20 border-solid'
                                                        : (getArrowScore(selectedScoringMatch.id, currentEnd, side, i) ? 'bg-slate-50 border-gray-100 border-solid' : 'bg-white border-dashed border-gray-100')
                                                ]" @click.stop="$emit('select-arrow-box', side, i - 1)">

                                                <Icon v-if="activeSide === side && (selectedArrowIndex === i - 1)"
                                                    icon="ph:caret-down-fill"
                                                    class="absolute -top-5 text-primary animate-bounce text-sm" />

                                                <span class="text-navy">
                                                    {{ getArrowScore(selectedScoringMatch.id, currentEnd, side, i) }}
                                                </span>

                                                <div v-if="!getArrowScore(selectedScoringMatch.id, currentEnd, side, i) && !(activeSide === side && selectedArrowIndex === i - 1)"
                                                    class="size-1.5 rounded-full bg-slate-100">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- PREMIUM NUMERICAL KEYPAD -->
                                <div v-if="activeSide === side"
                                    class="pt-2 animate-in slide-in-from-top-4 duration-500 fade-in">
                                    <div class="grid grid-cols-4 gap-2 sm:gap-3">
                                        <button v-for="num in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'X', 'M']" :key="num"
                                            @click="$emit('add-score', num)"
                                            class="aspect-square rounded-2xl text-base sm:text-lg font-black shadow-sm transition-all flex items-center justify-center border-b-4 active:border-b-0 active:translate-y-[4px] hover:-translate-y-0.5"
                                            :class="getScoreKeypadClass(num)">
                                            {{ num }}
                                        </button>

                                        <!-- Footer Actions in Keypad -->
                                        <div class="col-span-4 grid grid-cols-3 gap-3 pt-4">
                                            <button @click="$emit('delete-last-arrow')"
                                                class="col-span-1 h-12 sm:h-14 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm group">
                                                <Icon icon="ph:backspace-bold"
                                                    class="text-xl group-active:scale-90 transition-transform" />
                                                <span
                                                    class="hidden md:inline text-[9px] tracking-widest font-black uppercase">DEL</span>
                                            </button>
                                            <button @click="$emit('save-and-next')" :disabled="isSaving"
                                                class="col-span-2 h-12 sm:h-14 rounded-2xl bg-navy text-primary font-black flex items-center justify-center gap-2 shadow-sm shadow-navy/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 group">
                                                <Icon v-if="isSaving" icon="ph:circle-notch-bold"
                                                    class="animate-spin text-xl" />
                                                <template v-else>
                                                    <span class="text-[10px] tracking-widest uppercase truncate">Simpan
                                                        Skor</span>
                                                    <Icon icon="ph:paper-plane-right-fill"
                                                        class="text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </template>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else
                class="bg-white rounded-[3rem] border-4 border-dashed border-slate-100 p-20 text-center flex flex-col items-center justify-center shadow-inner">
                <div
                    class="size-24 rounded-[2.5rem] bg-slate-50 shadow-sm flex items-center justify-center mb-6 relative group">
                    <div
                        class="absolute inset-0 bg-primary/20 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    </div>
                    <Icon icon="ph:hand-pointing-bold" class="text-4xl text-gray-300 relative z-10" />
                </div>
                <h3 class="text-xl font-black text-navy tracking-tight">Mulai Penilaian</h3>
                <p class="text-gray-400 mt-2 max-w-sm text-center text-sm font-medium">
                    Pilih salah satu pertandingan dari daftar sebelah kiri untuk memulai penginputan skor real-time
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    bracket: { type: Object, required: true },
    roundMatches: { type: Array, required: true },
    selectedScoringMatch: { type: Object, default: null },
    activeSide: { type: String, default: 'A' },
    currentEnd: { type: Number, default: 1 },
    matchEnds: { type: Object, required: true },
    isSaving: { type: Boolean, default: false },
    isEndingMatch: { type: Boolean, default: false },
    selectedArrowIndex: { type: Number, default: 0 },
    canEndMatch: { type: Boolean, default: false }
})

defineEmits([
    'select-match',
    'add-score',
    'delete-last-arrow',
    'save-and-next',
    'end-match',
    'select-arrow-box',
    'update:currentEnd',
    'update:activeSide'
])


const getMatchScore = (match, side) => {
    if (!match) return 0
    const isRecurve = props.bracket?.format === 'recurve_set'
    const sideKey = side === 'A' ? 'A' : 'B'

    if (match.winner_entry_id) {
        const isWinner = match.winner_entry_id === (side === 'A' ? match.entry_a_id : match.entry_b_id)
        if (isRecurve) {
            const m = props.matchEnds[match.id]
            if (m) return calculateSetPoints(match.id, sideKey)
            return isWinner ? '6' : '0'
        }
        return isWinner ? 'W' : 'L'
    }

    const m = props.matchEnds[match.id]
    if (!m) return 0

    if (isRecurve) {
        return calculateSetPoints(match.id, sideKey)
    }
    return Object.values(m[sideKey] || {}).reduce((s, e) => s + (e.total || 0), 0) || 0
}

const calculateSetPoints = (matchId, side) => {
    const m = props.matchEnds[matchId]
    if (!m) return 0

    let setPointsA = 0
    let setPointsB = 0

    const totalEnds = props.bracket?.ends_per_match || 5
    const arrowsPerEnd = props.bracket?.arrows_per_end || 3

    for (let i = 1; i <= totalEnds; i++) {
        const endA = m.A[i]
        const endB = m.B[i]
        if (!endA || !endB) continue

        const finishedA = endA.arrows && endA.arrows.filter(a => a !== null && a !== '').length === arrowsPerEnd
        const finishedB = endB.arrows && endB.arrows.filter(a => a !== null && a !== '').length === arrowsPerEnd

        if (finishedA && finishedB) {
            if (endA.total > endB.total) {
                setPointsA += 2
            } else if (endA.total < endB.total) {
                setPointsB += 2
            } else {
                setPointsA += 1
                setPointsB += 1
            }
        }

        if (setPointsA >= 6 || setPointsB >= 6) break
    }

    return side === 'A' ? setPointsA : setPointsB
}

const getFullTargetName = (match) => {
    if (!match) return 'Belum Ada Target'
    if (match.target_name) return match.target_name.startsWith('Target') ? match.target_name : `Target ${match.target_name}`
    return 'Target Terpilih'
}

const calculateEndTotal = (matchId, endNo, side) => {
    const end = props.matchEnds[matchId]?.[side]?.[endNo]
    if (!end || !end.arrows) return 0
    return end.arrows.reduce((sum, a) => {
        if (!a || a === '-' || a === '') return sum
        const val = a === 'X' ? 10 : (a === 'M' ? 0 : parseInt(a) || 0)
        return sum + val
    }, 0)
}

const calculateEndStats = (matchId, endNo, side) => {
    const end = props.matchEnds[matchId]?.[side]?.[endNo]
    if (!end || !end.arrows) return { x: 0, ten: 0 }
    return end.arrows.reduce((stats, a) => {
        if (a === 'X') {
            stats.x++
            stats.ten++
        } else if (a === '10' || a === 10) {
            stats.ten++
        }
        return stats
    }, { x: 0, ten: 0 })
}

const getArrowScore = (matchId, endNo, side, arrowIdx) => {
    const val = props.matchEnds[matchId]?.[side]?.[endNo]?.arrows?.[arrowIdx - 1]
    return val === null || val === undefined ? '' : val
}

const getScoreKeypadClass = (score) => {
    const s = String(score).toUpperCase()
    if (['X', '10', '9'].includes(s)) return 'bg-gradient-to-br from-[#FFE500] to-[#FFCC00] border-[#b89512] text-navy'
    if (['8', '7'].includes(s)) return 'bg-gradient-to-br from-[#EF4444] to-[#DC2626] border-[#991B1B] text-white'
    if (['6', '5'].includes(s)) return 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB] border-[#1E40AF] text-white'
    if (['4', '3'].includes(s)) return 'bg-gradient-to-br from-[#1E293B] to-[#0F172A] border-[#020617] text-white'
    if (['2', '1'].includes(s)) return 'bg-gradient-to-br from-white to-slate-50 border-slate-200 text-navy'
    if (s === 'M') return 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 text-slate-500'
    return 'bg-white text-navy border-gray-200'
}

const isWinner = (match, entryId) => {
    if (!match || !match.winner_entry_id || !entryId) return false
    return match.winner_entry_id === entryId
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: none;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar {
    scrollbar-width: none;
}
</style>
