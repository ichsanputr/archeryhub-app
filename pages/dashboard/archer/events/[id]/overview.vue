<template>
  <div class="flex flex-col gap-6 md:gap-8 pb-16">
    <!-- Hero Banner Header -->
    <div
      class="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Background Motif -->
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.15);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Body -->
      <div class="relative p-6 sm:p-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="flex items-start gap-4">
            <!-- Event Thumbnail / Logo -->
            <div class="size-16 sm:size-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shrink-0 shadow-md flex items-center justify-center">
              <img v-if="event?.banner_url || event?.logo_url" :src="useImageOrDefault(event.logo_url || event.banner_url)" :alt="event?.name" class="w-full h-full object-cover" />
              <Icon v-else icon="ph:trophy-bold" class="text-primary text-3xl" />
            </div>

            <!-- Event Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 text-xs text-white/60 mb-2">
                <NuxtLink to="/dashboard/archer/events" class="hover:text-white transition-colors">Event Saya</NuxtLink>
                <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                <span class="text-primary font-medium truncate">Ringkasan Event</span>
              </div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight">
                {{ event?.name || t('archer_event_overview.loading_event') }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium mt-2">
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:map-pin-bold" class="text-primary text-sm" />
                  <span>{{ event?.venue || event?.location || 'Venue Pertandingan' }}</span>
                </div>
                <div class="size-1 rounded-full bg-white/30 hidden sm:block"></div>
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:calendar-blank-bold" class="text-primary text-sm" />
                  <span>{{ formatDateRange(event?.start_date, event?.end_date) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Action Buttons -->
          <div class="flex items-center gap-3 shrink-0">
            <NuxtLink :to="`/events/${eventSlug || eventId}`" target="_blank"
              class="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold flex items-center gap-2 backdrop-blur-sm transition-all shadow-sm">
              <Icon icon="ph:arrow-square-out-bold" class="text-base text-primary" />
              <span>Halaman Publik</span>
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

        <!-- Archer Personal Participation Card -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-navy to-primary"></div>
          
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon icon="hugeicons:archer" class="text-2xl text-navy" />
              </div>
              <div>
                <span class="text-[10px] font-black text-slate-400 tracking-wider block font-mono">{{ t("archer_event_overview.archer_participation_status") }}</span>
                <h3 class="text-lg font-black text-navy">{{ participant?.full_name || user?.full_name || t('archer_event_overview.default_archer_name') }}</h3>
                <div class="text-xs text-slate-500 font-medium">{{ participant?.club_name || t('archer_event_overview.independent_archer') }}</div>
              </div>
            </div>

            <!-- Status Pill -->
            <div class="shrink-0">
              <span :class="getStatusBadgeClass(participant?.payment_status)" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border">
                <span class="size-2 rounded-full" :class="isPaid(participant?.payment_status) ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                {{ isPaid(participant?.payment_status) ? t('archer_event_overview.registered_paid') : t('archer_event_overview.waiting_payment') }}
              </span>
            </div>
          </div>

          <!-- Highlight Metric Grid for Archer -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <!-- Target / Bantalan -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-[10px] font-bold text-slate-400">{{ t("archer_event_overview.target_face_label") }}</div>
              <div class="text-lg font-black text-navy mt-1 truncate">
                {{ primaryCategory?.target_name || t('archer_event_overview.not_assigned') }}
              </div>
            </div>

            <!-- Kategori -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-[10px] font-bold text-slate-400">{{ t("archer_event_overview.category_label") }}</div>
              <div class="text-sm font-black text-navy mt-1 truncate" :title="primaryCategory?.category_name">
                {{ primaryCategory?.category_name || t('archer_event_overview.general_category') }}
              </div>
            </div>

            <!-- Divisi Busur -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-[10px] font-bold text-slate-400">{{ t("archer_event_overview.bow_division_label") }}</div>
              <div class="text-sm font-black text-navy mt-1 truncate">
                {{ primaryCategory?.division_name || 'Recurve' }}
              </div>
            </div>

            <!-- Nomor Atlet / Kode -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-[10px] font-bold text-slate-400">{{ t("archer_event_overview.athlete_code_label") }}</div>
              <div class="text-sm font-black text-navy mt-1 font-mono truncate">
                {{ participant?.athlete_code || ('ARC-' + (participant?.archer_id || '').substring(0, 5).toUpperCase()) }}
              </div>
            </div>
          </div>

          <!-- Quick Action CTA inside Card -->
          <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span class="text-slate-500 font-medium">{{ t("archer_event_overview.need_ticket_info") }}</span>
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-registration`" class="inline-flex items-center gap-1.5 font-black text-navy hover:text-primary transition-colors">
              <span>{{ t("archer_event_overview.open_reg_detail") }}</span>
              <Icon icon="ph:arrow-right-bold" />
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation Hub: 6 Core Performance Cards -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-black text-navy flex items-center gap-2">
              <Icon icon="ph:compass-bold" class="text-primary text-xl" />
              <span>{{ t("archer_event_overview.match_features_menu") }}</span>
            </h3>
            <span class="text-xs text-slate-400 font-bold">{{ t("archer_event_overview.quick_access_portal") }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Card 1: My Registration & QR -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-registration`"
              class="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 text-navy flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                <Icon icon="ph:qr-code-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-navy group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_reg_title") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_reg_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 2: My Target -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-target`"
              class="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 text-navy flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                <Icon icon="ph:crosshair-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-navy group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_target_title") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_target_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 3: Scorecard Qualification -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-qualification`"
              class="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 text-navy flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                <Icon icon="ph:pencil-line-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-navy group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_qual_title") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_qual_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 4: Elimination Bracket -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-elimination`"
              class="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 text-navy flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                <Icon icon="ph:tree-structure-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-navy group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_elim_title") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_elim_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 5: Team Performance -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-team`"
              class="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 text-navy flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                <Icon icon="ph:users-three-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-navy group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_team_title") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_team_desc") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 6: My Certificate -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-certificate`"
              class="group bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-50 border border-slate-100 text-navy flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/30 transition-all">
                <Icon icon="ph:certificate-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-navy group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_cert_title") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_cert_desc") }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Right Column: Event Info, Schedule & Guidebook -->
      <div class="space-y-6">

        <!-- Live Leaderboard Quick Widget -->
        <div class="bg-gradient-to-br from-navy to-navy/95 text-white rounded-3xl p-6 shadow-sm space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-black text-primary tracking-wider">{{ t("archer_event_overview.live_tournament") }}</span>
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h4 class="text-base font-black">{{ t("archer_event_overview.live_leaderboard_title") }}</h4>
            <div class="text-xs text-slate-300 mt-1">{{ t("archer_event_overview.live_leaderboard_desc") }}</div>
          </div>
          <NuxtLink :to="`/dashboard/archer/events/${eventId}/leaderboard`"
            class="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-navy font-black text-xs rounded-xl transition-all shadow-sm">
            <Icon icon="ph:chart-bar-bold" class="text-base" />
            <span>{{ t("archer_event_overview.open_live_leaderboard") }}</span>
          </NuxtLink>
        </div>

        <!-- Event Information Card -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
          <h4 class="text-sm font-black text-navy flex items-center gap-2 border-b border-gray-100 pb-3">
            <Icon icon="ph:info-bold" class="text-primary text-lg" />
            <span>{{ t("archer_event_overview.tournament_info") }}</span>
          </h4>

          <div class="space-y-4 text-xs">
            <div>
              <span class="text-slate-400 font-bold block mb-0.5">Penyelenggara</span>
              <span class="font-black text-navy">{{ event?.organizer_name || 'Panitia Turnamen' }}</span>
            </div>

            <div>
              <span class="text-slate-400 font-bold block mb-0.5">Lokasi & Venue</span>
              <span class="font-bold text-navy leading-relaxed block">{{ event?.venue || '-' }}</span>
              <span class="text-slate-500 mt-0.5 block">{{ event?.location || '' }}</span>
            </div>

            <div>
              <span class="text-slate-400 font-bold block mb-0.5">Tanggal Pelaksanaan</span>
              <span class="font-bold text-navy">{{ formatDateRange(event?.start_date, event?.end_date) }}</span>
            </div>

            <div v-if="event?.technical_guidebook_url" class="pt-2">
              <a :href="event.technical_guidebook_url" target="_blank"
                class="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-xl transition-colors">
                <Icon icon="ph:file-pdf-bold" class="text-base text-red-500" />
                <span>Unduh Petunjuk Teknis (THB)</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Event Schedule Highlights -->
        <div v-if="schedules && schedules.length > 0" class="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
          <h4 class="text-sm font-black text-navy flex items-center gap-2 border-b border-gray-100 pb-3">
            <Icon icon="ph:clock-countdown-bold" class="text-primary text-lg" />
            <span>Jadwal & Rundown</span>
          </h4>

          <div class="space-y-3">
            <div v-for="(item, idx) in schedules.slice(0, 4)" :key="idx" class="flex items-start gap-3 text-xs">
              <div class="size-6 rounded-lg bg-primary/10 text-navy font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                {{ idx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-navy truncate">{{ item.title || item.name }}</div>
                <div class="text-slate-400 text-[11px] font-medium">{{ item.date || item.time || '-' }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
  layout: 'dashboard'
})

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
  title: computed(() => `${event.value?.name || 'Ringkasan Event'} - ArcheryHub Dashboard`)
})

const isPaid = (status) => {
  const s = (status || '').toLowerCase()
  return ['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes(s)
}

const getStatusBadgeClass = (status) => {
  if (isPaid(status)) {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

const formatDateRange = (start, end) => {
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

const loadData = async () => {
  isLoading.value = true
  try {
    const [eventRes, participantRes, scheduleRes] = await Promise.allSettled([
      get(`/events/${eventId}`),
      get(`/events/${eventId}/participants/me`),
      get(`/events/${eventId}/schedule`)
    ])

    if (eventRes.status === 'fulfilled') {
      event.value = eventRes.value?.data || eventRes.value
    }

    if (participantRes.status === 'fulfilled') {
      participant.value = participantRes.value?.data || participantRes.value
    }

    if (scheduleRes.status === 'fulfilled') {
      const sch = scheduleRes.value?.data || scheduleRes.value
      schedules.value = Array.isArray(sch) ? sch : []
    }
  } catch (err) {
    console.error('Failed to load event overview:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>
