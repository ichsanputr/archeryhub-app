<template>
  <div class="space-y-3 font-body">
    <!-- Top Toolbar & Search / Filters Bar -->
    <div v-if="showToolbar" class="bg-white rounded-2xl border border-slate-200/90 p-3.5 sm:p-4 shadow-2xs space-y-3">
      <div class="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        <!-- Search Input -->
        <div v-if="searchable" class="relative flex-1 w-full min-w-0">
          <Icon
            icon="ph:magnifying-glass"
            class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none"
          />
          <input
            v-model="internalSearch"
            type="text"
            :placeholder="searchPlaceholder || (isEn ? 'Search records...' : 'Cari data...')"
            class="w-full pl-10 pr-9 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy focus:bg-white transition-all text-xs sm:text-sm font-medium text-navy placeholder:text-slate-400"
            @input="handleSearchInput"
          />
          <button
            v-if="internalSearch"
            type="button"
            @click="clearSearch"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy p-1 cursor-pointer transition-colors"
            :title="isEn ? 'Clear search' : 'Hapus pencarian'"
          >
            <Icon icon="ph:x-circle-fill" class="text-sm sm:text-base" />
          </button>
        </div>

        <!-- Inline Filters Slot (e.g. status dropdown, date range, tabs) -->
        <div v-if="$slots['inline-filters']" class="flex items-center gap-2 flex-wrap">
          <slot name="inline-filters" />
        </div>

        <!-- Right Side: Filter Dialog Trigger, Custom Actions & Record Counter -->
        <div class="flex items-center gap-2 sm:gap-2.5 justify-end shrink-0 flex-wrap">
          <!-- Filter Modal Trigger Button -->
          <button
            v-if="hasFilterModal"
            type="button"
            @click="$emit('open-filter')"
            :class="[
              'relative h-10 px-3.5 sm:px-4 rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center gap-2 cursor-pointer shrink-0 select-none shadow-2xs',
              activeFilterCount > 0
                ? 'bg-white border-navy text-navy font-black ring-1 ring-navy/20'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            ]"
          >
            <Icon icon="ph:sliders-horizontal-bold" class="text-base text-navy" />
            <span>{{ filterButtonLabel || (isEn ? 'Filter' : 'Filter') }}</span>
            <span
              v-if="activeFilterCount > 0"
              class="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-navy text-primary text-[10px] font-black flex items-center justify-center shadow-xs ring-2 ring-white"
            >
              {{ activeFilterCount }}
            </span>
          </button>

          <!-- Reset Filter Button (Optional quick shortcut) -->
          <button
            v-if="showResetButton && (activeFilterCount > 0 || internalSearch)"
            type="button"
            @click="handleResetFilters"
            class="h-10 px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 text-xs font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs"
            :title="isEn ? 'Reset all filters' : 'Reset semua filter'"
          >
            <Icon icon="ph:arrow-counter-clockwise-bold" class="text-xs sm:text-sm" />
            <span class="hidden md:inline">{{ isEn ? 'Reset' : 'Reset' }}</span>
          </button>

          <!-- Custom Toolbar Actions (e.g. Export CSV, Add Athlete, Import) -->
          <slot name="toolbar-actions" />

          <!-- Total Count Badge -->
          <div
            v-if="showCountBadge"
            class="px-3 py-2 bg-navy/5 text-navy rounded-xl font-black text-xs border border-navy/10 flex items-center gap-1.5 shrink-0 select-none"
          >
            <Icon :icon="countIcon || 'ph:rows-bold'" class="text-xs sm:text-sm text-navy/70" />
            <span>{{ computedTotal }} {{ countUnit || (isEn ? 'entries' : 'data') }}</span>
          </div>
        </div>
      </div>

      <!-- Active Filter Chips Bar -->
      <div
        v-if="activeFilterChips && activeFilterChips.length > 0"
        class="flex items-center gap-2 pt-2.5 flex-wrap border-t border-slate-100 animate-in fade-in duration-150"
      >
        <div class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 shrink-0 select-none">
          <Icon icon="ph:funnel-bold" class="text-xs text-slate-400 shrink-0" />
          <span>{{ isEn ? 'Active Filters:' : 'Filter Aktif:' }}</span>
        </div>

        <div
          v-for="chip in activeFilterChips"
          :key="chip.key"
          class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs group hover:border-slate-300 transition-colors"
        >
          <span class="truncate max-w-[240px] text-navy font-bold leading-none">{{ chip.label }}</span>
          <button
            type="button"
            @click="$emit('remove-chip', chip.key)"
            class="text-slate-400 hover:text-rose-500 rounded-full p-0.5 transition-colors cursor-pointer inline-flex items-center justify-center shrink-0"
            :title="isEn ? 'Remove filter' : 'Hapus filter'"
          >
            <Icon icon="ph:x-bold" class="text-[10px]" />
          </button>
        </div>

        <button
          type="button"
          @click="handleResetFilters"
          class="inline-flex items-center text-xs font-bold text-slate-400 hover:text-rose-600 transition-colors ml-1 cursor-pointer"
        >
          {{ isEn ? 'Clear All' : 'Hapus Semua' }}
        </button>
      </div>
    </div>

    <!-- Floating Batch Action Bar -->
    <div
      v-if="selectable && internalSelected.length > 0"
      class="p-3 bg-navy text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200"
    >
      <div class="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
        <span class="size-6 rounded-lg bg-primary text-navy flex items-center justify-center text-xs font-black shrink-0">
          {{ internalSelected.length }}
        </span>
        <span>{{ isEn ? `${internalSelected.length} items selected` : `${internalSelected.length} data dipilih` }}</span>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <slot name="batch-actions" :selected-items="internalSelected" :clear-selection="clearSelection" />
        <button
          type="button"
          @click="clearSelection"
          class="text-xs font-bold text-white/70 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          {{ isEn ? 'Deselect All' : 'Batalkan Pilihan' }}
        </button>
      </div>
    </div>

    <!-- Main Table Container -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center space-y-3">
        <slot name="loading">
          <Icon icon="ph:spinner-gap-bold" class="text-3xl text-navy animate-spin mx-auto" />
          <div class="text-xs sm:text-sm text-slate-500 font-bold">
            {{ isEn ? 'Loading data...' : 'Memuat data...' }}
          </div>
        </slot>
      </div>

      <!-- Empty State -->
      <div v-else-if="displayItems.length === 0" class="py-16 sm:py-20 text-center space-y-3 px-4">
        <slot name="empty">
          <div class="size-14 rounded-2xl bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center mx-auto shadow-2xs">
            <Icon :icon="emptyIcon || 'ph:folder-open-bold'" class="text-2xl text-navy" />
          </div>
          <div class="space-y-1">
            <h4 class="text-sm sm:text-base font-black text-navy">
              {{ emptyTitle || (isEn ? 'No records found' : 'Tidak ada data ditemukan') }}
            </h4>
            <div class="text-xs sm:text-sm text-slate-400 max-w-sm mx-auto">
              {{ emptyDescription || (isEn ? 'Try adjusting your search query or filters to find what you are looking for.' : 'Coba sesuaikan kata kunci pencarian atau filter Anda.') }}
            </div>
          </div>
        </slot>
      </div>

      <!-- Main Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs sm:text-sm" :class="tableClass">
          <!-- Table Header -->
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-200/80 text-xs sm:text-sm font-bold text-slate-500 tracking-wider">
              <!-- Select All Checkbox Column -->
              <th v-if="selectable" class="py-3.5 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  @change="toggleSelectAll"
                  class="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer"
                />
              </th>

              <!-- Row Index Column -->
              <th v-if="showIndex" class="py-3.5 px-3 w-12 text-center text-slate-400 font-mono text-xs">
                #
              </th>

              <!-- User Configured Columns -->
              <th
                v-for="col in effectiveColumns"
                :key="col.key"
                :class="[
                  'py-3.5 px-4 sm:px-5 font-bold transition-colors select-none',
                  col.sortable ? 'cursor-pointer hover:text-navy hover:bg-slate-100/50' : '',
                  col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : 'text-left'),
                  col.headerClass || '',
                  col.width ? col.width : ''
                ]"
                @click="col.sortable ? handleSort(col.key) : null"
              >
                <div
                  class="flex items-center gap-1.5"
                  :class="col.align === 'center' ? 'justify-center' : (col.align === 'right' ? 'justify-end' : 'justify-start')"
                >
                  <slot :name="`header-${col.key}`" :column="col">
                    <span>{{ col.label }}</span>
                  </slot>
                  <template v-if="col.sortable">
                    <Icon
                      v-if="internalSortBy === col.key"
                      :icon="internalSortOrder === 'asc' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                      class="text-navy text-xs shrink-0"
                    />
                    <Icon
                      v-else
                      icon="ph:caret-up-down"
                      class="opacity-30 text-xs shrink-0"
                    />
                  </template>
                </div>
              </th>

              <!-- Custom Actions Header Slot -->
              <th v-if="$slots.actions" class="py-3.5 px-4 sm:px-5 text-right font-bold w-24">
                {{ actionsHeaderLabel || (isEn ? 'Actions' : 'Aksi') }}
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="divide-y divide-slate-100 bg-white">
            <template v-for="(item, idx) in displayItems" :key="getItemKey(item, idx)">
              <!-- Full Row Override Slot -->
              <slot
                v-if="$slots.row"
                name="row"
                :item="item"
                :index="idx"
                :row-number="computeRowNumber(idx)"
              />

              <!-- Standard Row -->
              <tr
                v-else
                class="hover:bg-slate-50/60 transition-colors group"
                :class="[
                  selectable && internalSelected.includes(getItemKey(item, idx)) ? 'bg-navy/5' : '',
                  rowClass ? rowClass(item, idx) : ''
                ]"
              >
                <!-- Row Checkbox -->
                <td v-if="selectable" class="py-3.5 px-3 text-center align-middle">
                  <input
                    type="checkbox"
                    :checked="internalSelected.includes(getItemKey(item, idx))"
                    @change="toggleSelectItem(getItemKey(item, idx))"
                    class="size-4 rounded border-slate-300 text-navy focus:ring-navy cursor-pointer"
                  />
                </td>

                <!-- Row Number -->
                <td v-if="showIndex" class="py-3.5 px-3 font-mono font-bold text-slate-400 text-center text-xs align-middle">
                  {{ computeRowNumber(idx) }}
                </td>

                <!-- Column Cells -->
                <td
                  v-for="col in effectiveColumns"
                  :key="col.key"
                  :class="[
                    'py-3.5 px-4 sm:px-5 text-xs sm:text-sm text-navy',
                    col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : 'text-left'),
                    col.class || '',
                    col.alignTop ? 'align-top' : 'align-middle'
                  ]"
                >
                  <slot
                    :name="`item-${col.key}`"
                    :item="item"
                    :value="item[col.key]"
                    :index="idx"
                  >
                    {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : '-' }}
                  </slot>
                </td>

                <!-- Row Action Buttons Slot -->
                <td v-if="$slots.actions" class="py-3.5 px-4 sm:px-5 text-right align-middle whitespace-nowrap">
                  <slot name="actions" :item="item" :index="idx" />
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Interactive Pagination Footer -->
      <div
        v-if="showPagination && computedTotal > 0"
        class="px-4 sm:px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm select-none"
      >
        <!-- Left: Per Page Selector & Summary -->
        <div class="flex items-center gap-3 text-slate-500 font-medium flex-wrap">
          <div v-if="showPerPageSelector" class="flex items-center gap-2">
            <span class="text-xs text-slate-400 font-bold tracking-wider">{{ isEn ? 'Show' : 'Tampilkan' }}:</span>
            <select
              v-model="internalPerPage"
              @change="handlePerPageChange"
              class="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-navy font-bold text-xs focus:outline-none focus:ring-1 focus:ring-navy cursor-pointer shadow-2xs"
            >
              <option v-for="size in perPageOptions" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>

          <span class="text-slate-300 hidden sm:inline">•</span>

          <div>
            {{ isEn
              ? `Showing ${paginationStart} - ${paginationEnd} of ${computedTotal} ${countUnit || 'records'}`
              : `Menampilkan ${paginationStart} - ${paginationEnd} dari ${computedTotal} ${countUnit || 'data'}`
            }}
          </div>
        </div>

        <!-- Right: Pagination Buttons -->
        <div v-if="totalPages > 1" class="flex items-center gap-1.5">
          <!-- Previous Button -->
          <button
            type="button"
            :disabled="internalPage <= 1"
            @click="changePage(internalPage - 1)"
            class="size-8 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            :title="isEn ? 'Previous page' : 'Halaman sebelumnya'"
          >
            <Icon icon="ph:caret-left-bold" class="text-xs sm:text-sm" />
          </button>

          <!-- Page Number Buttons with Smart Ellipsis -->
          <template v-for="(p, pIdx) in visiblePageNumbers" :key="pIdx">
            <button
              v-if="p !== '...'"
              type="button"
              @click="changePage(p)"
              class="size-8 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
              :class="internalPage === p ? 'bg-navy text-primary font-black shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'"
            >
              {{ p }}
            </button>
            <span v-else class="size-8 flex items-center justify-center text-slate-400 font-bold text-xs">
              ...
            </span>
          </template>

          <!-- Next Button -->
          <button
            type="button"
            :disabled="internalPage >= totalPages"
            @click="changePage(internalPage + 1)"
            class="size-8 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer shadow-2xs"
            :title="isEn ? 'Next page' : 'Halaman berikutnya'"
          >
            <Icon icon="ph:caret-right-bold" class="text-xs sm:text-sm" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

const { locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')

const props = defineProps({
  // Data props
  columns: {
    type: Array,
    default: () => []
  },
  headers: {
    type: Array,
    default: () => []
  },
  items: {
    type: Array,
    default: () => []
  },
  itemKey: {
    type: String,
    default: 'id'
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  serverSide: {
    type: Boolean,
    default: false
  },

  // Sorting props
  sortBy: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: String,
    default: 'asc'
  },

  // Pagination props
  page: {
    type: Number,
    default: 1
  },
  perPage: {
    type: Number,
    default: 10
  },
  perPageOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  showPerPageSelector: {
    type: Boolean,
    default: true
  },

  // Toolbar & Search props
  showToolbar: {
    type: Boolean,
    default: true
  },
  searchable: {
    type: Boolean,
    default: true
  },
  searchPlaceholder: {
    type: String,
    default: ''
  },
  searchValue: {
    type: String,
    default: ''
  },
  debounceMs: {
    type: Number,
    default: 350
  },

  // Filter dialog props
  hasFilterModal: {
    type: Boolean,
    default: false
  },
  filterButtonLabel: {
    type: String,
    default: ''
  },
  activeFilterCount: {
    type: Number,
    default: 0
  },
  activeFilterChips: {
    type: Array,
    default: () => []
  },
  showResetButton: {
    type: Boolean,
    default: true
  },

  // Batch selection props
  selectable: {
    type: Boolean,
    default: false
  },
  selectedItems: {
    type: Array,
    default: () => []
  },

  // Table styling & visual props
  showIndex: {
    type: Boolean,
    default: true
  },
  showCountBadge: {
    type: Boolean,
    default: true
  },
  countIcon: {
    type: String,
    default: ''
  },
  countUnit: {
    type: String,
    default: ''
  },
  actionsHeaderLabel: {
    type: String,
    default: ''
  },
  tableClass: {
    type: String,
    default: ''
  },
  rowClass: {
    type: Function,
    default: null
  },

  // Empty state props
  emptyIcon: {
    type: String,
    default: 'ph:folder-open-bold'
  },
  emptyTitle: {
    type: String,
    default: ''
  },
  emptyDescription: {
    type: String,
    default: ''
  }
})

const emit = defineEmits([
  'update:page',
  'update:perPage',
  'update:sortBy',
  'update:sortOrder',
  'update:searchValue',
  'update:selectedItems',
  'search',
  'sort',
  'page-change',
  'open-filter',
  'remove-chip',
  'reset-filters'
])

// Internal state
const internalSearch = ref(props.searchValue || '')
const internalPage = ref(props.page || 1)
const internalPerPage = ref(props.perPage || 10)
const internalSortBy = ref(props.sortBy || '')
const internalSortOrder = ref(props.sortOrder || 'asc')
const internalSelected = ref([...props.selectedItems])

// Effective columns support (both :columns and legacy :headers)
const effectiveColumns = computed(() => {
  if (props.columns && props.columns.length > 0) return props.columns
  if (props.headers && props.headers.length > 0) return props.headers
  return []
})

// Sync props to internal state
watch(() => props.page, (val) => { internalPage.value = val })
watch(() => props.perPage, (val) => { internalPerPage.value = val })
watch(() => props.sortBy, (val) => { internalSortBy.value = val })
watch(() => props.sortOrder, (val) => { internalSortOrder.value = val })
watch(() => props.searchValue, (val) => { internalSearch.value = val })
watch(() => props.selectedItems, (val) => { internalSelected.value = [...val] }, { deep: true })

// Search debounce
let searchTimer = null
const handleSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    emit('update:searchValue', internalSearch.value)
    emit('search', internalSearch.value)
    if (props.serverSide) {
      changePage(1)
    } else {
      internalPage.value = 1
      emit('update:page', 1)
    }
  }, props.debounceMs)
}

