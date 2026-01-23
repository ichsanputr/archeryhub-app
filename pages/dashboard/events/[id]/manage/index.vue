<template>
    <div class="flex flex-col gap-8 pb-12">
        <!-- Breadcrumb & Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div class="space-y-1">
                <div v-if="isLoading" class="h-10 w-64 bg-gray-100 animate-pulse rounded-lg"></div>
                <h1 v-else class="text-3xl font-black text-navy tracking-tight leading-tight">
                    {{ event?.name }}
                </h1>

                <div class="flex flex-wrap items-center gap-4 mt-3">
                    <span :class="getStatusClass(event?.status)"
                        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border shadow-sm">
                        <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(event?.status)"></span>
                        {{ getStatusLabel(event?.status) }}
                    </span>
                    <div class="h-4 w-px bg-gray-200 hidden sm:block"></div>
                    <div class="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <Icon icon="ph:hash-bold" class="text-primary text-sm" />
                        <span>{{ event?.code }}</span>
                    </div>
                </div>
            </div>

            <div class="flex flex-wrap gap-3 mt-2 md:mt-2">
                <BaseButton variant="white" icon="ph:share-network-bold"
                    class="h-11 px-5 border-gray-200 shadow-sm font-bold">
                    Bagikan
                </BaseButton>
                <BaseButton :to="`/dashboard/events/${route.params.id}/edit`" variant="primary"
                    icon="ph:pencil-simple-line-bold" class="h-11 px-6 shadow-lg shadow-primary/20 font-bold">
                    Edit Event
                </BaseButton>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex items-center gap-6 border-b border-gray-100 pb-0">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                :class="activeTab === tab.id ? 'text-navy border-b-2 border-primary' : 'text-gray-400 hover:text-navy hover:border-gray-200'"
                class="pb-4 px-2 text-sm font-black uppercase tracking-widest transition-all border-b-2 border-transparent flex items-center gap-2">
                <Icon :icon="tab.icon" class="text-lg" />
                {{ tab.label }}
            </button>
        </div>

        <!-- Tab Content -->
        <div v-if="isLoading" class="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div class="lg:col-span-1 space-y-8">
                <div class="h-32 bg-gray-50 animate-pulse rounded-2xl"></div>
                <div class="h-32 bg-gray-50 animate-pulse rounded-2xl"></div>
            </div>
            <div class="lg:col-span-3 h-96 bg-gray-50 animate-pulse rounded-2xl"></div>
        </div>

        <div v-else>
            <!-- 1. PHASE CONTROL TAB -->
            <div v-if="activeTab === 'control'">
                <EventPhaseControl :event="event" @refresh="fetchEventDetails" />
            </div>

            <!-- 2. QUALIFICATION TAB -->
            <div v-if="activeTab === 'qualification'">
                <EventQualificationManager :event-id="route.params.id" />
            </div>

            <!-- 3. ELIMINATION TAB -->
            <div v-if="activeTab === 'elimination'">
                <EventEliminationManager :event-id="route.params.id" />
            </div>

            <!-- 4. ATHLETES TAB -->
            <!-- Sidebar: Stats -->
            <div class="lg:col-span-1 space-y-6">
                <div
                    class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-primary/30 transition-all">
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Total Atlet</p>
                    <div class="flex items-center justify-between">
                        <h3 class="text-3xl font-black text-navy">{{ event?.participant_count || 0 }}</h3>
                        <div
                            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                            <Icon icon="ph:users-three-bold" class="text-xl" />
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-primary/30 transition-all">
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Target Aktif</p>
                    <div class="flex items-center justify-between">
                        <h3 class="text-3xl font-black text-navy">{{ Math.ceil((event?.participant_count || 0) / 4)
                        }}</h3>
                        <div
                            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                            <Icon icon="ph:target-bold" class="text-xl" />
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm group hover:border-primary/30 transition-all">
                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">Completion</p>
                    <div class="flex items-center justify-between">
                        <h3 class="text-3xl font-black text-navy">0%</h3>
                        <div
                            class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                            <Icon icon="ph:check-circle-bold" class="text-xl" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Main Overview: Target Grid -->
            <div class="lg:col-span-3 space-y-8">
                <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h3 class="font-black text-navy text-lg tracking-tight">Status Target</h3>
                            <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time
                                monitoring</p>
                        </div>
                        <div class="flex gap-4">
                            <div
                                class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span class="w-2 h-2 rounded-full bg-primary"></span> Scoring
                            </div>
                            <div
                                class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                                <span class="w-2 h-2 rounded-full bg-gray-200"></span> Waiting
                            </div>
                        </div>
                    </div>
                    <div class="p-8">
                        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                            <button v-for="i in maxTargets" :key="i"
                                class="aspect-square rounded-xl border flex flex-col items-center justify-center hover:border-primary hover:shadow-md transition-all group bg-white shadow-sm"
                                :class="groupedTargets[i] ? 'border-primary/50' : 'border-gray-100 italic'">
                                <span class="text-navy font-black text-lg group-hover:scale-110 transition-transform"
                                    :class="{ 'opacity-30': !groupedTargets[i] }">
                                    {{ String(i).padStart(2, '0') }}
                                </span>
                                <div v-if="groupedTargets[i]" class="flex gap-0.5 mt-1">
                                    <div v-for="p in groupedTargets[i]" :key="p.id"
                                        class="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 2. ATHLETES TAB -->
        <div v-if="activeTab === 'athletes'" class="space-y-6">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div
                    class="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div>
                        <h3 class="font-black text-navy text-xl tracking-tight">Daftar Atlet Terpusat</h3>
                        <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Total {{
                            participants.length }} Atlet Terdaftar</p>
                    </div>
                    <div class="flex gap-3">
                        <BaseInput v-model="searchQuery" placeholder="Cari Nama / Klub..."
                            icon="ph:magnifying-glass-bold" class="max-w-xs" />
                        <BaseButton variant="primary" icon="ph:plus-bold" size="sm" class="font-bold">Tambah Manual
                        </BaseButton>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr
                                class="border-b border-gray-50 bg-gray-50/20 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                                <th class="px-8 py-5">Atlet</th>
                                <th class="px-8 py-5">Klub</th>
                                <th class="px-8 py-5">Divisi / Kategori</th>
                                <th class="px-8 py-5">Target</th>
                                <th class="px-8 py-5">Pembayaran</th>
                                <th class="px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50 text-sm">
                            <tr v-for="p in filteredParticipants" :key="p.id"
                                class="group hover:bg-gray-50/50 transition-colors">
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-navy font-bold text-xs uppercase">
                                            {{p.full_name?.split(' ').map(n => n[0]).join('')}}
                                        </div>
                                        <div>
                                            <p class="font-black text-navy tracking-tight">{{ p.full_name }}</p>
                                            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                {{ p.athlete_code }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-5 text-gray-500 font-medium">{{ p.club_id || '-' }}</td>
                                <td class="px-8 py-5">
                                    <p class="text-navy font-bold text-xs">{{ p.division_name }}</p>
                                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{
                                        p.category_name }}</p>
                                </td>
                                <td class="px-8 py-5">
                                    <span v-if="p.target_number"
                                        class="inline-flex items-center justify-center px-2 py-1 bg-navy text-primary rounded font-black text-xs shadow-sm">
                                        {{ String(p.target_number).padStart(2, '0') }}{{ p.back_number || '' }}
                                    </span>
                                    <span v-else
                                        class="text-[10px] text-gray-300 font-black uppercase italic">TBD</span>
                                </td>
                                <td class="px-8 py-5">
                                    <span
                                        :class="p.payment_status === 'paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'"
                                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border">
                                        {{ p.payment_status || 'Unpaid' }}
                                    </span>
                                </td>
                                <td class="px-8 py-5 text-right">
                                    <button class="p-2 text-gray-300 hover:text-navy transition-colors">
                                        <Icon icon="ph:pencil-simple-bold" />
                                    </button>
                                    <button class="p-2 text-gray-300 hover:text-red-500 transition-colors">
                                        <Icon icon="ph:trash-bold" />
                                    </button>
                                </td>
                            </tr>
                            <tr v-if="filteredParticipants.length === 0">
                                <td colspan="6" class="px-8 py-12 text-center text-gray-400 italic font-medium">
                                    Tidak ada atlet yang ditemukan.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 3. SCORING TAB -->
        <div v-if="activeTab === 'scoring'" class="space-y-6">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div
                    class="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                    <div>
                        <h3 class="font-black text-navy text-xl tracking-tight">Rapid Data Entry</h3>
                        <p class="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Input skor atlet
                            secara cepat per target</p>
                    </div>
                    <div class="flex gap-3">
                        <BaseButton variant="white" icon="ph:download-bold" size="sm" class="font-bold">Export Hasil
                        </BaseButton>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr
                                class="border-b border-gray-50 bg-gray-50/20 text-[10px] uppercase tracking-[0.2em] text-gray-400 font-black">
                                <th class="px-8 py-5 w-24">Target</th>
                                <th class="px-8 py-5">Nama Atlet</th>
                                <th class="px-8 py-5">Progress</th>
                                <th class="px-8 py-5">Status</th>
                                <th class="px-8 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-50 text-sm">
                            <tr v-for="p in filteredParticipants" :key="p.id"
                                class="group hover:bg-gray-50/50 transition-colors">
                                <td class="px-8 py-5">
                                    <div
                                        class="flex items-center justify-center h-10 w-10 bg-navy text-primary rounded-xl font-black text-sm shadow-sm">
                                        {{ String(p.target_number || 0).padStart(2, '0') }}{{ p.back_number || '' }}
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <p class="font-black text-navy">{{ p.full_name }}</p>
                                    <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{
                                        p.division_name }}</p>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex flex-col gap-1.5">
                                        <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">End
                                            0 of 6</span>
                                        <div class="flex items-center gap-1">
                                            <div v-for="i in 6" :key="i" class="w-2.5 h-2.5 rounded-full bg-gray-100">
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <span
                                        class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100">
                                        Waiting
                                    </span>
                                </td>
                                <td class="px-8 py-5 text-right">
                                    <BaseButton variant="primary" size="sm" icon="ph:note-pencil-bold"
                                        class="font-bold text-[10px] uppercase tracking-widest px-4">
                                        Input Skor
                                    </BaseButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 4. CATEGORIES TAB -->
        <div v-if="activeTab === 'categories'" class="space-y-8">
            <EventCategoryManager :event-id="route.params.id" @refresh="fetchEventDetails" />
        </div>

        <!-- 5. SETTINGS TAB -->
        <div v-if="activeTab === 'settings'" class="max-w-3xl space-y-8">
            <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="px-8 py-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 class="font-black text-navy text-lg tracking-tight">Pengaturan Publikasi</h3>
                </div>
                <div class="p-8 space-y-6">
                    <div class="flex items-center justify-between gap-6 p-4 rounded-2xl bg-amber-50 border border-amber-100"
                        v-if="event?.status === 'draft'">
                        <div class="flex items-center gap-4 text-amber-700">
                            <Icon icon="ph:warning-circle-bold" class="text-3xl" />
                            <div>
                                <p class="font-black text-sm uppercase tracking-widest">Event Masih Draft</p>
                                <p class="text-xs font-medium">Atlet belum bisa mendaftar sampai event dipublish.
                                </p>
                            </div>
                        </div>
                        <BaseButton variant="primary" @click="publishEvent" :loading="isPublishing"
                            class="font-black text-[10px] uppercase tracking-widest px-6">Publish Sekarang
                        </BaseButton>
                    </div>
                    <div class="space-y-4">
                        <h4 class="text-sm font-bold text-navy">Danger Zone</h4>
                        <BaseButton variant="white"
                            class="text-red-600 border-red-100 bg-red-50/30 hover:bg-red-50 font-bold"
                            icon="ph:trash-bold">
                            Batalkan Event
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get, post } = useApi()
const { setEvent, clearEvent } = useEventContext()
const event = ref(null)
const eventCategories = ref([])
const participants = ref([])
const searchQuery = ref('')
const isLoading = ref(true)
const isPublishing = ref(false)
const activeTab = ref('overview')

