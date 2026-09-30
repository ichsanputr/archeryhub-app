<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[999] flex items-start justify-center px-4" style="padding-top: 10vh">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-navy/80 dark:bg-slate-950/90 backdrop-blur-md" @click="close" />

        <!-- Dialog Container -->
        <div
          class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200/80 dark:border-slate-800 transition-colors flex flex-col max-h-[78vh]">
          
          <!-- Search Header Input -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div class="size-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Icon icon="ph:magnifying-glass-bold" class="text-xl text-navy" />
            </div>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              :placeholder="locale === 'id' ? 'Cari turnamen panahan, penyelenggara, berita, atau panduan...' : 'Search archery tournaments, organizers, articles, or guides...'"
              class="flex-1 text-sm sm:text-base text-navy dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none bg-transparent font-medium"
              @keydown.esc="close"
              @keydown.down.prevent="moveDown"
              @keydown.up.prevent="moveUp"
              @keydown.enter.prevent="navigateActive"
            />
            <button
              v-if="query"
              @click="query = ''"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <Icon icon="ph:x-bold" class="text-sm" />
            </button>
            <div class="flex items-center gap-1.5 shrink-0">
              <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-400 dark:text-slate-400 font-mono">Esc</kbd>
            </div>
          </div>

          <!-- Category Filter Tabs -->
          <div class="px-5 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              v-for="cat in categoryTabs"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer"
              :class="selectedCategory === cat.id
                ? 'bg-navy text-primary font-bold shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'"
            >
              <Icon :icon="cat.icon" class="text-xs" :class="selectedCategory === cat.id ? 'text-primary' : ''" />
              <span>{{ cat.label }}</span>
              <span v-if="counts[cat.id] !== undefined" class="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
                :class="selectedCategory === cat.id ? 'bg-white/10 text-primary font-bold' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500'">
                {{ counts[cat.id] }}
              </span>
            </button>
          </div>

          <!-- Body Results Area -->
          <div class="flex-1 overflow-y-auto scrollbar-styled p-3 sm:p-4">
            <div v-if="filteredItems.length > 0" class="space-y-4">
              <div v-for="group in groupedItems" :key="group.type" class="space-y-1.5">
                <!-- Group Header -->
                <div class="px-2.5 py-1 text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center justify-between">
                  <span class="flex items-center gap-1.5">
                    <Icon :icon="group.icon" class="text-xs text-primary" />
                    <span>{{ group.title }}</span>
                  </span>
                  <span class="text-[11px] font-mono text-slate-400">{{ group.items.length }}</span>
                </div>

                <!-- Item Rows -->
                <NuxtLink
                  v-for="item in group.items"
                  :key="item.id"
                  :to="item.url"
                  @click="close"
                  @mouseenter="activeItemId = item.id"
                  class="flex items-center justify-between gap-3 p-3 rounded-2xl transition-all cursor-pointer border group"
                  :class="item.id === activeItemId
                    ? 'bg-slate-100/90 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-navy dark:text-white shadow-2xs'
                    : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-200'"
                >
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <!-- Visual Thumbnail / Icon -->
                    <div
                      class="size-9 rounded-xl overflow-hidden shrink-0 flex items-center justify-center transition-colors border"
                      :class="item.id === activeItemId
                        ? 'bg-navy text-primary border-navy'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200/80 dark:border-slate-700 group-hover:bg-primary/20 group-hover:text-navy dark:group-hover:bg-navy dark:group-hover:text-primary'"
                    >
                      <img v-if="item.image" :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
                      <Icon v-else :icon="item.icon || 'ph:file-text-bold'" class="text-base" />
                    </div>

                    <!-- Details -->
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <span class="text-xs sm:text-sm font-bold text-navy dark:text-slate-100 truncate group-hover:text-navy dark:group-hover:text-white transition-colors" v-html="highlight(item.title)" />
                        <span
                          v-if="item.badge"
                          class="px-2 py-0.5 rounded-md text-[10px] font-semibold shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                        >
                          {{ item.badge }}
                        </span>
                      </div>

                      <div v-if="item.subtitle" class="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5" v-html="highlight(item.subtitle)" />
                    </div>
                  </div>

                  <Icon
                    icon="ph:arrow-elbow-down-left-bold"
                    class="text-xs text-slate-300 dark:text-slate-600 transition-transform group-hover:translate-x-0.5 shrink-0"
                    :class="item.id === activeItemId ? 'text-primary' : ''"
                  />
                </NuxtLink>
              </div>
            </div>

            <!-- No Results State -->
            <div v-else class="py-12 text-center px-4">
              <div class="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-3">
                <Icon icon="ph:file-search-bold" class="text-2xl" />
              </div>
              <h4 class="text-sm font-bold text-navy dark:text-slate-200 mb-1">
                {{ locale === 'id' ? 'Tidak ada hasil pencarian' : 'No results found' }}
              </h4>
              <div class="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                {{ locale === 'id'
                  ? `Tidak ditemukan item yang cocok dengan kata kunci "${query}". Coba kata kunci lain atau pilih tab kategori lain.`
                  : `No items matched "${query}". Try searching with different keywords or switch categories.` }}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 px-5 py-3 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 shrink-0 font-medium flex-wrap">
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">↑↓</kbd>
              <span>{{ locale === 'id' ? 'navigasi' : 'navigate' }}</span>
            </span>
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">↵</kbd>
              <span>{{ locale === 'id' ? 'buka' : 'open' }}</span>
            </span>
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">Esc</kbd>
              <span>{{ locale === 'id' ? 'tutup' : 'close' }}</span>
            </span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

