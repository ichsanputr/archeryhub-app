<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-navy text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>

      <!-- Decorative Background Elements (Glow) -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

      <!-- Header Content -->
      <div class="relative p-5 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center sm:items-start gap-4 flex-1">
            <!-- Icon Badge -->
            <div
              class="size-12 sm:size-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
              <Icon icon="ph:calendar-blank-bold" class="text-primary text-xl sm:text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="min-w-0">
              <h1 class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                Event Saya
              </h1>
              <p class="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-1 sm:line-clamp-none">
                Pantau progres dan hasil kompetisi yang Anda ikuti
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Club Invitation Notification Alert -->
    <div v-if="invitations.length > 0"
      class="flex items-center justify-between bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-sm">
      <div class="flex items-center gap-3">
        <Icon icon="ph:bell-ringing-bold" class="text-amber-500 text-xl" />
        <div>
          <h3 class="font-bold text-navy text-sm">Pemberitahuan Baru</h3>
          <p class="text-amber-700 text-xs mt-0.5">Anda memiliki {{ invitations.length }} undangan klub baru yang belum
            direspon.</p>
        </div>
      </div>
      <BaseButton :to="`/dashboard/${userPersona}/notifications`" variant="white" size="sm"
        class="h-9 px-4 font-black text-[10px] uppercase tracking-wider text-amber-700 border-amber-200">
        Lihat Detail
      </BaseButton>
    </div>

    <!-- Search & Filter Card -->
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-grow w-full">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass-bold"
          placeholder="Cari nama event, lokasi, atau kode..." label="Pencarian" />
      </div>
      <BaseButton variant="white" icon="ph:funnel-bold" @click="resetFilters"
        class="h-11 font-black uppercase tracking-widest text-xs">
        Reset
      </BaseButton>
    </div>

    <!-- Events List / Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i"
        class="bg-white rounded-3xl border border-slate-100 p-6 space-y-8 animate-pulse shadow-sm">
        <!-- Card Header Skeleton -->
        <div class="flex items-start gap-4">
          <div class="size-16 sm:size-20 rounded-2xl bg-slate-100 italic shrink-0"></div>
          <div class="flex-1 space-y-3">
            <div class="flex gap-2">
              <div class="h-4 w-12 bg-slate-100 rounded-lg"></div>
              <div class="h-4 w-16 bg-slate-100 rounded-lg"></div>
            </div>
            <div class="h-5 w-full bg-slate-100 rounded-xl"></div>
            <div class="h-5 w-2/3 bg-slate-100 rounded-xl"></div>
          </div>
        </div>

        <!-- Card Body Skeleton -->
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-xl bg-slate-100"></div>
            <div class="h-4 w-1/2 bg-slate-100 rounded-lg"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="size-8 rounded-xl bg-slate-100"></div>
            <div class="h-4 w-2/3 bg-slate-100 rounded-lg"></div>
          </div>
        </div>

        <!-- Status Badges Skeleton -->
        <div class="flex gap-2">
          <div class="h-8 w-24 bg-slate-100 rounded-xl"></div>
          <div class="h-8 w-24 bg-slate-100 rounded-xl"></div>
        </div>

        <!-- Footer Skeleton -->
        <div class="pt-6 border-t border-slate-50 flex gap-3">
          <div class="h-11 flex-1 bg-slate-100 rounded-xl"></div>
          <div class="size-11 bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    </div>

    <div v-else-if="filteredEvents.length === 0" class="bg-white border border-slate-100 rounded-3xl p-12 text-center">
      <div class="max-w-xs mx-auto space-y-6">
        <div class="size-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto">
          <Icon icon="ph:calendar-x-bold" class="text-4xl" />
        </div>
        <div class="space-y-2">
          <p class="text-lg font-black text-navy">Belum Ada Event</p>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">
            {{ emptyStateMessage }}
          </p>
        </div>
        <BaseButton v-if="searchQuery" variant="outline" size="sm" @click="resetFilters" class="w-full">
          Hapus Filter
        </BaseButton>
        <BaseButton v-else to="/events" variant="primary" size="sm" icon="ph:magnifying-glass-bold" class="w-full">
          Cari Event
        </BaseButton>
      </div>
    </div>

    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="event in filteredEvents" :key="event.id"
          class="group bg-white rounded-3xl border border-slate-100 p-6 flex flex-col shadow-sm hover:shadow-sm hover:border-primary/20 transition-all duration-300 relative overflow-hidden">

          <!-- Decorative Background -->
          <div
            class="absolute -right-4 -bottom-4 size-24 bg-slate-50/50 rounded-full blur-2xl group-hover:bg-primary/5 transition-colors">
          </div>

          <!-- Card Header -->
          <div class="flex items-center gap-4 mb-4">
            <div
              class="size-14 sm:size-16 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-primary/20 transition-all">
              <img v-if="event.logo_url" :src="event.logo_url" class="size-full object-cover" />
              <Icon v-else icon="ph:trophy-bold"
                class="text-2xl text-slate-300 group-hover:text-primary transition-colors" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-1.5 py-0.5 bg-navy text-primary rounded-[4px] text-[8px] font-black uppercase tracking-widest">{{
                    event.code?.toUpperCase() }}</span>
              </div>
              <h3
                class="text-base font-black text-navy leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {{ event.name }}
              </h3>
            </div>
          </div>

          <!-- Card Body -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="flex items-start gap-2">
              <div class="size-7 rounded-lg bg-slate-50 flex items-center justify-center text-primary shrink-0">
                <Icon icon="ph:calendar-blank-bold" class="text-xs" />
              </div>
              <div class="min-w-0">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0">Jadwal</p>
                <p class="text-xs font-bold text-navy truncate">{{ formatDate(event.start_date) }}</p>
              </div>
            </div>

            <div class="flex items-start gap-2">
              <div class="size-7 rounded-lg bg-slate-50 flex items-center justify-center text-primary shrink-0">
                <Icon icon="ph:map-pin-bold" class="text-xs" />
              </div>
              <div class="min-w-0">
                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0">Lokasi</p>
                <p class="text-xs font-bold text-navy truncate">{{ event.venue }}</p>
              </div>
            </div>
          </div>

          <!-- Status Badge (Consolidated) -->
          <div class="mb-5">
            <div :class="getMainStatusClass(event)"
              class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm">
              <span :class="getMainStatusDotClass(event)" class="size-1.5 rounded-full"></span>
              {{ getMainStatusLabel(event) }}
            </div>
          </div>

          <!-- Card Footer -->
          <div class="mt-auto pt-4 border-t border-slate-50 flex items-center gap-3">
            <BaseButton :to="`/dashboard/archer/events/${event.slug || event.id}/my-registration`" variant="primary"
              size="sm"
              class="flex-1 font-black uppercase tracking-widest text-[10px] h-10 shadow-sm shadow-primary/10">
              Buka Event
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalItems > limit" class="pt-6">
        <BasePagination v-model:items-per-page="limit" :current-page="currentPage" :total-items="totalItems"
          :no-margin="true" @change-page="handlePageChange" />
      </div>
    </div>

    <!-- QR Code Dialog - Fullscreen -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showQR" class="fixed inset-0 z-[9999] bg-white" @click="showQR = false">
          <!-- Content Container -->
          <div class="relative h-full w-full flex items-center justify-center p-4" @click.stop>
            <!-- Close Button -->
            <button @click="showQR = false"
              class="absolute top-4 right-4 h-11 w-11 rounded-2xl bg-slate-50 hover:bg-slate-100 text-navy flex items-center justify-center transition-all">
              <Icon icon="ph:x-bold" class="text-xl" />
            </button>

            <!-- QR Code Content -->
            <div class="flex flex-col items-center space-y-8 max-w-md w-full">
              <!-- Archer Name -->
              <div class="text-center space-y-3">
                <h3 class="text-3xl sm:text-4xl font-black text-navy tracking-tight">{{ user?.name || 'Archer' }}</h3>
                <p class="text-sm sm:text-base text-slate-500 font-bold uppercase tracking-widest">{{
                  selectedEvent?.name }}</p>
              </div>

              <!-- QR Code -->
              <div class="bg-white p-6 sm:p-8 rounded-[40px] border-2 border-slate-100 shadow-2xl">
                <qrcode-vue :value="selectedEvent?.qr_raw || 'N/A'" :size="isMobile ? 280 : 350" level="H"
                  render-as="svg" />
              </div>

              <!-- Info -->
              <div class="text-center">
                <p class="text-xs text-slate-400 font-bold uppercase tracking-widest">Tunjukkan QR ini saat registrasi
                  ulang</p>
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
import BasePagination from '~/components/common/BasePagination.vue'

