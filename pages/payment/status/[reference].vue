<template>
  <div class="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden font-sans antialiased text-slate-800">
    <!-- Ambient Background Lighting & Motif -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute top-1/3 -left-40 size-[400px] rounded-full bg-amber-400/10 blur-3xl"></div>
      <div class="absolute -bottom-40 right-1/4 size-[450px] rounded-full bg-navy/5 blur-3xl"></div>
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.08);"></div>
      <div class="absolute inset-0 opacity-[0.02]"
        style="background-image: radial-gradient(circle at 1px 1px, #051923 1px, transparent 0); background-size: 24px 24px;"></div>
    </div>

    <!-- App Global Header -->
    <LayoutAppHeaderDynamic />

    <!-- Main Content Container -->
    <main class="relative z-10 flex-grow pt-24 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md w-full shadow-xs">
        <Icon icon="ph:spinner-gap-bold" class="text-3xl text-slate-600 animate-spin mb-3 mx-auto" />
        <div class="text-slate-600 font-bold text-xs">{{ t('payment_status.loading_status', 'Memuat Status Pembayaran...') }}</div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMsg" class="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-center shadow-xs space-y-4">
        <div class="size-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mx-auto border border-red-100">
          <Icon icon="ph:warning-circle-bold" class="text-2xl" />
        </div>
        <div>
          <h2 class="text-base font-bold text-slate-900">{{ t('payment_status.not_found_title', 'Transaksi Tidak Ditemukan') }}</h2>
          <div class="text-slate-500 text-xs font-medium mt-1 leading-relaxed">{{ errorMsg }}</div>
        </div>
        <BaseButton :to="dashboardBackUrl" variant="navy" size="md" class="w-full justify-center text-xs font-bold">
          {{ dashboardBackLabel }}
        </BaseButton>
      </div>

      <!-- Main Container -->
      <div v-else class="max-w-xl w-full space-y-6 relative z-10">

        <!-- Signature Navy Status Header Banner -->
        <div
          class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
          <!-- Theme Motif Pattern -->
          <div class="absolute inset-0"
            style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
          </div>

          <!-- Decorative Glow Orbs -->
          <div class="absolute -top-10 -left-10 h-36 w-36 rounded-full bg-primary/15 blur-2xl"></div>
          <div class="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-primary/10 blur-2xl"></div>
          <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

          <!-- Header Content -->
          <div class="relative p-6 sm:p-7">
            <div class="flex items-start gap-4">
              <!-- Icon Badge -->
              <div
                class="size-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 shadow-md"
                :class="isPaidState ? 'text-emerald-400' : (statusTitleText.includes('Verifikasi') ? 'text-primary' : 'text-amber-400')">
                <Icon :icon="statusIconName" class="text-2xl" />
              </div>

              <div class="space-y-1 min-w-0 flex-1">
                <!-- Reference & Status Tag -->
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <span class="font-mono text-xs font-bold text-white/90 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/20 select-all">
                    {{ tx.reference }}
                  </span>
                  <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs"
                    :class="isPaidState ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : (statusTitleText.includes('Verifikasi') ? 'bg-blue-500/20 text-blue-200 border-blue-400/30' : 'bg-amber-500/20 text-amber-200 border-amber-400/30')">
                    {{ statusBadgeText }}
                  </span>
                </div>

                <h1 class="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {{ statusTitleText }}
                </h1>
                <div class="text-xs text-slate-300 font-medium leading-relaxed">
                  {{ statusDescText }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Clean Invoice Card Body -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">

          <!-- Direct Online Checkout Cards (Only if applicable) -->
          <!-- PayPal Card -->
          <div v-if="isPendingState && isRealCheckoutUrl(tx.checkout_url) && tx.payment_method === 'paypal'"
            class="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <Icon icon="logos:paypal" class="text-2xl" />
                <div>
                  <div class="text-sm font-bold text-slate-900">
                    {{ t('package_detail.pay_via_paypal_title', 'Selesaikan Pembayaran via PayPal') }}
                  </div>
                  <div class="text-xs text-slate-500 mt-0.5">
                    {{ t('package_detail.pay_via_paypal_desc', 'Bayar aman menggunakan saldo PayPal atau Kartu Kredit Internasional.') }}
                  </div>
                </div>
              </div>
              <span class="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shrink-0">
                ~${{ (Math.ceil(((tx.total_amount || tx.amount || 0) / 16000) * 100) / 100).toFixed(2) }} USD
              </span>
            </div>

            <a :href="tx.checkout_url" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer">
              <Icon icon="logos:paypal" class="text-base" />
              <span>{{ t('package_detail.btn_pay_now_paypal', 'Bayar Sekarang di PayPal') }}</span>
            </a>
          </div>

          <!-- Mayar Online Card -->
          <div v-else-if="isPendingState && isRealCheckoutUrl(tx.checkout_url)"
            class="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
            <div class="flex items-center gap-3">
              <div class="size-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center p-1 shrink-0">
                <img src="/mayar-logo.png" alt="Mayar" class="w-full h-full object-contain" />
              </div>
              <div>
                <div class="text-sm font-bold text-slate-900">
                  {{ t('payment_status.pay_via_mayar_title', 'Selesaikan Pembayaran Online') }}
                </div>
                <div class="text-xs text-slate-500 mt-0.5">
                  {{ t('payment_status.pay_via_mayar_desc', 'Pilih QRIS atau Virtual Account bank di portal pembayaran.') }}
                </div>
              </div>
            </div>

            <a :href="tx.checkout_url" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer">
              <Icon icon="ph:arrow-square-out-bold" class="text-base" />
              <span>{{ t('payment_status.btn_pay_now_mayar', 'Bayar Sekarang') }}</span>
            </a>
          </div>

          <!-- Section 1: Transaction Context Details -->
          <div class="space-y-2.5">
            <h2 class="text-xs font-bold text-slate-400 capitalize">
              {{ t('payment_status.transaction_details_title', 'Rincian Transaksi') }}
            </h2>

            <div class="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <!-- Keperluan Transaksi -->
              <div class="p-3.5 flex justify-between items-center bg-slate-50/50">
                <span class="text-slate-500 font-medium">{{ t('payment_status.transaction_purpose', 'Keperluan Transaksi') }}</span>
                <span class="font-bold text-slate-900">{{ transactionPurposeLabel }}</span>
              </div>

              <!-- Item / Event / Paket -->
              <div class="p-3.5 flex justify-between items-center">
                <span class="text-slate-500 font-medium">{{ t('payment_status.item_description', 'Item / Event / Paket') }}</span>
                <span class="font-bold text-slate-900 text-right">{{ tx.event_name || tx.plan_name || tx.description || '-' }}</span>
              </div>

              <!-- Atlet (jika registrasi) -->
              <div v-if="tx.athlete_name" class="p-3.5 flex justify-between items-center bg-slate-50/50">
                <span class="text-slate-500 font-medium">{{ t('payment_status.athlete_name', 'Nama Atlet') }}</span>
                <span class="font-bold text-slate-900">{{ tx.athlete_name }}</span>
              </div>

              <!-- Kategori (jika ada) -->
              <div v-if="tx.division || tx.category" class="p-3.5 flex justify-between items-center">
                <span class="text-slate-500 font-medium">{{ t('payment_status.competition_category', 'Kategori Turnamen') }}</span>
                <span class="font-bold text-slate-900 text-right">
                  {{ tx.division || '' }} {{ tx.category ? ` • ${tx.category}` : '' }}
                </span>
              </div>

              <!-- Waktu Dibuat -->
              <div class="p-3.5 flex justify-between items-center bg-slate-50/50">
                <span class="text-slate-500 font-medium">{{ t('payment_status.created_at_label', 'Waktu Transaksi Dibuat') }}</span>
                <span class="font-semibold text-slate-700">{{ formatDateTime(tx.created_at) }}</span>
              </div>

              <!-- Batas Waktu jika pending -->
              <div v-if="isPendingState && tx.expired_at" class="p-3.5 flex justify-between items-center">
                <span class="text-slate-500 font-medium">{{ t('payment_status.pay_before', 'Batas Waktu Pembayaran') }}</span>
                <span class="font-bold text-slate-900">{{ formatDateTime(tx.expired_at) }}</span>
              </div>

              <!-- Metode & Kanal -->
              <div class="p-3.5 flex justify-between items-center bg-slate-50/50">
                <span class="text-slate-500 font-medium">{{ t('payment_status.payment_method', 'Metode Pembayaran') }}</span>
                <span class="font-bold text-slate-900">{{ formatPaymentMethodName(tx.payment_method) }}</span>
              </div>

              <div class="p-3.5 flex justify-between items-center">
                <span class="text-slate-500 font-medium">{{ t('payment_status.payment_channel', 'Kanal Pembayaran') }}</span>
                <span class="font-bold text-slate-900">{{ formatChannelName(tx) }}</span>
              </div>
            </div>
          </div>

          <!-- Section 2: Bukti Pembayaran Transfer (Clean - No Chips) -->
          <div v-if="tx.proof_url" class="space-y-2.5">
            <h2 class="text-xs font-bold text-slate-400 capitalize">
              {{ t('payment_status.view_proof_receipt', 'Bukti Transfer Pembayaran') }}
            </h2>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div class="relative group cursor-pointer shrink-0" @click="openImageModal(tx.proof_url)">
                <img :src="tx.proof_url" alt="Bukti Transfer" class="h-20 w-32 object-cover rounded-lg border border-slate-200 shadow-2xs" />
                <div class="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Icon icon="ph:magnifying-glass-plus-bold" />
                  <span>Zoom</span>
                </div>
              </div>

              <div class="flex-1 min-w-0 space-y-1 text-xs">
                <div v-if="tx.sender_name" class="flex items-center gap-2">
                  <span class="text-slate-500 font-medium">{{ t('payment_status.sender_name_label', 'Nama Rekening Pengirim:') }}</span>
                  <span class="font-bold text-slate-900">{{ tx.sender_name }}</span>
                </div>
                <div v-if="tx.proof_uploaded_at" class="flex items-center gap-2">
                  <span class="text-slate-500 font-medium">{{ t('payment_status.proof_uploaded_time', 'Waktu Unggah Bukti:') }}</span>
                  <span class="font-semibold text-slate-700">{{ formatDateTime(tx.proof_uploaded_at) }}</span>
                </div>
                <div class="text-slate-400 text-[11px] pt-0.5">
                  {{ t('payment_status.manual_verif_desc', 'Penyelenggara akan memverifikasi bukti transfer Anda.') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Pending Manual Upload Form (If manual and no proof uploaded yet) -->
          <div v-else-if="isPendingState && tx.payment_method === 'manual'" class="space-y-2.5">
            <h2 class="text-xs font-bold text-slate-400 capitalize">
              {{ t('payment_status.upload_manual_proof_title', 'Unggah Bukti Transfer Manual') }}
            </h2>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div class="space-y-1">
                <label class="text-xs font-medium text-slate-600 block">{{ t('payment_status.sender_account_name', 'Nama Pemilik Rekening Pengirim') }}</label>
                <input type="text" v-model="manualSenderName"
                  class="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 bg-white"
                  :placeholder="t('payment_status.sender_placeholder', 'Contoh: Muhammad Angger')" />
              </div>

              <div @click="triggerProofInput"
                class="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-white bg-slate-50"
                :class="manualProofUrl ? 'border-emerald-400 bg-emerald-50/20' : 'border-slate-200'">
                <input type="file" ref="proofFileInput" class="hidden" accept="image/*" @change="handleManualProofFile" />
                <template v-if="isUploadingProof">
                  <Icon icon="ph:circle-notch-bold" class="text-xl text-slate-700 animate-spin mb-1" />
                  <span class="text-xs text-slate-500 font-medium">{{ t('payment_status.uploading_proof', 'Mengunggah bukti...') }}</span>
                </template>
                <template v-else-if="manualProofUrl">
                  <img :src="manualProofUrl" class="max-h-24 object-contain rounded-lg mb-1 border border-slate-200" />
                  <span class="text-xs text-emerald-700 font-bold">{{ t('payment_status.proof_selected', 'Bukti Terpilih ✓') }}</span>
                </template>
                <template v-else>
                  <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl text-slate-400 mb-1" />
                  <span class="text-xs text-slate-600 font-medium">{{ t('payment_status.click_select_proof', 'Klik untuk Pilih Foto Bukti Transfer') }}</span>
                </template>
              </div>

              <BaseButton variant="primary" block :loading="isSubmittingManualProof" class="h-10 text-xs font-bold justify-center" @click="submitProof">
                {{ t('payment_status.submit_proof', 'Kirim Bukti Pembayaran') }}
              </BaseButton>

              <div v-if="manualUploadError" class="text-xs text-red-500 font-semibold text-center">{{ manualUploadError }}</div>
            </div>
          </div>

          <!-- Section 3: Cost Breakdown Itemization -->
          <div class="space-y-2.5">
            <h2 class="text-xs font-bold text-slate-400 capitalize">
              {{ t('payment_status.invoice_summary_title', 'Rincian Biaya') }}
            </h2>

            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
              <div class="flex justify-between items-center text-slate-600">
                <span>{{ t('payment_status.subtotal_fee', 'Biaya Pokok') }}</span>
                <span class="font-bold text-slate-900">Rp {{ formatNumber(tx.amount) }}</span>
              </div>

              <div v-if="tx.fee_amount > 0" class="flex justify-between items-center text-slate-600">
                <span>{{ t('payment_status.admin_fee', 'Biaya Layanan / Admin') }}</span>
                <span class="font-bold text-slate-900">Rp {{ formatNumber(tx.fee_amount) }}</span>
              </div>

              <div class="pt-2 border-t border-slate-200 flex justify-between items-center">
                <span class="text-xs font-bold text-slate-900 capitalize">{{ t('payment_status.total_paid', 'Total Tagihan') }}</span>
                <span class="text-lg font-black text-slate-900 tabular-nums">Rp {{ formatNumber(tx.total_amount || tx.amount) }}</span>
              </div>
            </div>
          </div>

          <!-- Section 4: Action Buttons -->
          <div class="space-y-2.5 pt-2">
            <BaseButton :to="dashboardBackUrl" variant="navy" size="md" class="w-full justify-center font-bold text-xs">
              {{ dashboardBackLabel }}
            </BaseButton>

            <a v-if="isPaidState" :href="getInvoiceUrl(tx.reference)" target="_blank"
              class="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-colors">
              <Icon icon="ph:file-pdf" class="text-base text-red-500" />
              <span>{{ t('payment_status.download_invoice', 'Unduh Invoice Resmi (PDF)') }}</span>
            </a>
          </div>

        </div>
      </div>
    </main>

    <!-- Simple Image Preview Lightbox Modal -->
    <ClientOnly>
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <div v-if="showImageModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
            <!-- Dark Backdrop -->
            <div @click="showImageModal = false" class="absolute inset-0 bg-slate-900/80 backdrop-blur-xs transition-opacity"></div>

            <!-- Simple Lightbox Card -->
            <div class="relative z-10 bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden space-y-3 p-4 sm:p-5">
              <!-- Top Header Bar -->
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Icon icon="ph:receipt-bold" class="text-slate-500 text-base" />
                  <span>{{ t('payment_status.proof_dialog_title', 'Bukti Transfer') }}</span>
                </div>
                <button type="button" @click="showImageModal = false"
                  class="size-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer">
                  <Icon icon="ph:x-bold" class="text-xs" />
                </button>
              </div>

              <!-- Image Display -->
              <div class="flex items-center justify-center bg-slate-50 rounded-xl p-2 border border-slate-100 overflow-hidden">
                <img :src="selectedImageUrl" alt="Bukti Transfer" class="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xs" />
              </div>

              <!-- Footer with direct open -->
              <div class="flex items-center justify-between pt-1 text-xs">
                <a :href="selectedImageUrl" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                  <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                  <span>{{ t('payment_status.open_full_size', 'Buka Ukuran Penuh') }}</span>
                </a>
                <button type="button" @click="showImageModal = false"
                  class="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer">
                  {{ t('common.close', 'Tutup') }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>

    <!-- App Global Footer -->
    <LayoutAppFooter />
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from '#app'
import { usePayment } from '~/composables/usePayment'
import { useRuntimeConfig } from '#imports'
import { useApi } from '~/composables/useApi'

const { t } = useI18n()

definePageMeta({
    layout: 'blank'
})

useHead({ title: computed(() => t('payment_status.status_title', 'Status Pembayaran') + ' - Archeris') })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const reference = route.params.reference
const payment = usePayment()
const { userPersona } = useAuth()
const { post, upload } = useApi()

const dashboardBackUrl = computed(() => {
    if (reference?.startsWith('QUOTA-') || userPersona.value === 'organizer') {
        return '/dashboard/organizer/package'
    }
    if (userPersona.value === 'seller') {
        return '/dashboard/seller/orders'
    }
    return '/dashboard/archer/payments'
})

const dashboardBackLabel = computed(() => {
    if (reference?.startsWith('QUOTA-') || userPersona.value === 'organizer') {
        return t('payment_status.back_package', 'Kembali ke Manajemen Paket & Kuota')
    }
    if (userPersona.value === 'seller') {
        return t('payment_status.back_orders', 'Kembali ke Pesanan Toko')
    }
    return t('payment_status.back_payments', 'Kembali ke Riwayat Pembayaran')
})

const tx = ref(null)
const eventSlug = ref(null)
const isLoading = ref(true)
const errorMsg = ref('')

const showImageModal = ref(false)
const selectedImageUrl = ref('')

const openImageModal = (url) => {
    if (!url) return
    selectedImageUrl.value = url
    showImageModal.value = true
}

const proofFileInput = ref(null)
const manualSenderName = ref('')
const manualProofUrl = ref('')
const isUploadingProof = ref(false)
const isSubmittingManualProof = ref(false)
const manualUploadError = ref('')

const triggerProofInput = () => {
    proofFileInput.value?.click()
}

const handleManualProofFile = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
        manualUploadError.value = 'Ukuran file maksimal 10MB.'
        return
    }

    isUploadingProof.value = true
    manualUploadError.value = ''
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `proof-manual-${reference}-${Date.now()}`)
        const res = await upload('/media/upload', formData)
        manualProofUrl.value = res.url || res.URL || ''
    } catch (err) {
        manualUploadError.value = err?.data?.error || err?.message || 'Gagal mengunggah gambar bukti transfer.'
    } finally {
        isUploadingProof.value = false
    }
}

