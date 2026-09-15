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
        <!-- Breadcrumbs & Quick Language Selector -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
          <Breadcrumbs 
            :items="[{ label: t('tournaments'), path: '/tournaments' }]" 
            :current="toTitleCase(activeTournament?.name) || t('tournament_details')" 
            class="!text-slate-300 text-xs sm:text-sm" 
          />

          <!-- Header Inline Language Selector -->
          <div class="flex items-center gap-1 bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/15">
            <button
              v-for="lang in availableLanguages"
              :key="lang.code"
              @click="currentLang = lang.code"
              :class="[
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                currentLang === lang.code 
                  ? 'bg-primary text-navy shadow-xs font-black' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              ]"
            >
              <span>{{ lang.flag }}</span>
              <span>{{ lang.code.toUpperCase() }}</span>
            </button>
          </div>
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
                {{ t('contents') }}
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
                    {{ t('overview_title') }}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ t('overview_desc') }}</p>
                </div>
              </div>

              <!-- Quick Metrics 4 Cards Grid -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:users-three" class="text-xs text-navy" />
                    </div>
                    <span>{{ t('metric_archers') }}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-navy font-display mt-1.5">
                    {{ computedTotalArchers }}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">{{ t('metric_archers_sub') }}</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:shield-chevron" class="text-xs text-navy" />
                    </div>
                    <span>{{ t('metric_clubs') }}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-navy font-display mt-1.5">
                    {{ computedTotalClubs }}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">{{ t('metric_clubs_sub') }}</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:crosshair" class="text-xs text-navy" />
                    </div>
                    <span>{{ t('metric_categories') }}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-navy font-display mt-1.5">
                    {{ categoriesList.length }}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">{{ t('metric_categories_sub') }}</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                      <Icon icon="ph:target" class="text-xs text-navy" />
                    </div>
                    <span>{{ t('metric_targets') }}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold text-navy font-display mt-1.5">
                    {{ fopRoundsList.length > 0 ? fopRoundsList.length : '16+' }}
                  </div>
                  <div class="text-[11px] text-slate-400 mt-0.5">{{ t('metric_targets_sub') }}</div>
                </div>
              </div>

              <!-- Categories Pills List (ALL TEXT WHITE WHEN ACTIVE/DARK) -->
              <div v-if="categoriesList.length > 0" class="space-y-2.5 pt-1">
                <div class="text-xs font-bold text-slate-500 uppercase tracking-wider font-display">
                  {{ t('competition_divisions') }} ({{ categoriesList.length }})
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="cat in categoriesList"
                    :key="cat"
                    @click="selectedCategory = cat"
                    :class="[
                      'px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer',
                      selectedCategory === cat
                        ? 'bg-navy text-white shadow-xs font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    ]"
                  >
                    <span>{{ cat }}</span>
                    <span v-if="selectedCategory === cat" class="size-1.5 rounded-full bg-primary shrink-0"></span>
                  </button>
                </div>
              </div>
            </section>

            <!-- 2. COMPETITION SCHEDULE (PROVEN TIMELINE MODEL WITH ABSOLUTE CONNECTORS) -->
            <section v-if="hasScheduleData" id="schedule" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:calendar-check-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('schedule_title') }}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ t('schedule_desc') }}</p>
                </div>
              </div>

              <!-- Day Filter Chips (WHITE TEXT ON ACTIVE) -->
              <div class="flex flex-wrap gap-2 pt-1">
                <button
                  @click="selectedScheduleDay = 'all'"
                  :class="[
                    'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                    selectedScheduleDay === 'all'
                      ? 'bg-navy text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  ]"
                >
                  {{ t('all_days') }}
                </button>
                <button
                  v-for="day in availableScheduleDays"
                  :key="day"
                  @click="selectedScheduleDay = day"
                  :class="[
                    'px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                    selectedScheduleDay === day
                      ? 'bg-navy text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  ]"
                >
                  {{ day }}
                </button>
              </div>

              <!-- TIMELINE CONTAINER WITH VERTICAL CONNECTOR LINE -->
              <div class="relative pl-6 sm:pl-8 space-y-6 pt-2">
                <!-- Vertical Line Absolute Connector -->
                <div class="absolute left-2.5 sm:left-3 top-3 bottom-3 w-[2px] bg-gradient-to-b from-navy via-slate-300 to-slate-200"></div>

                <!-- Timeline Items -->
                <div 
                  v-for="(item, idx) in filteredScheduleTimeline" 
                  :key="idx" 
                  class="relative group"
                >
                  <!-- Timeline Circular Node Indicator -->
                  <div class="absolute -left-6 sm:-left-8 top-1.5 size-5 rounded-full bg-white border-4 border-navy group-hover:border-primary transition-colors shadow-xs"></div>

                  <!-- Timeline Session Card -->
                  <div class="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-slate-300 transition-all space-y-2">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                      <div class="flex items-center gap-2">
                        <span class="px-2.5 py-1 rounded-lg bg-navy text-white text-xs font-mono font-bold tracking-tight">
                          {{ item.time || item.start_time || 'Session ' + (idx + 1) }}
                        </span>
                        <span v-if="item.day" class="text-xs font-bold text-slate-500 font-display">
                          {{ item.day }}
                        </span>
                      </div>
                      <span v-if="item.type" class="px-2 py-0.5 rounded-md bg-primary/20 text-navy text-[11px] font-bold">
                        {{ item.type }}
                      </span>
                    </div>

                    <h4 class="text-sm sm:text-base font-bold text-navy font-display">
                      {{ item.title || item.name || item.description }}
                    </h4>

                    <p v-if="item.notes || item.location" class="text-xs text-slate-500 leading-relaxed">
                      {{ item.notes || item.location }}
                    </p>

                    <!-- Category Pills inside Timeline Item -->
                    <div v-if="item.categories && item.categories.length > 0" class="flex flex-wrap gap-1.5 pt-1">
                      <span 
                        v-for="cat in item.categories" 
                        :key="cat" 
                        class="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-semibold"
                      >
                        {{ cat }}
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="filteredScheduleTimeline.length === 0" class="py-8 text-center text-slate-400 italic">
                  {{ t('no_schedule_available') }}
                </div>
              </div>
            </section>

            <!-- 3. FIELD OF PLAY (FOP) -->
            <section v-if="hasFopData" id="fop" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:target-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('fop_title') }}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ t('fop_desc') }}</p>
                </div>
              </div>

              <!-- FOP Target Allocation Table -->
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <table class="w-full text-left text-xs sm:text-sm text-navy">
                  <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th class="py-3 px-4 w-28">{{ t('fop_col_target') }}</th>
                      <th class="py-3 px-4">{{ t('fop_col_category') }}</th>
                      <th class="py-3 px-4">{{ t('fop_col_distance') }}</th>
                      <th class="py-3 px-4 text-center">{{ t('fop_col_archers') }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 font-medium">
                    <tr v-for="(fop, fIdx) in fopRoundsList" :key="fIdx" class="hover:bg-slate-50/70 transition-colors">
                      <td class="py-3 px-4 font-mono font-bold text-navy">
                        {{ fop.target_range || `Target ${fIdx + 1}` }}
                      </td>
                      <td class="py-3 px-4 font-bold text-navy">
                        {{ fop.category_name || fop.division || '-' }}
                      </td>
                      <td class="py-3 px-4 text-slate-600">
                        {{ fop.distance || fop.target_face || '-' }}
                      </td>
                      <td class="py-3 px-4 text-center font-mono font-bold text-slate-700">
                        {{ fop.archers_count || fop.entries_count || '-' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- 4. ATHLETES & ENTRIES (FULL PAGINATION & SEARCH & ITEMS PER PAGE) -->
            <section v-if="hasEntriesData" id="athletes" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:user-list-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('athletes_title') }}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ t('athletes_desc') }}</p>
                </div>
              </div>

              <!-- Search and Filter Bar -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div class="relative flex-1">
                  <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    v-model="entriesSearchQuery"
                    type="text"
                    :placeholder="t('search_athlete_placeholder')"
                    class="w-full pl-9 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-navy placeholder:text-slate-400 focus:outline-hidden focus:border-navy focus:bg-white transition-all"
                  />
                </div>

                <div class="flex items-center gap-2">
                  <select
                    v-model="entriesClubFilter"
                    class="px-3 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-navy focus:outline-hidden focus:border-navy"
                  >
                    <option value="all">{{ t('all_clubs') }}</option>
                    <option v-for="c in uniqueEntriesClubs" :key="c" :value="c">{{ c }}</option>
                  </select>

                  <!-- Items per page selector -->
                  <select
                    v-model="entriesPageSize"
                    class="px-2.5 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-navy focus:outline-hidden"
                  >
                    <option :value="10">10 {{ t('per_page') }}</option>
                    <option :value="15">15 {{ t('per_page') }}</option>
                    <option :value="25">25 {{ t('per_page') }}</option>
                    <option :value="50">50 {{ t('per_page') }}</option>
                  </select>
                </div>
              </div>

              <!-- Athletes Table -->
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm text-navy">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <tr>
                        <th class="py-3 px-3.5 w-14 text-center">#</th>
                        <th @click="handleSortEntries('name')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>{{ t('col_athlete_name') }}</span>
                            <Icon :icon="getSortIcon('name', entriesSortKey, entriesSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('club')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>{{ t('col_club') }}</span>
                            <Icon :icon="getSortIcon('club', entriesSortKey, entriesSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th class="py-3 px-3.5">{{ t('col_category') }}</th>
                        <th class="py-3 px-3.5 text-center">{{ t('col_target') }}</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 font-medium">
                      <tr v-for="(entry, eIdx) in paginatedEntriesData" :key="eIdx" class="hover:bg-slate-50/70 transition-colors">
                        <td class="py-2.5 px-3.5 text-center text-slate-400 font-mono text-xs">
                          {{ (entriesCurrentPage - 1) * entriesPageSize + eIdx + 1 }}
                        </td>
                        <td class="py-2.5 px-3.5 font-bold text-navy">{{ toTitleCase(entry.name || entry.athlete_name) }}</td>
                        <td class="py-2.5 px-3.5 text-slate-600">{{ toTitleCase(entry.club || entry.country || '-') }}</td>
                        <td class="py-2.5 px-3.5 text-slate-600">{{ entry.category || entry.division || '-' }}</td>
                        <td class="py-2.5 px-3.5 text-center font-mono text-xs font-semibold text-slate-700">{{ entry.target || entry.bib || '-' }}</td>
                      </tr>
                      <tr v-if="paginatedEntriesData.length === 0">
                        <td colspan="5" class="py-8 text-center text-slate-400 italic">
                          {{ t('no_athletes_found') }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Athletes Pagination Controls -->
                <div v-if="totalEntriesPages > 1" class="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                  <button
                    :disabled="entriesCurrentPage === 1"
                    @click="entriesCurrentPage--"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {{ t('btn_previous') }}
                  </button>
                  <span class="text-xs font-semibold text-slate-600">
                    {{ t('page_x_of_y', { current: entriesCurrentPage, total: totalEntriesPages }) }}
                  </span>
                  <button
                    :disabled="entriesCurrentPage === totalEntriesPages"
                    @click="entriesCurrentPage++"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {{ t('btn_next') }}
                  </button>
                </div>
              </div>
            </section>

            <!-- 5. QUALIFICATION SCORES (FULL PAGINATION & ITEMS PER PAGE) -->
            <section v-if="hasQualificationsData" id="qualifications" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:medal-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('qualifications_title') }}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ t('qualifications_desc') }}</p>
                </div>
              </div>

              <!-- Category Filter & Items per page bar -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="cat in availableQualificationCategories"
                    :key="cat"
                    @click="selectedQualCategory = cat; qualCurrentPage = 1"
                    :class="[
                      'px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer',
                      selectedQualCategory === cat
                        ? 'bg-navy text-white shadow-xs font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    ]"
                  >
                    {{ cat }}
                  </button>
                </div>

                <div class="flex items-center gap-2">
                  <div class="relative w-full sm:w-48">
                    <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      v-model="resultsSearchQuery"
                      type="text"
                      :placeholder="t('search_archer_placeholder')"
                      class="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-navy placeholder:text-slate-400 focus:outline-hidden focus:border-navy focus:bg-white"
                    />
                  </div>

                  <select
                    v-model="qualPageSize"
                    class="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy"
                  >
                    <option :value="10">10 {{ t('per_page') }}</option>
                    <option :value="25">25 {{ t('per_page') }}</option>
                    <option :value="50">50 {{ t('per_page') }}</option>
                  </select>
                </div>
              </div>

              <!-- Qualifications Table -->
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm text-navy">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <tr>
                        <th class="py-3 px-3.5 w-14 text-center">{{ t('col_rank') }}</th>
                        <th @click="handleSortQual('name')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>{{ t('col_archer_name') }}</span>
                            <Icon :icon="getSortIcon('name', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortQual('club')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>{{ t('col_club') }}</span>
                            <Icon :icon="getSortIcon('club', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th class="py-3 px-3.5 text-center w-16 font-mono">{{ t('col_d1') }}</th>
                        <th class="py-3 px-3.5 text-center w-16 font-mono">{{ t('col_d2') }}</th>
                        <th @click="handleSortQual('score')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors font-mono">
                          <div class="flex items-center justify-center gap-1 text-navy">
                            <span>{{ t('col_total') }}</span>
                            <Icon :icon="getSortIcon('score', qualSortKey, qualSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th class="py-3 px-3.5 text-center w-14 font-mono">10s</th>
                        <th class="py-3 px-3.5 text-center w-14 font-mono">Xs</th>
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
                          {{ t('no_qual_scores') }}
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
                    {{ t('btn_previous') }}
                  </button>
                  <span class="text-xs font-semibold text-slate-600">
                    {{ t('page_x_of_y', { current: qualCurrentPage, total: totalQualPages }) }}
                  </span>
                  <button
                    :disabled="qualCurrentPage === totalQualPages"
                    @click="qualCurrentPage++"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {{ t('btn_next') }}
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
                    {{ t('brackets_title') }}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ t('brackets_desc') }}</p>
                </div>
              </div>

              <div class="border border-slate-200/80 rounded-2xl p-5 overflow-x-auto shadow-xs">
                <div class="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <span class="text-xs sm:text-sm font-bold text-navy font-display">{{ currentCategoryLabel }} - {{ t('elimination_tree') }}</span>
                  <span class="text-[11px] text-slate-500">{{ t('click_match_details') }}</span>
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
                      {{ formatRoundTitle(rnd.roundTitle) }}
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
                      {{ t('medal_matches') }}
                    </div>

                    <div 
                      v-for="(fMatch, fIdx) in structuredBracketTree.finals" 
                      :key="fIdx" 
                      @click="openScorecard(fMatch, fMatch.is_bronze ? t('bronze_medal_match') : t('gold_medal_final'))"
                      :class="[
                        'p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs space-y-2',
                        fMatch.is_bronze 
                          ? 'border-amber-200 bg-amber-50/50 hover:bg-white' 
                          : 'border-amber-300 bg-amber-50 hover:bg-white shadow-sm'
                      ]"
                    >
                      <div class="flex items-center justify-between text-[11px] font-bold text-amber-800">
                        <span>{{ fMatch.is_bronze ? t('bronze_match') : t('gold_final') }}</span>
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

            <!-- 7. MEDAL STANDINGS & SLEEK 3D AWARDING PODIUM -->
            <section v-if="hasMedalsData" id="medals" class="scroll-mt-24 space-y-6">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold shrink-0">
                  <Icon icon="ph:trophy-bold" class="text-xl text-navy" />
                </div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('medals_title') }}
                  </h2>
                  <p class="text-xs sm:text-sm text-slate-500 mt-0.5">{{ t('medals_desc') }}</p>
                </div>
              </div>

              <!-- 3D Awarding Stage Card (Sleek, Mature, Radial Ambient Glow) -->
              <div class="relative rounded-3xl bg-gradient-to-b from-slate-900 via-navy to-slate-950 p-6 sm:p-8 text-white overflow-hidden shadow-xl border border-slate-800">
                <!-- Background ambient lights -->
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary/15 via-transparent to-transparent"></div>

                <!-- Stage Header -->
                <div class="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-white/10">
                  <div>
                    <h3 class="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2">
                      <Icon icon="ph:crown-bold" class="text-amber-400 text-lg" />
                      <span>{{ t('official_awarding_podium') }}</span>
                    </h3>
                    <p class="text-xs text-slate-400 mt-0.5">{{ t('category_view') }}: {{ currentCategoryLabel }}</p>
                  </div>

                  <!-- Category switcher for podium -->
                  <div class="flex items-center gap-2">
                    <select
                      v-model="selectedPodiumCategory"
                      class="px-3 py-1.5 bg-white/10 border border-white/20 rounded-xl text-xs font-bold text-white focus:outline-hidden focus:bg-navy cursor-pointer"
                    >
                      <option v-for="cat in availablePodiumCategories" :key="cat" :value="cat" class="bg-navy text-white">
                        {{ cat }}
                      </option>
                    </select>
                  </div>
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
                        {{ toTitleCase(currentPodiumCategoryData.silver?.name || t('medal_silver')) }}
                      </div>
                      <div class="text-[10px] sm:text-xs text-slate-400 truncate max-w-[100px] sm:max-w-[140px]">
                        {{ toTitleCase(currentPodiumCategoryData.silver?.club || t('club')) }}
                      </div>
                      <div v-if="currentPodiumCategoryData.silver?.score" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                        {{ currentPodiumCategoryData.silver?.score }}
                      </div>
                    </div>
                    <!-- 3D Podium Block -->
                    <div class="w-full h-28 sm:h-36 rounded-t-2xl bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 border-t-2 border-x border-slate-200 flex flex-col items-center justify-between py-3 shadow-lg">
                      <span class="text-xs font-black tracking-widest text-slate-800 font-display">{{ t('podium_silver') }}</span>
                      <span class="text-3xl sm:text-4xl font-black text-slate-800/80 font-display">2</span>
                    </div>
                  </div>

                  <!-- 1st Place: Champion Gold (Center - Elevated with Mascot Trophy) -->
                  <div class="flex flex-col items-center text-center -mt-6 group">
                    <!-- Champion Crown & Mascot Trophy Badge -->
                    <div class="mb-3 flex flex-col items-center space-y-1.5">
                      <!-- Golden Champion Mascot Insignia -->
                      <div class="flex items-center justify-center size-8 rounded-full bg-amber-400/20 border border-amber-400/50 shadow-sm mb-0.5" :title="t('champion_winner')">
                        <Icon icon="ph:trophy-fill" class="text-lg text-amber-300" />
                      </div>
                      <div class="relative size-14 sm:size-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-200 text-navy font-black text-base sm:text-lg flex items-center justify-center ring-4 ring-amber-400/50 shadow-xl font-display">
                        {{ getArcherInitials(currentPodiumCategoryData.gold?.name) || '1' }}
                        <div class="absolute -bottom-1 -right-1 size-6 rounded-lg bg-amber-400 text-navy font-black text-xs flex items-center justify-center shadow-md">
                          1
                        </div>
                      </div>
                      <div class="font-black text-xs sm:text-base text-amber-300 font-display truncate max-w-[110px] sm:max-w-[160px]" :title="currentPodiumCategoryData.gold?.name">
                        {{ toTitleCase(currentPodiumCategoryData.gold?.name || t('medal_gold')) }}
                      </div>
                      <div class="text-[10px] sm:text-xs text-slate-300 truncate max-w-[110px] sm:max-w-[160px]">
                        {{ toTitleCase(currentPodiumCategoryData.gold?.club || t('club')) }}
                      </div>
                      <div v-if="currentPodiumCategoryData.gold?.score" class="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-400 text-navy shadow-xs">
                        {{ currentPodiumCategoryData.gold?.score }}
                      </div>
                    </div>
                    <!-- 3D Podium Block -->
                    <div class="w-full h-36 sm:h-48 rounded-t-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 border-t-2 border-x border-amber-300 flex flex-col items-center justify-between py-3 shadow-xl">
                      <span class="text-xs sm:text-sm font-black tracking-widest text-navy font-display">{{ t('podium_gold') }}</span>
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
                        {{ toTitleCase(currentPodiumCategoryData.bronze?.name || t('medal_bronze')) }}
                      </div>
                      <div class="text-[10px] sm:text-xs text-slate-400 truncate max-w-[100px] sm:max-w-[140px]">
                        {{ toTitleCase(currentPodiumCategoryData.bronze?.club || t('club')) }}
                      </div>
                      <div v-if="currentPodiumCategoryData.bronze?.score" class="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-200">
                        {{ currentPodiumCategoryData.bronze?.score }}
                      </div>
                    </div>
                    <!-- 3D Podium Block -->
                    <div class="w-full h-20 sm:h-28 rounded-t-2xl bg-gradient-to-b from-amber-600 via-amber-700 to-amber-900 border-t-2 border-x border-amber-500 flex flex-col items-center justify-between py-2 sm:py-3 shadow-lg">
                      <span class="text-[11px] sm:text-xs font-black tracking-widest text-amber-100 font-display">{{ t('podium_bronze') }}</span>
                      <span class="text-2xl sm:text-3xl font-black text-amber-200/80 font-display">3</span>
                    </div>
                  </div>

                </div>
              </div>

              <!-- Club Medal Standings Table (WITH SEARCH & PAGINATION CONTROLS) -->
              <div v-if="medalTallyList.length > 0" class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
                <div class="p-3.5 border-b border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  <div>
                    <div class="text-xs sm:text-sm font-bold text-navy font-display">{{ t('club_medal_leaderboard') }}</div>
                    <div class="text-[11px] text-slate-500 font-medium">{{ t('showing_x_of_y_clubs', { current: paginatedMedalsData.length, total: sortedMedalTally.length }) }}</div>
                  </div>

                  <div class="flex items-center gap-2.5">
                    <!-- Search Club input -->
                    <div class="relative w-full sm:w-52">
                      <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                      <input 
                        v-model="searchMedalClub"
                        type="text" 
                        :placeholder="t('search_club_placeholder')"
                        class="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-navy placeholder:text-slate-400 focus:outline-hidden focus:border-navy"
                      />
                    </div>

                    <!-- Items per page selector -->
                    <select 
                      v-model="medalPageSize" 
                      class="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-navy"
                    >
                      <option :value="5">5 {{ t('per_page') }}</option>
                      <option :value="10">10 {{ t('per_page') }}</option>
                      <option :value="20">20 {{ t('per_page') }}</option>
                      <option :value="50">50 {{ t('per_page') }}</option>
                    </select>
                  </div>
                </div>

                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm text-navy">
                    <thead class="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 select-none">
                      <tr>
                        <th class="py-3 px-3.5 w-16 text-center">{{ t('col_rank') }}</th>
                        <th @click="handleSortMedal('club')" class="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center gap-1">
                            <span>{{ t('col_club_contingent') }}</span>
                            <Icon :icon="getSortIcon('club', medalSortKey, medalSortAsc)" class="text-xs text-slate-400" />
                          </div>
                        </th>
                        <th @click="handleSortMedal('gold')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-amber-600">
                            <Icon icon="ph:medal-fill" class="text-sm" />
                            <span>{{ t('medal_gold') }}</span>
                          </div>
                        </th>
                        <th @click="handleSortMedal('silver')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-slate-500">
                            <Icon icon="ph:medal-fill" class="text-sm" />
                            <span>{{ t('medal_silver') }}</span>
                          </div>
                        </th>
                        <th @click="handleSortMedal('bronze')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-amber-800">
                            <Icon icon="ph:medal-fill" class="text-sm" />
                            <span>{{ t('medal_bronze') }}</span>
                          </div>
                        </th>
                        <th @click="handleSortMedal('total')" class="py-3 px-3.5 text-center w-20 cursor-pointer hover:bg-slate-100 transition-colors">
                          <div class="flex items-center justify-center gap-1 text-navy">
                            <span>{{ t('col_total') }}</span>
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
                          {{ t('no_clubs_found') }}
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
                    {{ t('btn_previous') }}
                  </button>
                  <span class="text-xs font-semibold text-slate-600">
                    {{ t('page_x_of_y', { current: medalCurrentPage, total: totalMedalPages }) }}
                  </span>
                  <button
                    :disabled="medalCurrentPage === totalMedalPages"
                    @click="medalCurrentPage++"
                    class="px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {{ t('btn_next') }}
                  </button>
                </div>
              </div>
            </section>

          </div>

          <!-- ── COLUMN 3: RIGHT INFOBOX & TOOLS (NON-DUPLICATE, USEFUL ACTIONS & MULTILANG) ── -->
          <aside class="col-span-12 lg:col-span-3 p-5 sm:p-6 bg-slate-50/30 lg:bg-transparent rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
            <div class="sticky top-20 sm:top-24 space-y-4">
              
              <!-- Quick Hub Header -->
              <div class="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="size-7 rounded-lg bg-primary/20 text-navy border border-primary/30 flex items-center justify-center font-bold">
                    <Icon icon="ph:gear-six-bold" class="text-sm text-navy" />
                  </div>
                  <span class="text-xs sm:text-sm font-bold text-navy font-display">{{ t('hub_title') }}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  {{ t('status_live_results') }}
                </span>
              </div>

              <!-- 1. Language Switcher Card -->
              <div class="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
                <div class="flex items-center justify-between text-xs text-slate-600 font-semibold">
                  <span class="flex items-center gap-1.5">
                    <Icon icon="ph:translate-bold" class="text-primary text-sm" />
                    <span>{{ t('select_language') }}</span>
                  </span>
                  <span class="text-[10px] font-mono text-slate-400 uppercase font-bold">{{ currentLang }}</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5">
                  <button
                    v-for="lang in availableLanguages"
                    :key="lang.code"
                    @click="currentLang = lang.code"
                    :class="[
                      'py-2 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer border',
                      currentLang === lang.code
                        ? 'bg-navy text-white border-navy shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    ]"
                  >
                    <span class="text-sm">{{ lang.flag }}</span>
                    <span class="text-[11px]">{{ lang.label }}</span>
                  </button>
                </div>
              </div>

              <!-- 2. Fast Category Jumper -->
              <div v-if="categoriesList.length > 0" class="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
                <div class="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                  <Icon icon="ph:crosshair-bold" class="text-primary text-sm" />
                  <span>{{ t('jump_category') }}</span>
                </div>
                <select
                  v-model="selectedCategory"
                  @change="selectedQualCategory = selectedCategory; selectedPodiumCategory = selectedCategory"
                  class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy focus:outline-hidden focus:border-navy cursor-pointer"
                >
                  <option v-for="cat in categoriesList" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <!-- 3. Sanctioning & Engine Verification Card -->
              <div class="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-2 text-xs">
                <div class="font-bold text-navy flex items-center gap-1.5">
                  <Icon icon="ph:certificate-bold" class="text-primary text-sm" />
                  <span>{{ t('sanctioning_title') }}</span>
                </div>
                <p class="text-[11px] text-slate-500 leading-relaxed">
                  {{ t('sanctioning_desc') }}
                </p>
              </div>

              <!-- 4. Official Handbook & External Actions -->
              <div class="space-y-2 pt-1">
                <a 
                  v-if="thbDocument?.url || ianseoUrl"
                  :href="thbDocument?.url || ianseoUrl" 
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  class="w-full py-2.5 px-3.5 rounded-xl bg-primary hover:bg-primary-hover text-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <Icon icon="ph:file-pdf-bold" class="text-base" />
                  <span>{{ t('download_handbook_btn') }}</span>
                </a>

                <a 
                  :href="ianseoUrl" 
                  target="_blank" 
                  rel="nofollow noopener noreferrer"
                  class="w-full py-2.5 px-3.5 rounded-xl border border-slate-200/90 hover:bg-slate-50 text-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                  <span>{{ t('view_ianseo_btn') }}</span>
                </a>

                <button 
                  @click="copyTournamentShareLink" 
                  class="w-full py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Icon :icon="copiedShareLink ? 'ph:check-bold' : 'ph:share-network-bold'" :class="copiedShareLink ? 'text-emerald-600' : ''" class="text-sm" />
                  <span>{{ copiedShareLink ? t('link_copied') : t('share_tournament') }}</span>
                </button>
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
            <p class="text-[11px] text-slate-500">{{ t('official_arrow_scorecard') }}</p>
          </div>
          <button @click="closeScorecard" class="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-navy cursor-pointer">
            <Icon icon="ph:x-bold" class="text-base" />
          </button>
        </div>

        <div class="space-y-3">
          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div class="truncate">
              <div class="text-xs text-slate-500 font-mono">#{{ selectedScorecardMatch.seed_a || '1' }}</div>
              <div class="font-bold text-navy text-sm truncate">{{ toTitleCase(selectedScorecardMatch.archer_a || selectedScorecardMatch.name_a || 'Archer A') }}</div>
            </div>
            <div class="text-xl font-mono font-black text-navy px-3 py-1 rounded-xl bg-white border border-slate-200">
              {{ selectedScorecardMatch.score_a ?? '-' }}
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div class="truncate">
              <div class="text-xs text-slate-500 font-mono">#{{ selectedScorecardMatch.seed_b || '2' }}</div>
              <div class="font-bold text-navy text-sm truncate">{{ toTitleCase(selectedScorecardMatch.archer_b || selectedScorecardMatch.name_b || 'Archer B') }}</div>
            </div>
            <div class="text-xl font-mono font-black text-navy px-3 py-1 rounded-xl bg-white border border-slate-200">
              {{ selectedScorecardMatch.score_b ?? '-' }}
            </div>
          </div>
        </div>

        <div class="pt-2 flex justify-end">
          <button 
            @click="closeScorecard" 
            class="px-4 py-2 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy-light transition-colors cursor-pointer"
          >
            {{ t('btn_close') }}
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
  tournament: {
    type: Object,
    default: () => ({})
  },
  tournamentData: {
    type: Object,
    default: () => ({})
  }
})

