<template>
  <div class="bg-background-light font-body text-navy min-h-screen">
    <!-- Top Reading Progress Indicator -->
    <div class="fixed top-0 left-0 right-0 h-1 bg-primary z-50 transition-all duration-150" :style="{ width: `${scrollProgress}%` }"></div>

    <!-- Hero Header Banner (Consistent Archeris Design, Clean Title Case) -->
    <div class="bg-navy relative overflow-hidden pt-28 pb-10 sm:pt-36 sm:pb-14 text-white">
      <div class="absolute inset-0 z-0">
        <img src="/hero-event.jpeg" alt="Tournament Background" class="w-full h-full object-cover" />
        <div class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/75 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/35 to-transparent"></div>
      </div>

      <div class="relative z-20 max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        <!-- Breadcrumbs -->
        <div class="mb-4">
          <Breadcrumbs 
            :items="[{ label: 'Tournaments', path: '/tournaments' }]"
            :current="toTitleCase(activeTournament?.name) || 'Tournament Details'" 
            class="!text-slate-300 text-xs sm:text-sm" 
          />
        </div>

        <div class="max-w-4xl space-y-3">
          <!-- Tournament Title (H1) -->
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight font-display">
            {{ toTitleCase(activeTournament?.name) }}
          </h1>

          <!-- Meta Information Row -->
          <div class="flex flex-wrap items-center gap-y-2 gap-x-5 sm:gap-x-6 text-xs sm:text-sm text-slate-200 pt-1 font-medium">
            <div class="flex items-center gap-2">
              <Icon icon="ph:calendar-blank-bold" class="text-primary text-base shrink-0" />
              <span>{{ formatDateRange(activeTournament?.start_date, activeTournament?.end_date) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="ph:map-pin-bold" class="text-primary text-base shrink-0" />
              <span>{{ toTitleCase(activeTournament?.location || activeTournament?.venue || 'Indonesia') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="ph:buildings-bold" class="text-primary text-base shrink-0" />
              <span>{{ toTitleCase(activeTournamentData?.organizer_name || 'Host Organization') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Icon icon="circle-flags:id" class="text-base shrink-0" />
              <span>{{ formatCityDisplay(activeTournament?.city, activeTournament?.location) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Quick Anchor Bar (Sticky on Small Screens) -->
    <div class="lg:hidden sticky top-0 sm:top-14 md:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xs">
      <a 
        v-for="sec in navigationSections" 
        :key="sec.id"
        :href="`#${sec.id}`"
        hreflang="id"
        @click.prevent="scrollToSection(sec.id)"
        :class="[
          'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer',
          activeSectionId === sec.id 
            ? 'bg-navy text-primary shadow-xs font-bold' 
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
        ]"
      >
        <Icon :icon="sec.icon" class="text-sm" />
        <span>{{ sec.title }}</span>
      </a>
    </div>

    <!-- ========================================================================= -->
    <!-- UNIFIED SINGLE PARENT CARD (WIDE CONTAINER, WORKING STICKY, CLEAN BORDER) -->
    <!-- ========================================================================= -->
    <main class="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <div class="grid grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          <!-- ── COLUMN 1: LEFT TOC (STICKY TOP-6) ── -->
          <aside class="col-span-12 lg:col-span-2 p-5 sm:p-6 bg-slate-50/30 lg:bg-transparent rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
            <div class="sticky top-6 space-y-3">
              <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 font-display pl-2.5">
                Contents
              </div>

              <!-- Semantic TOC Links with hreflang for SEO -->
              <nav class="space-y-1">
                <a
                  href="#top"
                  hreflang="id"
                  @click.prevent="scrollToTop"
                  :class="[
                    'px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all block truncate select-none cursor-pointer',
                    activeSectionId === 'top'
                      ? 'text-navy font-bold bg-primary/15 border-l-3 border-primary'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                  ]"
                >
                  (Top)
                </a>

                <a
                  v-for="sec in navigationSections"
                  :key="sec.id"
                  :href="`#${sec.id}`"
                  hreflang="id"
                  @click.prevent="scrollToSection(sec.id)"
                  :class="[
                    'px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all block truncate select-none cursor-pointer flex items-center gap-2',
                    activeSectionId === sec.id
                      ? 'text-navy font-bold bg-primary/15 border-l-3 border-primary'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                  ]"
                >
                  <span class="truncate">{{ sec.title }}</span>
                </a>
              </nav>
            </div>
          </aside>

          <!-- ── COLUMN 2: MIDDLE MAIN ARTICLE (GENEROUS WIDTH & PROPORTIONS) ── -->
          <div class="col-span-12 lg:col-span-7 p-6 sm:p-8 lg:p-10 space-y-10 min-w-0">

            <!-- 1. TOURNAMENT OVERVIEW -->
            <section id="overview" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:info-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    Tournament Overview
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Key event metrics, competition categories, and technical regulations.</p>
                </div>
              </div>

              <!-- Quick Metrics 4 Cards Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:users-three" class="text-xs text-navy" />
                    </div>
                    <span>Total Archers</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-navy font-display mt-1.5">
                    {{ computedTotalArchers }}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">Registered Competitors</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:target" class="text-xs text-navy" />
                    </div>
                    <span>Categories</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-navy font-display mt-1.5">
                    {{ categoriesList.length }}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">Divisions & Classes</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:calendar-check" class="text-xs text-navy" />
                    </div>
                    <span>Duration</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-navy font-display mt-1.5">
                    {{ computedEventDurationDays }} Days
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">Official Schedule</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:shield-check-bold" class="text-xs text-navy" />
                    </div>
                    <span>Format</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-navy font-display mt-1.5">
                    Target
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">Outdoor Archery</div>
                </div>
              </div>

              <!-- Official Technical Handbook Banner -->
              <div class="p-4 sm:p-5 rounded-2xl bg-navy text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div class="flex items-start gap-3">
                  <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon icon="ph:file-pdf-bold" class="text-xl text-primary" />
                  </div>
                  <div class="space-y-0.5">
                    <div class="inline-block px-2 py-0.5 rounded bg-white/15 text-primary text-[10px] font-bold">
                      Technical Guidebook
                    </div>
                    <h3 class="text-sm sm:text-base font-bold text-white font-display">
                      Official Technical Handbook (THB)
                    </h3>
                    <p class="text-xs text-slate-300">
                      Download complete tournament regulations, age limits, target butt assignments, and competition rules.
                    </p>
                  </div>
                </div>
                <a 
                  :href="thbDocument?.url || ianseoUrl" 
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shrink-0 cursor-pointer shadow-sm"
                >
                  <Icon icon="ph:download-simple-bold" class="text-base" />
                  <span>Download Handbook</span>
                </a>
              </div>
            </section>

            <!-- 2. MEDAL STANDINGS & PODIUM -->
            <section id="medals" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:trophy-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    Medal Standings & Champions
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Club medal tally and final podium positions.</p>
                </div>
              </div>

              <!-- Clean Olympic 3-Tier Podium UI -->
              <div v-if="currentPodiumCategoryData" class="space-y-3.5">
                <!-- Category Selector for Podium -->
                <div class="flex items-center justify-between gap-3 bg-slate-50/80 p-2.5 rounded-2xl border border-slate-200/60">
                  <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    <span class="text-xs font-bold text-slate-400 shrink-0">Podium Class:</span>
                    <button
                      v-for="cat in availablePodiumCategories.slice(0, 6)"
                      :key="cat"
                      @click="selectedPodiumCategory = cat"
                      :class="[
                        'px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer',
                        selectedPodiumCategory === cat
                          ? 'bg-navy text-primary font-bold shadow-xs'
                          : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200/80'
                      ]"
                    >
                      {{ toTitleCase(cat) }}
                    </button>
                  </div>
                  <span class="text-xs text-slate-400 hidden sm:inline shrink-0 font-medium">Olympic Podium</span>
                </div>

                <!-- Olympic 3-Step Podium Grid -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 items-end">
                  <!-- 2nd Place Silver (Left) -->
                  <div class="order-2 md:order-1 bg-slate-50/90 rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-slate-300"></div>
                    <div class="relative size-14 mb-2">
                      <div class="size-14 rounded-2xl bg-slate-200 text-slate-700 font-black text-lg flex items-center justify-center ring-2 ring-slate-300 shadow-xs">
                        {{ getArcherInitials(currentPodiumCategoryData.silver?.name) || '2' }}
                      </div>
                      <div class="absolute -bottom-1 -right-1 size-6 rounded-lg bg-slate-200 text-slate-800 font-black text-[11px] flex items-center justify-center shadow-xs">
                        2
                      </div>
                    </div>
                    <div class="font-bold text-xs sm:text-sm text-navy truncate max-w-full">
                      {{ toTitleCase(currentPodiumCategoryData.silver?.name || 'TBD') }}
                    </div>
                    <div class="text-[11px] text-slate-500 font-medium truncate max-w-full mt-0.5">
                      {{ toTitleCase(currentPodiumCategoryData.silver?.club || 'Club') }}
                    </div>
                    <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 w-full flex justify-between items-center text-xs">
                      <span class="text-slate-400 font-semibold">Silver</span>
                      <span class="font-mono font-bold text-slate-700 text-xs">{{ currentPodiumCategoryData.silver?.score || currentPodiumCategoryData.silver?.total_score || 'Final' }}</span>
                    </div>
                  </div>

                  <!-- 1st Place Champion Gold (Middle - Elevated) -->
                  <div class="order-1 md:order-2 bg-gradient-to-b from-amber-500/10 via-amber-50/30 to-white rounded-2xl p-5 border-2 border-amber-400/60 shadow-md flex flex-col items-center text-center relative overflow-hidden -mt-0 md:-mt-2">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-400"></div>
                    <div class="flex items-center gap-1 text-amber-600 text-[11px] font-black tracking-wider mb-1.5">
                      <Icon icon="ph:crown-fill" class="text-sm text-amber-500" />
                      <span>Champion #1</span>
                    </div>
                    <div class="relative size-16 mb-2">
                      <div class="size-16 rounded-2xl bg-amber-400 text-navy font-black text-xl flex items-center justify-center ring-3 ring-amber-400/40 shadow-md">
                        {{ getArcherInitials(currentPodiumCategoryData.gold?.name) || '1' }}
                      </div>
                      <div class="absolute -bottom-1 -right-1 size-7 rounded-xl bg-amber-400 text-navy font-black text-xs flex items-center justify-center shadow-md">
                        1
                      </div>
                    </div>
                    <div class="font-bold text-sm sm:text-base text-navy truncate max-w-full">
                      {{ toTitleCase(currentPodiumCategoryData.gold?.name || 'Champion') }}
                    </div>
                    <div class="text-xs text-slate-500 font-medium truncate max-w-full mt-0.5">
                      {{ toTitleCase(currentPodiumCategoryData.gold?.club || 'Club') }}
                    </div>
                    <div class="mt-3 pt-2.5 border-t border-amber-200/60 w-full flex justify-between items-center text-xs">
                      <span class="text-amber-700 font-bold">Gold Medalist</span>
                      <span class="font-mono font-black text-amber-600 text-sm sm:text-base">{{ currentPodiumCategoryData.gold?.score || currentPodiumCategoryData.gold?.total_score || 'Champion' }}</span>
                    </div>
                  </div>

                  <!-- 3rd Place Bronze (Right) -->
                  <div class="order-3 bg-slate-50/90 rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col items-center text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-amber-700/50"></div>
                    <div class="relative size-14 mb-2">
                      <div class="size-14 rounded-2xl bg-amber-100 text-amber-900 font-black text-lg flex items-center justify-center ring-2 ring-amber-700/30 shadow-xs">
                        {{ getArcherInitials(currentPodiumCategoryData.bronze?.name) || '3' }}
                      </div>
                      <div class="absolute -bottom-1 -right-1 size-6 rounded-lg bg-amber-700 text-white font-black text-[11px] flex items-center justify-center shadow-xs">
                        3
                      </div>
                    </div>
                    <div class="font-bold text-xs sm:text-sm text-navy truncate max-w-full">
                      {{ toTitleCase(currentPodiumCategoryData.bronze?.name || 'TBD') }}
                    </div>
                    <div class="text-[11px] text-slate-500 font-medium truncate max-w-full mt-0.5">
                      {{ toTitleCase(currentPodiumCategoryData.bronze?.club || 'Club') }}
                    </div>
                    <div class="mt-2.5 pt-2.5 border-t border-slate-200/80 w-full flex justify-between items-center text-xs">
                      <span class="text-slate-400 font-semibold">Bronze</span>
                      <span class="font-mono font-bold text-amber-800 text-xs">{{ currentPodiumCategoryData.bronze?.score || currentPodiumCategoryData.bronze?.total_score || 'Final' }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Medal Table with Interactive Sorting -->
              <div v-if="sortedMedalTally.length > 0" class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="p-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Icon icon="ph:medal-bold" class="text-amber-500 text-base" />
                    <span class="text-xs sm:text-sm font-bold text-navy font-display">Club / Contingent Medal Standings</span>
                  </div>
                  <span class="text-[11px] text-slate-500">Click header to sort</span>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm text-navy">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <tr>
                        <th @click="handleSortMedal('rank')" class="py-3 px-3.5 w-16 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>Rank</span>
                            <Icon :icon="getSortIcon('rank', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortMedal('club')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Club / Contingent</span>
                            <Icon :icon="getSortIcon('club', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortMedal('gold')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-amber-600">
                            <Icon icon="ph:medal-fill" class="text-sm text-amber-500" />
                            <span>Gold</span>
                            <Icon :icon="getSortIcon('gold', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortMedal('silver')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-slate-600">
                            <Icon icon="ph:medal-fill" class="text-sm text-slate-400" />
                            <span>Silver</span>
                            <Icon :icon="getSortIcon('silver', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortMedal('bronze')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-amber-800">
                            <Icon icon="ph:medal-fill" class="text-sm text-amber-700" />
                            <span>Bronze</span>
                            <Icon :icon="getSortIcon('bronze', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortMedal('total')" class="py-3 px-3.5 text-center w-20 font-bold bg-slate-100/80 cursor-pointer hover:bg-slate-200/80 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>Total</span>
                            <Icon :icon="getSortIcon('total', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                      <tr v-for="(item, idx) in sortedMedalTally.slice(0, 15)" :key="item.club" class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-2.5 px-3.5 text-center font-bold">
                          <span v-if="idx === 0" class="inline-flex size-6 rounded-full bg-amber-100 text-amber-800 font-bold items-center justify-center text-xs">1</span>
                          <span v-else-if="idx === 1" class="inline-flex size-6 rounded-full bg-slate-200 text-slate-800 font-bold items-center justify-center text-xs">2</span>
                          <span v-else-if="idx === 2" class="inline-flex size-6 rounded-full bg-amber-200/70 text-amber-900 font-bold items-center justify-center text-xs">3</span>
                          <span v-else class="text-slate-500 font-mono">{{ idx + 1 }}</span>
                        </td>
                        <td class="py-2.5 px-3.5 font-bold text-navy">{{ toTitleCase(item.club) }}</td>
                        <td class="py-2.5 px-3.5 text-center font-bold text-navy font-mono">{{ item.gold }}</td>
                        <td class="py-2.5 px-3.5 text-center font-bold text-navy font-mono">{{ item.silver }}</td>
                        <td class="py-2.5 px-3.5 text-center font-bold text-navy font-mono">{{ item.bronze }}</td>
                        <td class="py-2.5 px-3.5 text-center font-bold bg-slate-50 text-navy font-mono">{{ item.total }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Clean Empty State for Medals -->
              <div v-else class="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
                <Icon icon="ph:trophy" class="text-3xl text-slate-400 mx-auto" />
                <div class="text-xs sm:text-sm font-bold text-navy">Medal Standings Pending</div>
                <div class="text-[11px] text-slate-500">Official medal rankings will be tabulated following elimination and final rounds.</div>
              </div>
            </section>

            <!-- 3. COMPETITION SCHEDULE (SEPARATED) -->
            <section id="schedule" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:calendar-blank-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    Competition Schedule
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Day-by-day timetable, rounds, and session breakdowns.</p>
                </div>
              </div>

              <div v-if="scheduleData.length > 0" class="space-y-3.5">
                <!-- Day Selector Tabs -->
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button
                    v-for="(day, dIdx) in scheduleData"
                    :key="dIdx"
                    @click="activeScheduleDayIndex = dIdx"
                    :class="[
                      'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer select-none',
                      activeScheduleDayIndex === dIdx
                        ? 'bg-navy text-primary shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    ]"
                  >
                    <Icon icon="ph:calendar-check" class="text-sm" />
                    <span>{{ day.date_label }}</span>
                    <span class="text-[10px] opacity-80">(Day {{ dIdx + 1 }})</span>
                  </button>
                </div>

                <!-- Active Day Sessions List -->
                <div v-if="currentActiveScheduleDay" class="border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5">
                  <div class="p-3 rounded-xl bg-navy text-white flex items-center justify-between gap-3">
                    <div class="text-xs sm:text-sm font-bold">{{ currentActiveScheduleDay.divisions || 'All Scheduled Categories' }}</div>
                    <span class="text-[11px] px-2 py-0.5 rounded bg-white/10 font-mono">{{ currentActiveScheduleDay.sessions.length }} Sessions</span>
                  </div>

                  <div class="divide-y divide-slate-100 space-y-2.5 pt-1">
                    <div 
                      v-for="(session, sIdx) in currentActiveScheduleDay.sessions" 
                      :key="sIdx"
                      class="pt-2.5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50 p-2.5 rounded-xl transition-colors"
                    >
                      <div class="flex items-start gap-3">
                        <div class="w-20 shrink-0 text-right pr-3 border-r border-slate-200 pt-0.5">
                          <div class="font-mono font-bold text-xs text-navy">{{ session.time_start }}</div>
                          <div class="text-[10px] text-slate-400 font-mono">{{ session.time_end }}</div>
                        </div>
                        <div class="space-y-0.5">
                          <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                              {{ toTitleCase(session.type || 'Session') }}
                            </span>
                            <span v-if="session.section" class="text-[11px] font-medium text-slate-500">{{ session.section }}</span>
                          </div>
                          <h4 class="text-xs sm:text-sm font-bold text-navy font-display">{{ session.title }}</h4>
                          <div v-if="session.notes" class="text-[11px] text-slate-500 font-medium">{{ session.notes }}</div>
                        </div>
                      </div>

                      <div v-if="session.duration" class="text-[11px] font-mono text-slate-500 shrink-0 self-start sm:self-center">
                        {{ session.duration }} hrs
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State for Schedule -->
              <div v-else class="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
                <Icon icon="ph:calendar-x" class="text-3xl text-slate-400 mx-auto" />
                <div class="text-xs sm:text-sm font-bold text-navy">No Schedule Information Available</div>
                <div class="text-[11px] text-slate-500">Official tournament timetable will be published by the organizing committee.</div>
              </div>
            </section>

            <!-- 4. FIELD OF PLAY (FOP) (SEPARATED) -->
            <section id="fop" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:crosshair-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    Field of Play (FOP)
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Target butt numbers, shooting distance assignments, and arena layout.</p>
                </div>
              </div>

              <!-- FOP Data Table / Card -->
              <div v-if="fopData.length > 0" class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="p-3.5 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
                  <div class="text-xs sm:text-sm font-bold text-navy font-display">Target Butt Allocation</div>
                  <div class="text-[11px] text-slate-500">{{ fopData.length }} Target Lines</div>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm text-navy">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th class="py-3 px-3.5 w-28">Target Butts</th>
                        <th class="py-3 px-3.5">Division & Category</th>
                        <th class="py-3 px-3.5 text-center w-24">Distance</th>
                        <th class="py-3 px-3.5 text-center w-24">Target Face</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                      <tr v-for="(f, fIdx) in fopData" :key="fIdx" class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-2.5 px-3.5 font-mono font-bold text-navy">{{ f.target_range || f.target || '-' }}</td>
                        <td class="py-2.5 px-3.5 font-bold">{{ toTitleCase(f.category || f.division || 'All Classes') }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-600">{{ f.distance || '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-600">{{ f.target_face || '-' }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Clean Empty State for FOP -->
              <div v-else class="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
                <Icon icon="ph:map-trifold" class="text-3xl text-slate-400 mx-auto" />
                <div class="text-xs sm:text-sm font-bold text-navy">Field of Play Layout TBA</div>
                <div class="text-[11px] text-slate-500">Target line allocations and shooting distances will follow standard World Archery regulations at {{ toTitleCase(activeTournament?.location || 'the venue') }}.</div>
              </div>
            </section>

            <!-- 5. QUALIFICATION SCORES & STANDINGS -->
            <section id="results" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:ranking-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    Qualification Scores
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Official ranking leaderboards, distance scores, and 10s/Xs arrow counts.</p>
                </div>
              </div>

              <!-- Division & Category Switcher Container -->
              <div class="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2.5">
                <!-- Division Tabs -->
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span class="text-xs font-bold text-slate-400 shrink-0 mr-1">Division:</span>
                  <button
                    v-for="div in availableDivisions"
                    :key="div"
                    @click="selectedDivision = div"
                    :class="[
                      'px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer select-none',
                      selectedDivision === div
                        ? 'bg-navy text-primary shadow-xs font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                    ]"
                  >
                    {{ toTitleCase(div) }}
                  </button>
                </div>

                <!-- Category Pills -->
                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-200/70">
                  <span class="text-xs font-bold text-slate-400 shrink-0 mr-1">Category:</span>
                  <button
                    v-for="cat in visibleCategories"
                    :key="cat.rawKey"
                    @click="selectedCategoryKey = cat.rawKey"
                    :class="[
                      'px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer select-none border',
                      selectedCategoryKey === cat.rawKey
                        ? 'bg-navy text-primary border-navy shadow-xs font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    ]"
                  >
                    <span>{{ toTitleCase(cat.displayName) }}</span>
                  </button>
                </div>
              </div>

              <!-- Qualification Table Card with Interactive Sorting -->
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80">
                  <div>
                    <h3 class="text-xs sm:text-sm font-bold text-navy font-display">
                      {{ currentCategoryLabel }} - Leaderboard
                    </h3>
                    <div class="text-[11px] text-slate-500 mt-0.5">
                      Showing {{ currentCategoryQuals.length }} registered archers
                    </div>
                  </div>

                  <!-- Search Input -->
                  <div class="relative w-full sm:w-60">
                    <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input 
                      v-model="resultsSearchQuery"
                      type="text" 
                      placeholder="Search archer or club..."
                      class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-navy placeholder:text-slate-400 focus:outline-hidden focus:border-navy"
                    />
                  </div>
                </div>

                <!-- Interactive Sortable Table -->
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm text-navy">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <tr>
                        <th @click="handleSortQual('rank')" class="py-3 px-3.5 w-16 text-center cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>Rank</span>
                            <Icon :icon="getSortIcon('rank', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('name')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Archer Name</span>
                            <Icon :icon="getSortIcon('name', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('club')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Club / Contingent</span>
                            <Icon :icon="getSortIcon('club', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('d1')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>Dist 1</span>
                            <Icon :icon="getSortIcon('d1', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('d2')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>Dist 2</span>
                            <Icon :icon="getSortIcon('d2', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('tens')" class="py-3 px-3.5 text-center w-16 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>10+X</span>
                            <Icon :icon="getSortIcon('tens', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('x_count')" class="py-3 px-3.5 text-center w-16 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>X</span>
                            <Icon :icon="getSortIcon('x_count', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('score')" class="py-3 px-3.5 text-center w-20 font-bold bg-slate-100/80 cursor-pointer hover:bg-slate-200/80 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>Total</span>
                            <Icon :icon="getSortIcon('score', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                      <tr v-for="(row, rIdx) in sortedFilteredCategoryQuals" :key="rIdx" class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-2.5 px-3.5 text-center font-bold">
                          <span v-if="row.rank == 1" class="inline-flex size-6 rounded-full bg-amber-100 text-amber-800 font-bold items-center justify-center text-xs">1</span>
                          <span v-else-if="row.rank == 2" class="inline-flex size-6 rounded-full bg-slate-200 text-slate-800 font-bold items-center justify-center text-xs">2</span>
                          <span v-else-if="row.rank == 3" class="inline-flex size-6 rounded-full bg-amber-200/70 text-amber-900 font-bold items-center justify-center text-xs">3</span>
                          <span v-else class="text-slate-500 font-mono">{{ row.rank }}</span>
                        </td>
                        <td class="py-2.5 px-3.5 font-bold text-navy">{{ toTitleCase(row.name) }}</td>
                        <td class="py-2.5 px-3.5 text-slate-600">{{ toTitleCase(row.club) }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-600">{{ row.d1 || row.distance_1 || '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-600">{{ row.d2 || row.distance_2 || '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-600">{{ row.tens ?? '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-600">{{ row.x_count ?? row.xs ?? '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-bold bg-slate-50 text-navy font-mono">{{ row.score || row.total_score || '-' }}</td>
                      </tr>
                      <tr v-if="sortedFilteredCategoryQuals.length === 0">
                        <td colspan="8" class="py-8 text-center text-slate-400 italic">
                          No qualification scores found for this category.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <!-- 6. ELIMINATION BRACKETS -->
            <section id="brackets" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:sword-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    Elimination Brackets
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Head-to-head knockout matches, set scores, and medal match trees.</p>
                </div>
              </div>

              <div v-if="structuredBracketTree.rounds.length > 0 || structuredBracketTree.finals.length > 0" class="border border-slate-200/80 rounded-2xl p-5 overflow-x-auto shadow-xs">
                <div class="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <span class="text-xs sm:text-sm font-bold text-navy font-display">{{ currentCategoryLabel }} - Elimination Tree</span>
                  <span class="text-[11px] text-slate-500">Click card to open scorecard</span>
                </div>

                <!-- Bracket Grid with Connecting Trees -->
                <div class="flex items-stretch gap-6 min-w-[650px] pt-4 pb-2">
                  <!-- Earlier Elimination Rounds (QF, SF) -->
                  <div 
                    v-for="(rnd, rIdx) in structuredBracketTree.rounds" 
                    :key="rIdx" 
                    class="flex-1 flex flex-col justify-around space-y-4 relative"
                  >
                    <div class="text-center font-bold text-xs text-slate-600 font-display uppercase tracking-wider pb-1.5 border-b border-slate-100">
                      {{ rnd.roundTitle }}
                    </div>

                    <div 
                      v-for="(match, mIdx) in rnd.matches" 
                      :key="mIdx"
                      @click="openScorecard(match, rnd.roundTitle)"
                      class="p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-navy/50 hover:bg-white transition-all cursor-pointer shadow-xs relative group space-y-1.5"
                    >
                      <!-- Competitor A -->
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 truncate">
                          <span class="text-[11px] text-slate-400 font-mono">#{{ match.seed_a || '1' }}</span>
                          <span :class="['text-xs truncate font-medium', isMatchWinner(match.score_a, match.score_b) ? 'font-bold text-navy' : 'text-slate-600']">
                            {{ toTitleCase(match.archer_a || match.name_a || 'TBD') }}
                          </span>
                        </div>
                        <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-white border border-slate-200 text-navy">{{ match.score_a ?? '-' }}</span>
                      </div>

                      <!-- Competitor B -->
                      <div class="flex items-center justify-between gap-2 border-t border-slate-200/60 pt-1.5">
                        <div class="flex items-center gap-1.5 truncate">
                          <span class="text-[11px] text-slate-400 font-mono">#{{ match.seed_b || '2' }}</span>
                          <span :class="['text-xs truncate font-medium', isMatchWinner(match.score_b, match.score_a) ? 'font-bold text-navy' : 'text-slate-600']">
                            {{ toTitleCase(match.archer_b || match.name_b || 'TBD') }}
                          </span>
                        </div>
                        <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-white border border-slate-200 text-navy">{{ match.score_b ?? '-' }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Finals Column -->
                  <div v-if="structuredBracketTree.finals.length > 0" class="flex-1 flex flex-col justify-around space-y-4">
                    <div class="text-center font-bold text-xs text-amber-700 font-display uppercase tracking-wider pb-1.5 border-b border-amber-100">
                      Medal Matches
                    </div>

                    <div 
                      v-for="(fMatch, fIdx) in structuredBracketTree.finals" 
                      :key="fIdx"
                      @click="openScorecard(fMatch, fMatch.is_bronze ? 'Bronze Medal Match' : 'Gold Medal Match')"
                      :class="[
                        'p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs space-y-2',
                        fMatch.is_bronze 
                          ? 'border-amber-200 bg-amber-50/50 hover:bg-white' 
                          : 'border-amber-300 bg-amber-50 hover:bg-white shadow-sm'
                      ]"
                    >
                      <div class="flex items-center justify-between text-[11px] font-bold text-amber-800">
                        <span>{{ fMatch.is_bronze ? 'Bronze Match' : 'Gold Final' }}</span>
                        <Icon :icon="fMatch.is_bronze ? 'ph:medal-fill' : 'ph:trophy-fill'" class="text-sm text-amber-500" />
                      </div>

                      <!-- Archer A -->
                      <div class="flex items-center justify-between gap-2">
                        <span :class="['text-xs truncate font-medium', isMatchWinner(fMatch.score_a, fMatch.score_b) ? 'font-bold text-navy' : 'text-slate-600']">
                          {{ toTitleCase(fMatch.archer_a || fMatch.name_a || 'TBD') }}
                        </span>
                        <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-white border border-slate-200 text-navy">{{ fMatch.score_a ?? '-' }}</span>
                      </div>

                      <!-- Archer B -->
                      <div class="flex items-center justify-between gap-2 border-t border-slate-200/60 pt-1.5">
                        <span :class="['text-xs truncate font-medium', isMatchWinner(fMatch.score_b, fMatch.score_a) ? 'font-bold text-navy' : 'text-slate-600']">
                          {{ toTitleCase(fMatch.archer_b || fMatch.name_b || 'TBD') }}
                        </span>
                        <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded bg-white border border-slate-200 text-navy">{{ fMatch.score_b ?? '-' }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State for Brackets -->
              <div v-else class="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1.5">
                <Icon icon="ph:sword" class="text-3xl text-slate-400 mx-auto" />
                <div class="text-xs sm:text-sm font-bold text-navy">No Elimination Matches Scheduled</div>
                <div class="text-[11px] text-slate-500">Elimination brackets will be generated following qualification round completions.</div>
              </div>
            </section>

            <!-- 7. ATHLETES (SIMPLIFIED WORDING) -->
            <section id="athletes" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:users-three-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    Athletes & Clubs
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Complete participant roster, target assignments, and club affiliations.</p>
                </div>
              </div>

              <!-- Directory Controls -->
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80">
                  <div class="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                    <div class="relative w-full sm:w-60">
                      <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input 
                        v-model="entriesSearchQuery"
                        type="text" 
                        placeholder="Search athlete, club, bib..."
                        class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-navy placeholder:text-slate-400 focus:outline-hidden focus:border-navy"
                      />
                    </div>

                    <select 
                      v-model="entriesClubFilter"
                      class="w-full sm:w-52 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-navy font-medium focus:outline-hidden focus:border-navy"
                    >
                      <option v-for="opt in entriesClubSelectOptions" :key="opt.value" :value="opt.value">
                        {{ opt.label }}
                      </option>
                    </select>
                  </div>

                  <div class="text-[11px] text-slate-500 self-end sm:self-center">
                    Showing {{ paginatedEntriesData.length }} of {{ processedEntriesData.length }} athletes
                  </div>
                </div>

                <!-- Sortable Athlete Table -->
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm text-navy">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <tr>
                        <th @click="handleSortEntries('target')" class="py-3 px-3.5 w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Target</span>
                            <Icon :icon="getSortIcon('target', entriesSortKey, entriesSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('bib')" class="py-3 px-3.5 w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Bib</span>
                            <Icon :icon="getSortIcon('bib', entriesSortKey, entriesSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('name')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Athlete Name</span>
                            <Icon :icon="getSortIcon('name', entriesSortKey, entriesSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('club')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Club / Contingent</span>
                            <Icon :icon="getSortIcon('club', entriesSortKey, entriesSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('category')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Category</span>
                            <Icon :icon="getSortIcon('category', entriesSortKey, entriesSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                      <tr v-for="(entry, eIdx) in paginatedEntriesData" :key="eIdx" class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-2.5 px-3.5 font-mono font-bold text-navy">{{ entry.target || '-' }}</td>
                        <td class="py-2.5 px-3.5 font-mono text-slate-500">{{ entry.bib || '-' }}</td>
                        <td class="py-2.5 px-3.5 font-bold text-navy">{{ toTitleCase(entry.name) }}</td>
                        <td class="py-2.5 px-3.5 text-slate-600">{{ toTitleCase(entry.club) }}</td>
                        <td class="py-2.5 px-3.5 text-slate-600">{{ toTitleCase(entry.category || '-') }}</td>
                      </tr>
                      <tr v-if="paginatedEntriesData.length === 0">
                        <td colspan="5" class="py-8 text-center text-slate-400 italic">
                          No athletes matched the current filter criteria.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Pagination -->
                <div v-if="totalEntriesPages > 1" class="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <button
                    :disabled="entriesCurrentPage === 1"
                    @click="entriesCurrentPage--"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <span class="text-xs font-semibold text-slate-600">
                    Page {{ entriesCurrentPage }} of {{ totalEntriesPages }}
                  </span>
                  <button
                    :disabled="entriesCurrentPage === totalEntriesPages"
                    @click="entriesCurrentPage++"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

          </div>

          <!-- ── COLUMN 3: RIGHT INFOBOX (STICKY TOP-6) ── -->
          <aside class="col-span-12 lg:col-span-3 p-5 sm:p-6 bg-slate-50/30 lg:bg-transparent rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
            <div class="sticky top-6 space-y-4">
              <!-- Infobox Title & Subtitle -->
              <div class="border-b border-slate-100 pb-3 text-center space-y-1">
                <h3 class="text-sm sm:text-base font-bold text-navy font-display leading-snug">
                  {{ toTitleCase(activeTournament?.name) }}
                </h3>
                <div class="inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                  <Icon icon="circle-flags:id" class="text-sm" />
                  <span>{{ formatCityDisplay(activeTournament?.city, activeTournament?.location) }}</span>
                </div>
              </div>

              <!-- Wikipedia Style Metadata Table -->
              <div class="divide-y divide-slate-100 text-xs sm:text-sm">
                <div class="py-2 flex items-start justify-between gap-3">
                  <span class="text-slate-500 font-medium">Dates:</span>
                  <span class="text-navy font-bold text-right">{{ formatDateRange(activeTournament?.start_date, activeTournament?.end_date) }}</span>
                </div>
                <div class="py-2 flex items-start justify-between gap-3">
                  <span class="text-slate-500 font-medium">Venue:</span>
                  <span class="text-navy font-bold text-right">{{ toTitleCase(activeTournament?.location || activeTournament?.venue || 'Indonesia') }}</span>
                </div>
                <div class="py-2 flex items-start justify-between gap-3">
                  <span class="text-slate-500 font-medium">Host:</span>
                  <span class="text-navy font-bold text-right">{{ toTitleCase(activeTournamentData?.organizer_name || 'Host Committee') }}</span>
                </div>
                <div class="py-2 flex items-start justify-between gap-3">
                  <span class="text-slate-500 font-medium">Country:</span>
                  <span class="text-navy font-bold flex items-center gap-1.5 text-right">
                    <Icon icon="circle-flags:id" class="text-sm" />
                    <span>Indonesia</span>
                  </span>
                </div>
                <div class="py-2 flex items-start justify-between gap-3">
                  <span class="text-slate-500 font-medium">Archers:</span>
                  <span class="text-navy font-bold text-right font-mono">{{ computedTotalArchers }}</span>
                </div>
                <div class="py-2 flex items-start justify-between gap-3">
                  <span class="text-slate-500 font-medium">Categories:</span>
                  <span class="text-navy font-bold text-right font-mono">{{ categoriesList.length }}</span>
                </div>
              </div>

              <!-- Handbook & External Link Actions -->
              <div class="pt-1.5 space-y-2">
                <a 
                  :href="thbDocument?.url || ianseoUrl" 
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-primary hover:bg-primary-hover text-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <Icon icon="ph:file-pdf-bold" class="text-base" />
                  <span>Download Handbook</span>
                </a>

                <a 
                  :href="ianseoUrl" 
                  target="_blank" 
                  rel="nofollow noopener noreferrer"
                  class="w-full py-2.5 px-3.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                  <span>View on Ianseo</span>
                </a>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>

    <!-- Scorecard Modal Dialog -->
    <div 
      v-if="selectedScorecardMatch" 
      class="fixed inset-0 z-50 bg-navy/70 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="closeScorecard"
    >
      <div class="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <div class="space-y-0.5">
            <h3 class="text-sm sm:text-base font-bold text-navy font-display">{{ scorecardRoundTitle }}</h3>
            <p class="text-[11px] text-slate-500">Official match arrow scorecard</p>
          </div>
          <button @click="closeScorecard" class="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-navy cursor-pointer">
            <Icon icon="ph:x-bold" class="text-base" />
          </button>
        </div>

        <div class="space-y-3">
          <!-- Competitor A Card -->
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs sm:text-sm text-navy">{{ toTitleCase(selectedScorecardMatch.archer_a || selectedScorecardMatch.name_a || 'Archer A') }}</span>
              <span class="text-sm sm:text-base font-mono font-black text-navy">{{ selectedScorecardMatch.score_a ?? '-' }}</span>
            </div>
            <div class="text-[11px] text-slate-500">{{ toTitleCase(selectedScorecardMatch.club_a || 'Club') }}</div>
            <div v-if="selectedScorecardMatch.sets_a" class="flex gap-1 pt-0.5">
              <span v-for="(s, idx) in selectedScorecardMatch.sets_a" :key="idx" class="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono">
                {{ s }}
              </span>
            </div>
          </div>

          <!-- Competitor B Card -->
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs sm:text-sm text-navy">{{ toTitleCase(selectedScorecardMatch.archer_b || selectedScorecardMatch.name_b || 'Archer B') }}</span>
              <span class="text-sm sm:text-base font-mono font-black text-navy">{{ selectedScorecardMatch.score_b ?? '-' }}</span>
            </div>
            <div class="text-[11px] text-slate-500">{{ toTitleCase(selectedScorecardMatch.club_b || 'Club') }}</div>
            <div v-if="selectedScorecardMatch.sets_b" class="flex gap-1 pt-0.5">
              <span v-for="(s, idx) in selectedScorecardMatch.sets_b" :key="idx" class="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-mono">
                {{ s }}
              </span>
            </div>
          </div>
        </div>

        <div class="pt-1">
          <button 
            @click="closeScorecard" 
            class="w-full py-2.5 rounded-xl bg-navy text-white font-bold text-xs hover:bg-navy/90 cursor-pointer transition-colors"
          >
            Close Scorecard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Icon } from '@iconify/vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'

const props = defineProps({
  tournament: { type: Object, default: () => ({}) },
  tournamentData: { type: Object, default: () => ({}) }
})

const activeTournament = computed(() => props.tournament || {})
const activeTournamentData = computed(() => props.tournamentData || {})

const ianseoUrl = computed(() => {
  return activeTournament.value?.source_url || `https://ianseo.net/Details.php?toId=${activeTournament.value?.external_id || activeTournament.value?.id}`
})

// ScrollSpy & Progress
const scrollProgress = ref(0)
const activeSectionId = ref('overview')

const navigationSections = [
  { id: 'overview', title: 'Tournament Overview', icon: 'ph:info-bold' },
  { id: 'medals', title: 'Medal Standings', icon: 'ph:trophy-bold' },
  { id: 'schedule', title: 'Competition Schedule', icon: 'ph:calendar-blank-bold' },
  { id: 'fop', title: 'Field of Play', icon: 'ph:crosshair-bold' },
  { id: 'results', title: 'Qualification Scores', icon: 'ph:ranking-bold' },
  { id: 'brackets', title: 'Elimination Brackets', icon: 'ph:sword-bold' },
  { id: 'athletes', title: 'Athletes & Clubs', icon: 'ph:users-three-bold' }
]

function updateScrollSpy() {
  if (typeof window === 'undefined') return
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

  const sectionEls = navigationSections.map(sec => document.getElementById(sec.id)).filter(Boolean)
  for (let i = sectionEls.length - 1; i >= 0; i--) {
    const el = sectionEls[i]
    const rect = el.getBoundingClientRect()
    if (rect.top <= 140) {
      activeSectionId.value = el.id
      break
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollSpy, { passive: true })
  updateScrollSpy()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollSpy)
})

function scrollToSection(id) {
  activeSectionId.value = id
  if (typeof window !== 'undefined') {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

function scrollToTop() {
  activeSectionId.value = 'top'
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// ── Categories & Division Parsing ──
const categoriesList = computed(() => {
  const raw = activeTournamentData.value?.categories || []
  return raw.map(c => {
    if (typeof c === 'string') {
      const clean = c.replace(/\s*\[.*?\]/g, '').trim()
      const parts = clean.split(' ')
      return {
        rawKey: c,
        displayName: clean,
        division: parts[0] || 'General'
      }
    }
    return c
  })
})

const availableDivisions = computed(() => {
  const divs = new Set()
  categoriesList.value.forEach(c => {
    divs.add(c.division || 'General')
  })
  return Array.from(divs)
})

const selectedDivision = ref('')
watch(availableDivisions, (divs) => {
  if (divs.length > 0 && !selectedDivision.value) {
    selectedDivision.value = divs[0]
  }
}, { immediate: true })

const visibleCategories = computed(() => {
  if (!selectedDivision.value) return categoriesList.value
  return categoriesList.value.filter(c => (c.division || 'General') === selectedDivision.value)
})

const selectedCategoryKey = ref('')
watch(visibleCategories, (cats) => {
  if (cats.length > 0 && (!selectedCategoryKey.value || !cats.find(c => c.rawKey === selectedCategoryKey.value))) {
    selectedCategoryKey.value = cats[0].rawKey
  }
}, { immediate: true })

const currentCategoryLabel = computed(() => {
  const c = categoriesList.value.find(item => item.rawKey === selectedCategoryKey.value)
  return c?.displayName || selectedCategoryKey.value || 'All Categories'
})

// ── Results & Qualifications ──
const qualificationsMap = computed(() => activeTournamentData.value?.qualifications || {})
const teamQualificationsMap = computed(() => activeTournamentData.value?.team_qualifications || {})

function normalizeKey(str) {
  if (!str) return ''
  return String(str).replace(/\s*\[.*?\]/g, '').trim().toUpperCase()
}

const currentCategoryQuals = computed(() => {
  const map = qualificationsMap.value
  const teamMap = teamQualificationsMap.value
  if (!selectedCategoryKey.value) return []
  if (map[selectedCategoryKey.value]) return map[selectedCategoryKey.value]
  if (teamMap[selectedCategoryKey.value]) return teamMap[selectedCategoryKey.value]
  
  const norm = normalizeKey(selectedCategoryKey.value)
  for (const k of Object.keys(map)) {
    if (normalizeKey(k) === norm) return map[k]
  }
  for (const k of Object.keys(teamMap)) {
    if (normalizeKey(k) === norm) return teamMap[k]
  }
  return []
})

// Qualification Table Interactive Sorting
const qualSortKey = ref('rank')
const qualSortAsc = ref(true)

function handleSortQual(key) {
  if (qualSortKey.value === key) {
    qualSortAsc.value = !qualSortAsc.value
  } else {
    qualSortKey.value = key
    qualSortAsc.value = true
  }
}

const resultsSearchQuery = ref('')
const sortedFilteredCategoryQuals = computed(() => {
  let list = [...currentCategoryQuals.value]
  if (resultsSearchQuery.value) {
    const q = resultsSearchQuery.value.toLowerCase()
    list = list.filter(row => 
      row.name?.toLowerCase().includes(q) || 
      row.club?.toLowerCase().includes(q)
    )
  }

  return list.sort((a, b) => {
    let valA = a[qualSortKey.value]
    let valB = b[qualSortKey.value]

    if (qualSortKey.value === 'score' || qualSortKey.value === 'rank' || qualSortKey.value === 'tens' || qualSortKey.value === 'x_count') {
      valA = parseInt(String(valA ?? '0').replace(/[^\d]/g, ''), 10) || 0
      valB = parseInt(String(valB ?? '0').replace(/[^\d]/g, ''), 10) || 0
      return qualSortAsc.value ? valA - valB : valB - valA
    }

    valA = String(valA || '').toLowerCase()
    valB = String(valB || '').toLowerCase()
    return qualSortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })
})

// ── Medal Standings & Podium Highlights ──
const finalStandingsMap = computed(() => activeTournamentData.value?.final_standings || {})

const medalTallyList = computed(() => {
  const tally = {}
  Object.keys(finalStandingsMap.value).forEach(cat => {
    const list = finalStandingsMap.value[cat] || []
    list.forEach(item => {
      const club = item.club || 'Independen'
      if (!tally[club]) tally[club] = { club, gold: 0, silver: 0, bronze: 0, total: 0 }
      if (item.rank == 1) { tally[club].gold++; tally[club].total++; }
      else if (item.rank == 2) { tally[club].silver++; tally[club].total++; }
      else if (item.rank == 3) { tally[club].bronze++; tally[club].total++; }
    })
  })

  // If final_standings is empty, compute medal tally from qualification top 3
  if (Object.keys(tally).length === 0) {
    const qMap = qualificationsMap.value
    Object.keys(qMap).forEach(cat => {
      const list = qMap[cat] || []
      list.forEach(item => {
        const club = item.club || 'Independen'
        if (!tally[club]) tally[club] = { club, gold: 0, silver: 0, bronze: 0, total: 0 }
        if (item.rank == 1) { tally[club].gold++; tally[club].total++; }
        else if (item.rank == 2) { tally[club].silver++; tally[club].total++; }
        else if (item.rank == 3) { tally[club].bronze++; tally[club].total++; }
      })
    })
  }

  return Object.values(tally)
})

// Medal Table Interactive Sorting
const medalSortKey = ref('total')
const medalSortAsc = ref(false)

function handleSortMedal(key) {
  if (medalSortKey.value === key) {
    medalSortAsc.value = !medalSortAsc.value
  } else {
    medalSortKey.value = key
    medalSortAsc.value = false
  }
}

const sortedMedalTally = computed(() => {
  let list = [...medalTallyList.value]
  return list.sort((a, b) => {
    if (medalSortKey.value === 'club') {
      const cmp = a.club.localeCompare(b.club)
      return medalSortAsc.value ? cmp : -cmp
    }

    if (medalSortKey.value === 'gold') {
      return medalSortAsc.value ? a.gold - b.gold : b.gold - a.gold
    }
    if (medalSortKey.value === 'silver') {
      return medalSortAsc.value ? a.silver - b.silver : b.silver - a.silver
    }
    if (medalSortKey.value === 'bronze') {
      return medalSortAsc.value ? a.bronze - b.bronze : b.bronze - a.bronze
    }

    if (!medalSortAsc.value) {
      if (b.gold !== a.gold) return b.gold - a.gold
      if (b.silver !== a.silver) return b.silver - a.silver
      if (b.bronze !== a.bronze) return b.bronze - a.bronze
      return b.total - a.total
    } else {
      if (a.gold !== b.gold) return a.gold - b.gold
      if (a.silver !== b.silver) return a.silver - b.silver
      if (a.bronze !== b.bronze) return a.bronze - b.bronze
      return a.total - b.total
    }
  })
})

// ── Olympic Podium Categories & Active Selection ──
const availablePodiumCategories = computed(() => {
  const map = Object.keys(finalStandingsMap.value).length > 0 ? finalStandingsMap.value : qualificationsMap.value
  return Object.keys(map).filter(cat => {
    const list = map[cat] || []
    return list.some(r => r.rank == 1 || r.rank == 2 || r.rank == 3)
  })
})

const selectedPodiumCategory = ref('')
watch(availablePodiumCategories, (cats) => {
  if (cats.length > 0 && (!selectedPodiumCategory.value || !cats.includes(selectedPodiumCategory.value))) {
    selectedPodiumCategory.value = cats[0]
  }
}, { immediate: true })

const currentPodiumCategoryData = computed(() => {
  if (!selectedPodiumCategory.value) return null
  const map = Object.keys(finalStandingsMap.value).length > 0 ? finalStandingsMap.value : qualificationsMap.value
  const list = map[selectedPodiumCategory.value] || []
  const gold = list.find(r => r.rank == 1) || null
  const silver = list.find(r => r.rank == 2) || null
  const bronze = list.find(r => r.rank == 3) || null

  if (!gold && !silver && !bronze) return null
  return {
    category: selectedPodiumCategory.value,
    gold,
    silver,
    bronze
  }
})

function getArcherInitials(name) {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// ── Schedule & Field of Play (Separated) ──
const scheduleData = computed(() => activeTournamentData.value?.schedule || [])
const activeScheduleDayIndex = ref(0)
const currentActiveScheduleDay = computed(() => scheduleData.value[activeScheduleDayIndex.value] || null)

const fopData = computed(() => activeTournamentData.value?.field_of_play || [])

// ── Elimination Brackets ──
const bracketsMap = computed(() => activeTournamentData.value?.brackets || {})
const teamBracketsMap = computed(() => activeTournamentData.value?.team_brackets || {})

const structuredBracketTree = computed(() => {
  if (!selectedCategoryKey.value) return { rounds: [], finals: [] }
  let data = bracketsMap.value[selectedCategoryKey.value] || teamBracketsMap.value[selectedCategoryKey.value]
  if (!data) {
    const norm = normalizeKey(selectedCategoryKey.value)
    for (const k of Object.keys(bracketsMap.value)) {
      if (normalizeKey(k) === norm) {
        data = bracketsMap.value[k]
        break
      }
    }
    if (!data) {
      for (const k of Object.keys(teamBracketsMap.value)) {
        if (normalizeKey(k) === norm) {
          data = teamBracketsMap.value[k]
          break
        }
      }
    }
  }
  if (!data) return { rounds: [], finals: [] }

  const matches = Array.isArray(data) ? data : data.matches || []
  const quarterMatches = matches.filter(m => m.round === 'Quarterfinals' || m.round === '1/4' || m.round === 'qf')
  const semiMatches = matches.filter(m => m.round === 'Semifinals' || m.round === '1/2' || m.round === 'sf')
  const goldMatch = matches.find(m => m.round === 'Final' || m.round === 'Gold' || m.is_gold)
  const bronzeMatch = matches.find(m => m.round === 'Bronze' || m.is_bronze)

  const rounds = []
  if (quarterMatches.length > 0) {
    rounds.push({ roundKey: 'qf', roundTitle: 'Quarterfinals', matches: quarterMatches })
  }
  if (semiMatches.length > 0) {
    rounds.push({ roundKey: 'sf', roundTitle: 'Semifinals', matches: semiMatches })
  }

  const finals = []
  if (goldMatch) finals.push(goldMatch)
  if (bronzeMatch) finals.push(bronzeMatch)

  return { rounds, finals }
})

function isMatchWinner(scoreA, scoreB) {
  if (scoreA == null) return false
  const numA = parseInt(String(scoreA).replace(/[^\d]/g, ''), 10)
  const numB = parseInt(String(scoreB || '0').replace(/[^\d]/g, ''), 10)
  return numA > numB
}

const selectedScorecardMatch = ref(null)
const scorecardRoundTitle = ref('')

function openScorecard(match, title) {
  selectedScorecardMatch.value = match
  scorecardRoundTitle.value = title || 'Match Scorecard'
}

function closeScorecard() {
  selectedScorecardMatch.value = null
}

// ── Entries / Athletes (Cleaned & Aggregated) ──
const rawEntries = computed(() => activeTournamentData.value?.entries || [])

const allExtractedAthletes = computed(() => {
  const seen = new Set()
  const athletes = []

  // 1. Collect all real athletes from qualifications & team qualifications
  const qMap = qualificationsMap.value
  const tMap = teamQualificationsMap.value

  const collectFrom = (map) => {
    Object.keys(map).forEach(cat => {
      const list = map[cat] || []
      const cleanCat = cat.replace(/\s*\[.*?\]/g, '').trim()
      list.forEach(item => {
        let name = item.name?.trim() || ''
        name = name.replace(/^[^\w\s]+/, '').trim()
        if (name && !seen.has(name.toLowerCase())) {
          seen.add(name.toLowerCase())
          athletes.push({
            name: name,
            club: item.club || 'Independen',
            target: item.target || item.target_no || '-',
            bib: item.bib || item.athlete_id || '-',
            category: cleanCat
          })
        }
      })
    })
  }

  collectFrom(qMap)
  collectFrom(tMap)

  // 2. Append any extra entries from rawEntries
  rawEntries.value.forEach(e => {
    const name = e.name?.trim()
    if (name && !seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase())
      athletes.push({
        name: e.name,
        club: e.club || 'Independen',
        target: e.target || '-',
        bib: e.bib || '-',
        category: e.category || '-'
      })
    }
  })

  return athletes
})

const computedTotalArchers = computed(() => {
  return activeTournament.value?.total_archers || allExtractedAthletes.value.length || 0
})

const entriesSearchQuery = ref('')
const entriesClubFilter = ref('')
const entriesCurrentPage = ref(1)
const entriesPageSize = ref(20)

// Athlete Table Interactive Sorting
const entriesSortKey = ref('name')
const entriesSortAsc = ref(true)

function handleSortEntries(key) {
  if (entriesSortKey.value === key) {
    entriesSortAsc.value = !entriesSortAsc.value
  } else {
    entriesSortKey.value = key
    entriesSortAsc.value = true
  }
}

const availableClubsInEntries = computed(() => {
  const clubs = new Set()
  allExtractedAthletes.value.forEach(e => {
    if (e.club) clubs.add(e.club)
  })
  return Array.from(clubs).sort()
})

const entriesClubSelectOptions = computed(() => [
  { value: '', label: `All Clubs (${allExtractedAthletes.value.length})` },
  ...availableClubsInEntries.value.map(c => ({ value: c, label: toTitleCase(c) }))
])

const processedEntriesData = computed(() => {
  let list = [...allExtractedAthletes.value]
  if (entriesSearchQuery.value) {
    const q = entriesSearchQuery.value.toLowerCase()
    list = list.filter(e => 
      e.name?.toLowerCase().includes(q) || 
      e.club?.toLowerCase().includes(q) || 
      e.target?.toLowerCase().includes(q) || 
      e.bib?.toLowerCase().includes(q)
    )
  }
  if (entriesClubFilter.value) {
    list = list.filter(e => e.club === entriesClubFilter.value)
  }

  return list.sort((a, b) => {
    let valA = a[entriesSortKey.value] || ''
    let valB = b[entriesSortKey.value] || ''
    valA = String(valA).toLowerCase()
    valB = String(valB).toLowerCase()
    return entriesSortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })
})

const totalEntriesPages = computed(() => Math.ceil(processedEntriesData.value.length / entriesPageSize.value) || 1)
const paginatedEntriesData = computed(() => {
  const start = (entriesCurrentPage.value - 1) * entriesPageSize.value
  return processedEntriesData.value.slice(start, start + entriesPageSize.value)
})

watch([entriesSearchQuery, entriesClubFilter], () => {
  entriesCurrentPage.value = 1
})

// ── Documents ──
const documentsCatalog = computed(() => activeTournamentData.value?.documents || [])
const thbDocument = computed(() => {
  return documentsCatalog.value.find(d => d.type === 'Handbook' || d.filename?.toLowerCase().includes('thb') || d.title?.toLowerCase().includes('handbook'))
})

// ── Helpers & SEO Schema ──
function toTitleCase(str) {
  if (!str) return ''
  return String(str).toLowerCase().replace(/\b([a-z])/g, (_, l) => l.toUpperCase())
}

function formatCityDisplay(city, location) {
  if (!city) return 'Indonesia'
  const lower = city.toLowerCase().trim()
  if (lower.startsWith('gor ') || lower.startsWith('lapangan ') || lower.startsWith('stadion ') || lower.startsWith('hall ') || (location && lower === location.toLowerCase().trim())) {
    const words = city.trim().split(/\s+/)
    if (words.length > 2 && (lower.startsWith('gor ') || lower.startsWith('lapangan ') || lower.startsWith('stadion '))) {
      return toTitleCase(words.slice(-1)[0])
    }
    return 'Indonesia'
  }
  return toTitleCase(city)
}

function formatDateRange(startDate, endDate) {
  if (!startDate) return 'Date TBA'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : null

  if (isNaN(start.getTime())) return startDate
  if (!end || isNaN(end.getTime()) || start.toDateString() === end.toDateString()) {
    return `${start.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`
  }
  return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`
}

const computedEventDurationDays = computed(() => {
  if (!activeTournament.value?.start_date || !activeTournament.value?.end_date) return 1
  const start = new Date(activeTournament.value.start_date)
  const end = new Date(activeTournament.value.end_date)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  return isNaN(diffDays) ? 1 : diffDays
})

function getSortIcon(colKey, currentSortKey, isAsc) {
  if (colKey !== currentSortKey) return 'ph:caret-up-down'
  return isAsc ? 'ph:caret-up-fill' : 'ph:caret-down-fill'
}

// Structured Data (Strategy 4)
const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  'name': activeTournament.value?.name,
  'startDate': activeTournament.value?.start_date,
  'endDate': activeTournament.value?.end_date,
  'location': {
    '@type': 'Place',
    'name': activeTournament.value?.location || activeTournament.value?.venue || 'Archery Venue',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': activeTournament.value?.city || 'Indonesia',
      'addressCountry': activeTournament.value?.country || 'ID'
    }
  }
}))

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify(structuredData.value))
    }
  ]
})
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
