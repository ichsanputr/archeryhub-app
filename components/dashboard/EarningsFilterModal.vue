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
            class="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg mx-auto relative flex flex-col overflow-hidden"
            style="max-height: 90vh;"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0 bg-white">
              <div class="flex items-center gap-3.5">
                <div class="size-10 rounded-xl bg-slate-100 text-navy flex items-center justify-center border border-slate-200/80 shrink-0">
                  <Icon icon="ph:sliders-horizontal-bold" class="text-xl" />
                </div>
                <div>
                  <div class="text-base sm:text-lg font-bold text-navy">
                    {{ isEn ? 'Filter Tournament Earnings' : 'Filter Pendapatan Turnamen' }}
                  </div>
                  <div class="text-xs text-slate-500 font-medium">
                    {{ isEn ? 'Refine earnings list by date, amount, and participants' : 'Saring daftar pendapatan berdasarkan tanggal, nominal, dan peserta' }}
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
              
              <!-- Section 1: Date Presets -->
              <div class="space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ isEn ? 'Date Range & Period' : 'Periode & Rentang Tanggal' }}
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    v-for="preset in datePresets"
                    :key="preset.value"
                    type="button"
                    @click="applyDatePreset(preset.value)"
                    :class="[
                      'py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                      draftFilters.datePreset === preset.value
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.datePreset === preset.value" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span class="truncate">{{ preset.label }}</span>
                  </button>
                </div>

                <!-- Custom Date Inputs -->
                <div v-if="draftFilters.datePreset === 'custom'" class="grid grid-cols-2 gap-3 pt-2">
                  <div class="space-y-1">
                    <label class="text-[11px] font-bold text-slate-500">{{ isEn ? 'Start Date' : 'Tanggal Mulai' }}</label>
                    <input
                      v-model="draftFilters.startDate"
                      type="date"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[11px] font-bold text-slate-500">{{ isEn ? 'End Date' : 'Tanggal Selesai' }}</label>
                    <input
                      v-model="draftFilters.endDate"
                      type="date"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy"
                    />
                  </div>
                </div>
              </div>

              <!-- Section 2: Amount Range -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ isEn ? 'Revenue Amount Range' : 'Rentang Nominal Pendapatan' }}
                </label>
                <div class="grid grid-cols-2 gap-3">
                  <div class="space-y-1">
                    <label class="text-[11px] font-bold text-slate-500">{{ isEn ? 'Min Amount' : 'Nominal Minimal' }}</label>
                    <input
                      v-model.number="draftFilters.minAmount"
                      type="number"
                      min="0"
                      :placeholder="currencySymbol + ' 0'"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy"
                    />
                  </div>
                  <div class="space-y-1">
                    <label class="text-[11px] font-bold text-slate-500">{{ isEn ? 'Max Amount' : 'Nominal Maksimal' }}</label>
                    <input
                      v-model.number="draftFilters.maxAmount"
                      type="number"
                      min="0"
                      :placeholder="currencySymbol + ' Max'"
                      class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/15 focus:border-navy"
                    />
                  </div>
                </div>
              </div>

              <!-- Section 3: Min Participants -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ isEn ? 'Minimum Participants' : 'Jumlah Minimal Peserta' }}
                </label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="opt in participantOptions"
                    :key="opt.value"
                    type="button"
                    @click="draftFilters.minParticipants = opt.value"
                    :class="[
                      'py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer',
                      draftFilters.minParticipants === opt.value
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.minParticipants === opt.value" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span>{{ opt.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Section 4: Sort Order -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ isEn ? 'Sort Results By' : 'Urutkan Hasil' }}
                </label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    v-for="opt in sortOptions"
                    :key="opt.value"
                    type="button"
                    @click="draftFilters.sortBy = opt.value"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between gap-2 cursor-pointer',
                      draftFilters.sortBy === opt.value
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <div class="flex items-center gap-2">
                      <Icon :icon="opt.icon" class="text-sm text-slate-500" />
                      <span>{{ opt.label }}</span>
                    </div>
                    <Icon v-if="draftFilters.sortBy === opt.value" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                  </button>
                </div>
              </div>

            </div>

            <!-- Footer Actions -->
            <div class="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                @click="handleReset"
                class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <Icon icon="ph:arrow-counter-clockwise-bold" class="text-sm" />
                <span>{{ isEn ? 'Reset All' : 'Reset Semua' }}</span>
              </button>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="closeModal"
                  class="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-navy hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                >
                  {{ isEn ? 'Cancel' : 'Batal' }}
                </button>
                <button
                  type="button"
                  @click="handleApply"
                  class="px-5 py-2.5 rounded-xl bg-navy hover:bg-navy-dark text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Icon icon="ph:check-bold" class="text-sm text-primary" />
                  <span>{{ isEn ? 'Apply Filter' : 'Terapkan Filter' }}</span>
                </button>
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
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  currentFilters: {
    type: Object,
    default: () => ({})
  },
  currencySymbol: {
    type: String,
    default: 'Rp'
  }
})

