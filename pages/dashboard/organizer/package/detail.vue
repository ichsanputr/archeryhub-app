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
    <div v-if="isLoading" class="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-xs print:hidden">
      <Icon icon="ph:spinner-gap-bold" class="text-4xl text-primary animate-spin mb-3 mx-auto" />
      <div class="text-slate-600 font-bold text-sm">{{ t('package_detail.loading', 'Memuat Rincian Transaksi...') }}</div>
    </div>

    <!-- ── 3. Error State ── -->
    <div v-else-if="errorMsg" class="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-xs space-y-4 print:hidden">
      <div class="size-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
        <Icon icon="ph:warning-circle-bold" class="text-3xl" />
      </div>
      <h2 class="text-base font-black text-navy">{{ t('package_detail.not_found_title', 'Transaksi Tidak Ditemukan') }}</h2>
      <div class="text-slate-500 text-xs font-medium max-w-md mx-auto">{{ errorMsg }}</div>
      <NuxtLink to="/dashboard/organizer/package" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy text-white text-xs font-bold">
        {{ t('package_detail.btn_back_to_packages', 'Kembali ke Manajemen Paket') }}
      </NuxtLink>
    </div>

    <!-- ── 4. Main 2-Column Dashboard View ── -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
      
      <!-- LEFT COLUMN: Status Hero, Service Breakdown, Payment Info (2 Cols) -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- A. STATUS HERO BANNER -->
        <!-- Paid Hero -->
        <div v-if="isPaid" class="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 shadow-xs">
          <div class="flex items-start gap-4">
            <div class="size-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
              <Icon icon="ph:check-bold" class="text-2xl" />
            </div>
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Lunas / Verified
                </span>
                <span class="text-xs text-slate-400 font-semibold">{{ formatDate(tx.purchased_at || tx.created_at) }}</span>
              </div>
              <div class="text-base sm:text-lg font-black text-navy">Pembayaran Berhasil & Terverifikasi</div>
              <div class="text-xs text-slate-500 font-medium">
                Kuota turnamen panahan Anda telah aktif secara instan dan dapat langsung digunakan untuk membuka event baru.
              </div>
            </div>
          </div>
          <div class="shrink-0 pt-2 sm:pt-0">
            <NuxtLink to="/dashboard/organizer/events"
              class="w-full sm:w-auto px-5 py-3 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all">
              <Icon icon="ph:plus-circle-bold" class="text-base text-primary" />
              <span>Buat Event Sekarang</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Pending Hero: Direct Mayar Online Checkout Card -->
        <div v-else-if="isPending" class="bg-white rounded-3xl border border-navy/10 p-6 sm:p-7 shadow-sm space-y-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div class="flex items-center gap-3">
              <div class="size-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Icon icon="ph:clock-bold" class="text-xl" />
              </div>
              <div>
                <div class="text-xs font-bold text-slate-400 capitalize tracking-wider">Status Pembayaran</div>
                <div class="text-base font-black text-navy">Menunggu Pembayaran Online</div>
              </div>
            </div>
            <div v-if="tx.expiry_date" class="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-900 text-xs font-bold flex items-center gap-1.5 w-fit">
              <Icon icon="ph:hourglass-medium-bold" class="text-sm text-amber-600" />
              <span>Bayar Sebelum: {{ formatExpiry(tx.expiry_date) }}</span>
            </div>
          </div>

          <!-- Mayar Payment Action Box -->
          <div class="bg-gradient-to-br from-navy/5 via-navy/[0.02] to-primary/5 border-2 border-primary/40 rounded-2xl p-5 sm:p-6 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <div class="text-sm sm:text-base font-black text-navy flex items-center gap-2">
                  <Icon icon="ph:shield-check-fill" class="text-primary text-lg" />
                  <span>Selesaikan Pembayaran via Mayar</span>
                </div>
                <div class="text-xs text-slate-500 font-medium leading-relaxed max-w-lg">
                  Bayar secara aman menggunakan QRIS (BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, ShopeePay) atau Virtual Account resmi.
                </div>
              </div>
              <div class="sm:text-right shrink-0">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Tagihan</span>
                <span class="text-xl sm:text-2xl font-black text-navy tabular-nums">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
              </div>
            </div>

            <!-- Big Direct Payment Button -->
            <a v-if="tx.checkout_url" :href="tx.checkout_url" target="_blank" rel="noopener noreferrer"
              class="w-full py-4 px-6 bg-primary hover:bg-primary-hover text-navy rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
              <Icon icon="ph:arrow-square-out-bold" class="text-xl" />
              <span>Bayar Sekarang di Mayar (Buka Halaman Pembayaran)</span>
            </a>

            <!-- Supported Badges -->
            <div class="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-semibold">
              <span class="text-slate-400">Metode Tersedia:</span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 font-bold text-slate-700">QRIS (Semua E-Wallet)</span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 font-bold text-slate-700">BCA VA</span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 font-bold text-slate-700">Mandiri VA</span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 font-bold text-slate-700">BRI VA</span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 font-bold text-slate-700">BNI VA</span>
              <span class="px-2 py-0.5 rounded-md bg-white border border-slate-200/80 font-bold text-slate-700">Permata VA</span>
            </div>
          </div>
        </div>

        <!-- B. ITEM DETAILS TABLE -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-black text-navy flex items-center gap-2">
              <Icon icon="ph:list-dashes-bold" class="text-primary text-base" />
              <span>Rincian Layanan & Kuota</span>
            </h3>
            <span class="text-xs font-bold text-slate-400">1 Item</span>
          </div>

          <div class="border border-gray-100 rounded-2xl overflow-hidden overflow-x-auto">
            <table class="w-full text-left text-xs min-w-[480px]">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-gray-100">
                <tr>
                  <th class="py-3 px-4">Deskripsi Layanan</th>
                  <th class="py-3 px-4 text-center">Jumlah</th>
                  <th class="py-3 px-4 text-right">Harga Satuan</th>
                  <th class="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 font-medium">
                <tr>
                  <td class="py-4 px-4">
                    <div class="font-black text-navy text-xs sm:text-sm">{{ tx.plan_name || 'Paket Kuota Event' }}</div>
                    <div class="text-[11px] text-slate-400 mt-0.5">Aktivasi turnamen resmi panahan, OBS scoring overlay, dan live streaming ranking</div>
                  </td>
                  <td class="py-4 px-4 text-center font-black text-navy">
                    {{ tx.quantity || 1 }} Event
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
              <div>Kuitansi resmi diterbitkan oleh ArcheryHub.id</div>
              <div class="text-[11px] text-slate-400">Pajak sudah termasuk dalam total pembayaran (PPN 0%)</div>
            </div>

            <div class="w-full sm:w-64 space-y-2 text-xs">
              <div class="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span class="font-bold text-navy">Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}</span>
              </div>
              <div class="flex justify-between text-slate-500">
                <span>Biaya Layanan Payment</span>
                <span class="font-bold text-emerald-600">Gratis (Rp 0)</span>
              </div>
              <div class="h-px bg-slate-100 my-1"></div>
              <div class="flex justify-between items-baseline">
                <span class="text-xs font-black text-navy">Total Pembayaran</span>
                <span class="text-lg sm:text-xl font-black text-navy tabular-nums">
                  Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- C. PAYMENT INSTRUCTIONS (If Pending) -->
        <div v-if="isPending && instructionGroups.length > 0" class="bg-white rounded-3xl border border-gray-100 p-6 sm:p-7 shadow-xs space-y-4">
          <h4 class="text-sm font-black text-navy flex items-center gap-2">
            <Icon icon="ph:info-bold" class="text-primary text-base" />
            <span>Petunjuk Cara Pembayaran</span>
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

      </div>

      <!-- RIGHT COLUMN: Order Summary Card, Public Link & Support (1 Col) -->
      <div class="space-y-6">
        
        <!-- Summary & Actions Card -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-5">
          <div class="space-y-1 pb-4 border-b border-gray-100">
            <div class="text-xs font-bold text-slate-400 capitalize">Ringkasan Invoice</div>
            <div class="font-mono text-sm font-black text-navy truncate select-all">{{ tx.reference || reference }}</div>
          </div>

          <div class="space-y-3 text-xs">
            <div class="flex justify-between items-center text-slate-500">
              <span>Status</span>
              <span :class="statusBadgeClasses" class="px-2.5 py-1 rounded-lg text-[10px] font-black capitalize border shadow-2xs">
                {{ formatStatus(tx.status || tx.payment_status) }}
              </span>
            </div>
            <div class="flex justify-between items-center text-slate-500">
              <span>Metode</span>
              <span class="font-bold text-navy">{{ formatPaymentMethodName(tx.payment_method) }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-500">
              <span>Waktu Pembelian</span>
              <span class="font-bold text-navy">{{ formatDate(tx.purchased_at || tx.created_at) }}</span>
            </div>
            <div class="h-px bg-slate-100 my-1"></div>
            <div class="flex justify-between items-baseline">
              <span class="text-xs font-black text-navy">Total Tagihan</span>
              <span class="text-xl font-black text-navy tabular-nums">
                Rp {{ formatNumber(tx.total_amount || tx.amount || 0) }}
              </span>
            </div>
          </div>

          <!-- Action Buttons in Sidebar -->
          <div class="space-y-2.5 pt-2">
            <a v-if="isPending && tx.checkout_url" :href="tx.checkout_url" target="_blank" rel="noopener noreferrer"
              class="w-full py-3 px-4 bg-primary hover:bg-primary-hover text-navy rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer">
              <Icon icon="ph:arrow-square-out-bold" class="text-base" />
              <span>Buka Invoice Mayar</span>
            </a>

            <NuxtLink :to="`/payment/status/${tx.reference || reference}`"
              class="w-full py-3 px-4 bg-navy hover:bg-navy-dark text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all">
              <Icon icon="ph:globe-bold" class="text-base" />
              <span>Halaman Status Publik</span>
            </NuxtLink>

            <button type="button" @click="printInvoice"
              class="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer">
              <Icon icon="ph:printer-bold" class="text-base" />
              <span>Cetak Bukti Pembayaran</span>
            </button>

            <NuxtLink to="/dashboard/organizer/package"
              class="w-full py-3 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all text-center">
              <span>Kembali ke Paket</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Security & Help Card -->
        <div class="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
          <div class="flex items-start gap-3">
            <div class="size-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <Icon icon="ph:shield-check-bold" class="text-lg" />
            </div>
            <div class="space-y-1">
              <div class="text-xs font-black text-navy">Jaminan Pembayaran Aman</div>
              <div class="text-[11px] text-slate-400 leading-relaxed">
                Diproses secara otomatis dan terenkripsi menggunakan gateway resmi Mayar Headless API.
              </div>
            </div>
          </div>

          <div class="h-px bg-slate-100"></div>

          <a href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20butuh%20bantuan%20terkait%20transaksi%20"
            target="_blank"
            class="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs text-slate-500 hover:text-navy font-bold transition-colors">
            <Icon icon="ph:whatsapp-logo-bold" class="text-emerald-500 text-base" />
            <span>Butuh Bantuan? Hubungi CS</span>
          </a>
        </div>

      </div>

    </div>

    <!-- ── 5. Standard Clean HTML Invoice (Print Mode) ── -->
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
  if (!method) return 'Mayar Payment Gateway'
  const m = method.toUpperCase()
  if (m === 'MAYAR') return 'Mayar (QRIS, VA, E-Wallet)'
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
