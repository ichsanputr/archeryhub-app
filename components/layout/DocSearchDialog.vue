<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[999] flex items-start justify-center px-4" style="padding-top: 10vh">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-navy/70 dark:bg-slate-950/80 backdrop-blur-sm" @click="close" />

        <!-- Dialog -->
        <div
          class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-slate-800 transition-colors flex flex-col max-h-[75vh]">
          <!-- Input Header -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <Icon icon="ph:magnifying-glass-bold" class="text-2xl text-primary shrink-0" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              :placeholder="locale === 'id' ? 'Cari topik, eliminasi, kualifikasi, panduan...' : 'Search documentation guides, rules, setup...'"
              class="flex-1 text-sm sm:text-base text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none bg-transparent font-medium"
              @keydown.esc="close"
              @keydown.down.prevent="moveDown"
              @keydown.up.prevent="moveUp"
              @keydown.enter.prevent="navigate"
            />
            <button
              v-if="query"
              @click="query = ''"
              class="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <Icon icon="ph:x-bold" class="text-sm" />
            </button>
            <div class="flex items-center gap-1.5 shrink-0">
              <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-400 dark:text-slate-400 font-mono">Esc</kbd>
            </div>
          </div>

          <!-- Category Filter Chips -->
          <div class="px-5 py-2.5 bg-gray-50/70 dark:bg-slate-900/90 border-b border-gray-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              v-for="cat in categoryFilters"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer"
              :class="selectedCategory === cat.id
                ? 'bg-primary text-navy font-black shadow-xs'
                : 'text-gray-500 dark:text-slate-400 hover:bg-gray-200/60 dark:hover:bg-slate-800'"
            >
              <Icon :icon="cat.icon" class="text-xs" />
              <span>{{ cat.label }}</span>
            </button>
          </div>

          <!-- Results & Content Body -->
          <div class="flex-1 overflow-y-auto scrollbar-styled p-3 sm:p-4">
            <!-- Search Results -->
            <template v-if="query.trim()">
              <div v-if="filteredResults.length" class="space-y-1.5">
                <NuxtLink
                  v-for="(doc, i) in filteredResults"
                  :key="doc.slug"
                  :to="`/docs/${doc.slug}`"
                  @click="close"
                  class="flex items-start gap-3.5 p-3.5 rounded-2xl transition-all cursor-pointer border group"
                  :class="i === activeIndex
                    ? 'bg-primary/10 dark:bg-primary/15 border-primary/40 text-navy dark:text-primary shadow-xs'
                    : 'bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-800/60 border-gray-100/80 dark:border-slate-800/80 text-gray-700 dark:text-slate-200'"
                >
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors mt-0.5"
                    :class="i === activeIndex
                      ? 'bg-primary text-navy font-black'
                      : 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 group-hover:bg-primary/20 group-hover:text-navy dark:group-hover:text-primary'"
                  >
                    <Icon :icon="doc.icon || 'ph:file-text-bold'" class="text-lg" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400">
                        {{ getCategoryLabel(doc.category) }}
                      </span>
                      <span v-if="doc.readTime" class="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                        {{ doc.readTime }}
                      </span>
                    </div>
                    <div class="text-sm font-bold text-navy dark:text-slate-100 leading-snug group-hover:text-primary transition-colors" v-html="highlight(doc.title)" />
                    <div class="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed" v-html="highlight(doc.excerpt)" />
                  </div>
                  <Icon
                    icon="ph:arrow-right-bold"
                    class="text-xs text-gray-300 dark:text-slate-600 shrink-0 self-center transition-transform group-hover:translate-x-0.5"
                    :class="i === activeIndex ? 'text-primary' : ''"
                  />
                </NuxtLink>
              </div>

              <!-- No Results State -->
              <div v-else class="py-12 text-center px-4">
                <div class="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 dark:text-slate-500 mx-auto mb-3">
                  <Icon icon="ph:file-search-bold" class="text-2xl" />
                </div>
                <h4 class="text-sm font-bold text-navy dark:text-slate-200 mb-1">
                  {{ locale === 'id' ? 'Dokumentasi tidak ditemukan' : 'No documentation found' }}
                </h4>
                <p class="text-xs text-gray-400 dark:text-slate-500 max-w-sm mx-auto">
                  {{ locale === 'id'
                    ? `Tidak ada artikel dokumentasi yang cocok dengan kata kunci "${query}". Coba kata kunci seperti: eliminasi, target, shoot-off, kualifikasi.`
                    : `No documentation articles matched "${query}". Try searching for: elimination, target, shoot-off, qualification.` }}
                </p>
              </div>
            </template>

            <!-- Default State: Quick Navigation / Suggested Docs -->
            <template v-else>
              <div class="py-2">
                <div class="flex items-center justify-between px-2 mb-3">
                  <span class="text-[11px] font-black tracking-wider text-gray-400 dark:text-slate-500 uppercase">
                    {{ locale === 'id' ? 'Dokumentasi Populer & Panduan Cepat' : 'Popular Guides & Quick Start' }}
                  </span>
                  <span class="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                    {{ allDocs.length }} {{ locale === 'id' ? 'Dokumen' : 'Documents' }}
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <NuxtLink
                    v-for="(doc, i) in suggestedDocs"
                    :key="doc.slug"
                    :to="`/docs/${doc.slug}`"
                    @click="close"
                    class="flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer border border-gray-100 dark:border-slate-800/80 hover:border-primary/40 bg-white dark:bg-slate-900/60 hover:bg-gray-50 dark:hover:bg-slate-800/50 group"
                    :class="i === activeIndex ? 'bg-primary/10 border-primary/40' : ''"
                  >
                    <div class="w-9 h-9 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 group-hover:bg-primary/20 group-hover:text-navy dark:group-hover:text-primary flex items-center justify-center shrink-0 transition-colors">
                      <Icon :icon="doc.icon || 'ph:file-text-bold'" class="text-base" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase leading-none mb-1">
                        {{ getCategoryLabel(doc.category) }}
                      </div>
                      <div class="text-xs font-bold text-navy dark:text-slate-100 truncate group-hover:text-primary transition-colors">
                        {{ doc.title }}
                      </div>
                    </div>
                    <Icon icon="ph:arrow-right" class="text-xs text-gray-300 dark:text-slate-600 shrink-0 group-hover:text-primary" />
                  </NuxtLink>
                </div>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-100 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900 px-5 py-3 flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500 shrink-0 font-medium flex-wrap">
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-gray-600 dark:text-slate-300">↑↓</kbd>
              <span>{{ locale === 'id' ? 'navigasi' : 'navigate' }}</span>
            </span>
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-gray-600 dark:text-slate-300">↵</kbd>
              <span>{{ locale === 'id' ? 'buka' : 'select' }}</span>
            </span>
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-gray-600 dark:text-slate-300">Esc</kbd>
              <span>{{ locale === 'id' ? 'tutup' : 'close' }}</span>
            </span>
            <span class="ml-auto font-mono text-[11px] hidden sm:block">
              Archeris Docs Engine
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'