const { get, post } = useApi()
const toast = useToast()
const { user } = useAuth()

const searchQuery = ref('')
const events = ref([])
const isLoading = ref(true)
const showQR = ref(false)
const selectedEvent = ref(null)

const invitations = ref([])
const isResponding = ref(null)

// Pagination state
const currentPage = ref(1)
const totalItems = ref(0)
const limit = ref(10)

watch(searchQuery, () => {
  currentPage.value = 1
  fetchEvents()
})

watch(limit, () => {
  currentPage.value = 1
  fetchEvents()
})

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
    const offset = (currentPage.value - 1) * limit.value
    const params = new URLSearchParams({
      limit: limit.value.toString(),
      offset: offset.toString()
    })

    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }

    const response = await get(`/archers/my/events?${params.toString()}`)
    events.value = response?.events || []
    totalItems.value = response?.total || 0
  } catch (error) {
    console.error('Failed to fetch events:', error)
    toast.error(getApiErrorMessage(error, 'Gagal memuat daftar event'))
  } finally {
    isLoading.value = false
  }
}

const fetchInvitations = async () => {
  // invitations endpoint removed
}

const respondInvitation = async (memberId, action) => {
  isResponding.value = memberId
  try {
    await post(`/clubs/invitations/${memberId}/respond`, { action })
    toast.success(action === 'accept' ? 'Berhasil bergabung dengan klub!' : 'Undangan ditolak')
    invitations.value = invitations.value.filter(i => i.uuid !== memberId)
    if (action === 'accept') window.location.reload()
  } catch (error) {
    console.error('Failed to respond to invitation:', error)
    toast.error('Gagal memproses undangan')
  } finally {
    isResponding.value = null
  }
}

