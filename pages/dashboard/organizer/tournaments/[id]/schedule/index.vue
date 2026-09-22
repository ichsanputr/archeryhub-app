<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_schedule.title')"
      :subtitle="t('event_schedule.subtitle')"
      icon="ph:calendar-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_schedule.title') }
      ]"
    >
      <template #actions>
        <div class="flex gap-3 flex-shrink-0">
          <!-- Add Schedule Item Button -->
          <BaseButton
            variant="primary"
            icon="ph:plus-bold"
            @click="isSubscriptionActive ? openCreateModal() : (showPremiumModal = true)"
            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
            class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-bold"
          >
            <span>{{ t('event_schedule.add_item') }}</span>
          </BaseButton>
        </div>
      </template>
    </DashboardHeader>

    <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

    <!-- Main Schedule Container -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      
      <!-- Day Selection Tabs Toolbar -->
      <div class="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <!-- Day Pills -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto p-1 bg-gray-50 rounded-xl border border-gray-100">
          <button
            v-for="day in days"
            :key="day.day_number"
            type="button"
            @click="selectedDayNumber = day.day_number"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap"
            :class="selectedDayNumber === day.day_number
              ? 'bg-navy text-white shadow-sm'
              : 'text-gray-500 hover:text-navy hover:bg-white/80'"
          >
            <span>{{ t('event_schedule.day_label', { day: day.day_number }, `Day ${day.day_number}`) }}</span>
            <span
              class="text-[11px] px-2 py-0.5 rounded-full font-medium"
              :class="selectedDayNumber === day.day_number ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'"
            >
              {{ day.items ? day.items.length : 0 }}
            </span>
          </button>

          <!-- Add Day Button -->
          <button
            type="button"
            @click="openAddDayModal"
            class="px-3 py-2 text-xs font-bold text-gray-400 hover:text-navy hover:bg-white rounded-lg transition-all flex items-center gap-1 shrink-0"
            :title="t('event_schedule.add_day')"
          >
            <Icon icon="ph:plus-bold" class="text-base" />
            <span class="hidden md:inline">{{ t('event_schedule.add_day') }}</span>
          </button>
        </div>

        <!-- Date Label on Right -->
        <div v-if="currentDay" class="flex items-center gap-1.5 text-xs font-bold text-navy bg-gray-50 px-3.5 py-2 rounded-xl border border-gray-100 shrink-0">
          <Icon icon="ph:calendar-blank-bold" class="text-gray-400 text-sm shrink-0" />
          <span>{{ formatDayDate(currentDay.schedule_date) || t('event_schedule.day_label', { day: currentDay.day_number }, `Day ${currentDay.day_number}`) }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
        <Icon icon="ph:spinner-gap-bold" class="text-4xl animate-spin text-navy" />
        <div class="text-xs font-bold text-navy">{{ t('event_schedule.loading') }}</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!currentDay || !currentDay.items || currentDay.items.length === 0" class="py-16 text-center">
        <div class="size-20 rounded-3xl bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-300">
          <Icon icon="ph:calendar-x-bold" class="text-4xl" />
        </div>
        <h3 class="text-base sm:text-lg font-bold text-navy mb-1">{{ t('event_schedule.empty_day_title') }}</h3>
        <div class="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          {{ t('event_schedule.empty_day_desc') }}
        </div>
      </div>

      <!-- Clean & Perfectly Aligned Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50/50 border-b border-gray-100 select-none">
            <tr class="text-[10px] font-bold text-gray-400 tracking-wider">
              <th class="px-6 py-3.5 w-44 min-w-[150px] cursor-pointer hover:text-navy transition-colors" @click="handleSort('time')">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('event_schedule.time_header') }}</span>
                  <Icon :icon="getSortIcon('time')" class="text-xs shrink-0" :class="sortKey === 'time' ? 'text-navy' : 'text-gray-300'" />
                </div>
              </th>
              <th class="px-6 py-3.5 w-32 min-w-[120px] cursor-pointer hover:text-navy transition-colors" @click="handleSort('type')">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('event_schedule.session_type_label') }}</span>
                  <Icon :icon="getSortIcon('type')" class="text-xs shrink-0" :class="sortKey === 'type' ? 'text-navy' : 'text-gray-300'" />
                </div>
              </th>
              <th class="px-6 py-3.5 min-w-[260px] cursor-pointer hover:text-navy transition-colors" @click="handleSort('title')">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('event_schedule.title_label') }}</span>
                  <Icon :icon="getSortIcon('title')" class="text-xs shrink-0" :class="sortKey === 'title' ? 'text-navy' : 'text-gray-300'" />
                </div>
              </th>
              <th class="px-6 py-3.5 w-36 min-w-[130px] cursor-pointer hover:text-navy transition-colors" @click="handleSort('target')">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('event_schedule.target_start_label') }}</span>
                  <Icon :icon="getSortIcon('target')" class="text-xs shrink-0" :class="sortKey === 'target' ? 'text-navy' : 'text-gray-300'" />
                </div>
              </th>
              <th class="px-6 py-3.5 w-40 min-w-[140px] cursor-pointer hover:text-navy transition-colors" @click="handleSort('location')">
                <div class="flex items-center gap-1.5">
                  <span>{{ t('event_schedule.location_label') }}</span>
                  <Icon :icon="getSortIcon('location')" class="text-xs shrink-0" :class="sortKey === 'location' ? 'text-navy' : 'text-gray-300'" />
                </div>
              </th>
              <th class="px-6 py-3.5 text-right w-24">{{ t('common.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr
              v-for="(item, idx) in sortedItems"
              :key="item.uuid || idx"
              class="group hover:bg-gray-50/50 transition-colors"
            >
              <!-- Time Column -->
              <td class="px-6 py-4 align-middle whitespace-nowrap">
                <div class="font-mono font-bold text-navy text-sm flex items-center gap-2">
                  <span>{{ formatTime(item.start_time) }} – {{ formatTime(item.end_time) }}</span>
                  <span
                    v-if="isParallelItem(item)"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80"
                    :title="t('event_schedule.badge_parallel')"
                  >
                    <Icon icon="ph:arrows-split-bold" class="text-xs shrink-0" />
                    <span>{{ t('event_schedule.badge_parallel') }}</span>
                  </span>
                </div>
              </td>

              <!-- Type Badge Column -->
              <td class="px-6 py-4 align-middle whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                  :class="getItemTypeBadgeClass(item.item_type)"
                >
                  <Icon :icon="getItemTypeIcon(item.item_type)" class="text-sm shrink-0" />
                  <span>{{ getItemTypeLabel(item.item_type) }}</span>
                </span>
              </td>

              <!-- Title & Subtitle Column -->
              <td class="px-6 py-4 align-middle min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-navy text-sm line-clamp-1">
                    {{ item.title || t('common.not_yet') }}
                  </span>
                  <span
                    v-if="getSessionCode(item)"
                    class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 shrink-0 font-mono"
                  >
                    {{ getSessionCode(item) }}
                  </span>
                </div>
                <div v-if="getSubtitleText(item)" class="text-xs text-gray-500 line-clamp-1 mt-0.5">
                  {{ getSubtitleText(item) }}
                </div>
              </td>

              <!-- Target Range Column -->
              <td class="px-6 py-4 align-middle whitespace-nowrap">
                <div v-if="formatTarget(item)"
                  class="text-xs font-semibold text-navy flex items-center gap-1.5">
                  <Icon icon="ph:target-bold" class="text-gray-400 text-sm shrink-0" />
                  <span>{{ formatTarget(item) }}</span>
                </div>
                <span v-else class="text-gray-400 font-normal text-xs">{{ t('common.not_yet') }}</span>
              </td>

              <!-- Location Column -->
              <td class="px-6 py-4 align-middle whitespace-nowrap">
                <div v-if="getLocationText(item)"
                  class="text-xs text-gray-600 flex items-center gap-1.5 truncate max-w-[140px]">
                  <Icon icon="ph:map-pin-bold" class="text-gray-400 text-sm shrink-0" />
                  <span class="truncate">{{ getLocationText(item) }}</span>
                </div>
                <span v-else class="text-gray-400 font-normal text-xs">{{ t('common.not_yet') }}</span>
              </td>

              <!-- Actions Column -->
              <td class="px-6 py-4 align-middle text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-1.5">
                  <BaseButton
                    variant="white"
                    size="sm"
                    icon="ph:pencil"
                    @click="openEditModal(item)"
                    :title="t('event_schedule.edit_modal_title')"
                    class="h-8 w-8 !p-0 flex items-center justify-center rounded-lg"
                  />
                  <BaseButton
                    variant="white"
                    size="sm"
                    icon="ph:trash"
                    @click="confirmDeleteItem(item)"
                    :title="t('event_schedule.confirm_delete_title')"
                    class="h-8 w-8 !p-0 flex items-center justify-center rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <!-- DIALOG: CREATE / EDIT SCHEDULE SESSION (Standardized BaseDialogForm) -->
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <BaseDialogForm v-model="showItemModal" @close="showItemModal = false">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="size-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy shrink-0">
            <Icon :icon="editingItem ? 'ph:pencil-simple-bold' : 'ph:calendar-plus-bold'" class="text-xl" />
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-navy">
              {{ editingItem ? t('event_schedule.edit_modal_title') : t('event_schedule.create_modal_title') }}
            </h2>
            <div class="text-xs text-gray-400 font-medium mt-0.5">
              {{ t('event_schedule.modal_desc') }}
            </div>
          </div>
        </div>
      </template>

      <form @submit.prevent="submitItemForm" id="scheduleItemForm" class="space-y-6">
        
        <!-- Execution Date -->
        <div>
          <label class="text-xs font-bold text-gray-700 block mb-2">
            {{ t('event_schedule.schedule_date_label') }} <span class="text-red-500">*</span>
          </label>
          <BaseDatePicker
            v-model="itemForm.schedule_date"
            :min-date="tournamentStartDate"
            :max-date="tournamentEndDate"
            :placeholder="t('event_schedule.schedule_date_label')"
          />
        </div>

        <!-- Session Type Selector -->
        <div>
          <label class="text-xs font-bold text-gray-700 block mb-2">
            {{ t('event_schedule.session_type_label') }} <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <button
              v-for="typ in itemTypeOptions"
              :key="typ.value"
              type="button"
              @click="itemForm.item_type = typ.value"
              class="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl border-2 text-xs font-bold transition-all"
              :class="itemForm.item_type === typ.value
                ? 'border-navy bg-navy/5 text-navy shadow-sm'
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50'"
            >
              <Icon :icon="typ.icon" class="text-2xl" />
              <span class="text-center leading-tight">{{ typ.label }}</span>
            </button>
          </div>
        </div>

        <!-- Title & Subtitle -->
        <div>
          <label class="text-xs font-bold text-gray-700 block mb-2">
            {{ t('event_schedule.title_label') }} <span class="text-red-500">*</span>
          </label>
          <input
            v-model="itemForm.title"
            type="text"
            required
            :placeholder="t('event_schedule.title_placeholder')"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <div>
          <label class="text-xs font-bold text-gray-700 block mb-2">
            {{ t('event_schedule.subtitle_label') }}
          </label>
          <input
            v-model="itemForm.subtitle"
            type="text"
            :placeholder="t('event_schedule.subtitle_placeholder')"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>

        <!-- Start Time & End Time -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="text-xs font-bold text-gray-700 block mb-2">
              {{ t('event_schedule.start_time_label') }} <span class="text-red-500">*</span>
            </label>
            <BaseTimePicker
              v-model="itemForm.start_time"
              placeholder="08:00"
            />
          </div>
          <div>
            <label class="text-xs font-bold text-gray-700 block mb-2">
              {{ t('event_schedule.end_time_label') }} <span class="text-red-500">*</span>
            </label>
            <BaseTimePicker
              v-model="itemForm.end_time"
              placeholder="09:00"
            />
          </div>
        </div>

        <!-- Elimination Round & Session Code (Only when elimination/finals) -->
        <div v-if="itemForm.item_type === 'elimination' || itemForm.item_type === 'finals'" class="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="text-xs font-bold text-amber-950 block mb-2">
                {{ t('event_schedule.elim_round_label') }} <span class="text-red-500">*</span>
              </label>
              <BaseSelect
                v-model="itemForm.elim_round"
                :items="elimRoundOptions"
                :placeholder="t('event_schedule.select_elim_round')"
                clearable
                :searchable="false"
              />
            </div>
            <div>
              <label class="text-xs font-bold text-amber-950 block mb-2">
                {{ t('event_schedule.session_code_label') }}
              </label>
              <input
                v-model="itemForm.session_code"
                type="text"
                placeholder="E1, F1, EF"
                class="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>
          </div>
          <div class="text-[11px] text-amber-800 font-medium flex items-center gap-1">
            <Icon icon="ph:info-bold" class="text-xs shrink-0" />
            <span>{{ t('event_schedule.elim_round_hint') }}</span>
          </div>
        </div>

        <!-- Location / Field (Dedicated 1-Row Textarea) -->
        <div>
          <label class="text-xs font-bold text-gray-700 block mb-2">
            {{ t('event_schedule.location_label') }}
          </label>
          <textarea
            v-model="itemForm.location"
            rows="2"
            :placeholder="t('event_schedule.location_placeholder')"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
          ></textarea>
        </div>

        <!-- Description / Notes (1-Row Textarea) -->
        <div>
          <label class="text-xs font-bold text-gray-700 block mb-2">
            {{ t('event_schedule.description_label') }}
          </label>
          <textarea
            v-model="itemForm.description"
            rows="2"
            :placeholder="t('event_schedule.description_placeholder')"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none transition-all"
          ></textarea>
        </div>

      </form>

      <template #action>
        <BaseButton variant="white" @click="showItemModal = false">
          {{ t('common.cancel') }}
        </BaseButton>
        <BaseButton
          type="submit"
          form="scheduleItemForm"
          :loading="savingItem"
          variant="primary"
        >
          {{ editingItem ? t('common.save_changes') : t('event_schedule.add_item') }}
        </BaseButton>
      </template>
    </BaseDialogForm>

    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <!-- DIALOG: DELETE CONFIRMATION (Standardized BaseDialogForm) -->
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <BaseDialogForm v-model="showDeleteModal" @close="showDeleteModal = false">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <Icon icon="ph:trash-bold" class="text-xl text-red-600" />
          </div>
          <h2 class="text-lg sm:text-xl font-bold text-navy">
            {{ t('event_schedule.confirm_delete_title') }}
          </h2>
        </div>
      </template>

      <div class="space-y-4 py-2">
        <div class="text-sm text-gray-500 leading-relaxed">
          {{ t('event_schedule.confirm_delete_desc') }}
        </div>
        <div v-if="itemToDelete" class="p-4 rounded-xl bg-gray-50 border border-gray-100">
          <div class="font-bold text-navy text-sm">{{ itemToDelete.title }}</div>
          <div class="text-xs text-gray-400 font-mono mt-1">
            {{ formatTime(itemToDelete.start_time) }} – {{ formatTime(itemToDelete.end_time) }}
          </div>
        </div>
      </div>

      <template #action>
        <BaseButton variant="white" @click="showDeleteModal = false">
          {{ t('common.cancel') }}
        </BaseButton>
        <BaseButton
          variant="danger"
          @click="executeDeleteItem"
          :loading="deleting"
        >
          {{ t('common.delete') }}
        </BaseButton>
      </template>
    </BaseDialogForm>

    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <!-- DIALOG: SCHEDULE OVERLAP / PARALLEL CONFIRMATION -->
    <!-- ───────────────────────────────────────────────────────────────────────────── -->
    <BaseDialogForm v-model="showConflictModal" @close="showConflictModal = false">
      <template #header>
        <div class="flex items-center gap-3">
          <div class="size-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <Icon icon="ph:warning-circle-bold" class="text-xl text-amber-600" />
          </div>
          <div>
            <h2 class="text-lg sm:text-xl font-bold text-navy">
              {{ t('event_schedule.conflict_modal_title') }}
            </h2>
          </div>
        </div>
      </template>

      <div class="space-y-4 py-2">
        <div class="text-xs sm:text-sm text-gray-600 leading-relaxed">
          {{ t('event_schedule.conflict_modal_desc') }}
        </div>

        <div class="space-y-2">
          <div class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            {{ t('event_schedule.conflict_existing_label') }}
          </div>
          <div
            v-for="conf in conflictingItems"
            :key="conf.uuid"
            class="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-start justify-between gap-3 text-xs"
          >
            <div>
              <div class="font-bold text-navy">{{ conf.title }}</div>
              <div v-if="conf.location" class="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                <Icon icon="ph:map-pin-bold" class="size-3 text-gray-400" />
                <span>{{ conf.location }}</span>
              </div>
            </div>
            <div class="font-mono font-bold text-amber-800 shrink-0 bg-amber-100/80 px-2 py-0.5 rounded text-[11px]">
              {{ formatTime(conf.start_time) }} – {{ formatTime(conf.end_time) }}
            </div>
          </div>
        </div>

        <div class="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500">
          <strong>Sesi yang akan disimpan:</strong>
          <div class="font-bold text-navy mt-0.5">{{ itemForm.title }} ({{ itemForm.start_time }} – {{ itemForm.end_time }})</div>
        </div>
      </div>

      <template #action>
        <BaseButton variant="white" @click="showConflictModal = false">
          {{ t('event_schedule.btn_cancel_adjust') }}
        </BaseButton>
        <BaseButton
          variant="primary"
          @click="executeSaveItem"
          :loading="savingItem"
        >
          {{ t('event_schedule.btn_confirm_parallel') }}
        </BaseButton>
      </template>
    </BaseDialogForm>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import BaseDatePicker from '~/components/common/BaseDatePicker.vue'
import BaseTimePicker from '~/components/common/BaseTimePicker.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'

const { t, locale } = useDashboardI18n()
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

const route = useRoute()
const eventId = route.params.id
const { get, post, delete: deleteApi } = useApi()
const toast = useToast()

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => `${t('event_schedule.title')} - Archeris Dashboard`)
})

