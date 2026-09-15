<template>
  <div class="flex flex-col gap-6 pb-16 font-body text-navy antialiased">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_elimination.title', 'Bagan & Babak Eliminasi')"
      :subtitle="t('event_elimination.desc', { eventName: eventName || 'Event' })"
      icon="mdi:bracket"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_elimination.title', 'Bagan Eliminasi') }
      ]"
    >
      <template #actions>
        <BaseButton
          variant="primary"
          icon="ph:plus-bold"
          class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
          :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
          @click="isSubscriptionActive ? (resetForm(), showCreateDialog = true) : (showPremiumModal = true)">
          {{ t('event_elimination.create_bracket', 'Buat Bagan Eliminasi') }}
        </BaseButton>
      </template>
    </DashboardHeader>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

    <!-- Brackets List Section -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-base font-black text-navy">{{ t('event_elimination.bracket_list', 'Daftar Bagan Eliminasi') }}</h2>
          <div class="text-xs text-slate-500 mt-0.5">{{ t('event_elimination.bracket_list_desc', 'Kelola dan monitor bagan pertandingan eliminasi') }}</div>
        </div>
      </div>

      <div v-if="loadingBrackets" class="flex gap-4 overflow-x-hidden pb-2">
        <div v-for="i in 4" :key="i" class="flex-shrink-0 w-72 p-5 rounded-2xl border border-slate-100 animate-pulse">
          <div class="flex items-start gap-3">
            <div class="size-12 bg-slate-100 rounded-xl"></div>
            <div class="flex-1">
              <div class="h-5 bg-slate-100 rounded mb-2"></div>
              <div class="h-4 bg-slate-50 rounded w-24"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="brackets.length === 0"
        class="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
        <Icon icon="mdi:bracket" class="text-4xl text-slate-300 mx-auto mb-3" />
        <div class="text-sm font-bold text-slate-700 mb-1">{{ t('event_elimination.no_brackets', 'Belum Ada Bagan Eliminasi') }}</div>
        <div class="text-xs text-slate-400">{{ t('event_elimination.no_brackets_desc', 'Buat bagan pertama untuk memulai pertandingan eliminasi') }}</div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NuxtLink v-for="bracket in brackets" :key="bracket.id"
          :to="route.path.includes('/organizer/') ? `/dashboard/organizer/tournaments/${eventId}/elimination/${bracket.id}` : `/dashboard/archer/tournaments/${eventId}/elimination/${bracket.id}`"
          class="rounded-3xl border border-slate-200/90 hover:border-navy transition-all duration-200 bg-white flex flex-col justify-between overflow-hidden relative group text-left shadow-xs">

          <!-- Themed Signature Navy Card Header -->
          <div class="relative overflow-hidden p-5 bg-gradient-to-r from-navy via-navy to-navy/95 text-white border-b border-primary/20">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0" style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);"></div>
            <!-- Decorative Top Accent Line -->
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative z-10 flex items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <h3 class="font-black text-white text-base sm:text-lg leading-tight truncate">
                  {{ getBracketName(bracket) }}
                </h3>
                <div class="flex items-center gap-1.5 mt-1.5">
                  <span class="text-[10px] font-bold font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-lg">
                    ID: {{ bracket.id }}
                  </span>
                </div>
              </div>

              <!-- Action Edit Button in Header -->
              <div class="flex items-center gap-1.5 shrink-0">
                <button type="button"
                  @click.stop.prevent="isSubscriptionActive ? openEditBracket(bracket) : (showPremiumModal = true)"
                  class="size-8 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center justify-center active:scale-95"
                  :title="t('event_elimination.edit_bracket', 'Edit Bracket')">
                  <Icon icon="ph:pencil-simple-bold" class="text-sm" />
                </button>
              </div>
            </div>
          </div>

          <!-- Card Body: Format Tags & Match Metric Details -->
          <div class="p-5 sm:p-6 bg-slate-50/70 flex-1 space-y-3.5">
            <!-- Format & Type Chips -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-navy border border-slate-200 text-xs font-bold">
                <Icon icon="ph:crosshair-bold" class="text-xs text-slate-500" />
                <span>{{ getFormatLabel(bracket.format) }}</span>
              </span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 text-xs font-bold">
                <Icon icon="ph:list-bullets-bold" class="text-xs text-slate-500" />
                <span>{{ getBracketTypeLabel(bracket.bracket_type) }}</span>
              </span>
            </div>

            <!-- Bracket Metrics Box -->
            <div class="bg-white rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5">
              <div class="flex items-center gap-2.5 text-xs font-bold text-slate-700">
                <div class="size-6 rounded-lg bg-slate-100 text-navy flex items-center justify-center shrink-0">
                  <Icon icon="ph:users-three-bold" class="text-xs" />
                </div>
                <span>{{ bracket.bracket_size }} {{ bracket.bracket_type === 'individual' ? (t('event_detail.archers') || 'Pemanah') : (t('event_detail.teams') || 'Tim') }}</span>
              </div>

              <!-- 2-column Rules Metric -->
              <div class="grid grid-cols-2 gap-2">
                <div class="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Icon icon="ph:stack-bold" class="text-slate-400 text-sm shrink-0" />
                  <span class="text-xs font-black text-navy truncate">{{ bracket.ends_per_match }} End/Match</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <Icon icon="ph:target-bold" class="text-slate-400 text-sm shrink-0" />
                  <span class="text-xs font-black text-navy truncate">{{ bracket.arrows_per_end }} Panah/End</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="flex items-center justify-between px-5 sm:px-6 py-3.5 bg-white border-t border-slate-200/80 mt-auto">
            <span class="text-xs font-mono text-slate-400">{{ formatDate(bracket.created_at) }}</span>
            <div
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy text-white group-hover:bg-primary group-hover:text-navy text-xs font-bold transition-all active:scale-95">
              <span>{{ t('event_elimination.manage', 'Kelola') }}</span>
              <Icon icon="ph:arrow-right-bold" class="text-xs" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Suggested Categories Section -->
    <div v-if="loadingCategories || categoriesWithoutBracket.length > 0"
      class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
      <div class="flex items-center justify-between mb-6">
        <div class="flex flex-col sm:flex-row sm:items-center w-full justify-between gap-4">
          <div>
            <h2 class="text-base font-black text-navy">{{ t('event_elimination.categories_without_bracket', 'Kategori Belum Ada Bagan') }}</h2>
            <div class="text-xs text-slate-500 mt-0.5">{{ t('event_elimination.categories_without_bracket_desc', 'Daftar kategori perlombaan yang belum memiliki bagan eliminasi') }}</div>
          </div>
          <div class="relative w-full sm:w-72">
            <Icon icon="ph:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input v-model="searchQuery" type="text" :placeholder="t('event_elimination.search_categories', 'Cari kategori...')"
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-navy focus:bg-white transition-all font-bold text-navy placeholder:font-normal" />
          </div>
        </div>
      </div>

      <div v-if="loadingCategories" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="i in 3" :key="i" class="p-4 rounded-xl border border-slate-100 animate-pulse">
          <div class="flex items-center gap-3">
            <div class="size-10 bg-slate-100 rounded-lg"></div>
            <div class="flex-1">
              <div class="h-4 bg-slate-100 rounded w-3/4 mb-2"></div>
              <div class="h-3 bg-slate-50 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="cat in filteredCategoriesWithoutBracket" :key="cat.id"
          class="p-4 bg-slate-50 hover:bg-white text-navy rounded-2xl border border-slate-200 hover:border-navy transition-all duration-200 cursor-pointer group flex items-center justify-between gap-3 text-left relative overflow-hidden"
          @click="isSubscriptionActive ? openCreateForCategory(cat) : (showPremiumModal = true)">
          
          <div class="flex items-center gap-3.5 min-w-0 flex-1">
            <div
              class="size-11 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-all overflow-hidden">
              <img
                :src="'/' + getCategoryIcon(`${cat.division_name} ${cat.event_type_name} ${cat.gender_division_name}`)"
                :alt="cat.division_name" class="w-full h-full object-contain transition-all" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="text-xs font-black text-navy truncate">
                {{ getCategoryName(cat) }}
              </div>
              <div class="text-[11px] text-slate-400 font-medium mt-0.5">{{ t('event_elimination.click_to_create', 'Klik untuk membuat bagan') }}</div>
            </div>
          </div>
          <div class="size-8 rounded-xl bg-navy text-white group-hover:bg-primary group-hover:text-navy flex items-center justify-center shrink-0 transition-all font-black">
            <Icon icon="ph:plus-bold" class="text-xs" />
          </div>
        </div>
      </div>
    </div>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
      enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showCreateDialog"
        class="fixed inset-0 z-50 overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        @click.self="showCreateDialog = false">
        <div class="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col my-auto">
          
          <!-- Signature Navy Header -->
          <div class="relative overflow-hidden px-6 py-5 bg-gradient-to-r from-navy via-navy to-navy/90 text-white flex items-center justify-between border-b border-primary/20">
            <div class="absolute inset-0"
              style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>

            <div class="relative flex items-center gap-3.5 min-w-0">
              <div class="size-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white text-xl shrink-0 shadow-sm">
                <Icon :icon="isEditing ? 'ph:pencil-simple-bold' : 'mdi:bracket'" />
              </div>
              <div class="min-w-0">
                <h3 class="text-lg font-black tracking-tight text-white leading-tight truncate">
                  {{ modalTitle }}
                </h3>
                <div class="text-xs text-slate-300 truncate mt-0.5">
                  {{ t('event_elimination.configure_details', 'Konfigurasi detail bagan eliminasi') }}
                </div>
              </div>
            </div>

            <button @click="showCreateDialog = false; resetForm()"
              class="relative size-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors shrink-0 ml-4">
              <Icon icon="ph:x-bold" class="text-sm" />
            </button>
          </div>

          <!-- Modal Body (Sectioned Cards matching Create Session modal) -->
          <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
            
            <!-- Section 1: Category & Bracket Type -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Icon icon="ph:trophy-bold" class="text-slate-600 text-base" />
                <span>{{ t('event_elimination.competition_category', 'Kategori & Tipe Lomba') }}</span>
              </div>

              <div class="space-y-3.5">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    {{ t('event_elimination.competition_category', 'Kategori Lomba') }} <span class="text-red-500">*</span>
                  </label>
                  <BaseSelect v-model="newBracket.categoryId" :items="categoryOptions" :placeholder="t('event_elimination.select_category', 'Pilih Kategori Lomba')"
                    required :disabled="isEditing" teleport />
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">
                      {{ t('event_elimination.bracket_type', 'Tipe Bagan') }} <span class="text-red-500">*</span>
                    </label>
                    <BaseSelect v-model="newBracket.bracketType" :items="availableBracketTypes"
                      :placeholder="t('event_elimination.select_bracket_type', 'Pilih Tipe Bagan')" required teleport />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">
                      {{ t('event_elimination.score_format', 'Format Skor') }} <span class="text-red-500">*</span>
                    </label>
                    <BaseSelect v-model="newBracket.format" :items="formatOptions" :placeholder="t('event_elimination.select_format', 'Pilih Format Skor')" required
                      teleport />
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 2: Match Configuration -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Icon icon="ph:target-bold" class="text-slate-600 text-base" />
                <span>{{ t('event_elimination.match_config', 'Konfigurasi Pertandingan') }}</span>
              </div>

              <div class="space-y-3.5">
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    {{ t('event_elimination.bracket_size', 'Ukuran Bagan') }} <span class="text-red-500">*</span>
                  </label>
                  <!-- Loading -->
                  <div v-if="loadingBracketSize"
                    class="h-11 bg-white rounded-xl border border-slate-200 animate-pulse"></div>
                  <!-- Editing: bracket size is locked -->
                  <div v-else-if="isEditing"
                    class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 h-11">
                    <Icon icon="ph:brackets-curly-bold" class="text-navy text-lg flex-shrink-0" />
                    <div>
                      <div class="font-bold text-slate-900 text-xs sm:text-sm">{{ newBracket.bracketSize }} Slot</div>
                      <div class="text-[10px] text-slate-400">{{ t('event_elimination.fixed_since_creation', 'Ukuran terkunci sejak pembuatan') }}</div>
                    </div>
                  </div>
                  <!-- Creating: dropdown of valid options -->
                  <div v-else-if="bracketSizeDropdownOptions.length > 0" class="space-y-1.5">
                    <BaseSelect v-model="newBracket.bracketSize" :items="bracketSizeDropdownOptions"
                      :placeholder="t('event_elimination.select_size', 'Pilih Ukuran Bagan')" required teleport />
                    <!-- Hint below dropdown -->
                    <div class="text-xs font-medium"
                      :class="selectedBracketHint.isEstimate ? 'text-amber-600' : 'text-slate-500'">
                      {{ selectedBracketHint.text }}
                    </div>
                  </div>
                  <!-- No / Insufficient participants -->
                  <div v-else-if="newBracket.categoryId"
                    class="flex items-center gap-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <Icon icon="ph:warning-circle-bold" class="text-amber-600 text-lg flex-shrink-0" />
                    <span class="text-xs font-bold text-amber-800">
                      {{ bracketSizeInfo.participant_count === 1
                        ? t('event_elimination.min_two_participants', 'Hanya 1 peserta terdaftar. Minimal 2 peserta untuk membuat bagan eliminasi.')
                        : (newBracket.bracketType !== 'individual'
                          ? t('event_elimination.insufficient_teams', 'Jumlah tim belum mencukupi untuk membuat bagan eliminasi (Minimal 2 tim)')
                          : t('event_elimination.no_participants_in_category', 'Jumlah peserta belum mencukupi untuk membuat bagan eliminasi (Minimal 2 peserta)'))
                      }}
                    </span>
                  </div>
                  <div v-else class="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-xl h-11">
                    <Icon icon="ph:info-bold" class="text-slate-400 flex-shrink-0" />
                    <span class="text-xs text-slate-500">{{ t('event_elimination.select_category_for_calc', 'Pilih kategori untuk kalkulasi ukuran bagan') }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">
                      {{ t('event_elimination.ends_per_match', 'Jumlah Seri / Match') }} <span class="text-red-500">*</span>
                    </label>
                    <BaseInput v-model.number="newBracket.endsPerMatch" type="number" min="1" max="15" required />
                  </div>
                  <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">
                      {{ t('event_elimination.arrows_per_end', 'Jumlah Panah / Seri') }} <span class="text-red-500">*</span>
                    </label>
                    <BaseInput v-model.number="newBracket.arrowsPerEnd" type="number" min="1" max="6" required />
                  </div>
                </div>
              </div>
            </div>

            <!-- Section 3: Timing / Schedule -->
            <div class="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
              <div class="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Icon icon="ph:calendar-check-bold" class="text-slate-600 text-base" />
                <span>{{ t('event_elimination.schedule', 'Jadwal Pertandingan') }}</span>
              </div>

              <div class="space-y-3.5">
                <!-- Start Time -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    {{ t('event_elimination.start_elimination', 'Waktu Mulai Eliminasi') }}
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <BaseDatePicker v-model="newBracket.startDate" :placeholder="t('event_elimination.start_date', 'Tanggal Mulai')" />
                    <BaseTimePicker v-model="newBracket.startTime" placeholder="08:00" />
                  </div>
                </div>

                <!-- End Time -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 mb-1.5">
                    {{ t('event_elimination.end_elimination', 'Waktu Selesai Eliminasi') }}
                  </label>
                  <div class="grid grid-cols-2 gap-3">
                    <BaseDatePicker v-model="newBracket.endDate" :placeholder="t('event_elimination.end_date', 'Tanggal Selesai')" />
                    <BaseTimePicker v-model="newBracket.endTime" placeholder="17:00" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Modal Footer (Matching Create Session footer) -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-3xl">
            <BaseButton variant="white" class="h-10 px-5 text-xs font-bold border-slate-200"
              @click="showCreateDialog = false; resetForm()">
              {{ t('event_elimination.cancel', 'Batal') }}
            </BaseButton>
            <BaseButton
              :disabled="(!isEditing && bracketSizeDropdownOptions.length === 0) || !newBracket.categoryId || creatingBracket"
              :loading="creatingBracket" variant="primary"
              class="h-10 px-6 text-xs font-bold shadow-md shadow-primary/20"
              @click="handleCreateOrUpdate">
              <span>{{ submitButtonLabel }}</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useI18n } from 'vue-i18n'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

