<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Enhanced Header -->
    <div class="relative rounded-3xl border border-primary/20 text-white shadow-sm mb-2 z-20">

      <!-- Background and Effects Layer -->
      <div class="absolute inset-0 overflow-hidden rounded-[22px] bg-gradient-to-r from-navy via-navy to-navy/90">
        <!-- Theme Motif Pattern -->
        <div class="absolute inset-0"
          style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
        </div>

        <!-- Decorative Background Elements -->
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      </div>

      <!-- Header Content -->
      <div class="relative p-4 sm:p-8 z-10">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
          <div class="flex flex-col gap-3 flex-1 min-w-0">
            <!-- Top Row: Back Button & Title -->
            <div class="flex items-center gap-3 sm:gap-4 min-w-0">
              <button type="button"
                @click="navigateTo(`/dashboard/organizer/tournaments/${eventId}/qualification`)"
                class="size-10 sm:size-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-md hover:bg-primary hover:text-navy text-white transition-all shrink-0 cursor-pointer active:scale-95"
                :title="t('event_qualification.back')">
                <Icon icon="ph:arrow-left-bold" class="text-lg sm:text-xl" />
              </button>

              <div v-if="isLoading && !sessionData"
                class="h-8 w-48 sm:h-10 sm:w-64 bg-white/10 rounded-lg animate-pulse"></div>
              <h1 v-else class="text-lg sm:text-2xl lg:text-3xl font-black leading-tight tracking-tight text-white truncate flex-1 min-w-0">
                {{ sessionData?.name || t('event_qualification.qualification_session') }}
              </h1>
            </div>

            <!-- Chips Meta Info -->
            <div v-if="isLoading && !sessionData" class="flex gap-4 sm:pl-16">
              <div class="h-5 w-20 bg-white/5 rounded animate-pulse"></div>
              <div class="h-5 w-24 bg-white/5 rounded animate-pulse"></div>
            </div>
            <div v-else
              class="flex flex-wrap items-center gap-1.5 sm:gap-2.5 text-xs text-slate-300 font-bold">
              <!-- Session Code Chip -->
              <div class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] sm:text-xs font-bold backdrop-blur-xs font-mono">
                <Icon icon="ph:hash-bold" class="text-xs text-primary" />
                <span>{{ sessionData?.session_code }}</span>
              </div>

              <!-- Total Ends Chip -->
              <div class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] sm:text-xs font-bold backdrop-blur-xs">
                <Icon icon="ph:arrow-clockwise-bold" class="text-xs text-primary" />
                <span>{{ sessionData?.total_ends || 0 }} {{ t('event_qualification.ends') }}</span>
              </div>

              <!-- Arrows per End Chip -->
              <div class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] sm:text-xs font-bold backdrop-blur-xs">
                <Icon icon="ph:crosshair-bold" class="text-xs text-primary" />
                <span>{{ sessionData?.arrows_per_end || 0 }} {{ t('event_qualification.arrows').toLowerCase() }}/{{ t('event_qualification.ends').toLowerCase().replace(/s$/, '') }}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons (Print Scoresheet) -->
          <div v-if="sessionData" class="flex items-center gap-2.5 sm:gap-3 shrink-0 pt-3 lg:pt-0 border-t border-white/10 lg:border-t-0 w-full sm:w-auto">
            <button type="button" :disabled="isDownloadingScoresheet"
              class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white hover:bg-primary hover:text-navy border border-white/20 rounded-xl transition-all text-xs sm:text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 cursor-pointer"
              @click="downloadScoresheet">
              <Icon :icon="isDownloadingScoresheet ? 'ph:spinner' : 'ph:printer-bold'"
                :class="['text-base sm:text-lg', isDownloadingScoresheet ? 'animate-spin' : '']" />
              <span class="truncate">{{ isDownloadingScoresheet ? t('event_qualification.processing') : t('event_qualification.print_scoresheet') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white rounded-t-2xl px-2">
      <button v-for="t in tabs" :key="t.id" type="button" @click="activeTab = t.id"
        class="px-6 py-4 border-b-2 font-black text-sm sm:text-base flex items-center gap-2.5 whitespace-nowrap transition-colors outline-none"
        :class="activeTab === t.id
          ? 'border-primary text-navy bg-primary/5'
          : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'">
        <Icon :icon="t.icon" class="text-xl" />
        <span>{{ t.label }}</span>
      </button>
    </div>

    <!-- Category Selection (Shared for both tabs) -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 class="text-base font-bold text-navy mb-4">{{ t('event_qualification.choose_category') }}</h2>

      <div v-if="loadingCategories" class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <div v-for="i in 4" :key="i" class="flex-shrink-0 w-72 p-5 rounded-xl border border-gray-100 animate-pulse">
          <div class="flex items-start gap-3">
            <div class="size-12 bg-gray-100 rounded-xl"></div>
            <div class="flex-1">
              <div class="h-5 bg-gray-100 rounded mb-2"></div>
              <div class="h-4 bg-gray-50 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="categories.length === 0" class="text-center py-8 text-gray-400">
        <Icon icon="ph:folder-notch-open" class="text-4xl mx-auto mb-2" />
        <div>{{ t('event_qualification.category_not_found') }}</div>
      </div>

      <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <div v-for="category in categories" :key="category.id" @click="selectCategory(category.id)" :class="[
          'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative cursor-pointer',
          selectedCategory === category.id
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300'
        ]">
          <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors"
            :class="selectedCategory === category.id ? 'bg-primary' : 'bg-transparent'"></div>
          <div class="flex items-start gap-3 pl-2">
            <div
              class="size-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-2xs overflow-hidden p-2 transition-colors"
              :class="selectedCategory === category.id ? 'bg-primary text-btn-text' : 'bg-primary/10 text-navy group-hover:bg-primary group-hover:text-btn-text'">
              <img
                :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                :alt="category.division_name"
                class="w-full h-full object-contain" />
            </div>
            <div class="flex-1 min-w-0">
              <div
                class="font-extrabold text-navy leading-tight mb-1.5 line-clamp-2">
                {{ getCategoryName(category) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MAIN MODES -->
    <div class="relative">
      <!-- Loading Overlay -->
      <div v-if="isLoadingAssignments"
        class="absolute inset-0 z-[50] flex items-center justify-center bg-white/60 backdrop-blur-sm min-h-[400px]">
        <div class="flex flex-col items-center gap-3">
          <div class="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div class="text-xs font-bold text-navy animate-pulse tracking-widest">{{ t('event_qualification.loading_data') }}</div>
        </div>
      </div>

      <!-- Mode: Target Assignment -->
      <div v-if="activeTab === 'target' && selectedCategory">
        <QualificationTargetMode :eventId="eventId" :sessionData="sessionData" :selectedCategory="selectedCategory"
          :availableTargets="availableTargets" :archers="currentCategoryArchers" :boardCodes="boardCodes"
          :allAssignments="allSessionAssignments" @updated="handleAssignmentsSaved" />
      </div>

      <!-- Mode: Input Scoring -->
      <div v-else-if="activeTab === 'input' && selectedCategory">
        <QualificationScoringMode :sessionData="sessionData" :selectedCategory="selectedCategory"
          :targetAssignments="targetAssignments" @updated="fetchTargetAssignments(selectedCategory)"
          @switch-tab="(tab) => activeTab = tab" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!selectedCategory"
        class="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
        <div class="size-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="ph:cursor-click-bold" class="text-4xl text-gray-300" />
        </div>
        <h3 class="text-xl font-bold text-navy mb-2">{{ t('event_qualification.category_not_selected') }}</h3>
        <div class="text-gray-500 max-w-xs mx-auto">{{ t('event_qualification.choose_category_to_manage') }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import QualificationTargetMode from '~/components/qualification/QualificationTargetMode.vue'
import QualificationScoringMode from '~/components/qualification/QualificationScoringMode.vue'

const { t } = useI18n()
const route = useRoute()
const { get } = useApi()
const config = useRuntimeConfig()
const apiBaseUrl = useApiBaseUrl()
const toast = useToast()
const eventId = route.params.id
const sessionCode = route.params.session

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => `${t('event_qualification.title')} - Archeris Dashboard`)
})

// State
const sessionData = ref(null)
const isLoading = ref(true)
const activeTab = ref('target')
const selectedCategory = ref(null)
const categories = ref([])
const availableTargets = ref([])
const allParticipants = ref([])
const archersByCategory = ref({})
const targetAssignments = ref([])
const boardCodes = ref([])
const allSessionAssignments = ref([])
const isLoadingAssignments = ref(false)
const loadingCategories = ref(false)
const isDownloadingScoresheet = ref(false)

const tabs = computed(() => [
  { id: 'target', label: t('event_qualification.board_assignments'), icon: 'ph:target' },
  { id: 'input', label: t('event_qualification.input_scoring'), icon: 'ph:pencil-simple' }
])

const currentCategoryArchers = computed(() => {
  if (!selectedCategory.value) return []
  return archersByCategory.value[selectedCategory.value] || []
})

// Methods
const getCategoryName = (category) => {
  if (!category) return ''
  const parts = [
    category.division_name,
    category.category_name,
    category.event_type_name,
    category.gender_division_name
  ].filter(Boolean)
  return parts.join(' ')
}

const fetchSessionData = async () => {
  try {
    const response = await get(`/tournaments/${eventId}/qualification/sessions`)
    const sessions = response?.sessions || []
    sessionData.value = sessions.find(s => s.session_code === sessionCode)
  } catch (error) {
    console.error('Failed to fetch session:', error)
  }
}

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await get(`/tournaments/${eventId}/categories`, { params: { limit: 1000 } })
    const fetchedCategories = response?.events || response.data?.events || response?.categories || response.data?.categories || []
    const individualCategories = fetchedCategories.filter(cat =>
      cat.event_type_name?.toLowerCase() === 'individual' || !cat.event_type_name
    )

    // Sort by participant_count descending
    individualCategories.sort((a, b) => (b.participant_count || 0) - (a.participant_count || 0))

    // Filter to only categories linked to this session (from qualification_session_categories)
    const sessionCategoryIds = sessionData.value?.category_ids || []
    const filtered = sessionCategoryIds.length
      ? individualCategories.filter(c => sessionCategoryIds.includes(c.id || c.uuid))
      : individualCategories
    categories.value = filtered
  } catch (error) {
    console.error('Failed to fetch categories:', error)
  } finally {
    loadingCategories.value = false
  }
}