// State
const loading = ref(true)
const days = ref([])
const selectedDayNumber = ref(1)
const tournamentInfo = ref(null)

const tournamentStartDate = computed(() => {
  const d = tournamentInfo.value?.start_date || tournamentInfo.value?.date || ''
  return d ? d.substring(0, 10) : ''
})

const tournamentEndDate = computed(() => {
  const d = tournamentInfo.value?.end_date || tournamentInfo.value?.start_date || tournamentInfo.value?.date || ''
  return d ? d.substring(0, 10) : ''
})

const fetchTournamentInfo = async () => {
  try {
    const res = await get(`/tournaments/${eventId}`)
    tournamentInfo.value = res?.data || res
  } catch (err) {
    console.error('Failed to fetch tournament info:', err)
  }
}

// Sorting state
const sortKey = ref('time')
const sortOrder = ref('asc')

const handleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const getSortIcon = (key) => {
  if (sortKey.value !== key) return 'ph:arrows-down-up-bold'
  return sortOrder.value === 'asc' ? 'ph:sort-ascending-bold' : 'ph:sort-descending-bold'
}

// Modal states
const showItemModal = ref(false)
const showDeleteModal = ref(false)
const showConflictModal = ref(false)
const conflictingItems = ref([])

const savingItem = ref(false)
const deleting = ref(false)

