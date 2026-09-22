<template>
    <div class="space-y-6">
        <!-- Top Scoring Stats & Match Switcher Bar -->
        <div class="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-2xs space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <!-- Left: Title & Live Summary -->
                <div class="flex items-center gap-3">
                    <div class="size-10 rounded-xl bg-navy text-primary flex items-center justify-center shadow-2xs shrink-0 font-black">
                        <Icon icon="ph:pencil-circle-bold" class="text-xl" />
                    </div>
                    <div>
                        <h3 class="text-base sm:text-lg font-black text-navy leading-tight">
                            {{ t('event_elimination.input_scoring') }}
                        </h3>
                        <div class="text-xs text-slate-500 font-medium mt-0.5">
                            {{ t('event_elimination.scoring_subtitle') }}
                        </div>
                    </div>
                </div>

                <!-- Right: Quick Match Search / Filter -->
                <div class="flex items-center gap-2">
                    <div class="relative w-full sm:w-64">
                        <input v-model="searchQuery" type="text"
                            :placeholder="t('event_elimination.search_archer_match')"
                            class="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-navy placeholder:text-slate-400 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                        <Icon icon="ph:magnifying-glass-bold" class="absolute left-3 top-3 text-slate-400 text-sm" />
                        <button v-if="searchQuery" @click="searchQuery = ''"
                            class="absolute right-2.5 top-2.5 size-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px] hover:bg-slate-300">
                            <Icon icon="ph:x-bold" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Quick Match Switcher Chips -->
            <div class="flex items-center gap-2.5 overflow-x-auto pb-1 no-scrollbar border-t border-slate-100 pt-3">
                <button v-for="match in filteredRoundMatches" :key="match.id" type="button"
                    @click="onSelectMatch(match)"
                    :class="[
                        'px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2.5 cursor-pointer shrink-0 border select-none shadow-2xs',
                        selectedScoringMatch?.id === match.id
                            ? 'bg-navy text-primary border-navy ring-2 ring-primary/20 font-black'
                            : (isByeMatch(match)
                                ? 'bg-amber-50/80 text-amber-900 border-amber-200/80 hover:bg-amber-100'
                                : (match.winner_entry_id || match.status === 'finished'
                                    ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'))
                    ]">
                    <!-- Match Stage & No Badge: e.g. Semi M1, Final M3, etc. -->
                    <span :class="[
                        'px-2 py-0.5 rounded-lg text-xs font-black font-mono flex items-center gap-1',
                        selectedScoringMatch?.id === match.id
                            ? 'bg-primary text-navy'
                            : (isByeMatch(match)
                                ? 'bg-amber-200 text-amber-950'
                                : (match.winner_entry_id || match.status === 'finished' ? 'bg-emerald-200/80 text-emerald-900' : 'bg-slate-200 text-slate-800'))
                    ]">
                        <span class="text-[9px] uppercase tracking-wider font-bold opacity-80">{{ getMatchStageBadge(match, bracket?.bracket_size).shortLabel }}</span>
                        <span>M{{ match.match_no }}</span>
                    </span>

                    <!-- BYE Badge if match is a BYE -->
                    <span v-if="isByeMatch(match)"
                        class="px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider flex items-center gap-1"
                        :class="selectedScoringMatch?.id === match.id ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300/60'">
                        <Icon icon="ph:fast-forward-fill" class="text-xs" />
                        <span>BYE</span>
                    </span>

                    <!-- Target Tag if any (only if not BYE) -->
                    <span v-else-if="match.target_name || match.board_code"
                        class="text-[11px] font-mono font-bold opacity-80">
                        {{ match.target_name ? (match.target_name.startsWith('Target') ? match.target_name : `T.${match.target_name}`) : match.board_code }}
                    </span>

                    <!-- Archer vs Archer Name -->
                    <span class="text-xs truncate max-w-[140px] sm:max-w-[200px]">
                        <template v-if="isByeMatch(match)">
                            {{ (getAdvancingArcher(match)?.name || match.entry_a_name || 'Archer') }} (BYE)
                        </template>
                        <template v-else>
                            {{ match.entry_a_name?.split(' ')[0] || 'TBD' }} vs {{ match.entry_b_name?.split(' ')[0] || 'TBD' }}
                        </template>
                    </span>

                    <!-- Finished / BYE Check Icon -->
                    <Icon v-if="match.winner_entry_id || match.status === 'finished' || isByeMatch(match)"
                        icon="ph:check-circle-fill"
                        :class="selectedScoringMatch?.id === match.id ? 'text-primary' : (isByeMatch(match) ? 'text-amber-600' : 'text-emerald-600')"
                        class="text-sm shrink-0" />
                </button>
            </div>
        </div>

        <!-- BYE / Walkover Match Arena View -->
        <div v-if="selectedScoringMatch && isByeMatch(selectedScoringMatch)" class="space-y-6">
            <div class="bg-gradient-to-br from-navy via-navy to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-md overflow-hidden relative border border-white/10">
                <div class="absolute inset-0 opacity-[0.04] pointer-events-none">
                    <Icon icon="ph:trophy" class="text-[340px] absolute -right-16 -bottom-16 rotate-12" />
                </div>
                <div class="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>

                <div class="relative z-10 space-y-6">
                    <!-- Top Match Meta Bar -->
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                        <div class="flex items-center gap-2">
                            <div class="px-2.5 py-1 rounded-lg bg-primary text-navy font-black text-xs">
                                {{ t('event_elimination.match_label', { no: selectedScoringMatch?.match_no || '' }) }}
                            </div>
                            <span class="px-3 py-1 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black flex items-center gap-1.5">
                                <Icon icon="ph:fast-forward-fill" class="text-amber-400 text-sm" />
                                <span>{{ t('event_elimination.bye_badge') }}</span>
                            </span>
                            <span class="px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 text-xs font-bold font-mono">
                                {{ t('event_elimination.bye_no_target_needed') }}
                            </span>
                        </div>

                        <!-- Status Badge / Action -->
                        <div class="flex items-center gap-2">
                            <span v-if="selectedScoringMatch?.winner_entry_id || selectedScoringMatch?.status === 'finished'"
                                class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black flex items-center gap-1.5">
                                <Icon icon="ph:seal-check-fill" class="text-emerald-400 text-sm" />
                                <span>{{ t('event_elimination.done') }}</span>
                            </span>
                            <button v-else type="button" @click="$emit('end-match')" :disabled="isEndingMatch"
                                class="px-4 py-1.5 rounded-xl bg-primary text-navy font-black text-xs hover:bg-yellow-300 transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer">
                                <Icon :icon="isEndingMatch ? 'ph:circle-notch-bold' : 'ph:fast-forward-fill'" :class="{ 'animate-spin': isEndingMatch }" />
                                <span>{{ isEndingMatch ? t('event_elimination.processing') : t('event_elimination.bye_advance_button') }}</span>
                            </button>
                        </div>
                    </div>

                    <!-- Archer Spotlight Arena -->
                    <div class="flex flex-col sm:flex-row items-center sm:items-stretch gap-6 bg-white/5 rounded-2xl p-5 sm:p-7 border border-white/10">
                        <div class="relative shrink-0 flex flex-col items-center">
                            <div class="relative">
                                <img :src="useImageOrDefault(getAdvancingArcher(selectedScoringMatch)?.avatar, getAdvancingArcher(selectedScoringMatch)?.name)"
                                    class="size-20 sm:size-24 rounded-3xl border-3 border-primary ring-4 ring-primary/20 object-cover shadow-lg" />
                                <div v-if="getAdvancingArcher(selectedScoringMatch)?.seed"
                                    class="absolute -left-2 -bottom-1 min-w-[22px] h-5 px-1.5 bg-navy text-primary text-[10px] font-black rounded-md flex items-center justify-center border border-white shadow-md">
                                    Seed #{{ getAdvancingArcher(selectedScoringMatch)?.seed }}
                                </div>
                                <div class="absolute -top-2 -right-2 size-7 bg-primary text-navy rounded-full flex items-center justify-center text-sm shadow-md border-2 border-navy">
                                    <Icon icon="ph:crown-simple-fill" />
                                </div>
                            </div>
                        </div>

                        <div class="flex-1 text-center sm:text-left flex flex-col justify-center space-y-2">
                            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-black w-fit mx-auto sm:mx-0">
                                <Icon icon="ph:sparkle-fill" class="text-xs text-amber-300" />
                                <span>{{ t('event_elimination.bye_already_advanced') }}</span>
                            </div>
                            <h3 class="text-xl sm:text-2xl font-black text-white leading-tight">
                                {{ getAdvancingArcher(selectedScoringMatch)?.name || selectedScoringMatch?.entry_a_name || 'Archer' }}
                            </h3>
                            <div class="text-xs sm:text-sm text-slate-300 font-medium">
                                {{ getAdvancingArcher(selectedScoringMatch)?.club || selectedScoringMatch?.entry_a_club || t('event_elimination.independent') }}
                            </div>
                        </div>

                        <div class="sm:border-l sm:border-white/10 sm:pl-6 flex flex-col items-center justify-center text-center shrink-0 min-w-[140px]">
                            <div class="text-[10px] font-bold text-slate-400 tracking-wider mb-1">
                                Lawan Pertandingan
                            </div>
                            <div class="px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-slate-300 font-black text-xs flex items-center gap-1.5">
                                <Icon icon="ph:user-minus-bold" class="text-slate-400 text-sm" />
                                <span>BYE (Tanpa Lawan)</span>
                            </div>
                            <div class="text-[10px] text-slate-400 mt-1.5 font-medium">
                                Free Pass Round
                            </div>
                        </div>
                    </div>

                    <!-- World Archery Official Rules Explanatory Alert -->
                    <div class="bg-amber-500/10 border border-amber-400/20 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                        <div class="size-8 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon icon="ph:info-bold" class="text-base" />
                        </div>
                        <div class="space-y-1">
                            <h5 class="text-xs sm:text-sm font-black text-amber-300">
                                {{ t('event_elimination.bye_walkover_title') }}
                            </h5>
                            <div class="text-xs text-amber-100/80 leading-relaxed">
                                {{ t('event_elimination.bye_walkover_explanation') }}
                                <span class="font-bold text-white ml-1">
                                    {{ t('event_elimination.bye_no_scoring_needed') }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Scoring Interface: 2-Column Layout -->
        <div v-else-if="selectedScoringMatch" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            <!-- Left Column: Match Arena & Ends Breakdown (Span 7/8) -->
            <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6"
                :class="!isMatchFinished ? 'pb-[290px] lg:pb-0' : ''">

                <!-- 1. Battle Summary Header Card -->
                <div class="bg-navy rounded-3xl p-4 sm:p-6 text-white shadow-2xs overflow-hidden relative border border-navy/20">
                    <!-- Subtle Target Watermark Pattern -->
                    <div class="absolute inset-0 opacity-[0.05] pointer-events-none">
                        <Icon icon="ph:target" class="text-[260px] sm:text-[340px] absolute -right-24 -bottom-24 rotate-12" />
                    </div>

                    <div class="relative z-10 space-y-4 sm:space-y-5">
                        <!-- Top Bar: Match No, Target & Status Actions -->
                        <div class="flex flex-wrap items-center justify-between gap-2.5 border-b border-white/10 pb-3">
                            <div class="flex items-center gap-2 flex-wrap">
                                <div class="px-2.5 py-1 rounded-lg bg-primary text-navy font-black text-xs flex items-center gap-1.5 shadow-sm">
                                    <Icon icon="ph:trophy-bold" class="text-xs" />
                                    <span>{{ getMatchStageBadge(selectedScoringMatch, bracket?.bracket_size).label }} • Match {{ selectedScoringMatch?.match_no }}</span>
                                </div>
                                <div class="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 font-mono text-xs font-bold border border-white/15">
                                    {{ getFullTargetName(selectedScoringMatch) }}
                                </div>
                                <span class="px-2.5 py-1 rounded-lg bg-white/10 text-primary text-xs font-bold font-mono">
                                    {{ bracket?.format === 'recurve_set' ? t('event_elimination.set_system') : t('event_elimination.total_score_format') }}
                                </span>
                            </div>

                            <!-- Match Status Action Buttons -->
                            <div class="flex items-center gap-2">
                                <div v-if="selectedScoringMatch?.winner_entry_id || selectedScoringMatch?.status === 'finished'"
                                    class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black flex items-center gap-1.5">
                                        <Icon icon="ph:seal-check-fill" class="text-emerald-400 text-sm" />
                                        <span>{{ t('event_elimination.done') }}</span>
                                    </span>
                                    <button type="button" @click="$emit('reset-match')" :disabled="isResetting"
                                        class="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-400/30 text-xs font-bold transition-all flex items-center gap-1 active:scale-95 cursor-pointer"
                                        :title="t('event_elimination.confirm_reset_match')">
                                        <Icon :icon="isResetting ? 'ph:circle-notch-bold' : 'ph:lock-open-bold'" :class="{ 'animate-spin': isResetting }" />
                                        <span>{{ t('event_elimination.reset') }}</span>
                                    </button>
                                </div>

                                <button v-else-if="canEndMatch" type="button" @click="$emit('end-match')" :disabled="isEndingMatch"
                                    class="px-4 py-1.5 rounded-xl bg-primary text-navy font-black text-xs hover:bg-yellow-300 transition-all shadow-xs flex items-center gap-1.5 active:scale-95 cursor-pointer">
                                    <Icon :icon="isEndingMatch ? 'ph:circle-notch-bold' : 'ph:flag-checkered-fill'" :class="{ 'animate-spin': isEndingMatch }" />
                                    <span>{{ isEndingMatch ? t('event_elimination.processing') : t('event_elimination.end_match') }}</span>
                                </button>
                                <span v-else class="px-3 py-1 rounded-lg bg-white/10 text-slate-300 text-xs font-bold flex items-center gap-1.5">
                                    <span class="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>{{ t('event_elimination.live_match') }}</span>
                                </span>
                            </div>
                        </div>

                        <!-- Duel Display: Archer A vs Archer B -->
                        <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                            <!-- Side A Archer Profile -->
                            <div @click="$emit('update:activeSide', 'A')"
                                class="flex items-center gap-3 min-w-0 p-2 sm:p-0 rounded-2xl transition-all cursor-pointer"
                                :class="activeSide === 'A' ? 'bg-white/10 sm:bg-transparent ring-1 ring-primary/40 sm:ring-0' : 'opacity-80 sm:opacity-85 hover:opacity-100'">
                                <div class="relative shrink-0">
                                    <img :src="useImageOrDefault(selectedScoringMatch?.entry_a_avatar || selectedScoringMatch?.entry_a_photo, selectedScoringMatch?.entry_a_name)"
                                        class="size-12 sm:size-14 rounded-2xl border-2 object-cover"
                                        :class="isWinner(selectedScoringMatch, selectedScoringMatch?.entry_a_id) ? 'border-primary ring-2 ring-primary/30' : (activeSide === 'A' ? 'border-primary ring-2 ring-primary/30' : 'border-white/20')" />
                                    <div v-if="selectedScoringMatch?.entry_a_seed"
                                        class="absolute -left-1.5 -bottom-1 min-w-[16px] h-4 px-1 bg-navy text-primary text-[8px] font-black rounded flex items-center justify-center border border-white shadow-xs">
                                        {{ selectedScoringMatch?.entry_a_seed }}
                                    </div>
                                    <div v-if="isWinner(selectedScoringMatch, selectedScoringMatch?.entry_a_id)"
                                        class="absolute -top-1.5 -right-1.5 size-5 bg-primary text-navy rounded-full flex items-center justify-center text-[10px] shadow-xs border border-white">
                                        <Icon icon="ph:crown-simple-fill" />
                                    </div>
                                </div>
                                <div class="min-w-0 flex-1">
                                    <div class="flex items-center gap-1.5">
                                        <span class="text-[10px] font-black tracking-wider text-primary">{{ t('event_elimination.side_a') }}</span>
                                        <span v-if="activeSide === 'A'" class="size-1.5 rounded-full bg-primary animate-pulse"></span>
                                    </div>
                                    <h4 class="text-sm sm:text-base font-black text-white truncate leading-tight">
                                        {{ selectedScoringMatch?.entry_a_name || 'TBD' }}
                                    </h4>
                                    <div class="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                                        {{ selectedScoringMatch?.entry_a_club || t('event_elimination.independent') }}
                                    </div>
                                </div>
                            </div>

                            <!-- Live Center Score Display -->
                            <div class="flex sm:flex-col items-center justify-between sm:justify-center px-4 py-2.5 rounded-2xl bg-white/10 border border-white/15 text-center min-w-[100px] sm:min-w-[120px]">
                                <div class="text-[10px] font-black tracking-wider text-slate-300">
                                    {{ bracket?.format === 'recurve_set' ? t('event_elimination.set_points_label') : t('event_elimination.total_score_label') }}
                                </div>
                                <div class="flex items-center gap-2 text-2xl sm:text-3xl font-black font-mono tabular-nums leading-none">
                                    <span :class="getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') || isWinner(selectedScoringMatch, selectedScoringMatch?.entry_a_id) ? 'text-primary font-black' : 'text-white'">
                                        {{ getMatchScore(selectedScoringMatch, 'A') }}
                                    </span>
                                    <span class="text-white/40">-</span>
                                    <span :class="getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') || isWinner(selectedScoringMatch, selectedScoringMatch?.entry_b_id) ? 'text-primary font-black' : 'text-white'">
                                        {{ getMatchScore(selectedScoringMatch, 'B') }}
                                    </span>
                                </div>
                                <div v-if="getShootOffSummary(selectedScoringMatch)" class="mt-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 inline-flex items-center gap-1">
                                    <span>S.O. {{ getShootOffSummary(selectedScoringMatch) }}</span>
                                </div>
                            </div>

                            <!-- Side B Archer Profile -->
                            <div @click="$emit('update:activeSide', 'B')"
                                class="flex items-center justify-between sm:justify-end gap-3 min-w-0 p-2 sm:p-0 rounded-2xl transition-all cursor-pointer text-left sm:text-right"
                                :class="activeSide === 'B' ? 'bg-white/10 sm:bg-transparent ring-1 ring-primary/40 sm:ring-0' : 'opacity-80 sm:opacity-85 hover:opacity-100'">
                                <div class="min-w-0 flex-1 order-2 sm:order-1">
                                    <div class="flex items-center justify-start sm:justify-end gap-1.5">
                                        <span v-if="activeSide === 'B'" class="size-1.5 rounded-full bg-primary animate-pulse"></span>
                                        <span class="text-[10px] font-black tracking-wider text-primary">{{ t('event_elimination.side_b') }}</span>
                                    </div>
                                    <h4 class="text-sm sm:text-base font-black text-white truncate leading-tight">
                                        {{ selectedScoringMatch?.entry_b_name || (selectedScoringMatch?.is_bye ? 'BYE' : 'TBD') }}
                                    </h4>
                                    <div class="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                                        {{ selectedScoringMatch?.entry_b_club || t('event_elimination.independent') }}
                                    </div>
                                </div>
                                <div class="relative shrink-0 order-1 sm:order-2">
                                    <img :src="useImageOrDefault(selectedScoringMatch?.entry_b_avatar || selectedScoringMatch?.entry_b_photo, selectedScoringMatch?.entry_b_name)"
                                        class="size-12 sm:size-14 rounded-2xl border-2 object-cover"
                                        :class="isWinner(selectedScoringMatch, selectedScoringMatch?.entry_b_id) ? 'border-primary ring-2 ring-primary/30' : (activeSide === 'B' ? 'border-primary ring-2 ring-primary/30' : 'border-white/20')" />
                                    <div v-if="selectedScoringMatch?.entry_b_seed"
                                        class="absolute -left-1.5 -bottom-1 min-w-[16px] h-4 px-1 bg-navy text-primary text-[8px] font-black rounded flex items-center justify-center border border-white shadow-xs">
                                        {{ selectedScoringMatch?.entry_b_seed }}
                                    </div>
                                    <div v-if="isWinner(selectedScoringMatch, selectedScoringMatch?.entry_b_id)"
                                        class="absolute -top-1.5 -right-1.5 size-5 bg-primary text-navy rounded-full flex items-center justify-center text-[10px] shadow-xs border border-white">
                                        <Icon icon="ph:crown-simple-fill" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 2. End Navigation & Score Card Matrix -->
                <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-6 space-y-5">
                    <!-- End Stepper Switcher Bar -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                            <button v-for="endNo in (bracket?.ends_per_match || 5)" :key="endNo"
                                type="button"
                                @click="$emit('update:currentEnd', endNo)"
                                :class="[
                                    'px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs',
                                    currentEnd === endNo
                                        ? 'bg-navy text-primary ring-2 ring-navy/10'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-navy'
                                ]">
                                <Icon icon="ph:arrow-clockwise-bold" class="text-xs" />
                                <span>End {{ endNo }}</span>
                                <span v-if="isEndCompleted(selectedScoringMatch?.id, endNo)"
                                    class="size-1.5 rounded-full bg-emerald-500"></span>
                            </button>

                            <!-- Shoot-off Tab -->
                            <button v-if="showShootOff" type="button"
                                @click="$emit('update:currentEnd', 99)"
                                :class="[
                                    'px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ml-1 shrink-0 shadow-2xs',
                                    currentEnd === 99
                                        ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-500/20'
                                        : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                ]">
                                <Icon icon="ph:lightning-bold" class="text-xs" />
                                <span>{{ t('event_elimination.shoot_off_badge') }}</span>
                            </button>
                        </div>

                        <!-- Side Switcher Toggle Buttons -->
                        <div class="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 self-start sm:self-center">
                            <button type="button" @click="$emit('update:activeSide', 'A')"
                                :class="[
                                    'px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer',
                                    activeSide === 'A' ? 'bg-navy text-primary shadow-2xs' : 'text-slate-600 hover:text-navy'
                                ]">
                                {{ t('event_elimination.side_a') }}
                            </button>
                            <button type="button" @click="$emit('update:activeSide', 'B')"
                                :class="[
                                    'px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer',
                                    activeSide === 'B' ? 'bg-navy text-primary shadow-2xs' : 'text-slate-600 hover:text-navy'
                                ]">
                                {{ t('event_elimination.side_b') }}
                            </button>
                        </div>
                    </div>

                    <!-- 3. Active End Arrow Scoring Boxes (Face-to-Face Dual Grid) -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <!-- Side A Arrow Box -->
                        <div class="rounded-2xl p-4 sm:p-5 transition-all cursor-pointer select-none space-y-3"
                            :class="[
                                activeSide === 'A'
                                    ? 'bg-primary/5 border-2 border-navy shadow-xs ring-2 ring-navy/10'
                                    : 'bg-slate-50 border border-slate-200/90 hover:border-slate-300'
                            ]"
                            @click="$emit('update:activeSide', 'A')">
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 min-w-0">
                                    <span class="px-2 py-0.5 rounded-md bg-navy text-primary text-[10px] font-black shrink-0">{{ t('event_elimination.side_a') }}</span>
                                    <span class="text-xs font-black text-navy truncate">{{ selectedScoringMatch?.entry_a_name || 'TBD' }}</span>
                                </div>
                                <span class="text-xs font-black font-mono text-navy bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs shrink-0">
                                    {{ calculateEndTotal(selectedScoringMatch?.id, currentEnd, 'A') }} pts
                                </span>
                            </div>

                            <!-- Target Face Colored Arrow Rings -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div v-for="i in (currentEnd === 99 ? 1 : (bracket?.arrows_per_end || 3))" :key="i"
                                    @click.stop="!isMatchFinished && onSelectArrow('A', i - 1)"
                                    :class="[
                                        'size-11 sm:size-12 rounded-xl flex items-center justify-center text-sm sm:text-base font-black cursor-pointer transition-all duration-150 relative select-none font-mono',
                                        activeSide === 'A' && selectedArrowIndex === i - 1
                                            ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-white border-2 border-amber-500 scale-105 z-10 shadow-xs'
                                            : 'border',
                                        getArrowRingClass(getArrowScore(selectedScoringMatch?.id, currentEnd, 'A', i))
                                    ]">
                                    <span v-if="getArrowScore(selectedScoringMatch?.id, currentEnd, 'A', i)">{{ getArrowScore(selectedScoringMatch?.id, currentEnd, 'A', i) }}</span>
                                    <div v-if="activeSide === 'A' && selectedArrowIndex === i - 1"
                                        class="absolute -top-1 -right-1 size-2.5 bg-amber-500 rounded-full border border-white shadow-xs"></div>
                                    <div v-if="!getArrowScore(selectedScoringMatch?.id, currentEnd, 'A', i) && !(activeSide === 'A' && selectedArrowIndex === i - 1)"
                                        class="size-1.5 rounded-full bg-slate-300"></div>
                                </div>

                                <div class="ml-auto text-right font-mono text-xs">
                                    <div class="text-[10px] font-bold text-slate-400">Stats</div>
                                    <div class="font-black text-slate-700">
                                        X:{{ calculateEndStats(selectedScoringMatch?.id, currentEnd, 'A').x }} | 10:{{ calculateEndStats(selectedScoringMatch?.id, currentEnd, 'A').ten }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Side B Arrow Box -->
                        <div class="rounded-2xl p-4 sm:p-5 transition-all cursor-pointer select-none space-y-3"
                            :class="[
                                activeSide === 'B'
                                    ? 'bg-primary/5 border-2 border-navy shadow-xs ring-2 ring-navy/10'
                                    : 'bg-slate-50 border border-slate-200/90 hover:border-slate-300'
                            ]"
                            @click="$emit('update:activeSide', 'B')">
                            
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 min-w-0">
                                    <span class="px-2 py-0.5 rounded-md bg-navy text-primary text-[10px] font-black shrink-0">{{ t('event_elimination.side_b') }}</span>
                                    <span class="text-xs font-black text-navy truncate">{{ selectedScoringMatch?.entry_b_name || (selectedScoringMatch?.is_bye ? 'BYE' : 'TBD') }}</span>
                                </div>
                                <span class="text-xs font-black font-mono text-navy bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs shrink-0">
                                    {{ calculateEndTotal(selectedScoringMatch?.id, currentEnd, 'B') }} pts
                                </span>
                            </div>

                            <!-- Target Face Colored Arrow Rings -->
                            <div class="flex items-center gap-2 sm:gap-2.5">
                                <div v-for="i in (currentEnd === 99 ? 1 : (bracket?.arrows_per_end || 3))" :key="i"
                                    @click.stop="!isMatchFinished && onSelectArrow('B', i - 1)"
                                    :class="[
                                        'size-11 sm:size-12 rounded-xl flex items-center justify-center text-sm sm:text-base font-black cursor-pointer transition-all duration-150 relative select-none font-mono',
                                        activeSide === 'B' && selectedArrowIndex === i - 1
                                            ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-white border-2 border-amber-500 scale-105 z-10 shadow-xs'
                                            : 'border',
                                        getArrowRingClass(getArrowScore(selectedScoringMatch?.id, currentEnd, 'B', i))
                                    ]">
                                    <span v-if="getArrowScore(selectedScoringMatch?.id, currentEnd, 'B', i)">{{ getArrowScore(selectedScoringMatch?.id, currentEnd, 'B', i) }}</span>
                                    <div v-if="activeSide === 'B' && selectedArrowIndex === i - 1"
                                        class="absolute -top-1 -right-1 size-2.5 bg-amber-500 rounded-full border border-white shadow-xs"></div>
                                    <div v-if="!getArrowScore(selectedScoringMatch?.id, currentEnd, 'B', i) && !(activeSide === 'B' && selectedArrowIndex === i - 1)"
                                        class="size-1.5 rounded-full bg-slate-300"></div>
                                </div>

                                <div class="ml-auto text-right font-mono text-xs">
                                    <div class="text-[10px] font-bold text-slate-400">Stats</div>
                                    <div class="font-black text-slate-700">
                                        X:{{ calculateEndStats(selectedScoringMatch?.id, currentEnd, 'B').x }} | 10:{{ calculateEndStats(selectedScoringMatch?.id, currentEnd, 'B').ten }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. Ends Breakdown Summary (Desktop Table & Mobile Clean Cards) -->
                    <div class="border border-slate-200/90 rounded-2xl overflow-hidden bg-white shadow-2xs">
                        <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                            <span class="text-xs font-black text-navy flex items-center gap-1.5">
                                <Icon icon="ph:table-bold" class="text-navy text-sm" />
                                <span>{{ t('event_elimination.ends_breakdown_title') }}</span>
                            </span>
                            <span class="text-[11px] font-bold text-slate-500 hidden sm:inline">
                                {{ bracket?.format === 'recurve_set' ? t('event_elimination.ends_breakdown_desc') : t('event_elimination.accumulated_score') }}
                            </span>
                        </div>

                        <!-- Desktop / Tablet Table View -->
                        <div class="hidden md:block overflow-x-auto">
                            <table class="w-full text-xs text-left">
                                <thead class="bg-slate-100/80 text-slate-700 font-black border-b border-slate-200">
                                    <tr>
                                        <th class="py-2.5 px-4">{{ t('event_elimination.end_header') }}</th>
                                        <th class="py-2.5 px-4 text-center">{{ t('event_elimination.side_a_arrows') }}</th>
                                        <th class="py-2.5 px-4 text-center">{{ t('event_elimination.score_a') }}</th>
                                        <th v-if="bracket?.format === 'recurve_set'" class="py-2.5 px-4 text-center">{{ t('event_elimination.set_pts_a') }}</th>
                                        <th class="py-2.5 px-4 text-center">VS</th>
                                        <th v-if="bracket?.format === 'recurve_set'" class="py-2.5 px-4 text-center">{{ t('event_elimination.set_pts_b') }}</th>
                                        <th class="py-2.5 px-4 text-center">{{ t('event_elimination.score_b') }}</th>
                                        <th class="py-2.5 px-4 text-center">{{ t('event_elimination.side_b_arrows') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 font-medium">
                                    <tr v-for="eNum in (bracket?.ends_per_match || 5)" :key="eNum"
                                        class="hover:bg-slate-50 transition-colors"
                                        :class="currentEnd === eNum ? 'bg-amber-50/40' : ''">
                                        <td class="py-2.5 px-4 font-black text-navy">End {{ eNum }}</td>
                                        <td class="py-2.5 px-4 text-center font-mono font-bold">
                                            {{ formatArrows(selectedScoringMatch?.id, eNum, 'A') }}
                                        </td>
                                        <td class="py-2.5 px-4 text-center font-black font-mono text-slate-900">
                                            {{ calculateEndTotal(selectedScoringMatch?.id, eNum, 'A') || 0 }}
                                        </td>
                                        <td v-if="bracket?.format === 'recurve_set'" class="py-2.5 px-4 text-center font-black">
                                            <span class="px-2 py-0.5 rounded font-mono"
                                                :class="getEndSetPointClass(selectedScoringMatch?.id, eNum, 'A')">
                                                {{ getEndSetPoint(selectedScoringMatch?.id, eNum, 'A') }}
                                            </span>
                                        </td>
                                        <td class="py-2.5 px-4 text-center font-bold text-slate-400">•</td>
                                        <td v-if="bracket?.format === 'recurve_set'" class="py-2.5 px-4 text-center font-black">
                                            <span class="px-2 py-0.5 rounded font-mono"
                                                :class="getEndSetPointClass(selectedScoringMatch?.id, eNum, 'B')">
                                                {{ getEndSetPoint(selectedScoringMatch?.id, eNum, 'B') }}
                                            </span>
                                        </td>
                                        <td class="py-2.5 px-4 text-center font-black font-mono text-slate-900">
                                            {{ calculateEndTotal(selectedScoringMatch?.id, eNum, 'B') || 0 }}
                                        </td>
                                        <td class="py-2.5 px-4 text-center font-mono font-bold">
                                            {{ formatArrows(selectedScoringMatch?.id, eNum, 'B') }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- Mobile Card List View (No Horizontal Overflow!) -->
                        <div class="md:hidden divide-y divide-slate-100 p-3 space-y-2.5">
                            <div v-for="eNum in (bracket?.ends_per_match || 5)" :key="eNum"
                                @click="$emit('update:currentEnd', eNum)"
                                :class="[
                                    'p-3 rounded-xl border transition-all cursor-pointer space-y-2',
                                    currentEnd === eNum
                                        ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
                                ]">
                                <!-- End Header & Set Point / Result Badge -->
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-black text-navy flex items-center gap-1.5">
                                        <span>End {{ eNum }}</span>
                                        <span v-if="currentEnd === eNum" class="px-1.5 py-0.2 rounded bg-navy text-primary text-[9px] font-black">Aktif</span>
                                    </span>
                                    <div v-if="bracket?.format === 'recurve_set'" class="flex items-center gap-1 text-[11px] font-mono font-black">
                                        <span class="px-2 py-0.5 rounded" :class="getEndSetPointClass(selectedScoringMatch?.id, eNum, 'A')">
                                            {{ getEndSetPoint(selectedScoringMatch?.id, eNum, 'A') }}
                                        </span>
                                        <span class="text-slate-400">-</span>
                                        <span class="px-2 py-0.5 rounded" :class="getEndSetPointClass(selectedScoringMatch?.id, eNum, 'B')">
                                            {{ getEndSetPoint(selectedScoringMatch?.id, eNum, 'B') }}
                                        </span>
                                    </div>
                                    <div v-else class="text-xs font-mono font-black text-navy">
                                        {{ calculateEndTotal(selectedScoringMatch?.id, eNum, 'A') || 0 }} - {{ calculateEndTotal(selectedScoringMatch?.id, eNum, 'B') || 0 }} pts
                                    </div>
                                </div>

                                <!-- Side A Row -->
                                <div class="flex items-center justify-between text-xs pt-1 border-t border-slate-200/60">
                                    <div class="flex items-center gap-1.5 min-w-0">
                                        <span class="px-1.5 py-0.2 rounded bg-navy text-primary text-[9px] font-black shrink-0">A</span>
                                        <span class="font-bold text-navy truncate max-w-[120px]">{{ selectedScoringMatch?.entry_a_name?.split(' ')[0] || 'A' }}</span>
                                        <span class="text-slate-500 font-mono text-[11px]">({{ formatArrows(selectedScoringMatch?.id, eNum, 'A') }})</span>
                                    </div>
                                    <span class="font-mono font-black text-navy shrink-0">{{ calculateEndTotal(selectedScoringMatch?.id, eNum, 'A') || 0 }} pts</span>
                                </div>

                                <!-- Side B Row -->
                                <div class="flex items-center justify-between text-xs">
                                    <div class="flex items-center gap-1.5 min-w-0">
                                        <span class="px-1.5 py-0.2 rounded bg-navy text-primary text-[9px] font-black shrink-0">B</span>
                                        <span class="font-bold text-navy truncate max-w-[120px]">{{ selectedScoringMatch?.entry_b_name?.split(' ')[0] || 'B' }}</span>
                                        <span class="text-slate-500 font-mono text-[11px]">({{ formatArrows(selectedScoringMatch?.id, eNum, 'B') }})</span>
                                    </div>
                                    <span class="font-mono font-black text-navy shrink-0">{{ calculateEndTotal(selectedScoringMatch?.id, eNum, 'B') || 0 }} pts</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right Column: Keypad Matrix Controller (Sticky on Desktop) -->
            <div class="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-6">
                <div class="bg-white rounded-2xl shadow-2xs border border-slate-200/90 overflow-hidden">
                    <!-- Keypad Header -->
                    <div class="bg-navy text-white p-4 sm:p-5 space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:keypad-bold" class="text-primary text-base" />
                                <span class="text-xs font-black tracking-wider">{{ t('event_elimination.scorecard_keypad') }}</span>
                            </div>
                            <span class="px-2 py-0.5 rounded-md bg-primary text-navy font-mono text-[10px] font-black">
                                {{ activeSide === 'A' ? t('event_elimination.side_a') : t('event_elimination.side_b') }}
                            </span>
                        </div>

                        <!-- Active Archer Badge -->
                        <div class="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 border border-white/10">
                            <div class="size-9 rounded-lg border border-white/20 overflow-hidden bg-white/10 shrink-0">
                                <img :src="useImageOrDefault(activeSide === 'A' ? selectedScoringMatch?.entry_a_avatar : selectedScoringMatch?.entry_b_avatar, activeSide === 'A' ? selectedScoringMatch?.entry_a_name : selectedScoringMatch?.entry_b_name)"
                                    class="size-full object-cover" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h4 class="text-xs font-black text-white truncate">
                                    {{ (activeSide === 'A' ? selectedScoringMatch?.entry_a_name : selectedScoringMatch?.entry_b_name) || 'TBD' }}
                                </h4>
                                <div class="text-[10px] text-slate-300 font-medium">
                                    End {{ currentEnd }} • {{ t('event_elimination.arrow_n', { n: selectedArrowIndex + 1 }) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Target Face Color Keypad Matrix -->
                    <div class="p-4 sm:p-5 space-y-3">
                        <div class="grid grid-cols-4 gap-2">
                            <button v-for="val in ['X', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'M']" :key="val"
                                type="button"
                                @click="!isMatchFinished && $emit('add-score', val)"
                                :disabled="isMatchFinished"
                                :class="[
                                    'h-12 rounded-xl text-base font-black transition-all border-b-2 active:border-b-0 active:translate-y-[2px] shadow-2xs flex items-center justify-center cursor-pointer select-none font-mono',
                                    getKeypadRingClass(val),
                                    isMatchFinished ? 'opacity-40 grayscale pointer-events-none' : ''
                                ]">
                                <span>{{ val }}</span>
                            </button>
                        </div>

                        <!-- Action Buttons: Delete & Save / Next -->
                        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
                            <button type="button"
                                @click="!isMatchFinished && $emit('delete-last-arrow')"
                                :disabled="isMatchFinished"
                                class="h-11 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 text-slate-600 font-black text-xs transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer disabled:opacity-30 disabled:pointer-events-none">
                                <Icon icon="ph:backspace-bold" class="text-base" />
                                <span>{{ t('event_elimination.del') }}</span>
                            </button>

                            <button type="button"
                                @click="!isMatchFinished && $emit('save-and-next')"
                                :disabled="isSaving || isMatchFinished"
                                class="col-span-2 h-11 rounded-xl bg-navy text-primary hover:bg-slate-900 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 cursor-pointer disabled:opacity-30 disabled:pointer-events-none">
                                <Icon v-if="isSaving" icon="ph:circle-notch-bold" class="animate-spin text-base" />
                                <template v-else>
                                    <span>{{ t('event_elimination.save_end_btn') }}</span>
                                    <Icon icon="ph:paper-plane-right-fill" class="text-sm" />
                                </template>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mobile Sticky Bottom Keypad Drawer (< lg) -->
            <div v-if="!isMatchFinished"
                class="lg:hidden fixed inset-x-0 bottom-0 z-[70] bg-white border-t border-slate-200 shadow-2xl rounded-t-3xl p-3.5 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-2.5">
                
                <!-- Mobile Keypad Header & Side Switcher -->
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 min-w-0 flex-1">
                        <div class="size-8 rounded-lg border border-slate-200 overflow-hidden bg-slate-100 shrink-0">
                            <img :src="useImageOrDefault(activeSide === 'A' ? selectedScoringMatch?.entry_a_avatar : selectedScoringMatch?.entry_b_avatar, activeSide === 'A' ? selectedScoringMatch?.entry_a_name : selectedScoringMatch?.entry_b_name)"
                                class="size-full object-cover" />
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-1.5 leading-none">
                                <span class="px-1.5 py-0.2 rounded bg-navy text-primary text-[9px] font-black uppercase">
                                    {{ activeSide === 'A' ? 'Side A' : 'Side B' }}
                                </span>
                                <span class="text-[11px] font-black text-navy truncate">
                                    {{ (activeSide === 'A' ? selectedScoringMatch?.entry_a_name : selectedScoringMatch?.entry_b_name) || 'TBD' }}
                                </span>
                            </div>
                            <div class="text-[10px] text-slate-500 font-semibold mt-0.5">
                                End {{ currentEnd }} • Panah {{ selectedArrowIndex + 1 }}
                            </div>
                        </div>
                    </div>

                    <!-- Quick Side Switcher on Mobile Keypad -->
                    <div class="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg shrink-0">
                        <button type="button" @click="$emit('update:activeSide', 'A')"
                            :class="[
                                'px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer',
                                activeSide === 'A' ? 'bg-navy text-primary shadow-2xs' : 'text-slate-600'
                            ]">
                            A
                        </button>
                        <button type="button" @click="$emit('update:activeSide', 'B')"
                            :class="[
                                'px-2.5 py-1 rounded-md text-[10px] font-black transition-all cursor-pointer',
                                activeSide === 'B' ? 'bg-navy text-primary shadow-2xs' : 'text-slate-600'
                            ]">
                            B
                        </button>
                    </div>
                </div>

                <!-- Mobile Keypad Grid (World Archery Rings) -->
                <div class="grid grid-cols-4 gap-1.5">
                    <button v-for="val in ['X', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', 'M']" :key="val"
                        type="button"
                        @click="$emit('add-score', val)"
                        :class="[
                            'h-10 rounded-xl text-sm font-black transition-all border-b-2 active:border-b-0 active:translate-y-[1px] shadow-2xs flex items-center justify-center cursor-pointer select-none font-mono',
                            getKeypadRingClass(val)
                        ]">
                        {{ val }}
                    </button>
                </div>

                <!-- Mobile Keypad Actions -->
                <div class="grid grid-cols-3 gap-2">
                    <button type="button"
                        @click="$emit('delete-last-arrow')"
                        class="h-10 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 border border-slate-200 text-slate-700 font-black text-xs transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer">
                        <Icon icon="ph:backspace-bold" class="text-sm" />
                        <span>{{ t('event_elimination.del') }}</span>
                    </button>

                    <button type="button"
                        @click="$emit('save-and-next')"
                        :disabled="isSaving"
                        class="col-span-2 h-10 rounded-xl bg-navy text-primary font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 cursor-pointer disabled:opacity-50">
                        <Icon v-if="isSaving" icon="ph:circle-notch-bold" class="animate-spin text-sm" />
                        <template v-else>
                            <span>{{ t('event_elimination.save_end_btn') }}</span>
                            <Icon icon="ph:paper-plane-right-fill" class="text-xs" />
                        </template>
                    </button>
                </div>
            </div>
        </div>

        <!-- Empty State if no match selected -->
        <div v-else class="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center flex flex-col items-center justify-center space-y-3">
            <div class="size-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Icon icon="ph:pencil-circle-bold" class="text-3xl" />
            </div>
            <div>
                <h4 class="text-base font-black text-navy">{{ t('event_elimination.select_match_to_score') }}</h4>
                <div class="text-xs text-slate-500 mt-1">{{ t('event_elimination.select_match_to_score_desc') }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { getMatchStageBadge } from '~/utils/eliminationStage'

const { t } = useDashboardI18n()

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
    manualWinnerId: { type: String, default: null },
    isMatchFinished: { type: Boolean, default: false },
    isResetting: { type: Boolean, default: false },
    teamMembersMap: { type: Object, default: () => ({}) }
})

