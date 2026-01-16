<script setup>
import { Icon } from '@iconify/vue'
import ShareDialog from '~/components/ShareDialog.vue'
import CodeHiglighter from '~/components/CodeHiglighter.vue'
import Adsense from '~/components/Adsense.vue'
import { useFormattedDatePreset } from '~/composables/useDateHelper'
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useHead, useRuntimeConfig, createError } from '#app'
import { useRoute } from 'vue-router'
import blogPosts from '~/data/blog/posts.js'

// Define component name
defineOptions({
  name: 'BlogPage'
})

// SSR-safe helpers
const slugify = (text) => {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

const parseContentBlocks = (html) => {
  if (!html || typeof html !== 'string') {
    return { blocks: [], toc: [] }
  }

  const blocks = []
  const toc = []
  let indexCounter = 0

  // Split content by <pre><code> blocks while preserving them
  const parts = html.split(/(<pre><code[\s\S]*?<\/code><\/pre>)/gi)

  parts.forEach((part) => {
    if (!part.trim()) return

    // Check if this part is a code block
    const isCodeBlock = /^<pre><code[\s\S]*?<\/code><\/pre>$/i.test(part)

    if (isCodeBlock) {
      // Extract code content
      const codeMatch = part.match(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/i)
      const attrString = codeMatch ? codeMatch[1] || '' : ''
      const code = codeMatch ? codeMatch[2].trim() : ''
      const languageMatch = attrString.match(/class=["'](?:language-)?([\w-]+)["']/i)
      const dataLanguageMatch = attrString.match(/data-language=["']([\w-]+)["']/i)
      const language = (languageMatch && languageMatch[1]) || (dataLanguageMatch && dataLanguageMatch[1]) || ''

      blocks.push({
        type: 'code',
        content: code,
        id: `code-block-${blocks.filter(b => b.type === 'code').length + 1}`,
        language: language.toLowerCase()
      })
    } else {
      // Process regular HTML content and add TOC IDs
      let processedHtml = part
        // h2
        .replace(/<h2(.*?)>([\s\S]*?)<\/h2>/gi, (match, attrs, inner) => {
          const text = inner.replace(/<[^>]*>/g, '').trim()
          const idBase = slugify(text) || `section-${indexCounter++}`
          const id = idBase
          toc.push({ id, text, depth: 2, href: `#${id}` })
          // inject id if not present
          const hasId = /\sid=".*?"/i.test(attrs)
          const newAttrs = hasId ? attrs : `${attrs} id="${id}"`
          return `<h2${newAttrs}>${inner}</h2>`
        })
        // h3
        .replace(/<h3(.*?)>([\s\S]*?)<\/h3>/gi, (match, attrs, inner) => {
          const text = inner.replace(/<[^>]*>/g, '').trim()
          const idBase = slugify(text) || `section-${indexCounter++}`
          const id = idBase
          toc.push({ id, text, depth: 3, href: `#${id}` })
          const hasId = /\sid=".*?"/i.test(attrs)
          const newAttrs = hasId ? attrs : `${attrs} id="${id}"`
          return `<h3${newAttrs}>${inner}</h3>`
        })

      blocks.push({
        type: 'html',
        content: processedHtml,
        id: `content-block-${blocks.filter(b => b.type === 'html').length + 1}`
      })
    }
  })

  return { blocks, toc }
}

// Helper function to split content blocks into 3 equal parts (1/3 each) for ads insertion
const splitContentIntoParts = (blocks) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return [[], [], []]
  }

  // Calculate total content length
  const totalLength = blocks.reduce((sum, block) => sum + block.content.length, 0)
  const targetLengthPerPart = totalLength / 3

  let currentLength = 0
  let part1 = []
  let part2 = []
  let part3 = []

  // First pass: assign blocks to parts based on cumulative length
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i]
    const blockLength = block.content.length

    if (currentLength + blockLength <= targetLengthPerPart) {
      // Block fits in current part
      part1.push(block)
      currentLength += blockLength
    } else if (part1.length === 0) {
      // Edge case: single large block
      part1.push(block)
      currentLength += blockLength
    } else {
      // Block doesn't fit, move to next part
      break
    }
  }

  // Reset for second part
  currentLength = 0
  let startIndex = part1.length

  for (let i = startIndex; i < blocks.length; i++) {
    const block = blocks[i]
    const blockLength = block.content.length

    if (currentLength + blockLength <= targetLengthPerPart) {
      part2.push(block)
      currentLength += blockLength
    } else if (part2.length === 0) {
      // Edge case: single large block
      part2.push(block)
      currentLength += blockLength
    } else {
      // Block doesn't fit, move to next part
      break
    }
  }

  // Third part gets everything else
  startIndex = part1.length + part2.length
  part3 = blocks.slice(startIndex)

  return [part1, part2, part3]
}

// Get the slug from route params
const route = useRoute()

// Fetch blog content from static data and build TOC
const slug = route.params.slug

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

const staticBlog = blogPosts.find(post => post.slug === slug)

if (!staticBlog) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Blog not found'
  })
}

