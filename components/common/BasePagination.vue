<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-6 w-full"
    :class="[noMargin ? '' : 'mt-8 sm:mt-12']">
    <!-- Left: Info Text -->
    <div v-if="showInfo" class="flex items-center gap-3">
      <div
        class="hidden sm:flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary shrink-0 border border-primary/20">
        <Icon icon="ph:list-numbers-bold" class="text-xl text-black/60" />
      </div>
      <div class="flex flex-col">
        <span class=" text-xs font-black tracking-widest text-gray-400">{{ t('pagination.stats_label') }}</span>
        <p class="text-xs sm:text-sm text-gray-500 font-bold leading-tight">
          {{ t('pagination.showing') }} <span class="text-navy underline decoration-primary decoration-2 underline-offset-2">{{ startItem
          }}</span>
          - <span class="text-navy underline decoration-primary decoration-2 underline-offset-2">{{ endItem }}</span>
          {{ t('pagination.of') }} <span class="text-navy font-black tabular-nums">{{ totalItems }}</span> {{ t('pagination.entries') }}
        </p>
      </div>
    </div>

    <!-- Center/Right: Controls -->
    <div class="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      <div v-if="showPageSize" class="mr-4 hidden lg:flex items-center gap-3">
        <span class="text-xs font-black tracking-widest text-gray-400">{{ t('pagination.rows') }}</span>
        <BaseSelect :model-value="itemsPerPage" :options="pageSizeSelectOptions" class="w-24 text-xs" @update:model-value="$emit('update:itemsPerPage', parseInt($event))" />
      </div>

      <!-- Navigation Group -->
      <div class="flex items-center gap-1.5 p-1.5 bg-gray-50/50 border border-gray-100 rounded-2xl">
        <!-- Previous Button -->
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
          class="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-navy hover:bg-navy hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-95 group"
          :aria-label="t('pagination.prev_page')">
          <Icon icon="ph:caret-left-bold" class="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        <!-- Page Numbers -->
        <div class="flex items-center gap-1 px-1">
          <template v-for="page in displayedPages" :key="page">
            <button v-if="typeof page === 'number'" @click="changePage(page)" :class="[
              'h-10 min-w-[2.5rem] px-3 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 active:scale-95',
              currentPage === page
                ? 'bg-primary text-primary-text border-2 border-white shadow-sm shadow-primary/20 ring-1 ring-primary/20 scale-110 z-10'
                : 'bg-white text-gray-500 border border-transparent hover:border-primary/30 hover:text-navy hover:shadow-sm'
            ]">
              {{ page }}
            </button>
            <div v-else class="w-8 flex justify-center">
              <span class="text-gray-400 font-black tracking-widest text-xs">...</span>
            </div>
          </template>
        </div>

        <!-- Next Button -->
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-navy hover:bg-navy hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 shadow-sm active:scale-95 group"
          :aria-label="t('pagination.next_page')">
          <Icon icon="ph:caret-right-bold" class="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <!-- Quick Jump (Mobile/Small Desktop) -->
      <div v-if="totalPages > 5" class="ml-2 flex items-center gap-2 lg:hidden">
        <input type="number" min="1" :max="totalPages" :placeholder="t('pagination.jump_placeholder')"
          class="h-10 w-20 px-3 rounded-xl bg-white border border-gray-200 text-navy text-xs font-bold focus:border-primary outline-none transition-all"
          @keydown.enter="jumpToPage" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 10
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  showPageSize: {
    type: Boolean,
    default: true
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  noMargin: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['change-page', 'update:itemsPerPage'])

const pageSizeSelectOptions = computed(() => {
  return props.pageSizeOptions.map(size => ({ title: String(size), value: size }))
})

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const startItem = computed(() => {
  if (props.totalItems === 0) return 0
  return (props.currentPage - 1) * props.itemsPerPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.itemsPerPage, props.totalItems)
})

const displayedPages = computed(() => {
  const total = totalPages.value
  const current = props.currentPage
  const padding = 1
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > padding + 2) pages.push('...')

    const start = Math.max(2, current - padding)
    const end = Math.min(total - 1, current + padding)

    for (let i = start; i <= end; i++) pages.push(i)

    if (current < total - padding - 1) pages.push('...')
    pages.push(total)
  }

  return pages
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('change-page', page)
  }
}

const jumpToPage = (event) => {
  const page = parseInt(event.target.value)
  if (page >= 1 && page <= totalPages.value) {
    changePage(page)
    event.target.value = ''
  }
}
</script>

<style scoped>
/* Hide arrow buttons for number input */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}
</style>