interface DiscoveryItem {
  id: string
  type: 'tournament' | 'organizer' | 'blog' | 'docs' | 'page'
  title: string
  subtitle?: string
  url: string
  image?: string
  icon?: string
  badge?: string | null
  meta?: {
    date?: string
    location?: string
  }
}

const isOpen = ref(false)
const query = ref('')
const selectedCategory = ref('tournament')
const activeItemId = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const router = useRouter()
const route = useRoute()
const { locale } = useI18n()
const { get } = useApi()

// Cache for loaded discovery data
const platformTournaments = ref<DiscoveryItem[]>([])
const externalTournaments = ref<DiscoveryItem[]>([])
const organizers = ref<DiscoveryItem[]>([])
const blogArticles = ref<DiscoveryItem[]>([])
const docArticles = ref<DiscoveryItem[]>([])
const isLoaded = ref(false)

const categoryTabs = computed(() => [
  { id: 'tournament', label: locale.value === 'id' ? 'Turnamen' : 'Tournaments', icon: 'ph:trophy-bold' },
  { id: 'organizer', label: locale.value === 'id' ? 'Penyelenggara' : 'Organizers', icon: 'ph:building-office-bold' },
  { id: 'blog', label: locale.value === 'id' ? 'Berita' : 'News & Blog', icon: 'ph:newspaper-bold' },
  { id: 'docs', label: 'Docs', icon: 'ph:book-bookmark-bold' },
  { id: 'page', label: locale.value === 'id' ? 'Halaman' : 'Pages', icon: 'ph:browsers-bold' }
])

const staticPages = computed<DiscoveryItem[]>(() => [
  {
    id: 'page-home',
    type: 'page',
    title: locale.value === 'id' ? 'Beranda Utama' : 'Home Page',
    subtitle: locale.value === 'id' ? 'Halaman depan platform panahan Archeris' : 'Archeris archery management platform home',
    url: '/',
    icon: 'ph:house-bold',
    badge: null
  },
  {
    id: 'page-tournaments',
    type: 'page',
    title: locale.value === 'id' ? 'Jelajah Seluruh Turnamen' : 'Browse All Tournaments',
    subtitle: locale.value === 'id' ? 'Daftar turnamen platform dan arsip resmi Ianseo' : 'Explore platform and official Ianseo archives',
    url: '/tournaments',
    icon: 'ph:trophy-bold',
    badge: null
  },
  {
    id: 'page-pricing',
    type: 'page',
    title: locale.value === 'id' ? 'Paket & Biaya Langganan' : 'Pricing & Subscription Plans',
    subtitle: locale.value === 'id' ? 'Pilihan paket turnamen untuk penyelenggara' : 'Subscription options for tournament organizers',
    url: '/package',
    icon: 'ph:credit-card-bold',
    badge: null
  },
  {
    id: 'page-blog',
    type: 'page',
    title: locale.value === 'id' ? 'Blog & Berita Panahan' : 'Archery Blog & News',
    subtitle: locale.value === 'id' ? 'Artikel tips panahan, update fitur, dan liputan kejuaraan' : 'Archery tips, updates, and event coverage',
    url: '/blog',
    icon: 'ph:article-bold',
    badge: null
  },
  {
    id: 'page-contact',
    type: 'page',
    title: locale.value === 'id' ? 'Hubungi Kami' : 'Contact Support',
    subtitle: locale.value === 'id' ? 'Kirim pesan atau pertanyaan ke tim Archeris' : 'Send questions and inquiries to Archeris team',
    url: '/contact',
    icon: 'ph:chat-circle-dots-bold',
    badge: null
  },
  {
    id: 'page-docs',
    type: 'page',
    title: locale.value === 'id' ? 'Pusat Dokumentasi' : 'Documentation Center',
    subtitle: locale.value === 'id' ? 'Panduan teknis turnamen, rules eliminasi, dan kualifikasi' : 'Tournament setup, qualification & elimination rules',
    url: '/docs',
    icon: 'ph:book-open-bold',
    badge: null
  }
])