const filteredParticipants = computed(() => {
    if (!searchQuery.value) return participants.value
    const q = searchQuery.value.toLowerCase()
    return participants.value.filter(p =>
        p.full_name?.toLowerCase().includes(q) ||
        p.athlete_code?.toLowerCase().includes(q) ||
        p.club_id?.toLowerCase().includes(q)
    )
})

const tabs = [
    { id: 'qualification', label: 'Kualifikasi', icon: 'ph:scoreboard-bold' },
    { id: 'elimination', label: 'Eliminasi', icon: 'ph:tree-structure-bold' },
    { id: 'athletes', label: 'Atlet', icon: 'ph:users-three-bold' },
    { id: 'categories', label: 'Kategori', icon: 'ph:tag-bold' },
    { id: 'settings', label: 'Pengaturan', icon: 'ph:gear-six-bold' }
]

const groupedTargets = computed(() => {
    const targets = {}
    participants.value.forEach(p => {
        if (!p.target_number) return
        if (!targets[p.target_number]) {
            targets[p.target_number] = []
        }
        targets[p.target_number].push(p)
    })
    return targets
})

const maxTargets = computed(() => {
    // If we have targets, show up to the highest one, otherwise dummy 20
    const targetNumbers = Object.keys(groupedTargets.value).map(Number)
    if (targetNumbers.length === 0) return 20
    return Math.max(...targetNumbers, 20)
})