useHead({
  title: computed(() => `${t('event_elimination.title')} - Dashboard`)
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

const editBracketId = ref(null)
const isEditing = computed(() => !!editBracketId.value)
const modalTitle = computed(() => isEditing.value ? (t('event_elimination.edit_bracket') || 'Edit Bracket') : t('event_elimination.create_bracket'))
const submitButtonLabel = computed(() => {
  if (creatingBracket.value) return isEditing.value ? (t('event_elimination.updating') || 'Updating...') : (t('event_elimination.creating') || 'Creating...')
  return isEditing.value ? (t('event_elimination.save_update') || 'Save Update') : t('event_elimination.create_bracket')
})

const configuredCategoriesCount = computed(() => {
  const ids = new Set(brackets.value.map(b => b.category_id).filter(Boolean))
  return ids.size
})

const coverageRate = computed(() => {
  if (!categories.value.length) return 0
  return Math.min(100, Math.round((configuredCategoriesCount.value / categories.value.length) * 100))
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
    const response = await get(`/tournaments/${eventId.value}/elimination/bracket-size`, {
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
    const response = await get(`/tournaments/${id}`)
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
    const response = await get(`/tournaments/${id}/elimination/brackets`)
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
    const response = await get(`/tournaments/${id}/categories`, { params: { limit: 1000 } })
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
    const response = await put(`/tournaments/${eventId.value}/elimination/brackets/${editBracketId.value}`, payload)

    toast.success(t('event_elimination.toast_bracket_updated'))
    showCreateDialog.value = false
    resetForm()
    await fetchBrackets()
  } catch (error) {
    console.error('Failed to update bracket:', error)
    const data = error?.data || error?.response?.data
    const msg = data?.error || t('event_elimination.toast_bracket_update_failed')
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
    toast.warning(t('event_elimination.toast_select_category_first'))
    return
  }
  if (bracketSizeDropdownOptions.value.length === 0) {
    toast.warning(t('event_elimination.toast_no_participants_category'))
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
    const response = await post(`/tournaments/${eventId.value}/elimination/brackets`, payload)

    if (response?.bracket?.id || response?.id) {
      toast.success(t('event_elimination.toast_bracket_created'))
      showCreateDialog.value = false
      resetForm()
      await fetchBrackets()
    } else {
      toast.error(t('event_elimination.toast_bracket_create_failed'))
    }
  } catch (error) {
    console.error('Failed to create bracket:', error)
    const data = error?.data || error?.response?.data
    let msg = data?.error || t('event_elimination.toast_bracket_create_failed')
    if (data?.participant_count != null && data?.required != null) {
      msg = `${data.error} (${t('event_elimination.available')} ${data.participant_count}, ${t('event_elimination.required_count')} ${data.required})`
    }
    toast.error(msg)
  } finally {
    creatingBracket.value = false
  }
}

const bracketTypes = computed(() => [
  { value: 'individual', title: computed(() => t('event_detail.individual')) || 'Perorangan', icon: 'ph:user' },
  { value: 'team3', title: computed(() => t('event_detail.team3')) || 'Tim 3 Orang', icon: 'ph:users-three' },
  { value: 'mixed2', title: computed(() => t('event_detail.mixed2')) || 'Tim Campuran 2 Orang', icon: 'ph:gender-intersex' }
])

const availableBracketTypes = computed(() => {
  const selectedCat = categories.value.find(c => c.id === newBracket.value.categoryId)
  if (!selectedCat) return bracketTypes.value

  const eventType = (selectedCat.event_type_name || '').toLowerCase()

  if (eventType === 'individual') {
    return bracketTypes.value.filter(t => t.value === 'individual')
  } else if (eventType.includes('team') || eventType.includes('berregu') || eventType.includes('campuran') || eventType.includes('mixed')) {
    return bracketTypes.value.filter(t => t.value !== 'individual')
  }

  return bracketTypes.value
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
      return { text: t('event_elimination.hint_team_potential', { count, byes }), isEstimate: true }
    }
    return { text: t('event_elimination.hint_peserta_bye', { count, byes }), isEstimate: false }
  } else {
    // bracket smaller than count: only top N qualify
    const label = isTeam ? t('event_elimination.team') : t('event_elimination.participant')
    if (isTeam && synced === 0 && possible > 0) {
      return { text: t('event_elimination.hint_top_potential', { size, count, label }), isEstimate: true }
    }
    return { text: t('event_elimination.hint_top_ranking', { size, count, label }), isEstimate: false }
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
    individual: t('event_detail.individual') || 'Perorangan',
    team3: t('event_detail.team3') || 'Tim 3 Orang',
    mixed2: t('event_detail.mixed2') || 'Tim Campuran 2 Orang'
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
