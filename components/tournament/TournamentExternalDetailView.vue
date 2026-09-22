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
        <!-- Breadcrumbs Navigation -->
        <div class="mb-4">
          <Breadcrumbs 
            :items="[{ label: t('tournaments'), path: '/tournaments' }]" 
            :current="toTitleCase(activeTournament?.name) || t('tournament_details')" 
            class="!text-slate-300 text-xs sm:text-sm" 
          />
        </div>

        <div class="w-full space-y-3">
          <!-- Tournament Title (H1) -->
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight font-display">
            {{ toTitleCase(activeTournament?.name) }}
          </h1>

          <!-- Meta Information Row (3 Items) -->
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
    <!-- UNIFIED SINGLE CONTAINER -->
    <!-- ========================================================================= -->
    <main class="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 sm:py-8">
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <div class="grid grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          
          <!-- ── COLUMN 1: LEFT TOC (STICKY TOP-24 BELOW NAVBAR, NATIVE HREF LINKS) ── -->
          <aside class="col-span-12 lg:col-span-2 p-5 sm:p-6 bg-slate-50/30 lg:bg-transparent rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl">
            <div class="sticky top-20 sm:top-24 space-y-3">
              <div class="text-xs sm:text-sm font-bold text-slate-400 font-display pl-2.5">
                {{ t('contents') }}
              </div>

              <!-- Dynamic TOC Href Links in Logical Order -->
              <nav class="space-y-1">
                <a
                  v-for="sec in navigationSections"
                  :key="sec.id"
                  :href="`#${sec.id}`"
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
                <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0 section-badge-icon"><Icon icon="ph:info-bold" class="size-5 text-navy" /></div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('overview_title') }}
                  </h2>
                  <div class="text-xs sm:text-sm text-slate-500 mt-0.5 leading-normal">{{ t('overview_desc') }}</div>
                </div>
              </div>

              <!-- Tournament Overview Description (Clean Natural Prose - 14px mobile, 16px desktop) -->
              <div v-if="tournamentDescriptionParagraphs.length > 0" class="text-sm sm:text-base text-slate-600 leading-relaxed space-y-3 pt-0.5">
                <div v-for="(paragraph, pIdx) in tournamentDescriptionParagraphs" :key="pIdx" class="text-justify font-normal">
                  {{ paragraph }}
                </div>
              </div>

              <!-- Quick Metrics 4 Cards Grid with UNIFIED Typography -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs sm:text-sm font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 inline-flex items-center justify-center shrink-0 aspect-square leading-none p-0 overflow-hidden"><Icon icon="ph:users-three" class="size-3.5 text-navy shrink-0 m-auto block" /></div>
                    <span>{{ t('metric_archers') }}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold font-display text-navy mt-1.5">
                    {{ computedTotalArchers }}
                  </div>
                  <div class="text-[11px] sm:text-xs text-slate-400 mt-0.5">{{ t('metric_archers_sub') }}</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs sm:text-sm font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 inline-flex items-center justify-center shrink-0 aspect-square leading-none p-0 overflow-hidden"><Icon icon="ph:shield-chevron" class="size-3.5 text-navy shrink-0 m-auto block" /></div>
                    <span>{{ t('metric_clubs') }}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold font-display text-navy mt-1.5">
                    {{ computedTotalClubs }}
                  </div>
                  <div class="text-[11px] sm:text-xs text-slate-400 mt-0.5">{{ t('metric_clubs_sub') }}</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs sm:text-sm font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 inline-flex items-center justify-center shrink-0 aspect-square leading-none p-0 overflow-hidden"><Icon icon="ph:crosshair" class="size-3.5 text-navy shrink-0 m-auto block" /></div>
                    <span>{{ t('metric_categories') }}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold font-display text-navy mt-1.5">
                    {{ categoriesList.length }}
                  </div>
                  <div class="text-[11px] sm:text-xs text-slate-400 mt-0.5">{{ t('metric_categories_sub') }}</div>
                </div>

                <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                  <div class="flex items-center gap-2 text-slate-600 text-xs sm:text-sm font-semibold">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy border border-primary/30 inline-flex items-center justify-center shrink-0 aspect-square leading-none p-0 overflow-hidden"><Icon icon="ph:target" class="size-3.5 text-navy shrink-0 m-auto block" /></div>
                    <span>{{ t('metric_targets') }}</span>
                  </div>
                  <div class="text-xl sm:text-2xl font-bold font-display text-navy mt-1.5">
                    {{ computedFopTargetCount > 0 ? computedFopTargetCount : '-' }}
                  </div>
                  <div class="text-[11px] sm:text-xs text-slate-400 mt-0.5">{{ t('metric_targets_sub') }}</div>
                </div>
              </div>
            </section>

            <!-- 2. COMPETITION SCHEDULE -->
            <section v-if="hasScheduleData" id="schedule" class="scroll-mt-24 space-y-6">
              <!-- Section Header -->
              <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                <div class="flex items-center gap-3">
                  <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0 section-badge-icon">
                    <Icon icon="ph:calendar-check-bold" class="size-5 text-navy" />
                  </div>
                  <div>
                    <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                      {{ t('schedule_title') }}
                    </h2>
                    <div class="text-xs sm:text-sm text-slate-500 mt-0.5 leading-normal">{{ t('schedule_desc') }}</div>
                  </div>
                </div>
                <div class="hidden sm:flex items-center gap-2">
                  <span class="text-xs sm:text-sm font-semibold text-slate-400">Total Program Events:</span>
                  <span class="px-2.5 py-0.5 rounded-full bg-navy/5 text-navy text-xs sm:text-sm font-bold font-sans">
                    {{ totalScheduleEventsCount }}
                  </span>
                </div>
              </div>

              <!-- Day & Date Ribbon (Horizontal Scrolling) -->
              <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                <button
                  v-for="(day, dIdx) in parsedScheduleDays"
                  :key="day.date_label"
                  @click="selectedScheduleDay = day.date_label"
                  :class="[
                    'flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer border',
                    (selectedScheduleDay || parsedScheduleDays[0]?.date_label) === day.date_label
                      ? 'bg-navy text-white border-navy shadow-xs font-black'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  ]"
                >
                  <Icon icon="ph:calendar-blank-bold" class="text-sm" />
                  <span>{{ day.date_label }}</span>
                  <span
                    :class="[
                      'px-1.5 py-0.2 rounded-md text-[10px] sm:text-xs font-bold',
                      (selectedScheduleDay || parsedScheduleDays[0]?.date_label) === day.date_label ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    ]"
                  >
                    {{ day.sessions.length }}
                  </span>
                </button>
              </div>

              <!-- Schedule Days & Timetable List -->
              <div class="space-y-6">
                <div 
                  v-for="day in filteredScheduleDays" 
                  :key="day.date_label" 
                  class="space-y-3"
                >
                  <!-- Day Header Banner -->
                  <div class="bg-slate-100/80 rounded-2xl px-4 py-2.5 flex items-center justify-between border border-slate-200/60">
                    <div class="flex items-center gap-2">
                      <Icon icon="ph:calendar-dots-bold" class="text-navy text-base" />
                      <span class="text-xs sm:text-sm font-bold text-navy">{{ day.date_label }}</span>
                      <span v-if="day.divisions" class="hidden sm:inline-block px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-xs font-semibold">
                        {{ day.divisions }}
                      </span>
                    </div>
                    <span class="text-xs sm:text-sm font-bold text-slate-500">
                      {{ day.sessions.length }} Agenda
                    </span>
                  </div>

                  <!-- Session Items -->
                  <div class="space-y-2.5">
                    <div
                      v-for="(session, sIdx) in day.sessions"
                      :key="sIdx"
                      :class="[
                        'rounded-2xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border',
                        session.type === 'break' 
                          ? 'bg-amber-50/40 border-dashed border-amber-200' 
                          : (session.type === 'finals' 
                              ? 'bg-gradient-to-r from-amber-50/40 via-white to-white border-amber-300 shadow-2xs hover:shadow-sm' 
                              : (session.type === 'ceremony'
                                  ? 'bg-gradient-to-r from-amber-50/60 via-amber-50/20 to-white border-amber-200 shadow-2xs'
                                  : 'bg-white border-slate-200/90 shadow-2xs hover:border-navy/30 hover:shadow-xs'))
                      ]"
                    >
                      <!-- Left: Time & Icon Box -->
                      <div class="flex items-center gap-3 shrink-0 sm:w-60">
                        <!-- Icon Avatar Box based on Type -->
                        <div 
                          :class="[
                            'size-11 rounded-xl flex items-center justify-center font-bold border shrink-0 text-base shadow-2xs',
                            session.type === 'break' ? 'bg-amber-100 text-amber-800 border-amber-300/80' :
                            session.type === 'finals' ? 'bg-amber-500 text-slate-900 border-amber-400' :
                            session.type === 'elimination' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                            session.type === 'team' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                            session.type === 'qualification' ? 'bg-primary/20 text-navy border-primary/30' :
                            session.type === 'practice' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            session.type === 'ceremony' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                            session.type === 'meeting' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          ]"
                        >
                          <Icon v-if="session.type === 'break'" icon="ph:coffee-bold" />
                          <Icon v-else-if="session.type === 'finals'" icon="ph:crown-fill" />
                          <Icon v-else-if="session.type === 'elimination'" icon="ph:sword-bold" />
                          <Icon v-else-if="session.type === 'team'" icon="ph:users-three-bold" />
                          <Icon v-else-if="session.type === 'qualification'" icon="ph:target-bold" />
                          <Icon v-else-if="session.type === 'practice'" icon="ph:crosshair-bold" />
                          <Icon v-else-if="session.type === 'ceremony'" icon="ph:trophy-bold" />
                          <Icon v-else-if="session.type === 'meeting'" icon="ph:clipboard-text-bold" />
                          <Icon v-else icon="ph:clock-bold" />
                        </div>

                        <!-- Time & Duration -->
                        <div>
                          <div class="flex items-center gap-1.5 font-bold text-navy text-xs sm:text-sm">
                            <span>{{ session.time_start }}</span>
                            <template v-if="session.time_end && session.time_end !== 'Selesai'">
                              <span class="text-slate-400">-</span>
                              <span>{{ session.time_end }}</span>
                            </template>
                            <span v-else-if="session.time_end === 'Selesai'" class="text-[10px] sm:text-xs px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-semibold">
                              Selesai
                            </span>
                          </div>
                          <div v-if="session.duration && session.duration !== 'Selesai'" class="text-[11px] sm:text-xs font-medium text-slate-500 mt-0.5 flex items-center gap-1">
                            <Icon icon="ph:timer" class="text-xs sm:text-sm" />
                            <span>{{ session.duration }}</span>
                          </div>
                        </div>
                      </div>

                      <!-- Middle: Title, Stage Badge & Notes -->
                      <div class="flex-1 space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-4">
                        <div class="flex flex-wrap items-center gap-2">
                          <span 
                            v-if="session.stage" 
                            :class="[
                              'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold tracking-wide uppercase',
                              session.type === 'finals' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                              session.type === 'elimination' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                              session.type === 'qualification' ? 'bg-primary/20 text-navy border border-primary/30' :
                              session.type === 'ceremony' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                              session.type === 'break' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                              session.type === 'meeting' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                              'bg-slate-100 text-slate-700 border border-slate-200'
                            ]"
                          >
                            {{ session.stage }}
                          </span>
                        </div>
                        <div class="font-bold text-xs sm:text-sm text-navy leading-snug">
                          {{ session.title }}
                        </div>
                        <div v-if="session.notes" class="flex flex-wrap items-center gap-1.5">
                          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] sm:text-xs font-semibold">
                            <Icon icon="ph:info" class="text-slate-400 text-xs sm:text-sm" />
                            <span>{{ session.notes }}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="filteredScheduleDays.length === 0" class="text-center py-12 rounded-2xl bg-white border border-slate-200/80 text-slate-400 text-xs sm:text-sm space-y-2">
                  <Icon icon="ph:calendar-x" class="text-4xl mx-auto text-slate-300" />
                  <div class="font-medium text-slate-600">Tidak ada jadwal pertandingan untuk pilihan ini.</div>
                </div>
              </div>
            </section>

            <!-- 3. FIELD OF PLAY (FOP LAYOUT) -->
            <section v-if="hasFopData" id="fop" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0 section-badge-icon"><Icon icon="ph:target-bold" class="size-5 text-navy" /></div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('fop_title') }}
                  </h2>
                  <div class="text-xs sm:text-sm text-slate-500 mt-0.5 leading-normal">{{ t('fop_desc') }}</div>
                </div>
              </div>

              <!-- 2.5D Isometric Stadium Visualizer -->
              <TournamentFieldOfPlayVisualizer
                :tournament="activeTournament"
                :tournament-data="activeTournamentData"
                :fop-data="activeTournamentData?.field_of_play"
              />
            </section>

            <!-- 4. ATHLETES & ENTRIES -->
            <section v-if="hasEntriesData" id="athletes" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0 section-badge-icon"><Icon icon="ph:users-four-bold" class="size-5 text-navy" /></div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('athletes_title') }}
                  </h2>
                  <div class="text-xs sm:text-sm text-slate-500 mt-0.5 leading-normal">{{ t('athletes_desc') }}</div>
                </div>
              </div>

              <!-- Filter & Search Controls (No Native Selects!) -->
              <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <!-- Search Input -->
                <div class="relative flex-1">
                  <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    v-model="entriesSearchQuery"
                    type="text"
                    :placeholder="t('search_athlete_placeholder')"
                    class="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-navy focus:bg-white transition-all"
                  />
                  <button
                    v-if="entriesSearchQuery"
                    @click="entriesSearchQuery = ''"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy cursor-pointer"
                  >
                    <Icon icon="ph:x-circle-fill" class="text-sm" />
                  </button>
                </div>

                <!-- Custom Club Filter Dropdown (Non-Native) -->
                <div class="relative shrink-0" v-click-outside="() => showClubDropdown = false">
                  <button
                    type="button"
                    @click="showClubDropdown = !showClubDropdown"
                    class="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between gap-2.5 transition-all cursor-pointer min-w-[170px]"
                  >
                    <div class="flex items-center gap-1.5 truncate">
                      <Icon icon="ph:shield-chevron" class="text-primary text-sm shrink-0" />
                      <span class="truncate">{{ entriesClubFilter === 'all' ? t('filter_club_all') : toTitleCase(entriesClubFilter) }}</span>
                    </div>
                    <Icon :icon="showClubDropdown ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" class="text-xs text-slate-400 shrink-0" />
                  </button>

                  <!-- Custom Popover Menu -->
                  <div
                    v-if="showClubDropdown"
                    class="absolute right-0 top-full mt-1.5 z-40 w-64 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                  >
                    <button
                      type="button"
                      @click="entriesClubFilter = 'all'; showClubDropdown = false; entriesCurrentPage = 1"
                      :class="[
                        'w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-left font-medium transition-all flex items-center justify-between cursor-pointer',
                        entriesClubFilter === 'all' ? 'bg-primary/20 text-navy font-bold' : 'text-slate-700 hover:bg-slate-50'
                      ]"
                    >
                      <span class="truncate">{{ t('filter_club_all') }}</span>
                      <Icon v-if="entriesClubFilter === 'all'" icon="ph:check-bold" class="text-navy text-xs" />
                    </button>
                    <button
                      v-for="club in uniqueEntriesClubs"
                      :key="club"
                      type="button"
                      @click="entriesClubFilter = club; showClubDropdown = false; entriesCurrentPage = 1"
                      :class="[
                        'w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-left font-medium transition-all flex items-center justify-between cursor-pointer',
                        entriesClubFilter === club ? 'bg-primary/20 text-navy font-bold' : 'text-slate-700 hover:bg-slate-50'
                      ]"
                    >
                      <span class="truncate">{{ club }}</span>
                      <Icon v-if="entriesClubFilter === club" icon="ph:check-bold" class="text-navy text-xs" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Entries Table Container -->
              <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs sm:text-sm border-collapse">
                    <thead class="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold text-xs sm:text-sm">
                      <tr>
                        <th @click="handleSortEntries('index')" class="py-3 px-3 w-12 min-w-[48px] text-center whitespace-nowrap cursor-pointer hover:text-navy select-none">
                          <div class="flex items-center justify-center gap-1">
                            <span>#</span>
                            <Icon :icon="getSortIcon('index', entriesSortKey, entriesSortAsc)" class="text-xs" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('target')" class="py-3 px-3 cursor-pointer hover:text-navy select-none w-24 min-w-[80px] text-center whitespace-nowrap">
                          <div class="flex items-center justify-center gap-1">
                            <span>{{ t('col_target') }}</span>
                            <Icon :icon="getSortIcon('target', entriesSortKey, entriesSortAsc)" class="text-xs shrink-0" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('bib')" class="py-3 px-3 cursor-pointer hover:text-navy select-none w-24 min-w-[80px] text-center whitespace-nowrap">
                          <div class="flex items-center justify-center gap-1">
                            <span>{{ t('col_bib') }}</span>
                            <Icon :icon="getSortIcon('bib', entriesSortKey, entriesSortAsc)" class="text-xs shrink-0" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('name')" class="py-3 px-4 cursor-pointer hover:text-navy select-none min-w-[200px] whitespace-nowrap">
                          <div class="flex items-center gap-1.5 whitespace-nowrap">
                            <span>{{ t('col_name') }}</span>
                            <Icon :icon="getSortIcon('name', entriesSortKey, entriesSortAsc)" class="text-xs shrink-0" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('club')" class="py-3 px-4 cursor-pointer hover:text-navy select-none min-w-[220px] whitespace-nowrap">
                          <div class="flex items-center gap-1.5 whitespace-nowrap">
                            <span>{{ t('col_club') }}</span>
                            <Icon :icon="getSortIcon('club', entriesSortKey, entriesSortAsc)" class="text-xs shrink-0" />
                          </div>
                        </th>
                        <th @click="handleSortEntries('category')" class="py-3 px-4 cursor-pointer hover:text-navy select-none min-w-[200px] whitespace-nowrap">
                          <div class="flex items-center gap-1.5 whitespace-nowrap">
                            <span>{{ t('col_category') }}</span>
                            <Icon :icon="getSortIcon('category', entriesSortKey, entriesSortAsc)" class="text-xs shrink-0" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                      <tr
                        v-for="(athlete, idx) in paginatedEntriesData"
                        :key="idx"
                        class="hover:bg-slate-50/60 transition-colors"
                      >
                        <!-- Index -->
                        <td class="py-3 px-3 text-center text-slate-400 font-mono text-xs whitespace-nowrap">
                          {{ (entriesCurrentPage - 1) * entriesPageSize + idx + 1 }}
                        </td>
                        <!-- Target / Lane -->
                        <td class="py-3 px-3 text-center whitespace-nowrap">
                          <span v-if="athlete.target" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs">
                            {{ athlete.target }}
                          </span>
                          <span v-else class="text-slate-300 font-mono text-xs">-</span>
                        </td>
                        <!-- BIB / ID -->
                        <td class="py-3 px-3 text-center whitespace-nowrap">
                          <span v-if="athlete.bib" class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {{ athlete.bib }}
                          </span>
                          <span v-else class="text-slate-300 font-mono text-xs">-</span>
                        </td>
                        <!-- Athlete Name -->
                        <td class="py-3 px-4 whitespace-nowrap">
                          <div class="flex items-center gap-2.5">
                            <div class="size-7 sm:size-8 rounded-full bg-navy/10 text-navy font-bold text-xs flex items-center justify-center shrink-0">
                              {{ getArcherInitials(athlete.name || athlete.athlete_name) }}
                            </div>
                            <span class="font-bold text-navy whitespace-nowrap">
                              {{ toTitleCase(athlete.name || athlete.athlete_name) }}
                            </span>
                          </div>
                        </td>
                        <!-- Club & Code -->
                        <td class="py-3 px-4 whitespace-nowrap">
                          <div class="flex items-center gap-1.5">
                            <span v-if="athlete.code || athlete.club_code" class="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200 shrink-0">
                              {{ athlete.code || athlete.club_code }}
                            </span>
                            <span class="text-slate-700 font-medium whitespace-nowrap">
                              {{ toTitleCase(athlete.club || athlete.club_name || athlete.country || '-') }}
                            </span>
                          </div>
                        </td>
                        <!-- Division / Category -->
                        <td class="py-3 px-4 whitespace-nowrap">
                          <span class="inline-block px-2.5 py-1 rounded-lg bg-navy/5 text-navy font-semibold text-xs whitespace-nowrap">
                            {{ athlete.category || '-' }}
                          </span>
                        </td>
                      </tr>

                      <tr v-if="paginatedEntriesData.length === 0">
                        <td colspan="6" class="py-8 text-center text-slate-400">
                          {{ t('no_entries_found') }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- TABLE FOOTER (ITEMS PER PAGE + PAGINATION ON FOOTER!) -->
                <div class="p-3.5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                  <!-- Custom Items Per Page Dropdown / Pills -->
                  <div class="flex items-center gap-2">
                    <span class="text-slate-500 font-medium">{{ t('items_per_page') }}:</span>
                    <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                      <button
                        v-for="size in [10, 15, 25, 50]"
                        :key="size"
                        type="button"
                        @click="entriesPageSize = size; entriesCurrentPage = 1"
                        :class="[
                          'px-2 py-0.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                          entriesPageSize === size
                            ? 'bg-navy text-white shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                        ]"
                      >
                        {{ size }}
                      </button>
                    </div>
                  </div>

                  <!-- Center: Summary Info -->
                  <div class="text-slate-500 font-medium">
                    {{ t('showing_x_of_y_entries', { current: paginatedEntriesData.length, total: filteredEntries.length }) }}
                  </div>

                  <!-- Right: Prev / Next Buttons -->
                  <div class="flex items-center gap-1">
                    <button
                      :disabled="entriesCurrentPage <= 1"
                      @click="entriesCurrentPage--"
                      class="px-3 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      {{ t('prev_page') }}
                    </button>
                    <span class="px-2 font-bold text-navy">
                      {{ entriesCurrentPage }} / {{ totalEntriesPages }}
                    </span>
                    <button
                      :disabled="entriesCurrentPage >= totalEntriesPages"
                      @click="entriesCurrentPage++"
                      class="px-3 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                    >
                      {{ t('next_page') }}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- 5. QUALIFICATION RESULTS -->
            <section v-if="hasQualificationsData" id="qualifications" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0 section-badge-icon"><Icon icon="ph:medal-bold" class="size-5 text-navy" /></div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('qualifications_title') }}
                  </h2>
                  <div class="text-xs sm:text-sm text-slate-500 mt-0.5 leading-normal">{{ t('qualifications_desc') }}</div>
                </div>
              </div>

              <!-- Unified External Table Component for Qualification Results -->
              <TournamentExternalDataTable
                :columns="qualColumns"
                :items="paginatedQualScores"
                :total-items="filteredQualScores.length"
                :current-page="qualCurrentPage"
                :page-size="qualPageSize"
                :page-size-options="[10, 20, 30, 50]"
                :show-search="true"
                v-model:modelValueSearch="resultsSearchQuery"
                :search-placeholder="t('search_athlete_placeholder')"
                :sort-key="qualSortKey"
                :sort-asc="qualSortAsc"
                @sort="handleSortQual"
                @update:currentPage="qualCurrentPage = $event"
                @update:pageSize="qualPageSize = $event"
                :empty-text="t('no_qual_scores')"
                :summary-text="t('showing_x_of_y_scores', { current: paginatedQualScores.length, total: filteredQualScores.length })"
                :items-per-page-label="t('items_per_page')"
                :prev-page-label="t('prev_page')"
                :next-page-label="t('next_page')"
              >
                <!-- Category Filter Pills Slot -->
                <template #categories>
                  <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                    <button
                      v-for="cat in availableQualificationCategories"
                      :key="cat"
                      @click="selectedQualCategory = cat; qualCurrentPage = 1"
                      :class="[
                        'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer',
                        selectedQualCategory === cat
                          ? 'bg-navy text-white shadow-xs font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      ]"
                    >
                      {{ toTitleCase(cat) }}
                    </button>
                  </div>
                </template>

                <!-- Custom Cell: Rank -->
                <template #cell-rank="{ item, rowIndex }">
                  <span
                    :class="[
                      'inline-flex items-center justify-center size-6 sm:size-7 rounded-full text-xs sm:text-sm font-mono font-bold',
                      item.rank === 1 ? 'bg-amber-100 text-amber-800 font-black' : '',
                      item.rank === 2 ? 'bg-slate-200 text-slate-700 font-black' : '',
                      item.rank === 3 ? 'bg-amber-700/20 text-amber-900 font-black' : 'text-navy'
                    ]"
                  >
                    {{ item.rank || rowIndex }}
                  </span>
                </template>

                <!-- Custom Cell: Name -->
                <template #cell-name="{ item }">
                  <div class="flex items-center gap-2">
                    <span v-if="item.target" class="font-mono text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold shrink-0">
                      {{ item.target }}
                    </span>
                    <span class="font-bold text-navy whitespace-nowrap">
                      {{ toTitleCase(item.name || item.athlete_name) }}
                    </span>
                  </div>
                </template>

                <!-- Custom Cell: Club -->
                <template #cell-club="{ item }">
                  <span class="text-slate-600 font-medium">
                    {{ toTitleCase(item.club || item.country || '-') }}
                  </span>
                </template>

                <!-- Custom Cell: Distance 1 -->
                <template #cell-distance_1="{ item }">
                  <span class="font-mono text-slate-600 text-xs sm:text-sm">
                    {{ item.distance_1 || '-' }}
                  </span>
                </template>

                <!-- Custom Cell: Distance 2 -->
                <template #cell-distance_2="{ item }">
                  <span class="font-mono text-slate-600 text-xs sm:text-sm">
                    {{ item.distance_2 || '-' }}
                  </span>
                </template>

                <!-- Custom Cell: Score -->
                <template #cell-score="{ item }">
                  <span class="font-mono font-bold text-navy text-sm sm:text-base">
                    {{ item.score ?? item.total_score ?? item.total ?? '-' }}
                  </span>
                </template>

                <!-- Custom Cell: 10s -->
                <template #cell-tens="{ item }">
                  <span class="font-mono text-slate-500 text-xs sm:text-sm">
                    {{ item.tens ?? item['10s'] ?? item.tens_count ?? '-' }}
                  </span>
                </template>

                <!-- Custom Cell: Xs -->
                <template #cell-xs="{ item }">
                  <span class="font-mono text-slate-500 text-xs sm:text-sm">
                    {{ item.xs ?? item['xs'] ?? item.x_count ?? '-' }}
                  </span>
                </template>
              </TournamentExternalDataTable>
            </section>

            <!-- 6. ELIMINATION BRACKETS (REUSABLE ARCHERIS BRACKET COMPONENT) -->
            <section v-if="hasBracketsData" id="brackets" class="scroll-mt-24 space-y-5">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0 section-badge-icon"><Icon icon="ph:sword-bold" class="size-5 text-navy" /></div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('brackets_title') }}
                  </h2>
                  <div class="text-xs sm:text-sm text-slate-500 mt-0.5 leading-normal">{{ t('brackets_desc') }}</div>
                </div>
              </div>

              <!-- Match Type Filter Chips (Single, Team, Mix) -->
              <div v-if="availableBracketTypes.length > 1" class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100">
                <button
                  v-for="bType in availableBracketTypes"
                  :key="bType"
                  type="button"
                  @click="selectedBracketType = bType; selectedBracketCategory = ''"
                  :class="[
                    'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0',
                    (selectedBracketType || 'single') === bType
                      ? 'bg-navy text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  ]"
                >
                  <Icon 
                    :icon="bType === 'single' ? 'ph:user-bold' : (bType === 'team' ? 'ph:users-three-bold' : 'ph:users-bold')" 
                    class="text-xs sm:text-sm" 
                  />
                  <span>{{ bType === 'single' ? t('bracket_type_single') : (bType === 'team' ? t('bracket_type_team') : t('bracket_type_mix')) }}</span>
                  <span 
                    :class="[
                      'text-[10px] sm:text-xs px-1.5 py-0.2 rounded-full font-bold',
                      (selectedBracketType || 'single') === bType ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    ]"
                  >
                    {{ allBracketCategories.filter(c => getCategoryBracketType(c) === bType).length }}
                  </span>
                </button>
              </div>

              <!-- Category Filter Chips (Single Line Horizontal Scroll) -->
              <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  v-for="cat in availableBracketCategories"
                  :key="cat"
                  @click="selectedBracketCategory = cat"
                  :class="[
                    'px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer',
                    (selectedBracketCategory || availableBracketCategories[0]) === cat
                      ? 'bg-navy text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  ]"
                >
                  {{ toTitleCase(cat) }}
                </button>
              </div>

              <!-- Public Elimination Bracket Visual Component -->
              <div class="border border-slate-200/80 rounded-2xl p-4 sm:p-6 bg-slate-50/30 overflow-x-auto">
                <div v-if="hasCurrentBracketRounds">
                  <ExternalEliminationBracket
                    :rounds="currentArcherisBracketRounds"
                    :config="currentArcherisBracketConfig"
                    :tournament-slug="tournamentId"
                    :category-name="selectedBracketCategory || availableBracketCategories[0]"
                  />
                </div>
                <div v-else class="text-center py-12 text-slate-400 text-xs sm:text-sm">
                  <Icon icon="ph:sword" class="text-3xl mx-auto mb-2 text-slate-300" />
                  <span>{{ t('no_bracket_data') }}</span>
                </div>
              </div>
            </section>

            <!-- 7. PODIUM & MEDAL STANDINGS -->
            <section v-if="hasMedalsData" id="medals" class="scroll-mt-24 space-y-7">
              <div class="flex items-center gap-3 border-b border-slate-100 pb-3.5">
                <div class="size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0 section-badge-icon"><Icon icon="ph:trophy-bold" class="size-5 text-navy" /></div>
                <div>
                  <h2 class="text-xl sm:text-2xl font-bold text-navy font-display">
                    {{ t('medals_title') }}
                  </h2>
                  <div class="text-xs sm:text-sm text-slate-500 mt-0.5 leading-normal">{{ t('medals_desc') }}</div>
                </div>
              </div>

              <!-- Podium Category Selector (Custom Non-Native Dropdown / Chips) -->
              <div class="space-y-3">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 class="text-sm font-bold text-navy flex items-center gap-2">
                    <Icon icon="ph:medal-fill" class="text-primary text-base" />
                    <span>{{ t('podium_standings') }}</span>
                  </h3>

                  <!-- Custom Non-Native Dropdown for Podium Category -->
                  <div class="relative shrink-0" v-click-outside="() => showPodiumDropdown = false">
                    <button
                      type="button"
                      @click="showPodiumDropdown = !showPodiumDropdown"
                      class="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 flex items-center justify-between gap-2.5 transition-all cursor-pointer min-w-[180px]"
                    >
                      <div class="flex items-center gap-1.5 truncate">
                        <Icon icon="ph:tag-bold" class="text-primary text-sm shrink-0" />
                        <span class="truncate">{{ toTitleCase(selectedPodiumCategory || availablePodiumCategories[0] || 'Select Category') }}</span>
                      </div>
                      <Icon :icon="showPodiumDropdown ? 'ph:caret-up-bold' : 'ph:caret-down-bold'" class="text-xs text-slate-400 shrink-0" />
                    </button>

                    <!-- Custom Dropdown Menu -->
                    <div
                      v-if="showPodiumDropdown"
                      class="absolute right-0 top-full mt-1.5 z-40 w-64 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <button
                        v-for="cat in availablePodiumCategories"
                        :key="cat"
                        type="button"
                        @click="selectedPodiumCategory = cat; showPodiumDropdown = false"
                        :class="[
                          'w-full px-3 py-2 rounded-xl text-xs sm:text-sm text-left font-medium transition-all flex items-center justify-between cursor-pointer',
                          (selectedPodiumCategory || availablePodiumCategories[0]) === cat ? 'bg-primary/20 text-navy font-bold' : 'text-slate-700 hover:bg-slate-50'
                        ]"
                      >
                        <span class="truncate">{{ toTitleCase(cat) }}</span>
                        <Icon v-if="(selectedPodiumCategory || availablePodiumCategories[0]) === cat" icon="ph:check-bold" class="text-navy text-xs" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- 3-Tier Podium Visual (1st Gold, 2nd Silver, 3rd Bronze) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <!-- Silver (2nd) -->
                  <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                    <div class="flex items-center gap-2 text-slate-600 text-xs sm:text-sm font-bold pb-2">
                      <div class="size-6 sm:size-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                        <Icon icon="ph:medal-fill" class="text-xs sm:text-sm" />
                      </div>
                      <span>{{ t('podium_silver') }}</span>
                    </div>
                    <div class="pt-2">
                      <div class="text-sm sm:text-base font-bold text-navy truncate">
                        {{ toTitleCase(currentPodiumCategoryData?.silver?.name || currentPodiumCategoryData?.silver?.athlete_name || 'TBD') }}
                      </div>
                      <div class="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
                        {{ toTitleCase(currentPodiumCategoryData?.silver?.club || currentPodiumCategoryData?.silver?.country || '-') }}
                      </div>
                    </div>
                  </div>

                  <!-- Gold (1st) -->
                  <div class="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400/60 flex flex-col justify-between shadow-xs">
                    <div class="flex items-center gap-2 text-amber-800 text-xs sm:text-sm font-bold pb-2">
                      <div class="size-6 sm:size-7 rounded-lg bg-amber-400 text-amber-950 flex items-center justify-center shrink-0">
                        <Icon icon="ph:crown-fill" class="text-xs sm:text-sm" />
                      </div>
                      <span>{{ t('podium_gold') }}</span>
                    </div>
                    <div class="pt-2">
                      <div class="text-sm sm:text-base font-black text-navy truncate">
                        {{ toTitleCase(currentPodiumCategoryData?.gold?.name || currentPodiumCategoryData?.gold?.athlete_name || 'TBD') }}
                      </div>
                      <div class="text-xs sm:text-sm text-amber-900/80 font-semibold truncate mt-0.5">
                        {{ toTitleCase(currentPodiumCategoryData?.gold?.club || currentPodiumCategoryData?.gold?.country || '-') }}
                      </div>
                    </div>
                  </div>

                  <!-- Bronze (3rd) -->
                  <div class="p-4 rounded-2xl bg-amber-700/5 border border-amber-700/20 flex flex-col justify-between">
                    <div class="flex items-center gap-2 text-amber-900 text-xs sm:text-sm font-bold pb-2">
                      <div class="size-6 sm:size-7 rounded-lg bg-amber-700/20 text-amber-900 flex items-center justify-center shrink-0">
                        <Icon icon="ph:medal-fill" class="text-xs sm:text-sm" />
                      </div>
                      <span>{{ t('podium_bronze') }}</span>
                    </div>
                    <div class="pt-2">
                      <div class="text-sm sm:text-base font-bold text-navy truncate">
                        {{ toTitleCase(currentPodiumCategoryData?.bronze?.name || currentPodiumCategoryData?.bronze?.athlete_name || 'TBD') }}
                      </div>
                      <div class="text-xs sm:text-sm text-slate-500 truncate mt-0.5">
                        {{ toTitleCase(currentPodiumCategoryData?.bronze?.club || currentPodiumCategoryData?.bronze?.country || '-') }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Club Medal Leaderboard Table -->
              <div class="space-y-3 pt-4 border-t border-slate-100">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h3 class="text-sm font-bold text-navy flex items-center gap-2">
                    <Icon icon="ph:shield-chevron-fill" class="text-primary text-base" />
                    <span>{{ t('club_medal_leaderboard') }}</span>
                  </h3>

                  <!-- Search Club Input -->
                  <div class="relative">
                    <Icon icon="ph:magnifying-glass-bold" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs sm:text-sm" />
                    <input
                      v-model="searchMedalClub"
                      type="text"
                      :placeholder="t('search_club_placeholder')"
                      class="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-navy"
                    />
                  </div>
                </div>

                <!-- Medal Table Container -->
                <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs">
                  <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead class="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold text-xs sm:text-sm">
                        <tr>
                          <th @click="handleSortMedals('rank')" class="py-3 px-4 w-12 text-center cursor-pointer hover:text-navy select-none">
                            <div class="flex items-center justify-center gap-1">
                              <span>#</span>
                              <Icon :icon="getSortIcon('rank', medalSortKey, medalSortAsc)" class="text-xs sm:text-sm" />
                            </div>
                          </th>
                          <th @click="handleSortMedals('club')" class="py-3 px-4 cursor-pointer hover:text-navy select-none">
                            <div class="flex items-center gap-1.5">
                              <span>{{ t('club') }}</span>
                              <Icon :icon="getSortIcon('club', medalSortKey, medalSortAsc)" class="text-xs sm:text-sm" />
                            </div>
                          </th>
                          <th @click="handleSortMedals('gold')" class="py-3 px-4 text-center cursor-pointer hover:text-navy select-none">
                            <div class="flex items-center justify-center gap-1 text-amber-500 font-bold">
                              <Icon icon="ph:medal-fill" />
                              <span>{{ t('medal_gold') }}</span>
                            </div>
                          </th>
                          <th @click="handleSortMedals('silver')" class="py-3 px-4 text-center cursor-pointer hover:text-navy select-none">
                            <div class="flex items-center justify-center gap-1 text-slate-400 font-bold">
                              <Icon icon="ph:medal-fill" />
                              <span>{{ t('medal_silver') }}</span>
                            </div>
                          </th>
                          <th @click="handleSortMedals('bronze')" class="py-3 px-4 text-center cursor-pointer hover:text-navy select-none">
                            <div class="flex items-center justify-center gap-1 text-amber-700 font-bold">
                              <Icon icon="ph:medal-fill" />
                              <span>{{ t('medal_bronze') }}</span>
                            </div>
                          </th>
                          <th @click="handleSortMedals('total')" class="py-3 px-4 text-center cursor-pointer hover:text-navy select-none">
                            <div class="flex items-center justify-center gap-1 font-bold text-navy">
                              <span>Total</span>
                              <Icon :icon="getSortIcon('total', medalSortKey, medalSortAsc)" class="text-xs sm:text-sm" />
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100 bg-white">
                        <tr
                          v-for="(medal, idx) in paginatedMedalsData"
                          :key="idx"
                          class="hover:bg-slate-50/60 transition-colors"
                        >
                          <td class="py-3 px-4 text-center font-mono font-bold text-navy">
                            {{ medal.rank || idx + 1 }}
                          </td>
                          <td class="py-3 px-4 font-bold text-navy whitespace-nowrap">
                            {{ toTitleCase(medal.club || medal.name || '-') }}
                          </td>
                          <td class="py-3 px-4 text-center font-mono font-bold text-amber-600 bg-amber-50/30">
                            {{ medal.gold || 0 }}
                          </td>
                          <td class="py-3 px-4 text-center font-mono font-bold text-slate-600 bg-slate-50/30">
                            {{ medal.silver || 0 }}
                          </td>
                          <td class="py-3 px-4 text-center font-mono font-bold text-amber-800 bg-amber-700/5">
                            {{ medal.bronze || 0 }}
                          </td>
                          <td class="py-3 px-4 text-center font-mono font-black text-navy text-sm sm:text-base">
                            {{ medal.total || (Number(medal.gold || 0) + Number(medal.silver || 0) + Number(medal.bronze || 0)) }}
                          </td>
                        </tr>

                        <tr v-if="paginatedMedalsData.length === 0">
                          <td colspan="6" class="py-8 text-center text-slate-400">
                            {{ t('no_medal_results') }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- MEDAL FOOTER (ITEMS PER PAGE + PAGINATION ON FOOTER!) -->
                  <div class="p-3.5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
                    <!-- Custom Items Per Page Dropdown / Pills -->
                    <div class="flex items-center gap-2">
                      <span class="text-slate-500 font-medium">{{ t('items_per_page') }}:</span>
                      <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
                        <button
                          v-for="size in [10, 20, 50]"
                          :key="size"
                          type="button"
                          @click="medalsPageSize = size; medalsCurrentPage = 1"
                          :class="[
                            'px-2 py-0.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer',
                            medalsPageSize === size
                              ? 'bg-navy text-white shadow-2xs font-bold'
                              : 'text-slate-600 hover:text-navy hover:bg-slate-50'
                          ]"
                        >
                          {{ size }}
                        </button>
                      </div>
                    </div>

                    <!-- Center: Summary Info -->
                    <div class="text-slate-500 font-medium">
                      {{ t('showing_x_of_y_clubs', { current: paginatedMedalsData.length, total: sortedMedalTally.length }) }}
                    </div>

                    <!-- Right: Prev / Next Buttons -->
                    <div class="flex items-center gap-1">
                      <button
                        :disabled="medalsCurrentPage <= 1"
                        @click="medalsCurrentPage--"
                        class="px-3 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                      >
                        {{ t('prev_page') }}
                      </button>
                      <span class="px-2 font-bold text-navy">
                        {{ medalsCurrentPage }} / {{ totalMedalPages }}
                      </span>
                      <button
                        :disabled="medalsCurrentPage >= totalMedalPages"
                        @click="medalsCurrentPage++"
                        class="px-3 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
                      >
                        {{ t('next_page') }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- 8. RELATED TOURNAMENTS -->
            <TournamentRelatedSection
              :current-slug="tournamentId"
              :country="activeTournament?.country || activeTournament?.location || 'Malaysia'"
              :lang="currentLang"
            />

          </div>

          <!-- ── COLUMN 3: RIGHT SIDEBAR (EVENT DETAILS INFOBOX, TOOLS & MULTILANG) ── -->
          <aside class="col-span-12 lg:col-span-3 p-5 sm:p-6 bg-slate-50/30 lg:bg-transparent rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl">
            <div class="sticky top-20 sm:top-24 space-y-4">
              
              <!-- 1. Language Preference Selector (Iconify Powered: ID, EN, IT) -->
              <div class="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2.5">
                <div class="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500">
                  <span class="flex items-center gap-1.5 font-display">
                    <Icon icon="ph:translate-bold" class="text-primary text-sm shrink-0" />
                    {{ t('language_selector') }}
                  </span>
                  <span class="text-xs sm:text-sm font-mono text-slate-400 font-semibold">{{ currentLang }}</span>
                </div>

                <div class="grid grid-cols-3 gap-1.5 bg-slate-100/80 p-1 rounded-xl">
                  <button
                    v-for="lang in availableLanguages"
                    :key="lang.code"
                    type="button"
                    @click="setLanguage(lang.code)"
                    :class="[
                      'py-1.5 px-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer select-none',
                      currentLang === lang.code
                        ? 'bg-white text-navy shadow-xs font-bold'
                        : 'text-slate-600 hover:text-navy hover:bg-white/50'
                    ]"
                  >
                    <Icon :icon="lang.flag" class="text-sm shrink-0" />
                    <span class="truncate">{{ lang.label }}</span>
                  </button>
                </div>
              </div>

              <!-- 2. Event Details Infobox (Clean Categorized Layout) -->
              <div class="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 class="text-xs sm:text-sm font-bold text-navy font-display flex items-center gap-2">
                    <div class="size-6 rounded-lg bg-primary/20 text-navy flex items-center justify-center">
                      <Icon icon="ph:info-bold" class="text-xs" />
                    </div>
                    <span>{{ t('event_details') }}</span>
                  </h3>
                </div>

                <div class="space-y-3.5 text-xs sm:text-sm divide-y divide-slate-100/90">
                  <!-- Section 1: Dates -->
                  <div class="space-y-2">
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
                        <Icon icon="ph:calendar-blank-bold" class="text-slate-400 text-xs shrink-0" />
                        {{ t('label_dates') }}
                      </span>
                      <span class="font-bold text-navy text-right">{{ formatDateRange(activeTournament?.start_date, activeTournament?.end_date) }}</span>
                    </div>
                  </div>

                  <!-- Section 2: Location & Organization -->
                  <div class="space-y-2.5 pt-3">
                    <!-- Venue -->
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
                        <Icon icon="ph:map-pin-bold" class="text-slate-400 text-xs shrink-0" />
                        {{ t('label_venue') }}
                      </span>
                      <span class="font-semibold text-navy text-right max-w-[65%] leading-snug">{{ displayVenue }}</span>
                    </div>

                    <!-- City / Region -->
                    <div v-if="displayCity" class="flex items-start justify-between gap-2">
                      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
                        <Icon icon="ph:buildings-bold" class="text-slate-400 text-xs shrink-0" />
                        {{ t('label_city') }}
                      </span>
                      <span class="font-medium text-slate-700 text-right">{{ displayCity }}</span>
                    </div>

                    <!-- Country / Flag -->
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
                        <Icon icon="ph:globe-hemisphere-west-bold" class="text-slate-400 text-xs shrink-0" />
                        {{ t('label_country') }}
                      </span>
                      <span class="font-bold text-navy text-right flex items-center justify-end gap-1.5">
                        <Icon :icon="countryFlagIcon" class="text-sm shrink-0" />
                        <span>{{ displayCountry }}</span>
                      </span>
                    </div>

                    <!-- Host Organization -->
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
                        <Icon icon="ph:shield-star-bold" class="text-slate-400 text-xs shrink-0" />
                        {{ t('label_host') }}
                      </span>
                      <span class="font-medium text-slate-700 text-right max-w-[65%] leading-snug">{{ toTitleCase(activeTournamentData?.organizer_name || 'Host Org') }}</span>
                    </div>
                  </div>

                  <!-- Section 3: Scale & Scale Metrics -->
                  <div class="space-y-2 pt-3">
                    <!-- Total Archers -->
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
                        <Icon icon="ph:users-three-bold" class="text-slate-400 text-xs shrink-0" />
                        {{ t('label_archers') }}
                      </span>
                      <span class="font-bold text-navy text-right font-mono">{{ computedTotalArchers }}</span>
                    </div>

                    <!-- Total Categories -->
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
                        <Icon icon="ph:target-bold" class="text-slate-400 text-xs shrink-0" />
                        {{ t('label_categories') }}
                      </span>
                      <span class="font-bold text-navy text-right font-mono">{{ categoriesList.length }}</span>
                    </div>

                    <!-- Total Clubs -->
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-slate-400 font-medium shrink-0 flex items-center gap-1.5">
                        <Icon icon="ph:trophy-bold" class="text-slate-400 text-xs shrink-0" />
                        {{ t('metric_clubs') }}
                      </span>
                      <span class="font-bold text-navy text-right font-mono">{{ computedTotalClubs }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. Actions & Resources Box (Open Ianseo & Share) -->
              <div class="space-y-2">
                <!-- Open in Ianseo Official Site -->
                <a
                  v-if="ianseoUrl"
                  :href="ianseoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs border border-slate-200/80 hover:border-navy/20"
                >
                  <Icon icon="ph:arrow-square-out-bold" class="text-navy text-base" />
                  <span>{{ t('view_ianseo_btn') }}</span>
                </a>

                <!-- Refined Modern Share Button -->
                <button
                  type="button"
                  @click="showShareModal = true"
                  class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 hover:from-primary/30 hover:to-primary/40 border border-primary/40 text-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-[0.98]"
                >
                  <Icon icon="ph:share-network-bold" class="text-base text-navy" />
                  <span>{{ t('share_tournament') }}</span>
                </button>
              </div>

            </div>
          </aside>

        </div>
      </div>
    </main>

    <!-- ========================================================================= -->
    <!-- HIGH-QUALITY SHARE TOURNAMENT DIALOG MODAL -->
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
          v-if="showShareModal" 
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-xs"
          @click.self="showShareModal = false"
        >
          <div class="bg-white rounded-3xl border border-slate-200/80 shadow-2xl max-w-md w-full p-6 sm:p-7 relative overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <!-- Close Button -->
            <button
              type="button"
              @click="showShareModal = false"
              class="absolute right-5 top-5 size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-navy flex items-center justify-center transition-colors cursor-pointer"
            >
              <Icon icon="ph:x-bold" class="text-sm" />
            </button>

            <!-- Modal Header -->
            <div class="flex items-center gap-3.5 pb-4 border-b border-slate-100">
              <div class="size-11 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
                <Icon icon="ph:share-network-fill" class="text-2xl text-navy" />
              </div>
              <div class="min-w-0 pr-6">
                <h3 class="text-base sm:text-lg font-bold text-navy font-display">
                  {{ t('share_event') }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 line-clamp-1 mt-0.5">
                  {{ toTitleCase(activeTournament?.name) }}
                </div>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="space-y-4 pt-4">
              <div class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {{ t('share_event_desc') }}
              </div>

              <!-- Link Copy Section -->
              <div class="space-y-1.5">
                <label class="text-xs sm:text-sm font-bold text-slate-500 font-display">
                  {{ t('share_link_label') }}
                </label>
                <div class="flex items-center gap-2 p-1 bg-slate-50 border border-slate-200 rounded-2xl">
                  <div class="pl-3 pr-1 text-xs sm:text-sm text-slate-600 font-mono truncate select-all flex-1">
                    {{ currentShareUrl }}
                  </div>
                  <button
                    type="button"
                    @click="copyShareUrl"
                    :class="[
                      'px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs',
                      copiedShareLink
                        ? 'bg-emerald-600 text-white'
                        : 'bg-navy hover:bg-navy/90 text-white'
                    ]"
                  >
                    <Icon :icon="copiedShareLink ? 'ph:check-bold' : 'ph:copy-bold'" class="text-xs sm:text-sm" />
                    <span>{{ copiedShareLink ? t('link_copied_btn') : t('copy_btn') }}</span>
                  </button>
                </div>
              </div>

              <!-- Social Broadcast Grid -->
              <div class="space-y-2 pt-2">
                <label class="text-xs sm:text-sm font-bold text-slate-500 font-display">
                  {{ t('share_to_social') }}
                </label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="platform in socialShareOptions"
                    :key="platform.id"
                    type="button"
                    @click="shareToSocialPlatform(platform.id)"
                    class="p-2.5 rounded-xl border border-slate-200 hover:border-navy/30 bg-slate-50/60 hover:bg-slate-100 flex flex-col items-center justify-center gap-1.5 transition-all group cursor-pointer"
                  >
                    <div :class="['size-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110', platform.bg]">
                      <Icon :icon="platform.icon" :class="['text-lg', platform.color]" />
                    </div>
                    <span class="text-xs sm:text-sm font-semibold text-slate-700 truncate w-full text-center">
                      {{ platform.name }}
                    </span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import ExternalEliminationBracket from './ExternalEliminationBracket.vue'
import TournamentExternalDataTable from './TournamentExternalDataTable.vue'
import TournamentFieldOfPlayVisualizer from './TournamentFieldOfPlayVisualizer.vue'

// Custom click-outside directive for Vue
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
  }
}

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