const submitProof = async () => {
    if (!manualProofUrl.value) {
        manualUploadError.value = 'Silakan pilih gambar bukti transfer terlebih dahulu.'
        return
    }
    isSubmittingManualProof.value = true
    manualUploadError.value = ''
    try {
        await post(`/payment/manual/${reference}/upload-proof`, {
            proof_url: manualProofUrl.value,
            sender_name: manualSenderName.value
        })
        await loadPaymentDetails()
    } catch (err) {
        manualUploadError.value = err?.data?.error || err?.message || 'Gagal mengirim bukti pembayaran.'
    } finally {
        isSubmittingManualProof.value = false
    }
}

const isPaidState = computed(() => {
    const s = (tx.value?.status || '').toLowerCase()
    return ['paid', 'lunas', 'completed', 'success'].includes(s)
})

const isPendingState = computed(() => {
    const s = (tx.value?.status || '').toLowerCase()
    return ['pending', 'unpaid', 'awaiting_verification'].includes(s)
})

const transactionPurposeLabel = computed(() => {
    if (reference?.startsWith('QUOTA-') || tx.value?.subscription_plan_id) {
        return t('payment_status.quota_package', 'Paket Kuota & Fitur Event')
    }
    if (reference?.startsWith('ORDER-')) {
        return t('payment_status.shop_order', 'Pesanan Toko Panahan')
    }
    return t('payment_status.event_registration', 'Pendaftaran Turnamen Panahan')
})

