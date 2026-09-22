<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('dashboard.participants_list.title')"
      :subtitle="t('dashboard.participants_list.subtitle')"
      icon="ph:users"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
        { label: t('dashboard.participants_list.title') }
      ]"
    >
      <template #actions>
        <div class="flex gap-3 flex-shrink-0">
          <BaseButton variant="white" icon="ph:check-square-offset-bold" class="h-10 sm:h-11 px-4 border-white/20 text-xs sm:text-sm font-bold"
            @click="showBatchCheckinModal = true">
            <span class="hidden sm:inline">Check-in Kolektif</span>
            <span class="sm:hidden">Check-in</span>
          </BaseButton>
          <BaseButton variant="white" icon="ph:download" class="h-10 sm:h-11 px-5 border-white/20 text-xs sm:text-sm font-bold"
            :loading="isExporting"
            @click="canExportData ? exportCSV() : (showPremiumModal = true)"
            :class="{ 'opacity-50 grayscale cursor-not-allowed': !canExportData }">
            <span class="hidden sm:inline">{{ t('dashboard.participants_list.export_csv') }}</span>
            <span class="sm:hidden">{{ t('dashboard.participants_list.export_short') }}</span>
          </BaseButton>
          <BaseButton :to="canCreateEvent ? `/dashboard/organizer/tournaments/${eventId}/participants/add` : undefined"
            variant="primary" icon="ph:user-plus-bold"
            class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
            :class="{ 'opacity-50 grayscale cursor-not-allowed': !canCreateEvent }"
            @click="!canCreateEvent && (showPremiumModal = true)">
            {{ t('dashboard.participants_list.add_participant') }}
          </BaseButton>
        </div>
      </template>
    </DashboardHeader>
        <PremiumRequiredModal v-model:show="showPremiumModal" :feature="premiumFeature" />
        <ImportParticipantsModal v-model:show="showImportModal" :event-id="eventId" @imported="loadParticipants" />

        <!-- Batch Check-in Modal -->
        <div
          v-if="showBatchCheckinModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-150"
          @click.self="showBatchCheckinModal = false"
        >
          <div class="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <div class="flex items-center gap-3 mb-4">
              <div class="size-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-black">
                <Icon icon="ph:check-square-offset-bold" class="size-5" />
              </div>
              <div>
                <h4 class="font-black text-navy dark:text-white text-base">Check-in Kehadiran Kolektif</h4>
                <div class="text-xs text-slate-400">Tandai kehadiran atlet kontingen/klub sekaligus</div>
              </div>
            </div>

            <div class="space-y-4 mb-5">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Pilih Kontingen / Klub</label>
                <select
                  v-model="selectedBatchClub"
                  class="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl outline-none font-medium text-navy dark:text-white"
                >
                  <option value="">-- Pilih Kontingen / Klub --</option>
                  <option v-for="c in availableClubs" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div class="p-3.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/70 dark:border-slate-600/50 text-xs text-slate-600 dark:text-slate-300">
                <div class="flex items-center gap-2 font-bold text-navy dark:text-white mb-1">
                  <Icon icon="ph:info-bold" class="text-primary size-4" />
                  <span>Ketentuan Check-in Kehadiran</span>
                </div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400">
                  Hanya atlet yang status pendaftarannya <strong>Lunas</strong> pada klub yang dipilih yang akan di-check-in kehadirannya.
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-2">
              <button
                @click="showBatchCheckinModal = false"
                class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                @click="executeBatchCheckin"
                :disabled="!selectedBatchClub || isBatchProcessing"
                class="px-4 py-2 bg-primary hover:bg-primary-hover disabled:opacity-50 text-btn-text rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <Icon v-if="isBatchProcessing" icon="ph:spinner-bold" class="size-3.5 animate-spin" />
                <span>Konfirmasi Check-in</span>
              </button>
            </div>
          </div>
        </div>

        <ParticipantFilterModal
            v-model:show="showFilterModal"
            :categories="categories"
            :current-filters="filters"
            @apply="handleApplyModalFilters"
            @reset="resetAllFilters"
        />

    <!-- Unified DashboardDataTable (Category A: Modal Filter) -->
    <DashboardDataTable
      :items="filteredParticipants"
      :columns="tableColumns"
      :loading="isLoading"
      :searchable="true"
      :search-placeholder="t('dashboard.participants_list.search_placeholder')"
      :has-filter-modal="true"
      :filter-button-label="t('common.filter')"
      :active-filter-count="activeFilterCount"
      :active-filter-chips="activeFilterChips"
      :show-reset-button="hasActiveFilters"
      count-icon="ph:users-three-bold"
      :count-unit="t('dashboard.participants_list.archers_unit')"
      :show-count-badge="true"
      :empty-title="t('dashboard.participants_list.no_participants')"
      empty-icon="ph:users-three-bold"
      :items-per-page="limit"
      :initial-sort-by="sortBy"
      :initial-sort-order="sortOrder"
      @search="handleTableSearch"
      @sort="handleTableSort"
      @open-filter="showFilterModal = true"
      @reset-filters="resetAllFilters"
      @remove-chip="removeFilterChip"
    >
      <!-- Profile Column Slot -->
      <template #item-profile="{ item }">
        <div class="flex items-center gap-3 py-1">
          <div class="size-10 rounded-full bg-slate-100 flex items-center justify-center text-navy font-bold text-xs border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
            <img :src="useImageOrDefault(item.avatar_url, item.full_name)" class="size-full object-cover" />
          </div>
          <div class="min-w-0 py-0.5">
            <div class="text-xs sm:text-sm font-black text-navy leading-tight hover:text-primary transition-colors truncate" :title="item.full_name">
              {{ item.full_name || '-' }}
            </div>
            <div class="text-[11px] text-slate-400 font-medium mt-0.5 truncate" :title="item.email">
              {{ item.email || '-' }}
            </div>
          </div>
        </div>
      </template>

      <!-- Club & City Column Slot -->
      <template #item-club="{ item }">
        <div class="flex flex-col py-1">
          <span class="text-xs font-bold text-slate-700 leading-snug truncate">{{ item.club_name || '-' }}</span>
          <span v-if="item.city" class="text-[10px] text-slate-400 font-bold tracking-wider truncate">{{ item.city }}</span>
        </div>
      </template>

      <!-- Category Column Slot (if category filter is active) -->
      <template #item-category="{ item }">
        <div class="flex flex-wrap gap-1.5 max-w-[360px] py-1">
          <span v-for="label in getFilteredCategoryLabels(item)" :key="label"
            class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-black bg-navy/5 text-navy border border-navy/10">
            {{ label }}
          </span>
        </div>
      </template>

      <!-- Payment Status Column Slot -->
      <template #item-status="{ item }">
        <div class="flex items-center gap-1.5 flex-wrap py-1">
          <span :class="getStatusClass(item.payment_status || item.status)"
            class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border capitalize">
            {{ getDisplayStatus(item.payment_status || item.status) }}
          </span>
          <NuxtLink
            v-if="item.proof_url || item.payment_proof_url || (item.payment_status === 'pending' && item.payment_id)"
            :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${item.archer_id || item.athlete_code}`"
            class="size-6 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center transition-colors shadow-2xs"
            :title="t('participant.detail.transfer_proof_label', 'Lihat Bukti Transfer')">
            <Icon icon="ph:image-bold" class="text-xs" />
          </NuxtLink>
        </div>
      </template>

      <!-- Reregistration Column Slot -->
      <template #item-reregistration="{ item }">
        <div class="py-1">
          <button
            type="button"
            @click="toggleReregister(item)"
            :disabled="isTogglingReregister[item.athlete_code || item.archer_id]"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all cursor-pointer select-none"
            :class="item.last_reregistration_at 
              ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100/70 hover:border-green-300' 
              : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100 hover:border-slate-300 hover:text-navy'">
            <Icon v-if="isTogglingReregister[item.athlete_code || item.archer_id]" icon="ph:circle-notch" class="animate-spin text-sm" />
            <Icon v-else-if="item.last_reregistration_at" icon="ph:check-bold" class="text-sm" />
            <Icon v-else icon="ph:minus-bold" class="text-sm" />
            <span>{{ item.last_reregistration_at ? t('dashboard.participants_list.reregistered') : t('dashboard.participants_list.not_reregistered') }}</span>
          </button>
        </div>
      </template>

      <!-- Actions Column Slot -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end gap-1.5">
          <BaseButton
            :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${item.archer_id || item.athlete_code}`"
            variant="white" size="sm" icon="ph:eye-bold"
            class="h-9 w-9 p-0 text-slate-400 hover:text-navy border-slate-200 shadow-2xs"
            :title="t('dashboard.participants_list.view_details')" />
          <BaseButton
            :to="`/dashboard/organizer/tournaments/${eventId}/participants/edit?archer_id=${item.archer_id || item.athlete_code}`"
            variant="white" size="sm" icon="ph:pencil-simple-bold"
            class="h-9 w-9 p-0 text-slate-400 hover:text-primary hover:border-primary/30 border-slate-200 shadow-2xs"
            :title="t('dashboard.participants_list.edit_button')" />
        </div>
      </template>
    </DashboardDataTable>

    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useTournamentContext'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import { useImageOrDefault } from '~/composables/useImageHelper'
