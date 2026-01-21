<template>
    <nav class="fixed top-0 z-50 w-full transition-all duration-500" :class="navClasses">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300"
                        :class="logoBoxClasses">
                        <img src="/logo.png" alt="Logo" class="w-5 h-5 object-contain" />
                    </div>
                    <span class="text-xl font-black tracking-tight font-display transition-colors duration-300"
                        :class="logoTextClasses">Archeryhub<span class="text-logo-id">.id</span></span>
                </NuxtLink>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center gap-8">
                    <!-- Turnamen with Mega Menu -->
                    <div class="relative" @mouseenter="showMegaMenu = true" @mouseleave="showMegaMenu = false">
                        <button
                            class="font-medium text-sm transition-all duration-300 flex items-center gap-1 hover:text-primary"
                            :class="[navLinkClasses, { 'font-bold': isActive('/events') }]">
                            Event
                            <Icon icon="ph:caret-down" class="text-xs transition-transform"
                                :class="{ 'rotate-180': showMegaMenu }" />
                        </button>

                        <!-- Mega Menu Dropdown -->
                        <Transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition duration-150 ease-in"
                            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-1">
                            <div v-if="showMegaMenu" class="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[700px]">
                                <div class="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                                    <div class="grid grid-cols-12 gap-0">
                                        <!-- Featured Event -->
                                        <div class="col-span-5 bg-gradient-to-br from-navy to-navy-light p-6">
                                            <span class="text-primary text-xs font-bold uppercase tracking-wider">Event
                                                Unggulan</span>
                                            <div class="mt-3">
                                                <div class="aspect-video bg-white/10 rounded-lg overflow-hidden mb-3">
                                                    <img src="https://images.unsplash.com/photo-1565992441121-4367c2967103?w=400&h=225&fit=crop"
                                                        alt="Featured Event" class="w-full h-full object-cover" />
                                                </div>
                                                <h3 class="text-white font-bold text-sm leading-tight">National Indoor
                                                    Championship 2026</h3>
                                                <p class="text-white/70 text-xs mt-1">Jakarta • 25-28 Feb 2026</p>
                                                <NuxtLink to="/events"
                                                    class="inline-flex items-center gap-1 mt-3 text-primary text-xs font-bold hover:text-white transition-colors">
                                                    Cek Detailnya
                                                    <Icon icon="ph:arrow-right" />
                                                </NuxtLink>
                                            </div>
                                        </div>

                                        <!-- Categories & Links -->
                                        <div class="col-span-7 p-6">
                                            <div class="grid grid-cols-2 gap-8">
                                                <!-- By Category -->
                                                <div>
                                                    <span
                                                        class="text-gray-400 text-xs font-bold uppercase tracking-wider">Kategori</span>
                                                    <div class="mt-3 space-y-2">
                                                        <NuxtLink v-for="cat in categories" :key="cat.code"
                                                            :to="`/events?division=${cat.code}`"
                                                            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                                                            <div
                                                                class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                                                <Icon :icon="cat.icon" class="text-primary text-lg" />
                                                            </div>
                                                            <span
                                                                class="text-navy font-semibold text-sm group-hover:text-primary transition-colors">{{
                                                                    cat.name }}</span>
                                                        </NuxtLink>
                                                    </div>
                                                </div>

                                                <!-- Quick Links -->
                                                <div>
                                                    <span
                                                        class="text-gray-400 text-xs font-bold uppercase tracking-wider">Akses
                                                        Cepat</span>
                                                    <div class="mt-3 space-y-1">
                                                        <NuxtLink v-for="link in quickLinks" :key="link.to"
                                                            :to="link.to"
                                                            class="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 hover:text-navy text-sm">
                                                            <Icon :icon="link.icon" class="text-base" />
                                                            {{ link.label }}
                                                        </NuxtLink>
                                                    </div>

                                                    <!-- CTA -->
                                                    <div class="mt-4 pt-4 border-t border-gray-100">
                                                        <NuxtLink to="/events"
                                                            class="flex items-center justify-center gap-2 w-full py-2.5 bg-primary hover:bg-primary-hover text-navy font-bold text-sm rounded-lg transition-all">
                                                            <Icon icon="ph:list-bullets" />
                                                            Semua Turnamen
                                                        </NuxtLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <NuxtLink to="/klub" class="font-black text-sm transition-all duration-300 hover:text-primary"
                        :class="[navLinkClasses, { '!text-primary': isActive('/klub') }]">Klub</NuxtLink>
                    <NuxtLink to="/berita" class="font-black text-sm transition-all duration-300 hover:text-primary"
                        :class="[navLinkClasses, { '!text-primary': isActive('/berita') }]">Berita</NuxtLink>
                    <NuxtLink to="/shop" class="font-black text-sm transition-all duration-300 hover:text-primary"
                        :class="[navLinkClasses, { '!text-primary': isActive('/shop') }]">Marketplace</NuxtLink>
                </nav>

                <!-- Desktop Auth Buttons -->
                <div class="hidden md:flex items-center gap-3">
                    <!-- Logged In User Avatar -->
                    <div v-if="isLoggedIn" class="relative" @mouseenter="showUserMenu = true"
                        @mouseleave="showUserMenu = false">
                        <button class="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 transition-colors">
                            <div
                                class="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-amber-400 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                <img v-if="user?.avatar_url" :src="user.avatar_url"
                                    class="w-full h-full object-cover" />
                                <span v-else class="text-navy font-bold text-sm">{{ user?.name?.charAt(0) || 'U'
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
                                        <p class="font-bold text-navy truncate">{{ user?.name || 'User' }}</p>
                                        <p class="text-xs text-gray-400 truncate">{{ user?.email }}</p>
                                    </div>
                                    <NuxtLink to="/dashboard"
                                        class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy transition-colors">
                                        <Icon icon="ph:layout" class="text-lg" />
                                        Dashboard
                                    </NuxtLink>
                                    <NuxtLink to="/dashboard/settings"
                                        class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy transition-colors">
                                        <Icon icon="ph:gear" class="text-lg" />
                                        Pengaturan
                                    </NuxtLink>
                                    <div class="border-t border-gray-100 mt-2 pt-2">
                                        <button @click="handleLogout"
                                            class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                                            <Icon icon="ph:sign-out" class="text-lg" />
                                            Keluar
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
                            Masuk
                        </NuxtLink>
                        <NuxtLink to="/auth/register"
                            class="bg-primary hover:bg-primary-hover text-navy text-sm font-bold px-4 py-2 rounded-lg transition-colors">
                            Daftar
                        </NuxtLink>
                    </template>
                </div>

                <!-- Mobile Menu Toggle -->
                <button class="md:hidden transition-colors duration-300" :class="mobileToggleClasses"
                    @click="mobileMenuOpen = !mobileMenuOpen">
                    <Icon :icon="mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" class="text-2xl" />
                </button>
            </div>
        </div>

        <!-- Mobile Menu -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
            enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
            <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 shadow-lg">
                <div class="px-4 py-4 space-y-1">
                    <NuxtLink to="/" class="block text-navy font-medium text-sm py-3"
                        :class="{ 'text-primary font-bold': isActive('/') }">Beranda</NuxtLink>

                    <!-- Mobile Turnamen Submenu -->
                    <div>
                        <button @click="mobileSubmenuOpen = !mobileSubmenuOpen"
                            class="w-full flex items-center justify-between text-navy font-medium text-sm py-3">
                            <span :class="{ 'text-primary font-bold': isActive('/events') }">Turnamen</span>
                            <Icon icon="ph:caret-down" class="text-xs transition-transform"
                                :class="{ 'rotate-180': mobileSubmenuOpen }" />
                        </button>

                        <Transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-96"
                            leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 max-h-96"
                            leave-to-class="opacity-0 max-h-0">
                            <div v-if="mobileSubmenuOpen" class="pl-4 py-2 space-y-2 overflow-hidden">
                                <NuxtLink v-for="cat in categories" :key="cat.code" :to="`/events?division=${cat.code}`"
                                    class="flex items-center gap-3 py-2 text-gray-600 text-sm">
                                    <Icon :icon="cat.icon" class="text-primary" />
                                    {{ cat.name }}
                                </NuxtLink>
                                <div class="border-t border-gray-100 pt-2 mt-2">
                                    <NuxtLink to="/events"
                                        class="flex items-center gap-2 py-2 text-navy font-medium text-sm">
                                        <Icon icon="ph:list-bullets" />
                                        Semua Turnamen
                                    </NuxtLink>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <NuxtLink to="/klub" class="block text-gray-600 font-medium text-sm py-3"
                        :class="{ 'text-primary font-bold': isActive('/klub') }">Klub</NuxtLink>
                    <NuxtLink to="/berita" class="block text-gray-600 font-medium text-sm py-3"
                        :class="{ 'text-primary font-bold': isActive('/berita') }">Berita</NuxtLink>
                    <NuxtLink to="/shop" class="block text-gray-600 font-medium text-sm py-3"
                        :class="{ 'text-primary font-bold': isActive('/shop') }">Marketplace</NuxtLink>

                    <div class="pt-4 border-t border-gray-100 flex gap-3 mt-2">
                        <NuxtLink v-if="isLoggedIn" to="/dashboard"
                            class="flex-1 text-center py-2.5 bg-primary text-navy rounded-lg text-sm font-bold">
                            Dashboard
                        </NuxtLink>
                        <template v-else>
                            <NuxtLink to="/auth/login"
                                class="flex-1 text-center py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-navy">
                                Masuk
                            </NuxtLink>
                            <NuxtLink to="/auth/register"
                                class="flex-1 text-center py-2.5 bg-navy text-white rounded-lg text-sm font-bold">
                                Daftar
                            </NuxtLink>
                        </template>
                    </div>
                </div>
            </div>
        </Transition>
    </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const props = defineProps({
    transparent: {
        type: Boolean,
        default: false
    }
})

const route = useRoute()
const { isLoggedIn, user, logout } = useAuth()

const mobileMenuOpen = ref(false)
const mobileSubmenuOpen = ref(false)
const showMegaMenu = ref(false)
const showUserMenu = ref(false)
const isScrolled = ref(false)

const handleLogout = async () => {
    await logout()
}

// Scroll handler for transparent mode
const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
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

const logoBoxClasses = computed(() => {
    return showSolid.value ? 'bg-navy' : 'bg-primary'
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

const categories = [
    { code: 'recurve', name: 'Recurve', icon: 'ph:target-bold' },
    { code: 'compound', name: 'Compound', icon: 'ph:crosshair-bold' },
    { code: 'barebow', name: 'Barebow', icon: 'ph:circle-bold' },
    { code: 'traditional', name: 'Traditional', icon: 'ph:tree-bold' },
]

const quickLinks = [
    { to: '/events', label: 'Cek Semua Event', icon: 'ph:calendar-dots' },
    { to: '/events?status=ongoing', label: 'Lagi Berlangsung', icon: 'ph:lightning' },
    { to: '/events?status=upcoming', label: 'Bakal Digelar', icon: 'ph:clock' },
]

// Close mobile menu on route change
watch(() => route.path, () => {
    mobileMenuOpen.value = false
    mobileSubmenuOpen.value = false
})
</script>
