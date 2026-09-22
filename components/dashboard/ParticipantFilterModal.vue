<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-[200] overflow-y-auto bg-navy/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="show"
            class="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl mx-auto relative flex flex-col overflow-hidden"
            style="max-height: 90vh;"
            @click.stop
          >
            <!-- Header (Standard White Header with Title Case) -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-white">
              <div class="flex items-center gap-3.5">
                <div class="size-10 rounded-xl bg-slate-100 text-navy flex items-center justify-center border border-slate-200/80 shrink-0">
                  <Icon icon="ph:sliders-horizontal-bold" class="text-xl" />
                </div>
                <div>
                  <h2 class="text-lg sm:text-xl font-black text-navy tracking-tight">
                    {{ t('dashboard.participants_list.filter_modal.title') }}
                  </h2>
                  <div class="text-xs text-slate-500 font-medium">
                    {{ t('dashboard.participants_list.filter_modal.subtitle') }}
                  </div>
                </div>
              </div>
              <button
                type="button"
                @click="closeModal"
                class="size-8 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Icon icon="ph:x-bold" class="text-base" />
              </button>
            </div>

            <!-- Scrollable Content -->
            <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 divide-y divide-slate-100" style="max-height: calc(90vh - 140px);">
              
              <!-- Section 1: Status Pembayaran -->
              <div class="space-y-3">
                <label class="block text-xs font-bold text-navy">
                  {{ t('dashboard.participants_list.filter_modal.payment_status') }}
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    @click="draftFilters.status = 'Semua'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.status === 'Semua'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.status === 'Semua'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('common.all') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.status = 'paid'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.status === 'paid'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.status === 'paid'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('dashboard.participants_list.filter_modal.status_paid') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.status = 'pending'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.status === 'pending'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.status === 'pending'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('dashboard.participants_list.filter_modal.status_pending') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.status = 'unpaid'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.status === 'unpaid'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.status === 'unpaid'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ isEn ? 'Unpaid' : 'Belum Bayar' }}</span>
                  </button>
                </div>
              </div>

              <!-- Section 2: Status Daftar Ulang (Reregistration) -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs font-bold text-navy">
                  {{ t('dashboard.participants_list.filter_modal.reregistration_status') }}
                </label>
                <div class="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    @click="draftFilters.reregistration = 'Semua'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.reregistration === 'Semua'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.reregistration === 'Semua'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('common.all') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.reregistration = 'reregistered'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.reregistration === 'reregistered'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.reregistration === 'reregistered'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('dashboard.participants_list.filter_modal.already_reregistered') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.reregistration = 'not_reregistered'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.reregistration === 'not_reregistered'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.reregistration === 'not_reregistered'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('dashboard.participants_list.filter_modal.not_yet_reregistered') }}</span>
                  </button>
                </div>
              </div>

              <!-- Section 3: Jenis Kelamin (Gender) -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs font-bold text-navy">
                  {{ t('dashboard.participants_list.filter_modal.gender') }}
                </label>
                <div class="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    @click="draftFilters.gender = 'Semua'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.gender === 'Semua'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.gender === 'Semua'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('common.all') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.gender = 'male'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.gender === 'male'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.gender === 'male'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('dashboard.participants_list.filter_modal.gender_male') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.gender = 'female'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.gender === 'female'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.gender === 'female'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('dashboard.participants_list.filter_modal.gender_female') }}</span>
                  </button>
                </div>
              </div>

              <!-- Section 4: Divisi Busur (Bow Division) -->
              <div v-if="divisionOptions.length > 0" class="pt-5 space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-navy">
                    {{ t('dashboard.participants_list.filter_modal.bow_division') }}
                  </label>
                  <button
                    v-if="draftFilters.divisions.length > 0"
                    type="button"
                    @click="draftFilters.divisions = []"
                    class="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    {{ t('common.clear') }}
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="divName in divisionOptions"
                    :key="divName"
                    type="button"
                    @click="toggleDivision(divName)"
                    :class="[
                      'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5',
                      draftFilters.divisions.includes(divName)
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon
                      :icon="draftFilters.divisions.includes(divName) ? 'ph:check-bold' : 'ph:plus-bold'"
                      class="text-xs"
                    />
                    <span>{{ divName }}</span>
                  </button>
                </div>
              </div>

              <!-- Section 5: Kelompok Usia (Age Group) -->
              <div v-if="ageGroupOptions.length > 0" class="pt-5 space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-navy">
                    {{ t('dashboard.participants_list.filter_modal.age_group') }}
                  </label>
                  <button
                    v-if="draftFilters.ageGroups.length > 0"
                    type="button"
                    @click="draftFilters.ageGroups = []"
                    class="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    {{ t('common.clear') }}
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="ageName in ageGroupOptions"
                    :key="ageName"
                    type="button"
                    @click="toggleAgeGroup(ageName)"
                    :class="[
                      'px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5',
                      draftFilters.ageGroups.includes(ageName)
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon
                      :icon="draftFilters.ageGroups.includes(ageName) ? 'ph:check-bold' : 'ph:plus-bold'"
                      class="text-xs"
                    />
                    <span>{{ ageName }}</span>
                  </button>
                </div>
              </div>

              <!-- Section 6: Kategori Turnamen Spesifik -->
              <div class="pt-5 space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-navy">
                    {{ t('dashboard.participants_list.filter_modal.specific_category') }}
                  </label>
                  <button
                    v-if="draftFilters.categoryIds.length > 0"
                    type="button"
                    @click="draftFilters.categoryIds = []"
                    class="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    {{ t('common.clear') }} ({{ draftFilters.categoryIds.length }})
                  </button>
                </div>

                <!-- Search inside category options -->
                <div v-if="categoryListOptions.length > 5" class="relative">
                  <Icon icon="ph:magnifying-glass" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    v-model="categorySearchText"
                    type="text"
                    :placeholder="t('dashboard.participants_list.filter_modal.search_category')"
                    class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-navy transition-all"
                  />
                </div>

                <div class="max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-2xl p-2 bg-slate-50/50 custom-scrollbar">
                  <label
                    v-for="cat in filteredCategoryListOptions"
                    :key="cat.value"
                    class="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer text-xs font-bold text-navy select-none"
                  >
                    <input
                      type="checkbox"
                      :value="cat.value"
                      v-model="draftFilters.categoryIds"
                      class="size-4 rounded text-navy accent-navy focus:ring-navy cursor-pointer"
                    />
                    <span class="flex-1 truncate">{{ cat.title }}</span>
                  </label>
                  <div
                    v-if="filteredCategoryListOptions.length === 0"
                    class="p-4 text-center text-xs text-slate-400 font-medium"
                  >
                    {{ t('dashboard.participants_list.filter_modal.no_category_found') }}
                  </div>
                </div>
              </div>

              <!-- Section 7: Filter Berdasarkan Klub / Kontingen -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs font-bold text-navy">
                  {{ t('dashboard.participants_list.filter_modal.club_filter') }}
                </label>
                <div class="relative">
                  <Icon icon="ph:shield-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    v-model="draftFilters.club"
                    type="text"
                    :placeholder="t('dashboard.participants_list.filter_modal.club_placeholder')"
                    class="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-navy focus:outline-none focus:border-navy focus:bg-white transition-all"
                  />
                  <button
                    v-if="draftFilters.club"
                    type="button"
                    @click="draftFilters.club = ''"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <Icon icon="ph:x-circle-fill" class="text-sm" />
                  </button>
                </div>
              </div>

            </div>

            <!-- Footer Actions -->
            <div class="p-4 sm:p-5 bg-gray-50/50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                @click="resetDraftFilters"
                class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-navy text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Icon icon="ph:arrow-counter-clockwise-bold" class="text-sm" />
                <span>{{ t('common.reset_all') }}</span>
              </button>

              <div class="flex items-center gap-2.5 w-full sm:w-auto">
                <BaseButton
                  variant="white"
                  @click="closeModal"
                  class="flex-1 sm:flex-none font-bold text-xs h-10 px-5"
                >
                  {{ t('common.cancel') }}
                </BaseButton>

                <BaseButton
                  variant="primary"
                  icon="ph:funnel-bold"
                  @click="applyFilters"
                  class="flex-1 sm:flex-none font-black text-xs h-10 px-6 shadow-md shadow-primary/20"
                >
                  {{ t('common.apply_filters') }}
                  <span v-if="draftActiveFilterCount > 0" class="ml-1 opacity-90">
                    ({{ draftActiveFilterCount }})
                  </span>
                </BaseButton>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/common/BaseButton.vue'

