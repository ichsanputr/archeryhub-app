<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Enhanced Header -->
    <div
      class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
      <!-- Theme Motif Pattern -->
      <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
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
              <Icon icon="ph:brackets-curly" class="text-white text-xl sm:text-2xl" />
            </div>

            <!-- Title Section -->
            <div class="min-w-0">
              <h1 class="text-xl sm:text-3xl font-black leading-tight tracking-tight mb-1 sm:mb-2 truncate">
                Manajemen Eliminasi
              </h1>
              <div class="text-slate-300 text-xs sm:text-sm max-w-2xl line-clamp-1 sm:line-clamp-none">
                Kelola bracket eliminasi untuk {{ eventName }}
              </div>
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
          <div class="text-sm text-gray-500 mt-1">Kelola dan monitor bracket pertandingan eliminasi</div>
        </div>
      </div>

      <div v-if="loadingBrackets" class="flex gap-4 overflow-x-hidden pb-2">
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
        <div class="text-sm font-bold text-gray-600 mb-1">Belum Ada Bracket Eliminasi</div>
        <div class="text-xs text-gray-400">Buat bracket pertama untuk memulai pertandingan eliminasi</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NuxtLink v-for="bracket in brackets" :key="bracket.id"
          :to="`/dashboard/events/${eventId}/elimination/${bracket.id}`"
          class="p-5 bg-gradient-to-br from-white to-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary hover:shadow-md transition-all text-left group">

          <!-- Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3 flex-1">
              <div
                class="w-12 h-12 rounded-lg flex items-center justify-center transition-colors overflow-hidden border bg-primary/50">
                <img :src="`/${getCategoryIcon(bracket.category_name)}`" class="w-8 h-8 object-contain" />
              </div>
              <div class="min-w-0 flex-1">
                <div class="font-bold text-navy group-hover:text-primary transition-colors line-clamp-2">
                  {{ getBracketName(bracket) }}
                </div>
                <div class="text-xs text-gray-500 font-mono mt-1">{{ bracket.id }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button @click.stop.prevent="openEditBracket(bracket)"
                class="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-primary/20 hover:text-primary transition-all">
                <Icon icon="ph:pencil-simple-bold" class="text-lg" />
              </button>
              <button @click.stop.prevent="confirmDeleteBracket(bracket)"
                class="p-2 rounded-lg bg-gray-100 text-gray-400 hover:bg-red-50/80 hover:text-red-500 transition-all">
                <Icon icon="ph:trash-bold" class="text-lg" />
              </button>
            </div>
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
    <div v-if="loadingCategories || categoriesWithoutBracket.length > 0"
      class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div class="flex items-center justify-between mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-4">
          <div>
            <h2 class="text-lg font-bold text-navy">Kategori Tanpa Bracket</h2>
            <div class="text-sm text-gray-500 mt-1">Saran kategori yang belum memiliki bracket eliminasi</div>
          </div>
          <div class="relative w-full sm:w-72">
            <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input v-model="searchQuery" type="text" placeholder="Cari kategori..."
              class="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary focus:bg-white transition-all font-bold text-navy placeholder:font-normal" />
          </div>
        </div>
      </div>

      <div v-if="loadingCategories" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="p-4 rounded-xl border border-gray-100 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="size-10 bg-gray-100 rounded-lg"></div>
            <div class="flex-1">
              <div class="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-gray-50 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="cat in filteredCategoriesWithoutBracket" :key="cat.id"
          class="p-4 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all cursor-pointer group"
          @click="openCreateForCategory(cat)">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 bg-white rounded-lg border border-gray-100 flex items-center justify-center group-hover:bg-navy transition-all overflow-hidden p-1.5">
              <img
                :src="'/' + getCategoryIcon(`${cat.division_name} ${cat.event_type_name} ${cat.gender_division_name}`)"
                :alt="cat.division_name" class="w-full h-full object-contain group-hover:invert transition-all" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-sm font-bold text-navy group-hover:text-primary transition-colors truncate">
                {{ getCategoryName(cat) }}
              </div>
              <div class="text-[10px] text-gray-500 font-medium">Klik untuk membuat bracket</div>
            </div>
            <Icon icon="ph:plus" class="text-gray-300 group-hover:text-primary" />
          </div>
        </div>
      </div>
    </div>

    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <div v-if="showCreateDialog"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
        @click.self="showCreateDialog = false">
        <div
          class="relative z-[101] bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] border border-white/20">
          <!-- Modal Header (Inspired by Qualification Dialog) -->
          <div class="bg-navy p-6 shrink-0 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-md shadow-primary/20">
                <Icon icon="ph:brackets-curly-bold" class="text-2xl text-navy" />
              </div>
              <div>
                <h3 class="text-xl font-black text-white leading-tight">{{ modalTitle }}</h3>
                <div class="text-gray-400 text-xs mt-0.5">Konfigurasikan detail bracket eliminasi</div>
              </div>
            </div>
            <button @click="showCreateDialog = false; resetForm()"
              class="size-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all group">
              <Icon icon="ph:x-bold" class="text-xl group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-8 space-y-8 overflow-y-auto custom-scrollbar flex-grow bg-white">
            <!-- Category & Type Section -->
            <div class="space-y-5">
              <div>
                <label class="block text-[10px] font-black text-gray-400 tracking-widest mb-2 px-1 ">Kategori
                  Pertandingan</label>
                <BaseSelect v-model="newBracket.categoryId" :items="categoryOptions" placeholder="Pilih Kategori"
                  required :disabled="isEditing" teleport />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 tracking-widest mb-2 px-1 ">Tipe
                    Bracket</label>
                  <BaseSelect v-model="newBracket.bracketType" :items="availableBracketTypes"
                    placeholder="Pilih Tipe Bracket" required teleport />
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 tracking-widest mb-2 px-1 ">Format
                    Skor</label>
                  <BaseSelect v-model="newBracket.format" :items="formatOptions" placeholder="Pilih Format" required
                    teleport />
                </div>
              </div>
            </div>

            <!-- Configuration Section -->
            <div class="p-6 bg-gray-50/80 rounded-3xl border border-gray-100 space-y-6">
              <div class="flex items-center gap-2 mb-1">
                <div class="h-4 w-1 bg-primary rounded-full"></div>
                <div class="text-[10px] font-black text-navy uppercase tracking-widest">Konfigurasi Match</div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-[10px] font-black text-gray-400 tracking-widest mb-2 px-1 ">Ukuran
                    Bracket</label>
                  <!-- Loading -->
                  <div v-if="loadingBracketSize"
                    class="h-12 bg-gray-50 rounded-xl border border-gray-100 animate-pulse"></div>
                  <!-- Editing: bracket size is locked -->
                  <div v-else-if="isEditing"
                    class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 h-12">
                    <Icon icon="ph:brackets-curly-bold" class="text-navy text-lg flex-shrink-0" />
                    <div>
                      <div class="font-black text-navy text-sm">{{ newBracket.bracketSize }} Slot</div>
                      <div class="text-[10px] text-gray-400">Tetap sejak dibuat</div>
                    </div>
                  </div>
                  <!-- Creating: dropdown of valid options -->
                  <div v-else-if="bracketSizeDropdownOptions.length > 0" class="space-y-2">
                    <BaseSelect v-model="newBracket.bracketSize" :items="bracketSizeDropdownOptions"
                      placeholder="Pilih Ukuran" required teleport />
                    <!-- Hint below dropdown -->
                    <div class="text-[10px] px-1"
                      :class="selectedBracketHint.isEstimate ? 'text-amber-600' : 'text-gray-400'">
                      {{ selectedBracketHint.text }}
                    </div>
                  </div>
                  <!-- No participants -->
                  <div v-else-if="newBracket.categoryId"
                    class="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-xl h-12">
                    <Icon icon="ph:warning-bold" class="text-yellow-500 flex-shrink-0" />
                    <span class="text-xs font-bold text-yellow-700">Belum ada peserta di kategori ini</span>
                  </div>
                  <div v-else class="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl h-12">
                    <Icon icon="ph:info-bold" class="text-gray-300 flex-shrink-0" />
                    <span class="text-xs text-gray-400">Pilih kategori untuk kalkulasi otomatis</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[10px] font-black text-gray-400 tracking-widest mb-2 px-1 ">Ends per
                    Match</label>
                  <BaseInput v-model.number="newBracket.endsPerMatch" type="number" min="1" max="15" required />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-black text-gray-400 tracking-widest mb-2 px-1 ">Anak Panah
                  per End</label>
                <BaseInput v-model.number="newBracket.arrowsPerEnd" type="number" min="1" max="6" required />
              </div>
            </div>

            <!-- Timing Section -->
            <div class="p-6 bg-gray-50/80 rounded-3xl border border-gray-100 space-y-6">
              <div class="flex items-center gap-2 mb-1">
                <div class="h-4 w-1 bg-primary rounded-full"></div>
                <div class="text-[10px] font-black text-navy uppercase tracking-widest">Waktu Pelaksanaan</div>
              </div>

              <div class="space-y-6">
                <!-- Start Time -->
                <div>
                  <label class="block text-sm font-bold text-navy mb-3 ml-1">Mulai Eliminasi</label>
                  <div class="grid grid-cols-2 gap-4">
                    <BaseInput v-model="newBracket.startDate" type="date" icon="ph:calendar-bold" />
                    <BaseInput v-model="newBracket.startTime" type="time" icon="ph:clock-bold" />
                  </div>
                </div>

                <!-- End Time -->
                <div>
                  <label class="block text-sm font-bold text-navy mb-3 ml-1">Selesai Eliminasi</label>
                  <div class="grid grid-cols-2 gap-4">
                    <BaseInput v-model="newBracket.endDate" type="date" icon="ph:calendar-bold" />
                    <BaseInput v-model="newBracket.endTime" type="time" icon="ph:clock-afternoon-bold" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer (Matching Qualification Styles) -->
          <div class="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0">
            <button @click="showCreateDialog = false; resetForm()"
              class="flex-1 px-6 py-4 bg-white border-2 border-gray-200 text-gray-500 rounded-2xl font-black hover:bg-gray-100 hover:border-gray-300 transition-all tracking-widest text-[10px] ">
              Batal
            </button>
            <BaseButton
              :disabled="(!isEditing && bracketSizeDropdownOptions.length === 0) || !newBracket.categoryId || creatingBracket"
              :loading="creatingBracket" variant="primary"
              class="flex-[2] py-4 rounded-2xl font-black shadow-lg shadow-primary/10 tracking-widest text-[10px] "
              @click="handleCreateOrUpdate">
              <span>{{ submitButtonLabel }}</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Confirmation Dialog -->
    <BaseDialogForm v-if="showDeleteDialog" v-model="showDeleteDialog" @close="showDeleteDialog = false">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
            <Icon icon="ph:trash-bold" class="text-xl text-red-600" />
          </div>
          <h2 class="text-xl font-black text-navy">Hapus Bracket Eliminasi?</h2>
        </div>
      </template>
      <div class="space-y-6 pt-2">
        <!-- Warning Banner -->
        <div class="p-6 bg-red-50 border-2 border-red-100 rounded-3xl relative overflow-hidden group">
          <div class="absolute -right-4 -top-4 opacity-10 group-hover:scale-120 transition-transform duration-700">
            <Icon icon="ph:warning-circle-bold" class="text-8xl text-red-600" />
          </div>
          <div class="relative z-10">
            <h4 class="text-sm font-black text-red-700 uppercase tracking-widest mb-2">Peringatan Penghapusan</h4>
            <div class="text-xs font-bold text-red-600/80 leading-relaxed mb-4">
              Anda akan menghapus bracket eliminasi ini secara permanen. Seluruh riwayat pertandingan, skor, dan kode
              scoring akan ikut terhapus.
            </div>

            <div class="flex items-center gap-2 px-3 py-1.5 bg-red-100 rounded-xl w-fit">
              <Icon icon="ph:info-bold" class="text-red-600" />
              <span class="text-[10px] font-black uppercase tracking-wider text-red-700">Tindakan Tidak Dapat
                Dibatalkan</span>
            </div>
          </div>
        </div>

        <!-- Bracket Overview -->
        <div class="p-5 rounded-2xl bg-navy text-white relative overflow-hidden group shadow-sm">
          <div class="absolute inset-0 opacity-10 pointer-events-none"
            style="background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px);">
          </div>
          <div class="relative z-10">
            <h4 class="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-2">Informasi Bracket</h4>
            <div class="text-lg font-black leading-tight mb-1">
              {{ getBracketName(bracketToDelete) }}
            </div>
            <div class="text-xs font-bold text-slate-300">
              Ukuran: {{ bracketToDelete?.bracket_size }} Peserta • Tipe: {{
                getBracketTypeLabel(bracketToDelete?.bracket_type) }}
            </div>
          </div>
        </div>

        <!-- Impact Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div v-for="stat in [
            { label: 'Pertandingan', count: 'SEMUA', icon: 'ph:layout-bold' },
            { label: 'Skor Hasil', count: 'SELURUH', icon: 'ph:medal-bold' },
            { label: 'Kode Papan', count: 'SEMUA', icon: 'ph:lock-key-bold' },
            { label: 'Entri Peserta', count: 'SEMUA', icon: 'ph:users-bold' }
          ]" :key="stat.label"
            class="p-4 rounded-2xl border transition-all duration-300 shadow-sm bg-red-50 border-red-100">
            <div class="flex items-center justify-between mb-2">
              <div
                class="size-9 rounded-lg flex items-center justify-center transition-colors shadow-inner bg-red-100 text-red-600">
                <Icon :icon="stat.icon" class="text-lg" />
              </div>
              <div class="text-[10px] font-black text-red-700 uppercase tracking-widest">
                {{ stat.count }}
              </div>
            </div>
            <span class="text-[9px] uppercase font-black text-gray-400 tracking-wider text-left">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <template #action>
        <BaseButton variant="white" @click="showDeleteDialog = false"
          class="px-6 font-bold uppercase tracking-wider text-xs">
          Batal
        </BaseButton>
        <BaseButton variant="danger" @click="handleDeleteBracket" :disabled="savingDelete" :loading="savingDelete"
          icon="ph:trash-bold" class="px-8 font-black uppercase tracking-wider text-xs shadow-lg shadow-red-200">
          Hapus Bracket
        </BaseButton>
      </template>
    </BaseDialogForm>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: 'Manajemen Eliminasi - Dashboard'
})

