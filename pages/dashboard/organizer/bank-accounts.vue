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
                    class="font-black tracking-widest text-[10px] h-11 px-6 shadow-lg shadow-primary/20 !rounded-xl">
                    {{ t('organizer.bank_accounts.add') }}
                </BaseButton>
            </template>
        </DashboardHeader>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Bank Accounts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="account in bankAccounts" :key="account.id"
                class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div class="flex justify-between items-start mb-6">
                    <div
                        class="size-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy shrink-0 overflow-hidden p-2">
                        <img v-if="getBankLogo(account.bank_name)"
                            :src="`/payment-method/${getBankLogo(account.bank_name)}`"
                            class="h-full w-full object-contain" />
                        <Icon v-else :icon="getBankIcon(account.bank_name)" class="text-2xl" />
                    </div>
                    <div class="flex gap-1.5 items-center">
                        <button @click="isSubscriptionActive ? openEditModal(account) : (showPremiumModal = true)"
                            class="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-navy transition-colors">
                            <Icon icon="ph:pencil-simple-bold" />
                        </button>
                        <button @click="isSubscriptionActive ? confirmDelete(account) : (showPremiumModal = true)"
                            class="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                            <Icon icon="ph:trash-bold" />
                        </button>
                    </div>
                </div>

                    <div class="space-y-4">
                    <div>
                        <div class="text-[10px] font-black text-gray-400 tracking-widest mb-1">
                            {{ t('organizer.bank_accounts.fields.bank_name') }}
                        </div>
                        <div class="text-sm font-black text-navy">{{ account.bank_name }}</div>
                    </div>
                    <div>
                        <div class="text-[10px] font-black text-gray-400 tracking-widest mb-1">
                            {{ t('organizer.bank_accounts.fields.account_number') }}
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="text-lg font-black text-navy tracking-tight">{{ account.account_number }}</div>
                            <button @click="copyToClipboard(account.account_number)" class="transition-transform">
                                <Icon icon="ph:copy-bold" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <div class="text-[10px] font-black text-gray-400 tracking-widest mb-1">
                            {{ t('organizer.bank_accounts.fields.account_name') }}
                        </div>
                        <div class="text-sm font-bold text-gray-700 truncate">{{ account.account_name }}</div>
                    </div>
                </div>
            </div>

            <!-- Empty State / Add Card -->
            <button @click="isSubscriptionActive ? openAddModal() : (showPremiumModal = true)"
                class="border-2 border-dotted border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group min-h-[280px]">
                <div
                    class="size-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon icon="ph:plus-bold" class="text-2xl" />
                </div>
                <div class="text-center">
                    <div class="text-sm font-black text-navy tracking-widest">{{ t('organizer.bank_accounts.add_new') }}</div>
                    <div class="text-xs text-gray-400 font-medium mt-1">{{ t('organizer.bank_accounts.add_new_desc') }}</div>
                </div>
            </button>
        </div>

        <!-- Add/Edit Modal -->
        <BaseDialogForm v-model="modal.show"
            :header="modal.isEdit ? t('organizer.bank_accounts.modal.edit_title') : t('organizer.bank_accounts.modal.add_title')">
            <div class="space-y-4">
                <div class="space-y-2">
                    <label class="text-xs font-black text-gray-400 tracking-widest">
                        {{ t('organizer.bank_accounts.modal.pick_bank') }}
                    </label>
                    <div class="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        <button v-for="bank in supportedBanks" :key="bank.id" type="button"
                            @click="form.bankName = bank.name"
                            class="flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all gap-1.5"
                            :class="form.bankName === bank.name ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-primary/30'">
                            <img :src="`/payment-method/${bank.logo}`" :alt="bank.name" class="h-6 object-contain" />
                            <span class="text-[8px] font-black text-gray-500">{{ bank.name }}</span>
                        </button>
                    </div>
                </div>
                <BaseInput v-model="form.bankName" :label="t('organizer.bank_accounts.modal.custom_bank_label')"
                    :placeholder="t('organizer.bank_accounts.modal.custom_bank_placeholder')" />
                <BaseInput v-model="form.accountNumber" :label="t('organizer.bank_accounts.modal.account_number_label')"
                    :placeholder="t('organizer.bank_accounts.modal.account_number_placeholder')"
                    required />
                <BaseInput v-model="form.accountName" :label="t('organizer.bank_accounts.modal.account_name_label')"
                    :placeholder="t('organizer.bank_accounts.modal.account_name_placeholder')"
                    required />

                <div class="flex items-center gap-2 mt-2">
                    <input type="checkbox" v-model="form.isPrimary" id="isPrimary"
                        class="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4">
                    <label for="isPrimary" class="text-xs font-bold text-navy tracking-widest">
                        {{ t('organizer.bank_accounts.modal.set_primary_label') }}
                    </label>
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
