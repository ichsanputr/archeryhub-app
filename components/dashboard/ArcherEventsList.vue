<template>
  <div class="space-y-6">
    <!-- Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-20"
        style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
      </div>

      <!-- Decorative Background Elements -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

      <!-- Header Content -->
      <div class="relative p-6 sm:p-8">
        <div class="flex items-start gap-4">
          <!-- Icon Badge -->
          <div
            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
            <Icon icon="ph:calendar-blank" class="text-primary text-2xl" />
          </div>
          <div>
            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">Event Saya</h1>
            <p class="text-slate-300 text-sm mt-1">Event yang Anda ikuti</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filter Card -->
    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-grow w-full">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" placeholder="Cari nama event, lokasi, atau kode..."
          label="Pencarian" />
      </div>
      <BaseButton variant="white" icon="ph:funnel" @click="resetFilters" class="h-11">
        Reset
      </BaseButton>
    </div>

    <!-- Events List / Table -->
    <div class="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Informasi
                Event
              </th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Jadwal & Lokasi
              </th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status
                Pendaftaran
              </th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status
                Pembayaran
              </th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Registrasi QR
              </th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td :colspan="6" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center justify-center gap-4">
                  <div class="h-12 w-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                  <div class="flex flex-col gap-1">
                    <p class="text-navy font-bold">Memuat Event...</p>
                    <p class="text-xs text-gray-400 font-medium">Menyiapkan data event Anda</p>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="filteredEvents.length === 0">
              <td :colspan="6" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                  <div class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                    <Icon icon="ph:calendar-x" class="text-4xl" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-lg font-bold text-navy">Belum Ada Event</p>
                    <p class="text-sm text-gray-500 font-medium leading-relaxed">
                      {{ searchQuery ? 'Tidak ada event yang sesuai dengan pencarian Anda.' : 'Anda belum terdaftar di event manapun.' }}
                    </p>
                  </div>
                  <BaseButton v-if="searchQuery" variant="outline" size="sm" @click="resetFilters">
                    Hapus Filter
                  </BaseButton>
                  <BaseButton v-else to="/events" variant="primary" size="sm" icon="ph:magnifying-glass">
                    Cari Event
                  </BaseButton>
                </div>
              </td>
            </tr>

            <!-- Data Rows -->
            <tr v-else v-for="event in filteredEvents" :key="event.id"
              class="group hover:bg-gray-50/50 transition-all duration-200">
              <td class="px-6 py-5">
                <div class="flex items-center gap-4">
                  <div
                    class="h-12 w-12 rounded-xl bg-navy/5 overflow-hidden flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                    <img v-if="event.logo_url" :src="event.logo_url" class="w-full h-full object-cover" />
                    <Icon v-else icon="ph:trophy-bold"
                      class="text-navy/20 text-2xl group-hover:text-primary transition-colors" />
                  </div>
                  <div class="min-w-0">
                    <div
                      class="text-[15px] font-bold text-navy truncate group-hover:text-primary-dark transition-colors">
                      {{ event.name }}</div>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-[11px] font-bold text-gray-400 tracking-wide uppercase">{{ event.code }}</span>
                      <span class="text-gray-300">•</span>
                      <span class="text-[11px] font-bold text-primary-dark uppercase tracking-wide">{{
                        event.location_type || 'Event' }}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center gap-2 text-navy text-sm font-semibold">
                    <Icon icon="ph:calendar-blank" class="text-gray-400" />
                    {{ formatDate(event.start_date) }}
                  </div>
                  <div class="flex items-center gap-2 text-gray-500 text-xs font-medium">
                    <Icon icon="ph:map-pin" class="text-gray-400" />
                    <span class="truncate max-w-[150px]">{{ event.venue }}</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <span :class="getStatusClass(event.participant_status)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border">
                  <span :class="getStatusDotClass(event.participant_status)" class="h-1.5 w-1.5 rounded-full"></span>
                  {{ getStatusLabel(event.participant_status) }}
                </span>
              </td>
              <td class="px-6 py-5">
                <span :class="getPaymentStatusClass(event.payment_status)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border">
                  <span :class="getPaymentStatusDotClass(event.payment_status)" class="h-1.5 w-1.5 rounded-full"></span>
                  {{ getPaymentStatusLabel(event.payment_status) }}
                </span>
              </td>
              <td class="px-6 py-5">
                <BaseButton v-if="event.participant_status === 'Terdaftar' && event.qr_raw"
                  @click="showQRDialog(event)"
                  variant="primary" size="sm" icon="ph:qr-code" class="h-9 font-bold">
                  Lihat QR
                </BaseButton>
                <span v-else class="text-xs text-gray-400 font-medium">-</span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <BaseButton :to="`/events/${event.slug || event.id}`" variant="primary" size="sm"
                    class="h-9 font-bold">
                    Lihat
                  </BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Card Footer -->
      <div v-if="filteredEvents.length > 0"
        class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="text-xs text-gray-500 font-bold uppercase tracking-wider">
          Menampilkan <span class="text-navy">{{ filteredEvents.length }}</span> dari <span class="text-navy">{{
            events.length }}</span> Event
        </span>
        <div class="flex items-center gap-2">
          <BaseButton variant="white" size="sm" disabled class="h-9 min-w-[100px]">
            Sebelumnya
          </BaseButton>
          <div class="flex gap-1">
            <button
              class="h-9 w-9 rounded-lg bg-primary text-navy font-bold text-xs shadow-sm shadow-primary/20">1</button>
          </div>
          <BaseButton variant="white" size="sm" disabled class="h-9 min-w-[100px]">
            Berikutnya
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- QR Code Dialog - Fullscreen -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0" enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showQR" class="fixed inset-0 z-[9999] bg-white"
          @click="showQR = false">
          <!-- Content Container -->
          <div class="relative h-full w-full flex items-center justify-center p-4" @click.stop>
            <!-- Close Button -->
            <button @click="showQR = false"
              class="absolute top-4 right-4 h-10 w-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
              <Icon icon="ph:x" class="text-navy text-xl" />
            </button>

            <!-- QR Code Content -->
            <div class="flex flex-col items-center space-y-6 max-w-md w-full">
              <!-- Archer Name -->
              <div class="text-center space-y-2">
                <h3 class="text-2xl sm:text-3xl font-black text-navy">{{ user?.name || 'Archer' }}</h3>
                <p class="text-sm sm:text-base text-gray-600 font-semibold">{{ selectedEvent?.name }}</p>
              </div>

              <!-- QR Code -->
              <div class="bg-white p-4 sm:p-6 rounded-2xl border-2 border-gray-200 shadow-lg">
                <qrcode-vue :value="selectedEvent?.qr_raw || 'N/A'" :size="isMobile ? 280 : 350" level="H" render-as="svg" />
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import QrcodeVue from 'qrcode.vue'
import { useToast } from '~/composables/useToast'
import { useAuth } from '~/composables/useAuth'

