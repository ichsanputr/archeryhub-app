<template>
    <div class="space-y-6">
        <!-- Loading State -->
        <div v-if="isLoading" class="space-y-4 animate-pulse">
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <div class="h-5 w-48 bg-gray-200 rounded mb-4"></div>
                <div class="flex gap-4 overflow-hidden">
                    <div class="w-72 h-28 bg-gray-100 rounded-xl shrink-0"></div>
                    <div class="w-72 h-28 bg-gray-100 rounded-xl shrink-0"></div>
                    <div class="w-72 h-28 bg-gray-100 rounded-xl shrink-0"></div>
                </div>
            </div>
            <div class="bg-white rounded-2xl border border-gray-100 p-6">
                <div class="h-5 w-56 bg-gray-200 rounded mb-4"></div>
                <div class="space-y-3">
                    <div class="h-10 bg-gray-100 rounded-lg"></div>
                    <div class="h-10 bg-gray-100 rounded-lg"></div>
                    <div class="h-10 bg-gray-100 rounded-lg"></div>
                    <div class="h-10 bg-gray-100 rounded-lg"></div>
                </div>
            </div>
        </div>

        <template v-else>
            <!-- Manual Results (Files) -->
            <template v-if="resultsType === 'manual'">
                <div v-if="manualResults.length > 0" class="space-y-6">
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        <div v-for="(file, index) in manualResults" :key="index"
                            class="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-500 flex flex-col h-full">

                            <!-- Preview Area -->
                            <div
                                class="relative aspect-[4/3] overflow-hidden bg-white border-b border-gray-50 flex items-center justify-center">
                                <!-- Image Preview -->
                                <template v-if="isImage(file.url)">
                                    <img :src="file.url" :alt="file.name || file.title"
                                        class="w-full h-full object-cover transition-transform duration-700" />
                                </template>
                                <!-- PDF Preview -->
                                <template v-else-if="getFileExt(file.url) === 'pdf'">
                                    <div class="w-full h-full bg-white relative">
                                        <iframe
                                            :src="'https://docs.google.com/viewer?url=' + encodeURIComponent(file.url) + '&embedded=true'"
                                            class="w-full h-full pointer-events-none border-none scale-[1.01]"
                                            loading="lazy"></iframe>
                                        <div
                                            class="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                                            <Icon :icon="getFileIcon(file.url)"
                                                class="text-4xl text-gray-100 opacity-20" />
                                        </div>
                                    </div>
                                </template>
                                <!-- Other Doc Placeholder -->
                                <template v-else>
                                    <div
                                        class="w-full h-full flex flex-col items-center justify-center p-8 bg-white transition-all duration-500">
                                        <Icon :icon="getFileIcon(file.url)"
                                            class="text-6xl text-gray-200 group-hover:text-navy/20 transition-all duration-500" />
                                        <span class="mt-4 text-[10px] font-bold tracking-widest text-gray-400">
                                            {{ getFileExt(file.url) }} Document
                                        </span>
                                    </div>
                                </template>

                                <!-- Hover Overlay -->
                                <div
                                    class="absolute inset-0 bg-navy/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[1px]">
                                    <a :href="file.url" target="_blank"
                                        class="px-6 py-2 bg-white rounded-full text-navy text-xs font-bold shadow-sm border border-gray-100 hover:bg-navy hover:text-white transition-all">
                                        Lihat Berkas
                                    </a>
                                </div>
                            </div>

                            <!-- Info Area & Actions -->
                            <div class="p-5 flex flex-col gap-4">
                                <h4 class="font-bold text-navy text-sm line-clamp-2" :title="file.title || file.name">
                                    {{ file.title || file.name || 'Dokumen Hasil' }}
                                </h4>
                                <div class="flex gap-3">
                                    <a :href="file.url" target="_blank"
                                        class="flex-1 py-3 bg-gray-50 hover:bg-navy hover:text-white text-navy font-black  text-xs rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 border border-transparent">
                                        <Icon icon="ph:eye-bold" class="text-sm" />
                                        Lihat
                                    </a>
                                    <BaseButton variant="primary" size="sm"
                                        class="flex-1 !rounded-2xl !py-4 font-black  text-xs h-auto"
                                        :loading="downloadingIndex === index" @click="handleDownload(file, index)">
                                        <Icon v-if="downloadingIndex !== index" icon="ph:download-simple-bold"
                                            class="text-sm mr-2" />
                                        Unduh
                                    </BaseButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Manual Empty State -->
                <div v-else class="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                    <div class="h-24 w-24 bg-gray-50 rounded-full mx-auto flex items-center justify-center mb-6">
                        <Icon icon="ph:file-dashed" class="text-5xl text-gray-300" />
                    </div>
                    <h3 class="text-xl font-black text-navy mb-3">Belum Ada Dokumen Hasil</h3>
                    <p class="text-gray-500 leading-relaxed text-sm">
                        Dokumen hasil lomba belum diunggah oleh penyelenggara.
                    </p>
                </div>
            </template>

            <!-- System Results (Qualification + Elimination) -->
            <template v-else>
                <!-- Category Selector -->
                <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <h2 class="text-base font-bold text-navy mb-4">Pilih Kategori Lomba</h2>

                    <div v-if="categories.length === 0" class="text-center py-8 text-gray-400">
                        <div class="flex flex-col items-center">
                            <Icon icon="ph:folder-notch-open" class="text-4xl mb-2" />
                            <p>Kategori tidak ditemukan</p>
                        </div>
                    </div>

                    <div v-if="categories.length > 0" class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        <button v-for="category in categories" :key="category.uuid"
                            @click="selectCategory(category.uuid)" :class="[
                                'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
                                selectedCategory === category.uuid
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                            ]">
                            <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors"
                                :class="selectedCategory === category.uuid ? 'bg-primary' : 'bg-transparent'"></div>
                            <div class="flex items-start gap-3 pl-2">
                                <div
                                    class="size-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2 group-hover:bg-primary transition-colors">
                                    <img :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                                        :alt="category.division_name"
                                        class="w-full h-full object-contain invert group-hover:invert-0 transition-all" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p
                                        class="font-bold text-navy group-hover:text-primary transition-colors leading-tight mb-1.5 line-clamp-2">
                                        {{ category.category_name }}</p>
                                    <div class="flex items-center gap-2 text-xs text-gray-500">
                                        <Icon icon="ph:users-three" class="text-base" />
                                        <span class="font-semibold">{{ category.participant_count || 0 }}
                                            pemanah</span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>

                <!-- Elimination Results (Bracket Style) -->
                <div v-if="selectedCategory" class="space-y-6">
                    <div v-if="eliminationLoading"
                        class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse space-y-4">
                        <div class="h-6 w-60 bg-gray-200 rounded"></div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="h-24 bg-gray-100 rounded-xl"></div>
                            <div class="h-24 bg-gray-100 rounded-xl"></div>
                            <div class="h-24 bg-gray-100 rounded-xl"></div>
                            <div class="h-24 bg-gray-100 rounded-xl"></div>
                        </div>
                    </div>

                    <div v-else-if="currentElimBracket"
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <!-- Bracket Header -->
                        <div class="bg-gradient-to-r from-navy to-navy-light p-4 md:p-6">
                            <h3 class="!text-base !md:text-lg font-black text-white flex items-center gap-2">
                                <Icon icon="ph:trophy" class="text-primary" />
                                Eliminasi Bracket - {{ currentCategoryName }}
                            </h3>
                        </div>
                        <PublicEliminationBracket :bracket="currentElimBracket" :rounds="sortedElimRounds" />
                    </div>

                    <!-- Qualification Results Below -->
                    <div v-if="selectedCategory"
                        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div v-if="qualificationLoading" class="p-6 animate-pulse space-y-4">
                            <div class="h-6 w-64 bg-gray-200 rounded"></div>
                            <div class="space-y-3">
                                <div class="h-12 bg-gray-100 rounded-lg"></div>
                                <div class="h-12 bg-gray-100 rounded-lg"></div>
                                <div class="h-12 bg-gray-100 rounded-lg"></div>
                                <div class="h-12 bg-gray-100 rounded-lg"></div>
                                <div class="h-12 bg-gray-100 rounded-lg"></div>
                            </div>
                        </div>

                        <div v-else-if="!currentQualResults || currentQualResults.length === 0"
                            class="p-12 text-center">
                            <div class="flex flex-col items-center">
                                <Icon icon="ph:clipboard-text" class="text-6xl text-gray-300 mb-4" />
                                <p class="text-gray-500 font-medium">Hasil kualifikasi belum tersedia</p>
                            </div>
                        </div>

                        <template v-else>
                            <!-- Category Header -->
                            <div
                                class="bg-gradient-to-r from-navy to-navy-light p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <h3 class="!text-sm !md:text-base font-black text-white flex items-center gap-2">
                                    <Icon icon="ph:target" class="text-primary text-xl" />
                                    Kualifikasi Rangking - {{ currentCategoryName }}
                                </h3>

                                <!-- Session Selector -->
                                <div class="flex items-center gap-3">
                                    <span
                                        class="text-[10px] font-black text-white/60 tracking-widest hidden sm:block">Filter
                                        Sesi:</span>
                                    <select v-model="selectedSession"
                                        class="bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-2 rounded-xl outline-none focus:border-primary transition-all">
                                        <option v-if="availableSessions.length > 1" value="total" class="text-navy">
                                            Hasil Akhir (Semua Sesi)</option>
                                        <option v-for="sCode in availableSessions" :key="sCode" :value="sCode"
                                            class="text-navy">
                                            Sesi {{ sCode.replace('S', '') }}
                                        </option>
                                    </select>
                                </div>
                            </div>

                            <!-- Detailed Scores Table -->
                            <div class="overflow-x-auto">
                                <table class="w-full">
                                    <thead class="bg-gray-50 border-b-2 border-gray-200">
                                        <tr>
                                            <th :rowspan="selectedSession === 'total' ? 1 : 2"
                                                class="px-4 py-3 text-left text-xs font-black text-gray-500 tracking-wider sticky left-0 bg-gray-50 z-10 border-r border-gray-200">
                                                Rank
                                            </th>
                                            <th :rowspan="selectedSession === 'total' ? 1 : 2"
                                                class="px-4 py-3 text-left text-xs font-black text-gray-500 tracking-wider min-w-[200px]">
                                                Atlet
                                            </th>
                                            <th :rowspan="selectedSession === 'total' ? 1 : 2"
                                                class="px-4 py-3 text-center text-xs font-black text-gray-500 tracking-wider">
                                                Klub
                                            </th>
                                            <th v-if="selectedSession !== 'total'" :colspan="displayTotalEnds"
                                                class="px-4 py-2 text-center text-xs font-black text-gray-500 tracking-wider border-b border-gray-300">
                                                Skor Per End
                                            </th>
                                            <th :rowspan="selectedSession === 'total' ? 1 : 2"
                                                class="px-4 py-3 text-center text-xs font-black text-navy tracking-wider bg-navy/5 border-l-2 border-navy/20">
                                                Total
                                            </th>
                                            <th :rowspan="selectedSession === 'total' ? 1 : 2"
                                                class="px-4 py-3 text-center text-xs font-black text-gray-500 tracking-wider">
                                                10+X
                                            </th>
                                            <th :rowspan="selectedSession === 'total' ? 1 : 2"
                                                class="px-4 py-3 text-center text-xs font-black text-gray-500 tracking-wider">
                                                X
                                            </th>
                                        </tr>
                                        <tr v-if="selectedSession !== 'total'">
                                            <th v-for="i in displayTotalEnds" :key="i"
                                                class="px-2 py-2 text-center text-xs font-bold text-gray-400 border-x border-gray-200">
                                                {{ i }}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-gray-100">
                                        <template v-for="result in filteredQualResults" :key="result.participant_id">
                                            <tr class="hover:bg-gray-50 transition-colors">
                                                <td
                                                    class="px-4 py-4 whitespace-nowrap sticky text-center left-0 bg-white z-10 border-r border-gray-100">
                                                    <div class="flex items-center justify-center gap-2">
                                                        <div v-if="result.rank <= 3" class="text-2xl">
                                                            {{ result.rank === 1 ? '🥇' : result.rank === 2 ? '🥈' :
                                                                '🥉' }}
                                                        </div>
                                                        <div v-else class="text-sm font-black text-navy text-center">{{
                                                            result.rank }}</div>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-4">
                                                    <div class="flex items-center gap-3">
                                                        <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${result.archer_name}`"
                                                            class="size-8 rounded-full border-2 border-gray-200" />
                                                        <span class="text-sm font-bold text-navy whitespace-nowrap">{{
                                                            result.archer_name }}</span>
                                                    </div>
                                                </td>
                                                <td class="px-4 py-4 text-center">
                                                    <div
                                                        class="text-[10px] md:text-sm text-gray-600 line-clamp-2 leading-tight">
                                                        {{ result.club_name || '-' }}
                                                    </div>
                                                </td>
                                                <td v-if="selectedSession !== 'total'" v-for="i in displayTotalEnds"
                                                    :key="i"
                                                    class="px-2 py-4 text-center text-sm font-bold border-x border-gray-100"
                                                    :class="getEndScoreClass(result.displayScores[i - 1])">
                                                    {{ result.displayScores && result.displayScores[i - 1] !== undefined
                                                        ?
                                                        result.displayScores[i - 1] : '-' }}
                                                </td>
                                                <td class="px-4 py-4 text-center bg-navy/5 border-l-2 border-navy/20">
                                                    <span class="text-base sm:text-lg font-black text-navy">{{
                                                        result.displayTotal }}</span>
                                                </td>
                                                <td class="px-4 py-4 text-center text-sm font-bold text-gray-600">
                                                    {{ result.display10X }}
                                                </td>
                                                <td class="px-4 py-4 text-center text-sm font-bold text-gray-600">
                                                    {{ result.displayX }}
                                                </td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </template>
                    </div>
                </div>
            </template>

        </template>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import PublicEliminationBracket from './elimination/PublicEliminationBracket.vue'
import BaseButton from '~/components/common/BaseButton.vue'

const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()

const props = defineProps({
    eventId: {
        type: String,
        required: true
    },
    resultsType: {
        type: String,
        default: 'system' // 'system' or 'manual'
    },
    manualResults: {
        type: Array,
        default: () => []
    }
})

const { get } = useApi()
const isLoading = ref(true)
const qualificationLoading = ref(false)
const eliminationLoading = ref(false)
const categories = ref([])
const selectedCategory = ref(null)
const qualificationData = ref({})
const eliminationData = ref({})
const totalEnds = ref(12)
const downloadingIndex = ref(null)

const currentCategoryName = computed(() => {
    const cat = categories.value.find(c => c.uuid === selectedCategory.value)
    return cat?.category_name || ''
})

const currentQualResults = computed(() => {
    if (!selectedCategory.value) return []
    return qualificationData.value[selectedCategory.value] || []
})

const selectedSession = ref('total')

watch(selectedCategory, () => {
    // Determine default session: if only 1 session exists, select it. Otherwise 'total'.
    nextTick(() => {
        if (availableSessions.value.length === 1) {
            selectedSession.value = availableSessions.value[0]
        } else {
            selectedSession.value = 'total'
        }
    })
})

const availableSessions = computed(() => {
    const sessionCodes = new Set()
    currentQualResults.value.forEach(entry => {
        (entry.sessions || []).forEach(s => {
            if (s.session_code) sessionCodes.add(s.session_code)
        })
    })
    return Array.from(sessionCodes).sort()
})

const filteredQualResults = computed(() => {
    if (!selectedCategory.value) return []
    const results = currentQualResults.value.map(entry => {
        let displayScores = []
        let displayTotal = entry.total_score
        let display10X = entry.total_10x
        let displayX = entry.total_x

        if (selectedSession.value === 'total') {
            const sortedSessions = (entry.sessions || []).sort((a, b) => a.session_code.localeCompare(b.session_code))
            sortedSessions.forEach(s => {
                const scores = s.end_scores ? s.end_scores.split(',').map(v => parseInt(v) || 0) : []
                displayScores = [...displayScores, ...scores]
            })
        } else {
            const session = (entry.sessions || []).find(s => s.session_code === selectedSession.value)
            displayScores = session?.end_scores ? session.end_scores.split(',').map(v => parseInt(v) || 0) : []
            displayTotal = session?.total_score || 0
            display10X = session?.total_10x || 0
            displayX = session?.total_x || 0
        }

        return {
            ...entry,
            displayScores,
            displayTotal,
            display10X,
            displayX
        }
    })

    return results
})

const displayTotalEnds = computed(() => {
    if (selectedSession.value === 'total') return totalEnds.value

    for (const res of currentQualResults.value) {
        const session = (res.sessions || []).find(s => s.session_code === selectedSession.value)
        if (session && session.total_ends) return session.total_ends
    }

    return Math.floor(totalEnds.value / (availableSessions.value.length || 1))
})

const currentElimBracket = computed(() => {
    return eliminationData.value[selectedCategory.value] || null
})

const sortedElimRounds = computed(() => {
    if (!currentElimBracket.value?.matches) return []
    const rounds = currentElimBracket.value.matches
    const sortedKeys = Object.keys(rounds).sort((a, b) => parseInt(a) - parseInt(b))
    const sorted = {}
    sortedKeys.forEach(key => {
        sorted[key] = rounds[key]
    })
    return sorted
})

// Manual results helpers
const handleDownload = async (file, index) => {
    if (!file.url) return

    downloadingIndex.value = index
    try {
        const filename = file.url.split('/').pop()
        const downloadUrl = `${apiBaseUrl}/media-download/${filename}`

        const blob = await $fetch(downloadUrl, {
            responseType: 'blob'
        })

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        let downloadName = (file.name || file.title || filename).replace(/[/\\?%*:|"<>]/g, '-')
        const parts = filename.split('.')
        const ext = parts.length > 1 ? parts.pop() : ''

        if (ext && !downloadName.toLowerCase().endsWith(`.${ext.toLowerCase()}`)) {
            downloadName += `.${ext}`
        }
        link.setAttribute('download', downloadName)

        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error('Download failed:', error)
    } finally {
        downloadingIndex.value = null
    }
}

const getFileIcon = (url) => {
    if (!url) return 'ph:file-bold'
    const ext = url.split('.').pop().toLowerCase()
    if (['pdf'].includes(ext)) return 'ph:file-pdf-duotone'
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'ph:file-xls-duotone'
    if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return 'ph:file-image-duotone'
    return 'ph:file-bold'
}

const getFileExt = (url) => {
    if (!url) return ''
    return url.split('.').pop()?.toLowerCase() || ''
}

const isImage = (url) => {
    const ext = getFileExt(url)
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)
}

// System results data fetching
const fetchCategories = async () => {
    try {
        const response = await get(`/events/${props.eventId}/categories`, { params: { limit: 1000 } })
        const cats = response?.events || []

        const mappedCats = cats.map(cat => ({
            uuid: cat.id,
            category_name: [
                cat.division_name,
                cat.category_name,
                cat.gender_division_name,
                cat.event_type_name !== 'Individual' ? `(${cat.event_type_name})` : ''
            ].filter(Boolean).join(' '),
            division_name: cat.division_name,
            event_type_name: cat.event_type_name,
            gender_division_name: cat.gender_division_name,
            participant_count: cat.participant_count || 0
        }))

        mappedCats.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))

        categories.value = mappedCats
    } catch (error) {
        console.error('Failed to fetch categories:', error)
    }
}

const selectCategory = async (categoryUuid) => {
    selectedCategory.value = categoryUuid

    await Promise.all([
        loadQualificationResults(categoryUuid),
        loadEliminationBracket(categoryUuid)
    ])

    // Auto-select session if only one exists
    if (availableSessions.value.length === 1) {
        selectedSession.value = availableSessions.value[0]
    } else {
        selectedSession.value = 'total'
    }
}

const loadQualificationResults = async (categoryUuid) => {
    if (qualificationData.value[categoryUuid]) return

    qualificationLoading.value = true
    try {
        const response = await get(`/events/${props.eventId}/results/qualification?category_id=${categoryUuid}`)
        qualificationData.value[categoryUuid] = response?.results || []
        totalEnds.value = response?.total_ends || 12
    } catch (error) {
        console.error('Failed to fetch qualification results:', error)
        qualificationData.value[categoryUuid] = []
    } finally {
        qualificationLoading.value = false
    }
}

const loadEliminationBracket = async (categoryUuid) => {
    if (eliminationData.value[categoryUuid]) return

    eliminationLoading.value = true
    try {
        const response = await get(`/events/${props.eventId}/results/elimination?category_id=${categoryUuid}`)
        eliminationData.value[categoryUuid] = response?.bracket || null
    } catch (error) {
        console.error('Failed to fetch elimination bracket:', error)
        eliminationData.value[categoryUuid] = null
    } finally {
        eliminationLoading.value = false
    }
}

const getEndScoreClass = (score) => {
    if (!score) return ''
    if (score >= 58) return 'text-green-600 font-black'
    if (score >= 55) return 'text-blue-600 font-bold'
    return 'text-gray-600'
}

onMounted(async () => {
    isLoading.value = true

    // Only fetch system data if needed
    if (props.resultsType !== 'manual') {
        await fetchCategories()
        if (categories.value.length > 0) {
            await selectCategory(categories.value[0].uuid)
        }
    }

    isLoading.value = false
})
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
</style>
