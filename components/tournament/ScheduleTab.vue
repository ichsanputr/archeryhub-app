<template>
    <div class="space-y-6">
        <!-- Main Container Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-gray-100">

            <!-- Loading State -->
            <div v-if="isLoading" class="py-20 flex flex-col items-center justify-center text-gray-400 gap-4">
                <Icon icon="ph:spinner-gap-bold" class="text-4xl animate-spin text-navy" />
                <p class="text-sm font-bold text-navy">{{ t('event_schedule.loading', 'Memuat jadwal...') }}</p>
            </div>

            <!-- Empty State (No Schedules at all) -->
            <div v-else-if="!displaySchedules.length" class="py-20 flex flex-col items-center justify-center text-center">
                <div class="w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-5 text-gray-300">
                    <Icon icon="ph:calendar-blank-bold" class="text-4xl" />
                </div>
                <h3 class="text-lg font-bold text-navy mb-1.5">{{ t('event_schedule.empty_title', 'Jadwal Belum Tersedia') }}</h3>
                <p class="text-gray-400 font-medium text-sm max-w-sm mx-auto leading-relaxed">
                    {{ t('event_schedule.empty_desc', 'Penyelenggara belum mempublikasikan jadwal pertandingan untuk event ini.') }}
                </p>
            </div>

            <!-- Main Schedule Content -->
            <div v-else class="space-y-6">

                <!-- 1. Day Selector Pills (Tabs) -->
                <div v-if="dayTabs.length > 0" class="border-b border-gray-100 pb-5">
                    <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                        <button
                            v-for="day in dayTabs"
                            :key="day.dayNumber"
                            type="button"
                            @click="selectedDay = day.dayNumber; selectedType = 'all'"
                            class="px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 border"
                            :class="selectedDay === day.dayNumber
                                ? 'bg-navy text-white border-navy shadow-sm'
                                : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100/80 hover:text-navy hover:border-gray-200'"
                        >
                            <Icon icon="ph:calendar-blank-bold" class="text-sm shrink-0" :class="selectedDay === day.dayNumber ? 'text-white' : 'text-gray-400'" />
                            <span>{{ t('event_schedule.day_label', { day: day.dayNumber }) }}</span>
                            <span v-if="day.dateLabel" class="text-xs font-normal opacity-80">• {{ day.dateLabel }}</span>
                            <span
                                class="px-2 py-0.5 rounded-full text-[11px] font-bold ml-1"
                                :class="selectedDay === day.dayNumber ? 'bg-white/20 text-white' : 'bg-white text-gray-600 border border-gray-100'"
                            >
                                {{ t('event_schedule.sessions_count', { count: day.itemCount }) }}
                            </span>
                        </button>
                    </div>
                </div>

                <!-- 2. Active Day Filter Toolbar -->
                <div v-if="typeFilters.length > 1" class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-2">
                    <button
                        v-for="filter in typeFilters"
                        :key="filter.value"
                        type="button"
                        @click="selectedType = filter.value"
                        class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shrink-0"
                        :class="selectedType === filter.value
                            ? 'bg-navy text-white border-navy shadow-xs'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:text-navy hover:border-gray-300'"
                    >
                        <Icon v-if="filter.icon" :icon="filter.icon" class="text-sm shrink-0" :class="selectedType === filter.value ? 'text-white' : 'text-gray-400'" />
                        <span>{{ filter.label }}</span>
                        <span
                            class="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                            :class="selectedType === filter.value ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'"
                        >
                            {{ filter.count }}
                        </span>
                    </button>
                </div>

                <!-- 3. Filter Zero State -->
                <div v-if="filteredSessions.length === 0" class="py-16 text-center">
                    <div class="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3 text-gray-300">
                        <Icon icon="ph:magnifying-glass-bold" class="text-3xl" />
                    </div>
                    <p class="text-sm font-bold text-navy mb-1">{{ t('event_schedule.no_sessions_found', 'Tidak ada sesi yang cocok dengan filter pencarian.') }}</p>
                    <button
                        type="button"
                        @click="selectedType = 'all'"
                        class="text-xs font-bold text-navy hover:underline mt-2 inline-flex items-center gap-1"
                    >
                        <span>{{ t('common.reset', 'Reset') }} Filter</span>
                        <Icon icon="ph:arrow-clockwise-bold" class="text-xs" />
                    </button>
                </div>

                <!-- 4. Session Cards List (Redesigned with Contrast & Structure) -->
                <div v-else class="space-y-4">
                    <div
                        v-for="(session, idx) in filteredSessions"
                        :key="session.uuid || session.id || idx"
                        class="bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5 relative group"
                    >
                        <!-- Left: Clean Time Display & Duration -->
                        <div class="flex items-center md:flex-col md:items-start justify-between md:justify-center shrink-0 min-w-[140px] gap-1 md:gap-0.5">
                            <div class="flex items-center gap-1.5 text-navy font-bold text-base sm:text-lg tracking-tight whitespace-nowrap">
                                <span>{{ formatStartTime(session.start_time) }}</span>
                                <span class="text-gray-300 font-normal text-sm">–</span>
                                <span>{{ formatStartTime(session.end_time) }}</span>
                            </div>
                            <div v-if="formatSessionDuration(session)" class="text-xs text-gray-400 font-medium flex items-center gap-1">
                                <Icon icon="ph:clock" class="text-xs text-gray-400 shrink-0" />
                                <span>{{ formatSessionDuration(session) }}</span>
                            </div>
                        </div>

                        <!-- Divider (Desktop) -->
                        <div class="hidden md:block w-px self-stretch bg-gray-100"></div>

                        <!-- Center: Title, Badges, Subtitle & Description -->
                        <div class="flex-1 min-w-0 space-y-1.5">
                            <!-- Type & Code Pill Row -->
                            <div class="flex flex-wrap items-center gap-2">
                                <span
                                    class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold"
                                    :class="getItemTypeBadgeClass(session.item_type)"
                                >
                                    <Icon :icon="getItemTypeIcon(session.item_type)" class="text-xs shrink-0" />
                                    <span>{{ getItemTypeLabel(session.item_type) }}</span>
                                </span>

                                <span
                                    v-if="getVal(session.session_code)"
                                    class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-gray-100 text-gray-700 border border-gray-200/60"
                                >
                                    {{ getVal(session.session_code) }}
                                </span>
                            </div>

                            <!-- Session Title -->
                            <h4 class="text-base sm:text-lg font-bold text-navy leading-snug">
                                {{ session.title }}
                            </h4>

                            <!-- Subtitle / Divisions Included -->
                            <p v-if="getSubtitle(session)" class="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                                {{ getSubtitle(session) }}
                            </p>

                            <!-- Notes / Description (if any) -->
                            <div v-if="getVal(session.description)" class="p-2.5 rounded-xl bg-gray-50 text-xs text-gray-500 leading-relaxed flex items-start gap-2 mt-2 border border-gray-100">
                                <Icon icon="ph:info-bold" class="text-sm text-gray-400 shrink-0 mt-0.5" />
                                <span>{{ getVal(session.description) }}</span>
                            </div>
                        </div>

                        <!-- Right: Target Range & Location Meta -->
                        <div class="flex flex-row md:flex-col md:items-end justify-between md:justify-center shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100 gap-2.5">
                            <!-- Target Range -->
                            <div v-if="formatTarget(session)" class="flex items-center gap-1.5 text-xs font-semibold text-navy bg-gray-100/80 px-3 py-1.5 rounded-xl border border-gray-200/80 shadow-xs">
                                <Icon icon="ph:target-bold" class="text-gray-400 text-sm shrink-0" />
                                <span>{{ formatTarget(session) }}</span>
                            </div>

                            <!-- Location -->
                            <div v-if="getLocationText(session)" class="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                                <Icon icon="ph:map-pin-bold" class="text-gray-400 text-sm shrink-0" />
                                <span class="font-medium truncate max-w-[150px]">{{ getLocationText(session) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const props = defineProps({
    eventId: {
        type: String,
        required: true
    },
    schedules: {
        type: Array,
        default: () => []
    }
})

const isLoading = ref(false)
const localSchedules = ref([])
const selectedDay = ref(1)
const selectedType = ref('all')

const fetchClientSchedules = async () => {
    if (props.schedules && props.schedules.length > 0) return
    if (!props.eventId) return
    isLoading.value = true
    try {
        const apiBaseUrl = useApiBaseUrl()
        const res = await $fetch(`${apiBaseUrl}/tournaments/${props.eventId}/schedule/timeline`).catch(() => null)
        if (res && res.days && res.days.length > 0) {
            const allItems = []
            res.days.forEach(d => {
                if (d.items && d.items.length > 0) {
                    d.items.forEach(it => {
                        allItems.push({
                            ...it,
                            day_number: d.day_number,
                            day_order: d.day_number,
                            schedule_date: d.schedule_date || it.schedule_date
                        })
                    })
                }
            })
            localSchedules.value = allItems
        } else {
            const fallbackRes = await $fetch(`${apiBaseUrl}/tournaments/${props.eventId}/schedule`).catch(() => null)
            if (fallbackRes && fallbackRes.schedules) {
                localSchedules.value = fallbackRes.schedules
            }
        }
    } catch (e) {
        console.warn('Failed to fetch schedules on client:', e)
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    if (!props.schedules || props.schedules.length === 0) {
        fetchClientSchedules()
    }
})

watch(() => props.schedules, (newVal) => {
    if (!newVal || newVal.length === 0) {
        fetchClientSchedules()
    }
})

const displaySchedules = computed(() => {
    if (props.schedules && props.schedules.length > 0) {
        return props.schedules
    }
    return localSchedules.value
})

const groupedByDay = computed(() => {
    const groups = {}
    displaySchedules.value.forEach(item => {
        const day = item.day_order || item.day_number || 1
        if (!groups[day]) groups[day] = []
        groups[day].push(item)
    })

    // Sort items within each day by start time
    Object.values(groups).forEach(list => {
        list.sort((a, b) => {
            const tA = a.start_time ? String(a.start_time) : '00:00'
            const tB = b.start_time ? String(b.start_time) : '00:00'
            return tA.localeCompare(tB)
        })
    })

    return groups
})

const sortedDays = computed(() => {
    return Object.keys(groupedByDay.value).map(Number).sort((a, b) => a - b)
})

// Auto-select first available day if selectedDay is not in sortedDays
watch(sortedDays, (days) => {
    if (days.length > 0 && !days.includes(selectedDay.value)) {
        selectedDay.value = days[0]
    }
}, { immediate: true })

const dayTabs = computed(() => {
    return sortedDays.value.map(dayNum => {
        const items = groupedByDay.value[dayNum] || []
        const dateStr = items[0]?.schedule_date || items[0]?.start_time || ''
        let dateLabel = ''
        if (dateStr && (dateStr.includes('-') || dateStr.includes('/'))) {
            try {
                const d = new Date(dateStr)
                if (!isNaN(d.getTime())) {
                    const loc = locale.value === 'id' ? 'id-ID' : 'en-US'
                    dateLabel = d.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short' })
                }
            } catch (e) {}
        }
        return {
            dayNumber: dayNum,
            dateLabel,
            itemCount: items.length
        }
    })
})

const currentDaySessions = computed(() => {
    return groupedByDay.value[selectedDay.value] || []
})

const activeDayDateFormatted = computed(() => {
    const items = currentDaySessions.value
    if (!items || items.length === 0) return ''
    const dateStr = items[0]?.schedule_date || items[0]?.start_time || ''
    if (!dateStr || (!dateStr.includes('-') && !dateStr.includes('/'))) return ''
    try {
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return ''
        const loc = locale.value === 'id' ? 'id-ID' : 'en-US'
        return d.toLocaleDateString(loc, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    } catch (e) {
        return ''
    }
})

const activeDayTargetRange = computed(() => {
    const items = currentDaySessions.value
    let minTarget = null
    let maxTarget = null

    items.forEach(it => {
        const start = it.target_start?.Valid ? it.target_start.Int64 : (typeof it.target_start === 'number' && it.target_start > 0 ? it.target_start : null)
        const end = it.target_end?.Valid ? it.target_end.Int64 : (typeof it.target_end === 'number' && it.target_end > 0 ? it.target_end : null)
        if (start !== null) {
            if (minTarget === null || start < minTarget) minTarget = start
            if (maxTarget === null || start > maxTarget) maxTarget = start
        }
        if (end !== null) {
            if (maxTarget === null || end > maxTarget) maxTarget = end
        }
    })

    if (minTarget !== null && maxTarget !== null && minTarget !== maxTarget) {
        return t('event_schedule.targets_range', { start: minTarget, end: maxTarget })
    }
    if (minTarget !== null) {
        return `Target ${minTarget}`
    }
    return ''
})

const typeFilters = computed(() => {
    const sessions = currentDaySessions.value
    if (!sessions || sessions.length === 0) return []

    const qualCount = sessions.filter(s => s.item_type === 'qualification').length
    const elimCount = sessions.filter(s => s.item_type === 'elimination').length
    const finalsCount = sessions.filter(s => s.item_type === 'finals').length
    const genCount = sessions.filter(s => s.item_type === 'general' || !s.item_type).length

    const list = [
        { value: 'all', label: t('event_schedule.all_types', 'Semua Sesi'), count: sessions.length, icon: 'ph:squares-four-bold' }
    ]
    if (qualCount > 0) list.push({ value: 'qualification', label: t('event_schedule.type_qualification', 'Kualifikasi'), count: qualCount, icon: 'ph:target-bold' })
    if (elimCount > 0) list.push({ value: 'elimination', label: t('event_schedule.type_elimination', 'Eliminasi'), count: elimCount, icon: 'ph:tree-structure-bold' })
    if (finalsCount > 0) list.push({ value: 'finals', label: t('event_schedule.type_finals', 'Final & Medali'), count: finalsCount, icon: 'ph:trophy-bold' })
    if (genCount > 0) list.push({ value: 'general', label: t('event_schedule.type_general', 'Umum / Latihan'), count: genCount, icon: 'ph:info-bold' })

    return list
})

const filteredSessions = computed(() => {
    let list = currentDaySessions.value
    if (selectedType.value !== 'all') {
        list = list.filter(item => item.item_type === selectedType.value)
    }
    return list
})

// Helpers
const formatStartTime = (timeStr) => {
    if (!timeStr) return '--:--'
    if (timeStr.includes(':') && timeStr.length <= 8) {
        return timeStr.substring(0, 5)
    }
    const loc = locale.value === 'id' ? 'id-ID' : 'en-US'
    try {
        const d = new Date(timeStr)
        if (isNaN(d.getTime())) return timeStr.substring(0, 5)
        return d.toLocaleTimeString(loc, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        })
    } catch (e) {
        return timeStr.substring(0, 5)
    }
}

const formatSessionDuration = (session) => {
    let mins = session.duration_minutes
    if (!mins || mins <= 0) {
        if (session.start_time && session.end_time) {
            const parseToMins = (str) => {
                const parts = String(str).split(':')
                if (parts.length >= 2) {
                    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
                }
                return null
            }
            const sMins = parseToMins(session.start_time)
            const eMins = parseToMins(session.end_time)
            if (sMins !== null && eMins !== null && eMins > sMins) {
                mins = eMins - sMins
            }
        }
    }
    if (!mins || mins <= 0) return ''

    const isId = locale.value === 'id'
    const h = Math.floor(mins / 60)
    const m = mins % 60

    if (h > 0 && m > 0) {
        return isId ? `${h} jam ${m} mnt` : `${h} hr ${m} mins`
    } else if (h > 0) {
        return isId ? `${h} jam` : (h === 1 ? '1 hour' : `${h} hours`)
    } else {
        return isId ? `${m} mnt` : `${m} mins`
    }
}

const getSubtitle = (session) => {
    const raw = getVal(session.subtitle)
    if (!raw) return ''
    if (raw === 'Semua Kategori / All Divisions') {
        return locale.value === 'id' ? 'Semua Kategori & Divisi' : 'All Categories & Divisions'
    }
    return raw
}


const getSessionStatus = (session) => {
    const now = new Date()
    // If start_time contains ISO datetime string
    if (session.start_time && session.start_time.length > 10) {
        const start = new Date(session.start_time)
        const end = session.end_time ? new Date(session.end_time) : null
        if (!isNaN(start.getTime()) && now < start) return 'upcoming'
        if (end && !isNaN(end.getTime()) && now > end) return 'completed'
        if (!isNaN(start.getTime()) && now >= start) return 'ongoing'
    }
    return 'upcoming'
}

const getVal = (v) => {
    if (!v) return ''
    if (typeof v === 'object' && v.Valid !== undefined) {
        return v.Valid ? v.String : ''
    }
    return String(v).trim()
}

const formatTarget = (item) => {
    if (!item) return ''
    const start = item.target_start?.Valid ? item.target_start.Int64 : (typeof item.target_start === 'number' && item.target_start > 0 ? item.target_start : null)
    const end = item.target_end?.Valid ? item.target_end.Int64 : (typeof item.target_end === 'number' && item.target_end > 0 ? item.target_end : null)
    if (start && end) return `Target ${start} – ${end}`
    if (start) return `Target ${start}`
    return ''
}

const getLocationText = (item) => {
    if (!item) return ''
    if (item.location?.Valid && item.location.String) return item.location.String
    if (typeof item.location === 'string' && item.location.trim()) return item.location
    return ''
}

const getItemTypeLabel = (type) => {
    switch (type) {
        case 'qualification': return t('event_schedule.type_qualification', 'Kualifikasi')
        case 'elimination': return t('event_schedule.type_elimination', 'Eliminasi')
        case 'finals': return t('event_schedule.type_finals', 'Final & Medali')
        default: return t('event_schedule.type_general', 'Umum / Latihan')
    }
}

const getItemTypeIcon = (type) => {
    switch (type) {
        case 'qualification': return 'ph:target-bold'
        case 'elimination': return 'ph:tree-structure-bold'
        case 'finals': return 'ph:trophy-bold'
        default: return 'ph:info-bold'
    }
}

const getItemTypeBadgeClass = (type) => {
    switch (type) {
        case 'qualification': return 'bg-blue-50 text-blue-700 border border-blue-100'
        case 'elimination': return 'bg-orange-50 text-orange-700 border border-orange-100'
        case 'finals': return 'bg-amber-50 text-amber-800 border border-amber-200'
        default: return 'bg-gray-100 text-gray-700 border border-gray-200'
    }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
