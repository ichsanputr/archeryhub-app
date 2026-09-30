<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <DashboardHeader
            :title="t('organizer.bank_accounts.title', isEn ? 'Bank Accounts & Wallets' : 'Rekening Bank & Dompet')"
            :subtitle="t('organizer.bank_accounts.subtitle', isEn ? 'Manage domestic, international, and e-wallet accounts for payout withdrawals' : 'Kelola rekening bank domestik, internasional, dan e-wallet tujuan pencairan dana Anda')"
            icon="ph:credit-card-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('organizer.bank_accounts.title', isEn ? 'Bank Accounts' : 'Rekening Bank') }
            ]"
        >
            <template #actions>
                <BaseButton @click="isSubscriptionActive ? openAddModal() : (showPremiumModal = true)" variant="primary" icon="ph:plus-bold"
                    :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                    class="font-bold text-xs h-11 px-6 shadow-md shadow-primary/20 !rounded-xl">
                    {{ t('organizer.bank_accounts.add', isEn ? 'Add Account' : 'Tambah Rekening') }}
                </BaseButton>
            </template>
        </DashboardHeader>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Bank Accounts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="account in bankAccounts" :key="account.id || account.uuid"
                class="rounded-2xl p-5 relative group transition-all duration-200 flex flex-col justify-between bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs">
                
                <div class="space-y-4">
                    <!-- Card Top Header -->
                    <div class="flex justify-between items-start gap-3">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <div class="size-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-2 shrink-0 shadow-2xs">
                                <img v-if="getBankLogo(account.bank_name)"
                                    :src="`/payment-method/${getBankLogo(account.bank_name)}`"
                                    class="h-full w-full object-contain"
                                    :alt="account.bank_name" />
                                <Icon v-else :icon="getBankIcon(account.bank_name)" class="text-2xl text-slate-500" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <h4 class="text-base font-bold text-navy leading-tight truncate">{{ account.bank_name }}</h4>
                                </div>
                                <div class="text-xs text-slate-500 font-normal truncate mt-0.5">{{ account.account_name }}</div>
                            </div>
                        </div>

                        <!-- Primary Tag at top -->
                        <span v-if="account.is_primary"
                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-medium shrink-0">
                            <Icon icon="ph:check-circle-fill" class="text-xs text-emerald-600" />
                            <span>{{ t('organizer.bank_accounts.badge_primary', isEn ? 'Primary Account' : 'Rekening Utama') }}</span>
                        </span>
                    </div>

                    <!-- Account Number Box -->
                    <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                        <div class="min-w-0">
                            <span class="text-[11px] font-medium text-slate-400 block leading-none mb-1.5">
                                {{ getAccountNumberLabel(account.bank_name) }}
                            </span>
                            <span class="text-base font-bold font-mono text-navy tracking-tight block select-all truncate">
                                {{ account.account_number }}
                            </span>
                        </div>
                        <button @click="copyToClipboard(account.account_number)"
                            class="size-8 rounded-lg bg-white border border-slate-200/80 text-slate-400 hover:text-navy hover:border-slate-300 flex items-center justify-center transition-colors shadow-2xs shrink-0"
                            :title="t('common.copy', isEn ? 'Copy' : 'Salin')">
                            <Icon icon="ph:copy-bold" class="text-sm" />
                        </button>
                    </div>
                </div>

                <!-- Footer Status & Action -->
                <div class="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <!-- Left status/action -->
                    <div>
                        <span v-if="account.is_primary" class="text-xs text-slate-400 font-normal">
                            {{ t('organizer.bank_accounts.badge_primary', isEn ? 'Primary Account' : 'Rekening Utama') }}
                        </span>
                        <button v-else-if="isSubscriptionActive" 
                            @click="handleSetPrimary(account)"
                            class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-navy hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200/80">
                            <Icon icon="ph:star" class="text-xs text-amber-500" />
                            <span>{{ t('organizer.bank_accounts.set_as_primary', isEn ? 'Set as Primary' : 'Jadikan Rekening Utama') }}</span>
                        </button>
                        <span v-else class="text-xs text-slate-400 font-normal">{{ t('organizer.bank_accounts.badge_secondary', isEn ? 'Secondary Account' : 'Rekening Tambahan') }}</span>
                    </div>

                    <!-- Right actions (Edit / Delete) -->
                    <div class="flex gap-1 items-center shrink-0">
                        <button @click="isSubscriptionActive ? openEditModal(account) : (showPremiumModal = true)"
                            class="size-8 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 flex items-center justify-center transition-colors"
                            :title="t('common.edit', isEn ? 'Edit' : 'Edit')">
                            <Icon icon="ph:pencil-simple" class="text-sm" />
                        </button>
                        <button @click="isSubscriptionActive ? confirmDelete(account) : (showPremiumModal = true)"
                            class="size-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                            :title="t('common.delete', isEn ? 'Delete' : 'Hapus')">
                            <Icon icon="ph:trash" class="text-sm" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State / Add Card -->
            <button @click="isSubscriptionActive ? openAddModal() : (showPremiumModal = true)"
                class="border-2 border-dashed border-slate-200 hover:border-primary/60 hover:bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all group min-h-[240px]">
                <div
                    class="size-12 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:border-primary group-hover:text-navy transition-all">
                    <Icon icon="ph:plus-bold" class="text-xl" />
                </div>
                <div class="text-center">
                    <div class="text-sm font-bold text-navy">{{ t('organizer.bank_accounts.add_new', isEn ? 'Add New Account' : 'Tambah Rekening Baru') }}</div>
                    <div class="text-xs text-slate-400 font-normal mt-0.5">{{ t('organizer.bank_accounts.add_new_desc', isEn ? 'Use local, international bank accounts or PayPal for withdrawals' : 'Gunakan rekening bank lokal, internasional, atau PayPal untuk pencairan dana') }}</div>
                </div>
            </button>
        </div>

        <!-- Add/Edit Modal -->
        <BaseDialogForm v-model="modal.show"
            :header="modal.isEdit ? t('organizer.bank_accounts.modal.edit_title', isEn ? 'Edit Bank Account' : 'Edit Rekening Bank') : t('organizer.bank_accounts.modal.add_title', isEn ? 'Add Bank Account' : 'Tambah Rekening Bank')">
            <div class="space-y-4">
                <!-- Select Bank Searchable Input (Combobox) -->
                <div class="space-y-1.5 relative" ref="bankSelectorRef">
                    <label class="block text-xs font-bold text-navy">
                        {{ t('organizer.bank_accounts.modal.pick_bank', isEn ? 'Bank / Provider' : 'Pilih Bank / Layanan') }} <span class="text-rose-500">*</span>
                    </label>

                    <div class="relative">
                        <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center">
                            <Icon :icon="getBankIcon(form.bankName)" class="text-base text-slate-500" />
                        </div>
                        
                        <input
                            ref="bankInputRef"
                            type="text"
                            v-model="form.bankName"
                            @click="handleInputClick"
                            @input="handleBankInput"
                            :placeholder="bankInputPlaceholder"
                            class="w-full pl-10 pr-16 py-2.5 bg-white border rounded-xl text-xs font-bold text-navy placeholder:font-normal placeholder:text-slate-400 focus:ring-1 outline-none shadow-2xs transition-all"
                            :class="errors.bankName ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary'"
                        />

                        <div class="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <button v-if="form.bankName"
                                type="button"
                                @click.stop="clearBankSelection"
                                class="p-1 text-slate-300 hover:text-slate-500 transition-colors"
                                :title="t('common.clear', isEn ? 'Clear' : 'Hapus')">
                                <Icon icon="ph:x-circle-fill" class="text-sm" />
                            </button>
                            <button type="button"
                                @click.stop="toggleDropdown"
                                class="p-1 text-slate-400 hover:text-navy transition-colors">
                                <Icon icon="ph:caret-down-bold" class="text-xs transition-transform duration-200" :class="{ 'rotate-180 text-primary': isDropdownOpen }" />
                            </button>
                        </div>
                    </div>

                    <div v-if="errors.bankName" class="text-red-500 text-[11px] font-bold mt-1">
                        {{ errors.bankName }}
                    </div>

                    <!-- Floating Suggestions Menu -->
                    <div v-if="isDropdownOpen"
                        class="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col max-h-56">
                        
                        <div class="overflow-y-auto p-1.5 space-y-2 flex-1">
                            <!-- Always Visible: Custom Bank Option -->
                            <button
                                type="button"
                                @click="enableCustomBankMode"
                                class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all text-left"
                                :class="isCustomBank ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300/80 shadow-2xs' : 'bg-amber-50/70 hover:bg-amber-100/90 text-amber-900 border border-amber-200/80 font-medium'">
                                <Icon icon="ph:plus-circle-bold" class="text-sm text-amber-600 shrink-0" />
                                <div class="min-w-0 flex-1">
                                    <div class="text-xs truncate">
                                        {{ form.bankName && !isExactPresetMatch ? (isEn ? `Custom Bank: "${form.bankName}"` : `Bank Kustom: "${form.bankName}"`) : t('organizer.bank_accounts.modal.create_custom_sticky', isEn ? '+ Other Bank / Provider (Custom)' : '+ Bank / Layanan Lainnya (Kustom)') }}
                                    </div>
                                </div>
                                <Icon v-if="isCustomBank" icon="ph:check-bold" class="text-xs text-amber-800 shrink-0" />
                            </button>

                            <!-- Indonesian Banks -->
                            <div v-if="filteredDomesticBanks.length > 0">
                                <div class="px-2 pt-1 pb-0.5 text-xs font-medium text-slate-400">
                                    {{ t('organizer.bank_accounts.modal.group_domestic', isEn ? 'Indonesian Banks' : 'Bank Indonesia') }}
                                </div>
                                <div class="space-y-0.5">
                                    <button v-for="b in filteredDomesticBanks" :key="b.name"
                                        type="button"
                                        @click="selectBankItem(b)"
                                        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors"
                                        :class="form.bankName === b.name ? 'bg-slate-100 text-navy font-bold border border-slate-200/80 shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-navy font-normal'">
                                        <div class="flex items-center gap-2.5 min-w-0">
                                            <Icon :icon="getBankIcon(b.name)" class="text-sm shrink-0" :class="form.bankName === b.name ? 'text-navy' : 'text-slate-500'" />
                                            <span class="truncate">{{ b.name }}</span>
                                        </div>
                                        <Icon v-if="form.bankName === b.name" icon="ph:check-bold" class="text-xs text-emerald-600 shrink-0" />
                                    </button>
                                </div>
                            </div>

                            <!-- International Banks -->
                            <div v-if="filteredIntlBanks.length > 0">
                                <div class="px-2 pt-1 pb-0.5 text-xs font-medium text-slate-400">
                                    {{ t('organizer.bank_accounts.modal.group_international', isEn ? 'International & Global' : 'Internasional & Global') }}
                                </div>
                                <div class="space-y-0.5">
                                    <button v-for="b in filteredIntlBanks" :key="b.name"
                                        type="button"
                                        @click="selectBankItem(b)"
                                        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors"
                                        :class="form.bankName === b.name ? 'bg-slate-100 text-navy font-bold border border-slate-200/80 shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-navy font-normal'">
                                        <div class="flex items-center gap-2.5 min-w-0">
                                            <Icon :icon="getBankIcon(b.name)" class="text-sm shrink-0" :class="form.bankName === b.name ? 'text-navy' : 'text-slate-500'" />
                                            <span class="truncate">{{ b.name }}</span>
                                        </div>
                                        <div class="flex items-center gap-1.5 shrink-0">
                                            <Icon :icon="getCountryFlag(b.country)" class="text-xs shrink-0" />
                                            <Icon v-if="form.bankName === b.name" icon="ph:check-bold" class="text-xs text-emerald-600" />
                                        </div>
                                    </button>
                                </div>
                            </div>

                            <!-- E-Wallets -->
                            <div v-if="filteredEwalletBanks.length > 0">
                                <div class="px-2 pt-1 pb-0.5 text-xs font-medium text-slate-400">
                                    {{ t('organizer.bank_accounts.modal.group_ewallet', isEn ? 'E-Wallets & PayPal' : 'E-Wallet & PayPal') }}
                                </div>
                                <div class="space-y-0.5">
                                    <button v-for="b in filteredEwalletBanks" :key="b.name"
                                        type="button"
                                        @click="selectBankItem(b)"
                                        class="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors"
                                        :class="form.bankName === b.name ? 'bg-slate-100 text-navy font-bold border border-slate-200/80 shadow-2xs' : 'text-slate-700 hover:bg-slate-50 hover:text-navy font-normal'">
                                        <div class="flex items-center gap-2.5 min-w-0">
                                            <Icon :icon="getBankIcon(b.name)" class="text-sm shrink-0" :class="form.bankName === b.name ? 'text-navy' : 'text-slate-500'" />
                                            <span class="truncate">{{ b.name }}</span>
                                        </div>
                                        <Icon v-if="form.bankName === b.name" icon="ph:check-bold" class="text-xs text-emerald-600 shrink-0" />
                                    </button>
                                </div>
                            </div>

                            <!-- Fallback if no options match -->
                            <div v-if="!hasMatchingPresets && !form.bankName" class="py-3 px-3 text-center text-xs text-slate-400">
                                {{ isEn ? 'Type bank or provider name' : 'Ketik nama bank atau layanan' }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Account Number / Email / IBAN -->
                <div>
                    <BaseInput
                        v-model="form.accountNumber"
                        :label="inputLabel"
                        :placeholder="inputPlaceholder"
                        :error="errors.accountNumber || accountNumberError"
                        @update:modelValue="handleAccountNumberInput"
                        required />
                    <div v-if="!errors.accountNumber && !accountNumberError" class="text-slate-400 text-[10px] mt-1 font-medium">
                        {{ inputHint }}
                    </div>
                </div>

                <!-- Account Holder Name -->
                <div>
                    <BaseInput v-model="form.accountName"
                        :label="t('organizer.bank_accounts.modal.account_name_label', isEn ? 'Account Holder Name' : 'Nama Pemilik Rekening')"
                        :placeholder="t('organizer.bank_accounts.modal.account_name_placeholder', isEn ? 'As per bank account or identity' : 'Sesuai buku tabungan atau identitas')"
                        :error="errors.accountName"
                        @update:modelValue="errors.accountName = ''"
                        required />
                </div>

                <!-- Primary Checkbox -->
                <div class="space-y-1 pt-1">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="form.isPrimary" id="isPrimary"
                            :disabled="bankAccounts.length === 0 || (modal.isEdit && bankAccounts.length === 1)"
                            class="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 disabled:opacity-50">
                        <label for="isPrimary" class="text-xs font-medium text-navy cursor-pointer">
                            {{ t('organizer.bank_accounts.modal.set_primary_label', isEn ? 'Set as Primary Account' : 'Jadikan sebagai rekening utama') }}
                        </label>
                    </div>
                    <div v-if="bankAccounts.length === 0 || (modal.isEdit && bankAccounts.length === 1)" class="text-[11px] text-slate-400 ml-6">
                        {{ t('organizer.bank_accounts.modal.single_primary_hint', isEn ? 'The first account automatically becomes the primary account.' : 'Rekening pertama otomatis menjadi rekening utama.') }}
                    </div>
                </div>
            </div>

            <template #action>
                <div class="flex gap-3">
                    <BaseButton variant="white" @click="modal.show = false">{{ t('common.cancel', isEn ? 'Cancel' : 'Batal') }}</BaseButton>
                    <BaseButton variant="primary" :loading="modal.loading" @click="handleSubmit">
                        {{ t('organizer.bank_accounts.modal.save', isEn ? 'Save Account' : 'Simpan Rekening') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Delete Confirmation -->
        <AppDialog v-model:show="deleteState.show"
            :title="t('organizer.bank_accounts.delete.title', isEn ? 'Delete Account?' : 'Hapus Rekening?')"
            :message="t('organizer.bank_accounts.delete.message', isEn ? 'This account will be removed from your withdrawal destination list.' : 'Rekening ini akan dihapus dari daftar tujuan pencairan Anda.')"
            type="danger"
            @confirm="handleDelete" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, onUnmounted, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import AppDialog from '~/components/common/AppDialog.vue'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

const api = useApi()
const toast = useToast()
const { t, locale } = useI18n()

const isEn = computed(() => (locale?.value || 'en') === 'en')

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: () => `${t('organizer.bank_accounts.title', isEn.value ? 'Bank Accounts' : 'Rekening Bank')} - Archeris Dashboard`
})

const bankAccounts = ref([])
const loading = ref(true)
const isDropdownOpen = ref(false)
const isSearching = ref(false)
const searchQuery = ref('')
const bankSelectorRef = ref(null)
const bankInputRef = ref(null)

const bankInputPlaceholder = computed(() => {
    return t('organizer.bank_accounts.modal.select_placeholder', isEn.value ? 'Type or select bank / provider...' : 'Ketik atau pilih bank / layanan...')
})

const domesticBankOptions = [
    { name: 'Bank BCA', country: 'ID', currency: 'IDR', type: 'domestic' },
    { name: 'Bank Mandiri', country: 'ID', currency: 'IDR', type: 'domestic' },
    { name: 'Bank BRI', country: 'ID', currency: 'IDR', type: 'domestic' },
    { name: 'Bank BNI', country: 'ID', currency: 'IDR', type: 'domestic' },
    { name: 'Bank Syariah Indonesia (BSI)', country: 'ID', currency: 'IDR', type: 'domestic' },
    { name: 'Bank Danamon', country: 'ID', currency: 'IDR', type: 'domestic' },
    { name: 'Bank CIMB Niaga', country: 'ID', currency: 'IDR', swift: 'BNIAIDJA', type: 'domestic' },
    { name: 'Bank Permata', country: 'ID', currency: 'IDR', swift: 'BBBAIDJA', type: 'domestic' },
    { name: 'Bank BTN', country: 'ID', currency: 'IDR', swift: 'BTNAIDJA', type: 'domestic' },
    { name: 'Bank Jago', country: 'ID', currency: 'IDR', type: 'domestic' },
    { name: 'SeaBank', country: 'ID', currency: 'IDR', type: 'domestic' }
]

const intlBankOptions = [
    { name: 'Wise (TransferWise)', country: 'GB', currency: 'USD', swift: 'TRWIGB2L', type: 'international' },
    { name: 'Maybank', country: 'MY', currency: 'MYR', swift: 'MBBEMYKL', type: 'international' },
    { name: 'DBS Bank', country: 'SG', currency: 'SGD', swift: 'DBSSSGSG', type: 'international' },
    { name: 'OCBC Bank', country: 'SG', currency: 'SGD', swift: 'OCBCSGSG', type: 'international' },
    { name: 'UOB', country: 'SG', currency: 'SGD', swift: 'UOVBSGSG', type: 'international' },
    { name: 'HSBC', country: 'GB', currency: 'USD', swift: 'HSBCGB2L', type: 'international' },
    { name: 'Citibank', country: 'US', currency: 'USD', swift: 'CITIUS33', type: 'international' },
    { name: 'Standard Chartered', country: 'GB', currency: 'USD', swift: 'SCBLGB2L', type: 'international' },
    { name: 'JPMorgan Chase', country: 'US', currency: 'USD', swift: 'CHASUS33', type: 'international' },
    { name: 'Bank of America', country: 'US', currency: 'USD', swift: 'BOFAUS3N', type: 'international' }
]

const ewalletOptions = [
    { name: 'PayPal', country: 'US', currency: 'USD', type: 'paypal' },
    { name: 'GoPay', country: 'ID', currency: 'IDR', type: 'ewallet' },
    { name: 'OVO', country: 'ID', currency: 'IDR', type: 'ewallet' },
    { name: 'DANA', country: 'ID', currency: 'IDR', type: 'ewallet' },
    { name: 'ShopeePay', country: 'ID', currency: 'IDR', type: 'ewallet' }
]

const allBankPresets = computed(() => [...domesticBankOptions, ...intlBankOptions, ...ewalletOptions])

const activeFilterQuery = computed(() => {
    if (!isSearching.value) return ''
    return searchQuery.value.trim().toLowerCase()
})

const filteredDomesticBanks = computed(() => {
    const q = activeFilterQuery.value
    if (!q) return domesticBankOptions
    return domesticBankOptions.filter(b => b.name.toLowerCase().includes(q))
})

const filteredIntlBanks = computed(() => {
    const q = activeFilterQuery.value
    if (!q) return intlBankOptions
    return intlBankOptions.filter(b => b.name.toLowerCase().includes(q) || (b.country && b.country.toLowerCase().includes(q)) || (b.currency && b.currency.toLowerCase().includes(q)))
})

const filteredEwalletBanks = computed(() => {
    const q = activeFilterQuery.value
    if (!q) return ewalletOptions
    return ewalletOptions.filter(b => b.name.toLowerCase().includes(q))
})

const isExactPresetMatch = computed(() => {
    const q = (form.bankName || '').trim().toLowerCase()
    return allBankPresets.value.some(b => b.name.toLowerCase() === q)
})

const isCustomBank = computed(() => {
    if (!form.bankName) return false
    return !isExactPresetMatch.value
})

const hasMatchingPresets = computed(() => {
    return filteredDomesticBanks.value.length > 0 ||
           filteredIntlBanks.value.length > 0 ||
           filteredEwalletBanks.value.length > 0
})

const handleBankInput = () => {
    errors.bankName = ''
    isDropdownOpen.value = true
    isSearching.value = true
    searchQuery.value = form.bankName || ''

    const q = (form.bankName || '').trim().toLowerCase()
    if (q.includes('paypal')) {
        form.accountType = 'paypal'
        form.countryCode = 'US'
        form.currency = 'USD'
    } else {
        const found = allBankPresets.value.find(b => b.name.toLowerCase() === q)
        if (found) {
            form.countryCode = found.country || 'ID'
            form.currency = found.currency || 'IDR'
            form.accountType = found.type || 'domestic'
            form.swiftCode = found.swift || ''
        } else {
            form.countryCode = 'ID'
            form.currency = 'IDR'
            form.accountType = 'domestic'
            form.swiftCode = ''
        }
    }
}

const handleInputClick = () => {
    if (!isDropdownOpen.value) {
        isDropdownOpen.value = true
        isSearching.value = false
        searchQuery.value = ''
    }
}

const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
    if (isDropdownOpen.value) {
        isSearching.value = false
        searchQuery.value = ''
    }
}

