<template>
  <div class="space-y-6 pb-12">
    <!-- Header (Identical to Payments / Cart / Event Dashboard Header) -->
    <DashboardHeader
      :title="t('archer_certificates.title')"
      :subtitle="t('archer_certificates.subtitle')"
      icon="ph:certificate-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: t('archer_certificates.breadcrumb') }
      ]"
    />

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div v-for="n in 4" :key="n" class="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs animate-pulse space-y-4">
        <div class="h-5 bg-slate-200 rounded-full w-3/4"></div>
        <div class="h-4 bg-slate-100 rounded-full w-1/2"></div>
        <div class="h-10 bg-slate-100 rounded-xl w-full"></div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!certificates || certificates.length === 0" class="bg-white border border-gray-100 rounded-3xl p-12 text-center shadow-sm">
      <div class="max-w-md mx-auto space-y-4">
        <div class="size-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto text-gray-300 border border-gray-100">
          <Icon icon="ph:certificate-bold" class="text-4xl" />
        </div>
        <div class="text-xl font-black text-navy">{{ t('archer_certificates.empty_title') }}</div>
        <div class="text-sm text-gray-500 font-medium leading-relaxed">
          {{ t('archer_certificates.empty_desc') }}
        </div>
      </div>
    </div>

    <!-- Certificate List Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div v-for="cert in certificates" :key="cert.id || cert.uuid || cert.certificate_no" 
        class="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-300 p-6 flex flex-col justify-between space-y-5">
        <div class="flex items-start gap-4">
          <div class="size-14 rounded-2xl bg-primary/10 text-navy font-black flex items-center justify-center shrink-0 border border-primary/20 group-hover:scale-105 transition-transform">
            <Icon icon="ph:certificate-bold" class="text-3xl text-navy" />
          </div>
          <div class="flex-1 min-w-0">
            <span class="text-[10px] font-black text-slate-400 tracking-wider block font-mono">{{ cert.certificate_no || 'CERT-OFFICIAL' }}</span>
            <h3 class="text-base font-black text-navy truncate mt-0.5">{{ cert.event_name }}</h3>
            <div class="text-xs text-slate-500 font-medium truncate mt-0.5">{{ cert.category_name || t('archer_certificates.default_category') }}</div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 flex items-center justify-between text-xs flex-wrap gap-2">
          <div class="text-slate-500 font-medium">
            {{ t('archer_certificates.issued_at') }} <span class="font-bold text-navy">{{ formatDate(cert.issue_date || cert.created_at) }}</span>
          </div>
          <div class="flex items-center gap-2">
            <a v-if="cert.pdf_url" :href="cert.pdf_url" target="_blank" class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-navy font-bold text-xs rounded-xl transition-colors">
              <Icon icon="ph:eye-bold" class="text-sm" />
              <span>{{ t('archer_certificates.view_btn') }}</span>
            </a>
            <a v-if="cert.pdf_url" :href="`${cert.pdf_url}?download=true`" class="inline-flex items-center gap-1.5 px-4 py-2 bg-navy hover:bg-navy/90 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs">
              <Icon icon="ph:download-simple-bold" class="text-primary text-sm" />
              <span>{{ t('archer_certificates.download_pdf') }}</span>
            </a>
            <span v-else class="text-xs text-slate-400 font-medium italic">{{ t('archer_certificates.processing_pdf') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'

const { t, locale } = useI18n()

definePageMeta({
  layout: 'dashboard'
})

useHead({ 
  title: computed(() => (t('archer_certificates.seo_title', 'Sertifikat Saya')) + ' - Archeris.net')
})

const { get } = useApi()

const { data: certificates, pending } = await useAsyncData('archer-certificates', async () => {
  try {
    const res = await get('/archers/my/certificates')
    return res?.data || res || []
  } catch (err) {
    console.error('Failed to fetch certificates:', err)
    return []
  }
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const loc = locale.value === 'en' ? 'en-US' : 'id-ID'
    return new Date(dateStr).toLocaleDateString(loc, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}
</script>
