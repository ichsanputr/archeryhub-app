<template>
    <div class="flex flex-col gap-6 pb-12">
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="active_subscription" />
        <!-- Enhanced Header -->
        <div
            class="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-navy via-navy to-navy/90 text-white shadow-sm">
            <!-- Theme Motif Pattern -->
            <div class="absolute inset-0"
                style="background-image: var(--motif-pattern); opacity: var(--motif-opacity, 0.2);">
            </div>

            <!-- Decorative Background Elements -->
            <div class="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl"></div>
            <div class="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-yellow-200 to-primary"></div>

            <!-- Header Content -->
            <div class="relative p-6 sm:p-8">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div class="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:user" class="text-white text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1 min-w-0">
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2 truncate">
                                {{ t('participant.detail.title') }}
                            </h1>
                            <div class="text-slate-300 text-sm max-w-2xl">
                                {{ t('participant.detail.subtitle') }}
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                            <BaseButton variant="primary" icon="ph:floppy-disk"
                            class="h-10 md:h-11 px-4 md:px-6 shadow-lg shadow-primary/30 hover:shadow-sm hover:shadow-primary/40 transition-all font-black"
                            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                            @click="isSubscriptionActive ? handleSubmit() : (showPremiumModal = true)" :loading="isSubmitting">
                            <span class="hidden sm:inline">{{ t('participant.detail.save_button') }}</span>
                            <span class="sm:hidden">{{ t('participant.detail.save_short') }}</span>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>

        <template v-if="isLoading">
            <!-- Loading State -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div
                    class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full">
                </div>
                <div class="text-gray-500 mt-4 font-medium">{{ t('participant.detail.loading') }}</div>
            </div>
        </template>

        <template v-else-if="participant">

            <!-- Edit Form (Unified Page) -->
            <form @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Main Form Column -->
                <div class="lg:col-span-2 space-y-6">
                    <!-- Participant Info -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-hidden relative">
                        <!-- Approved Badge Watermark -->
                        <div v-if="form.accreditation_status === 'approved'"
                            class="absolute -right-8 -top-8 rotate-12 opacity-[0.03] select-none pointer-events-none">
                            <Icon icon="ph:seal-check-fill" class="text-[200px]" />
                        </div>

                            <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:user" class="text-primary" />
                            {{ t('participant.detail.info_title') }}
                        </h2>

                        <div class="space-y-6">
                            <div
                                class="flex flex-col md:flex-row items-start md:items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 relative z-10">
                                <div
                                    class="h-16 w-16 rounded-xl bg-white shadow-sm flex items-center justify-center text-navy font-bold text-xl  border border-gray-100 overflow-hidden shrink-0">
                                    <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                        class="w-full h-full object-cover">
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="font-black text-navy text-lg">{{ participant.full_name }}</div>
                                    <div class="flex flex-wrap items-center gap-3 mt-2">
                                        <div class="text-sm font-bold text-gray-500 flex items-center gap-1.5">
                                            <Icon icon="ph:identification-card" />
                                            {{ participant.athlete_code || '-' }}
                                        </div>
                                        <span class="text-gray-300">•</span>
                                        <span :class="getStatusClass(form.payment_status)"
                                            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border">
                                            {{ getDisplayStatus(form.payment_status) }}
                                        </span>
                                        <span class="text-gray-300">•</span>
                                        <!-- Registration Source Badge -->
                                        <span :class="getSourceClass(participant.registration_source)"
                                            class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border">
                                            <Icon :icon="getSourceIcon(participant.registration_source)"
                                                class="text-sm" />
                                            {{ getSourceLabel(participant.registration_source) }}
                                        </span>
                                        <div class="text-gray-300">•</div>
                                        <div class="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                            <Icon icon="ph:calendar-check" />
                                            {{ formatDate(participant?.registration_date) }}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="space-y-4">
                                <label
                                    class="block text-sm font-black text-navy tracking-widest flex items-center gap-2">
                                    <Icon icon="ph:trophy-bold" class="text-primary" />
                                    {{ t('participant.detail.division_label') }}
                                </label>

                                <div class="relative">
                                    <input v-model="categorySearch" type="text"
                                        :placeholder="t('participant.detail.search_placeholder')"
                                        class="w-full h-10 px-4 pl-10 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
                                    <Icon icon="ph:magnifying-glass"
                                        class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>

                                <div class="max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div v-for="category in filteredCategories" :key="category.id"
                                            class="p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between group"
                                            :class="form.category_ids.includes(category.id)
                                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/5'
                                                : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'"
                                            @click="toggleCategory(category.id)">
                                            <div class="flex items-center gap-4">
                                                <div class="size-6 rounded-lg border-2 flex items-center justify-center transition-all"
                                                    :class="form.category_ids.includes(category.id)
                                                        ? 'bg-primary border-primary'
                                                        : 'bg-white border-gray-300 group-hover:border-navy'">
                                                    <Icon v-if="form.category_ids.includes(category.id)"
                                                        icon="ph:check-bold" class="text-navy text-xs" />
                                                </div>
                                                <div class="flex flex-col">
                                                    <span class="text-sm font-black text-navy leading-tight">{{
                                                        category.label }}</span>
                                                    <span
                                                        class="text-[10px] text-gray-500 font-bold tracking-wider mt-1">{{
                                                            category.description }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="filteredCategories.length === 0" class="py-12 text-center text-gray-400">
                                        <Icon icon="ph:magnifying-glass-slash"
                                            class="text-3xl mx-auto mb-2 opacity-50" />
                                        <p class="text-xs font-bold tracking-widest">{{ t('participant.detail.category_not_found') }}
                                        </p>
                                    </div>
                                </div>
                                <div class=" text-xs text-gray-500 font-medium px-1 flex items-center gap-2">
                                    <Icon icon="ph:info-bold" class="text-navy" />
                                    {{ t('participant.detail.multiple_selection_note') }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Payment Info -->
                    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                            <Icon icon="ph:currency-circle-dollar" class="text-primary" />
                            {{ t('participant.detail.payment_title') }}
                        </h2>
                        <div class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BaseSelect v-model="form.payment_status" :label="t('participant.detail.payment_status_label')" required
                                    icon="ph:currency-circle-dollar" :items="paymentStatusOptions" item-title="label"
                                    item-value="value" />

                                <BaseInput v-model="form.payment_amount" :label="t('participant.detail.payment_amount_label')" placeholder="0"
                                    icon="ph:money" kind="currency" required />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">



                    <!-- Kick Participant -->
                    <div class="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6">
                        <h3 class="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                            <Icon icon="ph:warning-circle" class="text-lg" />
                            {{ t('participant.detail.kick.title') }}
                        </h3>
                        <div class="text-[10px] text-red-500/80 mb-4 leading-relaxed font-bold">
                            {{ t('participant.detail.kick.description') }}
                        </div>
                        <BaseButton variant="danger" block icon="ph:user-minus"
                            class="h-10 text-xs shadow-lg shadow-red-200" :disabled="participant.in_elimination"
                            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }"
                            @click="isSubscriptionActive ? (showKickDialog = true) : (showPremiumModal = true)">
                            {{ participant.in_elimination ? t('participant.detail.kick.cannot_remove') : t('participant.detail.kick.remove_button') }}
                        </BaseButton>
                    </div>
                </div>
            </form>

            <!-- Kick Participant Confirmation Dialog -->
            <BaseDialogForm v-model="showKickDialog" @close="showKickDialog = false">
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="size-10 bg-red-50 rounded-xl flex items-center justify-center shadow-inner">
                            <Icon icon="ph:user-minus-bold" class="text-xl text-red-600" />
                        </div>
                        <h2 class="text-xl font-black text-navy">{{ t('participant.detail.kick.confirm_title') }}</h2>
                    </div>
                </template>
                <div class="space-y-4">
                    <div class="flex flex-col items-center text-center gap-4">
                        <div
                            class="h-20 w-20 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden shrink-0 ring-4 ring-red-50">
                            <img :src="useImageOrDefault(participant?.avatar_url, participant?.full_name)"
                                class="w-full h-full object-cover">
                        </div>
                        <div>
                            <h3 class="text-lg font-bold text-navy mb-2">{{ t('participant.detail.kick.confirm_heading') }}</h3>
                            <p class="text-gray-500 text-sm leading-relaxed">
                                {{ t('participant.detail.kick.confirm_message', { name: participant?.full_name }) }}
                            </p>
                            <p class="text-red-600 text-xs mt-2 font-semibold">
                                {{ t('participant.detail.kick.confirm_warning') }}
                            </p>
                        </div>
                    </div>
                </div>

                <template #action>
                    <BaseButton variant="white" @click="showKickDialog = false">{{ t('common.cancel') }}</BaseButton>
                    <BaseButton variant="danger" @click="handleKickUser" :loading="isKicking">
                        <Icon icon="ph:user-minus" class="mr-2" />
                        {{ t('participant.detail.kick.remove_button') }}
                    </BaseButton>
                </template>
            </BaseDialogForm>
        </template>

        <!-- Error State -->
        <template v-else>
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <Icon icon="ph:warning-circle" class="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 class="text-lg font-bold text-navy mb-2">{{ t('participant.detail.not_found_title') }}</h3>
                <div class="text-gray-500 mb-4">{{ t('participant.detail.not_found_message') }}</div>
                <BaseButton variant="primary" :to="`/dashboard/events/${route.params.id}/participants`">
                    {{ t('participant.detail.back_to_list') }}
                </BaseButton>
            </div>
        </template>

        <MediaLibrary :show="showMediaLibrary" @close="showMediaLibrary = false" @select="handleMediaSelect" />
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import Breadcrumbs from '~/components/common/Breadcrumbs.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { definePageMeta } from '#imports'
import { useSubscription } from '~/composables/useSubscription'
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'

const { isSubscriptionActive } = useSubscription()
const showPremiumModal = ref(false)

definePageMeta({
    layout: 'dashboard'
})

const { t } = useI18n()

useHead({
    title: `${t('participant.detail.title')} - ArcheryHub Dashboard`
})

const route = useRoute()
const router = useRouter()
const { get, put, delete: del } = useApi()
const toast = useToast()

const breadcrumbItems = computed(() => [
    { label: t('breadcrumbs.dashboard'), path: '/dashboard' },
    { label: t('breadcrumbs.events'), path: '/dashboard/events' },
    { label: t('participant.list.title'), path: `/dashboard/events/${route.params.id}/participants` }
])

const eventId = route.params.id
const participantId = route.params.participantId
const isLoading = ref(true)
const isSubmitting = ref(false)
const isKicking = ref(false)
const showKickDialog = ref(false)
const participant = ref(null)
const event = ref(null)
const categories = ref([])
const showMediaLibrary = ref(false)
const categorySearch = ref('')

const filteredCategories = computed(() => {
    let list = [...categories.value]

    // Sort: registered ones first
    list.sort((a, b) => {
        const aIsReg = form.category_ids.includes(a.id)
        const bIsReg = form.category_ids.includes(b.id)
        if (aIsReg && !bIsReg) return -1
        if (!aIsReg && bIsReg) return 1
        return 0
    })

    if (!categorySearch.value) return list
    const search = categorySearch.value.toLowerCase()
    return list.filter(c =>
        c.label.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search)
    )
})
const form = reactive({
    category_ids: [],
    payment_status: 'unpaid',
    payment_amount: 0
})

