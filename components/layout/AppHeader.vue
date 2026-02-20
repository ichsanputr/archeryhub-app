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
          <img v-if="user?.role === 'organization' || user?.role === 'club'"
            :src="useImageOrDefault(user.logo_url || user.avatar_url, user?.name || user?.full_name || 'Org')"
            :alt="user?.name || user?.full_name || 'Organization'" class="w-full h-full object-cover" />
          <img v-else src="/logo.png" alt="ArcheryHub" class="w-full h-full object-contain" />
        </div>
        <span v-if="user?.role === 'organization' || user?.role === 'club'"
          class="text-sm font-black text-header-text truncate max-w-[120px]">
          {{ getFirstWord(user?.full_name || user?.name || 'Dashboard') }}
        </span>
        <span v-else class="text-sm font-black text-header-text">
          ArcheryHub
        </span>
      </div>

      <!-- Main Navigation (Visible only on Landing/Home context) -->
      <nav v-if="transparent || !isDashboard" class="hidden lg:flex items-center gap-6 xl:gap-8 ml-4">
        <NuxtLink to="/"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white', { 'bg-primary text-black font-bold': route.path === '/' }]"
          class="font-black text-sm transition-colors px-3 py-1.5 rounded-lg">Beranda</NuxtLink>
        <NuxtLink to="/events"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white', { 'bg-primary text-black font-bold': route.path.startsWith('/events') }]"
          class="font-black text-sm transition-colors px-3 py-1.5 rounded-lg">Event</NuxtLink>
        <NuxtLink to="/clubs"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white', { 'bg-primary text-black font-bold': route.path.startsWith('/clubs') }]"
          class="font-black text-sm transition-colors px-3 py-1.5 rounded-lg">Klub</NuxtLink>
        <NuxtLink to="/news"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white', { 'bg-primary text-black font-bold': route.path.startsWith('/news') }]"
          class="font-black text-sm transition-colors px-3 py-1.5 rounded-lg">Berita</NuxtLink>
      </nav>

      <!-- Event Manage Mode (For Orgs/Admins) -->
      <div v-if="isEventManageMode && user?.role !== 'club'" class="hidden md:flex items-center gap-4 flex-1">
        <NuxtLink to="/dashboard/events"
          class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-navy shrink-0">
          <Icon icon="ph:arrow-left" class="text-xl" />
          <span class="text-sm font-bold">Kembali ke Dashboard</span>
        </NuxtLink>
        <div class="h-6 w-px bg-gray-200"></div>
        <h1 class="text-lg font-black text-header-text truncate">
          {{ eventTitle || 'Event Management' }}
        </h1>
      </div>

      <!-- Dashboard Context: Club Name replaced Search -->
      <div v-if="isDashboard && user?.role === 'club' && !isEventManageMode" class="hidden md:flex items-center gap-3">
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-sm duration-300">
            <img :src="useImageOrDefault(user.logo_url || user.avatar_url, user?.full_name || 'Club')"
              :alt="user?.full_name || 'Club'" class="w-full h-full object-cover" />
          </div>
          <h2 class="text-lg font-black text-header-text truncate max-w-sm tracking-tight">
            {{ user?.full_name || user?.name || 'Klub Panahan' }}
          </h2>
        </div>
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
            {{ user?.full_name || 'Organisasi' }}
          </h2>
        </div>
      </div>

      <!-- Dashboard Title (only for non-clubs/orgs in general dashboard mode) -->
      <div v-else-if="isDashboard && user?.role !== 'club' && user?.role !== 'organization' && !isEventManageMode"
        class="hidden md:flex items-center gap-3 mr-4">
        <h1 class="text-lg font-black text-header-text whitespace-nowrap">
          {{ dashboardTitle }}
        </h1>
      </div>

      <!-- Search Bar (hidden in event manage mode and for clubs) -->
      <div v-else-if="!isEventManageMode && user?.role !== 'club'" class="max-w-xs xl:max-w-md w-full hidden md:block">
        <div :class="[
          isScrolled || !transparent
            ? 'bg-gray-100 dark:bg-surface-highlight border-transparent'
            : 'bg-white/10 border-white/20 backdrop-blur-md'
        ]"
          class="flex w-full items-center rounded-lg border h-10 px-3 transition-all focus-within:ring-2 focus-within:ring-primary/50">
          <Icon icon="ph:magnifying-glass" class="text-lg" />
          <input v-model="searchQuery" :class="[
            isScrolled || !transparent
              ? 'text-gray-900 dark:text-white placeholder-gray-500'
              : 'text-white placeholder-white/60'
          ]" class="w-full bg-transparent border-none text-sm focus:ring-0 ml-2 focus:outline-none"
            placeholder="Cari..." @keyup.enter="handleSearch" />
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-3 pl-4">
      <!-- Notifications -->
      <div ref="notificationRef" class="relative">
        <button @click="showNotifications = !showNotifications" :class="[
          isScrolled || !transparent
            ? 'bg-gray-100 dark:bg-surface-highlight text-gray-700 dark:text-white hover:bg-gray-200'
            : 'bg-white/10 text-white hover:bg-white/20'
        ]" class="size-10 flex items-center justify-center rounded-lg transition-colors relative group">
          <Icon icon="ph:bell" class="text-[20px] transition-transform" />
          <span v-if="notifications.some(n => !n.read)"
            class="absolute top-2 right-2 size-2.5 bg-primary rounded-full border border-white dark:border-surface-highlight"></span>
        </button>

        <!-- Notification Dropdown -->
        <transition enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0">
          <NotificationList v-if="showNotifications" :notifications="notifications" @close="showNotifications = false"
            @mark-all-read="notifications.forEach(n => n.read = true)" class="absolute right-0 mt-2 z-[100]" />
        </transition>
      </div>

    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import NotificationList from './NotificationList.vue'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useEventContext } from '~/composables/useEventContext'
import { onClickOutside } from '@vueuse/core'
import { useImageOrDefault } from '~/composables/useImageHelper'

const config = useRuntimeConfig()

const props = defineProps({
  transparent: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const { user } = useAuth()
const { isEventMode, eventTitle } = useEventContext()

const isEventManageMode = computed(() => {
  // Check if we're on any event management page (overview, targets, qualification, elimination, etc.)
  const path = route.path
  if (!path.includes('/dashboard/events/')) return false
  const eventPathMatch = path.match(/\/dashboard\/events\/([^/]+)\/(.+)/)
  if (!eventPathMatch) return false
  const [, eventId, subPath] = eventPathMatch
  // Exclude certain paths that are not management pages
  const excludedPaths = ['edit', 'checkout', 'register', 'register-edit', 'setup']
  return !excludedPaths.includes(subPath)
})

const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const searchQuery = ref('')
const showNotifications = ref(false)
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
