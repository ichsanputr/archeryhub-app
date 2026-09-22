<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useApiBaseUrl } from '~/composables/useApiBaseUrl'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import PaymentFilterModal from '~/components/dashboard/PaymentFilterModal.vue'

definePageMeta({
  layout: 'dashboard'
})

const { t, locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')
const { get } = useApi()
const apiBaseUrl = useApiBaseUrl()

useHead({
  title: computed(() => `${t('payments.title')} - Archeris Dashboard`)
})

// State
const isLoading = ref(true)
const rawPayments = ref([])
const searchQuery = ref('')
const statusFilter = ref('all')
const methodFilter = ref('all')
const sortBy = ref('date')
const sortOrder = ref('desc')
const copiedRef = ref('')
const showFilterModal = ref(false)

const currentFilterState = computed(() => {
  let sortVal = 'date_desc'
  if (sortBy.value === 'date' && sortOrder.value === 'asc') sortVal = 'date_asc'
  else if (sortBy.value === 'amount' && sortOrder.value === 'desc') sortVal = 'amount_desc'
  else if (sortBy.value === 'amount' && sortOrder.value === 'asc') sortVal = 'amount_asc'

  return {
    status: statusFilter.value,
    method: methodFilter.value,
    sort: sortVal
  }
})

const handleApplyModalFilters = (filters) => {
  statusFilter.value = filters.status || 'all'
  methodFilter.value = filters.method || 'all'
  if (filters.sort === 'date_desc') {
    sortBy.value = 'date'
    sortOrder.value = 'desc'
  } else if (filters.sort === 'date_asc') {
    sortBy.value = 'date'
    sortOrder.value = 'asc'
  } else if (filters.sort === 'amount_desc') {
    sortBy.value = 'amount'
    sortOrder.value = 'desc'
  } else if (filters.sort === 'amount_asc') {
    sortBy.value = 'amount'
    sortOrder.value = 'asc'
  }
}

// Fetch payments data from API
const fetchPayments = async () => {
  isLoading.value = true
  try {
    const res = await get('/payment/my?limit=100&offset=0')
    if (res && res.payments) {
      rawPayments.value = res.payments
    } else if (Array.isArray(res)) {
      rawPayments.value = res
    } else {
      rawPayments.value = []
    }
  } catch (err) {
    console.error('Failed to fetch user payments:', err)
    rawPayments.value = []
  } finally {
    isLoading.value = false
  }
}

// Global Stats Summary Cards
const stats = computed(() => {
  const all = rawPayments.value
  const paid = all.filter(p => isPaid(p.status))
  const pending = all.filter(p => isActionRequired(p) || p.status === 'awaiting_verification')
  const totalPaidAmount = paid.reduce((acc, p) => acc + Number(p.total_amount || p.amount || 0), 0)

  return {
    totalCount: all.length,
    paidCount: paid.length,
    pendingCount: pending.length,
    totalPaidAmount
  }
})

// Filter & Sort Logic
const filteredPayments = computed(() => {
  let list = [...rawPayments.value]

  // Status Filter
  if (statusFilter.value !== 'all') {
    if (statusFilter.value === 'paid') {
      list = list.filter(p => isPaid(p.status))
    } else if (statusFilter.value === 'awaiting_verification') {
      list = list.filter(p => p.status === 'awaiting_verification' || (p.payment_method === 'manual' && !!p.proof_url && !isPaid(p.status)))
    } else if (statusFilter.value === 'pending') {
      list = list.filter(p => ['pending', 'unpaid'].includes((p.status || '').toLowerCase()) && !p.proof_url)
    } else if (statusFilter.value === 'failed') {
      list = list.filter(p => ['failed', 'expired', 'cancelled'].includes((p.status || '').toLowerCase()))
    }
  }

  // Method Filter
  if (methodFilter.value !== 'all') {
    if (methodFilter.value === 'free') {
      list = list.filter(p => (p.payment_method || '').toLowerCase() === 'free' || (p.payment_method || '').toLowerCase() === 'free_registration')
    } else if (methodFilter.value === 'manual') {
      list = list.filter(p => (p.payment_method || '').toLowerCase() === 'manual')
    } else if (methodFilter.value === 'mayar') {
      list = list.filter(p => ['mayar', 'qris', 'va'].includes((p.payment_method || '').toLowerCase()))
    } else if (methodFilter.value === 'paypal') {
      list = list.filter(p => (p.payment_method || '').toLowerCase() === 'paypal')
    }
  }

  return list
})

// Active Filter Chips
const activeFilterChips = computed(() => {
  const chips = []
  if (statusFilter.value !== 'all') {
    let label = ''
    if (statusFilter.value === 'paid') label = `${t('common.status')}: ${t('archer_payments_list.opt_paid')}`
    else if (statusFilter.value === 'awaiting_verification') label = `${t('common.status')}: ${t('archer_payments_list.opt_awaiting')}`
    else if (statusFilter.value === 'pending') label = `${t('common.status')}: ${t('archer_payments_list.opt_pending')}`
    else if (statusFilter.value === 'failed') label = `${t('common.status')}: ${t('archer_payments_list.opt_failed')}`
    chips.push({ key: 'status', label })
  }

  if (methodFilter.value !== 'all') {
    let label = ''
    if (methodFilter.value === 'free') label = `${t('common.method')}: Gratis`
    else if (methodFilter.value === 'manual') label = `${t('common.method')}: ${t('archer_payments_list.method_manual')}`
    else if (methodFilter.value === 'mayar') label = `${t('common.method')}: ${t('archer_payments_list.method_online')}`
    else if (methodFilter.value === 'paypal') label = `${t('common.method')}: PayPal`
    chips.push({ key: 'method', label })
  }

  return chips
})

const activeFilterCount = computed(() => activeFilterChips.value.length)
const hasActiveFilters = computed(() => activeFilterChips.value.length > 0)

const removeFilterChip = (key) => {
  if (key === 'status') statusFilter.value = 'all'
  if (key === 'method') methodFilter.value = 'all'
}

const resetAllFilters = () => {
  statusFilter.value = 'all'
  methodFilter.value = 'all'
  searchQuery.value = ''
  sortBy.value = 'date'
  sortOrder.value = 'desc'
}

// Helpers
const isPaid = (status) => {
  const s = (status || '').toLowerCase()
  return ['paid', 'success', 'settlement', 'capture', 'verified', 'completed'].includes(s)
}

const isActionRequired = (item) => {
  if (!item) return false
  if (isPaid(item.status)) return false
  const s = (item.status || '').toLowerCase()
  if (s === 'awaiting_verification') return false
  if (item.payment_method === 'manual' && item.proof_url) return false
  return ['pending', 'unpaid'].includes(s)
}

const getStatusBadgeClass = (status, item) => {
  if (isPaid(status)) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  const s = (status || '').toLowerCase()
  if (s === 'awaiting_verification' || (item?.payment_method === 'manual' && !!item?.proof_url)) {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  if (['pending', 'unpaid'].includes(s)) return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

const getStatusDotClass = (status, item) => {
  if (isPaid(status)) return 'bg-emerald-500'
  const s = (status || '').toLowerCase()
  if (s === 'awaiting_verification' || (item?.payment_method === 'manual' && !!item?.proof_url)) {
    return 'bg-amber-500 animate-pulse'
  }
  if (['pending', 'unpaid'].includes(s)) return 'bg-blue-500'
  return 'bg-rose-500'
}

const getStatusLabel = (status, item) => {
  if (isPaid(status)) return t('payment_status.badge_paid')
  const s = (status || '').toLowerCase()
  if (s === 'awaiting_verification' || (item?.payment_method === 'manual' && !!item?.proof_url)) {
    return t('payment_status.badge_awaiting_verification')
  }
  if (['pending', 'unpaid'].includes(s)) {
    return t('payment_status.badge_pending')
  }
  if (s === 'refunded') return t('payment_status.badge_refunded')
  return t('payment_status.badge_failed')
}

const formatPaymentMethodName = (method, channel) => {
  if (!method) return '-'
  const m = String(method).toLowerCase()
  if (m === 'free' || m === 'free_registration') return 'Pendaftaran Gratis'
  if (m === 'manual') return t('archer_payments_list.method_manual')
  if (m === 'mayar' || m === 'qris') {
    if (channel) {
      const ch = String(channel).toUpperCase()
      if (ch === 'QRIS') return 'QRIS'
      if (ch.includes('VA') || ch.includes('VIRTUAL_ACCOUNT')) return ch.replace('_', ' ')
      return `Mayar (${ch})`
    }
    return t('archer_payments_list.method_mayar')
  }
  if (m === 'paypal') return 'PayPal'
  return method.toUpperCase()
}

const getPaymentMethodIcon = (method) => {
  const m = (method || '').toLowerCase()
  if (m === 'free' || m === 'free_registration') return 'ph:check-circle-bold'
  if (m === 'manual') return 'ph:bank-bold'
  if (m === 'paypal') return 'logos:paypal'
  if (m === 'mayar' || m === 'qris') return 'ph:qr-code-bold'
  return 'ph:credit-card-bold'
}

const formatCurrency = (val) => {
  const num = Number(val)
  if (isNaN(num)) return 'Rp 0'
  return `Rp ${new Intl.NumberFormat('id-ID').format(num)}`
}

const formatDateTime = (val) => {
  if (!val) return '-'
  return new Date(val).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) + ' WIB'
}

const copyReference = (ref) => {
  if (!ref) return
  navigator.clipboard.writeText(ref)
  copiedRef.value = ref
  setTimeout(() => {
    copiedRef.value = ''
  }, 2000)
}

const tableColumns = computed(() => [
  { key: 'invoice', label: t('archer_payments_list.col_invoice'), sortable: true, sortKey: 'created_at', class: 'min-w-[190px]' },
  { key: 'tournament', label: t('archer_payments_list.col_tournament'), sortable: true, sortKey: 'event_name', class: 'min-w-[260px]' },
  { key: 'method', label: t('archer_payments_list.col_method'), sortable: true, sortKey: 'payment_method', class: 'min-w-[170px]' },
  { key: 'amount', label: t('archer_payments_list.col_amount'), sortable: true, sortKey: 'total_amount', align: 'right', class: 'min-w-[130px]' },
  { key: 'status', label: t('archer_payments_list.col_status'), sortable: false, align: 'center', class: 'min-w-[150px]' }
])

onMounted(() => {
  fetchPayments()
})
</script>

<template>
  <div class="space-y-6 pb-16 font-body text-navy antialiased">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('archer_payments_list.title')"
      :subtitle="t('archer_payments_list.subtitle')"
      icon="ph:receipt-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: t('payments.title') }
      ]"
    >
      <template #actions>
        <div class="flex items-center gap-2.5">
          <BaseButton
            to="/tournaments"
            variant="navy"
            size="sm"
            class="h-10 px-4 text-xs font-bold gap-2"
          >
            <Icon icon="ph:trophy-bold" class="text-sm" />
            <span class="hidden sm:inline">{{ t('archer_payments_list.explore_tournaments') }}</span>
          </BaseButton>
        </div>
      </template>
    </DashboardHeader>

    <!-- Quick Stats Cards Row -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        :title="t('archer_payments_list.total_transactions')"
        :value="stats.totalCount"
        icon="ph:receipt-bold"
        color="primary"
        :description="t('archer_payments_list.all_records')"
        description-icon="ph:list-bullets-bold"
      />
      <StatCard
        :title="t('archer_payments_list.total_spent')"
        :value="formatCurrency(stats.totalPaidAmount)"
        icon="ph:wallet-bold"
        color="primary"
        :description="t('archer_payments_list.paid_total_desc')"
        description-icon="ph:check-circle-bold"
      />
      <StatCard
        :title="t('archer_payments_list.status_paid')"
        :value="stats.paidCount"
        icon="ph:seal-check-bold"
        color="primary"
        :description="t('archer_payments_list.verified_count')"
        description-icon="ph:check-bold"
      />
      <StatCard
        :title="t('archer_payments_list.status_pending')"
        :value="stats.pendingCount"
        icon="ph:hourglass-medium-bold"
        color="primary"
        :description="t('archer_payments_list.pending_review_desc')"
        description-icon="ph:clock-bold"
      />
    </div>

    <!-- Filter Modal Dialog -->
    <PaymentFilterModal
      v-model:show="showFilterModal"
      :current-filters="currentFilterState"
      @apply="handleApplyModalFilters"
      @reset="resetAllFilters"
    />

    <!-- Unified DashboardDataTable (Category A: Modal Filter) -->
    <DashboardDataTable
      :items="filteredPayments"
      :columns="tableColumns"
      :loading="isLoading"
      :searchable="true"
      :search-placeholder="t('archer_payments_list.search_placeholder')"
      :has-filter-modal="true"
      :active-filter-count="activeFilterCount"
      :active-filter-chips="activeFilterChips"
      :show-reset-button="true"
      :actions-header-label="t('archer_payments_list.col_actions')"
      count-icon="ph:receipt-bold"
      :count-unit="t('archer_payments_list.transactions_unit')"
      :empty-title="hasActiveFilters ? t('archer_payments_list.no_matched_transactions') : t('archer_payments_list.no_transactions')"
      :empty-description="hasActiveFilters ? t('archer_payments_list.no_matched_transactions_desc') : t('payments.empty_desc')"
      empty-icon="ph:receipt-x-bold"
      @open-filter="showFilterModal = true"
      @remove-chip="removeFilterChip"
      @reset-filters="resetAllFilters"
    >
      <!-- Invoice Column Slot -->
      <template #item-invoice="{ item }">
        <div class="space-y-1 py-0.5">
          <div class="flex items-center gap-1.5 whitespace-nowrap">
            <span class="font-mono text-xs font-bold text-navy hover:text-primary transition-colors tracking-tight">
              {{ item.reference }}
            </span>
            <button
              type="button"
              @click="copyReference(item.reference)"
              class="text-slate-400 hover:text-navy p-0.5 transition-colors rounded hover:bg-slate-100 cursor-pointer"
              :title="isEn ? 'Copy Reference' : 'Salin Nomor Referensi'"
            >
              <Icon
                :icon="copiedRef === item.reference ? 'ph:check-bold' : 'ph:copy-simple-bold'"
                class="text-xs"
                :class="copiedRef === item.reference ? 'text-emerald-600' : ''"
              />
            </button>
          </div>
          <div class="text-[11px] text-slate-400 font-medium flex items-center gap-1 whitespace-nowrap">
            <Icon icon="ph:calendar-blank-bold" class="text-[10px] text-slate-400 shrink-0" />
            <span>{{ formatDateTime(item.created_at) }}</span>
          </div>
        </div>
      </template>

      <!-- Tournament Column Slot -->
      <template #item-tournament="{ item }">
        <div class="py-1 max-w-[340px]">
          <div class="font-bold text-xs sm:text-sm text-navy leading-snug line-clamp-2" :title="item.event_name || item.plan_name || item.description">
            {{ item.event_name || item.plan_name || item.description || t('payments.payment_title_default') }}
          </div>
        </div>
      </template>

      <!-- Payment Method Column Slot -->
      <template #item-method="{ item }">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 whitespace-nowrap">
          <Icon :icon="getPaymentMethodIcon(item.payment_method)" class="text-xs shrink-0 text-slate-500" />
          <span>{{ formatPaymentMethodName(item.payment_method, item.payment_channel) }}</span>
        </div>
      </template>

      <!-- Amount Column Slot -->
      <template #item-amount="{ item }">
        <div class="text-xs sm:text-sm font-black text-navy tabular-nums text-right whitespace-nowrap">
          {{ formatCurrency(item.total_amount || item.amount) }}
        </div>
      </template>

      <!-- Status Column Slot -->
      <template #item-status="{ item }">
        <div class="flex justify-center">
          <div
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border shadow-2xs whitespace-nowrap"
            :class="getStatusBadgeClass(item.status, item)"
          >
            <span class="size-1.5 rounded-full shrink-0" :class="getStatusDotClass(item.status, item)"></span>
            <span>{{ getStatusLabel(item.status, item) }}</span>
          </div>
        </div>
      </template>

      <!-- Actions Column Slot -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end gap-1.5 whitespace-nowrap">
          <NuxtLink
            :to="`/dashboard/archer/payments/${item.reference}`"
            class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-navy font-bold text-xs transition-colors shadow-2xs"
          >
            {{ t('common.detail') }}
          </NuxtLink>
          <a
            v-if="isActionRequired(item) && item.checkout_url"
            :href="item.checkout_url"
            target="_blank"
            rel="noopener noreferrer"
            class="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-navy font-black text-xs transition-colors shadow-2xs inline-flex items-center gap-1 cursor-pointer"
          >
            <Icon icon="ph:credit-card-bold" class="text-xs" />
            <span>{{ t('archer_payments_list.pay_btn') }}</span>
          </a>
          <NuxtLink
            v-else-if="isActionRequired(item)"
            :to="`/dashboard/archer/payments/${item.reference}`"
            class="px-2.5 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-navy font-black text-xs transition-colors shadow-2xs inline-flex items-center gap-1"
          >
            <span>{{ item.payment_method === 'manual' && !item.proof_url ? t('archer_payments_list.upload_proof_btn') : t('archer_payments_list.pay_btn') }}</span>
          </NuxtLink>
        </div>
      </template>

      <!-- Empty Custom Action -->
      <template #empty>
        <div class="p-12 text-center space-y-4">
          <div class="size-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto border border-slate-100">
            <Icon icon="ph:receipt-x-bold" class="text-3xl text-slate-400" />
          </div>
          <div class="space-y-1">
            <h3 class="text-base font-bold text-navy">
              {{ hasActiveFilters ? t('archer_payments_list.no_matched_transactions') : t('archer_payments_list.no_transactions') }}
            </h3>
            <div class="text-xs text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
              {{ hasActiveFilters ? t('archer_payments_list.no_matched_transactions_desc') : t('payments.empty_desc') }}
            </div>
          </div>
          <div v-if="hasActiveFilters">
            <BaseButton variant="outline" size="sm" class="text-xs font-bold" @click="resetAllFilters">
              {{ t('common.reset_filters') }}
            </BaseButton>
          </div>
          <div v-else>
            <BaseButton to="/tournaments" variant="navy" size="sm" class="text-xs font-bold gap-2">
              <Icon icon="ph:trophy-bold" class="text-sm" />
              <span>{{ t('archer_payments_list.explore_tournaments') }}</span>
            </BaseButton>
          </div>
        </div>
      </template>
    </DashboardDataTable>
  </div>
</template>