import { getCategoryIcon, getCategoryColorClass } from '~/utils/logoArcheryCategory'

const route = useRoute()
const eventId = computed(() => route.params.id)
const { get, post, put, delete: del } = useApi()
const toast = useToast()

const eventName = ref('Event')
const brackets = ref([])
const categories = ref([])
const loadingBrackets = ref(false)
const loadingCategories = ref(false)
const loadingBracketSize = ref(false)
const bracketSizeInfo = ref({ participant_count: 0, max_bracket_size: 0, byes: 0, synced_teams: 0, possible_teams: 0, team_size: 1 })
const creatingBracket = ref(false)
const showCreateDialog = ref(false)

const showDeleteDialog = ref(false)
const bracketToDelete = ref(null)
const savingDelete = ref(false)

const editBracketId = ref(null)
const isEditing = computed(() => !!editBracketId.value)
const modalTitle = computed(() => isEditing.value ? 'Edit Bracket' : 'Buat Bracket Baru')
const submitButtonLabel = computed(() => {
  if (creatingBracket.value) return isEditing.value ? 'Mengupdate...' : 'Membuat...'
  return isEditing.value ? 'Simpan Update' : 'Buat Bracket'
})

const defaultStartDate = () => new Date().toISOString().split('T')[0]
const defaultStartTime = '08:00'
const defaultEndTime = '17:00'