const route = useRoute()
const isExternalTournamentState = useState('isExternalTournamentPage', () => true)
isExternalTournamentState.value = true

onMounted(() => {
  isExternalTournamentState.value = true
})

const activeTournament = computed(() => props.tournament || {})
const activeTournamentData = computed(() => props.tournamentData || {})
const tournamentId = computed(() => {
  return props.tournament?.external_id || props.tournament?.slug || props.tournament?.id || route.params.slug || '25818'
})

// ─────────────────────────────────────────────────────────────
// INTERNATIONALIZATION (ID, EN, IT) - REPLACING KO WITH IT
// ─────────────────────────────────────────────────────────────
const currentLang = ref('en')

const availableLanguages = [
  { code: 'en', label: 'English', flag: 'circle-flags:gb' },
  { code: 'id', label: 'Indonesia', flag: 'circle-flags:id' },
  { code: 'it', label: 'Italiano', flag: 'circle-flags:it' }
]

const setLanguage = (lang) => {
  currentLang.value = lang
}

const translations = {
  id: {
    tournaments: 'Turnamen',
    tournament_details: 'Detail Turnamen',
    contents: 'Daftar Isi',
    overview_title: 'Ringkasan Turnamen',
    overview_desc: 'Rangkuman resmi dan statistik utama kompetisi panahan.',
    metric_archers: 'Total Pemanah',
    metric_archers_sub: 'Atlet terdaftar',
    metric_clubs: 'Klub & Kontingen',
    metric_clubs_sub: 'Delegasi daerah',
    metric_categories: 'Kategori Lomba',
    metric_categories_sub: 'Nomor divisi tanding',
    metric_targets: 'Bantalan Sasaran',
    metric_targets_sub: 'Target line aktif',
    schedule_title: 'Jadwal Pertandingan',
    schedule_desc: 'Rundown resmi dan susunan waktu kompetisi.',
    all_days: 'Semua Hari',
    fop_title: 'Lapangan Tembak (FOP)',
    fop_desc: 'Tata letak geometris target dan rincian sesi pertandingan.',
    fop_empty: 'Belum ada alokasi FOP yang tercatat untuk hari ini.',
    session_label: 'Sesi',
    targets_label: 'Bantalan Target',
    distance_label: 'Jarak',
    target_face_label: 'Target Face',
    target_lane_title: 'Target Lane',
    lane_desc: 'Rincian alokasi bantalan target dan spesifikasi teknis.',
    athletes_title: 'Daftar Atlet & Peserta',
    athletes_desc: 'Daftar lengkap atlet dan kontingen yang terdaftar.',
    filter_club_all: 'Semua Klub / Kontingen',
    search_athlete_placeholder: 'Cari nama atlet, klub, atau divisi...',
    showing_x_of_y_entries: 'Menampilkan {current} dari {total} atlet terdaftar',
    col_rank: 'Pos.',
    col_target: 'Bantalan',
    col_bib: 'No. Dada',
    col_name: 'Nama Atlet',
    col_club: 'Klub / Kontingen',
    col_category: 'Divisi',
    col_score: 'Skor',
    col_10s: '10s',
    col_xs: 'Xs',
    no_entries_found: 'Tidak ada atlet yang cocok dengan kriteria pencarian.',
    qualifications_title: 'Hasil Kualifikasi',
    qualifications_desc: 'Skor resmi dan peringkat babak kualifikasi per kategori.',
    showing_x_of_y_scores: 'Menampilkan {current} dari {total} skor atlet',
    no_qual_scores: 'Belum ada hasil kualifikasi untuk kategori ini.',
    brackets_title: 'Bagan Eliminasi',
    brackets_desc: 'Bagan pertandingan satu lawan satu babak gugur hingga final.',
    bracket_type_single: 'Individu',
    bracket_type_team: 'Beregu',
    bracket_type_mix: 'Mix Team',
    no_bracket_data: 'Bagan eliminasi belum tersedia untuk kategori ini.',
    medals_title: 'Podium & Medali',
    medals_desc: 'Pemenang medali kejuaraan dan klasemen perolehan per klub.',
    podium_standings: 'Podium Juara',
    podium_gold: 'Juara 1 Medali Emas',
    podium_silver: 'Juara 2 Medali Perak',
    podium_bronze: 'Juara 3 Medali Perunggu',
    medal_gold: 'Emas',
    medal_silver: 'Perak',
    medal_bronze: 'Perunggu',
    champion_winner: 'Juara Umum',
    club: 'Klub',
    club_medal_leaderboard: 'Klasemen Medali Klub',
    showing_x_of_y_clubs: 'Menampilkan {current} dari {total} klub peserta',
    search_club_placeholder: 'Cari klub...',
    no_medal_results: 'Belum ada perolehan medali yang dicatat.',
    language_selector: 'Pilihan Bahasa',
    event_details: 'Rincian Acara',
    label_dates: 'Tanggal Acara',
    label_venue: 'Lokasi / Venue',
    label_city: 'Kota / Wilayah',
    label_host: 'Penyelenggara',
    label_country: 'Negara',
    label_archers: 'Jumlah Pemanah',
    label_categories: 'Jumlah Kategori',
    download_handbook_btn: 'Unduh Buku Panduan (THB)',
    view_ianseo_btn: 'Buka di Situs Resmi Ianseo',
    share_tournament: 'Bagikan Turnamen',
    share_event: 'Bagikan Turnamen Ini',
    share_event_desc: 'Sebarkan informasi turnamen resmi ini kepada atlet, klub, atau komunitas panahan.',
    share_link_label: 'Tautan Resmi Turnamen',
    share_to_social: 'Bagikan Melalui Media Sosial',
    copy_btn: 'Salin Tautan',
    link_copied_btn: 'Tersalin!',
    items_per_page: 'Baris per halaman',
    prev_page: 'Sebelumnya',
    next_page: 'Berikutnya',
    page_x_of_y: 'Halaman {current} dari {total}',
    related_title: 'Turnamen Terkait'
  },
  en: {
    tournaments: 'Tournaments',
    tournament_details: 'Tournament Details',
    contents: 'Contents',
    overview_title: 'Tournament Overview',
    overview_desc: 'Official summary and key statistics of the archery competition.',
    metric_archers: 'Total Archers',
    metric_archers_sub: 'Registered participants',
    metric_clubs: 'Clubs & Teams',
    metric_clubs_sub: 'Represented delegations',
    metric_categories: 'Divisions',
    metric_categories_sub: 'Event categories',
    metric_targets: 'FOP Targets',
    metric_targets_sub: 'Active target lines',
    schedule_title: 'Competition Schedule',
    schedule_desc: 'Official tournament rundown and timetable.',
    all_days: 'All Days',
    fop_title: 'Field of Play (FOP)',
    fop_desc: 'Target layout geometry and session arrangements.',
    fop_empty: 'No FOP arrangements found for this day.',
    session_label: 'Session',
    targets_label: 'Targets',
    distance_label: 'Distance',
    target_face_label: 'Target Face',
    target_lane_title: 'Target Lane',
    lane_desc: 'Target allocation and technical specifications.',
    athletes_title: 'Athletes & Entries',
    athletes_desc: 'Complete roster of registered archers and delegations.',
    filter_club_all: 'All Clubs / Delegations',
    search_athlete_placeholder: 'Search athlete by name, bib, target, club, or division...',
    showing_x_of_y_entries: 'Showing {current} of {total} registered athletes',
    col_rank: 'Rank',
    col_target: 'Target',
    col_bib: 'BIB',
    col_name: 'Athlete Name',
    col_club: 'Club / Team',
    col_category: 'Division',
    col_score: 'Score',
    col_10s: '10s',
    col_xs: 'Xs',
    no_entries_found: 'No athletes match the search criteria.',
    qualifications_title: 'Qualification Results',
    qualifications_desc: 'Official ranking round scores and standings.',
    showing_x_of_y_scores: 'Showing {current} of {total} athlete scores',
    no_qual_scores: 'No qualification results available for this division.',
    brackets_title: 'Elimination Brackets',
    brackets_desc: 'Head-to-head match trees from elimination to medal finals.',
    bracket_type_single: 'Individual',
    bracket_type_team: 'Team',
    bracket_type_mix: 'Mixed Team',
    no_bracket_data: 'Elimination bracket not available for this category.',
    medals_title: 'Podium & Medals',
    medals_desc: 'Championship medalists and club leaderboard standings.',
    podium_standings: 'Podium Standings',
    podium_gold: '1st Place Gold Medal',
    podium_silver: '2nd Place Silver Medal',
    podium_bronze: '3rd Place Bronze Medal',
    medal_gold: 'Gold',
    medal_silver: 'Silver',
    medal_bronze: 'Bronze',
    champion_winner: 'Champion',
    club: 'Club',
    club_medal_leaderboard: 'Club Medal Leaderboard',
    showing_x_of_y_clubs: 'Showing {current} of {total} competing clubs',
    search_club_placeholder: 'Search club...',
    no_medal_results: 'No medal records logged for this tournament.',
    language_selector: 'Language Selection',
    event_details: 'Event Details',
    label_dates: 'Event Dates',
    label_venue: 'Venue Location',
    label_city: 'City / Region',
    label_host: 'Host Organization',
    label_country: 'Country',
    label_archers: 'Total Archers',
    label_categories: 'Categories Contested',
    download_handbook_btn: 'Download Handbook (PDF)',
    view_ianseo_btn: 'View on Official Ianseo Site',
    share_tournament: 'Share Tournament',
    share_event: 'Share this Tournament',
    share_event_desc: 'Share the official tournament page with fellow archers, clubs, or on social media.',
    share_link_label: 'Direct Event Link',
    share_to_social: 'Broadcast to Social Media',
    copy_btn: 'Copy Link',
    link_copied_btn: 'Copied!',
    items_per_page: 'Items per page',
    prev_page: 'Previous',
    next_page: 'Next',
    page_x_of_y: 'Page {current} of {total}',
    related_title: 'Related Tournaments'
  },
  it: {
    tournaments: 'Tornei',
    tournament_details: 'Dettagli del Torneo',
    contents: 'Indice',
    overview_title: 'Panoramica del Torneo',
    overview_desc: 'Sintesi ufficiale e statistiche chiave dell\'evento di tiro con l\'arco.',
    metric_archers: 'Totale Arcieri',
    metric_archers_sub: 'Partecipanti registrati',
    metric_clubs: 'Club e Squadre',
    metric_clubs_sub: 'Contingenti rappresentati',
    metric_categories: 'Categorie',
    metric_categories_sub: 'Divisioni di gara',
    metric_targets: 'Bersagli FOP',
    metric_targets_sub: 'Linee di tiro allestite',
    schedule_title: 'Programma Gare',
    schedule_desc: 'Cronologia ufficiale e orari di gara.',
    all_days: 'Tutti i Giorni',
    fop_title: 'Campo di Gara (FOP)',
    fop_desc: 'Disposizione geometrica dei bersagli e dettagli di sessione.',
    fop_empty: 'Nessuna assegnazione FOP registrata per questo giorno.',
    session_label: 'Sessione',
    targets_label: 'Bersagli',
    distance_label: 'Distanza',
    target_face_label: 'Visuale',
    target_lane_title: 'Corsia Bersaglio',
    lane_desc: 'Assegnazione e dettagli tecnici del bersaglio.',
    athletes_title: 'Arcieri e Iscrizioni',
    athletes_desc: 'Elenco ufficiale degli atleti e contingenti registrati.',
    filter_club_all: 'Tutti i Club / Delegazioni',
    search_athlete_placeholder: 'Cerca per nome, pettorale, paglione o divisione...',
    showing_x_of_y_entries: 'Mostrati {current} di {total} arcieri iscritti',
    col_rank: 'Pos.',
    col_target: 'Paglione',
    col_bib: 'Pettorale',
    col_name: 'Nome Arciere',
    col_club: 'Club / Squadra',
    col_category: 'Divisione',
    col_score: 'Punteggio',
    col_10s: '10s',
    col_xs: 'Xs',
    no_entries_found: 'Nessun arciere trovato per i criteri di ricerca.',
    qualifications_title: 'Risultati Qualifiche',
    qualifications_desc: 'Punteggi ufficiali e classifica del turno di qualificazione.',
    showing_x_of_y_scores: 'Mostrati {current} di {total} punteggi ufficiali',
    no_qual_scores: 'Nessun risultato di qualifica disponibile per questa categoria.',
    brackets_title: 'Griglie Eliminatorie',
    brackets_desc: 'Scontri diretti e tabellone degli incontri testa a testa fino alla finale.',
    bracket_type_single: 'Individuale',
    bracket_type_team: 'Squadre',
    bracket_type_mix: 'Squadre Miste',
    no_bracket_data: 'Nessun tabellone eliminatorio disponibile per questa categoria.',
    medals_title: 'Podio e Medagliere',
    medals_desc: 'Vincitori delle medaglie e classifica generale per club.',
    podium_standings: 'Podio dei Vincitori',
    podium_gold: '1° Posto Medaglia d\'Oro',
    podium_silver: '2° Posto Medaglia d\'Argento',
    podium_bronze: '3° Posto Medaglia di Bronzo',
    medal_gold: 'Oro',
    medal_silver: 'Argento',
    medal_bronze: 'Bronzo',
    champion_winner: 'Campione',
    club: 'Club',
    club_medal_leaderboard: 'Medagliere Club',
    showing_x_of_y_clubs: 'Mostrati {current} di {total} club in classifica',
    search_club_placeholder: 'Cerca club...',
    no_medal_results: 'Nessun dato del medagliere disponibile per questo torneo.',
    language_selector: 'Lingua',
    event_details: 'Dettagli Evento',
    label_dates: 'Date dell\'Evento',
    label_venue: 'Luogo di Gara',
    label_city: 'Città / Regione',
    label_host: 'Organizzatore',
    label_country: 'Nazione',
    label_archers: 'Totale Iscritti',
    label_categories: 'Numero Categorie',
    download_handbook_btn: 'Scarica Manuale Ufficiale (PDF)',
    view_ianseo_btn: 'Visualizza su Ianseo Ufficiale',
    share_tournament: 'Condividi Torneo',
    share_event: 'Condividi questo Torneo',
    share_event_desc: 'Condividi il link ufficiale dell\'evento con atleti, club o sui social.',
    share_link_label: 'Link Diretto del Torneo',
    share_to_social: 'Condividi sui Social Network',
    copy_btn: 'Copia Link',
    link_copied_btn: 'Copiato!',
    items_per_page: 'Elementi per pagina',
    prev_page: 'Precedente',
    next_page: 'Successivo',
    page_x_of_y: 'Pagina {current} di {total}',
    related_title: 'Tornei Correlati'
  }
}

