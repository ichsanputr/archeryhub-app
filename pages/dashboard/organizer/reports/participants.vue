<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('dashboard.reports.participants_title')"
      :subtitle="t('dashboard.reports.participants_desc')"
      icon="ph:user-list-bold"
      :back-to="getBackLink()"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.reports.title', 'Laporan'), to: '/dashboard/organizer/reports' },
        { label: t('dashboard.reports.participants_title') }
      ]"
    >
      <template #actions>
        <BaseButton variant="primary" icon="ph:download-simple-bold" class="h-11 px-5 text-xs font-black" @click="handleExportExcel">
          {{ t('dashboard.reports.export_excel', 'Ekspor Excel') }}
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- filters panel -->
    <div class="bg-white border border-primary/10 rounded-2xl p-5 space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Icon icon="ph:funnel-bold" class="text-primary text-lg" />
        <h3 class="text-sm font-black text-navy">{{ t('dashboard.reports.report_filters', 'Filter Laporan') }}</h3>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- event -->
        <BaseSelect
          v-model="filters.event_id"
          :items="eventSelectItems"
          item-title="name"
          item-value="id"
          :placeholder="t('dashboard.reports.all_events', 'Semua Event')"
          :label="t('dashboard.reports.select_event', 'Pilih Event')"
          :searchable="true"
          clearable
        />

        <!-- bow type -->
        <BaseSelect
          v-model="filters.bow_type"
          :items="bowTypeItems"
          item-title="label"
          item-value="value"
          :label="t('dashboard.reports.bow_type_label', 'Jenis Busur (Division)')"
          :placeholder="t('dashboard.reports.all_bow_types', 'Semua Jenis Busur')"
          :searchable="false"
        />

        <!-- gender -->
        <BaseSelect
          v-model="filters.gender"
          :items="genderItems"
          item-title="label"
          item-value="value"
          :label="t('dashboard.reports.gender_category', 'Kategori Gender')"
          :placeholder="t('dashboard.reports.all_genders', 'Semua Gender')"
          :searchable="false"
        />

        <!-- check-in status -->
        <BaseSelect
          v-model="filters.status"
          :items="statusItems"
          item-title="label"
          item-value="value"
          :label="t('dashboard.reports.checkin_status_label', 'Status Registrasi Ulang')"
          :placeholder="t('dashboard.reports.all_status', 'Semua Status')"
          :searchable="false"
        />
      </div>

      <div class="flex justify-end gap-3 pt-1">
        <BaseButton variant="ghost" class="h-9 px-4 text-xs font-black" @click="resetFilters">
          {{ t('dashboard.reports.reset_filters') }}
        </BaseButton>
        <BaseButton variant="primary" class="h-9 px-5 text-xs font-black" @click="applyFilters">
          {{ t('dashboard.reports.apply_filters') }}
        </BaseButton>
      </div>
    </div>

    <!-- stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <StatCard :title="t('dashboard.reports.total_registrations', 'Total Pendaftar')" :value="stats.total_participants || 0" icon="ph:users-three-bold" color="primary" />
      <StatCard :title="t('dashboard.reports.checked_in_archers', 'Pemanah Hadir (Check-in)')" :value="stats.checked_in_count || 0" icon="ph:user-circle-check-bold" color="success" />
      <StatCard :title="t('dashboard.reports.pending_checkin', 'Belum Check-in')" :value="stats.pending_checkin_count || 0" icon="ph:clock-bold" color="warning" />
      <StatCard :title="t('dashboard.reports.checkin_rate', 'Tingkat Kehadiran')" :value="checkInRate + '%'" icon="ph:percent-bold" color="primary" />
    </div>

    <!-- registration trend chart -->
    <div class="bg-white border border-primary/10 rounded-2xl p-6">
      <h3 class="text-navy font-black text-base flex items-center gap-2 mb-6">
        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
        {{ t('dashboard.reports.registration_trend', 'Tren Registrasi Peserta') }}
      </h3>
      <div v-if="trendPoints.length > 1" class="relative">
        <svg viewBox="0 0 500 150" class="w-full h-48 overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="var(--color-primary, #ea580c)" stop-opacity="0.3" />
              <stop offset="100%" stop-color="var(--color-primary, #ea580c)" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="svgAreaPath" fill="url(#gradient-area)" />
          <path :d="svgLinePath" fill="none" stroke="var(--color-primary, #ea580c)" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <div class="flex justify-between text-[9px] text-gray-400 font-bold mt-3">
          <span>{{ trendPoints[0].date }}</span>
          <span>{{ trendPoints[Math.floor(trendPoints.length / 2)].date }}</span>
          <span>{{ trendPoints[trendPoints.length - 1].date }}</span>
        </div>
      </div>
      <div v-else class="h-48 flex flex-col items-center justify-center text-gray-400 space-y-2 border border-dashed border-gray-100 rounded-xl">
        <Icon icon="ph:trend-up-bold" class="text-3xl" />
        <div class="text-xs font-bold">{{ t('dashboard.reports.no_timeline_trend', 'Tidak ada data tren untuk filter yang dipilih.') }}</div>
      </div>
    </div>

    <!-- splits -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white border border-primary/10 rounded-2xl p-6 space-y-4">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
          <Icon icon="ph:crosshair-bold" class="text-primary" />
          {{ t('dashboard.reports.bow_types_split', 'Distribusi Divisi Busur') }}
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.bow_type_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy capitalize">{{ item.name.toLowerCase() }}</span>
              <span class="text-gray-500">{{ item.count }} ({{ getPercent(item.count) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: getPercent(item.count) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.bow_type_split?.length" class="text-center py-6 text-xs text-gray-400">{{ t('dashboard.reports.no_split_data', 'Belum ada data distribusi.') }}</div>
        </div>
      </div>

      <div class="bg-white border border-primary/10 rounded-2xl p-6 space-y-4">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
          <Icon icon="ph:gender-intersex-bold" class="text-primary" />
          {{ t('dashboard.reports.gender_split', 'Distribusi Gender') }}
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.gender_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy capitalize">{{ item.name.toLowerCase() }}</span>
              <span class="text-gray-500">{{ item.count }} ({{ getPercent(item.count) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: getPercent(item.count) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.gender_split?.length" class="text-center py-6 text-xs text-gray-400">{{ t('dashboard.reports.no_split_data', 'Belum ada data distribusi.') }}</div>
        </div>
      </div>

      <div class="bg-white border border-primary/10 rounded-2xl p-6 space-y-4">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
          <Icon icon="ph:globe-bold" class="text-primary" />
          {{ t('dashboard.reports.registration_sources', 'Sumber Pendaftaran') }}
        </h3>
        <div class="space-y-3">
          <div v-for="item in stats.registration_source_split" :key="item.name" class="space-y-1">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy capitalize">{{ item.name.replace('_', ' ').toLowerCase() }}</span>
              <span class="text-gray-500">{{ item.count }} ({{ getPercent(item.count) }}%)</span>
            </div>
            <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div class="bg-primary h-full rounded-full" :style="{ width: getPercent(item.count) + '%' }"></div>
            </div>
          </div>
          <div v-if="!stats.registration_source_split?.length" class="text-center py-6 text-xs text-gray-400">{{ t('dashboard.reports.no_split_data', 'Belum ada data distribusi.') }}</div>
        </div>
      </div>
    </div>

    <!-- participants table -->
    <div class="bg-white border border-primary/10 rounded-2xl overflow-hidden">
      <div class="p-5 border-b border-gray-100">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
          <Icon icon="ph:list-dashes-bold" class="text-primary" />
          {{ t('dashboard.reports.recent_registered_participants', 'Peserta Terbaru Terdaftar') }}
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th class="px-6 py-4">{{ t('dashboard.reports.archer', 'Pemanah') }}</th>
              <th class="px-6 py-4">{{ t('dashboard.reports.event', 'Turnamen') }}</th>
              <th class="px-6 py-4">{{ t('dashboard.reports.category_bow', 'Kategori / Busur') }}</th>
              <th class="px-6 py-4">{{ t('dashboard.reports.reg_date', 'Tgl Registrasi') }}</th>
              <th class="px-6 py-4">{{ t('dashboard.reports.payment', 'Pembayaran') }}</th>
              <th class="px-6 py-4">{{ t('dashboard.reports.checkin', 'Daftar Ulang') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-medium">
            <tr v-for="p in stats.recent_participants" :key="p.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img :src="useImageOrDefault(p.avatar_url, p.archer_name)" :alt="p.archer_name" class="size-8 rounded-full object-cover border border-gray-100 bg-gray-50 shrink-0" />
                  <span class="text-navy font-bold capitalize">{{ p.archer_name.toLowerCase() }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-gray-500 font-semibold capitalize">{{ p.event_name.toLowerCase() }}</td>
              <td class="px-6 py-4">
                <div class="text-navy font-bold capitalize">{{ p.bow_type ? p.bow_type.toLowerCase() : '-' }}</div>
                <div class="text-gray-400 text-[10px] font-bold capitalize">{{ p.age_group ? p.age_group.toLowerCase() : '' }} ({{ p.gender ? p.gender.toLowerCase() : '' }})</div>
              </td>
              <td class="px-6 py-4 text-gray-500 font-semibold font-mono">{{ formatDate(p.registration_date) }}</td>
              <td class="px-6 py-4">
                <span :class="p.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'"
                  class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider ">
                  {{ p.payment_status }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="p.last_reregistration_at ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'"
                  class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider capitalize">
                  {{ p.last_reregistration_at ? t('dashboard.reports.checked_in', 'Sudah Check-in') : t('dashboard.reports.pending', 'Menunggu') }}
                </span>
              </td>
            </tr>
            <tr v-if="!stats.recent_participants?.length">
              <td colspan="6" class="text-center py-10 text-gray-400 font-bold">{{ t('dashboard.reports.no_participants_found', 'Tidak ada peserta yang cocok dengan filter yang dipilih.') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({ layout: 'dashboard' })

const { t } = useI18n()
useHead({ title: computed(() => (t ? t('dashboard.reports.participants_title', 'Statistik Peserta') : 'Statistik Peserta') + ' - Archeris Dashboard') })
const route = useRoute()
const api = useApi()

const eventsList = ref([])
const stats = ref({
  total_participants: 0,
  gender_split: [],
  bow_type_split: [],
  age_group_split: [],
  registration_source_split: [],
  checked_in_count: 0,
  pending_checkin_count: 0,
  registration_trend: [],
  recent_participants: [],
  events_list: []
})

const filters = reactive({
  event_id: route.query.event_id || 'all',
  gender: 'all',
  bow_type: 'all',
  status: 'all'
})

const eventSelectItems = computed(() => [
  { id: 'all', name: t('dashboard.reports.all_events', 'Semua Turnamen') },
  ...eventsList.value
])

const bowTypeItems = computed(() => [
  { value: 'all', label: t('dashboard.reports.all_bow_types', 'Semua Divisi Busur') },
  { value: 'Recurve', label: 'Recurve' },
  { value: 'Compound', label: 'Compound' },
  { value: 'Barebow', label: 'Barebow' },
  { value: 'Traditional', label: 'Traditional' },
  { value: 'Standard', label: 'Standard Bow' },
])

const genderItems = computed(() => [
  { value: 'all', label: t('dashboard.reports.all_genders', 'Semua Gender') },
  { value: 'men', label: t('dashboard.reports.gender_male', 'Putra / Pria') },
  { value: 'women', label: t('dashboard.reports.gender_female', 'Putri / Wanita') },
  { value: 'mixed', label: t('dashboard.reports.gender_mixed', 'Mix / Campuran') },
])

const statusItems = computed(() => [
  { value: 'all', label: t('dashboard.reports.all_status', 'Semua Status') },
  { value: 'checked_in', label: t('dashboard.reports.status_checked_in', 'Sudah Registrasi Ulang (Checked In)') },
  { value: 'pending', label: t('dashboard.reports.status_pending', 'Belum Registrasi Ulang (Pending)') },
])

onMounted(() => { fetchReportData() })

const fetchReportData = async () => {
  try {
    const queryParams = new URLSearchParams()
    if (filters.event_id && filters.event_id !== 'all') queryParams.append('event_id', filters.event_id)
    if (filters.gender && filters.gender !== 'all') queryParams.append('gender', filters.gender)
    if (filters.bow_type && filters.bow_type !== 'all') queryParams.append('bow_type', filters.bow_type)
    if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status)

    const res = await api.get(`/organizers/reports/participants?${queryParams.toString()}`)
    if (res) {
      stats.value = res
      if (res.events_list) eventsList.value = res.events_list
    }
  } catch (err) {
    console.error('failed to fetch participants report:', err)
  }
}

const getBackLink = () =>
  route.query.event_id
    ? `/dashboard/organizer/reports?event_id=${route.query.event_id}`
    : '/dashboard/organizer/reports'

const applyFilters = () => fetchReportData()

const resetFilters = () => {
  filters.event_id = route.query.event_id || 'all'
  filters.gender = 'all'
  filters.bow_type = 'all'
  filters.status = 'all'
  fetchReportData()
}

const checkInRate = computed(() => {
  const total = stats.value.total_participants || 0
  if (total === 0) return 0
  return Math.round(((stats.value.checked_in_count || 0) / total) * 100)
})

const getPercent = (count) => {
  const total = stats.value.total_participants || 0
  if (total === 0) return 0
  return Math.round((count / total) * 100)
}

const trendPoints = computed(() => stats.value.registration_trend || [])

const svgLinePath = computed(() => {
  const trend = trendPoints.value
  if (trend.length <= 1) return ''
  const max = Math.max(...trend.map(d => d.value)) || 1
  const points = trend.map((d, i) => {
    const x = (i / (trend.length - 1)) * 500
    const y = 150 - (d.value / max) * 150
    return `${x},${y}`
  })
  return `M ${points.join(' L ')}`
})

const svgAreaPath = computed(() => {
  const path = svgLinePath.value
  if (!path) return ''
  return `${path} L 500,150 L 0,150 Z`
})

import { exportToExcel } from '~/utils/exportExcel'

const handleExportExcel = () => {
  const list = stats.value.recent_participants || []
  const data = list.map((p, idx) => ({
    no: idx + 1,
    name: p.archer_name || p.name || '-',
    email: p.email || '-',
    club: p.club_name || '-',
    category: p.category_name || '-',
    status: p.status || (p.checked_in ? 'Checked-in' : 'Registered'),
    registered_at: p.created_at ? formatDate(p.created_at) : '-'
  }))
  exportToExcel(
    'Laporan_Peserta_Turnamen_Archeris',
    [
      { key: 'no', label: 'No' },
      { key: 'name', label: 'Nama Peserta' },
      { key: 'email', label: 'Email' },
      { key: 'club', label: 'Klub' },
      { key: 'category', label: 'Kategori Lomba' },
      { key: 'status', label: 'Status Kehadiran' },
      { key: 'registered_at', label: 'Tanggal Registrasi' }
    ],
    data
  )
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: '2-digit' })
}
</script>
