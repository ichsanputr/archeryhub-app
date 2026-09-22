<template>
    <div class="min-h-screen bg-[#f8fafc] text-navy font-sans selection:bg-primary selection:text-navy flex flex-col justify-between">

        <!-- ── Top Header Navigation Bar ─────────────────────────── -->
        <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs h-16 flex items-center shrink-0">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between gap-4">
                <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <NuxtLink to="/" class="flex items-center gap-2.5 shrink-0 group">
                        <div class="size-8 bg-navy rounded-xl flex items-center justify-center shadow-2xs">
                            <img src="/logo.png" alt="Archeris.net" class="size-5 object-contain" />
                        </div>
                        <span class="text-base sm:text-lg font-black tracking-tight text-navy hidden md:block">Archeris<span class="text-primary">.net</span></span>
                    </NuxtLink>
                    <div class="flex items-center gap-2 min-w-0">
                        <span class="text-slate-300 text-lg font-light select-none hidden md:block">/</span>
                        <span class="text-xs sm:text-sm font-bold text-slate-500 truncate">{{ t('event_elimination.match_detail', 'Detail Pertandingan') }}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div v-if="matchData"
                        class="hidden sm:flex px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold tracking-wide border border-slate-200/80 shadow-2xs">
                        {{ formatLabel }}
                    </div>
                    <button @click="handleBack"
                        class="h-9 px-3 sm:px-4 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200 text-slate-700 hover:text-navy font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                        :title="t('event_elimination.back_to_event', 'Kembali')">
                        <Icon icon="ph:arrow-left-bold" class="text-sm" />
                        <span class="hidden sm:inline">{{ t('event_elimination.back_to_event', 'Kembali') }}</span>
                    </button>
                </div>
            </div>
        </header>

        <main class="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 relative z-10">

            <!-- ── Loading State ────────────────────────────────────── -->
            <div v-if="isLoading" class="flex-1 min-h-[50vh] flex flex-col items-center justify-center">
                <div class="flex items-center gap-2 mb-4">
                    <span class="size-3 rounded-full bg-primary animate-bounce" style="animation-delay: 0ms"></span>
                    <span class="size-3 rounded-full bg-primary animate-bounce" style="animation-delay: 150ms"></span>
                    <span class="size-3 rounded-full bg-primary animate-bounce" style="animation-delay: 300ms"></span>
                </div>
                <span class="text-slate-400 font-bold tracking-wider text-xs">
                    {{ t('event_elimination.loading_match', 'Memuat data pertandingan...') }}
                </span>
            </div>

            <!-- ── Match Content ───────────────────────────────────── -->
            <template v-else-if="matchData">
                <div class="max-w-7xl mx-auto space-y-5 sm:space-y-6 md:space-y-8">

                    <!-- ═══════════════════════════════════════
                         EVENT CONTEXT HEADER BANNER
                    ════════════════════════════════════════ -->
                    <div class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-6 shadow-2xs relative overflow-hidden">
                        <!-- Subtle Background Decorative Accent -->
                        <div class="absolute right-0 top-0 bottom-0 w-72 bg-gradient-to-l from-primary/[0.07] to-transparent pointer-events-none"></div>

                        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <!-- Left: Event Logo / Icon + Name + Category & Round Badges -->
                            <div class="flex items-center gap-3.5 sm:gap-4 min-w-0">
                                <div class="size-12 sm:size-14 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
                                    <img v-if="eventData?.logo_url" :src="eventData.logo_url" class="size-full object-cover" />
                                    <div v-else class="size-full bg-navy text-primary flex items-center justify-center text-xl font-black">
                                        <Icon icon="ph:target-bold" />
                                    </div>
                                </div>

                                <div class="min-w-0 flex-1 space-y-1.5">
                                    <h1 class="text-base sm:text-lg lg:text-xl font-black text-navy tracking-tight truncate leading-tight">
                                        {{ eventData?.name || t('event_elimination.match_detail', 'Detail Pertandingan') }}
                                    </h1>

                                    <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                        <!-- Category Name Badge -->
                                        <span v-if="eventData?.category_name"
                                            class="px-2.5 py-0.5 rounded-lg bg-navy text-primary text-xs font-bold tracking-wide shadow-2xs">
                                            {{ eventData.category_name }}
                                        </span>

                                        <!-- Round Stage Badge -->
                                        <span class="px-2.5 py-0.5 rounded-lg bg-primary/20 text-navy border border-primary/30 text-xs font-bold">
                                            {{ roundName }}
                                        </span>

                                        <!-- Match Number Badge -->
                                        <span v-if="matchData?.match_no"
                                            class="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-mono border border-slate-200">
                                            Match #{{ matchData.match_no }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Venue/Location & Date Meta -->
                            <div class="flex flex-wrap md:flex-col md:items-end justify-between md:justify-center gap-2 sm:gap-1.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0 text-xs text-slate-600">
                                <!-- Venue / Location -->
                                <div v-if="eventData?.venue || eventData?.city || eventData?.location" class="flex items-center gap-1.5 font-medium">
                                    <Icon icon="ph:map-pin-fill" class="text-rose-500 text-sm shrink-0" />
                                    <span class="truncate max-w-[240px] sm:max-w-[320px]">
                                        {{ [eventData.venue, eventData.city || eventData.location].filter(Boolean).join(', ') }}
                                    </span>
                                </div>

                                <!-- Date Range -->
                                <div v-if="eventData?.start_date" class="flex items-center gap-1.5 font-medium">
                                    <Icon icon="ph:calendar-blank-bold" class="text-primary text-sm shrink-0" />
                                    <span>{{ formatEventDateRange(eventData.start_date, eventData.end_date) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ═══════════════════════════════════════
                         VERSUS HEAD-TO-HEAD DUEL ARENA
                    ════════════════════════════════════════ -->
                    <div class="grid grid-cols-1 lg:grid-cols-11 items-center gap-4 sm:gap-5 lg:gap-6">

                        <!-- Archer A Card -->
                        <div class="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden group"
                            :class="[
                                isWinner('A')
                                    ? 'border-2 border-primary ring-4 ring-primary/20 shadow-md bg-gradient-to-br from-primary/[0.06] via-white to-white'
                                    : 'border border-slate-200/90 shadow-2xs hover:border-slate-300'
                            ]">
                            
                            <!-- Winner Crown Ribbon on Top Right of Card -->
                            <div v-if="isWinner('A')"
                                class="absolute top-0 right-0 bg-primary text-navy font-black text-[10px] tracking-wide px-3 py-1 rounded-bl-xl shadow-2xs flex items-center gap-1 z-10">
                                <Icon icon="ph:crown-simple-fill" class="text-xs text-navy" />
                                <span>{{ t('event_elimination.winner_badge', 'Pemenang') }}</span>
                            </div>

                            <div class="flex items-center gap-4 sm:gap-5">
                                <!-- Avatar with Seed & Crown -->
                                <div class="relative shrink-0">
                                    <div class="size-16 sm:size-20 rounded-2xl bg-slate-100 overflow-hidden relative border-2 transition-all"
                                        :class="isWinner('A') ? 'border-primary ring-2 ring-primary/30 shadow-md' : 'border-slate-200'">
                                        <img :src="useImageOrDefault(participantA?.avatar, participantA?.name)"
                                            class="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <!-- Seed Badge -->
                                    <div class="absolute -bottom-1.5 -left-1.5 bg-navy text-primary text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs border border-white/20">
                                        #{{ participantA?.seed || '?' }}
                                    </div>
                                    <!-- Floating Crown if Winner -->
                                    <div v-if="isWinner('A')"
                                        class="absolute -top-3 -right-2 size-7 sm:size-8 bg-primary text-navy rounded-full flex items-center justify-center text-sm sm:text-base shadow-md border-2 border-white ring-2 ring-primary/40 z-20 animate-pulse">
                                        <Icon icon="ph:crown-simple-fill" />
                                    </div>
                                </div>

                                <!-- Info & Score -->
                                <div class="min-w-0 flex-1 flex items-center justify-between gap-3">
                                    <div class="min-w-0 flex-1 space-y-1">
                                        <div class="flex items-center gap-2">
                                            <div class="text-xs font-bold text-slate-400">
                                                {{ t('event_elimination.archer_a', 'Pemanah A') }}
                                            </div>
                                            <div v-if="isWinner('A')" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary text-navy text-[10px] font-black shadow-2xs">
                                                <Icon icon="ph:crown-simple-fill" class="text-xs" />
                                                <span>{{ t('event_elimination.winner_badge', 'Pemenang') }}</span>
                                            </div>
                                        </div>
                                        <h2 class="text-base sm:text-lg lg:text-xl font-black text-navy tracking-tight truncate leading-tight">
                                            {{ participantA?.name || t('event_elimination.tbd', 'TBD') }}
                                        </h2>
                                        <div class="text-xs sm:text-sm text-slate-500 font-medium truncate">
                                            {{ participantA?.club || t('event_elimination.independent', 'Independen') }}
                                        </div>
                                    </div>

                                    <!-- Score Display -->
                                    <div class="shrink-0 text-right flex flex-col items-end">
                                        <span class="text-4xl sm:text-5xl lg:text-6xl font-black text-navy font-mono tabular-nums leading-none tracking-tight">
                                            {{ getFinalScore('A') }}
                                        </span>
                                        <span class="text-xs font-bold text-slate-400 mt-1">
                                            {{ matchData.format === 'recurve_set' ? t('event_elimination.set_pts', 'Set Pts') : t('event_elimination.score_pts', 'Skor') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- VS Center Arena Divider -->
                        <div class="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
                            <div class="size-10 sm:size-12 rounded-2xl bg-slate-100 border border-slate-200/90 shadow-inner flex items-center justify-center font-black text-slate-400 text-xs sm:text-sm font-mono tracking-wider">
                                VS
                            </div>

                            <div class="mt-2 sm:mt-2.5">
                                <div v-if="matchData.status === 'finished'"
                                    class="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-navy text-primary border border-navy shadow-2xs flex items-center gap-1.5">
                                    <Icon icon="ph:check-circle-fill" class="text-xs text-primary" />
                                    <span>{{ t('event_elimination.status_finished', 'Selesai') }}</span>
                                </div>
                                <div v-else
                                    class="px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs flex items-center gap-1.5 animate-pulse">
                                    <span class="size-1.5 rounded-full bg-emerald-500"></span>
                                    <span>{{ t('event_elimination.status_live', 'Berlangsung') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Archer B Card -->
                        <div class="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl transition-all duration-300 relative overflow-hidden group"
                            :class="[
                                isWinner('B')
                                    ? 'border-2 border-primary ring-4 ring-primary/20 shadow-md bg-gradient-to-br from-primary/[0.06] via-white to-white'
                                    : 'border border-slate-200/90 shadow-2xs hover:border-slate-300'
                            ]">
                            
                            <!-- Winner Crown Ribbon on Top Right of Card -->
                            <div v-if="isWinner('B')"
                                class="absolute top-0 right-0 bg-primary text-navy font-black text-[10px] tracking-wide px-3 py-1 rounded-bl-xl shadow-2xs flex items-center gap-1 z-10">
                                <Icon icon="ph:crown-simple-fill" class="text-xs text-navy" />
                                <span>{{ t('event_elimination.winner_badge', 'Pemenang') }}</span>
                            </div>

                            <div class="flex items-center gap-4 sm:gap-5">
                                <!-- Avatar with Seed & Crown -->
                                <div class="relative shrink-0">
                                    <div class="size-16 sm:size-20 rounded-2xl bg-slate-100 overflow-hidden relative border-2 transition-all"
                                        :class="isWinner('B') ? 'border-primary ring-2 ring-primary/30 shadow-md' : 'border-slate-200'">
                                        <img :src="useImageOrDefault(participantB?.avatar, participantB?.name)"
                                            class="size-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <!-- Seed Badge -->
                                    <div class="absolute -bottom-1.5 -left-1.5 bg-navy text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-2xs border border-white/20">
                                        #{{ participantB?.seed || '?' }}
                                    </div>
                                    <!-- Floating Crown if Winner -->
                                    <div v-if="isWinner('B')"
                                        class="absolute -top-3 -right-2 size-7 sm:size-8 bg-primary text-navy rounded-full flex items-center justify-center text-sm sm:text-base shadow-md border-2 border-white ring-2 ring-primary/40 z-20 animate-pulse">
                                        <Icon icon="ph:crown-simple-fill" />
                                    </div>
                                </div>

                                <!-- Info & Score -->
                                <div class="min-w-0 flex-1 flex items-center justify-between gap-3">
                                    <div class="min-w-0 flex-1 space-y-1">
                                        <div class="flex items-center gap-2">
                                            <div class="text-xs font-bold text-slate-400">
                                                {{ t('event_elimination.archer_b', 'Pemanah B') }}
                                            </div>
                                            <div v-if="isWinner('B')" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary text-navy text-[10px] font-black shadow-2xs">
                                                <Icon icon="ph:crown-simple-fill" class="text-xs" />
                                                <span>{{ t('event_elimination.winner_badge', 'Pemenang') }}</span>
                                            </div>
                                        </div>
                                        <h2 class="text-base sm:text-lg lg:text-xl font-black text-navy tracking-tight truncate leading-tight">
                                            {{ participantB?.name || t('event_elimination.tbd', 'TBD') }}
                                        </h2>
                                        <div class="text-xs sm:text-sm text-slate-500 font-medium truncate">
                                            {{ participantB?.club || t('event_elimination.independent', 'Independen') }}
                                        </div>
                                    </div>

                                    <!-- Score Display -->
                                    <div class="shrink-0 text-right flex flex-col items-end">
                                        <span class="text-4xl sm:text-5xl lg:text-6xl font-black text-navy font-mono tabular-nums leading-none tracking-tight">
                                            {{ getFinalScore('B') }}
                                        </span>
                                        <span class="text-xs font-bold text-slate-400 mt-1">
                                            {{ matchData.format === 'recurve_set' ? t('event_elimination.set_pts', 'Set Pts') : t('event_elimination.score_pts', 'Skor') }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ═══════════════════════════════════════
                         MODERN SCORE BREAKDOWN TABLE
                    ════════════════════════════════════════ -->
                    <div class="bg-white rounded-2xl sm:rounded-3xl shadow-2xs border border-slate-200/90 overflow-hidden">
                        
                        <!-- Table Top Header -->
                        <div class="px-4 sm:px-6 py-3.5 sm:py-4 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between gap-3">
                            <div class="flex items-center gap-2 min-w-0">
                                <div class="size-7 rounded-lg bg-navy text-primary flex items-center justify-center text-xs shadow-2xs shrink-0">
                                    <Icon icon="ph:table-bold" />
                                </div>
                                <h3 class="text-xs sm:text-sm font-black text-navy tracking-tight truncate">
                                    <span class="sm:hidden">{{ t('event_elimination.score_breakdown_short', 'Skor Seri') }}</span>
                                    <span class="hidden sm:inline">{{ t('event_elimination.score_breakdown', 'Rincian Skor Per Seri') }}</span>
                                </h3>
                            </div>
                            <div class="flex items-center gap-1.5 text-xs font-bold text-slate-500 shrink-0">
                                <span class="px-2.5 py-1 rounded-lg bg-white border border-slate-200 shadow-2xs">
                                    <span class="sm:hidden">{{ formatLabelMobile }}</span>
                                    <span class="hidden sm:inline">{{ formatLabel }}</span>
                                </span>
                            </div>
                        </div>

                        <!-- Empty State (Centered across the full card width) -->
                        <div v-if="sortedEnds.length === 0" class="py-14 sm:py-20 px-4 text-center flex flex-col items-center justify-center">
                            <div class="size-14 sm:size-16 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-2xl sm:text-3xl shadow-2xs mb-3">
                                <Icon icon="ph:clipboard-text-bold" />
                            </div>
                            <h4 class="text-sm sm:text-base font-bold text-slate-700 mb-1">
                                {{ t('event_elimination.no_score_data', 'Belum Ada Data Skor') }}
                            </h4>
                            <p class="text-xs text-slate-400 max-w-sm">
                                {{ t('event_elimination.scoring_not_started_desc', 'Skor rambahan akan muncul di sini secara real-time saat pertandingan dimulai.') }}
                            </p>
                        </div>

                        <!-- Table Data when scores exist -->
                        <div v-else class="overflow-x-auto">
                            <table class="w-full text-center min-w-[540px] text-xs sm:text-sm">
                                <thead>
                                    <tr class="bg-slate-50/90 border-b border-slate-200/90 text-slate-600 text-xs font-bold">
                                        <th class="py-2.5 sm:py-3 w-10 sm:w-12 px-2 text-center">{{ t('event_elimination.end_seri', 'Seri') }}</th>
                                        <th class="w-36 sm:w-48 text-left px-3 sm:px-4">{{ t('event_elimination.archer_label', 'Pemanah') }}</th>
                                        <th v-for="i in maxArrows" :key="i" class="w-10 sm:w-12 text-center px-1">
                                            A{{ i }}
                                        </th>
                                        <th class="w-12 sm:w-16 px-1">{{ t('event_elimination.total_label', 'Total') }}</th>
                                        <th class="w-14 sm:w-18 bg-slate-100/60 text-navy px-1">
                                            {{ matchData.format === 'recurve_set' ? t('event_elimination.set_pts_header', 'Poin Set') : t('event_elimination.running_header', 'Berjalan') }}
                                        </th>
                                        <th class="w-16 sm:w-24 border-l border-slate-200/80 text-navy px-2">{{ t('event_elimination.cumulative_header', 'Akumulasi') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <template v-for="endNo in sortedEnds" :key="endNo">
                                        
                                        <!-- Row Archer A -->
                                        <tr class="hover:bg-slate-50/50 transition-colors">
                                            <!-- End / Seri Number (rowspan 2) -->
                                            <td class="font-black text-navy bg-slate-50/50 border-r border-slate-200/80 text-xs py-1 px-1.5 text-center align-middle w-10 sm:w-12"
                                                rowspan="2">
                                                <span class="inline-flex items-center justify-center size-6 sm:size-7 rounded-lg text-xs font-black shadow-2xs mx-auto"
                                                    :class="endNo === 99 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-navy text-primary'">
                                                    {{ endNo === 99 ? 'SO' : endNo }}
                                                </span>
                                            </td>

                                            <!-- Archer A Info -->
                                            <td class="px-3 sm:px-4 py-1.5 sm:py-2 text-left">
                                                <div class="flex items-center gap-1.5 sm:gap-2">
                                                    <span class="size-2 rounded-full bg-primary border border-navy/20 shrink-0"></span>
                                                    <span class="font-black text-xs sm:text-sm text-navy truncate">
                                                        {{ participantA?.name || t('event_elimination.archer_a', 'Pemanah A') }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Arrows A -->
                                            <td v-for="i in maxArrows" :key="'a-' + i" class="py-1.5 sm:py-2 px-1">
                                                <span class="inline-flex size-7 sm:size-8 rounded-lg items-center justify-center border text-xs font-black"
                                                    :class="getArrowClass(getEndsBySide(endNo, 'A')[i - 1])">
                                                    {{ getEndsBySide(endNo, 'A')[i - 1] || '–' }}
                                                </span>
                                            </td>

                                            <!-- Total A -->
                                            <td class="font-black text-navy text-xs sm:text-sm font-mono tabular-nums py-1.5 sm:py-2 px-1">
                                                {{ getEndTotal(endNo, 'A') }}
                                            </td>

                                            <!-- Points / Running A -->
                                            <td class="font-black text-navy text-xs sm:text-sm bg-slate-50/80 font-mono py-1.5 sm:py-2 px-1">
                                                {{ getSidePoints('A', endNo) }}
                                            </td>

                                            <!-- Cumulative Score (rowspan 2) -->
                                            <td class="border-l border-slate-200/80 font-black text-xs sm:text-base font-mono py-1.5 sm:py-2 px-2 bg-slate-50/40 text-navy align-middle"
                                                rowspan="2">
                                                {{ getRunningScoreDisplay(endNo) }}
                                            </td>
                                        </tr>

                                        <!-- Row Archer B -->
                                        <tr class="hover:bg-slate-50/50 transition-colors border-b border-slate-200/70">
                                            <!-- Archer B Info -->
                                            <td class="px-3 sm:px-4 py-1.5 sm:py-2 text-left">
                                                <div class="flex items-center gap-1.5 sm:gap-2">
                                                    <span class="size-2 rounded-full bg-slate-300 shrink-0"></span>
                                                    <span class="font-bold text-xs sm:text-sm text-slate-600 truncate">
                                                        {{ participantB?.name || t('event_elimination.archer_b', 'Pemanah B') }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Arrows B -->
                                            <td v-for="i in maxArrows" :key="'b-' + i" class="py-1.5 sm:py-2 px-1">
                                                <span class="inline-flex size-7 sm:size-8 rounded-lg items-center justify-center border text-xs font-bold"
                                                    :class="getArrowClass(getEndsBySide(endNo, 'B')[i - 1])">
                                                    {{ getEndsBySide(endNo, 'B')[i - 1] || '–' }}
                                                </span>
                                            </td>

                                            <!-- Total B -->
                                            <td class="font-black text-navy text-xs sm:text-sm font-mono tabular-nums py-1.5 sm:py-2 px-1">
                                                {{ getEndTotal(endNo, 'B') }}
                                            </td>

                                            <!-- Points / Running B -->
                                            <td class="font-bold text-slate-600 text-xs sm:text-sm bg-slate-50/80 font-mono py-1.5 sm:py-2 px-1">
                                                {{ getSidePoints('B', endNo) }}
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>

                                <!-- Modern Clean Table Footer -->
                                <tfoot>
                                    <tr class="bg-slate-50/90 border-t-2 border-slate-200/90 text-slate-700 font-bold">
                                        <td colspan="2" class="py-3 px-3 sm:px-4 text-left">
                                            <span class="text-xs font-bold text-slate-600">
                                                {{ t('event_elimination.final_total_label', 'Total Akhir') }}
                                            </span>
                                        </td>
                                        <td :colspan="maxArrows"></td>
                                        <td class="py-3 text-center px-1">
                                            <div class="flex flex-col gap-0.5 items-center font-mono">
                                                <span class="font-black text-navy text-xs sm:text-sm tabular-nums">{{ totalScoreA }}</span>
                                                <span class="font-bold text-slate-400 text-xs sm:text-sm tabular-nums">{{ totalScoreB }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3 text-center bg-slate-100/60 px-1">
                                            <div class="flex flex-col gap-0.5 items-center font-mono">
                                                <span class="font-black text-navy text-xs sm:text-sm tabular-nums">{{ getFinalScore('A') }}</span>
                                                <span class="font-bold text-slate-400 text-xs sm:text-sm tabular-nums">{{ getFinalScore('B') }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3 border-l border-slate-200/80 text-center px-2">
                                            <div class="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-navy text-primary font-black font-mono text-sm sm:text-base tracking-tight shadow-2xs">
                                                {{ getFinalScore('A') }} – {{ getFinalScore('B') }}
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                </div>
            </template>

            <!-- ── Error State ──────────────────────────────────────── -->
            <div v-else
                class="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200/90 shadow-2xs max-w-md mx-auto mt-10 sm:mt-16">
                <div class="size-16 sm:size-20 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xs">
                    <Icon icon="ph:warning-circle-bold" class="text-3xl sm:text-4xl" />
                </div>
                <h3 class="text-lg sm:text-xl font-black text-navy mb-2">
                    {{ t('event_elimination.match_not_found', 'Pertandingan Tak Ditemukan') }}
                </h3>
                <p class="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                    {{ t('event_elimination.match_not_found_desc', 'Data pertandingan belum tersedia atau ID pertandingan salah.') }}
                </p>
                <button @click="handleBack"
                    class="w-full sm:w-auto px-6 py-3 bg-navy text-primary font-black text-xs rounded-xl hover:bg-slate-800 transition-all shadow-2xs cursor-pointer active:scale-95">
                    {{ t('event_elimination.back_to_event', 'Kembali ke Event') }}
                </button>
            </div>
        </main>

        <LayoutAppFooter class="shrink-0" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

const { t } = useI18n()
const { get } = useApi()
const route = useRoute()
const router = useRouter()
const matchId = route.params.id

definePageMeta({ layout: 'blank' })

useHead({ title: computed(() => (eventData.value?.name ? `${eventData.value.name} - ` : '') + t('match.title', 'Match') + ' - Archeris') })

const isLoading = ref(true)
const matchData = ref(null)
const eventData = ref(null)
const participantA = ref(null)
const participantB = ref(null)
const ends = ref([])

// ── Fetch ──────────────────────────────────────────────────────────
const fetchMatchData = async () => {
    isLoading.value = true
    try {
        const res = await get(`/match/${matchId}`)
        if (res) {
            matchData.value = res.match
            eventData.value = res.event || null
            participantA.value = res.participant_a
            participantB.value = res.participant_b
            ends.value = res.ends || []
        }
    } catch (e) {
        console.error('Failed to fetch match:', e)
    } finally {
        isLoading.value = false
    }
}

// ── Computed ───────────────────────────────────────────────────────
const formatLabel = computed(() => {
    if (!matchData.value) return '-'
    return matchData.value.format === 'recurve_set'
        ? t('event_elimination.set_system_recurve', 'Sistem Set (Recurve)')
        : t('event_elimination.accumulated_compound', 'Akumulasi Skor (Compound)')
})

const formatLabelMobile = computed(() => {
    if (!matchData.value) return '-'
    return matchData.value.format === 'recurve_set'
        ? t('event_elimination.set_system_short', 'Set (Recurve)')
        : t('event_elimination.accumulated_short', 'Akumulasi')
})

const roundName = computed(() => {
    if (!matchData.value) return ''
    const rNo = matchData.value.round_no
    const matchIdStr = matchData.value.id || ''
    
    if (matchIdStr.includes('GF') || matchIdStr.includes('GOLD') || rNo === 1) {
        if (matchIdStr.includes('BRONZE') || matchIdStr.includes('BM')) return t('event_elimination.bronze_medal_match', 'Perebutan Juara 3 (Perunggu)')
        return t('event_elimination.gold_medal_final', 'Final (Medali Emas)')
    }
    if (matchIdStr.includes('SF') || rNo === 2) {
        return t('event_elimination.semifinal', 'Semifinal')
    }
    if (matchIdStr.includes('QF') || rNo === 4 || rNo === 3) {
        return t('event_elimination.quarterfinal', 'Perempat Final (8 Besar)')
    }
    if (matchIdStr.includes('R16') || rNo === 8) {
        return t('event_elimination.round_of', { count: 16 }, 'Babak 16 Besar')
    }
    if (matchIdStr.includes('R32') || rNo === 16) {
        return t('event_elimination.round_of', { count: 32 }, 'Babak 32 Besar')
    }
    if (matchIdStr.includes('R64') || rNo === 32) {
        return t('event_elimination.round_of', { count: 64 }, 'Babak 64 Besar')
    }
    return t('event_elimination.match_label', { no: matchData.value.match_no || '' })
})

const formatEventDateRange = (startDateStr, endDateStr) => {
    if (!startDateStr) return ''
    try {
        const start = new Date(startDateStr)
        const end = endDateStr ? new Date(endDateStr) : null
        
        const formatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
        if (!end || isNaN(end.getTime()) || start.toDateString() === end.toDateString()) {
            return start.toLocaleDateString('id-ID', formatOptions)
        }
        
        // If same month and year
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${start.getDate()} - ${end.toLocaleDateString('id-ID', formatOptions)}`
        }
        
        return `${start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('id-ID', formatOptions)}`
    } catch {
        return startDateStr
    }
}

const sortedEnds = computed(() => {
    if (!ends.value.length) return []
    const nums = [...new Set(ends.value.map(e => e.end_no))]
    return nums.sort((a, b) => a - b)
})

/** How many arrow columns to render — use bracket config if available, else infer from data */
const maxArrows = computed(() => {
    if (matchData.value?.arrows_per_end) return matchData.value.arrows_per_end
    if (!ends.value.length) return 3
    const maxFromData = Math.max(...ends.value.map(e => (e.arrows || []).length))
    return maxFromData > 0 ? maxFromData : 3
})

/** Running totals for the footer */
const totalScoreA = computed(() =>
    ends.value
        .filter(e => e.side === 'A' && e.end_no !== 99)
        .reduce((s, e) => s + (e.end_total || 0), 0)
)
const totalScoreB = computed(() =>
    ends.value
        .filter(e => e.side === 'B' && e.end_no !== 99)
        .reduce((s, e) => s + (e.end_total || 0), 0)
)

// ── Helpers ────────────────────────────────────────────────────────
const getEndsBySide = (endNo, side) => {
    const end = ends.value.find(e => e.end_no === endNo && e.side === side)
    return end?.arrows || []
}

const getEndTotal = (endNo, side) => {
    const end = ends.value.find(e => e.end_no === endNo && e.side === side)
    return end?.end_total ?? 0
}

const getSidePoints = (side, endNo) => {
    const isSet = matchData.value?.format === 'recurve_set'
    if (!isSet) {
        // Accumulated format: just show this end's total
        return getEndTotal(endNo, side)
    }
    // Set format: 2 pts winner, 1 pt draw, 0 pts loser
    const myTotal = getEndTotal(endNo, side)
    const otherTotal = getEndTotal(endNo, side === 'A' ? 'B' : 'A')
    if (myTotal > otherTotal) return 2
    if (myTotal === otherTotal && myTotal > 0) return 1
    return 0
}

const getRunningScoreDisplay = (endNo) => {
    let ptsA = 0
    let ptsB = 0
    sortedEnds.value.filter(n => n <= endNo).forEach(n => {
        ptsA += getSidePoints('A', n)
        ptsB += getSidePoints('B', n)
    })
    return `${ptsA} – ${ptsB}`
}

const getFinalScore = (side) => {
    if (!matchData.value) return 0
    return matchData.value.format === 'recurve_set'
        ? (side === 'A' ? (matchData.value.total_points_a ?? 0) : (matchData.value.total_points_b ?? 0))
        : (side === 'A' ? (matchData.value.total_score_a ?? 0) : (matchData.value.total_score_b ?? 0))
}

const isWinner = (side) => {
    if (!matchData.value) return false

    // 1. Check explicit winner ID / UUID
    const winnerId = matchData.value.winner_entry_id || matchData.value.winner_id || matchData.value.winner_entry_uuid || matchData.value.winner_uuid
    if (winnerId) {
        if (winnerId === side || winnerId === `Side ${side}` || winnerId === `Pemanah ${side}`) return true

        const idA = matchData.value.entry_a_id || matchData.value.entry_a_uuid || participantA.value?.entry_id || participantA.value?.id || participantA.value?.uuid
        const idB = matchData.value.entry_b_id || matchData.value.entry_b_uuid || participantB.value?.entry_id || participantB.value?.id || participantB.value?.uuid

        if (side === 'A' && idA && (winnerId === idA || String(winnerId) === String(idA))) return true
        if (side === 'B' && idB && (winnerId === idB || String(winnerId) === String(idB))) return true
    }

    // 2. Check winner name
    const winnerName = matchData.value.winner_name || matchData.value.winner
    if (winnerName) {
        if (side === 'A' && (participantA.value?.name === winnerName || matchData.value.entry_a_name === winnerName)) return true
        if (side === 'B' && (participantB.value?.name === winnerName || matchData.value.entry_b_name === winnerName)) return true
    }

    // 3. If match is finished, check final scores
    if (matchData.value.status === 'finished') {
        const scoreA = getFinalScore('A')
        const scoreB = getFinalScore('B')
        if (side === 'A' && scoreA > scoreB) return true
        if (side === 'B' && scoreB > scoreA) return true
    }

    return false
}

/** Arrow color by archery scoring zone */
const getArrowClass = (score) => {
    if (!score || score === '' || score === '–' || score === null)
        return 'bg-slate-50 border-slate-200/80 text-slate-300 font-semibold'
    if (score === 'X' || score === '10' || score === '9')
        return 'bg-amber-300 text-amber-950 border-amber-400 font-black shadow-2xs'
    if (score === '8' || score === '7')
        return 'bg-rose-500 text-white border-rose-600 font-black shadow-2xs'
    if (score === '6' || score === '5')
        return 'bg-sky-500 text-white border-sky-600 font-black shadow-2xs'
    if (score === '4' || score === '3')
        return 'bg-slate-800 text-white border-slate-900 font-black shadow-2xs'
    if (score === 'M')
        return 'bg-slate-200 text-slate-600 border-slate-300 font-bold shadow-2xs'
    return 'bg-slate-100 text-slate-800 border-slate-300 font-bold shadow-2xs'
}

const handleBack = () => router.back()

onMounted(fetchMatchData)
</script>
