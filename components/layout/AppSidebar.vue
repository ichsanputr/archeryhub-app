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
        <img src="/logo.png" alt="Archeris Logo" class="h-8 w-8 object-contain shrink-0" />
        <span v-if="!isSidebarCollapsed"
          class="text-lg font-black tracking-tight whitespace-nowrap text-white">Archeris</span>
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
                    class="flex items-center gap-3 pl-8 pr-3 py-2 rounded-xl transition-all relative" :class="[
                      isActive(item.path) ? 'bg-primary/15 text-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white',
                      item.isLocked ? 'opacity-50 cursor-not-allowed' : ''
                    ]">
                    <!-- Active indicator bar -->
                    <div v-if="isActive(item.path)"
                      class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-r-full"></div>
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
              <div class="text-xs font-bold text-gray-500">{{ section.label }}</div>
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
        :class="isOnEventSubPage ? '' : 'mt-4'">
        <!-- Back to Events button when on subpage -->
        <div v-if="isOnEventSubPage" class="mb-2">
          <NuxtLink :to="isArcher ? '/dashboard/archer/events' : '/dashboard/organizer/events'"
            class="flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-all">
            <Icon icon="ph:arrow-left-bold" class="text-sm" />
            <span v-if="!isSidebarCollapsed">{{ t('sidebar.back_to_events', 'Semua Event') }}</span>
          </NuxtLink>
        </div>
        <div v-if="!isOnEventSubPage && !isEventManagePage" class="h-px bg-white/10 mb-2 mx-3"></div>
        <div v-if="!isSidebarCollapsed && !isOnEventSubPage" class="px-3 mb-2">
          <div class="text-xs font-bold text-gray-500">{{ t('sidebar.event_management', t('dashboard.sidebar.event_management', 'Manajemen Event')) }}</div>
        </div>
        <template v-for="(item, idx) in eventLinks" :key="item.path || item.label || idx">
          <div v-if="item.type === 'label'" class="px-3 mt-3 mb-1">
            <div v-if="!isSidebarCollapsed" class="text-[10px] font-black capitalize tracking-wider text-gray-500">{{ item.label }}</div>
            <div v-else class="h-px bg-white/10 my-1"></div>
          </div>
          <NuxtLink v-else :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group" :class="isActive(item.path)
              ? 'bg-primary text-primary-text shadow-lg shadow-primary/20'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'">
            <Icon :icon="item.icon" :class="isActive(item.path) ? 'text-primary-text' : ''"
              class="text-xl transition-transform" />
            <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ item.label }}</span>
          </NuxtLink>
        </template>
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
          :title="isSidebarCollapsed ? t('dashboard.sidebar.sign_out') : ''">
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
const { user, userPersona, archerProfile, organizerProfile, sellerProfile, logout } = useAuth()
const { t } = useDashboardI18n()

const isSidebarOpen = useState('mobile-sidebar-open', () => false)
const isSidebarCollapsed = useState('sidebar-collapsed', () => false)

// Groups that are expanded (open) - Expand all groups by default
const openGroups = ref([])

function toggleGroup(label) {
  const idx = openGroups.value.indexOf(label)
  if (idx >= 0) openGroups.value.splice(idx, 1)
  else openGroups.value.push(label)
}

const userAvatar = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  let url = user.value?.avatar_url

  if (role === 'organizer' && (organizerProfile.value?.avatar_url || organizerProfile.value?.logo_url)) {
    url = organizerProfile.value.avatar_url || organizerProfile.value.logo_url
  } else if (role === 'seller' && sellerProfile.value?.avatar_url) {
    url = sellerProfile.value.avatar_url
  } else if (role === 'archer' && archerProfile.value?.avatar_url) {
    url = archerProfile.value.avatar_url
  }

  return useImageOrDefault(url, user.value?.full_name || user.value?.name || 'User')
})

const displayName = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  if (role === 'organizer' && organizerProfile.value?.name) return organizerProfile.value.name
  else if (role === 'seller' && sellerProfile.value?.store_name) return sellerProfile.value.store_name
  return user.value?.full_name || user.value?.name || 'Guest'
})



