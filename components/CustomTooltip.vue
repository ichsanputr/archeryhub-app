<template>
  <div class="relative inline-block" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
    <!-- Activator slot -->
    <slot />

    <!-- Tooltip -->
    <transition name="tooltip">
      <div v-show="showTooltip && (text || htmlText)" :class="[
        'absolute z-50 px-2 py-1 text-xs font-medium rounded shadow-lg pointer-events-none',
        'top-full left-1/2 transform -translate-x-1/2 mt-2',
        'min-w-[200px] max-w-[300px]',
        htmlText ? '' : 'whitespace-nowrap',
        theme === 'dark'
          ? 'bg-gray-800 text-white border border-gray-700'
          : 'bg-gray-900 text-white'
      ]">
        <div v-show="htmlText" v-html="htmlText"></div>
        <!-- Tooltip arrow -->
        <div :class="[
          'absolute bottom-full left-1/2 transform -translate-x-1/2',
          'w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent',
          theme === 'dark'
            ? 'border-b-gray-800'
            : 'border-b-gray-900'
        ]" />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  text: {
    type: String,
    required: false
  },
  htmlText: {
    type: String,
    required: false
  },
  theme: {
    type: String,
    default: 'dark'
  }
})

const showTooltip = ref(false)
</script>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
