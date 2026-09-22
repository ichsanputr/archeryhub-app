<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from '#app'
import { useApi } from '~/composables/useApi'
import { useApiBaseUrl } from '~/composables/useApiBaseUrl'
import { formatMoney } from '~/composables/useCurrency'
import PaymentActivityTimeline from '~/components/dashboard/PaymentActivityTimeline.vue'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const { get, post, upload } = useApi()
const toast = useToast()
const apiBaseUrl = useApiBaseUrl()

const reference = route.params.reference

useHead({
  title: computed(() => `${t('archer_payment_detail.header_title')} #${reference} - Archeris Dashboard`)
})

const isLoading = ref(true)
const isCancelling = ref(false)
const showCancelModal = ref(false)
const payment = ref(null)

// Proof Lightbox
const showImageModal = ref(false)
const selectedImageUrl = ref('')
const copiedRef = ref(false)

// Re-upload proof state
const reuploadSenderName = ref('')
const reuploadFileUrl = ref('')
const reuploadPreviewUrl = ref('')
const isReuploading = ref(false)
const reuploadFileInputRef = ref(null)

// Participants Table State: Search, Sorting, Pagination
const participantSearch = ref('')
const participantSortBy = ref('athlete_name')
const participantSortOrder = ref('asc')
const participantCurrentPage = ref(1)
const participantPerPage = ref(10)

const triggerReuploadFileInput = () => {
  reuploadFileInputRef.value?.click()
}

const handleReuploadFileChange = async (evt) => {
  const file = evt.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast.error(t('archer_payment_detail.toast_file_limit'))
    return
  }
  reuploadPreviewUrl.value = URL.createObjectURL(file)
  isReuploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('caption', `proof-reupload-${reference}-${Date.now()}`)
    const res = await upload('/media/upload', formData)
    reuploadFileUrl.value = res.url || res.URL || ''
    toast.success(t('archer_payment_detail.toast_file_uploaded'))
  } catch (err) {
    toast.error(`${t('archer_payment_detail.toast_upload_error')} ` + (err?.data?.error || err?.message || 'Error'))
    reuploadPreviewUrl.value = ''
  } finally {
    isReuploading.value = false
  }
}

const submitReuploadProof = async () => {
  if (!reuploadFileUrl.value || !reuploadSenderName.value.trim()) {
    toast.warning(t('archer_payment_detail.toast_fill_required'))
    return
  }
  isReuploading.value = true
  try {
    await post(`/payment/manual/${reference}/upload-proof`, {
      proof_url: reuploadFileUrl.value,
      sender_name: reuploadSenderName.value.trim()
    })
    toast.success(t('archer_payment_detail.toast_proof_sent'))
    await loadPaymentDetails()
    reuploadFileUrl.value = ''
    reuploadPreviewUrl.value = ''
    reuploadSenderName.value = ''
  } catch (err) {
    toast.error(err?.data?.error || t('archer_payment_detail.toast_proof_failed'))
  } finally {
    isReuploading.value = false
  }
}

const cancelTransaction = async () => {
  isCancelling.value = true
  try {
    const res = await post(`/payment/${reference}/cancel`)
    toast.success(res?.message || t('archer_payment_detail.toast_cancel_success'))
    showCancelModal.value = false
    await loadPaymentDetails()
  } catch (err) {
    toast.error(err?.data?.error || t('archer_payment_detail.toast_cancel_failed'))
  } finally {
    isCancelling.value = false
  }
}

const openImageModal = (url) => {
  if (!url) return
  selectedImageUrl.value = url
  showImageModal.value = true
}

const copyReference = () => {
  if (!reference) return
  navigator.clipboard.writeText(reference)
  copiedRef.value = true
  setTimeout(() => {
    copiedRef.value = false
  }, 2000)
}

