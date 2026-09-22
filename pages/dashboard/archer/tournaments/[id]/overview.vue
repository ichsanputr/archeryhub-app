<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const eventId = route.params.id

const { get } = useApi()
const { user } = useAuth()

const isLoading = ref(true)
const event = ref(null)
const participant = ref(null)
const schedules = ref([])

const eventSlug = computed(() => event.value?.slug || eventId)
const primaryCategory = computed(() => {
  if (participant.value?.categories && participant.value.categories.length > 0) {
    return participant.value.categories[0]
  }
  return null
})

useHead({
  title: computed(() => `${event.value?.name || 'Ringkasan Event'} - Archeris Dashboard`)
})

const isPaid = (status) => {
  const s = (status || '').toLowerCase()
  return ['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes(s)
}

const formatDateRange = (start, end) => {
  if (!start) return '-'
  const s = new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  if (!end) return s
  const e = new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${s} - ${e}`
}

const fetchOverviewData = async () => {
  isLoading.value = true
  try {
    const [eventRes, participantRes, scheduleRes] = await Promise.all([
      get(`/tournaments/${eventId}`),
      get(`/tournaments/${eventId}/participants/me`).catch(() => null),
      get(`/tournaments/${eventId}/schedules`).catch(() => [])
    ])
    event.value = eventRes?.data || eventRes
    participant.value = participantRes?.data || participantRes
    schedules.value = Array.isArray(scheduleRes) ? scheduleRes : (scheduleRes?.data || [])
  } catch (err) {
    console.error('Failed to load overview data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOverviewData()
})
</script>

<template>
  <div class="flex flex-col gap-6 md:gap-8 pb-16">
    <!-- Hero Banner Header -->
    <div
      class="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.15);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <!-- Header Body -->
      <div class="relative p-6 sm:p-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex items-start gap-4">
            <!-- Event Logo -->
            <div class="size-16 sm:size-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shrink-0 shadow-md flex items-center justify-center">
              <img v-if="event?.banner_url || event?.logo_url" :src="useImageOrDefault(event.logo_url || event.banner_url)" :alt="event?.name" class="w-full h-full object-cover" />
              <Icon v-else icon="ph:trophy-bold" class="text-white text-3xl" />
            </div>

            <!-- Event Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-2">
                <NuxtLink to="/dashboard/archer/tournaments" class="hover:text-white transition-colors">{{ t('sidebar.my_events') }}</NuxtLink>
                <Icon icon="ph:caret-right-bold" class="text-xs" />
                <span class="text-amber-300 font-medium truncate">{{ t('archer_event_overview.title') }}</span>
              </div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight">
                {{ event?.name || t('archer_event_overview.loading_event') }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 font-medium mt-2">
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:map-pin-bold" class="text-white/80 text-sm sm:text-base" />
                  <span>{{ event?.venue || event?.location || t('archer_event_overview.match_venue') }}</span>
                </div>
                <div class="size-1 rounded-full bg-white/30 hidden sm:block"></div>
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:calendar-blank-bold" class="text-white/80 text-sm sm:text-base" />
                  <span>{{ formatDateRange(event?.start_date, event?.end_date) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-3 shrink-0">
            <NuxtLink :to="`/tournaments/${eventSlug || eventId}`" target="_blank"
              class="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-sm transition-all shadow-sm">
              <Icon icon="ph:arrow-square-out-bold" class="text-base text-white" />
              <span>{{ t('archer_event_overview.public_page') }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="h-44 bg-white rounded-3xl animate-pulse border border-slate-100" />
        <div class="h-64 bg-white rounded-3xl animate-pulse border border-slate-100" />
      </div>
      <div class="h-96 bg-white rounded-3xl animate-pulse border border-slate-100" />
    </div>

    <!-- Loaded Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      
      <!-- Left Column: Archer Status & Hub Cards -->
      <div class="lg:col-span-2 space-y-6 md:space-y-8">

        <!-- Archer Participation Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="size-14 sm:size-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                <Icon icon="hugeicons:archer" class="text-2xl sm:text-3xl text-slate-800" />
              </div>
              <div>
                <span class="text-xs sm:text-sm font-semibold text-slate-400 capitalize block">{{ t("archer_event_overview.archer_participation_status") }}</span>
                <h3 class="text-lg sm:text-xl font-black text-slate-900">{{ participant?.full_name || user?.full_name || t('archer_event_overview.default_archer_name') }}</h3>
                <div class="text-xs sm:text-sm text-slate-500 font-medium capitalize mt-0.5">{{ participant?.club_name || t('archer_event_overview.independent_archer') }}</div>
              </div>
            </div>

            <!-- Official Status Block -->
            <div class="shrink-0">
              <div v-if="isPaid(participant?.payment_status)"
                class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div class="size-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Icon icon="ph:seal-check-bold" class="text-lg" />
                </div>
                <div>
                  <div class="text-xs sm:text-sm font-semibold text-emerald-800 capitalize">{{ t('archer_event_overview.registration_status_label') }}</div>
                  <div class="text-xs sm:text-sm font-black text-emerald-950 capitalize">{{ t('archer_event_overview.registered_confirmed') }}</div>
                </div>
              </div>
              <div v-else
                class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
                <div class="size-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Icon icon="ph:clock-bold" class="text-lg" />
                </div>
                <div>
                  <div class="text-xs sm:text-sm font-semibold text-amber-800 capitalize">{{ t('archer_event_overview.registration_status_label') }}</div>
                  <div class="text-xs sm:text-sm font-black text-amber-950 capitalize">{{ t('archer_event_overview.waiting_payment') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Highlight Metric Grid for Archer -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <!-- Kategori -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-xs sm:text-sm font-semibold text-slate-400 capitalize">{{ t("archer_event_overview.category_label") }}</div>
              <div class="text-sm sm:text-base font-black text-slate-900 mt-1 truncate capitalize" :title="primaryCategory?.category_name">
                {{ primaryCategory?.category_name || t('archer_event_overview.general_category') }}
              </div>
            </div>

            <!-- Divisi Busur -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-xs sm:text-sm font-semibold text-slate-400 capitalize">{{ t("archer_event_overview.bow_division_label") }}</div>
              <div class="text-sm sm:text-base font-black text-slate-900 mt-1 truncate capitalize">
                {{ primaryCategory?.division_name || 'Recurve' }}
              </div>
            </div>

            <!-- Nomor Atlet / Kode -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-xs sm:text-sm font-semibold text-slate-400 capitalize">{{ t("archer_event_overview.athlete_code_label") }}</div>
              <div class="text-sm sm:text-base font-black text-slate-900 mt-1 font-mono truncate">
                {{ participant?.athlete_code || ('ARC-' + (participant?.archer_id || '').substring(0, 5).toUpperCase()) }}
              </div>
            </div>
          </div>

          <!-- Quick Action CTA inside Card -->
          <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <span class="text-slate-500 font-medium">{{ t("archer_event_overview.need_ticket_info") }}</span>
            <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-registration`" class="inline-flex items-center gap-1.5 font-bold text-navy hover:text-navy/80 transition-colors text-xs sm:text-sm">
              <span>{{ t("archer_event_overview.open_reg_detail") }}</span>
              <Icon icon="ph:arrow-right-bold" />
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation Hub: Performance Cards -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base sm:text-lg font-black text-navy dark:text-white flex items-center gap-2">
              <Icon icon="ph:compass-bold" class="text-navy dark:text-white text-xl" />
              <span>{{ t("archer_event_overview.match_features_menu") }}</span>
            </h3>
            <span class="text-xs sm:text-sm text-slate-400 font-semibold">{{ t("archer_event_overview.quick_access_portal") }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Card 1: My Registration & QR -->
            <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-registration`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-navy/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                <Icon icon="ph:ticket-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-navy transition-colors">{{ t("archer_event_overview.card_reg_title") }}</h4>
                <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_reg_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 2: Target & Jadwal -->
            <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-target`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-navy/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                <Icon icon="ph:crosshair-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-navy transition-colors">{{ t("my_target.title") }}</h4>
                <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("my_target.subtitle") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 3: Scorecard Qualification -->
            <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-qualification`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-navy/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                <Icon icon="ph:chart-line-up-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-navy transition-colors">{{ t("archer_event_overview.card_score_title") }}</h4>
                <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_score_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 4: Elimination Brackets -->
            <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-elimination`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-navy/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                <Icon icon="ph:git-merge-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-navy transition-colors">{{ t("archer_event_overview.card_elim_title") }}</h4>
                <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_elim_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 5: Team & Mixed Team -->
            <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-team`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-navy/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                <Icon icon="ph:users-four-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-navy transition-colors">{{ t("archer_event_overview.card_team_title") }}</h4>
                <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_team_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 6: Certificates -->
            <NuxtLink :to="`/dashboard/archer/certificates?event_id=${eventId}`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-navy/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                <Icon icon="ph:certificate-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-navy transition-colors">{{ t("archer_event_overview.card_cert_title") }}</h4>
                <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_cert_desc") }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Right Column: Event Info & Rundown -->
      <div class="space-y-6">



        <!-- Event Information Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h4 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Icon icon="ph:info-bold" class="text-slate-500 text-lg" />
            <span>{{ t("archer_event_overview.tournament_info") }}</span>
          </h4>

          <div class="space-y-3.5 text-xs sm:text-sm">
            <div>
              <span class="text-slate-400 font-medium block mb-0.5 capitalize">{{ t('archer_event_overview.organizer_label') }}</span>
              <span class="font-bold text-slate-900">{{ event?.organizer_name || 'Panitia Turnamen' }}</span>
            </div>

            <div>
              <span class="text-slate-400 font-medium block mb-0.5 capitalize">{{ t('archer_event_overview.location_venue_label') }}</span>
              <span class="font-bold text-slate-900 leading-relaxed block">{{ event?.venue || '-' }}</span>
              <span class="text-slate-500 mt-0.5 block">{{ event?.location || '' }}</span>
            </div>

            <div>
              <span class="text-slate-400 font-medium block mb-0.5 capitalize">{{ t('archer_event_overview.event_dates_label') }}</span>
              <span class="font-bold text-slate-900">{{ formatDateRange(event?.start_date, event?.end_date) }}</span>
            </div>

            <div v-if="event?.technical_guidebook_url" class="pt-2">
              <a :href="event.technical_guidebook_url" target="_blank"
                class="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs sm:text-sm rounded-xl transition-colors">
                <Icon icon="ph:file-pdf-bold" class="text-base text-red-500" />
                <span>{{ t('archer_event_overview.download_thb') }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Event Schedule Highlights -->
        <div v-if="schedules && schedules.length > 0" class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h4 class="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Icon icon="ph:clock-countdown-bold" class="text-slate-500 text-lg" />
            <span>{{ t('archer_event_overview.schedule_rundown') }}</span>
          </h4>

          <div class="space-y-3">
            <div v-for="(item, idx) in schedules.slice(0, 4)" :key="idx" class="flex items-start gap-3 text-xs sm:text-sm">
              <div class="size-6 rounded-lg bg-slate-100 text-slate-700 font-black flex items-center justify-center shrink-0 text-xs mt-0.5">
                {{ idx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-slate-900">{{ item.activity || item.title || item.name }}</div>
                <div class="text-xs sm:text-sm text-slate-400 mt-0.5">{{ item.time || item.date || '' }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
