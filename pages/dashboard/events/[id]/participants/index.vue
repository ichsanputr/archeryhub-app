<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-20"
                style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary">
            </div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:users" class="text-primary text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                Daftar Peserta
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                Lihat dan kelola semua peserta yang terdaftar dalam event ini.
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:download" class="h-11 px-5">
                            <span class="hidden sm:inline">Export CSV</span>
                            <span class="sm:hidden">Export</span>
                        </BaseButton>
                        <BaseButton :to="`/dashboard/events/${route.params.id}/participants/add`" variant="primary"
                            icon="ph:plus-bold"
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all">
                            <span class="hidden sm:inline">Tambah Peserta</span>
                            <span class="sm:hidden">Tambah</span>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Search and Filter Bar -->
        <div
            class="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div class="relative w-full sm:max-w-md">
                <Icon icon="ph:magnifying-glass"
                    class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input v-model="searchQuery" type="text" placeholder="Cari nama peserta atau email..."
                    class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                    @input="handleSearch" />
            </div>

            <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:inline">Total:</span>
                <div class="px-3 py-1.5 bg-navy/5 text-navy rounded-lg font-black text-xs border border-navy/10">
                    {{ total }} Peserta
                </div>
            </div>
        </div>

        <!-- Participants Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50/50 border-b border-gray-100">
                        <tr class="text-[10px] font-black text-gray-400  tracking-widest capitalize">
                            <th class="px-6 py-4">No</th>
                            <th class="px-6 py-4">Nama Peserta / Email</th>
                            <th class="px-6 py-4">Klub / Kota</th>
                            <th class="px-6 py-4">Kategori Lomba yang Diikuti</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <!-- Loading State -->
                        <template v-if="isLoading">
                            <tr v-for="i in 5" :key="i">
                                <td class="px-6 py-4">
                                    <div class="h-4 w-4 bg-gray-100 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="h-10 w-10 bg-gray-100 animate-pulse rounded-full"></div>
                                        <div class="space-y-2">
                                            <div class="h-4 w-32 bg-gray-100 animate-pulse rounded"></div>
                                            <div class="h-3 w-40 bg-gray-50 animate-pulse rounded"></div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-4 w-24 bg-gray-100 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-4 w-48 bg-gray-100 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-6 w-20 bg-gray-100 animate-pulse rounded-full"></div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="h-8 w-24 bg-gray-100 animate-pulse rounded"></div>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex justify-end gap-2">
                                        <div class="size-8 bg-gray-50 animate-pulse rounded-lg"></div>
                                        <div class="size-8 bg-gray-50 animate-pulse rounded-lg"></div>
                                    </div>
                                </td>
                            </tr>
                        </template>

                        <template v-else>
                            <tr v-for="(participant, index) in filteredParticipants" :key="participant.archer_id"
                                class="group hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4 align-top text-center w-16">
                                    <span class="text-sm font-bold text-gray-400">{{ (page - 1) * limit + index + 1
                                        }}</span>
                                </td>
                                <td class="px-6 py-4 align-top min-w-[250px]">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs  border border-gray-200 overflow-hidden shrink-0 shadow-sm">
                                            <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                                class="w-full h-full object-cover">
                                        </div>
                                        <div class="min-w-0">
                                            <p class="text-sm font-black text-navy truncate leading-snug">{{
                                                participant.full_name }}</p>
                                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{
                                                participant.email || '-' }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-top min-w-[150px]">
                                    <div class="flex flex-col">
                                        <span class="text-xs font-bold text-gray-600 leading-snug">{{
                                            participant.club_name || '-' }}</span>
                                        <span v-if="participant.city"
                                            class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{{
                                                participant.city }}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 align-top">
                                    <div class="flex flex-wrap gap-2">
                                        <div v-for="cat in participant.categories" :key="cat.participant_id"
                                            class="flex flex-col gap-1 p-2.5 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200 group/chip min-w-[180px]">
                                            <div class="flex items-center justify-between gap-3">
                                                <span class="text-[11px] font-black text-navy leading-none">
                                                    {{ cat.division_name }} - {{ cat.category_name }}
                                                </span>
                                                <span :class="getStatusClass(cat.status)"
                                                    class="px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter border whitespace-nowrap">
                                                    {{ cat.status }}
                                                </span>
                                            </div>
                                            <div class="flex items-center justify-between mt-1">
                                                <div class="text-[9px] text-gray-400 font-bold italic truncate">
                                                    {{ cat.event_type_name }} {{ cat.gender_division_name ? '• ' +
                                                        cat.gender_division_name : '' }}
                                                </div>
                                                <button v-if="cat.status === 'Terdaftar' && cat.participant_id"
                                                    @click.stop="showQRDialog(participant, cat)"
                                                    class="text-navy/30 hover:text-primary transition-colors p-1 rounded-md hover:bg-primary/5"
                                                    title="QR Code Registrasi">
                                                    <Icon icon="ph:qr-code-bold" class="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-right align-top w-20">
                                    <div class="flex items-center justify-end">
                                        <NuxtLink
                                            :to="`/dashboard/events/${route.params.id}/participants/${participant.archer_id}`"
                                            class="size-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-navy hover:border-navy/20 hover:shadow-sm transition-all"
                                            title="Lihat Detail Profil">
                                            <Icon icon="ph:arrow-square-out-bold" class="text-xl" />
                                        </NuxtLink>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredParticipants.length === 0">
                                <td colspan="5" class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                    Tidak ada peserta yang ditemukan.
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <div class="px-6 py-6 border-t border-gray-100 bg-gray-50/10">
                <BasePagination :current-page="page" :total-items="total" :items-per-page="limit"
                    @change-page="p => { page = p; fetchParticipants(); }"
                    @update:items-per-page="v => { limit = v; page = 1; fetchParticipants(); }" />
            </div>
        </div>

        <!-- QR Code Dialog -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="showQR"
                    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    @click="showQR = false">
                    <div class="relative bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full mx-4" @click.stop>
                        <button @click="showQR = false"
                            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg">
                            <Icon icon="ph:x" class="text-2xl" />
                        </button>

                        <div class="text-center space-y-6">
                            <div>
                                <h3 class="text-2xl font-black text-navy mb-2">QR Code Registrasi Ulang</h3>
                                <p class="text-sm text-gray-500 font-medium">{{ selectedParticipant?.full_name }}</p>
                            </div>

                            <div class="bg-gray-50 p-8 rounded-2xl border flex justify-center border-gray-200">
                                <qrcode-vue :value="selectedParticipant?.qr_raw || 'N/A'" :size="300" level="H"
                                    render-as="svg" />
                            </div>

                            <div class="text-xs text-gray-500 space-y-1">
                                <p class="font-bold">{{ selectedParticipant?.email }}</p>
                                <p>{{ selectedParticipant?.club_name || '-' }}</p>
                            </div>

                            <BaseButton variant="primary" block icon="ph:download-simple" @click="downloadQR">
                                Download QR Code
                            </BaseButton>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import QrcodeVue from 'qrcode.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'
