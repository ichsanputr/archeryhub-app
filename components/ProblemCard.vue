<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'
import { useLoginPrompt } from '~/composables/useLoginPrompt'
import { navigateTo } from '#app'

const props = defineProps({
  problem: {
    type: Object,
    required: true
  },
  showSaveButton: {
    type: Boolean,
    default: true
  },
  saved: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:saved', 'removed'])

const { user, getToken } = useAuth()
const { showSaveLoginPrompt } = useLoginPrompt()
const isSaving = ref(false)

// Toggle save problem functionality
const toggleSaveProblem = async (slug) => {
  const token = getToken()
  if (!token) {
    throw new Error('User not authenticated')
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000'
  const isCurrentlySaved = props.saved

  if (isCurrentlySaved) {
    // Remove saved problem
    await $fetch(`${apiBaseUrl}/user/saved-problem/${slug}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    // Emit a custom event so parents can update their local lists
    emit('removed', slug)
  } else {
    // Save problem
    await $fetch(`${apiBaseUrl}/user/saved-problem`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: {
        slug: slug
      }
    })
  }
}

const navigateToProblem = () => {
  const slug = props.problem.slug || props.problem.stem || props.problem._path?.split('/').pop()?.replace('.md', '')
  // Remove any 'problem/' prefix if it exists
  const cleanSlug = slug?.replace('problem/', '') || 'unknown'
  navigateTo(`/problem/${cleanSlug}`)
}

const handleSave = async (event) => {
  event.stopPropagation() // Prevent navigation

  if (!user.value) {
    // Show login prompt toast with action button
    showSaveLoginPrompt()
    return
  }

  isSaving.value = true
  try {
    const slug = props.problem.slug || props.problem.stem || props.problem._path?.split('/').pop()?.replace('.md', '')
    const cleanSlug = slug?.replace('problem/', '') || 'unknown'

    await toggleSaveProblem(cleanSlug)

    // Emit event to parent to update the saved state
    emit('update:saved', !props.saved)
  } catch (error) {
    console.error('Error saving problem:', error)
    // You could show a toast notification here
  } finally {
    isSaving.value = false
  }
}

// Parse categories safely
const parsedCategories = computed(() => {
  try {
    if (props.problem.meta?.categories) {
      return props.problem.meta.categories
    }

    if (props.problem.categories) {
      const categoryArray = typeof props.problem.categories === 'string'
        ? JSON.parse(props.problem.categories)
        : props.problem.categories

      return Array.isArray(categoryArray) ? categoryArray : []
    }

    return []
  } catch (error) {
    console.warn('Failed to parse categories for problem:', props.problem.id, error)
    return []
  }
})

</script>

<template>
  <div
    class="group bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all duration-300 hover:shadow-md hover:border-yellow-200 cursor-pointer h-full flex flex-col"
    @click="navigateToProblem">
    <!-- Header -->
    <div class="flex items-start justify-between mb-3 sm:mb-4">
      <div class="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
        <div class="flex-1 min-w-0">
          <h3
            class="text-base sm:text-lg font-black text-navy group-hover:text-primary transition-colors duration-200 truncate font-display tracking-tight">
            {{ problem.title }}
          </h3>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <span v-if="problem.category_name"
          class="bg-primary/20 text-navy px-2 py-1 rounded-full text-[10px] font-bold  tracking-wider">
          {{ problem.category_name }}
        </span>
        <div v-if="problem.featured"
          class="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-[10px] font-bold  tracking-wider">
          Featured
        </div>
      </div>
    </div>

    <!-- Description -->
    <p class="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
      {{ problem.description }}
    </p>

    <!-- Categories (hide for random problems with category_name) -->
    <div v-if="!problem.category_name" class="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
      <span v-for="category in parsedCategories.slice(0, 3)" :key="category"
        class="px-2 py-0.5 rounded-full border border-gray-200 text-[10px] font-bold text-gray-500  tracking-wider">
        {{ category }}
      </span>
      <span v-if="parsedCategories.length > 3"
        class="px-2 py-0.5 rounded-full border border-gray-100 bg-gray-50 text-[10px] font-bold text-gray-400  tracking-wider">
        +{{ parsedCategories.length - 3 }}
      </span>
    </div>

    <!-- Action -->
    <div class="mt-auto flex items-center justify-between">
      <div
        class="flex items-center text-primary font-bold text-xs sm:text-sm group-hover:translate-x-1 transition-transform">
        <span class="hidden sm:inline">Lihat Detail</span>
        <span class="sm:hidden">Detail</span>
        <Icon :ssr="true" icon="ph:arrow-right" class="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
      </div>

      <!-- Save Button -->
      <button v-if="showSaveButton" @click="handleSave" :disabled="isSaving"
        class="p-2 rounded-lg transition-colors hover:bg-gray-100 flex items-center justify-center border border-transparent active:scale-95 transition-all"
        :class="{
          'text-primary bg-primary/5 border-primary/20': props.saved,
          'text-gray-300': !props.saved
        }">
        <Icon :ssr="true" v-if="!isSaving" :icon="props.saved ? 'ph:bookmark-simple-fill' : 'ph:bookmark-simple'"
          class="w-4 h-4" />
        <Icon :ssr="true" v-else icon="ph:spinner" class="w-4 h-4 animate-spin" />
      </button>
    </div>
  </div>
</template>