const emit = defineEmits([
    'select-match',
    'add-score',
    'delete-last-arrow',
    'save-and-next',
    'end-match',
    'select-arrow-box',
    'update:currentEnd',
    'update:activeSide',
    'reset-match'
])

const searchQuery = ref('')
const isMobileKeypadOpen = ref(false)

const onSelectMatch = (match) => {
    emit('select-match', match)
}

const onSelectArrow = (side, index) => {
    emit('select-arrow-box', side, index)
}

const isByeMatch = (match) => {
    if (!match) return false
    return match.is_bye === true || 
           match.is_bye === 1 || 
           match.is_bye === '1' ||
           match.entry_b_name === 'BYE' || 
           match.entry_a_name === 'BYE' ||
           (!match.entry_b_id && match.entry_a_id && !match.entry_b_uuid) ||
           (!match.entry_a_id && match.entry_b_id && !match.entry_a_uuid)
}

const getAdvancingArcher = (match) => {
    if (!match) return null
    if (match.entry_a_name && match.entry_a_name !== 'BYE') {
        return {
            id: match.entry_a_id,
            name: match.entry_a_name,
            club: match.entry_a_club,
            seed: match.entry_a_seed,
            avatar: match.entry_a_avatar || match.entry_a_photo,
            side: 'A'
        }
    }
    if (match.entry_b_name && match.entry_b_name !== 'BYE') {
        return {
            id: match.entry_b_id,
            name: match.entry_b_name,
            club: match.entry_b_club,
            seed: match.entry_b_seed,
            avatar: match.entry_b_avatar || match.entry_b_photo,
            side: 'B'
        }
    }
    return {
        id: match.entry_a_id || match.entry_b_id,
        name: match.entry_a_name || 'Archer',
        club: match.entry_a_club || match.entry_b_club || '',
        seed: match.entry_a_seed || match.entry_b_seed,
        avatar: match.entry_a_avatar || match.entry_b_avatar,
        side: 'A'
    }
}

