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
            variant="white"
            icon="ph:arrow-left-bold"
            @click="router.push('/dashboard/organizer/earnings')"
            class="h-10 px-4 text-xs font-bold bg-white border border-slate-200 shadow-2xs text-navy hover:bg-slate-50"
          >
            {{ t('common.back') }}
          </BaseButton>
        </div>
      </template>
    </DashboardHeader>

    <!-- KPI Stats Summary Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        :title="t('earnings.total_event', 'Total Event Revenue')"
        :value="formatMoney(totalAmount || 0, eventCurrency)"
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
        :value="formatMoney(payments.length ? (totalAmount / payments.length) : 0, eventCurrency)"
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
          <img
            :src="item.archerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.archerName || 'Archer')}`"
            @error="(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(item.archerName || 'Archer')}`"
            class="size-9 rounded-xl object-cover border border-slate-200/80 shadow-2xs shrink-0 bg-slate-100"
            :alt="item.archerName || 'Archer'"
          />
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
          {{ formatMoney(item.amount || 0, item.currency || eventCurrency) }}
        </div>
      </template>

      <!-- Action Column Slot -->
      <template #item-action="{ item }">
        <div class="flex items-center justify-center">
          <button
            type="button"
            @click="openPaymentDetail(item)"
            class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy transition-all cursor-pointer shadow-2xs"
            :title="t('earnings.view_details', 'Lihat Detail')"
          >
            <Icon icon="ph:eye-bold" class="text-base" />
          </button>
        </div>
      </template>
    </DashboardDataTable>

    <!-- Payment Detail Modal Dialog (Fetches API on-demand) -->
    <BaseDialogForm
      v-model="showDetailModal"
      size="lg"
      :hide-footer="true"
      :header="t('earnings.modal_detail_title', 'Detail Transaksi Pembayaran')"
      @close="showDetailModal = false"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="size-10 bg-primary/20 rounded-xl flex items-center justify-center text-navy shrink-0">
            <Icon icon="ph:receipt-bold" class="text-xl" />
          </div>
          <div>
            <div class="text-base font-bold text-navy">
              {{ t('earnings.modal_detail_title', 'Detail Transaksi Pembayaran') }}
            </div>
            <div class="text-xs text-slate-400 font-normal">
              {{ t('earnings.modal_detail_subtitle', 'Rincian transaksi dan pendaftaran peserta') }}
            </div>
          </div>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="loadingDetail" class="py-12 flex flex-col items-center justify-center gap-2.5 text-slate-400">
        <Icon icon="ph:spinner" class="text-3xl animate-spin text-primary" />
        <span class="text-xs font-bold text-slate-500">{{ t('common.loading', 'Memuat data transaksi...') }}</span>
      </div>

      <!-- Simple, Unified Detail Content -->
      <div v-else-if="activePayment" class="space-y-5 text-navy">
        <!-- 1. Payer Info & Amount Top Bar -->
        <div class="flex items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
          <div class="flex items-center gap-3 min-w-0">
            <img
              :src="activePayment.archerAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activePayment.archerName || 'Archer')}`"
              @error="(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(activePayment.archerName || 'Archer')}`"
              class="size-11 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
              :alt="activePayment.archerName || 'Archer'"
            />
            <div class="min-w-0">
              <div class="text-sm font-bold text-navy truncate">
                {{ activePayment.archerName || '-' }}
              </div>
              <div class="text-xs text-slate-400 font-medium truncate">
                {{ activePayment.archerEmail || '-' }}
              </div>
              <div v-if="activePayment.clubName" class="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                <Icon icon="ph:shield-bold" class="inline text-primary mr-1" />{{ activePayment.clubName }}
              </div>
            </div>
          </div>

          <div class="text-right shrink-0">
            <div class="text-xs text-slate-400 font-medium capitalize">
              {{ t('earnings.lbl_amount', 'Total Pembayaran') }}
            </div>
            <div class="text-lg sm:text-xl font-black text-navy tabular-nums">
              {{ formatMoney(activePayment.totalAmount || activePayment.amount || 0, activePayment.currency || eventCurrency) }}
            </div>
          </div>
        </div>

        <!-- 2. Simple Key-Value Details List -->
        <div class="border border-slate-200/70 rounded-2xl divide-y divide-slate-100 text-xs bg-white overflow-hidden">
          <!-- Status Row -->
          <div class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_status', 'Status') }}</span>
            <span
              class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border"
              :class="getStatusBadge(activePayment.status).class"
            >
              <Icon :icon="getStatusBadge(activePayment.status).icon" class="text-xs" />
              <span>{{ getStatusBadge(activePayment.status).label }}</span>
            </span>
          </div>

          <!-- Reference / Invoice Row -->
          <div class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_invoice', 'No. Referensi / Invoice') }}</span>
            <div class="flex items-center gap-1.5 font-mono font-bold text-navy">
              <span>{{ activePayment.reference || '-' }}</span>
              <button
                v-if="activePayment.reference"
                type="button"
                @click="copyReference(activePayment.reference)"
                class="text-slate-400 hover:text-navy cursor-pointer p-0.5"
                title="Copy"
              >
                <Icon icon="ph:copy-bold" class="text-xs" />
              </button>
            </div>
          </div>

          <!-- Payment Method Row -->
          <div class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_method', 'Metode Pembayaran') }}</span>
            <div class="flex items-center gap-1.5 font-bold text-navy capitalize">
              <Icon :icon="getPaymentMethodIcon(activePayment.method)" class="text-sm text-slate-500" />
              <span>{{ activePayment.paymentChannel || activePayment.method || '-' }}</span>
            </div>
          </div>

          <!-- Payment Date Row -->
          <div class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_payment_date', 'Tanggal Pembayaran') }}</span>
            <span class="font-medium text-slate-700">{{ formatPaymentDate(activePayment.paidAt || activePayment.createdAt) }}</span>
          </div>

          <!-- Tournament & Category Row -->
          <div class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_tournament', 'Turnamen') }}</span>
            <span class="font-bold text-navy text-right max-w-xs truncate">{{ activePayment.eventName || eventName || '-' }}</span>
          </div>

          <div class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_category', 'Kategori / Divisi') }}</span>
            <span class="font-bold text-navy text-right max-w-xs truncate">{{ activePayment.categoryName || activePayment.division || activePayment.category || '-' }}</span>
          </div>

          <!-- Registered By Row (if applicable) -->
          <div v-if="activePayment.registeredByName && activePayment.registeredByName !== activePayment.archerName" class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_registered_by', 'Didaftarkan Oleh') }}</span>
            <span class="font-medium text-slate-700">{{ activePayment.registeredByName }}</span>
          </div>

          <!-- VA Number / Pay Code (if applicable) -->
          <div v-if="activePayment.vaNumber || activePayment.payCode || activePayment.pay_code" class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_va_code', 'Nomor VA / Kode Bayar') }}</span>
            <span class="font-mono font-bold text-navy">{{ activePayment.vaNumber || activePayment.payCode || activePayment.pay_code }}</span>
          </div>

          <!-- Sender Bank Account Name (if manual) -->
          <div v-if="activePayment.senderName || activePayment.sender_name" class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_sender_name', 'Atas Nama Pengirim') }}</span>
            <span class="font-bold text-navy">{{ activePayment.senderName || activePayment.sender_name }}</span>
          </div>

          <!-- Proof of Payment (if manual transfer proof exists) -->
          <div v-if="activePayment.proofUrl" class="flex items-center justify-between p-3 sm:px-4">
            <span class="text-slate-500 font-medium">{{ t('earnings.lbl_proof', 'Bukti Transfer') }}</span>
            <a
              :href="activePayment.proofUrl"
              target="_blank"
              class="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>{{ t('earnings.lbl_view_proof', 'Lihat Bukti Transfer') }}</span>
              <Icon icon="ph:arrow-square-out-bold" />
            </a>
          </div>

          <!-- Rejection Reason (if rejected) -->
          <div v-if="activePayment.rejectionReason" class="p-3 sm:px-4 bg-rose-50 text-rose-800">
            <div class="font-bold text-xs flex items-center gap-1 mb-0.5">
              <Icon icon="ph:warning-circle-bold" />
              <span>{{ t('earnings.lbl_rejection_reason', 'Alasan Penolakan') }}</span>
            </div>
            <div class="text-xs text-rose-700 leading-relaxed">{{ activePayment.rejectionReason }}</div>
          </div>
        </div>

        <!-- 3. Multi-Participant List (if invoice contains multiple participants) -->
        <div v-if="activePayment.participants && activePayment.participants.length > 1" class="space-y-2">
          <div class="text-xs font-bold text-slate-500 capitalize">
            {{ t('earnings.lbl_participants', 'Daftar Peserta') }} ({{ activePayment.participants.length }})
          </div>

          <div class="border border-slate-200/70 rounded-2xl divide-y divide-slate-100 bg-white overflow-hidden text-xs">
            <div
              v-for="(p, idx) in activePayment.participants"
              :key="p.uuid || idx"
              class="flex items-center justify-between p-3 sm:px-4 gap-3"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <img
                  :src="p.archer_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.archer_name || p.athlete_name || 'Archer')}`"
                  @error="(e) => e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(p.archer_name || p.athlete_name || 'Archer')}`"
                  class="size-8 rounded-lg object-cover border border-slate-200 shrink-0 bg-slate-50"
                  :alt="p.archer_name || p.athlete_name"
                />
                <div class="min-w-0">
                  <div class="font-bold text-navy truncate">{{ p.archer_name || p.athlete_name }}</div>
                  <div class="text-[11px] text-slate-400 truncate">{{ p.category_name || p.division_name || '-' }}</div>
                </div>
              </div>
              <div class="font-mono font-bold text-navy shrink-0">
                {{ formatMoney(p.payment_amount || 0, activePayment.currency || eventCurrency) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseDialogForm>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { formatMoney } from '~/composables/useCurrency'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'

const route = useRoute()
const router = useRouter()
const api = useApi()
const { t, locale } = useI18n()
const toast = useToast()

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth']
})

