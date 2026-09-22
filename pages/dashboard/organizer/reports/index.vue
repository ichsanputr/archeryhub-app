<template>
  <div class="space-y-6 md:space-y-8 pb-12 font-body text-navy antialiased">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('dashboard.reports.title')"
      :subtitle="t('dashboard.reports.subtitle')"
      icon="ph:chart-bar-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.reports.title') }
      ]"
    />

    <!-- Row 1: KPI Stats Summary Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <!-- Total Peserta Terdaftar -->
      <StatCard
        :title="t('dashboard.reports.total_registrations')"
        :value="summaryStats.totalParticipants"
        icon="ph:users-three-bold"
        color="primary"
        :description="t('dashboard.reports.total_registrations_desc')"
        description-icon="ph:users-bold"
      />

      <!-- Total Pendapatan / Transaksi -->
      <StatCard
        :title="t('dashboard.reports.total_paid_revenue')"
        :value="'Rp ' + formatPrice(summaryStats.totalIncome)"
        icon="ph:currency-circle-dollar-bold"
        color="primary"
        :description="t('dashboard.reports.paid_revenue_desc')"
        description-icon="ph:wallet-bold"
      />

      <!-- Tingkat Kehadiran Check-in -->
      <StatCard
        :title="t('dashboard.reports.checkin_rate')"
        :value="summaryStats.attendanceRate + '%'"
        icon="ph:check-circle-bold"
        color="primary"
        :description="t('dashboard.reports.checkin_rate_desc')"
        description-icon="ph:check-square-bold"
      >
        <template #footer>
          <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
            <div
              class="bg-primary h-1.5 rounded-full transition-all duration-700"
              :style="`width: ${summaryStats.attendanceRate}%`"></div>
          </div>
        </template>
      </StatCard>

      <!-- Total Turnamen Terkelola -->
      <StatCard
        :title="t('dashboard.reports.total_events_organized')"
        :value="summaryStats.totalEvents"
        icon="ph:trophy-bold"
        color="primary"
        :description="t('dashboard.reports.events_managed_desc')"
        description-icon="ph:calendar-blank-bold"
      />
    </div>

    <!-- Row 2: 4 Main Report Category Hub Cards -->
    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base sm:text-lg font-black text-navy tracking-tight">
            {{ t('dashboard.reports.hub_section_title') }}
          </h2>
          <div class="text-xs text-slate-500 font-medium">
            {{ t('dashboard.reports.hub_section_subtitle') }}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <NuxtLink
          v-for="report in reportTypes"
          :key="report.path"
          :to="report.path"
          class="group relative bg-white border border-slate-200/90 hover:border-navy/40 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer">
          <!-- Subtle Top Accent Gradient on Hover -->
          <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-yellow-200 to-navy opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <div class="space-y-4">
            <!-- Card Header: Icon & Category Badge -->
            <div class="flex items-start justify-between gap-3">
              <div class="size-12 rounded-2xl bg-navy text-white flex items-center justify-center shadow-xs border border-primary/20 group-hover:scale-105 transition-transform duration-200">
                <Icon :icon="report.icon" class="text-2xl text-primary" />
              </div>

              <span class="px-3 py-1 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200/90 text-slate-700">
                {{ report.badge }}
              </span>
            </div>

            <!-- Title & Description -->
            <div class="space-y-1.5">
              <h3 class="text-navy font-black text-base sm:text-lg transition-colors flex items-center gap-2">
                <span>{{ report.title }}</span>
              </h3>
              <div class="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                {{ report.description }}
              </div>
            </div>

            <!-- Feature Pills -->
            <div class="flex flex-wrap gap-1.5 pt-1">
              <span
                v-for="tag in report.highlights"
                :key="tag"
                class="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-600 text-[11px] font-bold">
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Bottom Action Bar -->
          <div class="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span class="text-xs font-black text-navy transition-colors">
              {{ t('dashboard.reports.open_report') }}
            </span>
            <div class="size-8 rounded-xl bg-slate-100 group-hover:bg-primary group-hover:text-navy text-navy flex items-center justify-center transition-all shadow-2xs">
              <Icon icon="ph:arrow-right-bold" class="text-sm group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref } from 'vue'