const quickLinks = computed(() => [
  { title: locale.value === 'id' ? 'Jelajah Turnamen' : 'All Tournaments', url: '/tournaments', icon: 'ph:trophy-bold' },
  { title: locale.value === 'id' ? 'Panduan Eliminasi' : 'Elimination Guide', url: '/docs/elimination', icon: 'ph:tree-structure-bold' },
  { title: locale.value === 'id' ? 'Paket Biaya' : 'Pricing Plans', url: '/package', icon: 'ph:credit-card-bold' },
  { title: locale.value === 'id' ? 'Hubungi Kami' : 'Contact Us', url: '/contact', icon: 'ph:envelope-simple-bold' },
])

function toTitleCase(str?: string) {
  if (!str) return ''
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

function resolveArticleImage(image?: string, slug?: string) {
  if (image && !image.includes('unsplash.com')) {
    return image.replace(/\.png$/, '.webp')
  }
  if (slug) {
    return `/images/blog/thumbnails/${slug}.webp`
  }
  return '/images/blog/thumbnails/understanding-bow-types-recurve-compound-barebow.webp'
}

// Fetch all public discovery resources
const fetchAllResources = async () => {
  if (isLoaded.value) return
  try {
    const [tourneysRes, extRes, orgsRes, blogRes, docsRes] = await Promise.all([
      get('/tournaments?limit=25').catch(() => null),
      get('/tournaments/external').catch(() => null),
      get('/organizers?limit=20').catch(() => null),
      get('/blog/articles').catch(() => null),
      get(`/docs?lang=${locale.value}`).catch(() => null)
    ])

    // 1. Platform Tournaments (Deduplicated)
    const rawTourneys = tourneysRes?.events || tourneysRes?.data || (Array.isArray(tourneysRes) ? tourneysRes : [])
    const seenTourneyKeys = new Set<string>()
    platformTournaments.value = rawTourneys
      .filter((t: any) => {
        const key = (t.slug || t.uuid || t.id || t.name || '').toLowerCase()
        if (!key || seenTourneyKeys.has(key)) return false
        seenTourneyKeys.add(key)
        return true
      })
      .map((t: any) => {
        const formattedDate = t.start_date
          ? new Date(t.start_date).toLocaleDateString(locale.value === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
          : undefined
        const locationText = toTitleCase(t.venue || t.city || t.location)
        const subParts = [formattedDate, locationText].filter(Boolean)

        return {
          id: `tourney-${t.uuid || t.id}`,
          type: 'tournament' as const,
          title: toTitleCase(t.name || 'Untitled Tournament'),
          subtitle: subParts.length > 0 ? subParts.join(' • ') : (locale.value === 'id' ? 'Turnamen Panahan Resmi' : 'Official Archery Tournament'),
          url: `/tournaments/${t.slug || t.uuid || t.id}`,
          image: t.logo_url || t.banner_url,
          icon: 'ph:trophy-bold',
          badge: t.status ? toTitleCase(t.status) : 'Platform',
          meta: {
            date: formattedDate,
            location: locationText
          }
        }
      })

    // 2. Ianseo External Tournaments (Deduplicated)
    const rawExt = extRes?.tournaments || []
    const seenExtKeys = new Set<string>()
    externalTournaments.value = rawExt
      .filter((t: any) => {
        const key = (t.slug || t.id || t.name || '').toLowerCase()
        if (!key || seenExtKeys.has(key) || seenTourneyKeys.has(key)) return false
        seenExtKeys.add(key)
        return true
      })
      .map((t: any) => {
        const formattedDate = t.start_date
          ? new Date(t.start_date).toLocaleDateString(locale.value === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })
          : undefined
        const locationText = toTitleCase(t.venue || t.location)
        const subParts = [formattedDate, locationText].filter(Boolean)

        return {
          id: `ext-${t.uuid || t.id}`,
          type: 'tournament' as const,
          title: toTitleCase(t.name),
          subtitle: subParts.length > 0 ? subParts.join(' • ') : (locale.value === 'id' ? 'Arsip & Hasil Resmi Ianseo' : 'Official Ianseo Archive'),
          url: `/tournaments/${t.slug || t.id}`,
          image: t.banner_url || t.logo_url,
          icon: 'ph:seal-check-bold',
          badge: 'Ianseo',
          meta: {
            date: formattedDate,
            location: locationText
          }
        }
      })

    // 3. Organizers / Clubs (Deduplicated)
    const rawOrgs = orgsRes?.data || (Array.isArray(orgsRes) ? orgsRes : [])
    const seenOrgKeys = new Set<string>()
    organizers.value = rawOrgs
      .filter((o: any) => {
        const key = (o.slug || o.id || o.name || '').toLowerCase()
        if (!key || seenOrgKeys.has(key)) return false
        seenOrgKeys.add(key)
        return true
      })
      .map((o: any) => {
        const cityText = toTitleCase(o.city || o.province || '')
        const countryText = toTitleCase(o.country || 'Indonesia')
        const locationBadge = cityText || countryText

        return {
          id: `org-${o.slug || o.id}`,
          type: 'organizer' as const,
          title: toTitleCase(o.name),
          subtitle: o.description || (cityText ? `${cityText}, ${countryText}` : (locale.value === 'id' ? 'Penyelenggara resmi terdaftar' : 'Official registered tournament organizer')),
          url: `/organizer/${o.slug || o.id}`,
          image: o.avatar_url || o.banner_url || o.logo_url,
          icon: 'ph:building-office-bold',
          badge: locationBadge || null,
          meta: {
            location: locationBadge
          }
        }
      })

    // 4. Blog Articles (Deduplicated)
    const rawBlogs = blogRes?.articles || blogRes?.data || (Array.isArray(blogRes) ? blogRes : [])
    const seenBlogKeys = new Set<string>()
    blogArticles.value = rawBlogs
      .filter((b: any) => {
        const key = (b.slug || b.id || b.title || '').toLowerCase()
        if (!key || seenBlogKeys.has(key)) return false
        seenBlogKeys.add(key)
        return true
      })
      .map((b: any) => ({
        id: `blog-${b.slug || b.id}`,
        type: 'blog' as const,
        title: toTitleCase(b.title),
        subtitle: b.excerpt || b.summary,
        url: `/blog/${b.slug || b.id}`,
        image: resolveArticleImage(b.image || b.image_url || b.cover_image, b.slug),
        icon: 'ph:newspaper-bold',
        badge: b.category ? toTitleCase(b.category) : null
      }))

    // 5. Documentation Guides (Deduplicated)
    const rawDocs = docsRes || []
    const seenDocKeys = new Set<string>()
    docArticles.value = rawDocs
      .filter((d: any) => {
        const key = (d.slug || d.title || '').toLowerCase()
        if (!key || seenDocKeys.has(key)) return false
        seenDocKeys.add(key)
        return true
      })
      .map((d: any) => ({
        id: `doc-${d.slug}`,
        type: 'docs' as const,
        title: toTitleCase(d.title),
        subtitle: d.excerpt,
        url: `/docs/${d.slug}`,
        icon: d.icon || 'ph:book-bookmark-bold',
        badge: d.category ? toTitleCase(d.category) : null
      }))

    isLoaded.value = true
  } catch (err) {
    console.error('Failed to load public search resources:', err)
  }
}

// All aggregated items
const allItems = computed<DiscoveryItem[]>(() => {
  return [
    ...platformTournaments.value,
    ...externalTournaments.value,
    ...organizers.value,
    ...blogArticles.value,
    ...docArticles.value,
    ...staticPages.value
  ]
})

// Count by category
const counts = computed<Record<string, number>>(() => {
  return {
    tournament: platformTournaments.value.length + externalTournaments.value.length,
    organizer: organizers.value.length,
    blog: blogArticles.value.length,
    docs: docArticles.value.length,
    page: staticPages.value.length
  }
})

// Filtered list
const filteredItems = computed<DiscoveryItem[]>(() => {
  const q = query.value.toLowerCase().trim()

  return allItems.value.filter((item) => {
    if (selectedCategory.value && item.type !== selectedCategory.value) {
      return false
    }
    if (!q) return true

    const matchTitle = item.title && item.title.toLowerCase().includes(q)
    const matchSub = item.subtitle && item.subtitle.toLowerCase().includes(q)
    const matchBadge = item.badge && item.badge.toLowerCase().includes(q)
    const matchLoc = item.meta?.location && item.meta.location.toLowerCase().includes(q)
    return matchTitle || matchSub || matchBadge || matchLoc
  })
})

const categoryGroupTitles: Record<string, { id: string; en: string; icon: string }> = {
  tournament: { id: 'Turnamen Panahan', en: 'Archery Tournaments', icon: 'ph:trophy-bold' },
  organizer: { id: 'Penyelenggara', en: 'Organizers', icon: 'ph:building-office-bold' },
  blog: { id: 'Berita & Artikel', en: 'News & Articles', icon: 'ph:newspaper-bold' },
  docs: { id: 'Docs', en: 'Docs', icon: 'ph:book-bookmark-bold' },
  page: { id: 'Menu & Halaman', en: 'Pages & Shortcuts', icon: 'ph:browsers-bold' }
}

const groupedItems = computed(() => {
  const groups: Array<{ type: string; title: string; icon: string; items: DiscoveryItem[] }> = []
  const order: Array<'tournament' | 'organizer' | 'blog' | 'docs' | 'page'> = ['tournament', 'organizer', 'blog', 'docs', 'page']

  order.forEach((catType) => {
    if (selectedCategory.value && selectedCategory.value !== catType) return
    const items = filteredItems.value.filter((it) => it.type === catType)
    if (items.length > 0) {
      const info = categoryGroupTitles[catType]
      groups.push({
        type: catType,
        title: locale.value === 'id' ? info.id : info.en,
        icon: info.icon,
        items
      })
    }
  })

  return groups
})

const suggestedTournaments = computed(() => {
  return [...platformTournaments.value, ...externalTournaments.value].slice(0, 4)
})

const highlight = (text?: string) => {
  if (!text) return ''
  if (!query.value.trim()) return text
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="bg-primary/30 text-navy dark:text-primary font-bold px-1 rounded-sm not-italic">$1</mark>'
  )
}

