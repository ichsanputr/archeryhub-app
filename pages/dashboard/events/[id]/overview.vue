<template>
    <div class="flex flex-col gap-8 pb-12">
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
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:calendar-check" class="text-primary text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <div class="flex items-center gap-3 mb-2">
                                <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                                    {{ isLoading ? 'Loading...' : event?.name || 'Event Overview' }}
                                </h1>
                            </div>
                            <p v-if="event" class="text-slate-300 text-sm mb-2">
                                {{ event.venue || 'Event Venue' }} • {{ event.location || 'Location' }}
                            </p>
                            <div class="flex flex-wrap items-center gap-4">
                                <span :class="getStatusClass(event?.status)"
                                    class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20 bg-white/5 backdrop-blur">
                                    <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(event?.status)"></span>
                                    {{ getStatusLabel(event?.status) }}
                                </span>
                                <div class="h-4 w-px bg-white/20 hidden sm:block"></div>
                                <div
                                    class="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
                                    <Icon icon="ph:hash-bold" class="text-primary text-sm" />
                                    <span>{{ event?.code }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-wrap gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:share-network-bold"
                            class="h-11 px-5 border-white/20 shadow-sm font-bold" @click="openShareDialog">
                            Bagikan
                        </BaseButton>
                        <BaseButton :to="`/dashboard/events/${route.params.id}/edit`" variant="primary"
                            icon="ph:pencil-simple-line-bold"
                            class="h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all font-bold">
                            Edit Event
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content (Overview) -->

        <!-- Loading State -->
        <div v-if="isLoading">
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div class="lg:col-span-1 space-y-8">
                    <div class="h-32 bg-gray-50 animate-pulse rounded-2xl"></div>
                    <div class="h-32 bg-gray-50 animate-pulse rounded-2xl"></div>
                </div>
                <div class="lg:col-span-3 h-96 bg-gray-50 animate-pulse rounded-2xl"></div>
            </div>
        </div>

        <!-- Tab Content -->
        <div v-else class="space-y-8">
            <!-- OVERVIEW TAB -->
            <div v-if="activeTab === 'overview'" class="space-y-8">
                <!-- Stats Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div
                        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Total
                                    Archers</p>
                                <p class="text-navy-dark text-3xl font-extrabold tracking-tight">{{
                                    event?.participant_count || 0 }}</p>
                            </div>
                            <div
                                class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                                <Icon icon="ph:users" class="text-xl" />
                            </div>
                        </div>
                        <div class="mt-auto">
                            <p class="text-green-600 text-xs font-bold flex items-center gap-1">
                                <Icon icon="ph:trend-up" class="text-[14px]" />
                                {{ participants.length }} registered
                            </p>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Active
                                    Targets</p>
                                <p class="text-navy-dark text-3xl font-extrabold tracking-tight">
                                    {{ Math.ceil((event?.participant_count || 0) / 4) }}<span
                                        class="text-lg text-gray-400 font-medium ml-1">/ {{ maxTargets }}</span></p>
                            </div>
                            <div
                                class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                                <Icon icon="ph:target" class="text-xl" />
                            </div>
                        </div>
                        <div class="mt-auto">
                            <p class="text-text-secondary text-xs font-medium flex items-center gap-1">
                                <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                All systems online
                            </p>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">
                                    Completion</p>
                                <p class="text-navy-dark text-3xl font-extrabold tracking-tight">{{ completionPercentage
                                    }}%</p>
                            </div>
                            <div
                                class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                                <Icon icon="ph:check-square-offset" class="text-xl" />
                            </div>
                        </div>
                        <div class="w-full bg-gray-100 rounded-full h-1.5 mt-auto">
                            <div class="bg-primary h-1.5 rounded-full" :style="`width: ${completionPercentage}%`"></div>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-xl p-5 flex flex-col justify-between h-32 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all border border-gray-100 group">
                        <div class="flex justify-between items-start">
                            <div>
                                <p class="text-text-secondary text-xs font-bold uppercase tracking-wider mb-1">Time
                                    Left</p>
                                <p class="text-navy-dark text-3xl font-extrabold tracking-tight tabular-nums">{{
                                    timeLeft }}</p>
                            </div>
                            <div
                                class="bg-gray-50 p-2 rounded-lg text-primary-hover group-hover:bg-primary group-hover:text-navy-dark transition-colors">
                                <Icon icon="ph:timer" class="text-xl" />
                            </div>
                        </div>
                        <div class="mt-auto">
                            <p class="text-text-secondary text-xs font-medium">Est. End: {{ estimatedEnd }}</p>
                        </div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Target Status -->
                    <div
                        class="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Target Status</h3>
                            <div class="flex gap-3 text-xs font-semibold">
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Shooting
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-primary"></span> Scoring
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <span class="w-2 h-2 rounded-full bg-red-500"></span> Issue
                                </div>
                            </div>
                        </div>
                        <div class="p-6 flex-1 overflow-y-auto bg-gray-50/30">
                            <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                                <button v-for="i in maxTargets" :key="i" :class="getTargetStatusClass(i)"
                                    class="aspect-square rounded-lg border flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition-all group shadow-sm">
                                    <span class="font-bold text-lg group-hover:scale-110 transition-transform"
                                        :class="getTargetTextClass(i)">
                                        {{ String(i).padStart(2, '0') }}
                                    </span>
                                    <div v-if="groupedTargets[i]" class="flex gap-1 mt-1">
                                        <div v-for="p in groupedTargets[i]" :key="p.id"
                                            class="w-2 h-2 rounded-full bg-primary border border-white"></div>
                                    </div>
                                    <Icon v-if="getTargetHasIssue(i)" icon="ph:warning"
                                        class="text-[16px] text-red-500 mt-1" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Leaderboard -->
                    <div
                        class="bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <div class="p-4 px-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 class="text-navy-dark font-bold text-lg flex items-center gap-2">Leaderboard</h3>
                            <button
                                class="text-xs text-text-secondary hover:text-navy-dark font-semibold transition-colors">View
                                All</button>
                        </div>
                        <div class="flex-1 overflow-y-auto">
                            <table class="w-full text-left text-sm">
                                <thead class="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                                    <tr>
                                        <th
                                            class="px-6 py-3 font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                                            #</th>
                                        <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Rk</th>
                                        <th class="px-6 py-3 font-medium text-xs uppercase tracking-wider">Archer</th>
                                        <th
                                            class="px-6 py-3 text-right font-medium text-xs uppercase tracking-wider whitespace-nowrap">
                                            Score</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-100">
                                    <tr v-for="(participant, idx) in topParticipants" :key="participant.id"
                                        class="hover:bg-gray-50 transition-colors group">
                                        <td class="px-6 py-3.5 text-xs font-mono text-gray-500 whitespace-nowrap">
                                            {{ participant.athlete_code || participant.id?.slice(0, 8) || '-' }}
                                        </td>
                                        <td class="px-6 py-3.5">
                                            <div v-if="idx === 0"
                                                class="bg-primary text-navy-dark font-extrabold w-6 h-6 rounded flex items-center justify-center text-xs shadow-sm">
                                                {{ idx + 1 }}</div>
                                            <span v-else class="text-lg font-black text-gray-400">{{ idx + 1 }}</span>
                                        </td>
                                        <td class="px-6 py-3.5">
                                            <div
                                                class="text-navy-dark font-bold group-hover:text-primary-hover transition-colors">
                                                {{ participant.full_name || participant.name || 'Unknown' }}</div>
                                            <div class="text-gray-400 text-xs">{{ participant.division_name || 'N/A' }}
                                            </div>
                                        </td>
                                        <td class="px-6 py-3.5 text-right font-mono text-navy-dark font-bold text-base">
                                            {{ participant.total_score || 0 }}</td>
                                    </tr>
                                    <tr v-if="topParticipants.length === 0">
                                        <td colspan="4" class="px-6 py-12 text-center text-gray-400 italic font-medium">
                                            No scores yet
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

        </div>

        <!-- Share Dialog -->
        <div v-if="showShareDialog"
            class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div
                class="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md mx-4 p-6 space-y-5 relative">
                <button class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                    @click="closeShareDialog">
                    <Icon icon="ph:x-bold" class="text-lg" />
                </button>

                <div class="flex items-start gap-3">
                    <div
                        class="bg-primary/10 text-primary rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
                        <Icon icon="ph:share-network-bold" class="text-xl" />
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-navy">Bagikan Halaman Event</h3>
                        <p class="text-sm text-gray-500 mt-1">
                            Sebarkan link halaman publik event ini ke sosial media atau salin link untuk dibagikan
                            ke peserta.
                        </p>
                    </div>
                </div>

                <div class="space-y-2">
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em]">Link Publik
                        Event</p>
                    <div class="flex items-center gap-2">
                        <div
                            class="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-600 font-mono truncate">
                            {{ publicEventUrl }}
                        </div>
                        <BaseButton variant="white" size="sm" icon="ph:copy-bold" class="whitespace-nowrap"
                            @click="copyPublicUrl">
                            Salin
                        </BaseButton>
                    </div>
                    <p v-if="copySuccess" class="text-[11px] text-green-600 font-semibold mt-1">
                        Link berhasil disalin ke clipboard
                    </p>
                </div>

                <div class="pt-3 border-t border-gray-100 space-y-3">
                    <p class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.18em]">Bagikan ke
                        Sosial Media</p>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <button type="button" @click="shareTo('whatsapp')"
                            class="flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all">
                            <Icon icon="ph:whatsapp-logo" class="text-2xl text-green-500" />
                            <span class="text-[11px] font-semibold text-gray-600">WhatsApp</span>
                        </button>
                        <button type="button" @click="shareTo('telegram')"
                            class="flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-100 hover:border-sky-500 hover:bg-sky-50 transition-all">
                            <Icon icon="ph:telegram-logo" class="text-2xl text-sky-500" />
                            <span class="text-[11px] font-semibold text-gray-600">Telegram</span>
                        </button>
                        <button type="button" @click="shareTo('twitter')"
                            class="flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-100 hover:border-black hover:bg-gray-50 transition-all">
                            <Icon icon="ph:twitter-logo" class="text-2xl text-black" />
                            <span class="text-[11px] font-semibold text-gray-600">X (Twitter)</span>
                        </button>
                        <button type="button" @click="shareTo('facebook')"
                            class="flex flex-col items-center justify-center gap-2 px-3 py-3 rounded-xl border border-gray-100 hover:border-blue-600 hover:bg-blue-50 transition-all">
                            <Icon icon="ph:facebook-logo" class="text-2xl text-blue-600" />
                            <span class="text-[11px] font-semibold text-gray-600">Facebook</span>
                        </button>
                    </div>
                </div>

                <div class="flex justify-end gap-3 pt-3 border-t border-gray-100">
                    <BaseButton variant="ghost" size="sm" @click="closeShareDialog">
                        Tutup
                    </BaseButton>
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
const showShareDialog = ref(false)
const copySuccess = ref(false)

