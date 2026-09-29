<template>
  <Teleport to="body">
    <Transition name="palette-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[999] flex items-start justify-center px-4" style="padding-top: 10vh">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-navy/80 dark:bg-slate-950/90 backdrop-blur-md" @click="close" />

        <!-- Command Palette Box -->
        <div
          class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200/80 dark:border-slate-800 transition-colors flex flex-col max-h-[78vh]">
          
          <!-- Palette Header Input -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <div class="size-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <Icon icon="ph:command-bold" class="text-xl text-navy" />
            </div>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              :placeholder="locale === 'id' ? 'Ketik menu, aksi cepat, atau turnamen saya...' : 'Type a command, page, or my tournament...'"
              class="flex-1 text-sm sm:text-base text-navy dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none bg-transparent font-medium"
              @keydown.esc="close"
              @keydown.down.prevent="moveDown"
              @keydown.up.prevent="moveUp"
              @keydown.enter.prevent="executeActive"
            />
            <button
              v-if="query"
              @click="query = ''"
              class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear search"
            >
              <Icon icon="ph:x-bold" class="text-sm" />
            </button>
            <div class="flex items-center gap-1.5 shrink-0">
              <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-400 dark:text-slate-400 font-mono">Esc</kbd>
            </div>
          </div>

          <!-- Quick Category Filter -->
          <div class="px-5 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            <button
              v-for="cat in categoryFilters"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              class="px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer"
              :class="selectedCategory === cat.id
                ? 'bg-navy text-primary font-bold shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'"
            >
              <Icon :icon="cat.icon" class="text-xs" :class="selectedCategory === cat.id ? 'text-primary' : ''" />
              <span>{{ cat.label }}</span>
            </button>
          </div>

          <!-- Palette Body & Results -->
          <div class="flex-1 overflow-y-auto scrollbar-styled p-3 sm:p-4">
            
            <!-- Result Groups -->
            <div v-if="filteredCommands.length > 0" class="space-y-4">
              <div v-for="group in groupedCommands" :key="group.category" class="space-y-1.5">
                <div class="px-2.5 py-1 text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center justify-between">
                  <span>{{ group.title }}</span>
                  <span class="text-[11px] font-mono text-slate-400">{{ group.items.length }}</span>
                </div>

                <div
                  v-for="cmd in group.items"
                  :key="cmd.id"
                  @click="runCommand(cmd)"
                  @mouseenter="setActiveById(cmd.id)"
                  class="flex items-center justify-between gap-3 p-3 rounded-2xl transition-all cursor-pointer border group"
                  :class="cmd.id === activeCommandId
                    ? 'bg-primary/10 dark:bg-primary/15 border-primary/40 text-navy dark:text-slate-100 shadow-xs'
                    : 'bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-200'"
                >
                  <div class="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      class="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                      :class="cmd.id === activeCommandId
                        ? 'bg-navy text-primary'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-primary/20 group-hover:text-navy dark:group-hover:bg-navy dark:group-hover:text-primary'"
                    >
                      <Icon :icon="cmd.icon || 'ph:circle-bold'" class="text-base" />
                    </div>

                    <div class="min-w-0 flex-1">
                      <div class="flex items-center gap-2">
                        <span class="text-xs sm:text-sm font-bold text-navy dark:text-slate-100 truncate group-hover:text-navy dark:group-hover:text-white transition-colors">
                          {{ cmd.title }}
                        </span>
                        <span v-if="cmd.badge" class="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {{ cmd.badge }}
                        </span>
                      </div>
                      <div v-if="cmd.subtitle" class="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        {{ cmd.subtitle }}
                      </div>
                    </div>
                  </div>

                  <!-- Right Action Key / Shortcut Indicator -->
                  <div class="flex items-center gap-2 shrink-0">
                    <span v-if="cmd.shortcut" class="hidden sm:inline-flex px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-400">
                      {{ cmd.shortcut }}
                    </span>
                    <Icon
                      icon="ph:arrow-elbow-down-left-bold"
                      class="text-xs text-slate-300 dark:text-slate-600 transition-transform group-hover:translate-x-0.5"
                      :class="cmd.id === activeCommandId ? 'text-primary' : ''"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty Search State -->
            <div v-else class="py-12 text-center px-4">
              <div class="size-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto mb-3">
                <Icon icon="ph:file-search-bold" class="text-2xl" />
              </div>
              <h4 class="text-sm font-bold text-navy dark:text-slate-200 mb-1">
                {{ locale === 'id' ? 'Tidak ada aksi atau menu yang cocok' : 'No matching commands or pages' }}
              </h4>
              <div class="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto">
                {{ locale === 'id'
                  ? `Tidak ada hasil untuk kata kunci "${query}". Coba cari "turnamen", "atlet", "pengaturan", atau "profil".`
                  : `No commands found for "${query}". Try searching for "tournament", "archer", "settings", or "profile".` }}
              </div>
            </div>

          </div>

          <!-- Palette Footer -->
          <div class="border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900 px-5 py-3 flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 shrink-0 font-medium flex-wrap">
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">↑↓</kbd>
              <span>{{ locale === 'id' ? 'navigasi' : 'navigate' }}</span>
            </span>
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">↵</kbd>
              <span>{{ locale === 'id' ? 'eksekusi' : 'execute' }}</span>
            </span>
            <span class="flex items-center gap-1.5">
              <kbd class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono text-[11px] text-slate-600 dark:text-slate-300">Esc</kbd>
              <span>{{ locale === 'id' ? 'tutup' : 'close' }}</span>
            </span>
            <span class="ml-auto font-mono text-[11px] hidden sm:block text-slate-400">
              Workspace Command Center
            </span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'

