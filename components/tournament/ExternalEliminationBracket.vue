<template>
  <div class="external-bracket-container relative flex flex-col space-y-3" ref="bracketContainerRef">
    
    <!-- ── TOP TOOLBAR & CONTROLS ── -->
    <div class="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-100 text-xs">
      <div class="flex items-center gap-2">
        <span class="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
          <Icon icon="ph:tree-structure-bold" class="text-xs" />
          <span>{{ config?.category_name || 'Elimination Tree' }}</span>
        </span>
        <span class="size-1 rounded-full bg-slate-300"></span>
        <span class="text-slate-500 font-mono text-[11px] font-medium">
          {{ getTotalMatchesCount }} Matches
        </span>
      </div>

      <!-- Canvas Controls & Action Buttons -->
      <div class="flex items-center gap-1.5 ml-auto">
        <!-- Zoom Out -->
        <button 
          type="button" 
          @click="zoomOut" 
          class="size-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <Icon icon="ph:minus-bold" class="text-xs" />
        </button>

        <!-- Reset Zoom -->
        <button 
          type="button" 
          @click="resetZoom" 
          class="px-2 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold flex items-center justify-center transition-colors cursor-pointer"
          title="Reset Zoom"
        >
          {{ Math.round(zoomLevel * 100) }}%
        </button>

        <!-- Zoom In -->
        <button 
          type="button" 
          @click="zoomIn" 
          class="size-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom In"
        >
          <Icon icon="ph:plus-bold" class="text-xs" />
        </button>

        <div class="h-4 w-px bg-slate-200 mx-0.5"></div>

        <!-- Fullscreen / Expand Mode Button -->
        <button 
          type="button" 
          @click="isExpandedFullscreen = !isExpandedFullscreen" 
          class="inline-flex items-center gap-1 px-2.5 h-7 rounded-lg bg-slate-100 hover:bg-navy hover:text-white text-slate-700 font-medium text-[11px] transition-all cursor-pointer"
          :title="isExpandedFullscreen ? 'Exit Full Screen' : 'Full Screen View'"
        >
          <Icon :icon="isExpandedFullscreen ? 'ph:corners-in-bold' : 'ph:corners-out-bold'" class="text-xs" />
          <span class="hidden sm:inline">{{ isExpandedFullscreen ? 'Exit Full Screen' : 'Full Screen' }}</span>
        </button>

        <!-- Open in New Tab Button -->
        <button 
          v-if="tournamentSlug && !isFullPage"
          type="button" 
          @click="openInNewTab" 
          class="inline-flex items-center gap-1 px-2.5 h-7 rounded-lg bg-primary/20 hover:bg-primary text-navy font-bold text-[11px] transition-all cursor-pointer"
          title="Open Bracket in Dedicated New Tab"
        >
          <Icon icon="ph:arrow-square-out-bold" class="text-xs" />
          <span class="hidden sm:inline">New Tab</span>
        </button>
      </div>
    </div>

    <!-- ── BRACKET SCROLLABLE VISUAL CANVAS ── -->
    <div 
      :class="[
        'bracket-canvas-wrapper overflow-x-auto no-scrollbar py-6 px-4 sm:px-6 bg-slate-50/40 rounded-3xl border border-slate-200/80 transition-all',
        isExpandedFullscreen ? 'fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md rounded-none border-none p-6 flex flex-col justify-center' : ''
      ]"
    >
      <!-- Floating Fullscreen Close Bar (if in expanded fullscreen) -->
      <div v-if="isExpandedFullscreen" class="fixed top-4 right-4 z-60 flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-2xl shadow-xl">
        <span class="text-xs font-bold text-white pr-2">{{ config?.category_name || 'Elimination Bracket' }}</span>
        <button 
          type="button" 
          @click="isExpandedFullscreen = false"
          class="size-8 rounded-xl bg-slate-700 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Close Full Screen"
        >
          <Icon icon="ph:x-bold" class="text-sm" />
        </button>
      </div>

      <!-- Bracket Nodes Tree with Scale Transform -->
      <div 
        v-if="hasMatches" 
        class="flex items-center justify-center min-w-max gap-4 sm:gap-6 mx-auto relative z-10 transition-transform duration-150 origin-center"
        :style="{ transform: `scale(${zoomLevel})` }"
      >

        <!-- ── LEFT SIDE ROUNDS (E.G. 1/8, QUARTERFINALS) ── -->
        <template v-for="rNo in leftSideRoundNumbers" :key="'left-' + rNo">
          <div class="flex flex-col items-center min-w-[250px] sm:min-w-[270px]">
            <!-- Round Title Header -->
            <div class="h-10 flex flex-col items-center justify-center mb-6">
              <span 
                :class="[
                  'text-xs font-bold font-display px-3 py-1 rounded-xl shadow-2xs',
                  isExpandedFullscreen ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white border border-slate-200/80 text-slate-600'
                ]"
              >
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
                  class="w-[240px] sm:w-[260px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none relative"
                >
                  <!-- Card Micro-Header -->
                  <div class="flex items-center justify-between px-3 py-1.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    <div class="flex items-center gap-1.5 font-mono">
                      <span class="size-1.5 rounded-full" :class="match.winner_entry_id ? 'bg-emerald-500' : 'bg-slate-300'"></span>
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
            <span 
              :class="[
                'text-xs font-bold font-display px-3.5 py-1 rounded-xl shadow-2xs flex items-center gap-1.5',
                isExpandedFullscreen ? 'bg-amber-950/80 text-amber-300 border border-amber-800' : 'bg-amber-500/10 text-amber-950 border border-amber-400/40'
              ]"
            >
              <Icon icon="ph:crown-simple-fill" class="text-amber-500 text-sm" />
              Finals Arena
            </span>
          </div>

          <!-- Finals Column -->
          <div class="flex flex-col justify-around items-center w-full py-2 space-y-6" :style="{ height: getSideTotalHeight + 'px' }">
            
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

            <!-- 2. Bronze Medal Final (Bottom) -->
            <div v-if="bronzeMatch" class="w-full flex flex-col items-center space-y-2">
              <div class="px-3 py-1 rounded-xl bg-amber-700/10 border border-amber-700/30 flex items-center gap-1.5 text-xs font-bold text-amber-900 font-display shadow-2xs">
                <Icon icon="ph:medal-fill" class="text-amber-700 text-xs" />
                <span>Bronze Medal Final</span>
              </div>

              <div 
                @click="selectMatch(bronzeMatch, 'Bronze Medal Final')"
                class="w-[260px] sm:w-[280px] bg-white rounded-2xl border border-amber-700/30 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none"
              >
                <!-- Bronze Header -->
                <div class="flex items-center justify-between px-3.5 py-1.5 bg-amber-700/10 border-b border-amber-700/20 text-[11px] font-bold text-amber-900">
                  <div class="flex items-center gap-1.5">
                    <Icon icon="ph:medal-bold" class="text-amber-700 text-xs" />
                    <span>Bronze Match</span>
                  </div>
                  <span v-if="bronzeMatch.winner_entry_id" class="px-1.5 py-0.2 rounded-md bg-amber-700/20 text-amber-900 text-[10px] font-black">
                    3rd Place
                  </span>
                </div>

                <!-- Archer A -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2 border-b border-slate-100 transition-colors',
                    bronzeMatch.winner_entry_id === 'a' ? 'bg-slate-50 font-bold border-l-3 border-l-amber-700' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span class="text-xs truncate text-navy" :class="bronzeMatch.winner_entry_id === 'a' ? 'font-bold' : 'font-medium text-slate-700'">
                      {{ toTitleCase(bronzeMatch.entry_a_name || 'TBD') }}
                    </span>
                    <Icon v-if="bronzeMatch.winner_entry_id === 'a'" icon="ph:medal-fill" class="text-amber-700 text-xs shrink-0" />
                  </div>
                  <span :class="['font-mono text-xs px-2 py-0.5 rounded-md font-bold shrink-0', bronzeMatch.winner_entry_id === 'a' ? 'bg-amber-700/15 text-amber-900 font-black' : 'text-slate-400']">
                    {{ bronzeMatch.set_points_a !== undefined && bronzeMatch.set_points_a !== '' ? bronzeMatch.set_points_a : '-' }}
                  </span>
                </div>

                <!-- Archer B -->
                <div 
                  :class="[
                    'flex items-center justify-between px-3.5 py-2 transition-colors',
                    bronzeMatch.winner_entry_id === 'b' ? 'bg-slate-50 font-bold border-l-3 border-l-amber-700' : 'border-l-3 border-l-transparent'
                  ]"
                >
                  <div class="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                    <span class="text-xs truncate text-navy" :class="bronzeMatch.winner_entry_id === 'b' ? 'font-bold' : 'font-medium text-slate-700'">
                      {{ toTitleCase(bronzeMatch.entry_b_name || 'TBD') }}
                    </span>
                    <Icon v-if="bronzeMatch.winner_entry_id === 'b'" icon="ph:medal-fill" class="text-amber-700 text-xs shrink-0" />
                  </div>
                  <span :class="['font-mono text-xs px-2 py-0.5 rounded-md font-bold shrink-0', bronzeMatch.winner_entry_id === 'b' ? 'bg-amber-700/15 text-amber-900 font-black' : 'text-slate-400']">
                    {{ bronzeMatch.set_points_b !== undefined && bronzeMatch.set_points_b !== '' ? bronzeMatch.set_points_b : '-' }}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── RIGHT SIDE ROUNDS (E.G. QUARTERFINALS, 1/8) ── -->
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

          <div class="flex flex-col items-center min-w-[250px] sm:min-w-[270px]">
            <!-- Round Title Header -->
            <div class="h-10 flex flex-col items-center justify-center mb-6">
              <span 
                :class="[
                  'text-xs font-bold font-display px-3 py-1 rounded-xl shadow-2xs',
                  isExpandedFullscreen ? 'bg-slate-800 text-slate-200 border border-slate-700' : 'bg-white border border-slate-200/80 text-slate-600'
                ]"
              >
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
                  class="w-[240px] sm:w-[260px] bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden group select-none relative"
                >
                  <!-- Card Micro-Header -->
                  <div class="flex items-center justify-between px-3 py-1.5 bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500">
                    <div class="flex items-center gap-1.5 font-mono">
                      <span class="size-1.5 rounded-full" :class="match.winner_entry_id ? 'bg-emerald-500' : 'bg-slate-300'"></span>
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

      <!-- Empty State -->
      <div v-else class="text-center py-20 text-slate-400">
        <Icon icon="ph:sword" class="text-3xl mx-auto mb-2 text-slate-300" />
        <p class="text-xs sm:text-sm font-medium">No matches available in this round bracket.</p>
      </div>
    </div>

    <!-- ── REFINED INTERACTIVE SCORECARD MODAL DIALOG ── -->
    <ClientOnly>
      <Teleport to="body">
        <!-- Backdrop Transition (Decoupled, Pure Fade) -->
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
            class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          >
            <!-- Overlay with Blur -->
            <div 
              class="fixed inset-0 bg-navy/60 backdrop-blur-sm"
              @click="selectedMatch = null"
            ></div>

            <!-- Modal Dialog Card Transition -->
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
                <!-- Brand Accent Top Bar (Standard Archeris) -->
                <div class="h-1.5 w-full bg-gradient-to-r from-primary via-primary-hover to-primary"></div>
                
                <!-- Modal Header Bar -->
                <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div class="flex items-center gap-3">
                    <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:sword-bold" class="text-lg text-navy" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="text-base font-bold text-navy font-display">
                          {{ selectedMatchRoundName || 'Elimination Match' }}
                        </h3>
                        <span class="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10px] font-mono font-bold">
                          Match #{{ selectedMatch.match_no || 1 }}
                        </span>
                      </div>
                      <p class="text-[11px] text-slate-400 font-medium mt-0.5">
                        Head-to-head official elimination scorecard
                      </p>
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
                          <div v-if="selectedMatch.entry_a_seed" class="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 mt-1">
                            <span>Seed #{{ selectedMatch.entry_a_seed }}</span>
                          </div>
                        </div>

                        <!-- Final Match Points -->
                        <div 
                          :class="[
                            'text-3xl sm:text-4xl font-black font-display tracking-tight',
                            selectedMatch.winner_entry_id === 'a' ? 'text-navy' : 'text-slate-400'
                          ]"
                        >
                          {{ selectedMatch.set_points_a !== undefined && selectedMatch.set_points_a !== '' ? selectedMatch.set_points_a : '-' }}
                        </div>
                      </div>

                      <!-- Center VS Indicator -->
                      <div class="col-span-1 flex flex-col items-center justify-center">
                        <div class="size-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center">
                          <span class="text-[10px] font-black font-display text-slate-400">VS</span>
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
                          <div v-if="selectedMatch.entry_b_seed" class="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 mt-1">
                            <span>Seed #{{ selectedMatch.entry_b_seed }}</span>
                          </div>
                        </div>

                        <!-- Final Match Points -->
                        <div 
                          :class="[
                            'text-3xl sm:text-4xl font-black font-display tracking-tight',
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
                        <h4 class="text-xs font-bold text-navy font-display">
                          Official Match Record
                        </h4>
                      </div>
                      <span class="text-[10px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                        <Icon icon="ph:check-circle-fill" class="text-emerald-500 text-xs" />
                        <span>Set System (Ianseo)</span>
                      </span>
                    </div>

                    <div v-if="parsedSetRows.length > 0" class="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                      <table class="w-full text-center text-xs border-collapse">
                        <thead class="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs">
                          <tr>
                            <th class="py-2.5 px-3 text-left w-20">Set</th>
                            <th class="py-2.5 px-3">End Score A</th>
                            <th class="py-2.5 px-2.5 w-16 text-center">Pts A</th>
                            <th class="py-2.5 px-2.5 w-16 text-center">Pts B</th>
                            <th class="py-2.5 px-3">End Score B</th>
                            <th class="py-2.5 px-3 text-right w-24">Running</th>
                          </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 bg-white font-mono">
                          <tr 
                            v-for="(row, rIdx) in parsedSetRows" 
                            :key="rIdx"
                            class="hover:bg-slate-50/70 transition-colors"
                          >
                            <td class="py-2.5 px-3 text-left font-sans font-bold text-slate-500 text-xs">
                              Set {{ rIdx + 1 }}
                            </td>
                            <td class="py-2.5 px-3 font-bold text-navy text-xs">
                              <span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/60 inline-block font-mono">
                                {{ row.scoreA || '-' }}
                              </span>
                            </td>
                            <td class="py-2.5 px-2.5 text-xs font-bold text-center">
                              <span 
                                :class="[
                                  'inline-flex items-center justify-center size-6 rounded-lg font-bold text-xs',
                                  row.ptsA > row.ptsB 
                                    ? 'bg-emerald-100 text-emerald-800 font-black' 
                                    : (row.ptsA === row.ptsB ? 'bg-slate-100 text-slate-600' : 'text-slate-400')
                                ]"
                              >
                                {{ row.ptsA }}
                              </span>
                            </td>
                            <td class="py-2.5 px-2.5 text-xs font-bold text-center">
                              <span 
                                :class="[
                                  'inline-flex items-center justify-center size-6 rounded-lg font-bold text-xs',
                                  row.ptsB > row.ptsA 
                                    ? 'bg-emerald-100 text-emerald-800 font-black' 
                                    : (row.ptsA === row.ptsB ? 'bg-slate-100 text-slate-600' : 'text-slate-400')
                                ]"
                              >
                                {{ row.ptsB }}
                              </span>
                            </td>
                            <td class="py-2.5 px-3 font-bold text-navy text-xs">
                              <span class="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/60 inline-block font-mono">
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
                      <p class="font-medium text-slate-500">No individual arrow end breakdown recorded.</p>
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
// ZOOM & FULLSCREEN CONTROLS
// ─────────────────────────────────────────────────────────────
const zoomLevel = ref(1)
const isExpandedFullscreen = ref(false)

