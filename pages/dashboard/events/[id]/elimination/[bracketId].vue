<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>

        <template v-else-if="bracket">
            <!-- Enhanced Header Section -->
            <div
                class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm mb-6">
                <!-- Background Pattern -->
                <div class="absolute inset-0 opacity-20"
                    style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
                </div>

                <!-- Decorative Background Elements -->
                <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
                <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
                <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary">
                </div>

                <div class="relative p-5 sm:p-8">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div class="flex items-center sm:items-start gap-3 sm:gap-4 flex-1 min-w-0">
                            <button @click="handleBack"
                                class="p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-white/10 text-white hover:bg-primary hover:text-navy transition-all group shrink-0 backdrop-blur-sm border border-white/20">
                                <Icon icon="ph:arrow-left-bold"
                                    class="text-lg sm:text-xl group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div class="min-w-0">
                                <h1
                                    class="text-lg sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                                    {{ pageTitle }}
                                </h1>
                                <div
                                    class="flex flex-wrap items-center gap-1.5 sm:gap-y-1 text-[10px] sm:text-sm text-slate-300 font-medium overflow-hidden">
                                    <template v-if="categoryInfo">
                                        <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                            <span
                                                class="px-2 py-0.5 rounded bg-primary/20 text-primary text-[9px] sm:text-xs font-black uppercase tracking-wider backdrop-blur-md border border-primary/20">{{
                                                    categoryInfo.division_name }}</span>
                                            <span class="opacity-40 hidden sm:inline">•</span>
                                            <span class="truncate">{{ categoryInfo.category_name }}</span>
                                            <span class="opacity-40 hidden sm:inline">•</span>
                                            <span class="truncate">{{ categoryInfo.event_type_name }}</span>
                                            <span class="opacity-40 hidden sm:inline">•</span>
                                            <span class="truncate">{{ categoryInfo.gender_division_name }}</span>
                                        </div>
                                    </template>
                                    <div v-else class="flex items-center gap-2">
                                        <span
                                            class="px-2 py-0.5 rounded bg-white/5 text-white/40 text-[10px] sm:text-xs font-mono border border-white/5">{{
                                                bracket.bracket_size }} Peserta</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <!-- Tab Switcher (Management Mode) -->
                            <div v-if="currentRoundNo"
                                class="bg-white/10 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl flex gap-1 backdrop-blur-sm border border-white/20">
                                <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
                                    class="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-[10px] sm:text-xs font-black tracking-widest uppercase rounded-lg sm:rounded-xl transition-all flex items-center justify-center gap-2"
                                    :class="activeTab === t.id ? 'bg-primary text-navy shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'">
                                    <Icon :icon="t.icon" class="text-sm sm:text-lg" />
                                    <span>{{ t.label }}</span>
                                </button>
                            </div>

                            <button v-if="!currentRoundNo && (bracket.status === 'draft' || !bracket.generated_at)"
                                @click="generateBracket"
                                class="h-10 sm:h-11 px-6 bg-primary text-navy rounded-xl font-black text-[10px] sm:text-xs tracking-[0.2em] uppercase shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2">
                                <Icon icon="ph:magic-wand-bold" class="text-sm sm:text-lg" />
                                <span>Generate Bracket</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ROUND MANAGEMENT MODE -->
            <div v-if="currentRoundNo" class="space-y-6">
                <!-- TARGET TAB -->
                <div v-if="activeTab === 'target'"
                    class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="p-6 md:p-8">
                        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
                            <div>
                                <h2 class="text-xl font-black text-navy tracking-tight">Penempatan Target</h2>
                                <p class="text-sm text-gray-500 mt-1">Alokasikan target (bantalan) untuk setiap
                                    pertandingan di
                                    babak ini</p>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            <div v-for="match in roundMatches" :key="match.id"
                                class="bg-gray-50/50 rounded-3xl border border-gray-100 p-6 hover:bg-white hover:shadow-navy/5 transition-all group">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="size-10 rounded-2xl bg-navy text-primary flex items-center justify-center text-xs font-black shadow-sm shadow-navy/20">
                                            M{{ match.match_no }}
                                        </div>
                                        <span
                                            class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Match
                                            Detail</span>
                                    </div>
                                    <div v-if="match.winner_entry_id"
                                        class="size-6 rounded-full bg-green-500 text-white flex items-center justify-center">
                                        <Icon icon="ph:check-bold" class="text-xs" />
                                    </div>
                                </div>

                                <div class="space-y-3 mb-6">
                                    <div
                                        class="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                                        <div class="flex items-center gap-3 overflow-hidden">
                                            <div
                                                class="size-8 rounded-xl bg-navy/5 flex items-center justify-center text-[10px] font-black text-navy/40 border border-navy/5 shrink-0">
                                                {{ match.entry_a_seed || '-' }}
                                            </div>
                                            <img :src="getAvatarUrl(match.entry_a_name)"
                                                class="size-8 rounded-full border-2 border-white shadow-sm shrink-0" />
                                            <span class="text-xs font-bold text-navy truncate">{{ match.entry_a_name ||
                                                (match.is_bye ? 'BYE' : 'TBD') }}</span>
                                        </div>
                                        <span
                                            class="text-[9px] font-black text-gray-300 tracking-tighter shrink-0 ml-2">SIDE
                                            A</span>
                                    </div>
                                    <div
                                        class="flex items-center justify-between bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                                        <div class="flex items-center gap-3 overflow-hidden">
                                            <div
                                                class="size-8 rounded-xl bg-navy/5 flex items-center justify-center text-[10px] font-black text-navy/40 border border-navy/5 shrink-0">
                                                {{ match.entry_b_seed || '-' }}
                                            </div>
                                            <img :src="getAvatarUrl(match.entry_b_name)"
                                                class="size-8 rounded-full border-2 border-white shadow-sm shrink-0" />
                                            <span class="text-xs font-bold text-navy truncate">{{ match.entry_b_name ||
                                                'TBD'
                                                }}</span>
                                        </div>
                                        <span
                                            class="text-[9px] font-black text-gray-300 tracking-tighter shrink-0 ml-2">SIDE
                                            B</span>
                                    </div>
                                </div>

                                <div class="relative">
                                    <label
                                        class="text-[9px] font-black text-gray-400 tracking-widest uppercase mb-2 block ml-1">Alokasi
                                        Target</label>
                                    <div class="relative group/select">
                                        <BaseSelect :model-value="match.target_id" :items="targetOptions"
                                            item-title="displayName" item-value="id" placeholder="-- Pilih Target --"
                                            @update:modelValue="val => { match.target_id = val; updateTarget(match) }" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SCORING TAB -->
                <div v-if="activeTab === 'scoring'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
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
                                <button v-for="match in roundMatches" :key="match.id"
                                    @click="selectMatchForScoring(match)"
                                    class="group p-3 rounded-2xl border-2 text-left transition-all relative" :class="[
                                        selectedScoringMatch?.id === match.id
                                            ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                            : 'border-transparent bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-md',
                                        (match.status === 'finished' || match.winner_entry_id) ? 'opacity-60' : ''
                                    ]">

                                    <!-- Match Header -->
                                    <div class="flex items-center justify-between mb-3">
                                        <div class="flex items-center gap-2">
                                            <span
                                                class="size-6 rounded-lg flex items-center justify-center text-[10px] font-black"
                                                :class="selectedScoringMatch?.id === match.id ? 'bg-primary text-navy' : 'bg-slate-200 text-slate-500'">
                                                {{ match.match_no }}
                                            </span>
                                            <span v-if="match.target_number || match.target_name"
                                                class="text-[9px] font-medium text-slate-400">
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
                                                <Icon v-if="match.winner_entry_id === match.entry_a_id"
                                                    icon="ph:crown-fill" class="text-xs text-yellow-500" />
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
                                                <Icon v-if="match.winner_entry_id === match.entry_b_id"
                                                    icon="ph:crown-fill" class="text-xs text-yellow-500" />
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
                                    <Icon icon="ph:target"
                                        class="text-[400px] absolute -right-20 -bottom-20 rotate-12" />
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
                                            <span
                                                class="text-[10px] font-black tracking-[0.3em] text-primary/60 uppercase">Archer
                                                A</span>
                                            <h4
                                                class="font-black text-xl sm:text-2xl leading-tight max-w-[200px] truncate">
                                                {{ selectedScoringMatch.entry_a_name || 'TBD' }}
                                            </h4>
                                        </div>
                                    </div>

                                    <!-- Central Scoreboard -->
                                    <div class="flex flex-col items-center gap-4">
                                        <div
                                            class="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                            <span
                                                class="text-[10px] font-black tracking-[0.4em] text-white/40 uppercase">{{
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
                                            <span
                                                class="text-[9px] font-black tracking-[0.2em] text-green-400 uppercase italic">
                                                MATCH FINISHED
                                            </span>
                                        </div>
                                        <button v-else-if="canEndMatch" @click="endMatch" :disabled="isEndingMatch"
                                            class="px-6 py-2 rounded-xl bg-primary text-navy font-black text-sm tracking-wide hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-primary/30">
                                            <Icon v-if="isEndingMatch" icon="ph:circle-notch-bold"
                                                class="animate-spin" />
                                            <Icon v-else icon="ph:flag-checkered-fill" />
                                            <span>{{ isEndingMatch ? 'Mengakhiri...' : 'Akhiri Match' }}</span>
                                        </button>
                                        <div v-else class="px-4 py-1.5 rounded-xl bg-white/10 border border-white/20">
                                            <span
                                                class="text-[9px] font-black tracking-[0.2em] text-white/40 uppercase">
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
                                            <span
                                                class="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Archer
                                                B</span>
                                            <h4
                                                class="font-black text-xl sm:text-2xl leading-tight max-w-[200px] truncate">
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
                                            @click="currentEnd = i"
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
                                                    @click="activeSide = side">

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
                                                                    {{ side === 'A' ?
                                                                        selectedScoringMatch.entry_a_name
                                                                        : (selectedScoringMatch.entry_b_name || 'TBD')
                                                                    }}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="text-right">
                                                            <span
                                                                class="text-[10px] font-black tracking-widest text-gray-400 block mb-0.5">TOTAL</span>
                                                            <div
                                                                class="text-lg md:text-2xl font-black text-navy tabular-nums">
                                                                {{ calculateEndTotal(selectedScoringMatch.id,
                                                                    currentEnd, side) }}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!-- Arrow Slots -->
                                                    <div class="flex items-center gap-2 md:gap-3">
                                                        <div v-for="i in (bracket?.arrows_per_end || 3)" :key="i"
                                                            class="flex-1 aspect-[4/5] rounded-xl border-2 flex items-center justify-center text-lg md:text-xl font-bold shadow-sm transition-all duration-300 bg-white border-gray-100 text-navy"
                                                            :class="[
                                                                activeSide === side && getCurrentArrowIndex(side) === i
                                                                    ? 'border-primary ring-4 ring-primary/10 scale-105 z-10'
                                                                    : ''
                                                            ]">
                                                            {{ getArrowScore(selectedScoringMatch.id, currentEnd,
                                                                side,
                                                                i) || (activeSide === side && getCurrentArrowIndex(side)
                                                                    ===
                                                                    i ? '' : '-') }}
                                                            <div v-if="activeSide === side && getCurrentArrowIndex(side) === i"
                                                                class="size-1.5 bg-primary rounded-full animate-ping absolute">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <!-- Keyboard -->
                                            <div v-if="activeSide === side"
                                                class="pt-2 animate-in slide-in-from-top-4 duration-300 fade-in">
                                                <div class="grid grid-cols-4 gap-2 md:gap-3">
                                                    <button v-for="num in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'X', 'M']"
                                                        :key="num" @click="addArrowScore(num)"
                                                        class="aspect-square rounded-2xl text-lg md:text-xl font-black shadow-sm transition-all flex items-center justify-center border-b-[3px] active:border-b-0 active:translate-y-[3px]"
                                                        :class="getScoreButtonClass(num)">
                                                        {{ num }}
                                                    </button>

                                                    <div class="col-span-4 grid grid-cols-3 gap-3 pt-4">
                                                        <button @click="deleteLastArrow"
                                                            class="col-span-1 h-12 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 font-bold flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-red-500 hover:border-red-100 transition-all">
                                                            <Icon icon="ph:backspace-bold" class="text-xl" />
                                                            <span
                                                                class="hidden md:inline text-[10px] tracking-widest">HAPUS</span>
                                                        </button>
                                                        <button @click="saveAndNext" :disabled="isSaving"
                                                            class="col-span-2 h-12 rounded-2xl bg-navy text-primary font-black flex items-center justify-center gap-2 shadow-lg shadow-navy/20 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0">
                                                            <Icon v-if="isSaving" icon="ph:circle-notch-bold"
                                                                class="animate-spin text-xl" />
                                                            <template v-else>
                                                                <span class="text-xs tracking-widest uppercase">Simpan
                                                                    &
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
                            <h3 class="text-2xl font-black text-navy tracking-tight">Pilih Match Untuk Input
                                Skor</h3>
                            <p class="text-gray-400 mt-2 max-w-xs">Pilih salah satu pertandingan dari daftar di
                                samping
                                untuk
                                memulai penginputan skor</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BRACKET VIEW MODE -->
            <div v-else class="bracket-visualization rounded-[40px] shadow-sm overflow-hidden border border-gray-100">
                <div class="bracket-scroll-container no-scrollbar">
                    <div v-if="Object.keys(rounds).length > 0" class="flex gap-0 min-w-max">
                        <!-- Each Round -->
                        <template v-for="(roundMatchesInBracket, roundNo) in sortedRounds" :key="roundNo">
                            <div class="bracket-round">
                                <button type="button" @click="navigateToRound(roundNo)"
                                    class="round-label group transition-all"
                                    :class="{ 'final-label': isLastRound(parseInt(roundNo)) }">
                                    <div class="flex items-center gap-3">
                                        <Icon v-if="isLastRound(parseInt(roundNo))" icon="ph:crown-simple-fill"
                                            class="text-primary text-lg" />
                                        <span>{{ getRoundName(parseInt(roundNo)) }}</span>
                                    </div>
                                    <div class="size-1 w-px h-4 bg-gray-200 mx-3 group-hover:bg-primary/30"></div>
                                    <span class="text-[9px] font-black tracking-widest text-primary">Manage</span>
                                </button>

                                <div class="slots-container" :style="{ height: getTotalHeight + 'px' }">
                                    <div v-for="(match, idx) in roundMatchesInBracket" :key="match.id"
                                        class="match-slot" :style="{ height: getSlotHeight(parseInt(roundNo)) + 'px' }">
                                        <!-- Match Card -->
                                        <div class="match-node-card group/card" :class="{
                                            'is-final': isLastRound(parseInt(roundNo)),
                                            'completed': match.winner_entry_id,
                                            'selected': selectedMatch?.id === match.id
                                        }" @click="selectMatch(match)">
                                            <div class="match-card-header">
                                                <div class="flex items-center gap-1.5 opacity-40">
                                                    <Icon icon="ph:trophy-bold" class="text-[10px]" />
                                                    <span class="text-[8px] font-black tracking-widest uppercase">Match
                                                        Node</span>
                                                </div>
                                                <span class="match-meta">#{{ match.match_no }}</span>
                                            </div>
                                            <!-- Side A -->
                                            <div class="archer-item" :class="{
                                                'is-winner': match.winner_entry_id === match.entry_a_id,
                                                'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_a_id
                                            }">
                                                <div class="avatar-wrapper relative">
                                                    <img :src="getAvatarUrl(match.entry_a_name)" alt="avatar"
                                                        class="avatar-img" />
                                                    <div v-if="match.winner_entry_id === match.entry_a_id"
                                                        class="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                                                        <Icon icon="ph:check-bold" class="text-[8px]" />
                                                    </div>
                                                </div>
                                                <div class="archer-info">
                                                    <span class="seed-badge">{{ match.entry_a_seed || '-' }}</span>
                                                    <span class="archer-name">{{ match.entry_a_name || (match.is_bye
                                                        ?
                                                        'BYE' : 'TBD') }}</span>
                                                </div>
                                                <span class="score-display">{{ getMatchScore(match, 'A') }}</span>
                                            </div>
                                            <!-- Side B -->
                                            <div class="archer-item" :class="{
                                                'is-winner': match.winner_entry_id === match.entry_b_id,
                                                'is-loser': match.winner_entry_id && match.winner_entry_id !== match.entry_b_id
                                            }">
                                                <div class="avatar-wrapper relative">
                                                    <img :src="getAvatarUrl(match.entry_b_name)" alt="avatar"
                                                        class="avatar-img" />
                                                    <div v-if="match.winner_entry_id === match.entry_b_id"
                                                        class="absolute -top-1 -right-1 size-4 bg-green-500 rounded-full flex items-center justify-center text-white border-2 border-white">
                                                        <Icon icon="ph:check-bold" class="text-[8px]" />
                                                    </div>
                                                </div>
                                                <div class="archer-info">
                                                    <span class="seed-badge">{{ match.entry_b_seed || '-' }}</span>
                                                    <span class="archer-name">{{ match.entry_b_name || 'TBD'
                                                    }}</span>
                                                </div>
                                                <span class="score-display">{{ getMatchScore(match, 'B') }}</span>
                                            </div>

                                            <div
                                                class="absolute bottom-0 left-0 w-full h-1 bg-gray-100 overflow-hidden opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                <div class="h-full bg-primary"
                                                    :style="{ width: getMatchProgress(match) + '%' }"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Connector lines between rounds -->
                            <div v-if="!isLastRound(parseInt(roundNo))" class="connector-space"
                                :style="{ height: getTotalHeight + 'px' }">
                                <svg class="bracket-svg" :viewBox="`0 0 80 ${getTotalHeight}`"
                                    preserveAspectRatio="none">
                                    <path v-for="i in getMatchesInRound(parseInt(roundNo)) / 2" :key="i"
                                        class="connector-line" :d="calculateConnectorPath(i, parseInt(roundNo))" />
                                </svg>
                            </div>
                        </template>
                    </div>

                    <div v-else class="text-center py-40">
                        <div
                            class="size-32 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-8 border border-gray-100">
                            <Icon icon="ph:brackets-curly-bold" class="text-6xl text-gray-200" />
                        </div>
                        <h2 class="text-3xl font-black text-navy tracking-tight">Bracket Belum Di-generate</h2>
                        <p class="text-gray-400 mt-2 max-w-sm mx-auto">Tentukan partisipan dan generate struktur
                            pertandingan
                            eliminasi untuk memulai babak ini.</p>
                        <button @click="generateBracket"
                            class="mt-10 px-8 py-4 rounded-2xl bg-navy text-primary font-black tracking-widest hover:brightness-110 shadow-sm shadow-navy/30 transition-all flex items-center gap-3 mx-auto">
                            <Icon icon="ph:magic-wand-bold" class="text-2xl" />
                            Generate Bracket Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <!-- Not Found / Error State -->
        <div v-else class="text-center py-20 bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <Icon icon="ph:warning-circle-bold" class="text-8xl text-red-50 mb-4 mx-auto" />
            <h2 class="text-3xl font-black text-navy tracking-tight">Bracket Tidak Ditemukan</h2>
            <p class="text-gray-400 mt-2">UUID bracket atau ID pertandingan tidak valid.</p>
            <button @click="navigateTo(`/dashboard/events/${eventId}/elimination`)"
                class="mt-10 px-6 py-3 rounded-2xl border-2 border-navy text-navy font-black tracking-widest hover:bg-navy hover:text-white transition-all">
                Kembali ke Daftar
            </button>
        </div>
    </div>

    <!-- End Match Confirmation Dialog -->
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="showEndMatchDialog"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div
                    class="relative w-full max-w-lg bg-gradient-to-br from-navy via-navy to-navy/95 rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
                    <!-- Decorative Elements -->
                    <div class="absolute inset-0 opacity-10 pointer-events-none">
                        <Icon icon="ph:target"
                            class="text-[300px] absolute -right-16 -bottom-16 rotate-12 text-white/20" />
                        <Icon icon="ph:trophy"
                            class="text-[150px] absolute -left-10 -top-10 -rotate-12 text-primary/30" />
                    </div>
                    <div
                        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary">
                    </div>

                    <div class="relative p-8 text-center">
                        <!-- Title -->
                        <div class="mb-6">
                            <Icon icon="ph:flag-checkered-fill" class="text-5xl text-primary mb-3" />
                            <h2 class="text-2xl font-black text-white tracking-tight">Akhiri Pertandingan?</h2>
                            <p class="text-white/60 text-sm mt-1">Konfirmasi untuk mengakhiri dan menentukan pemenang
                            </p>
                        </div>

                        <!-- Battle Display -->
                        <div v-if="selectedScoringMatch" class="bg-white/5 rounded-2xl p-6 border border-white/10 mb-6">
                            <div class="flex items-center justify-center gap-4">
                                <!-- Side A -->
                                <div class="flex-1 text-center">
                                    <img :src="getAvatarUrl(selectedScoringMatch.entry_a_name)"
                                        class="size-16 rounded-2xl border-2 mx-auto mb-2"
                                        :class="getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') ? 'border-primary shadow-lg shadow-primary/30' : 'border-white/20'" />
                                    <div class="font-bold text-white text-sm truncate max-w-[120px] mx-auto">
                                        {{ selectedScoringMatch.entry_a_name || 'TBD' }}
                                    </div>
                                    <div class="text-3xl font-black mt-2"
                                        :class="getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B') ? 'text-primary' : 'text-white/60'">
                                        {{ getMatchScore(selectedScoringMatch, 'A') }}
                                    </div>
                                    <div v-if="getMatchScore(selectedScoringMatch, 'A') > getMatchScore(selectedScoringMatch, 'B')"
                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black tracking-wider mt-2">
                                        <Icon icon="ph:crown-simple-fill" class="text-xs" />
                                        MENANG
                                    </div>
                                </div>

                                <!-- VS -->
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="size-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                                        <span class="text-xs font-black text-white/60 tracking-widest">VS</span>
                                    </div>
                                </div>

                                <!-- Side B -->
                                <div class="flex-1 text-center">
                                    <img :src="getAvatarUrl(selectedScoringMatch.entry_b_name)"
                                        class="size-16 rounded-2xl border-2 mx-auto mb-2"
                                        :class="getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') ? 'border-primary shadow-lg shadow-primary/30' : 'border-white/20'" />
                                    <div class="font-bold text-white text-sm truncate max-w-[120px] mx-auto">
                                        {{ selectedScoringMatch.entry_b_name || 'TBD' }}
                                    </div>
                                    <div class="text-3xl font-black mt-2"
                                        :class="getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A') ? 'text-primary' : 'text-white/60'">
                                        {{ getMatchScore(selectedScoringMatch, 'B') }}
                                    </div>
                                    <div v-if="getMatchScore(selectedScoringMatch, 'B') > getMatchScore(selectedScoringMatch, 'A')"
                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-black tracking-wider mt-2">
                                        <Icon icon="ph:crown-simple-fill" class="text-xs" />
                                        MENANG
                                    </div>
                                </div>
                            </div>

                            <!-- Tie Warning -->
                            <div v-if="getMatchScore(selectedScoringMatch, 'A') === getMatchScore(selectedScoringMatch, 'B')"
                                class="mt-4 p-3 rounded-xl bg-orange-500/20 border border-orange-500/30 text-orange-300 text-sm">
                                <Icon icon="ph:warning-fill" class="inline mr-1" />
                                Skor seri! Tidak dapat mengakhiri pertandingan dengan skor yang sama.
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="flex gap-3">
                            <button @click="showEndMatchDialog = false"
                                class="flex-1 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition-all">
                                Batal
                            </button>
                            <button @click="confirmEndMatch"
                                :disabled="isEndingMatch || (selectedScoringMatch && getMatchScore(selectedScoringMatch, 'A') === getMatchScore(selectedScoringMatch, 'B'))"
                                class="flex-1 px-6 py-3 rounded-xl bg-primary text-navy font-black tracking-wide hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <Icon v-if="isEndingMatch" icon="ph:circle-notch-bold" class="animate-spin" />
                                <Icon v-else icon="ph:check-bold" />
                                <span>{{ isEndingMatch ? 'Memproses...' : 'Konfirmasi' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import BaseSelect from '~/components/common/BaseSelect.vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: computed(() => `${pageTitle.value} - ArcheryHub Dashboard`)
})

