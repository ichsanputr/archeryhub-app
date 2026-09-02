<template>
  <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        <!-- Header -->
        <div class="px-6 py-5 bg-gradient-to-r from-navy to-navy/90 text-white flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Icon icon="ph:file-csv-bold" class="text-2xl text-primary" />
            </div>
            <div>
              <h3 class="text-lg font-black tracking-tight">{{ t('csv_import.import_title', 'Import Peserta via CSV') }}</h3>
              <div class="text-xs text-slate-300">{{ t('csv_import.import_subtitle', 'Unggah file CSV untuk mendaftarkan peserta secara massal') }}</div>
            </div>
          </div>
          <button @click="closeModal" class="size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
            <Icon icon="ph:x-bold" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-6 space-y-6">
          <!-- Step 1: Download Template -->
          <div class="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <Icon icon="ph:info-bold" class="text-2xl text-primary shrink-0" />
              <div class="text-xs text-navy font-medium">
                <div class="font-bold">{{ t('csv_import.official_format_title', 'Format CSV Resmi') }}</div>
                <div class="text-gray-500">{{ t('csv_import.official_format_desc', 'Gunakan template resmi agar kolom dan data terpetakan dengan benar') }}</div>
              </div>
            </div>
            <BaseButton @click="downloadTemplate" variant="white" size="sm" icon="ph:download-simple-bold" class="shrink-0 text-xs font-bold shadow-sm">
              {{ t('csv_import.download_template', 'Unduh Template CSV') }}
            </BaseButton>
          </div>

          <!-- Dropzone -->
          <div @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop"
            @click="triggerFileInput"
            :class="[
              'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3',
              isDragging ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50/50',
              selectedFile ? 'bg-blue-50/30 border-blue-300' : ''
            ]">
            <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="handleFileChange" />
            
            <div v-if="selectedFile" class="flex flex-col items-center gap-2">
              <div class="size-14 rounded-2xl bg-blue-100 flex items-center justify-center text-primary">
                <Icon icon="ph:file-text-bold" class="text-3xl" />
              </div>
              <div class="font-bold text-navy text-sm">{{ selectedFile.name }}</div>
              <div class="text-xs text-gray-400 font-mono">{{ formatFileSize(selectedFile.size) }}</div>
            </div>
            <div v-else class="flex flex-col items-center gap-2">
              <div class="size-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                <Icon icon="ph:cloud-arrow-up-bold" class="text-3xl" />
              </div>
              <div class="text-sm font-bold text-navy">{{ t('csv_import.select_file', 'Klik atau Tarik File CSV ke Sini') }}</div>
              <div class="text-xs text-gray-400">{{ t('csv_import.support_hint', 'Mendukung format file .csv (UTF-8)') }}</div>
            </div>
          </div>

          <!-- Errors List Summary if any -->
          <div v-if="importResult && importResult.errors && importResult.errors.length > 0" class="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-2 max-h-36 overflow-y-auto text-xs text-red-700">
            <div class="font-bold flex items-center gap-2">
              <Icon icon="ph:warning-circle-bold" class="text-base" /> {{ t('csv_import.errors_title', 'Catatan Baris Terlewati / Error:') }}
            </div>
            <ul class="list-disc pl-4 space-y-1">
              <li v-for="(err, idx) in importResult.errors" :key="idx">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <BaseButton @click="closeModal" variant="white" class="h-10 px-5">
            {{ t('csv_import.close', 'Batal') }}
          </BaseButton>
          <BaseButton @click="uploadCSV" variant="primary" icon="ph:upload-simple-bold" :loading="isUploading" :disabled="!selectedFile" class="h-10 px-6 shadow-md shadow-primary/20">
            {{ t('csv_import.start_import', 'Mulai Impor') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  show: { type: Boolean, default: false },
  eventId: { type: String, required: true }
})

const emit = defineEmits(['update:show', 'imported', 'parsed'])

const { t } = useI18n()
const { post } = useApi()
const toast = useToast()

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const isUploading = ref(false)
const importResult = ref(null)

const closeModal = () => {
  selectedFile.value = null
  importResult.value = null
  emit('update:show', false)
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file && file.name.endsWith('.csv')) {
    selectedFile.value = file
  } else if (file) {
    toast.error(t('csv_import.invalid_format', 'File harus berformat .csv'))
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.name.endsWith('.csv')) {
    selectedFile.value = file
  } else if (file) {
    toast.error(t('csv_import.invalid_format', 'File harus berformat .csv'))
  }
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const downloadTemplate = () => {
  const csvContent = 'full_name,email,phone,password,gender,bow_type,club_name,category_name,payment_status,payment_amount\n' +
    'Budi Santoso,budi@example.com,081234567890,Archeris123!,M,recurve,Klub Panahan Sleman,Recurve 70m - Putra,paid,150000\n' +
    'Siti Aminah,siti@example.com,081298765432,Archeris123!,F,barebow,Archery Club Jogja,Barebow 50m - Putri,unpaid,0'
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'template_import_peserta_archeris.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success(t('csv_import.download_template_success', 'Template CSV berhasil diunduh'))
}

const uploadCSV = async () => {
  if (!selectedFile.value) return
  isUploading.value = true
  importResult.value = null

  try {
    const text = await selectedFile.value.text()
    const lines = text.split(/\r\n|\n/).map(l => l.trim()).filter(Boolean)

    if (lines.length <= 1) {
      toast.error(t('csv_import.empty_or_header_only', 'File CSV kosong atau hanya berisi header'))
      isUploading.value = false
      return
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''))
    const colIdx = {}
    header.forEach((h, idx) => { colIdx[h] = idx })

    if (!('full_name' in colIdx)) {
      toast.error(t('csv_import.missing_fullname', "Kolom wajib 'full_name' tidak ditemukan di CSV"))
      isUploading.value = false
      return
    }

    const parsedArchers = []
    const errors = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line) continue
      
      // Simple CSV parser handling quotes
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || line.split(',')
      const cleanVals = values.map(v => v.trim().replace(/^["']|["']$/g, ''))

      const getVal = (col) => {
        const idx = colIdx[col]
        return idx !== undefined && idx < cleanVals.length ? cleanVals[idx] : ''
      }

      const fullName = getVal('full_name')
      if (!fullName) {
        errors.push(t('csv_import.empty_fullname_row', { row: i + 1 }))
        continue
      }

      const email = getVal('email')
      const phone = getVal('phone')
      const clubName = getVal('club_name')
      const pass = getVal('password') || 'Archeris123!'

      const tempId = `csv-${Date.now()}-${i}`
      parsedArchers.push({
        id: tempId,
        uuid: tempId,
        full_name: fullName,
        username: fullName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        email: email || `${tempId}@example.com`,
        phone: phone || '',
        password: pass,
        club_name: clubName || 'Club',
        is_new_profile: true
      })
    }

    if (parsedArchers.length > 0) {
      emit('parsed', parsedArchers)
      toast.success(t('csv_import.parsed_success', { count: parsedArchers.length }))
      closeModal()
    } else {
      toast.error(t('csv_import.no_valid_rows', 'Tidak ada baris pemanah valid yang dapat dimuat'))
    }
  } catch (error) {
    console.error('Failed to parse CSV:', error)
    toast.error(t('csv_import.parse_failed', 'Gagal mengurai file CSV'))
  } finally {
    isUploading.value = false
  }
}
</script>
