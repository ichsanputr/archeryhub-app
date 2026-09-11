<template>
  <div class="flex flex-col gap-6 pb-20 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_printout.scoresheet.title', 'Scoresheet Kualifikasi')"
      :subtitle="t('event_printout.scoresheet.page_desc', 'Atur parameter dan cetak lembar skor untuk babak kualifikasi.')"
      icon="ph:arrow-left-bold"
      :back-to="`/dashboard/organizer/events/${eventId}/printout`"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/events' },
        { label: t('event_printout.breadcrumb_printout', 'Cetak Dokumen'), to: `/dashboard/organizer/events/${eventId}/printout` },
        { label: t('event_printout.scoresheet.title', 'Scoresheet Kualifikasi') }
      ]"
    />

    <!-- Main Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <!-- Settings Form (Left / 2 cols) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Parameter Cetak -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center gap-3">
            <div class="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon icon="ph:gear-six-bold" class="text-xl" />
            </div>
            <h2 class="text-base font-black text-navy">{{ t('event_printout.scoresheet.parameters_title', 'Parameter Cetak') }}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Session Selection -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-500">{{ t('event_printout.scoresheet.session_label', 'Sesi Kualifikasi') }} *</label>
              <select v-model="form.session" class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-primary">
                <option :value="null" disabled>{{ t('event_printout.scoresheet.select_session_placeholder', 'Pilih Sesi Kualifikasi') }}</option>
                <option v-for="s in sessions" :key="s.session_code" :value="s.session_code">
                  {{ s.name }} ({{ s.session_code }})
                </option>
              </select>
              <div class="text-[11px] text-gray-400 leading-snug">{{ t('event_printout.scoresheet.select_session_desc', 'Pilih sesi kualifikasi yang ingin dicetak lembar skornya.') }}</div>
            </div>

            <!-- Category Selection -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-500">{{ t('event_printout.scoresheet.filter_category_label', 'Filter Kategori (Opsional)') }}</label>
              <select v-model="form.category" class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-primary">
                <option :value="null">{{ t('event_printout.scoresheet.select_all_categories', 'Semua Kategori') }}</option>
                <option v-for="c in categories" :key="c.id" :value="c.id">
                  {{ c.division_name }} {{ c.category_name }} {{ c.gender_division_name }}
                </option>
              </select>
              <div class="text-[11px] text-gray-400 leading-snug">{{ t('event_printout.scoresheet.select_all_categories_desc', 'Biarkan kosong untuk mencetak semua kategori dalam sesi terpilih.') }}</div>
            </div>

            <!-- Target Range -->
            <div class="space-y-2 md:col-span-2">
              <label class="block text-xs font-bold text-gray-500">{{ t('event_printout.scoresheet.target_range_label', 'Rentang Target Bantalan') }}</label>
              <div class="grid grid-cols-2 gap-4">
                <input v-model="form.targetFrom" type="text" :placeholder="t('event_printout.scoresheet.placeholder_from', 'Dari Bantalan (Contoh: 1)')"
                  class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-primary" />
                <input v-model="form.targetTo" type="text" :placeholder="t('event_printout.scoresheet.placeholder_to', 'Sampai Bantalan (Contoh: 20)')"
                  class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        </div>

        <!-- Konten Tambahan -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center gap-3">
            <div class="size-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <Icon icon="ph:list-checks-bold" class="text-xl" />
            </div>
            <h2 class="text-base font-black text-navy">{{ t('event_printout.scoresheet.additional_content_title', 'Konten & Tampilan Tambahan') }}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BaseCheckbox
              v-model="form.addCompetitionHeader"
              card
              :label="t('event_printout.scoresheet.add_competition_header', 'Header Informasi Kejuaraan')"
            />
            <BaseCheckbox
              v-model="form.addCompetitionImages"
              card
              :label="t('event_printout.scoresheet.add_competition_images', 'Logo & Gambar Event')"
            />
            <BaseCheckbox
              v-model="form.addCountryClubFlags"
              card
              :label="t('event_printout.scoresheet.add_country_club_flags', 'Nama Klub / Kontingen')"
            />
            <BaseCheckbox
              v-model="form.collectArchersBirthdateEmail"
              card
              :label="t('event_printout.scoresheet.collect_birthdate_email', 'Sertakan Info Kontak / Tanggal Lahir')"
            />
            <BaseCheckbox
              v-model="form.printBarcode"
              card
              class="md:col-span-2"
              :label="t('event_printout.scoresheet.print_barcode', 'Cetak Barcode Verifikasi')"
            />
          </div>
        </div>

        <!-- Opsi Cetak -->
        <div class="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div class="flex items-center gap-3">
            <div class="size-10 bg-slate-100 border border-slate-200 text-navy rounded-xl flex items-center justify-center">
              <Icon icon="ph:printer-bold" class="text-xl" />
            </div>
            <h2 class="text-base font-black text-navy">{{ t('event_printout.scoresheet.print_options_title', 'Opsi Percetakan') }}</h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseCheckbox
              v-model="form.autoPrint"
              card
              :label="t('event_printout.scoresheet.auto_print_label', 'Dialog Cetak Otomatis')"
              :sublabel="t('event_printout.scoresheet.auto_print_desc', 'Membuka dialog print browser saat PDF dibuka.')"
            />
            <BaseCheckbox
              v-model="form.blankScoresheet"
              card
              :label="t('event_printout.scoresheet.blank_label', 'Scoresheet Kosong')"
              :sublabel="t('event_printout.scoresheet.blank_desc', 'Cetak format lembar skor kosong tanpa nama atlet.')"
            />
          </div>
        </div>

      </div>

      <!-- Preview & Summary Sidebar (Right / 1 col) -->
      <div class="space-y-6">
        <div class="bg-navy rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm border border-primary/20">
          <div class="absolute inset-0 opacity-10" style="background-image: var(--motif-pattern);"></div>
          
          <div class="relative z-10 flex flex-col items-center text-center space-y-4">
            <div class="size-16 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center">
              <Icon icon="ph:file-pdf-bold" class="text-3xl text-white" />
            </div>

            <div>
              <h3 class="text-lg font-black text-white">{{ t('event_printout.scoresheet.document_summary_title', 'Ringkasan Dokumen') }}</h3>
              <div class="text-xs text-slate-300 mt-1 max-w-[220px]">{{ t('event_printout.scoresheet.document_summary_desc', 'Konfigurasi format lembar skor yang akan dicetak.') }}</div>
            </div>

            <div class="w-full space-y-3 pt-4 border-t border-white/10 text-xs font-bold">
              <div class="flex justify-between items-center text-slate-400">
                <span>{{ t('event_printout.scoresheet.paper_size_label', 'Ukuran Kertas') }}</span>
                <span class="text-white">A4 (Portrait)</span>
              </div>
              <div class="flex justify-between items-center text-slate-400">
                <span>{{ t('event_printout.scoresheet.layout_label', 'Tata Letak') }}</span>
                <span class="text-white">2 Scoresheets/Page</span>
              </div>
              <div class="flex justify-between items-center text-slate-400">
                <span>{{ t('event_printout.scoresheet.barcode_status_label', 'Status Barcode') }}</span>
                <span class="text-white">{{ form.printBarcode ? 'Aktif' : 'Nonaktif' }}</span>
              </div>
            </div>

            <div class="w-full pt-4">
              <BaseButton variant="primary" icon="ph:download-simple-bold" size="lg"
                class="w-full font-black text-sm"
                :disabled="!form.session || isProcessing" :loading="isProcessing" :loading-text="t('event_printout.downloading', 'Mengunduh PDF...')" @click="handlePrint">
                {{ t('event_printout.download_pdf', 'Unduh PDF') }}
              </BaseButton>
            </div>

            <div class="text-[10px] text-slate-400 text-center leading-relaxed">
              {{ t('event_printout.scoresheet.process_info', 'PDF akan diunduh dan siap dicetak melalui printer venue.') }}
            </div>
          </div>
        </div>
      </div>
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
const config = useRuntimeConfig()
const { t } = useI18n()