import ImportParticipantsModal from '~/components/dashboard/ImportParticipantsModal.vue'
import ParticipantFilterModal from '~/components/dashboard/ParticipantFilterModal.vue'

definePageMeta({
    layout: 'dashboard'
})

const { t, locale } = useI18n()

useHead({
    title: computed(() => `${t('dashboard.participants_list.meta_title')} - Archeris Dashboard`)
})

const route = useRoute()
const eventId = computed(() => route.params.id)
const { get, put, post } = useApi()
const toast = useToast()

const showImportModal = ref(false)
const isTogglingReregister = ref({})

// Batch Check-in state
const showBatchCheckinModal = ref(false)
const selectedBatchClub = ref('')
const isBatchProcessing = ref(false)

const availableClubs = computed(() => {
    const clubs = new Set()
    for (const p of participants.value) {
        const c = p.club_name || p.club
        if (c && typeof c === 'string' && c.trim()) clubs.add(c.trim())
    }
    return Array.from(clubs).sort()
})

const executeBatchCheckin = async () => {
    if (!selectedBatchClub.value) return
    isBatchProcessing.value = true
    try {
        const targetParticipants = participants.value.filter(p => {
            const club = p.club_name || p.club
            const isPaid = p.payment_status === 'paid' || p.payment_status === 'lunas'
            return club === selectedBatchClub.value && isPaid
        })
        const targetIds = targetParticipants.map(p => p.uuid || p.id).filter(Boolean)

        if (targetIds.length === 0) {
            toast.error('Tidak ada atlet dengan status lunas pada klub ini')
            return
        }

        const res = await post(`/tournaments/${eventId.value}/checkin/batch`, {
            participant_ids: targetIds
        })

        toast.success(res?.message || 'Check-in kehadiran kolektif berhasil')
        showBatchCheckinModal.value = false
        selectedBatchClub.value = ''
        fetchParticipants()
    } catch (err) {
        toast.error(err?.data?.error || 'Gagal melakukan check-in kolektif')
    } finally {
        isBatchProcessing.value = false
    }
}