const fetchEventDetails = async () => {
    isLoading.value = true
    try {
        const [eventRes, categoriesRes, participantsRes] = await Promise.all([
            get(`/events/${route.params.id}`),
            get(`/events/${route.params.id}/categories`),
            get(`/events/${route.params.id}/participants`)
        ])
        event.value = eventRes
        eventCategories.value = categoriesRes?.categories || []
        participants.value = participantsRes?.participants || []

        // Set event context for header
        if (event.value) {
            setEvent(event.value)
        }
    } catch (error) {
        console.error('Failed to fetch event management data:', error)
    } finally {
        isLoading.value = false
    }
}

const publishEvent = async () => {
    isPublishing.value = true
    try {
        await post(`/events/${route.params.id}/publish`)
        await fetchEventDetails()
    } catch (error) {
        console.error('Failed to publish event:', error)
    } finally {
        isPublishing.value = false
    }
}

onMounted(() => {
    fetchEventDetails()
})

// Watch for event changes to update context
watch(event, (newEvent) => {
    if (newEvent) {
        setEvent(newEvent)
    }
}, { deep: true })

const getStatusClass = (status) => {
    const classes = {
        'published': 'bg-green-50 text-green-700 border-green-100 shadow-green-100/50',
        'draft': 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-100/50',
        'ongoing': 'bg-primary/20 text-navy border-primary/20 shadow-primary/10',
        'upcoming': 'bg-blue-50 text-blue-700 border-blue-100 shadow-blue-100/50',
        'completed': 'bg-gray-100 text-gray-600 border-gray-200'
    }
    return classes[status] || 'bg-gray-100 text-gray-600 border-gray-200'
}

const getStatusDotClass = (status) => {
    const classes = {
        'published': 'bg-green-500',
        'draft': 'bg-amber-500',
        'ongoing': 'bg-primary animate-pulse',
        'upcoming': 'bg-blue-500',
        'completed': 'bg-gray-300'
    }
    return classes[status] || 'bg-gray-300'
}

const getStatusLabel = (status) => {
    const labels = {
        'published': 'Published',
        'draft': 'Draft Mode',
        'ongoing': 'Live Event',
        'upcoming': 'Scheduled',
        'completed': 'Completed'
    }
    return labels[status] || status
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
</style>
