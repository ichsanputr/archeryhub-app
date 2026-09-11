<template>
    <div class="space-y-6">
    <!-- Header: Premium Navy Banner -->
    <DashboardHeader
      :title="t('organizer.scorekeepers.title', 'Manajemen Scorekeeper')"
      :subtitle="t('organizer.scorekeepers.subtitle', 'Kelola akun dan hak akses juri/pencatat skor pertandingan panahan Anda.')"
      icon="ph:user-focus-bold"
      :breadcrumbs="[
        { label: 'Dashboard', to: '/dashboard/organizer' },
        { label: 'Scorekeeper' }
      ]"
    >
      <template #actions>
        <BaseButton @click="isSubscriptionActive ? openAddModal() : (showPremiumModal = true)"
          variant="gold" icon="ph:plus-bold"
          class="w-full sm:w-auto h-11 px-6 font-black tracking-widest text-xs rounded-xl"
          :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }">
          {{ t('organizer.scorekeepers.add', 'Tambah Scorekeeper') }}
        </BaseButton>
      </template>
    </DashboardHeader>
    <PremiumRequiredModal v-model:show="showPremiumModal" feature="scorekeeper" />

        <div
            class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full md:w-auto">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass"
                    :placeholder="t('organizer.scorekeepers.search_placeholder', 'Cari nama atau kode staff...')"
                    :label="t('organizer.scorekeepers.search_label', 'Cari Scorekeeper')" />
            </div>
            <div class="w-full md:w-48">
                <label class="block text-xs font-bold text-navy mb-1.5">{{ t('organizer.scorekeepers.filter_status', 'Status Scorekeeper') }}</label>
                <BaseSelect
                    v-model="statusFilter"
                    :options="statusOptions"
                    :placeholder="t('organizer.scorekeepers.select_status', 'Pilih Status')"
                    class="w-full text-xs"
                />
            </div>
            <BaseButton variant="white" icon="ph:funnel" @click="resetFilters"
                class="h-11 px-6 rounded-xl text-xs font-black tracking-widest shrink-0">
                {{ t('common.reset', 'Reset') }}
            </BaseButton>
        </div>

        <!-- Main Table Container -->
        <div
            class="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col overflow-hidden relative min-h-[400px]">
            <!-- Overlay Loading State -->
            <div v-if="loading && scorekeepers.length > 0"
                class="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <Icon icon="ph:circle-notch-bold" class="text-3xl text-primary animate-spin" />
            </div>

            <!-- Initial Loading State -->
            <div v-if="loading && scorekeepers.length === 0"
                class="flex flex-col items-center justify-center py-24 gap-4">
                <Icon icon="ph:spinner-bold" class="text-4xl text-primary animate-spin" />
                <div class="text-center">
                    <div class="text-navy font-bold text-sm">{{ t('common.loading', 'Memuat...') }}</div>
                    <div class="text-xs text-gray-400 font-medium">{{ t('organizer.scorekeepers.loading_desc', 'Menyiapkan profil staff') }}</div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && scorekeepers.length === 0"
                class="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div class="size-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4 text-gray-300 border border-gray-100 shadow-2xs">
                    <Icon icon="ph:user-focus-duotone" class="text-3xl text-gray-400" />
                </div>
                <div class="space-y-2 max-w-sm">
                    <h3 class="text-xl font-black text-navy tracking-tight">{{ t('organizer.scorekeepers.empty_title', 'Belum Ada Staff') }}</h3>
                    <div class="text-xs text-gray-500 leading-relaxed">
                        {{ t('organizer.scorekeepers.empty_desc', 'Daftarkan akun staff pencatat skor untuk membantu penyelenggara Anda dalam mengelola nilai dan hasil pertandingan di lapangan.') }}
                    </div>
                </div>
            </div>

            <!-- No Results State -->
            <div v-else-if="!loading && filteredScorekeepers.length === 0"
                class="flex flex-col items-center justify-center py-32 px-6 text-center">
                <div class="size-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 text-gray-300 border border-gray-100 shadow-2xs">
                    <Icon icon="ph:magnifying-glass-duotone" class="text-3xl text-gray-400" />
                </div>
                <div class="space-y-1 mb-6">
                    <h3 class="text-lg font-bold text-navy">{{ t('common.no_results') }}</h3>
                    <div class="text-sm text-gray-500 max-w-xs mx-auto">
                        {{ t('common.no_results_desc') }} "<span class="font-bold text-navy">{{ searchQuery
                            }}</span>".
                    </div>
                </div>
                <BaseButton @click="searchQuery = ''" variant="white" size="sm" class="font-bold text-xs rounded-xl">
                    {{ t('common.clear_search') }}
                </BaseButton>
            </div>

            <!-- Table View -->
            <div v-if="filteredScorekeepers.length > 0" class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th @click="toggleSort('name')"
                                class="px-6 py-4 text-[10px] font-black text-slate-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organizer.scorekeepers.table_profile') }}
                                    <Icon v-if="sortBy === 'name'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('code')"
                                class="px-6 py-4 text-[10px] font-black text-slate-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organizer.scorekeepers.table_code') }}
                                    <Icon v-if="sortBy === 'code'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('status')"
                                class="px-6 py-4 text-[10px] font-black text-slate-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organizer.scorekeepers.table_status') }}
                                    <Icon v-if="sortBy === 'status'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('created_at')"
                                class="px-6 py-4 text-[10px] font-black text-slate-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organizer.scorekeepers.table_joined') }}
                                    <Icon v-if="sortBy === 'created_at'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th class="px-6 py-4 text-[10px] font-black text-slate-400 tracking-widest text-right">
                                {{ t('common.actions') }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                        <tr v-for="sk in filteredScorekeepers" :key="sk.uuid"
                            class="hover:bg-gray-50/50 transition-all group">
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-4">
                                    <div class="flex flex-col min-w-0">
                                        <span
                                            class="text-[14px] font-bold text-navy group-hover:text-primary-dark transition-colors">{{
                                                sk.name }}</span>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <div class="flex items-center gap-2">
                                    <span class="text-lg font-black font-mono tracking-tighter">{{ sk.code
                                    }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-5">
                                <span
                                    :class="sk.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-red-50 text-red-700 border-red-100 dark:bg-red-950/40 dark:text-red-400'"
                                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border tracking-widest">
                                    <span :class="sk.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'"
                                        class="h-1.5 w-1.5 rounded-full"></span>
                                    {{ sk.status === 'active' ? t('common.active') : t('common.inactive') }}
                                </span>
                            </td>
                            <td class="px-6 py-5 text-gray-500 text-xs font-semibold">
                                {{ formatDate(sk.created_at) }}
                            </td>
                            <td class="px-6 py-5 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <BaseButton
                                        @click="isSubscriptionActive ? openEditModal(sk) : (showPremiumModal = true)"
                                        variant="white" size="md" icon="ph:pencil-simple"
                                        class="!size-10 !p-0 text-slate-500 hover:text-primary border-slate-200"
                                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }" />
                                    <BaseButton
                                        @click="isSubscriptionActive ? confirmDelete(sk) : (showPremiumModal = true)"
                                        variant="white" size="md" icon="ph:trash"
                                        class="!size-10 !p-0 text-red-500 hover:text-red-600 border-slate-200"
                                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Modal Form -->
        <BaseDialogForm v-model="modal.show"
            :header="modal.isEdit ? t('organizer.scorekeepers.modal.edit_title') : t('organizer.scorekeepers.modal.add_title')">
            <div class="flex flex-col gap-4">
                <BaseInput v-model="form.name"
                    :label="t('organizer.scorekeepers.modal.name_label')"
                    :placeholder="t('organizer.scorekeepers.modal.name_placeholder')"
                    required />

                <div v-if="modal.isEdit" class="mt-2">
                    <label class="block text-xs font-black text-gray-500 tracking-widest mb-2">
                        {{ t('organizer.scorekeepers.modal.status_label') }}
                    </label>
                    <div class="flex gap-4">
                        <button type="button" @click="form.status = 'active'"
                            class="flex-1 py-3 rounded-xl border-2 font-bold transition-all"
                            :class="form.status === 'active' ? 'border-primary bg-primary/10 text-primary' : 'border-white/5 bg-white/5 text-gray-500'">
                            {{ t('common.active') }}
                        </button>
                        <button type="button" @click="form.status = 'inactive'"
                            class="flex-1 py-3 rounded-xl border-2 font-bold transition-all"
                            :class="form.status === 'inactive' ? 'border-red-500/50 bg-red-500/10 text-red-500' : 'border-white/5 bg-white/5 text-gray-500'">
                            {{ t('common.inactive') }}
                        </button>
                    </div>
                </div>
            </div>

            <template #action>
                <div class="flex items-center justify-end gap-3 w-full">
                    <BaseButton variant="white" @click="modal.show = false">{{ t('common.cancel') }}</BaseButton>
                    <BaseButton :loading="modal.loading" @click="handleSubmit" class="bg-primary text-btn-text">
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
import { useI18n } from 'vue-i18n'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useSubscription } from '~/composables/useSubscription'
import LoadingSpinner from '~/components/common/LoadingSpinner.vue'
import BaseDialogForm from '~/components/common/BaseDialogForm.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import AppDialog from '~/components/common/AppDialog.vue'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { t } = useI18n()

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
const searchQuery = ref('')
const statusFilter = ref('all')
const statusOptions = computed(() => [
    { label: t('common.all_status', 'Semua Status'), value: 'all' },
    { label: t('common.active', 'Aktif'), value: 'active' },
    { label: t('common.inactive', 'Nonaktif'), value: 'inactive' }
])

const resetFilters = () => {
    searchQuery.value = ''
    statusFilter.value = 'all'
}

const loading = ref(true)

// Sort & Pagination
const sortBy = ref('created_at')
const order = ref('DESC')
const currentPage = ref(1)
const totalItems = ref(0)
const limit = ref(10)

const filteredScorekeepers = computed(() => {
    let list = scorekeepers.value || []
    if (statusFilter.value && statusFilter.value !== 'all') {
        const target = String(statusFilter.value).toLowerCase()
        list = list.filter(s => String(s.status || '').toLowerCase() === target)
    }
    return list
})

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
        totalItems.value = res.meta?.total_items || 0
    } catch (error) {
        toast.error(t('organizer.scorekeepers.fetch_error'))
    } finally {
        loading.value = false
    }
}

const toggleSort = (field) => {
    if (sortBy.value === field) {
        order.value = order.value === 'ASC' ? 'DESC' : 'ASC'
    } else {
        sortBy.value = field
        order.value = 'ASC'
    }
}

watch([searchQuery, sortBy, order, currentPage], () => {
    fetchScorekeepers()
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
    form.status = sk.status
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
            const res = await api.post('/organizers/scorekeepers', {
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
