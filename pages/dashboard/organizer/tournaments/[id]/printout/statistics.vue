<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_printout.statistics.title', 'Statistik Event')"
      :subtitle="t('event_printout.statistics.page_desc', 'Laporan statistik resmi sebaran peserta event untuk panitia dan delegasi teknis.')"
      icon="ph:arrow-left-bold"
      :back-to="`/dashboard/organizer/tournaments/${eventId}/printout`"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_printout.breadcrumb_printout', 'Cetak Dokumen'), to: `/dashboard/organizer/tournaments/${eventId}/printout` },
        { label: t('event_printout.statistics.title', 'Statistik Event') }
      ]"
    />

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      <!-- Classes Stats Card -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-primary transition-all flex flex-col justify-between group">
        <div>
          <div class="size-14 bg-primary text-btn-text rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-all">
            <Icon icon="ph:chart-bar-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy group-hover:text-primary transition-colors mb-2">{{ t('event_printout.statistics.classes_title', 'Statistik Kelas & Divisi') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.statistics.classes_desc', 'Rekap jumlah peserta berdasarkan kombinasi kelompok usia dan jenis busur perlombaan.') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printStat('classes')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.print_pdf', 'Cetak PDF') }}
          </BaseButton>
        </div>
      </div>

      <!-- Club Stats Card -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-primary transition-all flex flex-col justify-between group">
        <div>
          <div class="size-14 bg-primary text-btn-text rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-all">
            <Icon icon="ph:castle-turret-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy group-hover:text-primary transition-colors mb-2">{{ t('event_printout.statistics.clubs_title', 'Statistik Klub & Kontingen') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.statistics.clubs_desc', 'Rekap jumlah atlet dan nomor yang diikuti dari masing-masing klub peserta.') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
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
