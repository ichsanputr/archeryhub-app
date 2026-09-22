<template>
  <section id="related" class="scroll-mt-24 space-y-5">
    <!-- Header with Title and Scroll Controls -->
    <div class="space-y-1.5 border-b border-slate-100 pb-3.5">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div class="size-9 sm:size-10 rounded-2xl bg-primary/20 text-navy border border-primary/30 flex items-center justify-center shrink-0">
            <Icon icon="ph:trophy-bold" class="size-4.5 sm:size-5 text-navy" />
          </div>
          <h2 class="text-lg sm:text-2xl font-bold text-navy font-display truncate">
            {{ labels.title }}
          </h2>
        </div>

        <!-- Carousel Controls & View All Link -->
        <div class="flex items-center gap-2 shrink-0">
          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="scrollRelated('left')"
              title="Scroll Left"
              class="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy flex items-center justify-center transition-colors cursor-pointer"
            >
              <Icon icon="ph:caret-left-bold" class="text-xs" />
            </button>
            <button
              type="button"
              @click="scrollRelated('right')"
              title="Scroll Right"
              class="size-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy flex items-center justify-center transition-colors cursor-pointer"
            >
              <Icon icon="ph:caret-right-bold" class="text-xs" />
            </button>
          </div>
          <NuxtLink
            to="/tournaments"
            class="hidden sm:inline-flex text-navy hover:text-primary-hover transition-colors font-bold text-xs sm:text-sm items-center gap-1 whitespace-nowrap pl-1"
          >
            <span>{{ labels.viewAll }}</span>
            <Icon icon="ph:arrow-right-bold" class="text-xs" />
          </NuxtLink>
        </div>
      </div>

      <div class="flex items-center justify-between gap-2">
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {{ labels.desc }}
        </p>
        <NuxtLink
          to="/tournaments"
          class="sm:hidden text-navy font-bold text-xs flex items-center gap-0.5 whitespace-nowrap shrink-0 hover:text-primary transition-colors"
        >
          <span>{{ labels.viewAll }}</span>
          <Icon icon="ph:arrow-right-bold" class="text-[10px]" />
        </NuxtLink>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="isLoading" class="flex gap-4 overflow-hidden py-1">
      <div v-for="i in 3" :key="i" class="min-w-[280px] sm:min-w-[320px] max-w-[340px] p-4 rounded-3xl border border-slate-100 bg-white shadow-2xs space-y-3 animate-pulse shrink-0">
        <div class="aspect-[16/9] bg-slate-200/80 rounded-2xl"></div>
        <div class="h-4 bg-slate-200/80 rounded-md w-3/4"></div>
        <div class="h-3 bg-slate-100 rounded-md w-1/2"></div>
      </div>
    </div>

    <!-- Horizontal Scroll Carousel (Exact Round-Robin Layout as Blog Slug Article) -->
    <div
      v-else-if="relatedTournaments.length > 0"
      ref="relatedScrollRef"
      class="flex gap-4 sm:gap-5 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x snap-mandatory"
    >
      <NuxtLink
        v-for="item in relatedTournaments"
        :key="item.slug || item.id"
        :to="`/tournaments/${item.slug || item.id}`"
        class="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 snap-start"
      >
        <!-- Thumbnail Image (16:9) with Badge -->
        <div class="relative aspect-[16/9] overflow-hidden bg-slate-900">
          <img
            :src="item.image || '/hero-event.jpeg'"
            :alt="item.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent"></div>

          <!-- Country Badge (Top Left) -->
          <div v-if="item.country" class="absolute top-3 left-3">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-navy text-white text-[11px] sm:text-xs font-bold shadow-xs border border-white/10">
              <Icon :icon="getFlagIcon(item.country)" class="text-xs shrink-0" />
              <span>{{ toTitleCase(item.country) }}</span>
            </span>
          </div>

          <!-- Date on Image (Bottom Left) -->
          <div class="absolute bottom-2.5 left-3 right-3 flex items-center text-white text-xs font-semibold">
            <div class="flex items-center gap-1.5 drop-shadow-sm">
              <Icon icon="ph:calendar-blank-bold" class="text-primary text-xs shrink-0" />
              <span class="truncate">{{ item.date }}</span>
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <h4 class="text-sm sm:text-base font-bold text-navy line-clamp-2 leading-snug font-display group-hover:text-primary transition-colors">
              {{ toTitleCase(item.name) }}
            </h4>
            <div class="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
              <Icon icon="ph:map-pin" class="text-slate-400 text-xs shrink-0" />
              <span class="truncate">{{ toTitleCase(item.location) }}</span>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="flex items-center justify-between text-xs text-slate-400 font-medium pt-2.5 border-t border-slate-100">
            <span class="truncate max-w-[170px]">{{ item.organizer ? toTitleCase(item.organizer) : 'Tournament Host' }}</span>
            <span class="text-navy font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0">
              <span>{{ labels.details }}</span>
              <Icon icon="ph:arrow-right-bold" class="text-xs" />
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  currentSlug: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Indonesia'
  },
  lang: {
    type: String,
    default: 'en'
  }
})

