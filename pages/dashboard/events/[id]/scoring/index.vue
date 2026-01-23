<template>
    <div class="flex flex-col gap-6 pb-12">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div class="space-y-1">
                <h1 class="text-3xl font-extrabold text-navy tracking-tight">Scoring Management</h1>
                <p class="text-gray-500 font-medium">Kelola dan input skor untuk event ini</p>
            </div>
            <div class="flex gap-3">
                <BaseButton variant="white" icon="ph:funnel" class="h-11">
                    Filter
                </BaseButton>
                <BaseButton variant="white" icon="ph:download" class="h-11">
                    Export Results
                </BaseButton>
            </div>
        </div>

        <!-- Scoring Context Selector -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 class="text-lg font-bold text-navy mb-4">Pilih Konteks Scoring</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Fase</label>
                    <select v-model="scoringContext.phase"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                        <option value="">Pilih Fase</option>
                        <option value="qualification">Kualifikasi</option>
                        <option value="elimination">Eliminasi</option>
                    </select>
                </div>
                <div v-if="scoringContext.phase === 'qualification'">
                    <label class="block text-sm font-bold text-gray-700 mb-2">Sesi</label>
                    <select v-model="scoringContext.sessionId" @change="loadTargets"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                        <option value="">Pilih Sesi</option>
                        <option v-for="session in sessions" :key="session.id" :value="session.id">
                            {{ session.session_name }}
                        </option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-2">Kategori</label>
                    <select v-model="scoringContext.categoryId" @change="loadTargets"
                        class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all">
                        <option value="">Pilih Kategori</option>
                        <option v-for="category in eventCategories" :key="category.id" :value="category.id">
                            {{ category.category_name }} - {{ category.division_name }}
                        </option>
                    </select>
                </div>
            </div>
        </div>

        <!-- Metrics Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div class="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:flag" class="text-2xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Total Ends Completed</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-bold text-navy">{{ totalEndsCompleted }}</h3>
                        <span class="text-xs font-semibold text-green-500">+24/hr</span>
                    </div>
                </div>
            </div>
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div
                    class="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:chart-line" class="text-2xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Average Score</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-bold text-navy">{{ averageScore.toFixed(1) }}</h3>
                        <span class="text-xs text-gray-400">per arrow</span>
                    </div>
                </div>
            </div>
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div
                    class="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:clock-countdown" class="text-2xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Pending Input</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-bold text-navy">{{ pendingTargets }}</h3>
                        <span class="text-xs font-semibold text-orange-500">Urgent</span>
                    </div>
                </div>
            </div>
            <div
                class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow">
                <div class="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                    <Icon icon="ph:trophy" class="text-2xl" />
                </div>
                <div>
                    <p class="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Highest Score</p>
                    <div class="flex items-baseline gap-2">
                        <h3 class="text-2xl font-bold text-navy">{{ highestScore }}</h3>
                        <span class="text-xs text-gray-400">{{ highestScoreArcher || 'N/A' }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Targets Table -->
        <div v-if="scoringContext.phase && scoringContext.categoryId && (scoringContext.phase !== 'qualification' || scoringContext.sessionId)"
            class="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <h3 class="font-bold text-navy">Real-time Scoring Progress</h3>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                        <span class="w-2 h-2 rounded-full bg-green-500"></span> Live
                    </span>
                    <span class="flex items-center gap-1 ml-2">
                        <span class="w-2 h-2 rounded-full bg-blue-500"></span> Completed
                    </span>
                    <span class="flex items-center gap-1 ml-2">
                        <span class="w-2 h-2 rounded-full bg-gray-300"></span> Pending
                    </span>
                </div>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr
                            class="border-b border-gray-100 bg-gray-50 text-xs uppercase tracking-wider text-gray-500 font-bold">
                            <th class="px-6 py-3 w-24">Target</th>
                            <th class="px-6 py-3">Archers</th>
                            <th class="px-6 py-3">End Progress</th>
                            <th class="px-6 py-3">Status</th>
                            <th class="px-6 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 text-sm">
                        <tr v-for="target in targets" :key="target.id" class="group hover:bg-gray-50 transition-colors"
                            :class="{ 'bg-orange-50/30': target.status === 'pending' }">
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center h-10 w-10 rounded-lg font-bold text-lg shadow-sm"
                                    :class="getTargetBadgeClass(target)">
                                    {{ String(target.target_number).padStart(2, '0') }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div v-if="target.archers && target.archers.length > 0" class="flex flex-col gap-1">
                                    <div v-for="archer in target.archers" :key="archer.position"
                                        class="flex items-center gap-2">
                                        <span
                                            class="w-5 h-5 rounded bg-gray-100 text-[10px] font-bold flex items-center justify-center text-gray-500">
                                            {{ archer.position }}
                                        </span>
                                        <span class="font-medium text-navy">{{ archer.name }}</span>
                                        <span class="text-xs text-gray-400 ml-1">{{ archer.current_score || '-'
                                            }}</span>
                                    </div>
                                </div>
                                <span v-else class="text-sm text-gray-400 italic">No archers active</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-1.5">
                                    <span class="text-xs font-semibold"
                                        :class="target.status === 'completed' ? 'text-blue-600' : 'text-gray-500'">
                                        {{ getEndProgressText(target) }}
                                    </span>
                                    <div class="flex items-center gap-1">
                                        <div v-for="(end, idx) in getEndDots(target)" :key="idx"
                                            class="w-2.5 h-2.5 rounded-full" :class="getEndDotClass(end, idx, target)">
                                        </div>
                                        <span class="text-[10px] text-gray-400 ml-1"
                                            v-if="target.status !== 'completed'">...</span>
                                        <span v-else class="text-[10px] text-blue-500 ml-1 font-bold">Done</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                                    :class="getStatusBadgeClass(target.status)">
                                    <span v-if="target.status === 'live'"
                                        class="block w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                    <Icon v-else-if="target.status === 'completed'" icon="ph:check"
                                        class="text-[14px]" />
                                    {{ getStatusLabel(target.status) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <BaseButton v-if="target.status !== 'pending'" variant="primary" size="sm"
                                    icon="ph:pencil-simple" @click="openScoringDialog(target)">
                                    Rapid Data Entry
                                </BaseButton>
                                <BaseButton v-else variant="white" size="sm" icon="ph:lock" disabled>
                                    Locked
                                </BaseButton>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-sm">
                <span class="text-gray-500">
                    Showing <span class="font-bold text-navy">1-{{ targets.length }}</span> of
                    <span class="font-bold text-navy">{{ targets.length }}</span> targets
                </span>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Icon icon="ph:target" class="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-navy mb-2">Pilih Konteks Scoring</h3>
            <p class="text-gray-500">Silakan pilih fase, sesi (jika kualifikasi), dan kategori untuk melihat daftar
                target</p>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useEventContext } from '~/composables/useEventContext'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const { get } = useApi()
const { setEvent, clearEvent } = useEventContext()

const eventId = route.params.id
const isLoading = ref(false)
const eventCategories = ref([])
const sessions = ref([])
const targets = ref([])

const scoringContext = ref({
    phase: '',
    sessionId: '',
    categoryId: ''
})

const totalEndsCompleted = computed(() => {
    return targets.value.reduce((sum, target) => sum + (target.completed_ends || 0), 0)
})

const averageScore = computed(() => {
    const scores = targets.value.flatMap(t =>
        (t.archers || []).map(a => parseFloat(a.current_score) || 0)
    ).filter(s => s > 0)
    if (scores.length === 0) return 0
    return scores.reduce((a, b) => a + b, 0) / scores.length
})

const pendingTargets = computed(() => {
    return targets.value.filter(t => t.status === 'pending').length
})

const highestScore = computed(() => {
    const scores = targets.value.flatMap(t =>
        (t.archers || []).map(a => ({ score: parseFloat(a.current_score) || 0, name: a.name }))
    )
    if (scores.length === 0) return 0
    const max = Math.max(...scores.map(s => s.score))
    return max
})

const highestScoreArcher = computed(() => {
    const scores = targets.value.flatMap(t =>
        (t.archers || []).map(a => ({ score: parseFloat(a.current_score) || 0, name: a.name }))
    )
    if (scores.length === 0) return null
    const max = Math.max(...scores.map(s => s.score))
    return scores.find(s => s.score === max)?.name || null
})

const fetchEventDetails = async () => {
    try {
        const eventRes = await get(`/events/${eventId}`)
        if (eventRes) {
            setEvent(eventRes)
        }
    } catch (error) {
        console.error('Failed to fetch event details:', error)
    }
}

const fetchEventCategories = async () => {
    try {
        const response = await get(`/events/${eventId}/categories`)
        if (response && response.events && Array.isArray(response.events)) {
            eventCategories.value = response.events.map(cat => ({
                id: cat.id,
                category_name: cat.category_name,
                division_name: cat.division_name
            }))
        }
    } catch (error) {
        console.error('Failed to fetch event categories:', error)
    }
}

const fetchSessions = async () => {
    if (!scoringContext.value.categoryId) return
    try {
        const response = await get(`/qualification/sessions?category_id=${scoringContext.value.categoryId}`)
        if (response && response.sessions) {
            sessions.value = response.sessions
        }
    } catch (error) {
        console.error('Failed to fetch sessions:', error)
        sessions.value = []
    }
}

const loadTargets = async () => {
    if (!scoringContext.value.phase || !scoringContext.value.categoryId) {
        targets.value = []
        return
    }

    if (scoringContext.value.phase === 'qualification' && !scoringContext.value.sessionId) {
        targets.value = []
        return
    }

    isLoading.value = true
    try {
        // TODO: Implement API endpoint to fetch targets with assignments and scoring progress
        // For now, using mock data structure
        const params = {
            phase: scoringContext.value.phase,
            category_id: scoringContext.value.categoryId,
            ...(scoringContext.value.phase === 'qualification' && { session_id: scoringContext.value.sessionId })
        }

        // Mock data structure - replace with actual API call
        targets.value = [
            {
                id: 1,
                target_number: 1,
                status: 'live',
                completed_ends: 4,
                total_ends: 20,
                archers: [
                    { position: 'A', name: 'Sarah Jenkins', current_score: 298 },
                    { position: 'B', name: 'Mike Ross', current_score: 285 }
                ]
            },
            {
                id: 2,
                target_number: 2,
                status: 'live',
                completed_ends: 4,
                total_ends: 20,
                archers: [
                    { position: 'A', name: 'Jessica Pearson', current_score: 290 },
                    { position: 'B', name: 'Harvey Specter', current_score: 292 }
                ]
            },
            {
                id: 3,
                target_number: 3,
                status: 'pending',
                completed_ends: 0,
                total_ends: 20,
                archers: []
            },
            {
                id: 4,
                target_number: 4,
                status: 'completed',
                completed_ends: 20,
                total_ends: 20,
                archers: [
                    { position: 'A', name: 'Louis Litt', current_score: 568 },
                    { position: 'B', name: 'Donna Paulsen', current_score: 552 }
                ]
            }
        ]
    } catch (error) {
        console.error('Failed to load targets:', error)
        targets.value = []
    } finally {
        isLoading.value = false
    }
}

const getTargetBadgeClass = (target) => {
    if (target.status === 'live') return 'bg-navy text-primary'
    if (target.status === 'completed') return 'bg-gray-100 border border-gray-200 text-gray-600'
    if (target.status === 'pending') return 'bg-white border border-orange-200 text-orange-600'
    return 'bg-white border border-gray-200 text-navy'
}

const getStatusBadgeClass = (status) => {
    const classes = {
        'live': 'bg-green-100 text-green-700 border border-green-200',
        'completed': 'bg-blue-50 text-blue-700 border border-blue-200',
        'pending': 'bg-orange-100 text-orange-700 border border-orange-200'
    }
    return classes[status] || 'bg-gray-100 text-gray-700 border border-gray-200'
}

const getStatusLabel = (status) => {
    const labels = {
        'live': 'Live',
        'completed': 'Finished',
        'pending': 'Pending'
    }
    return labels[status] || 'Unknown'
}

const getEndProgressText = (target) => {
    if (target.status === 'completed') {
        return `Completed (${target.total_ends}/${target.total_ends})`
    }
    return `End ${target.completed_ends || 0} of ${target.total_ends || 20}`
}

const getEndDots = (target) => {
    const total = target.total_ends || 20
    const completed = target.completed_ends || 0
    return Array.from({ length: Math.min(total, 20) }, (_, i) => i < completed)
}

const getEndDotClass = (isCompleted, idx, target) => {
    if (target.status === 'completed') {
        return 'bg-blue-500'
    }
    if (isCompleted) {
        return 'bg-navy'
    }
    if (idx === target.completed_ends) {
        return 'bg-primary border border-primary animate-pulse'
    }
    return 'bg-gray-200'
}

const openScoringDialog = (target) => {
    navigateTo(`/dashboard/events/${eventId}/scoring/input?target=${target.target_number}`)
}

watch(() => scoringContext.value.categoryId, () => {
    if (scoringContext.value.phase === 'qualification') {
        fetchSessions()
    }
    loadTargets()
})

watch(() => scoringContext.value.phase, () => {
    if (scoringContext.value.phase !== 'qualification') {
        scoringContext.value.sessionId = ''
    }
    loadTargets()
})

onMounted(() => {
    fetchEventDetails()
    fetchEventCategories()
})
</script>
