<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'
import { useApi } from '~/composables/useApi'
import { useApiBaseUrl } from '~/composables/useApiBaseUrl'
import { formatMoney } from '~/composables/useCurrency'
import useDashboardI18n from '~/composables/useDashboardI18n'
import PaymentActivityTimeline from '~/components/dashboard/PaymentActivityTimeline.vue'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useDashboardI18n()
const route = useRoute()
const router = useRouter()
const { get, post } = useApi()
const toast = useToast()
const apiBaseUrl = useApiBaseUrl()

const eventId = computed(() => route.params.id)
const reference = computed(() => route.params.reference)

useHead({
  title: computed(() => `Tagihan #${reference.value} - Archeris Dashboard`)
})

const isLoading = ref(true)
const isProcessing = ref(false)
const payment = ref(null)

// Proof Lightbox
const showImageModal = ref(false)
const selectedImageUrl = ref('')
const copiedRef = ref(false)

// Reject Modal
const showRejectModal = ref(false)
const rejectReason = ref('')

const openImageModal = (url) => {
  if (!url) return
  selectedImageUrl.value = url
  showImageModal.value = true
}

const copyReference = () => {
  if (!reference.value) return
  navigator.clipboard.writeText(reference.value)
  copiedRef.value = true
  setTimeout(() => {
    copiedRef.value = false
  }, 2000)
}

const loadPaymentDetails = async () => {
  isLoading.value = true
  try {
    const res = await get(`/payment/status/${reference.value}`)
    if (res) {
      payment.value = res
    } else {
      payment.value = null
    }
  } catch (err) {
    console.error('Failed to load payment detail:', err)
    payment.value = null
  } finally {
    isLoading.value = false
  }
}

// Helpers
const isPaid = (status) => {
  const s = (status || '').toLowerCase()
  return ['paid', 'lunas', 'settlement', 'success', 'completed'].includes(s)
}

const isManualMethod = computed(() => {
  const m = (payment.value?.payment_method || '').toLowerCase()
  return m === 'manual' || String(reference.value || '').toUpperCase().startsWith('PAY-MANUAL-')
})

const isAwaitingVerif = computed(() => {
  const s = (payment.value?.status || '').toLowerCase()
  return s === 'awaiting_verification' || (isManualMethod.value && !!payment.value?.proof_url && !isPaid(s) && s !== 'rejected')
})

const getStatusBadgeClass = (status) => {
  if (isPaid(status)) return 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
  if (isAwaitingVerif.value) return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
  const s = (status || '').toLowerCase()
  if (['pending', 'unpaid'].includes(s)) return 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
  return 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
}

const getStatusDotClass = (status) => {
  if (isPaid(status)) return 'bg-emerald-500'
  if (isAwaitingVerif.value) return 'bg-amber-500 animate-pulse'
  const s = (status || '').toLowerCase()
  if (['pending', 'unpaid'].includes(s)) return 'bg-blue-500'
  return 'bg-rose-500'
}

const getStatusLabel = (status) => {
  if (isPaid(status)) return t('org_event_payments.status_paid') || 'Lunas'
  if (isAwaitingVerif.value) return t('org_event_payments.status_awaiting') || 'Menunggu Verifikasi'
  const s = (status || '').toLowerCase()
  if (['pending', 'unpaid'].includes(s)) return t('org_event_payments.status_pending') || 'Menunggu Pembayaran'
  if (s === 'rejected') return t('org_event_payments.status_rejected') || 'Ditolak'
  if (s === 'cancelled') return t('org_event_payments.status_cancelled') || 'Dibatalkan'
  return status || 'Pending'
}

const paymentCurrency = computed(() => {
  if (payment.value?.currency) return payment.value.currency
  if ((payment.value?.payment_method || '').toLowerCase() === 'paypal') return 'USD'
  return 'IDR'
})

