<template>
    <div class="space-y-8">
        <!-- Header Section -->
        <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div class="flex items-center gap-4">
                    <div
                        class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
                        <Icon icon="ph:credit-card-bold" class="text-primary text-2xl sm:text-3xl" />
                    </div>
                    <div>
                        <h1 class="text-xl sm:text-3xl font-black tracking-tight">Rekening Bank</h1>
                        <p class="text-slate-300 text-xs sm:text-sm font-medium mt-1">Kelola rekening tujuan pencairan
                            dana Anda</p>
                    </div>
                </div>
                <div>
                    <BaseButton @click="openAddModal" variant="primary" icon="ph:plus-bold"
                        class="font-black uppercase tracking-widest text-xs h-11 px-6 shadow-lg shadow-primary/20">
                        Tambah Rekening
                    </BaseButton>
                </div>
            </div>
        </div>

        <!-- Bank Accounts Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="account in bankAccounts" :key="account.uuid"
                class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative group hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div class="flex justify-between items-start mb-6">
                    <div class="size-12 rounded-2xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
                        <Icon :icon="getBankIcon(account.bank_name)" class="text-2xl" />
                    </div>
                    <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            class="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-navy transition-colors">
                            <Icon icon="ph:pencil-simple-bold" />
                        </button>
                        <button @click="confirmDelete(account)"
                            class="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                            <Icon icon="ph:trash-bold" />
                        </button>
                    </div>
                </div>

                <div class="space-y-4">
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Bank</p>
                        <p class="text-sm font-black text-navy">{{ account.bank_name }}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nomor Rekening
                        </p>
                        <div class="flex items-center gap-2">
                            <p class="text-lg font-black text-navy tracking-tight">{{ account.account_number }}</p>
                            <button @click="copyToClipboard(account.account_number)"
                                class="text-primary hover:scale-110 transition-transform">
                                <Icon icon="ph:copy-bold" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Nama Pemilik</p>
                        <p class="text-sm font-bold text-gray-700 truncate">{{ account.account_name }}</p>
                    </div>
                </div>

                <div v-if="account.is_primary" class="absolute top-6 right-6 lg:static lg:mt-6">
                    <span
                        class="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Utama</span>
                </div>
            </div>

            <!-- Empty State / Add Card -->
            <button @click="openAddModal"
                class="border-2 border-dotted border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group min-h-[280px]">
                <div
                    class="size-14 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon icon="ph:plus-bold" class="text-2xl" />
                </div>
                <div class="text-center">
                    <p class="text-sm font-black text-navy uppercase tracking-widest">Tambah Rekening Baru</p>
                    <p class="text-xs text-gray-400 font-medium mt-1">Gunakan rekening lain untuk pencairan</p>
                </div>
            </button>
        </div>

        <!-- Add/Edit Modal -->
        <BaseDialogForm v-model="modal.show" :header="modal.isEdit ? 'Edit Rekening' : 'Tambah Rekening Bank'">
            <div class="space-y-4">
                <BaseInput v-model="form.bankName" label="Nama Bank" placeholder="Contoh: BCA, Mandiri, BNI" required />
                <BaseInput v-model="form.accountNumber" label="Nomor Rekening" placeholder="Masukkan nomor rekening"
                    required />
                <BaseInput v-model="form.accountName" label="Nama Pemilik Rekening" placeholder="Sesuai buku tabungan"
                    required />

                <div class="flex items-center gap-2 mt-2">
                    <input type="checkbox" v-model="form.isPrimary" id="isPrimary"
                        class="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4">
                    <label for="isPrimary" class="text-xs font-bold text-navy uppercase tracking-widest">Jadikan
                        Rekening Utama</label>
                </div>
            </div>

            <template #action>
                <div class="flex gap-3">
                    <BaseButton variant="white" @click="modal.show = false">Batal</BaseButton>
                    <BaseButton variant="primary" :loading="modal.loading" @click="handleSubmit">Simpan Rekening
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Delete Confirmation -->
        <AppDialog v-model:show="deleteState.show" title="Hapus Rekening?"
            message="Rekening ini akan dihapus dari daftar tujuan pencairan Anda." type="danger"
            @confirm="handleDelete" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, reactive } from 'vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import AppDialog from '~/components/common/AppDialog.vue'

const api = useApi()
const toast = useToast()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Rekening Bank - ArcheryHub'
})

const bankAccounts = ref([])
const loading = ref(true)

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
        const res = await api.get('/organizations/bank-accounts')
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

const handleSubmit = async () => {
    if (!form.bankName || !form.accountNumber || !form.accountName) {
        toast.error('Mohon lengkapi semua data')
        return
    }

    modal.loading = true
    try {
        await api.post('/organizations/bank-accounts', {
            bank_name: form.bankName,
            account_number: form.accountNumber,
            account_name: form.accountName,
            is_primary: form.isPrimary
        })
        toast.success('Rekening berhasil ditambahkan')
        modal.show = false
        fetchBankAccounts()
    } catch (error) {
        toast.error(error.response?.data?.error || 'Gagal menyimpan rekening')
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
        await api.delete(`/organizations/bank-accounts/${deleteState.target.uuid}`)
        toast.success('Rekening berhasil dihapus')
        fetchBankAccounts()
    } catch (error) {
        toast.error('Gagal menghapus rekening')
    } finally {
        deleteState.show = false
    }
}

onMounted(() => {
    fetchBankAccounts()
})

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
    toast.success('Nomor rekening disalin')
}
</script>
