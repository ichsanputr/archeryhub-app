<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { useImageOrDefault } from '~/composables/useImageHelper'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import BaseButton from '~/components/common/BaseButton.vue'
import BaseInput from '~/components/common/BaseInput.vue'
import BaseSelect from '~/components/common/BaseSelect.vue'

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { get, put } = useApi()
const toast = useToast()

const eventId = computed(() => route.params.id)
const archerId = computed(() => route.query.archer_id || route.params.participantId || route.params.archer_id)

const isLoading = ref(true)
const isSubmitting = ref(false)
const showPremiumModal = ref(false)
const participant = ref(null)
const categories = ref([])
const categorySearch = ref('')

const initialCategoryIds = ref([])
const initialPaymentAmount = ref(0)
const initialPaymentStatus = ref('paid')
const lockedCategoryMap = ref({})

const tournamentSettings = ref({
    fee_mode: 'per_type',
    fee_per_type: { individual: 0, team: 0, mixed_team: 0 },
    fee_per_category: {},
    entry_fee: 0
})

const settleCashNow = ref(true)
const settleRefundNow = ref(false)

const form = reactive({
    full_name: '',
    club_id: '',
    category_ids: [],
    back_number: '',
    payment_status: 'paid',
    payment_amount: 0,
    reregistered: false,
    notes: ''
})

const paymentStatusOptions = computed(() => [
    { value: 'paid', title: t('participant.edit.status_paid') },
    { value: 'pending', title: t('participant.edit.status_pending') },
    { value: 'cancelled', title: t('participant.edit.status_cancelled') }
])

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(Number(amount) || 0)
}

const getCategoryType = (category) => {
    const typeName = (category?.event_type_name || category?.type || category?.name || '').toLowerCase()
    if (typeName.includes('mixed')) return 'mixed_team'
    if (typeName.includes('team')) return 'team'
    return 'individual'
}

const getFeeForCategory = (catId) => {
    const category = categories.value.find(c => (c.id || c.uuid) === catId)
    const settings = tournamentSettings.value

    if (settings.fee_mode === 'per_category') {
        if (settings.fee_per_category && settings.fee_per_category[catId] !== undefined && settings.fee_per_category[catId] !== '') {
            return Number(settings.fee_per_category[catId]) || 0
        }
        if (category && (category.price !== undefined || category.fee !== undefined)) {
            return Number(category.price ?? category.fee) || 0
        }
        return Number(settings.entry_fee) || 0
    }

    // per_type mode
    const type = category ? getCategoryType(category) : 'individual'
    if (settings.fee_per_type && settings.fee_per_type[type] !== undefined) {
        return Number(settings.fee_per_type[type]) || 0
    }
    return Number(settings.entry_fee) || 0
}

const calculatedNewTotal = computed(() => {
    if (!form.category_ids || form.category_ids.length === 0) return 0
    return form.category_ids.reduce((sum, catId) => sum + getFeeForCategory(catId), 0)
})

const financialDelta = computed(() => {
    return Number(form.payment_amount) - Number(initialPaymentAmount.value)
})

const proofUrl = computed(() => {
    return participant.value?.transaction?.proof_url ||
        participant.value?.payment_proof_url ||
        (participant.value?.payment_proof_urls && participant.value?.payment_proof_urls[0]) ||
        null
})
const showProofModal = ref(false)

useHead({
    title: computed(() => `${t('participant.edit.title')} - Archeris Dashboard`)
})

onMounted(async () => {
    await fetchParticipantData()
})

