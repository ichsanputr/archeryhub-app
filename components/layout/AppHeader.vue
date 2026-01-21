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

      <!-- Main Navigation (Visible only on Landing/Home context) -->
      <nav v-if="transparent || !isDashboard" class="hidden lg:flex items-center gap-6 xl:gap-8 ml-4">
        <NuxtLink to="/"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white']"
          class="font-medium text-sm transition-colors">Beranda</NuxtLink>
        <NuxtLink to="/events"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white']"
          class="font-medium text-sm transition-colors">Event</NuxtLink>
        <NuxtLink to="/clubs"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white']"
          class="font-medium text-sm transition-colors">Klub</NuxtLink>
        <NuxtLink to="/rankings"
          :class="[isScrolled || !transparent ? 'text-gray-600 hover:text-navy' : 'text-white/80 hover:text-white']"
          class="font-medium text-sm transition-colors">Peringkat</NuxtLink>
      </nav>

      <!-- Search Bar -->
      <div class="max-w-xs xl:max-w-md w-full hidden md:block">
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
      <!-- Add New Button (context-aware) -->
      <button v-if="showAddButton"
        class="hidden md:flex h-10 px-4 bg-primary hover:bg-yellow-400 text-background-dark rounded-lg text-sm font-bold items-center gap-2 transition-colors shadow-sm"
        @click="handleAdd">
        <Icon icon="ph:plus-bold" class="text-[18px]" />
        {{ addButtonText }}
      </button>

      <!-- Notifications -->
      <button :class="[
        isScrolled || !transparent
          ? 'bg-gray-100 dark:bg-surface-highlight text-gray-700 dark:text-white hover:bg-gray-200'
          : 'bg-white/10 text-white hover:bg-white/20'
      ]" class="size-10 flex items-center justify-center rounded-lg transition-colors relative">
        <Icon icon="ph:bell" class="text-[20px]" />
        <span v-if="notificationCount > 0"
          class="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white dark:border-surface-highlight"></span>
      </button>

      <!-- User Avatar/Profile -->
      <div
        class="size-10 rounded-full bg-cover bg-center border-2 border-gray-200 dark:border-surface-highlight cursor-pointer hover:border-primary transition-colors"
        :style="`background-image: url('${userAvatar}');`" @click="toggleUserMenu"></div>
    </div>
  </header>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const props = defineProps({
  transparent: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const { user } = useAuth()

const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const searchQuery = ref('')
const notificationCount = ref(3)
const userAvatar = computed(() => user.value?.avatar_url || '/avatar-default.svg')

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
      ? 'bg-white dark:bg-background-dark/95 border-b border-gray-200 dark:border-surface-highlight shadow-sm'
      : 'bg-transparent border-b border-white/10'
  }
  return 'bg-white dark:bg-background-dark/95 border-b border-gray-200 dark:border-surface-highlight shadow-sm'
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

const showAddButton = computed(() => {
  const addRoutes = ['/dashboard/athletes', '/dashboard/devices']
  return addRoutes.some(r => route.path.startsWith(r))
})

const addButtonText = computed(() => {
  if (route.path.startsWith('/dashboard/events')) return 'Event Baru'
  if (route.path.startsWith('/dashboard/athletes')) return 'Atlet Baru'
  if (route.path.startsWith('/dashboard/devices')) return 'Tambah Perangkat'
  return 'Tambah Baru'
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const showDeviceModal = useState('show-device-modal', () => false)

const handleAdd = () => {
  if (route.path.startsWith('/dashboard/events')) {
    router.push('/dashboard/events/create')
  } else if (route.path.startsWith('/dashboard/athletes')) {
    router.push('/dashboard/athletes/create')
  } else if (route.path.startsWith('/dashboard/devices')) {
    showDeviceModal.value = true
  }
}

const toggleMobileSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleUserMenu = () => {
  console.log('Toggle user menu')
}
</script>