const handlePageChange = (page) => {
  currentPage.value = page
  fetchEvents()
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

const filteredEvents = computed(() => events.value)

const emptyStateMessage = computed(() => {
  if (searchQuery.value) {
    return 'Tidak ada event yang sesuai dengan pencarian Anda.'
  }
  return 'Anda belum terdaftar di event manapun.'
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const getPaymentStatusClass = (status) => {
  if (!status) return 'bg-gray-50 text-gray-500 border-gray-100'
  const s = status.toLowerCase()
  if (s === 'menunggu' || s === 'menunggu_acc' || s === 'pending' || s === 'menunggu acc') {
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }
  const classes = {
    'belum_lunas': 'bg-yellow-50 text-yellow-700 border-yellow-100',
    'lunas': 'bg-green-50 text-green-700 border-green-100',
    'paid': 'bg-green-50 text-green-700 border-green-100',
    'failed': 'bg-red-50 text-red-700 border-red-100'
  }
  return classes[s] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const getPaymentStatusDotClass = (status) => {
  if (!status) return 'bg-gray-300'
  const s = status.toLowerCase()
  if (s === 'menunggu' || s === 'menunggu_acc' || s === 'pending' || s === 'menunggu acc') {
    return 'bg-amber-500'
  }
  const classes = {
    'belum_lunas': 'bg-yellow-500',
    'lunas': 'bg-green-500',
    'paid': 'bg-green-500',
    'failed': 'bg-red-500'
  }
  return classes[s] || 'bg-gray-300'
}

const getPaymentStatusLabel = (status) => {
  if (!status) return '-'
  const s = status.toLowerCase()
  if (s === 'menunggu' || s === 'menunggu_acc' || s === 'pending' || s === 'menunggu acc') return 'Menunggu ACC'
  const labels = {
    'belum_lunas': 'Belum Lunas',
    'lunas': 'Lunas',
    'paid': 'Terbayar',
    'failed': 'Gagal'
  }
  return labels[s] || status
}

const getStatusClass = (status) => {
  if (!status) return 'bg-gray-50 text-gray-500 border-gray-100'
  const s = status.toLowerCase()
  if (s === 'menunggu' || s === 'menunggu acc' || s === 'pending' || s === 'menunggu_acc') {
    return 'bg-amber-50 text-amber-700 border-amber-100'
  }
  const classes = {
    'terdaftar': 'bg-green-50 text-green-700 border-green-100',
    'approved': 'bg-green-50 text-green-700 border-green-100',
    'rejected': 'bg-red-50 text-red-700 border-red-100'
  }
  return classes[s] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const getStatusDotClass = (status) => {
  if (!status) return 'bg-gray-300'
  const s = status.toLowerCase()
  if (s === 'menunggu' || s === 'menunggu acc' || s === 'pending' || s === 'menunggu_acc') {
    return 'bg-amber-500'
  }
  const classes = {
    'terdaftar': 'bg-green-500',
    'approved': 'bg-green-500',
    'rejected': 'bg-red-500'
  }
  return classes[s] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
  if (!status) return 'Belum Daftar'
  const s = status.toLowerCase()
  if (s === 'menunggu' || s === 'menunggu acc' || s === 'pending') return 'Menunggu ACC'
  const labels = {
    'terdaftar': 'Terdaftar',
    'approved': 'Diterima',
    'rejected': 'Ditolak'
  }
  return labels[s] || status
}

const getMainStatusLabel = (event) => {
  const pStatus = (event.participant_status || '').toLowerCase()
  const payStatus = (event.payment_status || '').toLowerCase()
  if (pStatus === 'rejected') return 'Ditolak'
  if (payStatus !== 'lunas' && payStatus !== 'paid' && payStatus !== '-') {
    return getPaymentStatusLabel(event.payment_status)
  }
  return getStatusLabel(event.participant_status)
}

const getMainStatusClass = (event) => {
  const pStatus = (event.participant_status || '').toLowerCase()
  const payStatus = (event.payment_status || '').toLowerCase()
  if (pStatus === 'rejected') return getStatusClass('rejected')
  if (payStatus !== 'lunas' && payStatus !== 'paid' && payStatus !== '-') {
    return getPaymentStatusClass(event.payment_status)
  }
  return getStatusClass(event.participant_status)
}

const getMainStatusDotClass = (event) => {
  const pStatus = (event.participant_status || '').toLowerCase()
  const payStatus = (event.payment_status || '').toLowerCase()
  if (pStatus === 'rejected') return getStatusDotClass('rejected')
  if (payStatus !== 'lunas' && payStatus !== 'paid' && payStatus !== '-') {
    return getPaymentStatusDotClass(event.payment_status)
  }
  return getStatusDotClass(event.participant_status)
}
</script>
