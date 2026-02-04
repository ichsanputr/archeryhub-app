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

                <div class="relative p-6 sm:p-8">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div class="flex items-start gap-4 flex-1 min-w-0">
                            <button @click="handleBack"
                                class="p-3 rounded-2xl bg-white/10 text-white hover:bg-primary hover:text-navy transition-all group shrink-0 backdrop-blur-sm border border-white/20">
                                <Icon icon="ph:arrow-left-bold"
                                    class="text-xl group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div class="min-w-0">
                                <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                    {{ pageTitle }}
                                </h1>
                                <div
                                    class="flex flex-wrap items-center gap-y-1 text-xs sm:text-sm text-slate-300 font-medium overflow-hidden">
                                    <template v-if="categoryInfo">
                                        <span class="px-2 py-0.5 rounded-md bg-primary text-navy font-bold">{{
                                            categoryInfo.division_name }}</span>
                                        <Icon icon="ph:dot-bold" class="text-white/20 text-lg mx-0.5" />
                                        <span>{{ categoryInfo.category_name }}</span>
                                        <Icon icon="ph:dot-bold" class="text-white/20 text-lg mx-0.5" />
                                        <span>{{ categoryInfo.event_type_name }}</span>
                                        <Icon icon="ph:dot-bold" class="text-white/20 text-lg mx-0.5" />
                                        <span>{{ categoryInfo.gender_division_name }}</span>
                                        <Icon icon="ph:dot-bold" class="text-white/20 text-lg mx-0.5" />
                                    </template>
                                    <span class="font-mono text-white/40">{{ bracket.bracket_size }} Peserta</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-3">
                            <!-- Format & Status -->
                            <div class="flex flex-col items-end gap-1.5 order-2 md:order-1 hidden sm:flex">
                                <span class="text-[10px] font-black tracking-widest text-white/40">Status
                                    Bracket</span>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="px-3 py-1 rounded-full bg-white/10 text-[10px] font-black text-primary border border-white/10">
                                        {{ getFormatLabel(bracket.format) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Tab Switcher (Management Mode) -->
                            <div v-if="currentRoundNo"
                                class="bg-white/10 p-1.5 rounded-2xl flex gap-1 order-1 md:order-2 backdrop-blur-sm border border-white/20">
                                <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
                                    class="px-5 py-2.5 text-xs font-black tracking-wider rounded-xl transition-all flex items-center gap-2"
                                    :class="activeTab === t.id ? 'bg-primary text-navy shadow-sm' : 'text-slate-300 hover:text-white hover:bg-white/10'">
                                    <Icon :icon="t.icon" class="text-lg" />
                                    {{ t.label }}
                                </button>
                            </div>

                            <button v-if="!currentRoundNo && (bracket.status === 'draft' || !bracket.generated_at)"
                                @click="generateBracket"
                                class="h-11 px-5 bg-primary text-navy rounded-xl font-black text-xs tracking-wider shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center gap-2">
                                <Icon icon="ph:magic-wand" class="text-lg" />
                                Generate Bracket
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
                                class="bg-gray-50/50 rounded-3xl border border-gray-100 p-6 hover:bg-white hover:shadow-xl hover:shadow-navy/5 transition-all group">
                                <div class="flex items-center justify-between mb-6">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="size-10 rounded-2xl bg-navy text-primary flex items-center justify-center text-xs font-black shadow-lg shadow-navy/20">
                                            M{{ match.match_no }}
                                        </div>
                                        <span
                                            class="text-[10px] font-black text-gray-400 tracking-widest uppercase">Match
                                            Detail</span>
                                    </div>
                                    <div v-if="match.status === 'finished'"
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
                                        <select v-model="match.target_id" @change="updateTarget(match)"
                                            class="w-full px-5 py-3.5 rounded-2xl bg-white border-2 border-gray-200 text-navy font-bold focus:border-primary focus:outline-none transition-all text-sm appearance-none shadow-sm cursor-pointer group-hover/select:border-gray-300">
                                            <option value="">-- Pilih Target --</option>
                                            <option v-for="target in availableTargets" :key="target.id"
                                                :value="target.id">
                                                Target {{ target.name }}
                                            </option>
                                        </select>
                                        <Icon icon="ph:caret-down-bold"
                                            class="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-hover/select:text-navy transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SCORING TAB -->
                <div v-if="activeTab === 'input'" class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <!-- Matches Navigation / Selector -->
                    <div class="lg:col-span-4 xl:col-span-3">
                        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-6">
                            <h3 class="text-xs font-black tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <Icon icon="ph:list-bullets" class="text-lg" />
                                Match List
                            </h3>
                            <div class="flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
                                <button v-for="match in roundMatches" :key="match.id"
                                    @click="selectMatchForScoring(match)"
                                    class="group p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden"
                                    :class="selectedScoringMatch?.id === match.id
                                        ? 'border-primary bg-primary/5 shadow-sm'
                                        : 'border-transparent bg-slate-50 hover:bg-white hover:border-gray-200'">

                                    <div class="flex justify-between items-center mb-3">
                                        <span class="text-[10px] font-black tracking-tighter"
                                            :class="selectedScoringMatch?.id === match.id ? 'text-primary' : 'text-gray-400'">Match
                                            {{ match.match_no }}</span>
                                        <div v-if="match.status === 'finished'"
                                            class="size-5 rounded-full bg-green-500 text-white flex items-center justify-center">
                                            <Icon icon="ph:check-bold" class="text-[10px]" />
                                        </div>
                                    </div>

                                    <div class="flex flex-col gap-2">
                                        <div class="flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-2 min-w-0 overflow-hidden">
                                                <img :src="getAvatarUrl(match.entry_a_name)"
                                                    class="size-6 rounded-full border border-gray-100 shadow-sm shrink-0" />
                                                <span class="text-[11px] font-bold text-navy truncate">{{
                                                    match.entry_a_name || 'TBD'
                                                }}</span>
                                            </div>
                                            <span class="text-xs font-black text-navy shrink-0">{{ getMatchScore(match,
                                                'A')
                                            }}</span>
                                        </div>
                                        <div class="h-1 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-primary"
                                                :style="{ width: getMatchProgress(match) + '%' }"></div>
                                        </div>
                                        <div class="flex items-center justify-between gap-3">
                                            <div class="flex items-center gap-2 min-w-0 overflow-hidden">
                                                <img :src="getAvatarUrl(match.entry_b_name)"
                                                    class="size-6 rounded-full border border-gray-100 shadow-sm shrink-0" />
                                                <span class="text-[11px] font-bold text-navy truncate">{{
                                                    match.entry_b_name || 'TBD'
                                                }}</span>
                                            </div>
                                            <span class="text-xs font-black text-navy shrink-0">{{ getMatchScore(match,
                                                'B')
                                            }}</span>
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
                                class="bg-navy rounded-[40px] p-8 sm:p-12 flex flex-col items-center justify-center gap-8 text-white shadow-xl overflow-hidden relative border border-white/5">
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
                                                getTargetName(selectedScoringMatch.target_id) }}</span>
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

                                        <div v-if="selectedScoringMatch.status === 'finished'"
                                            class="px-4 py-1.5 rounded-xl bg-green-500/20 border border-green-500/30">
                                            <span
                                                class="text-[9px] font-black tracking-[0.2em] text-green-400 uppercase italic">MATCH
                                                FINISHED</span>
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

                                    <div v-if="canFinishMatch(selectedScoringMatch)"
                                        @click="finishMatchAction(selectedScoringMatch)"
                                        class="px-6 py-3 rounded-2xl bg-green-500 text-white font-black tracking-widest text-xs hover:brightness-110 shadow-lg shadow-green-200 transition-all cursor-pointer flex items-center gap-2">
                                        <Icon icon="ph:check-circle-bold" class="text-xl" />
                                        Finish Match
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <!-- Archer A Keyboard -->
                                    <div class="space-y-6">
                                        <div class="p-5 rounded-3xl border-2 transition-all"
                                            :class="activeSide === 'A' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-gray-50 bg-slate-50/50'"
                                            @click="activeSide = 'A'">
                                            <div class="flex justify-between items-center mb-4">
                                                <span
                                                    class="text-[10px] font-black tracking-[0.2em] text-gray-400">ARCHER
                                                    A</span>
                                                <span class="text-xs font-black text-navy">{{
                                                    selectedScoringMatch.entry_a_name
                                                }}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div v-for="i in (bracket?.arrows_per_end || 3)" :key="i"
                                                    class="flex-1 aspect-square bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-2xl font-black text-navy shadow-inner">
                                                    {{ getArrowScore(selectedScoringMatch.id, currentEnd, 'A', i) }}
                                                </div>
                                                <div class="w-1.5 h-12 bg-gray-200 rounded-full mx-1"></div>
                                                <div
                                                    class="flex-1 aspect-square bg-navy text-primary rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm">
                                                    {{ calculateEndTotal(selectedScoringMatch.id, currentEnd, 'A') }}
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="activeSide === 'A'" class="grid grid-cols-4 gap-2">
                                            <button v-for="num in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'X', 'M']" :key="num"
                                                @click="addArrowScore(num)"
                                                class="aspect-square rounded-2xl text-xl font-black shadow-sm transition-all flex items-center justify-center"
                                                :class="num === 'X' ? 'bg-yellow-400 text-navy' : num === 'M' ? 'bg-slate-200 text-gray-400' : 'bg-white border-2 border-gray-100 text-navy hover:border-primary hover:text-primary'">
                                                {{ num }}
                                            </button>
                                            <button @click="deleteLastArrow"
                                                class="col-span-2 aspect-[2/1] rounded-2xl bg-red-50 text-red-600 font-black flex items-center justify-center hover:bg-red-100 transition-colors">
                                                <div class="flex items-center gap-2">
                                                    <Icon icon="ph:backspace-bold" class="text-2xl" />
                                                    <span>HAPUS</span>
                                                </div>
                                            </button>
                                            <button @click="saveAndNext" :disabled="isSaving"
                                                class="col-span-2 aspect-[2/1] rounded-2xl bg-navy text-primary font-black flex items-center justify-center shadow-lg hover:brightness-110 transition-all">
                                                <div class="flex flex-col items-center">
                                                    <span class="text-[10px] mb-1">SAVE & NEXT</span>
                                                    <div class="flex items-center gap-2">
                                                        <Icon v-if="isSaving" icon="ph:circle-notch-bold"
                                                            class="animate-spin text-lg" />
                                                        <Icon v-else icon="ph:caret-right-bold" class="text-lg" />
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Archer B Keyboard -->
                                    <div class="space-y-6">
                                        <div class="p-5 rounded-3xl border-2 transition-all"
                                            :class="activeSide === 'B' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-gray-50 bg-slate-50/50'"
                                            @click="activeSide = 'B'">
                                            <div class="flex justify-between items-center mb-4">
                                                <span
                                                    class="text-[10px] font-black tracking-[0.2em] text-gray-400">ARCHER
                                                    B</span>
                                                <span class="text-xs font-black text-navy">{{
                                                    selectedScoringMatch.entry_b_name ||
                                                    'TBD' }}</span>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <div v-for="i in (bracket?.arrows_per_end || 3)" :key="i"
                                                    class="flex-1 aspect-square bg-white border-2 border-gray-100 rounded-2xl flex items-center justify-center text-2xl font-black text-navy shadow-inner">
                                                    {{ getArrowScore(selectedScoringMatch.id, currentEnd, 'B', i) }}
                                                </div>
                                                <div class="w-1.5 h-12 bg-gray-200 rounded-full mx-1"></div>
                                                <div
                                                    class="flex-1 aspect-square bg-navy text-primary rounded-2xl flex items-center justify-center text-2xl font-black shadow-sm">
                                                    {{ calculateEndTotal(selectedScoringMatch.id, currentEnd, 'B') }}
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="activeSide === 'B'" class="grid grid-cols-4 gap-2">
                                            <button v-for="num in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'X', 'M']" :key="num"
                                                @click="addArrowScore(num)"
                                                class="aspect-square rounded-2xl text-xl font-black shadow-sm transition-all flex items-center justify-center"
                                                :class="num === 'X' ? 'bg-yellow-400 text-navy' : num === 'M' ? 'bg-slate-200 text-gray-400' : 'bg-white border-2 border-gray-100 text-navy hover:border-primary hover:text-primary'">
                                                {{ num }}
                                            </button>
                                            <button @click="deleteLastArrow"
                                                class="col-span-2 aspect-[2/1] rounded-2xl bg-red-50 text-red-600 font-black flex items-center justify-center hover:bg-red-100 transition-colors">
                                                <div class="flex items-center gap-2">
                                                    <Icon icon="ph:backspace-bold" class="text-2xl" />
                                                    <span>HAPUS</span>
                                                </div>
                                            </button>
                                            <button @click="saveAndNext" :disabled="isSaving"
                                                class="col-span-2 aspect-[2/1] rounded-2xl bg-navy text-primary font-black flex items-center justify-center shadow-lg hover:brightness-110 transition-all">
                                                <div class="flex flex-col items-center">
                                                    <span class="text-[10px] mb-1">SAVE & NEXT</span>
                                                    <div class="flex items-center gap-2">
                                                        <Icon v-if="isSaving" icon="ph:circle-notch-bold"
                                                            class="animate-spin text-lg" />
                                                        <Icon v-else icon="ph:caret-right-bold" class="text-lg" />
                                                    </div>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
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
                            <p class="text-gray-400 mt-2 max-w-xs">Pilih salah satu pertandingan dari daftar di samping
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
                                            'completed': match.status === 'finished',
                                            'selected': selectedMatch?.id === match.id
                                        }" @click="selectMatch(match)">
                                            <div class="match-card-header">
                                                <span v-if="match.status !== 'scheduled'" class="status-badge"
                                                    :class="getMatchStatusClass(match.status)">
                                                    {{ getStatusLabel(match.status) }}
                                                </span>
                                                <div v-else class="flex items-center gap-1.5 opacity-40">
                                                    <Icon icon="ph:clock" class="text-[10px]" />
                                                    <span
                                                        class="text-[8px] font-black tracking-widest uppercase">Pending</span>
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
                                                    <span class="archer-name">{{ match.entry_a_name || (match.is_bye ?
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
                                                    <span class="archer-name">{{ match.entry_b_name || 'TBD' }}</span>
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
                        <h2 class="text-3xl font-black text-navy tracking-tight">Bracket Belum Di-generate
                        </h2>
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

        <!-- Not Found -->
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
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Bagan Eliminasi - ArcheryHub Dashboard'
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

// Round Management States
const activeTab = ref('target')
const tabs = [
    { id: 'target', label: 'Target', icon: 'ph:target-bold' },
    { id: 'input', label: 'Scoring', icon: 'ph:pencil-circle-bold' }
]

const currentRoundNo = computed(() => route.query.round)
const roundMatches = computed(() => {
    if (!currentRoundNo.value) return []
    return rounds.value[currentRoundNo.value] || []
})

const pageTitle = computed(() => {
    const catName = categoryInfo.value?.category_name || ''
    if (!currentRoundNo.value) return 'Bracket Eliminasi'
    return `Review ${catName} - ${getRoundName(parseInt(currentRoundNo.value))}`
})

const statusBadgeClasses = computed(() => {
    const s = bracket.value?.status
    if (s === 'running') return 'bg-blue-500 text-white shadow-blue-200'
    if (s === 'finished') return 'bg-green-500 text-white shadow-green-200'
    if (s === 'generated') return 'bg-navy text-primary shadow-navy/20'
    return 'bg-gray-100 text-gray-400 border border-gray-200'
})

// Scoring States
const selectedScoringMatch = ref(null)
const activeSide = ref('A')
const currentEnd = ref(1)
const matchEnds = ref({}) // { matchId: { side: { endNo: { total: 0, arrows: [] } } } }

const fetchBracket = async () => {
    isLoading.value = true
    try {
        const response = await get(`/events/${eventId}/elimination/brackets/${bracketId}`)
        bracket.value = response?.bracket || null
        entries.value = response?.entries || []
        matches.value = response?.matches || []
        rounds.value = response?.rounds || {}

        if (bracket.value?.category_uuid) {
            fetchCategoryDetails(bracket.value.category_uuid)
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

    if (match.status === 'finished') {
        const isWinner = match.winner_entry_id === (side === 'A' ? match.entry_a_id : match.entry_b_id)
        if (isRecurve) {
            // For simplicity in display, show set points if we can calculate them, otherwise show W/L
            const m = matchEnds.value[match.id]
            if (m) {
                return calculateSetPoints(match.id, sideKey)
            }
            return isWinner ? '6' : '0'
        }
        return isWinner ? 'W' : 'L'
    } else if (match.status === 'running') {
        const m = matchEnds.value[match.id]
        if (!m) return '-'

        if (isRecurve) {
            return calculateSetPoints(match.id, sideKey)
        }
        return Object.values(m[sideKey] || {}).reduce((s, e) => s + (e.total || 0), 0) || '0'
    }
    return '-'
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
    if (match.status === 'finished') return 100
    if (match.status === 'scheduled') return 0
    const m = matchEnds.value[match.id]
    if (!m) return 10
    const scoredEnds = Object.values(m.A).filter(e => e.arrows.length > 0).length
    const totalEnds = bracket.value?.ends_per_match || 5
    return Math.min(scoredEnds * (100 / totalEnds), 95)
}

const getMatchStatusClass = (status) => {
    if (status === 'finished') return 'bg-green-100 text-green-700'
    if (status === 'running') return 'bg-blue-100 text-blue-700'
    return 'bg-gray-100 text-gray-400'
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

const updateTarget = async (match) => {
    try {
        await put(`/events/${eventId}/elimination/brackets/${bracketId}/targets`, {
            match_uuid: match.id,
            target_uuid: match.target_id
        })
        toast.success('Lokasi target diupdate')
    } catch (e) {
        toast.error('Gagal mengupdate target')
    }
}

const canFinishMatch = (match) => {
    if (!match || match.status === 'finished') return false
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

const getTargetName = (tid) => {
    if (!tid) return 'No Target'
    const t = availableTargets.value.find(o => o.id === tid)
    return t ? `Target ${t.name}` : 'Unknown'
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

const getStatusLabel = (status) => {
    const labels = {
        draft: 'Draft',
        generated: 'Siap',
        running: 'Berlangsung',
        finished: 'Selesai',
        bye: 'BYE'
    }
    return labels[status] || status
}

const getFormatLabel = (format) => {
    const labels = { recurve_set: 'SET SYSTEM', compound_total: 'TOTAL SCORE' }
    return labels[format] || format
}

onMounted(() => {
    fetchBracket()
    fetchAvailableTargets()
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

.match-node-card:hover {
    @apply shadow-xl border-primary/40 -translate-y-1 z-20;
}

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
</style>
