<template>
  <div class="external-bracket-container relative flex flex-col font-sans" ref="bracketContainerRef">
    <!-- ── BRACKET SCROLLABLE VISUAL CANVAS ── -->
    <div class="bracket-canvas-wrapper overflow-x-auto no-scrollbar py-6 px-4 sm:px-6 bg-slate-50/40 rounded-3xl border border-slate-200/80 transition-all">
      <!-- Bracket Nodes Tree with Scale Transform -->
      <div 
        v-if="hasMatches" 
        class="flex items-start justify-start min-w-max gap-0 mx-auto relative z-10 transition-transform duration-150 origin-left py-2"
      >

        <!-- ── SUCCESSIVE ELIMINATION ROUNDS (1/8, QUARTERFINALS, SEMIFINALS) ── -->
        <template v-for="(rNo, rIdx) in nonFinalRoundNumbers" :key="'round-' + rNo">
          <!-- Round Column -->
          <div class="flex flex-col items-center min-w-[240px] sm:min-w-[260px]">
            <!-- Round Title Header -->
            <div class="h-10 flex flex-col items-center justify-center mb-6">
              <span 
                :class="[
                  'text-xs font-bold px-3 py-1 rounded-xl shadow-2xs',
                  isExpandedFullscreen ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white border border-slate-200/80 text-slate-600'
                ]"
              >
                {{ getRoundName(parseInt(rNo)) }}
              </span>
            </div>

            <!-- Match Slots Column -->
            <div class="flex flex-col justify-around w-full" :style="{ height: getCanvasTotalHeight + 'px' }">
              <div 
                v-for="match in (rounds[rNo] || [])" 
                :key="match.id" 
                class="flex items-center justify-center w-full my-auto"
                :style="{ height: getSlotHeight(rNo) + 'px' }"
              >
                <!-- Match Card Node (No custom fonts) -->
                <div 
                  @click="selectMatch(match, getRoundName(parseInt(rNo)))"
                  class="w-[230px] sm:w-[250px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none relative"
                >
                  <!-- Card Micro-Header -->
                  <div class="flex items-center justify-between px-3 py-1.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    <div class="flex items-center gap-1.5">
                      <span>Match {{ match.match_no || 1 }}</span>
                    </div>
                    <div class="flex items-center gap-1 text-[10px] text-slate-400 group-hover:text-navy transition-colors">
                      <span>Scorecard</span>
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
                      <span v-if="match.entry_a_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_a_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'a' ? 'font-bold' : 'font-medium text-slate-700'">
                        {{ toTitleCase(match.entry_a_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'a'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span 
                      :class="[
                        'text-xs px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors',
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
                      <span v-if="match.entry_b_seed" class="size-4.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {{ match.entry_b_seed }}
                      </span>
                      <span class="text-xs truncate text-navy" :class="match.winner_entry_id === 'b' ? 'font-bold' : 'font-medium text-slate-700'">
                        {{ toTitleCase(match.entry_b_name || 'TBD') }}
                      </span>
                      <Icon v-if="match.winner_entry_id === 'b'" icon="ph:crown-fill" class="text-amber-500 text-xs shrink-0" />
                    </div>
                    <span 
                      :class="[
                        'text-xs px-2 py-0.5 rounded-md font-bold shrink-0 transition-colors',
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

          <!-- Connector Path Between Rounds -->
          <div class="w-12 sm:w-14 shrink-0 relative" :style="{ height: getCanvasTotalHeight + 'px', marginTop: '40px' }">
            <svg class="w-full h-full" :viewBox="`0 0 50 ${getCanvasTotalHeight}`" preserveAspectRatio="none">
              <path 
                v-for="pathD in getConnectorPathsForRound(rNo)" 
                :key="pathD"
                class="stroke-slate-300 stroke-[1.5px] fill-none" 
                :d="pathD" 
              />
            </svg>
          </div>
        </template>

        <!-- ── FINALS COLUMN (GOLD MEDAL FINAL IN VERTICAL CENTER & BRONZE MEDAL FINAL) ── -->
        <div class="flex flex-col items-center min-w-[270px] sm:min-w-[290px]">
          <!-- Hub Header -->
          <div class="h-10 flex flex-col items-center justify-center mb-6">
            <span 
              :class="[
                'text-xs font-bold px-3.5 py-1 rounded-xl shadow-2xs flex items-center gap-1.5',
                isExpandedFullscreen ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-amber-500/10 text-amber-950 border border-amber-400/40'
              ]"
            >
              <Icon icon="ph:crown-simple-fill" class="text-amber-500 text-sm" />
              Finals Arena
            </span>
          </div>

          <!-- Finals Cards Container: Vertically Centered at 50% Midpoint -->
          <div class="flex flex-col justify-center items-center w-full py-2 space-y-4" :style="{ height: getCanvasTotalHeight + 'px' }">
            
            <!-- 1. Gold Medal Final (Centered at exact vertical midpoint matching connector line) -->
            <div class="w-full flex flex-col items-center space-y-2">
              <div class="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center gap-1.5 text-xs font-bold text-amber-950 shadow-2xs">
                <Icon icon="ph:crown-fill" class="text-amber-600 text-xs" />
                <span>Gold Medal Final</span>
              </div>

              <div 
                v-if="resolvedGoldMatch"
                @click="selectMatch(resolvedGoldMatch, 'Gold Medal Final')"
                class="w-[240px] sm:w-[260px] bg-gradient-to-b from-amber-50/40 via-white to-white rounded-2xl border-2 border-amber-400/70 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none"
              >
                <!-- Gold Header -->
                <div class="flex items-center justify-between px-3.5 py-1.5 bg-amber-500/15 border-b border-amber-400/30 text-[11px] font-bold text-amber-950">
                  <div class="flex items-center gap-1.5">
                    <Icon icon="ph:medal-fill" class="text-amber-600 text-xs" />
                    <span>Gold Match</span>
                  </div>
                  <span v-if="resolvedGoldMatch.winner_entry_id" class="px-1.5 py-0.2 rounded-md bg-amber-500/25 text-amber-950 text-[10px] font-black">
                    Champion
                  </span>
                </div>

                <!-- Archer A -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2.5 border-b border-slate-100 transition-colors',
                    resolvedGoldMatch.winner_entry_id === 'a' ? 'bg-amber-100/50 font-bold border-l-3 border-l-amber-500' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span v-if="resolvedGoldMatch.entry_a_seed" class="size-5 rounded-md bg-amber-200/70 text-amber-950 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {{ resolvedGoldMatch.entry_a_seed }}
                    </span>
                    <span class="text-xs truncate text-navy" :class="resolvedGoldMatch.winner_entry_id === 'a' ? 'font-black text-navy' : 'font-medium text-slate-700'">
                      {{ toTitleCase(resolvedGoldMatch.entry_a_name || 'TBD') }}
                    </span>
                    <Icon v-if="resolvedGoldMatch.winner_entry_id === 'a'" icon="ph:crown-fill" class="text-amber-500 text-sm shrink-0" />
                  </div>
                  <span 
                    :class="[
                      'text-sm px-2 py-0.5 rounded-md font-bold shrink-0',
                      resolvedGoldMatch.winner_entry_id === 'a' ? 'bg-amber-400 text-amber-950 font-black shadow-2xs' : 'text-slate-400'
                    ]"
                  >
                    {{ resolvedGoldMatch.set_points_a !== undefined && resolvedGoldMatch.set_points_a !== '' ? resolvedGoldMatch.set_points_a : '-' }}
                  </span>
                </div>

                <!-- Archer B -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2.5 transition-colors',
                    resolvedGoldMatch.winner_entry_id === 'b' ? 'bg-amber-100/50 font-bold border-l-3 border-l-amber-500' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span v-if="resolvedGoldMatch.entry_b_seed" class="size-5 rounded-md bg-amber-200/70 text-amber-950 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {{ resolvedGoldMatch.entry_b_seed }}
                    </span>
                    <span class="text-xs truncate text-navy" :class="resolvedGoldMatch.winner_entry_id === 'b' ? 'font-black text-navy' : 'font-medium text-slate-700'">
                      {{ toTitleCase(resolvedGoldMatch.entry_b_name || 'TBD') }}
                    </span>
                    <Icon v-if="resolvedGoldMatch.winner_entry_id === 'b'" icon="ph:crown-fill" class="text-amber-500 text-sm shrink-0" />
                  </div>
                  <span 
                    :class="[
                      'text-sm px-2 py-0.5 rounded-md font-bold shrink-0',
                      resolvedGoldMatch.winner_entry_id === 'b' ? 'bg-amber-400 text-amber-950 font-black shadow-2xs' : 'text-slate-400'
                    ]"
                  >
                    {{ resolvedGoldMatch.set_points_b !== undefined && resolvedGoldMatch.set_points_b !== '' ? resolvedGoldMatch.set_points_b : '-' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 2. Bronze Medal Final (Neatly underneath Gold Final) -->
            <div v-if="resolvedBronzeMatch" class="w-full flex flex-col items-center space-y-1.5 pt-2">
              <div class="px-2.5 py-0.5 rounded-lg bg-amber-700/10 border border-amber-700/20 flex items-center gap-1.5 text-[10px] font-bold text-amber-900 shadow-2xs">
                <Icon icon="ph:medal-fill" class="text-amber-700 text-xs" />
                <span>Bronze Medal Final (3rd Place)</span>
              </div>

              <div 
                @click="selectMatch(resolvedBronzeMatch, 'Bronze Medal Final')"
                class="w-[240px] sm:w-[260px] bg-white rounded-2xl border border-amber-700/30 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none"
              >
                <!-- Bronze Header -->
                <div class="flex items-center justify-between px-3.5 py-1 bg-amber-700/10 border-b border-amber-700/20 text-[10px] font-bold text-amber-900">
                  <div class="flex items-center gap-1">
                    <Icon icon="ph:medal-fill" class="text-amber-700 text-xs" />
                    <span>Bronze Match</span>
                  </div>
                  <span v-if="resolvedBronzeMatch.winner_entry_id" class="px-1.5 py-0.2 rounded-md bg-amber-700/20 text-amber-900 text-[9px] font-bold">
                    3rd Place
                  </span>
                </div>

                <!-- Archer A -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2 border-b border-slate-100 transition-colors',
                    resolvedBronzeMatch.winner_entry_id === 'a' ? 'bg-amber-700/10 font-bold border-l-3 border-l-amber-700' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span v-if="resolvedBronzeMatch.entry_a_seed" class="size-4.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {{ resolvedBronzeMatch.entry_a_seed }}
                    </span>
                    <span class="text-xs truncate text-navy" :class="resolvedBronzeMatch.winner_entry_id === 'a' ? 'font-bold' : 'font-medium text-slate-700'">
                      {{ toTitleCase(resolvedBronzeMatch.entry_a_name || 'TBD') }}
                    </span>
                    <Icon v-if="resolvedBronzeMatch.winner_entry_id === 'a'" icon="ph:medal-fill" class="text-amber-700 text-xs shrink-0" />
                  </div>
                  <span :class="['text-xs px-2 py-0.5 rounded-md font-bold shrink-0', resolvedBronzeMatch.winner_entry_id === 'a' ? 'bg-amber-700/15 text-amber-900 font-black' : 'text-slate-400']">
                    {{ resolvedBronzeMatch.set_points_a !== undefined && resolvedBronzeMatch.set_points_a !== '' ? resolvedBronzeMatch.set_points_a : '-' }}
                  </span>
                </div>

                <!-- Archer B -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2 transition-colors',
                    resolvedBronzeMatch.winner_entry_id === 'b' ? 'bg-amber-700/10 font-bold border-l-3 border-l-amber-700' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span v-if="resolvedBronzeMatch.entry_b_seed" class="size-4.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {{ resolvedBronzeMatch.entry_b_seed }}
                    </span>
                    <span class="text-xs truncate text-navy" :class="resolvedBronzeMatch.winner_entry_id === 'b' ? 'font-bold' : 'font-medium text-slate-700'">
                      {{ toTitleCase(resolvedBronzeMatch.entry_b_name || 'TBD') }}
                    </span>
                    <Icon v-if="resolvedBronzeMatch.winner_entry_id === 'b'" icon="ph:medal-fill" class="text-amber-700 text-xs shrink-0" />
                  </div>
                  <span :class="['text-xs px-2 py-0.5 rounded-md font-bold shrink-0', resolvedBronzeMatch.winner_entry_id === 'b' ? 'bg-amber-700/15 text-amber-900 font-black' : 'text-slate-400']">
                    {{ resolvedBronzeMatch.set_points_b !== undefined && resolvedBronzeMatch.set_points_b !== '' ? resolvedBronzeMatch.set_points_b : '-' }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20 text-slate-400">
        <Icon icon="ph:sword" class="text-3xl mx-auto mb-2 text-slate-300" />
        <div class="text-xs sm:text-sm font-medium">No matches available in this round bracket.</div>
      </div>
    </div>

    <!-- ── REFINED INTERACTIVE SCORECARD MODAL DIALOG (No <p> tags, No custom font) ── -->
    <ClientOnly>
      <Teleport to="body">
        <!-- Backdrop Transition -->
        <Transition
          enter-active-class="transition-opacity duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div 
            v-if="selectedMatch" 
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto font-sans"
          >
            <!-- Overlay with Blur -->
            <div 
              class="fixed inset-0 bg-navy/60 backdrop-blur-sm"
              @click="selectedMatch = null"
            ></div>

            <!-- Modal Dialog Card -->
            <Transition
              enter-active-class="transition duration-300 cubic-bezier(0.16, 1, 0.3, 1)"
              enter-from-class="opacity-0 scale-95 translate-y-4"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-4"
              appear
            >
              <div 
                v-if="selectedMatch"
                class="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-xl w-full overflow-hidden relative z-10 my-auto"
              >
                <!-- Brand Accent Top Bar -->
                <div class="h-1.5 w-full bg-gradient-to-r from-primary via-primary-hover to-primary"></div>
                
                <!-- Modal Header Bar -->
                <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div class="flex items-center gap-3">
                    <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:sword-bold" class="text-lg text-navy" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="text-base font-bold text-navy">
                          {{ selectedMatchRoundName || 'Elimination Match' }}
                        </h3>
                        <span class="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-bold">
                          Match #{{ selectedMatch.match_no || 1 }}
                        </span>
                      </div>
                      <div class="text-[11px] text-slate-400 font-medium mt-0.5">
                        Head-to-head official elimination scorecard
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    @click="selectedMatch = null"
                    class="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-navy flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Icon icon="ph:x-bold" class="text-xs" />
                  </button>
                </div>

                <!-- Modal Body -->
                <div class="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                  
                  <!-- 1. Archer Face-Off Comparison Section -->
                  <div class="relative rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 border border-slate-200/80 p-5 overflow-hidden">
                    <div class="grid grid-cols-11 items-center gap-3 relative z-10">
                      
                      <!-- Archer A -->
                      <div class="col-span-5 flex flex-col items-center text-center space-y-2">
                        <!-- Avatar Wrapper -->
                        <div class="relative">
                          <div 
                            :class="[
                              'size-16 rounded-2xl p-0.5 transition-all shadow-sm flex items-center justify-center',
                              selectedMatch.winner_entry_id === 'a' 
                                ? 'bg-gradient-to-tr from-amber-400 to-primary ring-2 ring-primary ring-offset-2' 
                                : 'bg-slate-200'
                            ]"
                          >
                            <img 
                              :src="getAvatarUrl(selectedMatch.entry_a_name)" 
                              :alt="selectedMatch.entry_a_name || 'Archer A'"
                              class="size-full rounded-[14px] object-cover bg-slate-100"
                              @error="(e) => e.target.src = 'https://ui-avatars.com/api/?name=Archer&background=f1f5f9&color=94a3b8'"
                            />
                          </div>

                          <!-- Winner Crown Badge -->
                          <div 
                            v-if="selectedMatch.winner_entry_id === 'a'" 
                            class="absolute -top-2 -right-2 size-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md border-2 border-white"
                            title="Match Winner"
                          >
                            <Icon icon="ph:crown-fill" class="text-xs" />
                          </div>
                        </div>

                        <!-- Name & Seed -->
                        <div class="w-full px-1">
                          <div class="font-bold text-navy text-xs sm:text-sm truncate" :title="selectedMatch.entry_a_name">
                            {{ toTitleCase(selectedMatch.entry_a_name || 'TBD') }}
                          </div>
                          <div v-if="selectedMatch.entry_a_seed" class="inline-flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 mt-1">
                            <span>Seed #{{ selectedMatch.entry_a_seed }}</span>
                          </div>
                        </div>

                        <!-- Final Match Points -->
                        <div 
                          :class="[
                            'text-3xl sm:text-4xl font-black tracking-tight',
                            selectedMatch.winner_entry_id === 'a' ? 'text-navy' : 'text-slate-400'
                          ]"
                        >
                          {{ selectedMatch.set_points_a !== undefined && selectedMatch.set_points_a !== '' ? selectedMatch.set_points_a : '-' }}
                        </div>
                      </div>

                      <!-- Center VS Indicator -->
                      <div class="col-span-1 flex flex-col items-center justify-center">
                        <div class="size-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                          <span class="text-[10px] font-black text-slate-400">VS</span>
                        </div>
                      </div>

                      <!-- Archer B -->
                      <div class="col-span-5 flex flex-col items-center text-center space-y-2">
                        <!-- Avatar Wrapper -->
                        <div class="relative">
                          <div 
                            :class="[
                              'size-16 rounded-2xl p-0.5 transition-all shadow-sm flex items-center justify-center',
                              selectedMatch.winner_entry_id === 'b' 
                                ? 'bg-gradient-to-tr from-amber-400 to-primary ring-2 ring-primary ring-offset-2' 
                                : 'bg-slate-200'
                            ]"
                          >
                            <img 
                              :src="getAvatarUrl(selectedMatch.entry_b_name)" 
                              :alt="selectedMatch.entry_b_name || 'Archer B'"
                              class="size-full rounded-[14px] object-cover bg-slate-100"
                              @error="(e) => e.target.src = 'https://ui-avatars.com/api/?name=Archer&background=f1f5f9&color=94a3b8'"
                            />
                          </div>

                          <!-- Winner Crown Badge -->
                          <div 
                            v-if="selectedMatch.winner_entry_id === 'b'" 
                            class="absolute -top-2 -right-2 size-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-md border-2 border-white"
                            title="Match Winner"
                          >
                            <Icon icon="ph:crown-fill" class="text-xs" />
                          </div>
                        </div>

                        <!-- Name & Seed -->
                        <div class="w-full px-1">
                          <div class="font-bold text-navy text-xs sm:text-sm truncate" :title="selectedMatch.entry_b_name">
                            {{ toTitleCase(selectedMatch.entry_b_name || 'TBD') }}
                          </div>
                          <div v-if="selectedMatch.entry_b_seed" class="inline-flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 mt-1">
                            <span>Seed #{{ selectedMatch.entry_b_seed }}</span>
                          </div>
                        </div>

                        <!-- Final Match Points -->
                        <div 
                          :class="[
                            'text-3xl sm:text-4xl font-black tracking-tight',
                            selectedMatch.winner_entry_id === 'b' ? 'text-navy' : 'text-slate-400'
                          ]"
                        >
                          {{ selectedMatch.set_points_b !== undefined && selectedMatch.set_points_b !== '' ? selectedMatch.set_points_b : '-' }}
                        </div>
                      </div>

                    </div>
                  </div>

                  <!-- 2. Set by Set Arrow Breakdown Scorecard -->
                  <div class="space-y-3">
                    <div class="flex items-center justify-between px-0.5">
                      <div class="flex items-center gap-2">
                        <Icon icon="ph:target-bold" class="text-primary text-sm" />
                        <h4 class="text-xs font-bold text-navy">
                          Official Match Record
                        </h4>
                      </div>
                      <div class="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <Icon icon="ph:check-circle-fill" class="text-xs" />
                        <span>Set System (Ianseo)</span>
                      </div>
                    </div>

                    <!-- Sets Table -->
                    <div v-if="parsedSetRows.length > 0" class="overflow-x-auto rounded-2xl border border-slate-200">
                      <table class="w-full text-center border-collapse text-xs">
                        <thead>
                          <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                            <th class="py-2 px-3 text-left">Set</th>
                            <th class="py-2 px-3">End Score A</th>
                            <th class="py-2 px-2">Pts A</th>
                            <th class="py-2 px-2">Pts B</th>
                            <th class="py-2 px-3">End Score B</th>
                            <th class="py-2 px-3 text-right">Running</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                          <tr 
                            v-for="row in parsedSetRows" 
                            :key="row.set"
                            class="hover:bg-slate-50/60 transition-colors"
                          >
                            <td class="py-2.5 px-3 text-left font-bold text-slate-600">
                              Set {{ row.set }}
                            </td>
                            <td class="py-2.5 px-3 font-bold text-navy text-xs">
                              <span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/60 inline-block">
                                {{ row.scoreA || '-' }}
                              </span>
                            </td>
                            <td class="py-2.5 px-2">
                              <span 
                                :class="[
                                  'size-6 rounded-lg inline-flex items-center justify-center font-bold text-xs',
                                  row.ptsA > row.ptsB 
                                    ? 'bg-emerald-100 text-emerald-800 font-black' 
                                    : (row.ptsA === row.ptsB ? 'bg-slate-100 text-slate-600' : 'text-slate-400')
                                ]"
                              >
                                {{ row.ptsA }}
                              </span>
                            </td>
                            <td class="py-2.5 px-2">
                              <span 
                                :class="[
                                  'size-6 rounded-lg inline-flex items-center justify-center font-bold text-xs',
                                  row.ptsB > row.ptsA 
                                    ? 'bg-emerald-100 text-emerald-800 font-black' 
                                    : (row.ptsA === row.ptsB ? 'bg-slate-100 text-slate-600' : 'text-slate-400')
                                ]"
                              >
                                {{ row.ptsB }}
                              </span>
                            </td>
                            <td class="py-2.5 px-3 font-bold text-navy text-xs">
                              <span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/60 inline-block">
                                {{ row.scoreB || '-' }}
                              </span>
                            </td>
                            <td class="py-2.5 px-3 text-right font-bold text-navy text-xs">
                              <span class="px-2 py-0.5 rounded-md bg-navy/5 text-navy">
                                {{ row.runningA }} - {{ row.runningB }}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div v-else class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-slate-400 text-xs space-y-1">
                      <Icon icon="ph:info-bold" class="text-xl mx-auto text-slate-300" />
                      <div class="font-medium text-slate-500">No individual arrow end breakdown recorded.</div>
                    </div>
                  </div>

                </div>

                <!-- Modal Footer -->
                <div class="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                  <div class="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Icon icon="ph:check-circle-bold" class="text-emerald-500 text-sm" />
                    <span>Verified Official Result</span>
                  </div>

                  <button
                    type="button"
                    @click="selectedMatch = null"
                    class="px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    Close Scorecard
                  </button>
                </div>

              </div>
            </Transition>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  rounds: {
    type: Object,
    required: true,
    default: () => ({})
  },
  config: {
    type: Object,
    default: () => ({})
  },
  tournamentSlug: {
    type: [String, Number],
    default: ''
  },
  categoryName: {
    type: String,
    default: ''
  },
  isFullPage: {
    type: Boolean,
    default: false
  }
})

