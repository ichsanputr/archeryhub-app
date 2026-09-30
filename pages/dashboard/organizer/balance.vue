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
                        <h2 class="text-2xl font-bold text-navy tracking-tight">
                            {{ t('organizer.balance.security.title') }}
                        </h2>
                        <div
                            class="text-xs text-gray-400 font-medium leading-relaxed max-w-[240px] mx-auto">
                            {{ t('organizer.balance.security.desc') }}
                        </div>
                    </div>

                    <div class="space-y-4 pt-2">
                        <BaseInput v-model="password" type="password"
                            :placeholder="t('organizer.balance.security.password_placeholder')"
                            class="!rounded-2xl border-gray-100 focus:!border-primary/30" icon="ph:lock-bold"
                            @keyup.enter="verifyPassword" />
                        <BaseButton @click="verifyPassword" variant="primary" block :loading="verifying"
                            class="h-11 !rounded-xl font-bold text-xs shadow-lg shadow-primary/20">
                            {{ t('organizer.balance.security.open_access') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <div :class="{ 'opacity-20 pointer-events-none': !isVerified }"
            class="space-y-6 md:space-y-8 transition-opacity duration-500 font-body text-navy antialiased pb-16">
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

            <!-- Currency Selector Chips Bar -->
            <div class="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs flex items-center justify-between flex-wrap gap-3">
                <div class="flex items-center gap-2 flex-wrap">
                    <!-- IDR Currency Chip -->
                    <button
                        type="button"
                        @click="selectedCurrency = 'IDR'"
                        :class="[
                            'px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer font-bold select-none',
                            selectedCurrency === 'IDR'
                                ? 'bg-navy text-white shadow-sm ring-1 ring-navy/10'
                                : 'bg-slate-100/90 text-slate-600 hover:text-navy hover:bg-slate-200/80'
                        ]"
                    >
                        <Icon icon="circle-flags:id" class="text-base shrink-0" />
                        <span>{{ isEn ? 'Indonesian Rupiah (IDR)' : 'Rupiah (IDR)' }}</span>
                    </button>

                    <!-- USD Currency Chip -->
                    <button
                        type="button"
                        @click="selectedCurrency = 'USD'"
                        :class="[
                            'px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer font-bold select-none',
                            selectedCurrency === 'USD'
                                ? 'bg-navy text-white shadow-sm ring-1 ring-navy/10'
                                : 'bg-slate-100/90 text-slate-600 hover:text-navy hover:bg-slate-200/80'
                        ]"
                    >
                        <Icon icon="circle-flags:us" class="text-base shrink-0" />
                        <span>{{ isEn ? 'US Dollar (USD)' : 'US Dollar (USD)' }}</span>
                    </button>
                </div>

                <!-- Currency Active Indicator -->
                <div class="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-400 pr-2">
                    <Icon icon="ph:wallet-bold" class="text-sm text-slate-400" />
                    <span>{{ isEn ? 'Active wallet currency:' : 'Mata uang dompet aktif:' }} <strong class="text-navy font-bold">{{ selectedCurrency }}</strong></span>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <!-- Left: Balance Card -->
                <div class="lg:col-span-1 space-y-6">
                    <div
                        class="bg-gradient-to-br from-navy to-navy-dark rounded-3xl p-7 sm:p-8 text-white shadow-lg relative overflow-hidden border border-white/5 flex flex-col justify-between min-h-[300px]">
                        <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                            <Icon icon="ph:coins-bold" class="text-8xl" />
                        </div>
                        
                        <div>
                            <div class="text-primary text-xs font-bold mb-2 flex items-center gap-1.5">
                                <Icon :icon="selectedCurrency === 'USD' ? 'circle-flags:us' : 'circle-flags:id'" class="text-sm" />
                                <span>{{ isEn ? 'Available Balance' : 'Saldo Siap Ditarik' }} ({{ selectedCurrency }})</span>
                            </div>
                            <h2 class="text-3xl sm:text-4xl font-bold tracking-tight mb-2 leading-none tabular-nums">
                                {{ formatMoney(currentBalance, selectedCurrency) }}
                            </h2>
                            <div class="text-xs sm:text-sm text-slate-300 font-medium">
                                {{ isEn ? 'Total accumulated revenue from tournament payments ready for payout.' : 'Akumulasi pendapatan turnamen yang siap dicairkan ke rekening Anda.' }}
                            </div>
                        </div>

                        <div class="space-y-3 pt-6">
                            <BaseButton variant="primary" block
                                @click="isSubscriptionActive ? openWithdrawDialog() : (showPremiumModal = true)"
                                :disabled="currentBalance <= 0"
                                class="font-bold text-xs sm:text-sm h-11 !rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-95 disabled:opacity-50">
                                <Icon :icon="selectedCurrency === 'USD' ? 'ph:paypal-logo-bold' : 'ph:bank-bold'" class="text-base mr-1.5" />
                                {{ isEn ? `Withdraw ${selectedCurrency} Balance` : `Tarik Saldo ${selectedCurrency}` }}
                            </BaseButton>
                            
                            <div class="text-xs sm:text-sm text-slate-400 text-center font-medium leading-relaxed">
                                {{ selectedCurrency === 'USD' 
                                    ? (isEn ? 'USD payouts are processed via PayPal transfer to your account.' : 'Pencairan dana USD disalurkan langsung via transfer PayPal ke akun Anda.')
                                    : t('organizer.balance.withdraw_info', 'Proses penarikan ke rekening bank lokal membutuhkan waktu 1-3 hari kerja.') 
                                }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right: Wallet Ledger Mutations & Withdrawals -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs h-full flex flex-col">
                        <!-- Card Header with Tab Switcher -->
                        <div class="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="flex items-center gap-2.5">
                                <div class="size-9 rounded-xl bg-slate-100 text-navy flex items-center justify-center border border-slate-200/80 shrink-0">
                                    <Icon :icon="activeTableTab === 'mutations' ? 'ph:list-dashes-bold' : 'ph:clock-counter-clockwise-bold'" class="text-base" />
                                </div>
                                <div>
                                    <h3 class="text-sm sm:text-base font-bold text-navy">
                                        {{ activeTableTab === 'mutations' ? (isEn ? 'Wallet Mutations Ledger' : 'Mutasi Saldo Dompet') : t('organizer.balance.withdrawals.title', 'Riwayat Penarikan Dana') }}
                                    </h3>
                                    <div class="text-xs sm:text-sm text-slate-400 font-medium">
                                        {{ activeTableTab === 'mutations' ? (isEn ? 'Real-time record of all credits and debits' : 'Catatan lengkap arus uang masuk pendaftaran & keluar penarikan') : t('organizer.balance.withdrawals.subtitle', 'Daftar pengajuan dan status pencairan saldo Anda') }}
                                    </div>
                                </div>
                            </div>

                            <!-- Tab Toggle Buttons -->
                            <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
                                <button
                                    type="button"
                                    @click="activeTableTab = 'mutations'"
                                    :class="[
                                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                                        activeTableTab === 'mutations'
                                            ? 'bg-white text-navy shadow-xs'
                                            : 'text-slate-500 hover:text-navy'
                                    ]"
                                >
                                    <Icon icon="ph:list-dashes-bold" class="text-xs" />
                                    <span>{{ isEn ? 'Mutations' : 'Mutasi Saldo' }}</span>
                                    <span v-if="mutationHistory.length > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-primary/20 text-navy font-black">
                                        {{ mutationHistory.length }}
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    @click="activeTableTab = 'withdrawals'"
                                    :class="[
                                        'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                                        activeTableTab === 'withdrawals'
                                            ? 'bg-white text-navy shadow-xs'
                                            : 'text-slate-500 hover:text-navy'
                                    ]"
                                >
                                    <Icon icon="ph:arrow-circle-up-right-bold" class="text-xs" />
                                    <span>{{ isEn ? 'Payouts' : 'Penarikan' }}</span>
                                    <span v-if="withdrawalHistory.length > 0" class="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-black">
                                        {{ withdrawalHistory.length }}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <!-- 1. Mutations Table (Default) -->
                        <div v-if="activeTableTab === 'mutations'" class="p-2 sm:p-4">
                            <DashboardDataTable
                                :items="mutationHistory"
                                :columns="mutationColumns"
                                :loading="loadingMutations"
                                :searchable="true"
                                :search-placeholder="isEn ? 'Search description or reference...' : 'Cari keterangan atau no. referensi...'"
                                :has-filter-modal="false"
                                count-icon="ph:receipt-bold"
                                :count-unit="isEn ? 'mutations' : 'mutasi'"
                                :show-count-badge="true"
                                :items-per-page="10"
                                :empty-title="isEn ? 'No mutation records found' : 'Belum ada catatan mutasi saldo'"
                                empty-icon="ph:wallet"
                            >
                                <template #item-date="{ item }">
                                    <span class="text-xs text-slate-600 font-medium whitespace-nowrap">{{ item.date }}</span>
                                </template>

                                <template #item-type="{ item }">
                                    <div class="flex justify-center">
                                        <span
                                            class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs"
                                            :class="item.mutation_type === 'credit' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
                                        >
                                            <Icon :icon="item.mutation_type === 'credit' ? 'ph:arrow-down-left-bold' : 'ph:arrow-up-right-bold'" />
                                            {{ item.mutation_type === 'credit' ? (isEn ? 'Credit (+)' : 'Masuk (+)') : (isEn ? 'Debit (-)' : 'Keluar (-)') }}
                                        </span>
                                    </div>
                                </template>

                                <template #item-description="{ item }">
                                    <div class="space-y-0.5 max-w-xs">
                                        <div class="text-xs font-bold text-navy truncate">{{ item.description || '-' }}</div>
                                        <div class="font-mono text-[11px] text-slate-400">{{ item.reference_id }}</div>
                                    </div>
                                </template>

                                <template #item-amount="{ item }">
                                    <div
                                        class="text-right font-bold text-xs sm:text-sm tabular-nums whitespace-nowrap"
                                        :class="item.mutation_type === 'credit' ? 'text-emerald-600' : 'text-rose-600'"
                                    >
                                        {{ item.mutation_type === 'credit' ? '+' : '-' }}{{ formatMoney(item.amount, selectedCurrency) }}
                                    </div>
                                </template>

                                <template #item-balance_after="{ item }">
                                    <div class="text-right font-black text-navy text-xs sm:text-sm tabular-nums whitespace-nowrap">
                                        {{ formatMoney(item.balance_after, selectedCurrency) }}
                                    </div>
                                </template>
                            </DashboardDataTable>
                        </div>

                        <!-- 2. Withdrawal History Table -->
                        <div v-else class="p-2 sm:p-4">
                            <DashboardDataTable
                                :items="withdrawalHistory"
                                :columns="withdrawalColumns"
                                :loading="loading"
                                :searchable="true"
                                :search-placeholder="isEn ? 'Search reference no...' : 'Cari no. referensi penarikan...'"
                                :has-filter-modal="false"
                                count-icon="ph:receipt-bold"
                                :count-unit="isEn ? 'withdrawals' : 'penarikan'"
                                :show-count-badge="true"
                                :items-per-page="10"
                                :empty-title="t('organizer.balance.withdrawals.empty', 'Belum ada riwayat penarikan')"
                                empty-icon="ph:clock-counter-clockwise"
                            >
                                <template #item-txId="{ item }">
                                    <span class="font-mono text-xs sm:text-sm font-bold text-navy">{{ item.txId }}</span>
                                </template>

                                <template #item-date="{ item }">
                                    <span class="text-xs sm:text-sm text-slate-600 font-medium whitespace-nowrap">{{ item.date }}</span>
                                </template>

                                <template #item-status="{ item }">
                                    <div class="flex justify-center">
                                        <span :class="getStatusClass(item.status)"
                                            class="px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-bold border shadow-2xs">
                                            {{ item.statusLabel }}
                                        </span>
                                    </div>
                                </template>

                                <template #item-amount="{ item }">
                                    <div class="text-right font-bold text-navy text-xs sm:text-sm tabular-nums whitespace-nowrap">
                                        {{ formatMoney(item.amount, item.currency || selectedCurrency) }}
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
                    <div class="size-11 bg-primary/20 rounded-xl flex items-center justify-center text-navy shadow-inner shrink-0">
                        <Icon :icon="selectedCurrency === 'USD' ? 'ph:paypal-logo-bold' : 'ph:bank-bold'" class="text-2xl" />
                    </div>
                    <div>
                        <h2 class="text-base sm:text-lg font-bold text-navy">
                            {{ isEn ? `Withdraw ${selectedCurrency} Balance` : `Tarik Saldo ${selectedCurrency}` }}
                        </h2>
                        <div class="text-xs sm:text-sm text-slate-500 font-medium">
                            {{ isEn ? 'Submit payout request to your account' : 'Ajukan pencairan dana ke rekening Anda' }}
                        </div>
                    </div>
                </div>
            </template>

            <div class="space-y-5 sm:space-y-6">
                <!-- Verification OTP Segment -->
                <div v-if="!otpSent" class="space-y-4 text-center py-6 sm:py-8 px-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <Icon icon="ph:envelope-open-bold" class="text-5xl text-primary mx-auto" />
                    <div class="space-y-1.5">
                        <h3 class="text-sm sm:text-base font-bold text-navy">
                            {{ t('organizer.balance.otp.request_title', 'Verifikasi Email Diperlukan') }}
                        </h3>
                        <div class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                            {{ t('organizer.balance.otp.request_desc', 'Kami akan mengirimkan 6 digit kode OTP ke email akun Anda untuk keamanan.') }}
                        </div>
                    </div>
                    <BaseButton variant="primary" class="font-bold text-xs sm:text-sm h-10 px-6 tracking-wide shadow-md"
                        :loading="sendingOtp" @click="requestWithdrawalOTP">
                        {{ t('organizer.balance.otp.send', 'Kirim Kode OTP') }}
                    </BaseButton>
                </div>

                <!-- Verification Input fields -->
                <div v-else class="space-y-5">
                    <!-- Already Verified Banner -->
                    <div v-if="isOtpVerified"
                        class="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col gap-2 items-center text-center">
                        <div class="size-11 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Icon icon="ph:shield-check-fill" class="text-2xl text-emerald-600" />
                        </div>
                        <div>
                            <h4 class="text-sm sm:text-base font-bold text-emerald-900">
                                {{ t('organizer.balance.otp.verified_title', 'Sesi Terverifikasi') }}
                            </h4>
                            <div class="text-xs sm:text-sm text-emerald-700 mt-1 font-medium">
                                {{ t('organizer.balance.otp.verified_desc', 'Verifikasi aktif selama:') }}
                                <span class="font-bold font-mono text-emerald-800">{{ formattedRemainingTime }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else class="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl flex gap-3 items-center">
                        <Icon icon="ph:check-circle-bold" class="text-emerald-600 text-xl shrink-0" />
                        <div class="text-xs sm:text-sm text-emerald-800 font-medium leading-relaxed">
                            {{ t('organizer.balance.otp.code_sent', 'Kode OTP 6 digit telah dikirim ke email Anda.') }}
                        </div>
                    </div>

                    <!-- OTP Input -->
                    <div v-if="!isOtpVerified" class="space-y-2">
                        <label class="block text-xs sm:text-sm font-bold text-navy">
                            {{ t('organizer.balance.otp.code_label', 'Kode OTP') }}
                        </label>
                        <BaseInput v-model="otpCode" :placeholder="t('organizer.balance.otp.code_placeholder', 'Masukkan 6 digit kode')" type="text" maxlength="6"
                            class="font-mono text-center tracking-widest text-lg sm:text-xl font-bold" required />
                    </div>

                    <!-- Withdrawal Amount -->
                    <div class="space-y-2">
                        <label class="block text-xs sm:text-sm font-bold text-navy">
                            {{ t('organizer.balance.amount_label', 'Nominal Penarikan') }} ({{ selectedCurrency }})
                        </label>
                        <BaseInput v-model="withdrawalAmount" :placeholder="isEn ? 'Enter withdrawal amount' : 'Masukkan nominal penarikan'" type="number" :min="minWithdrawalAmount"
                            :max="currentBalance" required />
                        <div class="text-xs sm:text-sm text-slate-500 font-medium flex items-center justify-between pt-0.5">
                            <span>{{ t('organizer.balance.available_balance', 'Saldo Tersedia') }}: <strong class="text-navy">{{ formatMoney(currentBalance, selectedCurrency) }}</strong></span>
                            <span>Min: <strong class="text-navy">{{ formatMoney(minWithdrawalAmount, selectedCurrency) }}</strong></span>
                        </div>
                    </div>

                    <!-- Bank Account Info & Selector -->
                    <div v-if="filteredBankAccounts.length"
                        class="p-4 sm:p-5 bg-navy/5 border border-navy/10 rounded-2xl space-y-3">
                        <div class="flex items-center justify-between">
                            <label class="text-xs sm:text-sm font-bold text-navy">{{ t('organizer.balance.destination_account', 'Rekening Bank / Tujuan Pencairan') }}</label>
                            <NuxtLink to="/dashboard/organizer/bank-accounts" class="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                <Icon icon="ph:gear-six-bold" />
                                <span>{{ t('organizer.balance.manage_accounts', 'Kelola Rekening') }}</span>
                            </NuxtLink>
                        </div>

                        <!-- Dropdown selector if organizer has more than 1 matching account -->
                        <div v-if="filteredBankAccounts.length > 1">
                            <select v-model="selectedAccountId"
                                class="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-navy focus:border-primary outline-none shadow-2xs">
                                <option v-for="acc in filteredBankAccounts" :key="acc.id || acc.uuid" :value="acc.id || acc.uuid">
                                    {{ acc.bank_name }} - {{ acc.account_number }} ({{ acc.currency || 'IDR' }} &bull; {{ acc.country_code || 'ID' }}) {{ acc.is_primary ? `(${t('organizer.balance.primary_badge', 'Utama')})` : '' }}
                                </option>
                            </select>
                        </div>

                        <!-- Selected Account Card Display -->
                        <div v-if="currentSelectedAccount" class="p-3.5 bg-white border border-gray-100 rounded-xl space-y-1.5 text-xs sm:text-sm shadow-2xs">
                            <div class="flex items-center justify-between gap-2">
                                <div class="font-bold text-navy text-sm flex items-center gap-1.5">
                                    <Icon :icon="getBankIcon(currentSelectedAccount.bank_name)" class="text-base text-navy" />
                                    <span>{{ currentSelectedAccount.bank_name }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold">
                                        {{ currentSelectedAccount.currency || 'IDR' }}
                                    </span>
                                    <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                                        {{ currentSelectedAccount.country_code || 'ID' }}
                                    </span>
                                </div>
                            </div>
                            <div class="font-mono font-bold text-slate-800 text-sm sm:text-base tracking-wider truncate">{{ currentSelectedAccount.account_number }}</div>
                            <div class="text-xs text-slate-500 font-medium truncate flex items-center justify-between">
                                <span>a.n {{ currentSelectedAccount.account_name }}</span>
                                <span v-if="currentSelectedAccount.swift_code" class="text-[11px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                    SWIFT: {{ currentSelectedAccount.swift_code }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- No Account Warning -->
                    <div v-else
                        class="p-4 sm:p-5 bg-amber-50/80 border border-amber-200 rounded-2xl space-y-2 text-xs sm:text-sm text-amber-900">
                        <div class="flex items-center gap-2 font-bold">
                            <Icon icon="ph:warning-circle-bold" class="text-lg text-amber-600" />
                            <span>{{ isEn ? 'No destination account registered' : 'Belum ada rekening/tujuan pencairan' }}</span>
                        </div>
                        <div class="text-xs text-slate-600 leading-relaxed font-medium">
                            {{ isEn ? 'Please add a bank account or PayPal destination first.' : 'Silakan tambahkan nomor rekening bank atau akun PayPal Anda terlebih dahulu di menu Rekening.' }}
                        </div>
                        <NuxtLink to="/dashboard/organizer/bank-accounts" class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1">
                            <Icon icon="ph:plus-bold" />
                            <span>{{ t('organizer.bank_accounts.add_new', 'Tambah Rekening') }}</span>
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <template #action>
                <BaseButton v-if="otpSent" variant="primary" block @click="handleWithdrawal" :loading="isSubmittingWithdrawal"
                    :disabled="otpCode.trim().length !== 6 || !withdrawalAmount || withdrawalAmount < minWithdrawalAmount || withdrawalAmount > currentBalance || !filteredBankAccounts.length"
                    class="h-11 font-bold text-xs sm:text-sm shadow-md">
                    <Icon icon="ph:check-bold" class="mr-1.5 text-base" />
                    {{ t('organizer.balance.submit_withdrawal', 'Ajukan Penarikan') }}
                </BaseButton>
            </template>
        </BaseDialogForm>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'
import { formatMoney } from '~/composables/useCurrency'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

const api = useApi()
const toast = useToast()
const { user } = useAuth()
const { t, locale } = useI18n()

const isEn = computed(() => (locale.value || 'id') === 'en')

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: () => `${t('organizer.balance.header.title', 'Saldo & Rekening')} - Archeris Dashboard`
})