const eventId = computed(() => route.params.id)

const isOnEventSubPage = computed(() => {
  const path = route.path
  // Check if it's an event page under any role
  const isEventPath = path.includes('/events/') && path.includes('/dashboard/')
  if (!isEventPath) return false
  const eventPathMatch = path.match(/\/dashboard\/(?:archer|organizer|seller|root|events)\/events\/([^/]+)\/(.+)/) ||
    path.match(/\/dashboard\/events\/([^/]+)\/(.+)/)
  return !!eventPathMatch
})

const isEventManagePage = computed(() => {
  const path = route.path
  const isEventPath = path.includes('/events/') && path.includes('/dashboard/')
  if (!isEventPath) return false
  const eventPathMatch = path.match(/\/dashboard\/(?:archer|organizer|seller|root|events)\/events\/([^/]+)\/(.+)/) ||
    path.match(/\/dashboard\/events\/([^/]+)\/(.+)/)
  const [, , subPath] = eventPathMatch || []
  if (!subPath) return false
  const excludedPaths = ['edit', 'checkout', 'register', 'register-edit', 'results', 'setup', 'timeline', 'venue']
  return !excludedPaths.includes(subPath)
})

const eventLinks = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  const isOrganization = role === 'organizer'
  const isArcher = role === 'archer'

  // Use persona prefix
  const prefix = `/dashboard/${userPersona.value}`

  if (isArcher) {
    return [
      { label: t('sidebar.event_overview', 'Ringkasan Event'), icon: 'ph:squares-four-bold', path: `${prefix}/events/${eventId.value}/overview` },
      { label: t('sidebar.my_registration', 'Pendaftaran & Tiket'), icon: 'ph:ticket-bold', path: `${prefix}/events/${eventId.value}/my-registration` },
      { label: t('sidebar.my_target', 'Target & Jadwal'), icon: 'ph:target-bold', path: `${prefix}/events/${eventId.value}/my-target` },
      { label: t('sidebar.qualification', 'Skor Kualifikasi'), icon: 'ph:chart-line-up-bold', path: `${prefix}/events/${eventId.value}/my-qualification` },
      { label: t('sidebar.elimination', 'Bagan Eliminasi'), icon: 'ph:git-merge-bold', path: `${prefix}/events/${eventId.value}/my-elimination` },
      { label: t('sidebar.teams', 'Regu & Tim'), icon: 'ph:users-four-bold', path: `${prefix}/events/${eventId.value}/my-team` },
      { label: t('sidebar.certificates', 'Sertifikat'), icon: 'ph:certificate-bold', path: `${prefix}/events/${eventId.value}/my-certificate` },
    ]
  }

  const links = [
    { label: t('sidebar.summary', 'Ringkasan'), icon: 'ph:squares-four', path: `${prefix}/events/${eventId.value}/overview` },
    { label: t('sidebar.event_page', 'Event Setting'), icon: 'ph:gear-six-bold', path: `${prefix}/events/${eventId.value}/page` },
    { label: t('sidebar.participants', 'Peserta'), icon: 'ph:users-three', path: `${prefix}/events/${eventId.value}/participants` },
    { label: t('sidebar.teams', 'Tim'), icon: 'ph:users-four', path: `${prefix}/events/${eventId.value}/teams` },
  ]

  if (isOrganization) {
    links.push({ label: t('sidebar.competition_categories', 'Kategori'), icon: 'ph:tag', path: `${prefix}/events/${eventId.value}/categories` })
  }

  links.push(
    { label: t('sidebar.targets', 'Target'), icon: 'ph:target', path: `${prefix}/events/${eventId.value}/targets` },
    { label: t('sidebar.qualification', 'Kualifikasi'), icon: 'fluent:table-freeze-column-20-regular', path: `${prefix}/events/${eventId.value}/qualification` },
    { label: t('sidebar.elimination', 'Eliminasi'), icon: 'mdi:bracket', path: `${prefix}/events/${eventId.value}/elimination` },
    { label: t('sidebar.printout', 'Printout'), icon: 'ph:printer-bold', path: `${prefix}/events/${eventId.value}/printout` },
    { label: t('sidebar.certificates', 'Sertifikat'), icon: 'ph:certificate-bold', path: `${prefix}/events/${eventId.value}/certificate` },
  )

  return links
})