const clearSearch = () => {
  internalSearch.value = ''
  emit('update:searchValue', '')
  emit('search', '')
  if (props.serverSide) {
    changePage(1)
  } else {
    internalPage.value = 1
    emit('update:page', 1)
  }
}

const handleResetFilters = () => {
  clearSearch()
  emit('reset-filters')
}

// Client-side filtering & sorting
const computedFilteredItems = computed(() => {
  if (props.serverSide) return props.items

  let list = [...props.items]

  // Client search filter
  if (internalSearch.value && internalSearch.value.trim()) {
    const q = internalSearch.value.toLowerCase().trim()
    list = list.filter(item => {
      return Object.values(item).some(val => {
        if (val === null || val === undefined) return false
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(q)
        }
        return false
      })
    })
  }

  // Client sort
  if (internalSortBy.value) {
    list.sort((a, b) => {
      const valA = a[internalSortBy.value]
      const valB = b[internalSortBy.value]
      if (valA === valB) return 0
      if (valA === null || valA === undefined) return 1
      if (valB === null || valB === undefined) return -1

      let cmp = 0
      if (typeof valA === 'number' && typeof valB === 'number') {
        cmp = valA - valB
      } else {
        cmp = String(valA).localeCompare(String(valB))
      }
      return internalSortOrder.value === 'desc' ? -cmp : cmp
    })
  }

  return list
})

