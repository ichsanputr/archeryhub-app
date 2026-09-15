<template>
  <div class="external-bracket-container relative">
    <!-- Bracket Scrollable Visual Canvas -->
    <div class="overflow-x-auto no-scrollbar py-6 px-4 sm:px-6 bg-slate-50/40 rounded-3xl border border-slate-200/80">
      <div v-if="hasMatches" class="flex items-center justify-center min-w-max gap-4 sm:gap-6 mx-auto relative z-10">

        <!-- ── LEFT SIDE ROUNDS (E.G. 1/8, 1/4) ── -->
        <template v-for="rNo in leftSideRoundNumbers" :key="'left-' + rNo">
          <div class="flex flex-col items-center min-w-[240px] sm:min-w-[260px]">
            <!-- Round Title Header -->
            <div class="h-10 flex flex-col items-center justify-center mb-6">
              <span class="text-xs font-bold text-slate-500 font-display">
                {{ getRoundName(parseInt(rNo)) }}
              </span>
            </div>

            <!-- Match Slots Column -->
            <div class="flex flex-col justify-around w-full" :style="{ height: getSideTotalHeight + 'px' }">
              <div 
                v-for="match in getMatchesForSide(rNo, 'left')" 
                :key="match.id" 
                class="flex items-center justify-center w-full my-auto"
                :style="{ height: getSlotHeightForSide(rNo) + 'px' }"
              >
                <!-- Minimalist Match Card Node -->
                <div 
                  @click="selectMatch(match, getRoundName(parseInt(rNo)))"
                  class="w-[230px] sm:w-[250px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none relative"
                >
                  <!-- Card Micro-Header -->
                  <div class="flex items-center justify-between px-3 py-1.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    <div class="flex items-center gap-1.5 font-mono">
                      <span class="size-1.5 rounded-full" :class="match.winner_entry_id ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                      <span>Match {{ match.match_no || 1 }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-navy transition-colors">
                      <span>Details</span>
                      <Icon icon="ph:arrow-right-bold" class="text-[9px]" />
                    </div>
                  </div>

                  <!-- Archer A Row -->
                  <div 
                    :class="[
                      'flex items-center justify-between px-3 py-2 border-b border-slate-100 transition-colors',
                      match.winner_entry_id === 'a' ? 'bg-slate-50/70 font-bold border-l-3 border-l-navy' : 'border-l-3 border-l-transparent'
                    ]"
                  >
                    <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <span v-if="match.entry_a_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_a_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'a' ? 'font-bold' : 'font-medium text-slate-700'">
                        {{ toTitleCase(match.entry_a_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'a'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span 
                      :class="[
                        'font-mono text-xs px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors',
                        match.winner_entry_id === 'a' ? 'bg-navy/10 text-navy font-black' : 'text-slate-400'
                      ]"
                    >
                      {{ match.set_points_a !== undefined && match.set_points_a !== '' ? match.set_points_a : '-' }}
                    </span>
                  </div>

                  <!-- Archer B Row -->
                  <div 
                    :class="[
                      'flex items-center justify-between px-3 py-2 transition-colors',
                      match.winner_entry_id === 'b' ? 'bg-slate-50/70 font-bold border-l-3 border-l-navy' : 'border-l-3 border-l-transparent'
                    ]"
                  >
                    <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <span v-if="match.entry_b_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_b_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'b' ? 'font-bold' : 'font-medium text-slate-700'">
                        {{ toTitleCase(match.entry_b_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'b'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span 
                      :class="[
                        'font-mono text-xs px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors',
                        match.winner_entry_id === 'b' ? 'bg-navy/10 text-navy font-black' : 'text-slate-400'
                      ]"
                    >
                      {{ match.set_points_b !== undefined && match.set_points_b !== '' ? match.set_points_b : '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Connector Path (Left to Next) -->
          <div class="w-12 sm:w-16 shrink-0 relative" :style="{ height: getSideTotalHeight + 'px' }">
            <svg class="w-full h-full" :viewBox="`0 0 60 ${getSideTotalHeight}`" preserveAspectRatio="none">
              <path 
                v-for="i in Math.floor(getMatchesForSide(rNo, 'left').length / 2)" 
                :key="i"
                class="stroke-slate-300 stroke-[1.5px] fill-none" 
                :d="calculateConnectorPath(i, rNo, 'left')" 
              />
              <path 
                v-if="getMatchesForSide(rNo, 'left').length === 1" 
                class="stroke-slate-300 stroke-[1.5px] fill-none" 
                :d="calculateConnectorPath(1, rNo, 'left', true)" 
              />
            </svg>
          </div>
        </template>

        <!-- ── CENTER HUB (FINALS ARENA: GOLD & BRONZE MATCHES) ── -->
        <div class="flex flex-col items-center min-w-[280px] sm:min-w-[320px] px-2 sm:px-4">
          <!-- Hub Header -->
          <div class="h-10 flex flex-col items-center justify-center mb-6">
            <span class="text-xs font-bold text-amber-900 font-display flex items-center gap-1.5">
              <Icon icon="ph:crown-simple-fill" class="text-amber-500 text-sm" />
              Finals Arena
            </span>
          </div>

          <!-- Finals Column -->
          <div class="flex flex-col justify-between items-center w-full py-2" :style="{ height: getSideTotalHeight + 'px' }">
            
            <!-- 1. Gold Medal Final (Top) -->
            <div class="w-full flex flex-col items-center space-y-2">
              <div class="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center gap-1.5 text-xs font-bold text-amber-950 font-display shadow-2xs">
                <Icon icon="ph:crown-fill" class="text-amber-600 text-xs" />
                <span>Gold Medal Final</span>
              </div>

              <div 
                v-if="goldMatch"
                @click="selectMatch(goldMatch, 'Gold Medal Final')"
                class="w-[260px] sm:w-[280px] bg-gradient-to-b from-amber-50/40 via-white to-white rounded-2xl border-2 border-amber-400/70 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none"
              >
                <!-- Gold Header -->
                <div class="flex items-center justify-between px-3.5 py-1.5 bg-amber-500/15 border-b border-amber-400/30 text-[11px] font-bold text-amber-950">
                  <div class="flex items-center gap-1.5">
                    <Icon icon="ph:medal-fill" class="text-amber-600 text-xs" />
                    <span>Gold Match</span>
                  </div>
                  <span v-if="goldMatch.winner_entry_id" class="px-1.5 py-0.2 rounded-md bg-amber-500/25 text-amber-950 text-[10px] font-black">
                    Champion
                  </span>
                </div>

                <!-- Archer A -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 transition-colors',
                    goldMatch.winner_entry_id === 'a' ? 'bg-amber-100/50 font-bold border-l-3 border-l-amber-500' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span v-if="goldMatch.entry_a_seed" class="size-5 rounded-md bg-amber-200/70 text-amber-950 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {{ goldMatch.entry_a_seed }}
                    </span>
                    <span class="text-xs truncate text-navy" :class="goldMatch.winner_entry_id === 'a' ? 'font-black text-navy' : 'font-medium text-slate-700'">
                      {{ toTitleCase(goldMatch.entry_a_name || 'TBD') }}
                    </span>
                    <Icon v-if="goldMatch.winner_entry_id === 'a'" icon="ph:crown-fill" class="text-amber-500 text-sm shrink-0" />
                  </div>
                  <span 
                    :class="[
                      'font-mono text-sm px-2 py-0.5 rounded-md font-bold shrink-0',
                      goldMatch.winner_entry_id === 'a' ? 'bg-amber-400 text-amber-950 font-black shadow-2xs' : 'text-slate-400'
                    ]"
                  >
                    {{ goldMatch.set_points_a !== undefined && goldMatch.set_points_a !== '' ? goldMatch.set_points_a : '-' }}
                  </span>
                </div>

                <!-- Archer B -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2.5 transition-colors',
                    goldMatch.winner_entry_id === 'b' ? 'bg-amber-100/50 font-bold border-l-3 border-l-amber-500' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span v-if="goldMatch.entry_b_seed" class="size-5 rounded-md bg-amber-200/70 text-amber-950 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {{ goldMatch.entry_b_seed }}
                    </span>
                    <span class="text-xs truncate text-navy" :class="goldMatch.winner_entry_id === 'b' ? 'font-black text-navy' : 'font-medium text-slate-700'">
                      {{ toTitleCase(goldMatch.entry_b_name || 'TBD') }}
                    </span>
                    <Icon v-if="goldMatch.winner_entry_id === 'b'" icon="ph:crown-fill" class="text-amber-500 text-sm shrink-0" />
                  </div>
                  <span 
                    :class="[
                      'font-mono text-sm px-2 py-0.5 rounded-md font-bold shrink-0',
                      goldMatch.winner_entry_id === 'b' ? 'bg-amber-400 text-amber-950 font-black shadow-2xs' : 'text-slate-400'
                    ]"
                  >
                    {{ goldMatch.set_points_b !== undefined && goldMatch.set_points_b !== '' ? goldMatch.set_points_b : '-' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 2. Semifinals (Middle) if present -->
            <div v-if="semifinalMatches.length > 0" class="w-full flex flex-col items-center space-y-2 my-auto">
              <div class="text-xs font-bold text-slate-400 font-display">
                Semifinals
              </div>
              <div class="flex flex-col gap-3">
                <div 
                  v-for="sMatch in semifinalMatches"
                  :key="sMatch.id"
                  @click="selectMatch(sMatch, 'Semifinal')"
                  class="w-[240px] sm:w-[260px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none"
                >
                  <div class="flex items-center justify-between px-3 py-1 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-500">
                    <span class="font-mono">Match {{ sMatch.match_no || 1 }}</span>
                    <span v-if="sMatch.winner_entry_id" class="text-emerald-700 font-bold">Done</span>
                  </div>
                  <div 
                    :class="[
                      'px-3 py-1.5 flex items-center justify-between border-b border-slate-100 text-xs transition-colors',
                      sMatch.winner_entry_id === 'a' ? 'bg-slate-50 font-bold border-l-2 border-l-navy' : ''
                    ]"
                  >
                    <span class="truncate text-navy">{{ toTitleCase(sMatch.entry_a_name || 'TBD') }}</span>
                    <span class="font-mono font-bold">{{ sMatch.set_points_a }}</span>
                  </div>
                  <div 
                    :class="[
                      'px-3 py-1.5 flex items-center justify-between text-xs transition-colors',
                      sMatch.winner_entry_id === 'b' ? 'bg-slate-50 font-bold border-l-2 border-l-navy' : ''
                    ]"
                  >
                    <span class="truncate text-navy">{{ toTitleCase(sMatch.entry_b_name || 'TBD') }}</span>
                    <span class="font-mono font-bold">{{ sMatch.set_points_b }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 3. Bronze Medal Match (Bottom) -->
            <div v-if="bronzeMatch" class="w-full flex flex-col items-center space-y-2 mt-4">
              <div class="px-2.5 py-0.5 rounded-lg bg-amber-700/10 border border-amber-700/30 flex items-center gap-1 text-[11px] font-bold text-amber-900 font-display">
                <Icon icon="ph:medal-fill" class="text-amber-700 text-xs" />
                <span>Bronze Medal Match</span>
              </div>

              <div 
                @click="selectMatch(bronzeMatch, 'Bronze Medal Match')"
                class="w-[240px] sm:w-[260px] bg-gradient-to-b from-amber-700/5 to-white rounded-2xl border border-amber-700/30 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none"
              >
                <!-- Archer A -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3 py-2 border-b border-slate-100 transition-colors',
                    bronzeMatch.winner_entry_id === 'a' ? 'bg-amber-700/10 font-bold border-l-3 border-l-amber-700' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span class="text-xs truncate text-navy" :class="bronzeMatch.winner_entry_id === 'a' ? 'font-bold' : 'font-medium text-slate-700'">
                      {{ toTitleCase(bronzeMatch.entry_a_name || 'TBD') }}
                    </span>
                    <Icon v-if="bronzeMatch.winner_entry_id === 'a'" icon="ph:medal-fill" class="text-amber-700 text-xs shrink-0" />
                  </div>
                  <span class="font-mono text-xs font-bold text-navy shrink-0">
                    {{ bronzeMatch.set_points_a !== undefined && bronzeMatch.set_points_a !== '' ? bronzeMatch.set_points_a : '-' }}
                  </span>
                </div>

                <!-- Archer B -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3 py-2 transition-colors',
                    bronzeMatch.winner_entry_id === 'b' ? 'bg-amber-700/10 font-bold border-l-3 border-l-amber-700' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span class="text-xs truncate text-navy" :class="bronzeMatch.winner_entry_id === 'b' ? 'font-bold' : 'font-medium text-slate-700'">
                      {{ toTitleCase(bronzeMatch.entry_b_name || 'TBD') }}
                    </span>
                    <Icon v-if="bronzeMatch.winner_entry_id === 'b'" icon="ph:medal-fill" class="text-amber-700 text-xs shrink-0" />
                  </div>
                  <span class="font-mono text-xs font-bold text-navy shrink-0">
                    {{ bronzeMatch.set_points_b !== undefined && bronzeMatch.set_points_b !== '' ? bronzeMatch.set_points_b : '-' }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── RIGHT SIDE ROUNDS (E.G. 1/4, 1/8) ── -->
        <template v-for="rNo in rightSideRoundNumbers" :key="'right-' + rNo">
          <!-- Connector Path (Right to Previous) -->
          <div class="w-12 sm:w-16 shrink-0 relative" :style="{ height: getSideTotalHeight + 'px' }">
            <svg class="w-full h-full" :viewBox="`0 0 60 ${getSideTotalHeight}`" preserveAspectRatio="none">
              <path 
                v-for="i in Math.floor(getMatchesForSide(rNo, 'right').length / 2)" 
                :key="i"
                class="stroke-slate-300 stroke-[1.5px] fill-none" 
                :d="calculateConnectorPath(i, rNo, 'right')" 
              />
              <path 
                v-if="getMatchesForSide(rNo, 'right').length === 1" 
                class="stroke-slate-300 stroke-[1.5px] fill-none" 
                :d="calculateConnectorPath(1, rNo, 'right', true)" 
              />
            </svg>
          </div>

          <div class="flex flex-col items-center min-w-[240px] sm:min-w-[260px]">
            <!-- Round Title Header -->
            <div class="h-10 flex flex-col items-center justify-center mb-6">
              <span class="text-xs font-bold text-slate-500 font-display">
                {{ getRoundName(parseInt(rNo)) }}
              </span>
            </div>

            <!-- Match Slots Column -->
            <div class="flex flex-col justify-around w-full" :style="{ height: getSideTotalHeight + 'px' }">
              <div 
                v-for="match in getMatchesForSide(rNo, 'right')" 
                :key="match.id" 
                class="flex items-center justify-center w-full my-auto"
                :style="{ height: getSlotHeightForSide(rNo) + 'px' }"
              >
                <!-- Minimalist Match Card Node -->
                <div 
                  @click="selectMatch(match, getRoundName(parseInt(rNo)))"
                  class="w-[230px] sm:w-[250px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none relative"
                >
                  <!-- Card Micro-Header -->
                  <div class="flex items-center justify-between px-3 py-1.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    <div class="flex items-center gap-1.5 font-mono">
                      <span class="size-1.5 rounded-full" :class="match.winner_entry_id ? 'bg-emerald-500' : 'bg-slate-300'"></span>
                      <span>Match {{ match.match_no || 1 }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-navy transition-colors">
                      <span>Details</span>
                      <Icon icon="ph:arrow-right-bold" class="text-[9px]" />
                    </div>
                  </div>

                  <!-- Archer A Row -->
                  <div 
                    :class="[
                      'flex items-center justify-between px-3 py-2 border-b border-slate-100 transition-colors',
                      match.winner_entry_id === 'a' ? 'bg-slate-50/70 font-bold border-l-3 border-l-navy' : 'border-l-3 border-l-transparent'
                    ]"
                  >
                    <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <span v-if="match.entry_a_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_a_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'a' ? 'font-bold' : 'font-medium text-slate-700'">
                        {{ toTitleCase(match.entry_a_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'a'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span 
                      :class="[
                        'font-mono text-xs px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors',
                        match.winner_entry_id === 'a' ? 'bg-navy/10 text-navy font-black' : 'text-slate-400'
                      ]"
                    >
                      {{ match.set_points_a !== undefined && match.set_points_a !== '' ? match.set_points_a : '-' }}
                    </span>
                  </div>

                  <!-- Archer B Row -->
                  <div 
                    :class="[
                      'flex items-center justify-between px-3 py-2 transition-colors',
                      match.winner_entry_id === 'b' ? 'bg-slate-50/70 font-bold border-l-3 border-l-navy' : 'border-l-3 border-l-transparent'
                    ]"
                  >
                    <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <span v-if="match.entry_b_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_b_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'b' ? 'font-bold' : 'font-medium text-slate-700'">
                        {{ toTitleCase(match.entry_b_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'b'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span 
                      :class="[
                        'font-mono text-xs px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors',
                        match.winner_entry_id === 'b' ? 'bg-navy/10 text-navy font-black' : 'text-slate-400'
                      ]"
                    >
                      {{ match.set_points_b !== undefined && match.set_points_b !== '' ? match.set_points_b : '-' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>

      </div>

      <div v-else class="text-center py-16 text-slate-400 text-xs sm:text-sm">
        <Icon icon="ph:brackets-curly-bold" class="text-4xl mx-auto mb-2 text-slate-300" />
        <span>No bracket match data available.</span>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- ELEGANT & MINIMALIST MATCH SCORING DETAIL DIALOG MODAL -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div 
          v-if="selectedMatch" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy/60 backdrop-blur-md"
          @click.self="selectedMatch = null"
        >
          <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-xl w-full overflow-hidden relative animate-in fade-in zoom-in-95 duration-150">
            
            <!-- Hero Dark Banner Header -->
            <div class="bg-navy p-6 text-white relative overflow-hidden">
              <!-- Radial background glow -->
              <div class="absolute -right-10 -bottom-10 size-40 rounded-full bg-primary/20 blur-2xl pointer-events-none"></div>
              <div class="absolute -left-10 -top-10 size-40 rounded-full bg-sky-500/15 blur-2xl pointer-events-none"></div>

              <!-- Top Bar: Phase Badge & Close Button -->
              <div class="flex items-center justify-between relative z-10 mb-5">
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary font-bold text-xs font-display border border-white/10 flex items-center gap-1.5">
                    <Icon icon="ph:sword-bold" class="text-xs" />
                    {{ selectedMatchRoundName || 'Elimination Match' }}
                  </span>
                  <span class="text-xs font-mono text-slate-300 font-semibold">
                    #{{ selectedMatch.match_no || 1 }}
                  </span>
                </div>

                <button
                  type="button"
                  @click="selectedMatch = null"
                  class="size-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Icon icon="ph:x-bold" class="text-sm" />
                </button>
              </div>

              <!-- Archer Face-Off Hero Comparison Card -->
              <div class="relative z-10 grid grid-cols-11 items-center gap-2 pt-1">
                <!-- Archer A -->
                <div class="col-span-5 flex flex-col items-center text-center space-y-1.5">
                  <div class="relative">
                    <div 
                      :class="[
                        'size-14 rounded-2xl flex items-center justify-center text-base font-black transition-all shadow-md',
                        selectedMatch.winner_entry_id === 'a' 
                          ? 'bg-gradient-to-tr from-primary/30 to-primary/60 text-white ring-2 ring-primary border border-white/30' 
                          : 'bg-white/10 text-slate-200 border border-white/10'
                      ]"
                    >
                      {{ getInitials(selectedMatch.entry_a_name) }}
                    </div>
                    <div v-if="selectedMatch.winner_entry_id === 'a'" class="absolute -top-2 -right-2 size-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md">
                      <Icon icon="ph:crown-fill" class="text-xs" />
                    </div>
                  </div>

                  <div class="w-full px-1">
                    <div class="font-bold text-white text-xs sm:text-sm truncate" :title="selectedMatch.entry_a_name">
                      {{ toTitleCase(selectedMatch.entry_a_name || 'TBD') }}
                    </div>
                    <div v-if="selectedMatch.entry_a_seed" class="text-[11px] font-mono text-slate-300 font-semibold mt-0.5">
                      Seed #{{ selectedMatch.entry_a_seed }}
                    </div>
                  </div>

                  <!-- Final Set Points / Score Display -->
                  <div 
                    :class="[
                      'text-3xl sm:text-4xl font-black font-display tracking-tight mt-1',
                      selectedMatch.winner_entry_id === 'a' ? 'text-primary' : 'text-slate-300'
                    ]"
                  >
                    {{ selectedMatch.set_points_a !== undefined && selectedMatch.set_points_a !== '' ? selectedMatch.set_points_a : '-' }}
                  </div>
                </div>

                <!-- Center VS Divider -->
                <div class="col-span-1 flex flex-col items-center justify-center space-y-1">
                  <div class="size-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-300 font-display">
                    VS
                  </div>
                  <span class="text-[9px] font-mono text-slate-400 uppercase font-semibold">Final</span>
                </div>

                <!-- Archer B -->
                <div class="col-span-5 flex flex-col items-center text-center space-y-1.5">
                  <div class="relative">
                    <div 
                      :class="[
                        'size-14 rounded-2xl flex items-center justify-center text-base font-black transition-all shadow-md',
                        selectedMatch.winner_entry_id === 'b' 
                          ? 'bg-gradient-to-tr from-primary/30 to-primary/60 text-white ring-2 ring-primary border border-white/30' 
                          : 'bg-white/10 text-slate-200 border border-white/10'
                      ]"
                    >
                      {{ getInitials(selectedMatch.entry_b_name) }}
                    </div>
                    <div v-if="selectedMatch.winner_entry_id === 'b'" class="absolute -top-2 -right-2 size-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md">
                      <Icon icon="ph:crown-fill" class="text-xs" />
                    </div>
                  </div>

                  <div class="w-full px-1">
                    <div class="font-bold text-white text-xs sm:text-sm truncate" :title="selectedMatch.entry_b_name">
                      {{ toTitleCase(selectedMatch.entry_b_name || 'TBD') }}
                    </div>
                    <div v-if="selectedMatch.entry_b_seed" class="text-[11px] font-mono text-slate-300 font-semibold mt-0.5">
                      Seed #{{ selectedMatch.entry_b_seed }}
                    </div>
                  </div>

                  <!-- Final Set Points / Score Display -->
                  <div 
                    :class="[
                      'text-3xl sm:text-4xl font-black font-display tracking-tight mt-1',
                      selectedMatch.winner_entry_id === 'b' ? 'text-primary' : 'text-slate-300'
                    ]"
                  >
                    {{ selectedMatch.set_points_b !== undefined && selectedMatch.set_points_b !== '' ? selectedMatch.set_points_b : '-' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Content Body -->
            <div class="p-6 space-y-5">
              
              <!-- Set by Set Scorecard Section -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-bold text-navy font-display flex items-center gap-1.5">
                    <Icon icon="ph:list-numbers-bold" class="text-primary text-sm" />
                    <span>Set-by-Set Arrow Scores</span>
                  </h4>
                  <span class="text-[11px] font-mono text-slate-400 font-semibold">Official Match Logs</span>
                </div>

                <div v-if="parsedSetRows.length > 0" class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                  <table class="w-full text-center text-xs border-collapse">
                    <thead class="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold text-xs">
                      <tr>
                        <th class="py-2.5 px-3 text-left">Set</th>
                        <th class="py-2.5 px-3">Archer A</th>
                        <th class="py-2.5 px-2.5 w-16">Pts A</th>
                        <th class="py-2.5 px-2.5 w-16">Pts B</th>
                        <th class="py-2.5 px-3">Archer B</th>
                        <th class="py-2.5 px-3 text-right">Running</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white font-mono">
                      <tr 
                        v-for="(row, rIdx) in parsedSetRows" 
                        :key="rIdx"
                        class="hover:bg-slate-50/60 transition-colors"
                      >
                        <td class="py-2.5 px-3 text-left font-sans font-bold text-slate-500 text-xs">
                          Set {{ rIdx + 1 }}
                        </td>
                        <td class="py-2.5 px-3 font-bold text-navy text-xs">
                          <span class="px-2 py-0.5 rounded-lg bg-slate-100/80">
                            {{ row.scoreA || '-' }}
                          </span>
                        </td>
                        <td class="py-2.5 px-2.5 text-xs font-bold">
                          <span 
                            :class="[
                              'inline-flex items-center justify-center size-6 rounded-md font-bold',
                              row.ptsA > row.ptsB ? 'bg-emerald-100 text-emerald-800' : (row.ptsA === row.ptsB ? 'bg-slate-100 text-slate-600' : 'text-slate-400')
                            ]"
                          >
                            {{ row.ptsA }}
                          </span>
                        </td>
                        <td class="py-2.5 px-2.5 text-xs font-bold">
                          <span 
                            :class="[
                              'inline-flex items-center justify-center size-6 rounded-md font-bold',
                              row.ptsB > row.ptsA ? 'bg-emerald-100 text-emerald-800' : (row.ptsA === row.ptsB ? 'bg-slate-100 text-slate-600' : 'text-slate-400')
                            ]"
                          >
                            {{ row.ptsB }}
                          </span>
                        </td>
                        <td class="py-2.5 px-3 font-bold text-navy text-xs">
                          <span class="px-2 py-0.5 rounded-lg bg-slate-100/80">
                            {{ row.scoreB || '-' }}
                          </span>
                        </td>
                        <td class="py-2.5 px-3 text-right font-bold text-navy text-xs">
                          {{ row.runningA }} - {{ row.runningB }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div v-else class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-slate-400 text-xs space-y-1">
                  <Icon icon="ph:info-bold" class="text-2xl mx-auto text-slate-300" />
                  <p class="font-medium text-slate-500">No individual arrow end breakdown recorded.</p>
                  <p class="text-[11px] text-slate-400">Match result logged with final set scores.</p>
                </div>
              </div>

              <!-- Footer Actions -->
              <div class="pt-2 border-t border-slate-100 flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Icon icon="ph:seal-check-fill" class="text-primary text-sm" />
                  <span>Verified Ianseo Result</span>
                </div>

                <button
                  type="button"
                  @click="selectedMatch = null"
                  class="px-5 py-2 rounded-xl bg-navy hover:bg-navy/90 text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  rounds: {
    type: Object,
    required: true
  },
  config: {
    type: Object,
    default: () => ({})
  }
})

// Layout Calculations
const BASE_MATCH_HEIGHT = 140
const HUB_UNIT_HEIGHT = 520

const getTotalRounds = computed(() => Object.keys(props.rounds || {}).length)

const hasMatches = computed(() => {
  const r = props.rounds || {}
  return Object.values(r).some(arr => Array.isArray(arr) && arr.length > 0)
})

const leftSideRoundNumbers = computed(() => {
  const total = getTotalRounds.value
  const nums = []
  for (let i = 1; i <= Math.max(1, total - 2); i++) nums.push(i)
  return nums
})

const rightSideRoundNumbers = computed(() => {
  const total = getTotalRounds.value
  const nums = []
  for (let i = Math.max(1, total - 2); i >= 1; i--) nums.push(i)
  return nums
})

const semifinalMatches = computed(() => {
  const total = getTotalRounds.value
  return props.rounds?.[total - 1] || []
})

const finalMatches = computed(() => {
  const total = getTotalRounds.value
  return props.rounds?.[total] || []
})

const goldMatch = computed(() => finalMatches.value[0] || null)
const bronzeMatch = computed(() => finalMatches.value[1] || null)

const getMatchesForSide = (roundNo, side) => {
  const all = props.rounds?.[roundNo] || []
  const half = Math.ceil(all.length / 2)
  return side === 'left' ? all.slice(0, half) : all.slice(half)
}

const getRoundName = (roundNo) => {
  const size = props.config?.bracket_size || 8
  const totalRoundsForSize = Math.max(1, Math.round(Math.log2(size)))
  const roundFromEnd = totalRoundsForSize - roundNo + 1
  if (roundFromEnd <= 1) return 'Final'
  if (roundFromEnd === 2) return 'Semifinal'
  if (roundFromEnd === 3) return 'Quarterfinal'
  return `1/${Math.pow(2, roundFromEnd)} Final`
}

const getSideTotalHeight = computed(() => {
  const size = props.config?.bracket_size || 8
  const maxSideMatches = Math.max(1, size / 4)
  const matchesHeight = maxSideMatches * BASE_MATCH_HEIGHT
  return Math.max(matchesHeight, HUB_UNIT_HEIGHT)
})

const getSlotHeightForSide = (roundNo) => {
  const r = parseInt(roundNo)
  return Math.pow(2, r - 1) * BASE_MATCH_HEIGHT
}

const calculateConnectorPath = (i, roundNo, side = 'left', isSingle = false) => {
  const r = parseInt(roundNo)
  const slotHeight = getSlotHeightForSide(r)
  const nextSlotHeight = getSlotHeightForSide(r + 1)
  const totalH = getSideTotalHeight.value

  const matchesInSide = getMatchesForSide(r, side).length
  const roundBlockHeight = matchesInSide * slotHeight
  const vOffset = (totalH - roundBlockHeight) / 2

  const y1 = vOffset + (i - 1) * nextSlotHeight + slotHeight / 2
  const y2 = vOffset + (i - 1) * nextSlotHeight + slotHeight / 2 + slotHeight
  const targetY = vOffset + (i - 1) * nextSlotHeight + nextSlotHeight / 2

  if (isSingle) {
    const hubArrivalY = totalH / 2
    if (side === 'left') {
      return `M 0 ${y1} H 30 V ${hubArrivalY} H 60`
    } else {
      return `M 60 ${y1} H 30 V ${hubArrivalY} H 0`
    }
  }

  if (side === 'left') {
    return `M 0 ${y1} H 30 V ${targetY} H 60 M 0 ${y2} H 30 V ${targetY} H 60`
  } else {
    return `M 60 ${y1} H 30 V ${targetY} H 0 M 60 ${y2} H 30 V ${targetY} H 0`
  }
}

// ─────────────────────────────────────────────────────────────
// INTERACTIVE MATCH SELECTION & SET BREAKDOWN MODAL
// ─────────────────────────────────────────────────────────────
const selectedMatch = ref(null)
const selectedMatchRoundName = ref('')

const selectMatch = (match, roundName) => {
  if (!match) return
  selectedMatch.value = match
  selectedMatchRoundName.value = roundName || 'Match Detail'
}

const parsedSetRows = computed(() => {
  if (!selectedMatch.value) return []
  const m = selectedMatch.value
  const setsA = String(m.sets_a || '').trim().split(/\s+/).filter(Boolean)
  const setsB = String(m.sets_b || '').trim().split(/\s+/).filter(Boolean)
  
  const maxLen = Math.max(setsA.length, setsB.length)
  if (maxLen === 0) return []

  const rows = []
  let cumulativeA = 0
  let cumulativeB = 0

  for (let i = 0; i < maxLen; i++) {
    const sA = setsA[i] || ''
    const sB = setsB[i] || ''
    const numA = parseFloat(sA)
    const numB = parseFloat(sB)

    let ptsA = 0
    let ptsB = 0
    if (!isNaN(numA) && !isNaN(numB)) {
      if (numA > numB) ptsA = 2
      else if (numB > numA) ptsB = 2
      else if (numA === numB) { ptsA = 1; ptsB = 1 }
    }

    cumulativeA += ptsA
    cumulativeB += ptsB

    rows.push({
      scoreA: sA,
      scoreB: sB,
      ptsA,
      ptsB,
      runningA: cumulativeA,
      runningB: cumulativeB
    })
  }
  return rows
})

// Helpers
const toTitleCase = (str) => {
  if (!str) return ''
  return String(str).toLowerCase().replace(/(^|\s|[-/])\S/g, txt => txt.toUpperCase())
}

const getInitials = (name) => {
  if (!name || name === 'TBD' || name === 'BYE') return 'A'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
