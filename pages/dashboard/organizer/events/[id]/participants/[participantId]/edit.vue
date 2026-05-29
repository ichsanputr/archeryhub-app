<template>
    <div class="flex flex-col gap-6 pb-12">
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
                    <div class="flex items-start gap-4">
                        <!-- Icon Badge -->
                        <div
                            class="h-14 w-14 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-lg flex-shrink-0">
                            <Icon icon="ph:pencil-simple" class="text-primary text-2xl" />
                        </div>

                        <!-- Title Section -->
                        <div class="flex-1">
                            <div class="flex items-center gap-2 text-sm text-slate-300 mb-2 font-bold tracking-tight">
                                <NuxtLink :to="`/dashboard/events/${route.params.id}/participants`"
                                    class="hover:text-white transition-colors">
                                    {{ t('participant.list.title') }}
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                                <NuxtLink
                                    :to="`/dashboard/events/${route.params.id}/participants/${route.params.participantId}`"
                                    class="hover:text-white transition-colors">
                                    {{ t('participant.detail.title') }}
                                </NuxtLink>
                                <Icon icon="ph:caret-right-bold" class="text-[12px]" />
                                <span class="text-white">{{ t('participant.edit.title_short') }}</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black leading-tight tracking-tight mb-2">
                                {{ t('participant.edit.title') }}
                            </h1>
                            <p class="text-slate-300 text-sm max-w-2xl">
                                {{ t('participant.edit.subtitle') }}
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-3 flex-shrink-0">
                        <BaseButton variant="white" icon="ph:arrow-left" class="h-11 px-5"
                            @click="$router.push(`/dashboard/events/${route.params.id}/participants/${route.params.participantId}`)">
                            {{ t('common.cancel') }}
                        </BaseButton>
                        <BaseButton variant="primary" icon="ph:floppy-disk"
                            class="h-11 px-5 shadow-lg shadow-primary/30 hover:shadow-sm hover:shadow-primary/40 transition-all"
                            @click="isSubscriptionActive ? handleSubmit() : (showPremiumModal = true)"
                            :loading="isSubmitting"
                            :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }">
                            {{ t('participant.edit.actions.save_changes') }}
                        </BaseButton>
                    </div>
                </div>
            </div>
        </div>
        <PremiumRequiredModal v-model:show="showPremiumModal" feature="participant_update" />

        <!-- Loading State -->
            <div v-if="isLoading" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div class="inline-block h-8 w-8 border-4 border-primary border-t-transparent animate-spin rounded-full">
            </div>
            <p class="text-gray-500 mt-4 font-medium">{{ t('participant.detail.loading') }}</p>
        </div>

        <!-- Edit Form -->
        <form v-else-if="participant" @submit.prevent="handleSubmit" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Main Form -->
            <div class="lg:col-span-2 space-y-6">
                <!-- Participant Info -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 class="text-lg font-bold text-navy mb-6 flex items-center gap-2">
                        <Icon icon="ph:user" class="text-primary" />
                        {{ t('participant.detail.info_title') }}
                    </h2>
                    <div class="space-y-6">
                        <!-- Participant Profile Info (Read-only for now) -->
                        <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <div
                                class="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center text-navy font-bold text-xl  border border-gray-200 overflow-hidden">
                                <img :src="useImageOrDefault(participant.avatar_url, participant.full_name)"
                                    class="w-full h-full object-cover">
                            </div>
                            <div>
                                <p class="font-bold text-navy truncate">{{ participant.full_name }}</p>
                                <div class="flex items-center gap-2 mt-1">
                                    <span class="text-xs text-gray-500 font-medium">@{{ participant.username ||
                                        'user' }}</span>
                                    <span
                                        class="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold  tracking-wider">
                                        Archeryhub Account
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="pt-6 border-t border-gray-50">
                            <h3 class="text-sm font-bold text-navy mb-4">{{ t('participant.edit.competition_info') }}</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <BaseSelect v-model="form.category_id" :label="t('participant.edit.select_category')" required
                                    :placeholder="t('participant.edit.select_category_placeholder')" icon="ph:trophy" :items="categories" item-title="label"
                                    item-value="id" />
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
                            <BaseSelect v-model="form.status" :label="t('participant.detail.payment_status_label')" required icon="ph:checks"
                                :items="statusOptions" />

                            <BaseInput v-model="form.payment_amount" :label="t('participant.edit.payment_amount_label')" :placeholder="t('participant.edit.payment_amount_placeholder')"
                                icon="ph:money" kind="currency" />
                        </div>

                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="space-y-6">
                <!-- Info Card -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-sm font-bold text-navy mb-4">{{ t('participant.edit.event') }}</h3>
                    <div v-if="event" class="space-y-3">
                        <p class="font-bold text-navy text-sm">{{ event.name }}</p>
                        <div class="space-y-2 text-xs text-gray-500">
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:calendar" />
                                <span>{{ formatDate(event.start_date) }}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <Icon icon="ph:map-pin" />
                                <span>{{ event.venue || 'TBD' }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tips -->
                <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 class="text-sm font-bold text-navy mb-3">{{ t('participant.edit.tips_title') }}</h3>
                    <ul class="space-y-2 text-xs text-gray-500">
                        <li class="flex items-start gap-2">
                            <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{{ t('participant.edit.tips.1') }}</span>
                        </li>
                        <li class="flex items-start gap-2">
                            <Icon icon="ph:check-circle" class="text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{{ t('participant.edit.tips.2') }}</span>
                        </li>
                    </ul>
                </div>
                <!-- Danger Zone -->
                <div class="bg-red-50 rounded-2xl border border-red-100 shadow-sm p-6">
                    <h3 class="text-sm font-bold text-red-600 mb-2 flex items-center gap-2">
                        <Icon icon="ph:warning-circle" class="text-lg" />
                        {{ t('participant.edit.kick.title') }}
                    </h3>
                    <p class="text-[10px] text-red-500/80 mb-4 leading-relaxed font-bold">
                        {{ t('participant.edit.kick.description') }}
                    </p>
                    <BaseButton variant="danger" block icon="ph:user-minus"
                        class="h-10 text-xs shadow-lg shadow-red-200"
                        @click="isSubscriptionActive ? handleKickUser() : (showPremiumModal = true)"
                        :loading="isKicking"
                        :class="{ 'opacity-50 grayscale cursor-not-allowed': !isSubscriptionActive }">
                        {{ t('participant.edit.kick.button') }}
                    </BaseButton>
                </div>
            </div>
        </form>

        <!-- Error State -->
        <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Icon icon="ph:warning-circle" class="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-bold text-navy mb-2">{{ t('participant.detail.not_found_title') }}</h3>
            <p class="text-gray-500 mb-4">{{ t('participant.detail.not_found_message') }}</p>
            <BaseButton variant="primary" :to="`/dashboard/events/${route.params.id}/participants`">
                {{ t('participant.detail.back_to_list') }}
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { useToast } from '~/composables/useToast'
import { definePageMeta } from '#imports'

definePageMeta({
    layout: 'dashboard'
})

const route = useRoute()
const router = useRouter()
const { get, put } = useApi()
const { isSubscriptionActive } = useSubscription()
const toast = useToast()
import PremiumRequiredModal from '~/components/common/PremiumRequiredModal.vue'
import { useSubscription } from '~/composables/useSubscription'

const eventId = route.params.id
const participantId = route.params.participantId
const isLoading = ref(true)
const participant = ref(null)
const event = ref(null)
const categories = ref([])
const clubs = ref([])
const showPremiumModal = ref(false)
const isSubmitting = ref(false)
const isKicking = ref(false)

const { t } = useI18n()

const statusOptions = [
    { title: 'Paid', value: 'paid', icon: 'ph:check-circle' },
    { title: 'Pending', value: 'pending', icon: 'ph:hourglass' },
    { title: 'Unpaid', value: 'unpaid', icon: 'ph:hourglass' }
]

const form = reactive({
    category_id: '',
    status: 'unpaid',
    payment_amount: 0
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
            form.category_id = found.category_id
            form.status = found.status || found.payment_status || 'unpaid'
            form.payment_amount = found.payment_amount || 0
        }

        // Fetch event details and categories
        const [eventRes, categoriesRes] = await Promise.all([
            get(`/events/${eventId}`),
            get(`/events/${eventId}/categories`)
        ])
        event.value = eventRes
        if (categoriesRes && categoriesRes.events) {
            categories.value = categoriesRes.events.map(cat => ({
                id: cat.id,
                label: formatCategoryName(cat),
                description: `${cat.event_type_name || ''} ${cat.gender_division_name ? '(' + cat.gender_division_name + ')' : ''}`.trim()
            }))
        }

        // Fetch clubs
        const clubsRes = await get('/clubs?limit=1000')
        clubs.value = clubsRes.clubs || []
    } catch (error) {
        console.error('Failed to fetch participant:', error)
            const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || t('participant.detail.toast.load_failed')
            toast.error(errorMessage)
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
    ].filter(Boolean).join(' - ') || 'Kategori'
}