// Final items to display
const displayItems = computed(() => {
  if (props.serverSide) return props.items

  const start = (internalPage.value - 1) * internalPerPage.value
  const end = start + internalPerPage.value
  return computedFilteredItems.value.slice(start, end)
})

const computedTotal = computed(() => {
  if (props.serverSide) return props.total
  return computedFilteredItems.value.length
})

const totalPages = computed(() => {
  return Math.ceil(computedTotal.value / internalPerPage.value) || 1
})

const paginationStart = computed(() => {
  if (computedTotal.value === 0) return 0
  return (internalPage.value - 1) * internalPerPage.value + 1
})

const paginationEnd = computed(() => {
  return Math.min(internalPage.value * internalPerPage.value, computedTotal.value)
})

// Page number logic with smart ellipsis
const visiblePageNumbers = computed(() => {
  const total = totalPages.value
  const current = internalPage.value
  const delta = 2
  const pages = []

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return pages
})

const computeRowNumber = (idx) => {
  return (internalPage.value - 1) * internalPerPage.value + idx + 1
}

const getItemKey = (item, idx) => {
  return item[props.itemKey] || item.uuid || item.id || item.archer_id || item.athlete_code || idx
}

// Sorting
const handleSort = (key) => {
  if (internalSortBy.value === key) {
    internalSortOrder.value = internalSortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    internalSortBy.value = key
    internalSortOrder.value = 'asc'
  }

  emit('update:sortBy', internalSortBy.value)
  emit('update:sortOrder', internalSortOrder.value)
  emit('sort', { field: internalSortBy.value, order: internalSortOrder.value })

  if (props.serverSide) {
    changePage(1)
  }
}