const filteredRoundMatches = computed(() => {
    if (!searchQuery.value.trim()) return props.roundMatches
    const q = searchQuery.value.toLowerCase()
    return props.roundMatches.filter(m => {
        const matchNo = `match ${m.match_no}`.toLowerCase()
        const nameA = (m.entry_a_name || '').toLowerCase()
        const nameB = (m.entry_b_name || '').toLowerCase()
        const targetName = (m.target_name || '').toLowerCase()
        return matchNo.includes(q) || nameA.includes(q) || nameB.includes(q) || targetName.includes(q)
    })
})

const getMatchEndsData = (matchId) => {
    if (!matchId) return null
    if (props.matchEnds?.[matchId]) return props.matchEnds[matchId]
    if (props.selectedScoringMatch?.id === matchId && props.selectedScoringMatch?.uuid && props.matchEnds?.[props.selectedScoringMatch.uuid]) {
        return props.matchEnds[props.selectedScoringMatch.uuid]
    }
    if (props.selectedScoringMatch?.uuid === matchId && props.selectedScoringMatch?.id && props.matchEnds?.[props.selectedScoringMatch.id]) {
        return props.matchEnds[props.selectedScoringMatch.id]
    }
    return null
}

const getShootOffSummary = (match) => {
    if (!match) return null
    const m = getMatchEndsData(match.id) || getMatchEndsData(match.uuid)
    const soA = m?.A?.[99]?.arrows?.[0] || match.shoot_off_a
    const soB = m?.B?.[99]?.arrows?.[0] || match.shoot_off_b
    if (soA || soB) {
        return `${soA || '-'} vs ${soB || '-'}`
    }
    return null
}