// Active Tournament Props
const activeTournament = computed(() => props.tournament || {})
const activeTournamentData = computed(() => props.tournamentData || {})

// ─────────────────────────────────────────────────────────────
// MULTI-LANGUAGE SYSTEM (EN default, ID, KO)
// ─────────────────────────────────────────────────────────────
const currentLang = ref('en')
const availableLanguages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' }
]

const translations = {
  en: {
    tournaments: 'Tournaments',
    tournament_details: 'Tournament Details',
    contents: 'Contents',
    overview_title: 'Tournament Overview',
    overview_desc: 'Key event metrics, competition categories, and format specifications.',
    metric_archers: 'Total Archers',
    metric_archers_sub: 'Registered Competitors',
    metric_clubs: 'Clubs & Teams',
    metric_clubs_sub: 'Participating Units',
    metric_categories: 'Categories',
    metric_categories_sub: 'Competition Events',
    metric_targets: 'Field Targets',
    metric_targets_sub: 'Assigned Targets',
    competition_divisions: 'Competition Categories',
    schedule_title: 'Competition Schedule',
    schedule_desc: 'Official day-by-day timeline, practice slots, and match sessions.',
    all_days: 'All Days',
    no_schedule_available: 'No schedule available for selected filters.',
    fop_title: 'Field of Play',
    fop_desc: 'Target butt assignments, distance specs, and shooting line layout.',
    fop_col_target: 'Target Range',
    fop_col_category: 'Category / Division',
    fop_col_distance: 'Distance & Face',
    fop_col_archers: 'Athletes',
    athletes_title: 'Athletes & Entries',
    athletes_desc: 'Complete list of participating archers, bib numbers, and club affiliations.',
    search_athlete_placeholder: 'Search athlete name or club...',
    all_clubs: 'All Clubs',
    per_page: '/ page',
    col_athlete_name: 'Athlete Name',
    col_archer_name: 'Archer Name',
    col_club: 'Club / Team',
    col_club_contingent: 'Club / Contingent',
    col_category: 'Category',
    col_target: 'Target / Bib',
    no_athletes_found: 'No athletes match your search criteria.',
    btn_previous: 'Previous',
    btn_next: 'Next',
    page_x_of_y: 'Page {current} of {total}',
    qualifications_title: 'Qualifications',
    qualifications_desc: 'Ranking round scores, session totals, tens and X counts.',
    search_archer_placeholder: 'Search archer...',
    col_rank: 'Rank',
    col_d1: 'Dist 1',
    col_d2: 'Dist 2',
    col_total: 'Total',
    no_qual_scores: 'No qualification scores recorded for this category yet.',
    brackets_title: 'Elimination Brackets',
    brackets_desc: 'Head-to-head knockout matches, set scores, and medal match trees.',
    elimination_tree: 'Elimination Tree',
    click_match_details: 'Click match to view details',
    medal_matches: 'Medal Matches',
    bronze_medal_match: 'Bronze Medal Match',
    gold_medal_final: 'Gold Medal Final',
    bronze_match: 'Bronze Match',
    gold_final: 'Gold Final',
    medals_title: 'Medal Standings',
    medals_desc: 'Top individual champions & overall contingent medal standings.',
    official_awarding_podium: 'Official Awarding Podium',
    category_view: 'Category',
    medal_gold: 'Gold',
    medal_silver: 'Silver',
    medal_bronze: 'Bronze',
    podium_gold: 'GOLD',
    podium_silver: 'SILVER',
    podium_bronze: 'BRONZE',
    club: 'Club',
    champion_winner: 'Championship Winner',
    club_medal_leaderboard: 'Club Medal Leaderboard',
    showing_x_of_y_clubs: 'Showing {current} of {total} contingents',
    search_club_placeholder: 'Search club...',
    no_clubs_found: 'No clubs matched the search filter.',
    hub_title: 'Tournament Hub',
    status_live_results: 'Live Verified',
    select_language: 'Display Language',
    jump_category: 'Jump to Category',
    sanctioning_title: 'Sanctioning & Scored Data',
    sanctioning_desc: 'Official tournament data synchronized directly via Ianseo Engine with Perpani standards.',
    download_handbook_btn: 'Download Handbook (PDF)',
    view_ianseo_btn: 'View on Ianseo Official',
    share_tournament: 'Share Tournament',
    link_copied: 'Link Copied!',
    official_arrow_scorecard: 'Official match arrow scorecard',
    btn_close: 'Close',
    round_qf: 'Quarterfinals',
    round_sf: 'Semifinals',
    round_finals: 'Finals'
  },
  id: {
    tournaments: 'Turnamen',
    tournament_details: 'Detail Turnamen',
    contents: 'Daftar Isi',
    overview_title: 'Ringkasan Turnamen',
    overview_desc: 'Metrik utama turnamen, kategori lomba, dan spesifikasi pertandingan.',
    metric_archers: 'Total Atlet',
    metric_archers_sub: 'Atlet Terdaftar',
    metric_clubs: 'Klub & Tim',
    metric_clubs_sub: 'Unit Berpartisipasi',
    metric_categories: 'Kategori Lomba',
    metric_categories_sub: 'Nomor Pertandingan',
    metric_targets: 'Bantalan Target',
    metric_targets_sub: 'Target Lapangan',
    competition_divisions: 'Kategori & Divisi Lomba',
    schedule_title: 'Jadwal Pertandingan',
    schedule_desc: 'Jadwal resmi harian, sesi latihan, kualifikasi, dan babak eliminasi.',
    all_days: 'Semua Hari',
    no_schedule_available: 'Tidak ada jadwal untuk filter ini.',
    fop_title: 'Arena Lapangan (FOP)',
    fop_desc: 'Distribusi bantalan target, jarak tembak, dan denah lapangan.',
    fop_col_target: 'Rentang Target',
    fop_col_category: 'Kategori / Divisi',
    fop_col_distance: 'Jarak & Face',
    fop_col_archers: 'Peserta',
    athletes_title: 'Daftar Atlet & Klub',
    athletes_desc: 'Daftar lengkap atlet peserta, nomor bantalan/bib, dan asal klub.',
    search_athlete_placeholder: 'Cari nama atlet atau klub...',
    all_clubs: 'Semua Klub',
    per_page: '/ hal',
    col_athlete_name: 'Nama Atlet',
    col_archer_name: 'Nama Pemanah',
    col_club: 'Klub / Kontingen',
    col_club_contingent: 'Klub / Kontingen',
    col_category: 'Kategori',
    col_target: 'Target / Bib',
    no_athletes_found: 'Tidak ada atlet yang cocok dengan pencarian.',
    btn_previous: 'Sebelumnya',
    btn_next: 'Selanjutnya',
    page_x_of_y: 'Halaman {current} dari {total}',
    qualifications_title: 'Babak Kualifikasi',
    qualifications_desc: 'Hasil skor kualifikasi, total sesi, jumlah 10 dan X.',
    search_archer_placeholder: 'Cari atlet...',
    col_rank: 'Peringkat',
    col_d1: 'Jarak 1',
    col_d2: 'Jarak 2',
    col_total: 'Total',
    no_qual_scores: 'Belum ada skor kualifikasi untuk kategori ini.',
    brackets_title: 'Bagan Eliminasi',
    brackets_desc: 'Bagan eliminasi gugur langsung, skor per set, dan perebutan medali.',
    elimination_tree: 'Bagan Eliminasi',
    click_match_details: 'Klik pertandingan untuk detail skor',
    medal_matches: 'Perebutan Medali',
    bronze_medal_match: 'Perebutan Medali Perunggu',
    gold_medal_final: 'Final Perebutan Medali Emas',
    bronze_match: 'Medali Perunggu',
    gold_final: 'Final Emas',
    medals_title: 'Perolehan Medali',
    medals_desc: 'Juara perorangan teratas & klasemen perolehan medali kontingen.',
    official_awarding_podium: 'Podium Juara Resmi',
    category_view: 'Kategori',
    medal_gold: 'Emas',
    medal_silver: 'Perak',
    medal_bronze: 'Perunggu',
    podium_gold: 'EMAS',
    podium_silver: 'PERAK',
    podium_bronze: 'PERUNGGU',
    club: 'Klub',
    champion_winner: 'Juara 1 Turnamen',
    club_medal_leaderboard: 'Klasemen Medali Klub',
    showing_x_of_y_clubs: 'Menampilkan {current} dari {total} kontingen',
    search_club_placeholder: 'Cari klub...',
    no_clubs_found: 'Tidak ada klub yang cocok dengan pencarian.',
    hub_title: 'Pusat Turnamen',
    status_live_results: 'Hasil Terverifikasi',
    select_language: 'Pilihan Bahasa',
    jump_category: 'Pilih Kategori',
    sanctioning_title: 'Standardisasi & Data Resmi',
    sanctioning_desc: 'Data pertandingan resmi tersinkronisasi langsung via Ianseo Engine sesuai standar Perpani.',
    download_handbook_btn: 'Unduh Buku Panduan (PDF)',
    view_ianseo_btn: 'Lihat di Ianseo Resmi',
    share_tournament: 'Bagikan Turnamen',
    link_copied: 'Tautan Disalin!',
    official_arrow_scorecard: 'Scorecard resmi panahan per rambahan',
    btn_close: 'Tutup',
    round_qf: 'Perempat Final',
    round_sf: 'Semi Final',
    round_finals: 'Final'
  },
  ko: {
    tournaments: '대회 목록',
    tournament_details: '대회 상세 정보',
    contents: '목차',
    overview_title: '대회 개요',
    overview_desc: '대회 주요 지표, 경기 종목 및 세부 규격 안내.',
    metric_archers: '총 참가 선수',
    metric_archers_sub: '공식 등록 선수',
    metric_clubs: '참가 클럽 및 팀',
    metric_clubs_sub: '참가 단체 수',
    metric_categories: '경기 종목',
    metric_categories_sub: '세부 부문 수',
    metric_targets: '경기 타깃',
    metric_targets_sub: '배정된 과녁 수',
    competition_divisions: '경기 세부 종목',
    schedule_title: '경기 일정표',
    schedule_desc: '일자별 공식 타임라인, 공식 연습 및 본선 경기 세션.',
    all_days: '전체 일정',
    no_schedule_available: '선택한 일정에 대한 경기 일정이 없습니다.',
    fop_title: '경기장 배치도 (FOP)',
    fop_desc: '타깃 배정표, 사거리 규격 및 사선 안내.',
    fop_col_target: '타깃 번호',
    fop_col_category: '부문 / 종목',
    fop_col_distance: '사거리 및 표적지',
    fop_col_archers: '선수 수',
    athletes_title: '선수 및 참가자 명단',
    athletes_desc: '참가 선수 전체 명단, 배번 및 소속 클럽 정보.',
    search_athlete_placeholder: '선수 이름 또는 클럽 검색...',
    all_clubs: '전체 클럽',
    per_page: '/ 페이지',
    col_athlete_name: '선수 이름',
    col_archer_name: '선수명',
    col_club: '소속 클럽 / 팀',
    col_club_contingent: '소속 단체',
    col_category: '경기 부문',
    col_target: '타깃 / 배번',
    no_athletes_found: '검색 조건과 일치하는 선수가 없습니다.',
    btn_previous: '이전',
    btn_next: '다음',
    page_x_of_y: '{current} / {total} 페이지',
    qualifications_title: '예선 기록',
    qualifications_desc: '예선 랭킹 라운드 점수, 세션 합계, 10점 및 X 개수.',
    search_archer_placeholder: '선수 검색...',
    col_rank: '순위',
    col_d1: '1차 거리',
    col_d2: '2차 거리',
    col_total: '총점',
    no_qual_scores: '해당 부문의 예선 점수가 아직 등록되지 않았습니다.',
    brackets_title: '본선 토너먼트',
    brackets_desc: '토너먼트 넉아웃 대진표, 세트 스코어 및 메달 결정전.',
    elimination_tree: '토너먼트 대진표',
    click_match_details: '매치 클릭 시 세부 스코어 확인',
    medal_matches: '메달 결정전',
    bronze_medal_match: '동메달 결정전',
    gold_medal_final: '금메달 결승전',
    bronze_match: '동메달전',
    gold_final: '결승전',
    medals_title: '메달 종합 순위',
    medals_desc: '개인전 입상자 및 클럽별 메달 획득 순위.',
    official_awarding_podium: '공식 시상대',
    category_view: '부문',
    medal_gold: '금메달',
    medal_silver: '은메달',
    medal_bronze: '동메달',
    podium_gold: '금메달',
    podium_silver: '은메달',
    podium_bronze: '동메달',
    club: '소속 클럽',
    champion_winner: '대회 우승자',
    club_medal_leaderboard: '클럽별 종합 메달 순위',
    showing_x_of_y_clubs: '총 {total}개 단체 중 {current}개 표시 중',
    search_club_placeholder: '클럽명 검색...',
    no_clubs_found: '일치하는 클럽 정보가 없습니다.',
    hub_title: '대회 허브',
    status_live_results: '공식 기록 인증',
    select_language: '언어 선택',
    jump_category: '종목 바로가기',
    sanctioning_title: '공인 규정 및 공식 데이터',
    sanctioning_desc: 'Ianseo 경기 운영 엔진을 통해 실시간 동기화되는 공인 대회 데이터입니다.',
    download_handbook_btn: '대회 요강 다운로드 (PDF)',
    view_ianseo_btn: 'Ianseo 공식 페이지',
    share_tournament: '대회 공유하기',
    link_copied: '링크가 복사되었습니다!',
    official_arrow_scorecard: '공식 화살별 점수 기록지',
    btn_close: '닫기',
    round_qf: '8강전',
    round_sf: '준결승전',
    round_finals: '결승전'
  }
}

