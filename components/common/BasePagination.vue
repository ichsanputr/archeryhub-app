<template>
  <div v-if="totalPages > 1" class="flex flex-wrap items-center justify-center gap-2 mt-12">
    <!-- Previous Button -->
    <button
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
      class="h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-navy hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
    >
      <Icon icon="ph:caret-left-bold" />
    </button>

    <!-- Page Numbers -->
    <template v-for="page in displayedPages" :key="page">
      <button
        v-if="typeof page === 'number'"
        @click="changePage(page)"
        :class="[
          'h-12 min-w-[3rem] px-4 flex items-center justify-center rounded-xl font-bold text-sm transition-all shadow-sm',
          currentPage === page
            ? 'bg-primary text-navy border-2 border-primary'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-primary hover:text-navy'
        ]"
      >
        {{ page }}
      </button>
      <span v-else class="px-2 text-gray-400">...</span>
    </template>

    <!-- Next Button -->
    <button
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      class="h-12 w-12 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-navy hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
    >
      <Icon icon="ph:caret-right-bold" />
    </button>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

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
  }
})

const emit = defineEmits(['change-page'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

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
</script>