const toggleReregister = async (participant) => {
    const id = participant.athlete_code || participant.archer_id
    if (!id) return
    
    isTogglingReregister.value[id] = true
    try {
        const isCurrentlyRegistered = !!participant.last_reregistration_at
        const payload = {
            reregistered: !isCurrentlyRegistered,
            athlete_id: participant.archer_id
        }
        
        await put(`/tournaments/${eventId.value}/participants/${id}`, payload)
        
        // Update local status directly so we don't reload the table
        participant.last_reregistration_at = isCurrentlyRegistered ? null : new Date().toISOString()
        
        toast.success(t('dashboard.participants_list.reregistration_success'))
    } catch (error) {
        console.error('Failed to toggle re-registration status:', error)
        toast.error(error?.data?.error || t('common.error_saving'))
    } finally {
        isTogglingReregister.value[id] = false
    }
}
const { setEvent, clearEvent } = useEventContext()
const apiBaseUrl = useApiBaseUrl()
const { isSubscriptionActive, canExportData, canCreateEvent } = useSubscription()
const showPremiumModal = ref(false)

const premiumFeature = computed(() => {
    if (!isSubscriptionActive.value) return 'active_subscription'
    return 'export_data'
})

const breadcrumbItems = computed(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Tournaments', path: '/dashboard/organizer/tournaments' }
])

const participants = ref([])
const categories = ref([])
const total = ref(0)
const verifiedCount = ref(0)
const pendingCount = ref(0)
const page = ref(1)
const limit = ref(10)
const totalPages = computed(() => Math.ceil(total.value / limit.value))

// Table columns configuration
const isEn = computed(() => locale.value !== 'id')