const { blocks, toc } = parseContentBlocks(staticBlog.content || '')

const readingMinutes = computeReadingTime(staticBlog.content || '')

const blog = ref({
  ...staticBlog,
  meta: {
    author: 'catsentence.com',
    publishedDate: staticBlog.createdAt,
    category: staticBlog.category,
    tags: staticBlog.tags,
    readTime: `${readingMinutes} min read`
  },
  contentBlocks: blocks,
  toc
})

// Build related blogs from local dataset
const buildRelatedBlogs = (currentPost) => {
  if (!currentPost) return []

  const currentTags = new Set(Array.isArray(currentPost.tags) ? currentPost.tags : [])

  let relatedPosts = blogPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => {
      const sameCategory = post.category === currentPost.category
      const sharedTagsCount = Array.isArray(post.tags)
        ? post.tags.filter(tag => currentTags.has(tag)).length
        : 0
      const score = (sameCategory ? 2 : 0) + sharedTagsCount
      return { post, score }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.post.createdAt) - new Date(a.post.createdAt))
    .slice(0, 6)
    .map(({ post }) => post)

  // Fallback to latest articles if no related articles found
  if (relatedPosts.length === 0) {
    relatedPosts = blogPosts
      .filter(post => post.slug !== currentPost.slug)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
  }

  return relatedPosts.map(post => {
    const minutes = computeReadingTime(post.content || '') || 5
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags : [],
      reading_time: minutes,
      created_at: post.createdAt
    }
  })
}

const relatedBlogsData = computed(() => buildRelatedBlogs(blog.value))

const formattedPublishedDate = computed(() => {
  return blog.value.meta?.publishedDate
    ? useFormattedDatePreset(blog.value.meta.publishedDate, 'long')
    : 'Date not available'
})

// Handle 404 if blog not found

// Reading progress tracking
const readingProgress = ref(0)
const isReading = ref(false)
const showShareDialog = ref(false)
const isHelpful = ref(false)
const mobileTocExpanded = ref(true) // Default to expanded on mobile

const helpfulStorageKey = computed(() => `blog-helpful:${slug}`)

const toggleHelpful = () => {
  if (typeof window === 'undefined') return
  isHelpful.value = !isHelpful.value
  try {
    localStorage.setItem(helpfulStorageKey.value, JSON.stringify(isHelpful.value))
  } catch (e) { console.warn('Failed to persist helpful state', e) }
}

// Toggle mobile TOC expanded/collapsed
const toggleMobileToc = () => {
  mobileTocExpanded.value = !mobileTocExpanded.value
}

// Handle scroll for reading progress
const handleScroll = () => {
  const scrollTop = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = (scrollTop / docHeight) * 100
  readingProgress.value = Math.min(100, Math.max(0, progress))

  // Consider reading if scrolled more than 10%
  if (progress > 10) {
    isReading.value = true
  }

  // Update active section
  updateActiveSection()
}

// Table of contents from processed HTML (SSR)
const tocItems = computed(() => Array.isArray(blog.value?.toc) ? blog.value.toc : [])

// Split content into 3 parts for ads insertion
const contentParts = computed(() => {
  const blocks = blog.value?.contentBlocks || []
  return splitContentIntoParts(blocks)
})

// Scroll to section
const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// Track active section
const activeSection = ref('')
const updateActiveSection = () => {
  const headings = document.querySelectorAll('h2[id], h3[id]')
  let current = ''

  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect()
    if (rect.top <= 100) {
      current = heading.id
    }
  })

  activeSection.value = current
}

