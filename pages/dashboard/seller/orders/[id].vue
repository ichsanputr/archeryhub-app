<template>
  <div class="space-y-6 pb-20">
    <!-- Optimized Dashboard Header -->
    <div
      class="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-navy text-white shadow-sm transition-all duration-300">
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.15;"></div>
      <div class="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>

      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <NuxtLink to="/dashboard/seller/orders"
            class="size-10 sm:size-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-sm hover:bg-white/20 transition-all">
            <Icon icon="ph:arrow-left-bold" class="text-primary text-xl" />
          </NuxtLink>
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-0.5">
               <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-tight capitalize">Detail pesanan</h1>
              <div v-if="order" :class="getStatusClass(order.status)"
                class="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border border-current shadow-sm backdrop-blur-md">
                {{ getStatusLabel(order.status) }}
              </div>
            </div>
            <div class="text-slate-400 text-[10px] sm:text-xs font-bold tracking-wide">#{{ (order?.id || '').slice(0,
              8).toUpperCase() }} • {{ formatDate(order?.created_at) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div v-if="isLoading"
      class="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border-2 border-dashed border-gray-100 shadow-sm">
      <div class="relative size-16">
        <div class="absolute inset-0 rounded-2xl bg-primary/10 animate-ping"></div>
        <div
          class="relative size-full rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
          <LoadingSpinner size="md" />
        </div>
      </div>
      <div class="text-center">
        <div class="text-navy font-black tracking-widest text-[10px] uppercase">Menghubungkan</div>
        <div class="text-gray-400 text-[9px] font-bold">Sinkronisasi data...</div>
      </div>
    </div>

    <div v-else-if="!order"
      class="min-h-[400px] flex flex-col items-center justify-center gap-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden relative">
      <div class="absolute top-0 inset-x-0 h-1.5 bg-red-500"></div>
      <div class="size-20 bg-red-50 rounded-3xl flex items-center justify-center mb-1 border border-red-100">
        <Icon icon="ph:warning-circle-bold" class="text-4xl text-red-500" />
      </div>
      <div class="text-center space-y-1">
        <div class="text-navy font-black text-xl tracking-tight">Pesanan Tidak Ditemukan</div>
        <div class="text-gray-400 text-xs font-medium max-w-[240px] mx-auto">Tautan mungkin sudah tidak valid atau telah dihapus.</div>
      </div>
      <NuxtLink to="/dashboard/seller/orders">
        <BaseButton variant="primary" size="sm" icon="ph:arrow-left-bold"
          class="h-11 px-6 !rounded-xl font-black tracking-widest uppercase text-[10px] shadow-sm">Kembali</BaseButton>
      </NuxtLink>
    </div>

    <div v-else class="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <!-- Left Column: Order Items & Shipping (8 of 12) -->
      <div class="xl:col-span-8 space-y-6">

        <!-- Order Status / Action Banner -->
        <div
          class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-primary/20 transition-all duration-300">
          <div class="flex items-center gap-5 w-full">
            <div>
              <div class="text-navy font-black text-lg tracking-tight">Status: {{ getStatusLabel(order.status) }}</div>
              <div class="text-[11px] font-bold text-gray-400 max-w-sm leading-tight">{{ getStatusMessage(order.status)
                }}</div>
            </div>
          </div>

          <div class="flex items-center gap-2 w-full md:w-auto">
            <div class="relative flex-1 md:w-44">
              <BaseSelect v-model="statusUpdate" :items="statusOptions"
                class="!h-11 !rounded-xl bg-gray-50 border-gray-100 text-xs" hide-label />
            </div>
            <BaseButton variant="primary" icon="ph:arrow-clockwise-bold" @click="handleUpdateStatus"
              :loading="isUpdating"
              class="h-11 px-6 font-black uppercase tracking-widest text-[10px] shadow-sm active:scale-95 transition-all shrink-0">
              Update
            </BaseButton>
          </div>
        </div>

        <!-- Order Items List -->
        <div class="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
          <div class="p-6 sm:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
            <div class="flex items-center gap-4">
              <div class="size-10 rounded-xl bg-navy text-white flex items-center justify-center shadow-sm">
                <Icon icon="ph:shopping-bag-bold" class="text-xl" />
              </div>
              <div>
                <h2 class="text-lg font-black text-navy tracking-tight">Item Pesanan</h2>
                <div class="text-[9px] text-gray-400 font-black uppercase tracking-widest">Total {{ order.items.length
                  }} Produk</div>
              </div>
            </div>
            <div class="hidden sm:block text-right">
              <div class="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Invoice</div>
              <div class="font-mono text-[11px] font-black text-navy opacity-60">INV/{{ new
                Date(order.created_at).getFullYear() }}/{{ (order.id || '').toUpperCase().slice(0, 6) }}</div>
            </div>
          </div>

          <div class="p-4 sm:p-8 space-y-4">
            <div v-for="item in order.items" :key="item.id"
              class="relative group p-4 sm:p-6 rounded-3xl border border-gray-50 hover:bg-gray-50/30 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6">
              <div
                class="size-24 sm:size-28 rounded-2xl bg-white p-1.5 border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                <img :src="useImageOrDefault(item.product_image)" class="w-full h-full object-cover rounded-xl" />
              </div>

              <div class="flex-1 text-center sm:text-left min-w-0 w-full">
                <div class="text-navy font-black text-base sm:text-lg tracking-tight truncate mb-2">{{ item.product_name
                  }}</div>
                <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <div
                    class="px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-[10px] font-bold text-gray-400 flex items-center gap-2">
                    <span class="text-primary font-black uppercase tracking-widest">Qty</span>
                    <span class="text-navy font-black">{{ item.quantity }}</span>
                  </div>
                  <div
                    class="px-3 py-1.5 bg-white rounded-lg border border-gray-100 text-[10px] font-bold text-gray-400 flex items-center gap-2">
                    <span class="text-primary font-black uppercase tracking-widest">Harga</span>
                    <span class="text-navy font-black">Rp {{ formatPrice(item.price) }}</span>
                  </div>
                </div>
              </div>

              <div
                class="text-center sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto">
                <div class="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Subtotal</div>
                <div class="text-lg font-black text-navy tracking-tight">
                  <span class="text-xs font-bold opacity-30">Rp</span> {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Price Summary Footer -->
          <div class="bg-navy p-8 sm:p-10 mt-2 relative overflow-hidden">
            <div class="absolute inset-x-0 top-0 h-px bg-white/5"></div>
            <div
              class="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 sm:gap-10 relative z-10">
              <div class="space-y-3 w-full sm:w-64">
                <div
                  class="flex justify-between items-center text-[10px] text-white/30 font-bold tracking-widest uppercase">
                  <span>Produk</span>
                  <span class="text-white/70">Rp {{ formatPrice(order.total_amount) }}</span>
                </div>
                <div
                  class="flex justify-between items-center text-[10px] text-white/30 font-bold tracking-widest uppercase">
                  <span>Layanan</span>
                  <span class="text-primary/80">FREE</span>
                </div>
                <div class="h-px bg-white/5 w-full"></div>
              </div>

              <div class="text-center sm:text-right">
                <div class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Total Pendapatan</div>
                <div class="text-3xl sm:text-4xl font-black tracking-tight text-primary">
                  <span class="text-lg font-bold opacity-30 mr-0.5 italic">Rp</span>{{ formatPrice(order.total_amount)
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Shipping & Logistics -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-6 group hover:border-primary/20 transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="size-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Icon icon="ph:navigation-arrow-bold" class="text-navy group-hover:text-primary" />
                </div>
                <h2 class="text-base font-black text-navy tracking-tight">Pengiriman</h2>
              </div>
              <BaseButton variant="white" size="xs" icon="ph:copy-bold"
                class="h-8 px-3 !rounded-lg text-[8px] font-black uppercase bg-gray-50 border-gray-100">Salin
              </BaseButton>
            </div>

            <div class="space-y-4">
              <div class="p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                <div class="text-[9px] font-black text-primary uppercase tracking-widest mb-1.5">Penerima</div>
                <div class="text-navy font-black text-base mb-0.5">{{ order.customer_name }}</div>
                <div class="text-[11px] font-bold text-gray-500 leading-tight">{{ order.shipping_address || 'Harap konfirmasi alamat' }}</div>
              </div>

              <div class="flex items-center gap-2">
                <div class="flex-1 p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center gap-2.5">
                  <div
                    class="size-8 rounded-lg bg-white flex items-center justify-center text-primary border border-gray-100">
                    <Icon icon="ph:phone-bold" class="text-sm" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-[8px] font-black text-gray-400 uppercase tracking-widest">WhatsApp</div>
                    <div class="text-[10px] font-black text-navy truncate">{{ order.customer_phone || '-' }}</div>
                  </div>
                </div>
                <div class="flex-1 p-3 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center gap-2.5">
                  <div
                    class="size-8 rounded-lg bg-white flex items-center justify-center text-primary border border-gray-100">
                    <Icon icon="ph:envelope-simple-bold" class="text-sm" />
                  </div>
                  <div class="min-w-0">
                    <div class="text-[8px] font-black text-gray-400 uppercase tracking-widest">Email</div>
                    <div class="text-[10px] font-black text-navy truncate">{{ (order.customer_email || '').split('@')[0]
                      }}...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-6 group hover:border-primary/20 transition-all duration-300">
            <div class="flex items-center gap-3">
              <div
                class="size-10 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <Icon icon="ph:clock-bold" class="text-navy group-hover:text-primary" />
              </div>
              <h2 class="text-base font-black text-navy tracking-tight">Timeline</h2>
            </div>

            <div class="space-y-4 relative ml-1">
              <div class="absolute left-4 top-2 bottom-2 w-px bg-gray-100 group-hover:bg-primary/10 transition-colors">
              </div>
              <div v-for="(step, idx) in logSteps" :key="idx" class="relative flex items-center gap-4 group/step">
                <div
                  class="size-8 rounded-full border-2 border-white shadow-sm z-10 flex items-center justify-center transition-all duration-500 shrink-0"
                  :class="step.active ? 'bg-primary text-navy scale-110' : 'bg-gray-100 text-gray-300'">
                  <Icon :icon="step.icon" class="text-xs" />
                </div>
                <div class="transition-all duration-300" :class="step.active ? 'translate-x-0.5' : 'opacity-40'">
                  <div class="text-[10px] font-black uppercase tracking-wider"
                    :class="step.active ? 'text-navy' : 'text-gray-400'">{{ step.label }}</div>
                  <div class="text-[9px] font-bold text-gray-400 hidden sm:block">{{ step.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Buyer & Meta (4 of 12) -->
      <div class="xl:col-span-4 space-y-6">

        <!-- Large Customer Card -->
        <div class="bg-white rounded-[2.5rem] p-1 border border-gray-100 shadow-sm overflow-hidden group">
          <div class="p-6 pb-8 flex flex-col items-center text-center relative">
            <div class="absolute top-0 inset-x-0 h-24 bg-navy rounded-b-[2rem] -z-0"></div>
            <div class="relative z-10">
              <div
                class="size-20 sm:size-24 rounded-[1.5rem] bg-white p-1.5 shadow-sm mb-4 transition-transform duration-500">
                <div
                  class="size-full rounded-2xl bg-primary/20 flex items-center justify-center text-primary text-2xl font-black border border-primary/10">
                  {{ order.customer_name?.charAt(0) || 'B' }}
                </div>
              </div>
              <h2 class="text-lg sm:text-xl font-black text-navy tracking-tight mb-1">{{ order.customer_name }}</h2>
              <div
                class="px-3 py-1 rounded-full bg-gray-50 border border-gray-100 text-[8px] font-black text-gray-400 uppercase tracking-widest inline-block shadow-sm">
                Loyal Customer</div>
            </div>
          </div>

          <div class="px-6 pb-8 space-y-3">
            <div class="grid grid-cols-2 gap-2">
              <div class="p-3 bg-gray-50/50 rounded-xl border border-gray-100 text-center">
                <div class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Order</div>
                <div class="text-lg font-black text-navy tracking-tight">12</div>
              </div>
              <div class="p-3 bg-gray-50/50 rounded-xl border border-gray-100 text-center">
                <div class="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Feedback</div>
                <div class="text-lg font-black text-primary tracking-tight">4.8★</div>
              </div>
            </div>

            <BaseButton variant="white" block @click="handleContactBuyer"
              class="h-11 font-black text-[10px] !rounded-xl tracking-widest uppercase !border-gray-100 hover:!border-primary hover:!bg-primary/5 hover:!text-primary transition-all">
              <Icon icon="ph:chat-circle-dots-bold" class="text-base mr-2" />
              Hubungi Pembeli
            </BaseButton>
          </div>
        </div>

        <!-- Payment Details Card -->
        <div class="bg-navy rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-sm sticky top-24">
          <div class="absolute top-0 left-0 size-32 bg-primary/10 blur-[40px] rounded-full"></div>
          <div class="relative z-10 space-y-6">
            <div class="flex items-center justify-between">
              <div class="text-[9px] font-black uppercase tracking-widest text-primary">Pembayaran</div>
              <Icon icon="ph:receipt-bold" class="text-primary text-lg" />
            </div>

            <div class="space-y-3">
              <div class="flex items-center justify-between py-1.5 border-b border-white/5">
                <span class="text-[10px] font-bold opacity-40 uppercase tracking-widest">Metode</span>
                <span class="text-[10px] font-black uppercase text-white/80">Digital Wallet</span>
              </div>
              <div class="flex items-center justify-between py-1.5 border-b border-white/5">
                <span class="text-[10px] font-bold opacity-40 uppercase tracking-widest">Status</span>
                <span
                  class="text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-primary/30 text-primary bg-primary/5 shadow-sm">ESCROW</span>
              </div>
              <div class="flex items-center justify-between py-1.5">
                <span class="text-[10px] font-bold opacity-40 uppercase tracking-widest">Waktu</span>
                <span class="text-[10px] font-black text-white/80">{{ formatDate(order.created_at).split('•')[0]
                  }}</span>
              </div>
            </div>

            <div class="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-md">
              <div class="text-[10px] font-medium text-white/50 italic leading-relaxed text-center">
                "Dana akan diteruskan ke Saldo anda setelah pesanan Selesai."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'

definePageMeta({ layout: 'dashboard' })
useHead({ title: 'Manajemen Pesanan - ArcheryHub Dashboard' })

const route = useRoute()
const { get, put } = useApi()
const toast = useToast()

const order = ref(null)
const isLoading = ref(true)
const isUpdating = ref(false)
const statusUpdate = ref('')

const statusOptions = [
  { title: 'Menunggu', value: 'pending' },
  { title: 'Diproses', value: 'processing' },
  { title: 'Dikirim', value: 'shipping' },
  { title: 'Selesai', value: 'completed' },
  { title: 'Batalkan', value: 'cancelled' }
]

const fetchOrder = async () => {
  isLoading.value = true
  try {
    const res = await get(`/orders/${route.params.id}`)
    order.value = res.data || res
    statusUpdate.value = order.value.status
  } catch (error) {
    console.error('Failed to fetch order:', error)
    toast.error('Gagal mengambil rincian pesanan')
  } finally {
    isLoading.value = false
  }
}

const handleUpdateStatus = async () => {
  if (!statusUpdate.value) return
  isUpdating.value = true
  try {
    await put(`/orders/${route.params.id}/status`, { status: statusUpdate.value })
    toast.success('Status pesanan berhasil diperbarui')
    await fetchOrder()
  } catch (error) {
    toast.error('Gagal memperbarui status')
  } finally {
    isUpdating.value = false
  }
}

const handleContactBuyer = () => {
  const phoneRaw = order.value?.customer_phone
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
  { label: 'Masuk', desc: 'Pesanan diterima', icon: 'ph:file-text-bold', active: true },
  { label: 'Terverifikasi', desc: 'Pembayaran valid', icon: 'ph:shield-check-bold', active: order.value?.payment_status === 'paid' },
  { label: 'Diproses', desc: 'Sedang dikemas', icon: 'ph:package-bold', active: ['processing', 'shipping', 'completed'].includes(order.value?.status) },
  { label: 'Dikirim', desc: 'Dalam perjalanan', icon: 'ph:truck-bold', active: ['shipping', 'completed'].includes(order.value?.status) },
  { label: 'Selesai', desc: 'Tiba di pembeli', icon: 'ph:check-box-bold', active: order.value?.status === 'completed' }
])

const formatDate = (val) => {
  if (!val) return '-'
  return new Date(val).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const formatPrice = (val) => new Intl.NumberFormat('id-ID').format(val || 0)

const getStatusLabel = (status) => {
  const labels = { pending: 'Menunggu', processing: 'Diproses', shipping: 'Dikirim', completed: 'Selesai', cancelled: 'Dibatalkan' }
  return labels[status] || status
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    case 'processing': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    case 'shipping': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20'
    case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20'
    default: return 'bg-white/10 text-white/40 border-white/20'
  }
}

const getStatusBgClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-50 text-amber-600'
    case 'processing': return 'bg-blue-50 text-blue-600'
    case 'shipping': return 'bg-purple-50 text-purple-600'
    case 'completed': return 'bg-green-50 text-green-600'
    case 'cancelled': return 'bg-red-50 text-red-600'
    default: return 'bg-gray-50 text-gray-400'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return 'ph:clock-bold'
    case 'processing': return 'ph:package-bold'
    case 'shipping': return 'ph:truck-bold'
    case 'completed': return 'ph:check-circle-bold'
    case 'cancelled': return 'ph:x-circle-bold'
    default: return 'ph:info-bold'
  }
}

const getStatusMessage = (status) => {
  switch (status) {
    case 'pending': return 'Harap segera proses pesanan ini.'
    case 'processing': return 'Anda sedang mengemas produk ini.'
    case 'shipping': return 'Paket sedang dalam perjalanan.'
    case 'completed': return 'Transaksi sukses, dana akan masuk ke saldo.'
    case 'cancelled': return 'Pesanan batal. Stok telah dikembalikan.'
    default: return 'Informasi pesanan tersedia di bawah.'
  }
}

onMounted(fetchOrder)
</script>

<style scoped>
@media print {

  .pb-24,
  .BaseButton,
  .BaseSelect,
  .sticky {
    display: none !important;
  }

  .space-y-8 {
    margin: 0 !important;
  }

  .xl\:col-span-4 {
    display: none !important;
  }

  .xl\:col-span-8 {
    width: 100% !important;
  }
}
</style>