const clearBankSelection = () => {
    form.bankName = ''
    searchQuery.value = ''
    isSearching.value = false
    isDropdownOpen.value = true
    errors.bankName = ''
    bankInputRef.value?.focus()
}

const selectBankItem = (bank) => {
    form.bankName = bank.name
    form.countryCode = bank.country || 'ID'
    form.currency = bank.currency || 'IDR'
    form.accountType = bank.type || 'domestic'
    form.swiftCode = bank.swift || ''
    isSearching.value = false
    searchQuery.value = ''
    isDropdownOpen.value = false
    errors.bankName = ''
}

const enableCustomBankMode = () => {
    if (isExactPresetMatch.value) {
        form.bankName = ''
    }
    isSearching.value = false
    searchQuery.value = ''
    isDropdownOpen.value = false
    errors.bankName = ''
    bankInputRef.value?.focus()
}

const quickBanks = [
    { id: 'bca', label: 'BCA', name: 'Bank BCA', logo: 'bca.png' },
    { id: 'mandiri', label: 'Mandiri', name: 'Bank Mandiri', logo: 'mandiri.png' },
    { id: 'bri', label: 'BRI', name: 'Bank BRI', logo: 'bri.png' },
    { id: 'bni', label: 'BNI', name: 'Bank BNI', logo: 'bni.png' },
    { id: 'bsi', label: 'BSI', name: 'Bank Syariah Indonesia (BSI)', logo: 'bsi.png' },
    { id: 'danamon', label: 'Danamon', name: 'Bank Danamon', logo: 'danamon.png' },
    { id: 'gopay', label: 'GoPay', name: 'GoPay', logo: 'gopay.png' }
]

