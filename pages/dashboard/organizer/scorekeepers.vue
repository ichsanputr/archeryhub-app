<template>
  <div class="space-y-6 pb-16 font-body text-navy antialiased">
    <!-- Header: Premium Navy Banner -->
    <DashboardHeader
      :title="t('organizer.scorekeepers.title')"
      :subtitle="t('organizer.scorekeepers.subtitle')"
      icon="ph:user-focus-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: t('organizer.scorekeepers.title') }
      ]"
    >
      <template #actions>
        <BaseButton @click="isSubscriptionActive ? openAddModal() : (showPremiumModal = true)"
          variant="primary" icon="ph:plus-bold"
          class="w-full sm:w-auto h-10 sm:h-11 px-6 font-black tracking-wider text-xs sm:text-sm rounded-xl shadow-lg shadow-primary/30"
          :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }">
          {{ t('organizer.scorekeepers.add') }}
        </BaseButton>
      </template>
    </DashboardHeader>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="scorekeeper" />

    <!-- Unified DashboardDataTable -->
    <DashboardDataTable
      :items="filteredScorekeepers"
      :columns="tableColumns"
      :loading="loading"
      :searchable="true"
      :search-placeholder="t('organizer.scorekeepers.search_placeholder', 'Cari scorekeeper atau kode...')"
      count-icon="ph:users-three-bold"
      :count-unit="t('organizer.scorekeepers.staff_unit', 'Scorekeepers')"
      :show-reset-button="true"
      :empty-title="t('organizer.scorekeepers.empty_title', 'Belum Ada Scorekeeper')"
      :empty-description="t('organizer.scorekeepers.empty_desc', 'Tambahkan scorekeeper untuk mempermudah pencatatan skor di lapangan.')"
      empty-icon="ph:user-focus-duotone"
      :items-per-page="limit"
      :initial-sort-by="sortBy"
      :initial-sort-order="order === 'ASC' ? 'asc' : 'desc'"
      :active-filter-chips="activeFilterChips"
      @search="handleSearch"
      @sort="handleSort"
      @reset-filters="resetFilters"
      @remove-chip="removeFilterChip"
    >
      <!-- Inline Filter Slot: Status Select -->
      <template #inline-filters>
        <div class="w-36 sm:w-44">
          <BaseSelect
            v-model="statusFilter"
            :items="statusOptions"
            :placeholder="t('organizer.scorekeepers.filter_status')"
            class="w-full text-xs"
          />
        </div>
      </template>

      <!-- Profile Column Slot -->
      <template #item-profile="{ item }">
        <div class="flex items-center gap-3.5 py-1">
          <div class="size-10 sm:size-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-2xs">
            <img
              :src="useImageOrDefault(item.avatar_url || item.photo_url, item.name)"
              :alt="item.name"
              @error="(e) => e.target.src = generateDicebearAvatar(item.name)"
              class="size-full object-cover"
            />
          </div>
          <div class="min-w-0">
            <span class="text-xs sm:text-sm font-bold text-navy hover:text-primary transition-colors block truncate" :title="item.name">
              {{ item.name }}
            </span>
          </div>
        </div>
      </template>

      <!-- Code Column Slot -->
      <template #item-code="{ item }">
        <div class="inline-flex items-center gap-2">
          <span class="text-xs font-bold font-mono text-navy bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-lg tracking-wider">
            {{ item.code }}
          </span>
          <button
            type="button"
            @click="copyCode(item.code)"
            class="text-slate-400 hover:text-navy transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
            :title="t('organizer.scorekeepers.copy_code', 'Salin Kode')"
          >
            <Icon icon="ph:copy-simple-bold" class="text-xs sm:text-sm" />
          </button>
        </div>
      </template>

      <!-- Status Column Slot -->
      <template #item-status="{ item }">
        <div class="flex justify-center">
          <span
            :class="item.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'"
            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border"
          >
            <span :class="item.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'" class="size-1.5 rounded-full shrink-0"></span>
            <span>{{ item.status === 'active' ? t('common.active', 'Active') : t('common.inactive', 'Inactive') }}</span>
          </span>
        </div>
      </template>

      <!-- Joined Date Column Slot -->
      <template #item-created_at="{ item }">
        <div class="text-xs text-slate-500 font-medium whitespace-nowrap">
          {{ formatDate(item.created_at) }}
        </div>
      </template>

      <!-- Actions Column Slot -->
      <template #actions="{ item }">
        <div class="flex items-center justify-end gap-1.5">
          <BaseButton
            @click="isSubscriptionActive ? openEditModal(item) : (showPremiumModal = true)"
            variant="white" size="sm" icon="ph:pencil-simple"
            class="!size-9 !p-0 text-slate-600 hover:text-navy hover:border-navy border-slate-200 shadow-2xs"
            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
            :title="t('common.edit', 'Edit')"
          />
          <BaseButton
            @click="isSubscriptionActive ? confirmDelete(item) : (showPremiumModal = true)"
            variant="white" size="sm" icon="ph:trash"
            class="!size-9 !p-0 text-rose-500 hover:text-rose-700 hover:border-rose-300 border-slate-200 shadow-2xs"
            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
            :title="t('common.delete', 'Hapus')"
          />
        </div>
      </template>
    </DashboardDataTable>

        <!-- Modal Form -->
        <BaseDialogForm v-model="modal.show"
            :header="modal.isEdit ? t('organizer.scorekeepers.modal.edit_title') : t('organizer.scorekeepers.modal.add_title')">
            <div class="flex flex-col gap-4">
                <BaseInput v-model="form.name"
                    :label="t('organizer.scorekeepers.modal.name_label')"
                    :placeholder="t('organizer.scorekeepers.modal.name_placeholder')"
                    required />

                <div v-if="modal.isEdit" class="mt-2">
                    <label class="block text-xs font-black text-navy tracking-widest mb-2">
                        {{ t('organizer.scorekeepers.modal.status_label') }}
                    </label>
                    <div class="flex gap-4">
                        <button type="button" @click="form.status = 'active'"
                            class="flex-1 py-3 px-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                            :class="form.status === 'active' 
                                ? 'border-emerald-600 bg-emerald-50 text-emerald-800 shadow-xs' 
                                : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'">
                            <span class="size-2 rounded-full" :class="form.status === 'active' ? 'bg-emerald-600' : 'bg-slate-400'"></span>
                            {{ t('common.active') }}
                        </button>
                        <button type="button" @click="form.status = 'inactive'"
                            class="flex-1 py-3 px-4 rounded-xl border-2 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                            :class="form.status === 'inactive' 
                                ? 'border-rose-600 bg-rose-50 text-rose-800 shadow-xs' 
                                : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'">
                            <span class="size-2 rounded-full" :class="form.status === 'inactive' ? 'bg-rose-600' : 'bg-slate-400'"></span>
                            {{ t('common.inactive') }}
                        </button>
                    </div>
                </div>
            </div>

            <template #action>
                <div class="flex items-center justify-end gap-3 w-full">
                    <BaseButton variant="white" @click="modal.show = false" class="text-xs font-bold px-5 h-10">
                        {{ t('common.cancel') }}
                    </BaseButton>
                    <BaseButton :loading="modal.loading" @click="handleSubmit" variant="primary" class="text-xs font-black px-6 h-10">
                        {{ modal.isEdit ? t('common.save_changes') : t('organizer.scorekeepers.modal.generate') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Delete Confirmation -->
        <AppDialog v-model:show="deleteState.show"
            :title="t('organizer.scorekeepers.delete.title')"
            :message="t('organizer.scorekeepers.delete.message')"
            :confirm-text="t('organizer.scorekeepers.delete.confirm')"
            type="danger" @confirm="handleDelete" />
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue'
import { useDashboardI18n } from '~/composables/useDashboardI18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useSubscription } from '~/composables/useSubscription'
import { useImageOrDefault, generateDicebearAvatar } from '~/composables/useImageHelper'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import DashboardDataTable from '~/components/common/DashboardDataTable.vue'
import DashboardHeader from '~/components/dashboard/DashboardHeader.vue'
import AppDialog from '~/components/common/AppDialog.vue'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import { Icon } from '@iconify/vue'

const { t } = useDashboardI18n()

definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
})