// ─────────────────────────────────────────────────────────────
// AVATAR & TYPOGRAPHY HELPERS
// ─────────────────────────────────────────────────────────────
const toTitleCase = (str) => {
  if (!str) return ''
  return String(str)
    .toLowerCase()
    .replace(/(?:^|\s|\/|-)\S/g, char => char.toUpperCase())
}

const getAvatarUrl = (name) => {
  if (!name || name === 'TBD' || name === 'BYE') {
    return 'https://ui-avatars.com/api/?name=??&background=f1f5f9&color=94a3b8&font-size=0.45'
  }
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ffaa00&color=202434&font-size=0.45&bold=true`
}

// ─────────────────────────────────────────────────────────────
// ROUNDS & MATCHES COMPUTATIONS
// ─────────────────────────────────────────────────────────────
const roundNumbers = computed(() => {
  return Object.keys(props.rounds || {})
    .map(Number)
    .sort((a, b) => a - b)
})

const totalRounds = computed(() => roundNumbers.value.length)
const hasMatches = computed(() => totalRounds.value > 0)

// Non-final rounds (e.g., 1/8, QF, SF)
const nonFinalRoundNumbers = computed(() => {
  const tot = totalRounds.value
  if (tot <= 1) return []
  return roundNumbers.value.slice(0, tot - 1)
})

const finalRoundNumber = computed(() => {
  if (totalRounds.value === 0) return null
  return roundNumbers.value[totalRounds.value - 1]
})

const finalMatches = computed(() => {
  if (!finalRoundNumber.value) return []
  return props.rounds[finalRoundNumber.value] || []
})

// Semifinal matches (round right before finals)
const semiFinalMatches = computed(() => {
  const tot = totalRounds.value
  if (tot < 2) return []
  const semiRoundNo = roundNumbers.value[tot - 2]
  return props.rounds[semiRoundNo] || []
})

// Resolve Gold Match: either from finalMatches or construct from Semifinal winners
const resolvedGoldMatch = computed(() => {
  const gold = finalMatches.value[0]
  if (gold && gold.entry_a_name && gold.entry_b_name) {
    return gold
  }
  
  // Reconstruct from Semifinal Winners if not explicitly provided
  const semis = semiFinalMatches.value
  if (semis.length >= 2) {
    const s1 = semis[0]
    const s2 = semis[1]
    const nameA = s1.winner_entry_id === 'b' ? s1.entry_b_name : s1.entry_a_name
    const seedA = s1.winner_entry_id === 'b' ? s1.entry_b_seed : s1.entry_a_seed
    const nameB = s2.winner_entry_id === 'b' ? s2.entry_b_name : s2.entry_a_name
    const seedB = s2.winner_entry_id === 'b' ? s2.entry_b_seed : s2.entry_a_seed

    return {
      id: 'gold_final_constructed',
      match_no: 'Gold',
      phase: 'Gold Medal Final',
      entry_a_id: 'a',
      entry_a_name: nameA || 'Winner SF1',
      entry_a_seed: seedA,
      set_points_a: gold?.set_points_a || '-',
      total_score_a: gold?.total_score_a || '-',
      sets_a: gold?.sets_a || '',
      entry_b_id: 'b',
      entry_b_name: nameB || 'Winner SF2',
      entry_b_seed: seedB,
      set_points_b: gold?.set_points_b || '-',
      total_score_b: gold?.total_score_b || '-',
      sets_b: gold?.sets_b || '',
      winner_entry_id: gold?.winner_entry_id || null,
      is_final: true
    }
  }

  return gold || null
})

// Resolve Bronze Match: either from finalMatches[1] or construct from Semifinal losers
const resolvedBronzeMatch = computed(() => {
  const bronze = finalMatches.value.length > 1 ? finalMatches.value[1] : (finalMatches.value[0]?.phase?.toLowerCase().includes('bronze') ? finalMatches.value[0] : null)
  if (bronze) return bronze

  const semis = semiFinalMatches.value
  if (semis.length >= 2) {
    const s1 = semis[0]
    const s2 = semis[1]
    const nameA = s1.winner_entry_id === 'a' ? s1.entry_b_name : s1.entry_a_name
    const seedA = s1.winner_entry_id === 'a' ? s1.entry_b_seed : s1.entry_a_seed
    const nameB = s2.winner_entry_id === 'a' ? s2.entry_b_name : s2.entry_a_name
    const seedB = s2.winner_entry_id === 'a' ? s2.entry_b_seed : s2.entry_a_seed

    return {
      id: 'bronze_final_constructed',
      match_no: 'Bronze',
      phase: 'Bronze Medal Final',
      entry_a_id: 'a',
      entry_a_name: nameA || 'Loser SF1',
      entry_a_seed: seedA,
      set_points_a: '-',
      total_score_a: '-',
      sets_a: '',
      entry_b_id: 'b',
      entry_b_name: nameB || 'Loser SF2',
      entry_b_seed: seedB,
      set_points_b: '-',
      total_score_b: '-',
      sets_b: '',
      winner_entry_id: null,
      is_bronze: true
    }
  }

  return null
})

const getRoundName = (roundNo) => {
  const tot = totalRounds.value
  const distFromFinal = tot - roundNo

  if (distFromFinal === 0) return 'Finals'
  if (distFromFinal === 1) return 'Semifinals'
  if (distFromFinal === 2) return 'Quarterfinals'
  if (distFromFinal === 3) return '1/8 Finals'
  if (distFromFinal === 4) return '1/16 Finals'
  if (distFromFinal === 5) return '1/32 Finals'
  return `Round ${roundNo}`
}

// ─────────────────────────────────────────────────────────────
// BRACKET CANVAS GEOMETRY & CONNECTOR PATHS
// ─────────────────────────────────────────────────────────────
const BASE_MATCH_HEIGHT = 130

const getCanvasTotalHeight = computed(() => {
  const r1Matches = (props.rounds[1] || []).length
  const maxMatches = Math.max(r1Matches, 4)
  return maxMatches * BASE_MATCH_HEIGHT
})

const getSlotHeight = (roundNo) => {
  const matchesCount = (props.rounds[roundNo] || []).length || 1
  return getCanvasTotalHeight.value / matchesCount
}

// Crisp, mathematically aligned SVG connectors from round R to R+1
const getConnectorPathsForRound = (roundNo) => {
  const r = parseInt(roundNo)
  const currentMatches = props.rounds[r] || []
  const currentSlotHeight = getSlotHeight(r)
  const nextRoundNo = r + 1
  const isNextFinal = nextRoundNo === totalRounds.value

  const paths = []

  if (isNextFinal) {
    const yCenter = getCanvasTotalHeight.value * 0.5
    if (currentMatches.length >= 2) {
      const ySemi1 = 0.5 * currentSlotHeight
      const ySemi2 = 1.5 * currentSlotHeight

      // Fork from Semi 1 and Semi 2 into Gold Medal Final at vertical midpoint (50%)
      paths.push(`M 0 ${ySemi1} H 25 V ${yCenter} H 50`)
      paths.push(`M 0 ${ySemi2} H 25 V ${yCenter} H 50`)
    } else if (currentMatches.length === 1) {
      const y1 = 0.5 * currentSlotHeight
      paths.push(`M 0 ${y1} H 25 V ${yCenter} H 50`)
    }
    return paths
  }

  const nextMatches = props.rounds[nextRoundNo] || []
  const nextSlotHeight = getSlotHeight(nextRoundNo)

  // Standard binary tree fork connection
  for (let i = 0; i < nextMatches.length; i++) {
    const yTarget = (i + 0.5) * nextSlotHeight
    const idx1 = i * 2
    const idx2 = i * 2 + 1

    if (idx1 < currentMatches.length) {
      const y1 = (idx1 + 0.5) * currentSlotHeight
      paths.push(`M 0 ${y1} H 25 V ${yTarget} H 50`)
    }
    if (idx2 < currentMatches.length) {
      const y2 = (idx2 + 0.5) * currentSlotHeight
      paths.push(`M 0 ${y2} H 25 V ${yTarget} H 50`)
    }
  }

  return paths
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
      else { ptsA = 1; ptsB = 1 }
    }

    cumulativeA += ptsA
    cumulativeB += ptsB

    rows.push({
      set: i + 1,
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
</script>