const editingItem = ref(null)
const itemToDelete = ref(null)

// Form state
const defaultItemForm = () => ({
  uuid: '',
  day_number: selectedDayNumber.value || 1,
  schedule_date: '',
  item_type: 'general',
  start_time: '08:00',
  end_time: '09:00',
  title: '',
  subtitle: '',
  description: '',
  location: '',
  session_code: '',
  elim_round: null,
  target_start: null,
  target_end: null,
  sort_order: 1
})
const itemForm = ref(defaultItemForm())

const itemTypeOptions = computed(() => [
  { value: 'general', label: t('event_schedule.type_general'), icon: 'ph:info-bold' },
  { value: 'qualification', label: t('event_schedule.type_qualification'), icon: 'ph:target-bold' },
  { value: 'elimination', label: t('event_schedule.type_elimination'), icon: 'ph:tree-structure-bold' },
  { value: 'finals', label: t('event_schedule.type_finals'), icon: 'ph:trophy-bold' },
  { value: 'break', label: t('event_schedule.type_break'), icon: 'ph:coffee-bold' }
])

const elimRoundOptions = computed(() => [
  { value: 32, label: locale.value === 'id' ? 'Babak 1/32' : '1/32 Elimination Round' },
  { value: 16, label: locale.value === 'id' ? 'Babak 1/16' : '1/16 Elimination Round' },
  { value: 8, label: locale.value === 'id' ? 'Babak 1/8' : '1/8 Elimination Round' },
  { value: 4, label: locale.value === 'id' ? 'Babak 1/4 (Perempat Final)' : '1/4 Round (Quarterfinals)' },
  { value: 2, label: locale.value === 'id' ? 'Babak 1/2 (Semifinal)' : '1/2 Round (Semifinals)' },
  { value: 1, label: locale.value === 'id' ? 'Babak Final & Perebutan Medali' : 'Finals & Medal Matches' }
])

