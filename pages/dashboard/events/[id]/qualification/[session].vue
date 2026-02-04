<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div class="space-y-2">
          <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">{{ sessionData?.name || 'Loading...' }}
          </h1>
          <div class="flex items-center gap-4 text-sm text-gray-600">
            <span class="font-mono font-semibold">{{ sessionData?.session_code }}</span>
            <span class="text-gray-300">•</span>
            <div class="flex items-center gap-1.5">
              <Icon icon="ph:arrow-clockwise" class="text-base" />
              <span><strong>{{ sessionData?.total_ends || 0 }}</strong> Ends</span>
            </div>
            <span class="text-gray-300">•</span>
            <div class="flex items-center gap-1.5">
              <Icon icon="ph:crosshair" class="text-base" />
              <span><strong>{{ sessionData?.arrows_per_end || 0 }}</strong> Arrows/End</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Tabs for Session Management -->
    <div
      class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar bg-white rounded-t-2xl px-2">
      <button v-for="t in tabs" :key="t.id" @click="activeTab = t.id"
        class="px-6 py-4 text-sm font-bold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap"
        :class="activeTab === t.id ? 'text-navy border-navy bg-gray-50' : 'text-gray-500 border-transparent hover:text-navy hover:bg-gray-50'">
        <Icon :icon="t.icon" class="text-xl" />
        {{ t.label }}
      </button>
    </div>

    <!-- Category Selection (Shared for both tabs) -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <h2 class="text-base font-bold text-navy mb-4">Pilih Kategori Lomba</h2>

      <div v-if="loadingCategories" class="flex gap-4 overflow-x-auto pb-2">
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
        <button v-for="category in categories" :key="category.id" @click="selectCategory(category.id)" :class="[
          'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
          selectedCategory === category.id
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300'
        ]">
          <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors"
            :class="selectedCategory === category.id ? 'bg-primary' : 'bg-transparent'"></div>
          <div class="flex items-start gap-3 pl-2">
            <div
              class="size-12 bg-gradient-to-br from-navy/90 to-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Icon icon="ph:target" class="text-xl text-primary" />
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="font-bold text-navy group-hover:text-primary transition-colors leading-tight mb-1.5 line-clamp-2">
                {{ getCategoryName(category) }}</p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <Icon icon="ph:users-three" class="text-base" />
                <span class="font-semibold">{{ category.participant_count || 0 }} pemanah</span>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>

    <!-- TARGET MODE -->
    <div v-if="activeTab === 'target'" class="space-y-6">
      <!-- Archer Assignment -->
      <div v-if="selectedCategory" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
          <div>
            <h2 class="text-lg font-bold text-navy">Tempatkan Pemanah ke Target</h2>
            <p class="text-sm text-gray-500 mt-1">Alokasikan pemanah ke target penilaian mereka</p>
          </div>

        </div>

        <!-- Assignment Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100">
                <th
                  class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest min-w-[350px]">
                  Pemanah
                </th>
                <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest w-64">
                  Pilih
                  Target</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="archer in filteredArchersInput" :key="archer.uuid"
                class="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <img :src="useImageOrDefault(archer.avatar_url, archer.name)"
                      class="size-9 rounded-lg object-cover border border-gray-100" />
                    <p class="font-bold text-navy">{{ archer.name }}</p>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <select v-model="archer.assignedTarget"
                    class="px-4 py-2 rounded-lg border border-gray-200 text-navy font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                    <option value="">-- Pilih Target --</option>
                    <option v-for="target in getAvailableTargetsForArcher(archer)" :key="target.id" :value="target.id">
                      {{ target.name }}
                    </option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button @click="submitAssignments" :disabled="!allAssigned || submittingAssignments"
          class="mt-6 px-6 py-3 rounded-xl bg-primary text-navy font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full md:w-auto">
          <Icon icon="ph:check-circle" class="text-xl" />
          {{ submittingAssignments ? 'Menyimpan...' : 'Simpan Penempatan' }}
        </button>
      </div>

      <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <Icon icon="ph:selection" class="text-5xl text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">Pilih kategori untuk penempatan target</p>
      </div>
    </div>

    <!-- INPUT SCORING MODE -->
    <div v-if="activeTab === 'input'" class="space-y-6">
      <!-- Scoring Interface -->
      <div v-if="selectedCategory && targetAssignments.length > 0" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Archers List -->
        <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          <div v-for="(assignment, index) in targetAssignments" :key="assignment.uuid"
            @click="selectArcherForScoring(assignment)" :class="[
              'bg-white rounded-xl shadow-sm border-2 overflow-hidden transition-all cursor-pointer',
              currentScoringAssignment?.uuid === assignment.uuid
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-gray-100 hover:border-gray-200'
            ]">
            <div
              :class="['absolute top-0 left-0 w-2 h-full', currentScoringAssignment?.uuid === assignment.uuid ? 'bg-primary' : 'bg-gray-200']">
            </div>
            <div class="p-5 pl-7 relative">
              <div class="flex justify-between items-center mb-4">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    :src="useImageOrDefault(assignment.archer_avatar_url || assignment.avatar_url, assignment.archer_name)"
                    :alt="assignment.archer_name"
                    class="size-9 sm:size-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                  <div class="min-w-0">
                    <h3 class="text-base sm:text-lg font-bold text-navy leading-tight">{{ assignment.archer_name }}</h3>
                    <div class="text-xs text-gray-500 font-medium truncate">
                      Target {{ assignment.target_number }} - {{ assignment.target_name }}
                    </div>
                  </div>
                </div>
                <div v-if="currentScoringAssignment?.uuid === assignment.uuid"
                  class="flex items-center gap-2 ml-3 flex-shrink-0">
                  <button @click.stop="selectArcherForScoring(assignment); goPrevEnd()"
                    :disabled="(assignment.currentEnd || 1) <= 1"
                    :title="(assignment.currentEnd || 1) <= 1 ? 'Sudah di end pertama' : 'End sebelumnya'"
                    class="size-8 sm:size-9 rounded-lg border border-gray-300 bg-white text-navy flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <Icon icon="ph:arrow-left" class="text-base sm:text-lg" />
                  </button>
                  <button v-if="(assignment.currentEnd || 1) < (sessionData?.total_ends || 0)"
                    @click.stop="selectArcherForScoring(assignment); goNextEnd()" :title="'End berikutnya'"
                    class="size-8 sm:size-9 rounded-lg bg-primary text-navy flex items-center justify-center hover:bg-primary/90 transition-colors">
                    <Icon icon="ph:arrow-right" class="text-base sm:text-lg" />
                  </button>
                </div>
              </div>

              <!-- Current End Display -->
              <div class="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div class="flex justify-between items-center mb-3">
                  <div class="flex items-center gap-2">
                    <span class="text-sm sm:text-base font-black text-navy">
                      End {{ assignment.currentEnd || 1 }}
                    </span>
                    <span class="text-xs font-semibold text-gray-500">/ {{ sessionData?.total_ends || 0 }}</span>
                  </div>
                  <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {{ sessionData?.arrows_per_end || 0 }} Arrows
                  </span>
                </div>
                <div class="flex gap-2 sm:gap-3">
                  <div v-for="(score, i) in sessionData.arrows_per_end" :key="i" :class="[
                    'flex-1 aspect-square rounded-lg shadow-sm flex items-center justify-center text-lg sm:text-xl font-bold',
                    assignment.currentEndScores[i] !== undefined
                      ? 'bg-white border-2 border-gray-200 text-navy'
                      : 'bg-gray-100 border-dashed border-2 border-gray-300 text-gray-400'
                  ]">
                    {{ assignment.currentEndScores[i] !== undefined ? assignment.currentEndScores[i] : '' }}
                  </div>
                  <div class="w-px bg-gray-300 mx-1"></div>
                  <div
                    class="flex-1 aspect-square bg-navy text-primary rounded-lg flex flex-col items-center justify-center shadow-sm">
                    <span class="text-lg sm:text-xl font-bold">{{ calculateEndSum(assignment.currentEndScores) }}</span>
                  </div>
                </div>


              </div>
            </div>
          </div>

          <div v-if="!targetAssignments || targetAssignments.length === 0"
            class="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Icon icon="ph:users" class="text-5xl text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">No archers assigned to targets yet</p>
          </div>
        </div>

        <!-- Scoring Keypad -->
        <div class="lg:col-span-5 xl:col-span-4">
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-6">
            <div class="flex justify-between items-center mb-5">
              <h3 class="font-bold text-navy flex items-center gap-2">
                <Icon icon="ph:keyboard" class="text-xl" />
                Input Cepat
              </h3>
            </div>

            <!-- Score Buttons -->
            <div class="grid grid-cols-3 gap-3 mb-4">
              <button @click="addScore('X')" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#FFE500] border-b-4 border-[#e6ce00] text-navy text-xl sm:text-2xl font-black hover:brightness-105 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                X
              </button>
              <button @click="addScore(10)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#FFE500] border-b-4 border-[#e6ce00] text-navy text-xl sm:text-2xl font-black hover:brightness-105 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                10
              </button>
              <button @click="addScore(9)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#FFE500] border-b-4 border-[#e6ce00] text-navy text-xl sm:text-2xl font-black hover:brightness-105 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                9
              </button>
              <button @click="addScore(8)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#EF4444] border-b-4 border-red-700 text-white text-xl sm:text-2xl font-black hover:brightness-110 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                8
              </button>
              <button @click="addScore(7)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#EF4444] border-b-4 border-red-700 text-white text-xl sm:text-2xl font-black hover:brightness-110 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                7
              </button>
              <button @click="addScore(6)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#3B82F6] border-b-4 border-blue-700 text-white text-xl sm:text-2xl font-black hover:brightness-110 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                6
              </button>
              <button @click="addScore(5)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#3B82F6] border-b-4 border-blue-700 text-white text-xl sm:text-2xl font-black hover:brightness-110 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                5
              </button>
              <button @click="addScore(4)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#111827] border-b-4 border-gray-900 text-white text-xl sm:text-2xl font-black hover:bg-gray-800 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                4
              </button>
              <button @click="addScore(3)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-[#111827] border-b-4 border-gray-900 text-white text-xl sm:text-2xl font-black hover:bg-gray-800 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                3
              </button>
              <button @click="addScore(2)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-white border border-gray-200 border-b-4 border-b-gray-300 text-navy text-xl sm:text-2xl font-black hover:bg-gray-50 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                2
              </button>
              <button @click="addScore(1)" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-white border border-gray-200 border-b-4 border-b-gray-300 text-navy text-xl sm:text-2xl font-black hover:bg-gray-50 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                1
              </button>
              <button @click="addScore('M')" :disabled="!currentScoringAssignment"
                class="key-btn h-12 sm:h-16 rounded-lg bg-gray-100 border border-gray-200 border-b-4 border-b-gray-300 text-gray-500 text-xl sm:text-2xl font-black hover:bg-gray-200 transition-all active:border-b-0 active:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed">
                M
              </button>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-gray-100">
              <button @click="deleteLastScore"
                :disabled="!currentScoringAssignment || !currentScoringAssignment.currentEndScores?.length"
                class="flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 bg-white text-navy font-bold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <Icon icon="ph:backspace" class="text-lg" />
                Hapus
              </button>
              <button @click="saveEndAndNext"
                :disabled="!currentScoringAssignment || !currentScoringAssignment.currentEndScores?.length || savingScore"
                class="flex items-center justify-center gap-2 h-12 rounded-lg bg-navy text-white font-bold hover:bg-navy/90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="savingScore" class="inline-flex items-center gap-2">
                  <span class="size-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                  Menyimpan...
                </span>
                <span v-else class="inline-flex items-center gap-2">
                  Simpan
                  <Icon icon="ph:check" class="text-lg" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <Icon icon="ph:users" class="text-5xl text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500" v-if="!selectedCategory">Pilih kategori untuk input nilai</p>
        <p class="text-gray-500" v-else>Belum ada pemanah yang ditugaskan ke target</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { get, post } = useApi()
