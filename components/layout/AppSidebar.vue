<template>
  <aside
    class="w-64 max-w-[85vw] bg-navy flex flex-col fixed md:static inset-y-0 left-0 z-[100] md:z-auto transition-transform duration-300 ease-out md:translate-x-0 shrink-0 border-r border-white/10 md:shadow-xl"
    :class="[
      isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0',
      isSidebarCollapsed ? 'md:w-20' : 'md:w-64'
    ]" aria-hidden="false" :aria-label="isSidebarOpen ? 'Menu navigasi terbuka' : 'Menu navigasi tertutup'">

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

      <!-- Main Navigation (Menu Utama) - Hide when on any event sub-page (including edit) -->
      <template v-if="!isOnEventSubPage">
        <template v-for="section in navSections" :key="section.label">
          <!-- Section with group dropdown -->
          <template v-if="section.children">
            <div class="mt-1">
              <!-- Group header button -->
              <button @click="toggleGroup(section.label)"
                class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
                <Icon :icon="section.icon" class="text-xl shrink-0" />
                <span v-if="!isSidebarCollapsed" class="text-sm font-bold flex-1 text-left text-gray-400">
                  {{ section.label }}
                </span>
                <Icon v-if="!isSidebarCollapsed"
                  :icon="openGroups.includes(section.label) ? 'ph:caret-up-bold' : 'ph:caret-down-bold'"
                  class="text-[10px] text-gray-500 shrink-0 transition-transform" />
              </button>
              <!-- Dropdown children -->
              <Transition name="slide-down">
                <div v-if="openGroups.includes(section.label)"
                  class="overflow-hidden mt-0.5 ml-3 flex flex-col gap-0.5">
                  <NuxtLink v-for="item in section.children" :key="item.path" :to="item.isLocked ? '#' : item.path"
                    class="flex items-center gap-3 pl-5 pr-3 py-2 rounded-xl transition-all relative" :class="[
                      isActive(item.path) ? 'bg-primary/15 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                      item.isLocked ? 'opacity-50 cursor-not-allowed' : ''
                    ]">
                    <!-- Active indicator bar -->
                    <div v-if="isActive(item.path)"
                      class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full"></div>
                    <Icon :icon="item.icon" class="text-lg shrink-0" />
                    <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ item.label }}</span>
                    <Icon v-if="item.isLocked && !isSidebarCollapsed" icon="ph:lock-key-bold"
                      class="ml-auto text-xs opacity-60" />
                  </NuxtLink>
                </div>
              </Transition>
            </div>
          </template>

          <!-- Section label (no group) -->
          <template v-else-if="section.type === 'label'">
            <div v-if="!isSidebarCollapsed" class="px-3 mt-3 mb-1">
              <p class="text-xs font-bold text-gray-500">{{ section.label }}</p>
            </div>
          </template>

          <!-- Regular nav item -->
          <template v-else>
            <NuxtLink :to="section.isLocked ? '#' : section.path"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group" :class="[
                isActive(section.path) ? 'bg-primary text-primary-text shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                section.isLocked ? 'opacity-50 cursor-not-allowed' : ''
              ]">
              <Icon :icon="section.icon.includes(':') ? section.icon : `ph:${section.icon}`"
                class="text-xl transition-transform" :class="isActive(section.path) ? 'text-primary-text' : ''" />
              <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ section.label }}</span>
              <Icon v-if="section.isLocked && !isSidebarCollapsed" icon="ph:lock-key-bold"
                class="ml-auto text-sm opacity-60" />
              <span v-if="section.badge && !isSidebarCollapsed && !section.isLocked"
                class="ml-auto bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full tracking-tighter">
                {{ section.badge }}
              </span>
            </NuxtLink>
          </template>
        </template>
      </template>

      <!-- Dynamic Event Navigation (Manajemen Event) -->
      <div v-if="eventId && (canManageEvents || isArcher)" class="flex flex-col gap-1"
        :class="isEventManagePage ? '' : 'mt-4'">
        <div v-if="!isOnEventSubPage && !isEventManagePage" class="h-px bg-white/10 mb-2 mx-3"></div>
        <div v-if="!isSidebarCollapsed" class="px-3 mb-2">
          <p class="text-xs font-bold text-gray-500">Manajemen Event</p>
        </div>
        <NuxtLink v-for="item in eventLinks" :key="item.path" :to="item.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group" :class="isActive(item.path)
            ? 'bg-primary text-primary-text shadow-lg shadow-primary/20'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'">
          <Icon :icon="item.icon" :class="isActive(item.path) ? 'text-primary-text' : ''"
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
            <span class="text-white text-sm font-bold truncate">{{ user?.full_name || 'Guest' }}</span>
            <span class="text-[10px] text-gray-500 font-bold">{{ userRoleLabel }}</span>
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
import { computed, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useImageOrDefault } from '~/composables/useImageHelper'

