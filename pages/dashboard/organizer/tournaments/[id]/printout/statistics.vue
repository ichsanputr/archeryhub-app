<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_printout.statistics.title', 'Tournament Statistics')"
      :subtitle="t('event_printout.statistics.page_desc', 'Official participant distribution statistical reports for organizers and technical delegates.')"
      icon="ph:chart-bar-bold"
      :back-to="`/dashboard/organizer/tournaments/${eventId}/printout`"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_printout.breadcrumb_printout', 'Printouts'), to: `/dashboard/organizer/tournaments/${eventId}/printout` },
        { label: t('event_printout.statistics.title', 'Tournament Statistics') }
      ]"
    />

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
      <!-- Classes Stats Card -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group">
        <div>
          <div class="size-14 bg-slate-100 border border-slate-200/80 text-navy rounded-2xl flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-all">
            <Icon icon="ph:chart-bar-bold" class="text-2xl text-navy" />
          </div>
          <h2 class="text-base font-black text-navy mb-2">{{ t('event_printout.statistics.classes_title', 'Classes & Divisions Statistics') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.statistics.classes_desc', 'Participant counts broken down by age group and bow type category combinations.') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printStat('classes')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.download_pdf', 'Download PDF') }}
          </BaseButton>
        </div>
      </div>

      <!-- Club Stats Card -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between group">
        <div>
          <div class="size-14 bg-slate-100 border border-slate-200/80 text-navy rounded-2xl flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-all">
            <Icon icon="ph:castle-turret-bold" class="text-2xl text-navy" />
          </div>
          <h2 class="text-base font-black text-navy mb-2">{{ t('event_printout.statistics.clubs_title', 'Clubs & Contingents Statistics') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.statistics.clubs_desc', 'Summary of athlete counts and entries from each participating club.') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printStat('clubs')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.download_pdf', 'Download PDF') }}
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
  title: computed(() => t('event_printout.statistics.title', 'Statistik Turnamen') + ' - Archeris Dashboard')
})

const printStat = (type) => {
  const baseUrl = config.public.apiBase || 'http://localhost:8001'
  const url = `${baseUrl}/events/${eventId}/participants/statistics-${type}?autoprint=1`
  window.open(url, '_blank')
}
</script>
