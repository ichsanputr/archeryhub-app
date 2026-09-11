<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_printout.participants.title', 'Daftar Peserta')"
      :subtitle="t('event_printout.participants.page_desc', 'Dokumen rekap atlet untuk registrasi ulang dan administrasi lomba.')"
      icon="ph:arrow-left-bold"
      :back-to="`/dashboard/organizer/events/${eventId}/printout`"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/events' },
        { label: t('event_printout.breadcrumb_printout', 'Cetak Dokumen'), to: `/dashboard/organizer/events/${eventId}/printout` },
        { label: t('event_printout.participants.title', 'Daftar Peserta') }
      ]"
    />

    <!-- 3 Participant Printout Options (IanSEO standard) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch max-w-6xl">
      
      <!-- Option 1: By Alphabet -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-primary transition-all group">
        <div>
          <div class="size-14 bg-primary text-btn-text rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-all">
            <Icon icon="ph:text-a-underline-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy group-hover:text-primary transition-colors mb-2">{{ t('event_printout.participants.by_alphabet', 'Berdasarkan Abjad') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_alphabet_desc', 'Daftar seluruh atlet yang terdaftar diurutkan sesuai abjad nama (A-Z) dilengkapi kategori dan nomor bantalan.') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printList('alphabetical')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.print_pdf', 'Cetak PDF') }}
          </BaseButton>
        </div>
      </div>

      <!-- Option 2: By Club -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-primary transition-all group">
        <div>
          <div class="size-14 bg-primary text-btn-text rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-all">
            <Icon icon="ph:shield-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy group-hover:text-primary transition-colors mb-2">{{ t('event_printout.participants.by_club', 'Berdasarkan Klub / Kontingen') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_club_desc', 'Daftar atlet dikelompokkan berdasarkan nama klub atau kontingen daerah masing-masing.') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printList('by-club')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.print_pdf', 'Cetak PDF') }}
          </BaseButton>
        </div>
      </div>

      <!-- Option 3: By Category / Event -->
      <div class="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-primary transition-all group">
        <div>
          <div class="size-14 bg-primary text-btn-text rounded-2xl flex items-center justify-center mb-5 shadow-sm group-hover:scale-105 transition-all">
            <Icon icon="ph:squares-four-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy group-hover:text-primary transition-colors mb-2">{{ t('event_printout.participants.by_category', 'Berdasarkan Kategori Lomba') }}</h2>
          <div class="text-xs text-slate-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_category_desc', 'Daftar peserta dikelompokkan per kelas & divisi lomba sesuai bagan pertandingan.') }}</div>
        </div>

        <div class="pt-4 border-t border-slate-100">
          <BaseButton @click="printList('by-category')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
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
  title: computed(() => t('event_printout.participants.page_title', 'Daftar Peserta - Cetak Dokumen'))
})

const printList = (type) => {
  const baseUrl = config.public.apiBase || 'http://localhost:8001'
  const url = `${baseUrl}/events/${eventId}/participants/printout?type=${type}&autoprint=1`
  window.open(url, '_blank')
}
</script>