const toggleCategory = (id) => {
    const index = form.category_ids.indexOf(id)
    if (index === -1) form.category_ids.push(id)
    else form.category_ids.splice(index, 1)
}

const paymentStatusOptions = [
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Unpaid', value: 'unpaid' }
]

const targetNumberText = computed(() => {
    return participant.value?.target_name || t('participant.detail.tbd')
})

const fetchParticipant = async () => {
    isLoading.value = true
    try {
        console.log(`[DEBUG] Fetching participant ${participantId} for event ${eventId}`)
        // Fetch specific participant by athlete_code or id
        const found = await get(`/events/${eventId}/participants/${participantId}`)
        console.log('[DEBUG] API Response:', found)
        if (found) {
            participant.value = found
            // Populate form
            form.category_ids = [...new Set(found.categories?.map(c => c.category_id) || (found.category_id ? [found.category_id] : []))]
            form.payment_status = found.payment_status || 'unpaid'
            form.payment_amount = found.payment_amount || 0
        }

        // Fetch event details and categories
        const [eventRes, categoriesRes] = await Promise.all([
            get(`/events/${eventId}`),
            get(`/events/${eventId}/categories?limit=500`)
        ])
        event.value = eventRes
        categories.value = categoriesRes.events.map(cat => ({
            id: cat.id,
            label: formatCategoryName(cat),
            description: `${cat.event_type_name || ''} ${cat.gender_division_name ? '(' + cat.gender_division_name + ')' : ''}`.trim()
        }))
    } catch (error) {
        console.error('Failed to fetch participant:', error)
        toast.error(t('participant.detail.toast.load_failed'))
    } finally {
        isLoading.value = false
    }
}