const newBracket = ref({
  categoryId: '',
  bracketType: 'individual',
  format: 'recurve_set',
  bracketSize: 0, // display-only when editing; auto-calculated from API when creating
  endsPerMatch: 5,
  arrowsPerEnd: 3,
  startDate: defaultStartDate(),
  startTime: defaultStartTime,
  endDate: defaultStartDate(),
  endTime: defaultEndTime
})

const fetchBracketSizeInfo = async () => {
  const catId = newBracket.value.categoryId
  const type = newBracket.value.bracketType
  if (!catId || !eventId.value || isEditing.value) return

  loadingBracketSize.value = true
  bracketSizeInfo.value = { participant_count: 0, max_bracket_size: 0, byes: 0, synced_teams: 0, possible_teams: 0, team_size: 1 }
  try {
    const response = await get(`/events/${eventId.value}/elimination/bracket-size`, {
      params: { category_id: catId, bracket_type: type }
    })
    bracketSizeInfo.value = {
      participant_count: response?.participant_count || 0,
      max_bracket_size: response?.max_bracket_size || 0,
      byes: response?.byes || 0,
      synced_teams: response?.synced_teams ?? 0,
      possible_teams: response?.possible_teams ?? 0,
      team_size: response?.team_size ?? 1
    }
    // Auto-select max bracket size as default
    if (bracketSizeInfo.value.max_bracket_size > 0) {
      newBracket.value.bracketSize = bracketSizeInfo.value.max_bracket_size
    }
  } catch (e) {
    bracketSizeInfo.value = { participant_count: 0, max_bracket_size: 0, byes: 0, synced_teams: 0, possible_teams: 0, team_size: 1 }
  } finally {
    loadingBracketSize.value = false
  }
}

