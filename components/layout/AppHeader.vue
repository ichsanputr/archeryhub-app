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
          <img v-if="user?.role === 'organizer'"
            :src="useImageOrDefault(user.logo_url || user.avatar_url, user?.name || user?.full_name || 'Org')"
            :alt="user?.name || user?.full_name || 'Organizer'" class="w-full h-full object-cover" />
          <img v-else src="/logo.png" alt="Archeris" class="w-full h-full object-contain" />
        </div>
        <span v-if="user?.role === 'organizer'" class="text-sm font-black text-header-text truncate max-w-[120px]">
          {{ getFirstWord(user?.full_name || user?.name || 'Dashboard') }}
        </span>
        <span v-else class="text-sm font-black text-header-text">
          Archeris
        </span>
      </div>

      <!-- Main Navigation (Visible only on Landing/Home context) -->
      <nav v-if="transparent || !isDashboard" class="hidden lg:flex items-center gap-6 xl:gap-8 ml-4 h-full">
        <NuxtLink to="/"
          :class="[
            isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white',
            route.path === '/' ? (isScrolled || !transparent ? '!text-navy font-bold !border-primary' : '!text-white font-bold !border-primary') : ''
          ]"
          class="font-black text-sm transition-all h-full flex items-center px-1 border-b-2 border-transparent hover:border-primary">
          {{ t('nav.home') }}
        </NuxtLink>
        <NuxtLink to="/tournaments"
          :class="[
            isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white',
            route.path.startsWith('/tournaments') ? (isScrolled || !transparent ? '!text-navy font-bold !border-primary' : '!text-white font-bold !border-primary') : ''
          ]"
          class="font-black text-sm transition-all h-full flex items-center px-1 border-b-2 border-transparent hover:border-primary">
          {{ t('nav.features') }}
        </NuxtLink>
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
          {{ eventTitle || fetchedEventName || t('dashboard.header.event_management', 'Event') }}
        </h1>
      </div>



      <!-- Dashboard Context: Organizer Name -->
      <div v-else-if="isDashboard && user?.role === 'organizer' && !isEventManageMode"
        class="hidden md:flex items-center gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm duration-300">
            <img :src="useImageOrDefault(user.logo_url || user.avatar_url, user?.name || 'Organizer')"
              :alt="user?.name || 'Organizer'" class="w-full h-full object-cover" />
          </div>
          <h2 class="text-lg font-black text-header-text truncate max-w-sm tracking-tight">
            {{ user?.full_name || t('dashboard.sidebar.roles.organizer') }}
          </h2>
        </div>
      </div>

      <!-- Dashboard Title (only for non-orgs in general dashboard mode) -->
      <div v-else-if="isDashboard && user?.role !== 'organizer' && !isEventManageMode"
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
          <span class="capitalize font-black tracking-wider">{{ (locale || 'ID').toUpperCase() }}</span>
        </button>

        <Transition enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
          <div v-if="showLangMenu" class="absolute right-0 top-full pt-2 w-40 z-[99]">
            <div class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden py-2">
              <button v-for="loc in locales" :key="loc.code" @click="changeDashboardLocale(loc.code)"
                class="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold transition-all"
                :class="locale === loc.code ? 'bg-navy text-white' : 'text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800'">
                <Icon :icon="langFlags[loc.code] || 'ph:globe-bold'"
                  class="text-base rounded-full overflow-hidden border border-gray-100 dark:border-slate-800" />
                <span class="flex-1 text-left">{{ loc.name }}</span>
                <Icon v-if="locale === loc.code" icon="ph:check-bold" class="text-primary text-xs shrink-0" />
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Notification Bell -->
      <div v-if="user" ref="notificationRef" class="relative">
        <!-- Invisible Backdrop for instant, reliable click-outside on all devices -->
        <div v-if="showNotifications" class="fixed inset-0 z-40 bg-transparent" @click.stop="showNotifications = false" />

        <button @click.stop="toggleNotifications" :class="[
          isScrolled || !transparent
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-navy dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
            : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white border border-white/20'
        ]" class="relative z-50 flex items-center justify-center h-9 w-9 rounded-xl transition-all cursor-pointer"
          :title="t('notifications.title', 'Notifikasi')">
          <Icon icon="ph:bell-bold" class="text-lg" />
          <span v-if="unreadCount > 0"
            class="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </button>

        <!-- Dropdown Component -->
        <Transition enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 translate-y-2 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-2 scale-95">
          <NotificationList v-if="showNotifications" :notifications="notifications" :unread-count="unreadCount"
            class="z-50"
            @close="showNotifications = false" @mark-all-read="handleMarkAllRead" @mark-read="markAsRead" @delete="deleteNotification" @click="handleNotificationSelect" />
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
import { ref, computed, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'
const NotificationList = defineAsyncComponent(() => import('./NotificationList.vue'))
const DocSearchDialog = defineAsyncComponent(() => import('./DocSearchDialog.vue'))
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useTournamentContext } from '~/composables/useTournamentContext'
import { onClickOutside } from '@vueuse/core'
import { useImageOrDefault } from '~/composables/useImageHelper'

