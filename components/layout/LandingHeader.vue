<template>
    <nav class="bg-white border-b border-gray-200 shadow-sm relative z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <NuxtLink to="/" class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" class="w-5 h-5 object-contain" />
                    </div>
                    <span class="text-navy text-xl font-black tracking-tight font-display">Archeryhub<span
                            class="text-logo-id">.id</span></span>
                </NuxtLink>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center gap-8">
                    <NuxtLink to="/" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/') }">
                        Beranda
                    </NuxtLink>

                    <!-- Turnamen with Mega Menu -->
                    <div class="relative" @mouseenter="showMegaMenu = true" @mouseleave="showMegaMenu = false">
                        <button
                            class="text-gray-600 hover:text-navy font-medium text-sm transition-colors flex items-center gap-1"
                            :class="{ 'text-navy font-bold': isActive('/events') }">
                            Turnamen
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
                                            <span
                                                class="text-primary text-xs font-bold uppercase tracking-wider">Featured
                                                Event</span>
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
                                                    Lihat Detail
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
                                                            <div>
                                                                <span
                                                                    class="text-navy font-semibold text-sm group-hover:text-primary transition-colors">{{
                                                                    cat.name }}</span>
                                                            </div>
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

                    <NuxtLink to="/berita" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/berita') }">
                        Berita
                    </NuxtLink>
                </nav>

                <div class="flex items-center gap-3">
                    <NuxtLink to="/auth/login" class="hidden md:flex text-gray-500 font-medium text-xs hover:text-navy">
                        Masuk
                    </NuxtLink>
                    <NuxtLink to="/auth/register"
                        class="hidden sm:flex bg-navy hover:bg-navy-light text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-lg">
                        Daftar
                    </NuxtLink>
                    <!-- Mobile Menu Button -->
                    <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-navy p-2">
                        <Icon :icon="mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'" class="text-2xl" />
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <Transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2">
                <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 py-4 px-4">
                    <NuxtLink to="/" class="block text-gray-600 font-medium text-sm py-3"
                        :class="{ 'text-navy font-bold': isActive('/') }">Beranda</NuxtLink>

                    <!-- Turnamen Accordion -->
                    <div class="border-b border-gray-50">
                        <button @click="mobileSubmenuOpen = !mobileSubmenuOpen"
                            class="flex items-center justify-between w-full py-3 text-gray-600 font-medium text-sm"
                            :class="{ 'text-primary font-bold': isActive('/events') }">
                            Turnamen
                            <Icon icon="ph:caret-down" class="text-sm transition-transform"
                                :class="{ 'rotate-180': mobileSubmenuOpen }" />
                        </button>

                        <Transition enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0 max-h-0" enter-to-class="opacity-100 max-h-96"
                            leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 max-h-96"
                            leave-to-class="opacity-0 max-h-0">
                            <div v-if="mobileSubmenuOpen" class="overflow-hidden pb-2">
                                <div class="pl-4 space-y-1">
                                    <NuxtLink v-for="cat in categories" :key="cat.code"
                                        :to="`/events?division=${cat.code}`"
                                        class="flex items-center gap-3 py-2.5 text-gray-500 text-sm hover:text-navy">
                                        <Icon :icon="cat.icon" class="text-base text-primary" />
                                        {{ cat.name }}
                                    </NuxtLink>
                                    <div class="border-t border-gray-100 my-2 pt-2">
                                        <NuxtLink v-for="link in quickLinks" :key="link.to" :to="link.to"
                                            class="flex items-center gap-3 py-2.5 text-gray-500 text-sm hover:text-navy">
                                            <Icon :icon="link.icon" class="text-base" />
                                            {{ link.label }}
                                        </NuxtLink>
                                    </div>
                                    <NuxtLink to="/events"
                                        class="flex items-center justify-center gap-2 mt-2 py-2.5 bg-gray-50 text-navy font-semibold text-sm rounded-lg">
                                        <Icon icon="ph:list-bullets" />
                                        Semua Turnamen
                                    </NuxtLink>
                                </div>
                            </div>
                        </Transition>
                    </div>

                    <NuxtLink to="/berita" class="block text-gray-600 font-medium text-sm py-3"
                        :class="{ 'text-primary font-bold': isActive('/berita') }">Berita</NuxtLink>

                    <div class="pt-4 border-t border-gray-100 flex gap-3 mt-2">
                        <NuxtLink to="/auth/login"
                            class="flex-1 text-center py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-navy">
                            Masuk
                        </NuxtLink>
                        <NuxtLink to="/auth/register"
                            class="flex-1 text-center py-2.5 bg-navy text-white rounded-lg text-sm font-bold">
                            Daftar
                        </NuxtLink>
                    </div>
                </div>
            </Transition>
        </div>
    </nav>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const route = useRoute()
const mobileMenuOpen = ref(false)
const mobileSubmenuOpen = ref(false)
const showMegaMenu = ref(false)

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
    { to: '/events', label: 'Semua Event', icon: 'ph:calendar-dots' },
    { to: '/events?status=ongoing', label: 'Sedang Berlangsung', icon: 'ph:lightning' },
    { to: '/events?status=upcoming', label: 'Akan Datang', icon: 'ph:clock' },
]

// Close mobile menu on route change
watch(() => route.path, () => {
    mobileMenuOpen.value = false
    mobileSubmenuOpen.value = false
})
</script>