const t = (key, params = {}) => {
  const lang = currentLang.value || 'en'
  let text = translations[lang]?.[key] || translations['en']?.[key] || key
  if (params && typeof params === 'object') {
    Object.keys(params).forEach(k => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k])
    })
  }
  return text
}

// ─────────────────────────────────────────────────────────────
// DIVISION & CATEGORY HUMAN-READABLE FORMATTER
// ─────────────────────────────────────────────────────────────
const formatDivisionCategory = (cat, division, ageClass) => {
  if (!cat && !division && !ageClass) return '-'

  const divisionMap = {
    'b': 'Barebow',
    'bb': 'Barebow',
    'barebow': 'Barebow',
    'r': 'Recurve',
    'rc': 'Recurve',
    'recurve': 'Recurve',
    'c': 'Compound',
    'co': 'Compound',
    'compound': 'Compound',
    'n': 'Nasional',
    'std': 'Nasional',
    'nasional': 'Nasional',
    'standard': 'Nasional',
    't': 'Tradisional',
    'tr': 'Tradisional',
    'trad': 'Tradisional',
    'traditional': 'Tradisional',
    'h': 'Horsebow',
    'hb': 'Horsebow',
    'horsebow': 'Horsebow',
    'l': 'Longbow',
    'lb': 'Longbow',
    'longbow': 'Longbow'
  }

  const ageMap = {
    'u9': 'Under 9',
    'u10': 'Under 10',
    'u12': 'Under 12',
    'u13': 'Under 13',
    'u15': 'Under 15',
    'u18': 'Under 18',
    'u21': 'Mahasiswa',
    'mhs': 'Mahasiswa',
    'mahasiswa': 'Mahasiswa',
    'umum': 'Umum',
    'open': 'Open',
    'senior': 'Senior',
    'master': 'Master'
  }

  const genderMap = {
    'm': 'Men',
    'w': 'Women',
    'men': 'Men',
    'women': 'Women',
    'putra': 'Men',
    'putri': 'Women',
    'mix': 'Mixed Team',
    'mixed': 'Mixed Team'
  }

  let raw = String(cat || '').trim()

  // If empty raw but division or ageClass provided
  if (!raw && division) {
    const divName = divisionMap[String(division).toLowerCase()] || division
    const clsName = ageClass ? (ageMap[String(ageClass).toLowerCase()] || ageClass) : ''
    return [divName, clsName].filter(Boolean).join(' ')
  }

  // Exact single code (e.g. "B", "R", "C", "N")
  if (divisionMap[raw.toLowerCase()]) {
    return divisionMap[raw.toLowerCase()]
  }

  // Parse raw space-separated tokens like "B U13M", "N U10W", "R U18M", "C U15M", "B U21M", "B U21W"
  const tokens = raw.split(/[\s_-]+/)
  if (tokens.length >= 2 && divisionMap[tokens[0].toLowerCase()]) {
    const divName = divisionMap[tokens[0].toLowerCase()]
    const rest = tokens.slice(1).join(' ')
    const ageGenderMatch = rest.match(/^(u\d+|mhs|umum)?\s*([mw]|men|women|putra|putri)?$/i)
    if (ageGenderMatch) {
      const [, a, g] = ageGenderMatch
      const aName = a ? (ageMap[a.toLowerCase()] || (a.toLowerCase() === 'u21' ? 'Mahasiswa' : `Under ${a.replace(/\D/g, '')}`)) : ''
      const gName = g ? (genderMap[g.toLowerCase()] || toTitleCase(g)) : ''
      return [divName, aName, gName].filter(Boolean).join(' ')
    }
  }

  // Human string expansions and title casing
  let formatted = raw
    .replace(/\bU-?(\d+)\s*(M|W|Men|Women|Putra|Putri)?\b/gi, (match, age, gen) => {
      let g = ''
      if (gen) {
        g = gen.toUpperCase().startsWith('M') || (gen.toUpperCase().startsWith('P') && !gen.toLowerCase().includes('putri')) ? 'Men' : 'Women'
      }
      return `Under ${age} ${g}`.trim()
    })
    .replace(/\bU21\s*(M|Men|Putra)?\b/gi, 'Mahasiswa Men')
    .replace(/\bU21\s*(W|Women|Putri)\b/gi, 'Mahasiswa Women')
    .replace(/^B\s+/i, 'Barebow ')
    .replace(/^R\s+/i, 'Recurve ')
    .replace(/^C\s+/i, 'Compound ')
    .replace(/^N\s+/i, 'Nasional ')
    .replace(/^STD\s+/i, 'Nasional ')

  return toTitleCase(formatted)
}

