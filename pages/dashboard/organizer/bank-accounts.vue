<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <DashboardHeader
            :title="t('organizer.bank_accounts.title')"
            :subtitle="t('organizer.bank_accounts.subtitle')"
            icon="ph:credit-card-bold"
            :breadcrumbs="[
                { label: 'Dashboard', to: '/dashboard/organizer' },
                { label: t('organizer.bank_accounts.title') }
            ]"
        >
            <template #actions>
                <BaseButton @click="isSubscriptionActive ? openAddModal() : (showPremiumModal = true)" variant="primary" icon="ph:plus-bold"
                    :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                    class="font-bold text-xs h-11 px-6 shadow-md shadow-primary/20 !rounded-xl">
                    {{ t('organizer.bank_accounts.add') }}
                </BaseButton>
            </template>
        </DashboardHeader>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Bank Accounts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="account in bankAccounts" :key="account.id"
                class="rounded-2xl p-5 relative group transition-all duration-200 flex flex-col justify-between bg-white border border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs">
                
                <div class="space-y-4">
                    <!-- Card Top Header -->
                    <div class="flex justify-between items-start gap-3">
                        <div class="flex items-center gap-3 min-w-0 flex-1">
                            <div class="size-11 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-2 shrink-0 shadow-2xs">
                                <img v-if="getBankLogo(account.bank_name)"
                                    :src="`/payment-method/${getBankLogo(account.bank_name)}`"
                                    class="h-full w-full object-contain"
                                    :alt="account.bank_name" />
                                <Icon v-else :icon="getBankIcon(account.bank_name)" class="text-2xl text-slate-400" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center gap-2">
                                    <h4 class="text-base font-bold text-navy leading-tight truncate">{{ account.bank_name }}</h4>
                                </div>
                                <p class="text-xs text-slate-500 font-normal truncate mt-0.5">{{ account.account_name }}</p>
                            </div>
                        </div>

                        <!-- Primary Tag at top -->
                        <span v-if="account.is_primary"
                            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[11px] font-medium shrink-0">
                            <Icon icon="ph:check-circle-fill" class="text-xs text-emerald-600" />
                            <span>{{ t('organizer.bank_accounts.badge_primary', 'Rekening utama') }}</span>
                        </span>
                    </div>

                    <!-- Account Number Box -->
                    <div class="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                        <div class="min-w-0">
                            <span class="text-[11px] font-medium text-slate-400 block leading-none mb-1.5">
                                {{ t('organizer.bank_accounts.fields.account_number', 'Nomor rekening') }}
                            </span>
                            <span class="text-base font-bold font-mono text-navy tracking-tight block select-all">
                                {{ account.account_number }}
                            </span>
                        </div>
                        <button @click="copyToClipboard(account.account_number)"
                            class="size-8 rounded-lg bg-white border border-slate-200/80 text-slate-400 hover:text-navy hover:border-slate-300 flex items-center justify-center transition-colors shadow-2xs shrink-0"
                            :title="t('common.copy', 'Salin')">
                            <Icon icon="ph:copy-bold" class="text-sm" />
                        </button>
                    </div>
                </div>

                <!-- Footer Status & Action -->
                <div class="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <!-- Left status/action -->
                    <div>
                        <span v-if="account.is_primary" class="text-xs text-slate-400 font-normal">
                            {{ t('organizer.bank_accounts.badge_primary', 'Rekening utama') }}
                        </span>
                        <button v-else-if="isSubscriptionActive" 
                            @click="handleSetPrimary(account)"
                            class="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-navy hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200/80">
                            <Icon icon="ph:star" class="text-xs text-amber-500" />
                            <span>{{ t('organizer.bank_accounts.set_as_primary', 'Jadikan rekening utama') }}</span>
                        </button>
                        <span v-else class="text-xs text-slate-400 font-normal">Rekening tambahan</span>
                    </div>

                    <!-- Right actions (Edit / Delete) -->
                    <div class="flex gap-1 items-center shrink-0">
                        <button @click="isSubscriptionActive ? openEditModal(account) : (showPremiumModal = true)"
                            class="size-8 rounded-lg text-slate-400 hover:text-navy hover:bg-slate-100 flex items-center justify-center transition-colors"
                            :title="t('common.edit', 'Edit')">
                            <Icon icon="ph:pencil-simple" class="text-sm" />
                        </button>
                        <button @click="isSubscriptionActive ? confirmDelete(account) : (showPremiumModal = true)"
                            class="size-8 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                            :title="t('common.delete', 'Hapus')">
                            <Icon icon="ph:trash" class="text-sm" />
                        </button>
                    </div>
                </div>
            </div>

            <!-- Empty State / Add Card -->
            <button @click="isSubscriptionActive ? openAddModal() : (showPremiumModal = true)"
                class="border-2 border-dashed border-slate-200 hover:border-primary/60 hover:bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all group min-h-[220px]">
                <div
                    class="size-12 rounded-full bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:border-primary group-hover:text-navy transition-all">
                    <Icon icon="ph:plus-bold" class="text-xl" />
                </div>
                <div class="text-center">
                    <div class="text-sm font-bold text-navy">{{ t('organizer.bank_accounts.add_new', 'Tambah rekening baru') }}</div>
                    <div class="text-xs text-slate-400 font-normal mt-0.5">{{ t('organizer.bank_accounts.add_new_desc', 'Gunakan rekening lain untuk pencairan dana') }}</div>
                </div>
            </button>
        </div>

        <!-- Add/Edit Modal -->
        <BaseDialogForm v-model="modal.show"
            :header="modal.isEdit ? t('organizer.bank_accounts.modal.edit_title') : t('organizer.bank_accounts.modal.add_title')">
            <div class="space-y-4">
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500">
                        {{ t('organizer.bank_accounts.modal.pick_bank', 'Pilih bank') }}
                    </label>
                    <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        <button v-for="bank in supportedBanks" :key="bank.id" type="button"
                            @click="form.bankName = bank.name"
                            class="flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all gap-1.5"
                            :class="form.bankName === bank.name ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'">
                            <img :src="`/payment-method/${bank.logo}`" :alt="bank.name" class="h-6 object-contain" />
                            <span class="text-[9px] font-bold text-slate-600">{{ bank.name }}</span>
                        </button>
                    </div>
                </div>
                <BaseInput v-model="form.bankName" :label="t('organizer.bank_accounts.modal.custom_bank_label', 'Nama bank kustom')"
                    :placeholder="t('organizer.bank_accounts.modal.custom_bank_placeholder', 'Jika bank tidak ada di daftar')" />
                <BaseInput v-model="form.accountNumber" :label="t('organizer.bank_accounts.modal.account_number_label', 'Nomor rekening')"
                    :placeholder="t('organizer.bank_accounts.modal.account_number_placeholder', 'Masukkan nomor rekening')"
                    required />
                <BaseInput v-model="form.accountName" :label="t('organizer.bank_accounts.modal.account_name_label', 'Nama pemilik rekening')"
                    :placeholder="t('organizer.bank_accounts.modal.account_name_placeholder', 'Sesuai buku tabungan')"
                    required />

                <div class="space-y-1 mt-2">
                    <div class="flex items-center gap-2">
                        <input type="checkbox" v-model="form.isPrimary" id="isPrimary"
                            :disabled="bankAccounts.length === 0 || (modal.isEdit && bankAccounts.length === 1)"
                            class="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 disabled:opacity-50">
                        <label for="isPrimary" class="text-xs font-medium text-navy cursor-pointer">
                            {{ t('organizer.bank_accounts.modal.set_primary_label', 'Jadikan sebagai rekening utama') }}
                        </label>
                    </div>
                    <p v-if="bankAccounts.length === 0 || (modal.isEdit && bankAccounts.length === 1)" class="text-[11px] text-slate-400 ml-6">
                        {{ t('organizer.bank_accounts.modal.single_primary_hint', 'Rekening pertama otomatis menjadi rekening utama.') }}
                    </p>
                </div>
            </div>

            <template #action>
                <div class="flex gap-3">
                    <BaseButton variant="white" @click="modal.show = false">{{ t('common.cancel') }}</BaseButton>
                    <BaseButton variant="primary" :loading="modal.loading" @click="handleSubmit">
                        {{ t('organizer.bank_accounts.modal.save') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Delete Confirmation -->
        <AppDialog v-model:show="deleteState.show"
            :title="t('organizer.bank_accounts.delete.title')"
            :message="t('organizer.bank_accounts.delete.message')"
            type="danger"
            @confirm="handleDelete" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, reactive } from 'vue'
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
const { t } = useI18n()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: () => `${t('organizer.bank_accounts.title')} - Archeris Dashboard`
})