const toast = useToast()
const eventId = route.params.id
const sessionCode = route.params.session

definePageMeta({
  layout: 'dashboard'
})

// State Management
const sessionData = ref(null)
const loading = ref(false)
const activeTab = ref('target')
const selectedCategory = ref(null)
const categories = ref([])
const reportEntries = ref([])
const allParticipants = ref([])
const archersByCategory = ref({})
const availableTargets = ref([])
const targetAssignments = ref([])
const currentScoringAssignment = ref(null)
const checkingAssignments = ref(false)
const assignmentsComplete = ref(false)
const savingScore = ref(false)

// Loading States
const loadingCategories = ref(false)
const loadingReport = ref(false)
const submittingAssignments = ref(false)

// Tabs
const tabs = [
  { id: 'target', label: 'Target', icon: 'ph:target' },
  { id: 'input', label: 'Input Nilai', icon: 'ph:pencil-simple' }
]

// Computed Properties
const breadcrumbItems = computed(() => [
  { label: 'Events', to: '/dashboard/events' },
  { label: 'Event', to: `/dashboard/events/${eventId}` },
  { label: 'Qualification', to: `/dashboard/events/${eventId}/qualification` }
])

useHead({
  title: `${sessionData.value?.name || 'Session'} - Qualification`
})

const filteredArchersReport = computed(() => {
  if (!selectedCategory.value) return []
  return reportEntries.value || []
})

