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
          <span class="text-white">{{ t('event_printout.participants.title', 'Daftar Peserta') }}</span>
        </nav>

        <div class="flex items-center sm:items-start gap-4">
          <NuxtLink :to="`/dashboard/organizer/events/${eventId}/printout`"
            class="size-14 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center shadow-md transition-colors shrink-0">
            <Icon icon="ph:arrow-left-bold" class="text-white text-xl" />
          </NuxtLink>
          <div class="min-w-0 text-left">
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate">
              {{ t('event_printout.participants.title', 'Daftar Peserta') }}
            </h1>
            <div class="text-slate-300 text-sm max-w-2xl">
              {{ t('event_printout.participants.page_desc', 'Dokumen rekap atlet untuk registrasi ulang dan administrasi lomba.') }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3 Participant Printout Options -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
      
      <!-- Option 1: By Alphabet -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center mb-5">
            <Icon icon="ph:text-a-underline-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy mb-2">{{ t('event_printout.participants.by_alphabet', 'Berdasarkan Abjad') }}</h2>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_alphabet_desc', 'Daftar seluruh atlet yang terdaftar diurutkan sesuai abjad nama (A-Z) dilengkapi kategori dan nomor bantalan.') }}</div>
        </div>

        <div class="pt-4 border-t border-gray-50">
          <BaseButton @click="printList('alphabetical')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.print_pdf', 'Cetak PDF') }}
          </BaseButton>
        </div>
      </div>

      <!-- Option 2: By Club -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center mb-5">
            <Icon icon="ph:shield-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy mb-2">{{ t('event_printout.participants.by_club', 'Berdasarkan Klub / Kontingen') }}</h2>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_club_desc', 'Daftar atlet dikelompokkan berdasarkan nama klub atau kontingen daerah masing-masing.') }}</div>
        </div>

        <div class="pt-4 border-t border-gray-50">
          <BaseButton @click="printList('by-club')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
            {{ t('event_printout.print_pdf', 'Cetak PDF') }}
          </BaseButton>
        </div>
      </div>

      <!-- Option 3: By Session Accreditation -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-all">
        <div>
          <div class="size-14 bg-navy text-primary rounded-xl flex items-center justify-center mb-5">
            <Icon icon="ph:identification-badge-bold" class="text-2xl" />
          </div>
          <h2 class="text-base font-black text-navy mb-2">{{ t('event_printout.participants.by_session', 'Akreditasi Per Sesi') }}</h2>
          <div class="text-xs text-gray-500 mb-6 leading-relaxed">{{ t('event_printout.participants.by_session_desc', 'Daftar akreditasi dan verifikasi kehadiran atlet dikelompokkan per sesi kualifikasi dan nomor target.') }}</div>
        </div>

        <div class="pt-4 border-t border-gray-50">
          <BaseButton @click="printAccreditation('session')" variant="primary" size="lg" icon="ph:file-pdf-bold" class="w-full font-black text-sm">
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

const printAccreditation = (type) => {
  const baseUrl = config.public.apiBase || 'http://localhost:8001'
  const url = `${baseUrl}/events/${eventId}/accreditation/printout?type=${type}&autoprint=1`
  window.open(url, '_blank')
}
</script>