const emit = defineEmits(['update:show', 'apply', 'reset'])

const { locale } = useI18n()
const isEn = computed(() => (locale.value || 'id') === 'en')
const currencySymbol = computed(() => props.currencySymbol || 'Rp')

const defaultFilterState = () => ({
  datePreset: 'all',
  startDate: '',
  endDate: '',
  minAmount: null,
  maxAmount: null,
  minParticipants: null,
  sortBy: 'date_desc'
})

const draftFilters = ref(defaultFilterState())

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      draftFilters.value = {
        ...defaultFilterState(),
        ...(props.currentFilters || {})
      }
    }
  },
  { immediate: true }
)

const datePresets = computed(() => [
  { value: 'all', label: isEn.value ? 'All Time' : 'Semua Waktu' },
  { value: 'this_month', label: isEn.value ? 'This Month' : 'Bulan Ini' },
  { value: 'last_30_days', label: isEn.value ? 'Last 30 Days' : '30 Hari Terakhir' },
  { value: 'this_year', label: isEn.value ? 'This Year' : 'Tahun Ini' },
  { value: 'custom', label: isEn.value ? 'Custom' : 'Kustom' }
])

const applyDatePreset = (preset) => {
  draftFilters.value.datePreset = preset
  const now = new Date()

  if (preset === 'all') {
    draftFilters.value.startDate = ''
    draftFilters.value.endDate = ''
  } else if (preset === 'this_month') {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    draftFilters.value.startDate = firstDay.toISOString().split('T')[0]
    draftFilters.value.endDate = lastDay.toISOString().split('T')[0]
  } else if (preset === 'last_30_days') {
    const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    draftFilters.value.startDate = past30.toISOString().split('T')[0]
    draftFilters.value.endDate = now.toISOString().split('T')[0]
  } else if (preset === 'this_year') {
    const firstDayYear = new Date(now.getFullYear(), 0, 1)
    const lastDayYear = new Date(now.getFullYear(), 11, 31)
    draftFilters.value.startDate = firstDayYear.toISOString().split('T')[0]
    draftFilters.value.endDate = lastDayYear.toISOString().split('T')[0]
  }
}

const participantOptions = computed(() => [
  { value: null, label: isEn.value ? 'All' : 'Semua' },
  { value: 5, label: '≥ 5 ' + (isEn.value ? 'Archers' : 'Pemanah') },
  { value: 10, label: '≥ 10 ' + (isEn.value ? 'Archers' : 'Pemanah') },
  { value: 25, label: '≥ 25 ' + (isEn.value ? 'Archers' : 'Pemanah') },
  { value: 50, label: '≥ 50 ' + (isEn.value ? 'Archers' : 'Pemanah') }
])

const sortOptions = computed(() => [
  { value: 'date_desc', label: isEn.value ? 'Newest Date' : 'Tanggal Terbaru', icon: 'ph:calendar-blank-bold' },
  { value: 'date_asc', label: isEn.value ? 'Oldest Date' : 'Tanggal Terlama', icon: 'ph:calendar-blank-bold' },
  { value: 'amount_desc', label: isEn.value ? 'Highest Revenue' : 'Pendapatan Tertinggi', icon: 'ph:trend-up-bold' },
  { value: 'amount_asc', label: isEn.value ? 'Lowest Revenue' : 'Pendapatan Terendah', icon: 'ph:trend-down-bold' },
  { value: 'participants_desc', label: isEn.value ? 'Most Participants' : 'Peserta Terbanyak', icon: 'ph:users-three-bold' }
])

const closeModal = () => {
  emit('update:show', false)
}

const handleReset = () => {
  draftFilters.value = defaultFilterState()
  emit('reset')
  closeModal()
}

const handleApply = () => {
  emit('apply', { ...draftFilters.value })
  closeModal()
}
</script>
