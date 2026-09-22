<template>
  <div class="flex flex-col gap-8 relative font-body text-navy antialiased pb-16">
    <!-- Header Section (Root Terminal Style) -->
    <div class="relative overflow-hidden rounded-3xl border border-primary/20 bg-navy text-white shadow-sm">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
      <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
      <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
      <div class="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-4">
          <div class="flex items-center gap-2 text-[10px] sm:text-xs font-black tracking-widest text-primary/80">
            <span class="text-white">{{ t('root.index.root_terminal') }}</span>
            <Icon icon="ph:caret-right-bold" class="text-[8px] opacity-50" />
            <span class="text-primary">{{ t('root.archers.breadcrumb') }}</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Icon icon="ph:users-three-bold" class="text-primary text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 class="text-xl sm:text-3xl font-black tracking-tight">{{ t('root.archers.title') }}</h1>
              <div class="text-slate-300 text-[10px] sm:text-sm font-medium mt-1">
                {{ t('root.archers.subtitle') }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="fetchArchers"
            class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 transition-all border border-white/10 active:scale-95 cursor-pointer"
          >
            <Icon icon="ph:arrow-clockwise-bold" :class="loading ? 'animate-spin' : ''" />
            <span>{{ t('common.refresh') }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Overview Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <StatCard
        :title="t('root.archers.stat_total')"
        :value="totalArchers.toLocaleString('id-ID')"
        icon="ph:users-three-bold"
        color="primary"
        :description="t('root.archers.stat_total_desc')"
        description-icon="ph:user-check-bold"
      />
      <StatCard
        :title="t('root.archers.stat_clubs')"
        :value="uniqueClubsCount.toLocaleString('id-ID')"
        icon="ph:shield-chevron-bold"
        color="primary"
        :description="t('root.archers.stat_clubs_desc')"
        description-icon="ph:buildings-bold"
      />
      <StatCard
        :title="t('root.archers.stat_bows')"
        :value="activeBowTypesCount.toLocaleString('id-ID')"
        icon="ph:crosshair-bold"
        color="primary"
        :description="t('root.archers.stat_bows_desc')"
        description-icon="ph:target-bold"
      />
    </div>

    <!-- Unified DashboardDataTable (Category B: Inline Filters) -->
    <DashboardDataTable
      :items="archers"
      :columns="tableColumns"
      :loading="loading"
      :searchable="true"
      :selectable="true"
      v-model:selected="selectedArchers"
      item-key="uuid"
      :search-placeholder="t('root.archers.search_placeholder')"
      count-icon="ph:users-three-bold"
      :count-unit="t('root.archers.title')"
      :show-reset-button="true"
      :empty-title="t('root.archers.empty_title')"
      :empty-description="searchQuery || selectedBowType !== 'all' ? t('root.archers.empty_filter_desc') : t('root.archers.empty_desc')"
      empty-icon="ph:user-focus-bold"
      :items-per-page="limit"
      @search="handleSearch"
      @reset-filters="resetFilters"
    >
      <!-- Inline Filters: Bow Type Select -->
      <template #inline-filters>
        <div class="w-48 sm:w-56">
          <select
            v-model="selectedBowType"
            class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-navy focus:outline-none focus:border-navy transition-all cursor-pointer"
          >
            <option v-for="bType in bowFilterOptions" :key="bType.value" :value="bType.value">
              {{ bType.label }}
            </option>
          </select>
        </div>
      </template>

      <!-- Batch Actions Bar -->
      <template #batch-actions>
        <button
          type="button"
          @click="openBulkDeleteModal"
          class="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
        >
          <Icon icon="ph:trash-bold" class="text-sm" />
          <span>{{ isEn ? `Delete Selected (${selectedArchers.length})` : `Hapus Terpilih (${selectedArchers.length})` }}</span>
        </button>
      </template>

      <!-- Toolbar Actions: View Mode Toggle -->
      <template #toolbar-actions>
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            @click="viewMode = 'table'"
            :class="[
              'p-2 rounded-lg transition-all cursor-pointer',
              viewMode === 'table' ? 'bg-white shadow-2xs text-navy' : 'text-slate-400 hover:text-navy'
            ]"
            :title="t('common.table_view')"
          >
            <Icon icon="ph:table-bold" class="text-base" />
          </button>
          <button
            type="button"
            @click="viewMode = 'grid'"
            :class="[
              'p-2 rounded-lg transition-all cursor-pointer',
              viewMode === 'grid' ? 'bg-white shadow-2xs text-navy' : 'text-slate-400 hover:text-navy'
            ]"
            :title="t('common.grid_view')"
          >
            <Icon icon="ph:squares-four-bold" class="text-base" />
          </button>
        </div>
      </template>

      <!-- Profile Column Slot -->
      <template #item-profile="{ item }">
        <div class="flex items-center gap-3.5 py-1">
          <div class="size-11 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 shadow-2xs">
            <img
              :src="useImageOrDefault(item.avatar_url || item.photo_url, item.full_name)"
              :alt="item.full_name"
              @error="(e) => (e.target.src = generateDicebearAvatar(item.full_name))"
              class="size-full object-cover"
            />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <span class="text-xs sm:text-sm font-extrabold text-navy truncate hover:text-primary transition-colors">
                {{ item.full_name }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-500 font-medium truncate mt-0.5">
              <span v-if="item.username" class="text-slate-400">@{{ item.username }}</span>
              <span v-else-if="item.athlete_code" class="text-slate-400 font-mono">#{{ item.athlete_code }}</span>
              <span v-if="item.email" class="text-slate-400 truncate">• {{ item.email }}</span>
            </div>
          </div>
        </div>
      </template>

      <!-- Club & City Column Slot -->
      <template #item-club="{ item }">
        <div class="text-xs space-y-0.5">
          <div class="font-bold text-navy flex items-center gap-1.5">
            <Icon icon="ph:shield-chevron-bold" class="text-slate-400 shrink-0" />
            <span class="truncate">{{ item.club_name || '-' }}</span>
          </div>
          <div class="text-slate-400 font-medium flex items-center gap-1.5">
            <Icon icon="ph:map-pin-bold" class="text-slate-400 shrink-0" />
            <span class="truncate">{{ item.city || item.address || '-' }}</span>
          </div>
        </div>
      </template>

      <!-- Category Column Slot -->
      <template #item-category="{ item }">
        <div class="flex flex-wrap items-center gap-1.5">
          <span
            :class="[
              'px-2.5 py-1 rounded-lg text-[11px] font-extrabold capitalize border inline-flex items-center gap-1',
              getBowTypeBadgeClass(item.bow_type)
            ]"
          >
            <Icon icon="ph:crosshair-bold" class="text-xs" />
            {{ item.bow_type || 'Recurve' }}
          </span>
          <span
            v-if="item.gender"
            :class="[
              'px-2 py-1 rounded-lg text-[11px] font-bold border inline-flex items-center gap-1',
              item.gender?.toLowerCase() === 'female' || item.gender?.toLowerCase() === 'women' || item.gender?.toLowerCase() === 'f'
                ? 'bg-rose-50 text-rose-700 border-rose-200/80'
                : 'bg-sky-50 text-sky-700 border-sky-200/80'
            ]"
          >
            <Icon
              :icon="
                item.gender?.toLowerCase() === 'female' || item.gender?.toLowerCase() === 'women' || item.gender?.toLowerCase() === 'f'
                  ? 'ph:gender-female-bold'
                  : 'ph:gender-male-bold'
              "
              class="text-xs"
            />
            {{ formatGender(item.gender) }}
          </span>
        </div>
      </template>

      <!-- Tournaments Column Slot -->
      <template #item-tournaments="{ item }">
        <div class="inline-flex flex-col items-center">
          <span class="text-xs sm:text-sm font-black text-navy">{{ item.total_events || 0 }}</span>
          <span class="text-[10px] font-bold text-slate-400 tracking-wider">Event</span>
        </div>
      </template>

      <!-- Actions Column Slot -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end gap-1.5">
          <NuxtLink
            :to="`/archers/${item.username || item.slug || item.uuid}`"
            target="_blank"
            class="size-8 rounded-xl bg-slate-50 hover:bg-navy hover:text-white text-slate-600 border border-slate-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            :title="t('root.archers.view_profile')"
          >
            <Icon icon="ph:arrow-square-out-bold" class="text-sm" />
          </NuxtLink>
          <button
            type="button"
            @click="openDeleteModal(item)"
            class="size-8 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200/80 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            :title="t('root.archers.delete_account')"
          >
            <Icon icon="ph:trash-bold" class="text-sm" />
          </button>
        </div>
      </template>
    </DashboardDataTable>

    <!-- Single Delete Confirmation Dialog -->
    <AppDialog
      v-model:show="deleteModal.show"
      :title="t('root.archers.delete_title')"
      :message="deleteModalMessage"
      :confirm-text="t('root.archers.delete_confirm')"
      :loading="deleteModal.loading"
      type="danger"
      @confirm="handleDeleteArcher"
    />

    <!-- Bulk Delete Confirmation Dialog -->
    <AppDialog
      v-model:show="bulkDeleteModal.show"
      :title="isEn ? 'Bulk Delete Archers' : 'Hapus Massal Pemanah'"
      :message="bulkDeleteModalMessage"
      :confirm-text="isEn ? 'Delete Selected' : 'Hapus Terpilih'"
      :loading="bulkDeleteModal.loading"
      type="danger"
      @confirm="handleBulkDeleteArchers"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '~/composables/useToast'