const { get } = useApi()
const toast = useToast()
const { user } = useAuth()

const searchQuery = ref('')
const events = ref([])
const isLoading = ref(true)
const showQR = ref(false)
const selectedEvent = ref(null)

// Check if mobile
const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth < 640
  }
  return false
})

const fetchEvents = async () => {
  isLoading.value = true
  try {
    const response = await get('/archers/my/events')
    events.value = response?.events || []
  } catch (error) {
    console.error('Failed to fetch events:', error)
    const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || 'Gagal memuat daftar event'
    toast.error(errorMessage)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})

const resetFilters = () => {
  searchQuery.value = ''
}

const showQRDialog = (event) => {
  selectedEvent.value = event
  showQR.value = true
}

const downloadQR = () => {
  // Get the SVG element from the QR code
  const svg = document.querySelector('.bg-gray-50 svg')
  if (!svg) return

  // Create a canvas to convert SVG to image
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const svgData = new XMLSerializer().serializeToString(svg)
  const img = new Image()
  
  img.onload = () => {
    canvas.width = 300
    canvas.height = 300
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(img, 0, 0)
    
    // Download the image
    const link = document.createElement('a')
    link.download = `qr-${selectedEvent.value?.name || 'code'}.png`
    link.href = canvas.toDataURL()
    link.click()
  }
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q ||
      (event.name?.toLowerCase() || '').includes(q) ||
      (event.venue?.toLowerCase() || '').includes(q) ||
      (event.code?.toLowerCase() || '').includes(q) ||
      (event.location?.toLowerCase() || '').includes(q)
    return matchesSearch
  })
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const getPaymentStatusClass = (status) => {
  if (!status) return 'bg-gray-50 text-gray-500 border-gray-100'
  const classes = {
    'menunggu_acc': 'bg-blue-50 text-blue-700 border-blue-100',
    'belum_lunas': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'lunas': 'bg-green-50 text-green-700 border-green-100',
    'pending': 'bg-amber-50 text-amber-700 border-amber-100',
    'paid': 'bg-green-50 text-green-700 border-green-100',
    'failed': 'bg-red-50 text-red-700 border-red-100'
  }
  return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const getPaymentStatusDotClass = (status) => {
  if (!status) return 'bg-gray-300'
  const classes = {
    'menunggu_acc': 'bg-blue-500',
    'belum_lunas': 'bg-yellow-500',
    'lunas': 'bg-green-500',
    'pending': 'bg-amber-500',
    'paid': 'bg-green-500',
    'failed': 'bg-red-500'
  }
  return classes[status] || 'bg-gray-300'
}

const getPaymentStatusLabel = (status) => {
  if (!status) return '-'
  const labels = {
    'menunggu_acc': 'Menunggu ACC',
    'belum_lunas': 'Belum Lunas',
    'lunas': 'Lunas',
    'pending': 'Pending',
    'paid': 'Terbayar',
    'failed': 'Gagal'
  }
  return labels[status] || status
}

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-50 text-gray-500 border-gray-100'
  const classes = {
    'Menunggu Acc': 'bg-amber-50 text-amber-700 border-amber-100',
    'Terdaftar': 'bg-green-50 text-green-700 border-green-100',
    'pending': 'bg-amber-50 text-amber-700 border-amber-100',
    'approved': 'bg-green-50 text-green-700 border-green-100',
    'rejected': 'bg-red-50 text-red-700 border-red-100'
  }
  return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const getStatusDotClass = (status) => {
  if (!status) return 'bg-gray-300'
  const classes = {
    'Menunggu Acc': 'bg-amber-500',
    'Terdaftar': 'bg-green-500',
    'pending': 'bg-amber-500',
    'approved': 'bg-green-500',
    'rejected': 'bg-red-500'
  }
  return classes[status] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
  if (!status) return 'Belum Daftar'
  const labels = {
    'Menunggu Acc': 'Menunggu ACC',
    'Terdaftar': 'Terdaftar',
    'pending': 'Menunggu ACC',
    'approved': 'Diterima',
    'rejected': 'Ditolak'
  }
  return labels[status] || status
}
</script>