const eventId = route.params.id
const eventName = ref('')
const eventCurrency = ref('IDR')
const payments = ref([])
const loading = ref(true)

// Detail modal state
const showDetailModal = ref(false)
const activePayment = ref(null)
const loadingDetail = ref(false)

useHead(() => ({
  title: (eventName.value ? `${eventName.value} - ` : '') + t('earnings.event_detail') + ' - Archeris Dashboard'
}))

const tableColumns = computed(() => [
  { key: 'participant', label: t('earnings.table_participant', 'Peserta'), sortable: true, sortKey: 'archerName', class: 'min-w-[220px]' },
  { key: 'reference', label: t('earnings.table_reference', 'No. Invoice / Referensi'), sortable: true, sortKey: 'reference', class: 'min-w-[180px]' },
  { key: 'createdAt', label: t('earnings.table_date', 'Tanggal'), sortable: true, sortKey: 'createdAt', class: 'min-w-[170px]' },
  { key: 'method', label: t('earnings.table_method', 'Metode'), sortable: true, sortKey: 'method', class: 'min-w-[140px]' },
  { key: 'amount', label: t('earnings.table_amount', 'Nominal'), align: 'right', sortable: true, sortKey: 'amount', class: 'min-w-[130px]' },
  { key: 'action', label: t('common.action', 'Aksi'), align: 'center', sortable: false, class: 'w-[80px]' }
])

