<template>
  <div :class="gridClasses">
    <!-- Card Style Skeleton -->
    <template v-if="type === 'card'">
      <div v-for="i in count" :key="i"
        class="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse space-y-4">
        <!-- Card Header / Avatar + Title -->
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-slate-100 shrink-0"></div>
          <div class="space-y-2 flex-1">
            <div class="h-4 bg-slate-100 rounded-md w-3/4"></div>
            <div class="h-3 bg-slate-100 rounded-md w-1/2"></div>
          </div>
        </div>
        <!-- Card Body -->
        <div class="space-y-2 pt-2">
          <div class="h-3 bg-slate-100 rounded-md w-full"></div>
          <div class="h-3 bg-slate-100 rounded-md w-4/5"></div>
        </div>
        <!-- Card Footer -->
        <div class="pt-3 border-t border-slate-50 flex items-center justify-between">
          <div class="h-3 bg-slate-100 rounded-md w-1/4"></div>
          <div class="h-8 bg-slate-100 rounded-xl w-20"></div>
        </div>
      </div>
    </template>

    <!-- Media / Image Style Skeleton -->
    <template v-else-if="type === 'media'">
      <div v-for="i in count" :key="i"
        class="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse flex flex-col">
        <div class="aspect-[16/10] w-full bg-slate-100"></div>
        <div class="p-6 space-y-3 flex-1 flex flex-col justify-between">
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div class="h-4 w-16 bg-slate-100 rounded-full"></div>
              <div class="h-3 w-20 bg-slate-100 rounded-md"></div>
            </div>
            <div class="h-5 bg-slate-100 rounded-md w-4/5"></div>
            <div class="h-3 bg-slate-100 rounded-md w-full"></div>
            <div class="h-3 bg-slate-100 rounded-md w-2/3"></div>
          </div>
          <div class="pt-3 border-t border-slate-50 flex items-center justify-between">
            <div class="h-3 bg-slate-100 rounded-md w-24"></div>
            <div class="h-8 bg-slate-100 rounded-xl w-24"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- List Style Skeleton -->
    <template v-else-if="type === 'list'">
      <div v-for="i in count" :key="i"
        class="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 shadow-sm animate-pulse flex items-center justify-between gap-4">
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-12 h-12 rounded-xl bg-slate-100 shrink-0"></div>
          <div class="space-y-2 flex-1 min-w-0">
            <div class="h-4 bg-slate-100 rounded-md w-1/2"></div>
            <div class="h-3 bg-slate-100 rounded-md w-1/3"></div>
          </div>
        </div>
        <div class="h-9 bg-slate-100 rounded-xl w-24 shrink-0 hidden sm:block"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  count: {
    type: Number,
    default: 6
  },
  type: {
    type: String,
    default: 'card', // 'card' | 'media' | 'list'
    validator: (v) => ['card', 'media', 'list'].includes(v)
  },
  grid: {
    type: String,
    default: ''
  }
})

const gridClasses = computed(() => {
  if (props.grid) return props.grid
  if (props.type === 'list') return 'space-y-3 w-full'
  return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
})
</script>
