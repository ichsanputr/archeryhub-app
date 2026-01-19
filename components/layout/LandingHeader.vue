<template>
    <nav class="bg-white border-b border-gray-200 shadow-sm">
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
                    <NuxtLink to="/events" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/events') }">
                        Turnamen
                    </NuxtLink>
                    <NuxtLink to="/berita" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/berita') }">
                        Berita
                    </NuxtLink>
                    <NuxtLink to="/about" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/about') }">
                        Tentang
                    </NuxtLink>
                </nav>

                <!-- Auth Buttons -->
                <div class="flex items-center gap-4">
                    <NuxtLink to="/auth/login" class="hidden md:flex text-gray-600 font-medium text-sm hover:text-navy">
                        Masuk
                    </NuxtLink>
                    <NuxtLink to="/auth/register"
                        class="hidden sm:flex bg-navy hover:bg-navy-light text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg">
                        Daftar
                    </NuxtLink>
                    <!-- Mobile Menu Button -->
                    <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-navy p-2">
                        <span class="material-symbols-outlined text-2xl">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
                <NuxtLink to="/" class="block text-gray-600 font-medium text-sm py-2"
                    :class="{ 'text-navy font-bold': isActive('/') }">Beranda</NuxtLink>
                <NuxtLink to="/events" class="block text-gray-600 font-medium text-sm py-2"
                    :class="{ 'text-primary font-bold': isActive('/events') }">Turnamen</NuxtLink>
                <NuxtLink to="/berita" class="block text-gray-600 font-medium text-sm py-2"
                    :class="{ 'text-primary font-bold': isActive('/berita') }">Berita</NuxtLink>
                <NuxtLink to="/about" class="block text-gray-600 font-medium text-sm py-2"
                    :class="{ 'text-primary font-bold': isActive('/about') }">Tentang</NuxtLink>
                <div class="pt-3 border-t border-gray-100 flex gap-3">
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
        </div>
    </nav>
</template>

<script setup>
const route = useRoute()
const mobileMenuOpen = ref(false)

const isActive = (path) => {
    if (path === '/') {
        return route.path === '/'
    }
    return route.path.startsWith(path)
}
</script>
