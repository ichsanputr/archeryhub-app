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

        <div class="w-full space-y-3">
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
    <div class="lg:hidden sticky top-14 sm:top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar shadow-xs">
      <a 
        v-for="sec in navigationSections" 
        :key="sec.id"
        :href="`#${sec.id}`"
        hreflang="id"
        @click.prevent="scrollToSection(sec.id)"
        :class="[
          'px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 select-none cursor-pointer',
          activeSectionId === sec.id 
            ? 'bg-navy text-white shadow-xs font-bold' 
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
          
          <!-- ── COLUMN 1: LEFT TOC (STICKY TOP-24 BELOW NAVBAR, NO TOP ITEM) ── -->
          <aside class="col-span-12 lg:col-span-2 p-5 sm:p-6 bg-slate-50/30 lg:bg-transparent rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
            <div class="sticky top-20 sm:top-24 space-y-3">
              <div class="text-[11px] font-black uppercase tracking-wider text-slate-400 font-display pl-2.5">
                Contents
              </div>

              <!-- Dynamic TOC Links in Logical Order -->
              <nav class="space-y-1">
                <a
                  v-for="sec in navigationSections"
                  :key="sec.id"
                  :href="`#${sec.id}`"
                  hreflang="id"
                  @click.prevent="scrollToSection(sec.id)"
                  :class="[
                    'px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all block truncate select-none cursor-pointer flex items-center gap-2',
                    activeSectionId === sec.id
                      ? 'text-navy font-bold bg-primary/20 border-l-3 border-navy'
                      : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                  ]"
                >
                  <span class="truncate">{{ sec.title }}</span>
                </a>
              </nav>
            </div>
          </aside>

          <!-- ── COLUMN 2: MIDDLE MAIN ARTICLE (LOGICAL UX ORDERING) ── -->
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
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Key event metrics, competition categories, and format specifications.</p>
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
            </section>

            <!-- 2. COMPETITION SCHEDULE (PREMIUM TIMELINE DESIGN) -->
            <section v-if="hasScheduleData" id="schedule" class="scroll-mt-24 space-y-6">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:calendar-blank-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    Competition Schedule
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Sequential timeline of official rounds, qualifications, and finals.</p>
                </div>
              </div>

              <!-- Day Selector Tabs -->
              <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  v-for="(day, dIdx) in scheduleData"
                  :key="dIdx"
                  @click="activeScheduleDayIndex = dIdx"
                  :class="[
                    'px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer select-none',
                    activeScheduleDayIndex === dIdx
                      ? 'bg-navy text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  ]"
                >
                  <Icon icon="ph:calendar-check-bold" class="text-sm" />
                  <span>{{ day.date_label }}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full" :class="activeScheduleDayIndex === dIdx ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'">
                    Day {{ dIdx + 1 }}
                  </span>
                </button>
              </div>

              <!-- Timeline Container with Absolute Line and Circular Nodes -->
              <div v-if="currentActiveScheduleDay" class="border border-slate-200/80 rounded-3xl p-6 sm:p-8 bg-slate-50/40 space-y-8">
                <!-- Day Header Badge -->
                <div class="flex items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
                  <div class="flex items-center gap-2.5">
                    <span class="size-3 rounded-full bg-primary ring-4 ring-primary/20"></span>
                    <h3 class="text-sm sm:text-base font-bold text-navy font-display">
                      {{ currentActiveScheduleDay.divisions || 'Scheduled Competition Events' }}
                    </h3>
                  </div>
                  <span class="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-2xs">
                    {{ currentActiveScheduleDay.sessions.length }} Sessions
                  </span>
                </div>

                <!-- Timeline Items -->
                <div class="relative space-y-8 pl-6 sm:pl-8">
                  <!-- Absolute Vertical Connector Line -->
                  <div class="absolute left-2.5 sm:left-3 top-3 bottom-3 w-[2px] bg-gradient-to-b from-navy via-slate-300 to-slate-200"></div>

                  <div 
                    v-for="(session, sIdx) in currentActiveScheduleDay.sessions" 
                    :key="sIdx"
                    class="relative group"
                  >
                    <!-- Absolute Timeline Circular Node -->
                    <div class="absolute -left-6 sm:-left-8 top-1.5 size-5 rounded-full bg-white border-4 border-navy group-hover:border-primary group-hover:scale-110 transition-all shadow-xs z-10"></div>

                    <!-- Session Card -->
                    <div class="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs group-hover:shadow-sm group-hover:border-slate-300 transition-all space-y-2.5">
                      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div class="flex items-center gap-2 flex-wrap">
                          <!-- Time Badge -->
                          <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-navy text-white text-xs font-mono font-bold">
                            <Icon icon="ph:clock-bold" class="text-xs text-primary" />
                            <span>{{ session.time_start }} - {{ session.time_end }}</span>
                          </div>
                          <!-- Session Type Tag -->
                          <span class="px-2 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {{ toTitleCase(session.type || 'Session') }}
                          </span>
                        </div>

                        <span v-if="session.duration" class="text-xs font-mono text-slate-400">
                          {{ session.duration }} hrs duration
                        </span>
                      </div>

                      <!-- Session Title & Details -->
                      <div>
                        <h4 class="text-sm sm:text-base font-bold text-navy font-display">{{ session.title }}</h4>
                        <p v-if="session.notes" class="text-xs text-slate-500 mt-1">{{ session.notes }}</p>
                      </div>

                      <div v-if="session.section" class="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
                        <Icon icon="ph:map-pin" class="text-slate-400" />
                        <span>{{ session.section }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 3. FIELD OF PLAY (FOP) -->
            <section v-if="hasFopData" id="fop" class="scroll-mt-24 space-y-5">
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
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
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
            </section>

            <!-- 4. ATHLETES & CLUBS ROSTER (WITH SEARCH & PAGINATION CONTROLS) -->
            <section v-if="hasAthletesData" id="athletes" class="scroll-mt-24 space-y-5">
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

              <!-- Directory Controls Toolbar -->
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50/80">
                  <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
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

                    <!-- Items per page selector -->
                    <div class="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>Per page:</span>
                      <select 
                        v-model="entriesPageSize" 
                        class="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-navy"
                      >
                        <option :value="10">10</option>
                        <option :value="15">15</option>
                        <option :value="25">25</option>
                        <option :value="50">50</option>
                      </select>
                    </div>
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

            <!-- 5. QUALIFICATION SCORES & STANDINGS (WITH SEARCH & PAGINATION) -->
            <section v-if="hasQualificationsData" id="results" class="scroll-mt-24 space-y-5">
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
                <div v-if="availableDivisions.length > 0" class="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  <span class="text-xs font-bold text-slate-400 shrink-0 mr-1">Division:</span>
                  <button
                    v-for="div in availableDivisions"
                    :key="div"
                    @click="selectedDivision = div"
                    :class="[
                      'px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer select-none',
                      selectedDivision === div
                        ? 'bg-navy text-white shadow-xs font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                    ]"
                  >
                    {{ toTitleCase(div) }}
                  </button>
                </div>

                <!-- Category Pills -->
                <div v-if="visibleCategories.length > 0" class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-200/70">
                  <span class="text-xs font-bold text-slate-400 shrink-0 mr-1">Category:</span>
                  <button
                    v-for="cat in visibleCategories"
                    :key="cat.rawKey"
                    @click="selectedCategoryKey = cat.rawKey"
                    :class="[
                      'px-3 py-1 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer select-none border',
                      selectedCategoryKey === cat.rawKey
                        ? 'bg-navy text-white border-navy shadow-xs font-bold'
                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    ]"
                  >
                    <span>{{ toTitleCase(cat.displayName) }}</span>
                  </button>
                </div>
              </div>

              <!-- Qualification Table Card with Interactive Sorting & Pagination -->
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="p-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80">
                  <div>
                    <h3 class="text-xs sm:text-sm font-bold text-navy font-display">
                      {{ currentCategoryLabel }} - Leaderboard
                    </h3>
                    <div class="text-[11px] text-slate-500">Showing {{ paginatedQualsData.length }} of {{ sortedFilteredCategoryQuals.length }} competitors</div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <!-- Table Search -->
                    <div class="relative w-full sm:w-52">
                      <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input 
                        v-model="resultsSearchQuery"
                        type="text" 
                        placeholder="Search athlete, club..."
                        class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-navy placeholder:text-slate-400 focus:outline-hidden focus:border-navy"
                      />
                    </div>

                    <!-- Items per page selector -->
                    <select 
                      v-model="qualPageSize" 
                      class="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-navy"
                    >
                      <option :value="10">10 / page</option>
                      <option :value="25">25 / page</option>
                      <option :value="50">50 / page</option>
                    </select>
                  </div>
                </div>

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
                            <span>Athlete Name</span>
                            <Icon :icon="getSortIcon('name', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('club')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Club / Contingent</span>
                            <Icon :icon="getSortIcon('club', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('d1')" class="py-3 px-3.5 text-center w-16 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>D1</span>
                            <Icon :icon="getSortIcon('d1', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('d2')" class="py-3 px-3.5 text-center w-16 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>D2</span>
                            <Icon :icon="getSortIcon('d2', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('score')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 font-black text-navy">
                            <span>Total</span>
                            <Icon :icon="getSortIcon('score', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('tens')" class="py-3 px-3.5 text-center w-14 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-slate-500">
                            <span>10s</span>
                            <Icon :icon="getSortIcon('tens', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('x_count')" class="py-3 px-3.5 text-center w-14 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-slate-500">
                            <span>Xs</span>
                            <Icon :icon="getSortIcon('x_count', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                      <tr v-for="(q, qIdx) in paginatedQualsData" :key="qIdx" class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-2.5 px-3.5 text-center font-bold">
                          <span v-if="q.rank == 1" class="inline-flex size-6 rounded-full bg-amber-400 text-navy items-center justify-center text-xs font-black">1</span>
                          <span v-else-if="q.rank == 2" class="inline-flex size-6 rounded-full bg-slate-300 text-slate-800 items-center justify-center text-xs font-black">2</span>
                          <span v-else-if="q.rank == 3" class="inline-flex size-6 rounded-full bg-amber-700 text-white items-center justify-center text-xs font-black">3</span>
                          <span v-else class="text-slate-500 font-mono">{{ q.rank || (qIdx + 1) }}</span>
                        </td>
                        <td class="py-2.5 px-3.5 font-bold text-navy">{{ toTitleCase(q.name) }}</td>
                        <td class="py-2.5 px-3.5 text-slate-600">{{ toTitleCase(q.club) }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-500">{{ q.d1 || q.dist1 || '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-500">{{ q.d2 || q.dist2 || '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono font-black text-navy bg-slate-50/60">{{ q.score || q.total_score || '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-500">{{ q.tens || q.ten_count || '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-slate-500">{{ q.x_count || q.xs || '-' }}</td>
                      </tr>
                      <tr v-if="paginatedQualsData.length === 0">
                        <td colspan="8" class="py-8 text-center text-slate-400 italic">
                          No qualification scores recorded for this category yet.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Qualification Pagination Controls -->
                <div v-if="totalQualPages > 1" class="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <button
                    :disabled="qualCurrentPage === 1"
                    @click="qualCurrentPage--"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <span class="text-xs font-semibold text-slate-600">
                    Page {{ qualCurrentPage }} of {{ totalQualPages }}
                  </span>
                  <button
                    :disabled="qualCurrentPage === totalQualPages"
                    @click="qualCurrentPage++"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

            <!-- 6. ELIMINATION BRACKETS -->
            <section v-if="hasBracketsData" id="brackets" class="scroll-mt-24 space-y-5">
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

              <div class="border border-slate-200/80 rounded-2xl p-5 overflow-x-auto shadow-xs">
                <div class="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <span class="text-xs sm:text-sm font-bold text-navy font-display">{{ currentCategoryLabel }} - Elimination Tree</span>
                  <span class="text-[11px] text-slate-500">Click match to view details</span>
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
            </section>

            <!-- 7. MEDAL STANDINGS & 3D AWARDING PODIUM (CULMINATION OF EVENT) -->
            <section v-if="hasMedalsData" id="medals" class="scroll-mt-24 space-y-6">
              <div class="flex items-center justify-between border-b border-slate-100 pb-3.5 flex-wrap gap-2">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                    <Icon icon="ph:trophy-bold" class="text-xl text-navy" />
                  </div>
                  <div>
                    <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                      Medal Standings & Champions
                    </h2>
                    <p class="text-xs sm:text-sm text-slate-500 mt-0.5">Podium champions and official club medal rankings.</p>
                  </div>
                </div>

                <!-- Category Switcher Dropdown / Pills -->
                <div v-if="availablePodiumCategories.length > 0" class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/70 overflow-x-auto no-scrollbar">
                  <button
                    v-for="cat in availablePodiumCategories"
                    :key="cat"
                    @click="selectedPodiumCategory = cat"
                    :class="[
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer',
                      selectedPodiumCategory === cat
                        ? 'bg-navy text-white shadow-xs'
                        : 'text-slate-600 hover:text-navy'
                    ]"
                  >
                    {{ toTitleCase(cat) }}
                  </button>
                </div>
              </div>

              <!-- Sleek Modern 3D Podium Stage (Clean & Elegant) -->
              <div v-if="currentPodiumCategoryData" class="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#0A0F1D] text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
                <!-- Ambient Subtle Radial Glow -->
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                <!-- Header Info inside Podium Stage -->
                <div class="relative z-10 text-center space-y-1 mb-8 sm:mb-10">
                  <div class="text-xs uppercase tracking-widest text-slate-400 font-display font-bold">
                    Official Podium Ceremony
                  </div>
                  <h3 class="text-lg sm:text-2xl font-bold text-white font-display">
                    {{ toTitleCase(selectedPodiumCategory) }}
                  </h3>
                </div>

                <!-- 3D Tiered Blocks Stage -->
                <div class="relative z-10 grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-2xl mx-auto pt-4">
                  
                  <!-- 2nd Place: Silver (Left) -->
                  <div class="flex flex-col items-center text-center group">
                    <!-- Athlete Head & Medal -->
                    <div class="mb-3 flex flex-col items-center space-y-1.5">
                      <div class="relative size-12 sm:size-14 rounded-2xl bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-black text-sm sm:text-base flex items-center justify-center ring-2 ring-slate-300 shadow-md font-display">
                        {{ getArcherInitials(currentPodiumCategoryData.silver?.name) || '2' }}
                        <div class="absolute -bottom-1 -right-1 size-5 rounded-md bg-slate-300 text-slate-900 font-black text-[10px] flex items-center justify-center shadow-xs">
                          2
                        </div>
                      </div>
                      <div class="font-bold text-xs sm:text-sm text-white font-display truncate max-w-[100px] sm:max-w-[140px]" :title="currentPodiumCategoryData.silver?.name">
                        {{ toTitleCase(currentPodiumCategoryData.silver?.name || 'Silver') }}
                      </div>
                      <div class="text-[10px] sm:text-xs text-slate-400 truncate max-w-[100px] sm:max-w-[140px]">
                        {{ toTitleCase(currentPodiumCategoryData.silver?.club || 'Club') }}
                      </div>
                      <div v-if="currentPodiumCategoryData.silver?.score" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                        {{ currentPodiumCategoryData.silver?.score }}
                      </div>
                    </div>
                    <!-- 3D Podium Block -->
                    <div class="w-full h-28 sm:h-36 rounded-t-2xl bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 border-t-2 border-x border-slate-200 flex flex-col items-center justify-between py-3 shadow-lg">
                      <span class="text-xs font-black tracking-widest text-slate-800 font-display">SILVER</span>
                      <span class="text-3xl sm:text-4xl font-black text-slate-800/80 font-display">2</span>
                    </div>
                  </div>

                  <!-- 1st Place: Champion Gold (Center - Elevated with Mascot Trophy) -->
                  <div class="flex flex-col items-center text-center -mt-6 group">
                    <!-- Champion Crown & Mascot Trophy Badge -->
                    <div class="mb-3 flex flex-col items-center space-y-1.5">
                      <!-- Golden Champion Mascot Insignia -->
                      <div class="flex items-center justify-center size-8 rounded-full bg-amber-400/20 border border-amber-400/50 shadow-sm mb-0.5">
                        <Icon icon="ph:trophy-fill" class="text-lg text-amber-300" />
                      </div>
                      <div class="relative size-14 sm:size-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-200 text-navy font-black text-base sm:text-lg flex items-center justify-center ring-4 ring-amber-400/50 shadow-xl font-display">
                        {{ getArcherInitials(currentPodiumCategoryData.gold?.name) || '1' }}
                        <div class="absolute -bottom-1 -right-1 size-6 rounded-lg bg-amber-400 text-navy font-black text-xs flex items-center justify-center shadow-md">
                          1
                        </div>
                      </div>
                      <div class="font-black text-xs sm:text-base text-amber-300 font-display truncate max-w-[110px] sm:max-w-[160px]" :title="currentPodiumCategoryData.gold?.name">
                        {{ toTitleCase(currentPodiumCategoryData.gold?.name || 'Champion') }}
                      </div>
                      <div class="text-[10px] sm:text-xs text-slate-300 truncate max-w-[110px] sm:max-w-[160px]">
                        {{ toTitleCase(currentPodiumCategoryData.gold?.club || 'Club') }}
                      </div>
                      <div v-if="currentPodiumCategoryData.gold?.score" class="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-navy shadow-xs">
                        {{ currentPodiumCategoryData.gold?.score }}
                      </div>
                    </div>
                    <!-- 3D Podium Block -->
                    <div class="w-full h-36 sm:h-48 rounded-t-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 border-t-2 border-x border-amber-300 flex flex-col items-center justify-between py-3 shadow-xl">
                      <span class="text-xs sm:text-sm font-black tracking-widest text-navy font-display">GOLD</span>
                      <span class="text-4xl sm:text-5xl font-black text-navy/80 font-display">1</span>
                    </div>
                  </div>

                  <!-- 3rd Place: Bronze (Right) -->
                  <div class="flex flex-col items-center text-center group">
                    <!-- Athlete Head & Medal -->
                    <div class="mb-3 flex flex-col items-center space-y-1.5">
                      <div class="relative size-12 sm:size-14 rounded-2xl bg-gradient-to-tr from-amber-700 to-orange-400 text-white font-black text-sm sm:text-base flex items-center justify-center ring-2 ring-amber-600 shadow-md font-display">
                        {{ getArcherInitials(currentPodiumCategoryData.bronze?.name) || '3' }}
                        <div class="absolute -bottom-1 -right-1 size-5 rounded-md bg-amber-700 text-white font-black text-[10px] flex items-center justify-center shadow-xs">
                          3
                        </div>
                      </div>
                      <div class="font-bold text-xs sm:text-sm text-white font-display truncate max-w-[100px] sm:max-w-[140px]" :title="currentPodiumCategoryData.bronze?.name">
                        {{ toTitleCase(currentPodiumCategoryData.bronze?.name || 'Bronze') }}
                      </div>
                      <div class="text-[10px] sm:text-xs text-slate-400 truncate max-w-[100px] sm:max-w-[140px]">
                        {{ toTitleCase(currentPodiumCategoryData.bronze?.club || 'Club') }}
                      </div>
                      <div v-if="currentPodiumCategoryData.bronze?.score" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                        {{ currentPodiumCategoryData.bronze?.score }}
                      </div>
                    </div>
                    <!-- 3D Podium Block -->
                    <div class="w-full h-20 sm:h-28 rounded-t-2xl bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 border-t-2 border-x border-amber-500 flex flex-col items-center justify-between py-2 sm:py-3 shadow-lg">
                      <span class="text-[11px] sm:text-xs font-black tracking-widest text-amber-100 font-display">BRONZE</span>
                      <span class="text-2xl sm:text-3xl font-black text-amber-200/80 font-display">3</span>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Club Medal Standings Table (WITH SEARCH & PAGINATION CONTROLS) -->
              <div v-if="medalTallyList.length > 0" class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="p-3.5 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <div class="text-xs sm:text-sm font-bold text-navy font-display">Club Medal Leaderboard</div>
                    <div class="text-[11px] text-slate-500 font-medium">Showing {{ paginatedMedalsData.length }} of {{ sortedMedalTally.length }} contingents</div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <!-- Search Club input -->
                    <div class="relative w-full sm:w-52">
                      <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input 
                        v-model="searchMedalClub"
                        type="text" 
                        placeholder="Search club..."
                        class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-navy placeholder:text-slate-400 focus:outline-hidden focus:border-navy"
                      />
                    </div>

                    <!-- Items per page selector -->
                    <select 
                      v-model="medalPageSize" 
                      class="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-navy"
                    >
                      <option :value="5">5 / page</option>
                      <option :value="10">10 / page</option>
                      <option :value="20">20 / page</option>
                      <option :value="50">50 / page</option>
                    </select>
                  </div>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm text-navy">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <tr>
                        <th class="py-3 px-3.5 w-16 text-center">Rank</th>
                        <th @click="handleSortMedal('club')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>Club / Contingent</span>
                            <Icon :icon="getSortIcon('club', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortMedal('gold')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-amber-600">
                            <Icon icon="ph:medal-fill" class="text-sm" />
                            <span>Gold</span>
                          </div>
                        </th>
                        <th @click="handleSortMedal('silver')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-slate-500">
                            <Icon icon="ph:medal-fill" class="text-sm" />
                            <span>Silver</span>
                          </div>
                        </th>
                        <th @click="handleSortMedal('bronze')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-amber-800">
                            <Icon icon="ph:medal-fill" class="text-sm" />
                            <span>Bronze</span>
                          </div>
                        </th>
                        <th @click="handleSortMedal('total')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1">
                            <span>Total</span>
                            <Icon :icon="getSortIcon('total', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                      <tr v-for="(tally, tIdx) in paginatedMedalsData" :key="tally.club" class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-2.5 px-3.5 text-center font-bold">
                          <span v-if="(medalCurrentPage - 1) * medalPageSize + tIdx === 0" class="inline-flex size-6 rounded-full bg-amber-400 text-navy items-center justify-center text-xs font-black">1</span>
                          <span v-else-if="(medalCurrentPage - 1) * medalPageSize + tIdx === 1" class="inline-flex size-6 rounded-full bg-slate-300 text-slate-800 items-center justify-center text-xs font-black">2</span>
                          <span v-else-if="(medalCurrentPage - 1) * medalPageSize + tIdx === 2" class="inline-flex size-6 rounded-full bg-amber-700 text-white items-center justify-center text-xs font-black">3</span>
                          <span v-else class="text-slate-500 font-mono">{{ (medalCurrentPage - 1) * medalPageSize + tIdx + 1 }}</span>
                        </td>
                        <td class="py-2.5 px-3.5 font-bold text-navy">{{ toTitleCase(tally.club) }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono font-bold text-amber-600 bg-amber-50/30">{{ tally.gold }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono font-bold text-slate-600 bg-slate-50/30">{{ tally.silver }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono font-bold text-amber-800 bg-orange-50/30">{{ tally.bronze }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono font-black text-navy">{{ tally.total }}</td>
                      </tr>
                      <tr v-if="paginatedMedalsData.length === 0">
                        <td colspan="6" class="py-8 text-center text-slate-400 italic">
                          No clubs matched the search filter.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Medal Table Pagination Controls -->
                <div v-if="totalMedalPages > 1" class="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <button
                    :disabled="medalCurrentPage === 1"
                    @click="medalCurrentPage--"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Previous
                  </button>
                  <span class="text-xs font-semibold text-slate-600">
                    Page {{ medalCurrentPage }} of {{ totalMedalPages }}
                  </span>
                  <button
                    :disabled="medalCurrentPage === totalMedalPages"
                    @click="medalCurrentPage++"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

          </div>

          <!-- ── COLUMN 3: RIGHT INFOBOX (STICKY TOP-24 BELOW NAVBAR) ── -->
          <aside class="col-span-12 lg:col-span-3 p-5 sm:p-6 bg-slate-50/30 lg:bg-transparent rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
            <div class="sticky top-20 sm:top-24 space-y-4">
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
                  v-if="thbDocument?.url || ianseoUrl"
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

// Signal external tournament page state for header/footer wide container alignment
const isExternalTournamentState = useState('isExternalTournamentPage', () => true)
isExternalTournamentState.value = true

onMounted(() => {
  isExternalTournamentState.value = true
})

onUnmounted(() => {
  isExternalTournamentState.value = false
})

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

// Dynamic Navigation Sections in Logical UX Order
const navigationSections = computed(() => {
  const list = []
  
  // 1. Overview
  list.push({ id: 'overview', title: 'Tournament Overview', icon: 'ph:info-bold' })
  
  // 2. Schedule
  if (hasScheduleData.value) {
    list.push({ id: 'schedule', title: 'Competition Schedule', icon: 'ph:calendar-blank-bold' })
  }
  
  // 3. Field of Play
  if (hasFopData.value) {
    list.push({ id: 'fop', title: 'Field of Play', icon: 'ph:crosshair-bold' })
  }
  
  // 4. Athletes
  if (hasAthletesData.value) {
    list.push({ id: 'athletes', title: 'Athletes & Clubs', icon: 'ph:users-three-bold' })
  }
  
  // 5. Qualification Scores
  if (hasQualificationsData.value) {
    list.push({ id: 'results', title: 'Qualification Scores', icon: 'ph:ranking-bold' })
  }
  
  // 6. Elimination Brackets
  if (hasBracketsData.value) {
    list.push({ id: 'brackets', title: 'Elimination Brackets', icon: 'ph:sword-bold' })
  }
  
  // 7. Medal Standings & Champions (Culmination)
  if (hasMedalsData.value) {
    list.push({ id: 'medals', title: 'Medal Standings', icon: 'ph:trophy-bold' })
  }
  
  return list
})

function updateScrollSpy() {
  if (typeof window === 'undefined') return
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

  const sectionEls = navigationSections.value.map(sec => document.getElementById(sec.id)).filter(Boolean)
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

// ── Results & Qualifications (With Search & Pagination) ──
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

const hasQualificationsData = computed(() => {
  return Object.keys(qualificationsMap.value).length > 0 || 
         Object.keys(teamQualificationsMap.value).length > 0 || 
         categoriesList.value.length > 0
})

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
const qualCurrentPage = ref(1)
const qualPageSize = ref(15)

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

const totalQualPages = computed(() => Math.ceil(sortedFilteredCategoryQuals.value.length / qualPageSize.value) || 1)

const paginatedQualsData = computed(() => {
  const start = (qualCurrentPage.value - 1) * qualPageSize.value
  return sortedFilteredCategoryQuals.value.slice(start, start + qualPageSize.value)
})

watch([resultsSearchQuery, selectedCategoryKey, qualPageSize], () => {
  qualCurrentPage.value = 1
})

// ── Schedule & Field of Play ──
const scheduleData = computed(() => activeTournamentData.value?.schedule || [])
const activeScheduleDayIndex = ref(0)
const currentActiveScheduleDay = computed(() => scheduleData.value[activeScheduleDayIndex.value] || null)
const hasScheduleData = computed(() => scheduleData.value.length > 0)

const fopData = computed(() => activeTournamentData.value?.field_of_play || [])
const hasFopData = computed(() => fopData.value.length > 0)

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

const hasBracketsData = computed(() => {
  return Object.keys(bracketsMap.value).length > 0 || 
         Object.keys(teamBracketsMap.value).length > 0 ||
         structuredBracketTree.value.rounds.length > 0 ||
         structuredBracketTree.value.finals.length > 0
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

// ── Entries / Athletes (With Search, Club Filter & Pagination) ──
const rawEntries = computed(() => activeTournamentData.value?.entries || [])

const allExtractedAthletes = computed(() => {
  const seen = new Set()
  const athletes = []

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
            club: item.club || item.country || 'Independen',
            category: cleanCat,
            bib: item.bib || '',
            target: item.target || ''
          })
        }
      })
    })
  }

  collectFrom(qMap)
  collectFrom(tMap)

  rawEntries.value.forEach(e => {
    let name = e.name?.trim() || ''
    name = name.replace(/^[^\w\s]+/, '').trim()
    if (name && !seen.has(name.toLowerCase())) {
      seen.add(name.toLowerCase())
      athletes.push({
        name: name,
        club: e.club || e.country || 'Independen',
        category: e.category || 'Archery Competitor',
        bib: e.bib || '',
        target: e.target || ''
      })
    }
  })

  return athletes
})

