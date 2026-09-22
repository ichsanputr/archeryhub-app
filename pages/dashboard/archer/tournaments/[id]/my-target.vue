<template>
  <div class="flex flex-col gap-6 md:gap-8 pb-16">
    <!-- Header Banner (Standard Dashboard Navy Style) -->
    <div
      class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8">
        <div class="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-3">
          <NuxtLink to="/dashboard/archer/tournaments" class="hover:text-white transition-colors">
            {{ t('my_target.nav_event') }}
          </NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-xs" />
          <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/overview`" class="hover:text-white transition-colors">
            {{ event?.name || t('my_target.nav_overview') }}
          </NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-xs" />
          <span class="text-white/90 font-medium">{{ t('my_target.nav_title') }}</span>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-4">
            <div
              class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shrink-0">
              <Icon icon="ph:crosshair-bold" class="text-white text-2xl" />
            </div>
            <div class="min-w-0">
              <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white">
                {{ t('my_target.title') }}
              </h1>
              <div class="text-slate-300 text-xs sm:text-sm mt-1.5">
                {{ t('my_target.subtitle') }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 sm:p-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div class="lg:col-span-2 space-y-6">
          <div class="h-44 bg-slate-100 dark:bg-slate-700/50 rounded-2xl animate-pulse" />
          <div class="h-64 bg-slate-100 dark:bg-slate-700/50 rounded-2xl animate-pulse" />
        </div>
        <div class="lg:col-span-1 space-y-6 lg:border-l lg:border-slate-100 dark:lg:border-slate-700 lg:pl-8">
          <div class="h-72 bg-slate-100 dark:bg-slate-700/50 rounded-2xl animate-pulse" />
          <div class="h-44 bg-slate-100 dark:bg-slate-700/50 rounded-2xl animate-pulse" />
        </div>
      </div>
    </div>

    <!-- Main Content Layout (Unified Parent White Card) -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-6 sm:p-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        <!-- Left Column (2 cols): Target Assignment & Schedule Timeline -->
        <div class="lg:col-span-2 space-y-8">

          <!-- 1. TARGET ASSIGNMENT SECTION -->
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-700">
              <div class="flex items-center gap-2">
                <div class="size-7 rounded-lg bg-navy/5 dark:bg-slate-700 text-navy dark:text-white flex items-center justify-center">
                  <Icon icon="ph:crosshair-bold" class="text-base" />
                </div>
                <h2 class="text-base font-bold text-slate-900 dark:text-white">
                  {{ t('my_target.assigned_title') }}
                </h2>
              </div>
              <span v-if="targets.length > 0" class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-md">
                {{ t('my_target.sessions_count', { count: targets.length }, `${targets.length} Sesi`) }}
              </span>
            </div>

            <!-- Empty State: No Target Assigned Yet -->
            <div v-if="targets.length === 0"
              class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-700/30 p-8 text-center space-y-3">
              <div class="size-14 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-2xl border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto shadow-2xs">
                <Icon icon="ph:crosshair-bold" class="text-2xl" />
              </div>
              <div class="space-y-1 max-w-md mx-auto">
                <h3 class="text-sm sm:text-base font-bold text-slate-800 dark:text-white">
                  {{ t('my_target.not_assigned_title') }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {{ t('my_target.not_assigned_desc') }}
                </div>
              </div>
            </div>

            <!-- Target Cards Grid -->
            <div v-else class="space-y-4">
              <div v-for="(target, idx) in targets" :key="target.session_id || idx"
                class="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50/40 dark:bg-slate-700/20">
                
                <!-- Session Header Strip -->
                <div class="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-100 dark:border-slate-700 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="size-7 rounded-lg bg-navy text-white font-black flex items-center justify-center text-xs shadow-xs">
                      {{ target.session_order || `S${idx + 1}` }}
                    </div>
                    <div>
                      <div class="font-bold text-slate-900 dark:text-white text-sm">
                        {{ target.session_name || t('my_target.session_label') }}
                      </div>
                      <div class="text-xs text-slate-500 font-medium">
                        {{ target.category_name || primaryCategory?.category_name || t('my_target.default_category') }}
                      </div>
                    </div>
                  </div>

                  <!-- Session Time Badge -->
                  <div v-if="target.start_time"
                    class="inline-flex items-center gap-1.5 text-xs font-bold text-navy dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2.5 py-1 rounded-lg shadow-2xs">
                    <Icon icon="ph:clock-bold" class="text-slate-600 dark:text-slate-300 text-xs" />
                    <span>{{ formatTime(target.start_time) }}<template v-if="target.end_time"> – {{ formatTime(target.end_time) }}</template> WIB</span>
                  </div>
                </div>

                <!-- Card Body: Target Details -->
                <div class="p-5 sm:p-6 bg-white dark:bg-slate-800">
                  <div class="flex flex-col sm:flex-row items-center sm:items-stretch gap-5">
                    
                    <!-- Target Emblem Visual Badge -->
                    <div class="shrink-0 w-32 sm:w-36 rounded-xl bg-gradient-to-br from-navy via-navy to-navy/95 text-white p-4 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden border border-white/10">
                      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.15;"></div>
                      <div class="relative z-10 space-y-1">
                        <span class="text-[10px] font-bold text-amber-300 block tracking-wider">{{ t("my_target.target_badge") }}</span>
                        <div class="text-3xl font-black text-white leading-none tracking-tight font-mono">
                          {{ getTargetBadgeText(target) }}
                        </div>
                        <div class="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md bg-white/20 text-white font-bold text-[11px] shadow-2xs">
                          {{ formatTargetDisplay(target) }}
                        </div>
                      </div>
                    </div>

                    <!-- Target Attributes Matrix -->
                    <div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <!-- Target Number -->
                      <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-600/50">
                        <div class="text-slate-400 font-semibold mb-1 text-xs">{{ t('my_target.target_label') }}</div>
                        <div class="font-black text-slate-900 dark:text-white text-sm sm:text-base font-mono">
                          {{ formatTargetDisplay(target) }}
                        </div>
                      </div>

                      <!-- Position / Board -->
                      <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-600/50">
                        <div class="text-slate-400 font-semibold mb-1 text-xs">{{ t('my_target.board_label') }}</div>
                        <div class="font-black text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-1.5 font-mono">
                          <span>{{ getTargetPositionLabel(target) }}</span>
                        </div>
                      </div>

                      <!-- Category & Division -->
                      <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-600/50 sm:col-span-2">
                        <div class="text-slate-400 font-semibold mb-1 text-xs">{{ t('my_target.category_label') }}</div>
                        <div class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
                          {{ target.category_name || primaryCategory?.category_name || t('my_target.default_category') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. SCHEDULE / TIMETABLE SECTION -->
          <div class="space-y-4 border-t border-slate-100 dark:border-slate-700 pt-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-slate-100 dark:border-slate-700">
              <div class="flex items-center gap-2">
                <div class="size-7 rounded-lg bg-navy/5 dark:bg-slate-700 text-navy dark:text-white flex items-center justify-center">
                  <Icon icon="ph:calendar-check-bold" class="text-base" />
                </div>
                <h2 class="text-base font-bold text-slate-900 dark:text-white">
                  {{ t('my_target.schedule_title') }}
                </h2>
              </div>

              <!-- Day Tabs if multi-day -->
              <div v-if="scheduleDays.length > 1" class="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
                <button
                  v-for="day in scheduleDays"
                  :key="day.day_number"
                  type="button"
                  @click="selectedDayNumber = day.day_number"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
                  :class="selectedDayNumber === day.day_number
                    ? 'bg-navy text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-navy hover:bg-white dark:hover:bg-slate-600'"
                >
                  <span>{{ t('event_schedule.day_label', { day: day.day_number }, `Hari ${day.day_number}`) }}</span>
                  <span
                    class="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                    :class="selectedDayNumber === day.day_number ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200'"
                  >
                    {{ day.items ? day.items.length : 0 }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Schedule Container -->
            <div class="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              
              <!-- Date header for active day -->
              <div v-if="activeDay?.schedule_date" class="px-5 py-3 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs sm:text-sm">
                <div class="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Icon icon="ph:calendar-blank-bold" class="text-slate-500 text-sm" />
                  <span>{{ formatDayDate(activeDay.schedule_date) }}</span>
                </div>
                <span class="text-slate-500 font-semibold text-xs">
                  {{ t('my_target.items_count', { count: activeDayItems.length }, `${activeDayItems.length} agenda`) }}
                </span>
              </div>

              <!-- Empty Schedule State -->
              <div v-if="activeDayItems.length === 0" class="p-8 sm:p-10 text-center space-y-2.5 bg-white dark:bg-slate-800">
                <div class="size-12 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400">
                  <Icon icon="ph:calendar-x-bold" class="text-xl" />
                </div>
                <div class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                  {{ t('my_target.empty_schedule') }}
                </div>
                <div class="text-xs text-slate-400 max-w-sm mx-auto">
                  {{ t('my_target.empty_schedule_desc') }}
                </div>
              </div>

              <!-- Schedule Items Table -->
              <div v-else class="overflow-x-auto bg-white dark:bg-slate-800">
                <table class="w-full text-left">
                  <thead class="bg-slate-50/80 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-500 select-none">
                    <tr>
                      <th class="px-5 py-3 w-36 whitespace-nowrap">{{ t('event_schedule.time_header') }}</th>
                      <th class="px-5 py-3 w-28 whitespace-nowrap">{{ t('event_schedule.session_type_label') }}</th>
                      <th class="px-5 py-3 min-w-[200px]">{{ t('event_schedule.title_label') }}</th>
                      <th class="px-5 py-3 w-28 whitespace-nowrap">{{ t('event_schedule.target_start_label') }}</th>
                      <th class="px-5 py-3 w-32 whitespace-nowrap">{{ t('event_schedule.location_label') }}</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-700/60">
                    <tr
                      v-for="(item, idx) in activeDayItems"
                      :key="item.uuid || idx"
                      class="hover:bg-slate-50/60 dark:hover:bg-slate-700/40 transition-colors text-xs sm:text-sm"
                    >
                      <!-- Time -->
                      <td class="px-5 py-3.5 whitespace-nowrap">
                        <div class="font-mono font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {{ formatTime(item.start_time) }}<template v-if="item.end_time"> – {{ formatTime(item.end_time) }}</template>
                        </div>
                      </td>

                      <!-- Type Badge -->
                      <td class="px-5 py-3.5 whitespace-nowrap">
                        <span
                          class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold"
                          :class="getItemTypeBadgeClass(item.item_type)"
                        >
                          <Icon :icon="getItemTypeIcon(item.item_type)" class="text-xs shrink-0" />
                          <span>{{ getItemTypeLabel(item.item_type) }}</span>
                        </span>
                      </td>

                      <!-- Title & Subtitle -->
                      <td class="px-5 py-3.5">
                        <div class="flex items-center gap-2 flex-wrap">
                          <span class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {{ unwrapString(item.title) }}
                          </span>
                          <span
                            v-if="unwrapString(item.session_code)"
                            class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono"
                          >
                            {{ unwrapString(item.session_code) }}
                          </span>
                        </div>
                        <div v-if="unwrapString(item.subtitle)" class="text-xs text-slate-500 mt-0.5 font-medium">
                          {{ unwrapString(item.subtitle) }}
                        </div>
                      </td>

                      <!-- Target Range -->
                      <td class="px-5 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 text-xs">
                        <span v-if="formatTarget(item)" class="font-mono font-bold flex items-center gap-1.5 text-navy dark:text-white">
                          <Icon icon="ph:target-bold" class="text-slate-400 text-sm" />
                          <span>{{ formatTarget(item) }}</span>
                        </span>
                        <span v-else class="text-slate-400">-</span>
                      </td>

                      <!-- Location -->
                      <td class="px-5 py-3.5 whitespace-nowrap text-slate-700 dark:text-slate-300 text-xs">
                        <span v-if="unwrapString(item.location)" class="flex items-center gap-1.5 font-medium">
                          <Icon icon="ph:map-pin-bold" class="text-slate-400 text-sm" />
                          <span>{{ unwrapString(item.location) }}</span>
                        </span>
                        <span v-else class="text-slate-400">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          </div>

        </div>

        <!-- Right Column (1 col): Whistle Protocol & Venue Info -->
        <div class="lg:col-span-1 space-y-6 lg:border-l lg:border-slate-100 dark:lg:border-slate-700 lg:pl-8 lg:pt-0">

          <!-- Whistle & Shooting Line Protocol Card -->
          <div class="bg-gradient-to-br from-navy to-navy/95 text-white rounded-2xl p-5 shadow-sm space-y-4 border border-white/10">
            <div class="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 class="text-xs sm:text-sm font-black flex items-center gap-2">
                <Icon icon="ph:megaphone-simple-bold" class="text-amber-400 text-base" />
                <span>{{ t('my_target.rules_title') }}</span>
              </h4>
              <span class="text-[10px] font-black text-amber-300 px-2 py-0.5 rounded-md bg-white/10">WA Rules</span>
            </div>

            <div class="space-y-3.5 text-xs">
              <!-- 2 Whistles -->
              <div class="flex items-start gap-2.5">
                <div class="size-6 rounded-lg bg-white/10 text-white font-black flex items-center justify-center shrink-0 border border-white/10 text-xs">
                  2x
                </div>
                <div class="space-y-0.5">
                  <div class="font-bold text-white text-xs">{{ t('my_target.whistle_2') }}</div>
                  <div class="text-[11px] text-slate-300 leading-relaxed">{{ t("my_target.whistle_2_desc") }}</div>
                </div>
              </div>

              <!-- 1 Whistle -->
              <div class="flex items-start gap-2.5">
                <div class="size-6 rounded-lg bg-emerald-500 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                  1x
                </div>
                <div class="space-y-0.5">
                  <div class="font-bold text-white text-xs">{{ t('my_target.whistle_1') }}</div>
                  <div class="text-[11px] text-slate-300 leading-relaxed">{{ t("my_target.whistle_1_desc") }}</div>
                </div>
              </div>

              <!-- 3 Whistles -->
              <div class="flex items-start gap-2.5">
                <div class="size-6 rounded-lg bg-blue-500 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                  3x
                </div>
                <div class="space-y-0.5">
                  <div class="font-bold text-white text-xs">{{ t('my_target.whistle_3') }}</div>
                  <div class="text-[11px] text-slate-300 leading-relaxed">{{ t('my_target.whistle_3_desc') }}</div>
                </div>
              </div>

              <!-- 5+ Whistles -->
              <div class="flex items-start gap-2.5">
                <div class="size-6 rounded-lg bg-rose-500 text-white font-black flex items-center justify-center shrink-0 text-xs shadow-xs">
                  5+
                </div>
                <div class="space-y-0.5">
                  <div class="font-bold text-rose-300 text-xs">{{ t('my_target.whistle_5') }}</div>
                  <div class="text-[11px] text-slate-300 leading-relaxed">{{ t('my_target.whistle_5_desc') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Venue & Event Card -->
          <div class="p-4 bg-slate-50/80 dark:bg-slate-700/40 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-3">
            <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-700 pb-2">
              <Icon icon="ph:map-pin-bold" class="text-slate-500 text-base" />
              <span>{{ t('my_target.venue_title') }}</span>
            </h4>

            <div class="space-y-2.5 text-xs">
              <div>
                <span class="text-slate-400 font-medium block mb-0.5 text-xs">{{ t('my_target.venue_label') }}</span>
                <span class="font-bold text-slate-900 dark:text-white leading-snug block">{{ event?.venue || '-' }}</span>
                <span v-if="event?.location" class="text-slate-500 block mt-0.5 font-medium">{{ event.location }}</span>
              </div>

              <div>
                <span class="text-slate-400 font-medium block mb-0.5 text-xs">{{ t('my_target.event_dates_label') }}</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ formatDateRange(event?.start_date, event?.end_date) }}</span>
              </div>

              <div v-if="event?.technical_guidebook_url" class="pt-1.5">
                <a :href="event.technical_guidebook_url" target="_blank"
                  class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-900 dark:text-white font-bold text-xs rounded-xl transition-colors border border-slate-200 dark:border-slate-600 shadow-2xs">
                  <Icon icon="ph:file-pdf-bold" class="text-base text-red-500" />
                  <span>{{ t('my_target.download_thb') }}</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'

definePageMeta({ layout: 'dashboard' })

const { t, locale } = useI18n()
const route = useRoute()
const { get } = useApi()

const eventId = computed(() => route.params.id as string)

useHead({ 
  title: computed(() => `${t('my_target.title')} - Archeris Dashboard`) 
})

const isLoading = ref(true)
const event = ref<any>(null)
const participant = ref<any>(null)
const targets = ref<any[]>([])

// Schedule timeline state
const scheduleDays = ref<any[]>([])
const selectedDayNumber = ref(1)

const activeDay = computed(() => {
  if (!scheduleDays.value || scheduleDays.value.length === 0) return null
  return scheduleDays.value.find(d => d.day_number === selectedDayNumber.value) || scheduleDays.value[0]
})

const activeDayItems = computed(() => {
  return activeDay.value?.items || []
})

const primaryCategory = computed(() => {
  if (participant.value?.categories && participant.value.categories.length > 0) {
    return participant.value.categories[0]
  }
  return null
})

function unwrapString(val: any): string {
  if (val == null) return ''
  if (typeof val === 'string') return val
  if (typeof val === 'object') {
    if ('String' in val) {
      return val.Valid ? String(val.String) : ''
    }
    if ('Int64' in val) {
      return val.Valid ? String(val.Int64) : ''
    }
  }
  return String(val)
}

function parseTargetNumber(rawName: string | null | undefined): string {
  if (!rawName) return ''
  return rawName.replace(/^Target\s*/i, '').trim()
}

function getTargetBadgeText(target: any): string {
  if (!target) return '-'
  const name = parseTargetNumber(target.target_name)
  const board = (target.target_board || '').trim().toUpperCase()
  if (name && board && !name.toUpperCase().endsWith(board)) {
    return `${name}${board}`
  }
  return name || board || '-'
}

function formatTargetDisplay(target: any): string {
  if (!target) return '-'
  const name = parseTargetNumber(target.target_name)
  if (name) return t('my_target.target_item', { num: name })
  return t('my_target.not_set')
}

function getTargetPositionLabel(target: any): string {
  if (!target) return '-'
  const board = (target.target_board || '').trim().toUpperCase()
  if (board) {
    return t('my_target.position_val', { pos: board })
  }
  return t('my_target.not_set')
}

function formatTime(timeStr: string | null | undefined): string {
  if (!timeStr) return '--:--'
  if (timeStr.includes('T')) {
    return new Date(timeStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }
  return timeStr.substring(0, 5)
}

function formatDayDate(dateStr: string | null | undefined): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const loc = locale.value === 'id' ? 'id-ID' : 'en-US'
    return d.toLocaleDateString(loc, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function formatDateRange(start: string | null | undefined, end: string | null | undefined): string {
  if (!start && !end) return '-'
  try {
    const s = start ? new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
    const e = end ? new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : ''
    if (s && e && s !== e) return `${s} - ${e}`
    return s || e
  } catch {
    return `${start || ''} - ${end || ''}`
  }
}

function getItemTypeLabel(type: string | null | undefined): string {
  switch (type) {
    case 'qualification': return t('event_schedule.type_qualification')
    case 'elimination': return t('event_schedule.type_elimination')
    case 'finals': return t('event_schedule.type_finals')
    case 'break': return t('event_schedule.type_break')
    default: return t('event_schedule.type_general')
  }
}

function getItemTypeIcon(type: string | null | undefined): string {
  switch (type) {
    case 'qualification': return 'ph:target-bold'
    case 'elimination': return 'ph:tree-structure-bold'
    case 'finals': return 'ph:trophy-bold'
    case 'break': return 'ph:coffee-bold'
    default: return 'ph:info-bold'
  }
}

function getItemTypeBadgeClass(type: string | null | undefined): string {
  switch (type) {
    case 'qualification': return 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
    case 'elimination': return 'bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800'
    case 'finals': return 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800'
    case 'break': return 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800'
    default: return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
  }
}

function formatTarget(item: any): string {
  if (!item) return ''
  let start = item.target_start
  let end = item.target_end
  if (typeof start === 'object' && start !== null) {
    start = start.Valid ? start.Int64 : null
  }
  if (typeof end === 'object' && end !== null) {
    end = end.Valid ? end.Int64 : null
  }
  start = Number(start)
  end = Number(end)
  if (start > 0 && end > 0) {
    if (start === end) return `Target ${start}`
    return `Target ${start} – ${end}`
  }
  if (start > 0) return `Target ${start}`
  return ''
}

async function fetchInitialData() {
  isLoading.value = true
  try {
    const [eventRes, participantRes, targetRes, scheduleRes] = await Promise.allSettled([
      get<any>(`/tournaments/${eventId.value}`),
      get<any>(`/tournaments/${eventId.value}/participants/me`),
      get<any>(`/tournaments/${eventId.value}/my-target`),
      get<any>(`/tournaments/${eventId.value}/schedule/timeline`)
    ])

    if (eventRes.status === 'fulfilled') {
      event.value = eventRes.value?.data || eventRes.value
    }

    if (participantRes.status === 'fulfilled') {
      participant.value = participantRes.value?.data || participantRes.value
    }

    if (targetRes.status === 'fulfilled') {
      const resData = targetRes.value?.data || targetRes.value
      if (resData?.targets && resData.targets.length > 0) {
        targets.value = resData.targets
      }
    }

    // Schedule handling
    if (scheduleRes.status === 'fulfilled') {
      const sData = scheduleRes.value?.data || scheduleRes.value
      if (sData?.days && Array.isArray(sData.days) && sData.days.length > 0) {
        scheduleDays.value = sData.days
        selectedDayNumber.value = sData.days[0].day_number
      } else if (sData?.schedules && Array.isArray(sData.schedules)) {
        // Group plain schedules list by day_number or day_order
        const daysMap: Record<number, any> = {}
        sData.schedules.forEach((it: any) => {
          const dNum = it.day_number || it.day_order || 1
          if (!daysMap[dNum]) {
            daysMap[dNum] = {
              day_number: dNum,
              schedule_date: it.schedule_date || '',
              items: []
            }
          }
          daysMap[dNum].items.push(it)
        })
        scheduleDays.value = Object.values(daysMap)
        if (scheduleDays.value.length > 0) {
          selectedDayNumber.value = scheduleDays.value[0].day_number
        }
      }
    }

    // Fallback ONLY when participant actually has real assigned target_name
    if (targets.value.length === 0 && participant.value?.categories?.length > 0) {
      const catsWithTarget = participant.value.categories.filter((c: any) => c.target_name && String(c.target_name).trim() !== '')
      if (catsWithTarget.length > 0) {
        targets.value = catsWithTarget.map((c: any, idx: number) => ({
          session_id: c.id || `session-${idx}`,
          session_name: c.event_type_name || 'Sesi Kualifikasi',
          session_order: `S${idx + 1}`,
          target_name: c.target_name,
          target_board: c.target_face || (participant.value.athlete_code ? participant.value.athlete_code.slice(-1) : 'A'),
          category_name: `${c.division_name || ''} - ${c.category_name || ''}`.replace(/^ - | - $/g, '')
        }))
      }
    }
  } catch (err) {
    console.error('Failed to load target data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchInitialData)
</script>