const eventId = route.params.id
const sessions = ref([])
const categories = ref([])
const isProcessing = ref(false)

const form = ref({
  session: null,
  category: null,
  targetFrom: '',
  targetTo: '',
  autoPrint: true,
  blankScoresheet: false,
  addCompetitionHeader: true,
  addCompetitionImages: true,
  addCountryClubFlags: true,
  collectArchersBirthdateEmail: false,
  printBarcode: true
})

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('event_printout.scoresheet.page_title', 'Scoresheet Kualifikasi - Cetak Dokumen'))
})

const fetchSessions = async () => {
  try {
    const response = await get(`/events/${eventId}/qualification/sessions`)
    sessions.value = response?.sessions || []
    if (sessions.value.length > 0 && !form.value.session) {
      form.value.session = sessions.value[0].session_code
    }
  } catch (error) {
    console.error('Failed to fetch sessions:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await get(`/events/${eventId}/categories`)
    categories.value = response?.events || response?.categories || []
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  }
}

const handlePrint = async () => {
  if (!form.value.session || isProcessing.value) return

  isProcessing.value = true

  const apiBase = config.public.apiBase || 'http://localhost:8001'
  const params = new URLSearchParams()

  params.append('blank', form.value.blankScoresheet ? '1' : '0')
  params.append('header', form.value.addCompetitionHeader ? '1' : '0')
  params.append('images', form.value.addCompetitionImages ? '1' : '0')
  params.append('flags', form.value.addCountryClubFlags ? '1' : '0')
  params.append('detail_info', form.value.collectArchersBirthdateEmail ? '1' : '0')
  params.append('barcode', form.value.printBarcode ? '1' : '0')

  if (form.value.category) params.append('category_id', form.value.category)
  if (form.value.targetFrom) params.append('target_from', form.value.targetFrom)
  if (form.value.targetTo) params.append('target_to', form.value.targetTo)

  const url = `${apiBase}/events/${eventId}/qualification/sessions/${form.value.session}/scoresheet?${params.toString()}`

  try {
    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    let filename = `Scoresheet-Sesi-${form.value.session}.pdf`
    const disposition = res.headers.get('content-disposition')
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '').trim()
      }
    }
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf'
    }

    const blob = await res.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (err) {
    console.error('Failed to download scoresheet PDF:', err)
  } finally {
    isProcessing.value = false
  }
}

onMounted(() => {
  fetchSessions()
  fetchCategories()
})
</script>