const route = useRoute()
const router = useRouter()
const eventId = route.params.id
const bracketId = route.params.bracketId
const { get, post, put } = useApi()
const toast = useToast()

const isLoading = ref(true)
const isSaving = ref(false)
const bracket = ref(null)
const categoryInfo = ref(null)
const entries = ref([])
const matches = ref([])
const rounds = ref({})
const selectedMatch = ref(null)
const availableTargets = ref([])

const targetOptions = computed(() => {
    return availableTargets.value.map(t => ({
        ...t,
        displayName: `Target ${t.name}`
    }))
})

// Round Management States
const activeTab = ref(route.query.mode === 'scoring' ? 'scoring' : 'target')
const tabs = [
    { id: 'target', label: 'Target', icon: 'ph:target-bold' },
    { id: 'scoring', label: 'Scoring', icon: 'ph:pencil-circle-bold' }
]

// Sync activeTab with route query
watch(() => route.query.mode, (newMode) => {
    if (newMode === 'scoring' || newMode === 'target') {
        activeTab.value = newMode
    }
})

watch(activeTab, (newTab) => {
    const query = { ...route.query, mode: newTab }
    router.replace({ query })
})

// Reset selected match when round changes - fixes caching issue
watch(() => route.query.round, (newRound, oldRound) => {
    if (newRound !== oldRound) {
        selectedScoringMatch.value = null
        currentEnd.value = 1
        activeSide.value = 'A'
    }
})