watch([filteredItems, selectedCategory], () => {
  if (filteredItems.value.length > 0) {
    activeItemId.value = filteredItems.value[0].id
  } else {
    activeItemId.value = ''
  }
})

const moveDown = () => {
  const list = filteredItems.value
  if (list.length === 0) return
  const currentIndex = list.findIndex((i) => i.id === activeItemId.value)
  if (currentIndex < list.length - 1) {
    activeItemId.value = list[currentIndex + 1].id
  }
}

const moveUp = () => {
  const list = filteredItems.value
  if (list.length === 0) return
  const currentIndex = list.findIndex((i) => i.id === activeItemId.value)
  if (currentIndex > 0) {
    activeItemId.value = list[currentIndex - 1].id
  }
}

const navigateActive = () => {
  const list = filteredItems.value
  if (list.length === 0) return
  const item = list.find((i) => i.id === activeItemId.value) || list[0]
  if (item) {
    router.push(item.url)
    close()
  }
}

const open = () => {
  isOpen.value = true
  query.value = ''
  selectedCategory.value = 'tournament'
  fetchAllResources()
  nextTick(() => inputRef.value?.focus())
}

const close = () => {
  isOpen.value = false
  query.value = ''
  selectedCategory.value = 'tournament'
}

defineExpose({
  open,
  close
})

// Global keyboard shortcut: Ctrl+K / Cmd+K
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    // Do not open on homepage or inside dashboard
    const isHomePage = route.path === '/'
    const isDashboard = route.path.startsWith('/dashboard') ||
                        route.path.startsWith('/organizer/dashboard') ||
                        route.path.startsWith('/archer/dashboard') ||
                        route.path.startsWith('/club/dashboard') ||
                        route.path.startsWith('/admin')
    if (!isDashboard && !isHomePage) {
      e.preventDefault()
      if (isOpen.value) {
        close()
      } else {
        open()
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
.search-fade-enter-active,
.search-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(-8px);
}

.scrollbar-styled::-webkit-scrollbar {
  width: 5px;
}
.scrollbar-styled::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-styled::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 9999px;
}
.scrollbar-styled::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
