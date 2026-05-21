<template>
    <div class="space-y-6">
        <!-- Header: Premium Navy Banner -->
        <div class="relative overflow-hidden rounded-2xl border border-primary/20 bg-navy text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements (Glows) -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div class="flex items-center gap-5">
                        <!-- Icon Badge -->
                        <div
                            class="size-12 sm:size-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
                            <Icon icon="ph:user-focus-bold" class="text-primary text-2xl sm:text-3xl" />
                        </div>
                        <div>
                            <h1 class="text-xl sm:text-2xl font-black tracking-tight leading-none ">
                                {{ t('organization.scorekeepers.title') }}
                            </h1>
                            <p class="text-slate-300 text-[10px] sm:text-xs font-bold mt-1 tracking-wider ">
                                {{ t('organization.scorekeepers.subtitle') }}
                            </p>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3">
                        <BaseButton @click="isSubscriptionActive ? openAddModal() : (showPremiumModal = true)"
                            variant="primary" icon="ph:plus-bold"
                            class="w-full sm:w-auto h-11 px-6 shadow-lg shadow-primary/20 font-black tracking-widest text-[10px] !rounded-xl"
                            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }">
                            {{ t('organization.scorekeepers.add') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="scorekeeper" />

        <div
            class="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-end">
            <div class="flex-grow w-full">
                <BaseInput v-model="searchQuery" icon="ph:magnifying-glass"
                    :placeholder="t('organization.scorekeepers.search_placeholder')"
                    class="!mb-0" />
            </div>
            <BaseButton variant="white" icon="ph:funnel" @click="searchQuery = ''"
                class="h-11 px-6 !rounded-xl text-[10px] font-black tracking-widest">
                {{ t('common.reset') }}
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
                <div class="h-12 w-12 border-4 border-primary border-t-transparent animate-spin rounded-full"></div>
                <div class="text-center">
                    <p class="text-navy font-bold">{{ t('common.loading') }}</p>
                    <p class="text-xs text-gray-400 font-medium">{{ t('organization.scorekeepers.loading_desc') }}</p>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!loading && scorekeepers.length === 0"
                class="flex flex-col items-center justify-center py-32 px-6 text-center">
                <div class="relative mb-8">
                    <div class="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150"></div>
                    <div
                        class="relative w-24 h-24 bg-white rounded-3xl shadow-xl border border-gray-100 flex items-center justify-center text-primary group hover:scale-110 transition-transform duration-500">
                        <Icon icon="ph:user-focus-duotone" class="text-5xl" />
                        <div
                            class="absolute -bottom-2 -right-2 w-8 h-8 bg-navy text-primary rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                            <Icon icon="ph:plus-bold" class="text-sm" />
                        </div>
                    </div>
                </div>
                <div class="space-y-2 mb-10 max-w-sm">
                    <h3 class="text-2xl font-black text-navy tracking-tight">{{ t('organization.scorekeepers.empty_title') }}</h3>
                    <p class="text-sm text-gray-500 leading-relaxed">
                        {{ t('organization.scorekeepers.empty_desc') }}
                    </p>
                </div>
                <BaseButton @click="openAddModal" variant="primary" icon="ph:plus-bold"
                    class="px-8 h-12 shadow-xl shadow-primary/20">
                    {{ t('organization.scorekeepers.add_first') }}
                </BaseButton>
            </div>

            <!-- No Results State -->
            <div v-else-if="!loading && filteredScorekeepers.length === 0"
                class="flex flex-col items-center justify-center py-32 px-6 text-center">
                <div class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 text-gray-300">
                    <Icon icon="ph:magnifying-glass-duotone" class="text-4xl" />
                </div>
                <div class="space-y-1 mb-8">
                    <h3 class="text-lg font-bold text-navy">{{ t('common.no_results') }}</h3>
                    <p class="text-sm text-gray-500 max-w-xs mx-auto">
                        {{ t('common.no_results_desc') }} "<span class="font-bold text-navy">{{ searchQuery
                            }}</span>".
                    </p>
                </div>
                <BaseButton @click="searchQuery = ''" variant="white" size="sm" class="font-bold">
                    {{ t('common.clear_search') }}
                </BaseButton>
            </div>

            <!-- Table View -->
            <div v-if="filteredScorekeepers.length > 0" class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50/50 border-b border-gray-100">
                            <th @click="toggleSort('name')"
                                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organization.scorekeepers.table_profile') }}
                                    <Icon v-if="sortBy === 'name'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('code')"
                                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organization.scorekeepers.table_code') }}
                                    <Icon v-if="sortBy === 'code'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('status')"
                                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organization.scorekeepers.table_status') }}
                                    <Icon v-if="sortBy === 'status'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th @click="toggleSort('created_at')"
                                class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest cursor-pointer hover:text-navy transition-colors">
                                <div class="flex items-center gap-2">
                                    {{ t('organization.scorekeepers.table_joined') }}
                                    <Icon v-if="sortBy === 'created_at'"
                                        :icon="order === 'ASC' ? 'ph:caret-up-fill' : 'ph:caret-down-fill'"
                                        class="text-primary" />
                                    <Icon v-else icon="ph:caret-up-down" class="opacity-30" />
                                </div>
                            </th>
                            <th class="px-6 py-4  text-xs font-extrabold text-gray-400 tracking-widest text-right">
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
                                    :class="sk.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'"
                                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg  text-xs font-bold border capitalize tracking-wider">
                                    <span :class="sk.status === 'active' ? 'bg-green-500' : 'bg-red-500'"
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
                                        variant="white" size="sm" icon="ph:pencil-simple"
                                        class="h-9 w-9 p-0 text-gray-400 hover:text-primary border-slate-200"
                                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }" />
                                    <BaseButton
                                        @click="isSubscriptionActive ? confirmDelete(sk) : (showPremiumModal = true)"
                                        variant="white" size="sm" icon="ph:trash"
                                        class="h-9 w-9 p-0 text-red-400 hover:text-red-500 border-slate-200"
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
            :header="modal.isEdit ? t('organization.scorekeepers.modal.edit_title') : t('organization.scorekeepers.modal.add_title')">
            <div class="flex flex-col gap-4">
                <BaseInput v-model="form.name"
                    :label="t('organization.scorekeepers.modal.name_label')"
                    :placeholder="t('organization.scorekeepers.modal.name_placeholder')"
                    required />

                <div v-if="!modal.isEdit"
                    class="bg-primary/5 border border-primary/20 p-4 rounded-xl flex gap-3 items-start">
                    <Icon icon="ph:info-bold" class="text-primary text-lg flex-shrink-0 mt-0.5" />
                    <p class=" text-xs text-navy/70 leading-relaxed font-medium">
                        {{ t('organization.scorekeepers.modal.info_generate') }}
                    </p>
                </div>

                <div v-if="modal.isEdit" class="mt-2">
                    <label class="block text-xs font-black text-gray-500 tracking-widest mb-2">
                        {{ t('organization.scorekeepers.modal.status_label') }}
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
                        {{ modal.isEdit ? t('common.save_changes') : t('organization.scorekeepers.modal.generate') }}
                    </BaseButton>
                </div>
            </template>
        </BaseDialogForm>

        <!-- Delete Confirmation -->
        <AppDialog v-model:show="deleteState.show"
            :title="t('organization.scorekeepers.delete.title')"
            :message="t('organization.scorekeepers.delete.message')"
            :confirm-text="t('organization.scorekeepers.delete.confirm')"
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

