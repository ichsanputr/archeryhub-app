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
              <div class="text-lg font-black tracking-tight">{{ t('csv_import.import_title') }}</div>
              <div class="text-xs sm:text-sm text-slate-300">{{ t('csv_import.import_subtitle') }}</div>
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
              <div class="text-xs sm:text-sm text-navy font-medium">
                <div class="font-bold">{{ t('csv_import.official_format_title') }}</div>
                <div class="text-gray-500">{{ t('csv_import.official_format_desc') }}</div>
              </div>
            </div>
            <BaseButton @click="downloadTemplate" variant="white" size="sm" icon="ph:download-simple-bold" class="shrink-0 text-xs sm:text-sm font-bold shadow-sm">
              {{ t('csv_import.download_template') }}
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
              <div class="font-bold text-navy text-sm sm:text-base">{{ selectedFile.name }}</div>
              <div class="text-xs sm:text-sm text-gray-400 font-mono">{{ formatFileSize(selectedFile.size) }}</div>
            </div>
            <div v-else class="flex flex-col items-center gap-2">
              <div class="size-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors">
                <Icon icon="ph:cloud-arrow-up-bold" class="text-3xl" />
              </div>
              <div class="text-sm sm:text-base font-bold text-navy">{{ t('csv_import.select_file') }}</div>
              <div class="text-xs sm:text-sm text-gray-400">{{ t('csv_import.support_hint') }}</div>
            </div>
          </div>

          <!-- Errors List Summary if any -->
          <div v-if="importResult && importResult.errors && importResult.errors.length > 0" class="p-4 bg-red-50 border border-red-100 rounded-2xl space-y-2 max-h-36 overflow-y-auto text-xs sm:text-sm text-red-700">
            <div class="font-bold flex items-center gap-2">
              <Icon icon="ph:warning-circle-bold" class="text-base" /> {{ t('csv_import.errors_title') }}
            </div>
            <ul class="list-disc pl-4 space-y-1">
              <li v-for="(err, idx) in importResult.errors" :key="idx">{{ err }}</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <BaseButton @click="closeModal" variant="white" class="h-10 px-5">
            {{ t('csv_import.close') }}
          </BaseButton>
          <BaseButton @click="uploadCSV" variant="primary" icon="ph:upload-simple-bold" :loading="isUploading" :disabled="!selectedFile" class="h-10 px-6 shadow-md shadow-primary/20">
            {{ t('csv_import.start_import') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  show: { type: Boolean, default: false },
  eventId: { type: String, required: true },
  customFields: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:show', 'imported', 'parsed'])

const { t } = useI18n()
const { get, post } = useApi()
const toast = useToast()

const fileInput = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)
const isUploading = ref(false)
const importResult = ref(null)
const localCustomFields = ref([])

const loadCustomFields = async () => {
  if (Array.isArray(props.customFields) && props.customFields.length > 0) {
    localCustomFields.value = props.customFields
    return
  }
  if (!props.eventId) return
  try {
    const res = await get(`/tournaments/${props.eventId}/custom-fields`)
    localCustomFields.value = res?.fields || []
  } catch (e) {
    localCustomFields.value = []
  }
}

watch(() => props.show, (val) => {
  if (val) loadCustomFields()
})

watch(() => props.customFields, (val) => {
  if (Array.isArray(val) && val.length > 0) {
    localCustomFields.value = val
  }
}, { immediate: true })

onMounted(() => {
  loadCustomFields()
})

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
    toast.error(t('csv_import.invalid_format'))
  }
}

