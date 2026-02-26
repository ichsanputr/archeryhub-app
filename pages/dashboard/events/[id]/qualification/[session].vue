<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Enhanced Header -->
    <div
      class="relative rounded-3xl border border-primary/20 text-white shadow-sm mb-2 z-20">
      
      <!-- Background and Effects Layer -->
      <div class="absolute inset-0 overflow-hidden rounded-[22px] bg-gradient-to-r from-navy via-navy to-navy/90">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-20"
          style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px), repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.15) 10px, rgba(255,255,255,0.15) 20px);">
        </div>

        <!-- Decorative Background Elements -->
        <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
        <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>
      </div>

      <!-- Header Content -->
      <div class="relative p-5 sm:p-8 z-10">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center sm:items-start gap-4 flex-1 min-w-0">
            <BaseButton variant="white" size="sm" icon="ph:arrow-left-bold"
              class="!bg-white/10 !text-white hover:!bg-primary hover:!text-btn-text backdrop-blur-sm !border-white/20"
              @click="navigateTo(`/dashboard/events/${eventId}/qualification`)" />
            <div class="min-w-0">
              <div v-if="isLoading && !sessionData"
                class="h-8 w-48 sm:h-10 sm:w-64 bg-white/10 rounded-lg animate-pulse mb-2"></div>
              <h1 v-else class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                {{ sessionData?.name || 'Sesi Kualifikasi' }}
              </h1>

              <div v-if="isLoading && !sessionData" class="flex gap-4">
                <div class="h-5 w-20 bg-white/5 rounded animate-pulse"></div>
                <div class="h-5 w-24 bg-white/5 rounded animate-pulse"></div>
              </div>
              <div v-else
                class="flex flex-wrap items-center gap-1.5 sm:gap-4 text-[10px] sm:text-xs text-slate-300 font-bold uppercase tracking-widest">
                <span class="px-2 py-0.5 rounded bg-white/10 border border-white/10 font-mono">{{
                  sessionData?.session_code
                }}</span>
                <span class="opacity-20 hidden sm:inline">•</span>
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:arrow-clockwise-bold" class="text-xs sm:text-sm text-primary" />
                  <span>{{ sessionData?.total_ends || 0 }} Ends</span>
                </div>
                <span class="opacity-20 hidden sm:inline">•</span>
                <div class="flex items-center gap-1.5">
                  <Icon icon="ph:crosshair-bold" class="text-xs sm:text-sm text-primary" />
                  <span>{{ sessionData?.arrows_per_end || 0 }} Arrows/End</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Print Scoresheet Button (color / B&W split) -->
          <div v-if="sessionData" class="flex-shrink-0 relative" v-click-outside="() => showScoresheetMenu = false">
            <div class="flex items-stretch rounded-lg overflow-hidden border border-white/20 backdrop-blur-sm">
              <!-- Main button: color version -->
              <button
                type="button"
                :disabled="isDownloadingScoresheet"
                class="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white hover:bg-primary hover:text-btn-text transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                @click="downloadScoresheet('color')">
                <Icon :icon="isDownloadingScoresheet ? 'ph:spinner' : 'ph:printer-bold'" class="text-base" />
                {{ isDownloadingScoresheet ? 'Membuka...' : 'Scoresheet' }}
              </button>
              <!-- Chevron to toggle dropdown -->
              <button
                type="button"
                :disabled="isDownloadingScoresheet"
                class="flex items-center px-2 bg-white/10 text-white hover:bg-primary hover:text-btn-text transition-colors border-l border-white/20 disabled:opacity-50"
                @click="showScoresheetMenu = !showScoresheetMenu">
                <Icon icon="ph:caret-down-bold" class="text-sm" />
              </button>
            </div>
            <!-- Dropdown menu -->
            <div
              v-if="showScoresheetMenu"
              class="absolute right-0 top-full mt-1 w-52 z-[9999] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors"
                @click="downloadScoresheet('color'); showScoresheetMenu = false">
                <Icon icon="ph:paint-bucket-bold" class="text-base text-primary" />
                <div class="text-left">
                  <div class="font-semibold">Berwarna</div>
                  <div class="text-xs text-gray-400">Navy & kuning (layar/preview)</div>
                </div>
              </button>
              <button
                type="button"
                class="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
                @click="downloadScoresheet('bw'); showScoresheetMenu = false">
                <Icon icon="ph:circles-three-bold" class="text-base text-gray-500" />
                <div class="text-left">
                  <div class="font-semibold">Hitam Putih</div>
                  <div class="text-xs text-gray-400">Hemat tinta, untuk cetak fisik</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white rounded-t-2xl px-2">
      <button v-for="t in tabs" :key="t.id" type="button" @click="activeTab = t.id"
        class="px-6 py-4 border-b-2 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors outline-none"
        :class="activeTab === t.id
          ? 'border-primary text-navy bg-primary/5'
          : 'border-transparent text-gray-500 hover:text-navy hover:bg-gray-50'">
        <Icon :icon="t.icon" class="text-xl" />
        {{ t.label }}
      </button>
    </div>

    <!-- Category Selection (Shared for both tabs) -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 class="text-base font-bold text-navy mb-4">Pilih Kategori Lomba</h2>

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
        <p>Kategori tidak ditemukan</p>
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
              class="size-12 bg-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden p-2 group-hover:bg-primary transition-colors">
              <img
                :src="'/' + getCategoryIcon(`${category.division_name} ${category.event_type_name} ${category.gender_division_name}`)"
                :alt="category.division_name"
                class="w-full h-full object-contain invert group-hover:invert-0 transition-all" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="font-extrabold text-navy group-hover:text-primary transition-colors leading-tight mb-1.5 line-clamp-2 uppercase">
                {{ getCategoryName(category) }} ({{ category.participant_count || 0 }})</p>
              <div class="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                <Icon icon="ph:users-three-bold" class="text-sm text-primary" />
                <span>Total Participant</span>
              </div>
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
          <p class="text-xs font-bold text-navy animate-pulse uppercase tracking-widest">Memuat Data...</p>
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
          :targetAssignments="targetAssignments" @updated="fetchTargetAssignments(selectedCategory)" />
      </div>

      <!-- Empty State -->
      <div v-else-if="!selectedCategory"
        class="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
        <div class="size-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="ph:cursor-click-bold" class="text-4xl text-gray-300" />
        </div>
        <h3 class="text-xl font-bold text-navy mb-2">Kategori Belum Dipilih</h3>
        <p class="text-gray-500 max-w-xs mx-auto">Silakan pilih salah satu kategori di atas untuk mulai mengelola sesi.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { getCategoryIcon } from '~/utils/logoArcheryCategory'
