<template>
  <div class="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 antialiased font-sans">
    <LayoutAppHeaderDynamic />

    <main class="flex-grow pt-28 pb-16 px-4 sm:px-6 flex items-center justify-center">
      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-sm max-w-md w-full p-8 text-center">
        <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-4" />
        <div class="text-slate-600 font-bold text-sm">Memverifikasi Sertifikat...</div>
      </div>

      <!-- Invalid / Not Found -->
      <div v-else-if="!cert || cert.valid === false || cert.error" class="max-w-md w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 text-center shadow-md space-y-6">
        <div class="relative size-16 mx-auto">
          <div class="absolute inset-0 bg-red-500/10 rounded-full blur-md"></div>
          <div class="relative size-16 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
            <Icon icon="ph:shield-warning-bold" class="text-3xl" />
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-black text-navy tracking-tight mb-2">Sertifikat Tidak Valid</h2>
          <p class="text-xs text-slate-500 font-medium leading-relaxed">
            Nomor sertifikat <span class="font-mono font-bold text-navy">{{ certNo }}</span> tidak ditemukan di sistem Archeris.net atau telah dibatalkan.
          </p>
        </div>

        <BaseButton to="/" variant="navy" size="md" class="w-full justify-center">
          Halaman Utama
        </BaseButton>
      </div>

      <!-- Verified Certificate -->
      <div v-else class="max-w-lg w-full bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-lg space-y-6">
        <!-- Verification Badge Header -->
        <div class="text-center space-y-3 pb-4 border-b border-slate-100">
          <div class="relative size-16 mx-auto">
            <div class="absolute inset-0 bg-emerald-500/20 rounded-full blur-md animate-pulse"></div>
            <div class="relative size-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <Icon icon="ph:seal-check-bold" class="text-3xl" />
            </div>
          </div>

          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 capitalize tracking-wider">
            <Icon icon="ph:shield-check-bold" /> Sertifikat Resmi Terverifikasi
          </span>

          <h2 class="text-2xl font-black text-navy tracking-tight">Sertifikat Prestasi Panahan</h2>
          <p class="text-xs text-slate-500 font-medium">Terverifikasi secara digital oleh platform Archeris.net</p>
        </div>

        <!-- Certificate Details -->
        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 text-xs">
          <div class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Nomor Sertifikat</span>
            <span class="font-mono text-navy font-black text-sm">{{ cert.certificate_number || certNo }}</span>
          </div>

          <div class="flex justify-between items-start gap-4">
            <span class="text-slate-500 font-bold shrink-0">Nama Atlet</span>
            <span class="text-navy font-black text-right text-sm">{{ cert.archer_name || cert.full_name }}</span>
          </div>

          <div v-if="cert.club_name" class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Klub / Kontingen</span>
            <span class="text-navy font-black text-right">{{ cert.club_name }}</span>
          </div>

          <div class="flex justify-between items-start gap-4">
            <span class="text-slate-500 font-bold shrink-0">Event</span>
            <span class="text-navy font-black text-right">{{ cert.event_name }}</span>
          </div>

          <div v-if="cert.category_name" class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Kategori</span>
            <span class="text-navy font-black text-right">{{ cert.category_name }}</span>
          </div>

          <div v-if="cert.rank || cert.achievement" class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Peringkat / Capaian</span>
            <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-primary/20 text-navy">
              {{ cert.rank ? `Juara ${cert.rank}` : cert.achievement }}
            </span>
          </div>

          <div v-if="cert.issue_date || cert.created_at" class="flex justify-between items-center">
            <span class="text-slate-500 font-bold">Tanggal Diterbitkan</span>
            <span class="text-slate-700 font-bold">{{ formatDate(cert.issue_date || cert.created_at) }}</span>
          </div>
        </div>

        <!-- Download PDF Action -->
        <div class="space-y-3 pt-2">
          <a :href="`/api/v1/certificates/${cert.id || certNo}/pdf`" target="_blank"
             class="inline-flex items-center justify-center w-full py-3 bg-navy text-white font-black rounded-xl hover:bg-navy/90 transition-colors text-sm shadow-sm">
            <Icon icon="ph:download-simple-bold" class="mr-2" /> Download Sertifikat PDF
          </a>

          <BaseButton to="/" variant="white" size="md" class="w-full justify-center border-slate-200">
            Halaman Utama Archeris
          </BaseButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { get } = useApi()

const certNo = computed(() => route.params.uuid as string)
const isLoading = ref(true)
const cert = ref<any>(null)

async function verifyCert() {
  isLoading.value = true
  try {
    const res = await get(`/certificates/verify/${certNo.value}`)
    cert.value = res?.certificate || res?.data || res
  } catch {
    cert.value = { valid: false }
  } finally {
    isLoading.value = false
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

onMounted(verifyCert)

useHead({
  title: computed(() => `Verifikasi Sertifikat #${certNo.value} - Archeris.net`),
  meta: [
    { name: 'description', content: 'Halaman verifikasi resmi sertifikat kompetisi panahan Archeris.net' }
  ]
})
</script>