const statusIconClasses = computed(() => {
    if (isPaidState.value) return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    const s = (tx.value?.status || '').toLowerCase()
    if (s === 'awaiting_verification' || (tx.value?.payment_method === 'manual' && tx.value?.proof_url)) {
        return 'bg-blue-50 text-blue-700 border-blue-200'
    }
    if (s === 'pending' || s === 'unpaid') return 'bg-amber-50 text-amber-700 border-amber-200'
    return 'bg-red-50 text-red-700 border-red-200'
})

const statusIconName = computed(() => {
    if (isPaidState.value) return 'ph:check-circle-bold'
    const s = (tx.value?.status || '').toLowerCase()
    if (s === 'awaiting_verification' || (tx.value?.payment_method === 'manual' && tx.value?.proof_url)) {
        return 'ph:clock-bold'
    }
    if (s === 'pending' || s === 'unpaid') return 'ph:hourglass-bold'
    return 'ph:x-circle-bold'
})

const statusBadgeText = computed(() => {
    if (isPaidState.value) return t('payment_status.badge_paid', 'Lunas / Terverifikasi')
    const s = (tx.value?.status || '').toLowerCase()
    if (s === 'awaiting_verification' || (tx.value?.payment_method === 'manual' && tx.value?.proof_url)) {
        return t('payment_status.badge_awaiting_verification', 'Menunggu Verifikasi')
    }
    if (s === 'pending' || s === 'unpaid') return t('payment_status.badge_pending', 'Menunggu Pembayaran')
    return t('payment_status.badge_failed', 'Dibatalkan / Kedaluwarsa')
})