const isLoading = ref(true)
const rawTournaments = ref([])
const relatedScrollRef = ref(null)

const i18n = {
  id: {
    title: 'Turnamen Terkait',
    desc: 'Jelajahi turnamen dan kompetisi panahan lainnya.',
    viewAll: 'Lihat Semua',
    details: 'Detail'
  },
  en: {
    title: 'Related Tournaments',
    desc: 'Discover more archery championships and archives.',
    viewAll: 'View All',
    details: 'Details'
  },
  it: {
    title: 'Tornei Correlati',
    desc: 'Scopri altri campionati ed eventi di tiro con l\'arco.',
    viewAll: 'Tutti i Tornei',
    details: 'Dettagli'
  }
}

const labels = computed(() => i18n[props.lang] || i18n.en)

const COUNTRY_FLAGS = {
  'indonesia': 'circle-flags:id',
  'ina': 'circle-flags:id',
  'malaysia': 'circle-flags:my',
  'mas': 'circle-flags:my',
  'singapore': 'circle-flags:sg',
  'sgp': 'circle-flags:sg',
  'thailand': 'circle-flags:th',
  'tha': 'circle-flags:th',
  'philippines': 'circle-flags:ph',
  'phi': 'circle-flags:ph',
  'france': 'circle-flags:fra',
  'italy': 'circle-flags:it',
  'turkey': 'circle-flags:tr',
  'united states': 'circle-flags:us',
  'usa': 'circle-flags:us',
  'spain': 'circle-flags:es',
  'korea': 'circle-flags:kr',
  'japan': 'circle-flags:jp',
  'great britain': 'circle-flags:gb'
}

function getFlagIcon(countryName) {
  if (!countryName) return 'circle-flags:id'
  const k = countryName.toLowerCase().trim()
  return COUNTRY_FLAGS[k] || 'ph:globe-hemisphere-west'
}

function toTitleCase(str) {
  if (!str) return ''
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

const scrollRelated = (direction) => {
  if (!relatedScrollRef.value) return
  const scrollAmount = 340
  if (direction === 'left') {
    relatedScrollRef.value.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
  } else {
    relatedScrollRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

onMounted(async () => {
  try {
    const api = useApi()
    const [extRes, intRes] = await Promise.all([
      api.get('/tournaments/external').catch(() => ({ tournaments: [] })),
      api.get('/tournaments').catch(() => ({ events: [] }))
    ])

    const externalList = extRes?.tournaments || []
    const internalList = intRes?.events || intRes?.data || (Array.isArray(intRes) ? intRes : [])

    const normalizedExt = externalList.map(item => ({
      id: item.uuid || item.id,
      slug: item.slug || item.id,
      name: item.name || 'Untitled Tournament',
      date: item.start_date ? formatDate(item.start_date) : (item.date || 'TBA'),
      location: item.venue || item.location || item.city || 'Location TBA',
      country: item.country || 'Malaysia',
      organizer: item.organizer_name || item.organizer || 'Host Organization',
      image: item.logo_url || item.banner_url || '/hero-event.jpeg'
    }))

    const normalizedInt = internalList.map(item => ({
      id: item.uuid || item.id,
      slug: item.slug || item.id,
      name: item.name || item.title || 'Untitled Tournament',
      date: item.start_date ? formatDate(item.start_date) : (item.date || 'TBA'),
      location: item.venue || item.location || 'Location TBA',
      country: item.country || 'Indonesia',
      organizer: item.organizer_name || item.organizer || 'Tournament Host',
      image: item.banner_url || item.logo_url || '/hero-event-detail.jpeg'
    }))

    rawTournaments.value = [...normalizedExt, ...normalizedInt]
  } catch (err) {
    console.warn('Failed to load related tournaments', err)
  } finally {
    isLoading.value = false
  }
})

// ── ROUND-ROBIN SELECTION OF 6 TOURNAMENTS (Same as Blog Slug) ──
const relatedTournaments = computed(() => {
  const list = rawTournaments.value || []
  if (list.length <= 1) return []

  const current = (props.currentSlug || '').toLowerCase()
  const currentIndex = list.findIndex(t => {
    const s = String(t.slug || t.id || '').toLowerCase()
    return s === current
  })

  const result = []
  const maxItems = 6

  if (currentIndex === -1) {
    // If current not found, return top 6
    return list.slice(0, maxItems)
  }

  // Round-robin selection starting after currentIndex
  for (let i = 1; i < list.length && result.length < maxItems; i++) {
    const nextItem = list[(currentIndex + i) % list.length]
    const nextSlug = String(nextItem.slug || nextItem.id || '').toLowerCase()
    if (nextSlug !== current && !result.some(r => (r.slug || r.id) === (nextItem.slug || nextItem.id))) {
      result.push(nextItem)
    }
  }

  return result
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
