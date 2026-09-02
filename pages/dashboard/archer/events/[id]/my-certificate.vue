<template>
  <div class="flex flex-col gap-6 md:gap-8 pb-16">
    <!-- Header (Standard Dashboard Style) -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0"
        style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>

      <!-- Decorative Background Elements -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Content -->
      <div class="relative p-6 sm:p-8">
        <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
          <NuxtLink to="/dashboard/archer/events" class="hover:text-white transition-colors">{{ t('my_certificate_page.nav_my_events', 'Event Saya') }}</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-base" />
          <span class="text-primary font-medium">{{ t('my_certificate_page.title', 'Sertifikat Event') }}</span>
        </div>
        <div class="flex items-start gap-4">
          <!-- Icon Badge -->
          <div
            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
            <Icon icon="ph:certificate-bold" class="text-primary text-2xl" />
          </div>
          <div class="flex-grow">
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{{ t('my_certificate_page.title', 'Sertifikat Event') }}</h1>
            <div class="text-slate-300 text-sm mt-1">{{ t('my_certificate_page.subtitle', 'Sertifikat resmi keikutsertaan & hasil kompetisi Anda') }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-100 dark:border-slate-700 text-center shadow-sm space-y-4">
      <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mx-auto" />
      <div class="text-xs font-bold text-slate-400">{{ t('my_certificate_page.loading', 'Memuat sertifikat event...') }}</div>
    </div>

    <!-- Empty State (Certificate Not Yet Issued) -->
    <div v-else-if="!certificate"
      class="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 text-center border border-slate-200/80 dark:border-slate-700 shadow-sm w-full space-y-6">
      <div class="relative size-20 mx-auto">
        <div class="absolute inset-0 bg-primary/10 rounded-full blur-md"></div>
        <div class="relative size-20 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center shadow-sm">
          <Icon icon="ph:certificate-bold" class="text-4xl" />
        </div>
      </div>
      <div class="space-y-2">
        <h3 class="text-lg sm:text-xl font-black text-navy dark:text-white tracking-tight">
          {{ t('my_certificate_page.not_issued_title', 'Sertifikat Belum Diterbitkan') }}
        </h3>
        <div class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md mx-auto">
          {{ t('my_certificate_page.not_issued_desc', 'Sertifikat untuk event ini belum diterbitkan oleh panitia penyelenggara. Sertifikat biasanya diterbitkan setelah seluruh rangkaian event selesai.') }}
        </div>
      </div>
    </div>

    <!-- Premium Certificate Card Showcase -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-md overflow-hidden w-full">
      <!-- Certificate Header Banner -->
      <div class="relative bg-gradient-to-r from-navy via-navy to-slate-900 text-white p-6 sm:p-8 border-b border-primary/20">
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div class="flex items-center gap-3">
            <span class="px-3 py-1 bg-primary/20 border border-primary/40 rounded-full text-[10px] font-black tracking-widest text-primary capitalize flex items-center gap-1.5">
              <Icon icon="ph:seal-check-fill" class="text-xs" />
              {{ t('my_certificate_page.official_badge', 'Sertifikat Digital Resmi') }}
            </span>
          </div>

          <button v-if="certificate.certificate_no" @click="copyCertNo"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-mono font-bold text-white transition-colors w-fit">
            <span>{{ t('my_certificate_page.cert_number', 'NO SERTIFIKAT') }}: {{ certificate.certificate_no }}</span>
            <Icon icon="ph:copy-bold" class="text-primary text-xs" />
          </button>
        </div>

        <div class="mt-6 space-y-1">
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white">{{ certificate.event_name || eventName }}</h2>
          <div class="text-xs sm:text-sm text-primary font-bold">{{ certificate.category_name || 'Kategori Umum' }}</div>
        </div>
      </div>

      <!-- Certificate Main Details -->
      <div class="p-6 sm:p-8 space-y-6">
        <!-- Archer Info Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
          <div>
            <span class="text-slate-400 font-bold block text-[10px] capitalize tracking-wider mb-1">
              {{ t('my_certificate_page.archer_name', 'Nama Pemanah') }}
            </span>
            <div class="font-black text-navy dark:text-white text-base truncate">
              {{ certificate.archer_name || '-' }}
            </div>
          </div>

          <div>
            <span class="text-slate-400 font-bold block text-[10px] capitalize tracking-wider mb-1">
              {{ t('my_certificate_page.category', 'Kategori') }}
            </span>
            <div class="font-bold text-navy dark:text-white text-sm">
              {{ certificate.category_name || 'Umum' }}
            </div>
          </div>

          <div>
            <span class="text-slate-400 font-bold block text-[10px] capitalize tracking-wider mb-1">
              {{ t('my_certificate_page.issue_date', 'Tanggal Penerbitan') }}
            </span>
            <div class="font-bold text-navy dark:text-white text-sm">
              {{ formatDate(certificate.issue_date || certificate.created_at) }}
            </div>
          </div>
        </div>

        <!-- Verification Banner -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-900 dark:text-emerald-300">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
              <Icon icon="ph:shield-check-bold" class="text-xl" />
            </div>
            <div>
              <div class="text-xs font-black">{{ t('my_certificate_page.status_verified', 'Terverifikasi & Autentik') }}</div>
              <div class="text-[11px] opacity-80">Sertifikat ini telah terdaftar resmi dalam sistem Archeris.net.</div>
            </div>
          </div>
          
          <a v-if="certificate.certificate_no || certificate.uuid" :href="`/certificates/${certificate.uuid || certificate.id}`" target="_blank"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0 inline-flex items-center gap-1.5">
            <Icon icon="ph:qr-code-bold" />
            <span>{{ t('my_certificate_page.verify_online', 'Verifikasi Online') }}</span>
          </a>
        </div>

        <!-- Actions Toolbar -->
        <div class="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <button @click="copyShareLink"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors">
            <Icon icon="ph:share-network-bold" class="text-base" />
            <span>{{ t('my_certificate_page.share', 'Bagikan') }}</span>
          </button>

          <a v-if="certificate.pdf_url" :href="certificate.pdf_url" target="_blank"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-navy hover:bg-navy-light text-white font-bold text-xs rounded-xl transition-colors shadow-sm">
            <Icon icon="ph:eye-bold" class="text-base" />
            <span>{{ t('my_certificate_page.preview', 'Pratinjau PDF') }}</span>
          </a>

          <a v-if="certificate.pdf_url" :href="`${certificate.pdf_url}?download=true`" download
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-navy font-black text-xs rounded-xl hover:bg-primary-hover transition-colors shadow-md shadow-primary/20">
            <Icon icon="ph:download-simple-bold" class="text-base" />
            <span>{{ t('my_certificate_page.download_pdf', 'Unduh PDF') }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useDashboardI18n } from '~/composables/useDashboardI18n'

definePageMeta({ layout: 'dashboard' })

const { t, locale } = useDashboardI18n()
const route = useRoute()
const api = useApi()

const eventId = computed(() => route.params.id)
const eventName = ref('')

useHead({
  title: computed(() => `${t('my_certificate_page.title', 'Sertifikat Event')} - Archeris Dashboard`)
})

const { data: certificate, pending } = await useAsyncData(`archer-certificate-${eventId.value}`, async () => {
  try {
    const res = await api.get(`/archers/my/certificates`)
    const list = Array.isArray(res) ? res : res?.data || []
    const match = list.find(c => 
      c.event_id === eventId.value || 
      c.event_slug === eventId.value || 
      c.id === eventId.value ||
      (c.event_slug && (eventId.value.includes(c.event_slug) || c.event_slug.includes(eventId.value))) ||
      (c.event_id && (eventId.value.includes(c.event_id) || c.event_id.includes(eventId.value)))
    ) || (list.length > 0 ? list[0] : null)
    if (match) {
      eventName.value = match.event_name
      return match
    }
    return null
  } catch (err) {
    console.error('Failed to fetch event certificate:', err)
    return null
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const loc = locale.value === 'id' ? 'id-ID' : locale.value === 'kr' ? 'ko-KR' : 'en-US'
  try {
    return new Date(dateStr).toLocaleDateString(loc, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}

const copyCertNo = () => {
  if (certificate.value?.certificate_no) {
    navigator.clipboard?.writeText(certificate.value.certificate_no)
    alert(t('my_certificate_page.link_copied', 'Nomor sertifikat berhasil disalin!'))
  }
}

const copyShareLink = () => {
  const url = window.location.href
  navigator.clipboard?.writeText(url)
  alert(t('my_certificate_page.link_copied', 'Tautan sertifikat berhasil disalin!'))
}
</script>
