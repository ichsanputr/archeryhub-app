<template>
    <div class="flex flex-col gap-6 md:gap-8 pb-16">
        <!-- Header (Standard Dashboard Style) -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex items-center gap-2 text-sm text-white/60 mb-4">
                    <NuxtLink to="/dashboard/archer/events" class="hover:text-white transition-colors">{{ t('my_registration.my_events', 'Event Saya') }}</NuxtLink>
                    <Icon icon="ph:caret-right-bold" class="text-base" />
                    <span class="text-primary font-medium">{{ t('my_registration.registration_status', 'Pendaftaran & Tiket') }}</span>
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
                            <Icon icon="ph:ticket-bold" class="text-primary text-2xl" />
                        </div>
                        <div class="flex-grow">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{{ t('my_registration.my_registration_status', 'Detail Pendaftaran & Tiket') }}</h1>
                            <div class="text-slate-300 text-sm mt-1">{{ t("my_registration.header_subtitle") }}</div>
                        </div>
                    </div>
                    <div v-if="participant && !isPaid(participant.payment_status)">
                        <BaseButton variant="danger" @click="showCancelConfirm = true" :loading="isCancelling"
                            class="h-9 font-black tracking-widest text-[10px] shadow-md shadow-red-100/50 w-full sm:w-auto justify-center">
                            <Icon icon="ph:x-circle-bold" class="mr-1.5" />
                            {{ t('my_registration.cancel', 'Batalkan Pendaftaran') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <div
                    class="h-48 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
                <div
                    class="h-64 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
            </div>
            <div
                class="h-96 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />
        </div>

        <template v-else-if="participant">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <!-- Left Column: Profile & Registered Categories -->
                <div class="lg:col-span-2 space-y-6 md:space-y-8">

                    <!-- Premium Profile Header -->
                    <div
                        class="relative overflow-hidden rounded-3xl sm:rounded-[40px] border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-1">
                        <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-primary/10">
                        </div>
                        <div class="relative p-5 sm:p-8 pt-8 sm:pt-12">
                            <div class="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end">
                                <div class="relative group shrink-0">
                                    <div
                                        class="size-24 sm:size-28 md:size-32 rounded-2xl sm:rounded-[32px] border-4 sm:border-[6px] border-white dark:border-slate-800 shadow-sm overflow-hidden bg-slate-100">
                                        <img :src="useImageOrDefault(participant.avatar_url || participant.avatar, participant.full_name)"
                                            :alt="participant.full_name"
                                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    </div>
                                    <div
                                        class="absolute -bottom-2 -right-2 size-8 sm:size-10 bg-primary text-navy rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-sm">
                                        <Icon icon="ph:user-circle-fill" class="text-base sm:text-xl" />
                                    </div>
                                </div>
                                <div class="flex-1 text-center md:text-left min-w-0 w-full">
                                    <div
                                        class="flex flex-col md:flex-row md:items-center gap-3 mb-3 justify-center md:justify-start">
                                        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-navy dark:text-white tracking-tight break-words">{{
                                            participant.full_name }}</h1>
                                    </div>
                                    <div
                                        class="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 text-slate-500 dark:text-slate-400 font-bold text-xs sm:text-sm">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ph:shield-check-bold" class="text-primary shrink-0" />
                                            <span>{{ participant.club_name || t('my_registration.independent') }}</span>
                                        </div>
                                        <div class="size-1 rounded-full bg-slate-200 hidden md:block"></div>
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ph:envelope-simple-bold" class="text-primary shrink-0" />
                                            <span class="truncate max-w-[200px] sm:max-w-xs">{{ participant.email }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Registered Categories -->
                    <div class="space-y-6">
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg sm:text-xl font-black text-navy dark:text-white flex items-center gap-2.5 sm:gap-3">
                                <Icon icon="ph:stack-bold" class="text-primary" />
                                {{ t('my_registration.registered_categories') }}
                            </h3>
                            <span
                                class="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-md text-[9px] font-black tracking-widest">
                                {{ t('my_registration.categories_count', { count: participant.categories?.length || 0 }) }}
                            </span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div v-for="cat in participant.categories" :key="cat.id"
                                class="bg-white dark:bg-slate-800 p-5 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-primary/40 transition-all group">
                                <div class="flex justify-between items-start mb-4">
                                    <div
                                        class="size-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-navy transition-colors shadow-sm">
                                        <Icon icon="ph:target-bold" class="text-xl" />
                                    </div>
                                    <span :class="getStatusClass(cat.payment_status)"
                                        class="px-2 py-1 rounded-lg text-[9px] font-black tracking-widest border">
                                        {{ getDisplayStatus(cat.payment_status) }}
                                    </span>
                                </div>
                                <h4
                                    class="text-base sm:text-lg font-black text-navy dark:text-white leading-tight mb-2 tracking-tight line-clamp-2">
                                    {{ cat.category_name }}
                                </h4>
                                <div class="text-[10px] font-bold text-slate-400 tracking-widest mb-4">
                                    {{ cat.division_name }} - {{ cat.event_type_name }}
                                </div>
                                <div
                                    class="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <div class="flex flex-col text-right">
                                        <span class="text-[9px] text-slate-400 font-black tracking-widest">{{ t('my_registration.fee') }}</span>
                                        <span class="text-sm font-black">Rp {{
                                            formatCurrency(cat.payment_amount) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Payment & QR -->
                <div class="space-y-6 md:space-y-8">
                    <!-- Overall Status & QR -->
                    <div
                        class="bg-white dark:bg-slate-800 rounded-3xl sm:rounded-[40px] p-5 sm:p-8 text-navy dark:text-white border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                        <div class="absolute -top-12 -right-12 size-48 bg-primary/5 rounded-full blur-3xl"></div>

                        <div class="relative flex flex-col items-center">
                            <div class="w-full flex justify-between items-center mb-6">
                                <span class="text-[10px] font-black tracking-[0.2em] text-slate-400">{{ t('my_registration.total_bill') }}</span>
                                <span class="text-lg sm:text-xl font-black">Rp {{
                                    formatCurrency(participant.payment_amount)
                                    }}</span>
                            </div>

                            <!-- QR Code for re-registration / check-in - show when paid -->
                            <div v-if="['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes((participant?.payment_status || '').toLowerCase())"
                                class="bg-white border border-emerald-200 rounded-2xl p-6 text-center shadow-sm mb-6 w-full">
                                <div class="text-xs font-black text-emerald-700 tracking-wider mb-3">{{ t("my_registration.qr_checkin_title") }}</div>
                                <div class="flex justify-center mb-3">
                                    <img :src="`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(participant?.qr_raw || ('ARCHERIS-CHECKIN:' + (participant?.archer_id || eventId)))}&size=200x200&color=051923`"
                                        alt="Registration QR Code"
                                        class="w-44 h-44 rounded-xl border border-emerald-100 shadow-2xs p-2 bg-white" />
                                </div>
                                <div class="text-xs text-gray-500 font-medium leading-relaxed">{{ t("my_registration.qr_checkin_hint") }}</div>
                            </div>

                            <!-- Payment Actions / Status -->
                            <div class="w-full space-y-4">
                                <div class="flex items-center justify-between px-1">
                                    <span class="text-[10px] font-black tracking-widest text-slate-400">{{ t('my_registration.payment_status') }}</span>
                                    <span :class="getStatusClass(participant.payment_status)"
                                        class="px-2.5 py-1 rounded-xl text-[10px] font-black tracking-widest border">
                                        {{ getDisplayStatus(participant.payment_status) }}
                                    </span>
                                </div>

                                <!-- Active Transaction / Methods -->
                                <div v-if="participant.transaction"
                                    class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-primary/20 shadow-sm space-y-4">
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center gap-2">
                                            <Icon icon="ph:credit-card-bold" class="text-primary shrink-0" />
                                            <span
                                                class="text-xs font-black text-navy dark:text-white tracking-tight">
                                                {{ t('my_registration.method') }} {{ participant.transaction.payment_method }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
                                        <div class="flex justify-between text-[10px] font-bold">
                                            <span class="text-slate-400">{{ t('my_registration.invoice_no') }}</span>
                                            <span class="text-navy dark:text-white font-mono truncate max-w-[160px] text-right">{{
                                                participant.transaction.reference }}</span>
                                        </div>

                                        <!-- VA / Pay code -->
                                        <div v-if="participant.transaction.va_number || participant.transaction.pay_code"
                                            class="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 border border-slate-100 dark:border-slate-700">
                                            <span class="text-[10px] font-black text-slate-400 tracking-widest">
                                                {{ participant.transaction.va_number ? t('my_registration.va_number') : t('my_registration.payment_code') }}
                                            </span>
                                            <span
                                                class="text-xs sm:text-sm font-black text-navy dark:text-white font-mono tracking-wider select-all">
                                                {{ participant.transaction.va_number || participant.transaction.pay_code
                                                }}
                                            </span>
                                        </div>

                                        <!-- QR code for pending transaction only -->
                                        <div v-if="participant.transaction.qr_url && participant.payment_status !== 'paid'" class="flex justify-center">
                                            <img :src="getImageUrl(participant.transaction.qr_url)" alt="QR Code"
                                                class="w-36 sm:w-40 h-36 sm:h-40 rounded-xl border border-slate-200 object-contain" />
                                        </div>

                                        <!-- If payment is already PAID / LUNAS -->
                                        <div v-if="isPaid(participant.payment_status) || participant.transaction.status === 'paid'"
                                            class="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-3">
                                            <div class="flex gap-2">
                                                <Icon icon="ph:check-circle-bold" class="text-emerald-600 text-lg shrink-0 mt-0.5" />
                                                <span class="text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                                                    {{ t("my_registration.paid_confirmed_msg") }}
                                                </span>
                                            </div>
                                            <div v-if="participant.transaction.sender_name" class="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                                {{ t('my_registration.sender_name') }}: <span class="font-medium">{{ participant.transaction.sender_name }}</span>
                                            </div>
                                            <div v-if="participant.transaction.proof_url" class="relative rounded-lg overflow-hidden border border-gray-100 bg-white">
                                                <img :src="getImageUrl(participant.transaction.proof_url)" alt="Payment Proof" class="w-full h-auto max-h-40 object-contain mx-auto cursor-pointer" @click="openImage(getImageUrl(participant.transaction.proof_url))" />
                                            </div>
                                        </div>

                                        <!-- If payment method is manual and NOT paid yet -->
                                        <template v-else-if="participant.transaction.payment_method === 'manual'">
                                            <!-- Awaiting verification status -->
                                            <div v-if="participant.transaction.status === 'awaiting_verification'"
                                                class="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-xl space-y-3">
                                                <div class="flex gap-2">
                                                    <Icon icon="ph:clock-bold" class="text-amber-500 text-lg shrink-0 mt-0.5" />
                                                    <span class="text-xs text-amber-800 dark:text-amber-300 font-bold">
                                                        Menunggu Verifikasi Penyelenggara
                                                    </span>
                                                </div>
                                                <div class="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed font-medium">
                                                    Bukti transfer Anda telah dikirim dan sedang diverifikasi oleh panitia event.
                                                </div>
                                                <div v-if="participant.transaction.sender_name" class="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                                                    {{ t('my_registration.sender_name') }}: <span class="font-medium">{{ participant.transaction.sender_name }}</span>
                                                </div>
                                                <div v-if="participant.transaction.proof_url" class="relative rounded-lg overflow-hidden border border-gray-100 bg-white">
                                                    <img :src="getImageUrl(participant.transaction.proof_url)" alt="Payment Proof" class="w-full h-auto max-h-40 object-contain mx-auto cursor-pointer" @click="openImage(getImageUrl(participant.transaction.proof_url))" />
                                                </div>
                                            </div>

                                            <!-- Pending or Rejected status (Needs Upload) -->
                                            <div v-else class="space-y-4">
                                                <!-- Rejected notice -->
                                                <div v-if="participant.transaction.status === 'rejected'"
                                                    class="p-3.5 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl space-y-1">
                                                    <div class="flex gap-2">
                                                        <Icon icon="ph:warning-circle-bold" class="text-red-500 text-lg shrink-0 mt-0.5" />
                                                        <span class="text-xs text-red-800 dark:text-red-300 font-bold">
                                                            Pembayaran Ditolak
                                                        </span>
                                                    </div>
                                                    <div v-if="participant.transaction.rejection_reason" class="text-[11px] text-slate-500 dark:text-slate-400 ml-7 leading-snug font-medium">
                                                        Alasan: {{ participant.transaction.rejection_reason }}
                                                    </div>
                                                </div>

                                                <!-- Upload Form -->
                                                <div class="space-y-3 pt-2">
                                                    <div class="space-y-1">
                                                        <label class="text-[10px] font-black text-gray-400 tracking-widest block">{{ t('my_registration.sender_name') }}</label>
                                                        <input type="text" v-model="senderName" 
                                                            class="w-full px-3 py-2.5 text-xs border border-gray-200 dark:border-slate-700 bg-transparent rounded-xl focus:outline-none focus:border-primary font-medium"
                                                            :placeholder="t('my_registration.sender_name_placeholder')" />
                                                    </div>

                                                    <div class="text-[10px] font-black text-gray-400 tracking-widest">{{ t('my_registration.upload_proof') }}</div>
                                                    <div @click="triggerFileInput"
                                                        class="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-slate-900"
                                                        :class="proofFileUrl ? 'border-primary/50 bg-primary/5' : 'border-gray-200 dark:border-slate-700'">
                                                        <input type="file" ref="proofInput" class="hidden" accept="image/*" @change="handleProofUpload" />
                                                        <template v-if="uploadingProof">
                                                            <Icon icon="ph:circle-notch-bold" class="text-xl text-primary animate-spin mb-2" />
                                                            <span class="text-[10px] text-gray-500 font-bold">Mengunggah...</span>
                                                        </template>
                                                        <template v-else-if="proofFileUrl">
                                                            <img :src="proofFileUrl" class="max-h-24 object-contain rounded-lg mb-2 border border-gray-100" />
                                                            <span class="text-[10px] text-green-600 font-bold">Bukti Terpilih ✓</span>
                                                        </template>
                                                        <template v-else>
                                                            <Icon icon="ph:cloud-arrow-up-bold" class="text-xl text-gray-400 mb-2" />
                                                            <span class="text-[10px] text-gray-500 font-bold">Klik untuk Upload Bukti Transfer</span>
                                                        </template>
                                                    </div>

                                                    <BaseButton variant="primary" block :loading="uploadingProof"
                                                        class="h-10 font-black tracking-widest text-[11px] shadow-sm"
                                                        @click="submitManualProof">
                                                        Kirim Bukti Pembayaran
                                                    </BaseButton>

                                                    <span v-if="uploadError" class="text-xs text-red-500 font-bold block text-center">{{ uploadError }}</span>
                                                </div>
                                            </div>
                                        </template>

                                        <!-- If online gateway payment and NOT paid yet -->
                                        <template v-else-if="participant.transaction.status === 'pending'">
                                            <BaseButton
                                                variant="primary" block
                                                class="h-11 font-black tracking-widest text-xs shadow-sm"
                                                @click="handleTransactionPayment(participant.transaction)">
                                                {{ t('my_registration.pay_now') }}
                                                <Icon icon="ph:arrow-right-bold" class="ml-2" />
                                            </BaseButton>
                                        </template>

                                        <!-- Instruction groups (only when unpaid) -->
                                        <template
                                            v-if="!isPaid(participant.payment_status) && participant.transaction.status !== 'paid' && parseInstructionGroups(participant.transaction.instructions).length">
                                            <div class="pt-2 space-y-3">
                                                <div class="text-[10px] font-black text-slate-400 tracking-widest">{{ t('my_registration.payment_instructions') }}</div>
                                                <!-- Tab selector -->
                                                <div v-if="parseInstructionGroups(participant.transaction.instructions).length > 1"
                                                    class="flex gap-2 flex-wrap">
                                                    <button
                                                        v-for="(group, gi) in parseInstructionGroups(participant.transaction.instructions)"
                                                        :key="group.title" @click="activeInstructionGroup = gi"
                                                        :class="activeInstructionGroup === gi
                                                            ? 'bg-navy text-white border-navy'
                                                            : 'bg-white dark:bg-slate-700 text-slate-500 border-slate-200 hover:border-primary/40'"
                                                        class="px-2.5 py-1 rounded-lg border text-[9px] font-black tracking-widest transition-colors">
                                                        {{ group.title }}
                                                    </button>
                                                </div>
                                                <div v-for="(group, gi) in parseInstructionGroups(participant.transaction.instructions)"
                                                    :key="group.title"
                                                    v-show="parseInstructionGroups(participant.transaction.instructions).length === 1 || activeInstructionGroup === gi"
                                                    class="space-y-2">
                                                    <div v-if="parseInstructionGroups(participant.transaction.instructions).length === 1"
                                                        class="text-[9px] font-black text-slate-400 tracking-widest">{{
                                                        group.title }}</div>
                                                    <div v-for="(step, si) in group.steps" :key="si"
                                                        class="flex gap-2.5">
                                                        <span
                                                            class="size-4 mt-0.5 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center shrink-0 text-[9px]">{{
                                                            si + 1 }}</span>
                                                        <span v-html="step"
                                                            class=" text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>

                                <div v-else-if="participant.payment_status !== 'lunas' && participant.payment_status !== 'paid'"
                                    class="bg-slate-50 dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4 shadow-sm">
                                    <div class="text-[10px] text-slate-500 font-bold text-center tracking-widest">
                                        {{ t('my_registration.proceed_to_payment') }}
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <BaseButton variant="primary" block @click="initiatePaymentGateway"
                                            :loading="isProcessingPayment"
                                            class="h-12 font-black tracking-widest text-xs shadow-sm">
                                            <Icon icon="ph:lightning-bold" class="text-lg mr-2" />
                                            {{ t('my_registration.pay_online_auto') }}
                                        </BaseButton>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <div v-else
            class="py-20 sm:py-24 text-center bg-white dark:bg-slate-800 rounded-3xl sm:rounded-[48px] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 p-6">
            <div
                class="size-20 sm:size-24 bg-slate-50 dark:bg-slate-900 rounded-2xl sm:rounded-[32px] flex items-center justify-center text-slate-200 mx-auto mb-6 sm:mb-8 border border-slate-100 dark:border-slate-700">
                <Icon icon="ph:user-circle-gear-light" class="text-4xl sm:text-5xl" />
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-navy dark:text-white mb-3">{{ t('my_registration.registration_not_found') }}</h3>
            <div class="text-slate-400 text-sm font-medium max-w-sm mx-auto">
                {{ t('my_registration.session_expired_desc') }}
            </div>
            <BaseButton to="/dashboard/archer/events" variant="outline"
                class="mt-8 px-8 h-12 rounded-2xl font-black tracking-widest text-xs">
                {{ t('my_registration.back_to_dashboard') }}
            </BaseButton>
        </div>

        <!-- Cancel Confirmation Dialog -->
        <AppDialog v-model:show="showCancelConfirm" :title="t('my_registration.cancel_dialog_title')"
            :message="t('my_registration.cancel_dialog_desc')" type="danger" icon="ph:warning-circle-bold"
            :confirm-text="t('my_registration.cancel_dialog_confirm')"
            :cancel-text="t('my_registration.cancel_dialog_back')" @confirm="cancelRegistration" />

        <!-- Image Preview Dialog -->
        <AppDialog v-model:show="showImageDialog" title="Payment Proof" message="" type="info" icon="ph:image-bold">
            <div class="flex justify-center p-2">
                <img :src="selectedImage" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md" />
            </div>
        </AppDialog>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
import { useI18n } from 'vue-i18n'

import { useToast } from '~/composables/useToast'
import { getImageUrl, useImageOrDefault } from '~/composables/useImageHelper'

const { t } = useI18n()
const toast = useToast()
const { get, post, upload, delete: del } = useApi()
const apiBaseUrl = useApiBaseUrl()
const route = useRoute()
const eventId = route.params.id

definePageMeta({
    layout: 'dashboard'
})

useHead({ title: computed(() => t('registration.my_registration', 'My Registration') + ' - ArcheryHub Dashboard') })


const isLoading = ref(true)
const participant = ref(null)
const showImageDialog = ref(false)
const selectedImage = ref('')

const paymentProofs = computed(() => [])

const isProcessingPayment = ref(false)
const showCancelConfirm = ref(false)
const isCancelling = ref(false)
const activeInstructionGroup = ref(0)

const uploadingProof = ref(false)
const uploadError = ref('')
const proofFileUrl = ref('')
const senderName = ref('')
const proofInput = ref(null)

const triggerFileInput = () => {
    proofInput.value?.click()
}

const handleProofUpload = async (evt) => {
    const file = evt.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
        uploadError.value = 'File too large. Maximum size is 10MB.'
        return
    }

    uploadingProof.value = true
    uploadError.value = ''
    try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('caption', `proof-manual-${participant.value?.id || 'reg'}-${Date.now()}`)

        const res = await upload('/media/upload', formData)
        proofFileUrl.value = res.url || res.URL || ''
    } catch (err) {
        uploadError.value = err.response?.data?.error || err.data?.error || err.message || 'Failed to upload image.'
    } finally {
        uploadingProof.value = false
    }
}

const submitManualProof = async () => {
    if (!proofFileUrl.value) {
        uploadError.value = 'Please upload a payment proof image first.'
        return
    }
    uploadingProof.value = true
    uploadError.value = ''
    try {
        const txRef = participant.value?.transaction?.reference
        await post(`/payment/manual/${txRef}/upload-proof`, {
            proof_url: proofFileUrl.value,
            sender_name: senderName.value
        })
        toast.success('Payment proof uploaded successfully')
        await fetchInitialData()
    } catch (err) {
        uploadError.value = err.response?.data?.error || err.data?.error || err.message || 'Failed to submit proof.'
    } finally {
        uploadingProof.value = false
    }
}

// Parses Mayar/VA instructions JSON into [{title, steps[]}] groups.
const parseInstructionGroups = (raw) => {
    if (!raw) return []
    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
            return parsed
                .map(group => ({
                    title: group.title || '',
                    steps: Array.isArray(group.steps) ? group.steps : []
                }))
                .filter(g => g.steps.length > 0)
        }
    } catch {
        // Not JSON
    }
    return []
}

