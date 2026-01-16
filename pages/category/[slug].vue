<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useAsyncData, useRuntimeConfig, useHead, showError } from '#app'
import { Icon } from '@iconify/vue'
import Container from '~/components/Container.vue'
import ProblemCard from '~/components/ProblemCard.vue'
import Adsense from '~/components/Adsense.vue'

defineOptions({
    name: 'CategoryDetailPage'
})

const route = useRoute()
const categorySlug = route.params.slug

// State for pagination, search, and filters
const filters = ref({
    search: '',
    difficulty: '',
    sort: 'latest',
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
        refreshData()
    }, 300)
})

// Watch other filters
watch([() => filters.value.difficulty, () => filters.value.sort], () => {
    filters.value.offset = 0
    refreshData()
})

// Fetch category and problems data
const { data: categoryData, pending: categoryPending, error: categoryError, refresh: refreshData } = await useAsyncData(`category-${categorySlug}`, async () => {
    const payload = {
        search: debouncedSearch.value,
        difficulty: filters.value.difficulty,
        sort: filters.value.sort,
        limit: filters.value.limit,
        offset: filters.value.offset,
    }

    const response = await $fetch(`/public/problem/category/${categorySlug}`, {
        baseURL: apiBaseUrl,
        method: 'POST',
        body: payload
    })

    return {
        category: response.category || null,
        problems: response.problems || [],
        total: response.total || 0
    }
})

if (categoryError.value) {
    throw showError({
        statusCode: 404,
        statusMessage: 'Category Not Found',
        error: 'The category you are looking for does not exist.'
    })
}

const category = computed(() => categoryData.value?.category)
const problems = computed(() => categoryData.value?.problems || [])
const total = computed(() => categoryData.value?.total || 0)
const apiError = computed(() => categoryData.value?.error || categoryError.value?.message)
const is404 = computed(() => categoryData.value?.is404 || false)

const page = computed(() => Math.floor(filters.value.offset / filters.value.limit) + 1)
const pages = computed(() => Math.max(1, Math.ceil(total.value / filters.value.limit)))

// Handle pagination
const goToPage = (pageNumber) => {
    filters.value.offset = (pageNumber - 1) * filters.value.limit
    refreshData().catch((error) => {
        console.error('Error refreshing data:', error)
    })
}

// Clear search
const clearSearch = () => {
    filters.value.search = ''
    debouncedSearch.value = ''
    filters.value.offset = 0
    refreshData().catch((error) => {
        console.error('Error refreshing data:', error)
    })
}

// Function to remove dot from description
const removeDotFromDescription = (description) => {
    return description.replace(/\./g, '')
}

// Clear all filters
const clearAllFilters = () => {
    filters.value.search = ''
    filters.value.difficulty = ''
    filters.value.sort = 'latest'
    debouncedSearch.value = ''
    filters.value.offset = 0
    refreshData().catch((error) => {
        console.error('Error refreshing data:', error)
    })
}

// Difficulty options
const difficultyOptions = [
    { value: '', label: 'All Difficulties' },
    { value: 'Easy', label: 'Easy' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Hard', label: 'Hard' }
]

// Sort options
const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'most_solved', label: 'Most Solved' },
    { value: 'less_solved', label: 'Less Solved' }
]

// SEO
useHead(() => {
    if (is404.value) {
        return {
            title: 'Category Not Found - BudiBadu Coding Challenge',
            meta: [
                { name: 'description', content: `The category "${categorySlug}" was not found on BudiBadu Coding Challenge.` },
            ]
        }
    }

    const title = category.value ? `Solve ${category.value.name} Programming Problems by BudiBadu Coding Challenge` : 'Category - BudiBadu Coding Challenge'
    const description = category.value
        ? `Explore ${category.value.name} programming problems. ${category.value.description || ''} Practice coding challenges and improve your skills with BudiBadu Coding Challenge.`
        : 'Browse programming problems by category with BudiBadu Coding Challenge.'

    return {
        title,
        meta: [
            { name: 'description', content: description },
            { name: 'keywords', content: `${category.value?.name || 'programming'} problems, coding challenges, algorithms, programming practice` }
        ],
        link: [
            {
                rel: 'canonical',
                href: `https://budibadu.com${route.path}`
            }
        ]
    }
})
</script>