const selectedCurrency = ref('IDR')
const activeTableTab = ref('mutations')

const mutationColumns = computed(() => [
    { key: 'date', label: t('organizer.balance.withdrawals.table_date', 'Tanggal'), sortable: true, sortKey: 'created_at', class: 'min-w-[130px]' },
    { key: 'type', label: isEn.value ? 'Type' : 'Tipe', align: 'center', sortable: true, sortKey: 'mutation_type', class: 'min-w-[110px]' },
    { key: 'description', label: isEn.value ? 'Description & Ref' : 'Keterangan & Referensi', sortable: true, sortKey: 'description', class: 'min-w-[200px]' },
    { key: 'amount', label: isEn.value ? 'Amount' : 'Perubahan', sortable: true, sortKey: 'amount', align: 'right', class: 'min-w-[130px]' },
    { key: 'balance_after', label: isEn.value ? 'Ending Balance' : 'Saldo Akhir', sortable: true, sortKey: 'balance_after', align: 'right', class: 'min-w-[140px]' }
])

const withdrawalColumns = computed(() => [
    { key: 'txId', label: t('organizer.balance.withdrawals.table_tx_id', 'ID Transaksi'), sortable: false, class: 'min-w-[140px]' },
    { key: 'date', label: t('organizer.balance.withdrawals.table_date', 'Tanggal & Waktu'), sortable: true, sortKey: 'created_at', class: 'min-w-[140px]' },
    { key: 'status', label: t('organizer.balance.withdrawals.table_status', 'Status'), sortable: true, sortKey: 'status', align: 'center', class: 'min-w-[120px]' },
    { key: 'amount', label: t('organizer.balance.withdrawals.table_amount', 'Jumlah'), sortable: true, sortKey: 'amount', align: 'right', class: 'min-w-[140px]' }
])