interface DocItem {
  slug: string
  icon?: string
  category: string
  order?: number
  readTime?: string
  title: string
  excerpt: string
  updated_at?: string
}

const isOpen = ref(false)
const query = ref('')
const selectedCategory = ref('all')
const activeIndex = ref(-1)
const inputRef = ref<HTMLInputElement | null>(null)
const router = useRouter()
const { locale } = useI18n()
const apiBaseUrl = useApiBaseUrl()

// Fetch docs list dynamically from API based on current locale
const { data: docsData } = await useAsyncData<DocItem[]>(
  'doc-search-list',
  () => $fetch(`${apiBaseUrl}/docs?lang=${locale.value}`),
  { watch: [locale] }
)

const allDocs = computed<DocItem[]>(() => docsData.value || [])

const categoryLabels: Record<string, { en: string; id: string; icon: string }> = {
  accounts: { en: 'Accounts', id: 'Akun', icon: 'ph:users-three-bold' },
  tournaments: { en: 'Tournament Setup', id: 'Turnamen', icon: 'ph:trophy-bold' },
  scorekeeper: { en: 'Scorekeeper', id: 'Petugas Skor', icon: 'ph:device-mobile-bold' },
  qualification: { en: 'Qualification', id: 'Kualifikasi', icon: 'ph:chart-line-up-bold' },
  elimination: { en: 'Elimination', id: 'Eliminasi', icon: 'ph:tree-structure-bold' }
}

