<script setup>
import { Icon } from '@iconify/vue'

// Props
defineProps({
  selectedDifficulty: {
    type: String,
    default: 'All'
  },
  selectedStatus: {
    type: String,
    default: 'All'
  },
  searchQuery: {
    type: String,
    default: ''
  },
  difficulties: {
    type: Array,
    default: () => ['All', 'Easy', 'Medium', 'Hard']
  },
  statuses: {
    type: Array,
    default: () => [
      { title: 'All', value: 'All' },
      { title: 'Todo', value: 'todo' },
      { title: 'Solved', value: 'solved' },
      { title: 'Attempted', value: 'attempted' }
    ]
  }
})

// Emits
defineEmits([
  'update:selectedDifficulty',
  'update:selectedStatus', 
  'update:searchQuery'
])
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6 mb-8 shadow-gray-200/50">
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">
        Practice Problems
      </h2>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700">
          Difficulty
        </label>
        <v-select
          :model-value="selectedDifficulty"
          @update:model-value="$emit('update:selectedDifficulty', $event)"
          :items="difficulties"
          variant="outlined"
          density="compact"
          hide-details
          class="w-full"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700">
          Status
        </label>
        <v-select
          :model-value="selectedStatus"
          @update:model-value="$emit('update:selectedStatus', $event)"
          :items="statuses"
          variant="outlined"
          density="compact"
          hide-details
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700">
          Search
        </label>
        <v-text-field
          :model-value="searchQuery"
          @update:model-value="$emit('update:searchQuery', $event)"
          variant="outlined"
          density="compact"
          placeholder="Search problems..."
          hide-details
          clearable
          class="w-full"
        >
          <template #prepend-inner>
            <Icon :ssr="true" icon="ph:magnifying-glass" class="w-4 h-4" />
          </template>
        </v-text-field>
      </div>  
    </div>
  </div>
</template> 