// Security State
const isVerified = ref(false)
const password = ref('')
const verifying = ref(false)

// Data State
const walletData = ref({
    balance: 0,
    balances: { IDR: 0, USD: 0 },
    total_earnings: { IDR: 0, USD: 0 },
    total_withdrawn: { IDR: 0, USD: 0 }
})

const withdrawalHistory = ref([])
const mutationHistory = ref([])
const loading = ref(true)
const loadingMutations = ref(false)

const currentBalance = computed(() => {
    if (selectedCurrency.value === 'USD') {
        return walletData.value?.balances?.USD || 0
    }
    return walletData.value?.balances?.IDR || walletData.value?.balance || 0
})

const minWithdrawalAmount = computed(() => {
    return selectedCurrency.value === 'USD' ? 10 : 100000
})

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
        toast.error(t('organizer.balance.password_error', 'Kata sandi tidak sesuai'))
    } finally {
        verifying.value = false
    }
}

const fetchWallet = async () => {
    try {
        const res = await api.get('/organizers/wallet')
        walletData.value = res || { balance: 0, balances: { IDR: 0, USD: 0 } }
    } catch (error) {
        console.error('Failed to fetch wallet:', error)
    }
}

const fetchMutations = async () => {
    try {
        loadingMutations.value = true
        const res = await api.get('/wallet/mutations?limit=50')
        const data = res?.data || []
        mutationHistory.value = data.map((m) => ({
            id: m.uuid || m.id,
            date: new Date(m.created_at).toLocaleDateString(locale.value === 'id' ? 'id-ID' : 'en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            mutation_type: m.mutation_type || 'credit',
            amount: m.amount || 0,
            balance_before: m.balance_before || 0,
            balance_after: m.balance_after || 0,
            reference_id: m.reference_id || '-',
            description: m.description || (m.mutation_type === 'credit' ? 'Pemasukan Saldo' : 'Penarikan Saldo')
        }))
    } catch (error) {
        console.error('Failed to fetch mutations:', error)
    } finally {
        loadingMutations.value = false
    }
}

const fetchWithdrawals = async () => {
    try {
        loading.value = true
        const res = await api.get('/organizers/wallet/withdrawals', {
            query: {
                limit: 50,
                sort_by: 'created_at',
                order: 'DESC'
            }
        })
        const data = res?.data || []
        withdrawalHistory.value = data.map((wd) => ({
            id: wd.id,
            txId: wd.reference_no || `#WD-${wd.id?.substring(0, 8)}`,
            date: new Date(wd.created_at).toLocaleDateString(locale.value === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
            status: (wd.status || 'pending').toLowerCase(),
            statusLabel: getStatusLabel(wd.status),
            amount: wd.amount,
            currency: 'IDR'
        }))
    } catch (error) {
        console.error('Failed to fetch withdrawals:', error)
    } finally {
        loading.value = false
    }
}

const getStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'completed' || s === 'success') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    if (s === 'failed' || s === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-200'
    return 'bg-amber-50 text-amber-700 border-amber-200'
}

const getStatusLabel = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'completed' || s === 'success') return isEn.value ? 'Completed' : 'Berhasil'
    if (s === 'failed' || s === 'rejected') return isEn.value ? 'Failed' : 'Gagal'
    return isEn.value ? 'Pending' : 'Menunggu'
}

