<template>
  <header :class="[
    navClasses,
    'h-16 px-4 md:px-8 flex items-center justify-between shrink-0 z-50 sticky top-0 transition-all duration-300'
  ]">
    <!-- Left Section -->
    <div class="flex items-center gap-4 md:gap-8 flex-1">
      <!-- Mobile Menu Button -->
      <div :class="[isScrolled || !transparent ? 'text-gray-700 dark:text-white' : 'text-white']"
        class="lg:hidden cursor-pointer" @click="toggleMobileSidebar">
        <Icon icon="ph:list" class="text-2xl" />
      </div>

      <!-- Mobile Logo/Branding (Centered between hamburger and notification) -->
      <div v-if="isDashboard" class="lg:hidden flex items-center gap-2 mx-auto">
        <div class="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow-sm">
          <img v-if="user?.role === 'organization'"
            :src="useImageOrDefault(user.logo_url || user.avatar_url, user?.name || user?.full_name || 'Org')"
            :alt="user?.name || user?.full_name || 'Organization'" class="w-full h-full object-cover" />
          <img v-else src="/logo.png" alt="Archeris" class="w-full h-full object-contain" />
        </div>
        <span v-if="user?.role === 'organization'" class="text-sm font-black text-header-text truncate max-w-[120px]">
          {{ getFirstWord(user?.full_name || user?.name || 'Dashboard') }}
        </span>
        <span v-else class="text-sm font-black text-header-text">
          Archeris
        </span>
      </div>

      <!-- Main Navigation (Visible only on Landing/Home context) -->
      <nav v-if="transparent || !isDashboard" class="hidden lg:flex items-center gap-6 xl:gap-8 ml-4">
        <NuxtLink to="/"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white', { 'bg-primary text-primary-text font-bold': route.path === '/' }]"
          class="font-black text-sm transition-colors px-3 py-1.5 rounded-lg">{{ t('nav.home') }}</NuxtLink>
        <NuxtLink to="/events"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white', { 'bg-primary text-primary-text font-bold': route.path.startsWith('/events') }]"
          class="font-black text-sm transition-colors px-3 py-1.5 rounded-lg">{{ t('nav.features') }}</NuxtLink>

        <NuxtLink to="/news"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white', { 'bg-primary text-primary-text font-bold': route.path.startsWith('/news') }]"
          class="font-black text-sm transition-colors px-3 py-1.5 rounded-lg">{{ t('nav.news') }}</NuxtLink>
      </nav>

      <!-- Event Manage Mode (For All Personas) -->
      <div v-if="isEventManageMode" class="hidden md:flex items-center gap-4 flex-1">
        <NuxtLink :to="backToDashboardPath"
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-navy shrink-0">
          <Icon icon="ph:arrow-left" class="text-xl" />
          <span class="text-sm font-bold">{{ t('dashboard.header.back_to_dashboard') }}</span>
        </NuxtLink>
        <div class="h-6 w-px bg-gray-200"></div>
        <h1 class="text-lg font-black text-header-text truncate">
          {{ eventTitle || 'Event Management' }}
        </h1>
      </div>



      <!-- Dashboard Context: Organization Name -->
      <div v-else-if="isDashboard && user?.role === 'organization' && !isEventManageMode"
        class="hidden md:flex items-center gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm duration-300">
            <img :src="useImageOrDefault(user.logo_url || user.avatar_url, user?.name || 'Organization')"
              :alt="user?.name || 'Organization'" class="w-full h-full object-cover" />
          </div>
          <h2 class="text-lg font-black text-header-text truncate max-w-sm tracking-tight">
            {{ user?.full_name || t('dashboard.sidebar.roles.organization') }}
          </h2>
        </div>
      </div>

      <!-- Dashboard Title (only for non-orgs in general dashboard mode) -->
      <div v-else-if="isDashboard && user?.role !== 'organization' && !isEventManageMode"
        class="hidden md:flex items-center gap-3 mr-4">
        <h1 class="text-lg font-black text-header-text whitespace-nowrap">
          {{ dashboardTitle }}
        </h1>
      </div>

    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-3 pl-4">
      <!-- Language Switcher -->
      <div class="relative mr-1" @mouseenter="showLangMenu = true" @mouseleave="showLangMenu = false">
        <button
          class="flex items-center gap-2 px-3 h-9 rounded-xl bg-gray-100 dark:bg-white/5 border border-transparent dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-300 text-xs font-bold tracking-widest text-gray-700 dark:text-slate-300">
          <Icon :icon="langFlags[locale] || 'ph:globe-bold'"
            class="text-lg rounded-full overflow-hidden border border-gray-200 dark:border-white/10 shrink-0" />
          <span class="uppercase">{{ locale }}</span>
        </button>

        <Transition enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
          <div v-if="showLangMenu" class="absolute right-0 top-full pt-2 w-40 z-[99]">
            <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden py-2">
              <button v-for="loc in locales" :key="loc.code" @click="setLocale(loc.code)"
                class="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold transition-colors hover:bg-gray-50 dark:hover:bg-slate-800"
                :class="locale === loc.code ? 'text-primary' : 'text-gray-700 dark:text-slate-300'">
                <Icon :icon="langFlags[loc.code] || 'ph:globe-bold'"
                  class="text-base rounded-full overflow-hidden border border-gray-100 dark:border-slate-800" />
                <span class="flex-1 text-left">{{ loc.name }}</span>
                <Icon v-if="locale === loc.code" icon="ph:check-bold" />
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Search Button -->
      <button @click="searchDialog?.open()" :class="[
        isScrolled || !transparent
          ? 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-navy'
          : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/20'
      ]" class="hidden sm:flex items-center gap-2 rounded-xl px-3 h-9 text-sm transition-all"
        :title="`${t('dashboard.header.search_pages')} (Ctrl+K)`">
        <Icon icon="ph:magnifying-glass-bold" class="text-base" />
        <span class="hidden md:inline text-xs font-medium">{{ t('dashboard.header.search_pages') }}</span>
        <kbd
          :class="isScrolled || !transparent ? 'bg-white border-gray-200 text-gray-400' : 'bg-white/10 border-white/20 text-white/50'"
          class="hidden lg:inline-flex items-center px-1.5 py-0.5 border rounded text-xs font-mono ml-1">Ctrl K</kbd>
      </button>
      <!-- Mobile search icon -->
      <button @click="searchDialog?.open()"
        :class="isScrolled || !transparent ? 'text-gray-500 hover:text-navy' : 'text-white/70 hover:text-white'"
        class="sm:hidden p-2 rounded-xl transition-colors" :title="t('dashboard.header.search_pages')">
        <Icon icon="ph:magnifying-glass-bold" class="text-xl" />
      </button>
    </div>

    <!-- Docs Search Dialog -->
    <DocSearchDialog ref="searchDialog" />
  </header>