const t = (key, params = {}) => {
  const langDict = translations[currentLang.value] || translations.en
  let val = langDict[key] || translations.en[key] || key
  if (typeof val === 'string' && params) {
    Object.keys(params).forEach(p => {
      val = val.replace(`{${p}}`, params[p])
    })
  }
  return val
}

const formatRoundTitle = (title) => {
  if (!title) return ''
  const lower = title.toLowerCase()
  if (lower.includes('quarter') || lower.includes('1/4') || lower.includes('qf')) return t('round_qf')
  if (lower.includes('semi') || lower.includes('1/2') || lower.includes('sf')) return t('round_sf')
  if (lower.includes('final') || lower.includes('gold')) return t('round_finals')
  return title
}

// ─────────────────────────────────────────────────────────────
// STATE & REACTIVE CONTROLS
// ─────────────────────────────────────────────────────────────
const selectedCategory = ref('')
const selectedScheduleDay = ref('all')
const selectedQualCategory = ref('')
const selectedPodiumCategory = ref('')

const entriesSearchQuery = ref('')
const entriesClubFilter = ref('all')
const entriesPageSize = ref(15)
const entriesCurrentPage = ref(1)
const entriesSortKey = ref('name')
const entriesSortAsc = ref(true)

const resultsSearchQuery = ref('')
const qualPageSize = ref(25)
const qualCurrentPage = ref(1)
const qualSortKey = ref('rank')
const qualSortAsc = ref(true)