const modal = reactive({
    show: false,
    isEdit: false,
    loading: false,
    currentId: null
})

const form = reactive({
    bankName: '',
    accountNumber: '',
    accountName: '',
    swiftCode: '',
    countryCode: 'ID',
    currency: 'IDR',
    accountType: 'domestic',
    isPrimary: false
})

const errors = reactive({
    bankName: '',
    accountNumber: '',
    accountName: ''
})

const deleteState = reactive({
    show: false,
    target: null
})

const isPayPal = computed(() => {
    return form.accountType === 'paypal' || (form.bankName || '').toLowerCase().includes('paypal')
})

const isInternational = computed(() => {
    return form.countryCode !== 'ID' || form.accountType === 'international' || !!form.swiftCode
})

const inputLabel = computed(() => {
    if (isPayPal.value) return t('organizer.bank_accounts.modal.paypal_email_label', isEn.value ? 'PayPal Account Email' : 'Email Akun PayPal')
    if (isInternational.value) return t('organizer.bank_accounts.modal.iban_label', isEn.value ? 'Account Number / IBAN' : 'Nomor Rekening / IBAN')
    return t('organizer.bank_accounts.modal.account_number_label', isEn.value ? 'Account Number' : 'Nomor Rekening')
})

const inputPlaceholder = computed(() => {
    if (isPayPal.value) return t('organizer.bank_accounts.modal.paypal_email_placeholder', isEn.value ? 'Example: name@domain.com' : 'Contoh: name@domain.com')
    if (isInternational.value) return t('organizer.bank_accounts.modal.iban_placeholder', isEn.value ? 'Example: GB29 NWBK 6016 1331 9268 19 or account number' : 'Contoh: GB29 NWBK 6016 1331 9268 19 atau nomor akun')
    return t('organizer.bank_accounts.modal.account_number_placeholder', isEn.value ? 'Enter account number' : 'Masukkan nomor rekening')
})

