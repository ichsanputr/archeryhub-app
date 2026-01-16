<script setup>
import { ref, computed, watch } from 'vue'
import { useAsyncData, useRuntimeConfig, useHead } from '#app'
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'

defineOptions({
  name: 'CategoryIndexPage'
})

// State for pagination, search, and filters
const filters = ref({
  search: '',
  limit: 12,
  offset: 0
})

const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

// Debounced search
const debouncedSearch = ref('')
let searchTimeout = null

watch(() => filters.value.search, (newSearch) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    debouncedSearch.value = newSearch
    filters.value.offset = 0 // Reset to first page
    refreshCategories()
  }, 300)
})

// Fetch categories with enhanced filtering
const { data: categoriesData, pending: categoriesPending, error: categoriesError, refresh: refreshCategories } = await useAsyncData('categories-full', async () => {
  try {
    const payload = {
      search: debouncedSearch.value,
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
const total = computed(() => categoriesData.value?.total || 0)
const apiError = computed(() => categoriesData.value?.error || categoriesError.value?.message)

const page = computed(() => Math.floor(filters.value.offset / filters.value.limit) + 1)
const pages = computed(() => Math.max(1, Math.ceil(total.value / filters.value.limit)))

// Handle pagination
const goToPage = (pageNumber) => {
  filters.value.offset = (pageNumber - 1) * filters.value.limit
  refreshCategories()
}

// Get category icon with fallback
const getCategoryIcon = (icon) => {
  return icon || 'ph:folder'
}

// Clear search
const clearSearch = () => {
  filters.value.search = ''
  debouncedSearch.value = ''
  filters.value.offset = 0
  refreshCategories()
}

// SEO
const route = useRoute()
useHead({
  title: 'Categories - BudiBadu Coding Challenge',
  meta: [
    { name: 'description', content: 'Browse all programming categories and topics. Find coding challenges organized by different programming concepts and skills.' },
    { name: 'keywords', content: 'programming categories, coding topics, algorithm categories, data structures, programming concepts' }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://budibadu.com${route.path}`
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="pt-10 pb-2 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
      <!-- Background Elements -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-yellow-200/30 blur-3xl"></div>
        <div class="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl"></div>
        <div class="absolute inset-0 [mask-image:radial-gradient(50%_50%_at_50%_50%,black,transparent_70%)]">
          <div
            class="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,200,50,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,200,50,0.06)_1px,transparent_1px)] bg-[size:36px_36px]">
          </div>
        </div>
      </div>

      <Container>
        <div class="text-center mb-12">
          <h1 class="text-2xl sm:text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900 mb-4">
            Programming Problems Categories
          </h1>

          <p class="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover a wide range of problems organized by programming concepts, topics, and difficulty levels. Explore
            curated challenges that strengthen your understanding of algorithms, data structures, and real-world coding
            scenarios — helping you sharpen your skills where it matters most.
          </p>

          <!-- Search Bar -->
          <div class="max-w-md mx-auto relative">
            <div class="relative">
              <Icon :ssr="true" icon="ph:magnifying-glass"
                class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input v-model="filters.search" type="text" placeholder="Search categories..."
                class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white shadow-sm" />
              <button v-if="filters.search" @click="clearSearch"
                class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <Icon :ssr="true" icon="ph:x" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>

    <!-- Categories Section -->
    <section class="py-12 sm:py-10">
      <Container>
        <!-- Results Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              All Categories
              <span v-if="!categoriesPending" class="text-sm font-normal text-gray-500 ml-2">
                ({{ total }} total)
              </span>
            </h2>
            <p v-if="filters.search" class="text-sm text-gray-600">
              Results for "<span class="font-medium">{{ filters.search }}</span>"
            </p>
          </div>

          <!-- Results per page selector -->
          <div class="flex items-center gap-2 mt-4 sm:mt-0">
            <span class="text-sm text-gray-600">Show:</span>
            <select v-model="filters.limit" @change="filters.offset = 0; refreshCategories()"
              class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
              <option :value="12">12</option>
              <option :value="24">24</option>
              <option :value="48">48</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="categoriesPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in filters.limit" :key="i"
            class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full animate-pulse">
            <div class="flex flex-col items-center text-center gap-4">
              <div class="w-16 h-16 bg-gray-200 rounded-lg"></div>
              <div class="flex-1 w-full">
                <div class="h-5 bg-gray-200 rounded mb-2"></div>
                <div class="h-4 bg-gray-200 rounded mb-3 w-3/4 mx-auto"></div>
                <div class="h-3 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Categories Grid -->
        <div v-else-if="categories.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <a v-for="(category, i) in categories" :key="category.id" :href="`/category/${category.slug}`"
            v-motion="{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }" :duration="400" :delay="i * 50"
            class="group block">
            <div
              class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full transition-all duration-300 hover:shadow-lg hover:border-yellow-200 hover:-translate-y-1">
              <div class="flex flex-col items-center text-center gap-4 h-full">
                <div class="p-4 bg-yellow-100 rounded-xl group-hover:bg-yellow-200 transition-colors duration-300">
                  <Icon :ssr="true" :icon="getCategoryIcon(category.icon)" class="w-8 h-8 text-yellow-600" />
                </div>

                <div class="flex-1 min-w-0 w-full flex flex-col">
                  <h3
                    class="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors duration-300">
                    {{ category.name }}
                  </h3>

                  <p v-if="category.description" class="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-auto">
                    {{ category.description }}
                  </p>

                  <div class="mt-4 pt-4 border-t border-gray-100">
                    <div class="flex items-center justify-center text-sm">
                      <Icon :ssr="true" icon="ph:code" class="w-4 h-4 text-gray-400 mr-1" />
                      <span class="text-gray-600">
                        {{ category.problem_count }} problem{{ category.problem_count !== 1 ? 's' : '' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="max-w-md mx-auto">
            <Icon :ssr="true" icon="ph:folder-x" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 class="text-xl font-semibold mb-2 text-gray-900">
              {{ apiError ? 'Failed to load categories' : filters.search ? 'No categories found' : 'No categories available' }}
            </h3>
            <p class="text-gray-500 mb-6">
              {{ filters.search
                ? `Try adjusting your search term or check the spelling.`
                : 'Categories will be available soon.'
              }}
            </p>
            <button v-if="filters.search" @click="clearSearch"
              class="btn-primary inline-flex items-center gap-2 px-4 py-2">
              <Icon :ssr="true" icon="ph:arrow-counter-clockwise" class="w-4 h-4" />
              Clear Search
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="pages > 1 && !categoriesPending"
          class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <!-- Page Info -->
          <div class="text-sm text-gray-600">
            Showing {{ Math.min(filters.value.offset + 1, total) }} - {{ Math.min(filters.value.offset +
              filters.value.limit, total) }} of {{ total }} categories
          </div>

          <!-- Pagination Controls -->
          <div class="flex items-center gap-2">
            <!-- Previous Button -->
            <button v-if="page > 1" @click="goToPage(page - 1)"
              class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-yellow-300 transition-colors duration-200 flex items-center gap-1">
              <Icon :ssr="true" icon="ph:caret-left" class="w-4 h-4" />
              Previous
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <!-- First page -->
              <template v-if="page > 3">
                <button @click="goToPage(1)"
                  class="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-yellow-300 transition-colors duration-200">
                  1
                </button>
                <span v-if="page > 4" class="px-2 text-gray-400">...</span>
              </template>

              <!-- Current page and neighbors -->
              <template v-for="i in Math.min(5, pages)" :key="i">
                <template v-if="Math.max(1, page - 2) + i - 1 <= pages">
                  <span v-if="Math.max(1, page - 2) + i - 1 === page"
                    class="px-3 py-2 text-sm text-white bg-yellow-600 rounded-lg">
                    {{ Math.max(1, page - 2) + i - 1 }}
                  </span>
                  <button v-else @click="goToPage(Math.max(1, page - 2) + i - 1)"
                    class="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-yellow-300 transition-colors duration-200">
                    {{ Math.max(1, page - 2) + i - 1 }}
                  </button>
                </template>
              </template>

              <!-- Last page -->
              <template v-if="page < pages - 2">
                <span v-if="page < pages - 3" class="px-2 text-gray-400">...</span>
                <button @click="goToPage(pages)"
                  class="px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-yellow-300 transition-colors duration-200">
                  {{ pages }}
                </button>
              </template>
            </div>

            <!-- Next Button -->
            <button v-if="page < pages" @click="goToPage(page + 1)"
              class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-yellow-300 transition-colors duration-200 flex items-center gap-1">
              Next
              <Icon :ssr="true" icon="ph:caret-right" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  </div>
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

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>