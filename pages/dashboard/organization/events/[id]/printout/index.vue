<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Enhanced Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <div class="relative p-6 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center sm:items-start gap-4 flex-1">
            <div
              class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
              <Icon icon="ph:file-pdf-bold" class="text-white text-2xl" />
            </div>
            <div class="min-w-0 text-left">
              <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate capitalize">
                Cetak dokumen event
              </h1>
              <p class="text-slate-300 text-sm max-w-2xl">
                Laporan dan administrasi lomba untuk {{ eventName || 'Event' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Printout Hub Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Qualification Scoresheet Card -->
      <NuxtLink :to="`/dashboard/organization/events/${eventId}/printout/qualification`"
        class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col">
        <div
          class="size-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors mb-6">
          <Icon icon="ph:file-pdf-bold" class="text-3xl text-navy group-hover:text-white" />
        </div>

        <h3 class="text-xl font-black text-navy mb-3 group-hover:text-primary transition-colors capitalize">Scoresheet
          kualifikasi
        </h3>
        <p class="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
          Pengaturan cetak lembar skor kualifikasi per sesi atau per kategori dengan template standar Ianseo.
        </p>

        <div class="flex items-center gap-2 text-primary font-black text-xs tracking-widest">
          <span>Lihat Selengkapnya</span>
          <Icon icon="ph:arrow-right-bold" class="text-lg group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <!-- Participant List Card -->
      <NuxtLink :to="`/dashboard/organization/events/${eventId}/printout/participants`"
        class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col">
        <div
          class="size-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors mb-6">
          <Icon icon="ph:file-pdf-bold" class="text-3xl text-navy group-hover:text-white" />
        </div>

        <h3 class="text-xl font-black text-navy mb-3 group-hover:text-primary transition-colors capitalize">Daftar
          peserta
        </h3>
        <p class="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
          Cetak daftar peserta lomba berdasarkan abjad atau dikelompokkan per organisasi/klub.
        </p>

        <div class="flex items-center gap-2 text-primary font-black text-xs tracking-widest">
          <span>Lihat Selengkapnya</span>
          <Icon icon="ph:arrow-right-bold" class="text-lg group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <!-- Event Statistics Card -->
      <NuxtLink :to="`/dashboard/organization/events/${eventId}/printout/statistics`"
        class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:border-primary/40 hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col">
        <div
          class="size-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors mb-6">
          <Icon icon="ph:file-pdf-bold" class="text-3xl text-navy group-hover:text-white" />
        </div>

        <h3 class="text-xl font-black text-navy mb-3 group-hover:text-primary transition-colors capitalize">Statistik
          event
        </h3>
        <p class="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">
          Cetak ringkasan statistik peserta berdasarkan kategori lomba (divisi & kelas) dan statistik per klub.
        </p>

        <div class="flex items-center gap-2 text-primary font-black text-xs tracking-widest">
          <span>Lihat Selengkapnya</span>
          <Icon icon="ph:arrow-right-bold" class="text-lg group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { get } = useApi()

const eventId = route.params.id
const eventName = ref('')

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Printout - Manajemen event'
})

const fetchEventData = async () => {
  try {
    const response = await get(`/events/${eventId}`)
    const data = response?.event || response
    eventName.value = data?.name || ''
  } catch (error) {
    console.error('Failed to fetch event:', error)
    eventName.value = ''
  }
}

onMounted(() => {
  fetchEventData()
})
</script>