const inputHint = computed(() => {
    if (isPayPal.value) return t('organizer.bank_accounts.modal.paypal_email_hint', isEn.value ? 'Ensure this email address is registered and active on your PayPal account.' : 'Pastikan email ini terdaftar dan aktif di akun PayPal Anda.')
    if (isInternational.value) return t('organizer.bank_accounts.modal.international_hint', isEn.value ? 'Can be an international bank account number or IBAN (5-35 characters).' : 'Dapat berupa nomor akun internasional atau IBAN (5-35 karakter).')
    return t('organizer.bank_accounts.modal.account_number_hint', isEn.value ? 'Only numeric digits without spaces or punctuation (6-20 digits).' : 'Hanya berupa digit angka tanpa spasi atau tanda baca (6-20 digit).')
})

const handleAccountNumberInput = (val) => {
    errors.accountNumber = ''
    form.accountNumber = (val || '').toString().slice(0, 50)
}

const accountNumberError = computed(() => {
    if (!form.accountNumber) return ''
    const val = form.accountNumber.trim()

    if (isPayPal.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(val)) {
            return t('organizer.bank_accounts.validation.invalid_paypal_email', isEn.value ? 'Invalid PayPal email format' : 'Format email PayPal tidak valid')
        }
        return ''
    }

    if (isInternational.value) {
        if (val.length < 5) return t('organizer.bank_accounts.validation.min_length_intl', isEn.value ? 'Account number / IBAN must be at least 5 characters' : 'Nomor akun / IBAN minimal 5 karakter')
        if (val.length > 35) return t('organizer.bank_accounts.validation.max_length_intl', isEn.value ? 'Account number / IBAN must not exceed 35 characters' : 'Nomor akun / IBAN maksimal 35 karakter')
        return ''
    }

    if (!/^\d+$/.test(val)) {
        return t('organizer.bank_accounts.validation.digits_only', isEn.value ? 'Account number must contain only numbers' : 'Nomor rekening hanya boleh berisi angka')
    }
    if (val.length < 6) {
        return t('organizer.bank_accounts.validation.min_length', isEn.value ? 'Account number must be at least 6 digits' : 'Nomor rekening minimal 6 digit')
    }
    if (val.length > 20) {
        return t('organizer.bank_accounts.validation.max_length', isEn.value ? 'Account number must not exceed 20 digits' : 'Nomor rekening maksimal 20 digit')
    }
    return ''
})