const formatCategoryName = (category) => {
    return [
        category.division_name || category.division,
        category.category_name || category.category || category.age_category || category.class_category,
        category.event_type_name || category.event_type,
        category.gender_division_name || category.gender
    ].filter(Boolean).join(' - ') || t('participant.detail.category_fallback')
}

const formatDate = (dateStr) => {
    if (!dateStr) return t('participant.detail.tbd')
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(value)
}

const getCategoryName = (p) => {
    if (!p) return t('participant.detail.loading_short')
    const cat = categories.value.find(c => c.id === p.category_id)
    return cat ? cat.label : t('participant.detail.select_category')
}

const getDisplayStatus = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'lunas' || s === 'paid' || s === 'registered' || s === 'terdaftar') return t('participant.status.registered')
    return t('participant.status.pending')
}

const getStatusClass = (status) => {
    const s = (status || '').toLowerCase()
    if (s === 'paid' || s === 'lunas' || s === 'registered' || s === 'terdaftar') {
        return 'bg-green-50 text-green-600 border-green-200'
    }
    return 'bg-amber-50 text-amber-600 border-amber-200'
}

const getSourceLabel = (source) => {
    switch (source) {
        case 'invited': return t('participant.source.invited')
        case 'admin_created': return t('participant.source.admin_created')
        case 'self_register':
        default: return t('participant.source.self_registered')
    }
}

