<template>
  <div class="space-y-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      id="tour-events-header"
      :title="t('events.list.title')"
      :subtitle="t('events.list.subtitle')"
      icon="ph:calendar-blank"
      :breadcrumbs="[
        { label: t('common.dashboard'), to: '/dashboard/organizer' },
        { label: t('events.list.title') }
      ]"
    >
      <template #actions>
        <BaseButton id="tour-create-event-btn" :to="canCreateEvent ? '/dashboard/organizer/tournaments/create' : undefined"
          variant="primary" icon="ph:plus-bold" @click="!canCreateEvent && (showPremiumModal = true)"
          class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
          :class="{ 'opacity-80': !canCreateEvent }">
          {{ t('events.list.create_event') }}
        </BaseButton>
      </template>
    </DashboardHeader>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="create_event" />

    <!-- Unified DashboardDataTable (Category B: Inline Filters) -->
    <div id="tour-events-table">
      <DashboardDataTable
        :items="events"
        :columns="tableColumns"
        :loading="isLoading"
        :searchable="true"
        :search-placeholder="t('events.list.search_placeholder')"
        count-icon="ph:trophy-bold"
        :count-unit="t('events.list.title')"
        :show-reset-button="true"
        :empty-title="t('events.list.empty_state.title')"
        :empty-description="t('events.list.empty_state.description')"
        empty-icon="ph:calendar-x"
        :items-per-page="limit"
        :initial-sort-by="sortBy"
        :initial-sort-order="order === 'ASC' ? 'asc' : 'desc'"
        :active-filter-chips="activeFilterChips"
        @search="handleSearch"
        @sort="handleSort"
        @reset-filters="resetFilters"
        @remove-chip="removeFilterChip"
      >
        <!-- Inline Filters: Status and Scope Selects -->
        <template #inline-filters>
          <div class="flex items-center gap-2 flex-wrap">
            <div class="w-36 sm:w-44">
              <BaseSelect
                v-model="statusFilter"
                :items="statusFilterOptions"
                :placeholder="t('events.filter.filter_status')"
                class="w-full text-xs"
              />
            </div>
            <div class="w-36 sm:w-44">
              <BaseSelect
                v-model="scopeFilter"
                :items="scopeFilterOptions"
                :placeholder="t('events.filter.all_scope')"
                class="w-full text-xs"
              />
            </div>
          </div>
        </template>

        <!-- Event Info Column Slot -->
        <template #item-event_info="{ item }">
          <div class="flex items-center gap-3.5 py-1">
            <div class="size-11 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
              <img v-if="item.logo_url" :src="item.logo_url" :alt="item.name || 'Tournament Logo'" class="size-full object-cover" />
              <Icon v-else icon="ph:trophy-bold" class="text-navy/30 text-xl" />
            </div>
            <div class="min-w-0">
              <div class="text-xs sm:text-sm font-bold text-navy truncate hover:text-primary transition-colors leading-snug" :title="item.name || '-'">
                {{ item.name || '-' }}
              </div>
              <div class="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-medium">
                <span class="font-mono text-slate-400">{{ item.code || '-' }}</span>
                <span class="text-slate-300">•</span>
                <span class="text-slate-600 font-semibold">{{ formatLocationType(item.location_type) }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- Schedule & Location Column Slot -->
        <template #item-schedule="{ item }">
          <div class="space-y-0.5 text-xs">
            <div class="flex items-center gap-1.5 text-navy font-bold">
              <Icon icon="ph:calendar-blank-bold" class="text-slate-400 shrink-0" />
              <span>{{ formatDate(item.start_date) }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-500 font-medium truncate max-w-[180px]" :title="item.venue || item.city || item.location || '-'">
              <Icon icon="ph:map-pin-bold" class="text-slate-400 shrink-0" />
              <span class="truncate">{{ item.venue || item.city || item.location || '-' }}</span>
            </div>
          </div>
        </template>

        <!-- Participants & Categories Column Slot -->
        <template #item-participants="{ item }">
          <div class="space-y-0.5 text-xs">
            <div class="flex items-center gap-1.5 text-navy font-bold">
              <Icon icon="ph:users-three-bold" class="text-slate-400 shrink-0" />
              <span>{{ item.participant_count ?? 0 }}</span>
              <span class="text-slate-400 font-normal">{{ t('events.list.participants_label') }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Icon icon="ph:stack-bold" class="text-slate-400 shrink-0" />
              <span>{{ item.event_count ?? 0 }}</span>
              <span class="text-slate-400 font-normal">{{ t('events.list.categories_label') }}</span>
            </div>
          </div>
        </template>

        <!-- Status Column Slot -->
        <template #item-status="{ item }">
          <div class="flex justify-center">
            <span :class="getStatusClass(item.status)" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black border tracking-wider">
              <span :class="getStatusDotClass(item.status)" class="size-1.5 rounded-full shrink-0"></span>
              <span>{{ getStatusLabel(item.status) }}</span>
            </span>
          </div>
        </template>

        <!-- Actions Column Slot -->
        <template #actions="{ item }">
          <div class="flex items-center justify-end gap-1.5">
            <BaseButton @click="handleManageEvent(item)" variant="primary" size="sm" class="h-8 sm:h-9 px-3 text-xs font-bold">
              {{ t('events.list.manage') }}
            </BaseButton>
          </div>
        </template>
      </DashboardDataTable>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTournamentContext } from '~/composables/useTournamentContext'
import { useToast } from '~/composables/useToast'
import { useSubscription } from '~/composables/useSubscription'
import { useTour } from '~/composables/useTour'
import useDashboardI18n from '~/composables/useDashboardI18n'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const { get } = useApi()
const router = useRouter()
const { setTournament, setEvent } = useTournamentContext()
const { isSubscriptionActive, canCreateEvent } = useSubscription()
const toast = useToast()
const { startTour } = useTour()
const { t, locale } = useDashboardI18n()

const showPremiumModal = ref(false)
const searchQuery = ref('')
const statusFilter = ref('all')
const scopeFilter = ref('all')
const events = ref([])
const isLoading = ref(true)

const tableColumns = computed(() => [
  { key: 'event_info', label: t('events.list.table_headers.event_info'), sortable: true, sortKey: 'name', class: 'min-w-[260px]' },
  { key: 'schedule', label: t('events.list.table_headers.schedule_location'), sortable: true, sortKey: 'start_date', class: 'min-w-[190px]' },
  { key: 'participants', label: t('events.list.table_headers.participants_categories'), sortable: true, sortKey: 'participant_count', class: 'min-w-[170px]' },
  { key: 'status', label: t('events.list.table_headers.status'), sortable: true, sortKey: 'status', align: 'center', class: 'min-w-[130px]' }
])

const statusFilterOptions = computed(() => [
  { title: t('events.filter.all_status'), value: 'all' },
  { title: t('events.filter.status_published'), value: 'published' },
  { title: t('events.filter.status_draft'), value: 'draft' },
  { title: t('events.filter.status_completed'), value: 'completed' },
])

const scopeFilterOptions = computed(() => [
  { title: t('events.filter.all_scope'), value: 'all' },
  { title: t('events.filter.scope_national'), value: 'national' },
  { title: t('events.filter.scope_provincial'), value: 'provincial' },
  { title: t('events.filter.scope_club'), value: 'club' },
])

const activeFilterChips = computed(() => {
  const chips = []
  if (statusFilter.value && statusFilter.value !== 'all') {
    const opt = statusFilterOptions.value.find(o => o.value === statusFilter.value)
    chips.push({ key: 'status', label: `Status: ${opt ? opt.title : statusFilter.value}` })
  }
  if (scopeFilter.value && scopeFilter.value !== 'all') {
    const opt = scopeFilterOptions.value.find(o => o.value === scopeFilter.value)
    chips.push({ key: 'scope', label: `Scope: ${opt ? opt.title : scopeFilter.value}` })
  }
  return chips
})

const removeFilterChip = (key) => {
  if (key === 'status') statusFilter.value = 'all'
  if (key === 'scope') scopeFilter.value = 'all'
}

// Sorting and Pagination state
const currentPage = ref(1)
const totalItems = ref(0)
const limit = ref(10)
const sortBy = ref('created_at')
const order = ref('DESC')

const handleSearch = (q) => {
  searchQuery.value = q
  currentPage.value = 1
  fetchEvents()
}

const handleSort = ({ sortBy: field, sortOrder }) => {
  sortBy.value = field
  order.value = sortOrder === 'asc' ? 'ASC' : 'DESC'
  fetchEvents()
}

watch([statusFilter, scopeFilter], () => {
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
  } finally {
    isLoading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  scopeFilter.value = 'all'
  currentPage.value = 1
  fetchEvents()
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return '-'
    const dateLocale = (locale.value || 'id') === 'id' ? 'id-ID' : 'en-US'
    return d.toLocaleDateString(dateLocale, {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  } catch {
    return '-'
  }
}

const formatLocationType = (type) => {
  if (!type) return '-'
  const key = String(type).toLowerCase().trim()
  const map = {
    'outdoor': t('events.location.outdoor'),
    'indoor': t('events.location.indoor'),
    'both': t('events.location.both'),
    'indoor_outdoor': t('events.location.both'),
    'hybrid': t('events.location.hybrid'),
    'field': t('events.location.field'),
    '3d': t('events.location.3d'),
  }
  return map[key] || type || '-'
}

const getStatusClass = (status) => {
  const normalized = String(status || '').toLowerCase().trim()
  if (normalized === 'published' || normalized === 'active' || normalized === 'ongoing') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
  if (normalized === 'draft') {
    return 'bg-amber-50 text-amber-700 border-amber-200'
  }
  if (normalized === 'completed' || normalized === 'archived') {
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

const getStatusDotClass = (status) => {
  const normalized = String(status || '').toLowerCase().trim()
  if (normalized === 'published' || normalized === 'active' || normalized === 'ongoing') {
    return 'bg-emerald-500'
  }
  if (normalized === 'draft') {
    return 'bg-amber-500'
  }
  if (normalized === 'completed' || normalized === 'archived') {
    return 'bg-blue-500'
  }
  return 'bg-slate-400'
}

const getStatusLabel = (status) => {
  const normalized = String(status || '').toLowerCase().trim()
  if (normalized === 'published') return t('events.filter.status_published')
  if (normalized === 'draft') return t('events.filter.status_draft')
  if (normalized === 'completed') return t('events.filter.status_completed')
  if (normalized === 'ongoing') return t('events.filter.status_ongoing', 'Ongoing')
  if (normalized === 'upcoming') return t('events.filter.status_upcoming', 'Upcoming')
  if (!status) return '-'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

const handleManageEvent = (event) => {
  setTournament(event)
  setEvent(event)
  router.push(`/dashboard/organizer/tournaments/${event.slug || event.id}/overview`)
}

onMounted(() => {
  fetchEvents()
})
</script>