const categoryFilters = computed(() => [
  { id: 'all', label: locale.value === 'id' ? 'Semua Kategori' : 'All Categories', icon: 'ph:squares-four-bold' },
  { id: 'accounts', label: locale.value === 'id' ? 'Akun' : 'Accounts', icon: 'ph:users-three-bold' },
  { id: 'tournaments', label: locale.value === 'id' ? 'Turnamen' : 'Tournaments', icon: 'ph:trophy-bold' },
  { id: 'scorekeeper', label: locale.value === 'id' ? 'Petugas Skor' : 'Scorekeeper', icon: 'ph:device-mobile-bold' },
  { id: 'qualification', label: locale.value === 'id' ? 'Kualifikasi' : 'Qualification', icon: 'ph:chart-line-up-bold' },
  { id: 'elimination', label: locale.value === 'id' ? 'Eliminasi' : 'Elimination', icon: 'ph:tree-structure-bold' }
])

const getCategoryLabel = (catId: string) => {
  const item = categoryLabels[catId]
  if (item) {
    return locale.value === 'id' ? item.id : item.en
  }
  return catId ? catId.toUpperCase() : ''
}

const filteredResults = computed<DocItem[]>(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase().trim()

  return allDocs.value.filter((d: DocItem) => {
    if (selectedCategory.value !== 'all' && d.category !== selectedCategory.value) {
      return false
    }
    const matchTitle = d.title && d.title.toLowerCase().includes(q)
    const matchExcerpt = d.excerpt && d.excerpt.toLowerCase().includes(q)
    const matchSlug = d.slug && d.slug.toLowerCase().includes(q)
    const matchCat = d.category && d.category.toLowerCase().includes(q)
    const matchCatLabel = getCategoryLabel(d.category).toLowerCase().includes(q)

    return matchTitle || matchExcerpt || matchSlug || matchCat || matchCatLabel
  })
})

const suggestedDocs = computed<DocItem[]>(() => {
  if (selectedCategory.value !== 'all') {
    return allDocs.value.filter((d: DocItem) => d.category === selectedCategory.value).slice(0, 8)
  }
  return allDocs.value.slice(0, 8)
})

const highlight = (text: string) => {
  if (!query.value.trim() || !text) return text || ''
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="bg-primary/30 text-navy dark:text-primary font-bold px-1 rounded-sm not-italic">$1</mark>'
  )
}

watch([filteredResults, selectedCategory], () => {
  activeIndex.value = -1
})

const moveDown = () => {
  const list = query.value.trim() ? filteredResults.value : suggestedDocs.value
  if (activeIndex.value < list.length - 1) activeIndex.value++
}

const moveUp = () => {
  if (activeIndex.value > 0) activeIndex.value--
}

const navigate = () => {
  const list = query.value.trim() ? filteredResults.value : suggestedDocs.value
  const idx = activeIndex.value === -1 ? 0 : activeIndex.value
  const doc = list[idx]
  if (doc) {
    router.push(`/docs/${doc.slug}`)
    close()
  }
}

const open = () => {
  isOpen.value = true
  query.value = ''
  selectedCategory.value = 'all'
  activeIndex.value = -1
  nextTick(() => inputRef.value?.focus())
}

const close = () => {
  isOpen.value = false
  query.value = ''
  activeIndex.value = -1
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
    e.preventDefault()
    isOpen.value ? close() : open()
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
})

defineExpose({ open, close })
</script>

<style scoped>
.search-fade-enter-active,
.search-fade-leave-active {
  transition: opacity 0.15s ease;
}

.search-fade-enter-active .relative,
.search-fade-leave-active .relative {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
}

.search-fade-enter-from .relative {
  transform: translateY(-8px);
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
