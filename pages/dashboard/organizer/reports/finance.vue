<template>
  <div class="space-y-8">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('dashboard.reports.finance_title')"
      :subtitle="t('dashboard.reports.finance_desc')"
      icon="ph:currency-circle-dollar-bold"
      :back-to="getBackLink()"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('dashboard.reports.title'), to: '/dashboard/organizer/reports' },
        { label: t('dashboard.reports.finance_title') }
      ]"
    >
      <template #actions>
        <BaseButton variant="primary" icon="ph:download-simple-bold" class="h-11 px-5 text-xs font-black" @click="handleExportExcel">
          {{ t('dashboard.reports.export_excel') }}
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Filters Panel -->
    <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div class="flex items-center gap-2 pb-3 border-b border-gray-100">
        <Icon icon="ph:funnel-bold" class="text-primary text-lg" />
        <h3 class="text-sm font-black text-navy-dark">{{ t('dashboard.reports.report_filters') }}</h3>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <!-- Event Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 tracking-wider">{{ t('dashboard.reports.select_event') }}</label>
          <BaseSelect v-model="filters.event_id" :items="eventsDropdownItems" :placeholder="t('dashboard.reports.select_event')" />
        </div>

        <!-- Start Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 tracking-wider">{{ t('dashboard.reports.start_date') }}</label>
          <BaseDatePicker v-model="filters.start_date" :placeholder="t('dashboard.reports.start_date')" />
        </div>

        <!-- End Date Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 tracking-wider">{{ t('dashboard.reports.end_date') }}</label>
          <BaseDatePicker v-model="filters.end_date" :placeholder="t('dashboard.reports.end_date')" />
        </div>

        <!-- Payment Method Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 tracking-wider">{{ t('dashboard.reports.payment_method') }}</label>
          <BaseSelect v-model="filters.payment_method" :items="methodOptions" :placeholder="t('dashboard.reports.all_methods')" />
        </div>

        <!-- Payment Status Filter -->
        <div class="space-y-1">
          <label class="text-[10px] font-black text-gray-500 tracking-wider">{{ t('dashboard.reports.payment_status') }}</label>
          <BaseSelect v-model="filters.status" :items="statusOptions" :placeholder="t('dashboard.reports.all_status')" />
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
      <StatCard :title="t('dashboard.reports.total_paid_revenue')" :value="'Rp ' + formatPrice(stats.total_paid || 0)" icon="ph:wallet-bold" color="success" />
      <StatCard :title="t('dashboard.reports.pending_payments')" :value="'Rp ' + formatPrice(stats.total_pending || 0)" icon="ph:clock-bold" color="warning" />
      <StatCard :title="t('dashboard.reports.expired_failed_payments')" :value="'Rp ' + formatPrice(stats.total_failed || 0)" icon="ph:x-circle-bold" color="primary" />
    </div>

    <!-- Revenue Trend Chart -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <h3 class="text-navy-dark font-black text-base flex items-center gap-2 mb-6">
        <Icon icon="ph:chart-line-up-bold" class="text-primary" />
        {{ t('dashboard.reports.revenue_trend') }}
      </h3>
      <div v-if="trendPoints.length > 1" class="relative">
        <svg viewBox="0 0 500 150" class="w-full h-48 overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradient-finance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#10b981" stop-opacity="0.3" />
              <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
            </linearGradient>
          </defs>
          <path :d="svgAreaPath" fill="url(#gradient-finance)" />
          <path :d="svgLinePath" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />
        </svg>
        <div class="flex justify-between text-[9px] text-gray-400 font-bold mt-3">
          <span>{{ trendPoints[0].date }}</span>
          <span>{{ trendPoints[Math.floor(trendPoints.length / 2)].date }}</span>
          <span>{{ trendPoints[trendPoints.length - 1].date }}</span>
        </div>
      </div>
      <div v-else class="h-48 flex flex-col items-center justify-center text-gray-400 space-y-2 border border-dashed border-gray-100 rounded-xl">
        <Icon icon="ph:coin-bold" class="text-3xl" />
        <div class="text-xs font-bold">{{ t('dashboard.reports.no_revenue_timeline') }}</div>
      </div>
    </div>

    <!-- Splits and Breakdowns -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- payment method split -->
      <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4 lg:col-span-2">
        <h3 class="text-navy font-black text-sm flex items-center gap-2">
          <Icon icon="ph:credit-card-bold" class="text-primary" />
          {{ t('dashboard.reports.payment_methods_split') }}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div v-for="item in stats.payment_method_split" :key="item.name" class="p-4 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
            <div class="flex justify-between text-xs font-bold">
              <span class="text-navy font-bold capitalize">{{ formatPaymentMethodName(item.name) }}</span>
              <span class="text-gray-500 font-semibold">{{ item.count }} Txn</span>
            </div>
            <div class="text-lg font-black text-navy">Rp {{ formatPrice(item.amount) }}</div>
            <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-full rounded-full" :style="{ width: getPercent(item.amount) + '%' }"></div>
            </div>
            <div class="text-[10px] text-gray-400 font-bold text-right">{{ getPercent(item.amount) }}{{ t('dashboard.reports.of_total') }}</div>
          </div>
          <div v-if="!stats.payment_method_split?.length" class="text-center col-span-2 py-6 text-xs text-gray-400 font-medium">{{ t('dashboard.reports.no_payment_split_data') }}</div>
        </div>
      </div>

      <!-- Quick Action Stats -->
      <div class="bg-navy text-white border border-gray-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <Icon icon="ph:bank-bold" class="text-9xl rotate-12" />
        </div>
        <div class="space-y-4 relative z-10">
          <h3 class="text-lg font-black flex items-center gap-2">
            <Icon icon="ph:info-bold" class="text-yellow-400" />
            {{ t('dashboard.reports.financial_overview_title') }}
          </h3>
          <div class="text-slate-300 text-xs font-medium leading-relaxed">
            {{ t('dashboard.reports.financial_overview_desc') }}
          </div>
        </div>
        <NuxtLink to="/dashboard/organizer/balance" class="w-full mt-6 relative z-10">
          <BaseButton variant="primary" class="w-full h-11 text-xs font-black shadow-lg shadow-primary/20">
            {{ t('dashboard.reports.go_to_balance') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </div>

    <!-- Transactions Ledger with DashboardDataTable -->
    <DashboardDataTable
      :items="stats.recent_transactions || []"
      :headers="headers"
      :searchable="true"
      :search-placeholder="t('dashboard.reports.search_placeholder', 'Cari no. referensi, nama atau event...')"
      :title="t('dashboard.reports.recent_transaction_history')"
      :subtitle="t('dashboard.reports.total_transactions_count', '{n} Transaksi', { n: (stats.recent_transactions || []).length })"
      :icon="'ph:list-dashes-bold'"
      :default-page-size="10"
    >
      <template #item-reference="{ item }">
        <span class="text-navy font-bold font-mono text-xs">{{ item.reference }}</span>
      </template>

      <template #item-user_name="{ item }">
        <span class="text-gray-700 font-bold capitalize text-xs">{{ item.user_name ? item.user_name.toLowerCase() : '-' }}</span>
      </template>

      <template #item-sender_name="{ item }">
        <span class="text-gray-700 font-medium capitalize text-xs">{{ item.sender_name || '-' }}</span>
      </template>

      <template #item-event_name="{ item }">
        <span class="text-gray-500 font-semibold capitalize text-xs">{{ (item.event_name || '').toLowerCase() }}</span>
      </template>

      <template #item-amount="{ item }">
        <span class="text-navy font-black font-mono text-xs">Rp {{ formatPrice(item.amount) }}</span>
      </template>

      <template #item-payment_method="{ item }">
        <span class="text-gray-500 font-bold text-xs">{{ item.payment_method || 'manual' }}</span>
      </template>

      <template #item-status="{ item }">
        <span 
          :class="[
            item.status === 'paid' ? 'bg-green-50 text-green-600 border-green-200' : '',
            item.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : '',
            item.status === 'expired' ? 'bg-slate-50 text-slate-400 border-slate-200' : '',
            item.status === 'failed' ? 'bg-red-50 text-red-600 border-red-200' : '',
          ]"
          class="px-2 py-0.5 rounded-full border text-[10px] font-black tracking-wider"
        >
          {{ item.status }}
        </span>
      </template>

      <template #item-created_at="{ item }">
        <span class="text-gray-400 font-semibold font-mono text-xs">{{ formatDate(item.created_at) }}</span>
      </template>

      <template #empty>
        <div class="text-center py-10 text-gray-400 font-bold">{{ t('dashboard.reports.no_transactions_found') }}</div>
      </template>
    </DashboardDataTable>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import { exportToExcel } from '~/utils/exportExcel'

definePageMeta({
  layout: 'dashboard'
})

const { t, locale } = useI18n()
useHead({ title: computed(() => `${t('dashboard.reports.finance_title')} - Archeris Dashboard`) })

const route = useRoute()
const api = useApi()

const headers = computed(() => [
  { key: 'reference', label: t('dashboard.reports.reference', 'No. Referensi'), sortable: true },
  { key: 'user_name', label: t('dashboard.reports.user', 'User'), sortable: true },
  { key: 'sender_name', label: t('my_registration.sender_name', 'Nama Pengirim'), sortable: true },
  { key: 'event_name', label: t('dashboard.reports.event', 'Event'), sortable: true },
  { key: 'amount', label: t('dashboard.reports.amount', 'Nominal'), sortable: true },
  { key: 'payment_method', label: t('dashboard.reports.method', 'Metode'), sortable: true },
  { key: 'status', label: t('dashboard.reports.status', 'Status'), sortable: true },
  { key: 'created_at', label: t('dashboard.reports.date', 'Tanggal'), sortable: true }
])

const eventsList = ref([])
const stats = ref({
  total_paid: 0,
  total_pending: 0,
  total_failed: 0,
  payment_method_split: [],
  revenue_trend: [],
  recent_transactions: [],
  events_list: []
})

const filters = reactive({
  event_id: route.query.event_id || 'all',
  start_date: '',
  end_date: '',
  payment_method: 'all',
  status: 'all'
})

const eventsDropdownItems = computed(() => [
  { title: t('dashboard.reports.all_events', 'Semua Event'), value: 'all' },
  ...eventsList.value.map(e => ({ title: e.name, value: e.id }))
])

const methodOptions = computed(() => [
  { title: t('dashboard.reports.all_methods', 'Semua Metode'), value: 'all' },
  { title: 'Manual Transfer', value: 'manual_transfer' },
  { title: 'Bank Transfer (VA)', value: 'bank_transfer' },
  { title: 'QRIS', value: 'qris' },
  { title: 'Credit Card', value: 'credit_card' },
  { title: 'E-Wallet', value: 'e_wallet' }
])

const statusOptions = computed(() => [
  { title: t('dashboard.reports.all_status', 'Semua Status'), value: 'all' },
  { title: 'Paid', value: 'paid' },
  { title: 'Pending', value: 'pending' },
  { title: 'Expired', value: 'expired' },
  { title: 'Failed', value: 'failed' }
])

onMounted(() => {
  fetchReportData()
})

const fetchReportData = async () => {
  try {
    const queryParams = new URLSearchParams()
    if (filters.event_id !== 'all') queryParams.append('event_id', filters.event_id)
    if (filters.start_date) queryParams.append('start_date', filters.start_date)
    if (filters.end_date) queryParams.append('end_date', filters.end_date)
    if (filters.payment_method !== 'all') queryParams.append('payment_method', filters.payment_method)
    if (filters.status !== 'all') queryParams.append('status', filters.status)

    const res = await api.get(`/organizers/reports/finance?${queryParams.toString()}`)
    if (res) {
      stats.value = res
      if (res.events_list) {
        eventsList.value = res.events_list
      }
    }
  } catch (err) {
    console.error('failed to fetch financial report:', err)
  }
}

const getBackLink = () => {
  return route.query.event_id ? `/dashboard/organizer/reports?event_id=${route.query.event_id}` : '/dashboard/organizer/reports'
}

const applyFilters = () => {
  fetchReportData()
}

const resetFilters = () => {
  filters.event_id = route.query.event_id || 'all'
  filters.start_date = ''
  filters.end_date = ''
  filters.payment_method = 'all'
  filters.status = 'all'
  fetchReportData()
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

const getPercent = (amount) => {
  const total = stats.value.total_paid || 1
  return Math.round((amount / total) * 100)
}

const trendPoints = computed(() => {
  return stats.value.revenue_trend || []
})

const svgLinePath = computed(() => {
  const trend = trendPoints.value
  if (trend.length <= 1) return ''
  const max = Math.max(...trend.map(d => d.value)) || 1
  const width = 500
  const height = 150
  const points = trend.map((d, i) => {
    const x = (i / (trend.length - 1)) * width
    const y = height - (d.value / max) * height
    return `${x},${y}`
  })
  return `M ${points.join(' L ')}`
})

const svgAreaPath = computed(() => {
  const path = svgLinePath.value
  if (!path) return ''
  const width = 500
  const height = 150
  return `${path} L ${width},${height} L 0,${height} Z`
})

const handleExportExcel = () => {
  const list = stats.value.recent_transactions || []
  const data = list.map((t, idx) => ({
    no: idx + 1,
    reference: t.reference || t.code || '-',
    user_name: t.user_name || t.archer_name || '-',
    event_name: t.event_name || '-',
    method: t.payment_method || '-',
    status: t.status || 'paid',
    amount: t.amount || 0,
    date: t.created_at || '-'
  }))
  exportToExcel(
    'Laporan_Keuangan_Turnamen_Archeris',
    [
      { key: 'no', label: 'No' },
      { key: 'reference', label: 'No. Referensi' },
      { key: 'user_name', label: 'Nama Pembayar' },
      { key: 'event_name', label: 'Event' },
      { key: 'method', label: 'Metode Pembayaran' },
      { key: 'status', label: 'Status' },
      { key: 'amount', label: 'Nominal (IDR)' },
      { key: 'date', label: 'Waktu Transaksi' }
    ],
    data
  )
}

const formatPaymentMethodName = (name) => {
  if (!name) return '-'
  const map = {
    'bank_transfer': 'Bank Transfer',
    'manual_transfer': 'Manual Transfer',
    'qris': 'QRIS',
    'credit_card': 'Credit Card',
    'e_wallet': 'E-Wallet',
    'mayar': 'Mayar Gateway',
    'midtrans': 'Midtrans Gateway'
  }
  return map[name.toLowerCase()] || name.replace(/_/g, ' ')
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: '2-digit'
  })
}
</script>

<style scoped>
.text-navy-dark {
  color: #1e293b;
}
.bg-navy {
  background-color: var(--sidebar-bg, #0f172a);
}
</style>
