<template>
  <div class="space-y-8">
    <!-- Back Header -->
    <div class="flex items-center gap-3">
      <NuxtLink :to="getBackLink()" class="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-navy-dark transition-all flex items-center justify-center">
        <Icon icon="ph:arrow-left-bold" class="text-lg" />
      </NuxtLink>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-navy-dark">{{ t('dashboard.reports.performance_title') }}</h1>
        <p class="text-gray-500 text-xs font-bold leading-none mt-1">Review Event Fill Rates, Category Registration Statistics, and Quota Utilization.</p>
      </div>
    </div>

    <!-- Filters Panel -->
    <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Icon icon="ph:funnel-bold" class="text-primary text-lg" />
        <h3 class="text-sm font-black text-navy-dark">Report Filters</h3>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Start Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">{{ t('dashboard.reports.start_date') }}</label>
          <input type="date" v-model="filters.start_date" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none" />
        </div>

        <!-- End Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-wider">{{ t('dashboard.reports.end_date') }}</label>
          <input type="date" v-model="filters.end_date" class="w-full h-10 px-3 border border-gray-200 rounded-xl text-xs font-bold bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none" />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <BaseButton variant="ghost" class="h-9 px-4 text-xs font-black" @click="resetFilters">
          {{ t('dashboard.reports.reset_filters') }}
        </BaseButton>
        <BaseButton variant="primary" class="h-9 px-5 text-xs font-black shadow-lg shadow-primary/10" @click="applyFilters">
          {{ t('dashboard.reports.apply_filters') }}
        </BaseButton>
      </div>
    </div>

    <!-- Stats summary grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <StatCard title="Total Events Organized" :value="stats.events_performance?.length || 0" icon="ph:trophy-bold" color="primary" />
      <StatCard title="Total Participants Registered" :value="stats.total_participants || 0" icon="ph:users-three-bold" color="success" />
      <StatCard title="Average Event Fill Rate" :value="Math.round(stats.average_fill_rate || 0) + '%'" icon="ph:chart-pie-bold" color="primary" />
    </div>

    <!-- Event Performance Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div class="p-5 border-b border-gray-100 flex items-center justify-between">
        <h3 class="text-navy-dark font-black text-sm flex items-center gap-2">
          <Icon icon="ph:list-dashes-bold" class="text-primary" />
          Organized Events Fill Rates
        </h3>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 text-gray-500 font-bold border-b border-gray-100">
            <tr>
              <th class="px-6 py-4">Event Name</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Event Dates</th>
              <th class="px-6 py-4">Categories Count</th>
              <th class="px-6 py-4">Registrants / Capacity</th>
              <th class="px-6 py-4">Quota Fill Rate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 font-medium">
            <tr v-for="e in stats.events_performance" :key="e.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-navy-dark font-bold truncate max-w-xs capitalize">{{ e.name.toLowerCase() }}</td>
              <td class="px-6 py-4">
                <span 
                  :class="[
                    e.status === 'published' ? 'bg-green-50 text-green-600 border-green-200' : '',
                    e.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-200' : '',
                    e.status === 'draft' ? 'bg-slate-50 text-slate-500 border-slate-200' : '',
                  ]"
                  class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider capitalize"
                >
                  {{ e.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-gray-500 font-semibold font-mono">{{ formatDateRange(e.start_date, e.end_date) }}</td>
              <td class="px-6 py-4 text-gray-500 font-bold text-center">{{ e.total_categories }}</td>
              <td class="px-6 py-4 text-navy-dark font-bold font-mono">
                {{ e.total_participants }} / {{ e.total_capacity > 0 ? e.total_capacity : 'Unlimited' }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-24 bg-gray-100 h-2 rounded-full overflow-hidden shrink-0">
                    <div 
                      :class="e.fill_rate >= 100 ? 'bg-green-500' : 'bg-primary'"
                      class="h-full rounded-full" 
                      :style="{ width: Math.min(e.fill_rate, 100) + '%' }"
                    ></div>
                  </div>
                  <span class="text-navy-dark font-bold font-mono text-[10px]">{{ Math.round(e.fill_rate) }}%</span>
                </div>
              </td>
            </tr>
            <tr v-if="!stats.events_performance?.length">
              <td colspan="6" class="text-center py-10 text-gray-400 font-bold">No Events Performance Data Found Matching Filters.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const api = useApi()

const stats = ref({
  status_summary: [],
  events_performance: [],
  average_fill_rate: 0,
  total_capacity: 0,
  total_participants: 0
})

const filters = reactive({
  start_date: '',
  end_date: ''
})

onMounted(() => {
  fetchReportData()
})

const fetchReportData = async () => {
  try {
    const queryParams = new URLSearchParams()
    if (filters.start_date) queryParams.append('start_date', filters.start_date)
    if (filters.end_date) queryParams.append('end_date', filters.end_date)

    const res = await api.get(`/organizations/reports/performance?${queryParams.toString()}`)
    if (res) {
      stats.value = res
    }
  } catch (err) {
    console.error('failed to fetch performance report:', err)
  }
}

const getBackLink = () => {
  return route.query.event_id ? `/dashboard/organization/reports?event_id=${route.query.event_id}` : '/dashboard/organization/reports'
}

const applyFilters = () => {
  fetchReportData()
}

const resetFilters = () => {
  filters.start_date = ''
  filters.end_date = ''
  fetchReportData()
}

const formatDateRange = (startStr, endStr) => {
  if (!startStr) return '-'
  const start = new Date(startStr)
  const end = endStr ? new Date(endStr) : null
  const opt = { day: '2-digit', month: 'short' }
  const startF = start.toLocaleDateString('id-ID', opt)
  const endF = end ? end.toLocaleDateString('id-ID', opt) : ''
  return endF ? `${startF} - ${endF}` : startF
}
</script>

<style scoped>
.text-navy-dark {
  color: #1e293b;
}
</style>
