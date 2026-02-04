<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-20">
            <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>

        <template v-else-if="bracket">
            <!-- Header Section -->
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-2">
                <div class="p-6 md:p-8">
                    <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div class="flex items-start gap-4 flex-1 min-w-0">
                            <button @click="handleBack"
                                class="p-3 rounded-2xl bg-gray-50 text-navy hover:bg-navy hover:text-primary transition-all group shrink-0">
                                <Icon icon="ph:arrow-left-bold"
                                    class="text-xl group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <div class="min-w-0">
                                <h1 class="text-2xl md:text-4xl font-black text-navy leading-tight tracking-tight">
                                    {{ pageTitle }}
                                </h1>
                                <div
                                    class="flex flex-wrap items-center gap-y-1 mt-2 text-sm text-gray-500 font-medium whitespace-nowrap overflow-hidden">
                                    <template v-if="categoryInfo">
                                        <span class="px-2 py-0.5 rounded-md bg-primary/10 text-primary font-bold">{{
                                            categoryInfo.division_name }}</span>
                                        <Icon icon="ph:dot-bold" class="text-gray-300 text-lg mx-0.5" />
                                        <span>{{ categoryInfo.category_name }}</span>
                                        <Icon icon="ph:dot-bold" class="text-gray-300 text-lg mx-0.5" />
                                        <span>{{ categoryInfo.event_type_name }}</span>
                                        <Icon icon="ph:dot-bold" class="text-gray-300 text-lg mx-0.5" />
                                        <span>{{ categoryInfo.gender_division_name }}</span>
                                        <Icon icon="ph:dot-bold" class="text-gray-300 text-lg mx-0.5" />
                                    </template>
                                    <span class="font-mono text-navy/40">{{ bracket.bracket_size }} Peserta</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-wrap items-center gap-3">
                            <!-- Format & Status -->
                            <div class="flex flex-col items-end gap-1.5 order-2 md:order-1">
                                <span class="text-[10px] font-black tracking-widest text-gray-400">Status
                                    Bracket</span>
                                <div class="flex items-center gap-2">
                                    <span
                                        class="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black text-gray-600 border border-gray-200">
                                        {{ getFormatLabel(bracket.format) }}
                                    </span>
                                    <span class="px-3 py-1 rounded-full text-[10px] font-black shadow-sm"
                                        :class="statusBadgeClasses">
                                        {{ getStatusLabel(bracket.status) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Tab Switcher (Management Mode) -->
                            <div v-if="currentRoundNo"
                                class="bg-gray-100 p-1.5 rounded-2xl flex gap-1 order-1 md:order-2">
                                <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
                                    class="px-5 py-2.5 text-xs font-black tracking-wider rounded-xl transition-all flex items-center gap-2"
                                    :class="activeTab === t.id ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-navy hover:bg-white/50'">
                                    <Icon :icon="t.icon" class="text-lg" />
                                    {{ t.label }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Secondary Actions Bar -->
                <div v-if="!currentRoundNo"
                    class="bg-slate-50 border-t border-gray-100 px-8 py-4 flex items-center justify-between">
                    <div class="flex items-center gap-8 text-[11px] font-bold text-gray-400 tracking-widest">
                        <div class="flex items-center gap-2">
                            <Icon icon="ph:calendar-blank" class="text-lg text-primary" />
                            <span>{{ formatDate(bracket.created_at) }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <Icon icon="ph:cpu" class="text-lg text-primary" />
                            <span v-if="bracket.generated_at">Generated {{ timeAgo(bracket.generated_at) }}</span>
                            <span v-else>Belum Di-generate</span>
                        </div>
                    </div>

                    <div class="flex items-center gap-2">
                        <button v-if="bracket.status === 'draft' || !bracket.generated_at" @click="generateBracket"
                            class="px-4 py-2 rounded-xl bg-navy text-primary text-xs font-black tracking-wider hover:brightness-110 shadow-lg shadow-navy/20 transition-all flex items-center gap-2">
                            <Icon icon="ph:magic-wand" class="text-lg" />
                            Generate Bracket
                        </button>
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
                                <h2 class="text-xl font-black text-navy tracking-tight">Penempatan Target
                                    Match</h2>
                                <p class="text-sm text-gray-500 mt-1">Alokasikan target (bantalan) untuk setiap
                                    pertandingan di
                                    babak ini</p>
                            </div>
                        </div>

                        <div class="overflow-x-auto -mx-6 md:mx-0">
                            <table class="w-full text-left">
                                <thead class="bg-slate-50 border-y border-gray-100">
                                    <tr>
                                        <th class="px-8 py-4 text-[10px] font-black text-gray-400 tracking-widest">
                                            Match
                                        </th>
                                        <th class="px-8 py-4 text-[10px] font-black text-gray-400 tracking-widest">
                                            Pemanah
                                            & Seed</th>
                                        <th class="px-8 py-4 text-[10px] font-black text-gray-400 tracking-widest w-72">
                                            Target Penilaian</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-50">
                                    <tr v-for="match in roundMatches" :key="match.id"
                                        class="hover:bg-slate-50 transition-all group">
                                        <td class="px-8 py-6">
                                            <div class="flex items-center gap-3">
                                                <div
                                                    class="size-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy font-black text-xs">
                                                    M{{ match.match_no }}
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-8 py-6">
                                            <div class="flex flex-col gap-3">
                                                <div
                                                    class="flex items-center justify-between bg-gray-50 rounded-xl p-2.5 pr-4 border border-gray-100 min-w-[280px]">
                                                    <div class="flex items-center gap-3">
                                                        <span
                                                            class="size-6 rounded-lg bg-white border border-gray-200 text-[10px] flex items-center justify-center font-black text-navy shadow-sm">{{
                                                                match.entry_a_seed || '-' }}</span>
                                                        <img :src="getAvatarUrl(match.entry_a_name)"
                                                            class="size-8 rounded-full border-2 border-white shadow-sm" />
                                                        <span
                                                            class="text-sm font-bold text-navy truncate max-w-[150px]">{{
                                                                match.entry_a_name || (match.is_bye ? 'BYE' : 'TBD')
                                                            }}</span>
                                                    </div>
                                                    <span
                                                        class="text-[9px] font-black text-gray-400 tracking-tighter">Side
                                                        A</span>
                                                </div>
                                                <div
                                                    class="flex items-center justify-between bg-gray-50 rounded-xl p-2.5 pr-4 border border-gray-100 min-w-[280px]">
                                                    <div class="flex items-center gap-3">
                                                        <span
                                                            class="size-6 rounded-lg bg-white border border-gray-200 text-[10px] flex items-center justify-center font-black text-navy shadow-sm">{{
                                                                match.entry_b_seed || '-' }}</span>
                                                        <img :src="getAvatarUrl(match.entry_b_name)"
                                                            class="size-8 rounded-full border-2 border-white shadow-sm" />
                                                        <span
                                                            class="text-sm font-bold text-navy truncate max-w-[150px]">{{
                                                                match.entry_b_name || 'TBD' }}</span>
                                                    </div>
                                                    <span
                                                        class="text-[9px] font-black text-gray-400 tracking-tighter">Side
                                                        B</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="px-8 py-6">
                                            <select v-model="match.target_id" @change="updateTarget(match)"
                                                class="w-full px-5 py-3 rounded-2xl bg-white border-2 border-gray-100 text-navy font-bold focus:border-primary focus:outline-none transition-all text-sm appearance-none shadow-sm cursor-pointer hover:border-gray-200">
                                                <option value="">-- Tandai Target --</option>
                                                <option v-for="target in availableTargets" :key="target.id"
                                                    :value="target.id">
                                                    Target {{ target.name }}
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                                        ? 'border-primary bg-primary/5 shadow-md -translate-y-1'
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

                                    <div class="flex flex-col gap-1.5">
                                        <div class="flex items-center justify-between">
                                            <span class="text-xs font-bold text-navy truncate pr-2">{{
                                                match.entry_a_name || 'TBD'
                                            }}</span>
                                            <span class="text-xs font-black text-navy">{{ getMatchScore(match, 'A')
                                            }}</span>
                                        </div>
                                        <div class="h-1 bg-gray-200 rounded-full overflow-hidden">
                                            <div class="h-full bg-primary"
                                                :style="{ width: getMatchProgress(match) + '%' }"></div>
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span class="text-xs font-bold text-navy truncate pr-2">{{
                                                match.entry_b_name || 'TBD'
                                            }}</span>
                                            <span class="text-xs font-black text-navy">{{ getMatchScore(match, 'B')
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
                                class="bg-navy rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 text-white shadow-md overflow-hidden relative">
                                <div class="absolute inset-0 opacity-10 pointer-events-none">
                                    <Icon icon="ph:sword"
                                        class="text-[300px] -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute" />
                                </div>

                                <div class="flex flex-col items-center gap-4 text-center md:flex-1">
                                    <img :src="getAvatarUrl(selectedScoringMatch.entry_a_name)"
                                        class="size-20 rounded-2xl border-4 border-white/20" />
                                    <div class="max-w-[150px]">
                                        <h4 class="font-black text-xl leading-tight truncate">{{
                                            selectedScoringMatch.entry_a_name
                                            || 'TBD' }}</h4>
                                        <span class="text-[10px] font-black tracking-widest text-primary">Seed
                                            {{
                                                selectedScoringMatch.entry_a_seed || '-' }}</span>
                                    </div>
                                </div>

                                <div class="flex flex-col items-center justify-center gap-2 md:order-2">
                                    <div class="text-[10px] font-black tracking-widest text-white/40">Versus
                                    </div>
                                    <div class="flex items-center gap-6">
                                        <span class="text-5xl font-black text-primary drop-shadow-lg">{{
                                            getMatchScore(selectedScoringMatch, 'A') }}</span>
                                        <div class="size-1 w-px bg-white/20 h-12"></div>
                                        <span class="text-5xl font-black text-white drop-shadow-lg">{{
                                            getMatchScore(selectedScoringMatch, 'B') }}</span>
                                    </div>
                                    <div
                                        class="px-4 py-1.5 rounded-full bg-white/10 text-[10px] font-black tracking-widest">
                                        {{ getTargetName(selectedScoringMatch.target_id) }}
                                    </div>
                                </div>

                                <div class="flex flex-col items-center gap-4 text-center md:flex-1 md:order-3">
                                    <img :src="getAvatarUrl(selectedScoringMatch.entry_b_name)"
                                        class="size-20 rounded-2xl border-4 border-white/20 shadow-md" />
                                    <div class="max-w-[150px]">
                                        <h4 class="font-black text-xl leading-tight truncate">{{
                                            selectedScoringMatch.entry_b_name
                                            || 'TBD' }}</h4>
                                        <span class="text-[10px] font-black tracking-widest text-white/60">Seed
                                            {{
                                                selectedScoringMatch.entry_b_seed || '-' }}</span>
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
                                                :class="currentEnd === i ? 'bg-navy text-primary shadow-md scale-110' : 'bg-slate-50 text-gray-400 group-hover:bg-gray-100'">
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
                                                    class="flex-1 aspect-square bg-navy text-primary rounded-2xl flex items-center justify-center text-2xl font-black shadow-md">
                                                    {{ calculateEndTotal(selectedScoringMatch.id, currentEnd, 'A') }}
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="activeSide === 'A'" class="grid grid-cols-4 gap-2">
                                            <button v-for="num in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'X', 'M']" :key="num"
                                                @click="addArrowScore(num)"
                                                class="aspect-square rounded-2xl text-xl font-black shadow-sm transition-all flex items-center justify-center"
                                                :class="num === 'X' ? 'bg-yellow-400 text-navy hover:scale-105' : num === 'M' ? 'bg-slate-200 text-gray-400' : 'bg-white border-2 border-gray-100 text-navy hover:border-primary hover:text-primary'">
                                                {{ num }}
                                            </button>
                                            <button @click="deleteLastArrow"
                                                class="col-span-2 aspect-[2/1] rounded-2xl bg-red-50 text-red-600 font-black flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                                                <Icon icon="ph:backspace-bold" class="text-2xl" /> HAPUS
                                            </button>
                                            <button @click="saveAndNext" :disabled="isSaving"
                                                class="col-span-2 aspect-[2/1] rounded-2xl bg-navy text-primary font-black flex flex-col items-center justify-center shadow-lg hover:brightness-110 active:scale-95 transition-all">
                                                <span class="text-[10px]">SAVE & NEXT</span>
                                                <Icon v-if="isSaving" icon="ph:circle-notch-bold"
                                                    class="animate-spin mt-1" />
                                                <Icon v-else icon="ph:caret-right-bold" class="mt-1" />
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
                                                    class="flex-1 aspect-square bg-navy text-primary rounded-2xl flex items-center justify-center text-2xl font-black shadow-md">
                                                    {{ calculateEndTotal(selectedScoringMatch.id, currentEnd, 'B') }}
                                                </div>
                                            </div>
                                        </div>

                                        <div v-if="activeSide === 'B'" class="grid grid-cols-4 gap-2">
                                            <button v-for="num in [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'X', 'M']" :key="num"
                                                @click="addArrowScore(num)"
                                                class="aspect-square rounded-2xl text-xl font-black shadow-sm transition-all flex items-center justify-center"
                                                :class="num === 'X' ? 'bg-yellow-400 text-navy hover:scale-105' : num === 'M' ? 'bg-slate-200 text-gray-400' : 'bg-white border-2 border-gray-100 text-navy hover:border-primary hover:text-primary'">
                                                {{ num }}
                                            </button>
                                            <button @click="deleteLastArrow"
                                                class="col-span-2 aspect-[2/1] rounded-2xl bg-red-50 text-red-600 font-black flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
                                                <Icon icon="ph:backspace-bold" class="text-2xl" /> HAPUS
                                            </button>
                                            <button @click="saveAndNext" :disabled="isSaving"
                                                class="col-span-2 aspect-[2/1] rounded-2xl bg-navy text-primary font-black flex flex-col items-center justify-center shadow-lg hover:brightness-110 active:scale-95 transition-all">
                                                <span class="text-[10px]">SAVE & NEXT</span>
                                                <Icon v-if="isSaving" icon="ph:circle-notch-bold"
                                                    class="animate-spin mt-1" />
                                                <Icon v-else icon="ph:caret-right-bold" class="mt-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else
                            class="bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-200 p-20 text-center flex flex-col items-center justify-center">
                            <div class="size-24 rounded-full bg-white shadow-md flex items-center justify-center mb-6">
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
                                    class="round-label group hover:scale-105 active:scale-95 transition-all"
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
                                                <span class="status-badge" :class="getMatchStatusClass(match.status)">
                                                    {{ getStatusLabel(match.status) }}
                                                </span>
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
                            class="size-32 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-8 border border-gray-100">
                            <Icon icon="ph:brackets-curly-bold" class="text-6xl text-gray-200" />
                        </div>
                        <h2 class="text-3xl font-black text-navy tracking-tight">Bracket Belum Di-generate
                        </h2>
                        <p class="text-gray-400 mt-2 max-w-sm mx-auto">Tentukan partisipan dan generate struktur
                            pertandingan
                            eliminasi untuk memulai babak ini.</p>
                        <button @click="generateBracket"
                            class="mt-10 px-8 py-4 rounded-2xl bg-navy text-primary font-black tracking-widest hover:brightness-110 shadow-md shadow-navy/30 active:scale-95 transition-all flex items-center gap-3 mx-auto">
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
    if (!currentRoundNo.value) return 'Bracket Eliminasi'
    return `Review ${getRoundName(parseInt(currentRoundNo.value))}`
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
        const response = await get(`/events/${eventId}/target-names`)
        // The API returns options directly or in .options
        const opts = response?.options || response || []
        availableTargets.value = opts.map(o => ({ id: o.uuid || o.id, name: o.name || o.target_no }))
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
    if (match.status === 'finished') {
        const isWinner = match.winner_entry_id === (side === 'A' ? match.entry_a_id : match.entry_b_id)
        if (isRecurve) return isWinner ? '6' : '0'
        return isWinner ? 'W' : 'L'
    } else if (match.status === 'running') {
        // Dynamic scoring from local state
        const sideKey = side === 'A' ? 'A' : 'B'
        if (isRecurve) {
            // Recurve set point simplified
            return '-'
        }
        return Object.values(matchEnds.value[match.id]?.[sideKey] || {}).reduce((s, e) => s + (e.total || 0), 0) || '-'
    }
    return '-'
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
    return match.status !== 'finished' &&
        matchEnds.value[match.id]?.A[1]?.arrows.length === 3 &&
        matchEnds.value[match.id]?.B[1]?.arrows.length === 3
}

const finishMatchAction = async (match) => {
    try {
        const totalA = Object.values(matchEnds.value[match.id].A).reduce((s, e) => s + e.total, 0)
        const totalB = Object.values(matchEnds.value[match.id].B).reduce((s, e) => s + e.total, 0)

        const winnerId = totalA >= totalB ? match.entry_a_id : match.entry_b_id

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
        scheduled: 'Terjadwal',
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
    @apply text-[11px] font-black text-navy tracking-widest py-3 px-8 bg-white rounded-2xl shadow-md border border-gray-100 shrink-0 flex items-center justify-center mb-16;
}

.final-label {
    @apply bg-navy text-primary border-none ring-8 ring-primary/5;
}

.match-slot {
    @apply flex items-center justify-center w-full;
}

.match-node-card {
    @apply relative w-[300px] bg-white rounded-3xl border-2 border-transparent shadow-md transition-all duration-500 cursor-pointer overflow-hidden;
    height: 140px;
}

.match-node-card:hover {
    @apply shadow-md scale-[1.02] border-primary/20 -translate-y-1 z-20;
}

.match-node-card.selected {
    @apply ring-8 ring-primary/10 border-primary shadow-md z-20;
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
    @apply text-xl font-black text-navy tabular-nums min-w-[32px] text-right;
}

.is-winner {
    @apply bg-primary/5;
}

.is-winner .archer-name {
    @apply text-primary font-black;
}

.is-winner .score-display {
    @apply text-primary text-2xl drop-shadow-sm;
}

.is-loser {
    @apply opacity-40 grayscale-[0.8];
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
