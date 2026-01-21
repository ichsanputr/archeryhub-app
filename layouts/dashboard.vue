<template>
    <div
        class="flex h-screen w-full bg-background-light font-sans text-navy-dark overflow-hidden transition-colors duration-300">
        <!-- Mobile Overlay -->
        <div v-if="isMobileMenuOpen" @click="isMobileMenuOpen = false"
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden transition-all">
        </div>

        <!-- Sidebar (Consolidated Component) -->
        <LayoutAppSidebar />

        <!-- Main Content Area -->
        <div class="flex-grow flex flex-col h-full overflow-hidden w-full">
            <!-- Header -->
            <LayoutAppHeader />

            <!-- Profile Completion Banner -->
            <div v-if="showProfileBanner"
                class="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 flex items-center justify-between gap-4 shadow-md">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon icon="ph:warning-circle" class="text-white text-lg" />
                    </div>
                    <div class="text-white">
                        <p class="font-bold text-sm">Lengkapi Profil Anda</p>
                        <p class="text-xs text-white/80">Data profil perlu dilengkapi untuk mengakses fitur lengkap</p>
                    </div>
                </div>
                <NuxtLink to="/dashboard/settings"
                    class="bg-white text-orange-600 font-bold text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap">
                    <Icon icon="ph:pencil-simple" />
                    Lengkapi Sekarang
                </NuxtLink>
            </div>

            <!-- Page Content -->
            <main class="flex-grow overflow-y-auto p-4 md:p-6 lg:p-8 no-scrollbar bg-[#F8FAFC]">
                <slot />
            </main>
        </div>

        <!-- Global Dialogs & Toasts -->
        <AppDialog v-model:show="showLogoutDialog" title="Keluar dari Sistem"
            message="Apakah Anda yakin ingin mengakhiri sesi ini? Anda perlu masuk kembali untuk mengakses panel kontrol."
            confirm-text="Ya, Keluar" cancel-text="Tetap di Sini" type="danger" icon="ph:sign-out"
            @confirm="handleConfirmedLogout" />

        <BaseToast />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const { user, logout } = useAuth()
const isMobileMenuOpen = useState('mobile-sidebar-open', () => false)
const showLogoutDialog = useState('show-logout-dialog', () => false)

// Show profile completion banner if user hasn't completed their profile
const showProfileBanner = computed(() => {
    if (!user.value) return false
    // Check if profile is incomplete based on key fields
    const hasName = user.value.name || user.value.full_name
    const hasPhone = user.value.phone
    const profileCompleted = user.value.profile_completed

    // Show banner if profile_completed is explicitly false OR if essential fields are missing
    return profileCompleted === false || (!hasName && !hasPhone)
})

const handleConfirmedLogout = async () => {
    await logout()
    showLogoutDialog.value = false
    navigateTo('/auth/login')
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.text-navy-dark {
    color: #0f172a;
}
</style>
