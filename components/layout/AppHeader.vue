<template>
  <header
    class="h-16 border-b border-gray-200 dark:border-surface-highlight bg-white dark:bg-background-dark/95 backdrop-blur px-4 md:px-8 flex items-center justify-between shrink-0 z-10 sticky top-0">
    <!-- Left Section -->
    <div class="flex items-center gap-4 md:gap-8 flex-1">
      <!-- Mobile Menu Button -->
      <div class="md:hidden text-gray-700 dark:text-white cursor-pointer" @click="toggleMobileSidebar">
        <span class="material-symbols-outlined">menu</span>
      </div>

      <!-- Page Title (from route meta or default) -->
      <div class="hidden md:block">
        <h2 class="text-gray-900 dark:text-white text-lg font-bold">{{ pageTitle }}</h2>
      </div>

      <!-- Search Bar -->
      <div class="max-w-md w-full hidden sm:block">
        <div
          class="flex w-full items-center rounded-lg bg-gray-100 dark:bg-surface-highlight h-10 px-3 transition-all focus-within:ring-2 focus-within:ring-primary/50">
          <span class="material-symbols-outlined text-brand-gold">search</span>
          <input v-model="searchQuery"
            class="w-full bg-transparent border-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-brand-gold text-sm focus:ring-0 ml-2 focus:outline-none"
            placeholder="Cari turnamen, atlet, event..." @keyup.enter="handleSearch" />
        </div>
      </div>
    </div>

    <!-- Right Section -->
    <div class="flex items-center gap-3 pl-4">
      <!-- Theme Toggle -->
      <button @click="toggleTheme"
        class="size-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-surface-highlight text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-surface-highlight/70 transition-colors"
        :title="isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'">
        <span v-if="isDark" class="material-symbols-outlined text-[20px]">light_mode</span>
        <span v-else class="material-symbols-outlined text-[20px]">dark_mode</span>
      </button>

      <!-- Add New Button (context-aware) -->
      <button v-if="showAddButton"
        class="hidden md:flex h-10 px-4 bg-primary hover:bg-yellow-400 text-background-dark rounded-lg text-sm font-bold items-center gap-2 transition-colors"
        @click="handleAdd">
        <span class="material-symbols-outlined text-[20px]">add</span>
        {{ addButtonText }}
      </button>

      <!-- Notifications -->
      <button
        class="size-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-surface-highlight text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-surface-highlight/70 transition-colors relative">
        <span class="material-symbols-outlined text-[20px]">notifications</span>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from '~/composables/useTheme'

const route = useRoute()
const router = useRouter()
const { isDark, toggleTheme } = useTheme()

const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const searchQuery = ref('')
const notificationCount = ref(3)
const userAvatar = ref('https://via.placeholder.com/40')

const pageTitle = computed(() => {
  // Get title from route meta or path
  if (route.meta.title) return route.meta.title

  const pathSegments = route.path.split('/').filter(Boolean)
  if (pathSegments.length === 0) return 'Dashboard'

  // Capitalize first segment
  return pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
})

const showAddButton = computed(() => {
  // Show add button on specific routes
  const addRoutes = ['/events', '/athletes', '/devices']
  return addRoutes.some(r => route.path.startsWith(r))
})

const addButtonText = computed(() => {
  if (route.path.startsWith('/events')) return 'Turnamen Baru'
  if (route.path.startsWith('/athletes')) return 'Atlet Baru'
  if (route.path.startsWith('/devices')) return 'Tambah Perangkat'
  return 'Tambah Baru'
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Searching for:', searchQuery.value)
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

const showDeviceModal = useState('show-device-modal', () => false)

const handleAdd = () => {
  if (route.path.startsWith('/events')) {
    router.push('/events/create')
  } else if (route.path.startsWith('/athletes')) {
    router.push('/athletes/create')
  } else if (route.path.startsWith('/devices')) {
    showDeviceModal.value = true
  }
}

const toggleMobileSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const toggleUserMenu = () => {
  // TODO: Implement user menu
  console.log('Toggle user menu')
}
</script>
