<script setup>
import { ref, computed } from 'vue'
import { useAsyncData, useRuntimeConfig } from '#app'
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'

defineOptions({
  name: 'CategorySection'
})

// State for pagination and search
const filters = ref({
  limit: 6, // Show 6 categories in homepage section
  offset: 0
})

const apiBaseUrl = useApiBaseUrl()

// Fetch categories with pagination
const { data: categoriesData, pending: categoriesPending, error: categoriesError } = await useAsyncData('categories-section', async () => {
  try {
    const payload = {
      limit: filters.value.limit,
      offset: filters.value.offset,
    }

    const response = await $fetch('/public/category', {
      baseURL: apiBaseUrl,
      method: 'POST',
      body: payload
    })

    return {
      categories: response.categories || [],
      total: response.total || 0
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      categories: [],
      total: 0,
      error: 'Failed to load categories'
    }
  }
})

const categories = computed(() => categoriesData.value?.categories || [])
const apiError = computed(() => categoriesData.value?.error || categoriesError.value?.message)

// Get category icon with fallback
const getCategoryIcon = (icon) => {
  return icon || 'ph:folder'
}
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-yellow-200/30 blur-3xl"></div>
      <div class="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl"></div>
    </div>

    <Container>
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-2xl sm:text-4xl font-bold mb-6">
          <span class="text-gradient">Browse Categories</span><br>
          <span class="text-gray-800">explore problems by programming topics</span>
        </h2>
        <p class="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Discover problems organized by different programming concepts and topics. Find the perfect challenges to
          improve your skills in specific areas.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="categoriesPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full animate-pulse">
          <div class="flex flex-col items-center text-center gap-4">
            <div class="w-16 h-16 bg-gray-100 rounded-2xl"></div>
            <div class="flex-1 w-full space-y-2">
              <div class="h-5 bg-gray-100 rounded-xl"></div>
              <div class="h-4 bg-gray-100 rounded-xl w-3/4 mx-auto"></div>
              <div class="h-3 bg-gray-100 rounded-xl w-1/2 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="category in categories" :key="category.id" :to="`/category/${category.slug}`"
          class="group">
          <div
            class="block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full transition-all duration-300 hover:border-yellow-200 hover:shadow-md">
            <div class="flex flex-col items-center text-center gap-4">
              <div class="p-4 bg-yellow-100 rounded-2xl group-hover:bg-yellow-200 transition-colors duration-300">
                <Icon :icon="getCategoryIcon(category.icon)" class="w-8 h-8 text-yellow-600" />
              </div>
              <div class="flex-1 min-w-0 w-full">
                <h3
                  class="font-bold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-yellow-600 transition-colors duration-300">
                  {{ category.name }}
                </h3>
                <p v-if="category.description"
                  class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3 min-h-[2.5rem]">
                  {{ category.description }}
                </p>
                <div class="text-xs text-gray-500">
                  {{ category.problem_count }} problem{{ category.problem_count !== 1 ? 's' : '' }}
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- See All Categories Link -->
      <div class="mt-12 text-center">
        <NuxtLink to="/category"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white text-yellow-600 font-semibold rounded-lg border-2 border-yellow-600 hover:bg-yellow-600 hover:text-white transition-all duration-300 hover:shadow-md">
          <span>See All Categories</span>
          <Icon icon="ph:arrow-right" class="w-5 h-5" />
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-if="!categoriesPending && categories.length === 0" class="text-center py-12">
        <Icon icon="ph:folder-x" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 class="text-lg font-semibold mb-2 text-gray-900">
          {{ apiError ? 'Failed to load categories.' : 'No categories available.' }}
        </h3>
        <p v-if="!apiError" class="text-gray-500 mb-4">Categories will be available soon.</p>
      </div>
    </Container>
  </section>
</template>

<style scoped>
/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