const getMatchScore = (match, side) => {
    if (!match || (!match.id && !match.uuid)) return 0
    const isRecurve = props.bracket?.format === 'recurve_set'
    const sideKey = side === 'A' ? 'A' : 'B'

    const m = getMatchEndsData(match.id) || getMatchEndsData(match.uuid)
    let score = 0
    if (m && m[sideKey]) {
        if (isRecurve) score = calculateSetPoints(match.id, sideKey)
        else score = Object.values(m[sideKey] || {}).reduce((s, e) => {
            if (e?.end_no === 99) return s
            return s + (e?.total || 0)
        }, 0) || 0
    } else {
        if (isRecurve) score = (side === 'A' ? match.total_points_a : match.total_points_b) || 0
        else score = (side === 'A' ? match.total_score_a : match.total_score_b) || 0
    }

    // Shoot-off logic: Winner gets +1 point ONLY in Recurve Set System (making 5-5 become 6-5)
    if (isRecurve) {
        const soA = m?.A?.[99]?.arrows?.[0]
        const soB = m?.B?.[99]?.arrows?.[0]

        if (soA && soB) {
            const getV = (v) => v === 'X' ? 11 : (v === 'M' ? 0 : parseInt(v) || 0)
            const vA = getV(soA)
            const vB = getV(soB)

            if (vA > vB && side === 'A') score += 1
            else if (vB > vA && side === 'B') score += 1
            else if (vA === vB) {
                const currentSideId = side === 'A' ? match.entry_a_id : match.entry_b_id
                if (props.manualWinnerId && props.manualWinnerId === currentSideId) {
                    score += 1
                } else if (match.winner_entry_id === currentSideId && match.status === 'finished') {
                    score += 1
                }
            }
        }
    }

    return score
}

