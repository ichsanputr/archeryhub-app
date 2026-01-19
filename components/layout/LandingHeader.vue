<template>
    <nav class="bg-white border-b border-gray-200 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Logo -->
                <a href="/" class="flex items-center gap-3">
                    <div class="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                        <img src="/logo.png" alt="Logo" class="w-5 h-5 object-contain" />
                    </div>
                    <span class="text-navy text-xl font-bold tracking-tight">Archeryhub<span
                            class="text-logo-id">.id</span></span>
                </a>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center gap-8">
                    <a href="/" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/') }">
                        Beranda
                    </a>
                    <a href="/events" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/events') }">
                        Turnamen
                    </a>
                    <a href="/berita" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/berita') }">
                        Berita
                    </a>
                    <a href="/about" class="text-gray-600 hover:text-navy font-medium text-sm transition-colors"
                        :class="{ 'text-navy font-bold': isActive('/about') }">
                        Tentang
                    </a>
                </nav>

                <!-- Auth Buttons -->
                <div class="flex items-center gap-4">
                    <a href="/auth/login" class="hidden md:flex text-gray-600 font-medium text-sm hover:text-navy">
                        Masuk
                    </a>
                    <a href="/auth/register"
                        class="hidden sm:flex bg-navy hover:bg-navy-light text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg">
                        Daftar
                    </a>
                    <!-- Mobile Menu Button -->
                    <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden text-navy p-2">
                        <span class="material-symbols-outlined text-2xl">{{ mobileMenuOpen ? 'close' : 'menu' }}</span>
                    </button>
                </div>
            </div>

            <!-- Mobile Menu -->
            <div v-if="mobileMenuOpen" class="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
                <a href="/" class="block text-gray-600 font-medium text-sm py-2"
                    :class="{ 'text-navy font-bold': isActive('/') }">Beranda</a>
                <a href="/events" class="block text-gray-600 font-medium text-sm py-2"
                    :class="{ 'text-primary font-bold': isActive('/events') }">Turnamen</a>
                <a href="/berita" class="block text-gray-600 font-medium text-sm py-2"
                    :class="{ 'text-primary font-bold': isActive('/berita') }">Berita</a>
                <a href="/about" class="block text-gray-600 font-medium text-sm py-2"
                    :class="{ 'text-primary font-bold': isActive('/about') }">Tentang</a>
                <div class="pt-3 border-t border-gray-100 flex gap-3">
                    <a href="/auth/login"
                        class="flex-1 text-center py-2.5 border border-gray-200 rounded-lg text-sm font-bold text-navy">
                        Masuk
                    </a>
                    <a href="/auth/register"
                        class="flex-1 text-center py-2.5 bg-navy text-white rounded-lg text-sm font-bold">
                        Daftar
                    </a>
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
