<template>
  <div>
    <!-- ── INTERACTIVE CONTROL PANEL (Hidden in pure canvas mode) ── -->
    <div v-if="!isPureCanvas" class="min-h-screen bg-slate-900 text-slate-100 font-body py-8 px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div class="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <Icon icon="ph:magic-wand-fill" class="text-base" />
            <span>Archeris Media Studio</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            Article 16:9 Thumbnail Generator & Template Studio
          </h1>
          <p class="text-slate-400 text-xs sm:text-sm mt-1">
            Generate clean, minimalist 16:9 thumbnails using public hero assets for World Archery and Archeris blog articles.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <NuxtLink to="/blog" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-colors flex items-center gap-2">
            <Icon icon="ph:arrow-left-bold" />
            <span>Back to Blog</span>
          </NuxtLink>
          <a :href="pureCanvasUrl" target="_blank" class="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-navy text-xs font-black transition-colors flex items-center gap-2 shadow-xs">
            <Icon icon="ph:crop-bold" />
            <span>Open Pure Canvas (1200x675)</span>
          </a>
        </div>
      </div>

      <!-- Controls Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- Left Sidebar: Settings -->
        <div class="lg:col-span-4 bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 border border-slate-700/80 space-y-5">
          <h2 class="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-700 pb-3">
            <Icon icon="ph:sliders-horizontal-bold" class="text-primary" />
            <span>Template Settings</span>
          </h2>

          <!-- Article Preset Dropdown -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">Preset Article</label>
            <select 
              v-model="selectedArticleSlug" 
              @change="onSelectArticle"
              class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-primary focus:outline-hidden"
            >
              <option value="custom">-- Custom Customization --</option>
              <option v-for="art in articleList" :key="art.slug" :value="art.slug">
                {{ art.title }}
              </option>
            </select>
          </div>

          <!-- Title Input -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">Article Title</label>
            <textarea 
              v-model="form.title" 
              rows="3"
              class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-primary focus:outline-hidden"
              placeholder="Enter article title..."
            ></textarea>
          </div>

          <!-- Excerpt / Subtitle -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">Short Subtitle / Excerpt</label>
            <textarea 
              v-model="form.excerpt" 
              rows="2"
              class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-primary focus:outline-hidden"
              placeholder="Short punchy summary..."
            ></textarea>
          </div>

          <!-- Category & Tag -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Category</label>
              <input 
                v-model="form.category" 
                type="text" 
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-primary focus:outline-hidden"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Read Time</label>
              <input 
                v-model="form.readTime" 
                type="text" 
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          <!-- Author & Date -->
          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Author Name</label>
              <input 
                v-model="form.authorName" 
                type="text" 
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-primary focus:outline-hidden"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-slate-300">Publication Date</label>
              <input 
                v-model="form.date" 
                type="text" 
                class="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-primary focus:outline-hidden"
              />
            </div>
          </div>

          <!-- Hero Background Selector -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-300">Hero Background Image</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                v-for="bg in backgroundOptions" 
                :key="bg.path"
                type="button"
                @click="form.backgroundImage = bg.path"
                :class="[
                  'relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer group',
                  form.backgroundImage === bg.path ? 'border-primary ring-2 ring-primary/30 scale-105' : 'border-slate-700 hover:border-slate-500'
                ]"
              >
                <img :src="bg.path" :alt="bg.label" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-navy/40 group-hover:bg-transparent transition-colors"></div>
                <div class="absolute bottom-1 inset-x-1 text-[9px] font-bold text-white text-center truncate bg-navy/80 px-1 rounded">
                  {{ bg.label }}
                </div>
              </button>
            </div>
          </div>

          <!-- Visual Presets -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-300">Gradient Overlay Theme</label>
            <div class="grid grid-cols-2 gap-2">
              <button 
                type="button"
                @click="form.theme = 'navy-depth'"
                :class="form.theme === 'navy-depth' ? 'bg-primary text-navy font-black' : 'bg-slate-900 text-slate-300 border border-slate-700'"
                class="px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Navy Depth (Classic)
              </button>
              <button 
                type="button"
                @click="form.theme = 'emerald-glow'"
                :class="form.theme === 'emerald-glow' ? 'bg-primary text-navy font-black' : 'bg-slate-900 text-slate-300 border border-slate-700'"
                class="px-3 py-2 rounded-xl text-xs font-bold transition-all"
              >
                Vibrant Lime Glow
              </button>
            </div>
          </div>

        </div>

        <!-- Right Side: Live 16:9 Canvas Preview -->
        <div class="lg:col-span-8 flex flex-col items-center justify-start space-y-4">
          
          <div class="w-full flex items-center justify-between px-2">
            <div class="text-xs font-bold text-slate-400 flex items-center gap-2">
              <Icon icon="ph:aspect-ratio-bold" class="text-primary" />
              <span>Canvas Aspect Ratio 16:9 (1200 x 675 px standard)</span>
            </div>
            <div class="text-xs text-slate-400">
              Auto-rendered with retina scaling
            </div>
          </div>

          <!-- Scaled View Container for Display -->
          <div class="w-full bg-slate-950 p-3 sm:p-6 rounded-3xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-2xl">
            <div class="w-full max-w-[900px] aspect-[16/9] relative shadow-2xl rounded-2xl overflow-hidden transform-gpu border border-white/10">
              
              <!-- THE 16:9 THUMBNAIL CANVAS (Component Embedded) -->
              <div id="thumbnail-canvas" class="w-full h-full relative overflow-hidden bg-navy select-none">
                
                <!-- Background Image Layer -->
                <img 
                  :src="form.backgroundImage || '/hero-berita.jpeg'" 
                  alt="Hero Background" 
                  class="absolute inset-0 w-full h-full object-cover scale-105"
                />

                <!-- Layered Vignette Overlays -->
                <div 
                  v-if="form.theme === 'navy-depth'" 
                  class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40"
                ></div>
                <div 
                  v-else 
                  class="absolute inset-0 bg-gradient-to-tr from-navy/95 via-navy/80 to-navy/30"
                ></div>
                
                <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>

                <!-- Content Container (Padding & Alignment) -->
                <div class="absolute inset-0 p-8 sm:p-10 md:p-12 flex flex-col justify-between z-10">
                  
                  <!-- Top Row: Brand & Category Badge -->
                  <div class="flex items-center justify-between">
                    <!-- Brand Logo & Title (Clean & Small, No Chip Background) -->
                    <div class="flex items-center gap-2 text-white">
                      <img src="/logo.png" alt="Archeris" class="size-5 object-contain" />
                      <span class="font-display font-bold text-xs tracking-wider text-slate-100">Archeris</span>
                    </div>

                    <!-- Category Chip -->
                    <div class="flex items-center gap-2">
                      <span class="px-3.5 py-1.5 rounded-xl bg-primary text-navy font-extrabold text-xs tracking-wide shadow-xs border border-primary">
                        {{ form.category || 'Archery Guide' }}
                      </span>
                    </div>
                  </div>

                  <!-- Middle Section: Article Title & Excerpt -->
                  <div class="space-y-3 my-auto max-w-2xl">
                    <!-- Small Kicker Topic -->
                    <div class="flex items-center gap-2 text-primary font-bold text-xs">
                      <Icon icon="ph:compass-bold" />
                      <span>Archery Guide & Technique</span>
                    </div>

                    <!-- Main Bold Title -->
                    <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-black text-white font-display leading-[1.2] tracking-tight drop-shadow-md line-clamp-3">
                      {{ form.title || 'How to Shoot a Bow: A Beginner\'s Guide to Archery Form' }}
                    </h2>

                    <!-- Excerpt / Subtitle -->
                    <p class="text-slate-200 text-xs sm:text-sm leading-relaxed line-clamp-2 max-w-xl font-normal opacity-90 drop-shadow-xs">
                      {{ form.excerpt || 'Mastering archery starts with a repeatable, relaxed shot process. Learn the 7 fundamental shooting steps.' }}
                    </p>
                  </div>

                  <!-- Bottom Row: Meta Information Bar -->
                  <div class="flex items-center justify-between pt-4 border-t border-white/10 text-slate-300">
                    
                    <!-- Author Info -->
                    <div class="flex items-center gap-2.5">
                      <div class="size-7 sm:size-8 rounded-full bg-slate-200 border border-white/30 flex items-center justify-center text-navy font-bold text-xs overflow-hidden shrink-0 shadow-xs">
                        <img v-if="form.authorAvatar" :src="form.authorAvatar" alt="Author" class="w-full h-full object-cover" />
                        <span v-else>{{ form.authorName ? form.authorName.charAt(0) : 'A' }}</span>
                      </div>
                      <div>
                        <div class="text-xs font-bold text-white leading-none">{{ form.authorName || 'Archeris Editorial Team' }}</div>
                        <div class="text-[10px] text-slate-400 font-medium mt-0.5">Archery Technical Specialist</div>
                      </div>
                    </div>

                    <!-- Read Time -->
                    <div class="flex items-center gap-3 text-xs font-semibold">
                      <div class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/10 text-slate-200">
                        <Icon icon="ph:clock-bold" class="text-primary text-xs" />
                        <span>{{ form.readTime || '6 min read' }}</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>
              
            </div>
          </div>

        </div>

      </div>

    </div>

    <!-- ── PURE CANVAS RENDER MODE (Exact 1200x675 for Puppeteer screenshot) ── -->
    <div v-else id="thumbnail-canvas" class="w-[1200px] h-[675px] relative overflow-hidden bg-navy select-none m-0 p-0 transform-none">
      
      <!-- Background Image Layer -->
      <img 
        :src="form.backgroundImage || '/hero-berita.jpeg'" 
        alt="Hero Background" 
        class="absolute inset-0 w-full h-full object-cover scale-105"
      />

      <!-- Layered Vignette Overlays -->
      <div 
        v-if="form.theme === 'navy-depth'" 
        class="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/40"
      ></div>
      <div 
        v-else 
        class="absolute inset-0 bg-gradient-to-tr from-navy/95 via-navy/80 to-navy/30"
      ></div>
      
      <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent"></div>

      <!-- Content Container (Padding & Alignment) -->
      <div class="absolute inset-0 p-16 flex flex-col justify-between z-10">
        
        <!-- Top Row: Brand & Category Badge -->
        <div class="flex items-center justify-between">
          <!-- Brand Logo & Title (Clean & Small, No Chip Background) -->
          <div class="flex items-center gap-2.5 text-white">
            <img src="/logo.png" alt="Archeris" class="h-6 w-6 object-contain" />
            <span class="font-display font-bold text-base tracking-wider text-slate-100">Archeris</span>
          </div>

          <!-- Category Chip -->
          <div class="flex items-center gap-2">
            <span class="px-5 py-2 rounded-2xl bg-primary text-navy font-black text-sm tracking-wide shadow-md border border-primary">
              {{ form.category || 'Archery Guide' }}
            </span>
          </div>
        </div>

        <!-- Middle Section: Article Title & Excerpt -->
        <div class="space-y-4 my-auto max-w-4xl">
          <!-- Small Kicker Topic -->
          <div class="flex items-center gap-2.5 text-primary font-extrabold text-sm tracking-wide">
            <Icon icon="ph:compass-bold" class="text-base" />
            <span>Archery Guide & Technique</span>
          </div>

          <!-- Main Bold Title -->
          <h2 class="text-5xl font-black text-white font-display leading-[1.18] tracking-tight drop-shadow-md line-clamp-3">
            {{ form.title || 'How to Shoot a Bow: A Beginner\'s Guide to Archery Form' }}
          </h2>

          <!-- Excerpt / Subtitle -->
          <p class="text-slate-200 text-lg leading-relaxed line-clamp-2 max-w-3xl font-normal opacity-90 drop-shadow-xs">
            {{ form.excerpt || 'Mastering archery starts with a repeatable, relaxed shot process. Learn the 7 fundamental shooting steps.' }}
          </p>
        </div>

        <!-- Bottom Row: Meta Information Bar -->
        <div class="flex items-center justify-between pt-6 border-t border-white/15 text-slate-300">
          
          <!-- Author Info -->
          <div class="flex items-center gap-3.5">
            <div class="size-11 rounded-full bg-slate-200 border-2 border-white/40 flex items-center justify-center text-navy font-bold text-sm overflow-hidden shrink-0 shadow-md">
              <img v-if="form.authorAvatar" :src="form.authorAvatar" alt="Author" class="w-full h-full object-cover" />
              <span v-else class="text-base font-black">{{ form.authorName ? form.authorName.charAt(0) : 'A' }}</span>
            </div>
            <div>
              <div class="text-sm font-black text-white leading-none">{{ form.authorName || 'Archeris Editorial Team' }}</div>
              <div class="text-xs text-slate-400 font-medium mt-1">Archery Technical Specialist</div>
            </div>
          </div>

          <!-- Read Time -->
          <div class="flex items-center gap-4 text-sm font-bold">
            <div class="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-slate-200">
              <Icon icon="ph:clock-bold" class="text-primary text-base" />
              <span>{{ form.readTime || '6 min read' }}</span>
            </div>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { articles } from '~/data/articles'

