<template>
    <div
        class="flex h-screen w-full bg-background-light font-sans text-navy-dark overflow-hidden transition-colors duration-300">
        <!-- Mobile overlay: behind sidebar (z-[90]) so drawer (z-[100]) stays on top; tap to close -->
        <Transition name="overlay-fade">
            <button v-if="isMobileMenuOpen" type="button"
                class="fixed inset-0 z-[90] lg:hidden bg-black/40 backdrop-blur-[2px] transition-opacity duration-200 focus:outline-none focus:ring-0"
                aria-label="Tutup menu" @click="isMobileMenuOpen = false" />
        </Transition>

        <!-- Sidebar (drawer on mobile, above overlay) -->
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
                        <div class="font-bold text-sm">Lengkapi Profil Anda</div>
                        <div class="text-xs text-white/80">Data profil perlu dilengkapi untuk mengakses fitur lengkap
                        </div>
                    </div>
                </div>
                <NuxtLink to="/dashboard/settings"
                    class="bg-white text-orange-600 font-bold text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap">
                    <Icon icon="ph:pencil-simple" />
                    Lengkapi Sekarang
                </NuxtLink>
            </div>

            <!-- Package Expired Banner -->
            <div v-if="showExpiredPackageBanner"
                class="relative overflow-hidden bg-navy border-b border-primary/20 py-6 shadow-lg shrink-0">
                <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: 0.1;"></div>
                <div class="relative px-4 flex items-center justify-between gap-4 max-w-7xl mx-auto">
                    <div class="flex items-center gap-3 min-w-0">
                        <div
                            class="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center backdrop-blur-md shrink-0">
                            <Icon icon="ph:warning-octagon-bold" class="text-primary text-xl" />
                        </div>
                        <div class="text-white min-w-0">
                            <div class="font-black text-xs sm:text-sm tracking-tight uppercase leading-tight">
                                Paket Anda Sudah Kedaluwarsa
                            </div>
                            <div class="text-[10px] sm:text-xs text-slate-400 font-medium mt-0.5 leading-tight">
                                Perpanjang paket untuk melanjutkan fitur penuh dashboard.</div>
                        </div>
                    </div>
                    <NuxtLink to="/dashboard/subscription"
                        class="bg-primary hover:bg-white text-navy font-black text-[10px] sm:text-xs px-4 sm:px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 whitespace-nowrap uppercase tracking-widest active:scale-95 shrink-0">
                        <Icon icon="ph:crown-bold" class="text-xs sm:text-sm" />
                        <span class="hidden xs:inline">Perpanjang Sekarang</span>
                        <span class="xs:hidden">Perpanjang</span>
                    </NuxtLink>
                </div>
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
import { useAuth } from '~/composables/useAuth'
import { useSubscription } from '~/composables/useSubscription'

const route = useRoute()
const { user, logout } = useAuth()
const isMobileMenuOpen = useState('mobile-sidebar-open', () => false)
const showLogoutDialog = useState('show-logout-dialog', () => false)

const parseSubscriptionDate = (value) => {
    if (!value) return null

    const isoLike = /^\d{4}-\d{2}-\d{2}/.test(value)
    if (isoLike) {
        const parsedIso = new Date(value)
        return Number.isNaN(parsedIso.getTime()) ? null : parsedIso
    }

    const parts = value.trim().split(/\s+/)
    if (parts.length < 3) {
        const parsedFallback = new Date(value)
        return Number.isNaN(parsedFallback.getTime()) ? null : parsedFallback
    }

    const day = Number(parts[0])
    const monthRaw = parts[1].toLowerCase()
    const year = Number(parts[2])
    const monthMap = {
        jan: 0, januari: 0,
        feb: 1, februari: 1,
        mar: 2, maret: 2,
        apr: 3, april: 3,
        may: 4, mei: 4,
        jun: 5, juni: 5,
        jul: 6, juli: 6,
        aug: 7, agustus: 7,
        sep: 8, september: 8,
        oct: 9, oktober: 9,
        nov: 10, november: 10,
        dec: 11, desember: 11,
    }

    if (!Number.isFinite(day) || !Number.isFinite(year) || monthMap[monthRaw] === undefined) return null

    const parsed = new Date(year, monthMap[monthRaw], day, 23, 59, 59)
    return Number.isNaN(parsed.getTime()) ? null : parsed
}

const { isSubscriptionActive, subscriptionData, fetchSubscription } = useSubscription()

const showExpiredPackageBanner = computed(() => {
    if (!user.value) return false
    const role = user.value.role || user.value.type || user.value.user_type
    if (role !== 'club' && role !== 'organization') return false

    return !isSubscriptionActive.value
})

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

// Lock body scroll when mobile drawer is open
watch(isMobileMenuOpen, (open) => {
    if (import.meta.client) {
        document.body.style.overflow = open ? 'hidden' : ''
        document.documentElement.style.overflow = open ? 'hidden' : ''
    }
})

// Global Subscription Check (only for klub & organisasi)
onMounted(async () => {
    if (!user.value) return
    const role = user.value.role || user.value.type || user.value.user_type
    if (role === 'club' || role === 'organization' || role === 'admin') {
        await fetchSubscription()
    }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.text-navy-dark {
    color: #0f172a;
}

.overlay-fade-enter-active,
.overlay-fade-leave-active {
    transition: opacity 0.2s ease;
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
    opacity: 0;
}
</style>
