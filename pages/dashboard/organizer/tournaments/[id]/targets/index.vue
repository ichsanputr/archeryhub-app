<template>
  <div class="flex flex-col gap-6 pb-12">
    <!-- Header -->
    <DashboardHeader
      :title="t('event_targets.title', 'Bantalan Target')"
      :subtitle="t('event_targets.manage_desc', { event: eventName || 'Event' })"
      icon="ph:target"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('events.list.title', 'Event Saya'), to: '/dashboard/organizer/tournaments' },
        { label: t('event_targets.title', 'Bantalan Target') }
      ]"
    >
      <template #actions>
        <div class="flex items-center gap-3 flex-shrink-0">
          <!-- View Toggle -->
          <div class="hidden sm:flex bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/20 mr-2">
            <button @click="viewMode = 'grid'" class="px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
              :class="viewMode === 'grid' ? 'bg-primary text-navy shadow-md font-bold' : 'text-slate-300 hover:text-white'">
              <Icon icon="ph:grid-four-bold" />
              <span class="text-[10px] font-black tracking-wider">{{ t('event_targets.view_grid') }}</span>
            </button>
            <button @click="viewMode = 'table'" class="px-3 py-1.5 rounded-lg transition-all flex items-center gap-2"
              :class="viewMode === 'table' ? 'bg-primary text-navy shadow-md font-bold' : 'text-slate-300 hover:text-white'">
              <Icon icon="ph:table-bold" />
              <span class="text-[10px] font-black tracking-wider">{{ t('event_targets.view_table') }}</span>
            </button>
          </div>

          <BaseButton @click="isSubscriptionActive ? (showCreateDialog = true) : (showPremiumModal = true)" variant="primary" icon="ph:plus-bold"
            class="h-10 sm:h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-md hover:shadow-primary/40 transition-all w-full sm:w-auto text-xs sm:text-sm font-black tracking-widest"
            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }">
            <span class="hidden sm:inline">{{ t('event_targets.add_target') }}</span>
            <span class="sm:hidden">{{ t('event_targets.add') }}</span>
          </BaseButton>
        </div>
      </template>
    </DashboardHeader>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="space-y-6">
      <!-- Enhanced Skeleton Loader Grid -->
      <div v-if="loading && targets.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i"
          class="animate-pulse bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-[340px]">

          <!-- Skeleton Header -->
          <div class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="h-3 w-10 bg-gray-200 rounded"></div>
              <div class="h-8 w-8 bg-gray-300 rounded-lg"></div>
            </div>
            <div class="flex gap-1">
              <div class="size-8 bg-gray-100 rounded-lg border border-gray-50"></div>
              <div class="size-8 bg-gray-100 rounded-lg border border-gray-50"></div>
            </div>
          </div>

          <!-- Skeleton Body (Target Board) -->
          <div class="flex-1 p-6 flex items-center justify-center bg-white relative">
            <div class="grid grid-cols-2 gap-4 w-full max-w-[160px] justify-items-center">
              <div v-for="j in 4" :key="j" class="flex flex-col items-center gap-2 w-full">
                <!-- Target Circle -->
                <div class="w-full aspect-square bg-gray-100 rounded-full shadow-inner"></div>
                <!-- Target Label Below -->
                <div class="h-2.5 w-8 bg-gray-50 rounded"></div>
              </div>
            </div>
          </div>

          <!-- Skeleton Footer -->
          <div class="px-6 py-4 bg-gray-50/30 border-t border-gray-50/50">
            <div class="h-2.5 w-24 bg-gray-100 rounded mx-auto"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="targets.length === 0"
        class="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
        <div class="flex flex-col items-center gap-4 max-w-sm mx-auto">
          <div class="size-20 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
            <Icon icon="ph:target-bold" class="text-5xl" />
          </div>
          <div class="space-y-1">
            <h3 class="text-lg font-black text-navy">{{ t('event_targets.no_targets') }}</h3>
            <div class="text-xs text-gray-500 font-medium leading-relaxed">
              {{ t('event_targets.no_targets_desc') }}
            </div>
          </div>
        </div>
      </div>

      <!-- Grid Data -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="target in targets" :key="target.target_number"
          class="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-primary/30 transition-all duration-300 overflow-hidden flex flex-col">

          <!-- Board Header -->
          <div class="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="size-8 rounded-lg bg-navy text-white flex items-center justify-center font-black text-sm font-mono shadow-sm">
                {{ target.target_number }}
              </span>
            </div>

            <!-- Actions Hover Menu -->
            <div class="flex gap-1">
              <button @click="isSubscriptionActive ? editTarget(target) : (showPremiumModal = true)"
                class="size-8 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-blue-600 hover:bg-blue-50 transition-colors shadow-sm">
                <Icon icon="ph:pencil-simple-bold" />
              </button>
              <button @click="isSubscriptionActive ? confirmDelete(target) : (showPremiumModal = true)"
                class="size-8 flex items-center justify-center rounded-lg bg-white border border-gray-100 text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                <Icon icon="ph:trash-bold" />
              </button>
            </div>
          </div>

          <!-- Target Board Visualization -->
          <div class="flex-1 p-6 flex flex-col items-center justify-center relative min-h-[220px]">
            <!-- Target Board Texture Overlay (Bantalan look) -->
            <div class="absolute inset-0 opacity-[0.03] pointer-events-none target-board-texture"></div>

            <!-- Targets Layout -->
            <div :class="[
              'grid gap-4 w-full transition-all duration-500 justify-items-center',
              target.letters.split(',').length === 1 ? 'grid-cols-1 max-w-[100px]' :
                target.letters.split(',').length === 2 ? 'grid-cols-2 max-w-[200px]' :
                  target.letters.split(',').length === 3 ? 'grid-cols-3 max-w-[260px]' :
                    'grid-cols-2 max-w-[180px]'
            ]">
              <div v-for="letter in target.letters.split(',').map(l => l.trim())" :key="letter"
                class="flex flex-col items-center gap-2 group/target w-full">
                <!-- Target Face Image -->
                <div class="relative w-full aspect-square">
                  <img src="/target.svg" class="w-full h-full" alt="Archery Target" />
                </div>
                <span class=" text-xs font-black text-navy/40 tracking-widest ">{{ target.target_number }}{{
                  letter }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Footer Info -->
          <div class="px-6 py-3 bg-gray-50/30 text-center">
            <div class="text-[10px] font-bold text-gray-400 tracking-widest">
              {{ t('event_targets.targets_count', { count: target.letters.split(',').length }) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50/50 border-b border-gray-100">
            <tr class="text-[10px] font-black text-gray-400  tracking-widest">
              <th class="px-6 py-4">{{ t('event_targets.number') }}</th>
              <th class="px-6 py-4">{{ t('event_targets.target_number') }}</th>
              <th class="px-6 py-4 text-right">{{ t('event_targets.action') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50 relative min-h-[200px]">
            <!-- Table Row Loading Overlay -->
            <Transition enter-active-class="transition-opacity duration-300" enter-from-class="opacity-0"
              enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200"
              leave-from-class="opacity-100" leave-to-class="opacity-0">
              <div v-if="loading && targets.length > 0"
                class="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <div class="animate-spin rounded-full h-8 w-8 border-3 border-primary border-t-transparent"></div>
              </div>
            </Transition>

            <!-- Table Skeleton Loader -->
            <template v-if="loading && targets.length === 0">
              <tr v-for="i in 5" :key="i" class="animate-pulse">
                <td class="px-6 py-4">
                  <div class="size-11 rounded-lg bg-gray-200 shadow-sm"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 w-20 bg-gray-100 rounded"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <div class="size-8 rounded-lg bg-gray-50 border border-gray-100"></div>
                    <div class="size-8 rounded-lg bg-gray-50 border border-gray-100"></div>
                  </div>
                </td>
              </tr>
            </template>

            <!-- Data Rows -->
            <tr v-for="target in targets" :key="target.target_number" class="hover:bg-gray-50 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="size-11 rounded-lg bg-navy text-white flex items-center justify-center font-black text-sm shadow-sm font-mono">
                    {{ target.target_number }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="font-bold text-navy text-sm">{{ target.letters }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <button @click="isSubscriptionActive ? editTarget(target) : (showPremiumModal = true)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group/btn">
                    <Icon icon="ph:pencil-simple" class="text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button @click="isSubscriptionActive ? confirmDelete(target) : (showPremiumModal = true)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group/btn">
                    <Icon icon="ph:trash" class="text-lg group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Standardized Pagination -->
    <div v-if="targets.length > 0" class="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
      <BasePagination :current-page="page" :total-items="total" :items-per-page="limit"
        :page-size-options="[9, 18, 27, 45, 90]" @change-page="handlePageChange"
        @update:items-per-page="handleLimitChange" no-margin />
    </div>

    <!-- Create/Edit Dialog -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showCreateDialog || showEditDialog"
          class="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4"
          @click.self="closeDialog">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-visible">
            <!-- Dialog Header -->
            <div class="sticky top-0 bg-white px-6 py-4 rounded-t-2xl border-b border-gray-200 z-10">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="size-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Icon icon="ph:target" class="text-xl text-navy" />
                  </div>
                  <h3 class="text-xl font-black text-navy">
                    {{ showEditDialog ? t('event_targets.edit_target') : t('event_targets.add_target') }}
                  </h3>
                </div>
                <button @click="closeDialog" class="text-gray-400 hover:text-navy transition-colors">
                  <Icon icon="ph:x" class="text-2xl" />
                </button>
              </div>
            </div>

            <!-- Dialog Body -->
            <form @submit.prevent="submitForm" class="p-6 space-y-5">
              <div>
                <label class="block text-sm font-bold text-gray-700 mb-2">
                  {{ showEditDialog ? t('event_targets.base_target_number') : t('event_targets.target_quantity') }}
                </label>
                <input v-if="showEditDialog" v-model.number="form.target_name" type="number" min="1" required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="6" />
                <input v-else v-model.number="form.target_total" type="number" min="1" required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="4" />
                <div v-if="showEditDialog" class="text-xs text-gray-500 mt-1.5">{{ t('event_targets.base_target_desc') }}</div>
                <div v-else class="text-xs text-gray-500 mt-1.5" v-html="t('event_targets.create_target_desc', { total: totalCreatedTargets })"></div>
              </div>

              <div>
                <BaseSelect v-model="form.target_count" :label="t('event_targets.target_face_count')" :items="targetCountOptions" required />
                <div class="text-xs text-gray-500 mt-1.5">{{ t('event_targets.target_face_count_desc') }}</div>

                <div v-if="!showEditDialog" class="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <div class=" text-xs font-bold text-navy tracking-wider">{{ t('event_targets.preview_title') }}</div>
                    <span class=" text-xs font-bold text-gray-500">
                      {{ t('event_targets.targets_count', { count: totalCreatedTargets }) }}
                    </span>
                  </div>

                  <div class="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                    <div v-for="target in previewTargets" :key="target"
                      class="flex flex-col items-center gap-1 p-2 bg-white rounded-xl border border-gray-100 shadow-sm min-w-[50px]">
                      <img src="/target.svg" class="size-6 opacity-80" />
                      <span class="text-[9px] font-black text-navy">{{ target }}</span>
                    </div>
                  </div>

                  <div class="text-[10px] text-gray-400 mt-2 font-medium">
                    {{ t('event_targets.sample') }}: <strong class="text-navy">{{ previewTargets[0] || '-' }}</strong> {{ t('event_targets.to') }}
                    <strong class="text-navy">{{ previewTargets[previewTargets.length - 1] || '-' }}</strong>
                  </div>
                </div>
              </div>

              <!-- Dialog Footer -->
              <div class="flex gap-3 pt-4 border-t border-gray-100">
                <button type="button" @click="closeDialog"
                  class="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                  {{ t('event_targets.cancel') }}
                </button>
                <BaseButton type="submit" :disabled="submitting" :loading="submitting" variant="primary"
                  class="flex-1 px-4 py-3 rounded-xl font-bold shadow-lg shadow-primary/30">
                  {{ showEditDialog ? t('event_targets.update_target') : t('event_targets.create_target') }}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Delete Confirmation Dialog -->
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="showDeleteDialog"
          class="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 backdrop-blur-sm p-4"
          @click.self="showDeleteDialog = false">
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div class="p-6">
              <div class="flex items-start gap-4 mb-4">
                <div class="size-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon icon="ph:warning" class="text-2xl text-red-600" />
                </div>
                <div>
                  <h3 class="text-xl font-black text-navy mb-2">{{ t('event_targets.confirm_delete') }}</h3>
                  <div class="text-gray-600" v-html="t('event_targets.confirm_delete_desc', { target: targetToDelete?.target_name })"></div>
                </div>
              </div>
              <div class="flex gap-3">
                <button type="button" @click="showDeleteDialog = false"
                  class="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all">
                  {{ t('event_targets.cancel') }}
                </button>
                <button @click="deleteTarget" :disabled="submitting"
                  class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50">
                  {{ submitting ? t('event_targets.deleting') : t('event_targets.delete') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { t } = useI18n()
const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)
const viewMode = ref('grid')
const route = useRoute()
const { get, post, put, delete: deleteApi } = useApi()
const toast = useToast()

const eventId = route.params.id
const eventName = ref('Loading...')

const targets = ref([])
const loading = ref(false)
const submitting = ref(false)

// Pagination state
const page = ref(1)
const limit = ref(9)
const total = ref(0) // Total items from API

const totalPages = computed(() => Math.ceil(total.value / limit.value))

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)
const targetToDelete = ref(null)
const targetToEdit = ref(null)

const form = ref({
  target_name: '',
  target_total: 1,
  target_count: 1
})

const targetCountOptions = [
  { title: '1 Target', value: 1 },
  { title: '2 Target', value: 2 },
  { title: '3 Target', value: 3 },
  { title: '4 Target', value: 4 }
]

const targetLetterRange = computed(() => {
  const letters = ['A', 'B', 'C', 'D']
  const count = Number(form.value.target_count) || 1
  return letters.slice(0, count).join(', ')
})

const targetLetterMax = computed(() => {
  const letters = ['A', 'B', 'C', 'D']
  const count = Number(form.value.target_count) || 1
  return letters[Math.max(0, count - 1)]
})

const totalCreatedTargets = computed(() => {
  const total = Number(form.value.target_total) || 1
  const count = Number(form.value.target_count) || 1
  return total * count
})

const nextBase = computed(() => {
  if (!targets.value || targets.value.length === 0) return 1
  return Math.max(...targets.value.map(t => Number(t.target_number) || 0), 0) + 1
})

const previewTargets = computed(() => {
  const start = nextBase.value
  const total = Math.max(1, Number(form.value.target_total) || 1)
  const count = Math.max(1, Number(form.value.target_count) || 1)
  const letters = ['A', 'B', 'C', 'D'].slice(0, count)
  const result = []
  for (let base = start; base < start + total; base++) {
    for (const letter of letters) {
      result.push(`${base}${letter}`)
    }
  }
  return result
})

const currentTargetId = ref(null)

definePageMeta({
  layout: 'dashboard'
})

useHead({
  title: computed(() => `${t('event_targets.title', 'Target Bantalan')} - Archeris Dashboard`)
})

const breadcrumbItems = computed(() => [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Tournaments', to: '/dashboard/organizer/tournaments' },
  { label: eventName.value || 'Tournament', to: `/dashboard/organizer/tournaments/${eventId}` }
])

const parseTargetNumbers = (value) => {
  return (value || '')
    .split(',')
    .map(v => v.trim())
    .filter(Boolean)
}

const fetchTargets = async () => {
  loading.value = true
  try {
    const response = await get(`/tournaments/${eventId}/targets`, {
      params: {
        page: page.value,
        limit: limit.value,
        order_by: 'created_at',
        order_dir: 'desc'
      }
    })
    targets.value = response?.targets || []
    total.value = response?.total || 0
  } catch (error) {
    console.error('Failed to fetch targets:', error)
    toast.error(t('event_targets.toast_load_failed'))
  } finally {
    loading.value = false
  }
}

const handlePageChange = (p) => {
  page.value = p
  fetchTargets()
}

const handleLimitChange = (l) => {
  limit.value = l
  page.value = 1
  fetchTargets()
}

const fetchEventInfo = async () => {
  try {
    const response = await get(`/tournaments/${eventId}`)
    eventName.value = response?.name || 'Event'
  } catch (error) {
    console.error('Failed to fetch event:', error)
  }
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (showEditDialog.value) {
      const oldIds = targetToEdit.value.target_ids.split(',')
      const newCount = parseInt(form.value.target_count)
      const letters = ['A', 'B', 'C', 'D']
      const newBase = form.value.target_name.toString()

      // 1. Prepare batch updates for existing targets
      const updateCount = Math.min(oldIds.length, newCount)
      const updates = []
      for (let i = 0; i < updateCount; i++) {
        updates.push({
          uuid: oldIds[i],
          target_name: `${newBase}${letters[i]}`
        })
      }

      if (updates.length > 0) {
        await put(`/tournaments/${eventId}/targets/batch`, { updates })
      }

      // 2. Add new targets if count increased
      if (newCount > oldIds.length) {
        const newLetters = letters.slice(oldIds.length, newCount)
        await post(`/tournaments/${eventId}/targets`, {
          target_name: newBase,
          target_numbers: newLetters
        })
      }

      // 3. Delete extra targets if count decreased (Check assignments first)
      if (newCount < oldIds.length) {
        const extraIds = oldIds.slice(newCount)
        let deleteErrors = 0
        for (const id of extraIds) {
          try {
            await deleteApi(`/tournaments/${eventId}/targets/${id}`)
          } catch (error) {
            if (error?.data?.error?.includes('existing archer assignments')) {
              deleteErrors++
            } else {
              throw error
            }
          }
        }

        if (deleteErrors > 0) {
          toast.warning(t('event_targets.toast_unassign_required', { count: deleteErrors }))
        }
      }

      toast.success(t('event_targets.toast_update_success'))
    } else {
      const count = parseInt(form.value.target_count)
      const letters = ['A', 'B', 'C', 'D']
      const targetNumbers = letters.slice(0, count)
      const totalTargets = parseInt(form.value.target_total)
      if (!totalTargets || totalTargets < 1) {
        toast.error(t('event_targets.toast_quantity_invalid'))
        submitting.value = false
        return
      }

      // Create targets sequentially starting from nextBase:
      const start = nextBase.value
      for (let base = start; base < start + totalTargets; base++) {
        await post(`/tournaments/${eventId}/targets`, {
          target_name: String(base),
          target_numbers: targetNumbers
        })
      }
      toast.success(t('event_targets.toast_create_success'))
    }
    closeDialog()
    await fetchTargets()
  } catch (error) {
    console.error('Failed to save target:', error)
    toast.error(error?.data?.error || t('event_targets.toast_save_failed'))
  } finally {
    submitting.value = false
  }
}

const editTarget = (target) => {
  targetToEdit.value = target
  currentTargetId.value = target.target_ids.split(',')[0]

  // Set form values individually for better reactivity tracking
  form.value.target_name = Number(target.target_number) || target.target_number
  form.value.target_total = 1
  form.value.target_count = target.letters ? target.letters.split(',').filter(l => l.trim()).length : 1

  showEditDialog.value = true
}

const confirmDelete = (target) => {
  targetToDelete.value = target
  showDeleteDialog.value = true
}

const deleteTarget = async () => {
  submitting.value = true
  try {
    const ids = targetToDelete.value.target_ids.split(',')
    for (const id of ids) {
      await deleteApi(`/tournaments/${eventId}/targets/${id}`)
    }
    toast.success(t('event_targets.toast_delete_success'))
    showDeleteDialog.value = false
    await fetchTargets()
  } catch (error) {
    console.error('Failed to delete target:', error)
    toast.error(error?.data?.error || t('event_targets.toast_delete_failed'))
  } finally {
    submitting.value = false
  }
}

const closeDialog = () => {
  showCreateDialog.value = false
  showEditDialog.value = false
  currentTargetId.value = null
  form.value = {
    target_name: '',
    target_total: 1,
    target_count: 1
  }
}

onMounted(() => {
  fetchTargets()
  fetchEventInfo()
})
</script>
<style scoped>
.target-board-texture {
  background-image:
    radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
    linear-gradient(45deg, transparent 48%, rgba(0, 0, 0, 0.05) 50%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(0, 0, 0, 0.05) 50%, transparent 52%);
  background-size: 20px 20px, 40px 40px, 40px 40px;
}
</style>