import { useApi } from '~/composables/useApi'
import { useImageOrDefault, generateDicebearAvatar } from '~/composables/useImageHelper'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'

const { t, locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')
const toast = useToast()
const api = useApi()

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => t('root.archers.head_title'))
})

// State
const archers = ref([])
const totalArchers = ref(0)
const loading = ref(false)
const searchQuery = ref('')
const selectedBowType = ref('all')
const viewMode = ref('table') // 'table' | 'grid'
const currentPage = ref(1)
const limit = ref(12)
const selectedArchers = ref([])

const tableColumns = computed(() => [
  { key: 'profile', label: t('root.archers.col_profile'), sortable: true, sortKey: 'full_name', class: 'min-w-[220px]' },
  { key: 'club', label: t('root.archers.col_club'), sortable: true, sortKey: 'club_name', class: 'min-w-[180px]' },
  { key: 'category', label: t('root.archers.col_category'), sortable: true, sortKey: 'bow_type', class: 'min-w-[180px]' },
  { key: 'tournaments', label: t('root.archers.col_tournaments'), sortable: true, sortKey: 'total_events', align: 'center', class: 'min-w-[110px]' }
])

// Bow filter options
const bowFilterOptions = computed(() => [
  { label: t('archers.bow_types.all'), value: 'all' },
  { label: 'Recurve', value: 'recurve' },
  { label: 'Compound', value: 'compound' },
  { label: 'Barebow', value: 'barebow' },
  { label: 'Traditional', value: 'traditional' },
  { label: 'Standard Bow', value: 'standard' }
])