const entriesSearchQuery = ref('')
const entriesClubFilter = ref('all')
const entriesCurrentPage = ref(1)
const entriesPageSize = ref(15)

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

const entriesClubSelectOptions = computed(() => {
  const clubs = new Set()
  allExtractedAthletes.value.forEach(a => {
    if (a.club) clubs.add(a.club)
  })
  const list = Array.from(clubs).sort((a, b) => a.localeCompare(b))
  return [
    { label: 'All Clubs & Contingents', value: 'all' },
    ...list.map(c => ({ label: toTitleCase(c), value: c }))
  ]
})

const processedEntriesData = computed(() => {
  let list = [...allExtractedAthletes.value]

  if (entriesClubFilter.value !== 'all') {
    list = list.filter(a => a.club === entriesClubFilter.value)
  }

  if (entriesSearchQuery.value) {
    const q = entriesSearchQuery.value.toLowerCase()
    list = list.filter(a => 
      a.name.toLowerCase().includes(q) || 
      a.club.toLowerCase().includes(q) ||
      (a.bib && a.bib.toLowerCase().includes(q)) ||
      (a.target && a.target.toLowerCase().includes(q))
    )
  }

  return list.sort((a, b) => {
    let valA = a[entriesSortKey.value] || ''
    let valB = b[entriesSortKey.value] || ''

    if (entriesSortKey.value === 'bib') {
      valA = parseInt(String(valA).replace(/[^\d]/g, ''), 10) || 0
      valB = parseInt(String(valB).replace(/[^\d]/g, ''), 10) || 0
      return entriesSortAsc.value ? valA - valB : valB - valA
    }

    valA = String(valA).toLowerCase()
    valB = String(valB).toLowerCase()
    return entriesSortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA)
  })
})

