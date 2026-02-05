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

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <template v-if="isLoading">
                <div v-for="i in 4" :key="i"
                    class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div class="size-10 bg-gray-50 animate-pulse rounded-lg"></div>
                    <div class="space-y-2">
                        <div class="h-2 w-16 bg-gray-100 animate-pulse rounded"></div>
                        <div class="h-6 w-10 bg-gray-100 animate-pulse rounded"></div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div
                    class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                        <Icon icon="ph:users-three" class="text-2xl" />
                    </div>
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold  tracking-wider">Total Peserta</p>
                        <p class="text-xl font-black text-navy">{{ total }}</p>
                    </div>
                </div>

                <div
                    class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                        <Icon icon="ph:clock" class="text-2xl" />
                    </div>
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold  tracking-wider">Pending</p>
                        <p class="text-xl font-black text-navy">{{ pendingCount }}</p>
                    </div>
                </div>
                <div
                    class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-primary transition-all">
                    <div
                        class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                        <Icon icon="ph:buildings" class="text-2xl" />
                    </div>
                    <div>
                        <p class="text-[10px] text-gray-400 font-bold  tracking-wider">Klub</p>
                        <p class="text-xl font-black text-navy">{{ uniqueClubs }}</p>
                    </div>
                </div>
            </template>
        </div>


        <!-- Participants Table -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead class="bg-gray-50/50 border-b border-gray-100">
                        <tr class="text-[10px] font-black text-gray-400  tracking-widest">
                            <th class="px-6 py-4">No</th>
                            <th class="px-6 py-4">Nama Peserta</th>
                            <th class="px-6 py-4">Klub</th>
                            <th class="px-6 py-4">Kategori Lomba</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4">Registrasi Ulang</th>
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
                            <tr v-for="(participant, index) in filteredParticipants" :key="participant.id"
                                class="group hover:bg-gray-50/50 transition-colors">
                                <td class="px-6 py-4">
                                    <span class="text-sm font-bold text-gray-400">{{ (page - 1) * limit + index + 1
                                    }}</span>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs  border border-gray-200 overflow-hidden">
                                            <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                                class="w-full h-full object-cover">
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-1.5 min-w-0">
                                                <p class="text-sm font-bold text-navy truncate">{{ participant.full_name
                                                    }}
                                                </p>
                                            </div>
                                            <div class="flex items-center gap-2">
                                                <p class="text-xs text-gray-500 font-medium">{{ participant.email || '-'
                                                }}</p>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-gray-500 font-medium text-xs">{{ participant.club_name || '-'
                                }}
                                </td>
                                <td class="px-6 py-4">
                                    <p class="text-navy font-bold text-sm">{{ getCategoryName(participant) }}</p>
                                </td>
                                <td class="px-6 py-4">
                                    <span :class="getStatusClass(participant.status)"
                                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black  tracking-widest border">
                                        {{ participant.status || 'Menunggu Acc' }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    <BaseButton v-if="participant.status === 'Terdaftar' && participant.qr_raw"
                                        variant="outline" size="sm" icon="ph:qr-code" @click="showQRDialog(participant)"
                                        class="h-8 text-xs">
                                        Lihat QR
                                    </BaseButton>
                                    <span v-else class="text-xs text-gray-400 font-medium">-</span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <NuxtLink
                                            :to="`/dashboard/events/${route.params.id}/participants/${participant.username || participant.id}`"
                                            class="p-2 text-navy/40 hover:text-navy transition-colors"
                                            title="Lihat Detail">
                                            <Icon icon="ph:eye" class="text-lg" />
                                        </NuxtLink>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="filteredParticipants.length === 0">
                                <td colspan="7" class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                    Tidak ada peserta yang ditemukan.
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Controls -->
            <div v-if="totalPages > 1"
                class="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div class="text-xs font-bold text-gray-400  tracking-widest">
                    Showing {{ (page - 1) * limit + 1 }} to {{ Math.min(page * limit, total) }} of {{ total }}
                    participants
                </div>
                <div class="flex items-center gap-2">
                    <button @click="changePage(page - 1)" :disabled="page === 1"
                        class="p-2 rounded-lg border border-gray-200 bg-white text-navy/60 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <Icon icon="ph:caret-left-bold" />
                    </button>

                    <div class="flex items-center gap-1">
                        <button v-for="p in totalPages" :key="p" @click="changePage(p)"
                            class="h-10 w-10 rounded-lg border text-sm font-black transition-all" :class="page === p
                                ? 'bg-navy border-navy text-white shadow-md'
                                : 'bg-white border-gray-200 text-navy/60 hover:bg-gray-50 hover:text-navy'">
                            {{ p }}
                        </button>
                    </div>

                    <button @click="changePage(page + 1)" :disabled="page === totalPages"
                        class="p-2 rounded-lg border border-gray-200 bg-white text-navy/60 hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <Icon icon="ph:caret-right-bold" />
                    </button>
                </div>
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
        const response = await get(`/events/${route.params.id}/participants?limit=${limit.value}&offset=${offset}`)
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
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>
