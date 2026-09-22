<template>
    <div class="relative">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />
        <!-- Security Overlay -->
        <div v-if="!isVerified"
            class="absolute inset-0 z-50 backdrop-blur-md bg-white/40 flex items-center justify-center p-6 rounded-3xl min-h-[600px]">
            <div
                class="max-w-md w-full bg-white rounded-3xl shadow-md border border-gray-100 p-8 sm:p-10 text-center space-y-8 relative overflow-hidden">
                <!-- Background Decoration -->
                <div class="absolute -top-12 -right-12 size-40 bg-primary/5 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-12 -left-12 size-40 bg-navy/5 rounded-full blur-3xl"></div>

                <div class="relative space-y-6">
                    <div
                        class="size-24 bg-gradient-to-br from-navy to-navy-dark rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-sm shadow-navy/20 relative group transition-transform hover:scale-105 duration-500">
                        <div
                            class="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity">
                        </div>
                        <Icon icon="ph:key-bold" class="text-4xl relative z-10" />
                    </div>

                    <div class="space-y-2">
                        <h2 class="text-2xl font-black text-navy tracking-tight ">
                            {{ t('organizer.balance.security.title') }}
                        </h2>
                        <div
                            class=" text-xs text-gray-400 font-bold leading-relaxed max-w-[240px] mx-auto tracking-wider">
                            {{ t('organizer.balance.security.desc') }}
                        </div>
                    </div>

                    <div class="space-y-4 pt-2">
                        <BaseInput v-model="password" type="password"
                            :placeholder="t('organizer.balance.security.password_placeholder')"
                            class="!rounded-2xl border-gray-100 focus:!border-primary/30" icon="ph:lock-bold"
                            @keyup.enter="verifyPassword" />
                        <BaseButton @click="verifyPassword" variant="primary" block :loading="verifying"
                            class="h-11 !rounded-xl font-black tracking-widest text-[10px] shadow-lg shadow-primary/20">
                            {{ t('organizer.balance.security.open_access') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <div :class="{ 'opacity-20 pointer-events-none': !isVerified }"
            class="space-y-8 transition-opacity duration-500">
            <!-- Header Section -->
            <DashboardHeader
                :title="t('organizer.balance.header.title')"
                :subtitle="t('organizer.balance.header.subtitle')"
                icon="ph:bank-bold"
                :breadcrumbs="[
                    { label: 'Dashboard', to: '/dashboard/organizer' },
                    { label: t('organizer.balance.header.title') }
                ]"
            />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left: Balance Card -->
                <div class="lg:col-span-1 space-y-6">
                    <div
                        class="bg-gradient-to-br from-navy to-navy-dark rounded-3xl p-8 text-white shadow-lg relative overflow-hidden border border-white/5">
                        <div class="absolute top-0 right-0 p-8 opacity-10">
                            <Icon icon="ph:coins-bold" class="text-8xl" />
                        </div>
                        <div class="text-primary text-[10px] font-black tracking-[0.2em] mb-3">
                            {{ t('organizer.balance.available') }}
                        </div>
                        <h2 class="text-3xl sm:text-4xl font-black tracking-tight mb-10 leading-none tabular-nums">
                            <span class="text-lg font-bold opacity-40 mr-1">Rp</span>{{ balance.toLocaleString('id-ID')
                            }}
                        </h2>

                        <div class="space-y-3">
                            <BaseButton variant="primary" block
                                @click="isSubscriptionActive ? openWithdrawDialog() : (showPremiumModal = true)"
                                :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                                class="font-black tracking-widest text-[10px] h-11 !rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
                                {{ t('organizer.balance.withdraw_button') }}
                            </BaseButton>
                            <div class="text-[9px] text-slate-400 text-center font-black tracking-widest leading-loose">
                                {{ t('organizer.balance.withdraw_info') }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Withdrawal History & Mutation Ledger Tabs -->
                <div class="lg:col-span-2">
                    <div
                        class="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-full flex flex-col">
                        <div class="p-4 sm:p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                            <div class="flex items-center gap-2 p-1 bg-gray-100/80 rounded-xl">
                                <button type="button" @click="activeTab = 'withdrawals'"
                                    :class="activeTab === 'withdrawals' ? 'bg-white text-navy shadow-xs font-black' : 'text-gray-500 hover:text-navy font-bold'"
                                    class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5">
                                    <Icon icon="ph:clock-counter-clockwise-bold" class="text-sm" />
                                    <span>{{ t('organizer.balance.withdrawals.title') }}</span>
                                </button>
                                <button type="button" @click="activeTab = 'mutations'"
                                    :class="activeTab === 'mutations' ? 'bg-white text-navy shadow-xs font-black' : 'text-gray-500 hover:text-navy font-bold'"
                                    class="px-3.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5">
                                    <Icon icon="ph:receipt-bold" class="text-sm" />
                                    <span>{{ t('organizer.balance.mutations.title') }}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Tab 1: Withdrawal History Table -->
                        <div v-if="activeTab === 'withdrawals'" class="p-2 sm:p-4">
                            <DashboardDataTable
                                :items="withdrawalHistory"
                                :columns="withdrawalColumns"
                                :searchable="false"
                                :has-filter-modal="false"
                                :initial-sort-by="sortBy"
                                :initial-sort-order="order === 'ASC' ? 'asc' : 'desc'"
                                :items-per-page="itemsPerPage"
                                :empty-title="t('organizer.balance.withdrawals.empty')"
                                empty-icon="ph:clock-counter-clockwise"
                                @sort="toggleSort($event.sortBy)"
                            >
                                <template #item-txId="{ item }">
                                    <span class="font-mono text-xs font-bold text-slate-400">#{{ item.txId }}</span>
                                </template>

                                <template #item-date="{ item }">
                                    <span class="text-xs sm:text-sm text-navy font-bold">{{ item.date }}</span>
                                </template>

                                <template #item-status="{ item }">
                                    <div class="flex justify-center">
                                        <span :class="getStatusClass(item.status)"
                                            class="px-2.5 py-0.5 rounded-full text-xs font-bold">
                                            {{ item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase() : '' }}
                                        </span>
                                    </div>
                                </template>

                                <template #item-amount="{ item }">
                                    <div class="text-right font-black text-navy text-xs sm:text-sm tabular-nums">
                                        Rp {{ item.amount.toLocaleString('id-ID') }}
                                    </div>
                                </template>
                            </DashboardDataTable>
                        </div>

                        <!-- Tab 2: Mutation Ledger Table -->
                        <div v-else class="p-2 sm:p-4">
                            <DashboardDataTable
                                :items="mutationHistory"
                                :columns="mutationColumns"
                                :loading="mutationLoading"
                                :searchable="false"
                                :has-filter-modal="false"
                                :items-per-page="mutationItemsPerPage"
                                :empty-title="t('organizer.balance.mutations.empty')"
                                empty-icon="ph:receipt"
                            >
                                <template #item-date="{ item }">
                                    <span class="text-xs text-slate-500 font-medium whitespace-nowrap">{{ item.date }}</span>
                                </template>

                                <template #item-description="{ item }">
                                    <div>
                                        <div class="text-xs font-bold text-navy">{{ item.description }}</div>
                                        <div v-if="item.refId" class="font-mono text-[10px] text-slate-400">#{{ item.refId }}</div>
                                    </div>
                                </template>

                                <template #item-type="{ item }">
                                    <div class="flex justify-center">
                                        <span :class="item.type === 'credit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                                            class="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider border">
                                            {{ item.type === 'credit' ? t('organizer.balance.mutations.credit_badge') : t('organizer.balance.mutations.debit_badge') }}
                                        </span>
                                    </div>
                                </template>

                                <template #item-amount="{ item }">
                                    <div class="text-right font-black text-xs sm:text-sm tabular-nums"
                                        :class="item.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'">
                                        {{ item.type === 'credit' ? '+' : '-' }} Rp {{ item.amount.toLocaleString('id-ID') }}
                                    </div>
                                </template>

                                <template #item-balanceAfter="{ item }">
                                    <div class="text-right font-mono text-xs font-bold text-navy tabular-nums">
                                        Rp {{ item.balanceAfter.toLocaleString('id-ID') }}
                                    </div>
                                </template>
                            </DashboardDataTable>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Withdrawal Dialog -->
        <BaseDialogForm v-model="showWithdrawDialog" @close="closeWithdrawDialog">
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="size-10 bg-primary/10 rounded-xl flex items-center justify-center shadow-inner">
                        <Icon icon="ph:bank-bold" class="text-xl text-primary" />
                    </div>
                    <h2 class="text-xl font-black text-navy">{{ t('organizer.balance.withdrawals.title') }}</h2>
                </div>
            </template>

            <div class="space-y-5">
                <!-- Verification OTP Segment -->
                <div v-if="!otpSent" class="space-y-3 text-center py-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                    <Icon icon="ph:envelope-open-bold" class="text-4xl text-primary mx-auto animate-bounce" />
                    <div class="space-y-1">
                        <h3 class="text-xs font-black text-navy">
                            {{ t('organizer.balance.otp.request_title') }}
                        </h3>
                        <div class="text-[10px] text-gray-500 max-w-xs mx-auto font-medium">
                            {{ t('organizer.balance.otp.request_desc') }}
                        </div>
                    </div>
                    <BaseButton variant="primary" class="font-black text-xs h-9 tracking-wider shadow-md"
                        :loading="sendingOtp" @click="requestWithdrawalOTP">
                        {{ t('organizer.balance.otp.send') }}
                    </BaseButton>
                </div>

                <!-- Verification Input fields -->
                <div v-else class="space-y-4">
                    <!-- Already Verified Banner -->
                    <div v-if="isOtpVerified"
                        class="p-4 bg-green-50 border border-green-200 rounded-2xl flex flex-col gap-2 items-center text-center">
                        <div class="size-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon icon="ph:shield-check-fill" class="text-2xl text-green-600" />
                        </div>
                        <div>
                            <h4 class="text-xs font-black text-green-900">
                                {{ t('organizer.balance.otp.verified_title') }}
                            </h4>
                            <div class="text-[10px] text-green-700 mt-0.5 font-medium font-sans">
                                {{ t('organizer.balance.otp.verified_desc') }}
                                <span class="font-black font-mono text-green-800">{{ formattedRemainingTime }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else class="p-3 bg-green-50 border border-green-100 rounded-xl flex gap-2.5 items-start">
                        <Icon icon="ph:check-circle-bold" class="text-green-600 text-lg shrink-0 mt-0.5" />
                        <div class=" text-xs text-green-800 font-semibold leading-relaxed">
                            {{ t('organizer.balance.otp.code_sent') }}
                        </div>
                    </div>

                    <!-- OTP Input -->
                    <div v-if="!isOtpVerified" class="space-y-2">
                        <label class="block text-xs font-bold text-navy">
                            {{ t('organizer.balance.otp.code_label') }}
                        </label>
                        <BaseInput v-model="otpCode" :placeholder="t('organizer.balance.otp.code_placeholder')" type="text" maxlength="6"
                            class="font-mono text-center tracking-widest text-lg font-black" required />
                    </div>

                    <!-- Withdrawal Amount -->
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-navy">
                            {{ t('organizer.balance.amount_label') }}
                        </label>
                        <BaseInput v-model="withdrawalAmount" :placeholder="t('organizer.balance.amount_placeholder')" type="number" min="100000"
                            :max="balance" required />
                        <div class="text-[10px] text-gray-500 font-medium">
                            {{ t('organizer.balance.available_balance') }}: Rp {{ balance.toLocaleString('id-ID') }}
                        </div>
                    </div>

                    <!-- Bank Account Info & Selector -->
                    <div v-if="bankAccounts.length"
                        class="p-4 bg-navy/5 border border-navy/10 rounded-2xl space-y-2.5">
                        <div class="flex items-center justify-between">
                            <label class="text-xs font-black text-navy">{{ t('organizer.balance.destination_account') }}</label>
                            <NuxtLink to="/dashboard/organizer/bank-accounts" class="text-[10px] font-bold text-primary hover:underline flex items-center gap-1">
                                <Icon icon="ph:gear-six-bold" />
                                <span>{{ t('organizer.balance.manage_accounts') }}</span>
                            </NuxtLink>
                        </div>

                        <!-- Dropdown selector if organizer has more than 1 account -->
                        <div v-if="bankAccounts.length > 1">
                            <select v-model="selectedAccountId"
                                class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-navy focus:border-primary outline-none shadow-2xs">
                                <option v-for="acc in bankAccounts" :key="acc.id || acc.uuid" :value="acc.id || acc.uuid">
                                    {{ acc.bank_name }} - {{ acc.account_number }} (a.n {{ acc.account_name }}) {{ acc.is_primary ? `(${t('organizer.balance.primary_badge')})` : '' }}
                                </option>
                            </select>
                        </div>

                        <!-- Selected Account Card Display -->
                        <div v-if="currentSelectedAccount" class="p-3 bg-white border border-gray-100 rounded-xl space-y-0.5 text-xs shadow-2xs">
                            <div class="font-black text-navy">{{ currentSelectedAccount.bank_name }}</div>
                            <div class="font-mono font-bold text-slate-700 tracking-wider">{{ currentSelectedAccount.account_number }}</div>
                            <div class="text-[11px] text-gray-500 font-medium truncate">a.n {{ currentSelectedAccount.account_name }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <template #action>
                <BaseButton variant="white" @click="closeWithdrawDialog" :disabled="isSubmittingWithdrawal">
                    {{ t('common.cancel') }}
                </BaseButton>
                <BaseButton v-if="otpSent" variant="primary" @click="handleWithdrawal" :loading="isSubmittingWithdrawal"
                    :disabled="otpCode.trim().length !== 6 || !withdrawalAmount || withdrawalAmount < 100000 || withdrawalAmount > balance">
                    <Icon icon="ph:bank-bold" class="mr-1.5" />
                    {{ t('organizer.balance.submit_withdrawal') }}
                </BaseButton>
            </template>
        </BaseDialogForm>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, watch, computed, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

const api = useApi()
const toast = useToast()
const { user } = useAuth()
const { t, locale } = useI18n()

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: () => `${t('organizer.balance.header.title')} - Archeris Dashboard`
})

const withdrawalColumns = computed(() => [
    { key: 'txId', label: t('organizer.balance.withdrawals.table_tx_id'), sortable: false, class: 'min-w-[140px]' },
    { key: 'date', label: t('organizer.balance.withdrawals.table_date'), sortable: true, sortKey: 'created_at', class: 'min-w-[140px]' },
    { key: 'status', label: t('organizer.balance.withdrawals.table_status'), sortable: true, sortKey: 'status', align: 'center', class: 'min-w-[120px]' },
    { key: 'amount', label: t('organizer.balance.withdrawals.table_amount'), sortable: true, sortKey: 'amount', align: 'right', class: 'min-w-[140px]' }
])

const mutationColumns = computed(() => [
    { key: 'date', label: t('organizer.balance.mutations.table_date'), sortable: false, class: 'min-w-[140px]' },
    { key: 'description', label: t('organizer.balance.mutations.table_desc'), sortable: false, class: 'min-w-[200px]' },
    { key: 'type', label: t('organizer.balance.mutations.table_type'), sortable: false, align: 'center', class: 'min-w-[100px]' },
    { key: 'amount', label: t('organizer.balance.mutations.table_amount'), sortable: false, align: 'right', class: 'min-w-[140px]' },
    { key: 'balanceAfter', label: t('organizer.balance.mutations.table_balance_after'), sortable: false, align: 'right', class: 'min-w-[140px]' }
])

// Security State
const isVerified = ref(false)
const password = ref('')
const verifying = ref(false)

// Tab State
const activeTab = ref('withdrawals')

// Data State
const balance = ref(0)
const withdrawalHistory = ref([])
const loading = ref(true)

// Withdrawals Sort & Pagination
const sortBy = ref('created_at')
const order = ref('DESC')
const currentPage = ref(1)
const totalItems = ref(0)
const itemsPerPage = ref(10)

// Mutations State & Pagination
const mutationHistory = ref([])
const mutationCurrentPage = ref(1)
const mutationTotalItems = ref(0)
const mutationItemsPerPage = ref(10)
const mutationLoading = ref(false)

// Withdrawal Dialog State
const showWithdrawDialog = ref(false)
const otpCode = ref('')
const otpSent = ref(false)
const sendingOtp = ref(false)
const isSubmittingWithdrawal = ref(false)
const withdrawalAmount = ref(null)

// 5 Minutes Active Verification Session States
const verifiedOtp = ref('')
const verifiedTime = ref(null)
const remainingTime = ref(0)
let timerId = null

const isOtpVerified = computed(() => {
    return !!(verifiedOtp.value && verifiedTime.value && (Date.now() - verifiedTime.value < 5 * 60 * 1000))
})

const formattedRemainingTime = computed(() => {
    const m = Math.floor(remainingTime.value / 60)
    const s = remainingTime.value % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
})

const startCountdown = () => {
    if (timerId) clearInterval(timerId)
    const update = () => {
        if (!verifiedTime.value) {
            remainingTime.value = 0
            return
        }
        const diff = Math.max(0, 5 * 60 * 1000 - (Date.now() - verifiedTime.value))
        remainingTime.value = Math.ceil(diff / 1000)
        if (remainingTime.value <= 0) {
            verifiedOtp.value = ''
            verifiedTime.value = null
            otpCode.value = ''
            if (timerId) {
                clearInterval(timerId)
                timerId = null
            }
        }
    }
    update()
    timerId = setInterval(update, 1000)
}

const verifyPassword = async () => {
    if (!password.value) return
    verifying.value = true
    try {
        await api.post('/auth/login', {
            email: user.value?.email,
            password: password.value
        })

        isVerified.value = true
        sessionStorage.setItem('finance_verified', 'true')
        await initData()
    } catch (error) {
        toast.error(t('organizer.balance.password_error'))
    } finally {
        verifying.value = false
    }
}

const fetchWallet = async () => {
    try {
        const res = await api.get('/organizers/wallet')
        balance.value = res?.balance || 0
    } catch (error) {
        console.error('Failed to fetch wallet:', error)
    }
}

const fetchWithdrawals = async () => {
    try {
        const offset = (currentPage.value - 1) * itemsPerPage.value
        const res = await api.get('/organizers/wallet/withdrawals', {
            query: {
                limit: itemsPerPage.value,
                offset: offset,
                sort_by: sortBy.value,
                order: order.value
            }
        })
        const data = res?.data || []
        withdrawalHistory.value = data.map(wd => ({
            id: wd.id,
            txId: wd.reference_no,
            date: new Date(wd.created_at).toLocaleDateString(locale.value === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: wd.status.toUpperCase(),
            amount: wd.amount
        }))
        totalItems.value = res?.meta?.total_items || 0
    } catch (error) {
        console.error('Failed to fetch withdrawals:', error)
    }
}

const toggleSort = (field) => {
    if (sortBy.value === field) {
        order.value = order.value === 'ASC' ? 'DESC' : 'ASC'
    } else {
        sortBy.value = field
        order.value = 'ASC'
    }
}

watch([sortBy, order, currentPage], () => {
    fetchWithdrawals()
})

const fetchMutations = async () => {
    mutationLoading.value = true
    try {
        const res = await api.get('/organizers/wallet/mutations', {
            query: {
                page: mutationCurrentPage.value,
                limit: mutationItemsPerPage.value
            }
        })
        const data = res?.data || []
        mutationHistory.value = data.map(m => ({
            id: m.uuid,
            date: new Date(m.created_at).toLocaleDateString(locale.value === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            type: m.mutation_type,
            amount: m.amount,
            balanceBefore: m.balance_before,
            balanceAfter: m.balance_after,
            refId: m.reference_id,
            description: m.description || m.reference_type
        }))
        mutationTotalItems.value = res?.meta?.total_items || 0
    } catch (error) {
        console.error('Failed to fetch wallet mutations:', error)
    } finally {
        mutationLoading.value = false
    }
}

watch(activeTab, (newTab) => {
    if (newTab === 'mutations' && !mutationHistory.value.length) {
        fetchMutations()
    }
})

watch(mutationCurrentPage, () => {
    fetchMutations()
})

const bankAccounts = ref([])
const primaryAccount = ref(null)
const selectedAccountId = ref('')

const currentSelectedAccount = computed(() => {
    return bankAccounts.value.find(a => (a.id || a.uuid) === selectedAccountId.value) || primaryAccount.value || bankAccounts.value[0] || null
})

const fetchPrimaryAccount = async () => {
    try {
        const res = await api.get('/organizers/bank-accounts')
        const accounts = res?.data || res || []
        bankAccounts.value = Array.isArray(accounts) ? accounts : []
        primaryAccount.value = bankAccounts.value.find(a => a.is_primary) || bankAccounts.value[0] || null
        if (primaryAccount.value) {
            selectedAccountId.value = primaryAccount.value.id || primaryAccount.value.uuid
        }
    } catch (error) {
        console.error('Failed to fetch primary account:', error)
    }
}

const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'selesai': return 'bg-green-100 text-green-700'
        case 'pending': return 'bg-amber-100 text-amber-700'
        case 'gagal': return 'bg-red-100 text-red-700'
        default: return 'bg-gray-100 text-gray-700'
    }
}

const initData = async () => {
    loading.value = true
    await Promise.all([
        fetchWallet(),
        fetchWithdrawals(),
        fetchMutations(),
        fetchPrimaryAccount()
    ])
    loading.value = false
}

const openWithdrawDialog = () => {
    if (balance.value < 100000) {
        toast.error(t('organizer.balance.minimum_balance_error'))
        return
    }
    
    if (!primaryAccount.value && !bankAccounts.value.length) {
        toast.error(t('organizer.balance.no_account_error'))
        return
    }
    
    if (!selectedAccountId.value && primaryAccount.value) {
        selectedAccountId.value = primaryAccount.value.id || primaryAccount.value.uuid
    }

    withdrawalAmount.value = null
    
    if (isOtpVerified.value) {
        otpCode.value = verifiedOtp.value
        otpSent.value = true
    } else {
        otpCode.value = ''
        otpSent.value = false
    }
    
    showWithdrawDialog.value = true
}

const closeWithdrawDialog = () => {
    showWithdrawDialog.value = false
    withdrawalAmount.value = null
    if (!isOtpVerified.value) {
        otpCode.value = ''
        otpSent.value = false
    }
}

const requestWithdrawalOTP = async () => {
    sendingOtp.value = true
    try {
        await api.post('/organizers/wallet/withdrawals/request-otp')
        otpSent.value = true
        toast.success(t('organizer.balance.otp.sent_success'))
    } catch (error) {
        console.error('Failed to request withdrawal OTP:', error)
        toast.error(error?.data?.error || t('organizer.balance.otp.sent_error'))
    } finally {
        sendingOtp.value = false
    }
}

const handleWithdrawal = async () => {
    if (otpCode.value.trim().length !== 6) {
        toast.error(t('organizer.balance.otp.invalid_length'))
        return
    }
    
    if (!withdrawalAmount.value || withdrawalAmount.value < 100000) {
        toast.error(t('organizer.balance.amount_minimum_error'))
        return
    }
    
    if (withdrawalAmount.value > balance.value) {
        toast.error(t('organizer.balance.amount_exceeds_error'))
        return
    }

    isSubmittingWithdrawal.value = true
    try {
        const targetAccountId = selectedAccountId.value || (primaryAccount.value?.id || primaryAccount.value?.uuid)
        const payload = {
            bank_account_id: targetAccountId,
            amount: withdrawalAmount.value,
            otp_code: otpCode.value.trim()
        }

        await api.post('/organizers/wallet/withdrawals', payload)
        toast.success(t('organizer.balance.withdrawal_success'))
        
        // Save verified OTP and time for 5 minutes window
        verifiedOtp.value = otpCode.value.trim()
        verifiedTime.value = Date.now()
        startCountdown()
        
        closeWithdrawDialog()
        
        // Refresh data
        await initData()
    } catch (error) {
        console.error('Failed to submit withdrawal:', error)
        toast.error(error?.data?.error || t('organizer.balance.withdrawal_error'))
    } finally {
        isSubmittingWithdrawal.value = false
    }
}

onMounted(async () => {
    if (sessionStorage.getItem('finance_verified') === 'true') {
        isVerified.value = true
        await initData()
    }
})

onUnmounted(() => {
    if (timerId) {
        clearInterval(timerId)
    }
})
</script>