// ─────────────────────────────────────────────────────────────
// DATA NORMALIZATION COMPUTEDS
// ─────────────────────────────────────────────────────────────
const normalizedQualsList = computed(() => {
  const raw = activeTournamentData.value?.qualifications || []
  if (Array.isArray(raw)) {
    return raw.map((a, idx) => ({
      ...a,
      rank: a.rank || idx + 1,
      score: a.total_score !== undefined ? a.total_score : (a.score !== undefined ? a.score : (a.total ?? '-')),
      tens: a.tens !== undefined ? a.tens : (a['10s'] !== undefined ? a['10s'] : (a.tens_count ?? '-')),
      xs: a.xs !== undefined ? a.xs : (a['xs'] !== undefined ? a['xs'] : (a.x_count ?? '-')),
      category: a.category || ''
    }))
  }
  if (raw && typeof raw === 'object') {
    const list = []
    Object.keys(raw).forEach(cat => {
      const archers = raw[cat]
      if (Array.isArray(archers)) {
        archers.forEach((a, idx) => {
          list.push({
            ...a,
            category: cat,
            raw_category: cat,
            rank: a.rank || idx + 1,
            score: a.total_score !== undefined ? a.total_score : (a.score !== undefined ? a.score : (a.total ?? '-')),
            tens: a.tens !== undefined ? a.tens : (a['10s'] !== undefined ? a['10s'] : (a.tens_count ?? '-')),
            xs: a.xs !== undefined ? a.xs : (a['xs'] !== undefined ? a['xs'] : (a.x_count ?? '-'))
          })
        })
      }
    })
    return list
  }
  return []
})

