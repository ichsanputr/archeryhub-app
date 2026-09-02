<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-navy text-white shadow-md border border-navy/20">
      <div class="absolute inset-0 opacity-10 pointer-events-none"
        style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px);">
      </div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <div class="size-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shadow-inner shrink-0">
            <Icon icon="ph:certificate-bold" class="text-primary text-3xl" />
          </div>
          <div class="min-w-0">
            <h1 class="text-xl sm:text-2xl font-black leading-tight tracking-tight text-white truncate">
              {{ t('org_certificate.header_title', 'Sertifikat Event') }}
            </h1>
            <p class="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {{ t('org_certificate.header_subtitle', 'Unggah dan kelola sertifikat digital resmi untuk peserta event secara langsung berbasis nama file.') }}
            </p>
          </div>
        </div>

        <!-- Stats Badges -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="bg-white/10 border border-white/10 rounded-2xl px-4 py-2.5 text-center min-w-[100px]">
            <div class="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{{ t('org_certificate.stats_paid', 'Peserta Lunas') }}</div>
            <div class="text-lg font-black text-white mt-0.5">{{ eligibleParticipantsCount }}</div>
          </div>
          <div class="bg-primary/20 border border-primary/30 rounded-2xl px-4 py-2.5 text-center min-w-[100px]">
            <div class="text-[10px] font-bold text-primary uppercase tracking-wider">{{ t('org_certificate.stats_issued', 'Sertifikat Terbit') }}</div>
            <div class="text-lg font-black text-primary mt-0.5">{{ certificatesList.length }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 1: File Upload & Naming Convention Guide -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div class="flex items-center gap-3">
        <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-navy font-bold">
          <Icon icon="ph:upload-simple-bold" class="text-xl text-primary" />
        </div>
        <div>
          <h2 class="text-base sm:text-lg font-black text-navy">{{ t('org_certificate.upload_section_title', 'Unggah Berkas Sertifikat') }}</h2>
          <p class="text-xs text-gray-500 mt-0.5">{{ t('org_certificate.upload_section_subtitle', 'Unggah berkas arsip ZIP atau beberapa file PDF sekaligus. Sistem akan otomatis mencocokkan nama file dengan peserta event.') }}</p>
        </div>
      </div>

      <!-- Naming Convention Pill Guide -->
      <div class="bg-gray-50/80 rounded-2xl p-5 border border-gray-100 space-y-3">
        <div class="flex items-center gap-2 text-xs font-bold text-navy">
          <Icon icon="ph:info-bold" class="text-primary text-base" />
          <span>{{ t('org_certificate.naming_guide_title', 'Panduan Penamaan File Sertifikat') }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
          <!-- Format A (Recommended) -->
          <div class="bg-white p-3.5 rounded-xl border border-primary/30 shadow-2xs space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">{{ t('org_certificate.naming_format_a_title', 'Format Rekomendasi (Kode + Nama)') }}</span>
            </div>
            <div class="font-mono text-xs font-bold text-navy pt-1 truncate">{{ t('org_certificate.naming_format_a_example', 'ARC-0012_Nama Pemanah.pdf') }}</div>
          </div>

          <!-- Format B -->
          <div class="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
            <span class="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{{ t('org_certificate.naming_format_b_title', 'Format Alternatif (Nama Lengkap)') }}</span>
            <div class="font-mono text-xs font-bold text-navy pt-1 truncate">{{ t('org_certificate.naming_format_b_example', 'Nama Lengkap Peserta.pdf') }}</div>
          </div>

          <!-- Format C -->
          <div class="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs space-y-1">
            <span class="text-[11px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">{{ t('org_certificate.naming_format_c_title', 'Format Kode Saja (Kode Atlet)') }}</span>
            <div class="font-mono text-xs font-bold text-navy pt-1 truncate">{{ t('org_certificate.naming_format_c_example', 'ARC-0012.pdf') }}</div>
          </div>
        </div>
      </div>

      <!-- Drag and Drop Dropzone -->
      <div
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
        class="border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 group relative flex flex-col items-center justify-center gap-4"
        :class="isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-gray-200 hover:border-primary hover:bg-gray-50/50 bg-white'">
        <input
          type="file"
          ref="fileInputRef"
          accept=".zip,.pdf"
          multiple
          class="hidden"
          @change="handleFileInputChange" />

        <div class="size-16 rounded-2xl bg-navy/5 group-hover:bg-primary/10 text-navy group-hover:text-primary transition-colors flex items-center justify-center">
          <Icon v-if="!isUploading" icon="ph:cloud-arrow-up-bold" class="text-3xl" />
          <Icon v-else icon="ph:spinner-gap-bold" class="text-3xl animate-spin text-primary" />
        </div>

        <div v-if="!isUploading" class="space-y-1 max-w-md">
          <div class="text-sm sm:text-base font-black text-navy group-hover:text-primary transition-colors">
            {{ t('org_certificate.dropzone_title', 'Tarik & Lepas File ZIP / PDF di Sini') }}
          </div>
          <p class="text-xs text-gray-400 font-medium">
            {{ t('org_certificate.dropzone_subtitle', 'atau klik untuk memilih file dari komputer Anda (.zip, .pdf)') }}
          </p>
        </div>

        <div v-else class="space-y-2 max-w-sm w-full">
          <div class="text-sm font-bold text-navy">{{ t('org_certificate.uploading', 'Mengunggah & Memproses Berkas...') }}</div>
          <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div class="bg-primary h-full rounded-full animate-pulse" style="width: 100%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 2: Latest Batch Processing Result (if active) -->
    <div v-if="uploadResult" class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-navy font-bold">
            <Icon icon="ph:chart-donut-bold" class="text-xl text-primary" />
          </div>
          <div>
            <h3 class="text-base font-black text-navy">{{ t('org_certificate.batch_result_title', 'Hasil Pemrosesan Batch Terakhir') }}</h3>
            <p class="text-xs text-gray-500 mt-0.5">{{ uploadResult.batch_id ? `Batch ID: ${uploadResult.batch_id.slice(0, 8)}` : '' }}</p>
          </div>
        </div>
        <button @click="uploadResult = null" class="text-gray-400 hover:text-navy text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          {{ t('common.close', 'Tutup') }}
        </button>
      </div>

      <!-- Batch Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-center">
          <div class="text-xs font-bold text-gray-500">{{ t('org_certificate.total_files', 'Total Berkas') }}</div>
          <div class="text-2xl font-black text-navy mt-1">{{ uploadResult.total_files || 0 }}</div>
        </div>

        <div class="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 text-center">
          <div class="text-xs font-bold text-emerald-700">{{ t('org_certificate.matched_count', 'Berhasil Dicocokkan') }}</div>
          <div class="text-2xl font-black text-emerald-700 mt-1">{{ uploadResult.matched_count || 0 }}</div>
        </div>

        <div class="bg-amber-50/80 p-4 rounded-2xl border border-amber-100 text-center">
          <div class="text-xs font-bold text-amber-700">{{ t('org_certificate.unmatched_count', 'Perlu Ditinjau') }}</div>
          <div class="text-2xl font-black text-amber-700 mt-1">{{ uploadResult.unmatched_count || 0 }}</div>
        </div>
      </div>

      <!-- Unmatched Files Resolver -->
      <div v-if="uploadResult.unmatched && uploadResult.unmatched.length > 0" class="space-y-4 pt-2">
        <div class="border-t border-gray-100 pt-4">
          <h4 class="text-sm font-black text-navy flex items-center gap-2">
            <Icon icon="ph:warning-circle-bold" class="text-amber-500 text-base" />
            <span>{{ t('org_certificate.unmatched_section_title', 'Berkas yang Belum Terhubung Otomatis') }} ({{ uploadResult.unmatched.length }})</span>
          </h4>
          <p class="text-xs text-gray-500 mt-0.5">{{ t('org_certificate.unmatched_section_desc', 'Pilih nama atlet yang sesuai untuk menghubungkan berkas sertifikat ini.') }}</p>
        </div>

        <div class="space-y-3">
          <div
            v-for="unm in uploadResult.unmatched"
            :key="unm.filename"
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-200/80">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <Icon icon="ph:file-pdf-bold" class="text-2xl text-red-500 shrink-0" />
              <div class="min-w-0">
                <div class="font-mono text-xs font-bold text-navy truncate">{{ unm.filename }}</div>
                <button
                  type="button"
                  @click="openPdfPreview(unm.pdf_url, unm.filename)"
                  class="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 mt-0.5">
                  <Icon icon="ph:eye-bold" />
                  <span>{{ t('org_certificate.btn_preview', 'Pratinjau') }}</span>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <select
                v-model="manualAssignments[unm.filename]"
                class="h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-primary flex-1 sm:w-64">
                <option value="">{{ t('org_certificate.select_archer', 'Pilih Atlet...') }}</option>
                <option v-for="p in participants" :key="p.uuid || p.id" :value="p.uuid || p.id">
                  {{ p.full_name }} ({{ p.athlete_code || p.id || '-' }})
                </option>
              </select>

              <BaseButton
                size="sm"
                variant="primary"
                :loading="isAssigning[unm.filename]"
                :disabled="!manualAssignments[unm.filename]"
                @click="handleManualAssign(unm.filename, unm.pdf_url)"
                class="shrink-0 font-bold text-xs">
                {{ t('org_certificate.btn_assign', 'Hubungkan') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Section 3: Published Certificates Data Table -->
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-base sm:text-lg font-black text-navy">{{ t('org_certificate.published_title', 'Daftar Sertifikat Terbit') }}</h2>
            <span class="bg-navy text-primary font-black text-xs px-2.5 py-0.5 rounded-full">
              {{ filteredCerts.length }}
            </span>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">{{ t('org_certificate.published_desc', 'Sertifikat resmi yang telah terhubung dan dapat diakses/diunduh oleh pemanah') }}</p>
        </div>

        <!-- Filter & Search Controls -->
        <div class="flex flex-wrap items-center gap-3">
          <!-- Search Input -->
          <div class="relative min-w-[220px] flex-1 sm:flex-initial">
            <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              v-model="certSearch"
              type="text"
              :placeholder="t('org_certificate.search_placeholder', 'Cari nama atlet, kode, nomor...')"
              class="w-full h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-navy placeholder:text-gray-400 placeholder:font-normal focus:outline-none focus:border-primary focus:bg-white transition-all" />
          </div>

          <!-- Category Filter -->
          <select
            v-model="selectedCategoryFilter"
            class="h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-primary">
            <option value="">{{ t('org_certificate.all_categories', 'Semua Kategori') }}</option>
            <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>

          <!-- Refresh Button -->
          <button
            @click="fetchCertificates"
            :disabled="isLoadingCerts"
            type="button"
            class="size-10 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center text-navy transition-colors">
            <Icon icon="ph:arrows-clockwise-bold" class="text-base" :class="{ 'animate-spin': isLoadingCerts }" />
          </button>

          <!-- Clear All Button -->
          <button
            v-if="certificatesList.length > 0"
            @click="handleClearAll"
            :disabled="isClearing"
            type="button"
            class="h-10 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/80 font-bold text-xs flex items-center gap-1.5 transition-colors">
            <Icon icon="ph:trash-bold" />
            <span>{{ t('org_certificate.btn_clear_all', 'Hapus Semua') }}</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoadingCerts" class="py-16 text-center space-y-3">
        <Icon icon="ph:spinner-gap-bold" class="text-3xl text-primary animate-spin mx-auto" />
        <p class="text-xs text-gray-400 font-bold">{{ t('common.loading', 'Memuat data sertifikat...') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredCerts.length === 0" class="py-16 text-center space-y-3 border-2 border-dashed border-gray-100 rounded-2xl">
        <div class="size-14 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center mx-auto">
          <Icon icon="ph:certificate-bold" class="text-3xl" />
        </div>
        <div class="space-y-1">
          <h4 class="text-sm font-black text-navy">{{ t('org_certificate.empty_certs_title', 'Belum Ada Sertifikat yang Diunggah') }}</h4>
          <p class="text-xs text-gray-400 max-w-sm mx-auto">{{ t('org_certificate.empty_certs_desc', 'Unggah file ZIP atau PDF di atas untuk mulai menerbitkan sertifikat peserta.') }}</p>
        </div>
      </div>

      <!-- Data Table -->
      <div v-else class="overflow-x-auto rounded-2xl border border-gray-100">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="bg-navy text-white font-bold text-[11px] uppercase tracking-wider">
              <th class="py-3.5 px-4 font-black">#</th>
              <th class="py-3.5 px-4 font-black">{{ t('org_certificate.th_archer', 'Nama Pemanah & Klub') }}</th>
              <th class="py-3.5 px-4 font-black">{{ t('org_certificate.th_category', 'Kategori Lomba') }}</th>
              <th class="py-3.5 px-4 font-black">{{ t('org_certificate.th_cert_no', 'Nomor Sertifikat') }}</th>
              <th class="py-3.5 px-4 font-black">{{ t('org_certificate.th_source_file', 'Nama File Asli') }}</th>
              <th class="py-3.5 px-4 font-black">{{ t('org_certificate.th_issue_date', 'Tanggal Terbit') }}</th>
              <th class="py-3.5 px-4 font-black text-right">{{ t('org_certificate.th_action', 'Aksi') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr
              v-for="(cert, idx) in filteredCerts"
              :key="cert.uuid || cert.id"
              class="hover:bg-gray-50/80 transition-colors group">
              <td class="py-3.5 px-4 font-mono font-bold text-gray-400 text-[11px]">{{ idx + 1 }}</td>
              <td class="py-3.5 px-4">
                <div class="font-black text-navy text-xs">{{ cert.archer_name || '-' }}</div>
                <div class="text-[11px] text-gray-400 font-medium">
                  {{ cert.athlete_code ? `[${cert.athlete_code}] ` : '' }}{{ cert.club_name || '' }}
                </div>
              </td>
              <td class="py-3.5 px-4">
                <span class="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 font-bold rounded-lg text-[10px]">
                  {{ cert.category_name || '-' }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-mono text-[11px] font-bold text-navy">
                {{ cert.certificate_no || '-' }}
              </td>
              <td class="py-3.5 px-4 font-mono text-[11px] text-gray-500 max-w-[180px] truncate">
                {{ cert.original_filename || '-' }}
              </td>
              <td class="py-3.5 px-4 text-gray-500 font-medium whitespace-nowrap">
                {{ formatDate(cert.issue_date || cert.created_at) }}
              </td>
              <td class="py-3.5 px-4 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="cert.pdf_url"
                    @click="openPdfPreview(cert.pdf_url, cert.archer_name)"
                    type="button"
                    class="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-navy transition-colors"
                    :title="t('org_certificate.btn_preview', 'Pratinjau')">
                    <Icon icon="ph:eye-bold" class="text-sm" />
                  </button>

                  <a
                    v-if="cert.pdf_url"
                    :href="cert.pdf_url"
                    target="_blank"
                    download
                    class="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-navy transition-colors"
                    :title="t('org_certificate.btn_download', 'Unduh')">
                    <Icon icon="ph:download-simple-bold" class="text-sm" />
                  </a>

                  <button
                    @click="handleDeleteCert(cert.uuid || cert.id)"
                    type="button"
                    class="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    :title="t('org_certificate.btn_delete', 'Hapus')">
                    <Icon icon="ph:trash-bold" class="text-sm" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PDF Preview Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="showPreviewModal"
        class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
        @click.self="showPreviewModal = false">
        <div class="bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[90vh] border border-gray-100">
          <div class="bg-navy p-5 shrink-0 flex items-center justify-between text-white">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon icon="ph:file-pdf-bold" class="text-xl text-primary" />
              </div>
              <div>
                <h3 class="font-black text-base text-white leading-tight">{{ previewModalTitle }}</h3>
                <div class="text-[11px] text-slate-300">{{ t('org_certificate.preview_modal_title', 'Pratinjau Berkas Sertifikat') }}</div>
              </div>
            </div>
            <button
              @click="showPreviewModal = false"
              class="size-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
              <Icon icon="ph:x-bold" class="text-base" />
            </button>
          </div>

          <div class="flex-grow bg-slate-100 p-4 min-h-[500px]">
            <iframe
              :src="activePreviewUrl"
              class="w-full h-full min-h-[500px] rounded-2xl bg-white shadow-sm border border-gray-200"
              title="PDF Certificate Preview"></iframe>
          </div>

          <div class="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 shrink-0">
            <a
              :href="activePreviewUrl"
              target="_blank"
              download
              class="px-5 py-2.5 bg-primary text-navy font-black text-xs rounded-xl shadow-sm hover:opacity-90 transition-opacity flex items-center gap-1.5">
              <Icon icon="ph:download-simple-bold" />
              <span>{{ t('org_certificate.btn_download', 'Unduh PDF') }}</span>
            </a>
            <button
              @click="showPreviewModal = false"
              class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-100 transition-colors">
              {{ t('org_certificate.close', 'Tutup') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from '#app'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const eventId = route.params.id
const { get, post, del } = useApi()
const toast = useToast()

const certificatesList = ref([])
const participants = ref([])
const isLoadingCerts = ref(false)
const isUploading = ref(false)
const isClearing = ref(false)
const isDragging = ref(false)
const fileInputRef = ref(null)

const certSearch = ref('')
const selectedCategoryFilter = ref('')
const uploadResult = ref(null)
const manualAssignments = ref({})
const isAssigning = ref({})

// Preview Modal State
const showPreviewModal = ref(false)
const activePreviewUrl = ref('')
const previewModalTitle = ref('')

const eligibleParticipantsCount = computed(() => {
  return participants.value.filter(p => {
    const s = (p.payment_status || '').toLowerCase()
    return s === 'paid' || s === 'lunas'
  }).length
})

const uniqueCategories = computed(() => {
  const cats = certificatesList.value
    .map(c => c.category_name)
    .filter(Boolean)
  return [...new Set(cats)]
})

const filteredCerts = computed(() => {
  let list = certificatesList.value
  if (selectedCategoryFilter.value) {
    list = list.filter(c => c.category_name === selectedCategoryFilter.value)
  }
  if (certSearch.value) {
    const q = certSearch.value.toLowerCase()
    list = list.filter(c =>
      c.archer_name?.toLowerCase().includes(q) ||
      c.certificate_no?.toLowerCase().includes(q) ||
      c.athlete_code?.toLowerCase().includes(q) ||
      c.club_name?.toLowerCase().includes(q) ||
      c.original_filename?.toLowerCase().includes(q)
    )
  }
  return list
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const handleFileInputChange = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    uploadFiles(files)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    uploadFiles(files)
  }
}

const uploadFiles = async (fileList) => {
  const formData = new FormData()
  for (let i = 0; i < fileList.length; i++) {
    formData.append('file', fileList[i])
  }

  isUploading.value = true
  try {
    const res = await post(`/events/${eventId}/certificates/upload-zip`, formData)
    uploadResult.value = res
    toast.success(t('org_certificate.msg_zip_success', { count: res.matched_count || 0 }))
    await fetchCertificates()
  } catch (error) {
    console.error('Failed to upload certificates:', error)
    toast.error(error?.data?.error || error?.response?.data?.error || 'Gagal memproses berkas sertifikat')
  } finally {
    isUploading.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
  }
}

const handleManualAssign = async (filename, pdfUrl) => {
  const partId = manualAssignments.value[filename]
  if (!partId) return

  isAssigning.value[filename] = true
  try {
    await post(`/events/${eventId}/certificates/manual-assign`, {
      batch_id: uploadResult.value?.batch_id,
      original_filename: filename,
      participant_id: partId,
      pdf_url: pdfUrl
    })
    toast.success(t('org_certificate.msg_cert_assigned', 'Sertifikat berhasil dihubungkan!'))
    if (uploadResult.value?.unmatched) {
      uploadResult.value.unmatched = uploadResult.value.unmatched.filter(f => f.filename !== filename)
      uploadResult.value.matched_count = (uploadResult.value.matched_count || 0) + 1
      uploadResult.value.unmatched_count = Math.max((uploadResult.value.unmatched_count || 1) - 1, 0)
    }
    await fetchCertificates()
  } catch (error) {
    console.error('Failed to assign certificate:', error)
    toast.error(error?.data?.error || 'Gagal menghubungkan sertifikat')
  } finally {
    isAssigning.value[filename] = false
  }
}

const handleDeleteCert = async (certId) => {
  if (!confirm(t('org_certificate.confirm_delete_single', 'Yakin ingin menghapus sertifikat ini?'))) return
  try {
    await del(`/events/${eventId}/certificates/${certId}`)
    toast.success(t('org_certificate.msg_cert_deleted', 'Sertifikat berhasil dihapus'))
    await fetchCertificates()
  } catch (error) {
    console.error('Failed to delete certificate:', error)
    toast.error('Gagal menghapus sertifikat')
  }
}

const handleClearAll = async () => {
  if (!confirm(t('org_certificate.confirm_clear_all', 'Peringatan: Yakin ingin menghapus seluruh sertifikat yang telah diterbitkan untuk event ini?'))) return
  isClearing.value = true
  try {
    await del(`/events/${eventId}/certificates/clear-all`)
    toast.success(t('org_certificate.msg_certs_cleared', 'Seluruh sertifikat event berhasil dibersihkan'))
    await fetchCertificates()
  } catch (error) {
    console.error('Failed to clear certificates:', error)
    toast.error('Gagal membersihkan sertifikat')
  } finally {
    isClearing.value = false
  }
}

const openPdfPreview = (url, title = '') => {
  activePreviewUrl.value = url
  previewModalTitle.value = title || 'Preview'
  showPreviewModal.value = true
}

const fetchCertificates = async () => {
  isLoadingCerts.value = true
  try {
    const [certsRes, partsRes] = await Promise.all([
      get(`/events/${eventId}/certificates`),
      get(`/events/${eventId}/participants?limit=1000`)
    ])
    certificatesList.value = certsRes?.data || certsRes || []
    participants.value = partsRes?.participants || partsRes?.data || partsRes || []
  } catch (err) {
    console.error('Failed to fetch certificates data:', err)
  } finally {
    isLoadingCerts.value = false
  }
}

onMounted(() => {
  fetchCertificates()
})
</script>
