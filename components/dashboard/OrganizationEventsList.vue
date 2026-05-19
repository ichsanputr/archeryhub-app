<template>
  <div class="space-y-6">
    <!-- Header -->
    <div id="tour-events-header"
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-navy text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
      </div>

      <!-- Decorative Background Elements (Glows) -->
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

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
                {{ $t('events.list.title') }}
              </h1>
              <p class="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-1 sm:line-clamp-none">
                {{ $t('events.list.subtitle') }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <BaseButton id="tour-create-event-btn" :to="canCreateEvent ? '/dashboard/events/create' : undefined"
              variant="primary" icon="ph:plus-bold" @click="!canCreateEvent && (showPremiumModal = true)"
              class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
              :class="{ 'opacity-50 grayscale cursor-not-allowed': !canCreateEvent }">
              {{ $t('events.list.create_event') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="create_event" />

    <!-- Search & Filter Card -->
    <div id="tour-search-filter"
      class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-grow w-full">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" :placeholder="$t('events.list.search_placeholder')"
          :label="$t('events.list.search_label')" />
      </div>
      <BaseButton variant="white" icon="ph:funnel" @click="resetFilters" class="h-11">
        {{ $t('events.list.reset_filters') }}
      </BaseButton>
    </div>

    <!-- Events List / Table -->
    <div id="tour-events-table" class="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th @click="toggleSort('name')"
                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2 ">
                  {{ $t('events.list.table_headers.event_info') }}
                  <Icon v-if="sortBy === 'name'" :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                    class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('start_date')"
                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2 ">
                  Jadwal & Lokasi
                  <Icon v-if="sortBy === 'start_date'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('participant_count')"
                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2 ">
                  Peserta / Kategori
                  <Icon v-if="sortBy === 'participant_count'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('status')"
                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2 ">
                  Status
                  <Icon v-if="sortBy === 'status'" :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                    class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-right ">Aksi
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
                  <BaseButton v-else :to="`/dashboard/${userPersona}/events/create`" variant="primary" size="sm"
                    icon="ph:plus-bold">
                    {{ $t('events.list.empty_state.create_first') }}
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
                      <span class=" text-xs font-bold text-gray-400 tracking-wide ">{{ event.code }}</span>
                      <span class="text-gray-300">•</span>
                      <span class=" text-xs font-bold text-primary-dark  tracking-wide">{{
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
                  <BaseButton variant="white" size="sm" icon="ph:trash" @click="confirmDeleteEvent(event)"
                    class="h-9 w-9 p-0 text-red-500 hover:text-red-50 border-slate-200" />
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
    <AppDialog v-model:show="showDeleteDialog" title="Hapus Event"
      :message="`Apakah Anda yakin ingin menghapus event '${eventToDelete?.name}'? Tindakan ini tidak dapat dibatalkan.`"
      confirm-text="Ya, Hapus" type="danger" icon="ph:trash" @confirm="deleteEvent" @cancel="cancelDelete" />
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { useEventContext } from '~/composables/useEventContext'
import { useToast } from '~/composables/useToast'
import { useRouter } from 'vue-router'
import { useSubscription } from '~/composables/useSubscription'
import { useTour } from '~/composables/useTour'
import BasePagination from '~/components/common/BasePagination.vue'
import AppDialog from '~/components/common/AppDialog.vue'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { get, delete: del } = useApi()
const router = useRouter()
const { setEvent } = useEventContext()
const { isSubscriptionActive, canCreateEvent } = useSubscription()
const toast = useToast()
const { startTour } = useTour()

const showPremiumModal = ref(false)
const searchQuery = ref('')
const events = ref([])
const isLoading = ref(true)
const showDeleteDialog = ref(false)
const eventToDelete = ref(null)

// Sorting and Pagination state
const currentPage = ref(1)
const totalItems = ref(0)
const limit = ref(10)
const sortBy = ref('created_at')
const order = ref('DESC')

const triggerTour = (force = false) => {
  const steps = [
    {
      target: '#tour-events-header',
      title: 'Events Dashboard',
      description: 'Welcome to your events dashboard! Here you can manage all your tournaments, registrations, brackets, and live results in one place.',
      placement: 'bottom'
    },
    {
      target: '#tour-create-event-btn',
      title: 'Create Tournaments',
      description: 'Click here to create a new archery tournament. You can configure categories, sessions, elimination brackets, venue locations, and fees.',
      placement: 'left'
    },
    {
      target: '#tour-search-filter',
      title: 'Search & Filters',
      description: 'Quickly find your tournaments by code, name, or location. Keep your dashboard organized as your event list grows.',
      placement: 'bottom'
    },
    {
      target: '#tour-events-table',
      title: 'Tournament List & Management',
      description: 'All your active and draft tournaments are listed here. Click "Kelola" on any tournament to configure its settings, view participants, print target lists, or manage brackets.',
      placement: 'top'
    }
  ]
  startTour('organization-events-tour', steps, force)
}

watch([searchQuery, limit, sortBy, order], () => {
  currentPage.value = 1
  fetchEvents()
})

const fetchEvents = async () => {
  isLoading.value = true
  try {
    const offset = (currentPage.value - 1) * limit.value
    const params = new URLSearchParams({
      limit: limit.value.toString(),
      offset: offset.toString(),
      sort_by: sortBy.value,
      order: order.value
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

const toggleSort = (field) => {
  if (sortBy.value === field) {
    order.value = order.value === 'ASC' ? 'DESC' : 'ASC'
  } else {
    sortBy.value = field
    order.value = 'ASC'
  }
}

onMounted(() => {
  fetchEvents()
  // Trigger tour automatically only if not marked as seen in localStorage
  if (import.meta.client) {
    const completed = JSON.parse(localStorage.getItem('completed_tours') || '[]')
    if (!completed.includes('organization-events-tour')) {
      setTimeout(() => {
        triggerTour(false)
      }, 1000)
    }
  }
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

const confirmDeleteEvent = (event) => {
  eventToDelete.value = event
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

</script>