// Share functionality
const openShareDialog = () => {
  showShareDialog.value = true
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // Update active section on mount
  nextTick(() => {
    updateActiveSection()
  })
  // Load helpful state from localStorage
  try {
    const saved = localStorage.getItem(helpfulStorageKey.value)
    if (saved !== null) {
      isHelpful.value = JSON.parse(saved)
    }
  } catch (e) { console.warn('Failed to read helpful state', e) }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// SEO
const siteUrl = useRuntimeConfig().public.siteUrl || ''
const thumbnailUrl = `${siteUrl}/generated-thumbnails/${slug}.png`

useHead({
  title: `${blog.value.title} - BudiBadu`,
  meta: [
    { name: 'description', content: blog.value.description },
    { name: 'author', content: blog.value.meta?.author },
    { property: 'article:published_time', content: blog.value.meta?.publishedDate },
    { property: 'article:author', content: blog.value.meta?.author },
    { property: 'article:section', content: blog.value.meta?.category },
    { property: 'article:tag', content: (blog.value.meta?.tags || []).join(', ') },
    { property: 'og:title', content: blog.value.title },
    { property: 'og:description', content: blog.value.description },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `${siteUrl}/blog/${slug}` },
    { property: 'og:image', content: thumbnailUrl },
    { property: 'og:image:width', content: '1280' },
    { property: 'og:image:height', content: '720' },
    { property: 'og:image:alt', content: `${blog.value.title} - Blog thumbnail` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: blog.value.title },
    { name: 'twitter:description', content: blog.value.description },
    { name: 'twitter:image', content: thumbnailUrl },
    { name: 'twitter:image:alt', content: `${blog.value.title} - Blog thumbnail` }
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://budibadu.com${route.path}`
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': `${siteUrl}/`
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Blog',
            'item': `${siteUrl}/blog`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': blog.value.title,
            'item': `${siteUrl}/blog/${slug}`
          }
        ]
      })
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Reading Progress Bar -->
    <div class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div class="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-150"
        :style="{ width: `${readingProgress}%` }"></div>
    </div>

    <!-- Blog Header -->
    <header class="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-white">
      <div class="w-full lg:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <!-- Breadcrumb -->
        <nav class="mb-6">
          <ol class="flex items-center space-x-2 text-sm text-yellow-200">
            <li>
              <a href="/" class="hover:text-white transition-colors">Home</a>
            </li>
            <li>/</li>
            <li>
              <a href="/blog" class="hover:text-white transition-colors">Blog</a>
            </li>
            <li>/</li>
            <li class="text-white font-medium max-w-[40vw] sm:max-w-[30vw] md:max-w-[25vw] lg:max-w-none">
              <span class="line-clamp-1 lg:line-clamp-2">
                {{ blog.title }}
              </span>
            </li>
          </ol>
        </nav>

        <!-- Blog Meta -->
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            {{ blog.title }}
          </h1>

          <p class="text-lg sm:text-xl text-yellow-100 mb-6 leading-relaxed">
            {{ blog.description }}
          </p>

          <!-- Meta Info (date and read time) -->
          <div class="flex flex-col sm:flex-row sm:items-center gap-4">
            <div class="flex items-center space-x-4 text-sm text-yellow-200">
              <div class="flex items-center">
                <Icon :ssr="true" icon="ph:calendar" class="w-4 h-4 mr-1" />
                {{ formattedPublishedDate }}
              </div>
              <div class="flex items-center">
                <Icon :ssr="true" icon="ph:clock" class="w-4 h-4 mr-1" />
                {{ blog.meta?.readTime || '5 min read' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div v-if="blog.meta?.tags && blog.meta.tags.length > 0" class="flex flex-wrap gap-2">
          <span v-for="tag in blog.meta.tags" :key="tag"
            class="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-sm">
            #{{ tag }}
          </span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="w-full lg:max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="lg:grid lg:grid-cols-12 lg:gap-8">
        <!-- Table of Contents (Mobile) -->
        <div class="lg:hidden mb-6">
          <div v-if="tocItems.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <button @click="toggleMobileToc"
              class="w-full flex items-center justify-between font-semibold text-gray-900 mb-3 hover:text-gray-700 transition-colors">
              <div class="flex items-center">
                <Icon :ssr="true" icon="ph:list" class="w-4 h-4 mr-2" />
                Table of Contents
              </div>
              <Icon :ssr="true" :icon="mobileTocExpanded ? 'ph:caret-up' : 'ph:caret-down'"
                class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': !mobileTocExpanded }" />
            </button>
            <div class="overflow-hidden transition-all duration-300 ease-in-out"
              :class="{ 'max-h-0 opacity-0': !mobileTocExpanded, 'max-h-96 opacity-100': mobileTocExpanded }">
              <nav class="space-y-2">
                <a v-for="item in tocItems" :key="item.id" :href="item.href" @click.prevent="scrollToSection(item.id)"
                  class="block w-full text-left text-sm transition-colors" :class="{
                    'ml-4': item.depth === 3,
                    'font-medium text-yellow-600': item.id === activeSection,
                    'text-gray-600 hover:text-yellow-600': item.id !== activeSection
                  }">
                  {{ item.text }}
                </a>
              </nav>
            </div>
          </div>
        </div>

        <!-- Left Sidebar - Ads (Desktop only) -->
        <div class="hidden lg:block lg:col-span-2">
          <div class="sticky top-20">
            <ClientOnly>
              <Adsense key="blog-sidebar-ad" client="ca-pub-1356911639243870" ad-slot="4242301831" format="auto"
                responsive="true" :style="{ display: 'block', width: '100%', minHeight: '600px' }" />
            </ClientOnly>
          </div>
        </div>

        <!-- Blog Content (Middle) -->
        <div class="lg:col-span-8">
          <article class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden -mx-4 sm:-mx-6 lg:mx-0">
            <div class="prose prose-lg max-w-none p-4 sm:p-6" style="text-align: !left;">
              <div class="mb-6">
                <img :src="thumbnailUrl" :alt="`${blog.title} - Budibadu`" class="w-full rounded-lg shadow-lg" />
              </div>
              <!-- Render content part 1 -->
              <template v-for="block in contentParts[0]" :key="block.id">
                <!-- Regular HTML content -->
                <div v-if="block.type === 'html'" v-html="block.content"></div>

                <!-- Code blocks with syntax highlighting -->
                <div v-else-if="block.type === 'code'" class="my-6">
                  <div class="bg-gray-900 rounded-lg overflow-hidden">
                    <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <span class="text-sm text-gray-300 font-medium">{{ block.language }}</span>
                      <Icon :ssr="true" icon="ph:code" class="w-4 h-4 text-gray-400" />
                    </div>
                    <CodeHiglighter :code="block.content" :language="block.language || 'javascript'" />
                  </div>
                </div>
              </template>

              <!-- First In-Article Ad -->
              <div class="my-8 flex justify-center">
                <ClientOnly>
                  <Adsense key="blog-in-article-ad-1" client="ca-pub-1356911639243870" ad-slot="9381101962"
                    format="auto" responsive="true" :style="{ display: 'block', width: '100%' }" />
                </ClientOnly>
              </div>

              <!-- Render content part 2 -->
              <template v-for="block in contentParts[1]" :key="block.id">
                <!-- Regular HTML content -->
                <div v-if="block.type === 'html'" v-html="block.content"></div>

                <!-- Code blocks with syntax highlighting -->
                <div v-else-if="block.type === 'code'" class="my-6">
                  <div class="bg-gray-900 rounded-lg overflow-hidden">
                    <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <span class="text-sm text-gray-300 font-medium">{{ block.language }}</span>
                      <Icon :ssr="true" icon="ph:code" class="w-4 h-4 text-gray-400" />
                    </div>
                    <CodeHiglighter :code="block.content" :language="block.language || 'javascript'" />
                  </div>
                </div>
              </template>

              <!-- Second In-Article Ad -->
              <div class="my-8 flex justify-center">
                <ClientOnly>
                  <ClientOnly>
                    <Adsense key="blog-in-article-ad-2" client="ca-pub-1356911639243870" ad-slot="3430238458"
                      format="auto" responsive="true"
                      :style="{ display: 'block', width: '100%', minHeight: '100px' }" />
                  </ClientOnly>
                </ClientOnly>
              </div>

              <!-- Render content part 3 -->
              <template v-for="block in contentParts[2]" :key="block.id">
                <!-- Regular HTML content -->
                <div v-if="block.type === 'html'" v-html="block.content"></div>

                <!-- Code blocks with syntax highlighting -->
                <div v-else-if="block.type === 'code'" class="my-6">
                  <div class="bg-gray-900 rounded-lg overflow-hidden">
                    <div class="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                      <span class="text-sm text-gray-300 font-medium">Code</span>
                      <Icon :ssr="true" icon="ph:code" class="w-4 h-4 text-gray-400" />
                    </div>
                    <CodeHiglighter :code="block.content" :language="block.language || 'javascript'" />
                  </div>
                </div>
              </template>

              <!-- Share Icons and Found this helpful -->
              <div class="mt-3 pt-4 border-t border-gray-200">
                <div class="flex items-center gap-3 mb-4">
                  <span class="text-sm text-gray-600">Share:</span>
                  <button @click="openShareDialog"
                    class="p-2 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors" title="Share">
                    <Icon :ssr="true" icon="ph:share-network" class="w-5 h-5" />
                  </button>
                  <a :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(siteUrl + '/blog/' + slug)}`"
                    target="_blank" rel="noopener noreferrer"
                    class="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
                    title="Share on Twitter">
                    <Icon :ssr="true" icon="ph:twitter-logo" class="w-5 h-5" />
                  </a>
                  <a :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl + '/blog/' + slug)}`"
                    target="_blank" rel="noopener noreferrer"
                    class="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                    title="Share on Facebook">
                    <Icon :ssr="true" icon="ph:facebook-logo" class="w-5 h-5" />
                  </a>
                  <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(siteUrl + '/blog/' + slug)}&title=${encodeURIComponent(blog.title)}`"
                    target="_blank" rel="noopener noreferrer"
                    class="p-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-800 transition-colors"
                    title="Share on LinkedIn">
                    <Icon :ssr="true" icon="ph:linkedin-logo" class="w-5 h-5" />
                  </a>
                </div>

                <!-- Found this helpful -->
                <div class="flex items-center cursor-pointer" @click="toggleHelpful">
                  <Icon :ssr="true" :icon="isHelpful ? 'line-md:heart-filled' : 'line-md:heart'"
                    class="w-5 h-5 text-red-500 mr-2" />
                  <span class="text-gray-600">Found this helpful?</span>
                </div>
              </div>
            </div>
          </article>

          <!-- Related Articles -->
          <div class="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div v-if="relatedBlogsData && relatedBlogsData.length > 0" class="relative">
              <div class="overflow-x-auto -mx-6 px-6 pb-4 related-articles-container">
                <div class="flex gap-4 min-w-max">
                  <a v-for="relatedBlog in relatedBlogsData" :key="relatedBlog.id"
                    :href="`/blog/${relatedBlog.slug}`"
                    class="group flex-shrink-0 w-80 border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all">
                    <div class="aspect-video bg-gradient-to-br from-yellow-100 to-orange-100 relative overflow-hidden">
                      <img :src="`/generated-thumbnails/${relatedBlog.slug}.png`"
                        :alt="`${relatedBlog.title} - Blog thumbnail`"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy" @error="(e) => e.target.style.display = 'none'" />
                    </div>
                    <div class="p-4">
                      <h4
                        class="font-semibold text-gray-900 text-base mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                        {{ relatedBlog.title }}
                      </h4>
                      <p class="text-sm text-gray-600 mb-3 line-clamp-2">
                        {{ relatedBlog.description }}
                      </p>
                      <div class="flex items-center justify-between text-xs text-gray-500">
                        <span>{{ relatedBlog.reading_time || 5 }} min read</span>
                        <span>{{ useFormattedDatePreset(relatedBlog.created_at, 'medium') }}</span>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <!-- Slide indicator button -->
              <button class="slide-indicator" title="Scroll to see more articles">
                <Icon :ssr="true" icon="ph:caret-right" class="w-4 h-4" />
              </button>
            </div>
            <div v-else class="text-center py-8 text-gray-500">
              <Icon :ssr="true" icon="ph:article" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p class="text-sm">No related articles found</p>
            </div>
          </div>
        </div>

        <!-- Right Sidebar - TOC (Desktop only) -->
        <div class="hidden lg:block lg:col-span-2">
          <div class="sticky top-20">
            <div v-if="tocItems.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
                <Icon :ssr="true" icon="ph:list" class="w-5 h-5 mr-2" />
                Table of Contents
              </h3>
              <nav class="space-y-2">
                <a v-for="item in tocItems" :key="item.id" :href="item.href" @click.prevent="scrollToSection(item.id)"
                  class="block w-full text-left text-sm transition-colors" :class="{
                    'ml-4': item.depth === 3,
                    'font-medium text-yellow-600': item.id === activeSection,
                    'text-gray-600 hover:text-yellow-600': item.id !== activeSection
                  }">
                  {{ item.text }}
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Dialog -->
    <ShareDialog v-model="showShareDialog" :title="blog.title" :description="blog.description" type="blog" />
  </div>
</template>

<style>
.prose ul {
  list-style: disc !important;
}

/* Custom prose styles for better blog rendering */
.prose {
  color: rgb(31 41 55);
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgb(17 24 39);
  margin-top: 2rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgb(254 240 138);
  padding-bottom: 0.5rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgb(17 24 39);
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
  line-height: 1.625;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose pre {
  background-color: rgb(17 24 39);
  color: rgb(243 244 246);
  border-radius: 0.5rem;
  overflow-x: auto;
}

.prose blockquote {
  border-left: 4px solid rgb(234 179 8);
  padding-left: 1rem;
  font-style: italic;
  color: rgb(55 65 81);
  background-color: rgb(254 252 232);
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.prose a {
  color: rgb(202 138 4);
  font-weight: 500;
}

.prose a:hover {
  color: rgb(161 98 7);
}

.prose strong {
  font-weight: 600;
  color: rgb(17 24 39);
}

.prose em {
  font-style: italic;
}
</style>
