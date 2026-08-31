<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Enhanced Header with Back Navigation -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <div class="relative p-6 sm:p-8">
        <!-- Breadcrumbs -->
        <nav class="flex text-xs font-bold text-white/50 tracking-wider mb-3 items-center gap-1.5">
          <NuxtLink :to="`/dashboard/organizer/events/${eventId}/printout`" class="hover:text-white transition-colors">
            {{ t('event_printout.breadcrumb_printout', 'Cetak Dokumen') }}
          </NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[10px]" />
          <span class="text-white">{{ t('event_printout.statistics.title', 'Statistik Event') }}</span>
        </nav>

        <div class="flex items-center sm:items-start gap-4">
          <NuxtLink :to="`/dashboard/organizer/events/${eventId}/printout`"
            class="size-14 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center shadow-md transition-colors shrink-0">
            <Icon icon="ph:arrow-left-bold" class="text-white text-xl" />
          </NuxtLink>
          <div class="min-w-0 text-left">
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate">
              {{ t('event_printout.statistics.title', 'Statistik Event') }}
            </h1>
            <div class="text-slate-300 text-sm max-w-2xl">
              {{ t('event_printout.statistics.page_desc', 'Laporan statistik resmi sebaran peserta event untuk panitia dan delegasi teknis.') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      <!-- Classes and Divisions Stats Card -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center mb-5">
            <Icon icon="ph:chart-bar-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy mb-2">{{ t('event_printout.statistics.classes_title', 'Statistik Kelas & Divisi') }}</h2>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.statistics.classes_desc', 'Rekap jumlah peserta berdasarkan kombinasi kelompok usia dan jenis busur perlombaan.') }}</div>
        </div>

        <div class="pt-4 border-t border-gray-50">
          <BaseButton @click="printStat('classes')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.print_pdf', 'Cetak PDF') }}
          </BaseButton>
        </div>
      </div>

      <!-- Club Stats Card -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center mb-5">
            <Icon icon="ph:castle-turret-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy mb-2">{{ t('event_printout.statistics.clubs_title', 'Statistik Klub & Kontingen') }}</h2>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.statistics.clubs_desc', 'Rekap jumlah atlet dan nomor yang diikuti dari masing-masing klub peserta.') }}</div>
        </div>

        <div class="pt-4 border-t border-gray-50">
          <BaseButton @click="printStat('clubs')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.print_pdf', 'Cetak PDF') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const eventId = route.params.id
const config = useRuntimeConfig()
const { t } = useI18n()

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('event_printout.statistics.page_title', 'Statistik Event - Cetak Dokumen'))
})

const printStat = (type) => {
  const baseUrl = config.public.apiBase || 'http://localhost:8001'
  const url = `${baseUrl}/events/${eventId}/participants/statistics-${type}?autoprint=1`
  window.open(url, '_blank')
}
</script>
