<template>
  <div class="space-y-6">
    <!-- Header -->
    <DashboardHeader
      id="tour-events-header"
      :title="t('events.list.title', 'Event & Turnamen Saya')"
      :subtitle="t('events.list.subtitle', 'Kelola semua event panahan, peserta, bantalan target, dan rekap skor Anda.')"
      icon="ph:calendar-blank"
      :breadcrumbs="[
        { label: t('common.dashboard', 'Dashboard'), to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event & Turnamen') }
      ]"
    >
      <template #actions>
        <BaseButton id="tour-create-event-btn" :to="canCreateEvent ? '/dashboard/organizer/tournaments/create' : undefined"
          variant="primary" icon="ph:plus-bold" @click="!canCreateEvent && (showPremiumModal = true)"
          class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
          :class="{ 'opacity-80': !canCreateEvent }">
          {{ t('events.list.create_event', 'Buat Turnamen Baru') }}
        </BaseButton>
      </template>
    </DashboardHeader>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="create_event" />

    <!-- Search & Filter Card -->
    <div id="tour-search-filter"
      class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      <!-- Search Input -->
      <div class="flex-grow w-full md:w-auto">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass" :placeholder="t('events.list.search_placeholder', 'Cari nama event, lokasi, atau slug...')"
          :label="t('events.list.search_label', 'Cari Event')" />
      </div>

      <!-- Status Filter -->
      <div class="w-full md:w-48">
        <label class="block text-xs font-bold text-navy mb-1.5">{{ t('events.filter.filter_status', 'Status Event') }}</label>
        <BaseSelect v-model="statusFilter" :options="statusFilterOptions" class="w-full text-xs" />
      </div>

      <!-- Reset Button -->
      <BaseButton variant="white" icon="ph:funnel" @click="resetFilters" class="h-11 shrink-0">
        {{ t('events.list.reset_filters', 'Reset') }}
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
                  {{ t('events.list.table_headers.event_info', 'Info Event') }}
                  <Icon v-if="sortBy === 'name'" :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                    class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('start_date')"
                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2 ">
                  {{ t('events.list.table_headers.schedule_location', 'Jadwal & Lokasi') }}
                  <Icon v-if="sortBy === 'start_date'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('participant_count')"
                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2 ">
                  {{ t('events.list.table_headers.participants_categories', 'Peserta & Kategori') }}
                  <Icon v-if="sortBy === 'participant_count'"
                    :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'" class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th @click="toggleSort('status')"
                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                <div class="flex items-center gap-2 ">
                  {{ t('events.list.table_headers.status', 'Status') }}
                  <Icon v-if="sortBy === 'status'" :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                    class="text-primary" />
                  <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                </div>
              </th>
              <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-right "> {{ t('events.list.table_headers.actions', 'Aksi') }}
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
                    <div class="text-navy font-bold">{{ t('events.list.loading', 'Memuat Event...') }}</div>
                    <div class="text-xs text-gray-400 font-medium">{{ t('events.list.loading_subtitle', 'Menyiapkan data kompetisi Anda') }}</div>
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
                    <div class="text-lg font-bold text-navy">{{ t('events.list.empty_state.title', 'Event Tidak Ditemukan') }}</div>
                    <div class="text-sm text-gray-500 font-medium leading-relaxed">
                      {{ t('events.list.empty_state.description', 'Belum ada event yang sesuai dengan kriteria pencarian Anda.') }}
                    </div>
                  </div>
                  <BaseButton v-if="searchQuery || statusFilter !== 'all'" variant="outline" size="sm" @click="resetFilters">
                    {{ t('events.list.empty_state.clear_filters', 'Hapus Filter') }}
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
                      <span class=" text-xs font-bold text-primary-dark tracking-wide">{{
                        formatLocationType(event.location_type) }}</span>
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
                    {{ event.participant_count || 0 }} <span class="text-gray-400 font-medium">{{ t('events.list.participants_label', 'Peserta') }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-gray-500 text-xs font-semibold">
                    <Icon icon="ph:stack" class="text-gray-400" />
                    {{ event.event_count || 0 }} <span class="text-gray-400 font-medium">{{ t('events.list.categories_label', 'Kategori') }}</span>
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
                    {{ t('events.list.manage', 'Kelola') }}
                  </BaseButton>
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
  </div>
</template>
<script setup>
import { Icon } from '@iconify/vue'
import { useTournamentContext } from '~/composables/useTournamentContext'
import { useToast } from '~/composables/useToast'
import { useRouter } from 'vue-router'
import { useSubscription } from '~/composables/useSubscription'
import { useTour } from '~/composables/useTour'
import { useI18n } from 'vue-i18n'
import BasePagination from '~/components/common/BasePagination.vue'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { get } = useApi()
const router = useRouter()
const { setTournament, setEvent } = useTournamentContext()
const { isSubscriptionActive, canCreateEvent } = useSubscription()
const toast = useToast()
const { startTour } = useTour()
const { t, locale } = useI18n()

const showPremiumModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const scopeFilter = ref('all')
const events = ref([])
const isLoading = ref(true)

const statusFilterOptions = computed(() => [
  { title: t('events.filter.all_status', 'Semua Status'), value: 'all' },
  { title: t('events.filter.status_active', 'Aktif'), value: 'active' },
  { title: t('events.filter.status_published', 'Dipublikasikan'), value: 'published' },
  { title: t('events.filter.status_draft', 'Draft'), value: 'draft' },
  { title: t('events.filter.status_completed', 'Selesai'), value: 'completed' },
])

const scopeFilterOptions = computed(() => [
  { title: t('events.filter.all_scope', 'Semua Lingkup'), value: 'all' },
  { title: t('events.filter.scope_national', 'Nasional'), value: 'national' },
  { title: t('events.filter.scope_provincial', 'Provinsi'), value: 'provincial' },
  { title: t('events.filter.scope_club', 'Klub / Internal'), value: 'club' },
])

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
  startTour('organizer-events-tour', steps, force)
}