const bankAccounts = ref([])
const primaryAccount = ref(null)
const selectedAccountId = ref('')

const filteredBankAccounts = computed(() => {
    if (!bankAccounts.value.length) return []
    if (selectedCurrency.value === 'USD') {
        const usdAccounts = bankAccounts.value.filter(a => 
            (a.currency || '').toUpperCase() === 'USD' || 
            (a.bank_name || '').toLowerCase().includes('paypal') ||
            (a.bank_name || '').toLowerCase().includes('wise') ||
            (a.country_code && a.country_code !== 'ID')
        )
        return usdAccounts.length ? usdAccounts : bankAccounts.value
    }
    return bankAccounts.value
})

const currentSelectedAccount = computed(() => {
    const list = filteredBankAccounts.value
    return list.find(a => (a.id || a.uuid) === selectedAccountId.value) || list[0] || null
})

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

const fetchPrimaryAccount = async () => {
    try {
        const res = await api.get('/organizers/bank-accounts')
        const accounts = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        bankAccounts.value = accounts
        primaryAccount.value = accounts.find((a) => a.is_primary) || accounts[0] || null
        if (primaryAccount.value) {
            selectedAccountId.value = primaryAccount.value.id || primaryAccount.value.uuid
        }
    } catch (error) {
        console.error('Failed to fetch bank accounts:', error)
    }
}