const zoomIn = () => {
  if (zoomLevel.value < 1.6) zoomLevel.value = +(zoomLevel.value + 0.1).toFixed(2)
}

const zoomOut = () => {
  if (zoomLevel.value > 0.6) zoomLevel.value = +(zoomLevel.value - 0.1).toFixed(2)
}

const resetZoom = () => {
  zoomLevel.value = 1
}

const openInNewTab = () => {
  if (!props.tournamentSlug) return
  const cat = props.categoryName || props.config?.category_name || ''
  const query = cat ? `?category=${encodeURIComponent(cat)}` : ''
  const url = `/tournaments/external/${props.tournamentSlug}/bracket${query}`
  window.open(url, '_blank')
}

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

const getTotalMatchesCount = computed(() => {
  let count = 0
  Object.values(props.rounds || {}).forEach(arr => {
    if (Array.isArray(arr)) count += arr.length
  })
  return count
})

const leftSideRoundNumbers = computed(() => {
  const tot = totalRounds.value
  if (tot <= 1) return []
  const nums = []
  for (let i = 1; i <= tot - 1; i++) {
    nums.push(i)
  }
  return nums
})

const rightSideRoundNumbers = computed(() => {
  const tot = totalRounds.value
  if (tot <= 1) return []
  const nums = []
  for (let i = tot - 1; i >= 1; i--) {
    nums.push(i)
  }
  return nums
})

const finalMatches = computed(() => {
  if (totalRounds.value === 0) return []
  const finalRoundNo = roundNumbers.value[totalRounds.value - 1]
  return props.rounds[finalRoundNo] || []
})

const goldMatch = computed(() => finalMatches.value[0] || null)
const bronzeMatch = computed(() => finalMatches.value[1] || null)

const getMatchesForSide = (roundNo, side) => {
  const all = props.rounds[roundNo] || []
  const half = Math.ceil(all.length / 2)
  return side === 'left' ? all.slice(0, half) : all.slice(half)
}

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
const BASE_MATCH_HEIGHT = 120

const getSideTotalHeight = computed(() => {
  const r1Matches = (props.rounds[1] || []).length
  const half = Math.max(Math.ceil(r1Matches / 2), 2)
  return Math.max(half * BASE_MATCH_HEIGHT, 480)
})

const getSlotHeightForSide = (roundNo) => {
  const matchesInSide = getMatchesForSide(roundNo, 'left').length || 1
  return getSideTotalHeight.value / matchesInSide
}

const calculateConnectorPath = (i, roundNo, side, isSingle = false) => {
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
</script>
