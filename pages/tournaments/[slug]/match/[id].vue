<template>
    <div class="min-h-screen bg-background-light text-navy font-sans selection:bg-primary selection:text-navy flex flex-col justify-between">
        
        <!-- Global Dynamic Header -->
        <LayoutAppHeaderDynamic />

        <main class="flex-1 pt-20 sm:pt-28 md:pt-32 pb-20 sm:pb-32 px-3 sm:px-6 lg:px-8 relative overflow-hidden">

            <!-- Subtle Light Background Gradient Decor -->
            <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div class="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div class="absolute top-1/3 -right-32 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl"></div>
                <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60"></div>
            </div>

            <div class="max-w-7xl mx-auto relative z-10 space-y-4 sm:space-y-6 md:space-y-8">

                <!-- ── Loading State ────────────────────────────────────── -->
                <div v-if="isLoading" class="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
                    <div class="flex items-center gap-2">
                        <span class="size-3.5 rounded-full bg-primary animate-bounce" style="animation-delay: 0ms"></span>
                        <span class="size-3.5 rounded-full bg-primary animate-bounce" style="animation-delay: 150ms"></span>
                        <span class="size-3.5 rounded-full bg-primary animate-bounce" style="animation-delay: 300ms"></span>
                    </div>
                    <span class="text-slate-400 font-bold tracking-wider text-xs">
                        Loading Match Details...
                    </span>
                </div>

                <!-- ── Match Content ───────────────────────────────────── -->
                <template v-else-if="matchData">
                    
                    <!-- ═══════════════════════════════════════
                         HERO MATCH CONTEXT BANNER (DESKTOP)
                    ════════════════════════════════════════ -->
                    <div class="hidden md:block bg-navy rounded-3xl border border-white/10 p-5 sm:p-6 shadow-md relative overflow-hidden text-white">
                        
                        <!-- Archery Target Subtle Background Watermark -->
                        <div class="absolute -right-12 -bottom-12 w-64 h-64 opacity-10 text-white pointer-events-none">
                            <svg viewBox="0 0 100 100" class="w-full h-full fill-none stroke-current" stroke-width="1.5">
                                <circle cx="50" cy="50" r="46" />
                                <circle cx="50" cy="50" r="37" />
                                <circle cx="50" cy="50" r="28" />
                                <circle cx="50" cy="50" r="19" />
                                <circle cx="50" cy="50" r="10" />
                                <circle cx="50" cy="50" r="2" fill="currentColor" />
                            </svg>
                        </div>

                        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            
                            <!-- Left: Event Info & Breadcrumb -->
                            <div class="space-y-2.5 min-w-0 flex-1">
                                <!-- Navigation Breadcrumbs -->
                                <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 font-medium">
                                    <NuxtLink to="/" class="hover:text-primary transition-colors flex items-center gap-1">
                                        <Icon icon="ph:house-bold" />
                                        <span>Home</span>
                                    </NuxtLink>
                                    <span class="text-slate-600">/</span>
                                    <NuxtLink to="/tournaments" class="hover:text-primary transition-colors">
                                        Tournaments
                                    </NuxtLink>
                                    <span class="text-slate-600">/</span>
                                    <NuxtLink :to="`/tournaments/${tournamentSlug}`"
                                        class="hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-xs font-semibold text-slate-200">
                                        {{ eventData?.name || 'Tournament' }}
                                    </NuxtLink>
                                    <span class="text-slate-600">/</span>
                                    <span class="text-primary font-bold">Match Details</span>
                                </div>

                                <div class="flex items-center gap-3.5">
                                    <!-- Event Logo / Archery Icon Badge -->
                                    <div class="size-12 sm:size-14 rounded-2xl bg-white/10 border border-white/15 overflow-hidden flex items-center justify-center shrink-0 shadow-inner p-1">
                                        <img v-if="eventData?.logo_url" :src="eventData.logo_url" class="size-full object-cover rounded-xl" />
                                        <div v-else class="size-full bg-primary/20 text-primary rounded-xl flex items-center justify-center text-2xl font-black">
                                            <Icon icon="ph:target-bold" />
                                        </div>
                                    </div>

                                    <div class="min-w-0 flex-1 space-y-1.5">
                                        <div class="text-lg sm:text-xl lg:text-2xl font-black text-white font-display tracking-tight leading-tight truncate">
                                            {{ eventData?.name || 'Archery Championship' }}
                                        </div>

                                        <!-- Badge Row -->
                                        <div class="flex flex-wrap items-center gap-1.5">
                                            <!-- Category Badge -->
                                            <span v-if="categoryDisplayName"
                                                class="px-3 py-0.5 rounded-lg bg-primary text-navy font-black text-xs shadow-2xs">
                                                {{ categoryDisplayName }}
                                            </span>

                                            <!-- Round Stage Badge -->
                                            <span class="px-3 py-0.5 rounded-lg bg-white/10 text-white border border-white/15 font-bold text-xs">
                                                {{ roundName }}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Venue, Date & Back Button -->
                            <div class="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
                                <div class="space-y-1 text-xs text-slate-400 text-left lg:text-right">
                                    <div v-if="eventData?.venue || eventData?.city || eventData?.location"
                                        class="flex items-center lg:justify-end gap-1.5">
                                        <Icon icon="ph:map-pin-fill" class="text-rose-400 text-xs shrink-0" />
                                        <span class="truncate max-w-[200px] sm:max-w-xs font-medium text-slate-300">
                                            {{ [eventData.venue, eventData.city || eventData.location].filter(Boolean).join(', ') }}
                                        </span>
                                    </div>

                                    <div v-if="eventData?.start_date" class="flex items-center lg:justify-end gap-1.5 font-medium text-slate-300">
                                        <Icon icon="ph:calendar-blank-bold" class="text-primary text-xs shrink-0" />
                                        <span>{{ formatEventDateRange(eventData.start_date, eventData.end_date) }}</span>
                                    </div>
                                </div>

                                <button @click="handleBack"
                                    class="h-9 px-4 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/15 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer active:scale-95 shrink-0">
                                    <Icon icon="ph:arrow-left-bold" class="text-xs" />
                                    <span>Back to Tournament</span>
                                </button>
                            </div>

                        </div>
                    </div>

                    <!-- ═══════════════════════════════════════
                         HERO MATCH CONTEXT BANNER (MOBILE COMPACT)
                    ════════════════════════════════════════ -->
                    <div class="block md:hidden bg-navy rounded-2xl border border-white/10 p-3.5 shadow-md relative overflow-hidden text-white">
                        <div class="relative z-10 flex items-center justify-between gap-2.5">
                            <button @click="handleBack"
                                class="size-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0 border border-white/15 active:scale-95 transition-all">
                                <Icon icon="ph:arrow-left-bold" class="text-sm" />
                            </button>
                            
                            <div class="min-w-0 flex-1">
                                <div class="text-sm font-black text-white font-display truncate leading-tight">
                                    {{ eventData?.name || 'Tournament Match' }}
                                </div>
                                <div class="text-[11px] text-slate-300 font-medium truncate mt-0.5">
                                    <span v-if="categoryDisplayName" class="text-primary font-bold">{{ categoryDisplayName }}</span>
                                    <span v-if="categoryDisplayName && roundName"> • </span>
                                    <span>{{ roundName }}</span>
                                </div>
                            </div>

                            <div v-if="eventData?.start_date" class="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
                                <Icon icon="ph:calendar-blank-bold" class="text-primary text-xs" />
                                <span>{{ formatEventDateRange(eventData.start_date, eventData.end_date) }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- ═══════════════════════════════════════
                         DUEL SCOREBOARD (DESKTOP VERSION)
                    ════════════════════════════════════════ -->
                    <div class="hidden md:block bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 sm:p-6 relative overflow-hidden">
                        
                        <!-- Top Meta Row: Team badges, Seeds & Clubs -->
                        <div class="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-100 text-xs">
                            <!-- Side A Meta -->
                            <div class="flex items-center gap-1.5 min-w-0">
                                <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-navy/5 text-navy border border-navy/10 shrink-0">
                                    {{ isTeamMatch ? 'Team A' : 'Archer A' }}
                                </span>
                                <span v-if="participantA?.seed"
                                    class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary/20 text-navy border border-primary/30 shrink-0">
                                    Seed #{{ participantA.seed }}
                                </span>
                                <span class="text-slate-500 font-medium truncate max-w-[120px] sm:max-w-[200px]">
                                    {{ participantA?.club || 'Independent Club' }}
                                </span>
                            </div>

                            <!-- Match Format / Stage Center Pill -->
                            <span class="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200 shrink-0">
                                {{ formatLabel }}
                            </span>

                            <!-- Side B Meta -->
                            <div class="flex items-center justify-end gap-1.5 min-w-0">
                                <span class="text-slate-500 font-medium truncate max-w-[120px] sm:max-w-[200px] text-right">
                                    {{ participantB?.club || 'Independent Club' }}
                                </span>
                                <span v-if="participantB?.seed"
                                    class="px-2 py-0.5 rounded-md text-[11px] font-bold bg-primary/20 text-navy border border-primary/30 shrink-0">
                                    Seed #{{ participantB.seed }}
                                </span>
                                <span class="px-2.5 py-0.5 rounded-lg text-[11px] font-black bg-navy/5 text-navy border border-navy/10 shrink-0">
                                    {{ isTeamMatch ? 'Team B' : 'Archer B' }}
                                </span>
                            </div>
                        </div>

                        <!-- Main Duel Arena: Left Team / Center Scores / Right Team -->
                        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-6">
                            
                            <!-- ── Side A Participant ────────────────────── -->
                            <div class="flex flex-col space-y-2 min-w-0" :class="isWinner('A') ? 'relative' : ''">
                                <!-- Winner Indicator -->
                                <div v-if="isWinner('A')" class="flex items-center gap-1 text-xs font-black text-amber-600">
                                    <Icon icon="ph:crown-simple-fill" class="text-sm text-amber-500" />
                                    <span>Match Winner</span>
                                </div>

                                <!-- Team / Archer Name -->
                                <div class="text-lg font-black text-navy font-display truncate leading-tight">
                                    {{ participantA?.name || 'TBD' }}
                                </div>

                                <!-- Team Archers Roster (Compact horizontal pills) -->
                                <div v-if="isTeamMatch && participantA?.members && participantA.members.length > 0"
                                    class="flex flex-wrap items-center gap-2">
                                    <div v-for="(member, idx) in participantA.members" :key="idx"
                                        class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors shadow-2xs">
                                        <div class="size-7 rounded-lg overflow-hidden bg-slate-200 shrink-0 border"
                                            :class="isMaleGender(member.gender) ? 'border-sky-400' : 'border-rose-400'">
                                            <img :src="useImageOrDefault(member.avatar, member.name)" :alt="member.name" class="size-full object-cover" />
                                        </div>
                                        <div class="min-w-0">
                                            <span class="text-xs font-bold text-navy truncate max-w-[120px] block leading-tight">{{ member.name }}</span>
                                            <span class="text-[9px] text-slate-400 font-medium">#{{ idx + 1 }}</span>
                                        </div>
                                        <Icon :icon="isMaleGender(member.gender) ? 'ph:gender-male-bold' : 'ph:gender-female-bold'"
                                            class="text-xs shrink-0"
                                            :class="isMaleGender(member.gender) ? 'text-sky-600' : 'text-rose-600'" />
                                    </div>
                                </div>

                                <!-- Individual Archer Profile -->
                                <div v-else class="flex items-center gap-2.5">
                                    <div class="size-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                        <img :src="useImageOrDefault(participantA?.avatar, participantA?.name)" :alt="participantA?.name" class="size-full object-cover" />
                                    </div>
                                    <div class="min-w-0 text-xs text-slate-500 font-medium truncate">
                                        {{ participantA?.club || 'Independent Club' }}
                                    </div>
                                </div>
                            </div>

                            <!-- ── Center Duel Score Display (High Impact) ─ -->
                            <div class="flex items-center justify-center shrink-0">
                                <div class="flex flex-col items-center justify-center px-6 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-2xs min-w-[160px]">
                                    <div class="flex items-center gap-2.5 leading-none">
                                        <span class="text-3xl lg:text-4xl font-black"
                                            :class="isWinner('A') ? 'text-navy scale-105' : 'text-slate-800'">
                                            {{ getFinalScore('A') }}
                                        </span>
                                        <span class="text-slate-300 font-light text-2xl">:</span>
                                        <span class="text-3xl lg:text-4xl font-black"
                                            :class="isWinner('B') ? 'text-navy scale-105' : 'text-slate-800'">
                                            {{ getFinalScore('B') }}
                                        </span>
                                    </div>
                                    <span class="text-[11px] font-medium text-slate-500 mt-1">
                                        {{ matchData.format === 'recurve_set' ? 'Set Points' : 'Total Score' }}
                                    </span>
                                </div>
                            </div>

                            <!-- ── Side B Participant ────────────────────── -->
                            <div class="flex flex-col items-end space-y-2 min-w-0" :class="isWinner('B') ? 'relative' : ''">
                                <!-- Winner Indicator -->
                                <div v-if="isWinner('B')" class="flex items-center gap-1 text-xs font-black text-amber-600 justify-end">
                                    <Icon icon="ph:crown-simple-fill" class="text-sm text-amber-500" />
                                    <span>Match Winner</span>
                                </div>

                                <!-- Team / Archer Name -->
                                <div class="text-lg font-black text-navy font-display truncate leading-tight text-right">
                                    {{ participantB?.name || 'TBD' }}
                                </div>

                                <!-- Team Archers Roster (Compact horizontal pills) -->
                                <div v-if="isTeamMatch && participantB?.members && participantB.members.length > 0"
                                    class="flex flex-wrap items-center justify-end gap-2">
                                    <div v-for="(member, idx) in participantB.members" :key="idx"
                                        class="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors shadow-2xs">
                                        <Icon :icon="isMaleGender(member.gender) ? 'ph:gender-male-bold' : 'ph:gender-female-bold'"
                                            class="text-xs shrink-0"
                                            :class="isMaleGender(member.gender) ? 'text-sky-600' : 'text-rose-600'" />
                                        <div class="min-w-0 text-right">
                                            <span class="text-xs font-bold text-navy truncate max-w-[120px] block leading-tight">{{ member.name }}</span>
                                            <span class="text-[9px] text-slate-400 font-medium">#{{ idx + 1 }}</span>
                                        </div>
                                        <div class="size-7 rounded-lg overflow-hidden bg-slate-200 shrink-0 border"
                                            :class="isMaleGender(member.gender) ? 'border-sky-400' : 'border-rose-400'">
                                            <img :src="useImageOrDefault(member.avatar, member.name)" :alt="member.name" class="size-full object-cover" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Individual Archer Profile -->
                                <div v-else class="flex items-center flex-row-reverse gap-2.5">
                                    <div class="size-10 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                                        <img :src="useImageOrDefault(participantB?.avatar, participantB?.name)" :alt="participantB?.name" class="size-full object-cover" />
                                    </div>
                                    <div class="min-w-0 text-xs text-slate-500 font-medium truncate text-right">
                                        {{ participantB?.club || 'Independent Club' }}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- ═══════════════════════════════════════
                         DUEL SCOREBOARD (MOBILE REDESIGNED)
                    ════════════════════════════════════════ -->
                    <div class="block md:hidden bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3.5">
                        
                        <!-- Minimal Top Header Strip -->
                        <div class="flex items-center justify-between text-[11px] pb-2.5 border-b border-slate-100">
                            <div class="flex items-center gap-1.5 font-bold text-navy">
                                <Icon icon="ph:trophy-bold" class="text-amber-500 text-xs" />
                                <span>{{ roundName }}</span>
                            </div>
                            <span class="text-slate-500 font-medium">
                                {{ formatLabel }}
                            </span>
                        </div>

                        <!-- Competitors Duel Arena (Side-by-Side + Score) -->
                        <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                            
                            <!-- Side A -->
                            <div class="flex flex-col items-center text-center space-y-1 min-w-0">
                                <div v-if="isWinner('A')"
                                    class="inline-flex items-center gap-0.5 text-[9px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                                    <Icon icon="ph:crown-simple-fill" class="text-[10px] text-amber-500" />
                                    <span>Winner</span>
                                </div>

                                <div class="text-xs font-black text-navy font-display line-clamp-2 leading-tight">
                                    {{ participantA?.name || 'TBD' }}
                                </div>

                                <div class="text-[10px] text-slate-500 font-medium truncate max-w-full">
                                    <span v-if="participantA?.seed" class="font-black text-navy">#{{ participantA.seed }}</span>
                                    <span v-if="participantA?.seed && participantA?.club"> • </span>
                                    <span class="truncate">{{ participantA?.club || 'Club' }}</span>
                                </div>
                            </div>

                            <!-- Center Score Badge -->
                            <div class="flex flex-col items-center justify-center px-3 py-2 bg-slate-50 rounded-xl border border-slate-200/90 shadow-2xs min-w-[78px] shrink-0">
                                <div class="flex items-center gap-1.5 leading-none">
                                    <span class="text-xl font-black" :class="isWinner('A') ? 'text-navy' : 'text-slate-800'">
                                        {{ getFinalScore('A') }}
                                    </span>
                                    <span class="text-slate-300 font-light text-base">:</span>
                                    <span class="text-xl font-black" :class="isWinner('B') ? 'text-navy' : 'text-slate-800'">
                                        {{ getFinalScore('B') }}
                                    </span>
                                </div>
                                <span class="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                                    {{ matchData.format === 'recurve_set' ? 'Set Points' : 'Total Score' }}
                                </span>
                            </div>

                            <!-- Side B -->
                            <div class="flex flex-col items-center text-center space-y-1 min-w-0">
                                <div v-if="isWinner('B')"
                                    class="inline-flex items-center gap-0.5 text-[9px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-200">
                                    <Icon icon="ph:crown-simple-fill" class="text-[10px] text-amber-500" />
                                    <span>Winner</span>
                                </div>

                                <div class="text-xs font-black text-navy font-display line-clamp-2 leading-tight">
                                    {{ participantB?.name || 'TBD' }}
                                </div>

                                <div class="text-[10px] text-slate-500 font-medium truncate max-w-full">
                                    <span v-if="participantB?.seed" class="font-black text-navy">#{{ participantB.seed }}</span>
                                    <span v-if="participantB?.seed && participantB?.club"> • </span>
                                    <span class="truncate">{{ participantB?.club || 'Club' }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Team Archers Lineup (Clean, Compact List) -->
                        <div v-if="isTeamMatch && (participantA?.members?.length || participantB?.members?.length)"
                            class="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                            
                            <!-- Team A Members -->
                            <div class="space-y-1 min-w-0">
                                <div class="text-[9px] font-black text-slate-400 uppercase tracking-wider">Team A Lineup</div>
                                <div v-for="(member, idx) in participantA?.members" :key="'ma-'+idx"
                                    class="flex items-center gap-1.5 p-1 rounded-lg bg-slate-50 border border-slate-100 min-w-0">
                                    <div class="size-5 rounded-md overflow-hidden bg-slate-200 shrink-0 border"
                                        :class="isMaleGender(member.gender) ? 'border-sky-400' : 'border-rose-400'">
                                        <img :src="useImageOrDefault(member.avatar, member.name)" class="size-full object-cover" />
                                    </div>
                                    <span class="text-[10px] font-bold text-navy truncate flex-1">{{ member.name }}</span>
                                    <Icon :icon="isMaleGender(member.gender) ? 'ph:gender-male-bold' : 'ph:gender-female-bold'"
                                        class="text-[9px] shrink-0"
                                        :class="isMaleGender(member.gender) ? 'text-sky-600' : 'text-rose-600'" />
                                </div>
                            </div>

                            <!-- Team B Members -->
                            <div class="space-y-1 min-w-0">
                                <div class="text-[9px] font-black text-slate-400 uppercase tracking-wider text-right">Team B Lineup</div>
                                <div v-for="(member, idx) in participantB?.members" :key="'mb-'+idx"
                                    class="flex items-center gap-1.5 p-1 rounded-lg bg-slate-50 border border-slate-100 min-w-0">
                                    <div class="size-5 rounded-md overflow-hidden bg-slate-200 shrink-0 border"
                                        :class="isMaleGender(member.gender) ? 'border-sky-400' : 'border-rose-400'">
                                        <img :src="useImageOrDefault(member.avatar, member.name)" class="size-full object-cover" />
                                    </div>
                                    <span class="text-[10px] font-bold text-navy truncate flex-1 text-right">{{ member.name }}</span>
                                    <Icon :icon="isMaleGender(member.gender) ? 'ph:gender-male-bold' : 'ph:gender-female-bold'"
                                        class="text-[9px] shrink-0"
                                        :class="isMaleGender(member.gender) ? 'text-sky-600' : 'text-rose-600'" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- ═══════════════════════════════════════
                         END-BY-END SCORING BREAKDOWN TABLE (LIGHT)
                    ════════════════════════════════════════ -->
                    <div class="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
                        
                        <!-- Table Top Header -->
                        <div class="px-4 sm:px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="flex items-center gap-3">
                                <div class="size-10 rounded-2xl bg-primary/20 text-navy flex items-center justify-center text-lg border border-primary/40 shrink-0 shadow-2xs">
                                    <Icon icon="ph:table-bold" />
                                </div>
                                <div>
                                    <div class="text-sm sm:text-base font-black text-navy font-display tracking-tight">
                                        Score Breakdown
                                    </div>
                                    <div class="text-xs text-slate-500 font-medium">
                                        {{ matchData.format === 'recurve_set' ? 'Set System (2 Pts For Win, 1 Pt For Draw)' : 'Cumulative Total Score Across All Ends' }}
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 self-start sm:self-auto">
                                <span class="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-navy flex items-center gap-1.5 shadow-2xs">
                                    <Icon icon="ph:target-bold" class="text-primary text-sm" />
                                    <span>{{ maxArrows }} Arrows / End</span>
                                </span>
                            </div>
                        </div>

                        <!-- Empty State -->
                        <div v-if="sortedEnds.length === 0" class="py-16 sm:py-20 px-4 text-center flex flex-col items-center justify-center">
                            <div class="size-14 rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center text-2xl shadow-inner mb-3">
                                <Icon icon="ph:clipboard-text-bold" />
                            </div>
                            <div class="text-sm font-bold text-navy mb-1">
                                No Score Data Recorded
                            </div>
                            <div class="text-xs text-slate-500 max-w-sm">
                                End scores and arrow values will appear in real-time once scoring begins.
                            </div>
                        </div>

                        <!-- Table Data -->
                        <div v-else class="overflow-x-auto custom-scrollbar">
                            <table class="w-full text-center min-w-[620px] text-xs sm:text-sm">
                                <thead>
                                    <tr class="bg-slate-100/70 border-b border-slate-200 text-slate-600 text-xs font-bold">
                                        <th class="py-3.5 w-12 sm:w-14 px-2 text-center">End</th>
                                        <th class="w-44 sm:w-56 text-left px-4 sm:px-5">Participant / Team</th>
                                        <th v-for="i in maxArrows" :key="i" class="w-10 sm:w-12 text-center px-1">
                                            A{{ i }}
                                        </th>
                                        <th class="w-14 sm:w-16 px-2">End Total</th>
                                        <th class="w-16 sm:w-20 bg-slate-100 text-navy px-2 font-black">
                                            {{ matchData.format === 'recurve_set' ? 'Set Points' : 'Running' }}
                                        </th>
                                        <th class="w-20 sm:w-28 border-l border-slate-200 text-navy px-3 font-black">Match Total</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100">
                                    <template v-for="endNo in sortedEnds" :key="endNo">
                                        
                                        <!-- Row Archer / Team A -->
                                        <tr class="hover:bg-slate-50/70 transition-colors">
                                            <td class="font-black text-navy bg-slate-50 border-r border-slate-200 text-xs py-2 px-2 text-center align-middle"
                                                rowspan="2">
                                                <span class="inline-flex items-center justify-center size-7 rounded-lg text-xs font-black shadow-2xs mx-auto"
                                                    :class="endNo === 99 ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-navy text-primary'">
                                                    {{ endNo === 99 ? 'SO' : endNo }}
                                                </span>
                                            </td>

                                            <!-- Side A Info -->
                                            <td class="px-4 sm:px-5 py-3 text-left">
                                                <div class="flex items-center gap-2">
                                                    <span class="size-2.5 rounded-full bg-primary shrink-0"></span>
                                                    <span class="font-black text-xs sm:text-sm text-navy truncate">
                                                        {{ participantA?.name || 'Side A' }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Arrows A -->
                                            <td v-for="i in maxArrows" :key="'a-' + i" class="py-2.5 px-1">
                                                <span class="inline-flex size-7 sm:size-8 rounded-lg items-center justify-center text-xs font-black shadow-2xs"
                                                    :class="getArrowClass(getEndsBySide(endNo, 'A')[i - 1])">
                                                    {{ getEndsBySide(endNo, 'A')[i - 1] || '–' }}
                                                </span>
                                            </td>

                                            <!-- Total A -->
                                            <td class="font-black text-navy text-xs sm:text-sm py-2.5 px-2">
                                                {{ getEndTotal(endNo, 'A') }}
                                            </td>

                                            <!-- Points / Running A -->
                                            <td class="font-black text-navy text-xs sm:text-sm bg-slate-50 py-2.5 px-2">
                                                {{ getSidePoints('A', endNo) }}
                                            </td>

                                            <!-- Cumulative Score (rowspan 2) -->
                                            <td class="border-l border-slate-200 font-black text-sm sm:text-base py-2.5 px-3 bg-slate-50 text-navy align-middle"
                                                rowspan="2">
                                                <div class="font-bold text-navy">
                                                    {{ getRunningScoreDisplay(endNo) }}
                                                </div>
                                            </td>
                                        </tr>

                                        <!-- Row Archer / Team B -->
                                        <tr class="hover:bg-slate-50/70 transition-colors border-b border-slate-200">
                                            <!-- Side B Info -->
                                            <td class="px-4 sm:px-5 py-3 text-left">
                                                <div class="flex items-center gap-2">
                                                    <span class="size-2.5 rounded-full bg-slate-400 shrink-0"></span>
                                                    <span class="font-bold text-xs sm:text-sm text-slate-700 truncate">
                                                        {{ participantB?.name || 'Side B' }}
                                                    </span>
                                                </div>
                                            </td>

                                            <!-- Arrows B -->
                                            <td v-for="i in maxArrows" :key="'b-' + i" class="py-2.5 px-1">
                                                <span class="inline-flex size-7 sm:size-8 rounded-lg items-center justify-center text-xs font-black shadow-2xs"
                                                    :class="getArrowClass(getEndsBySide(endNo, 'B')[i - 1])">
                                                    {{ getEndsBySide(endNo, 'B')[i - 1] || '–' }}
                                                </span>
                                            </td>

                                            <!-- Total B -->
                                            <td class="font-black text-navy text-xs sm:text-sm py-2.5 px-2">
                                                {{ getEndTotal(endNo, 'B') }}
                                            </td>

                                            <!-- Points / Running B -->
                                            <td class="font-bold text-slate-600 text-xs sm:text-sm bg-slate-50 py-2.5 px-2">
                                                {{ getSidePoints('B', endNo) }}
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>

                                <!-- Table Footer -->
                                <tfoot>
                                    <tr class="bg-slate-100/90 border-t-2 border-slate-200 text-slate-700 font-bold">
                                        <td colspan="2" class="py-3.5 px-4 sm:px-5 text-left">
                                            <span class="text-xs sm:text-sm font-black text-navy">
                                                Final Match Summary
                                            </span>
                                        </td>
                                        <td :colspan="maxArrows"></td>
                                        <td class="py-3.5 text-center px-2">
                                            <div class="flex flex-col gap-0.5 items-center">
                                                <span class="font-black text-navy text-xs sm:text-sm">{{ totalScoreA }}</span>
                                                <span class="font-bold text-slate-500 text-xs sm:text-sm">{{ totalScoreB }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3.5 text-center bg-slate-200/60 px-2">
                                            <div class="flex flex-col gap-0.5 items-center">
                                                <span class="font-black text-navy text-xs sm:text-sm">{{ getFinalScore('A') }}</span>
                                                <span class="font-bold text-slate-500 text-xs sm:text-sm">{{ getFinalScore('B') }}</span>
                                            </div>
                                        </td>
                                        <td class="py-3.5 border-l border-slate-200 text-center px-3">
                                            <div class="inline-flex items-center justify-center px-3.5 py-1.5 rounded-xl bg-navy text-primary font-black text-xs sm:text-sm tracking-tight shadow-2xs">
                                                {{ getFinalScore('A') }} – {{ getFinalScore('B') }}
                                            </div>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                </template>

                <!-- ── Error State ──────────────────────────────────────── -->
                <div v-else
                    class="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-12">
                    <div class="size-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rose-100">
                        <Icon icon="ph:warning-circle-bold" class="text-3xl" />
                    </div>
                    <div class="text-lg font-black text-navy mb-2">
                        Match Not Found
                    </div>
                    <div class="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                        The requested match data is not available or the match ID is invalid.
                    </div>
                    <button @click="handleBack"
                        class="w-full sm:w-auto px-6 py-2.5 bg-primary text-navy font-black text-xs rounded-xl hover:bg-amber-300 transition-all shadow-2xs cursor-pointer active:scale-95">
                        Back to Tournament
                    </button>
                </div>

            </div>
        </main>

        <!-- Global App Footer -->
        <LayoutAppFooter class="shrink-0" />
    </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'
import LayoutAppHeaderDynamic from '~/components/layout/AppHeaderDynamic.vue'
import LayoutAppFooter from '~/components/layout/AppFooter.vue'

const { get } = useApi()
const route = useRoute()
const router = useRouter()
const tournamentSlug = computed(() => (route.params.slug || '').toString())
const matchId = computed(() => (route.params.id || '').toString())

definePageMeta({ layout: 'blank' })

const isLoading = ref(true)
const matchData = ref<any>(null)
const eventData = ref<any>(null)
const participantA = ref<any>(null)
const participantB = ref<any>(null)
const ends = ref<any[]>([])

// ── Computed ───────────────────────────────────────────────────────
const isTeamMatch = computed(() => {
    if (participantA.value?.is_team || participantB.value?.is_team) return true
    const bracketType = String(eventData.value?.bracket_type || matchData.value?.bracket_type || '').toLowerCase()
    return bracketType.includes('team') || bracketType.includes('mixed')
})

const categoryDisplayName = computed(() => {
    const raw = eventData.value?.category_name || ''
    if (!raw) return ''
    return raw
        .split(' ')
        .filter(Boolean)
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
})

const formatLabel = computed(() => {
    if (!matchData.value) return '-'
    return matchData.value.format === 'recurve_set'
        ? 'Set System (Recurve)'
        : 'Cumulative Score (Compound)'
})

const roundName = computed(() => {
    if (!matchData.value) return ''
    const rNo = matchData.value.round_no
    const matchIdStr = String(matchData.value.id || matchData.value.uuid || '').toUpperCase()
    
    if (matchIdStr.includes('GF') || matchIdStr.includes('GOLD') || rNo === 1) {
        if (matchIdStr.includes('BRONZE') || matchIdStr.includes('BM')) return 'Bronze Medal Match'
        return 'Gold Medal Final'
    }
    if (matchIdStr.includes('SF') || rNo === 2) {
        return 'Semifinal'
    }
    if (matchIdStr.includes('QF') || rNo === 4 || rNo === 3) {
        return 'Quarterfinal'
    }
    if (matchIdStr.includes('R16') || rNo === 8) {
        return 'Round of 16'
    }
    if (matchIdStr.includes('R32') || rNo === 16) {
        return 'Round of 32'
    }
    if (matchIdStr.includes('R64') || rNo === 32) {
        return 'Round of 64'
    }
    return `Match #${matchData.value.match_no || matchData.value.id || ''}`
})

// ── Head & SEO Metadata ──────────────────────────────────────────
const pageTitle = computed(() => {
    const pA = participantA.value?.name || participantA.value?.full_name || ''
    const pB = participantB.value?.name || participantB.value?.full_name || ''
    const matchLabel = pA && pB ? `${pA} vs ${pB}` : (pA || pB ? (pA || pB) : 'Match Details')
    const stage = roundName.value ? `(${roundName.value})` : ''
    const event = eventData.value?.name ? `| ${eventData.value.name}` : ''
    return [matchLabel, stage, event, '- Archeris'].filter(Boolean).join(' ')
})

const pageDescription = computed(() => {
    const event = eventData.value?.name || 'Archery Tournament'
    const category = categoryDisplayName.value || ''
    const stage = roundName.value || 'Match'
    const pA = participantA.value?.name || participantA.value?.full_name || 'Archer A'
    const pB = participantB.value?.name || participantB.value?.full_name || 'Archer B'
    return `Live match details and end-by-end scorecard for ${pA} vs ${pB} in ${stage} ${category} at ${event} on Archeris.`
})

useHead({
    title: pageTitle,
    meta: [
        { name: 'description', content: pageDescription },
        { property: 'og:title', content: pageTitle },
        { property: 'og:description', content: pageDescription },
        { property: 'og:type', content: 'website' }
    ]
})

useSeoMeta({
    title: () => pageTitle.value,
    ogTitle: () => pageTitle.value,
    description: () => pageDescription.value,
    ogDescription: () => pageDescription.value,
    ogType: 'website',
    twitterCard: 'summary_large_image'
})

const formatEventDateRange = (startDateStr: string, endDateStr?: string) => {
    if (!startDateStr) return ''
    try {
        const start = new Date(startDateStr)
        const end = endDateStr ? new Date(endDateStr) : null
        
        const formatOptions: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
        if (!end || isNaN(end.getTime()) || start.toDateString() === end.toDateString()) {
            return start.toLocaleDateString('en-US', formatOptions)
        }
        
        if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
            return `${start.getDate()} - ${end.toLocaleDateString('en-US', formatOptions)}`
        }
        
        return `${start.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('en-US', formatOptions)}`
    } catch {
        return startDateStr
    }
}

const isMaleGender = (gender?: string) => {
    const g = String(gender || '').toLowerCase().trim()
    if (g.includes('female') || g.includes('women') || g.includes('woman') || g.includes('putri') || g.includes('wanita') || g === 'f' || g === 'p') {
        return false
    }
    return g.includes('male') || g.includes('men') || g.includes('man') || g.includes('putra') || g.includes('pria') || g === 'm' || g === 'l'
}

const sortedEnds = computed(() => {
    if (!ends.value.length) return []
    const nums = [...new Set(ends.value.map(e => e.end_no))]
    return nums.sort((a, b) => a - b)
})

const maxArrows = computed(() => {
    if (matchData.value?.arrows_per_end) return matchData.value.arrows_per_end
    if (!ends.value.length) return 3
    const maxFromData = Math.max(...ends.value.map(e => (e.arrows || []).length))
    return maxFromData > 0 ? maxFromData : 3
})

const totalScoreA = computed(() =>
    ends.value
        .filter(e => e.side === 'A' && e.end_no !== 99)
        .reduce((s, e) => s + (Number(e.end_total) || 0), 0)
)
const totalScoreB = computed(() =>
    ends.value
        .filter(e => e.side === 'B' && e.end_no !== 99)
        .reduce((s, e) => s + (Number(e.end_total) || 0), 0)
)

const getEndsBySide = (endNo: number, side: string) => {
    const end = ends.value.find(e => e.end_no === endNo && e.side === side)
    return end?.arrows || []
}

const getEndTotal = (endNo: number, side: string) => {
    const end = ends.value.find(e => e.end_no === endNo && e.side === side)
    return end?.end_total ?? 0
}

const getSidePoints = (side: string, endNo: number) => {
    const isSet = matchData.value?.format === 'recurve_set'
    if (!isSet) {
        return getEndTotal(endNo, side)
    }
    const myTotal = getEndTotal(endNo, side)
    const otherTotal = getEndTotal(endNo, side === 'A' ? 'B' : 'A')
    if (myTotal > otherTotal) return 2
    if (myTotal === otherTotal && myTotal > 0) return 1
    return 0
}

const getRunningScoreDisplay = (endNo: number) => {
    let ptsA = 0
    let ptsB = 0
    sortedEnds.value.filter(n => n <= endNo).forEach(n => {
        ptsA += getSidePoints('A', n)
        ptsB += getSidePoints('B', n)
    })
    return `${ptsA} – ${ptsB}`
}

const getFinalScore = (side: string) => {
    if (!matchData.value) return 0
    return matchData.value.format === 'recurve_set'
        ? (side === 'A' ? (matchData.value.total_points_a ?? 0) : (matchData.value.total_points_b ?? 0))
        : (side === 'A' ? (matchData.value.total_score_a ?? 0) : (matchData.value.total_score_b ?? 0))
}

const isWinner = (side: string) => {
    if (!matchData.value) return false

    const winnerId = matchData.value.winner_entry_id || matchData.value.winner_id || matchData.value.winner_entry_uuid || matchData.value.winner_uuid
    if (winnerId) {
        if (winnerId === side || winnerId === `Side ${side}`) return true

        const idA = matchData.value.entry_a_id || matchData.value.entry_a_uuid || participantA.value?.entry_id || participantA.value?.id || participantA.value?.uuid
        const idB = matchData.value.entry_b_id || matchData.value.entry_b_uuid || participantB.value?.entry_id || participantB.value?.id || participantB.value?.uuid

        if (side === 'A' && idA && (winnerId === idA || String(winnerId) === String(idA))) return true
        if (side === 'B' && idB && (winnerId === idB || String(winnerId) === String(idB))) return true
    }

    const winnerName = matchData.value.winner_name || matchData.value.winner
    if (winnerName) {
        if (side === 'A' && (participantA.value?.name === winnerName || matchData.value.entry_a_name === winnerName)) return true
        if (side === 'B' && (participantB.value?.name === winnerName || matchData.value.entry_b_name === winnerName)) return true
    }

    if (matchData.value.status === 'finished') {
        const scoreA = getFinalScore('A')
        const scoreB = getFinalScore('B')
        if (side === 'A' && scoreA > scoreB) return true
        if (side === 'B' && scoreB > scoreA) return true
    }

    return false
}

const getArrowClass = (score: any) => {
    if (!score || score === '' || score === '–' || score === null)
        return 'bg-slate-50 border border-slate-200 text-slate-400 font-semibold'
    if (score === 'X' || score === '10')
        return 'bg-amber-400 text-slate-950 font-black shadow-2xs border border-amber-500/30'
    if (score === '9')
        return 'bg-amber-300 text-slate-900 font-bold shadow-2xs border border-amber-400/30'
    if (score === '8' || score === '7')
        return 'bg-rose-500 text-white font-bold shadow-2xs'
    if (score === '6' || score === '5')
        return 'bg-sky-500 text-white font-bold shadow-2xs'
    if (score === '4' || score === '3')
        return 'bg-slate-800 text-white font-bold shadow-2xs'
    if (score === '2' || score === '1')
        return 'bg-slate-100 text-slate-800 font-bold border border-slate-300 shadow-2xs'
    if (score === 'M')
        return 'bg-slate-200 text-slate-500 font-bold border border-slate-300 shadow-2xs'
    return 'bg-slate-100 text-slate-700 font-bold border border-slate-200 shadow-2xs'
}

const handleBack = () => {
    if (tournamentSlug.value) {
        router.push(`/tournaments/${tournamentSlug.value}?tab=results`)
    } else {
        router.back()
    }
}

// ── Fetch Match Data ───────────────────────────────────────────────
const fetchMatchData = async () => {
    isLoading.value = true
    try {
        const res = await get(`/match/${matchId.value}`)
        if (res) {
            matchData.value = res.match || null
            eventData.value = res.event || null
            participantA.value = res.participant_a || null
            participantB.value = res.participant_b || null
            ends.value = res.ends || []
        }
    } catch (e) {
        console.error('Failed to fetch match:', e)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchMatchData)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
