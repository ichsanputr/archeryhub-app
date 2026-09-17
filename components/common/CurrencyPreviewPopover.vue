<template>
  <div class="relative inline-block" ref="popoverRef" @mouseenter="openPopover" @mouseleave="closePopover">
    <!-- Trigger Button -->
    <button
      type="button"
      @click.stop="togglePopover"
      :class="[
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer select-none',
        darkTheme
          ? 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200'
      ]"
      aria-label="View prices in other currencies"
    >
      <span class="text-xs">🌐</span>
      <span>USD / IDR</span>
      <Icon icon="ph:caret-down-bold" class="text-[9px] transition-transform duration-200 opacity-60" :class="{ 'rotate-180': isVisible }" />
    </button>

    <!-- Simple Light Popover Dropdown Panel -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible"
        class="absolute left-0 z-50 mt-1.5 w-52 rounded-xl bg-white text-slate-800 border border-slate-200 p-2 shadow-xl text-left text-xs"
        @click.stop
      >
        <div class="space-y-1.5">
          <!-- USD Row -->
          <div class="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-slate-600 font-semibold flex items-center gap-1.5 text-xs">
              <span class="text-xs">🇺🇸</span>
              <span>USD</span>
            </span>
            <span class="font-bold text-slate-900 text-xs">{{ formattedPriceUSD }}</span>
          </div>

          <!-- IDR Row -->
          <div class="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
            <span class="text-slate-600 font-semibold flex items-center gap-1.5 text-xs">
              <span class="text-xs">🇮🇩</span>
              <span>IDR</span>
            </span>
            <span class="font-bold text-slate-900 text-xs">{{ formattedPriceIDR }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'

// Shared global state across all popover instances to ensure only one is open at a time
const activePopoverId = ref<string | null>(null)
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = withDefaults(
  defineProps<{
    priceUsd?: number
    promoPriceUsd?: number
    priceIdr?: number
    promoPriceIdr?: number
    darkTheme?: boolean
    period?: string
  }>(),
  {
    priceUsd: 0,
    promoPriceUsd: 0,
    priceIdr: 0,
    promoPriceIdr: 0,
    darkTheme: false,
    period: '/event'
  }
)

const instanceId = 'currency-popover-' + Math.random().toString(36).substring(2, 9)
const popoverRef = ref<HTMLElement | null>(null)

const isVisible = computed(() => activePopoverId.value === instanceId)

const openPopover = () => {
  activePopoverId.value = instanceId
}

const closePopover = () => {
  if (activePopoverId.value === instanceId) {
    activePopoverId.value = null
  }
}

const togglePopover = () => {
  if (activePopoverId.value === instanceId) {
    activePopoverId.value = null
  } else {
    activePopoverId.value = instanceId
  }
}

const formattedPriceUSD = computed(() => {
  const p = props.promoPriceUsd > 0 ? props.promoPriceUsd : props.priceUsd
  if (p === 0) return '$0.00'
  return '$' + p.toFixed(2) + props.period
})

const formattedPriceIDR = computed(() => {
  const p = props.promoPriceIdr > 0 ? props.promoPriceIdr : props.priceIdr
  if (p === 0) return 'Rp 0'
  return 'Rp ' + p.toLocaleString('id-ID') + props.period
})

const handleClickOutside = (e: MouseEvent) => {
  if (popoverRef.value && !popoverRef.value.contains(e.target as Node)) {
    if (activePopoverId.value === instanceId) {
      activePopoverId.value = null
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (activePopoverId.value === instanceId) {
    activePopoverId.value = null
  }
})
</script>