watch(
  [() => newBracket.value.categoryId, () => newBracket.value.bracketType],
  () => { fetchBracketSizeInfo() }
)

const searchQuery = ref('')

const fetchEventName = async () => {
  const id = eventId.value
  if (!id) return
  try {
    const response = await get(`/events/${id}`)
    eventName.value = response?.event?.name || response?.name || 'Event'
  } catch (error) {
    console.error('Failed to fetch event:', error)
  }
}

const fetchBrackets = async () => {
  const id = eventId.value
  if (!id) return
  loadingBrackets.value = true
  try {
    const response = await get(`/events/${id}/elimination/brackets`)
    brackets.value = response?.brackets || []
  } catch (error) {
    console.error('Failed to fetch brackets:', error)
    brackets.value = []
  } finally {
    loadingBrackets.value = false
  }
}

const fetchCategories = async () => {
  const id = eventId.value
  if (!id) return
  loadingCategories.value = true
  try {
    // Fetch all categories (increased limit from default 10)
    const response = await get(`/events/${id}/categories`, { params: { limit: 1000 } })
    const fetchedCategories = response?.events || response.data?.events || response?.categories || response.data?.categories || []
    categories.value = fetchedCategories
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    categories.value = []
  } finally {
    loadingCategories.value = false
  }
}