const normalizedEntriesList = computed(() => {
  const raw = activeTournamentData.value?.entries || []
  let list = []
  if (Array.isArray(raw)) {
    list = [...raw]
  } else if (raw && typeof raw === 'object') {
    Object.keys(raw).forEach(k => {
      const item = raw[k]
      if (Array.isArray(item)) {
        item.forEach(sub => list.push({ ...sub, category: sub.category || k }))
      } else if (item && typeof item === 'object') {
        list.push({ ...item, category: item.category || k })
      }
    })
  }
  return list.map(item => {
    const rawCat = item.category || item.division || item.class || ''
    const fullCat = formatDivisionCategory(rawCat, item.division, item.age_class || item.class)
    return {
      ...item,
      target: item.target || item.target_lane || item.lane || '',
      bib: item.bib || item.bib_no || item.id || '',
      code: item.code || item.club_code || '',
      club: item.club || item.club_name || item.country || '',
      category: fullCat,
      raw_category: rawCat
    }
  })
})

const normalizedBracketsList = computed(() => {
  const raw = activeTournamentData.value?.brackets || []
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    const list = []
    Object.keys(raw).forEach(cat => {
      const phases = raw[cat]
      const fullCat = formatDivisionCategory(cat)
      if (Array.isArray(phases)) {
        phases.forEach(p => {
          list.push({ category: fullCat, raw_category: cat, ...p })
        })
      } else if (phases && typeof phases === 'object') {
        Object.keys(phases).forEach(pName => {
          list.push({ category: fullCat, raw_category: cat, phase: pName, matches: phases[pName] })
        })
      }
    })
    return list
  }
  return []
})

// ─────────────────────────────────────────────────────────────
// STATE & REACTIVE CONTROLS
// ─────────────────────────────────────────────────────────────
const scrollProgress = ref(0)
const activeSectionId = ref('overview')
const selectedCategory = ref('')
const selectedQualCategory = ref('')
const selectedBracketType = ref('single')
const selectedBracketCategory = ref('')
const selectedPodiumCategory = ref('')
const selectedScheduleDay = ref('')
const selectedFopDayIndex = ref(0)
const copiedShareLink = ref(false)
const showShareModal = ref(false)

// Custom Dropdown Open States (Non-Native)
const showClubDropdown = ref(false)
const showPodiumDropdown = ref(false)

// Table Controls
const entriesSearchQuery = ref('')
const entriesClubFilter = ref('all')
const entriesPageSize = ref(15)
const entriesCurrentPage = ref(1)
const entriesSortKey = ref('name')
const entriesSortAsc = ref(true)

const resultsSearchQuery = ref('')
const qualPageSize = ref(10)
const qualCurrentPage = ref(1)
const qualSortKey = ref('rank')
const qualSortAsc = ref(true)

const searchMedalClub = ref('')
const medalsPageSize = ref(10)
const medalsCurrentPage = ref(1)
const medalSortKey = ref('rank')
const medalSortAsc = ref(true)