const config = useRuntimeConfig()

const { locale, locales, setLocaleCookie, loadLocaleMessages, t } = useI18n()
const showLangMenu = ref(false)
const langFlags = {
  en: 'circle-flags:us',
  id: 'circle-flags:id'
}

const changeDashboardLocale = async (code) => {
  await loadLocaleMessages(code)
  locale.value = code
  if (process.client) {
    try {
      localStorage.setItem('dashboard_locale', code)
    } catch (e) {}
  }
  setLocaleCookie(code)
  showLangMenu.value = false
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
const { isTournamentMode: isEventMode, tournamentTitle: eventTitle } = useTournamentContext()

const isEventManageMode = computed(() => {
  // Check if we're on any event management page
  const path = route.path
  // Match both legacy /events/ and new /tournaments/
  const eventPathMatch = path.match(/\/dashboard\/(?:archer|club|organizer|events)\/(?:tournaments|events)\/([^/]+)\/(.+)/) ||
    path.match(/\/dashboard\/(?:tournaments|events)\/([^/]+)\/(.+)/)

  if (!eventPathMatch) return false

  const subPaths = eventPathMatch[2].split('/')
  const subPath = subPaths[0]

  // Exclude certain paths that are not management pages
  const excludedPaths = ['edit', 'checkout', 'register', 'register-edit', 'setup']
  return !excludedPaths.includes(subPath)
})

const { get } = useApi()
const { setTournament: setEvent, currentTournament: currentEvent } = useTournamentContext()
const fetchedEventName = ref('')

const currentEventId = computed(() => {
  const path = route.path
  const eventPathMatch = path.match(/\/dashboard\/(?:archer|club|organizer|events)\/(?:tournaments|events)\/([^/]+)/) ||
    path.match(/\/dashboard\/(?:tournaments|events)\/([^/]+)/)
  return eventPathMatch ? eventPathMatch[1] : (route.params.id || '')
})

const loadEventName = async (id) => {
  if (!id) {
    fetchedEventName.value = ''
    return
  }
  try {
    const res = await get(`/tournaments/${id}`)
    const data = res?.event || res?.data || res
    if (data?.name) {
      fetchedEventName.value = data.name
      setEvent({ id, name: data.name })
    }
  } catch (e) {
    console.error('Failed to load event header name:', e)
  }
}

watch(currentEventId, (id) => {
  if (id && (!eventTitle.value || currentEvent.value?.id !== id)) {
    loadEventName(id)
  }
}, { immediate: true })

const backToDashboardPath = computed(() => {
  return `/dashboard/${userPersona.value}/tournaments`
})

const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const searchQuery = ref('')
const showNotifications = ref(false)
const searchDialog = ref(null)

const {
  notifications,
  unreadCount,
  fetchNotifications,
  fetchUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  startPolling,
  stopPolling
} = useNotifications()

const toggleNotifications = (event) => {
  if (event) {
    event.stopPropagation()
  }
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    fetchNotifications({ limit: 10 })
  }
}

const handleMarkAllRead = async () => {
  await markAllAsRead()
}

const handleNotificationSelect = async (note) => {
  if (!note.is_read) {
    await markAsRead(note.id)
  }
  if (note.link) {
    router.push(note.link)
  }
}

// Close notifications on route change
watch(() => route.path, () => {
  showNotifications.value = false
})

// Notification panel ref for click outside
const notificationRef = ref(null)
onClickOutside(notificationRef, () => {
  if (showNotifications.value) {
    showNotifications.value = false
  }
}, { capture: true })

const handleDocumentClickOutside = (event) => {
  if (showNotifications.value && notificationRef.value) {
    if (!notificationRef.value.contains(event.target)) {
      showNotifications.value = false
    }
  }
}

const handleKeyDown = (event) => {
  if (event.key === 'Escape' && showNotifications.value) {
    showNotifications.value = false
  }
}

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
  if (user.value) {
    fetchUnreadCount()
    startPolling(45000)
  }
  window.addEventListener('click', handleDocumentClickOutside, true)
  window.addEventListener('pointerdown', handleDocumentClickOutside, true)
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleDocumentClickOutside, true)
  window.removeEventListener('pointerdown', handleDocumentClickOutside, true)
  window.removeEventListener('keydown', handleKeyDown)
  stopPolling()
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