// Stats computed
const uniqueClubsCount = computed(() => {
  const clubs = new Set()
  archers.value.forEach((a) => {
    if (a.club_name) clubs.add(a.club_name)
  })
  return clubs.size || (totalArchers.value > 0 ? 1 : 0)
})

const activeBowTypesCount = computed(() => {
  const types = new Set()
  archers.value.forEach((a) => {
    if (a.bow_type) types.add(a.bow_type.toLowerCase())
  })
  return types.size || 1
})

// Badge style helper
const getBowTypeBadgeClass = (type) => {
  const tLower = (type || 'recurve').toLowerCase()
  switch (tLower) {
    case 'compound':
      return 'bg-amber-50 text-amber-800 border-amber-200/80'
    case 'barebow':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
    case 'traditional':
      return 'bg-purple-50 text-purple-800 border-purple-200/80'
    case 'standard':
      return 'bg-blue-50 text-blue-800 border-blue-200/80'
    case 'recurve':
    default:
      return 'bg-primary-50 text-navy border-primary-200/80'
  }
}

const formatGender = (gender) => {
  if (!gender) return '-'
  const g = gender.toLowerCase()
  if (g === 'female' || g === 'women' || g === 'f') return t('common.female')
  return t('common.male')
}

// Fetch Archers
const fetchArchers = async () => {
  loading.value = true
  selectedArchers.value = []
  try {
    const params = {
      page: currentPage.value,
      limit: limit.value
    }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    if (selectedBowType.value && selectedBowType.value !== 'all') {
      params.bow_type = selectedBowType.value
    }

    const response = await api.get('/archers', { params })

    let rawData = response?.archers || response?.data || response
    let items = []
    if (Array.isArray(rawData)) {
      items = rawData
    } else if (rawData && typeof rawData === 'object') {
      items = Array.isArray(rawData.data) ? rawData.data : Array.isArray(rawData.archers) ? rawData.archers : []
    }

    archers.value = items.map((archer) => ({
      ...archer,
      uuid: archer.uuid || archer.id,
      slug: archer.username || archer.slug,
      full_name: archer.full_name || 'Tanpa Nama',
      athlete_code: archer.id,
      city: archer.city,
      club_name: archer.club_name,
      bow_type: archer.bow_type || 'recurve',
      avatar_url: archer.avatar_url || archer.photo_url,
      total_events: archer.total_events || 0
    }))

    totalArchers.value = response?.total ?? (response?.meta?.total_records || items.length)
  } catch (error) {
    console.error('Failed to fetch archers:', error)
    toast.error(t('root.archers.fetch_error'))
  } finally {
    loading.value = false
  }
}