const fetchParticipantData = async () => {
    if (!archerId.value || !eventId.value) return
    isLoading.value = true
    try {
        const [partRes, catRes, eventRes] = await Promise.all([
            get(`/tournaments/${eventId.value}/participants/${archerId.value}`),
            get(`/tournaments/${eventId.value}/categories`),
            get(`/tournaments/${eventId.value}`)
        ])
        const p = partRes?.data || partRes
        participant.value = p
        
        // Extract categories list properly from catRes
        const catList = catRes?.events || catRes?.categories || catRes?.data || (Array.isArray(catRes) ? catRes : [])
        categories.value = catList

        // Extract tournament fee settings
        const ev = eventRes?.data || eventRes || {}
        let pageSettings = {}
        try {
            pageSettings = typeof ev.page_settings === 'string' 
                ? JSON.parse(ev.page_settings || '{}') 
                : (ev.page_settings || {})
        } catch {
            pageSettings = {}
        }

        const defaultEntryFee = Number(ev.entry_fee ?? ev.registration_fee ?? 0)

        tournamentSettings.value = {
            fee_mode: pageSettings.fee_mode || ev.fee_mode || 'per_type',
            fee_per_type: {
                individual: Number(pageSettings.fee_per_type?.individual ?? ev.fee_per_type?.individual ?? defaultEntryFee),
                team: Number(pageSettings.fee_per_type?.team ?? ev.fee_per_type?.team ?? 0),
                mixed_team: Number(pageSettings.fee_per_type?.mixed_team ?? ev.fee_per_type?.mixed_team ?? 0)
            },
            fee_per_category: pageSettings.fee_per_category || ev.fee_per_category || {},
            entry_fee: defaultEntryFee
        }

        // Populate form data
        form.full_name = p.full_name || ''
        form.club_id = p.club_id || ''
        form.back_number = p.back_number || ''
        
        // Normalize payment status
        const rawStatus = (p.payment_status || 'paid').toLowerCase()
        if (rawStatus === 'lunas' || rawStatus === 'paid' || rawStatus === 'confirmed') {
            form.payment_status = 'paid'
        } else if (rawStatus === 'cancelled' || rawStatus === 'rejected') {
            form.payment_status = 'cancelled'
        } else {
            form.payment_status = 'pending'
        }

        initialPaymentStatus.value = form.payment_status
        form.payment_amount = Number(p.payment_amount) || 0
        initialPaymentAmount.value = Number(p.payment_amount) || 0
        form.reregistered = !!(
            p.last_reregistration_at ||
            p.reregistered ||
            p.is_reregistered ||
            p.checked_in ||
            (p.categories && Array.isArray(p.categories) && p.categories.some(c => c.last_reregistration_at || c.reregistered || c.checked_in))
        )
        form.notes = p.notes || ''

        // Populate registered category IDs and lock status
        const lockedMap = {}
        if (p.categories && Array.isArray(p.categories) && p.categories.length > 0) {
            form.category_ids = p.categories.map(c => {
                const catId = c.category_id || c.id || c.uuid
                if (catId) {
                    lockedMap[catId] = {
                        is_locked: !!c.is_locked,
                        has_scores: !!c.has_scores,
                        in_elimination: !!c.in_elimination
                    }
                }
                return catId
            }).filter(Boolean)
        } else if (p.category_id) {
            form.category_ids = [p.category_id]
            lockedMap[p.category_id] = {
                is_locked: !!p.is_locked,
                has_scores: !!p.has_scores,
                in_elimination: !!p.in_elimination
            }
        } else if (p.category_ids && Array.isArray(p.category_ids)) {
            form.category_ids = [...p.category_ids]
        } else {
            form.category_ids = []
        }

        initialCategoryIds.value = [...form.category_ids]
        lockedCategoryMap.value = lockedMap

    } catch (err) {
        console.error('Failed to load participant for edit:', err)
        toast.error(t('common.error_loading'))
    } finally {
        isLoading.value = false
    }
}

const getCategoryTitle = (cat) => {
    if (!cat) return '-'
    if (cat.label) return cat.label
    if (cat.name) return cat.name
    const parts = [
        cat.division_name,
        cat.category_name || cat.age_category_name,
        cat.event_type_name,
        cat.gender_division_name
    ].filter(Boolean)
    return parts.length > 0 ? parts.join(' • ') : (cat.category_code || t('participant.detail.category_fallback'))
}

