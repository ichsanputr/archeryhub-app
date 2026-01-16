<script setup>
import { ref, computed, watch } from 'vue'
import { useAsyncData, useRuntimeConfig, useHead } from '#app'
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'

// Define component name to fix linter error
defineOptions({
  name: 'ProblemIndexPage'
})

const route = useRoute()
const router = useRouter()

// Filter state (no query params) - removed platform filter since problems are now platform-agnostic
const filters = ref({
  search: '',
  difficulty: '',
  category: '',
  sort: 'latest',
  limit: 15,
  offset: 0
})

// Initialize page from query parameter if present
if (route.query.page) {
  const initialPage = parseInt(route.query.page, 10)
  if (!isNaN(initialPage) && initialPage > 0) {
    filters.value.offset = (initialPage - 1) * filters.value.limit
  }
}

const apiBaseUrl = useRuntimeConfig().public.apiBaseUrl

// Fetch problems (removed platform filtering since problems are now platform-agnostic)
const { data: problemsData, pending: problemsPending, error: problemsError, refresh: refreshProblems } = await useAsyncData('problems-page', async () => {
  try {
    const payload = {
      difficulty: filters.value.difficulty || undefined,
      search: filters.value.search || undefined,
      category_slug: filters.value.category || undefined,
      sort: filters.value.sort,
      limit: filters.value.limit,
      offset: filters.value.offset,
    }

    const response = await $fetch('/public/problem', {
      baseURL: apiBaseUrl,
      method: 'POST',
      body: payload
    })

    return {
      problems: response.problems || [],
      total: response.total || 0
    }
  } catch (error) {
    console.error('Error fetching problems:', error)
    return {
      problems: [],
      total: 0,
      error: 'Failed to load problems'
    }
  }
})

