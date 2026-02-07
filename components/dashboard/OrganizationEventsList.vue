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
      <div class="relative p-5 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center sm:items-start gap-4 flex-1">
            <!-- Icon Badge -->
            <div
              class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md flex-shrink-0">
              <Icon icon="ph:calendar-blank" class="text-primary text-xl sm:text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="min-w-0">
              <h1 class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                Daftar Event
              </h1>
              <p class="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-1 sm:line-clamp-none">
                Kelola kompetisi dan pantau progres event Anda
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <BaseButton to="/dashboard/events/create" variant="primary" icon="ph:plus-bold"
              class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black uppercase tracking-widest">
              Buat Event
            </BaseButton>
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
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">Informasi
                Event
              </th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">Jadwal & Lokasi
              </th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">Peserta /
                Kategori</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest">Status</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400  tracking-widest text-right">Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td :colspan="5" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center justify-center gap-4">
                  <div class="h-12 w-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                  <div class="flex flex-col gap-1">
                    <p class="text-navy font-bold">Memuat Event...</p>
                    <p class="text-xs text-gray-400 font-medium">Menyiapkan data kompetisi Anda</p>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="filteredEvents.length === 0">
              <td :colspan="5" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center gap-4 max-w-xs mx-auto">
                  <div class="h-16 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
                    <Icon icon="ph:calendar-x" class="text-4xl" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-lg font-bold text-navy">Event Tidak Ditemukan</p>
                    <p class="text-sm text-gray-500 font-medium leading-relaxed">
                      Belum ada event yang sesuai dengan kriteria pencarian Anda.
                    </p>
                  </div>
                  <BaseButton v-if="searchQuery" variant="outline" size="sm" @click="resetFilters">
                    Hapus Filter
                  </BaseButton>
                  <BaseButton v-else to="/dashboard/events/create" variant="primary" size="sm" icon="ph:plus-bold">
                    Buat Event Pertama
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
                      <span class="text-[11px] font-bold text-gray-400 tracking-wide ">{{ event.code }}</span>
                      <span class="text-gray-300">•</span>
                      <span class="text-[11px] font-bold text-primary-dark  tracking-wide">{{
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
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center gap-2 text-navy text-sm font-bold">
                    <Icon icon="ph:users-three" class="text-gray-400" />
                    {{ event.participant_count || 0 }} <span class="text-gray-400 font-medium">Peserta</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                    <Icon icon="ph:stack" class="text-gray-400" />
                    {{ event.event_count || 0 }} <span class="text-gray-400 font-medium">Kategori</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <span :class="getStatusClass(event.status)"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border">
                  <span :class="getStatusDotClass(event.status)" class="h-1.5 w-1.5 rounded-full"></span>
                  {{ getStatusLabel(event.status) }}
                </span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <BaseButton @click="handleManageEvent(event)" variant="primary" size="sm" class="h-9 font-bold">
                    Kelola
                  </BaseButton>
                  <div class="relative" v-click-outside="() => closeDropdown(event.id)">
                    <button @click="toggleDropdown(event.id)"
                      class="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-all">
                      <Icon icon="ph:dots-three-vertical-bold" class="text-xl" />
                    </button>
                    <div v-if="openDropdownId === event.id"
                      class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200">
                      <button @click="confirmDeleteEvent(event)"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <Icon icon="ph:trash" class="text-lg" />
                        Hapus Event
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Card Footer -->
      <div v-if="events.length > 0" class="px-6 py-6 bg-gray-50 border-t border-gray-100">
        <BasePagination v-model:items-per-page="limit" :current-page="currentPage" :total-items="totalItems"
          :no-margin="true" @change-page="handlePageChange" />
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <Teleport to="body">
      <div v-if="showDeleteDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-navy/60 backdrop-blur-sm" @click="cancelDelete"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
          <div class="flex flex-col items-center text-center gap-4">
            <div class="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center">
              <Icon icon="ph:warning-circle" class="text-4xl text-red-500" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-navy">Hapus Event?</h3>
              <p class="text-gray-500 mt-2 text-sm leading-relaxed">
                Apakah Anda yakin ingin menghapus event <span class="font-bold text-navy">{{ eventToDelete?.name
                }}</span>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div class="flex gap-3 w-full mt-2">
              <BaseButton variant="outline" class="flex-1" @click="cancelDelete">
                Batal
              </BaseButton>
              <BaseButton variant="danger" class="flex-1 bg-red-600 hover:bg-red-700 text-white" @click="deleteEvent">
                <Icon icon="ph:trash" class="mr-2" />
                Hapus Event
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useEventContext } from '~/composables/useEventContext'
import { useToast } from '~/composables/useToast'
import { useRouter } from 'vue-router'
import BasePagination from '~/components/common/BasePagination.vue'

const { get, del } = useApi()
const router = useRouter()
const { setEvent } = useEventContext()
const toast = useToast()

const searchQuery = ref('')
const events = ref([])
const isLoading = ref(true)
const openDropdownId = ref(null)
const showDeleteDialog = ref(false)
const eventToDelete = ref(null)

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

    const response = await get(`/events/my?${params.toString()}`)
    events.value = response?.events || []
    totalItems.value = response?.total || 0
  } catch (error) {
    console.error('Failed to fetch events:', error)
    toast.error(getApiErrorMessage(error, 'Gagal memuat daftar event'))
  } finally {
    isLoading.value = false
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

const filteredEvents = computed(() => events.value)

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const getStatusClass = (status) => {
  const classes = {
    'active': 'bg-green-50 text-green-700 border-green-100',
    'draft': 'bg-amber-50 text-amber-700 border-amber-100'
  }
  return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const getStatusDotClass = (status) => {
  const classes = {
    'active': 'bg-green-500',
    'draft': 'bg-amber-500'
  }
  return classes[status] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
  const labels = {
    'active': 'Aktif',
    'draft': 'Draft'
  }
  return labels[status] || status
}

const toggleDropdown = (eventId) => {
  openDropdownId.value = openDropdownId.value === eventId ? null : eventId
}

const closeDropdown = (eventId) => {
  if (openDropdownId.value === eventId) {
    openDropdownId.value = null
  }
}

const confirmDeleteEvent = (event) => {
  eventToDelete.value = event
  openDropdownId.value = null
  showDeleteDialog.value = true
}

const deleteEvent = async () => {
  if (!eventToDelete.value) return
  try {
    await del(`/events/${eventToDelete.value.id}`)
    events.value = events.value.filter(e => e.id !== eventToDelete.value.id)
    showDeleteDialog.value = false
    eventToDelete.value = null
    toast.success('Event berhasil dihapus')
  } catch (error) {
    console.error('Failed to delete event:', error)
    toast.error('Gagal menghapus event')
  }
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  eventToDelete.value = null
}

const handleManageEvent = (event) => {
  setEvent(event)
  router.push(`/dashboard/events/${event.slug || event.id}/overview`)
}

// v-click-outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutsideHandler = (event) => {
      if (!el.contains(event.target)) {
        binding.value()
      }
    }
    document.addEventListener('click', el._clickOutsideHandler)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutsideHandler)
  }
}
</script>