const fetchBankAccounts = async () => {
    try {
        loading.value = true
        const res = await api.get('/organizers/bank-accounts')
        bankAccounts.value = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : [])
    } catch (error) {
        console.error('Failed to fetch bank accounts:', error)
    } finally {
        loading.value = false
    }
}

const openAddModal = () => {
    modal.isEdit = false
    modal.currentId = null
    isDropdownOpen.value = false
    isSearching.value = false
    searchQuery.value = ''
    form.bankName = ''
    form.accountNumber = ''
    form.accountName = ''
    form.swiftCode = ''
    form.countryCode = 'ID'
    form.currency = 'IDR'
    form.accountType = 'domestic'
    form.isPrimary = bankAccounts.value.length === 0
    errors.bankName = ''
    errors.accountNumber = ''
    errors.accountName = ''
    modal.show = true
}

const openEditModal = (account) => {
    modal.isEdit = true
    modal.currentId = account.id || account.uuid
    isDropdownOpen.value = false
    isSearching.value = false
    searchQuery.value = ''
    form.bankName = account.bank_name || ''
    form.accountNumber = account.account_number || ''
    form.accountName = account.account_name || ''
    form.swiftCode = account.swift_code || ''
    form.countryCode = account.country_code || 'ID'
    form.currency = account.currency || 'IDR'
    form.isPrimary = !!account.is_primary
    errors.bankName = ''
    errors.accountNumber = ''
    errors.accountName = ''

    const lower = (account.bank_name || '').toLowerCase()
    if (lower.includes('paypal')) {
        form.accountType = 'paypal'
    } else if (account.country_code && account.country_code !== 'ID') {
        form.accountType = 'international'
    } else {
        form.accountType = 'domestic'
    }

    modal.show = true
}