import { ref, computed, onMounted } from 'vue'
import QualificationTargetMode from '~/components/qualification/QualificationTargetMode.vue'
import QualificationScoringMode from '~/components/qualification/QualificationScoringMode.vue'

const route = useRoute()
const { get } = useApi()
const config = useRuntimeConfig()
const toast = useToast()
const eventId = route.params.id
const sessionCode = route.params.session

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Manajemen Sesi Kualifikasi - ArcheryHub.id'
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

const tabs = [
  { id: 'target', label: 'Target', icon: 'ph:target' },
  { id: 'input', label: 'Input Nilai', icon: 'ph:pencil-simple' }
]

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
    const response = await get(`/events/${eventId}/qualification/sessions`)
    const sessions = response?.sessions || []
    sessionData.value = sessions.find(s => s.session_code === sessionCode)
  } catch (error) {
    console.error('Failed to fetch session:', error)
  }
}

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await get(`/events/${eventId}/categories`, { params: { limit: 1000 } })
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
    const response = await get(`/events/${eventId}/participants`, { params: { limit: 1000, offset: 0 } })
    allParticipants.value = response?.participants || response.data?.participants || []
  } catch (error) {
    console.error('Failed to fetch participants:', error)
  }
}

const fetchArchersForCategory = async (categoryId) => {
  // Check if we have participants for this category in cache
  const existing = allParticipants.value.filter(p => p.category_id === categoryId)

  if (existing.length === 0) {
    // Fetch specifically for this category to speed up initial load
    try {
      const response = await get(`/events/${eventId}/participants`, {
        params: { category_id: categoryId, limit: 1000 }
      })
      const newParticipants = response?.participants || []
      // Merge into cache
      const otherParticipants = allParticipants.value.filter(p => p.category_id !== categoryId)
      allParticipants.value = [...otherParticipants, ...newParticipants]
    } catch (error) {
      console.error('Failed to fetch category participants:', error)
    }
  }

  const participants = allParticipants.value.filter(p => p.category_id === categoryId)
  archersByCategory.value[categoryId] = participants.map(p => ({
    uuid: p.id, // Use registration ID as uuid
    archerId: p.archer_id,
    name: p.full_name || p.archer_name || p.name,
    club: p.club_name || p.club,
    avatar_url: p.avatar_url || p.photo_url,
    assignedTarget: '',
    assignmentId: null
  }))
}