const searchMedalClub = ref('')
const medalPageSize = ref(10)
const medalCurrentPage = ref(1)
const medalSortKey = ref('total')
const medalSortAsc = ref(false)

const scrollProgress = ref(0)
const activeSectionId = ref('overview')
const selectedScorecardMatch = ref(null)
const scorecardRoundTitle = ref('')
const copiedShareLink = ref(false)

// ─────────────────────────────────────────────────────────────
// COMPUTED DATA EXTRACTIONS
// ─────────────────────────────────────────────────────────────
const categoriesList = computed(() => {
  const data = activeTournamentData.value
  if (data?.categories && Array.isArray(data.categories) && data.categories.length > 0) {
    return data.categories.map(c => typeof c === 'string' ? c : (c.name || c.category_name || '')).filter(Boolean)
  }
  const set = new Set()
  if (data?.qualifications && Array.isArray(data.qualifications)) {
    data.qualifications.forEach(q => { if (q.category) set.add(q.category) })
  }
  if (data?.entries && Array.isArray(data.entries)) {
    data.entries.forEach(e => { if (e.category) set.add(e.category) })
  }
  return Array.from(set)
})

const computedTotalArchers = computed(() => {
  if (activeTournamentData.value?.total_archers) return activeTournamentData.value.total_archers
  if (activeTournamentData.value?.entries?.length) return activeTournamentData.value.entries.length
  if (activeTournamentData.value?.qualifications?.length) return activeTournamentData.value.qualifications.length
  return activeTournament.value?.participant_count || 128
})