// Fetch category options for filter dropdown
const { data: categoriesData } = await useAsyncData('categories-options', async () => {
  try {
    const response = await $fetch('/public/category', {
      baseURL: apiBaseUrl,
      method: 'GET'
    })
    return response.categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
})

const categories = computed(() => categoriesData.value || [])

const problems = computed(() => problemsData.value?.problems || [])
const total = computed(() => problemsData.value?.total || 0)
const apiError = computed(() => problemsData.value?.error || problemsError.value?.message)

const page = computed(() => Math.floor(filters.value.offset / filters.value.limit) + 1)
const pages = computed(() => Math.max(1, Math.ceil(total.value / filters.value.limit)))

// Handle form submission
const handleSubmit = () => {
  filters.value.offset = 0 // Reset to first page
  router.push({
    query: {
      ...route.query,
      page: 1
    }
  })
}

// Handle pagination
const goToPage = (pageNumber) => {
  filters.value.offset = (pageNumber - 1) * filters.value.limit
  router.push({
    query: {
      ...route.query,
      page: pageNumber
    }
  })
}

// Keep data in sync when query param changes (including back/forward navigation)
watch(
  () => route.query.page,
  (newPage) => {
    const pageNumber = parseInt(newPage || '1', 10)
    const safePage = isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber
    filters.value.offset = (safePage - 1) * filters.value.limit
    refreshProblems()
  }
)

// Get difficulty badge color
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-green-100 text-green-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'hard': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

// SEO
useHead({
  title: 'Problem - BudiBadu Coding Challenge',
  meta: [
    { name: 'description', content: 'Browse and filter coding problems across different platforms, difficulties, and categories.' }
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
  <div class="min-h-screen py-10 bg-gray-50">
    <Container>
      <!-- Title and Filter Chips Section -->
      <section class="mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
            Browse Problems
          </h1>
          
          <!-- Category and Difficulty Chips -->
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Category Chip -->
            <span
              v-if="filters.category"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              <Icon icon="ph:tag" class="w-4 h-4" />
              {{ categories.find(c => c.slug === filters.category)?.name || filters.category }}
              <button
                @click="filters.category = ''; handleSubmit()"
                class="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                aria-label="Remove category filter"
              >
                <Icon icon="ph:x" class="w-3 h-3" />
              </button>
            </span>
            
            <!-- Difficulty Chip -->
            <span
              v-if="filters.difficulty"
              :class="[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize border',
                getDifficultyColor(filters.difficulty)
              ]">
              <Icon icon="ph:gauge" class="w-4 h-4" />
              {{ filters.difficulty }}
              <button
                @click="filters.difficulty = ''; handleSubmit()"
                :class="[
                  'ml-1 rounded-full p-0.5 transition-colors',
                  filters.difficulty === 'easy' ? 'hover:bg-green-200' : 
                  filters.difficulty === 'medium' ? 'hover:bg-yellow-200' : 
                  'hover:bg-red-200'
                ]"
                aria-label="Remove difficulty filter"
              >
                <Icon icon="ph:x" class="w-3 h-3" />
              </button>
            </span>
            
            <!-- Clear All Button -->
            <button
              v-if="filters.category || filters.difficulty"
              @click="filters.category = ''; filters.difficulty = ''; handleSubmit()"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 transition-colors">
              <Icon icon="ph:x-circle" class="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>
        
        <p class="text-sm sm:text-base text-gray-600">
          Filter and explore problems across platforms, difficulties, and categories.
        </p>
      </section>

      <!-- Ads Section -->
      <div class="mb-6 flex justify-center">
        <ClientOnly>
          <Adsense key="mobile-header-ad-2" client="ca-pub-1356911639243870" ad-slot="4242301831" format="auto"
            responsive="true" :style="{ display: 'block', width: '100%', minHeight: '100px' }" />
        </ClientOnly>
      </div>

      <!-- Category Chips Section -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-3">
          <h2 class="text-sm font-semibold text-gray-700">Browse by Category</h2>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>
        <div class="overflow-x-auto hide-scrollbar">
          <div class="flex gap-3 pb-2">
            <button
              @click="filters.category = ''; handleSubmit()"
              :class="[
                'flex items-center flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                filters.category === ''
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
              ]"
            >
              <Icon icon="ph:grid-four" class="w-4 h-4 mr-2 flex-shrink-0" />
              <span>All Categories</span>
            </button>
            <button
              v-for="category in categories"
              :key="category.id"
              @click="filters.category = category.slug; handleSubmit()"
              :class="[
                'flex items-center flex-shrink-0 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 whitespace-nowrap',
                filters.category === category.slug
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
              ]"
            >
              <span>{{ category.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="rounded-2xl border border-gray-200 bg-white p-6 mb-6 shadow-sm">
        <form @submit.prevent="handleSubmit" class="flex flex-col lg:flex-row gap-4 lg:items-end">
          <div class="flex-1">
            <label class="block text-xs sm:text-sm text-gray-600 mb-1">Search</label>
            <div class="relative">
              <Icon icon="uil:search"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input v-model="filters.search" name="search" type="text" placeholder="Search problems..."
                class="w-full pl-9 sm:pl-10 pr-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all" />
            </div>
          </div>
          <div class="w-full lg:w-auto">
            <label class="block text-xs sm:text-sm text-gray-600 mb-1">Difficulty</label>
            <select v-model="filters.difficulty" name="difficulty"
              class="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all">
              <option value="">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div class="w-full lg:w-auto">
            <label class="block text-xs sm:text-sm text-gray-600 mb-1">Category</label>
            <select v-model="filters.category" name="category"
              class="w-full px-3 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.slug">
                {{ category.name }}
              </option>
            </select>
          </div>
          <!-- Removed platform filter since problems are now platform-agnostic -->
          <button type="submit"
            class="px-3 py-2 sm:px-4 text-xs sm:text-sm text-white w-full lg:w-auto bg-yellow-600 hover:bg-yellow-700 rounded-lg transition-colors duration-200">
            Apply
          </button>
        </form>
      </div>

      <!-- Results meta -->
      <div class="mb-3 text-xs sm:text-sm text-gray-700">
        {{ apiError ? apiError : `${total} problems found` }}
      </div>

      <!-- Data Table -->
      <div class="overflow-x-auto rounded-xl border border-gray-200 bg-white custom-scrollbar relative shadow-sm">
        <!-- Overlay loader when fetching -->
        <div v-if="problemsPending"
          class="absolute inset-0 bg-white/70 dark:bg-gray-900/60 z-20 flex items-center justify-center">
          <div class="flex items-center">
            <Icon icon="mdi:loading" class="animate-spin w-4 h-4 mr-2 text-blue-600" />
            <span class="text-gray-600">Loading problems...</span>
          </div>
        </div>

        <!-- Table Content (kept in DOM) with fade transition to avoid flashing -->
        <div class="overflow-x-auto overflow-y-hidden">
          <transition name="fade" mode="out-in">
            <table v-if="problems.length > 0" key="problems-table" class="w-full text-left text-xs sm:text-sm">
              <thead class="bg-slate-50 text-gray-700 border-b border-gray-200">
                <tr>
                  <th class="px-3 py-3 font-semibold w-3/6">Title</th>
                  <th class="px-3 py-3 font-semibold w-1/6">Difficulty</th>
                  <th class="px-3 py-3 font-semibold w-1/6">Category</th>
                  <th class="px-3 py-3 font-semibold w-1/6 text-center">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(p, i) in problems" :key="p.id" 
                  v-motion="{ initial: { opacity: 0, y: 8 }, enter: { opacity: 1, y: 0 } }" :duration="750"
                  :delay="i * 10" class="hover:bg-slate-50 transition-colors duration-200">
                  <td class="px-3 py-3 w-3/6">
                    <div class="font-semibold text-gray-900 text- truncate">
                      {{ p.problem_name || p.title }}
                    </div>
                    <div class="text-gray-500 text-sm line-clamp-2">
                      {{ p.description }}
                    </div>
                  </td>
                  <td class="px-3 py-3 w-1/6">
                    <span :class="getDifficultyColor(p.difficulty)" class="px-2 py-0.5 rounded-full text-xs capitalize">
                      {{ p.difficulty }}
                    </span>
                  </td>
                  <td class="px-3 py-3 text-gray-700 capitalize text-xs sm:text-sm truncate w-1/6">
                    {{ p.category_name || '-' }}
                  </td>
                  <td class="px-3 py-3 w-1/6 text-center">
                    <a :href="`/problem/${p.slug}`"
                      class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                      <Icon icon="ph:play" class="w-3 h-3 mr-1" />
                      Solve
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </transition>

          <transition name="fade" mode="out-in">
            <div v-if="!problemsPending && problems.length === 0" key="problems-empty" class="text-center py-12"
              v-motion="{ initial: { opacity: 0, y: 8 }, enter: { opacity: 1, y: 0 } }" :duration="600">
              <Icon icon="ph:funnel" class="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 class="text-lg font-semibold mb-2 text-gray-900">
                {{ apiError ? 'Failed to load problems.' : 'No problems found.' }}
              </h3>
              <p v-if="!apiError" class="text-gray-500 mb-4">Try adjusting your filters to see more results.</p>
              <button v-if="!apiError" @click="filters.search = ''; filters.difficulty = ''; handleSubmit()"
                class="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Clear filters
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-xs sm:text-sm text-gray-600">
          Showing {{ filters.offset + 1 }}-{{ Math.min(filters.offset + filters.limit, total) }} of {{ total }} problems
        </div>

        <div v-if="pages > 1" class="flex items-center gap-2">
          <!-- Previous Button -->
          <button v-if="page > 1" @click="goToPage(page - 1)"
            class="px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200">
            Previous
          </button>
          <span v-else
            class="px-3 py-2 text-xs sm:text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
            Previous
          </span>

          <!-- Page Numbers -->
          <div class="flex items-center gap-1">
            <template v-for="i in Math.min(5, pages)" :key="i">
              <template v-if="Math.max(1, page - 2) + i - 1 <= pages">
                <span v-if="Math.max(1, page - 2) + i - 1 === page"
                  class="px-3 py-2 text-xs sm:text-sm text-white bg-blue-600 rounded-lg">
                  {{ Math.max(1, page - 2) + i - 1 }}
                </span>
                <button v-else @click="goToPage(Math.max(1, page - 2) + i - 1)"
                  class="px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200">
                  {{ Math.max(1, page - 2) + i - 1 }}
                </button>
              </template>
            </template>
          </div>

          <!-- Next Button -->
          <button v-if="page < pages" @click="goToPage(page + 1)"
            class="px-3 py-2 text-xs sm:text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors duration-200">
            Next
          </button>
          <span v-else
            class="px-3 py-2 text-xs sm:text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed">
            Next
          </span>
        </div>
      </div>
    </Container>
  </div>
</template>

<style scoped>
/* Custom scrollbar styling for table */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #6b7280 #f3f4f6;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #4b5563;
}

/* Hide scrollbar for category chips */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Transition animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>