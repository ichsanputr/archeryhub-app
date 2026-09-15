<template>
    <nav class="z-50 w-full transition-all duration-500" :class="[isSticky ? 'fixed top-0' : 'absolute top-0', navClasses]">
        <div :class="isWide ? 'max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'">
            <div class="flex items-center justify-between h-14 md:h-16">
                <!-- Logo -->
                <div class="flex items-center gap-2.5 md:gap-3">
                    <NuxtLink to="/" class="flex items-center gap-2.5 md:gap-3 group">
                        <img src="/logo.png" alt="Archeris" class="h-7 w-7 md:h-8 md:w-8 object-contain transition-transform duration-300 group-hover:scale-105" />
                        <span class="text-lg md:text-xl font-black tracking-tight font-display transition-colors duration-300"
                            :class="logoTextClasses">Archeris</span>
                    </NuxtLink>
                    <div v-if="isBlogRoute" class="flex items-center gap-2 select-none">
                        <span :class="showSolid ? 'text-slate-300' : 'text-white/40'" class="text-base md:text-lg font-light">/</span>
                        <NuxtLink to="/blog" 
                            class="text-xs md:text-sm font-bold tracking-tight transition-colors"
                            :class="showSolid ? 'text-slate-600 hover:text-navy' : 'text-slate-200 hover:text-white'">
                            Blog
                        </NuxtLink>
                    </div>
                </div>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center gap-8 h-full">
                    <!-- Turnamen with Mega Menu -->
                    <div class="relative h-full flex items-center" @mouseenter="showMegaMenu = true" @mouseleave="showMegaMenu = false">
                        <button
                            class="text-sm font-semibold transition-all duration-300 flex items-center gap-1 px-1 h-full border-b-2 border-transparent hover:border-primary"
                            :class="[navLinkClasses, { '!border-primary font-bold': isActive('/tournaments') }]">
                            <span>{{ $t('nav.features') }}</span>
                            <Icon icon="ph:caret-down" class="text-xs transition-transform"
                                :class="{ 'rotate-185': showMegaMenu }" />
                        </button>

                        <!-- Mega Menu Dropdown -->
                        <Transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition duration-150 ease-in"
                            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                            <div v-if="showMegaMenu" class="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[460px] sm:w-[480px]">
                                <div class="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                                    <!-- Category Tabs Header -->
                                    <div class="p-2 bg-slate-50 border-b border-gray-100 flex items-center gap-1.5">
                                        <button 
                                            @click="megaMenuTab = 'platform'" 
                                            :class="[
                                                'flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                                                megaMenuTab === 'platform' 
                                                    ? 'bg-white text-navy shadow-xs border border-gray-200/80 font-black' 
                                                    : 'text-slate-500 hover:text-navy hover:bg-slate-100/60'
                                            ]"
                                        >
                                            <Icon icon="ph:lightning-fill" class="text-primary text-sm" />
                                            <span>Archeris Tournaments</span>
                                            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600">
                                                {{ platformEvents.length }}
                                            </span>
                                        </button>

                                        <button 
                                            @click="megaMenuTab = 'ianseo'" 
                                            :class="[
                                                'flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                                                megaMenuTab === 'ianseo' 
                                                    ? 'bg-white text-navy shadow-xs border border-gray-200/80 font-black' 
                                                    : 'text-slate-500 hover:text-navy hover:bg-slate-100/60'
                                            ]"
                                        >
                                            <Icon icon="ph:trophy-fill" class="text-primary text-sm" />
                                            <span>Ianseo Tournaments</span>
                                            <span class="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 text-slate-600">
                                                {{ externalEvents.length }}
                                            </span>
                                        </button>
                                    </div>

                                    <!-- Tab 1: Platform Tournaments Content (Compact) -->
                                    <div v-if="megaMenuTab === 'platform'" class="p-2.5 space-y-2">
                                        <div v-if="platformEvents.length > 0" class="space-y-1.5">
                                            <NuxtLink 
                                                v-for="event in platformEvents.slice(0, 3)" 
                                                :key="event.id"
                                                :to="`/tournaments/${event.slug || event.id}`"
                                                class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                            >
                                                <div class="w-8 h-8 rounded-lg bg-navy/10 text-navy flex items-center justify-center shrink-0 border border-slate-200/80 overflow-hidden">
                                                    <img v-if="event.image" :src="event.image" :alt="event.name" class="w-full h-full object-cover" />
                                                    <Icon v-else icon="ph:trophy-bold" class="text-sm" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <span class="block text-navy font-bold text-xs group-hover:text-primary-hover transition-colors truncate">
                                                        {{ event.name }}
                                                    </span>
                                                    <span class="block text-slate-400 text-[10px] font-medium truncate">
                                                        {{ event.location }} • {{ event.date }}
                                                    </span>
                                                </div>
                                                <Icon icon="ph:caret-right-bold" class="text-xs text-slate-300 group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0" />
                                            </NuxtLink>
                                        </div>
                                        <div v-else class="py-4 text-center text-slate-400 text-xs">
                                            <Icon icon="ph:calendar-blank" class="text-xl text-slate-300 mx-auto mb-1" />
                                            <p>{{ $t('nav.no_latest_events', 'No active tournaments at this moment') }}</p>
                                        </div>

                                        <!-- Footer CTA -->
                                        <div class="pt-2 border-t border-gray-100 flex items-center justify-between px-1">
                                            <span class="text-[10px] text-slate-400 font-medium">Live scoring & brackets</span>
                                            <NuxtLink to="/tournaments" class="text-xs font-bold text-navy hover:text-primary-hover transition-colors flex items-center gap-1">
                                                <span>All Tournaments</span>
                                                <Icon icon="ph:arrow-right-bold" class="text-xs" />
                                            </NuxtLink>
                                        </div>
                                    </div>

                                    <!-- Tab 2: Ianseo Archives Content (Compact) -->
                                    <div v-else-if="megaMenuTab === 'ianseo'" class="p-2.5 space-y-1.5">
                                        <div v-if="externalEvents.length > 0" class="space-y-1">
                                            <NuxtLink 
                                                v-for="event in externalEvents.slice(0, 3)" 
                                                :key="event.id"
                                                :to="`/tournaments/${event.slug || event.id}`"
                                                class="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                                            >
                                                <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80 text-navy">
                                                    <Icon icon="ph:seal-check-fill" class="text-base text-sky-500" />
                                                </div>
                                                <div class="flex-1 min-w-0">
                                                    <div class="flex items-center gap-1.5">
                                                        <span class="block text-navy font-bold text-xs group-hover:text-navy-light transition-colors truncate">
                                                            {{ event.name }}
                                                        </span>
                                                        <span class="px-1 py-0.2 rounded bg-slate-100 text-slate-700 text-[8px] font-bold border border-slate-200 shrink-0">
                                                            Ianseo
                                                        </span>
                                                    </div>
                                                    <span class="block text-slate-400 text-[10px] font-medium truncate">
                                                        {{ event.location }} • {{ event.date }}
                                                    </span>
                                                </div>
                                                <Icon icon="ph:caret-right-bold" class="text-xs text-slate-300 group-hover:text-navy group-hover:translate-x-0.5 transition-all shrink-0" />
                                            </NuxtLink>
                                        </div>
                                        <div v-else class="py-4 text-center text-slate-400 text-xs">
                                            <Icon icon="ph:archive-box" class="text-xl text-slate-300 mx-auto mb-1" />
                                            <p>No Ianseo archives available</p>
                                        </div>

                                        <!-- Footer CTA -->
                                        <div class="pt-2 border-t border-gray-100 flex items-center justify-between px-1">
                                            <span class="text-[10px] text-slate-400 font-medium">Official verified results</span>
                                            <NuxtLink to="/tournaments" class="text-xs font-bold text-navy hover:text-navy-light transition-colors flex items-center gap-1">
                                                <span>Browse Ianseo Events</span>
                                                <Icon icon="ph:arrow-right-bold" class="text-xs" />
                                            </NuxtLink>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <NuxtLink to="/docs"
                        class="font-semibold text-sm transition-all duration-300 hover:text-primary px-1 h-full flex items-center border-b-2 border-transparent hover:border-primary"
                        :class="[navLinkClasses, { '!border-primary font-bold': isActive('/docs') }]">
                        {{ $t('nav.docs') }}</NuxtLink>
                    <NuxtLink to="/blog"
                        class="font-semibold text-sm transition-all duration-300 hover:text-primary px-1 h-full flex items-center border-b-2 border-transparent hover:border-primary"
                        :class="[navLinkClasses, { '!border-primary font-bold': isActive('/blog') }]">
                        {{ $t('nav.blog') }}</NuxtLink>
                    <NuxtLink to="/package"
                        class="font-semibold text-sm transition-all duration-300 hover:text-primary px-1 h-full flex items-center border-b-2 border-transparent hover:border-primary"
                        :class="[navLinkClasses, { '!border-primary font-bold': isActive('/package') }]">
                        {{ $t('nav.pricing') }}
                    </NuxtLink>
                </nav>

                <!-- Desktop Auth & Cart Buttons -->
                <div class="hidden md:flex items-center gap-3">

                    <!-- Logged In User Avatar -->
                    <div v-if="isLoggedIn" class="relative" @mouseenter="showUserMenu = true"
                        @mouseleave="showUserMenu = false">
                        <button class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <div
                                class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                <img v-if="user?.avatar_url" :src="user.avatar_url"
                                    class="w-full h-full object-cover" />
                                <span v-else class="text-navy font-bold text-sm">{{ user?.full_name?.charAt(0) || 'U'
                                }}</span>
                            </div>
                        </button>

                        <!-- User Dropdown Menu -->
                        <Transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition duration-150 ease-in"
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
                                        {{ $t('nav.settings') || 'Pengaturan' }}
                                    </NuxtLink>
                                    <div class="border-t border-gray-100 mt-2 pt-2">
                                        <button @click="handleLogout"
                                            class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                                            <Icon icon="ph:sign-out" class="text-lg" />
                                            {{ $t('nav.logout') || 'Keluar' }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                    <template v-else>
                        <NuxtLink to="/auth/login"
                            class="text-sm font-bold px-4 py-2 rounded-lg transition-colors border"
                            :class="authButtonClasses">
                            {{ $t('nav.login') }}
                        </NuxtLink>
                        <NuxtLink to="/auth/register"
                            class="bg-primary hover:bg-primary-hover text-primary-text text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                            {{ $t('nav.register') }}
                        </NuxtLink>
                    </template>
                </div>

                <!-- Mobile Menu Toggle -->
                <div class="flex items-center gap-1 md:gap-2 md:hidden">
                    <button class="p-1.5 transition-colors duration-300" :class="mobileToggleClasses"
                        @click="mobileMenuOpen = !mobileMenuOpen">
                        <Icon :icon="mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" class="text-xl" />
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
        <Transition enter-active-class="transition-transform duration-500 ease-spring"
            enter-from-class="translate-x-full" enter-to-class="translate-x-0"
            leave-active-class="transition-transform duration-400 ease-in-out" leave-from-class="translate-x-0"
            leave-to-class="translate-x-full">
            <div v-if="mobileMenuOpen"
                class="fixed top-0 right-0 w-[300px] h-full bg-white z-50 md:hidden shadow-2xl flex flex-col">
                <!-- Drawer Header -->
                <div class="flex items-center justify-between p-6 border-b border-gray-100">
                    <div class="flex items-center gap-2.5">
                        <NuxtLink to="/" @click="mobileMenuOpen = false" class="flex items-center gap-2.5">
                            <img src="/logo.png" alt="Archeris" class="h-8 w-8 object-contain" />
                            <span class="text-lg font-black tracking-tight text-navy">Archeris</span>
                        </NuxtLink>
                        <div v-if="isBlogRoute" class="flex items-center gap-2 select-none">
                            <span class="text-gray-300 text-lg font-light">/</span>
                            <NuxtLink to="/blog" @click="mobileMenuOpen = false"
                                class="text-sm font-bold text-gray-500 hover:text-navy transition-colors">
                                Blog
                            </NuxtLink>
                        </div>
                    </div>
                    <button @click="mobileMenuOpen = false"
                        class="p-2 hover:bg-gray-100 rounded-xl transition-all scale-100">
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
                                <img v-if="user?.avatar_url" :src="user.avatar_url"
                                    class="w-full h-full object-cover" />
                                <span v-else class="text-navy font-black text-xl">{{ user?.full_name?.charAt(0) || 'U'
                                }}</span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="text-navy font-black truncate">{{ user?.full_name || 'User' }}</div>
                                <div class="text-xs text-gray-400 truncate">{{ user?.email }}</div>
                                <span
                                    class="inline-block mt-2 px-2 py-0.5 bg-primary/20 text-navy text-[10px] font-black rounded  tracking-wider">
                                    {{ user?.user_type || 'Archer' }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <div class="p-4 space-y-1">
                        <NuxtLink v-for="link in [
                            { to: '/', label: $t('nav.home'), icon: 'ph:house-bold' },
                            { to: '/docs', label: $t('nav.docs'), icon: 'ph:book-open-bold' },
                            { to: '/blog', label: $t('nav.blog'), icon: 'ph:article-bold' },
                            { to: '/package', label: $t('nav.pricing'), icon: 'ph:credit-card-bold' },
                        ]" :key="link.to" :to="link.to" @click="mobileMenuOpen = false"
                            class="flex items-center gap-4 p-4 rounded-2xl transition-all group"
                            :class="isActive(link.to) ? 'bg-primary text-primary-text' : 'text-gray-500 hover:bg-gray-50 hover:text-navy'">
                            <Icon :icon="link.icon" class="text-xl" />
                            <span class="font-black text-sm tracking-wide">{{ link.label }}</span>
                        </NuxtLink>

                        <!-- Mobile Turnamen with Accordion -->
                        <div class="relative pt-2">
                            <button @click="mobileSubmenuOpen = !mobileSubmenuOpen"
                                class="w-full flex items-center justify-between p-4 rounded-2xl transition-all text-gray-500 hover:bg-gray-50 hover:text-navy">
                                <div class="flex items-center gap-4">
                                    <Icon icon="ph:target-bold" class="text-xl" />
                                    <span class="font-black text-sm tracking-wide">{{ $t('nav.features') || 'Tournaments' }}</span>
                                </div>
                                <Icon icon="ph:caret-down-bold" class="text-xs transition-transform duration-300"
                                    :class="{ 'rotate-180': mobileSubmenuOpen }" />
                            </button>

                            <Transition enter-active-class="transition-all duration-300 ease-out"
                                enter-from-class="max-h-0 opacity-0" enter-to-class="max-h-96 opacity-100"
                                leave-active-class="transition-all duration-200 ease-in"
                                leave-from-class="max-h-96 opacity-100" leave-to-class="max-h-0 opacity-0">
                                <div v-if="mobileSubmenuOpen" class="pl-12 pr-4 space-y-1 overflow-hidden">
                                    <NuxtLink v-for="event in latestEvents" :key="event.id"
                                        :to="`/tournaments/${event.slug || event.id}`" @click="mobileMenuOpen = false"
                                        class="flex items-center gap-3 py-3 text-gray-500 hover:text-navy text-xs font-bold transition-colors">
                                        <div class="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></div>
                                        <span class="truncate">{{ event.name }}</span>
                                    </NuxtLink>
                                    <NuxtLink to="/tournaments" @click="mobileMenuOpen = false"
                                        class="flex items-center gap-3 py-3 text-navy text-xs font-black transition-colors border-t border-gray-50 mt-2">
                                        <Icon icon="ph:list-bullets-bold" class="text-sm" />
                                        {{ $t('nav.view_all_tournaments') || 'All Tournaments' }}
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
                            class="flex items-center justify-center gap-2 w-full py-3.5 bg-navy text-white rounded-2xl text-sm font-black tracking-wider shadow-sm shadow-navy/20 transition-all">
                            <Icon icon="ph:layout-bold" />
                            Dashboard
                        </NuxtLink>
                        <button @click="handleLogout(); mobileMenuOpen = false"
                            class="flex items-center justify-center gap-2 w-full py-3.5 border-2 border-red-50 text-red-500 rounded-2xl text-sm font-black tracking-wider hover:bg-red-50 transition-all cursor-pointer">
                            <Icon icon="ph:sign-out-bold" />
                            {{ $t('nav.logout') || 'Logout' }}
                        </button>
                    </div>
                    <div v-else class="grid grid-cols-2 gap-3">
                        <NuxtLink to="/auth/login" @click="mobileMenuOpen = false"
                            class="flex items-center justify-center py-3.5 border-2 border-gray-50 text-navy rounded-2xl text-sm font-black tracking-wider hover:bg-gray-50 transition-all">
                            {{ $t('nav.login') }}
                        </NuxtLink>
                        <NuxtLink to="/auth/register" @click="mobileMenuOpen = false"
                            class="flex items-center justify-center py-3.5 bg-primary text-primary-text rounded-2xl text-sm font-black tracking-wider shadow-lg shadow-primary/20 transition-all">
                            {{ $t('nav.register') }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<script setup>
const props = defineProps({
    transparent: {
        type: Boolean,
        default: false
    }
})

const route = useRoute()
const { isLoggedIn, user, userPersona, logout } = useAuth()

const isBlogRoute = computed(() => route.path.startsWith('/blog'))
const isSticky = computed(() => route.meta.headerSticky !== false)
const isWide = computed(() => route.meta.wideContainer === true)

const mobileMenuOpen = ref(false)
const mobileSubmenuOpen = ref(false)
const showMegaMenu = ref(false)
const showUserMenu = ref(false)
const showLangMenu = ref(false)
const showLangMenuMobile = ref(false)
const isScrolled = ref(false)
const { get } = useApi()

const handleLogout = async () => {
    await logout()
}

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    fetchLatestEvents()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

// Dynamic classes based on transparent mode and scroll state
const showSolid = computed(() => !props.transparent || isScrolled.value)

const navClasses = computed(() => {
    if (showSolid.value) {
        return 'bg-white border-b border-gray-200 shadow-sm'
    }
    return 'bg-transparent border-transparent'
})


const logoTextClasses = computed(() => {
    return showSolid.value ? 'text-navy' : 'text-white'
})

const navLinkClasses = computed(() => {
    return showSolid.value ? 'text-gray-600 hover:text-navy' : 'text-white/80'
})

const authButtonClasses = computed(() => {
    return showSolid.value
        ? 'border-gray-200 text-navy hover:bg-gray-50'
        : 'border-white/30 text-white hover:bg-white/10'
})

const mobileToggleClasses = computed(() => {
    return showSolid.value ? 'text-navy' : 'text-white'
})

const isActive = (path) => {
    if (path === '/') {
        return route.path === '/'
    }
    return route.path.startsWith(path)
}

const dashboardUrl = computed(() => {
    // Direct persona path to avoid middleware hop
    const persona = userPersona.value
    if (persona === 'organizer' || persona === 'archer') return `/dashboard/${persona}/tournaments`
    return `/dashboard/${persona}`
})

const megaMenuTab = ref('platform')
const platformEvents = ref([])
const externalEvents = ref([])
const latestEvents = ref([])

function toTitleCase(str) {
    if (!str) return ''
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())
}

const fetchLatestEvents = async () => {
    try {
        const [platformRes, externalRes] = await Promise.all([
            get('/tournaments?limit=10').catch(() => ({ events: [] })),
            get('/tournaments/external').catch(() => ({ tournaments: [] }))
        ])

        const rawPlatform = platformRes?.events || platformRes?.data || (Array.isArray(platformRes) ? platformRes : [])
        const rawExternal = externalRes?.tournaments || []

        platformEvents.value = rawPlatform.map(event => ({
            id: event.uuid || event.id,
            slug: event.slug,
            name: toTitleCase(event.name),
            location: event.venue || event.location || 'TBA',
            date: event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA',
            image: event.logo_url || event.banner_url || 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&h=225&fit=crop',
            isExternal: false
        }))

        externalEvents.value = rawExternal.map(event => ({
            id: event.uuid || event.id,
            slug: event.slug,
            name: toTitleCase(event.name),
            location: event.venue || event.location || 'TBA',
            date: event.start_date ? new Date(event.start_date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA',
            image: event.logo_url || event.banner_url || 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&h=225&fit=crop',
            isExternal: true
        }))

        latestEvents.value = [...platformEvents.value, ...externalEvents.value].slice(0, 5)
    } catch (error) {
        console.error('Failed to fetch latest events for mega menu:', error)
    }
}

// Close menus and reset scroll state on route change
watch(() => route.path, () => {
    mobileMenuOpen.value = false
    mobileSubmenuOpen.value = false
    showMegaMenu.value = false
    showUserMenu.value = false
    showLangMenu.value = false
    showLangMenuMobile.value = false

    // Force immediate re-check of scroll position after navigation
    if (import.meta.client) {
        handleScroll()
        nextTick(() => {
            handleScroll()
        })
        setTimeout(() => {
            handleScroll()
        }, 100)
    }
})
</script>