const statusTitleText = computed(() => {
    if (isPaidState.value) return t('payment_status.paid_title', 'Pembayaran Berhasil')
    const s = (tx.value?.status || '').toLowerCase()
    if (s === 'awaiting_verification' || (tx.value?.payment_method === 'manual' && tx.value?.proof_url)) {
        return t('payment_status.awaiting_verification_title', 'Menunggu Verifikasi Panitia')
    }
    if (s === 'pending' || s === 'unpaid') return t('payment_status.awaiting_payment_title', 'Menunggu Pembayaran')
    return t('payment_status.failed_title', 'Pembayaran Kedaluwarsa / Dibatalkan')
})

const statusDescText = computed(() => {
    if (isPaidState.value) {
        return t('payment_status.paid_desc', 'Terima kasih, pembayaran Anda telah diverifikasi dan dikonfirmasi secara resmi.')
    }
    const s = (tx.value?.status || '').toLowerCase()
    if (s === 'awaiting_verification' || (tx.value?.payment_method === 'manual' && tx.value?.proof_url)) {
        return t('payment_status.awaiting_verification_desc', 'Bukti transfer telah kami terima dan sedang diverifikasi oleh panitia penyelenggara.')
    }
    if (s === 'pending' || s === 'unpaid') {
        return t('payment_status.awaiting_payment_desc', 'Silakan selesaikan pembayaran Anda sebelum batas waktu kedaluwarsa berakhir.')
    }
    return t('payment_status.failed_desc', 'Transaksi telah dibatalkan atau melewati batas waktu pembayaran yang ditentukan.')
})

