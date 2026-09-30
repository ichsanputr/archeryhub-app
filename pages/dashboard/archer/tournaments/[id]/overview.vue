<script setup>
import useDashboardI18n from '~/composables/useDashboardI18n'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useAuth } from '~/composables/useAuth'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useDashboardI18n()
const route = useRoute()
const eventId = route.params.id

const { get } = useApi()
const { user } = useAuth()

const isLoading = ref(true)
const event = ref(null)
const participant = ref(null)
const schedules = ref([])
const assignedTargets = ref([])

const eventSlug = computed(() => event.value?.slug || eventId)

const activeCategories = computed(() => {
  const cats = participant.value?.categories || []
  const nonCancelled = cats.filter(c => {
    const s = (c.payment_status || '').toLowerCase()
    return s !== 'cancelled' && s !== 'canceled' && s !== 'expired' && s !== 'failed'
  })
  return nonCancelled.length > 0 ? nonCancelled : cats
})

const primaryCategory = computed(() => {
  if (activeCategories.value && activeCategories.value.length > 0) {
    return activeCategories.value[0]
  }
  return null
})

const targetSummaryText = computed(() => {
  const list = assignedTargets.value
  if (!list || list.length === 0) {
    return t('my_registration.tba', 'Belum Ditentukan')
  }
  if (list.length === 1) {
    return list[0].target_name ? `Target ${list[0].target_name}` : t('my_registration.tba', 'Belum Ditentukan')
  }
  const names = list.map(x => x.target_name).filter(Boolean)
  return `${list.length} Target (${names.slice(0, 2).join(', ')})`
})

useHead({
  title: computed(() => `${event.value?.name || 'Ringkasan Event'} - Archeris Dashboard`)
})