function parseBracketDatetime(isoOrNull, defaultTime = defaultStartTime) {
  if (!isoOrNull) return { date: defaultStartDate(), time: defaultTime }
  const d = new Date(isoOrNull)
  if (isNaN(d.getTime())) return { date: defaultStartDate(), time: defaultTime }
  const date = d.toISOString().slice(0, 10)
  const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return { date, time }
}

const openEditBracket = (bracket) => {
  editBracketId.value = bracket.id || bracket.uuid
  const start = parseBracketDatetime(bracket.start_time, defaultStartTime)
  const end = parseBracketDatetime(bracket.end_time, defaultEndTime)
  bracketSizeInfo.value = { participant_count: 0, bracket_size: bracket.bracket_size, byes: 0 }
  newBracket.value = {
    categoryId: bracket.category_id,
    bracketType: bracket.bracket_type,
    format: bracket.format,
    bracketSize: bracket.bracket_size,
    endsPerMatch: bracket.ends_per_match,
    arrowsPerEnd: bracket.arrows_per_end,
    startDate: start.date,
    startTime: start.time,
    endDate: end.date,
    endTime: end.time
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
    const payload = {
      category_id: newBracket.value.categoryId,
      bracket_type: newBracket.value.bracketType,
      format: newBracket.value.format,
      ends_per_match: newBracket.value.endsPerMatch,
      arrows_per_end: newBracket.value.arrowsPerEnd
    }
    const startDt = toDatetimeISO(newBracket.value.startDate, newBracket.value.startTime)
    const endDt = toDatetimeISO(newBracket.value.endDate, newBracket.value.endTime)
    if (startDt) payload.start_time = startDt
    if (endDt) payload.end_time = endDt
    const response = await put(`/events/${eventId.value}/elimination/brackets/${editBracketId.value}`, payload)

    toast.success('Bracket berhasil diupdate')
    showCreateDialog.value = false
    resetForm()
    await fetchBrackets()
  } catch (error) {
    console.error('Failed to update bracket:', error)
    const data = error?.data || error?.response?.data
    const msg = data?.error || 'Gagal update bracket'
    toast.error(msg)
  } finally {
    creatingBracket.value = false
  }
}