const isArcher = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  return role === 'archer'
})

const canManageEvents = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  return ['admin', 'organizer'].includes(role)
})

const userRoleLabel = computed(() => {
  const role = user.value?.role || user.value?.type || 'archer'
  const labels = {
    'archer': t('dashboard.sidebar.roles.archer', 'Archer'),
    'organizer': t('dashboard.sidebar.roles.organizer', 'Organizer'),
    'admin': t('dashboard.sidebar.roles.admin', 'Administrator'),
    'seller': t('dashboard.sidebar.roles.seller', 'Seller Store'),
    'scorekeeper': t('dashboard.sidebar.roles.scorekeeper', 'Scorekeeper')
  }
  return labels[role] || t('dashboard.sidebar.roles.user', 'Member')
})

const { isSubscriptionActive, isElite } = useSubscription()

// ── Nav sections (supports labels, items, and group dropdowns) ─────────────
const navSections = computed(() => {
  const role = userPersona.value || user.value?.role || user.value?.type || user.value?.user_type
  const isActiveSub = isSubscriptionActive.value

  if (role === 'archer') {
    return [
      { type: 'label', label: t('sidebar.activity', 'Turnamen') },
      { label: t('sidebar.my_events', 'Event Saya'), icon: 'ph:trophy-bold', path: '/dashboard/archer/events' },
      { label: t('sidebar.my_certifications', 'Sertifikat'), icon: 'ph:certificate-bold', path: '/dashboard/archer/certificates' },
      { type: 'label', label: t('sidebar.commerce', 'Belanja') },
      { label: t('sidebar.payments', 'Pembayaran'), icon: 'ph:credit-card-bold', path: '/dashboard/archer/payments' },
      { label: t('sidebar.cart', 'Keranjang'), icon: 'ph:shopping-cart-bold', path: '/dashboard/archer/cart' },
      { type: 'label', label: t('sidebar.account_section', 'Akun') },
      { label: t('sidebar.chat', 'Chat'), icon: 'ph:chat-circle-dots-bold', path: '/dashboard/archer/chat', badge: 'New' },
      { label: t('sidebar.archer_profile', 'Profil'), icon: 'ph:user-circle-bold', path: '/dashboard/archer/profile' },
      { label: t('sidebar.settings', 'Pengaturan'), icon: 'ph:gear-bold', path: '/dashboard/archer/settings' },
    ]
  }

  if (role === 'seller') {
    return [
      { label: t('sidebar.overview', 'Overview'), icon: 'ph:squares-four', path: '/dashboard/seller' },
      { type: 'label', label: t('sidebar.store_management', 'Toko') },
      { label: t('sidebar.store_profile', 'Profil Toko'), icon: 'ph:storefront', path: '/dashboard/seller/store' },
      { label: t('sidebar.products', 'Produk'), icon: 'ph:package', path: '/dashboard/seller/products' },
      { label: t('sidebar.orders', 'Pesanan'), icon: 'ph:shopping-cart', path: '/dashboard/seller/orders' },
      { label: t('sidebar.chat', 'Chat'), icon: 'ph:chat-circle-dots', path: '/dashboard/seller/chat', badge: 'New' },
      { type: 'label', label: t('sidebar.settings', 'Pengaturan') },
      { label: t('sidebar.settings', 'Pengaturan'), icon: 'ph:gear', path: '/dashboard/seller/settings' },
    ]
  }

  if (role === 'organizer') {
    return [
      { label: t('sidebar.overview', 'Overview'), icon: 'ph:squares-four', path: '/dashboard/organizer' },
      { type: 'label', label: t('sidebar.event', 'Event') },
      { label: t('sidebar.my_events', 'Event Saya'), icon: 'ph:trophy', path: '/dashboard/organizer/events' },
      { type: 'label', label: t('sidebar.organizer', 'Penyelenggara') },
      {
        label: t('sidebar.organizer', 'Penyelenggara'),
        icon: 'ph:building-office',
        type: 'group',
        children: [
          { label: t('sidebar.profile', 'Profil'), icon: 'icomoon-free:profile', path: '/dashboard/organizer/profile' },
          { label: t('sidebar.scorekeeper', 'Scorekeeper'), icon: 'ph:user-focus', path: '/dashboard/organizer/scorekeepers' },
          { label: t('sidebar.reports', 'Laporan'), icon: 'ph:chart-bar', path: '/dashboard/organizer/reports' },
        ]
      },
      { type: 'label', label: t('sidebar.finance', 'Keuangan') },
      {
        label: t('sidebar.finance', 'Keuangan'),
        icon: 'ph:coins',
        type: 'group',
        children: [
          { label: t('sidebar.earnings', 'Pendapatan'), icon: 'ph:wallet', path: '/dashboard/organizer/earnings' },
          { label: t('sidebar.balance', 'Saldo'), icon: 'ph:bank', path: '/dashboard/organizer/balance' },
          { label: t('sidebar.bank_accounts', 'Rekening'), icon: 'ph:credit-card', path: '/dashboard/organizer/bank-accounts' },
        ]
      },
      { type: 'label', label: t('sidebar.settings', 'Pengaturan') },
      { label: t('sidebar.package', 'Package'), icon: 'ph:package', path: '/dashboard/organizer/package' },
      ...(!isEventManagePage.value ? [{ label: t('sidebar.settings', 'Pengaturan'), icon: 'ph:gear', path: '/dashboard/organizer/settings' }] : []),
    ]
  }

  // Root admin — clean minimal nav
  if (role === 'root') {
    return [
      { type: 'label', label: t('root.index.title', 'Penyelenggara') },
      { label: t('root.index.title', 'Penyelenggara'), icon: 'ph:users-four-bold', path: '/dashboard/root' },
    ]
  }

  // Admin / default
  const prefix = `/dashboard/${userPersona.value}`
  return [
    { label: t('sidebar.overview', 'Overview'), icon: 'ph:squares-four', path: prefix },
    { label: t('sidebar.event', 'Event'), icon: 'ph:trophy', path: `${prefix}/events` },
    ...(!isEventManagePage.value ? [{ label: t('sidebar.earnings', 'Laporan'), icon: 'ph:chart-bar', path: `${prefix}/reports` }] : []),
    { label: t('sidebar.profile', 'Profil'), icon: 'ph:users-four', path: `${prefix}/teams` },
    ...(!isEventManagePage.value ? [{ label: t('sidebar.settings', 'Pengaturan'), icon: 'ph:gear', path: `${prefix}/settings` }] : []),
  ]
})