const route = useRoute()
const router = useRouter()
const { user, archerProfile, clubProfile, organizationProfile, sellerProfile, logout } = useAuth()

const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const isSidebarCollapsed = useState('sidebar-collapsed', () => false)

// Groups that are expanded (open)
const openGroups = ref(['Manajemen Klub', 'Menu Event', 'Menu Organisasi'])

function toggleGroup(label) {
  const idx = openGroups.value.indexOf(label)
  if (idx >= 0) openGroups.value.splice(idx, 1)
  else openGroups.value.push(label)
}

const userAvatar = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  let url = user.value?.avatar_url

  if (role === 'club' && clubProfile.value?.logo_url) {
    url = clubProfile.value.logo_url
  } else if (role === 'organization' && (organizationProfile.value?.avatar_url || organizationProfile.value?.logo_url)) {
    url = organizationProfile.value.avatar_url || organizationProfile.value.logo_url
  } else if (role === 'seller' && sellerProfile.value?.avatar_url) {
    url = sellerProfile.value.avatar_url
  } else if (role === 'archer' && archerProfile.value?.avatar_url) {
    url = archerProfile.value.avatar_url
  }

  return useImageOrDefault(url, user.value?.full_name || user.value?.name || 'User')
})

const displayName = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  if (role === 'club' && clubProfile.value?.name) return clubProfile.value.name
  else if (role === 'organization' && organizationProfile.value?.name) return organizationProfile.value.name
  else if (role === 'seller' && sellerProfile.value?.store_name) return sellerProfile.value.store_name
  return user.value?.full_name || user.value?.name || 'Guest'
})



const userPersona = computed(() => {
  const roleMap = {
    'archer': 'archer',
    'club': 'club',
    'organization': 'organization',
    'seller': 'seller',
    'root': 'root',
    'admin': 'organization'
  }
  return roleMap[user.value?.role || user.value?.user_type || user.value?.type] || 'archer'
})

const eventId = computed(() => route.params.id)

const isOnEventSubPage = computed(() => {
  const path = route.path
  // Check if it's an event page under any role
  const isEventPath = path.includes('/events/') && path.includes('/dashboard/')
  if (!isEventPath) return false
  const eventPathMatch = path.match(/\/dashboard\/(?:archer|organization|club|seller|root|events)\/events\/([^/]+)\/(.+)/) ||
    path.match(/\/dashboard\/events\/([^/]+)\/(.+)/)
  return !!eventPathMatch
})

const isEventManagePage = computed(() => {
  const path = route.path
  const isEventPath = path.includes('/events/') && path.includes('/dashboard/')
  if (!isEventPath) return false
  const eventPathMatch = path.match(/\/dashboard\/(?:archer|organization|club|seller|root|events)\/events\/([^/]+)\/(.+)/) ||
    path.match(/\/dashboard\/events\/([^/]+)\/(.+)/)
  const [, , subPath] = eventPathMatch || []
  if (!subPath) return false
  const excludedPaths = ['edit', 'checkout', 'register', 'register-edit', 'results', 'setup', 'timeline', 'venue']
  return !excludedPaths.includes(subPath)
})

