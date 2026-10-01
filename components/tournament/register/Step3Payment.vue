<template>
    <div class="p-4 sm:p-8 space-y-6">
        <!-- Single Column Linear Flow -->
        <div class="space-y-6">
            
            <!-- 1. Itemized Fee Breakdown -->
            <ItemizedFeeBreakdown :items="computedBreakdownItems" :currency="eventCurrency">
                <template #actions>
                    <button
                        type="button"
                        @click="$emit('goToStep', 2)"
                        class="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs">
                        <Icon icon="ph:arrow-left-bold" class="text-xs" />
                        <span>{{ isEn ? 'Change Categories' : 'Ubah Kategori' }}</span>
                    </button>
                </template>
            </ItemizedFeeBreakdown>

            <!-- 2. Payment Method & Checkout Card -->
            <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-5">
                
                <!-- Paid Payment Method Selector (when totalCalculatedFee > 0) -->
                <div v-if="totalCalculatedFee > 0" class="space-y-4">
                    <!-- Payment Method Selector -->
                    <div>
                        <div class="text-xs sm:text-sm font-black text-navy mb-1">
                            {{ isEn ? 'Payment Method' : 'Metode Pembayaran' }}
                        </div>
                        <div class="text-xs sm:text-sm text-slate-500 mb-3">
                            {{ isEn ? 'Choose how you would like to pay:' : 'Pilih cara pembayaran yang Anda inginkan:' }}
                        </div>

                        <!-- Payment Radio Cards -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div
                                @click="$emit('update:paymentType', 'online'); $emit('update:manualMethodId', '')"
                                class="p-3.5 sm:p-4 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between select-none"
                                :class="paymentType === 'online' ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'">
                                <div class="flex items-center justify-between mb-2">
                                    <Icon icon="ph:lightning-bold" class="text-base" :class="paymentType === 'online' ? 'text-navy' : 'text-slate-400'" />
                                    <div class="size-4.5 rounded-full flex items-center justify-center"
                                        :class="paymentType === 'online' ? 'bg-navy text-white' : 'border-2 border-slate-300'">
                                        <Icon v-if="paymentType === 'online'" icon="ph:check-bold" class="text-[10px] font-black" />
                                    </div>
                                </div>
                                <div class="font-bold text-navy text-xs sm:text-sm leading-tight">
                                    {{ isEn ? 'Instant Online' : 'Instan Online' }}
                                </div>
                                <div class="text-xs sm:text-sm text-slate-400 mt-0.5">
                                    {{ eventCurrency === 'IDR' ? 'QRIS & VA (Mayar)' : 'PayPal & Card' }}
                                </div>
                            </div>

                            <div
                                @click="$emit('update:paymentType', 'manual')"
                                class="p-3.5 sm:p-4 rounded-2xl border-2 text-left cursor-pointer transition-all flex flex-col justify-between select-none"
                                :class="paymentType === 'manual' ? 'border-navy bg-navy/[0.03] shadow-xs ring-1 ring-navy/10' : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'">
                                <div class="flex items-center justify-between mb-2">
                                    <Icon icon="ph:bank-bold" class="text-base" :class="paymentType === 'manual' ? 'text-navy' : 'text-slate-400'" />
                                    <div class="size-4.5 rounded-full flex items-center justify-center"
                                        :class="paymentType === 'manual' ? 'bg-navy text-white' : 'border-2 border-slate-300'">
                                        <Icon v-if="paymentType === 'manual'" icon="ph:check-bold" class="text-[10px] font-black" />
                                    </div>
                                </div>
                                <div class="font-bold text-navy text-xs sm:text-sm leading-tight">
                                    {{ isEn ? 'Manual Transfer' : 'Transfer Bank' }}
                                </div>
                                <div class="text-xs sm:text-sm text-slate-400 mt-0.5">
                                    {{ isEn ? 'Transfer & receipt' : 'Transfer & struk' }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Details Panel -->
                    <div class="pt-2 border-t border-slate-100">
                        <!-- ONLINE GATEWAY PREVIEW -->
                        <div v-if="paymentType === 'online'" class="space-y-3">
                            <!-- Mayar (IDR) -->
                            <div v-if="eventCurrency === 'IDR'" class="p-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 flex items-center gap-3">
                                <div class="size-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                                    <img src="/mayar-logo.png" alt="Mayar" class="w-full h-full object-contain" />
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs sm:text-sm font-bold text-navy">QRIS & Virtual Account (Mayar)</div>
                                    <div class="text-xs sm:text-sm text-slate-500 font-medium">BCA, Mandiri, BRI, BNI, Permata, QRIS</div>
                                </div>
                            </div>

                            <!-- PayPal (Non-IDR) -->
                            <div v-else class="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/50 flex items-center gap-3">
                                <div class="size-10 rounded-xl bg-white border border-blue-200 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                                    <Icon icon="logos:paypal" class="text-xl" />
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs sm:text-sm font-bold text-navy">PayPal & Global Cards</div>
                                    <div class="text-xs sm:text-sm text-blue-600 font-medium">{{ `Processed in ${eventCurrency}` }}</div>
                                </div>
                            </div>

                            
                        </div>

                        <!-- MANUAL TRANSFER DETAILS -->
                        <div v-else class="space-y-3.5">
                            <div v-if="orgManualMethods.length === 0" class="p-5 rounded-2xl border border-amber-200/90 bg-amber-50/70 text-slate-800 space-y-3">
                                <div class="flex items-start gap-3">
                                    <div class="size-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                                        <Icon icon="ph:warning-circle-bold" class="text-lg" />
                                    </div>
                                    <div class="min-w-0">
                                        <div class="text-xs sm:text-sm font-black text-amber-950">
                                            {{ isEn ? 'Transfer Account Not Available' : 'Rekening Transfer Belum Tersedia' }}
                                        </div>
                                        <div class="text-xs sm:text-sm text-amber-900/80 mt-1 leading-relaxed">
                                            {{ isEn 
                                                ? 'The organizer has not configured manual bank transfer accounts for this event. Please use the instant online gateway or contact the organizer.' 
                                                : 'Penyelenggara turnamen belum menambahkan rekening transfer bank manual untuk turnamen ini. Silakan gunakan metode online (otomatis) atau hubungi pihak panitia.' 
                                            }}
                                        </div>
                                    </div>
                                </div>
                                <div class="pt-2 border-t border-amber-200/70 flex items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        @click="$emit('update:paymentType', 'online')"
                                        class="px-3.5 py-1.5 rounded-xl bg-navy text-primary hover:bg-navy/90 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer">
                                        <Icon icon="ph:lightning-bold" class="text-xs" />
                                        <span>{{ isEn ? 'Switch to Online Gateway' : 'Beralih ke Pembayaran Online' }}</span>
                                    </button>
                                </div>
                            </div>

                            <div v-else class="space-y-4">
                                <!-- Destination Bank Section (Redesigned List Style) -->
                                <div class="space-y-3">
                                    <div class="flex items-center justify-between px-0.5">
                                        <div class="text-xs sm:text-sm font-bold text-navy flex items-center gap-1.5">
                                            <Icon icon="ph:bank-bold" class="text-sm text-slate-500" />
                                            <span>{{ isEn ? 'Select Destination Bank:' : 'Pilih Rekening Tujuan Transfer:' }}</span>
                                        </div>
                                        <span class="text-xs text-slate-400 font-medium">
                                            {{ isEn ? 'Tap to choose' : 'Pilih salah satu' }}
                                        </span>
                                    </div>

                                    <!-- Modern Destination Bank Directory List -->
                                    <div class="space-y-2.5">
                                        <div
                                            v-for="m in orgManualMethods"
                                            :key="m.uuid || m.id"
                                            @click="$emit('update:manualMethodId', m.uuid || m.id)"
                                            class="p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none"
                                            :class="manualMethodId === (m.uuid || m.id)
                                                ? 'bg-slate-50/90 border-navy shadow-xs ring-1 ring-navy/15'
                                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-2xs'">
                                            
                                            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                <!-- Bank Logo & Name Info -->
                                                <div class="flex items-center gap-3 min-w-0">
                                                    <div class="size-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                                                        :class="manualMethodId === (m.uuid || m.id) ? 'border-navy bg-navy text-white' : 'border-slate-300 bg-white'">
                                                        <Icon v-if="manualMethodId === (m.uuid || m.id)" icon="ph:check-bold" class="text-[10px] font-black" />
                                                    </div>

                                                    <div class="size-10 rounded-xl bg-white border border-slate-200 p-1.5 flex items-center justify-center shrink-0 shadow-2xs">
                                                        <img
                                                            v-if="getMethodImage(m.payment_method || m.bank_name)"
                                                            :src="getMethodImage(m.payment_method || m.bank_name)"
                                                            :alt="m.payment_method || m.bank_name"
                                                            class="w-full h-full object-contain" />
                                                        <Icon v-else icon="ph:bank-bold" class="text-lg text-navy" />
                                                    </div>

                                                    <div class="min-w-0">
                                                        <div class="text-sm font-bold text-navy truncate">
                                                            {{ m.payment_method || m.bank_name }}
                                                        </div>
                                                        <div class="text-xs text-slate-500 font-medium truncate mt-0.5">
                                                            <span class="text-slate-400 font-normal">{{ isEn ? 'a/n' : 'a/n' }}</span> {{ m.account_name || m.account_holder }}
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- Account Number + Copy Button -->
                                                <div class="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t border-slate-100 sm:border-0">
                                                    <div class="font-mono text-sm sm:text-base font-black text-navy tracking-wider">
                                                        {{ m.account_number }}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        @click.stop="$emit('copyAccountNumber', m.account_number, m.uuid || m.id)"
                                                        class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                                        :class="copiedBankId === (m.uuid || m.id)
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                            : 'bg-white hover:bg-navy hover:text-white text-slate-600 border border-slate-200 shadow-2xs active:scale-95'">
                                                        <Icon :icon="copiedBankId === (m.uuid || m.id) ? 'ph:check-bold' : 'ph:copy-simple-bold'" class="text-xs" />
                                                        <span>{{ copiedBankId === (m.uuid || m.id) ? (isEn ? 'Copied' : 'Tersalin') : (isEn ? 'Copy' : 'Salin') }}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            <!-- Instructions if present -->
                                            <div v-if="m.instructions" class="mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500 flex items-start gap-1.5">
                                                <Icon icon="ph:info-bold" class="text-slate-400 text-xs shrink-0 mt-0.5" />
                                                <span>{{ m.instructions }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Sender Name & Receipt Upload Form -->
                                <div class="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3.5">
                                    <div class="text-xs sm:text-sm font-bold text-navy flex items-center gap-1.5">
                                        <Icon icon="ph:receipt-bold" class="text-sm text-slate-500" />
                                        <span>{{ isEn ? 'Payment Confirmation Details' : 'Konfirmasi Bukti Transfer' }}</span>
                                    </div>

                                    <BaseInput
                                        :modelValue="senderName"
                                        @update:modelValue="$emit('update:senderName', $event)"
                                        :label="isEn ? 'Sender Account Name' : 'Nama Pemilik Rekening Pengirim'"
                                        :placeholder="isEn ? 'e.g. Budi Santoso (as written on receipt)' : 'cth. Budi Santoso (sesuai nama di rekening/struk)'"
                                        required />

                                    <div class="space-y-2">
                                        <div class="flex items-center justify-between">
                                            <label class="text-xs sm:text-sm font-bold text-navy block">
                                                {{ isEn ? 'Upload Transfer Receipt' : 'Unggah Bukti Transfer' }} <span class="text-rose-500">*</span>
                                            </label>
                                            <span class="text-xs text-slate-400 font-medium">
                                                {{ isEn ? 'JPG, PNG, WEBP, PDF (Max 5MB)' : 'JPG, PNG, WEBP, PDF (Maks. 5MB)' }}
                                            </span>
                                        </div>

                                        <input ref="proofInput" type="file" accept="image/*,.pdf" class="hidden" @change="$emit('handleProofUpload', $event)" />

                                        <!-- State 1: Uploading State -->
                                        <div v-if="uploadingProof" class="p-6 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center text-center gap-2">
                                            <Icon icon="ph:spinner-gap-bold" class="text-2xl text-navy animate-spin" />
                                            <div class="text-xs sm:text-sm font-bold text-navy">{{ isEn ? 'Uploading receipt...' : 'Mengunggah bukti transfer...' }}</div>
                                            <div class="text-xs sm:text-sm text-slate-400">{{ isEn ? 'Please wait a moment' : 'Mohon tunggu sebentar' }}</div>
                                        </div>

                                        <!-- State 2: Uploaded Card -->
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
                                                        <span class="text-xs font-black mt-0.5">PDF</span>
                                                    </div>
                                                </div>

                                                <!-- Info & Badge -->
                                                <div class="min-w-0 flex-1 space-y-1">
                                                    <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-bold">
                                                        <Icon icon="ph:check-circle-fill" class="text-xs sm:text-sm text-emerald-600 shrink-0" />
                                                        <span>{{ isEn ? 'Receipt Attached' : 'Bukti Transfer Terlampir' }}</span>
                                                    </div>
                                                    <div class="text-xs sm:text-sm font-bold text-navy truncate" :title="proofFileName || 'transfer-receipt'">
                                                        {{ proofFileName || (isEn ? 'Transfer Receipt' : 'Bukti Transfer') }}
                                                    </div>
                                                    <div class="text-xs sm:text-sm text-slate-500 flex items-center gap-2">
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
                                                    @click="$emit('removeProofFile')"
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
                                                <div class="size-11 rounded-2xl bg-primary/15 border border-primary/30 text-navy group-hover:bg-navy group-hover:text-primary flex items-center justify-center transition-colors shadow-2xs">
                                                    <Icon icon="ph:cloud-arrow-up-bold" class="text-2xl" />
                                                </div>
                                                <div>
                                                    <div class="text-xs sm:text-sm font-bold text-navy">
                                                        {{ isEn ? 'Click or drag receipt photo / PDF to upload' : 'Klik atau seret foto bukti transfer / PDF ke sini' }}
                                                    </div>
                                                    <div class="text-xs sm:text-sm text-slate-400 mt-0.5">
                                                        {{ isEn ? 'Supports JPG, PNG, WEBP, or PDF (Max 5MB)' : 'Mendukung format JPG, PNG, WEBP, atau PDF (Maks. 5MB)' }}
                                                    </div>
                                                </div>
                                                <div class="mt-1">
                                                    <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 group-hover:bg-navy group-hover:text-primary text-slate-700 text-xs sm:text-sm font-bold transition-colors">
                                                        <Icon icon="ph:file-arrow-up-bold" class="text-sm" />
                                                        <span>{{ isEn ? 'Select File' : 'Pilih Berkas' }}</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Total Amount & Checkout Button -->
                <div class="pt-4 border-t border-slate-100 space-y-3">
                    <div class="flex items-center justify-between text-sm sm:text-base">
                        <span class="text-slate-500 font-bold">{{ isEn ? 'Total Payment' : 'Total Pembayaran' }}</span>
                        <span class="text-xl sm:text-2xl font-black tabular-nums" :class="totalCalculatedFee === 0 ? 'text-emerald-600' : 'text-navy'">
                            {{ formatPriceValue(totalCalculatedFee) }}
                        </span>
                    </div>

                    <BaseButton
                        @click="$emit('submit')"
                        :disabled="loading || (totalCalculatedFee > 0 && paymentType === 'manual' && (!manualMethodId || !proofFileUrl || !senderName))"
                        :loading="loading"
                        variant="primary"
                        size="lg"
                        icon-right="ph:arrow-right-bold"
                        class="w-full justify-center shadow-md text-sm sm:text-base">
                        {{ checkoutButtonText }}
                    </BaseButton>

                    <div v-if="submitError" class="text-xs sm:text-sm font-bold text-red-500 text-center bg-red-50 p-2 rounded-xl border border-red-200">
                        {{ submitError }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import ItemizedFeeBreakdown from '~/components/tournament/register/ItemizedFeeBreakdown.vue'

const props = defineProps({
    computedBreakdownItems: {
        type: Array,
        default: () => []
    },
    eventCurrency: {
        type: String,
        default: 'IDR'
    },
    totalCalculatedFee: {
        type: Number,
        default: 0
    },
    paymentType: {
        type: String,
        default: 'online'
    },
    manualMethodId: {
        type: String,
        default: ''
    },
    orgManualMethods: {
        type: Array,
        default: () => []
    },
    senderName: {
        type: String,
        default: ''
    },
    proofFileUrl: {
        type: String,
        default: ''
    },
    proofFileName: {
        type: String,
        default: ''
    },
    proofFileSize: {
        type: String,
        default: ''
    },
    uploadingProof: {
        type: Boolean,
        default: false
    },
    copiedBankId: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    },
    submitError: {
        type: String,
        default: ''
    },
    checkoutButtonText: {
        type: String,
        default: 'Bayar Sekarang'
    },
    isEn: {
        type: Boolean,
        default: false
    },
    getPaymentMethodImage: {
        type: Function,
        default: null
    },
    formatPrice: {
        type: Function,
        default: null
    }
})

const emit = defineEmits([
    'update:paymentType',
    'update:manualMethodId',
    'update:senderName',
    'goToStep',
    'copyAccountNumber',
    'handleProofUpload',
    'removeProofFile',
    'submit'
])

const proofInput = ref(null)

const triggerFileInput = () => {
    proofInput.value?.click()
}

const getMethodImage = (name) => {
    if (props.getPaymentMethodImage) return props.getPaymentMethodImage(name)
    return null
}

const formatPriceValue = (val) => {
    if (props.formatPrice) return props.formatPrice(val)
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}
</script>