interface CommandItem {
  id: string
  title: string
  subtitle?: string
  category: 'actions' | 'my_tournaments' | 'navigation'
  icon: string
  badge?: string
  shortcut?: string
  action: () => void | Promise<void>
}

const isOpen = ref(false)
const query = ref('')
const selectedCategory = ref('all')
const activeCommandId = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)

const router = useRouter()
const route = useRoute()
const { locale, loadLocaleMessages, setLocaleCookie } = useI18n()
const { user, userPersona, logout } = useAuth()
const { get } = useApi()

// User managed tournaments cache
const myTournaments = ref<Array<{ id: string | number; name: string; slug?: string; status?: string; venue?: string }>>([])
const isFetchingEvents = ref(false)

const categoryFilters = computed(() => [
  { id: 'all', label: locale.value === 'id' ? 'Semua' : 'All', icon: 'ph:squares-four-bold' },
  { id: 'actions', label: locale.value === 'id' ? 'Aksi Cepat' : 'Quick Actions', icon: 'ph:lightning-bold' },
  { id: 'my_tournaments', label: locale.value === 'id' ? 'Turnamen Saya' : 'My Tournaments', icon: 'ph:trophy-bold' },
  { id: 'navigation', label: locale.value === 'id' ? 'Menu Halaman' : 'Pages', icon: 'ph:browsers-bold' }
])

// Fetch user's managed/registered tournaments
const fetchMyEvents = async () => {
  if (!user.value || isFetchingEvents.value) return
  isFetchingEvents.value = true
  try {
    const role = userPersona.value
    let endpoint = '/tournaments?limit=15'
    if (role === 'organizer') {
      endpoint = '/organizer/tournaments?limit=15'
    } else if (role === 'archer') {
      endpoint = '/archer/tournaments?limit=15'
    }

    const res = await get(endpoint).catch(() => null)
    const items = res?.tournaments || res?.events || res?.data || (Array.isArray(res) ? res : [])
    myTournaments.value = items.map((t: any) => ({
      id: t.uuid || t.id,
      name: t.name || 'Untitled Tournament',
      slug: t.slug,
      status: t.status,
      venue: t.venue || t.location
    }))
  } catch {
    myTournaments.value = []
  } finally {
    isFetchingEvents.value = false
  }
}

