<template>
  <div class="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
    <LayoutAppHeaderDynamic />

    <main class="flex-grow pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-md w-full p-8 text-center">
        <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
        <div class="text-slate-600 font-bold text-sm">Memuat Status Pembayaran...</div>
      </div>

      <div v-else class="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 text-center shadow-md space-y-6">
        <div class="relative size-16 mx-auto">
          <div class="absolute inset-0 bg-red-500/10 rounded-full blur-md animate-pulse"></div>
          <div class="relative size-16 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
            <Icon icon="ph:x-circle-bold" class="text-3xl" />
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-black text-navy tracking-tight mb-2">Pembayaran Gagal / Expired</h2>
          <p class="text-xs text-slate-500 font-medium leading-relaxed">
            Waktu pembayaran telah kedaluwarsa atau terjadi kendala pada transaksi. Slot peserta Anda mungkin telah dirilis kembali.
          </p>
        </div>

        <div v-if="tx" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3.5 text-left text-xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Nomor Referensi</span>
            <span class="font-mono text-navy font-black">{{ tx.reference || reference }}</span>
          </div>
          <div v-if="tx.event_name || tx.plan_name || tx.description" class="flex justify-between items-start gap-4">
            <span class="text-slate-500 font-bold shrink-0">Item</span>
            <span class="text-navy font-black text-right">{{ tx.event_name || tx.plan_name || tx.description }}</span>
          </div>
          <div v-if="tx.total_amount || tx.amount" class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Nominal</span>
            <span class="text-red-600 font-black text-sm">Rp {{ (tx.total_amount || tx.amount || 0).toLocaleString('id-ID') }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Status</span>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-700 capitalize">
              {{ tx.status || 'EXPIRED' }}
            </span>
          </div>
        </div>

        <div class="space-y-3 pt-2">
          <BaseButton v-if="tx?.event_slug" :to="`/events/${tx.event_slug}`" variant="navy" size="md" class="w-full justify-center font-bold">
            <Icon icon="ph:arrow-clockwise-bold" class="mr-2" />
            Daftar Ulang Event
          </BaseButton>
          
          <BaseButton to="/dashboard/archer/payments" variant="white" size="md" class="w-full justify-center border-slate-200">
            Lihat Riwayat Pembayaran
          </BaseButton>

          <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20pembayaran%20saya%20gagal%20dengan%20referensi%20" 
             target="_blank" 
             class="inline-flex items-center justify-center w-full text-xs text-slate-500 hover:text-navy font-bold py-2 transition-colors">
            <Icon icon="ph:whatsapp-logo-bold" class="text-emerald-500 text-sm mr-1.5" />
            Hubungi Customer Support
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { get } = useApi()

const reference = computed(() => route.params.reference as string)
const isLoading = ref(true)
const tx = ref<any>(null)

async function fetchStatus() {
  isLoading.value = true
  try {
    const res = await get(`/payment/status/${reference.value}`)
    tx.value = res?.payment || res?.data || res
  } catch {
    tx.value = { reference: reference.value, status: 'EXPIRED' }
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchStatus)

useHead({
  title: 'Pembayaran Gagal - Archeris.net'
})
</script>