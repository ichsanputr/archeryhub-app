import re

target_file = r'c:\E\ichsan\startup\archeryhub.id\app\pages\tournaments\[slug]\register.vue'

with open(target_file, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Replace <p> tag on line 1411
content = content.replace(
    '<p class="text-xs text-slate-500">{{ isEn ? `Apply category to ${selectedAthleteEmails.length} selected archers` : `Terapkan ke ${selectedAthleteEmails.length} atlet terpilih` }}</p>',
    '<div class="text-xs text-slate-500">{{ isEn ? `Apply category to ${selectedAthleteEmails.length} selected archers` : `Terapkan ke ${selectedAthleteEmails.length} atlet terpilih` }}</div>'
)

# 2. Fix isEn
content = content.replace(
    "const isEn = computed(() => true)",
    "const isEn = computed(() => locale.value !== 'id')"
)

# 3. Add proof state variables
old_payment_state = """// Payment State
const paymentType = ref('online')
const manualMethodId = ref('')
const senderName = ref('')
const proofFileUrl = ref('')
const uploadingProof = ref(false)
const proofInput = ref(null)"""

new_payment_state = """// Payment State
const paymentType = ref('online')
const manualMethodId = ref('')
const senderName = ref('')
const proofFileUrl = ref('')
const proofFileName = ref('')
const proofFileSize = ref('')
const uploadingProof = ref(false)
const proofInput = ref(null)

const removeProofFile = () => {
    proofFileUrl.value = ''
    proofFileName.value = ''
    proofFileSize.value = ''
    if (proofInput.value) {
        proofInput.value.value = ''
    }
}"""

content = content.replace(old_payment_state, new_payment_state)

# 4. Update handleProofUpload
old_handle_proof = """const handleProofUpload = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return
    uploadingProof.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `proof-${slug}-${Date.now()}`)
        const res = await upload('/media/upload', formData)
        proofFileUrl.value = res.url || res.URL || ''
    } catch (err) {
        toast.error(isEn.value ? 'Failed to upload proof' : 'Gagal mengunggah bukti transfer')
    } finally {
        uploadingProof.value = false
    }
}"""

new_handle_proof = """const handleProofUpload = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return
    
    if (file.size > 5 * 1024 * 1024) {
        toast.error(isEn.value ? 'File size exceeds 5MB limit' : 'Ukuran file melebihi batas 5MB')
        return
    }

    proofFileName.value = file.name
    proofFileSize.value = (file.size / (1024 * 1024)).toFixed(2) + ' MB'
    uploadingProof.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `proof-${slug}-${Date.now()}`)
        const res = await upload('/media/upload', formData)
        proofFileUrl.value = res.url || res.URL || ''
    } catch (err) {
        proofFileName.value = ''
        proofFileSize.value = ''
        toast.error(isEn.value ? 'Failed to upload proof' : 'Gagal mengunggah bukti transfer')
    } finally {
        uploadingProof.value = false
    }
}"""

content = content.replace(old_handle_proof, new_handle_proof)

# 5. Redesign receipt upload template
old_receipt_template = """                                                <div class="space-y-1.5">
                                                    <label class="text-xs font-bold text-navy block">
                                                        {{ isEn ? 'Upload Transfer Receipt' : 'Unggah Foto Bukti Transfer' }} <span class="text-rose-500">*</span>
                                                    </label>
                                                    <div
                                                        @click="triggerFileInput"
                                                        class="border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all bg-white hover:border-navy hover:shadow-xs group"
                                                        :class="proofFileUrl ? 'border-emerald-300 bg-emerald-50/30' : 'border-slate-300'">
                                                        <input ref="proofInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleProofUpload" />
                                                        
                                                        <div v-if="uploadingProof" class="py-4 space-y-2">
                                                            <Icon icon="ph:spinner-gap-bold" class="text-2xl text-navy animate-spin mx-auto" />
                                                            <div class="text-xs font-semibold text-slate-600">{{ isEn ? 'Uploading receipt...' : 'Mengunggah bukti transfer...' }}</div>
                                                        </div>

                                                        <div v-else-if="proofFileUrl" class="space-y-3">
                                                            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                                                <Icon icon="ph:check-circle-fill" class="text-sm text-emerald-600" />
                                                                <span>{{ isEn ? 'Receipt uploaded successfully' : 'Bukti transfer berhasil diunggah' }}</span>
                                                            </div>

                                                            <div v-if="!proofFileUrl.toLowerCase().endsWith('.pdf')" class="relative inline-block max-w-full">
                                                                <img
                                                                    :src="proofFileUrl"
                                                                    alt="Receipt"
                                                                    class="mx-auto rounded-xl border border-emerald-200 max-h-48 object-contain shadow-2xs" />
                                                            </div>
                                                            <div v-else class="inline-flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2.5 rounded-xl shadow-2xs">
                                                                <Icon icon="ph:file-pdf-bold" class="text-xl text-rose-500 shrink-0" />
                                                                <span>PDF Transfer Receipt</span>
                                                            </div>

                                                            <div class="text-[11px] font-bold text-navy group-hover:underline flex items-center justify-center gap-1 pt-1">
                                                                <Icon icon="ph:arrows-clockwise-bold" class="text-xs" />
                                                                <span>{{ isEn ? 'Click to change receipt file' : 'Klik di sini untuk mengganti foto bukti' }}</span>
                                                            </div>
                                                        </div>

                                                        <div v-else class="py-4 space-y-2">
                                                            <div class="size-10 rounded-full bg-slate-100 group-hover:bg-navy/10 flex items-center justify-center mx-auto text-slate-400 group-hover:text-navy transition-colors">
                                                                <Icon icon="ph:cloud-arrow-up-bold" class="text-xl" />
                                                            </div>
                                                            <div>
                                                                <div class="text-xs font-bold text-slate-700 group-hover:text-navy">
                                                                    {{ isEn ? 'Click to upload receipt photo or PDF' : 'Klik untuk mengunggah foto struk / resi transfer' }}
                                                                </div>
                                                                <div class="text-[11px] text-slate-400 mt-0.5">Format: JPG, PNG, atau PDF (Maks. 5 MB)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>"""

new_receipt_template = """                                                <div class="space-y-2">
                                                    <div class="flex items-center justify-between">
                                                        <label class="text-xs sm:text-sm font-bold text-navy block">
                                                            {{ isEn ? 'Upload Transfer Receipt' : 'Unggah Bukti Transfer' }} <span class="text-rose-500">*</span>
                                                        </label>
                                                        <span class="text-[11px] sm:text-xs text-slate-400 font-medium">
                                                            {{ isEn ? 'JPG, PNG, WEBP, PDF (Max 5MB)' : 'JPG, PNG, WEBP, PDF (Maks. 5MB)' }}
                                                        </span>
                                                    </div>

                                                    <input ref="proofInput" type="file" accept="image/*,.pdf" class="hidden" @change="handleProofUpload" />

                                                    <!-- State 1: Uploading State -->
                                                    <div v-if="uploadingProof" class="p-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center text-center gap-2">
                                                        <Icon icon="ph:spinner-gap-bold" class="text-2xl text-navy animate-spin" />
                                                        <div class="text-xs sm:text-sm font-bold text-navy">{{ isEn ? 'Uploading receipt...' : 'Mengunggah bukti transfer...' }}</div>
                                                        <div class="text-xs text-slate-400">{{ isEn ? 'Please wait a moment' : 'Mohon tunggu sebentar' }}</div>
                                                    </div>

                                                    <!-- State 2: Uploaded Card (Modern Structured Card) -->
                                                    <div v-else-if="proofFileUrl" class="p-4 rounded-2xl border border-emerald-300 bg-emerald-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
                                                        <div class="flex items-center gap-3.5 min-w-0 flex-1">
                                                            <!-- Thumbnail Preview -->
                                                            <div class="relative size-16 sm:size-20 rounded-xl overflow-hidden border border-emerald-200 bg-white shrink-0 flex items-center justify-center shadow-xs">
                                                                <img
                                                                    v-if="!proofFileUrl.toLowerCase().endsWith('.pdf')"
                                                                    :src="proofFileUrl"
                                                                    alt="Receipt Preview"
                                                                    class="w-full h-full object-cover" />
                                                                <div v-else class="flex flex-col items-center justify-center text-rose-500 p-1">
                                                                    <Icon icon="ph:file-pdf-bold" class="text-2xl" />
                                                                    <span class="text-[10px] font-black uppercase tracking-wider mt-0.5">PDF</span>
                                                                </div>
                                                            </div>

                                                            <!-- Info & Badge -->
                                                            <div class="min-w-0 flex-1 space-y-1">
                                                                <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                                                    <Icon icon="ph:check-circle-fill" class="text-xs text-emerald-600 shrink-0" />
                                                                    <span>{{ isEn ? 'Receipt Attached' : 'Bukti Transfer Terlampir' }}</span>
                                                                </div>
                                                                <div class="text-xs sm:text-sm font-bold text-navy truncate" :title="proofFileName || 'transfer-receipt'">
                                                                    {{ proofFileName || (isEn ? 'Transfer Receipt' : 'Bukti Transfer') }}
                                                                </div>
                                                                <div class="text-[11px] sm:text-xs text-slate-500 flex items-center gap-2">
                                                                    <span v-if="proofFileSize">{{ proofFileSize }} • </span>
                                                                    <span>{{ isEn ? 'Ready for verification' : 'Siap diverifikasi panitia' }}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <!-- Action Buttons -->
                                                        <div class="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-200/60">
                                                            <button
                                                                type="button"
                                                                @click="triggerFileInput"
                                                                class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-navy hover:text-navy text-slate-700 text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer">
                                                                <Icon icon="ph:arrows-clockwise-bold" class="text-xs sm:text-sm text-slate-400" />
                                                                <span>{{ isEn ? 'Change File' : 'Ganti Berkas' }}</span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                @click="removeProofFile"
                                                                class="p-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-400 hover:text-rose-600 text-xs sm:text-sm font-bold flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                                                                :title="isEn ? 'Remove receipt' : 'Hapus bukti transfer'">
                                                                <Icon icon="ph:trash-bold" class="text-base" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <!-- State 3: Empty Dropzone -->
                                                    <div
                                                        v-else
                                                        @click="triggerFileInput"
                                                        class="border-2 border-dashed border-slate-300 hover:border-navy rounded-2xl p-5 sm:p-6 text-center cursor-pointer transition-all bg-white hover:bg-slate-50/70 group shadow-2xs">
                                                        <div class="flex flex-col items-center justify-center gap-2">
                                                            <div class="size-11 rounded-2xl bg-navy/5 group-hover:bg-navy text-slate-500 group-hover:text-primary flex items-center justify-center transition-colors shadow-2xs">
                                                                <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl" />
                                                            </div>
                                                            <div>
                                                                <div class="text-xs sm:text-sm font-bold text-navy">
                                                                    {{ isEn ? 'Click or drag receipt photo / PDF to upload' : 'Klik atau seret foto bukti transfer / PDF ke sini' }}
                                                                </div>
                                                                <div class="text-xs text-slate-400 mt-0.5">
                                                                    {{ isEn ? 'Supports JPG, PNG, WEBP, or PDF (Max 5MB)' : 'Mendukung format JPG, PNG, WEBP, atau PDF (Maks. 5MB)' }}
                                                                </div>
                                                            </div>
                                                            <div class="mt-1">
                                                                <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 group-hover:bg-navy group-hover:text-primary text-slate-700 text-xs font-bold transition-colors">
                                                                    <Icon icon="ph:file-arrow-up-bold" class="text-sm" />
                                                                    <span>{{ isEn ? 'Select File' : 'Pilih Berkas' }}</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>"""

content = content.replace(old_receipt_template, new_receipt_template)

# 6. Typography improvements
# Replace small badge in mode selectors
content = content.replace(
    'class="px-2 py-0.5 rounded-md text-[11px] font-bold"',
    'class="px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold"'
)

# Replace small text in payment radio cards
content = content.replace(
    '<div class="font-bold text-navy text-xs leading-tight">',
    '<div class="font-bold text-navy text-xs sm:text-sm leading-tight">'
)

content = content.replace(
    '<div class="text-[10px] text-slate-400 mt-0.5">',
    '<div class="text-xs text-slate-400 mt-0.5">'
)

# Replace small text in destination bank cards
content = content.replace(
    '<div class="text-xs font-black text-navy">{{ m.payment_method || m.bank_name }}</div>',
    '<div class="text-xs sm:text-sm font-black text-navy">{{ m.payment_method || m.bank_name }}</div>'
)

content = content.replace(
    '<div class="text-sm font-black text-slate-900 font-mono tracking-wider mt-1 flex items-center gap-2">',
    '<div class="text-sm sm:text-base font-black text-slate-900 font-mono tracking-wider mt-1 flex items-center gap-2">'
)

content = content.replace(
    '<div class="text-xs font-medium text-slate-500 mt-1">',
    '<div class="text-xs sm:text-sm font-medium text-slate-500 mt-1">'
)

content = content.replace(
    'class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-navy/10 text-slate-600 hover:text-navy text-[11px] font-sans font-semibold transition-colors cursor-pointer"',
    'class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-navy/10 text-slate-600 hover:text-navy text-xs font-sans font-bold transition-colors cursor-pointer"'
)

# Step 3 Payment Confirmation section title
content = content.replace(
    '<div class="text-xs font-bold text-navy flex items-center gap-1.5">',
    '<div class="text-xs sm:text-sm font-bold text-navy flex items-center gap-1.5">'
)

# Estimated total label
content = content.replace(
    '<div class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{{ isEn ? \'Estimated Total\' : \'Estimasi Biaya\' }}</div>',
    '<div class="text-xs text-slate-400 font-bold uppercase tracking-wider">{{ isEn ? \'Estimated Total\' : \'Estimasi Biaya\' }}</div>'
)

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print('register.vue successfully updated!')