const currentRoundNo = computed(() => route.query.round)
const roundMatches = computed(() => {
    if (!currentRoundNo.value) return []
    return rounds.value[currentRoundNo.value] || []
})

const pageTitle = computed(() => {
    const catName = bracket.value?.category_name || 'Bagan Eliminasi'
    if (!currentRoundNo.value) return catName
    return `${catName} - ${getRoundName(parseInt(currentRoundNo.value))}`
})

const statusBadgeClasses = computed(() => {
    const s = bracket.value?.status
    if (s === 'running') return 'bg-blue-500 text-white shadow-blue-200'
    if (s === 'finished') return 'bg-green-500 text-white shadow-green-200'
    if (s === 'generated') return 'bg-navy text-primary shadow-navy/20'
    return 'bg-gray-100 text-gray-400 border border-gray-200'
})

// Check if match can be ended - requires at least one completed end
const canEndMatch = computed(() => {
    if (!selectedScoringMatch.value) return false
    const matchId = selectedScoringMatch.value.id
    const m = matchEnds.value[matchId]
    if (!m) return false

    // Check if at least one end has been completed by both sides
    const arrowsPerEnd = bracket.value?.arrows_per_end || 3
    for (let i = 1; i <= (bracket.value?.ends_per_match || 5); i++) {
        const hasA = m.A?.[i]?.arrows?.length === arrowsPerEnd
        const hasB = m.B?.[i]?.arrows?.length === arrowsPerEnd
        if (hasA && hasB) return true
    }
    return false
})