const fetchTargets = async () => {
  try {
    const response = await get(`/events/${eventId}/targets/options`)
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

const loadExistingAssignments = async (categoryId, preLoadedAssignments = null) => {
  if (!sessionData.value) return
  try {
    let assignments = preLoadedAssignments
    if (!assignments) {
      const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
      assignments = response?.assignments || response.data?.assignments || []
      // Store all session assignments for the target mode
      allSessionAssignments.value = assignments
      // Filter for the current category to use for the archer list mapping
      assignments = assignments.filter(a =>
        allParticipants.value.find(p => p.id === a.participant_id)?.category_id === categoryId
      )
    }

    // Replace the array reference to trigger reactivity
    if (archersByCategory.value[categoryId]) {
      const updatedArchers = archersByCategory.value[categoryId].map(archer => {
        const existing = assignments.find(a => a.participant_id === archer.uuid)
        return {
          ...archer,
          assignedTarget: existing ? existing.target_id : '',
          assignmentId: existing ? (existing.uuid || existing.id) : null
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
    // 1. Fetch assignments (if not provided)
    let assignments = preLoadedAssignments
    if (!assignments) {
      const assignmentsRes = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`, {
        params: { category_id: categoryId }
      })
      assignments = assignmentsRes?.assignments || assignmentsRes.data?.assignments || []
    }

    // Filter by participationIds to be safe (though backend now filters)
    const participationIds = new Set((archersByCategory.value[categoryId] || []).map(a => a.uuid))
    assignments = assignments.filter(a => participationIds.has(a.participant_id))

    // 2. Fetch all scores for this session & category
    const scoresRes = await get(`/qualification/sessions/${sessionData.value.uuid}/scores`, {
      params: { category_id: categoryId }
    })
    const allScores = scoresRes?.scores || []

    targetAssignments.value = assignments.map(a => {
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

        // Determine next end to input
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
        currentEnd,
        currentEndScores: allEndScores[currentEnd] ? [...allEndScores[currentEnd]] : [],
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

    // Fetch assignments once for both uses
    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`, {
      params: { category_id: categoryId }
    })
    const assignments = response?.assignments || []

    await loadExistingAssignments(categoryId, assignments)
    await fetchTargetAssignments(categoryId, assignments)
    await fetchBoardCodes()
  } catch (error) {
    console.error("Error selecting category:", error)
  } finally {
    isLoadingAssignments.value = false
  }
}

const handleAssignmentsSaved = async () => {
  if (selectedCategory.value) {
    // Fetch assignments once and update both views
    try {
      const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`, {
        params: { category_id: selectedCategory.value }
      })
      const assignments = response?.assignments || []

      await loadExistingAssignments(selectedCategory.value, assignments)
      await fetchTargetAssignments(selectedCategory.value, assignments)
      await fetchBoardCodes()
    } catch (error) {
      console.error("Error reloading assignments:", error)
    }
  }
}

const showScoresheetMenu = ref(false)

// Local click-outside directive for the scoresheet dropdown
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('mousedown', el._clickOutside)
  },
  unmounted(el) {
    if (el._clickOutside) document.removeEventListener('mousedown', el._clickOutside)
  }
}

const downloadScoresheet = async (theme, color) => {
  if (!sessionData.value || isDownloadingScoresheet.value) return
  isDownloadingScoresheet.value = true
  try {
    const apiBase = config.public.apiBaseUrl
    const params = new URLSearchParams({ autoprint: '1' })
    if (theme === 'bw') params.set('theme', 'bw')
    const url = `${apiBase}/events/${eventId}/qualification/sessions/${sessionData.value.session_code}/scoresheet?${params}`
    const win = window.open(url, '_blank')
    if (!win) {
      toast.addToast('Popup diblokir. Izinkan popup untuk halaman ini.', 'warning')
    }
  } catch {
    toast.addToast('Gagal membuka scoresheet', 'error')
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

  // 3. Immediately select first category if categories exist
  // selectCategory will handle fetching specific participants if the full list is still loading
  if (categories.value.length > 0) {
    await selectCategory(categories.value[0].id)
  }

  isLoading.value = false

  // Ensure we finish full list fetch in background
  await participantsPromise
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