const isRealCheckoutUrl = (url) => {
    if (!url) return false
    if (url.includes('/payment/status/') || url.includes('localhost:3003')) return false
    return url.startsWith('http://') || url.startsWith('https://')
}

const formatTitleCase = (str) => {
    if (!str) return ''
    return str.toString().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

const formatPaymentMethodName = (method) => {
    if (!method) return '-'
    const m = method.toUpperCase()
    if (m === 'PAYPAL') return 'PayPal'
    if (m === 'MANUAL') return t('payment_status.method_manual', 'Transfer Bank Manual')
    if (m === 'MAYAR') return 'Mayar Online Gateway'
    if (m === 'GOPAY') return 'GoPay'
    if (m === 'QRIS') return 'QRIS'
    if (m.includes('BCA')) return 'BCA Virtual Account'
    if (m.includes('MANDIRI')) return 'Mandiri Virtual Account'
    if (m.includes('BNI')) return 'BNI Virtual Account'
    if (m.includes('BRI')) return 'BRI Virtual Account'
    if (m.includes('PERMATA')) return 'Permata Virtual Account'
    return formatTitleCase(method)
}

const formatChannelName = (item) => {
    if (!item) return '-'
    if (item.payment_channel) return item.payment_channel
    const m = (item.payment_method || '').toLowerCase()
    if (m === 'manual') return t('payment_status.channel_manual', 'Transfer Bank Panitia (Rekening Penyelenggara)')
    if (m === 'paypal') return 'PayPal Express Checkout (USD)'
    if (m === 'mayar') return 'QRIS / Virtual Account Multi-Bank'
    return formatPaymentMethodName(item.payment_method)
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

const formatNumber = (val) => {
    const num = Number(val)
    if (isNaN(num)) return '0'
    return new Intl.NumberFormat('id-ID').format(num)
}

const getInvoiceUrl = (ref) => {
    return `${apiBaseUrl}/payment/invoice/${ref}`
}

const loadPaymentDetails = async () => {
    isLoading.value = true
    errorMsg.value = ''
    try {
        const res = await payment.getPaymentStatus(reference)
        if (!res) {
            errorMsg.value = t('payment_status.not_found_title', 'Transaksi tidak ditemukan atau tanggapan kosong.')
            return
        }
        tx.value = res

        if (res.sender_name) {
            manualSenderName.value = res.sender_name
        }
        if (res.proof_url) {
            manualProofUrl.value = res.proof_url
        }

        if (res.event_id) {
            try {
                const eventRes = await $fetch(`${apiBaseUrl}/events/${res.event_id}`)
                if (eventRes && eventRes.slug) {
                    eventSlug.value = eventRes.slug
                }
            } catch (err) {
                console.error('Failed to fetch event slug:', err)
            }
        }
    } catch (err) {
        console.error('Failed to load payment details:', err)
        errorMsg.value = err?.data?.error || t('payment_status.not_found_title', 'Gagal memuat rincian transaksi.')
    } finally {
        isLoading.value = false
    }
}

onMounted(async () => {
    const token = route.query.token
    const payerId = route.query.PayerID
    if (token) {
        try {
            await $fetch(`${apiBaseUrl}/payment/paypal/capture`, {
                method: 'POST',
                body: { order_id: token, reference }
            })
        } catch (e) {
            console.error('PayPal auto-capture error:', e)
        }
    }

    await loadPaymentDetails()

    // Auto-poll every 5 seconds while payment is pending
    const pollingInterval = setInterval(async () => {
        if (!tx.value || tx.value.status === 'paid' || tx.value.status === 'PAID' ||
            tx.value.status === 'expired' || tx.value.status === 'failed' ||
            tx.value.status === 'FAILED' || tx.value.status === 'EXPIRED') {
            clearInterval(pollingInterval)
            return
        }
        try {
            const res = await payment.getPaymentStatus(reference)
            if (res) tx.value = res
        } catch (e) {
            // Silent fail
        }
    }, 5000)

    onUnmounted(() => clearInterval(pollingInterval))
})
</script>