const { t, locale } = useI18n()
const isEn = computed(() => locale.value !== 'id')

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  currentFilters: {
    type: Object,
    default: () => ({
      status: 'Semua',
      reregistration: 'Semua',
      categoryIds: [],
      divisions: [],
      ageGroups: [],
      gender: 'Semua',
      club: ''
    })
  }
})

const emit = defineEmits(['update:show', 'apply', 'reset'])

// Internal Draft State
const draftFilters = ref({
  status: 'Semua',
  reregistration: 'Semua',
  categoryIds: [],
  divisions: [],
  ageGroups: [],
  gender: 'Semua',
  club: ''
})

const categorySearchText = ref('')

// Initialize draft state whenever modal opens
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      draftFilters.value = {
        status: props.currentFilters.status || 'Semua',
        reregistration: props.currentFilters.reregistration || 'Semua',
        categoryIds: Array.isArray(props.currentFilters.categoryIds) ? [...props.currentFilters.categoryIds] : [],
        divisions: Array.isArray(props.currentFilters.divisions) ? [...props.currentFilters.divisions] : [],
        ageGroups: Array.isArray(props.currentFilters.ageGroups) ? [...props.currentFilters.ageGroups] : [],
        gender: props.currentFilters.gender || 'Semua',
        club: props.currentFilters.club || ''
      }
      categorySearchText.value = ''
    }
  },
  { immediate: true }
)

