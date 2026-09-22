<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('org_event_payments.title')"
      :subtitle="t('org_event_payments.subtitle')"
      icon="ph:credit-card-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
        { label: t('org_event_payments.title') }
      ]"
    />

    <!-- Quick Stats Cards Row (Uniform Primary Color) -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        :title="t('org_event_payments.stat_revenue')"
        :value="'Rp ' + totalRevenue.toLocaleString('id-ID')"
        icon="ph:wallet-bold"
        color="primary"
        :description="`${paidCount} ${t('org_event_payments.stat_paid_count')}`"
        description-icon="ph:check-circle-bold"
      />
      <StatCard
        :title="t('org_event_payments.stat_awaiting')"
        :value="awaitingCount"
        icon="ph:hourglass-bold"
        color="primary"
        :description="t('org_event_payments.stat_awaiting_sub')"
        description-icon="ph:clock-bold"
      />
      <StatCard
        :title="t('org_event_payments.stat_pending')"
        :value="pendingCount"
        icon="ph:clock-countdown-bold"
        color="primary"
        :description="t('org_event_payments.stat_pending_sub')"
        description-icon="ph:hourglass-medium-bold"
      />
      <StatCard
        :title="t('org_event_payments.stat_rejected')"
        :value="rejectedCount + cancelledCount"
        icon="ph:x-circle-bold"
        color="primary"
        :description="`${rejectedCount} ${t('org_event_payments.status_rejected').toLowerCase()}, ${cancelledCount} ${t('org_event_payments.status_cancelled').toLowerCase()}`"
        description-icon="ph:prohibit-bold"
      />
    </div>

    <!-- Payment Filter Modal Dialog -->
    <PaymentFilterModal
      v-model:show="showFilterModal"
      :current-filters="currentFilterState"
      @apply="handleApplyModalFilters"
      @reset="resetAllFilters"
    />

    <!-- Unified DashboardDataTable (Category A: Modal Filter & Search) -->
    <DashboardDataTable
      :items="filteredInvoices"
      :columns="tableColumns"
      :loading="isLoading"
      :searchable="true"
      :search-placeholder="t('org_event_payments.search_placeholder')"
      :has-filter-modal="true"
      :filter-button-label="t('common.filter')"
      :active-filter-count="activeFilterCount"
      :active-filter-chips="activeFilterChips"
      :show-reset-button="hasActiveFilters"
      count-icon="ph:receipt-bold"
      :count-unit="t('archer_payments_list.transactions_unit')"
      :show-count-badge="true"
      :empty-title="t('org_event_payments.empty_title')"
      :empty-description="t('org_event_payments.empty_desc')"
      empty-icon="ph:receipt-x-bold"
      @search="handleTableSearch"
      @sort="handleTableSort"
      @open-filter="showFilterModal = true"
      @reset-filters="resetAllFilters"
      @remove-chip="removeFilterChip"
    >
      <!-- Invoice Column Slot -->
      <template #item-invoice="{ item }">
        <div class="space-y-1 py-1">
          <div class="flex items-center gap-1.5 whitespace-nowrap">
            <NuxtLink
              :to="`/dashboard/organizer/tournaments/${eventId}/payments/${item.reference}`"
              class="font-mono text-xs font-black text-navy dark:text-white hover:text-primary transition-colors tracking-tight"
            >
              {{ item.reference }}
            </NuxtLink>
            <button
              type="button"
              @click="copyReference(item.reference)"
              class="text-slate-400 hover:text-navy dark:hover:text-white p-0.5 transition-colors rounded hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
              title="Salin Referensi"
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
            <span>{{ formatDate(item.created_at) }}</span>
          </div>
        </div>
      </template>

      <!-- Payer Column Slot -->
      <template #item-payer="{ item }">
        <div class="py-1 min-w-[160px] max-w-[260px]">
          <div class="font-bold text-xs sm:text-sm text-navy dark:text-white truncate" :title="item.payer_name">
            {{ item.payer_name || t('org_event_payments.no_name') }}
          </div>
          <div v-if="item.payer_email" class="text-xs text-slate-400 truncate mt-0.5" :title="item.payer_email">
            {{ item.payer_email }}
          </div>
          <div v-if="item.status === 'rejected' && item.rejection_reason" class="mt-1 text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded border border-rose-100 dark:border-rose-900 line-clamp-1" :title="item.rejection_reason">
            <strong>{{ t('org_event_payments.rejection_reason') }}</strong> {{ item.rejection_reason }}
          </div>
        </div>
      </template>

      <!-- Participants / Roster Column Slot -->
      <template #item-participants="{ item }">
        <div class="py-1 min-w-[140px]">
          <div class="flex items-center gap-1.5">
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy/5 text-navy dark:bg-slate-700 dark:text-white border border-navy/10 dark:border-slate-600">
              <Icon icon="ph:users-three-bold" class="size-3.5 text-primary" />
              <span>{{ item.participant_count || (item.participants ? item.participants.length : 1) }} {{ t('org_event_payments.athletes_registered') }}</span>
            </span>
          </div>
          <div v-if="item.participants && item.participants.length > 0" class="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[180px]" :title="item.participants.map((p: any) => p.archer_name).join(', ')">
            {{ item.participants.map((p: any) => p.archer_name).slice(0, 2).join(', ') }}
            <span v-if="item.participants.length > 2" class="text-slate-400 font-bold">+{{ item.participants.length - 2 }}</span>
          </div>
        </div>
      </template>

      <!-- Payment Method Column Slot -->
      <template #item-method="{ item }">
        <div class="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
          <Icon :icon="getMethodIcon(item.payment_method)" class="text-base shrink-0 text-slate-400" />
          <span>{{ formatPaymentMethodName(item.payment_method) }}</span>
        </div>
      </template>

      <!-- Nominal Amount Column Slot -->
      <template #item-amount="{ item }">
        <div class="text-xs sm:text-sm font-black text-navy dark:text-white tabular-nums text-right whitespace-nowrap">
          Rp {{ (item.total_amount || item.amount || 0).toLocaleString('id-ID') }}
        </div>
      </template>

      <!-- Status Column Slot -->
      <template #item-status="{ item }">
        <div class="flex justify-center">
          <div
            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border shadow-2xs whitespace-nowrap"
            :class="getStatusBadgeClass(item.status)"
          >
            <span class="size-1.5 rounded-full shrink-0" :class="getStatusDotClass(item.status)"></span>
            <span>{{ getStatusLabel(item.status) }}</span>
          </div>
        </div>
      </template>

      <!-- Actions Column Slot (Detail button only) -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end whitespace-nowrap">
          <NuxtLink
            :to="`/dashboard/organizer/tournaments/${eventId}/payments/${item.reference}`"
            class="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-navy dark:text-white font-bold text-xs transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Icon icon="ph:eye-bold" class="size-3.5 text-primary" />
            <span>{{ t('common.detail') || 'Detail' }}</span>
          </NuxtLink>
        </div>
      </template>
    </DashboardDataTable>

    <!-- Proof Lightbox Modal -->
    <div
      v-if="lightboxOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="lightboxOpen = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
        <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h4 class="font-black text-sm text-navy dark:text-white">{{ t('org_event_payments.proof_modal_title') }}</h4>
            <div class="text-xs text-slate-400">{{ activeProofInvoice?.reference }} &bull; {{ activeProofInvoice?.payer_name }}</div>
          </div>
          <button
            @click="lightboxOpen = false"
            class="size-8 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <Icon icon="ph:x-bold" class="size-4" />
          </button>
        </div>

        <div class="p-4 flex items-center justify-center bg-slate-900/5 dark:bg-slate-950/40 max-h-[70vh] overflow-auto">
          <img
            :src="activeProofInvoice?.proof_url"
            :alt="t('org_event_payments.proof_alt')"
            class="max-w-full max-h-[65vh] object-contain rounded-xl shadow-md"
          />
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
          <div class="text-slate-500 dark:text-slate-400">
            {{ t('org_event_payments.proof_sender') }} <strong>{{ activeProofInvoice?.sender_name || t('org_event_payments.not_provided') }}</strong>
          </div>
          <a
            :href="activeProofInvoice?.proof_url"
            target="_blank"
            class="text-primary hover:underline font-bold flex items-center gap-1"
          >
            <span>{{ t('org_event_payments.open_original') }}</span>
            <Icon icon="ph:arrow-square-out-bold" class="size-3.5" />
          </a>
        </div>
      </div>
    </div>

    <!-- Reject Reason Modal -->
    <div
      v-if="rejectModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="rejectModalOpen = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="size-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-black">
            <Icon icon="ph:warning-circle-bold" class="size-5" />
          </div>
          <div>
            <h4 class="font-black text-navy dark:text-white text-base">{{ t('org_event_payments.reject_modal_title') }}</h4>
            <div class="text-xs text-slate-400">{{ activeRejectInvoice?.reference }}</div>
          </div>
        </div>

        <div class="text-xs text-slate-600 dark:text-slate-300 mb-3">
          {{ t('org_event_payments.reject_modal_desc') }}
        </div>

        <textarea
          v-model="rejectReason"
          rows="3"
          :placeholder="t('org_event_payments.reject_placeholder')"
          class="w-full p-3 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-navy dark:text-white placeholder:text-slate-400 mb-4"
        ></textarea>

        <div class="flex justify-end gap-2">
          <button
            @click="rejectModalOpen = false"
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {{ t('org_event_payments.cancel') }}
          </button>
          <button
            @click="confirmReject"
            :disabled="!rejectReason.trim() || isProcessing"
            class="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Icon v-if="isProcessing" icon="ph:spinner-bold" class="size-3.5 animate-spin" />
            <span>{{ t('org_event_payments.reject_confirm') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import useDashboardI18n from '~/composables/useDashboardI18n'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import StatCard from '~/components/common/StatCard.vue'
import PaymentFilterModal from '~/components/dashboard/PaymentFilterModal.vue'

const { t } = useDashboardI18n()
const route = useRoute()
const { get, post } = useApi()
const toast = useToast()

const eventId = computed(() => route.params.id as string)

useHead({
  title: computed(() => t('org_event_payments.head_title'))
})

const isLoading = ref(true)
const isProcessing = ref(false)
const invoices = ref<any[]>([])
const search = ref('')
const copiedRef = ref('')

// Sorting state
const sortBy = ref('created_at')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Filter state
const showFilterModal = ref(false)
const currentFilters = ref({
  status: 'all',
  method: 'all',
  date_range: 'all'
})

const currentFilterState = computed(() => ({
  status: currentFilters.value.status,
  method: currentFilters.value.method,
  date_range: currentFilters.value.date_range
}))

// Modals state
const lightboxOpen = ref(false)
const activeProofInvoice = ref<any>(null)
const rejectModalOpen = ref(false)
const activeRejectInvoice = ref<any>(null)
const rejectReason = ref('')

const tableColumns = computed(() => [
  { key: 'invoice', label: t('org_event_payments.col_invoice'), sortable: true },
  { key: 'payer', label: t('org_event_payments.col_payer'), sortable: true },
  { key: 'participants', label: t('org_event_payments.col_athletes'), sortable: false },
  { key: 'method', label: t('org_event_payments.col_method'), sortable: true },
  { key: 'amount', label: t('org_event_payments.col_amount'), sortable: true },
  { key: 'status', label: t('org_event_payments.col_status'), sortable: true, headerClass: 'text-center' }
])

const totalRevenue = computed(() =>
  invoices.value
    .filter(inv => ['paid', 'settlement', 'lunas', 'success', 'completed'].includes((inv.status || '').toLowerCase()))
    .reduce((sum, inv) => sum + (inv.total_amount || inv.amount || 0), 0)
)

const paidCount = computed(() =>
  invoices.value.filter(inv => ['paid', 'settlement', 'lunas', 'success', 'completed'].includes((inv.status || '').toLowerCase())).length
)

const awaitingCount = computed(() =>
  invoices.value.filter(inv => (inv.status || '').toLowerCase() === 'awaiting_verification').length
)

const pendingCount = computed(() =>
  invoices.value.filter(inv => (inv.status || '').toLowerCase() === 'pending' || (inv.status || '').toLowerCase() === 'unpaid').length
)

const rejectedCount = computed(() =>
  invoices.value.filter(inv => (inv.status || '').toLowerCase() === 'rejected').length
)

const cancelledCount = computed(() =>
  invoices.value.filter(inv => (inv.status || '').toLowerCase() === 'cancelled').length
)

const hasActiveFilters = computed(() => {
  return currentFilters.value.status !== 'all' ||
    currentFilters.value.method !== 'all' ||
    currentFilters.value.date_range !== 'all' ||
    !!search.value.trim()
})

const activeFilterCount = computed(() => {
  let count = 0
  if (currentFilters.value.status !== 'all') count++
  if (currentFilters.value.method !== 'all') count++
  if (currentFilters.value.date_range !== 'all') count++
  return count
})

const activeFilterChips = computed(() => {
  const chips: { key: string; label: string }[] = []
  if (currentFilters.value.status !== 'all') {
    chips.push({ key: 'status', label: `Status: ${getStatusLabel(currentFilters.value.status)}` })
  }
  if (currentFilters.value.method !== 'all') {
    chips.push({ key: 'method', label: `Metode: ${formatPaymentMethodName(currentFilters.value.method)}` })
  }
  return chips
})

const filteredInvoices = computed(() => {
  let list = [...invoices.value]

  // Status Filter
  if (currentFilters.value.status !== 'all') {
    const targetStatus = currentFilters.value.status.toLowerCase()
    if (['paid', 'lunas', 'settlement'].includes(targetStatus)) {
      list = list.filter(inv => ['paid', 'settlement', 'lunas', 'success', 'completed'].includes((inv.status || '').toLowerCase()))
    } else if (['pending', 'unpaid'].includes(targetStatus)) {
      list = list.filter(inv => ['pending', 'unpaid'].includes((inv.status || '').toLowerCase()))
    } else {
      list = list.filter(inv => (inv.status || '').toLowerCase() === targetStatus)
    }
  }

  // Method Filter
  if (currentFilters.value.method !== 'all') {
    const mFilter = currentFilters.value.method.toLowerCase()
    if (mFilter === 'manual' || mFilter === 'transfer') {
      list = list.filter(inv => {
        const m = (inv.payment_method || '').toLowerCase()
        return m === 'manual' || m === 'manual_transfer' || m === 'bank_transfer' || m === 'transfer' || !!inv.proof_url
      })
    } else if (mFilter === 'mayar' || mFilter === 'gateway') {
      list = list.filter(inv => {
        const m = (inv.payment_method || '').toLowerCase()
        return ['mayar', 'midtrans', 'stripe', 'tripay', 'xendit', 'qris'].some(g => m.includes(g))
      })
    } else if (mFilter === 'paypal') {
      list = list.filter(inv => (inv.payment_method || '').toLowerCase() === 'paypal')
    } else if (mFilter === 'cash') {
      list = list.filter(inv => {
        const m = (inv.payment_method || '').toLowerCase()
        return m.includes('cash') || m.includes('tunai')
      })
    }
  }

  // Search Filter
  if (search.value.trim()) {
    const q = search.value.toLowerCase().trim()
    list = list.filter(inv =>
      (inv.reference || '').toLowerCase().includes(q) ||
      (inv.payer_name || '').toLowerCase().includes(q) ||
      (inv.payer_email || '').toLowerCase().includes(q) ||
      (inv.club_name || '').toLowerCase().includes(q) ||
      (inv.sender_name || '').toLowerCase().includes(q) ||
      (inv.participants || []).some((p: any) => (p.archer_name || '').toLowerCase().includes(q))
    )
  }

  // Sort
  list.sort((a, b) => {
    let aVal = a[sortBy.value]
    let bVal = b[sortBy.value]

    if (sortBy.value === 'amount') {
      aVal = a.total_amount || a.amount || 0
      bVal = b.total_amount || b.amount || 0
    } else if (sortBy.value === 'created_at') {
      aVal = new Date(a.created_at || 0).getTime()
      bVal = new Date(b.created_at || 0).getTime()
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

function handleTableSearch(val: string) {
  search.value = val
}

function handleTableSort({ sortBy: col, sortOrder: ord }: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
  sortBy.value = col
  sortOrder.value = ord
}

function handleApplyModalFilters(filters: any) {
  currentFilters.value = { ...currentFilters.value, ...filters }
}

function removeFilterChip(key: string) {
  if (key === 'status') currentFilters.value.status = 'all'
  if (key === 'method') currentFilters.value.method = 'all'
  if (key === 'date_range') currentFilters.value.date_range = 'all'
}

function resetAllFilters() {
  currentFilters.value = {
    status: 'all',
    method: 'all',
    date_range: 'all'
  }
  search.value = ''
}

function copyReference(ref: string) {
  if (!ref) return
  navigator.clipboard.writeText(ref)
  copiedRef.value = ref
  setTimeout(() => {
    if (copiedRef.value === ref) copiedRef.value = ''
  }, 2000)
}

function getStatusLabel(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'settlement':
    case 'lunas':
    case 'success':
    case 'completed':
      return t('org_event_payments.status_paid')
    case 'awaiting_verification':
      return t('org_event_payments.status_awaiting')
    case 'pending':
    case 'unpaid':
      return t('org_event_payments.status_pending')
    case 'rejected':
      return t('org_event_payments.status_rejected')
    case 'cancelled':
      return t('org_event_payments.status_cancelled')
    default:
      return status || t('org_event_payments.status_pending')
  }
}

function getStatusBadgeClass(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'settlement':
    case 'lunas':
    case 'success':
    case 'completed':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
    case 'awaiting_verification':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
    case 'rejected':
      return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
    case 'cancelled':
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
    default:
      return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
  }
}

function getStatusDotClass(status?: string) {
  switch ((status || '').toLowerCase()) {
    case 'paid':
    case 'settlement':
    case 'lunas':
    case 'success':
    case 'completed':
      return 'bg-emerald-500'
    case 'awaiting_verification':
      return 'bg-amber-500 animate-pulse'
    case 'rejected':
      return 'bg-rose-500'
    case 'cancelled':
      return 'bg-slate-400'
    default:
      return 'bg-blue-500'
  }
}

function getMethodIcon(method?: string) {
  const m = (method || '').toLowerCase()
  if (m === 'manual' || m === 'bank_transfer' || m === 'manual_transfer') return 'ph:bank-bold'
  if (m === 'mayar') return 'ph:credit-card-bold'
  if (m === 'paypal') return 'ph:paypal-logo-bold'
  if (m === 'midtrans') return 'ph:wallet-bold'
  if (m.includes('cash')) return 'ph:money-bold'
  return 'ph:credit-card-bold'
}

function formatPaymentMethodName(method?: string) {
  if (!method) return t('org_event_payments.method_manual') || 'Transfer Manual'
  const m = method.toLowerCase()
  if (m === 'manual' || m === 'bank_transfer' || m === 'manual_transfer') return t('org_event_payments.method_manual') || 'Transfer Manual'
  if (m === 'mayar') return 'Mayar Gateway'
  if (m === 'paypal') return 'PayPal'
  if (m === 'midtrans') return 'Midtrans'
  if (m.includes('cash')) return t('org_event_payments.method_cash') || 'Tunai di Tempat'
  return method
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function openProof(inv: any) {
  activeProofInvoice.value = inv
  lightboxOpen.value = true
}

function openRejectModal(inv: any) {
  activeRejectInvoice.value = inv
  rejectReason.value = ''
  rejectModalOpen.value = true
}

async function verifyInvoice(inv: any, action: 'approve' | 'reject', reason?: string) {
  isProcessing.value = true
  try {
    const payload: any = { action }
    if (action === 'reject' && reason) {
      payload.rejection_reason = reason
    }

    await post(`/payment/manual/${inv.reference}/verify`, payload)
    toast.success(action === 'approve'
      ? t('org_event_payments.approve_success')
      : t('org_event_payments.reject_success'))
    await fetchPayments()
  } catch (err: any) {
    toast.error(err?.data?.error || t('org_event_payments.verify_error'))
  } finally {
    isProcessing.value = false
  }
}

async function confirmReject() {
  if (!activeRejectInvoice.value || !rejectReason.value.trim()) return
  await verifyInvoice(activeRejectInvoice.value, 'reject', rejectReason.value.trim())
  rejectModalOpen.value = false
}

async function fetchPayments() {
  isLoading.value = true
  try {
    const res = await get(`/tournaments/${eventId.value}/manual-payments`)
    invoices.value = res?.payments || []
  } catch {
    invoices.value = []
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchPayments)

definePageMeta({ layout: 'dashboard' })
</script>