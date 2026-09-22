<template>
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div class="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
                
                <!-- Modal Header -->
                <div class="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/70 shrink-0">
                    <div class="flex items-start gap-3.5">
                        <div class="size-11 rounded-2xl bg-navy text-primary flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                            <Icon icon="ph:file-csv-bold" class="text-2xl" />
                        </div>
                        <div>
                            <h3 class="text-base sm:text-lg font-black text-navy leading-snug">
                                {{ isEn ? 'Bulk Import Athlete Roster (CSV)' : 'Import Data Atlet via CSV' }}
                            </h3>
                            <div class="text-xs sm:text-sm text-slate-500 mt-0.5">
                                {{ isEn ? 'Upload CSV file containing archer names, emails, and origins.' : 'Unggah file CSV berisi data nama atlet, email, jenis kelamin, dan klub.' }}
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        @click="close"
                        class="size-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-navy hover:bg-slate-200 transition-colors cursor-pointer shrink-0">
                        <Icon icon="ph:x-bold" class="text-base" />
                    </button>
                </div>

                <!-- Body -->
                <div class="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
                    
                    <!-- Download Template Strip -->
                    <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div class="flex items-center gap-3">
                            <div class="size-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                                <Icon icon="ph:info" class="text-lg" />
                            </div>
                            <div class="text-xs sm:text-sm text-slate-700">
                                <span class="font-bold text-navy">{{ isEn ? 'Official CSV Template' : 'Format CSV Resmi' }}</span>
                                <span class="text-slate-400 mx-1.5">•</span>
                                <span class="text-slate-500">Full Name, Email, Gender, Phone Number, Date of Birth, Club Name</span>
                            </div>
                        </div>
                        <BaseButton
                            @click="downloadCsvTemplate"
                            variant="white"
                            size="sm"
                            icon="ph:download-simple-bold"
                            class="shrink-0 text-xs font-bold shadow-2xs">
                            {{ isEn ? 'Download Template CSV' : 'Unduh Template CSV' }}
                        </BaseButton>
                    </div>

                    <!-- Dropzone (Initial State) -->
                    <div v-if="parsedRows.length === 0 && !verifying">
                        <div
                            @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false"
                            @drop.prevent="handleFileDrop"
                            @click="triggerFileInput"
                            :class="[
                                'border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 bg-slate-50/50',
                                isDragging ? 'border-navy bg-slate-100 scale-[0.99]' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                            ]">
                            
                            <input
                                ref="fileInputRef"
                                type="file"
                                accept=".csv"
                                class="hidden"
                                @change="handleFileSelect" />

                            <div class="size-12 rounded-2xl bg-slate-200 text-slate-600 flex items-center justify-center shadow-2xs">
                                <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl text-navy" />
                            </div>

                            <div class="space-y-1">
                                <div class="text-sm sm:text-base font-bold text-navy">
                                    {{ isEn ? 'Click or drag & drop CSV file here' : 'Klik atau Tarik File CSV ke Sini' }}
                                </div>
                                <div class="text-xs text-slate-400">
                                    {{ isEn ? 'Supports standard .csv file format (UTF-8, comma or semicolon separated)' : 'Mendukung file .csv standar (UTF-8, pemisah koma atau titik koma)' }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Verifying Spinner -->
                    <div v-if="verifying" class="py-14 text-center space-y-3">
                        <div class="size-10 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs flex items-center justify-center mx-auto text-navy">
                            <Icon icon="ph:spinner-gap-bold" class="text-xl text-navy animate-spin" />
                        </div>
                        <div class="text-sm font-bold text-navy">
                            {{ isEn ? 'Verifying athlete data...' : 'Memverifikasi data & akun atlet...' }}
                        </div>
                        <div class="text-xs text-slate-400">
                            {{ isEn ? 'Checking accounts and tournament eligibility.' : 'Mengecek status akun dan duplikasi peserta...' }}
                        </div>
                    </div>

                    <!-- Review Table (Parsed State) -->
                    <div v-if="parsedRows.length > 0 && !verifying" class="space-y-3">
                        <div class="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
                            <span>{{ isEn ? `Found ${parsedRows.length} archers in CSV` : `Ditemukan ${parsedRows.length} data atlet dari file CSV` }}</span>
                            <span class="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                                {{ readyCount }} {{ isEn ? 'ready to add' : 'siap dimasukkan ke daftar' }}
                            </span>
                        </div>

                        <!-- Data Table (No native select) -->
                        <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                            <div class="overflow-x-auto max-h-[380px]">
                                <table class="w-full text-left border-collapse text-xs sm:text-sm">
                                    <thead class="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold sticky top-0 z-10">
                                        <tr>
                                            <th class="py-2.5 px-3 w-10 text-center text-slate-400">#</th>
                                            <th class="py-2.5 px-3.5">{{ isEn ? 'Athlete Profile' : 'Profil Atlet' }}</th>
                                            <th class="py-2.5 px-3.5 w-36">{{ isEn ? 'Account Status' : 'Status Akun' }}</th>
                                            <th class="py-2.5 px-3.5">{{ isEn ? 'Verification Note' : 'Keterangan' }}</th>
                                            <th class="py-2.5 px-3 w-10 text-center text-slate-400">{{ isEn ? 'Action' : 'Aksi' }}</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-slate-100">
                                        <tr v-for="(ath, idx) in parsedRows" :key="idx" class="hover:bg-slate-50/60 transition-colors">
                                            <td class="py-2.5 px-3 text-center font-bold text-slate-400 text-xs">
                                                {{ idx + 1 }}
                                            </td>
                                            <td class="py-2.5 px-3.5">
                                                <div class="font-bold text-navy leading-snug">{{ ath.full_name || 'Nama Belum Diisi' }}</div>
                                                <div class="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1.5 flex-wrap">
                                                    <span>{{ ath.email }}</span>
                                                    <span v-if="ath.phone" class="text-slate-300">•</span>
                                                    <span v-if="ath.phone">{{ ath.phone }}</span>
                                                    <span class="text-slate-300">•</span>
                                                    <span class="font-semibold" :class="ath.gender === 'female' ? 'text-rose-600' : 'text-slate-700'">
                                                        {{ ath.gender === 'female' ? 'Female' : 'Male' }}
                                                    </span>
                                                    <span v-if="ath.club_name" class="text-slate-300">•</span>
                                                    <span v-if="ath.club_name" class="text-slate-600 font-medium">{{ ath.club_name }}</span>
                                                </div>
                                            </td>
                                            <td class="py-2.5 px-3.5 whitespace-nowrap">
                                                <span v-if="ath.is_already_in_roster" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                                                    <Icon icon="ph:warning-bold" />
                                                    <span>{{ isEn ? 'In Roster' : 'Sudah di Daftar' }}</span>
                                                </span>
                                                <span v-else-if="ath.is_already_registered" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                                                    <Icon icon="ph:warning-circle-bold" />
                                                    <span>{{ isEn ? 'Registered' : 'Sudah Terdaftar' }}</span>
                                                </span>
                                                <span v-else-if="ath.is_existing_user" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                                                    <Icon icon="ph:user-check-bold" />
                                                    <span>{{ isEn ? 'Existing' : 'Akun Terdaftar' }}</span>
                                                </span>
                                                <span v-else class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                    <Icon icon="ph:user-plus-bold" />
                                                    <span>{{ isEn ? 'New' : 'Akun Baru' }}</span>
                                                </span>
                                            </td>
                                            <td class="py-2.5 px-3.5 text-slate-600 text-xs">
                                                <span v-if="ath.is_already_in_roster" class="text-amber-700 font-medium">
                                                    {{ isEn ? 'Already in your delegation roster (will be skipped)' : 'Sudah ada di daftar kontingen Anda (akan dilewati)' }}
                                                </span>
                                                <span v-else-if="ath.is_already_registered" class="text-red-600 font-medium">
                                                    {{ isEn ? 'Already registered in this event' : 'Sudah terdaftar di turnamen ini' }}
                                                </span>
                                                <span v-else-if="ath.is_existing_user" class="text-slate-600">
                                                    {{ isEn ? 'Matched registered account' : 'Ditemukan akun terdaftar di sistem' }}
                                                </span>
                                                <span v-else class="text-slate-500">
                                                    {{ isEn ? 'New account created (Default pass: Archeris123!)' : 'Akun baru dibuat otomatis (Sandi: Archeris123!)' }}
                                                </span>
                                            </td>
                                            <td class="py-2.5 px-3 text-center">
                                                <button
                                                    type="button"
                                                    @click="removeRow(idx)"
                                                    class="size-7 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-500 inline-flex items-center justify-center transition-colors cursor-pointer"
                                                    :title="isEn ? 'Remove row' : 'Hapus baris'">
                                                    <Icon icon="ph:trash" class="text-sm" />
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer (Clean Style) -->
                <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
                    <div>
                        <BaseButton
                            v-if="parsedRows.length > 0 && !verifying"
                            @click="resetUpload"
                            variant="white"
                            size="sm"
                            icon="ph:arrow-counter-clockwise"
                            class="text-xs font-bold">
                            {{ isEn ? 'Re-upload' : 'Unggah Ulang' }}
                        </BaseButton>
                    </div>

                    <div class="flex items-center gap-2.5">
                        <BaseButton
                            @click="close"
                            variant="white"
                            size="sm"
                            class="h-9 px-4 text-xs font-bold">
                            {{ isEn ? 'Cancel' : 'Batal' }}
                        </BaseButton>

                        <BaseButton
                            @click="applyImportedAthletes"
                            variant="navy"
                            size="sm"
                            icon-right="ph:check-bold"
                            :disabled="parsedRows.length === 0 || verifying || readyCount === 0"
                            class="h-9 px-5 text-xs font-bold">
                            {{ isEn ? `Import ${readyCount} Archers` : `Masukkan ${readyCount} Atlet` }}
                        </BaseButton>
                    </div>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseButton from '~/components/common/BaseButton.vue'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

const props = defineProps({
    show: { type: Boolean, default: false },
    tournamentId: { type: [String, Number], required: true },
    tournamentName: { type: String, default: 'Tournament' },
    categories: { type: Array, default: () => [] },
    existingEmails: { type: Array, default: () => [] }
})

const emit = defineEmits(['close', 'imported'])

const { locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')
const { post } = useApi()

const isDragging = ref(false)
const verifying = ref(false)
const fileInputRef = ref(null)
const parsedRows = ref([])

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

// ─── CSV TEMPLATE GENERATOR (Natural common headers, NO category column) ─────
const downloadCsvTemplate = () => {
    const headers = ['Full Name', 'Email', 'Gender', 'Phone Number', 'Date of Birth', 'Club Name']
    
    const sampleRows = [
        ['Faris Aditya Pratama', 'faris.aditya@example.com', 'Male', '081234567890', '2008-05-20', 'Fast Archery Club'],
        ['Rizky Kurniawan', 'rizky.kurniawan@example.com', 'Male', '081298765432', '2008-11-14', 'Eagle Archery'],
        ['Siti Rahmawati', 'siti.rahmawati@example.com', 'Female', '081377889900', '2009-02-15', 'Fast Archery Club']
    ]

    const csvLines = [
        headers.join(','),
        ...sampleRows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ]

    const csvContent = '\uFEFF' + csvLines.join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `template-atlet-${props.tournamentName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.csv`)
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

const processCsvText = async (csvText) => {
    verifying.value = true
    try {
        const lines = csvText.split(/\r\n|\n|\r/).filter(l => l.trim().length > 0)
        if (lines.length <= 1) {
            alert(isEn.value ? 'CSV file is empty or only has headers.' : 'File CSV kosong atau hanya berisi judul kolom.')
            verifying.value = false
            return
        }

        // Detect delimiter: comma or semicolon
        const firstLine = lines[0]
        const delimiter = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ','

        // Parse CSV Header (Natural names normalized)
        const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase())
        
        const colMap = {
            full_name: headers.findIndex(h => h.includes('name') || h.includes('nama')),
            email: headers.findIndex(h => h.includes('email') || h.includes('surel') || h.includes('mail')),
            gender: headers.findIndex(h => h.includes('gender') || h.includes('kelamin') || h.includes('jk') || h.includes('sex')),
            phone: headers.findIndex(h => h.includes('phone') || h.includes('wa') || h.includes('hp') || h.includes('telp') || h.includes('telepon')),
            date_of_birth: headers.findIndex(h => h.includes('birth') || h.includes('dob') || h.includes('lahir') || h.includes('tgl')),
            club_name: headers.findIndex(h => h.includes('club') || h.includes('klub') || h.includes('sekolah') || h.includes('school') || h.includes('kontingen'))
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

            rawAthletes.push({
                full_name: fullName,
                email: email,
                gender: getCol(colMap.gender) || 'male',
                phone: getCol(colMap.phone),
                date_of_birth: getCol(colMap.date_of_birth),
                club_name: getCol(colMap.club_name)
            })
        }

        if (rawAthletes.length === 0) {
            alert(isEn.value ? 'No valid athlete rows found in file.' : 'Tidak ditemukan baris data atlet yang valid.')
            verifying.value = false
            return
        }

        // Call backend batch verify API
        let verifyResults = []
        try {
            const res = await post(`/tournaments/${props.tournamentId}/verify-roster`, { athletes: rawAthletes })
            verifyResults = res.results || []
        } catch (apiErr) {
            verifyResults = rawAthletes.map((ath, idx) => {
                const gRaw = (ath.gender || '').toLowerCase().trim()
                let gMapped = 'male'
                if (gRaw.startsWith('w') || gRaw.startsWith('f') || gRaw.includes('putri') || gRaw.includes('wanita') || gRaw.includes('perempuan')) {
                    gMapped = 'female'
                } else if (gRaw.startsWith('m') || gRaw.startsWith('pria') || gRaw.includes('putra') || gRaw.includes('laki') || gRaw === 'l') {
                    gMapped = 'male'
                }

                return {
                    row_index: idx + 1,
                    full_name: ath.full_name,
                    email: ath.email,
                    gender: gMapped,
                    phone: ath.phone,
                    date_of_birth: ath.date_of_birth,
                    club_name: ath.club_name,
                    is_existing_user: false,
                    is_already_registered: false,
                    status: 'ready_new'
                }
            })
        }

        parsedRows.value = verifyResults.map(r => {
            const emailClean = (r.email || '').toLowerCase().trim()
            const isInCurrentRoster = emailClean && props.existingEmails.some(e => (e || '').toLowerCase().trim() === emailClean)
            return {
                row_index: r.row_index,
                full_name: r.full_name,
                email: r.email,
                gender: r.gender || 'male',
                phone: r.phone || '',
                date_of_birth: r.date_of_birth || '',
                club_name: r.club_name || '',
                avatar_url: r.avatar_url || '',
                is_existing_user: !!r.is_existing_user,
                archer_id: r.archer_id || null,
                is_already_registered: !!r.is_already_registered,
                is_already_in_roster: isInCurrentRoster,
                status: isInCurrentRoster ? 'already_in_roster' : r.status
            }
        })

    } catch (err) {
        console.error('Error processing CSV:', err)
        alert(isEn.value ? 'Error reading CSV file. Please check the template.' : 'Terjadi kesalahan saat membaca file CSV. Pastikan format sesuai template.')
    } finally {
        verifying.value = false
    }
}

// ─── METRIC COMPUTED VALUES ───────────────────────────────────────────────────
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
            category_ids: [],
            category_id: '',
            avatar_url: r.avatar_url,
            is_new_account: !r.is_existing_user
        }))

    emit('imported', validAthletes)
    close()
}
</script>
