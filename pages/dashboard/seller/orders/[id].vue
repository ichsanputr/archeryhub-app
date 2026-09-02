<template>
  <div class="space-y-6 pb-20">
    <!-- Enhanced Header Section (Standard Seller Dashboard Header) -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4 sm:gap-5">
          <div class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg">
            <Icon icon="ph:shopping-bag-bold" class="text-primary text-2xl sm:text-3xl" />
          </div>
          <div>
            <h1 class="text-xl sm:text-3xl font-black tracking-tight leading-tight">{{ t('seller_order_detail.title', 'Detail Pesanan') }}</h1>
            <div class="text-slate-300 text-xs sm:text-sm font-medium mt-1">
              #{{ (order?.id || order?.reference || order?.uuid || route.params.id || '').slice(0, 8).toUpperCase() }}
              <span v-if="order?.created_at"> • {{ formatDate(order?.created_at) }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <NuxtLink to="/dashboard/seller/orders">
            <BaseButton variant="outline" size="sm" icon="ph:arrow-left-bold"
              class="h-11 px-6 font-black tracking-widest text-xs !rounded-xl border-white/20 text-white hover:bg-white/10 transition-all">
              {{ t('seller_order_detail.back_button', 'Kembali') }}
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div v-if="isLoading"
      class="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-xl rounded-2xl border-2 border-dashed border-gray-100 shadow-sm">
      <div class="relative size-16">
        <div class="absolute inset-0 rounded-2xl bg-primary/10 animate-ping"></div>
        <div
          class="relative size-full rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
          <LoadingSpinner size="md" />
        </div>
      </div>
      <div class="text-center">
        <div class="text-navy font-black tracking-widest text-xs capitalize">{{ t('seller_order_detail.connecting', 'Menghubungkan') }}</div>
        <div class="text-gray-400 text-[10px] font-bold mt-0.5">{{ t('seller_order_detail.syncing', 'Memuat data pesanan...') }}</div>
      </div>
    </div>

    <div v-else-if="!order"
      class="min-h-[400px] flex flex-col items-center justify-center gap-6 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative p-8">
      <div class="absolute top-0 inset-x-0 h-1.5 bg-red-500"></div>
      <div class="size-20 bg-red-50 rounded-3xl flex items-center justify-center mb-1 border border-red-100">
        <Icon icon="ph:warning-circle-bold" class="text-4xl text-red-500" />
      </div>
      <div class="text-center space-y-1">
        <div class="text-navy font-black text-xl tracking-tight">{{ t('seller_order_detail.not_found', 'Pesanan Tidak Ditemukan') }}</div>
        <div class="text-gray-400 text-xs font-medium max-w-[280px] mx-auto">{{ t('seller_order_detail.not_found_desc', 'Pesanan tidak ditemukan atau bukan milik toko Anda.') }}</div>
      </div>
      <NuxtLink to="/dashboard/seller/orders">
        <BaseButton variant="primary" size="sm" icon="ph:arrow-left-bold"
          class="h-11 px-6 !rounded-xl font-black tracking-widest text-xs shadow-sm">{{ t('seller_order_detail.back_button', 'Kembali ke Daftar Pesanan') }}</BaseButton>
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <!-- Left Column: Order Items, Price Summary & Logistics (8 of 12) -->
      <div class="xl:col-span-8 space-y-6">

        <!-- Order Items List -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
            <div class="flex items-center gap-4">
              <div class="size-10 rounded-xl bg-navy text-white flex items-center justify-center shadow-sm">
                <Icon icon="ph:package-bold" class="text-xl" />
              </div>
              <div>
                <h2 class="text-lg font-black text-navy tracking-tight">{{ t('seller_order_detail.order_items', 'Item Pesanan') }}</h2>
                <div class="text-[9px] text-gray-400 font-black tracking-widest">Total {{ (order.items || []).length }} Produk</div>
              </div>
            </div>
            <div class="hidden sm:block text-right">
              <div class="text-[9px] text-gray-400 font-bold tracking-widest mb-0.5">No. Order</div>
              <div class="font-mono text-xs font-black text-navy opacity-70">#{{ (order.id || order.uuid || '').slice(0, 8).toUpperCase() }}</div>
            </div>
          </div>

          <div class="p-4 sm:p-8 space-y-4">
            <div v-for="item in (order.items || [])" :key="item.id"
              class="relative group p-4 sm:p-6 rounded-2xl border border-gray-50 hover:bg-gray-50/30 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6">
              <div
                class="size-20 sm:size-24 rounded-2xl bg-white p-1.5 border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                <img :src="useImageOrDefault(item.image_url || item.product_image, item.product_name)" class="w-full h-full object-cover rounded-xl" />
              </div>

              <div class="flex-1 text-center sm:text-left min-w-0 w-full">
                <div class="text-navy font-black text-base tracking-tight truncate mb-2">{{ item.product_name || 'Produk' }}</div>
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <div
                    class="px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-[10px] font-bold text-gray-400 flex items-center gap-2">
                    <span class="text-primary font-black tracking-widest">{{ t('seller_order_detail.qty', 'Qty') }}</span>
                    <span class="text-navy font-black">{{ item.quantity }}</span>
                  </div>
                  <div
                    class="px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-[10px] font-bold text-gray-400 flex items-center gap-2">
                    <span class="text-primary font-black tracking-widest">{{ t('seller_order_detail.price', 'Harga') }}</span>
                    <span class="text-navy font-black">Rp {{ formatPrice(item.price) }}</span>
                  </div>
                </div>
              </div>

              <div
                class="text-center sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto">
                <div class="text-[9px] font-black text-gray-400 tracking-widest mb-1">{{ t('seller_order_detail.subtotal', 'Subtotal') }}</div>
                <div class="text-lg font-black text-navy tracking-tight">
                  <span class="text-xs font-bold opacity-40">Rp</span> {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>

            <div v-if="!order.items || order.items.length === 0" class="text-center py-6 text-xs text-gray-400 font-bold">
              {{ t("seller_orders.ordered_product_package") }}
            </div>
          </div>

          <!-- Price Summary Footer -->
          <div class="bg-navy p-6 sm:p-8 mt-2 relative overflow-hidden text-white rounded-b-2xl">
            <div class="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 relative z-10">
              <div class="space-y-2 w-full sm:w-64 text-xs">
                <div class="flex justify-between items-center text-slate-300 font-medium">
                  <span>{{ t('seller_order_detail.products_total', 'Total Harga Produk') }}</span>
                  <span class="font-bold text-white">Rp {{ formatPrice(order.total_amount || order.amount) }}</span>
                </div>
                <div class="flex justify-between items-center text-slate-300 font-medium">
                  <span>Biaya Layanan</span>
                  <span class="text-emerald-400 font-bold">GRATIS</span>
                </div>
              </div>

              <div class="text-center sm:text-right">
                <div class="text-[10px] font-black tracking-widest text-slate-400 capitalize mb-1">{{ t('seller_order_detail.total_earnings', 'Total Tagihan Pesanan') }}</div>
                <div class="text-2xl sm:text-3xl font-black tracking-tight text-primary">
                  Rp {{ formatPrice(order.total_amount || order.amount) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping & Logistics -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 group hover:border-primary/20 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon icon="ph:navigation-arrow-bold" class="text-navy group-hover:text-primary text-lg" />
                </div>
                <h2 class="text-base font-black text-navy tracking-tight">{{ t('seller_order_detail.shipping', 'Pengiriman') }}</h2>
              </div>
            </div>

            <div class="space-y-4">
              <div class="p-4 bg-gray-50/70 rounded-xl border border-gray-100">
                <div class="text-[9px] font-black text-primary tracking-widest mb-1.5 capitalize">{{ t('seller_order_detail.recipient', 'Penerima') }}</div>
                <div class="text-navy font-black text-sm mb-1">{{ order.customer_name || order.buyer_name }}</div>
                <div class="text-xs font-semibold text-gray-600 leading-relaxed">{{ shippingAddress }}</div>
              </div>

              <div class="flex flex-col sm:flex-row items-center gap-2">
                <div class="w-full sm:flex-1 p-3 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center gap-2.5">
                  <div
                    class="size-8 rounded-lg bg-white flex items-center justify-center text-primary border border-gray-100 shrink-0">
                    <Icon icon="ph:whatsapp-logo-bold" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-[8px] font-black text-gray-400 tracking-widest capitalize">{{ t('seller_order_detail.whatsapp', 'Telepon / WA') }}</div>
                    <div class="text-xs font-black text-navy truncate">{{ order.customer_phone || order.buyer_phone || '-' }}</div>
                  </div>
                </div>
                <div class="w-full sm:flex-1 p-3 bg-gray-50/70 rounded-xl border border-gray-100 flex items-center gap-2.5">
                  <div
                    class="size-8 rounded-lg bg-white flex items-center justify-center text-primary border border-gray-100 shrink-0">
                    <Icon icon="ph:envelope-simple-bold" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-[8px] font-black text-gray-400 tracking-widest capitalize">{{ t('seller_order_detail.email', 'Email') }}</div>
                    <div class="text-xs font-black text-navy truncate">{{ order.customer_email || order.buyer_email || '-' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Timeline -->
          <div
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5 group hover:border-primary/20 transition-all duration-300">
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon icon="ph:clock-counter-clockwise-bold" class="text-navy group-hover:text-primary text-lg" />
              </div>
              <h2 class="text-base font-black text-navy tracking-tight">{{ t('seller_order_detail.timeline', 'Timeline Pesanan') }}</h2>
            </div>

            <div class="space-y-4 relative pl-2">
              <div class="absolute left-[17px] top-3 bottom-3 w-0.5 bg-gray-100"></div>

              <div v-for="(step, idx) in logSteps" :key="idx" class="flex items-start gap-4 relative">
                <div
                  class="size-8 rounded-xl flex items-center justify-center text-xs shrink-0 z-10 transition-all shadow-xs"
                  :class="step.active ? 'bg-navy text-primary ring-4 ring-navy/5' : 'bg-gray-100 text-gray-300'">
                  <Icon :icon="step.icon" />
                </div>
                <div class="flex-1 pt-1">
                  <div class="text-xs font-black text-navy leading-none mb-1" :class="!step.active && 'opacity-40'">
                    {{ step.label }}
                  </div>
                  <div class="text-[10px] font-medium text-gray-400 leading-tight"
                    :class="!step.active && 'opacity-40'">
                    {{ step.desc }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Customer Info, Payment Status & Status Update (4 of 12) -->
      <div class="xl:col-span-4 space-y-6">
        <!-- Customer Profile Card -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-center">
          <div class="h-20 bg-gradient-to-r from-navy via-navy to-navy/90 relative">
            <div class="absolute inset-0 bg-primary/10 opacity-30"></div>
          </div>
          <div class="px-6 pb-6 -mt-10 relative z-10">
            <div
              class="size-20 rounded-2xl bg-white p-1 border-4 border-white shadow-lg mx-auto mb-3 overflow-hidden">
              <img :src="useImageOrDefault(null, order.customer_name || order.buyer_name)" class="w-full h-full object-cover rounded-xl" />
            </div>
            <h3 class="text-lg font-black text-navy tracking-tight mb-1">{{ order.customer_name || order.buyer_name }}</h3>
            <div class="text-xs font-bold text-gray-400 mb-3">{{ order.customer_email || order.buyer_email || '-' }}</div>
            <div
              class="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[9px] font-black text-gray-500 tracking-widest inline-block shadow-2xs">
              {{ t('seller_order_detail.customer', 'Pembeli') }}</div>
          </div>

          <div class="px-6 pb-6 space-y-3">
            <BaseButton variant="white" block @click="handleContactBuyer"
              class="h-11 font-black text-xs !rounded-xl tracking-wider !border-gray-200 hover:!border-primary hover:!bg-primary/5 hover:!text-primary transition-all shadow-2xs">
              <Icon icon="ph:chat-circle-dots-bold" class="text-base mr-2 text-primary" />
              {{ t('seller_order_detail.contact_buyer', 'Hubungi via WhatsApp') }}
            </BaseButton>
          </div>
        </div>

        <!-- Payment Details, Order Status & Status Action Card -->
        <div class="bg-navy rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm space-y-6">
          <div class="absolute top-0 left-0 size-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none"></div>
          
          <div class="relative z-10 space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-[9px] font-black tracking-widest text-primary capitalize">{{ t("seller_order_detail.transaction_status") }}</div>
                <h3 class="text-base font-black text-white mt-0.5">{{ t("seller_order_detail.status_and_payment") }}</h3>
              </div>
              <Icon icon="ph:receipt-bold" class="text-primary text-2xl" />
            </div>

            <div class="space-y-3 text-xs">
              <div class="flex items-center justify-between py-2 border-b border-white/10">
                <span class="text-gray-400 font-bold">{{ t("seller_order_detail.order_status") }}</span>
                <span :class="getStatusClass(order.status)"
                  class="px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider border shadow-2xs">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-white/10">
                <span class="text-gray-400 font-bold">Metode Bayar</span>
                <span class="font-black text-white">{{ order.payment_method || 'Chat / Manual' }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-white/10">
                <span class="text-gray-400 font-bold">{{ t("seller_orders.total_billed") }}</span>
                <span class="font-black text-primary text-sm">Rp {{ formatPrice(order.amount || order.total_amount) }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-white/10">
                <span class="text-gray-400 font-bold">{{ t("seller_orders.payment_status_label") }}</span>
                <span v-if="order.status === 'done' || order.status === 'PAID' || order.payment_status === 'paid'"
                  class="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  LUNAS
                </span>
                <span v-else-if="order.proof_url || order.status === 'AWAITING_VERIFICATION' || order.status === 'processing'"
                  class="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  DIPROSES
                </span>
                <span v-else
                  class="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  BELUM LUNAS
                </span>
              </div>
            </div>

            <!-- Status Updater Controls -->
            <div class="pt-2 space-y-2 border-t border-white/10">
              <label class="block text-[10px] font-black text-gray-300 capitalize tracking-wider">Perbarui Status Pesanan:</label>
              <div class="flex items-center gap-2">
                <div class="flex-1">
                  <BaseSelect v-model="statusUpdate" :items="statusOptions"
                    class="!h-10 !rounded-xl bg-white/10 border-white/20 text-white text-xs" hide-label />
                </div>
                <BaseButton variant="primary" icon="ph:arrow-clockwise-bold" @click="handleUpdateStatus"
                  :loading="isUpdating"
                  class="h-10 px-4 font-black tracking-wider text-xs shadow-sm shrink-0 !rounded-xl">
                  Simpan
                </BaseButton>
              </div>
            </div>

            <!-- Proof of Payment Display (if exists) -->
            <div v-if="order.proof_url" class="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <div class="text-[10px] font-bold text-gray-300 flex items-center justify-between">
                <span>Foto Bukti Transfer:</span>
                <span v-if="order.sender_name" class="text-primary truncate">a.n {{ order.sender_name }}</span>
              </div>
              <div class="relative group aspect-[16/9] rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center cursor-pointer"
                @click="showProofModal = true">
                <img :src="order.proof_url" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Icon icon="ph:magnifying-glass-plus-bold" class="text-white text-xl" />
                  <span class="text-xs font-bold text-white">Perbesar Bukti</span>
                </div>
              </div>
            </div>

            <!-- Action: Mark / Confirm Paid Button -->
            <div v-if="order.status !== 'done' && order.payment_status !== 'paid'" class="pt-2">
              <BaseButton variant="primary" block icon="ph:check-circle-bold"
                @click="handleApprovePayment" :loading="isApproving"
                class="h-11 font-black text-xs tracking-wider shadow-lg shadow-primary/20">
                Tandai Pesanan Selesai / Lunas
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Proof Modal Zoom -->
    <div v-if="showProofModal" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4">
      <button @click="showProofModal = false" class="absolute right-5 top-5 text-white/80 hover:text-white transition">
        <Icon icon="ph:x-bold" class="text-3xl" />
      </button>
      <div class="max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl">
        <img :src="order?.proof_url" class="max-h-[85vh] w-auto rounded-2xl object-contain mx-auto" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import { useDashboardI18n } from '~/composables/useDashboardI18n'

definePageMeta({ layout: 'dashboard' })


useHead({ title: computed(() => `${t('seller_order_detail.title', 'Detail Pesanan')} - Archeris Dashboard`) })

const route = useRoute()
const { get, put } = useApi()
const toast = useToast()

const order = ref(null)
const isLoading = ref(true)
const isUpdating = ref(false)
const isApproving = ref(false)
const showProofModal = ref(false)
const statusUpdate = ref('')

const statusOptions = computed(() => [
  { title: t('seller_order_detail.status_pending', 'Menunggu'), value: 'pending' },
  { title: t('seller_order_detail.status_processing', 'Diproses'), value: 'processing' },
  { title: t('seller_order_detail.status_shipping', 'Dikirim'), value: 'shipped' },
  { title: t('seller_order_detail.status_completed', 'Selesai'), value: 'done' },
  { title: t('seller_order_detail.status_cancelled', 'Dibatalkan'), value: 'cancelled' }
])

const fetchOrder = async () => {
  isLoading.value = true
  try {
    const res = await get(`/orders/${route.params.id}`)
    order.value = res.data || res.order || res
    statusUpdate.value = order.value?.status || 'pending'
  } catch (error) {
    console.error('Failed to fetch order:', error)
    toast.error(t('seller_orders.fetch_error', 'Gagal mengambil rincian pesanan'))
  } finally {
    isLoading.value = false
  }
}

const handleApprovePayment = async () => {
  isApproving.value = true
  try {
    const api = useApi()
    await api.patch(`/orders/${order.value?.uuid || route.params.id}/approve-payment`)
    toast.success('Pesanan berhasil ditandai LUNAS & SELESAI!')
    await fetchOrder()
  } catch (error) {
    toast.error(error?.data?.error || error?.response?.data?.error || 'Gagal mengonfirmasi pembayaran')
  } finally {
    isApproving.value = false
  }
}

const handleUpdateStatus = async () => {
  if (!statusUpdate.value) return
  isUpdating.value = true
  try {
    await put(`/orders/${order.value?.uuid || route.params.id}/status`, { status: statusUpdate.value })
    toast.success('Status pesanan berhasil diperbarui')
    await fetchOrder()
  } catch (error) {
    toast.error('Gagal memperbarui status')
  } finally {
    isUpdating.value = false
  }
}

const handleContactBuyer = () => {
  const phoneRaw = order.value?.customer_phone || order.value?.buyer_phone
  if (!phoneRaw) {
    toast.error('Nomor WhatsApp pembeli tidak tersedia')
    return
  }
  const digits = String(phoneRaw).replace(/\D/g, '')
  if (!digits) {
    toast.error('Format nomor WhatsApp pembeli tidak valid')
    return
  }
  const url = `https://wa.me/${digits}`
  window.open(url, '_blank')
}

const logSteps = computed(() => [
  { label: t('seller_order_detail.step_received', 'Masuk'), desc: t('seller_order_detail.step_received_desc', 'Pesanan diterima'), icon: 'ph:file-text-bold', active: true },
  { label: t('seller_order_detail.step_verified', 'Terverifikasi'), desc: t('seller_order_detail.step_verified_desc', 'Pembayaran valid'), icon: 'ph:shield-check-bold', active: order.value?.payment_status === 'paid' || order.value?.status === 'done' },
  { label: t('seller_order_detail.step_processing', 'Diproses'), desc: t('seller_order_detail.step_processing_desc', 'Sedang dikemas'), icon: 'ph:package-bold', active: ['processing', 'shipped', 'done', 'completed'].includes(order.value?.status) },
  { label: t('seller_order_detail.step_shipping', 'Dikirim'), desc: t('seller_order_detail.step_shipping_desc', 'Dalam perjalanan'), icon: 'ph:truck-bold', active: ['shipped', 'done', 'completed'].includes(order.value?.status) },
  { label: t('seller_order_detail.step_completed', 'Selesai'), desc: t('seller_order_detail.step_completed_desc', 'Tiba di pembeli'), icon: 'ph:check-box-bold', active: ['done', 'completed'].includes(order.value?.status) }
])

const shippingAddress = computed(() => {
  return order.value?.shipping_address || 'Alamat tidak disertakan'
})

const formatDate = (val) => {
  if (!val) return '-'
  return new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatPrice = (val) => new Intl.NumberFormat('id-ID').format(val || 0)

const getStatusLabel = (status) => {
  const labels = {
    pending: t('seller_order_detail.status_pending', 'Menunggu'),
    processing: t('seller_order_detail.status_processing', 'Diproses'),
    shipped: t('seller_order_detail.status_shipping', 'Dikirim'),
    shipping: t('seller_order_detail.status_shipping', 'Dikirim'),
    done: t('seller_order_detail.status_completed', 'Selesai'),
    completed: t('seller_order_detail.status_completed', 'Selesai'),
    cancelled: t('seller_order_detail.status_cancelled', 'Dibatalkan')
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'shipped':
    case 'shipping': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    case 'done':
    case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
    default: return 'bg-white/10 text-white/40 border-white/20'
  }
}

onMounted(fetchOrder)
</script>

<style scoped>
@media print {
  .BaseButton,
  .BaseSelect,
  .sticky {
    display: none !important;
  }
  .xl\:col-span-4 {
    display: none !important;
  }
  .xl\:col-span-8 {
    width: 100% !important;
  }
}
</style>