const handleSubmit = async () => {
    errors.bankName = ''
    errors.accountNumber = ''
    errors.accountName = ''

    let firstError = ''

    if (!form.bankName || !form.bankName.trim()) {
        errors.bankName = t('organizer.bank_accounts.validation.bank_name_required', isEn.value ? 'Bank or provider name is required' : 'Nama bank atau layanan wajib diisi')
        if (!firstError) firstError = errors.bankName
    }

    if (!form.accountNumber || !form.accountNumber.trim()) {
        errors.accountNumber = t('organizer.bank_accounts.validation.account_number_required', isEn.value ? 'Account number is required' : 'Nomor rekening wajib diisi')
        if (!firstError) firstError = errors.accountNumber
    } else if (accountNumberError.value) {
        errors.accountNumber = accountNumberError.value
        if (!firstError) firstError = errors.accountNumber
    }

    if (!form.accountName || !form.accountName.trim()) {
        errors.accountName = t('organizer.bank_accounts.validation.account_name_required', isEn.value ? 'Account holder name is required' : 'Nama pemilik rekening wajib diisi')
        if (!firstError) firstError = errors.accountName
    }

    if (firstError) {
        toast.error(firstError)
        return
    }

    modal.loading = true
    try {
        const payload = {
            bank_name: form.bankName.trim(),
            account_number: form.accountNumber.trim(),
            account_name: form.accountName.trim(),
            swift_code: form.swiftCode ? form.swiftCode.trim() : null,
            country_code: form.countryCode || 'ID',
            currency: form.currency || 'IDR',
            is_primary: form.isPrimary
        }

        if (modal.isEdit) {
            await api.put(`/organizers/bank-accounts/${modal.currentId}`, payload)
            toast.success(t('organizer.bank_accounts.messages.account_updated', isEn.value ? 'Account updated successfully' : 'Rekening berhasil diperbarui'))
        } else {
            await api.post('/organizers/bank-accounts', payload)
            toast.success(t('organizer.bank_accounts.messages.account_added', isEn.value ? 'Account added successfully' : 'Rekening berhasil ditambahkan'))
        }
        modal.show = false
        await fetchBankAccounts()
    } catch (error) {
        toast.error(error.response?.data?.error || t('organizer.bank_accounts.messages.failed_to_save_account', isEn.value ? 'Failed to save bank account' : 'Gagal menyimpan data rekening'))
    } finally {
        modal.loading = false
    }
}