definePageMeta({
  layout: false
})

const route = useRoute()
const articleList = ref(articles || [])

const isPureCanvas = computed(() => {
  return route.query.render === 'canvas' || route.query.render === 'true'
})

const backgroundOptions = [
  { label: 'Hero Berita', path: '/hero-berita.jpeg' },
  { label: 'Hero Archer', path: '/hero-archer.jpeg' },
  { label: 'Event Detail', path: '/hero-event-detail.jpeg' },
  { label: 'Event General', path: '/hero-event.jpeg' },
  { label: 'Homepage Hero', path: '/hero-homepage.jpeg' },
  { label: 'Club General', path: '/hero-club.jpeg' },
]

const initialSlug = String(route.query.slug || 'how-to-shoot-a-bow-beginners-guide-to-archery-form')
const selectedArticleSlug = ref(initialSlug)

const getCategoryBg = (cat = '', slug = '') => {
  const c = String(cat).toLowerCase()
  const s = String(slug).toLowerCase()
  if (c.includes('shooting') || s.includes('form') || s.includes('shoot-a-bow')) {
    return '/hero-archer.jpeg'
  }
  if (c.includes('rule') || c.includes('scoring') || s.includes('scoring')) {
    return '/hero-berita.jpeg'
  }
  if (s.includes('bow-types') || s.includes('recurve-compound')) {
    return '/hero-club-detail-default.jpeg'
  }
  if (c.includes('equipment') || s.includes('anatomy')) {
    return '/hero-club.jpeg'
  }
  if (c.includes('tournament') || s.includes('tournament') || s.includes('bracket')) {
    return '/hero-event.jpeg'
  }
  if (c.includes('club')) {
    return '/hero-event-detail.jpeg'
  }
  return '/hero-homepage.jpeg'
}