const requestWithdrawalOTP = async () => {
    sendingOtp.value = true
    try {
        await api.post('/organizers/wallet/withdrawals/request-otp', {})
        otpSent.value = true
        toast.success(t('organizer.balance.otp.sent_success', 'Kode OTP telah dikirim ke email Anda'))
    } catch (error) {
        toast.error(error?.response?.data?.error || t('organizer.balance.otp.sent_error', 'Gagal mengirim kode OTP'))
    } finally {
        sendingOtp.value = false
    }
}

const openWithdrawDialog = () => {
    if (!bankAccounts.value.length && selectedCurrency.value === 'IDR') {
        toast.warning(t('organizer.balance.no_bank_warning', 'Silakan tambahkan rekening bank terlebih dahulu di menu Rekening'))
        return
    }
    withdrawalAmount.value = null
    otpCode.value = ''
    otpSent.value = false
    showWithdrawDialog.value = true
}

const closeWithdrawDialog = () => {
    showWithdrawDialog.value = false
    otpCode.value = ''
    otpSent.value = false
    withdrawalAmount.value = null
}

const handleWithdrawal = async () => {
    if (!withdrawalAmount.value || withdrawalAmount.value < minWithdrawalAmount.value) {
        toast.warning(isEn.value ? `Minimum withdrawal is ${formatMoney(minWithdrawalAmount.value, selectedCurrency.value)}` : `Nominal minimal penarikan adalah ${formatMoney(minWithdrawalAmount.value, selectedCurrency.value)}`)
        return
    }

    if (withdrawalAmount.value > currentBalance.value) {
        toast.error(isEn.value ? 'Insufficient balance' : 'Saldo tidak mencukupi')
        return
    }

    isSubmittingWithdrawal.value = true
    try {
        await api.post('/organizers/wallet/withdraw', {
            bank_account_id: selectedAccountId.value,
            amount: Number(withdrawalAmount.value),
            otp_code: otpCode.value.trim(),
            currency: selectedCurrency.value
        })

        toast.success(t('organizer.balance.withdraw_success', 'Pengajuan penarikan dana berhasil dikirim'))
        closeWithdrawDialog()
        await fetchWallet()
        await fetchWithdrawals()
        await fetchMutations()
    } catch (error) {
        toast.error(error?.response?.data?.error || t('organizer.balance.withdraw_error', 'Gagal mengajukan penarikan dana'))
    } finally {
        isSubmittingWithdrawal.value = false
    }
}

const initData = async () => {
    await Promise.all([
        fetchWallet(),
        fetchWithdrawals(),
        fetchMutations(),
        fetchPrimaryAccount()
    ])
}

onMounted(() => {
    if (sessionStorage.getItem('finance_verified') === 'true') {
        isVerified.value = true
        initData()
    }
})
</script>
