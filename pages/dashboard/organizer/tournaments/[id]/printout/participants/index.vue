<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_printout.participants.title')"
      :subtitle="t('event_printout.participants.page_desc')"
      icon="ph:users-three-bold"
      :back-to="`/dashboard/organizer/tournaments/${eventId}/printout`"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_printout.breadcrumb_printout'), to: `/dashboard/organizer/tournaments/${eventId}/printout` },
        { label: t('event_printout.participants.title') }
      ]"
    />

    <!-- 3 Participant Printout Options (IanSEO standard) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl">
      
      <!-- Option 1: By Alphabet -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
        <div>
          <div class="size-14 bg-slate-100 border border-slate-200 text-navy rounded-2xl flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-all">
            <Icon icon="ph:text-a-underline-bold" class="text-2xl text-navy" />
          </div>
          <h2 class="text-base font-black text-navy transition-colors mb-2">{{ t('event_printout.participants.by_alphabet') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_alphabet_desc') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printList('alphabetical')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.download_pdf') }}
          </BaseButton>
        </div>
      </div>

      <!-- Option 2: By Club -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
        <div>
          <div class="size-14 bg-slate-100 border border-slate-200 text-navy rounded-2xl flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-all">
            <Icon icon="ph:shield-bold" class="text-2xl text-navy" />
          </div>
          <h2 class="text-base font-black text-navy transition-colors mb-2">{{ t('event_printout.participants.by_club') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_club_desc') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printList('by-club')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.download_pdf') }}
          </BaseButton>
        </div>
      </div>

      <!-- Option 3: By Category / Event -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all group">
        <div>
          <div class="size-14 bg-slate-100 border border-slate-200 text-navy rounded-2xl flex items-center justify-center mb-5 shadow-2xs group-hover:scale-105 transition-all">
            <Icon icon="ph:squares-four-bold" class="text-2xl text-navy" />
          </div>
          <h2 class="text-base font-black text-navy transition-colors mb-2">{{ t('event_printout.participants.by_category') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_category_desc') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printList('by-category')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.download_pdf') }}
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
  title: computed(() => t('event_printout.participants.title') + ' - Archeris Dashboard')
})

const apiBaseUrl = useApiBaseUrl()

const printList = (type) => {
  const url = `${apiBaseUrl}/events/${eventId}/participants/printout?type=${type}&autoprint=1`
  window.open(url, '_blank')
}
</script>
