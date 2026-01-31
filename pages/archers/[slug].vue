<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Back Button -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 mb-6">
            <NuxtLink to="/archers"
                class="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-200 text-navy hover:bg-gray-50 transition-all shadow-sm">
                <Icon icon="ph:arrow-left-bold" />
                <span class="text-sm font-bold">Kembali ke Daftar Pemanah</span>
            </NuxtLink>
        </div>

        <!-- Archer Header Card -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-10">
                <div class="flex flex-col md:flex-row gap-6 md:gap-8">
                    <!-- Avatar -->
                    <div
                        class="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white border-2 border-gray-100 shadow-lg overflow-hidden flex-shrink-0">
                        <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                            class="w-full h-full object-cover" />
                    </div>

                    <!-- Info -->
                    <div class="flex-1">
                        <div class="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <div class="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 class="text-2xl md:text-4xl font-black text-navy leading-tight">{{
                                        archer.full_name }}
                                    </h1>
                                    <span v-if="archer.id"
                                        class="px-3 py-1.5 bg-primary/10 text-primary text-[10px] md:text-xs font-black rounded-full uppercase tracking-wider">
                                        {{ archer.id }}
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-4 text-gray-500 text-sm font-medium">
                                    <span v-if="archer.city" class="flex items-center gap-1.5">
                                        <Icon icon="ph:map-pin-fill" class="text-primary" />
                                        {{ archer.city }}{{ archer.province ? ', ' + archer.province : '' }}
                                    </span>
                                    <span v-if="archer.bow_type" class="flex items-center gap-1.5">
                                        <Icon icon="ph:target-bold" />
                                        {{ bowTypeLabel }}
                                    </span>
                                    <span v-if="archer.club_name" class="flex items-center gap-1.5">
                                        <Icon icon="ph:users-three-bold" />
                                        {{ archer.club_name }}
                                    </span>
                                </div>
                            </div>

                            <!-- Actions -->
                            <div class="flex gap-3">
                                <button @click="openShareDialog"
                                    class="p-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                                    <Icon icon="ph:share-network-bold" class="text-xl text-gray-600" />
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>

        <!-- Main Content -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Main Column -->
                <div class="lg:col-span-2 space-y-8">
                    <!-- About -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:info-bold" class="text-xl text-primary" />
                            </div>
                            Tentang Pemanah
                        </h2>
                        <p v-if="archer.bio" class="text-gray-600 leading-relaxed text-lg">{{ archer.bio }}</p>
                        <p v-else class="text-gray-400 italic">Belum ada informasi tentang pemanah ini.</p>

                        <!-- Personal Info -->
                        <div class="mt-8 pt-8 border-t border-gray-100">
                            <h3 class="font-black text-navy text-base mb-4">Informasi Pribadi</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div v-if="archer.date_of_birth" class="flex items-center gap-3">
                                    <Icon icon="ph:calendar-bold" class="text-primary text-xl" />
                                    <div>
                                        <p class="text-xs text-gray-400 font-bold uppercase">Tanggal Lahir</p>
                                        <p class="text-navy font-bold">{{ formatDate(archer.date_of_birth) }}</p>
                                    </div>
                                </div>
                                <div v-if="archer.gender" class="flex items-center gap-3">
                                    <Icon icon="ph:user-bold" class="text-primary text-xl" />
                                    <div>
                                        <p class="text-xs text-gray-400 font-bold uppercase">Jenis Kelamin</p>
                                        <p class="text-navy font-bold">{{ genderLabel }}</p>
                                    </div>
                                </div>
                                <div v-if="archer.experience_years" class="flex items-center gap-3">
                                    <Icon icon="ph:clock-bold" class="text-primary text-xl" />
                                    <div>
                                        <p class="text-xs text-gray-400 font-bold uppercase">Pengalaman</p>
                                        <p class="text-navy font-bold">{{ archer.experience_years }} Tahun</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Achievements -->
                        <div v-if="archer.achievements" class="mt-8 pt-8 border-t border-gray-100">
                            <h3 class="font-black text-navy text-base mb-4">Prestasi</h3>
                            <div class="prose max-w-none">
                                <p class="text-gray-600 leading-relaxed whitespace-pre-line">{{ archer.achievements }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Event History -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                        <h2 class="font-black text-navy text-xl mb-5 flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Icon icon="ph:calendar-star-bold" class="text-xl text-primary" />
                            </div>
                            Riwayat Event
                        </h2>
                        <div v-if="eventHistory.length > 0" class="space-y-4">
                            <div v-for="event in eventHistory" :key="event.id"
                                class="flex items-center gap-5 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-primary/30 transition-all">
                                <div
                                    class="w-14 h-14 rounded-xl bg-navy flex items-center justify-center text-primary shrink-0">
                                    <Icon icon="ph:trophy-fill" class="text-2xl" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-black text-navy text-lg mb-1">{{ event.name }}</h4>
                                    <p class="text-gray-500 text-sm">{{ event.city }} • {{ formatDate(event.date) }}</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-2xl font-black text-navy">{{ event.score || '-' }}</p>
                                    <p class="text-xs text-gray-400">Score</p>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-10">
                            <Icon icon="ph:calendar-blank" class="text-5xl text-gray-300 mx-auto mb-3" />
                            <p class="text-gray-400">Belum ada riwayat event</p>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Contact Info Card (Moved from main column) -->
                    <div v-if="archer.phone || archer.email || archer.address"
                        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy text-base mb-4 flex items-center gap-3">
                            <Icon icon="ph:phone-bold" class="text-primary" />
                            Kontak & Lokasi
                        </h3>
                        <div class="space-y-4">
                            <div v-if="archer.email" class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="ph:envelope-bold" class="text-gray-400" />
                                </div>
                                <span class="text-navy text-sm font-medium break-all">{{ archer.email }}</span>
                            </div>
                            <div v-if="archer.phone" class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                                    <Icon icon="ph:phone-bold" class="text-gray-400" />
                                </div>
                                <span class="text-navy text-sm font-medium">{{ archer.phone }}</span>
                            </div>
                            <div v-if="archer.address" class="flex items-start gap-3">
                                <div
                                    class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Icon icon="ph:map-pin-bold" class="text-gray-400" />
                                </div>
                                <span class="text-navy text-sm font-medium leading-relaxed">{{ archer.address
                                }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Club Information (Kept in sidebar but styled) -->
                    <div v-if="archer.club_name" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 class="font-black text-navy text-base mb-4 flex items-center gap-3">
                            <Icon icon="ph:shield-bold" class="text-primary" />
                            Afiliasi Klub
                        </h3>
                        <div class="p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <NuxtLink v-if="archer.club_slug" :to="`/clubs/${archer.club_slug}`"
                                class="flex items-center gap-3 group">
                                <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <Icon icon="ph:buildings-bold" class="text-navy" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                        Klub Saat Ini</p>
                                    <p
                                        class="text-navy font-black text-sm truncate group-hover:text-primary transition-colors">
                                        {{ archer.club_name }}
                                    </p>
                                </div>
                                <Icon icon="ph:caret-right-bold"
                                    class="text-gray-300 group-hover:text-primary transition-all" />
                            </NuxtLink>
                            <div v-else class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                    <Icon icon="ph:buildings-bold" class="text-navy" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-xs text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                                        Klub Saat Ini</p>
                                    <p class="text-navy font-bold text-sm truncate">
                                        {{ archer.club_name }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- Share Dialog -->
        <Transition name="modal">
            <div v-if="showShareDialog"
                class="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
                <!-- Overlay -->
                <Transition name="fade" appear>
                    <div @click="closeShareDialog" class="absolute inset-0 bg-navy/80 backdrop-blur-sm">
                    </div>
                </Transition>

                <!-- Modal -->
                <Transition name="scale" appear>
                    <div
                        class="relative w-full max-w-md transform rounded-3xl bg-white p-8 text-left shadow-2xl transition-all border border-white/20">
                        <div class="flex items-center justify-between mb-6">
                            <h3 class="text-xl font-black text-navy">Bagikan Profil Pemanah</h3>
                            <button @click="closeShareDialog" class="text-gray-400 hover:text-navy transition-colors">
                                <Icon icon="ph:x-bold" class="text-xl" />
                            </button>
                        </div>

                        <div class="space-y-6">
                            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div class="w-12 h-12 rounded-xl bg-white shadow-sm overflow-hidden shrink-0">
                                    <img :src="useImageOrDefault(archer.photo_url || archer.avatar_url, archer.full_name)"
                                        class="w-full h-full object-cover" />
                                </div>
                                <div class="min-w-0 flex-1">
                                    <p class="font-bold text-navy truncate">{{ archer.full_name }}</p>
                                    <p class="text-xs text-gray-400 truncate">{{ archer.city }}{{ archer.province ? ', '
                                        +
                                        archer.province : '' }}</p>
                                </div>
                            </div>

                            <div class="grid grid-cols-4 gap-4">
                                <button @click="shareTo('whatsapp')" class="flex flex-col items-center gap-2 group">
                                    <div
                                        class="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all">
                                        <Icon icon="ph:whatsapp-logo-fill" class="text-2xl" />
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-500">WhatsApp</span>
                                </button>
                                <button @click="shareTo('facebook')" class="flex flex-col items-center gap-2 group">
                                    <div
                                        class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <Icon icon="ph:facebook-logo-fill" class="text-2xl" />
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-500">Facebook</span>
                                </button>
                                <button @click="shareTo('twitter')" class="flex flex-col items-center gap-2 group">
                                    <div
                                        class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-all">
                                        <Icon icon="ph:twitter-logo-fill" class="text-2xl" />
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-500">Twitter</span>
                                </button>
                                <button @click="copyLink" class="flex flex-col items-center gap-2 group">
                                    <div
                                        class="w-12 h-12 rounded-2xl bg-gray-50 text-gray-600 flex items-center justify-center group-hover:bg-navy group-hover:text-white transition-all">
                                        <Icon icon="ph:link-bold" class="text-2xl" />
                                    </div>
                                    <span class="text-[10px] font-bold text-gray-500">{{ copied ? 'Tersalin' : 'Salin'
                                        }}</span>
                                </button>
                            </div>

                            <div class="relative group mt-4">
                                <input type="text" readonly :value="shareUrl"
                                    class="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-500 outline-none" />
                                <button @click="copyLink"
                                    class="absolute right-2 top-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-black hover:bg-gray-50 transition-colors shadow-sm">
                                    {{ copied ? 'Berhasil' : 'Salin' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDateFormat } from '@vueuse/core'

definePageMeta({
    layout: 'landing'
})

const route = useRoute()
const config = useRuntimeConfig()
const apiBaseUrl = config.public.apiBaseUrl

// SSR Data Fetching
const { data: archerResponse, pending: isLoading, error: archerError } = await useAsyncData(
    `archer-${route.params.slug}`,
    async () => {
        try {
            const [archerData, eventsData] = await Promise.all([
                $fetch(`${apiBaseUrl}/archers/${route.params.slug}`),
                $fetch(`${apiBaseUrl}/archers/${route.params.slug}/events`).catch(() => ({ events: [] }))
            ])
            return { archer: archerData, events: eventsData.events || [] }
        } catch (e) {
            console.error("Failed to fetch archer data")
            throw createError({ statusCode: 404, statusMessage: 'Archer Not Found' })
        }
    },
    { server: true }
)

const archer = computed(() => {
    return archerResponse.value?.archer || {}
})

const eventHistory = computed(() => {
    return archerResponse.value?.events || []
})

const bowTypeLabel = computed(() => {
    const labels = {
        recurve: 'Recurve',
        compound: 'Compound',
        barebow: 'Barebow',
        traditional: 'Traditional'
    }
    return labels[archer.value?.bow_type] || archer.value?.bow_type || '-'
})

const genderLabel = computed(() => {
    return archer.value?.gender === 'male' ? 'Laki-laki' : archer.value?.gender === 'female' ? 'Perempuan' : '-'
})


const statusLabel = computed(() => {
    const labels = {
        active: 'Aktif',
        inactive: 'Tidak Aktif',
        suspended: 'Ditangguhkan'
    }
    return labels[archer.value?.status] || archer.value?.status || '-'
})

const formatDate = (date, format = 'DD MMMM YYYY') => {
    if (!date) return '-'
    return useDateFormat(date, format, { locales: 'id-ID' }).value
}

// Share dialog
const showShareDialog = ref(false)
const copied = ref(false)
const shareUrl = computed(() => typeof window !== 'undefined' ? window.location.href : '')

const openShareDialog = () => {
    showShareDialog.value = true
}

const closeShareDialog = () => {
    showShareDialog.value = false
    copied.value = false
}

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(shareUrl.value)
        copied.value = true
        setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch (err) {
        console.error('Failed to copy:', err)
    }
}

const shareTo = (platform) => {
    const text = encodeURIComponent(`Lihat profil ${archer.value?.full_name} di Archeryhub.id`)
    const url = encodeURIComponent(shareUrl.value)
    let shareLink = ''

    switch (platform) {
        case 'whatsapp':
            shareLink = `https://wa.me/?text=${text}%20${url}`
            break
        case 'facebook':
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`
            break
        case 'twitter':
            shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
            break
    }

    if (shareLink) {
        window.open(shareLink, '_blank', 'noopener,noreferrer')
        closeShareDialog()
    }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .scale,
.modal-leave-active .scale {
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .scale,
.modal-leave-to .scale {
    transform: scale(0.9) translateY(20px);
}

/* Base transitions */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-enter-from,
.scale-leave-to {
    transform: scale(0.9);
    opacity: 0;
}
</style>
