<template>
  <div
    class="relative overflow-hidden bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col justify-between min-h-[110px]"
    :class="colorClasses[color]?.border || 'hover:border-primary/30'"
  >
    <!-- Background Watermark Icon Overlay -->
    <div
      class="absolute right-3 -bottom-3 opacity-[0.06] group-hover:opacity-[0.12] group-hover:scale-110 transition-all duration-500 pointer-events-none"
      :class="colorClasses[color]?.text || 'text-primary'"
    >
      <Icon :icon="icon" class="text-7xl sm:text-8xl" />
    </div>

    <!-- Main Content Header -->
    <div class="flex justify-between items-start relative z-10 w-full">
      <div class="min-w-0 flex-1 pr-2">
        <p class="text-[10px] font-black text-slate-400 tracking-widest uppercase truncate mb-1">
          {{ title }}
        </p>
        <p class="text-2xl sm:text-3xl font-black text-navy tracking-tight tabular-nums truncate leading-none">
          {{ value }}
        </p>
      </div>
      <!-- Top-right Icon Badge -->
      <div
        class="size-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm"
        :class="colorClasses[color]?.bg || 'bg-primary/10 text-primary'"
      >
        <Icon :icon="icon" class="text-xl" />
      </div>
    </div>

    <!-- Optional Footer / Details -->
    <div v-if="$slots.footer || description" class="mt-3 pt-3 border-t border-slate-50 relative z-10 w-full">
      <slot name="footer">
        <p class="text-slate-400 text-[10px] font-bold flex items-center gap-1">
          <Icon v-if="descriptionIcon" :icon="descriptionIcon" class="text-[12px]" />
          {{ description }}
        </p>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
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

const colorClasses = {
  primary: {
    text: 'text-primary',
    bg: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-navy',
    border: 'hover:border-primary/30'
  },
  success: {
    text: 'text-green-500',
    bg: 'bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white',
    border: 'hover:border-green-500/30'
  },
  green: {
    text: 'text-green-500',
    bg: 'bg-green-500/10 text-green-600 group-hover:bg-green-500 group-hover:text-white',
    border: 'hover:border-green-500/30'
  },
  warning: {
    text: 'text-amber-500',
    bg: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
    border: 'hover:border-amber-500/30'
  },
  amber: {
    text: 'text-amber-500',
    bg: 'bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
    border: 'hover:border-amber-500/30'
  },
  info: {
    text: 'text-blue-500',
    bg: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white',
    border: 'hover:border-blue-500/30'
  },
  blue: {
    text: 'text-blue-500',
    bg: 'bg-blue-500/10 text-blue-600 group-hover:bg-blue-500 group-hover:text-white',
    border: 'hover:border-blue-500/30'
  },
  danger: {
    text: 'text-red-500',
    bg: 'bg-red-500/10 text-red-600 group-hover:bg-red-500 group-hover:text-white',
    border: 'hover:border-red-500/30'
  },
  red: {
    text: 'text-red-500',
    bg: 'bg-red-500/10 text-red-600 group-hover:bg-red-500 group-hover:text-white',
    border: 'hover:border-red-500/30'
  },
  slate: {
    text: 'text-slate-400',
    bg: 'bg-slate-100 text-slate-500 group-hover:bg-slate-500 group-hover:text-white',
    border: 'hover:border-slate-300'
  },
  gray: {
    text: 'text-slate-400',
    bg: 'bg-slate-100 text-slate-500 group-hover:bg-slate-500 group-hover:text-white',
    border: 'hover:border-slate-300'
  }
}
</script>