const fetchAllParticipants = async () => {
  try {
    const response = await get(`/tournaments/${eventId}/participants`, { params: { limit: 1000, offset: 0 } })
    allParticipants.value = response?.participants || response.data?.participants || []
  } catch (error) {
    console.error('Failed to fetch participants:', error)
  }
}

const fetchArchersForCategory = async (categoryId) => {
  if (!categoryId) return

  const extractForCat = () => {
    const list = []
    allParticipants.value.forEach(p => {
      if (Array.isArray(p.categories)) {
        p.categories.forEach(cat => {
          if (cat.category_id === categoryId) {
            list.push({
              uuid: cat.participant_id || p.id || p.uuid,
              archerId: p.archer_id || p.id,
              name: p.full_name || p.archer_name || p.name,
              club: p.club_name || p.club,
              avatar_url: p.avatar_url || p.photo_url,
              assignedTarget: '',
              assignmentId: null
            })
          }
        })
      } else if (p.category_id === categoryId) {
        list.push({
          uuid: p.id || p.uuid || p.participant_id,
          archerId: p.archer_id || p.id,
          name: p.full_name || p.archer_name || p.name,
          club: p.club_name || p.club,
          avatar_url: p.avatar_url || p.photo_url,
          assignedTarget: '',
          assignmentId: null
        })
      }
    })
    return list
  }

  let matched = extractForCat()
  if (matched.length === 0) {
    try {
      const response = await get(`/tournaments/${eventId}/participants`, {
        params: { category_id: categoryId, limit: 1000 }
      })
      const newParticipants = response?.participants || []
      const otherParticipants = allParticipants.value.filter(p => {
        if (p.category_id === categoryId) return false
        if (Array.isArray(p.categories) && p.categories.some(c => c.category_id === categoryId)) return false
        return true
      })
      allParticipants.value = [...otherParticipants, ...newParticipants]
      matched = extractForCat()
    } catch (error) {
      console.error('Failed to fetch category participants:', error)
    }
  }

  archersByCategory.value = {
    ...archersByCategory.value,
    [categoryId]: matched
  }
}