// Close sidebar on route change for mobile
watch(() => route.path, () => {
  isSidebarOpen.value = false
})

// Auto-expand all group labels by default
watch(navSections, (sections) => {
  if (sections && Array.isArray(sections)) {
    sections.forEach((sec) => {
      if (sec.children && sec.label && !openGroups.value.includes(sec.label)) {
        openGroups.value.push(sec.label)
      }
    })
  }
}, { immediate: true })


// ── Active detection — exact match for /dashboard, prefix for others ───────
const isActive = (path) => {
  if (!path) return false
  if (path === '/dashboard') {
    return route.path === '/dashboard' || route.path === '/dashboard/'
  }

  // Dashboard roots should use exact match and not match sub-pages
  const dashboardRoots = ['/dashboard/root', '/dashboard/organizer', '/dashboard/seller', '/dashboard/archer']
  if (dashboardRoots.includes(path)) {
    return route.path === path || route.path === path + '/'
  }

  // Exact match first, then check if route path starts with path + '/'
  return route.path === path || route.path.startsWith(path + '/')
}

const showLogoutDialog = useState('show-logout-dialog', () => false)
const handleLogout = () => { showLogoutDialog.value = true }
</script>

<style scoped>
.no-scrollbar {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}

.no-scrollbar::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
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

