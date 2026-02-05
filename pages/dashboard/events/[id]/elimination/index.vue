<template>
  <div class="flex flex-col gap-6 pb-12">
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
      <div class="relative p-5 sm:p-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center sm:items-start gap-4 flex-1">
            <!-- Icon Badge -->
            <div
              class="h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
              <Icon icon="ph:brackets-curly" class="text-primary text-xl sm:text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="min-w-0">
              <h1 class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                Manajemen Eliminasi
              </h1>
              <p class="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-1 sm:line-clamp-none">
                Kelola bracket eliminasi untuk {{ eventName }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3">
            <BaseButton variant="primary" icon="ph:plus-bold"
              class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black uppercase tracking-widest"
              @click="resetForm(); showCreateDialog = true">
              Buat Bracket
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Brackets List -->
    <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-bold text-navy">Daftar Bracket Eliminasi</h2>
          <p class="text-sm text-gray-500 mt-1">Kelola dan monitor bracket pertandingan eliminasi</p>
        </div>
      </div>

      <div v-if="loadingBrackets" class="flex gap-4 overflow-x-auto pb-2">
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

      <div v-else-if="brackets.length === 0"
        class="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
        <Icon icon="ph:brackets-curly" class="text-4xl text-gray-300 mx-auto mb-3" />
        <p class="text-sm font-bold text-gray-600 mb-1">Belum Ada Bracket Eliminasi</p>
        <p class="text-xs text-gray-400">Buat bracket pertama untuk memulai pertandingan eliminasi</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="bracket in brackets" :key="bracket.id"
          :to="`/dashboard/events/${eventId}/elimination/${bracket.id}`"
          class="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-lg transition-all text-left group">

          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3 flex-1">
              <div
                class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon icon="ph:brackets-curly" class="text-xl" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="font-bold text-navy group-hover:text-primary transition-colors line-clamp-2">
                  {{ getBracketName(bracket) }}
                </p>
                <p class="text-xs text-gray-500 font-mono mt-1">{{ bracket.id }}</p>
              </div>
            </div>
            <button @click.stop.prevent="openEditBracket(bracket)"
              class="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-primary/20 hover:text-primary transition-all">
              <Icon icon="ph:pencil-simple-bold" class="text-lg" />
            </button>
          </div>

          <!-- Details -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <Icon icon="ph:users-three" class="text-sm" />
              <span class="font-semibold">{{ bracket.bracket_size }} peserta</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <Icon icon="ph:crosshair" class="text-sm" />
              <span class="font-semibold">{{ getFormatLabel(bracket.format) }}</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-600">
              <Icon icon="ph:list" class="text-sm" />
              <span class="font-semibold">{{ getBracketTypeLabel(bracket.bracket_type) }}</span>
            </div>
            <div class="flex items-center gap-3 pt-1">
              <div class="flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                <Icon icon="ph:stack-bold" class="text-xs" />
                <span class="font-bold">{{ bracket.ends_per_match }} End/Match</span>
              </div>
              <div class="flex items-center gap-1.5 text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                <Icon icon="ph:target-bold" class="text-xs" />
                <span class="font-bold">{{ bracket.arrows_per_end }} Arrow/End</span>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between pt-3 border-t border-gray-200">
            <span class="text-xs font-mono text-gray-400">{{ formatDate(bracket.created_at) }}</span>
            <div class="flex items-center gap-1 font-bold text-xs group-hover:gap-2 transition-all">
              <span>Buka</span>
              <Icon icon="ph:arrow-right" class="text-sm" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Suggested Categories Section -->
    <div v-if="categoriesWithoutBracket.length > 0" class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-lg font-bold text-navy">Kategori Tanpa Bracket</h2>
          <p class="text-sm text-gray-500 mt-1">Saran kategori yang belum memiliki bracket eliminasi</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="cat in categoriesWithoutBracket" :key="cat.id"
          class="p-4 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
          @click="openCreateForCategory(cat)">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
              <Icon :icon="getCategoryIcon(cat)" class="text-xl text-gray-400 group-hover:text-primary" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-bold text-navy group-hover:text-primary transition-colors truncate">
                {{ getCategoryName(cat) }}
              </p>
              <p class="text-[10px] text-gray-500 font-medium">Klik untuk membuat bracket</p>
            </div>
            <Icon icon="ph:plus" class="text-gray-300 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </div>

    <!-- Create Bracket Modal -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showCreateDialog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="showCreateDialog = false">
        <div class="bg-white rounded-2xl shadow-md max-w-md w-full">
          <!-- Modal Header -->
          <div class="p-6 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-black text-navy">{{ isEditing ? 'Edit Bracket' : 'Buat Bracket Baru' }}</h2>
              <button @click="showCreateDialog = false; resetForm()" class="text-gray-400 hover:text-gray-600">
                <Icon icon="ph:x" class="text-2xl" />
              </button>
            </div>
            <p class="text-sm text-gray-500 mt-2">Konfigurasikan bracket eliminasi untuk kategori</p>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <!-- Category Selection -->
            <div>
              <label class="block text-sm font-bold text-navy mb-2">Kategori</label>
              <select v-model="newBracket.categoryId"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                <option value="">-- Pilih Kategori --</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ getCategoryName(cat) }}
                </option>
              </select>
            </div>

            <!-- Bracket Type -->
            <div>
              <label class="block text-sm font-bold text-navy mb-2">Tipe Bracket</label>
              <select v-model="newBracket.bracketType"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                <option v-for="type in availableBracketTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <!-- Format -->
            <div>
              <label class="block text-sm font-bold text-navy mb-2">Format</label>
              <select v-model="newBracket.format"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                <option value="recurve_set">Set System (untuk Recurve)</option>
                <option value="compound_total">Total Score (untuk Compound)</option>
              </select>
            </div>

            <!-- Bracket Size -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-navy mb-2">Ukuran Bracket</label>
                <select v-model.number="newBracket.bracketSize"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all">
                  <option :value="4">4 Peserta</option>
                  <option :value="8">8 Peserta</option>
                  <option :value="16">16 Peserta</option>
                  <option :value="32">32 Peserta</option>
                  <option :value="64">64 Peserta</option>
                  <option :value="128">128 Peserta</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-bold text-navy mb-2">Ends per Match</label>
                <input v-model.number="newBracket.endsPerMatch" type="number" min="1" max="15"
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
            </div>

            <!-- Arrows per End -->
            <div>
              <label class="block text-sm font-bold text-navy mb-2">Anak Panah per End</label>
              <input v-model.number="newBracket.arrowsPerEnd" type="number" min="1" max="12"
                class="w-full px-4 py-3 rounded-xl border border-gray-200 text-navy font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 border-t border-gray-100 flex gap-3">
            <button @click="showCreateDialog = false; resetForm()"
              class="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-navy font-bold hover:bg-gray-50 transition-colors">
              Batal
            </button>
            <button @click="handleCreateOrUpdate" :disabled="!newBracket.categoryId || creatingBracket"
              class="flex-1 px-4 py-3 rounded-xl bg-primary text-navy font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span v-if="!creatingBracket">{{ isEditing ? 'Update Bracket' : 'Buat Bracket' }}</span>
              <span v-else class="flex items-center gap-2">
                <span class="size-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin"></span>
                {{ isEditing ? 'Mengupdate...' : 'Membuat...' }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Manajemen Eliminasi - Dashboard'
})