// Extract distinct divisions from categories or standard list
const divisionOptions = computed(() => {
  const set = new Set()
  props.categories.forEach(c => {
    if (c.division_name) set.add(c.division_name)
  })
  if (set.size === 0) {
    return ['Recurve', 'Compound', 'Barebow', 'Standard Bow', 'Traditional']
  }
  return Array.from(set)
})

// Extract distinct age groups from categories
const ageGroupOptions = computed(() => {
  const set = new Set()
  props.categories.forEach(c => {
    if (c.category_name) set.add(c.category_name)
  })
  return Array.from(set)
})

// Detailed category list options
const categoryListOptions = computed(() => {
  return props.categories.map(c => ({
    title: [
      c.division_name,
      c.category_name,
      c.event_type_name,
      c.gender_division_name
    ].filter(Boolean).join(' - ') || c.name || t('dashboard.participants_list.table.category'),
    value: c.id || c.uuid
  }))
})

// Filtered categories for search
const filteredCategoryListOptions = computed(() => {
  const q = categorySearchText.value.toLowerCase().trim()
  if (!q) return categoryListOptions.value
  return categoryListOptions.value.filter(c => c.title.toLowerCase().includes(q))
})

const toggleDivision = (divName) => {
  const idx = draftFilters.value.divisions.indexOf(divName)
  if (idx > -1) {
    draftFilters.value.divisions.splice(idx, 1)
  } else {
    draftFilters.value.divisions.push(divName)
  }
}

const toggleAgeGroup = (ageName) => {
  const idx = draftFilters.value.ageGroups.indexOf(ageName)
  if (idx > -1) {
    draftFilters.value.ageGroups.splice(idx, 1)
  } else {
    draftFilters.value.ageGroups.push(ageName)
  }
}

// Count active filter criteria in draft
const draftActiveFilterCount = computed(() => {
  let count = 0
  if (draftFilters.value.status && draftFilters.value.status !== 'Semua') count++
  if (draftFilters.value.reregistration && draftFilters.value.reregistration !== 'Semua') count++
  if (draftFilters.value.gender && draftFilters.value.gender !== 'Semua') count++
  if (draftFilters.value.divisions && draftFilters.value.divisions.length > 0) count++
  if (draftFilters.value.ageGroups && draftFilters.value.ageGroups.length > 0) count++
  if (draftFilters.value.categoryIds && draftFilters.value.categoryIds.length > 0) count++
  if (draftFilters.value.club && draftFilters.value.club.trim() !== '') count++
  return count
})

const resetDraftFilters = () => {
  draftFilters.value = {
    status: 'Semua',
    reregistration: 'Semua',
    categoryIds: [],
    divisions: [],
    ageGroups: [],
    gender: 'Semua',
    club: ''
  }
  categorySearchText.value = ''
}

const closeModal = () => {
  emit('update:show', false)
}

const applyFilters = () => {
  emit('apply', { ...draftFilters.value })
  emit('update:show', false)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