watch([searchQuery, statusFilter, scopeFilter, limit, sortBy, order], () => {
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
    if (statusFilter.value && statusFilter.value !== 'all') {
      params.append('status', statusFilter.value)
    }
    if (scopeFilter.value && scopeFilter.value !== 'all') {
      params.append('scope', scopeFilter.value)
    }

    const response = await get(`/tournaments/my?${params.toString()}`)
    events.value = response?.tournaments || response?.events || []
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
    if (!completed.includes('organizer-events-tour')) {
      setTimeout(() => {
        triggerTour(false)
      }, 1000)
    }
  }
})
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  scopeFilter.value = 'all'
}

const filteredEvents = computed(() => events.value)

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const dateLocale = locale.value === 'id' ? 'id-ID' : 'en-US'
  return new Date(dateStr).toLocaleDateString(dateLocale, {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatLocationType = (type) => {
  if (!type) return t('events.location.event', 'Event')
  const key = String(type).toLowerCase().trim()
  const map = {
    'outdoor': t('events.location.outdoor', 'Outdoor'),
    'indoor': t('events.location.indoor', 'Indoor'),
    'both': t('events.location.both', 'Indoor & Outdoor'),
    'indoor_outdoor': t('events.location.both', 'Indoor & Outdoor'),
    'hybrid': t('events.location.hybrid', 'Hybrid'),
    'field': t('events.location.field', 'Field Archery'),
    '3d': t('events.location.3d', '3D Archery'),
  }
  return map[key] || type
}

const getStatusClass = (status) => {
  const normalized = String(status || '').toLowerCase().trim()
  const classes = {
    'active': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'published': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'ongoing': 'bg-blue-50 text-blue-700 border-blue-100',
    'draft': 'bg-amber-50 text-amber-700 border-amber-100',
    'upcoming': 'bg-indigo-50 text-indigo-700 border-indigo-100',
    'completed': 'bg-slate-50 text-slate-600 border-slate-200',
    'finished': 'bg-slate-50 text-slate-600 border-slate-200',
    'closed': 'bg-rose-50 text-rose-700 border-rose-100',
    'cancelled': 'bg-rose-50 text-rose-700 border-rose-100',
  }
  return classes[normalized] || 'bg-gray-50 text-gray-500 border-gray-100'
}

const getStatusDotClass = (status) => {
  const normalized = String(status || '').toLowerCase().trim()
  const classes = {
    'active': 'bg-emerald-500',
    'published': 'bg-emerald-500',
    'ongoing': 'bg-blue-500',
    'draft': 'bg-amber-500',
    'upcoming': 'bg-indigo-500',
    'completed': 'bg-slate-400',
    'finished': 'bg-slate-400',
    'closed': 'bg-rose-500',
    'cancelled': 'bg-rose-500',
  }
  return classes[normalized] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
  const normalized = String(status || '').toLowerCase().trim()
  const labels = {
    'active': t('events.status.active', 'Aktif'),
    'published': t('events.status.published', 'Dipublikasikan'),
    'ongoing': t('events.status.ongoing', 'Berlangsung'),
    'draft': t('events.status.draft', 'Draft'),
    'upcoming': t('events.status.upcoming', 'Akan Datang'),
    'completed': t('events.status.completed', 'Selesai'),
    'finished': t('events.status.finished', 'Selesai'),
    'closed': t('events.status.closed', 'Ditutup'),
    'cancelled': t('events.status.cancelled', 'Dibatalkan'),
  }
  return labels[normalized] || status || '-'
}

const handleManageEvent = (event) => {
  setEvent(event)
  router.push(`/dashboard/organizer/tournaments/${event.slug || event.id}/overview`)
}

</script>
