<template>
    <div class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <!-- Matches Navigation / Selector - MOBILE: Horizontal Scroll at Top | DESKTOP: Sticky Sidebar -->
        <div class="w-full lg:col-span-4 xl:col-span-3 lg:sticky lg:top-6">
            <div class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-4 sm:p-6">
                <div class="flex items-center justify-between mb-4 lg:mb-6 pb-2 border-b border-gray-50">
                    <h3 class="text-[10px] font-black tracking-[0.2em] text-navy/40 flex items-center gap-2 uppercase">
                        <Icon icon="ph:list-bullets-bold" class="text-sm" />
                        Daftar Match
                    </h3>
                    <span class="px-2 py-0.5 rounded-lg bg-slate-100 text-[10px] font-black text-slate-400">{{
                        roundMatches.length }}</span>
                </div>
                <!-- Desktop List / Mobile Horizontal Scroll -->
                <div
                    class="flex lg:flex-col gap-4 max-h-[75vh] overflow-x-auto lg:overflow-y-auto pr-2 custom-scrollbar p-1 pb-4 lg:pb-1">
                    <!-- Match card elimination -->
                    <div v-for="match in roundMatches" :key="match.id" @click="$emit('select-match', match)"
                        class="shrink-0 w-[240px] lg:w-full group p-3 sm:p-4 rounded-[1.8rem] sm:rounded-[2rem] border-2 text-left transition-all relative cursor-pointer"
                        :class="[
                            selectedScoringMatch?.id === match.id
                                ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10 ring-4 ring-primary/5'
                                : 'border-gray-50 bg-white hover:border-gray-200 hover:shadow-lg hover:shadow-primary/5',
                            (match.status === 'finished' || match.winner_entry_id) ? 'bg-slate-50/50 grayscale-[0.2]' : ''
                        ]">

                        <!-- Match Meta Header -->
                        <div class="flex items-center justify-between mb-3 sm:mb-5">
                            <div class="flex items-center gap-2.5">
                                <div
                                    class="px-2.5 py-1 rounded-xl bg-navy text-primary text-[9px] font-black shadow-sm">
                                    M{{ match.match_no }}
                                </div>
                            </div>

                            <div v-if="match.status === 'finished' || match.winner_entry_id"
                                class="flex items-center gap-1.5 px-1 py-0.5 rounded-lg text-green-600">
                                <Icon icon="ph:check-circle-fill" class="text-[20px] sm:text-[24px]" />
                            </div>
                        </div>

                        <!-- Participants - PROMINENT DISPLAY -->
                        <div class="space-y-2 sm:space-y-3">
                            <div v-for="side in ['A', 'B']" :key="side"
                                class="flex items-center justify-between py-2.5 px-3 shadow-sm rounded-2xl transition-all border border-gray-50"
                                :class="[
                                    isWinner(match, side === 'A' ? match.entry_a_id : match.entry_b_id)
                                        ? 'bg-green-500/5 border-green-500/10'
                                        : 'bg-white border-transparent',
                                    selectedScoringMatch?.id === match.id && !isWinner(match, side === 'A' ? match.entry_a_id : match.entry_b_id) ? 'shadow-sm' : ''
                                ]">
                                <div class="flex items-center min-w-0 pr-2">
                                    <div class="flex flex-col min-w-0">
                                        <h4 class="text-xs font-black text-navy truncate tracking-tight leading-tight">
                                            {{ (side === 'A' ? match.entry_a_name : match.entry_b_name) || 'TBD' }}
                                        </h4>
                                    </div>
                                </div>
                                <div class="text-base font-black tabular-nums transition-all"
                                    :class="isWinner(match, side === 'A' ? match.entry_a_id : match.entry_b_id) ? 'text-green-600 scale-110' : 'text-navy/80'">
                                    {{ getMatchScore(match, side) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Active Match Scoring Panel -->
        <div class="lg:col-span-8 xl:col-span-9">
            <div v-if="selectedScoringMatch" class="space-y-6">
                <!-- Match Summary Header -->
                <div
                    class="bg-navy rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-12 flex flex-col items-center justify-center gap-6 sm:gap-8 text-white shadow-sm overflow-hidden relative border border-white/5">
                    <!-- Premium Background Layers -->
                    <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
                        <Icon icon="ph:target"
                            class="text-[300px] sm:text-[500px] absolute -right-32 -bottom-32 rotate-12" />
                    </div>
                    <div class="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent">
                    </div>
                    <div class="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/5 to-transparent">
                    </div>

                    <div
                        class="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 md:gap-20 w-full">
                        <!-- Side A View -->
                        <div
                            class="flex flex-row md:flex-col items-center gap-4 sm:gap-5 text-center group w-full md:w-auto px-4 md:px-0">
                            <div class="relative shrink-0">
                                <div
                                    class="absolute -inset-3 sm:-inset-4 bg-primary/20 rounded-[2rem] sm:rounded-[3rem] blur-xl sm:blur-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                </div>
                                <img :src="useImageOrDefault(selectedScoringMatch.entry_a_avatar || selectedScoringMatch.entry_a_photo, selectedScoringMatch.entry_a_name)"
                                    class="size-16 sm:size-24 rounded-[2rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-white/10 shadow-sm relative z-10" />
                                <div
                                    class="absolute -bottom-1 -left-1 z-20 size-6 sm:size-8 bg-navy border-2 border-primary rounded-lg sm:rounded-xl flex items-center justify-center text-[8px] sm:text-[10px] font-black text-primary shadow-sm">
                                    {{ selectedScoringMatch.entry_a_seed || '-' }}
                                </div>
                            </div>
                            <div class="space-y-0.5 sm:space-y-1 text-left md:text-center min-w-0 flex-1 md:flex-none">
                                <h4
                                    class="font-black text-base sm:text-2xl leading-tight truncate tracking-tight text-white">
                                    {{ selectedScoringMatch.entry_a_name || 'TBD' }}
                                </h4>
                                <p
                                    class="text-[8px] sm:text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-60">
                                    Archer A
                                </p>
                            </div>
                            <!-- Mobile Score Display A -->
                            <div
                                class="md:hidden text-3xl font-black text-primary drop-shadow-[0_0_15px_rgba(255,193,7,0.3)] tabular-nums">
                                {{ getMatchScore(selectedScoringMatch, 'A') }}
                            </div>
                        </div>

                        <!-- Central Scoreboard - DESKTOP ONLY (Score Display is handled above/below for mobile) -->
                        <div class="hidden md:flex flex-col items-center gap-5">
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
                                    class="group px-6 py-2 rounded-xl w-[100px] bg-primary text-navy font-black text-[10px] tracking-widest uppercase hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-primary/20 hover:-translate-y-0.5">
                                    <div class="flex-none">
                                        <Icon v-if="isEndingMatch" icon="ph:circle-notch-bold"
                                            class="animate-spin text-xs" />
                                        <Icon v-else icon="ph:flag-checkered-fill"
                                            class="group-hover:rotate-12 transition-transform text-xs" />
                                    </div>
                                    <span>{{ isEndingMatch ? 'Ending...' : 'Finish' }}</span>
                                </button>
                                <div v-else
                                    class="px-5 py-1.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                                    <div class="size-1 rounded-full bg-white/20 animate-pulse"></div>
                                    <span
                                        class="text-[9px] font-black tracking-[0.3em] text-white/30 uppercase">LIVE</span>
                                </div>
                            </div>
                        </div>

                        <!-- Mobile Header Mid (Target & Status) -->
                        <div class="md:hidden flex flex-col items-center gap-4 w-full">
                            <div
                                class="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[8px] font-black tracking-[0.3em] text-white/40 uppercase">
                                {{ getFullTargetName(selectedScoringMatch) }}
                            </div>
                            <div class="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent">
                            </div>
                        </div>

                        <!-- Side B View -->
                        <div
                            class="flex flex-row md:flex-col items-center gap-4 sm:gap-5 text-center group w-full md:w-auto px-4 md:px-0">
                            <!-- Mobile Score Display B -->
                            <div
                                class="md:hidden text-3xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] tabular-nums">
                                {{ getMatchScore(selectedScoringMatch, 'B') }}
                            </div>
                            <div class="relative shrink-0">
                                <div
                                    class="absolute -inset-3 sm:-inset-4 bg-white/10 rounded-[2rem] sm:rounded-[3rem] blur-xl sm:blur-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                </div>
                                <img :src="useImageOrDefault(selectedScoringMatch.entry_b_avatar || selectedScoringMatch.entry_b_photo, selectedScoringMatch.entry_b_name)"
                                    class="size-16 sm:size-24 rounded-[2rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-white/10 shadow-sm relative z-10" />
                                <div
                                    class="absolute -bottom-1 -right-1 z-20 size-6 sm:size-8 bg-navy border-2 border-white/20 rounded-lg sm:rounded-xl flex items-center justify-center text-[8px] sm:text-[10px] font-black text-white/40 shadow-sm">
                                    {{ selectedScoringMatch.entry_b_seed || '-' }}
                                </div>
                            </div>
                            <div class="space-y-0.5 sm:space-y-1 text-right md:text-center min-w-0 flex-1 md:flex-none">
                                <h4
                                    class="font-black text-base sm:text-2xl leading-tight truncate tracking-tight text-white">
                                    {{ selectedScoringMatch.entry_b_name || 'TBD' }}
                                </h4>
                                <p
                                    class="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.2em] opacity-40">
                                    Archer B
                                </p>
                            </div>
                        </div>

                        <!-- Mobile Match Finish Button -->
                        <div class="md:hidden w-full px-4 pt-4 border-t border-white/5">
                            <div v-if="selectedScoringMatch.winner_entry_id || selectedScoringMatch.status === 'finished'"
                                class="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2">
                                <Icon icon="ph:seal-check-fill" class="text-green-500 text-sm" />
                                <span class="text-[10px] font-black tracking-[0.3em] text-green-400 uppercase">MATCH
                                    FINISHED</span>
                            </div>
                            <button v-else-if="canEndMatch" @click="$emit('end-match')" :disabled="isEndingMatch"
                                class="w-full py-3.5 sm:py-4 rounded-xl bg-primary text-navy font-black text-[10px] sm:text-xs tracking-widest uppercase flex items-center justify-center gap-2 sm:gap-3 transition-all active:scale-[0.98]">
                                <Icon v-if="isEndingMatch" icon="ph:circle-notch-bold" class="animate-spin text-lg" />
                                <Icon v-else icon="ph:flag-checkered-fill" class="text-lg" />
                                <span>{{ isEndingMatch ? 'Ending...' : 'Finish Match' }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Main Input Dashboard -->
                <div
                    class="bg-white rounded-[2.5rem] sm:rounded-[3rem] border border-gray-100 shadow-sm p-4 sm:p-10 pb-20 lg:pb-10">
                    <!-- End Navigator -->
                    <div class="flex items-center justify-between mb-6 lg:mb-10 pb-4 sm:pb-6 border-b border-gray-100">
                        <div class="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 custom-scrollbar flex-1">
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
                            <!-- Shoot-off End (End 99) -->
                            <div v-if="showShootOff" @click="$emit('update:currentEnd', 99)"
                                class="flex flex-col items-center gap-2 cursor-pointer group ml-2 border-l border-slate-100 pl-4">
                                <span class="text-[10px] font-black tracking-[0.2em] transition-colors uppercase"
                                    :class="currentEnd === 99 ? 'text-orange-500' : 'text-orange-300 group-hover:text-orange-400'">Shoot-off</span>
                                <div class="size-10 sm:size-12 rounded-xl flex items-center justify-center text-xs sm:text-sm font-black transition-all relative"
                                    :class="currentEnd === 99 ? 'bg-orange-500 text-white shadow-sm ring-4 ring-orange-500/10' : 'bg-orange-50 text-orange-300 group-hover:bg-orange-100/50 group-hover:text-orange-400'">
                                    S
                                    <div v-if="currentEnd === 99"
                                        class="absolute -bottom-1 w-4 h-0.5 bg-white rounded-full">
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
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
                        <template v-for="side in ['A', 'B']" :key="side">
                            <div class="space-y-6 lg:space-y-8" :id="`scoring-card-${side}`">
                                <!-- Scoring Card -->
                                <div class="p-0.5 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-br transition-all duration-500"
                                    :class="activeSide === side ? 'from-primary/20 to-primary/5 shadow-sm' : 'from-transparent to-transparent opacity-60 lg:opacity-80'">
                                    <div class="p-5 sm:p-8 rounded-[1.9rem] sm:rounded-[2.4rem] border-2 transition-all duration-500 relative overflow-hidden group"
                                        :class="activeSide === side ? 'bg-white border-primary shadow-sm' : 'bg-slate-50 border-gray-100'"
                                        @click="$emit('update:activeSide', side)">

                                        <!-- Decorative Background -->
                                        <div v-if="activeSide === side"
                                            class="absolute -right-10 -bottom-10 size-24 sm:size-32 border-[100px] sm:border-[166px] border-primary/5 rounded-full pointer-events-none">
                                        </div>

                                        <!-- Result Summary Line -->
                                        <div class="flex justify-between items-center mb-4 lg:mb-6">
                                            <div class="flex items-center h-full gap-3">
                                                <div class="min-w-0">
                                                    <h4 class="text-sm sm:text-lg font-black text-navy truncate">
                                                        {{ side === 'A' ? selectedScoringMatch.entry_a_name :
                                                            (selectedScoringMatch.entry_b_name || 'TBD') }}
                                                    </h4>
                                                </div>
                                            </div>
                                            <div class="flex flex-col items-end">
                                                <div class="flex items-center gap-1 mb-1">
                                                    <div
                                                        class="px-1.5 py-0.5 rounded-md bg-gray-100 text-navy font-black text-[7px] sm:text-[8px] uppercase">
                                                        X:{{ calculateEndStats(selectedScoringMatch.id, currentEnd,
                                                            side).x }}
                                                    </div>
                                                    <div
                                                        class="px-1.5 py-0.5 rounded-md bg-gray-100 text-navy font-black text-[7px] sm:text-[8px] uppercase">
                                                        10:{{ calculateEndStats(selectedScoringMatch.id, currentEnd,
                                                            side).ten }}
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <span
                                                        class="text-[7px] sm:text-[8px] font-black text-gray-400 uppercase">SUM</span>
                                                    <span
                                                        class="text-lg sm:text-xl font-black text-navy tabular-nums">{{
                                                            calculateEndTotal(selectedScoringMatch.id, currentEnd, side)
                                                        }}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- ARROW SLOTS -->
                                        <div class="flex items-center justify-center gap-2 sm:gap-4">
                                            <div v-for="i in (currentEnd === 99 ? 1 : (bracket?.arrows_per_end || 3))"
                                                :key="i"
                                                class="size-12 sm:size-16 rounded-xl border-4 text-sm sm:text-xl font-black transition-all duration-300 cursor-pointer shrink-0 flex items-center justify-center relative group/box"
                                                :class="[
                                                    activeSide === side && (selectedArrowIndex === i - 1)
                                                        ? 'border-primary bg-white shadow-sm scale-110 z-20 border-solid'
                                                        : (getArrowScore(selectedScoringMatch.id, currentEnd, side, i) ? 'bg-slate-50 border-gray-100 border-solid' : 'bg-white border-dashed border-gray-100')
                                                ]" @click.stop="$emit('select-arrow-box', side, i - 1)">

                                                <Icon v-if="activeSide === side && (selectedArrowIndex === i - 1)"
                                                    icon="ph:caret-down-fill"
                                                    class="absolute -top-5 text-primary animate-bounce text-xs sm:text-sm" />

                                                <span class="text-navy">
                                                    {{ getArrowScore(selectedScoringMatch.id, currentEnd, side, i) }}
                                                </span>

                                                <div v-if="!getArrowScore(selectedScoringMatch.id, currentEnd, side, i) && !(activeSide === side && selectedArrowIndex === i - 1)"
                                                    class="size-1 rounded-full bg-slate-100">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- PREMIUM NUMERICAL KEYPAD - MOBILE: FIXED BOTTOM | DESKTOP: STATIC -->
                                <div v-if="activeSide === side"
                                    class="lg:animate-in lg:slide-in-from-top-4 duration-500 fade-in fixed lg:static bottom-0 left-0 w-full lg:w-auto bg-white lg:bg-transparent border-t lg:border-t-0 p-4 lg:p-0 lg:pt-2 z-[40] shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)] lg:shadow-none">
                                    <div class="max-w-xl mx-auto lg:max-w-none">
                                        <!-- Layout: 6 keys x 2 rows (X, 10, 9, 8, 7, 6 / 5, 4, 3, 2, 1, M) -->
                                        <div class="grid grid-cols-6 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 lg:mb-0">
                                            <button v-for="num in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'X', 'M']" :key="num"
                                                @click="$emit('add-score', num)"
                                                class="aspect-[4/3] lg:aspect-square rounded-xl sm:rounded-2xl text-xs sm:text-lg font-black shadow-sm transition-all flex items-center justify-center border-b-2 sm:border-b-4 active:border-b-0 active:translate-y-[2px] sm:active:translate-y-[4px] hover:-translate-y-0.5"
                                                :class="getScoreKeypadClass(num)">
                                                {{ num }}
                                            </button>

                                            <!-- Mobile Actions inline or below -->
                                            <div
                                                class="col-span-6 lg:col-span-4 grid grid-cols-3 gap-2 sm:gap-3 pt-2 lg:pt-4">
                                                <button @click="$emit('delete-last-arrow')"
                                                    class="col-span-1 h-10 sm:h-14 rounded-xl sm:rounded-2xl bg-white border-2 border-slate-100 text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm group">
                                                    <Icon icon="ph:backspace-bold"
                                                        class="text-lg sm:text-xl group-active:scale-90 transition-transform" />
                                                    <span
                                                        class="hidden sm:inline text-[9px] tracking-widest font-black uppercase">DEL</span>
                                                </button>
                                                <button @click="$emit('save-and-next')" :disabled="isSaving"
                                                    class="col-span-2 h-10 sm:h-14 rounded-xl sm:rounded-2xl bg-navy text-primary font-black flex items-center justify-center gap-2 shadow-sm shadow-navy/20 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 group">
                                                    <Icon v-if="isSaving" icon="ph:circle-notch-bold"
                                                        class="animate-spin text-lg sm:text-xl" />
                                                    <template v-else>
                                                        <span
                                                            class="text-[9px] sm:text-[10px] tracking-widest uppercase truncate">Simpan
                                                            Skor</span>
                                                        <Icon icon="ph:paper-plane-right-fill"
                                                            class="text-base sm:text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                    </template>
                                                </button>
                                            </div>
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
import { useImageOrDefault } from '~/composables/useImageHelper'

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
    canEndMatch: { type: Boolean, default: false },
    manualWinnerId: { type: String, default: null }
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

    // If we have detailed ends data, use it for live updates
    const m = props.matchEnds[match.id]
    let score = 0
    if (m) {
        if (isRecurve) score = calculateSetPoints(match.id, sideKey)
        else score = Object.values(m[sideKey] || {}).reduce((s, e) => {
            if (e.end_no === 99) return s // Don't include shoot-off in total score
            return s + (e.total || 0)
        }, 0) || 0
    } else {
        // Fallback to pre-calculated summary scores from match object
        if (isRecurve) score = (side === 'A' ? match.total_points_a : match.total_points_b) || 0
        else score = (side === 'A' ? match.total_score_a : match.total_score_b) || 0
    }

    // Shoot-off logic: Winner gets +1 point to total score
    const soA = m?.A?.[99]?.arrows?.[0]
    const soB = m?.B?.[99]?.arrows?.[0]

    if (soA && soB) {
        const getV = (v) => v === 'X' ? 11 : (v === 'M' ? 0 : parseInt(v) || 0)
        const vA = getV(soA)
        const vB = getV(soB)

        if (vA > vB) {
            if (side === 'A') score += 1
        } else if (vB > vA) {
            if (side === 'B') score += 1
        } else {
            // Tie in shootout - check manual selection
            const currentSideId = side === 'A' ? match.entry_a_id : match.entry_b_id
            if (props.manualWinnerId && props.manualWinnerId === currentSideId) {
                score += 1
            } else if (match.winner_entry_id === currentSideId && match.status === 'finished') {
                // Persistent winner check
                score += 1
            }
        }
    }

    return score
}

const showShootOff = computed(() => {
    if (!props.selectedScoringMatch) return false
    const match = props.selectedScoringMatch
    const m = props.matchEnds[match.id]
    if (!m) return false

    // 1. Show if already has shoot-off data
    const hasSoA = m.A?.[99]?.arrows?.some(a => a !== null && a !== '')
    const hasSoB = m.B?.[99]?.arrows?.some(a => a !== null && a !== '')
    if (hasSoA || hasSoB) return true

    // 2. Show if currently tied (base score)
    const isRecurve = props.bracket?.format === 'recurve_set'
    let baseA = 0, baseB = 0
    if (isRecurve) {
        baseA = calculateSetPoints(match.id, 'A')
        baseB = calculateSetPoints(match.id, 'B')
    } else {
        baseA = Object.values(m.A || {}).reduce((s, e) => e.end_no !== 99 ? s + (e.total || 0) : s, 0)
        baseB = Object.values(m.B || {}).reduce((s, e) => e.end_no !== 99 ? s + (e.total || 0) : s, 0)
    }

    // Check if match is finished (all regular ends)
    const totalEnds = props.bracket?.ends_per_match || 5
    const arrowsPerEnd = props.bracket?.arrows_per_end || 3
    for (let i = 1; i <= totalEnds; i++) {
        if (m.A?.[i]?.arrows?.filter(a => a !== null && a !== '').length !== arrowsPerEnd) return false
        if (m.B?.[i]?.arrows?.filter(a => a !== null && a !== '').length !== arrowsPerEnd) return false
    }

    return baseA === baseB
})

const isTied = computed(() => {
    if (!showShootOff.value) return false
    const match = props.selectedScoringMatch
    const m = props.matchEnds[match.id]

    // If no shoot-off arrows yet -> it IS tied
    const soA = m.A?.[99]?.arrows?.[0]
    const soB = m.B?.[99]?.arrows?.[0]
    if (!soA || !soB) return true

    // If shoot-off arrows exist, check if THEY are tied
    // Convert X/M to values for comparison
    const getVal = (v) => v === 'X' ? 10 : (v === 'M' ? 0 : parseInt(v) || 0)
    return getVal(soA) === getVal(soB)
})

const calculateSetPoints = (matchId, side) => {
    const m = props.matchEnds[matchId]
    if (!m) return 0

    let setPointsA = 0
    let setPointsB = 0

    const totalEnds = props.bracket?.ends_per_match || 5
    const arrowsPerEnd = props.bracket?.arrows_per_end || 3

    for (let i = 1; i <= totalEnds; i++) {
        const endA = m.A?.[i]
        const endB = m.B?.[i]
        if (!endA || !endB || endA.total === undefined || endB.total === undefined) continue

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
    if (match.target_name) return match.target_name.startsWith('Target') ? match.target_name : `${match.target_name}`
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