// Pagination handler
const changePage = (newPage) => {
  if (newPage < 1 || newPage > totalPages.value) return
  internalPage.value = newPage
  emit('update:page', newPage)
  emit('page-change', newPage)
}

const handlePerPageChange = () => {
  internalPage.value = 1
  emit('update:page', 1)
  emit('update:perPage', Number(internalPerPage.value))
  if (props.serverSide) {
    emit('page-change', 1)
  }
}

// Selection handlers
const isAllSelected = computed(() => {
  if (displayItems.value.length === 0) return false
  return displayItems.value.every(item => {
    return internalSelected.value.includes(getItemKey(item))
  })
})

const toggleSelectAll = (e) => {
  const checked = e.target.checked
  if (checked) {
    const pageKeys = displayItems.value.map(item => getItemKey(item))
    const merged = Array.from(new Set([...internalSelected.value, ...pageKeys]))
    internalSelected.value = merged
  } else {
    const pageKeys = new Set(displayItems.value.map(item => getItemKey(item)))
    internalSelected.value = internalSelected.value.filter(k => !pageKeys.has(k))
  }
  emit('update:selectedItems', internalSelected.value)
}

const toggleSelectItem = (key) => {
  const idx = internalSelected.value.indexOf(key)
  if (idx > -1) {
    internalSelected.value.splice(idx, 1)
  } else {
    internalSelected.value.push(key)
  }
  emit('update:selectedItems', internalSelected.value)
}

const clearSelection = () => {
  internalSelected.value = []
  emit('update:selectedItems', [])
}
</script>