const resetForm = () => {
  editBracketId.value = null
  bracketSizeInfo.value = { participant_count: 0, max_bracket_size: 0, byes: 0, synced_teams: 0, possible_teams: 0, team_size: 1 }
  newBracket.value = {
    categoryId: '',
    bracketType: 'individual',
    format: 'recurve_set',
    bracketSize: 0,
    endsPerMatch: 5,
    arrowsPerEnd: 3,
    startDate: defaultStartDate(),
    startTime: defaultStartTime,
    endDate: defaultStartDate(),
    endTime: defaultEndTime
  }
}

function toDatetimeISO(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null
  return `${dateStr}T${timeStr}:00`
}

const createBracket = async () => {
  if (!newBracket.value.categoryId) {
    toast.warning('Pilih kategori terlebih dahulu')
    return
  }
  if (bracketSizeDropdownOptions.value.length === 0) {
    toast.warning('Tidak ada peserta untuk kategori ini. Bracket tidak dapat dibuat.')
    return
  }

  creatingBracket.value = true
  try {
    const payload = {
      category_id: newBracket.value.categoryId,
      bracket_type: newBracket.value.bracketType,
      format: newBracket.value.format,
      bracket_size: newBracket.value.bracketSize,
      ends_per_match: newBracket.value.endsPerMatch,
      arrows_per_end: newBracket.value.arrowsPerEnd
    }
    const startDt = toDatetimeISO(newBracket.value.startDate, newBracket.value.startTime)
    const endDt = toDatetimeISO(newBracket.value.endDate, newBracket.value.endTime)
    if (startDt) payload.start_time = startDt
    if (endDt) payload.end_time = endDt
    const response = await post(`/events/${eventId.value}/elimination/brackets`, payload)

    if (response?.bracket?.id || response?.id) {
      toast.success('Bracket berhasil dibuat')
      showCreateDialog.value = false
      resetForm()
      await fetchBrackets()
    } else {
      toast.error('Gagal membuat bracket')
    }
  } catch (error) {
    console.error('Failed to create bracket:', error)
    const data = error?.data || error?.response?.data
    let msg = data?.error || 'Gagal membuat bracket'
    if (data?.participant_count != null && data?.required != null) {
      msg = `${data.error} (tersedia ${data.participant_count}, diperlukan ${data.required})`
    }
    toast.error(msg)
  } finally {
    creatingBracket.value = false
  }
}

const confirmDeleteBracket = (bracket) => {
  bracketToDelete.value = bracket
  showDeleteDialog.value = true
}

const handleDeleteBracket = async () => {
  if (!bracketToDelete.value) return

  savingDelete.value = true
  try {
    await del(`/events/${eventId.value}/elimination/brackets/${bracketToDelete.value.uuid || bracketToDelete.value.id}`)
    toast.success('Bracket eliminasi berhasil dihapus')
    showDeleteDialog.value = false
    bracketToDelete.value = null
    await fetchBrackets()
    await fetchCategories()
  } catch (error) {
    console.error('Failed to delete bracket:', error)
    toast.error('Gagal menghapus bracket')
  } finally {
    savingDelete.value = false
  }
}

