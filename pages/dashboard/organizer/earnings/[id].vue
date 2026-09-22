<template>
  <div class="space-y-6 md:space-y-8 pb-16 font-body text-navy antialiased">
    <!-- Standard Dashboard Header -->
    <DashboardHeader
      :title="eventName || t('earnings.detail_title')"
      :subtitle="t('earnings.detail_subtitle')"
      icon="ph:receipt-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('earnings.title'), to: '/dashboard/organizer/earnings' },
        { label: eventName || t('earnings.detail_title') }
      ]"
    >
      <template #actions>
        <div class="flex items-center gap-2.5">
          <BaseButton
            variant="outline"
            icon="ph:arrow-left-bold"
            @click="router.push('/dashboard/organizer/earnings')"
            class="h-10 px-3.5 text-xs font-bold"
          >
            {{ t('common.back') }}
          </BaseButton>
          <BaseButton
            variant="white"
            icon="ph:download-simple-bold"
            @click="handleExportPayments"
            :disabled="loading || payments.length === 0"
            class="h-10 px-4 text-xs font-bold shadow-2xs"
          >
            {{ t('earnings.export_button') }}
          </BaseButton>
        </div>
      </template>
    </DashboardHeader>

    <!-- KPI Stats Summary Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        :title="t('earnings.total_event', 'Total Event Revenue')"
        :value="'Rp ' + (totalAmount || 0).toLocaleString('id-ID')"
        icon="ph:wallet-bold"
        color="primary"
        :description="t('earnings.payments_title', 'Participant Transactions')"
        description-icon="ph:coins-bold"
      />
      <StatCard
        :title="t('earnings.payments_title', 'Participant Transactions')"
        :value="payments.length"
        icon="ph:receipt-bold"
        color="primary"
        :description="t('earnings.successful_transactions', 'Total successful transactions')"
        description-icon="ph:check-circle-bold"
      />
      <StatCard
        :title="t('earnings.table_participant', 'Participant / Archer')"
        :value="uniqueArchersCount"
        icon="ph:users-three-bold"
        color="primary"
        :description="t('earnings.unique_archers', 'Registered unique archers')"
        description-icon="ph:user-bold"
      />
      <StatCard
        :title="t('earnings.avg_transaction', 'Average Transaction')"
        :value="'Rp ' + (payments.length ? Math.round(totalAmount / payments.length) : 0).toLocaleString('id-ID')"
        icon="ph:chart-line-up-bold"
        color="primary"
        :description="t('earnings.avg_transaction_desc', 'Average amount per transaction')"
        description-icon="ph:trend-up-bold"
      />
    </div>

    <!-- Unified DashboardDataTable -->
    <DashboardDataTable
      :items="payments"
      :columns="tableColumns"
      :loading="loading"
      :searchable="true"
      :search-placeholder="t('earnings.search_placeholder', 'Search participant, email, method or reference...')"
      count-icon="ph:receipt-bold"
      :count-unit="t('earnings.transactions_unit', 'Transactions')"
      :show-reset-button="true"
      :empty-title="t('earnings.no_data', 'No payment transactions match your search filter.')"
      empty-icon="ph:receipt-x-bold"
      :items-per-page="10"
    >
      <!-- Participant Column Slot -->
      <template #item-participant="{ item }">
        <div class="flex items-center gap-2.5 py-1">
          <div class="size-9 rounded-xl bg-slate-100 border border-slate-200/80 text-navy font-black flex items-center justify-center text-xs shrink-0 shadow-2xs">
            {{ (item.archerName || '?').charAt(0).toUpperCase() }}
          </div>
          <div class="min-w-0">
            <div class="font-bold text-navy text-xs sm:text-sm leading-snug truncate hover:text-primary transition-colors">
              {{ item.archerName || '-' }}
            </div>
            <div class="text-[11px] text-slate-400 font-medium truncate mt-0.5">
              {{ item.archerEmail || '-' }}
            </div>
          </div>
        </div>
      </template>

      <!-- Reference / Invoice Column Slot -->
      <template #item-reference="{ item }">
        <div class="space-y-0.5 whitespace-nowrap">
          <span class="font-mono text-xs font-bold text-navy tracking-tight">
            {{ item.reference || '-' }}
          </span>
        </div>
      </template>

      <!-- Date Column Slot -->
      <template #item-createdAt="{ item }">
        <div class="text-xs text-slate-600 font-medium flex items-center gap-1.5 whitespace-nowrap">
          <Icon icon="ph:calendar-blank-bold" class="text-xs text-slate-400 shrink-0" />
          <span>{{ formatPaymentDate(item.createdAt) }}</span>
        </div>
      </template>

      <!-- Method Column Slot -->
      <template #item-method="{ item }">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 capitalize whitespace-nowrap">
          <Icon :icon="getPaymentMethodIcon(item.method)" class="text-xs text-slate-500 shrink-0" />
          <span>{{ item.method || '-' }}</span>
        </div>
      </template>

      <!-- Amount Column Slot -->
      <template #item-amount="{ item }">
        <div class="font-black text-navy tabular-nums text-xs sm:text-sm text-right whitespace-nowrap">
          Rp {{ (item.amount || 0).toLocaleString('id-ID') }}
        </div>
      </template>
    </DashboardDataTable>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { exportToExcel } from '~/utils/exportExcel'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const route = useRoute()