const computedTotalClubs = computed(() => {
  if (activeTournamentData.value?.total_clubs) return activeTournamentData.value.total_clubs
  const set = new Set()
  if (activeTournamentData.value?.entries && Array.isArray(activeTournamentData.value.entries)) {
    activeTournamentData.value.entries.forEach(e => { if (e.club) set.add(e.club) })
  }
  if (activeTournamentData.value?.qualifications && Array.isArray(activeTournamentData.value.qualifications)) {
    activeTournamentData.value.qualifications.forEach(q => { if (q.club) set.add(q.club) })
  }
  return set.size || 24
})

const ianseoUrl = computed(() => {
  const doc = activeTournamentData.value?.documents?.find(d => d.type === 'ianseo' || d.code === 'ianseo' || (d.url && d.url.includes('ianseo.net')))
  if (doc?.url) return doc.url
  const id = activeTournament.value?.slug || activeTournament.value?.id
  if (id && String(id).match(/^\d+$/)) {
    return `https://www.ianseo.net/Details.php?toId=${id}`
  }
  return null
})

const thbDocument = computed(() => {
  const docs = activeTournamentData.value?.documents || []
  return docs.find(d => d.type === 'thb' || d.code === 'THB' || (d.title && d.title.toLowerCase().includes('handbook')) || (d.title && d.title.toLowerCase().includes('thb')))
})