const getCategorySubtitle = (cat) => {
    if (!cat) return '-'
    if (cat.description) return cat.description
    if (cat.class_name) return cat.class_name
    const details = [
        cat.event_type_name,
        cat.gender_division_name
    ].filter(Boolean)
    return details.length > 0 ? details.join(' • ') : '-'
}

const filteredCategories = computed(() => {
    if (!categorySearch.value) return categories.value
    const q = categorySearch.value.toLowerCase()
    return categories.value.filter(c => {
        const title = getCategoryTitle(c).toLowerCase()
        const subtitle = getCategorySubtitle(c).toLowerCase()
        return title.includes(q) || subtitle.includes(q)
    })
})

const isCategoryLocked = (catId) => {
    return !!lockedCategoryMap.value[catId]?.is_locked
}

const isCategoryNew = (catId) => {
    return form.category_ids.includes(catId) && !initialCategoryIds.value.includes(catId)
}

const toggleCategory = (id) => {
    const isCurrentlySelected = form.category_ids.includes(id)

    // Score protection: If category is locked (has scores / in elimination), prevent deselecting!
    if (isCurrentlySelected && isCategoryLocked(id)) {
        toast.error(t('participant.edit.cannot_remove_locked_category'))
        return
    }

    const idx = form.category_ids.indexOf(id)
    if (idx > -1) {
        if (form.category_ids.length === 1) {
            toast.warning(t('participant.edit.min_one_category'))
            return
        }
        form.category_ids.splice(idx, 1)
    } else {
        form.category_ids.push(id)
    }

    // Auto-update payment amount based on total categories selected
    form.payment_amount = calculatedNewTotal.value
}

const handleSubmit = async () => {
    if (!archerId.value || !eventId.value) return
    if (!form.full_name || !form.full_name.trim()) {
        toast.error(t('participant.edit.name_required'))
        return
    }
    if (form.category_ids.length === 0) {
        toast.error(t('participant.edit.min_one_category'))
        return
    }

    isSubmitting.value = true
    try {
        const payload = {
            full_name: form.full_name.trim(),
            club_id: form.club_id || '',
            category_ids: form.category_ids,
            back_number: form.back_number ? form.back_number.trim() : null,
            payment_status: form.payment_status,
            payment_amount: Number(form.payment_amount) || 0,
            reregistered: form.reregistered,
            notes: form.notes || ''
        }

        // Attach financial mutation ledger instructions if applicable
        if (financialDelta.value > 0 && settleCashNow.value) {
            payload.record_transaction = true
            payload.payment_method = 'cash_on_desk'
            payload.payment_status = 'paid'
            payload.transaction_amount = financialDelta.value
            payload.transaction_notes = t('participant.edit.trx_notes_cash_on_desk')
        } else if (financialDelta.value < 0 && settleRefundNow.value) {
            payload.record_transaction = true
            payload.payment_method = 'refund'
            payload.transaction_amount = Math.abs(financialDelta.value)
            payload.transaction_notes = t('participant.edit.trx_notes_refund')
        }

        await put(`/tournaments/${eventId.value}/participants/${archerId.value}`, payload)
        toast.success(t('participant.edit.save_success'))
        router.push(`/dashboard/organizer/tournaments/${eventId.value}/participants/detail?archer_id=${archerId.value}`)
    } catch (err) {
        console.error('Failed to save participant changes:', err)
        toast.error(err?.data?.error || t('participant.edit.save_error'))
    } finally {
        isSubmitting.value = false
    }
}
</script>