const showShootOff = computed(() => {
    if (!props.selectedScoringMatch || (!props.selectedScoringMatch.id && !props.selectedScoringMatch.uuid)) return false
    const match = props.selectedScoringMatch
    const m = getMatchEndsData(match.id) || getMatchEndsData(match.uuid)
    if (!m || !m.A || !m.B) return false

    const hasSoA = Array.isArray(m.A?.[99]?.arrows) && m.A[99].arrows.some(a => a !== null && a !== '')
    const hasSoB = Array.isArray(m.B?.[99]?.arrows) && m.B[99].arrows.some(a => a !== null && a !== '')
    if (hasSoA || hasSoB) return true

    const isRecurve = props.bracket?.format === 'recurve_set'
    let baseA = 0, baseB = 0
    if (isRecurve) {
        baseA = calculateSetPoints(match.id, 'A')
        baseB = calculateSetPoints(match.id, 'B')
    } else {
        baseA = Object.values(m.A || {}).reduce((s, e) => e?.end_no !== 99 ? s + (e?.total || 0) : s, 0)
        baseB = Object.values(m.B || {}).reduce((s, e) => e?.end_no !== 99 ? s + (e?.total || 0) : s, 0)
    }

    const totalEnds = props.bracket?.ends_per_match || 5
    const arrowsPerEnd = props.bracket?.arrows_per_end || 3
    for (let i = 1; i <= totalEnds; i++) {
        const aArrows = Array.isArray(m.A?.[i]?.arrows) ? m.A[i].arrows.filter(a => a !== null && a !== '') : []
        const bArrows = Array.isArray(m.B?.[i]?.arrows) ? m.B[i].arrows.filter(a => a !== null && a !== '') : []
        if (aArrows.length !== arrowsPerEnd || bArrows.length !== arrowsPerEnd) return false
    }

    return baseA === baseB
})

