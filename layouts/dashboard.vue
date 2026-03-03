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

            <!-- Package Expired Banner -->
            <div v-if="showExpiredPackageBanner"
                class="bg-gradient-to-r from-red-500 to-rose-500 px-4 py-3 flex items-center justify-between gap-4 shadow-md">
                <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Icon icon="ph:warning-octagon" class="text-white text-lg" />
                    </div>
                    <div class="text-white">
                        <p class="font-bold text-sm">Paket Anda Sudah Kedaluwarsa</p>
                        <p class="text-xs text-white/80">Perpanjang paket untuk melanjutkan fitur penuh dashboard.</p>
                    </div>
                </div>
                <NuxtLink to="/dashboard/subscription"
                    class="bg-white text-rose-600 font-bold text-sm px-4 py-2 rounded-lg hover:bg-white/90 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap">
                    <Icon icon="ph:arrows-clockwise" />
                    Perpanjang Paket
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

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'
import { useSubscription } from '~/composables/useSubscription'

const route = useRoute()
const { user, logout } = useAuth()
const isMobileMenuOpen = useState('mobile-sidebar-open', () => false)
const showLogoutDialog = useState('show-logout-dialog', () => false)

const subscriptionData = useState('subscription.data', () => null)

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
    const monthMap: Record<string, number> = {
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

const showExpiredPackageBanner = computed(() => {
    if (!user.value) return false
    const role = user.value.role || user.value.type || user.value.user_type
    if (role !== 'club' && role !== 'organization') return false

    const status = (subscriptionData.value?.current?.status || '').toLowerCase()
    if (status === 'expired') return true

    const nextBilling = subscriptionData.value?.current?.next_billing_date
    const expiry = parseSubscriptionDate(nextBilling)
    if (!expiry) return false

    return expiry.getTime() < new Date().getTime() && status !== 'active'
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
const { fetchSubscription } = useSubscription()
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