const route = useRoute()
const eventId = route.params.id
const { get, post } = useApi()
const { showToast } = useToast()

const eventName = ref('Event')
const brackets = ref([])
const categories = ref([])
const loadingBrackets = ref(false)
const creatingBracket = ref(false)
const showCreateDialog = ref(false)

const editBracketId = ref(null)
const isEditing = computed(() => !!editBracketId.value)

const newBracket = ref({
  categoryId: '',
  bracketType: 'individual',
  format: 'recurve_set',
  bracketSize: 8,
  endsPerMatch: 5,
  arrowsPerEnd: 3
})

const fetchEventName = async () => {
  try {
    const response = await get(`/events/${eventId}`)
    eventName.value = response?.event?.name || response?.name || 'Event'
  } catch (error) {
    console.error('Failed to fetch event:', error)
  }
}

const fetchBrackets = async () => {
  loadingBrackets.value = true
  try {
    const response = await get(`/events/${eventId}/elimination/brackets`)
    brackets.value = response?.brackets || []
  } catch (error) {
    console.error('Failed to fetch brackets:', error)
    brackets.value = []
  } finally {
    loadingBrackets.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await get(`/events/${eventId}/categories`)
    const fetchedCategories = response?.events || response.data?.events || response?.categories || response.data?.categories || []
    categories.value = fetchedCategories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  }
}

const openEditBracket = (bracket) => {
  editBracketId.value = bracket.id || bracket.uuid
  newBracket.value = {
    categoryId: bracket.category_id,
    bracketType: bracket.bracket_type,
    format: bracket.format,
    bracketSize: bracket.bracket_size,
    endsPerMatch: bracket.ends_per_match,
    arrowsPerEnd: bracket.arrows_per_end
  }
  showCreateDialog.value = true
}

const handleCreateOrUpdate = async () => {
  if (isEditing.value) {
    await updateBracket()
  } else {
    await createBracket()
  }
}

