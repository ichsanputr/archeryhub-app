<template>
  <div class="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/20 bg-gradient-to-r from-navy via-navy-dark to-navy/95 text-white shadow-sm">
    <!-- Top 1px Golden Accent Line -->
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
    
    <!-- Theme Motif Pattern -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.18);"
    ></div>
    
    <!-- Decorative Glowing Spheres -->
    <div class="absolute -top-12 -left-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>

    <div class="relative p-5 sm:p-8 flex flex-col gap-5 sm:gap-6">
      
      <!-- Top Row: Back Button & Breadcrumbs (Rendered if backTo or breadcrumbs provided or custom slot) -->
      <div
        v-if="backTo || breadcrumbs?.length || parentTitle || $slots.breadcrumbs"
        class="flex flex-wrap items-center justify-between gap-3"
      >
        <!-- Back Button -->
        <NuxtLink
          v-if="backTo"
          :to="backTo"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all backdrop-blur-md border border-white/10 shadow-2xs"
        >
          <Icon icon="ph:arrow-left-bold" class="text-sm text-white" />
          <span>{{ backText || t('common.back') }}</span>
        </NuxtLink>

        <!-- Breadcrumbs Navigation -->
        <slot name="breadcrumbs">
          <nav v-if="breadcrumbs?.length || parentTitle" class="flex text-xs font-bold text-white/50 tracking-wider items-center gap-1.5 flex-wrap">
            <template v-if="parentTitle && parentTo">
              <NuxtLink :to="parentTo" class="hover:text-white transition-colors text-white/60">{{ parentTitle }}</NuxtLink>
              <Icon icon="ph:caret-right-bold" class="text-[10px] text-white/40" />
            </template>

            <template v-for="(crumb, idx) in breadcrumbs" :key="idx">
              <NuxtLink
                v-if="crumb.to && idx < breadcrumbs.length - 1"
                :to="crumb.to"
                class="hover:text-white transition-colors text-white/60"
              >
                {{ crumb.label }}
              </NuxtLink>
              <span v-else-if="idx < breadcrumbs.length - 1" class="text-white/60">
                {{ crumb.label }}
              </span>
              <span v-else class="text-white font-bold truncate max-w-[200px] sm:max-w-xs">
                {{ crumb.label }}
              </span>

              <Icon
                v-if="idx < breadcrumbs.length - 1"
                icon="ph:caret-right-bold"
                class="text-[10px] text-white/40"
              />
            </template>
          </nav>
        </slot>
      </div>

      <!-- Main Header Body: Icon + Title & Subtitle + Action Buttons -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        
        <!-- Left: Icon & Text -->
        <div class="flex items-start sm:items-center gap-4 sm:gap-5 flex-1 min-w-0">
          <slot name="icon">
            <div
              v-if="icon"
              class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shrink-0"
            >
              <Icon :icon="icon" class="text-2xl sm:text-3xl text-white" :class="iconClass" />
            </div>
          </slot>

          <div class="min-w-0 text-left flex-1">
            <!-- Inline Badge / Category Chip above Title if provided -->
            <div v-if="badge" class="mb-1.5">
              <span
                class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider border shadow-2xs"
                :class="badgeClasses"
              >
                {{ badge }}
              </span>
            </div>

            <!-- Title -->
            <slot name="title">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-black leading-tight tracking-tight text-white truncate">
                {{ title }}
              </h1>
            </slot>

            <!-- Subtitle -->
            <slot name="subtitle">
              <div v-if="subtitle" class="text-slate-300 text-xs sm:text-sm font-medium mt-1 max-w-3xl leading-relaxed">
                {{ subtitle }}
              </div>
            </slot>
          </div>
        </div>

        <!-- Right: Action Buttons Slot -->
        <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          <slot name="actions" />
        </div>

      </div>

      <!-- Default Body Content (if any extra items passed) -->
      <slot />

      <!-- Extra Slot (e.g. Navigation Tabs, Search Bar, or Filters) -->
      <div v-if="$slots.extra" class="pt-4 sm:pt-6 border-t border-white/10">
        <slot name="extra" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import useDashboardI18n from '~/composables/useDashboardI18n'

const { t } = useDashboardI18n()

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'ph:squares-four-bold'
  },
  iconClass: {
    type: String,
    default: ''
  },
  breadcrumbs: {
    type: Array,
    default: () => []
  },
  parentTitle: {
    type: String,
    default: ''
  },
  parentTo: {
    type: String,
    default: ''
  },
  backTo: {
    type: String,
    default: ''
  },
  backText: {
    type: String,
    default: ''
  },
  badge: {
    type: String,
    default: ''
  },
  badgeVariant: {
    type: String,
    default: 'primary' // 'primary', 'emerald', 'amber', 'slate', 'indigo'
  }
})

const badgeClasses = computed(() => {
  switch (props.badgeVariant) {
    case 'emerald':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    case 'amber':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    case 'slate':
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    case 'indigo':
      return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    case 'primary':
    default:
      return 'bg-primary/20 text-primary border-primary/30'
  }
})
</script>