const getSourceClass = (source) => {
    switch (source) {
        case 'invited': return 'bg-purple-50 text-purple-600 border-purple-200'
        case 'admin_created': return 'bg-blue-50 text-blue-600 border-blue-200'
        case 'self_register':
        default: return 'bg-gray-50 text-gray-500 border-gray-200'
    }
}

const getSourceIcon = (source) => {
    switch (source) {
        case 'invited': return 'ph:envelope-open'
        case 'admin_created': return 'ph:shield-star'
        case 'self_register':
        default: return 'ph:user-circle'
    }
}



const handleSubmit = async () => {
    isSubmitting.value = true
    try {
        const payload = {
            category_ids: form.category_ids,
            payment_status: form.payment_status,
            payment_amount: parseFloat(form.payment_amount) || 0,
            athlete_id: participant.value?.archer_id // Or participant.value?.athlete_code
        }
        await put(`/events/${eventId}/participants/${participantId}`, payload)
        toast.success(t('participant.detail.toast.update_success'))
        await fetchParticipant()
    } catch (error) {
        console.error('Failed to update participant:', error)
        toast.error(error?.data?.error || t('participant.detail.toast.update_failed'))
    } finally {
        isSubmitting.value = false
    }
}

const handleKickUser = async () => {
    isKicking.value = true
    try {
        await del(`/events/${eventId}/participants/${participantId}`)
        toast.success(t('participant.detail.toast.kick_success'))
        showKickDialog.value = false
        router.push(`/dashboard/events/${eventId}/participants`)
    } catch (error) {
        console.error('Failed to kick participant:', error)
        toast.error(error?.data?.error || t('participant.detail.toast.kick_failed'))
    } finally {
        isKicking.value = false
    }
}

onMounted(() => {
    fetchParticipant()
})
</script>