const tableColumns = computed(() => {
    const cols = [
        { key: 'profile', label: t('dashboard.participants_list.table.name_email'), sortable: true, sortKey: 'name', width: 'w-[28%]' },
        { key: 'club', label: t('dashboard.participants_list.table.club_city'), sortable: true, sortKey: 'club', width: 'w-[18%]' }
    ]
    if (hasActiveCategoryFilter.value) {
        cols.push({ key: 'category', label: t('dashboard.participants_list.table.category'), sortable: false, width: 'w-[22%]' })
    }
    cols.push(
        { key: 'status', label: t('dashboard.participants_list.table.payment_status'), sortable: true, sortKey: 'payment_status', width: 'w-[16%]' },
        { key: 'reregistration', label: t('dashboard.participants_list.reregistration'), sortable: true, sortKey: 'reregistration', width: 'w-[16%]' }
    )
    return cols
})

// Table sorting state
const sortBy = ref('name')
const sortOrder = ref('asc')

const handleTableSearch = (q) => {
    searchQuery.value = q
    page.value = 1
    fetchParticipants()
}

const handleTableSort = ({ sortBy: field, sortOrder: direction }) => {
    sortBy.value = field === 'profile' ? 'name' : (field === 'status' ? 'payment_status' : field)
    sortOrder.value = direction
    page.value = 1
    fetchParticipants()
}

const toggleSort = (field) => {
    if (sortBy.value === field) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = field
        sortOrder.value = 'asc'
    }
    page.value = 1
    fetchParticipants()
}

const handleSortChange = () => {
    page.value = 1
    fetchParticipants()
}

const handlePageChange = (newPage) => {
    page.value = newPage
    fetchParticipants()
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

const showFilterModal = ref(false)
const searchQuery = ref('')
const isLoading = ref(true)

// Unified Filters State
const filters = ref({
    status: 'Semua',
    reregistration: 'Semua',
    categoryIds: [],
    divisions: [],
    ageGroups: [],
    gender: 'Semua',
    club: ''
})

const activeFilterCount = computed(() => {
    let count = 0
    if (filters.value.status && filters.value.status !== 'Semua') count++
    if (filters.value.reregistration && filters.value.reregistration !== 'Semua') count++
    if (filters.value.gender && filters.value.gender !== 'Semua') count++
    if (filters.value.divisions && filters.value.divisions.length > 0) count++
    if (filters.value.ageGroups && filters.value.ageGroups.length > 0) count++
    if (filters.value.categoryIds && filters.value.categoryIds.length > 0) count++
    if (filters.value.club && filters.value.club.trim() !== '') count++
    return count
})

const hasActiveFilters = computed(() => activeFilterCount.value > 0 || !!searchQuery.value)

const activeFilterChips = computed(() => {
    const chips = []
    if (filters.value.status && filters.value.status !== 'Semua') {
        let label = t('dashboard.participants_list.status_options.pending')
        if (filters.value.status === 'paid') {
            label = t('dashboard.participants_list.status_options.paid')
        } else if (filters.value.status === 'unpaid') {
            label = isEn.value ? 'Unpaid' : 'Belum Bayar'
        }
        chips.push({ key: 'status', label: `${t('dashboard.participants_list.filter_modal.payment_status')}: ${label}` })
    }
    if (filters.value.reregistration && filters.value.reregistration !== 'Semua') {
        const label = filters.value.reregistration === 'reregistered'
            ? t('dashboard.participants_list.filter_modal.already_reregistered')
            : t('dashboard.participants_list.filter_modal.not_yet_reregistered')
        chips.push({ key: 'reregistration', label: `${t('dashboard.participants_list.reregistration')}: ${label}` })
    }
    if (filters.value.gender && filters.value.gender !== 'Semua') {
        const label = filters.value.gender === 'male'
            ? t('dashboard.participants_list.filter_modal.gender_male')
            : t('dashboard.participants_list.filter_modal.gender_female')
        chips.push({ key: 'gender', label: `${t('dashboard.participants_list.filter_modal.gender')}: ${label}` })
    }
    if (filters.value.divisions && filters.value.divisions.length > 0) {
        chips.push({ key: 'divisions', label: `${t('dashboard.participants_list.filter_modal.bow_division')}: ${filters.value.divisions.join(', ')}` })
    }
    if (filters.value.ageGroups && filters.value.ageGroups.length > 0) {
        chips.push({ key: 'ageGroups', label: `${t('dashboard.participants_list.filter_modal.age_group')}: ${filters.value.ageGroups.join(', ')}` })
    }
    if (filters.value.categoryIds && filters.value.categoryIds.length > 0) {
        const count = filters.value.categoryIds.length
        chips.push({ key: 'categoryIds', label: `${t('dashboard.participants_list.table.category')}: ${count} ${t('common.selected')}` })
    }
    if (filters.value.club && filters.value.club.trim() !== '') {
        chips.push({ key: 'club', label: `${t('dashboard.participants_list.filter_modal.club_filter')}: ${filters.value.club}` })
    }
    return chips
})

const removeFilterChip = (key) => {
    if (key === 'status') filters.value.status = 'Semua'
    else if (key === 'reregistration') filters.value.reregistration = 'Semua'
    else if (key === 'gender') filters.value.gender = 'Semua'
    else if (key === 'divisions') filters.value.divisions = []
    else if (key === 'ageGroups') filters.value.ageGroups = []
    else if (key === 'categoryIds') filters.value.categoryIds = []
    else if (key === 'club') filters.value.club = ''
    page.value = 1
    fetchParticipants()
}

const handleApplyModalFilters = (newFilters) => {
    filters.value = { ...newFilters }
    page.value = 1
    fetchParticipants()
}

const resetAllFilters = () => {
    searchQuery.value = ''
    filters.value = {
        status: 'Semua',
        reregistration: 'Semua',
        categoryIds: [],
        divisions: [],
        ageGroups: [],
        gender: 'Semua',
        club: ''
    }
    sortBy.value = 'name'
    sortOrder.value = 'asc'
    page.value = 1
    fetchParticipants()
}

const hasActiveCategoryFilter = computed(() => {
    return (
        (Array.isArray(filters.value.categoryIds) && filters.value.categoryIds.length > 0) ||
        (Array.isArray(filters.value.divisions) && filters.value.divisions.length > 0) ||
        (Array.isArray(filters.value.ageGroups) && filters.value.ageGroups.length > 0)
    )
})

const isFiltered = computed(() => hasActiveFilters.value)

const searchTimeout = ref(null)
const isExporting = ref(false)

const exportCSV = async () => {
    try {
        isExporting.value = true
        const url = `${apiBaseUrl}/events/${eventId.value}/participants/export`
        const res = await fetch(url, {
            credentials: 'include'
        })
        if (!res.ok) throw new Error('Failed to export CSV')
        const blob = await res.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = downloadUrl
        a.download = `participants-${eventId.value}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
        console.error('Failed to export CSV via fetch, falling back to anchor download:', err)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = `${apiBaseUrl}/events/${eventId.value}/participants/export`
        a.download = `participants-${eventId.value}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    } finally {
        isExporting.value = false
    }
}

const handleSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
    searchTimeout.value = setTimeout(() => {
        page.value = 1
        fetchParticipants()
    }, 400)
}