function toTitleCase(str?: string) {
  if (!str) return ''
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

// Build all available commands dynamically based on persona & current state
const allCommands = computed<CommandItem[]>(() => {
  const list: CommandItem[] = []
  const role = userPersona.value || 'archer'
  const isOrg = role === 'organizer'
  const isArch = role === 'archer'
  const isAdmin = role === 'admin' || role === 'root'
  const isClb = role === 'club'

  // 1. Quick Actions
  if (isOrg) {
    list.push({
      id: 'action-create-tournament',
      title: locale.value === 'id' ? 'Buat Turnamen Baru' : 'Create New Tournament',
      subtitle: locale.value === 'id' ? 'Buka wizard pembuatan turnamen panahan' : 'Open tournament creation wizard',
      category: 'actions',
      icon: 'ph:plus-circle-bold',
      badge: locale.value === 'id' ? 'Aksi' : 'Action',
      action: () => router.push('/dashboard/organizer/tournaments/create')
    })
  }

  if (isClb) {
    list.push({
      id: 'action-add-athlete',
      title: locale.value === 'id' ? 'Tambah Atlet Klub' : 'Add Club Athlete',
      subtitle: locale.value === 'id' ? 'Daftarkan atlet baru ke dalam roster klub' : 'Register new athlete to club roster',
      category: 'actions',
      icon: 'ph:user-plus-bold',
      badge: locale.value === 'id' ? 'Aksi' : 'Action',
      action: () => router.push('/dashboard/club/athletes')
    })
  }

  // Switch Language Action
  list.push({
    id: 'action-switch-lang',
    title: locale.value === 'id' ? 'Ganti Bahasa ke English' : 'Switch Language to Bahasa Indonesia',
    subtitle: locale.value === 'id' ? 'Ubah bahasa antarmuka dashboard ke EN' : 'Change dashboard interface language to ID',
    category: 'actions',
    icon: 'ph:globe-bold',
    badge: locale.value === 'id' ? 'Pengaturan' : 'Setting',
    action: async () => {
      const nextLocale = locale.value === 'id' ? 'en' : 'id'
      await loadLocaleMessages(nextLocale)
      locale.value = nextLocale
      setLocaleCookie(nextLocale)
    }
  })

  // Logout Action
  list.push({
    id: 'action-logout',
    title: locale.value === 'id' ? 'Keluar dari Akun (Logout)' : 'Sign Out of Account (Logout)',
    subtitle: locale.value === 'id' ? 'Akhiri sesi dashboard aktif' : 'End current dashboard session',
    category: 'actions',
    icon: 'ph:sign-out-bold',
    badge: locale.value === 'id' ? 'Autentikasi' : 'Auth',
    action: async () => {
      await logout()
      router.push('/auth/login')
    }
  })

  // 2. My Tournaments / Events (Contextual Jump)
  myTournaments.value.forEach((ev) => {
    const targetUrl = isArch
      ? `/dashboard/archer/tournaments/${ev.id}/overview`
      : `/dashboard/organizer/tournaments/${ev.id}/overview`

    list.push({
      id: `myevent-${ev.id}`,
      title: ev.name,
      subtitle: ev.venue ? `${ev.venue} • ${toTitleCase(ev.status || 'Active')}` : (toTitleCase(ev.status) || (locale.value === 'id' ? 'Turnamen Saya' : 'My Tournament')),
      category: 'my_tournaments',
      icon: 'ph:trophy-bold',
      badge: ev.status ? toTitleCase(ev.status) : (locale.value === 'id' ? 'Turnamen' : 'Tournament'),
      action: () => router.push(targetUrl)
    })
  })

  // 3. Navigation Pages
  if (isArch) {
    list.push(
      {
        id: 'nav-archer-tournaments',
        title: locale.value === 'id' ? 'Turnamen Saya' : 'My Tournaments',
        subtitle: '/dashboard/archer/tournaments',
        category: 'navigation',
        icon: 'ph:trophy-bold',
        action: () => router.push('/dashboard/archer/tournaments')
      },
      {
        id: 'nav-archer-certificates',
        title: locale.value === 'id' ? 'Sertifikat & Piagam Saya' : 'My Certificates',
        subtitle: '/dashboard/archer/certificates',
        category: 'navigation',
        icon: 'ph:certificate-bold',
        action: () => router.push('/dashboard/archer/certificates')
      },
      {
        id: 'nav-archer-payments',
        title: locale.value === 'id' ? 'Riwayat Pembayaran' : 'Payment History',
        subtitle: '/dashboard/archer/payments',
        category: 'navigation',
        icon: 'ph:credit-card-bold',
        action: () => router.push('/dashboard/archer/payments')
      },
      {
        id: 'nav-archer-profile',
        title: locale.value === 'id' ? 'Profil Pemanah' : 'Archer Profile',
        subtitle: '/dashboard/archer/profile',
        category: 'navigation',
        icon: 'ph:user-circle-bold',
        action: () => router.push('/dashboard/archer/profile')
      },
      {
        id: 'nav-archer-settings',
        title: locale.value === 'id' ? 'Pengaturan Akun' : 'Account Settings',
        subtitle: '/dashboard/archer/settings',
        category: 'navigation',
        icon: 'ph:gear-bold',
        action: () => router.push('/dashboard/archer/settings')
      }
    )
  } else if (isOrg) {
    list.push(
      {
        id: 'nav-org-overview',
        title: locale.value === 'id' ? 'Ringkasan Dashboard' : 'Dashboard Overview',
        subtitle: '/dashboard/organizer',
        category: 'navigation',
        icon: 'ph:squares-four-bold',
        action: () => router.push('/dashboard/organizer')
      },
      {
        id: 'nav-org-tournaments',
        title: locale.value === 'id' ? 'Kelola Turnamen' : 'Manage Tournaments',
        subtitle: '/dashboard/organizer/tournaments',
        category: 'navigation',
        icon: 'ph:trophy-bold',
        action: () => router.push('/dashboard/organizer/tournaments')
      },
      {
        id: 'nav-org-profile',
        title: locale.value === 'id' ? 'Profil Penyelenggara' : 'Organizer Profile',
        subtitle: '/dashboard/organizer/profile',
        category: 'navigation',
        icon: 'ph:building-office-bold',
        action: () => router.push('/dashboard/organizer/profile')
      },
      {
        id: 'nav-org-scorekeepers',
        title: locale.value === 'id' ? 'Petugas Skor (Scorekeepers)' : 'Scorekeepers',
        subtitle: '/dashboard/organizer/scorekeepers',
        category: 'navigation',
        icon: 'ph:user-focus-bold',
        action: () => router.push('/dashboard/organizer/scorekeepers')
      },
      {
        id: 'nav-org-earnings',
        title: locale.value === 'id' ? 'Pendapatan & Saldo' : 'Earnings & Balance',
        subtitle: '/dashboard/organizer/earnings',
        category: 'navigation',
        icon: 'ph:wallet-bold',
        action: () => router.push('/dashboard/organizer/earnings')
      },
      {
        id: 'nav-org-bank',
        title: locale.value === 'id' ? 'Rekening Bank Penarikan' : 'Bank Accounts',
        subtitle: '/dashboard/organizer/bank-accounts',
        category: 'navigation',
        icon: 'ph:bank-bold',
        action: () => router.push('/dashboard/organizer/bank-accounts')
      },
      {
        id: 'nav-org-package',
        title: locale.value === 'id' ? 'Paket Langganan Platform' : 'Subscription Package',
        subtitle: '/dashboard/organizer/package',
        category: 'navigation',
        icon: 'ph:package-bold',
        action: () => router.push('/dashboard/organizer/package')
      },
      {
        id: 'nav-org-settings',
        title: locale.value === 'id' ? 'Pengaturan Penyelenggara' : 'Organizer Settings',
        subtitle: '/dashboard/organizer/settings',
        category: 'navigation',
        icon: 'ph:gear-bold',
        action: () => router.push('/dashboard/organizer/settings')
      }
    )
  } else if (isAdmin) {
    list.push(
      {
        id: 'nav-root-overview',
        title: locale.value === 'id' ? 'Ringkasan Super Admin' : 'Super Admin Overview',
        subtitle: '/dashboard/root',
        category: 'navigation',
        icon: 'ph:squares-four-bold',
        action: () => router.push('/dashboard/root')
      },
      {
        id: 'nav-root-tournaments',
        title: locale.value === 'id' ? 'Kelola Seluruh Turnamen' : 'Manage All Tournaments',
        subtitle: '/dashboard/root/tournaments',
        category: 'navigation',
        icon: 'ph:trophy-bold',
        action: () => router.push('/dashboard/root/tournaments')
      },
      {
        id: 'nav-root-archers',
        title: locale.value === 'id' ? 'Database Atlet & Pengguna' : 'Archers & Users Database',
        subtitle: '/dashboard/root/archers',
        category: 'navigation',
        icon: 'ph:users-three-bold',
        action: () => router.push('/dashboard/root/archers')
      },
      {
        id: 'nav-root-articles',
        title: locale.value === 'id' ? 'Manajemen Artikel & Berita' : 'Articles & News Management',
        subtitle: '/dashboard/root/articles',
        category: 'navigation',
        icon: 'ph:newspaper-bold',
        action: () => router.push('/dashboard/root/articles')
      },
      {
        id: 'nav-root-docs',
        title: locale.value === 'id' ? 'Manajemen Dokumentasi' : 'Documentation Management',
        subtitle: '/dashboard/root/docs',
        category: 'navigation',
        icon: 'ph:book-bookmark-bold',
        action: () => router.push('/dashboard/root/docs')
      }
    )
  }

  return list
})

// Filtered commands based on query and category
const filteredCommands = computed<CommandItem[]>(() => {
  const q = query.value.toLowerCase().trim()
  return allCommands.value.filter((cmd) => {
    if (selectedCategory.value !== 'all' && cmd.category !== selectedCategory.value) {
      return false
    }
    if (!q) return true
    const matchTitle = cmd.title.toLowerCase().includes(q)
    const matchSub = cmd.subtitle ? cmd.subtitle.toLowerCase().includes(q) : false
    const matchCat = cmd.category.toLowerCase().includes(q)
    return matchTitle || matchSub || matchCat
  })
})

// Group commands for structured UI rendering
const categoryTitles: Record<string, { id: string; en: string }> = {
  actions: { id: 'Aksi Cepat', en: 'Quick Actions' },
  my_tournaments: { id: 'Turnamen Saya', en: 'My Tournaments' },
  navigation: { id: 'Menu Halaman', en: 'Navigation Pages' }
}

const groupedCommands = computed(() => {
  const groups: Array<{ category: string; title: string; items: CommandItem[] }> = []
  const order: Array<'actions' | 'my_tournaments' | 'navigation'> = ['actions', 'my_tournaments', 'navigation']

  order.forEach((cat) => {
    const items = filteredCommands.value.filter((c) => c.category === cat)
    if (items.length > 0) {
      const titles = categoryTitles[cat]
      groups.push({
        category: cat,
        title: locale.value === 'id' ? titles.id : titles.en,
        items
      })
    }
  })

  return groups
})

// Watch to reset active item on search query change
watch([filteredCommands, selectedCategory], () => {
  if (filteredCommands.value.length > 0) {
    activeCommandId.value = filteredCommands.value[0].id
  } else {
    activeCommandId.value = ''
  }
})

const moveDown = () => {
  const list = filteredCommands.value
  if (list.length === 0) return
  const currentIndex = list.findIndex((c) => c.id === activeCommandId.value)
  if (currentIndex < list.length - 1) {
    activeCommandId.value = list[currentIndex + 1].id
  }
}

const moveUp = () => {
  const list = filteredCommands.value
  if (list.length === 0) return
  const currentIndex = list.findIndex((c) => c.id === activeCommandId.value)
  if (currentIndex > 0) {
    activeCommandId.value = list[currentIndex - 1].id
  }
}

const setActiveById = (id: string) => {
  activeCommandId.value = id
}

const executeActive = () => {
  const cmd = filteredCommands.value.find((c) => c.id === activeCommandId.value) || filteredCommands.value[0]
  if (cmd) {
    runCommand(cmd)
  }
}

const runCommand = async (cmd: CommandItem) => {
  close()
  try {
    await cmd.action()
  } catch (err) {
    console.error('Failed to run command palette action:', err)
  }
}

const open = () => {
  isOpen.value = true
  query.value = ''
  selectedCategory.value = 'all'
  fetchMyEvents()
  nextTick(() => {
    inputRef.value?.focus()
    if (filteredCommands.value.length > 0) {
      activeCommandId.value = filteredCommands.value[0].id
    }
  })
}

const close = () => {
  isOpen.value = false
  query.value = ''
  activeCommandId.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  // Only trigger on dashboard pages
  if (route.path.startsWith('/dashboard')) {
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
      e.preventDefault()
      isOpen.value ? close() : open()
    }
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
})

defineExpose({ open, close })
</script>

<style scoped>
.palette-fade-enter-active,
.palette-fade-leave-active {
  transition: opacity 0.15s ease;
}

.palette-fade-enter-active .relative,
.palette-fade-leave-active .relative {
  transition: transform 0.15s ease, opacity 0.15s ease;
}

.palette-fade-enter-from,
.palette-fade-leave-to {
  opacity: 0;
}

.palette-fade-enter-from .relative {
  transform: translateY(-8px);
  opacity: 0;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
