<template>
  <div class="space-y-6 sm:space-y-8 pb-16">
    
    <!-- ── 1. Standard Dashboard Header (Hidden on Print) ── -->
    <DashboardHeader
      class="print:hidden"
      :title="t('package_detail.page_title', 'Detail Invoice Pembayaran')"
      :subtitle="t('package_detail.page_subtitle', 'Informasi Status Tagihan, Rincian Kuota, Dan Kuitansi Pembayaran')"
      icon="ph:receipt-bold"
      :breadcrumbs="[
        { label: t('package_detail.breadcrumb_package', 'Paket & Kuota'), to: '/dashboard/organizer/package' },
        { label: t('package_detail.breadcrumb_invoice', 'Detail Invoice') }
      ]"
    >
      <template #actions>
        <button
          type="button"
          @click="printInvoice"
          class="h-11 px-5 rounded-xl bg-primary hover:bg-primary-hover text-navy text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 w-full sm:w-auto">
          <Icon icon="ph:printer-bold" class="text-base" />
          <span>{{ t('package_detail.btn_print', 'Cetak Invoice') }}</span>
        </button>

        <a
          v-if="isPaid"
          :href="getInvoicePdfUrl(tx.reference || reference)"
          target="_blank"
          class="h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 w-full sm:w-auto">
          <Icon icon="ph:file-pdf-bold" class="text-base text-red-400" />
          <span>{{ t('package_detail.btn_download_pdf', 'Unduh PDF') }}</span>
        </a>
      </template>
    </DashboardHeader>

    <!-- ── 2. Loading State ── -->
    <div v-if="isLoading" class="bg-white rounded-3xl border border-gray-100 p-12 sm:p-16 text-center shadow-sm print:hidden">
      <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-3 mx-auto" />
      <div class="text-slate-600 font-bold text-sm">{{ t('package_detail.loading', 'Memuat Rincian Transaksi...') }}</div>
    </div>

    <!-- ── 3. Error State ── -->
    <div v-else-if="errorMsg" class="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 text-center shadow-sm space-y-4 print:hidden">
      <div class="size-16 bg-navy/5 text-navy rounded-2xl flex items-center justify-center mx-auto border border-navy/10">
        <Icon icon="ph:warning-circle-bold" class="text-3xl text-amber-500" />
      </div>
      <h2 class="text-lg font-black text-navy">{{ t('package_detail.not_found_title', 'Transaksi Tidak Ditemukan') }}</h2>
      <div class="text-slate-500 text-xs font-medium max-w-md mx-auto">{{ errorMsg }}</div>
    </div>

    <!-- ── 4. Main Dashboard Card (Interactive View) ── -->
    <div v-else class="space-y-6 sm:space-y-8 print:hidden">
      
      <!-- Top Summary Metrics Grid (Theme-aligned Monochromatic Navy & Primary) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <!-- Metric 1: Nomor Invoice -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black text-slate-400 capitalize tracking-wider">{{ t('package_detail.invoice_number', 'Nomor Invoice') }}</span>
            <div class="size-10 rounded-2xl bg-navy/5 text-navy border border-navy/10 flex items-center justify-center shrink-0">
              <Icon icon="ph:receipt-bold" class="text-lg" />
            </div>
          </div>
          <div>
            <div class="font-mono text-xs sm:text-sm font-black text-navy truncate select-all">{{ tx.reference || reference }}</div>
            <div class="text-[11px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5 truncate">
              <Icon icon="ph:calendar-blank-bold" class="text-xs text-slate-400 shrink-0" />
              <span>{{ formatDate(tx.purchased_at || tx.created_at) }}</span>
            </div>
          </div>
        </div>

        <!-- Metric 2: Status Pembayaran -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black text-slate-400 capitalize tracking-wider">{{ t('package_detail.status_label', 'Status Pembayaran') }}</span>
            <div class="size-10 rounded-2xl bg-navy/5 text-navy border border-navy/10 flex items-center justify-center shrink-0">
              <Icon :icon="statusIcon" class="text-lg" />
            </div>
          </div>
          <div>
            <span :class="statusBadgeClasses" class="px-3 py-1 rounded-xl text-xs font-black capitalize inline-flex items-center gap-1.5 border shadow-2xs">
              <span :class="isPaid ? 'bg-emerald-500' : 'bg-amber-500'" class="size-1.5 rounded-full animate-pulse"></span>
              <span>{{ formatStatus(tx.status || tx.payment_status) }}</span>
            </span>
            <div class="text-[11px] text-slate-400 font-semibold mt-1.5 truncate">
              {{ isPaid ? t('package_detail.verified_instant', 'Terverifikasi Instan') : (tx.expiry_date ? t('package_detail.expires_in', 'Batas Waktu') + ': ' + formatExpiry(tx.expiry_date) : t('package_detail.waiting_transfer', 'Menunggu Transfer')) }}
            </div>
          </div>
        </div>

        <!-- Metric 3: Metode Pembayaran -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black text-slate-400 capitalize tracking-wider">{{ t('package_detail.method_label', 'Metode Pembayaran') }}</span>
            <div class="size-10 rounded-2xl bg-navy/5 text-navy border border-navy/10 flex items-center justify-center shrink-0">
              <Icon :icon="tx.payment_method === 'QRIS' ? 'ph:qr-code-bold' : 'ph:bank-bold'" class="text-lg" />
            </div>
          </div>
          <div>
            <div class="text-xs sm:text-sm font-black text-navy truncate">{{ formatPaymentMethodName(tx.payment_method) }}</div>
            <div class="text-[11px] text-slate-400 font-semibold mt-1 flex items-center gap-1.5 truncate">
              <Icon icon="ph:shield-check-bold" class="text-xs text-primary shrink-0" />
              <span>Mayar Payment Gateway</span>
            </div>
          </div>
        </div>

        <!-- Metric 4: Total Tagihan -->
        <div class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-[11px] font-black text-slate-400 capitalize tracking-wider">{{ t('package_detail.total_paid', 'Total Tagihan') }}</span>
            <div class="size-10 rounded-2xl bg-primary/15 text-navy border border-primary/30 flex items-center justify-center shrink-0">
              <Icon icon="ph:wallet-bold" class="text-lg" />
            </div>
          </div>
          <div>
            <div class="text-lg sm:text-xl font-black text-navy tabular-nums">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</div>
            <div class="text-[11px] text-slate-400 font-semibold mt-1 truncate">
              {{ tx.quantity || 1 }} {{ t('package_detail.event_unit', 'Event') }} {{ tx.plan_name || 'Kuota' }}
            </div>
          </div>
        </div>

      </div>

      <!-- Main Content Card -->
      <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-8 space-y-6">
        
        <!-- Pending Payment Action Box -->
        <div v-if="isPending" class="bg-navy/[0.02] border border-navy/10 rounded-2xl p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between flex-wrap gap-2">
            <div class="flex items-center gap-2">
              <Icon icon="ph:clock-bold" class="text-amber-600 text-lg" />
              <span class="text-xs font-black text-navy capitalize">{{ t('package_detail.awaiting_payment', 'Menunggu Pembayaran') }}</span>
            </div>
            <div v-if="tx.expiry_date" class="text-xs text-slate-500 font-bold">
              {{ t('package_detail.pay_before', 'Bayar Sebelum:') }} {{ formatExpiry(tx.expiry_date) }}
            </div>
          </div>

          <!-- 1. QRIS Display (Shown when Payment Method is QRIS) -->
          <div v-if="isQR" class="bg-white p-5 sm:p-6 rounded-xl border border-gray-100 text-center space-y-4 shadow-2xs">
            <div>
              <div class="text-xs sm:text-sm font-black text-navy">{{ t('package_detail.scan_qris_instruction', 'Pindai QRIS Menggunakan Aplikasi Mobile Banking / E-Wallet') }}</div>
              <div class="text-[11px] text-slate-400 mt-0.5">BCA Mobile, Livin Mandiri, BRImo, BNI Mobile, GoPay, OVO, DANA, ShopeePay, LinkAja</div>
            </div>

            <div class="inline-block p-3 bg-white rounded-2xl border border-slate-200/80 shadow-xs mx-auto">
              <img :src="tx.qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEV-QRIS-${tx.reference}`"
                alt="QRIS Barcode" class="size-48 sm:size-56 object-contain rounded-lg" />
            </div>

            <div class="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                @click="downloadQRCode"
                :disabled="isDownloadingQR"
                class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer">
                <Icon :icon="isDownloadingQR ? 'ph:spinner-gap-bold' : 'ph:download-simple-bold'" :class="{ 'animate-spin': isDownloadingQR }" />
                <span>{{ isDownloadingQR ? 'Mengunduh QR Code...' : t('package_detail.download_qr', 'Unduh QR Code') }}</span>
              </button>
            </div>
          </div>

          <!-- 2. Virtual Account Display (Shown when Payment Method is VA) -->
          <div v-else-if="tx.pay_code || tx.va_number" class="bg-white p-4 sm:p-5 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div>
              <span class="text-[10px] font-bold text-slate-400 capitalize block">{{ t('package_detail.va_number_label', 'Nomor Virtual Account') }} ({{ formatPaymentMethodName(tx.payment_method) }})</span>
              <span class="font-mono text-xl sm:text-2xl font-black text-navy tracking-wider">{{ tx.pay_code || tx.va_number || '-' }}</span>
            </div>
            
            <div class="flex items-center gap-2 shrink-0">
              <button @click="copyText(tx.pay_code || tx.va_number)"
                class="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all w-full sm:w-auto">
                <Icon :icon="copied ? 'ph:check-bold' : 'ph:copy-bold'" />
                <span>{{ copied ? t('package_detail.copied', 'Tersalin') : t('package_detail.copy', 'Salin Nomor') }}</span>
              </button>
            </div>
          </div>

          <!-- 3. Mayar Direct Checkout Link -->
          <div v-if="tx.checkout_url" class="pt-1">
            <a :href="tx.checkout_url" target="_blank" rel="noopener noreferrer"
              class="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-navy rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer">
              <Icon icon="ph:arrow-square-out-bold" class="text-lg" />
              <span>Bayar Sekarang via Mayar (QRIS, VA, E-Wallet)</span>
            </a>
          </div>
        </div>

        <!-- Paid State Seal -->
        <div v-else-if="isPaid" class="bg-navy/[0.02] border border-navy/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="size-10 bg-navy text-primary rounded-xl flex items-center justify-center shadow-xs shrink-0">
              <Icon icon="ph:check-bold" class="text-xl" />
            </div>
            <div>
              <div class="text-sm font-black text-navy capitalize">{{ t('package_detail.paid_title', 'Pembayaran Lunas & Terverifikasi') }}</div>
              <div class="text-xs text-slate-500 font-medium mt-0.5">
                {{ t('package_detail.paid_desc', 'Kuota event telah berhasil ditambahkan dan siap digunakan.') }}
              </div>
            </div>
          </div>
          <div class="sm:text-right shrink-0">
            <span class="text-[10px] font-bold text-slate-400 capitalize block">{{ t('package_detail.payment_date', 'Waktu Pembayaran') }}</span>
            <span class="text-xs font-black text-navy">{{ formatDate(tx.purchased_at || tx.created_at) }}</span>
          </div>
        </div>

        <!-- Itemized Table (Responsive) -->
        <div class="space-y-3">
          <h3 class="text-xs font-black text-slate-400 capitalize tracking-wider">
            {{ t('package_detail.item_details', 'Rincian Pembelian') }}
          </h3>

          <div class="border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
            <table class="w-full text-left text-xs min-w-[480px]">
              <thead class="bg-slate-50 text-slate-500 font-black border-b border-gray-100">
                <tr>
                  <th class="py-3.5 px-4 sm:px-5">{{ t('package_detail.col_item', 'Deskripsi Layanan') }}</th>
                  <th class="py-3.5 px-4 sm:px-5 text-center">{{ t('package_detail.col_qty', 'Jumlah Kuota') }}</th>
                  <th class="py-3.5 px-4 sm:px-5 text-right">{{ t('package_detail.col_unit_price', 'Harga Satuan') }}</th>
                  <th class="py-3.5 px-4 sm:px-5 text-right">{{ t('package_detail.col_subtotal', 'Total') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-medium">
                <tr>
                  <td class="py-4 px-4 sm:px-5">
                    <div class="font-black text-navy text-xs sm:text-sm">{{ tx.plan_name || 'Paket Kuota Event' }}</div>
                    <div class="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{{ t('package_detail.quota_activation_note', 'Aktivasi turnamen resmi, OBS overlay, dan scoring live') }}</div>
                  </td>
                  <td class="py-4 px-4 sm:px-5 text-center font-bold text-navy">
                    {{ tx.quantity || 1 }} {{ t('package_detail.event_unit', 'Event') }}
                  </td>
                  <td class="py-4 px-4 sm:px-5 text-right font-bold text-slate-600">
                    Rp {{ formatNumber((tx.total_amount || tx.amount || 0) / (tx.quantity || 1)) }}
                  </td>
                  <td class="py-4 px-4 sm:px-5 text-right font-black text-navy text-xs sm:text-sm">
                    Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Totals & Payment Method Info -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-2">
          <div class="space-y-1.5 text-xs max-w-sm w-full sm:w-auto">
            <span class="text-[10px] font-black text-slate-400 capitalize tracking-wider block">
              {{ t('package_detail.payment_info', 'Informasi Pembayaran') }}
            </span>
            <div class="flex justify-between gap-4 text-slate-600">
              <span class="font-medium">{{ t('package_detail.method_label', 'Metode Pembayaran:') }}</span>
              <span class="font-bold text-navy capitalize">{{ formatPaymentMethodName(tx.payment_method) }}</span>
            </div>
            <div class="flex justify-between gap-4 text-slate-600">
              <span class="font-medium">{{ t('package_detail.transaction_time', 'Waktu Transaksi:') }}</span>
              <span class="font-bold text-navy">{{ formatDate(tx.created_at || tx.purchased_at) }}</span>
            </div>
          </div>

          <div class="w-full sm:w-64 space-y-2 text-xs border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
            <div class="flex justify-between text-slate-500">
              <span>{{ t('package_detail.subtotal', 'Subtotal') }}</span>
              <span class="font-bold text-navy">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
            </div>
            <div class="flex justify-between text-slate-500">
              <span>{{ t('package_detail.admin_fee', 'Biaya Layanan') }}</span>
              <span class="font-bold text-emerald-600">{{ t('package_detail.free', 'Gratis') }}</span>
            </div>
            <div class="h-px bg-slate-100 my-1"></div>
            <div class="flex justify-between items-baseline">
              <span class="text-xs sm:text-sm font-black text-navy">{{ t('package_detail.total_paid', 'Total Tagihan') }}</span>
              <span class="text-xl sm:text-2xl font-black text-navy tabular-nums">
                Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Instructions (If Pending) -->
        <div v-if="isPending && instructionGroups.length > 0" class="border-t border-gray-100 pt-6 space-y-3">
          <h4 class="text-xs font-black text-navy flex items-center gap-2 capitalize">
            <Icon icon="ph:info-bold" class="text-primary text-base" />
            <span>{{ t('package_detail.instructions_title', 'Petunjuk Cara Pembayaran') }}</span>
          </h4>

          <div class="flex flex-wrap gap-2">
            <button v-for="(group, idx) in instructionGroups" :key="idx"
              type="button"
              @click="activeGroupIdx = idx"
              :class="activeGroupIdx === idx ? 'bg-navy text-white font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold'"
              class="px-3.5 py-1.5 rounded-xl text-xs transition-all">
              {{ group.title }}
            </button>
          </div>

          <ol class="space-y-2 text-xs text-slate-600 font-medium pl-4 list-decimal leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            <li v-for="(step, sIdx) in activeGroupSteps" :key="sIdx">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- Card Bottom Actions -->
        <div class="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-[11px] text-slate-400 flex items-center gap-2 text-center sm:text-left">
            <Icon icon="ph:shield-check-bold" class="text-primary text-base shrink-0" />
            <span>{{ t('package_detail.security_note', 'Kuitansi pembayaran resmi diterbitkan secara otomatis oleh ArcheryHub.id') }}</span>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <NuxtLink v-if="isPaid" to="/dashboard/organizer/events"
              class="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-xs w-full sm:w-auto">
              <Icon icon="ph:trophy-bold" />
              <span>{{ t('package_detail.btn_create_event', 'Buat Event Baru') }}</span>
            </NuxtLink>

            <NuxtLink to="/dashboard/organizer/package"
              class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center w-full sm:w-auto">
              {{ t('package_detail.btn_back_to_packages', 'Kembali ke Manajemen Paket') }}
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>

    <!-- ── 5. Standard Clean HTML Invoice (Light Borders, Refined PDF Footer, Title Case) ── -->
    <div class="hidden print:block text-slate-800 bg-white font-sans a4-invoice-container">
      
      <!-- Invoice Top Bar: Logo & Invoice Header -->
      <div class="flex justify-between items-start border-b border-slate-200 pb-5 mb-6">
        <div>
          <div class="text-2xl font-black text-slate-900 tracking-tight">ArcheryHub.id</div>
          <div class="text-xs text-slate-600 font-bold mt-1">PT. Archeris Teknologi Indonesia</div>
          <div class="text-[11px] text-slate-400">Platform Manajemen Turnamen Panahan Digital</div>
          <div class="text-[11px] text-slate-400">Jakarta, Indonesia | info@archeryhub.id</div>
        </div>

        <div class="text-right">
          <div class="text-xl font-black tracking-wider text-slate-900">INVOICE</div>
          <div class="font-mono text-xs font-bold text-slate-700 mt-1">No: {{ tx.reference || reference }}</div>
          <div class="text-xs text-slate-500 mt-0.5">Tanggal: {{ formatDate(tx.purchased_at || tx.created_at) }}</div>
          <div class="mt-2">
            <span class="inline-block px-2.5 py-0.5 rounded text-[11px] font-black border"
              :class="isPaid ? 'bg-slate-50 text-slate-900 border-slate-300' : 'bg-slate-50 text-slate-600 border-slate-200'">
              {{ isPaid ? 'Lunas / Paid' : 'Menunggu Pembayaran / Unpaid' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bill-To / Publisher Information -->
      <div class="grid grid-cols-2 gap-8 mb-6 text-xs">
        <div class="space-y-1">
          <div class="text-[10px] font-bold text-slate-400 capitalize tracking-wider">Diterbitkan Oleh:</div>
          <div class="font-black text-slate-900">ArcheryHub.id Billing Department</div>
          <div class="text-slate-500">PT. Archeris Teknologi Indonesia</div>
          <div class="text-slate-500">archeryhub.id</div>
        </div>

        <div class="space-y-1">
          <div class="text-[10px] font-bold text-slate-400 capitalize tracking-wider">Ditagihkan Kepada:</div>
          <div class="font-black text-slate-900">{{ organizerProfile?.name || tx.organizer_name || 'Penyelenggara Event' }}</div>
          <div class="text-slate-500">{{ organizerProfile?.email || tx.organizer_email || '-' }}</div>
          <div class="text-slate-500">Penyelenggara Resmi ArcheryHub.id</div>
        </div>
      </div>

      <!-- Clean Itemized Table with Light Borders -->
      <table class="w-full text-left text-xs mb-6 border-collapse">
        <thead>
          <tr class="border-b border-slate-200 text-slate-600 font-bold bg-slate-50/50">
            <th class="py-2.5 px-2 w-10">No</th>
            <th class="py-2.5 px-2">Deskripsi Layanan</th>
            <th class="py-2.5 px-2 text-center w-24">Jumlah</th>
            <th class="py-2.5 px-2 text-right w-28">Harga Satuan</th>
            <th class="py-2.5 px-2 text-right w-32">Total (IDR)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr>
            <td class="py-3 px-2 text-slate-400 font-medium">1</td>
            <td class="py-3 px-2">
              <div class="font-bold text-slate-900">{{ tx.plan_name || 'Paket Kuota Event' }}</div>
              <div class="text-[10px] text-slate-400 mt-0.5">Aktivasi turnamen resmi, OBS overlay, dan scoring live</div>
            </td>
            <td class="py-3 px-2 text-center font-semibold text-slate-800">{{ tx.quantity || 1 }} Event</td>
            <td class="py-3 px-2 text-right text-slate-600">Rp {{ formatNumber((tx.total_amount || tx.amount || 0) / (tx.quantity || 1)) }}</td>
            <td class="py-3 px-2 text-right font-bold text-slate-900">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals & Payment Summary -->
      <div class="flex justify-between items-start border-t border-slate-200 pt-4 mb-8 text-xs">
        <div class="space-y-1 text-slate-500 max-w-xs">
          <div class="font-bold text-slate-800">Informasi Pembayaran:</div>
          <div>Metode: {{ formatPaymentMethodName(tx.payment_method) }}</div>
          <div v-if="tx.pay_code">No. Virtual Account: {{ tx.pay_code }}</div>
          <div>Status: {{ isPaid ? 'Lunas (Terverifikasi Sistem)' : 'Menunggu Pembayaran' }}</div>
        </div>

        <div class="w-60 space-y-1.5 text-right">
          <div class="flex justify-between text-slate-500">
            <span>Subtotal:</span>
            <span class="font-semibold text-slate-800">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
          </div>
          <div class="flex justify-between text-slate-500">
            <span>Biaya Layanan:</span>
            <span class="font-semibold text-slate-800">Rp 0</span>
          </div>
          <div class="border-t border-slate-200 pt-2 flex justify-between text-sm font-black text-slate-900">
            <span>Total Tagihan:</span>
            <span>Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Refined Minimal PDF / Print Footer -->
      <div class="border-t border-slate-200 pt-4 flex justify-between items-center text-[10px] text-slate-400">
        <div>
          Faktur ini merupakan bukti pembayaran elektronik resmi yang sah dari ArcheryHub.id.
        </div>
        <div class="font-bold text-slate-500">
          ArcheryHub.id Digital Receipt
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from '#app'
import { usePayment } from '~/composables/usePayment'
import { useAuth } from '~/composables/useAuth'
import { useI18n } from 'vue-i18n'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
useHead({ title: computed(() => t('package_detail.page_title', 'Detail Invoice Pembayaran') + ' - ArcheryHub') })

const route = useRoute()
const payment = usePayment()
const { organizerProfile } = useAuth()
const apiBaseUrl = useApiBaseUrl()

const reference = computed(() => (route.query.trx_id || route.query.ref || route.params.id || '').toString())

const tx = ref<any>({})
const isLoading = ref(true)
const errorMsg = ref('')
const copied = ref(false)
const activeGroupIdx = ref(0)

const isPaid = computed(() => {
  const s = (tx.value.status || tx.value.payment_status || '').toLowerCase()
  return s === 'paid' || s === 'completed' || s === 'sukses'
})

const isPending = computed(() => {
  const s = (tx.value.status || tx.value.payment_status || '').toLowerCase()
  return s === 'pending' || s === 'unpaid' || s === 'waiting'
})

const isQR = computed(() => {
  const m = (tx.value.payment_method || '').toUpperCase()
  return m === 'QRIS' || m === 'QR' || m.includes('QR')
})

const statusBadgeClasses = computed(() => {
  if (isPaid.value) return 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
  if (isPending.value) return 'bg-amber-50 text-amber-800 border-amber-200/80'
  return 'bg-rose-50 text-rose-800 border-rose-200/80'
})

const statusIcon = computed(() => {
  if (isPaid.value) return 'ph:check-circle-bold'
  if (isPending.value) return 'ph:clock-bold'
  return 'ph:x-circle-bold'
})

function formatStatus(status: string) {
  if (!status) return t('package_detail.status_pending', 'Menunggu Pembayaran')
  const s = status.toLowerCase()
  if (s === 'paid') return t('package_detail.status_paid', 'Lunas')
  if (s === 'pending') return t('package_detail.status_pending', 'Menunggu Pembayaran')
  if (s === 'expired') return t('package_detail.status_expired', 'Kadaluwarsa')
  if (s === 'failed') return t('package_detail.status_failed', 'Gagal')
  return status
}

function formatPaymentMethodName(method: string) {
  if (!method) return 'Mayar Payment'
  const m = method.toUpperCase()
  if (m === 'MAYAR') return 'Mayar (Online)'
  if (m === 'QRIS') return 'QRIS (Semua E-Wallet)'
  if (m === 'MYBCAVA' || m === 'BCAVA' || m === 'BCA') return 'BCA Virtual Account'
  if (m === 'BRIVA' || m === 'BRI') return 'BRI Virtual Account'
  if (m === 'MANDIRIVA' || m === 'MANDIRI') return 'Mandiri Virtual Account'
  if (m === 'BNIVA' || m === 'BNI') return 'BNI Virtual Account'
  if (m === 'PERMATAVA' || m === 'PERMATA') return 'Permata Virtual Account'
  return method
}

function formatNumber(val: any) {
  const num = Number(val)
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID').format(num)
}

function formatDate(dateStr: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

function formatExpiry(val: any) {
  if (!val) return '-'
  if (typeof val === 'number') {
    return new Date(val * 1000).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }
  return new Date(val).toLocaleString('id-ID')
}

function getInvoicePdfUrl(ref: string) {
  return `${apiBaseUrl}/payment/invoice/${ref}`
}

function printInvoice() {
  window.print()
}

const copyText = async (text: string) => {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error(err)
  }
}

const isDownloadingQR = ref(false)
async function downloadQRCode() {
  const qrTarget = tx.value?.qr_url || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=DEV-QRIS-${tx.value?.reference || reference.value}`
  try {
    isDownloadingQR.value = true
    const response = await fetch(qrTarget)
    const blob = await response.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = `QRIS-${tx.value?.reference || 'ArcheryHub'}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch (e) {
    // Direct trigger fallback
    const a = document.createElement('a')
    a.href = qrTarget
    a.download = `QRIS-${tx.value?.reference || 'ArcheryHub'}.png`
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } finally {
    isDownloadingQR.value = false
  }
}

const instructionGroups = computed(() => {
  if (!tx.value || !tx.value.instructions) return []
  try {
    const parsed = typeof tx.value.instructions === 'string' ? JSON.parse(tx.value.instructions) : tx.value.instructions
    if (Array.isArray(parsed)) {
      return parsed.map((g: any) => ({ title: g.title || 'Petunjuk', steps: Array.isArray(g.steps) ? g.steps : [] })).filter((g: any) => g.steps.length > 0)
    }
  } catch {}
  return []
})

const activeGroupSteps = computed(() => {
  const groups = instructionGroups.value
  if (groups && groups[activeGroupIdx.value]) {
    return groups[activeGroupIdx.value].steps || []
  }
  return []
})

async function loadDetails() {
  if (!reference.value) {
    errorMsg.value = t('package_detail.id_missing', 'ID Transaksi tidak ditemukan.')
    isLoading.value = false
    return
  }
  isLoading.value = true
  errorMsg.value = ''
  try {
    const res: any = await payment.getPaymentStatus(reference.value)
    if (res) {
      tx.value = res
    } else {
      errorMsg.value = t('package_detail.tx_not_found', 'Transaksi dengan referensi tersebut tidak ditemukan.')
    }
  } catch (err: any) {
    errorMsg.value = err?.data?.error || t('package_detail.load_failed', 'Gagal memuat status pembayaran.')
  } finally {
    isLoading.value = false
  }
}

let pollingInterval: any = null

onMounted(() => {
  loadDetails()
  pollingInterval = setInterval(async () => {
    if (isPaid.value || !isPending.value) return
    try {
      const res: any = await payment.getPaymentStatus(reference.value)
      if (res) tx.value = res
    } catch {}
  }, 5000)
})

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval)
})
</script>

<style>
@page {
  margin: 10mm 12mm;
  size: A4 portrait;
}

@media print {
  html, body {
    background: #ffffff !important;
    color: #0f172a !important;
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
  }

  /* Hide entire dashboard navigation shell */
  nav, aside, header, footer,
  .app-sidebar, .app-header,
  #app-sidebar, #app-header,
  div[class*="sidebar"],
  div[class*="navbar"] {
    display: none !important;
  }

  /* Reset outer layout spacing */
  main,
  .flex-1,
  div[class*="space-y"] {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
  }

  .a4-invoice-container {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
</style>