const router = useRouter()
const api = useApi()
const { t } = useI18n()
const toast = useToast()

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const eventId = route.params.id
const eventName = ref('')
const payments = ref([])
const loading = ref(true)

useHead(() => ({
  title: (eventName.value ? `${eventName.value} - ` : '') + t('earnings.event_detail') + ' - Archeris Dashboard'
}))

const tableColumns = computed(() => [
  { key: 'participant', label: t('earnings.table_participant', 'Peserta'), sortable: true, sortKey: 'archerName', class: 'min-w-[220px]' },
  { key: 'reference', label: t('earnings.table_reference', 'No. Invoice / Referensi'), sortable: true, sortKey: 'reference', class: 'min-w-[180px]' },
  { key: 'createdAt', label: t('earnings.table_date', 'Tanggal'), sortable: true, sortKey: 'createdAt', class: 'min-w-[170px]' },
  { key: 'method', label: t('earnings.table_method', 'Metode'), sortable: true, sortKey: 'method', class: 'min-w-[140px]' },
  { key: 'amount', label: t('earnings.table_amount', 'Nominal'), align: 'right', sortable: true, sortKey: 'amount', class: 'min-w-[130px]' }
])

const fetchDetails = async () => {
  try {
    loading.value = true
    const res = await api.get(`/organizers/earnings/${eventId}`)
    eventName.value = res.eventName || ''
    payments.value = res.payments || []
  } catch (error) {
    console.error('Failed to fetch details:', error)
  } finally {
    loading.value = false
  }
}

const totalAmount = computed(() => {
  return payments.value.reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const uniqueArchersCount = computed(() => {
  return new Set(payments.value.map(p => p.archerEmail || p.archerName).filter(Boolean)).size
})

const formatPaymentDate = (date) => {
  if (!date) return '-'
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return String(date)
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) + ' WIB'
  } catch {
    return String(date)
  }
}

const getPaymentMethodIcon = (method) => {
  const m = (method || '').toLowerCase()
  if (m === 'free' || m === 'free_registration') return 'ph:check-circle-bold'
  if (m === 'manual' || m.includes('bank') || m.includes('transfer')) return 'ph:bank-bold'
  if (m === 'paypal') return 'logos:paypal'
  if (m === 'mayar' || m === 'qris') return 'ph:qr-code-bold'
  return 'ph:credit-card-bold'
}

const handleExportPayments = () => {
  const list = payments.value
  if (!list || list.length === 0) {
    toast.info(t('earnings.no_data_export', 'Tidak ada data untuk diexport'))
    return
  }

  const exportData = list.map((item, index) => ({
    no: index + 1,
    participant: item.archerName,
    email: item.archerEmail,
    date: formatPaymentDate(item.createdAt),
    method: item.method,
    reference: item.reference,
    amount: item.amount
  }))

  exportToExcel(
    `${t('earnings.export_file_prefix', 'Pembayaran')}_${eventName.value || 'Event'}`,
    [
      { key: 'no', label: 'No' },
      { key: 'participant', label: t('earnings.table_participant', 'Peserta') },
      { key: 'email', label: 'Email' },
      { key: 'date', label: t('earnings.table_date', 'Tanggal Pembayaran') },
      { key: 'method', label: t('earnings.table_method', 'Metode Pembayaran') },
      { key: 'reference', label: t('earnings.table_reference', 'Nomor Referensi') },
      { key: 'amount', label: t('earnings.table_amount', 'Nominal (Rp)') }
    ],
    exportData
  )
}

onMounted(fetchDetails)
</script>