const handleDrop = (e) => {
  isDragging.value = false
  const file = e.dataTransfer.files[0]
  if (file && file.name.endsWith('.csv')) {
    selectedFile.value = file
  } else if (file) {
    toast.error(t('csv_import.invalid_format'))
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
  const coreHeaders = ['full_name', 'email', 'phone', 'password', 'gender', 'club_name']
  
  const validCustomFields = (localCustomFields.value || []).filter(f => 
    f.is_active && !['heading', 'divider', 'notice'].includes(f.element_type)
  )
  
  const customHeaderKeys = validCustomFields.map(f => f.field_key || f.uuid)
  const allHeaders = [...coreHeaders, ...customHeaderKeys]

  const getSampleCustomVal = (field, idx) => {
    if (field.field_type === 'number') return idx === 0 ? '123' : '456'
    if (field.field_type === 'select' || field.field_type === 'radio') {
      if (Array.isArray(field.options) && field.options.length > 0) return field.options[idx % field.options.length]
      return 'Pilihan 1'
    }
    if (field.field_type === 'checkbox') {
      if (Array.isArray(field.options) && field.options.length > 0) return field.options[0]
      return 'Ya'
    }
    if (field.field_type === 'date') return idx === 0 ? '2000-01-15' : '1998-07-22'
    return idx === 0 ? 'Contoh 1' : 'Contoh 2'
  }

  const row1Custom = validCustomFields.map(f => getSampleCustomVal(f, 0))
  const row2Custom = validCustomFields.map(f => getSampleCustomVal(f, 1))

  const row1 = ['Budi Santoso', 'budi@example.com', '081234567890', 'Archeris123!', 'M', 'Klub Panahan Sleman', ...row1Custom]
  const row2 = ['Siti Aminah', 'siti@example.com', '081298765432', 'Archeris123!', 'F', 'Archery Club Jogja', ...row2Custom]

  const csvLines = [
    allHeaders.join(','),
    row1.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','),
    row2.map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
  ]

  const csvContent = '\uFEFF' + csvLines.join('\r\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', 'template_import_peserta_archeris.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success(t('csv_import.download_template_success'))
}

const uploadCSV = async () => {
  if (!selectedFile.value) return
  isUploading.value = true
  importResult.value = null

  try {
    const text = await selectedFile.value.text()
    const lines = text.split(/\r\n|\n/).map(l => l.trim()).filter(Boolean)

    if (lines.length <= 1) {
      toast.error(t('csv_import.empty_or_header_only'))
      isUploading.value = false
      return
    }

    const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''))
    const normalizedHeaders = rawHeaders.map(h => h.toLowerCase())
    const colIdx = {}
    normalizedHeaders.forEach((h, idx) => { colIdx[h] = idx })

    // Find full_name column
    const fullNameIdx = normalizedHeaders.findIndex(h => h === 'full_name' || h.includes('nama') || h.includes('name'))
    if (fullNameIdx === -1) {
      toast.error(t('csv_import.missing_fullname'))
      isUploading.value = false
      return
    }

    const emailIdx = normalizedHeaders.findIndex(h => h === 'email' || h.includes('mail') || h.includes('surel'))
    const phoneIdx = normalizedHeaders.findIndex(h => h === 'phone' || h.includes('hp') || h.includes('telp') || h.includes('wa'))
    const clubIdx = normalizedHeaders.findIndex(h => h === 'club_name' || h.includes('club') || h.includes('klub') || h.includes('kontingen'))
    const passIdx = normalizedHeaders.findIndex(h => h === 'password' || h.includes('pass') || h.includes('sandi'))
    const genderIdx = normalizedHeaders.findIndex(h => h === 'gender' || h.includes('kelamin') || h.includes('jk') || h.includes('sex'))

    // Map custom field columns
    const validCustomFields = (localCustomFields.value || []).filter(f => 
      f.is_active && !['heading', 'divider', 'notice'].includes(f.element_type)
    )
    const customFieldColMap = []
    for (const field of validCustomFields) {
      const fieldKeyNorm = (field.field_key || '').toLowerCase().trim()
      const labelIdNorm = (field.label_id || '').toLowerCase().trim()
      const labelEnNorm = (field.label_en || '').toLowerCase().trim()
      
      const foundIdx = normalizedHeaders.findIndex(h => 
        (fieldKeyNorm && h === fieldKeyNorm) ||
        (labelIdNorm && (h === labelIdNorm || h.includes(labelIdNorm))) ||
        (labelEnNorm && (h === labelEnNorm || h.includes(labelEnNorm)))
      )
      if (foundIdx !== -1) {
        customFieldColMap.push({ field_key: field.field_key, col_idx: foundIdx, field_type: field.field_type })
      }
    }

    const parsedArchers = []
    const errors = []

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]
      if (!line) continue
      
      // Simple CSV parser handling quotes
      const pattern = /(?:,|^)(?:"([^"]*)"|([^",]*))/g
      const cleanVals = []
      let match
      while ((match = pattern.exec(line)) !== null) {
        cleanVals.push((match[1] !== undefined ? match[1] : match[2] || '').trim())
      }

      const getVal = (idx) => {
        return idx >= 0 && idx < cleanVals.length ? cleanVals[idx].trim() : ''
      }

      const fullName = getVal(fullNameIdx)
      if (!fullName) {
        errors.push(t('csv_import.empty_fullname_row', { row: i + 1 }))
        continue
      }

      const email = getVal(emailIdx)
      const phone = getVal(phoneIdx)
      const clubName = getVal(clubIdx)
      const pass = getVal(passIdx) || 'Archeris123!'
      const gender = getVal(genderIdx) || 'M'

      // Extract custom fields
      const customFieldValues = {}
      for (const cf of customFieldColMap) {
        const rawVal = getVal(cf.col_idx)
        if (rawVal !== '') {
          if (cf.field_type === 'number') {
            const num = Number(rawVal)
            customFieldValues[cf.field_key] = isNaN(num) ? rawVal : num
          } else {
            customFieldValues[cf.field_key] = rawVal
          }
        }
      }

      const tempId = `csv-${Date.now()}-${i}`
      parsedArchers.push({
        id: tempId,
        uuid: tempId,
        full_name: fullName,
        username: fullName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        email: email || `${tempId}@example.com`,
        phone: phone || '',
        password: pass,
        gender: gender,
        club_name: clubName || 'Club',
        custom_fields: customFieldValues,
        is_new_profile: true
      })
    }

    if (parsedArchers.length > 0) {
      emit('parsed', parsedArchers)
      toast.success(t('csv_import.parsed_success', { count: parsedArchers.length }))
      closeModal()
    } else {
      toast.error(t('csv_import.no_valid_rows'))
    }
  } catch (error) {
    console.error('Failed to parse CSV:', error)
    toast.error(t('csv_import.parse_failed'))
  } finally {
    isUploading.value = false
  }
}
</script>