const openPaymentDetail = async (item) => {
  activePayment.value = { ...item }
  showDetailModal.value = true
  loadingDetail.value = true
  try {
    const res = await api.get(`/payment/status/${item.reference}`)
    if (res) {
      activePayment.value = {
        ...activePayment.value,
        ...res,
        method: res.payment_method || activePayment.value.method,
        status: res.status || activePayment.value.status,
        proofUrl: res.proof_url || activePayment.value.proofUrl,
        paidAt: res.paid_at || activePayment.value.paidAt,
        archerAvatar: res.archer_avatar || activePayment.value.archerAvatar,
        archerName: res.athlete_name || res.archer_name || res.payer_name || activePayment.value.archerName,
        archerEmail: res.payer_email || res.registered_by_email || activePayment.value.archerEmail,
        clubName: res.club_name || activePayment.value.clubName,
        eventName: res.event_name || eventName.value,
        categoryName: res.category_name || res.category || activePayment.value.categoryName,
        currency: res.currency || activePayment.value.currency || eventCurrency.value,
        totalAmount: res.total_amount || res.amount || activePayment.value.amount,
        baseAmount: res.amount || activePayment.value.amount,
        feeAmount: res.fee_amount || 0,
        gatewayReference: res.gateway_reference,
        paymentChannel: res.payment_channel,
        vaNumber: res.va_number || res.pay_code,
        senderName: res.sender_name,
        registeredByName: res.registered_by_name,
        registeredByEmail: res.registered_by_email,
        createdAt: res.created_at || activePayment.value.createdAt,
        verifiedAt: res.verified_at,
        verifiedBy: res.verified_by,
        expiredAt: res.expired_at,
        proofUploadedAt: res.proof_uploaded_at,
        rejectionReason: res.rejection_reason,
        participants: res.participants || [],
        teams: res.teams || []
      }
    }
  } catch (err) {
    // Keep item baseline data
  } finally {
    loadingDetail.value = false
  }
}

