<template>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <!-- Matches Navigation / Selector -->
        <div class="lg:col-span-4 xl:col-span-3">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sticky top-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xs font-black tracking-widest text-gray-400 flex items-center gap-2">
                        <Icon icon="ph:list-bullets" class="text-sm" />
                        MATCH LIST
                    </h3>
                    <span class="text-[10px] font-bold text-gray-400">{{ roundMatches.length }} match</span>
                </div>
                <div class="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 no-scrollbar">
                    <button v-for="match in roundMatches" :key="match.id" @click="$emit('select-match', match)"
                        class="group p-3 rounded-2xl border-2 text-left transition-all relative" :class="[
                            selectedScoringMatch?.id === match.id
                                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                : 'border-transparent bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-md',
                            (match.status === 'finished' || match.winner_entry_id) ? 'opacity-60' : ''
                        ]">

                        <!-- Match Header -->
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2">
                                <span class="size-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                                    :class="selectedScoringMatch?.id === match.id ? 'bg-primary text-navy' : 'bg-slate-200 text-slate-500'">
                                    {{ match.match_no }}
                                </span>
                                <span v-if="match.target_name" class="text-[9px] font-medium text-slate-400">
                                    {{ getFullTargetName(match) }}
                                </span>
                            </div>
                            <!-- Status Indicator -->
                            <div class="size-2 rounded-full" :class="{
                                'bg-green-500': match.status === 'finished' || match.winner_entry_id,
                                'bg-blue-500 animate-pulse': match.status === 'in_progress',
                                'bg-slate-300': match.status === 'pending' && !match.winner_entry_id
                            }"></div>
                        </div>

                        <!-- Participants -->
                        <div class="space-y-1.5">
                            <!-- Entry A -->
                            <div class="flex items-center justify-between gap-2 py-1 px-2 rounded-xl transition-colors"
                                :class="match.winner_entry_id === match.entry_a_id ? 'bg-green-50' : ''">
                                <div class="flex items-center gap-2 min-w-0 flex-1">
                                    <img :src="getAvatarUrl(match.entry_a_name)"
                                        class="size-6 rounded-lg object-cover" />
                                    <span class="text-xs font-semibold text-navy truncate">
                                        {{ match.entry_a_name || 'TBD' }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Icon v-if="match.winner_entry_id === match.entry_a_id" icon="ph:crown-fill"
                                        class="text-xs text-yellow-500" />
                                    <span class="text-sm font-black tabular-nums min-w-[24px] text-right"
                                        :class="match.winner_entry_id === match.entry_a_id ? 'text-green-600' : 'text-slate-600'">
                                        {{ getMatchScore(match, 'A') }}
                                    </span>
                                </div>
                            </div>

                            <!-- VS Divider -->
                            <div class="flex items-center gap-2 px-2">
                                <div class="flex-1 h-px bg-slate-100"></div>
                                <span class="text-[8px] font-black text-slate-300">VS</span>
                                <div class="flex-1 h-px bg-slate-100"></div>
                            </div>

                            <!-- Entry B -->
                            <div class="flex items-center justify-between gap-2 py-1 px-2 rounded-xl transition-colors"
                                :class="match.winner_entry_id === match.entry_b_id ? 'bg-green-50' : ''">
                                <div class="flex items-center gap-2 min-w-0 flex-1">
                                    <img :src="getAvatarUrl(match.entry_b_name)"
                                        class="size-6 rounded-lg object-cover" />
                                    <span class="text-xs font-semibold text-navy truncate">
                                        {{ match.entry_b_name || 'TBD' }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <Icon v-if="match.winner_entry_id === match.entry_b_id" icon="ph:crown-fill"
                                        class="text-xs text-yellow-500" />
                                    <span class="text-sm font-black tabular-nums min-w-[24px] text-right"
                                        :class="match.winner_entry_id === match.entry_b_id ? 'text-green-600' : 'text-slate-600'">
                                        {{ getMatchScore(match, 'B') }}
                                    </span>
                                </div>
                            </div>
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
                    class="bg-navy rounded-[40px] p-8 sm:p-12 flex flex-col items-center justify-center gap-8 text-white shadow-md overflow-hidden relative border border-white/5">
                    <div class="absolute inset-0 opacity-5 pointer-events-none">
                        <Icon icon="ph:target" class="text-[400px] absolute -right-20 -bottom-20 rotate-12" />
                    </div>

                    <div
                        class="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
                        <!-- Side A -->
                        <div class="flex flex-col items-center gap-4 text-center">
                            <div class="relative">
                                <img :src="getAvatarUrl(selectedScoringMatch.entry_a_name)"
                                    class="size-20 sm:size-28 rounded-[2rem] border-4 border-white/10 shadow-2xl" />
                                <div
                                    class="absolute -bottom-2 -left-2 size-8 bg-navy border-2 border-primary rounded-xl flex items-center justify-center text-[10px] font-black text-primary">
                                    {{ selectedScoringMatch.entry_a_seed || '-' }}
                                </div>
                            </div>
                            <div class="space-y-1">
                                <span class="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Archer
                                    A</span>
                                <h4 class="font-black text-xl sm:text-2xl leading-tight max-w-[200px] truncate">
                                    {{ selectedScoringMatch.entry_a_name || 'TBD' }}
                                </h4>
                            </div>
                        </div>

                        <!-- Central Scoreboard -->
                        <div class="flex flex-col items-center gap-4">
                            <div class="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                <span class="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">{{
                                    getFullTargetName(selectedScoringMatch) }}</span>
                            </div>

                            <div class="flex items-center gap-6 sm:gap-10">
                                <div class="flex flex-col items-center">
                                    <span
                                        class="text-5xl sm:text-7xl font-black text-primary drop-shadow-[0_0_30px_rgba(255,193,7,0.3)]">
                                        {{ getMatchScore(selectedScoringMatch, 'A') }}
                                    </span>
                                </div>

                                <div class="flex flex-col items-center">
                                    <div class="w-px h-16 bg-white/10 relative">
                                        <div class="absolute inset-0 bg-white/20 blur-sm"></div>
                                        <div
                                            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-navy px-2 py-1 border border-white/10 rounded-lg text-[8px] font-black tracking-widest text-white/40">
                                            VS</div>
                                    </div>
                                </div>

                                <div class="flex flex-col items-center">
                                    <span
                                        class="text-5xl sm:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                        {{ getMatchScore(selectedScoringMatch, 'B') }}
                                    </span>
                                </div>
                            </div>

                            <!-- End Match Button or Finished Badge -->
                            <div v-if="selectedScoringMatch.winner_entry_id || selectedScoringMatch.status === 'finished'"
                                class="px-4 py-1.5 rounded-xl bg-green-500/20 border border-green-500/30">
                                <span class="text-[9px] font-black tracking-[0.2em] text-green-400 uppercase italic">
                                    MATCH FINISHED
                                </span>
                            </div>
                            <button v-else-if="canEndMatch" @click="$emit('end-match')" :disabled="isEndingMatch"
                                class="px-6 py-2 rounded-xl bg-primary text-navy font-black text-sm tracking-wide hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/30">
                                <Icon v-if="isEndingMatch" icon="ph:circle-notch-bold" class="animate-spin" />
                                <Icon v-else icon="ph:flag-checkered-fill" />
                                <span>{{ isEndingMatch ? 'Mengakhiri...' : 'Akhiri Match' }}</span>
                            </button>
                            <div v-else class="px-4 py-1.5 rounded-xl bg-white/10 border border-white/20">
                                <span class="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">
                                    INPUT SKOR DULU
                                </span>
                            </div>
                        </div>

                        <!-- Side B -->
                        <div class="flex flex-col items-center gap-4 text-center">
                            <div class="relative">
                                <img :src="getAvatarUrl(selectedScoringMatch.entry_b_name)"
                                    class="size-20 sm:size-28 rounded-[2rem] border-4 border-white/10 shadow-2xl" />
                                <div
                                    class="absolute -bottom-2 -right-2 size-8 bg-navy border-2 border-white/40 rounded-xl flex items-center justify-center text-[10px] font-black text-white/60">
                                    {{ selectedScoringMatch.entry_b_seed || '-' }}
                                </div>
                            </div>
                            <div class="space-y-1">
                                <span class="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Archer
                                    B</span>
                                <h4 class="font-black text-xl sm:text-2xl leading-tight max-w-[200px] truncate">
                                    {{ selectedScoringMatch.entry_b_name || 'TBD' }}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input Grid -->
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                    <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                        <div class="flex items-center gap-6">
                            <div v-for="i in (bracket?.ends_per_match || 5)" :key="i"
                                @click="$emit('update:currentEnd', i)"
                                class="flex flex-col items-center gap-1 cursor-pointer group">
                                <span class="text-[10px] font-black tracking-widest transition-colors"
                                    :class="currentEnd === i ? 'text-navy' : 'text-gray-400 group-hover:text-gray-600'">End
                                    {{ i }}</span>
                                <div class="size-10 rounded-xl flex items-center justify-center text-sm font-black transition-all"
                                    :class="currentEnd === i ? 'bg-navy text-primary shadow-sm scale-110' : 'bg-slate-50 text-gray-400 group-hover:bg-gray-100'">
                                    {{ i }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Score input and keyboard -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <template v-for="side in ['A', 'B']" :key="side">
                            <div class="space-y-6">
                                <div class="p-1 rounded-[2.5rem] bg-gradient-to-br transition-all duration-300"
                                    :class="activeSide === side ? 'from-primary/20 to-primary/5 shadow-xl shadow-primary/5' : 'from-transparent to-transparent'">
                                    <div class="p-6 rounded-[2.2rem] border-2 transition-all duration-300 relative overflow-hidden group hover:border-primary/30"
                                        :class="activeSide === side ? 'bg-white border-primary shadow-sm' : 'bg-slate-50 border-gray-100 opacity-80 hover:opacity-100'"
                                        @click="$emit('update:activeSide', side)">

                                        <!-- Archer Header -->
                                        <div class="flex justify-between items-center mb-6">
                                            <div class="flex items-center gap-4">
                                                <div class="size-10 rounded-2xl flex items-center justify-center text-sm font-black shadow-inner"
                                                    :class="activeSide === side ? 'bg-navy text-primary' : 'bg-gray-200 text-gray-400'">
                                                    {{ side }}
                                                </div>
                                                <div>
                                                    <span
                                                        class="text-[10px] font-black tracking-widest text-gray-400 block mb-0.5">ARCHER
                                                        {{ side }}</span>
                                                    <span
                                                        class="text-sm md:text-base font-bold text-navy line-clamp-1 block">
                                                        {{ side === 'A' ? selectedScoringMatch.entry_a_name :
                                                            (selectedScoringMatch.entry_b_name || 'TBD') }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="text-right flex flex-col items-end">
                                                <div class="flex items-center gap-1.5 mb-0.5">
                                                    <span
                                                        class="text-[9px] font-black px-1.5 py-0.5 rounded bg-navy/5 text-navy/40 border border-navy/5">
                                                        X: {{ calculateEndStats(selectedScoringMatch.id, currentEnd,
                                                            side).x }}
                                                    </span>
                                                    <span
                                                        class="text-[9px] font-black px-1.5 py-0.5 rounded bg-navy/5 text-navy/40 border border-navy/5">
                                                        10: {{ calculateEndStats(selectedScoringMatch.id, currentEnd,
                                                            side).ten }}
                                                    </span>
                                                    <span
                                                        class="text-[10px] font-black tracking-widest text-gray-400 ml-2">TOTAL</span>
                                                </div>
                                                <div class="text-lg md:text-2xl font-black text-navy tabular-nums">
                                                    {{ calculateEndTotal(selectedScoringMatch.id, currentEnd, side) }}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Arrow Slots -->
                                        <div class="flex items-center justify-center gap-2 md:gap-3">
                                            <div v-for="i in (bracket?.arrows_per_end || 3)" :key="i"
                                                class="size-12 rounded-xl border-2 border-dotted flex items-center justify-center text-lg md:text-xl font-bold transition-all duration-300 cursor-pointer shrink-0"
                                                :class="[
                                                    activeSide === side && (selectedArrowIndex === i - 1)
                                                        ? 'ring-4 ring-primary/20 scale-105 z-10 border-primary bg-white border-solid'
                                                        : 'bg-white border-slate-200'
                                                ]" @click.stop="$emit('select-arrow-box', side, i - 1)">
                                                {{ getArrowScore(selectedScoringMatch.id, currentEnd, side, i) }}
                                                <div v-if="activeSide === side && (selectedArrowIndex === i - 1)"
                                                    class="size-1.5 bg-primary rounded-full animate-ping absolute -top-1 -right-1">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Keyboard -->
                                <div v-if="activeSide === side"
                                    class="pt-2 animate-in slide-in-from-top-4 duration-300 fade-in">
                                    <div class="grid grid-cols-4 gap-2 md:gap-3">
                                        <button v-for="num in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'X', 'M']" :key="num"
                                            @click="$emit('add-score', num)"
                                            class="aspect-square rounded-2xl text-lg md:text-xl font-black shadow-sm transition-all flex items-center justify-center border-b-[3px] active:border-b-0 active:translate-y-[3px]"
                                            :class="getScoreButtonClass(num)">
                                            {{ num }}
                                        </button>

                                        <div class="col-span-4 grid grid-cols-3 gap-3 pt-4">
                                            <button @click="$emit('delete-last-arrow')"
                                                class="col-span-1 h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-red-500 hover:border-red-100 transition-all">
                                                <Icon icon="ph:backspace-bold" class="text-xl" />
                                                <span class="hidden md:inline text-[10px] tracking-widest">HAPUS</span>
                                            </button>
                                            <button @click="$emit('save-and-next')" :disabled="isSaving"
                                                class="col-span-2 h-12 rounded-2xl bg-navy text-primary font-black flex items-center justify-center gap-2 shadow-lg shadow-navy/20 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0">
                                                <Icon v-if="isSaving" icon="ph:circle-notch-bold"
                                                    class="animate-spin text-xl" />
                                                <template v-else>
                                                    <span class="text-xs tracking-widest uppercase">Simpan &
                                                        Lanjut</span>
                                                    <Icon icon="ph:arrow-right-bold" class="text-lg" />
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
            <div v-else
                class="bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-200 p-20 text-center flex flex-col items-center justify-center">
                <div class="size-24 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
                    <Icon icon="ph:hand-pointing-bold" class="text-4xl text-gray-300" />
                </div>
                <h3 class="text-2xl font-black text-navy tracking-tight">Pilih Match Untuk Input Skor</h3>
                <p class="text-gray-400 mt-2 max-w-xs">Pilih salah satu pertandingan dari daftar di samping untuk
                    memulai
                    penginputan skor</p>
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

const getAvatarUrl = (name) => {
    if (!name) return `https://ui-avatars.com/api/?name=TBD&background=f1f5f9&color=94a3b8&font-size=0.45`
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&font-size=0.45`
}

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

        // Only count if both have finished the end or if we want real-time even if partial?
        // Usually for real-time we want to see current points even if end is not finished.
        // But set system requires full end comparison.
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


const getScoreButtonClass = (score) => {
    const s = String(score).toUpperCase()
    if (['X', '10', '9'].includes(s)) return 'bg-[#FFE500] border-[#e6ce00] text-navy hover:bg-yellow-300'
    if (['8', '7'].includes(s)) return 'bg-[#EF4444] border-red-700 text-white hover:bg-red-400'
    if (['6', '5'].includes(s)) return 'bg-[#3B82F6] border-blue-700 text-white hover:bg-blue-400'
    if (['4', '3'].includes(s)) return 'bg-[#111827] border-black text-white hover:bg-slate-900'
    if (['2', '1'].includes(s)) return 'bg-white text-navy border-gray-200 hover:bg-gray-50'
    if (s === 'M') return 'bg-slate-200 text-slate-500 border-slate-300 hover:bg-slate-300'
    return 'bg-white text-navy border-gray-200'
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
