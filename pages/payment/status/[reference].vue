<template>
  <div class="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden text-slate-800 antialiased font-sans">
    <!-- Ambient Background Lighting & Motif -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute top-1/3 -left-40 size-[400px] rounded-full bg-amber-400/10 blur-3xl"></div>
      <div class="absolute -bottom-40 right-1/4 size-[450px] rounded-full bg-navy/5 blur-3xl"></div>
      <div class="absolute inset-0 opacity-[0.015]"
        style="background-image: radial-gradient(circle at 1px 1px, black 1px, transparent 0); background-size: 24px 24px;"></div>
    </div>

    <!-- App Global Header -->
    <LayoutAppHeaderDynamic />

    <!-- Main Content Container -->
    <main class="relative z-10 flex-grow pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white/90 backdrop-blur-sm rounded-[28px] border border-slate-200/90 shadow-sm max-w-md w-full p-8 text-center">
        <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
        <div class="text-slate-600 font-bold text-sm">{{ t('payment_status.loading_status', 'Memuat Status Pembayaran...') }}</div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMsg" class="max-w-md w-full bg-white/90 backdrop-blur-sm border border-slate-200/90 rounded-[28px] p-6 sm:p-8 text-center shadow-sm relative overflow-hidden">
        <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-rose-500"></div>
        <div class="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 mx-auto border border-red-100 shadow-xs">
          <Icon icon="ph:warning-circle-bold" class="text-3xl" />
        </div>
        <h2 class="text-xl font-black text-navy mb-2">{{ t('payment_status.not_found_title', 'Transaksi Tidak Ditemukan') }}</h2>
        <div class="text-slate-500 text-xs font-medium leading-relaxed mb-6">{{ errorMsg }}</div>
        <BaseButton :to="dashboardBackUrl" variant="navy" size="md" class="w-full justify-center">
          {{ dashboardBackLabel }}
        </BaseButton>
      </div>

      <!-- Transaction Details Card -->
      <div v-else class="max-w-lg w-full space-y-6">
        <!-- 1. PAID STATE -->
        <div v-if="tx.status === 'paid' || tx.status === 'PAID'" class="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500"></div>
          
          <div class="text-center space-y-2 pt-1">
            <div class="size-14 rounded-2xl mx-auto mb-2 flex items-center justify-center bg-emerald-50 border border-emerald-200/80 text-emerald-600 shadow-2xs">
              <Icon icon="ph:check-circle-bold" class="text-3xl" />
            </div>
            <h2 class="text-2xl font-black text-navy tracking-tight">{{ t('payment_status.paid_title', 'Pembayaran Berhasil!') }}</h2>
            <div class="text-xs text-slate-500 font-medium max-w-sm mx-auto">{{ t('payment_status.paid_desc', 'Terima kasih, pembayaran Anda telah diverifikasi dan dikonfirmasi secara instan.') }}</div>
          </div>

          <!-- Transaction Details Box -->
          <div class="bg-gradient-to-b from-slate-50/90 to-slate-50/50 border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">{{ t('payment_status.ref_number', 'Nomor Referensi') }}</span>
              <span class="font-mono text-navy font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">{{ tx.reference }}</span>
            </div>
            
            <div v-if="tx.description || tx.event_name" class="flex justify-between items-start text-xs gap-4">
              <span class="text-slate-500 font-bold shrink-0">{{ t('payment_status.item_description', 'Item / Deskripsi') }}</span>
              <span class="text-navy font-black text-right">{{ tx.event_name || tx.plan_name || tx.description }}</span>
            </div>

            <div v-if="tx.athlete_name" class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">{{ t('payment_status.athlete_name', 'Nama Atlet') }}</span>
              <span class="text-navy font-black">{{ tx.athlete_name }}</span>
            </div>

            <div v-if="tx.division || tx.category" class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">{{ t('payment_status.competition_category', 'Kategori Lomba') }}</span>
              <span class="text-navy font-black text-right">
                {{ tx.division || '' }} {{ tx.category ? ` ${tx.category}` : '' }}
              </span>
            </div>

            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">{{ t('payment_status.payment_method', 'Metode Pembayaran') }}</span>
              <span class="text-navy font-black">{{ formatPaymentMethodName(tx.payment_method) }}</span>
            </div>

            <div class="h-px bg-slate-200/80 my-1"></div>

            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-500 font-bold">{{ t('payment_status.total_paid', 'Total Bayar') }}</span>
              <span class="text-xl font-black text-navy tabular-nums">Rp {{ formatNumber(tx.total_amount) }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <BaseButton :to="dashboardBackUrl" variant="navy" size="lg" class="w-full justify-center font-bold">
              {{ dashboardBackLabel }}
            </BaseButton>
            <a :href="getInvoiceUrl(tx.reference)" target="_blank" class="flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors text-navy text-xs font-bold py-3 px-4 rounded-xl shadow-2xs">
              <Icon icon="ph:file-pdf" class="text-base text-red-500" />
              <span>{{ t('payment_status.download_invoice', 'Unduh Invoice (PDF)') }}</span>
            </a>
          </div>
        </div>

        <!-- 2. PENDING / AWAITING VERIFICATION STATE -->
        <div v-else-if="tx.status === 'pending' || tx.status === 'UNPAID' || tx.status === 'awaiting_verification' || tx.status === 'AWAITING_VERIFICATION'" class="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-400 via-primary to-amber-500"></div>
          
          <div class="text-center space-y-2 pt-1">
            <div class="size-14 rounded-2xl mx-auto mb-2 flex items-center justify-center border shadow-2xs"
              :class="(tx.payment_method === 'manual' || tx.status === 'awaiting_verification') ? 'bg-blue-50 border-blue-200/80 text-blue-600' : 'bg-amber-50 border-amber-200/80 text-amber-600'">
              <Icon :icon="(tx.payment_method === 'manual' || tx.status === 'awaiting_verification') ? 'ph:receipt-bold' : 'ph:clock-bold'" class="text-3xl" />
            </div>
            <h2 class="text-2xl font-black text-navy tracking-tight">
              {{ (tx.payment_method === 'manual' || tx.status === 'awaiting_verification') ? t('payment_status.proof_received_title', 'Bukti Pembayaran Diterima') : t('payment_status.awaiting_payment_title', 'Menunggu Pembayaran') }}
            </h2>
            <div class="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              {{ (tx.payment_method === 'manual' || tx.status === 'awaiting_verification')
                ? t('payment_status.proof_received_desc', 'Bukti transfer Anda telah kami terima. Harap tunggu verifikasi dari penyelenggara.')
                : t('payment_status.awaiting_payment_desc', 'Silakan selesaikan pembayaran Anda sebelum batas waktu kedaluwarsa.') }}
            </div>
          </div>

          <!-- Direct Mayar Online Checkout Card -->
          <div v-if="isRealCheckoutUrl(tx.checkout_url)" class="bg-gradient-to-br from-amber-500/10 via-amber-50/80 to-primary/20 border-2 border-primary/60 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm relative overflow-hidden">
            <div class="flex items-center gap-3.5">
              <div class="size-11 rounded-xl bg-white border border-amber-200/80 flex items-center justify-center p-1.5 shrink-0 shadow-2xs">
                <img src="/mayar-logo.png" alt="Mayar" class="w-full h-full object-contain" />
              </div>
              <div class="space-y-0.5 min-w-0 flex-1">
                <div class="text-sm font-black text-navy leading-tight">
                  {{ t('payment_status.pay_via_mayar_title', 'Selesaikan Pembayaran via Mayar') }}
                </div>
                <div class="text-xs text-slate-600 font-medium leading-relaxed">
                  {{ t('payment_status.pay_via_mayar_desc', 'Pilih QRIS (Semua E-Wallet/Mobile Banking) atau Virtual Account (BCA, Mandiri, BRI, BNI, Permata) langsung di portal invoice Mayar.') }}
                </div>
              </div>
            </div>

            <!-- Single, Primary Direct Checkout CTA -->
            <a :href="tx.checkout_url" target="_blank" rel="noopener noreferrer" class="w-full flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-hover text-navy font-black text-sm sm:text-base py-3.5 px-5 rounded-xl shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer">
              <Icon icon="ph:arrow-square-out-bold" class="text-xl" />
              <span>{{ t('payment_status.btn_pay_now_mayar', 'Bayar Sekarang di Mayar') }}</span>
            </a>
          </div>

          <!-- Manual payment notice -->
          <div v-if="tx.payment_method === 'manual' || tx.status === 'awaiting_verification'" class="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-5 space-y-3">
            <div class="flex items-start gap-3">
              <Icon icon="ph:info-bold" class="text-blue-600 shrink-0 mt-0.5" />
              <div class="space-y-1">
                <div class="text-xs font-black text-blue-900">{{ t('payment_status.manual_verif_title', 'Status: Menunggu Verifikasi Penyelenggara') }}</div>
                <div class="text-xs text-blue-700 font-medium leading-relaxed">
                  {{ t('payment_status.manual_verif_desc', 'Penyelenggara akan memverifikasi bukti pembayaran Anda dalam 1x24 jam. Anda akan mendapat notifikasi setelah dikonfirmasi.') }}
                </div>
              </div>
            </div>
            <div v-if="tx.proof_url" class="mt-3 pt-3 border-t border-blue-100/80 flex flex-col items-center gap-2">
              <span class="text-[11px] font-bold text-blue-900">{{ t('payment_status.proof_uploaded_label', 'Bukti Pembayaran Diunggah:') }}</span>
              <a :href="tx.proof_url" target="_blank" rel="noopener noreferrer" class="block rounded-xl overflow-hidden border border-blue-200/80 shadow-2xs hover:scale-105 transition-transform">
                <img :src="tx.proof_url" alt="Bukti Transfer" class="h-32 object-cover" />
              </a>
            </div>
          </div>

          <!-- VA / Pay code / QRIS display (Only if no checkout_url or specific VA is returned) -->
          <div v-else-if="tx.qr_url || tx.va_number || tx.pay_code" class="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-5 space-y-4">
            <!-- Simple QRIS Image -->
            <div v-if="tx.qr_url" class="flex flex-col items-center justify-center space-y-2 py-1">
              <span class="text-xs font-black text-amber-900 capitalize tracking-wider">{{ t('payment_status.scan_qris', 'Pindai QRIS Pembayaran') }}</span>
              <img :src="tx.qr_url" alt="QRIS Code" class="size-56 sm:size-64 object-contain rounded-xl shadow-2xs border border-amber-200/60 bg-white p-2" />
            </div>

            <!-- Virtual Account or Pay Code -->
            <div v-if="tx.va_number || tx.pay_code" class="space-y-2">
              <div class="text-[10px] font-black text-amber-700 capitalize tracking-wider">
                {{ tx.payment_method?.includes('VA') || tx.va_number ? t('payment_status.va_number', 'Nomor Virtual Account') : t('payment_status.pay_code', 'Kode Bayar') }}
              </div>
              <div class="flex items-center justify-between gap-3 bg-white border border-amber-200 rounded-xl px-4 py-3 shadow-2xs">
                <span class="font-mono font-black text-navy text-lg sm:text-xl tracking-wider select-all">{{ tx.va_number || tx.pay_code }}</span>
                <button type="button" @click="copyText(tx.va_number || tx.pay_code)" class="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0">
                  <Icon :icon="copied ? 'ph:check-bold' : 'ph:copy-bold'" class="text-sm" />
                  <span>{{ copied ? t('payment_status.copied', 'Tersalin') : t('payment_status.copy', 'Salin') }}</span>
                </button>
              </div>
            </div>

            <div v-if="tx.expired_at" class="text-[11px] text-amber-700/80 font-medium flex items-center gap-1.5 pt-1 justify-center sm:justify-start">
              <Icon icon="ph:hourglass-medium-bold" />
              <span>{{ t('payment_status.pay_before', 'Batas Waktu Pembayaran') }}: {{ formatExpiry(tx.expired_at) }}</span>
            </div>
          </div>

          <!-- Transaction Summary Box -->
          <div class="bg-gradient-to-b from-slate-50/90 to-slate-50/50 border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">{{ t('payment_status.ref_number', 'Nomor Referensi') }}</span>
              <span class="font-mono text-navy font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">{{ tx.reference }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">{{ t('payment_status.payment_method', 'Metode Pembayaran') }}</span>
              <span class="text-navy font-black">{{ formatPaymentMethodName(tx.payment_method) }}</span>
            </div>
            <div class="h-px bg-slate-200/80 my-1"></div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-500 font-bold">{{ t('payment_status.total_bill', 'Total Tagihan') }}</span>
              <span class="text-xl font-black text-navy tabular-nums">Rp {{ formatNumber(tx.total_amount) }}</span>
            </div>
          </div>

          <!-- Instructions Tabs -->
          <div v-if="instructionGroups.length > 0" class="space-y-3">
            <h3 class="text-xs font-black text-slate-400 capitalize tracking-wider">{{ t('payment_status.payment_instructions', 'Instruksi Pembayaran') }}</h3>
            <div class="flex flex-wrap gap-2">
              <button v-for="(group, idx) in instructionGroups" :key="idx" @click="activeGroupIdx = idx" type="button" class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all border" :class="activeGroupIdx === idx ? 'bg-navy text-white border-navy shadow-xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'">
                {{ group.title }}
              </button>
            </div>
            <ol class="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 space-y-2 list-decimal list-inside font-medium leading-relaxed">
              <li v-for="(step, sIdx) in activeGroupSteps" :key="sIdx">{{ step }}</li>
            </ol>
          </div>

          <!-- Dev Simulator Button -->
          <div v-if="tx.reference && tx.reference.includes('DEV-')" class="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
            <div class="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Icon icon="ph:wrench-bold" />
              <span>Simulasi Pembayaran (Mode Pengembangan)</span>
            </div>
            <BaseButton @click="triggerInstantConfirmation" variant="primary" size="md" :loading="isSimulating" class="w-full justify-center font-bold">
              Simulasi Pembayaran Lunas
            </BaseButton>
          </div>

          <!-- Single Back Action Button (No Duplicate CTA) -->
          <div class="pt-2">
            <BaseButton :to="dashboardBackUrl" variant="navy" size="lg" class="w-full justify-center font-bold">
              {{ dashboardBackLabel }}
            </BaseButton>
          </div>
        </div>

        <!-- 3. FAILED / EXPIRED STATE -->
        <div v-else class="bg-white/95 backdrop-blur-sm border border-slate-200/90 rounded-[28px] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
          <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-400 via-red-500 to-rose-500"></div>
          
          <div class="text-center space-y-2 pt-1">
            <div class="size-14 rounded-2xl mx-auto mb-2 flex items-center justify-center bg-red-50 border border-red-200/80 text-red-600 shadow-2xs">
              <Icon icon="ph:x-circle-bold" class="text-3xl" />
            </div>
            <h2 class="text-2xl font-black text-navy tracking-tight">{{ t('payment_status.failed_title', 'Pembayaran Gagal') }}</h2>
            <div class="text-xs text-slate-500 font-medium">
              {{ t('payment_status.failed_desc', { status: formatTitleCase(tx.status) }).replace('{status}', formatTitleCase(tx.status)) }}
            </div>
          </div>

          <div class="bg-gradient-to-b from-slate-50/90 to-slate-50/50 border border-slate-200/80 rounded-2xl p-5 space-y-3.5 shadow-2xs">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">{{ t('payment_status.ref_number', 'Nomor Referensi') }}</span>
              <span class="font-mono text-navy font-black bg-white px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-2xs">{{ tx.reference }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">{{ t('payment_status.total_bill', 'Total Tagihan') }}</span>
              <span class="text-navy font-black tabular-nums">Rp {{ formatNumber(tx.total_amount) }}</span>
            </div>
          </div>

          <div class="space-y-3">
            <BaseButton :to="dashboardBackUrl" variant="navy" size="lg" class="w-full justify-center font-bold">
              {{ dashboardBackLabel }}
            </BaseButton>
          </div>
        </div>
      </div>
    </main>

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

const { t } = useI18n()

definePageMeta({
    layout: 'blank'
})

useHead({ title: computed(() => t('payment_status.status_title', 'Status Pembayaran') + ' - ArcheryHub') })

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const reference = route.params.reference
const payment = usePayment()
const { userPersona } = useAuth()

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
const copied = ref(false)
const activeGroupIdx = ref(0)
const isSimulating = ref(false)

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
    if (m === 'MANUAL') return 'Transfer Bank Manual'
    if (m === 'MAYAR') return 'Mayar (Online)'
    if (m === 'GOPAY') return 'GoPay'
    if (m === 'QRIS') return 'QRIS'
    if (m === 'BRIVA') return 'BRI Virtual Account'
    if (m === 'BCAVA' || m === 'BCA') return 'BCA Virtual Account'
    if (m === 'MANDIRIVA' || m === 'MANDIRI') return 'Mandiri Virtual Account'
    if (m === 'BNIVA' || m === 'BNI') return 'BNI Virtual Account'
    if (m === 'PERMATAVA' || m === 'PERMATA') return 'Permata Virtual Account'
    return formatTitleCase(method)
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

onMounted(() => {
    loadPaymentDetails()

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
            // Silent fail — we still show last known state
        }
    }, 5000)

    // Cleanup polling on unmount
    onUnmounted(() => clearInterval(pollingInterval))
})