const bankAccounts = ref([])
const loading = ref(true)

const supportedBanks = [
    { id: 'bca', name: 'BCA', logo: 'bca.png' },
    { id: 'mandiri', name: 'Mandiri', logo: 'mandiri.png' },
    { id: 'bri', name: 'BRI', logo: 'bri.png' },
    { id: 'bni', name: 'BNI', logo: 'bni.png' },
    { id: 'bsi', name: 'BSI', logo: 'bsi.png' },
    { id: 'danamon', name: 'Danamon', logo: 'danamon.png' },
    { id: 'gopay', name: 'GoPay', logo: 'gopay.png' },
    { id: 'ovo', name: 'OVO', logo: 'ovo.png' },
    { id: 'dana', name: 'DANA', logo: 'dana.png' },
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
    isPrimary: false
})

const deleteState = reactive({
    show: false,
    target: null
})

const fetchBankAccounts = async () => {
    try {
        loading.value = true
        const res = await api.get('/organizers/bank-accounts')
        bankAccounts.value = res?.data || res || []
    } catch (error) {
        console.error('Failed to fetch bank accounts:', error)
    } finally {
        loading.value = false
    }
}

const openAddModal = () => {
    modal.isEdit = false
    modal.currentId = null
    form.bankName = ''
    form.accountNumber = ''
    form.accountName = ''
    form.isPrimary = bankAccounts.value.length === 0
    modal.show = true
}