const fetchTargets = async () => {
  try {
    const response = await get(`/tournaments/${eventId}/targets/options`)
    const options = response?.options || response.data?.options || []
    availableTargets.value = options.map((opt) => ({
      id: opt.id || opt.uuid,
      name: opt.target_name || opt.value || opt.name
    }))
  } catch (error) {
    console.error('Failed to fetch targets:', error)
  }
}

const fetchBoardCodes = async () => {
  if (!sessionData.value || !selectedCategory.value) return
  try {
    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/board-codes`, {
      params: { category_id: selectedCategory.value }
    })
    boardCodes.value = response?.board_codes || []
  } catch (error) {
    console.error('Failed to fetch board codes:', error)
  }
}

const isAssignmentForCategory = (assignment, categoryId) => {
  if (!assignment || !categoryId) return false
  const p = allParticipants.value.find(part => {
    if (part.id === assignment.participant_id || part.uuid === assignment.participant_id || part.participant_id === assignment.participant_id) return true
    if (Array.isArray(part.categories)) {
      return part.categories.some(c => c.participant_id === assignment.participant_id)
    }
    return false
  })
  if (!p) {
    // Check inside archersByCategory directly
    const catArchers = archersByCategory.value[categoryId] || []
    return catArchers.some(a => a.uuid === assignment.participant_id)
  }
  if (Array.isArray(p.categories)) {
    return p.categories.some(c => c.participant_id === assignment.participant_id && c.category_id === categoryId)
  }
  return p.category_id === categoryId
}

const loadExistingAssignments = async (categoryId, preLoadedAssignments = null) => {
  if (!sessionData.value) return
  try {
    let assignments = preLoadedAssignments
    if (!assignments) {
      const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
      assignments = response?.assignments || response.data?.assignments || []
      allSessionAssignments.value = assignments
      assignments = assignments.filter(a => isAssignmentForCategory(a, categoryId))
    }

    if (archersByCategory.value[categoryId]) {
      const updatedArchers = archersByCategory.value[categoryId].map(archer => {
        const existing = assignments.find(a => a.participant_id === archer.uuid)
        return {
          ...archer,
          assignedTarget: existing ? existing.target_id : '',
          assignmentId: existing ? (existing.uuid || existing.id) : null,
          has_score: Boolean(existing?.has_score || (existing?.ends_completed && existing.ends_completed > 0)),
          total_score: existing?.total_score || 0,
          ends_completed: existing?.ends_completed || 0
        }
      })
      archersByCategory.value = {
        ...archersByCategory.value,
        [categoryId]: updatedArchers
      }
    }
  } catch (error) {
    console.error('Failed to load existing assignments:', error)
  }
}

const fetchTargetAssignments = async (categoryId, preLoadedAssignments = null) => {
  if (!sessionData.value) return
  try {
    let assignments = preLoadedAssignments
    if (!assignments) {
      const assignmentsRes = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`, {
        params: { category_id: categoryId }
      })
      assignments = assignmentsRes?.assignments || assignmentsRes.data?.assignments || []
    }

    // Filter by participationIds if archersByCategory is loaded
    const categoryArchers = archersByCategory.value[categoryId] || []
    if (categoryArchers.length > 0) {
      const participationIds = new Set(categoryArchers.map(a => a.uuid))
      assignments = assignments.filter(a => participationIds.has(a.participant_id))
    }

    const scoresRes = await get(`/qualification/sessions/${sessionData.value.uuid}/scores`, {
      params: { category_id: categoryId }
    })
    const allScores = scoresRes?.scores || []

    targetAssignments.value = assignments.map(a => {
      const participantInfo = allParticipants.value.find(p => {
        if (p.id === a.participant_id || p.uuid === a.participant_id || p.participant_id === a.participant_id) return true
        if (Array.isArray(p.categories)) {
          return p.categories.some(c => c.participant_id === a.participant_id)
        }
        return false
      })
      const clubName = a.club_name || a.club || participantInfo?.club_name || participantInfo?.club || ''
      const avatarUrl = a.avatar_url || a.archer_avatar_url || participantInfo?.avatar_url || participantInfo?.photo_url || ''
      const archerName = a.archer_name || a.name || participantInfo?.full_name || participantInfo?.archer_name || ''
      const archerScore = allScores.find(s => s.participant_uuid === a.participant_id)
      const allEndScores = {}
      let currentEnd = 1

      if (archerScore && archerScore.ends) {
        archerScore.ends.forEach(endScore => {
          const arrows = Array.from({ length: sessionData.value?.arrows_per_end || 6 }, () => undefined)
            ; (endScore.arrows || []).forEach(arrow => {
              let value = arrow.score
              if (arrow.is_x) value = 'X'
              else if (arrow.score === 0) value = 'M'

              arrows[arrow.arrow_number - 1] = value
            })
          allEndScores[endScore.end_number] = arrows
        })

        const totalEnds = sessionData.value?.total_ends || 1
        for (let i = 1; i <= totalEnds; i++) {
          if (!allEndScores[i] || allEndScores[i].every(v => v === undefined)) {
            currentEnd = i
            break
          }
          if (i === totalEnds) currentEnd = totalEnds
        }
      }

      return {
        ...a,
        archer_name: archerName,
        club_name: clubName,
        avatar_url: avatarUrl,
        currentEnd,
        currentEndScores: allEndScores[currentEnd] ? [...allEndScores[currentEnd]] : Array.from({ length: sessionData.value?.arrows_per_end || 6 }, () => undefined),
        allEndScores
      }
    })
  } catch (error) {
    console.error('Failed to fetch assignments:', error)
  }
}

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId
  isLoadingAssignments.value = true
  try {
    await fetchArchersForCategory(categoryId)

    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
    const allAssignments = response?.assignments || response.data?.assignments || []
    allSessionAssignments.value = allAssignments

    const categoryAssignments = allAssignments.filter(a => isAssignmentForCategory(a, categoryId))

    await loadExistingAssignments(categoryId, categoryAssignments)
    await fetchTargetAssignments(categoryId, categoryAssignments)
    await fetchBoardCodes()
  } catch (error) {
    console.error("Error selecting category:", error)
  } finally {
    isLoadingAssignments.value = false
  }
}