const eventLinks = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  const isOrganization = role === 'organization'
  const isArcher = role === 'archer'

  // Use persona prefix
  const prefix = `/dashboard/${userPersona.value}`

  if (isArcher) {
    return [
      { label: 'Registrasi', icon: 'ph:clipboard-text', path: `${prefix}/events/${eventId.value}/my-registration` },
      { label: 'Hasil Kualifikasi', icon: 'ph:chart-line-up-bold', path: `${prefix}/events/${eventId.value}/my-qualification` },
      { label: 'Hasil Eliminasi', icon: 'ph:git-merge-bold', path: `${prefix}/events/${eventId.value}/my-elimination` },
    ]
  }

  const links = [
    { label: 'Ringkasan', icon: 'ph:squares-four', path: `${prefix}/events/${eventId.value}/overview` },
    { label: 'Halaman Event', icon: 'ph:browser', path: `${prefix}/events/${eventId.value}/page` },
    { label: 'Peserta', icon: 'ph:users-three', path: `${prefix}/events/${eventId.value}/participants` },
    { label: 'Tim', icon: 'ph:users-four', path: `${prefix}/events/${eventId.value}/teams` },
  ]

  if (isOrganization) {
    links.push({ label: 'Kategori Lomba', icon: 'ph:tag', path: `${prefix}/events/${eventId.value}/categories` })
  }

  links.push(
    { label: 'Target', icon: 'ph:target', path: `${prefix}/events/${eventId.value}/targets` },
    { label: 'Kualifikasi', icon: 'fluent:table-freeze-column-20-regular', path: `${prefix}/events/${eventId.value}/qualification` },
    { label: 'Eliminasi', icon: 'mdi:bracket', path: `${prefix}/events/${eventId.value}/elimination` },
    { label: 'Scan QR', icon: 'ph:qr-code', path: '/scan/qr' },
  )

  return links
})

const isArcher = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  return role === 'archer'
})

const canManageEvents = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  return ['admin', 'organization'].includes(role)
})

const userRoleLabel = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  const labels = { 'archer': 'Pemanah', 'organization': 'Organisasi', 'club': 'Klub', 'admin': 'Admin', 'seller': 'Penjual', 'scorekeeper': 'Scorekeeper' }
  return labels[role] || 'Pengguna'
})

const { isSubscriptionActive, isElite } = useSubscription()