<template>
    <div class="flex flex-col gap-6 pb-16">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />

        <!-- Signature Navy Dashboard Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div class="flex items-center gap-4">
                        <NuxtLink
                            :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${archerId}`"
                            class="flex size-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20 hover:scale-105 shrink-0">
                            <Icon icon="ph:arrow-left-bold" class="text-xl" />
                        </NuxtLink>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 text-xs sm:text-sm text-white/70 mb-1.5">
                                <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/participants`" class="hover:text-white transition-colors">
                                    {{ t('dashboard.participants_list.title') }}
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-xs" />
                                <NuxtLink :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${archerId}`" class="hover:text-white transition-colors">
                                    {{ participant?.full_name || t('participant.detail.title') }}
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-xs" />
                                <span class="text-primary font-medium">{{ t('participant.edit.title') }}</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-white truncate">
                                {{ participant?.full_name || t('participant.edit.title') }}
                            </h1>
                            <div class="text-slate-300 text-sm sm:text-base mt-1">
                                {{ t('participant.edit.subtitle') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="isLoading">
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <div class="inline-block size-9 border-2 border-slate-300 border-t-slate-800 animate-spin rounded-full"></div>
                <div class="text-slate-600 mt-4 text-sm sm:text-base font-medium">{{ t('participant.detail.loading') }}</div>
            </div>
        </template>

        <!-- Participant Not Found Empty State -->
        <template v-else-if="!participant">
            <div class="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-xs">
                <div class="size-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                    <Icon icon="ph:user-circle-x-bold" class="text-3xl" />
                </div>
                <h3 class="text-lg font-bold text-slate-800">{{ t('participant.detail.not_found_title') }}</h3>
                <div class="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                    {{ t('participant.detail.not_found_desc') }}
                </div>
                <div class="mt-6 flex justify-center">
                    <BaseButton :to="`/dashboard/organizer/tournaments/${eventId}/participants`" variant="white" icon="ph:arrow-left-bold" class="shadow-xs">
                        {{ t('participant.detail.back_to_list') }}
                    </BaseButton>
                </div>
            </div>
        </template>

        <!-- Unified Single White Card Form Layout -->
        <template v-else>
            <div class="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
                <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    
                    <!-- Left 2 Columns: Athlete Summary & Category Selection -->
                    <div class="lg:col-span-2 space-y-6">

                        <!-- Section 1: Athlete Profile Summary -->
                        <div class="flex items-center gap-5 pb-6 border-b border-slate-100">
                            <div class="size-16 sm:size-20 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                                <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)" class="w-full h-full object-cover">
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-2.5">
                                    <h2 class="text-xl sm:text-2xl font-black text-slate-900 truncate">{{ participant.full_name }}</h2>
                                    <span v-if="participant.athlete_code" class="text-xs sm:text-sm font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                                        {{ participant.athlete_code }}
                                    </span>
                                </div>
                                <div class="text-xs sm:text-sm text-slate-600 flex flex-wrap items-center gap-2.5 font-medium mt-1.5">
                                    <span>{{ participant.club_name || t('participant.edit.independent') }}</span>
                                    <template v-if="participant.email">
                                        <span>•</span>
                                        <span>{{ participant.email }}</span>
                                    </template>
                                    <template v-if="participant.gender_division_name">
                                        <span>•</span>
                                        <span class="capitalize">{{ participant.gender_division_name }}</span>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: Pilihan Kategori Lomba -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
                                <h3 class="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                                    <Icon icon="ph:trophy-bold" class="text-slate-500 text-xl" />
                                    <span>{{ t('participant.edit.categories_title') }}</span>
                                </h3>
                                <span class="text-xs sm:text-sm font-black text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">
                                    {{ t('participant.edit.categories_count', { count: form.category_ids.length }) }}
                                </span>
                            </div>

                            <div class="relative">
                                <input v-model="categorySearch" type="text"
                                    :placeholder="t('participant.edit.search_categories')"
                                    class="w-full h-11 px-4 pl-11 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-slate-800 transition-all font-medium" />
                                <Icon icon="ph:magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                            </div>

                            <div v-if="filteredCategories.length > 0" class="max-h-[460px] overflow-y-auto pr-1 space-y-2.5">
                                <div v-for="category in filteredCategories" :key="category.id || category.uuid"
                                    class="p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between group"
                                    :class="[
                                        form.category_ids.includes(category.id || category.uuid)
                                            ? 'border-slate-800 bg-slate-50/90 shadow-xs'
                                            : 'border-slate-200 bg-white hover:border-slate-300',
                                        isCategoryLocked(category.id || category.uuid)
                                            ? 'border-amber-300 bg-amber-50/30'
                                            : ''
                                    ]"
                                    @click="toggleCategory(category.id || category.uuid)">
                                    <div class="flex items-center gap-3.5 min-w-0">
                                        <div class="size-6 rounded-md border flex items-center justify-center transition-all shrink-0"
                                            :class="[
                                                form.category_ids.includes(category.id || category.uuid)
                                                    ? (isCategoryLocked(category.id || category.uuid) ? 'bg-amber-600 border-amber-600 text-white' : 'bg-slate-900 border-slate-900 text-white')
                                                    : 'bg-white border-slate-300 group-hover:border-slate-500'
                                            ]">
                                            <Icon v-if="form.category_ids.includes(category.id || category.uuid)" icon="ph:check-bold" class="text-xs" />
                                        </div>
                                        <div class="min-w-0">
                                            <div class="flex items-center gap-2.5 flex-wrap">
                                                <span class="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                                                    {{ getCategoryTitle(category) }}
                                                </span>

                                                <!-- Category Fee Badge -->
                                                <span class="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200/80 px-2 py-0.5 rounded-md">
                                                    {{ formatCurrency(getFeeForCategory(category.id || category.uuid)) }}
                                                </span>
                                                
                                                <!-- Locked Badge -->
                                                <span v-if="isCategoryLocked(category.id || category.uuid)" 
                                                    class="text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shrink-0"
                                                    :title="t('participant.edit.category_locked_tooltip')">
                                                    <Icon icon="ph:lock-key-fill" class="text-xs" />
                                                    {{ t('participant.edit.category_locked_badge') }}
                                                </span>

                                                <!-- New Category Badge -->
                                                <span v-else-if="isCategoryNew(category.id || category.uuid)"
                                                    class="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shrink-0">
                                                    <Icon icon="ph:plus-circle-fill" class="text-xs" />
                                                    {{ t('participant.edit.category_new_badge') }}
                                                </span>
                                            </div>
                                            <div class="text-xs sm:text-sm text-slate-500 mt-1 truncate">
                                                {{ getCategorySubtitle(category) }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-xs sm:text-sm font-black text-slate-800 shrink-0 ml-3">
                                        {{ formatCurrency(getFeeForCategory(category.id || category.uuid)) }}
                                    </div>
                                </div>
                            </div>
                            <div v-else class="py-8 text-center text-sm text-slate-400 italic">
                                {{ t('participant.edit.no_categories') }}
                            </div>
                        </div>

                    </div>

                    <!-- Right Column: Fee Calculation, Registration Status, Check-In & Actions -->
                    <div class="lg:col-span-1 space-y-5 lg:border-l lg:border-slate-100 lg:pl-8 lg:pt-0">

                        <!-- Section 1: Financial Reconciliation & Settlement Box -->
                        <div class="space-y-3.5">
                            <div class="pb-2.5 flex items-center justify-between border-b border-slate-100">
                                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Icon icon="ph:calculator-bold" class="text-slate-500 text-lg" />
                                    <span>{{ t('participant.edit.financial_title') }}</span>
                                </h3>
                                <span v-if="financialDelta !== 0" class="text-xs font-black px-2.5 py-0.5 rounded-md whitespace-nowrap shrink-0"
                                    :class="[
                                        financialDelta > 0 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                        'bg-sky-100 text-sky-800 border border-sky-200'
                                    ]">
                                    {{ financialDelta > 0 ? t('participant.edit.fee_delta_underpaid') :
                                       t('participant.edit.fee_delta_overpaid') }}
                                </span>
                            </div>

                            <!-- Financial Breakdown Numbers -->
                            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 text-xs sm:text-sm">
                                <div class="flex items-center justify-between text-slate-600">
                                    <span class="font-medium">{{ t('participant.edit.fee_initial_label') }}</span>
                                    <span class="font-bold text-slate-800">{{ formatCurrency(initialPaymentAmount) }}</span>
                                </div>
                                <div class="flex items-center justify-between text-slate-600">
                                    <span class="font-medium">{{ t('participant.edit.fee_new_label') }} ({{ t('participant.edit.cat_count_short', { count: form.category_ids.length }) }})</span>
                                    <span class="font-bold text-slate-900">{{ formatCurrency(form.payment_amount) }}</span>
                                </div>
                                <div class="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                                    <span class="font-bold text-slate-900">{{ t('participant.edit.fee_delta_label') }}</span>
                                    <span class="text-sm sm:text-base font-black"
                                        :class="[
                                            financialDelta > 0 ? 'text-amber-600' :
                                            financialDelta < 0 ? 'text-sky-600' :
                                            'text-slate-600'
                                        ]">
                                        {{ financialDelta > 0 ? `+ ${formatCurrency(financialDelta)}` :
                                           financialDelta < 0 ? `- ${formatCurrency(Math.abs(financialDelta))}` :
                                           formatCurrency(0) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Underpaid Settlement Option (Cash on Desk) -->
                            <div v-if="financialDelta > 0" class="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5">
                                <label class="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" v-model="settleCashNow" class="mt-0.5 size-4 rounded text-primary focus:ring-primary cursor-pointer">
                                    <div>
                                        <div class="text-xs sm:text-sm font-bold text-amber-950">
                                            {{ t('participant.edit.settle_cash_label') }}
                                        </div>
                                        <div class="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                                            {{ t('participant.edit.settle_cash_desc') }}
                                        </div>
                                    </div>
                                </label>
                            </div>

                            <!-- Overpaid Settlement Option (Refund) -->
                            <div v-else-if="financialDelta < 0" class="p-3.5 bg-sky-50/80 border border-sky-200 rounded-xl space-y-1.5">
                                <label class="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" v-model="settleRefundNow" class="mt-0.5 size-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer">
                                    <div>
                                        <div class="text-xs sm:text-sm font-bold text-sky-950">
                                            {{ t('participant.edit.settle_refund_label') }}
                                        </div>
                                        <div class="text-xs text-sky-900/80 mt-0.5 leading-relaxed">
                                            {{ t('participant.edit.settle_refund_desc') }}
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- Section 2: Payment Status & Total Biaya -->
                        <div class="border-t border-slate-100 pt-5 space-y-3.5">
                            <div class="border-b border-slate-100 pb-2.5 flex items-center justify-between">
                                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Icon icon="ph:credit-card-bold" class="text-slate-500 text-lg" />
                                    <span>{{ t('participant.edit.payment_card_title') }}</span>
                                </h3>
                                <span class="text-xs capitalize font-black px-2.5 py-0.5 rounded-md"
                                    :class="{
                                        'bg-emerald-100 text-emerald-800': form.payment_status === 'paid',
                                        'bg-amber-100 text-amber-800': form.payment_status === 'pending',
                                        'bg-rose-100 text-rose-800': form.payment_status === 'cancelled'
                                    }">
                                    {{ form.payment_status }}
                                </span>
                            </div>

                            <div class="space-y-3">
                                <!-- Status Select -->
                                <BaseSelect
                                    v-model="form.payment_status"
                                    :items="paymentStatusOptions"
                                    :label="t('participant.edit.payment_status_label')"
                                />

                                <!-- Payment Amount -->
                                <div>
                                    <BaseInput
                                        v-model="form.payment_amount"
                                        type="number"
                                        :label="t('participant.edit.payment_amount_label')"
                                        placeholder="0"
                                        icon="ph:coins-bold"
                                    />
                                </div>
                            </div>

                            <!-- Transfer Proof Reference Preview (If available) -->
                            <div v-if="proofUrl" class="mt-3 pt-3 border-t border-slate-100 space-y-2">
                                <div class="flex items-center justify-between text-xs font-bold text-slate-700">
                                    <span class="flex items-center gap-1.5">
                                        <Icon icon="ph:image-square-bold" class="text-slate-500" />
                                        <span>{{ t('participant.detail.transfer_proof_label') }}</span>
                                    </span>
                                    <span v-if="participant?.transaction?.sender_name" class="text-[11px] text-slate-500 font-normal">
                                        a/n {{ participant.transaction.sender_name }}
                                    </span>
                                </div>
                                <div @click="showProofModal = true" class="group relative h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer shadow-2xs hover:border-slate-400 transition-all">
                                    <img :src="proofUrl" alt="Bukti Transfer" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                                    <div class="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                        <Icon icon="ph:magnifying-glass-plus-bold" class="text-sm" />
                                        <span>{{ t('participant.detail.view_fullscreen') }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 3: Venue Check-In -->
                        <div class="border-t border-slate-100 pt-5 space-y-3">
                            <div class="border-b border-slate-100 pb-2.5">
                                <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Icon icon="ph:check-square-offset-bold" class="text-slate-500 text-lg" />
                                    <span>{{ t('participant.edit.checkin_card_title') }}</span>
                                </h3>
                            </div>

                            <div class="flex items-center justify-between p-3.5 rounded-xl border transition-all"
                                :class="form.reregistered ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-slate-200'">
                                <div class="flex items-center gap-3">
                                    <div class="size-8 rounded-lg flex items-center justify-center shrink-0"
                                        :class="form.reregistered ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'">
                                        <Icon :icon="form.reregistered ? 'ph:check-bold' : 'ph:x-bold'" class="text-sm" />
                                    </div>
                                    <div>
                                        <div class="text-xs sm:text-sm font-bold" :class="form.reregistered ? 'text-emerald-900' : 'text-slate-700'">
                                            {{ form.reregistered ? t('participant.edit.checkin_yes') : t('participant.edit.checkin_no') }}
                                        </div>
                                        <div class="text-xs text-slate-500 mt-0.5">
                                            {{ form.reregistered ? t('participant.edit.checkin_desc_yes') : t('participant.edit.checkin_desc_no') }}
                                        </div>
                                    </div>
                                </div>

                                <label class="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input type="checkbox" v-model="form.reregistered" class="sr-only peer">
                                    <div class="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                </label>
                            </div>
                        </div>

                        <!-- Section 4: Save Actions Button -->
                        <div class="border-t border-slate-100 pt-5 space-y-2.5">
                            <BaseButton type="submit" variant="primary" icon="ph:floppy-disk-bold" class="w-full h-11 justify-center text-sm sm:text-base font-black shadow-md shadow-primary/20" :loading="isSubmitting">
                                {{ t('common.save_changes') }}
                            </BaseButton>
                            <BaseButton :to="`/dashboard/organizer/tournaments/${eventId}/participants/detail?archer_id=${archerId}`" variant="white" icon="ph:arrow-left-bold" class="w-full h-11 justify-center text-sm sm:text-base font-bold shadow-xs">
                                {{ t('common.cancel') }}
                            </BaseButton>
                        </div>

                    </div>

                </form>
            </div>
        </template>

        <!-- Proof Zoom Dialog -->
        <AppDialog v-model:show="showProofModal" :title="t('participant.detail.transfer_proof_label')" message="" type="info" icon="ph:image-bold">
            <div class="flex justify-center p-2">
                <img :src="proofUrl" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-md" />
            </div>
        </AppDialog>
    </div>
</template>
