<template>
  <div class="flex flex-col gap-8">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div class="flex items-center gap-2 text-sm text-gray-400 mb-2 font-bold tracking-tight uppercase">
          <NuxtLink to="/dashboard" class="hover:text-primary transition-colors">Dashboard</NuxtLink>
          <Icon icon="ph:caret-right-bold" class="text-[12px]" />
          <span class="text-navy">Event</span>
        </div>
        <h1 class="text-3xl font-extrabold text-navy tracking-tight">Daftar Event</h1>
        <p class="text-gray-500 font-medium mt-1">
          {{ isArcher ? 'Event yang Anda ikuti.' : 'Kelola kompetisi dan pantau progres event Anda.' }}
        </p>
      </div>
      <BaseButton v-if="canCreateEvent" to="/dashboard/events/create" variant="primary" icon="ph:plus-bold"
        class="shadow-lg shadow-primary/20">
        Buat Event Baru
      </BaseButton>
    </div>

    <!-- Quick Stats Snippet (Optional but premium) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="h-10 w-10 rounded-lg bg-primary/10 text-primary-dark flex items-center justify-center">
          <Icon icon="ph:calendar-check" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Aktif</p>
          <p class="text-lg font-bold text-navy">{{events.filter(e => e.status === 'published' || e.status ===
            'ongoing').length}}</p>
        </div>
      </div>
      <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div class="h-10 w-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <Icon icon="ph:file-text" class="text-xl" />
        </div>
        <div>
          <p class="text-xs text-gray-400 font-bold uppercase tracking-wider">Draft</p>
          <p class="text-lg font-bold text-navy">{{events.filter(e => e.status === 'draft').length}}</p>
        </div>
      </div>
    </div>

    <!-- Search & Filter Card -->
    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-grow w-full">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" placeholder="Cari nama event, lokasi, atau kode..."
          label="Pencarian" />
      </div>
      <div class="w-full md:w-64">
        <BaseSelect v-model="statusFilter" :items="statusOptions" label="Status" />
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
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Peserta /
                Kategori</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-[11px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Aksi
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <!-- Loading State -->
            <tr v-if="isLoading">
              <td colspan="5" class="px-6 py-24 text-center">
                <div class="flex flex-col items-center justify-center gap-4">
                  <div class="h-12 w-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                  <div class="flex flex-col gap-1">
                    <p class="text-navy font-bold">Memasuki Arena...</p>
                    <p class="text-xs text-gray-400 font-medium">Menyiapkan data kompetisi Anda</p>
                  </div>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-else-if="filteredEvents.length === 0">
              <td colspan="5" class="px-6 py-24 text-center">
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
                  <BaseButton v-if="searchQuery || statusFilter" variant="outline" size="sm" @click="resetFilters">
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
                      <span class="text-[11px] font-bold text-gray-400 tracking-wide uppercase">{{ event.code }}</span>
                      <span class="text-gray-300">•</span>
                      <span class="text-[11px] font-bold text-primary-dark uppercase tracking-wide">{{
                        event.discipline_name || 'Event' }}</span>
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
                    {{ event.participant_count }} <span class="text-gray-400 font-medium">Peserta</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                    <Icon icon="ph:stack" class="text-gray-400" />
                    {{ event.event_count }} <span class="text-gray-400 font-medium">Kategori</span>
                  </div>
                </div>
              </td>
              <td class="px-6 py-5">
                <span :class="getStatusClass(event.status)"
                  class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-wider border transition-all">
                  <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(event.status)"></span>
                  {{ getStatusLabel(event.status) }}
                </span>
              </td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2">
                  <BaseButton :to="`/dashboard/events/${event.id}/manage`" variant="white" size="sm"
                    class="h-9 font-bold">
                    Kelola
                  </BaseButton>
                  <div class="relative" v-click-outside="() => closeDropdown(event.id)">
                    <button @click="toggleDropdown(event.id)"
                      class="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-all">
                      <Icon icon="ph:dots-three-vertical-bold" class="text-xl" />
                    </button>
                    <div v-if="openDropdownId === event.id"
                      class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <NuxtLink :to="`/dashboard/events/${event.id}/edit`"
                        class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-navy transition-colors">
                        <Icon icon="ph:pencil-simple" class="text-lg text-gray-400" />
                        Edit Event
                      </NuxtLink>
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
import { useAuth } from '~/composables/useAuth'

definePageMeta({
  layout: 'dashboard'
})

const { user } = useAuth()
const { get } = useApi()
const searchQuery = ref('')
const statusFilter = ref('')
const events = ref([])
const isLoading = ref(true)

// Role-based permissions
const isArcher = computed(() => user.value?.role === 'archer')
const canCreateEvent = computed(() => {
  const role = user.value?.role
  return role === 'admin' || role === 'organization'
})

const statusOptions = [
  { title: 'Semua Status', value: '' },
  { title: 'Published', value: 'published' },
  { title: 'Draft', value: 'draft' },
  { title: 'Ongoing', value: 'ongoing' },
  { title: 'Upcoming', value: 'upcoming' },
  { title: 'Completed', value: 'completed' }
]

const fetchEvents = async () => {
  isLoading.value = true
  try {
    const response = await get('/events')
    events.value = response?.events || []
  } catch (error) {
    console.error('Failed to fetch events:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEvents()
})

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
}

const filteredEvents = computed(() => {
  return events.value.filter(event => {
    const q = searchQuery.value.toLowerCase()
    const matchesSearch = !q ||
      (event.name?.toLowerCase() || '').includes(q) ||
      (event.venue?.toLowerCase() || '').includes(q) ||
      (event.code?.toLowerCase() || '').includes(q) ||
      (event.location?.toLowerCase() || '').includes(q)
    const matchesStatus = !statusFilter.value || event.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const getStatusClass = (status) => {
  const classes = {
    'published': 'bg-green-50 text-green-700 border-green-100',
    'draft': 'bg-amber-50 text-amber-700 border-amber-100',
    'ongoing': 'bg-primary/10 text-primary-dark border-primary/20',
    'upcoming': 'bg-blue-50 text-blue-700 border-blue-100',
    'completed': 'bg-gray-50 text-gray-500 border-gray-100'
  }
  return classes[status] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const getStatusDotClass = (status) => {
  const classes = {
    'published': 'bg-green-500',
    'draft': 'bg-amber-500',
    'ongoing': 'bg-primary animate-pulse',
    'upcoming': 'bg-blue-500',
    'completed': 'bg-gray-300'
  }
  return classes[status] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
  const labels = {
    'published': 'Published',
    'draft': 'Draft',
    'ongoing': 'Sedang Berlangsung',
    'upcoming': 'Akan Datang',
    'completed': 'Selesai'
  }
  return labels[status] || status
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatTime = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit'
  }) + ' WIB'
}

// Dropdown state management
const openDropdownId = ref(null)

const toggleDropdown = (eventId) => {
  openDropdownId.value = openDropdownId.value === eventId ? null : eventId
}

const closeDropdown = (eventId) => {
  if (openDropdownId.value === eventId) {
    openDropdownId.value = null
  }
}

// Delete event functionality
const { del } = useApi()
const showDeleteDialog = useState('show-delete-dialog', () => false)
const eventToDelete = ref(null)

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
  } catch (error) {
    console.error('Failed to delete event:', error)
  }
}

const cancelDelete = () => {
  showDeleteDialog.value = false
  eventToDelete.value = null
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
