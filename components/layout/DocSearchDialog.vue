<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[999] flex items-start justify-center px-4" style="padding-top: 12vh">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-navy/60 backdrop-blur-sm" @click="close" />

        <!-- Dialog -->
        <div class="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-gray-100">
          <!-- Input Row -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
            <Icon icon="ph:magnifying-glass-bold" class="text-xl text-primary shrink-0" />
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              placeholder="Cari dokumentasi..."
              class="flex-1 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
              @keydown.esc="close"
              @keydown.down.prevent="moveDown"
              @keydown.up.prevent="moveUp"
              @keydown.enter.prevent="navigate"
            />
            <div class="flex items-center gap-1.5 shrink-0">
              <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-400 font-mono">Esc</kbd>
            </div>
          </div>

          <!-- Body -->
          <div class="max-h-[55vh] overflow-y-auto">
            <!-- Results -->
            <template v-if="query.trim()">
              <template v-if="results.length">
                <NuxtLink
                  v-for="(doc, i) in results"
                  :key="doc.slug"
                  :to="`/docs/${doc.slug}`"
                  @click="close"
                  class="flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                  :class="i === activeIndex ? 'bg-gray-100' : 'hover:bg-gray-50'"
                >
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    :class="i === activeIndex ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-400'"
                  >
                    <Icon :icon="doc.icon" class="text-base" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-bold text-navy leading-snug" v-html="highlight(doc.title)" />
                    <div class="text-xs text-gray-400 truncate mt-0.5" v-html="highlight(doc.excerpt)" />
                  </div>
                  <span class="text-xs text-gray-300 whitespace-nowrap shrink-0 hidden sm:block">{{ categoryLabel(doc.category) }}</span>
                  <Icon icon="ph:arrow-right-bold" class="text-xs text-gray-300 shrink-0" :class="i === activeIndex ? 'text-navy' : ''" />
                </NuxtLink>
              </template>
              <div v-else class="py-14 text-center">
                <div class="flex justify-center w-full">
                    <Icon icon="ph:file-search-bold" class="text-4xl text-gray-200 mb-3" />
                </div>
                <p class="text-sm text-gray-400">Tidak ada hasil untuk <strong class="text-navy">"{{ query }}"</strong></p>
              </div>
            </template>

            <!-- Empty / Default state -->
            <template v-else>
              <div class="px-5 pt-5 pb-2">
                <p class="text-xs text-gray-300 font-bold uppercase tracking-widest mb-3">Sering Dicari</p>
                <div class="flex flex-wrap gap-2 mb-4">
                  <button
                    v-for="doc in popularDocs"
                    :key="doc.slug"
                    @click="goTo(doc.slug)"
                    class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-primary/10 rounded-lg text-xs text-gray-500 transition-colors border border-gray-100"
                  >
                    <Icon :icon="doc.icon" class="text-sm" />
                    {{ doc.title }}
                  </button>
                </div>
              </div>
              <div class="border-t border-gray-50 px-5 py-3">
                <p class="text-xs text-gray-300 font-bold uppercase tracking-widest mb-3">Kategori</p>
                <div class="grid grid-cols-2 gap-2 pb-3">
                  <NuxtLink
                    v-for="cat in categoryLinks"
                    :key="cat.id"
                    :to="`/docs?cat=${cat.id}`"
                    @click="close"
                    class="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 hover:bg-primary/10 hover:text-primary transition-colors text-xs text-gray-500 border border-gray-100"
                  >
                    <Icon :icon="cat.icon" class="text-base text-gray-400" />
                    <span class="font-semibold">{{ cat.label }}</span>
                  </NuxtLink>
                </div>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-100 bg-gray-50/50 px-5 py-2.5 flex items-center gap-4">
            <span class="flex items-center gap-1.5 text-xs text-gray-300">
              <kbd class="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-400">↑↓</kbd>
              navigasi
            </span>
            <span class="flex items-center gap-1.5 text-xs text-gray-300">
              <kbd class="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-400">↵</kbd>
              buka
            </span>
            <span class="flex items-center gap-1.5 text-xs text-gray-300">
              <kbd class="bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono text-gray-400">Esc</kbd>
              tutup
            </span>
            <span class="ml-auto text-xs text-gray-200 hidden sm:block">Ctrl K</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { docs } from '~/data/docs'

const isOpen = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const inputRef = ref(null)
const router = useRouter()

const categoryLabels = {
  platform: 'Platform',
  archer: 'Akun Pemanah',
  archery: 'Teknis Panahan',
  subscription: 'Berlangganan',
  event: 'Manajemen Event',
  scoring: 'Scoring',
  marketplace: 'Marketplace',
}

const categoryLinks = [
  { id: 'platform', label: 'Platform', icon: 'ph:rocket-bold' },
  { id: 'archer', label: 'Akun Pemanah', icon: 'ph:user-bold' },
  { id: 'archery', label: 'Teknis Panahan', icon: 'ph:crosshair-bold' },
  { id: 'subscription', label: 'Berlangganan', icon: 'ph:crown-bold' },
  { id: 'event', label: 'Manajemen Event', icon: 'ph:trophy-bold' },
  { id: 'scoring', label: 'Scoring', icon: 'ph:target-bold' },
]

const categoryLabel = (cat) => categoryLabels[cat] || cat

const results = computed(() => {
  if (!query.value.trim()) return []
  const q = query.value.toLowerCase()
  return docs
    .filter(d => d.title.toLowerCase().includes(q) || d.excerpt.toLowerCase().includes(q))
    .slice(0, 8)
})

const popularDocs = computed(() => docs.slice(0, 5))

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
  if (activeIndex.value < results.value.length - 1) activeIndex.value++
}
const moveUp = () => {
  if (activeIndex.value > 0) activeIndex.value--
}
const navigate = () => {
  const idx = activeIndex.value === -1 ? 0 : activeIndex.value
  const doc = results.value[idx]
  if (doc) {
    router.push(`/docs/${doc.slug}`)
    close()
  }
}

const goTo = (slug) => {
  router.push(`/docs/${slug}`)
  close()
}

const open = () => {
  isOpen.value = true
  nextTick(() => inputRef.value?.focus())
}

const close = () => {
  isOpen.value = false
  query.value = ''
  activeIndex.value = 0
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