const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD'
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}

const handleSubmit = async () => {
    if (!form.category_id) {
        toast.error(t('participant.edit.errors.select_category'))
        return
    }

    isSubmitting.value = true
    try {
        // Update participant via API
        const payload = {
            category_id: form.category_id,
            status: form.status,
            payment_amount: form.payment_amount || 0
        }

        // Use stable UUID if available, otherwise fallback to route param
        const targetId = participant.value?.id || participantId
        await put(`/events/${eventId}/participants/${targetId}`, payload)
        toast.success(t('participant.detail.toast.update_success'))
        router.push(`/dashboard/events/${eventId}/participants/${targetId}`)
    } catch (error) {
        console.error('Failed to update participant:', error)
        const errorMessage = error?.data?.error || error?.response?.data?.error || error?.message || t('participant.detail.toast.update_failed')
        toast.error(errorMessage)
    } finally {
        isSubmitting.value = false
    }
}

const handleKickUser = async () => {
    if (!confirm(t('participant.edit.kick.confirm_message'))) {
        return
    }

    isKicking.value = true
    try {
        const { delete: del } = useApi()
        await del(`/events/${eventId}/participants/${participantId}`)
        toast.success(t('participant.detail.toast.kick_success'))
        router.push(`/dashboard/events/${eventId}/participants`)
    } catch (error) {
        console.error('Failed to kick user:', error)
        toast.error(error.response?.data?.error || t('participant.detail.toast.kick_failed'))
    } finally {
        isKicking.value = false
    }
}

onMounted(() => {
    if (!isSubscriptionActive.value) {
        toast.error(t('participant.edit.subscription_expired'))
        router.replace(`/dashboard/events/${route.params.id}/participants/${route.params.participantId}`)
        return
    }
    fetchParticipant()
})
</script>
