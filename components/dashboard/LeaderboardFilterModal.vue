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
        @click="closeModal"
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
            class="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl mx-auto relative flex flex-col overflow-hidden"
            style="max-height: 90vh;"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0 bg-white">
              <div class="flex items-center gap-3.5">
                <div class="size-10 rounded-xl bg-slate-100 text-navy flex items-center justify-center border border-slate-200/80 shrink-0">
                  <Icon icon="ph:sliders-horizontal-bold" class="text-xl" />
                </div>
                <div>
                  <div class="text-lg sm:text-xl font-black text-navy tracking-tight">
                    {{ t('leaderboard_page.filter_modal_title') }}
                  </div>
                  <div class="text-xs text-slate-500 font-medium">
                    {{ t('leaderboard_page.filter_modal_subtitle') }}
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
              
              <!-- Section 1: Kategori Lomba -->
              <div v-if="categories.length > 0" class="space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ t('leaderboard_page.filter_category_label') }}
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  <button
                    v-for="cat in categories"
                    :key="cat.value"
                    type="button"
                    @click="draftFilters.categoryId = cat.value"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-between gap-2 cursor-pointer text-left',
                      draftFilters.categoryId === cat.value
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <span class="truncate">{{ cat.title }}</span>
                    <Icon v-if="draftFilters.categoryId === cat.value" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                  </button>
                </div>
              </div>

              <!-- Section 2: Filter Klub / Kontingen (Select Autocomplete) -->
              <div class="pt-5 space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs sm:text-sm font-bold text-navy">
                    {{ t('leaderboard_page.filter_club_label') }}
                  </label>
                  <button
                    v-if="draftFilters.club"
                    type="button"
                    @click="clearClubSelection"
                    class="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    {{ t('common.clear') }}
                  </button>
                </div>

                <div class="relative">
                  <Icon icon="ph:shield-bold" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
                  <input
                    v-model="clubSearchQuery"
                    type="text"
                    @focus="isClubDropdownOpen = true"
                    @input="handleClubInput"
                    :placeholder="t('leaderboard_page.filter_club_placeholder', 'Pilih atau cari klub / kontingen...')"
                    class="w-full pl-9 pr-14 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-navy focus:outline-none focus:border-navy focus:bg-white transition-all cursor-pointer"
                  />
                  <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    <button
                      v-if="draftFilters.club || clubSearchQuery"
                      type="button"
                      @click="clearClubSelection"
                      class="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      <Icon icon="ph:x-circle-fill" class="text-sm" />
                    </button>
                    <button
                      type="button"
                      @click="isClubDropdownOpen = !isClubDropdownOpen"
                      class="text-slate-400 hover:text-navy cursor-pointer p-0.5"
                    >
                      <Icon icon="ph:caret-down-bold" class="text-xs transition-transform" :class="isClubDropdownOpen ? 'rotate-180' : ''" />
                    </button>
                  </div>

                  <!-- Autocomplete Options Dropdown -->
                  <div
                    v-if="isClubDropdownOpen && filteredClubOptions.length > 0"
                    class="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl max-h-48 overflow-y-auto custom-scrollbar p-1.5 space-y-0.5"
                  >
                    <button
                      v-for="club in filteredClubOptions"
                      :key="club"
                      type="button"
                      @click="selectClub(club)"
                      class="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
                      :class="draftFilters.club === club ? 'bg-primary/20 text-navy font-black' : 'text-slate-700 hover:bg-slate-100 hover:text-navy'"
                    >
                      <div class="flex items-center gap-2 truncate">
                        <Icon icon="ph:shield-star-bold" class="text-sm text-slate-400 shrink-0" />
                        <span class="truncate">{{ club }}</span>
                      </div>
                      <Icon v-if="draftFilters.club === club" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Section 3: Status Kelolosan / Limit Peringkat -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ t('leaderboard_page.filter_scope_label') }}
                </label>
                <div class="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    @click="draftFilters.scope = 'all'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.scope === 'all'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.scope === 'all'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('leaderboard_page.rank_all') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.scope = 'top8'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.scope === 'top8'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.scope === 'top8'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('leaderboard_page.rank_top8') }}</span>
                  </button>

                  <button
                    type="button"
                    @click="draftFilters.scope = 'top16'"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.scope === 'top16'
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.scope === 'top16'" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ t('leaderboard_page.rank_top16') }}</span>
                  </button>
                </div>
              </div>

            </div>

            <!-- Footer Actions -->
            <div class="p-4 sm:p-5 bg-gray-50/50 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                @click="resetDraftFilters"
                class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-navy text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Icon icon="ph:arrow-counter-clockwise-bold" class="text-sm" />
                <span>{{ t('common.reset_all') }}</span>
              </button>

              <div class="flex items-center gap-2.5 w-full sm:w-auto">
                <BaseButton
                  variant="white"
                  @click="closeModal"
                  class="flex-1 sm:flex-none font-bold text-xs sm:text-sm h-10 px-5"
                >
                  {{ t('common.cancel') }}
                </BaseButton>

                <BaseButton
                  variant="primary"
                  icon="ph:funnel-bold"
                  @click="applyFilters"
                  class="flex-1 sm:flex-none font-black text-xs sm:text-sm h-10 px-6 shadow-md shadow-primary/20"
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

const { t } = useI18n()

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  categories: {
    type: Array,
    default: () => []
  },
  clubs: {
    type: Array,
    default: () => []
  },
  currentFilters: {
    type: Object,
    default: () => ({
      categoryId: '',
      club: '',
      scope: 'all'
    })
  }
})

const emit = defineEmits(['update:show', 'apply', 'reset'])

const draftFilters = ref({
  categoryId: '',
  club: '',
  scope: 'all'
})

const isClubDropdownOpen = ref(false)
const clubSearchQuery = ref('')

const uniqueClubList = computed(() => {
  const set = new Set()
  for (const c of props.clubs || []) {
    if (typeof c === 'string' && c.trim()) set.add(c.trim())
    else if (c && typeof c === 'object' && (c.name || c.club_name)) set.add((c.name || c.club_name).trim())
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const filteredClubOptions = computed(() => {
  const q = clubSearchQuery.value.toLowerCase().trim()
  if (!q) return uniqueClubList.value
  return uniqueClubList.value.filter(c => c.toLowerCase().includes(q))
})

const selectClub = (club) => {
  draftFilters.value.club = club
  clubSearchQuery.value = club
  isClubDropdownOpen.value = false
}

const clearClubSelection = () => {
  draftFilters.value.club = ''
  clubSearchQuery.value = ''
  isClubDropdownOpen.value = false
}

const handleClubInput = () => {
  draftFilters.value.club = clubSearchQuery.value
  isClubDropdownOpen.value = true
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      draftFilters.value = {
        categoryId: props.currentFilters.categoryId || (props.categories[0]?.value || ''),
        club: props.currentFilters.club || '',
        scope: props.currentFilters.scope || 'all'
      }
      clubSearchQuery.value = props.currentFilters.club || ''
      isClubDropdownOpen.value = false
    }
  },
  { immediate: true }
)

const draftActiveFilterCount = computed(() => {
  let count = 0
  if (draftFilters.value.club && draftFilters.value.club.trim() !== '') count++
  if (draftFilters.value.scope && draftFilters.value.scope !== 'all') count++
  return count
})

const resetDraftFilters = () => {
  draftFilters.value = {
    categoryId: props.categories[0]?.value || '',
    club: '',
    scope: 'all'
  }
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