const filteredParticipants = computed(() => {
    if (!searchQuery.value) return participants.value
    const q = searchQuery.value.toLowerCase()
    return participants.value.filter(p =>
        p.full_name?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.athlete_code?.toLowerCase().includes(q) ||
        p.club_name?.toLowerCase().includes(q) ||
        p.club_id?.toLowerCase().includes(q)
    )
})

const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: 'ph:layout-bold' }
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
    const targetNumbers = Object.keys(groupedTargets.value).map(Number)
    if (targetNumbers.length === 0) return 20
    return Math.max(...targetNumbers, 20)
})

const completionPercentage = computed(() => {
    if (!event.value || !participants.value.length) return 0
    // Simple calculation - can be enhanced with actual completion data
    const assigned = participants.value.filter(p => p.target_number).length
    return Math.round((assigned / participants.value.length) * 100)
})

const timeLeft = computed(() => {
    if (!event.value?.end_date) return 'N/A'
    const end = new Date(event.value.end_date)
    const now = new Date()
    const diff = end - now
    if (diff < 0) return '00:00'
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
})

const estimatedEnd = computed(() => {
    if (!event.value?.end_date) return 'N/A'
    const end = new Date(event.value.end_date)
    return end.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
})

const topParticipants = computed(() => {
    return participants.value
        .filter(p => p.total_score)
        .sort((a, b) => (b.total_score || 0) - (a.total_score || 0))
        .slice(0, 5)
})