const getStatusBadge = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'paid' || s === 'success' || s === 'completed') {
    return {
      label: t('earnings.status_paid', 'Lunas'),
      class: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'ph:check-circle-bold'
    }
  }
  if (s === 'awaiting_verification') {
    return {
      label: t('earnings.status_awaiting_verification', 'Menunggu Verifikasi'),
      class: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: 'ph:clock-bold'
    }
  }
  if (s === 'pending') {
    return {
      label: t('earnings.status_pending', 'Menunggu Pembayaran'),
      class: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'ph:hourglass-bold'
    }
  }
  if (s === 'expired') {
    return {
      label: t('earnings.status_expired', 'Kadaluarsa'),
      class: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: 'ph:clock-x-bold'
    }
  }
  if (s === 'rejected' || s === 'failed') {
    return {
      label: t('earnings.status_rejected', 'Ditolak / Gagal'),
      class: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: 'ph:x-circle-bold'
    }
  }
  if (s === 'refunded') {
    return {
      label: t('earnings.status_refunded', 'Refund'),
      class: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: 'ph:arrow-u-down-left-bold'
    }
  }
  return {
    label: s ? (s.charAt(0).toUpperCase() + s.slice(1)) : 'Pending',
    class: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: 'ph:info-bold'
  }
}

const copyReference = async (text) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    toast.success(t('common.copied', 'Disalin ke clipboard'))
  } catch {
    toast.info(text)
  }
}

const fetchDetails = async () => {
  try {
    loading.value = true
    const res = await api.get(`/organizers/earnings/${eventId}`)
    eventName.value = res.eventName || ''
    payments.value = res.payments || []
    eventCurrency.value = res.currency || res.eventCurrency || payments.value[0]?.currency || 'IDR'
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
    const isEn = (locale.value || 'id') === 'en'
    const day = String(d.getDate()).padStart(2, '0')
    const monthsId = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = (isEn ? monthsEn : monthsId)[d.getMonth()]
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`
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

onMounted(fetchDetails)
</script>
