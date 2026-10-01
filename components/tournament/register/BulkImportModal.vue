<template>
    <Teleport to="body">
        <div
            v-if="show"
            class="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-navy/60 backdrop-blur-sm animate-fade-in"
            @click.self="close">
            <div class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/90 flex flex-col max-h-[92vh]">
                
                <!-- Modal Header -->
                <div class="px-5 py-3.5 sm:px-6 sm:py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
                    <div class="flex items-center gap-3">
                        <div class="size-9 rounded-xl bg-primary/15 border border-primary/30 text-navy flex items-center justify-center shadow-2xs shrink-0">
                            <Icon icon="ph:file-csv-bold" class="text-base text-navy" />
                        </div>
                        <div>
                            <h3 class="text-sm sm:text-base font-black text-navy leading-snug">
                                {{ isEn ? 'Bulk Import Athlete Roster (CSV)' : 'Import Data Atlet via CSV' }}
                            </h3>
                            <div class="text-xs text-slate-500">
                                {{ isEn ? 'Upload CSV file containing archer credentials and tournament form data.' : 'Unggah file CSV berisi data nama atlet, email, jenis kelamin, klub, dan kolom formulir turnamen.' }}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="close"
                        class="size-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-slate-200 transition-colors cursor-pointer shrink-0">
                        <Icon icon="ph:x-bold" class="text-sm" />
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
                    
                    <!-- 1. CSV Template Configuration Card -->
                    <div class="p-4 sm:p-5 bg-slate-50/80 border border-slate-200 rounded-2xl space-y-3.5 shadow-2xs">
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                            <div class="space-y-1">
                                <div class="flex items-center gap-2">
                                    <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-navy text-primary text-xs font-black">
                                        <Icon icon="ph:file-text-bold" class="text-xs" />
                                        <span>{{ isEn ? 'Official Template' : 'Format Template Resmi' }}</span>
                                    </span>
                                    <span class="text-xs text-slate-400 font-medium">
                                        {{ validCustomFields.length > 0 ? (isEn ? `Includes ${validCustomFields.length} custom field(s)` : `Menyertakan ${validCustomFields.length} custom field turnamen`) : (isEn ? 'Standard format' : 'Format standar') }}
                                    </span>
                                </div>
                                <div class="text-xs text-slate-600 font-medium leading-relaxed">
                                    {{ isEn 
                                        ? 'Template columns are dynamically synchronized with this tournament\'s registration form.' 
                                        : 'Kolom template disesuaikan otomatis dengan formulir turnamen & custom fields yang ditentukan oleh pihak penyelenggara (EO).' 
                                    }}
                                </div>
                            </div>

                            <button
                                type="button"
                                @click="downloadCsvTemplate"
                                class="shrink-0 px-3.5 py-2 rounded-xl bg-navy text-primary hover:bg-navy/90 font-bold text-xs sm:text-sm shadow-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <Icon icon="ph:download-simple-bold" class="text-sm" />
                                <span>{{ isEn ? 'Download Template CSV' : 'Unduh Template CSV' }}</span>
                            </button>
                        </div>

                        <!-- Template Columns Badge Grid -->
                        <div class="pt-2 border-t border-slate-200/70 flex flex-wrap gap-1.5 items-center">
                            <span class="text-[11px] font-bold text-slate-400 mr-1">
                                {{ isEn ? 'Columns in CSV:' : 'Kolom dalam CSV:' }}
                            </span>
                            
                            <!-- Standard Core Columns -->
                            <span
                                v-for="col in templateCoreColumns"
                                :key="col.key"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border"
                                :class="col.required ? 'bg-white border-slate-200 text-navy' : 'bg-slate-100/80 border-slate-200 text-slate-600'">
                                <span>{{ col.label }}</span>
                                <span v-if="col.required" class="text-rose-500 font-black">*</span>
                            </span>

                            <!-- Dynamic Custom Fields from Organizer -->
                            <span
                                v-for="cf in validCustomFields"
                                :key="cf.field_key || cf.uuid"
                                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 border border-primary/30 text-navy"
                                :title="isEn ? 'Organizer Custom Field' : 'Custom Field Penyelenggara Turnamen'">
                                <Icon icon="ph:sliders-bold" class="text-xs text-navy" />
                                <span>{{ cf.label_id || cf.label_en || cf.field_key }}</span>
                                <span v-if="cf.is_required" class="text-rose-500 font-black">*</span>
                            </span>
                        </div>
                    </div>

                    <!-- 2. Dropzone / Upload Area (Initial State) -->
                    <div v-if="parsedRows.length === 0 && !verifying">
                        <div
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="handleFileDrop"
                            @click="triggerFileInput"
                            :class="[
                                'border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3.5 bg-white group shadow-2xs',
                                isDragging ? 'border-navy bg-slate-50 scale-[0.99]' : 'border-slate-300 hover:border-navy hover:bg-slate-50/70'
                            ]">
                            
                            <input
                                ref="fileInputRef"
                                type="file"
                                accept=".csv,text/csv"
                                class="hidden"
                                @change="handleFileSelect" />

                            <div class="size-14 rounded-2xl bg-navy/5 group-hover:bg-navy text-slate-500 group-hover:text-primary flex items-center justify-center transition-colors shadow-2xs">
                                <Icon icon="ph:cloud-arrow-up-bold" class="text-3xl" />
                            </div>

                            <div class="space-y-1">
                                <div class="text-sm sm:text-base font-black text-navy">
                                    {{ isEn ? 'Click or drag & drop CSV file here' : 'Klik atau seret file CSV ke sini' }}
                                </div>
                                <div class="text-xs text-slate-400 max-w-md mx-auto">
                                    {{ isEn 
                                        ? 'Supports standard .csv file format (UTF-8, comma or semicolon separated). Ensure column headers match the template.' 
                                        : 'Mendukung format file .csv (UTF-8, pemisah koma atau titik koma). Pastikan judul kolom sesuai dengan template resmi.' 
                                    }}
                                </div>
                            </div>

                            <div class="pt-1">
                                <span class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-navy group-hover:text-primary text-slate-700 text-xs sm:text-sm font-bold transition-colors shadow-2xs">
                                    <Icon icon="ph:file-csv-bold" class="text-base" />
                                    <span>{{ isEn ? 'Browse CSV File' : 'Pilih Berkas CSV' }}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Verification Spinner -->
                    <div v-if="verifying" class="py-16 text-center space-y-3.5 bg-slate-50/50 rounded-2xl border border-slate-100">
                        <div class="size-12 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center mx-auto text-navy">
                            <Icon icon="ph:spinner-gap-bold" class="text-2xl text-navy animate-spin" />
                        </div>
                        <div class="space-y-1">
                            <div class="text-sm sm:text-base font-black text-navy">
                                {{ isEn ? 'Verifying athlete roster...' : 'Memverifikasi data & status akun atlet...' }}
                            </div>
                            <div class="text-xs text-slate-400">
                                {{ isEn ? 'Checking existing accounts, duplicates, and required fields.' : 'Mengecek duplikasi di turnamen, akun terdaftar, dan kelengkapan data.' }}
                            </div>
                        </div>
                    </div>

                    <!-- 4. Review Table (Parsed State) -->
                    <div v-if="parsedRows.length > 0 && !verifying" class="space-y-3.5 animate-fade-in">
                        <!-- Summary Status Bar -->
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
                            <div class="flex items-center gap-2 text-xs sm:text-sm font-bold text-navy">
                                <Icon icon="ph:list-bullets-bold" class="text-slate-400" />
                                <span>{{ isEn ? `Found ${parsedRows.length} archers in CSV` : `Ditemukan ${parsedRows.length} atlet dari berkas CSV` }}</span>
                            </div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-black border border-emerald-200 flex items-center gap-1">
                                    <Icon icon="ph:check-circle-bold" class="text-xs" />
                                    <span>{{ readyCount }} {{ isEn ? 'ready to import' : 'siap dimasukkan' }}</span>
                                </span>
                                <span v-if="parsedRows.length - readyCount > 0" class="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg text-xs font-bold border border-amber-200 flex items-center gap-1">
                                    <Icon icon="ph:warning-circle-bold" class="text-xs" />
                                    <span>{{ parsedRows.length - readyCount }} {{ isEn ? 'skipped / registered' : 'dilewati / terdaftar' }}</span>
                                </span>
                            </div>
                        </div>

                        <!-- Data Table Container -->
                        <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                            <div class="overflow-x-auto max-h-[380px] custom-scrollbar">
                                <table class="w-full text-left border-collapse text-xs sm:text-sm">
                                    <thead class="bg-slate-50 border-b border-slate-200 text-navy font-bold sticky top-0 z-10">
                                        <tr>
                                            <th class="py-3 px-3 w-10 text-center text-slate-400">#</th>
                                            <th class="py-3 px-3.5">{{ isEn ? 'Athlete Profile' : 'Profil Atlet' }}</th>
                                            <th v-if="validCustomFields.length > 0" class="py-3 px-3.5">{{ isEn ? 'Tournament Custom Fields' : 'Data Formulir Turnamen' }}</th>
                                            <th class="py-3 px-3.5 w-36">{{ isEn ? 'Account Status' : 'Status Akun' }}</th>
                                            <th class="py-3 px-3.5">{{ isEn ? 'Verification Note' : 'Keterangan' }}</th>
                                            <th class="py-3 px-3 w-10 text-center text-slate-400">{{ isEn ? 'Action' : 'Aksi' }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        <tr v-for="(ath, idx) in parsedRows" :key="idx" class="hover:bg-slate-50/60 transition-colors">
                                            <!-- Col 1: Index -->
                                            <td class="py-3 px-3 text-center font-bold text-slate-400 text-xs">
                                                {{ idx + 1 }}
                                            </td>

                                            <!-- Col 2: Athlete Profile -->
                                            <td class="py-3 px-3.5">
                                                <div class="font-black text-navy leading-snug">{{ ath.full_name || (isEn ? 'Name Not Provided' : 'Nama Belum Diisi') }}</div>
                                                <div class="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                    <span>{{ ath.email }}</span>
                                                    <span class="text-slate-300">•</span>
                                                    <span
                                                        class="px-1.5 py-0.2 rounded text-[11px] font-bold"
                                                        :class="ath.gender === 'female' ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'">
                                                        {{ ath.gender === 'female' ? (isEn ? 'Female' : 'Putri') : (isEn ? 'Male' : 'Putra') }}
                                                    </span>
                                                    <span v-if="ath.club_name" class="text-slate-300">•</span>
                                                    <span v-if="ath.club_name" class="text-slate-700 font-medium">{{ ath.club_name }}</span>
                                                    <span v-if="ath.phone" class="text-slate-300">•</span>
                                                    <span v-if="ath.phone" class="text-slate-500">{{ ath.phone }}</span>
                                                </div>
                                            </td>

                                            <!-- Col 3: Custom Fields Preview -->
                                            <td v-if="validCustomFields.length > 0" class="py-3 px-3.5">
                                                <div v-if="hasCustomFields(ath.custom_fields)" class="flex flex-wrap gap-1 max-w-xs">
                                                    <span
                                                        v-for="(val, key) in ath.custom_fields"
                                                        :key="key"
                                                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200">
                                                        <span class="font-bold text-navy">{{ getCustomFieldLabel(key) }}:</span>
                                                        <span>{{ Array.isArray(val) ? val.join(', ') : val }}</span>
                                                    </span>
                                                </div>
                                                <span v-else class="text-xs text-slate-400 italic">
                                                    {{ isEn ? 'No custom data' : 'Tidak ada data custom' }}
                                                </span>
                                            </td>

                                            <!-- Col 4: Account Status Badge -->
                                            <td class="py-3 px-3.5 whitespace-nowrap">
                                                <span v-if="ath.is_already_in_roster" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                                                    <Icon icon="ph:warning-bold" />
                                                    <span>{{ isEn ? 'In Roster' : 'Sudah di Daftar' }}</span>
                                                </span>
                                                <span v-else-if="ath.is_already_registered" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                                                    <Icon icon="ph:warning-circle-bold" />
                                                    <span>{{ isEn ? 'Registered' : 'Sudah Terdaftar' }}</span>
                                                </span>
                                                <span v-else-if="ath.is_existing_user" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                                                    <Icon icon="ph:user-check-bold" />
                                                    <span>{{ isEn ? 'Existing User' : 'Akun Terdaftar' }}</span>
                                                </span>
                                                <span v-else class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                    <Icon icon="ph:user-plus-bold" />
                                                    <span>{{ isEn ? 'New Account' : 'Akun Baru' }}</span>
                                                </span>
                                            </td>

                                            <!-- Col 5: Verification Note -->
                                            <td class="py-3 px-3.5 text-xs">
                                                <span v-if="ath.is_already_in_roster" class="text-amber-700 font-medium">
                                                    {{ isEn ? 'Already in delegation roster (will be skipped)' : 'Sudah ada di daftar kontingen (akan dilewati)' }}
                                                </span>
                                                <span v-else-if="ath.is_already_registered" class="text-red-600 font-medium">
                                                    {{ isEn ? 'Already registered in this tournament' : 'Sudah terdaftar di turnamen ini' }}
                                                </span>
                                                <span v-else-if="ath.is_existing_user" class="text-slate-600 font-medium">
                                                    {{ isEn ? 'Matched registered Archeris account' : 'Ditemukan profil terdaftar di Archeris' }}
                                                </span>
                                                <span v-else class="text-slate-500">
                                                    {{ isEn ? 'Auto account created (Pass: Archeris123!)' : 'Akun baru dibuat otomatis (Sandi: Archeris123!)' }}
                                                </span>

                                                <div v-if="ath.missing_required_fields && ath.missing_required_fields.length > 0 && !ath.is_already_in_roster && !ath.is_already_registered" class="mt-1 flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                                                    <Icon icon="ph:warning-circle-bold" class="text-xs shrink-0 text-amber-600" />
                                                    <span>{{ isEn ? `Missing required: ${ath.missing_required_fields.join(', ')}` : `Data wajib kosong: ${ath.missing_required_fields.join(', ')}` }}</span>
                                                </div>
                                            </td>

                                            <!-- Col 6: Remove Action -->
                                            <td class="py-3 px-3 text-center">
                                                <button
                                                    type="button"
                                                    @click="removeRow(idx)"
                                                    class="size-7 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                    :title="isEn ? 'Remove row' : 'Hapus baris'">
                                                    <Icon icon="ph:trash-bold" class="text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="px-6 py-4 bg-slate-50/80 border-t border-slate-200/90 flex items-center justify-between shrink-0">
                    <div>
                        <BaseButton
                            v-if="parsedRows.length > 0 && !verifying"
                            @click="resetUpload"
                            variant="white"
                            size="sm"
                            icon="ph:arrow-counter-clockwise-bold"
                            class="text-xs font-bold border-slate-200">
                            {{ isEn ? 'Re-upload CSV' : 'Unggah Ulang CSV' }}
                        </BaseButton>
                    </div>

                    <div class="flex items-center gap-2.5">
                        <button
                            type="button"
                            @click="close"
                            class="px-4 py-2 rounded-xl border border-slate-200 text-navy font-bold text-xs sm:text-sm hover:bg-slate-100 transition-colors cursor-pointer">
                            {{ isEn ? 'Cancel' : 'Batal' }}
                        </button>

                        <BaseButton
                            @click="applyImportedAthletes"
                            variant="navy"
                            size="md"
                            icon-right="ph:check-bold"
                            :disabled="parsedRows.length === 0 || verifying || readyCount === 0"
                            class="text-xs sm:text-sm font-black shadow-xs">
                            {{ isEn ? `Import ${readyCount} Archers` : `Masukkan ${readyCount} Atlet ke Daftar` }}
                        </BaseButton>
                    </div>
                </div>

            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import BaseButton from '~/components/common/BaseButton.vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    show: { type: Boolean, default: false },
    tournamentId: { type: [String, Number], required: true },
    tournamentName: { type: String, default: 'Tournament' },
    categories: { type: Array, default: () => [] },
    existingEmails: { type: Array, default: () => [] },
    customFields: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'imported'])

const { locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')
const { get, post } = useApi()

const isDragging = ref(false)
const verifying = ref(false)
const fileInputRef = ref(null)
const parsedRows = ref([])
const localCustomFields = ref([])

// Load custom fields from prop or API
const loadCustomFields = async () => {
    if (Array.isArray(props.customFields) && props.customFields.length > 0) {
        localCustomFields.value = props.customFields
        return
    }
    if (!props.tournamentId) return
    try {
        const res = await get(`/tournaments/${props.tournamentId}/custom-fields`)
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

const close = () => {
    emit('close')
}

const resetUpload = () => {
    parsedRows.value = []
    if (fileInputRef.value) fileInputRef.value.value = ''
}

const triggerFileInput = () => {
    fileInputRef.value?.click()
}

// Filter active input custom fields
const validCustomFields = computed(() => {
    return (localCustomFields.value || []).filter(f => 
        f.is_active !== false && !['heading', 'divider', 'spacer', 'notice'].includes(f.element_type)
    )
})

const templateCoreColumns = computed(() => [
    { key: 'full_name', label: isEn.value ? 'Full Name' : 'Nama Lengkap', required: true, sample: ['Faris Aditya Pratama', 'Rizky Kurniawan', 'Siti Rahmawati'] },
    { key: 'email', label: 'Email', required: true, sample: ['faris.aditya@example.com', 'rizky.kurniawan@example.com', 'siti.rahmawati@example.com'] },
    { key: 'gender', label: isEn.value ? 'Gender (Male/Female)' : 'Jenis Kelamin (L/P atau Putra/Putri)', required: true, sample: ['Male', 'Male', 'Female'] },
    { key: 'club_name', label: isEn.value ? 'Club / Origin' : 'Klub / Asal Kontingen', required: false, sample: ['Fast Archery Club', 'Eagle Archery Club', 'Fast Archery Club'] },
    { key: 'phone', label: isEn.value ? 'Phone Number' : 'No. Telepon / WhatsApp', required: false, sample: ['081234567890', '081298765432', '081377889900'] },
    { key: 'date_of_birth', label: isEn.value ? 'Date of Birth (YYYY-MM-DD)' : 'Tanggal Lahir (YYYY-MM-DD)', required: false, sample: ['2008-05-20', '2008-11-14', '2009-02-15'] }
])

const getCustomFieldLabel = (key) => {
    const cf = validCustomFields.value.find(f => (f.field_key && f.field_key === key) || f.uuid === key)
    return cf?.label_id || cf?.label_en || key
}

const hasCustomFields = (cfObj) => {
    if (!cfObj || typeof cfObj !== 'object') return false
    return Object.values(cfObj).some(v => v !== undefined && v !== null && v !== '')
}

// ─── CSV TEMPLATE GENERATOR (Exact tournament core + dynamic EO custom fields) ──
const downloadCsvTemplate = () => {
    const coreCols = templateCoreColumns.value

    const customCols = validCustomFields.value.map((f, fIdx) => {
        const title = f.label_id || f.label_en || f.field_key || `Custom Field ${fIdx + 1}`
        return {
            key: f.field_key || f.uuid || `cf_${fIdx}`,
            label: title,
            required: !!f.is_required,
            field: f
        }
    })

    const allHeaders = [...coreCols.map(c => c.label), ...customCols.map(c => c.label)]

    const getSampleCustomVal = (field, idx) => {
        if (field.field_type === 'number') return idx === 0 ? '123' : '456'
        if (field.field_type === 'select' || field.field_type === 'radio') {
            if (Array.isArray(field.options) && field.options.length > 0) {
                const opt = field.options[idx % field.options.length]
                return typeof opt === 'object' ? (opt.label || opt.value || opt.id) : opt
            }
            return 'Pilihan 1'
        }
        if (field.field_type === 'checkbox') {
            if (Array.isArray(field.options) && field.options.length > 0) {
                const opt = field.options[0]
                return typeof opt === 'object' ? (opt.label || opt.value || opt.id) : opt
            }
            return 'Ya'
        }
        if (field.field_type === 'date') return idx === 0 ? '2008-01-15' : '2007-07-22'
        return idx === 0 ? 'Contoh Nilai 1' : 'Contoh Nilai 2'
    }

    const rows = [0, 1, 2].map(rowIdx => {
        const coreRow = coreCols.map(c => c.sample[rowIdx] || '')
        const customRow = customCols.map(c => getSampleCustomVal(c.field, rowIdx))
        return [...coreRow, ...customRow]
    })

    const csvLines = [
        allHeaders.join(','),
        ...rows.map(row => row.map(val => `"${String(val ?? '').replace(/"/g, '""')}"`).join(','))
    ]

    const csvContent = '\uFEFF' + csvLines.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    const cleanTournamentName = String(props.tournamentName || 'turnamen').toLowerCase().replace(/[^a-z0-9]/g, '-')
    link.setAttribute('download', `template-import-atlet-${cleanTournamentName}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}

// ─── FILE PARSER & VERIFICATION ───────────────────────────────────────────────
const handleFileDrop = (evt) => {
    isDragging.value = false
    const file = evt.dataTransfer.files?.[0]
    if (file) parseAndVerifyFile(file)
}

const handleFileSelect = (evt) => {
    const file = evt.target.files?.[0]
    if (file) parseAndVerifyFile(file)
}

const parseAndVerifyFile = async (file) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
        const text = e.target.result
        if (!text) return
        await processCsvText(text)
    }
    reader.readAsText(file)
}

const normalizeStr = (str) => String(str || '').toLowerCase().replace(/[^a-z0-9]/g, '')

const parseGender = (raw) => {
    const g = String(raw || '').toLowerCase().trim()
    if (g.startsWith('w') || g.startsWith('f') || g.includes('putri') || g.includes('wanita') || g.includes('perempuan') || g === 'p') {
        return 'female'
    }
    return 'male'
}

const processCsvText = async (csvText) => {
    verifying.value = true
    try {
        const lines = csvText.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0)
        if (lines.length <= 1) {
            alert(isEn.value ? 'CSV file is empty or only contains headers.' : 'File CSV kosong atau hanya berisi judul kolom.')
            verifying.value = false
            return
        }

        // Detect delimiter: comma or semicolon
        const firstLine = lines[0]
        const delimiter = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ','

        // Parse CSV Header (Clean BOM & trim quotes)
        const headers = lines[0]
            .replace(/^\uFEFF/, '')
            .split(delimiter)
            .map(h => h.trim().replace(/^"|"$/g, ''))

        const colMap = {
            full_name: headers.findIndex(h => {
                const hn = normalizeStr(h)
                return hn.includes('name') || hn.includes('nama') || hn.includes('atlet') || hn.includes('archer')
            }),
            email: headers.findIndex(h => {
                const hn = normalizeStr(h)
                return hn.includes('email') || hn.includes('surel') || hn.includes('mail')
            }),
            gender: headers.findIndex(h => {
                const hn = normalizeStr(h)
                return hn.includes('gender') || hn.includes('kelamin') || hn.includes('jk') || hn.includes('sex')
            }),
            phone: headers.findIndex(h => {
                const hn = normalizeStr(h)
                return hn.includes('phone') || hn.includes('wa') || hn.includes('hp') || hn.includes('telp') || hn.includes('telepon') || hn.includes('kontak')
            }),
            date_of_birth: headers.findIndex(h => {
                const hn = normalizeStr(h)
                return hn.includes('birth') || hn.includes('dob') || hn.includes('lahir') || hn.includes('tgl')
            }),
            club_name: headers.findIndex(h => {
                const hn = normalizeStr(h)
                return hn.includes('club') || hn.includes('klub') || hn.includes('sekolah') || hn.includes('school') || hn.includes('kontingen') || hn.includes('asal') || hn.includes('origin')
            })
        }

        // Map custom fields to columns
        const customFieldColMap = []
        for (const field of validCustomFields.value) {
            const fieldKeyNorm = normalizeStr(field.field_key)
            const labelIdNorm = normalizeStr(field.label_id)
            const labelEnNorm = normalizeStr(field.label_en)
            
            const foundIdx = headers.findIndex(h => {
                const hn = normalizeStr(h)
                return (fieldKeyNorm && (hn === fieldKeyNorm || hn.includes(fieldKeyNorm))) ||
                    (labelIdNorm && (hn === labelIdNorm || hn.includes(labelIdNorm))) ||
                    (labelEnNorm && (hn === labelEnNorm || hn.includes(labelEnNorm)))
            })
            if (foundIdx !== -1) {
                customFieldColMap.push({ 
                    field_key: field.field_key, 
                    col_idx: foundIdx, 
                    field_type: field.field_type,
                    label: field.label_id || field.label_en || field.field_key 
                })
            }
        }

        const rawAthletes = []
        for (let i = 1; i < lines.length; i++) {
            const rawLine = lines[i].trim()
            if (!rawLine) continue

            const pattern = new RegExp(`(?:${delimiter}|^)(?:"([^"]*)"|([^"${delimiter}]*))`, 'g')
            const cols = []
            let match
            while ((match = pattern.exec(rawLine)) !== null) {
                cols.push((match[1] !== undefined ? match[1] : match[2] || '').trim())
            }

            const getCol = (idx) => (idx >= 0 && cols[idx] ? cols[idx].trim() : '')

            const email = getCol(colMap.email)
            const fullName = getCol(colMap.full_name)
            if (!email && !fullName) continue

            // Extract custom fields values
            const customFieldValues = {}
            for (const cf of customFieldColMap) {
                const rawVal = getCol(cf.col_idx)
                if (rawVal !== '') {
                    if (cf.field_type === 'number') {
                        const num = Number(rawVal)
                        customFieldValues[cf.field_key] = isNaN(num) ? rawVal : num
                    } else {
                        customFieldValues[cf.field_key] = rawVal
                    }
                }
            }

            rawAthletes.push({
                full_name: fullName,
                email: email,
                gender: parseGender(getCol(colMap.gender)),
                phone: getCol(colMap.phone),
                date_of_birth: getCol(colMap.date_of_birth),
                club_name: getCol(colMap.club_name),
                custom_fields: customFieldValues
            })
        }

        if (rawAthletes.length === 0) {
            alert(isEn.value ? 'No valid athlete rows found in CSV.' : 'Tidak ditemukan baris data atlet yang valid dalam file CSV.')
            verifying.value = false
            return
        }

        // Call backend batch verify API
        let verifyResults = []
        try {
            const res = await post(`/tournaments/${props.tournamentId}/verify-roster`, { athletes: rawAthletes })
            verifyResults = res.results || []
        } catch (apiErr) {
            verifyResults = rawAthletes.map((ath, idx) => ({
                row_index: idx + 1,
                full_name: ath.full_name,
                email: ath.email,
                gender: ath.gender,
                phone: ath.phone,
                date_of_birth: ath.date_of_birth,
                club_name: ath.club_name,
                custom_fields: ath.custom_fields || {},
                is_existing_user: false,
                is_already_registered: false,
                status: 'ready_new'
            }))
        }

        parsedRows.value = verifyResults.map((r, idx) => {
            const rawAth = rawAthletes[idx] || {}
            const emailClean = (r.email || '').toLowerCase().trim()
            const isInCurrentRoster = emailClean && props.existingEmails.some(e => (e || '').toLowerCase().trim() === emailClean)
            const athCustomFields = r.custom_fields || rawAth.custom_fields || {}

            const missingRequired = validCustomFields.value
                .filter(f => f.is_required)
                .filter(f => {
                    const val = athCustomFields[f.field_key]
                    return val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)
                })
                .map(f => f.label_id || f.label_en || f.field_key)

            return {
                row_index: r.row_index || idx + 1,
                full_name: r.full_name || rawAth.full_name,
                email: r.email || rawAth.email,
                gender: r.gender || rawAth.gender || 'male',
                phone: r.phone || rawAth.phone || '',
                date_of_birth: r.date_of_birth || rawAth.date_of_birth || '',
                club_name: r.club_name || rawAth.club_name || '',
                avatar_url: r.avatar_url || '',
                custom_fields: athCustomFields,
                missing_required_fields: missingRequired,
                is_existing_user: !!r.is_existing_user,
                archer_id: r.archer_id || null,
                is_already_registered: !!r.is_already_registered,
                is_already_in_roster: isInCurrentRoster,
                status: isInCurrentRoster ? 'already_in_roster' : r.status
            }
        })

    } catch (err) {
        console.error('Error processing CSV:', err)
        alert(isEn.value ? 'Error reading CSV file. Please verify format with the template.' : 'Terjadi kesalahan saat membaca file CSV. Pastikan format sesuai dengan template.')
    } finally {
        verifying.value = false
    }
}

// ─── COMPUTED METRICS ────────────────────────────────────────────────────────
const readyCount = computed(() => {
    return parsedRows.value.filter(r => !r.is_already_registered && !r.is_already_in_roster).length
})

const removeRow = (idx) => {
    parsedRows.value.splice(idx, 1)
}

// ─── APPLY IMPORTED ATHLETES TO ROSTER ─────────────────────────────────────────
const applyImportedAthletes = () => {
    const validAthletes = parsedRows.value
        .filter(r => !r.is_already_registered && !r.is_already_in_roster)
        .map(r => ({
            archer_id: r.archer_id || null,
            full_name: r.full_name,
            email: r.email,
            gender: r.gender,
            phone: r.phone,
            date_of_birth: r.date_of_birth,
            club_name: r.club_name,
            custom_fields: r.custom_fields || {},
            category_ids: [],
            category_id: '',
            avatar_url: r.avatar_url || '',
            is_new_account: !r.is_existing_user
        }))

    emit('imported', validAthletes)
    close()
}
</script>