const openEditModal = (account) => {
    modal.isEdit = true
    modal.currentId = account.id
    form.bankName = account.bank_name
    form.accountNumber = account.account_number
    form.accountName = account.account_name
    form.isPrimary = account.is_primary
    modal.show = true
}

const handleSubmit = async () => {
    if (!form.bankName || !form.accountNumber || !form.accountName) {
        toast.error(t('organizer.bank_accounts.messages.please_complete_all_fields'))
        return
    }

    modal.loading = true
    try {
        const payload = {
            bank_name: form.bankName,
            account_number: form.accountNumber,
            account_name: form.accountName,
            is_primary: form.isPrimary
        }

        if (modal.isEdit) {
            await api.put(`/organizers/bank-accounts/${modal.currentId}`, payload)
            toast.success(t('organizer.bank_accounts.messages.account_updated'))
        } else {
            await api.post('/organizers/bank-accounts', payload)
            toast.success(t('organizer.bank_accounts.messages.account_added'))
        }
        modal.show = false
        fetchBankAccounts()
    } catch (error) {
        toast.error(error.response?.data?.error || t('organizer.bank_accounts.messages.failed_to_save_account'))
    } finally {
        modal.loading = false
    }
}

const handleSetPrimary = async (account) => {
    try {
        await api.put(`/organizers/bank-accounts/${account.id}`, {
            bank_name: account.bank_name,
            account_number: account.account_number,
            account_name: account.account_name,
            is_primary: true
        })
        toast.success(`Rekening ${account.bank_name} berhasil dijadikan rekening utama`)
        fetchBankAccounts()
    } catch (error) {
        toast.error('Gagal memperbarui status rekening utama')
    }
}

const confirmDelete = (account) => {
    deleteState.target = account
    deleteState.show = true
}

const handleDelete = async () => {
    if (!deleteState.target) return
    try {
        await api.delete(`/organizers/bank-accounts/${deleteState.target.id}`)
        toast.success(t('organizer.bank_accounts.messages.account_deleted'))
        fetchBankAccounts()
    } catch (error) {
        toast.error(t('organizer.bank_accounts.messages.failed_to_delete_account'))
    } finally {
        deleteState.show = false
    }
}

onMounted(() => {
    fetchBankAccounts()
})

const getBankLogo = (bankName) => {
    if (!bankName) return null
    const bank = supportedBanks.find(b => bankName.toLowerCase().includes(b.id.toLowerCase()))
    return bank ? bank.logo : null
}

const getBankIcon = (bankName) => {
    if (!bankName) return 'ph:credit-card-bold'
    const name = bankName.toLowerCase()
    if (name.includes('bca')) return 'ph:bank-bold'
    if (name.includes('mandiri')) return 'ph:bank-bold'
    if (name.includes('bri')) return 'ph:bank-bold'
    if (name.includes('bni')) return 'ph:bank-bold'
    return 'ph:credit-card-bold'
}

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success(t('organizer.bank_accounts.copy_success'))
}
</script>