// ─────────────────────────────────────────────────────────────
// TOURNAMENT OVERVIEW DESCRIPTIONS (BESPOKE NATURAL PROSE FOR ALL 11 TOURNAMENTS)
// ─────────────────────────────────────────────────────────────
const bespokeTournamentDescriptions = {
  // 1. Ext: 25777 - KEJUARAAN NASIONAL ANTAR CLUB TAHUN 2025
  '25777': {
    id: [
      'Kejuaraan Nasional Antar Club 2025 merupakan perhelatan akbar panahan antar-klub paling bergengsi di Indonesia yang diselenggarakan di Super Soccer Arena Kudus, Jawa Tengah pada 9 - 14 Desember 2025. Mempertemukan ratusan pemanah berbakat dari puluhan klub dan akademi panahan elit dari seluruh penjuru nusantara.',
      'Kejuaraan ini mempertandingkan berbagai nomor bergengsi lintas divisi Standar Nasional, Recurve, Compound, dan Barebow untuk kelompok usia dini hingga senior. Didukung infrastruktur arena modern dan sistem administrasi Ianseo berstandar World Archery, ajang ini menjadi panggung utama unjuk prestasi, pembibitan talenta unggulan, serta tolak ukur pembinaan klub panahan di Indonesia.'
    ],
    en: [
      'The 2025 National Inter-Club Archery Championship is one of the most prestigious club-level archery tournaments in Indonesia, staged at the Super Soccer Arena Kudus, Central Java from December 9 to 14, 2025. The championship brings together top archers representing elite archery clubs and academies across the Indonesian archipelago.',
      'Contested across National Standard Bow, Recurve, Compound, and Barebow divisions from youth developmental tiers to senior categories. Supported by world-class arena facilities and official Ianseo tournament management, the event serves as a crucial benchmark for club performance, athlete development, and national talent scouting.'
    ],
    it: [
      'Il Campionato Nazionale Interclub di Tiro con l\'Arco 2025 rappresenta la più prestigiosa competizione per società in Indonesia, ospitata presso la Super Soccer Arena di Kudus, Giava Centrale, dal 9 al 14 dicembre 2025. La manifestazione riunisce i migliori atleti di decine di club e accademie arcieristiche da tutto il paese.',
      'Il programma di gara comprende le divisioni Standard Nazionale, Arco Olimpico, Compound e Arco Nudo dalle categorie giovanili ai senior, con omologazione e gestione punteggi ufficiale Ianseo.'
    ]
  },

  // 2. Ext: 24921 - SITUBONDO ARCHERY CHAMPIONSHIP 2025
  '24921': {
    id: [
      'Situbondo Archery Championship 2025 merupakan kejuaraan panahan terbuka tingkat regional dan nasional yang digelar di Situbondo, Jawa Timur pada 24 - 26 Oktober 2025. Diselenggarakan oleh Pengcab PERPANI Situbondo, turnamen ini menjadi sarana pembinaan berkesinambungan bagi atlet panahan pelajar dan umum di kawasan Tapal Kuda dan Jawa Timur.',
      'Kompetisi menghadirkan divisi Standar Nasional, Barebow, dan Recurve dari kategori pemula (U10, U13, U15) hingga kategori Prestasi Umum. Dengan atmosfer kompetisi yang dinamis dan terdata rapi melalui sistem Ianseo, kejuaraan ini memacu jam terbang serta mental juara para pemanah muda.'
    ],
    en: [
      'The Situbondo Archery Championship 2025 is an open regional and national archery competition held in Situbondo, East Java from October 24 to 26, 2025. Organized by PERPANI Situbondo, the championship provides a dedicated platform for youth and senior archers to hone competitive marksmanship.',
      'Featuring competition in National Standard, Barebow, and Recurve divisions across junior developmental age brackets (U10, U13, U15) and Open classes. Managed under the Ianseo system, it offers vital matchplay experience and ranking points for rising athletes.'
    ],
    it: [
      'Il Situbondo Archery Championship 2025 è una competizione arcieristica regionale tenutasi a Situbondo, Giava Orientale, dal 24 al 26 ottobre 2025. L\'evento ha riunito giovani promesse e tiratori senior nelle divisioni Arco Olimpico, Standard Nazionale e Barebow.'
    ]
  },

  // 3. Ext: 26684 - Lumajang Archery Tournament 2026
  '26684': {
    id: [
      'Lumajang Archery Tournament 2026 adalah kejuaraan panahan terbuka tingkat Jawa Timur dan nasional yang dihelat di Stadion Semeru, Lumajang pada 11 - 15 Februari 2026. Berlangsung selama lima hari penuh, kejuaraan ini menjadi magnet bagi ratusan atlet dari berbagai klub, sekolah, dan pengkab/pengkot panahan.',
      'Turnamen mempertandingkan kategori komprehensif mulai dari divisi Paralon/PVC pemula (U10, U13, U15, U19), Standar Nasional jenjang sekolah, hingga Recurve dan Compound. Bertempat di stadion kebanggaan Lumajang dengan alokasi puluhan target lane berstandar resmi, turnamen ini menjadi ajang strategis pemetaan bibit unggul panahan Jawa Timur.'
    ],
    en: [
      'The Lumajang Archery Tournament 2026 is an expansive regional archery championship staged at Semeru Stadium in Lumajang, East Java from February 11 to 15, 2026. Spanning five full days of competition, the event drew hundreds of aspiring archers from schools, clubs, and regional associations.',
      'The tournament features wide-ranging competition categories, including introductory PVC/Paralon developmental brackets (U10, U13, U15, U19), National Standard Bow tiers, and high-performance Recurve and Compound divisions. Utilizing official multi-lane Ianseo scoring at Semeru Stadium, it serves as an essential talent identification pathway.'
    ],
    it: [
      'Il Lumajang Archery Tournament 2026 è una grande manifestazione arcieristica svoltasi presso lo Stadio Semeru di Lumajang, Giava Orientale, dall\'11 al 15 febbraio 2026, con gare dedicate alle classi giovanili promozionali, Standard Nazionale, Arco Olimpico e Compound.'
    ]
  },

  // 4. Ext: 25818 - PIALA GUBERNUR JAWA TIMUR III
  '25818': {
    id: [
      'Piala Gubernur Jawa Timur III merupakan festival dan kejuaraan panahan akbar termegah di Jawa Timur yang dihelat di Lapangan Stadion Rejoagung, Tulungagung pada 19 - 26 Desember 2025. Menghadirkan total 715 atlet panahan dari 32 kontingen daerah dan klub terkemuka di seluruh Jawa Timur.',
      'Kejuaraan ini menggelar 32 divisi nomor perlombaan yang mencakup divisi Standar Nasional usia dini (U10, U15, U18), Barebow jarak 20m dan 50m, serta divisi Compound dan Recurve resmi. Memperebutkan piala bergilir Gubernur Jawa Timur, kompetisi delapan hari ini menjadi barometer utama prestasi panahan daerah dan seleksi kontingen Pekan Olahraga Nasional.'
    ],
    en: [
      'The 3rd East Java Governor\'s Cup (Piala Gubernur Jawa Timur III) stands as one of the largest archery tournaments in Indonesia, staged at Rejoagung Stadium in Tulungagung from December 19 to 26, 2025. The premier championship gathered 715 elite archers representing 32 regional delegations and top clubs.',
      'Contested over eight action-packed days across 32 medal divisions spanning National Standard Bow (U10, U15, U18), Barebow (20m/50m), and premier Recurve and Compound classes. Competing for the prestigious Governor\'s Trophy, this tournament serves as the primary evaluation and talent scouting ground for East Java\'s provincial squad.'
    ],
    it: [
      'La 3ª Coppa del Governatore di Giava Orientale è stata una delle più imponenti manifestazioni arcieristiche della provincia, accogliendo 715 atleti da 32 delegazioni presso lo Stadio Rejoagung di Tulungagung (19 - 26 dicembre 2025), con 32 titoli in palio tra Standard Nazionale, Arco Nudo, Compound e Arco Olimpico.'
    ]
  },

  // 5. Ext: 19166 - Campionati Italiani Targa 2024
  '19166': {
    id: [
      'Campionati Italiani Targa 2024 merupakan edisi ke-62 Kejuaraan Nasional Panahan Outdoor Italia yang diselenggarakan oleh Federasi Panahan Italia (FITARCO) di Camaiore (Lucca), Tuscany pada 4 - 8 September 2024. Menyatukan 914 pemanah terbaik dari seluruh Italia yang telah lolos kualifikasi nasional.',
      'Kejuaraan ini memperebutkan gelar juara nasional dan medali scudetto di divisi Recurve (Arco Olimpico), Compound, dan Barebow (Arco Nudo) untuk semua kelompok usia (Ragazzi, Allievi, Junior, Senior, hingga Master). Didukung sistem administrasi resmi Ianseo Italia, ajang ini menjadi penentu seleksi skuad tim nasional Italia.'
    ],
    en: [
      'The 62nd Italian Outdoor Target Championships (Campionati Italiani Targa 2024) is Italy\'s premier national archery championship, hosted by FITARCO in Camaiore (Lucca), Tuscany from September 4 to 8, 2024. The championship assembled 914 top-qualified archers from leading clubs across Italy.',
      'Contesting national individual, team, and mixed-team championship titles in Olympic Recurve, Compound, and Barebow divisions across all age categories (Youth, Cadet, Junior, Senior, and Master). Managed by the official Ianseo scoring infrastructure, the tournament determined national scudetto honors and national team selection.'
    ],
    it: [
      'I Campionati Italiani Targa 2024 rappresentano la 62ª edizione della massima rassegna nazionale all\'aperto di tiro con l\'arco in Italia, organizzata dalla FITARCO a Camaiore (Lucca) dal 4 all\'8 settembre 2024. L\'evento ha riunito 914 atleti d\'élite qualificati in rappresentanza dei migliori club arcieristici della penisola.',
      'Le competizioni hanno assegnato i titoli nazionali individuali e a squadre nelle divisioni Arco Olimpico (Ricurvo), Compound e Arco Nudo (Barebow) per tutte le classi di età (Ragazzi, Allievi, Juniores, Seniores e Master), con gestione ufficiale Ianseo e finali scudetto trasmesse sui canali federali.'
    ]
  },

  // 6. Ext: 22226 - Campionati Italiani Targa 2025
  '22226': {
    id: [
      'Campionati Italiani Targa 2025 adalah edisi ke-63 Kejuaraan Nasional Panahan Outdoor Italia yang dihelat FITARCO di Stadion Quercia, Rovereto (Trento) pada 16 - 20 Juli 2025. Mengumpulkan rekor 938 pemanah elite dari lebih 150 klub panahan terdaftar di Italia.',
      'Mempertandingkan gelar juara nasional divisi Recurve, Compound, dan Barebow dengan lebih dari 60 bantalan sasaran aktif dalam satu lapangan tembak terpadu, didukung pencatatan skor real-time Ianseo.'
    ],
    en: [
      'The 63rd Italian Outdoor Target Championships (Campionati Italiani Targa 2025) is Italy\'s pinnacle national archery event, staged by FITARCO at Stadio Quercia in Rovereto (Trento) from July 16 to 20, 2025. Featuring a record 938 qualified archers representing over 150 sports clubs across Italy.',
      'Archers contested national titles in Olympic Recurve, Compound, and Barebow divisions across an extensive 60+ target line, powered by live Ianseo match results and precision scoring.'
    ],
    it: [
      'I Campionati Italiani Targa 2025 rappresentano la 63ª edizione dei campionati nazionali assoluti e di classe all\'aperto, organizzati dalla FITARCO a Rovereto (Trento) dal 16 al 20 luglio 2025. Con la partecipazione record di 938 arcieri qualificati da oltre 150 società sportive italiane.',
      'Sui campi dello Stadio Quercia, gli atleti si sono sfidati nelle divisioni Arco Olimpico, Compound e Barebow, con un\'imponente linea di tiro di oltre 60 paglioni contemporanei gestiti in tempo reale con cronometraggio e risultati ufficiali Ianseo.'
    ]
  },

  // 7. Ext: 16338 - KEJURPROV 5 PANAHAN PROVINSI RIAU TAHUN 2023
  '16338': {
    id: [
      'Kejurprov 5 Panahan Provinsi Riau Tahun 2023 merupakan kejuaraan daerah resmi PERPANI Provinsi Riau yang diselenggarakan di Pekanbaru pada 21 - 24 Desember 2023. Mempertemukan 159 pemanah terbaik dari 6 kontingen pengurus cabang kabupaten dan kota di Provinsi Riau.',
      'Kejuaraan ini mempertandingkan 30 divisi kompetisi di nomor Recurve, Compound, Standar Nasional (U12 hingga Umum), dan Barebow. Berfungsi sebagai ajang seleksi daerah dan tolak ukur pembinaan atlet panahan Riau menuju kompetisi skala nasional.'
    ],
    en: [
      'The 5th Riau Provincial Archery Championship 2023 is the official provincial championship organized by PERPANI Riau in Pekanbaru from December 21 to 24, 2023. The event brought together 159 top archers representing 6 regency and municipal PERPANI branches across Riau.',
      'Contested across 30 medal events in Recurve, Compound, National Standard Bow (U12 to Senior), and Barebow divisions, serving as the premier platform for provincial athlete ranking and team selection.'
    ],
    it: [
      'Il 5° Campionato Provinciale di Riau 2023 ha riunito a Pekanbaru 159 arcieri da 6 delegazioni per le selezioni regionali nelle divisioni Arco Olimpico, Compound, Standard e Barebow.'
    ]
  },

  // 8. Ext: 17869 - European Grand Prix – 1st leg 2024
  '17869': {
    id: [
      'European Grand Prix – 1st leg 2024 merupakan turnamen resmi peringkat dunia World Archery Europe yang diselenggarakan di kota pesisir Poreč, Kroasia pada 1 - 8 Juni 2024. Diikuti 197 atlet panahan tim nasional dari berbagai negara di Eropa dan dunia.',
      'Mempertandingkan divisi Recurve 70m dan Compound 50m untuk nomor Perorangan, Beregu, dan Mix Team dengan standar tertinggi World Archery dan administrasi Ianseo internasional.'
    ],
    en: [
      'The European Grand Prix – 1st Leg 2024 is an official World Archery Europe world-ranking tournament staged in the coastal city of Poreč, Croatia from June 1 to 8, 2024. The prestigious championship assembled 197 international national team archers from across Europe and the globe.',
      'Contested across 70m Olympic Recurve and 50m Compound divisions for Men, Women, Teams, and Mixed Teams under strict World Archery international competition rules, delivering elite qualification scoring and live broadcast medal finals.'
    ],
    it: [
      'L\'European Grand Prix – 1ª Tappa 2024 è una competizione internazionale ufficiale World Archery Europe valevole per il ranking mondiale, tenutasi a Poreč, Croazia, dall\'1 all\'8 giugno 2024, con 197 arcieri delle squadre nazionali in gara nelle divisioni Ricurvo Olimpico 70m e Compound 50m.'
    ]
  },

  // 9. Ext: 18413 - 74è CAMPIONAT DE CATALUNYA D'AIRE LLIURE 2024
  '18413': {
    id: [
      '74è Campionat de Catalunya d\'Aire Lliure 2024 merupakan edisi ke-74 Kejuaraan Panahan Outdoor Wilayah Catalunya yang diselenggarakan oleh Federasi Panahan Catalunya (FCTA) di Esclanyà (Girona), Spanyol pada 6 - 7 Juli 2024. Diikuti 197 atlet panahan dari klub-klub terkemuka se-Catalunya.',
      'Kejuaraan ini mempertandingkan divisi Recurve, Compound, Barebow (Arc Despullat), Tradisional, dan Longbow untuk menentukan juara regional Catalunya.'
    ],
    en: [
      'The 74th Outdoor Archery Championship of Catalonia (74è Campionat de Catalunya d\'Aire Lliure 2024) is the historic regional outdoor championship organized by the Catalan Archery Federation (FCTA) in Esclanyà (Girona), Spain on July 6 - 7, 2024, assembling 197 top archers from Catalan clubs.',
      'The championship awarded regional titles across Recurve, Compound, Barebow, Traditional, and Longbow divisions under official Ianseo tournament regulation.'
    ],
    it: [
      'Il 74° Campionato all\'Aperto della Catalogna 2024 è la storica rassegna regionale svoltasi a Esclanyà (Girona), Spagna, il 6 e 7 luglio 2024 con 197 arcieri catalani in gara nelle divisioni Ricurvo, Compound, Arco Nudo, Tradizionale e Longbow.'
    ]
  },

  // 10. Ext: 14092 - ISAA Outdoors League Leg 1 / Summer Open 2023
  '14092': {
    id: [
      'ISAA Outdoors League Leg 1 / Summer Open 2023 merupakan kejuaraan panahan terbuka tingkat mahasiswa dan umum yang diselenggarakan oleh Asosiasi Panahan Mahasiswa Irlandia (ISAA) dan Archery Ireland di National Range Blanchardstown, Dublin pada 21 Mei 2023. Diikuti 137 pemanah dari berbagai universitas dan klub panahan se-Irlandia.',
      'Mempertandingkan divisi Recurve, Compound, dan Barebow jarak 70m, 60m, dan 50m, menjadi seri pembuka liga panahan mahasiswa outdoor nasional Irlandia.'
    ],
    en: [
      'The ISAA Outdoors League Leg 1 / Summer Open 2023 is a premier outdoor tournament organized jointly by the Irish Student Archery Association (ISAA) and Archery Ireland at the National Range in Blanchardstown, Dublin on May 21, 2023. The event assembled 137 archers from universities, student clubs, and open archers across Ireland.',
      'Featuring 70m Recurve, 50m Compound, and Barebow student and open divisions, the competition served as the opening leg for the collegiate outdoor league and national ranking series.'
    ],
    it: [
      'La 1ª Tappa della Lega all\'Aperto ISAA / Summer Open 2023 è stata organizzata dalla Federazione Studentesca Irlandese (ISAA) e Archery Ireland a Dublino con 137 atleti universitari e societari in gara.'
    ]
  },

  // 11. Ext: 30234 - CABARAN RECURVE TUNAS TERENGGANU 2026
  '30234': {
    id: [
      'Cabaran Recurve Tunas Terengganu 2026 merupakan kejuaraan panahan usia dini dan pelajar tingkat negeri Terengganu yang diselenggarakan di Padang SK Teluk Menara, Kuala Terengganu, Malaysia pada 26 September 2026. Menghadirkan 141 pemanah muda berbakat dari berbagai sekolah dasar, sekolah menengah, dan klub panahan di Terengganu dan kawasan Pantai Timur Malaysia.',
      'Kejuaraan ini mempertandingkan divisi Recurve kelompok umur Bawah 10 Tahun (B10L & B10P - 15m), Bawah 12 Tahun (B12L & B12P - 18m), serta Bawah 15 Tahun (B15L & B15P - 18m). Dikelola menggunakan sistem skoring resmi Ianseo, turnamen ini menjadi sarana strategis pembinaan atlet panahan junior menuju kejohanan peringkat kebangsaan Malaysia.'
    ],
    en: [
      'The Cabaran Recurve Tunas Terengganu 2026 is a grassroots youth archery championship staged at Padang SK Teluk Menara in Kuala Terengganu, Malaysia on September 26, 2026. The tournament assembled 141 aspiring young archers from elementary schools, secondary schools, and youth academies across Terengganu and East Coast Malaysia.',
      'The championship spotlighted Olympic Recurve developmental divisions across Under-10 (B10 Boys/Girls at 15m), Under-12 (B12 Boys/Girls at 18m), and Under-15 (B15 Boys/Girls at 18m) tiers. Powered by official Ianseo scoring and target management, it serves as a vital junior athlete identification and development platform.'
    ],
    it: [
      'Il Cabaran Recurve Tunas Terengganu 2026 è un campionato giovanile promozionale di tiro con l\'arco svoltosi a Kuala Terengganu, Malesia, il 26 settembre 2026, con 141 giovani arcieri under-10, under-12 e under-15 nelle divisioni Arco Olimpico.'
    ]
  }
}

// Country flag resolver helper
const resolveCountryFlag = (countryCode, countryName) => {
  const code = String(countryCode || '').toLowerCase().trim()
  const name = String(countryName || '').toLowerCase().trim()
  
  if (code === 'id' || code === 'ina' || name.includes('indonesia')) return 'circle-flags:id'
  if (code === 'my' || code === 'mas' || name.includes('malaysia')) return 'circle-flags:my'
  if (code === 'it' || code === 'ita' || name.includes('italy') || name.includes('italia')) return 'circle-flags:it'
  if (code === 'hr' || code === 'cro' || name.includes('croatia') || name.includes('kroasia') || name.includes('porec') || name.includes('poreč')) return 'circle-flags:hr'
  if (code === 'es' || code === 'esp' || name.includes('spain') || name.includes('spanyol') || name.includes('catalunya') || name.includes('girona')) return 'circle-flags:es'
  if (code === 'ie' || code === 'irl' || name.includes('ireland') || name.includes('irlandia') || name.includes('dublin')) return 'circle-flags:ie'
  if (code === 'sg' || code === 'sgp' || name.includes('singapore') || name.includes('singapura')) return 'circle-flags:sg'
  if (code === 'th' || code === 'tha' || name.includes('thailand')) return 'circle-flags:th'
  if (code === 'us' || code === 'usa' || name.includes('united states') || name.includes('america')) return 'circle-flags:us'
  if (code === 'gb' || code === 'gbr' || code === 'uk' || name.includes('united kingdom') || name.includes('britain') || name.includes('england')) return 'circle-flags:gb'
  
  if (code && code.length === 2) return `circle-flags:${code}`
  return 'circle-flags:un'
}

const displayVenue = computed(() => {
  const v = activeTournamentData.value?.venue || activeTournament.value?.venue || activeTournament.value?.location
  return v ? toTitleCase(v) : 'Venue Arena'
})

const displayCity = computed(() => {
  const c = activeTournamentData.value?.city || activeTournament.value?.city
  return c ? toTitleCase(c) : ''
})

const displayCountry = computed(() => {
  const c = activeTournamentData.value?.country || activeTournament.value?.country || 'Indonesia'
  return toTitleCase(c)
})

const countryFlagIcon = computed(() => {
  const code = activeTournamentData.value?.country_code || activeTournament.value?.country_code
  const name = activeTournamentData.value?.country || activeTournament.value?.country
  return resolveCountryFlag(code, name)
})

const tournamentDescriptionParagraphs = computed(() => {
  const extId = String(activeTournament.value?.external_id || '').replace(/^ianseo-/, '')
  const slug = String(activeTournament.value?.slug || '')
  const lang = currentLang.value || 'en'

  // 1. Check multilingual descriptions from DB/data_json
  const multilangDesc = activeTournamentData.value?.descriptions
  if (multilangDesc && typeof multilangDesc === 'object' && multilangDesc[lang]) {
    const text = multilangDesc[lang]
    if (typeof text === 'string' && text.trim().length > 0) {
      return text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
    }
  }

  // 2. Check bespoke hardcoded dictionary
  const foundDesc = bespokeTournamentDescriptions[extId] || (slug ? bespokeTournamentDescriptions[slug] : null)
  if (foundDesc && foundDesc[lang]) {
    return foundDesc[lang]
  }

  // 3. Check plain string description from DB
  const dbDesc = activeTournamentData.value?.description || activeTournament.value?.description
  if (dbDesc && typeof dbDesc === 'string' && dbDesc.trim().length > 0) {
    return dbDesc.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean)
  }
  
  // 4. Dynamic Narrative Synthesizer
  const name = toTitleCase(activeTournament.value?.name || activeTournament.value?.tournament_name || 'Tournament')
  const loc = displayVenue.value || displayCity.value || displayCountry.value || 'Arena'
  const numArchers = computedTotalArchers.value || 0
  const numClubs = computedTotalClubs.value || 0
  const numCats = categoriesList.value?.length || 0
  const topMedal = medalTallyList.value?.[0]

  if (lang === 'id') {
    const p1 = `${name} merupakan ajang kompetisi panahan yang diselenggarakan di ${loc}. Turnamen ini mempertemukan ${numArchers > 0 ? numArchers + ' atlet panahan' : 'para atlet panahan pilihan'} yang mewakili ${numClubs > 0 ? numClubs + ' klub dan kontingen daerah' : 'berbagai kontingen'} untuk berkompetisi dalam ${numCats > 0 ? numCats + ' nomor pertandingan' : 'berbagai nomor divisi'}.`
    const p2 = topMedal 
      ? `Pada klasemen perolehan medali, kontingen ${toTitleCase(topMedal.club)} memimpin di puncak dengan raihan ${topMedal.gold || 0} Emas, ${topMedal.silver || 0} Perak, dan ${topMedal.bronze || 0} Perunggu. Kejuaraan ini menjadi wadah penting dalam mengevaluasi hasil latihan serta mengasah jam terbang para pemanah.`
      : `Setiap nomor pertandingan menyajikan persaingan ketat mulai dari babak kualifikasi penentuan peringkat hingga partai final eliminasi satu lawan satu.`
    return [p1, p2]
  } else if (lang === 'it') {
    const p1 = `${name} è una prestigiosa competizione di tiro con l\'arco svoltasi a ${loc}. Il torneo ha riunito ${numArchers > 0 ? numArchers + ' arcieri partecipanti' : 'atleti d\'élite'} in rappresentanza di ${numClubs > 0 ? numClubs + ' club e delegazioni sportive' : 'varie squadre'} su un totale di ${numCats > 0 ? numCats + ' categorie di gara' : 'diverse divisioni competitive'}.`
    const p2 = topMedal
      ? `Nel medagliere generale per club, la squadra ${toTitleCase(topMedal.club)} si è imposta in vetta alla classifica con un bottino di ${topMedal.gold || 0} Ori, ${topMedal.silver || 0} Argenti e ${topMedal.bronze || 0} Bronzi. Il torneo ha rappresentato un\'importante opportunità di crescita e confronto agonistico.`
      : `Dalle sessioni di qualificazione fino alle sfide ad eliminazione diretta, il torneo ha offerto sfide di alto livello tecnico e grande spettacolo sul campo di gara.`
    return [p1, p2]
  } else {
    // EN default
    const p1 = `${name} is an archery championship staged in ${loc}. The tournament assembled ${numArchers > 0 ? numArchers + ' competing archers' : 'elite archers'} representing ${numClubs > 0 ? numClubs + ' participating clubs and delegations' : 'various clubs'} across ${numCats > 0 ? numCats + ' contested event divisions' : 'multiple competitive divisions'}.`
    const p2 = topMedal
      ? `In the overall medal standings, ${toTitleCase(topMedal.club)} emerged at the top of the leaderboard with a tally of ${topMedal.gold || 0} Gold, ${topMedal.silver || 0} Silver, and ${topMedal.bronze || 0} Bronze medals. The event offered valuable competitive exposure and marksmanship development for all participants.`
      : `From precision qualification scoring to dramatic head-to-head elimination shootouts, the championship delivered high-level competition and valuable experience for all participating athletes.`
    return [p1, p2]
  }
})

