<template>
  <div class="external-bracket-container relative">
    <!-- Bracket Scrollable Visual Canvas -->
    <div class="overflow-x-auto no-scrollbar py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-200/80">
      <div v-if="hasMatches" class="flex items-center justify-center min-w-max gap-4 sm:gap-6 mx-auto relative z-10">

        <!-- ── LEFT SIDE ROUNDS (E.G. 1/8, 1/4) ── -->
        <template v-for="rNo in leftSideRoundNumbers" :key="'left-' + rNo">
          <div class="flex flex-col items-center min-w-[240px] sm:min-w-[260px]">
            <!-- Round Title Header -->
            <div class="h-12 flex flex-col items-center justify-center mb-6">
              <span class="text-xs font-bold text-slate-500 font-display uppercase tracking-wider">
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
                <!-- Match Card Node -->
                <div 
                  @click="selectMatch(match, getRoundName(parseInt(rNo)))"
                  class="w-[230px] sm:w-[250px] bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-navy/60 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group select-none"
                >
                  <!-- Card Header Bar -->
                  <div class="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    <div class="flex items-center gap-1 truncate">
                      <Icon icon="ph:trophy-bold" class="text-primary text-xs shrink-0" />
                      <span class="truncate">M{{ match.match_no || 1 }}</span>
                    </div>
                    <span v-if="match.winner_entry_id" class="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      Done
                    </span>
                  </div>

                  <!-- Archer A Row -->
                  <div 
                    :class="[
                      'flex items-center justify-between px-3 py-2 border-b border-slate-100 transition-colors',
                      match.winner_entry_id === 'a' ? 'bg-primary/10 font-bold' : ''
                    ]"
                  >
                    <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <span v-if="match.entry_a_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_a_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'a' ? 'font-bold' : 'font-medium'">
                        {{ toTitleCase(match.entry_a_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'a'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span class="font-mono text-xs font-bold text-navy shrink-0">
                      {{ match.set_points_a !== undefined && match.set_points_a !== '' ? match.set_points_a : '-' }}
                    </span>
                  </div>

                  <!-- Archer B Row -->
                  <div 
                    :class="[
                      'flex items-center justify-between px-3 py-2 transition-colors',
                      match.winner_entry_id === 'b' ? 'bg-primary/10 font-bold' : ''
                    ]"
                  >
                    <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <span v-if="match.entry_b_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_b_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'b' ? 'font-bold' : 'font-medium'">
                        {{ toTitleCase(match.entry_b_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'b'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span class="font-mono text-xs font-bold text-navy shrink-0">
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
          <div class="h-12 flex flex-col items-center justify-center mb-6">
            <span class="text-xs font-bold text-amber-700 font-display uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="ph:crown-simple-fill" class="text-amber-500 text-sm" />
              Finals Arena
            </span>
          </div>

          <!-- Finals Column -->
          <div class="flex flex-col justify-between items-center w-full py-2" :style="{ height: getSideTotalHeight + 'px' }">
            
            <!-- 1. Gold Medal Final (Top) -->
            <div class="w-full flex flex-col items-center space-y-2">
              <div class="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-400/50 flex items-center gap-1.5 text-xs font-bold text-amber-950 font-display shadow-2xs">
                <Icon icon="ph:crown-fill" class="text-amber-600 text-xs" />
                <span>Gold Medal Final</span>
              </div>

              <div 
                v-if="goldMatch"
                @click="selectMatch(goldMatch, 'Gold Medal Final')"
                class="w-[260px] sm:w-[280px] bg-white rounded-2xl border-2 border-amber-400/60 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group select-none"
              >
                <!-- Gold Header -->
                <div class="flex items-center justify-between px-3 py-1.5 bg-amber-500/10 border-b border-amber-400/30 text-[11px] font-bold text-amber-950">
                  <div class="flex items-center gap-1">
                    <Icon icon="ph:medal-fill" class="text-amber-600 text-xs" />
                    <span>Gold Match</span>
                  </div>
                  <span v-if="goldMatch.winner_entry_id" class="px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-950 text-[10px] font-black">
                    Champion
                  </span>
                </div>

                <!-- Archer A -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 transition-colors',
                    goldMatch.winner_entry_id === 'a' ? 'bg-amber-100/50 font-bold' : ''
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span v-if="goldMatch.entry_a_seed" class="size-5 rounded-md bg-amber-200/70 text-amber-950 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {{ goldMatch.entry_a_seed }}
                    </span>
                    <span class="text-xs truncate text-navy" :class="goldMatch.winner_entry_id === 'a' ? 'font-bold' : 'font-medium'">
                      {{ toTitleCase(goldMatch.entry_a_name || 'TBD') }}
                    </span>
                    <Icon v-if="goldMatch.winner_entry_id === 'a'" icon="ph:crown-fill" class="text-amber-500 text-sm shrink-0" />
                  </div>
                  <span class="font-mono text-sm font-bold text-navy shrink-0">
                    {{ goldMatch.set_points_a !== undefined && goldMatch.set_points_a !== '' ? goldMatch.set_points_a : '-' }}
                  </span>
                </div>

                <!-- Archer B -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2.5 transition-colors',
                    goldMatch.winner_entry_id === 'b' ? 'bg-amber-100/50 font-bold' : ''
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span v-if="goldMatch.entry_b_seed" class="size-5 rounded-md bg-amber-200/70 text-amber-950 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                      {{ goldMatch.entry_b_seed }}
                    </span>
                    <span class="text-xs truncate text-navy" :class="goldMatch.winner_entry_id === 'b' ? 'font-bold' : 'font-medium'">
                      {{ toTitleCase(goldMatch.entry_b_name || 'TBD') }}
                    </span>
                    <Icon v-if="goldMatch.winner_entry_id === 'b'" icon="ph:crown-fill" class="text-amber-500 text-sm shrink-0" />
                  </div>
                  <span class="font-mono text-sm font-bold text-navy shrink-0">
                    {{ goldMatch.set_points_b !== undefined && goldMatch.set_points_b !== '' ? goldMatch.set_points_b : '-' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 2. Semifinals (Middle) if present -->
            <div v-if="semifinalMatches.length > 0" class="w-full flex flex-col items-center space-y-2 my-auto">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Semifinals
              </div>
              <div class="flex flex-col gap-3">
                <div 
                  v-for="sMatch in semifinalMatches"
                  :key="sMatch.id"
                  @click="selectMatch(sMatch, 'Semifinal')"
                  class="w-[240px] sm:w-[260px] bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-navy/60 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group select-none"
                >
                  <div class="flex items-center justify-between px-3 py-1 bg-slate-50 border-b border-slate-100 text-[10px] font-semibold text-slate-500">
                    <span>Semi Match</span>
                    <span v-if="sMatch.winner_entry_id" class="text-emerald-700 font-bold">Done</span>
                  </div>
                  <div class="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 text-xs">
                    <span class="truncate text-navy font-medium">{{ toTitleCase(sMatch.entry_a_name || 'TBD') }}</span>
                    <span class="font-mono font-bold">{{ sMatch.set_points_a }}</span>
                  </div>
                  <div class="px-3 py-1.5 flex items-center justify-between text-xs">
                    <span class="truncate text-navy font-medium">{{ toTitleCase(sMatch.entry_b_name || 'TBD') }}</span>
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
                class="w-[240px] sm:w-[260px] bg-white rounded-2xl border border-amber-700/30 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group select-none"
              >
                <!-- Archer A -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3 py-2 border-b border-slate-100 transition-colors',
                    bronzeMatch.winner_entry_id === 'a' ? 'bg-amber-700/10 font-bold' : ''
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span class="text-xs truncate text-navy" :class="bronzeMatch.winner_entry_id === 'a' ? 'font-bold' : 'font-medium'">
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
                    bronzeMatch.winner_entry_id === 'b' ? 'bg-amber-700/10 font-bold' : ''
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span class="text-xs truncate text-navy" :class="bronzeMatch.winner_entry_id === 'b' ? 'font-bold' : 'font-medium'">
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
            <div class="h-12 flex flex-col items-center justify-center mb-6">
              <span class="text-xs font-bold text-slate-500 font-display uppercase tracking-wider">
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
                <!-- Match Card Node -->
                <div 
                  @click="selectMatch(match, getRoundName(parseInt(rNo)))"
                  class="w-[230px] sm:w-[250px] bg-white rounded-2xl border border-slate-200 shadow-2xs hover:border-navy/60 hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer overflow-hidden group select-none"
                >
                  <!-- Card Header Bar -->
                  <div class="flex items-center justify-between px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    <div class="flex items-center gap-1 truncate">
                      <Icon icon="ph:trophy-bold" class="text-primary text-xs shrink-0" />
                      <span class="truncate">M{{ match.match_no || 1 }}</span>
                    </div>
                    <span v-if="match.winner_entry_id" class="px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                      Done
                    </span>
                  </div>

                  <!-- Archer A Row -->
                  <div 
                    :class="[
                      'flex items-center justify-between px-3 py-2 border-b border-slate-100 transition-colors',
                      match.winner_entry_id === 'a' ? 'bg-primary/10 font-bold' : ''
                    ]"
                  >
                    <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <span v-if="match.entry_a_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_a_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'a' ? 'font-bold' : 'font-medium'">
                        {{ toTitleCase(match.entry_a_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'a'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span class="font-mono text-xs font-bold text-navy shrink-0">
                      {{ match.set_points_a !== undefined && match.set_points_a !== '' ? match.set_points_a : '-' }}
                    </span>
                  </div>

                  <!-- Archer B Row -->
                  <div 
                    :class="[
                      'flex items-center justify-between px-3 py-2 transition-colors',
                      match.winner_entry_id === 'b' ? 'bg-primary/10 font-bold' : ''
                    ]"
                  >
                    <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      <span v-if="match.entry_b_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_b_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'b' ? 'font-bold' : 'font-medium'">
                        {{ toTitleCase(match.entry_b_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'b'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span class="font-mono text-xs font-bold text-navy shrink-0">
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
    <!-- INTERACTIVE MATCH SCORING DETAIL MODAL (IANSEO-POWERED SET BREAKDOWN) -->
    <!-- ========================================================================= -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div 
          v-if="selectedMatch" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs"
          @click.self="selectedMatch = null"
        >
          <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-7 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <!-- Modal Close Button -->
            <button
              type="button"
              @click="selectedMatch = null"
              class="absolute right-5 top-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-navy flex items-center justify-center transition-colors cursor-pointer"
            >
              <Icon icon="ph:x-bold" class="text-sm" />
            </button>

            <!-- Match Header -->
            <div class="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div class="size-11 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                <Icon icon="ph:sword-bold" class="text-xl text-navy" />
              </div>
              <div class="min-w-0 pr-6">
                <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display">
                  {{ selectedMatchRoundName || 'Elimination Match' }}
                </div>
                <h3 class="text-base sm:text-lg font-black text-navy font-display truncate">
                  Match #{{ selectedMatch.match_no || 1 }} Scoring Details
                </h3>
              </div>
            </div>

            <!-- Head to Head Hero Card -->
            <div class="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-11 items-center gap-2">
              <!-- Archer A -->
              <div class="col-span-5 flex flex-col items-center text-center space-y-1">
                <div class="relative">
                  <div class="size-12 rounded-full bg-navy/10 text-navy font-black text-sm flex items-center justify-center border-2 border-slate-200">
                    {{ getInitials(selectedMatch.entry_a_name) }}
                  </div>
                  <div v-if="selectedMatch.winner_entry_id === 'a'" class="absolute -top-1 -right-1 size-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                    <Icon icon="ph:crown-fill" class="text-xs" />
                  </div>
                </div>
                <div class="font-bold text-navy text-xs sm:text-sm line-clamp-1 w-full" :title="selectedMatch.entry_a_name">
                  {{ toTitleCase(selectedMatch.entry_a_name || 'TBD') }}
                </div>
                <div v-if="selectedMatch.entry_a_seed" class="text-[10px] font-mono text-slate-400 font-semibold">
                  Seed #{{ selectedMatch.entry_a_seed }}
                </div>
                <div class="text-2xl font-black font-display text-navy pt-1">
                  {{ selectedMatch.set_points_a !== undefined && selectedMatch.set_points_a !== '' ? selectedMatch.set_points_a : '-' }}
                </div>
              </div>

              <!-- VS Badge -->
              <div class="col-span-1 flex flex-col items-center justify-center">
                <span class="text-[10px] font-black font-display text-slate-300">VS</span>
              </div>

              <!-- Archer B -->
              <div class="col-span-5 flex flex-col items-center text-center space-y-1">
                <div class="relative">
                  <div class="size-12 rounded-full bg-navy/10 text-navy font-black text-sm flex items-center justify-center border-2 border-slate-200">
                    {{ getInitials(selectedMatch.entry_b_name) }}
                  </div>
                  <div v-if="selectedMatch.winner_entry_id === 'b'" class="absolute -top-1 -right-1 size-5 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                    <Icon icon="ph:crown-fill" class="text-xs" />
                  </div>
                </div>
                <div class="font-bold text-navy text-xs sm:text-sm line-clamp-1 w-full" :title="selectedMatch.entry_b_name">
                  {{ toTitleCase(selectedMatch.entry_b_name || 'TBD') }}
                </div>
                <div v-if="selectedMatch.entry_b_seed" class="text-[10px] font-mono text-slate-400 font-semibold">
                  Seed #{{ selectedMatch.entry_b_seed }}
                </div>
                <div class="text-2xl font-black font-display text-navy pt-1">
                  {{ selectedMatch.set_points_b !== undefined && selectedMatch.set_points_b !== '' ? selectedMatch.set_points_b : '-' }}
                </div>
              </div>
            </div>

            <!-- Set-by-Set Arrow Breakdown Table -->
            <div class="mt-5 space-y-2">
              <div class="flex items-center justify-between text-xs font-bold text-slate-500 font-display px-1">
                <span>Set by Set Breakdown</span>
                <span class="text-[10px] font-mono text-slate-400 font-normal">Official Ianseo Data</span>
              </div>

              <div v-if="parsedSetRows.length > 0" class="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table class="w-full text-center text-xs border-collapse">
                  <thead class="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                    <tr>
                      <th class="py-2.5 px-3 text-left">Set</th>
                      <th class="py-2.5 px-3">Archer A End</th>
                      <th class="py-2.5 px-2">Pts</th>
                      <th class="py-2.5 px-2">Pts</th>
                      <th class="py-2.5 px-3">Archer B End</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 bg-white font-mono">
                    <tr 
                      v-for="(row, rIdx) in parsedSetRows" 
                      :key="rIdx"
                      class="hover:bg-slate-50/50 transition-colors"
                    >
                      <td class="py-2 px-3 text-left font-sans font-bold text-slate-400 text-xs">
                        Set {{ rIdx + 1 }}
                      </td>
                      <td class="py-2 px-3 font-bold text-navy text-xs">
                        {{ row.scoreA || '-' }}
                      </td>
                      <td class="py-2 px-2 text-xs font-bold" :class="row.ptsA > row.ptsB ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500'">
                        {{ row.ptsA }}
                      </td>
                      <td class="py-2 px-2 text-xs font-bold" :class="row.ptsB > row.ptsA ? 'text-emerald-600 bg-emerald-50/50' : 'text-slate-500'">
                        {{ row.ptsB }}
                      </td>
                      <td class="py-2 px-3 font-bold text-navy text-xs">
                        {{ row.scoreB || '-' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else class="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-slate-400 text-xs">
                <Icon icon="ph:info-bold" class="text-xl mx-auto mb-1 text-slate-300" />
                <span>No end-by-end arrow scores recorded for this match.</span>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="mt-6 flex justify-end">
              <button
                type="button"
                @click="selectedMatch = null"
                class="px-4 py-2 bg-navy hover:bg-navy/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Close
              </button>
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

    rows.push({
      scoreA: sA,
      scoreB: sB,
      ptsA,
      ptsB
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
