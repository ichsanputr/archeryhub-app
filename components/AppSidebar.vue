<template>
  <aside 
    class="w-64 bg-surface-dark border-r border-surface-highlight flex flex-col fixed md:static inset-y-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 shrink-0"
    :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- Logo/Brand -->
    <div class="p-6 flex items-center gap-3">
      <div class="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
        <span class="material-symbols-outlined" style="font-size: 24px;">adjust</span>
      </div>
      <div>
        <h1 class="text-white text-base font-bold leading-none">Archery Hub</h1>
        <p class="text-primary/80 text-xs font-medium mt-1">Command Center</p>
      </div>
      <button class="md:hidden ml-auto text-gray-400" @click="isSidebarOpen = false">
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <!-- Navigation Links -->
    <nav class="flex-1 px-4 py-4 flex flex-col gap-2 overflow-y-auto">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.path"
        :to="link.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
        :class="isActive(link.path) 
          ? 'bg-surface-highlight text-white' 
          : 'text-gray-400 hover:bg-surface-highlight/50 hover:text-white'"
      >
        <span class="material-symbols-outlined" :class="isActive(link.path) ? 'text-primary' : ''">
          {{ link.icon }}
        </span>
        <span class="text-sm font-medium">{{ link.label }}</span>
        <span v-if="link.badge" class="ml-auto bg-primary text-background-dark text-xs font-bold px-2 py-0.5 rounded-full">
          {{ link.badge }}
        </span>
      </NuxtLink>
    </nav>

    <!-- User Section / Logout -->
    <div class="p-4 border-t border-surface-highlight">
      <button 
        class="flex w-full items-center gap-2 justify-center rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold hover:bg-yellow-400 transition-colors"
        @click="handleLogout"
      >
        <span class="material-symbols-outlined text-[20px]">logout</span>
        <span>Log Out</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isSidebarOpen = useState('mobile-sidebar-open', () => false)

// Close sidebar on route change
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

const navLinks = [
  { path: '/', icon: 'dashboard', label: 'Dashboard' },
  { path: '/tournaments', icon: 'target', label: 'Tournaments' },
  { path: '/athletes', icon: 'groups', label: 'Athletes' },
  { path: '/live', icon: 'live_tv', label: 'Live Results', badge: '' },
  { path: '/reports', icon: 'assessment', label: 'Reports' },
  { path: '/devices', icon: 'devices', label: 'Devices' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  // TODO: Implement logout logic
  console.log('Logging out...')
  router.push('/auth/login')
}
</script>

<style scoped>
/* Custom scrollbar for nav */
nav::-webkit-scrollbar {
  width: 4px;
}

nav::-webkit-scrollbar-thumb {
  @apply bg-brand-border rounded;
}
</style>