const hasAthletesData = computed(() => processedEntriesData.value.length > 0)

const totalEntriesPages = computed(() => Math.ceil(processedEntriesData.value.length / entriesPageSize.value) || 1)

const paginatedEntriesData = computed(() => {
  const start = (entriesCurrentPage.value - 1) * entriesPageSize.value
  return processedEntriesData.value.slice(start, start + entriesPageSize.value)
})

watch([entriesSearchQuery, entriesClubFilter, entriesPageSize], () => {
  entriesCurrentPage.value = 1
})

// ── Medal Standings & Podium (With Search & Pagination) ──
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

const hasMedalsData = computed(() => {
  return medalTallyList.value.length > 0 || availablePodiumCategories.value.length > 0
})

const medalSortKey = ref('total')
const medalSortAsc = ref(false)
const searchMedalClub = ref('')
const medalCurrentPage = ref(1)
const medalPageSize = ref(10)

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

  if (searchMedalClub.value) {
    const q = searchMedalClub.value.toLowerCase()
    list = list.filter(t => t.club.toLowerCase().includes(q))
  }

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

const totalMedalPages = computed(() => Math.ceil(sortedMedalTally.value.length / medalPageSize.value) || 1)

const paginatedMedalsData = computed(() => {
  const start = (medalCurrentPage.value - 1) * medalPageSize.value
  return sortedMedalTally.value.slice(start, start + medalPageSize.value)
})