const filteredArchersInput = computed(() => {
  if (!selectedCategory.value) return []
  return archersByCategory.value[selectedCategory.value] || []
})

const filteredArchersScoring = computed(() => {
  if (!selectedCategory.value) return []
  return archersByCategory.value[selectedCategory.value] || []
})

const allAssigned = computed(() => {
  return filteredArchersInput.value.length > 0 && filteredArchersInput.value.every(a => a.assignedTarget)
})

const isEndComplete = computed(() => {
  if (!currentScoringAssignment.value) return false
  const scores = currentScoringAssignment.value.currentEndScores || []
  const arrowsPerEnd = sessionData.value?.arrows_per_end || 6
  if (scores.length < arrowsPerEnd) return false
  return scores.slice(0, arrowsPerEnd).every((v) => v !== undefined && v !== null)
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

// No local getAvatarUrl helper needed as we use useImageOrDefault from composables

const fetchSessionData = async () => {
  loading.value = true
  try {
    const response = await get(`/events/${eventId}/qualification/sessions`)
    const sessions = response?.sessions || []
    sessionData.value = sessions.find(s => s.session_code === sessionCode)
  } catch (error) {
    console.error('Failed to fetch session:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    const response = await get(`/events/${eventId}/categories`)
    categories.value = response?.events || response.data?.events || []

    for (const category of categories.value) {
      await fetchArchersForCategory(category.id)
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    showToast('Failed to load categories', 'error')
  } finally {
    loadingCategories.value = false
  }
}

const fetchAllParticipants = async () => {
  try {
    const response = await get(`/events/${eventId}/participants`, {
      params: { limit: 1000, offset: 0 }
    })
    allParticipants.value = response?.participants || response.data?.participants || []
  } catch (error) {
    console.error('Failed to fetch participants:', error)
    allParticipants.value = []
  }
}

const fetchArchersForCategory = async (categoryId) => {
  const participants = allParticipants.value.filter(p => p.category_id === categoryId)
  const archers = participants.map(p => ({
    uuid: p.archer_id || p.id,
    name: p.full_name || p.archer_name || p.name,
    club: p.club_name || p.club,
    avatar_url: p.avatar_url || p.photo_url,
    assignedTarget: '',
    score: 0,
    isScored: false
  }))
  archersByCategory.value[categoryId] = archers
}

const fetchQualificationReport = async (categoryId) => {
  if (!categoryId) return

  loadingReport.value = true
  try {
    const response = await get(`/events/${eventId}/qualification/leaderboard`, {
      params: { category_id: categoryId }
    })
    const leaderboard = response?.leaderboard || response?.data?.leaderboard || []
    reportEntries.value = leaderboard.map((item, index) => ({
      id: `${categoryId}-${index}`,
      archer_name: item.archer_name,
      club_name: item.club_name,
      total_score: item.total_score || 0,
      ends_completed: item.ends_completed || 0
    }))
  } catch (error) {
    console.error('Failed to fetch report:', error)
    reportEntries.value = []
    showToast('Gagal memuat laporan', 'error')
  } finally {
    loadingReport.value = false
  }
}

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId

  // Reset scoring state before loading new category
  targetAssignments.value = []
  currentScoringAssignment.value = null

  // Load existing assignments for this category
  await loadExistingAssignments(categoryId)

  // Check assignments for scoring tab
  await checkTargetAssignments(categoryId)
  if (assignmentsComplete.value) {
    await fetchTargetAssignments(categoryId)
  } else {
    targetAssignments.value = []
    currentScoringAssignment.value = null
  }
}

const loadExistingAssignments = async (categoryId) => {
  if (!sessionData.value) return

  try {
    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
    const assignments = response?.assignments || response.data?.assignments || []

    // Get archers for this category
    const categoryArchers = archersByCategory.value[categoryId] || []

    // Map existing assignments to archers
    categoryArchers.forEach(archer => {
      const existingAssignment = assignments.find(a => a.archer_uuid === archer.uuid)
      if (existingAssignment) {
        archer.assignedTarget = existingAssignment.target_uuid
      } else {
        archer.assignedTarget = ''
      }
    })
  } catch (error) {
    console.error('Failed to load existing assignments:', error)
  }
}

const checkTargetAssignments = async (categoryId) => {
  if (!sessionData.value) return

  checkingAssignments.value = true
  try {
    const archers = archersByCategory.value[categoryId] || []
    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
    const assignments = response?.assignments || response.data?.assignments || []

    // Check if all archers in category have assignments
    const assignedArcherIds = new Set(assignments.map(a => a.archer_uuid))
    const allAssigned = archers.every(archer => assignedArcherIds.has(archer.uuid))

    assignmentsComplete.value = allAssigned && archers.length > 0
    if (!assignmentsComplete.value) {
      targetAssignments.value = []
      currentScoringAssignment.value = null
    }
  } catch (error) {
    console.error('Failed to check assignments:', error)
    assignmentsComplete.value = false
    targetAssignments.value = []
    currentScoringAssignment.value = null
  } finally {
    checkingAssignments.value = false
  }
}

const fetchTargetAssignments = async (categoryId) => {
  if (!sessionData.value) return

  try {
    const response = await get(`/qualification/sessions/${sessionData.value.uuid}/assignments`)
    let assignments = response?.assignments || response.data?.assignments || []

    // Filter by category
    const archerIds = new Set((archersByCategory.value[categoryId] || []).map(a => a.uuid))
    assignments = assignments.filter(a => archerIds.has(a.archer_uuid))

    // Initialize scoring state for each assignment
    targetAssignments.value = assignments.map(a => ({
      ...a,
      currentEnd: 1,
      currentEndScores: [],
      allEndScores: {} // { endNumber: [scores] }
    }))

    await Promise.all(targetAssignments.value.map((assignment) => loadAssignmentScores(assignment)))

    // Auto-select first archer
    if (targetAssignments.value.length > 0) {
      currentScoringAssignment.value = targetAssignments.value[0]
    }
  } catch (error) {
    console.error('Failed to fetch assignments:', error)
    targetAssignments.value = []
  }
}

const loadAssignmentScores = async (assignment) => {
  try {
    const response = await get(`/qualification/assignments/${assignment.uuid}/scores`)
    const scores = response?.scores || response.data?.scores || []

    const allEndScores = {}
    scores.forEach((endScore) => {
      const arrows = Array.from({ length: sessionData.value?.arrows_per_end || 0 }, () => undefined)
        ; (endScore.arrows || []).forEach((arrow) => {
          const value = arrow.is_x ? 10 : arrow.score
          arrows[arrow.arrow_number - 1] = value
        })
      allEndScores[endScore.end_number] = arrows
    })

    assignment.allEndScores = allEndScores

    // Determine current end: first missing end, or last end
    const totalEnds = sessionData.value?.total_ends || 0
    let nextEnd = 1
    for (let i = 1; i <= totalEnds; i += 1) {
      if (!allEndScores[i] || allEndScores[i].every((v) => v === undefined)) {
        nextEnd = i
        break
      }
      if (i === totalEnds) {
        nextEnd = totalEnds
      }
    }

    assignment.currentEnd = nextEnd
    assignment.currentEndScores = allEndScores[nextEnd] ? [...allEndScores[nextEnd]] : []
  } catch (error) {
    console.error('Failed to load assignment scores:', error)
  }
}

const selectArcherForScoring = (assignment) => {
  currentScoringAssignment.value = assignment
}

const addScore = (score) => {
  if (!currentScoringAssignment.value) return

  // Convert X to 10 for storage
  const numericScore = score === 'X' ? 10 : (score === 'M' ? 0 : score)
  const arrowsPerEnd = sessionData.value?.arrows_per_end || 6

  if (!currentScoringAssignment.value.currentEndScores) {
    currentScoringAssignment.value.currentEndScores = []
  }

  const scores = currentScoringAssignment.value.currentEndScores
  const emptyIndex = scores.findIndex((v) => v === undefined)

  if (emptyIndex !== -1) {
    scores[emptyIndex] = numericScore
    return
  }

  if (scores.length < arrowsPerEnd) {
    scores.push(numericScore)
  }
}

const deleteLastScore = () => {
  if (!currentScoringAssignment.value?.currentEndScores?.length) return
  const scores = currentScoringAssignment.value.currentEndScores
  for (let i = scores.length - 1; i >= 0; i -= 1) {
    if (scores[i] !== undefined) {
      scores[i] = undefined
      break
    }
  }
}

const clearCurrentEnd = () => {
  if (!currentScoringAssignment.value) return
  currentScoringAssignment.value.currentEndScores = []
}

const calculateEndSum = (scores) => {
  if (!scores || !scores.length) return 0
  return scores.reduce((sum, score) => sum + (score || 0), 0)
}

const isAssignmentEndComplete = (assignment) => {
  if (!assignment) return false
  const scores = assignment.currentEndScores || []
  const arrowsPerEnd = sessionData.value?.arrows_per_end || 6
  if (scores.length < arrowsPerEnd) return false
  return scores.slice(0, arrowsPerEnd).every((v) => v !== undefined && v !== null)
}

const goToEnd = (endNumber) => {
  if (!currentScoringAssignment.value) return
  currentScoringAssignment.value.currentEnd = endNumber
  const saved = currentScoringAssignment.value.allEndScores?.[endNumber]
  currentScoringAssignment.value.currentEndScores = saved ? [...saved] : []
}

const goPrevEnd = () => {
  if (!currentScoringAssignment.value) return
  const currentEnd = currentScoringAssignment.value.currentEnd || 1
  if (currentEnd <= 1) return
  goToEnd(currentEnd - 1)
}

const goNextEnd = () => {
  if (!currentScoringAssignment.value) return
  const totalEnds = sessionData.value?.total_ends || 0
  const currentEnd = currentScoringAssignment.value.currentEnd || 1
  if (currentEnd >= totalEnds) return
  goToEnd(currentEnd + 1)
}

const calculateTotalScore = (assignment) => {
  let total = 0

  // Add all saved end scores
  if (assignment.allEndScores) {
    Object.values(assignment.allEndScores).forEach(endScores => {
      total += calculateEndSum(endScores)
    })
  }

  // Add current end scores if not saved yet
  if (assignment.currentEndScores?.length) {
    total += calculateEndSum(assignment.currentEndScores)
  }

  return total
}

const saveEndAndNext = async () => {
  if (!currentScoringAssignment.value || !currentScoringAssignment.value.currentEndScores?.length) return

  savingScore.value = true
  try {
    const endNumber = currentScoringAssignment.value.currentEnd
    const scores = currentScoringAssignment.value.currentEndScores
    const filledScores = (scores || []).filter((score) => score !== undefined && score !== null)

    // Convert scores to arrow format (X=10, M=0, others as string)
    const arrows = filledScores.map(score => {
      if (score === 10) return 'X'
      if (score === 0) return 'M'
      return String(score)
    })

    // Save scores to backend
    await post(`/qualification/assignments/${currentScoringAssignment.value.uuid}/scores`, {
      end_number: endNumber,
      arrows: arrows
    })

    // Store in local state
    if (!currentScoringAssignment.value.allEndScores) {
      currentScoringAssignment.value.allEndScores = {}
    }
    currentScoringAssignment.value.allEndScores[endNumber] = [...scores]

    // Move to next end or next archer
    if (endNumber < sessionData.value.total_ends) {
      currentScoringAssignment.value.currentEnd = endNumber + 1
      currentScoringAssignment.value.currentEndScores = []
    } else {
      // Move to next archer
      const currentIndex = targetAssignments.value.findIndex(a => a.uuid === currentScoringAssignment.value.uuid)
      if (currentIndex < targetAssignments.value.length - 1) {
        currentScoringAssignment.value = targetAssignments.value[currentIndex + 1]
      } else {
        // All done
        toast.success('Semua pemanah selesai!')
        currentScoringAssignment.value.currentEndScores = []
      }
    }

    toast.success('Nilai berhasil disimpan')
  } catch (error) {
    console.error('Failed to save score:', error)
    toast.error('Gagal menyimpan nilai')
  } finally {
    savingScore.value = false
  }
}

const fetchTargets = async () => {
  try {
    const response = await get(`/events/${eventId}/targets/options`)
    const options = response?.options || response.data?.options || []
    availableTargets.value = options.map((opt) => ({
      id: opt.id || opt.uuid,
      name: opt.value || `${opt.name} - ${opt.number}`
    }))
  } catch (error) {
    console.error('Failed to fetch targets:', error)
    availableTargets.value = []
  }
}

const submitAssignments = async () => {
  try {
    submittingAssignments.value = true

    if (!sessionData.value) {
      toast.warning('Pilih sesi terlebih dahulu')
      return
    }

    if (!allAssigned.value) {
      toast.error('Harap tetapkan semua pemanah ke target')
      return
    }

    const payload = filteredArchersInput.value.map(a => ({
      archer_uuid: a.uuid,
      target_id: a.assignedTarget
    }))

    await post(`/events/${eventId}/qualification/sessions/${sessionData.value.uuid}/assignments`, {
      category_id: selectedCategory.value,
      assignments: payload
    })

    toast.success('Penempatan target berhasil disimpan')
  } catch (error) {
    console.error('Failed to save assignments:', error)
    toast.error('Gagal menyimpan penempatan')
  } finally {
    submittingAssignments.value = false
  }
}

const getAvailableTargetsForArcher = (archer) => {
  // Get all assigned targets except the current archer's assigned target
  const assignedTargetIds = filteredArchersInput.value
    .filter(a => a.uuid !== archer.uuid && a.assignedTarget)
    .map(a => a.assignedTarget)

  // Return targets that are not assigned or is the current archer's target
  return availableTargets.value.filter(target =>
    !assignedTargetIds.includes(target.id) || target.id === archer.assignedTarget
  )
}

// Lifecycle
onMounted(async () => {
  await fetchSessionData()
  await fetchAllParticipants()
  await fetchCategories()
  await fetchTargets()

  // Auto-select first category and load existing assignments
  if (categories.value.length > 0) {
    const firstCategoryId = categories.value[0].id
    await selectCategory(firstCategoryId)
  }
})
</script>
<style scoped>
.key-btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
}
</style>