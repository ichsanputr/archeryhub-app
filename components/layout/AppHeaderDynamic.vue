<template>
  <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm transition-all duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center bg-navy transition-all duration-300">
            <img src="/logo.png" alt="Logo" class="w-5 h-5 object-contain" />
          </div>
          <span class="text-xl font-black tracking-tight font-display text-navy">Archeris</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8 h-full">
          <!-- Turnamen with Mega Menu -->
          <div class="relative h-full flex items-center" @mouseenter="showMegaMenu = true" @mouseleave="showMegaMenu = false">
            <button
            class="text-sm font-semibold transition-all duration-300 flex items-center gap-1 hover:text-navy px-1 h-full border-b-2 border-transparent hover:border-primary text-gray-600"
              :class="{ '!border-primary font-bold text-navy': isActive('/events') }">
              <span>Event</span>
              <Icon icon="ph:caret-down" class="text-xs transition-transform" :class="{ 'rotate-180': showMegaMenu }" />
            </button>

            <!-- Mega Menu Dropdown -->
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
              <div v-if="showMegaMenu" class="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[700px]">
                <div class="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div class="grid grid-cols-12 gap-0 min-h-[350px]">
                    <!-- Featured Event -->
                    <div class="col-span-5 bg-gradient-to-br from-navy to-navy-light p-6 flex flex-col">
                      <span class="text-primary text-xs font-bold tracking-wider ">{{ t('nav.featured_event') }}</span>
                      <div class="mt-3 flex-1 flex flex-col justify-center" v-if="featuredEvent">
                        <div class="aspect-video bg-white/10 rounded-lg overflow-hidden mb-3">
                          <img :src="featuredEvent.image" :alt="featuredEvent.name"
                            class="w-full h-full object-cover" />
                        </div>
                        <h3 class="text-white font-bold text-sm leading-tight line-clamp-2">
                          {{ featuredEvent.name }}
                        </h3>
                        <p class="text-white/70 text-xs mt-1">{{ featuredEvent.location }} â€¢ {{
                          featuredEvent.date }}</p>
                        <NuxtLink :to="`/events/${featuredEvent.slug || featuredEvent.id}`"
                          class="inline-flex items-center gap-1 mt-3 text-primary text-xs font-bold hover:text-white transition-colors tracking-widest">
                          {{ t('nav.check_details') }}
                          <Icon icon="ph:arrow-right" />
                        </NuxtLink>
                      </div>
                      <div v-else class="flex-1 flex flex-col items-center justify-center text-center">
                        <Icon icon="ph:calendar-blank-light" class="text-4xl text-white/20 mb-3" />
                        <p class="text-white/40 text-xs">{{ t('nav.no_featured_event') }}</p>
                      </div>
                    </div>

                    <!-- Latest Events -->
                    <div class="col-span-7 p-6 flex flex-col">
                      <div class="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                        <span class="text-gray-400 text-[10px] font-black tracking-widest ">{{ t('nav.latest_events') }}</span>
                        <NuxtLink to="/events"
                          class="text-navy hover:text-primary text-[10px] font-black tracking-widest transition-colors">
                          {{ t('nav.view_all') }}
                        </NuxtLink>
                      </div>
                      <div v-if="latestEvents.length > 0" class="space-y-2 flex-1 flex flex-col justify-start">
                        <NuxtLink v-for="event in latestEvents.slice(0, 5)" :key="event.id"
                          :to="`/events/${event.slug || event.id}`"
                          class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                          <div class="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            <img :src="event.image" class="w-full h-full object-cover" />
                          </div>
                          <div class="flex-1 min-w-0">
                            <span
                              class="block text-navy font-semibold text-sm group-hover:text-primary transition-colors truncate">
                              {{ event.name }}
                            </span>
                            <span class="block text-gray-400 text-[10px] font-medium">{{
                              event.location }} â€¢ {{ event.date }}</span>
                          </div>
                        </NuxtLink>
                      </div>
                      <div v-else class="flex-1 flex flex-col items-center justify-center text-center">
                        <Icon icon="ph:calendar-blank-light" class="text-4xl text-gray-100 mb-2" />
                        <p class="text-gray-400 text-xs">{{ t('nav.no_latest_events') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>


          <NuxtLink to="/archeris-vs-ianseo"
            class="text-gray-600 font-semibold text-sm transition-all duration-300 px-1 h-full flex items-center border-b-2 border-transparent hover:border-primary hover:text-navy"
            :class="{ '!border-primary font-bold text-navy': isActive('/archeris-vs-ianseo') }">
            {{ t('nav.archeris_vs_ianseo') }}</NuxtLink>
          <NuxtLink to="/blog"
            class="text-gray-600 font-semibold text-sm transition-all duration-300 px-1 h-full flex items-center border-b-2 border-transparent hover:border-primary hover:text-navy"
            :class="{ '!border-primary font-bold text-navy': isActive('/blog') }">
            {{ t('nav.blog') }}</NuxtLink>
          <NuxtLink to="/docs"
            class="text-gray-600 font-semibold text-sm transition-all duration-300 px-1 h-full flex items-center border-b-2 border-transparent hover:border-primary hover:text-navy"
            :class="{ '!border-primary font-bold text-navy': isActive('/docs') }">
            {{ t('nav.docs') }}</NuxtLink>
          <NuxtLink to="/pricing"
            class="text-gray-600 font-semibold text-sm transition-all duration-300 px-1 h-full flex items-center border-b-2 border-transparent hover:border-primary hover:text-navy"
            :class="{ '!border-primary font-bold text-navy': isActive('/pricing') }">
            {{ t('nav.pricing') }}
          </NuxtLink>
        </nav>

        <!-- Desktop Auth Buttons -->
        <div class="hidden md:flex items-center gap-3">
          <!-- Cart Icon (For Archers) -->
          <NuxtLink v-if="isLoggedIn && user?.user_type === 'archer'" to="/dashboard/archer/cart"
            class="relative p-2 rounded-xl text-navy hover:bg-gray-100 transition-all duration-300 group">
            <Icon icon="ph:shopping-bag-bold" class="text-2xl" />
            <span v-if="cartCount > 0"
              class="absolute top-1 right-1 w-5 h-5 bg-primary text-primary-text text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-primary/20">
              {{ cartCount }}
            </span>
          </NuxtLink>

          <!-- Logged In User Avatar -->
          <div v-if="isLoggedIn" class="relative" @mouseenter="showUserMenu = true" @mouseleave="showUserMenu = false">
            <button class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
              <div
                class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                <img v-if="user?.avatar_url" :src="user.avatar_url" class="w-full h-full object-cover" />
                <span v-else class="text-navy font-bold text-sm">{{ user?.full_name?.charAt(0) || 'U'
                }}</span>
              </div>
            </button>

            <!-- User Dropdown Menu -->
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
              <div v-if="showUserMenu" class="absolute right-0 top-full pt-2 w-56">
                <div class="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2">
                  <div class="px-4 py-3 border-b border-gray-100">
                    <div class="font-bold text-navy truncate">{{ user?.full_name || 'User' }}</div>
                    <div class="text-xs text-gray-400 truncate">{{ user?.email }}</div>
                  </div>
                  <NuxtLink :to="dashboardUrl" @click="showUserMenu = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy transition-colors">
                    <Icon icon="ph:layout" class="text-lg" />
                    Dashboard
                  </NuxtLink>
                  <NuxtLink :to="`/dashboard/${userPersona}/settings`" @click="showUserMenu = false"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy transition-colors">
                    <Icon icon="ph:gear" class="text-lg" />
                    {{ t('nav.settings') }}
                  </NuxtLink>
                  <div class="border-t border-gray-100 mt-2 pt-2">
                    <button @click="handleLogout"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                      <Icon icon="ph:sign-out" class="text-lg" />
                      {{ t('nav.logout') }}
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
          <template v-else>
            <NuxtLink to="/auth/login"
              class="text-sm font-bold px-4 py-2 rounded-lg transition-colors border border-gray-200 text-navy hover:bg-gray-50">
              {{ t('nav.login') }}
            </NuxtLink>
            <NuxtLink to="/auth/register"
              class="bg-primary hover:bg-primary-hover text-primary-text text-sm font-bold px-4 py-2 rounded-lg transition-colors">
              {{ t('nav.register') }}
            </NuxtLink>
          </template>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="flex items-center gap-2 md:hidden">
          <!-- Mobile Cart (For Archers) -->
          <NuxtLink v-if="isLoggedIn && user?.user_type === 'archer'" to="/dashboard/archer/cart"
            class="relative p-2 rounded-xl text-navy transition-all duration-300">
            <Icon icon="ph:shopping-bag-bold" class="text-2xl" />
            <span v-if="cartCount > 0"
              class="absolute top-1 right-1 w-5 h-5 bg-primary text-navy text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-primary/20">
              {{ cartCount }}
            </span>
          </NuxtLink>

          <button class="p-2 text-navy transition-colors duration-300" @click="mobileMenuOpen = !mobileMenuOpen">
            <Icon :icon="mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" class="text-2xl" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Backdrop -->
    <Transition enter-active-class="transition-opacity duration-300 ease-linear" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition-opacity duration-300 ease-linear"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="mobileMenuOpen" class="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40 md:hidden"
        @click="mobileMenuOpen = false"></div>
    </Transition>

    <!-- Mobile Drawer -->
    <Transition enter-active-class="transition-transform duration-500 ease-spring" enter-from-class="translate-x-full"
      enter-to-class="translate-x-0" leave-active-class="transition-transform duration-400 ease-in-out"
      leave-from-class="translate-x-0" leave-to-class="translate-x-full">
      <div v-if="mobileMenuOpen"
        class="fixed top-0 right-0 w-[300px] h-full bg-white z-50 md:hidden shadow-2xl flex flex-col">
        <!-- Drawer Header -->
        <div class="p-6 border-b border-gray-50 flex items-center justify-between bg-white relative">
          <NuxtLink to="/" @click="mobileMenuOpen = false" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
              <img src="/logo.png" alt="Logo" class="w-5 h-5 object-contain" />
            </div>
            <span class="text-lg font-black tracking-tight text-navy ">Archeris</span>
          </NuxtLink>
          <button @click="mobileMenuOpen = false" class="p-2 hover:bg-gray-100 rounded-xl transition-all scale-100">
            <Icon icon="ph:x-bold" class="text-xl text-navy" />
          </button>
        </div>

        <!-- Drawer Content -->
        <div class="flex-1 overflow-y-auto">
          <!-- User Profile section -->
          <div v-if="isLoggedIn" class="p-6 bg-gray-50/50 border-b border-gray-100">
            <div class="flex items-center gap-4">
              <div
                class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-amber-400 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                <img v-if="user?.avatar_url" :src="user.avatar_url" class="w-full h-full object-cover" />
                <span v-else class="text-navy font-black text-xl text-center">{{ user?.full_name?.charAt(0) || 'U'
                }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-navy font-black truncate">{{ user?.full_name || 'User' }}</div>
                <div class="text-xs text-gray-400 truncate">{{ user?.email }}</div>
                <span
                  class="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-navy text-[10px] font-black rounded tracking-wider ">
                  {{ user?.user_type || 'Archer' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="p-4 space-y-1">
            <NuxtLink v-for="link in [
              { to: '/', label: t('nav.home'), icon: 'ph:house-bold' },
              { to: '/archeris-vs-ianseo', label: t('nav.archeris_vs_ianseo'), icon: 'ph:scales-bold' },
              { to: '/blog', label: t('nav.blog'), icon: 'ph:newspaper-bold' },
              { to: '/docs', label: t('nav.docs'), icon: 'ph:book-open-bold' },
              { to: '/pricing', label: t('nav.pricing'), icon: 'ph:credit-card-bold' },
            ]" :key="link.to" :to="link.to" @click="mobileMenuOpen = false"
              class="flex items-center gap-4 p-4 rounded-2xl transition-all group"
              :class="isActive(link.to) ? 'bg-primary text-primary-text font-black' : 'text-gray-500 hover:bg-gray-50 hover:text-navy'">
              <Icon :icon="link.icon" class="text-xl" />
              <span class="font-black text-sm tracking-wider">{{ link.label }}</span>
            </NuxtLink>

            <!-- Mobile Turnamen with Accordion -->
            <div class="relative pt-2">
              <button @click="mobileSubmenuOpen = !mobileSubmenuOpen"
                class="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-gray-500 hover:bg-gray-50 hover:text-navy">
                <div class="flex items-center gap-4 font-black">
                  <Icon icon="ph:target-bold" class="text-xl" />
                  <span class="font-black text-sm tracking-wider">Event</span>
                </div>
                <Icon icon="ph:caret-down-bold" class="text-xs transition-transform duration-300"
                  :class="{ 'rotate-180': mobileSubmenuOpen }" />
              </button>

              <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="max-h-0 opacity-0"
                enter-to-class="max-h-96 opacity-100" leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="max-h-96 opacity-100" leave-to-class="max-h-0 opacity-0">
                <div v-if="mobileSubmenuOpen" class="pl-12 pr-4 space-y-1 overflow-hidden">
                  <NuxtLink v-for="event in latestEvents" :key="event.id" :to="`/events/${event.slug || event.id}`"
                    @click="mobileMenuOpen = false"
                    class="flex items-center gap-3 py-3 text-gray-500 hover:text-navy text-xs font-bold transition-colors">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                    <span class="truncate">{{ event.name }}</span>
                  </NuxtLink>
                  <NuxtLink to="/events" @click="mobileMenuOpen = false"
                    class="flex items-center gap-3 py-3 text-navy text-xs font-black transition-colors border-t border-gray-50 mt-2">
                    <Icon icon="ph:list-bullets-bold" class="text-sm" />
                    {{ t('nav.all_events') }}
                  </NuxtLink>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Drawer Footer -->
        <div class="p-6 border-t border-gray-50 bg-white">
          <div v-if="isLoggedIn" class="space-y-3">
            <NuxtLink :to="dashboardUrl" @click="mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 w-full py-3.5 bg-navy text-white rounded-2xl text-sm font-black tracking-widest shadow-sm shadow-navy/20 transition-all">
              <Icon icon="ph:layout-bold" />
              Dashboard
            </NuxtLink>
            <button @click="handleLogout(); mobileMenuOpen = false"
              class="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-red-50 text-red-500 rounded-2xl text-sm font-black tracking-widest hover:bg-red-50 transition-all">
              <Icon icon="ph:sign-out-bold" />
              {{ t('nav.logout') }}
            </button>
          </div>
          <div v-else class="grid grid-cols-2 gap-3">
            <NuxtLink to="/auth/login" @click="mobileMenuOpen = false"
              class="flex items-center justify-center py-3.5 border-2 border-gray-50 text-navy rounded-2xl text-[10px] font-black tracking-widest hover:bg-gray-50 transition-all">
              {{ t('nav.login') }}
            </NuxtLink>
            <NuxtLink to="/auth/register" @click="mobileMenuOpen = false"
              class="flex items-center justify-center py-3.5 bg-primary text-primary-text rounded-2xl text-[10px] font-black tracking-widest shadow-lg shadow-primary/20 transition-all">
              {{ t('nav.register') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useApi } from '~/composables/useApi'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const route = useRoute()
const { isLoggedIn, user, userPersona, logout } = useAuth()
const { get } = useApi()

const mobileMenuOpen = ref(false)
const mobileSubmenuOpen = ref(false)
const showMegaMenu = ref(false)
const showUserMenu = ref(false)
const cartCount = ref(0)
const latestEvents = ref([])
const featuredEvent = ref(null)

const fetchCartCount = async () => {
  if (isLoggedIn.value && user.value?.user_type === 'archer') {
    try {
      const response = await get('/cart')
      cartCount.value = response.data?.length || 0
    } catch (error) {
      console.error('Failed to fetch cart count:', error)
    }
  } else {
    cartCount.value = 0
  }
}

const fetchLatestEvents = async () => {
  try {
    const response = await get('/events?limit=10')
    let events = []
    if (Array.isArray(response)) events = response
    else if (response?.data) events = response.data
    else if (response?.events) events = response.events

    const transformed = events.map(event => ({
      id: event.uuid || event.id,
      slug: event.slug,
      name: event.name,
      location: event.venue || event.location || 'TBA',
      date: event.start_date ? new Date(event.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'TBA',
      image: event.logo_url || event.banner_url || 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&h=225&fit=crop'
    }))

    latestEvents.value = transformed.slice(0, 5)
    if (transformed.length > 0) {
      featuredEvent.value = transformed[Math.floor(Math.random() * transformed.length)]
    }
  } catch (error) {
    console.error('Failed to fetch latest events:', error)
  }
}

const handleLogout = async () => {
  await logout()
}

// Watch for auth changes
watch(() => isLoggedIn.value, (val) => {
  if (val) fetchCartCount()
  else cartCount.value = 0
}, { immediate: true })

let cartInterval
onMounted(() => {
  fetchCartCount()
  fetchLatestEvents()
  cartInterval = setInterval(fetchCartCount, 30000)
})

onUnmounted(() => {
  if (cartInterval) clearInterval(cartInterval)
})

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const dashboardUrl = computed(() => {
  const persona = userPersona.value
  if (persona === 'organization' || persona === 'archer') return `/dashboard/${persona}/events`
  return `/dashboard/${persona}`
})

// Reset state on route change
watch(() => route.path, () => {
  mobileMenuOpen.value = false
  mobileSubmenuOpen.value = false
  showMegaMenu.value = false
  showUserMenu.value = false
})
</script>
