<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <DashboardHeader
      :title="t('my_events.title')"
      :subtitle="t('my_events.subtitle')"
      icon="ph:trophy-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: t('my_events.title') }
      ]"
    >
      <template #actions>
        <BaseButton to="/tournaments" variant="primary" icon="ph:magnifying-glass-bold"
          class="h-11 px-5 font-black text-xs shadow-sm hover:shadow-md transition-all">
          {{ t('my_events.find_new_events') }}
        </BaseButton>
      </template>
    </DashboardHeader>

    <!-- Quick Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <!-- Total Events -->
      <StatCard
        :title="t('my_events.stats_total')"
        :value="events.length"
        icon="ph:trophy-bold"
        color="primary"
        :description="t('my_events.stats_total_desc')"
        description-icon="ph:calendar-blank-bold"
      />

      <!-- Registered & Paid Events -->
      <StatCard
        :title="t('my_events.stats_registered')"
        :value="registeredCount"
        icon="ph:check-circle-bold"
        color="primary"
        :description="t('my_events.stats_registered_desc')"
        description-icon="ph:seal-check-bold"
      />

      <!-- Pending Payment Events -->
      <StatCard
        :title="t('my_events.stats_pending')"
        :value="pendingCount"
        icon="ph:warning-circle-bold"
        color="primary"
        :description="t('my_events.stats_pending_desc')"
        description-icon="ph:hourglass-medium-bold"
      />

      <!-- Total Categories / Divisions -->
      <StatCard
        :title="t('my_events.stats_categories')"
        :value="totalCategoriesCount"
        icon="ph:crosshair-bold"
        color="primary"
        :description="t('my_events.stats_categories_desc')"
        description-icon="ph:chart-polar-bold"
      />
    </div>

    <!-- Club Invitation Notification Alert -->
    <div v-if="invitations.length > 0"
      class="flex items-center justify-between bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-sm">
      <div class="flex items-center gap-3">
        <Icon icon="ph:bell-ringing-bold" class="text-amber-500 text-xl" />
        <div>
          <h3 class="font-bold text-navy text-sm">{{ t('my_events.new_notification') }}</h3>
          <div class="text-amber-700 text-xs mt-0.5">{{ t('my_events.invitation_desc', { count: invitations.length }) }}</div>
        </div>
      </div>
      <BaseButton :to="`/dashboard/${userPersona}/notifications`" variant="white" size="sm"
        class="h-9 px-4 font-black text-[10px] tracking-wider text-amber-700 border-amber-200">
        {{ t('my_events.view_detail') }}
      </BaseButton>
    </div>

    <!-- Search & Filter Bar Container -->
    <div class="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm space-y-3">
      <div class="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <!-- Search Input Field -->
        <div class="relative flex-1 w-full min-w-[240px]">
          <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('my_events.search_placeholder')"
            class="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs font-medium"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            :title="t('common.clear')"
          >
            <Icon icon="ph:x-circle-fill" class="text-sm" />
          </button>
        </div>

        <!-- Filter Button, Reset, & Counter Group -->
        <div class="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          <button
            type="button"
            @click="showFilterModal = true"
            :class="[
              'h-10 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer',
              activeFilterCount > 0
                ? 'bg-navy text-white border-navy shadow-sm'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            ]"
          >
            <Icon icon="ph:sliders-horizontal-bold" class="text-sm" />
            <span>{{ t('common.filter') }}</span>
            <span
              v-if="activeFilterCount > 0"
              class="px-1.5 py-0.5 rounded-md bg-white/20 text-white text-xs font-black font-mono leading-none"
            >
              {{ activeFilterCount }}
            </span>
          </button>

          <!-- Reset Button -->
          <button
            v-if="hasActiveFilters"
            type="button"
            @click="resetAllFilters"
            class="h-10 px-3.5 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200 text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
            :title="t('common.reset_filters')"
          >
            <Icon icon="ph:arrow-counter-clockwise-bold" class="text-sm" />
            <span class="hidden sm:inline">{{ t('common.reset') }}</span>
          </button>

          <!-- Result Counter Tag -->
          <div class="px-3.5 py-2.5 bg-navy/5 text-navy rounded-xl font-bold text-xs sm:text-sm border border-navy/10 flex items-center gap-1.5 shrink-0">
            <Icon icon="ph:trophy-bold" class="text-sm text-navy/70" />
            <span>{{ filteredEvents.length }} {{ t('my_events.tournaments_unit') }}</span>
          </div>
        </div>
      </div>

      <!-- Active Filter Chips Bar -->
      <div
        v-if="activeFilterChips.length > 0"
        class="flex items-center gap-2 pt-2.5 flex-wrap border-t border-slate-100 animate-in fade-in duration-150"
      >
        <div class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 shrink-0 select-none">
          <Icon icon="ph:funnel-bold" class="text-xs sm:text-sm text-slate-400 shrink-0" />
          <span>{{ t('common.active_filters') }}</span>
        </div>

        <div
          v-for="chip in activeFilterChips"
          :key="chip.key"
          class="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs group hover:border-slate-300 transition-colors"
        >
          <span class="truncate max-w-[220px] text-navy font-bold leading-none">{{ chip.label }}</span>
          <button
            type="button"
            @click="removeFilterChip(chip.key)"
            class="text-slate-400 hover:text-red-500 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
            :title="t('common.remove_filter')"
          >
            <Icon icon="ph:x-bold" class="text-xs" />
          </button>
        </div>

        <button
          type="button"
          @click="resetAllFilters"
          class="inline-flex items-center text-xs sm:text-sm font-bold text-slate-500 hover:text-red-600 transition-colors ml-1 cursor-pointer"
        >
          {{ t('common.clear_all') }}
        </button>
      </div>
    </div>

    <!-- Filter Modal Dialog -->
    <DashboardArcherTournamentFilterModal
      v-model:show="showFilterModal"
      :current-filters="currentFilterState"
      @apply="handleApplyModalFilters"
      @reset="resetAllFilters"
    />

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
          <div class="text-lg font-black text-navy">{{ t('my_events.no_events') }}</div>
          <div class="text-sm text-slate-500 font-medium leading-relaxed">
            {{ emptyStateMessage }}
          </div>
        </div>
        <BaseButton v-if="searchQuery" variant="outline" size="md" @click="resetFilters" class="w-full min-h-[44px]">
          {{ t('my_events.clear_filter') }}
        </BaseButton>
        <BaseButton v-else to="/tournaments" variant="primary" size="md" icon="ph:magnifying-glass-bold" class="w-full min-h-[44px]">
          {{ t('my_events.search_event') }}
        </BaseButton>
      </div>
    </div>

    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="event in filteredEvents" :key="event.id"
          class="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden h-full shadow-2xs hover:shadow-xs">

          <!-- Card Top Header (Rich Themed Navy Gradient) -->
          <div class="p-5 pb-4 bg-gradient-to-r from-navy via-navy-dark to-slate-900 text-white relative overflow-hidden">
            <!-- Subtle Theme Motif Overlay -->
            <div class="absolute inset-0 pointer-events-none opacity-10"
              style="background-image: var(--motif-pattern);"></div>
            
            <!-- Glow Accent -->
            <div class="absolute -top-6 -right-6 size-20 rounded-full bg-primary/20 blur-xl pointer-events-none"></div>

            <div class="relative z-10 flex items-start gap-3.5">
              <!-- Organization / Event Logo -->
              <div class="size-12 rounded-xl bg-white border border-white/20 shadow-md overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                <img v-if="event.organizer_avatar_url || event.logo_url || event.banner_url"
                  :src="event.organizer_avatar_url || event.logo_url || event.banner_url"
                  class="size-full object-cover rounded-lg"
                  :alt="event.organizer_name || event.name" />
                <Icon v-else icon="ph:buildings-bold" class="text-2xl text-slate-400" />
              </div>

              <!-- Title, Organizer & Status -->
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex items-center justify-between gap-2">
                  <!-- Event Title -->
                  <NuxtLink :to="`/dashboard/archer/tournaments/${event.slug || event.id}/overview`" class="block flex-1 min-w-0">
                    <h3 class="text-base font-black text-white line-clamp-2 leading-snug">
                      {{ event.name }}
                    </h3>
                  </NuxtLink>

                  <!-- Clean Status (Vertically Centered) -->
                  <span v-if="getMainStatusLabel(event) === 'Registered'"
                    class="text-xs font-bold text-emerald-400 inline-flex items-center gap-1.5 shrink-0">
                    <span class="size-1.5 rounded-full bg-emerald-400"></span>
                    <span class="leading-none">{{ t('my_events.registered') }}</span>
                  </span>
                  <span v-else
                    class="text-xs font-bold text-amber-400 inline-flex items-center gap-1.5 shrink-0">
                    <span class="size-1.5 rounded-full bg-amber-400"></span>
                    <span class="leading-none">{{ t('my_events.pending_payment') }}</span>
                  </span>
                </div>

                <!-- Organization / Organizer Row with Icon -->
                <div v-if="event.organizer_name" class="flex items-center gap-1.5 text-xs text-slate-300 font-medium truncate pt-0.5">
                  <Icon icon="ph:buildings-bold" class="text-xs text-slate-400 shrink-0" />
                  <span class="truncate">{{ event.organizer_name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Body & Metadata -->
          <div class="p-6 space-y-6 flex-1 flex flex-col justify-between">
            <div class="space-y-4">
              <!-- Structured Metadata List (2 Columns Grid with Generous Gap) -->
              <div class="grid grid-cols-2 gap-x-4 gap-y-5 text-xs">
                <!-- Schedule -->
                <div class="flex items-start gap-3 text-slate-700 min-w-0">
                  <div class="size-8 rounded-xl bg-slate-100/90 text-slate-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:calendar-blank-bold" class="text-sm" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-slate-400 text-[11px] font-medium block leading-none mb-1.5">{{ t('my_events.schedule_label') }}</span>
                    <span class="font-bold block truncate text-slate-900 leading-tight">{{ formatDateRange(event.start_date, event.end_date) }}</span>
                  </div>
                </div>

                <!-- Venue / Location -->
                <div class="flex items-start gap-3 text-slate-700 min-w-0">
                  <div class="size-8 rounded-xl bg-slate-100/90 text-slate-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:map-pin-bold" class="text-sm" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-slate-400 text-[11px] font-medium block leading-none mb-1.5">{{ t('my_events.location_label') }}</span>
                    <span class="font-bold block truncate text-slate-900 leading-tight">{{ event.city || event.venue || event.location || '-' }}</span>
                  </div>
                </div>

                <!-- Categories -->
                <div class="flex items-start gap-3 text-slate-700 min-w-0">
                  <div class="size-8 rounded-xl bg-slate-100/90 text-slate-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:crosshair-bold" class="text-sm" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-slate-400 text-[11px] font-medium block leading-none mb-1.5">{{ t('my_events.category_label') }}</span>
                    <span class="font-bold block truncate text-slate-900 leading-tight">
                      {{ t('my_events.categories_count', { count: event.event_count || 1 }) }}
                    </span>
                  </div>
                </div>

                <!-- Participants / Athletes -->
                <div class="flex items-start gap-3 text-slate-700 min-w-0">
                  <div class="size-8 rounded-xl bg-slate-100/90 text-slate-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:users-three-bold" class="text-sm" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-slate-400 text-[11px] font-medium block leading-none mb-1.5">{{ t('my_events.participant_label') }}</span>
                    <span class="font-bold block truncate text-slate-900 leading-tight">
                      {{ t('my_events.athletes_count', { count: event.participant_count || 0 }) }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Payment Alert (Only when pending) -->
              <div v-if="event.payment_amount && event.payment_status !== 'lunas' && event.payment_status !== 'paid'"
                class="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between text-xs">
                <span class="font-medium text-amber-800">{{ t('my_events.registration_fee') }}</span>
                <span class="font-black text-amber-900 font-mono text-sm">{{ formatMoney(event.payment_amount, event.currency || 'IDR') }}</span>
              </div>
            </div>

            <!-- Card Footer Actions -->
            <div class="pt-3 flex items-center gap-2.5 border-t border-slate-100">
              <NuxtLink :to="`/dashboard/archer/tournaments/${event.slug || event.id}/overview`" class="flex-1">
                <BaseButton variant="primary" size="md" class="w-full font-bold text-xs h-11 flex items-center justify-center gap-1.5">
                  <span>{{ t('my_events.open_event') }}</span>
                  <Icon icon="ph:arrow-right-bold" class="text-sm" />
                </BaseButton>
              </NuxtLink>

              <button v-if="getMainStatusLabel(event) === 'Registered' || isPaidStatus(event)"
                @click="showQRDialog(event)"
                type="button"
                :title="t('my_events.qr_instructions')"
                class="size-10 rounded-xl bg-slate-100 hover:bg-navy hover:text-white text-slate-700 flex items-center justify-center transition-colors border border-slate-200 shrink-0">
                <Icon icon="ph:qr-code-bold" class="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalItems > limit" class="pt-6">
        <BasePagination v-model:items-per-page="limit" :current-page="currentPage" :total-items="totalItems"
          :no-margin="true" @change-page="handlePageChange" />
      </div>
    </div>

    <!-- Clean Minimalist QR Code Modal Dialog -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showQR" class="fixed inset-0 z-[999] bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto" @click="showQR = false">
          
          <Transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-2">
            <div v-if="showQR" class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 flex flex-col items-center text-center space-y-4 my-auto" @click.stop>
              
              <!-- Close Button -->
              <button @click="showQR = false"
                type="button"
                class="absolute top-4 right-4 size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-colors">
                <Icon icon="ph:x-bold" class="text-sm" />
              </button>

              <!-- Header Info -->
              <div class="space-y-1 pt-1 pr-6 pl-6">
                <h3 class="text-base font-black text-navy leading-tight">
                  {{ t('my_events.qr_modal_title') }}
                </h3>
                <div class="text-xs text-slate-500 font-medium truncate max-w-[240px]">
                  {{ selectedEvent?.name }}
                </div>
              </div>

              <!-- QR Code Card -->
              <div class="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <qrcode-vue
                  :value="selectedEvent?.qr_raw || (selectedEvent?.participant_uuid ? ('ARCHERIS-CHECKIN:' + selectedEvent.participant_uuid) : (selectedEvent?.slug || selectedEvent?.id || 'N/A'))"
                  :size="210"
                  level="H"
                  render-as="svg"
                  class="max-w-full h-auto" />
              </div>

              <!-- Concise Subtitle Redaksi -->
              <div class="text-xs text-slate-500 leading-relaxed max-w-[260px]">
                {{ t('my_events.qr_modal_subtitle') }}
              </div>

              <!-- Action Buttons -->
              <div class="w-full space-y-2 pt-1">
                <NuxtLink :to="`/dashboard/archer/tournaments/${selectedEvent?.slug || selectedEvent?.id}/my-registration`" class="block w-full">
                  <BaseButton variant="primary" block class="h-10 text-xs font-bold justify-center shadow-xs">
                    <span>{{ t('my_events.qr_modal_view_ticket') }}</span>
                    <Icon icon="ph:arrow-right-bold" class="ml-1 text-xs" />
                  </BaseButton>
                </NuxtLink>

                <button type="button" @click="showQR = false"
                  class="text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors py-1">
                  {{ t('my_events.qr_modal_close') }}
                </button>
              </div>

            </div>
          </Transition>

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
import { useI18n } from 'vue-i18n'
import { formatMoney } from '~/composables/useCurrency'

const { t } = useI18n()
const { get, post } = useApi()
const toast = useToast()
const { user } = useAuth()

const searchQuery = ref('')
const statusFilter = ref('all')
const timelineFilter = ref('all')
const sortFilter = ref('date_desc')
const showFilterModal = ref(false)
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

const currentFilterState = computed(() => ({
  status: statusFilter.value,
  timeline: timelineFilter.value,
  sort: sortFilter.value
}))

const handleApplyModalFilters = (filters) => {
  statusFilter.value = filters.status || 'all'
  timelineFilter.value = filters.timeline || 'all'
  sortFilter.value = filters.sort || 'date_desc'
  currentPage.value = 1
}

const activeFilterCount = computed(() => {
  let count = 0
  if (statusFilter.value !== 'all') count++
  if (timelineFilter.value !== 'all') count++
  if (sortFilter.value !== 'date_desc') count++
  return count
})

const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || statusFilter.value !== 'all' || timelineFilter.value !== 'all' || sortFilter.value !== 'date_desc'
})

const activeFilterChips = computed(() => {
  const chips = []
  if (searchQuery.value.trim()) {
    chips.push({
      key: 'search',
      label: `"${searchQuery.value.trim()}"`
    })
  }
  if (statusFilter.value !== 'all') {
    chips.push({
      key: 'status',
      label: statusFilter.value === 'paid' ? t('my_events.opt_registered') : t('my_events.opt_pending')
    })
  }
  if (timelineFilter.value !== 'all') {
    const labels = {
      upcoming: t('my_events.opt_upcoming'),
      ongoing: t('my_events.opt_ongoing'),
      past: t('my_events.opt_past')
    }
    chips.push({
      key: 'timeline',
      label: labels[timelineFilter.value] || timelineFilter.value
    })
  }
  if (sortFilter.value !== 'date_desc') {
    const sortLabels = {
      date_asc: t('my_events.sort_date_asc'),
      name_asc: t('my_events.sort_name_asc'),
      name_desc: t('my_events.sort_name_desc')
    }
    chips.push({
      key: 'sort',
      label: sortLabels[sortFilter.value] || sortFilter.value
    })
  }
  return chips
})

const removeFilterChip = (key) => {
  if (key === 'search') searchQuery.value = ''
  if (key === 'status') statusFilter.value = 'all'
  if (key === 'timeline') timelineFilter.value = 'all'
  if (key === 'sort') sortFilter.value = 'date_desc'
  currentPage.value = 1
}

const resetAllFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  timelineFilter.value = 'all'
  sortFilter.value = 'date_desc'
  currentPage.value = 1
}