<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Hero Section -->
        <section class="pt-8 pb-2 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
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
                    <!-- Breadcrumb -->
                    <nav class="flex items-center justify-center text-sm text-gray-600 mb-6">
                        <a href="/" class="hover:text-yellow-600 transition-colors">Home</a>
                        <Icon :ssr="true" icon="ph:caret-right" class="w-4 h-4 mx-2" />
                        <a href="/category" class="hover:text-yellow-600 transition-colors">Categories</a>
                        <Icon :ssr="true" icon="ph:caret-right" class="w-4 h-4 mx-2" />
                        <span class="text-gray-900 font-medium">{{ category?.name || categorySlug || 'Loading...'
                            }}</span>
                    </nav>

                    <!-- Category Header -->
                    <div class="mb-8">
                        <h1 class="text-2xl sm:text-3xl sm:text-4xl font-extrabold leading-tight text-gray-900 mb-4">
                            {{ category.name }} Coding Challenges
                        </h1>

                        <p v-if="category.description"
                            class="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            {{ removeDotFromDescription(category.description) }} by solving {{ category.name }} coding
                            challenges.
                        </p>
                    </div>

                    <!-- Search and Filters -->
                    <div v-if="!is404" class="max-w-4xl mx-auto">
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <!-- Search Bar -->
                            <div class="md:col-span-2 relative">
                                <Icon :ssr="true" icon="ph:magnifying-glass"
                                    class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input v-model="filters.search" type="text" placeholder="Search problems..."
                                    class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white shadow-sm" />
                                <button v-if="filters.search" @click="clearSearch"
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Icon :ssr="true" icon="ph:x" class="w-4 h-4" />
                                </button>
                            </div>

                            <!-- Difficulty Filter -->
                            <div>
                                <select v-model="filters.difficulty"
                                    class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white shadow-sm">
                                    <option v-for="option in difficultyOptions" :key="option.value"
                                        :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>

                            <!-- Sort Filter -->
                            <div>
                                <select v-model="filters.sort"
                                    class="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white shadow-sm">
                                    <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </div>
                        </div>

                        <!-- Active Filters -->
                        <div v-if="filters.search || filters.difficulty" class="flex flex-wrap items-center gap-2 mt-4">
                            <span class="text-sm text-gray-600">Active filters:</span>

                            <div v-if="filters.search"
                                class="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                <Icon :ssr="true" icon="ph:magnifying-glass" class="w-3 h-3" />
                                <span>"{{ filters.search }}"</span>
                                <button @click="clearSearch" class="ml-1 hover:text-yellow-900">
                                    <Icon :ssr="true" icon="ph:x" class="w-3 h-3" />
                                </button>
                            </div>

                            <div v-if="filters.difficulty"
                                class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                <Icon :ssr="true" icon="ph:funnel" class="w-3 h-3" />
                                <span>{{ filters.difficulty }}</span>
                                <button @click="filters.difficulty = ''; refreshData()"
                                    class="ml-1 hover:text-blue-900">
                                    <Icon :ssr="true" icon="ph:x" class="w-3 h-3" />
                                </button>
                            </div>

                            <button @click="clearAllFilters"
                                class="text-sm text-gray-500 hover:text-gray-700 underline">
                                Clear all
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        </section>

        <!-- Problems Section -->
        <section v-if="!is404" class="py-12 sm:py-16">
            <Container>
                <!-- Ads Section -->
                <div class="py-8 flex justify-center bg-gray-50 mb-6">
                    <Adsense key="mobile-header-ad-2" client="ca-pub-1356911639243870" ad-slot="4242301831"
                        format="auto" responsive="true"
                        :style="{ display: 'block', width: '100%', minHeight: '100px' }" />
                </div>
                <!-- Results Header -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
                    <div>
                        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                            Problems
                            <span v-if="!categoryPending" class="text-sm font-normal text-gray-500 ml-2">
                                ({{ total }} total)
                            </span>
                        </h2>
                        <p v-if="filters.search || filters.difficulty" class="text-sm text-gray-600">
                            Filtered results
                        </p>
                    </div>

                    <!-- Results per page selector -->
                    <div class="flex items-center gap-2 mt-4 sm:mt-0">
                        <span class="text-sm text-gray-600">Show:</span>
                        <select v-model="filters.limit" @change="filters.offset = 0; refreshData()"
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500">
                            <option :value="12">12</option>
                            <option :value="24">24</option>
                            <option :value="48">48</option>
                        </select>
                    </div>
                </div>

                <!-- Loading State -->
                <div v-if="categoryPending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="i in filters.limit" :key="i"
                        class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full animate-pulse">
                        <div class="space-y-4">
                            <div class="h-6 bg-gray-200 rounded w-3/4"></div>
                            <div class="h-4 bg-gray-200 rounded"></div>
                            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div class="flex justify-between items-center pt-4">
                                <div class="h-4 bg-gray-200 rounded w-20"></div>
                                <div class="h-4 bg-gray-200 rounded w-4"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Problems Grid -->
                <div v-else-if="problems.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(problem, i) in problems" :key="problem.id"
                        v-motion="{ initial: { opacity: 0, y: 20 }, enter: { opacity: 1, y: 0 } }" :duration="400"
                        :delay="i * 50">
                        <ProblemCard :problem="problem" :show-save-button="true" />
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else class="text-center py-16">
                    <div class="max-w-md mx-auto">
                        <Icon :ssr="true" icon="ph:code-simple" class="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 class="text-xl font-semibold mb-2 text-gray-900">
                            {{ apiError ? 'Failed to load problems' : 'No problems found' }}
                        </h3>
                        <p class="text-gray-500 mb-6">
                            {{ filters.search || filters.difficulty
                                ? `Try adjusting your filters or search term.`
                                : `Problems for this category will be available soon.`
                            }}
                        </p>
                        <div class="flex flex-col sm:flex-row gap-3 justify-center">
                            <button v-if="filters.search || filters.difficulty" @click="clearAllFilters"
                                class="btn-primary inline-flex items-center gap-2 px-4 py-2">
                                <Icon :ssr="true" icon="ph:arrow-counter-clockwise" class="w-4 h-4" />
                                Clear Filters
                            </button>
                            <a href="/category" class="btn-secondary inline-flex items-center gap-2 px-4 py-2">
                                <Icon :ssr="true" icon="ph:arrow-left" class="w-4 h-4" />
                                Browse Categories
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Pagination -->
                <div v-if="pages > 1 && !categoryPending"
                    class="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <!-- Page Info -->
                    <div class="text-sm text-gray-600">
                        Showing {{ Math.min(filters.offset + 1, total) }} - {{ Math.min(filters.offset + filters.limit,
                            total) }} of {{ total }} problems
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
/* Custom styling if needed */
</style>