const bracketTypes = [
  { value: 'individual', title: 'Perorangan', icon: 'ph:user' },
  { value: 'team3', title: 'Tim 3 Orang', icon: 'ph:users-three' },
  { value: 'mixed2', title: 'Tim Campuran 2 Orang', icon: 'ph:gender-intersex' }
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

const categoryOptions = computed(() => {
  return categories.value.map(cat => ({
    value: cat.id,
    title: getCategoryName(cat)
  }))
})

const formatOptions = [
  { value: 'recurve_set', title: 'Set System' },
  { value: 'compound_total', title: 'Total Score' }
]

// Generate all valid power-of-2 bracket size options from 4 up to max_bracket_size
const bracketSizeDropdownOptions = computed(() => {
  const max = bracketSizeInfo.value.max_bracket_size
  if (!max || max < 4) return []
  const opts = []
  for (let s = 4; s <= max; s *= 2) {
    opts.push({ value: s, title: `${s} Slot` })
  }
  return opts
})

// Dynamic hint shown below the bracket size dropdown
const selectedBracketHint = computed(() => {
  const size = newBracket.value.bracketSize
  const count = bracketSizeInfo.value.participant_count
  const synced = bracketSizeInfo.value.synced_teams
  const possible = bracketSizeInfo.value.possible_teams
  const isTeam = newBracket.value.bracketType !== 'individual'
  if (!size || !count) return { text: '', isEstimate: false }

  if (size >= count) {
    const byes = size - count
    if (isTeam && synced === 0 && possible > 0) {
      return { text: `~${count} tim potensial · ${byes} bye · estimasi (belum disinkron)`, isEstimate: true }
    }
    return { text: `${count} peserta · ${byes} bye`, isEstimate: false }
  } else {
    // bracket smaller than count: only top N qualify
    const label = isTeam ? 'tim' : 'peserta'
    if (isTeam && synced === 0 && possible > 0) {
      return { text: `Top ${size} dari ~${count} ${label} potensial (estimasi)`, isEstimate: true }
    }
    return { text: `Top ${size} dari ${count} ${label} berdasarkan ranking`, isEstimate: false }
  }
})

const categoriesWithoutBracket = computed(() => {
  const bracketCatIds = brackets.value.map(b => b.category_id)
  return categories.value.filter(c => !bracketCatIds.includes(c.id))
})

const filteredCategoriesWithoutBracket = computed(() => {
  if (!searchQuery.value) return categoriesWithoutBracket.value
  const q = searchQuery.value.toLowerCase()
  return categoriesWithoutBracket.value.filter(cat => {
    const name = getCategoryName(cat).toLowerCase()
    return name.includes(q)
  })
})


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

const loadPageData = () => {
  if (!eventId.value) return
  Promise.all([fetchEventName(), fetchBrackets(), fetchCategories()])
}

// Re-fetch whenever we're on this page (including when returning via browser back / touchpad back)
watch(
  () => [route.params.id, route.params.bracketId],
  ([id, bracketId]) => {
    if (import.meta.client && id && bracketId === undefined) loadPageData()
  },
  { immediate: true }
)

// Re-fetch when page is restored from bfcache (browser back can restore cached page without re-mounting)
const onPageShow = (event) => {
  if (event.persisted) loadPageData()
}

// Fallback: re-fetch when tab/window becomes visible (handles some SSR/back edge cases)
const onVisibilityChange = () => {
  if (document.visibilityState === 'visible' && eventId.value && route.params.bracketId === undefined) {
    loadPageData()
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('pageshow', onPageShow)
    document.addEventListener('visibilitychange', onVisibilityChange)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('pageshow', onPageShow)
    document.removeEventListener('visibilitychange', onVisibilityChange)
  }
})
</script>