useHead({
    title: computed(() => `${t('organizer.scorekeepers.title')} - Archeris Dashboard`)
})

const { isSubscriptionActive } = useSubscription()

const api = useApi()
const toast = useToast()

const showPremiumModal = ref(false)
const scorekeepers = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('all')
const sortBy = ref('created_at')
const order = ref('DESC')
const currentPage = ref(1)
const totalItems = ref(0)
const limit = ref(10)

const statusOptions = computed(() => [
  { title: t('common.all_status', 'Semua Status'), value: 'all' },
  { title: t('common.active', 'Aktif'), value: 'active' },
  { title: t('common.inactive', 'Nonaktif'), value: 'inactive' }
])

const tableColumns = computed(() => [
  { key: 'profile', label: t('organizer.scorekeepers.table_profile', 'Profile'), sortable: true, sortKey: 'name', class: 'min-w-[240px]' },
  { key: 'code', label: t('organizer.scorekeepers.table_code', 'Kode Scorekeeper'), sortable: true, sortKey: 'code', class: 'min-w-[170px]' },
  { key: 'status', label: t('organizer.scorekeepers.table_status', 'Status'), sortable: true, sortKey: 'status', align: 'center', class: 'min-w-[130px]' },
  { key: 'created_at', label: t('organizer.scorekeepers.table_joined', 'Tanggal Bergabung'), sortable: true, sortKey: 'created_at', class: 'min-w-[150px]' }
])