import { useApi } from '~/composables/useApi'
import { useDashboardI18n } from '~/composables/useDashboardI18n'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useDashboardI18n()
useHead({ title: computed(() => `${t('dashboard.reports.title')} - Archeris Dashboard`) })

const api = useApi()

const isLoadingStats = ref(true)

const summaryStats = ref({
  totalParticipants: 0,
  totalIncome: 0,
  attendanceRate: 0,
  totalEvents: 0
})

const formatPrice = (num) => {
  return Number(num || 0).toLocaleString('id-ID')
}

const fetchDashboardStats = async () => {
  isLoadingStats.value = true
  try {
    const [eventsRes, partsRes, finRes, attRes] = await Promise.all([
      api.get('/tournaments/my?limit=100').catch(() => null),
      api.get('/organizers/reports/participants').catch(() => null),
      api.get('/organizers/reports/finance').catch(() => null),
      api.get('/organizers/reports/attendance').catch(() => null)
    ])

    const events = eventsRes?.tournaments || eventsRes?.events || (Array.isArray(eventsRes) ? eventsRes : [])
    summaryStats.value.totalEvents = events.length || 0
    summaryStats.value.totalParticipants = partsRes?.stats?.total_participants || 0
    summaryStats.value.totalIncome = finRes?.stats?.total_paid || 0
    
    const checkedIn = attRes?.stats?.total_checked_in || 0
    const registered = attRes?.stats?.total_registered || 0
    summaryStats.value.attendanceRate = registered > 0 ? Math.round((checkedIn / registered) * 100) : 0
  } catch (err) {
    console.error('Failed to load reports summary:', err)
  } finally {
    isLoadingStats.value = false
  }
}

const reportTypes = computed(() => [
  {
    title: t('dashboard.reports.participants_title'),
    badge: t('dashboard.reports.badge_participants'),
    description: t('dashboard.reports.participants_desc'),
    icon: 'ph:user-list-bold',
    path: '/dashboard/organizer/reports/participants',
    highlights: [
      t('dashboard.reports.hl_division_dist'),
      t('dashboard.reports.hl_reg_chart'),
      t('dashboard.reports.hl_export_excel')
    ]
  },
  {
    title: t('dashboard.reports.finance_title'),
    badge: t('dashboard.reports.badge_finance'),
    description: t('dashboard.reports.finance_desc'),
    icon: 'ph:currency-circle-dollar-bold',
    path: '/dashboard/organizer/reports/finance',
    highlights: [
      t('dashboard.reports.hl_revenue_stream'),
      t('dashboard.reports.hl_payment_methods'),
      t('dashboard.reports.hl_period_filter')
    ]
  },
  {
    title: t('dashboard.reports.performance_title'),
    badge: t('dashboard.reports.badge_performance'),
    description: t('dashboard.reports.performance_desc'),
    icon: 'ph:target-bold',
    path: '/dashboard/organizer/reports/performance',
    highlights: [
      t('dashboard.reports.hl_fill_rate'),
      t('dashboard.reports.hl_quota_cap'),
      t('dashboard.reports.hl_event_analysis')
    ]
  },
  {
    title: t('dashboard.reports.attendance_title'),
    badge: t('dashboard.reports.badge_attendance'),
    description: t('dashboard.reports.attendance_desc'),
    icon: 'ph:check-square-bold',
    path: '/dashboard/organizer/reports/attendance',
    highlights: [
      t('dashboard.reports.hl_checkin_logs'),
      t('dashboard.reports.hl_attendance_ratio'),
      t('dashboard.reports.hl_doc_verification')
    ]
  }
])

onMounted(() => {
  fetchDashboardStats()
})
</script>
