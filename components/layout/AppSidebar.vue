<template>
  <aside
    class="w-64 bg-navy flex flex-col fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 md:translate-x-0 shrink-0 border-r border-white/10 shadow-xl"
    :class="[
      isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
    ]">

    <!-- Logo/Brand -->
    <div class="h-16 flex items-center gap-3 px-6 border-b border-white/10 shrink-0">
      <div class="flex items-center gap-3 overflow-hidden">
        <img src="/logo.png" alt="Archeryhub.id Logo" class="h-8 w-8 object-contain shrink-0" />
        <span v-if="!isSidebarCollapsed"
          class="text-lg font-black tracking-tight whitespace-nowrap text-white">Archeryhub.id</span>
      </div>
      <button class="md:hidden ml-auto text-gray-400 p-1 hover:text-white" @click="isSidebarOpen = false">
        <Icon icon="ph:x" class="text-xl" />
      </button>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar p-4">

      <!-- Main Navigation (Menu Utama) - Always visible -->
      <div v-if="!isSidebarCollapsed" class="px-3 mb-2">
        <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Menu Utama</p>
      </div>
      <NuxtLink v-for="item in navLinks" :key="item.path" :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group" :class="isActive(item.path)
          ? 'bg-primary text-navy shadow-lg shadow-primary/20'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'">
        <Icon :icon="item.icon.includes(':') ? item.icon : `ph:${item.icon}`" class="text-xl transition-transform"
          :class="isActive(item.path) ? 'text-navy' : 'group-hover:scale-110'" />
        <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ item.label }}</span>
        <span v-if="item.badge && !isSidebarCollapsed"
          class="ml-auto bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
          {{ item.badge }}
        </span>
      </NuxtLink>

      <!-- Dynamic Event Navigation (Manajemen Event) - Only when in event scope -->
      <div v-if="eventId" class="flex flex-col gap-1 mt-4">
        <div class="h-px bg-white/10 mb-2 mx-3"></div>
        <div v-if="!isSidebarCollapsed" class="px-3 mb-2">
          <p class="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Manajemen Event</p>
        </div>
        <NuxtLink v-for="item in eventLinks" :key="item.path" :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group" :class="isActive(item.path)
            ? 'bg-primary text-navy shadow-lg shadow-primary/20'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'">
          <Icon :icon="item.icon" :class="isActive(item.path) ? 'text-navy' : 'group-hover:scale-110'"
            class="text-xl transition-transform" />
          <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ item.label }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- User Profile Section -->
    <div class="p-4 border-t border-white/10 bg-black/20 shrink-0">
      <div class="flex items-center justify-between gap-3 px-2 py-1">
        <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
          @click="router.push('/dashboard/settings')">
          <div
            class="h-9 w-9 rounded-full bg-primary/20 border-2 border-white/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
            <img :src="userAvatar" class="w-full h-full object-cover">
          </div>
          <div v-if="!isSidebarCollapsed" class="flex flex-col min-w-0">
            <span class="text-white text-sm font-bold truncate">{{ user?.name || 'Guest' }}</span>
            <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest">{{ user?.role || 'User'
            }}</span>
          </div>
        </div>
        <button @click="handleLogout"
          class="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5"
          :title="isSidebarCollapsed ? 'Keluar' : ''">
          <Icon icon="ph:sign-out" class="text-[20px]" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const { user, logout } = useAuth()

const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const isSidebarCollapsed = useState('sidebar-collapsed', () => false)

const userAvatar = computed(() => user.value?.avatar_url || `https://ui-avatars.com/api/?name=${user.value?.name || 'User'}&background=FFD700&color=0F172A`)

// Close sidebar on route change for mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

const eventId = computed(() => route.params.id)

const eventLinks = computed(() => [
  { label: 'Target & Lajur', icon: 'ph:target', path: `/dashboard/events/${eventId.value}/manage/targets` },
  { label: 'Kualifikasi', icon: 'ph:scoreboard', path: `/dashboard/events/${eventId.value}/manage/qualification` },
  { label: 'Eliminasi', icon: 'ph:layout', path: `/dashboard/events/${eventId.value}/manage/elimination` },
])

// Role-based navigation - filtered based on user role
const navLinks = computed(() => {
  const role = user.value?.role || 'archer'

  // Base links for all users
  const baseLinks = [
    { label: 'Ringkasan', icon: 'ph:squares-four', path: '/dashboard', roles: ['archer', 'admin', 'organization', 'club'] },
    { label: 'Event', icon: 'ph:trophy', path: '/dashboard/events', roles: ['archer', 'admin', 'organization', 'club'] },
    { label: 'Atlet', icon: 'ph:users-three', path: '/dashboard/archers', roles: ['admin', 'organization', 'club'] },
    { label: 'Tim', icon: 'ph:users-four', path: '/dashboard/teams', roles: ['admin', 'organization'] },
    { label: 'Anggota Klub', icon: 'ph:identification-badge', path: '/dashboard/members', roles: ['club'] },
    { label: 'Hasil Langsung', icon: 'ph:broadcast', path: '/dashboard/live', badge: 'Live', roles: ['archer', 'admin', 'organization', 'club'] },
    { label: 'Pengaturan', icon: 'ph:gear', path: '/dashboard/settings', roles: ['archer', 'admin', 'organization', 'club'] },
  ]

  return baseLinks.filter(link => link.roles.includes(role))
})

const isActive = (path) => {
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/dashboard/'
  }
  return route.path.startsWith(path)
}

const showLogoutDialog = useState('show-logout-dialog', () => false)

const handleLogout = () => {
  showLogoutDialog.value = true
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.bg-navy {
  background-color: #0f172a;
}
</style>