const calculateSetPoints = (matchId, side) => {
    if (!matchId) return 0
    const m = getMatchEndsData(matchId)
    if (!m || !m.A || !m.B) return 0

    let setPointsA = 0
    let setPointsB = 0
    const totalEnds = props.bracket?.ends_per_match || 5
    const arrowsPerEnd = props.bracket?.arrows_per_end || 3

    for (let i = 1; i <= totalEnds; i++) {
        const endA = m.A?.[i]
        const endB = m.B?.[i]
        if (!endA || !endB || endA.total === undefined || endB.total === undefined) continue

        const finishedA = Array.isArray(endA.arrows) && endA.arrows.filter(a => a !== null && a !== '').length === arrowsPerEnd
        const finishedB = Array.isArray(endB.arrows) && endB.arrows.filter(a => a !== null && a !== '').length === arrowsPerEnd

        if (finishedA && finishedB) {
            if (endA.total > endB.total) setPointsA += 2
            else if (endA.total < endB.total) setPointsB += 2
            else {
                setPointsA += 1
                setPointsB += 1
            }
        }
        if (setPointsA >= 6 || setPointsB >= 6) break
    }

    return side === 'A' ? setPointsA : setPointsB
}

const getEndSetPoint = (matchId, endNo, side) => {
    if (!matchId) return '-'
    const m = getMatchEndsData(matchId)
    if (!m || !m.A || !m.B) return '-'
    const endA = m.A?.[endNo]
    const endB = m.B?.[endNo]
    if (!endA || !endB) return '-'

    const arrowsPerEnd = props.bracket?.arrows_per_end || 3
    const fA = Array.isArray(endA.arrows) && endA.arrows.filter(a => a !== null && a !== '').length === arrowsPerEnd
    const fB = Array.isArray(endB.arrows) && endB.arrows.filter(a => a !== null && a !== '').length === arrowsPerEnd
    if (!fA || !fB) return '-'

    if (endA.total > endB.total) return side === 'A' ? '2' : '0'
    if (endA.total < endB.total) return side === 'B' ? '2' : '0'
    return '1'
}

