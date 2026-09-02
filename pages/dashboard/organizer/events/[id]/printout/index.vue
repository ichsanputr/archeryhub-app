<template>
  <div class="flex flex-col gap-6 pb-12 font-body text-navy antialiased">
    <!-- Enhanced Header -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <div class="relative p-6 sm:p-8">
        <div class="flex items-center sm:items-start gap-4">
          <div class="size-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
            <Icon icon="ph:printer-bold" class="text-white text-2xl" />
          </div>
          <div class="min-w-0 text-left">
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate">
              {{ t('event_printout.title', 'Cetak Dokumen Event') }}
            </h1>
            <div class="text-slate-300 text-sm max-w-2xl">
              {{ t('event_printout.desc', { name: eventName || 'Event' }) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Printout Hub Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 1. Qualification Scoresheet Card -->
      <NuxtLink :to="`/dashboard/organizer/events/${eventId}/printout/qualification`"
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-btn-text transition-colors mb-5 shadow-xs">
            <Icon icon="ph:file-pdf-bold" class="text-2xl" />
          </div>
          <h3 class="text-base font-black text-navy mb-2">{{ t('event_printout.scoresheet.title', 'Scoresheet Kualifikasi') }}</h3>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.scoresheet.desc', 'Cetak lembar skor kualifikasi per sesi atau per kategori dengan format standar resmi.') }}</div>
        </div>

        <div class="flex items-center gap-1.5 text-navy font-bold text-xs group-hover:text-primary transition-colors pt-4 border-t border-gray-50">
          <span>{{ t('event_printout.view_more', 'Buka Menu') }}</span>
          <Icon icon="ph:arrow-right-bold" class="text-sm group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <!-- 2. Elimination Bracket Card -->
      <NuxtLink :to="`/dashboard/organizer/events/${eventId}/printout/elimination`"
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-btn-text transition-colors mb-5 shadow-xs">
            <Icon icon="mdi:bracket" class="text-2xl" />
          </div>
          <h3 class="text-base font-black text-navy mb-2">{{ t('event_printout.elimination.title', 'Bagan Eliminasi') }}</h3>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.elimination.desc', 'Cetak pohon bagan eliminasi A3/A4 untuk ditempel pada papan pengumuman venue.') }}</div>
        </div>

        <div class="flex items-center gap-1.5 text-navy font-bold text-xs group-hover:text-primary transition-colors pt-4 border-t border-gray-50">
          <span>{{ t('event_printout.view_more', 'Buka Menu') }}</span>
          <Icon icon="ph:arrow-right-bold" class="text-sm group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <!-- 3. Participant List Card -->
      <NuxtLink :to="`/dashboard/organizer/events/${eventId}/printout/participants`"
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-btn-text transition-colors mb-5 shadow-xs">
            <Icon icon="ph:users-three-bold" class="text-2xl" />
          </div>
          <h3 class="text-base font-black text-navy mb-2">{{ t('event_printout.participants.title', 'Daftar Peserta') }}</h3>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.participants.desc', 'Daftar hadir dan rekap peserta event per abjad atau per klub / kontingen.') }}</div>
        </div>

        <div class="flex items-center gap-1.5 text-navy font-bold text-xs group-hover:text-primary transition-colors pt-4 border-t border-gray-50">
          <span>{{ t('event_printout.view_more', 'Buka Menu') }}</span>
          <Icon icon="ph:arrow-right-bold" class="text-sm group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>

      <!-- 4. Event Statistics Card -->
      <NuxtLink :to="`/dashboard/organizer/events/${eventId}/printout/statistics`"
        class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-btn-text transition-colors mb-5 shadow-xs">
            <Icon icon="ph:chart-bar-bold" class="text-2xl" />
          </div>
          <h3 class="text-base font-black text-navy mb-2">{{ t('event_printout.statistics.title', 'Statistik Event') }}</h3>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.statistics.desc', 'Rekapitulasi statistik jumlah peserta per kelas, divisi, serta kontribusi per klub.') }}</div>
        </div>

        <div class="flex items-center gap-1.5 text-navy font-bold text-xs group-hover:text-primary transition-colors pt-4 border-t border-gray-50">
          <span>{{ t('event_printout.view_more', 'Buka Menu') }}</span>
          <Icon icon="ph:arrow-right-bold" class="text-sm group-hover:translate-x-1 transition-transform" />
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'

const route = useRoute()
const { get } = useApi()

const eventId = route.params.id
const eventName = ref('')
const { t } = useI18n()

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('event_printout.page_title', 'Cetak Dokumen - Event'))
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
