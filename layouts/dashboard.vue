<template>
    <div class="flex h-screen w-full bg-background-light font-sans text-navy-dark overflow-hidden">
        <!-- Mobile Overlay -->
        <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false" class="fixed inset-0 bg-black/50 z-30 lg:hidden">
        </div>

        <!-- Sidebar -->
        <aside :class="[
            isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
            class="fixed lg:relative inset-y-0 left-0 w-64 flex-shrink-0 flex flex-col bg-navy text-white shadow-xl z-40 transition-all duration-300 border-r border-white/5">
            <div class="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
                <div class="flex items-center gap-3 overflow-hidden">
                    <img src="/logo.png" alt="Archeryhub.id Logo" class="h-8 w-8 object-contain shrink-0" />
                    <span v-if="!isSidebarCollapsed"
                        class="text-lg font-black tracking-tight whitespace-nowrap">Archeryhub.id</span>
                </div>
                <button @click="isMobileMenuOpen = false" class="lg:hidden p-1 text-gray-400 hover:text-white">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <nav class="flex-grow flex flex-col p-4 gap-2 overflow-y-auto no-scrollbar">
                <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path" @click="isMobileMenuOpen = false"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                    :class="route.path === item.path ? 'bg-primary text-navy shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'">
                    <span class="material-symbols-outlined group-hover:scale-110 transition-transform">{{ item.icon
                    }}</span>
                    <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ item.label }}</span>
                </NuxtLink>

                <div v-if="!isSidebarCollapsed"
                    class="mt-6 mb-2 px-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Penyelenggara
                </div>

                <NuxtLink v-for="item in eventItems" :key="item.path" :to="item.path" @click="isMobileMenuOpen = false"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                    :class="route.path.startsWith(item.path) && item.path !== '/' ? 'bg-primary text-navy shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'">
                    <span class="material-symbols-outlined group-hover:scale-110 transition-transform">{{ item.icon
                    }}</span>
                    <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ item.label }}</span>
                </NuxtLink>
            </nav>

            <!-- User Profile (Sidebar Bottom) -->
            <div class="p-4 border-t border-white/10 bg-black/20 shrink-0">
                <div class="flex items-center gap-3 px-2 py-1 cursor-pointer hover:opacity-80 transition-opacity">
                    <div
                        class="h-9 w-9 rounded-full bg-primary/20 border-2 border-white/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                        <img :src="user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=FFD700&color=0F172A`"
                            class="w-full h-full object-cover">
                    </div>
                    <div v-if="!isSidebarCollapsed" class="flex flex-col min-w-0">
                        <span class="text-white text-sm font-bold truncate">{{ user?.name || 'Guest' }}</span>
                        <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest">{{ user?.role ||
                            'User' }}</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-grow flex flex-col h-full overflow-hidden w-full">
            <!-- Header -->
            <header
                class="h-16 flex items-center justify-between border-b border-gray-200 px-4 md:px-6 lg:px-8 bg-white shrink-0 z-10">
                <div class="flex items-center gap-3">
                    <!-- Mobile menu toggle -->
                    <button @click="isMobileMenuOpen = true"
                        class="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                        <span class="material-symbols-outlined">menu</span>
                    </button>
                    <!-- Desktop sidebar toggle -->
                    <button @click="isSidebarCollapsed = !isSidebarCollapsed"
                        class="hidden lg:block p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                        <span class="material-symbols-outlined">{{ isSidebarCollapsed ? 'menu_open' : 'menu' }}</span>
                    </button>
                    <h2 class="text-navy font-black text-base md:text-lg truncate">{{ currentPageTitle }}</h2>
                </div>

                <div class="flex items-center gap-2 sm:gap-4">
                    <div class="relative hidden lg:block group">
                        <span
                            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[20px] transition-colors group-focus-within:text-primary">search</span>
                        <input type="text" placeholder="Cari data..."
                            class="bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-navy placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent w-48 xl:w-64 transition-all">
                    </div>
                    <button
                        class="relative p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-full transition-all">
                        <span class="material-symbols-outlined text-[22px] md:text-[24px]">notifications</span>
                        <span
                            class="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                    </button>
                </div>
            </header>

            <!-- Page Content -->
            <main class="flex-grow overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar bg-background-light">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
const route = useRoute()
const { user } = useAuth()
const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = ref(false)

const navItems = [
    { label: 'Ringkasan', icon: 'dashboard', path: '/dashboard' },
    { label: 'Turnamen Saya', icon: 'emoji_events', path: '/dashboard/tournaments' },
    { label: 'Statistik Global', icon: 'bar_chart', path: '/dashboard/statistics' },
]

const eventItems = [
    { label: 'Panel Kontrol', icon: 'view_quilt', path: '/dashboard/tournaments/1/manage' },
    { label: 'Manajemen Atlet', icon: 'groups', path: '/dashboard/tournaments/1/manage/archers' },
    { label: 'Scoring & Hasil', icon: 'scoreboard', path: '/dashboard/tournaments/1/manage/scoring' },
    { label: 'Pengaturan Event', icon: 'settings', path: '/dashboard/tournaments/1/manage/settings' },
]

const currentPageTitle = computed(() => {
    const active = [...navItems, ...eventItems].find(item => route.path === item.path)
    return active ? active.label : 'Management'
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.text-navy-dark {
    color: #0f172a;
}

.bg-navy {
    background-color: #0f172a;
}
</style>
