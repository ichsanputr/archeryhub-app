<template>
  <div class="space-y-6">
    <!-- Header (Identical to Cart Page Header) -->
    <DashboardHeader
      :title="t('my_events.title')"
      :subtitle="t('my_events.subtitle')"
      icon="ph:calendar-blank-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/archer' },
        { label: t('my_events.title') }
      ]"
    />

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

    <!-- Search & Filter Card -->
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-grow w-full">
        <BaseInput v-model="searchQuery" icon="ph:magnifying-glass-bold"
          :placeholder="t('my_events.search_placeholder')" :label="t('my_events.search_label')" />
      </div>
      <BaseButton variant="white" icon="ph:funnel-bold" @click="resetFilters"
        class="h-11 font-black tracking-widest text-xs">
        {{ t('my_events.reset') }}
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
          <div class="text-lg font-black text-navy">{{ t('my_events.no_events') }}</div>
          <div class="text-sm text-slate-500 font-medium leading-relaxed">
            {{ emptyStateMessage }}
          </div>
        </div>
        <BaseButton v-if="searchQuery" variant="outline" size="md" @click="resetFilters" class="w-full min-h-[44px]">
          {{ t('my_events.clear_filter') }}
        </BaseButton>
        <BaseButton v-else to="/events" variant="primary" size="md" icon="ph:magnifying-glass-bold" class="w-full min-h-[44px]">
          {{ t('my_events.search_event') }}
        </BaseButton>
      </div>
    </div>

    <div v-else class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="event in filteredEvents" :key="event.id"
          class="group bg-white rounded-2xl border border-slate-100 p-5 flex flex-col shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 relative overflow-hidden">

          <!-- Decorative Background -->
          <div
            class="absolute -right-4 -bottom-4 size-24 bg-slate-50/50 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors">
          </div>

          <!-- Card Header -->
          <div class="flex items-start gap-3 mb-4 relative z-10">
            <div
              class="size-14 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center shrink-0 border-2 border-slate-100 group-hover:border-primary/30 transition-all shadow-sm">
              <img v-if="event.logo_url" :src="event.logo_url" class="size-full object-cover" />
              <Icon v-else icon="ph:trophy-bold"
                class="text-2xl text-slate-300 group-hover:text-primary transition-colors" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5 mb-1.5">
                <span class="px-1.5 py-0.5 bg-navy text-primary rounded text-[8px] font-black tracking-widest ">{{
                  event.code?.toUpperCase() || 'EVENT' }}</span>
                <span v-if="event.city" class="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[8px] font-bold">
                  <Icon icon="ph:map-pin-bold" class="inline text-[9px]" /> {{ event.city }}
                </span>
              </div>
              <h3
                class="text-sm font-black text-navy leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-0.5">
                {{ event.name }}
              </h3>
              <div v-if="event.organizer_name" class="text-[10px] text-slate-400 font-medium truncate">
                <Icon icon="ph:buildings-bold" class="inline text-[9px]" /> {{ event.organizer_name }}
              </div>
            </div>
          </div>

          <!-- Card Body - Event Details Grid (2 columns) -->
          <div class="grid grid-cols-2 gap-2 mb-4 relative z-10">
            <!-- Date -->
            <div class="flex items-start gap-2">
              <div class="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon icon="ph:calendar-blank-bold" class="text-xs" />
              </div>
              <div class="min-w-0">
                <div class="text-[8px] font-black text-slate-400 tracking-widest mb-0.5">{{ t('my_events.schedule') }}</div>
                <div class="text-[11px] font-bold text-navy truncate">{{ formatDate(event.start_date) }}</div>
              </div>
            </div>

            <!-- Location -->
            <div class="flex items-start gap-2">
              <div class="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon icon="ph:map-pin-bold" class="text-xs" />
              </div>
              <div class="min-w-0">
                <div class="text-[8px] font-black text-slate-400 tracking-widest mb-0.5">{{ t('my_events.location') }}</div>
                <div class="text-[11px] font-bold text-navy truncate">{{ event.venue || event.location || '-' }}</div>
              </div>
            </div>



            <!-- Registration Number -->
            <div v-if="event.back_number" class="flex items-start gap-2">
              <div class="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Icon icon="ph:identification-badge-bold" class="text-xs" />
              </div>
              <div class="min-w-0">
                <div class="text-[8px] font-black text-slate-400 tracking-widest mb-0.5">{{ t('my_events.back_number') }}</div>
                <div class="text-[11px] font-black text-navy">{{ event.back_number }}</div>
              </div>
            </div>
          </div>

          <!-- Status & Payment Info -->
          <div class="mb-4 relative z-10 space-y-2">
            <!-- Main Status Text -->
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-black text-slate-400 tracking-widest">STATUS</span>
              <div class="flex items-center gap-1.5">
                <span :class="getMainStatusDotClass(event)" class="size-1.5 rounded-full animate-pulse"></span>
                <span :class="getMainStatusTextClass(event)" class="text-[10px] font-black tracking-wider">
                  {{ getMainStatusLabel(event) }}
                </span>
              </div>
            </div>
            
            <!-- Payment Amount if unpaid -->
            <div v-if="event.payment_amount && event.payment_status !== 'lunas' && event.payment_status !== 'paid'"
              class="flex items-center justify-between pt-2 border-t border-slate-100">
              <span class="text-[10px] font-bold text-slate-500">Payment Due</span>
              <span class="text-sm font-black text-amber-600">
                Rp {{ Number(event.payment_amount).toLocaleString('id-ID') }}
              </span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="mt-auto pt-4 border-t border-slate-100 grid grid-cols-5 gap-2 relative z-10">
            <BaseButton :to="`/dashboard/archer/events/${event.slug || event.id}/my-registration`" variant="primary"
              size="md" :class="getMainStatusLabel(event) === 'Registered' ? 'col-span-4' : 'col-span-5'"
              class="font-black tracking-wider text-xs h-11 min-h-[44px] shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all">
              <Icon icon="ph:arrow-right-bold" class="text-base" />
              {{ t('my_events.open_event') }}
            </BaseButton>
            
            <!-- QR Code Button if registered -->
            <button v-if="getMainStatusLabel(event) === 'Registered'" @click="showQRDialog(event)"
              class="col-span-1 h-11 min-h-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-navy flex items-center justify-center transition-all border border-slate-200 hover:border-slate-300">
              <Icon icon="ph:qr-code-bold" class="text-lg" />
            </button>
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
                <div class="text-sm sm:text-base text-slate-500 font-bold tracking-widest">{{
                  selectedEvent?.name }}</div>
              </div>

              <!-- QR Code -->
              <div class="bg-white p-6 sm:p-8 rounded-[40px] border-2 border-slate-100 shadow-2xl">
                <qrcode-vue :value="selectedEvent?.qr_raw || selectedEvent?.id || 'N/A'" :size="isMobile ? 280 : 350" level="H"
                  render-as="svg" />
              </div>

              <!-- Info -->
              <div class="text-center">
                <div class="text-xs text-slate-400 font-bold tracking-widest">{{ t('my_events.qr_instructions') }}</div>
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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
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
  searchQuery.value = ''
}

const showQRDialog = (event) => {
  selectedEvent.value = event
  showQR.value = true
}

const filteredEvents = computed(() => events.value)

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
</script>