const publicEventUrl = computed(() => {
    const slug = event.value?.slug || route.params.id
    const origin = window?.location?.origin || 'https://archeryhub.id'
    return `${origin}/events/${slug}`
})

const openShareDialog = () => {
    copySuccess.value = false
    showShareDialog.value = true
}

const closeShareDialog = () => {
    showShareDialog.value = false
}

const copyPublicUrl = async () => {
    try {
        await navigator.clipboard.writeText(publicEventUrl.value)
        copySuccess.value = true
        setTimeout(() => {
            copySuccess.value = false
        }, 2000)
    } catch (e) {
        console.error('Failed to copy link:', e)
    }
}

const shareTo = (platform) => {
    const url = encodeURIComponent(publicEventUrl.value)
    const text = encodeURIComponent(event.value?.name || 'Event Panahan')

    let shareUrl = ''
    if (platform === 'whatsapp') {
        shareUrl = `https://wa.me/?text=${text}%20-%20${url}`
    } else if (platform === 'telegram') {
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`
    } else if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener,noreferrer')
    }
}

const alerts = computed(() => {
    // Generate alerts based on event status
    const alertList = []
    if (participants.value.filter(p => !p.target_number).length > 0) {
        alertList.push({
            id: 1,
            type: 'info',
            icon: 'ph:user-plus',
            title: 'Unassigned Participants',
            message: `${participants.value.filter(p => !p.target_number).length} participants need target assignment.`
        })
    }
    return alertList
})

const getTargetStatusClass = (targetNum) => {
    const hasParticipants = groupedTargets.value[targetNum]
    if (!hasParticipants) {
        return 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
    }
    // Check if target has issues (can be enhanced with actual issue data)
    const hasIssue = false // Placeholder
    if (hasIssue) {
        return 'bg-red-50 border-red-200 text-red-600 animate-pulse'
    }
    return 'bg-white border-emerald-200 text-emerald-700 hover:border-emerald-400'
}

const getTargetTextClass = (targetNum) => {
    const hasParticipants = groupedTargets.value[targetNum]
    if (!hasParticipants) return 'text-gray-300'
    return 'text-emerald-700'
}

const getTargetHasIssue = (targetNum) => {
    // Placeholder - can be enhanced with actual issue detection
    return false
}

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
        'ongoing': 'Ongoing',
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

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