const updateBracket = async () => {
  creatingBracket.value = true
  try {
    const response = await put(`/events/${eventId}/elimination/brackets/${editBracketId.value}`, {
      category_id: newBracket.value.categoryId,
      bracket_type: newBracket.value.bracketType,
      format: newBracket.value.format,
      bracket_size: newBracket.value.bracketSize,
      ends_per_match: newBracket.value.endsPerMatch,
      arrows_per_end: newBracket.value.arrowsPerEnd
    })

    showToast('Bracket berhasil diupdate', 'success')
    showCreateDialog.value = false
    resetForm()
    await fetchBrackets()
  } catch (error) {
    console.error('Failed to update bracket:', error)
    showToast(error?.response?.data?.error || 'Gagal update bracket', 'error')
  } finally {
    creatingBracket.value = false
  }
}

const resetForm = () => {
  editBracketId.value = null
  newBracket.value = {
    categoryId: '',
    bracketType: 'individual',
    format: 'recurve_set',
    bracketSize: 8,
    endsPerMatch: 5,
    arrowsPerEnd: 3
  }
}

const createBracket = async () => {
  if (!newBracket.value.categoryId) {
    showToast('Pilih kategori terlebih dahulu', 'warning')
    return
  }

  creatingBracket.value = true
  try {
    const response = await post(`/events/${eventId}/elimination/brackets`, {
      category_id: newBracket.value.categoryId,
      bracket_type: newBracket.value.bracketType,
      format: newBracket.value.format,
      bracket_size: newBracket.value.bracketSize,
      ends_per_match: newBracket.value.endsPerMatch,
      arrows_per_end: newBracket.value.arrowsPerEnd
    })

    if (response?.bracket?.id || response?.id) {
      showToast('Bracket berhasil dibuat', 'success')
      showCreateDialog.value = false
      resetForm()
      await fetchBrackets()
    } else {
      showToast('Gagal membuat bracket', 'error')
    }
  } catch (error) {
    console.error('Failed to create bracket:', error)
    showToast(error?.response?.data?.error || 'Gagal membuat bracket', 'error')
  } finally {
    creatingBracket.value = false
  }
}

const bracketTypes = [
  { value: 'individual', label: 'Perorangan', icon: 'ph:user' },
  { value: 'team3', label: 'Tim 3 Orang', icon: 'ph:users-three' },
  { value: 'mixed2', label: 'Tim Campuran 2 Orang', icon: 'ph:gender-intersex' }
]

const availableBracketTypes = computed(() => {
  const selectedCat = categories.value.find(c => c.id === newBracket.value.categoryId)
  if (!selectedCat) return bracketTypes

  const eventType = (selectedCat.event_type_name || '').toLowerCase()

  if (eventType === 'individual') {
    return bracketTypes.filter(t => t.value === 'individual')
  } else if (eventType.includes('team') || eventType.includes('berregu') || eventType.includes('campuran') || eventType.includes('mixed')) {
    return bracketTypes.filter(t => t.value !== 'individual')
  }

  return bracketTypes
})

const categoriesWithoutBracket = computed(() => {
  const bracketCatIds = brackets.value.map(b => b.category_id)
  return categories.value.filter(c => !bracketCatIds.includes(c.id))
})

const getCategoryIcon = (category) => {
  const eventType = (category?.event_type_name || '').toLowerCase()
  if (eventType === 'individual') return 'ph:user'
  if (eventType.includes('mixed') || eventType.includes('campuran')) return 'ph:gender-intersex'
  return 'ph:users-three'
}

const openCreateForCategory = (category) => {
  newBracket.value.categoryId = category.id
  // Auto-set the bracket type
  const eventType = (category.event_type_name || '').toLowerCase()
  if (eventType === 'individual') {
    newBracket.value.bracketType = 'individual'
  } else if (eventType.includes('mixed') || eventType.includes('campuran')) {
    newBracket.value.bracketType = 'mixed2'
  } else {
    newBracket.value.bracketType = 'team3'
  }
  showCreateDialog.value = true
}

const getBracketName = (bracket) => {
  // Use category_name from API response if available
  if (bracket.category_name) {
    return bracket.category_name
  }
  // Fallback to matching with categories
  const category = categories.value.find(c => c.id === bracket.category_id)
  return getCategoryName(category) || `Bracket ${bracket.id}`
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

const getFormatLabel = (format) => {
  const labels = {
    recurve_set: 'Set System',
    compound_total: 'Total Score'
  }
  return labels[format] || format
}

const getBracketTypeLabel = (type) => {
  const labels = {
    individual: 'Perorangan',
    team3: 'Tim 3 Orang',
    mixed2: 'Tim Campuran 2 Orang'
  }
  return labels[type] || type
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  await Promise.all([fetchEventName(), fetchBrackets(), fetchCategories()])
})
</script>
