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
                  <h2 class="text-lg sm:text-xl font-black text-navy tracking-tight">
                    {{ t('my_events.filter_modal_title') }}
                  </h2>
                  <div class="text-xs text-slate-500 font-medium">
                    {{ t('my_events.filter_modal_subtitle') }}
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
              
              <!-- Section 1: Status Pendaftaran -->
              <div class="space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ t('my_events.filter_status_label') }}
                </label>
                <div class="grid grid-cols-3 gap-2.5">
                  <button
                    v-for="opt in statusOptions"
                    :key="opt.value"
                    type="button"
                    @click="draftFilters.status = opt.value"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.status === opt.value
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.status === opt.value" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span class="truncate">{{ opt.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Section 2: Jadwal Pelaksanaan (Timeline) -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ t('my_events.filter_timeline_label') }}
                </label>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    v-for="opt in timelineOptions"
                    :key="opt.value"
                    type="button"
                    @click="draftFilters.timeline = opt.value"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.timeline === opt.value
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.timeline === opt.value" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span class="truncate">{{ opt.label }}</span>
                  </button>
                </div>
              </div>

              <!-- Section 3: Urutan Data (Sorting) -->
              <div class="pt-5 space-y-3">
                <label class="block text-xs sm:text-sm font-bold text-navy">
                  {{ t('my_events.filter_sort_label') }}
                </label>
                <div class="grid grid-cols-2 gap-2.5">
                  <button
                    v-for="opt in sortOptions"
                    :key="opt.value"
                    type="button"
                    @click="draftFilters.sort = opt.value"
                    :class="[
                      'py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer',
                      draftFilters.sort === opt.value
                        ? 'bg-white border-navy text-navy font-black shadow-2xs ring-1 ring-navy/20'
                        : 'bg-slate-50 text-slate-700 border-slate-200/90 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    <Icon v-if="draftFilters.sort === opt.value" icon="ph:check-bold" class="text-xs text-navy shrink-0" />
                    <span class="truncate">{{ opt.label }}</span>
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
  currentFilters: {
    type: Object,
    default: () => ({
      status: 'all',
      timeline: 'all',
      sort: 'date_desc'
    })
  }
})

const emit = defineEmits(['update:show', 'apply', 'reset'])

const draftFilters = ref({
  status: 'all',
  timeline: 'all',
  sort: 'date_desc'
})

const statusOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('my_events.opt_registered'), value: 'paid' },
  { label: t('my_events.opt_pending'), value: 'pending' }
])

const timelineOptions = computed(() => [
  { label: t('common.all'), value: 'all' },
  { label: t('my_events.opt_upcoming'), value: 'upcoming' },
  { label: t('my_events.opt_ongoing'), value: 'ongoing' },
  { label: t('my_events.opt_past'), value: 'past' }
])

const sortOptions = computed(() => [
  { label: t('my_events.sort_date_desc'), value: 'date_desc' },
  { label: t('my_events.sort_date_asc'), value: 'date_asc' },
  { label: t('my_events.sort_name_asc'), value: 'name_asc' },
  { label: t('my_events.sort_name_desc'), value: 'name_desc' }
])

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      draftFilters.value = {
        status: props.currentFilters.status || 'all',
        timeline: props.currentFilters.timeline || 'all',
        sort: props.currentFilters.sort || 'date_desc'
      }
    }
  },
  { immediate: true }
)

const draftActiveFilterCount = computed(() => {
  let count = 0
  if (draftFilters.value.status && draftFilters.value.status !== 'all') count++
  if (draftFilters.value.timeline && draftFilters.value.timeline !== 'all') count++
  if (draftFilters.value.sort && draftFilters.value.sort !== 'date_desc') count++
  return count
})

const resetDraftFilters = () => {
  draftFilters.value = {
    status: 'all',
    timeline: 'all',
    sort: 'date_desc'
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
