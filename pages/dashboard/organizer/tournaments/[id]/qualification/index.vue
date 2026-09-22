<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_qualification.title')"
      :subtitle="t('event_qualification.manage_desc', { event: eventName || 'Event' })"
      icon="ph:crosshair"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_qualification.title') }
      ]"
    >
      <template #actions>
        <BaseButton
          variant="primary"
          icon="ph:plus-bold"
          class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
          :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
          @click="isSubscriptionActive ? openCreateModal() : (showPremiumModal = true)">
          {{ t('event_qualification.add_session') }}
        </BaseButton>
      </template>
    </DashboardHeader>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

    <!-- Sessions List View -->
    <div class="space-y-6">
      <!-- Sessions List (event-level) -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <Icon icon="ph:calendar-bold" class="text-xl" />
            </div>
            <h2 class="text-base font-bold text-navy">{{ t('event_qualification.session_list') }}</h2>
          </div>
        </div>

        <div v-if="loadingSessions" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="p-5 rounded-xl border border-gray-100 animate-pulse">
            <div class="flex items-start gap-3">
              <div class="size-12 bg-gray-100 rounded-xl"></div>
              <div class="flex-1">
                <div class="h-5 bg-gray-100 rounded mb-2"></div>
                <div class="h-4 bg-gray-50 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="qualificationSessions.length === 0"
          class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Icon icon="ph:calendar-blank" class="text-4xl text-gray-300 mx-auto mb-3" />
          <div class="text-sm font-bold text-gray-600 mb-1">{{ t('event_qualification.no_session') }}</div>
          <div class="text-xs text-gray-400">{{ t('event_qualification.no_session_desc') }}</div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="session in qualificationSessions" :key="session.uuid" @click="goToSession(session)"
            class="rounded-3xl border border-slate-200/90 hover:border-primary/80 hover:shadow-xl hover:shadow-navy/5 transition-all duration-300 bg-white flex flex-col justify-between overflow-hidden relative group cursor-pointer text-left">

            <!-- Themed Signature Navy Card Header -->
            <div class="relative overflow-hidden p-5 bg-gradient-to-r from-navy via-navy to-navy/95 text-white border-b border-primary/20">
              <!-- Theme Motif Pattern -->
              <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
              <!-- Decorative Top Accent Line -->
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

              <div class="relative z-10 flex items-start justify-between gap-3">
                <div class="min-w-0 flex-1 space-y-2">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-[10px] font-extrabold font-mono text-primary bg-primary/15 border border-primary/30 px-2 py-0.5 rounded-md">
                      {{ session.session_code }}
                    </span>
                    <span v-if="session.is_locked"
                      class="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded-md">
                      <Icon icon="ph:lock-fill" class="text-xs" />
                      {{ t('event_qualification.session_locked') }}
                    </span>
                    <span v-else
                      class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                      <Icon icon="ph:lock-open-bold" class="text-xs" />
                      {{ t('event_qualification.session_unlocked') }}
                    </span>
                  </div>

                  <h3 class="font-black text-white text-base sm:text-lg leading-tight group-hover:text-primary transition-colors truncate">
                    {{ session.name }}
                  </h3>
                </div>

                <!-- Action Edit Button in Header -->
                <button type="button"
                  @click.stop="isSubscriptionActive ? editSession(session) : (showPremiumModal = true)"
                  class="size-8 rounded-xl bg-white/10 hover:bg-primary hover:text-navy text-white/80 border border-white/15 transition-all flex items-center justify-center active:scale-95 shrink-0"
                  :title="t('event_qualification.edit_session')">
                  <Icon icon="ph:pencil-simple-bold" class="text-sm" />
                </button>
              </div>
            </div>

            <!-- Card Body: Categories, Schedule, Metrics -->
            <div class="p-5 sm:p-6 bg-slate-50/70 flex-1 space-y-4">
              
              <!-- Assigned Categories Preview -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-[11px] font-extrabold text-slate-500">
                  <span class="flex items-center gap-1.5">
                    <Icon icon="ph:folders-bold" class="text-slate-400 text-xs" />
                    {{ t('event_qualification.assigned_categories') }}
                  </span>
                  <span class="text-[10px] font-mono font-bold bg-slate-200/80 text-slate-600 px-1.5 py-0.2 rounded-md">
                    {{ getSessionCategories(session).length }}
                  </span>
                </div>

                <div v-if="getSessionCategories(session).length > 0" class="flex flex-wrap gap-1.5">
                  <div v-for="cat in getSessionCategories(session).slice(0, 2)" :key="cat.id"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200/90 text-[11px] font-bold text-navy shadow-2xs">
                    <img
                      :src="'/' + getCategoryIcon(`${cat.division_name} ${cat.event_type_name} ${cat.gender_division_name}`)"
                      :alt="cat.division_name"
                      class="size-3.5 object-contain shrink-0" />
                    <span class="truncate max-w-[140px]">{{ getCategoryName(cat) }}</span>
                  </div>
                  <span v-if="getSessionCategories(session).length > 2"
                    class="inline-flex items-center px-2 py-1 rounded-lg bg-slate-200/70 border border-slate-300 text-[10px] font-extrabold text-slate-600">
                    +{{ getSessionCategories(session).length - 2 }}
                  </span>
                </div>
                <div v-else class="px-3 py-2 rounded-xl bg-white border border-dashed border-slate-200 text-[11px] text-slate-400 italic">
                  {{ t('event_qualification.no_categories_assigned') }}
                </div>
              </div>

              <!-- Schedule Box -->
              <div v-if="session.session_date || session.start_time || session.end_time" class="bg-white rounded-2xl p-3 border border-slate-200/90 space-y-1.5 shadow-2xs">
                <div v-if="session.session_date" class="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Icon icon="ph:calendar-blank-bold" class="text-primary text-sm shrink-0" />
                  <span class="truncate">{{ formatDate(session.session_date) }}</span>
                </div>

                <div v-if="session.start_time || session.end_time" class="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Icon icon="ph:clock-bold" class="text-primary text-sm shrink-0" />
                  <span class="truncate font-mono">
                    {{ formatTime(session.start_time) }} - {{ formatTime(session.end_time) }}
                  </span>
                </div>
              </div>
              <div v-else class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-dashed border-slate-200 text-xs text-slate-400 font-medium">
                <Icon icon="ph:calendar-blank-bold" class="text-slate-400 text-sm shrink-0" />
                <span class="text-[11px]">{{ t('event_qualification.schedule_not_set') }}</span>
              </div>

              <!-- Format Rule Metrics (3-column pill grid) -->
              <div class="grid grid-cols-3 gap-2">
                <div class="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-center">
                  <div class="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <Icon icon="ph:arrow-clockwise-bold" class="text-primary text-xs" />
                    <span>{{ t('event_qualification.ends') }}</span>
                  </div>
                  <span class="text-sm font-black text-navy font-mono mt-0.5">{{ session.total_ends }}</span>
                </div>

                <div class="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-center">
                  <div class="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <Icon icon="ph:crosshair-bold" class="text-primary text-xs" />
                    <span>{{ t('event_qualification.arrows_short') }}</span>
                  </div>
                  <span class="text-sm font-black text-navy font-mono mt-0.5">{{ session.arrows_per_end }}</span>
                </div>

                <div class="flex flex-col items-center justify-center p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-2xs text-center">
                  <div class="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <Icon icon="ph:target-bold" class="text-primary text-xs" />
                    <span>{{ t('event_qualification.total_arrows') }}</span>
                  </div>
                  <span class="text-sm font-black text-navy font-mono mt-0.5">{{ (session.total_ends || 0) * (session.arrows_per_end || 0) }}</span>
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-white border-t border-slate-200/90 mt-auto">
              <div class="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-xl">
                <Icon icon="ph:users-three-bold" class="text-navy text-sm shrink-0" />
                <span class="text-xs font-black text-navy">
                  <span class="font-mono">{{ session.participant_count || 0 }}</span> {{ t('event_qualification.archers') }}
                </span>
              </div>
              <div
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-btn-text group-hover:bg-primary-dark text-xs font-black transition-all active:scale-95 shadow-2xs">
                <span>{{ t('event_qualification.manage') }}</span>
                <Icon icon="ph:arrow-right-bold" class="text-xs group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 space-y-5">
        <!-- Section Header Bar (Input Scoring Style) -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center font-bold shrink-0 shadow-2xs">
              <Icon icon="ph:trophy-bold" class="text-xl" />
            </div>
            <div>
                <h2 class="text-base sm:text-lg font-black text-navy leading-tight">
                  {{ t('event_qualification.qualification_results') }}
                </h2>
              <div class="text-xs text-slate-500 font-medium mt-0.5">
                {{ t('event_qualification.choose_category') }}
              </div>
            </div>
          </div>
          <div class="w-full sm:w-72">
            <BaseSelect
              v-model="selectedCategory"
              :items="mappedCategoriesForFilter"
              :placeholder="t('event_qualification.choose_category')"
              searchable
              @update:modelValue="(val) => selectCategory(val)"
            />
          </div>
        </div>

        <!-- Category Selector Chips (Input Scoring Chips Style) -->
        <div v-if="loadingCategories" class="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
          <div v-for="i in 4" :key="i" class="h-11 w-48 bg-slate-100 rounded-xl animate-pulse shrink-0"></div>
        </div>

        <div v-else-if="categories.length === 0"
          class="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <Icon icon="ph:folder-notch-open" class="text-3xl text-slate-300 mx-auto mb-2" />
          <div class="text-xs font-bold text-slate-600 mb-0.5">{{ t('event_qualification.no_category') }}</div>
          <div class="text-[11px] text-slate-400">{{ t('event_qualification.no_category_desc') }}</div>
        </div>

        <div v-else>
          <!-- Horizontal Chips Match Switcher Style for Categories -->
          <div class="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide mb-6">
            <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)"
              type="button"
              :class="[
                'px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-3 cursor-pointer shrink-0 border select-none',
                selectedCategory === category.id
                  ? 'bg-navy text-primary border-navy ring-2 ring-primary/20 font-black'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-primary hover:bg-white'
              ]">
              <!-- Division Icon -->
              <div class="size-6 rounded-lg flex items-center justify-center p-1 shrink-0 overflow-hidden"
                :class="selectedCategory === category.id ? 'bg-white/20' : 'bg-navy/5'">
                <img
                  :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                  :alt="category.division_name"
                  class="w-full h-full object-contain" />
              </div>

              <!-- Category Name -->
              <span class="truncate max-w-[200px]">{{ getCategoryName(category) }}</span>

              <!-- Participant Count Badge -->
              <span :class="[
                'px-2 py-0.5 rounded-lg text-[11px] font-mono font-bold',
                selectedCategory === category.id ? 'bg-primary text-navy' : 'bg-slate-200 text-slate-700'
              ]">
                {{ category.participant_count || 0 }}
              </span>
            </button>
          </div>

          <!-- Results Table -->
          <div v-if="loadingReport" class="bg-gray-50 rounded-xl p-12 text-center">
            <div class="animate-spin inline-block">
              <Icon icon="ph:circle-notch" class="text-4xl text-primary" />
            </div>
            <div class="text-gray-500 mt-4">{{ t('event_qualification.loading_report') }}</div>
          </div>

          <div v-else-if="selectedCategory && validReportEntries.length > 0"
            class="bg-white rounded-xl border border-gray-200 overflow-x-auto no-scrollbar">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/50 border-b border-gray-100">
                  <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400  tracking-widest w-24">
                    {{ t('event_qualification.position') }}</th>
                  <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 tracking-widest min-w-[350px]">
                    {{ t('event_qualification.archer_name') }}</th>
                  <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 tracking-widest min-w-[400px]">
                    {{ t('event_qualification.scores_per_end') }}</th>
                  <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400  tracking-widest w-32">
                    {{ t('event_qualification.total_score') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(archer, index) in paginatedEntries" :key="archer.rowKey"
                  class="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center justify-center size-8 rounded-lg bg-navy text-white font-bold text-sm">{{
                        (currentPage - 1) * pageSize + index + 1 }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img :src="useImageOrDefault(archer.avatar_url, archer.archer_name)"
                        class="size-9 rounded-lg object-cover border border-gray-100" />
                      <div>
                        <div class=" text-xs sm:text-base font-bold text-navy leading-tight">{{ archer.archer_name }}
                        </div>
                        <div class="flex items-center gap-2 mt-1">
                          <div class="text-[10px] text-gray-400 font-bold tracking-tighter">{{
                            archer.club_name
                            ||
                            t('event_qualification.independent') }}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div v-if="archer.processedSessions?.length > 0" class="flex flex-col gap-3">
                      <div v-for="session in archer.processedSessions" :key="session.session_code"
                        class="flex items-center gap-3">
                        <!-- Session Label -->
                        <div class="w-6 shrink-0">
                          <span
                            class="text-[9px] px-1.5 py-0.5 rounded-md bg-navy text-white font-black capitalize tracking-widest whitespace-nowrap">
                            S{{ session.sessionNumber }}
                          </span>
                        </div>

                        <!-- End Scores Chips -->
                        <div class="flex items-center gap-2">
                          <div v-for="(s, sIdx) in session.displayScores" :key="sIdx"
                            class="flex flex-col items-center bg-gray-50 border border-gray-100 rounded-lg overflow-hidden shadow-sm group/score hover:border-primary/50 transition-all">
                            <div class="bg-navy/5 px-2 py-0.5 w-full text-center border-b border-gray-100">
                              <span class="text-[8px] font-black text-gray-400 tracking-tighter">E{{ sIdx + 1
                              }}</span>
                            </div>
                            <div class="px-3 py-1 min-w-[45px] flex items-center justify-center">
                              <span
                                class="text-[12px] font-black text-navy group-hover/score:text-primary transition-colors">{{
                                  s }}</span>
                            </div>
                          </div>

                          <!-- More Ends Chip -->
                          <div v-if="session.remainingEnds > 0"
                            class="p-2 bg-gray-50 text-gray-400 my-auto rounded-lg flex items-center justify-center border border-gray-100 self-end shadow-inner">
                            <span class="text-[10px] font-black tracking-widest">+{{ session.remainingEnds }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else
                      class="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border-2 border-dashed border-gray-100 max-w-[150px]">
                      <span class=" text-xs text-gray-400 font-black italic tracking-widest">{{ t('event_qualification.empty') }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="text-xl font-black text-navy">{{ archer.total_score || 0 }}</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1"
              class="px-6 py-4 bg-gray-50/30 border-t border-gray-100 flex items-center justify-between">
              <div class="text-xs text-gray-400 font-bold">
                {{ t('event_qualification.showing_pagination', { start: (currentPage - 1) * pageSize + 1, end: Math.min(currentPage * pageSize, validReportEntries.length), total: validReportEntries.length }) }}
              </div>
              <div class="flex items-center gap-2">
                <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1"
                  class="size-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all shadow-sm bg-white">
                  <Icon icon="ph:caret-left-bold" />
                </button>

                <div class="flex items-center gap-1">
                  <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="[
                    'size-8 rounded-lg text-xs font-black transition-all',
                    currentPage === page
                      ? 'bg-primary text-navy shadow-md shadow-primary/20'
                      : 'bg-white border border-gray-200 text-gray-400 hover:border-primary hover:text-primary'
                  ]">
                    {{ page }}
                  </button>
                </div>

                <button @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="size-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all shadow-sm bg-white">
                  <Icon icon="ph:caret-right-bold" />
                </button>
              </div>
            </div>
          </div>

          <div v-else-if="selectedCategory"
            class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Icon icon="ph:users-three" class="text-5xl text-gray-300 mx-auto mb-4" />
            <div class="text-gray-500">{{ t('event_qualification.no_scores_in_category') }}</div>
          </div>

          <div v-else class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Icon icon="ph:selection" class="text-5xl text-gray-300 mx-auto mb-4" />
            <div class="text-gray-500">{{ t('event_qualification.select_category_to_view') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Session Modal Dialog -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showSessionDialog"
        class="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        @click.self="showSessionDialog = false">
        <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col my-auto">
          
          <!-- Signature Navy Header -->
          <div class="relative overflow-hidden px-6 py-5 bg-gradient-to-r from-navy via-navy to-navy/90 text-white flex items-center justify-between border-b border-primary/20">
            <div class="absolute inset-0"
              style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>

            <div class="relative flex items-center gap-3.5 min-w-0">
              <div class="size-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-primary text-xl shrink-0 shadow-sm">
                <Icon :icon="editingSessionId ? 'ph:pencil-simple-bold' : 'ph:calendar-plus-bold'" />
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-black tracking-tight text-white leading-tight truncate">
                  {{ modalTitle }}
                </h3>
                <div class="text-xs text-slate-300 truncate mt-0.5">
                  {{ t('event_qualification.configure_schedule_desc') }}
                </div>
              </div>
            </div>

            <button @click="showSessionDialog = false"
              class="relative size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors shrink-0 ml-4">
              <Icon icon="ph:x-bold" class="text-sm" />
            </button>
          </div>

          <!-- Modal Body (Sectioned Cards) -->
          <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
            
            <!-- Section 1: Session Info -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Icon icon="ph:identification-card-bold" class="text-slate-600 text-base" />
                <span>{{ t('event_qualification.session_info') }}</span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1.5">
                  {{ t('event_qualification.session_title_label') }} <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                  <Icon icon="ph:text-t-bold"
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
                  <input v-model="newSessionName" type="text"
                    :placeholder="t('event_qualification.session_title_placeholder')"
                    class="w-full h-11 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-slate-800 transition-all shadow-xs" />
                </div>
              </div>
            </div>

            <!-- Section 2: Format Pertandingan & Scoring Rules -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Icon icon="ph:target-bold" class="text-slate-600 text-base" />
                  <span>{{ t('event_qualification.scoring_rules') }}</span>
                </div>
                <div class="px-2.5 py-1 bg-primary/15 text-navy font-bold text-[11px] rounded-lg border border-primary/30">
                  Total: {{ (newSessionEnds || 0) * (newSessionArrows || 0) }} {{ t('event_qualification.arrows') }}
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <!-- Stepper 1: Ends -->
                <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <label class="text-[11px] font-bold text-slate-500 block mb-2 text-center truncate">
                    {{ t('event_qualification.number_of_ends') }}
                  </label>
                  <div class="flex items-center justify-between gap-2">
                    <button type="button" @click="newSessionEnds = Math.max(1, newSessionEnds - 1)"
                      class="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all">
                      <Icon icon="ph:minus-bold" class="text-xs" />
                    </button>
                    <span class="text-base sm:text-lg font-black text-slate-900 tabular-nums">{{ newSessionEnds }}</span>
                    <button type="button" @click="newSessionEnds++"
                      class="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all">
                      <Icon icon="ph:plus-bold" class="text-xs" />
                    </button>
                  </div>
                </div>

                <!-- Stepper 2: Arrows Per End -->
                <div class="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <label class="text-[11px] font-bold text-slate-500 block mb-2 text-center truncate">
                    {{ t('event_qualification.arrows_per_end') }}
                  </label>
                  <div class="flex items-center justify-between gap-2">
                    <button type="button" @click="newSessionArrows = Math.max(1, newSessionArrows - 1)"
                      class="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all">
                      <Icon icon="ph:minus-bold" class="text-xs" />
                    </button>
                    <span class="text-base sm:text-lg font-black text-slate-900 tabular-nums">{{ newSessionArrows }}</span>
                    <button type="button" @click="newSessionArrows = Math.min(12, newSessionArrows + 1)"
                      class="size-8 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all">
                      <Icon icon="ph:plus-bold" class="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Category Assignment -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Icon icon="ph:trophy-bold" class="text-slate-600 text-base" />
                  <span>{{ t('event_qualification.event_category_label') }} <span class="text-red-500">*</span></span>
                </div>
                <span class="text-[11px] font-semibold text-slate-500">
                  {{ selectedSessionCategoryIds.length }} {{ t('participant.edit.categories_selected') }}
                </span>
              </div>

              <!-- Search Bar for Categories -->
              <div v-if="categories.length > 5" class="relative">
                <Icon icon="ph:magnifying-glass"
                  class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                <input v-model="sessionCategorySearch" type="text"
                  :placeholder="t('event_qualification.search_category')"
                  class="w-full h-9 pl-9 pr-3 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-slate-800 transition-all" />
              </div>

              <!-- Category List -->
              <div class="bg-white rounded-xl border border-slate-200/80 p-2 max-h-48 overflow-y-auto space-y-1.5 custom-scrollbar">
                <div v-for="category in filteredSessionCategories" :key="category.id"
                  class="flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer select-none group"
                  :class="selectedSessionCategoryIds.includes(category.id)
                    ? 'bg-slate-50 border-slate-800 text-slate-900 shadow-2xs'
                    : 'bg-white border-transparent hover:border-slate-200 text-slate-700'"
                  @click="toggleSessionCategory(category.id)">
                  <div class="size-4.5 rounded-md border flex items-center justify-center transition-all shrink-0"
                    :class="selectedSessionCategoryIds.includes(category.id)
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-300 group-hover:border-slate-400'">
                    <Icon v-if="selectedSessionCategoryIds.includes(category.id)" icon="ph:check-bold" class="text-[10px]" />
                  </div>
                  <div class="flex-1 min-w-0 flex items-center justify-between gap-2">
                    <span class="text-xs font-bold truncate">{{ getCategoryName(category) }}</span>
                    <span v-if="category.participant_count" class="text-[10px] text-slate-400 shrink-0 font-medium">
                      {{ category.participant_count }} {{ t('event_qualification.archers').toLowerCase() }}
                    </span>
                  </div>
                </div>

                <div v-if="categories.length === 0" class="text-center py-6 text-xs text-slate-400 italic">
                  {{ t('event_qualification.loading_categories') }}
                </div>
                <div v-else-if="filteredSessionCategories.length === 0" class="text-center py-6 text-xs text-slate-400 italic">
                  {{ t('event_qualification.no_categories_match') }}
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
            <BaseButton variant="white" class="h-10 px-5 text-xs font-bold border-slate-200"
              @click="showSessionDialog = false">
              {{ t('event_qualification.cancel') }}
            </BaseButton>
            <BaseButton :disabled="creatingSession || !newSessionName || selectedSessionCategoryIds.length === 0"
              :loading="creatingSession" variant="primary" icon="ph:check-circle-bold"
              class="h-10 px-6 text-xs font-black shadow-md shadow-primary/20"
              @click="saveSession">
              {{ submitButtonLabel }}
            </BaseButton>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import { useApi, getApiErrorMessage } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useSubscription } from '~/composables/useSubscription'
import BaseSelect from '~/components/common/BaseSelect.vue'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { get, post, patch, delete: del } = useApi()
const toast = useToast()
const eventId = computed(() => route.params.id)
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

definePageMeta({
  layout: 'dashboard'
})

// State Management
const eventName = ref('Loading...')
const qualificationSessions = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const reportEntries = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

// Loading States
const loadingSessions = ref(false)
const loadingCategories = ref(false)
const loadingReport = ref(false)
const creatingSession = ref(false)
const showSessionDialog = ref(false)
const editingSessionId = ref(null)

// New/Edit Session Form
const newSessionName = ref('')
const newSessionEnds = ref(6)
const newSessionArrows = ref(3)
const selectedSessionCategoryIds = ref([])
const sessionCategorySearch = ref('')

const filteredSessionCategories = computed(() => {
  if (!sessionCategorySearch.value) return categories.value
  const q = sessionCategorySearch.value.toLowerCase()
  return categories.value.filter(cat => {
    const name = getCategoryName(cat).toLowerCase()
    return name.includes(q)
  })
})

// Valid Report Entries (only archers who have recorded scores)
const validReportEntries = computed(() => {
  return reportEntries.value.filter(entry => 
    (entry.ends_completed && entry.ends_completed > 0) ||
    (entry.total_score && entry.total_score > 0) ||
    (entry.sessions && entry.sessions.length > 0)
  )
})

// Pagination Computed
const totalPages = computed(() => Math.ceil(validReportEntries.value.length / pageSize.value))
const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value

  // Sort sessions by created_at to determine session number
  const sortedSessions = [...qualificationSessions.value].sort((a, b) =>
    new Date(a.created_at) - new Date(b.created_at)
  )

  return validReportEntries.value.slice(start, end).map(entry => {
    const sessions = (entry.sessions || []).map(s => {
      const allScores = s.end_scores ? s.end_scores.split(', ') : []
      const sessionIdx = sortedSessions.findIndex(session => session.session_code === s.session_code)
      return {
        ...s,
        sessionNumber: sessionIdx !== -1 ? sessionIdx + 1 : null,
        displayScores: allScores.slice(0, 6),
        remainingEnds: Math.max(0, allScores.length - 6)
      }
    })

    return {
      ...entry,
      rowKey: entry.participant_uuid,
      processedSessions: sessions
    }
  })
})

watch(validReportEntries, () => {
  currentPage.value = 1
})

const mappedCategoriesForFilter = computed(() => {
  return categories.value.map(cat => ({
    value: cat.id,
    title: getCategoryName(cat),
    description: `${cat.participant_count || 0} ${t('event_qualification.archers').toLowerCase()}`
  }))
})

// Computed Properties
const modalTitle = computed(() => editingSessionId.value ? t('event_qualification.edit_session') : t('event_qualification.create_session'))
const submitButtonLabel = computed(() => editingSessionId.value ? (creatingSession.value ? t('event_qualification.saving') : t('event_qualification.save_changes')) : (creatingSession.value ? t('event_qualification.processing') : t('event_qualification.save')))

const breadcrumbItems = computed(() => [
  { label: 'Tournaments', to: '/dashboard/organizer/tournaments' },
  { label: eventName?.value || 'Tournament', to: `/dashboard/organizer/tournaments/${eventId.value}` }
])

useHead({
  title: computed(() => {
    const name = eventName?.value
    return !name || name === 'Loading...'
      ? `${t('event_qualification.title')} - Archeris Dashboard`
      : `${t('event_qualification.title')} - ${name} - Archeris Dashboard`
  })
})

// Methods
const openCreateModal = () => {
  editingSessionId.value = null
  newSessionName.value = ''
  newSessionEnds.value = 6
  newSessionArrows.value = 3
  selectedSessionCategoryIds.value = []
  sessionCategorySearch.value = ''
  showSessionDialog.value = true
}

const editSession = (session) => {
  editingSessionId.value = session.uuid
  newSessionName.value = session.name
  newSessionEnds.value = session.total_ends
  newSessionArrows.value = session.arrows_per_end
  selectedSessionCategoryIds.value = session.category_ids || []
  sessionCategorySearch.value = ''
  showSessionDialog.value = true
}

const getSessionCategories = (session) => {
  if (!session?.category_ids || !Array.isArray(session.category_ids)) return []
  return categories.value.filter(c => session.category_ids.includes(c.id || c.uuid))
}

const goToSession = (session) => {
  // Use session_code as slug directly since it's already unique
  router.push(`/dashboard/organizer/tournaments/${eventId.value}/qualification/${session.session_code}`)
}

const fetchQualificationSessions = async () => {
  const id = eventId.value
  if (!id) return
  loadingSessions.value = true
  try {
    const response = await get(`/tournaments/${id}/qualification/sessions`)
    const sessions = response?.sessions || []
    qualificationSessions.value = sessions
  } catch (error) {
    console.error('Failed to fetch qualification sessions:', error)
    qualificationSessions.value = []
  } finally {
    loadingSessions.value = false
  }
}

const saveSession = async () => {
  if (!newSessionName.value) {
    toast.warning(t('event_qualification.toast_session_name_required'))
    return
  }

  if (selectedSessionCategoryIds.value.length === 0) {
    toast.warning(t('event_qualification.toast_category_required'))
    return
  }

  try {
    creatingSession.value = true
    const payload = {
      name: newSessionName.value,
      total_ends: newSessionEnds.value || 12,
      arrows_per_end: newSessionArrows.value || 6,
      category_ids: selectedSessionCategoryIds.value
    }

    if (editingSessionId.value) {
      await patch(`/tournaments/${eventId.value}/qualification/sessions/${editingSessionId.value}`, payload)
      toast.success(t('event_qualification.toast_session_updated'))
    } else {
      await post(`/tournaments/${eventId.value}/qualification/sessions`, payload)
      toast.success(t('event_qualification.toast_session_created'))
    }

    showSessionDialog.value = false
    await fetchQualificationSessions()
  } catch (error) {
    console.error('Failed to save session:', error)
    toast.error(getApiErrorMessage(error, t('event_qualification.toast_session_save_failed')))
  } finally {
    creatingSession.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  // If it's a full ISO/SQL datetime string, extract HH:mm
  if (timeStr.includes('T') || timeStr.includes('-')) {
    const date = new Date(timeStr)
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
  return timeStr.substring(0, 5) // Handle HH:mm:ss if it's already just time
}

const fetchEventName = async () => {
  const id = eventId.value
  if (!id) return
  try {
    const response = await get(`/tournaments/${id}`)
    eventName.value = response?.event?.name || response?.name || 'Event'
  } catch (error) {
    console.error('Failed to fetch event:', error)
  }
}

const fetchCategories = async () => {
  const id = eventId.value
  if (!id) return
  loadingCategories.value = true
  try {
    // Fetch all categories (increased limit from default 10)
    const response = await get(`/tournaments/${id}/categories`, { params: { limit: 1000 } })
    const fetchedCategories = response?.events || response.data?.events || response?.categories || response.data?.categories || []
    // Filter only individual categories for qualification leaderboard
    const individualCategories = fetchedCategories.filter(cat =>
      cat.event_type_name?.toLowerCase() === 'individual' ||
      !cat.event_type_name
    )
    // Sort categories by participant count (descending)
    const sortedCategories = individualCategories.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))
    categories.value = sortedCategories

    // Auto-select first category if available
    if (categories.value.length > 0) {
      await selectCategory(categories.value[0].id)
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

const getCategoryName = (category) => {
  if (!category) return ''
  const parts = [
    category.division_name,
    category.category_name,
    category.event_type_name,
    category.gender_division_name
  ].filter(Boolean)
  return parts.join(' ')
}

const toggleSessionCategory = (categoryId) => {
  const index = selectedSessionCategoryIds.value.indexOf(categoryId)
  if (index === -1) {
    selectedSessionCategoryIds.value.push(categoryId)
  } else {
    selectedSessionCategoryIds.value.splice(index, 1)
  }
}

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId
  await fetchQualificationReport(categoryId)
}

const fetchQualificationReport = async (categoryId) => {
  if (!categoryId) return
  const id = eventId.value
  if (!id) return

  loadingReport.value = true
  try {
    const response = await get(`/tournaments/${id}/qualification/leaderboard`, {
      params: { category_id: categoryId }
    })

    // Try multiple response structures
    const data = response?.report
      || response?.data?.report
      || response?.data
      || response?.leaderboard
      || response?.archers
      || response

    reportEntries.value = Array.isArray(data) ? data : []

    if (reportEntries.value.length === 0) {
      console.warn('No report entries found for category:', categoryId, 'Response:', response)
    }
  } catch (error) {
    console.error('Failed to fetch report:', error, 'Category:', categoryId)
    reportEntries.value = []
  } finally {
    loadingReport.value = false
  }
}

// No local getAvatarUrl helper needed as we use useImageOrDefault from composables

const loadPageData = () => {
  if (!eventId.value) return
  Promise.all([fetchEventName(), fetchQualificationSessions(), fetchCategories()])
}

// Re-fetch whenever we're on this page (including when returning via browser back / touchpad back)
watch(
  () => [route.params.id, route.params.session],
  ([id, session]) => {
    if (import.meta.client && id && session === undefined) loadPageData()
  },
  { immediate: true }
)

// Re-fetch when page is restored from bfcache (browser back can restore cached page without re-mounting)
const onPageShow = (event) => {
  if (event.persisted) loadPageData()
}

// Fallback: re-fetch when tab/window becomes visible (handles some SSR/back edge cases)
const onVisibilityChange = () => {
  if (document.visibilityState === 'visible' && eventId.value && route.params.session === undefined) {
    loadPageData()
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibilityChange)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('pageshow', onPageShow)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
})
</script>