const getEndSetPointClass = (matchId, endNo, side) => {
    const pt = getEndSetPoint(matchId, endNo, side)
    if (pt === '2') return 'bg-emerald-100 text-emerald-800'
    if (pt === '1') return 'bg-amber-100 text-amber-800'
    if (pt === '0') return 'bg-slate-100 text-slate-500'
    return 'text-slate-400'
}

const isEndCompleted = (matchId, endNo) => {
    if (!matchId) return false
    const m = getMatchEndsData(matchId)
    if (!m || !m.A || !m.B) return false
    const arrowsPerEnd = props.bracket?.arrows_per_end || 3
    const fA = Array.isArray(m.A?.[endNo]?.arrows) && m.A[endNo].arrows.filter(a => a !== null && a !== '').length === arrowsPerEnd
    const fB = Array.isArray(m.B?.[endNo]?.arrows) && m.B[endNo].arrows.filter(a => a !== null && a !== '').length === arrowsPerEnd
    return Boolean(fA && fB)
}

const getFullTargetName = (match) => {
    if (!match) return t('event_elimination.no_target')
    if (match.board_code) return `${match.board_code}`
    if (match.target_name) return match.target_name.startsWith('Target') ? match.target_name : `Target ${match.target_name}`
    return t('event_elimination.no_target')
}

