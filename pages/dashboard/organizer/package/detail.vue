<template>
  <div class="space-y-6 pb-16">
    
    <!-- ── 1. Standard Dashboard Header (Hidden on Print) ── -->
    <DashboardHeader
      class="print:hidden"
      :title="t('package_detail.page_title', 'Detail Invoice Pembayaran')"
      :subtitle="`${t('package_detail.invoice_number', 'Nomor Invoice')}: ${tx.reference || reference}`"
      icon="ph:receipt-bold"
      :breadcrumbs="[
        { label: t('package_detail.breadcrumb_package', 'Paket & Kuota'), to: '/dashboard/organizer/package' },
        { label: `Invoice #${tx.reference || reference}` }
      ]"
    >
      <template #actions>
        <button
          type="button"
          @click="printInvoice"
          class="h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer">
          <Icon icon="ph:printer-bold" class="text-sm" />
          <span>{{ t('package_detail.btn_print', 'Cetak Invoice') }}</span>
        </button>

        <a
          v-if="isPaid"
          :href="getInvoicePdfUrl(tx.reference || reference)"
          target="_blank"
          class="h-10 px-4 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer">
          <Icon icon="ph:file-pdf-bold" class="text-sm text-primary" />
          <span>{{ t('package_detail.btn_download_pdf', 'Unduh PDF') }}</span>
        </a>
      </template>
    </DashboardHeader>

    <!-- ── 2. Loading State ── -->
    <div v-if="isLoading" class="w-full bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-xs print:hidden">
      <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-3 mx-auto" />
      <div class="text-slate-600 font-bold text-sm">{{ t('package_detail.loading', 'Memuat Rincian Transaksi...') }}</div>
    </div>

    <!-- ── 3. Error State ── -->
    <div v-else-if="errorMsg" class="w-full bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-xs space-y-4 print:hidden">
      <div class="size-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
        <Icon icon="ph:warning-circle-bold" class="text-3xl" />
      </div>
      <h2 class="text-base font-black text-navy">{{ t('package_detail.not_found_title', 'Transaksi Tidak Ditemukan') }}</h2>
      <div class="text-slate-500 text-xs font-medium max-w-md mx-auto">{{ errorMsg }}</div>
      <NuxtLink to="/dashboard/organizer/package" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold">
        {{ t('package_detail.btn_back_to_packages', 'Kembali ke Manajemen Paket') }}
      </NuxtLink>
    </div>

    <!-- ── 4. Main 1-Column Dashboard View ── -->
    <div v-else class="w-full space-y-6 print:hidden">
      
      <!-- A. STATUS HERO BANNER -->
      <!-- Paid Hero Banner -->
      <div v-if="isPaid" class="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs">
        <div class="flex items-start gap-4">
          <div class="size-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
            <Icon icon="ph:check-bold" class="text-2xl" />
          </div>
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                {{ t('package_detail.paid_badge', 'Lunas / Terverifikasi') }}
              </span>
              <span class="text-xs text-slate-400 font-semibold">{{ formatDate(tx.purchased_at || tx.created_at) }}</span>
            </div>
            <div class="text-base sm:text-lg font-black text-navy">{{ t('package_detail.paid_title', 'Pembayaran Berhasil & Terverifikasi') }}</div>
            <div class="text-xs text-slate-500 font-medium">
              {{ t('package_detail.paid_desc', 'Kuota turnamen panahan Anda telah aktif secara instan dan dapat langsung digunakan untuk membuka event baru.') }}
            </div>
          </div>
        </div>
        <div class="shrink-0 pt-2 sm:pt-0">
          <NuxtLink to="/dashboard/organizer/events"
            class="w-full sm:w-auto px-5 py-3 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all">
            <Icon icon="ph:plus-circle-bold" class="text-base text-primary" />
            <span>{{ t('package_detail.btn_create_event', 'Buat Event Sekarang') }}</span>
          </NuxtLink>
        </div>
      </div>

      <!-- Pending Hero Banner (Warm Gold/Amber Vibrant Inner Card - No Dull Gray) -->
      <div v-else-if="isPending" class="bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-7 shadow-sm space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-100">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Icon icon="ph:clock-bold" class="text-xl" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-400 capitalize tracking-wider">{{ t('package_detail.status_label', 'Status Pembayaran') }}</div>
              <div class="text-base font-black text-navy">{{ t('package_detail.awaiting_payment', 'Menunggu Pembayaran Online') }}</div>
            </div>
          </div>
          <div v-if="tx.expiry_date" class="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold flex items-center gap-1.5 w-fit">
            <Icon icon="ph:hourglass-medium-bold" class="text-sm text-amber-600" />
            <span>{{ t('package_detail.pay_before', 'Bayar Sebelum') }}: {{ formatExpiry(tx.expiry_date) }}</span>
          </div>
        </div>

        <!-- Vibrant Warm Gold Card Inner (Clean, Non-gray) -->
        <div class="bg-gradient-to-br from-amber-500/10 via-amber-50/70 to-primary/20 border-2 border-primary/60 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="text-sm sm:text-base font-black text-navy flex items-center gap-2">
                <Icon icon="ph:shield-check-fill" class="text-primary text-lg" />
                <span>{{ t('package_detail.pay_via_mayar_title', 'Selesaikan Pembayaran via Mayar') }}</span>
              </div>
              <div class="text-xs text-slate-600 font-medium leading-relaxed max-w-lg">
                {{ t('package_detail.pay_via_mayar_desc', 'Bayar secara aman menggunakan QRIS (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay) atau Virtual Account resmi.') }}
              </div>
            </div>
            <div class="sm:text-right shrink-0">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('package_detail.total_paid', 'Total Tagihan') }}</span>
              <span class="text-xl sm:text-2xl font-black text-navy tabular-nums">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
            </div>
          </div>

          <!-- Single Direct Payment CTA Button -->
          <a v-if="tx.checkout_url" :href="tx.checkout_url" target="_blank" rel="noopener noreferrer"
            class="w-full py-4 px-6 bg-primary hover:bg-primary-hover text-navy rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
            <Icon icon="ph:arrow-square-out-bold" class="text-xl" />
            <span>{{ t('package_detail.btn_pay_now', 'Bayar Sekarang di Mayar') }}</span>
          </a>

          <!-- Supported Payment Methods -->
          <div class="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-semibold">
            <span class="text-slate-400">{{ t('package_detail.available_methods', 'Metode Tersedia') }}:</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">{{ t('package_detail.method_qris', 'QRIS (Semua E-Wallet)') }}</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">BCA VA</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">Mandiri VA</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">BRI VA</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">BNI VA</span>
            <span class="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200/80 font-bold text-slate-800 shadow-2xs">Permata VA</span>
          </div>
        </div>
      </div>

      <!-- B. MAIN INVOICE ORDER CARD -->
      <div class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
        
        <!-- Invoice Metadata Header -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-gray-100 text-xs">
          <div class="space-y-1">
            <span class="text-slate-400 font-bold block">{{ t('package_detail.invoice_number', 'Nomor Invoice') }}</span>
            <span class="font-mono font-black text-navy truncate block select-all">{{ tx.reference || reference }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-slate-400 font-bold block">{{ t('package_detail.purchase_time', 'Waktu Pembelian') }}</span>
            <span class="font-bold text-navy block">{{ formatDate(tx.purchased_at || tx.created_at) }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-slate-400 font-bold block">{{ t('package_detail.method_label', 'Metode') }}</span>
            <span class="font-bold text-navy block capitalize">{{ formatPaymentMethodName(tx.payment_method) }}</span>
          </div>
          <div class="space-y-1">
            <span class="text-slate-400 font-bold block">{{ t('package_detail.status', 'Status') }}</span>
            <span :class="statusBadgeClasses" class="px-2.5 py-0.5 rounded-lg text-[10px] font-black capitalize border shadow-2xs inline-block">
              {{ formatStatus(tx.status || tx.payment_status) }}
            </span>
          </div>
        </div>

        <!-- Service Itemized Breakdown -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-navy flex items-center gap-2">
              <Icon icon="ph:list-dashes-bold" class="text-primary text-base" />
              <span>{{ t('package_detail.item_details', 'Rincian Layanan & Kuota') }}</span>
            </h3>
            <span class="text-xs font-bold text-slate-400">{{ t('package_detail.item_count', { count: 1 }) }}</span>
          </div>

          <div class="border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
            <table class="w-full text-left text-xs min-w-[480px]">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-gray-100">
                <tr>
                  <th class="py-3 px-4">{{ t('package_detail.col_item', 'Deskripsi Layanan') }}</th>
                  <th class="py-3 px-4 text-center">{{ t('package_detail.col_qty', 'Jumlah') }}</th>
                  <th class="py-3 px-4 text-right">{{ t('package_detail.col_unit_price', 'Harga Satuan') }}</th>
                  <th class="py-3 px-4 text-right">{{ t('package_detail.col_subtotal', 'Subtotal') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-medium">
                <tr>
                  <td class="py-4 px-4">
                    <div class="font-black text-navy text-xs sm:text-sm">{{ tx.plan_name || 'Paket Kuota Event' }}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">{{ t('package_detail.quota_note', 'Aktivasi turnamen resmi panahan, OBS scoring overlay, dan live streaming ranking') }}</div>
                  </td>
                  <td class="py-4 px-4 text-center font-black text-navy">
                    {{ tx.quantity || 1 }} {{ t('package_detail.event_unit', 'Event') }}
                  </td>
                  <td class="py-4 px-4 text-right font-bold text-slate-600">
                    Rp {{ formatNumber((tx.total_amount || tx.amount || 0) / (tx.quantity || 1)) }}
                  </td>
                  <td class="py-4 px-4 text-right font-black text-navy text-xs sm:text-sm">
                    Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Calculation Breakdown -->
          <div class="pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div class="text-xs text-slate-400 space-y-1">
              <div>{{ t('package_detail.official_receipt_note', 'Kuitansi resmi diterbitkan oleh ArcheryHub.id') }}</div>
              <div class="text-[11px] text-slate-400">{{ t('package_detail.tax_note', 'Pajak sudah termasuk dalam total pembayaran (PPN 0%)') }}</div>
            </div>

            <div class="w-full sm:w-64 space-y-2 text-xs">
              <div class="flex justify-between text-slate-500">
                <span>{{ t('package_detail.col_subtotal', 'Subtotal') }}</span>
                <span class="font-bold text-navy">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>{{ t('package_detail.admin_fee', 'Biaya Layanan Payment') }}</span>
                <span class="font-bold text-emerald-600">{{ t('package_detail.free', 'Gratis (Rp 0)') }}</span>
              </div>
              <div class="h-px bg-slate-100 my-1"></div>
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-black text-navy">{{ t('package_detail.total_payment', 'Total Pembayaran') }}</span>
                <span class="text-lg sm:text-xl font-black text-navy tabular-nums">
                  Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- C. PAYMENT INSTRUCTIONS (If Pending) -->
        <div v-if="isPending && instructionGroups.length > 0" class="border-t border-gray-100 pt-6 space-y-4">
          <h4 class="text-sm font-black text-navy flex items-center gap-2">
            <Icon icon="ph:info-bold" class="text-primary text-base" />
            <span>{{ t('package_detail.instructions_title', 'Petunjuk Cara Pembayaran') }}</span>
          </h4>

          <div class="flex flex-wrap gap-2">
            <button v-for="(group, idx) in instructionGroups" :key="idx"
              type="button"
              @click="activeGroupIdx = idx"
              :class="activeGroupIdx === idx ? 'bg-navy text-white font-black' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold'"
              class="px-3.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer">
              {{ group.title }}
            </button>
          </div>

          <ol class="space-y-2 text-xs text-slate-600 font-medium pl-4 list-decimal leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <li v-for="(step, sIdx) in activeGroupSteps" :key="sIdx">
              {{ step }}
            </li>
          </ol>
        </div>

        <!-- D. Bottom Navigation Links (Clean & Non-repetitive) -->
        <div class="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2 text-xs text-slate-400">
            <Icon icon="ph:shield-check-bold" class="text-emerald-500 text-base" />
            <span>{{ t('package_detail.security_title', 'Jaminan Pembayaran Aman') }} (Mayar SSL 256-bit)</span>
          </div>

          <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <NuxtLink :to="`/payment/status/${tx.reference || reference}`"
              class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center">
              <Icon icon="ph:globe-bold" class="text-sm" />
              <span>{{ t('package_detail.btn_public_status', 'Halaman Status Publik') }}</span>
            </NuxtLink>

            <NuxtLink to="/dashboard/organizer/package"
              class="px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-bold transition-all flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-xs">
              <span>{{ t('package_detail.btn_back', 'Kembali ke Paket') }}</span>
            </NuxtLink>
          </div>
        </div>

      </div>

    </div>

    <!-- ── 5. Standard Clean HTML Invoice (Print Mode - Beautiful Professional Layout) ── -->
    <div class="hidden print:block text-slate-800 bg-white font-sans a4-invoice-container p-6 sm:p-8">
      
      <!-- Invoice Top Bar: Logo & Invoice Header -->
      <div class="flex justify-between items-start border-b-2 border-slate-900 pb-5 mb-6">
        <div>
          <div class="text-2xl font-black text-slate-900 tracking-tight">ArcheryHub.id</div>
          <div class="text-xs text-slate-700 font-bold mt-1">{{ t('package_detail.company_name', 'PT. Archeris Teknologi Indonesia') }}</div>
          <div class="text-[11px] text-slate-500">{{ t('package_detail.platform_subtitle', 'Platform Manajemen Turnamen Panahan Digital') }}</div>
          <div class="text-[11px] text-slate-400">{{ t('package_detail.location_info', 'Jakarta, Indonesia | info@archeryhub.id') }}</div>
        </div>

        <div class="text-right">
          <div class="text-2xl font-black tracking-widest text-slate-900">{{ t('package_detail.invoice_label', 'INVOICE') }}</div>
          <div class="font-mono text-xs font-bold text-slate-700 mt-1">{{ t('package_detail.invoice_no_prefix', 'No:') }} {{ tx.reference || reference }}</div>
          <div class="text-xs text-slate-500 mt-0.5">{{ t('package_detail.date_label', 'Tanggal') }}: {{ formatDate(tx.purchased_at || tx.created_at) }}</div>
          <div class="mt-2">
            <span class="inline-block px-3 py-1 rounded-md text-[11px] font-black border"
              :class="isPaid ? 'bg-emerald-50 text-emerald-900 border-emerald-300' : 'bg-amber-50 text-amber-900 border-amber-300'">
              {{ isPaid ? t('package_detail.status_paid', 'Lunas / Paid') : t('package_detail.status_pending', 'Menunggu Pembayaran / Unpaid') }}
            </span>
          </div>
        </div>
      </div>

      <!-- Bill-To / Publisher Information -->
      <div class="grid grid-cols-2 gap-8 mb-6 text-xs">
        <div class="space-y-1">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ t('package_detail.issued_by', 'Diterbitkan Oleh:') }}</div>
          <div class="font-black text-slate-900">{{ t('package_detail.billing_dept', 'ArcheryHub.id Billing Department') }}</div>
          <div class="text-slate-600">{{ t('package_detail.company_name', 'PT. Archeris Teknologi Indonesia') }}</div>
          <div class="text-slate-400">https://archeryhub.id</div>
        </div>

        <div class="space-y-1">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ t('package_detail.billed_to', 'Ditagihkan Kepada:') }}</div>
          <div class="font-black text-slate-900">{{ organizerProfile?.name || tx.organizer_name || t('package_detail.default_organizer', 'Penyelenggara Event') }}</div>
          <div class="text-slate-600">{{ organizerProfile?.email || tx.organizer_email || '-' }}</div>
          <div class="text-slate-400">{{ t('package_detail.official_organizer_role', 'Penyelenggara Resmi ArcheryHub.id') }}</div>
        </div>
      </div>

      <!-- Clean Itemized Table with Light Borders -->
      <table class="w-full text-left text-xs mb-6 border-collapse">
        <thead>
          <tr class="border-y border-slate-300 text-slate-700 font-black bg-slate-50">
            <th class="py-2.5 px-3 w-10">{{ t('package_detail.col_no', 'No') }}</th>
            <th class="py-2.5 px-3">{{ t('package_detail.col_item', 'Deskripsi Layanan') }}</th>
            <th class="py-2.5 px-3 text-center w-24">{{ t('package_detail.col_qty', 'Jumlah') }}</th>
            <th class="py-2.5 px-3 text-right w-32">{{ t('package_detail.col_unit_price', 'Harga Satuan') }}</th>
            <th class="py-2.5 px-3 text-right w-36">{{ t('package_detail.col_total_idr', 'Total (IDR)') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr>
            <td class="py-3.5 px-3 text-slate-400 font-medium">1</td>
            <td class="py-3.5 px-3">
              <div class="font-bold text-slate-900">{{ tx.plan_name || 'Paket Kuota Event' }}</div>
              <div class="text-[10px] text-slate-500 mt-0.5">{{ t('package_detail.quota_note', 'Aktivasi turnamen resmi, OBS overlay, dan scoring live') }}</div>
            </td>
            <td class="py-3.5 px-3 text-center font-semibold text-slate-800">{{ tx.quantity || 1 }} {{ t('package_detail.event_unit', 'Event') }}</td>
            <td class="py-3.5 px-3 text-right text-slate-700 font-medium">Rp {{ formatNumber((tx.total_amount || tx.amount || 0) / (tx.quantity || 1)) }}</td>
            <td class="py-3.5 px-3 text-right font-black text-slate-900">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals & Payment Summary -->
      <div class="flex justify-between items-start border-t border-slate-300 pt-4 mb-6 text-xs">
        <div class="space-y-1 text-slate-600 max-w-xs">
          <div class="font-black text-slate-900">{{ t('package_detail.payment_info_title', 'Informasi Pembayaran:') }}</div>
          <div>{{ t('package_detail.method_label', 'Metode') }}: {{ formatPaymentMethodName(tx.payment_method) }}</div>
          <div>{{ t('package_detail.status', 'Status') }}: {{ isPaid ? t('package_detail.status_paid', 'Lunas (Terverifikasi Sistem)') : t('package_detail.status_pending', 'Menunggu Pembayaran') }}</div>
        </div>

        <div class="w-64 space-y-1.5 text-right">
          <div class="flex justify-between text-slate-600">
            <span>{{ t('package_detail.col_subtotal', 'Subtotal') }}:</span>
            <span class="font-semibold text-slate-900">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>{{ t('package_detail.admin_fee', 'Biaya Layanan') }}:</span>
            <span class="font-semibold text-emerald-700">{{ t('package_detail.free', 'Rp 0') }}</span>
          </div>
          <div class="border-t border-slate-300 pt-2 flex justify-between text-sm font-black text-slate-900">
            <span>{{ t('package_detail.total_payment', 'Total Tagihan') }}:</span>
            <span class="text-base">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- Professional Authorization & Terms Footer in Print Mode -->
      <div class="grid grid-cols-2 gap-8 border-t border-slate-200 pt-6 mb-6 text-xs">
        <div class="space-y-1 text-slate-500">
          <div class="font-bold text-slate-800">{{ t('package_detail.terms_title', 'Ketentuan & Syarat:') }}</div>
          <div class="text-[10px] leading-relaxed text-slate-600">{{ t('package_detail.terms_desc', '1. Kuitansi ini sah dan diterbitkan secara elektronik oleh sistem ArcheryHub.') }}</div>
          <div class="text-[10px] leading-relaxed text-slate-600">{{ t('package_detail.terms_desc_2', '2. Kuota turnamen yang telah aktif siap digunakan untuk membuka event baru.') }}</div>
        </div>

        <div class="text-right space-y-1.5 flex flex-col items-end">
          <div class="text-[10px] text-slate-400 font-semibold">{{ t('package_detail.authorized_by', 'Otorisasi Resmi Digital:') }}</div>
          <div class="px-4 py-2 border-2 border-emerald-500/40 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-2 text-xs font-black tracking-wider">
            <Icon icon="ph:seal-check-bold" class="text-lg text-emerald-600" />
            <span>{{ t('package_detail.verified_stamp', 'VERIFIED DIGITAL SEAL') }}</span>
          </div>
          <div class="text-[11px] font-bold text-slate-800">{{ t('package_detail.company_name', 'PT. Archeris Teknologi Indonesia') }}</div>
        </div>
      </div>

      <!-- Bottom Minimal PDF / Print Footer -->
      <div class="border-t border-slate-200 pt-3 flex justify-between items-center text-[10px] text-slate-400">
        <div>
          {{ t('package_detail.official_receipt_note', 'Faktur ini merupakan bukti pembayaran elektronik resmi yang sah dari ArcheryHub.id.') }}
        </div>
        <div class="font-bold text-slate-600">
          {{ t('package_detail.digital_receipt_footer', 'ArcheryHub.id Digital Receipt') }}
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
const activeGroupIdx = ref(0)

const isPaid = computed(() => {
  const s = (tx.value.status || tx.value.payment_status || '').toLowerCase()
  return s === 'paid' || s === 'completed' || s === 'sukses'
})

const isPending = computed(() => {
  const s = (tx.value.status || tx.value.payment_status || '').toLowerCase()
  return s === 'pending' || s === 'unpaid' || s === 'waiting'
})

const statusBadgeClasses = computed(() => {
  if (isPaid.value) return 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
  if (isPending.value) return 'bg-amber-50 text-amber-800 border-amber-200/80'
  return 'bg-rose-50 text-rose-800 border-rose-200/80'
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
  if (!method) return t('package_detail.method_mayar', 'Mayar (QRIS, VA, E-Wallet)')
  const m = method.toUpperCase()
  if (m === 'MAYAR') return t('package_detail.method_mayar', 'Mayar (QRIS, VA, E-Wallet)')
  if (m === 'QRIS') return t('package_detail.method_qris_full', 'QRIS (Semua E-Wallet)')
  if (m === 'MYBCAVA' || m === 'BCAVA' || m === 'BCA') return t('package_detail.method_bca_va', 'BCA Virtual Account')
  if (m === 'BRIVA' || m === 'BRI') return t('package_detail.method_bri_va', 'BRI Virtual Account')
  if (m === 'MANDIRIVA' || m === 'MANDIRI') return t('package_detail.method_mandiri_va', 'Mandiri Virtual Account')
  if (m === 'BNIVA' || m === 'BNI') return t('package_detail.method_bni_va', 'BNI Virtual Account')
  if (m === 'PERMATAVA' || m === 'PERMATA') return t('package_detail.method_permata_va', 'Permata Virtual Account')
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
