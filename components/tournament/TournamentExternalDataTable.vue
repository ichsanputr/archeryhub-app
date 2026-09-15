<template>
  <div class="tournament-data-table-wrapper space-y-4">
    <!-- ── TOP TOOLBAR & CONTROLS ── -->
    <div v-if="$slots.filters || $slots.search || showSearch || $slots.categories" class="space-y-3">
      <!-- Category Filter Pills Bar (if provided via slot) -->
      <div v-if="$slots.categories">
        <slot name="categories" />
      </div>

      <!-- Search & Custom Filters Row -->
      <div v-if="$slots.filters || $slots.search || showSearch" class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <!-- Search Input -->
        <div v-if="showSearch" class="relative flex-1">
          <Icon icon="ph:magnifying-glass-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            :value="modelValueSearch"
            @input="$emit('update:modelValueSearch', $event.target.value)"
            type="text"
            :placeholder="searchPlaceholder || 'Search athlete by name, club, or division...'"
            class="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-navy focus:bg-white transition-all"
          />
          <button
            v-if="modelValueSearch"
            type="button"
            @click="$emit('update:modelValueSearch', '')"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy cursor-pointer"
          >
            <Icon icon="ph:x-circle-fill" class="text-sm" />
          </button>
        </div>

        <slot name="search" />

        <!-- Custom Filters Slot (e.g. Club dropdown) -->
        <slot name="filters" />
      </div>
    </div>

    <!-- ── DATA TABLE CONTAINER ── -->
    <div class="border border-slate-200/80 rounded-2xl overflow-hidden shadow-2xs bg-white">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <!-- Thead -->
          <thead class="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 font-bold text-xs">
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                :class="[
                  'py-3 px-4 select-none whitespace-nowrap',
                  col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : 'text-left'),
                  col.width || '',
                  col.sortable ? 'cursor-pointer hover:text-navy transition-colors' : '',
                  col.headerClass || ''
                ]"
                @click="col.sortable ? handleSort(col.key) : null"
              >
                <div
                  :class="[
                    'inline-flex items-center gap-1.5 whitespace-nowrap',
                    col.align === 'center' ? 'justify-center mx-auto' : (col.align === 'right' ? 'justify-end ml-auto' : 'justify-start')
                  ]"
                >
                  <span>{{ col.label }}</span>
                  <Icon
                    v-if="col.sortable"
                    :icon="getSortIcon(col.key)"
                    class="text-xs shrink-0"
                    :class="sortKey === col.key ? 'text-navy font-black' : 'text-slate-400'"
                  />
                </div>
              </th>
            </tr>
          </thead>

          <!-- Tbody -->
          <tbody class="divide-y divide-slate-100 bg-white">
            <template v-if="items && items.length > 0">
              <tr
                v-for="(item, idx) in items"
                :key="idx"
                class="hover:bg-slate-50/60 transition-colors"
              >
                <td
                  v-for="col in columns"
                  :key="col.key"
                  :class="[
                    'py-3 px-4 whitespace-nowrap',
                    col.align === 'center' ? 'text-center' : (col.align === 'right' ? 'text-right' : 'text-left'),
                    col.cellClass || ''
                  ]"
                >
                  <slot
                    :name="`cell-${col.key}`"
                    :item="item"
                    :value="item[col.key]"
                    :index="idx"
                    :row-index="getRowIndex(idx)"
                  >
                    {{ item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : '-' }}
                  </slot>
                </td>
              </tr>
            </template>

            <!-- Empty State -->
            <tr v-else>
              <td :colspan="columns.length" class="py-10 text-center text-slate-400">
                <slot name="empty">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <Icon icon="ph:magnifying-glass" class="text-3xl text-slate-300" />
                    <span class="text-xs sm:text-sm font-medium">{{ emptyText || 'No records found' }}</span>
                  </div>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ── TABLE FOOTER (Items Per Page + Summary + Pagination) ── -->
      <div
        v-if="showPagination"
        class="p-3.5 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
      >
        <!-- Left: Items Per Page Options -->
        <div class="flex items-center gap-2">
          <span class="text-slate-500 font-medium">{{ itemsPerPageLabel || 'Items per page' }}:</span>
          <div class="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-0.5">
            <button
              v-for="size in pageSizeOptions"
              :key="size"
              type="button"
              @click="changePageSize(size)"
              :class="[
                'px-2 py-0.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
                pageSize === size
                  ? 'bg-navy text-white shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-navy hover:bg-slate-50'
              ]"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- Center: Summary Info -->
        <div class="text-slate-500 font-medium">
          {{ summaryText || `Showing ${items.length} of ${totalItems} records` }}
        </div>

        <!-- Right: Pagination Buttons -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
            class="px-3 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            {{ prevPageLabel || 'Previous' }}
          </button>
          <span class="px-2 font-bold text-navy">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button
            type="button"
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
            class="px-3 py-1 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
          >
            {{ nextPageLabel || 'Next' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  totalItems: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 20, 30, 50]
  },
  showPagination: {
    type: Boolean,
    default: true
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  modelValueSearch: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: ''
  },
  sortKey: {
    type: String,
    default: ''
  },
  sortAsc: {
    type: Boolean,
    default: true
  },
  emptyText: {
    type: String,
    default: ''
  },
  summaryText: {
    type: String,
    default: ''
  },
  itemsPerPageLabel: {
    type: String,
    default: 'Items per page'
  },
  prevPageLabel: {
    type: String,
    default: 'Previous'
  },
  nextPageLabel: {
    type: String,
    default: 'Next'
  }
})

const emit = defineEmits([
  'update:currentPage',
  'update:pageSize',
  'update:modelValueSearch',
  'update:sortKey',
  'update:sortAsc',
  'sort'
])

const totalPages = computed(() => {
  const tot = props.totalItems || props.items.length || 0
  return Math.ceil(tot / (props.pageSize || 10)) || 1
})

const getRowIndex = (idx) => {
  return (props.currentPage - 1) * props.pageSize + idx + 1
}

const getSortIcon = (key) => {
  if (props.sortKey !== key) return 'ph:arrows-down-up'
  return props.sortAsc ? 'ph:arrow-up-bold' : 'ph:arrow-down-bold'
}

const handleSort = (key) => {
  let asc = true
  if (props.sortKey === key) {
    asc = !props.sortAsc
  }
  emit('update:sortKey', key)
  emit('update:sortAsc', asc)
  emit('sort', { key, asc })
}

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return
  emit('update:currentPage', page)
}

const changePageSize = (size) => {
  emit('update:pageSize', size)
  emit('update:currentPage', 1)
}
</script>
