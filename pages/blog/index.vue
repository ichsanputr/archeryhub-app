<script setup>
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import { useFormattedDatePreset } from '~/composables/useDateHelper'
import blogPosts from '~/data/blog/posts.js'

// Define component name to fix linter error
defineOptions({
  name: 'BlogsPage'
})

// Pagination
const itemsPerPage = 6
const currentPage = ref(1)
const selectedTag = ref(null)

const computeReadingTime = (html) => {
  if (!html) {
    return 0
  }
  const text = html.replace(/<[^>]+>/g, ' ')
  const words = text
    .replace(/&nbsp;/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
  const wordsPerMinute = 200
  return Math.max(1, Math.round(words.length / wordsPerMinute))
}

const blogsPending = ref(false)

const normalizedBlogs = computed(() => {
  return [...blogPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(post => {
      const minutes = computeReadingTime(post.content || '') || 5
      return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        description: post.description,
        category: post.category,
        tags: Array.isArray(post.tags) ? post.tags : [],
        publishedDate: post.createdAt,
        readTime: `${minutes} min read`,
        author: 'catsentence.com'
      }
    })
})

// Get all unique tags
const allTags = computed(() => {
  const tagSet = new Set()
  normalizedBlogs.value.forEach(blog => {
    blog.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort()
})

// Featured post (latest post)
const featuredPost = computed(() => normalizedBlogs.value[0])

// Filter blogs by tag
const filteredBlogs = computed(() => {
  if (!selectedTag.value) {
    return normalizedBlogs.value.slice(1) // Exclude featured post
  }
  return normalizedBlogs.value.filter(blog =>
    blog.tags.includes(selectedTag.value)
  )
})

// Computed pagination
const totalPages = computed(() => {
  const total = filteredBlogs.value.length
  return total > 0 ? Math.ceil(total / itemsPerPage) : 0
})

const paginatedBlogs = computed(() => {
  const blogs = filteredBlogs.value
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return blogs.slice(start, end)
})

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    // Scroll to top of blogs
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

// Filter by tag
const filterByTag = (tag) => {
  if (selectedTag.value === tag) {
    selectedTag.value = null // Toggle off if clicking the same tag
  } else {
    selectedTag.value = tag
  }
  currentPage.value = 1 // Reset to first page
}

// Navigate to blog
const openBlog = (slug) => {
  navigateTo(`/blog/${slug}`)
}

// Image handling
const handleImageError = (event) => {
  const img = event.target
  const slug = img.src.split('/').pop().replace('.png', '')
  img.style.display = 'none'

  // Show the fallback placeholder
  const fallback = document.querySelector(`.fallback-${slug}`)
  if (fallback) {
    fallback.classList.remove('hidden')
    fallback.classList.add('flex')
  }
}

const handleImageLoad = (event) => {
  event.target.style.opacity = '1'
}



// SEO
const route = useRoute()
useHead({
  title: 'Blogs - BudiBadu Coding Challenge',
  meta: [
    { name: 'description', content: 'Learn programming with our comprehensive blogs. From basics to advanced concepts across multiple languages.' }
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
    <!-- Header Section with Cloud Background -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div
        class="relative overlay-hidden rounded-2xl border border-yellow-100 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
        <!-- Cloud Background -->
        <div class="absolute inset-0 overflow-hidden rounded-2xl">
          <div class="cloud cloud-1 absolute top-8 left-0 w-48 h-24 bg-white/10 rounded-full blur-2xl animate-cloud-1">
          </div>
          <div
            class="cloud cloud-2 absolute top-20 right-0 w-64 h-32 bg-white/10 rounded-full blur-3xl animate-cloud-2">
          </div>
          <div
            class="cloud cloud-3 absolute bottom-10 left-1/4 w-40 h-20 bg-white/10 rounded-full blur-2xl animate-cloud-3">
          </div>
        </div>

        <div class="relative z-10 p-6 sm:p-8 text-center max-w-3xl mx-auto text-white">
          <div
            class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 backdrop-blur-md px-3 py-1 text-sm shadow-sm mb-4">
            <Icon :ssr="true" icon="ph:article" class="h-4 w-4" />
            <span>Learn & Explore</span>
          </div>
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight drop-shadow-lg">Programming Blogs
          </h1>
          <p class="mt-2 text-sm sm:text-base md:text-lg drop-shadow">Learn programming with comprehensive blogs</p>
        </div>
      </div>
    </div>

    <!-- Tags Filter -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div class="flex items-center gap-2 mb-2">
          <Icon :ssr="true" icon="ph:funnel" class="w-5 h-5 text-gray-600" />
          <span class="text-sm font-semibold text-gray-900">Filter by Tag:</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-for="tag in allTags" :key="tag" @click="filterByTag(tag)"
            class="px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2" :class="selectedTag === tag
              ? 'bg-yellow-500 text-white border-yellow-500 shadow-md'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50'">
            #{{ tag }}
          </button>
        </div>
        <button v-if="selectedTag" @click="selectedTag = null; currentPage = 1"
          class="mt-3 text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1">
          <Icon :ssr="true" icon="ph:x-circle" class="w-4 h-4" />
          Clear filter
        </button>
      </div>
    </div>

    <!-- Featured Post -->
    <div v-if="featuredPost && !selectedTag" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div class="mb-4 flex items-center gap-2">
        <Icon :ssr="true" icon="ph:star-fill" class="w-5 h-5 text-yellow-500" />
        <h2 class="text-xl font-bold text-gray-900">Featured Post</h2>
      </div>
      <div @click="openBlog(featuredPost.slug)"
        class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl shadow-md border-2 border-yellow-200 overflow-hidden cursor-pointer group hover:shadow-xl transition-all">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Image -->
          <div class="relative overflow-hidden md:h-full min-h-[250px]">
            <img :src="`/generated-thumbnails/${featuredPost.slug}.png`" :alt="`${featuredPost.title} - Blog thumbnail`"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="eager"
              @error="handleImageError" @load="handleImageLoad" />
            <div
              :class="`fallback-${featuredPost.slug} absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center text-gray-500 text-sm hidden`">
              <div class="text-center">
                <Icon :ssr="true" icon="ph:image" class="w-8 h-8 mx-auto mb-2" />
                <span>Thumbnail not available</span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="p-6 md:p-8 flex flex-col justify-center">
            <div class="mb-3">
              <span class="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold shadow-sm">
                {{ featuredPost.category }}
              </span>
            </div>
            <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors">
              {{ featuredPost.title }}
            </h3>
            <p class="text-gray-700 mb-4 line-clamp-3">
              {{ featuredPost.description }}
            </p>

            <!-- Meta Info -->
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div class="flex items-center">
                <Icon :ssr="true" icon="ph:clock" class="w-4 h-4 mr-1" />
                {{ featuredPost.readTime }}
              </div>
              <div class="flex items-center">
                <Icon :ssr="true" icon="ph:calendar" class="w-4 h-4 mr-1" />
                {{ useFormattedDatePreset(featuredPost.publishedDate, 'medium') }}
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in featuredPost.tags.slice(0, 4)" :key="tag"
                class="px-2 py-1 bg-white/60 backdrop-blur-sm text-gray-700 rounded-full text-xs">
                #{{ tag }}
              </span>
            </div>

            <div class="flex items-center text-yellow-600 font-semibold group-hover:gap-2 transition-all">
              Read Article
              <Icon :ssr="true" icon="ph:arrow-right"
                class="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="selectedTag" class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Posts tagged with <span class="text-yellow-600">#{{ selectedTag }}</span>
        </h2>
        <p class="text-gray-600 mt-1">{{ filteredBlogs.length }} article{{ filteredBlogs.length !== 1 ? 's' : '' }}
          found</p>
      </div>
      <div v-else class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">All Posts</h2>
      </div>

      <!-- Loading State -->
      <div v-if="blogsPending" class="flex justify-center items-center py-12 sm:py-16">
        <v-progress-circular indeterminate color="primary" />
        <span class="ml-3 text-sm sm:text-base text-gray-600">Loading blogs...</span>
      </div>

      <!-- Blogs Grid -->
      <div v-else-if="paginatedBlogs.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div v-for="blog in paginatedBlogs" :key="blog.id"
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-yellow-200 cursor-pointer group flex flex-col"
          @click="openBlog(blog.slug)">
          <!-- Thumbnail Image -->
          <div class="relative overflow-hidden bg-gray-100">
            <img :src="`/generated-thumbnails/${blog.slug}.png`" :alt="`${blog.title} - Blog thumbnail`"
              class="w-full h-48 object-cover transition-opacity duration-300" loading="lazy" @error="handleImageError"
              @load="handleImageLoad" />
            <!-- Fallback placeholder (hidden by default) -->
            <div
              :class="`fallback-${blog.slug} absolute inset-0 w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center text-gray-500 text-sm hidden`">
              <div class="text-center">
                <Icon :ssr="true" icon="ph:image" class="w-8 h-8 mx-auto mb-2" />
                <span>Thumbnail not available</span>
              </div>
            </div>
            <div class="absolute top-3 right-3">
              <span class="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                {{ blog.category }}
              </span>
            </div>
          </div>

          <!-- Header content without background -->
          <div class="p-4 sm:p-6 flex-shrink-0 flex flex-col">
            <!-- Title with exactly 2 lines -->
            <h3
              class="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors line-clamp-2 leading-snug flex-grow">
              {{ blog.title }}
            </h3>

            <!-- Description with fixed height -->
            <p class="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {{ blog.description }}
            </p>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-6 flex-grow flex flex-col">
            <!-- Meta Info -->
            <div class="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3">
              <div class="flex items-center">
                <Icon :ssr="true" icon="ph:clock" class="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {{ blog.readTime }}
              </div>
              <div class="flex items-center">
                <Icon :ssr="true" icon="ph:calendar" class="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                {{ useFormattedDatePreset(blog.publishedDate, 'medium') }}
              </div>
            </div>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1 mb-4 mt-6">
              <span v-for="tag in blog.tags.slice(0, 3)" :key="tag"
                class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                #{{ tag }}
              </span>
            </div>

            <!-- Button at bottom -->
            <button
              class="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm flex items-center justify-center mt-auto">
              <Icon :ssr="true" icon="ph:article" class="w-4 h-4 mr-2" />
              Read Blog
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 sm:py-16">
        <Icon :ssr="true" icon="ph:article" class="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
        <h3 class="text-lg sm:text-xl font-semibold mb-2 text-gray-900">
          No blogs found{{ selectedTag ? ` for #${selectedTag}` : '' }}
        </h3>
        <p class="text-sm sm:text-base text-gray-500 mb-4">
          {{ selectedTag ? 'Try selecting a different tag or clear the filter.' : 'Check back soon for new blogs.' }}
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="!blogsPending && paginatedBlogs.length > 0 && totalPages > 1"
        class="mt-12 sm:mt-16 flex flex-col items-center space-y-4">
        <div class="flex items-center space-x-2">
          <!-- Previous Button -->
          <button @click="prevPage" :disabled="currentPage === 1"
            class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Icon :ssr="true" icon="ph:caret-left" class="w-4 h-4 mr-1" />
            Previous
          </button>

          <!-- Page Numbers -->
          <div class="flex items-center space-x-1">
            <template v-for="page in totalPages" :key="page">
              <button v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
                @click="goToPage(page)" :class="[
                  'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  page === currentPage
                    ? 'bg-yellow-500 text-white'
                    : 'text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'
                ]">
                {{ page }}
              </button>
              <span v-else-if="page === currentPage - 2 || page === currentPage + 2" class="px-2 text-gray-400">
                ...
              </span>
            </template>
          </div>

          <!-- Next Button -->
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            Next
            <Icon :ssr="true" icon="ph:caret-right" class="w-4 h-4 ml-1" />
          </button>
        </div>

        <!-- Page Info -->
        <div class="text-center text-sm text-gray-500">
          Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage,
            filteredBlogs.length) }}
          of {{ filteredBlogs.length }} blogs
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Cloud animations */
@keyframes cloud-1 {

  0%,
  100% {
    transform: translateX(0) translateY(0);
  }

  50% {
    transform: translateX(80px) translateY(-15px);
  }
}

@keyframes cloud-2 {

  0%,
  100% {
    transform: translateX(0) translateY(0);
  }

  50% {
    transform: translateX(-60px) translateY(20px);
  }
}

@keyframes cloud-3 {

  0%,
  100% {
    transform: translateX(0) translateY(0);
  }

  50% {
    transform: translateX(40px) translateY(15px);
  }
}

.animate-cloud-1 {
  animation: cloud-1 18s ease-in-out infinite;
}

.animate-cloud-2 {
  animation: cloud-2 22s ease-in-out infinite;
}

.animate-cloud-3 {
  animation: cloud-3 25s ease-in-out infinite;
}
</style>