// ── Nav sections (supports labels, items, and group dropdowns) ─────────────
const navSections = computed(() => {
  const role = user.value?.role || user.value?.type || user.value?.user_type
  const isActiveSub = isSubscriptionActive.value

  if (role === 'archer') {
    return [
      { label: 'Event Saya', icon: 'ph:trophy', path: '/dashboard/archer/events' },
      { label: 'Klub', icon: 'ph:buildings', path: '/dashboard/archer/club' },
      { label: 'Keranjang', icon: 'ph:shopping-cart', path: '/dashboard/archer/cart' },
      { label: 'Profil Pemanah', icon: 'ph:user-circle', path: '/dashboard/archer/profile' },
      { label: 'Pengaturan', icon: 'ph:gear', path: '/dashboard/archer/settings' },
    ]
  }

  if (role === 'seller') {
    return [
      { label: 'Ringkasan', icon: 'ph:squares-four', path: '/dashboard/seller' },
      { label: 'Toko Saya', icon: 'ph:storefront', path: '/dashboard/seller/store' },
      { label: 'Produk', icon: 'ph:package', path: '/dashboard/seller/products' },
      { label: 'Pesanan', icon: 'ph:shopping-cart', path: '/dashboard/seller/orders' },
      { label: 'Pengaturan', icon: 'ph:gear', path: '/dashboard/seller/settings' },
    ]
  }

  if (role === 'club') {
    return [
      { label: 'Ringkasan', icon: 'ph:squares-four', path: '/dashboard/club' },
      { type: 'label', label: 'Manajemen Klub' },
      // Group: Anggota & Membership
      {
        label: 'Keanggotaan',
        icon: 'ph:users-bold',
        type: 'group',
        children: [
          { label: 'Anggota', icon: 'ph:identification-badge-bold', path: '/dashboard/club/members', isLocked: !isActiveSub },
          { label: 'Membership', icon: 'ph:crown-bold', path: '/dashboard/club/membership', isLocked: !isActiveSub },
          { label: 'Pembayaran', icon: 'ph:money-bold', path: '/dashboard/club/payments-membership', isLocked: !isActiveSub },
        ]
      },
      { label: 'Form Pendaftaran', icon: 'ph:clipboard-text-bold', path: '/dashboard/club/form-pendaftaran', isLocked: !isActiveSub },
      { label: 'Laporan', icon: 'ph:chart-bar-bold', path: '/dashboard/club/reports', isLocked: !isActiveSub },
      { label: 'Profil Klub', icon: 'ph:buildings', path: '/dashboard/club/profile' },
      { type: 'label', label: 'Lainnya' },
      { label: 'Subscription', icon: 'ph:credit-card', path: '/dashboard/club/subscription' },
      ...(!isEventManagePage.value ? [{ label: 'Berita', icon: 'ph:newspaper', path: '/dashboard/club/news' }] : []),
      ...(!isEventManagePage.value ? [{ label: 'Pengaturan', icon: 'ph:gear', path: '/dashboard/club/settings' }] : []),
    ]
  }

  if (role === 'organization') {
    return [
      { label: 'Ringkasan', icon: 'ph:squares-four', path: '/dashboard/organization' },
      { type: 'label', label: 'Manajemen Event' },
      {
        label: 'Event',
        icon: 'ph:trophy',
        type: 'group',
        children: [
          { label: 'Event Saya', icon: 'material-symbols:event-list-outline', path: '/dashboard/organization/events', isLocked: !isActiveSub },
          { label: 'Laporan', icon: 'ph:chart-bar', path: '/dashboard/organization/reports', isLocked: !isActiveSub },
        ]
      },
      { type: 'label', label: 'Manajemen Organisasi' },
      {
        label: 'Organisasi',
        icon: 'ph:building-office',
        type: 'group',
        children: [
          { label: 'Profil Organisasi', icon: 'icomoon-free:profile', path: '/dashboard/organization/profile' },
          { label: 'Scorekeeper', icon: 'ph:user-focus', path: '/dashboard/organization/scorekeepers', isLocked: !isActiveSub },
        ]
      },
      { type: 'label', label: 'Lainnya' },
      { label: 'Subscription', icon: 'ph:credit-card', path: '/dashboard/organization/subscription' },
      ...(!isEventManagePage.value ? [{ label: 'Berita', icon: 'ph:newspaper', path: '/dashboard/organization/news' }] : []),
      ...(!isEventManagePage.value ? [{ label: 'Pengaturan', icon: 'ph:gear', path: '/dashboard/organization/settings' }] : []),
    ]
  }

  // Root admin — clean minimal nav
  if (role === 'root') {
    return [
      { type: 'label', label: 'Manajemen Akun' },
      { label: 'Pengguna', icon: 'ph:users-four-bold', path: '/dashboard/root' },
      { type: 'label', label: 'Manajemen Paket' },
      { label: 'Subscription', icon: 'ph:credit-card-bold', path: '/dashboard/root/subscriptions' },
    ]
  }

  // Admin / default
  return [
    { label: 'Ringkasan', icon: 'ph:squares-four', path: '/dashboard' },
    { label: 'Event', icon: 'ph:trophy', path: '/dashboard/events' },
    ...(!isEventManagePage.value ? [{ label: 'Laporan', icon: 'ph:chart-bar', path: '/dashboard/reports' }] : []),
    { label: 'Tim', icon: 'ph:users-four', path: '/dashboard/teams' },
    ...(!isEventManagePage.value ? [{ label: 'Berita', icon: 'ph:newspaper', path: '/dashboard/news' }] : []),
    ...(!isEventManagePage.value ? [{ label: 'Pengaturan', icon: 'ph:gear', path: '/dashboard/settings' }] : []),
  ]
})

// Close sidebar on route change for mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

// Auto-open group if any child is active
watch(() => route.path, (path) => {
  navSections.value?.forEach(section => {
    if (section.children && section.children.some(c => path.startsWith(c.path))) {
      if (!openGroups.value.includes(section.label)) {
        openGroups.value.push(section.label)
      }
    }
  })
}, { immediate: true })

// ── Active detection — exact match for /dashboard, prefix for others ───────
const isActive = (path) => {
  if (!path) return false
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/dashboard/'
  }
  // Root sub-pages — use exact match to prevent /dashboard/root matching /dashboard/root/subscriptions
  if (path.startsWith('/dashboard/root')) {
    return route.path === path
  }
  // Exact match first, then check if route path starts with path + '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const showLogoutDialog = useState('show-logout-dialog', () => false)
const handleLogout = () => { showLogoutDialog.value = true }
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.bg-navy {
  background-color: var(--sidebar-bg, #0f172a);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  max-height: 300px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