import BasePagination from '~/components/common/BasePagination.vue'

definePageMeta({
    layout: 'dashboard'
})

useHead({
    title: 'Daftar Peserta - ArcheryHub Dashboard'
})

const route = useRoute()
const { get } = useApi()
const { setEvent, clearEvent } = useEventContext()

const breadcrumbItems = computed(() => [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Events', path: '/dashboard/events' }
])

const participants = ref([])
const total = ref(0)
const verifiedCount = ref(0)
const pendingCount = ref(0)
const page = ref(1)
const limit = ref(10)
const totalPages = computed(() => Math.ceil(total.value / limit.value))

const searchQuery = ref('')
const activeDiv = ref('Semua')
const filterDivs = ['Semua', 'Recurve', 'Compound', 'Barebow']
const isLoading = ref(true)
const showQR = ref(false)
const selectedParticipant = ref(null)

const searchTimeout = ref(null)

const handleSearch = () => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
    searchTimeout.value = setTimeout(() => {
        page.value = 1
        fetchParticipants()
    }, 500)
}

const fetchEventDetails = async () => {
    try {
        const eventRes = await get(`/events/${route.params.id}`)
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const fetchParticipants = async () => {
    isLoading.value = true
    try {
        const offset = (page.value - 1) * limit.value
        const response = await get(`/events/${route.params.id}/participants?limit=${limit.value}&offset=${offset}&group_by=archer&search=${searchQuery.value}`)
        participants.value = response?.participants || []
        total.value = response?.total || 0
        verifiedCount.value = response?.verified_count || 0
        pendingCount.value = response?.pending_count || 0
    } catch (error) {
        console.error('Failed to fetch participants:', error)
    } finally {
        isLoading.value = false
    }
}

const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages.value) {
        page.value = newPage
        fetchParticipants()
        // Scroll to top of table
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

const filteredParticipants = computed(() => {
    return participants.value
})

const getStatusClass = (status) => {
    switch (status) {
        case 'Terdaftar':
            return 'bg-green-50 text-green-600 border-green-100'
        case 'Menunggu Acc':
            return 'bg-blue-50 text-blue-600 border-blue-100'
        default:
            return 'bg-gray-50 text-gray-600 border-gray-100'
    }
}

const uniqueClubs = computed(() => {
    const clubs = new Set(participants.value.map(p => p.club_name).filter(Boolean))
    return clubs.size
})

const getCategoryName = (participant) => {
    if (!participant) return '-'

    const parts = []
    if (participant.division_name) parts.push(participant.division_name)
    if (participant.category_name) parts.push(participant.category_name)
    if (participant.event_type_name) parts.push(participant.event_type_name)
    if (participant.gender_division_name) parts.push(participant.gender_division_name)

    return parts.length > 0 ? parts.join(' - ') : '-'
}

const showQRDialog = (participant) => {
    selectedParticipant.value = participant
    showQR.value = true
}

const downloadQR = () => {
    // Get the SVG element from the QR code
    const svg = document.querySelector('.bg-gray-50 svg')
    if (!svg) return

    // Create a canvas to convert SVG to image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()

    img.onload = () => {
        canvas.width = 300
        canvas.height = 300
        ctx.fillStyle = 'white'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)

        // Download the image
        const link = document.createElement('a')
        link.download = `qr-${selectedParticipant.value?.full_name || 'code'}.png`
        link.href = canvas.toDataURL()
        link.click()
    }

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

onMounted(() => {
    fetchEventDetails()
    fetchParticipants()
})

onBeforeUnmount(() => {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