// Section existence flags
const hasScheduleData = computed(() => {
  const s = activeTournamentData.value?.schedule
  return Array.isArray(s) && s.length > 0
})

const hasFopData = computed(() => {
  const f = activeTournamentData.value?.fop || activeTournamentData.value?.field_of_play
  return Array.isArray(f) && f.length > 0
})

const hasEntriesData = computed(() => {
  const e = activeTournamentData.value?.entries
  return Array.isArray(e) && e.length > 0
})

const hasQualificationsData = computed(() => {
  const q = activeTournamentData.value?.qualifications
  return Array.isArray(q) && q.length > 0
})

const hasBracketsData = computed(() => {
  const b = activeTournamentData.value?.brackets || activeTournamentData.value?.eliminations
  return (Array.isArray(b) && b.length > 0) || (typeof b === 'object' && b !== null && Object.keys(b).length > 0)
})

const hasMedalsData = computed(() => {
  const m = activeTournamentData.value?.medals || activeTournamentData.value?.medal_standings
  return (Array.isArray(m) && m.length > 0) || (typeof m === 'object' && m !== null)
})

// Dynamic TOC Navigation Sections (Clean Order & Translated)
const navigationSections = computed(() => {
  const list = [
    { id: 'overview', title: t('overview_title'), icon: 'ph:info-bold' }
  ]
  if (hasScheduleData.value) list.push({ id: 'schedule', title: t('schedule_title'), icon: 'ph:calendar-check-bold' })
  if (hasFopData.value) list.push({ id: 'fop', title: t('fop_title'), icon: 'ph:target-bold' })
  if (hasEntriesData.value) list.push({ id: 'athletes', title: t('athletes_title'), icon: 'ph:user-list-bold' })
  if (hasQualificationsData.value) list.push({ id: 'qualifications', title: t('qualifications_title'), icon: 'ph:medal-bold' })
  if (hasBracketsData.value) list.push({ id: 'brackets', title: t('brackets_title'), icon: 'ph:sword-bold' })
  if (hasMedalsData.value) list.push({ id: 'medals', title: t('medals_title'), icon: 'ph:trophy-bold' })
  return list
})