const registeredCount = computed(() => {
  return events.value.filter(e => getMainStatusLabel(e) === 'Registered' || isPaidStatus(e)).length
})

const pendingCount = computed(() => {
  return events.value.filter(e => getMainStatusLabel(e) !== 'Registered' && !isPaidStatus(e)).length
})

const totalCategoriesCount = computed(() => {
  return events.value.reduce((sum, e) => sum + (e.event_count || 1), 0)
})

watch([searchQuery, statusFilter, timelineFilter, sortFilter], () => {
  currentPage.value = 1
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

    const response = await get(`/archers/my/tournaments?${params.toString()}`)
    events.value = response?.tournaments || response?.events || []
    totalItems.value = response?.total || 0
  } catch (error) {
    console.error('Failed to fetch events:', error)
    toast.error(getApiErrorMessage(error, t('my_events.toast_load_failed')))
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
    toast.success(action === 'accept' ? t('my_events.toast_join_success') : t('my_events.toast_invitation_rejected'))
    invitations.value = invitations.value.filter(i => i.uuid !== memberId)
    if (action === 'accept') window.location.reload()
  } catch (error) {
    console.error('Failed to respond to invitation:', error)
    toast.error(t('my_events.toast_process_failed'))
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
  resetAllFilters()
}

const showQRDialog = (event) => {
  selectedEvent.value = event
  showQR.value = true
}

const filteredEvents = computed(() => {
  let list = events.value.filter(e => {
    const q = searchQuery.value.trim().toLowerCase()
    const matchesSearch = !q ||
      e.name?.toLowerCase().includes(q) ||
      e.code?.toLowerCase().includes(q) ||
      e.city?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q) ||
      e.organizer_name?.toLowerCase().includes(q)

    if (!matchesSearch) return false

    // Status filter
    if (statusFilter.value === 'paid' || statusFilter.value === 'registered') {
      if (!(getMainStatusLabel(e) === 'Registered' || isPaidStatus(e))) return false
    } else if (statusFilter.value === 'pending') {
      if (getMainStatusLabel(e) === 'Registered' || isPaidStatus(e)) return false
    }

    // Timeline filter
    if (timelineFilter.value !== 'all') {
      const tStatus = getEventTimelineStatus(e)?.label
      if (timelineFilter.value === 'upcoming' && tStatus !== 'Akan Datang') return false
      if (timelineFilter.value === 'ongoing' && tStatus !== 'Berlangsung') return false
      if (timelineFilter.value === 'past' && tStatus !== 'Selesai') return false
    }

    return true
  })

  // Sorting
  return list.sort((a, b) => {
    if (sortFilter.value === 'date_asc') {
      const tA = new Date(a.start_date || 0).getTime()
      const tB = new Date(b.start_date || 0).getTime()
      return tA - tB
    }
    if (sortFilter.value === 'name_asc') {
      return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' })
    }
    if (sortFilter.value === 'name_desc') {
      return (b.name || '').localeCompare(a.name || '', undefined, { sensitivity: 'base' })
    }
    // Default date_desc
    const tA = new Date(a.start_date || 0).getTime()
    const tB = new Date(b.start_date || 0).getTime()
    return tB - tA
  })
})