// Computed Properties
const currentDay = computed(() => {
  if (!days.value || days.value.length === 0) return null
  return days.value.find(d => d.day_number === selectedDayNumber.value) || days.value[0]
})

const sortedItems = computed(() => {
  if (!currentDay.value || !currentDay.value.items) return []
  const items = [...currentDay.value.items]

  return items.sort((a, b) => {
    let aVal = ''
    let bVal = ''

    switch (sortKey.value) {
      case 'time':
        aVal = a.start_time || ''
        bVal = b.start_time || ''
        break
      case 'type':
        aVal = a.item_type || ''
        bVal = b.item_type || ''
        break
      case 'title':
        aVal = (a.title || '').toLowerCase()
        bVal = (b.title || '').toLowerCase()
        break
      case 'target': {
        const aStart = a.target_start?.Valid ? a.target_start.Int64 : (typeof a.target_start === 'number' && a.target_start > 0 ? a.target_start : 999999)
        const bStart = b.target_start?.Valid ? b.target_start.Int64 : (typeof b.target_start === 'number' && b.target_start > 0 ? b.target_start : 999999)
        return sortOrder.value === 'asc' ? aStart - bStart : bStart - aStart
      }
      case 'location':
        aVal = (a.location?.Valid ? a.location.String : (a.location || '')).toLowerCase()
        bVal = (b.location?.Valid ? b.location.String : (b.location || '')).toLowerCase()
        break
      default:
        aVal = a.sort_order || 0
        bVal = b.sort_order || 0
        return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
    }

    if (aVal < bVal) return sortOrder.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

// Methods
const fetchScheduleTimeline = async () => {
  loading.value = true
  try {
    const res = await get(`/tournaments/${eventId}/schedule/timeline`)
    if (res && res.days) {
      days.value = res.days
      if (days.value.length > 0) {
        if (!days.value.some(d => d.day_number === selectedDayNumber.value)) {
          selectedDayNumber.value = days.value[0].day_number
        }
      }
    } else {
      days.value = []
    }
  } catch (err) {
    toast.error(err.message || t('event_schedule.err_load_schedule'))
  } finally {
    loading.value = false
  }
}

const openCreateModal = (dayNum) => {
  editingItem.value = null
  itemForm.value = defaultItemForm()
  
  if (dayNum) {
    itemForm.value.day_number = dayNum
    const matchedDay = days.value.find(d => d.day_number === dayNum)
    if (matchedDay && matchedDay.schedule_date) {
      itemForm.value.schedule_date = matchedDay.schedule_date.substring(0, 10)
    } else if (days.value.length > 0) {
      const lastDay = days.value[days.value.length - 1]
      if (lastDay.schedule_date) {
        const d = new Date(lastDay.schedule_date.substring(0, 10) + 'T00:00:00')
        d.setDate(d.getDate() + 1)
        const dayStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        itemForm.value.schedule_date = (!tournamentEndDate.value || dayStr <= tournamentEndDate.value) ? dayStr : (tournamentEndDate.value || dayStr)
      } else {
        itemForm.value.schedule_date = tournamentStartDate.value || ''
      }
    } else {
      itemForm.value.schedule_date = tournamentStartDate.value || ''
    }
  } else {
    if (currentDay.value && currentDay.value.schedule_date) {
      itemForm.value.schedule_date = currentDay.value.schedule_date.substring(0, 10)
      itemForm.value.day_number = currentDay.value.day_number
    } else {
      itemForm.value.schedule_date = tournamentStartDate.value || ''
      itemForm.value.day_number = 1
    }
  }
  showItemModal.value = true
}

const openAddDayModal = () => {
  const nextDay = (days.value.length > 0 ? Math.max(...days.value.map(d => d.day_number)) : 0) + 1
  openCreateModal(nextDay)
}

const openEditModal = (item) => {
  editingItem.value = item
  itemForm.value = {
    uuid: item.uuid,
    day_number: item.day_number,
    schedule_date: item.schedule_date || '',
    item_type: item.item_type || 'general',
    start_time: (item.start_time || '08:00').substring(0, 5),
    end_time: (item.end_time || '09:00').substring(0, 5),
    title: item.title,
    subtitle: item.subtitle?.Valid ? item.subtitle.String : (item.subtitle || ''),
    description: item.description?.Valid ? item.description.String : (item.description || ''),
    location: item.location?.Valid ? item.location.String : (item.location || ''),
    session_code: item.session_code?.Valid ? item.session_code.String : (item.session_code || ''),
    elim_round: item.elim_round?.Valid ? item.elim_round.Int64 : null,
    target_start: item.target_start?.Valid ? item.target_start.Int64 : null,
    target_end: item.target_end?.Valid ? item.target_end.Int64 : null,
    sort_order: item.sort_order || 1
  }
  showItemModal.value = true
}

watch(() => itemForm.value.schedule_date, (newDate) => {
  if (!newDate) return
  const cleanDate = newDate.substring(0, 10)
  const matchedDay = days.value.find(d => d.schedule_date && d.schedule_date.substring(0, 10) === cleanDate)
  if (matchedDay) {
    itemForm.value.day_number = matchedDay.day_number
  } else {
    const existingDates = days.value
      .map(d => d.schedule_date ? d.schedule_date.substring(0, 10) : '')
      .filter(Boolean)
    const allDates = [...new Set([...existingDates, cleanDate])].sort()
    const newPos = allDates.indexOf(cleanDate) + 1
    if (newPos > 0) {
      itemForm.value.day_number = newPos
    }
  }
})

const submitItemForm = async () => {
  // 1. Universal Required Validations
  if (!itemForm.value.schedule_date) {
    toast.error(t('event_schedule.err_date_required'))
    return
  }

  const cleanSchedDate = itemForm.value.schedule_date.substring(0, 10)
  if (tournamentStartDate.value && cleanSchedDate < tournamentStartDate.value) {
    toast.error(t('event_schedule.err_date_min', `Event date cannot be earlier than tournament start date (${tournamentStartDate.value})`))
    return
  }
  if (tournamentEndDate.value && cleanSchedDate > tournamentEndDate.value) {
    toast.error(t('event_schedule.err_date_max', `Event date cannot be later than tournament end date (${tournamentEndDate.value})`))
    return
  }

  if (!itemForm.value.title || !itemForm.value.title.trim()) {
    toast.error(t('event_schedule.err_title_required'))
    return
  }

  if (!itemForm.value.start_time || !itemForm.value.end_time) {
    toast.error(t('event_schedule.err_time_required'))
    return
  }

  if (itemForm.value.end_time <= itemForm.value.start_time) {
    toast.error(t('event_schedule.err_time_order'))
    return
  }

  // 2. Type-Specific Smart Validations
  if (itemForm.value.item_type === 'elimination' || itemForm.value.item_type === 'finals') {
    if (!itemForm.value.elim_round) {
      toast.error(t('event_schedule.err_elim_round_required'))
      return
    }
  }

  // 3. Conflict & Duplicate Detection on the same day
  const targetDate = cleanSchedDate
  const allDayItems = days.value
    .filter(d => {
      const dDate = d.schedule_date ? d.schedule_date.substring(0, 10) : ''
      return (dDate && dDate === targetDate) || (!dDate && d.day_number === itemForm.value.day_number)
    })
    .flatMap(d => d.items || [])

  const newStart = itemForm.value.start_time.substring(0, 5)
  const newEnd = itemForm.value.end_time.substring(0, 5)
  const newTitle = itemForm.value.title.trim().toLowerCase()

  // 3a. Exact Duplicate Check (same title, same time, same day)
  const exactDuplicate = allDayItems.find(other => {
    if (other.uuid === itemForm.value.uuid) return false
    const oStart = (other.start_time || '').substring(0, 5)
    const oEnd = (other.end_time || '').substring(0, 5)
    const oTitle = (other.title || '').trim().toLowerCase()
    return oStart === newStart && oEnd === newEnd && oTitle === newTitle
  })

  if (exactDuplicate) {
    toast.error(t('event_schedule.err_duplicate_item'))
    return
  }

  // 3b. Overlap Check (different title, overlapping time)
  const overlaps = allDayItems.filter(other => {
    if (other.uuid === itemForm.value.uuid) return false
    const oStart = (other.start_time || '').substring(0, 5)
    const oEnd = (other.end_time || '').substring(0, 5)
    return newStart < oEnd && newEnd > oStart
  })

  if (overlaps.length > 0) {
    conflictingItems.value = overlaps
    showConflictModal.value = true
    return
  }

  await executeSaveItem()
}

const executeSaveItem = async () => {
  showConflictModal.value = false
  savingItem.value = true
  const savedDate = itemForm.value.schedule_date ? itemForm.value.schedule_date.substring(0, 10) : ''
  try {
    const payload = {
      ...itemForm.value,
      day_number: itemForm.value.day_number || selectedDayNumber.value || 1,
      start_time: itemForm.value.start_time && itemForm.value.start_time.length === 5 ? itemForm.value.start_time + ':00' : itemForm.value.start_time,
      end_time: itemForm.value.end_time && itemForm.value.end_time.length === 5 ? itemForm.value.end_time + ':00' : itemForm.value.end_time,
      target_start: itemForm.value.target_start ? Number(itemForm.value.target_start) : null,
      target_end: itemForm.value.target_end ? Number(itemForm.value.target_end) : null,
      elim_round: itemForm.value.elim_round ? Number(itemForm.value.elim_round) : null
    }
    const res = await post(`/tournaments/${eventId}/schedule/items`, payload)
    toast.success(res?.message || t('event_schedule.msg_item_saved'))
    showItemModal.value = false
    await fetchScheduleTimeline()
    if (savedDate && days.value.length > 0) {
      const targetDay = days.value.find(d => d.schedule_date && d.schedule_date.substring(0, 10) === savedDate)
      if (targetDay) {
        selectedDayNumber.value = targetDay.day_number
      }
    }
  } catch (err) {
    toast.error(err?.data?.error || err.message || t('event_schedule.err_save_item'))
  } finally {
    savingItem.value = false
  }
}

const isParallelItem = (item) => {
  if (!currentDay.value || !currentDay.value.items) return false
  const itStart = (item.start_time || '').substring(0, 5)
  const itEnd = (item.end_time || '').substring(0, 5)
  return currentDay.value.items.some(other => {
    if (other.uuid === item.uuid) return false
    const oStart = (other.start_time || '').substring(0, 5)
    const oEnd = (other.end_time || '').substring(0, 5)
    return itStart < oEnd && itEnd > oStart
  })
}

const confirmDeleteItem = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const executeDeleteItem = async () => {
  if (!itemToDelete.value) return
  deleting.value = true
  try {
    const res = await deleteApi(`/tournaments/${eventId}/schedule/items/${itemToDelete.value.uuid}`)
    toast.success(res?.message || t('event_schedule.msg_item_deleted'))
    showDeleteModal.value = false
    itemToDelete.value = null
    await fetchScheduleTimeline()
  } catch (err) {
    toast.error(err.message || t('event_schedule.err_delete_item'))
  } finally {
    deleting.value = false
  }
}

// Helpers
const formatDayDate = (dateStr) => {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const loc = locale.value === 'id' ? 'id-ID' : 'en-US'
    return d.toLocaleDateString(loc, {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch (e) {
    return dateStr
  }
}

const formatTime = (timeStr) => {
  if (!timeStr) return '--:--'
  return timeStr.substring(0, 5)
}

const formatDuration = (mins) => {
  if (!mins || mins <= 0) return '00:30'
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0) {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }
  return `00:${String(m).padStart(2, '0')}`
}

const getItemTypeLabel = (type) => {
  switch (type) {
    case 'qualification': return t('event_schedule.type_qualification')
    case 'elimination': return t('event_schedule.type_elimination')
    case 'finals': return t('event_schedule.type_finals')
    case 'break': return t('event_schedule.type_break')
    default: return t('event_schedule.type_general')
  }
}

const getItemTypeIcon = (type) => {
  switch (type) {
    case 'qualification': return 'ph:target-bold'
    case 'elimination': return 'ph:tree-structure-bold'
    case 'finals': return 'ph:trophy-bold'
    case 'break': return 'ph:coffee-bold'
    default: return 'ph:info-bold'
  }
}

const getItemTypeBadgeClass = (type) => {
  switch (type) {
    case 'qualification': return 'bg-blue-50 text-blue-700 border border-blue-100'
    case 'elimination': return 'bg-orange-50 text-orange-700 border border-orange-100'
    case 'finals': return 'bg-amber-50 text-amber-800 border border-amber-200'
    case 'break': return 'bg-rose-50 text-rose-700 border border-rose-200'
    default: return 'bg-gray-100 text-gray-700 border border-gray-200'
  }
}

const formatTarget = (item) => {
  if (!item) return ''
  const start = item.target_start?.Valid ? item.target_start.Int64 : (typeof item.target_start === 'number' && item.target_start > 0 ? item.target_start : null)
  const end = item.target_end?.Valid ? item.target_end.Int64 : (typeof item.target_end === 'number' && item.target_end > 0 ? item.target_end : null)
  if (start && end) return `Target ${start} – ${end}`
  if (start) return `Target ${start}`
  return ''
}

const getLocationText = (item) => {
  if (!item) return ''
  if (item.location?.Valid && item.location.String) return item.location.String
  if (typeof item.location === 'string' && item.location.trim()) return item.location
  return ''
}

const getSubtitleText = (item) => {
  if (!item) return ''
  if (item.subtitle?.Valid && item.subtitle.String) return item.subtitle.String
  if (typeof item.subtitle === 'string' && item.subtitle.trim()) return item.subtitle
  return ''
}

const getSessionCode = (item) => {
  if (!item) return ''
  if (item.session_code?.Valid && item.session_code.String) return item.session_code.String
  if (typeof item.session_code === 'string' && item.session_code.trim()) return item.session_code
  return ''
}

onMounted(() => {
  fetchTournamentInfo()
  fetchScheduleTimeline()
})
</script>