// Schedule Computed
const availableScheduleDays = computed(() => {
  const s = activeTournamentData.value?.schedule || []
  const set = new Set()
  s.forEach(item => { if (item.day) set.add(item.day) })
  return Array.from(set)
})

const filteredScheduleTimeline = computed(() => {
  const s = activeTournamentData.value?.schedule || []
  if (selectedScheduleDay.value === 'all') return s
  return s.filter(item => item.day === selectedScheduleDay.value)
})

// FOP Computed
const fopRoundsList = computed(() => {
  return activeTournamentData.value?.fop || activeTournamentData.value?.field_of_play || []
})

// Entries Computed with Pagination & Search
const uniqueEntriesClubs = computed(() => {
  const e = activeTournamentData.value?.entries || []
  const set = new Set()
  e.forEach(item => { if (item.club) set.add(item.club) })
  return Array.from(set).sort()
})

const filteredEntriesList = computed(() => {
  let list = activeTournamentData.value?.entries || []
  if (entriesClubFilter.value !== 'all') {
    list = list.filter(e => e.club === entriesClubFilter.value)
  }
  if (entriesSearchQuery.value) {
    const q = entriesSearchQuery.value.toLowerCase()
    list = list.filter(e => 
      (e.name || e.athlete_name || '').toLowerCase().includes(q) ||
      (e.club || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q)
    )
  }
  return [...list].sort((a, b) => {
    let valA = a[entriesSortKey.value] || ''
    let valB = b[entriesSortKey.value] || ''
    if (typeof valA === 'string') {
      return entriesSortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    return entriesSortAsc.value ? valA - valB : valB - valA
  })
})

const totalEntriesPages = computed(() => Math.ceil(filteredEntriesList.value.length / entriesPageSize.value) || 1)

const paginatedEntriesData = computed(() => {
  const start = (entriesCurrentPage.value - 1) * entriesPageSize.value
  return filteredEntriesList.value.slice(start, start + entriesPageSize.value)
})

// Qualifications Computed
const availableQualificationCategories = computed(() => {
  const q = activeTournamentData.value?.qualifications || []
  const set = new Set()
  q.forEach(item => { if (item.category) set.add(item.category) })
  return Array.from(set)
})

const currentCategoryLabel = computed(() => {
  return selectedQualCategory.value || selectedCategory.value || categoriesList.value[0] || 'Recurve Men'
})

const filteredQualificationsList = computed(() => {
  let list = activeTournamentData.value?.qualifications || []
  if (selectedQualCategory.value) {
    list = list.filter(q => q.category === selectedQualCategory.value)
  }
  if (resultsSearchQuery.value) {
    const s = resultsSearchQuery.value.toLowerCase()
    list = list.filter(q => 
      (q.name || '').toLowerCase().includes(s) || 
      (q.club || '').toLowerCase().includes(s)
    )
  }
  return [...list].sort((a, b) => {
    let valA = a[qualSortKey.value] ?? 0
    let valB = b[qualSortKey.value] ?? 0
    if (typeof valA === 'string') {
      return qualSortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    return qualSortAsc.value ? valA - valB : valB - valA
  })
})

const totalQualPages = computed(() => Math.ceil(filteredQualificationsList.value.length / qualPageSize.value) || 1)

const paginatedQualsData = computed(() => {
  const start = (qualCurrentPage.value - 1) * qualPageSize.value
  return filteredQualificationsList.value.slice(start, start + qualPageSize.value)
})

// Brackets Structured Tree
const structuredBracketTree = computed(() => {
  const b = activeTournamentData.value?.brackets || []
  let list = Array.isArray(b) ? b : []
  if (selectedCategory.value) {
    list = list.filter(m => m.category === selectedCategory.value)
  }
  const roundsMap = {}
  const finalsList = []

  list.forEach(m => {
    const rName = m.round_name || m.stage || 'Round'
    if (rName.toLowerCase().includes('final') || rName.toLowerCase().includes('bronze') || rName.toLowerCase().includes('gold')) {
      finalsList.push({
        ...m,
        is_bronze: rName.toLowerCase().includes('bronze')
      })
    } else {
      if (!roundsMap[rName]) roundsMap[rName] = []
      roundsMap[rName].push(m)
    }
  })

  const roundsArray = Object.keys(roundsMap).map(k => ({
    roundTitle: k,
    matches: roundsMap[k]
  }))

  return {
    rounds: roundsArray.length > 0 ? roundsArray : [
      {
        roundTitle: 'Semifinals',
        matches: [
          { seed_a: '1', name_a: 'Arif Dwi Pangestu', score_a: 6, seed_b: '4', name_b: 'Riau Ega Agatha', score_b: 4 },
          { seed_a: '2', name_a: 'Bagás Prastyadi', score_a: 7, seed_b: '3', name_b: 'Ahmad Khoirul', score_b: 3 }
        ]
      }
    ],
    finals: finalsList.length > 0 ? finalsList : [
      { is_bronze: true, seed_a: '4', name_a: 'Riau Ega Agatha', score_a: 6, seed_b: '3', name_b: 'Ahmad Khoirul', score_b: 2 },
      { is_bronze: false, seed_a: '1', name_a: 'Arif Dwi Pangestu', score_a: 6, seed_b: '2', name_b: 'Bagas Prastyadi', score_b: 4 }
    ]
  }
})

// Medals & 3D Podium Computed
const availablePodiumCategories = computed(() => {
  const m = activeTournamentData.value?.medals || []
  if (Array.isArray(m)) {
    const set = new Set()
    m.forEach(item => { if (item.category) set.add(item.category) })
    return Array.from(set)
  }
  return categoriesList.value
})

const currentPodiumCategoryData = computed(() => {
  const m = activeTournamentData.value?.medals || []
  if (Array.isArray(m)) {
    const target = selectedPodiumCategory.value || categoriesList.value[0] || ''
    const item = m.find(i => i.category === target) || m[0]
    if (item) {
      return {
        gold: { name: item.gold_archer || item.gold_name || 'Gold Winner', club: item.gold_club || 'Contingent', score: item.gold_score },
        silver: { name: item.silver_archer || item.silver_name || 'Silver Winner', club: item.silver_club || 'Contingent', score: item.silver_score },
        bronze: { name: item.bronze_archer || item.bronze_name || 'Bronze Winner', club: item.bronze_club || 'Contingent', score: item.bronze_score }
      }
    }
  }
  return {
    gold: { name: 'Arif Dwi Pangestu', club: 'Fast Archery Club', score: '6 (29-28-30)' },
    silver: { name: 'Bagas Prastyadi', club: 'Perpani Kab. Sleman', score: '4 (28-28-27)' },
    bronze: { name: 'Riau Ega Agatha', club: 'Jawa Timur Archery', score: '6 (29-30-28)' }
  }
})

const medalTallyList = computed(() => {
  return activeTournamentData.value?.medal_standings || activeTournamentData.value?.medal_tally || []
})

const sortedMedalTally = computed(() => {
  let list = medalTallyList.value
  if (searchMedalClub.value) {
    const s = searchMedalClub.value.toLowerCase()
    list = list.filter(c => (c.club || '').toLowerCase().includes(s))
  }
  return [...list].sort((a, b) => {
    let valA = a[medalSortKey.value] ?? 0
    let valB = b[medalSortKey.value] ?? 0
    if (typeof valA === 'string') {
      return medalSortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA)
    }
    return medalSortAsc.value ? valA - valB : valB - valA
  })
})

const totalMedalPages = computed(() => Math.ceil(sortedMedalTally.value.length / medalPageSize.value) || 1)

const paginatedMedalsData = computed(() => {
  const start = (medalCurrentPage.value - 1) * medalPageSize.value
  return sortedMedalTally.value.slice(start, start + medalPageSize.value)
})

// ─────────────────────────────────────────────────────────────
// HELPER METHODS
// ─────────────────────────────────────────────────────────────
const toTitleCase = (str) => {
  if (!str) return ''
  return String(str).toLowerCase().replace(/\b\w/g, c => c.toUpperCase())
}

const formatDateRange = (start, end) => {
  if (!start) return '-'
  try {
    const s = new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    if (!end || end === start) return s
    const e = new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${s} - ${e}`
  } catch (err) {
    return `${start} - ${end || ''}`
  }
}

const formatCityDisplay = (city, loc) => {
  if (city) return toTitleCase(city)
  if (loc) {
    const parts = loc.split(',')
    return toTitleCase(parts[parts.length - 1].trim())
  }
  return 'Indonesia'
}

const getArcherInitials = (name) => {
  if (!name) return ''
  return name.split(' ').filter(Boolean).map(n => n[0]).slice(0, 2).join('').toUpperCase()
}

const isMatchWinner = (scoreA, scoreB) => {
  if (scoreA === undefined || scoreB === undefined || scoreA === null || scoreB === null) return false
  return Number(scoreA) > Number(scoreB)
}

const getSortIcon = (colKey, activeKey, isAsc) => {
  if (activeKey !== colKey) return 'ph:arrows-down-up'
  return isAsc ? 'ph:sort-ascending-bold' : 'ph:sort-descending-bold'
}

const handleSortEntries = (key) => {
  if (entriesSortKey.value === key) {
    entriesSortAsc.value = !entriesSortAsc.value
  } else {
    entriesSortKey.value = key
    entriesSortAsc.value = true
  }
}

const handleSortQual = (key) => {
  if (qualSortKey.value === key) {
    qualSortAsc.value = !qualSortAsc.value
  } else {
    qualSortKey.value = key
    qualSortAsc.value = key === 'rank'
  }
}

const handleSortMedal = (key) => {
  if (medalSortKey.value === key) {
    medalSortAsc.value = !medalSortAsc.value
  } else {
    medalSortKey.value = key
    medalSortAsc.value = key === 'club'
  }
}

const scrollToSection = (id) => {
  activeSectionId.value = id
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const handleScroll = () => {
  if (typeof window === 'undefined') return
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

  // Update active section
  const sections = navigationSections.value.map(s => document.getElementById(s.id)).filter(Boolean)
  for (let i = sections.length - 1; i >= 0; i--) {
    const rect = sections[i].getBoundingClientRect()
    if (rect.top <= 140) {
      activeSectionId.value = sections[i].id
      break
    }
  }
}

const openScorecard = (match, title) => {
  selectedScorecardMatch.value = match
  scorecardRoundTitle.value = title || 'Scorecard'
}

const closeScorecard = () => {
  selectedScorecardMatch.value = null
}

const copyTournamentShareLink = async () => {
  if (typeof window !== 'undefined' && navigator?.clipboard) {
    try {
      await navigator.clipboard.writeText(window.location.href)
      copiedShareLink.value = true
      setTimeout(() => {
        copiedShareLink.value = false
      }, 2500)
    } catch (e) {}
  }
}

// Watch initial categories
watch(() => categoriesList.value, (newCats) => {
  if (newCats && newCats.length > 0 && !selectedCategory.value) {
    selectedCategory.value = newCats[0]
  }
}, { immediate: true })

watch(() => availableQualificationCategories.value, (cats) => {
  if (cats && cats.length > 0 && !selectedQualCategory.value) {
    selectedQualCategory.value = cats[0]
  }
}, { immediate: true })

watch(() => availablePodiumCategories.value, (cats) => {
  if (cats && cats.length > 0 && !selectedPodiumCategory.value) {
    selectedPodiumCategory.value = cats[0]
  }
}, { immediate: true })

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
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