const emptyStateMessage = computed(() => {
  if (searchQuery.value) {
    return t('my_events.no_events_search_desc')
  }
  return t('my_events.no_events_registered_desc')
})

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

const formatDateRange = (start, end) => {
  if (!start) return '-'
  const s = new Date(start)
  if (!end || start === end) {
    return s.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const e = new Date(end)
  const sStr = s.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  const eStr = e.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${sStr} - ${eStr}`
}

const getEventTimelineStatus = (event) => {
  if (!event || !event.start_date) return null
  const now = new Date()
  const start = new Date(event.start_date)
  const end = event.end_date ? new Date(event.end_date) : new Date(event.start_date)
  end.setHours(23, 59, 59, 999)

  if (now >= start && now <= end) {
    return { label: 'Berlangsung', class: 'bg-emerald-500/90 text-white animate-pulse' }
  } else if (now < start) {
    return { label: 'Akan Datang', class: 'bg-navy/80 text-white' }
  } else {
    return { label: 'Selesai', class: 'bg-slate-700/80 text-slate-200' }
  }
}

const getPaymentStatusClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'paid' || s === 'lunas') return 'bg-green-50 text-green-700 border-green-100'
  return 'bg-amber-50 text-amber-700 border-amber-100'
}

const getPaymentStatusDotClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'paid' || s === 'lunas') return 'bg-green-500'
  return 'bg-amber-500'
}

const getPaymentStatusLabel = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'paid' || s === 'lunas') return 'Registered'
  return 'Pending'
}

const getStatusClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'rejected') return 'bg-red-50 text-red-700 border-red-100'
  if (s === 'approved' || s === 'terdaftar' || s === 'registered') return 'bg-green-50 text-green-700 border-green-100'
  return 'bg-amber-50 text-amber-700 border-amber-100'
}

const getStatusDotClass = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'rejected') return 'bg-red-500'
  if (s === 'approved' || s === 'terdaftar' || s === 'registered') return 'bg-green-500'
  return 'bg-amber-500'
}

const getStatusLabel = (status) => {
  const s = (status || '').toLowerCase()
  if (s === 'rejected') return 'Rejected'
  if (s === 'approved' || s === 'terdaftar' || s === 'registered') return 'Registered'
  return 'Pending'
}

const getMainStatusLabel = (event) => {
  const pStatus = (event.participant_status || '').toLowerCase()
  const payStatus = (event.payment_status || '').toLowerCase()
  if (pStatus === 'rejected') return 'Rejected'
  if (payStatus === 'lunas' || payStatus === 'paid') return 'Registered'
  return 'Pending'
}

const getMainStatusClass = (event) => {
  const pStatus = (event.participant_status || '').toLowerCase()
  const payStatus = (event.payment_status || '').toLowerCase()
  if (pStatus === 'rejected') return getStatusClass('rejected')
  if (payStatus === 'lunas' || payStatus === 'paid') return getStatusClass('approved')
  return getStatusClass('pending')
}

const getMainStatusTextClass = (event) => {
  const pStatus = (event.participant_status || '').toLowerCase()
  const payStatus = (event.payment_status || '').toLowerCase()
  if (pStatus === 'rejected') return 'text-red-600'
  if (payStatus === 'lunas' || payStatus === 'paid') return 'text-green-600'
  return 'text-amber-600'
}

const getMainStatusDotClass = (event) => {
  const pStatus = (event.participant_status || '').toLowerCase()
  const payStatus = (event.payment_status || '').toLowerCase()
  if (pStatus === 'rejected') return getStatusDotClass('rejected')
  if (payStatus === 'lunas' || payStatus === 'paid') return getStatusDotClass('approved')
  return getStatusDotClass('pending')
}

const isPaidStatus = (event) => {
  const payStatus = (event?.payment_status || '').toLowerCase()
  return payStatus === 'lunas' || payStatus === 'paid' || getMainStatusLabel(event) === 'Registered'
}
</script>
