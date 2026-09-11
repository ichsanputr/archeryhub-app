<template>
  <div class="flex flex-col gap-6 pb-16">
    <!-- Header -->
    <DashboardHeader
      :title="t('archer_payment_detail.header_title')"
      :subtitle="`${t('archer_payment_detail.ref_prefix')} ${reference}`"
      icon="ph:credit-card-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: 'Payments', to: '/dashboard/archer/payments' },
        { label: `Detail #${reference}` }
      ]"
    />

    <!-- Loading -->
    <div v-if="isLoading" class="h-80 bg-white dark:bg-slate-800 rounded-3xl animate-pulse border border-slate-100 dark:border-slate-700" />

    <!-- Error / Not found -->
    <div v-else-if="!payment"
      class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-12 text-center">
      <Icon icon="ph:warning-circle-bold" class="text-4xl text-red-500 mb-3 mx-auto" />
      <div class="font-black text-navy dark:text-white text-lg">{{ t("archer_payment_detail.not_found_title") }}</div>
      <div class="text-slate-500 text-sm mt-1 mb-6">{{ t("archer_payment_detail.not_found_desc", { ref: reference }) }}</div>
      <BaseButton to="/dashboard/archer/payments" variant="navy">{{ t("archer_payment_detail.back_to_history") }}</BaseButton>
    </div>

    <!-- Payment Detail Card -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Detail -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
          <!-- Status Banner -->
          <div class="flex items-center justify-between p-4 rounded-2xl" :class="getStatusBgClass(payment.status)">
            <div class="flex items-center gap-3">
              <Icon :icon="getStatusIcon(payment.status)" class="text-2xl" :class="getStatusIconClass(payment.status)" />
              <div>
                <div class="text-xs font-bold capitalize tracking-wider text-slate-500">{{ t("archer_payment_detail.transaction_status") }}</div>
                <div class="font-black text-navy dark:text-white text-lg capitalize">{{ getStatusText(payment.status) }}</div>
              </div>
            </div>
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-black capitalize tracking-wider border shadow-2xs" :class="getStatusBadgeClass(payment.status)">
              {{ payment.status }}
            </span>
          </div>

          <!-- Transaction Info -->
          <div class="space-y-4">
            <h3 class="font-black text-navy dark:text-white text-base">{{ t("archer_payment_detail.order_info") }}</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                <div class="text-slate-500 text-xs font-bold mb-1">{{ t("archer_payment_detail.item_event_name") }}</div>
                <div class="font-black text-navy dark:text-white">{{ payment.event_name || payment.plan_name || payment.description || 'Pembayaran' }}</div>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                <div class="text-slate-500 text-xs font-bold mb-1">{{ t("archer_payment_detail.payment_method") }}</div>
                <div class="font-black text-navy dark:text-white capitalize">{{ payment.payment_method || 'Payment Gateway' }}</div>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                <div class="text-slate-500 text-xs font-bold mb-1">{{ t("archer_payment_detail.total_bill") }}</div>
                <div class="font-black text-primary text-xl">Rp {{ (payment.amount || payment.total_amount || 0).toLocaleString('id-ID') }}</div>
              </div>
              <div class="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-2xl">
                <div class="text-slate-500 text-xs font-bold mb-1">{{ t("archer_payment_detail.transaction_date") }}</div>
                <div class="font-bold text-navy dark:text-white">{{ formatDate(payment.created_at) }}</div>
              </div>
            </div>
          </div>

          <!-- Payment Instructions for Pending VA/QRIS -->
          <div v-if="payment.status === 'pending' || payment.status === 'UNPAID'" class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-2xl p-5 space-y-4">
            <div class="flex items-center gap-2 font-black text-blue-900 dark:text-blue-200 text-sm">
              <Icon icon="ph:info-bold" class="text-lg text-primary" />
              <span>{{ t("archer_payment_detail.payment_instructions") }}</span>
    
          <!-- Manual Payment Proof Card -->
          <div v-if="payment.proof_url || payment.payment_method === 'manual'" class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="font-black text-navy dark:text-white text-base flex items-center gap-2">
                <Icon icon="ph:image-bold" class="text-primary text-lg" />
                <span>{{ t('archer_payments_list.proof_of_payment', 'Bukti Pembayaran Transfer') }}</span>
              </h3>
              <span v-if="payment.proof_url" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Icon icon="ph:check-circle-bold" />
                <span>{{ t('archer_payments_list.proof_uploaded', 'Bukti Terunggah') }}</span>
              </span>
            </div>

            <div v-if="payment.proof_url" class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div class="relative group cursor-pointer shrink-0" @click="openImageModal(payment.proof_url)">
                <img :src="payment.proof_url" alt="Bukti Transfer" class="h-24 w-36 object-cover rounded-xl border border-slate-200 dark:border-slate-600 shadow-xs" />
                <div class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Icon icon="ph:magnifying-glass-plus-bold" />
                  <span>Zoom</span>
                </div>
              </div>
              <div class="flex-1 min-w-0 space-y-1.5 text-xs">
                <div v-if="payment.sender_name" class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.sender_name', 'Nama Pengirim:') }}</span>
                  <span class="font-bold text-navy dark:text-white text-sm">{{ payment.sender_name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.transfer_nominal', 'Nominal Tertera:') }}</span>
                  <span class="font-mono font-bold text-navy dark:text-white">Rp {{ (payment.amount || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="text-xs text-slate-400">
                  {{ t('archer_payments_list.verification_note', 'Bukti pembayaran sedang dalam proses verifikasi panitia penyelenggara.') }}
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                <div class="font-bold">{{ t('archer_payments_list.upload_proof_prompt', 'Silakan unggah bukti transfer manual Anda') }}</div>
                <div class="text-[11px] text-amber-700/80 dark:text-amber-400">{{ t('archer_payments_list.upload_proof_desc', 'Pesanan belum dapat dikonfirmasi sebelum bukti transfer dikirimkan ke panitia.') }}</div>
              </div>
              <BaseButton size="sm" variant="primary" icon="ph:upload-simple-bold" :to="`/payment/status/${reference}`">
                {{ t('archer_payments_list.upload_now', 'Unggah Bukti Sekarang') }}
              </BaseButton>
            </div>
          </div>
        </div>
            
            <div v-if="payment.pay_code || payment.va_number" class="bg-white dark:bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-blue-100 dark:border-blue-900">
              <div>
                <div class="text-xs text-slate-500 font-bold">{{ t("archer_payment_detail.va_pay_code") }}</div>
                <div class="font-mono font-black text-xl text-navy dark:text-white tracking-wider">{{ payment.pay_code || payment.va_number }}</div>
      
          <!-- Manual Payment Proof Card -->
          <div v-if="payment.proof_url || payment.payment_method === 'manual'" class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="font-black text-navy dark:text-white text-base flex items-center gap-2">
                <Icon icon="ph:image-bold" class="text-primary text-lg" />
                <span>{{ t('archer_payments_list.proof_of_payment', 'Bukti Pembayaran Transfer') }}</span>
              </h3>
              <span v-if="payment.proof_url" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Icon icon="ph:check-circle-bold" />
                <span>{{ t('archer_payments_list.proof_uploaded', 'Bukti Terunggah') }}</span>
              </span>
            </div>

            <div v-if="payment.proof_url" class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div class="relative group cursor-pointer shrink-0" @click="openImageModal(payment.proof_url)">
                <img :src="payment.proof_url" alt="Bukti Transfer" class="h-24 w-36 object-cover rounded-xl border border-slate-200 dark:border-slate-600 shadow-xs" />
                <div class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Icon icon="ph:magnifying-glass-plus-bold" />
                  <span>Zoom</span>
                </div>
              </div>
              <div class="flex-1 min-w-0 space-y-1.5 text-xs">
                <div v-if="payment.sender_name" class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.sender_name', 'Nama Pengirim:') }}</span>
                  <span class="font-bold text-navy dark:text-white text-sm">{{ payment.sender_name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.transfer_nominal', 'Nominal Tertera:') }}</span>
                  <span class="font-mono font-bold text-navy dark:text-white">Rp {{ (payment.amount || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="text-xs text-slate-400">
                  {{ t('archer_payments_list.verification_note', 'Bukti pembayaran sedang dalam proses verifikasi panitia penyelenggara.') }}
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                <div class="font-bold">{{ t('archer_payments_list.upload_proof_prompt', 'Silakan unggah bukti transfer manual Anda') }}</div>
                <div class="text-[11px] text-amber-700/80 dark:text-amber-400">{{ t('archer_payments_list.upload_proof_desc', 'Pesanan belum dapat dikonfirmasi sebelum bukti transfer dikirimkan ke panitia.') }}</div>
              </div>
              <BaseButton size="sm" variant="primary" icon="ph:upload-simple-bold" :to="`/payment/status/${reference}`">
                {{ t('archer_payments_list.upload_now', 'Unggah Bukti Sekarang') }}
              </BaseButton>
            </div>
          </div>
        </div>
              <BaseButton variant="white" size="xs" @click="copyText(payment.pay_code || payment.va_number)">
                <Icon icon="ph:copy-bold" class="mr-1" /> {{ t("archer_payment_detail.copy") }}
              </BaseButton>
    
          <!-- Manual Payment Proof Card -->
          <div v-if="payment.proof_url || payment.payment_method === 'manual'" class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="font-black text-navy dark:text-white text-base flex items-center gap-2">
                <Icon icon="ph:image-bold" class="text-primary text-lg" />
                <span>{{ t('archer_payments_list.proof_of_payment', 'Bukti Pembayaran Transfer') }}</span>
              </h3>
              <span v-if="payment.proof_url" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Icon icon="ph:check-circle-bold" />
                <span>{{ t('archer_payments_list.proof_uploaded', 'Bukti Terunggah') }}</span>
              </span>
            </div>

            <div v-if="payment.proof_url" class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div class="relative group cursor-pointer shrink-0" @click="openImageModal(payment.proof_url)">
                <img :src="payment.proof_url" alt="Bukti Transfer" class="h-24 w-36 object-cover rounded-xl border border-slate-200 dark:border-slate-600 shadow-xs" />
                <div class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Icon icon="ph:magnifying-glass-plus-bold" />
                  <span>Zoom</span>
                </div>
              </div>
              <div class="flex-1 min-w-0 space-y-1.5 text-xs">
                <div v-if="payment.sender_name" class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.sender_name', 'Nama Pengirim:') }}</span>
                  <span class="font-bold text-navy dark:text-white text-sm">{{ payment.sender_name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.transfer_nominal', 'Nominal Tertera:') }}</span>
                  <span class="font-mono font-bold text-navy dark:text-white">Rp {{ (payment.amount || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="text-xs text-slate-400">
                  {{ t('archer_payments_list.verification_note', 'Bukti pembayaran sedang dalam proses verifikasi panitia penyelenggara.') }}
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                <div class="font-bold">{{ t('archer_payments_list.upload_proof_prompt', 'Silakan unggah bukti transfer manual Anda') }}</div>
                <div class="text-[11px] text-amber-700/80 dark:text-amber-400">{{ t('archer_payments_list.upload_proof_desc', 'Pesanan belum dapat dikonfirmasi sebelum bukti transfer dikirimkan ke panitia.') }}</div>
              </div>
              <BaseButton size="sm" variant="primary" icon="ph:upload-simple-bold" :to="`/payment/status/${reference}`">
                {{ t('archer_payments_list.upload_now', 'Unggah Bukti Sekarang') }}
              </BaseButton>
            </div>
          </div>
        </div>

            <div v-if="payment.checkout_url" class="pt-2">
              <a :href="payment.checkout_url" target="_blank" class="inline-flex items-center justify-center w-full py-3 bg-primary text-navy font-black rounded-xl hover:bg-yellow-400 transition-colors text-sm shadow-sm">
                <Icon icon="ph:credit-card-bold" class="mr-2" /> {{ t("archer_payment_detail.pay_now") }}
              </a>
    
          <!-- Manual Payment Proof Card -->
          <div v-if="payment.proof_url || payment.payment_method === 'manual'" class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="font-black text-navy dark:text-white text-base flex items-center gap-2">
                <Icon icon="ph:image-bold" class="text-primary text-lg" />
                <span>{{ t('archer_payments_list.proof_of_payment', 'Bukti Pembayaran Transfer') }}</span>
              </h3>
              <span v-if="payment.proof_url" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Icon icon="ph:check-circle-bold" />
                <span>{{ t('archer_payments_list.proof_uploaded', 'Bukti Terunggah') }}</span>
              </span>
            </div>

            <div v-if="payment.proof_url" class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div class="relative group cursor-pointer shrink-0" @click="openImageModal(payment.proof_url)">
                <img :src="payment.proof_url" alt="Bukti Transfer" class="h-24 w-36 object-cover rounded-xl border border-slate-200 dark:border-slate-600 shadow-xs" />
                <div class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Icon icon="ph:magnifying-glass-plus-bold" />
                  <span>Zoom</span>
                </div>
              </div>
              <div class="flex-1 min-w-0 space-y-1.5 text-xs">
                <div v-if="payment.sender_name" class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.sender_name', 'Nama Pengirim:') }}</span>
                  <span class="font-bold text-navy dark:text-white text-sm">{{ payment.sender_name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.transfer_nominal', 'Nominal Tertera:') }}</span>
                  <span class="font-mono font-bold text-navy dark:text-white">Rp {{ (payment.amount || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="text-xs text-slate-400">
                  {{ t('archer_payments_list.verification_note', 'Bukti pembayaran sedang dalam proses verifikasi panitia penyelenggara.') }}
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                <div class="font-bold">{{ t('archer_payments_list.upload_proof_prompt', 'Silakan unggah bukti transfer manual Anda') }}</div>
                <div class="text-[11px] text-amber-700/80 dark:text-amber-400">{{ t('archer_payments_list.upload_proof_desc', 'Pesanan belum dapat dikonfirmasi sebelum bukti transfer dikirimkan ke panitia.') }}</div>
              </div>
              <BaseButton size="sm" variant="primary" icon="ph:upload-simple-bold" :to="`/payment/status/${reference}`">
                {{ t('archer_payments_list.upload_now', 'Unggah Bukti Sekarang') }}
              </BaseButton>
            </div>
          </div>
        </div>
  
          <!-- Manual Payment Proof Card -->
          <div v-if="payment.proof_url || payment.payment_method === 'manual'" class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="font-black text-navy dark:text-white text-base flex items-center gap-2">
                <Icon icon="ph:image-bold" class="text-primary text-lg" />
                <span>{{ t('archer_payments_list.proof_of_payment', 'Bukti Pembayaran Transfer') }}</span>
              </h3>
              <span v-if="payment.proof_url" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Icon icon="ph:check-circle-bold" />
                <span>{{ t('archer_payments_list.proof_uploaded', 'Bukti Terunggah') }}</span>
              </span>
            </div>

            <div v-if="payment.proof_url" class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div class="relative group cursor-pointer shrink-0" @click="openImageModal(payment.proof_url)">
                <img :src="payment.proof_url" alt="Bukti Transfer" class="h-24 w-36 object-cover rounded-xl border border-slate-200 dark:border-slate-600 shadow-xs" />
                <div class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Icon icon="ph:magnifying-glass-plus-bold" />
                  <span>Zoom</span>
                </div>
              </div>
              <div class="flex-1 min-w-0 space-y-1.5 text-xs">
                <div v-if="payment.sender_name" class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.sender_name', 'Nama Pengirim:') }}</span>
                  <span class="font-bold text-navy dark:text-white text-sm">{{ payment.sender_name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.transfer_nominal', 'Nominal Tertera:') }}</span>
                  <span class="font-mono font-bold text-navy dark:text-white">Rp {{ (payment.amount || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="text-xs text-slate-400">
                  {{ t('archer_payments_list.verification_note', 'Bukti pembayaran sedang dalam proses verifikasi panitia penyelenggara.') }}
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                <div class="font-bold">{{ t('archer_payments_list.upload_proof_prompt', 'Silakan unggah bukti transfer manual Anda') }}</div>
                <div class="text-[11px] text-amber-700/80 dark:text-amber-400">{{ t('archer_payments_list.upload_proof_desc', 'Pesanan belum dapat dikonfirmasi sebelum bukti transfer dikirimkan ke panitia.') }}</div>
              </div>
              <BaseButton size="sm" variant="primary" icon="ph:upload-simple-bold" :to="`/payment/status/${reference}`">
                {{ t('archer_payments_list.upload_now', 'Unggah Bukti Sekarang') }}
              </BaseButton>
            </div>
          </div>
        </div>

          <!-- Manual Payment Proof Card -->
          <div v-if="payment.proof_url || payment.payment_method === 'manual'" class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <h3 class="font-black text-navy dark:text-white text-base flex items-center gap-2">
                <Icon icon="ph:image-bold" class="text-primary text-lg" />
                <span>{{ t('archer_payments_list.proof_of_payment', 'Bukti Pembayaran Transfer') }}</span>
              </h3>
              <span v-if="payment.proof_url" class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <Icon icon="ph:check-circle-bold" />
                <span>{{ t('archer_payments_list.proof_uploaded', 'Bukti Terunggah') }}</span>
              </span>
            </div>

            <div v-if="payment.proof_url" class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-2xl border border-slate-100 dark:border-slate-700">
              <div class="relative group cursor-pointer shrink-0" @click="openImageModal(payment.proof_url)">
                <img :src="payment.proof_url" alt="Bukti Transfer" class="h-24 w-36 object-cover rounded-xl border border-slate-200 dark:border-slate-600 shadow-xs" />
                <div class="absolute inset-0 bg-navy/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-white text-xs font-bold gap-1">
                  <Icon icon="ph:magnifying-glass-plus-bold" />
                  <span>Zoom</span>
                </div>
              </div>
              <div class="flex-1 min-w-0 space-y-1.5 text-xs">
                <div v-if="payment.sender_name" class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.sender_name', 'Nama Pengirim:') }}</span>
                  <span class="font-bold text-navy dark:text-white text-sm">{{ payment.sender_name }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-slate-400 font-medium">{{ t('archer_payments_list.transfer_nominal', 'Nominal Tertera:') }}</span>
                  <span class="font-mono font-bold text-navy dark:text-white">Rp {{ (payment.amount || 0).toLocaleString('id-ID') }}</span>
                </div>
                <div class="text-xs text-slate-400">
                  {{ t('archer_payments_list.verification_note', 'Bukti pembayaran sedang dalam proses verifikasi panitia penyelenggara.') }}
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="text-xs text-amber-800 dark:text-amber-300 space-y-0.5">
                <div class="font-bold">{{ t('archer_payments_list.upload_proof_prompt', 'Silakan unggah bukti transfer manual Anda') }}</div>
                <div class="text-[11px] text-amber-700/80 dark:text-amber-400">{{ t('archer_payments_list.upload_proof_desc', 'Pesanan belum dapat dikonfirmasi sebelum bukti transfer dikirimkan ke panitia.') }}</div>
              </div>
              <BaseButton size="sm" variant="primary" icon="ph:upload-simple-bold" :to="`/payment/status/${reference}`">
                {{ t('archer_payments_list.upload_now', 'Unggah Bukti Sekarang') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Actions -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 p-6 shadow-sm space-y-4">
          <h4 class="font-black text-navy dark:text-white text-sm">{{ t("archer_payment_detail.transaction_actions") }}</h4>
          
          <BaseButton :to="`/payment/status/${reference}`" variant="navy" size="md" class="w-full justify-center font-bold">
            <Icon icon="ph:arrow-square-out-bold" class="mr-2" /> {{ t("archer_payment_detail.public_status_page") }}
          </BaseButton>

          <BaseButton v-if="payment.status === 'paid' || payment.status === 'PAID'" 
            :to="`/api/v1/payment/invoice/${reference}`" target="_blank" variant="white" size="md" class="w-full justify-center font-bold">
            <Icon icon="ph:download-simple-bold" class="mr-2" /> {{ t("archer_payment_detail.download_invoice") }}
          </BaseButton>

          <BaseButton to="/dashboard/archer/payments" variant="white" size="md" class="w-full justify-center">
            {{ t("archer_payment_detail.back_to_list") }}
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Simple Image Preview Lightbox Modal -->
    <ClientOnly>
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-150 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0">
          <div v-if="showImageModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none">
            <!-- Dark Backdrop -->
            <div @click="showImageModal = false" class="absolute inset-0 bg-slate-900/80 backdrop-blur-xs transition-opacity"></div>

            <!-- Simple Lightbox Card -->
            <div class="relative z-10 bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden space-y-3 p-4 sm:p-5">
              <!-- Top Header Bar -->
              <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Icon icon="ph:receipt-bold" class="text-slate-500 text-base" />
                  <span>Bukti Transfer</span>
                </div>
                <button type="button" @click="showImageModal = false"
                  class="size-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer">
                  <Icon icon="ph:x-bold" class="text-xs" />
                </button>
              </div>

              <!-- Image Display -->
              <div class="flex items-center justify-center bg-slate-50 rounded-xl p-2 border border-slate-100 overflow-hidden">
                <img :src="selectedImage" alt="Bukti Transfer" class="max-h-[65vh] w-auto object-contain rounded-lg shadow-2xs" />
              </div>

              <!-- Footer with direct open -->
              <div class="flex items-center justify-between pt-1 text-xs">
                <a :href="selectedImage" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold transition-colors">
                  <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
                  <span>Buka Ukuran Penuh</span>
                </a>
                <button type="button" @click="showImageModal = false"
                  class="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer">
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()

const reference = computed(() => route.params.reference as string)

useHead({
  title: computed(() => (t ? t('payment_detail.page_title', 'Detail Pembayaran') : 'Detail Pembayaran') + ` #${reference.value} - Archeris Dashboard`)
})
const isLoading = ref(true)
const showImageModal = ref(false)
const selectedImage = ref('')

const openImageModal = (url: string) => {
  selectedImage.value = url
  showImageModal.value = true
}
const payment = ref<any>(null)

async function fetchDetail() {
  isLoading.value = true
  try {
    const res = await get(`/mobile/archer/payments/${reference.value}`)
    payment.value = res?.payment || res?.data || res
  } catch {
    try {
      const res = await get(`/payment/status/${reference.value}`)
      payment.value = res?.payment || res?.data || res
    } catch {
      payment.value = null
    }
  } finally {
    isLoading.value = false
  }
}

function getStatusText(status: string) {
  if (!status) return 'Menunggu'
  const map: any = { paid: 'Lunas / Berhasil', PAID: 'Lunas / Berhasil', pending: 'Menunggu Pembayaran', UNPAID: 'Menunggu Pembayaran', expired: 'Kedaluwarsa', EXPIRED: 'Kedaluwarsa' }
  return map[status] || status
}

function getStatusBadgeClass(status: string) {
  if (status === 'paid' || status === 'PAID') return 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
  if (status === 'pending' || status === 'UNPAID') return 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-500/30'
  return 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/30'
}

function getStatusBgClass(status: string) {
  if (status === 'paid' || status === 'PAID') return 'bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20'
  if (status === 'pending' || status === 'UNPAID') return 'bg-amber-500/5 dark:bg-amber-950/20 border border-amber-500/20'
  return 'bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20'
}

function getStatusIcon(status: string) {
  if (status === 'paid' || status === 'PAID') return 'ph:check-circle-bold'
  if (status === 'pending' || status === 'UNPAID') return 'ph:clock-bold'
  return 'ph:x-circle-bold'
}

function getStatusIconClass(status: string) {
  if (status === 'paid' || status === 'PAID') return 'text-emerald-600'
  if (status === 'pending' || status === 'UNPAID') return 'text-amber-600'
  return 'text-red-600'
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function copyText(text: string) {
  if (text) {
    navigator.clipboard.writeText(text)
  }
}

onMounted(fetchDetail)

definePageMeta({ layout: 'dashboard' })
</script>