const handleSetPrimary = async (account) => {
    const accountId = account.id || account.uuid
    if (!accountId) return
    try {
        await api.put(`/organizers/bank-accounts/${accountId}`, {
            bank_name: account.bank_name,
            account_number: account.account_number,
            account_name: account.account_name,
            swift_code: account.swift_code || null,
            country_code: account.country_code || 'ID',
            currency: account.currency || 'IDR',
            is_primary: true
        })
        if (Array.isArray(bankAccounts.value)) {
            bankAccounts.value.forEach(acc => {
                const id = acc.id || acc.uuid
                acc.is_primary = (id === accountId)
            })
            bankAccounts.value.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
        }
        toast.success(t('organizer.bank_accounts.set_primary_success', { bank: account.bank_name }, isEn.value ? `${account.bank_name} set as primary bank account` : `${account.bank_name} berhasil dijadikan rekening utama`))
        await fetchBankAccounts()
    } catch (error) {
        console.error('Failed to set primary bank account:', error)
        toast.error(error?.response?.data?.error || t('organizer.bank_accounts.set_primary_error', isEn.value ? 'Failed to set primary bank account' : 'Gagal mengubah rekening utama'))
    }
}

const confirmDelete = (account) => {
    deleteState.target = account
    deleteState.show = true
}

