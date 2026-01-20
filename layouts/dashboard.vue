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
                    <Icon icon="ph:x" class="text-xl" />
                </button>
            </div>

            <nav class="flex-grow flex-col p-4 gap-2 overflow-y-auto no-scrollbar hidden lg:flex">
                <NuxtLink v-for="item in navItems" :key="item.path" :to="item.path"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                    :class="(item.path === '/dashboard/events' ? route.path.startsWith('/dashboard/events') : route.path === item.path) ? 'bg-primary text-navy shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'">
                    <Icon :icon="item.icon.includes(':') ? item.icon : `ph:${item.icon}`"
                        class="text-xl group-hover:scale-110 transition-transform" />
                    <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ item.label }}</span>
                </NuxtLink>

                <NuxtLink v-if="false" v-for="item in eventItems" :key="item.path" :to="item.path"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group"
                    :class="route.path.startsWith(item.path) && item.path !== '/' ? 'bg-primary text-navy shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'">
                    <Icon :icon="item.icon.includes(':') ? item.icon : `ph:${item.icon}`"
                        class="text-xl group-hover:scale-110 transition-transform" />
                    <span v-if="!isSidebarCollapsed" class="text-sm font-bold whitespace-nowrap">{{ item.label }}</span>
                </NuxtLink>
            </nav>

            <!-- User Profile (Sidebar Bottom) -->
            <div class="p-4 border-t border-white/10 bg-black/20 shrink-0">
                <div class="flex items-center justify-between gap-3 px-2 py-1">
                    <div class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity min-w-0">
                        <div
                            class="h-9 w-9 rounded-full bg-primary/20 border-2 border-white/10 flex items-center justify-center text-primary shrink-0 overflow-hidden">
                            <img :src="user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=FFD700&color=0F172A`"
                                class="w-full h-full object-cover">
                        </div>
                        <div v-if="!isSidebarCollapsed" class="flex flex-col min-w-0">
                            <span class="text-white text-sm font-bold truncate">{{ user?.name || 'Guest' }}</span>
                            <span class="text-[10px] text-gray-500 font-black uppercase tracking-widest">{{ user?.role
                                ||
                                'User' }}</span>
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

        <!-- Main Content Area -->
        <div class="flex-grow flex flex-col h-full overflow-hidden w-full">
            <!-- Header -->
            <LayoutAppHeader />

            <!-- Page Content -->
            <main class="flex-grow overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar bg-background-light">
                <slot />
            </main>
        </div>

        <!-- Global Dialog -->
        <AppDialog v-model:show="showLogoutDialog" title="Keluar dari Sistem"
            message="Apakah Anda yakin ingin mengakhiri sesi ini? Anda perlu masuk kembali untuk mengakses panel kontrol."
            confirm-text="Ya, Keluar" cancel-text="Tetap di Sini" type="danger" icon="ph:sign-out" @confirm="logout" />
    </div>
</template>

<script setup>
import AppDialog from '~/components/common/AppDialog.vue'
import { Icon } from '@iconify/vue'

const route = useRoute()
const { user, logout } = useAuth()
const isSidebarCollapsed = ref(false)
const isMobileMenuOpen = useState('mobile-sidebar-open', () => false)
const showLogoutDialog = ref(false)

const handleLogout = () => {
    showLogoutDialog.value = true
}

const navItems = [
    { label: 'Ringkasan', icon: 'ph:squares-four', path: '/dashboard' },
    { label: 'Event', icon: 'ph:trophy', path: '/dashboard/events' },
]

const eventItems = [
    { label: 'Panel Kontrol', icon: 'ph:layout', path: '/dashboard/events/1/manage' },
    { label: 'Manajemen Atlet', icon: 'ph:users-three', path: '/dashboard/events/1/manage/archers' },
    { label: 'Scoring & Hasil', icon: 'ph:scoreboard', path: '/dashboard/events/1/manage/scoring' },
    { label: 'Pengaturan Event', icon: 'ph:gear', path: '/dashboard/events/1/manage/settings' },
]


const currentPageTitle = computed(() => {
    const active = [...navItems, ...eventItems].find(item => {
        if (item.path === '/dashboard/events') return route.path.startsWith('/dashboard/events')
        return route.path === item.path
    })
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