const handleAssignmentsSaved = async () => {
  if (selectedCategory.value) {
    try {
      const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
      const allAssignments = response?.assignments || response.data?.assignments || []
      allSessionAssignments.value = allAssignments

      const categoryAssignments = allAssignments.filter(a => isAssignmentForCategory(a, selectedCategory.value))

      await loadExistingAssignments(selectedCategory.value, categoryAssignments)
      await fetchTargetAssignments(selectedCategory.value, categoryAssignments)
      await fetchBoardCodes()
    } catch (error) {
      console.error("Error reloading assignments:", error)
    }
  }
}





const downloadScoresheet = async () => {
  if (!sessionData.value || isDownloadingScoresheet.value) return
  isDownloadingScoresheet.value = true
  try {
    const apiBase = apiBaseUrl
    const params = new URLSearchParams({ autoprint: '1' })
    const url = `${apiBase}/events/${eventId}/qualification/sessions/${sessionData.value.session_code}/scoresheet?${params}`

    const res = await fetch(url, { credentials: 'include' })
    if (!res.ok) {
      const errJson = await res.json().catch(() => null)
      throw new Error(errJson?.error || `HTTP error! status: ${res.status}`)
    }

    let filename = `Scoresheet-Sesi-${sessionData.value.session_code}.pdf`
    const disposition = res.headers.get('content-disposition')
    if (disposition && disposition.includes('filename=')) {
      const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '').trim()
      }
    }
    if (!filename.toLowerCase().endsWith('.pdf')) {
      filename += '.pdf'
    }

    const blob = await res.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)

    toast.addToast(t('event_qualification.toast_scoresheet_downloaded'), 'success')
  } catch (err) {
    console.error('Failed to download scoresheet PDF:', err)
    toast.addToast(err?.message || t('event_qualification.failed_open_scoresheet'), 'error')
  } finally {
    isDownloadingScoresheet.value = false
  }
}

onMounted(async () => {
  isLoading.value = true

  // 1. Load session first as it's critical for filtering
  await fetchSessionData()

  // 2. Load Categories and Targets in parallel
  // Start participants fetch in background but don't await everything yet
  const participantsPromise = fetchAllParticipants()

  await Promise.all([
    fetchCategories(),
    fetchTargets()
  ])

  if (categories.value.length > 0) {
    await selectCategory(categories.value[0].id)
  }

  isLoading.value = false

  // Ensure we finish full list fetch in background
  await participantsPromise
})

watch(activeTab, (newTab) => {
  if (newTab === 'input' && selectedCategory.value) {
    fetchTargetAssignments(selectedCategory.value)
  }
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