const formatNumber = (val) => {
    const num = Number(val)
    if (isNaN(num)) return '0'
    return new Intl.NumberFormat('id-ID').format(num)
}

const formatExpiry = (val) => {
    if (!val) return '-'
    return new Date(val).toLocaleString('id-ID')
}

const getInvoiceUrl = (ref) => {
    return `${apiBaseUrl}/payment/invoice/${ref}`
}

const copyText = async (text) => {
    if (!text) return
    try {
        await navigator.clipboard.writeText(text)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (err) {
        console.error('Failed to copy text:', err)
    }
}

const instructionGroups = computed(() => {
    if (!tx.value || !tx.value.instructions) return []
    try {
        const parsed = JSON.parse(tx.value.instructions)
        if (Array.isArray(parsed)) {
            return parsed
                .map(group => ({
                    title: group.title || '',
                    steps: Array.isArray(group.steps) ? group.steps : []
                }))
                .filter(g => g.steps.length > 0)
        }
    } catch {
        // not json
    }
    return []
})

const activeGroupSteps = computed(() => {
    const idx = activeGroupIdx.value
    const groups = instructionGroups.value
    if (groups && groups[idx]) {
        return groups[idx].steps || []
    }
    return []
})

const triggerInstantConfirmation = async () => {
    isSimulating.value = true
    try {
        await payment.simulateSuccess(reference)
        await loadPaymentDetails()
    } catch (err) {
        console.error('Simulation failed:', err)
        alert(err?.data?.error || 'Simulasi gagal. Silakan coba lagi.')
    } finally {
        isSimulating.value = false
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
}
</style>
