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
  title: computed(() => `${event.value?.name || 'Ringkasan Event'} - ArcheryHub Dashboard`)
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
      get(`/events/${eventId}`),
      get(`/events/${eventId}/participants/me`).catch(() => null),
      get(`/events/${eventId}/schedules`).catch(() => [])
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
              <Icon v-else icon="ph:trophy-bold" class="text-primary text-3xl" />
            </div>

            <!-- Event Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 text-xs text-white/60 mb-2">
                <NuxtLink to="/dashboard/archer/events" class="hover:text-white transition-colors">{{ t('sidebar.my_events', 'Event Saya') }}</NuxtLink>
                <Icon icon="ph:caret-right-bold" class="text-[10px]" />
                <span class="text-primary font-medium truncate">{{ t('archer_event_overview.title', 'Ringkasan Event') }}</span>
              </div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight">
                {{ event?.name || t('archer_event_overview.loading_event', 'Memuat Event...') }}
              </h1>
              <div class="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium mt-2">
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:map-pin-bold" class="text-primary text-sm" />
                  <span>{{ event?.venue || event?.location || t('archer_event_overview.match_venue', 'Venue Pertandingan') }}</span>
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
              <span>{{ t('archer_event_overview.public_page', 'Halaman Publik') }}</span>
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

        <!-- Archer Participation Card (Without AI Slop Chip) -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="size-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                <Icon icon="hugeicons:archer" class="text-2xl text-slate-800" />
              </div>
              <div>
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t("archer_event_overview.archer_participation_status", "Status Partisipasi Atlet") }}</span>
                <h3 class="text-lg font-black text-slate-900">{{ participant?.full_name || user?.full_name || t('archer_event_overview.default_archer_name', 'Nama Atlet') }}</h3>
                <div class="text-xs text-slate-500 font-medium">{{ participant?.club_name || t('archer_event_overview.independent_archer', 'Klub Independen') }}</div>
              </div>
            </div>

            <!-- Official Status Block (Replaces AI slop chip) -->
            <div class="shrink-0">
              <div v-if="isPaid(participant?.payment_status)"
                class="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200">
                <div class="size-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Icon icon="ph:seal-check-bold" class="text-base" />
                </div>
                <div>
                  <div class="text-[10px] font-bold text-emerald-800 capitalize">{{ t('archer_event_overview.registration_status_label', 'Status Registrasi') }}</div>
                  <div class="text-xs font-black text-emerald-950">{{ t('archer_event_overview.registered_confirmed', 'Terdaftar & Lunas') }}</div>
                </div>
              </div>
              <div v-else
                class="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
                <div class="size-7 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
                  <Icon icon="ph:clock-bold" class="text-base" />
                </div>
                <div>
                  <div class="text-[10px] font-bold text-amber-800 capitalize">{{ t('archer_event_overview.registration_status_label', 'Status Registrasi') }}</div>
                  <div class="text-xs font-black text-amber-950">{{ t('archer_event_overview.waiting_payment', 'Menunggu Pembayaran') }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Highlight Metric Grid for Archer -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <!-- Target / Bantalan -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-[10px] font-bold text-slate-400 capitalize">{{ t("archer_event_overview.target_face_label", "Bantalan Target") }}</div>
              <div class="text-base sm:text-lg font-black text-slate-900 mt-1 truncate">
                {{ primaryCategory?.target_name || t('archer_event_overview.not_assigned', 'Belum Diatur') }}
              </div>
            </div>

            <!-- Kategori -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-[10px] font-bold text-slate-400 capitalize">{{ t("archer_event_overview.category_label", "Kategori Turnamen") }}</div>
              <div class="text-xs sm:text-sm font-black text-slate-900 mt-1 truncate" :title="primaryCategory?.category_name">
                {{ primaryCategory?.category_name || t('archer_event_overview.general_category', 'Umum') }}
              </div>
            </div>

            <!-- Divisi Busur -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-[10px] font-bold text-slate-400 capitalize">{{ t("archer_event_overview.bow_division_label", "Divisi Busur") }}</div>
              <div class="text-xs sm:text-sm font-black text-slate-900 mt-1 truncate">
                {{ primaryCategory?.division_name || 'Recurve' }}
              </div>
            </div>

            <!-- Nomor Atlet / Kode -->
            <div class="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
              <div class="text-[10px] font-bold text-slate-400 capitalize">{{ t("archer_event_overview.athlete_code_label", "Nomor Atlet") }}</div>
              <div class="text-xs sm:text-sm font-black text-slate-900 mt-1 font-mono truncate">
                {{ participant?.athlete_code || ('ARC-' + (participant?.archer_id || '').substring(0, 5).toUpperCase()) }}
              </div>
            </div>
          </div>

          <!-- Quick Action CTA inside Card -->
          <div class="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span class="text-slate-500 font-medium">{{ t("archer_event_overview.need_ticket_info", "Perlu melihat rincian tiket & nomor registrasi?") }}</span>
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-registration`" class="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:text-primary transition-colors">
              <span>{{ t("archer_event_overview.open_reg_detail", "Buka Detail Pendaftaran") }}</span>
              <Icon icon="ph:arrow-right-bold" />
            </NuxtLink>
          </div>
        </div>

        <!-- Navigation Hub: 6 Core Performance Cards -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-black text-slate-900 flex items-center gap-2">
              <Icon icon="ph:compass-bold" class="text-primary text-xl" />
              <span>{{ t("archer_event_overview.match_features_menu", "Menu Fitur Pertandingan") }}</span>
            </h3>
            <span class="text-xs text-slate-400 font-semibold">{{ t("archer_event_overview.quick_access_portal", "Akses Cepat") }}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Card 1: My Registration & QR -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-registration`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Icon icon="ph:ticket-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_reg_title", "Pendaftaran & Tiket") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_reg_desc", "Cek status verifikasi, invoice, dan QR pass check-in lapangan.") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 2: My Target -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-target`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Icon icon="ph:target-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_target_title", "Target & Sesi Tanding") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_target_desc", "Lihat nomor bantalan, sesi kualifikasi, dan jarak tembak.") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 3: Scorecard Qualification -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-qualification`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Icon icon="ph:chart-line-up-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_score_title", "Skor Kualifikasi") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_score_desc", "Pantau perolehan total poin dan rincian seri kualifikasi Anda.") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 4: Elimination Brackets -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-elimination`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Icon icon="ph:git-merge-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_elim_title", "Bagan Eliminasi") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_elim_desc", "Bagan babak gugur, jadwal duel lawan, dan hasil medali.") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 5: Team & Mixed Team -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-team`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Icon icon="ph:users-four-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_team_title", "Regu & Tim") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_team_desc", "Lihat komposisi anggota regu beregu atau tim campuran Anda.") }}</div>
              </div>
            </NuxtLink>

            <!-- Card 6: Certificates -->
            <NuxtLink :to="`/dashboard/archer/events/${eventId}/my-certificate`"
              class="group bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-primary/40 transition-all flex items-start gap-4">
              <div class="size-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <Icon icon="ph:certificate-bold" class="text-2xl" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-black text-slate-900 group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_cert_title", "Sertifikat Elektronik") }}</h4>
                <div class="text-xs text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_cert_desc", "Unduh e-sertifikat peserta atau juara resmi setelah pertandingan selesai.") }}</div>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Right Column: Event Info & Rundown -->
      <div class="space-y-6">

        <!-- Live Leaderboard Quick Widget -->
        <div class="bg-gradient-to-br from-navy to-slate-900 text-white rounded-3xl p-6 border border-white/10 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-primary capitalize tracking-wider">{{ t("archer_event_overview.live_badge", "Pembaruan Langsung") }}</span>
            <span class="flex h-2 w-2 relative">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <h4 class="text-base font-black">{{ t("archer_event_overview.live_leaderboard_title", "Papan Skor Langsung") }}</h4>
            <div class="text-xs text-slate-300 mt-1">{{ t("archer_event_overview.live_leaderboard_desc", "Pantau posisi ranking kualifikasi seluruh pemanah secara real-time.") }}</div>
          </div>
          <NuxtLink :to="`/dashboard/archer/events/${eventId}/leaderboard`"
            class="w-full inline-flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-navy font-black text-xs rounded-xl transition-all shadow-xs">
            <Icon icon="ph:chart-bar-bold" class="text-base" />
            <span>{{ t("archer_event_overview.open_live_leaderboard", "Buka Papan Skor") }}</span>
          </NuxtLink>
        </div>

        <!-- Event Information Card -->
        <div class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h4 class="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Icon icon="ph:info-bold" class="text-slate-500 text-lg" />
            <span>{{ t("archer_event_overview.tournament_info", "Informasi Turnamen") }}</span>
          </h4>

          <div class="space-y-3.5 text-xs">
            <div>
              <span class="text-slate-400 font-medium block mb-0.5 capitalize">{{ t('archer_event_overview.organizer_label', 'Penyelenggara Event') }}</span>
              <span class="font-bold text-slate-900">{{ event?.organizer_name || 'Panitia Turnamen' }}</span>
            </div>

            <div>
              <span class="text-slate-400 font-medium block mb-0.5 capitalize">{{ t('archer_event_overview.location_venue_label', 'Lokasi & Venue') }}</span>
              <span class="font-bold text-slate-900 leading-relaxed block">{{ event?.venue || '-' }}</span>
              <span class="text-slate-500 mt-0.5 block">{{ event?.location || '' }}</span>
            </div>

            <div>
              <span class="text-slate-400 font-medium block mb-0.5 capitalize">{{ t('archer_event_overview.event_dates_label', 'Tanggal Pelaksanaan') }}</span>
              <span class="font-bold text-slate-900">{{ formatDateRange(event?.start_date, event?.end_date) }}</span>
            </div>

            <div v-if="event?.technical_guidebook_url" class="pt-2">
              <a :href="event.technical_guidebook_url" target="_blank"
                class="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-colors">
                <Icon icon="ph:file-pdf-bold" class="text-base text-red-500" />
                <span>{{ t('archer_event_overview.download_thb', 'Unduh Petunjuk Teknis (THB)') }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Event Schedule Highlights -->
        <div v-if="schedules && schedules.length > 0" class="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <h4 class="text-sm font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Icon icon="ph:clock-countdown-bold" class="text-slate-500 text-lg" />
            <span>{{ t('archer_event_overview.schedule_rundown', 'Jadwal & Rundown') }}</span>
          </h4>

          <div class="space-y-3">
            <div v-for="(item, idx) in schedules.slice(0, 4)" :key="idx" class="flex items-start gap-3 text-xs">
              <div class="size-6 rounded-lg bg-slate-100 text-slate-700 font-black flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                {{ idx + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-bold text-slate-900">{{ item.activity || item.title || item.name }}</div>
                <div class="text-[11px] text-slate-400 mt-0.5">{{ item.time || item.date || '' }}</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