const filteredScorekeepers = computed(() => {
  let list = scorekeepers.value || []
  if (statusFilter.value && statusFilter.value !== 'all') {
    const target = String(statusFilter.value).toLowerCase()
    list = list.filter(s => String(s.status || '').toLowerCase() === target)
  }
  return list
})

const activeFilterChips = computed(() => {
  const chips = []
  if (statusFilter.value && statusFilter.value !== 'all') {
    const opt = statusOptions.value.find(o => o.value === statusFilter.value)
    chips.push({ key: 'status', label: `Status: ${opt ? opt.title : statusFilter.value}` })
  }
  return chips
})

const removeFilterChip = (key) => {
  if (key === 'status') statusFilter.value = 'all'
}

const fetchScorekeepers = async () => {
  loading.value = true
  try {
    const offset = (currentPage.value - 1) * limit.value
    const res = await api.get('/organizers/scorekeepers', {
      params: {
        limit: limit.value,
        offset: offset,
        sort_by: sortBy.value,
        order: order.value,
        search: searchQuery.value
      }
    })
    scorekeepers.value = res.scorekeepers || []
    totalItems.value = res.meta?.total_items || (res.scorekeepers ? res.scorekeepers.length : 0)
  } catch (error) {
    toast.error(t('organizer.scorekeepers.fetch_error'))
  } finally {
    loading.value = false
  }
}

const handleSearch = (q) => {
  searchQuery.value = q
  currentPage.value = 1
  fetchScorekeepers()
}

const handleSort = ({ sortBy: field, sortOrder }) => {
  sortBy.value = field
  order.value = sortOrder === 'asc' ? 'ASC' : 'DESC'
  fetchScorekeepers()
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  currentPage.value = 1
  fetchScorekeepers()
}

watch(statusFilter, () => {
  currentPage.value = 1
})

const modal = reactive({
    show: false,
    isEdit: false,
    loading: false,
    currentId: null
})

const form = reactive({
    name: '',
    status: 'active'
})

const deleteState = reactive({
    show: false,
    target: null
})

const copyCode = (code) => {
    if (!code) return
    navigator.clipboard.writeText(code)
    toast.success(t('organizer.scorekeepers.code_copied'))
}

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

const openAddModal = () => {
    modal.isEdit = false
    modal.currentId = null
    form.name = ''
    form.status = 'active'
    modal.show = true
}

const openEditModal = (sk) => {
    modal.isEdit = true
    modal.currentId = sk.uuid
    form.name = sk.name
    form.status = sk.status || 'active'
    modal.show = true
}

const handleSubmit = async () => {
    if (!form.name) {
        toast.error(t('common.fill_required_fields'))
        return
    }

    modal.loading = true
    try {
        if (modal.isEdit) {
            await api.put(`/organizers/scorekeepers/${modal.currentId}`, {
                name: form.name,
                status: form.status
            })
            toast.success(t('organizer.scorekeepers.update_success'))
        } else {
            await api.post('/organizers/scorekeepers', {
                name: form.name
            })
            toast.success(t('organizer.scorekeepers.create_success'))
        }
        modal.show = false
        fetchScorekeepers()
    } catch (error) {
        const msg = error.response?.data?.error || t('common.error_saving')
        toast.error(msg)
    } finally {
        modal.loading = false
    }
}

const confirmDelete = (sk) => {
    deleteState.target = sk
    deleteState.show = true
}

const handleDelete = async () => {
    if (!deleteState.target) return

    try {
        await api.delete(`/organizers/scorekeepers/${deleteState.target.uuid}`)
        toast.success(t('organizer.scorekeepers.delete_success'))
        fetchScorekeepers()
    } catch (error) {
        toast.error(t('organizer.scorekeepers.delete_error'))
    } finally {
        deleteState.show = false
    }
}

onMounted(fetchScorekeepers)
</script>

<style scoped></style>
