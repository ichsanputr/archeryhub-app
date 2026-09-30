<template>
  <div
    class="relative overflow-hidden bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-primary/40 transition-all duration-300 flex flex-col justify-between min-h-[110px]"
  >
    <!-- Background Watermark Icon Overlay -->
    <div
      class="absolute right-3 -bottom-3 opacity-[0.12] scale-110 pointer-events-none text-primary"
    >
      <Icon :icon="icon" class="text-7xl sm:text-8xl" />
    </div>

    <!-- Main Content Header -->
    <div class="flex justify-between items-start relative z-10 w-full">
      <div class="min-w-0 flex-1 pr-2">
        <div class="text-xs font-bold text-slate-500 dark:text-slate-400 truncate mb-1">
          {{ title }}
        </div>
        <div
          class="font-black text-navy dark:text-white tracking-tight tabular-nums truncate leading-tight"
          :class="[valueClass || computedValueSizeClass]"
          :title="String(value ?? '')"
        >
          {{ value }}
        </div>
      </div>
      <!-- Top-right Icon Badge -->
      <div
        class="size-10 rounded-xl flex items-center justify-center shrink-0 bg-primary text-btn-text"
      >
        <Icon :icon="icon" class="text-xl" />
      </div>
    </div>

    <!-- Optional Footer / Details -->
    <div v-if="$slots.footer || description" class="mt-auto pt-3 border-t border-slate-50 dark:border-slate-700 relative z-10 w-full">
      <slot name="footer">
        <div class="text-slate-400 dark:text-slate-400 text-[10px] font-bold flex items-center gap-1">
          <Icon v-if="descriptionIcon" :icon="descriptionIcon" class="text-[12px]" />
          <span class="truncate">{{ description }}</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  valueClass: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary'
  },
  description: {
    type: String,
    default: ''
  },
  descriptionIcon: {
    type: String,
    default: ''
  }
})

const computedValueSizeClass = computed(() => {
  const str = String(props.value ?? '').trim()
  if (str.length > 14) {
    return 'text-base sm:text-lg'
  }
  if (str.length > 7) {
    return 'text-lg sm:text-xl'
  }
  return 'text-2xl sm:text-3xl'
})
</script>