const loadParticipants = () => {
    fetchParticipants()
}

const fetchEventDetails = async () => {
    const id = eventId.value
    if (!id) return
    try {
        const eventRes = await get(`/tournaments/${id}`)
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const fetchCategories = async () => {
    const id = eventId.value
    if (!id) return
    try {
        const response = await get(`/tournaments/${id}/categories`)
        categories.value = response?.events || response?.categories || []
    } catch (error) {
        console.error('Failed to fetch categories:', error)
        categories.value = []
    }
}

const fetchParticipants = async () => {
    const id = eventId.value
    if (!id) return
    isLoading.value = true
    try {
        const offset = (page.value - 1) * limit.value
        let url = `/tournaments/${id}/participants?limit=${limit.value}&offset=${offset}&group_by=archer&search=${encodeURIComponent(searchQuery.value)}&sort_by=${sortBy.value}&order=${sortOrder.value}`
        
        if (filters.value.status && filters.value.status !== 'Semua') {
            url += `&payment_status=${encodeURIComponent(filters.value.status)}`
        }
        if (filters.value.reregistration && filters.value.reregistration !== 'Semua') {
            url += `&reregistration_status=${encodeURIComponent(filters.value.reregistration)}`
        }
        if (filters.value.gender && filters.value.gender !== 'Semua') {
            url += `&gender=${encodeURIComponent(filters.value.gender)}`
        }
        if (filters.value.divisions && filters.value.divisions.length > 0) {
            url += `&division=${encodeURIComponent(filters.value.divisions.join(','))}`
        }
        if (filters.value.ageGroups && filters.value.ageGroups.length > 0) {
            url += `&age_group=${encodeURIComponent(filters.value.ageGroups.join(','))}`
        }
        if (filters.value.categoryIds && filters.value.categoryIds.length > 0) {
            url += `&category_ids=${encodeURIComponent(filters.value.categoryIds.join(','))}`
        }
        if (filters.value.club && filters.value.club.trim() !== '') {
            url += `&club_id=${encodeURIComponent(filters.value.club.trim())}`
        }

        const response = await get(url)
        participants.value = response?.participants || []
        total.value = response?.total || 0
        verifiedCount.value = response?.verified_count || 0
        pendingCount.value = response?.pending_count || 0
    } catch (error) {
        console.error('Failed to fetch participants:', error)
    } finally {
        isLoading.value = false
    }
}

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage
        fetchParticipants()
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const filteredParticipants = computed(() => {
    return participants.value
})

const getFilteredCategoryEntries = (participant) => {
    const categoryList = participant?.categories || []
    if (!Array.isArray(categoryList) || categoryList.length === 0) return []
    if (!hasActiveCategoryFilter.value) return []

    const selectedCatIds = new Set(filters.value.categoryIds || [])
    const selectedDivs = new Set(filters.value.divisions || [])
    const selectedAges = new Set(filters.value.ageGroups || [])

    const matched = categoryList.filter(c => {
        if (selectedCatIds.size > 0 && selectedCatIds.has(c?.category_id)) return true
        if (selectedDivs.size > 0 && selectedDivs.has(c?.division_name)) return true
        if (selectedAges.size > 0 && selectedAges.has(c?.category_name)) return true
        return false
    })
    return matched.length > 0 ? matched : categoryList
}

const getFilteredCategoryLabels = (participant) => {
    const entries = getFilteredCategoryEntries(participant)
    if (entries.length === 0) return ['-']

    const labels = entries.map((categoryEntry) => {
        const parts = [
            categoryEntry.division_name,
            categoryEntry.category_name,
            categoryEntry.event_type_name,
            categoryEntry.gender_division_name
        ].filter(Boolean)
        return parts.length > 0 ? parts.join(' - ') : '-'
    })

    return Array.from(new Set(labels))
}

const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'lunas' || s === 'paid' || s === 'registered' || s === 'terdaftar') return t('dashboard.participants_list.status_options.paid')
    if (s === 'unpaid' || s === 'belum_bayar') return isEn.value ? 'Unpaid' : 'Belum Bayar'
    if (s === 'rejected' || s === 'ditolak') return isEn.value ? 'Rejected' : 'Ditolak'
    return t('dashboard.participants_list.status_options.pending')
}

const getStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'paid' || s === 'lunas' || s === 'registered' || s === 'terdaftar') {
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
    if (s === 'unpaid' || s === 'belum_bayar') {
        return 'bg-slate-100 text-slate-700 border-slate-200'
    }
    if (s === 'rejected' || s === 'ditolak') {
        return 'bg-rose-50 text-rose-700 border-rose-200'
    }
    return 'bg-amber-50 text-amber-700 border-amber-200'
}

const uniqueClubs = computed(() => {
    const clubs = new Set(participants.value.map(p => p.club_name).filter(Boolean))
    return clubs.size
})

const getCategoryName = (participant) => {
    if (!participant) return '-'

    const parts = []
    if (participant.division_name) parts.push(participant.division_name)
    if (participant.category_name) parts.push(participant.category_name)
    if (participant.event_type_name) parts.push(participant.event_type_name)
    if (participant.gender_division_name) parts.push(participant.gender_division_name)

    return parts.length > 0 ? parts.join(' - ') : '-'
}


const loadPageData = () => {
    if (!eventId.value) return
    fetchEventDetails()
    fetchCategories()
    fetchParticipants()
}

// Re-fetch whenever we're on this page (including when returning via browser back / touchpad back)
watch(
    () => [route.params.id, route.params.participantId],
    ([id, participantId]) => {
        if (import.meta.client && id && participantId === undefined) loadPageData()
    },
    { immediate: true }
)

// Re-fetch when page is restored from bfcache (browser back can restore cached page without re-mounting)
const onPageShow = (event) => {
    if (event.persisted) loadPageData()
}

// Fallback: re-fetch when tab/window becomes visible (handles some SSR/back edge cases)
const onVisibilityChange = () => {
    if (document.visibilityState === 'visible' && eventId.value && route.params.participantId === undefined) {
        loadPageData()
    }
}

onMounted(() => {
    if (import.meta.client) {
        window.addEventListener('pageshow', onPageShow)
        document.addEventListener('visibilitychange', onVisibilityChange)
    }
})

onBeforeUnmount(() => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
    if (import.meta.client) {
        window.removeEventListener('pageshow', onPageShow)
        document.removeEventListener('visibilitychange', onVisibilityChange)
    }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