// ─────────────────────────────────────────────────────────────
// COMPUTED METRICS & SECTIONS
// ─────────────────────────────────────────────────────────────
const computedTotalArchers = computed(() => {
  return activeTournament.value?.participants_count || normalizedEntriesList.value.length || normalizedQualsList.value.length || 0
})

const computedTotalClubs = computed(() => {
  const clubs = new Set()
  normalizedEntriesList.value.forEach(e => {
    const c = e.club || e.country
    if (c) clubs.add(c.trim().toLowerCase())
  })
  if (clubs.size > 0) return clubs.size

  normalizedQualsList.value.forEach(q => {
    const c = q.club || q.country
    if (c) clubs.add(c.trim().toLowerCase())
  })
  if (clubs.size > 0) return clubs.size

  const medals = activeTournamentData.value?.medals || []
  if (Array.isArray(medals)) {
    medals.forEach(m => {
      if (m.club) clubs.add(m.club.trim().toLowerCase())
    })
  }
  return clubs.size || 0
})

const categoriesList = computed(() => {
  const set = new Set()
  normalizedQualsList.value.forEach(q => { if (q.category) set.add(q.category) })
  normalizedEntriesList.value.forEach(e => { if (e.category) set.add(e.category) })
  normalizedBracketsList.value.forEach(b => { if (b.category) set.add(b.category) })
  
  const rawBrackets = activeTournamentData.value?.brackets
  if (rawBrackets && typeof rawBrackets === 'object' && !Array.isArray(rawBrackets)) {
    Object.keys(rawBrackets).forEach(k => set.add(k))
  }
  return Array.from(set).filter(Boolean)
})

const computedFopTargetCount = computed(() => {
  const fopDays = activeTournamentData.value?.field_of_play || []
  let maxTgt = 0
  if (Array.isArray(fopDays)) {
    fopDays.forEach(d => {
      d.sessions?.forEach(s => {
        if (s.target_max && s.target_max > maxTgt) maxTgt = s.target_max
      })
    })
  }
  return maxTgt > 0 ? maxTgt : 0
})

// Navigation Sections
const hasScheduleData = computed(() => (activeTournamentData.value?.schedule?.length || 0) > 0)
const hasFopData = computed(() => (activeTournamentData.value?.field_of_play?.length || 0) > 0)
const hasEntriesData = computed(() => normalizedEntriesList.value.length > 0)
const hasQualificationsData = computed(() => normalizedQualsList.value.length > 0)
const hasBracketsData = computed(() => normalizedBracketsList.value.length > 0 || Object.keys(activeTournamentData.value?.brackets || {}).length > 0)
const hasMedalsData = computed(() => (activeTournamentData.value?.medals?.length || 0) > 0)

const navigationSections = computed(() => {
  const list = [
    { id: 'overview', title: t('overview_title'), icon: 'ph:info-bold' }
  ]
  if (hasScheduleData.value) list.push({ id: 'schedule', title: t('schedule_title'), icon: 'ph:calendar-check-bold' })
  if (hasFopData.value) list.push({ id: 'fop', title: t('fop_title'), icon: 'ph:target-bold' })
  if (hasEntriesData.value) list.push({ id: 'athletes', title: t('athletes_title'), icon: 'ph:users-four-bold' })
  if (hasQualificationsData.value) list.push({ id: 'qualifications', title: t('qualifications_title'), icon: 'ph:medal-bold' })
  if (hasBracketsData.value) list.push({ id: 'brackets', title: t('brackets_title'), icon: 'ph:sword-bold' })
  if (hasMedalsData.value) list.push({ id: 'medals', title: t('medals_title'), icon: 'ph:trophy-bold' })
  list.push({ id: 'related', title: t('related_title'), icon: 'ph:trophy-bold' })
  return list
})

// Schedule Handling
const parsedScheduleDays = computed(() => {
  const raw = activeTournamentData.value?.schedule || []
  if (!Array.isArray(raw)) return []
  
  if (raw.length > 0 && (raw[0].sessions || raw[0].date_label)) {
    return raw.map((d, idx) => ({
      day_index: idx + 1,
      date_label: d.date_label || `Hari ${idx + 1}`,
      divisions: d.divisions || '',
      sessions: Array.isArray(d.sessions) ? d.sessions.map(s => {
        let tStart = s.time_start || s.time || '08:00'
        let tEnd = s.time_end || ''
        if (tStart.includes(' - ')) {
          const parts = tStart.split(' - ')
          tStart = parts[0].trim()
          tEnd = parts[1].trim()
        }
        return {
          ...s,
          time_start: tStart,
          time_end: tEnd
        }
      }) : []
    }))
  }
  
  const map = {}
  raw.forEach(item => {
    const key = item.date || item.day || item.event_date || 'Day 1'
    if (!map[key]) {
      map[key] = {
        day_index: Object.keys(map).length + 1,
        date_label: key,
        divisions: '',
        sessions: []
      }
    }

    let tStart = item.time_start || item.time || item.time_range || item.time_slot || '08:00'
    let tEnd = item.time_end || ''
    if (tStart.includes(' - ')) {
      const parts = tStart.split(' - ')
      tStart = parts[0].trim()
      tEnd = parts[1].trim()
    }

    let sType = item.type
    const stg = (item.stage || item.phase || '').toLowerCase()
    const ttl = (item.activity || item.title || item.event || item.name || '').toLowerCase()
    if (!sType) {
      if (stg.includes('upacara') || stg.includes('upp') || stg.includes('award') || ttl.includes('upp') || ttl.includes('upacara')) {
        sType = 'ceremony'
      } else if (stg.includes('registrasi') || stg.includes('meeting') || ttl.includes('registrasi') || ttl.includes('technical')) {
        sType = 'meeting'
      } else if (stg.includes('persiapan') || stg.includes('istirahat') || stg.includes('break') || ttl.includes('persiapan') || ttl.includes('ishoma') || ttl.includes('istirahat')) {
        sType = 'break'
      } else if (stg.includes('final') || ttl.includes('final') || ttl.includes('bronze') || ttl.includes('gold')) {
        sType = 'finals'
      } else if (stg.includes('eliminasi') || stg.includes('semifinal') || stg.includes('gugur') || ttl.includes('perempat') || ttl.includes('semifinal') || ttl.includes('1/4') || ttl.includes('1/2')) {
        sType = 'elimination'
      } else if (stg.includes('kualifikasi') || ttl.includes('kualifikasi')) {
        sType = 'qualification'
      } else {
        sType = 'competition'
      }
    }

    map[key].sessions.push({
      time_start: tStart,
      time_end: tEnd,
      duration: item.duration || (tEnd && tEnd !== 'Selesai' ? `${tStart} - ${tEnd}` : ''),
      title: item.activity || item.title || item.event || item.name || 'Official Match Schedule',
      notes: item.notes || item.distance || '',
      type: sType,
      stage: item.stage || item.phase || (sType === 'finals' ? 'Perebutan Medali' : sType === 'elimination' ? 'Babak Eliminasi' : sType === 'qualification' ? 'Babak Kualifikasi' : (sType === 'break' ? 'Persiapan Lapangan' : (sType === 'ceremony' ? 'Upacara Penghargaan (UPP)' : 'Babak Pertandingan')))
    })
  })
  return Object.values(map)
})

const availableScheduleDays = computed(() => {
  return parsedScheduleDays.value.map(d => d.date_label)
})

const totalScheduleEventsCount = computed(() => {
  let c = 0
  parsedScheduleDays.value.forEach(d => {
    c += d.sessions.length
  })
  return c
})

const filteredScheduleDays = computed(() => {
  if (!parsedScheduleDays.value.length) return []
  const activeDay = selectedScheduleDay.value || parsedScheduleDays.value[0]?.date_label
  return parsedScheduleDays.value.filter(d => d.date_label === activeDay)
})

watch(parsedScheduleDays, (days) => {
  if (days.length > 0) {
    if (!selectedScheduleDay.value || !days.some(d => d.date_label === selectedScheduleDay.value)) {
      selectedScheduleDay.value = days[0].date_label
    }
  }
}, { immediate: true })

// FOP Handling
const fopDaysList = computed(() => activeTournamentData.value?.field_of_play || [])
const activeFopSessions = computed(() => {
  const day = fopDaysList.value[selectedFopDayIndex.value]
  return day?.sessions || []
})

// Athletes Entries Handling
const uniqueEntriesClubs = computed(() => {
  const clubs = new Set()
  normalizedEntriesList.value.forEach(e => {
    const c = e.club || e.country
    if (c) clubs.add(c.trim())
  })
  return Array.from(clubs).sort()
})

const filteredEntries = computed(() => {
  let list = [...normalizedEntriesList.value]
  if (entriesClubFilter.value !== 'all') {
    list = list.filter(e => (e.club || e.country) === entriesClubFilter.value)
  }
  if (entriesSearchQuery.value.trim()) {
    const q = entriesSearchQuery.value.toLowerCase().trim()
    list = list.filter(e => (
      (e.name || e.athlete_name || '').toLowerCase().includes(q) ||
      (e.target || '').toLowerCase().includes(q) ||
      (e.bib || '').toLowerCase().includes(q) ||
      (e.code || e.club_code || '').toLowerCase().includes(q) ||
      (e.club || e.country || '').toLowerCase().includes(q) ||
      (e.category || '').toLowerCase().includes(q)
    ))
  }
  return list.sort((a, b) => {
    if (entriesSortKey.value === 'index') return 0
    const valA = (a[entriesSortKey.value] || a.athlete_name || a.club || a.category || '').toString().toLowerCase()
    const valB = (b[entriesSortKey.value] || b.athlete_name || b.club || b.category || '').toString().toLowerCase()
    return entriesSortAsc.value ? valA.localeCompare(valB, undefined, { numeric: true }) : valB.localeCompare(valA, undefined, { numeric: true })
  })
})

const totalEntriesPages = computed(() => Math.ceil(filteredEntries.value.length / entriesPageSize.value) || 1)
const paginatedEntriesData = computed(() => {
  const start = (entriesCurrentPage.value - 1) * entriesPageSize.value
  return filteredEntries.value.slice(start, start + entriesPageSize.value)
})

const handleSortEntries = (key) => {
  if (entriesSortKey.value === key) {
    entriesSortAsc.value = !entriesSortAsc.value
  } else {
    entriesSortKey.value = key
    entriesSortAsc.value = true
  }
}

// Qualifications Handling
const entriesColumns = computed(() => [
  { key: 'index', label: '#', align: 'center', width: 'w-14 min-w-[56px]', sortable: true },
  { key: 'name', label: t('col_name'), align: 'left', width: 'min-w-[240px]', sortable: true },
  { key: 'club', label: t('col_club'), align: 'left', width: 'min-w-[260px]', sortable: true },
  { key: 'category', label: t('col_category'), align: 'left', width: 'min-w-[220px]', sortable: true }
])

const hasDistance1 = computed(() => {
  return activeQualScores.value.some(q => q.distance_1 && String(q.distance_1).trim() !== '')
})

const hasDistance2 = computed(() => {
  return activeQualScores.value.some(q => q.distance_2 && String(q.distance_2).trim() !== '')
})

const qualColumns = computed(() => {
  const cols = [
    { key: 'rank', label: t('col_rank'), align: 'center', width: 'w-16 min-w-[64px]', sortable: true },
    { key: 'name', label: t('col_name'), align: 'left', width: 'min-w-[240px]', sortable: true },
    { key: 'club', label: t('col_club'), align: 'left', width: 'min-w-[260px]', sortable: true }
  ]
  if (hasDistance1.value) {
    cols.push({ key: 'distance_1', label: 'Dist. 1', align: 'center', width: 'min-w-[85px]', sortable: false })
  }
  if (hasDistance2.value) {
    cols.push({ key: 'distance_2', label: 'Dist. 2', align: 'center', width: 'min-w-[85px]', sortable: false })
  }
  cols.push(
    { key: 'score', label: t('col_score'), align: 'center', width: 'min-w-[100px]', sortable: true },
    { key: 'tens', label: t('col_10s'), align: 'center', width: 'min-w-[80px]', sortable: true },
    { key: 'xs', label: t('col_xs'), align: 'center', width: 'min-w-[80px]', sortable: true }
  )
  return cols
})

const handleSortQual = ({ key, asc }) => {
  qualSortKey.value = key
  qualSortAsc.value = asc
}

const availableQualificationCategories = computed(() => {
  const cats = new Set()
  normalizedQualsList.value.forEach(q => { if (q.category) cats.add(q.category) })
  return Array.from(cats)
})

const activeQualScores = computed(() => {
  const cat = selectedQualCategory.value || availableQualificationCategories.value[0]
  if (!cat) return []
  return normalizedQualsList.value.filter(q => q.category === cat)
})

const filteredQualScores = computed(() => {
  let list = [...activeQualScores.value]
  if (resultsSearchQuery.value.trim()) {
    const q = resultsSearchQuery.value.toLowerCase().trim()
    list = list.filter(r => (
      (r.name || r.athlete_name || '').toLowerCase().includes(q) ||
      (r.club || r.country || '').toLowerCase().includes(q)
    ))
  }
  return list.sort((a, b) => {
    const k = qualSortKey.value
    if (k === 'rank' || k === 'score' || k === 'tens' || k === 'xs') {
      const numA = Number(a[k] ?? 0)
      const numB = Number(b[k] ?? 0)
      return qualSortAsc.value ? numA - numB : numB - numA
    }
    const strA = (a[k] || a.name || a.athlete_name || a.club || '').toString().toLowerCase()
    const strB = (b[k] || b.name || b.athlete_name || b.club || '').toString().toLowerCase()
    return qualSortAsc.value ? strA.localeCompare(strB) : strB.localeCompare(strA)
  })
})

const totalQualPages = computed(() => Math.ceil(filteredQualScores.value.length / qualPageSize.value) || 1)
const paginatedQualScores = computed(() => {
  const start = (qualCurrentPage.value - 1) * qualPageSize.value
  return filteredQualScores.value.slice(start, start + qualPageSize.value)
})

// ─────────────────────────────────────────────────────────────
// ELIMINATION BRACKET DATA TRANSFORMATION FOR ARCHERIS COMPONENT
// ─────────────────────────────────────────────────────────────
const allBracketCategories = computed(() => {
  const rawBrackets = activeTournamentData.value?.brackets
  if (rawBrackets && typeof rawBrackets === 'object' && !Array.isArray(rawBrackets)) {
    return Object.keys(rawBrackets)
  }
  const cats = new Set()
  normalizedBracketsList.value.forEach(b => { if (b.category) cats.add(b.category) })
  return Array.from(cats)
})

const getCategoryBracketType = (cat) => {
  const c = String(cat || '').toLowerCase()
  if (c.includes('mix') || c.includes('campuran') || c.includes('mixed') || /\b(xb|cx|rx|xnu|xbs)\b/.test(c)) {
    return 'mix'
  }
  if (c.includes('team') || c.includes('beregu') || c.includes('regu')) {
    return 'team'
  }
  return 'single'
}

const availableBracketTypes = computed(() => {
  const types = new Set()
  allBracketCategories.value.forEach(cat => {
    types.add(getCategoryBracketType(cat))
  })
  const order = ['single', 'team', 'mix']
  return order.filter(t => types.has(t))
})

const availableBracketCategories = computed(() => {
  const all = allBracketCategories.value
  const activeType = selectedBracketType.value || 'single'
  const filtered = all.filter(cat => getCategoryBracketType(cat) === activeType)
  if (filtered.length > 0) return filtered
  return all
})

