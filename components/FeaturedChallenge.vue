<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
  challenge: {
    type: Object,
    required: true
  }
})

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-yellow-500'
    case 'Medium':
      return 'bg-orange-500'
    case 'Hard':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

const formatNumber = (num) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>

<template>
  <div class="group bg-white rounded-lg shadow-sm border border-gray-200 p-5 transition-all duration-300 hover:shadow-md hover:border-yellow-200 cursor-pointer">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors mb-1">
          {{ challenge.title }}
        </h3>
        <p class="text-sm text-gray-600 line-clamp-2">
          {{ challenge.description }}
        </p>
      </div>
      <div :class="[getDifficultyColor(challenge.difficulty), 'px-2 py-1 rounded text-white text-xs font-medium ml-3']">
        {{ challenge.difficulty }}
      </div>
    </div>

    <!-- Stats -->
    <div class="flex items-center space-x-4 mb-3 text-sm text-gray-500">
      <div class="flex items-center">
        <Icon :ssr="true" icon="ph:users" class="w-4 h-4 mr-1" />
        <span>{{ formatNumber(challenge.completions) }} solved</span>
      </div>
      <div class="flex items-center">
        <Icon :ssr="true" icon="ph:clock" class="w-4 h-4 mr-1" />
        <span>{{ challenge.estimatedTime }}</span>
      </div>
    </div>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1 mb-4">
      <span
        v-for="tag in challenge.tags"
        :key="tag"
        class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Action -->
    <div class="flex items-center justify-between">
      <div class="text-xs text-gray-400">
        in {{ challenge.category }}
      </div>
      <button class="flex items-center bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        <Icon :ssr="true" icon="ph:play" class="w-4 h-4 mr-1" />
        Start
      </button>
    </div>
  </div>
</template>