const handleDelete = async () => {
    const targetId = deleteState.target?.id || deleteState.target?.uuid
    if (!targetId) return
    try {
        await api.delete(`/organizers/bank-accounts/${targetId}`)
        toast.success(t('organizer.bank_accounts.messages.account_deleted', isEn.value ? 'Account deleted successfully' : 'Rekening berhasil dihapus'))
        await fetchBankAccounts()
    } catch (error) {
        toast.error(t('organizer.bank_accounts.messages.failed_to_delete_account', isEn.value ? 'Failed to delete account' : 'Gagal menghapus rekening'))
    } finally {
        deleteState.show = false
    }
}

const handleDocumentClick = (e) => {
    if (bankSelectorRef.value && !bankSelectorRef.value.contains(e.target)) {
        isDropdownOpen.value = false
    }
}

onMounted(() => {
    fetchBankAccounts()
    if (typeof document !== 'undefined') {
        document.addEventListener('click', handleDocumentClick)
    }
})

onUnmounted(() => {
    if (typeof document !== 'undefined') {
        document.removeEventListener('click', handleDocumentClick)
    }
})

const getBankLogo = (bankName) => {
    if (!bankName) return null
    const name = bankName.toLowerCase()
    const preset = quickBanks.find(b => b.logo && name.includes(b.id))
    return preset ? preset.logo : null
}

const getBankIcon = (bankName) => {
    if (!bankName) return 'ph:bank-bold'
    const name = bankName.toLowerCase()
    if (name.includes('paypal')) return 'logos:paypal'
    if (name.includes('wise')) return 'logos:wise'
    if (name.includes('maybank') || name.includes('public bank')) return 'circle-flags:my'
    if (name.includes('dbs') || name.includes('ocbc') || name.includes('uob')) return 'circle-flags:sg'
    if (name.includes('chase') || name.includes('america') || name.includes('citi')) return 'circle-flags:us'
    if (name.includes('barclays') || name.includes('hsbc')) return 'circle-flags:gb'
    if (name.includes('deutsche')) return 'circle-flags:de'
    return 'ph:bank-bold'
}

const getCountryFlag = (code) => {
    const c = (code || 'ID').toUpperCase()
    if (c === 'ID') return 'circle-flags:id'
    if (c === 'MY') return 'circle-flags:my'
    if (c === 'SG') return 'circle-flags:sg'
    if (c === 'TH') return 'circle-flags:th'
    if (c === 'PH') return 'circle-flags:ph'
    if (c === 'VN') return 'circle-flags:vn'
    if (c === 'US') return 'circle-flags:us'
    if (c === 'GB') return 'circle-flags:gb'
    if (c === 'DE') return 'circle-flags:de'
    if (c === 'AU') return 'circle-flags:au'
    if (c === 'JP') return 'circle-flags:jp'
    if (c === 'KR') return 'circle-flags:kr'
    if (c === 'AE') return 'circle-flags:ae'
    return 'ph:globe-simple-bold'
}

const getAccountNumberLabel = (bankName) => {
    const name = (bankName || '').toLowerCase()
    if (name.includes('paypal')) return t('organizer.bank_accounts.fields.paypal_email', isEn.value ? 'PayPal Account Email' : 'Email Akun PayPal')
    return t('organizer.bank_accounts.fields.account_number', isEn.value ? 'Account Number' : 'Nomor Rekening')
}

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success(t('organizer.bank_accounts.copy_success', isEn.value ? 'Account number copied' : 'Nomor rekening berhasil disalin'))
}
</script>