watch([searchMedalClub, medalPageSize], () => {
  medalCurrentPage.value = 1
})

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

// Quick Metrics computations
const computedTotalArchers = computed(() => {
  const count = allExtractedAthletes.value.length
  return count > 0 ? count : (activeTournament.value?.total_archers || activeTournamentData.value?.total_archers || 'TBD')
})

const computedEventDurationDays = computed(() => {
  const start = activeTournament.value?.start_date
  const end = activeTournament.value?.end_date
  if (!start || !end) return 1
  try {
    const d1 = new Date(start)
    const d2 = new Date(end)
    const diffTime = Math.abs(d2 - d1)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays || 1
  } catch (e) {
    return 1
  }
})

const thbDocument = computed(() => {
  const docs = activeTournamentData.value?.documents || []
  return docs.find(d => (d.title && d.title.toLowerCase().includes('thb')) || (d.title && d.title.toLowerCase().includes('handbook')) || (d.url && d.url.endsWith('.pdf'))) || null
})

// Utility formatters
function toTitleCase(str) {
  if (!str) return ''
  return String(str).toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}

function formatDateRange(start, end) {
  if (!start && !end) return 'Dates TBA'
  try {
    if (start && !end) return new Date(start).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    const d1 = new Date(start)
    const d2 = new Date(end)
    const sameMonth = d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
    if (sameMonth) {
      return `${d1.getDate()} - ${d2.getDate()} ${d2.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    }
    return `${d1.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} - ${d2.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
  } catch (e) {
    return `${start || ''} - ${end || ''}`
  }
}

function formatCityDisplay(city, location) {
  const c = city || location || 'Indonesia'
  return toTitleCase(c)
}

function getSortIcon(columnKey, currentSortKey, isAsc) {
  if (currentSortKey !== columnKey) return 'ph:arrows-down-up'
  return isAsc ? 'ph:sort-ascending-bold' : 'ph:sort-descending-bold'
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
