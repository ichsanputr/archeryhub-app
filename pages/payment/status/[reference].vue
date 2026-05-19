<template>
  <div class="min-h-screen bg-navy text-white flex flex-col justify-between font-sans antialiased relative overflow-hidden">
    <!-- Glow effects -->
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-10 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Header / Navbar -->
    <header class="border-b border-white/10 relative z-10">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="size-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
            <Icon icon="ph:shield-check-bold" class="text-primary text-xl" />
          </div>
          <div>
            <h1 class="text-sm font-black tracking-wider text-white">archeris.id</h1>
            <div class="text-[9px] font-black text-primary tracking-widest uppercase">status pembayaran</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow flex items-center justify-center p-4 relative z-10 my-8">
      <div v-if="isLoading" class="text-center py-12">
        <Icon icon="ph:circle-notch-bold" class="text-4xl text-primary animate-spin mb-4" />
        <div class="text-slate-400 font-bold text-sm">memuat status pembayaran...</div>
      </div>

      <div v-else-if="errorMsg" class="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-md">
        <div class="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-red-500/20">
          <Icon icon="ph:warning-circle-bold" class="text-3xl text-red-500" />
        </div>
        <h2 class="text-lg font-black text-white mb-3">transaksi tidak ditemukan</h2>
        <div class="text-slate-400 text-xs font-medium leading-relaxed mb-6">{{ errorMsg }}</div>
        <BaseButton to="/dashboard/archer/payments" variant="navy" size="md" class="w-full justify-center">kembali ke riwayat pembayaran</BaseButton>
      </div>

      <div v-else class="max-w-md w-full space-y-6">
        <!-- 1. PAID STATE -->
        <div v-if="tx.status === 'paid'" class="bg-white/5 border border-white/20 rounded-3xl p-6 backdrop-blur-md space-y-6 shadow-xl">
          <div class="text-center space-y-3">
            <div class="relative size-16 mx-auto mb-4">
              <div class="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
              <div class="relative size-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 border border-primary/40">
                <Icon icon="ph:check-bold" class="text-3xl text-navy" />
              </div>
            </div>
            <h2 class="text-xl font-black text-white">pembayaran berhasil!</h2>
            <div class="text-xs text-slate-300 font-medium">terima kasih, pembayaran anda telah berhasil diverifikasi dan dikonfirmasi secara instan.</div>
          </div>

          <!-- Transaction details -->
          <div class="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3.5">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">no. referensi</span>
              <span class="font-mono text-white font-black">{{ tx.reference }}</span>
            </div>
            
            <div v-if="tx.description || tx.event_name" class="flex justify-between items-start text-xs gap-4">
              <span class="text-slate-400 font-bold shrink-0">item/deskripsi</span>
              <span class="text-white font-black text-right">{{ tx.event_name || tx.plan_name || tx.description }}</span>
            </div>

            <div v-if="tx.athlete_name" class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">nama atlet</span>
              <span class="text-white font-black">{{ tx.athlete_name }}</span>
            </div>

            <div v-if="tx.division || tx.category" class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">kategori lomba</span>
              <span class="text-white font-black text-right">
                {{ tx.division || '' }} {{ tx.category ? `• ${tx.category}` : '' }}
              </span>
            </div>

            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">metode pembayaran</span>
              <span class="text-white font-black">{{ tx.payment_method || '-' }}</span>
            </div>

            <div class="h-px bg-white/10"></div>

            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-400 font-bold">total bayar</span>
              <span class="text-lg font-black text-primary tabular-nums">Rp {{ formatNumber(tx.total_amount) }}</span>
            </div>
          </div>

          <!-- Invoice/Back Buttons -->
          <div class="flex flex-col gap-2">
            <BaseButton v-if="eventSlug" :to="`/events/${eventSlug}`" variant="primary" size="md" class="w-full justify-center text-navy font-black">
              lihat halaman event
            </BaseButton>
            <BaseButton to="/dashboard/archer/events" variant="navy" size="md" class="w-full justify-center border-white/20 text-white font-black">
              masuk ke dashboard
            </BaseButton>
            <a :href="getInvoiceUrl(tx.reference)" target="_blank" class="flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-colors text-white text-xs font-black py-2.5 px-4 rounded-xl">
              <Icon icon="ph:file-pdf" class="text-base" />
              unduh invoice (pdf)
            </a>
          </div>
        </div>

        <!-- 2. PENDING STATE -->
        <div v-else-if="tx.status === 'pending'" class="bg-white/5 border border-white/20 rounded-3xl p-6 backdrop-blur-md space-y-6 shadow-xl">
          <div class="text-center space-y-3">
            <div class="size-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto shadow-md">
              <Icon icon="ph:clock-bold" class="text-3xl text-amber-500" />
            </div>
            <h2 class="text-xl font-black text-white">menunggu pembayaran</h2>
            <div class="text-xs text-slate-300 font-medium">silakan selesaikan pembayaran anda sebelum batas waktu kadaluarsa.</div>
          </div>

          <!-- VA / Pay code display -->
          <div v-if="tx.va_number || tx.pay_code" class="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-2">
            <div class="text-[9px] font-black text-slate-400 tracking-widest uppercase">
              {{ tx.payment_method?.includes('VA') || tx.va_number ? 'nomor virtual account' : 'kode bayar' }}
            </div>
            <div class="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <span class="font-mono font-black text-white text-lg tracking-wider select-all">{{ tx.va_number || tx.pay_code }}</span>
              <button @click="copyText(tx.va_number || tx.pay_code)" class="p-2 rounded-lg bg-primary hover:bg-primary/90 text-navy transition-colors shrink-0">
                <Icon :icon="copied ? 'ph:check-bold' : 'ph:copy-bold'" class="text-sm" />
              </button>
            </div>
          </div>

          <!-- QRIS display -->
          <div v-if="tx.qr_url" class="flex flex-col items-center bg-white rounded-2xl p-5 border border-white/10 shadow-inner">
            <div class="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-3">pindai qris</div>
            <img :src="tx.qr_url" alt="QR Code" class="w-44 h-44 rounded-xl border border-slate-100" />
          </div>

          <!-- Payment Summary -->
          <div class="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">total bayar</span>
              <span class="text-base font-black text-primary tabular-nums">Rp {{ formatNumber(tx.total_amount) }}</span>
            </div>
            <div class="flex justify-between items-center text-xs border-t border-white/10 pt-3">
              <span class="text-slate-400 font-bold">batas waktu</span>
              <span class="text-white font-black">{{ formatExpiry(tx.expired_at) }}</span>
            </div>
          </div>

          <!-- Instructions Accordion/Tabs -->
          <div v-if="instructionGroups.length" class="space-y-3">
            <div class="text-[10px] font-black text-slate-400 tracking-widest uppercase">panduan pembayaran</div>
            <div v-if="instructionGroups.length > 1" class="flex gap-2 flex-wrap pb-1">
              <button v-for="(group, gi) in instructionGroups" :key="group.title" @click="activeGroupIdx = gi"
                :class="activeGroupIdx === gi ? 'bg-primary text-navy border-primary' : 'bg-white/5 text-slate-300 border-white/10 hover:border-primary/40'"
                class="px-2.5 py-1.5 rounded-lg border text-[9px] font-black tracking-wider uppercase transition-all">
                {{ group.title }}
              </button>
            </div>
            <div class="bg-white/[0.02] border border-white/10 rounded-2xl p-4 space-y-3.5 max-h-48 overflow-y-auto custom-scrollbar">
              <div v-for="(step, si) in activeGroupSteps" :key="si" class="flex gap-3">
                <span class="size-5 mt-0.5 rounded-full bg-primary/20 text-primary font-black flex items-center justify-center shrink-0 text-[9px]">
                  {{ si + 1 }}
                </span>
                <span v-html="step" class="text-[11px] text-slate-300 font-semibold leading-relaxed"></span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-2 pt-2">
            <!-- INSTANT CONFIRMATION / SIMULATOR BUTTON (ONLY FOR PENDING) -->
            <button @click="triggerInstantConfirmation" :disabled="isSimulating"
              class="w-full h-11 bg-primary hover:bg-primary/90 text-navy disabled:opacity-50 transition-all font-black text-xs tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 border border-primary/30">
              <Icon v-if="isSimulating" icon="ph:circle-notch-bold" class="animate-spin text-sm" />
              <template v-else>
                konfirmasi instan (simulasi bayar)
                <Icon icon="ph:paper-plane-right-bold" />
              </template>
            </button>

            <BaseButton v-if="tx.checkout_url" :to="tx.checkout_url" target="_blank" variant="navy" size="md" class="w-full justify-center border-white/20 text-white font-black">
              halaman pembayaran tripay
            </BaseButton>

            <BaseButton to="/dashboard/archer/payments" variant="white" size="md" class="w-full justify-center border-white/10 bg-white/5 hover:bg-white/10 text-white font-black">
              lihat riwayat pembayaran
            </BaseButton>
          </div>
        </div>

        <!-- 3. OTHER STATES (expired, failed, etc.) -->
        <div v-else class="bg-white/5 border border-white/20 rounded-3xl p-6 backdrop-blur-md space-y-6 shadow-xl">
          <div class="text-center space-y-3">
            <div class="size-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto shadow-md">
              <Icon icon="ph:x-circle-bold" class="text-3xl text-red-500" />
            </div>
            <h2 class="text-xl font-black text-white">pembayaran gagal</h2>
            <div class="text-xs text-slate-300 font-medium">transaksi ini berstatus <span class="font-black text-red-400 uppercase">{{ tx.status }}</span> dan tidak dapat dilanjutkan.</div>
          </div>

          <div class="bg-white/[0.03] border border-white/10 rounded-2xl p-4 space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">no. referensi</span>
              <span class="font-mono text-white font-black">{{ tx.reference }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-slate-400 font-bold">total bayar</span>
              <span class="text-white font-black tabular-nums">Rp {{ formatNumber(tx.total_amount) }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <BaseButton v-if="eventSlug" :to="`/events/${eventSlug}`" variant="primary" size="md" class="w-full justify-center text-navy font-black">
              kembali ke halaman event
            </BaseButton>
            <BaseButton to="/dashboard/archer/payments" variant="navy" size="md" class="w-full justify-center border-white/20 text-white font-black">
              kembali ke riwayat pembayaran
            </BaseButton>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10 py-4 text-center text-[10px] font-bold text-slate-500 tracking-widest uppercase relative z-10">
      archeris.id &bull; secure transaction
    </footer>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from '#app'
import { usePayment } from '~/composables/usePayment'
import { useRuntimeConfig } from '#imports'

definePageMeta({
    layout: 'blank'
})

const route = useRoute()
const router = useRouter()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const reference = route.params.reference
const payment = usePayment()

const tx = ref(null)
const eventSlug = ref(null)
const isLoading = ref(true)
const errorMsg = ref('')
const copied = ref(false)
const activeGroupIdx = ref(0)
const isSimulating = ref(false)

const loadPaymentDetails = async () => {
    isLoading.value = true
    errorMsg.value = ''
    try {
        const res = await payment.getPaymentStatus(reference)
        if (!res) {
            errorMsg.value = 'transaksi tidak ditemukan atau response kosong.'
            return
        }
        tx.value = res

        // fetch event details to get the event slug if event_id is available
        if (res.event_id) {
            try {
                const eventRes = await $fetch(`${apiBaseUrl}/events/${res.event_id}`)
                if (eventRes && eventRes.slug) {
                    eventSlug.value = eventRes.slug
                }
            } catch (err) {
                console.error('failed to fetch event slug:', err)
            }
        }
    } catch (err) {
        console.error('failed to load payment details:', err)
        errorMsg.value = err?.data?.error || 'gagal memuat rincian transaksi.'
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadPaymentDetails()
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
        console.error('failed to copy text:', err)
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
        // refresh details
        await loadPaymentDetails()
    } catch (err) {
        console.error('simulation failed:', err)
        alert(err?.data?.error || 'simulasi gagal. silakan coba lagi.')
    } finally {
        isSimulating.value = false
    }
}
</script>

<style scoped>
/* clean scrollbar style */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
}
</style>