const isPaid = (status) => {
  const ps = (status || participant.value?.payment_status || '').toLowerCase()
  const ts = (participant.value?.transaction?.status || '').toLowerCase()
  return ['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes(ps) ||
         ['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes(ts)
}

const isCancelled = computed(() => {
  const ps = (participant.value?.payment_status || '').toLowerCase()
  const ts = (participant.value?.transaction?.status || '').toLowerCase()

  if (['pending', 'paid', 'lunas', 'awaiting_verification', 'menunggu_acc'].includes(ts)) {
    return false
  }
  const hasActiveCat = (participant.value?.categories || []).some(c => {
    const cs = (c.payment_status || '').toLowerCase()
    return ['pending', 'paid', 'lunas', 'awaiting_verification', 'menunggu_acc'].includes(cs)
  })
  if (hasActiveCat) {
    return false
  }

  return ['cancelled', 'canceled', 'expired', 'failed'].includes(ps) || ['cancelled', 'canceled', 'expired', 'failed'].includes(ts)
})

const isRejected = computed(() => {
  if (isPaid() || !isCancelled.value) {
    const ts = (participant.value?.transaction?.status || '').toLowerCase()
    return ts === 'rejected'
  }
  const ps = (participant.value?.payment_status || '').toLowerCase()
  const ts = (participant.value?.transaction?.status || '').toLowerCase()
  return ps === 'rejected' || ts === 'rejected'
})

const isAwaitingVerification = computed(() => {
  const ps = (participant.value?.payment_status || '').toLowerCase()
  const ts = (participant.value?.transaction?.status || '').toLowerCase()
  return !isPaid() && !isCancelled.value && !isRejected.value && (ps === 'awaiting_verification' || ts === 'awaiting_verification' || !!participant.value?.transaction?.proof_url)
})

const registrationStatusText = computed(() => {
  if (isPaid(participant.value?.payment_status)) return t('archer_event_overview.registered_confirmed', 'Terdaftar')
  if (isCancelled.value) return t('payment_status.badge_cancelled', 'Dibatalkan')
  if (isRejected.value) return t('payment_status.badge_rejected', 'Ditolak')
  if (isAwaitingVerification.value) return t('payment_status.badge_awaiting_verification', 'Menunggu Verifikasi')
  return t('archer_event_overview.waiting_payment', 'Menunggu Bayar')
})

const paymentDetailText = computed(() => {
  if (isPaid(participant.value?.payment_status)) return t('billing.status_paid', 'Lunas')
  if (isAwaitingVerification.value) return t('my_registration.verifying_proof', 'Verifikasi Bukti')
  return t('archer_event_overview.check_invoice', 'Cek Tagihan Pembayaran')
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
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
    const [eventRes, participantRes, scheduleRes, targetRes] = await Promise.all([
      get(`/tournaments/${eventId}`),
      get(`/tournaments/${eventId}/participants/me`).catch(() => null),
      get(`/tournaments/${eventId}/schedules`).catch(() => []),
      get(`/tournaments/${eventId}/my-target`).catch(() => null)
    ])
    event.value = eventRes?.data || eventRes
    participant.value = participantRes?.data || participantRes
    schedules.value = Array.isArray(scheduleRes) ? scheduleRes : (scheduleRes?.data || [])
    
    const targets = targetRes?.data?.targets || targetRes?.targets || participant.value?.targets || []
    assignedTargets.value = Array.isArray(targets) ? targets : []
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
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header Banner (Standard DashboardHeader) -->
    <DashboardHeader
      :title="event?.name || t('archer_event_overview.loading_event', 'Ringkasan Event')"
      :subtitle="event ? `${event.venue || event.location || t('archer_event_overview.match_venue')} • ${formatDateRange(event?.start_date, event?.end_date)}` : ''"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: t('sidebar.my_events', 'Turnamen Saya'), to: '/dashboard/archer/tournaments' },
        { label: event?.name || t('archer_event_overview.title', 'Ringkasan Event') }
      ]"
    >
      <template #icon>
        <div class="size-14 sm:size-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shrink-0 shadow-md flex items-center justify-center">
          <img v-if="event?.banner_url || event?.logo_url" :src="useImageOrDefault(event.logo_url || event.banner_url)" :alt="event?.name" class="w-full h-full object-cover" />
          <Icon v-else icon="ph:trophy-bold" class="text-white text-3xl" />
        </div>
      </template>
      <template #actions>
        <div class="flex items-center gap-3 shrink-0">
          <NuxtLink :to="`/tournaments/${eventSlug || eventId}`" target="_blank"
            class="h-10 sm:h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs sm:text-sm font-bold flex items-center gap-2 backdrop-blur-sm transition-all shadow-sm">
            <Icon icon="ph:arrow-square-out-bold" class="text-base text-white" />
            <span>{{ t('archer_event_overview.public_page', 'Halaman Publik') }}</span>
          </NuxtLink>
        </div>
      </template>
    </DashboardHeader>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div v-for="i in 4" :key="i" class="h-28 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-xs" />
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="h-44 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-xs" />
          <div class="h-64 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-xs" />
        </div>
        <div class="h-96 bg-white rounded-2xl animate-pulse border border-slate-200 shadow-xs" />
      </div>
    </div>

    <!-- Loaded Content -->
    <div v-else class="space-y-6">
      
      <!-- Quick Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <!-- Category Card -->
        <StatCard
          :title="t('archer_event_overview.category_label', 'Kategori')"
          :value="primaryCategory?.category_name || t('archer_event_overview.general_category', 'Umum')"
          icon="ph:crosshair-bold"
          color="primary"
          :description="primaryCategory?.division_name || t('common.division', 'Divisi Lomba')"
          description-icon="ph:tag-bold"
        />

        <!-- Status Card -->
        <StatCard
          :title="t('archer_event_overview.registration_status_label', 'Status Registrasi')"
          :value="registrationStatusText"
          icon="ph:seal-check-bold"
          color="primary"
          :description="paymentDetailText"
          description-icon="ph:credit-card-bold"
        />

        <!-- Check-In Card -->
        <StatCard
          :title="t('my_registration.reregistration_status', 'Check-in')"
          :value="participant?.last_reregistration_at ? t('my_registration.checked_in', 'Sudah Hadir') : t('my_registration.not_checked_in', 'Belum Check-in')"
          icon="ph:qr-code-bold"
          color="primary"
          :description="participant?.last_reregistration_at ? t('my_registration.present_confirmed', 'Kehadiran Terverifikasi') : t('my_registration.show_qr_at_desk', 'Tunjukkan QR di Meja Panitia')"
          description-icon="ph:user-check-bold"
        />

        <!-- Athlete Code Card -->
        <StatCard
          :title="t('archer_event_overview.athlete_code_label', 'Kode Atlet')"
          :value="participant?.athlete_code || ('ARC-' + (participant?.archer_id || '').substring(0, 5).toUpperCase())"
          icon="ph:identification-card-bold"
          color="primary"
          value-class="font-mono"
          :description="targetSummaryText"
          description-icon="ph:target-bold"
        />
      </div>

      <!-- Main Columns Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        <!-- Left Column: Archer Status & Hub Cards -->
        <div class="lg:col-span-2 space-y-6 md:space-y-8">

          <!-- Archer Participation Card -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4">
                <div class="size-14 sm:size-16 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                  <img v-if="participant?.avatar_url || user?.avatar_url || participant?.avatar"
                    :src="useImageOrDefault(participant?.avatar_url || user?.avatar_url || participant?.avatar, participant?.full_name || user?.full_name)"
                    :alt="participant?.full_name || user?.full_name"
                    class="w-full h-full object-cover" />
                  <div v-else class="size-full bg-primary/15 border border-primary/20 flex items-center justify-center text-navy">
                    <Icon icon="hugeicons:archer" class="text-2xl sm:text-3xl" />
                  </div>
                </div>
                <div>
                  <span class="text-xs sm:text-sm font-semibold text-slate-400 block">{{ t("archer_event_overview.archer_participation_status") }}</span>
                  <div class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">{{ participant?.full_name || user?.full_name || t('archer_event_overview.default_archer_name') }}</div>
                  <div class="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">{{ participant?.club_name || t('archer_event_overview.independent_archer') }}</div>
                </div>
              </div>

              <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-registration`" class="inline-flex items-center gap-2 px-4 py-2 bg-navy text-white hover:bg-navy/90 font-bold text-xs rounded-xl transition-all shadow-xs shrink-0">
                <Icon icon="ph:qr-code-bold" class="text-base text-primary" />
                <span>{{ t("archer_event_overview.open_reg_detail", "Buka QR Pass") }}</span>
              </NuxtLink>
            </div>

            <!-- All Registered Categories (Prominent Cards Layout) -->
            <div v-if="activeCategories && activeCategories.length > 0" class="pt-5 border-t border-slate-100 dark:border-slate-700 space-y-3">
              <div class="flex items-center justify-between">
                <div class="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Icon icon="ph:trophy-bold" class="text-primary text-base" />
                  <span>{{ t('my_registration.registered_categories', 'Kategori yang Diikuti') }}</span>
                </div>
                <span class="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                  {{ activeCategories.length }} Kategori
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  v-for="cat in activeCategories"
                  :key="cat.id || cat.uuid"
                  class="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-600/60 flex items-center justify-between gap-3"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="size-10 rounded-xl bg-primary/15 border border-primary/20 text-navy flex items-center justify-center shrink-0">
                      <Icon icon="ph:crosshair-bold" class="text-lg text-navy" />
                    </div>
                    <div class="min-w-0">
                      <div class="text-sm sm:text-base font-black text-navy dark:text-white truncate">
                        {{ cat.category_name || cat.name }}
                      </div>
                      <div class="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span>{{ cat.division_name || 'Divisi Lomba' }}</span>
                        <template v-if="cat.gender || cat.class_category_name">
                          <span>•</span>
                          <span>{{ cat.class_category_name || cat.gender }}</span>
                        </template>
                      </div>
                    </div>
                  </div>

                  <div class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                    <Icon icon="ph:check-circle-bold" class="text-xs" />
                    <span>{{ isPaid(cat.payment_status) ? t('billing.status_paid', 'Lunas') : t('payment_status.registered', 'Terdaftar') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Navigation Hub: Performance Cards -->
          <div class="space-y-4">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
              <div class="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <div class="size-8 rounded-lg bg-primary/15 text-navy border border-primary/20 flex items-center justify-center">
                  <Icon icon="ph:compass-bold" class="text-base" />
                </div>
                <span>{{ t("archer_event_overview.match_features_menu") }}</span>
              </div>
              <span class="text-xs text-slate-400 font-semibold">{{ t("archer_event_overview.quick_access_portal") }}</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Card 1: My Registration & QR -->
              <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-registration`"
                class="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-navy/30 dark:hover:border-slate-500 hover:shadow-md transition-all flex items-start gap-4">
                <div class="size-12 rounded-xl bg-navy/5 dark:bg-slate-700 text-navy dark:text-white border border-navy/10 dark:border-slate-600 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-primary transition-colors shadow-2xs">
                  <Icon icon="ph:ticket-bold" class="text-2xl" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-navy dark:group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_reg_title") }}</div>
                  <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_reg_desc") }}</div>
                </div>
              </NuxtLink>

              <!-- Card 2: Target & Jadwal -->
              <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-target`"
                class="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-navy/30 dark:hover:border-slate-500 hover:shadow-md transition-all flex items-start gap-4">
                <div class="size-12 rounded-xl bg-navy/5 dark:bg-slate-700 text-navy dark:text-white border border-navy/10 dark:border-slate-600 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-primary transition-colors shadow-2xs">
                  <Icon icon="ph:crosshair-bold" class="text-2xl" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-navy dark:group-hover:text-primary transition-colors">{{ t("my_target.title") }}</div>
                  <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("my_target.subtitle") }}</div>
                </div>
              </NuxtLink>

              <!-- Card 3: Scorecard Qualification -->
              <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-qualification`"
                class="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-navy/30 dark:hover:border-slate-500 hover:shadow-md transition-all flex items-start gap-4">
                <div class="size-12 rounded-xl bg-navy/5 dark:bg-slate-700 text-navy dark:text-white border border-navy/10 dark:border-slate-600 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-primary transition-colors shadow-2xs">
                  <Icon icon="ph:chart-line-up-bold" class="text-2xl" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-navy dark:group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_score_title") }}</div>
                  <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_score_desc") }}</div>
                </div>
              </NuxtLink>

              <!-- Card 4: Elimination Brackets -->
              <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-elimination`"
                class="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-navy/30 dark:hover:border-slate-500 hover:shadow-md transition-all flex items-start gap-4">
                <div class="size-12 rounded-xl bg-navy/5 dark:bg-slate-700 text-navy dark:text-white border border-navy/10 dark:border-slate-600 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-primary transition-colors shadow-2xs">
                  <Icon icon="ph:git-merge-bold" class="text-2xl" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-navy dark:group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_elim_title") }}</div>
                  <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_elim_desc") }}</div>
                </div>
              </NuxtLink>

              <!-- Card 5: Team & Mixed Team -->
              <NuxtLink :to="`/dashboard/archer/tournaments/${eventId}/my-team`"
                class="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-navy/30 dark:hover:border-slate-500 hover:shadow-md transition-all flex items-start gap-4">
                <div class="size-12 rounded-xl bg-navy/5 dark:bg-slate-700 text-navy dark:text-white border border-navy/10 dark:border-slate-600 flex items-center justify-center shrink-0 group-hover:bg-navy group-hover:text-primary transition-colors shadow-2xs">
                  <Icon icon="ph:users-four-bold" class="text-2xl" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-navy dark:group-hover:text-primary transition-colors">{{ t("archer_event_overview.card_team_title") }}</div>
                  <div class="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2">{{ t("archer_event_overview.card_team_desc") }}</div>
                </div>
              </NuxtLink>
            </div>
          </div>

        </div>

        <!-- Right Column: Event Info & Rundown -->
        <div class="space-y-6">

          <!-- Event Information Card -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div class="flex items-center gap-2.5">
                <div class="size-7 rounded-lg bg-primary/15 text-navy border border-primary/20 flex items-center justify-center font-bold">
                  <Icon icon="ph:info-bold" class="text-sm" />
                </div>
                <span>{{ t("archer_event_overview.tournament_info") }}</span>
              </div>
              <span v-if="event?.code" class="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-md">
                #{{ event.code }}
              </span>
            </div>

            <div class="space-y-3.5 text-xs sm:text-sm">
              <!-- Organizer -->
              <div>
                <span class="text-slate-400 font-medium block mb-0.5">{{ t('archer_event_overview.organizer_label') }}</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ event?.organizer_name || 'Panitia Turnamen' }}</span>
              </div>

              <!-- Location / Venue -->
              <div>
                <span class="text-slate-400 font-medium block mb-0.5">{{ t('archer_event_overview.location_venue_label') }}</span>
                <span class="font-bold text-slate-900 dark:text-white leading-relaxed block">{{ event?.venue || '-' }}</span>
                <span v-if="event?.address || event?.location || event?.city" class="text-slate-500 dark:text-slate-400 mt-0.5 block leading-normal">
                  {{ [event?.address, event?.location, event?.city].filter(Boolean).join(', ') }}
                </span>
                <a v-if="event?.gmaps_link" :href="event.gmaps_link" target="_blank"
                  class="inline-flex items-center gap-1 text-xs font-bold text-navy dark:text-emerald-400 hover:underline mt-1">
                  <Icon icon="ph:map-pin-bold" class="text-xs" />
                  <span>{{ t('archer_event_overview.view_map') }}</span>
                </a>
              </div>

              <!-- Dates -->
              <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <span class="text-slate-400 font-medium block mb-0.5">{{ t('archer_event_overview.event_dates_label') }}</span>
                  <span class="font-bold text-slate-900 dark:text-white">{{ formatDateRange(event?.start_date, event?.end_date) }}</span>
                </div>
                <div v-if="event?.registration_deadline">
                  <span class="text-slate-400 font-medium block mb-0.5">{{ t('archer_event_overview.registration_deadline_label') }}</span>
                  <span class="font-bold text-slate-900 dark:text-white">{{ formatDate(event?.registration_deadline) }}</span>
                </div>
              </div>

              <!-- Contact Info -->
              <div v-if="event?.whatsapp_number || event?.organizer_phone" class="pt-2 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <span class="text-slate-400 font-medium block mb-0.5">{{ t('archer_event_overview.contact_person_label') }}</span>
                  <a :href="`https://wa.me/${(event?.whatsapp_number || event?.organizer_phone || '').replace(/[^0-9]/g, '')}`" target="_blank"
                    class="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
                    <Icon icon="logos:whatsapp-icon" class="text-xs" />
                    <span>{{ event?.whatsapp_number || event?.organizer_phone }}</span>
                  </a>
                </div>
              </div>

              <!-- THB Guidebook Download -->
              <div v-if="event?.technical_guidebook_url" class="pt-2">
                <a :href="event.technical_guidebook_url" target="_blank"
                  class="w-full inline-flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-slate-700 hover:bg-slate-100 text-slate-900 dark:text-white font-bold text-xs rounded-xl transition-colors border border-slate-200 dark:border-slate-600 shadow-2xs">
                  <Icon icon="ph:file-pdf-bold" class="text-base text-red-500" />
                  <span>{{ t('archer_event_overview.download_thb') }}</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Event Schedule Highlights -->
          <div v-if="schedules && schedules.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs space-y-4">
            <div class="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700 pb-3">
              <div class="size-7 rounded-lg bg-primary/15 text-navy border border-primary/20 flex items-center justify-center">
                <Icon icon="ph:clock-countdown-bold" class="text-sm" />
              </div>
              <span>{{ t('archer_event_overview.schedule_rundown') }}</span>
            </div>

            <div class="space-y-3">
              <div v-for="(item, idx) in schedules.slice(0, 4)" :key="idx" class="flex items-start gap-3 text-xs sm:text-sm">
                <div class="size-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-black flex items-center justify-center shrink-0 text-xs mt-0.5">
                  {{ idx + 1 }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="font-bold text-slate-900 dark:text-white">{{ item.activity || item.title || item.name }}</div>
                  <div class="text-xs sm:text-sm text-slate-400 mt-0.5">{{ item.time || item.date || '' }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  </div>
</template>