// Scoring States
const selectedScoringMatch = ref(null)
const activeSide = ref('A')
const currentEnd = ref(1)
const matchEnds = ref({}) // { matchId: { side: { endNo: { total: 0, arrows: [] } } } }
const isEndingMatch = ref(false)
const showEndMatchDialog = ref(false)

const fetchBracket = async () => {
    isLoading.value = true
    try {
        const response = await get(`/events/${eventId}/elimination/brackets/${bracketId}`)
        bracket.value = response?.bracket || null
        entries.value = response?.entries || []
        matches.value = response?.matches || []
        rounds.value = response?.rounds || {}

        if (bracket.value?.category_id) {
            fetchCategoryDetails(bracket.value.category_id)
        }
    } catch (error) {
        console.error('Failed to fetch bracket:', error)
        toast.error('Gagal memuat bracket')
    } finally {
        isLoading.value = false
    }
}

const fetchCategoryDetails = async (categoryUuid) => {
    try {
        const response = await get(`/events/${eventId}/categories`)
        const cats = response?.events || response.data?.events || []
        categoryInfo.value = cats.find(c => (c.id === categoryUuid || c.uuid === categoryUuid))
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const fetchAvailableTargets = async () => {
    try {
        const response = await get(`/events/${eventId}/targets/options`)
        const options = response?.options || response.data?.options || []
        availableTargets.value = options.map(o => ({
            id: o.uuid || o.id,
            name: o.value || o.name || o.target_no
        }))
    } catch (error) {
        console.error('Failed to fetch targets:', error)
    }
}

const generateBracket = async () => {
    try {
        await post(`/events/${eventId}/elimination/brackets/${bracketId}/generate`)
        toast.success('Bracket berhasil di-generate')
        await fetchBracket()
    } catch (error) {
        console.error('Failed to generate bracket:', error)
        toast.error('Gagal generate bracket')
    }
}

const navigateToRound = (roundNo) => {
    router.push({ query: { ...route.query, round: roundNo } })
}

const selectMatch = (match) => {
    selectedMatch.value = selectedMatch.value?.id === match.id ? null : match
}

const handleBack = () => {
    if (currentRoundNo.value) {
        router.push({ query: {} })
    } else {
        navigateTo(`/dashboard/events/${eventId}/elimination`)
    }
}

const selectMatchForScoring = (match) => {
    selectedScoringMatch.value = match
    activeSide.value = 'A'
    currentEnd.value = 1
    fetchMatchScores(match.id)
}

const fetchMatchScores = async (matchId) => {
    try {
        const response = await get(`/events/${eventId}/elimination/brackets/${bracketId}/matches/${matchId}`)
        const ends = response?.ends || []

        if (!matchEnds.value[matchId]) {
            const initEnds = {}
            for (let i = 1; i <= (bracket.value?.ends_per_match || 5); i++) {
                initEnds[i] = { total: 0, arrows: [] }
            }
            matchEnds.value[matchId] = {
                A: JSON.parse(JSON.stringify(initEnds)),
                B: JSON.parse(JSON.stringify(initEnds))
            }
        }

        ends.forEach(end => {
            const side = end.side
            const endNo = end.end_no
            if (matchEnds.value[matchId][side] && matchEnds.value[matchId][side][endNo]) {
                matchEnds.value[matchId][side][endNo].total = end.end_total
                matchEnds.value[matchId][side][endNo].arrows = end.arrows || []
            }
        })
    } catch (e) {
        console.error('Failed to fetch match scores:', e)
    }
}

const getAvatarUrl = (name) => {
    if (!name || name === 'TBD' || name === 'BYE') return 'https://api.dicebear.com/7.x/initials/svg?seed=??&backgroundColor=f1f5f9'
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=ffaa00`
}

const getMatchScore = (match, side) => {
    const isRecurve = bracket.value?.format === 'recurve_set'
    const sideKey = side === 'A' ? 'A' : 'B'
    const otherSideKey = side === 'A' ? 'B' : 'A'

    if (match.winner_entry_id) {
        const isWinner = match.winner_entry_id === (side === 'A' ? match.entry_a_id : match.entry_b_id)
        if (isRecurve) {
            const m = matchEnds.value[match.id]
            if (m) return calculateSetPoints(match.id, sideKey)
            return isWinner ? '6' : '0'
        }
        return isWinner ? 'W' : 'L'
    }

    const m = matchEnds.value[match.id]
    if (!m) return '-'

    if (isRecurve) {
        return calculateSetPoints(match.id, sideKey)
    }
    return Object.values(m[sideKey] || {}).reduce((s, e) => s + (e.total || 0), 0) || '0'
}

const calculateSetPoints = (matchId, side) => {
    const m = matchEnds.value[matchId]
    if (!m) return 0

    let setPointsA = 0
    let setPointsB = 0

    const totalEnds = bracket.value?.ends_per_match || 5
    const arrowsPerEnd = bracket.value?.arrows_per_end || 3

    for (let i = 1; i <= totalEnds; i++) {
        const endA = m.A[i]
        const endB = m.B[i]

        // Only count if both have finished the end
        if (endA.arrows.length === arrowsPerEnd && endB.arrows.length === arrowsPerEnd) {
            if (endA.total > endB.total) {
                setPointsA += 2
            } else if (endA.total < endB.total) {
                setPointsB += 2
            } else {
                setPointsA += 1
                setPointsB += 1
            }
        }

        // Stop if someone reached 6 points
        if (setPointsA >= 6 || setPointsB >= 6) break
    }

    return side === 'A' ? setPointsA : setPointsB
}

const getMatchProgress = (match) => {
    if (match.winner_entry_id) return 100
    const m = matchEnds.value[match.id]
    if (!m) return 0
    const scoredEnds = Object.values(m.A).filter(e => e.arrows.length > 0).length
    const totalEnds = bracket.value?.ends_per_match || 5
    return Math.min(scoredEnds * (100 / totalEnds), 95)
}

const getArrowScore = (matchId, endNo, side, arrowIdx) => {
    return matchEnds.value[matchId]?.[side]?.[endNo]?.arrows?.[arrowIdx - 1] || '-'
}

const calculateEndTotal = (matchId, endNo, side) => {
    return matchEnds.value[matchId]?.[side]?.[endNo]?.total || 0
}

const addArrowScore = (score) => {
    if (!selectedScoringMatch.value) return
    const matchId = selectedScoringMatch.value.id
    const side = activeSide.value
    const endNo = currentEnd.value

    if (!matchEnds.value[matchId]) {
        const initEnds = {}
        for (let i = 1; i <= (bracket.value?.ends_per_match || 5); i++) {
            initEnds[i] = { total: 0, arrows: [] }
        }
        matchEnds.value[matchId] = {
            A: JSON.parse(JSON.stringify(initEnds)),
            B: JSON.parse(JSON.stringify(initEnds))
        }
    }
    const end = matchEnds.value[matchId][side][endNo]

    if (end.arrows.length < (bracket.value?.arrows_per_end || 3)) {
        end.arrows.push(score)
        const val = score === 'X' ? 10 : (score === 'M' ? 0 : parseInt(score) || 0)
        end.total += val
    }
}

const deleteLastArrow = () => {
    if (!selectedScoringMatch.value) return
    const end = matchEnds.value[selectedScoringMatch.value.id][activeSide.value][currentEnd.value]
    if (end.arrows.length > 0) {
        const last = end.arrows.pop()
        const val = last === 'X' ? 10 : (last === 'M' ? 0 : parseInt(last) || 0)
        end.total -= val
    }
}

const saveAndNext = async () => {
    if (!selectedScoringMatch.value) return
    isSaving.value = true
    try {
        const matchId = selectedScoringMatch.value.id
        const arrowsA = matchEnds.value[matchId].A[currentEnd.value].arrows.map(a => String(a))
        const arrowsB = matchEnds.value[matchId].B[currentEnd.value].arrows.map(a => String(a))

        await post(`/events/${eventId}/elimination/brackets/${bracketId}/matches/${matchId}/score`, {
            end_no: currentEnd.value,
            score_a: matchEnds.value[matchId].A[currentEnd.value].total,
            score_b: matchEnds.value[matchId].B[currentEnd.value].total,
            arrows_a: arrowsA,
            arrows_b: arrowsB
        })

        toast.success(`Skor End ${currentEnd.value} Berhasil Disimpan`)

        if (activeSide.value === 'A') {
            activeSide.value = 'B'
        } else {
            activeSide.value = 'A'
            if (currentEnd.value < (bracket.value?.ends_per_match || 5)) currentEnd.value++
        }
    } catch (e) {
        toast.error('Gagal menyimpan skor')
    } finally {
        isSaving.value = false
    }
}

const endMatch = () => {
    if (!selectedScoringMatch.value || !canEndMatch.value) return
    showEndMatchDialog.value = true
}

const confirmEndMatch = async () => {
    if (!selectedScoringMatch.value) return

    isEndingMatch.value = true
    try {
        const matchId = selectedScoringMatch.value.id

        // Call API endpoint that will auto-calculate winner from saved scores
        await post(`/events/${eventId}/elimination/brackets/${bracketId}/matches/${matchId}/end`)

        toast.success('Pertandingan berhasil diakhiri!')

        // Close dialog
        showEndMatchDialog.value = false

        // Refresh bracket data to get updated matches
        await fetchBracket()

        // Deselect the match after ending
        selectedScoringMatch.value = null

    } catch (e) {
        console.error('Failed to end match:', e)
        toast.error('Gagal mengakhiri pertandingan')
    } finally {
        isEndingMatch.value = false
    }
}

const updateTarget = async (match) => {
    try {
        await put(`/events/${eventId}/elimination/brackets/${bracketId}/targets`, {
            assignments: [
                {
                    match_id: match.id,
                    target_id: match.target_id
                }
            ]
        })
        toast.success('Lokasi target diupdate')
    } catch (e) {
        toast.error('Gagal mengupdate target')
    }
}

const canFinishMatch = (match) => {
    if (!match || match.winner_entry_id) return false
    const m = matchEnds.value[match.id]
    if (!m) return false

    // Check if at least one arrow is scored to enable finishing
    const hasAnyArrow = Object.values(m.A).some(e => e.arrows.length > 0) ||
        Object.values(m.B).some(e => e.arrows.length > 0)

    return hasAnyArrow
}

const finishMatchAction = async (match) => {
    try {
        const isRecurve = bracket.value?.format === 'recurve_set'
        let winnerId;

        if (isRecurve) {
            const pointsA = calculateSetPoints(match.id, 'A')
            const pointsB = calculateSetPoints(match.id, 'B')
            winnerId = pointsA >= pointsB ? match.entry_a_id : match.entry_b_id
        } else {
            const totalA = Object.values(matchEnds.value[match.id].A).reduce((s, e) => s + e.total, 0)
            const totalB = Object.values(matchEnds.value[match.id].B).reduce((s, e) => s + e.total, 0)
            winnerId = totalA >= totalB ? match.entry_a_id : match.entry_b_id
        }

        await post(`/events/${eventId}/elimination/brackets/${bracketId}/matches/${match.id}/finish`, {
            winner_entry_id: winnerId
        })
        toast.success('Pertandingan Selesai!')
        await fetchBracket()
        selectedScoringMatch.value = null
    } catch (e) {
        toast.error('Gagal menutup match')
    }
}

const getFullTargetName = (match) => {
    if (!match) return 'Belum Ada Target'
    if (match.target_number && match.target_name) return `Target ${match.target_number} - ${match.target_name}`
    if (match.target_number) return `Target ${match.target_number}`
    if (match.target_name) return match.target_name.startsWith('Target') ? match.target_name : `Target ${match.target_name}`
    return getTargetName(match.target_id || match.target_uuid)
}

const getTargetName = (tid) => {
    if (!tid) return 'Belum Ada Target'
    const t = availableTargets.value.find(o => o.id === tid)
    return t ? `Target ${t.name}` : 'Target Terpilih'
}

const formatDate = (d) => dayjs(d).format('DD MMM YYYY, HH:mm')
const timeAgo = (d) => dayjs(d).fromNow()

// Bracket visualization
const BASE_MATCH_HEIGHT = 160

const sortedRounds = computed(() => {
    const roundKeys = Object.keys(rounds.value).sort((a, b) => parseInt(a) - parseInt(b))
    const sorted = {}
    roundKeys.forEach(key => { sorted[key] = rounds.value[key] })
    return sorted
})

const getTotalRounds = computed(() => Object.keys(rounds.value).length)
const getTotalHeight = computed(() => ((bracket.value?.bracket_size || 8) / 2) * BASE_MATCH_HEIGHT)

const getSlotHeight = (roundNo) => {
    const size = bracket.value?.bracket_size || 8
    const firstRoundMatches = size / 2
    const matchesInRound = firstRoundMatches / Math.pow(2, roundNo - 1)
    return (getTotalHeight.value / matchesInRound)
}

const getMatchesInRound = (roundNo) => {
    const size = bracket.value?.bracket_size || 8
    return (size / 2) / Math.pow(2, roundNo - 1)
}

const isLastRound = (roundNo) => roundNo === getTotalRounds.value

const calculateConnectorPath = (i, roundNo) => {
    const slotHeight = getSlotHeight(roundNo)
    const nextSlotHeight = getSlotHeight(roundNo + 1)
    const y1 = (i - 1) * nextSlotHeight + slotHeight / 2
    const y2 = (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight
    const targetY = (i - 1) * nextSlotHeight + nextSlotHeight / 2
    return `M 0 ${y1} H 40 V ${targetY} H 80 M 0 ${y2} H 40 V ${targetY} H 80`
}

const getRoundName = (roundNo) => {
    const size = bracket.value?.bracket_size || 8
    const totalRounds = Math.log2(size)
    const roundFromEnd = totalRounds - roundNo + 1
    if (roundFromEnd === 1) return 'Final'
    if (roundFromEnd === 2) return 'Semifinal'
    if (roundFromEnd === 3) return 'Quarterfinal'
    return `Round of ${Math.pow(2, roundFromEnd)}`
}



const getFormatLabel = (format) => {
    const labels = { recurve_set: 'SET SYSTEM', compound_total: 'TOTAL SCORE' }
    return labels[format] || format
}

const getScoreColorClass = (score) => {
    const s = String(score).toUpperCase()
    if (['X', '10', '9'].includes(s)) return 'bg-[#FFF5C2] text-[#B7990D] border-[#FFE76C]'
    if (['8', '7'].includes(s)) return 'bg-red-50 text-red-600 border-red-100' // Red
    if (['6', '5'].includes(s)) return 'bg-blue-50 text-blue-600 border-blue-100' // Blue
    if (['4', '3'].includes(s)) return 'bg-gray-900 text-white border-black' // Black
    if (['2', '1'].includes(s)) return 'bg-white text-navy border-gray-200' // White
    if (s === 'M') return 'bg-slate-100 text-slate-400 border-slate-200' // Miss
    return 'bg-white text-navy border-gray-200'
}

const getScoreButtonClass = (score) => {
    const s = String(score).toUpperCase()
    // For keyboard, use stronger colors
    if (['X', '10', '9'].includes(s)) return 'bg-yellow-400 text-navy border-yellow-500 hover:bg-yellow-300'
    if (['8', '7'].includes(s)) return 'bg-red-500 text-white border-red-600 hover:bg-red-400'
    if (['6', '5'].includes(s)) return 'bg-blue-500 text-white border-blue-600 hover:bg-blue-400'
    if (['4', '3'].includes(s)) return 'bg-slate-800 text-white border-black hover:bg-black'
    if (['2', '1'].includes(s)) return 'bg-white text-navy border-gray-200 hover:bg-gray-50'
    if (s === 'M') return 'bg-slate-200 text-slate-500 border-slate-300 hover:bg-slate-300'
    return 'bg-white text-navy border-gray-200'
}

const getCurrentArrowIndex = (side) => {
    if (!selectedScoringMatch.value) return 1
    const totalArrows = bracket.value?.arrows_per_end || 3
    for (let i = 1; i <= totalArrows; i++) {
        if (!getArrowScore(selectedScoringMatch.value.id, currentEnd.value, side, i)) {
            return i
        }
    }
    return -1
}

// Auto-select first match when in scoring mode and roundMatches are loaded
watch(roundMatches, (newMatches) => {
    if (activeTab.value === 'scoring' && newMatches.length > 0 && !selectedScoringMatch.value) {
        // Find first non-finished match, or just the first match
        const firstMatch = newMatches.find(m => m.status !== 'finished' && !m.winner_entry_id) || newMatches[0]
        if (firstMatch) {
            selectMatchForScoring(firstMatch)
        }
    }
}, { immediate: true })

onMounted(async () => {
    await fetchBracket()
    await fetchAvailableTargets()

    // Auto-select first match if in scoring mode with a round selected
    if (activeTab.value === 'scoring' && currentRoundNo.value && roundMatches.value.length > 0 && !selectedScoringMatch.value) {
        const firstMatch = roundMatches.value.find(m => m.status !== 'finished' && !m.winner_entry_id) || roundMatches.value[0]
        if (firstMatch) {
            selectMatchForScoring(firstMatch)
        }
    }
})
</script>

<style scoped>
.bracket-visualization {
    @apply bg-[#f8fafc] relative;
    background-image:
        radial-gradient(#e2e8f0 1.5px, transparent 1.5px);
    background-size: 32px 32px;
}

.bracket-scroll-container {
    @apply overflow-x-auto p-16 pb-24 relative z-10;
}

.bracket-round {
    @apply flex flex-col items-center min-w-[340px];
}

.round-label {
    @apply text-[11px] font-black text-primary tracking-widest py-3 px-8 bg-navy rounded-2xl shadow-lg border border-white/10 shrink-0 flex items-center justify-center mb-16;
}

.final-label {
    @apply bg-navy text-primary border-none ring-8 ring-primary/5;
}

.match-slot {
    @apply flex items-center justify-center w-full;
}

.match-node-card {
    @apply relative w-[300px] bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-500 cursor-pointer overflow-hidden;
    height: 140px;
}

.match-node-card:hover {}

.match-node-card.selected {
    @apply ring-8 ring-primary/10 border-primary shadow-sm z-20;
}

.match-node-card.completed {
    @apply border-green-500/20 shadow-green-100;
}

.match-card-header {
    @apply flex justify-between items-center px-5 py-2.5 bg-slate-50 border-b border-gray-50;
}

.status-badge {
    @apply text-[9px] font-bold tracking-wider px-2.5 py-1 rounded-lg;
}

.match-meta {
    @apply text-[10px] font-black text-gray-300;
}

.archer-item {
    @apply flex items-center gap-3 px-4 py-2.5 transition-all relative h-[52px];
}

.avatar-img {
    @apply size-9 rounded-xl border-2 border-gray-100 object-cover bg-slate-50;
}

.archer-info {
    @apply flex items-center gap-3 flex-1 min-w-0;
}

.seed-badge {
    @apply size-6 rounded-lg bg-navy/5 text-navy/40 text-[10px] font-black flex items-center justify-center border border-navy/5;
}

.archer-name {
    @apply text-xs font-bold text-navy truncate tracking-tight;
}

.score-display {
    @apply text-xl font-black text-navy tabular-nums min-w-[40px] text-right flex items-center justify-end px-4 h-full border-l border-gray-50 bg-gray-50/30;
}

.is-winner {
    @apply bg-primary/[0.03];
}

.is-winner .score-display {
    @apply text-primary text-2xl drop-shadow-sm bg-primary/[0.05] border-primary/10;
}

.is-winner .archer-name {
    @apply text-navy font-black;
}

.is-loser {
    @apply opacity-50 grayscale-[0.5];
}

.connector-space {
    @apply w-[80px] relative shrink-0;
    margin-top: 50px;
}

.connector-line {
    @apply fill-none stroke-gray-200 stroke-[3px] transition-all duration-500 opacity-60;
}

.bracket-round:hover+.connector-space .connector-line {
    @apply stroke-primary/30 stroke-[4px] opacity-100;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
    transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from>div,
.modal-leave-to>div {
    transform: scale(0.9) translateY(20px);
}

.modal-enter-active>div,
.modal-leave-active>div {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>