const formatPaymentMethodName = (method) => {
  if (!method) return isManualMethod.value ? (t('org_event_payments.method_manual') || 'Transfer Manual') : '-'
  const m = method.toLowerCase()
  if (m === 'manual' || m === 'bank_transfer' || m === 'manual_transfer') return t('org_event_payments.method_manual') || 'Transfer Manual'
  if (m === 'mayar') return 'Mayar Gateway'
  if (m === 'paypal') return 'PayPal'
  if (m === 'midtrans') return 'Midtrans'
  if (m.includes('cash')) return t('org_event_payments.method_cash') || 'Tunai di Tempat'
  return method
}

const formatCurrency = (val) => {
  const num = Number(val)
  if (isNaN(num)) return formatMoney(0, paymentCurrency.value)
  return formatMoney(num, paymentCurrency.value)
}

const formatDateTime = (val) => {
  if (!val) return '-'
  return new Date(val).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getInvoiceUrl = (ref) => {
  return `${apiBaseUrl}/payment/invoice/${ref}`
}

// Verification Actions
const verifyInvoice = async (action, reason) => {
  isProcessing.value = true
  try {
    const payload = { action }
    if (action === 'reject' && reason) {
      payload.rejection_reason = reason
    }

    await post(`/payment/manual/${reference.value}/verify`, payload)
    toast.success(action === 'approve'
      ? (t('org_event_payments.approve_success') || 'Pembayaran berhasil disetujui.')
      : (t('org_event_payments.reject_success') || 'Pembayaran berhasil ditolak.'))
    showRejectModal.value = false
    await loadPaymentDetails()
  } catch (err) {
    toast.error(err?.data?.error || t('org_event_payments.verify_error') || 'Gagal memproses verifikasi pembayaran.')
  } finally {
    isProcessing.value = false
  }
}

const confirmReject = async () => {
  if (!rejectReason.value.trim()) return
  await verifyInvoice('reject', rejectReason.value.trim())
}

onMounted(() => {
  loadPaymentDetails()
})
</script>

<template>
  <div class="flex flex-col gap-6 md:gap-8 pb-16 font-body">
    <!-- Header (Clean Navy Style) -->
    <div
      class="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm"
    >
      <div
        class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"
      ></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl"></div>

      <div class="relative p-6 sm:p-8">
        <!-- Breadcrumbs -->
        <div class="flex items-center gap-2 text-xs sm:text-sm text-white/60 mb-3 flex-wrap">
          <NuxtLink to="/dashboard/organizer" class="hover:text-white transition-colors">
            Dashboard
          </NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-xs" />
          <NuxtLink to="/dashboard/organizer/tournaments" class="hover:text-white transition-colors">
            {{ t('events.list.title') || 'Turnamen' }}
          </NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-xs" />
          <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/payments`" class="hover:text-white transition-colors">
            {{ t('org_event_payments.title') || 'Pembayaran & Keuangan' }}
          </NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-xs" />
          <span class="text-primary font-bold font-mono">{{ reference }}</span>
        </div>

        <!-- Main Header Content -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-start gap-4">
            <div class="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md shrink-0 font-bold">
              <Icon icon="ph:credit-card-bold" class="text-primary text-2xl" />
            </div>
            <div>
              <h1 class="text-2xl sm:text-3xl font-black text-white leading-tight">
                {{ payment?.event_name || t('archer_payment_detail.header_title') || 'Detail Tagihan Pembayaran' }}
              </h1>
              <div class="text-slate-300 text-xs sm:text-sm mt-1.5 flex items-center gap-3 flex-wrap">
                <span class="flex items-center gap-1.5 font-mono">
                  <Icon icon="ph:hash-bold" class="text-primary" />
                  <span>{{ reference }}</span>
                </span>
                <span v-if="payment?.created_at">•</span>
                <span v-if="payment?.created_at" class="flex items-center gap-1.5">
                  <Icon icon="ph:calendar-blank-bold" class="text-primary" />
                  <span>{{ formatDateTime(payment.created_at) }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Back Button -->
          <div class="flex items-center gap-3 flex-wrap">
            <NuxtLink
              :to="`/dashboard/organizer/tournaments/${eventId}/payments`"
              class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-bold transition-all border border-white/10 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Icon icon="ph:arrow-left-bold" class="size-4" />
              <span>{{ t('common.back') || 'Kembali' }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
      <Icon icon="ph:spinner-bold" class="size-8 animate-spin mx-auto text-navy dark:text-white mb-3" />
      <div class="text-sm font-bold text-navy dark:text-white">{{ t('org_event_payments.loading') }}</div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!payment" class="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
      <div class="size-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
        <Icon icon="ph:receipt-x-bold" class="size-8" />
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-black text-navy dark:text-white">{{ t('archer_payment_detail.not_found_title') || 'Tagihan Tidak Ditemukan' }}</h3>
        <div class="text-xs sm:text-sm text-slate-400">{{ t('org_event_payments.empty_desc') }}</div>
      </div>
      <NuxtLink
        :to="`/dashboard/organizer/tournaments/${eventId}/payments`"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-xl font-bold text-xs sm:text-sm shadow-2xs hover:bg-navy-dark transition-colors"
      >
        <Icon icon="ph:arrow-left-bold" class="size-4 text-primary" />
        <span>{{ t('common.back') || 'Kembali' }}</span>
      </NuxtLink>
    </div>

    <!-- Detail Content Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Left 2 Cols: Unified Main Parent Card -->
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm divide-y divide-slate-100 dark:divide-slate-700 overflow-hidden">

        <!-- Status Action Banner (If Awaiting Verification) -->
        <div
          v-if="isAwaitingVerif"
          class="bg-amber-50 dark:bg-amber-950/30 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-200/80 dark:border-amber-800/80"
        >
          <div class="flex items-start gap-3.5">
            <div class="size-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              <Icon icon="ph:hourglass-bold" class="size-5" />
            </div>
            <div>
              <div class="font-bold text-sm sm:text-base text-navy dark:text-amber-200">{{ t('org_event_payments.stat_awaiting') }}</div>
              <div class="text-xs sm:text-sm text-amber-800 dark:text-amber-300/80 mt-0.5 leading-relaxed">
                {{ t('org_event_payments.stat_awaiting_sub') }}
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              @click="showRejectModal = true"
              :disabled="isProcessing"
              class="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-rose-50 text-rose-600 border border-rose-200 dark:border-rose-900 rounded-xl font-bold text-xs sm:text-sm transition-colors flex-1 sm:flex-initial flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Icon icon="ph:x-bold" class="size-4" />
              <span>{{ t('org_event_payments.reject_btn') }}</span>
            </button>
            <button
              @click="verifyInvoice('approve')"
              :disabled="isProcessing"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-2xs transition-colors flex-1 sm:flex-initial flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Icon v-if="isProcessing" icon="ph:spinner-bold" class="size-4 animate-spin" />
              <Icon v-else icon="ph:check-bold" class="size-4" />
              <span>{{ t('org_event_payments.approve_btn') }}</span>
            </button>
          </div>
        </div>

        <!-- Rejection Notice (If Rejected) -->
        <div
          v-else-if="payment.status === 'rejected'"
          class="bg-rose-50 dark:bg-rose-950/30 p-5 sm:p-6 flex items-start gap-3.5 border-b border-rose-200/80 dark:border-rose-800/80"
        >
          <div class="size-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0 mt-0.5 font-bold">
            <Icon icon="ph:warning-circle-bold" class="size-5" />
          </div>
          <div>
            <div class="font-bold text-sm sm:text-base text-rose-900 dark:text-rose-200">{{ t('org_event_payments.status_rejected') }}</div>
            <div class="text-xs sm:text-sm text-rose-700 dark:text-rose-300/80 mt-1 leading-relaxed">
              <strong>{{ t('org_event_payments.rejection_reason') }}</strong> {{ payment.rejection_reason || '-' }}
            </div>
          </div>
        </div>

        <!-- Section 1: Payer & Registrant Account Card -->
        <div class="p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:user-circle-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
                  {{ t('org_event_payments.reg_info_title') }}
                </h3>
              </div>
            </div>
            <span v-if="payment.club_name" class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800">
              <Icon icon="ph:shield-bold" class="size-3.5" />
              <span>{{ payment.club_name }}</span>
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div class="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1 border border-slate-100 dark:border-slate-700">
              <div class="text-slate-500 font-bold text-xs uppercase tracking-wider">{{ t('org_event_payments.account_registrant_label') }}</div>
              <div class="font-bold text-navy dark:text-white text-sm sm:text-base">
                {{ payment.registered_by_name || payment.payer_name || '-' }}
              </div>
              <div class="text-slate-500 dark:text-slate-400">
                {{ payment.registered_by_email || payment.payer_email || '-' }}
              </div>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1 border border-slate-100 dark:border-slate-700">
              <div class="text-slate-500 font-bold text-xs uppercase tracking-wider">{{ t('org_event_payments.account_sender_label') }}</div>
              <div class="font-bold text-navy dark:text-white text-sm sm:text-base">
                {{ payment.sender_name || payment.payer_name || '-' }}
              </div>
              <div class="text-slate-500 dark:text-slate-400">
                {{ t('org_event_payments.col_method') }}: <span class="font-bold text-navy dark:text-slate-200">{{ formatPaymentMethodName(payment.payment_method) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Registration Details (Rincian Pendaftaran) Table -->
        <div class="space-y-0">
          <div class="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:users-three-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
                  {{ t('org_event_payments.reg_details_title') }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-400 mt-0.5">{{ t('org_event_payments.reg_details_subtitle') }}</div>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-navy/5 text-navy dark:bg-slate-700 dark:text-white border border-navy/10">
              {{ (payment.participants ? payment.participants.length : 0) }} {{ t('org_event_payments.athletes_registered') }}
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th class="py-3 px-4 w-12 text-center">{{ t('org_event_payments.th_no') }}</th>
                  <th class="py-3 px-4">{{ t('org_event_payments.th_athlete_name') }}</th>
                  <th class="py-3 px-4">{{ t('org_event_payments.th_competition_category') }}</th>
                  <th class="py-3 px-4 text-center">{{ t('org_event_payments.th_checkin_status') }}</th>
                  <th class="py-3 px-4 text-right">{{ t('org_event_payments.th_fee') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                <tr
                  v-for="(p, idx) in payment.participants || []"
                  :key="p.uuid || p.id || idx"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td class="py-3.5 px-4 text-center text-slate-400 font-medium">{{ idx + 1 }}</td>
                  <td class="py-3.5 px-4">
                    <div class="font-bold text-navy dark:text-white">{{ p.athlete_name || p.archer_name || '-' }}</div>
                    <div class="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span v-if="p.club_name" class="font-medium text-indigo-600 dark:text-indigo-400">{{ p.club_name }}</span>
                      <span v-if="p.gender && p.club_name" class="text-slate-300">&bull;</span>
                      <span v-if="p.gender" class="capitalize">{{ p.gender }}</span>
                    </div>
                  </td>
                  <td class="py-3.5 px-4">
                    <span class="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {{ p.category_name || t('org_event_payments.general_category') }}
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span
                      class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold"
                      :class="p.last_reregistration_at ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'"
                    >
                      <Icon :icon="p.last_reregistration_at ? 'ph:check-circle-bold' : 'ph:clock-bold'" class="size-3.5" />
                      <span>{{ p.last_reregistration_at ? t('org_event_payments.checked_in') : t('org_event_payments.not_checked_in') }}</span>
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right font-bold text-navy dark:text-white">
                    {{ formatCurrency(p.payment_amount || p.cost || 0) }}
                  </td>
                </tr>
                <tr v-if="!payment.participants || payment.participants.length === 0">
                  <td colspan="5" class="py-8 text-center text-slate-400 italic">
                    {{ t('org_event_payments.no_athletes') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3: Team Reservations Table (If Any) -->
        <div v-if="payment.teams && payment.teams.length > 0" class="space-y-0">
          <div class="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:shield-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
                  {{ t('org_event_payments.team_quota_title') }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-400 mt-0.5">{{ t('org_event_payments.team_quota_subtitle') }}</div>
              </div>
            </div>
            <span class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100">
              {{ payment.teams.length }} {{ t('org_event_payments.th_club') }}
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th class="py-3 px-4 w-12 text-center">{{ t('org_event_payments.th_no') }}</th>
                  <th class="py-3 px-4">{{ t('org_event_payments.th_athlete_name') }}</th>
                  <th class="py-3 px-4">{{ t('org_event_payments.th_club') }}</th>
                  <th class="py-3 px-4 text-center">{{ t('org_event_payments.th_slot') }}</th>
                  <th class="py-3 px-4 text-right">{{ t('org_event_payments.th_fee') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                <tr
                  v-for="(tItem, idx) in payment.teams"
                  :key="tItem.uuid || idx"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-700/30"
                >
                  <td class="py-3.5 px-4 text-center text-slate-400 font-medium">{{ idx + 1 }}</td>
                  <td class="py-3.5 px-4">
                    <div class="font-bold text-navy dark:text-white">{{ tItem.team_name || 'Tim Beregu' }}</div>
                    <div class="text-xs text-slate-400">{{ tItem.category_name || '-' }}</div>
                  </td>
                  <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-medium">
                    {{ tItem.club_name || payment.club_name || '-' }}
                  </td>
                  <td class="py-3.5 px-4 text-center">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                      {{ tItem.member_count || 1 }} Slot
                    </span>
                  </td>
                  <td class="py-3.5 px-4 text-right font-bold text-navy dark:text-white">
                    {{ formatCurrency(tItem.fee || 0) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 4: Bank Slip Proof (If Manual Transfer) -->
        <div v-if="isManualMethod" class="p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:image-square-bold" class="text-xl" />
              </div>
              <div>
                <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
                  {{ t('org_event_payments.proof_section_title') }}
                </h3>
                <div class="text-xs sm:text-sm text-slate-400 mt-0.5">{{ t('org_event_payments.proof_section_subtitle') }}</div>
              </div>
            </div>
            <a
              v-if="payment.proof_url"
              :href="payment.proof_url"
              target="_blank"
              class="text-navy dark:text-slate-200 hover:underline font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>{{ t('org_event_payments.open_original') }}</span>
              <Icon icon="ph:arrow-square-out-bold" class="size-4 text-primary" />
            </a>
          </div>

          <div v-if="payment.proof_url" class="flex flex-col sm:flex-row items-center gap-5 p-4 sm:p-5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700">
            <div
              @click="openImageModal(payment.proof_url)"
              class="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-600 bg-white size-36 sm:size-44 shrink-0 flex items-center justify-center shadow-sm"
            >
              <img
                :src="payment.proof_url"
                :alt="t('org_event_payments.proof_alt')"
                class="size-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs sm:text-sm font-bold gap-1.5">
                <Icon icon="ph:magnifying-glass-plus-bold" class="size-5 text-primary" />
                <span>Pratinjau</span>
              </div>
            </div>

            <div class="space-y-2.5 text-xs sm:text-sm flex-1">
              <div>
                <div class="text-slate-500 font-medium">{{ t('org_event_payments.proof_sender_account') }}</div>
                <div class="font-bold text-navy dark:text-white text-sm sm:text-base mt-0.5">{{ payment.sender_name || payment.payer_name || t('org_event_payments.not_provided') }}</div>
              </div>
              <div v-if="payment.bank_name">
                <div class="text-slate-500 font-medium">{{ t('org_event_payments.proof_bank_name') }}</div>
                <div class="font-bold text-navy dark:text-white">{{ payment.bank_name }}</div>
              </div>
              <div>
                <div class="text-slate-500 font-medium">{{ t('org_event_payments.proof_upload_time') }}</div>
                <div class="font-medium text-slate-700 dark:text-slate-300 font-mono">{{ formatDateTime(payment.proof_uploaded_at || payment.updated_at) }}</div>
              </div>
            </div>
          </div>

          <div v-else class="p-8 text-center bg-slate-50 dark:bg-slate-700/30 rounded-xl text-slate-400 text-xs sm:text-sm italic">
            {{ t('org_event_payments.no_proof_uploaded') }}
          </div>
        </div>

        <!-- Section 5: Payment Activity & Status Timeline (Audit Trail Reusable Component) -->
        <PaymentActivityTimeline
          :payment="payment"
          :format-currency="formatCurrency"
          :format-date-time="formatDateTime"
        />
      </div>

      <!-- Right 1 Col: Calculation Summary & Verification Actions -->
      <div class="space-y-6">
        <!-- Summary Calculation Card -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Icon icon="ph:calculator-bold" class="text-xl" />
              </div>
              <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
                {{ t('org_event_payments.calculation_title') }}
              </h3>
            </div>
            <div
              v-if="payment"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs"
              :class="getStatusBadgeClass(payment.status)"
            >
              <span class="size-1.5 rounded-full shrink-0" :class="getStatusDotClass(payment.status)"></span>
              <span>{{ getStatusLabel(payment.status) }}</span>
            </div>
          </div>

          <div class="space-y-3 text-xs sm:text-sm">
            <div class="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>{{ t('org_event_payments.subtotal_individual', { count: (payment.participants ? payment.participants.length : 0) }) }}</span>
              <span class="font-bold text-navy dark:text-white">
                {{ formatCurrency((payment.participants || []).reduce((sum, p) => sum + (p.payment_amount || p.cost || 0), 0)) }}
              </span>
            </div>

            <div v-if="payment.teams && payment.teams.length > 0" class="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>{{ t('org_event_payments.subtotal_team', { count: payment.teams.length }) }}</span>
              <span class="font-bold text-navy dark:text-white">
                {{ formatCurrency(payment.teams.reduce((sum, t) => sum + (t.amount || t.fee || 0), 0)) }}
              </span>
            </div>

            <div v-if="payment.fee && payment.fee > 0" class="flex justify-between items-center text-slate-600 dark:text-slate-300">
              <span>{{ t('org_event_payments.service_fee') }}</span>
              <span class="font-bold text-navy dark:text-white">{{ formatCurrency(payment.fee) }}</span>
            </div>

            <div class="pt-3.5 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <span class="font-bold text-sm sm:text-base text-navy dark:text-white">{{ t('org_event_payments.total_bill') }}</span>
              <span class="font-black text-xl sm:text-2xl text-navy dark:text-white">
                {{ formatCurrency(payment.total_amount || payment.amount || 0) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Organizer Action Card -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div class="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
            <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <Icon icon="ph:gear-bold" class="text-xl" />
            </div>
            <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
              {{ t('org_event_payments.organizer_actions_title') }}
            </h3>
          </div>

          <!-- When Awaiting Verification -->
          <div v-if="isAwaitingVerif" class="space-y-3">
            <button
              @click="verifyInvoice('approve')"
              :disabled="isProcessing"
              class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon v-if="isProcessing" icon="ph:spinner-bold" class="size-4 animate-spin" />
              <Icon v-else icon="ph:check-circle-bold" class="size-4" />
              <span>{{ t('org_event_payments.btn_approve_full') }}</span>
            </button>

            <button
              @click="showRejectModal = true"
              :disabled="isProcessing"
              class="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon icon="ph:x-circle-bold" class="size-4" />
              <span>{{ t('org_event_payments.btn_reject_proof') }}</span>
            </button>
          </div>

          <!-- When Already Paid -->
          <div v-else-if="isPaid(payment.status)" class="space-y-3">
            <div class="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 font-bold">
              <Icon icon="ph:seal-check-bold" class="size-5 shrink-0 text-emerald-600" />
              <span>{{ t('org_event_payments.paid_verified_note') }}</span>
            </div>

            <a
              :href="getInvoiceUrl(reference)"
              target="_blank"
              class="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-navy dark:text-white rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon icon="ph:receipt-bold" class="size-4 text-primary" />
              <span>{{ t('org_event_payments.view_invoice_pdf') }}</span>
            </a>
          </div>

          <!-- Quick Copy Link -->
          <button
            @click="copyReference"
            class="w-full py-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200/80 dark:border-slate-600"
          >
            <Icon :icon="copiedRef ? 'ph:check-bold' : 'ph:copy-simple-bold'" class="size-4" :class="copiedRef ? 'text-emerald-600' : 'text-slate-400'" />
            <span>{{ copiedRef ? t('org_event_payments.ref_copied') : t('org_event_payments.copy_ref_btn') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Image Lightbox Modal -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showImageModal = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
        <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h4 class="font-bold text-sm sm:text-base text-navy dark:text-white">{{ t('org_event_payments.proof_modal_title') }}</h4>
            <div class="text-xs text-slate-400">{{ reference }} &bull; {{ payment?.payer_name }}</div>
          </div>
          <button
            @click="showImageModal = false"
            class="size-8 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            <Icon icon="ph:x-bold" class="size-4" />
          </button>
        </div>

        <div class="p-4 flex items-center justify-center bg-slate-900/5 dark:bg-slate-950/40 max-h-[70vh] overflow-auto">
          <img
            :src="selectedImageUrl"
            :alt="t('org_event_payments.proof_alt')"
            class="max-w-full max-h-[65vh] object-contain rounded-xl shadow-md"
          />
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs sm:text-sm">
          <div class="text-slate-500 dark:text-slate-400">
            {{ t('org_event_payments.proof_sender_account') }} <strong>{{ payment?.sender_name || payment?.payer_name || t('org_event_payments.not_provided') }}</strong>
          </div>
          <a
            :href="selectedImageUrl"
            target="_blank"
            class="text-navy dark:text-slate-200 hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>{{ t('org_event_payments.open_original') }}</span>
            <Icon icon="ph:arrow-square-out-bold" class="size-3.5 text-primary" />
          </a>
        </div>
      </div>
    </div>

    <!-- Reject Reason Modal -->
    <div
      v-if="showRejectModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showRejectModal = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="size-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Icon icon="ph:warning-circle-bold" class="size-5" />
          </div>
          <div>
            <h4 class="font-bold text-navy dark:text-white text-base sm:text-lg">{{ t('org_event_payments.reject_modal_title') }}</h4>
            <div class="text-xs text-slate-400">{{ reference }}</div>
          </div>
        </div>

        <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
          {{ t('org_event_payments.reject_modal_desc') }}
        </div>

        <textarea
          v-model="rejectReason"
          rows="3"
          :placeholder="t('org_event_payments.reject_placeholder')"
          class="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:bg-white focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-navy dark:text-white placeholder:text-slate-400 mb-4"
        ></textarea>

        <div class="flex justify-end gap-2.5">
          <button
            @click="showRejectModal = false"
            class="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {{ t('org_event_payments.cancel') }}
          </button>
          <button
            @click="confirmReject"
            :disabled="!rejectReason.trim() || isProcessing"
            class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Icon v-if="isProcessing" icon="ph:spinner-bold" class="size-4 animate-spin" />
            <span>{{ t('org_event_payments.reject_confirm') }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