const currentArcherisBracketConfig = computed(() => {
  const cat = selectedBracketCategory.value || availableBracketCategories.value[0] || ''
  const isCompound = cat.toLowerCase().includes('compound')
  const rounds = currentArcherisBracketRounds.value
  const round1Matches = rounds[1] || []
  const bracketSize = Math.max(8, round1Matches.length * 2)
  return {
    format: isCompound ? 'compound_cumulative' : 'recurve_set',
    bracket_size: bracketSize
  }
})

const currentArcherisBracketRounds = computed(() => {
  const cat = selectedBracketCategory.value || availableBracketCategories.value[0] || ''
  if (!cat) return {}

  const rawBrackets = activeTournamentData.value?.brackets
  let catData = null
  if (rawBrackets && typeof rawBrackets === 'object') {
    catData = rawBrackets[cat]
  }
  if (!catData) {
    catData = normalizedBracketsList.value.filter(b => b.category === cat)
  }
  if (!catData) return {}

  let phasesList = []
  if (Array.isArray(catData)) {
    phasesList = catData
  } else if (typeof catData === 'object' && catData !== null) {
    if (Array.isArray(catData.phases)) {
      phasesList = catData.phases
    } else {
      Object.keys(catData).forEach(pName => {
        const val = catData[pName]
        if (Array.isArray(val)) {
          phasesList.push({ phase: pName, matches: val })
        } else if (val && typeof val === 'object') {
          phasesList.push({ phase: pName, matches: [val] })
        }
      })
    }
  }

  // Parse all matches using smart Ianseo column detection
  const parseMatchItem = (m, idx, phaseLabel) => {
    const a1Obj = m.athlete_1 || m.athlete1 || {}
    const a2Obj = m.athlete_2 || m.athlete2 || {}

    const a1 = String(m.archer1 || m.name1 || m.archer_a || m.name_a || a1Obj.name || m.athlete1_name || '').trim()
    const s1 = String(m.score1 !== undefined ? m.score1 : (m.score_a !== undefined ? m.score_a : (a1Obj.score !== undefined ? a1Obj.score : (m.athlete1_score || '')))).trim()
    const seed1 = String(m.seed1 || m.seed_a || a1Obj.seed || m.athlete1_seed || '').trim()
    const club1 = String(m.club1 || m.club_a || a1Obj.club || a1Obj.club_name || m.athlete1_club || '').trim()
    const sets1 = String(m.sets1 || m.sets_a || (Array.isArray(a1Obj.set_scores) ? a1Obj.set_scores.join(' ') : (a1Obj.set_scores || m.athlete1_sets || ''))).trim()

    const a2 = String(m.archer2 || m.name2 || m.archer_b || m.name_b || a2Obj.name || m.athlete2_name || '').trim()
    const s2 = String(m.score2 !== undefined ? m.score2 : (m.score_b !== undefined ? m.score_b : (a2Obj.score !== undefined ? a2Obj.score : (m.athlete2_score || '')))).trim()
    const seed2 = String(m.seed2 || m.seed_b || a2Obj.seed || m.athlete2_seed || '').trim()
    const club2 = String(m.club2 || m.club_b || a2Obj.club || a2Obj.club_name || m.athlete2_club || '').trim()
    const sets2 = String(m.sets2 || m.sets_b || (Array.isArray(a2Obj.set_scores) ? a2Obj.set_scores.join(' ') : (a2Obj.set_scores || m.athlete2_sets || ''))).trim()

    let nameA = 'TBD'
    let realSeedA = seed1
    let scoreA = s1

    if (/[a-zA-Z]/.test(a1)) {
      nameA = a1
      scoreA = s1
    } else if (/[a-zA-Z]/.test(s1)) {
      nameA = s1
      realSeedA = /^\d+$/.test(a1) ? a1 : seed1
    }

    let nameB = 'TBD'
    let realSeedB = seed2
    let scoreB = s2

    if (/[a-zA-Z]/.test(a2)) {
      nameB = a2
      scoreB = s2
    } else if (/[a-zA-Z]/.test(s2)) {
      nameB = s2
      realSeedB = /^\d+$/.test(a2) ? a2 : seed2
    }

    // If scores are non-numeric or empty, calculate set points from sets1 & sets2
    const arrA = sets1.split(/\s+/).map(Number).filter(n => !isNaN(n))
    const arrB = sets2.split(/\s+/).map(Number).filter(n => !isNaN(n))

    if (!/^\d+$/.test(scoreA) && arrA.length > 0 && arrB.length > 0) {
      let pA = 0
      let pB = 0
      for (let i = 0; i < Math.min(arrA.length, arrB.length); i++) {
        if (arrA[i] > arrB[i]) pA += 2
        else if (arrB[i] > arrA[i]) pB += 2
        else { pA += 1; pB += 1 }
      }
      scoreA = String(pA)
      scoreB = String(pB)
    }

    let winnerId = null
    const nA = parseFloat(scoreA)
    const nB = parseFloat(scoreB)
    if (a1Obj.is_winner || m.athlete1_is_winner || scoreA.toLowerCase() === 'bye' || (!isNaN(nA) && !isNaN(nB) && nA > nB)) {
      winnerId = 'a'
    } else if (a2Obj.is_winner || m.athlete2_is_winner || scoreB.toLowerCase() === 'bye' || (!isNaN(nA) && !isNaN(nB) && nB > nA)) {
      winnerId = 'b'
    }

    return {
      id: `m_${phaseLabel}_${idx}`,
      match_no: idx + 1,
      phase: phaseLabel,
      entry_a_id: 'a',
      entry_a_name: toTitleCase(nameA),
      entry_a_club: club1,
      entry_a_seed: realSeedA,
      set_points_a: scoreA,
      total_score_a: scoreA,
      sets_a: sets1,
      entry_b_id: 'b',
      entry_b_name: toTitleCase(nameB),
      entry_b_club: club2,
      entry_b_seed: realSeedB,
      set_points_b: scoreB,
      total_score_b: scoreB,
      sets_b: sets2,
      winner_entry_id: winnerId,
      is_bye: (nameA.toUpperCase() === 'BYE' || nameB.toUpperCase() === 'BYE')
    }
  }

  let allPreliminaryMatches = []
  let bronzeMatch = null

  phasesList.forEach(p => {
    const pName = String(p.phase || '')
    const pLower = pName.toLowerCase()
    const matches = Array.isArray(p.matches) ? p.matches : []

    matches.forEach((m, mIdx) => {
      const parsed = parseMatchItem(m, mIdx, pName)
      if (pLower.includes('bronze')) {
        bronzeMatch = parsed
      } else {
        allPreliminaryMatches.push(parsed)
      }
    })
  })

  // Structure matches into 1/8, Quarterfinals, Semifinals, Finals
  const total = allPreliminaryMatches.length
  const rounds = {}

  if (total >= 14) {
    // 16-archer bracket: 8 (1/8) -> 4 (QF) -> 2 (SF) -> Finals
    rounds[1] = allPreliminaryMatches.slice(0, 8)
    rounds[2] = allPreliminaryMatches.slice(8, 12)
    rounds[3] = allPreliminaryMatches.slice(12, 14)
    const finals = []
    if (total >= 15) finals.push(allPreliminaryMatches[14])
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[4] = finals
  } else if (total >= 8) {
    // 1/8 with byes: last 2 are SF, 4 before SF are QF, rest are 1/8
    const sf = allPreliminaryMatches.slice(total - 2)
    const qf = allPreliminaryMatches.slice(total - 6, total - 2)
    const r16 = allPreliminaryMatches.slice(0, total - 6)

    let rIdx = 1
    if (r16.length > 0) {
      rounds[rIdx] = r16
      rIdx++
    }
    rounds[rIdx] = qf
    rIdx++
    rounds[rIdx] = sf
    rIdx++
    const finals = []
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[rIdx] = finals
  } else if (total >= 6) {
    // 8-archer bracket: 4 (QF) -> 2 (SF) -> Finals
    rounds[1] = allPreliminaryMatches.slice(0, 4)
    rounds[2] = allPreliminaryMatches.slice(4, 6)
    const finals = []
    if (total >= 7) finals.push(allPreliminaryMatches[6])
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[3] = finals
  } else if (total >= 2) {
    // 4-archer bracket: 2 (SF) -> Finals
    rounds[1] = allPreliminaryMatches.slice(0, 2)
    const finals = []
    if (total >= 3) finals.push(allPreliminaryMatches[2])
    if (bronzeMatch) finals.push(bronzeMatch)
    rounds[2] = finals
  } else if (total > 0) {
    rounds[1] = allPreliminaryMatches
    if (bronzeMatch) rounds[2] = [bronzeMatch]
  } else if (bronzeMatch) {
    rounds[1] = [bronzeMatch]
  }

  return rounds
})

const hasCurrentBracketRounds = computed(() => {
  const r = currentArcherisBracketRounds.value
  return r && Object.keys(r).length > 0 && Object.values(r).some(arr => arr.length > 0)
})

// Podium Standings
const availablePodiumCategories = computed(() => {
  const set = new Set()
  ;(activeTournamentData.value?.podium || []).forEach(p => { if (p.category) set.add(p.category) })
  if (set.size === 0) {
    categoriesList.value.forEach(c => set.add(c))
  }
  return Array.from(set)
})

const currentPodiumCategoryData = computed(() => {
  const cat = selectedPodiumCategory.value || availablePodiumCategories.value[0]
  if (!cat) return {}
  const found = (activeTournamentData.value?.podium || []).find(p => p.category === cat)
  if (found) return found

  const quals = normalizedQualsList.value.filter(q => q.category === cat)
  return {
    category: cat,
    gold: quals[0] || null,
    silver: quals[1] || null,
    bronze: quals[2] || null
  }
})

// Medal Leaderboard Table
const medalTallyList = computed(() => activeTournamentData.value?.medals || [])

const sortedMedalTally = computed(() => {
  let list = medalTallyList.value.map((m, idx) => ({
    ...m,
    rank: Number(m.rank) || idx + 1,
    gold: Number(m.gold || 0),
    silver: Number(m.silver || 0),
    bronze: Number(m.bronze || 0),
    total: m.total !== undefined ? Number(m.total) : (Number(m.gold || 0) + Number(m.silver || 0) + Number(m.bronze || 0))
  }))
  if (searchMedalClub.value.trim()) {
    const q = searchMedalClub.value.toLowerCase().trim()
    list = list.filter(m => (m.club || '').toLowerCase().includes(q))
  }
  return list.sort((a, b) => {
    if (medalSortKey.value === 'club') {
      const cA = (a.club || '').toLowerCase()
      const cB = (b.club || '').toLowerCase()
      return medalSortAsc.value ? cA.localeCompare(cB) : cB.localeCompare(cA)
    }
    const valA = Number(a[medalSortKey.value]) || 0
    const valB = Number(b[medalSortKey.value]) || 0
    return medalSortAsc.value ? valA - valB : valB - valA
  })
})

const totalMedalPages = computed(() => Math.ceil(sortedMedalTally.value.length / medalsPageSize.value) || 1)
const paginatedMedalsData = computed(() => {
  const start = (medalsCurrentPage.value - 1) * medalsPageSize.value
  return sortedMedalTally.value.slice(start, start + medalsPageSize.value)
})

const handleSortMedals = (key) => {
  if (medalSortKey.value === key) {
    medalSortAsc.value = !medalSortAsc.value
  } else {
    medalSortKey.value = key
    medalSortAsc.value = key === 'rank'
  }
}

// ─────────────────────────────────────────────────────────────
// DOCUMENTATION & IANSEO LINKS
// ─────────────────────────────────────────────────────────────
const thbDocument = computed(() => {
  const docs = activeTournamentData.value?.documents || []
  return docs.find(d => d.type === 'thb' || (d.name || '').toLowerCase().includes('handbook')) || docs[0]
})

const ianseoUrl = computed(() => {
  if (activeTournament.value?.source_url) return activeTournament.value.source_url
  const rawId = String(activeTournament.value?.external_id || activeTournament.value?.id || '').replace(/^ianseo-/, '')
  if (rawId && /^\d+$/.test(rawId)) {
    return `https://ianseo.net/Details.php?toId=${rawId}`
  }
  const dataToId = activeTournamentData.value?.toId || activeTournamentData.value?.to_id || activeTournamentData.value?.id
  if (dataToId && /^\d+$/.test(String(dataToId))) {
    return `https://ianseo.net/Details.php?toId=${dataToId}`
  }
  return 'https://ianseo.net'
})

// ─────────────────────────────────────────────────────────────
// SHARE DIALOG MODAL & SOCIAL BROADCAST
// ─────────────────────────────────────────────────────────────
const currentShareUrl = computed(() => {
  if (process.client) return window.location.href
  return `https://archeris.net/tournaments/external/${activeTournament.value?.external_id || activeTournament.value?.slug || ''}`
})

const socialShareOptions = [
  { id: 'whatsapp', name: 'WhatsApp', icon: 'ph:whatsapp-logo-fill', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { id: 'telegram', name: 'Telegram', icon: 'ph:telegram-logo-fill', color: 'text-sky-600', bg: 'bg-sky-50' },
  { id: 'twitter', name: 'X / Twitter', icon: 'ph:twitter-logo-fill', color: 'text-slate-900', bg: 'bg-slate-100' },
  { id: 'facebook', name: 'Facebook', icon: 'ph:facebook-logo-fill', color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'ph:linkedin-logo-fill', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { id: 'email', name: 'Email', icon: 'ph:envelope-simple-fill', color: 'text-amber-600', bg: 'bg-amber-50' }
]

const copyShareUrl = () => {
  if (process.client && navigator.clipboard) {
    navigator.clipboard.writeText(currentShareUrl.value)
    copiedShareLink.value = true
    setTimeout(() => { copiedShareLink.value = false }, 2500)
  }
}

const shareToSocialPlatform = (platform) => {
  const url = encodeURIComponent(currentShareUrl.value)
  const title = encodeURIComponent(activeTournament.value?.name || 'Tournament')
  const text = encodeURIComponent(`Lihat turnamen ${activeTournament.value?.name || ''} di Archeris!`)
  
  let shareUrl = ''
  switch (platform) {
    case 'whatsapp':
      shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`
      break
    case 'telegram':
      shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
      break
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
      break
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
      break
    case 'linkedin':
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
      break
    case 'email':
      shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`
      break
  }
  if (shareUrl && process.client) {
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }
}

// ─────────────────────────────────────────────────────────────
// UTILITIES & HELPERS
// ─────────────────────────────────────────────────────────────
const toTitleCase = (str) => {
  if (!str) return ''
  return String(str)
    .toLowerCase()
    .replace(/(^|[\s\-_/(\[])\w/g, match => match.toUpperCase())
}

const formatDateRange = (start, end) => {
  if (!start) return 'Upcoming Date'
  const locale = currentLang.value === 'id' ? 'id-ID' : (currentLang.value === 'it' ? 'it-IT' : 'en-US')
  if (!end || start === end) return new Date(start).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })
  return `${new Date(start).toLocaleDateString(locale, { day: 'numeric', month: 'short' })} - ${new Date(end).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}`
}

const formatCityDisplay = (city, location) => {
  const c = city || ''
  const l = location || ''
  if (c && l && c.toLowerCase() !== l.toLowerCase()) return `${toTitleCase(c)}, ${toTitleCase(l)}`
  return toTitleCase(c || l || 'Indonesia')
}

const getSortIcon = (key, currentKey, isAsc) => {
  if (key !== currentKey) return 'ph:arrows-down-up'
  return isAsc ? 'ph:sort-ascending-bold' : 'ph:sort-descending-bold'
}

const getArcherInitials = (name) => {
  if (!name) return 'A'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

// ─────────────────────────────────────────────────────────────
// SYNC CATEGORIES & SCROLL SPY
// ─────────────────────────────────────────────────────────────
watch(categoriesList, (newCats) => {
  if (newCats.length > 0 && !selectedCategory.value) {
    selectedCategory.value = newCats[0]
    selectedQualCategory.value = newCats[0]
    selectedBracketCategory.value = newCats[0]
    selectedPodiumCategory.value = newCats[0]
  }
}, { immediate: true })

const updateScrollSpy = () => {
  if (!process.client) return
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  scrollProgress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

  const sections = navigationSections.value.map(s => document.getElementById(s.id)).filter(Boolean)
  for (let i = sections.length - 1; i >= 0; i--) {
    const el = sections[i]
    if (el.offsetTop - 180 <= scrollTop) {
      activeSectionId.value = el.id
      break
    }
  }
}

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', updateScrollSpy, { passive: true })
    updateScrollSpy()
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', updateScrollSpy)
  }
})
</script>

<style scoped>
:deep(.section-badge-icon svg) {
  vertical-align: 0 !important;
  display: block !important;
  margin: auto !important;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
