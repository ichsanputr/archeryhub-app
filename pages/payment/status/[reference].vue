<template>
  <div class="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
    <!-- App Global Header -->
    <LayoutAppHeaderDynamic />

    <!-- Main Content Container -->
    <main class="flex-grow pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-md w-full p-8 text-center">
        <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
        <div class="text-slate-600 font-bold text-sm">Memuat Status Pembayaran...</div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMsg" class="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 text-center shadow-md">
        <div class="size-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 mx-auto border border-red-100 shadow-xs">
          <Icon icon="ph:warning-circle-bold" class="text-3xl" />
        </div>
        <h2 class="text-xl font-black text-navy mb-2">Transaksi Tidak Ditemukan</h2>
        <p class="text-slate-500 text-xs font-medium leading-relaxed mb-6">{{ errorMsg }}</p>
        <BaseButton :to="dashboardBackUrl" variant="navy" size="md" class="w-full justify-center">
          {{ dashboardBackLabel }}
        </BaseButton>
      </div>

      <!-- Transaction Details Card -->
      <div v-else class="max-w-lg w-full space-y-6">
        <!-- 1. PAID STATE -->
        <div v-if="tx.status === 'paid' || tx.status === 'PAID'" class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div class="text-center space-y-2">
            <div class="relative size-16 mx-auto mb-3">
              <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse"></div>
              <div class="relative size-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Icon icon="ph:check-bold" class="text-3xl" />
              </div>
            </div>
            <h2 class="text-2xl font-black text-navy tracking-tight">Pembayaran Berhasil!</h2>
            <p class="text-xs text-slate-500 font-medium">Terima kasih, pembayaran Anda telah diverifikasi dan dikonfirmasi secara instan.</p>
          </div>

          <!-- Transaction Details -->
          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">Nomor Referensi</span>
              <span class="font-mono text-navy font-black">{{ tx.reference }}</span>
            </div>
            
            <div v-if="tx.description || tx.event_name" class="flex justify-between items-start text-xs gap-4">
              <span class="text-slate-500 font-bold shrink-0">Item / Deskripsi</span>
              <span class="text-navy font-black text-right">{{ tx.event_name || tx.plan_name || tx.description }}</span>
            </div>

            <div v-if="tx.athlete_name" class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">Nama Atlet</span>
              <span class="text-navy font-black">{{ tx.athlete_name }}</span>
            </div>

            <div v-if="tx.division || tx.category" class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">Kategori Lomba</span>
              <span class="text-navy font-black text-right">
                {{ tx.division || '' }} {{ tx.category ? ` ${tx.category}` : '' }}
              </span>
            </div>

            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">Metode Pembayaran</span>
              <span class="text-navy font-black">{{ formatPaymentMethodName(tx.payment_method) }}</span>
            </div>

            <div class="h-px bg-slate-200/80 my-1"></div>

            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-500 font-bold">Total Bayar</span>
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
              Unduh Invoice (PDF)
            </a>
          </div>
        </div>

        <!-- 2. PENDING / AWAITING VERIFICATION STATE -->
        <div v-else-if="tx.status === 'pending' || tx.status === 'UNPAID' || tx.status === 'awaiting_verification' || tx.status === 'AWAITING_VERIFICATION'" class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div class="text-center space-y-2">
            <div class="size-16 rounded-2xl flex items-center justify-center mx-auto shadow-xs"
              :class="(tx.payment_method === 'manual' || tx.status === 'awaiting_verification') ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-amber-50 text-amber-600 border border-amber-200'">
              <Icon :icon="(tx.payment_method === 'manual' || tx.status === 'awaiting_verification') ? 'ph:receipt-bold' : 'ph:clock-bold'" class="text-3xl" />
            </div>
            <h2 class="text-2xl font-black text-navy tracking-tight">
              {{ (tx.payment_method === 'manual' || tx.status === 'awaiting_verification') ? 'Bukti Pembayaran Diterima' : 'Menunggu Pembayaran' }}
            </h2>
            <div class="text-xs text-slate-500 font-medium">
              {{ (tx.payment_method === 'manual' || tx.status === 'awaiting_verification')
                ? 'Bukti transfer Anda telah kami terima. Harap tunggu verifikasi dari penyelenggara.'
                : 'Silakan selesaikan pembayaran Anda sebelum batas waktu kadaluarsa.' }}
            </div>
          </div>

          <!-- Direct Mayar Online Checkout Card -->
          <div v-if="isRealCheckoutUrl(tx.checkout_url)" class="bg-navy/[0.02] border-2 border-primary/40 rounded-2xl p-5 space-y-4 shadow-sm">
            <div class="space-y-1">
              <div class="text-sm font-black text-navy flex items-center gap-2">
                <Icon icon="ph:shield-check-fill" class="text-primary text-lg" />
                <span>Selesaikan Pembayaran via Mayar</span>
              </div>
              <div class="text-xs text-slate-500 font-medium leading-relaxed">
                Pilih QRIS (Semua E-Wallet/Mobile Banking) atau Virtual Account (BCA, Mandiri, BRI, BNI, Permata) langsung di portal invoice Mayar.
              </div>
            </div>

            <a :href="tx.checkout_url" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-hover text-navy font-black text-sm sm:text-base py-3.5 px-5 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all cursor-pointer">
              <Icon icon="ph:arrow-square-out-bold" class="text-lg" />
              <span>Bayar Sekarang di Mayar</span>
            </a>
          </div>

          <!-- Manual payment notice -->
          <div v-if="tx.payment_method === 'manual' || tx.status === 'awaiting_verification'" class="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-5 space-y-3">
            <div class="flex items-start gap-3">
              <Icon icon="ph:info-bold" class="text-blue-600 shrink-0 mt-0.5" />
              <div class="space-y-1">
                <div class="text-xs font-black text-blue-900">Status: Menunggu Verifikasi Penyelenggara</div>
                <div class="text-xs text-blue-700 font-medium leading-relaxed">
                  Penyelenggara akan memverifikasi bukti pembayaran Anda dalam 1x24 jam. Anda akan mendapat notifikasi setelah dikonfirmasi.
                </div>
              </div>
            </div>
            <div v-if="tx.proof_url" class="mt-3 pt-3 border-t border-blue-100/80 flex flex-col items-center gap-2">
              <span class="text-[11px] font-bold text-blue-900">Bukti Pembayaran Diunggah:</span>
              <a :href="tx.proof_url" target="_blank" rel="noopener noreferrer" class="block rounded-xl overflow-hidden border border-blue-200/80 shadow-2xs hover:scale-105 transition-transform">
                <img :src="tx.proof_url" alt="Bukti Transfer" class="h-32 object-cover" />
              </a>
            </div>
          </div>

          <!-- VA / Pay code / QRIS display (Only if no checkout_url or specific VA is returned) -->
          <div v-else-if="tx.qr_url || tx.va_number || tx.pay_code" class="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-5 space-y-4">
            <!-- Simple QRIS Image -->
            <div v-if="tx.qr_url" class="flex flex-col items-center justify-center space-y-2 py-1">
              <span class="text-xs font-black text-amber-900 tracking-wider">Pindai QRIS Pembayaran</span>
              <img :src="tx.qr_url" alt="QRIS Code" class="size-56 sm:size-64 object-contain rounded-xl shadow-2xs border border-amber-200/60 bg-white p-2" />
            </div>

            <!-- Virtual Account or Pay Code -->
            <div v-if="tx.va_number || tx.pay_code" class="space-y-2">
              <div class="text-[10px] font-black text-amber-700 tracking-wider">
                {{ tx.payment_method?.includes('VA') || tx.va_number ? 'Nomor Virtual Account' : 'Kode Bayar' }}
              </div>
              <div class="flex items-center justify-between gap-3 bg-white border border-amber-200 rounded-xl px-4 py-3 shadow-2xs">
                <span class="font-mono font-black text-navy text-lg sm:text-xl tracking-wider select-all">{{ tx.va_number || tx.pay_code }}</span>
                <button type="button" @click="copyText(tx.va_number || tx.pay_code)" class="flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 shrink-0">
                  <Icon :icon="copied ? 'ph:check-bold' : 'ph:copy-bold'" class="text-sm" />
                  {{ copied ? 'Tersalin' : 'Salin' }}
                </button>
              </div>
            </div>

            <div v-if="tx.expired_at" class="text-[11px] text-amber-700/80 font-medium flex items-center gap-1.5 pt-1 justify-center sm:justify-start">
              <Icon icon="ph:hourglass-medium-bold" />
              <span>Batas Waktu Pembayaran: {{ formatExpiry(tx.expired_at) }}</span>
            </div>
          </div>

          <!-- Transaction Summary -->
          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">Nomor Referensi</span>
              <span class="font-mono text-navy font-black">{{ tx.reference }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">Metode Pembayaran</span>
              <span class="text-navy font-black">{{ formatPaymentMethodName(tx.payment_method) }}</span>
            </div>
            <div class="h-px bg-slate-200/80 my-1"></div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-500 font-bold">Total Tagihan</span>
              <span class="text-xl font-black text-navy tabular-nums">Rp {{ formatNumber(tx.total_amount) }}</span>
            </div>
          </div>

          <!-- Instructions Tabs -->
          <div v-if="instructionGroups.length > 0" class="space-y-3">
            <h3 class="text-xs font-black text-slate-400 tracking-wider">Instruksi Pembayaran</h3>
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
              Simulasi Pembayaran (Mode Pengembangan)
            </div>
            <BaseButton @click="triggerInstantConfirmation" variant="primary" size="md" :loading="isSimulating" class="w-full justify-center font-bold">
              Simulasi Pembayaran Lunas
            </BaseButton>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <a v-if="isRealCheckoutUrl(tx.checkout_url)" :href="tx.checkout_url" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-navy font-black text-sm py-3.5 px-4 rounded-xl shadow-xs transition-colors">
              <Icon icon="ph:arrow-square-out-bold" class="text-base" />
              <span>Bayar Langsung via Mayar</span>
            </a>
            <BaseButton :to="dashboardBackUrl" variant="navy" size="lg" class="w-full justify-center font-bold">
              {{ dashboardBackLabel }}
            </BaseButton>
          </div>
        </div>

        <!-- 3. FAILED / EXPIRED STATE -->
        <div v-else class="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div class="text-center space-y-2">
            <div class="size-16 rounded-2xl bg-red-50 text-red-500 border border-red-200 flex items-center justify-center mx-auto shadow-xs">
              <Icon icon="ph:x-circle-bold" class="text-3xl" />
            </div>
            <h2 class="text-2xl font-black text-navy tracking-tight">Pembayaran Gagal</h2>
            <div class="text-xs text-slate-500 font-medium">Transaksi ini berstatus <span class="font-bold text-red-600 capitalize">{{ formatTitleCase(tx.status) }}</span> dan tidak dapat dilanjutkan.</div>
          </div>

          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">Nomor Referensi</span>
              <span class="font-mono text-navy font-black">{{ tx.reference }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-500 font-bold">Total Tagihan</span>
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
const { t } = useI18n()
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from '#app'
import { usePayment } from '~/composables/usePayment'
import { useRuntimeConfig } from '#imports'

definePageMeta({
    layout: 'blank'
})

useHead({ title: computed(() => t('payment.status_title', 'Payment Status') + ' - ArcheryHub') })


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
        return 'Kembali ke Manajemen Paket & Kuota'
    }
    if (userPersona.value === 'seller') {
        return 'Kembali ke Pesanan Toko'
    }
    return 'Kembali ke Riwayat Pembayaran'
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
            errorMsg.value = 'Transaksi tidak ditemukan atau tanggapan kosong.'
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
        errorMsg.value = err?.data?.error || 'Gagal memuat rincian transaksi.'
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