const handleSearch = (q) => {
  searchQuery.value = q
  currentPage.value = 1
  fetchArchers()
}

// Reset filters
const resetFilters = () => {
  searchQuery.value = ''
  selectedBowType.value = 'all'
  currentPage.value = 1
  fetchArchers()
}

watch(selectedBowType, () => {
  currentPage.value = 1
  fetchArchers()
})

// Single Delete State & Modal
const deleteModal = reactive({
  show: false,
  loading: false,
  target: null
})

const deleteModalMessage = computed(() => {
  if (!deleteModal.target) return ''
  return `Apakah Anda yakin ingin menghapus akun pemanah "${deleteModal.target.full_name}"? Semua data riwayat turnamen dan sertifikat terkait akan ikut dibersihkan.`
})

const openDeleteModal = (archer) => {
  deleteModal.target = archer
  deleteModal.show = true
}

const handleDeleteArcher = async () => {
  if (!deleteModal.target?.uuid) return
  deleteModal.loading = true

  try {
    await api.del(`/archers/${deleteModal.target.uuid}`)
    toast.success(t('root.archers.delete_success'))
    deleteModal.show = false
    deleteModal.target = null
    fetchArchers()
  } catch (error) {
    console.error('Failed to delete archer:', error)
    const msg = error?.response?.data?.error || error?.data?.error || t('root.archers.delete_error')
    toast.error(msg)
  } finally {
    deleteModal.loading = false
  }
}

// Bulk Delete State & Modal
const bulkDeleteModal = reactive({
  show: false,
  loading: false
})

const bulkDeleteModalMessage = computed(() => {
  const count = selectedArchers.value.length
  return isEn.value
    ? `Are you sure you want to delete ${count} selected archers? All associated tournament participations, score records, and certificates will also be permanently deleted.`
    : `Apakah Anda yakin ingin menghapus ${count} akun pemanah yang dipilih? Semua riwayat turnamen, skor kualifikasi, dan sertifikat terkait akan ikut dihapus secara permanen.`
})

const openBulkDeleteModal = () => {
  if (selectedArchers.value.length === 0) return
  bulkDeleteModal.show = true
}

const handleBulkDeleteArchers = async () => {
  if (selectedArchers.value.length === 0) return
  bulkDeleteModal.loading = true

  try {
    const res = await api.post('/archers/bulk-delete', {
      uuids: selectedArchers.value
    })
    toast.success(res?.message || (isEn.value ? 'Archers successfully deleted' : 'Pemanah berhasil dihapus'))
    bulkDeleteModal.show = false
    selectedArchers.value = []
    fetchArchers()
  } catch (error) {
    console.error('Failed to bulk delete archers:', error)
    const msg = error?.response?.data?.error || error?.data?.error || (isEn.value ? 'Failed to delete archers' : 'Gagal menghapus pemanah')
    toast.error(msg)
  } finally {
    bulkDeleteModal.loading = false
  }
}

onMounted(() => {
  fetchArchers()
})
</script>
