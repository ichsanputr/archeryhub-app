<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[999] flex items-start justify-center px-4" style="padding-top: 12vh">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-navy/60 backdrop-blur-sm" @click="close" />

        <!-- Dialog -->
        <div
          class="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-100 dark:border-slate-800 transition-colors">
          <!-- Input Row -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-slate-800">
            <Icon icon="ph:magnifying-glass-bold" class="text-xl text-primary shrink-0" />
            <input ref="inputRef" v-model="query" type="text" :placeholder="t('doc_search.placeholder')"
              class="flex-1 text-sm text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none bg-transparent"
              @keydown.esc="close" @keydown.down.prevent="moveDown" @keydown.up.prevent="moveUp"
              @keydown.enter.prevent="navigate" />
            <div class="flex items-center gap-1.5 shrink-0">
              <kbd
                class="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded text-xs text-gray-400 dark:text-slate-400 font-mono">Esc</kbd>
            </div>
          </div>

          <!-- Body -->
          <div class="max-h-[55vh] overflow-y-auto scrollbar-styled">
            <!-- Results -->
            <template v-if="query.trim()">
              <template v-if="results.length">
                <NuxtLink v-for="(page, i) in results" :key="page.path" :to="page.path" @click="close"
                  class="flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer border-b border-gray-50 dark:border-slate-800/60 last:border-0"
                  :class="i === activeIndex ? 'bg-gray-100 dark:bg-slate-800' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'">
                  <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    :class="i === activeIndex ? 'bg-navy/10 dark:bg-primary/20 text-navy dark:text-primary' : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-400'">
                    <Icon :icon="page.icon" class="text-base" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-bold text-navy dark:text-slate-100 leading-snug" v-html="highlight(getPageTitle(page))" />
                    <div class="text-xs text-gray-400 dark:text-slate-400 truncate mt-0.5" v-html="highlight(getPageDesc(page))" />
                  </div>
                  <Icon icon="ph:arrow-right-bold" class="text-xs text-gray-300 dark:text-slate-600 shrink-0"
                    :class="i === activeIndex ? 'text-navy dark:text-primary' : ''" />
                </NuxtLink>
              </template>
              <div v-else class="py-14 text-center">
                <div class="flex justify-center w-full">
                  <Icon icon="ph:file-search-bold" class="text-4xl text-gray-200 dark:text-slate-700 mb-3" />
                </div>
                <p class="text-sm text-gray-400 dark:text-slate-400">{{ t('doc_search.no_results') }} "{{ query }}"</p>
              </div>
            </template>

            <!-- Empty / Default state: quick links -->
            <template v-else>
              <div class="px-5 pt-5 pb-4">
                <p class="text-xs text-gray-400 dark:text-slate-500 font-bold tracking-widest mb-3">{{ t('doc_search.quick_navigation') }}</p>
                <div class="flex flex-col gap-1">
                  <NuxtLink v-for="(page, i) in quickLinks" :key="page.path" :to="page.path" @click="close"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-xs text-gray-600 dark:text-slate-300 border border-gray-100 dark:border-slate-800"
                    :class="i === activeIndex ? 'bg-primary/10 text-primary border-primary/20' : 'hover:bg-gray-50 dark:hover:bg-slate-800/50'">
                    <Icon :icon="page.icon" class="text-base text-gray-400 dark:text-slate-500 shrink-0" />
                    <div class="flex-1 min-w-0">
                      <span class="font-bold text-navy dark:text-slate-100">{{ getPageTitle(page) }}</span>
                      <span class="text-gray-400 dark:text-slate-500 ml-2 truncate hidden sm:inline">{{ getPageDesc(page) }}</span>
                    </div>
                    <Icon icon="ph:arrow-right" class="text-xs text-gray-300 dark:text-slate-600 shrink-0" />
                  </NuxtLink>
                </div>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900 px-5 py-2.5 flex items-center gap-4">
            <span class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 font-medium">
              <kbd class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-gray-500 dark:text-slate-400">↑↓</kbd>
              {{ t('doc_search.to_navigate') }}
            </span>
            <span class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 font-medium">
              <kbd class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-gray-500 dark:text-slate-400">↵</kbd>
              {{ t('doc_search.to_select') }}
            </span>
            <span class="flex items-center gap-1.5 text-xs text-gray-400 dark:text-slate-500 font-medium">
              <kbd class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-gray-500 dark:text-slate-400">Esc</kbd>
              {{ t('doc_search.to_close') }}
            </span>
            <span class="ml-auto text-xs text-gray-400 dark:text-slate-500 hidden sm:block font-mono">Ctrl K</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'
import pagesData from '~/data/pages.json'

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const inputRef = ref(null)
const router = useRouter()
const { t } = useI18n()

const { user, userPersona } = useAuth()

const getPageTitle = (page) => {
  if (page.titleKey) {
    const val = t(page.titleKey)
    if (val && val !== page.titleKey) return val
  }
  return page.title
}

const getPageDesc = (page) => {
  if (page.descriptionKey) {
    const val = t(page.descriptionKey)
    if (val && val !== page.descriptionKey) return val
  }
  return page.description
}

// Build the page list based on the logged-in user's role
const rolePages = computed(() => {
  const role = userPersona?.value || user.value?.role || user.value?.user_type || user.value?.type || 'archer'
  const specific = pagesData[role] || (role === 'club' ? pagesData.organizer : []) || pagesData.organizer || []
  const common = pagesData.common || []
  // Deduplicate by path
  const seen = new Set()
  return [...specific, ...common].filter(p => {
    if (seen.has(p.path)) return false
    seen.add(p.path)
    return true
  })
})

const quickLinks = computed(() => rolePages.value.slice(0, 6))

const results = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  return rolePages.value
    .filter(p => {
      const title = getPageTitle(p).toLowerCase()
      const desc = getPageDesc(p).toLowerCase()
      return title.includes(q) ||
        desc.includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords.some(k => k.toLowerCase().includes(q))
    })
    .slice(0, 8)
})

const highlight = (text) => {
  if (!query.value.trim()) return text
  const escaped = query.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="bg-yellow-100 text-navy font-semibold rounded-sm not-italic">$1</mark>'
  )
}

watch(results, () => { activeIndex.value = -1 })

const moveDown = () => {
  const list = query.value.trim() ? results.value : quickLinks.value
  if (activeIndex.value < list.length - 1) activeIndex.value++
}
const moveUp = () => {
  if (activeIndex.value > 0) activeIndex.value--
}
const navigate = () => {
  const list = query.value.trim() ? results.value : quickLinks.value
  const idx = activeIndex.value === -1 ? 0 : activeIndex.value
  const page = list[idx]
  if (page) {
    router.push(page.path)
    close()
  }
}

const open = () => {
  isOpen.value = true
  nextTick(() => inputRef.value?.focus())
}

const close = () => {
  isOpen.value = false
  query.value = ''
  activeIndex.value = -1
}

const handleKeydown = (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    isOpen.value ? close() : open()
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

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
</style>