const loadPaymentDetails = async () => {
  isLoading.value = true
  try {
    const res = await get(`/payment/status/${reference}`)
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
  return m === 'manual' || String(reference || '').toUpperCase().startsWith('PAY-MANUAL-')
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
  if (isPaid(status)) return t('payment_status.badge_paid')
  if (isAwaitingVerif.value) return t('payment_status.badge_awaiting_verification')
  const s = (status || '').toLowerCase()
  if (['pending', 'unpaid'].includes(s)) return t('payment_status.badge_pending')
  if (s === 'rejected') return 'Ditolak'
  if (s === 'cancelled') return 'Dibatalkan'
  return status || 'Menunggu Pembayaran'
}

const isPayPal = computed(() => {
  return (payment.value?.payment_method || '').toLowerCase() === 'paypal'
})

const isFree = computed(() => {
  const m = (payment.value?.payment_method || '').toLowerCase()
  const amt = Number(payment.value?.total_amount || payment.value?.amount || 0)
  return m === 'free' || m === 'free_registration' || (amt === 0 && isPaid(payment.value?.status))
})

const gatewayHeading = computed(() => {
  if (isPayPal.value) {
    return t('archer_payment_detail.pay_paypal_heading')
  }
  return t('archer_payment_detail.pay_mayar_heading')
})

const gatewayDesc = computed(() => {
  if (isPayPal.value) {
    return t('archer_payment_detail.pay_paypal_desc')
  }
  return t('archer_payment_detail.pay_mayar_desc')
})

const gatewayButtonLabel = computed(() => {
  if (isPayPal.value) {
    return t('archer_payment_detail.btn_pay_paypal')
  }
  return t('archer_payment_detail.btn_pay_mayar')
})

const paymentCurrency = computed(() => {
  if (payment.value?.currency) return payment.value.currency
  if ((payment.value?.payment_method || '').toLowerCase() === 'paypal') return 'USD'
  return 'IDR'
})

const formatPaymentMethodName = (method) => {
  if (isFree.value) return `Pendaftaran Gratis (${formatCurrency(0)})`
  if (!method) return isManualMethod.value ? t('archer_payments_list.method_manual') : '-'
  const m = method.toLowerCase()
  if (m === 'free' || m === 'free_registration') return `Pendaftaran Gratis (${formatCurrency(0)})`
  if (m === 'manual' || m === 'manual_transfer' || m === 'bank_transfer') return t('archer_payments_list.method_manual')
  if (m === 'mayar') return t('archer_payments_list.method_mayar')
  if (m === 'paypal') return 'PayPal'
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

// Filtered & Paginated Participants
const filteredParticipants = computed(() => {
  let list = [...(payment.value?.participants || [])]
  if (participantSearch.value.trim()) {
    const q = participantSearch.value.toLowerCase().trim()
    list = list.filter(p =>
      (p.athlete_name || p.archer_name || '').toLowerCase().includes(q) ||
      (p.club_name || '').toLowerCase().includes(q) ||
      (p.category_name || '').toLowerCase().includes(q)
    )
  }

  // Sorting
  list.sort((a, b) => {
    let fieldA = a[participantSortBy.value] || ''
    let fieldB = b[participantSortBy.value] || ''
    if (participantSortBy.value === 'payment_amount') {
      fieldA = Number(a.payment_amount || a.cost || 0)
      fieldB = Number(b.payment_amount || b.cost || 0)
    }
    if (fieldA < fieldB) return participantSortOrder.value === 'asc' ? -1 : 1
    if (fieldA > fieldB) return participantSortOrder.value === 'asc' ? 1 : -1
    return 0
  })

  return list
})

const totalParticipantPages = computed(() => {
  return Math.ceil(filteredParticipants.value.length / participantPerPage.value) || 1
})

const paginatedParticipants = computed(() => {
  const start = (participantCurrentPage.value - 1) * participantPerPage.value
  return filteredParticipants.value.slice(start, start + participantPerPage.value)
})

const handleParticipantSort = (column) => {
  if (participantSortBy.value === column) {
    participantSortOrder.value = participantSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    participantSortBy.value = column
    participantSortOrder.value = 'asc'
  }
}

onMounted(() => {
  loadPaymentDetails()
})
</script>

<template>
  <div class="flex flex-col gap-6 md:gap-8 pb-16 font-body">
    <!-- Header (Clean Dashboard Header) -->
    <DashboardHeader
      :title="t('archer_payment_detail.header_title')"
      :subtitle="payment?.event_name || `Tagihan #${reference}`"
      icon="ph:receipt-bold"
      back-to="/dashboard/archer/payments"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: t('archer_payments_list.title'), to: '/dashboard/archer/payments' },
        { label: `#${reference}` }
      ]"
    >
      <template #actions>
        <div class="flex items-center gap-2.5 flex-wrap">
          <NuxtLink
            v-if="payment && isPaid(payment.status)"
            :href="getInvoiceUrl(reference)"
            target="_blank"
            class="px-4 py-2.5 rounded-xl bg-navy text-white hover:bg-navy-dark text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-2 shadow-xs"
          >
            <Icon icon="ph:printer-bold" class="text-base text-primary" />
            <span>{{ t('archer_payment_detail.download_invoice_btn') }}</span>
          </NuxtLink>
        </div>
      </template>
    </DashboardHeader>

    <!-- Loading State -->
    <div v-if="isLoading" class="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700 shadow-sm">
      <Icon icon="ph:spinner-bold" class="size-8 animate-spin mx-auto text-navy dark:text-white mb-3" />
      <div class="text-sm font-bold text-navy dark:text-white">{{ t('common.loading') }}</div>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!payment" class="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
      <div class="size-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto">
        <Icon icon="ph:receipt-x-bold" class="size-8" />
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-black text-navy dark:text-white">{{ t('archer_payment_detail.not_found_title') }}</h3>
        <div class="text-xs sm:text-sm text-slate-400">{{ t('archer_payment_detail.not_found_desc') }}</div>
      </div>
      <NuxtLink
        to="/dashboard/archer/payments"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-navy text-white rounded-xl font-bold text-xs sm:text-sm shadow-2xs hover:bg-navy-dark transition-colors"
      >
        <Icon icon="ph:arrow-left-bold" class="size-4 text-primary" />
        <span>{{ t('common.back') }}</span>
      </NuxtLink>
    </div>

    <!-- Main Payment Detail Content Grid -->
    <div v-else class="space-y-6">

      <!-- Prominent Free Registration Banner -->
      <div
        v-if="isFree"
        class="p-5 sm:p-6 bg-gradient-to-r from-emerald-700 to-teal-800 rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm relative overflow-hidden"
      >
        <div class="space-y-1.5 z-10">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full bg-white text-emerald-900 font-bold text-xs">
              {{ t('payment_status.badge_paid') }}
            </span>
            <span class="text-xs sm:text-sm text-emerald-100 font-bold">
              {{ formatCurrency(0) }} • {{ t('archer_payment_detail.free_confirmed') }}
            </span>
          </div>
          <div class="text-lg sm:text-xl font-black text-white">
            {{ t('archer_payment_detail.free_title') }}
          </div>
          <div class="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-xl">
            {{ t('archer_payment_detail.free_desc') }}
          </div>
        </div>

        <div v-if="payment?.event_slug || payment?.event_id || payment?.tournament_id" class="z-10 shrink-0 w-full md:w-auto">
          <NuxtLink
            :to="`/dashboard/archer/tournaments/${payment.event_slug || payment.event_id || payment.tournament_id}/my-registration`"
            class="h-11 px-6 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Icon icon="ph:ticket-bold" class="text-base" />
            <span>{{ t('archer_payment_detail.view_ticket_roster') }}</span>
            <Icon icon="ph:arrow-right-bold" class="text-xs" />
          </NuxtLink>
        </div>
      </div>

      <!-- Prominent Gateway Action Banner (PayPal / Mayar) when Pending -->
      <div
        v-else-if="!isPaid(payment.status) && payment.checkout_url"
        class="p-5 sm:p-6 bg-gradient-to-r from-navy via-navy-dark to-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-navy/30 shadow-md relative overflow-hidden"
      >
        <div class="space-y-1.5 z-10">
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-400 text-navy font-bold text-xs">
              {{ t('payment_status.badge_pending') }}
            </span>
            <span class="text-xs sm:text-sm text-slate-300 font-bold">
              {{ formatPaymentMethodName(payment.payment_method) }}
            </span>
          </div>
          <div class="text-lg sm:text-xl font-black text-white">
            {{ gatewayHeading }}
          </div>
          <div class="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
            {{ gatewayDesc }}
          </div>
        </div>

        <a
          :href="payment.checkout_url"
          target="_blank"
          rel="noopener noreferrer"
          class="h-11 px-6 rounded-xl bg-primary hover:bg-primary/90 text-navy font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shrink-0 cursor-pointer w-full md:w-auto z-10"
        >
          <Icon :icon="isPayPal ? 'logos:paypal' : 'ph:credit-card-bold'" class="text-base" />
          <span>{{ gatewayButtonLabel }}</span>
          <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
        </a>
      </div>

      <!-- Main Receipt & Information Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 sm:p-8 space-y-6">
        
        <!-- Top Status & Total Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div class="space-y-1">
            <div class="text-xs sm:text-sm text-slate-400 font-bold">
              {{ t('archer_payment_detail.ref_number', t('payment_status.ref_number')) }}
            </div>
            <div class="flex items-center gap-2">
              <span class="font-mono text-base sm:text-xl font-black text-navy dark:text-white select-all">
                {{ payment.reference }}
              </span>
              <button
                type="button"
                @click="copyReference"
                class="text-slate-400 hover:text-navy dark:hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
                :title="t('common.copy')"
              >
                <Icon :icon="copiedRef ? 'ph:check-bold' : 'ph:copy-simple-bold'" class="text-base" :class="copiedRef ? 'text-emerald-600' : ''" />
              </button>
            </div>
          </div>

          <div class="flex items-center sm:items-end gap-3 sm:flex-col">
            <span
              class="text-xs sm:text-sm font-bold px-3 py-1 rounded-full border shadow-2xs inline-flex items-center gap-1.5"
              :class="getStatusBadgeClass(payment.status)"
            >
              <span class="size-2 rounded-full" :class="getStatusDotClass(payment.status)"></span>
              <span>{{ getStatusLabel(payment.status) }}</span>
            </span>
            <div class="text-2xl sm:text-3xl font-black text-navy dark:text-white tabular-nums">
              {{ isFree ? formatCurrency(0) : formatCurrency(payment.total_amount || payment.amount) }}
            </div>
          </div>
        </div>

        <!-- 2-Column Clean Key-Value Info Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-xs sm:text-sm">
          <div>
            <span class="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">{{ t('archer_payment_detail.item_event_name') }}</span>
            <span class="text-sm sm:text-base text-navy dark:text-white font-bold block leading-snug">
              {{ payment.event_name || payment.plan_name || payment.description || '-' }}
            </span>
          </div>

          <div v-if="payment.registered_by_name || payment.payer_name">
            <span class="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">{{ t('participant.detail.payer_label', 'Akun Pendaftar') }}</span>
            <span class="text-sm sm:text-base text-navy dark:text-white font-bold block">
              {{ payment.registered_by_name || payment.payer_name }}
              <span v-if="payment.registered_by_email" class="text-xs sm:text-sm text-slate-400 font-normal">({{ payment.registered_by_email }})</span>
            </span>
          </div>

          <div>
            <span class="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">{{ t('archer_payment_detail.payment_method') }}</span>
            <span class="text-sm sm:text-base text-navy dark:text-white font-bold block">
              {{ formatPaymentMethodName(payment.payment_method) }}
              <span v-if="payment.payment_channel && !isFree" class="text-xs sm:text-sm text-slate-400 font-normal">({{ payment.payment_channel }})</span>
            </span>
          </div>

          <div>
            <span class="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">{{ t('archer_payment_detail.transaction_date') }}</span>
            <span class="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium block">
              {{ formatDateTime(payment.created_at) }}
            </span>
          </div>

          <div v-if="payment.paid_at">
            <span class="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">{{ t('archer_payment_detail.paid_at') }}</span>
            <span class="text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-bold block">
              {{ formatDateTime(payment.paid_at) }}
            </span>
          </div>

          <div v-else-if="payment.expired_at">
            <span class="text-xs text-slate-400 font-bold block mb-1 uppercase tracking-wider">{{ t('payment_status.pay_before') }}</span>
            <span class="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium block">
              {{ formatDateTime(payment.expired_at) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Section: Separated Card for Registered Participants & Categories -->
      <div v-if="payment.participants && payment.participants.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
        <!-- Card Header with Toolbar -->
        <div class="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <Icon icon="ph:users-three-bold" class="text-xl" />
            </div>
            <div>
              <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
                {{ t('archer_payment_detail.participants_count', { count: payment.participants.length }, `Registered Participants & Categories (${payment.participants.length})`) }}
              </h3>
              <div class="text-xs sm:text-sm text-slate-400 mt-0.5">{{ t('archer_payment_detail.roster_title') }}</div>
            </div>
          </div>

          <!-- Search Input Bar -->
          <div class="flex items-center gap-3 w-full sm:w-auto">
            <div class="relative flex-1 sm:w-64">
              <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                v-model="participantSearch"
                type="text"
                :placeholder="t('common.search') || 'Cari nama, klub, kategori...'"
                class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs sm:text-sm text-navy dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy/20 transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Table Container -->
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm border-collapse">
            <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th scope="col" class="py-3.5 px-4 text-center w-12 text-slate-400">#</th>
                <th
                  scope="col"
                  @click="handleParticipantSort('athlete_name')"
                  class="py-3.5 px-4 cursor-pointer hover:text-navy dark:hover:text-white transition-colors select-none"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ t('archer_payment_detail.th_athlete_name') }}</span>
                    <Icon icon="ph:caret-up-down" class="text-xs opacity-40" />
                  </div>
                </th>
                <th
                  scope="col"
                  @click="handleParticipantSort('club_name')"
                  class="py-3.5 px-4 cursor-pointer hover:text-navy dark:hover:text-white transition-colors select-none"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ t('archer_payment_detail.th_club') }}</span>
                    <Icon icon="ph:caret-up-down" class="text-xs opacity-40" />
                  </div>
                </th>
                <th
                  scope="col"
                  @click="handleParticipantSort('category_name')"
                  class="py-3.5 px-4 cursor-pointer hover:text-navy dark:hover:text-white transition-colors select-none"
                >
                  <div class="flex items-center gap-1.5">
                    <span>{{ t('archer_payment_detail.th_category') }}</span>
                    <Icon icon="ph:caret-up-down" class="text-xs opacity-40" />
                  </div>
                </th>
                <th
                  scope="col"
                  @click="handleParticipantSort('payment_amount')"
                  class="py-3.5 px-4 text-right cursor-pointer hover:text-navy dark:hover:text-white transition-colors select-none"
                >
                  <div class="flex items-center justify-end gap-1.5">
                    <span>{{ t('archer_payment_detail.th_fee') }}</span>
                    <Icon icon="ph:caret-up-down" class="text-xs opacity-40" />
                  </div>
                </th>
                <th scope="col" class="py-3.5 px-4 text-center">{{ t('archer_payment_detail.th_status') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-200">
              <tr
                v-for="(p, pIdx) in paginatedParticipants"
                :key="p.uuid || pIdx"
                class="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors"
              >
                <td class="py-3.5 px-4 text-center text-slate-400 font-mono">
                  {{ (participantCurrentPage - 1) * participantPerPage + pIdx + 1 }}
                </td>
                <td class="py-3.5 px-4">
                  <div class="flex items-center gap-2.5">
                    <div class="size-8 rounded-xl bg-navy/5 dark:bg-slate-700 flex items-center justify-center font-black text-navy dark:text-primary text-xs shrink-0">
                      {{ (p.athlete_name || p.archer_name || 'P').charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-bold text-navy dark:text-white">{{ p.athlete_name || p.archer_name }}</div>
                      <span v-if="p.gender" class="text-xs text-slate-400 font-normal capitalize">
                        {{ p.gender === 'male' ? 'Putra' : (p.gender === 'female' ? 'Putri' : p.gender) }}
                      </span>
                    </div>
                  </div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="font-semibold text-slate-600 dark:text-slate-300">{{ p.club_name || '-' }}</span>
                </td>
                <td class="py-3.5 px-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs">
                    <Icon icon="ph:crosshair-bold" class="text-xs text-slate-500" />
                    <span>{{ p.category_name || '-' }}</span>
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right font-black tabular-nums text-navy dark:text-white">
                  {{ Number(p.payment_amount || p.cost || 0) === 0 ? t('common.free') : formatCurrency(p.payment_amount || p.cost) }}
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                    :class="isPaid(p.payment_status || payment.status) ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'"
                  >
                    <span class="size-1.5 rounded-full" :class="isPaid(p.payment_status || payment.status) ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                    <span>{{ isPaid(p.payment_status || payment.status) ? t('archer_payment_detail.status_registered') : t('archer_payment_detail.status_waiting') }}</span>
                  </span>
                </td>
              </tr>
              <tr v-if="paginatedParticipants.length === 0">
                <td colspan="6" class="py-8 text-center text-slate-400 italic">
                  {{ t('org_event_payments.no_athletes') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer / Pagination -->
        <div class="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
          <div>
            Menampilkan {{ (participantCurrentPage - 1) * participantPerPage + (paginatedParticipants.length > 0 ? 1 : 0) }} - {{ Math.min(participantCurrentPage * participantPerPage, filteredParticipants.length) }} dari {{ filteredParticipants.length }} atlet
          </div>
          <div v-if="totalParticipantPages > 1" class="flex items-center gap-2">
            <button
              type="button"
              @click="participantCurrentPage = Math.max(1, participantCurrentPage - 1)"
              :disabled="participantCurrentPage <= 1"
              class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-colors cursor-pointer"
            >
              {{ t('common.previous') || 'Sebelumnya' }}
            </button>
            <span class="px-2 font-bold text-navy dark:text-white">
              {{ participantCurrentPage }} / {{ totalParticipantPages }}
            </span>
            <button
              type="button"
              @click="participantCurrentPage = Math.min(totalParticipantPages, participantCurrentPage + 1)"
              :disabled="participantCurrentPage >= totalParticipantPages"
              class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-colors cursor-pointer"
            >
              {{ t('common.next') || 'Selanjutnya' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Section: Separated Card for Team Reservations (If Any) -->
      <div v-if="payment.teams && payment.teams.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
        <div class="p-5 sm:p-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <Icon icon="ph:shield-bold" class="text-xl" />
            </div>
            <div>
              <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
                {{ t('org_event_payments.team_quota_title') }} ({{ payment.teams.length }})
              </h3>
              <div class="text-xs sm:text-sm text-slate-400 mt-0.5">{{ t('org_event_payments.team_quota_subtitle') }}</div>
            </div>
          </div>
          <span class="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100">
            {{ payment.teams.length }} {{ t('org_event_payments.th_club') }}
          </span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs sm:text-sm border-collapse">
            <thead class="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th scope="col" class="py-3 px-4 w-12 text-center text-slate-400">#</th>
                <th scope="col" class="py-3 px-4">{{ t('org_event_payments.th_athlete_name') }}</th>
                <th scope="col" class="py-3 px-4">{{ t('org_event_payments.th_competition_category') }}</th>
                <th scope="col" class="py-3 px-4 text-center">{{ t('org_event_payments.th_slot') }}</th>
                <th scope="col" class="py-3 px-4 text-right">{{ t('org_event_payments.th_fee') }}</th>
                <th scope="col" class="py-3 px-4 text-center">{{ t('archer_payment_detail.th_status') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-700 font-medium text-slate-700 dark:text-slate-200">
              <tr v-for="(tm, tmIdx) in payment.teams" :key="tm.uuid || tmIdx" class="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                <td class="py-3.5 px-4 text-center text-slate-400 font-mono">{{ tmIdx + 1 }}</td>
                <td class="py-3.5 px-4">
                  <div class="font-bold text-navy dark:text-white">{{ tm.team_name || 'Tim Beregu' }}</div>
                  <div class="text-xs text-slate-400">{{ tm.club_name || payment.club_name || '-' }}</div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                    <Icon icon="ph:users-three-bold" class="text-xs" />
                    <span>{{ tm.category_name || '-' }}</span>
                  </span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    {{ tm.member_count || 1 }} Slot
                  </span>
                </td>
                <td class="py-3.5 px-4 text-right font-black tabular-nums text-navy dark:text-white">
                  {{ Number(tm.fee || 0) === 0 ? t('common.free') : formatCurrency(tm.fee) }}
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span
                    class="px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5"
                    :class="isPaid(payment.status) ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'"
                  >
                    <span class="size-1.5 rounded-full" :class="isPaid(payment.status) ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                    <span>{{ isPaid(payment.status) ? 'Terkonfirmasi' : 'Menunggu' }}</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Section: Invoice Summary Calculation Card -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6 space-y-4">
        <div class="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div class="size-10 rounded-xl bg-primary text-btn-text flex items-center justify-center shrink-0 shadow-2xs font-bold">
            <Icon icon="ph:calculator-bold" class="text-xl" />
          </div>
          <div>
            <h3 class="font-bold text-base sm:text-lg text-navy dark:text-white">
              {{ t('org_event_payments.calculation_title') }}
            </h3>
          </div>
        </div>

        <div class="space-y-3 text-xs sm:text-sm">
          <div v-if="payment.participants && payment.participants.length > 0" class="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>{{ t('org_event_payments.subtotal_individual', { count: payment.participants.length }) }}</span>
            <span class="font-bold text-navy dark:text-white tabular-nums">
              {{ formatCurrency((payment.participants.reduce((acc, p) => acc + Number(p.payment_amount || p.cost || 0), 0))) }}
            </span>
          </div>

          <div v-if="payment.teams && payment.teams.length > 0" class="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>{{ t('org_event_payments.subtotal_team', { count: payment.teams.length }) }}</span>
            <span class="font-bold text-navy dark:text-white tabular-nums">
              {{ formatCurrency((payment.teams.reduce((acc, tm) => acc + Number(tm.fee || 0), 0))) }}
            </span>
          </div>

          <div v-if="payment.fee_amount && payment.fee_amount > 0" class="flex items-center justify-between text-slate-600 dark:text-slate-300">
            <span>{{ t('org_event_payments.service_fee') }}</span>
            <span class="font-bold text-navy dark:text-white tabular-nums">
              {{ formatCurrency(payment.fee_amount) }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-3.5 border-t border-dashed border-slate-200 dark:border-slate-600 text-sm sm:text-base font-black text-navy dark:text-white">
            <span>{{ isPaid(payment.status) ? t('payment_status.total_paid') : t('org_event_payments.total_bill') }}</span>
            <span class="text-xl sm:text-2xl text-navy dark:text-white tabular-nums">
              {{ formatCurrency(payment.total_amount || payment.amount || 0) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Section: Transfer Proof & Upload Box (If Manual Payment) -->
      <div v-if="isManualMethod" class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5 sm:p-6 space-y-4">
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

        <!-- Current Proof Display -->
        <div v-if="payment.proof_url" class="p-4 sm:p-5 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div class="relative group cursor-pointer shrink-0" @click="openImageModal(payment.proof_url)">
            <img :src="payment.proof_url" alt="Bukti Transfer" class="h-24 w-36 object-cover rounded-xl border border-slate-200 shadow-2xs group-hover:opacity-90 transition-opacity" />
            <div class="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs sm:text-sm font-bold gap-1.5">
              <Icon icon="ph:magnifying-glass-plus-bold" class="size-4 text-primary" />
              <span>{{ t('payment_status.zoom_proof') }}</span>
            </div>
          </div>

          <div class="flex-1 min-w-0 space-y-1.5 text-xs sm:text-sm">
            <div v-if="payment.sender_name" class="flex items-center gap-2">
              <span class="text-slate-500 font-medium">{{ t('archer_payments_list.sender_name') }}</span>
              <span class="font-bold text-navy dark:text-white text-sm sm:text-base">{{ payment.sender_name }}</span>
            </div>
            <div v-if="payment.proof_uploaded_at" class="flex items-center gap-2">
              <span class="text-slate-500 font-medium">{{ t('payment_status.proof_uploaded_time') }}</span>
              <span class="font-medium text-slate-700 dark:text-slate-300 font-mono">{{ formatDateTime(payment.proof_uploaded_at) }}</span>
            </div>
            <div class="text-slate-500 pt-1 font-medium">
              {{ isPaid(payment.status) ? t('archer_payment_detail.proof_verified_note') : payment.status === 'rejected' ? t('archer_payment_detail.proof_rejected_note') : t('payment_status.manual_verif_desc') }}
            </div>
          </div>
        </div>

        <!-- Re-upload Form when Pending or Rejected -->
        <div v-if="['pending', 'rejected'].includes((payment.status || '').toLowerCase())" class="mt-4 p-5 sm:p-6 bg-slate-50 dark:bg-slate-700/30 rounded-2xl border border-slate-200 dark:border-slate-600 space-y-4">
          <div class="flex items-center justify-between">
            <div class="text-sm font-black text-navy dark:text-white flex items-center gap-2">
              <Icon icon="ph:upload-simple-bold" class="text-base text-primary" />
              <span>{{ payment.status === 'rejected' ? t('archer_payment_detail.reupload_title') : t('archer_payment_detail.upload_proof_title') }}</span>
            </div>
            <span class="text-xs text-slate-400">{{ t('archer_payment_detail.file_format_hint') }}</span>
          </div>

          <!-- Sender Account Name Input -->
          <div>
            <label class="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {{ t('archer_payment_detail.sender_name_label') }} <span class="text-rose-500">*</span>
            </label>
            <input
              v-model="reuploadSenderName"
              type="text"
              :placeholder="t('archer_payment_detail.sender_name_placeholder')"
              class="w-full h-11 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-navy/20" />
          </div>

          <!-- Dropzone / Picker -->
          <div
            @click="triggerReuploadFileInput"
            class="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2 bg-white dark:bg-slate-800 border-slate-300 hover:border-navy">
            <input
              ref="reuploadFileInputRef"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleReuploadFileChange" />

            <div v-if="reuploadPreviewUrl" class="relative group">
              <img :src="reuploadPreviewUrl" alt="Preview Struk" class="h-32 object-contain rounded-xl border shadow-xs mx-auto" />
              <div class="text-xs sm:text-sm font-bold text-emerald-600 mt-2 flex items-center gap-1.5 justify-center">
                <Icon icon="ph:check-circle-bold" class="text-base" />
                <span>{{ t('archer_payment_detail.file_ready_hint') }}</span>
              </div>
            </div>
            <div v-else class="flex flex-col items-center gap-1.5 text-slate-500">
              <div class="size-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-navy dark:text-primary">
                <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl" />
              </div>
              <span class="text-xs sm:text-sm font-bold text-navy dark:text-slate-200">{{ t('archer_payment_detail.click_to_select_file') }}</span>
              <span class="text-xs text-slate-400">{{ t('archer_payment_detail.receipt_clarity_hint') }}</span>
            </div>
          </div>

          <!-- Submit Button -->
          <BaseButton
            @click="submitReuploadProof"
            :disabled="!reuploadFileUrl || !reuploadSenderName.trim() || isReuploading"
            :loading="isReuploading"
            variant="navy"
            class="w-full justify-center text-xs sm:text-sm font-bold shadow-xs py-2.5">
            <Icon icon="ph:paper-plane-right-bold" class="mr-2 text-base text-primary" />
            {{ payment.status === 'rejected' ? t('archer_payment_detail.reupload_submit_btn') : t('archer_payment_detail.upload_submit_btn') }}
          </BaseButton>
        </div>
      </div>

      <!-- Section: Separated Card for Payment Activity & Status Timeline -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <PaymentActivityTimeline
          :payment="payment"
          :format-currency="formatCurrency"
          :format-date-time="formatDateTime"
        />
      </div>

      <!-- Cancel Transaction Action (only for pending or awaiting_verification) -->
      <div v-if="!isPaid(payment.status) && ['pending', 'awaiting_verification'].includes((payment.status || '').toLowerCase())" class="flex justify-end pt-2">
        <button
          type="button"
          @click="showCancelModal = true"
          class="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <Icon icon="ph:prohibit-bold" class="text-base" />
          <span>{{ t('archer_payment_detail.cancel_tx_btn') }}</span>
        </button>
      </div>

    </div>

    <!-- Cancel Transaction Modal -->
    <div
      v-if="showCancelModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showCancelModal = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-3 mb-3">
          <div class="size-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Icon icon="ph:warning-circle-bold" class="size-5" />
          </div>
          <div>
            <h4 class="font-bold text-navy dark:text-white text-base sm:text-lg">{{ t('archer_payment_detail.cancel_modal_title') }}</h4>
            <div class="text-xs text-slate-400">{{ reference }}</div>
          </div>
        </div>

        <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
          {{ t('archer_payment_detail.cancel_modal_desc') }}
        </div>

        <div class="flex justify-end gap-2.5">
          <button
            @click="showCancelModal = false"
            class="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            {{ t('common.back') }}
          </button>
          <button
            @click="cancelTransaction"
            :disabled="isCancelling"
            class="px-5 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Icon v-if="isCancelling" icon="ph:spinner-bold" class="size-3.5 animate-spin" />
            <span>{{ t('archer_payment_detail.cancel_confirm_btn') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Image Preview Lightbox Modal -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
      @click.self="showImageModal = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700">
        <div class="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <h4 class="font-bold text-sm sm:text-base text-navy dark:text-white">{{ t('archer_payments_list.proof_of_payment') }}</h4>
            <div class="text-xs text-slate-400">{{ reference }} &bull; {{ payment?.sender_name || payment?.payer_name }}</div>
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
            alt="Bukti Transfer"
            class="max-w-full max-h-[65vh] object-contain rounded-xl shadow-md"
          />
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs sm:text-sm">
          <div class="text-slate-500 dark:text-slate-400">
            {{ t('archer_payments_list.sender_name') }} <strong>{{ payment?.sender_name || payment?.payer_name || t('org_event_payments.not_provided') }}</strong>
          </div>
          <a
            :href="selectedImageUrl"
            target="_blank"
            class="text-navy dark:text-slate-200 hover:underline font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>{{ t('org_event_payments.open_original') }}</span>
            <Icon icon="ph:arrow-square-out-bold" class="size-4 text-primary" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>