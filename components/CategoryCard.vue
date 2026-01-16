<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  problem_count: {
    type: Number,
    required: true,
    default: 0
  }
})
</script>

<template>
  <div 
    class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3 sm:mb-4">
      <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
        <div class="p-2 sm:p-3 rounded-lg text-white flex-shrink-0" :style="{ backgroundColor: '#' + color }">
            <Icon :ssr="true" :icon="icon" class="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 truncate">
            {{ title }}
          </h3>
          <p class="text-xs sm:text-sm text-gray-500">{{ problem_count }} problems</p>
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-3">
      {{ description }}
    </p>

  </div>
</template>