definePageMeta({
    middleware: ['auth'],
    layout: 'dashboard'
})

useHead({
    title: 'Manajemen Scorekeeper - Archeris Dashboard'
})

const { isSubscriptionActive } = useSubscription()
const { t } = useI18n()
const api = useApi()
const toast = useToast()

const showPremiumModal = ref(false)
const scorekeepers = ref([])
const searchQuery = ref('')
const loading = ref(true)

// Sort & Pagination
const sortBy = ref('created_at')
const order = ref('DESC')
const currentPage = ref(1)
const totalItems = ref(0)
const limit = ref(10)

const filteredScorekeepers = computed(() => scorekeepers.value)

const fetchScorekeepers = async () => {
    loading.value = true
    try {
        const offset = (currentPage.value - 1) * limit.value
        const res = await api.get('/organizations/scorekeepers', {
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
        toast.error(t('organization.scorekeepers.fetch_error'))
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
    toast.success(t('organization.scorekeepers.code_copied'))
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
            await api.put(`/organizations/scorekeepers/${modal.currentId}`, {
                name: form.name,
                status: form.status
            })
            toast.success(t('organization.scorekeepers.update_success'))
        } else {
            const res = await api.post('/organizations/scorekeepers', {
                name: form.name
            })
            toast.success(t('organization.scorekeepers.create_success'))
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
        await api.delete(`/organizations/scorekeepers/${deleteState.target.uuid}`)
        toast.success(t('organization.scorekeepers.delete_success'))
        fetchScorekeepers()
    } catch (error) {
        toast.error(t('organization.scorekeepers.delete_error'))
    } finally {
        deleteState.show = false
    }
}

onMounted(fetchScorekeepers)
</script>

<style scoped></style>