const calculateReadTime = (article) => {
  if (!article) return '5 min read'
  if (article.content) {
    const words = article.content.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
    if (words > 0) return `${Math.max(1, Math.ceil(words / 200))} min read`
  }
  return `${article.read_time || 5} min read`
}

const getInitialData = () => {
  // 1. If query parameters explicitly provide title, use them directly
  if (route.query.title) {
    return {
      title: String(route.query.title),
      excerpt: String(route.query.excerpt || ''),
      category: String(route.query.category || 'Archery Guide'),
      readTime: String(route.query.readTime || '6 min read'),
      date: String(route.query.date || 'Sep 2026'),
      authorName: String(route.query.author || 'Archeris Editorial Team'),
      authorAvatar: '',
      backgroundImage: String(route.query.bg || '/hero-berita.jpeg'),
      theme: 'navy-depth'
    }
  }

  // 2. If query explicitly provides slug, look up article
  if (route.query.slug) {
    const found = articleList.value.find(a => a.slug === route.query.slug)
    if (found) {
      const bg = getCategoryBg(found.category, found.slug)
      return {
        title: found.title,
        excerpt: found.excerpt,
        category: found.category,
        readTime: calculateReadTime(found),
        date: found.date || 'Sep 2026',
        authorName: found.author?.name || 'Archeris Editorial Team',
        authorAvatar: found.author?.avatar || '',
        backgroundImage: route.query.bg || bg,
        theme: 'navy-depth'
      }
    }
  }

  // 3. Fallback to first article in list if available
  const fallbackArticle = articleList.value[0]
  if (fallbackArticle) {
    return {
      title: fallbackArticle.title,
      excerpt: fallbackArticle.excerpt,
      category: fallbackArticle.category,
      readTime: calculateReadTime(fallbackArticle),
      date: fallbackArticle.date || 'Sep 2026',
      authorName: fallbackArticle.author?.name || 'Archeris Editorial Team',
      authorAvatar: fallbackArticle.author?.avatar || '',
      backgroundImage: getCategoryBg(fallbackArticle.category, fallbackArticle.slug),
      theme: 'navy-depth'
    }
  }

  return {
    title: 'Understanding Bow Types: Differences Between Recurve, Compound, and Barebow',
    excerpt: 'Explore the key differences, pros, and cons between Olympic Recurve, modern Compound, and traditional Barebow.',
    category: 'Archery Equipment',
    readTime: '6 min read',
    date: 'Sep 2026',
    authorName: 'Archeris Editorial Team',
    authorAvatar: '',
    backgroundImage: '/hero-club-detail-default.jpeg',
    theme: 'navy-depth'
  }
}

const form = reactive(getInitialData())

const loadArticleData = (slug) => {
  const found = articleList.value.find(a => a.slug === slug)
  if (found) {
    form.title = found.title
    form.excerpt = found.excerpt
    form.category = found.category
    form.readTime = calculateReadTime(found)
    form.date = found.date || 'Sep 2026'
    form.authorName = found.author?.name || 'Archeris Editorial Team'
    form.authorAvatar = found.author?.avatar || ''
    form.backgroundImage = getCategoryBg(found.category, found.slug)
  }
}

const onSelectArticle = () => {
  if (selectedArticleSlug.value !== 'custom') {
    loadArticleData(selectedArticleSlug.value)
  }
}

const pureCanvasUrl = computed(() => {
  const params = new URLSearchParams()
  params.set('render', 'canvas')
  if (selectedArticleSlug.value && selectedArticleSlug.value !== 'custom') {
    params.set('slug', selectedArticleSlug.value)
  } else {
    params.set('title', form.title)
    params.set('category', form.category)
    params.set('bg', form.backgroundImage)
    params.set('readTime', form.readTime)
  }
  return `/tools/thumbnail-generator?${params.toString()}`
})
</script>