const calculateEndTotal = (matchId, endNo, side) => {
    if (!matchId) return 0
    const m = getMatchEndsData(matchId)
    const end = m?.[side]?.[endNo]
    if (!end || !Array.isArray(end.arrows)) return 0
    return end.arrows.reduce((sum, a) => {
        if (!a || a === '-' || a === '') return sum
        const val = a === 'X' ? 10 : (a === 'M' ? 0 : parseInt(a) || 0)
        return sum + val
    }, 0)
}

const calculateEndStats = (matchId, endNo, side) => {
    if (!matchId) return { x: 0, ten: 0 }
    const m = getMatchEndsData(matchId)
    const end = m?.[side]?.[endNo]
    if (!end || !Array.isArray(end.arrows)) return { x: 0, ten: 0 }
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
    if (!matchId) return ''
    const m = getMatchEndsData(matchId)
    const val = m?.[side]?.[endNo]?.arrows?.[arrowIdx - 1]
    return val === null || val === undefined ? '' : val
}

const formatArrows = (matchId, endNo, side) => {
    if (!matchId) return '-'
    const m = getMatchEndsData(matchId)
    const arrows = m?.[side]?.[endNo]?.arrows
    if (!Array.isArray(arrows)) return '-'
    const clean = arrows.filter(a => a !== null && a !== '')
    return clean.length ? clean.join(' - ') : '-'
}

// World Archery Color Rings for Arrow Score Boxes
const getArrowRingClass = (score) => {
    if (score === undefined || score === null || score === '') {
        return 'bg-slate-50 border-slate-200 text-slate-300'
    }
    const s = String(score).toUpperCase()
    if (['X', '10', '9'].includes(s)) {
        return 'bg-amber-300 border-amber-500 text-amber-950 font-black shadow-sm'
    }
    if (['8', '7'].includes(s)) {
        return 'bg-red-500 border-red-700 text-white font-black shadow-sm'
    }
    if (['6', '5'].includes(s)) {
        return 'bg-sky-500 border-sky-700 text-white font-black shadow-sm'
    }
    if (['4', '3'].includes(s)) {
        return 'bg-slate-900 border-slate-950 text-white font-black shadow-sm'
    }
    if (['2', '1'].includes(s)) {
        return 'bg-white border-slate-300 text-slate-900 font-black shadow-sm'
    }
    if (s === 'M') {
        return 'bg-slate-200 border-slate-400 text-slate-600 font-black shadow-sm'
    }
    return 'bg-white border-slate-200 text-navy'
}

// Keypad Button Color Themes (World Archery Rings)
const getKeypadRingClass = (val) => {
    const s = String(val).toUpperCase()
    if (['X', '10', '9'].includes(s)) {
        return 'bg-amber-300 border-amber-500 text-amber-950 hover:bg-amber-400'
    }
    if (['8', '7'].includes(s)) {
        return 'bg-red-500 border-red-700 text-white hover:bg-red-600'
    }
    if (['6', '5'].includes(s)) {
        return 'bg-sky-500 border-sky-700 text-white hover:bg-sky-600'
    }
    if (['4', '3'].includes(s)) {
        return 'bg-slate-900 border-black text-white hover:bg-slate-800'
    }
    if (['2', '1'].includes(s)) {
        return 'bg-white border-slate-300 text-slate-900 hover:bg-slate-100'
    }
    if (s === 'M') {
        return 'bg-slate-200 border-slate-400 text-slate-700 hover:bg-slate-300'
    }
    return 'bg-white border-slate-200 text-navy'
}

const isWinner = (match, entryId) => {
    if (!match || !match.winner_entry_id || !entryId) return false
    return match.winner_entry_id === entryId
}
</script>
