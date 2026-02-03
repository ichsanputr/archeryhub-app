<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <div class="flex flex-col gap-4">
      <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div class="space-y-1">
          <h1 class="text-2xl md:text-3xl font-black text-navy tracking-tight">Manajemen Kualifikasi</h1>
          <p class="text-gray-500 text-sm">Kelola penempatan pemanah dan penilaian untuk {{ eventName }}</p>
        </div>
      </div>
    </div>

    <!-- Sessions List View -->
    <div class="space-y-6">
      <!-- Sessions List (event-level) -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-bold text-navy">Daftar Sesi Kualifikasi</h2>
        </div>

        <div v-if="loadingSessions" class="flex gap-4 overflow-x-auto pb-2">
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

        <div v-else-if="qualificationSessions.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Icon icon="ph:calendar-blank" class="text-4xl text-gray-300 mx-auto mb-3" />
          <p class="text-sm font-bold text-gray-600 mb-1">Belum Ada Sesi Kualifikasi</p>
          <p class="text-xs text-gray-400 mb-4">Buat sesi pertama untuk mulai mengelola kualifikasi</p>
          <button
            @click="showSessionDialog = true"
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary text-navy rounded-lg font-bold hover:bg-primary/90 transition-colors text-sm">
            <Icon icon="ph:plus" class="text-lg" />
            Buat Sesi Pertama
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            v-for="session in qualificationSessions"
            :key="session.uuid"
            @click="goToSession(session)"
            class="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all text-left group">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Icon icon="ph:calendar-check" class="text-lg" />
                </div>
                <div>
                  <p class="font-bold text-navy text-sm group-hover:text-primary transition-colors">{{ session.name }}</p>
                  <p class="text-xs text-gray-500 font-mono">{{ session.session_code }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-4 text-xs text-gray-600 mb-3">
              <div class="flex items-center gap-1">
                <Icon icon="ph:arrow-clockwise" class="text-sm" />
                <span>{{ session.total_ends }} end</span>
              </div>
              <div class="flex items-center gap-1">
                <Icon icon="ph:crosshair" class="text-sm" />
                <span>{{ session.arrows_per_end }} panah</span>
              </div>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-gray-200">
              <div class="flex items-center gap-1 text-xs text-gray-500">
                <Icon icon="ph:users-three" class="text-base" />
                <span class="font-semibold">{{ session.participant_count || 0 }} pemanah</span>
              </div>
              <div class="flex items-center gap-1 font-bold text-xs group-hover:gap-2 transition-all">
                <span>Buka Sesi</span>
                <Icon icon="ph:arrow-right" class="text-sm" />
              </div>
            </div>
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-base font-bold text-navy">Hasil Kualifikasi</h2>
        </div>

        <!-- Category Selection -->
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
        
        <div v-else-if="categories.length === 0" class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Icon icon="ph:folder-notch-open" class="text-4xl text-gray-300 mx-auto mb-3" />
          <p class="text-sm font-bold text-gray-600 mb-1">Belum Ada Kategori</p>
          <p class="text-xs text-gray-400">Kategori akan muncul setelah event dikonfigurasi</p>
        </div>
        
        <div v-else>
          <div class="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-6">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="selectCategory(category.id)"
              :class="[
                'flex-shrink-0 w-72 p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md relative',
                selectedCategory === category.id
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              ]">
              <div class="absolute top-0 left-0 w-1.5 h-full rounded-l-xl transition-colors" :class="selectedCategory === category.id ? 'bg-primary' : 'bg-transparent'"></div>
              <div class="flex items-start gap-3 pl-2">
                <div class="size-12 bg-gradient-to-br from-navy/90 to-navy rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon icon="ph:target" class="text-xl text-primary" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-navy group-hover:text-primary transition-colors leading-tight mb-1.5 line-clamp-2">{{ getCategoryName(category) }}</p>
                  <div class="flex items-center gap-2 text-xs text-gray-500">
                    <Icon icon="ph:users-three" class="text-base" />
                    <span class="font-semibold">{{ category.participant_count || 0 }} pemanah</span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          <!-- Results Table -->
          <div v-if="loadingReport" class="bg-gray-50 rounded-xl p-12 text-center">
            <div class="animate-spin inline-block">
              <Icon icon="ph:circle-notch" class="text-4xl text-primary" />
            </div>
            <p class="text-gray-500 mt-4">Memuat laporan...</p>
          </div>
          
          <div v-else-if="selectedCategory && reportEntries.length > 0" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="bg-gray-50/50 border-b border-gray-100">
                  <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Posisi</th>
                  <th class="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Nama Pemanah</th>
                  <th class="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Nilai</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(archer, index) in reportEntries" :key="archer.id || archer.uuid || index" class="border-b border-gray-50 hover:bg-gray-50/50 transition-all">
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center justify-center size-8 rounded-lg bg-navy text-white font-bold text-sm">{{ index + 1 }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        :src="getAvatarUrl(archer.name || archer.archer_name, archer.avatar_url || archer.photo_url)"
                        class="size-9 rounded-lg object-cover border border-gray-100" />
                      <p class="font-bold text-navy">{{ archer.name || archer.archer_name }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <p class="text-2xl font-black text-navy">{{ archer.score || archer.total_score || 0 }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-else-if="selectedCategory" class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Icon icon="ph:users-three" class="text-5xl text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">Tidak ada pemanah di kategori ini</p>
          </div>

          <div v-else class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
            <Icon icon="ph:selection" class="text-5xl text-gray-300 mx-auto mb-4" />
            <p class="text-gray-500">Pilih kategori untuk melihat hasil kualifikasi</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Session Modal Dialog -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div v-if="showSessionDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showSessionDialog = false">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-100">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon icon="ph:calendar-plus" class="text-xl text-black" />
            </div>
            <h3 class="text-lg font-bold text-navy">Buat Sesi Kualifikasi</h3>
          </div>
          <button
            @click="showSessionDialog = false"
            class="text-gray-400 hover:text-gray-600 transition-colors">
            <Icon icon="ph:x" class="text-2xl" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Nama Sesi *</label>
            <input
              v-model="newSessionName"
              type="text"
              placeholder="contoh: Sesi 1 Pagi"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Total End</label>
              <input
                v-model.number="newSessionEnds"
                type="number"
                min="1"
                max="20"
                placeholder="12"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-600 uppercase mb-2">Anak Panah per End</label>
              <input
                v-model.number="newSessionArrows"
                type="number"
                min="1"
                max="6"
                placeholder="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <div class="flex gap-2">
              <Icon icon="ph:info" class="text-blue-500 text-lg flex-shrink-0 mt-0.5" />
              <p class="text-xs text-blue-700">Sesi kualifikasi akan digunakan untuk mengelompokkan pemanah dan mencatat nilai mereka.</p>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex gap-3 p-6 border-t border-gray-100">
          <button
            @click="showSessionDialog = false"
            class="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors">
            Batal
          </button>
          <button
            @click="createNewSession"
            :disabled="creatingSession || !newSessionName"
            class="flex-1 px-4 py-3 bg-navy text-white rounded-lg font-bold hover:bg-navy/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <Icon v-if="creatingSession" icon="ph:circle-notch" class="text-lg animate-spin" />
            {{ creatingSession ? 'Membuat...' : 'Buat Sesi' }}
          </button>
        </div>
      </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const { get, post } = useApi()
const { showToast } = useToast()
const eventId = route.params.id

definePageMeta({
  layout: 'dashboard'
})

// State Management
const eventName = ref('Loading...')
const qualificationSessions = ref([])
const categories = ref([])
const selectedCategory = ref(null)
const reportEntries = ref([])

// Loading States
const loadingSessions = ref(false)
const loadingCategories = ref(false)
const loadingReport = ref(false)
const creatingSession = ref(false)
const showSessionDialog = ref(false)

// New Session Form
const newSessionName = ref('')
const newSessionEnds = ref(12)
const newSessionArrows = ref(6)

// Computed Properties
const breadcrumbItems = computed(() => [
  { label: 'Events', to: '/dashboard/events' },
  { label: eventName.value, to: `/dashboard/events/${eventId}` }
])

useHead({
  title: `Qualification Sessions - ${eventName.value}`
})

// Methods
const goToSession = (session) => {
  // Use session_code as slug directly since it's already unique
  router.push(`/dashboard/events/${eventId}/qualification/${session.session_code}`)
}

const fetchQualificationSessions = async () => {
  loadingSessions.value = true
  try {
    const response = await get(`/events/${eventId}/qualification/sessions`)
    const sessions = response?.sessions || []
    qualificationSessions.value = sessions
  } catch (error) {
    console.error('Failed to fetch qualification sessions:', error)
    qualificationSessions.value = []
  } finally {
    loadingSessions.value = false
  }
}

const createNewSession = async () => {
  if (!newSessionName.value) {
    showToast('Nama sesi harus diisi', 'warning')
    return
  }

  try {
    creatingSession.value = true
    await post(`/events/${eventId}/qualification/sessions`, {
      name: newSessionName.value,
      total_ends: newSessionEnds.value || 12,
      arrows_per_end: newSessionArrows.value || 6
    })
    
    // Reset form
    newSessionName.value = ''
    newSessionEnds.value = 12
    newSessionArrows.value = 6
    showSessionDialog.value = false
    
    // Refresh sessions
    await fetchQualificationSessions()
    showToast('Sesi kualifikasi berhasil dibuat', 'success')
  } catch (error) {
    console.error('Failed to create session:', error)
    showToast('Gagal membuat sesi kualifikasi', 'error')
  } finally {
    creatingSession.value = false
  }
}

const fetchEventName = async () => {
  try {
    const response = await get(`/events/${eventId}`)
    eventName.value = response?.event?.name || response?.name || 'Event'
  } catch (error) {
    console.error('Failed to fetch event:', error)
  }
}

const fetchCategories = async () => {
  loadingCategories.value = true
  try {
    // Fetch categories from the same endpoint as used in scoring page
    const response = await get(`/events/${eventId}/categories`)
    const fetchedCategories = response?.events || response.data?.events || response?.categories || response.data?.categories || []
    categories.value = fetchedCategories
    
    // Auto-select first category if available
    if (fetchedCategories.length > 0) {
      await selectCategory(fetchedCategories[0].id)
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

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

const selectCategory = async (categoryId) => {
  selectedCategory.value = categoryId
  await fetchQualificationReport(categoryId)
}

const fetchQualificationReport = async (categoryId) => {
  if (!categoryId) return
  
  loadingReport.value = true
  try {
    const response = await get(`/events/${eventId}/qualification/leaderboard`, {
      params: { category_id: categoryId }
    })
    
    // Try multiple response structures
    const data = response?.report 
      || response?.data?.report 
      || response?.data 
      || response?.leaderboard
      || response?.archers
      || response
    
    reportEntries.value = Array.isArray(data) ? data : []
    
    if (reportEntries.value.length === 0) {
      console.warn('No report entries found for category:', categoryId, 'Response:', response)
    }
  } catch (error) {
    console.error('Failed to fetch report:', error, 'Category:', categoryId)
    reportEntries.value = []
  } finally {
    loadingReport.value = false
  }
}

const getAvatarUrl = (name, avatarUrl) => {
  if (avatarUrl) return avatarUrl
  const initial = name?.charAt(0)?.toUpperCase() || 'A'
  return `https://ui-avatars.com/api/?name=${initial}&background=0f172a&color=D9FF00&bold=true&size=128`
}

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchEventName(), fetchQualificationSessions(), fetchCategories()])
})
</script>