</template>

<script setup>
import NotificationList from './NotificationList.vue'
import DocSearchDialog from './DocSearchDialog.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useEventContext } from '~/composables/useEventContext'
import { onClickOutside } from '@vueuse/core'
import { useImageOrDefault } from '~/composables/useImageHelper'

const config = useRuntimeConfig()

const { locale, locales, setLocale, t } = useI18n()
const showLangMenu = ref(false)
const langFlags = {
  en: 'circle-flags:us',
  id: 'circle-flags:id',
  kr: 'circle-flags:kr'
}

const props = defineProps({
  transparent: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const { user, userPersona } = useAuth()
const { isEventMode, eventTitle } = useEventContext()

const isEventManageMode = computed(() => {
  // Check if we're on any event management page
  const path = route.path
  // Match both legacy /dashboard/events/ and new /dashboard/[persona]/events/
  const eventPathMatch = path.match(/\/dashboard\/(?:archer|club|organization|seller|events)\/events\/([^/]+)\/(.+)/) ||
    path.match(/\/dashboard\/events\/([^/]+)\/(.+)/)

  if (!eventPathMatch) return false

  const subPaths = eventPathMatch[2].split('/')
  const subPath = subPaths[0]

  // Exclude certain paths that are not management pages
  const excludedPaths = ['edit', 'checkout', 'register', 'register-edit', 'setup']
  return !excludedPaths.includes(subPath)
})



const backToDashboardPath = computed(() => {
  return `/dashboard/${userPersona.value}/events`
})

const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const searchQuery = ref('')
const showNotifications = ref(false)
const searchDialog = ref(null)
const notifications = ref([
  { id: 1, type: 'info', title: 'Selamat Datang!', message: 'Selamat bergabung di Archery Hub. Lengkapi profil klub Anda sekarang.', time: '2 MENIT LALU', read: false },
  { id: 2, type: 'success', title: 'Profil Diperbarui', message: 'Informasi klub Anda telah berhasil diperbarui.', time: '1 JAM LALU', read: true },
  { id: 3, type: 'warning', title: 'Keanggotaan Baru', message: 'Ada 5 permintaan join klub baru yang menunggu persetujuan.', time: '3 JAM LALU', read: false }
])
const userAvatar = computed(() => useImageOrDefault(user.value?.avatar_url))

// Notification panel ref for click outside
const notificationRef = ref(null)
onClickOutside(notificationRef, () => {
  if (showNotifications.value) {
    showNotifications.value = false
  }
})

// Scroll state for transparency transition
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  if (props.transparent) {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navClasses = computed(() => {
  if (props.transparent) {
    return isScrolled.value
      ? 'bg-header-bg dark:bg-background-dark/95 border-b border-gray-200 dark:border-surface-highlight shadow-sm'
      : 'bg-transparent border-b border-white/10'
  }
  return 'bg-header-bg dark:bg-background-dark/95 border-b border-gray-200 dark:border-surface-highlight shadow-sm'
})

const isDashboard = computed(() => {
  return route.path.startsWith('/dashboard')
})

const pageTitle = computed(() => {
  if (route.meta.title) return route.meta.title
  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length === 0) return ''
  // If it's the second segment of dashboard (e.g. /dashboard/events)
  if (pathSegments[0] === 'dashboard' && pathSegments[1]) {
    return pathSegments[1].charAt(0).toUpperCase() + pathSegments[1].slice(1)
  }
  return pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
})

const dashboardTitle = computed(() => {
  // If in event mode, show event title
  if (isEventMode.value && eventTitle.value) {
    return eventTitle.value
  }
  // Otherwise show "Dashboard"
  return 'Dashboard'
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const showDeviceModal = useState('show-device-modal', () => false)

const toggleMobileSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleUserMenu = () => {
  console.log('Toggle user menu')
}

const getImageUrl = (url) => {
  // Backend now provides full URLs, so just return as-is
  if (!url) return ''
  return url
}

const getFirstWord = (text) => {
  if (!text) return ''
  return text.split(' ')[0]
}
</script>