const handleTransactionPayment = async (transaction) => {
    if (!transaction) return
    if (transaction.checkout_url) {
        window.location.href = transaction.checkout_url
    } else if (transaction.reference) {
        navigateTo(`/payment/status/${transaction.reference}`)
    }
}

const cancelRegistration = async () => {
    isCancelling.value = true
    try {
        await del(`/events/${eventId}/participants/me`)
        showCancelConfirm.value = false
        toast.success(t('my_registration.toast_cancel_success'))
        navigateTo('/dashboard/archer/events')
    } catch (e) {
        console.error('Failed to cancel registration:', e)
        toast.error(t('my_registration.toast_cancel_failed'))
    } finally {
        isCancelling.value = false
    }
}

const initiatePaymentGateway = async () => {
    isProcessingPayment.value = true
    try {
        const response = await post(`/events/${eventId}/participants/me/checkout`)
        if (response?.checkout_url || response?.tripay_reference) {
            await handleTransactionPayment(response)
            await fetchInitialData()
        }
    } catch (e) {
        console.error('Failed to initiate checkout:', e)
        toast.error(t('my_registration.toast_payment_failed'))
    } finally {
        isProcessingPayment.value = false
    }
}


const isPaid = (status) => {
    const s = (status || '').toLowerCase()
    return ['paid', 'lunas', 'registered', 'terdaftar', 'success', 'completed'].includes(s)
}

const getStatusClass = (status, onNavy = false) => {
    const s = (status || '').toLowerCase()
    if (isPaid(s)) {
        return onNavy ? 'bg-primary text-navy border-primary' : 'bg-green-50 text-green-600 border-green-200'
    }
    return onNavy ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200'
}

const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (isPaid(s)) return t('my_registration.paid')
    return t('my_registration.pending')
}

const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID').format(val)
}

const openImage = (url) => {
    selectedImage.value = url
    showImageDialog.value = true
}

const fetchInitialData = async () => {
    isLoading.value = true
    try {
        const detailed = await get(`/events/${eventId}/participants/me`)
        participant.value = detailed
        if (detailed?.transaction) {
            if (detailed.transaction.sender_name) {
                senderName.value = detailed.transaction.sender_name
            }
            if (detailed.transaction.proof_url) {
                proofFileUrl.value = detailed.transaction.proof_url
            }
        }
    } catch (e) {
        console.error('Failed to fetch registration data:', e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchInitialData()
})
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
